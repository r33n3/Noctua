# Module: Rapid Prototyping with Agentic Tools (S1 Unit 4)

## Purpose
Integrates everything from S1 Units 1–3 into a working, deployable agentic security tool. Students practice the full Think → Spec → Build → Retro cycle under time pressure, experience the leadership evaluation gate, and learn to harden and present prototype work. The unit ends with the midyear presentations — the first external validation of the year.

## Outcomes
By the end of this module, the student can:
- Design and build a multi-agent security system using the orchestrator pattern
- Apply the Think → Spec → Build → Retro cycle to a timed prototype sprint
- Navigate the leadership evaluation gate (PR-based submission, MTTS/MTTP/MTTSol metrics)
- Harden a prototype: error handling, input validation, logging, rate limiting
- Present and defend a working agentic system to a mixed technical/non-technical audience

## Related Site Content
- `docs/lab-s1-unit4.html` — student-facing lab guide
- `docs/s1-unit4.html` — unit theory content

## Prerequisites
- Units 1–3 completed (all gates closed)
- Docker installed (required for Week 14 containerized submission)
- `gh` CLI configured (required for PR-based submission in Week 14)

---

## Instruction Guidance

Unit 4 is where S1 theory becomes S1 practice under real constraints. The key instructor moves:

1. **Scope ruthlessly at Week 13.** Students want to build the ambitious 10-agent system. Hold them at the architecture phase until the design is honest about what 1–2 students can build in a week. "What's the minimum that demonstrates orchestration?" is the gate question.
2. **The PR submission is not optional.** Week 14's `gh pr create` submission mirrors the real DevSecOps workflow. Students who skip the PR and submit a zip file are skipping the point of the lab.
3. **Sprint Retrospective is reflective, not defensive.** Students will want to explain why things went wrong. Redirect to the retrospective questions: "What did you learn? What would you change? What would you tell a teammate starting this sprint?"
4. **Hardening is not polish.** Week 15 is not "add comments and clean up code." It is systematic hardening: error handling, input validation, logging, rate limiting. Run `/check-antipatterns` before marking complete.
5. **Presentation prep is engineering work.** Demo anxiety is real. Require a demo script and a timed run-through before presentation day.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Late Module rules apply (full solutions after real attempt).

Module-specific: For architecture design in Week 13, never give the architecture. Ask: "Which agent does work only it can do? Which one could be replaced by a function call?" For hardening in Week 15, run `/check-antipatterns` together and walk through each finding rather than fixing it for them.

---

## Tasks

1. **Week 13 — Multi-Agent SOC System** — Build a working orchestrator + 3 subagents (recon, analysis, reporting). Deliver `ARCHITECTURE.md` with data flow diagram.
2. **Week 14 — Sprint I Prototype** — Full Think → Spec → Build → Retro sprint. Build containerized prototype. Submit via GitHub PR. Write Sprint Retrospective.
3. **Week 15 — Hardening Sprint** — Harden the Week 14 prototype: error handling, input validation, logging, rate limiting, output validation. Run `/check-antipatterns`. Produce Hardening Report.
4. **Week 16 — Midyear Presentations** — Present capstone system (12–15 slides, 4–5 min demo). Submit final deliverables. Participate in S1 retrospective.

See `semester-1/weeks/week-13.md` through `week-16.md` for full lab instructions.

## Expected Artifact

**Week 13:** Multi-agent codebase (`/soc-agent-team/`: `orchestrator.py`, `recon_agent.py`, `analysis_agent.py`, `reporting_agent.py`, `main.py`, `requirements.txt`), `ARCHITECTURE.md` with data flow diagram

**Week 14:** Sprint I prototype (source code, `Dockerfile`, `docker-compose.yml`, README with `docker-compose up` instructions), GitHub PR (submitted via `gh pr create`), Sprint Retrospective (1000–1500 words)

**Week 15:** Hardened codebase (all hardening checklist items addressed), Hardening Report (1000–1500 words), `/check-antipatterns` output showing resolved findings

**Week 16:** Presentation slides (12–15 slides, PDF), demo recording (4–5 min backup), S1 reflection

Context library additions: orchestrator pattern, error handling pattern, deployment configuration — saved to `context-library/patterns/`.

---

## Review Guidance

**Recommended review mode:** Coach (Week 13, first major build), Security (Week 15 hardening), Grader (Week 16 final submission)

**Common gaps:**
- Week 13 orchestrator that passes all data to all agents without scoping — push for minimal necessary context
- Week 14 prototype with no Dockerfile or broken `docker-compose up` — required for submission
- Sprint Retrospective that summarizes the sprint instead of reflecting — redirect to "what would you tell a teammate starting this sprint?"
- Week 15 hardening that adds comments but doesn't address error handling or input validation — run `/check-antipatterns` and require responses to each finding

**Probing question bank:**
- "Which agent in your Week 13 system could be replaced by a deterministic function? Should it be?"
- "Your Sprint Retrospective says the hardest part was [X]. What did you learn about your own process from that?"
- "Show me what happens in your hardened system when the API call fails. Walk through the code."
- "In your presentation, you'll get the question: 'Why does this need to be an agent?' What's your answer?"

## Reflection Prompt
"Looking back at Unit 1 Week 1, what did you think agentic systems could do? What do you know now that you didn't know then? What's one thing you'd tell yourself at the start of the semester?"

---

## Completion Gate
The student may advance to Semester 2 when:
- [ ] All four weeks' deliverables produced
- [ ] GitHub PR submitted for Sprint I prototype
- [ ] `/check-antipatterns` run and critical findings addressed
- [ ] Midyear presentation delivered
- [ ] Reflection entry written in `student-state/reflection-log.md`

## Stretch Challenge
After the midyear presentation, write a "production readiness report" for your prototype as if you were presenting it to a CISO for deployment approval. What would need to change? What governance procedures would be required? Use AIUC-1 as the framework — this is your preview of Semester 2.
