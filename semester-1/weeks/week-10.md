# Week 10: Multi-Agent Security Systems II

**Semester 1 | Week 10 of 16**

## Learning Objectives

- Understand advanced orchestration patterns: debate, swarm, expert delegation
- Apply inter-agent trust boundaries and verification between agents
- Implement per-agent cost tracking via the Anthropic SDK
- Connect Week 7 empirical findings to Week 10 agent design limits
- Understand when NOT to use multi-agent (single agent with tools often wins)
- Apply AIUC-1 Domain B to agent-to-agent trust

---

## Day 1 — Theory

### Advanced Orchestration Patterns

**Debate Pattern:** Two or more agents analyze the same problem independently; a coordinator synthesizes disagreements.

Security application: threat attribution debate
- Agent A (attacker mindset): "These indicators point to APT-X — here's my evidence"
- Agent B (skeptic mindset): "Alternative interpretation: this could be APT-Y, or a false flag"
- Coordinator: "Both perspectives have merit. The distinguishing factor is X. My synthesis: 70% APT-X, 30% alternative."

When to use debate: high-stakes decisions where confirmation bias is dangerous. The debate pattern structurally prevents the coordinator from simply accepting the first hypothesis.

**Swarm Pattern (Expert Delegation):** Multiple specialized agents attack the same problem in parallel, each from their expertise angle. A coordinator synthesizes diverse findings.

Security application: comprehensive incident analysis
- Network agent: analyzes traffic patterns, anomalies, protocol behavior
- Behavioral agent: analyzes user/entity behavior, baseline deviations
- Code agent: analyzes any scripts, binaries, or commands found in the incident
- Intelligence agent: correlates against threat intelligence feeds

All four run in parallel. Coordinator synthesizes: "Network and behavioral agents both flag IP 203.45.12.89. Code agent found a script matching known GTG-1002 TTPs. Intelligence agent confirms this IP is in the GTG-1002 infrastructure list. High confidence attribution."

When to use swarm: complex incidents where multiple analytical perspectives are needed and speed matters. The swarm runs in parallel time; a single agent would take 4× longer and mix perspectives.

**Expert Delegation:** The orchestrator dynamically delegates to the most specialized agent for each sub-task, rather than routing everything through a fixed pipeline.

Security application: adaptive incident response
- Orchestrator receives: "Unusual database activity"
- Orchestrator delegates to Database Agent: "This is in your expertise"
- Database Agent responds: "This looks like SQL injection attempt"
- Orchestrator delegates to Threat Intel Agent: "Find SQLi campaigns matching this pattern"
- Continues adaptively based on findings

When to use expert delegation: when the analysis path isn't known in advance and depends on what's discovered.

### Agent Team Cost Optimization

From Week 7 Station 7 (Cost Cliffs) and Week 9 per-agent cost tracking:

**Model right-sizing per agent:**
```
Orchestrator (routing/state management): Haiku — $1/MTok
Recon Agent (extraction/lookup): Haiku — $1/MTok
Analysis Agent (correlation/reasoning): Sonnet — $3/MTok
Deep Analysis (complex attribution): Opus — $5/MTok, invoked rarely
Reporting Agent (format transformation): Haiku — $1/MTok
```

**Caching amortization:** If your recon agent processes 50 incidents per hour with the same 2K-token system prompt:
- Without caching: 50 × 2K input tokens = 100K tokens at $1/MTok = $0.10/hour
- With caching: 2K at full price + 49 × 2K at cache price (~10%) = ~$0.011/hour
- Savings: 89% on repeated system prompt context

**Per-agent cost tracking implementation:**

```python
import anthropic
from dataclasses import dataclass
from typing import Optional

@dataclass
class AgentCostRecord:
    agent_name: str
    model: str
    input_tokens: int
    output_tokens: int
    cache_read_tokens: int
    cache_write_tokens: int

    @property
    def cost_usd(self) -> float:
        # 2026 pricing
        pricing = {
            "claude-haiku-4-5":   {"input": 1.0, "output": 5.0, "cache_read": 0.1, "cache_write": 1.25},
            "claude-sonnet-4-6":  {"input": 3.0, "output": 15.0, "cache_read": 0.3, "cache_write": 3.75},
            "claude-opus-4-6":    {"input": 5.0, "output": 25.0, "cache_read": 0.5, "cache_write": 6.25},
        }
        p = pricing.get(self.model, pricing["claude-sonnet-4-6"])
        return (
            self.input_tokens * p["input"] / 1_000_000 +
            self.output_tokens * p["output"] / 1_000_000 +
            self.cache_read_tokens * p["cache_read"] / 1_000_000 +
            self.cache_write_tokens * p["cache_write"] / 1_000_000
        )

def invoke_agent_with_tracking(
    agent_name: str,
    model: str,
    system: str,
    user_message: str
) -> tuple[str, AgentCostRecord]:
    client = anthropic.Anthropic()
    response = client.messages.create(
        model=model,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": user_message}]
    )
    record = AgentCostRecord(
        agent_name=agent_name,
        model=model,
        input_tokens=response.usage.input_tokens,
        output_tokens=response.usage.output_tokens,
        cache_read_tokens=getattr(response.usage, 'cache_read_input_tokens', 0),
        cache_write_tokens=getattr(response.usage, 'cache_creation_input_tokens', 0)
    )
    return response.content[0].text, record
```

### When NOT to Use Multi-Agent

The key insight that gets lost in excitement about multi-agent systems: **a single agent with good tools often outperforms a multi-agent system** for many tasks.

Single agent wins when:
- The task is bounded and well-defined (recon → analysis → report in sequence, no parallel work)
- The tools are comprehensive (a single agent with CVE lookup + IP reputation + log query can do what 3 specialized agents do)
- Context stays within the effective range (the task doesn't generate enough conversation history to degrade quality)
- Coordination overhead would exceed parallelism benefit

**The 3-agent threshold:** For tasks that can be parallelized and take 3+ specialized perspectives, multi-agent starts winning. For tasks that are sequential and well-bounded, a well-tooled single agent is simpler, cheaper, and often better.

**Assessment Stack for orchestration pattern selection:**
- Is this task parallelizable? → Swarm/Debate might help
- Does this task require fundamentally different expertise at each stage? → Expert delegation
- Is this sequential with clear handoffs? → Pipeline
- Does this require hierarchical command structure? → Hierarchical
- Is this simple and bounded? → Single agent with tools

### Agent Scaling Limits (Empirical Connection to Week 7)

From Week 7 Station 2 (Agent Proliferation):
- 3-5 agents: optimal synthesis quality, manageable coordination
- 7+ agents: coordinator synthesis degrades, conflicts harder to reconcile
- 9+ agents: coordination overhead often exceeds parallelism benefit

Design for 3-5 agents. If you need more, consider hierarchical agent teams (coordinators for each sub-team, rather than one coordinator for all).

> ### Anti-Patterns Mapped to OWASP LLM Top 10
>
> The nine dark factory anti-patterns from the roadmap map directly to OWASP LLM categories. This gives you two vocabularies for the same problems — use whichever lands better with a given audience.
>
> | Anti-Pattern | OWASP LLM Category | Real-World Instance |
> |---|---|---|
> | **Credential Minefield** (API keys hardcoded, shared service accounts) | LLM09: Misinformation / Overreliance on insecure storage | OpenClaw: 1.5M API tokens leaked from poorly secured agent deployments |
> | **Shadow Agent Sprawl** (no inventory, unknown agents running) | LLM06: Excessive Agency | OpenClaw: 21,639 instances publicly exposed with no central visibility |
> | **Evaluation Blindness** (no accuracy or safety metrics) | LLM08: Vector and Embedding Weaknesses + LLM02: Sensitive Information Disclosure | OpenClaw: 341 of 2,857 community skills were malicious — no eval before publish |
> | **Governance Theater** (checkbox compliance, nothing ever blocked) | LLM07: System Prompt Leakage / Insecure Output Handling | Approval committees that never reject anything provide no real guardrails |
> | **Compliance Afterthought** (build first, regulate later) | LLM10: Unbounded Consumption | Agents deployed to all jurisdictions before regulatory review; pulled post-deployment |
> | **Vendor Lock-in Trap** (single model, no abstraction layer) | LLM05: Improper Output Handling | Model outage = full fleet downtime; no fallback when vendor has incident |
>
> **The OpenClaw Case:** OpenClaw simultaneously demonstrated Credential Minefield (1.5M tokens), Shadow Agent Sprawl (21,639 exposed), Evaluation Blindness (12% malicious skills), and Compliance Afterthought (RCE discovered post-deployment). One product, four anti-patterns active simultaneously — which is why agent security incidents tend to be severe rather than isolated.
>
> **Source:** https://www.reco.ai/blog/openclaw-the-ai-agent-security-crisis-unfolding-right-now

---

## Day 2 — Lab

### Extend the Week 9 SOC System

**Lab Objectives:**
- Add advanced orchestration to your Week 9 SOC system
- Implement inter-agent verification at handoff points
- Track per-agent costs using the SDK cost tracking implementation
- Run the Week 7 agent scaling experiment on your improved system

**Step 1: Add Debate Pattern to Analysis Stage**

Extend your Week 9 orchestrator to use a debate pattern for the analysis step:

```python
def invoke_analysis_debate(incident: str, recon_results: dict) -> dict:
    """Debate pattern: two agents debate attribution; coordinator synthesizes."""

    # Agent A: Threat attribution (attacker mindset)
    agent_a_response, cost_a = invoke_agent_with_tracking(
        "analysis-attacker",
        "claude-sonnet-4-6",
        system="""You are a threat analyst specializing in attribution.
Analyze the provided incident and IOCs for threat actor attribution.
Argue your strongest case for attribution, citing specific indicators.
Return JSON: {attributed_to, confidence, supporting_evidence, strongest_indicator}""",
        user_message=f"Incident:\n{incident}\nIOCs:\n{recon_results['output']}"
    )

    # Agent B: Skeptic (alternative interpretations)
    agent_b_response, cost_b = invoke_agent_with_tracking(
        "analysis-skeptic",
        "claude-sonnet-4-6",
        system="""You are a threat analyst specializing in alternative interpretations.
Given the same incident data, argue the strongest ALTERNATIVE explanation.
What could make the primary attribution wrong? What's being overlooked?
Return JSON: {alternative_hypothesis, confidence, evidence_against_primary, key_uncertainty}""",
        user_message=f"Incident:\n{incident}\nIOCs:\n{recon_results['output']}"
    )

    # Coordinator: Synthesize the debate
    synthesis, cost_synth = invoke_agent_with_tracking(
        "analysis-coordinator",
        "claude-sonnet-4-6",
        system="""You are an analysis coordinator.
Two analysts have provided competing interpretations of an incident.
Synthesize their perspectives into a calibrated assessment.
Return JSON: {final_assessment, confidence, key_distinguishing_factors, recommended_next_investigation}""",
        user_message=f"Analyst A: {agent_a_response}\n\nAnalyst B: {agent_b_response}"
    )

    return {
        "output": synthesis,
        "total_cost": cost_a.cost_usd + cost_b.cost_usd + cost_synth.cost_usd,
        "agent_costs": [cost_a, cost_b, cost_synth]
    }
```

**Step 2: Implement Inter-Agent Verification**

Add schema validation at every handoff point:

```python
import json
from typing import Optional

def validate_recon_output(output: str) -> Optional[dict]:
    """Validate recon agent output before passing to analysis."""
    try:
        data = json.loads(output)
        required_fields = ["iocs", "threat_indicators"]
        for field in required_fields:
            if field not in data:
                print(f"VERIFICATION FAILED: Missing required field '{field}'")
                return None
        if not isinstance(data["iocs"], list):
            print("VERIFICATION FAILED: 'iocs' must be a list")
            return None
        return data
    except json.JSONDecodeError:
        print("VERIFICATION FAILED: Output is not valid JSON")
        return None

def validate_analysis_output(output: str) -> Optional[dict]:
    """Validate analysis agent output before passing to reporting."""
    try:
        data = json.loads(output)
        required_fields = ["final_assessment", "confidence"]
        for field in required_fields:
            if field not in data:
                print(f"VERIFICATION FAILED: Missing required field '{field}'")
                return None
        confidence = data.get("confidence", 0)
        if not isinstance(confidence, (int, float)) or not 0 <= confidence <= 100:
            print(f"VERIFICATION FAILED: Confidence must be 0-100, got {confidence}")
            return None
        return data
    except json.JSONDecodeError:
        return None
```

**Step 3: Agent Scaling Experiment**

Replicate Week 7 Station 2 on your improved system. Start with 3 agents, add to 5, then measure:

```csv
agent_count,synthesis_quality_1to5,coordination_cost_usd,total_time_sec,output_conflicts
3,,,,
5,,,,
```

Use your assessment to answer: Does adding a 4th specialized agent improve output quality enough to justify the additional cost? Document your answer with measurements.

**Step 4: Cost Optimization Pass**

Review your agent model selections using the Assessment Stack:
1. Is your orchestrator using Haiku (routing task, should be cheap)?
2. Is your recon agent using Haiku (extraction task, should be cheap)?
3. Is your analysis agent using Sonnet (reasoning task, appropriate tier)?
4. Could any part use a cache-optimized approach (same system prompt, many invocations)?

Calculate: What does your 5-agent SOC cost per incident? Per 100 incidents per day? Per year?

---

## Deliverables

1. **Extended orchestrator with debate pattern** — working code with per-agent cost tracking
2. **Inter-agent verification implementation** — schema validation at each handoff
3. **Agent scaling experiment results** — measurements at 3 and 5 agents, with quality assessment
4. **Cost optimization analysis** — per-incident cost breakdown by agent, model right-sizing recommendations
5. **When NOT to use multi-agent reflection** (300 words) — for your specific SOC use case, when would a single agent with tools outperform your 5-agent system?

---

## AIUC-1 Integration

**Domain B revisited — agent-to-agent trust boundaries:**

Agent-to-agent handoffs must not be blind trust. The inter-agent verification implementation (Step 2) is AIUC-1 B in practice for multi-agent systems:

- **B005 (Input Filtering):** Validate what each agent receives from other agents, not just what humans send
- **B006 (Limit Access):** Each agent should only receive the data it needs from the previous stage — not the full context of the entire investigation

If the analysis agent's schema validation fails, the orchestrator should not silently pass invalid data to the reporting agent. It should: log the failure, notify of degraded output, and either retry or escalate.

## V&V Lens

**Systematic Agent Verification:** This week's inter-agent validation is V&V at the system integration level. Individual agents can pass unit tests while the integration between them fails.

Verification checklist for multi-agent handoffs:
- [ ] Schema validation at every handoff
- [ ] Confidence level consistency (high confidence output from low-confidence input is a red flag)
- [ ] Evidence chain preserved (can the reporting agent trace claims back to original evidence?)
- [ ] Cost accounting (do per-agent costs add up to total system cost accurately?)

---

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the key concepts from this reading. Start easy, then get harder."
> - "I think I understand the debate pattern for multi-agent systems but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common misconceptions about agent cost optimization? Do I have any of them?"
> - "Connect this week's material to what we learned in Week 9. How do they relate?"

---

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.
