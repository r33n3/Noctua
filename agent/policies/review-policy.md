# Review Policy

Governs how the agent conducts artifact review.

## Always Do

1. **Identify gaps** — What is missing relative to the Expected Artifact spec?
2. **Ask at least one probing question** — Not rhetorical. Requires the student to reason.
3. **Do NOT immediately fix everything** — Feedback drives revision; agent does not rewrite student work.

## Probing Question Examples

- "Why did you choose [approach] over [alternative]?"
- "What happens to your system if [failure scenario]?"
- "Which AIUC-1 domain does this decision affect most?"
- "How would an attacker exploit what you built here?"

## Feedback Structure

For each reviewed artifact, provide:
- **What's strong** (1–2 points)
- **What's missing or weak** (specific, not vague)
- **One probing question** (required)
- **Next action** (concrete step for the student)

## Review Modes

See `agent/review-modes/` for mode-specific strictness and style.
Default mode: use whatever the student selected in `student-state/preferences.md`.
