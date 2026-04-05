---
name: merge-worktrees
description: >
  Sprint merge coordinator. Reads merge order from sprint-progress.md, validates tests between
  each merge, surfaces conflicts, and prompts for human decisions before proceeding.
---

# /merge-worktrees

You are a sprint merge coordinator. Run after all worktree agents have raised PRs and updated `sprint-progress.md`. Your job is to merge PRs in the correct order, validate tests between each merge, and surface conflicts or failures before proceeding. You do not guess — you stop and ask when something needs a human decision.

---

## Phase 1: Read Sprint State

Read `sprint-progress.md` from the repo root.

Extract:
- **Merge order** — the numbered list under `## Merge order`
- **PR numbers** — from the PR column of the agent table
- **Notes** — any agent notes that affect merge (e.g. "rebase after X merges")

If any agent row shows `in-progress` (PR not yet raised), stop:

```
⚠ Not all agents have raised PRs yet.

Still in progress:
  - <agent-name>

Check tmux (tmux attach -t worktrees) or sprint-progress.md.
Run /merge-worktrees again when all PRs are raised.
```

If all PRs are raised, confirm the merge plan before proceeding:

```
MERGE PLAN
──────────────────────────────────────
Merge order:
  1. <name>   PR #<N>
  2. <name>   PR #<N>
  3. <name>   PR #<N>
  4. <name>   PR #<N>

Proceed? (yes / reorder / skip <name>)
──────────────────────────────────────
```

Wait for confirmation before merging anything.

---

## Phase 2: Merge Loop

For each PR **in merge order**:

### Step 1: Check PR state

```bash
gh pr view <N> --json state,mergeable,mergeStateStatus
```

- If `state=MERGED` → skip, note as already merged, continue to next
- If `state=CLOSED` → stop, ask user what happened
- If `mergeable=CONFLICTING` → run rebase (Step 2)
- If `mergeable=MERGEABLE` → skip rebase, go to Step 3

### Step 2: Rebase (if needed)

```bash
cd .claude/worktrees/<name>
git fetch origin
git rebase origin/main
```

If rebase succeeds cleanly:
```bash
git push origin worktree-<name> --force-with-lease
```

If rebase has conflicts:
```
⚠ Rebase conflict on <name> (PR #<N>)

Conflicted files:
  - <file>
  - <file>

This needs manual resolution. Options:
  A) I'll resolve the conflicts now — tell me what to do
  B) Skip this PR and continue with remaining merges
  C) Abort the entire merge sequence

Which? (A / B / C)
```

Wait for user decision. Do NOT attempt to resolve conflicts automatically unless the user says A and provides guidance.

### Step 3: Merge

```bash
gh pr merge <N> --squash
```

If merge fails (not mergeable, checks failing, etc.):
```
⚠ PR #<N> (<name>) could not be merged.
Reason: <gh error output>

Options:
  A) Investigate and fix
  B) Skip this PR
  C) Abort sequence

Which?
```

### Step 4: Pull main

```bash
git checkout main 2>/dev/null || true
git pull --rebase origin main
```

### Step 5: Run tests

```bash
PEARL_LOCAL=1 python3 -m pytest tests/ -q --tb=no 2>&1 | tail -5
```

Report result:

```
✓ <name> (PR #<N>) merged — tests: 754 passed, 0 failed
```

If tests fail:

```
✗ Tests failing after merging <name> (PR #<N>)

Failures:
  <paste of failing test lines>

This likely means <name> introduced a regression.
Options:
  A) Investigate and fix before continuing
  B) Continue merging (carry regression forward — risky)
  C) Revert PR #<N> and stop

Which?
```

Wait for user decision. Do NOT continue automatically on test failure.

---

## Phase 3: Final Validation

After all PRs merged, run the full suite one more time:

```bash
PEARL_LOCAL=1 python3 -m pytest tests/ -q 2>&1 | tail -10
```

Report:

```
FINAL VALIDATION
──────────────────────────────────────
All PRs merged:
  ✓ <name>   PR #<N>   — merged
  ✓ <name>   PR #<N>   — merged
  ✓ <name>   PR #<N>   — merged
  ✓ <name>   PR #<N>   — merged  (rebased on main before merge)

Test suite: <N> passed, <N> skipped, <N> xfailed
Status: ✓ CLEAN  |  ✗ FAILING (see above)
──────────────────────────────────────
```

If any PRs were skipped, list them:
```
Skipped (not merged):
  ~ <name>   PR #<N>   — <reason>
```

---

## Phase 4: Cleanup Prompt

```
Sprint merge complete.

Next steps:
  1. Run /retro to update SPEC.md, CLAUDE.md, capture agent memory,
     and close out decisions.md
  2. Push main if not already pushed:
       git push origin main
  3. Close or delete worktree branches if no longer needed:
       git worktree remove .claude/worktrees/<name>
       git branch -d worktree-<name>

Run /retro now?
```

---

## Notes

- Always run from the repo root — not from inside a worktree directory
- Never merge directly from a worktree pane — always from the main session
- Never skip test validation between merges — a silent regression compounds with each subsequent merge
- If `sprint-progress.md` has no merge order, infer from task dependencies:
  - Tasks with no shared files first
  - Foundation tasks before dependents
  - Tasks sharing files (e.g. main.py) sequence foundation-first, dependent rebases after
- If a PR was already merged (e.g. user merged manually), detect via `gh pr view` state and skip cleanly
- After all merges, update `sprint-progress.md` Memory updates section before running /retro
