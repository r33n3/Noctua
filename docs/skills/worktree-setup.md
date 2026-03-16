# /worktree-setup — Parallel Development Environment Setup

Configure git worktrees so multiple agents, developers, or Claude Code
sessions can work on separate components simultaneously in isolated
directories — without branch conflicts, stashing, or context switching.

This skill supports the Build phase of the Think → Spec → Build → Retro
cycle. Use after `/spec` has defined the components to build in parallel.

---

## What to Do

Given a spec or project description, produce the exact shell commands to:

1. Create a worktree for each major component/agent on its own branch
2. Set up a minimal project structure in each worktree
3. Create a `WORKTREES.md` map so the team knows what's where
4. Provide the merge commands to integrate completed work

---

## Output Format

```
## Worktree Setup: [Project Name]

### Components
[List the components from the spec that will be developed in parallel]

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
- README.md describing the component
- requirements.txt (if Python)
- Shared CLAUDE.md from parent repo (symlink or copy)

# Set up structure in each worktree
for dir in ../[project]-*; do
  echo "# $(basename $dir)" > $dir/README.md
  cp CLAUDE.md $dir/CLAUDE.md 2>/dev/null || true
done

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

- Before any multi-agent sprint where different agents are built in parallel
- When working with a team — each developer gets a worktree, not a branch conflict
- When running multiple Claude Code sessions simultaneously on the same project
- Before capstone Sprint I — set up worktrees for each agent on day one

---

## Modify This Skill

- Add your team's standard README template to the per-worktree setup
- Add automatic CLAUDE.md propagation to all worktrees
- Add a `git log --oneline --graph` summary at the end to show branch state
- Create a `/worktree-agent` variant that pairs each worktree with a
  named Claude Code session for a specific agent role
- Add pre-commit hook installation to each new worktree

---

## Installation

Save as `~/.claude/commands/worktree-setup.md` (global) or
`.claude/commands/worktree-setup.md` (project-local).

Use `/worktree-setup` after your `/spec` is approved and you're ready
to begin parallel development.
