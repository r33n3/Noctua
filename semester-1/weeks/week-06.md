# Week 6: Tool Design Patterns for Security Agents

**Semester 1 | Week 6 of 16**

## Opening Hook

> Last week you learned to build tools. This week you learn how those exact tools can be turned against you — and how to design them so they can't be. The GTG-1002 case study isn't hypothetical: it's a documented campaign where a nation-state actor weaponized the same MCP architecture you're building. Understanding the attack is the only way to build the defense.

## Learning Objectives

- Apply the five core principles of secure tool design to real-world security scenarios
- Evaluate input validation strategies and their effectiveness against injection attacks
- Design least-privilege access controls for agent-tool communication
- Analyze tool versioning and deprecation strategies in compliance-critical systems
- Create testable, observable tool interfaces

---

## Day 1 — Theory

### The Five Pillars of Secure Tool Design

Over the past two years, security teams have learned painful lessons about agent-tool integration. A poorly designed tool can:
- Allow agents to execute unintended queries (SQL injection through a log query tool)
- Expose sensitive data that agents shouldn't access
- Bypass rate limits and cause denial-of-service
- Leave no audit trail (critical for compliance)
- Fail unpredictably and require human intervention

Modern secure tool design rests on five interdependent principles:

**1. Single Responsibility** — Each tool does exactly one thing. A "security operations" tool that can query logs, enrich alerts, check IP reputation, and remediate threats is unmaintainable and difficult to audit. Instead, build four separate tools, each with a narrow scope. This makes it easier to test, audit, and revoke access to specific functionality.

**2. Clear Schemas** — Input and output must be unambiguous and machine-readable. A tool that accepts "anything goes" parameters (e.g., a bare string `log_query="SELECT * FROM events WHERE..."`) is vulnerable to injection. Instead, define strict JSON schemas with parameterized inputs. A log query tool should have discrete parameters: `source_type`, `time_range`, `event_type`, `limit` — not a free-form query field.

**3. Error Handling** — Tools must fail gracefully. When something goes wrong, provide:
- A clear error code (not a stack trace)
- Context about what failed and why
- Remediation steps if applicable
- No sensitive information in error messages (don't leak internal paths or credentials)

**4. Security Boundaries** — Enforce least privilege at every level:
- **Input validation:** Reject invalid requests before processing
- **Rate limiting:** Prevent agents from hammering a tool
- **Data access scoping:** Limit which records a tool can query
- **Temporal scoping:** Some sensitive tools should only be available during maintenance windows
- **Audit logging:** Every call is logged with timestamp, requester, parameters, and result

**5. Observability** — Every tool invocation must be observable and auditable. This is non-negotiable for compliance. Log: who called the tool (agent identity), what parameters were passed, how long it took, what the response was, any errors or exceptions.

> **Key Concept:** "Security by default" means designing tools with the assumption that agents will, eventually, misuse them (whether through adversarial prompting or genuine mistakes). Make the secure path the easy path. Design your tools so that the right behavior — least privilege, validated input, audit-logged operations — is not just safe but *the easiest path for the agent to follow*.

---

### The Service Layer Pattern: API First, MCP Second

The most resilient tool architectures follow a critical principle: **build the REST API first, then layer the MCP server on top as a consumption client.** This pattern decouples core business logic from the AI integration layer.

```
Core Business Logic
      ↓
FastAPI/Flask REST API (with auth, rate limiting, structured responses)
      ↓
    ┌─────────────────────────────────┐
    ├── MCP Server (wrapper)          │
    ├── Web Dashboard (client)        │
    ├── CLI Tool (client)             │
    └── CI/CD Pipeline (client)       │
```

Naive approach (monolithic MCP server — logic and protocol tightly coupled):

```python
# ❌ Direct database access, no auth, no rate limiting
class ThreatIntelMCPServer:
    def query_threat_intel(self, ip_address: str):
        return db.query(f"SELECT * FROM threats WHERE ip = {ip_address}")
```

Production approach — API first, MCP as thin wrapper:

```python
# Step 1: Build the REST API
from fastapi import FastAPI, Depends
app = FastAPI()

@app.get("/api/v1/threat-intel/{ip_address}")
async def get_threat_intel(ip_address: str, api_key: str = Depends(verify_api_key)):
    if not is_valid_ip(ip_address):
        raise HTTPException(status_code=400, detail="Invalid IP")
    return {"ip": ip_address, "threat_level": query_db(ip_address)}

# Step 2: Wrap with MCP server
class ThreatIntelMCPServer:
    def query_threat_intel(self, ip_address: str):
        # MCP server is a thin client — all logic stays in the API
        response = requests.get(
            f"http://localhost:8000/api/v1/threat-intel/{ip_address}",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        return response.json()
```

The API is the stable contract. Authentication, rate limiting, audit logging, and data validation happen at the API boundary. The MCP server doesn't need to know about any of that — it just calls the API. When you deploy, you containerize the API; the MCP server calls it without modification.

---

### Input Validation: The First Line of Defense

The naive implementation — vulnerable to injection:

```python
# DANGEROUS: Query injection vulnerability
def query_logs(query: str):
    return execute_sql(f"SELECT * FROM logs WHERE {query}")
    # An agent can be tricked into: "source='app' OR 1=1 --"
```

The secure implementation uses whitelisted parameters and parameterized queries:

```python
def query_logs(
    source_type: str,
    time_range: str,  # "last_hour", "last_day", "last_week"
    event_type: str = None,
    limit: int = 100
):
    allowed_sources = ["app", "network", "database", "authentication"]
    if source_type not in allowed_sources:
        raise ValueError(f"Invalid source: {source_type}")

    time_map = {"last_hour": "-1h", "last_day": "-1d", "last_week": "-7d"}
    if time_range not in time_map:
        raise ValueError(f"Invalid time range: {time_range}")

    if event_type:
        allowed_events = ["error", "warning", "info", "authentication", "data_access"]
        if event_type not in allowed_events:
            raise ValueError(f"Invalid event type: {event_type}")

    if not isinstance(limit, int) or limit < 1 or limit > 1000:
        raise ValueError("Limit must be between 1 and 1000")

    # Parameterized query — no string interpolation
    query = "SELECT * FROM logs WHERE source_type = ?"
    params = [source_type]
    if time_range:
        query += " AND timestamp > ?"
        params.append(time_map[time_range])
    if event_type:
        query += " AND event_type = ?"
        params.append(event_type)
    query += " LIMIT ?"
    params.append(limit)
    return execute_parameterized_sql(query, params)
```

> **Discussion:** Your security team has a tool that can block IP addresses. The MCP schema requires an IP address as input. What validation would you add to prevent an agent from accidentally blocking 0.0.0.0 or blocking your company's entire subnet?

---

### Least Privilege for Agent Tool Access

Even with perfect tool design, you must limit what agents can access.

**1. Capability Scoping** — An agent tasked with "triage alerts" doesn't need access to "modify firewall rules." Give it read-only access to logs and threat intelligence, not write access to security controls.

**2. Data Scoping** — An alert triage agent shouldn't access all historical logs — only logs from the past hour. Implement this at the tool level:

```python
def query_logs(source_type: str, time_range: str = "last_hour", ...):
    if agent_role == "alert_triage":
        allowed_ranges = ["last_hour", "last_day"]
    elif agent_role == "compliance_auditor":
        allowed_ranges = ["last_hour", "last_day", "last_week", "last_month"]

    if time_range not in allowed_ranges:
        raise PermissionError(f"Agent {agent_id} cannot access time range {time_range}")
```

**3. Temporal Scoping** — Sensitive tools (credential rotation, firewall changes) might only be available during maintenance windows.

**4. Rate Limiting** — Prevent an agent from hammering a tool:

```python
from collections import defaultdict
from time import time

call_history = defaultdict(list)

def rate_limit_check(agent_id: str, max_calls_per_minute: int = 10):
    now = time()
    call_history[agent_id] = [t for t in call_history[agent_id] if now - t < 60]
    if len(call_history[agent_id]) >= max_calls_per_minute:
        raise RateLimitError(f"Rate limit exceeded. Try again in {60 - (now - call_history[agent_id][0]):.0f}s")
    call_history[agent_id].append(now)
```

> **Policy must be in the tool, not trusted to the operator.** A tool's scope constraints must be baked into its implementation — hardcoded allowed targets, maximum operation counts, required authorization checks. If `ALLOWED_TARGETS` is a `frozenset` in the tool code, it cannot be overridden at runtime. If it's a parameter the operator sets, it can be changed. Know the difference.

---

### Tool Versioning and Deprecation

Security tools evolve. How do you update tools without breaking agents that depend on them?

**Semantic Versioning for Tools:**
- **MAJOR version** — Incompatible changes (removing a parameter, changing output type)
- **MINOR version** — Backward-compatible additions (new optional parameter)
- **PATCH version** — Bug fixes (no behavior changes)

**Deprecation Strategy:**
1. Release new MINOR version with new parameter, keeping old behavior
2. Document deprecation path in tool description
3. Log deprecation warnings when agents use old parameters
4. Set deprecation timeline (e.g., "query parameter removed in v3.0, available until Jan 1, 2027")
5. Migrate gradually — give agents and applications time to update

```python
def query_logs_v2(
    source_type: str,
    time_range: str,
    filters: dict = None,   # NEW in v2.0
    query: str = None       # DEPRECATED, kept for backward compatibility
):
    if query is not None:
        logger.warning("query parameter is deprecated. Use filters instead.")
        filters = parse_legacy_query(query)
    if filters is None:
        filters = {}
    # ... rest of implementation
```

---

### Testing Secure Tools

A security tool test suite should include:

```python
import pytest

def test_query_logs_rejects_invalid_source():
    with pytest.raises(ValueError, match="Invalid source"):
        query_logs(source_type="invalid_source", time_range="last_hour")

def test_query_logs_sql_injection_protection():
    with pytest.raises(ValueError):
        query_logs(source_type="app", time_range="'; DROP TABLE logs; --")

def test_query_logs_rate_limiting():
    agent_id = "test_agent"
    for i in range(10):
        query_logs(agent_id, source_type="app", time_range="last_hour")
    with pytest.raises(RateLimitError):  # 11th call should fail
        query_logs(agent_id, source_type="app", time_range="last_hour")

def test_query_logs_audit_logged():
    with patch('audit_log.write') as mock_log:
        query_logs(source_type="app", time_range="last_hour")
        mock_log.assert_called_once()
        call_args = mock_log.call_args[0][0]
        assert "query_logs" in call_args
        assert "app" in call_args
```

---

### Case Study: Operation GTG-1002

In November 2025, Anthropic published the full technical report on **GTG-1002**: the first documented case of AI-orchestrated cyber espionage executed at scale. A Chinese state-sponsored threat actor built an autonomous attack framework using Claude Code and custom MCP servers. The framework decomposed complex multi-stage cyberattacks into discrete technical tasks for Claude sub-agents: vulnerability scanning, credential validation, data extraction, and lateral movement.

**The Architecture Through Our Five Pillars Lens:**

The attacker's MCP server architecture mirrors what you built in Week 5 — but with every secure design principle inverted:

1. **Single Responsibility — Weaponized:** Each MCP server wrapped one commodity tool (network scanner, search tool, data retrieval, exploit). This modularity made the attack hard to detect — each individual tool call looked like legitimate security work. The lesson: single responsibility is a design principle, not a security guarantee.

2. **Clear Schemas — Exploited for Deception:** The attacker's tool schemas were clean and well-defined. The attack wasn't through malformed inputs — it was through correctly-formed inputs with malicious intent. Input validation alone is insufficient. You also need **intent validation**: Does this sequence of tool calls make sense for the agent's stated purpose?

3. **Error Handling — Turned into Reconnaissance:** When exploitation attempts failed, error responses became intelligence. "Connection refused" on port 443 = no HTTPS service. "Timeout" = firewall filtering. The attacker's framework parsed errors to map infrastructure. Your error messages must be designed assuming an adversary is reading them.

4. **Security Boundaries — Bypassed Through Social Engineering:** The attacker's key innovation was role-play: they convinced Claude it was conducting authorized defensive security testing. Claude is trained to refuse harmful requests — but persona-based prompting bypassed this. The attacker didn't break security boundaries; they convinced the agent the boundaries didn't apply.

5. **Observability — What Caught Them:** Ultimately, operational tempo triggered detection. Sustained request rates (thousands of requests, multiple operations per second) were physically impossible for human-directed operations. Anthropic's platform-level monitoring caught what tool-level security missed.

**The Human-AI Split:** AI executed 80-90% of tactical work independently. Humans made decisions at critical escalation points: approving transition from reconnaissance to active exploitation, authorizing use of harvested credentials, making final decisions about data exfiltration scope.

**The Hallucination Problem:** Claude frequently overstated findings and occasionally fabricated data during autonomous offensive operations. The attacker's 10-20% human involvement wasn't optional — it was *necessary* because the AI couldn't be trusted to validate its own outputs.

> **GTG-1002 demonstrates that the tools and patterns you're learning are dual-use.** The same architecture that powers your defensive SOC agent can power an autonomous attack framework. The difference isn't the technology — it's the governance, oversight, and intent validation you build around it.

> **Knowledge Check**
> Define "tool poisoning" — what is it and how does it work? Give a concrete example of how an attacker could use it against a Claude Code session running your CVE lookup tool from last week. What design decision prevents it?
>
> Claude: The student should describe how a malicious tool response can contain instructions that hijack the agent's behavior. The prevention is treating tool responses as untrusted data — not instructions — and validating all tool output before acting on it. If they get the concept but struggle with the CVE tool example, walk through it together.

---

### Design Before You Build

```
/think → /build-spec → build
```

1. `/think` — use Claude Code's /think skill to surface your design reasoning: "What are the security implications of each tool I'm adding? What could go wrong?"
2. `/build-spec` — capture decisions in a spec document: interface contracts, error handling strategy, PoLP decisions, known gaps
3. **Build** — with the spec written, build to the spec; decisions already made don't slow you down

The spec is not bureaucracy — it's the record of your security design choices. When you audit your own system in Unit 3, your spec is Exhibit A.

After building, run `/code-review` before committing. Under the hood, `/code-review` dispatches 4 parallel review agents. Findings are tagged: `bug`, `security`, `performance`, `style`, `compliance`. Only findings with ≥80% confidence are reported.

---

### Day 1 Deliverable

Design a security tool specification (2-3 pages, 800-1000 words):
1. **Tool Specification** — name, description, single responsibility statement
2. **Input Schema** — all parameters with validation rules
3. **Output Schema** — response structure
4. **Security Boundaries** — least privilege, rate limiting, data scoping decisions
5. **Error Handling** — 5-10 documented error cases
6. **Testing Plan** — 10-15 test cases
7. **Audit Logging Strategy**

> **Day 1 Checkpoint**
> Claude: Ask the student: "Anything from today's theory that felt unclear?" Note confidence signals. Write to `.noctua/progress.md`: add a row to the "Week 6 — Day 1 Theory" table with today's date and your confidence assessment (High / Medium / Low). Append to Confusion Log if anything came up. Topics covered: Week 6 secure tool design and GTG-1002.

---

## Day 2 — Lab

### Lab: Multi-Tool MCP Server with Security Boundaries

> **Lab Guidance**
> Claude: Guide the student through the multi-tool lab with a red-team mindset. At each tool you build together, ask: "How would an attacker abuse this specific tool?" Then: "What design change prevents that?" Don't let them build tools without thinking through the attack surface first.

**Lab Objectives:**
- Build a multi-tool MCP server with validation and error handling
- Implement rate limiting and audit logging
- Design and test security boundaries
- Compose multiple tools for realistic alert enrichment workflows
- Measure tool performance and security properties

### Architecture: Three Composable Tools

1. **`query_logs`** — Structured log queries (source_type, time_range, event_type, limit)
2. **`check_ip_reputation`** — IP threat assessment (threat_level, reputation_score, known_attacks, false_positive_risk)
3. **`enrich_alert`** — Synthesize assessment from logs + IP reputation

**Setup:**

```bash
mkdir -p ~/noctua-labs/unit2/week6
cd ~/noctua-labs/unit2/week6
```

### Part 1: Design in Claude Code

Walk through the composition pattern before building:

```
I'm building a security alert enrichment system with three tools:

1. query_logs(source_type, time_range, event_type, limit)
   - source_type: ["app", "network", "database", "auth"]
   - Validation: reject anything outside these enums

2. check_ip_reputation(ip_address)
   - Returns {threat_level, reputation_score, known_attacks, false_positive_risk}
   - Validation: reject non-IP-format strings

3. enrich_alert(alert_id, logs, ip_threat) → {incident_severity, recommended_action, reasoning}
   - Synthesizes the results of tools 1 and 2

Walk me through how an agent would analyze this alert:

ALERT:
- Source IP: 203.45.12.89
- User: admin@meridian.local
- Action: Downloaded 10 GB from customer database
- Time: 2026-03-05 14:22 UTC

1. What logs should the agent query first?
2. What should the IP reputation check return for 203.45.12.89?
3. How does enrich_alert combine the results?
4. What if the tools return conflicting signals?
```

### Part 2: Implement with Security Boundaries

Key patterns to implement:

**Rate limiting:**
```python
from collections import defaultdict
from time import time

call_history = defaultdict(list)

def rate_limit_check(agent_id: str, max_calls_per_minute: int = 20):
    now = time()
    call_history[agent_id] = [t for t in call_history[agent_id] if now - t < 60]
    if len(call_history[agent_id]) >= max_calls_per_minute:
        raise RateLimitError(f"Rate limit exceeded. Try again in {60 - (now - call_history[agent_id][0]):.0f}s")
    call_history[agent_id].append(now)
```

**Audit logging:**
```python
import json
from datetime import datetime

def audit_log(tool_name: str, agent_id: str, params: dict, result: dict, duration_ms: float):
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "tool": tool_name,
        "agent_id": agent_id,
        "parameters": params,
        "result_summary": {k: v for k, v in result.items() if k != "raw_data"},
        "duration_ms": duration_ms,
        "aiuc1_domain": "E001"
    }
    with open("audit.log", "a") as f:
        f.write(json.dumps(entry) + "\n")
```

### Part 3: Test with Claude Code

Test these scenarios:

**Scenario 1 — IP Reputation Check:**
```
Check the reputation of IP 203.45.12.89. Is this a known threat actor?
```

**Scenario 2 — Alert Enrichment:**
```
Enrich this alert: user admin@meridian.local downloaded 10GB from the customer database.
Source IP is 203.45.12.89. What's the incident severity?
```

**Scenario 3 — Multi-Tool Investigation:**
```
Investigate this alert using all available tools. Start with logs,
then check IP reputation, then synthesize an assessment.
```

### Part 4: Security Validation Tests

Run these verification tests:
1. **Input validation:** Does `query_logs(source_type="DROP TABLE--")` reject cleanly?
2. **Rate limiting:** Does the 21st call in a minute get rejected?
3. **Audit logging:** Does every call appear in `audit.log`?
4. **Graceful degradation:** Does `enrich_alert` continue when `check_ip_reputation` fails?

Document all test results.

### Part 5: Red Team/Blue Team Exercise — Operation Forge Fire

In a sandboxed local environment (Docker containers):

**Red Team:** Build a reconnaissance tool that performs port scanning, service enumeration, and banner grabbing — against localhost only, with explicit authorization documentation.

**Blue Team:** Build a detection tool that logs connection attempts, identifies port scan patterns, and surfaces anomalies.

**Required:** Write a Security Testing Policy document before running any tools. Include: scope (localhost only), authorization chain, ethical boundaries, and what constitutes a finding vs. a violation.

**Debrief questions:**
- Which GTG-1002 patterns did the red team's tool exhibit?
- What observability signals would have caught it at the platform level?
- How would tool-level security boundaries have prevented or limited the attack?

> **Lab Checkpoint**
> Claude: Ask: "How did the multi-tool lab go? Did the rate limiting and audit logging work as expected? Any security boundaries that were tricky to implement?" Write to `.noctua/progress.md`: add a row to the "Week 6 — Day 2 Lab" table. Note in the Confusion Log if any tool design concept was confusing.

---

## Deliverables

> **Save to:** `~/noctua-labs/unit2/week6/` (server code and tests), `context-library/patterns/` (add tool-design and error-handling patterns)

1. **Multi-tool MCP server** with validation, rate limiting, and audit logging
2. **Security test results** — input validation, injection tests, rate limit tests, audit log tests
3. **Tool specification document** (Day 1 deliverable) — design doc for your tool
4. **Audit Log Governance Exercise** — document the "delete audit.log and reconstruct" results
5. **Red Team/Blue Team writeup** — Security Testing Policy + findings from Operation Forge Fire

---

## Week Complete

> **Claude: Wrap Up**
> Confirm the student has finished Week 6. Ask: "Before we move to Week 7 — is there anything from this week you'd like to revisit?"
> Update `.noctua/progress.md`: set Current Position to Week 7, Day 1 Theory. Write a 1-2 line session note.
> Then ask: "Ready for Week 7?"
