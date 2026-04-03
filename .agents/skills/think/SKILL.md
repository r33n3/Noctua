---
name: think
description: >
  Stop and perform deep critical analysis before proceeding with any
  implementation, decision, or recommendation. First step of the
  Think -> Spec -> Build -> Retro cycle. Ends with a harness audit:
  guardrails needed, existing constraints, verification strategy.
---

# /think - Critical Analysis Before Acting

Stop and perform deep critical analysis before proceeding with any
implementation, decision, or recommendation.

This skill is the first step of the Think -> Spec -> Build -> Retro cycle.
It forces structured reasoning before any code or commitment.

Think of this phase as the manager handing off work to a capable but
context-less contractor. Your job is to make the problem so clear that
the contractor (Codex) cannot build the wrong thing.

---

## What to Do

1. **Restate the goal** - What is actually being asked? What problem is
   really being solved? Separate the stated goal from the underlying need.

2. **Surface assumptions** - What am I assuming to be true? List them
   explicitly. Which assumptions, if wrong, would invalidate the approach?

3. **Identify risks** - What could go wrong? Consider: security risks,
   reliability risks, ethical risks, scope risks, and unknown unknowns.

4. **Consider alternatives** - What are 2-3 other valid approaches?
   What are the tradeoffs? Why might an alternative be better?

5. **Identify missing information** - What do I not know that would change
   my approach? What should I ask or investigate before proceeding?

6. **State a direction and confidence level** - Given all the above, what
   is the recommended path forward? How confident am I, and why?

---

## Harness Audit (run at the end of /think)

Before moving to /spec, answer these three questions. If you can't answer
them, the spec will be incomplete and the agent will fill the gaps badly.

**What guardrails does this work need?**
Think about what the agent is likely to get *wrong*, not just what it needs
to get right. Where is the solution space largest? Where could a plausible
but incorrect output do the most damage?

**What constraints already exist?**
Map the existing harness: tests, linters, type system, CI gates, AGENTS.md
rules, architectural patterns, approval steps, and environment limits.
Which of these already constrain this work? Which gaps exist that the
agent could exploit by accident?

**What is the verification strategy?**
Decide *before* any code gets written how you will check the output.
If you cannot describe a concrete check - a test, a diff review, a
behavioral assertion - the agent cannot verify its own work either.
Write the check criteria now; they become acceptance criteria in /spec.

---

## Output Format

```md
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
1. [Option A] - [brief pros/cons]
2. [Option B] - [brief pros/cons]
3. [Current approach] - [why it's preferred]

**What I don't know yet:**
- [unknown 1 - what would I need to find out?]
- [unknown 2]

**Recommended direction:**
[2-3 sentences: what to do and why]

**Confidence:** [Low / Medium / High]
[One sentence explaining what would increase confidence]

---

## Harness Audit

**Guardrails needed:**
- [What the agent is likely to get wrong]
- [Where incorrect output would cause most harm]

**Existing constraints that apply:**
- [tests / linters / CI gates / AGENTS.md rules already in place]

**Gaps - no constraint covers these yet:**
- [gap 1 -> will address in spec as anti-requirement or acceptance criterion]
- [gap 2]

**Verification strategy:**
[How will I check the output? Name the specific test, diff, or assertion.]
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

- Add domain-specific risk categories (for example, MITRE ATLAS threat
  vectors for security work, or bias and fairness for ethical AI work)
- Change the output format to match how your team documents decisions
- Add a "CCT pillars check" section to tie this to the five-pillar framework
- Create a `/think-security` variant that always includes threat modeling
- Create a `/think-ethics` variant that always surfaces AIUC-1 domain requirements
- Expand the harness audit with your team's known failure patterns from past retros
- Pair this skill with `/harness-assess` when you need a formal environment review

---

## Installation

Save this file as `~/.Codex/commands/think.md` (global - available in all
projects) or `.Codex/commands/think.md` (project-local).

Then use `/think [topic or paste your task]` in any Codex session.
