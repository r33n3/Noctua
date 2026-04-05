---
name: harness-build
description: >
  Build or advance an agent harness for the current project. Reads
  existing context (settings.json, hooks, CLAUDE.md, blueprint.yaml),
  classifies controls as inside vs outside the reasoning loop, scaffolds
  missing outside-loop enforcement, and writes or updates blueprint.yaml.
  Companion to /harness-assess — build first, assess to score.
---

# /harness-build — Build an Agent Harness

Use this skill to construct or advance the harness around an agent
project. It reads what you have, classifies each control by enforcement
type, scaffolds the enforcement gaps, and produces or updates
`harnesses/<name>/blueprint.yaml`.

Run `/harness-assess` after to score the result.

---

## The Core Distinction

Every control in your project falls into one of two layers:

**Inside the reasoning loop — guidance (probabilistic, bypassable)**
- `CLAUDE.md` — agent CAN ignore under goal pressure
- `.claude/rules/*.md` — scoped, still probabilistic
- `.claude/skills/` — activation not guaranteed
- `harnesses/*/flexible_steps/` — the AI-driven part

**Outside the reasoning loop — enforcement (deterministic, always fires)**
- `settings.json → permissions.deny` — CANNOT bypass
- `settings.json → hooks.PreToolUse` — runs BEFORE every tool call
- `settings.json → hooks.PostToolUse` — runs AFTER every tool call
- `settings.json → sandboxing` — OS-level isolation
- `.claude/hooks/*.sh` — the actual enforcement scripts
- `--max-turns`, `--max-budget-usd` — hard caps
- `--allowedTools` — explicit tool restriction
- `harnesses/*/fixed_steps/` — deterministic pipeline

A harness that only has inside-loop controls is documentation, not
enforcement. This skill focuses on closing that gap.

---

## What to Read First

Before generating anything, read these files if they exist:

```
harnesses/*/blueprint.yaml       existing blueprint (update, don't replace)
.claude/settings.json            what deny rules and hooks are wired today
.claude/hooks/*.sh               what enforcement scripts exist and what they do
CLAUDE.md                        what guidance is in the reasoning loop
.noctua/progress.md              course position (determines harness maturity target)
student-state/preferences.md     review style (affects output verbosity)
```

If `blueprint.yaml` does not exist, create it at
`harnesses/<project-slug>/blueprint.yaml` where `<project-slug>` is
derived from the directory name or project context.

---

## Step 1 — Inventory

Read the files above and produce a classified inventory:

```
OUTSIDE LOOP (enforcement — will be written to blueprint.yaml):
  ✓ permissions.deny: [list tools actually denied]
  ✓ PreToolUse: [script name] — [what it does]
  ✓ PostToolUse: [script name] — [what it does]
  ✗ sandboxing: not configured
  ✗ max_turns: not set
  ✗ max_budget_usd: not set

INSIDE LOOP (guidance — noted in blueprint.yaml as flexible_steps):
  ~ CLAUDE.md: [key behavioral constraints listed]
  ~ skills: [skills present]
  ~ rules: [rules files present]

GAPS (outside-loop controls with no implementation):
  - No PostToolUse audit hook
  - No deny rules for destructive tools
  - No cost cap
```

Show this inventory to the student before proceeding. Ask: **"What
should be enforced that isn't yet?"** — then scaffold their answer.

---

## Step 2 — Scaffold Enforcement Gaps

For each gap the student wants to close, scaffold the minimum viable
implementation. Do not write complete security logic — write stubs that
work and that students understand and can extend.

**Hook stub pattern (`.claude/hooks/<name>.sh`):**

```bash
#!/usr/bin/env bash
# <hook-name>.sh — <one-line description>
# Receives tool call as JSON on stdin when triggered via PreToolUse/PostToolUse

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name','unknown'))" 2>/dev/null)

# Log every tool call (replace with real audit destination)
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] tool=$TOOL" >> ~/.claude/audit.log

# Exit 0 = allow. Exit non-zero = block.
exit 0
```

**settings.json hook wiring pattern:**

```json
{
  "permissions": {
    "deny": ["Bash(rm *)", "Bash(curl *)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": ".claude/hooks/validate_input.sh" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": ".claude/hooks/audit_log.sh" }]
      }
    ]
  }
}
```

After writing each hook, confirm it is executable:
```bash
chmod +x .claude/hooks/<name>.sh
```

---

## Step 3 — Write or Update blueprint.yaml

Write `harnesses/<project-slug>/blueprint.yaml` declaring every
outside-loop control that is now actually implemented.

**Blueprint schema:**

```yaml
# harnesses/<project-slug>/blueprint.yaml
name: <project-slug>
version: "1.0"
assessed_by: /harness-assess
built_by: /harness-build

boundary:
  allowed_tools: []          # explicit allowlist — leave empty if using deny-only
  denied_tools: []           # tools in permissions.deny
  max_turns: null            # --max-turns value, or null if not set
  max_budget_usd: null       # --max-budget-usd value, or null if not set
  sandboxing: false          # true if settings.json sandboxing is enabled

fixed_steps:                 # outside-loop enforcement — must exist in .claude/hooks/
  - event: PreToolUse
    script: .claude/hooks/validate_input.sh
    purpose: input validation
    blocks_on_failure: true
  - event: PostToolUse
    script: .claude/hooks/audit_log.sh
    purpose: audit logging
    blocks_on_failure: false

flexible_steps:              # inside-loop guidance — probabilistic
  - source: CLAUDE.md
    summary: <one-line summary of behavioral constraints>
  - source: .claude/skills/
    skills: []

aiuc1:                       # map outside-loop controls to AIUC-1 domains
  # A: Data & Privacy
  # B: Security
  # C: Safety
  # D: Reliability
  # E: Accountability
  # F: Society
  controls: []
  # example:
  # - domain: B
  #   control: tool_scope_restriction
  #   implemented_by: permissions.deny
  # - domain: E
  #   control: audit_logging
  #   implemented_by: PostToolUse hook

gaps:                        # honest record of what is not yet enforced
  - description: <gap>
    risk: <why it matters>
    next_action: <what to add>
```

Only write fields you have evidence for. Do not fill `aiuc1.controls`
until Unit 3 — leave the commented examples in place as a prompt.

---

## Step 4 — Show the Delta

After scaffolding, show the student what changed:

```
HARNESS DELTA — <project-slug>

ADDED (outside loop):
  + .claude/hooks/audit_log.sh (PostToolUse — logging)
  + .claude/hooks/validate_input.sh (PreToolUse — input gate)
  + settings.json: permissions.deny [Bash(rm *)]

UPDATED:
  ~ harnesses/<project-slug>/blueprint.yaml (created)

STILL MISSING (run /harness-assess to score):
  - sandboxing not configured
  - max_budget_usd not set
  - aiuc1 block empty (fill in Unit 3)

NEXT: /harness-assess to get your maturity score.
```

---

## Harness Maturity by Course Position

Use `.noctua/progress.md` to calibrate what gaps are acceptable now:

| Course Position | Minimum Viable Harness |
|---|---|
| Unit 1 (Weeks 1–4) | blueprint.yaml exists, one hook (logging), one deny rule |
| Unit 2 (Weeks 5–8) | Tool scope declared, input validation hook, deny rules wired |
| Unit 3 (Weeks 9–12) | `aiuc1:` block populated, all domains have a mapped control or documented gap |
| Unit 4 / Sprint | All fixed_steps/ from spec implemented and executable |
| Unit 7 (Production) | Full blueprint, all hooks implemented, no undocumented gaps, sandboxing configured |
| Unit 8 (Capstone) | Unit 7 standard + gap list empty or each gap has an accepted risk decision |

Do not pressure students to close every gap immediately. Flag what is
missing, note the expected maturity for their current position, and
leave the gaps honest in `blueprint.yaml`.

---

## When to Run

- At the start of any lab that involves building an agent
- After `/build-spec` when the spec is locked and building begins
- After `/worktree-setup` to wire harness controls into the new worktree
- After any sprint close, to advance harness maturity before the retro
- Before `/harness-assess` to make sure there is something to assess

Typical order:
```
/think → /build-spec → /worktree-setup → /harness-build → [build] → /check-antipatterns → /harness-assess → /retro
```

---

## What This Skill Does Not Do

- Does not write full security logic — stubs only
- Does not guarantee the hooks are correct — student must review and test
- Does not populate `aiuc1:` controls before Unit 3
- Does not replace `/harness-assess` — run assess after building
- Does not modify CLAUDE.md or flexible_steps — those are student-owned

---

## Installation

```bash
curl -o ~/.claude/commands/harness-build.md \
  https://raw.githubusercontent.com/r33n3/Noctua/main/docs/skills/harness-build.md
```

Or project-local:
```bash
curl -o .claude/commands/harness-build.md \
  https://raw.githubusercontent.com/r33n3/Noctua/main/docs/skills/harness-build.md
```
