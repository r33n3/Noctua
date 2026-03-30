# Week 11: Rapid Prototyping Sprint I

**Semester 1 | Week 11 of 16**

## Learning Objectives

- Apply the Engineering Assessment Stack to drive architecture decisions from first principles
- Implement a working security tool prototype using the Think → Spec → Build → Retro cycle
- Bake AIUC-1 controls in from the start rather than adding them after
- Measure tool effectiveness using MTTS, MTTP, MTTSol, MTTI, aMTTR, and CPT (Cost Per Transaction)
- Containerize your prototype on Day 1 so the production path is already paved
- Use the CCT framework to scope problems under time pressure

---

## Day 1 — Theory

### The Sprint Methodology

Three hours. That's your timeline to go from "we have a problem" to "here's a working solution." This is not a thought experiment — it's the actual methodology used in incident response teams, threat hunting, and startup security. The key is ruthless prioritization.

In a 110-minute sprint, you have roughly:
- 15 minutes to understand the problem (CCT + Assessment Stack)
- 15 minutes to design the solution (Spec)
- 60 minutes to build
- 15 minutes to test and iterate
- 10 minutes to prepare a demo

This forces clarity. You cannot afford ambiguity or gold-plating. You build exactly what solves the problem — nothing more.

### The Think → Spec → Build → Retro Cycle

This sprint implements a four-phase cycle, each powered by a Claude Code skill:

**Think (~15 min):** Use `/think` to critically analyze the problem, surface assumptions, identify risks, and consider alternatives before writing any spec.

**Spec (~20 min):** Use `/spec` to produce a formal architecture document with agent role definitions, tool schemas, and success criteria before building.

**Build (~50 min):** Use Claude Code to implement the agent and tools rapidly in an isolated git worktree. Cut anything that doesn't directly serve the specification.

**Retro (~15 min):** Use `/retro` to review what was built against the spec, capture what worked, what didn't, and what to carry into the Week 12 hardening cycle.

This cycle repeats every sprint. Week 11 is your first complete Think → Spec → Build → Retro cycle. Week 12 iterates on the failures found here.

### Assessment Stack Drives Architecture

Before writing a single line of code, run the Assessment Stack against your problem:

**Layer 1 — Problem Type:** Is this classification, correlation, reasoning, generation, or retrieval? Most security tools span more than one — identify the *primary* type.

**Layer 2 — Computation Approach:** Is the core problem deterministic (rules, regex, exact match), statistical (classifiers, anomaly detection), or reasoning (novel situations, ambiguous evidence)?

**Layer 3 — Model Selection:** If reasoning is required:
- High-throughput routing/extraction → Haiku ($1/MTok)
- Operational analysis → Sonnet ($3/MTok)
- Deep attribution, novel scenarios → Opus ($5/MTok, invoke rarely)

**Layer 4 — Data Architecture:** Where does your data live? Exact lookup → relational. Semantic similarity → vector. Relationship traversal → graph. Trends → time series.

**Layer 5 — Integration Pattern:** Real-time MCP tool call vs. batch vs. agent-to-agent delegation.

**Layer 6 — Verification:** How will you confirm the output is correct? Test suite for deterministic tools, human review for reasoning outputs, cross-reference for factual claims.

Document your Assessment Stack decision as a table in your spec. This is a deliverable for Week 16.

### AIUC-1 Baked In from the Start

Unlike a prototype that adds governance after the fact, Sprint I builds controls in from Day 1. As you design:

**Domain B (Security):** Define input validation before you write the first tool. What can an attacker inject? What schema does your tool accept?

**Domain D (Reliability):** Design graceful degradation before you need it. What happens when an API times out? What's the fallback?

**Domain E (Accountability):** Add structured logging to your spec before building. What events must be logged? What's the minimum information needed to reconstruct a decision?

**Domain A (Data & Privacy):** What PII will your tool process? Can it be minimized?

Domains C (Safety) and F (Society) — for a prototype, the minimum is: "Does this tool take irreversible actions? If yes, add a human approval step."

### The Five Security Metrics

Measure yourself against these from the first run:

1. **MTTS — Mean Time to Suppress:** How long until the blast radius stops expanding?
2. **MTTP — Mean Time to Prevent:** How long until preventive measures are deployed?
3. **MTTSol — Mean Time to Solution:** Full resolution from detection to closure (often not achievable in a sprint — aim for MTTS + MTTP first)
4. **MTTI — Mean Time to Investigate:** How long to complete forensic and behavioral analysis?
5. **aMTTR — Adjusted Mean Time to Remediate:** Weighted metric accounting for incident severity; includes human review time.

**CPT — Cost Per Transaction:** How much does one invocation of your tool cost in API tokens? Calculate: `total_tokens * model_price / 1_000_000`. Track this for every model tier used.

Record these in a metrics JSON file as part of your deliverable. They become your Week 12 baseline.

### Containerize from Day 1

The most expensive mistake in delivery is building on your laptop and discovering at Week 15 that it can't containerize for production. Avoid this by wrapping your prototype in a Dockerfile immediately.

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENTRYPOINT ["python", "-m", "your_tool"]
```

And a `docker-compose.yml` for local testing:

```yaml
version: '3.8'
services:
  your-tool:
    build: .
    volumes:
      - ./data:/data
      - ./output:/output
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

Local testing: `docker-compose up` — your prototype runs in a container exactly as it will in production. When Week 15 comes, you're not rewriting for containers — you're just hardening the build pipeline.

### Sprint Antipatterns

These sink sprints. Recognize and avoid them:

| Antipattern | Cost | Fix |
|---|---|---|
| Perfectionism | "Let's make the UI gorgeous" | CLI is fine. UI is Week 12+. |
| Over-generalization | "Let's cover 10 use cases" | Pick one. Iterate later. |
| Scope creep | "While we're at it, add auth" | Note it. Defer to Week 12. |
| Architecture paralysis | 20 minutes debating frameworks | Pick one, move. |
| Testing obsession | "We need 100 unit tests" | One happy path + one failure case. Ship it. |

The best sprint code is "good enough" code. Iterate from there.

---

## Day 2 — Lab: Sprint I

### Problem Statement

Your instructor will provide a security problem. Example problems:
- "Build an automated threat hunter that detects suspicious user behavior in cloud infrastructure"
- "Create a vulnerability assessment tool that correlates multiple sources of intelligence"
- "Design a security policy compliance checker that audits infrastructure against NIST standards"

Teams of 2-3 students, 110 minutes total.

### Phase 1: Think (15 min)

Apply CCT and the Assessment Stack:

**Evidence-Based Problem Definition (5 min):**
- What's the concrete problem statement?
- What data/signals are available?
- Who is the user (analyst, DevOps, compliance officer)?

**Assessment Stack Pass (5 min):**
- Layer 1: What problem type is this?
- Layers 2-3: Deterministic, statistical, or reasoning? Which model tier?
- Layers 4-5: What data stores? What integration pattern?

**Success Criteria (5 min):**
- Write down 3-5 measurable outcomes
- Example: "Detects 80% of anomalies with < 5% false positives"
- Example: "Runs in < 30 seconds per scan, costs < $0.05 per invocation"

**Output:** One-page problem analysis with Assessment Stack table.

### Phase 2: Spec (15 min)

Don't code yet. Write:

**Architecture Sketch (5 min):**
- Agents needed? Tools? APIs?
- What data flows in, what flows out?
- What's the critical path (what *must* work)?

**MVP Scope (5 min):**
- Required for MVP (must work by end of sprint)
- Deferred to Week 12 (important but not blocking)
- Out of scope (don't discuss again until after presentations)

**AIUC-1 Controls Design (5 min):**
- Input validation: what schema do your tools accept?
- Logging: what events do you log? What fields?
- Graceful degradation: what happens when the main path fails?

**Output:** One-page spec with ASCII architecture diagram and AIUC-1 control table.

### Phase 3: Build (60 min)

Use Claude Code as your pair programmer. You describe the architecture; Claude Code generates scaffolding. Your job: refine, test, iterate.

**Build sequence:**
1. Project structure + requirements.txt + Dockerfile (5 min)
2. Tool definitions and schemas with input validation (10 min)
3. Agent(s) with system prompts — Assessment Stack model selection applied (15 min)
4. Orchestration and data flow (15 min)
5. Logging and structured output (10 min)
6. Quick local test (5 min)

**During build, maintain a deferred items list.** Every time you hit something that would take more than 10 minutes to do correctly, note it and move on. These become Week 12 tasks.

### Phase 4: Test and Retro (15 min)

**Happy Path Test (5 min):** Run your tool on normal data. Does it complete?

**Failure Case (5 min):** Feed it bad data (malformed input, missing fields). Does it handle errors?

**Metrics Capture (5 min):** Record timings and costs:

```json
{
  "sprint": "week-11",
  "problem": "[your problem statement]",
  "execution_time_sec": 0.0,
  "tokens_used": 0,
  "estimated_cost_usd": 0.0,
  "cpt_usd": 0.0,
  "mtts_sec": 0.0,
  "success_criteria_met": "X of Y",
  "deferred_items": []
}
```

**Retro (built into the /retro skill):**
- What from the spec did you build? What did you cut?
- What was harder than expected?
- What surprised you about the Assessment Stack decisions you made?
- Top 3 items for Week 12 hardening

---

## Deliverables

1. **Working prototype** — source code, Dockerfile, docker-compose.yml, example input/output
2. **Assessment Stack justification table** — one row per layer, decision + rationale
3. **AIUC-1 controls as-built** — what controls are implemented, what's deferred to Week 12
4. **Sprint metrics** — metrics.json with MTTS, MTTP, aMTTR, CPT measurements
5. **Sprint retrospective** (500-800 words) — what was built, what was cut, what to carry to Week 12
6. **Deferred items list** — explicit list of what Week 12 must address

---

## AIUC-1 Integration

**Building controls in vs. bolting on:** The difference between a prototype that passes Week 8 audit and one that fails is whether governance was designed in. Sprint I establishes the pattern: Assessment Stack first, controls in the spec, logging from the first commit.

**Domain E (Accountability):** Your metrics.json IS an audit trail for this sprint. Every invocation cost, every timing measurement.

## V&V Lens

**Empirical Baseline:** The Sprint I metrics become your Week 12 baseline. V&V here is: "Does the tool do what the spec says?" Test against your own success criteria before the retro.

**Failure is data:** If a success criterion isn't met, that's not failure — it's a measurement. Record it. Week 12 closes the gap.

### V&V Lens: Measuring Verification Quality

Add a V&V metric to your sprint tracking alongside MTTS/MTTP/MTTSol/MTTI/aMTTR:

**Verification Rate (VR):** What percentage of your tool's findings were independently verified before action was taken?

- Sprint I baseline: Track how often you verify agent outputs before acting on them
- Sprint II target: Implement at least one automated verification step in your tool

A tool that produces 50 findings with 0% verification is less valuable than a tool that produces 10 verified findings. Quality over quantity — this is the V&V mindset applied to tool design.

### Sprint Metric: Cost Per Task

Add to your sprint tracking alongside MTTS/MTTP/MTTSol/MTTI/aMTTR:

**CPT (Cost Per Task):** Total API cost to complete one unit of work (one alert triaged, one incident analyzed, one report generated).

Track across sprints:
- Sprint I CPT: $___
- Sprint II CPT: $___
- Improvement: ___%

A system that triages 100 alerts for $5 is more production-viable than one that triages 100 alerts for $50, even if accuracy is identical.

**Cost efficiency formula:**
```
Efficiency = (Tasks Completed × Quality Score) / Total Cost
```

Optimize for efficiency, not just quality or cost alone.

---

## Sprint I Production Readiness Requirement

`/check-prod-readiness` output is a required Sprint I deliverable.

Before your Week 11 sprint review, run:

```
/check-prod-readiness ~/noctua/tools/sprint-i/
```

Requirements:
- **Zero CRITICAL findings** — these block deployment
- **Document all HIGH findings** — fix or defer with written justification
- **Include the report** in your sprint submission alongside your MTTS/MTTP/CPT metrics

In your sprint retro: What patterns did the checker find? Were they patterns you anticipated? What does this tell you about gaps in your review process?

> Track as a sprint metric: how many anti-pattern findings from `/check-prod-readiness` were found vs. fixed in Sprint I? This becomes the baseline for Sprint II improvement.

---

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the key concepts from this reading. Start easy, then get harder."
> - "I think I understand the Engineering Assessment Stack but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common misconceptions about sprint methodology for AI tools? Do I have any of them?"
> - "Connect this week's material to what we learned in Weeks 9-10. How do they relate?"

---

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.
