# Week 2: Context Engineering + Model Selection

**Semester 1 | Week 2 of 16**

## Learning Objectives

- Understand the evolution from naive prompting to context engineering
- Master model tiers and when to use each (with current 2026 pricing)
- Understand token economics and why context engineering compresses cost
- Learn automatic prompt caching and how to optimize for it
- Apply computation approach selection: deterministic vs. statistical vs. reasoning
- Implement SDK cost tracking for context-engineered vs. naive prompts
- Recognize that structured outputs serve as audit trails (AIUC-1 Domain E introduction)

---

## Day 1 — Theory

### From Prompts to Context Engineering

In 2023, "prompt engineering" meant phrasing a question better. In 2026, context engineering means designing the entire information environment in which the model operates. This includes:

1. **System prompts** — defining role, constraints, and output format
2. **Tool definitions** — declaring what the model can invoke
3. **Memory architectures** — maintaining state across turns
4. **Structured output schemas** — forcing deterministic, machine-readable results
5. **Retrieval patterns** — injecting fresh domain knowledge when needed

The shift matters because you're no longer asking one-off questions. You're building systems that make decisions, integrate with production infrastructure, and require consistent, auditable outputs.

### The AI Landscape in 2026: Model Tiers

The market has stratified into tiers. Current pricing (2026):

| Tier | Model | Price (Input/Output) | Best For |
|------|-------|---------------------|---------|
| Reasoning | Claude Opus | $5/$25 per MTok | Deep analysis, complex judgment, rare high-stakes |
| Balanced | Claude Sonnet | $3/$15 per MTok | Operational workflow, everyday reasoning |
| Fast | Claude Haiku | $1/$5 per MTok | Routing, classification, high-throughput tasks |
| Specialized | Code/vision models | Variable | Domain-specific tasks |
| Open-source | Llama, Mistral | Infrastructure cost | Privacy-critical, high-volume batch |

### The Critical Question: Deterministic, Statistical, or Reasoning?

Before choosing a model tier, ask what *type* of computation you need:

**Deterministic:** Known rules, exact matching, no ambiguity
- Use regex, rules engines, lookup tables — no LLM at all
- Example: "Is this a valid IPv4 address?" → `re.match()` is faster and cheaper than Haiku

**Statistical:** Pattern matching on known categories
- Use classifiers, embeddings, anomaly detectors — small/specialized models
- Example: "Is this email phishing?" → A fine-tuned classifier may outperform Opus on precision

**Reasoning:** Novel situations, ambiguous evidence, complex judgment
- Use LLM — and choose the tier based on depth required
- Example: "What does this attack chain mean for our specific organization?" → Sonnet or Opus

> **Assessment Stack Layers 2-3:** This week crystallizes the computation approach (Layer 2) and model selection (Layer 3) decisions. The rule: never use a reasoning model for a deterministic task. A regex beats Opus for pattern matching. Opus beats regex for novel analysis.

### Why a Regex Beats Opus for Pattern Matching

Concrete cost comparison for CVE ID validation:

| Approach | Cost per 1K checks | Latency | Accuracy |
|----------|-------------------|---------|---------|
| Regex `^CVE-\d{4}-\d{4,6}$` | $0.000001 | <1ms | 100% |
| Haiku API call | $0.001 | 500ms | ~99% |
| Opus API call | $0.005 | 2000ms | ~99% |

For this task, regex is 5,000× cheaper and 2,000× faster than Opus, with higher accuracy.

### Token Economics

**Input vs. Output pricing:** Input tokens cost less than output tokens. Optimize by:
- Being concise in prompts (reduce input)
- Asking for structured outputs (reduce output verbosity)
- Caching repeated context (reduce repeated input cost)

**Practical example:** A 27.5K token incident analysis with Opus:
- Input cost: 27,500 × $0.000005 = **$0.14**
- Output (2K tokens): 2,000 × $0.000025 = **$0.05**
- Total: **$0.19 per analysis**

At 100 incidents/day → ~$7K/year. A human analyst costs $80K+/year. If Claude accelerates analysis by 5%, it's ROI-positive.

**The hidden cost of irrelevant context:** Including unnecessary content in your prompt (a full log file when only 5% applies) can double your token spend. Context engineering means curating what to include.

### V&V Discipline: The CCT Companion

The five pillars of CCT are thinking frameworks — they help you reason better about complex problems. V&V Discipline is an action framework — it tells you what to *do* before acting on AI-generated outputs.

Think of it this way: CCT helps you ask better questions. V&V Discipline helps you confirm the answers.

**The Four Dimensions of V&V Discipline:**

1. **Output Verification** (this semester) — "Is this true? Can I check?"
   - Verify factual claims against independent sources
   - Check for hallucination or fabrication
   - Confirm that evidence cited actually exists and says what the agent claims
   - Ask the agent to show its reasoning, then evaluate whether the reasoning supports the conclusion

2. **Calibrated Trust** (this semester) — "How much should I trust this specific output?"
   - Factual lookups (CVE data, IP geolocation): high trust, light verification
   - Pattern analysis (anomaly detection, correlation): medium trust, spot-check verification
   - Judgment calls (intent assessment, risk severity): low trust, independent analysis required
   - Action recommendations (isolate server, block user): near-zero trust, human decision required

3. **Failure Imagination** (this semester) — "What if this is wrong?"
   - Before acting on an AI recommendation, ask: what's the worst outcome if this is incorrect?
   - Reversible actions (add a monitoring rule) have lower verification thresholds than irreversible actions (wipe a server)
   - The consequence determines the verification effort, not the confidence score

4. **Adversarial Assumption** (Semester 2) — "Could someone have manipulated this?"
   - Could an attacker have poisoned the data the agent used?
   - Could the agent's tools have returned compromised results?
   - Could the agent itself have been manipulated through prompt injection?
   - This dimension connects directly to red teaming and adversarial AI (Unit 6)

> **🔑 Key Concept:** You don't need to apply all four dimensions every time. Output Verification is the default — always do it. Calibrated Trust becomes instinctive with practice. Failure Imagination kicks in for high-consequence decisions. Adversarial Assumption is for threat modeling and security-critical deployments. The dimensions layer on as stakes increase.

### Automatic Prompt Caching

Claude automatically caches prompt prefixes that are repeated across API calls. If your system prompt is 2K tokens and you make 100 API calls with the same system prompt:
- Without caching: 100 × 2K = 200K tokens billed at full price
- With caching: 2K tokens at full price + 99 × 2K at cache price (~10% of full price)
- **Savings: ~90% on repeated context**

To optimize for caching:
1. Put stable content first (system prompt, examples, reference material)
2. Put variable content last (the actual incident data)
3. Minimize changes to the early portion of your prompt between calls

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on context engineering concepts. Start easy, then get harder."
> - "I think I understand prompt caching but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common mistakes when doing context engineering for the first time?"
> - "Connect this week's material on token economics to what we learned in Week 1 about the Engineering Assessment Stack."

---

## Day 2 — Lab

### Lab: Context Engineering + Cost Tracking

#### Company Profile: CloudShift

CloudShift is a SaaS platform management company that helps mid-market businesses orchestrate their cloud infrastructure across AWS, Azure, and GCP. They have 300 employees, 800+ enterprise customers, and manage $2M/month in customer cloud spend. Their own infrastructure runs entirely on AWS (us-east-1 primary, us-west-2 DR). The security team is lean — a 4-person team handling everything from vulnerability management to incident response. They process sensitive customer data including cloud credentials, API keys, and infrastructure configurations. SOC 2 Type II certified, and their largest customers require annual penetration tests.

> **🧠 Domain Assist:** To evaluate model outputs meaningfully, you need to understand what makes one analysis better than another. If you're not sure how to judge whether a context-engineered response is better, ask Claude Chat before starting:
>
> "I'm about to compare naive vs. context-engineered AI outputs for security incident analysis. What does a high-quality structured analysis include? What do experienced SOC analysts look for that juniors miss? What are the telltale signs of a superficial vs. deep analysis?"

> **💡 Tool Pattern:** Use **Chat** for the Phase 1 comparison and iteration work. Switch to **Code** for Phase 2 implementation. This is the Think → Build handoff.

**Setup:**
```bash
mkdir -p ~/agentforge/week02
cd ~/agentforge/week02
```

**Phase 1 (Claude Chat): Naive vs. Context-Engineered Prompt Comparison**

Start in Claude Chat — this is a thinking and iteration exercise before building.

**Naive prompt:**
```
Analyze this security alert: A user downloaded 47 files from the data warehouse at 2:34 AM from Singapore.
Is this suspicious?
```

**Context-engineered prompt:**
```
You are a senior SOC analyst at Meridian Financial. Your role is to assess whether security alerts
represent genuine threats, insider threats, or false positives.

CONSTRAINTS:
- Base all conclusions on observable evidence only
- Use confidence levels: 0-100% for each hypothesis
- State one assumption that, if wrong, would change your conclusion
- Format output as JSON with: {threat_level, confidence, primary_hypothesis, alternative_hypothesis, next_investigation_step, assumptions}

INCIDENT DATA:
User: John Chen (VP Operations) | jchen@meridian.local
IP: 203.45.12.89 (Singapore proxy) | Time: 2:34 AM EST
Action: Downloaded 47 CSV files, 2.3 GB (revenue data, client balances)
Auth: Valid credentials + successful MFA
Recent context: 3 failed logins this week, last office access Feb 28

Analyze this incident and provide structured assessment.
```

Document: How does the output quality differ? Which response would you trust more in a real incident?

**Phase 2 (Claude Code): Implement as Python System**

Once you've validated the prompt design in Chat, implement it as a Python system with the Claude SDK:

```python
import anthropic
import json
import csv
from datetime import datetime

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You are a senior SOC analyst at Meridian Financial.
Analyze security incidents with rigor and accuracy.

CONSTRAINTS:
- Base all conclusions on observable evidence only
- Use confidence levels 0-100% for each hypothesis
- State one assumption that would change your conclusion if wrong
- Always return valid JSON with the required structure

OUTPUT FORMAT:
{
  "threat_level": "critical|high|medium|low|false_positive",
  "confidence": 0-100,
  "primary_hypothesis": "string",
  "alternative_hypothesis": "string",
  "next_investigation_step": "string",
  "assumptions": ["string"],
  "audit_trail": {
    "analyst": "claude-sonnet",
    "timestamp": "ISO8601",
    "evidence_cited": ["string"]
  }
}"""

def analyze_incident_naive(incident_data: str) -> dict:
    """Naive approach: no system prompt, minimal context."""
    start = datetime.now()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": f"Analyze this security alert: {incident_data}"}]
    )
    duration = (datetime.now() - start).total_seconds()
    return {
        "response": response.content[0].text,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
        "duration_sec": duration,
        "approach": "naive"
    }

def analyze_incident_engineered(incident_data: str) -> dict:
    """Context-engineered approach: system prompt + structured output."""
    start = datetime.now()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": f"Analyze this incident:\n{incident_data}"}]
    )
    duration = (datetime.now() - start).total_seconds()
    return {
        "response": response.content[0].text,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
        "duration_sec": duration,
        "approach": "engineered"
    }

INCIDENT = """
User: jchen@meridian.local (John Chen, VP Operations)
Source IP: 203.45.12.89 (GeoIP: Singapore, proxy service)
Action: Downloaded 47 CSV files (2.3 GB) from data warehouse
Files: Revenue reports, client balances, transaction histories
Time: March 3, 2026, 2:34 AM EST (outside business hours)
Auth: Valid credentials + successful MFA
Context: 3 failed logins this week; last office access Feb 28
"""

# Run comparison
naive_result = analyze_incident_naive(INCIDENT)
engineered_result = analyze_incident_engineered(INCIDENT)

# SDK Cost Tracking
SONNET_INPUT_PRICE = 3.0 / 1_000_000  # $3 per MTok
SONNET_OUTPUT_PRICE = 15.0 / 1_000_000  # $15 per MTok

def calculate_cost(result):
    return (result["input_tokens"] * SONNET_INPUT_PRICE +
            result["output_tokens"] * SONNET_OUTPUT_PRICE)

# Save costs to CSV
with open("metrics/week02-costs.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["approach", "input_tokens", "output_tokens", "cost_usd", "duration_sec"])
    writer.writerow([
        "naive", naive_result["input_tokens"], naive_result["output_tokens"],
        f"{calculate_cost(naive_result):.6f}", naive_result["duration_sec"]
    ])
    writer.writerow([
        "engineered", engineered_result["input_tokens"], engineered_result["output_tokens"],
        f"{calculate_cost(engineered_result):.6f}", engineered_result["duration_sec"]
    ])

print(f"Naive cost: ${calculate_cost(naive_result):.6f}")
print(f"Engineered cost: ${calculate_cost(engineered_result):.6f}")
```

Create the metrics directory first:
```bash
mkdir -p ~/agentforge/metrics
```

**Phase 3: SDK Cost Tracking Exercise**

Run the script and compare:
1. How many more tokens did the naive approach use vs. engineered?
2. Was the naive approach actually cheaper? (Often it costs MORE because the output is verbose and unstructured)
3. Which output would you trust to make a real security decision?

**Save results to:** `~/agentforge/metrics/week02-costs.csv`

#### V&V Lens: Calibrated Trust in Practice

This lab naturally demonstrates Calibrated Trust. As you compare naive and context-engineered outputs, notice:

- Different prompt structures produce different answers to the same question. Which do you trust more? Why?
- The context-engineered output has confidence levels and evidence citations. Does this make it *actually* more trustworthy, or just *feel* more trustworthy?
- Notice which parts of the output are factual lookups (verifiable) vs. judgment calls (requiring scrutiny). Trust calibration means treating these differently.

**V&V Component:** After completing Phase 2, designate 5 minutes to apply Output Verification to the context-engineered response:
1. Pick the highest-confidence claim in the JSON output
2. Does the evidence cited in `evidence_cited` actually support that claim?
3. Is the confidence level internally consistent with the evidence quality?
4. Document: did verification change your assessment of the output?

> **💡 Tool Pattern for V&V:** Use **Chat** to iterate on prompt design (think). Use **Code** to implement and measure (build). Use **Chat** again to reflect on what the cost comparison tells you about good vs. poor prompting (retro).

---

## Deliverables

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.

1. **Comparison report** (500–750 words) — naive vs. context-engineered prompt: quality difference, cost difference, which you'd trust for a real incident decision
2. **`week02-costs.csv`** — actual token counts and costs for both approaches
3. **Python script** — your working implementation with comments explaining each design choice
4. **Governance reflection** — "What if someone feeds false context to your context-engineered system? The system prompt says 'base conclusions on evidence' — what happens if the 'evidence' is fabricated?"
5. **V&V documentation** — which claims did you verify, how, and did verification change your assessment?

> **📁 Save to:** `~/agentforge/analysis/week02/` (analysis outputs), `~/agentforge/metrics/` (cost CSV), `~/agentforge/deliverables/week02/` (final submission)

---

## AIUC-1 Integration

**Domain E (Accountability):** First formal introduction.

Your structured JSON output this week is not just a convenience — it *is* your audit trail. The `audit_trail` field in the output schema captures analyst identity, timestamp, and evidence cited. This is AIUC-1 E in practice:

- **E001 — Decision logging:** Every API call produces a structured record
- **E002 — Evidence citation:** The `evidence_cited` field documents what was used to reach the conclusion
- **E003 — Accountability chain:** The `analyst` field (even when it's "claude-sonnet") establishes who made the call

> **Governance Moment:** "Your structured output IS an audit trail. If you can't explain why the model reached a conclusion, you can't defend the decision to a regulator."

## V&V Lens

**Output Verification:** This week introduces verifying the context-engineered output. Steps:
1. Check that the JSON is valid (parse it)
2. Check that confidence levels are internally consistent (high confidence + high threat + "no next step needed" is a red flag)
3. Check that evidence cited actually appears in the incident data

The V&V discipline this week: "Can I reconstruct the reasoning from the evidence cited?"
