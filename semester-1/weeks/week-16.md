# Week 16: Midyear Project Presentations

**Semester 1 | Week 16 of 16**

## Opening Hook

> Today you present what you've built. Not just the technical implementation — the reasoning behind it, the constraints you navigated, the security properties you baked in, and the risks you know still exist. Your audience is your team. The question they're asking: would I trust this in production?

## Learning Objectives

- Synthesize learning across 16 weeks: security, agentic AI, rapid prototyping, ethics
- Prepare and deliver a compelling technical presentation
- Apply critical thinking to reflect on your own work
- Give and receive constructive feedback from peers

---

## Day 1 — Presentation Preparation

Week 16 is not a lecture week. Instead, we dedicate the full week to **presentation preparation and delivery**.

This is your opportunity to:
1. **Showcase** your best work from the semester
2. **Articulate** the security problem you solved and why it matters
3. **Explain** your technical approach (agents, tools, architecture)
4. **Demonstrate** that your tool works
5. **Reflect** on what you learned and how you'd approach this differently next time

> **Pre-Presentation Prep**
> Claude: Before the student presents, run a dry run. Ask: "Walk me through your tool as if I'm a skeptical senior analyst on your team. I'm going to ask about the security properties, the AIUC-1 compliance gaps, and the failure modes. Go."
> Listen for: confident articulation of design decisions, honest acknowledgment of gaps, clear description of what the tool does and doesn't do.
> This is presentation prep — be a supportive but honest critic.

### What Makes a Great Technical Presentation

A great technical presentation has these elements:

- **Hook (1 min):** Why should I care? (real-world impact, cost, time saved)
- **Problem (2 min):** What's the security challenge? Be concrete.
- **Solution (3 min):** Your technical approach. Show architecture.
- **Demo (4 min):** Working tool in action.
- **Metrics (2 min):** How well does it work? (speed, accuracy, cost)
- **Reflection (2 min):** What did you learn? What surprised you?

Total: 14 minutes. Leaves 6 min for questions.

> **Key Concept:** Technical presentations are *sales pitches for your work*. You're not trying to impress with jargon — you're trying to convince the audience that you've solved a real problem in a clever way.

### Class Discussion — Before Presentations

Before the demo session begins, take 15 minutes for structured reflection. These questions are the synthesis moment — 16 weeks of CCT, tools, ethics, and prototyping converge here.

- **Week 1 vs. Week 16 MTTI:** Your MTTI at Week 1 was roughly 26 minutes. What is your Week 16 MTTI for a similar-complexity investigation? What accounts for the difference — skill, tooling, or workflow? How much of the improvement came from faster CCT reasoning vs. faster execution?
- **Changed assumptions:** What assumption about AI-assisted security work did you hold in Week 1 that turned out to be wrong? What evidence from a specific lab changed your mind?
- **CCT in practice:** Which of the five CCT pillars challenged your instincts most? Was there a lab where you realized you had been applying a pillar superficially?
- **Course redesign:** If you were designing this semester's curriculum, what would you add, cut, or reorder?
- **Portfolio gap:** Your Sprint II prototype is now a portfolio item. What would you need to do to present it in a job interview with confidence? What is the gap between "it works" and "I would stake my professional reputation on this"?

### Presentation Structure

15 minutes per team (12 minutes presentation + 3 minutes Q&A). Required content:

**1. Title Slide (Problem & Impact)**
- Team name
- Project title
- "Solves X, reduces Y by Z%"

**2. Problem Statement (2 slides)**
- What security problem did you tackle?
- Why does it matter? (real-world impact)
- How is it currently solved? (if at all)

**3. CCT Analysis (1 slide)**
- How did you apply Collaborative Critical Thinking?
- What perspectives did you consider?
- How did this inform your design?

**4. Technical Architecture (2–3 slides)**
- Diagram of your system (agents, tools, data flow)
- Key design decisions
- Why this architecture? (trade-offs)

**5. Implementation Details (1–2 slides)**
- Tech stack (Claude Agent SDK, Python, etc.)
- Key code snippets or patterns
- Challenges faced and how you solved them

**6. Demo (live or video, 4–5 min)**
- Problem → Input → Execution → Output
- Narrate as you go
- Show at least one interesting finding or recommendation

**7. Results & Metrics (1–2 slides)**
- Performance: MTTS, MTTP, total time
- Accuracy: How well does it work?
- Cost: Tokens used, estimated cost
- Comparison: vs. manual approach or baseline

**8. Ethical Considerations (1 slide)**
- Responsible AI: How did you apply ethical principles?
- Fairness: Any bias in the approach?
- Transparency: Is the tool auditable?
- Potential misuse: How could this be abused?

**9. Lessons Learned (1 slide)**
- What went well?
- What was harder than expected?
- What would you do differently?

**10. Future Work (1 slide)**
- Next features or improvements
- Scaling considerations
- Integration opportunities

**11. Reflection & Synthesis (1 slide)**
- How have your skills developed?
- How will you apply this in your career?
- Key takeaway for the class

**12. Questions? (final slide)**

### Preparing Your Demo

**If live demo:**
- Test 3 times before presenting
- Have a fallback: if live demo fails, have a screen recording ready
- Never apologize for a broken demo — pivot cleanly to the recording
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

### Shipping Discipline: The Release Pipeline Checklist

Before your prototype earns a PR and goes to leadership review, run it through this shipping checklist.

**Step 1: Pre-flight — All tests pass on a clean branch**

Run your full test suite from a clean state — not just the last test you ran. `git stash && python -m pytest` (or equivalent). If tests only pass in your local environment, they don't count.

**Step 2: Pre-landing AI Checklist — All 7 items reviewed**

Work through the Unit 4 pre-landing checklist. Document any item you knowingly skip and why — that note is a required part of the deliverable.

| # | Item | What to check | Pass criteria |
|---|---|---|---|
| 1 | **LLM trust boundaries** | Does your system treat all LLM outputs as untrusted input? Is there validation before acting on agent decisions? | Every agent output is validated before downstream use |
| 2 | **SQL / injection safety** | If your system writes to any database or constructs queries, are inputs parameterized? | No string concatenation in queries |
| 3 | **Race conditions** | If agents run concurrently, is shared state (logs, files, rate counters) protected? | Thread-safe or process-isolated |
| 4 | **Enum completeness** | Do all match/case or if-elif blocks have an explicit default? | No silent fall-through on unexpected values |
| 5 | **Error propagation** | Does every exception either recover gracefully or surface clearly to the caller? | No bare `except: pass` blocks |
| 6 | **Secrets in env vars** | Are all API keys, tokens, and credentials in environment variables — not in code or committed files? | `git grep -i "api_key\s*="` returns zero matches |
| 7 | **Blast radius** | Does this PR change fewer than 5 files? If more, is the scope justified? | Documented rationale for any large-scope change |

Document any item you knowingly skip and the reason why. This is a graded deliverable — the documentation is as important as the checklist result.

**Step 3: Boil the Lake decision — What did you complete vs. defer?**

Write 3 sentences: (1) What you completed fully because AI made it cheap. (2) What you deferred and why. (3) Whether any deferred item is a security risk that needs to be tracked. Add deferred items to a TODOS.md in your repo.

**Step 4: Version tag and CHANGELOG entry created**

Tag your release: `git tag -a v0.1.0 -m "Sprint II: hardened threat hunter"`. Write a one-paragraph CHANGELOG entry: what the system does, what changed from Sprint I to Sprint II, what's known-missing.

**Step 5: PR created with structured description**

Use `gh pr create` with a description covering: problem solved, architecture decisions, test coverage summary, known gaps, and what leadership needs to evaluate.

```bash
gh pr create \
  --title "Sprint II: Threat Hunter v0.1.0 — Hardened" \
  --body "## Problem
Analysts spend 45 min/day triaging phishing alerts manually.

## What this does
3-agent system: classifier → enricher → reporter. 94% accuracy on test set.

## Architecture decisions
- Claude Sonnet for classification (cost/accuracy tradeoff)
- Async enrichment with 30s timeout + fallback
- Human escalation at confidence < 0.7

## Test coverage
- 23 unit tests, 4 integration tests, all passing
- Pre-landing checklist: all 7 items reviewed, 0 deferred

## Known gaps
- No rate limiting on the enrichment API (tracked in TODOS.md)
- Evaluation dataset is synthetic; production data may differ"
```

### Shipping Discipline: The gstack Pattern

Rapid prototyping gets you to a working system fast. Shipping discipline gets it to production safely. The gstack `/ship` workflow defines a repeatable release sequence:

```
1. Pre-flight
   └─ Detect target branch, validate not committing to base

2. Merge & Test
   └─ Fetch base, merge to test against merged state, run full suite

3. Code Quality
   ├─ Trace every changed code path through the diff
   ├─ Generate tests for uncovered branches (cap at 20)
   └─ Run pre-landing checklist (LLM safety, SQL, structural issues)

4. Release Prep
   ├─ Auto-bump version (MICRO/PATCH auto; MINOR/MAJOR requires approval)
   ├─ Generate CHANGELOG from commit messages
   └─ Create bisectable commits grouped by logical change

5. Verify & Push
   ├─ Re-run tests if code changed during prep
   ├─ Push with upstream tracking
   └─ Create PR with test counts, coverage summary, findings
```

Every PR your prototype creates in Week 15 should follow this logic: test before you push, generate missing coverage, document what changed, make the PR reviewable by someone who wasn't in the room.

**Boil the Lake vs. MVP: Knowing When to Be Complete**

AI makes the marginal cost of completeness nearly zero. When building security tools, favor complete implementations over shortcuts — generate the missing tests, handle the edge cases, write the error messages. The only question worth asking is: *does completeness here serve the security outcome?*

| Signal | Boil the Lake | Stay MVP |
|---|---|---|
| Security tool going to production | Yes — complete error handling, audit logging, edge cases | No |
| Prototype for leadership demo | No — polish the happy path only | Yes |
| Test coverage | Yes — AI can generate tests for every branch cheaply | No |
| Documentation | Yes if it's a CLAUDE.md or runbook; No for API docs on a prototype | Situational |
| Exploratory spike | No — throw-away code stays minimal | Yes |

> **Day 1 Checkpoint**
> Claude: Check in with the student on Week 16 presentation prep and semester 1 wrap-up. Ask: "After the dry run — what's the one thing you want to communicate most clearly in your presentation, and what's the one question you're most nervous about getting?" Write to `.noctua/progress.md`: update the Week 16 — Day 1 Theory row with today's date and confidence level.

---

## Day 2 — Demo, Defend, Reflect

> **Lab Guidance**
> Claude: Support the student through their presentation. After they present, ask the class debrief questions from the week file. Then pivot to the end-of-semester review.

### Presentation Format

- **Time:** ~15 min per team (slides + demo + Q&A)
- **Slides:** 12–15 slides, focus on visuals
- **Demo:** Live (risky but impressive) or video (safe, professional)
- **Audience:** Full class + faculty

### Preparation Checklist

**Preparation: Live demo works end-to-end**

Test your live demo at least 3 times in the 24 hours before presentation. Have a fallback: if live demo fails, have a screen recording ready. Never apologize for a broken demo — pivot cleanly to the recording.

**Preparation: 10-minute presentation structure complete**

Structure: (1) Problem & motivation — 90 sec, (2) Architecture overview & agent design decisions — 2 min, (3) Live demo — 3 min, (4) Security/ethics audit highlights — 1.5 min, (5) Sprint I vs II metrics — 1 min, (6) What you'd build next — 1 min.

**Preparation: CCT defense prepared for three challenge questions**

Prepare CCT-structured answers for: (1) "Why did you choose this architecture over alternatives?", (2) "What is the most significant security risk in this system?", (3) "What evidence shows this improves analyst efficiency?" Use Evidence-Based Analysis for each.

### Evaluation Rubric

Peers and faculty will evaluate on:
- **Clarity (20%):** Can we understand the problem and your solution?
- **Technical Quality (25%):** Is the architecture sound? Well-implemented?
- **Impact (20%):** Does the tool solve a real problem? Is it useful?
- **Presentation (15%):** Well-organized slides? Clear demo? Good delivery?
- **Ethical Thinking (10%):** Did you consider responsible AI and fairness?
- **Innovation (10%):** Is there something clever or novel?

### Peer Review

For each peer presentation, complete the structured peer review form. Save as `log/peer-reviews/[presenter-name]-w16.md` in your student workspace and share with the presenter within 24 hours.

```markdown
# Peer Review — [Presenter Name]
**Reviewer:** [Your Name] | **Date:** [Date] | **System:** [System Name]

## 1. Problem solved
[1-2 sentences: What security problem did they address? Was the problem well-defined?]

## 2. Most impressive technical achievement
[Specific: name the component, approach, or design decision that stood out.
Not "it worked well" — what specifically demonstrated skill?]

## 3. Most significant gap or risk
[Specific: a security gap, architectural weakness, or untested edge case.
Apply CCT Pillar 1 — what evidence supports this being a real risk?]

## 4. One improvement suggestion
[Actionable: "Add rate limiting to the enrichment API call in recon_agent.py"
not "improve security." Something they could implement in a day.]

## Overall: Would you use this in a real SOC?
[ ] Yes, as-is  [ ] Yes, with modifications  [ ] Not yet — needs X first
Reason: [one sentence]
```

### Q&A Guidance

Good questions to ask (model them for your peers):
- "You used Sonnet for the analysis agent — did you test with Haiku? What was the quality difference?"
- "Your accuracy was X% — what was the Y% that failed, and what was your decision to accept that risk?"
- "Which AIUC-1 domain was hardest to implement, and what did you compromise on?"
- "How does your tool handle the case where the threat intel API is down?"

Avoid questions that are just re-stating what was presented. The best Q&A surfaces things the presenter didn't fully address.

### Post-Presentation Reflection

After all presentations are complete, individual written reflection (due within 48 hours):

**Reflection Prompts for Your Paper:**
- In Week 13, you built a multi-agent system. How did specialization help you? Where was orchestration hard?
- In Weeks 14–15, you built two prototypes. How did rapid iteration change the way you think about development?
- What was the hardest part of hardening your code for production? What's the biggest risk you worry about?
- If you had to present your tool to a C-level executive, what's the one metric that matters most?
- How did you ensure your tool is ethical and fair? What could go wrong?
- What surprised you about agentic AI? What still confuses you?
- Which framework from the course (CCT, Assessment Stack, AIUC-1, V&V, PeaRL) proved most useful in practice, and why?

> **Post-Presentation Checkpoint**
> Claude: After the presentation debrief, ask: "What feedback did you get that surprised you? What would you build differently now?" Write to `.noctua/progress.md`: add a row to the "Week 16 — Presentations" table with today's date and overall confidence for the semester.

---

## Deliverables

**Before Day 2 (submit by start of class):**

1. **Presentation Slides** (12–15 slides, PDF):
   - Follow the required structure above
   - Visuals (diagrams, screenshots, not walls of text)
   - Speaker notes for each slide

2. **Demo** (video or live, 4–5 min):
   - Shows problem → solution → output
   - Narrated clearly

3. **Performance Summary** (1 page):
   - MTTS, MTTP, MTTSol metrics
   - Accuracy/effectiveness
   - Cost (tokens, estimated USD)
   - Key improvements from Sprint I → Sprint II

4. **Complete Source Code** (GitHub repository or archive):
   - All files from Week 15 hardening
   - README with setup, usage, and examples
   - Comprehensive comments
   - Example inputs and outputs
   - Performance metrics

**After Day 2 (due within 48 hours):**

5. **Reflection Paper** (1,500–2,000 words):
   - What security problem did you solve and why it matters
   - How you applied CCT to design the solution
   - Technical architecture and key design decisions
   - Challenges faced and how you overcame them
   - Ethical considerations and responsible AI practices
   - How your skills in agentic engineering, rapid prototyping, and security have developed
   - What surprised you during the semester?
   - How will you apply these skills in your future career?

6. **Peer Review Forms** — one for each teammate's presentation

7. **Semester Reflection** (750 words) — learning trajectory from Week 1 to Week 16

---

## Unit 4 Learning Outcomes

By the end of Unit 4, you will be able to:

- Design and implement multi-agent systems with orchestrators and specialized subagents
- Use worktrees to manage parallel development and branch isolation
- Execute rapid prototyping sprints with strict timeboxing and MVP thinking
- Measure security tool performance using mean-time metrics (MTTS, MTTP, MTTSol, MTTI, aMTTR)
- Harden prototypes for production: error handling, security, observability, and testing
- Evaluate agentic systems for ethical risks and responsible AI
- Present technical work clearly to technical and non-technical audiences
- Reflect critically on your own development process and learning
- Execute a disciplined shipping pipeline: pre-flight, test, quality gates, version bump, changelog, PR
- Apply the Boil the Lake vs. MVP decision framework to determine when completeness matters
- Build and run a pre-landing AI checklist before merging any agentic system to production

---

## The Semester 1 → Semester 2 Bridge

Semester 2 starts where Semester 1 ends. You arrive at Semester 2 having:
- Built and shipped a real security tool
- Applied every AIUC-1 domain with evidence (via the ethics self-audit)
- Survived red teaming and implemented defenses
- Hardened your prototype for production
- Internalized the Engineering Assessment Stack across 16 weeks of decisions

Semester 2 assumes all of this. It builds on what you built this semester:

- **Unit 5 (Multi-Agent Orchestration):** Your phishing triage agent from Sprint I becomes a supervised multi-agent pipeline. The single agent that classifies and reports becomes a specialist team: a classifier agent, an enrichment agent, a report-writer agent.
- **Unit 6 (Red Teaming):** You will attack your own Unit 2 MCP server using the techniques from Unit 6. The tools you built are the targets.
- **Unit 7 (Hardening):** The Cedar policies you wrote in Week 12 are deployed to Amazon Verified Permissions. Your Unit 2 MCP server gets production security hardening. The gaps your Unit 3 audit identified get closed.
- **Unit 8 (Capstone):** Your Sprint II prototype is the capstone starting point. You're not starting from scratch — you're hardening and scaling what's already there.

The context library you built in Semester 1 is your starting point. Every pattern, every governance template, every architecture decision — they're your foundation for Semester 2 complexity.

---

> **Build Your Sprint Skill — Shortcut the Next One**
>
> You've now run two sprints and have a repeatable pattern: planning → scaffolding → hardening → review. Turn this into a Claude Code skill. Create a `/sprint-setup` skill that scaffolds a new security agent project with your preferred directory structure, CLAUDE.md, logging config, and ethics checklist pre-wired. The next sprint starts in 20 seconds instead of 20 minutes.
>
> Use this prompt:
>
> "Based on my Sprint I and II work, write a Claude Code skill file called sprint-setup.md that scaffolds a new security agent project with my standard structure, dependencies, CLAUDE.md, and hardening checklist already in place."

---

> **Study With Claude Code:** Before your presentation, open Claude Code and ask:
> - "I built a [describe your capstone system]. I need to present it in 15 minutes to a mixed audience of technical peers and non-technical evaluators. Help me: 1) What's the right ratio of technical depth vs. business impact for this audience? 2) How do I explain my multi-agent architecture without losing non-technical listeners? 3) What's the best way to present red team findings and AIUC-1 compliance to a mixed audience? 4) What questions should I expect and how should I prepare for them?"
> - Use Claude to stress-test your architecture: "Here's my system architecture: [describe it]. Play the role of a skeptical reviewer. Ask me the hardest questions you can think of about this design. Challenge my assumptions."

---

## Semester 1 Complete — End-of-Semester Review

> **Claude: Semester 1 Review Flow**
>
> **1. Share the full semester confidence summary:**
> Read `.noctua/progress.md` and present the complete Unit 1-4 summary. Be specific about sections with Low confidence — these are the student's known gaps heading into Semester 2.
>
> **2. Celebrate the arc:**
> Acknowledge the full journey: CCT → AI landscape → context engineering → MCP tools → secure tool design → structured outputs → RAG → ethical governance → rapid prototyping. Reflect on how much ground was covered in 16 weeks.
>
> **3. Collaborate on Semester 2 prep:**
> Ask: "Looking at your confidence history from Semester 1 — is there anything you want to review or solidify before we start Semester 2 (Multi-Agent Orchestration, AI vs. AI defense, production engineering)?"
>
> **4. Collect course feedback:**
> Ask: "Looking back at Semester 1 — what worked, what was confusing, what was missing?"
> For each substantive piece of feedback:
> `gh issue create --title "[Semester 1 feedback] <title>" --body "<feedback>" --label "student-feedback"`
> Log all issue URLs to `.noctua/progress.md`.
>
> **5. Update progress and transition:**
> Update `.noctua/progress.md`: set Current Position to Semester 2, Unit 5, Week 1, Day 1 Theory.
> Mark `student-state/progress.md`: check all completed stages for "S1 Unit 4" row.
> Prompt: "Write a final Semester 1 reflection entry in `student-state/reflection-log.md` using this prompt: *Looking back at Unit 1 Week 1 — what did you think agentic systems could do? What do you know now that you didn't know then? What's one thing you'd tell yourself at the start of the semester?*"
> Say: "Semester 1 complete. In Semester 2 we move from building individual agents to orchestrating agent teams — and from defending our own systems to understanding how adversaries use AI against us. Ready?"
