# AI Code Anti-Patterns: What Breaks in Production
# AgentSecForge Reference Document

> **Purpose:** Bookmark this. Reference it every time you build, review, or red team.
> **Usage:** Each pattern has: what it is, why AI generates it, what breaks, security impact, detection, fix.
> **Skill:** Run `/check-antipatterns` to audit your code against all patterns automatically.
> **Defense layers:** L1 = Code Quality, L2 = Architecture, L3 = Operations, L4 = Security

---

## LAYER 1 — CODE QUALITY

These patterns look correct in isolation. They break under production load,
production duration, or production edge cases.

---

### 1.1 Silent Error Swallowing

**What it is:** try/except catches everything and returns a default value or logs nothing.

```python
# ❌ AI-generated pattern
def lookup_cve(cve_id: str) -> dict:
    try:
        response = requests.get(f"https://nvd.nist.gov/api/cves/{cve_id}")
        return response.json()
    except Exception:
        return {}  # Looks like "no results found"
```

**Why AI generates it:** AI prioritizes "never crash" over "fail informatively."
It treats exceptions as problems to suppress rather than signals to propagate.

**What breaks:** The agent receives `{}` and concludes "no CVEs found."
In reality, the NVD API returned a 429 (rate limited), a 500 (server error),
or a network timeout. The agent makes a security determination — "system is
clean" — based on an error it never saw.

**Security impact:** FALSE NEGATIVE. The security tool reports "no vulnerabilities"
when it actually failed to check. This is worse than crashing — crashing is
visible, a false negative is invisible.

**Detection:**
```
grep -rn "except.*:" --include="*.py" | grep -v "except.*Error"
# Find bare except clauses or overly broad exception handlers
# Then check: does the except block log the error? Return an error indicator?
```

**Fix:**
```python
# ✅ Fixed
def lookup_cve(cve_id: str) -> dict:
    try:
        response = requests.get(f"https://nvd.nist.gov/api/cves/{cve_id}")
        response.raise_for_status()
        return {"data": response.json(), "error": None}
    except requests.exceptions.HTTPError as e:
        logger.error("cve_lookup_failed", extra={"cve_id": cve_id, "status": e.response.status_code})
        return {"data": None, "error": f"HTTP {e.response.status_code}", "is_error": True, "retryable": e.response.status_code in (429, 500, 502, 503)}
    except requests.exceptions.ConnectionError as e:
        logger.error("cve_lookup_connection_failed", extra={"cve_id": cve_id, "error": str(e)})
        return {"data": None, "error": "connection_failed", "is_error": True, "retryable": True}
```

**Course connection:** isError pattern (Update 42), MCP error handling (Week 3-4).

---

### 1.2 Race Conditions in Async Flows

**What it is:** Multiple async operations read-modify-write shared state without synchronization.

```python
# ❌ AI-generated pattern
findings = []  # Shared mutable state

async def process_alert(alert):
    existing = [f for f in findings if f["alert_id"] == alert["id"]]
    if not existing:
        result = await analyze(alert)
        findings.append(result)  # Another coroutine may have appended between check and append
```

**Why AI generates it:** AI writes correct single-threaded code and adds `async`
without rethinking data access patterns. It treats concurrency as a syntax change
(`def` → `async def`) rather than an architectural change.

**What breaks:** Two alerts arrive simultaneously. Both check `findings` and
see the alert doesn't exist. Both analyze it. Both append. You get duplicate
findings. Or worse: one coroutine reads the list while another is mid-append,
and you get a corrupted data structure.

**Security impact:** Duplicate findings cause alert fatigue. Missing findings
(if the race causes a lost write) mean threats go undetected. In incident
response, duplicate automated actions on the same host can cause cascading
failures.

**Detection:**
```
# Look for shared mutable state in async code
grep -rn "async def" --include="*.py" | xargs -I{} grep -l "\.append\|\.update\|\[\].*=" {}
# Look for global or module-level mutable collections used in async functions
```

**Fix:**
```python
# ✅ Fixed — use asyncio.Lock for shared state
import asyncio

findings_lock = asyncio.Lock()
findings = []

async def process_alert(alert):
    async with findings_lock:
        existing = [f for f in findings if f["alert_id"] == alert["id"]]
        if not existing:
            result = await analyze(alert)
            findings.append(result)
```

Or better: use a database with proper constraints instead of in-memory state.

**Course connection:** Multi-agent architecture (Week 9), worktree isolation (Update 41).

---

### 1.3 Naive Retry Logic

**What it is:** Retries on failure with no backoff, no jitter, no cap.

```python
# ❌ AI-generated pattern
def call_threat_intel(indicator):
    for i in range(10):
        try:
            return requests.get(f"https://api.threatintel.com/lookup/{indicator}")
        except Exception:
            time.sleep(1)  # Fixed 1-second delay, 10 retries
    return None  # Silent failure after exhaustion (see 1.1)
```

**Why AI generates it:** AI knows retries are good practice but defaults to
the simplest implementation. It doesn't model the downstream impact of
retry storms on the target service.

**What breaks:** The API returns 429 (rate limited). Ten retries at 1-second
intervals hammer the API 10 more times in 10 seconds. If 100 agents do this
simultaneously, the API receives 1,000 requests in 10 seconds. The API bans
your IP. Your entire security operation loses access to threat intelligence
for 24 hours — during an active incident.

**Security impact:** Self-inflicted denial of service on your own data sources.
Loss of threat intelligence during the exact moment you need it most.

**Detection:**
```
grep -rn "sleep\|retry\|for.*range.*try" --include="*.py"
# Check: is there exponential backoff? Jitter? A reasonable max_retries?
# Check: does it respect Retry-After headers?
```

**Fix:**
```python
# ✅ Fixed — exponential backoff with jitter and cap
import random
import time

def call_threat_intel(indicator, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.get(f"https://api.threatintel.com/lookup/{indicator}")
            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 2 ** attempt))
                jitter = random.uniform(0, retry_after * 0.1)
                time.sleep(retry_after + jitter)
                continue
            response.raise_for_status()
            return {"data": response.json(), "error": None}
        except requests.exceptions.ConnectionError:
            wait = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait)
    return {"data": None, "error": "max_retries_exceeded", "is_error": True, "retryable": False}
```

**Course connection:** Failure cap governance (Update 36), MCP server resilience (Week 3-4).

---

### 1.4 State Assumptions (Clean Slate Bias)

**What it is:** AI assumes a clean starting environment — empty database, consistent
formats, no legacy data, no previous runs.

```python
# ❌ AI-generated pattern
def parse_log_entry(line: str) -> dict:
    # Assumes format: "2026-03-24T10:52:00Z | WARN | Connection timeout"
    timestamp, level, message = line.split(" | ")
    return {"timestamp": timestamp, "level": level, "message": message}
```

**Why AI generates it:** AI generates code from the spec description, which
describes the ideal format. It has no knowledge of the 3 years of format
changes, encoding variations, corrupted entries, and edge cases that exist
in the actual production data.

**What breaks:** Production logs contain:
- Pre-2024 format: `2023-11-15 10:30:00 WARN Connection timeout` (no pipes)
- Multiline stack traces that span 50 lines
- Binary data from network captures embedded in log entries
- Windows-1252 encoded entries mixed with UTF-8
- Empty lines, partial writes from crashes, truncated entries

The parser crashes on the first non-conforming line. Or worse: it silently
misparses, putting the severity level in the message field.

**Security impact:** Log analysis is the foundation of incident detection.
A parser that crashes on dirty data means you can't analyze logs during an
incident — exactly when log analysis matters most.

**Detection:**
```
# Look for rigid parsing without error handling
grep -rn "\.split\|\.strip\|int(\|float(" --include="*.py"
# Check: what happens when the format doesn't match?
# Check: is there a fallback for unknown formats?
```

**Fix:**
```python
# ✅ Fixed — defensive parsing with format detection
import re
from typing import Optional

LOG_PATTERNS = [
    re.compile(r"^(?P<ts>\d{4}-\d{2}-\d{2}T[\d:.]+Z?) \| (?P<level>\w+) \| (?P<msg>.+)$"),  # Current format
    re.compile(r"^(?P<ts>\d{4}-\d{2}-\d{2} [\d:]+) (?P<level>\w+) (?P<msg>.+)$"),  # Pre-2024
    re.compile(r"^(?P<ts>[A-Z][a-z]{2} \d+ [\d:]+) (?P<level>\w+) (?P<msg>.+)$"),  # Syslog
]

def parse_log_entry(line: str) -> Optional[dict]:
    line = line.strip()
    if not line:
        return None
    for pattern in LOG_PATTERNS:
        match = pattern.match(line)
        if match:
            return match.groupdict()
    logger.warning("unparseable_log_entry", extra={"line_preview": line[:100]})
    return {"ts": None, "level": "UNKNOWN", "msg": line, "parse_failed": True}
```

**Course connection:** Break Everything (Week 7), context engineering (Week 2).

---

### 1.5 Floating Point Comparison

**What it is:** Using `==` to compare floating point numbers, especially for thresholds.

```python
# ❌ AI-generated pattern
if risk_score == 8.0:
    severity = "HIGH"
```

**Why AI generates it:** AI treats numbers as mathematical objects, not
IEEE 754 representations. It doesn't model floating point arithmetic errors.

**What breaks:** `risk_score` is computed as `3.5 + 4.5` which equals `8.0`
exactly. But `2.1 + 5.9` might equal `7.999999999999999` or `8.000000000000001`
depending on the computation path. Threshold checks fail silently.

**Security impact:** Findings at the boundary between HIGH and MEDIUM are
classified incorrectly. Inconsistent severity classification across identical
threats.

**Fix:**
```python
# ✅ Fixed — threshold comparison, not equality
if risk_score >= 8.0:
    severity = "HIGH"
elif risk_score >= 5.0:
    severity = "MEDIUM"
# Or use decimal.Decimal for financial/scoring calculations
```

---

### 1.6 Encoding Assumptions

**What it is:** Assuming all text is UTF-8.

```python
# ❌ AI-generated pattern
with open(log_file, "r") as f:  # Assumes UTF-8
    for line in f:
        process(line)
```

**What breaks:** First Latin-1 or Windows-1252 byte throws `UnicodeDecodeError`.
Network capture data containing raw bytes crashes the parser entirely.

**Fix:**
```python
# ✅ Fixed — detect encoding, handle failures
import chardet

def read_log_file(path: str):
    raw = open(path, "rb").read(10000)
    detected = chardet.detect(raw)
    encoding = detected["encoding"] or "utf-8"
    with open(path, "r", encoding=encoding, errors="replace") as f:
        for line in f:
            yield line
```

---

## LAYER 2 — ARCHITECTURE

These patterns require thinking beyond individual functions — about multiple
instances, long-running processes, and system-level behavior.

---

### 2.1 Connection Pool Exhaustion

**What it is:** Creating a new database or HTTP connection for every request.

```python
# ❌ AI-generated pattern
def query_siem(query: str) -> list:
    conn = psycopg2.connect(host="siem-db", dbname="events")  # New connection every call
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    return results
```

**Why AI generates it:** AI writes each function as self-contained. It doesn't
model resource lifecycle across the application.

**What breaks:** PostgreSQL default max connections is 100. At 50 requests/second,
you exhaust connections in 2 seconds. Every subsequent request blocks waiting for a
connection. Your security tool hangs. Your SIEM queries stop. Alerts pile up
unprocessed.

**Security impact:** Security operations go dark during load spikes — which
correlate with active incidents (more alerts = more queries = connection exhaustion
precisely when you need the system most).

**Fix:**
```python
# ✅ Fixed — connection pool
from psycopg2 import pool

db_pool = pool.ThreadedConnectionPool(
    minconn=5,
    maxconn=20,
    host="siem-db",
    dbname="events"
)

def query_siem(query: str) -> list:
    conn = db_pool.getconn()
    try:
        cursor = conn.cursor()
        cursor.execute(query)
        return cursor.fetchall()
    finally:
        db_pool.putconn(conn)  # Return to pool, don't close
```

---

### 2.2 Missing Idempotency

**What it is:** Operations that produce duplicate side effects when executed more than once.

```python
# ❌ AI-generated pattern
@app.post("/webhook/alert")
async def handle_alert_webhook(alert: dict):
    finding = create_finding(alert)          # Creates a new finding every time
    await send_notification(finding)          # Sends a notification every time
    await trigger_response(finding)           # Triggers response every time
    return {"status": "processed"}
```

**Why AI generates it:** AI implements the happy path: webhook fires, we process it.
It doesn't model that webhooks fire multiple times by design (at-least-once delivery),
that network issues cause retries, that load balancers can replay requests.

**What breaks:** Webhook fires twice (normal behavior for most webhook providers).
Two findings created, two notifications sent, two response workflows triggered
for the same alert. In payment systems: double charges. In security: duplicate
containment actions on the same host can cause cascading failures.

**Security impact:** Alert fatigue from duplicate findings. Duplicate automated
responses that conflict with each other. Loss of trust in the alerting system
("is this a real alert or a duplicate?").

**Detection:**
```
grep -rn "def.*webhook\|def.*handler\|@app.post\|@app.route" --include="*.py"
# For each handler: is there an idempotency check?
# Does it check "have I already processed this event ID?"
```

**Fix:**
```python
# ✅ Fixed — idempotency key
@app.post("/webhook/alert")
async def handle_alert_webhook(alert: dict):
    idempotency_key = f"{alert['source']}:{alert['alert_id']}"

    if await already_processed(idempotency_key):
        logger.info("duplicate_webhook", extra={"key": idempotency_key})
        return {"status": "already_processed"}

    async with idempotency_lock(idempotency_key):  # Prevent concurrent processing
        finding = create_finding(alert)
        await send_notification(finding)
        await trigger_response(finding)
        await mark_processed(idempotency_key, ttl=86400)  # 24hr dedup window

    return {"status": "processed"}
```

**Course connection:** Blueprint pattern (Update 36), Stripe Minions (Update 32).

---

### 2.3 Unbounded Queues and Collections

**What it is:** In-memory lists, dicts, or queues that grow without limit.

```python
# ❌ AI-generated pattern
processed_alerts = []  # Grows forever

async def process_pipeline():
    async for alert in alert_stream:
        result = await analyze(alert)
        processed_alerts.append(result)  # Never evicted
```

**Why AI generates it:** AI doesn't think in terms of runtime duration. Code that
runs for 20 minutes in testing runs for 20 months in production.

**What breaks:** At 1,000 alerts/hour, after 48 hours you have 48,000 entries.
After a month, 720,000. Each entry is a dict with nested data. Memory grows
until OOM kills the process. The process restarts, the list is empty, and
you've lost all accumulated state.

**Fix:**
```python
# ✅ Fixed — bounded collection with eviction
from collections import deque

processed_alerts = deque(maxlen=10000)  # Automatically evicts oldest

# Or for deduplication with TTL:
import time

class TTLCache:
    def __init__(self, ttl_seconds=3600):
        self.cache = {}
        self.ttl = ttl_seconds

    def add(self, key, value):
        self.cache[key] = (value, time.time())
        self._evict()

    def _evict(self):
        now = time.time()
        self.cache = {k: (v, t) for k, (v, t) in self.cache.items() if now - t < self.ttl}
```

---

### 2.4 Missing Distributed Locks (Multi-Instance Blindness)

**What it is:** AI writes code for a single process. In production, multiple
instances run behind a load balancer.

**Why AI generates it:** AI has no concept of "another copy of me is running."
It writes singleton patterns, uses in-memory state, and assumes it's the only
process accessing shared resources.

**What breaks:** Two instances of your security scanner both pick up the same
alert from the queue. Both process it. Both write findings. Both trigger
response. Double the work, double the side effects, half the throughput
(both instances wasted time on the same alert instead of processing two different ones).

**Fix:** Use a distributed lock (Redis, database advisory lock) or a message
queue with proper acknowledgment (the message is removed from the queue only
after successful processing, and only one consumer gets it).

---

### 2.5 Circuit Breaker Absence

**What it is:** No mechanism to stop calling a failing dependency.

```python
# ❌ AI-generated pattern — retries forever against a dead service
def get_threat_intel(indicator):
    while True:
        try:
            return requests.get(f"https://threatintel.api/lookup/{indicator}", timeout=5)
        except Exception:
            time.sleep(2)  # Will retry forever against a dead API
```

**What breaks:** The threat intel API is down for maintenance. Your security
tool retries every 2 seconds. 100 agents × 0.5 requests/second = 50 requests/second
hitting a dead endpoint. When the API comes back, it's immediately overwhelmed
by the retry storm from all your agents.

**Fix:**
```python
# ✅ Fixed — circuit breaker pattern
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failures = 0
        self.threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.last_failure = 0
        self.state = "closed"  # closed=normal, open=blocking, half-open=testing

    def call(self, func, *args, **kwargs):
        if self.state == "open":
            if time.time() - self.last_failure > self.reset_timeout:
                self.state = "half-open"  # Try one request
            else:
                raise CircuitOpenError("Dependency unavailable, circuit open")

        try:
            result = func(*args, **kwargs)
            if self.state == "half-open":
                self.state = "closed"
                self.failures = 0
            return result
        except Exception as e:
            self.failures += 1
            self.last_failure = time.time()
            if self.failures >= self.threshold:
                self.state = "open"
                logger.warning("circuit_opened", extra={"failures": self.failures})
            raise

threat_intel_breaker = CircuitBreaker(failure_threshold=5, reset_timeout=60)
```

**Course connection:** Failure cap governance (Update 36), graceful degradation.

---

### 2.6 No Graceful Degradation

**What it is:** When a dependency fails, the entire pipeline stops instead of
continuing with reduced capability.

**Why AI generates it:** AI builds the happy path. If step 3 of 5 fails,
AI lets the exception propagate and the whole pipeline dies.

**What a senior architect builds:**
```python
# ✅ Graceful degradation
async def enrich_alert(alert: dict) -> dict:
    alert["enrichment"] = {}

    # CVE enrichment — non-critical, continue without it
    try:
        alert["enrichment"]["cve"] = await lookup_cve(alert)
    except CircuitOpenError:
        alert["enrichment"]["cve"] = None
        alert["enrichment_gaps"] = alert.get("enrichment_gaps", []) + ["cve_unavailable"]
        logger.warning("enrichment_degraded", extra={"gap": "cve", "alert_id": alert["id"]})

    # Threat intel — non-critical, continue without it
    try:
        alert["enrichment"]["threat_intel"] = await get_threat_intel(alert)
    except CircuitOpenError:
        alert["enrichment"]["threat_intel"] = None
        alert["enrichment_gaps"] = alert.get("enrichment_gaps", []) + ["threat_intel_unavailable"]

    # The alert still gets processed — just with less enrichment
    # The analyst sees "enrichment_gaps" and knows what's missing
    return alert
```

---

### 2.7 Schema Evolution Blindness

**What it is:** AI creates database schemas for v1 with no thought for v2.

**Why AI misses it:** AI builds for the current requirements. It doesn't ask
"what happens when I add a field to a table with 10 million rows?" or "what
happens when the new code deploys to instance A but instance B is still running
the old code with the old schema?"

**What a senior architect requires:**
- Migration scripts (not just schema definitions)
- Backward-compatible schema changes (add columns, don't rename/remove)
- Default values for new columns (old code doesn't populate them)
- Application-level handling of missing fields

---

## LAYER 3 — OPERATIONS

These patterns determine whether you can run, monitor, debug, and maintain
the system in production.

---

### 3.1 Structured Logging Absence

**What it is:** Using string-formatted log messages instead of structured key-value logs.

```python
# ❌ AI-generated pattern
logger.info(f"Processing alert {alert_id} from {source} with severity {severity}")
```

**Why it breaks in production:** At 10,000 alerts/hour, you need to:
- Count alerts by source → impossible with string grep
- Find all CRITICAL alerts from the last hour → regex nightmare
- Calculate average processing time → can't parse from prose

**Fix:**
```python
# ✅ Structured logging
logger.info("alert_processing_started", extra={
    "alert_id": alert_id,
    "source": source,
    "severity": severity,
    "processing_stage": "triage",
    "trace_id": trace_id
})
```

Now you can query: `stage=triage AND severity=CRITICAL AND source=siem-01`

---

### 3.2 Missing Correlation IDs

**What it is:** No way to trace a single request through a multi-agent pipeline.

**What breaks:** An alert enters your pipeline. The triage agent logs "received alert."
The analysis agent logs "analyzing CVE-2026-1234." The reporting agent logs
"finding created." Three log entries with no shared identifier. When something
goes wrong, you can't reconstruct what happened to a specific alert.

**Fix:**
```python
# ✅ Generate trace_id at ingestion, propagate everywhere
import uuid

def ingest_alert(raw_alert: dict) -> dict:
    trace_id = str(uuid.uuid4())
    return {**raw_alert, "trace_id": trace_id}

# Every log entry includes trace_id
# Every tool call passes trace_id
# Every subagent receives trace_id in its context
# Every finding includes the trace_id that produced it
```

**Course connection:** OpenTelemetry in Strands (Update 45), delegation chain logging.

---

### 3.3 No Health Checks

**What it is:** No endpoint or mechanism for the orchestrator to verify the
service is actually working (not just not-crashed).

**What breaks:** The process is running. The container passes the "is the process
alive?" check. But the database connection pool is exhausted, so every request
hangs forever. Kubernetes keeps routing traffic to a zombie process.

**Fix:**
```python
# ✅ Health check that verifies dependencies
@app.get("/health")
async def health_check():
    checks = {}
    # Verify database connectivity
    try:
        await db.execute("SELECT 1")
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"failing: {str(e)}"

    # Verify threat intel API
    checks["threat_intel_circuit"] = threat_intel_breaker.state

    healthy = all(v == "ok" or v == "closed" for v in checks.values())
    return JSONResponse(
        status_code=200 if healthy else 503,
        content={"status": "healthy" if healthy else "degraded", "checks": checks}
    )
```

---

### 3.4 No Graceful Shutdown

**What it is:** Process doesn't handle SIGTERM. Kubernetes sends SIGTERM on
deployment rollout, waits 30 seconds, then kills the process.

**What breaks:** Your security tool is mid-way through processing an alert.
SIGTERM arrives. Process dies immediately. Alert is lost. No record it was
ever being processed. No handoff to another instance.

**Fix:**
```python
# ✅ Graceful shutdown
import signal
import asyncio

shutdown_event = asyncio.Event()

def handle_sigterm(signum, frame):
    logger.info("shutdown_initiated", extra={"signal": signum})
    shutdown_event.set()

signal.signal(signal.SIGTERM, handle_sigterm)

async def process_pipeline():
    while not shutdown_event.is_set():
        alert = await get_next_alert(timeout=5)
        if alert:
            await process_alert(alert)  # Finish current alert before shutting down
    logger.info("shutdown_complete", extra={"in_flight": 0})
```

---

### 3.5 Missing Metrics Emission

**What it is:** No application-level metrics. You can't answer "how many alerts
did we process in the last hour?" without grepping logs.

**Fix:** Emit counters, gauges, histograms at business-meaningful points:
```python
# ✅ Business metrics
from prometheus_client import Counter, Histogram

alerts_processed = Counter("alerts_processed_total", "Total alerts processed", ["severity", "source"])
processing_duration = Histogram("alert_processing_seconds", "Alert processing time", ["stage"])

async def process_alert(alert):
    with processing_duration.labels(stage="triage").time():
        result = await triage(alert)
    alerts_processed.labels(severity=result["severity"], source=alert["source"]).inc()
```

---

### 3.6 Deployment Compatibility Blindness

**What it is:** AI doesn't consider that during a rolling deployment, both the
old version and new version of your service are running simultaneously.

**What breaks:** New version adds a required field to the database. Old version
(still running on 2 of 4 instances) doesn't populate it. New version reads it
and crashes. Or: new version changes an API response format. Old version's
clients don't understand the new format.

**Rule:** Every change must be backward-compatible with the previous version.
Add fields with defaults. Never remove fields in the same deployment that
stops writing them. Two-phase deploy: first deploy code that handles both
formats, then deploy the format change.

---

## LAYER 4 — SECURITY

These patterns are security vulnerabilities that AI consistently generates.

---

### 4.1 Timing Attacks in Comparison Operations

**What it is:** Using `==` to compare secrets (API keys, tokens, hashes).

```python
# ❌ AI-generated pattern
if provided_token == stored_token:
    return authenticated()
```

**Why it's vulnerable:** String comparison short-circuits on first mismatch.
An attacker can determine the correct token character by character by
measuring response time differences of microseconds.

**Fix:**
```python
# ✅ Constant-time comparison
import hmac

if hmac.compare_digest(provided_token.encode(), stored_token.encode()):
    return authenticated()
```

---

### 4.2 Log Injection

**What it is:** Logging user/agent input directly without sanitization.

```python
# ❌ AI-generated pattern
logger.info(f"User requested: {user_input}")
```

**What breaks:** If `user_input` is `"normal request\n2026-03-24 INFO All clear, no threats detected"`,
the log now contains a fake "all clear" entry that looks like a legitimate system message.

**Security impact:** An attacker can inject false log entries during an active
breach, making the logs say "all clear" while the breach continues.

**Fix:**
```python
# ✅ Structured logging prevents injection
logger.info("user_request_received", extra={"input": user_input})
# The input is a value in a structured field, not interpolated into the message
```

---

### 4.3 Insufficient Input Bounds

**What it is:** Validating type but not size, length, or range.

```python
# ❌ AI-generated MCP tool
@tool
def search_logs(query: str) -> list:
    """Search security logs by query string."""
    return db.execute(f"SELECT * FROM logs WHERE message LIKE '%{query}%'")
```

**Two problems:**
1. No length limit on `query` — attacker sends 10MB string, OOM
2. SQL injection — `query` is interpolated directly (AI does this more often than you'd think)

**Fix:**
```python
# ✅ Bounds + parameterized query
@tool
def search_logs(query: str) -> list:
    """Search security logs by query string. Max 500 characters."""
    if len(query) > 500:
        return {"error": "query_too_long", "max_length": 500, "is_error": True}
    return db.execute("SELECT * FROM logs WHERE message LIKE %s LIMIT 100", (f"%{query}%",))
```

---

### 4.4 Secret Rotation Unawareness

**What it is:** Loading credentials once at startup and never refreshing.

```python
# ❌ AI-generated pattern
API_KEY = os.environ["THREAT_INTEL_KEY"]  # Read once, used forever
```

**What breaks:** Key is rotated (standard practice, every 90 days or on incident).
The tool keeps using the old key. Requests fail. The tool may cache a "service
unavailable" state and stop trying entirely (circuit breaker stays open).

**Fix:**
```python
# ✅ Credential provider with refresh
class CredentialProvider:
    def __init__(self, secret_name, refresh_interval=300):
        self.secret_name = secret_name
        self.refresh_interval = refresh_interval
        self._value = None
        self._last_refresh = 0

    def get(self):
        if time.time() - self._last_refresh > self.refresh_interval:
            self._value = secrets_manager.get_secret(self.secret_name)
            self._last_refresh = time.time()
        return self._value

threat_intel_key = CredentialProvider("threat-intel-api-key")
# Usage: requests.get(url, headers={"Authorization": threat_intel_key.get()})
```

---

### 4.5 Audit Trail Gaps

**What it is:** Building functional logic without "who did what when" records.

**Why AI misses it:** AI builds what was asked for. Nobody asks for audit trails —
they ask for the feature. But in security operations, every automated action
needs a record: what agent, what evidence, what action, when, what outcome.

**Course connection:** AIUC-1 Domain A (Accountability). The absence of audit
trails is the governance gap that `/audit-aiuc1` checks for.

**Fix:**
```python
# ✅ Audit every agent decision
async def process_finding(finding, agent_id, trace_id):
    audit_record = {
        "trace_id": trace_id,
        "agent_id": agent_id,
        "timestamp": datetime.utcnow().isoformat(),
        "action": "create_finding",
        "evidence": finding["evidence_ids"],
        "decision_basis": finding["reasoning"],
        "severity_assigned": finding["severity"],
        "model_used": finding["model"],
        "confidence": finding["confidence"],
    }
    await audit_log.write(audit_record)
    await findings_db.create(finding)
```

---

### 4.6 Invisible Failure States

**What it is:** The system appears healthy but produces wrong results.

**Examples:**
- Cache TTL never set → threat intel data is weeks old but looks current
- DNS resolution cached → target IP changed but scanner hits old IP
- Rate limiter reset time wrong → tool thinks it's rate-limited when it's not

**This is the hardest pattern to detect** because there are no errors, no crashes,
no alerts. The system "works." It just works wrong. Senior architects build
"known-good" test cases that verify the system produces correct results,
not just that it runs.

**Course connection:** Evaluator tuning (Update 46) — test for correct output,
not just successful execution.

---

## QUICK REFERENCE TABLE

| # | Pattern | Layer | Severity | Detection Difficulty |
|---|---|---|---|---|
| 1.1 | Silent error swallowing | L1 | CRITICAL | Easy (grep) |
| 1.2 | Race conditions (async) | L1 | HIGH | Medium (requires understanding data flow) |
| 1.3 | Naive retry logic | L1 | HIGH | Easy (grep) |
| 1.4 | State assumptions | L1 | MEDIUM | Hard (requires prod knowledge) |
| 1.5 | Floating point comparison | L1 | LOW | Easy (grep) |
| 1.6 | Encoding assumptions | L1 | MEDIUM | Easy (grep) |
| 2.1 | Connection pool exhaustion | L2 | CRITICAL | Medium (architecture review) |
| 2.2 | Missing idempotency | L2 | CRITICAL | Medium (handler review) |
| 2.3 | Unbounded collections | L2 | HIGH | Easy (grep for append/list) |
| 2.4 | Multi-instance blindness | L2 | HIGH | Hard (requires deployment context) |
| 2.5 | Circuit breaker absence | L2 | HIGH | Medium (check external calls) |
| 2.6 | No graceful degradation | L2 | MEDIUM | Hard (failure path analysis) |
| 2.7 | Schema evolution blindness | L2 | MEDIUM | Hard (requires migration review) |
| 3.1 | Unstructured logging | L3 | MEDIUM | Easy (grep for f-string logs) |
| 3.2 | Missing correlation IDs | L3 | HIGH | Medium (trace through pipeline) |
| 3.3 | No health checks | L3 | HIGH | Easy (check for /health endpoint) |
| 3.4 | No graceful shutdown | L3 | MEDIUM | Easy (grep for signal handlers) |
| 3.5 | Missing metrics | L3 | MEDIUM | Easy (check for metrics library) |
| 3.6 | Deployment compatibility | L3 | HIGH | Hard (requires release review) |
| 4.1 | Timing attacks | L4 | CRITICAL | Easy (grep for == on secrets) |
| 4.2 | Log injection | L4 | HIGH | Easy (grep for f-string logs with input) |
| 4.3 | Insufficient input bounds | L4 | HIGH | Medium (check all inputs) |
| 4.4 | Secret rotation | L4 | MEDIUM | Medium (check credential loading) |
| 4.5 | Audit trail gaps | L4 | HIGH | Medium (check for audit records) |
| 4.6 | Invisible failure states | L4 | CRITICAL | Hard (requires correctness tests) |

---

*AgentSecForge · AI Code Anti-Patterns Reference · v1.0 · March 2026*
*Run `/check-prod-readiness` to audit your codebase against these patterns.*
