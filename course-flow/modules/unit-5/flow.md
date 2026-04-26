# Module: Multi-Agent Orchestration (S2 Unit 5)

## Purpose
Develops the student's ability to design, build, and evaluate multi-agent systems that apply Collaborative Cognitive Tooling (CCT) to real security problems. Bridges single-agent prototype skills (Unit 4) to production-grade orchestration with MCP, structured communication, and AIUC-1 governance.

## Outcomes
By the end of this module, the student can:
- Design a multi-agent architecture for a defined security problem
- Implement MCP-compatible context engineering for agent communication
- Apply CCT principles to enable agents to reason collaboratively
- Evaluate orchestration patterns against real-world failure modes
- Map a multi-agent system to AIUC-1 governance domains

## Related Site Content
- `docs/lab-s2-unit5.html` — student-facing lab guide

## Prerequisites
- S1 Unit 4 completed (rapid prototyping, single-agent systems)
- Anthropic SDK installed (`pip install anthropic`)
- GitHub repo initialized for capstone work

---

## Instruction Guidance

This is the first S2 module — students arrive with S1 prototype skills but limited production thinking. The shift to emphasize:

1. **Architecture before code.** Students want to jump to implementation. Hold them at the design phase until the agent interaction model is clear.
2. **CCT as a real framework, not a buzzword.** Push students to articulate *how* agents in their design contribute to a shared reasoning process.
3. **MCP is a protocol, not magic.** Common misconception: students treat MCP as an abstraction that "handles context." Make them describe what each message contains and why.
4. **Failure modes are the lesson.** When a student's orchestration doesn't work, that's the teaching moment — don't rescue them too fast.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Late Module rules apply (full solutions after real attempt).

Module-specific: For architecture design questions, never give the architecture. Ask: "What does Agent A need to know that only Agent B can provide?"

---

## Tasks

1. **Pattern Analysis** — Identify and document 3 multi-agent orchestration patterns (supervisor, pipeline, peer-to-peer). For each: describe the pattern, give a security use case, and name one failure mode.
2. **MCP Context Design** — Design the context schema for a 2–3 agent system solving a defined security problem. Show what each agent sends and receives.
3. **Framework Comparison** — Compare 2 agent frameworks: Claude Managed Agents vs. Claude Agent SDK (PyPI: claude-agent-sdk). Evaluation criteria: hosting model (server-side vs. caller-process), state management, MCP support, observability, cost model, production readiness.
4. **AIUC-1 Pre-Check** — Run `/audit-aiuc1` against your proposed multi-agent design. Document findings per domain.

See `semester-2/weeks/unit-5.md` for full lab instructions and deliverable specs.

## Expected Artifact

Three deliverable files (committed to student's repo):

**`pattern-analysis.md`**
- 3 patterns documented
- Each has: description, security use case, failure mode
- Minimum 300 words total

**`framework-comparison-report.md`**
- Claude Managed Agents vs. Claude Agent SDK — criteria-based comparison table including hosting model, MCP support, state management, observability, and cost
- Recommendation with rationale

**`aiuc1-precheck.md`**
- All 6 AIUC-1 domains addressed
- Each domain: control implemented / gap identified
- Signed pre-check record

---

## Review Guidance

**Common gaps:**
- Pattern analysis that describes patterns without naming failure modes — push for the failure mode specifically
- Framework comparison that is purely feature-listing without a recommendation — require a stance
- Framework comparison that evaluates LangGraph or CrewAI instead of the two Anthropic-native options — redirect to Claude Managed Agents vs. Claude Agent SDK
- AIUC-1 pre-check that leaves domains empty or says "N/A" — there is no N/A for a system under design

**What to look for in the MCP context design:**
- Student should be able to say what information flows between agents and why
- Red flag: context schema that passes everything to every agent (no scoping)

**Probing question bank:**
- "If Agent B fails mid-orchestration, what does your system do?"
- "Which of your agents could be replaced by a deterministic tool? Should it be?"
- "Which AIUC-1 domain is hardest to address in a multi-agent system — and why?"

## Reflection Prompt
"What surprised you about designing agent communication? Was the AI component genuinely necessary for each agent in your design, or could any of them have been a simpler tool?"

---

## Completion Gate
The student may advance to Unit 6 when:
- [ ] All 3 tasks completed
- [ ] All 3 artifacts committed to repo and linked
- [ ] Reflection entry written in `student-state/reflection-log.md`

## Stretch Challenge
Implement the MCP context design as working code. Deploy a 2-agent pipeline that passes structured context. Add a logging layer that captures every inter-agent message for audit.
