---
name: worktree-setup
description: >
  Configure git worktrees for isolated parallel development. Given a spec,
  generates shell commands to create per-component worktrees, drops TASK.md
  and AGENTS.md into each, installs pre-commit hooks, and provides
  merge/cleanup sequence. Bridges spec → parallel build execution.
---

# /worktree-setup — Parallel Development Environment Setup

Configure git worktrees so multiple agents, developers, or Codex
sessions can work on separate components simultaneously in isolated
directories — without branch conflicts, stashing, or context switching.

This skill supports the Build phase of the Think → Spec → Build → Retro
cycle. Use after `/spec` has defined the components to build in parallel.

Each worktree is an isolation boundary. Failures in one don't contaminate
another. The harness you configure here — hooks, suppressed output, scoped
specs — is what keeps agents on track while they work.

---

## What to Do

Given a spec or project description, produce the exact shell commands to:

1. Create a worktree for each major component/agent on its own branch
2. Drop the spec (as TASK.md) and relevant AGENTS.md into each worktree
3. Configure pre-commit hooks and output suppression in each worktree
4. Set up a minimal project structure
5. Create a `WORKTREES.md` map so the team knows what's where
6. Provide the merge commands to integrate completed work

---

## Sub-Agent Decision Framework

Before creating worktrees, decide: does this task need sub-agents?

- **One worktree:** spec has one coherent concern, agent can hold all
  context, task is sequential by nature
- **Multiple worktrees:** spec has 3+ distinct pieces, components are
  truly independent (no shared state during build), parallel execution
  would meaningfully compress build time

If in doubt, start with one. Split when you hit context pressure.

---

## Output Format

```
## Worktree Setup: [Project Name]

### Components
[List the components from the spec that will be developed in parallel]

### Sub-agent decision
[One/Multiple — rationale]

### Commands

# Create feature branches and worktrees
git checkout main
git pull origin main

git worktree add ../[project]-[component1] -b feature/[component1]
git worktree add ../[project]-[component2] -b feature/[component2]
git worktree add ../[project]-[component3] -b feature/[component3]

# Verify
git worktree list

### Directory Map

| Worktree Directory         | Branch                 | Developer / Agent | Component       |
|----------------------------|------------------------|-------------------|-----------------|
| ../[project]-[component1]  | feature/[component1]   | [name]            | [what it builds]|
| ../[project]-[component2]  | feature/[component2]   | [name]            | [what it builds]|

### Each worktree gets:

# Drop scoped spec into each worktree as TASK.md
cp SPEC.md ../[project]-[component1]/TASK.md
# (scope each TASK.md to only the section relevant to that component)

# Copy AGENTS.md so agents have project context
cp AGENTS.md ../[project]-[component1]/AGENTS.md 2>/dev/null || true

# Copy AGENTS.md
cp AGENTS.md ../[project]-[component1]/AGENTS.md 2>/dev/null || true

### Pre-commit hooks (install in each worktree)

# Install hooks that the agent will hit during execution, not after review
cat > ../[project]-[component1]/.git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Linting
python -m flake8 . --max-line-length=100 --exclude=.git,venv
# Type checking
python -m mypy . --ignore-missing-imports 2>/dev/null || true
# Fast tests only (< 5s)
python -m pytest tests/unit/ -q --timeout=5 2>/dev/null || true
EOF
chmod +x ../[project]-[component1]/.git/hooks/pre-commit

### Output suppression (configure test runner)

# Feed the agent ONLY failures — passing tests rot the context window
# In pytest.ini or pyproject.toml for each worktree:
[tool.pytest.ini_options]
addopts = "-q --tb=short --no-header -rN"
# -rN = suppress all passed/skipped notices, show only failures

### Integration (when a component is ready)
git checkout main
git merge feature/[component1] --no-ff -m "feat: integrate [component1]"
git worktree remove ../[project]-[component1]

### Cleanup all worktrees (when build is done)
git worktree list
git worktree prune
```

---

## When to Use

- Before any multi-agent sprint where different components are built in parallel
- When working with a team — each developer gets a worktree, not a branch conflict
- When running multiple Codex sessions simultaneously on the same project
- Before capstone Sprint I — set up worktrees for each agent on day one

---

## Modify This Skill

- Add your team's standard README template to the per-worktree setup
- Expand the pre-commit hooks with your specific linters and test suites
- Add a security-specific hook: run Bandit or detect-secrets on every commit
- Create a `/worktree-agent` variant that pairs each worktree with a named
  Codex session for a specific agent role
- Add output suppression config for your test framework (Jest, Go test, etc.)
- Customize the TASK.md template to always include your anti-requirements
  section from the spec

---

## Installation

Save as `~/.Codex/commands/worktree-setup.md` (global) or
`.Codex/commands/worktree-setup.md` (project-local).

Use `/worktree-setup` after your `/spec` is approved and you're ready
to begin parallel development.
