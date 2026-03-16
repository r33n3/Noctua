# /retro — Structured Retrospective

Run a structured retrospective on the work just completed. Capture what
was built, how it compared to the spec, what worked, what didn't, and
what to carry into the next cycle and your context library.

This skill is the final step of the Think → Spec → Build → Retro cycle.
It closes the loop and makes each cycle better than the last.

---

## What to Do

Review the current state of the project against the original spec and
produce a retrospective document that is honest, specific, and actionable.

---

## Output Format

```
# Retro: [Project / Sprint Name]
**Date:** [date]
**Cycle:** [Think → Spec → Build → Retro #N]

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
[Be specific — "the worktree approach" is vague; "worktrees let us build
agent1 and agent2 simultaneously, saving ~45 min of context switching" is useful]
- [Thing 1]
- [Thing 2]

## What Didn't Work
[Be honest — the retro is only useful if it's accurate]
- [Problem 1 — what happened and why]
- [Problem 2]

## What Slowed Us Down
[Blockers, wrong assumptions, things we had to re-do]
- [Blocker 1]
- [Blocker 2]

---

## Next Cycle Improvements

If we ran this cycle again, we would:
1. [Change 1 — specific and actionable]
2. [Change 2]
3. [Change 3]

## Carry Forward to Next Sprint
[ ] [Decision or pattern to use next time]
[ ] [Thing to add to CLAUDE.md or context library]
[ ] [Open question to resolve before next cycle starts]

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
```

---

## When to Use

- At the end of every sprint (Weeks 14, 15 in Unit 4; each capstone sprint)
- After any significant build session — even a solo one
- When something went unexpectedly wrong and you need to understand why
- Before starting the next cycle — the retro output feeds directly into the next `/think`

---

## Modify This Skill

- Add team-specific metrics (MTTI, MTTR, cost per run, etc.)
- Add a "Share with the community" section for open-source work
- Add a "Peer feedback" section for course deliverables
- Create a `/retro-security` variant that always includes a security
  posture review alongside the engineering retrospective
- Link your retro output automatically to a CHANGELOG.md entry
- Build a `/retro-light` 5-minute version for quick end-of-session capture

---

## Installation

Save as `~/.claude/commands/retro.md` (global) or
`.claude/commands/retro.md` (project-local).

Use `/retro` at the end of every build session, sprint, or cycle.
The output feeds directly into the next `/think`.
