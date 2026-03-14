# Week 6: Skill Building + Assessment Crystallization

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
│   ├── trigger_description: when to invoke this skill
│   ├── author, version, tags
│   └── context_budget: max tokens for this skill
├── Skill body (loaded on trigger)
│   ├── Role and context
│   ├── Step-by-step instructions
│   └── Examples
└── References (loaded on demand)
    ├── Edge cases
    ├── Extended examples
    └── External documentation links
```

**Progressive Disclosure:**
Claude Code doesn't load every skill in full at startup. Instead:
1. **Metadata always loaded** — triggers, tags, brief description. Light footprint.
2. **Body loaded on trigger** — when a user action matches the trigger description, the full skill loads.
3. **References loaded on demand** — when the skill explicitly asks for reference material.

This is the Tool Search Tool pattern from Week 3 applied to skills: progressive disclosure prevents context window saturation.

### Context Engineering Limits

**The Frontmatter Budget:** Every skill's YAML metadata occupies context window space. With 50 skills loaded, that's ~2K tokens of frontmatter alone — before any actual work. Design principles:

- Keep frontmatter tight: trigger_description should be 1-2 sentences maximum
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

### AIUC-1: All Six Domains

You've already encountered Domains A, B, D, E in Weeks 2-5. Today, the complete framework:

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

### Build: `/tool-select` and `/audit-aiuc1` Skills

**Step 1: Build `/tool-select` Skill**

This skill encodes the full Assessment Stack and helps select the right tool for any security engineering task.

Create `~/agentforge/skills/tool-select.md`:

```markdown
---
name: tool-select
trigger_description: "Use when the user needs to choose the right tool, model, computation approach, or architecture for a security engineering task. Invoked by: 'help me choose', 'what model should I use', 'what's the right approach', 'assessment stack'"
version: "1.0"
tags: [assessment-stack, model-selection, architecture]
context_budget: 800
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

Create `~/agentforge/skills/audit-aiuc1.md`:

```markdown
---
name: audit-aiuc1
trigger_description: "Use when auditing an AI security tool against the AIUC-1 framework. Invoked by: 'audit this tool', 'check AIUC-1 compliance', 'governance audit', 'aiuc1'"
version: "1.0"
tags: [governance, aiuc1, audit, compliance]
context_budget: 1200
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

Vague: `trigger_description: "Use for security tasks"`
Specific: `trigger_description: "Use when analyzing a specific security incident using the CCT framework — applying evidence-based analysis, perspective gathering, and hypothesis generation"`

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

> **📁 Save to:** `~/agentforge/context/skills/` (skill files), `~/agentforge/deliverables/week06/` (final submission)

---

## AIUC-1 Integration

**All six domains introduced together this week.** Students already know A (Week 5), B (Week 3), D (Week 4), E (Week 2). Domains C and F are new.

The `/audit-aiuc1` skill is both the learning artifact and the practical tool students will use in Week 8 to audit their own Week 3-5 work.

## V&V Lens

**Rugpull Adversarial Assumption:** This week introduces the adversarial perspective on V&V. It's not enough to verify that your skill works correctly — you must verify that it can't be repurposed toward harm by reframing the goal. The rugpull exercise makes this concrete.

Starting from Week 6, every skill you build should include a "how could this be abused?" section in its design documentation.
