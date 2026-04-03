---
name: harness-assess
description: >
  Assess an environment's agent harness using repo evidence, config,
  prompts, policies, and runtime controls. Distinguish implemented,
  partial, implied, and missing controls. Use for course environments,
  agent repos, and orchestration setups.
---

# /harness-assess - Assess an Agent Harness

Use this skill to assess whether an agent environment is actually
harnessed, not merely described well.

This skill reviews the real control surface of a repo or workflow:
entrypoints, prompts, tools, permissions, state, policies, gates,
logging, secrets, and misuse resistance. It is not the harness itself.
It is the method for diagnosing whether a harness exists, how strong it
is, and what should be improved next.

Trigger this skill when you need to review a course setup, agent repo,
multi-agent workflow, or production environment and determine what
controls are implemented versus only implied.

---

## What a Harness Is

A harness is the system that shapes and constrains agent behavior.

It includes:
- entrypoints and orchestration flow
- tool access and restrictions
- permission and approval controls
- context, memory, and session state
- system instructions and prompt construction
- logging, auditability, and recovery behavior
- environment separation, secrets boundaries, and policy gates

If these controls are only described in prose, they are not fully
implemented. Treat non-enforceable guidance as weaker than runtime
control.

---

## Assessment Principles

Assess from evidence, not intent.

For every claim, determine whether it is:
- **Implemented** - enforced in code, config, or deterministic runtime logic
- **Partial** - present, but incomplete, inconsistent, or easy to bypass
- **Implied** - described in docs or prompts, but not clearly enforced
- **Missing** - no meaningful evidence found

Always distinguish:
- prompt guidance vs runtime enforcement
- human process vs machine-checked control
- recommended behavior vs required behavior

Missing controls are meaningful findings, not neutral absences.

---

## What to Inspect

Review the environment across these areas:

1. **Entrypoint / orchestration**
   How sessions start, what loads first, and how control flows.

2. **Tool control**
   Which tools exist, who can call them, and what restrictions apply.

3. **Permission / approval model**
   Human approval, allowlists, deny rules, escalation behavior, and
   default fail-open vs fail-closed behavior.

4. **Context / memory handling**
   Student state, session files, memory injection, persistence, and
   single source of truth.

5. **Prompt / instruction management**
   System prompts, root instructions, policy files, and whether critical
   controls are immutable or replaceable.

6. **Multi-agent coordination**
   Subagents, delegation, isolation, shared context, and handoff rules.

7. **Recovery / resilience**
   Error handling, retries, rollback assumptions, and restart behavior.

8. **Logging / auditing**
   Decision logs, progression logs, approval logs, and traceability.

9. **Secrets / identity handling**
   Tokens, env vars, credential access, and exposure in logs or prompts.

10. **Policy / environment gating**
   Sandbox boundaries, environment separation, progression gates,
   deployment gates, and policy checks.

11. **Human-in-the-loop controls**
   Required approvals, reviewer checkpoints, and blocked actions.

12. **Injection / misuse resistance**
   Prompt injection handling, malicious inputs, unsafe tool abuse,
   untrusted artifacts, and adversarial student or user content.

---

## How to Judge Quality

Ask:
- What is actually enforced?
- What depends on the model "doing the right thing"?
- What can drift because it only lives in markdown?
- What state is canonical, and what state is duplicated?
- What action is blocked automatically if the agent is wrong?
- What evidence exists for why a progression or approval decision was made?

Strong harnesses make unsafe behavior difficult. Weak harnesses explain
safe behavior but do not reliably enforce it.

---

## Output Format

Use this structure:

```markdown
# Harness Assessment

## 1. Executive Summary
- [3 to 7 bullets summarizing maturity and major gaps]
- Overall maturity: [Minimal / Emerging / Functional / Strong / Advanced]

## 2. Harness Component Review

### Entrypoint / orchestration
- Status: [Implemented / Partial / Implied / Missing / Unclear]
- Evidence: [files, functions, configs, patterns]
- Risk: [why this matters]
- Recommendation: [what to improve]

### Tool control
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Permission / approval model
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Context / memory handling
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Prompt / instruction management
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Multi-agent coordination
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Recovery / resilience
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Logging / auditing
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Secrets / identity handling
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Policy / environment gating
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Human-in-the-loop controls
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

### Injection / misuse resistance
- Status: ...
- Evidence: ...
- Risk: ...
- Recommendation: ...

## 3. Highest-Risk Gaps
1. [gap]
2. [gap]
3. [gap]
4. [gap]
5. [gap]

## 4. Fast Wins
1. [improvement]
2. [improvement]
3. [improvement]
4. [improvement]
5. [improvement]

## 5. Evidence Table
| Area | Status | Evidence | Confidence |
|------|--------|----------|------------|
| [area] | [status] | [evidence] | [High / Medium / Low] |

## 6. Final Verdict
- Harness maturity score: [1-10]
- Confidence score: [1-10]
- [One paragraph on readiness for higher-risk use]
```

---

## When to Use

- When reviewing an agent repo, toolchain, or runtime environment
- When deciding whether a course or workflow teaches good harness design
- Before deploying an agent system into higher-risk environments
- After a retro, to convert lessons into concrete control improvements
- When comparing two environments to see which is more enforceable

---

## Modify This Skill

- Add domain-specific sections for security, compliance, or education
- Add a maturity rubric tailored to course harnesses
- Add explicit checks for progression gates and student-state schemas
- Add environment-specific forbidden patterns and high-risk defaults
- Create a `/harness-assess-course` variant for teaching environments

---

## Installation

Save as `~/.Codex/commands/harness-assess.md` (global) or
`.Codex/commands/harness-assess.md` (project-local).

Use `/harness-assess` to inspect whether an environment is genuinely
harnessed, where it is weak, and what should be improved next.
