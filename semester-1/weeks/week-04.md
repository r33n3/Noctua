# Week 4: Multi-Tool Systems + Data Architecture

**Semester 1 | Week 4 of 16**

## Learning Objectives

- Design multi-tool MCP servers with coordinated tools that compose
- Apply input validation, rate limiting, and audit logging at scale
- Understand the four data architecture options and when to use each
- Apply Assessment Stack Layer 4 (Data Architecture) to security system design
- Understand why "throw everything in a vector database" is wrong
- Introduce AIUC-1 Domains D (Reliability) and E (Accountability) through audit logs

---

## Day 1 — Theory

### Multi-Tool MCP Server Design

Single-tool MCP servers are prototypes. Production systems compose multiple tools. Your Week 3 CVE lookup tool becomes one tool among many in a security analyst agent toolkit:

```
Security Analysis Agent
    ↓ query_cve           → NVD database
    ↓ check_ip_reputation → threat intelligence feeds
    ↓ enrich_alert        → correlation engine
    ↓ query_logs          → SIEM
```

The agent decides which tools to call and in what order, based on the task. The orchestration happens in the agent's reasoning — not in the tool code.

**The Value of Composition:** An agent receives a raw alert → calls `query_logs` for context → calls `check_ip_reputation` on the source IP → calls `enrich_alert` to synthesize → returns a complete assessment. Each tool is simple. The composition creates capability.

### Five Principles of Secure Multi-Tool Design

**1. Single Responsibility:** Each tool does exactly one thing. No "security operations mega-tool."

**2. Clear Schemas with Validation:** Input parameters use whitelists for categorical values, range checks for numerics, and parameterized queries (never string interpolation):

```python
# DANGEROUS:
def query_logs(query: str):
    return execute_sql(f"SELECT * FROM logs WHERE {query}")
    # An agent can be tricked into: "source='app' OR 1=1 --"

# SECURE:
def query_logs(source_type: str, time_range: str, event_type: str = None, limit: int = 100):
    allowed_sources = ["app", "network", "database", "authentication"]
    if source_type not in allowed_sources:
        raise ValueError(f"Invalid source: {source_type}")
    # Use parameterized queries...
```

**3. Error Handling:** Clear error codes, no stack traces, no sensitive data in errors.

**4. Security Boundaries:** Rate limiting per agent, data scoping by role, temporal scoping for sensitive operations.

**5. Audit Logging:** Every call logged with: agent identity, parameters passed, timestamp, duration, result. This is non-negotiable for compliance.

### Assessment Stack Layer 4: Data Architecture

The choice of database is an Assessment Stack decision, not a technology preference. Match the query type to the store:

| Data Store | Query Type | Security Use Case |
|-----------|-----------|------------------|
| **Relational DB** | Exact lookup, structured filtering, joins | "Find all logins from this user in the last 30 days" |
| **Vector DB** | Semantic similarity, conceptual search | "Find incidents similar to this attack pattern" |
| **Graph DB** | Relationship traversal, path analysis | "Trace the lateral movement path from initial compromise" |
| **Time Series DB** | Trends, anomaly detection over time | "Show alert frequency over 90 days — identify spikes" |
| **Search Index** | Full-text search across documents | "Find all incidents mentioning CVE-2021-44228" |
| **Context Window** | Ephemeral, per-request | "Synthesize these 5 findings into a summary" |

#### V&V Lens: Cross-Tool Verification

When you have multiple tools available, you have a natural verification architecture. If your recon tool says an IP is malicious and your threat intel tool says the same IP is clean, that disagreement is a V&V signal — investigate further before acting.

Design your multi-tool systems with verification in mind:
- Can Tool A's output be cross-checked by Tool B?
- Do your tools provide overlapping coverage that enables independent verification?
- When tools disagree, does your system flag the conflict or silently pick one?

Add to your audit logging: when tools provide conflicting information, log the conflict and how it was resolved. This creates an audit trail for V&V decisions.

#### V&V Lens: Verification-Ready Report Design

Your report generator should produce outputs that are *auditable by design*. Every claim in a security report should be traceable to a source. Every recommendation should include the evidence that supports it.

Add these fields to your report schema:
- `evidence_sources`: Array of sources that support each finding
- `verification_status`: Has this finding been independently verified? By what method?
- `confidence_basis`: What specific evidence drives the confidence score?
- `unverified_claims`: Explicit list of claims the system could not independently verify

A report that says "Critical vulnerability found (unverified)" is more trustworthy than one that says "Critical vulnerability found" with no verification status. Transparency about verification gaps builds trust.

> **📖 Case Study Connection:** Level 4 of the PeaRL Governance Bypass was evidence poisoning — the agent marked its own findings as false positives to pass the gate. When you design data modification tools, consider: can the agent modify the data used to evaluate the agent? Separation of the evaluation data path from the agent's write path is a critical architectural decision.

### Why "Throw Everything in a Vector DB" Is Wrong

Vector databases excel at semantic similarity. But they are **wrong** for:

- **Exact IP lookup:** "Is 203.45.12.89 in our blocklist?" — Use a hash set or relational DB. Vector similarity will return *near matches* of IP addresses, which is meaningless for an exact blocklist check.

- **Time-series trending:** "Alert count by hour for the last 30 days" — Use a time-series DB with proper aggregation functions. Embedding time-series data in vectors loses the temporal structure.

- **Relational queries:** "Find all incidents involving user X and IP Y" — Use SQL with proper indexes. Trying to express relational joins through vector similarity is expensive and inaccurate.

**The right architecture is hybrid:** Use the right store for each query type, and let your agent orchestrate across stores.

**Example: Hybrid Security Data Architecture**

```
CVE vulnerability data          → Relational DB (exact CVE ID lookup, version matching)
Threat intelligence reports     → Vector DB (semantic: "find intel similar to this attack")
Attack graph, network topology  → Graph DB (path: "how did attacker reach this system?")
SIEM alert stream               → Time Series DB (trend: "is alert rate increasing?")
Incident summaries              → Vector DB (semantic: "find past incidents like this")
Per-request analysis context    → Context window (ephemeral synthesis)
```

### AIUC-1 Domains D and E: Reliability and Accountability

**Domain D (Reliability):**
- **D001 — Graceful degradation:** When the `check_ip_reputation` tool fails, your system should continue with available data, not crash. The agent should note "IP reputation unavailable — proceeding with log analysis only."
- **D002 — Error handling transparency:** Return structured errors, not silent failures. The agent and downstream systems should know what succeeded and what didn't.

**Domain E (Accountability) — The Audit Log Exercise:**
- **E001 — Decision logging:** Every tool call is logged with full context
- **E002 — Non-repudiation:** Logs should be immutable and include enough to reconstruct the decision chain

> **Governance Moment:** "Delete the logs. Now reconstruct what your agent did. You can't? That's exactly why AIUC-1 E exists. Your audit log is not overhead — it's your defense when a decision is questioned."

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the four data architecture types (Relational, Vector, Graph, Time Series). When should I use each?"
> - "I think I understand why vector DBs are wrong for exact lookups but I'm not sure. Explain it to me differently."
> - "What are the three most common data architecture mistakes when building security tools for the first time?"
> - "Connect this week's multi-tool composition patterns to the MCP design principles from Week 3."

> **💡 Tool Pattern:** Use **Chat** for design phase thinking (what tools, what data architecture, what composition pattern). Switch to **Code** for the build phase. This is the Think → Build handoff.

---

## Day 2 — Lab

### Build: Multi-Tool MCP Server with Structured Security Report

**Architecture: Three Composed Tools**

1. **`query_logs`** — Structured, parameterized log queries with input validation
2. **`check_ip_reputation`** — Query threat intelligence for IP addresses
3. **`enrich_alert`** — Compose data from tools 1 and 2 into a final assessment

**Step 1: Design in Claude Code**

Walk through the composition pattern before building:

```text
I'm building a security alert enrichment system with three tools:

1. query_logs(source_type, time_range, event_type, limit) → array of log entries
   - source_type: ["app", "network", "database", "auth"]
   - time_range: ["last_hour", "last_day", "last_week"]
   - Validation: reject anything outside these enums

2. check_ip_reputation(ip_address) → {threat_level, reputation_score, known_attacks, false_positive_risk}
   - Input: valid IPv4 or IPv6 address
   - Validation: reject non-IP-format strings

3. enrich_alert(alert_id, logs, ip_threat) → {incident_severity, recommended_action, reasoning, aiuc1_domains_applied}
   - Synthesizes the results of tools 1 and 2

Walk me through how an agent would analyze this alert:

ALERT:
- Source IP: 203.45.12.89
- User: admin@company.local
- Action: Downloaded 10 GB from customer database
- Time: 2026-03-05 14:22 UTC

Steps:
1. What logs should the agent query first?
2. What should the IP reputation check return for 203.45.12.89?
3. How does enrich_alert combine the results?
4. What if the tools return conflicting signals (logs say suspicious, IP reputation says clean)?
```

**Step 2: Implement the Multi-Tool Server**

Use Claude Code to implement the server with proper validation, rate limiting, and audit logging. Key patterns to verify after generation:

```python
# Rate limiting pattern
from collections import defaultdict
from time import time

call_history = defaultdict(list)

def rate_limit_check(agent_id: str, max_calls_per_minute: int = 20):
    now = time()
    call_history[agent_id] = [t for t in call_history[agent_id] if now - t < 60]
    if len(call_history[agent_id]) >= max_calls_per_minute:
        raise RateLimitError(f"Rate limit exceeded. Try again in {60 - (now - call_history[agent_id][0]):.0f}s")
    call_history[agent_id].append(now)

# Audit logging pattern
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
        "aiuc1_domain": "E001"  # Accountability - decision logging
    }
    with open("audit.log", "a") as f:
        f.write(json.dumps(entry) + "\n")
```

**Step 3: Data Architecture Design Exercise**

For a security system that monitors a financial institution, design the data architecture:

| Data Type | Volume | Query Pattern | Chosen Store | Assessment Stack Layer 4 Justification |
|-----------|--------|--------------|-------------|---------------------------------------|
| IP blocklist | 10M entries | Exact lookup | | |
| SIEM alerts | 100K/day | Time trends | | |
| Incident reports | 5K total | "Similar incidents" | | |
| Attack paths | 50K relationships | Traversal | | |
| Policy documents | 500 docs | Semantic search | | |

Complete the table. For each choice, write one sentence explaining why another store would be wrong.

**Step 4: The Audit Log Governance Exercise**

Run your multi-tool server for 5 minutes of test queries. Then:

1. Delete `audit.log`
2. Try to reconstruct: What queries did the agent make? What data was accessed? What recommendations were generated?
3. You can't → This is the AIUC-1 E gap

Now restore `audit.log` and answer those same questions. Document the difference.

**Step 5: Hybrid Data Strategy Design**

Using the architecture table from Step 3, write a 1-page `data-architecture.md` for your hypothetical financial security system:
- Which stores would you use?
- How would your agent query across multiple stores?
- What happens if one store is unavailable? (AIUC-1 D — graceful degradation)

---

## Deliverables

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through design decisions, Cowork to structure and format the architecture document, and Code to build the multi-tool server. The quality of your thinking matters — the mechanical production should be AI-assisted.

1. **Multi-tool MCP server** with validation, rate limiting, and audit logging
2. **Data Architecture Design** (table + 1-page narrative) — which data store for each data type and why
3. **Audit log governance exercise** — documented results of the "delete logs and reconstruct" exercise
4. **Tool composition test** — agent running a full alert enrichment (query_logs → check_ip → enrich_alert) with output

> **💡 Skill Preview:** Your RAG knowledge base? That could be a skill's `references/` directory. Your chunking and retrieval logic? That could be a skill's `scripts/` directory. Skills are just organized context packages — SKILL.md for instructions, references for knowledge, scripts for tools. You've been building skill components since Week 4.

> **📁 Save to:** `~/agentforge/tools/mcp-servers/week04-multitool/` (server code), `~/agentforge/governance/audits/` (audit log exercise), `~/agentforge/deliverables/week04/` (final submission)

---

## AIUC-1 Integration

**Domain D (Reliability):**
- Graceful degradation when tools fail — continue with available data, flag what's missing
- Error handling that returns structured errors, not silent failures

**Domain E (Accountability):**
- Every tool call logged with full context
- The audit log exercise makes the value concrete: you cannot defend decisions you cannot reconstruct

Both domains are embedded in the technical implementation. Students don't need to "study AIUC-1" — they experience why these controls exist.

## V&V Lens

**Tool Reliability — testing your tools before trusting them in production:**

After building your multi-tool server, run these verification tests:
1. Input validation: Does `query_logs(source_type="DROP TABLE--")` reject cleanly?
2. Rate limiting: Does the 21st call in a minute get rejected?
3. Audit logging: Does every call appear in `audit.log`?
4. Graceful degradation: Does `enrich_alert` continue when `check_ip_reputation` fails?

Document the test results. This is Layer 6 of the Assessment Stack applied to your own tools.
