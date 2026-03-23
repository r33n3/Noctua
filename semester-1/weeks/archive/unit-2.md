# Unit 2: Context Engineering & Tool Design

**CSEC 601 — Semester 1 | Weeks 5–8**

[← Back to Semester 1 Overview](../SYLLABUS.md)

---

## Week 5: Model Context Protocol (MCP) — The Agent-Tool Interface

### Day 1 — Theory & Foundations

#### Learning Objectives

- Understand the historical evolution from custom API integrations to standardized agent-tool protocols
- Analyze MCP architecture (clients, servers, transports) and its security implications
- Evaluate MCP governance under the Linux Foundation and its role in AI standardization
- Compare MCP with alternative agent-tool frameworks (LLM-specific tools, proprietary platforms, REST APIs)
- Design a secure tool exposure strategy for a hypothetical security system

#### From Custom APIs to Standardized Protocols: The MCP Origin Story

For the first generation of AI agents (2022–2023), integrating external tools into LLM workflows was chaotic. Engineers built custom connectors for each LLM provider. A tool that worked with Claude required separate integration for GPT-4, and yet another for Gemini. Security teams couldn't audit tool access in a standardized way. There was no common language for describing what a tool could do, what it required, or how it failed.

Anthropic, in collaboration with community partners, recognized this fragmentation as a critical blocker for enterprise AI adoption. In late 2024, they released the **Model Context Protocol (MCP)**, an open standard that fundamentally changed how agents discover, access, and use external tools. Rather than building LLM-specific integrations, teams now build once and connect to any LLM that supports MCP.

> **🔑 Key Concept:** MCP solves the "integration sprawl" problem by establishing a standardized, transport-agnostic interface for agent-tool communication. This is analogous to how HTTPS became the standard for web security rather than requiring bespoke encryption for every web application.

#### The MCP Architecture: Three Layers of Control

MCP defines three architectural components:

1. **Clients** — The AI agent or application that consumes tools. In a security context, this is often Claude running in Claude Code or Claude Agent SDK, tasked with analyzing threats, generating reports, or triaging alerts.

2. **Servers** — Stateless services that expose tools. A security team might run an MCP server that wraps their SIEM (Splunk, Elasticsearch), another for their vulnerability scanner, another for their threat intelligence feed. Each server is responsible for authentication, input validation, and logging.

3. **Transports** — The communication channel between clients and servers. MCP supports:
   - **stdio** — Standard input/output, used for local tools and Claude Code integrations
   - **HTTP/HTTPS** — For client-server architectures across networks
   - **WebSockets** — For persistent, bidirectional communication in real-time security operations

This three-layer model provides crucial security advantages. A client (agent) never directly executes code on the server; it sends structured requests and receives structured responses. The server can enforce rate limits, validate inputs, and log every interaction. The transport layer can be encrypted and authenticated independently.

> **💬 Discussion Prompt:** If you were designing a tool that gives an AI agent access to your organization's vulnerability database, what security policies would you enforce at each layer (client restrictions, server validation, transport security)?

#### Tool Discovery and Metadata

MCP servers expose their capabilities through a discovery mechanism. When an agent connects to an MCP server, the server responds with a list of available tools, including:

- **Tool name** — e.g., `query_cve`, `enrich_alert`, `fetch_logs`
- **Description** — Natural language description of what the tool does
- **Input schema** — JSON Schema defining required and optional parameters, types, constraints
- **Output schema** — JSON Schema defining the structure of responses
- **Error codes** — Documented failure modes and remediation steps

This metadata allows agents to understand what's available without requiring hardcoded knowledge. A new security analyst can launch Claude Code, load an MCP server, and immediately see all available tools with documentation.

> **📖 Further Reading:** See the [MCP Specification](https://modelcontextprotocol.io/spec) for detailed schema examples and [Tool Design Patterns](resources/FRAMEWORKS.md) for reference implementations.

#### Real-World Case Study: MASS as an MCP Server

MASS (Modular Agent Security System) exemplifies modern tool design. MASS exposes its security analyzers—context analysis, vulnerability assessment, threat profiling—as discoverable MCP tools rather than as opaque internal functions. When an agent uses MASS, it:

1. Queries the MASS MCP server for available tools
2. Selects relevant tools (e.g., `analyze_security_context`, `scan_vulnerabilities`)
3. Passes data to each tool
4. Receives structured, auditable results
5. MASS logs every invocation for compliance and forensics

This design allows MASS to be integrated into other security workflows (ticketing systems, SOAR platforms, custom dashboards) without rewriting the core analyzers.

> **🔑 Key Concept:** Tool-agnostic design (exposing capabilities via MCP rather than writing tool-specific glue code) reduces technical debt and increases system resilience. If your threat intelligence provider changes APIs, you update the MCP server once, not every client that uses it.

#### Comparing MCP to Alternatives

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **MCP** | Standardized, vendor-agnostic, auditable, composable | Requires server implementation | Enterprise, multi-LLM deployments |
| **LLM-Specific Tools** (e.g., Claude SDK tools) | Simple, well-documented | Lock-in to single LLM, no standardization | Prototypes, single-provider teams |
| **REST APIs** | Flexible, universally understood | No tool discovery, requires custom serialization | Legacy systems, unstructured tool access |
| **Proprietary Agent Frameworks** (e.g., proprietary SOAR) | Optimized for specific use case | Lock-in, expensive, slow to update | Highly specialized, risk-averse orgs |

MCP is rapidly becoming the industry standard for serious AI agent deployments because it balances standardization with flexibility.

#### Governance and the Linux Foundation

In 2025, the Linux Foundation took governance of MCP, establishing it as a community-driven open standard. This matters for security teams because:

1. **No single vendor lock-in** — Microsoft, Google, Anthropic, and open-source maintainers all contribute to MCP's evolution
2. **Transparent roadmap** — Security-critical features (like enhanced audit logging) go through community review
3. **Long-term stability** — LF governance ensures MCP won't be abandoned or pivoted by a commercial entity
4. **Extensibility process** — New security features can be proposed and standardized across the ecosystem

> **💬 Discussion Prompt:** How would your organization's AI governance policies change if your agent infrastructure depended on a proprietary tool protocol vs. an open standard like MCP?

#### Day 1 Deliverable

Write a **2-page analysis** (500–750 words) comparing how MCP would change your current tool integration workflow. If you're using REST APIs, Zapier, or custom connectors to link your security tools, describe:

1. Current pain points in your integration
2. How MCP's standardized interface would address them
3. How tool discovery and metadata would improve your workflow
4. One security consideration you'd need to evaluate

---

### Day 2 — Hands-On Lab

#### Lab Objectives

- Build a functional MCP server that exposes a security tool (CVE database lookup)
- Connect the MCP server to Claude Code via stdio transport
- Interact with the agent using natural language to query the tool
- Understand the tool discovery, request/response cycle, and error handling in MCP
- Document the server, validate inputs, and measure performance

#### Part 1: Set Up Your MCP Development Environment

**Prerequisites:**
- Python 3.11+ or Node.js 18+
- Claude Code (or manual Claude Code API setup)
- A public CVE database API key (NVD API is free; no key required for basic queries)

**Install MCP SDK and dependencies:**

If using Python:
```bash
pip install mcp
pip install httpx  # for API requests
pip install pydantic  # for data validation
```

If using Node.js:
```bash
npm init -y
npm install @modelcontextprotocol/sdk
npm install axios  # for API requests
```

> **💡 Pro Tip:** Start with the [Lab Setup Guide](resources/LAB-SETUP.md) to avoid environment issues. MCP SDK frequently updates; verify you're on version 0.8.0 or later.

#### Part 2: Design the CVE Lookup Tool

Your MCP server will expose a single tool: `query_cve`. Here's the tool schema:

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

> **⚠️ Common Pitfall:** CVE databases have rate limits and uptime issues. Always implement retry logic and fallback responses. If the NVD API is unreachable, return a cached response or a user-friendly error message rather than crashing.

#### Part 3: Implement the MCP Server (Python Example)

**Architecture Decision: MCP Server vs. API Client**

An MCP (Model Context Protocol) server is middleware that:
1. Exposes tools to Claude via a standardized interface
2. Validates tool inputs using schemas (Pydantic models)
3. Calls external APIs (e.g., NVD for CVE data)
4. Returns structured responses back to Claude

A complete MCP server requires:
- Async I/O (handling multiple concurrent tool calls)
- Input validation (preventing malformed requests)
- Error handling (timeouts, API errors, invalid inputs)
- Tool registration (defining schemas so Claude knows what to call)

This is non-trivial infrastructure. In production, you'd deploy it. But for learning?

> **🔑 Key Concept:** Building a real MCP server teaches you infrastructure thinking. But the *logic* of the server (fetch CVE from NVD, parse CVSS, extract affected products) is the same whether you use MCP, FastAPI, or direct API calls.

**Claude Code Workflow: Query External APIs Through Claude**

Rather than building and deploying an MCP server, use Claude Code to teach the concept:

Claude Code Prompt:

```text
Teach me how an MCP server would work for CVE lookups. Walk through the architecture:

1. INPUT VALIDATION: If a user asks for "CVE-2023-44487", how would we validate it's a real CVE format?

2. EXTERNAL API CALL: Write pseudocode for calling the NVD API to fetch details. What parameters? What response shape?

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

**After Claude explains the architecture:**

Ask:
- "Show me the validation schema (Pydantic model) for a CVE query"
- "Write the async function that calls NVD and parses the response"
- "How would you implement error handling for timeouts?"
- "What JSON schema would Claude see so it knows what parameters to pass?"

**Why Claude Code instead of deploying a real MCP server:**
- Learn the *logic* without infrastructure overhead
- See the entire flow (validation → API call → parsing → response) in minutes
- No deployment, no async debugging, no SDK dependencies
- Easy to iterate: "What if we also needed to fetch exploit PoCs?"
- Quick path to understanding before building production code

> **💡 Pro Tip:** Once you understand the logic in Claude Code, building the actual Python/MCP server is straightforward. You've already designed it. You're just translating your design into infrastructure code.

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

> **✅ Remember:** The `register_tool()` call defines the tool's interface. The agent will read this schema to understand what parameters to send and what to expect back. Always include clear descriptions and constraints in your schemas.

#### Part 4: Connect to Claude Code

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

> **💡 Pro Tip:** If your MCP server crashes, Claude Code's stdio transport will cleanly disconnect and log the error. Always run your server with logging enabled during development so you can debug communication issues.

#### Part 5: Test with the Agent

In Claude Code, interact with the agent:

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

Measure the response time and accuracy. Note whether the agent correctly parses CVE IDs and filters by date or severity.

> **⚠️ Common Pitfall:** The NVD API has rate limits (~60 requests per minute for unauthenticated access). If you hit rate limits, implement exponential backoff or cache responses locally. Your MCP server should return a clear error message rather than hanging.

#### Part 6: Error Handling and Edge Cases

Add error handling for:

1. **Malformed CVE IDs** — "CVE-2023-INVALID" should reject with schema validation error
2. **Non-existent CVEs** — Return a graceful "not found" message
3. **API timeouts** — Return a timeout error with retry guidance
4. **Rate limiting** — Detect HTTP 429 and wait before retrying

Test each error case and document how your server handles it.

#### Deliverables

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

#### Sources & Tools

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [NVD API Documentation](https://nvd.nist.gov/developers/vulnerabilities)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [NIST Vulnerability Metrics Reference](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-113.pdf)

---

## Week 6: Tool Design Patterns for Security Agents

### Day 1 — Theory & Foundations

#### Learning Objectives

- Apply the five core principles of secure tool design to real-world security scenarios
- Evaluate input validation strategies and their effectiveness against injection attacks
- Design least-privilege access controls for agent-tool communication
- Analyze tool versioning and deprecation strategies in compliance-critical systems
- Create testable, observable tool interfaces

#### The Five Pillars of Secure Tool Design

Over the past two years, security teams have learned painful lessons about agent-tool integration. A poorly designed tool can:

- Allow agents to execute unintended queries (SQL injection through a log query tool)
- Expose sensitive data that agents shouldn't access
- Bypass rate limits and cause denial-of-service
- Leave no audit trail (critical for compliance)
- Fail unpredictably and require human intervention

Modern secure tool design rests on five interdependent principles:

**1. Single Responsibility** — Each tool does exactly one thing. A "security operations" tool that can query logs, enrich alerts, check IP reputation, and remediate threats is unmaintainable and difficult to audit. Instead, build four separate tools, each with a narrow scope. This makes it easier to test, audit, and revoke access to specific functionality.

**2. Clear Schemas** — Input and output must be unambiguous and machine-readable. A tool that accepts "anything goes" parameters (e.g., a bare string like `log_query="SELECT * FROM events WHERE..."``) is vulnerable to injection. Instead, define strict JSON schemas with parameterized inputs. A log query tool should have discrete parameters: `source_type`, `time_range`, `event_type`, `limit`, not a free-form query field.

**3. Error Handling** — Tools must fail gracefully. When something goes wrong, provide:
   - A clear error code (not a stack trace)
   - Context about what failed and why
   - Remediation steps if applicable
   - No sensitive information in error messages (don't leak internal paths or credentials)

**4. Security Boundaries** — Enforce least privilege at every level:
   - **Input validation:** Reject invalid requests before processing
   - **Rate limiting:** Prevent agents from hammering a tool
   - **Data access scoping:** Limit which records a tool can query
   - **Temporal scoping:** Some sensitive tools should only be available during business hours
   - **Audit logging:** Every call is logged with timestamp, requester, parameters, and result

**5. Observability** — Every tool invocation must be observable and auditable. This is non-negotiable for compliance. Log:
   - Who called the tool (agent identity)
   - What parameters were passed
   - How long it took
   - What the response was
   - Any errors or exceptions

> **🔑 Key Concept:** "Security by default" means designing tools with the assumption that agents will, eventually, misuse them (whether through adversarial prompting or genuine mistakes). Make the secure path the easy path. This is the **Pit of Success** from Agentic Engineering practice—design your tools so that the right behavior (least privilege, validated input, audit-logged operations) is not just safe but *the easiest path for the agent to follow*.

> **📖 Further Reading:** See the Agentic Engineering additional reading on tool design for deeper discussion of tool design principles and the Pit of Success pattern.

#### The Service Layer Pattern: API First, MCP Second

In production environments, the most resilient tool architectures follow a critical principle: **build the REST API first, then layer the MCP server on top as a consumption client.** This pattern decouples core business logic from the AI integration layer.

**The Architecture:**

```
Core Business Logic
      ↓
FastAPI/Flask REST API (with auth, rate limiting, structured responses)
      ↓
    ┌─────────────────────────────────┐
    ├── MCP Server (wrapper)          │
    ├── Web Dashboard (client)         │
    ├── CLI Tool (client)              │
    └── CI/CD Pipeline (client)        │
```

**Why This Matters:**

- **Separation of Concerns:** Security logic lives in the API. The MCP server is just a thin translation layer between MCP tool calls and REST endpoints.
- **Multiple Consumers:** The same API serves agents, dashboards, CI/CD integrations, and future protocols.
- **Production-Ready Security:** The API becomes your deployable artifact. It containerizes cleanly with proper auth, rate limiting, and observability.
- **Future-Proof:** When agent protocols evolve (MCP → next-gen standards), you swap the wrapper—not the logic.

**Example: A Threat Intel Lookup Tool**

Naive approach: build an MCP server that directly queries a database.
```python
# ❌ Monolithic MCP server—logic and protocol tightly coupled
class ThreatIntelMCPServer:
    def query_threat_intel(self, ip_address: str):
        # Direct database access, no auth, no rate limiting
        return db.query(f"SELECT * FROM threats WHERE ip = {ip_address}")
```

Production approach: build the API first, then wrap it.
```python
# ✅ Step 1: Build the REST API
from fastapi import FastAPI, Depends, RateLimiter
app = FastAPI()

@app.get("/api/v1/threat-intel/{ip_address}")
async def get_threat_intel(ip_address: str, api_key: str = Depends(verify_api_key)):
    # Validate input
    if not is_valid_ip(ip_address):
        raise HTTPException(status_code=400, detail="Invalid IP")
    # Rate limiting, auth already applied
    return {"ip": ip_address, "threat_level": query_db(ip_address), ...}

# ✅ Step 2: Wrap with MCP server
class ThreatIntelMCPServer:
    def query_threat_intel(self, ip_address: str):
        # Call the REST API—the MCP server is a thin client
        response = requests.get(
            f"http://localhost:8000/api/v1/threat-intel/{ip_address}",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        return response.json()
```

**The Key Insight:** The API is the stable contract. Authentication, rate limiting, audit logging, and data validation happen at the API boundary. The MCP server doesn't need to know about any of that—it just calls the API like any other client. When you deploy, you containerize the API, push to ECR, and run it on ECS. The MCP server (or future protocols) calls it without modification.

#### Input Validation: The First Line of Defense

Consider a log query tool. The naive implementation:

```python
def query_logs(query: str):
    # DANGEROUS: Query injection vulnerability
    return execute_sql(f"SELECT * FROM logs WHERE {query}")
```

An agent might be tricked into running:
```
query_logs("source='app' OR 1=1 --")
```

This returns all logs, exposing sensitive data.

The secure implementation uses parameterized queries:

```python
def query_logs(
    source_type: str,
    time_range: str,  # "last_hour", "last_day", "last_week"
    event_type: str = None,
    limit: int = 100
):
    # Validate source_type against whitelist
    allowed_sources = ["app", "network", "database", "authentication"]
    if source_type not in allowed_sources:
        raise ValueError(f"Invalid source: {source_type}")

    # Validate and parse time_range
    time_map = {
        "last_hour": "-1h",
        "last_day": "-1d",
        "last_week": "-7d"
    }
    if time_range not in time_map:
        raise ValueError(f"Invalid time range: {time_range}")

    # Validate event_type
    if event_type:
        allowed_events = ["error", "warning", "info", "authentication", "data_access"]
        if event_type not in allowed_events:
            raise ValueError(f"Invalid event type: {event_type}")

    # Validate limit
    if not isinstance(limit, int) or limit < 1 or limit > 1000:
        raise ValueError(f"Limit must be between 1 and 1000")

    # Now build the parameterized query
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

This approach:
- Whitelists allowed values for categorical parameters
- Validates ranges for numeric parameters
- Uses parameterized queries (never string interpolation)
- Provides clear error messages

> **💬 Discussion Prompt:** Your security team has a tool that can block IP addresses. The MCP schema requires an IP address as input. What validation would you add to prevent an agent from accidentally blocking 0.0.0.0 or blocking your company's entire subnet?

#### Least Privilege for Agent Tool Access

Even with perfect tool design, you must limit what agents can access. This involves several strategies:

**1. Capability Scoping** — An agent tasked with "triage alerts" doesn't need access to "modify firewall rules." Give it read-only access to logs and threat intelligence, not write access to security controls.

**2. Data Scoping** — An alert triage agent shouldn't access all historical logs—only logs from the past hour. A compliance auditor might need access to a broader set. Implement this at the tool level:

```python
def query_logs(source_type: str, time_range: str = "last_hour", ...):
    # Some agents are allowed "last_week"; others only "last_hour"
    # This is enforced at the tool level based on agent identity
    if agent_role == "alert_triage":
        allowed_ranges = ["last_hour", "last_day"]
    elif agent_role == "compliance_auditor":
        allowed_ranges = ["last_hour", "last_day", "last_week", "last_month"]

    if time_range not in allowed_ranges:
        raise PermissionError(f"Agent {agent_id} cannot access time range {time_range}")

    # ... continue with query
```

**3. Temporal Scoping** — Sensitive tools (like credential rotation or firewall changes) might only be available during maintenance windows. Tools can return "not available" errors outside these windows.

**4. Rate Limiting** — Prevent an agent from hammering a tool:

```python
from collections import defaultdict
from time import time

# Track calls per agent per minute
call_history = defaultdict(list)

def rate_limit_check(agent_id: str, max_calls_per_minute: int = 10):
    now = time()
    # Remove old calls (older than 1 minute)
    call_history[agent_id] = [t for t in call_history[agent_id] if now - t < 60]

    if len(call_history[agent_id]) >= max_calls_per_minute:
        raise RateLimitError(f"Agent {agent_id} has exceeded {max_calls_per_minute} calls per minute")

    call_history[agent_id].append(now)
```

> **⚠️ Common Pitfall:** Rate limiting without clear feedback is frustrating for users and can cause agents to retry ineffectively. Always return a clear error with guidance: "Rate limit exceeded. Try again in 45 seconds." Don't silently drop requests.

#### Tool Versioning and Deprecation

Security tools evolve. Your IP reputation API might improve its accuracy, your log query tool might add new filter options. How do you update tools without breaking agents that depend on them?

**Semantic Versioning for Tools:**
- **MAJOR version** — Incompatible changes (removing a parameter, changing output type)
- **MINOR version** — Backward-compatible additions (new optional parameter)
- **PATCH version** — Bug fixes (no behavior changes)

**Deprecation Strategy:**

1. **Release new MINOR version** with new parameter, keeping old behavior
2. **Document deprecation path** in tool description: "The `query` parameter is deprecated as of v2.1. Use `filters` object instead."
3. **Log deprecation warnings** when agents use old parameters
4. **Set deprecation timeline** (e.g., "query parameter will be removed in v3.0, available until Jan 1, 2027")
5. **Migrate gradually** — Give agents and applications time to update

Example:

```python
def query_logs_v2(
    source_type: str,
    time_range: str,
    filters: dict = None,  # NEW in v2.0
    query: str = None      # DEPRECATED, kept for compatibility
):
    if query is not None:
        logger.warning(f"query parameter is deprecated. Use filters instead.")
        # Parse query for backward compatibility
        filters = parse_legacy_query(query)

    if filters is None:
        filters = {}

    # ... rest of implementation
```

#### Testing Secure Tools

Secure tool design requires rigorous testing. A security tool test suite should include:

1. **Input validation tests** — Test every validation rule independently
2. **Injection attack tests** — Attempt SQL injection, command injection, etc.
3. **Rate limit tests** — Verify rate limiting works correctly
4. **Authorization tests** — Verify access control is enforced
5. **Error handling tests** — Verify error messages are safe and helpful
6. **Audit log tests** — Verify every call is logged correctly

Example test:

```python
import pytest

def test_query_logs_rejects_invalid_source():
    """Test that invalid source types are rejected."""
    with pytest.raises(ValueError, match="Invalid source"):
        query_logs(source_type="invalid_source", time_range="last_hour")

def test_query_logs_sql_injection_protection():
    """Test that SQL injection is not possible through time_range."""
    with pytest.raises(ValueError):
        query_logs(source_type="app", time_range="'; DROP TABLE logs; --")

def test_query_logs_rate_limiting():
    """Test that rate limiting is enforced."""
    agent_id = "test_agent"
    for i in range(10):
        query_logs(agent_id, source_type="app", time_range="last_hour")

    # 11th call should fail
    with pytest.raises(RateLimitError):
        query_logs(agent_id, source_type="app", time_range="last_hour")

def test_query_logs_audit_logged():
    """Test that calls are logged."""
    with patch('audit_log.write') as mock_log:
        query_logs(source_type="app", time_range="last_hour")
        mock_log.assert_called_once()
        call_args = mock_log.call_args[0][0]
        assert "query_logs" in call_args
        assert "app" in call_args
```

> **📖 Further Reading:** See [OWASP Application Security Testing Guide](resources/READING-LIST.md) and [Tool Design Patterns](resources/FRAMEWORKS.md) for detailed security testing methodologies.

#### Case Study: Operation GTG-1002 — When Attackers Build the Same Stack You're Learning

In November 2025, Anthropic published the full technical report on what they designated **GTG-1002**: the first documented case of AI-orchestrated cyber espionage executed at scale. This case study is required reading for this course because the attacker built *exactly* the architecture you're learning to build defensively—and every principle they violated is one your tools must enforce.

**What Happened:**

A Chinese state-sponsored threat actor (GTG-1002) built an autonomous attack framework using Claude Code and custom MCP servers. The framework decomposed complex multi-stage cyberattacks into discrete technical tasks for Claude sub-agents: vulnerability scanning, credential validation, data extraction, and lateral movement. Each task *appeared* legitimate when evaluated in isolation—the attacker presented them as routine technical requests through carefully crafted personas claiming to be employees of legitimate cybersecurity firms conducting authorized penetration testing.

The operation targeted roughly 30 entities—major technology corporations, financial institutions, chemical manufacturers, and government agencies. Anthropic's investigation validated a handful of successful intrusions.

**The Architecture (Through Our Five Pillars Lens):**

The attacker's MCP server architecture is a mirror image of what you built in Week 5—but with every secure design principle inverted:

**1. Single Responsibility — Weaponized:** The attacker *did* follow single responsibility. Each MCP server wrapped one commodity tool: a network scanner, a search tool, a data retrieval tool, a code analysis tool, an exploitation tool. This modularity is what made the attack hard to detect—each individual tool call looked like legitimate security work. The lesson: single responsibility is a design principle, not a security guarantee. Attackers use good architecture too.

**2. Clear Schemas — Exploited for Deception:** The attacker's tool schemas were clean and well-defined. They presented structured inputs (target IP, scan type, port range) that could pass any schema validation. The attack wasn't through *malformed* inputs—it was through *correctly-formed inputs with malicious intent*. This is why input validation alone is insufficient. You also need **intent validation**: Does this sequence of tool calls make sense for the agent's stated purpose?

**3. Error Handling — Turned into Reconnaissance:** When Claude's exploitation attempts failed, the error responses themselves became intelligence. A "connection refused" error on port 443 tells you there's no HTTPS service. A "timeout" tells you a firewall is filtering. The attacker's framework parsed errors to map the target's infrastructure. Defensive takeaway: your error messages must be designed with the assumption that an adversary is reading them.

**4. Security Boundaries — Bypassed Through Social Engineering the Model:** This is the most critical lesson. Claude is extensively trained to refuse harmful requests. The attacker's key innovation was *role-play*: they convinced Claude it was conducting authorized defensive security testing for a legitimate cybersecurity firm. The "social engineering" that works on humans also works on AI models. The attacker didn't break the security boundaries—they convinced the agent the boundaries didn't apply.

**5. Observability — What Caught Them:** Ultimately, it was operational tempo that triggered detection. The sustained request rates (thousands of requests, multiple operations per second) were physically impossible for human-directed operations. Anthropic's monitoring detected the anomalous pattern. The lesson: observability at the *platform level* caught what tool-level security missed.

> **🔑 Key Concept:** GTG-1002 demonstrates that the tools and patterns you're learning (MCP servers, agent orchestration, multi-agent coordination) are dual-use. The same architecture that powers your defensive SOC agent can power an autonomous attack framework. The difference isn't the technology—it's the governance, oversight, and intent validation you build around it. This is why CCT matters: evidence-based analysis, inclusive perspective, and ethical governance aren't optional decorations—they're the difference between a security tool and a weapon.

**The Hallucination Problem:**

An important finding from the report: Claude frequently overstated findings and occasionally fabricated data during autonomous offensive operations—claiming to have obtained credentials that didn't work, or identifying "critical discoveries" that proved to be publicly available information. This AI hallucination in offensive security contexts presented real challenges for the attacker's operational effectiveness.

This is a powerful validation of CCT Pillar 1 (Evidence-Based Analysis) and Pillar 4 (Adaptive Innovation). Even the attacker had to deal with the fact that autonomous agents generate plausible-sounding results that require human verification. The attacker's 10-20% human involvement wasn't optional—it was *necessary* because the AI couldn't be trusted to validate its own outputs.

> **💬 Discussion Prompt:** GTG-1002 used persona-based prompting to bypass safety guardrails ("I'm a security researcher at a legitimate firm conducting authorized testing"). How would you design a tool-level defense that can distinguish between legitimate security testing and malicious use of the same tools? Is this even possible at the tool level, or does it require platform-level monitoring?

**The Human-AI Split:**

The report quantifies the operational split: AI executed 80-90% of tactical work independently, with humans serving in strategic supervisory roles (10-20%). Human operators made decisions at critical escalation points: approving the transition from reconnaissance to active exploitation, authorizing use of harvested credentials for lateral movement, and making final decisions about data exfiltration scope.

This mirrors—inversely—the architecture we teach in this course. Your defensive agents should also operate with human oversight at decision gates. The difference is that your gates exist to ensure *responsible* action, while the attacker's gates existed to direct *malicious* action. The pattern is identical; the intent is opposite.

> **📖 Further Reading:** Anthropic, "Disrupting the First Reported AI-Orchestrated Cyber Espionage Campaign," Full Report, November 2025. This is the GTG-1002 primary source document. See also the June 2025 "vibe hacking" findings that documented the earlier, less autonomous precursor to this operation. Both are available in the [Reading List](resources/READING-LIST.md).

---

#### Day 1 Deliverable

Design a security tool (your choice of domain: log querying, IP reputation, alert enrichment, credential rotation, etc.) and document:

1. **Tool Specification** — Name, description, single responsibility
2. **Input Schema** — All parameters with validation rules and constraints
3. **Output Schema** — Response structure
4. **Security Boundaries** — How you enforce least privilege, rate limiting, data access scoping
5. **Error Handling** — 5–10 documented error cases with responses
6. **Testing Plan** — 10–15 test cases covering validation, injection attempts, authorization, rate limiting
7. **Audit Logging Strategy** — What information is logged for every call?

(2–3 pages, ~800–1000 words)

---

### Day 2 — Hands-On Lab

#### Lab Objectives

- Build a multi-tool MCP server with proper input validation and error handling
- Implement rate limiting and audit logging
- Design and test security boundaries at the tool level
- Compose multiple tools to solve a realistic security workflow
- Measure and report on tool performance and security

#### Part 1: Architecture Overview

Your multi-tool server will expose three tools:

1. **`query_logs`** — Structured, parameterized log queries
2. **`check_ip_reputation`** — Query threat intelligence for IP addresses
3. **`enrich_alert`** — Combine log data and threat intel to provide rich context

These tools work together: an agent receives a raw alert, uses `query_logs` to fetch context, uses `check_ip_reputation` to assess the source IP, and uses `enrich_alert` to synthesize a final assessment.

#### Part 2: Implement the Multi-Tool Server

Understand the MCP Architecture for Multi-Tool Security Analysis

The key insight: Instead of writing monolithic tools, you build modular tools that work together:

1. **Tool 1: query_logs** - Fetch context from SIEM/logs based on filters
2. **Tool 2: check_ip_reputation** - Assess IP threat level from reputation databases
3. **Tool 3: enrich_alert** - Synthesize a complete assessment from multiple sources

An MCP server orchestrates these tools. Claude (the agent) decides which tools to call and in what order.

> **🔑 Key Concept:** The value of MCP isn't the individual tools—it's the *composition*. An agent can call query_logs, then check_ip_reputation, then enrich_alert in sequence, each tool using outputs from previous ones.

**Why Not Just Write Python Functions?**

You could write Python functions that do this:
```python
def analyze_alert(alert_id):
    logs = query_logs(alert_id.source)
    ip_threat = check_ip_reputation(alert_id.source_ip)
    assessment = enrich_alert(logs, ip_threat)
    return assessment
```

But then you're orchestrating the logic in Python. With MCP, Claude orchestrates it. Why is that better?

- Claude can adapt the flow based on intermediate results
- You can compose tools from different sources (your SIEM, external threat intel, internal policies)
- You don't need to rebuild logic when requirements change
- Claude can explain its reasoning (which tools it used, why)

**Claude Code Workflow: Design the Multi-Tool System**

Instead of implementing a full MCP server, use Claude Code to design it:

Claude Code Prompt:

```text
I'm building a security alert enrichment system with three tools:

1. query_logs(source_type, time_range, event_type, limit) - Returns log entries matching filters
   - Inputs: source_type (app|network|database|auth), time_range (last_hour|day|week), event_type (optional), limit (1-1000)
   - Output: Array of log entries with timestamp, message, severity

2. check_ip_reputation(ip_address) - Returns threat intel on an IP
   - Input: IP address
   - Output: {threat_level: low|medium|high|critical, reputation_score: 0-100, known_attacks: [...], false_positive_risk: 0-100}

3. enrich_alert(alert_id, logs, ip_threat) - Synthesizes a final assessment
   - Inputs: alert_id, logs from tool 1, threat data from tool 2
   - Output: {incident_severity: low|medium|high|critical, recommended_action: string, reasoning: string}

Walk me through how an agent would use these tools to analyze this alert:

ALERT: Unusual data access
- Source IP: 203.45.12.89
- User: admin@company.local
- Action: Downloaded 10 GB from customer database
- Time: 2026-03-05 14:22 UTC

The agent should:
1. Call query_logs to get context about this IP, this user, and this action
2. Call check_ip_reputation on the IP
3. Call enrich_alert with results from steps 1 and 2
4. Return the final assessment

Show me: What would the agent ask at each step? What outputs would it receive? How would it reason about them?
```

**After Claude walks through the logic:**

Ask:
- "What validation would you add to prevent malicious inputs to query_logs?"
- "How would you handle if check_ip_reputation times out?"
- "What if the tools return conflicting signals (logs say suspicious, IP reputation says clean)?"
- "How would an agent decide whether to escalate to human SOC?"

**Key Takeaway:**

MCP servers are infrastructure. The *pattern* of decomposing complex analysis into modular, composable tools is universal. You can learn that pattern in Claude Code before investing in building real infrastructure.

When you're ready to build a production MCP server, you'll:
1. Translate your Claude Code design to Python classes and async functions
2. Add error handling (timeouts, retries, circuit breakers)
3. Deploy the server alongside your SIEM/threat intel integrations
4. Monitor tool call patterns (which tools do agents use most? which fail most?)

But the hard part—deciding *which* tools to build and *how* they should interact—you figure out in Claude Code first.

#### Part 3: Test with Claude Code

Create test scenarios in Claude Code:

**Scenario 1: IP Reputation Check**
```
An alert came in: suspicious IP 198.51.100.89 was detected accessing the web server. Check the IP's reputation and tell me what you find.
```

The agent should:
1. Call `check_ip_reputation` with the IP
2. Receive high risk score and "scanner" threat type
3. Recommend blocking

**Scenario 2: Alert Enrichment**
```
We have an alert: Alert ID alert-001, source IP 203.0.113.42 attempted to access a protected API endpoint. Can you enrich this alert and tell me the severity?
```

The agent should:
1. Call `enrich_alert` with the details
2. Combine IP reputation and log data
3. Return overall severity and recommendation

**Scenario 3: Multi-tool Investigation**
```
I noticed some suspicious log activity from 198.51.100.89. Can you check that IP's reputation, find all logs from that IP, and give me a complete assessment?
```

The agent should compose multiple tools to provide a comprehensive answer.

#### Part 4: Validate and Test Security

1. **Test input validation:**
   - Try `query_logs` with an invalid source_type (should be rejected)
   - Try `check_ip_reputation` with malformed IP (should be rejected)
   - Try `enrich_alert` with missing required fields (should be rejected)

2. **Test rate limiting:**
   - Make 25 rapid calls to the same tool (should be rate-limited after 20)
   - Verify error message includes guidance

3. **Test audit logging:**
   - Run several tool calls
   - Check `audit.log` file
   - Verify all calls are logged with timestamp, agent_id, tool, parameters, and result

4. **Test error handling:**
   - Request logs for a non-existent source type
   - Check IP reputation for an IP not in the database
   - Verify graceful error responses

#### Part 5: Performance Analysis

Measure:
1. Average response time per tool (query_logs, check_ip_reputation, enrich_alert)
2. Maximum response time
3. Rate of successful calls (what percentage succeed without errors)

Create a brief performance report:

```
| Tool | Avg Time (ms) | Max Time (ms) | Success Rate |
|------|---------------|---------------|--------------|
| query_logs | ___ | ___ | ___% |
| check_ip_reputation | ___ | ___ | ___% |
| enrich_alert | ___ | ___ | ___% |
```

#### Part 6: Red Team / Blue Team Exercise — Operation Forge Fire

This exercise applies the GTG-1002 case study from today's lecture. You'll build both sides of the equation: a simplified offensive reconnaissance agent AND a defensive detection agent, both targeting your own sandboxed infrastructure. You'll experience firsthand how the same tools and patterns serve offense and defense.

> **⚠️ Common Pitfall:** This exercise involves building tools that perform network reconnaissance. You will **only** target infrastructure you own and control (local Docker containers). Never run reconnaissance tools against systems you don't own. This is both a legal requirement and a professional ethics standard.

**Step 1: Set Up Your Sandboxed Target Environment**

Launch a local target environment using Docker Compose. This creates the isolated infrastructure your red team agent will scan and your blue team agent will defend:

```bash
mkdir -p ~/forge-fire-lab && cd ~/forge-fire-lab

cat > docker-compose.yml << 'EOF'
version: "3.8"
services:
  # Target web application
  webapp:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./webapp:/usr/share/nginx/html
    networks:
      - forge-net

  # Target database
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: forge-lab-2026
      POSTGRES_DB: targets
    ports:
      - "5432:5432"
    networks:
      - forge-net

  # Simulated internal API
  api:
    image: python:3.11-slim
    command: python -m http.server 9000
    ports:
      - "9000:9000"
    networks:
      - forge-net

  # Log collector (your blue team monitors this)
  log-collector:
    image: python:3.11-slim
    command: python -m http.server 8888
    ports:
      - "8888:8888"
    volumes:
      - ./logs:/app/logs
    networks:
      - forge-net

networks:
  forge-net:
    driver: bridge
EOF

mkdir -p webapp logs
echo "<h1>Meridian Financial Portal</h1>" > webapp/index.html
docker-compose up -d
```

**Step 2: Responsible AI Security Testing — Getting Claude's Approval**

Before building offensive tools, you must properly frame your security testing context for Claude. This is a critical professional skill. The GTG-1002 attackers bypassed safety guardrails through *deceptive* role-play. You'll do the opposite: transparent, honest framing of legitimate security testing.

Create a file `security-testing-policy.md`:

```markdown
# Responsible AI Security Testing Policy — Noctua Lab Exercise

## Authorization Scope
- **Target systems:** Local Docker containers ONLY (127.0.0.1, localhost)
- **Target ports:** 8080, 5432, 9000, 8888 (as defined in docker-compose.yml)
- **Authorized activities:** Port scanning, service enumeration, banner grabbing
- **Prohibited activities:** Exploitation, credential brute-forcing, data exfiltration
- **Duration:** This lab session only
- **Authorization:** Course instructor-approved lab exercise

## Ethical Boundaries
- All targets are locally owned and controlled infrastructure
- No external systems will be scanned or contacted
- All findings are for educational analysis only
- This exercise teaches defensive awareness through controlled offensive simulation

## Claude Usage Guidelines
- Clearly state the educational context in every prompt
- Never ask Claude to generate actual exploit code
- Focus on reconnaissance patterns, not exploitation
- Document all interactions for course submission
```

Now, when prompting Claude for offensive tool design, include this context:

```text
I'm a graduate student in an AI Security Engineering course. I have a local Docker
environment with 4 containers (nginx on 8080, postgres on 5432, python http.server
on 9000 and 8888) that I set up for a lab exercise.

I need to build a simple MCP tool that performs service enumeration against these
LOCAL containers only (127.0.0.1). This is for a course lab exercise studying the
GTG-1002 case study — we're learning how attackers used MCP tools for reconnaissance
so we can build better defenses.

The tool should ONLY scan localhost and should refuse any non-local targets.
Can you help me design the tool schema and implementation?
```

> **🔑 Key Concept:** Notice the difference between this prompt and what GTG-1002 did. The attacker created a *false persona* ("I'm a security researcher at a legitimate firm") to bypass guardrails. You're providing *truthful context* ("I'm a student in a lab exercise targeting my own infrastructure"). Transparent intent is not just ethically required—it produces better results because Claude can tailor its assistance to your actual needs rather than a fabricated scenario.

**Step 3: Build the Red Team — Reconnaissance Agent**

Using Claude, design and build a simple reconnaissance MCP tool that can only target localhost:

```python
# red_team_recon.py — Reconnaissance MCP Tool (localhost only)
import socket
import json
from datetime import datetime

class ReconTool:
    """Simplified reconnaissance tool for educational security testing.
    HARD-CODED to localhost only — will refuse all other targets."""

    ALLOWED_HOSTS = ["127.0.0.1", "localhost", "0.0.0.0"]
    ALLOWED_PORTS = range(1, 65536)
    MAX_PORTS_PER_SCAN = 100  # Rate limiting

    def port_scan(self, target: str, ports: list[int]) -> dict:
        """Scan specified ports on localhost ONLY."""
        # SECURITY: Hard-coded localhost restriction
        if target not in self.ALLOWED_HOSTS:
            return {
                "error": "BLOCKED: This tool only scans localhost.",
                "target_requested": target,
                "policy": "Lab exercise tools are restricted to local targets."
            }

        if len(ports) > self.MAX_PORTS_PER_SCAN:
            return {"error": f"Too many ports. Maximum {self.MAX_PORTS_PER_SCAN}."}

        results = []
        for port in ports:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                result = sock.connect_ex(("127.0.0.1", port))
                status = "open" if result == 0 else "closed"
                results.append({"port": port, "status": status})
                sock.close()
            except Exception as e:
                results.append({"port": port, "status": "error", "detail": str(e)})

        return {
            "target": "127.0.0.1",
            "timestamp": datetime.utcnow().isoformat(),
            "ports_scanned": len(ports),
            "results": results,
            "open_ports": [r for r in results if r["status"] == "open"]
        }

    def banner_grab(self, target: str, port: int) -> dict:
        """Attempt to grab service banner from an open port on localhost."""
        if target not in self.ALLOWED_HOSTS:
            return {"error": "BLOCKED: This tool only targets localhost."}

        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3)
            sock.connect(("127.0.0.1", port))
            sock.send(b"HEAD / HTTP/1.1\r\nHost: localhost\r\n\r\n")
            banner = sock.recv(1024).decode("utf-8", errors="replace")
            sock.close()
            return {
                "target": "127.0.0.1",
                "port": port,
                "banner": banner[:500],  # Truncate for safety
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {"target": "127.0.0.1", "port": port, "error": str(e)}
```

Use Claude to run the red team tools against your Docker targets:

```text
Using the ReconTool, scan localhost ports 8080, 5432, 9000, and 8888.
Then banner-grab any open ports. Report what services you find and what
an attacker would learn from this reconnaissance.

Compare your findings to Phase 2 of the GTG-1002 report: "Reconnaissance
and attack surface mapping." What information did the attacker gather,
and how does our simplified scan compare?
```

**Step 4: Build the Blue Team — Detection Agent**

Now build the defensive side. Your blue team MCP tool monitors the same infrastructure and detects the red team's activity:

```python
# blue_team_monitor.py — Detection MCP Tool
import json
import os
from datetime import datetime
from collections import defaultdict

class DetectionTool:
    """Blue team monitoring and anomaly detection tool."""

    def __init__(self):
        self.connection_log = []
        self.alert_threshold = 10  # connections per minute = suspicious
        self.baseline = {}

    def log_connection(self, source_ip: str, dest_port: int,
                       protocol: str = "TCP") -> dict:
        """Log an observed connection attempt."""
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "source_ip": source_ip,
            "dest_port": dest_port,
            "protocol": protocol,
            "event_type": "connection_attempt"
        }
        self.connection_log.append(event)
        return event

    def detect_port_scan(self, time_window_seconds: int = 60) -> dict:
        """Detect port scanning behavior in recent connection logs."""
        now = datetime.utcnow()
        recent = [e for e in self.connection_log
                  if (now - datetime.fromisoformat(e["timestamp"])).seconds
                     < time_window_seconds]

        # Group by source IP
        by_source = defaultdict(list)
        for event in recent:
            by_source[event["source_ip"]].append(event["dest_port"])

        alerts = []
        for ip, ports in by_source.items():
            unique_ports = len(set(ports))
            if unique_ports >= 4:  # Scanning 4+ ports = suspicious
                alerts.append({
                    "alert_type": "PORT_SCAN_DETECTED",
                    "severity": "high" if unique_ports >= 10 else "medium",
                    "source_ip": ip,
                    "unique_ports_scanned": unique_ports,
                    "ports": sorted(set(ports)),
                    "total_connections": len(ports),
                    "time_window": f"{time_window_seconds}s",
                    "recommendation": "Investigate source. Consider temporary block.",
                    "cct_note": "Apply Pillar 2: What would the network team say? "
                               "Is this a legitimate service health check?"
                })

        return {
            "scan_time": now.isoformat(),
            "events_analyzed": len(recent),
            "alerts": alerts,
            "status": "ALERT" if alerts else "CLEAR"
        }

    def analyze_reconnaissance_pattern(self, events: list) -> dict:
        """Apply CCT analysis to detected reconnaissance activity."""
        return {
            "pillar_1_evidence": {
                "description": "Raw observations from connection logs",
                "observations": [
                    f"{len(events)} connection attempts detected",
                    f"Unique ports targeted: {len(set(e['dest_port'] for e in events))}",
                    f"Time span: {events[0]['timestamp']} to {events[-1]['timestamp']}"
                        if events else "No events"
                ],
                "question": "Are these facts or could monitoring artifacts mislead us?"
            },
            "pillar_2_perspective": {
                "description": "Who else should weigh in?",
                "teams_to_consult": [
                    "Network team: Is this normal service discovery?",
                    "DevOps: Did someone deploy a health checker?",
                    "Application team: Are services self-registering?"
                ]
            },
            "pillar_3_connections": {
                "description": "What patterns emerge?",
                "questions": [
                    "Does the scanning pattern match known GTG-1002 TTPs?",
                    "Are the targeted ports consistent with data exfiltration?",
                    "What second-order effects if this IS an attack?"
                ]
            },
            "pillar_4_adaptive": {
                "description": "What would prove us wrong?",
                "hypotheses": [
                    "H1: This is an automated attack (evidence: rapid sequential scanning)",
                    "H2: This is a misconfigured monitoring tool (evidence: regular interval)",
                    "H3: This is an authorized penetration test (evidence: check with security team)"
                ],
                "falsification": "If connections are at regular intervals from a known "
                                 "monitoring IP, H2 is most likely."
            },
            "pillar_5_ethics": {
                "description": "Proportional response?",
                "considerations": [
                    "Blocking too aggressively may disrupt legitimate services",
                    "Not blocking fast enough may allow data exfiltration",
                    "Document all decisions for audit trail"
                ]
            }
        }
```

**Step 5: Red vs. Blue — The Forge Fire Exercise**

Now run both sides simultaneously. This is the core exercise:

1. **Red team agent** runs reconnaissance using the `ReconTool` against your Docker containers
2. **Blue team agent** monitors connections and runs `detect_port_scan` in real-time
3. You analyze the results through **both lenses** — what the attacker learned vs. what the defender detected

Use Claude to orchestrate both sides:

```text
You are running a red team / blue team exercise. I have two tool sets:

RED TEAM (ReconTool): port_scan, banner_grab — targets localhost Docker containers
BLUE TEAM (DetectionTool): log_connection, detect_port_scan, analyze_reconnaissance_pattern

Run this exercise:
1. Red team: Scan ports 80, 443, 5432, 8080, 8888, 9000, 3306, 6379, 27017, 22 on localhost
2. Blue team: Log each connection attempt the red team makes
3. Blue team: Run port scan detection
4. Blue team: Run CCT analysis on detected activity
5. Compare: What did the red team learn? What did the blue team detect? What was missed?

Then answer: If this were a real GTG-1002-style attack, what additional detection
would you need? What would the attacker do next after this reconnaissance phase?
```

**Step 6: Draft a Responsible AI Security Testing Policy**

Based on what you've learned from the GTG-1002 case study and this exercise, draft a formal **Responsible AI Security Testing Policy** for your organization. This document should be something you could hand to a security team lead or a compliance officer.

Your policy should address:

1. **Scope and Authorization** — What systems can be tested? Who authorizes testing? How is authorization documented?
2. **AI Model Usage** — How should security testers frame requests to AI models? What is transparent vs. deceptive prompting? Where is the ethical line?
3. **Tool Restrictions** — What hard-coded restrictions should offensive tools have? (Target restrictions, rate limits, scope limits)
4. **Monitoring and Oversight** — How should AI-assisted security testing be monitored? What triggers a halt?
5. **Documentation and Audit** — What records must be kept? How are findings reported?
6. **Lessons from GTG-1002** — What specific practices from the case study inform your policy? (persona abuse, autonomous escalation without human gates, hallucinated findings)

> **✅ Remember:** The GTG-1002 attacker's key innovation was *deceptive framing* — convincing Claude it was doing legitimate security work through false personas. Your policy must address: how does an organization distinguish between legitimate AI-assisted security testing and adversarial abuse of the same capabilities? The answer isn't just technical—it's procedural, cultural, and ethical.

---

#### Deliverables

1. **Multi-Tool MCP Server Code** (Parts 1–5)
   - All three defensive tools with input validation, error handling, rate limiting
   - Audit logging for all calls
   - Well-commented, production-ready

2. **Tool Schema Documentation**
   - Input schema for each tool
   - Output schema for each tool
   - Validation rules
   - Error codes and messages

3. **Red Team / Blue Team Lab Report** (Part 6)
   - Red team reconnaissance findings (what did your agent discover about the Docker environment?)
   - Blue team detection results (what alerts fired? what was the CCT analysis?)
   - Gap analysis: What did the red team learn that the blue team missed?
   - Comparison to GTG-1002: How does your simplified exercise map to the real operation's Phase 2–3?
   - Your Claude interaction log showing how you framed the security testing context

4. **Responsible AI Security Testing Policy** (1,000–1,500 words)
   - Scope, authorization, tool restrictions, monitoring, documentation
   - Specific lessons from GTG-1002 integrated into policy recommendations
   - Clear position on transparent vs. deceptive prompting of AI models

5. **Performance and Security Report**
   - Response times for each tool
   - Rate limiting behavior
   - Audit log samples from both red and blue team operations
   - Security boundaries tested and results

#### Sources & Tools

- [MCP Specification](https://modelcontextprotocol.io/)
- [Pydantic Documentation](https://docs.pydantic.dev/) (for schema validation)
- [Claude Agent SDK](https://github.com/anthropics/anthropic-sdk-python)
- [OWASP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
- [Rate Limiting Patterns](https://en.wikipedia.org/wiki/Rate_limiting)
- Anthropic, "Disrupting the First Reported AI-Orchestrated Cyber Espionage Campaign," Full Report, November 2025
- Anthropic, "Detecting and Countering AI-Enabled Cyber Threats" (Vibe Hacking findings), June 2025

---

## Week 7: Structured Outputs & Security Reporting

### Day 1 — Theory & Foundations

#### Learning Objectives

- Distinguish between natural language and deterministic structured outputs in security contexts
- Design JSON schemas for compliance-ready security reports
- Implement output validation and constraint enforcement
- Chain multiple Claude calls with different schemas to build complex analyses
- Integrate AI-generated reports into downstream security systems (SIEM, SOAR, ticketing)

#### The Determinism Imperative in Security

Imagine a security analyst receives an alert and needs to decide: block this IP, log it, or ignore it? If the decision comes from an LLM's natural language response ("This IP might be a threat..." or "The risk is probably moderate..."), the analyst must interpret the uncertainty. Different analysts might interpret the same output differently, leading to inconsistent decisions.

Deterministic structured outputs solve this. Instead of natural language, the LLM returns strict JSON that downstream systems can parse and act on automatically:

```json
{
  "alert_id": "alert-12345",
  "severity": "critical",
  "action": "block",
  "confidence": 0.92
}
```

Now a SOAR platform can automatically block the IP with 92% confidence, and an analyst can review the decision if confidence falls below 90%. No ambiguity.

> **🔑 Key Concept:** In security, "precise" beats "conversational." Deterministic outputs enable automation, auditability, and compliance. They also reduce alert fatigue by eliminating vague threat assessments.

#### Structured Output Formats for Security

**JSON for Machine Readability** — JSON is the lingua franca of modern security tooling. It's easy for machines to parse and validate, and it integrates natively with APIs, databases, and workflow engines.

**CVSS for Severity** — The Common Vulnerability Scoring System (CVSS) provides a standardized way to rate the severity of vulnerabilities. Rather than inventing custom severity scales, use CVSS v3.1:

- CVSS Base Score: 0.0–10.0
  - 9.0–10.0: Critical
  - 7.0–8.9: High
  - 4.0–6.9: Medium
  - 0.1–3.9: Low

**MITRE ATT&CK for Threat Classification** — MITRE ATT&CK is a knowledge base of adversary tactics and techniques based on real-world observations. Rather than creating custom threat taxonomies, map findings to ATT&CK:

```json
{
  "mitre_attack": {
    "tactic": "Reconnaissance",
    "technique": "Active Scanning",
    "technique_id": "T1595"
  }
}
```

**STIX/TAXII for Threat Intelligence** — STIX (Structured Threat Information Expression) is an XML/JSON format for sharing threat intelligence. Tools like Splunk, Cortex XSOAR, and VirusTotal speak STIX natively, so AI-generated threat reports can flow directly into these platforms.

#### Designing Compliance-Ready JSON Schemas

A compliance-ready security report must include:

1. **Metadata** — Alert ID, timestamp, analyst/system
2. **Assessment** — What happened, severity, confidence
3. **Evidence** — What data supports the assessment
4. **Recommendations** — What action to take
5. **Audit Trail** — Who analyzed it, when, and why

Example schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Security Alert Assessment",
  "properties": {
    "alert_id": {
      "type": "string",
      "description": "Unique identifier for the alert",
      "pattern": "^alert-[0-9]+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of assessment"
    },
    "severity": {
      "type": "string",
      "enum": ["critical", "high", "medium", "low"],
      "description": "Alert severity"
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Confidence level (0.0–1.0)"
    },
    "threat_classification": {
      "type": "object",
      "properties": {
        "attack_type": {"type": "string"},
        "mitre_tactic": {"type": "string"},
        "mitre_technique": {"type": "string"},
        "mitre_technique_id": {"type": "string", "pattern": "^T[0-9]{4}$"}
      }
    },
    "evidence": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "source": {"type": "string"},
          "timestamp": {"type": "string", "format": "date-time"},
          "description": {"type": "string"}
        }
      }
    },
    "recommended_actions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "priority": {"type": "string", "enum": ["immediate", "urgent", "standard"]},
          "action": {"type": "string"},
          "rationale": {"type": "string"}
        }
      }
    }
  },
  "required": ["alert_id", "timestamp", "severity", "confidence", "evidence", "recommended_actions"]
}
```

> **⚠️ Common Pitfall:** Schemas that are too loose (allowing any string for severity, for example) defeat the purpose of structuring outputs. Enforce constraints with enums, patterns, and ranges. A severity field should accept only "critical", "high", "medium", "low"—not free-form text.

#### Chaining Claude Calls with Different Schemas

Complex security analyses often require multiple steps:

1. **Step 1:** Classify the alert (threat type, MITRE mapping)
2. **Step 2:** Enrich with context (affected systems, timeline)
3. **Step 3:** Generate recommendations (actions, priority)

Rather than asking Claude to do all three in one call, chain calls with different output schemas:

```python
# Step 1: Threat classification
classification = claude_call(
    prompt=f"Classify this alert: {alert_data}",
    output_schema=threat_classification_schema
)

# Step 2: Enrichment
enrichment = claude_call(
    prompt=f"Enrich this alert with context: {alert_data}. Classification: {json.dumps(classification)}",
    output_schema=enrichment_schema
)

# Step 3: Recommendations
recommendations = claude_call(
    prompt=f"Generate security recommendations for this alert: {json.dumps({**classification, **enrichment})}",
    output_schema=recommendations_schema
)

# Combine results
final_report = {
    **classification,
    **enrichment,
    **recommendations
}
```

This approach:
- Lets Claude focus on one task per call (better quality)
- Allows intermediate validation (if classification is nonsense, stop)
- Enables reuse (can use the classification in multiple downstream analyses)
- Facilitates debugging (each step has clear input/output)

> **💡 Pro Tip:** Claude is better at complex reasoning when you break tasks into steps with clear schemas at each step. Instead of "analyze this alert and give me everything," try "first classify the alert type," then "then determine severity," then "finally recommend actions."

#### Integration with Security Infrastructure

**SIEM Integration (Splunk Example)**

A SIEM can ingest structured reports and create dashboards:

```python
import splunk_sdk

# Generate structured report
report = generate_security_report(alert)

# Send to Splunk
splunk_client.ingest(
    source="ai_security_agent",
    sourcetype="security_alert_assessment",
    event=json.dumps(report)
)
```

**SOAR Integration (Cortex XSOAR Example)**

A SOAR platform can consume structured assessments and orchestrate responses:

```python
# If confidence > 0.9 and severity == "critical", execute incident response playbook
if report["confidence"] > 0.9 and report["severity"] == "critical":
    xsoar_client.execute_playbook(
        playbook="incident_response_critical",
        incident_data=report
    )
```

**Ticketing Integration (Jira/ServiceNow Example)**

Create tickets automatically from reports:

```python
ticket = jira_client.create_issue(
    project="SEC",
    issue_type="Security Incident",
    summary=report["summary"],
    description=json.dumps(report, indent=2),
    priority=priority_map[report["severity"]],  # Map severity to Jira priority
    components=["SecOps"]
)
```

#### Validation and Quality Assurance

Every structured output must be validated against its schema:

```python
import jsonschema

def validate_security_report(report, schema):
    try:
        jsonschema.validate(instance=report, schema=schema)
        return True, None
    except jsonschema.ValidationError as e:
        return False, str(e)

# Use it
is_valid, error = validate_security_report(claude_output, report_schema)
if not is_valid:
    logger.error(f"Report validation failed: {error}")
    # Handle invalid output (re-prompt, fallback, etc.)
```

A robust system should:
1. **Always validate** outputs against schemas
2. **Log validation failures** for debugging
3. **Retry on validation failure** (sometimes re-prompting Claude with the error fixes it)
4. **Have a fallback** if validation repeatedly fails (e.g., escalate to human analyst)

> **📖 Further Reading:** [JSON Schema Best Practices](resources/FRAMEWORKS.md) and [CVSS v3.1 Specification](https://www.first.org/cvss/v3.1/specification-document).

#### Day 1 Deliverable

Design a complete structured reporting system for a security domain of your choice (breach detection, vulnerability triage, incident response, threat hunting, etc.):

1. **JSON Schema** — Define the report structure with all required fields, enums, ranges, and validation rules (2–3 pages)
2. **Chaining Strategy** — Describe how you would break down the analysis into 2–3 Claude calls with different output schemas
3. **Integration Plan** — Describe how this report would integrate with SIEM, SOAR, or ticketing systems
4. **Validation Strategy** — How you would validate outputs and handle failures
5. **Example Report** — Provide a sample output that conforms to your schema

(3–4 pages, ~1200–1500 words)

---

### Day 2 — Hands-On Lab

#### Lab Objectives

- Build an automated security report generator using Claude API with structured outputs
- Implement JSON schema validation for all outputs
- Chain multiple Claude calls with different schemas
- Integrate structured reports into a downstream system (mock SIEM/ticketing)
- Measure accuracy and completeness of generated reports

#### Part 1: Set Up Report Generation Infrastructure

**Report Generation Architecture**

The problem: Manually writing security reports is:
- Time-consuming (2-4 hours per incident)
- Inconsistent (different analysts write differently)
- Hard to standardize (no fixed structure)
- Error-prone (human typing mistakes)

The solution: Use Claude to generate reports from raw incident data.

But "generate reports" is vague. You need:

1. **Structure:** Fixed schema (incident summary, timeline, impact, recommendations)
2. **Consistency:** Same format every time
3. **Accuracy:** Grounded in actual incident data, not hallucinated
4. **Compliance:** Meets regulatory requirements (GDPR, SOC 2, etc.)

> **🔑 Key Concept:** Claude can write better prose than most humans. But you need to constrain it with schemas and context to ensure accuracy and consistency.

**The Three Components of Report Generation:**

1. **Input:** Raw incident data (logs, alerts, forensics results)
2. **Processing:** Claude reads input, applies a schema, generates structured output
3. **Output:** Final report (markdown, PDF, email, database entry)

**Claude Code Workflow: Building a Report Template**

Instead of writing Python infrastructure, use Claude Code to design the report:

Claude Code Prompt:

```text
Design a security incident response report template with these properties:

1. STRUCTURE (Fixed sections that every report has):
   - Executive Summary (1 paragraph, <100 words)
   - Incident Timeline (bullet list, reverse chronological)
   - Technical Analysis (evidence-based, not speculative)
   - Impact Assessment (scope of compromise)
   - Containment Actions (what we did to stop it)
   - Remediation Steps (longer-term fixes)
   - Detection Recommendations (how to catch this in future)
   - Lessons Learned (what we got wrong, what we fixed)

2. SCHEMA (Structured data that machines can parse):
   - incident_id: String
   - detection_timestamp: ISO timestamp
   - containment_timestamp: ISO timestamp
   - mitti_minutes: Number (time to investigate)
   - mtts_minutes: Number (time to suppress)
   - affected_systems: [String]
   - affected_users: [String]
   - data_exposed: Bool
   - exposure_count: Number (how many records/accounts/files)
   - root_cause: String
   - severity: LOW|MEDIUM|HIGH|CRITICAL
   - recommended_actions: [{action: String, priority: HIGH|MEDIUM|LOW, owner: String}]

3. CONTENT REQUIREMENTS (What makes a good report):
   - Grounded in evidence (cite logs, not speculation)
   - Transparent about uncertainty ("We don't know X, recommend investigating Y")
   - Actionable (recommendations should be implementable)
   - Auditable (clear decision trail that regulators would accept)

Now, given this raw incident data, write a report:

[Include raw incident data: logs, alerts, forensics, timeline]

Generate output in JSON + Markdown:
- JSON section contains structured data (schema above)
- Markdown section contains prose (narrative, timeline, analysis)

Include: Which sections are high-confidence (well-supported by evidence)? Which are low-confidence (need more investigation)?
```

**After Claude generates a report:**

Ask:
- "What data would you need to increase confidence in the root cause?"
- "For the affected_users count, how did you determine it?"
- "The recommended_actions—are they ordered by urgency or impact?"
- "If I disagree with the severity rating, what evidence would change your mind?"

**Iterative Refinement:**

The power of Claude Code: You can refine the report in real-time.

- "Rewrite the executive summary for a technical audience (CTO) vs. non-technical (CEO)"
- "Add a section: 'Questions still open' with investigation steps"
- "Format the timeline to show the interval between each event"
- "Add compliance implications: How does this affect SOC 2 certification?"

**Why Claude Code instead of building Python infrastructure:**

With Python (structured outputs, JSON schemas, report generation), you need to:
- Set up dependencies
- Define Pydantic models
- Handle parsing errors
- Test edge cases
- Debug mismatches between schema and actual Claude output

With Claude Code, you:
- Iterate on structure immediately
- See prose quality in real-time
- Test different formats (markdown, JSON, HTML) in seconds
- Refine content without redeploying

**When to Graduate to Python:**

Once you've iterated on the report design in Claude Code and you're happy with the structure, *then* you build Python infrastructure to:
- Integrate with your incident management system
- Automatically generate reports for every incident
- Store reports in a database
- Distribute via email/Slack
- Track metrics (time to report, quality scores)

But the "what should the report contain and how should it be structured?" question—answer that first in Claude Code.
> **✅ Remember:** Each Claude call should be focused and have clear output expectations. By chaining calls with different schemas, you enable validation at each step and can retry individual steps if they fail validation.

#### Part 2: Test with Sample Alerts

Run the report generator with 5–10 sample alerts (provided or created):

```bash
python security_report_generator.py
```

Collect the generated reports and analyze:
1. How many reports passed validation on first try?
2. How many needed retry?
3. How accurate was the threat classification?
4. How complete was the enrichment?

#### Part 3: Integrate with Downstream Systems

**Integration Architecture: From Report to Action**

Once Claude generates a report, where does it go?

Options:
1. **Email:** Send to security leadership
2. **SIEM:** Ingest into your SIEM for correlation with other alerts
3. **Ticketing:** Create a Jira/ServiceNow ticket
4. **Database:** Store for compliance audit trail
5. **Slack:** Notify the SOC team

Each integration has different requirements:
- SIEM needs structured fields (incident ID, severity, affected systems)
- Email needs formatted prose (markdown, HTML)
- Ticketing needs title + description + priority
- Compliance database needs immutable record with signatures

Rather than building connectors now, design them first.

**Claude Code Workflow: Integration Design**

Claude Code Prompt:

```text
I have a security incident report generated by Claude. It's in JSON + Markdown format:

{
  "incident_id": "INC-2026-0345",
  "severity": "HIGH",
  "affected_systems": ["app-prod-01", "db-backup-01"],
  "affected_users": 47,
  "root_cause": "Unpatched vulnerability in Jenkins",
  "recommended_actions": [...]
}

[Markdown report with full details]

I want to export this to multiple systems. Design how each system would ingest it:

1. **Splunk SIEM:**
   - What fields would you extract and send?
   - What format? (JSON, syslog, REST API?)
   - How would you handle missing fields?

2. **Jira ticketing:**
   - What should the ticket title be?
   - How to structure the description?
   - What custom fields (priority, component, due date)?
   - How to link related incidents?

3. **Compliance database:**
   - What immutable data must we store?
   - Who approves the incident? (audit trail)
   - How long to keep records? (retention policy)
   - How to ensure non-repudiation (nobody can deny it happened)?

4. **Email notifications:**
   - Different audience = different format?
   - CISO wants: 1-paragraph summary + risk
   - CTO wants: Technical details + remediation steps
   - Board wants: Business impact + regulatory implications

For each integration, show me: What data goes in? What format? What could go wrong?
```

**Why design before building:**

Integrations have operational impact:
- Email to wrong person = data exposure
- Jira ticket with wrong priority = misaligned response
- SIEM ingestion without normalization = useless alerts
- Compliance record without approval = audit failure

Design in Claude Code first. Test the logic. *Then* build the Python/API connectors.

> **💡 Pro Tip:** Most "integration failures" aren't code bugs—they're design mistakes. Wrong field mapped, wrong priority assigned, wrong person notified. Claude Code helps you catch these before code.

**When to Build Integration Code:**

Build actual integrations when:
- You have a stable incident response process
- You know your SIEM/ticketing system APIs
- You have credentials/authentication set up
- You want to automate (every incident triggers exports)

Don't build when:
- You're still figuring out what data to capture
- Your incident response process is changing
- You're learning integrations (simulate them first)

#### Deliverables

1. **Report Generator Code**
   - Complete implementation with three chained Claude calls
   - Schema validation at each step
   - Retry logic for validation failures
   - Well-commented and documented

2. **Schemas Documentation**
   - Threat classification schema
   - Alert enrichment schema
   - Recommendations schema
   - Example inputs and outputs for each

3. **Generated Reports**
   - 5–10 sample reports from real or realistic alert data
   - All in valid JSON format

4. **Validation Report**
   - How many reports passed validation on first try: ___
   - How many required retry: ___
   - Average Claude API calls per report: ___
   - Any recurring validation issues: ___

5. **Integration Demo**
   - Show reports being ingested into SIEM
   - Show tickets being created in ticketing system
   - CSV exports or log files showing integration

#### Sources & Tools

- [Claude API Documentation](https://docs.anthropic.com/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)
- [CVSS v3.1 Specification](https://www.first.org/cvss/v3.1/specification-document)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [jsonschema Python Library](https://python-jsonschema.readthedocs.io/)

---

## Week 8: Retrieval-Augmented Generation (RAG) for Security Knowledge

### Day 1 — Theory & Foundations

#### Learning Objectives

- Understand RAG architecture and how it improves LLM accuracy for domain-specific questions
- Evaluate vector databases and embedding models for security applications
- Design chunking strategies for security documents without losing critical context
- Compare RAG, MCP tools, and fine-tuning for different security use cases
- Implement source attribution for compliance and verification

#### Why RAG: The Accuracy Challenge

In Unit 1, you learned that LLMs have a knowledge cutoff. Claude's training data ends in February 2025—so it doesn't know about vulnerabilities disclosed in March 2026. Beyond the cutoff problem, LLMs also struggle with proprietary or domain-specific information: your company's security policies, your incident response procedures, your threat intelligence feeds.

A naive approach is to ask Claude directly: "What does our security policy say about password length?" The model might hallucinate a reasonable-sounding answer, which is catastrophically wrong in a compliance context.

**Retrieval-Augmented Generation (RAG)** solves this. Rather than relying on training data or hallucination, RAG:

1. **Retrieves** relevant documents from a knowledge base
2. **Augments** the prompt with those documents
3. **Generates** a response grounded in the retrieved documents

Now Claude answers: "Our security policy (Section 3.2, last updated Jan 15 2025) requires passwords of at least 16 characters for privileged accounts. [Document excerpt]." And you know the answer came from your actual policy, not an LLM hallucination.

> **🔑 Key Concept:** RAG is not a replacement for LLMs; it's a pattern that augments LLM capabilities with retrieval. The LLM's role shifts from "know everything" to "synthesize retrieved information." This is a more honest and verifiable approach to AI in security.

#### Context Engineering & the Capability Capacity Model

Beyond RAG, strategic context management is fundamental to agent reliability. The **Capability Capacity Model** from Agentic Engineering practice establishes that when an agent's context fills beyond 40%, performance degradation becomes measurable. This is not just a theoretical concern—it's a practical design constraint. An agent given 200K tokens of context, plus detailed tool definitions, plus system prompts, plus error examples, can lose accuracy precisely when you need it most: during high-stakes investigations.

Context engineering means:
- **Systematically structuring** context in predictable formats (the ACE Playbook pattern)
- **Measuring context fill** at each stage and staying below the 40% threshold
- **Prioritizing** which context to include based on task relevance
- **Deferring** auxiliary information to tool calls or retrieval systems rather than embedding it in every prompt

RAG is one mechanism; others include MCP tool servers, structured examples, and dynamic context selection.

> **📖 Further Reading:** See the Agentic Engineering additional reading on context engineering for the complete Capability Capacity Model and ACE Playbook format for organizing context systematically.

#### RAG Architecture: The Complete Pipeline

RAG consists of five stages:

**1. Document Ingestion & Preprocessing**

Raw documents (PDFs, markdown files, logs, threat reports) are loaded into the system. This might involve:

- Extracting text from PDFs
- Parsing structured documents (YAML, JSON)
- Deduplicating and cleaning text
- Removing sensitive information (personal data, credentials)

**2. Chunking**

Documents are split into manageable pieces. Too large chunks (entire documents) make retrieval inefficient. Too small chunks (single sentences) lose context. A typical security chunk is 300–800 tokens, roughly:

```
Example chunk from NIST SP 800-53:

"AC-2 ACCOUNT MANAGEMENT

Control: The organization manages information system accounts, including establishment,
activation, modification, review, deactivation, and removal...

Supplemental Guidance: Information system account management activities include:
(i) Identification of account type (e.g., individual, shared, system, guest/anonymous);
(ii) Establishment of conditions for group and role membership;
(iii) Assignment of access authorizations..."

Length: ~150 words, ~250 tokens
```

**3. Embedding**

Each chunk is converted into a high-dimensional vector (embedding) using an embedding model. Similar chunks have similar vectors. This enables semantic search: "What's our password policy?" matches documents about authentication even if they don't use the exact word "password."

Common embedding models for security:
- **Anthropic's Claude Embeddings** — Optimized for longer documents (8K tokens)
- **OpenAI text-embedding-3-large** — General-purpose, high-quality
- **Cohere embed-english-v3.0** — Good for compliance/legal text
- **Open-source (all-MiniLM-L6-v2)** — Runs locally, no API calls

**4. Storage & Indexing**

Embeddings are stored in a **vector database** (also called a vector index), which enables fast similarity search. Popular choices:

- **Pinecone** — Managed, scalable, low operational overhead
- **Weaviate** — Open-source, flexible schema, good for security use cases
- **Chroma** — Lightweight, great for prototypes, runs locally
- **Milvus** — Open-source, high-performance, suitable for large deployments

A vector database stores millions of embeddings and can retrieve the 10 most similar to a query embedding in milliseconds.

**5. Retrieval & Augmentation**

When an agent or user asks a question:

1. The question is embedded using the same embedding model
2. A similarity search finds the top-K most similar document chunks
3. These chunks are inserted into the prompt alongside the question
4. Claude answers based on the retrieved documents

Example RAG prompt:

```
You are a security policy assistant. Answer the user's question based on the provided documents.

RETRIEVED DOCUMENTS:
[Document 1: Policy section about password requirements]
[Document 2: Incident response procedure mentioning similar situation]
[Document 3: Compliance note linking to NIST controls]

USER QUESTION: What's our password policy for admin accounts?

INSTRUCTIONS: If the answer is in the documents, cite the source. If not, say "This is not covered in our policy documents."
```

> **💬 Discussion Prompt:** Your organization uses RAG to answer questions about security policies. A user asks, "Is it OK to share passwords with contractors?" RAG retrieves a document saying "Passwords may never be shared" but that document is from 2020 and your company updated this policy in 2024. How would you prevent this stale information from being used?

#### Chunking Strategies for Security Documents

Naive chunking (breaking documents into equal-sized pieces) often fails for security content because context matters. A CVSS score of 9.5 is meaningless without knowing which vulnerability it describes.

**Smart Chunking Strategies:**

**1. Semantic Chunking** — Break at logical boundaries, not arbitrary token limits.

Instead of:
```
[150 tokens]
[150 tokens]  ← might split a control in half
[150 tokens]
```

Do:
```
AC-1 ACCESS CONTROL POLICY (340 tokens)  ← one complete control
AC-2 ACCOUNT MANAGEMENT (450 tokens)    ← another complete control
```

**2. Hierarchical Chunking** — Preserve document structure.

```
Document: NIST SP 800-53
  Section: AC (Access Control)
    Control: AC-2 Account Management
      Requirement: Organizations must establish account policies
      Supplemental Guidance: ...
```

When retrieving, retrieve at the appropriate level. For "What's our account management requirement?" retrieve the requirement level, not the entire section.

**3. Overlap-Based Chunking** — Add context overlap between chunks.

Chunk 1: [sentences 1–15]
Chunk 2: [sentences 12–27]  ← overlap with Chunk 1
Chunk 3: [sentences 25–40]  ← overlap with Chunk 2

This ensures that related information isn't split across chunks.

**4. Metadata Enrichment** — Attach metadata to chunks.

```json
{
  "chunk_id": "AC-2-001",
  "document": "NIST SP 800-53",
  "section": "AC (Access Control)",
  "control_id": "AC-2",
  "title": "Account Management",
  "text": "...",
  "applicable_systems": ["web_servers", "databases"],
  "last_updated": "2024-01-15",
  "severity": "high"
}
```

When retrieving, filter by metadata. "What controls apply to databases?" retrieves only chunks with `applicable_systems: ["databases"]`.

> **⚠️ Common Pitfall:** Storing too much metadata in the chunk itself increases embedding size and retrieval latency. Use a hybrid approach: store metadata separately in the vector database, use it for filtering, but don't embed it.

#### Vector Databases for Security: A Comparison

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **Pinecone** | Managed, scales easily, good UI | Vendor lock-in, pricing | Production systems with budget |
| **Weaviate** | Open-source, flexible, GraphQL API | More operational overhead | Organizations wanting full control |
| **Chroma** | Lightweight, runs locally, simple | Not for large deployments (>1M embeddings) | Prototypes, small teams |
| **Milvus** | Highly scalable, open-source, fast | Steeper learning curve | Large-scale deployments (millions of documents) |

For a typical security team (5000–50000 security documents), Chroma or Weaviate are good starting points.

#### RAG vs. MCP Tools vs. Fine-Tuning

| Approach | Use Case | Pros | Cons |
|----------|----------|------|------|
| **RAG** | Large, changing document collections (policies, threat reports, runbooks) | No retraining, always current, supports source citation | Retrieval quality depends on chunking and embeddings |
| **MCP Tools** | Real-time queries (current incident status, live system queries) | Deterministic, fresh data, can be composed | Requires tool infrastructure, not for unstructured knowledge |
| **Fine-tuning** | Consistent writing style or specific domain terminology | Model learns patterns | Expensive to train/retrain, outdated by knowledge cutoff |

Most security teams use **all three**:
- **RAG** for policies, procedures, threat reports (documents)
- **MCP tools** for live queries (incidents, IP reputation, system status)
- **Fine-tuning** rarely; only for very specific style/tone requirements

#### Source Attribution in RAG

A critical requirement for compliance: every answer must cite where information came from. Bad practice:

```
Q: What are our password requirements?
A: Passwords must be at least 16 characters.
```

Good practice:

```
Q: What are our password requirements?
A: According to our Access Control Policy (AC-2, updated Jan 15 2024),
"Passwords for privileged accounts must be at least 16 characters,
with complexity requirements including uppercase, lowercase, digits, and special characters."

Source: /policies/access-control/AC-2-Account-Management.md, Section 3.2
```

Implementation:

```python
def rag_answer_with_citation(question: str, top_k_documents: list) -> dict:
    # Augment prompt with retrieved documents
    prompt = f"""
    Answer this question based ONLY on the provided documents.
    Cite your sources.

    QUESTION: {question}

    RETRIEVED DOCUMENTS:
    """

    for doc in top_k_documents:
        prompt += f"\n[Source: {doc['source']}, Last updated: {doc['updated']}]\n{doc['text']}\n"

    prompt += "\nRespond with the answer and explicit citations."

    response = claude.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "question": question,
        "answer": response.content[0].text,
        "sources": [doc['source'] for doc in top_k_documents],
        "retrieved_documents": len(top_k_documents)
    }
```

> **📖 Further Reading:** Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" ([arxiv](https://arxiv.org/abs/2005.11401)). This foundational paper explains RAG and its advantages.

#### Day 1 Deliverable

Design a RAG system for a security use case (policy assistant, threat intelligence, incident response knowledge base, etc.):

1. **Knowledge Base Strategy** — What documents/data would you ingest? How would you keep them current?
2. **Chunking Plan** — How would you chunk these documents? Provide examples of 2–3 chunks.
3. **Embedding Model Choice** — Which embedding model? Why?
4. **Vector Database Choice** — Which database? Why? How many documents/embeddings?
5. **Retrieval Strategy** — How many documents (top-K)? Any filtering? How do you evaluate retrieval quality?
6. **Source Attribution** — How would you ensure every answer cites sources?
7. **Quality Evaluation** — How would you measure RAG system accuracy? (RAGAS metrics, human evaluation, etc.)

(3–4 pages, ~1200–1500 words)

---

### Day 2 — Hands-On Lab

#### Lab Objectives

- Build a working RAG system with a security knowledge base
- Implement document chunking and embedding
- Set up a vector database for similarity search
- Create a RAG-powered assistant that answers security questions with citations
- Measure accuracy and quality of retrieved documents

#### Part 1: Set Up RAG Infrastructure

**RAG (Retrieval-Augmented Generation) Architecture**

RAG solves a critical problem: Claude's knowledge cutoff is February 2025. If you need to analyze incidents using data from March 2026 (your company's incident database, threat intelligence from last week, newly published CVE information), Claude can't access it natively.

RAG works like this:

1. **Retrieval:** When Claude analyzes an incident, fetch relevant context from:
   - Previous similar incidents (your database)
   - Recent threat intelligence (feeds)
   - Organizational policies (stored as text)
   - Known vulnerabilities and patches (your asset inventory)

2. **Augmentation:** Inject that context into Claude's prompt

3. **Generation:** Claude analyzes the incident *with* that fresh context

Example:

Without RAG:
```
User: "Is CVE-2026-12345 actively exploited?"
Claude: "I don't have data on 2026 vulnerabilities; my knowledge cutoff is February 2025."
```

With RAG:
```
User: "Is CVE-2026-12345 actively exploited?"
System retrieves: [threat intel report from yesterday showing active exploitation]
System injects: "Recent threat intelligence (March 5, 2026) reports: CVE-2026-12345 is being actively exploited by APT-28..."
Claude: "Based on the threat intel provided, CVE-2026-12345 is actively exploited. We should prioritize patching systems..."
```

> **🔑 Key Concept:** RAG doesn't make Claude smarter. It makes Claude current. Your incident data is always fresher than Claude's training data.

**RAG Components:**

1. **Vector Database:** Store and search documents by semantic meaning
   - Previous incidents → searchable by attack type, technique, severity
   - Threat intel → searchable by APT, exploit, vulnerability
   - Policies → searchable by topic (MFA, encryption, incident response)

2. **Retrieval Logic:** Given an incident, fetch relevant documents
   - Semantic search (find similar incidents using embeddings)
   - Keyword search (find mentions of IOCs, CVEs)
   - Metadata filtering (only policies updated in last 30 days)

3. **Prompt Injection:** Safely add retrieved context to Claude's prompt
   - Format as markdown or structured text
   - Include source and timestamp (so Claude knows how old the data is)
   - Limit context size (don't overwhelm Claude with 100 documents)

**Claude Code Workflow: Design RAG**

Instead of building a vector database, design the system first:

Claude Code Prompt:

```text
I'm building a RAG system for security incident analysis. Here's my data:

PREVIOUS INCIDENTS:
- INC-2025-0102: Ransomware via phishing, Emotet malware, 48 hours to recover
- INC-2025-0087: Insider data theft, admin account abuse, regulatory notification
- INC-2025-0156: Supply chain compromise, third-party software, 2-week investigation

THREAT INTELLIGENCE (CURRENT):
- APT-28 targeting manufacturing sector with spear-phishing
- CVE-2026-12345: RCE in Windows SMB, actively exploited by multiple groups
- New extortion campaign: Scattered Spider variant, targeting financial services

ORGANIZATIONAL POLICIES:
- MFA required for all remote access
- Data classification: PII, Financial, Public
- Incident escalation: MEDIUM triggers email to CISO, HIGH triggers war room

NEW INCIDENT:
- Alert: Unusual SMB traffic from user account "jchen" to multiple systems
- Source: IP 203.45.12.89 (Singapore)
- User: John Chen, Finance VP
- Time: March 5, 2026

Walk me through RAG:

1. RETRIEVAL: What should the system search for?
   - "Unusual SMB traffic" → Find incidents with lateral movement?
   - "John Chen" → Find incidents involving this user?
   - "Singapore IP" → Find incidents from that geography?
   - "CVE-2026-12345" → Check if any previous incidents involved SMB vulnerabilities?

2. AUGMENTATION: Which previous incidents are relevant to show Claude?
   - INC-2025-0156 involved supply chain (different threat actor)?
   - INC-2025-0102 involved phishing (different vector)?
   - Neither is a perfect match, but what can Claude learn?

3. GENERATION: How should Claude use this context?
   - "Based on previous incident INC-2025-0102, phishing-based attacks often lead to lateral movement within 24 hours"
   - "APT-28 is currently targeting the financial sector"
   - "We have MFA enabled, so if John's account was compromised, attacker would need MFA too"

What documents would be most useful for Claude to see? In what order?
```

**After Claude designs the RAG logic:**

Ask:
- "How would you handle if no previous incidents match?"
- "Should recent incidents weight higher than old ones?"
- "What if conflicting policy documents (old vs. new version)?"
- "How do you prevent false positives from irrelevant documents?"

**Why Claude Code instead of building RAG now:**

RAG infrastructure is non-trivial:
- Vector database (Pinecone, Weaviate, Elasticsearch)
- Embedding model (how to represent documents as vectors)
- Retrieval algorithm (semantic + keyword + filtering)
- Indexing pipeline (parse documents, chunk them, embed them)
- Monitoring (is retrieval working? are we getting relevant documents?)

Before investing in that infrastructure, answer: "What documents do we need? How often do they change? How should they be searched?" Claude Code helps you answer these questions first.

**When to Build a Real RAG System:**

Build actual RAG when:
- You have incident data to index (100+ previous incidents)
- You have threat intelligence feeds (continuously updated)
- You have organizational policies (stored as documents)
- You want automation (every new incident automatically retrieves context)
- Scale matters (analyzing dozens of incidents/day)

For learning, simulating RAG in Claude Code is enough: "Imagine these are previous incidents. Which would be relevant? How would they change the analysis?"
> **✅ Remember:** The quality of RAG depends on three factors: document quality, chunking strategy, and retrieval ranking. Invest time in understanding why certain documents are retrieved and adjust chunking/metadata if needed.

#### Part 2: Test the RAG System

Run the system:

```bash
python security_rag_system.py
```

Measure:
1. **Retrieval Precision** — Does the system retrieve relevant documents?
2. **Answer Quality** — Are answers accurate and well-cited?
3. **Citation Coverage** — Do answers cite sources?

#### Part 3: Compare RAG vs. Unaugmented Claude

Test Claude without RAG on the same questions:

```python
def answer_without_rag(question: str) -> str:
    """Answer without RAG—just Claude's training data."""
    response = claude_client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Answer this security question: {question}"
        }]
    )
    return response.content[0].text

# Compare
print("WITH RAG:", rag_answer["answer"])
print("\nWITHOUT RAG:", answer_without_rag(question))
```

Document differences in accuracy, detail, and confidence.

---

## Growing Your Context Library: Tool Patterns

In Unit 2, you've built MCP servers and defined tools. Now it's time to capture the patterns that work—tool definition schemas, error handling approaches, structured output templates. These become your "style guide" for Claude Code to follow.

> **🔑 Key Concept:** A tool definition isn't just code—it's a contract. When you write a tool schema that's clear, validates input properly, and returns structured output, Claude learns to respect that contract. Save your best tool definitions in your context library. Next project, paste them as context: "Here are my preferred tool patterns. Use this style." Claude Code will follow your conventions.

**Why This Matters for Unit 2 Specifically:**
- **Tool Design is Hard:** Getting tool definitions right requires iteration—constraint specification, error handling, output validation. Your Unit 2 work is refined. Capture it.
- **Consistency Across Projects:** When you build many MCP servers, tool definitions should feel familiar. Your library ensures this.
- **Onboarding New Projects:** In Unit 3 and 4, you'll build different tools. Referencing your Unit 2 patterns ensures consistency and saves design time.

**Expand Your Context Library Structure**

Add a new section to your existing `context-library/`:

```bash
mkdir -p ~/context-library/patterns/tool-definitions
mkdir -p ~/context-library/patterns/error-handling
```

**Unit 2 Task: Extract Tool Patterns**

In this unit, you've designed and built:

1. **Tool Definition Schema:** The structure for defining tools (parameters, constraints, return types)
2. **Error Handling Pattern:** How tools fail gracefully and communicate errors back to the agent
3. **Structured Output Template:** The JSON/response format tools should return

**Capture These Patterns:**

Add to `context-library/patterns/tool-definitions/mcp-tool-schema.md`:
```
# MCP Tool Definition Template

## Description
[Clear one-liner about what the tool does]

## Parameters Schema
[Your standard parameter validation approach]
[Include examples of well-constrained parameters]

## Return Schema
[Your standard output format]
[Include error handling response format]

## Example: [One real tool from Unit 2]
[Complete definition showing the pattern in action]
```

Add to `context-library/patterns/error-handling/tool-errors.md`:
```
# Tool Error Handling Pattern

## Error Categories
[Classification of errors: validation, timeout, access control, etc.]

## Response Format
[How your tools communicate failures to agents]

## Example Failure Scenarios
[Real cases from Unit 2 testing]
```

Add to `context-library/prompts/tool-design.md`:
```
# Tool Design Decision Framework

When designing a new tool, ask:
1. What is the minimal capability set?
2. What inputs MUST be validated?
3. How does this tool fail? (timeout, permissions, malformed input)
4. What should the agent do when it fails?

[Examples from Unit 2]
```

**How to Use Your Library in Future Sessions**

When you start a new Claude Code project in Unit 3 or 4, provide this context:

```text
Here are my preferred patterns for tool definitions and error handling.
When you design new tools, follow this style:

[Paste your context-library/patterns/tool-definitions/mcp-tool-schema.md]
[Paste your context-library/patterns/error-handling/tool-errors.md]

This ensures consistency and alignment with my standards.
```

> **💡 Pro Tip:** Review your library. Did you discover any error handling patterns Unit 2 that surprised you? Did you learn a better way to structure tool output? Update your library entries—they should evolve as you learn.

---

#### Deliverables

1. **RAG System Code**
   - Document ingestion and chunking
   - Vector database setup (Chroma)
   - Similarity search
   - Claude integration with RAG prompts
   - Source citation

2. **Knowledge Base Documentation**
   - List of documents in the system
   - Chunking strategy used
   - Embedding model
   - Sample chunks and embeddings

3. **Evaluation Report**
   - Retrieval precision (how many correct documents retrieved?)
   - Answer accuracy (were answers correct and well-cited?)
   - Comparison vs. unaugmented Claude
   - Any hallucinations or failures

4. **Sample Q&A**
   - 10–15 example questions with RAG answers
   - Citations included
   - Evaluation of answer quality

5. **Performance Metrics**
   - Avg time to retrieve documents: _____ ms
   - Avg time to generate answer: _____ ms
   - Total latency (retrieval + generation): _____ ms

#### Sources & Tools

- [Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"](https://arxiv.org/abs/2005.11401)
- [Chroma Vector Database Documentation](https://docs.trychroma.com/)
- [LangChain RAG Guide](https://python.langchain.com/docs/modules/retrieval_augmented_generation/)
- [RAGAS: Evaluation Framework for RAG](https://github.com/explodinggradients/ragas)
- [Embedding Model Comparison](https://huggingface.co/spaces/mteb/leaderboard)

---

## Summary

Unit 2 equips you with the modern toolkit for AI-powered security:

- **Week 5 (MCP)** — Standard interfaces for agents to discover and use tools
- **Week 6 (Tool Design)** — Secure, composable, observable tool architecture
- **Week 7 (Structured Outputs)** — Machine-readable reports that integrate with downstream systems
- **Week 8 (RAG)** — Domain-specific knowledge systems with source attribution

Together, these techniques enable you to build AI agents that are secure, auditable, and grounded in your organization's knowledge and tools.

**Next:** Unit 3 will explore building production-ready security agents that integrate these technologies into real incident response workflows.
