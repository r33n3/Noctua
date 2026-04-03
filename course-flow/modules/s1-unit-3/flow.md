# Module: Ethical AI & Responsible AI (S1 Unit 3)

## Purpose
Develops the governance instinct — the habit of asking "who gets harmed, and how do we know?" before and after deploying AI systems. Students run real audits (AIUC-1, OWASP, bias detection) and write real policy (Cedar-executable). The unit ends with a policy artifact that could be submitted to a security leadership team.

## Outcomes
By the end of this module, the student can:
- Conduct a full AIUC-1 compliance audit across all six domains with severity ratings and remediation plan
- Run automated vulnerability scans with Garak and Promptfoo and interpret OWASP Agentic Top 10 findings
- Detect and measure bias in an AI system using IBM AI Fairness 360
- Write an organization-level AI Security Policy with Cedar-executable access controls
- Map governance requirements to NIST AI RMF and AIUC-1 controls

## Related Site Content
- `docs/lab-s1-unit3.html` — student-facing lab guide
- `docs/s1-unit3.html` — unit theory content

## Prerequisites
- Unit 2 completed (working MCP server and agent system to audit)
- `pip install anthropic aif360 garak` (install at start of relevant week)
- Cedar CLI for Week 12 (install instructions in week-12.md)

---

## Instruction Guidance

Governance is the part students are most tempted to treat as paperwork. Counter this at every step.

1. **Audits produce fixes, not documents.** The AIUC-1 audit is not complete until at least one P1 gap is fixed in code. "I documented the gap" is not the deliverable — "I fixed the gap and documented the fix" is.
2. **OWASP findings are real.** When Garak returns a probe result, it found something. Don't let students dismiss scanner findings as false positives without investigation. "Why do you think this is a false positive?" is the right response.
3. **Bias is measurable.** Students often think bias is philosophical. Make it quantitative: disparate impact ratio, FPR by group, FNR by group. "Is that fair?" becomes "what's the disparity ratio and who is harmed?"
4. **Cedar policy is executable.** The Week 12 Cedar policy is not a Word document. It runs. Probe: "What does your Cedar policy do when an agent tries to access a resource it doesn't own?"
5. **Peer review is mandatory.** Week 12 peer review finds gaps the author missed. Students who skip it lose the most valuable signal before the Unit 3 review.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Mid Module rules apply (partial code allowed after attempt).

Module-specific: For AIUC-1 audits, never fill in a domain assessment. Ask: "What evidence would you need to mark this domain compliant?" For bias detection, give the AIF360 API pattern once; require the student to interpret the metrics.

---

## Tasks

1. **Week 9 — AIUC-1 Ethics Audit** — Audit a target agent system across all 6 AIUC-1 domains. Produce the compliance matrix and audit report. Write peer audit feedback on another student's audit. Fix at least one P1 gap before marking complete.
2. **Week 10 — OWASP Vulnerability Assessment** — Run Garak and Promptfoo scans. Document findings for all 10 OWASP Agentic risks with CVSS scores. Implement fixes for Critical and High findings. Produce before/after mitigation report.
3. **Week 11 — Bias Detection & Mitigation** — Build `bias_analysis.py`, generate synthetic dataset, run AIF360 metrics. Produce bias analysis report with disparate impact ratios and mitigation results. Include 5–10 explainability examples.
4. **Week 12 — AI Security Policy** — Write `ai-security-policy.md` for Noctua Labs. Translate to Cedar (`noctua-ai-security-policy.cedar`). Conduct peer review. Write Unit 3 reflection.

See `semester-1/weeks/week-09.md` through `week-12.md` for full lab instructions.

## Expected Artifact

**Week 9:** `ethics-audit.md` (AIUC-1 compliance matrix, all 6 domains), Ethics Audit Report (1500–2000 words with remediation plan), Peer Audit Feedback (500 words), evidence of at least one P1 fix

**Week 10:** Garak and Promptfoo raw reports (HTML/JSON), OWASP Vulnerability Assessment Report (2000–2500 words), remediation code with tests, before/after Garak comparison

**Week 11:** `bias_analysis.py`, `threat_scores.csv`, `risk_rate_by_geography.png`, Bias Analysis Report (2000–2500 words), 5–10 explainability examples

**Week 12:** `ai-security-policy.md` (complete, peer-reviewed), `cedar-policies/noctua-ai-security-policy.cedar`, peer review notes, Unit 3 Reflection (500 words)

---

## Review Guidance

**Recommended review mode:** Security (Weeks 9–10), Grader (Weeks 11–12)

**Common gaps:**
- AIUC-1 audit with "N/A" for a domain — there is no N/A; every domain applies to every agentic system
- OWASP report that documents findings without fixing Critical/High — the fix is required, not optional
- Bias analysis with disparity ratios but no interpretation of who is harmed — numbers without analysis
- Cedar policy that is syntactically valid but wouldn't block a real unauthorized access — probe with a test case

**What strong work looks like:**
- AIUC-1 audit that maps each gap to a specific line of code and names the fix
- OWASP report where the "after" Garak scan shows measurable reduction in probe successes
- Bias report that names a real downstream harm: "A geography scoring 0.62 disparate impact means applicants from [region] are 38% less likely to be approved"
- Cedar policy that was actually tested: "I ran `cedar authorize` with these inputs and got this output"

**Probing question bank:**
- "Which AIUC-1 domain was hardest to assess — and what evidence did you rely on?"
- "Garak found [N] successful probes. Which one worries you most in a production deployment, and why?"
- "Your bias mitigation reduced disparate impact from 0.62 to 0.78. Is that good enough? For whom?"
- "Your Cedar policy denies [action]. Show me the test that proves it actually denies it."

## Reflection Prompt
"How has building governance artifacts (audit, policy, bias report) changed how you design systems? Cite one specific design decision you would make differently now that you wouldn't have made in Unit 1."

---

## Completion Gate
The student may advance to Unit 4 when:
- [ ] All four weeks' deliverables produced
- [ ] At least one AIUC-1 P1 gap fixed in code
- [ ] Cedar policy runs and produces expected authorization decisions
- [ ] Reflection entry written in `student-state/reflection-log.md`

## Stretch Challenge
Map your Week 12 Cedar policy to your Week 9 AIUC-1 audit. For each AIUC-1 control gap you identified, write a Cedar policy statement that enforces the control. How many gaps can be closed with policy vs. requiring code changes?
