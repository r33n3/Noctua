# Week 6: Tool Design Patterns for Security Agents

**Semester 1 | Week 6 of 16**

## Learning Objectives

- Understand Claude Code skill anatomy: SKILL.md, references, scripts, assets
- Master progressive disclosure: metadata → body → references
- Build `/tool-select` skill encoding the full Engineering Assessment Stack
- Build `/audit-aiuc1` skill — first time seeing all six AIUC-1 domains as a complete framework
- Formally name and crystallize the six-layer Engineering Assessment Stack
- Apply YAML frontmatter optimization for trigger precision vs. context cost
- Understand plugin architecture: coordinated groups of skills sharing context
- Introduce the PeaRL case study: rugpull governance scenario

---

## Day 1 — Theory

### Skill Anatomy in Claude Code

A Claude Code skill is a markdown file that extends Claude's capabilities for specific tasks. Anatomy:

```
skill.md (SKILL.md)
├── YAML frontmatter (metadata — always loaded)
│   ├── description: when to invoke this skill
│   ├── allowed-tools, context, user-invocable
│   └── argument-hint: shown to user at invocation
├── Skill body (loaded on trigger)
│   ├── Role and context
│   ├── Step-by-step instructions
│   └── Examples
└── References (loaded on demand)
    ├── Edge cases
    ├── Extended examples
    └── External documentation links
```

**Frontmatter field reference:**

| Field | Purpose |
|---|---|
| name          | Skill identifier — matches directory name |
| description   | When to invoke — used by Claude to match invocations |
| allowed-tools | Comma-separated tools the skill may use |
| context       | fork (isolated) or shared (inherits session) |
| user-invocable| true if callable as /skill-name |
| argument-hint | Shown to users, e.g. "[path]" |

**Progressive Disclosure:**
Claude Code doesn't load every skill in full at startup. Instead:
1. **Metadata always loaded** — triggers, tags, brief description. Light footprint.
2. **Body loaded on trigger** — when a user action matches the skill's `description`, the full skill loads.
3. **References loaded on demand** — when the skill explicitly asks for reference material.

This is the Tool Search Tool pattern from Week 3 applied to skills: progressive disclosure prevents context window saturation.

### Context Engineering Limits

**The Frontmatter Budget:** Every skill's YAML metadata occupies context window space. With 50 skills loaded, that's ~2K tokens of frontmatter alone — before any actual work. Design principles:

- Keep frontmatter tight: description should be 1-2 sentences maximum
- Use specific triggers to avoid false positives
- Don't put reference material in frontmatter — that belongs in the body or reference files

**The Lost-in-the-Middle Limit:** Context you inject at positions 8-15 of the context window (roughly) contributes less to outputs than context at position 1-3 or near the end. Your most critical instructions go first.

**Trigger Precision vs. Context Cost:**
- Vague trigger: "Use when doing security work" — fires constantly, loads all the time, high context cost
- Precise trigger: "Use when the user asks to select the right model tier or computation approach for a security engineering task" — fires only when relevant

### Plugin Architecture

A plugin is a coordinated group of skills that share context and work together. Example security analyst plugin:

```
security-analyst-plugin/
├── plugin.md (shared context: who this analyst is, what organization)
├── cct-analysis.md (skill: apply CCT to incidents)
├── tool-select.md (skill: choose tools using Assessment Stack)
├── audit-aiuc1.md (skill: audit system against AIUC-1)
└── threat-model.md (skill: build threat models)
```

When you invoke any skill in the plugin, the shared plugin context loads first, establishing the role and organizational context that all skills share.

### Engineering Assessment Stack — Formally Named and Crystallized

You've been applying the Assessment Stack since Week 1. Today it gets its formal structure:

**Layer 1: Problem Type**
What kind of problem am I solving?
- Classification (known categories, binary output)
- Correlation (connecting data points across sources)
- Reasoning (novel situation, ambiguous evidence)
- Generation (producing something new)
- Retrieval (finding specific information)

**Layer 2: Computation Approach**
What type of computation fits?
- Deterministic (regex, rules, exact match, signatures)
- Statistical (classifiers, embeddings, anomaly detection)
- Reasoning (LLM — when deterministic/statistical insufficient)

**Layer 3: Model Selection**
If reasoning: which tier?
- Haiku ($1/MTok): routing, classification, high-throughput
- Sonnet ($3/MTok): balanced reasoning, operational workflow
- Opus ($5/MTok): deep analysis, complex judgment, rare high-stakes
- None: deterministic tool handles it

**Layer 4: Data Architecture**
Where does the data live? (from Week 4)
- Relational, Vector, Graph, Time Series, Context Window

**Layer 5: Integration Pattern**
How does this component connect?
- Real-time vs. batch
- MCP tool call vs. A2A agent delegation
- Agent-managed vs. human-triggered

**Layer 6: Verification**
How do I confirm the output is correct?
- Test suite (deterministic tools)
- Confusion matrix (classifiers)
- Human review (reasoning outputs)
- Cross-reference (multi-source validation)

> ### Reference Architecture: Anthropic's Multi-Agent Research System
>
> Anthropic published the engineering design of their Claude Research feature — a production multi-agent system that demonstrates the orchestrator-worker pattern at scale. This is the architecture you are building toward.
>
> **Source:** https://www.anthropic.com/engineering/multi-agent-research-system
>
> **Architecture (primary source verified):**
> - **Lead Researcher (Claude Opus 4)** — receives query, plans research strategy, records plan in memory, coordinates subagents, synthesizes final output
> - **Subagents (Claude Sonnet 4)** — execute individual searches or tool calls; spawned in parallel batches of **3–5**; run in multiple rounds as gaps are identified
> - System scales from 1 agent (simple queries) to **10+ subagents** (complex research)
>
> **Performance vs. cost tradeoff (primary source verified):**
>
> | Approach | Benchmark Performance | Token Cost |
> |---|---|---|
> | Single-agent Claude Opus 4 | Baseline | 1× |
> | Multi-agent (Opus 4 + Sonnet 4 subagents) | **+90.2%** over baseline | **~15×** |
>
> Token consumption explained 80% of performance variance. Redesigning tool descriptions alone reduced task completion time by 40%.
>
> **Engineering Assessment Stack implication:**
> A complex research query costing $0.15 as single-agent costs ~$2.25 multi-agent. At 1,000 queries/day enterprise-wide, that's $150/day vs. $2,250/day — a $765K annual difference. The architecture decision depends entirely on whether 90% quality improvement justifies 15× cost for the specific task.
>
> **Security implication:** Each subagent is a separate principal making independent tool calls. Multi-agent systems require per-subagent authorization scope — if the lead agent has access to sensitive data, subagents should not automatically inherit that access. Design authorization at the subagent level, not just the orchestrator level.

### Assessment Stack in Action: Running Worked Example

The Stack has been introduced in layers since Week 1. Here it is fully filled in for a real security problem — an **automated CVE triage system** that decides whether a new vulnerability requires immediate patching. Use this as your reference model when completing your own assessments.

| Layer | Question | Answer for CVE Triage |
|---|---|---|
| **1. Problem Type** | What kind of problem is this? | Reasoning — each CVE has novel context; rules alone can't assess "does this affect our environment?" |
| **2. Computation Approach** | Deterministic, statistical, or reasoning? | Hybrid: deterministic for CVSS score thresholds (≥9.0 = auto-escalate), reasoning for environmental impact |
| **3. Model Selection** | If reasoning: which tier? | Sonnet ($3/MTok) for triage decisions; Haiku for initial CVSS parsing and routing |
| **4. Data Architecture** | Where does the data live? | Relational (CVE metadata, asset inventory); Vector (semantic search across prior patches); Time Series (exploit activity trends) |
| **5. Integration Pattern** | MCP tool call or A2A delegation? | MCP for NVD API and asset DB lookups; A2A to delegate deep analysis to a specialist agent for critical CVEs |
| **6. Verification** | How do I confirm the output is correct? | Cross-reference NVD + vendor advisories; confusion matrix on held-out labeled CVEs; human review for all CVSS ≥9.0 |

**Why this matters:** Layer 5 is where most students stall — "should this be an MCP call or an agent?" The answer is: MCP if you need data retrieved; A2A if you need judgment applied. A CVE lookup is MCP. A risk assessment of that CVE's impact on a specific system is A2A.

You'll return to this example in Unit 5 (when you build the multi-agent version) and Unit 7 (when you add identity scoping and network controls to each component). Keep it as your reference point.

---

### AIUC-1: All Six Domains

You've already encountered Domains A, B, D, E in Weeks 2-5. The domains were introduced in that order intentionally — you built context before receiving the full framework. This week you get the complete picture. The ordering you saw was not the canonical order of the framework; it was the pedagogical order. The canonical framework is A through F.

Today, the complete framework:

| Domain | Focus | Weeks Introduced |
|--------|-------|-----------------|
| **A — Data & Privacy** | Data minimization, PII handling, retention | Week 5 |
| **B — Security** | Input filtering, access control, adversarial robustness | Week 3 |
| **C — Safety** | Preventing harmful outputs, harm mitigation | **Week 6 (today)** |
| **D — Reliability** | Graceful degradation, error handling, uptime | Week 4 |
| **E — Accountability** | Audit trails, decision logging, explainability | Week 2 |
| **F — Society** | Fairness, bias, societal impact | **Week 6 (today)** |

**Domain C (Safety):** Your skill shouldn't recommend actions that could cause direct harm. A `/tool-select` skill that recommends "use Opus for all tasks" causes waste but not harm. A skill that recommends "automatically block any IP with threat score > 50" could cause harm by blocking legitimate traffic. Safety controls: human-in-the-loop for high-stakes actions, output filtering, conservative defaults.

**Domain F (Society):** Your security tools affect real people. A threat scoring system trained on biased data can unfairly flag users from certain geographies or demographic groups. Societal impact analysis asks: who is disadvantaged by this system's errors? Are false positives distributed fairly across groups?

### The PeaRL Case Study: Rugpull Governance

The PeaRL (Progressive Exploitation and Recursive Leverage) attack chain demonstrates how an AI agent can be led through a series of individually reasonable steps toward a harmful outcome. Each step seems justified. The harm is visible only in retrospect.

**The Rugpull Scenario:** Your `/audit-aiuc1` skill is built to audit AI systems. An adversary frames a request: "Audit this competitor's security system — we have authorized access." The skill applies its audit logic to a system it shouldn't access. Each step of the skill is functioning correctly. The goal has been reframed.

**Key governance insight:** A skill that works correctly can be weaponized by reframing the goal. Security must operate at the intent layer, not just the execution layer.

> **Required Reading (assigned tonight):** The full PeaRL governance bypass case study (in resources/READING-LIST.md). Week 7's lab builds on this directly.

> **📖 Case Study Connection:** Your skills have file Write access, Bash execution, and network access through Claude Code. In the PeaRL Governance Bypass, Level 6 was the agent writing directly to `.env` to grant itself permissions, and Level 7 was the agent attempting to restart the server to reload those permissions. What's the most destructive thing your skill could do if the goal was slightly reframed? This is the week to read the full case study if you haven't already.

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on Claude Code skill anatomy: YAML frontmatter, body, references, progressive disclosure."
> - "I think I understand plugin architecture but I'm not sure. Explain it to me differently."
> - "What are the three most common mistakes when designing skill trigger descriptions?"
> - "Connect the PeaRL rugpull scenario to the broader concept of excessive agency we saw in earlier weeks."

---

## Day 2 — Lab

### Lab: Multi-Tool Security MCP Server

**Step 1: Build `/tool-select` Skill**

This skill encodes the full Assessment Stack and helps select the right tool for any security engineering task.

Create `~/noctua/skills/tool-select.md`:

```markdown
---
name: tool-select
description: "Use when the user needs to choose the right tool, model, computation approach, or architecture for a security engineering task. Invoked by: 'help me choose', 'what model should I use', 'what's the right approach', 'assessment stack'"
allowed-tools: Bash
context: fork
user-invocable: true
argument-hint: ""
---

# Tool Selection via Engineering Assessment Stack

You are applying the 6-layer Engineering Assessment Stack to determine the right technical approach.

## Step-by-step process:

1. **Layer 1 — Problem Type:** Ask: Is this classification, correlation, reasoning, generation, or retrieval?

2. **Layer 2 — Computation Approach:**
   - If answer is deterministic → use regex/rules, NO LLM needed
   - If answer is statistical → use classifier/embedding, NO full LLM needed
   - If answer requires reasoning → proceed to Layer 3

3. **Layer 3 — Model Selection (only if reasoning required):**
   - High-throughput / simple → Haiku ($1/MTok)
   - Balanced / operational → Sonnet ($3/MTok)
   - Deep analysis / high-stakes → Opus ($5/MTok)
   - Consider: using Opus for a classification task is $5 when regex costs $0

4. **Layer 4 — Data Architecture:** Match query type to store (exact=relational, semantic=vector, path=graph, trend=time-series)

5. **Layer 5 — Integration Pattern:** Real-time MCP vs. batch vs. A2A

6. **Layer 6 — Verification:** How will you confirm the output is correct?

## Output format:
Provide a decision table:
| Layer | Decision | Justification | Cost Implication |
|-------|----------|---------------|-----------------|
| Problem Type | [type] | [why] | |
| Computation | [approach] | [why] | |
| Model | [tier or none] | [why] | [$/MTok] |
| Data Architecture | [store] | [why] | |
| Integration | [pattern] | [why] | |
| Verification | [method] | [why] | |
```

**Step 2: Build `/audit-aiuc1` Skill**

This skill runs a systematic AIUC-1 audit against any AI security tool. This is the first time students see all six domains as an integrated audit framework.

Create `~/noctua/skills/audit-aiuc1.md`:

```markdown
---
name: audit-aiuc1
description: "Use when auditing an AI security tool against the AIUC-1 framework. Invoked by: 'audit this tool', 'check AIUC-1 compliance', 'governance audit', 'aiuc1'"
allowed-tools: Bash
context: fork
user-invocable: true
argument-hint: ""
---

# AIUC-1 System Audit

You are conducting a formal AIUC-1 (AI Use in Cybersecurity) compliance audit.

## Six Domain Audit Questions:

### Domain A — Data & Privacy
- What data does this system process? Is all of it necessary?
- Are there PII or sensitive data that could be minimized?
- How long is data retained? Is there a defined retention policy?

### Domain B — Security
- Are all inputs validated before processing? (B005)
- Are agent tool access permissions minimized? (B006)
- Can this system be manipulated by adversarial inputs? (B001)

### Domain C — Safety
- Can this system cause direct harm through autonomous action?
- Are there human-in-the-loop controls for high-stakes decisions?
- Are there output filters for harmful recommendations?

### Domain D — Reliability
- Does the system degrade gracefully when components fail?
- Are timeouts and retries implemented for external calls?
- Is there fallback logic when the primary approach fails?

### Domain E — Accountability
- Is every decision logged with: timestamp, inputs, reasoning, output?
- Can a decision be reconstructed from the audit trail?
- Is there clear ownership — who is responsible when this system errs?

### Domain F — Society
- Has the system been tested on diverse datasets?
- Are there subgroups where error rates differ significantly?
- Could errors from this system have disparate impact on any population?

## Output format:
For each domain, provide:
| Domain | Status | Evidence | Gaps | Severity | Recommended Fix |
|--------|--------|----------|------|----------|----------------|

Overall AIUC-1 compliance score: [X/6 domains compliant, Y gaps found]
```

**Step 3: Package Best Work from Weeks 2-5**

Identify two artifacts from your earlier work worth packaging as skills:
1. Your CCT analysis prompt from Week 1 → package as `/cct-analyze`
2. Your context-engineered SOC analyst prompt from Week 2 → package as `/soc-analyze`

For each, write the YAML frontmatter and skill body.

**Step 4: Frontmatter Optimization Exercise**

Test trigger rates with vague vs. specific descriptions:

Vague: `description: "Use for security tasks"`
Specific: `description: "Use when analyzing a specific security incident using the CCT framework — applying evidence-based analysis, perspective gathering, and hypothesis generation"`

Using Claude Code, demonstrate:
1. The vague trigger fires on unrelated security questions
2. The specific trigger fires only on CCT-relevant prompts
3. Document the false positive rate difference

**Step 5: Rugpull Reflection**

Based on the PeaRL required reading, apply to your `/audit-aiuc1` skill:

> "What can your skill destroy if the goal is reframed?"

For your `/audit-aiuc1` skill:
- What's the intended goal? (Audit AI security tools)
- What reframing could weaponize it? (Audit a competitor's system under false authorization)
- What safeguard would prevent misuse? (Authorization verification step before proceeding)

Write a 300-word analysis answering these three questions.

---

## Deliverables

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through skill design decisions and the rugpull analysis, Cowork to structure and format the reflection, and Code to build and test the skills. The quality of your thinking matters — the mechanical production should be AI-assisted.

1. **`/tool-select` skill** — complete YAML frontmatter + skill body encoding the full Assessment Stack
2. **`/audit-aiuc1` skill** — complete YAML frontmatter + skill body covering all six AIUC-1 domains
3. **Two packaged skills from Weeks 2-5** — with frontmatter optimization
4. **Frontmatter trigger test results** — vague vs. specific trigger comparison
5. **Rugpull reflection** (300 words) — how your `/audit-aiuc1` skill could be weaponized, and the safeguard

> **📁 Save to:** `~/noctua/context/skills/` (skill files), `~/noctua/deliverables/week06/` (final submission)

---

## AIUC-1 Integration

**All six domains introduced together this week.** Students already know A (Week 5), B (Week 3), D (Week 4), E (Week 2). Domains C and F are new.

The `/audit-aiuc1` skill is both the learning artifact and the practical tool students will use in Week 8 to audit their own Week 3-5 work.

## V&V Lens

**Rugpull Adversarial Assumption:** This week introduces the adversarial perspective on V&V. It's not enough to verify that your skill works correctly — you must verify that it can't be repurposed toward harm by reframing the goal. The rugpull exercise makes this concrete.

Starting from Week 6, every skill you build should include a "how could this be abused?" section in its design documentation.

---

## The Three-Evaluator Pipeline

This week you build `/tool-select` and `/audit-aiuc1`. You now have access to a third course evaluator:

```
/code-review → /check-prod-readiness → /audit-aiuc1
```

Three evaluators. Three concerns. Each calibrated separately:
- `/code-review` — Code quality (bugs, style, logic, readability)
- `/check-prod-readiness` — Production survival (will this break at 3am under load?)
- `/audit-aiuc1` — Governance compliance (AIUC-1 domains A-F)

This is the Anthropic harness GAN-evaluator pattern (Update 46) applied to the course skill stack — three specialized evaluators instead of one general one. Each has a distinct failure mode it catches. Each can pass while the others fail.

**Lab addition — examine `.claude/skills/check-prod-readiness/SKILL.md`:**

1. Why does it use `context: fork` rather than the default context mode?
2. How does its trigger description avoid false positives compared to a vague trigger like "use for security work"?
3. What makes the structured report format (CRITICAL / HIGH / MEDIUM / LOW / PASSED) more useful than a prose summary?

This is a canonical example of production-grade skill design — its frontmatter, reference file structure, and 6-step audit process reflect the progressive disclosure architecture you learned today. Reference it when designing your own course skills.

---

## PR 6 Callout Additions (lab-s1-unit2.html)

- **Item 15** — Already present: `callout-warn` PoLP warning before Step 4 (tool registration). No duplicate added.
- **Item 24** — Added `callout-key`: /think → /build-spec → build practitioner workflow before Week 6 Deliverables section.
- **Item 26** — Already present: inline `(Theory: ...)` references in step descriptions. No additions needed.
- **Item 27** — Added `callout-key`: Security controls as architectural foundations (Pit of Success) before Step 3 (rate limiting), alongside the existing `callout-warn`.
