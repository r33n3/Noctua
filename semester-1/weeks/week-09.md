# Week 9: AIUC-1 Standard for AI Agent Security

**Semester 1 | Week 9 of 16**

> **AIUC-1 is a design-phase requirement, not a post-build audit.** The most common mistake when applying AIUC-1: treating it as a checklist you run after the system is built. By that point, architectural decisions that created security gaps are already locked in. The right time to apply AIUC-1 is at the design stage — before writing code. As one student noted after completing the Unit 3 audit: *"These questions were never asked during Week 5–8 design."* That's the lesson. The audit in Week 9 should surface things to improve — not things that should have blocked deployment.
>
> Starting in Week 9, you will use the `/audit-aiuc1` skill to run structured audits. Install it now if you haven't: `curl -o ~/.claude/commands/audit-aiuc1.md https://raw.githubusercontent.com/r33n3/Noctua/main/docs/skills/audit-aiuc1.md`

## Opening Hook

> The tools you've been building all semester are powerful. This week we ask whether they're safe, compliant, and trustworthy — not just technically correct. AIUC-1 is the governance standard that defines what "production-ready" means for AI agents in security contexts. By the end of this week, you'll be able to audit any AI system against six measurable domains.

## Learning Objectives

- Understand the six AIUC-1 domains and their application to AI agent security systems
- Analyze how AIUC-1 converts abstract principles into concrete, auditable controls
- Identify real-world failures when organizations deploy AI agents without proper governance
- Connect AIUC-1 domains to NIST AI RMF governance stages, MITRE ATLAS, and OWASP LLM Top 10
- Evaluate how AIUC-1 certification reduces organizational risk, accelerates procurement, and enables insurance coverage
- Understand how AIUC-1 treats AI agents as non-human actors within the enterprise control environment

---

## Day 1 — Theory

> **Evaluating this standard — and every standard you'll recommend to a client**
>
> NIST AI RMF (2023), OWASP LLM Top 10 (2023), OWASP Agentic Top 10 (2025), and AIUC-1 (2024) are all under three years old. None has the decades of practitioner refinement behind NIST CSF or the OWASP Web Top 10. When you walk into a company and recommend one of these frameworks, the first question a CISO will ask is: "Why this one?" That question requires the same source-evaluation skills CCT applies to every piece of evidence: Who governs it? What adoption does it have? What does it map to? Where does it address gaps that other frameworks don't?
>
> AIUC-1 specifically: an industry consortium standard developed with 100+ enterprise CISOs, mapped to NIST AI RMF, OWASP, and the EU AI Act. It carries less institutional weight than NIST and less community longevity than OWASP — but it is the only framework in this list designed specifically for agentic AI systems. That specificity is why this course uses it. You should be able to explain that reasoning to any stakeholder who asks.
>
> **Principle: Citing a standard and critically evaluating a standard are not in conflict. Do both.**

The **AIUC-1 Standard** (2025) is the first security, safety, and reliability standard specifically designed for AI agents. Developed by the Artificial Intelligence Underwriting Company (AIUC) with technical contributors including MITRE, Cloud Security Alliance, Stanford Trustworthy AI Research Lab, MIT, Cisco, and Orrick, AIUC-1 addresses a critical gap: traditional governance frameworks tell organizations *what to care about*, but AIUC-1 tells them *what to test and how to verify it*. This is the difference between aspiration and verification.

> **Key Concept:** AIUC-1 bridges the gap between abstract AI ethics and concrete security engineering. Where principle-based frameworks say "be secure," AIUC-1 says "implement adversarial testing (B001), detect adversarial input (B002), and implement real-time input filtering (B005) — and prove it through independent third-party testing." Certification includes 5,000+ adversarial simulations and quarterly updates to keep pace with the evolving threat landscape.

> **The policy-enforcement gap is the core security problem in AI governance.** A policy document says what should happen. A Cedar policy enforces what will happen. The distance between these two is an entire engineering problem — and it's where most AI governance fails. Every audit finding you identify this week should produce one of two outputs: a Cedar policy that enforces the control, or a documented justification for why it must remain an application-layer or operational control. "We have a policy" is not a security control. "The policy is enforced" is.

### The Six AIUC-1 Domains

**A. Data & Privacy**
- Data governance, consent, training data usage, and PII protection
- Controls cover data minimization, differential privacy, federated learning, and preventing model inversion attacks
- Example: An agent system must demonstrate that customer data used for threat analysis cannot be reconstructed from model outputs.

**B. Security**
- Adversarial robustness, input filtering, access control, and endpoint protection
- The most technically dense domain with controls B001-B009: third-party adversarial testing, detect adversarial input, manage technical detail release, prevent endpoint scraping, real-time input filtering, limit agent system access, enforce user access privileges, protect model deployment environment, limit output over-exposure
- Example: An agent deployed for SOC triage must pass adversarial testing (B001) proving it resists prompt injection, have real-time input filtering (B005), and limit its system access to only what's needed (B006).

**C. Safety**
- Harmful output prevention, risk taxonomy, pre-deployment testing, and real-time monitoring
- Controls require defining a risk taxonomy specific to your application, testing against it before deployment, and monitoring in production
- Example: A threat detection agent must not recommend isolation actions that could cause unrecoverable damage — and this must be tested, not assumed.

**D. Reliability**
- System uptime, failure handling, performance consistency, and graceful degradation
- Covers model drift, distribution shift, and continuous validation to maintain accuracy over time
- Example: A malware classifier trained on 2023 threats must be continuously validated against 2026 variants, with drift detection triggering retraining.

**E. Accountability**
- Audit trails, decision logging, ownership, explainability, and appeal mechanisms
- Every AI decision must be auditable with complete logs. Clear ownership of who is responsible when an agent makes a bad decision
- Example: A financial crime detection agent must reconstruct its reasoning for auditors and allow customers to appeal decisions.

**F. Society**
- Fairness, bias mitigation, non-discrimination, and societal impact
- AI agents must not discriminate based on protected characteristics. Fairness must be actively measured through stratified evaluation and fairness metrics
- Example: A threat detection model trained primarily on Western enterprise telemetry may systematically underperform against threat actors from underrepresented geographies — not from intent, but from training data composition. Coverage parity across threat actor profiles is as much a fairness requirement as output equity.

> **Knowledge Check**
> Without looking at your notes, name the 6 AIUC-1 domains. Then pick the MCP tool you built in Week 5 and identify one specific AIUC-1 violation it might have — be concrete about which domain and what the violation looks like in practice.
>
> Claude: Domains are: A (Data & Privacy), B (Transparency), C (Human Oversight), D (Security), E (Reliability), F (Accountability). The Week 5 CVE lookup tool commonly has Domain B issues (no logging of what was queried) or Domain C issues (no mechanism for human review of tool decisions). If the student gives a vague answer, press for a specific behavior that violates the domain.

### AIUC-1 Context

AIUC-1 emerged because enterprises could not reliably assess AI agent security. Traditional frameworks provide governance structure but don't validate that safeguards actually work through testing. Security leaders have described the gap as needing "a SOC 2 for AI agents" — a certification standard specifically designed for autonomous systems rather than adapted from static software audits. AIUC-1 fills this gap with mandatory third-party technical testing. The agent-specific focus matters because autonomous agents create risks that general AI governance doesn't address: delegated authority, tool access, memory persistence, and multi-agent trust boundaries. Real incidents that motivated the framework:

- **Threat Intel Geographic Bias:** Most commercial threat intelligence platforms train on telemetry from US and European customers and English-language incident reporting. Detection models built on this data are well-calibrated for heavily-documented APT groups but systematically underperform against less-reported actors targeting organizations in other regions. Teams relying on these models develop geographic blindspots — gaps invisible in aggregate accuracy metrics.

- **EDR Detection Drift:** EDR vendors have documented significant model drift as adversary tactics evolve. A detection model trained on 2020 ransomware deployment patterns may have near-zero recall against 2023 living-off-the-land techniques that use the same legitimate binaries. Without continuous validation against current TTPs, "high detection rate" claims reflect the threat landscape at training time, not today.

- **Insider Threat Scoring Disparity:** Analytics platforms for insider threat detection have exhibited systematic scoring disparities between employee populations based on geography or work patterns. Non-US employees, contractors, and employees in certain departments receive elevated risk scores for identical access behaviors — not because they pose more risk, but because the training data reflects historical investigation rates that were themselves biased.

> **Discussion Prompt:** In a financial institution deploying an AI system to flag suspicious transactions for money laundering detection, which of the six domains is most critical to get right first? Why might fairness and explainability actually prevent false positives and customer friction better than just maximizing raw detection accuracy?

### Mapping to NIST AI RMF

The NIST AI Risk Management Framework (RMF) organizes AI governance into four stages: **Govern, Map, Measure, Manage**. The AIUC-1 domains align with NIST as follows:

| AIUC-1 Domain | NIST RMF Stage | Implementation |
|---|---|---|
| A. Data & Privacy | Govern + Manage | Data governance policy, privacy-impact assessment, consent management, training data controls |
| B. Security | Govern + Manage | Adversarial testing program, input filtering, access control, endpoint protection |
| C. Safety | Map + Measure | Risk taxonomy definition, pre-deployment testing, harmful output prevention, real-time monitoring |
| D. Reliability | Measure | Validation datasets, performance monitoring, drift detection, graceful degradation testing |
| E. Accountability | Govern + Manage | Audit trails, decision logging, ownership structures, appeal mechanisms, explainability |
| F. Society | Measure | Fairness metrics, stratified evaluation, bias monitoring, non-discrimination testing |

Further Reading: Review [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) sections on Govern and Map. Notice how the framework is intentionally principle-based rather than prescriptive — different organizations will implement "explainability" differently depending on context.

### Real-World Case Studies

**Case 1: COMPAS Recidivism Algorithm**

ProPublica's 2016 investigation revealed that the COMPAS algorithm, widely used in the U.S. criminal justice system to predict recidivism, had significant racial bias. For the same criminal history, Black defendants were rated as higher risk than white defendants. The system failed on multiple AIUC-1 domains:
- **F. Society:** Systematic disparate impact against Black defendants
- **E. Accountability:** The proprietary algorithm's reasoning was opaque; defendants and courts could not appeal or understand decisions
- **E. Accountability:** No public accountability; the vendor treated the algorithm as a trade secret

*Security application:* A threat-scoring system with similar properties might systematically rate threats from certain organizations or geographies as higher-risk without transparent justification, leading to unfair access controls and regulatory exposure.

**Case 2: Threat Intelligence Training Data Bias**

Commercial threat intelligence platforms aggregate telemetry primarily from large US and European enterprises and English-language security research. The resulting detection models are highly optimized for well-documented APT groups — Russian GRU, Chinese MSS-affiliated actors, North Korean Lazarus — while producing significantly higher false-negative rates against less-reported threat groups. The system failed on:
- **F. Society:** Detection coverage is asymmetric — threat actors targeting less-represented geographies and industries are more likely to go undetected
- **D. Reliability:** Models were validated against labeled samples from known groups, not against threat actor diversity in the wild
- **E. Accountability:** Vendors report aggregate detection rates that mask per-actor and per-geography gaps; customers cannot assess their actual coverage profile

*Security application:* When you train or fine-tune a detection model on your own telemetry, your organization's incident history becomes your threat coverage. If you've historically had more visibility into one class of attacks, your model will be better at finding more of the same — and blind to what you haven't seen before.

> **Common Pitfall:** A common assumption is that "just add more training data" will eliminate detection gaps. But if the additional data comes from the same telemetry sources — the same customer base, the same reporting ecosystem, the same labeled sample pools — the coverage bias persists. Fixing geographic or actor-type blindspots requires actively sourcing data from underrepresented regions and threat categories, not just collecting more of what you already have. Fairness in security tools requires deliberate coverage measurement, not just volume.

**Case 3: ML-Based Detection and the Coverage Gap Problem**

Machine learning detection models for malware and behavioral anomalies are trained on sample submissions from vendor customer bases, which skew toward large North American and European enterprises. Malware families common in attacks against targets in Southeast Asia, Latin America, OT/ICS environments, and the public sector are systematically underrepresented in training data.

*Security application:* Before deploying any ML-based detection tool, evaluate it against your specific threat profile — not the vendor's benchmark suite. If you operate in a sector or geography underrepresented in the vendor's customer base, assume the published accuracy numbers do not apply to you.

### The Business Case for AIUC-1 Certification

Organizations implementing AIUC-1 realize tangible benefits beyond those of principle-based frameworks:
- **Regulatory Compliance:** AIUC-1 operationalizes the EU AI Act, NIST AI RMF, and ISO 42001.
- **Procurement Acceleration:** AIUC-1 certification is a trust signal that accelerates vendor assessment and contract signing.
- **Insurance Coverage:** Certified systems can obtain AI-specific insurance covering risks from hallucinations, data leaks, and agent failures (ElevenLabs precedent).
- **Risk Mitigation:** Third-party technical testing validates that safeguards actually work, not just that policies exist.
- **Competitive Advantage:** Certification differentiates vendors in a market where enterprises can't otherwise assess AI agent security.

### AIUC-1 Deployment Tiers — Classify Before You Audit

Before starting an AIUC-1 audit, classify the system being audited. Higher tiers require more rigorous coverage and carry greater risk if controls are missing.

| Tier | Classification | Description | Example |
|---|---|---|---|
| 1 | Informational | Read-only AI output; human decides all actions | Security report generation, threat briefing |
| 2 | Influential | AI recommendations humans act on without always verifying | Prioritized alert queue, risk scoring |
| 3 | Decisional | AI executes decisions within defined, audited boundaries | Auto-close P4 tickets, block known-bad IPs |
| 4 | Autonomous | Multi-agent chains with minimal per-action human oversight | Autonomous incident response, SOC agent team |

> Classify your system before starting the audit. Higher tiers require more rigorous AIUC-1 coverage. *In Week 12, you will express these tier boundaries as Cedar policies — executable enforcement rather than documentation.*

AIUC-1 assigns a deployment tier based on the combined risk score across all six domains. The tier determines what governance artifacts must be produced and reviewed before a system can be released to production.

| Tier | Risk Profile | Required Before Deployment |
|---|---|---|
| **Tier 1** | Low risk — informational output, no autonomous action, no sensitive data | Documentation + self-attestation |
| **Tier 2** | Moderate risk — limited tool use, non-sensitive data, human-in-the-loop | Documentation + peer review + `/audit-aiuc1` output filed |
| **Tier 3** | High risk — autonomous action, sensitive data, real-world consequences | All Tier 2 + independent security review + incident response plan |
| **Tier 4** | Critical risk — regulated data, high blast radius, or safety-critical systems | All Tier 3 + legal/compliance sign-off + staged rollout with monitoring gate |

> Run `/audit-aiuc1` on your system design before writing a line of production code. The domain scores determine your tier. A Tier 3 or Tier 4 result means you need an incident response plan and an independent review — start that process early, not the day before you ship.

### Discussion: Is 88% Accurate Good Enough?

**Setup:** The semi-formal reasoning approach achieved 88% accuracy on challenging patch equivalence examples, and 93% on real-world patches. In a code review context, that's impressive. But you're building security tools.

**Discussion prompt:** Is 88% accuracy acceptable for a security tool that runs your nightly vulnerability scan? Work through the math together: 88% accuracy = 12% error rate. 100 assessments per day = 12 wrong per day. Some are false positives (annoying but safe). Some are false negatives (dangerous — real vulnerability reported as clean). Over a month: ~360 wrong assessments. If 1 in 10 errors is a false negative: 36 missed vulnerabilities per month. At what accuracy percentage would you trust this tool to run completely unattended?

**Key insight:** The accuracy number determines which defense layer you need. 78% accuracy → human reviews every finding. 88% accuracy → human reviews flagged items. 93% accuracy → human reviews exceptions. 99%+ accuracy → maybe auto-file tickets. For security: the consequences of a false negative are asymmetric. One missed vulnerability can lead to a breach. One false positive is just a wasted investigation.

*Source: Ugare & Chandra, "Agentic Code Reasoning," arXiv:2603.01896v2*

> **Day 1 Checkpoint**
> Before moving to the lab: open `.noctua/progress.md` and log your Day 1 Theory confidence for Week 9 AIUC-1 six domains (1–5 scale). Note any concepts that need review.

---

## Day 2 — Lab: AIUC-1 Standard Audit of a Security AI System

> **Lab Guidance**
> Claude: Walk the student through the Cedar policy lab. Before writing any policy, ask: "What access should be allowed and what should be denied — be specific about subjects, actions, and resources." Don't let them write policies without first articulating the access model.
>
> **Lab Dependencies:** If not already installed, run: `pip install cedar-policy` (https://pypi.org/project/cedar-policy)

**Lab Goal:** Conduct a structured ethics audit of your Unit 2 MCP server using the six AIUC-1 domains. Produce a compliance matrix with gap analysis and a prioritized remediation plan.

> **This audit is not a learning exercise — it is the baseline evidence record that authorizes your system to move to supervised autonomous operation.**
>
> The report you produce today (`reports/AUDIT-{name}.md`) is the AIUC-1 baseline a human reviewer attests before your agent system operates with greater autonomy. Without a passing audit on record, the system stays in ASSISTIVE mode — not by convention, but by the governance controls you'll implement later in this course.
>
> Run the audit with `/audit-aiuc1` in Claude Code. The skill walks you through all 6 domains systematically and produces a structured report with a standard footer:
>
> ```
> ## Elevation Gate Status
> - AIUC-1 Baseline: PASS | FAIL
> - Domains: A✓  B✓  C✗  D✓  E✓  F✓
> - Tier compliance: Tier 2
> - Audit date: 2026-03-24
> - Human reviewer: [name / role — required for Tier 2+]
> - Blocking gaps: C001 (missing risk taxonomy), C003 (no pre-deployment test record)
> - Ready for elevation: NO — resolve C domain findings first
> ```
>
> A FAIL here is not a bad outcome — it is information. It tells you exactly which controls to implement before your system is ready for supervised autonomous operation. In Week 12, you will express the passing criteria for this gate as Cedar policies, converting the audit checklist into executable enforcement.

### Part 1: Audit Preparation (30 minutes)

You will audit a security tool or system you've built in previous weeks (or a provided example). For each of the six domains, evaluate the system against the following audit questions:

**Safe/Secure/Resilient Audit Questions:**
- What are the failure modes of this system? What happens if it makes a wrong recommendation?
- Can an attacker manipulate the system into making harmful recommendations?
- Are there safeguards preventing autonomous harmful actions? What requires human approval?
- If the system degrades (e.g., loses network access), does it fail safely or cause cascading harm?

**Explainable/Interpretable Audit Questions:**
- Can you explain why the system made a specific decision in plain English?
- What evidence supports the decision? Can you trace the reasoning?
- Can you explain the decision to three different audiences: a security analyst, a non-technical manager, and a regulator?
- What are the limitations of the explanation? Is the explanation post-hoc rationalization or genuine reasoning?

**Privacy-Enhanced Audit Questions:**
- What data does the system process? Is all of it necessary?
- Are there PII or sensitive data that could be minimized or aggregated?
- Can an attacker infer sensitive information from the system's outputs?
- Are audit logs and training data retained longer than necessary?

**Fair/Bias-Managed Audit Questions:**
- Has the system been tested on diverse datasets (different geographies, organizations, incident types)?
- Are there subgroups where the system underperforms or makes systematically different decisions?
- What proxy variables might the system use that correlate with protected characteristics?
- Would the system treat a threat from a small company differently than from a large company?

**Valid/Reliable Audit Questions:**
- How accurate is the system? On what datasets was it validated?
- How does performance vary across subgroups?
- Has the system been tested on out-of-distribution data (e.g., novel attack types)?
- Is model drift monitored? Would you detect if performance degraded in production?

**Accountable/Transparent Audit Questions:**
- Is there a complete audit log of all decisions and their reasoning?
- Can you reconstruct the system's decision-making process for any output?
- Who is responsible if the system makes a bad decision? Is that clear?
- Are there mechanisms for users to appeal or challenge decisions?

> **Pro Tip:** Create a spreadsheet with the six domains as rows and "Evaluation," "Evidence," "Gap," "Severity," and "Mitigation" as columns. This forces systematic evaluation and makes the findings easy to present.

### Lab Steps

**Step 1: Create the Audit Compliance Matrix**

Create `ethics-audit.md` with a table: Principle | Requirement | Current Implementation | Compliance (Full/Partial/Gap) | Evidence | Remediation Priority. You will fill this in across the remaining steps.

**Step 2: Audit Principle 1 — Safe, Secure, Resilient**

Evaluate: Does your server fail gracefully when the NVD API is down? Does it prevent an agent loop from exhausting rate limits? Does it have input sanitization preventing injection? Score each: PASS / PARTIAL / FAIL. For each FAIL, write one remediation action.

**Step 3: Audit Principle 2 — Explainable & Interpretable**

Run an explainability audit on your Unit 2 tools. In Claude Code, ask Claude to explain how `generate_incident_report` produces its output and what data it relies on. Ask about `search_security_kb`: How does it decide which documents to retrieve? Is the reasoning traceable? Score each: PASS / PARTIAL / FAIL.

**Step 4: Audit Principles 3–6 (Privacy, Fair, Valid, Accountable)**

Complete the remaining four principle audits. Key questions — Privacy: Are you logging PII from incident data? Fair: Could your tools produce systematically different results for certain demographics? Valid: Is CVE data validated before use? Accountable: Who is responsible when a tool produces a wrong output?

**Step 5: Use Claude Code to review your audit for blind spots**

In Claude Code, run Claude from the directory containing your `ethics-audit.md` file. Use the Read tool or reference the file by path — for example: "Read ethics-audit.md and review it against the AIUC-1 checklist."

**Step 6: Write the Prioritized Remediation Plan**

From your gap analysis, create a prioritized remediation plan: P1 (security-critical gaps to fix before deployment), P2 (important gaps to address in next sprint), P3 (long-term improvements). Use the NIST AI RMF Manage stage framework for structuring the plan.

> **Required: Close at least one P1 finding before Week 10.** An audit that identifies problems but fixes nothing is not a security audit — it's a list. Before moving to Week 10, implement at least one P1 remediation from your Week 9 audit. Acceptable remediations:
> - Add API key authentication to your MCP server endpoints
> - Add injection filtering (block or sanitize tool inputs that contain instruction-like patterns)
> - Switch audit logging from stdout to an append-only file log
>
> Document your remediation in `ethics-audit-v2.md`: what you found, what you changed, and how you verified the fix. Your Week 10 OWASP assessment should reference this document.

### Part 2: Hands-On Evaluation (60 minutes)

Work in pairs. One person is the auditor, one person is the system owner.

1. **System Overview (10 min):** System owner describes the tool: What does it do? What data does it ingest? What decisions or recommendations does it make?

2. **Principle-by-Principle Evaluation (50 min, ~8 min per principle):**
   - **Safe/Secure/Resilient:** Can the system cause harm? Has it been tested for resilience? Are there safeguards?
   - **Explainable/Interpretable:** Run a concrete example through the system. Can you explain the output?
   - **Privacy-Enhanced:** Document all data flows. Identify sensitive data. Assess data minimization.
   - **Fair/Bias-Managed:** Review training data. Are there obvious geographic, organizational, or sector biases? Test the system on a "non-Western organization" scenario and compare to a "Western organization" scenario.
   - **Valid/Reliable:** Review validation results. Are there subgroups where accuracy is lower?
   - **Accountable/Transparent:** Review audit logs. Can you reconstruct the reasoning for a decision?

3. **Documenting Findings:** For each principle, rate the system as:
   - **Compliant:** System meets the principle. Evidence: [describe]
   - **Partially Compliant:** System meets the principle partially. Gaps: [describe]
   - **Non-Compliant:** System does not meet the principle. Risk: [describe]

For each non-compliance or partial compliance, identify:
- **Severity:** Critical (causes direct harm), High (regulatory risk), Medium (operational risk), Low (minor issue)
- **Impact:** Who is harmed? What is the business impact?
- **Mitigation:** What can be done to address the gap?

### Example: Threat Detection System Audit

Imagine a system that analyzes network logs and recommends quarantining suspicious IPs.

**Safe/Secure/Resilient Assessment:**
- Finding: The system autonomously blacklists IPs without human review
- Gap: No safeguard preventing false positives from isolating legitimate traffic
- Severity: **Critical** — a biased decision could cut off entire partner organizations
- Mitigation: Require human approval before blacklisting critical systems; implement automatic rollback after 24 hours

**Fair/Bias-Managed Assessment:**
- Finding: Training data consists mostly of attacks from Eastern Europe. The system flags Eastern European IPs at higher rates, even for benign traffic
- Gap: No stratified evaluation by geography. No fairness constraints during training.
- Severity: **High** — systematic geographic discrimination in threat flagging; potential regulatory exposure
- Mitigation: Collect and test on geographically diverse data; measure disparate impact by region; apply fairness constraints

**Explainable/Interpretable Assessment:**
- Finding: The system uses a deep neural network. No interpretability tools are available.
- Gap: Security analysts cannot understand why an IP is flagged; cannot explain decisions to users or regulators
- Severity: **High** — regulatory risk under EU AI Act; operational risk if analysts distrust the system
- Mitigation: Implement SHAP or LIME explanations; document the top features influencing threat scores

> **Remember:** The goal of this audit is not to declare a system "safe" or "unsafe." Rather, it's to systematically identify gaps, understand their severity, and plan concrete improvements. Most real systems will have gaps; the question is whether they're acceptable given the risk and whether you have a plan to address them.

### Part 3: Peer Review and Presentation (20 minutes)

- Swap audits with another pair
- Provide constructive feedback: Do you agree with the severity assessments? Are there gaps the auditor missed? Are the mitigations realistic?
- Each pair presents their audit findings (5 minutes, with feedback discussion)

### Cedar Introduction: From Audit Finding to Executable Policy

Your AIUC-1 audit produced a list of findings. Cedar lets you express the most important findings as enforcement — code that runs at every tool invocation and enforces the control, regardless of what the model decides.

**Step 7: Define your entity schema**

Start by explaining Cedar's data model to Claude Code: "I'm learning Cedar policy language. Explain the entity schema concept — what are principals, actions, and resources in Cedar's authorization model, and how do I define them in a .cedarschema file?"

Then create `cedar-policies/schema.cedarschema` defining:
- `Agent` as a principal entity with attributes: `api_key_valid: Bool`, `authorized_tools: Set<String>`
- `Tool` as a resource entity
- `invoke_tool` as an action

**Step 8: Write your first permit rule**

Map your top AIUC-1 finding (missing authentication) to a Cedar policy. Create `cedar-policies/aiuc1-b-domain.cedar` with the following permit rule — notice that every line traces to an audit finding. Policy is the output of risk analysis.

```cedar
// AIUC-1 B006: Limit Agent System Access (Least Privilege)
// Audit finding: No authentication — any process can invoke any tool
permit(
  principal is Agent,
  action == Action::"invoke_tool",
  resource is Tool
)
when {
  principal.api_key_valid &&
  principal.authorized_tools.contains(resource.identifier)
};
```

**Step 9: Test your policy**

Create `cedar-policies/test-entities.json` with test principals: one with a valid key and correct tool authorization, one missing the key, and one with wrong tool authorization. Run `cedar authorize` and verify the policy behaves correctly for each case.

---

> **Lab Checkpoint**
> Before moving on: open `.noctua/progress.md` and log your Day 2 Lab confidence for Week 9 (1–5 scale). Note which AIUC-1 domains were hardest to audit and any Cedar policy issues you hit.

## Deliverables

1. **`ethics-audit.md`** — complete compliance matrix across all 6 AIUC-1 domains
2. **Ethics Audit Report** (1,500–2,000 words) — findings narrative with NIST RMF mapping and prioritized remediation plan:
   - Executive summary: Tool name, purpose, overall compliance posture
   - Principle-by-principle evaluation (Safe/Secure/Resilient, Explainable/Interpretable, Privacy-Enhanced, Fair/Bias-Managed, Valid/Reliable, Accountable/Transparent)
   - Severity summary: Table of all gaps, rated by severity
   - Mitigation plan: Timeline for addressing critical and high-severity gaps
   - Conclusion: Overall risk assessment and next steps
3. **Peer Audit Feedback** (500 words) — feedback on another pair's audit, agreement/disagreement with assessments, additional gaps or considerations they missed
4. **CCT Journal** — reflect: how does building an ethics audit change how you design systems? What would you do differently if starting Unit 2 over?

> **Audits produce fixes, not just documents.** Before moving to Week 10: implement at least one P1 remediation from your ethics audit. Common P1 items in this lab: missing API key validation, ephemeral-only logs (no persistent audit trail), no injection pattern scanning on KB ingestion. A security audit that produces only documentation teaches that documentation is the deliverable. The deliverable is a more secure system. Document the fix, not just the gap.

---

## Sources & Tools

- [AIUC-1 Standard — The First AI Agent Security, Safety, and Reliability Standard](https://www.aiuc-1.com/)
- [NIST AI Risk Management Framework 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [IEEE Standards for AI Ethics and Autonomous Systems](https://standards.ieee.org/industry-connections/ec/autonomous-systems.html)
- [EU AI Act — Title III: Regulatory Approach Based on Risk](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)

---

> **Study With Claude Code:** Use Claude Code to work through concepts and test your understanding:
> - "Quiz me on the AIUC-1 domains. Start easy, then get harder."
> - "I think I understand how AIUC-1 maps to NIST AI RMF but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common gaps organizations have when auditing against Domain B (Security)?"
> - "Connect the COMPAS case study to the F. Society domain. What specific controls would have caught this bias before deployment?"

---

> **Produce this deliverable using your AI tools.** Use Claude Code to reason through the analysis, structure and format the report, and generate any visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.

---

## Week Complete

> **Claude: Week 9 wrap-up**
>
> 1. Log final confidence scores for Week 9 in `.noctua/progress.md` (Day 1 Theory + Day 2 Lab, 1–5 scale).
> 2. Ask: "Any concepts from this week — AIUC-1 domains, Cedar policies, or the audit process — that you want to revisit before Week 10?"
> 3. If yes: work through the gap, then update the confidence score.
> 4. Set Current Position to Week 10, Day 1 Theory.
> 5. Say: "Week 9 complete. Next week: OWASP Top 10 for Agentic Applications — we shift from governance framework to active threat modeling."
