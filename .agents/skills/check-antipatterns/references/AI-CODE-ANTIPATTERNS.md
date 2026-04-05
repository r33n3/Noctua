# AI Code Anti-Patterns: What Breaks in Production
# AgentSecForge Reference Document

> **Purpose:** Bookmark this. Reference it every time you build, review, or red team.
> **Usage:** Each pattern has: what it is, why AI generates it, what breaks, security impact, detection, fix.
> **Skill:** Run `/check-prod-readiness` to audit your code against all patterns automatically.
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

---

### 1.2 Race Conditions in Async Flows

**What it is:** Multiple async operations read-modify-write shared state without synchronization.

**Detection:** Look for shared mutable state (lists, dicts) accessed inside `async def` functions without asyncio.Lock.

**Fix:** Use `asyncio.Lock` for shared in-memory state. Better: use a database with proper constraints.

---

### 1.3 Naive Retry Logic

**What it is:** Retries on failure with no backoff, no jitter, no cap.

**Detection:** `grep -rn "sleep\|retry\|for.*range.*try" --include="*.py"`

**Fix:** Exponential backoff with jitter, cap at max_retries=3, respect Retry-After headers.

---

### 1.4 State Assumptions (Clean Slate Bias)

**What it is:** AI assumes clean environments — ideal formats, no legacy data.

**Fix:** Defensive parsing with format detection and fallback for unknown formats.

---

### 1.5 Floating Point Comparison

**What it is:** Using `==` to compare floats for thresholds.

**Fix:** Use `>=` / `<=` threshold comparisons, or `decimal.Decimal` for precision-critical math.

---

### 1.6 Encoding Assumptions

**What it is:** Assuming all text is UTF-8.

**Detection:** `grep -rn "open(.*\"r\"" --include="*.py" | grep -v "encoding"`

**Fix:** Detect encoding with `chardet`, open with `errors="replace"`.

---

### 1.7 Unbounded Agent Loops

**What it is:** Agent control loops (`while True`, recursive tool calls, agentic retry fans) with no explicit `max_turns`, `max_depth`, or iteration cap.

```python
# ❌ AI-generated pattern
async def run_agent(task):
    while not task.complete:
        result = await call_tool(task.next_step())
        task.update(result)
    return task
```

**Why AI generates it:** AI models the loop as "keep going until done" — the same logic that works in bounded human workflows. It doesn't model runaway API spend or adversarial inputs that keep the loop alive.

**What breaks:** Unbounded tool calls exhaust API quotas, trigger rate limits, and in agentic pipelines can loop indefinitely on malformed or adversarial inputs. Cost blowout is invisible until the bill arrives.

**Security impact:** RESOURCE EXHAUSTION. An attacker who controls tool output can keep the loop alive indefinitely. No `max_turns` = no blast radius limit.

**Detection:**
```bash
grep -rn "while.*not\|while True\|while task\|while loop" --include="*.py"
# For each: is there a counter with an explicit upper bound and assertion?
```

**Fix:**
```python
# ✅ Fixed
MAX_TURNS = 10

async def run_agent(task):
    for turn in range(MAX_TURNS):
        result = await call_tool(task.next_step())
        task.update(result)
        if task.complete:
            return task
    raise AgentLoopError(f"Task did not complete within {MAX_TURNS} turns", task_id=task.id)
```

---

### 1.8 Missing Defensive Assertions

**What it is:** Functions and tool handlers that accept inputs and proceed without asserting preconditions. No invariant checks at function entry or exit.

```python
# ❌ AI-generated pattern
def analyze_alert(alert: dict) -> dict:
    # Assumes alert has 'severity', 'source', 'timestamp' — always
    score = severity_weights[alert["severity"]] * source_trust[alert["source"]]
    return {"score": score, "timestamp": alert["timestamp"]}
```

**Why AI generates it:** AI generates "happy path" code. It models the expected input, not the space of possible inputs. Assertions feel like clutter.

**What breaks:** A missing key raises `KeyError` deep in the call chain with no context. A wrong type silently produces a wrong result. Tool output from a prior agent step that contains an error propagates as valid data.

**Security impact:** FALSE RESULTS. In a security pipeline, an unasserted assumption means a malformed alert, a poisoned RAG result, or a truncated API response is processed as if it were valid. The system reports a conclusion it cannot actually support.

**Detection:**
```bash
# Functions with no assert statements
grep -rn "^def \|^async def " --include="*.py" -l | xargs grep -L "assert"
```

**Fix:**
```python
# ✅ Fixed
def analyze_alert(alert: dict) -> dict:
    assert isinstance(alert, dict), f"Expected dict, got {type(alert)}"
    assert "severity" in alert, f"Missing required field 'severity': {alert.keys()}"
    assert "source" in alert, f"Missing required field 'source': {alert.keys()}"
    assert alert["severity"] in severity_weights, f"Unknown severity: {alert['severity']}"
    score = severity_weights[alert["severity"]] * source_trust.get(alert["source"], 0.5)
    assert 0.0 <= score <= 1.0, f"Score out of bounds: {score}"
    return {"score": score, "timestamp": alert.get("timestamp", time.time())}
```

---

## LAYER 2 — ARCHITECTURE

---

### 2.1 Connection Pool Exhaustion

**What it is:** New DB/HTTP connection per request.

**Detection:** `grep -rn "psycopg2.connect\|requests.get\|httpx.get" --include="*.py"` — is it inside a function with no pool?

**Fix:** Use connection pools (psycopg2.pool, httpx.Client as singleton).

---

### 2.2 Missing Idempotency

**What it is:** Webhook handlers that create side effects on every call.

**Detection:** `grep -rn "@app.post\|def.*webhook" --include="*.py"` — does each have an idempotency check?

**Fix:** Check idempotency key before processing. Use distributed lock + mark_processed with TTL.

---

### 2.3 Unbounded Queues and Collections

**What it is:** In-memory lists that grow forever.

**Detection:** `grep -rn "\.append\|= \[\]" --include="*.py"` — is the collection bounded?

**Fix:** Use `collections.deque(maxlen=N)` or TTLCache.

---

### 2.4 Missing Distributed Locks (Multi-Instance Blindness)

**What it is:** Code assumes it's the only running instance.

**Fix:** Use Redis distributed locks or message queues with proper acknowledgment.

---

### 2.5 Circuit Breaker Absence

**What it is:** No mechanism to stop calling failing dependencies.

**Fix:** Implement CircuitBreaker (closed → open → half-open) with failure threshold and reset timeout.

---

### 2.6 No Graceful Degradation

**What it is:** Entire pipeline fails when one dependency fails.

**Fix:** Wrap non-critical enrichment in try/except, track enrichment_gaps, continue processing.

---

### 2.7 Schema Evolution Blindness

**What it is:** No migration strategy for database schema changes.

**Fix:** Migration scripts, backward-compatible changes, default values for new columns.

---

### 2.8 Global State in Tool Scope

**What it is:** Module-level mutable objects (dicts, lists, counters) in MCP server or tool handler files, shared silently across all requests.

```python
# ❌ AI-generated pattern
# mcp_server.py
alert_cache = {}          # shared across all requests
active_sessions = []      # grows forever
request_count = 0         # race condition under concurrency

@tool
def get_alert(alert_id: str) -> dict:
    alert_cache[alert_id] = fetch(alert_id)   # writes to global
    return alert_cache[alert_id]
```

**Why AI generates it:** AI generates the simplest state management that works in a single-request test. Module-level variables are the path of least resistance in Python.

**What breaks:** Under concurrency, two requests race on the same dict. In multi-instance deploys, each instance has its own copy — no shared truth. `alert_cache` grows without bound (see 2.3). A test that clears module state between runs passes; production does not clear state between requests.

**Security impact:** DATA LEAKAGE between requests. One tenant's data visible in another's response. Audit log counters drift. Cache poisoning via one malicious request affects all subsequent callers.

**Detection:**
```bash
# Module-level mutable assignments (not constants)
grep -n "^[a-z_].*= \[\]\|^[a-z_].*= {}\|^[a-z_].*= 0" --include="*.py" -r
# For each: is it inside a function/class, or at module scope?
```

**Fix:**
```python
# ✅ Fixed — state lives in a class, injected via dependency
class AlertService:
    def __init__(self):
        self._cache: dict[str, dict] = {}
        self._lock = asyncio.Lock()

    async def get_alert(self, alert_id: str) -> dict:
        async with self._lock:
            if alert_id not in self._cache:
                self._cache[alert_id] = await fetch(alert_id)
            return self._cache[alert_id]
```

---

## LAYER 3 — OPERATIONS

---

### 3.1 Structured Logging Absence

**Detection:** `grep -rn "logger.*f\"\|logging.*f\"" --include="*.py"`

**Fix:** `logger.info("event_name", extra={"key": value})` — never interpolate into the message string.

---

### 3.2 Missing Correlation IDs

**Fix:** Generate `trace_id = uuid4()` at ingestion. Pass through every agent, tool call, and log entry.

---

### 3.3 No Health Checks

**Fix:** `/health` endpoint that executes real dependency checks (SELECT 1, circuit state) and returns 503 when degraded.

---

### 3.4 No Graceful Shutdown

**Detection:** `grep -rn "signal.signal\|SIGTERM" --include="*.py"`

**Fix:** Handle SIGTERM with asyncio.Event. Finish in-flight work before exiting.

---

### 3.5 Missing Metrics Emission

**Fix:** Emit Prometheus counters, histograms at business-meaningful points (alert_processed, processing_duration).

---

### 3.6 Deployment Compatibility Blindness

**Fix:** Every change backward-compatible with previous version. Two-phase deploys for breaking changes.

---

## LAYER 4 — SECURITY

---

### 4.1 Timing Attacks in Comparison Operations

**Detection:** `grep -rn "==.*key\|==.*token\|==.*secret\|==.*password" --include="*.py"`

**Fix:** `hmac.compare_digest(a.encode(), b.encode())`

---

### 4.2 Log Injection

**Detection:** `grep -rn "logger.*f\"\|logging.*f\"\|print(f\"" --include="*.py"`

**Fix:** Use structured logging — user input is a field value, not interpolated into the message.

---

### 4.3 Insufficient Input Bounds

**Detection:** Check every `@tool`, `@app.post` handler for length/size validation.

**Fix:** Validate length before processing. Use parameterized queries (never string interpolation in SQL).

---

### 4.4 Secret Rotation Unawareness

**Detection:** `grep -rn "os.environ\[.*KEY\|os.environ\[.*SECRET" --include="*.py"` — is it read at startup only?

**Fix:** CredentialProvider class with refresh_interval. Never cache for the lifetime of the process.

---

### 4.5 Audit Trail Gaps

**Fix:** Every automated decision logged with: trace_id, agent_id, timestamp, action, evidence, decision_basis, outcome.

---

### 4.6 Invisible Failure States

**Fix:** Build known-good test cases that verify correct output, not just successful execution (evaluator pattern).

---

### 4.7 Dynamic Code Execution

**What it is:** Use of `eval`, `exec`, `compile`, or dynamic `__import__` inside tool handlers or agent pipelines, often to enable "flexible" tool dispatch or template execution.

```python
# ❌ AI-generated pattern
@tool
def run_analysis(query: str) -> str:
    # "Flexible" query execution
    result = eval(query)
    return str(result)
```

**Why AI generates it:** AI optimizes for flexibility. `eval` is the shortest path to "execute arbitrary logic." The model doesn't account for who controls the input.

**What breaks:** Any caller — including an adversarial agent, a prompt-injected tool result, or a poisoned RAG document — can execute arbitrary Python in the server process. One unsanitized input = remote code execution with the server's permissions.

**Security impact:** CRITICAL / RCE. In an MCP server running with filesystem or network access, this is a full system compromise. There is no safe use of `eval`/`exec` on untrusted input.

**Detection:**
```bash
# Direct dynamic execution
grep -rn "\beval(\|\bexec(\|compile(" --include="*.py"

# Dynamic imports
grep -rn "__import__\|importlib.import_module" --include="*.py"

# Jinja/template rendering of user input
grep -rn "render_template_string\|Template(" --include="*.py"
```

**Fix:** Replace dynamic dispatch with an explicit allowlist:
```python
# ✅ Fixed
ALLOWED_ANALYSES = {
    "count_critical": count_critical_alerts,
    "summarize": summarize_alerts,
    "trend": trend_analysis,
}

@tool
def run_analysis(query: str) -> str:
    handler = ALLOWED_ANALYSES.get(query)
    if handler is None:
        raise ValueError(f"Unknown analysis '{query}'. Allowed: {list(ALLOWED_ANALYSES)}")
    return str(handler())
```

---

## QUICK REFERENCE

| # | Pattern | Layer | Severity |
|---|---|---|---|
| 1.1 | Silent error swallowing | L1 | CRITICAL |
| 1.2 | Race conditions (async) | L1 | HIGH |
| 1.3 | Naive retry logic | L1 | HIGH |
| 1.4 | State assumptions | L1 | MEDIUM |
| 1.5 | Floating point comparison | L1 | LOW |
| 1.6 | Encoding assumptions | L1 | MEDIUM |
| 1.7 | Unbounded agent loops | L1 | CRITICAL |
| 1.8 | Missing defensive assertions | L1 | HIGH |
| 2.1 | Connection pool exhaustion | L2 | CRITICAL |
| 2.2 | Missing idempotency | L2 | CRITICAL |
| 2.3 | Unbounded collections | L2 | HIGH |
| 2.4 | Multi-instance blindness | L2 | HIGH |
| 2.5 | Circuit breaker absence | L2 | HIGH |
| 2.6 | No graceful degradation | L2 | MEDIUM |
| 2.7 | Schema evolution blindness | L2 | MEDIUM |
| 2.8 | Global state in tool scope | L2 | HIGH |
| 3.1 | Unstructured logging | L3 | MEDIUM |
| 3.2 | Missing correlation IDs | L3 | HIGH |
| 3.3 | No health checks | L3 | HIGH |
| 3.4 | No graceful shutdown | L3 | MEDIUM |
| 3.5 | Missing metrics | L3 | MEDIUM |
| 3.6 | Deployment compatibility | L3 | HIGH |
| 4.1 | Timing attacks | L4 | CRITICAL |
| 4.2 | Log injection | L4 | HIGH |
| 4.3 | Insufficient input bounds | L4 | HIGH |
| 4.4 | Secret rotation | L4 | MEDIUM |
| 4.5 | Audit trail gaps | L4 | HIGH |
| 4.6 | Invisible failure states | L4 | CRITICAL |
| 4.7 | Dynamic code execution (eval/exec) | L4 | CRITICAL |

---

*AgentSecForge · AI Code Anti-Patterns Reference · v1.0 · March 2026*
