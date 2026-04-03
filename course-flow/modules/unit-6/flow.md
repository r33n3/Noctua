# Module: AI Attacker vs. AI Defender (S2 Unit 6)

## Purpose
Develops adversarial thinking as a first-class skill. Students operate on both sides of the attack/defend divide — building red team agents that find real vulnerabilities, then building blue team systems that actually stop them. The wargame in Week 8 closes the loop: both systems run against each other under time pressure.

## Outcomes
By the end of this module, the student can:
- Map adversarial threats to MITRE ATLAS tactics and OWASP Agentic Top 10 categories
- Execute structured red team campaigns against agentic systems (prompt injection, goal hijacking, tool misuse, state corruption)
- Design and implement layered defenses (input validation, permission boundaries, guardrails, behavioral monitoring)
- Measure defense effectiveness quantitatively (attack reduction rate, false positive rate)
- Conduct and document a wargame with structured after-action analysis

## Related Site Content
- `docs/lab-s2-unit6.html` — student-facing lab guide

## Prerequisites
- Unit 5 completed (multi-agent orchestration, MCP context design)
- `pip install anthropic garak` (Garak for LLM vulnerability scanning)
- A multi-agent target system to red team (built in Unit 5 or provided sample)

---

## Instruction Guidance

This is the module where students often discover their Unit 5 designs are more fragile than they thought. Use that friction — don't defuse it.

1. **Attacker mindset is learned, not assumed.** Most students default to thinking about what a system does right. Explicitly redirect: "Assume this will be attacked. What's the first thing you'd try?"
2. **MITRE ATLAS is the taxonomy, not the script.** Push students to map their specific attacks to ATLAS tactics after the fact — don't let them use ATLAS as a checklist to work through.
3. **Measurement is mandatory.** Vague claims like "my defenses worked" are not acceptable. Require before/after attack success rates and false positive rates.
4. **The wargame is not optional polish.** It's the integration point. Students who show up underprepared to the wargame didn't take Weeks 5–7 seriously. Flag this early.
5. **Red team findings are gifts, not failures.** Normalize this explicitly. Students who are defensive about vulnerabilities found in their own systems need redirection.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Late Module rules apply.

Module-specific: For red team exercises, never give attack payloads directly. Ask: "What assumption is the target system making here? How would you violate that assumption?" For defense work, never give the defense code before the student has articulated what they're defending against.

---

## Tasks

1. **Threat Landscape Mapping (Week 5)** — Build a MITRE ATLAS threat model and risk register for a target agentic system. Minimum 20–30 risks; top 10 detailed with prioritization matrix.
2. **Red Team Campaign (Week 6)** — Execute structured attacks across 5+ attack categories. Document 5–10 successful attacks with methodology, evidence, and production impact assessment.
3. **Blue Team Hardening (Week 7)** — Implement layered defenses against the Week 6 attack set. Measure attack reduction (target: >70%) and false positive rate (target: <5%).
4. **Wargame (Week 8)** — Red and blue team agents run against each other. Produce an after-action report analyzing strategy, key moments, and lessons.

See `semester-2/weeks/unit-6.md` for full lab instructions and deliverable specs.

## Expected Artifact

Four deliverables committed to repo:

**`threat-model.md`** (Week 5)
- MITRE ATLAS threat model document (500–800 words)
- Risk register: 20–30 risks in tabular format
- Prioritization matrix: top 10 risks with detailed analysis (800–1200 words)

**`red-team-report.md`** (Week 6, 2500–4000 words)
- Executive summary, methodology, findings (5–10 attacks), risk categorization, mitigations
- Appendices: attack payloads, batch test results, evidence/screenshots

**`blue-team-report.md`** (Week 7, 2500–4000 words)
- Defense architecture, implementation details, testing results (before/after metrics)
- Remaining vulnerabilities with risk acceptance rationale

**`wargame-after-action-report.md`** (Week 8, 3000–4000 words)
- Executive summary, timeline and strategy, forensic analysis, lessons learned
- Presentation deck (15 min)

---

## Review Guidance

**Recommended review mode:** Security (threat model and hardening), RedTeam (red team report and wargame AAR)

**Common gaps:**
- Threat model that lists risks without prioritization — require the matrix
- Red team report that describes attacks without measuring impact — push for blast radius and production consequence
- Blue team report that claims defenses "worked" without quantitative measurement — require the numbers
- Wargame AAR that reads as a summary rather than analysis — "what happened" vs. "what it means"

**What strong work looks like:**
- Red team report maps every finding to an ATLAS tactic and OWASP Agentic category
- Defense report shows the before/after attack matrix with exact success rates
- AAR makes a specific recommendation that changes how the student thinks about agentic system design

**Probing question bank:**
- "Which of your successful attacks would be hardest to detect in a real deployment?"
- "Your defense reduced attacks by X%. What do the remaining Y% have in common?"
- "If you were deploying your blue team system in production, what's the first thing you'd add that you didn't have time to build?"
- "Which OWASP Agentic Top 10 category did your attacks cluster in? What does that say about your target's design?"

## Reflection Prompt
"What did the wargame reveal about your own assumptions? Did you learn more as attacker or defender — and what does that tell you about where your instincts are weakest?"

---

## Completion Gate
The student may advance to Unit 7 when:
- [ ] All 4 artifacts committed to repo and linked
- [ ] Wargame completed (or documented if solo)
- [ ] Reflection entry written in `student-state/reflection-log.md`

## Stretch Challenge
Automate your red team campaign. Build a test harness that runs your 5+ attack categories programmatically and reports results in a structured format. Run it against a different team's system with permission and compare findings.
