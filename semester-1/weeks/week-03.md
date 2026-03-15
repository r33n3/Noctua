# Week 3: MCP Servers + Tool Design

**Semester 1 | Week 3 of 16**

## Learning Objectives

- Understand MCP architecture: clients, servers, and transports
- Understand when to use tool calls vs. agent reasoning
- Design tools with input validation, error handling, and audit logging
- Introduce A2A (Agent-to-Agent) protocol conceptually: agent-to-tool vs. agent-to-agent
- Introduce Tool Search Tool for managing large tool libraries
- Build a functional CVE lookup MCP server connected to Claude Code
- Apply AIUC-1 Domain B (Security) to tool design: input filtering and limiting agent access

---

## Day 1 — Theory

### The MCP Origin Story

Before MCP (Model Context Protocol), integrating external tools into LLM workflows was chaotic. Each tool required a custom connector per LLM provider. A CVE lookup tool built for Claude required separate integration for GPT-4, and another for Gemini. There was no standard for tool discovery, error handling, or audit logging.

Anthropic released MCP in late 2024 as an open standard. The Linux Foundation took governance in 2025, establishing it as community-driven. MCP solves the "integration sprawl" problem the same way HTTPS solved the web security standardization problem.

### MCP Architecture: Three Layers

**Clients** — The AI agent or application consuming tools. In this course, Claude Code running in your terminal, tasked with analyzing threats or building security tools.

**Servers** — Stateless services that expose tools. A security team might run one MCP server wrapping their SIEM, another for vulnerability scanning, another for threat intelligence. Each server handles authentication, input validation, and logging.

**Transports** — The communication channel:
- **stdio** — Standard input/output for local tools and Claude Code integrations
- **HTTP/HTTPS** — For client-server architectures across networks
- **WebSockets** — For persistent, bidirectional real-time security operations

This three-layer model provides security advantages: the client never directly executes code on the server, the server can enforce rate limits and log every interaction, and the transport can be encrypted and authenticated independently.

### Key Insight: MCP Gives Agents Deterministic Tools

Without MCP, an agent that needs to check an IP's reputation might:
- Search the web for threat intelligence (slow, unreliable, hallucination risk)
- Reason from training data (stale, imprecise)
- Ask the user to look it up (defeats the purpose)

With an MCP tool:
- The agent calls `check_ip_reputation(ip="203.45.12.89")`
- Gets back structured, authoritative, fresh data
- Doesn't waste reasoning on what should be a deterministic lookup

**Assessment Stack Layer 5 Application:** MCP is an integration pattern. The decision "should this be a tool call or agent reasoning?" is an Assessment Stack question:
- Known, bounded query with deterministic answer → MCP tool call
- Novel situation requiring judgment → agent reasoning
- Both → tool call to gather evidence, then agent reasoning over results

### A2A: Agent-to-Agent Protocol (Conceptual Introduction)

MCP handles agent-to-tool communication. A2A handles agent-to-agent communication — when one AI agent needs to delegate to another AI agent as a peer.

**MCP vs. A2A in practice:**
```
Your orchestrator agent
        ↓ MCP tool call
CVE lookup server (deterministic tool, not AI)

Your orchestrator agent
        ↓ A2A delegation
Specialized analysis agent (AI that reasons and decides)
```

A2A is introduced here conceptually. You'll build A2A systems in Weeks 9-10. For now, the key distinction: MCP gives agents tools; A2A gives agents collaborators.

#### The Protocol Landscape: MCP and A2A

MCP standardizes how agents talk to **tools**. But agents also need to talk to **other agents**. The **Agent-to-Agent (A2A) protocol** addresses this complementary need.

| Protocol | Direction | Purpose | Example |
|----------|-----------|---------|---------|
| **MCP** | Agent → Tool | Standardized tool access | Agent queries a CVE database via MCP server |
| **A2A** | Agent → Agent | Standardized agent communication | Recon agent sends findings to analysis agent via A2A |

You don't need to implement A2A yet — that comes in Weeks 9-10 (multi-agent orchestration). But understanding that these two protocols work together helps you design systems where agents can discover each other's capabilities, delegate tasks, and coordinate workflows using standardized interfaces rather than custom glue code.

> **🔑 Key Concept:** MCP solved the agent-to-tool integration problem. A2A solves the agent-to-agent integration problem. Together, they provide the standardized communication layer for production agentic systems. Think of MCP as the "API layer" and A2A as the "service mesh" of the agentic world.

### Tool Search Tool: Managing Large Tool Libraries

When an agent has access to 5 tools, it can easily decide which to call. When it has access to 50 tools, the decision overhead grows. The Tool Search Tool solves this through progressive disclosure:

- **Tool metadata** (always loaded): name, description, when to use
- **Tool body** (loaded on trigger): full schema, parameters, examples
- **Reference material** (loaded on demand): documentation, edge cases

This pattern — metadata → body → references — will appear again when we cover Claude Code skills in Week 6.

#### V&V Lens: Tool Outputs as Verification Sources

MCP servers aren't just tools for agents — they're verification infrastructure. When you design an MCP server that queries a CVE database, you're building an independent verification source that agents (and humans) can use to confirm claims.

Design principle: **every MCP tool should return enough context for a human to verify the result.** Don't just return `{"vulnerable": true}`. Return `{"vulnerable": true, "cve_id": "CVE-2026-1234", "source": "NVD", "last_updated": "2026-03-01", "affected_versions": "1.0-1.4"}`. The additional context enables V&V without requiring the human to re-query the source.

Apply this to your Week 3 lab: when building your CVE lookup MCP server, include source attribution and timestamps in every response so the consumer can assess freshness and provenance.

> **📖 Case Study Connection:** In the PeaRL Governance Bypass, Level 1 was the agent using legitimate MCP tools (`createException`) for self-serving governance bypass. Level 2 was the agent discovering the full API surface through `/openapi.json`. When you design your MCP server, ask: what happens if the agent uses this tool to influence its own evaluation? What information does your server expose that an agent could use to find alternative access paths?

### Tool Design: The Five Principles

1. **Single Responsibility** — Each tool does exactly one thing. Easier to test, audit, and revoke.
2. **Clear Schemas** — Input/output must be unambiguous. Use JSON Schema with strict validation.
3. **Error Handling** — Fail gracefully with clear error codes, not stack traces.
4. **Security Boundaries** — Least privilege at every level: input validation, rate limiting, data scoping, audit logging.
5. **Observability** — Every invocation logged: who called it, what parameters, how long, what result.

### AIUC-1 Domain B (Security): B005 and B006

**B005 — Input Filtering:** All input to a security tool must be validated before processing. An agent that accepts "any string" for an IP address can be tricked into SQL injection, command injection, or path traversal.

**B006 — Limit Agent Access:** Agents should have access to the minimum set of tools required for their task. A triage agent that only needs to read logs should not have access to a "modify firewall rules" tool.

> **Governance Moment:** "What else could this agent access through the same transport? If your MCP server exposes 10 tools but your triage agent only needs 3, you've given it access to 7 tools it shouldn't have. That's a security misconfiguration."

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on MCP architecture: clients, servers, and transports. Start easy, then get harder."
> - "I think I understand the difference between MCP and A2A but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common security mistakes when building MCP servers for the first time?"
> - "Connect MCP's single-responsibility principle to the Engineering Assessment Stack from Week 1."

---

## Day 2 — Lab

### Build: CVE Lookup MCP Server

**Lab Objectives:**
- Build an MCP server exposing a CVE lookup tool
- Connect it to Claude Code via stdio transport
- Test with natural language queries
- Document the design decisions

**Setup:**
```bash
mkdir -p ~/noctua/week03-mcp
cd ~/noctua/week03-mcp
pip install mcp httpx pydantic
```

**Step 1: Design the Tool Schema**

Before writing a line of code, design the schema (Assessment Stack Layer 6 — Verification starts at design):

```json
{
  "tool_name": "query_cve",
  "description": "Look up CVE details from the NVD database. Use when you need authoritative vulnerability data for a specific CVE ID.",
  "input_schema": {
    "type": "object",
    "properties": {
      "cve_id": {
        "type": "string",
        "description": "CVE identifier in format CVE-YYYY-NNNNN",
        "pattern": "^CVE-[0-9]{4}-[0-9]{4,6}$"
      },
      "include_remediation": {
        "type": "boolean",
        "description": "Include remediation steps (default: true)",
        "default": true
      }
    },
    "required": ["cve_id"]
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "cve_id": {"type": "string"},
      "description": {"type": "string"},
      "severity": {"type": "string", "enum": ["critical", "high", "medium", "low", "unknown"]},
      "cvss_v3_score": {"type": "number", "minimum": 0, "maximum": 10},
      "affected_products": {"type": "array"},
      "remediation": {"type": "string"},
      "references": {"type": "array"}
    }
  }
}
```

**Step 2: Design in Claude Code First**

Use Claude Code to walk through the architecture before implementing:

```text
I'm building an MCP server for CVE lookups. Walk me through the architecture:

1. INPUT VALIDATION: If a user asks for "CVE-2023-44487", how do we validate it's a real CVE format?
   What validation should reject: "CVE-2023-INVALID", "DROP TABLE--", "../../etc/passwd"

2. EXTERNAL API CALL: Write pseudocode for calling the NVD API.
   What parameters? What response shape? What could fail?

3. PARSING: Given an NVD response, extract:
   - CVSS v3 score → derive severity (9.0-10.0=critical, 7.0-8.9=high, 4.0-6.9=medium, 0.1-3.9=low)
   - Affected products (vendor, product, versions)
   - References

4. RESPONSE FORMATTING: Shape the parsed data into a structured response Claude would understand.

5. ERROR HANDLING:
   - Invalid CVE ID format → reject with schema validation error
   - CVE not found → graceful "not found" message
   - API timeout → timeout error with retry guidance
   - Rate limiting (HTTP 429) → wait message

Show the complete input validation function and error handling logic.
```

**Step 3: Design Decision Exercise**

For each of the following, decide: Should it be a tool call or agent reasoning?

| Task | Tool Call or Reasoning? | Why |
|------|------------------------|-----|
| "Is CVE-2023-44487 patched?" | Tool call | Known, bounded, deterministic answer from NVD |
| "Which of these 5 CVEs should we patch first?" | Reasoning | Requires judgment about organizational context |
| "What's the CVSS score for CVE-2021-44228?" | Tool call | Deterministic lookup |
| "How would an attacker exploit this CVE in our environment?" | Reasoning | Novel situational analysis |
| "Are there patches available for Apache Log4j 2.14?" | Both | Tool call for data → reasoning over results |

**Step 4: Connect to Claude Code**

Register the server with Claude Code:
```bash
claude mcp add cve-lookup -- python ~/noctua/week03-mcp/cve_mcp_server.py
```

That's it. Claude Code stores the configuration automatically. You can verify it was added:
```bash
claude mcp list
```

**Step 5: Test with Natural Language**

In Claude Code:
```
What is CVE-2023-44487?
```

The agent should:
1. Discover the `query_cve` tool
2. Extract "CVE-2023-44487" from your question
3. Call `query_cve` with `{"cve_id": "CVE-2023-44487"}`
4. Receive the structured JSON response
5. Summarize in natural language with citation

Follow-up test queries:
- "Are there any critical vulnerabilities in Apache Log4j released in 2021?"
- "What's the CVSS score for CVE-2021-44228 and which products are affected?"
- "What would an attacker be able to do with CVE-2021-44228?" (this one requires *reasoning* over the tool output)

**Step 6: AIUC-1 B005 + B006 Verification**

Test your input validation:
- `cve_id = "CVE-2023-INVALID"` → should reject with clear error
- `cve_id = "'; DROP TABLE cve; --"` → should reject before API call
- `cve_id = "../../etc/passwd"` → should reject with schema validation

Document the security boundaries you've enforced.

---

## Deliverables

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the design, Cowork to structure and format the report, and Code to build the MCP server. The quality of your thinking matters — the mechanical production should be AI-assisted.

1. **MCP Server Design Document** — tool schema, validation logic, error handling strategy
2. **Design Decision Exercise** (table format) — tool call vs. agent reasoning for 5 scenarios with justifications
3. **Working MCP server code** (or documented design if infrastructure setup isn't complete)
4. **Test results** — 3 natural language queries and their outputs
5. **AIUC-1 B005/B006 verification log** — 3 invalid inputs and how your server rejected them

> **📁 Save to:** `~/noctua/tools/mcp-servers/week03-cve/` (server code), `~/noctua/deliverables/week03/` (final submission)

---

## AIUC-1 Integration

**Domain B (Security) — B005 and B006 introduced this week:**

- **B005 (Input Filtering):** Every tool input passes through schema validation before reaching business logic. Reject malformed, injection-attempting, or out-of-bounds inputs at the perimeter.
- **B006 (Limit Agent Access):** An agent performing CVE lookups gets the `query_cve` tool. Not `modify_firewall_rules`, not `delete_logs`. Minimal tool exposure is a security control, not just good design.

## V&V Lens

**Calibrated Trust — Tool outputs vs. agent reasoning deserve different trust levels:**

Tool outputs (from deterministic MCP calls) should be trusted as data — they come from authoritative sources with validation. Agent reasoning over tool outputs should be scrutinized — the agent's interpretation of CVE data is still LLM output.

This week: After Claude summarizes a CVE query result, check one claim against the raw tool output. Does the summary accurately represent the severity? Does it correctly describe affected products? Build the habit of not conflating "tool said X" with "agent's interpretation of what the tool said."
