---
name: harness-build
description: >
  Build the enforcement harness for a deployed AI agent project. Reads
  the agent codebase to understand what it does, then produces
  harnesses/<agent>/blueprint.yaml and scaffolds fixed_steps/ pipeline
  scripts. Unit 7 and Unit 8 only — this is a production readiness
  tool, not a lab scaffold.
---

# /harness-build — Build an Agent Harness

Use this skill when preparing an agent project for production deployment.
It formalizes the enforcement boundary around a built agent: what inputs
are validated, what outputs are filtered, what runs deterministically
regardless of model decisions.

Run `/harness-assess` after to score the result.

---

## Where the Harness Lives

The harness is a project artifact, committed and versioned alongside the
agent code:

```
project/
  harnesses/
    <agent-name>/
      blueprint.yaml      ← boundary declaration
      fixed_steps/        ← deterministic pipeline (always fires)
      flexible_steps/     ← AI-driven steps (guidance, not enforcement)
```

`fixed_steps/` is the agent's own deterministic pipeline — input
validation, context injection, output filtering, audit logging. These
run regardless of what the model decides.

This is separate from `.claude/settings.json` and `.claude/hooks/`,
which are Claude Code's session-level enforcement. Both matter, but
they are different layers. Note what `.claude/` controls exist but do
not treat them as the harness.

---

## Step 1 — Read the Agent

Before writing anything, read the agent codebase:

- What tools does it call?
- What external systems does it reach?
- What inputs does it accept? From where?
- What does it output? To whom?
- What can go wrong if the model does the wrong thing?

This determines what `fixed_steps/` needs to enforce.

---

## Step 2 — Scaffold fixed_steps/

Create `harnesses/<agent-name>/fixed_steps/` with the minimum viable
pipeline for this agent. Each step is a script that runs deterministically.

**Standard steps to consider:**

```
fixed_steps/
  01_validate_input.py    ← schema/type check all inputs before agent sees them
  02_inject_context.py    ← add required context (user role, env, constraints)
  03_filter_output.py     ← strip PII, secrets, or disallowed content from response
  04_audit_log.py         ← record tool calls, decisions, timestamps
```

Not every agent needs all four. Only scaffold what the agent's risk
profile requires. A read-only analysis agent needs input validation and
audit logging. A write-capable agent also needs output filtering and
context injection.

**Stub pattern — each step should be minimal and readable:**

```python
#!/usr/bin/env python3
"""
fixed_steps/01_validate_input.py
Validates agent input before passing to the model.
Exit 0 = pass. Non-zero = block.
"""
import sys
import json

def validate(payload: dict) -> bool:
    # TODO: add validation logic for this agent's input schema
    return True

if __name__ == "__main__":
    try:
        payload = json.load(sys.stdin)
        if not validate(payload):
            print("Input validation failed", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"Validation error: {e}", file=sys.stderr)
        sys.exit(1)
```

Stubs are intentional. Students write the validation logic. The
scaffold gets them past the structural friction.

---

## Step 3 — Write blueprint.yaml

Write `harnesses/<agent-name>/blueprint.yaml` declaring the boundary.
Only declare what is actually implemented.

```yaml
# harnesses/<agent-name>/blueprint.yaml
name: <agent-name>
version: "1.0"

# What this agent is and what it touches
description: <one sentence>
inputs:
  - source: <where input comes from>
    schema: <what shape it takes>
outputs:
  - destination: <where output goes>
    schema: <what shape it takes>
tools:
  - <tool-1>
  - <tool-2>
external_systems:
  - <system-1>

# Deterministic enforcement pipeline
fixed_steps:
  - script: fixed_steps/01_validate_input.py
    purpose: input validation
    blocks_on_failure: true
  - script: fixed_steps/04_audit_log.py
    purpose: audit logging
    blocks_on_failure: false

# AI-driven steps (guidance, not enforcement)
flexible_steps:
  - source: CLAUDE.md
    summary: <key behavioral constraints>

# Claude Code session enforcement (separate layer, noted here for completeness)
claude_code_enforcement:
  settings_json: .claude/settings.json
  hooks: .claude/hooks/
  deny_rules: []   # list tools blocked via permissions.deny

# AIUC-1 domain controls
aiuc1:
  controls: []
  # - domain: B   # Security
  #   control: input_validation
  #   implemented_by: fixed_steps/01_validate_input.py
  # - domain: E   # Accountability
  #   control: audit_logging
  #   implemented_by: fixed_steps/04_audit_log.py

# Honest gap record
gaps:
  - description: <gap>
    risk: <why it matters>
    accepted: false
    next_action: <what to add>
```

---

## Step 4 — Show the Harness

After scaffolding, present a summary:

```
HARNESS: <agent-name>

fixed_steps/ (deterministic — always fires):
  ✓ 01_validate_input.py
  ✓ 04_audit_log.py
  ✗ output filtering — not implemented (gap recorded)

flexible_steps/ (guidance — probabilistic):
  ~ CLAUDE.md behavioral constraints

Claude Code enforcement (session layer):
  ~ settings.json: [any deny rules noted]
  ~ hooks: [any hooks noted]

blueprint.yaml: written to harnesses/<agent-name>/blueprint.yaml

NEXT: /harness-assess to score this harness.
```

---

## When to Run

Unit 7 and Unit 8 only.

- Unit 7: Before the role review gate. Agent is built, code is clean
  (checked by /check-antipatterns), now formalize the enforcement boundary.
- Unit 8: Required capstone deliverable. blueprint.yaml is graded.

Workflow:
```
[build] → /check-antipatterns → /harness-build → /harness-assess → /retro
```

---

## Installation

```bash
curl -o ~/.claude/commands/harness-build.md \
  https://raw.githubusercontent.com/r33n3/Noctua/main/docs/skills/harness-build.md
```
