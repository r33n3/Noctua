# /spec — Specification Before Building

Write a formal specification document for the current task before any
implementation begins. The spec answers: What are we building, why,
how will we know it works, what are we explicitly NOT building, and
what constraints must the agent never violate.

This skill is the second step of the Think → Spec → Build → Retro cycle.
Use after `/think` has validated the direction and completed the Harness Audit.

The spec is your primary harness artifact. A good spec makes the agent's
solution space smaller and more correct. Every ambiguity you leave in the
spec is a decision the agent will make without you.

---

## What to Produce

A complete spec document that anyone on the team — or any Claude session —
could use to build the system independently. If the spec is ambiguous,
the build will be.

---

## Output Format

```
# Spec: [System / Feature Name]
**Date:** [date]
**Status:** Draft / Review / Approved

---

## Problem Statement
[2–3 sentences: what problem does this solve, for whom, and why now?]

## Success Criteria
Verifiable checks, not prose. "The API returns 200 with a valid token"
beats "authentication should work." Each criterion must be falsifiable.

- [ ] [Criterion 1 — observable, testable, specific]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Anti-Requirements (things the agent must NOT do)
These are as important as the requirements. Explicit constraints prevent
the agent from making plausible but wrong decisions.

- DO NOT touch [module/file] — reason: [why]
- DO NOT add dependencies beyond [list] — reason: [cost/complexity]
- DO NOT refactor code outside the scope of this task
- DO NOT [pattern] — use [alternative] instead (see [example file])

## Out of Scope
[What are we explicitly not building in this iteration?]
- [Not doing X — deferred to next sprint]
- [Not doing Y — tracked in TODOS.md]

---

## Architecture

### Agents / Components
| Name | Role | Tools | Inputs | Outputs |
|------|------|-------|--------|---------|
| [Agent 1] | [responsibility] | [tool list] | [what it receives] | [what it produces] |
| [Agent 2] | ... | ... | ... | ... |

### Files In Scope
[Explicitly list which files this task touches. Anything not listed is
out of bounds unless the agent flags it first.]
- [file1.py] — [what changes]
- [file2.py] — [what changes]

### Architectural Boundaries
[Which patterns must be followed? Point to an existing file as the example.]
- Follow the pattern in [existing_file.py] for [pattern name]
- Import graph constraint: [module A] must not import [module B]
- [Any other structural rules]

### Orchestration Pattern
[Sequential / Hierarchical / Expert Swarm / Pipeline]
[Describe the coordination flow step by step]

### Data Flow
1. [Step 1: input arrives as ...]
2. [Step 2: Agent 1 processes → produces ...]
3. [Step 3: Agent 2 receives → produces ...]
4. [Step 4: Final output is ...]

---

## Tool Definitions (stub)
For each tool the agents will use:

**tool_name(param: type) → return_type**
- Purpose: [what it does]
- Security constraint: [input validation, rate limit, scope limit]
- Error behavior: [what happens on failure]

---

## Security Considerations
- [Threat 1 and mitigation]
- [Threat 2 and mitigation]
- [Least privilege: what each agent can and cannot access]

## Ethical Considerations
- [Who could be harmed by this system?]
- [What data privacy implications exist?]
- [What does responsible use look like?]

---

## Lessons from Past Retros
[If you've run /retro on similar work, encode the findings here so this
cycle starts with those lessons already applied. This is the feedback
loop that makes your harness improve over time.]

- [Retro finding → how it changes this spec]
- [e.g., "Last sprint: enrichment step ballooned to 40 min. This spec:
   enrichment is capped at 3 tool calls max, any more requires human approval"]

---

## Open Questions
- [ ] [Question 1 — decision needed before build]
- [ ] [Question 2]

## Definition of Done
The build is complete when:
- [ ] All success criteria above pass
- [ ] All anti-requirements verified (review diff against the list)
- [ ] Integration test covers the happy path end-to-end
- [ ] Structured logging from all agents/components
- [ ] Security considerations documented and mitigated
- [ ] TASK.md dropped into each worktree for agent reference
```

---

## When to Use

- Before any sprint or build session
- Before building an MCP server, agent system, or pipeline
- When the scope is unclear and you need to force clarity before touching code
- When working with a team — the spec is the shared contract
- Before your capstone architecture review

---

## Modify This Skill

- Add a "Grading checklist" section for course deliverables
- Add a "MITRE ATLAS threat model" section for security-specific work
- Add an "AIUC-1 domain mapping" section for ethical AI assessments
- Shorten the template for quick one-agent tools; expand for multi-agent systems
- Create a `/spec-mcp` variant tuned for MCP server design
- Create a `/spec-agent` variant tuned for multi-agent orchestration systems
- Grow the "Lessons from Past Retros" section into a running library that
  auto-loads relevant lessons based on the task type

---

## Installation

Save as `~/.claude/commands/spec.md` (global) or `.claude/commands/spec.md`
(project-local).

Use `/spec` at the start of any build session. Works best after `/think`.
