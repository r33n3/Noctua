# Agent Swarm Patterns

Common agent swarm configurations with sizing guidance. Use these as starting templates and adapt to your specific spec.

---

## Sizing Principles

- **Orchestrator is always the cheapest model** — it routes, it doesn't reason
- **Each agent should own 1-3 components** — more than 3 means the agent's context is too broad
- **Parallel agents need data contracts** — if two agents run simultaneously, their interface must be defined
- **Sequential agents share context through output** — agent A's output is agent B's input
- **Beyond 5 agents:** coordination overhead degrades synthesis quality. If you need more, consider splitting into sub-swarms with their own orchestrators

---

## Pattern 1: Pipeline (2 agents)

**Use when:** Work flows linearly from input to output with one transformation step.

```yaml
swarm:
  name: "pipeline"
  agent_count: 2
  pattern: sequential
  
  orchestrator:
    capability: routing
    resolved_model: null  # Resolve: cheapest viable — likely Haiku or static routing
    role: "Pass input to processor, collect output from reporter"
  
  agents:
    - name: processor
      capability: moderate_reasoning  # Resolve based on task complexity
      resolved_model: null
      role: "Analyze input, produce structured findings"
      components: [1, 2, 3]
      receives_from: orchestrator
      sends_to: reporter
      
    - name: reporter  
      capability: simple_generation   # Template-driven — resolve to cheapest
      resolved_model: null
      role: "Format findings into deliverable output"
      components: [4]
      receives_from: processor
      sends_to: orchestrator
```

**Worktree layout:**
```
worktrees/
├── processor/    # Agent 1 builds components 1-3
└── reporter/     # Agent 2 builds component 4
```

**When to use:** Simple tools — scanner + report, classifier + output, enricher + formatter.

---

## Pattern 2: Gather-Analyze-Output (3 agents)

**Use when:** System needs to collect information from multiple sources before analysis.

```yaml
swarm:
  name: "gather-analyze-output"
  agent_count: 3
  pattern: fan-in
  
  orchestrator:
    capability: routing
    resolved_model: null
    role: "Dispatch gather task, wait for completion, dispatch analysis, collect output"
  
  agents:
    - name: gatherer
      capability: moderate_reasoning  # Needs to normalize diverse sources
      resolved_model: null
      role: "Collect and normalize data from multiple sources"
      tools: [mcp-source-a, mcp-source-b, mcp-source-c]
      components: [1, 2]
      receives_from: orchestrator
      sends_to: analyst
      
    - name: analyst
      capability: deep_reasoning      # Core analysis — resolve to strongest justified model
      resolved_model: null
      role: "Correlate gathered data, identify patterns, assess risk"
      components: [3, 4]
      receives_from: gatherer
      sends_to: reporter
      
    - name: reporter
      capability: simple_generation   # Template output — resolve to cheapest
      resolved_model: null
      role: "Generate structured report from analysis"
      components: [5]
      receives_from: analyst
      sends_to: orchestrator
```

**Worktree layout:**
```
worktrees/
├── gatherer/     # Agent 1 builds data collection + normalization
├── analyst/      # Agent 2 builds analysis + correlation
└── reporter/     # Agent 3 builds report generation
```

**When to use:** SOC triage, threat assessment, compliance checks — anything that gathers → thinks → outputs.

---

## Pattern 3: Parallel Specialists (4 agents)

**Use when:** Multiple independent data sources or analysis types that can run simultaneously.

```yaml
swarm:
  name: "parallel-specialists"
  agent_count: 4
  pattern: fan-out-fan-in
  
  orchestrator:
    capability: routing
    resolved_model: null
    role: "Dispatch parallel tasks to specialists, collect results, pass to synthesizer"
  
  agents:
    - name: specialist_a
      capability: moderate_reasoning  # Domain-specific analysis
      resolved_model: null
      role: "Domain A analysis (e.g., network indicators)"
      tools: [mcp-network-tools]
      components: [1]
      receives_from: orchestrator
      sends_to: synthesizer
      parallel_group: specialists
      
    - name: specialist_b
      capability: moderate_reasoning  # May resolve to different model than A
      resolved_model: null
      role: "Domain B analysis (e.g., endpoint indicators)"
      tools: [mcp-endpoint-tools]
      components: [2]
      receives_from: orchestrator
      sends_to: synthesizer
      parallel_group: specialists
      
    - name: specialist_c
      capability: simple_classification  # Lookups — cheapest model
      resolved_model: null
      role: "Domain C analysis (e.g., reputation lookups)"
      tools: [mcp-reputation]
      components: [3]
      receives_from: orchestrator
      sends_to: synthesizer
      parallel_group: specialists
      
    - name: synthesizer
      capability: deep_reasoning    # Must integrate diverse specialist outputs
      resolved_model: null
      role: "Combine specialist outputs into unified assessment"
      components: [4, 5]
      receives_from: [specialist_a, specialist_b, specialist_c]
      sends_to: orchestrator
```

**Worktree layout:**
```
worktrees/
├── specialist-a/    # Builds network analysis component
├── specialist-b/    # Builds endpoint analysis component
├── specialist-c/    # Builds reputation lookup component
└── synthesizer/     # Builds synthesis + output components
```

**When to use:** Multi-source intelligence, parallel scanning, distributed assessment. Each specialist can be built and tested independently because data contracts define the interface to the synthesizer.

---

## Pattern 4: Debate/Consensus (3-5 agents)

**Use when:** High-stakes decisions benefit from independent analysis and comparison.

```yaml
swarm:
  name: "debate"
  agent_count: 4
  pattern: parallel-then-compare
  
  orchestrator:
    capability: moderate_reasoning  # Must synthesize disagreements — not just routing
    resolved_model: null
    role: "Dispatch same problem to independent analysts, compare results, flag disagreements"
  
  agents:
    - name: analyst_1
      capability: deep_reasoning
      resolved_model: null
      model_constraints:
        - "should differ from analyst_2 and analyst_3 if possible"
        - "diversity of model families improves debate quality"
      role: "Independent analysis — approach A (e.g., indicator-focused)"
      components: [1]
      receives_from: orchestrator
      sends_to: comparator
      parallel_group: analysts
      
    - name: analyst_2
      capability: deep_reasoning
      resolved_model: null
      model_constraints:
        - "consider different provider than analyst_1 for diversity"
      role: "Independent analysis — approach B (e.g., behavior-focused)"
      components: [2]
      receives_from: orchestrator
      sends_to: comparator
      parallel_group: analysts
      
    - name: analyst_3
      capability: deep_reasoning
      resolved_model: null
      role: "Independent analysis — approach C (e.g., context-focused)"
      components: [3]
      receives_from: orchestrator
      sends_to: comparator
      parallel_group: analysts
      
    - name: comparator
      capability: deep_reasoning
      resolved_model: null
      role: "Compare analyses, identify agreement/disagreement, produce confidence-weighted synthesis"
      components: [4, 5]
      receives_from: [analyst_1, analyst_2, analyst_3]
      sends_to: orchestrator
```

**Debate pattern note:** For maximum value, consider using DIFFERENT models or model families for each analyst. A debate between three Sonnet instances has less diversity than Sonnet vs. a local Llama 70B vs. an OpenAI model. Model diversity produces genuinely independent analyses. This is one of the few patterns where multi-provider is a feature, not a complication.

**When to use:** Forensic analysis, risk assessment, any scenario where independent perspectives improve accuracy. Agreement across analysts = high confidence. Disagreement = flag for human review.

---

## Pattern 5: Expert Delegation (5 agents)

**Use when:** Complex system requiring deep specialization across multiple domains.

```yaml
swarm:
  name: "expert-delegation"
  agent_count: 5
  pattern: orchestrated-delegation
  
  orchestrator:
    capability: moderate_reasoning  # Must decompose and route complex problems
    resolved_model: null
    role: "Decompose problem, route sub-tasks to appropriate expert, collect and integrate results"
  
  agents:
    - name: recon
      capability: data_processing     # Fast collection — cheapest viable
      resolved_model: null
      role: "Fast reconnaissance and data collection"
      tools: [mcp-osint, mcp-dns, mcp-whois]
      components: [1, 2]
      
    - name: vuln_analyst
      capability: moderate_reasoning  # Needs to assess exploit viability
      resolved_model: null
      role: "Vulnerability analysis and exploit assessment"
      tools: [mcp-cve, mcp-exploit-db]
      components: [3]
      
    - name: threat_analyst
      capability: deep_reasoning      # Attribution requires nuance
      resolved_model: null
      model_constraints:
        - "threat intel may be classified — check data classification"
        - "may require local model if data cannot leave environment"
      role: "Threat actor attribution and TTP analysis"
      tools: [mcp-threat-intel, mcp-mitre-atlas]
      components: [4]
      
    - name: risk_assessor
      capability: deep_reasoning      # Business impact requires judgment
      resolved_model: null
      role: "Business impact and risk quantification"
      components: [5]
      
    - name: reporter
      capability: simple_generation   # Templated output — cheapest
      resolved_model: null
      role: "Compile findings into actionable report"
      components: [6, 7]
```

**When to use:** Full incident response, comprehensive security assessment, multi-domain analysis. This is the maximum recommended size — beyond 5, coordination degrades.

---

## Worktree Handoff Specification

For each swarm pattern, the spec package produces a worktree configuration block that `/worktree` can consume directly:

```yaml
worktree_config:
  base_branch: main
  
  worktrees:
    - name: recon
      branch: agent/recon
      capability: data_processing
      resolved_model: haiku-4.5       # Resolved from capability + evidence
      resolved_provider: anthropic     # API, ollama, or other
      agent_prompt: "references/prompts/recon-agent.md"
      components_owned: [1, 2]
      tools_required: [mcp-osint, mcp-dns]
      input_contracts: [orchestrator_to_recon]
      output_contracts: [recon_to_vuln_analyst, recon_to_threat_analyst]
      
    - name: vuln-analyst
      branch: agent/vuln-analyst
      capability: moderate_reasoning
      resolved_model: sonnet-4.6
      resolved_provider: anthropic
      agent_prompt: "references/prompts/vuln-analyst-agent.md"
      components_owned: [3]
      tools_required: [mcp-cve, mcp-exploit-db]
      input_contracts: [recon_to_vuln_analyst]
      output_contracts: [vuln_to_risk_assessor]

    - name: threat-analyst
      branch: agent/threat-analyst
      capability: deep_reasoning
      resolved_model: llama-3.3-70b   # Local — classified threat intel
      resolved_provider: ollama
      model_justification: "Threat intel data classification requires local processing"
      agent_prompt: "references/prompts/threat-analyst-agent.md"
      components_owned: [4]
      tools_required: [mcp-threat-intel]
      input_contracts: [recon_to_threat_analyst]
      output_contracts: [threat_to_risk_assessor]

  build_order:
    parallel_phase_1: [recon]
    parallel_phase_2: [vuln_analyst, threat_analyst]
    parallel_phase_3: [risk_assessor]
    final: [reporter]
    
  integration_test:
    trigger: all_agents_complete
    method: "Run orchestrator with mock data through full pipeline"
```

This block tells `/worktree` exactly what to create, in what order, with what dependencies. No ambiguity, no decision-making at build time.

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|---|---|---|
| **God agent** — one agent owns all components | Context overload, no parallelism | Decompose by domain |
| **Chatty agents** — agents pass messages back and forth | Coordination overhead exceeds value | Define clear data contracts, minimize back-and-forth |
| **Uniform models** — all agents use the same model | Wastes cost on simple tasks, misses optimization | Right-size by capability — resolve each independently |
| **Hardcoded models** — pattern prescribes specific models | Ignores data classification, cost, local requirements | Declare capabilities, resolve models from evidence + registry |
| **No orchestrator** — agents self-coordinate | No single point of synthesis | Always have an orchestrator |
| **6+ agents** — too many specialists | Coordination degrades synthesis | Max 5, or split into sub-swarms |
| **Shared state** — agents read/write same files | Race conditions, merge conflicts | Each agent owns its worktree exclusively |
| **Single provider** — all agents use same API | Misses local model opportunities, single point of failure | Consider multi-provider when data classification or cost requires it |
| **Debate with identical models** — same model argues with itself | Low diversity, self-preference bias | Use different models/families for genuine independence |
