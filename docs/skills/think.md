# /think — Critical Analysis Before Acting

Stop and perform deep critical analysis before proceeding with any
implementation, decision, or recommendation.

This skill is the first step of the Think → Spec → Build → Retro cycle.
It forces structured reasoning before any code or commitment.

---

## What to Do

1. **Restate the goal** — What is actually being asked? What problem is
   really being solved? Separate the stated goal from the underlying need.

2. **Surface assumptions** — What am I assuming to be true? List them
   explicitly. Which assumptions, if wrong, would invalidate the approach?

3. **Identify risks** — What could go wrong? Consider: security risks,
   reliability risks, ethical risks, scope risks, and unknown unknowns.

4. **Consider alternatives** — What are 2–3 other valid approaches?
   What are the tradeoffs? Why might an alternative be better?

5. **Identify missing information** — What do I not know that would change
   my approach? What should I ask or investigate before proceeding?

6. **State a direction and confidence level** — Given all the above, what
   is the recommended path forward? How confident am I, and why?

---

## Output Format

Produce structured output in this format:

```
## Think: [Topic / Task]

**Goal (restated):**
[One clear sentence describing what is actually being solved]

**Assumptions I'm making:**
- [assumption 1]
- [assumption 2]
- [assumption 3]

**Risks if assumptions are wrong:**
- [risk tied to assumption 1]
- [risk tied to assumption 2]

**Alternatives considered:**
1. [Option A] — [brief pros/cons]
2. [Option B] — [brief pros/cons]
3. [Current approach] — [why it's preferred]

**What I don't know yet:**
- [unknown 1 — what would I need to find out?]
- [unknown 2]

**Recommended direction:**
[2–3 sentences: what to do and why]

**Confidence:** [Low / Medium / High]
[One sentence explaining what would increase confidence]
```

---

## When to Use

- Before writing any code, spec, or architecture document
- Before making a security recommendation with real-world consequences
- When a problem feels ambiguous or the requirements are unclear
- Before committing to an approach that will be hard to reverse
- When something "feels off" but you can't articulate why
- At the start of any incident analysis, threat model, or design review

---

## Modify This Skill

This is a starting point. Adapt it to your workflow:

- Add domain-specific risk categories (e.g., "MITRE ATLAS threat vectors"
  for security work, or "bias and fairness" for ethical AI work)
- Change the output format to match how your team documents decisions
- Add a "CCT pillars check" section if you want to tie this to the
  five-pillar framework from Unit 1
- Create a `/think-security` variant that always includes threat modeling
- Create a `/think-ethics` variant that always surfaces AIUC-1 domain requirements

The best version of this skill is the one you've shaped for your context.

---

## Installation

Save this file as `~/.claude/skills/think.md` (global — available in all
projects) or `.claude/skills/think.md` (project-local).

Then use `/think [topic or paste your task]` in any Claude Code session.
