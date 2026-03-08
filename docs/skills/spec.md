# /spec — Specification Before Building

Write a formal specification document for the current task before any
implementation begins. A spec answered: What are we building, why,
how will we know it works, and what are we explicitly NOT building.

This skill is the second step of the Think → Spec → Build → Retro cycle.
Use after `/think` has validated the direction.

---

## What to Produce

A complete spec document that anyone on the team could use to build
the system independently. If the spec is ambiguous, the build will be.

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
[How will we know this is done and working? Make these measurable.]
- [ ] [Criterion 1 — observable, testable]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Out of Scope
[What are we explicitly NOT building in this iteration?]
- [Not doing X]
- [Not doing Y]

---

## Architecture

### Agents / Components
| Name | Role | Tools | Inputs | Outputs |
|------|------|-------|--------|---------|
| [Agent 1] | [responsibility] | [tool list] | [what it receives] | [what it produces] |
| [Agent 2] | ... | ... | ... | ... |

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

## Open Questions
- [ ] [Question 1 — decision needed before build]
- [ ] [Question 2]

## Definition of Done
The build is complete when:
- [ ] All success criteria above pass
- [ ] Integration test covers the happy path end-to-end
- [ ] Structured logging from all agents/components
- [ ] Security considerations documented and mitigated
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

- Add a "Grading checklist" section if you want to self-evaluate before submission
- Add a "MITRE ATLAS threat model" section for security-specific work
- Add an "AIUC-1 domain mapping" section for ethical AI assessments
- Shorten the template for quick one-agent tools; expand it for multi-agent systems
- Create a `/spec-mcp` variant tuned for MCP server design
- Create a `/spec-agent` variant tuned for multi-agent orchestration systems

---

## Installation

Save as `~/.claude/skills/spec.md` (global) or `.claude/skills/spec.md`
(project-local).

Use `/spec` at the start of any build session. Works best after `/think`.
