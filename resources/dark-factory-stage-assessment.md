# Dark Factory Stage Assessment Field Guide

**Purpose:** Teach security professionals to accurately identify an organization's dark factory maturity stage — before accepting a job, during the interview process, and in the first 30 days on the ground. Organizations almost always self-report 1–2 stages higher than they actually are. Your job is to find the real stage, not the aspirational one.

---

## The Six-Stage Model

```
Stage 1          Stage 2          Stage 3          Stage 4          Stage 5          Stage 6
Ad-Hoc           Siloed           Platform         Governed         Democratized     Dark
Experimentation  Pilots           Foundation       Scale            Creation         Factory
─────────────    ─────────────    ─────────────    ─────────────    ─────────────    ─────────────
Personal API     Team projects    Central          50+ agents       No-code tools    Autonomous
keys in .env     in shared env    LLM gateway      in production    for non-eng      operations
                                  + registry       + CICD gates     + marketplace    + self-healing

Security:        Security:        Security:        Security:        Security:        Security:
Unknown          Unknown          Emerging         Engineered       Embedded         Autonomous
attack surface   ownership        controls         in platform      in creation      remediation

WHERE MOST       ← Most companies are here →      WHERE MOST       Rare in          Near-future
companies        during 2025-2026 transition       security eng     2026
start            period                            work happens
```

Most organizations you'll encounter in 2026 are in Stage 2–3 transition. Stage 1 companies don't yet know they need AI security. Stage 5+ companies are rare — and they represent the most complex security challenges. Your highest-leverage work typically happens at Stage 3–4 companies that have enough infrastructure to implement controls and enough scale for those controls to matter.

---

## Deployment Environments by Stage

Understanding the technical environment tells you what's actually attackable — and what security work is even possible.

### Stage 1 — Ad-Hoc Experimentation

**Infrastructure:** Personal laptops, individual cloud accounts, local Python scripts. No shared infrastructure. AI use is individual, not organizational.

**Typical deployment:**
```
Developer Laptop
├── .env file with ANTHROPIC_API_KEY, OPENAI_API_KEY
├── Python scripts calling LLM APIs directly
├── Jupyter notebooks with embedded API calls
└── Maybe a personal AWS account for occasional hosting
```

**What you can attack:** The developer's credentials (usually hardcoded or in .env). The data they're feeding the LLM (often production data dumped locally for "testing").

**What security work is possible:** Education. Secrets scanning. Basic guidelines. Don't come in proposing agent governance frameworks — there are no agents yet.

---

### Stage 2 — Siloed Pilots

**Infrastructure:** Individual teams running their own AI experiments in isolated cloud environments. No shared platform. Each team manages their own deployment, their own API keys, their own models.

**Typical deployment:**
```
AWS Account (often a team sandbox, not production-governed)
├── EC2 instance or Lambda running LangChain/LlamaIndex app
├── S3 bucket with RAG documents (often publicly accessible by mistake)
├── RDS or DynamoDB for agent state
├── Secrets in AWS SSM or environment variables (inconsistent)
└── No CI/CD — deployed manually or with basic scripts
```

**What you can attack:** Public S3 buckets, overly permissive IAM roles (Stage 2 teams often use AdministratorAccess for speed), hardcoded credentials in GitHub, no input validation on user-facing AI endpoints.

**What security work is possible:** Secrets scanning, IAM least privilege cleanup, basic input validation, S3 access controls. The wins are tactical but they're real. Don't try to build a governance platform — the organization isn't ready.

---

### Stage 3 — Platform Foundation

**Infrastructure:** Centralized LLM gateway (often LiteLLM or similar), shared model routing, emerging agent registry. Teams deploy to a shared platform but it's still somewhat manual.

**Typical deployment:**
```
Central Cloud Environment (AWS / GCP / Azure)
├── LLM Gateway (LiteLLM, AWS Bedrock, Azure OpenAI Service)
│   ├── Authentication (API keys per team, not per agent)
│   ├── Rate limiting
│   └── Basic cost tracking (by team, not by agent)
├── Agent Registry (spreadsheet or internal wiki → moving toward a DB)
├── Shared container environment (ECS or Kubernetes)
│   ├── Multiple agent services deployed as containers
│   └── Shared secrets manager (AWS SSM or Vault — partially adopted)
├── CI/CD pipeline (basic — unit tests + maybe gitleaks)
└── Observability (CloudWatch or Datadog — logs only, no traces)
```

**What you can attack:** The LLM gateway is a high-value target — it proxies all AI traffic. Agent containers often share IAM roles. The registry has known agents but unknown shadow agents. CI/CD has no AI-specific gates.

**What security work looks like:** Build the AI security gates into CI/CD, instrument the gateway for anomaly detection, establish per-agent IAM roles, and start NHI governance. This is where the security work starts to compound — controls at the platform layer apply to all agents.

---

### Stage 4 — Governed Scale

**Infrastructure:** Mature platform with automated security gates, real agent registry (source of truth, not a spreadsheet), per-agent credential scoping, and full observability with distributed tracing.

**Typical deployment:**
```
Production Multi-Environment (dev / staging / prod)
├── LLM Control Plane (LiteLLM or Bedrock)
│   ├── Per-agent API keys with budget caps
│   ├── Model routing with fallback
│   └── Cost attribution per agent per task
├── Agent Platform (ECS/Kubernetes)
│   ├── 50+ containerized agents
│   ├── Per-agent IAM roles (not shared)
│   ├── Agent registry (DB-backed, auto-updated on deploy)
│   └── Allowance profiles enforced in CI/CD
├── Security Gates (in every PR pipeline)
│   ├── Secrets scanning (gitleaks / truffleHog)
│   ├── SAST (Semgrep / Bandit)
│   ├── Dependency vulnerability scan (pip-audit / npm audit)
│   └── Agent capability declaration validation
├── Governance Layer
│   ├── Approval workflows for sensitive actions
│   ├── Human-in-the-loop escalation paths
│   └── Promotion gates (sandbox → dev → preprod → prod)
└── Observability
    ├── OpenTelemetry distributed traces (Grafana Tempo / Datadog / X-Ray)
    ├── Cost dashboard per agent/task/team
    └── Anomaly alerting (cost spikes, error rate changes)
```

**What you can attack:** Cross-agent lateral movement (Agent A compromises Agent B's credentials). Supply chain (malicious packages in the build pipeline). The governance layer itself (the PeaRL Governance Bypass case study). Promotion gate bypasses.

**What security work looks like:** Red teaming multi-agent systems, supply chain hardening, workload identity (SPIFFE/SPIRE), behavioral anomaly detection at runtime. This is where you're building architecturally, not just patching.

---

### Stage 5–6 — Democratized Creation / Autonomous Operations

**Infrastructure:** Enterprise-wide. Non-engineers deploying agents through no-code platforms. Marketplace of reusable agent configurations. At Stage 6: self-healing systems, meta-agents managing other agents, minimal human oversight loops.

**Typical deployment:** Full Secure Dark Factory architecture — LLM control plane, governed agent execution layer, observability with trace root in governance platform, per-agent egress control, workload identity, cost attribution through to finance systems.

**What you can attack:** The no-code platform itself (Stage 5 democratization creates massive untrained-user attack surface). The agent marketplace (one malicious agent template affects all downstream deployments). Meta-agent control channels (compromise the agent managing other agents). Governance layer (every control point is a target).

**What security work looks like:** The full curriculum in this course. This is where AI security becomes a discipline, not a checklist.

---

## Why This Matters

The stage you're walking into determines:
- What security work is actually possible in your first quarter
- What anti-patterns you'll spend your energy fighting
- What your credibility sources are (engineering trust vs. management mandate)
- Whether the biggest risks are technical (hardcoded secrets, no inventory) or architectural (cross-agent lateral movement, marketplace supply chain)
- What skills you need to immediately demonstrate to be effective

A security engineer who walks into a Stage 2 company and tries to run a Stage 4 engagement wastes months proposing controls that have no implementation foundation. A security engineer who walks into a Stage 4 company and starts with a Stage 1 secrets scan looks out of touch. Stage accuracy matters.

---

## Phase 1: Pre-Join Assessment (Public Signals)

You can learn a lot before you ever talk to anyone. Look for these signals.

### Job Posting Language Analysis

The way a company writes an AI security job posting reveals the maturity stage of the team writing it.

| Language Pattern | Stage Signal | Why |
|---|---|---|
| "ChatGPT experience preferred" | Stage 1 | They're still at the API consumption phase |
| "Experience with OpenAI/Anthropic API" | Stage 1–2 | Direct API calls, no abstraction layer mentioned |
| "LangChain / LlamaIndex / CrewAI" | Stage 2–3 | Framework adoption, probably siloed by team |
| "LLM gateway," "model routing," "LiteLLM" | Stage 3 | Building platform infrastructure |
| "Agent registry," "agent lifecycle," "scaffolding" | Stage 3–4 | Platform foundation language |
| "50+ agents in production," "agent marketplace" | Stage 4 | Governed scale vocabulary |
| "No-code AI platform," "citizen developers" | Stage 5 | Democratization underway |
| "Meta-agent," "self-healing," "autonomous operations" | Stage 6 | Rare — mostly aspirational in 2026 |

**Red flag:** Job posting uses Stage 4+ language but reports to a team with no AI platform engineers. The vocabulary is borrowed from a conference talk, not a real deployment.

---

### Company Engineering Blog and Conference Talks

Search `[company name] AI agent site:engineering.company.com` and `[company name] AI agent site:youtube.com` (conference talks).

| What You Find | Stage Signal |
|---|---|
| Blog posts about "experimenting with GPT-4" | Stage 1 |
| Case studies about individual team wins ("Our data team built...") | Stage 2 |
| Architecture posts about internal platforms, gateways, evaluation | Stage 3 |
| Posts about scale, cost optimization, governance automation | Stage 4 |
| Posts about non-engineer adoption, low-code tools | Stage 5 |
| Posts about autonomous systems, meta-agents | Stage 6 |

**The signal gap:** If the last AI blog post is 18 months old, the Stage 1 experiment never progressed.

---

### LinkedIn Employee Profile Scan

Search current employees who work on AI/ML at the company. Look at what they list in their skills and project descriptions.

| Skills/Tools Listed | Stage Signal |
|---|---|
| "Python, OpenAI API, Jupyter" | Stage 1–2 |
| "LangChain, RAG pipelines, vector databases" | Stage 2–3 |
| "LLM gateway, model evaluation, MLOps" | Stage 3 |
| "Agent orchestration, CI/CD for AI, agent governance" | Stage 3–4 |
| "Agent marketplace, multi-agent systems, A2A protocols" | Stage 4–5 |

**Also look at:** How many people have AI-related titles? One "AI Engineer" in a 500-person engineering org = Stage 1–2. A "Platform AI Team" of 8+ = Stage 3+.

---

### GitHub (if repos are public or you can see activity)

| Observation | Stage Signal |
|---|---|
| `.env.example` in repos | Stage 1–2 (secrets management nascent) |
| `requirements.txt` with `openai`, `anthropic` directly | Stage 1–2 |
| Custom gateway or proxy code | Stage 3 |
| Agent manifest YAML files, scaffolding templates | Stage 3–4 |
| CI/CD configs with AI-specific security gates | Stage 4 |

---

## Phase 2: Interview Process Assessment

Once you're in conversations, you can extract stage signals from how people respond to normal questions. You don't need to make it an interrogation — these questions read as genuine curiosity.

### The Six Assessment Questions

Ask these across different interviewers (engineering manager, platform engineer, security engineer if there is one, and ideally a domain team engineer who uses AI tools).

---

**Question 1:** *"Walk me through what happens from when an engineer decides to build a new AI agent to when it's in production."*

| Answer | Stage |
|---|---|
| "They just build it and deploy it" / "There's no formal process yet" | Stage 1 |
| "They submit a request to the AI team and we help them" | Stage 2–3 (central bottleneck anti-pattern may be present) |
| "We have a scaffolding tool they run, it sets up the project structure and connects to our gateway" | Stage 3 |
| "They fork a template from the marketplace, it gets security-scanned in CI automatically, they deploy themselves" | Stage 4 |
| "Non-technical teams use a no-code builder; engineers use the CLI — both produce governed agents automatically" | Stage 5 |

---

**Question 2:** *"If I asked you right now to list every AI agent running in production, how would you do it?"*

| Answer | Stage |
|---|---|
| Long pause, or "I'd have to ask around" | Stage 1 |
| "We have a spreadsheet/wiki page but it's probably not up to date" | Stage 2 |
| "We have an agent registry — let me pull it up" (registry exists but may have gaps) | Stage 3 |
| "The registry is the source of truth — it's automatically updated when agents are deployed" | Stage 4 |
| Immediate, specific answer with numbers ("we have 73 agents in production, 12 in staging") | Stage 4–5 |

---

**Question 3:** *"How does an engineer store API keys and credentials for their AI agents?"*

| Answer | Stage |
|---|---|
| "Environment variables" / "We put them in the deployment config" | Stage 1 |
| "We've told everyone to use AWS Secrets Manager but not everyone does" | Stage 2 (policy exists, enforcement doesn't) |
| "The platform injects secrets at runtime — agents don't have direct credential access" | Stage 3–4 |
| "Vault integration is mandatory — the scaffolding won't generate a project that uses hardcoded credentials" | Stage 4 |

---

**Question 4:** *"If an AI agent made a decision last Tuesday and someone asked you to explain exactly what it did and why, how would you answer that?"*

| Answer | Stage |
|---|---|
| "We'd look at the application logs... if we have them" | Stage 1–2 |
| "We log inputs and outputs, but reasoning is hard to trace" | Stage 2–3 |
| "We have structured logging and distributed tracing — I could reconstruct the trace" | Stage 3–4 |
| "We have full OpenTelemetry instrumentation — I'd pull the span ID and show you every tool call, decision, and output" | Stage 4 |

---

**Question 5:** *"What does your AI cost monitoring look like?"*

| Answer | Stage |
|---|---|
| "We get a monthly bill from Anthropic/OpenAI and it's... a lot" | Stage 1 |
| "Finance tracks it but we can't break it down by team or project" | Stage 2 |
| "We can see cost by team — we're working on per-agent granularity" | Stage 3 |
| "We track cost per agent, per user, per task in real-time with alerting" | Stage 4 |

---

**Question 6:** *"Where does the security team sit in the AI agent development process?"*

| Answer | Stage |
|---|---|
| "We don't have a security team focused on AI" / "SecOps reviews major things post-deployment" | Stage 1–2 |
| "Security gets looped in when we're about to deploy something important" | Stage 2–3 |
| "We have security gates in the CI/CD pipeline" | Stage 3–4 |
| "There's a security engineer embedded on the platform team" | Stage 4 |
| "Security is part of the scaffolding — it ships with every agent by default" | Stage 4–5 |

---

### Reading Hesitation vs. Confidence

The *way* someone answers matters as much as what they say. Stage 4+ teams answer Questions 2–5 quickly and specifically. Stage 1–2 teams pause, qualify ("I think we..."), or redirect ("that's a good question, we've been thinking about that").

An interviewee who immediately says "we have a registry" but can't name how many agents are in it is likely Stage 2 with a Stage 3 aspiration.

---

## Phase 3: First-Week Observation Framework

You're now in the building. Before you make any recommendations, complete this assessment. Don't announce you're doing it — just observe, ask, and document.

### Day 1–3: Foundational Inventory

| Task | What You're Testing | What to Do With Findings |
|---|---|---|
| Ask to see the agent registry | Completeness and currency | Count entries, check last-updated dates, spot-check 3 agents to verify they're still running |
| Check one public or shared repo for secrets | Credential management practice | Run `gitleaks` or `truffleHog` on the most active AI repo |
| Ask "who owns Agent X?" for the 3 most critical agents | Ownership accountability | Can they answer immediately? Is the owner still at the company? |
| Ask to see the deployment process for one agent | Governance automation level | Request to shadow the next deployment |
| Ask where AI costs are tracked | Cost visibility | Request a look at the current AI spend dashboard if one exists |

---

### Day 4–10: Architecture Assessment

| Task | What You're Looking For | Stage Signal |
|---|---|---|
| Review the API gateway or LLM proxy config | Is there one? Is authentication in place? Are all AI calls routed through it? | No gateway = Stage 1–2. Gateway with full routing = Stage 3+ |
| Examine the CI/CD pipeline for an AI project | Are there security checks? What do they test? Can you bypass them? | No checks = Stage 1–2. Manual review gates = Stage 2–3. Automated security gates = Stage 4 |
| Review how secrets are injected at runtime | Hardcoded? Environment variables? Vault? | Hardcoded = Stage 1. Env vars = Stage 2. Vault injection = Stage 3+ |
| Ask for the OWASP or security checklist agents are validated against | Does one exist? Is it automated? | No checklist = Stage 1–2. Checklist exists but manual = Stage 3. Automated = Stage 4 |
| Find the oldest agent still running in production | Agents accumulate — the oldest reveals the earliest standards | Check if it has an owner, updated docs, and still-rotated credentials |

---

### Day 11–30: Calibration Assessment

By this point you should have enough evidence to score the organization. Use the First-30-Day Scoring Rubric below to confirm or revise your initial assessment.

Also in this period:
- Look for the **say/reality gap** — areas where stated policy and actual practice diverge
- Identify the **champion and the skeptic** — who wants to move forward on security, and who thinks current state is fine
- Find the **weakest agent** — the one most likely to be exploited first (oldest, least maintained, most privileged)

---

## Stage Scoring Rubric

Score the organization on each dimension. The mode (most frequent score) is the likely stage.

| Dimension | 1 (Stage 1–2) | 2 (Stage 3) | 3 (Stage 4+) |
|---|---|---|---|
| **Agent Inventory** | No registry or spreadsheet you had to create yourself | Registry exists but manually maintained, some gaps | Registry is system-of-record, auto-updated on deployment |
| **Secrets Management** | Hardcoded or env vars in repos | Policy exists (use Vault/SM) but not uniformly enforced | Platform injects secrets at runtime; hardcoding is technically prevented |
| **Deployment Process** | Push to prod manually, no gates | Request process with some review | Self-service with automated security gates in CI/CD |
| **Observability** | Application logs only (or nothing) | Structured logging, partial tracing | OpenTelemetry distributed traces, cost attribution, anomaly alerting |
| **Cost Visibility** | One combined bill, no breakdown | Team-level visibility | Per-agent, per-task, real-time with alerts |
| **Security Team Involvement** | Not involved or post-deployment review | Consulted on major deployments | Embedded in platform; gates enforced automatically |
| **Agent Lifecycle** | No versioning, no decommission path | Manual versioning, ad-hoc deprecation | Versioned, rollback capability, decommission workflow exists |
| **Governance Automation** | None | Manual checklists / approval committee | Automated checks in CI/CD, human review only for Tier 3+ |

**Scoring key:** Mostly 1s = Stage 1–2. Mix of 1s and 2s = Stage 2–3 transition. Mostly 2s = Stage 3. Mix of 2s and 3s = Stage 3–4 transition. Mostly 3s = Stage 4+.

---

## The Say/Reality Gap: Common Deceptions

Organizations don't lie about their stage — they genuinely believe they're further along than they are. These are the most common mismatches.

### "We have a governance process" (claim: Stage 3–4, reality: Stage 2)

**What they mean:** A governance committee reviews AI proposals before work begins.

**What that actually is:** Governance Theater. The Dark Factory Roadmap's most-cited anti-pattern. A committee that reviews proposals at the start of a project and never sees the actual implementation provides almost no security value.

**How to test it:** Ask to see the last three agents that went through the process and what was changed as a result of the review. If the answer is "nothing was changed" or "I don't know," the governance is decorative.

---

### "We have an agent registry" (claim: Stage 3, reality: Stage 2)

**What they mean:** There is a spreadsheet or wiki page someone created.

**What that actually is:** Shadow Agent Sprawl with a document that gives false confidence. A manually maintained registry is always out of date.

**How to test it:** Pick three agents from the registry and verify they're all still running. Pick three recently deployed agents and verify they're all in the registry. The delta reveals the true coverage.

---

### "Security is built into our pipeline" (claim: Stage 4, reality: Stage 3)

**What they mean:** There is a security step in the CI/CD pipeline.

**What that actually is:** Often a single `gitleaks` run that checks for hardcoded secrets. That's one control, not a security pipeline.

**How to test it:** Ask what the security gate checks for. A Stage 4 pipeline checks: hardcoded secrets, SAST, agent capability declarations against policy, data classification compliance, and dependency vulnerability scanning. A single tool = Stage 3 with Stage 4 vocabulary.

---

### "Agents use least privilege" (claim: Stage 3–4, reality: Stage 2)

**What they mean:** They know the phrase "least privilege" and generally agree with it.

**What that actually is:** Still one shared service account for most agents, with a general understanding that this is a problem they'll fix later.

**How to test it:** Ask for the IAM role or service account attached to three different agents. If they all point to the same principal, least privilege is a goal, not a reality.

---

### "We have cost monitoring" (claim: Stage 3, reality: Stage 1–2)

**What they mean:** They can see the monthly bill from their LLM provider.

**What that actually is:** No per-agent attribution. This means cost anomalies that indicate compromise (a runaway agent, token stuffing, exfiltration via model output) are invisible until the bill arrives.

**How to test it:** Ask: "If one agent's cost suddenly tripled last Tuesday, would you know by Wednesday?" If the answer requires manual log analysis, cost attribution is not real.

---

## Assessment Report Template

After completing Phase 3, produce a one-page assessment you can share with your manager or team. Keep it factual and non-judgmental.

```
DARK FACTORY MATURITY ASSESSMENT
Organization: [Name]
Assessment Period: [Date range]
Assessor: [Your name]
Confidence: [High / Medium / Low]

ASSESSED STAGE: [1 / 2 / 3 / 4 / 5 / 6]
CLAIMED STAGE: [What the organization believes/states]
SAY/REALITY GAP: [None / Minor / Significant]

SCORING SUMMARY:
- Agent Inventory: [1 / 2 / 3]
- Secrets Management: [1 / 2 / 3]
- Deployment Process: [1 / 2 / 3]
- Observability: [1 / 2 / 3]
- Cost Visibility: [1 / 2 / 3]
- Security Involvement: [1 / 2 / 3]
- Agent Lifecycle: [1 / 2 / 3]
- Governance Automation: [1 / 2 / 3]

ACTIVE ANTI-PATTERNS OBSERVED:
- [List from: NPE Graveyard / Shadow Agent Sprawl / Central Bottleneck /
  Governance Theater / Credential Minefield / Evaluation Blindness /
  Vendor Lock-in Trap / Compliance Afterthought / Cost Blindspot]

HIGHEST PRIORITY SECURITY GAPS:
1. [Most critical gap — what's most likely to result in an incident]
2. [Second priority]
3. [Third priority]

SECURITY WORK POSSIBLE IN FIRST 90 DAYS (given assessed stage):
[Describe what's achievable given current foundations]

BLOCKERS TO STAGE ADVANCEMENT:
[What organizational or technical changes are required before security can
advance to next-stage controls]
```

---

## Anti-Pattern Quick Reference

Use this during assessment to recognize the nine documented failure modes.

| Anti-Pattern | Key Indicator | Security Impact |
|---|---|---|
| **NPE Graveyard** | 20+ AI experiments, fewer than 3 in production | POC-quality security on production-classified data |
| **Shadow Agent Sprawl** | Can't list all active agents; unknown API spend | Unknown attack surface, unmonitored data access |
| **Central Bottleneck** | "Submit a ticket to the AI team" | Shadow AI to avoid queue, bypasses all security review |
| **Governance Theater** | Approval committee, nothing ever rejected | False confidence; real risks pass undetected |
| **Credential Minefield** | API keys in source code, shared service accounts | One credential compromise = entire agent fleet compromised |
| **Evaluation Blindness** | No accuracy or safety metrics on deployed agents | Failures found by users and attackers, not operators |
| **Vendor Lock-in Trap** | Every agent hardcoded to one model, no abstraction | Vendor outage = total agent downtime; can't swap on compromise |
| **Compliance Afterthought** | Agents deployed before regulatory review | Agents pulled post-deployment, legal exposure, audit findings |
| **Cost Blindspot** | No per-agent cost attribution | Exfiltration, token stuffing, runaway agents invisible until billing |

---

## Architecture Reference Diagram

The Secure Dark Factory architecture diagram shows every layer of a Stage 4–6 deployment — from the ideation pipeline through production execution, governance, security scanning, identity, and observability. Use it as a reference map when assessing an organization: work left-to-right across the layers and ask which ones exist, which are missing, and which are partially implemented.

**File:** `resources/diagrams/dark-factory-architecture.drawio`
**How to open:** https://app.diagrams.net → File → Open From → This Device, or the draw.io VS Code extension

When you're in a new environment and trying to establish what stage it's at, open the diagram and walk through each layer systematically:

| Diagram Layer | Present? | Absent? | Interpretation |
|---|---|---|---|
| Pipeline band (①–⑧) | ✓ | | Deployment process exists |
| LiteLLM control plane | ✓ | | Centralized model routing → Stage 3+ |
| PeaRL governance | ✓ | | Governed deployment → Stage 3–4 |
| MASS 2.0 security layer | ✓ | | Automated security gates → Stage 4 |
| SPIFFE/SPIRE identity | ✓ | | Workload identity → Stage 4+ |
| Grafana Tempo observability | ✓ | | Distributed tracing → Stage 3–4 |
| Network egress control | ✓ | | Per-agent containment → Stage 4 |

Anything below Stage 3 won't have most of this. Your job as an AI security engineer is to know which layers to build first given where the organization actually is.

---

## Using This Guide in the Course

This guide is referenced throughout the course:

- **Week 1** — Introduction to the maturity model; first exposure to assessment questions
- **Week 4** — Anti-pattern reconnaissance; learning to spot Stage 1–2 patterns in code and process
- **Week 9** — Six Pillars audit connects to Phase 3 observation framework
- **Week 13** — Stage-based attack surface analysis (attacker adapts to target's maturity stage)
- **Week 14–15** — Security Maturity Assessment Deliverable uses the Assessment Report Template
- **Week 16** — Capstone portfolio option: full assessment of a real or fictional AI platform

---

*Source: Dark Factory Roadmap — `resources/dark-factory-roadmap.html` (distributed by course instructor)*
*Last updated: 2026-03-15*
