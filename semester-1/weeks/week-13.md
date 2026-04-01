# Week 13: Multi-Agent Architecture Deep Dive

**Semester 1 | Week 13 of 16**

## Learning Objectives

- Apply MITRE ATLAS threat modeling to AI security systems
- Understand the PeaRL Autonomous Agent Attack Framework (AA-RECON through AA-EXFIL)
- Understand the dark factory concept as an attacker capability: autonomous pipelines at scale
- Apply the Assessment Stack to red team work — find the cheapest effective attack, not the most sophisticated one
- Build attack tools using Claude Code to probe your own prototype
- Produce a threat model document mapping your prototype's attack surface

---

## Day 1 — Theory

### Why Red Team AI Systems?

Traditional red teaming finds bugs in code. Red teaming AI security systems finds something different: bugs in reasoning, gaps in governance, and attack surfaces that don't exist in traditional software.

An AI agent that works correctly on all test inputs can still be unsafe. Correctness and safety are not the same property. This week you systematically look for the difference.

### MITRE ATLAS: Threat Modeling for AI

MITRE ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) is the ML-specific extension of the ATT&CK framework. It catalogs adversary tactics, techniques, and procedures (TTPs) specifically targeting AI systems.

Key ATLAS tactics relevant to your prototypes:

**Reconnaissance (AML.TA0002):**
- Query the model to infer its architecture, training data, or capabilities
- Probe boundaries: what does it refuse? What does it accept?
- Application to your prototype: what can an attacker learn by submitting varied inputs?

**ML Attack Staging (AML.TA0001):**
- Prepare attack data (adversarial examples, poisoned inputs, injection payloads)
- Applicable to RAG systems: prepare knowledge base poisoning entries

**Initial Access (AML.TA0004):**
- Physical environment attack: access the system through its intended inputs
- Supply chain compromise: attack a model, dataset, or dependency before deployment
- Applicable to your prototype: what input channels exist? Which are validated?

**Exfiltration (AML.TA0010):**
- Infer training data through model outputs
- Extract confidential data injected via RAG or context
- Applicable to your prototype: what data could an attacker extract through carefully crafted queries?

**Impact (AML.TA0012):**
- Harm the availability or integrity of the system
- Denial of model service, manipulation of model behavior
- Applicable to your prototype: what is the worst-case outcome of a successful attack?

### The PeaRL Autonomous Agent Attack Framework

PeaRL (Progressive Exploitation and Recursive Leverage) describes a seven-level escalating attack chain against autonomous agent systems. Each level builds on the previous. The key insight: individually reasonable steps can accumulate into catastrophic outcomes.

| Level | Code | Action | What It Exploits |
|-------|------|--------|-----------------|
| 1 | AA-RECON | Enumerate accessible tools and their schemas | Missing tool access controls |
| 2 | AA-INIT | Initial access via prompt injection | Insufficient input filtering |
| 3 | AA-PRIV | Escalate from read to write access | Excessive tool permissions |
| 4 | AA-EVADE | Avoid audit logging | Incomplete logging coverage |
| 5 | AA-IMPACT | Cause harm through tool execution | Missing safety gates |
| 6 | AA-PERSIST | Maintain access across sessions | No session controls |
| 7 | AA-EXFIL | Extract data through outputs | Data minimization failures |

**AIUC-1 mapping:** Each level has a corresponding control that stops it. AA-RECON is stopped by B006 (limit agent access). AA-INIT is stopped by B005 (input filtering). AA-IMPACT is stopped by C (safety gates). The chain fails when it hits a hard control.

**The dark factory connection:** Attackers running autonomous pipelines (like GTG-1002 at 80-90% autonomy) don't manually execute each PeaRL level — they automate the chain. An attack tool that probes AA-RECON, identifies exploitable gaps, and proceeds to AA-INIT without human involvement is a dark factory attack. Your defenses must be equally automated.

### Assessment Stack for Red Team

Apply the Assessment Stack to attack selection — not just defense:

**Layer 2 — Computation for Attacks:**
- Simple injection strings (deterministic) — try these first, they're free
- Pattern-based probing (statistical) — send varied inputs, look for inconsistent behavior
- Reasoning-based attacks (LLM-assisted) — generate novel attack payloads using Claude

**Layer 3 — Model Selection for Attacks:**
The cheapest effective attack wins. A regex injection that bypasses input validation costs $0. A sophisticated model-assisted attack chain costs $5+. Start cheap. Only escalate if cheap attacks fail.

**Layer 1 — What Type of Problem Is an Attack?**
- Classification attacks: make the model misclassify
- Retrieval attacks (RAG): inject false data, extract data via queries
- Reasoning attacks: confuse or redirect the agent's reasoning
- Generation attacks: cause the agent to produce harmful outputs

Match your attack type to the specific weakness you're targeting.

### OWASP Top 10 as Attack Checklist

Every item on the OWASP Top 10 for Agentic Applications is both a defense requirement (Week 8) and an attack vector (this week):

| OWASP Risk | Attack Vector | AA-TTP Code |
|---|---|---|
| Excessive Agency | Escalate to high-risk actions via reasonable steps | AA-PRIV + AA-IMPACT |
| Prompt Injection | Inject instructions into external data or tool outputs | AA-INIT |
| Insecure Tool Integration | Path traversal, SQL injection via tool parameters | AA-INIT + AA-PRIV |
| Memory Poisoning | Inject false entries into RAG knowledge base | AA-INIT + AA-PERSIST |
| Insufficient Logging | Craft inputs that bypass or overwhelm logging | AA-EVADE |
| Inadequate IAM | Reuse or escalate from weak credentials | AA-PRIV |

---

## Day 2 — Lab

### Lab: Three-Agent SOC System

Before building attack tools, document the threat model for your prototype.

**Step 1: Attack Surface Mapping (15 min)**

List every input channel to your prototype:
- User-provided inputs (what fields? what formats?)
- Tool outputs that feed back into the agent
- External data sources (APIs, databases, files)
- Knowledge base (if your tool uses RAG)

For each channel, ask: what's the worst-case payload an attacker could send?

**Step 2: Map to PeaRL Levels (10 min)**

For each input channel, which PeaRL levels does it enable?
- Direct user input → AA-INIT (prompt injection)
- Tool with write access → AA-PRIV (privilege escalation)
- Logging gaps → AA-EVADE
- RAG knowledge base → AA-INIT + AA-PERSIST (memory poisoning)

Document in a table:

```
| Input Channel | PeaRL Levels Reachable | Control Present? | Control Sufficient? |
|---|---|---|---|
| User input | AA-INIT | Yes (sanitize_input()) | Partial (patterns incomplete) |
| Threat DB lookup | AA-RECON | No | Missing |
| Knowledge base | AA-INIT, AA-PERSIST | No | Missing |
```

**Step 3: ATLAS TTP Selection (10 min)**

For each gap identified, select the most relevant ATLAS technique:
- Input injection → AML.T0051 (LLM Prompt Injection)
- Knowledge base attack → AML.T0053 (Backdoor ML Model)
- Tool enumeration → AML.T0001 (Discover ML Model)

**Step 4: Build Attack Tools (55 min)**

Use Claude Code to build attack tools against your own prototype:

**Prompt Injection Tester:**
```
Build a prompt injection tester for [your tool].

My tool accepts this input format: [your input schema]

Generate 20 injection payloads that attempt to:
1. Override the agent's system prompt instructions
2. Redirect the agent to perform unauthorized actions
3. Extract information from the agent's context that shouldn't be accessible
4. Cause the agent to produce malformed output that bypasses validation

Test each payload against my tool and record:
- Did the injection execute? (Yes/No/Partial)
- What was the agent's response?
- Which OWASP risk and PeaRL level does this correspond to?

Output results as structured JSON.
```

**Tool Enumeration Probe:**
```
Build a tool enumeration attack against [your tool].

My tool exposes these MCP tools: [list your tools]

For each tool:
1. Probe the input schema boundaries (what's the min/max? what happens with null?)
2. Test for path traversal in any file/path parameters
3. Test for injection in any string parameters
4. Test for integer overflow in any numeric parameters

Record which probes produce unexpected behavior.
```

**Knowledge Base Poisoning Test (if your tool uses RAG):**
```
My tool uses a RAG knowledge base with these fields: [your schema]

Craft 3 poisoning entries that:
1. Are plausible enough to pass input validation
2. Would change the agent's recommendations if retrieved
3. Persist across sessions (not filtered at query time)

For each entry, describe: what behavior it would cause, which query would trigger it,
and how to detect it from the audit log.
```

**Step 5: Document Findings (10 min)**

For each attack that succeeded (partial or full):
- Vulnerability: [name]
- AA-TTP Code: [AA-RECON, AA-INIT, etc.]
- ATLAS TTP: [AML.T####]
- CVSS/AIVSS Score: [estimate]
- Affected AIUC-1 Domain: [A, B, C, D, E, F]
- Evidence: [what output indicated the vulnerability?]
- Week 12 control that should have stopped it: [what was missing or insufficient?]

These findings drive the Week 14 defend-and-iterate session.

---

## Deliverables

1. **Threat model document** — attack surface map, PeaRL level mapping, ATLAS TTP selection
2. **Attack tools** — working code for at least 2 of the 3 attack types (injection tester, tool enumerator, knowledge base poisoner)
3. **Findings report** — structured list of vulnerabilities found with AA-TTP codes, AIVSS scores, and affected AIUC-1 domains
4. **Attack vs. control mapping** — for each finding: which Week 12 control failed to stop it?

---

## AIUC-1 Integration

**Domain B001 (Adversarial Robustness Testing):** This week's lab IS B001 in practice. Every prompt injection test and tool enumeration probe is an adversarial robustness test.

**V&V Adversarial Assumption:** From Week 8, V&V includes the adversarial assumption: assume an intelligent adversary is trying to make your system fail or be weaponized. Week 13 makes this assumption concrete and empirical.

## V&V Lens

**Red Team as Empirical V&V:** A passing unit test suite means nothing if an attacker can bypass it. Red teaming is V&V under the adversarial assumption. The findings are data: severity, exploitability, coverage of existing defenses.

**Before Week 14:** Review your threat model findings with your team. Prioritize which vulnerabilities you will fix in the 24 hours before Week 14's defend session. High AIVSS + easy to fix = fix immediately. High AIVSS + complex = plan your defense carefully.

### V&V Adversarial Assumption in Practice

This week is where the fourth dimension of V&V Discipline — Adversarial Assumption — becomes your primary operating mode. Everything you learned about Output Verification, Calibrated Trust, and Failure Imagination now gets stress-tested:

- **Can verification itself be compromised?** If your verification step queries a threat intel feed, what happens if the feed is poisoned?
- **Can trust calibration be exploited?** If you've trained analysts to trust CVE lookups without verification, an attacker who can inject false CVE data bypasses your V&V entirely.
- **Can failure imagination be weaponized?** If defenders over-imagine failure, they become paralyzed and stop acting on legitimate findings. Attackers can exploit this by flooding systems with false positives.

Red teaming isn't just about finding vulnerabilities in agents — it's about finding vulnerabilities in your V&V process itself. Your Week 13 lab should include at least one attack that targets the verification mechanism, not just the agent.

---

> **🧠 Domain Assist:** MITRE ATLAS threat modeling requires adversarial thinking — the ability to look at a system and see how an attacker would exploit it. If you come from a defensive or compliance background, this mindset doesn't come naturally. Before starting your threat model, ask Claude Chat:
>
> "I have a multi-agent SOC system with agents: Alert Ingester, Enrichment Agent, Analysis Agent, and Response Recommender. They communicate through shared state and direct calls. I need to think like an attacker. Help me: 1) Where would I start? What's the easiest entry point? 2) How would I move from compromising one agent to compromising the whole system? 3) What would I target — the agents, the communication between them, the tools, or the data? 4) What MITRE ATLAS techniques would apply? 5) What's the attack the defenders are least likely to think of?"

---

### Real-World AI Attack Scenarios

Understanding attacker capabilities makes your threat model concrete. These documented scenarios connect to the attacks you're building this week:

**AI-Generated Voice Phishing (Vishing)**
Attackers clone executive voices using AI voice synthesis and call employees requesting wire transfers or credential resets. In 2024, a UK engineering firm lost $25M to a deepfake video call where the CFO appeared to authorize transfers.
- AIUC-1 connection: Domain C (Safety) — harmful output prevention; Domain B (Security) — adversarial robustness
- Defense: Voice verification protocols, callback procedures, multi-party authorization

**AI-Scaled Spear Phishing**
Attackers use LLMs to generate thousands of personalized phishing emails tailored to the target's role, recent activities, and communication style — scraped from LinkedIn and public data. Volume + personalization = unprecedented success rates.
- AIUC-1 connection: Domain B (Security) — adversarial input detection
- Defense: AI-powered email analysis, behavioral baselines

**Deepfake Executive Impersonation**
Video calls with AI-generated faces and voices impersonating executives for BEC (Business Email Compromise). The attacker doesn't need to compromise an account — they create a convincing synthetic version.
- AIUC-1 connection: Domain E (Accountability) — identity verification, audit trails
- Defense: Out-of-band verification, liveness detection

**Autonomous Vulnerability Exploitation**
AI agents that autonomously scan for vulnerabilities, generate exploits, test them, and deploy payloads — the attacker dark factory model. Demonstrated in research settings; emerging in the wild.
- AIUC-1 connection: Domain B (Security) — all controls; this is the threat AIUC-1 was designed for
- Defense: Autonomous defensive agents, real-time detection, zero-trust architecture

**Synthetic Identity Fraud**
AI generates fake identities at scale — synthetic faces, fabricated credit histories, AI-written social media profiles. Used for financial fraud, account creation abuse, and infiltrating organizations.
- AIUC-1 connection: Domain A (Data & Privacy) — identity verification; Domain F (Society) — societal impact
- Defense: Identity verification pipelines, behavioral analytics

**AI-Powered Social Engineering Campaigns**
Agents that maintain long-running social engineering pretexts across multiple channels — building trust over weeks before executing the attack.
- AIUC-1 connection: Domain C (Safety) — multi-turn interaction risks; Domain B (Security) — adversarial robustness
- Defense: Behavioral anomaly detection, communication pattern analysis

**Lab reference:** For each OWASP risk in your threat model, identify which real-world attack scenario from this gallery exploits it. This connects your theoretical vulnerability assessment to real-world attacker capabilities.

---

### The Attacker's Dark Factory

The most dangerous evolution in the threat landscape is autonomous attack infrastructure — the attacker's dark factory. Unlike traditional attacks that require skilled human operators, a dark factory attack pipeline runs autonomously:

1. **Recon agent** continuously scans for vulnerable targets across the internet
2. **Exploit agent** chains vulnerabilities and generates custom payloads
3. **Persistence agent** establishes footholds and maintains access
4. **Exfiltration agent** identifies and extracts high-value data
5. **Cleanup agent** covers tracks and rotates infrastructure

This pipeline runs 24/7, hits thousands of targets simultaneously, and costs almost nothing per target. A 2% success rate across 100,000 targets yields 2,000 compromises with zero human labor.

The Anthropic GTG-1002 espionage campaign (disclosed November 2025, detected September 2025) was an early prototype of this model — operating at 80–90% autonomy across recon, credential harvesting, and data exfiltration.

**Implication for defenders:** You cannot defend against machine-speed attacks at human speed. Your defensive systems need autonomous capabilities — but with the governance guardrails (AIUC-1, V&V, human override) that prevent your dark factory from becoming another threat.

---

> ### Case Study: Claude Finds 22 Firefox Vulnerabilities (March 2026)
>
> In a documented case of AI autonomous security research at production scale, Anthropic deployed Claude Opus 4.6 to scan ~6,000 Firefox C++ files. Results over approximately two weeks:
>
> | Metric | Result |
> |---|---|
> | Vulnerabilities confirmed | **22** (14 high-severity, 7 moderate, 1 low) |
> | Reports generated by Claude | 112 → 22 confirmed (~80% false positive rate — normal for automated security research) |
> | Working exploits produced | 2 of several hundred attempts — only in environments with intentionally removed security features |
> | API cost | **$4,000** (≈ $182 per confirmed vulnerability) |
> | Time to first finding | **20 minutes** |
>
> Human review was required at every decision point. This is the dark factory model applied to defensive security research — not fully autonomous, but overwhelmingly AI-executed at the tactical level.
>
> **The dual-use question:** The same agentic loop that finds bugs to patch can find bugs to exploit. What changes between defensive and offensive use is not capability — it is authorization, governance, and the human decision at the end of the chain.
>
> **Full case study:** `resources/case-studies/firefox-autonomous-security-research.md`
> **Primary source:** https://www.anthropic.com/news/mozilla-firefox-security

> **📖 Case Study Connection:** The Autonomous Agent Attack Framework (AA-RECON, AA-INIT, AA-PRIV, AA-EVADE, AA-IMPACT) from the PeaRL case study is your TTP taxonomy for red teaming. When you attack each other's systems, report your findings using these TTP codes. When you find a new technique, propose a new TTP code and justify it.

---

## Red Team Attack Playbook: Anti-Patterns Reference

The [AI Code Anti-Patterns Reference](../../docs/resources/ai-code-antipatterns-reference.md) is your Week 13 attack specification. Every pattern with grep-detectable heuristics is a test you can run against the target system:

```bash
# Does their error handling swallow exceptions? (1.1 — false negatives)
grep -rn "except.*:" --include="*.py" | grep -v "except.*Error"

# Do they compare secrets with == ? (4.1 — timing attack)
grep -rn "==.*key\|==.*token\|==.*secret" --include="*.py"

# Do they log user input directly? (4.2 — log injection)
grep -rn "logger.*f\"\|logging.*f\"" --include="*.py"

# Do they have unbounded collections? (2.3 — memory exhaustion)
grep -rn "\.append\b" --include="*.py"

# Do they have input bounds? (4.3 — OOM / SQL injection)
grep -rn "@tool\|@app.post" --include="*.py"
```

For each finding: document the pattern ID, file:line, what the exploit sends, what the production impact would be, and whether it maps to a PeaRL AA-TTP code. This is a professional penetration test, not just a code review.

---

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the key concepts from this reading. Start easy, then get harder."
> - "I think I understand MITRE ATLAS threat modeling but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common mistakes teams make when red teaming AI systems? Do I have any of them?"
> - "Connect this week's red team work to what we learned in Weeks 11-12. What does red teaming tell us about our sprint prototypes?"

---

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.
