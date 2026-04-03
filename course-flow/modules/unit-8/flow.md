# Module: Capstone (S2 Unit 8)

## Purpose
The capstone is a portfolio piece, not a final exam. Students build a production-grade agentic security tool that addresses a real problem using the full toolkit from both semesters: MCP, structured outputs, multi-agent orchestration, AIUC-1 governance, observability, and hardening. The constraint that matters: it must be something the student would actually use.

## Outcomes
By the end of this module, the student can:
- Define a real security problem and scope an agentic solution that is genuinely necessary (not a hammer looking for a nail)
- Design a multi-agent architecture that can be delivered in the available time
- Build, harden, and deploy a production-grade agentic security system
- Survive a peer red team review and respond to findings
- Present and defend design decisions to a mixed technical and non-technical audience
- Reflect on the prototype-to-production journey and articulate what they learned

## Related Site Content
- `docs/lab-s2-unit8.html` — student-facing lab guide

## Prerequisites
- Units 5, 6, and 7 completed (all gates closed)
- All prior artifacts committed to repo (red team report, supply chain audit, observability stack)
- `/build-spec` skill available in Claude Code

---

## Instruction Guidance

The capstone has two failure modes that require active intervention:

**Over-scoping:** Students try to build a 10-agent system that would take 6 months. Intervene at the spec stage. A complete 3-agent system beats an unfinished vision. Ask at every design review: "What's the minimum viable product that still demonstrates the concepts?"

**Under-scoping:** Students build something so simple the AI component is unnecessary. A scheduled job that sends a report is not a capstone. The test: could this be implemented with a SQL query and a cron job? If yes, the AI component needs justification or redesign.

Key instructor moves:
1. **Gate at the spec.** Do not let a student write code before they've run `/build-spec` and you've reviewed it. The `/build-spec` output is the scoping gate.
2. **CCT the architecture.** In every architecture review, ask: "Which of your agents could be a deterministic tool? Should it be?" Students who can answer this have understood the unit.
3. **The red team review is mandatory.** Peer red team in Week 15 is the only external validation before the final presentation. Students who skip it or go through the motions lose the most valuable feedback.
4. **The reflection is not a summary.** It's introspection. "What would you tell yourself at Week 1?" is the right frame. Push students away from recapping what they built toward articulating what they learned.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Late Module rules apply.

Module-specific: Full solutions are available for implementation details. But architectural decisions — what agents to build, how to scope the system, how to handle a specific security problem — require the student to reason first. Never scope the capstone for them. Ask: "What's the smallest version of this that still demonstrates multi-agent orchestration?"

---

## Tasks

1. **Proposal and Architecture Design (Week 13)** — Run `/build-spec` on the capstone idea. Write a project proposal. Present architecture for peer and faculty review. Deliver architecture document.
2. **Sprint I — Core Build (Week 14)** — Implement the MVP: core agents, end-to-end workflow, basic logging. Daily standup. Sprint I Progress Report due Friday.
3. **Sprint II — Hardening (Week 15)** — Harden against threat model. Apply hardening checklist. Receive peer red team findings; respond to critical/high issues. Sprint II Progress Report due Friday.
4. **Final Presentation and Reflection (Week 16)** — Present capstone (20 min + Q&A). Submit all deliverables. Write reflection essay.

See `semester-2/weeks/unit-8.md` for full lab instructions, rubric, and deliverable specs.

## Expected Artifact

Six deliverables submitted by end of Week 16:

**`capstone-architecture.md`** (Week 13, due Friday)
- Problem statement and solution overview
- Multi-agent architecture diagram
- CCT integration plan (how agents enable collaborative reasoning)
- Threat model (initial, to be updated)
- AIUC-1 domain mapping (initial)
- Tech stack and tool decisions

**Sprint I Progress Report** (Week 14, due Friday)
- Implementation status per agent (% complete)
- GitHub repo link with working README
- Obstacles and adjustments
- Plan for Sprint II

**Sprint II Progress Report** (Week 15, due Friday)
- Hardening summary with red team findings table (finding, severity, status)
- Observability implementation evidence
- Performance metrics (Week 14 → Week 15 comparison)
- Readiness assessment

**Source Code (GitHub repo)** (due Friday Week 16)
- Clean, documented repository
- README with setup/usage instructions
- CI/CD pipeline configuration
- Containerized delivery (Dockerfile + deployment instructions)

**Technical Documentation** (due Friday Week 16)
- System architecture (updated from Week 13)
- MITRE ATLAS threat model summary
- Security hardening measures
- AIUC-1 domain mapping (all 6 domains, control coverage assessment)
- Red team findings and responses

**`course-reflection.md`** (1000–1500 words, due Friday Week 16)
- What surprised you about agentic AI
- How your thinking evolved
- Your hardening journey
- Ethical implications and AIUC-1 alignment
- Production readiness assessment
- The bigger picture: implications for cybersecurity

---

## Review Guidance

**Recommended review mode:**
- Week 13 architecture review: Security
- Week 15 red team response: RedTeam
- Final presentation and reflection: Grader

**Common gaps:**
- Architecture document that describes what the system does but not why the AI component is necessary — push for the justification
- Sprint reports that list activities without honest risk assessment — "100% on track" with 1 week to go is almost always false
- Red team response that defers every finding as "accepted risk" without documented rationale — critical and high findings require either a fix or a written justification
- Reflection that summarizes the project instead of reflecting on growth — redirect: "What would you tell yourself at Week 1?"

**Scoping gate questions (Week 13):**
- "Is the AI component genuinely necessary here, or could a simpler tool solve this problem?"
- "What's the minimum viable version of this that still demonstrates multi-agent orchestration?"
- "Which AIUC-1 domain is hardest to address in your design — and why?"

**Architecture review questions:**
- "Which agent could be replaced by a deterministic tool? Should it be?"
- "What happens to your system if Agent B fails mid-orchestration?"
- "How does your system degrade gracefully under load or attack?"

**Presentation Q&A prep:**
- "Why did you choose [framework] over [alternative]?"
- "Your AIUC-1 mapping shows [gap]. How would you close it with more time?"
- "What's the most important thing you'd change about your architecture if you started over?"

## Reflection Prompt
"What would you tell a student starting Unit 5 about what matters most in building production agentic security systems? What did you learn that no amount of reading could have taught you?"

---

## Completion Gate
The student completes the course when:
- [ ] All 6 deliverables submitted by Friday of Week 16
- [ ] Final presentation delivered
- [ ] Reflection essay written (1000–1500 words)
- [ ] Reflection entry written in `student-state/reflection-log.md`
- [ ] `student-state/progress.md` — Unit 8 row fully marked

## Stretch Challenge
Write a "deployment readiness report" for your capstone as if you were presenting it to an organization's CISO for approval to deploy. Address: what could go wrong, how operators would detect and respond, what governance procedures are needed, and what the liability exposure is if the system misbehaves. Use AIUC-1 as the governance framework.
