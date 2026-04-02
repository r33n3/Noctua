# Week 3: The Modern AI Landscape for Security Professionals

**Semester 1 | Week 3 of 16**

## Learning Objectives

- Understand transformer architecture at a conceptual level: attention, context windows, tokens
- Learn the taxonomy of AI models: closed, open, specialized; and how to choose the right one
- Master token economics: cost optimization, input vs. output pricing, context window tradeoffs
- Evaluate models for security work: accuracy, reasoning depth, latency, privacy, cost
- Build a mental model of the AI landscape in 2026 and how it's evolving

---

## Day 1 — Theory

To use AI effectively as a security professional, you need a mental model of how these systems work and what their tradeoffs are. This isn't about becoming a machine learning engineer. It's about understanding enough to make informed choices: When do I use Claude Opus vs. Sonnet? When should I deploy an open model? What does it mean that a model has a 1M token context window?

### Foundation: The Transformer Architecture

All modern large language models — Claude, GPT, Llama, Mistral — are built on the same underlying architecture: the transformer. Understanding it at a high level is essential.

The core innovation of transformers (introduced by Vaswani et al. in 2017) is "attention." Imagine reading a long security incident report. Your attention isn't equally distributed. When you see "ransomware," your mind attends to nearby words like "encryption," "payment," "victim," "recovery."

Transformers do something similar. Every token (roughly, a word or subword) in the input attends to every other token, and the model learns which connections matter. This all-to-all structure is why transformers capture long-range dependencies — something older architectures (RNNs, LSTMs) struggled with.

The practical consequence: transformers are *context-aware*. They understand that "password" in a security context means something different than in a UI context. But they can only attend to tokens within their context window.

> **🔑 Key Concept:** A model's context window is its attention span. Claude Opus 4.6 now supports 1M tokens. Gemini 2.5 supports 1M+. Longer windows cost more but allow you to include more evidence — for security analysis, a larger context window means loading the full incident report rather than summarizing it.

### Context Windows and Their Implications

A token is roughly 4 characters (0.75 words) on average. A 200K token context window is ~500 pages. Claude Opus 4.6's 1M token window is ~750K words — enough to load a full year of SIEM logs into a single session.

Two security analysis scenarios:

1. **Small context:** "We got a phishing email from john@gmail.com claiming to be HR, asking for password reset." The model analyzes it.

2. **Large context:** You include the full email (headers, body, HTML), previous emails from this attacker, threat intelligence reports, your organization's email policies, and response examples. The model has much richer context for analysis.

The second scenario produces better results but costs more:
- Input tokens cost less (~$0.003 per 1K tokens)
- Output tokens cost more (~$0.006 per 1K tokens)
- Longer contexts = more input tokens = higher cost

> **Context budget is intentional allocation, not an afterthought.** Before you inject a file, a log, or a prompt template, ask: does this earn its place? What does the model actually need to reason correctly? The discipline of context budgeting separates engineers who get consistent results from those who wonder why quality varies.

> **Context window ≠ memory.** What's in the context window is transient. A 1M token context window gives you 1M tokens of *attention* within a single session — not 1M tokens of persistent memory. Designing an agent that "remembers" previous incidents requires building a retrieval layer, not just a bigger context. You'll build this in Week 8.

### The Landscape of Models in 2026

The market has stratified into three tiers.

> **Note on pricing:** Model names and pricing change frequently. The versions and figures below reflect early 2026. Check [anthropic.com/pricing](https://www.anthropic.com/pricing) for current rates. The relative tiers (Opus > Sonnet > Haiku in capability and cost) remain stable.

**Tier 1: Frontier Closed Models**

| Model | Provider | Context | Approx. Input Price | Best For |
|-------|----------|---------|-------------------|---------|
| Claude Opus 4.6 | Anthropic | 1M tokens | ~$15/1M tokens | Complex analysis, deep forensics, rare high-stakes tasks |
| Claude Sonnet 4.6 | Anthropic | 200K tokens | ~$3/1M tokens | Operational workflow, everyday reasoning |
| Claude Haiku 4.5 | Anthropic | 200K tokens | ~$1/1M tokens | Triage, classification, high-throughput tasks |
| GPT-4o / GPT-4.5 | OpenAI | 128K tokens | Variable | Multimodal (text, image, audio), strong reasoning |
| GPT-5.x / o3 / o4-mini | OpenAI | Variable | Variable | Extended reasoning, complex tasks |
| Gemini 2.5 | Google | 1M+ tokens | Variable | Native multimodal, large-context analysis |

**Advantages:** highest quality, newest knowledge, broad capabilities, safety work  
**Disadvantages:** higher cost, less privacy control, vendor lock-in, closed training data

**Tier 2: Open-Source Models**

| Model | Provider | Context | Notes |
|-------|----------|---------|-------|
| Llama 3.1 | Meta | 128K tokens | Strong reasoning, efficient |
| Mistral 7B/8x7B | Mistral AI | 32K tokens | Lightweight, mixture of experts |
| Phi-3.5 | Microsoft | 128K tokens | Good for edge deployments |
| Deepseek-R1 | Deepseek | Variable | Strong reasoning, open weights |

**Advantages:** no vendor lock-in, on-premises deployment (full privacy), lower cost, fine-tunable  
**Disadvantages:** slightly lower quality on complex tasks, requires infrastructure, maintenance overhead

**Tier 3: Specialized Models**

- **Security-specific:** Some labs training on threat intel, IR, forensics (not widely available yet)
- **Code-focused:** Codestral, Code-Llama (good for security scripts, IaC, detection rules)
- **Vision-focused:** LLaVA, GPT-4o (for analyzing screenshots, network diagrams)

### Choosing a Model for Security Work

> **Model selection is an architectural decision.** The question is not "which model is best" — it's "which model is right for this task at this cost." A common production pattern: Haiku-class models handle high-volume triage (fast, cheap, good enough for classification). Sonnet-class models handle the top 5–10% of cases needing deeper analysis.

| Scenario | Best Model | Why |
|----------|-----------|-----|
| Live incident response (real-time chat) | Sonnet or Haiku | Fast inference. Analyst is waiting. Cheap enough for real-time. |
| Deep forensic analysis of complex incident | Opus | Best reasoning. Analyst willing to wait 20 seconds. |
| Automated threat intel correlation (batch) | Mistral on-premises | Cost-effective for high volume. Privacy. |
| Email phishing detection (high throughput) | Haiku | Lightweight, cheap. Filter obvious cases before escalating. |
| Vulnerability research (exploit code) | Code-Llama or GPT-4 | Code generation quality matters. |
| Customer-facing threat hunting chat | Sonnet or GPT-4o | Reliable, fast, professional. Review privacy policies. |

> **💡 Discussion Prompt:** Your organization needs to analyze 10,000 SIEM alerts per day. Budget is limited. Single frontier model (expensive but very accurate) or an ensemble of cheaper models (Haiku + Mistral)? What are the tradeoffs?

### Token Economics in Practice

Analyzing a complex incident with Claude Opus:
- Full incident report: 10K tokens
- SIEM logs: 15K tokens
- System prompt: 2K tokens
- Your question: 0.5K tokens

**Total input: 27.5K tokens**

At ~$15/1M input tokens: 27.5K × $0.000015 = **~$0.41 input cost**  
Response (2K tokens) at ~$75/1M output tokens: 2K × $0.000075 = **~$0.15**  
**Total: ~$0.56 per analysis**

At 100 incidents/day → ~$20K/year. Compare to a human analyst at $80K+/year. If Claude accelerates analysis by 5%, it's ROI-positive.

**The hidden cost of irrelevant context:** Including a full log file when only 5% applies can double your token spend. Context engineering — curating what to include — directly reduces cost.

> **Three things to understand before the lab:**
> 1. **Context and attention** — Every file in Claude's context window competes for attention. Large files don't disappear when not referenced; they still consume tokens and can dilute focus.
> 2. **Security data is token-expensive** — Raw logs, full CVE descriptions, and packet captures are verbose. Preprocessing (summarization, structured extraction) before passing to Claude improves quality and reduces cost.
> 3. **Context window limit ≠ chunking problem** — If your data exceeds the window, you need a chunking/retrieval strategy. If it fits but is too large to reason about effectively, you need a summarization strategy. These are different problems with different solutions.

### LLM vs. Agent — The Distinction That Matters for Failure Modes

An LLM generates text. An agent uses an LLM plus tools, memory, and planning to take actions in the world. The same Claude model powers both — the difference is architecture.

When you add a tool loop, you have an agent. When you add memory, you have a stateful agent.

This distinction matters when reasoning about failure modes: **an LLM that hallucinates produces bad text. An agent that hallucinates may take bad actions** — call the wrong API, delete the wrong record, escalate the wrong alert. The architecture determines the blast radius.

> **📚 Study With Claude:** Open Claude Code with the Noctua repo mounted and try:
> - "Quiz me on transformer architecture. Start easy, then get harder."
> - "I think I understand context windows but I'm not sure. Explain it differently and then test whether I really get it."
> - "What are the three most common mistakes when choosing a model tier for a security task?"
> - "Connect token economics to what we learned in Week 1 about the Engineering Assessment Stack."

---

## Day 2 — Lab

### Lab: Model Comparison on Phishing Analysis

**Lab Objectives:**
- Compare multiple models on the same security task
- Evaluate outputs for accuracy, reasoning quality, latency, and cost
- Build a model selection rubric for different security scenarios
- Apply CCT principles to model evaluation (challenge your biases)

**Setup:**
```bash
mkdir -p ~/noctua-labs/unit1/week3
cd ~/noctua-labs/unit1/week3
```

#### The Test Case: A Sophisticated Phishing Email

Create `phishing-sample.txt`:

```
From: sarah.johnson@meridian-financial.secure
To: john.chen@meridian.local
Date: March 5, 2026, 10:42 AM EST
Subject: Urgent: Action Required - Verify Your Account Identity

Return-Path: <bounce@meridian-financial.secure>
X-Originating-IP: [203.45.12.89]
X-Mailer: Mozilla/5.0

---

Dear John,

Thank you for banking with Meridian Financial. Due to recent security updates to our
systems, we require immediate verification of your account identity.

Please click the link below to re-authenticate and ensure uninterrupted access:

https://meridian-financial.secure/verify-identity/?token=u7f3x9kL2m&session=JC9834

For your security, we recommend completing this within the next 2 hours.

Best regards,
Meridian Financial Security Team
support@meridian-financial.secure

---

[Email Headers Analysis]
SPF: FAIL (does not match official Meridian record)
DKIM: FAIL (no valid DKIM signature)
DMARC: FAIL (policy reject; message did not pass authentication)
Reply-To: differs from From address
X-Originating-IP: 203.45.12.89 (Resolves to AS12345, Singapore-based proxy service)

[URL Analysis]
Domain: meridian-financial.secure
Domain registered: March 4, 2026 (1 day old)
Domain registrar: Namecheap
Similarity to official Meridian domain (meridian-financial.com): 99%
WHOIS: Private registration
Certificate: Self-signed, expires in 30 days

[Forensic Details]
Message size: 2.3 KB (small, minimal attachments)
Encoding: MIME, standard HTML
Suspicious attachments: None detected
Embedded links: 1 (the verify URL)
Click tracking pixel: Yes, from analytics.secure-auth.com (unrelated to official Meridian)

[Context]
- Meridian's official domain is meridian-financial.com (not .secure)
- Recent credential compromise of 3 VP accounts in past month
- This email targets John Chen (VP Operations), investigated in Week 1 lab
- John's inbox has received similar phishing before; he usually ignores them
- No legitimate "verify-identity" campaigns from Meridian in past 6 months
```

**Analysis Prompt** (same across all model tests):

```
You are a senior security analyst at Meridian Financial. Analyze the attached phishing email
and provide:

1. THREAT ASSESSMENT: Is this phishing? Confidence level (0-100%)?
2. INDICATORS: List the 5 most significant indicators of compromise
3. ATTACK VECTOR: What is the attacker trying to accomplish?
4. RECOMMENDED ACTIONS: What should the security team do in the next 30 minutes?
5. CCT EVALUATION: What evidence supports your conclusion? What would change it?

Format as structured JSON with confidence levels for each section.
```

---

#### Part 1: Run the Comparison (30 minutes)

**Test 1: Claude Code (repo mounted)**

Open Claude Code in your working directory, paste the phishing email content with the analysis prompt, and save the output to `outputs/claude-code-output.json`.

**Test 2: Claude API (Sonnet via SDK)**

```python
import anthropic, json, time

client = anthropic.Anthropic()

with open("phishing-sample.txt") as f:
    email_content = f.read()

prompt = f"""[PHISHING EMAIL]\n{email_content}\n\n[ANALYSIS REQUEST]\n{open('analysis-prompt.txt').read()}"""

start = time.time()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{"role": "user", "content": prompt}]
)
duration = time.time() - start

result = {
    "model": "claude-sonnet-4-6",
    "response": response.content[0].text,
    "input_tokens": response.usage.input_tokens,
    "output_tokens": response.usage.output_tokens,
    "duration_sec": round(duration, 2),
    "cost_usd": round(
        response.usage.input_tokens * 3/1_000_000 +
        response.usage.output_tokens * 15/1_000_000, 6
    )
}

with open("outputs/sonnet-output.json", "w") as f:
    json.dump(result, f, indent=2)

print(f"Cost: ${result['cost_usd']:.6f} | Duration: {result['duration_sec']}s")
```

**Test 3: Claude Code multi-model comparison (no additional API keys needed)**

In Claude Code, ask: *"Compare how Claude Haiku and Claude Sonnet would approach this phishing analysis differently, given their different capability tiers."* This gives you a comparative perspective without needing separate API credentials.

**Test 4: Mistral via Ollama (local, open-source) — Optional**

```bash
# If Ollama is installed:
ollama pull mistral
ollama run mistral "$(cat phishing-sample.txt) $(cat analysis-prompt.txt)" > outputs/mistral-output.txt
```

---

#### Part 2: Evaluate Using CCT Pillars (40 minutes)

For each model output, apply the five CCT pillars:

| CCT Pillar | Evaluation Question | Notes |
|-----------|-------------------|-------|
| Evidence-Based | Does the output separate observations from inferences? | Does it cite specific header data, not just "suspicious email"? |
| Inclusive Perspective | Does it consider alternative explanations? | Could this be a legitimate IT campaign? |
| Strategic Connections | Does it connect the Singapore IP to the Week 1 incident? | Context threading across cases |
| Adaptive Innovation | Does it state what evidence would change the conclusion? | Falsifiability |
| Ethical Governance | Does it recommend proportional action, not nuclear escalation? | Suspend vs. investigate vs. monitor |

> **V&V Checkpoint:** After scoring each output, pick the highest-confidence claim from the best-performing model. Verify it against the raw `phishing-sample.txt`. Does the claim accurately represent the evidence? Does the model's confidence level match the strength of the evidence?

---

#### Part 3: Build a Model Selection Rubric (30 minutes)

Create `model-selection-rubric.csv`:

```csv
scenario,recommended_model,reasoning,cost_tier,latency_requirement,privacy_concern
live_incident_triage,claude-haiku-4-5,Fast inference analyst waiting cheap enough for real-time,low,<2s,low
deep_forensic_analysis,claude-opus-4-6,Best reasoning analyst willing to wait complex judgment,high,<30s,medium
bulk_threat_intel_correlation,mistral-local,High volume cost-sensitive privacy-critical batch job,infrastructure,minutes,high
phishing_email_detection,claude-haiku-4-5,High throughput lightweight filter before escalating,low,<1s,medium
vulnerability_research,code-specialized,Domain-specific code generation quality matters,medium,<10s,low
customer_facing_chat,claude-sonnet-4-6,Reliable fast professional review data privacy policies,medium,<5s,high
```

Add 3 more rows based on your own security work scenarios.

Save your working outputs:
```
~/noctua-labs/unit1/week3/
├── phishing-sample.txt
├── analysis-prompt.txt
├── outputs/
│   ├── claude-code-output.json
│   ├── sonnet-output.json
│   └── mistral-output.txt (optional)
├── model-comparison-scores.md
└── model-selection-rubric.csv
```

---

## Deliverables

> **🛠️ Use Claude Code with the Noctua repo mounted.** Use `/think` to structure your analysis before drafting. Save final deliverables to Cowork for organization.

1. **Model Comparison Report** (1,500–2,000 words)
   - Analysis outputs from all models tested (attach or summarize)
   - CCT rubric scores with explanation of why each model scored where it did
   - Cost-benefit analysis: at 100 incidents/day, what is the annual cost of each approach?
   - Your recommendation: which model for which security scenario?

2. **Model Selection Rubric** (`model-selection-rubric.csv`) — at least 9 rows

3. **Token Economics Exercise** — for your recommended model choice, calculate:
   - Cost per incident analysis
   - Annual cost at 100 incidents/day
   - Break-even: at what volume does switching to open-source become justified?

4. **CCT Reflection** (500 words) — Did you confirm your initial model preference or were you surprised? Which CCT pillar was most useful for evaluating model outputs?

> **📁 Save to:** `~/noctua-labs/unit1/week3/` (lab files), `~/noctua/deliverables/week03/` (final submission)

---

## AIUC-1 Integration

**Not yet formally introduced.** Students encounter accountability through the cost tracking exercise — every API call produces a record with model, token count, cost, and duration. This is proto-AIUC-1 E001 (decision logging) applied to model selection. AIUC-1 Domains are introduced progressively starting Week 4.

## V&V Lens

**Calibrated Trust applied to model outputs:**

This week's lab demonstrates naturally: different models produce different answers to the same question. Which do you trust more? Why?

Notice which parts of each output are factual lookups (the SPF/DKIM failures are observable facts) vs. judgment calls (the attack vector assessment is the model's interpretation). Calibrated Trust means treating these differently:
- Factual claims from the email headers: verify against `phishing-sample.txt` directly
- Attacker intent assessment: low trust, treat as hypothesis requiring corroboration
- Recommended actions: near-zero autonomous trust, human decision required

**V&V Component:** After Part 1, designate 5 minutes to verify one claim from the highest-confidence output. Does the evidence in the phishing sample actually support it? Document whether verification changed your assessment of the output.
