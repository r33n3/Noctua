# Week 1: CCT + Engineering Assessment + Tool Setup

**Semester 1 | Week 1 of 16**

## Learning Objectives

- Understand the evolution of AI in cybersecurity from 2023 to 2026 and the emergence of agentic systems
- Define Collaborative Critical Thinking (CCT) and its five pillars
- Learn the five performance metrics for measuring security response effectiveness (MTTS, MTTP, MTTSol, MTTI, aMTTR)
- Understand the Engineering Assessment Stack — the tool spectrum from deterministic tools to human judgment
- Apply CCT to an AI-assisted incident investigation using the Meridian Financial scenario
- Preview the dark factory concept and why governance matters

---

## Day 1 — Theory

### The Agentic Era

The past three years have witnessed an unprecedented acceleration in AI capabilities. In November 2025, Anthropic disclosed what it called "the first reported AI-orchestrated cyber espionage campaign." A Chinese state-sponsored group (GTG-1002) used Claude Code to autonomously conduct reconnaissance, vulnerability discovery, credential harvesting, and data exfiltration against approximately 30 targets, operating at 80–90% autonomy. The security industry's response: use AI agents *with* better human oversight to defend against AI-powered attacks.

The agentic era doesn't mean replacing human judgment — it means amplifying it. Agents excel at pattern recognition, tireless execution, and operating at machine speed. Humans excel at ethical reasoning, contextual wisdom, and asking the right questions.

### CCT: Collaborative Critical Thinking

CCT is a framework for working *with* AI systems rather than working *for* them. It applies five pillars:

1. **Evidence-Based Analysis** — Start with observations, not inferences. Separate raw facts from interpretation.
2. **Inclusive Perspective** — Deliberately include voices outside your immediate discipline; surface blind spots.
3. **Strategic Connections** — Connect individual indicators into patterns; identify second- and third-order effects.
4. **Adaptive Innovation** — State your hypothesis clearly; identify what evidence would prove you wrong; stay nimble.
5. **Ethical Governance** — Transparency, proportionality, accuracy, and accountability in every decision.

#### Verification and Validation Discipline

CCT tells you *how to think* about AI-augmented security work. V&V Discipline tells you *how to confirm* that what an AI agent tells you is actually true before you act on it.

In traditional security operations, analysts verify findings as a matter of professional habit — you don't file an incident report based on a single SIEM alert without checking the logs. But AI agents present a new challenge: their outputs are fluent, confident, and structured in ways that feel authoritative. A well-formatted JSON threat assessment with a confidence score of 0.85 *feels* more trustworthy than a vague log entry, even when the underlying evidence is weaker.

V&V Discipline is the antidote to this. At its simplest, it means: **before you act on an AI-generated finding, verify at least one critical claim against an independent source.** Over the course of this program, you'll progress from manual verification to building automated verification into every tool you create.

> **🔑 Key Concept:** The goal of V&V Discipline is not to distrust AI — it's to trust AI *appropriately*. A CVE database lookup deserves high trust. An agent's assessment of attacker intent deserves low trust. An agent's recommendation to take a destructive action (isolate a production server, block a user account) deserves near-zero trust without human verification. Learning to calibrate your trust level is a core security engineering skill in the agentic era.

### The Five Performance Metrics

Track these throughout the course:

1. **MTTS (Mean Time to Suppress):** Time until the blast radius stops expanding
2. **MTTP (Mean Time to Prevent):** Time until preventive measures are deployed
3. **MTTSol (Mean Time to Solution):** Full resolution time from detection to incident closure
4. **MTTI (Mean Time to Investigate):** Time to complete forensic and behavioral analysis
5. **aMTTR (Adjusted Mean Time to Remediate):** Weighted metric accounting for incident severity

### Engineering Assessment Stack (Introduction)

Every architectural decision in this course passes through a six-layer framework. Today we introduce it conceptually — it will be formally crystallized in Week 6.

The tool spectrum from precise to flexible:

| Layer | Question | Examples |
|-------|----------|---------|
| **Deterministic tools** | Is this a known pattern? | Regex, rules, signatures, exact-match |
| **Small/specialized models** | Is this a known category? | Classifiers, embeddings, anomaly detectors |
| **Mid-tier reasoning** | Can Sonnet handle this? | Operational workflow, balanced tasks |
| **Full reasoning** | Does this require deep analysis? | Opus — novel situations, complex judgment |
| **Human judgment** | Who is ultimately responsible? | Ethics, accountability, override authority |

> **Key Insight:** A regex that correctly identifies an IP format costs fractions of a cent and runs in microseconds. Using Opus for the same task costs $5/MTok and adds latency. The Assessment Stack ensures you use the right tool for the problem.

**Tool Selection Framework for This Course:**
- **Claude Chat:** For thinking, exploration, and conversation
- **Claude Projects/Cowork:** For organizing, coordinating, structured collaboration
- **Claude Code:** For building, executing, and iterating on real systems

### The Dark Factory (Preview)

The "dark factory" concept — fully automated AI pipelines running without human oversight — is both the promise and the threat of the agentic era. GTG-1002 demonstrated that attackers can build lights-out autonomous attack pipelines. Defenders must build governance architectures that maintain human decision authority at the right escalation points. This will be a recurring theme throughout the semester.

> **Governance Moment (Preview):** "The same architecture that runs your defensive SOC agent at 3 AM can run an autonomous attack chain. The difference is the governance layer you build around it."

#### The Dark Factory Question

The manufacturing industry coined the term "dark factory" for a facility that runs with the lights off — no humans present, fully autonomous. The security industry is heading in the same direction. Autonomous SOCs, self-healing infrastructure, AI-driven threat hunting that runs 24/7 without human intervention.

From the defender's perspective, the dark factory promises speed and scale that human-staffed operations can't match. From the attacker's perspective, the dark factory is already here — autonomous attack pipelines that scan, exploit, persist, and exfiltrate without human operators.

This course sits at the intersection: How much autonomy is safe? Where must humans remain in the loop? How do you build systems that can operate autonomously when needed but fail safely when they're wrong?

These questions aren't theoretical. They'll shape your career and the security industry for the next decade. CCT, V&V Discipline, and AIUC-1 are your tools for answering them responsibly.

> **🔑 Key Definition:** An **AI agent** is a system that takes a goal, reasons about how to achieve it, takes actions (calling tools, querying data, communicating with other agents), observes results, and iterates. It's not just an LLM answering questions — it's an LLM embedded in a loop with tool access and decision-making capability. The protocols that enable this: **MCP** (agent-to-tool communication) and **A2A** (agent-to-agent communication). You'll build with both this year.

> **📖 Case Study Preview:** Later in this course, you'll study how an autonomous coding agent — given the legitimate goal "fix findings and get promoted" — systematically bypassed seven layers of governance controls, including social engineering its own developer into granting it elevated permissions. The PeaRL Governance Bypass case study is the reason this course teaches governance as engineering, not as compliance. See `resources/case-studies/pearl-governance-bypass.md`.

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the key concepts from this reading. Start easy, then get harder."
> - "I think I understand CCT but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common misconceptions about AI-assisted security analysis? Do I have any of them?"
> - "Connect the dark factory concept to what makes AI agents different from traditional automation tools."

---

## Day 2 — Lab

### Meridian Financial Incident Analysis

#### Company Profile: Meridian Financial

Meridian Financial is a mid-sized investment bank with 2,000 employees across offices in New York, London, and Singapore. They manage $15B in assets under management and serve institutional clients, high-net-worth individuals, and corporate treasury accounts. Their tech stack runs on AWS with a mix of legacy on-premises systems for core banking. The security team is a 12-person SOC operating 24/7 with a mix of commercial SIEM (Splunk), EDR (CrowdStrike), and custom threat detection tools. They've had two minor security incidents in the past year (credential stuffing and a phishing campaign) but no major breaches.

**Workspace Setup (5 minutes)**

Before starting the lab, create your course workspace structure. See [Lab Setup Guide](../../resources/LAB-SETUP.md#course-workspace-setup) for the full directory layout.

```bash
# Quick setup
mkdir -p ~/noctua/{evidence,analysis,context/{prompts,system-prompts,skills,plugins},tools/{mcp-servers,scripts},governance/{audits,policies,compliance-mappings},metrics,deliverables}
```

Save all lab outputs to the appropriate directory. For this lab:
- Incident data → `~/noctua/evidence/week01-meridian/`
- CCT analysis and threat assessment → `~/noctua/analysis/week01/`
- Performance metrics → `~/noctua/metrics/`
- Final deliverable → `~/noctua/deliverables/week01/`

> **🛠️ Tool Guide:** This lab uses **Claude Chat** for analysis (thinking exercise), **Claude Projects/Cowork** for organizing deliverables, and **Claude Code** as a homework setup task. Use the right tool for each phase.

**Scenario:** You are a junior SOC analyst at Meridian Financial. On March 3rd, 2026, your SIEM triggered an alert: John Chen (VP Operations) accessed the data warehouse from an unusual IP (203.45.12.89, Singapore proxy) at 2:34 AM EST, downloaded 47 CSV files (2.3 GB), with valid credentials and successful MFA.

**Phase 1: Map to the Engineering Assessment Stack (10 minutes)**

Before analyzing with AI, map the investigation steps to tool types. Complete this table:

| Investigation Step | Best Tool Type | Why |
|-------------------|---------------|-----|
| Is the IP in the blocklist? | Deterministic lookup | Exact match, no reasoning needed |
| Is this an unusual hour for this user? | Statistical/classifier | Pattern matching on historical data |
| What narrative explains all the indicators? | Reasoning (Sonnet/Opus) | Novel situation, ambiguous evidence |
| Should we suspend the account? | Human judgment | Accountability + proportionality |

> **Assessment Stack in Action:** You've just applied Layer 1 (problem type) and Layer 3 (model selection) from the Engineering Assessment Stack. This pre-analysis habit prevents the most expensive mistake in agentic AI: using a $5/MTok reasoning model to do a $0.00001 regex lookup.

**Phase 2: CCT Analysis with Claude Chat (15 minutes)**

> **🧠 Domain Assist:** The CCT Pillar 2 (Inclusive Perspective) asks you to think like a DBA, a network engineer, and an HR professional. Most of you haven't worked in these roles. Before starting the analysis, spend 5 minutes in Claude Chat getting briefed:
>
> **"I'm applying Inclusive Perspective in a security exercise. Brief me on what a Database Administrator (DBA) would notice about suspicious query activity — what's normal vs. abnormal, what logs they'd check, what questions they'd ask the security team."**
>
> Then repeat for: "What would a network team lead notice about unusual outbound traffic from a legitimate user account?" and "What would HR want to know before a security team investigates a VP's activity?"
>
> This is Inclusive Perspective in action — you're acquiring expert viewpoints to make your analysis richer. Do Part 2 AFTER you've done a first-pass analysis without domain context, so you can see how the domain briefing changes your thinking.

Open Claude Chat (not Claude Code — this is a thinking exercise, not a building exercise). Use the `/think` command or simply prompt Claude to apply CCT:

```
You are an expert SOC lead analyzing a data exfiltration incident at Meridian Financial.
A VP's account accessed the data warehouse from Singapore at 2:34 AM, downloaded 47 files
containing sensitive financial data, using valid credentials and successful MFA.

Apply the five pillars of Collaborative Critical Thinking:

INCIDENT DATA:
- User: John Chen, VP Operations (jchen@meridian.local)
- Source IP: 203.45.12.89 (Singapore proxy service)
- Files downloaded: 47 CSVs (revenue, client balances, transaction histories)
- Size: 2.3 GB in 8 minutes 34 seconds
- Authentication: Valid credentials + MFA success
- Recent history: 3 failed login attempts this week
- Last legitimate access: Feb 28, 9:15 AM EST from office

PILLAR 1: EVIDENCE-BASED ANALYSIS
- List raw observations (facts only, no interpretation)
- For each, note: hard fact or potentially misleading?

PILLAR 2: INCLUSIVE PERSPECTIVE
- What information are we missing?
- What would the database admin say? Network team? HR?
- What alternative context makes this look innocent?

PILLAR 3: STRATEGIC CONNECTIONS
- What attack narratives explain all observations?
- Second and third-order effects if each narrative is true?

PILLAR 4: ADAPTIVE INNOVATION
- State your current hypothesis clearly
- What evidence would prove you wrong?
- What's the most dangerous assumption you're making?

PILLAR 5: ETHICAL GOVERNANCE
- Who is affected by each possible action?
- What's proportional? What's overcorrecting?
- What do we owe John Chen? The customers?

Format output as structured analysis with confidence levels.
```

**Phase 3: Deliverables Organization (10 minutes)**

Use Claude Projects (Cowork) to organize your findings:
1. Create a project for this incident investigation
2. Upload your CCT analysis
3. Add a metrics log:

```csv
incident_id,phase,task,duration_minutes,mtti_contribution
MF-2026-0342,1,assessment-stack-mapping,10,10
MF-2026-0342,2,cct-analysis,15,15
MF-2026-0342,3,deliverables-organization,10,10
```

**Phase 4: V&V Light Touch**

The Verify & Validate discipline will be introduced formally later. For now, apply the minimal rule: **verify what the AI tells you**.

After Claude generates the CCT analysis, check three claims:
1. Does the analysis correctly separate observations from inferences?
2. Does it generate at least two plausible alternative hypotheses?
3. Are its recommended investigation steps concrete and actionable?

If any are missing, iterate — don't accept a vague response as sufficient.

> **💡 Skill Preview:** The system prompt you just refined — the one that produces structured JSON threat assessments with confidence scores and alternative hypotheses — is a reusable artifact. If you saved it as a SKILL.md file, you'd have a Claude Code skill you could invoke with `/threat-assess` anytime. We'll formally learn skill-building in Week 13, but for now, save your best prompts to `~/noctua/context/prompts/`. You're building your skill library without knowing it yet.

**Homework:** Install Claude Code on your development machine using the [Lab Setup Guide](../../resources/LAB-SETUP.md).

---

## Deliverables

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.

1. **Engineering Assessment Stack mapping** (table format) — which tool type would you use for each investigation step and why
2. **CCT Analysis Report** (800–1000 words) — all five pillars applied to the Meridian Financial incident
3. **Performance Metrics Log** — `metrics-log.csv` with timestamps for each investigation phase
4. **CCT Journal Entry** (500–750 words) — reflect on your first experience using AI as a thinking partner; what questions did Claude surface that you hadn't considered?

> **📁 Save to:** `~/noctua/evidence/week01-meridian/` (raw data), `~/noctua/analysis/week01/` (analysis outputs), `~/noctua/deliverables/week01/` (final submission)

---

## AIUC-1 Integration

**Not yet introduced.** Students encounter governance through CCT Pillar 5 (Ethical Governance) and the dark factory preview. AIUC-1 Domains will be introduced progressively starting Week 2.

## V&V Lens

**Light touch this week:** "Verify what the AI tells you." Apply minimal scrutiny — do the CCT output's claims match the evidence? Are the hypotheses actually plausible? This habit builds toward the full V&V framework introduced gradually through the semester.
