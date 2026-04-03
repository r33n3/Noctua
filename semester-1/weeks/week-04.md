# Week 4: From Prompt Engineering to Context Engineering

**Semester 1 | Week 4 of 16**

## Opening Hook

> Most developers think "prompting" means writing clever instructions. It doesn't — it means engineering the context that shapes what a model can reason about. By the end of this week, you'll be able to look at any LLM interaction and immediately diagnose why it's working or failing. This skill underpins everything you'll build for the rest of the year.

## Learning Objectives

- Understand the evolution from naive prompting to sophisticated context engineering
- Master context window design: what to include, what to exclude, how to format
- Learn system prompts, tool definitions, and memory architectures
- Understand structured outputs (JSON schemas) for deterministic results
- Master Retrieval-Augmented Generation (RAG) for integrating domain-specific knowledge
- Apply context engineering to build reliable security analysis systems

---

## Day 1 — Theory

### From Prompt Engineering to Context Engineering

For the past decade, the default way to use an AI system was: user writes a prompt, system responds, user reads response, end of story. This was fine when the system was ChatGPT and the goal was casual question-answering.

But in 2024–2026, the nature of AI use changed. Organizations began building *systems* on top of AI — not just asking questions, but automating decision-making, integrating with production infrastructure, and relying on outputs for critical judgments. Suddenly, "write a good prompt" became insufficient. You needed to engineer the entire *context* in which the model operates.

**What Changed**

In 2023, prompt engineering meant: "How do I phrase my question so ChatGPT gives a good answer?"

Examples of prompt engineering advice from that era:
- "Add 'Let's think step by step' to the end of your prompt to improve reasoning"
- "Use role-play: 'You are an expert security analyst...'"
- "Include examples in your prompt (few-shot learning)"

These were helpful micro-optimizations. But they assumed a single turn: one prompt, one response.

In 2025–2026, context engineering means: "How do I design the entire information environment in which the model operates to produce reliable, integrated, auditable outputs?"

This includes:
1. **System prompts** that define role and constraints
2. **Tool definitions** that declare what the model can invoke
3. **Memory architectures** that let the model maintain state across turns
4. **Structured output schemas** that force deterministic, machine-readable results
5. **Retrieval-augmented generation** that injects fresh, domain-specific knowledge
6. **Monitoring and feedback loops** that detect when the model is wrong and flag it

---

### Component 1: System Prompts

A system prompt is a set of instructions that shapes how the model behaves, separate from the user's question.

Example system prompt for a security analyst agent:

```
You are an expert Security Operations Center (SOC) lead with 15 years of experience in threat
hunting, incident response, and forensics. Your goal is to analyze security incidents with rigor
and accuracy.

**Constraints:**
1. Base all conclusions on observable evidence. Do not speculate beyond what the data supports.
2. When you are uncertain, say so explicitly. Use probability language:
   "I am 70% confident that..." NOT "This is definitely..."
3. Always consider alternative hypotheses. For each conclusion, state one way you could be wrong.
4. Flag assumptions clearly: "I'm assuming X; if that's false, my analysis changes."
5. Recommend further investigation before escalating to incident status.

**Output format:**
Always structure your analysis as JSON with fields: threat_level, evidence_summary,
alternative_hypotheses, recommended_actions, confidence_score, assumptions_flagged.

**Do not:**
- Blame individuals without evidence
- Recommend actions outside your authority (e.g., "fire this employee")
- Provide legal advice
- Assume intent (e.g., "the attacker wanted to...")
```

This system prompt accomplishes several things:
1. **Sets role and expertise:** The model understands its responsibilities
2. **Defines constraints:** It knows when to be cautious
3. **Specifies output format:** You get consistent, machine-readable results
4. **Establishes guardrails:** It won't make unauthorized recommendations

Without a good system prompt, the model operates in a vacuum. It doesn't know if you want verbose prose or terse bullet points. It doesn't know when to be cautious. It doesn't know your risk tolerance.

> **Key Concept:** A system prompt is how you embed organizational culture and risk tolerance into an AI system. It's also how you make the system auditable: if something goes wrong, you can point to the system prompt and ask "Did the model violate its own constraints?"

---

### Component 2: Tool Definitions

Context engineering includes declaring what tools the model can use. A tool is a function the model can invoke: query the SIEM, check email logs, look up threat intelligence, scan a system.

Tool definition example:

```json
{
  "name": "query_siem",
  "description": "Query the SIEM (Splunk) for events matching a filter",
  "parameters": {
    "type": "object",
    "properties": {
      "filter": {
        "type": "string",
        "description": "Splunk query filter (e.g., 'host=prod-db-01 AND action=login')"
      },
      "time_range": {
        "type": "string",
        "description": "Time range: '1h', '24h', '7d', etc."
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results to return (default 1000)"
      }
    }
  }
}
```

When you provide tool definitions, the model knows it can query the SIEM. It understands the parameters. Crucially, it won't hallucinate data — it will actually call the SIEM and wait for results.

**Tool Description Quality — Before and After**

The model uses your description to decide *when* to call a tool and how to use it correctly. Vague descriptions produce unpredictable behavior:

| | Vague (problematic) | Precise (effective) |
|---|---|---|
| `description` | `"Gets log data"` | `"Query Splunk SIEM for events in the specified time window. Returns up to max_results JSON objects. Use for authentication events, network flows, and process execution logs. Do NOT use for threat intelligence lookups — use query_ti instead."` |
| Result | Model calls it for everything, or misses it when needed | Model calls it precisely when appropriate, avoids tool confusion |

Descriptions are instructions to the model. Include: what it does, when to use it, when *not* to use it, and what it returns.

**API Patterns: `tool_choice` and `is_error`**

Two API-level controls that affect how agents behave at runtime:

**`tool_choice`** — override whether the model can skip tool calling:

```python
response = client.messages.create(
    model="claude-opus-4-6",
    tools=[log_tool, siem_tool],
    # Options: {"type": "auto"} (default), {"type": "any"}, {"type": "tool", "name": "query_siem"}
    tool_choice={"type": "tool", "name": "query_siem"},  # Force this tool
    messages=[{"role": "user", "content": "Investigate this subnet."}]
)
```

Use `{"type": "any"}` to require *some* tool call; `{"type": "tool", "name": "..."}` to force a specific one. Useful in audit pipelines where every decision must be logged before responding.

**`is_error: true`** — signal failed tool calls without breaking the loop:

```python
# In your tool execution handler:
if query_failed:
    # Signal the error — model stays in loop and can reason about it
    tool_result = {
        "type": "tool_result",
        "tool_use_id": tool_use_id,
        "is_error": True,
        "content": "SIEM query failed: connection timeout after 30s on host prod-splunk-01"
    }
else:
    tool_result = {"type": "tool_result", "tool_use_id": tool_use_id, "content": results}
```

If you raise a Python exception instead of returning `is_error: true`, the model exits the agentic loop and you lose the chance for graceful recovery. With `is_error`, the model can decide to retry, fall back to a different tool, or surface the error to the operator.

> **PostToolUse Hooks for Data Minimization**
>
> Every tool result enters your agent's conversation history — including verbose API responses with 40+ fields the agent will never need. Over a multi-turn session, this accumulates silently into a data governance liability.
>
> **PostToolUse hook pattern:** The hook fires immediately after a tool call completes, before the result enters context. Use it to strip fields the agent doesn't need for reasoning, redact sensitive values in-place (e.g., `SSN → ***-**-1234`), and normalize inconsistent field names across tool sources.
>
> Why hooks beat prompts here: "don't include sensitive fields" in a system prompt has a non-zero failure rate that is unacceptable for compliance. A PostToolUse hook that strips fields before they reach the model is deterministic — it cannot be reasoned around. This is the same principle as `permissions.deny` vs. asking nicely.
>
> **Reference:** [Claude Code Hooks documentation](https://docs.anthropic.com/en/docs/claude-code/hooks) — PostToolUse lifecycle, exit codes, and block patterns.

---

### Component 3: Memory Architectures

An agent that operates for hours might need to remember earlier findings. Memory architectures are how you implement that.

Types of memory:
1. **Conversation memory:** Context from earlier messages in the same thread (limited by context window size)
2. **Persistent memory:** External store (database, file) of facts learned from previous incidents
3. **Episodic memory:** Recording of this specific incident's investigation steps for later review

Example: An agent investigating a data breach might:
1. Start with the alert (memory: "potential exfiltration from prod-db-01")
2. Query SIEM; learn new fact (memory: "also unusual S3 access from same account")
3. Connect to previous incidents (memory: "Similar pattern to March 2024 breach by APT-X")
4. Retrieve threat intel (memory: "APT-X indicators: these IP ranges, these tools, these TTPs")
5. Generate assessment (memory: "Confidence in APT-X attribution: 75%, based on...")

Each step builds on the previous. The model doesn't forget. At the end, it can review its reasoning and cite its own earlier conclusions.

Implementing this requires:
- A vector database (Pinecone, Weaviate) or traditional database (PostgreSQL)
- Structured logging of the agent's reasoning
- A retrieval mechanism to fetch relevant past incidents
- A summary mechanism to compress long conversation histories

---

### Component 4: Structured Outputs

In early AI use, "reliability" meant "the model usually gives reasonable answers." In 2026, it means "the model's output integrates seamlessly with systems downstream."

Structured outputs force the model to return data in a format you can parse and act on programmatically.

Example — instead of asking an agent "Analyze this incident," you ask it to return:

```json
{
  "incident_id": "MF-2026-0342",
  "threat_level": "CRITICAL",
  "threat_level_confidence": 0.87,
  "attack_vector": "lateral_movement",
  "affected_assets": ["prod-db-01", "customer-configs-s3-bucket"],
  "recommended_actions": [
    {
      "action": "isolate_instance",
      "target": "prod-db-01",
      "urgency": "immediate",
      "rationale": "Prevent further exfiltration"
    },
    {
      "action": "audit_iam_role_usage",
      "target": "prod-db-01-role",
      "urgency": "high",
      "rationale": "Determine if role was compromised or abused"
    }
  ],
  "evidence_summary": "Observable indicators include unauthorized S3 access, RDS queries on sensitive tables, and directory enumeration. No evidence of OS-level persistence.",
  "alternative_hypotheses": [
    "Compromised IAM credentials (vs. OS compromise)",
    "Buggy application code (vs. malicious exfiltration)"
  ],
  "assumptions": [
    "Logs are trustworthy and unaltered",
    "IAM role is isolated to this instance",
    "No insider involvement"
  ]
}
```

Now your response is:
- **Machine-readable:** You can parse it in code
- **Deterministic:** The schema enforces structure
- **Auditable:** Every field is documented
- **Composable:** You can feed this into downstream systems (ticketing, SOAR playbooks, etc.)

> **Discussion Prompt:** Think about your current security tools (SIEM, EDR, ticketing system). What structured output format would let Claude best integrate with them? What fields are essential? What's optional?

---

### Component 5: Retrieval-Augmented Generation (RAG)

Training data has a cutoff date. Claude's knowledge was current as of early 2026. For security work, you often need:
- Today's threat intelligence (APT-XYZ detected new malware 2 hours ago)
- Your organization's policies (approval matrix for emergency access)
- Industry-specific knowledge (financial sector regulations, healthcare incident response standards)

RAG is the solution. You retrieve relevant documents from your knowledge base, inject them into the prompt, and let the model incorporate them.

RAG workflow:
1. **User submits a question:** "Is the IP 203.45.12.89 in any known threat intel feeds?"
2. **System retrieves relevant documents:** Query vector database for IPs, APT profiles, threat feeds
3. **System injects them into context:** "Here is the latest threat intelligence available to our organization: [docs]"
4. **Model responds:** Incorporates the retrieved knowledge

A concrete security example:

```
User: "Analyze if 203.45.12.89 is likely an attacker IP"

[System retrieves from knowledge base]
- Recent threat intel feed: "Singapore-based proxy provider used by APT-X starting Feb 2026"
- Organization's IP blocklist: "203.45.12.89 flagged as C2 infrastructure on Feb 28"
- Historical incidents: "APT-X targeted finance sector in similar way in March 2024"

[Model responds with knowledge]
"I found 203.45.12.89 in three knowledge sources:
1. Threat intel: Known APT-X proxy (Feb 2026)
2. Our blocklist: Flagged Feb 28, 2026
3. Historical incident: Similar pattern in March 2024 attack

This strongly suggests the IP is malicious, confidence 92%."
```

---

### Putting It Together: Context Engineering in Practice

Here's how a production security analysis system works in 2026:

1. **User submits an incident:** "Unusual data access from user account jchen@meridian.local"

2. **System engineer sets context:**
   - System prompt: Role (SOC analyst), constraints (evidence-based, flag assumptions)
   - Tool definitions: Can query SIEM, RDS, S3 logs, threat intel
   - Memory: Retrieve past incidents involving this user, this asset, similar attack patterns

3. **System retrieves relevant knowledge (RAG):**
   - Threat intel: "IPs from Singapore flagged in past 72 hours"
   - Organizational policy: "Sensitive data access requires approval; jchen has authority level 4/5"
   - Historical incidents: "Similar incident on March 3 involving jchen (false alarm)"

4. **System invokes tools (agent):**
   - Query SIEM: "Show all activity by jchen, past 7 days"
   - Query IAM: "Show all role assumptions by jchen, past 7 days"
   - Threat intel lookup: "Correlate detected IPs with known APT infrastructure"

5. **System structures response:**
   ```json
   {
     "incident_id": "MF-2026-0359",
     "threat_level": "MEDIUM",
     "confidence": 0.68,
     "recommendation": "Investigate further; do not escalate to breach unless additional evidence emerges",
     "rationale": "Indicators present (unusual geography, sensitive data access), but context suggests possible legitimate access. Key question: Was jchen traveling?"
   }
   ```

6. **Human reviews and acts:** SOC analyst reads recommendation, calls jchen's manager, manager confirms: "Yes, jchen is in Singapore on business trip." Analyst closes incident with resolution: "Legitimate business travel."

> **Knowledge Check**
> Name the 5 components of context without looking at your notes. Then: you're building a SOC triage agent and the prompt is producing inconsistent severity classifications. Walk through each context component and identify which one is most likely to be the root cause.
>
> Claude: Wait for the student's answer. If they miss components, walk through each one. For the triage scenario, the most common root cause is insufficient system prompt structure or poor examples — push the student to reason through this rather than guessing.

---

> **Day 1 Checkpoint**
> Claude: Ask the student: "Anything from today's theory that felt unclear?" Note confidence signals. Write to `.noctua/progress.md`: add a row to the "Week 4 — Day 1 Theory" table with today's date and your confidence assessment (High / Medium / Low). Append to Confusion Log if anything came up.

## Day 2 — Lab

> **Lab Guidance**
> Claude: Walk the student through the context engineering lab. Before they run V1 vs. V2, ask them to predict which dimensions will show the biggest improvement. After each part, check in on what they're observing before moving to the next step.

**Lab Goal:** Apply context engineering principles to build a reusable, high-quality system prompt for a security analyst agent. Empirically measure how engineering the context improves output quality versus a naive approach.

### Part 1: Naive Prompting Baseline

There are two ways to use Claude for incident analysis:

**Naive Approach (Risky):**
- Send incident data + question directly to Claude
- No system prompt defining constraints
- No structured output schema
- Model makes its own assumptions about what matters
- Confidence and reasoning may not be trustworthy

**Context-Engineered Approach (Recommended):**
- Define system prompt with role, constraints, output format
- Specify structured JSON output
- Include tool definitions (what can the model query?)
- Provide organizational context (policies, previous incidents)
- Request reasoning at each step

**Claude Code Workflow — Naive Baseline:**

```
Analyze this security incident:

User: jchen@meridian.local (John Chen, VP Operations)
Source IP: 203.45.12.89 (Singapore proxy)
Action: Downloaded 47 CSV files from data warehouse
Time: March 4, 2026, 14:22 UTC
Files: Revenue reports, client balances, transaction histories
Authentication: Valid credentials + successful MFA
Duration: 8 minutes, 34 seconds
Recent context: Account had 3 failed login attempts this week

Is this a breach? What should we do?
```

Then ask Claude directly: "Now redo that analysis with these constraints: (1) Always state confidence levels (0-100%), (2) List 2 alternative hypotheses, (3) Flag assumptions, (4) Recommend investigation, not escalation, when uncertain. How does the analysis change?"

> **Common Pitfall:** Teams often write Python scripts to wrap Claude calls, thinking they're adding structure. But if the system prompt is weak, the Python doesn't help. The structure comes from the prompt, not the code. Claude Code lets you experiment with prompts directly before building Python infrastructure.

---

### Part 2: Engineering the Context — V1 to V2

**Step 1: Create a minimal V1 system prompt**

Create `v1-system-prompt.md`:
```
You are a security analyst. Analyze security incidents and provide recommendations.
```

Test this against the Meridian Financial incident above:

```bash
mkdir -p ~/noctua-labs/unit1/week4
# Test in Claude Code:
claude
# Then: "Using system prompt: [v1 text]. Now analyze: [incident data]"
```

Document V1 output quality (rate each 1-5):
- Does V1 use CCT structure?
- Does it separate observations from inferences?
- Does it ask clarifying questions?
- Does it flag ethical considerations?
- Does it produce structured output?

**Step 2: Build V2 — Full Context Engineering**

Create `v2-system-prompt.md`:

```
## Role
You are a senior security analyst and incident responder with 10+ years of experience.
You specialize in threat hunting, digital forensics, and AI-augmented security operations.

## Operating Principles
- ALWAYS separate observations (Layer 1) from inferences (Layer 2)
  from hypotheses (Layer 3) from conclusions (Layer 4)
- NEVER attribute malicious intent without supporting evidence
- ALWAYS list what information is missing before concluding
- ALWAYS provide alternative innocent explanations
- ALWAYS address ethical implications of your recommendations

## Required Output Format
{
  "observations": [],
  "inferences": [],
  "top_3_hypotheses": [{"narrative": "", "probability": 0, "supporting_evidence": []}],
  "missing_information": [],
  "next_steps": [],
  "ethical_considerations": "",
  "recommendation": "",
  "confidence": 0
}

## Escalation Criteria
Escalate to incident commander if: evidence suggests active exfiltration in progress,
evidence of lateral movement, or data volume exceeds 1GB.
```

**Step 3: Test V2 against the same incident**

Apply V2 in Claude Code with the same Meridian Financial incident. Re-rate across the same dimensions (1-5). Calculate the V1 → V2 improvement delta.

**Step 4: Add tool definition stubs**

Add an "Available Tools" section to V2:

```
## Available Tools
- query_siem(time_range, account) — search SIEM logs
- lookup_ip(ip_address) — check threat intelligence feeds
- get_user_profile(username) — retrieve user role and history
- query_dlp_logs(account, date_range) — review data loss prevention logs
```

Retest — does Claude now reference these tools in its recommendations?

**Step 5: Save your context-engineered template**

Save `security-analyst-context-v2.md` as your reusable template. This becomes the foundation for your MCP server system prompt in Unit 2.

Compare naive vs. engineered outputs:

| Aspect | Naive | Context-Engineered |
|---|---|---|
| Format | Prose | Structured JSON |
| Confidence | Not explicit | Numerical + reasoning |
| Alternative hypotheses | Maybe mentioned | Explicitly listed |
| Assumptions | Implicit | Explicit list |
| Actionability | Narrative | Parseable for automation |

---

### Part 3: Implement a Simple RAG Pipeline

Create `rag-pipeline.py`:

```python
#!/usr/bin/env python3
"""
Simple RAG: Retrieve threat intel and org knowledge, inject into context.
"""

import json
from anthropic import Anthropic

client = Anthropic()

# Simulate a knowledge base (in production, this would be a vector database)
knowledge_base = {
    "threat_intel": [
        {
            "id": "TI-2026-001",
            "date": "2026-03-02",
            "content": "APT-X actively targeting financial services. Known indicators: RDP compromise leads to lateral movement. Primary goal: customer data exfiltration.",
            "relevance_keywords": ["APT-X", "financial", "exfiltration"]
        },
        {
            "id": "TI-2026-002",
            "date": "2026-02-28",
            "content": "Singapore proxies: 203.45.x.x range commonly used by legitimate business travelers. No malicious activity associated.",
            "relevance_keywords": ["Singapore", "proxy", "203.45"]
        }
    ],
    "org_policy": [
        {
            "id": "POL-001",
            "name": "Data Access Control",
            "content": "VPs are authorized to access customer data for financial reporting. Access must be logged and audited.",
            "relevance_keywords": ["VP", "data access", "authorization"]
        }
    ],
    "incident_history": [
        {
            "id": "INC-2026-005",
            "date": "2026-02-14",
            "content": "John Chen accessed data warehouse from London hotel. Confirmed legitimate — business trip verified with travel calendar.",
            "relevance_keywords": ["John Chen", "jchen", "London", "hotel", "false alarm"]
        }
    ]
}

def retrieve(query: str, top_k: int = 3) -> list:
    """
    Keyword-based retrieval (production would use vector similarity).
    Returns top_k documents most relevant to the query.
    """
    query_lower = query.lower()
    scored = []
    for category, docs in knowledge_base.items():
        for doc in docs:
            score = sum(
                1 for kw in doc["relevance_keywords"]
                if kw.lower() in query_lower
            )
            if score > 0:
                scored.append({"category": category, "doc": doc, "score": score})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]

def build_rag_context(query: str) -> str:
    """Retrieve relevant documents and format them as injected context."""
    retrieved = retrieve(query)
    if not retrieved:
        return "No relevant documents found in knowledge base."

    context_parts = []
    for item in retrieved:
        doc = item["doc"]
        category = item["category"].replace("_", " ").title()
        context_parts.append(
            f"[{category} | {doc['id']} | {doc['date']}]\n{doc['content']}"
        )
    return "\n\n".join(context_parts)

def analyze_incident(incident_description: str) -> str:
    """Analyze an incident using RAG-enriched context."""
    rag_context = build_rag_context(incident_description)

    system_prompt = f"""You are a senior SOC analyst at Meridian Financial.

RETRIEVED KNOWLEDGE BASE CONTEXT:
{rag_context}

Use the context above when relevant to your analysis. If you cite a document,
reference its ID. State confidence levels (0-100%). Flag assumptions explicitly."""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": incident_description}]
    )
    return response.content[0].text

if __name__ == "__main__":
    incident = """
    User jchen@meridian.local (VP Operations) downloaded 47 CSV files from the
    data warehouse via IP 203.45.12.89 (Singapore proxy). A follow-up phishing
    email targeting the same user failed SPF/DKIM/DMARC. Is this a breach?
    """
    print("=== RAG-Enriched Incident Analysis ===\n")
    print(f"Incident:\n{incident.strip()}\n")
    print("[Retrieved context injected into system prompt automatically.]\n")
    result = analyze_incident(incident)
    print(result)
```

Run it:

```bash
python rag-pipeline.py
```

Notice that the model's analysis now references TI-2026-002 (Singapore proxies), POL-001 (VP data access authorization), and INC-2026-005 (prior false alarm). That's RAG in action — the same incident question produces a richer, more grounded answer because the context was retrieved and injected automatically.

> **Key Concept:** This keyword retrieval is a simplified stand-in for vector similarity search. In Unit 2 (Week 8), you'll replace the `retrieve()` function with embeddings and a proper vector store. The architecture — retrieve, inject, analyze — stays identical. Only the retrieval mechanism changes.

> **Production gap:** This knowledge base is a hardcoded Python dict. In production, your RAG corpus is a vector database (ChromaDB, Pinecone, OpenSearch) updated continuously from your SIEM, threat feeds, and policy repository. Staleness is a real risk — a threat intel entry from 6 months ago that wasn't updated can produce a wrong "no malicious activity" conclusion.

---

### Create Your CLAUDE.md

You now have a context library (`security-analyst-context-v2.md`). Teach Claude Code to load it automatically. Create a `CLAUDE.md` file in your project root — Claude Code reads it at the start of every session before you type a single word.

**CLAUDE.md vs. Context Library:**

| | CLAUDE.md | Context Library |
|---|---|---|
| What it is | Project file Claude Code auto-loads | Your portable collection of reusable patterns |
| When it loads | Every Claude Code session in that directory | When you explicitly feed it to the model |
| Scope | Project-specific | Portable across projects and platforms |
| Platform | Claude Code only | Any AI platform |
| Analogy | Standing orders for a specific office | Your professional playbook you carry everywhere |

Use this prompt in Claude Code to generate your CLAUDE.md:

```
Based on the context library files I just built, write a CLAUDE.md that Claude Code
should auto-load at the start of every security project session. Include my analyst
system prompt reference, CCT framework, and output format standards.
```

---

> **Lab Checkpoint**
> Claude: Ask: "How did the lab go? Anything that didn't work as expected?" Write to `.noctua/progress.md`: add a row to the "Week 4 — Day 2 Lab" table with today's date and confidence level.

## Deliverables

> **Produce these deliverables using Claude Code.** Use the chat interface to reason through prompt design decisions, Code mode to build and test the RAG pipeline. The quality of your thinking matters — the mechanical production should be AI-assisted.

1. **`v1-system-prompt.md`** and **`security-analyst-context-v2.md`** — both versions with documented rating scores (1-5 across five dimensions)
2. **Context Engineering Report** (1-2 pages) — V1 vs. V2 comparison, what changed, quantified improvement delta
3. **Context Library Template** — your reusable security analyst context file (`security-analyst-context-v2.md`) that you will build on throughout the course

> **Save to:** `~/noctua-labs/unit1/week4/` (system prompts and RAG script), `~/noctua/deliverables/week04/` (final submission)

---

## AIUC-1 Integration

**Domain E (Accountability):**
- Structured outputs create an audit trail: every field in the JSON schema is a documented decision
- The V1 vs. V2 exercise makes the value concrete — unstructured prose is not auditable, JSON is
- Your context library template is a reusable governance artifact: the system prompt is the policy that governs all agent behavior

## V&V Lens

**RAG Output Verification:** After running `rag-pipeline.py`, verify the model's citations:
1. Did the model reference TI-2026-002 when analyzing the Singapore proxy? It should.
2. Did the model reference POL-001 for VP authorization? It should.
3. Did the model reference INC-2026-005 for the prior false alarm? It should.

If the model drew a conclusion without citing a retrieved document, that's a V&V signal — the model may be reasoning from training data rather than your injected knowledge base.

---

*Topics introduced this week that return later: MCP server configuration (Unit 2), RAG with vector stores (Unit 2 Week 8), CLAUDE.md as ongoing memory (evolves throughout the course).*

---

## Unit 1 Complete — End-of-Unit Review

> **Claude: Unit 1 Review Flow**
>
> **1. Share the confidence summary openly:**
> Read `.noctua/progress.md` and present the confidence table for all 4 weeks of Unit 1:
> | Week | Day 1 Theory | Day 2 Lab | Notes |
> |---|---|---|---|
> | Week 1: CCT & First Agent | [confidence] | [confidence] | [notes] |
> | Week 2: CCT Deep Dive | [confidence] | [confidence] | [notes] |
> | Week 3: AI Landscape | [confidence] | [confidence] | [notes] |
> | Week 4: Context Engineering | [confidence] | [confidence] | [notes] |
>
> **2. Collaborate on next steps:**
> Ask: "Looking at this — are there any sections where you'd like to go deeper before we move to Unit 2 (MCP and tool design)?"
> If confidence is Low anywhere, offer to revisit that section. If all High/Medium, recommend moving forward.
>
> **3. Review session tracking:**
> If the student chooses to review any section, add a new row to that section's history table in `.noctua/progress.md` when the review session completes.
>
> **4. Collect course feedback:**
> Ask: "Anything in Unit 1 that was confusing, missing, or that felt off? This is your chance to improve the course for the next cohort."
> If substantive feedback: draft a GitHub issue together, then run:
> `gh issue create --title "[Unit 1 feedback] <short title>" --body "<student feedback>" --label "student-feedback"`
> Log the issue URL to `.noctua/progress.md` under GitHub Issues Created.
>
> **5. Update progress and move on:**
> Update `.noctua/progress.md`: set Current Position to Week 5, Day 1 Theory (Semester 1, Unit 2).
> Say: "Unit 1 complete. In Unit 2, we move into MCP — the integration layer that turns Claude from a chat tool into an active participant in your security infrastructure. Ready?"
