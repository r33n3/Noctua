# Week 13: Claude Code Deep Dive — Worktrees, Subagents, and Agent Teams

**Semester 1 | Week 13 of 16**

## Learning Objectives

- Understand the Claude agentic architecture: Claude Code, worktrees, subagents, and agent teams
- Analyze real-world multi-agent orchestration patterns (hierarchical, peer-to-peer, pipeline)
- Evaluate trade-offs in multi-agent systems: cost, resilience, and complexity
- Identify failure modes and recovery strategies in distributed agent systems
- Apply token budgeting and cost optimization to multi-agent workflows

---

## Day 1 — Theory & Foundations

### The Claude Agentic Stack

The Claude platform provides a complete **agentic stack** for building sophisticated AI-powered security tools. Unlike monolithic agents, this stack enables *orchestrated multi-agent systems* where specialized agents delegate work, collaborate on complex problems, and maintain isolated development environments.

At its foundation sits **Claude Code**, Anthropic's interactive IDE that seamlessly integrates Claude into your development workflow. Claude Code isn't just a copilot — it's a reasoning engine that can read code, understand architecture, debug errors, and implement features. When combined with the **Claude Agent SDK** (available in Python via `from anthropic import Anthropic`), Claude Code becomes a runtime for deploying autonomous agents.

**Worktrees** are a git feature that Claude Code leverages to enable *branch isolation*. Rather than switching branches (which requires stashing changes), worktrees create parallel working directories on separate branches. This is critical for agentic security work: you might be developing a reconnaissance subagent in one worktree while your teammate hardens the analysis subagent in another. The key insight: **worktrees enable true parallel development by team members without merge conflicts during development**.

**Subagents** are specialized Claude instances with distinct system prompts and tool sets. A recon agent has access to vulnerability databases and threat intelligence APIs. An analysis agent gets a system prompt optimized for correlation and MITRE ATT&CK mapping. A reporting agent specializes in structured JSON output and executive communication. Each subagent is a complete agent with reasoning, memory, and tool access — not just a function.

**Agent Teams** coordinate multiple subagents under an orchestrator. The orchestrator isn't "smarter" — it's a state machine that manages control flow. It receives an incident, routes data to the recon agent, waits for results, passes them to the analysis agent, and collects a final report. This separation of concerns mirrors real SOC operations: different specialists handling different stages of incident response.

> **Tool-agnostic framing: worktrees and multi-agent patterns**
>
> **Worktrees** are a git feature, not a Claude Code feature. Any IDE or terminal supports them. VS Code Multi-Root Workspaces, Cursor, and JetBrains all work with git worktrees. The Claude Code integration shown here is one way to use them.
>
> **Orchestrator + specialized worker** is a pattern, not a framework. Whether you use the Anthropic SDK (shown here), LangGraph, AutoGen, or CrewAI — the architecture is the same: one agent routes and coordinates, specialized agents execute with focused context and tool scope. The framework changes; the pattern doesn't.

### Historical Context: Why Multi-Agent Systems?

In the early 2020s, security teams built monolithic tools that tried to do everything: threat hunting, analysis, reporting, remediation. These tools were slow to deploy, expensive to maintain, and brittle — a bug in the analysis logic could break the entire pipeline. The industry shifted toward microservices and specialized components. The agentic equivalent is agent teams: each agent is specialized, testable, and replaceable.

Consider MASS (Model & Application Security Suite), an AI security tool you'll study in this course. MASS demonstrates how production security assessment actually works — it doesn't have one monolithic "security analyzer" but 12 specialized analyzers (context analysis, MCP server security, attack surface mapping, workflow analysis, RAG security, model file integrity, etc.). They operate in parallel where possible and sequentially where required. This is the same approach you'd take when building production-grade security tooling: leverage specialization, coordinate at the orchestration layer.

### Orchestration Patterns

Three primary patterns emerge:

1. **Hierarchical:** One orchestrator agent with multiple subordinate agents. The orchestrator controls all routing and state. Best for: incident response (clear hierarchy matches command structures).

2. **Peer-to-Peer:** Multiple agents of equal status passing results to each other. Best for: research tasks where multiple perspectives enrich output (threat hunting where different analytical lenses find different threats).

3. **Pipeline:** Agents operate in sequence, each transforming input and passing to the next. Best for: processing workflows (sanitization → analysis → reporting).

An advanced variant is the **Expert Swarm Pattern**: multiple specialized agents attack the same problem in parallel, each bringing unique expertise, and a coordinator synthesizes their findings. Rather than routing (as in hierarchical), swarm patterns emphasize diversity. In security: a threat detection swarm might include agents specialized in network analysis, behavioral profiling, code analysis, and threat intelligence. Each independently analyzes the same incident and provides output. The coordinator merges findings, identifying where experts agree (high confidence) and where they diverge (investigate further).

> **Key Concept:** Multi-agent systems trade simplicity for specialization. A single large model might be faster, but multiple smaller specialized agents are more auditable, cheaper per task, and easier to swap/upgrade. This is the agentic equivalent of "Unix philosophy: do one thing well."
>
> **Further Reading:** See the Agentic Engineering additional reading on orchestration patterns for coverage of the Expert Swarm pattern and when it outperforms hierarchical orchestration.

### Cost & Token Economics

A critical insight: using multiple agents isn't necessarily more expensive. Why?

- **Specialization reduces tokens:** A recon agent doesn't need reasoning skills for reporting; a reporting agent doesn't need access to vulnerability APIs. Smaller prompts, fewer tokens, lower cost.
- **Caching amortizes context:** If you invoke the same agent 100 times on different inputs, the system prompt is cached after the first invocation. Cost drops 90%.
- **Parallel execution saves wallclock time:** If you run three subagents in parallel (possible with concurrent API calls), you finish in 1/3 the time versus sequential invocation.

Conversely, *poor orchestration costs more:* replicating context across agents, making unnecessary API calls, or routing requests to the wrong agent wastes tokens.

> **Cost Reference: What Real Multi-Agent Runs Actually Cost**
>
> Students often have no frame of reference for agentic system costs. From Anthropic's engineering team running production harnesses (March 2026, Opus 4.5/4.6):
>
> | Run Type | Duration | Cost |
> |---|---|---|
> | Solo agent (one-shot task) | ~20 min | ~$9 |
> | Full harness — planner + builder + QA (Opus 4.5) | ~6 hr | ~$200 |
> | Simplified harness (Opus 4.6) | ~4 hr | ~$125 |
> | Planner agent only | ~5 min | ~$0.50 |
> | Single QA/evaluation round | ~8 min | ~$3–4 |
>
> For your sprints: a 110-minute sprint with one evaluator pass costs roughly $15–40 depending on model and complexity. Track with `/cost` after every session. **Cost optimization levers:** use Haiku for recon/read-only subagents (~5× cheaper than Sonnet); use `/effort low` for iteration passes, `/effort high` for final analysis; cache static system prompts (90% discount on cached tokens); set a failure cap to limit evaluator iterations. *Source: Anthropic Engineering, "Harness design for long-running application development," March 2026.*

### Failure Modes & Resilience

Real agent systems fail. Plan for it.

- **Subagent timeout:** A recon agent queries a slow API and never returns. Solution: set timeouts at the orchestrator level; retry with exponential backoff; fallback to cached intelligence.
- **Malformed output:** An agent returns JSON that doesn't parse. Solution: validate output schema; if invalid, ask the agent to reformat; log the error.
- **Cascading failures:** The recon agent fails, so the orchestrator never calls the analysis agent, and the reporting agent produces incomplete output. Solution: design graceful degradation — the analysis agent can work with incomplete recon data; the reporting agent flags what's missing.
- **Token budget exhaustion:** An agent conversation grows too long and hits the context limit. Solution: implement summarization (periodically compress conversation history) and tool-defined outputs (agents write to files/databases rather than keeping everything in context).

> **Common Pitfall:** Designers often assume agents are deterministic. They aren't. The same prompt on the same input might produce different outputs due to temperature and model updates. Agentic systems must tolerate non-determinism: implement idempotency checks and result verification.

> **Integration estimation: existing tools cost more than new tools.** When your sprint plan includes integrating tools you already built (your Unit 2 MCP server, your Unit 3 Cedar policies), budget approximately 2× your initial estimate. Interface friction — schema mapping, error propagation, authentication flows, format mismatches between what your tool returns and what your agent expects — always surfaces during integration. This is not a failure of planning; it is the nature of integration work. Plan for it explicitly: "integrate existing tool" is a sprint task, not a free action.

> **Practice: "What this sprint will NOT build."** The scope definition for an agentic system sprint is incomplete without an explicit list of capabilities being deferred. Before finalizing any sprint spec, write this section:
>
> - **Capability included:** [what you will build, with acceptance criteria]
> - **Capability deferred:** [what you considered but are NOT building this sprint, with the reason and a note of which sprint it targets]
> - **Known gaps:** [gaps carried forward from prior audits — authentication, rate limiting, etc. — that this sprint acknowledges but does not close]
>
> The deferred list is not a failure — it's a scope decision. A sprint spec without a deferred list is a spec that hasn't finished thinking.

---

## Day 2 — Hands-On Lab: Multi-Agent Security Operations

### Lab Objectives

- Build a multi-agent incident response system with one orchestrator + three subagents
- Use worktrees to develop agents in parallel with teammates
- Implement resilient control flow, tool definitions, and agent communication
- Measure performance: time, cost, and output quality

### Setup & Architecture

Your team (2–3 students) will build a **Security Operations Center (SOC) Agent Team**. The scenario: your company receives a suspicious alert — "Unusual outbound traffic detected from finance server 14:32 UTC" — and your agent team must investigate and produce a comprehensive incident report.

**Architecture:**

```
Incident Alert → Orchestrator Agent (state machine + routing)
                 ├── Recon Agent (threat intel + IOCs)
                 ├── Analysis Agent (correlation + ATT&CK)
                 └── Reporting Agent (structured JSON output)
                      ↓
               Aggregated Results → Final Incident Report
```

### Parallel Development with Worktrees

Before you write any agent code, set up worktrees for parallel development:

```bash
# Team lead: Create the main project directory and initialize git
mkdir soc-agent-team && cd soc-agent-team
git init
git config user.email "team@noctua.local"
git config user.name "SOC Team"

# Team lead: Create main agent skeleton
cat > orchestrator.py << 'EOF'
# Orchestrator Agent - routes incident investigation
# TODO: Implement
EOF

git add orchestrator.py
git commit -m "initial: orchestrator skeleton"

# Each team member creates a worktree for their agent
# Member A: Recon agent
git worktree add worktrees/recon-agent -b feature/recon

# Member B: Analysis agent
git worktree add worktrees/analysis-agent -b feature/analysis

# Member C: Reporting agent
git worktree add worktrees/reporting-agent -b feature/reporting
```

Each team member now has an isolated directory where they develop without interfering with others. When each agent is complete and tested, the team merges back to main.

> **Pro Tip:** Use Claude Code's integrated terminal to manage worktrees. When you `git worktree add`, Claude Code creates a path you can navigate to — making it natural to develop multiple agents simultaneously in separate Claude Code panes.

### Lab Exercise: Three-Agent SOC System

**Architecture:** Incident arrives → Orchestrator routes to Recon Agent (gathers IoC data via your MCP tools) → Analysis Agent (applies CCT framework to synthesize findings) → Reporting Agent (generates structured JSON + Markdown report). All three run under the Orchestrator's control.

**Step 1: Initialize worktrees for parallel development**

```bash
cd ~/noctua-labs
git init soc-agent-system && cd soc-agent-system
git commit --allow-empty -m "init"
# Create worktrees for each agent component
git worktree add ../soc-recon   -b feature/recon-agent
git worktree add ../soc-analysis -b feature/analysis-agent
git worktree add ../soc-reporting -b feature/reporting-agent
```

**Step 2: Build the Recon Agent in its worktree**

In `../soc-recon/`, use Claude Code to build `recon_agent.py`: a Claude-backed agent with access to your Unit 2 MCP tools (`query_cve`, `query_asset_exposure`, `generate_incident_report`, `search_security_kb`). Input: raw alert text. Output: structured reconnaissance JSON with all IoCs enriched.

```bash
cd ~/soc-recon
claude
# Prompt: "Build a recon security agent in Python using the Anthropic SDK.
# The agent receives raw alert text and must:
# 1. Extract all IoCs (IPs, hashes, CVEs, domains)
# 2. Use tool calls to enrich each IoC via the MCP tools
# 3. Return structured JSON: {iocs: [{type, value, enrichment, severity}], summary}
# Use claude-sonnet-4-6. Include error handling for failed tool calls."
```

**Step 3: Build the Analysis Agent**

In `../soc-analysis/`, build `analysis_agent.py`: applies your CCT system prompt (from Week 4) to the Recon Agent's output. Applies 5-pillar CCT analysis, generates top-3 hypotheses with probabilities, and recommends next steps. System prompt is your `security-analyst-context-v2.md`.

**Step 4: Build the Reporting Agent**

In `../soc-reporting/`, build `reporting_agent.py`: takes Analysis Agent output and generates a validated incident report (using your Week 5–6 schemas) in both JSON and Markdown formats. Calculates MTTI based on timestamps passed from the Orchestrator.

**Step 5: Build the Orchestrator**

In the main `soc-agent-system/` branch, build `orchestrator.py`: receives the alert, calls Recon → Analysis → Reporting in sequence, handles timeouts (30s per agent), and implements graceful degradation (if Recon fails, Analysis works with partial data).

```bash
cd ~/noctua-labs/soc-agent-system
claude
# Prompt: "Build orchestrator.py that coordinates three agents in sequence.
# Import: recon_agent.run(alert_text), analysis_agent.run(recon_json),
# reporting_agent.run(analysis_json, start_ts)
# Requirements:
# - 30s asyncio timeout per agent via asyncio.wait_for()
# - If recon times out: pass partial data to analysis with recon_status='timeout'
# - If analysis fails: reporting still runs with error summary
# - Return: {mtti_seconds, recon_status, analysis_status, report}
# - Log each stage with timestamp to structured JSON log"
```

### Implementing the Orchestrator Agent

> **Key Concept:** The orchestrator is a **state machine**, not a reasoning engine. Its job is routing: accept an incident → delegate to recon agent → collect results → delegate to analysis agent → delegate to reporting agent → return final report. The orchestrator's system prompt is *minimal* — it's just instructions for control flow.

**The orchestrator should be responsible for:**
- **State tracking:** What stage of the pipeline are we in?
- **Data flow:** What output from stage N becomes input to stage N+1?
- **Error handling:** What if a subagent fails?
- **Timeouts & retries:** What if a subagent is slow?

**The orchestrator should NOT be responsible for:**
- Doing analysis (that's the analysis agent)
- Understanding threat intelligence (that's the recon agent)
- Formatting reports (that's the reporting agent)

**Claude Code Prompt for Building the Orchestrator:**

```
I'm building a three-stage incident response orchestrator agent.

Architecture:
- Orchestrator receives an incident alert
- Orchestrator delegates to Recon Agent to gather intelligence
- Orchestrator delegates to Analysis Agent to correlate findings
- Orchestrator delegates to Reporting Agent to produce JSON report
- Orchestrator returns the final report

Requirements:
1. The orchestrator's system prompt should be minimal (state machine, not reasoning engine)
2. Each subagent should be invoked as a separate API call
3. The orchestrator should handle the data flow: output from recon → input to analysis, etc.
4. Add error handling: if a subagent times out, use fallback data or escalate

Show me a Python class-based implementation of the orchestrator.
Include methods: orchestrate_incident(), invoke_recon_subagent(), invoke_analysis_subagent(), invoke_reporting_subagent().
```

**Key Implementation Pattern:**

```
incident_description → invoke_recon_subagent()
                             ↓ recon_results
                       invoke_analysis_subagent()
                             ↓ analysis_results
                       invoke_reporting_subagent()
                             ↓ final_report
                       Return to caller
```

Each subagent call is independent; you can later parallelize them using concurrent API calls for speed.

### Implementing the Recon Subagent

> **Key Concept:** The recon agent is **tool-driven**. Unlike the orchestrator (which is a state machine), the recon agent is agentic — it decides which tools to call and how to reason about their outputs. The agent loop is: (system prompt + incident) → (agent thinks) → (agent calls tool) → (agent sees result) → (repeat until done).

**Claude Code Prompt for Building the Recon Agent:**

```
I'm building a Threat Intelligence Recon Agent with Claude.

The agent should:
1. Accept an incident description
2. Extract IOCs (IP addresses, domains, hashes) from the incident
3. Use tools to check these IOCs against threat intelligence
4. Correlate findings with MITRE ATT&CK techniques
5. Return a structured JSON report with findings

Tools available to the agent:
- check_threat_intelligence(ioc: str): Looks up an IP/domain/hash; returns {reputation, last_seen, attributed_to, campaigns}
- query_mitre_attack(technique: str): Looks up MITRE technique; returns {name, description, tactics, mitigations}

Requirements:
1. Implement the agentic loop: invoke agent → agent calls tools → process results → repeat until done
2. Handle the case where the agent doesn't find any IOCs
3. Show error handling: what if a tool call fails?
4. Output JSON with: {incident_summary, iocs_found: [...], attack_techniques: [...], confidence_scores}

Show me working Python code.
```

**Key Implementation Pattern — the agentic loop:**

```python
while True:
  response = client.messages.create(model, system_prompt, tools, messages)
  if response.stop_reason == "tool_use":
    # Agent wants to use a tool
    for tool_call in response.content:
      result = execute_tool(tool_call.name, tool_call.input)
      messages.append(tool_result)
  else:
    # Agent is done
    break
```

**Review Checklist After Claude Generates Code:**

After Claude generates the recon agent, verify:
- [ ] The agent loop correctly handles tool calls (tool_use stop reason)
- [ ] Tool results are sent back to the agent as `tool_result` content blocks
- [ ] The final output is structured JSON (not free-form text)
- [ ] The agent can handle incidents with no IOCs (graceful degradation)
- [ ] Error handling for failed tool calls (e.g., unknown IOC)

### Error Handling & Resilience

> **Key Concept:** Real systems fail. Networks are unreliable. APIs timeout. Agents hallucinate. Your orchestrator must **survive failures gracefully**. The principle: *fail safe, not catastrophically.*

**Failure Modes in Multi-Agent Systems:**

1. **Subagent Timeout:** Recon agent hangs on a slow API call
2. **Subagent Hallucination:** Analysis agent returns invalid JSON or nonsensical findings
3. **Tool Failure:** A tool (e.g., threat DB lookup) times out or returns an error
4. **Cascading Failure:** Recon fails → no input to analysis → analysis produces empty output → reporting fails

**Resilience Patterns:**
- **Timeout & Retry:** If a subagent doesn't respond in 30 seconds, retry with backoff
- **Fallback Logic:** If a subagent fails, use degraded-mode analysis (simpler rule-based system)
- **Partial Data Handling:** If recon found 0 IOCs, analysis should continue with what it has and flag missing data
- **Output Validation:** Before using agent output, validate structure (is it valid JSON? Does it have required fields?)

**Claude Code Prompt for Resilience:**

```
I'm building resilience into my incident response orchestrator.

Requirements:
1. Each subagent call has a timeout (30 seconds)
2. If a subagent times out, retry with exponential backoff (2^attempt seconds)
3. After 3 failed attempts, use fallback data (e.g., "analysis inconclusive; escalate to SOC analyst")
4. Validate agent output: check it's valid JSON and has required fields
5. Log all failures with context for debugging

Implement:
- invoke_with_retry(subagent_func, incident_data, max_retries=3, timeout_sec=30)
- validate_agent_output(output, required_fields=[...])
- Example: If recon fails, what fallback data should orchestrator use?

Show working Python code with error handling.
```

**Graceful Degradation Example:**

If the recon agent times out, rather than failing the entire incident response:
- Orchestrator sends to analysis agent: `"Recon timed out. Proceeding with manual analysis baseline."`
- Analysis agent analyzes the raw incident data (no threat intel context)
- Reporting agent flags: `"Limited intelligence due to recon timeout; recommend human review"`
- Incident gets escalated to SOC analyst with a note about what failed

The incident response continues, but with transparency about limitations.

### Measurement During Lab

Track these metrics:

| Metric | Definition | How to Measure |
|---|---|---|
| **Recon Time** | Time from alert to recon completion | Timestamp before/after recon subagent |
| **Analysis Time** | Time from recon results to analysis completion | Timestamp before/after analysis subagent |
| **Report Time** | Time from analysis to final report | Timestamp before/after reporting subagent |
| **Total Time (aMTTR)** | Alert to final report | End timestamp - start timestamp |
| **Token Cost** | Tokens spent across all agents | Sum of `usage.input_tokens + usage.output_tokens` |

**Step 6: Merge and end-to-end test**

Merge all three agent branches into main. Run the full system against the Meridian Financial incident. Verify: (1) Recon enriches all IoCs, (2) Analysis applies CCT and generates 3 hypotheses, (3) Reporting produces valid JSON + Markdown. Record end-to-end MTTI.

**Step 7: Compare against Week 1 MTTI baseline**

Record the multi-agent system's MTTI for the Meridian Financial incident. Compare to your Week 1 manual MTTI. Calculate the improvement ratio. Consider: what is the cost per investigation (token cost)? Is the improvement worth the cost?

---

## Deliverables

1. **Multi-Agent Codebase** (`/soc-agent-team/`):
   - `orchestrator.py` — Main orchestrator agent with control flow
   - `recon_agent.py` — Recon subagent with tool definitions
   - `analysis_agent.py` — Analysis subagent with MITRE mapping
   - `reporting_agent.py` — Reporting subagent with JSON output
   - `main.py` — Entry point that runs the full pipeline
   - `requirements.txt` — Dependencies (anthropic>=0.16.0)

2. **Architecture Documentation** (`ARCHITECTURE.md`):
   - Diagram showing orchestrator → subagent data flow
   - Role of each subagent (inputs, outputs, tools)
   - Failure handling strategy
   - Token budget estimates

3. **Demo** (video or walkthrough, 5–10 min):
   - Show the incident alert being processed
   - Show each subagent completing its stage
   - Show final JSON report generated
   - Highlight error recovery (if tested)

4. **Performance Metrics** (`metrics.json`):

```json
{
  "incident": "finance server anomaly",
  "recon_time_sec": 4.2,
  "analysis_time_sec": 3.1,
  "report_time_sec": 2.5,
  "total_time_sec": 9.8,
  "tokens_orchestrator": 450,
  "tokens_recon": 620,
  "tokens_analysis": 580,
  "tokens_reporting": 400,
  "total_tokens": 2050,
  "estimated_cost_usd": 0.041
}
```

5. **MTTI Comparison** — Week 1 manual vs. Week 13 automated, with cost analysis

---

## Sources & Tools

- [Claude Agent SDK Documentation](https://docs.anthropic.com/en/docs/build-a-system-with-agents)
- [Anthropic API Reference](https://docs.anthropic.com/en/api/messages)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- Incident Response Best Practices (see `frameworks.html`)

---

> **Study With Claude Code:** Open Claude Code and try:
> - "Quiz me on the key concepts from this week's material. Start easy, then get harder."
> - "I think I understand multi-agent orchestration but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common mistakes teams make when building multi-agent systems? Do I have any of them?"
> - "Connect this week's multi-agent architecture to what we learned in Units 1–3. How do worktrees relate to the sprint workflow?"
