# Week 5: Model Context Protocol (MCP) — The Agent-Tool Interface

**Semester 1 | Unit 2 — Weeks 5–8**

> **Building on Week 4:** Week 4 introduced the context engineering framework — system prompts, memory architectures, structured outputs, and retrieval as a conceptual model. Unit 2 builds the infrastructure that implements those concepts: standardized tool interfaces (MCP), secure tool design patterns, output schemas, and production-grade knowledge retrieval. By the end of Week 8, every component of the context engineering stack will have a working implementation behind it.

> **Start your context library now.** The context library is the collection of curated reference files you build throughout this course — prompts that worked, patterns you discovered, schemas you designed. Start it in Week 5. At the end of every lab this unit, add one entry. By Unit 4 you'll have a personal reference library you can pull into any Claude session. Save to `context-library/patterns/`.

## Learning Objectives

- Understand the historical evolution from custom API integrations to standardized agent-tool protocols
- Analyze MCP architecture (clients, servers, transports) and its security implications
- Evaluate MCP governance under the Linux Foundation and its role in AI standardization
- Compare MCP with alternative agent-tool frameworks (LLM-specific tools, proprietary platforms, REST APIs)
- Design a secure tool exposure strategy for a hypothetical security system

---

## Day 1 — Theory

### From Custom APIs to Standardized Protocols: The MCP Origin Story

For the first generation of AI agents (2022–2023), integrating external tools into LLM workflows was chaotic. Engineers built custom connectors for each LLM provider. A tool that worked with Claude required separate integration for GPT-4, and yet another for Gemini. Security teams couldn't audit tool access in a standardized way. There was no common language for describing what a tool could do, what it required, or how it failed.

Anthropic, in collaboration with community partners, recognized this fragmentation as a critical blocker for enterprise AI adoption. In late 2024, they released the **Model Context Protocol (MCP)**, an open standard that fundamentally changed how agents discover, access, and use external tools. Rather than building LLM-specific integrations, teams now build once and connect to any LLM that supports MCP.

> **Key Concept:** MCP solves the "integration sprawl" problem by establishing a standardized, transport-agnostic interface for agent-tool communication. This is analogous to how HTTPS became the standard for web security rather than requiring bespoke encryption for every web application.

**MCP through an OOP lens:**

| OOP Concept | MCP Equivalent |
|---|---|
| Class | MCP Server |
| Interface / Abstract class | Tool schema (the contract) |
| Method | Tool (single responsibility function) |
| Encapsulation | Server hides implementation, exposes only the schema |
| Access modifiers | PoLP — tools exposed only to agents that need them |
| Decorator pattern | Rate limiting + audit logging wrapping tools at the dispatch layer |
| Circuit breaker | Graceful degradation when external APIs fail |

**Where the analogy breaks — non-determinism:** In OOP you control the call graph. In agentic engineering the agent controls the call graph — you only control the boundaries. Temperature=0 and structured outputs make agent behavior more predictable, not deterministic. The orchestration layer — which tools get called, in what order, how intermediate results get interpreted — remains genuinely non-deterministic. Design for this: define boundaries, observe behavior over time, make audit trails mandatory.

---

### The MCP Architecture: Three Layers of Control

MCP defines three architectural components:

1. **Clients** — The AI agent or application that consumes tools. In a security context, this is often Claude running in Claude Code or Claude Agent SDK, tasked with analyzing threats, generating reports, or triaging alerts.

2. **Servers** — Stateless services that expose tools. A security team might run an MCP server that wraps their SIEM (Splunk, Elasticsearch), another for their vulnerability scanner, another for their threat intelligence feed. Each server is responsible for authentication, input validation, and logging.

3. **Transports** — The communication channel between clients and servers. MCP supports:
   - **stdio** — Standard input/output, used for local tools and Claude Code integrations
   - **HTTP/HTTPS** — For client-server architectures across networks
   - **WebSockets** — For persistent, bidirectional communication in real-time security operations

This three-layer model provides crucial security advantages. A client (agent) never directly executes code on the server; it sends structured requests and receives structured responses. The server can enforce rate limits, validate inputs, and log every interaction. The transport layer can be encrypted and authenticated independently.

> **Discussion:** If you were designing a tool that gives an AI agent access to your organization's vulnerability database, what security policies would you enforce at each layer (client restrictions, server validation, transport security)?

---

### Tool Discovery and Metadata

MCP servers expose their capabilities through a discovery mechanism. When an agent connects to an MCP server, the server responds with a list of available tools, including:
- **Tool name** — e.g., `query_cve`, `enrich_alert`, `fetch_logs`
- **Description** — Natural language description of what the tool does
- **Input schema** — JSON Schema defining required and optional parameters, types, constraints
- **Output schema** — JSON Schema defining the structure of responses
- **Error codes** — Documented failure modes and remediation steps

This metadata allows agents to understand what's available without requiring hardcoded knowledge.

> **Tool discovery as attack surface.** Every tool your MCP server exposes is discoverable by any agent (or attacker) with access to the server. Overpermissioned MCP servers don't just risk misuse — they enable capability amplification: an agent that should only read CVE data can instead scan networks if those tools are available. The governance response is allowance profiles — pre-approved lists of which tools each agent role can invoke. You'll implement this with Cedar policies in Unit 3.

**Principle of Least Privilege (PoLP) in tool design.** Every tool you build should expose the minimum capability needed for its declared purpose:
1. **Scope boundaries** — define what the tool will never return, not just what it will return
2. **Single responsibility** — one tool, one capability; resist adding convenience features that expand the attack surface
3. **Output contracts** — the tool's return schema is a security boundary; undocumented fields are unvalidated fields

---

### Governance and the Linux Foundation

In 2025, the Linux Foundation took governance of MCP, establishing it as a community-driven open standard. This matters for security teams because:

1. **No single vendor lock-in** — Microsoft, Google, Anthropic, and open-source maintainers all contribute to MCP's evolution
2. **Transparent roadmap** — Security-critical features (like enhanced audit logging) go through community review
3. **Long-term stability** — LF governance ensures MCP won't be abandoned or pivoted by a commercial entity
4. **Extensibility process** — New security features can be proposed and standardized across the ecosystem

**Comparing MCP to Alternatives:**

| Approach | Pros | Cons | Best For |
|---|---|---|---|
| **MCP** | Standardized, vendor-agnostic, auditable, composable | Requires server implementation | Enterprise, multi-LLM deployments |
| **LLM-Specific Tools** (e.g., Claude SDK tools) | Simple, well-documented | Lock-in to single LLM, no standardization | Prototypes, single-provider teams |
| **REST APIs** | Flexible, universally understood | No tool discovery, requires custom serialization | Legacy systems, unstructured tool access |
| **Proprietary Agent Frameworks** (e.g., proprietary SOAR) | Optimized for specific use case | Lock-in, expensive, slow to update | Highly specialized, risk-averse orgs |

MCP is rapidly becoming the industry standard for serious AI agent deployments because it balances standardization with flexibility.

> **OPA, Cedar, and PeaRL — three layers, not three alternatives.** OPA (Open Policy Agent) is the policy engine: it evaluates Cedar or Rego policy documents against a request and returns allow/deny. PeaRL is the governance framework built on top of OPA: it defines the structure of Allowance Profiles, the lifecycle of agent identities, and the audit trail that feeds your compliance reports. You write Cedar policy. OPA enforces it. PeaRL orchestrates the whole system. These are three layers, not three alternatives.

---

### The Service Layer Pattern

The most resilient tool architectures follow a critical principle: **build the REST API first, then layer the MCP server on top as a consumption client.** This pattern decouples core business logic from the AI integration layer.

```
Core Business Logic
      ↓
FastAPI/Flask REST API (with auth, rate limiting, structured responses)
      ↓
    ┌─────────────────────────────────┐
    ├── MCP Server (wrapper)           │
    ├── Web Dashboard (client)         │
    ├── CLI Tool (client)              │
    └── CI/CD Pipeline (client)        │
```

The MCP server is not the business logic — it's a translation layer. The pattern: your REST API or Python service holds the core logic; the MCP server is a thin wrapper that translates between Claude's tool call format and your service's interface. You can add rate limiting, authentication, and audit logging at the MCP layer without touching the core logic, and test the core logic independently.

---

### Context Engineering Failure Modes

> **The "Lost in the Middle" Effect — Why Tool Output Size Matters**
>
> Research on transformer attention patterns reveals a consistent finding: model performance on information retrieval degrades for content placed in the *middle* of a long context window. The model attends most strongly to content at the beginning (system prompt, early context) and the end (most recent user turn).
>
> For security agents:
> - **Large tool outputs get partially "lost"** — If a SIEM tool returns 10,000 log lines, relevant indicators in lines 4,000–6,000 receive less attention
> - **Design tool outputs to be focused** — Return the 10 most relevant events, not all 10,000. The tool's job is pre-filtering, not raw data dump
> - **Place critical context strategically** — High-priority information should appear at the start or end of your prompt, not buried in the middle

> **Context Anxiety — The Late-Session Failure Mode**
>
> Anthropic's engineering team identified a failure mode called **"context anxiety"**: models begin wrapping up work prematurely as they approach what they believe is their context limit — not because they've run out of context, but because they start behaving as if they need to finish quickly.
>
> Symptoms: agent starts summarizing instead of continuing work, declares tasks "complete" that aren't, stops exploring alternatives, output quality degrades in the last 20% of a long session.
>
> **Compaction vs. Context Reset:** `/compact` helps but doesn't fully resolve context anxiety. A context *reset* (start a fresh agent with a structured handoff artifact) provides a clean slate. This is why `/build-spec` writes output to `plans/` — the spec package survives context resets.
>
> *Source: Anthropic Engineering, "Harness design for long-running application development," March 2026.*

> **Memory Surfaces — Where Agent Data Actually Lands**
>
> Before building data governance policies, map every surface where your agent writes data:
> - **Conversation history** — the message array grows every turn; persistence: session duration
> - **Tool call results** — verbose API responses injected into context unfiltered unless PostToolUse hooks intervene
> - **Scratchpad and progress files** — unstructured writes to disk; persistence: indefinite, often forgotten
> - **External memory systems** — vector databases, MCP resources, write-backs (Slack, CRM); persistence: indefinite, cross-session
>
> The memory surface map is the prerequisite for any data governance or retention policy. If you don't know where data lands, you can't govern it.

> **PII Accumulation Drift**
>
> Unlike a single PII disclosure event, **accumulation drift** is invisible in any individual turn — it only becomes a compliance exposure at the session or system level. An agent that handles customer support tickets may receive a name in turn 3, an address in turn 7, and a partial credit card number in turn 12. No single turn violated policy. The conversation history at turn 12 is a GDPR data collection event.
>
> Controls: (1) PostToolUse hooks to strip PII from tool results before they enter context; (2) the scratchpad pattern — explicit structured writes with declared fields replace uncontrolled context growth; (3) session-scoped memory with automatic disposal on session end.

---

### Day 1 Deliverable

Write a **2-page analysis** (500–750 words) comparing how MCP would change your current tool integration workflow. If you're using REST APIs, Zapier, or custom connectors to link your security tools, describe:

1. Current pain points in your integration
2. How MCP's standardized interface would address them
3. How tool discovery and metadata would improve your workflow
4. One security consideration you'd need to evaluate

---

## Day 2 — Lab

### Lab: CVE Lookup MCP Server

**Lab Objectives:**
- Build a functional MCP server that exposes a security tool (CVE database lookup)
- Connect the MCP server to Claude Code via stdio transport
- Interact with the agent using natural language to query the tool
- Understand the tool discovery, request/response cycle, and error handling in MCP
- Document the server, validate inputs, and measure performance

### Part 1: Setup

**Prerequisites:**
- Python 3.11+ or Node.js 18+
- Claude Code installed
- A public CVE database API key (NVD API is free; no key required for basic queries)

> **What You're Wrapping — The NVD API**
>
> Your MCP server is a structured interface in front of the NIST National Vulnerability Database (NVD) REST API:
> - **Endpoint:** `https://services.nvd.nist.gov/rest/json/cves/2.0`
> - **Query by CVE ID:** append `?cveId=CVE-2023-44487` — returns CVSS score, severity, affected products, references
> - **Query by keyword:** append `?keywordSearch=openssl&cvssV3Severity=CRITICAL`
> - **Auth:** unauthenticated = 5 req/30 sec; free API key (register at nvd.nist.gov) = 50 req/30 sec
>
> The MCP layer adds: input validation (CVE format check before the call), schema enforcement (structured output the agent can reason over), error handling (rate limits, unreachable API), and the natural language interface. The NVD API does the actual data retrieval.

```bash
mkdir -p ~/noctua-labs/unit2/week5
cd ~/noctua-labs/unit2/week5

# Python
pip install mcp httpx pydantic

# Or Node.js
# npm init -y && npm install @modelcontextprotocol/sdk axios
```

### Part 2: Design the CVE Lookup Tool

Your MCP server will expose a single tool: `query_cve`.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "cve_id": {
      "type": "string",
      "description": "CVE identifier in format CVE-YYYY-NNNNN (e.g., CVE-2023-44487)",
      "pattern": "^CVE-[0-9]{4}-[0-9]{4,6}$"
    },
    "include_remediation": {
      "type": "boolean",
      "description": "Whether to include remediation steps (default: true)",
      "default": true
    }
  },
  "required": ["cve_id"]
}
```

**Output Schema:**

```json
{
  "type": "object",
  "properties": {
    "cve_id": {"type": "string"},
    "published": {"type": "string", "format": "date-time"},
    "description": {"type": "string"},
    "severity": {"type": "string", "enum": ["critical", "high", "medium", "low", "unknown"]},
    "cvss_v3_score": {"type": "number", "minimum": 0, "maximum": 10},
    "affected_products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor": {"type": "string"},
          "product": {"type": "string"},
          "affected_versions": {"type": "array", "items": {"type": "string"}}
        }
      }
    },
    "remediation": {"type": "string"},
    "references": {"type": "array", "items": {"type": "string", "format": "uri"}}
  },
  "required": ["cve_id", "description", "severity"]
}
```

> **Common Pitfall:** CVE databases have rate limits and uptime issues. Always implement retry logic and fallback responses. If the NVD API is unreachable, return a cached response or a user-friendly error message rather than crashing.

### Part 3: Implement the MCP Server

**Architecture Decision: MCP Server vs. API Client**

An MCP server is middleware that:
1. Exposes tools to Claude via a standardized interface
2. Validates tool inputs using schemas (Pydantic models)
3. Calls external APIs (e.g., NVD for CVE data)
4. Returns structured responses back to Claude

Rather than deploying a full MCP server immediately, use Claude Code to understand the logic first:

```
Teach me how an MCP server would work for CVE lookups. Walk through the architecture:

1. INPUT VALIDATION: If a user asks for "CVE-2023-44487", how would we validate it's a real CVE format?

2. EXTERNAL API CALL: Write pseudocode for calling the NVD API to fetch details.
   What parameters? What response shape?

3. PARSING: Given an NVD response JSON (I'll provide an example), extract:
   - CVSS v3 score
   - Severity (critical/high/medium/low based on score)
   - Affected products (vendor, product, versions)
   - References

4. RESPONSE FORMATTING: Shape the parsed data into a structured response a Claude agent would understand.

5. ERROR HANDLING: What could go wrong? (Timeout, malformed CVE ID, API rate limiting, network error)

Then show me: If Claude asked for CVE-2023-44487, what would the MCP server return?

[Include a sample NVD API response here so Claude can work with real data]
```

After Claude explains the architecture, ask:
- "Show me the validation schema (Pydantic model) for a CVE query"
- "Write the async function that calls NVD and parses the response"
- "How would you implement error handling for timeouts?"
- "What JSON schema would Claude see so it knows what parameters to pass?"

**When to Build a Real MCP Server:**

Build an actual MCP server when:
- You have repeated tool calls (worth the infrastructure cost)
- You need persistent state (caching, rate limiting)
- You're deploying to production (security, reliability, monitoring)
- You're integrating with proprietary APIs (credential management)

Don't build one when:
- You're learning (use Claude Code)
- Tool calls are infrequent (overhead not justified)
- You're prototyping (iteration is slow with infrastructure)

### Part 4: Connect to Claude Code

Create a `claude_code_config.json`:

```json
{
  "mcpServers": {
    "cve-lookup": {
      "command": "python",
      "args": ["cve_mcp_server.py"]
    }
  }
}
```

Then register your MCP server with Claude:

```bash
claude mcp add cve-lookup -- python cve_mcp_server.py
```

### Part 5: Test with the Agent

In Claude Code:

```
I'd like you to help me check a few CVEs. First, what is CVE-2023-44487?
```

The agent should:
1. Discover the `query_cve` tool
2. Parse the CVE ID from your question
3. Call `query_cve` with `{"cve_id": "CVE-2023-44487"}`
4. Receive the JSON response
5. Summarize the findings in natural language

Try these follow-up queries:
- "Are there any critical vulnerabilities in Apache Log4j released in 2023?"
- "Find the CVSS score for CVE-2021-44228 and tell me the affected products."
- "What recent vulnerabilities affect OpenSSL?"

Measure response time and accuracy. Note whether the agent correctly parses CVE IDs and filters by date or severity.

### Part 6: Error Handling and Edge Cases

Add error handling for:
1. **Malformed CVE IDs** — "CVE-2023-INVALID" should reject with schema validation error
2. **Non-existent CVEs** — Return a graceful "not found" message
3. **API timeouts** — Return a timeout error with retry guidance
4. **Rate limiting** — Detect HTTP 429 and wait before retrying

Test each error case and document how your server handles it.

---

## Deliverables

> **Produce these deliverables using Claude Code.** Use Claude Code's chat to design the architecture, Code mode to build and test the server.

1. **MCP Server Code** (Python or Node.js)
   - Well-commented, with logging
   - Input validation using schemas
   - Error handling for all identified edge cases
   - Deploy instructions (dependencies, how to run)

2. **Tool Schema Documentation**
   - Input and output JSON schemas
   - Example request/response
   - Error codes and recovery steps

3. **Performance Report**
   - Time to first CVE lookup: _____ ms
   - Time for 5 sequential queries: _____ ms
   - Timeout rate under normal load: _____ %
   - Any API rate-limiting issues encountered: _____

4. **Demo Video or Walkthrough** (3–5 minutes)
   - Show the MCP server starting
   - Show Claude Code connecting and discovering tools
   - Show the agent answering 3–5 natural language queries
   - Demonstrate one error case and recovery

> **Save to:** `~/noctua-labs/unit2/week5/` (server code), `context-library/patterns/` (add one entry for a pattern you discovered)

---

## Sources & Tools

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [NVD API Documentation](https://nvd.nist.gov/developers/vulnerabilities)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [NIST Vulnerability Metrics Reference](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-113.pdf)
