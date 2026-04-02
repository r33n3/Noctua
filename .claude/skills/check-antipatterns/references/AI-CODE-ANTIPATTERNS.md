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

## QUICK REFERENCE

| # | Pattern | Layer | Severity |
|---|---|---|---|
| 1.1 | Silent error swallowing | L1 | CRITICAL |
| 1.2 | Race conditions (async) | L1 | HIGH |
| 1.3 | Naive retry logic | L1 | HIGH |
| 1.4 | State assumptions | L1 | MEDIUM |
| 1.5 | Floating point comparison | L1 | LOW |
| 1.6 | Encoding assumptions | L1 | MEDIUM |
| 2.1 | Connection pool exhaustion | L2 | CRITICAL |
| 2.2 | Missing idempotency | L2 | CRITICAL |
| 2.3 | Unbounded collections | L2 | HIGH |
| 2.4 | Multi-instance blindness | L2 | HIGH |
| 2.5 | Circuit breaker absence | L2 | HIGH |
| 2.6 | No graceful degradation | L2 | MEDIUM |
| 2.7 | Schema evolution blindness | L2 | MEDIUM |
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

---

*AgentSecForge · AI Code Anti-Patterns Reference · v1.0 · March 2026*
