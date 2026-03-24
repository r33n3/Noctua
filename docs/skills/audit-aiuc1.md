# /audit-aiuc1 — AIUC-1 Compliance Audit

Run a structured compliance audit against all applicable AIUC-1 domains for the
current working tool or agent system. Surfaces gaps, scores findings by severity,
and produces a machine-readable report that PeaRL's Cedar elevation policies
can parse directly.

This skill serves two purposes: (1) learning — a structured walk through all six
AIUC-1 domains so you understand what compliance actually requires for your system
type; (2) governance — the output report is the AIUC-1 baseline evidence that
PeaRL/Cedar checks before allowing elevation from ASSISTIVE to
SUPERVISED_AUTONOMOUS mode, and from SUPERVISED_AUTONOMOUS to
DELEGATED_AUTONOMOUS.

Without this step, autonomy elevation is blocked. With it, you have a dated,
domain-scoped, reviewer-attested baseline that satisfies the Cedar policy gate.

---

## What to Do

If the system being audited is not clear from context, ask:
1. What system or tool is being audited? (name, brief description, repo or file path)
2. What is its deployment tier? (see Tier Classification below — ask if not provided)

**Run System Characterization before Tier Classification.** The characterization
profile determines which controls within each domain are HIGH PRIORITY for this
specific system. Tier sets which domains to audit; characterization sets how hard
to look within each domain.

Then proceed through the applicable domains, apply profile-adjusted priority,
assess gaps, and produce the scored report.

**Do not skip the Elevation Gate Status footer.** It is machine-readable and
required for Cedar policy evaluation. Every field must be present.

---

## System Characterization

Before tier classification, characterize the system being audited. This profile
determines within-domain control weighting — which controls are HIGH PRIORITY vs
informational for this specific system. Two Tier 2 agents can have completely
different risk surfaces depending on what they do.

Ask these questions (or infer from context if the system is well-described):

**1. System type** — select all that apply:
- `app` — AI application (user-facing with embedded AI: chatbot, classifier, content generator, recommendation engine)
- `agent` — Agentic tool (takes autonomous actions: file writes, API calls, code execution, workflow automation)
- `pipeline` — Multi-agent pipeline (orchestrates or is orchestrated by other agents)
- `security` — Security tooling (scanner, analyzer, vulnerability detection, threat intelligence)
- `dev` — Developer tooling (assists developers, processes code or configuration)

**2. Data sensitivity** — does the system ingest, process, or store any of the following?
- `pii` — PII (names, emails, addresses, national IDs, biometrics)
- `credentials` — Credentials, API keys, secrets, tokens
- `regulated` — Health (HIPAA), financial (PCI/SOX), legal, or GDPR-scoped data
- `proprietary` — Internal code, documents, or IP that must not be exposed

**3. Decision influence** — does the system's output influence or make consequential decisions?
- Examples: access control, hiring decisions, triage, content moderation, security findings, loan approval
- Note: "surfacing information that a human acts on" counts as consequential — the bar is influence, not automation

**4. Exposure** — who can interact with the system?
- `internal` — Developers or a specific named team only
- `authenticated` — Employees or customers with verified accounts
- `public` — Unauthenticated users or broadly accessible (internet-facing)

**5. Content generation** — does the system generate content users will directly act on?
- Examples: code that will be executed, reports that drive decisions, legal drafts, medical summaries, security advisories

**6. State persistence** — does the system maintain state across sessions?
- Examples: stored conversation history, accumulated user profiles, learned preferences, persistent context

**7. External calls** — does the system call external tools, agents, or services?
- Examples: external APIs, MCP servers, other agents, databases, file systems, cloud services

**After answering, write the system profile in 2–3 sentences:**

> "This is a [type] system. It [handles/does not handle] PII and [is/is not] regulated.
> It [is/is not] public-facing and [does/does not] influence consequential decisions.
> It [does/does not] call external services and [does/does not] persist state."

Record the profile in the report header. Use it to apply the profile-adjusted
priority guidance in each domain section below.

---

## Tier Classification

Classify the system after characterization. Tier sets the domain scope; profile
adjusts depth within each domain.

| Tier | System Type | Required Domains |
|------|-------------|-----------------|
| **Tier 1** | Embedded AI feature (Copilot-style, no autonomous actions) | A, F |
| **Tier 2** | Supervised autonomous agent (human checkpoints, AutonomyMode set) | A, B, C, E |
| **Tier 3** | Delegated autonomous agent (SPIFFE identity, Cedar elevation gates) | A, B, C, D, E, F |
| **Tier 4** | Multi-agent pipeline (orchestrator governance, inter-agent trust) | All 6 domains + extended B controls |

If the tier is ambiguous, ask clarifying questions: Does the system take autonomous
actions without human approval for each action? Does it use a persistent identity?
Does it orchestrate other agents? Use the answers to classify.

---

## The Six AIUC-1 Domains

### Domain A — Data & Privacy
Audit questions:
- What data does the system ingest, store, or transmit? Is PII present?
- Is there a documented data governance policy covering retention and deletion?
- Is user consent captured for data collection and model use?
- Is data minimization enforced — does the system request only what it needs?
- Are differential privacy or anonymization techniques applied where appropriate?
- Is model inversion or membership inference a realistic attack surface? If so, what prevents it?

**Profile-adjusted priority:**
- `pii` or `regulated` → Consent, data minimization, and retention policy are **HIGH PRIORITY**; model inversion risk moves from informational to active concern.
- `credentials` → Data governance must explicitly cover secret storage; verify no secrets appear in logs or model inputs.
- `app` + `public` → Consent capture is **HIGH PRIORITY**; assume broad user base with varying data expectations.
- `agent` + `external calls` → Audit what data is transmitted to each external service, not just what the system stores.

### Domain B — Security (Controls B001–B009)
Audit each control that applies to the system's tier:
- **B001** Adversarial testing: Has third-party adversarial testing been conducted or scheduled?
- **B002** Detect adversarial input: Does the system detect prompt injection, jailbreaks, or malformed inputs at runtime?
- **B003** Manage technical detail release: Does output include sensitive model details, system prompts, or internal architecture?
- **B004** Prevent endpoint scraping: Are API endpoints protected against automated enumeration and bulk extraction?
- **B005** Real-time input filtering: Is user input filtered before reaching the model?
- **B006** Limit agent system access: Does the agent operate with least-privilege? Is file, network, and tool access scoped?
- **B007** Enforce user access privileges: Does the system respect caller identity and authorization for every action?
- **B008** Protect model deployment environment: Is the model hosting environment isolated, patched, and access-controlled?
- **B009** Limit output over-exposure: Does output include only what the user is authorized to see?

**Profile-adjusted priority:**
- `public` → B001, B002, B004, B005 are **HIGH PRIORITY**; attack surface is broad and adversarial testing must be intentional.
- `agent` + `external calls` → B006 is **HIGH PRIORITY**; audit each external call's permission scope individually.
- `security` or `dev` → B003 is **HIGH PRIORITY**; security/dev tools often expose sensitive internal details in output (stack traces, configs, key material).
- `credentials` → B006, B007, B009 are **HIGH PRIORITY**; credential exposure is a direct path to Critical findings.
- `pipeline` → Also audit inter-agent trust: how does each agent verify the identity and authorization of messages from other agents in the pipeline?

For Tier 4 systems, also audit inter-agent trust: how does each agent verify the
identity and authorization of messages from other agents in the pipeline?

### Domain C — Safety
Audit questions:
- What harmful outputs could this system produce? Is there a documented risk taxonomy?
- What pre-deployment safety testing was conducted? What test cases were used?
- Is real-time output monitoring in place? What happens when a harmful output is detected?
- Is there a circuit breaker or rate limiter that stops the system if anomalies are detected?
- For autonomous agents: what is the blast radius of a worst-case failure? Is it bounded?

**Profile-adjusted priority:**
- `consequential decisions` → Risk taxonomy is **HIGH PRIORITY**; document every decision the system influences and the harm model for each.
- `content generation` → Real-time output monitoring is **HIGH PRIORITY**; generated content reaching users without review multiplies blast radius.
- `agent` → Blast radius question is mandatory; an agent with file/network/API access can cause irreversible harm. Bound it explicitly.
- `public` + `app` → Pre-deployment safety testing must include adversarial and edge-case user inputs; lab testing on benign inputs is insufficient.
- `security` → Audit whether the tool could be used to generate attack content or facilitate harm — security tools are dual-use by design.

### Domain D — Reliability
Audit questions:
- What is the documented uptime target? Is it measured?
- How does the system handle model unavailability or degraded performance?
- Is model drift monitored? How is drift detected and acted on?
- Is there continuous validation — scheduled tests that confirm expected behavior over time?
- Is there a documented incident response plan for system failure?

**Profile-adjusted priority:**
- `public` or `consequential decisions` → Uptime target and failure handling are **HIGH PRIORITY**; unavailability or degraded output causes downstream harm.
- `pipeline` → Model drift is **HIGH PRIORITY**; behavioral drift in one agent propagates through the pipeline.
- `agent` + `state persistence` → Continuous validation must cover stateful scenarios, not just stateless test inputs.
- `app` + `authenticated` → Incident response plan must include user-facing communication path (not just internal ops).

### Domain E — Accountability
Audit questions:
- Are all agent decisions and actions logged with sufficient detail to reconstruct what happened?
- Are logs tamper-evident and retained for the required period?
- Can the system explain a given output to a human reviewer in plain language?
- Is there an appeal or override mechanism for affected users?
- Is ownership clearly documented — who is accountable for this system's behavior?

**Profile-adjusted priority:**
- `consequential decisions` → Appeal mechanism is **HIGH PRIORITY**; if the system influences a decision affecting a person, that person must have recourse.
- `agent` + `external calls` → Decision logging must capture each external call (what was sent, what was returned) — not just the final output.
- `regulated` → Log retention period must match the applicable regulatory requirement (HIPAA, GDPR, PCI) — "reasonable period" is not sufficient.
- `pipeline` → Ownership documentation must map each agent in the pipeline to a named accountable party; distributed accountability is no accountability.
- `public` → Explainability requirement is elevated; users cannot be expected to accept opaque decisions affecting them.

### Domain F — Society
Audit questions:
- Has the system been tested for bias across demographic subgroups relevant to its use case?
- Is there a documented fairness metric and a threshold for acceptable bias?
- Are training and evaluation datasets stratified to ensure coverage parity?
- Does the system include non-discrimination safeguards for protected characteristics?
- If the system affects decisions (hiring, access, triage), is there a disparate impact assessment?

**Profile-adjusted priority:**
- `public` + `app` → Bias testing is **HIGH PRIORITY**; broad user base means demographic impact is broad.
- `consequential decisions` → Disparate impact assessment is **HIGH PRIORITY** and should be conducted before deployment, not after complaints.
- `content generation` + `public` → Non-discrimination safeguards must cover generated content; AI-generated content at scale can amplify or normalize bias.
- `internal` + `dev` → Domain F scope is reduced but not eliminated; developer tools that surface code suggestions can embed bias in what patterns they promote.
- `security` → Audit whether threat detection or triage logic has disparate sensitivity across user demographics (e.g., false positive rate by geography).

---

## Scoring

Use OWASP AIVSS severity levels for each finding:

| Severity | Definition |
|----------|-----------|
| **Critical** | Exploitable now, direct harm possible, no mitigating control present |
| **High** | Significant risk, partial mitigating controls, likely to be exploited |
| **Medium** | Moderate risk, mitigating controls exist but incomplete |
| **Low** | Minor risk, controls mostly in place, informational |

**Elevation blocking rules:**
- Critical or High findings in Domain B (Security) are blocking for all elevation requests.
- Critical or High findings in Domain C (Safety) are blocking for all elevation requests.
- Any Critical finding in any required domain is blocking.

**Profile-adjusted severity escalation:**
A finding that would be Medium in a generic system may escalate to High when the
profile indicates elevated risk surface. Apply these escalations:
- `public` + any Domain B gap → escalate one severity level
- `consequential decisions` + any Domain C gap → escalate one severity level
- `regulated` + any Domain A gap → escalate one severity level
- `credentials` + B006 or B009 gap → escalate to High minimum

---

## Output Format

```
# AIUC-1 Compliance Audit: [System Name]
**Audit date:** [date]
**Auditor:** [Claude Code /audit-aiuc1]
**Deployment tier:** Tier N — [tier description]
**Domains audited:** [list]
**System profile:** [2–3 sentence profile from System Characterization]
**Profile flags:** [list active flags: pii, credentials, regulated, public, consequential, content-gen, persistent-state, external-calls]

---

## Executive Summary
[2–3 sentences: what was audited, overall posture, whether elevation is blocked]

---

## Domain Findings

### Domain A — Data & Privacy
**Status:** Pass / Partial / Fail
**Profile-elevated controls:** [list controls flagged HIGH PRIORITY by profile, or NONE]

| Control Area | Finding | Severity | Evidence / Notes |
|-------------|---------|----------|-----------------|
| Data governance | [finding] | Low/Med/High/Critical | [notes] |
| PII protection | [finding] | ... | ... |
| Data minimization | [finding] | ... | ... |
| Consent | [finding] | ... | ... |
| Model inversion risk | [finding] | ... | ... |

**Gaps requiring remediation:**
- [Gap 1 — domain:control, severity, recommended fix]
- [Gap 2]

---

### Domain B — Security
**Status:** Pass / Partial / Fail
**Profile-elevated controls:** [list controls flagged HIGH PRIORITY by profile, or NONE]

| Control | Finding | Severity | Evidence / Notes |
|---------|---------|----------|-----------------|
| B001 Adversarial testing | [finding] | ... | ... |
| B002 Detect adversarial input | [finding] | ... | ... |
| B003 Manage technical detail release | [finding] | ... | ... |
| B004 Prevent endpoint scraping | [finding] | ... | ... |
| B005 Real-time input filtering | [finding] | ... | ... |
| B006 Limit agent system access | [finding] | ... | ... |
| B007 Enforce user access privileges | [finding] | ... | ... |
| B008 Protect model deployment environment | [finding] | ... | ... |
| B009 Limit output over-exposure | [finding] | ... | ... |

**Gaps requiring remediation:**
- [Gap 1 — domain:control, severity, recommended fix]

---

### Domain C — Safety
**Status:** Pass / Partial / Fail
**Profile-elevated controls:** [list controls flagged HIGH PRIORITY by profile, or NONE]

| Control Area | Finding | Severity | Evidence / Notes |
|-------------|---------|----------|-----------------|
| Risk taxonomy | [finding] | ... | ... |
| Pre-deployment testing | [finding] | ... | ... |
| Real-time monitoring | [finding] | ... | ... |
| Blast radius / circuit breaker | [finding] | ... | ... |

**Gaps requiring remediation:**
- [Gap 1]

---

### Domain D — Reliability
**Status:** Pass / Partial / Fail  *(required for Tier 3+)*
**Profile-elevated controls:** [list controls flagged HIGH PRIORITY by profile, or NONE]

| Control Area | Finding | Severity | Evidence / Notes |
|-------------|---------|----------|-----------------|
| Uptime target | [finding] | ... | ... |
| Failure handling | [finding] | ... | ... |
| Model drift detection | [finding] | ... | ... |
| Continuous validation | [finding] | ... | ... |

**Gaps requiring remediation:**
- [Gap 1]

---

### Domain E — Accountability
**Status:** Pass / Partial / Fail
**Profile-elevated controls:** [list controls flagged HIGH PRIORITY by profile, or NONE]

| Control Area | Finding | Severity | Evidence / Notes |
|-------------|---------|----------|-----------------|
| Decision logging | [finding] | ... | ... |
| Log integrity | [finding] | ... | ... |
| Explainability | [finding] | ... | ... |
| Appeal mechanism | [finding] | ... | ... |
| Ownership documentation | [finding] | ... | ... |

**Gaps requiring remediation:**
- [Gap 1]

---

### Domain F — Society
**Status:** Pass / Partial / Fail
**Profile-elevated controls:** [list controls flagged HIGH PRIORITY by profile, or NONE]

| Control Area | Finding | Severity | Evidence / Notes |
|-------------|---------|----------|-----------------|
| Bias testing | [finding] | ... | ... |
| Fairness metrics | [finding] | ... | ... |
| Dataset stratification | [finding] | ... | ... |
| Non-discrimination safeguards | [finding] | ... | ... |
| Disparate impact assessment | [finding] | ... | ... |

**Gaps requiring remediation:**
- [Gap 1]

---

## Remediation Priorities

| Priority | Domain:Control | Severity | Recommended Action | Owner |
|----------|---------------|----------|--------------------|-------|
| 1 | [domain:control] | Critical/High | [action] | [role] |
| 2 | ... | ... | ... | ... |

---

## Elevation Gate Status
- AIUC-1 Baseline: PASS | FAIL
- Domains: A✓/✗  B✓/✗  C✓/✗  D✓/✗  E✓/✗  F✓/✗
- Tier compliance: Tier N
- System profile flags: [active flags]
- Audit date: [date]
- Human reviewer: [name / role — required for Tier 2+, leave blank if not yet attested]
- Blocking gaps: [list domain:control IDs] | NONE
- Ready for elevation: YES | NO — [blocking reason if NO]
```

Save the completed report to `reports/AUDIT-{system-name}.md` in the current project.

---

## When to Use

- After building a security tool or agent system — after `/retro` confirms the build
  is complete, before deployment
- Before requesting elevation to a higher autonomy mode in PeaRL
  (the Cedar elevation gate requires this report to be present and current)
- At the start of Unit 3, Week 9 — the first formal audit in the course sequence
- When a stakeholder asks "is this system compliant with AIUC-1?"
- Before submitting a capstone project — the audit report is a required deliverable

---

## Modify This Skill

- Add your organization's additional controls beyond the AIUC-1 baseline
- Fork into `/audit-aiuc1-quick` — a Tier 1-only version for light assessments
- Add a MASS scan integration: run MASS against the tool before scoring Domain B
  and import MASS findings directly into the B-control table
- Add a "re-audit" mode that diffs against a previous `reports/AUDIT-*.md`
  and surfaces only what changed — useful for quarterly reviews
- Extend the Elevation Gate Status footer with Cedar policy IDs if your
  organization uses named Cedar policies for each gate
- Add a "peer review required" gate for Tier 3+ systems — the skill outputs a
  checklist that a second reviewer must sign off before the report is finalized
- Extend the profile flags to match your system taxonomy (e.g., add `healthcare`,
  `fintech`, `critical-infra` as flags with their own control escalation rules)

---

## Installation

Save as `~/.claude/commands/audit-aiuc1.md` (global, available in all projects) or
`.claude/commands/audit-aiuc1.md` (project-local).

Use `/audit-aiuc1` after any build that produces an agent system or security tool,
before deployment, and before requesting autonomy mode elevation in PeaRL.
The Elevation Gate Status block at the bottom of the report is parsed by Cedar —
keep it intact and complete.
