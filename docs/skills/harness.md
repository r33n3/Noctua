# /harness — Agent Harness Engineering

The harness is not a separate phase. It lives in the connections between
your phases. This skill helps you navigate where you are, what harness
thinking applies at this moment, and whether your system is becoming
self-correcting or just running in circles.

Trigger this skill when you're not sure which phase you're in, when
something keeps going wrong in the same way, or when you want to audit
whether your workflow is actually building institutional knowledge.

---

## What is a Harness?

A harness is the set of constraints, checks, and context that surrounds
an agent while it works — making correct behavior the easy path and
incorrect behavior detectable before it costs you.

A harness has three layers:

**1. Spec constraints** — what you told the agent (requirements, anti-requirements,
boundaries, acceptance criteria). These live in your /spec.

**2. Runtime constraints** — what prevents mistakes automatically (pre-commit
hooks, linters, type checks, tests, CI gates). These live in your worktrees.

**3. Context** — what the agent can see (AGENTS.md, CLAUDE.md, TASK.md,
referenced example files, MCP tools). These live in your project setup.

A gap in any layer is a gap in your harness.

---

## Phase Navigation

Use this to orient yourself when a session loses direction:

```
Where am I?
├── Understand the problem → /think
│   └── Run Harness Audit: guardrails? existing constraints? verification strategy?
│
├── Define what to build → /spec
│   └── Include: anti-requirements, verifiable criteria, file scope, boundaries, retro lessons
│
├── Build it → /worktree-setup + build
│   └── Configure: pre-commit hooks, output suppression, TASK.md in worktree
│   └── Sub-agent check: one context or split?
│
└── Learn from it → /retro
    └── Classify every problem: spec gap / constraint gap / context gap / process gap
    └── Three Strikes: same gap 3x → build a permanent harness component
```

---

## Harness Health Check

Run this periodically to assess whether your workflow is self-correcting:

**Spec layer**
- [ ] Your /spec template includes anti-requirements (not just requirements)
- [ ] Success criteria are verifiable checks, not prose descriptions
- [ ] Lessons from past retros are encoded in the spec template

**Runtime layer**
- [ ] Pre-commit hooks run in worktrees during agent execution
- [ ] Test output is suppressed to failures only (not thousands of passing lines)
- [ ] At least one automated gate would catch the most common mistake you make

**Context layer**
- [ ] AGENTS.md or CLAUDE.md captures patterns the agent needs to see
- [ ] AGENTS.md is human-written and surgical — only what the agent can't infer from reading the code (LLM-generated context files reduce task success; human-curated increases it)
- [ ] TASK.md (scoped spec) is dropped into each worktree before the agent starts
- [ ] Retro findings that were "context gaps" have been added to AGENTS.md or skills
- [ ] Tier 2 (database handoff) is configured for tasks that span sessions or require pre-computed analysis too large for the context window

**Feedback loop**
- [ ] /retro output actually changes your /spec template or /think checklist
- [ ] You have a running log of gap types across retros
- [ ] Any gap category that appeared 3+ times has been addressed permanently

---

## Self-Correcting System Check

The harness compounds when:
- /retro → identifies gaps → feeds /think (Harness Audit)
- /think → surfaces constraint needs → shapes /spec (anti-requirements)
- /spec → constrains /worktree (TASK.md, hooks, boundaries)
- /worktree → produces evidence → /retro (gap classification)

If any of these connections is broken, you're not building a self-correcting
system — you're just running the same mistakes in a faster loop.

Ask: "What did my last retro actually change?"
If the answer is "nothing," the loop is broken.

---

## Output Format

```
## Harness Audit: [Session / Project]

**Current phase:** [Think / Spec / Build / Retro]

**Spec layer gaps:**
- [what's missing from your spec template]

**Runtime layer gaps:**
- [checks that don't exist but should]

**Context layer gaps:**
- [information the agent can't see but needs]

**Last retro findings applied:** [Yes / No / Partially]
- [what changed in the spec, hooks, or context as a result]

**Three Strikes candidates:**
- [gap patterns appearing 3+ times]
- [permanent harness component to build]

**Next action:**
[Single most important harness improvement right now]
```

---

## When to Use

- When a session loses direction and you're not sure which phase applies
- When the same type of mistake keeps happening across sprints
- At the start of a new project to assess your current harness state
- As a periodic audit: "Is my workflow actually getting better?"
- Before a capstone sprint — verify the full loop is connected

---

## Modify This Skill

- Add your team's most common failure patterns to the Health Check
- Customize the Phase Navigation for your specific workflow variants
- Add a "Harness maturity level" rating (1–4) to track improvement over time
- Create a `/harness-security` variant with security-specific constraint checks
  (prompt injection boundaries, LLM trust surfaces, credential handling rules)

---

## Installation

Save as `~/.claude/commands/harness.md` (global) or
`.claude/commands/harness.md` (project-local).

Use `/harness` when you need to orient, audit, or course-correct your cycle.
