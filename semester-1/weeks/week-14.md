# Week 14: Rapid Prototyping Sprint I — From Concept to Demo in 3 Hours

**Semester 1 | Week 14 of 16**

## Learning Objectives

- Understand rapid prototyping methodology: MVP design, timeboxing, and iteration cycles
- Apply Collaborative Critical Thinking (CCT) to scope security problems quickly
- Measure security tools using mean-time metrics (MTTS, MTTP, MTTSol, MTTI, aMTTR)
- Identify when a prototype is "done enough" to ship
- Accelerate delivery by ruthlessly eliminating non-essential features

---

## Day 1 — Theory & Foundations

### Rapid Prototyping Methodology

Three hours. That's your timeline to go from "we have a problem" to "here's a working solution." This is not a thought experiment — it's a real methodology used in modern incident response, threat hunting teams, and startup security. The key: **ruthless prioritization**.

In a 110-minute sprint, you have roughly:
- 15 minutes to understand the problem (CCT)
- 15 minutes to design the solution
- 60 minutes to build
- 15 minutes to test and iterate
- 10 minutes to prepare a demo

This forces clarity. You cannot afford ambiguity. You cannot afford gold-plating. You build exactly what solves the problem — nothing more.

**Case Study: Real-World Fast Prototyping**

Incident response teams don't wait for a polished, feature-complete tool before engaging a breach. The field approach is to deploy the minimal capability that answers the immediate question — "Is this system compromised?" — and iterate from there. Speed saves lives (or millions in remediation costs). The same discipline applies to prototyping: build what answers the question, measure, then harden.

Your Week 14 sprint mirrors this: get a working tool in 3 hours, measure its effectiveness, and move to iteration (Week 15) or production deployment.

### Scope Management with CCT

Collaborative Critical Thinking (from Unit 1) is your secret weapon for fast scoping:

1. **Evidence-Based Problem Definition:** Don't assume what the problem is. Ask: "What evidence do we have?" If the problem statement is "build a threat hunter," that's too vague. If it's "we need to detect lateral movement in cloud infrastructure based on unusual IAM API calls," that's concrete.

2. **Diverse Perspectives:** In a 3-hour sprint, get input from 2–3 perspectives quickly. DevOps person: "What data do you have access to?" Analyst: "What would we act on?" This prevents building a cool tool that nobody can actually use.

3. **Success Criteria:** Before designing, write down 3–5 measurable criteria:
   - Detects 80% of test cases (coverage)
   - Runs in under 5 seconds per query (performance)
   - Zero false positives on clean data (precision)
   - Integrates with Splunk API (integration)

Once you have criteria, design and build toward them.

> **Key Concept:** The best prototype is the one that runs and answers the question, not the most architecturally elegant one. A tool that works in 3 hours and gets 80% accuracy is infinitely better than a beautiful design that's 60% complete.

### Finding Your Leverage Points

When scoping your 3-hour sprint, don't waste time optimizing every part equally. The **12 Leverage Points** framework from Agentic Engineering practice identifies where small changes produce outsized improvements. In a security context:

- **High Leverage:** Improving the system prompt (how clearly you specify the agent's role), choosing the right model size for the task, adding one critical tool that was missing
- **Medium Leverage:** Fine-tuning parameters, optimizing data flow between subagents
- **Low Leverage:** Code style, UI polish, comprehensive error messages (defer to Week 15)

In your 60-minute build window, spend 50 minutes on high-leverage improvements and 10 minutes on essentials. This is how you get 80% of the value in 20% of the time.

> **Further Reading:** See the Agentic Engineering additional reading on foundations and the 12 Leverage Points for how to systematically identify where to focus effort in any agentic system. Understanding leverage is what separates fast prototypers from those who get stuck.

### MVP Design Thinking

MVP = Minimum Viable Product. It's the smallest, simplest version that solves the core problem.

Example: "Build a vulnerability scanner for cloud infrastructure."

What's the MVP?
- Query a single cloud provider (AWS, not AWS + Azure + GCP)
- Check one vulnerability class (unencrypted storage, not all OWASP categories)
- Output a simple list (IP, finding, severity), not a full report
- No authentication hardening yet (that's Week 15)

The MVP is 10x faster to build and gets 80% of the value.

### The Think → Spec → Build → Retro Cycle

This 3-hour sprint implements the **Think → Spec → Build → Retro** cycle, powered by four Claude Code skills:

1. **Think (~15 min):** Use `/think` to critically analyze the problem, surface assumptions, identify risks, and consider alternatives before writing any spec.
2. **Spec (~20 min):** Use `/build-spec` to produce a formal architecture document with agent role definitions, tool schemas, and success criteria before building.
3. **Build (~50 min):** Use Claude Code and `/worktree-setup` to implement the agent and tools rapidly in an isolated git worktree. Cut anything that doesn't directly serve the specification.
4. **Retro (~15 min):** Use `/retro` to review what was built against the spec, capture what worked, what didn't, and what to carry into the next cycle.

This cycle repeats every sprint. Week 14 is your first Think → Spec → Build → Retro cycle. Week 15 iterates on failures. By the capstone (Unit 8), you're running multiple cycles per week.

> **Further Reading:** See the Agentic Engineering additional reading on rapid iteration patterns for coverage of orchestration patterns that compress development timelines.

> **The Generator/Evaluator Loop — Build Is Not One Pass**
>
> Your sprint cycle is an iterative loop, not a single pass. Anthropic's engineering team formalizes this as a **generator/evaluator pattern**: a generator agent produces output, a separate evaluator agent grades it against explicit criteria, and feedback flows back to the generator for refinement.
>
> 1. **Generate:** Build the tool (`/build-spec` → plan → build)
> 2. **Evaluate:** Run the evaluator (`/code-review` + `/audit-aiuc1`) against explicit criteria
> 3. **Decide:** Based on evaluation feedback — if scores are trending up, refine the current approach; if scores are plateauing or declining, pivot to a different approach entirely
> 4. **Iterate:** Return to step 1 with evaluation feedback as input
> 5. **Converge:** Stop when evaluation criteria are met OR iteration cap reached (failure cap pattern)
>
> Anthropic's team runs 5–15 iterations for frontend design and 2–3 QA rounds for full-stack applications. Each iteration costs tokens — track with `/cost` and set an iteration cap as a governance guardrail. *Source: Anthropic Engineering, "Harness design for long-running application development," March 2026.*

> **Harness Complexity Is a Snapshot, Not a Constant**
>
> Every component in your harness encodes an assumption about what the model can't do on its own. Those assumptions expire as models improve. Anthropic found that Opus 4.5 needed sprint decomposition — breaking work into small chunks — to maintain coherence across long sessions. Opus 4.6 handles multi-hour sessions natively, making that scaffolding unnecessary overhead.
>
> **Practical rule — after each model upgrade, review your harness:**
> 1. List every scaffolding component (sprint contracts, context resets, forced tool selection, explicit step ordering)
> 2. For each component: "Does the new model still need this?"
> 3. Test by removing one component and comparing output quality
> 4. Remove components the model now handles natively; keep components where removal degrades output
>
> This applies to your course skills too: does `/build-spec` need to be as prescriptive with Opus 4.6? Do your failure caps need to be as tight? The goal is the minimum harness that produces required quality. *Source: Anthropic Engineering, "Harness design for long-running application development," March 2026.*

### The Prototype-to-Production Delivery Pipeline

As you move through Unit 4 and into Units 7–8, understand the full delivery pipeline:

1. **Rapid Prototype (Week 14):** Build fast, validate the concept. Success = "does it answer the core question?" And containerize from Day 1.
2. **Leadership Evaluation (Week 14 demo):** Present to instructors/stakeholders. They decide: "Is this worth hardening?"
3. **Production Hardening (Week 15):** If selected, immediately accelerate into production-ready code: error handling, security validation, observability, deployment docs.
4. **Deployment/Delivery (Units 7–8):** The hardened tool goes into production security operations with security gates and IaC.

The key insight: **Don't waste time hardening prototypes that won't be used.** Rapid prototyping identifies which ideas have merit. Only prototypes that leadership selects move to hardening.

> **Key Concept:** **Containerize from Day 1.** The moment you write your first line of code, wrap it in a Dockerfile and docker-compose.yml. This means the path from your laptop to production is already paved. When leadership selects your prototype for delivery, you're not rewriting for containers — you're adding security gates (pre-commit hooks, build scanning), IaC (CloudFormation/Terraform for ECS), and observability. Containerization from Day 1 eliminates the "containerize for production" bottleneck that derails most projects.

### Prototyping vs. Production Architecture: The API-First Pattern

When rapidly prototyping (Week 14), it's OK to build the MCP server directly — speed matters more than architectural elegance. Your goal is to answer "Does this approach work?"

But here's the critical insight: **when your prototype is selected for production (Week 15+), immediately refactor to the API-first pattern.**

**Week 14 Prototype (Fast):**

```
Claude Agent → MCP Server → Direct database access
(Tightly coupled, but answers the question quickly)
```

**Week 15+ Production (Hardened):**

```
Claude Agent → MCP Server → FastAPI Backend → Database
(Properly decoupled, ready for ECS deployment)
```

**Why the refactor matters:** A prototype might call a database directly from the MCP server. That works for testing. But when you containerize for production, you need:
- **Authentication at the API boundary** (not in the MCP server)
- **Rate limiting** on the service (not in the agent)
- **Audit logging** on the REST endpoints
- **Multiple consumers** (same API serves dashboard, CLI tools, CI/CD pipelines)
- **Testability** (hit the API directly without needing an agent)

### The Five Metrics for Security Tools

When you build a security tool, measure yourself against these:

1. **MTTS — Mean Time To Spot/Triage:** How long from alert to "we understand what this is?"
   - Example: Recon subagent identifies malicious IP in 4.2 seconds
   - In a sprint: Can your prototype identify the threat in < 10 sec?

2. **MTTP — Mean Time To Protect:** How long from understanding to taking protective action?
   - Example: Isolate compromised server, revoke credentials, block IP
   - In a sprint: Can your prototype suggest a remediation? (Even if it's not automated)

3. **MTTSol — Mean Time To Solve:** Full resolution
   - Example: Threat removed, system hardened, new monitoring in place
   - In a sprint: Not always achievable; aim for MTTS + MTTP

4. **MTTI — Mean Time To Isolate:** How long to stop lateral movement?
   - Critical metric for ransomware, APTs
   - In a sprint: Does your tool enable rapid isolation?

5. **aMTTR — Augmented Mean Time To Respond:** Overall metric including human review
   - Realistic: MTTS + time for analyst review + MTTP
   - Target for sprint: Under 15 minutes for a basic alert

### Time-Waster Antipatterns

Avoid these common sprint killers:

| Antipattern | Cost | Fix |
|---|---|---|
| **Perfectionism** | "Let's make the UI gorgeous" | UI comes Week 15. CLI is fine now. |
| **Over-generalization** | "Let's make it work for 10 use cases" | Pick one use case. Iterate later. |
| **Scope creep** | "While we're at it, add authentication" | Note it, defer to Week 15. |
| **Architecture paralysis** | "Let's debate frameworks for 20 min" | Pick one framework, move on. |
| **Testing obsession** | "We need 100 unit tests" | One happy path + one failure case. Ship it. |

A hard truth: **the best code written in a sprint is "good enough" code, not perfect code.** Iterate from there.

> **Evaluation methodology matters as much as evaluation results.** A 5/5 pass rate means nothing if:
> - The test set was designed by the same person who wrote the spec
> - All 5 test cases were obvious, expected inputs (no adversarial cases)
> - No one else reviewed the test design before running it
>
> Minimum standards for sprint evaluation:
> 1. **Ground truth independence:** the evaluator should not be the sole spec author
> 2. **Adversarial test cases:** at least 2 of your test inputs should be designed to challenge the system, not confirm it works on expected inputs
> 3. **Declared methodology:** your evaluation section must state what you tested and, critically, what you did NOT test

> **Track two metrics, not one.** Most students track MTTP (Mean Time to Prototype) — time from "go" to working demo. Also track MTTS (Mean Time to Spec) — time from "go" to a written, signed-off spec. Why:
> - MTTP tells you how fast you execute
> - MTTS tells you how fast you make design decisions
> - If MTTP improves by compressing MTTS (skipping the spec to start building faster), you've traded evaluation validity for speed
>
> The spec phase should not be rushed. It is where security decisions are made.

---

## Day 2 — Hands-On Lab: Rapid Prototyping Sprint

### Lab Objectives

- Execute a complete 110-minute sprint: analysis → design → build → test → demo
- Deliver a working prototype (functional, not polished)
- Measure performance using security metrics
- Document process in a retrospective

### Sprint Format

Teams of 2–3 students, 110 minutes total. Each sprint is grounded in a real company context — not an abstract tool spec, but a specific organization with constraints, a user, and a measurable problem. Before you write a line of code, you need to understand who you're building for and what success looks like in their environment.

> **Practitioner framing:** In a real engagement, the sprint starts with a customer conversation, not a tool idea. "Build a threat hunter" is not a spec. "A mid-market retail company is seeing 300+ alerts per day with a 2-person SOC and a 4-hour MTTI — what's the one thing you'd build to move that number?" is a spec. Practice framing problems this way from Week 14 forward.

Example sprint problems (each comes with organizational context your instructor will brief):
- "Build an automated threat hunter that detects suspicious user behavior in cloud infrastructure" — *Context: 50-person fintech, cloud-native, no dedicated threat intel team*
- "Create a vulnerability assessment tool that correlates multiple sources of intelligence" — *Context: healthcare provider, HIPAA-scoped, slow change management, needs explainable output for compliance team*
- "Design a security policy compliance checker that audits infrastructure against NIST standards" — *Context: federal contractor, existing NIST CSF implementation, needs gap analysis against SP 800-53 Rev. 5*

### Step 0: AIUC-1 Pre-Check (Before Writing Code)

Run `/audit-aiuc1` on your planned system architecture. Focus on Domains B (Security), D (Reliability), and E (Accountability) at minimum. Save the output as `sprint1/aiuc1-precheck.md` — this is a graded deliverable.

Before writing a single line of code, answer these four questions and document them in `sprint1/aiuc1-precheck.md`:

1. **What data does this system process?** (Email content? Does it contain PII? Attachments?)
2. **Who is affected by a wrong decision?** (False positive = missed real threat reported to nobody. False negative = analyst alerted on legitimate email.)
3. **Which AIUC-1 domains are in scope?** (B: Security — does the system have access to security-sensitive data? D: Reliability — what happens when it's wrong? E: Accountability — who reviews its decisions?)
4. **What human oversight exists for high-severity outputs?** (Does a P1 classification auto-escalate, or does a human review first?)

> **Finding the skill:** The `/audit-aiuc1` skill was built in Unit 2 Week 6. If you haven't configured it yet, the skill file is at `.claude/skills/audit-aiuc1/SKILL.md`.

### Phase 1: Analysis (15 min) — What's the Real Problem?

Use CCT:

1. **Evidence-Based Definition** (5 min):
   - What's the concrete problem statement?
   - What data/signals are available?
   - Who is the user (analyst, DevOps, compliance officer)?

2. **Diverse Input** (5 min):
   - Talk to a teammate from a different background
   - What's missing from the problem statement?
   - What could go wrong?

3. **Success Criteria** (5 min):
   - Write down 3–5 measurable outcomes
   - Example: "Detects 80% of anomalies with < 5% false positives"
   - Example: "Runs in < 30 seconds per scan"

Record MTTS (Mean Time to Spec) when you have a validated strategy. Record: MTTS = ___ minutes from start.

**Output:** One-page problem analysis (shared document, all team members add notes)

### Phase 2: Design (15 min) — Sketch the Solution

Don't code yet. Outline:

1. **Architecture** (5 min):
   - Will you use Claude agents? Simple scripts? Existing APIs?
   - What data goes in? What comes out?
   - What's the critical path (what *must* work)?

2. **Tools/APIs** (3 min):
   - What external services will you use? (AWS API, threat intelligence DB, etc.)
   - Can you mock them if real APIs are slow?

3. **MVP Scope** (7 min):
   - What features are **required** for the MVP?
   - What's a "nice-to-have" for Week 15?
   - What's out of scope?

Write a one-page design document. Include a simple ASCII diagram.

**Example Design Document:**

```
# Threat Hunter MVP Design (15 min)

## Problem
Detect lateral movement in cloud infrastructure using IAM logs.

## Solution
Build a CLI tool that:
1. Reads IAM event logs (mocked: JSON file)
2. Identifies unusual API patterns (more than 10 unique APIs in 5 min window)
3. Flags suspicious behavior
4. Outputs: JSON list of anomalies

## Architecture
User
  ↓
CLI (Python, argparse)
  ↓
CloudAnalyzer (Claude Agent)
  ↓
JSON output → write to file

## Tools
- Python anthropic SDK
- Claude Opus 4.5 (reasoning)
- Mocked IAM data: data/iam_events.json

## MVP Scope
REQUIRED:
- Read IAM logs
- Detect anomalies (rule: >10 APIs in 5 min)
- Output JSON

DEFER TO WEEK 15:
- Integration with real AWS API
- Visualization
- Alert routing
- Performance optimization

## Success Criteria
- Run in < 10 seconds on 1000 events
- Detect injected anomalies (test case)
- Output valid JSON
```

> **Remember:** Your design doesn't need to be perfect. It needs to be *clear enough to code to*. You can change it during implementation.

### Phase 3: Implementation (60 min) — Build the MVP

> **Key Concept:** Use Claude Code as your pair programmer. You describe the architecture and requirements; Claude Code generates the scaffolding and implementation. Your job is to refine, test, and iterate — not to write perfect code from scratch.

**Containerizing Your Prototype: Docker from Day 1**

Create a `Dockerfile` in your project root:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy your code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run your tool (adjust entrypoint as needed)
ENTRYPOINT ["python", "-m", "threat_hunter"]
```

And a `docker-compose.yml` for local testing:

```yaml
version: '3.8'
services:
  threat-hunter:
    build: .
    volumes:
      - ./data:/data
      - ./output:/output
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    command: >
      python -m threat_hunter
      --input /data/iam_events.json
      --output /output/report.json
```

**Local Testing:** `docker-compose up` — your prototype runs in a container exactly as it will in production.

**Claude Code Prompt for Threat Hunter MVP:**

```
I'm building a threat hunter tool for detecting lateral movement in cloud IAM logs.

Requirements:
1. CLI tool: `python threat_hunter.py <path_to_iam_events.json>`
2. Load IAM events from JSON file
3. Use Claude Opus 4.6 to analyze events for suspicious patterns:
   - Spike: >10 unique APIs in 5 minutes
   - Unusual access: security tools accessing data storage
   - Brute force: failed attempts followed by success
4. Return a JSON report with anomalies (each has type, severity, description, affected_principal, confidence)
5. Save report to threat_report.json
6. Handle errors: missing file, invalid JSON, API failures

Show me working Python code with:
- Proper argparse CLI
- File loading with error handling
- Claude API integration
- JSON parsing from agent response (with fallback if parsing fails)
- Output to file and stdout
```

**Review Checklist After Implementation:**

After Claude Code generates the tool, test it:
- [ ] `python threat_hunter.py missing.json` → Graceful error message
- [ ] `python threat_hunter.py bad_data.json` (invalid JSON) → Error handling works
- [ ] `python threat_hunter.py normal_events.json` → Completes in < 10 seconds
- [ ] Output JSON is valid and has required fields
- [ ] Report file is written to threat_report.json

**During Implementation:**
- Use Claude Code to write and test incrementally
- Test your code as you go: do you have mock data? Run it!
- If something breaks, fix it quickly or skip it for Week 15
- Keep a list of deferred items (they become Week 15 tasks)

### Phase 4: Test & Iterate (15 min)

1. **Happy Path Test** (5 min): Run your tool on normal data. Does it complete?
2. **Failure Case** (5 min): Feed it bad data (malformed JSON, missing fields). Does it handle errors?
3. **Metrics** (5 min): How fast does it run? How many tokens? Does it meet success criteria from Phase 1?

Record timings:

```json
{
  "phase": "test",
  "test_case": "100 normal IAM events",
  "execution_time_sec": 3.4,
  "tokens_used": 892,
  "estimated_cost_usd": 0.018,
  "output_valid": true,
  "notes": "Detected 2 anomalies correctly"
}
```

Record MTTP when you have a working plan (the system does SOMETHING end-to-end). Record: MTTP = ___ minutes from start.

Record MTTSol when you have a working tested prototype. Create Sprint I metrics summary: MTTS / MTTP / MTTSol / Token Cost / Completion %.

> **Pro Tip:** If you're failing a success criterion by a small margin, don't spend 10 minutes optimizing. Note it and move to Week 15. The demo is next.

### Phase 5: Prepare Demo (10 min)

You have 2–3 minutes to show your prototype. Practice:

1. **Setup** (30 sec): Show your project structure (`ls -la`)
2. **Input** (30 sec): Show the test data/scenario
3. **Execution** (1 min): Run the tool, show output
4. **Results** (1 min): Highlight what it detected, explain the finding
5. **Closing** (10 sec): "In Week 15, we'll add [defer items]. Questions?"

Write a 5-minute demo script:
1. Problem statement (30s)
2. Live demo (3 min)
3. Value delivered and what's missing (1 min)
4. What you'd build in Sprint II (30s)

Record a video OR practice a live demo. Either way, time yourself.

> **Remember:** A working 3-hour prototype with an honest demo ("it works on the happy path, needs edge case handling") is better than a beautiful demo of incomplete work.

### Sprint I Exit Gate: Run `/check-antipatterns`

Before closing Sprint I, audit your prototype against the production anti-patterns. This is a required Sprint I deliverable — include the report output alongside your Sprint I metrics.

```bash
/check-antipatterns ~/noctua-labs/unit4/sprint1/

# Required: Zero CRITICAL findings to pass Sprint I
# Document: HIGH findings → deferred to Sprint II with justification
# Include: report output in Sprint I deliverables package
```

Requirement: zero CRITICAL findings. Document HIGH findings as deferred to Sprint II with written justification (what would need to change to fix each one).

---

## Deliverables

1. **Sprint I Prototype** — code repository with README, working end-to-end (even if incomplete):
   - Source code (all files, requirements.txt)
   - Dockerfile and docker-compose.yml
   - README with setup instructions (include: "To run locally: `docker-compose up`")
   - Example input data
   - Example output

2. **Submitted via GitHub PR:** Use `gh pr create --title "Prototype: Threat Hunter" --body "..."` to submit your prototype for leadership review. This mirrors the real DevSecOps workflow: code goes through PR review before evaluation.

3. **Sprint Retrospective** (1,000–1,500 words):
   - Problem statement (as refined after CCT)
   - MVP design choices (what you kept, what you deferred)
   - Build challenges (what was harder than expected?)
   - Performance metrics (time, tokens, accuracy against success criteria)
   - What went well
   - What would you do differently?
   - Deferred items for Week 15

4. **Demo** (video or live, 2–3 min):
   - Record your screen or practice live delivery
   - Show: problem → input → execution → output
   - Narrate as you go

5. **Sprint I Metrics** — MTTS, MTTP, MTTSol, token cost, and completion percentage:

```json
{
  "sprint_duration_min": 110,
  "problem": "Detect lateral movement in cloud logs",
  "success_criteria_met": "3 of 3",
  "execution_time_sec": 4.2,
  "tokens_used": 892,
  "estimated_cost_usd": 0.018,
  "lines_of_code": 120,
  "deferred_items": ["AWS API integration", "alert routing", "UI dashboard"]
}
```

6. **AIUC-1 Pre-Check** (`sprint1/aiuc1-precheck.md`) — the pre-check document from Step 0

7. **AI Methodology Note** — 100-word description of how Claude Code was used in the sprint

---

## Sources & Tools

- [Anthropic API Reference](https://docs.anthropic.com/en/api/messages)
- Rapid Prototyping Guide (see `frameworks.html`)
- *Sprint: How to Solve Big Problems and Test New Ideas in Just Five Days* by Jake Knapp (reference)
- Cloud IAM Security Patterns (see `reading.html`)

---

> **Study With Claude Code:** Open Claude Code and try:
> - "Quiz me on the key concepts from this week's material. Start easy, then get harder."
> - "I think I understand the Think → Spec → Build → Retro cycle but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common sprint antipatterns for security tool development? Do I have any of them?"
> - "Connect this week's rapid prototyping to what we learned in Weeks 1–13. How does the 12 Leverage Points framework apply to sprint scoping?"
