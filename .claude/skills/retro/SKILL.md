---
name: retro
description: >
  Structured retrospective on completed work. Final step of the
  Think -> Spec -> Build -> Retro cycle. Classifies every gap found
  (spec/constraint/context/process), captures feedback for next cycle.
  Three of the same gap type triggers a permanent harness component.
---

# /retro - Structured Retrospective

Run a structured retrospective on the work just completed. Capture what
was built, how it compared to the spec, what worked, what didn't, and
what to carry forward - into your context library and into the next cycle.

This skill is the final step of the Think -> Spec -> Build -> Retro cycle.
It closes the loop and makes each cycle better than the last.

Without this step feeding back into /think and /spec, you're running
agents in a loop. With it, your system gets better every cycle.

---

## What to Do

Review the current state of the project against the original spec and
produce a retrospective document that is honest, specific, and actionable.

**Most importantly:** classify every problem you find. The classification
tells you exactly where to fix it so it doesn't recur.

---

## Gap Classification

Every problem found in retro belongs to one of four categories.
Each category maps to a specific fix location:

| Gap Type | What it means | Where to fix it |
|----------|--------------|-----------------|
| **Spec gap** | You didn't tell the agent something it needed | Update your /spec template or the Lessons section |
| **Constraint gap** | Nothing prevented the agent from making the mistake | Add a linter rule, pre-commit hook, architectural boundary, or test |
| **Context gap** | The agent couldn't see what it needed to see | Update AGENTS.md, add a skill, or build an MCP that surfaces the info |
| **Process gap** | The workflow itself is wrong - a phase was skipped or out of order | Update your phase sequence, review checkpoints, or harness controls |

**The Three Strikes Rule:** When the same gap category appears three times
across retros, that's your signal to build a permanent harness component
rather than just noting it. Three spec gaps of the same type -> update the
spec template. Three constraint gaps -> add the rule to CI. Three context
gaps -> build the MCP or update AGENTS.md permanently.

---

## Output Format

```md
# Retro: [Project / Sprint Name]
**Date:** [date]
**Cycle:** [Think -> Spec -> Build -> Retro #N]

---

## What We Set Out to Build
[Paste or summarize the success criteria from the /spec]

## What Was Actually Built
[Honest description of what exists now]

## Spec vs. Reality

| Success Criterion | Status | Notes |
|-------------------|--------|-------|
| [Criterion 1] | Done / Partial / Not done | [what happened] |
| [Criterion 2] | Done / Partial / Not done | [what happened] |
| [Criterion 3] | Done / Partial / Not done | [what happened] |

---

## What Worked Well
[Be specific - "the worktree approach" is vague; "worktrees let us build
agent1 and agent2 simultaneously, saving ~45 min of context switching" is useful]
- [Thing 1]
- [Thing 2]

## What Didn't Work
[Be honest - the retro is only useful if it's accurate]
- [Problem 1 - what happened and why]
- [Problem 2]

## What Slowed Us Down
- [Blocker 1]
- [Blocker 2]

---

## Gap Analysis

For each problem above, classify it and assign a fix:

| Problem | Gap Type | Fix Location | Action |
|---------|----------|--------------|--------|
| [problem 1] | Spec / Constraint / Context / Process | /spec template / CI / AGENTS.md / workflow or harness control | [specific change] |
| [problem 2] | ... | ... | ... |

## Three Strikes Check
[List any gap category that has appeared 3+ times across retros.
These require a permanent harness component, not just a note.]
- [Gap pattern] -> [permanent fix to build]

---

## Next Cycle Improvements

If we ran this cycle again, we would:
1. [Change 1 - specific and actionable, maps to a gap type]
2. [Change 2]
3. [Change 3]

## Carry Forward to Next Sprint
[ ] [Decision or pattern to use next time]
[ ] [Thing to add to CLAUDE.md, AGENTS.md, or context library]
[ ] [Spec anti-requirement to add based on what the agent did wrong]
[ ] [Hook or linter to add based on constraint gap found]

---

## Context Library Updates

What from this cycle belongs in your context library?
- [Pattern, template, or prompt worth saving]
- [System prompt or tool definition to extract]
- [Architecture decision worth documenting as a reusable pattern]

Use this prompt to extract: "Based on what we just built, write a context
library entry capturing the reusable pattern from [specific thing]."

---

## Metrics (if tracked)

| Metric | Target | Actual |
|--------|--------|--------|
| Time: Think | ~15% | [actual %] |
| Time: Spec | ~20% | [actual %] |
| Time: Build | ~50% | [actual %] |
| Time: Retro | ~15% | [actual %] |
| Tests passing | X | Y |
| Success criteria met | X / N | Y / N |
| Gap types found | - | Spec: N, Constraint: N, Context: N, Process: N |
```

---

## When to Use

- At the end of every sprint (Weeks 14, 15 in Unit 4; each capstone sprint)
- After any significant build session - even a solo one
- When something went unexpectedly wrong and you need to understand why
- Before starting the next cycle - the retro output feeds directly into the next `/think`

---

## Modify This Skill

- Add team-specific metrics (MTTI, MTTR, cost per run, etc.)
- Build a running retro log file that accumulates gap patterns across sprints -
  this becomes the input to your Three Strikes checks
- Add a "Share with the community" section for open-source work
- Create a `/retro-light` 5-minute version for quick end-of-session capture
- Create a `/retro-security` variant that includes a security posture review
  alongside the engineering retrospective
- Link retro output automatically to a CHANGELOG.md entry

---

## Installation

Save as `~/.claude/commands/retro.md` (global) or
`.claude/commands/retro.md` (project-local).

Use `/retro` at the end of every build session, sprint, or cycle.
The gap analysis output feeds directly into the next `/think` harness audit,
and repeated environment-level issues should trigger `/harness-assess`.
