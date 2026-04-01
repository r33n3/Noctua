# Week 16: Midyear Project Presentations

**Semester 1 | Week 16 of 16**

## Learning Objectives

- Synthesize learning across 16 weeks: from CCT and Assessment Stack through multi-agent systems, sprints, red teaming, and production hardening
- Prepare and deliver a compelling technical presentation with live or recorded demo
- Articulate AIUC-1 domain coverage, Assessment Stack justification, and V&V architecture for your prototype
- Give and receive constructive peer feedback on technical work
- Reflect on the progression from Week 1 tool setup to Week 15 production-hardened prototype

---

## Day 1 — Presentation Preparation

Week 16 is not a lecture week. Both days are dedicated to presentation preparation and delivery. Day 1 is structured preparation time; Day 2 is presentations and peer feedback.

### What You're Presenting

Your Semester 1 project is the security tool prototype built across Weeks 11-15:
- Designed with the Engineering Assessment Stack
- Built with AIUC-1 controls from the start
- Red teamed in Weeks 13-14
- Hardened and containerized in Week 15

The presentation synthesizes everything: not just "here's my tool" but "here's how I made every architectural decision using the frameworks we studied."

### Presentation Structure

15 minutes per team (12 minutes presentation + 3 minutes Q&A). Organize around:

**1. Hook (1 min)**
Why does this problem matter? Ground it in real impact:
- What security incident does this prevent or accelerate response to?
- What does this cost in time or money without the tool?
- Connect to a real scenario from the course (Meridian Financial, GTG-1002, etc.)

**2. Problem Statement (2 min)**
- What security challenge did you tackle? Be concrete.
- How is it currently solved (manually, with other tools, not at all)?
- What gap does your tool fill?

**3. CCT Analysis (1 min)**
- Which CCT pillars shaped your problem definition?
- What perspectives did you consider that changed your approach?
- One example of evidence-based analysis changing a design decision

**4. Engineering Assessment Stack (2 min)**
This is the core technical narrative. Walk through your Assessment Stack justification table:
- Layer 1: What problem type? Why?
- Layers 2-3: Why reasoning? Which model tier? What did Haiku handle vs. Sonnet?
- Layer 4: What data architecture? Why vector AND relational, not just one?
- Layer 5: Integration pattern — why MCP tool calls?
- Layer 6: Verification approach

One slide, one table. Let the table speak.

**5. Demo (4 min)**
Live is impressive; video is safe. Either way:
- Show the input (what goes in)
- Show execution (tool running, agent processing)
- Show the output (structured JSON or report)
- Narrate as you go: "The recon agent is querying the threat intel tool... now the analysis agent is correlating..."

Show at least one interesting finding or result that demonstrates the tool works on a real scenario.

**6. Red Team and Defense Results (2 min)**
This separates a course project from a production prototype:
- How many attacks were attempted? How many succeeded before defense?
- Which AA-TTP levels were reached?
- Attack Reduction Rate after Week 14 defense implementation
- One specific finding + the fix you implemented

**7. AIUC-1 Coverage (1 min)**
- Show your AIUC-1 certification readiness checklist (summary slide)
- Highlight which controls were built in from the start vs. added during hardening
- One domain that was harder than expected to implement

**8. Metrics (1 min)**
Concrete numbers from your metrics.json:
- MTTS, aMTTR for your tool's primary use case
- CPT (Cost Per Transaction) after Assessment Stack optimization
- Cost comparison: Week 11 prototype vs. Week 15 hardened (after model right-sizing and caching)

**9. Reflection (1 min)**
- What would you do differently if starting over?
- What from Weeks 1-10 (theory and multi-agent systems) directly shaped your Week 11 decisions?
- One thing you built that surprised you

### Required Deliverables in the Presentation

All seven of the following must appear in the presentation or supporting documentation:

1. **AIUC-1 domain mapping** — six-domain coverage table, evidence for each domain (including which controls your system implements, which are not applicable with justification, and what gaps remain)
2. **Assessment Stack justification** — six-layer table with decisions and rationale
3. **V&V documentation** — test evidence, red team results, ARR measurement (the full V&V architecture: what gets verified, how, by what automated mechanism)
4. **Cost analysis** — CPT, total project cost estimate, optimization decisions made (Sprint I vs. Sprint II CPT comparison, model right-sizing rationale)
5. **Skills/plugins** — any Claude Code skills built during the semester that support this tool
6. **Week 15 production artifacts** — SBOM, container scan results, decision authority document
7. **Dark factory governance policy** — the Decision Authority Spectrum table documenting which agent decisions are automated vs. human-gated, with rationale

### Preparing Your Demo

**If live demo:**
- Test 3 times before presenting
- Have a backup data file ready (if the API is slow, you can run against cached mock data)
- Know the exact commands — no searching through shell history

**If video demo:**
- Record at 1080p minimum
- Narrate clearly as you go
- Keep it under 4 minutes
- Show the terminal output, not just "it worked"

**Demo script outline (adapt to your tool):**
```
1. "Our tool analyzes [incident type]. Here's a sample incident: [show input]"
2. "I'll run it now..." [execute]
3. "The recon agent identified these IOCs..." [point to output]
4. "The analysis agent correlated them with MITRE ATT&CK..." [show correlation]
5. "The final report shows [key finding]."
6. "It ran in X seconds and cost $Y."
```

---

## Day 2 — Demo, Defend, Reflect

### Presentation Schedule

Teams present in sequence (~15 min each). Audience: full class + faculty.

**Audience responsibilities:**
- Take notes on one thing each team did well
- Take one question to ask in Q&A
- Complete the peer feedback form during or immediately after each presentation

### Peer Feedback Form

For each presentation, complete:
```
Team: _______________
Problem: _______________

Technical depth (1-5): ___
- Did the Assessment Stack justification make sense?
- Was the architecture decision rationale clear?

Security rigor (1-5): ___
- Did the red team findings feel thorough?
- Were the defenses appropriate to the attacks?

Demo effectiveness (1-5): ___
- Did the demo show the tool working on a real scenario?
- Was the output clearly explained?

AIUC-1 coverage (1-5): ___
- Were all six domains addressed?
- Was the evidence for each domain concrete?

One thing that was especially strong:

One specific suggestion for improvement:
```

### Q&A Guidance

Good questions to ask (model them for your peers):
- "You used Sonnet for the analysis agent — did you test with Haiku? What was the quality difference?"
- "Your ARR was 85% — what was the 15% that still got through, and what was your decision to accept that risk?"
- "Which AIUC-1 domain was hardest to implement, and what did you compromise on?"
- "How does your tool handle the case where the threat intel API is down?"

Avoid questions that are just re-stating what was presented. The best Q&A surfaces things the presenter didn't fully address.

### Post-Presentation Reflection

After all presentations are complete, individual written reflection (due within 48 hours):

**500-word reflection addressing:**
1. What was the highest-leverage change you made between Week 11 and Week 15 — not the most work, but the one that improved the tool the most?
2. Which framework from the course (CCT, Assessment Stack, AIUC-1, V&V, PeaRL) proved most useful in practice, and why?
3. What would you want from Semester 2 given what you now know from building a real prototype through to hardening?

---

## Deliverables

**Before Day 2 (submit by start of class):**
1. **Slide deck** (12-15 slides, all required content present)
2. **Final metrics.json** — complete across all sprint and optimization phases
3. **AIUC-1 certification readiness checklist** — final version from Week 15
4. **Final Assessment Stack justification table**
5. **V&V documentation package** — test evidence, red team logs, ARR measurements
6. **Container scan results** — Trivy output from Week 15

**After Day 2 (due within 48 hours):**
7. **Individual reflection** (500 words)
8. **Peer feedback forms** — completed for all teams you watched
9. **Context library final structure** — documented directory of prompts, patterns, governance templates, and architecture patterns built during the semester

---

## AIUC-1 Integration

**Full framework synthesis:** Week 16 is where AIUC-1 stops being a checklist and becomes a professional standard. The certification readiness document is the first time students produce evidence of compliance rather than just claiming it.

**Accountability chain:** Part of the Week 16 reflection is identifying the accountability chain for your prototype: "Who is responsible when this tool makes a wrong call?" This is Domain E applied at the organizational level, not just the technical level.

> **📚 Study With Claude:** Before your presentation, open Claude Chat and ask:
> - "I built a [describe your capstone system]. I need to present it in 15 minutes to a mixed audience of technical peers and non-technical evaluators. Help me: 1) What's the right ratio of technical depth vs. business impact for this audience? 2) How do I explain my multi-agent architecture without losing non-technical listeners? 3) What's the best way to present threat model findings and AIUC-1 compliance to a mixed audience? 4) What questions should I expect and how should I prepare for them?"
> - Use Claude to stress-test your architecture: "Here's my system architecture: [describe it]. Play the role of a skeptical reviewer. Ask me the hardest questions you can think of about this design. Challenge my assumptions."

---

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.

---

## V&V Lens

**The full V&V lifecycle:** Week 16 closes the V&V cycle started in Week 1.
- Week 1: "Verify what the AI tells you" (light touch)
- Week 6: Skill outputs verified against spec
- Week 8: Audited against AIUC-1 framework
- Weeks 11-12: Sprint V&V against success criteria
- Weeks 13-14: Adversarial V&V under attack
- Week 15: Deployment V&V (supply chain, container scanning)
- Week 16: V&V documentation as a deliverable

A tool without V&V documentation is not production-ready. The Week 16 presentations demonstrate that every team's tool has been verified and validated, not just built and hoped to work.

---

## The Semester 1 → Semester 2 Bridge

Semester 2 starts where Semester 1 ends. You arrive at Semester 2 having:
- Built and shipped a real security tool
- Applied every AIUC-1 domain with evidence
- Survived red teaming and implemented defenses
- Containerized and hardened for production
- Internalized the Engineering Assessment Stack across 16 weeks of decisions

Semester 2 assumes all of this. It doesn't re-teach Docker basics, MCP fundamentals, or AIUC-1 introduction. It builds on what you built this semester:

- Weeks 1-4: Advanced multi-agent engineering (deeper SDK, comparative frameworks, optimization)
- Weeks 5-8: Advanced red team/blue team + autonomous wargame
- Weeks 9-12: Production security engineering (supply chain deep, NHI governance, observability)
- Weeks 13-16: Capstone with full AIUC-1 certification and Assessment Stack documentation

The context library you built in Semester 1 is your starting point. Every pattern, every governance template, every architecture decision — they're your foundation for Semester 2 complexity.

---

## Lab Updates (PR 4)

The following additions were made to `docs/lab-s1-unit4.html` for Week 16:

- **Knowledge Check — Week 16:** Two quiz questions added at the end of Week 16 covering production readiness (what it means for an AI system to handle failure gracefully) and applying the production engineer mindset to presentations (identifying failure modes and preparing contingencies).
- **Pre-Landing AI Checklist Preview callout:** A `callout-key` added after the "Pre-landing AI checklist: all 7 items reviewed" ship step. Lists the 7 items that the full checklist (developed in Unit 7) requires: AIUC-1 governance audit, MASS security scan, agent identity/allowance profiles, structured logging and tracing, red team report, cost caps and circuit breakers, and human escalation paths tested.

---

## Presentation Checklist: Production Readiness Evidence

Include in your Week 16 presentation:

1. **`/check-prod-readiness` clean report** — screenshot or paste of READY or CONDITIONAL status with findings documented
2. **Anti-pattern journey** — which patterns were found across Weeks 3-15, which were fixed, which remain as documented risk
3. **Three-evaluator pipeline summary** — findings from `/code-review`, `/check-prod-readiness`, and `/audit-aiuc1` side by side

The clean report is evidence that your tool is not just functional but production-survivable. This distinction — between "it works in my terminal" and "it will work at 3am under load during an incident" — is what separates a prototype from a production system.

> Your presentation should answer: "If we deployed this today, what would break first?" If the answer is "nothing on our `/check-prod-readiness` report," that is your evidence.
