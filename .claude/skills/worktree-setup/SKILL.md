---
name: worktree-setup
description: >
  Configure git worktrees for isolated parallel development. Wizard → yaml → tmux launch script.
  Includes sprint-progress.md, decisions.md coordination, and timezone-aware cost/limit guidance.
---

# /worktree-setup

You are a parallel worktree setup assistant. Follow these phases exactly.

---

## Phase 1: Check for existing config

Check if `.claude/worktrees.yaml` exists in the current repo root.

- If it exists, skip to **Phase 2: Generate**.
- If it does not exist, run **Phase 1: Wizard**.

---

## Phase 1: Wizard

Ask the user for the following. Collect all answers before proceeding.

1. **Base branch** — default: `main`. What branch should all worktrees branch from?
2. **Setup commands** — commands to run after creating each worktree (e.g. `bun install`, `npm install`). Can be empty.
3. **Issue source** — ask: _"Do you have a findings or issues file to import tasks from? (provide path, e.g. FINDINGS.md, or press Enter to skip)"_
   - If a path is provided, read the file and extract tasks:
     - Look for prioritized sections (`Critical`, `High`, `Medium`, `Low`) and import Critical + High by default
     - For each issue, generate a short slug `name` and use the issue text as the `description`
     - Present the extracted list for confirmation:
       ```
       Extracted N tasks from FINDINGS.md (Critical + High):
         1. fix-sql-injection     — SQL injection in /api/users (Critical)
         2. patch-auth-bypass     — Token not validated on /admin routes (High)
         ...
       Include Medium/Low items? Add or remove anything before continuing.
       ```
     - Confirm before proceeding
   - If skipped, collect tasks manually: for each task, get a `name` slug and `description` (user can paste from a GitHub issue, doc, or plain text)

Once task descriptions are collected, **scan the repository** to auto-detect shared risk files:

- Check for `package.json`, `package-lock.json`, `bun.lockb`, `yarn.lock`, `pnpm-lock.yaml`
- Check for `tsconfig*.json`, `vite.config.*`, `next.config.*`, `tailwind.config.*`, global config files
- Check for `src/types.ts`, `src/types/`, `lib/types.ts`, shared utility files referenced across tasks
- Look at any files that appear in multiple task descriptions or that sit at the root of shared modules

Present the auto-detected list to the user:

```
Detected shared risk files:
  - package.json
  - src/types.ts
  - ...

Add, remove, or confirm? (press Enter to accept)
```

After collecting all info, write `.claude/worktrees.yaml` using this schema:

```yaml
# .claude/worktrees.yaml
base_branch: <base_branch>
worktree_path: .claude/worktrees
max_worktrees: 4
tmux_session: worktrees
setup_commands:
  - <each setup command>
shared_risk_files:
  - <each shared risk file>
ignore_paths:
  - node_modules
  - .git
  - dist

tasks:
  - name: <task-name>
    description: |
      <task description>
```

Confirm with the user before writing.

Also ask: **"Is any task a foundation that others depend on?"**

If yes, identify the foundation task and offer two launch modes:
```
Dependency detected: <task> must complete before others go deep.

Launch mode:
  A) Sequential — launch <task> alone first, remaining agents after you confirm
  B) Parallel — launch all at once (agents will stub against missing artifacts)

Which? (A / B)
```

Store the choice in `worktrees.yaml` as `launch_mode: sequential | parallel` and `foundation_task: <name>`.

---

## Phase 2: Generate

Read `.claude/worktrees.yaml`. For each task in `tasks`:

### Step 1: Create the git worktree

```bash
git worktree add .claude/worktrees/<name> -b worktree-<name> <base_branch>
```

If the branch `worktree-<name>` already exists, use `--track` or skip creation and inform the user.

### Step 2: Run setup commands

Run each command in `setup_commands` inside the worktree directory:

```bash
cd .claude/worktrees/<name> && <setup_command>
```

### Step 3: Gather context for briefing

- Read the root `CLAUDE.md` if it exists — note key conventions, stack, patterns.
- Grep/glob the repo for files relevant to the task's description:
  - Search for filenames, function names, route patterns, component names mentioned in the description
  - Look at `src/`, `app/`, `lib/`, `routes/`, `components/`, `api/` etc.
  - Identify the 5–10 most relevant files the agent will likely need to touch
- Note which files belong to OTHER tasks (out-of-scope for this task)
- **Determine task size** based on file count and complexity:
  - **S** — < 5 files, isolated change (single route, single model, test update)
  - **M** — 5–15 files, feature work (new endpoint + model + repo + tests)
  - **L** — 15+ files, large refactor or cross-cutting change (affects multiple layers, many touch points)

### Step 3b: Create `decisions.md` in repo root (first task only)

On the first task, write `decisions.md` to the repo root if it doesn't exist:

```markdown
# decisions.md — Cross-Agent Questions

Agents: if you need a decision from another agent or the human, write it here.
Do not guess. Do not block. Write the question and continue with what you can.
The human checks this file periodically during the sprint.

## Open Questions

<!-- Format: [agent-name] question -->

## Resolved

<!-- Move answered questions here with the answer -->
```

### Step 3c: Create `sprint-progress.md` in repo root (first task only)

On the first task, write `sprint-progress.md` to the repo root if it doesn't exist:

```markdown
# sprint-progress.md — Agent Completion Status

The main session uses this file to coordinate PR merges in order.
Agents: update your row when you raise your PR. Do not modify other rows.

| Agent | Status | PR | Notes |
|---|---|---|---|
| <name> | in-progress | — | — |
| <name> | in-progress | — | — |
| <name> | in-progress | — | — |

## Merge order
1. <foundation-task>
2. <next-task>
3. <next-task>

## Memory captures (agents fill in — main session writes to memory after merge)

If you made a non-obvious decision, found a gotcha, or discovered something future agents
should know — add it here before raising your PR.

| Agent | What to remember |
|---|---|
| <name> | — |
| <name> | — |
| <name> | — |

## Memory updates (main session fills this after each merge)
<!-- Record what shipped and any open items that carry forward -->
```

Populate the table with all agent names and the merge order from the yaml.

---

### Step 4: Write `CLAUDE-<name>.md` into the worktree root

File path: `.claude/worktrees/<name>/CLAUDE-<name>.md`

Use this template, with the **Subagent strategy** section included only for L-sized tasks:

```markdown
# Task: <one-line summary of description> (`<name>`)

> **Read the root CLAUDE.md first** — it contains project-wide conventions, stack details, and coding standards that apply here.

## What I'm here to do

<2–4 sentences expanding on the task description. Be specific about the problem being solved and the expected outcome.>

## Branch

`worktree-<name>` — branched from `<base_branch>`

## Scope — files I should touch

<List the files inferred from the codebase scan. Include a brief note on why each is relevant.>

- `path/to/file.ts` — <why relevant>
- ...

## Out of scope — do NOT modify

These files are the primary responsibility of other worktrees in this sprint:

<List the primary files of other tasks>

- `path/to/other-task-file.ts` — owned by `<other-task-name>`
- ...

## Shared risk files

These files may be touched by multiple agents. ADD to them, do not overwrite. Mark your additions with a comment block if possible.

<List from worktrees.yaml shared_risk_files>

- `path/to/shared.ts`
- ...

## Acceptance criteria

- [ ] <Criterion 1 derived from description>
- [ ] <Criterion 2>
- [ ] <Criterion 3>
- [ ] All tests pass
- [ ] No regressions in shared risk files

<!-- INCLUDE THIS SECTION FOR L-SIZED TASKS ONLY -->
## Subagent strategy (L task — use parallel agents)

This task is large enough that working sequentially will be slow. Decompose it
using the Agent tool to run subtasks in parallel. Suggested breakdown:

- **Research agent** — read and summarise all files in Scope before writing any code.
  Dispatch first, wait for results before coding begins.
- **Implementation agents** — once research is complete, split implementation into
  independent subtasks (e.g. model layer, route layer, service layer) and dispatch
  in parallel where there are no dependencies between them.
- **Test agent** — dispatch after implementation is done to write/update tests.

Two-level parallelism available to you:
```
This worktree pane        ← isolated from other worktrees via git branch
  └── Agent tool          ← spawn subagents for research, implementation, tests
        └── subagent      ← inherits this directory's CLAUDE.md + CLAUDE-<name>.md
```

Subagents inherit both `CLAUDE.md` and `CLAUDE-<name>.md` automatically because
they run in the same working directory. You do not need to re-brief them on
conventions or scope — they already have it.

Keep subagent tasks small and focused: one file set per subagent is better than
one subagent for everything.
<!-- END L-TASK SECTION -->

## Setup

Run these commands if you haven't already:

```bash
<setup_commands from yaml>
```

## Suggested first steps

1. <Step 1 — e.g. read the relevant files listed in Scope>
2. <Step 2 — e.g. run existing tests to establish baseline>
3. <Step 3 — e.g. implement the core change>
4. <Step 4 — e.g. add/update tests>
5. <Step 5 — e.g. verify acceptance criteria>

## Cross-agent questions

If you need a decision from another agent or need the human to resolve something:
- Write it to `../../decisions.md` (repo root) under `## Open Questions`
- Format: `[<name>] <your question>`
- Do NOT block or guess — write the question and continue with what you can

## When you're done

Before raising your PR, update `../../sprint-progress.md`:
- Change your row's Status to `pr-raised`
- Add the PR URL to the PR column
- Add any open items or gotchas to Notes

If you made a non-obvious decision, found a gotcha, or discovered something future agents
should know — add it to the **Memory captures** table in `sprint-progress.md`. Examples:
  - "AuditEventRow.append() must be called before db.commit() or the record is lost"
  - "slowapi headers only work if SlowAPIMiddleware is registered — setup_rate_limiter() alone is not enough"
  - "allowance_profile_version must be nullable — task packets created before versioning have no version"

These get written to project memory by the main session after merge. If it's not worth
remembering across future sprints, leave the cell as `—`.

Then raise your PR:
```bash
git fetch origin && git rebase origin/main
gh pr create --title "<task summary>" --base main
```

Do NOT merge directly to main — the main session coordinates merges in order.

## Pre-merge checklist

Before considering this task done:
- [ ] All acceptance criteria above are met
- [ ] Tests pass (`pytest` or equivalent)
- [ ] No modifications to out-of-scope files
- [ ] Shared risk files: only additions, no overwrites
- [ ] `decisions.md` checked — any open questions from this task resolved or escalated
- [ ] `sprint-progress.md` updated — Status=pr-raised, PR URL filled in
- [ ] Branch is clean — no debug code, no commented-out blocks, no TODOs without tickets
- [ ] **If task touches error handling or external integrations:** run `/check-antipatterns` and fix all CRITICAL findings before raising PR
- [ ] **If task gates on autonomy elevation or governance controls:** run `/audit-aiuc1` before raising PR
- [ ] Raise a PR — do NOT merge directly to main:
      `git fetch origin && git rebase origin/main`
      `gh pr create --title "<task summary>" --base main`
```

### Step 5: Write `launch-worktrees.sh` to the repo root

Use this layout logic based on task count:

**1 task:**
```bash
#!/usr/bin/env bash
SESSION="worktrees"
tmux new-session -d -s "$SESSION" -c "$(pwd)/.claude/worktrees/<task1>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux attach -t "$SESSION"
```

**2 tasks:**
```bash
#!/usr/bin/env bash
SESSION="worktrees"
tmux new-session -d -s "$SESSION" -c "$(pwd)/.claude/worktrees/<task1>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux split-window -h -t "$SESSION" -c "$(pwd)/.claude/worktrees/<task2>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux attach -t "$SESSION"
```

**3 tasks:**
```bash
#!/usr/bin/env bash
SESSION="worktrees"
tmux new-session -d -s "$SESSION" -c "$(pwd)/.claude/worktrees/<task1>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux split-window -h -t "$SESSION" -c "$(pwd)/.claude/worktrees/<task2>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux split-window -v -t "$SESSION" -c "$(pwd)/.claude/worktrees/<task3>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux select-pane -t "$SESSION:0.0"
tmux attach -t "$SESSION"
```

**4 tasks:**
```bash
#!/usr/bin/env bash
SESSION="worktrees"
tmux new-session -d -s "$SESSION" -c "$(pwd)/.claude/worktrees/<task1>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux split-window -h -t "$SESSION" -c "$(pwd)/.claude/worktrees/<task2>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux select-pane -t "$SESSION:0.0"
tmux split-window -v -t "$SESSION" -c "$(pwd)/.claude/worktrees/<task3>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux select-pane -t "$SESSION:0.1"
tmux split-window -v -t "$SESSION" -c "$(pwd)/.claude/worktrees/<task4>"
tmux send-keys -t "$SESSION" "claude" Enter
tmux select-pane -t "$SESSION:0.0"
tmux attach -t "$SESSION"
```

After writing `launch-worktrees.sh`, make it executable:

```bash
chmod +x launch-worktrees.sh
```

Add this comment block at the top of every generated `launch-worktrees.sh`:

```bash
# Run from repo root: cd /path/to/repo && ./launch-worktrees.sh
# Tmux navigation: Ctrl+B + arrow keys to switch panes | Ctrl+B q to jump by number
# When agents finish: check sprint-progress.md, then merge PRs in order from main session
# Do NOT direct-merge from worktree panes — coordinate from the main session
```

---

## Phase 3: Summary

Print a sprint overview in this format:

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        SPRINT OVERVIEW                                   ║
╚══════════════════════════════════════════════════════════════════════════╝

  Agent            Branch                  Scope       Size    Est. Cost    Est. Time
  ─────            ──────                  ─────       ────    ─────────    ─────────
  <name>           worktree-<name>         N files     S/M/L   ~$0.XX       ~X min
  ...

  Total agents: N   |   Combined est. cost: ~$X.XX   |   Wall-clock time: ~X min
  (Agents run in parallel via tmux — wall-clock ≈ longest single task)
  (L tasks use internal subagents — wall-clock includes subagent dispatch overhead ~2–3 min)

Size key:  S = <5 files touched   M = 5–15 files   L = 15+ files (uses subagent strategy)
Cost note: Estimates assume Claude Sonnet 4.6. Actual cost varies with context depth.
           L tasks spawn subagents internally — multiply per-task estimate by ~1.5×.

Token & subscription impact:
  Approximate token consumption per task size:
    S task  —  ~30–80K input  /  ~8–15K output
    M task  —  ~80–200K input /  ~20–40K output
    L task  —  ~250K–600K input / ~60–150K output  (subagents compound input ~3–5×)

  This sprint: ~<sum input>K input / ~<sum output>K output tokens (fill in from table above)

  Subscription impact (approximate — Anthropic does not publish exact token→usage-unit mapping):
    Pro  ($20/mo)  — each M task ≈ 5–15% of daily allowance. Run ≤2 M tasks in parallel.
                     Avoid L tasks with subagents on Pro — may exhaust daily limit mid-sprint.
    Max  ($100/mo) — each M task ≈ 1–5% of daily allowance. Parallel launch is fine.
    Max  ($200/mo) — 4× L tasks with subagents is comfortable. 6+ agents start to matter.

  ⚠ Check your usage before launching a large sprint:
      claude.ai/settings/usage  (web)
      /usage                    (Claude Code CLI)
    If near your daily limit, launch the foundation task only and run the rest tomorrow.

  Note: these are estimates. Actual usage depends on codebase size, error recovery loops,
  and how many files the agent reads. Monitor the first sprint to calibrate for your project.

Best time to run large sprints (community-observed patterns — not official Anthropic docs):
  Large parallel worktree sprints (L tasks, 4+ agents) run best during off-peak hours.
  During peak weekday hours, shared infrastructure demand can cause faster limit depletion
  and slower response. These windows are community-observed, not guaranteed:

  ┌─────────────────┬──────────────┬──────────────┬────────────────────────────┐
  │ Window          │ Pacific (PT) │ Central (CT) │ Recommendation             │
  ├─────────────────┼──────────────┼──────────────┼────────────────────────────┤
  │ Peak — avoid    │ 5am – 11am   │ 7am – 1pm    │ Skip large sprints here    │
  │ Off-peak — good │ Before 5am   │ Before 7am   │ Good for S/M tasks         │
  │ Off-peak — best │ After 11am   │ After 1pm    │ Best for L tasks + subagts │
  │ Weekend         │ All day      │ All day      │ Optimal — run sprints here  │
  └─────────────────┴──────────────┴──────────────┴────────────────────────────┘

  For students and learners specifically:
  - Run your first sprint on a weekend or weekday afternoon (CT after 1pm) so you
    are not fighting peak demand while learning the workflow
  - Pro plan: avoid launching 4+ parallel agents during peak hours — you may hit
    your daily limit before all agents finish
  - Max plan: parallel launch is fine any time, but weekend afternoons still give
    the smoothest experience for L tasks with subagents

  Additional tips for large context sprints:
  - Use /compact in Claude Code after finishing major sub-tasks to compress history
    and stay within the 5-hour session window
  - Add a .claudeignore file to exclude node_modules/, dist/, .git/, __pycache__/
    from context loading — these can waste thousands of tokens per read
  - Start a fresh chat for each major sprint rather than continuing a long session —
    compacted history still consumes context budget
  - Model selection: Opus 4.6 for planning and reasoning, Sonnet 4.6 for coding tasks

Parallelism model:
  tmux panes  ← worktree level (one feature per pane, isolated git branches)
    └── Agent tool  ← within-worktree level (L tasks decompose into subagent teams)
          └── subagents inherit CLAUDE.md + CLAUDE-<name>.md automatically

Memory boundary:
  Worktree agents write to path-scoped memory (different namespace than main session).
  Cross-sprint memory updates should be made from the MAIN SESSION after merges,
  not from within worktree panes.

Briefings:
  <name>  →  .claude/worktrees/<name>/CLAUDE-<name>.md

Coordination files (in repo root — readable by all agents):
  decisions.md        ← cross-agent questions and answers
  sprint-progress.md  ← agent completion status and PR URLs

Merge order — use PRs, NOT direct merge (avoids shared risk file conflicts):
  1. <foundation-task> first
  2. <next-task>
  3. <next-task>
  ...
  For each task IN ORDER (run from MAIN SESSION, not from worktree panes):
    cd .claude/worktrees/<name>
    git fetch origin && git rebase origin/main   # pick up previous merges
    gh pr create --title "<task>" --base main
    # merge PR, then move to next task

  After each merge, update sprint-progress.md and write a project memory entry
  noting what shipped and any open items that carry forward.

  Direct merge causes conflicts on router.py, __init__.py, etc.
  Sequential PRs with rebase keep each conflict surface to one branch at a time.
  Check decisions.md before resolving any shared risk file conflicts.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO DO NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1 — Launch agents (from repo root in your terminal):

  cd /path/to/repo
  ./launch-worktrees.sh

Step 2 — Navigate tmux panes while agents work:

  Ctrl+B → arrow keys    switch panes
  Ctrl+B → q             show pane numbers, press number to jump
  Ctrl+B → d             detach (leaves agents running in background)

Step 3 — Monitor during the sprint:

  Check decisions.md     agents write cross-agent questions here — answer them
  Check sprint-progress.md  shows each agent's status and PR URL when raised

Step 4 — When all agents have raised PRs, merge in order (from THIS session):

  Reattach if needed:  tmux attach -t worktrees

  For each task IN ORDER:
    cd .claude/worktrees/<name>
    git fetch origin && git rebase origin/main
    gh pr create --title "<task summary>" --base main
    # merge the PR on GitHub, then move to the next task

  Merge order:
    1. <foundation-task>
    2. <next-task>
    3. <next-task> (rebase picks up previous merges automatically)

Step 5 — After all PRs merged:

  Run /retro to update CLAUDE.md, clear decisions.md and sprint-progress.md,
  and write project memory entries for what shipped.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Cost estimation guidance** (use when generating the table above):

- **S task** (< 5 files, isolated change): ~$0.05–$0.15, ~5–10 min · ~30–80K input / ~8–15K output tokens
- **M task** (5–15 files, feature work): ~$0.15–$0.50, ~10–20 min · ~80–200K input / ~20–40K output tokens
- **L task** (15+ files, large refactor or cross-cutting): ~$0.50–$2.00, ~20–45 min · ~250–600K input / ~60–150K output tokens
  - L tasks spawn subagents — multiply estimate by ~1.5× for subagent overhead
  - Wall-clock for L tasks is shorter than sequential because subagents run in parallel
- Add ~$0.05 / ~10K tokens per task for initial repo scan and briefing generation
- Wall-clock time for parallel tmux run = estimate of the single longest task
- Fill in the "Token & subscription impact" block in the sprint summary using these ranges × task count

---

## Notes

- If a worktree already exists at `.claude/worktrees/<name>`, skip `git worktree add` and regenerate the briefing file only.
- If `max_worktrees` is set, warn if the task count exceeds it.
- The `launch-worktrees.sh` script uses `$(pwd)` at write time — it must be run from the repo root: `cd /path/to/repo && ./launch-worktrees.sh`
- Each `claude` process launched in a worktree will read both `CLAUDE.md` (project conventions) and `CLAUDE-<name>.md` (task briefing) automatically — subagents it spawns via the Agent tool inherit the same working directory and both files.
- **Tmux navigation** — switch between panes with `Ctrl+B` then arrow keys. `Ctrl+B q` shows pane numbers for direct jump. Only one pane is active at a time even though all are visible.
- **Never direct-merge worktrees to main** — always use PRs with sequential rebase. Direct merge causes conflicts on shared risk files (router.py, __init__.py, etc.) across all branches simultaneously.
- **Memory boundary** — worktree agents run at a different path than the main session, so their auto-memory writes land in a separate namespace. Make project-level memory updates from the main session after merges, not from within worktree panes.
- **sprint-progress.md is the coordination surface** — agents update it when done; the main session reads it to know when to start merging. Do not use decisions.md for completion status.
