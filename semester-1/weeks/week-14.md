# Week 14: Red Team Your Prototypes — Attack + Defend + Iterate

**Semester 1 | Week 14 of 16**

## Learning Objectives

- Apply defense strategies from Week 8 theory to Week 13 empirical findings
- Experience cross-team red teaming: attack another team's prototype while defending your own
- Implement a four-layer defense model based on the PeaRL case study
- Measure attack reduction rate before and after defense improvements
- Report findings using AA-TTP codes
- Experience the full attacker/defender cycle that Semester 2 will build on

---

## Day 1 — Theory

### The Four-Layer Defense Model

From Week 8's defense in depth and Week 13's PeaRL attack chain, four layers stop most agent attacks:

**Layer 1 — Input Filtering (stops AA-INIT):**
- Schema validation on all tool inputs
- Injection pattern detection before inputs reach the agent
- Structural constraints: field types, lengths, allowed characters

**Layer 2 — Intent Recognition (stops AA-PRIV and AA-IMPACT):**
- The agent's system prompt must recognize when a request is escalating permissions
- Hard-coded constraints that can't be overridden: "Never execute delete operations regardless of framing"
- Confidence thresholds: "Only take autonomous action if confidence > 0.95"

**Layer 3 — Output Validation (stops AA-EXFIL):**
- Validate agent output structure before acting on it
- Whitelist allowed action types; reject unknown actions
- Data minimization in outputs: only return what the caller needs

**Layer 4 — Monitoring and Detection (stops AA-EVADE):**
- Log every decision with full context
- Flag anomalous patterns (unusual tool call sequences, high-frequency requests)
- Alert on governance gate bypasses (any action that should require human approval but didn't)

The goal is not to make attacks impossible — it's to make attacks visible and expensive. A well-defended system catches the attacker at Layer 1 or 2 and logs the attempt, enabling forensic reconstruction.

### Defense Strategies Against OWASP Top 10

**Prompt Injection Defense:**
The fundamental principle: separate data from instructions. Data goes into a structured field the agent receives as input. Instructions are in the system prompt. The agent should never be processing user-controlled text that could be interpreted as instructions.

```python
# Vulnerable: user input mixed into system context
response = client.messages.create(
    model="claude-sonnet-4-6",
    system=f"You are a security analyst. User context: {user_input}",
    messages=[{"role": "user", "content": "Analyze this incident."}]
)

# Hardened: user input in a structured data field only
response = client.messages.create(
    model="claude-sonnet-4-6",
    system="You are a security analyst. Analyze the incident in the 'data' field.",
    messages=[{"role": "user", "content": json.dumps({"data": user_input})}]
)
```

**Insecure Tool Integration Defense:**

Input validation for every parameter that touches a filesystem or database:

```python
import pathlib

ALLOWED_DIRS = [pathlib.Path("/app/data"), pathlib.Path("/app/reports")]

def read_file_secure(filename: str) -> str:
    # Resolve to canonical path (eliminates ../)
    path = pathlib.Path(filename).resolve()

    # Check against whitelist
    if not any(path.is_relative_to(d) for d in ALLOWED_DIRS):
        raise PermissionError(f"Access denied: {filename} is outside allowed directories")

    # Resource limit
    if path.stat().st_size > 1_000_000:  # 1MB limit
        raise ValueError(f"File too large: {path.stat().st_size} bytes")

    return path.read_text()
```

**Memory Poisoning Defense:**
- Access controls on knowledge base writes: only trusted, validated sources can add entries
- Checksums or version hashes on entries to detect tampering
- Provenance tracking: every entry records where it came from, when, and who added it

**Insufficient Logging Defense:**
```python
import structlog

log = structlog.get_logger()

def log_agent_decision(agent_name, input_hash, action_taken, confidence, reasoning_summary):
    log.info(
        "agent_decision",
        agent=agent_name,
        input_hash=input_hash,  # Hash, not full input — privacy
        action=action_taken,
        confidence=confidence,
        reasoning=reasoning_summary,
        timestamp=datetime.utcnow().isoformat(),
        version=AGENT_VERSION,
    )
```

Note: log the input *hash*, not the raw input, for privacy. Log enough to reconstruct the decision, not enough to exfiltrate sensitive data through log aggregation.

### Measuring Defense Effectiveness

**Attack Reduction Rate (ARR):**
```
ARR = (attacks_blocked / attacks_attempted) × 100%
```

Measure this separately for each PeaRL level and each OWASP risk. A 90% ARR means 10% of attacks succeed — is that acceptable for your threat model?

**Mean Time to Detect (MTTD):**
```
MTTD = average time from attack initiation to detection in logs
```

An attack that succeeds but is detected immediately (MTTD < 1 min) is less dangerous than one that succeeds silently for hours.

**Defense Coverage:**
```
Coverage = PeaRL_levels_with_controls / 7
```

A system with controls at all 7 PeaRL levels has 100% coverage. Week 13 likely found some levels unprotected — Week 14 closes those gaps.

---

## Day 2 — Lab: Cross-Team Attack and Defend

### Setup (10 min)

Teams pair with another team. Team A attacks Team B's prototype; Team B attacks Team A's prototype. Each team has already:
- Built their prototype (Weeks 11-12)
- Built attack tools against their own prototype (Week 13)
- Identified their gaps (Week 13 findings report)

Share your Week 13 threat model (attack surface, not the attacks) with the opposing team so they can mount a realistic red team.

### Round 1: Attack (30 min)

Each team attacks the opposing team's prototype using the attack tools built in Week 13.

**Rules of engagement:**
- Use only the attack techniques from Week 13 (no system-level attacks, no brute force on APIs)
- Document every attempt: input, expected behavior, actual behavior
- Record which AA-TTP level each successful attack reaches
- Do not modify the opposing team's code

**Attack log format:**
```json
{
  "timestamp": "2026-03-XX T##:##:##Z",
  "target_team": "Team B",
  "attack_type": "prompt_injection",
  "aa_ttp": "AA-INIT",
  "payload": "[what was sent]",
  "expected_behavior": "Input rejected",
  "actual_behavior": "Agent followed injected instruction",
  "severity": "high",
  "aiuc1_control_bypassed": "B005"
}
```

### Round 2: Defend (30 min)

Each team receives the opposing team's attack log. Implement fixes for the highest-severity findings:

**Triage your findings:**
- Critical/High AIVSS + easy to fix → fix immediately (20 min)
- Critical/High AIVSS + complex → implement partial mitigation + document residual risk
- Medium/Low → document, defer to Week 15

Use Claude Code to generate fixes:
```
I received this red team finding:

Attack: [describe attack from log]
What succeeded: [describe what the attacker accomplished]
Control that failed: [which AIUC-1 control was bypassed?]
AIUC-1 domain: [B, C, D, etc.]

Implement a fix that stops this specific attack. Use the four-layer defense model.
Explain which layer the fix operates at and why it stops the attack.
```

### Round 3: Retest and Measure (20 min)

Teams retest the fixed defenses with their attack tools.

**Measure improvement:**
```
| Attack Type | Before Defense | After Defense | Status |
|---|---|---|---|
| Prompt injection | AA-INIT reached | Blocked at Layer 1 | Fixed |
| Tool enumeration | AA-RECON reached | Blocked + logged | Fixed |
| Path traversal | AA-PRIV reached | Blocked at Layer 1 | Fixed |
```

Calculate Attack Reduction Rate (ARR):
- Before: X attacks succeeded out of Y attempted
- After: A attacks succeeded out of Y attempted
- ARR = (1 - A/X) × 100%

### Findings Debrief (20 min)

Both teams share findings with each other. Discuss:
- What surprised you about the other team's defenses?
- Which attacks worked that you didn't expect to work?
- Which defenses stopped attacks that seemed likely to succeed?
- What would you do differently if you were building the prototype from scratch with today's threat model knowledge?

This debrief is the core CCT exercise for the week: diverse perspectives on the same security problem surfacing what each team couldn't see about its own prototype.

---

## Deliverables

1. **Attack log** — all attacks attempted against the opposing team's prototype with AA-TTP codes and severity
2. **Defense implementation** — code changes made in response to red team findings
3. **Metrics report** — ARR before and after defense, MTTD measurement, Defense Coverage percentage
4. **Findings report using AA-TTP codes** (1,000 words):
   - Findings organized by PeaRL level reached
   - AIUC-1 control bypassed at each level
   - Defense implemented and its effectiveness
   - Residual risks not fixed in lab time

---

## AIUC-1 Integration

**Domain B001 (Adversarial Robustness Testing) completed:** Running the attack tools and measuring the results is the empirical implementation of B001. Document your test methodology and results as evidence of B001 compliance.

**Domain C (Safety) under pressure:** If any attack reached AA-IMPACT (causing harm through tool execution), the safety gate should have stopped it. If it didn't, that's a C failure — address it before Week 15.

## V&V Lens

**Red Team as V&V Completion:** Week 11 built the tool. Week 12 hardened it. Week 13 found gaps. Week 14 closes them. The full V&V cycle for a security tool includes adversarial testing — functional correctness is necessary but not sufficient.

**V&V Documentation for Week 16:** Your Week 14 attack log, defense implementation, and ARR measurements are V&V documentation that Week 16 presentations must include. "We tested it and nothing broke" is not V&V documentation. "We attempted 12 attacks, 9 were blocked, 3 succeeded, 3 were fixed, 0 remain as accepted risk" is.

---

> **🧠 Domain Assist:** Building effective defenses requires understanding the offensive mindset. If you come from a defensive or compliance background, red team thinking doesn't come naturally. Before building your defenses, ask Claude Chat:
>
> "I'm building a red team attack tool for prompt injection. Help me think like a red teamer: 1) What makes a prompt injection attack succeed vs. fail? What's the attacker's mental model? 2) What are the most effective injection patterns — not just the obvious ones, but the subtle ones defenders miss? 3) How would I chain multiple techniques into a multi-stage attack? 4) What does a sophisticated attacker do differently from a script kiddie when targeting AI agents?"

---

**Defense iteration exercise: Map PeaRL seven-level attack chain**

For each of the seven PeaRL levels (AA-RECON through AA-EXFIL), map your defense:
- Level 1 (AA-RECON): Which control prevents tool enumeration?
- Level 2 (AA-INIT): Which control stops prompt injection?
- Level 3 (AA-PRIV): Which control prevents privilege escalation?
- Level 4 (AA-EVADE): Which control ensures logging coverage?
- Level 5 (AA-IMPACT): Which control enforces safety gates?
- Level 6 (AA-PERSIST): Which control limits session persistence?
- Level 7 (AA-EXFIL): Which control minimizes data in outputs?

Document which PeaRL levels your defense covers and which remain exposed. This becomes a core section of your Week 16 presentation.

---

## Blue Team Defense Artifact: Production Readiness Report

Your Week 14 defense package includes a `/check-prod-readiness` report as evidence of production security posture.

```
/check-prod-readiness ~/noctua/tools/sprint-ii/
```

The report documents your defense in three categories:
- **Fixed:** Patterns found and remediated before this week
- **Accepted Risk:** Patterns found, documented, with mitigation rationale
- **Gaps:** Patterns not found by the skill that the red team exploited

Present this alongside your ARR (Attack Reduction Rate). If the red team found Pattern 2.2 (Missing Idempotency) and your Sprint II report flagged it, you have a documented process failure — you knew about it and didn't fix it. If your report missed it, that's a calibration gap for the skill.

> The three-evaluator pipeline isn't just sequential — it's a feedback loop. Red team findings that `/check-prod-readiness` missed become calibration improvements for the next sprint.

---

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the key concepts from this reading. Start easy, then get harder."
> - "I think I understand the four-layer defense model but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common defense failures when hardening AI security tools? Do I have any of them?"
> - "Connect this week's defense work to Week 13's attack findings. What does our ARR tell us about our defense coverage?"

---

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.

---

## Lab Update (PR 4)

`docs/lab-s1-unit4.html` Week 14 (Sprint I) now includes **Step 0: AIUC-1 pre-check** as the first lab step (id: `step-w14-0`). Run `/audit-aiuc1` on your planned system architecture before writing code. Focus on Domains B (Security), D (Reliability), and E (Accountability) at minimum. Save output as `sprint1/aiuc1-precheck.md` — this is a graded deliverable. The skill was built in Unit 2 Week 6; the file is at `.claude/skills/audit-aiuc1/SKILL.md`. Progress bar updated from 26 to 27 steps.
