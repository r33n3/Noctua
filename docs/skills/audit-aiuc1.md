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

Then proceed through the applicable domains for that tier, ask structured audit
questions for each domain, assess gaps, and produce the scored report.

**Do not skip the Elevation Gate Status footer.** It is machine-readable and
required for Cedar policy evaluation. Every field must be present.

---

## Tier Classification

Classify the system before scoping the audit. Only audit the domains required
for the tier — do not audit domains above scope unless requested.

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

For Tier 4 systems, also audit inter-agent trust: how does each agent verify the
identity and authorization of messages from other agents in the pipeline?

### Domain C — Safety
Audit questions:
- What harmful outputs could this system produce? Is there a documented risk taxonomy?
- What pre-deployment safety testing was conducted? What test cases were used?
- Is real-time output monitoring in place? What happens when a harmful output is detected?
- Is there a circuit breaker or rate limiter that stops the system if anomalies are detected?
- For autonomous agents: what is the blast radius of a worst-case failure? Is it bounded?

### Domain D — Reliability
Audit questions:
- What is the documented uptime target? Is it measured?
- How does the system handle model unavailability or degraded performance?
- Is model drift monitored? How is drift detected and acted on?
- Is there continuous validation — scheduled tests that confirm expected behavior over time?
- Is there a documented incident response plan for system failure?

### Domain E — Accountability
Audit questions:
- Are all agent decisions and actions logged with sufficient detail to reconstruct what happened?
- Are logs tamper-evident and retained for the required period?
- Can the system explain a given output to a human reviewer in plain language?
- Is there an appeal or override mechanism for affected users?
- Is ownership clearly documented — who is accountable for this system's behavior?

### Domain F — Society
Audit questions:
- Has the system been tested for bias across demographic subgroups relevant to its use case?
- Is there a documented fairness metric and a threshold for acceptable bias?
- Are training and evaluation datasets stratified to ensure coverage parity?
- Does the system include non-discrimination safeguards for protected characteristics?
- If the system affects decisions (hiring, access, triage), is there a disparate impact assessment?

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

---

## Output Format

```
# AIUC-1 Compliance Audit: [System Name]
**Audit date:** [date]
**Auditor:** [Claude Code /audit-aiuc1]
**Deployment tier:** Tier N — [tier description]
**Domains audited:** [list]

---

## Executive Summary
[2–3 sentences: what was audited, overall posture, whether elevation is blocked]

---

## Domain Findings

### Domain A — Data & Privacy
**Status:** Pass / Partial / Fail

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

---

## Installation

Save as `~/.claude/commands/audit-aiuc1.md` (global, available in all projects) or
`.claude/commands/audit-aiuc1.md` (project-local).

Use `/audit-aiuc1` after any build that produces an agent system or security tool,
before deployment, and before requesting autonomy mode elevation in PeaRL.
The Elevation Gate Status block at the bottom of the report is parsed by Cedar —
keep it intact and complete.
