# Course Architecture

## Two-Layer Design

This repository uses a deliberate two-layer architecture. **Do not merge the layers.**

```
docs/           → Presentation layer (student-facing site)
course-flow/    → Instructional layer (agent-driven guidance)
```

These are aligned but not identical. The same module appears in both layers with different purposes.

---

## Layer Responsibilities

### `docs/`
Student-facing course site. Deployed to GitHub Pages.

- HTML lab guides (`lab-s1-unit[1-4].html`, `lab-s2-unit[5-8].html`)
- Shared styles and interactivity (`labs.css`, `labs.js`)
- Browsable, readable, self-contained
- **Does not contain agent instructions or instructor guidance**

### `course-flow/`
Instructional progression layer. Consumed by the agent (Claude Code).

- `course-flow/modules/<module>/flow.md` — per-module sequencing, hints, gates
- `course-flow/templates/module-template.md` — authoring template
- `course-flow/program/` — program-level overview and learning path
- **Does not duplicate site content** — references `docs/` by path only

---

## Supporting Directories

### `agent/`
Agent behavior configuration.

```
agent/profiles/      — Instructor persona definitions (Practitioner, Socratic, Coach, Challenger)
agent/review-modes/  — Review style definitions (Coach, Grader, Security, RedTeam)
agent/policies/      — Behavioral rules (hint, progression, review)
agent/prompts/       — Reusable agent prompt templates
```

### `student-state/`
Per-student state files. **Not committed to the shared repo by students.**

```
student-state/templates/   — Blank templates to copy
student-state/examples/    — Filled examples for reference
student-state/preferences.md    — (student creates from template)
student-state/progress.md       — (student creates from template)
student-state/reflection-log.md — (student creates from template)
```

### `semester-1/weeks/` and `semester-2/weeks/`
Markdown content source. The canonical instructional content per unit/week.

- These files contain inline `> Claude:` scaffolding blocks
- These are NOT the same as `course-flow/` — they are content with embedded hints
- `course-flow/modules/*/flow.md` adds the flow layer on top without modifying these files

---

## Module Lifecycle

```
semester-*/weeks/<unit>.md     ← content source (do not touch for flow purposes)
    ↓ referenced by
course-flow/modules/<unit>/flow.md   ← gate, sequence, review, reflection logic
    ↓ read by
agent (Claude Code)            ← guides the student through the module
    ↓ writes to
student-state/progress.md      ← tracks completion
student-state/reflection-log.md
```

---

## Authoring Rules

1. **HTML is the canonical student experience.** `docs/` is source of truth for what students see.
2. **`course-flow/` references, never duplicates.** Use `docs/<path>` links, not copied content.
3. **`semester-*/weeks/*.md` are content files.** Add inline `> Claude:` blocks for embedded guidance only.
4. **Student state is personal.** Files in `student-state/` are created per-student from templates. The templates are committed; the filled files are not (`.gitignore` them if needed).

---

## Understanding the Repo in Under 5 Minutes

| Question | Answer |
|---|---|
| Where do students go to learn? | `docs/` — open any `lab-*.html` file |
| Where does the agent get its instructions? | `course-flow/modules/*/flow.md` + `agent/` |
| Where does progress live? | `student-state/progress.md` (per student, from template) |
| Where is the course content? | `semester-1/weeks/` and `semester-2/weeks/` |
| What's the manifest? | `course-manifest.yaml` |
