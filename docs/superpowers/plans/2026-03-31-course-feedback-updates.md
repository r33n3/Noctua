# Course Feedback Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 105 Noctua course review feedback items across five sequential PRs.

**Architecture:** Five independent, sequentially-ordered content update PRs. HTML is always updated first; Markdown updated to match. PR 3 depends on PR 2. All others are independent.

**Tech Stack:** HTML, CSS, JavaScript (existing `labs.js` / `labs.css` patterns), Markdown

---

## File Map

**PR 1:** `docs/lab-s2-unit8.html`, `docs/lab-s1-unit2.html`, `semester-1/weeks/week-06.md`, `docs/lab-s2-unit6.html`, `docs/lab-s1-unit3.html`

**PR 2:** `docs/lab-s2-unit5.html`, `docs/lab-s2-unit6.html`, `docs/lab-s2-unit7.html` + corresponding Markdown

**PR 3:** `docs/lab-s2-unit5.html` through `docs/lab-s2-unit8.html` (search index only)

**PR 4:** `docs/lab-s1-unit4.html`, `docs/lab-s2-unit5.html`, `docs/lab-s2-unit6.html`, `docs/lab-s2-unit8.html`

**PR 5:** All 8 HTML lab files + all Markdown week files

---

## PR 1 — Broken Functionality

### Task 1: Rewrite Unit 8 Quiz HTML Schema (Item 102)

**Files:** `docs/lab-s2-unit8.html`

Unit 8 uses a broken quiz schema: `data-answer` on `<label>`, explanation inline in `onclick`, button class `quiz-submit`. `labs.js` requires `data-answer` and `data-explain` on `<div class="quiz-question">`, button class `quiz-check-btn`, `checkQuestion(qid)` with no extra args.

Correct schema (from Unit 6):
```html
<div class="quiz-question" data-qid="u8w13q1" data-answer="b" data-explain="Explanation text.">
  <p class="q-text">Question text</p>
  <div class="quiz-opts">
    <label><input type="radio" name="u8w13q1" value="a"> A) Option</label>
    <label><input type="radio" name="u8w13q1" value="b"> B) Option</label>
    <label><input type="radio" name="u8w13q1" value="c"> C) Option</label>
    <label><input type="radio" name="u8w13q1" value="d"> D) Option</label>
  </div>
  <div class="quiz-feedback"></div>
  <button class="quiz-check-btn" onclick="checkQuestion('u8w13q1')">Check Answer</button>
</div>
```

- [ ] **Step 1: Read all 16 questions from `docs/lab-s2-unit8.html`**

Read the file. For each `<div class="quiz-question" id="q-u8-w##-#">`, record:
- Question text (inside `<p class="question-text">`)
- All four option texts (inside each `<label class="quiz-option">`)
- Correct answer letter (second arg to `checkQuestion` in `onclick`)
- Explanation text (third arg to `checkQuestion` in `onclick`)
- Week number (13, 14, 15, 16)

ID mapping — old → new:
- `q-u8-w13-1` → `u8w13q1` ... `q-u8-w13-4` → `u8w13q4`
- `q-u8-w14-1` → `u8w14q1` ... `q-u8-w14-4` → `u8w14q4`
- `q-u8-w15-1` → `u8w15q1` ... `q-u8-w15-4` → `u8w15q4`
- `q-u8-w16-1` → `u8w16q1` ... `q-u8-w16-4` → `u8w16q4`

- [ ] **Step 2: Rewrite all 16 questions using the correct schema**

For each question, replace the entire `<div class="quiz-question" id="q-u8-w##-#">` block.
Move: correct answer → `data-answer` on the question div.
Move: explanation text → `data-explain` on the question div.
Change: `<div class="quiz-options">` → `<div class="quiz-opts">`
Change: `<p class="question-text">` → `<p class="q-text">`
Change: `<button class="quiz-submit"` → `<button class="quiz-check-btn"`
Change: `onclick="checkQuestion('qid', 'answer', 'explanation')"` → `onclick="checkQuestion('newqid')"`
Remove: `class="quiz-option"`, `data-qid`, `data-answer` from all `<label>` elements.

- [ ] **Step 3: Verify — no broken patterns remain**

```bash
grep -c "quiz-submit\|quiz-option\|quiz-options\|question-text" docs/lab-s2-unit8.html
```
Expected: `0`

- [ ] **Step 4: Verify — correct patterns present**

```bash
grep -c "quiz-check-btn" docs/lab-s2-unit8.html
```
Expected: `16`

- [ ] **Step 5: Commit**
```bash
git add docs/lab-s2-unit8.html
git commit -m "Fix Unit 8 quiz HTML schema — align to labs.js standard (Item 102)"
```

---

### Task 2: Fix Skill Frontmatter Schema (Item 75)

**Files:** `docs/lab-s1-unit2.html` (check only), `semester-1/weeks/week-06.md` (fix)

- [ ] **Step 1: Check if HTML has wrong fields**

```bash
grep -n "trigger_description\|context_budget" docs/lab-s1-unit2.html
```

If matches found: fix `lab-s1-unit2.html` first. If zero: HTML is clean, fix only Markdown.

- [ ] **Step 2: Fix `semester-1/weeks/week-06.md`**

Read the file. Find every skill schema example. Make these replacements throughout:

| Wrong field | Correct field |
|-------------|---------------|
| `trigger_description:` | `description:` |
| `context_budget: [N]` | `context: fork` |
| Any `version:` or `tags:` skill frontmatter lines | Remove |

Where the file describes the schema as a table or list, replace with this correct field reference:

```
| name          | Skill identifier — matches directory name |
| description   | When to invoke — used by Claude to match invocations |
| allowed-tools | Comma-separated tools the skill may use |
| context       | fork (isolated) or shared (inherits session) |
| user-invocable| true if callable as /skill-name |
| argument-hint | Shown to users, e.g. "[path]" |
```

Update every skill example block to use the correct fields. Example:
```yaml
---
name: register-cve-server
description: "Spin up the CVE lookup MCP server, register it, and confirm it responds."
allowed-tools: Bash
context: fork
user-invocable: true
argument-hint: ""
---
```

- [ ] **Step 3: Verify**

```bash
grep -c "trigger_description\|context_budget" semester-1/weeks/week-06.md
```
Expected: `0`

- [ ] **Step 4: Commit**
```bash
git add semester-1/weeks/week-06.md
git commit -m "Fix skill frontmatter schema — remove trigger_description, context_budget (Item 75)"
```

---

### Task 3: Add Garak Warning Callout (Item 83)

**Files:** `docs/lab-s2-unit6.html`, `semester-2/weeks/unit-6.md`

- [ ] **Step 1: Find Garak Step 2 location**

```bash
grep -n "Run Garak\|step-title.*Garak\|Step 2.*Garak" docs/lab-s2-unit6.html
```

- [ ] **Step 2: Insert `callout-warn` immediately before the Garak `<div class="lab-step">`**

```html
<div class="callout callout-warn">
  <strong>Garak scans the base model, not your guardrails layer</strong>
  <p>Garak scans the base Claude model directly via the Anthropic API — it does not test your guardrails layer or system prompt. Your NeMo Guardrails and system prompt hardening are invisible to Garak. Use PyRIT (Steps 3–4) to test the full hardened system. Treat Garak results as the base model's vulnerability profile, not your deployed system's.</p>
</div>
```

- [ ] **Step 3: Add the same warning note to `semester-2/weeks/unit-6.md` Week 6 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit6.html semester-2/weeks/unit-6.md
git commit -m "Add Garak base-model warning callout (Item 83)"
```

---

### Task 4: Add AIF360 Python Version Warning (Item 84)

**Files:** `docs/lab-s1-unit3.html`, relevant `semester-1/weeks/week-09.md` or `week-10.md`

- [ ] **Step 1: Find the AIF360 install step**

```bash
grep -n "pip install aif360\|aif360" docs/lab-s1-unit3.html | head -5
```

- [ ] **Step 2: Insert `callout-warn` immediately before the AIF360 install `<div class="lab-step">`**

```html
<div class="callout callout-warn">
  <strong>AIF360 requires Python 3.10 or 3.11</strong>
  <p>AIF360 has known installation failures on Python 3.12+. If installation fails, use Python 3.10 or 3.11 for this exercise (<code>pyenv local 3.11.x</code>). The bias concepts in this lab are framework-independent — the code patterns apply regardless of which fairness library you use.</p>
</div>
```

- [ ] **Step 3: Add the same warning to the corresponding Markdown week file**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s1-unit3.html
git commit -m "Add AIF360 Python 3.12 install warning (Item 84)"
```

---

## PR 2 — Principle Callouts

All additions use the `callout-key` class:
```html
<div class="callout callout-key">
  <strong>Title</strong>
  <p>Content</p>
</div>
```

After each HTML edit, update the corresponding Markdown week file to summarize the new concept.

---

### Task 5: OWASP Agentic AI Top 10 — Unit 6 Week 5 (Item 101)

**Files:** `docs/lab-s2-unit6.html`, `semester-2/weeks/unit-6.md`

- [ ] **Step 1: Find last ATLAS step/quiz in Week 5**

```bash
grep -n "ATLAS\|Week 5\|WEEK 5" docs/lab-s2-unit6.html | head -20
```

Identify the last Week 5 content block before the Week 6 header.

- [ ] **Step 2: Insert callout immediately after last Week 5 block**

```html
<div class="callout callout-key">
  <strong>OWASP Agentic AI Top 10</strong>
  <p>MITRE ATLAS maps specific adversarial techniques. The OWASP Agentic AI Top 10 maps attack <em>categories</em> — the ten classes of risk specific to systems that act in the world:</p>
  <ol>
    <li><strong>Prompt Injection</strong> — malicious instructions in user input or data the agent processes</li>
    <li><strong>Insecure Output Handling</strong> — agent output executed or trusted without validation</li>
    <li><strong>Training Data Poisoning</strong> — corrupted training data biases model behavior</li>
    <li><strong>Model Denial of Service</strong> — resource exhaustion via crafted inputs</li>
    <li><strong>Supply Chain Vulnerabilities</strong> — compromised dependencies, models, or plugins</li>
    <li><strong>Sensitive Information Disclosure</strong> — model leaks training data or system context</li>
    <li><strong>Insecure Plugin Design</strong> — plugins with excessive permissions or unsafe interfaces</li>
    <li><strong>Excessive Agency</strong> — agent takes actions beyond what the task requires</li>
    <li><strong>Overreliance</strong> — humans defer to AI output without appropriate verification</li>
    <li><strong>Model Theft</strong> — extraction of model weights or behavior via API probing</li>
  </ol>
  <p>Use this as a checklist complement to ATLAS: ATLAS tells you <em>how</em> attacks execute; OWASP tells you <em>which categories</em> you have covered. You will use this list as your red team checklist in Unit 8 Week 15.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-6.md` Week 5 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit6.html semester-2/weeks/unit-6.md
git commit -m "Add OWASP Agentic AI Top 10 callout — Week 5 (Item 101)"
```

---

### Task 6: AI Vulnerability Severity Scoring — Unit 6 Week 6 (Items 95/103)

**Files:** `docs/lab-s2-unit6.html`, `semester-2/weeks/unit-6.md`

- [ ] **Step 1: Find the Red Team Report step (Step 6) in Week 6**

```bash
grep -n "Red Team Report\|step-title.*[Rr]eport\|Step 6" docs/lab-s2-unit6.html | head -10
```

- [ ] **Step 2: Insert callout immediately before the Red Team Report lab-step**

```html
<div class="callout callout-key">
  <strong>AI Vulnerability Severity Scoring</strong>
  <p>Score each finding on three axes:</p>
  <ul>
    <li><strong>Impact</strong> — what damage does exploitation cause? (data exfiltration, false negatives on real threats, system manipulation)</li>
    <li><strong>Exploitability</strong> — how easy is this to trigger? (unauthenticated access, crafted input required, insider access required)</li>
    <li><strong>Blast radius</strong> — how many users or systems are affected when exploited?</li>
  </ul>
  <p>Multiply these axes to assign severity: <strong>Critical</strong> (high exploit, broad impact), <strong>High</strong> (moderate exploit, significant impact), <strong>Medium</strong> (limited exploitability or contained blast radius), <strong>Low</strong> (difficult to exploit, negligible impact). AIVSS (AI Vulnerability Scoring System) is one framework that formalizes this reasoning — the underlying logic applies regardless of which scoring system you use. Apply this scale to your red team findings in the report below.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-6.md` Week 6 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit6.html semester-2/weeks/unit-6.md
git commit -m "Add AI vulnerability severity scoring callout — Week 6 (Items 95/103)"
```

---

### Task 7: Semantic Filtering Layers — Unit 6 Week 7 (Item 94)

**Files:** `docs/lab-s2-unit6.html`, `semester-2/weeks/unit-6.md`

- [ ] **Step 1: Find the first NeMo Guardrails step in Week 7**

```bash
grep -n "NeMo\|Guardrail\|Week 7\|WEEK 7" docs/lab-s2-unit6.html | head -15
```

- [ ] **Step 2: Insert callout immediately before the first NeMo Guardrails lab-step**

```html
<div class="callout callout-key">
  <strong>Semantic Filtering Layers</strong>
  <p>Defense tools operate at different granularities:</p>
  <ul>
    <li><strong>Syntactic layer</strong> — pattern matching on token sequences. Fast, deterministic, zero false negatives for known patterns. Blind to novel phrasing. (Regex, keyword filters, YARA rules)</li>
    <li><strong>Semantic layer</strong> — meaning and intent classification. Catches novel phrasings of known attack types. Higher compute cost; can produce false positives on legitimate content that resembles attack patterns. (NeMo Guardrails, LlamaFirewall, embedding-based classifiers)</li>
    <li><strong>Behavioral layer</strong> — cross-turn pattern analysis. Catches multi-turn manipulation that no single message would trigger. Requires session state. (Custom conversation analysis, anomaly detection on turn sequences)</li>
  </ul>
  <p>Production defense-in-depth uses all three layers. The NeMo Guardrails implementation below is the semantic layer. The principle applies regardless of which tool implements it.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-6.md` Week 7 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit6.html semester-2/weeks/unit-6.md
git commit -m "Add semantic filtering layers callout — Week 7 (Item 94)"
```

---

### Task 8: A2A vs. MCP — Unit 5 Week 1 (Item 91)

**Files:** `docs/lab-s2-unit5.html`, `semester-2/weeks/unit-5.md`

- [ ] **Step 1: Find the pattern analysis step in Week 1**

```bash
grep -n "pattern-analysis\|pattern analysis\|Create.*pattern" docs/lab-s2-unit5.html | head -5
```

- [ ] **Step 2: Insert callout immediately after the pattern-analysis lab-step**

```html
<div class="callout callout-key">
  <strong>A2A vs. MCP — Two Protocols, Two Jobs</strong>
  <p>Two protocols appear in agentic system architecture. They solve different problems:</p>
  <ul>
    <li><strong>MCP (Model Context Protocol)</strong> — how an agent calls a tool. Defines the interface between an agent and external capabilities: APIs, databases, file systems.</li>
    <li><strong>A2A (Agent-to-Agent Protocol)</strong> — how agents communicate with each other. Defines message passing, task delegation, and result handoff between agents in a multi-agent system.</li>
  </ul>
  <p>A production multi-agent system needs both: MCP to connect agents to tools, A2A to connect agents to each other. They operate at different trust boundaries — tool calls and inter-agent messages have different authentication and authorization requirements. The Claude Agent SDK used in this lab handles inter-agent communication natively; A2A is the standardized protocol for this layer when interoperability across agent frameworks is required.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-5.md` Week 1 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit5.html semester-2/weeks/unit-5.md
git commit -m "Add A2A vs MCP callout — Unit 5 Week 1 (Item 91)"
```

---

### Task 9: Workload Identity / SPIFFE — Unit 7 Week 10 (Item 98)

**Files:** `docs/lab-s2-unit7.html`, `semester-2/weeks/unit-7.md`

- [ ] **Step 1: Find the JWT token service step in Week 10**

```bash
grep -n "JWT\|token service\|Week 10\|WEEK 10" docs/lab-s2-unit7.html | head -15
```

- [ ] **Step 2: Insert callout immediately after the last JWT token service lab-step**

```html
<div class="callout callout-key">
  <strong>Workload Identity — From JWTs to SPIFFE</strong>
  <p>The JWT token service you just built establishes a principle: each agent gets its own cryptographic identity, issued fresh for each session, scoped to its allowed actions. That is workload identity.</p>
  <p>SPIFFE (Secure Production Identity Framework for Everyone) and its implementation SPIRE automate exactly this at infrastructure scale. Instead of your application code generating JWTs, the SPIFFE runtime issues short-lived X.509 certificates or JWTs to each workload automatically, rotating them without application changes.</p>
  <p>The connection: you built the workload identity principle by hand. In production, your security team runs SPIRE so your application code doesn't have to manage credential issuance. The design decision — short-lived, per-agent, cryptographically verifiable identity — is the same either way.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-7.md` Week 10 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit7.html semester-2/weeks/unit-7.md
git commit -m "Add workload identity / SPIFFE callout — Unit 7 Week 10 (Item 98)"
```

---

### Task 10: Allowance Profiles — Unit 7 Week 10 (Item 99)

**Files:** `docs/lab-s2-unit7.html`, `semester-2/weeks/unit-7.md`

- [ ] **Step 1: Find the agent-identities.yaml step in Week 10**

```bash
grep -n "agent-identities\|identities.yaml" docs/lab-s2-unit7.html | head -5
```

- [ ] **Step 2: Insert callout immediately after the agent-identities.yaml lab-step**

```html
<div class="callout callout-key">
  <strong>agent-identities.yaml IS an Allowance Profile</strong>
  <p>The manifest you just wrote — per-agent tool permissions, credential scope, token budget — has a formal name: an <strong>Allowance Profile</strong>. An Allowance Profile defines what an agent is permitted to do before it is deployed, creating a verifiable boundary between what was authorized and what the agent attempts at runtime.</p>
  <p>The pattern: specify allowed tools, allowed credential scopes, and cost limits per agent identity in a manifest that exists before any code runs. The enforcement layer reads the manifest at runtime and rejects tool calls outside the defined scope.</p>
  <p>PeaRL (Policy-enforced Agent Runtime Layer) is a governance system built around Allowance Profile enforcement. No PeaRL installation is required for this lab; the concept is what matters. The <code>agent-identities.yaml</code> you wrote is a valid Allowance Profile by design.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-7.md` Week 10 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit7.html semester-2/weeks/unit-7.md
git commit -m "Add Allowance Profile callout — Unit 7 Week 10 (Item 99)"
```

---

### Task 11: Distributed Tracing Backends — Unit 7 Week 11 (Item 100)

**Files:** `docs/lab-s2-unit7.html`, `semester-2/weeks/unit-7.md`

- [ ] **Step 1: Find the ConsoleSpanExporter step in Week 11**

```bash
grep -n "ConsoleSpanExporter\|Week 11\|WEEK 11" docs/lab-s2-unit7.html | head -10
```

- [ ] **Step 2: Insert callout immediately after the ConsoleSpanExporter lab-step**

```html
<div class="callout callout-key">
  <strong>Distributed Tracing Backends</strong>
  <p>The <code>ConsoleSpanExporter</code> you just configured writes OTel spans to stdout — useful for local development, not useful in production where spans need to be stored, queried, and alerted on.</p>
  <p>In production, the same spans route to a tracing backend. All of the following accept OTLP (OpenTelemetry Protocol) natively:</p>
  <ul>
    <li><strong>Grafana Tempo</strong> — open source, pairs with Grafana dashboards</li>
    <li><strong>Jaeger</strong> — open source, strong for distributed tracing visualization</li>
    <li><strong>Honeycomb</strong> — managed service, strong for high-cardinality queries</li>
    <li><strong>AWS CloudWatch</strong> — managed service, native to AWS deployments</li>
  </ul>
  <p>Swapping from <code>ConsoleSpanExporter</code> to any backend is a one-line config change — the exporter endpoint. The instrumentation code is identical. The lab uses <code>ConsoleSpanExporter</code> for zero-dependency local development; the architecture is production-compatible by design.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-7.md` Week 11 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit7.html semester-2/weeks/unit-7.md
git commit -m "Add distributed tracing backends callout — Unit 7 Week 11 (Item 100)"
```

---

### Task 12: AgentCore vs. Lambda — Unit 7 Week 12 (Item 105)

**Files:** `docs/lab-s2-unit7.html`, `semester-2/weeks/unit-7.md`

- [ ] **Step 1: Find the last AgentCore deployment step in Week 12**

```bash
grep -n "AgentCore\|Week 12\|WEEK 12" docs/lab-s2-unit7.html | head -15
```

- [ ] **Step 2: Insert callout immediately after the last AgentCore lab-step**

```html
<div class="callout callout-key">
  <strong>Deployment Options — Managed Runtime vs. Serverless</strong>
  <p>The AgentCore deployment you just completed is one of two primary production patterns:</p>
  <ul>
    <li><strong>AgentCore (managed persistent runtime)</strong> — always-on, stateful. Agent process persists between invocations — enables in-memory state, warm model connections, lower per-invocation latency. Cost model: pay for uptime regardless of request volume.</li>
    <li><strong>Lambda (serverless)</strong> — event-triggered, stateless. Each invocation starts fresh. No cost when idle. Cold-start latency on first invocation. State must be externalized (DynamoDB, S3).</li>
  </ul>
  <p>The decision point: <strong>alert volume and state requirements</strong>. At low alert volumes (&lt;100/day), Lambda is cheaper. At sustained volume or when agents maintain session state between invocations, AgentCore is the right choice.</p>
</div>
```

- [ ] **Step 3: Update `semester-2/weeks/unit-7.md` Week 12 section**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s2-unit7.html semester-2/weeks/unit-7.md
git commit -m "Add AgentCore vs Lambda callout — Unit 7 Week 12 (Item 105)"
```

---

## PR 3 — Search Index Alignment

All five updates apply to all four Semester 2 HTML files. Commit once after all four files are updated.

| Entry | Old `d` value | New `d` value |
|-------|--------------|---------------|
| A2A — Agent-to-Agent Protocol | `"Inter-agent communication standard. Enables orchestrator ↔ worker messaging secured via mTLS."` | `"How agents communicate with each other — the complement to MCP (how agents call tools). Two protocols, two jobs. Introduced in Unit 5 Week 1 callout."` |
| SPIFFE / SPIRE | `"Workload identity. Short-lived X.509 SVIDs per agent. mTLS between agents. Addresses NHI7 long-lived secrets."` | `"The principle behind the JWT token service you built: short-lived cryptographic identity per workload, automated in production. Unit 7 Week 10 callout."` |
| Allowance Profiles | `"Per-agent scope at design time: tool scope, credential scope, network scope, cost limit. Enforced by PeaRL. Addresses NHI5."` | `"Your agent-identities.yaml IS an Allowance Profile — per-agent tool scope, credential scope, and cost limit defined before build. Unit 7 Week 10 callout."` |
| Grafana Tempo | `"Distributed tracing backend. OTLP/HTTP port 4318. PeaRL as trace root — every agent span links to governance record."` | `"Production tracing backends (Grafana Tempo, Jaeger, Honeycomb) that accept OTel OTLP spans. Lab uses ConsoleSpanExporter; same code routes to any backend by config change. Unit 7 Week 11 callout."` |
| OWASP Agentic Apps | `"Security considerations specific to agentic AI applications: tool misuse, orchestration risks, data leakage."` | `"10 attack categories specific to agentic systems: prompt injection, excessive agency, overreliance, and 7 more. Used as the Unit 8 red team checklist. Introduced in Unit 6 Week 5 callout."` |

### Task 13: Update Search Index in All Four Semester 2 Files

**Files:** `docs/lab-s2-unit5.html`, `docs/lab-s2-unit6.html`, `docs/lab-s2-unit7.html`, `docs/lab-s2-unit8.html`

- [ ] **Step 1: Apply all five replacements to `docs/lab-s2-unit5.html`**

For each of the five entries, replace the old `d:` value with the new one from the table above.

- [ ] **Step 2: Apply same five replacements to `docs/lab-s2-unit6.html`**

- [ ] **Step 3: Apply same five replacements to `docs/lab-s2-unit7.html`**

- [ ] **Step 4: Apply same five replacements to `docs/lab-s2-unit8.html`**

- [ ] **Step 5: Verify no old values remain in any file**

```bash
grep -l "Inter-agent communication standard\|Short-lived X.509 SVIDs\|Per-agent scope at design\|OTLP/HTTP port 4318\|Security considerations specific to agentic" \
  docs/lab-s2-unit5.html docs/lab-s2-unit6.html docs/lab-s2-unit7.html docs/lab-s2-unit8.html
```
Expected: empty output.

- [ ] **Step 6: Commit**
```bash
git add docs/lab-s2-unit5.html docs/lab-s2-unit6.html docs/lab-s2-unit7.html docs/lab-s2-unit8.html
git commit -m "Update search index entries to reference new callout content (Items 91, 98, 99, 100, 101)"
```

---

## PR 4 — Lab Step & Quiz Gaps

### Task 14: Fix Pattern Count — Unit 5 Week 1 Step 4 (Item 90)

**Files:** `docs/lab-s2-unit5.html`, `semester-2/weeks/unit-5.md`

- [ ] **Step 1: Find and fix**

```bash
grep -n "four patterns" docs/lab-s2-unit5.html semester-2/weeks/unit-5.md
```

Replace `"mapping all four patterns"` → `"mapping all five patterns"` in each file where found.

- [ ] **Step 2: Verify**

```bash
grep "four patterns" docs/lab-s2-unit5.html semester-2/weeks/unit-5.md
```
Expected: `0` matches.

- [ ] **Step 3: Commit**
```bash
git add docs/lab-s2-unit5.html semester-2/weeks/unit-5.md
git commit -m "Fix pattern count: four → five in Unit 5 Week 1 Step 4 (Item 90)"
```

---

### Task 15: Add AIUC-1 Pre-Check Step — Unit 5 Week 1 (Item 92)

**Files:** `docs/lab-s2-unit5.html`

Current prog-text: `0 / 29 steps complete` → becomes `0 / 30 steps complete`

- [ ] **Step 1: Find the first lab-step in Week 1**

```bash
grep -n "toggleStep\|lab-step" docs/lab-s2-unit5.html | head -10
```

- [ ] **Step 2: Insert before the first Week 1 lab-step**

```html
<div class="callout callout-tip">
  <strong>The <code>/audit-aiuc1</code> skill</strong>
  <p>Built in Unit 2 Week 6. If not yet configured, the skill file is at <code>.claude/skills/audit-aiuc1/SKILL.md</code>.</p>
</div>

<div class="lab-step" id="step-u5-aiuc1-pre">
  <label><input type="checkbox" onchange="toggleStep('step-u5-aiuc1-pre', this.checked)">
    <div class="step-content">
      <div class="step-title">Step 0: AIUC-1 pre-check — run before writing code</div>
      <div class="step-desc">Run <code>/audit-aiuc1</code> on your planned multi-agent system architecture. Focus on Domains B (Security), D (Reliability), and E (Accountability) at minimum. Save the output as <code>unit5/aiuc1-precheck.md</code> — this is a graded deliverable. This pre-check surfaces design decisions you would otherwise have to reverse later.</div>
    </div>
  </label>
</div>
```

- [ ] **Step 3: Update prog-text**

Find `0 / 29 steps complete` → replace with `0 / 30 steps complete`

- [ ] **Step 4: Verify**

```bash
grep "prog-text" docs/lab-s2-unit5.html
```
Expected: `0 / 30 steps complete`

- [ ] **Step 5: Commit**
```bash
git add docs/lab-s2-unit5.html
git commit -m "Add AIUC-1 pre-check Step 0 to Unit 5 Week 1 (Item 92)"
```

---

### Task 16: Add AIUC-1 Pre-Check Step — Unit 4 Week 14 (Item 87)

**Files:** `docs/lab-s1-unit4.html`

Current prog-text: `0 / 26 steps complete` → becomes `0 / 27 steps complete`

- [ ] **Step 1: Find the first lab-step in the Week 14 section**

```bash
grep -n "Week 14\|Sprint I\|sprint-i" docs/lab-s1-unit4.html | head -8
```

- [ ] **Step 2: Insert before the first Week 14 lab-step**

```html
<div class="callout callout-tip">
  <strong>The <code>/audit-aiuc1</code> skill</strong>
  <p>Built in Unit 2 Week 6. If not yet configured, the skill file is at <code>.claude/skills/audit-aiuc1/SKILL.md</code>.</p>
</div>

<div class="lab-step" id="step-u4-aiuc1-pre">
  <label><input type="checkbox" onchange="toggleStep('step-u4-aiuc1-pre', this.checked)">
    <div class="step-content">
      <div class="step-title">Step 0: AIUC-1 pre-check — run before writing code</div>
      <div class="step-desc">Run <code>/audit-aiuc1</code> on your planned Sprint I system architecture. Focus on Domains B (Security), D (Reliability), and E (Accountability) at minimum. Save the output as <code>unit4/aiuc1-precheck.md</code> — this is a graded deliverable. The full audit happens in Unit 7 (Semester 2); this pre-check surfaces design decisions you would otherwise have to reverse later.</div>
    </div>
  </label>
</div>
```

- [ ] **Step 3: Update prog-text**

Find `0 / 26 steps complete` → replace with `0 / 27 steps complete`

- [ ] **Step 4: Verify**

```bash
grep "prog-text" docs/lab-s1-unit4.html
```
Expected: `0 / 27 steps complete`

- [ ] **Step 5: Commit**
```bash
git add docs/lab-s1-unit4.html
git commit -m "Add AIUC-1 pre-check Step 0 to Unit 4 Week 14 (Item 87)"
```

---

### Task 17: Add Solo Fallback Callouts (Items 96, 104)

**Files:** `docs/lab-s2-unit6.html`, `docs/lab-s2-unit8.html`

- [ ] **Step 1: Find the partner exchange step in Unit 6 Week 8**

```bash
grep -n "partner\|peer\|exchange" docs/lab-s2-unit6.html | head -15
```

- [ ] **Step 2: Insert after the partner exchange lab-step in Unit 6 Week 8**

```html
<div class="callout callout-tip">
  <strong>Solo / asynchronous version</strong>
  <p>Use your own hardened system as the target. Select 5 attacks from your Week 6 red team that your Week 7 defenses did NOT block. Execute each against your hardened system and document whether your blue team detects them.</p>
</div>
```

- [ ] **Step 3: Find the deployment freeze callout in Unit 8 Week 15**

```bash
grep -n "deployment freeze\|Deployment freeze" docs/lab-s2-unit8.html
```

- [ ] **Step 4: Insert after the deployment freeze callout-warn in Unit 8 Week 15**

```html
<div class="callout callout-tip">
  <strong>Solo / no peer team available</strong>
  <p>If no peer team is available, conduct a self-red-team against your own production deployment. Test all 10 OWASP Agentic risks systematically, documenting which your defenses address and which remain open. A self-red-team is a legitimate security practice — the limitation is that it cannot find blind spots the team shares.</p>
</div>
```

- [ ] **Step 5: Commit**
```bash
git add docs/lab-s2-unit6.html docs/lab-s2-unit8.html
git commit -m "Add solo fallback callouts — Unit 6 Week 8, Unit 8 Week 15 (Items 96, 104)"
```

---

### Task 18: Add Knowledge Check — Unit 6 Week 8 (Item 97)

**Files:** `docs/lab-s2-unit6.html`

- [ ] **Step 1: Find the start of the Week 8 lab steps section**

```bash
grep -n "Week 8\|WEEK 8\|week-badge.*8" docs/lab-s2-unit6.html | head -5
```

- [ ] **Step 2: Insert quiz block at the start of Week 8, before the first lab-step**

```html
<div class="quiz-block">
  <h3 class="quiz-title">Knowledge Check — Week 8</h3>

  <div class="quiz-question" data-qid="u6w8q1" data-answer="b" data-explain="8 triggers for 5 expected attacks means the attacker is adapting — testing variants of their attacks to probe your defenses. Your guardrails are working, but the attacker is not using the exact inputs you designed against. This is normal in adversarial exchanges: attackers iterate when they meet resistance.">
    <p class="q-text">During the Blue Phase, your logs show 8 guardrail triggers but you only expected 5 attacks. What does this most likely indicate?</p>
    <div class="quiz-opts">
      <label><input type="radio" name="u6w8q1" value="a"> A) Your guardrails are malfunctioning — these are false positives</label>
      <label><input type="radio" name="u6w8q1" value="b"> B) The attacker is adapting — testing variants beyond the exact attacks you designed against</label>
      <label><input type="radio" name="u6w8q1" value="c"> C) Your logging system is duplicating events</label>
      <label><input type="radio" name="u6w8q1" value="d"> D) The attacker ran out of ideas and repeated earlier attempts</label>
    </div>
    <div class="quiz-feedback"></div>
    <button class="quiz-check-btn" onclick="checkQuestion('u6w8q1')">Check Answer</button>
  </div>

  <div class="quiz-question" data-qid="u6w8q2" data-answer="c" data-explain="The debrief is valuable because each side has information the other lacks. The red team knows which attacks were blocked and which succeeded — giving the blue team visibility into real gaps. The blue team knows which defenses triggered and which were bypassed — giving the red team a map of what they didn't know they'd hit.">
    <p class="q-text">What is the primary value of the debrief exchange between red and blue teams?</p>
    <div class="quiz-opts">
      <label><input type="radio" name="u6w8q2" value="a"> A) The red team can claim credit for finding more vulnerabilities</label>
      <label><input type="radio" name="u6w8q2" value="b"> B) The blue team can document that their defenses passed the test</label>
      <label><input type="radio" name="u6w8q2" value="c"> C) Each team has information the other needs — red learns what defenses surprised them; blue learns which attacks went undetected</label>
      <label><input type="radio" name="u6w8q2" value="d"> D) It determines which team wins the exercise</label>
    </div>
    <div class="quiz-feedback"></div>
    <button class="quiz-check-btn" onclick="checkQuestion('u6w8q2')">Check Answer</button>
  </div>
</div>
```

- [ ] **Step 3: Commit**
```bash
git add docs/lab-s2-unit6.html
git commit -m "Add knowledge check — Unit 6 Week 8 (Item 97)"
```

---

### Task 19: Add Knowledge Check — Unit 4 Week 16 (Item 88)

**Files:** `docs/lab-s1-unit4.html`

- [ ] **Step 1: Find the start of the Week 16 section**

```bash
grep -n "Week 16\|WEEK 16\|week-badge.*16" docs/lab-s1-unit4.html | head -5
```

- [ ] **Step 2: Insert quiz block before the first Week 16 lab-step**

```html
<div class="quiz-block">
  <h3 class="quiz-title">Knowledge Check — Week 16</h3>

  <div class="quiz-question" data-qid="u4w16q1" data-answer="d" data-explain="'Production-ready' means the system is observable (you can see what it's doing and when it breaks), operable (someone other than the builder can run it at 2am without calling you), and accountable (every decision is traceable to a cause and a responsible human). Passing tests is necessary but not sufficient.">
    <p class="q-text">Which best describes what 'production-ready' means for your capstone?</p>
    <div class="quiz-opts">
      <label><input type="radio" name="u4w16q1" value="a"> A) All tests pass and the demo runs without errors</label>
      <label><input type="radio" name="u4w16q1" value="b"> B) The system correctly handles all required use cases</label>
      <label><input type="radio" name="u4w16q1" value="c"> C) The code is reviewed and deployed to a staging environment</label>
      <label><input type="radio" name="u4w16q1" value="d"> D) The system is observable, operable by someone other than the builder, and every decision is traceable and accountable</label>
    </div>
    <div class="quiz-feedback"></div>
    <button class="quiz-check-btn" onclick="checkQuestion('u4w16q1')">Check Answer</button>
  </div>

  <div class="quiz-question" data-qid="u4w16q2" data-answer="b" data-explain="The production engineer mindset asks: what breaks at 2am and who calls whom? Applied to a final presentation, this means demonstrating you've thought beyond 'does it work?' to 'can someone else operate this without knowing how I built it?' Show your runbook, monitoring thresholds, and escalation path.">
    <p class="q-text">Applying the production engineer mindset to your final presentation means:</p>
    <div class="quiz-opts">
      <label><input type="radio" name="u4w16q2" value="a"> A) Optimizing the demo for maximum visual impact</label>
      <label><input type="radio" name="u4w16q2" value="b"> B) Demonstrating your system can be operated by someone who didn't build it — showing the runbook, monitoring, and escalation path</label>
      <label><input type="radio" name="u4w16q2" value="c"> C) Presenting the technical architecture in maximum detail</label>
      <label><input type="radio" name="u4w16q2" value="d"> D) Listing all features built during the sprint</label>
    </div>
    <div class="quiz-feedback"></div>
    <button class="quiz-check-btn" onclick="checkQuestion('u4w16q2')">Check Answer</button>
  </div>
</div>
```

- [ ] **Step 3: Commit**
```bash
git add docs/lab-s1-unit4.html
git commit -m "Add knowledge check — Unit 4 Week 16 (Item 88)"
```

---

### Task 20: Add Pre-Landing AI Checklist Callout (Item 89)

**Files:** `docs/lab-s1-unit4.html`

- [ ] **Step 1: Find the pre-landing checklist reference**

```bash
grep -n "pre-landing\|Pre-Landing\|landing checklist" docs/lab-s1-unit4.html
```

- [ ] **Step 2: Insert callout-key immediately after the lab-step that references the checklist**

```html
<div class="callout callout-key">
  <strong>Pre-Landing AI Checklist</strong>
  <p>Before any AI-assisted code goes into production, verify each of the following:</p>
  <ul>
    <li><strong>LLM trust boundaries</strong> — model output is treated as data, not as instructions, everywhere that matters</li>
    <li><strong>SQL safety</strong> — all database queries use parameterized statements; no string concatenation with model output</li>
    <li><strong>Race conditions</strong> — async code doesn't share mutable state without locks; concurrent tool calls are tested</li>
    <li><strong>Enum completeness</strong> — all match/switch statements handle every enum value including future additions</li>
    <li><strong>Error propagation</strong> — errors surface to callers rather than being silently swallowed</li>
    <li><strong>Secrets in environment</strong> — no API keys, tokens, or passwords in source code or version history</li>
    <li><strong>Blast radius under 5 files</strong> — any single failure touches fewer than 5 files; no cascading dependency chains</li>
  </ul>
  <p>The full production readiness framework is developed across Unit 7 (Semester 2) — supply chain, identity, observability, deployment. Use this checklist now as a preview; you will build each item systematically through the second semester.</p>
</div>
```

- [ ] **Step 3: Commit**
```bash
git add docs/lab-s1-unit4.html
git commit -m "Add Pre-Landing AI Checklist callout definition (Item 89)"
```

---

## PR 5 — Minor Fixes

### Task 21: 5b — Wording and Citation Fixes (Items 82, 93)

- [ ] **Step 1: Fix Item 93 in `docs/lab-s2-unit5.html`**

```bash
grep -n "Research shows" docs/lab-s2-unit5.html
```

Replace `"Research shows"` → `"Practitioner experience suggests"`. Scan the same area for any other unsourced quantitative claims and apply the same softening.

- [ ] **Step 2: Fix Item 82 — AIUC-1 "principles" → "domains" throughout all files**

```bash
grep -rn "AIUC-1 principles\|AIUC principles" docs/ semester-1/ semester-2/
```

For each match: replace `"AIUC-1 principles"` → `"AIUC-1 domains"`.

- [ ] **Step 3: Commit**
```bash
git add docs/ semester-1/ semester-2/
git commit -m "Fix wording and citation issues — Research shows, AIUC-1 domains (Items 82, 93)"
```

---

### Task 22: 5a — HTML/Markdown Text Alignment (Item 76)

Work unit by unit. For each unit, read the HTML lab file and the corresponding Markdown week files side by side. Where topics, step descriptions, or callout content diverge: update Markdown to match HTML. HTML is never changed.

- [ ] **Step 1: Align Unit 1 — `docs/lab-s1-unit1.html` vs `week-01.md` through `week-04.md`**

```bash
git add semester-1/weeks/week-01.md semester-1/weeks/week-02.md semester-1/weeks/week-03.md semester-1/weeks/week-04.md
git commit -m "Align Unit 1 Markdown to HTML (5a)"
```

- [ ] **Step 2: Align Unit 2 — `docs/lab-s1-unit2.html` vs `week-05.md` through `week-08.md`**

```bash
git add semester-1/weeks/week-05.md semester-1/weeks/week-06.md semester-1/weeks/week-07.md semester-1/weeks/week-08.md
git commit -m "Align Unit 2 Markdown to HTML (5a)"
```

- [ ] **Step 3: Align Unit 3 — `docs/lab-s1-unit3.html` vs `week-09.md` through `week-12.md`**

```bash
git add semester-1/weeks/week-09.md semester-1/weeks/week-10.md semester-1/weeks/week-11.md semester-1/weeks/week-12.md
git commit -m "Align Unit 3 Markdown to HTML (5a)"
```

- [ ] **Step 4: Align Unit 4 — `docs/lab-s1-unit4.html` vs `week-13.md` through `week-16.md`**

```bash
git add semester-1/weeks/week-13.md semester-1/weeks/week-14.md semester-1/weeks/week-15.md semester-1/weeks/week-16.md
git commit -m "Align Unit 4 Markdown to HTML (5a)"
```

- [ ] **Step 5: Align Semester 2 — each HTML vs its unit Markdown**

```bash
git add semester-2/weeks/unit-5.md semester-2/weeks/unit-6.md semester-2/weeks/unit-7.md semester-2/weeks/unit-8.md
git commit -m "Align Semester 2 Markdown to HTML (5a)"
```

---

### Task 23: 5c — Semester 1 Minor Items (Items 1–74)

- [ ] **Step 1: Read feedback items 1–74**

```bash
cat /mnt/c/Users/bradj/Development/noctura-course-review/course-feedback.md
```

For each item in range 1–74 (excluding 75 in PR 1), note: file, problem, fix.

- [ ] **Step 2: Fix Unit 1 items — `docs/lab-s1-unit1.html`**

Apply all Unit 1 range items. Commit:
```bash
git add docs/lab-s1-unit1.html
git commit -m "Unit 1 minor fixes — Items [range] (5c)"
```

- [ ] **Step 3: Fix Unit 2 items — `docs/lab-s1-unit2.html`** (excluding Item 75)

```bash
git add docs/lab-s1-unit2.html
git commit -m "Unit 2 minor fixes — Items [range] (5c)"
```

- [ ] **Step 4: Fix Unit 3 items — `docs/lab-s1-unit3.html`** (excluding Items 82, 83, 84)

```bash
git add docs/lab-s1-unit3.html
git commit -m "Unit 3 minor fixes — Items [range] (5c)"
```

- [ ] **Step 5: Fix Unit 4 items — `docs/lab-s1-unit4.html`** (excluding Items 87, 88, 89)

```bash
git add docs/lab-s1-unit4.html
git commit -m "Unit 4 minor fixes — Items [range] (5c)"
```

---

### Task 24: 5d — Semester 2 Remaining Minor Items

- [ ] **Step 1: Identify remaining Semester 2 items**

Items already addressed in PRs 1–4: 83, 84, 90, 91, 92, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105.
Read feedback items 90–105 and list any not in that set.

- [ ] **Step 2: Apply remaining fixes to the appropriate Semester 2 HTML file**

- [ ] **Step 3: Commit**
```bash
git add docs/lab-s2-unit5.html docs/lab-s2-unit6.html docs/lab-s2-unit7.html docs/lab-s2-unit8.html
git commit -m "Semester 2 remaining minor fixes (5d)"
```

---

### Task 25: 5e — Progress Bar Count Audit

**Files:** All 8 HTML lab files

- [ ] **Step 1: Count toggleStep calls vs prog-text declared count in each file**

```bash
for f in docs/lab-s1-unit1.html docs/lab-s1-unit2.html docs/lab-s1-unit3.html docs/lab-s1-unit4.html \
          docs/lab-s2-unit5.html docs/lab-s2-unit6.html docs/lab-s2-unit7.html docs/lab-s2-unit8.html; do
  count=$(grep -c "toggleStep" "$f")
  declared=$(grep -o "0 / [0-9]* steps" "$f" | head -1)
  echo "$f: toggleStep=$count declared=$declared"
done
```

Any file where toggleStep count ≠ declared number is a bug.

- [ ] **Step 2: Fix each discrepancy**

For each file with a mismatch, update the `<span id="prog-text">` to match the actual toggleStep count.

- [ ] **Step 3: Re-run Step 1 and confirm all match**

- [ ] **Step 4: Commit**
```bash
git add docs/lab-s1-unit1.html docs/lab-s1-unit2.html docs/lab-s1-unit3.html docs/lab-s1-unit4.html \
        docs/lab-s2-unit5.html docs/lab-s2-unit6.html docs/lab-s2-unit7.html docs/lab-s2-unit8.html
git commit -m "Progress bar count audit — align all prog-text totals to actual step counts (5e)"
```
