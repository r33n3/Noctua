# Week 9: Multi-Agent Security Systems I

**Semester 1 | Week 9 of 16**

## Learning Objectives

- Understand why multi-agent systems outperform single agents for complex security tasks
- Learn the five orchestration patterns: hierarchical, pipeline, debate, swarm, emergent
- Set up tmux for multi-agent visibility (required tool for Weeks 9-16)
- Understand the three-layer worktree model: human parallel, agent parallel, human+agent
- Experience manual multi-agent coordination and feel the pain of manual handoffs
- Experience agent teams with the Task tool and feel the power of automation
- Understand the dark factory concept applied to both offensive and defensive autonomy
- Apply the Assessment Stack per-agent and per-orchestration-pattern

---

## Day 1 — Theory

### Why Multi-Agent? Limitations of Single Agents

A single agent trying to conduct a complete security incident investigation must:
- Maintain context across all investigation steps
- Switch between reconnaissance, analysis, and reporting modes
- Keep track of findings from hours-earlier in the conversation
- Never lose focus as the conversation grows

The result: a 200K-token context window fills rapidly with investigation history, and the agent's quality degrades as context grows (Week 7 Station 1 demonstrated this empirically).

Multi-agent systems solve this through specialization:
- Recon agent: focused prompt, threat intel tools, small context, high throughput
- Analysis agent: focused on correlation and MITRE mapping
- Reporting agent: focused on structured JSON output

Each agent stays within its effective context range. The orchestrator coordinates without doing the heavy analytical work.

### Five Orchestration Patterns

**1. Hierarchical:** One orchestrator with multiple subordinate agents. The orchestrator controls all routing and state. Best for: incident response (clear hierarchy mirrors command structures).

**2. Pipeline:** Agents operate in sequence, each transforming input and passing to the next. Best for: processing workflows (sanitization → analysis → reporting).

**3. Debate:** Multiple agents analyze the same problem independently; a coordinator synthesizes conflicting views. Best for: high-stakes decisions where you want disagreement surfaced.

**4. Swarm:** Multiple specialized agents attack the same problem in parallel, each from their expertise angle. Best for: complex threat hunting where multiple analytical lenses (network, behavioral, code, intelligence) find different threats.

**5. Emergent:** Agents communicate peer-to-peer without a central coordinator. Best for: research exploration. Rarely recommended for security operations due to unpredictability.

### The Three-Layer Worktree Model

Git worktrees create parallel working directories on separate branches. For multi-agent security development, three distinct usage layers:

**Layer 1: Human Parallel Development**
Two students, each in their own worktree, developing different agents simultaneously. No merge conflicts during development. Merge when ready. Standard git workflow.

```bash
# Team lead creates the project
mkdir soc-agent-team && cd soc-agent-team && git init
git commit --allow-empty -m "initial"

# Each team member creates their worktree
git worktree add worktrees/recon-agent -b feature/recon
git worktree add worktrees/analysis-agent -b feature/analysis
git worktree add worktrees/reporting-agent -b feature/reporting
```

**Layer 2: Agent Parallel Execution**
Claude Code's Task tool spawns subagents, each in its own worktree. The orchestrator coordinates. Agents work simultaneously — this is how you get true parallelism.

```python
# Orchestrator using Task tool (conceptual)
# Claude Code's Task tool spawns Claude subagents in isolated contexts
task_recon = Task("Analyze threat intelligence for this incident", context=incident)
task_analysis = Task("Correlate findings with MITRE ATT&CK", context=incident)
# Both run simultaneously in separate worktrees
```

**Layer 3: Human + Agent Parallel Work**
Students develop agents in their worktrees while agent subagents run tests or build utilities in additional worktrees. tmux provides visibility across all worktrees simultaneously.

### The Worktree ↔ Agent Architecture Parallel

| Human Team (worktrees) | Agent Team (Task tool) |
|---|---|
| Each person in isolated worktree | Each agent in isolated context |
| Coordinate through git merges | Coordinate through orchestrator |
| Team lead assigns tasks | Orchestrator routes tasks |
| Code review catches integration issues | Inter-agent verification catches inconsistencies |
| Merge conflicts reveal design disagreements | Agent output conflicts reveal architectural issues |

This parallel isn't accidental. Learning to work in worktrees teaches the coordination skills you'll need to design agent teams.

### Terminal Multiplexer Setup

**tmux is required starting this week.** Multi-agent development requires visibility across multiple sessions simultaneously.

```bash
# Install
# Mac: brew install tmux
# Linux/WSL: sudo apt install tmux

# Create a named session for agent development
tmux new-session -s agentmux

# Essential commands
Ctrl+b %          # Split pane vertically
Ctrl+b "          # Split pane horizontally
Ctrl+b arrow-key  # Navigate between panes
Ctrl+b d          # Detach from session
tmux attach -t agentmux   # Reattach
tmux list-sessions        # See active sessions
```

**For better multi-worktree visibility (recommended):**
- macOS: cmux (https://cmux.dev) — vertical tabs per worktree, notification rings when agents need attention
- Windows: cmux-windows or Warp (https://warp.dev)
- Linux: WezTerm (https://wezfurlong.org/wezterm/)

All labs work with tmux alone. Agent-aware terminals provide better visibility for multi-worktree agent development.

### Dark Factory: Offensive and Defensive Autonomy

The "dark factory" — a fully automated AI pipeline running without human oversight — is both an attacker capability (GTG-1002 operated at 80-90% autonomy) and a defender capability (autonomous threat hunting, auto-response to known attack patterns).

The decision authority spectrum:
- Full human control: slow but accountable
- Human-supervised autonomy: agents act, humans review and approve at gates
- Supervised autonomy: agents act, humans monitor and can interrupt
- Full autonomy: lights-out, no human involvement

**Week 9's multi-agent SOC sits in "human-supervised autonomy":** agents investigate and report; humans approve any actions. This is the appropriate default for most security operations.

### Assessment Stack: Per-Agent Selection

In a multi-agent system, each agent has its own Assessment Stack decision:

| Agent | Problem Type | Computation | Model Tier | Why |
|-------|-------------|-------------|-----------|-----|
| Orchestrator | Routing | Deterministic | Haiku | Route decision is structural, not analytical |
| Recon Agent | Retrieval | Reasoning | Sonnet | Moderate reasoning needed for IOC correlation |
| Analysis Agent | Reasoning | Reasoning | Sonnet/Opus | Complex judgment required |
| Reporting Agent | Generation | Reasoning | Haiku | Format transformation, not novel analysis |

Using Opus for the orchestrator (which just routes between agents) is a $5 mistake when Haiku suffices.

---

## Day 2 — Lab (Three-Step Progression)

**Lab Objective:** Build a SOC Agent Team through three progressive steps, experiencing the tradeoffs at each level.

### Step 1 (15 min): Manual Multi-Agent — Feel the Pain

**Setup:** 3 tmux panes, each with a separate Claude Code session in a separate worktree.

```bash
# Create three worktrees
mkdir soc-manual && cd soc-manual && git init
git commit --allow-empty -m "initial"
git worktree add worktrees/recon -b recon-agent
git worktree add worktrees/analysis -b analysis-agent
git worktree add worktrees/reporting -b reporting-agent

# Open three tmux panes and navigate to each worktree
tmux new-session -s agentmux
# Pane 1: cd worktrees/recon && claude
# Pane 2 (Ctrl+b "): cd worktrees/analysis && claude
# Pane 3 (Ctrl+b "): cd worktrees/reporting && claude
```

**Each session has a different system prompt:**
- Recon (Pane 1): "You are a threat intelligence agent. Extract IOCs from incidents and check threat databases."
- Analysis (Pane 2): "You are a security analyst. Correlate provided findings with MITRE ATT&CK techniques."
- Reporting (Pane 3): "You are a report writer. Produce structured JSON incident reports from provided findings."

**Incident:**
```
Unusual outbound traffic detected from finance server 14:32 UTC.
Source: finance-prod-01 (10.0.1.45)
Destination: 203.45.12.89:443 (Singapore)
Volume: 2.3 GB in 8 minutes
Protocol: HTTPS (encrypted)
User context: Last legitimate access 09:15 UTC same day
```

**Manual process:**
1. Submit incident to Pane 1 (Recon) → wait for IOC findings
2. Manually copy Pane 1 output → paste into Pane 2 (Analysis)
3. Wait for analysis → manually copy to Pane 3 (Reporting)
4. Collect final JSON report

**Record:** Total time for manual handoffs. How many times did you have to copy-paste? How much did context drift between handoffs?

### Agent Team Cost Dashboard

Your SOC agent team has multiple agents, each potentially using different models. Track cost per agent to optimize your architecture:

```python
import anthropic
from dataclasses import dataclass, field
from concurrent.futures import ThreadPoolExecutor, as_completed

client = anthropic.Anthropic()

# Pricing per MTok (update each semester)
MODEL_PRICING = {
    "claude-haiku-4-5-20251001": {"input": 1.00, "output": 5.00, "cache_read": 0.10, "cache_write": 1.25},
    "claude-sonnet-4-6":         {"input": 3.00, "output": 15.00, "cache_read": 0.30, "cache_write": 3.75},
    "claude-opus-4-6":           {"input": 5.00, "output": 25.00, "cache_read": 0.50, "cache_write": 6.25},
}

@dataclass
class AgentStats:
    total_cost: float = 0.0
    input_tokens: int = 0
    output_tokens: int = 0
    cache_reads: int = 0
    invocations: int = 0

agent_costs: dict[str, AgentStats] = {}

def run_agent(role: str, prompt: str, model: str) -> tuple[str, AgentStats]:
    stats = AgentStats()
    pricing = MODEL_PRICING[model]
    response = client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    usage = response.usage
    cache_reads = getattr(usage, "cache_read_input_tokens", 0)
    cache_writes = getattr(usage, "cache_creation_input_tokens", 0)
    stats.input_tokens = usage.input_tokens
    stats.output_tokens = usage.output_tokens
    stats.cache_reads = cache_reads
    stats.invocations = 1
    stats.total_cost = (
        (usage.input_tokens / 1_000_000) * pricing["input"] +
        (usage.output_tokens / 1_000_000) * pricing["output"] +
        (cache_reads / 1_000_000) * pricing["cache_read"] +
        (cache_writes / 1_000_000) * pricing["cache_write"]
    )
    return role, stats

# Run agent team in parallel
tasks = [
    ("recon",      recon_prompt,    "claude-haiku-4-5-20251001"),
    ("enrichment", enrich_prompt,   "claude-sonnet-4-6"),
    ("analysis",   analysis_prompt, "claude-sonnet-4-6"),
    ("reporting",  report_prompt,   "claude-haiku-4-5-20251001"),
]

with ThreadPoolExecutor() as executor:
    futures = [executor.submit(run_agent, role, prompt, model) for role, prompt, model in tasks]
    for future in as_completed(futures):
        role, stats = future.result()
        agent_costs[role] = stats

# Print cost dashboard
print("\n=== Agent Team Cost Dashboard ===")
for role, stats in agent_costs.items():
    cache_rate = (stats.cache_reads / stats.input_tokens * 100) if stats.input_tokens else 0
    avg_cost = stats.total_cost / stats.invocations if stats.invocations else 0
    print(f"\n{role}:")
    print(f"  Total cost:          ${stats.total_cost:.4f}")
    print(f"  Invocations:         {stats.invocations}")
    print(f"  Avg cost/invocation: ${avg_cost:.4f}")
    print(f"  Cache read rate:     {cache_rate:.1f}%")

total = sum(s.total_cost for s in agent_costs.values())
print(f"\nTotal team cost: ${total:.4f}")
```

**Exercise: Model Right-Sizing**

Run your SOC system twice:
1. All agents using Sonnet 4.6
2. Orchestrator + classifier on Haiku, enrichment on Sonnet, analysis on Opus

Compare total cost, output quality, and cache hit rate per agent. Which configuration gives the best quality-per-dollar?

---

### Step 2 (30 min): Agent Teams with Task Tool — Feel the Power

Now automate the handoffs using Claude Code's Task tool. The orchestrator spawns subagents that run simultaneously.

Use Claude Code to implement:

```python
# orchestrator.py
import anthropic

client = anthropic.Anthropic()

INCIDENT = """
Unusual outbound traffic from finance-prod-01 (10.0.1.45)
Destination: 203.45.12.89:443 (Singapore)
Volume: 2.3 GB in 8 minutes at 14:32 UTC
"""

def invoke_recon_agent(incident: str) -> dict:
    """Recon agent: extract IOCs and threat intelligence."""
    response = client.messages.create(
        model="claude-haiku-4-5",  # Haiku for routing/extraction
        max_tokens=1024,
        system="""You are a threat intelligence recon agent.
Extract IOCs (IPs, domains, hashes) from the incident.
Return JSON: {iocs: [...], threat_indicators: [...], recommended_queries: [...]}""",
        messages=[{"role": "user", "content": f"Analyze this incident for IOCs:\n{incident}"}]
    )
    return {"agent": "recon", "output": response.content[0].text,
            "tokens": response.usage.input_tokens + response.usage.output_tokens}

def invoke_analysis_agent(incident: str, recon_results: dict) -> dict:
    """Analysis agent: correlate with MITRE ATT&CK."""
    response = client.messages.create(
        model="claude-sonnet-4-6",  # Sonnet for moderate reasoning
        max_tokens=1024,
        system="""You are a security analysis agent.
Given incident data and IOC findings, correlate with MITRE ATT&CK.
Return JSON: {mitre_techniques: [...], attack_stage: "...", confidence: 0-100, reasoning: "..."}""",
        messages=[{"role": "user", "content": f"Incident:\n{incident}\n\nRecon findings:\n{recon_results['output']}\n\nAnalyze for MITRE ATT&CK."}]
    )
    return {"agent": "analysis", "output": response.content[0].text,
            "tokens": response.usage.input_tokens + response.usage.output_tokens}

def invoke_reporting_agent(incident: str, recon: dict, analysis: dict) -> dict:
    """Reporting agent: produce structured incident report."""
    response = client.messages.create(
        model="claude-haiku-4-5",  # Haiku for format transformation
        max_tokens=1024,
        system="""You are a security reporting agent.
Produce a structured incident report from provided data.
Return JSON: {incident_id, severity, summary, iocs, mitre_techniques, recommended_actions, aiuc1_domains_affected}""",
        messages=[{"role": "user", "content": f"Produce incident report:\nIncident: {incident}\nRecon: {recon['output']}\nAnalysis: {analysis['output']}"}]
    )
    return {"agent": "reporting", "output": response.content[0].text,
            "tokens": response.usage.input_tokens + response.usage.output_tokens}

# Orchestrate
import time
start = time.time()

recon = invoke_recon_agent(INCIDENT)
analysis = invoke_analysis_agent(INCIDENT, recon)
report = invoke_reporting_agent(INCIDENT, recon, analysis)

total_time = time.time() - start
total_tokens = recon["tokens"] + analysis["tokens"] + report["tokens"]

print(f"Total time: {total_time:.1f}s")
print(f"Total tokens: {total_tokens}")
print(f"Estimated cost: ${total_tokens * 0.000003:.4f}")
print(f"\nFinal Report:\n{report['output']}")
```

**Compare to Step 1:**
- Time to complete (automated vs. manual)
- Context fidelity (did each agent receive accurate context from the previous?)
- Quality of final report

### Step 3 (45 min): Human + Agent Parallel Work

**Team of 2-3 students:**
- Person A: develops an improved analysis agent in their worktree
- Person B: develops an improved reporting agent in their worktree
- Agent subagents: run reconnaissance and testing in additional worktrees

```bash
# Layout in tmux (4 panes):
# Pane 1: Person A developing analysis agent (worktrees/human-a)
# Pane 2: Person B developing reporting agent (worktrees/human-b)
# Pane 3: Agent running recon tests (worktrees/agent-recon)
# Pane 4: Orchestrator watching all three (main branch)
```

**The parallel:** Students develop agents while agents run tests. The same coordination pattern (isolation → handoff → merge) applies to both human team members and AI agents.

---

## Deliverables

1. **Step 1 manual timing results** — total time, number of copy-pastes, quality degradation observed
2. **Step 2 orchestrator code** — working multi-agent system with per-agent token tracking
3. **Comparison table** — Step 1 vs. Step 2: time, cost, quality, coordination overhead
4. **Step 3 architecture diagram** — tmux layout showing human + agent parallel work
5. **Assessment Stack per-agent table** — model selection justification for each agent in your system

---

## AIUC-1 Integration

**Domain B revisited — agent-to-agent trust boundaries:**

In a multi-agent system, each agent trusts the orchestrator's routing but should not blindly trust the content of another agent's output. The analysis agent should validate that the recon agent's output matches expected schema before using it. The reporting agent should not simply pass through claims from the analysis agent without schema validation.

**Trust but verify:** Agent-to-agent handoffs need the same input validation you applied to human-to-agent inputs in Week 3.

## V&V Lens

**Inter-Agent Verification:** When Agent B receives output from Agent A, how does it verify the output is trustworthy? This week introduces the concept of schema validation at handoff points — a V&V practice for multi-agent systems.

Before using another agent's output, check:
1. Is the output schema-valid?
2. Do claims cite evidence (or just assert)?
3. Are confidence levels internally consistent?

The multi-agent audit trail must span all agents — not just the final report, but every handoff.

### V&V Lens: Inter-Agent Verification

In a multi-agent system, V&V Discipline means agents don't blindly trust each other's outputs. Design verification into your agent handoffs:

- The analysis agent should spot-check the recon agent's findings before building conclusions on them
- The reporting agent should flag any claims from upstream agents that lack supporting evidence
- The orchestrator should detect when subagent outputs conflict and escalate rather than arbitrarily choosing one

This is Calibrated Trust applied to agent-to-agent communication. The recon agent's factual findings (IP lookup, CVE data) deserve higher trust than the analysis agent's judgment calls (attacker intent, risk severity). Design your handoff logic accordingly.

Add to your deliverable: document where in your agent pipeline V&V occurs. Who checks whom? What happens when verification fails?

---

## 🧠 Domain Assist: SOC Agent Persona Design

When designing agent personas for your SOC team, you need to understand what each role actually does day-to-day. Most of you haven't worked in every SOC role. Use Claude Chat to build realistic personas:

> **🧠 Domain Assist:** Before building your SOC agent personas, open Claude Chat and ask: "I'm designing an AI agent that acts as a Threat Intelligence Researcher in a SOC. Help me understand: 1) What does a real Threat Intel Researcher do on a typical day? 2) What tools do they use? What data sources do they consult? 3) What's their mental model when they see a new IOC? What's their workflow? 4) What expertise do they have that other SOC roles don't? 5) What frustrates them?" Do this for each persona. An agent briefed like a real professional will behave more realistically.

---

## 🛠️ Skill Opportunity

The agent persona definitions you created (Malware Analyst, Threat Intel Researcher, etc.) are reusable. Package them as a `/soc-personas` skill with each persona in `references/`. Next time you build a multi-agent system, you can invoke `/soc-personas` to get pre-designed roles.

---

## Worktrees as Team Coordination: The Human-Agent Parallel

Notice the parallel between your team and your agent team:

| Human Team (using worktrees) | Agent Team (your SOC system) |
|-----|------|
| Each person works in an isolated worktree on their agent | Each agent operates with isolated context and tools |
| Team members coordinate through git merges and discussions | Agents coordinate through shared state and message passing |
| The team lead (you) orchestrates who works on what | The orchestrator agent routes tasks to specialist agents |
| Code review catches integration issues | Inter-agent verification catches inconsistencies |
| Merge conflicts reveal design disagreements | Agent output conflicts reveal architectural issues |

This isn't a coincidence. Worktrees model the same coordination pattern as multi-agent systems. Learning to work effectively in worktrees teaches you the coordination skills you'll need to design effective agent teams.

**Team Exercise Enhancement:**
- Each team member should work in their worktree for 30 minutes without communicating with teammates
- Then reconvene: What assumptions did each person make? Where do the agents not connect properly?
- This mirrors what happens when agents operate independently — the integration points are where bugs live

---

## Dark Factory: Decision Authority Spectrum

Your Week 9 multi-agent SOC sits in "human-supervised autonomy." But how far toward lights-out do you go? The key question isn't whether to automate — it's *what* to automate and what to keep human:

| Decision Type | Autonomy Level | Example |
|---|---|---|
| **Informational** | Full autonomy | IOC extraction, alert classification |
| **Protective — reversible** | Autonomy + notification | Add watchlist entry, increase monitoring |
| **Protective — hard to reverse** | Human approval | Quarantine production server |
| **Destructive** | Human approval required | Block user account, wipe system |

Your Week 9 agent team should document where each of its outputs falls on this spectrum. What does the system decide autonomously? What does it hand to a human?

---

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the key concepts from this reading. Start easy, then get harder."
> - "I think I understand multi-agent orchestration but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common misconceptions about multi-agent systems? Do I have any of them?"
> - "Connect this week's material to what we learned in Week 7. How do they relate?"

---

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.
