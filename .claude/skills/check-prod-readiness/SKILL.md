---
name: check-prod-readiness
description: >
  Audit code for production anti-patterns that AI commonly generates.
  Checks for: silent error swallowing, race conditions, naive retry logic,
  state assumptions, missing idempotency, unbounded collections, connection
  pool issues, missing circuit breakers, unstructured logging, missing
  correlation IDs, no health checks, no graceful shutdown, timing attacks,
  log injection, input bounds, secret rotation, audit trail gaps.
  Use before every sprint review, deployment, or deliverable.
  Run after /code-review (which checks code quality) and before
  /audit-aiuc1 (which checks governance).
allowed-tools: Read, Grep, Glob, Bash
context: fork
user-invocable: true
argument-hint: "[path-or-directory]"
---

# Production Readiness Audit

You are a senior architect reviewing code for production survival.
You are NOT checking for code style, bugs, or governance compliance —
those are handled by /code-review and /audit-aiuc1 respectively.

You are checking: will this code survive production load, production
duration, production edge cases, and production adversaries?

## Reference

Read @references/AI-CODE-ANTIPATTERNS.md for the full pattern catalog
with detection heuristics, severity ratings, and fix examples.

## Audit Process

### Step 1: Scope
If $ARGUMENTS is provided, audit that path. Otherwise audit the
entire project, focusing on:
- MCP server implementations
- Agent/subagent code
- Tool implementations
- Webhook handlers
- Database access code
- External API integrations

### Step 2: Layer 1 — Code Quality (grep-detectable)

Run these detection commands:

```bash
# 1.1 Silent error swallowing
grep -rn "except.*:" --include="*.py" | grep -v "except.*Error"

# 1.3 Naive retry
grep -rn "sleep\|retry\|for.*range.*try" --include="*.py"

# 1.5 Floating point comparison
grep -rn "== .*\.\|!= .*\." --include="*.py" | grep -v "\".*\.\|'.*\."

# 1.6 Encoding assumptions
grep -rn "open(.*\"r\"" --include="*.py" | grep -v "encoding"
```

For each finding: read the surrounding code context to verify it's
a real issue (not a false positive). Classify severity.

### Step 3: Layer 2 — Architecture (requires code analysis)

For each external API call:
- Is there a connection pool or per-request connection? (2.1)
- Is there retry logic with backoff and cap? (1.3)
- Is there a circuit breaker? (2.5)
- What happens when this API is down? (2.6)

For each webhook/event handler:
- Is there an idempotency check? (2.2)
- What happens if it fires twice? (2.2)

For each in-memory collection:
- Is it bounded? (2.3)
- What happens after 48 hours of continuous operation? (2.3)

For each database operation:
- Is it in a transaction? (2.2)
- Is there a migration script? (2.7)

### Step 4: Layer 3 — Operations (presence checks)

Check for existence of:
- Structured logging (not f-string logs) (3.1)
- Correlation/trace IDs flowing through the pipeline (3.2)
- /health endpoint that verifies dependencies (3.3)
- SIGTERM handler for graceful shutdown (3.4)
- Metrics emission (prometheus, statsd, or OpenTelemetry) (3.5)

### Step 5: Layer 4 — Security (targeted checks)

```bash
# 4.1 Timing attacks — secret comparison with ==
grep -rn "==.*key\|==.*token\|==.*secret\|==.*password" --include="*.py"

# 4.2 Log injection — user input in log strings
grep -rn "logger.*f\"\|logging.*f\"\|print(f\"" --include="*.py"

# 4.3 Input bounds — check tool/handler parameters
grep -rn "@tool\|@app.post\|@app.get" --include="*.py"
# For each: is there a length/size check on inputs?

# 4.4 Secret rotation
grep -rn "os.environ\[.*KEY\|os.environ\[.*SECRET\|os.environ\[.*TOKEN" --include="*.py"
# Is this read once at startup or refreshed?
```

For audit trail gaps (4.5): check every automated action — is there
a record of what agent made the decision, what evidence it used,
and what the outcome was?

### Step 6: Report

Produce a structured report:

```
Production Readiness Assessment
================================
Tool: [name]
Path: [audited path]
Date: [date]
Auditor: /check-prod-readiness v1.0

CRITICAL (blocks deployment):
  ❌ [Pattern ID] [Pattern name] in [file:line]
     [One-line description of the specific issue]
     Impact: [What breaks in production]
     Fix: [Specific guidance]

HIGH (must fix before production):
  ⚠ [Pattern ID] [Pattern name] in [file:line]
     ...

MEDIUM (should fix):
  △ [Pattern ID] [Pattern name] in [file:line]
     ...

LOW (note for awareness):
  ○ [Pattern ID] [Pattern name]
     ...

PASSED:
  ✓ [Pattern ID] [Pattern name] — [how it's correctly implemented]

Summary:
  Critical: X    High: X    Medium: X    Low: X    Passed: X
  Production readiness: BLOCKED / CONDITIONAL / READY
```

Production readiness classification:
- BLOCKED: Any CRITICAL finding present
- CONDITIONAL: No CRITICAL, but HIGH findings present
- READY: No CRITICAL or HIGH findings

## Calibration Notes

This skill tends toward false positives on:
- Try/except blocks that ARE correctly scoped (e.g., except ValueError)
- In-memory collections that ARE bounded by design
- Logging that uses structured libraries but with f-string formatting

When uncertain, classify as MEDIUM rather than CRITICAL.
Always read the surrounding code context before classifying.
