# Module: CCT Foundations & AI Landscape (S1 Unit 1)

## Purpose
Builds the critical thinking foundation the entire course depends on. Students develop the CCT framework as a discipline — not a checklist — and apply it to real security incidents from Week 1. Simultaneously introduces the Engineering Assessment Stack and model selection logic that will be used every week forward.

## Outcomes
By the end of this module, the student can:
- Apply all five CCT pillars to a real security incident with evidence-based analysis
- Use V&V Discipline to evaluate AI outputs before acting on them
- Select the right AI tool for a given security task (Chat vs. Code vs. Cowork)
- Design and evaluate system prompts using quantified rubric scoring
- Build a reusable context library entry as a professional artifact

## Related Site Content
- `docs/lab-s1-unit1.html` — student-facing lab guide
- `docs/s1-unit1.html` — unit theory content

## Prerequisites
- Claude Code installed and repo mounted
- Claude Max subscription (or API key configured)
- No prior AI experience required

---

## Instruction Guidance

Unit 1 is where students learn to think with AI, not just use it. The core shift to drive:

1. **CCT is a discipline, not a template.** Students will try to fill in the pillars mechanically. Push them to justify each with evidence: "Which data point supports that claim?"
2. **V&V Discipline is uncomfortable at first.** Students either over-trust or over-reject AI outputs. The goal is calibrated trust — neither extreme. Use the question: "What would you need to see to change your assessment?"
3. **Tool selection matters.** Students default to Chat for everything. Make the distinction concrete: "Would you write production code in a chat window? Would you do architectural reasoning in an IDE?" Apply this to every lab session.
4. **The context library starts here.** Week 4's context library template is not optional — it's the artifact that compounds across the entire course. Frame this as Day 1 investment.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Early Module rules apply (no full solutions; ask guiding questions first).

Module-specific: For CCT analysis, never fill in a pillar for the student. Ask: "What evidence supports that claim?" For system prompt design, show the rubric dimensions but let the student score before you comment.

---

## Tasks

1. **Week 1 — Meridian Incident Analysis** — Apply all five CCT pillars to the Meridian Financial case. Build the Engineering Assessment Stack mapping. Write the CCT Analysis Report and metrics log.
2. **Week 2 — Team CCT & Perspective Analysis** — Run a multi-perspective CCT analysis. Write the Team Debrief Memo. Document how inclusive perspective changed the outcome.
3. **Week 3 — Model Comparison & Token Economics** — Test multiple models against a security scenario. Score with the CCT rubric. Build the model selection rubric and calculate cost at production scale.
4. **Week 4 — Context Engineering & Context Library** — Design system prompt v1 and v2. Score both versions. Write the Context Engineering Report. Produce `security-analyst-context-v2.md` as the first context library entry.

See `semester-1/weeks/week-01.md` through `week-04.md` for full lab instructions.

## Expected Artifact

**Week 1:** CCT Analysis Report (800–1000 words), Engineering Assessment Stack table, `metrics-log.csv`, CCT Journal (500–750 words)

**Week 2:** CCT Analysis Report (1500–2000 words) with five pillar markdown files, Team Debrief Memo (300–500 words), Decision Log

**Week 3:** Model Comparison Report (1500–2000 words), `model-selection-rubric.csv` (9+ rows), token economics calculation

**Week 4:** `v1-system-prompt.md`, `security-analyst-context-v2.md` (with rubric scores), Context Engineering Report (1–2 pages)

All saved to `~/noctua/deliverables/week0N/` per week.

---

## Review Guidance

**Recommended review mode:** Coach (Week 1–2, student is new), Grader (Week 3–4, rubric-based work)

**Common gaps:**
- CCT analysis that describes the incident rather than applying the pillars — push for the framework, not the narrative
- V&V Discipline that skips the "calibrated trust" framing — binary trust/reject is the failure mode to catch early
- Model comparison that lists features without a recommendation — require a stance with rationale
- Context library entry that is a document, not a reusable artifact — must be something the student can actually import next week

**Probing question bank:**
- "Which of the five CCT pillars was hardest to apply to this incident — and why?"
- "What AI output in this lab did you verify before acting on? What did you check against?"
- "Your model comparison recommends [X]. At 100 incidents/day, what's the annual cost difference vs. [Y]?"
- "If you reused your context library entry next week unchanged, what would be wrong with it?"

## Reflection Prompt
"What's the difference between using AI as a tool and using AI as a thinking partner? Give a specific example from this unit where the distinction mattered."

---

## Completion Gate
The student may advance to Unit 2 when:
- [ ] All four weeks' deliverables produced and saved
- [ ] `security-analyst-context-v2.md` exists as a context library entry
- [ ] Reflection entry written in `student-state/reflection-log.md`

## Stretch Challenge
Run your Week 3 model comparison across a second security scenario. Does your recommendation hold? If not, what conditions change the answer? Add a "scenario sensitivity" section to your model selection rubric.
