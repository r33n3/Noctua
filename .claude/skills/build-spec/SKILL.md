---
name: build-spec
description: "Generate a complete specification package from an idea, /think output, or feature requirement. Produces component manifests with approach types (static code, automation, SLM, LLM, deterministic tool), confidence ratings, agent swarm configurations (2-5 agents), data contracts, and build instructions that Claude Code or a /worktree skill can consume to execute in one shot. Use this skill whenever someone says 'spec this', 'write a spec', 'spec out', 'design this system', 'plan this build', 'how should we build this', 'create a spec package', 'spec a feature', 'what agents do we need', or wants to go from idea to buildable plan. Also use when updating an existing project with a new feature or requirement. Always use this skill before building anything non-trivial — the spec is what makes one-shot builds possible."
---

# Specification Package Generator

Transform ideas into buildable specification packages. A spec package is the single artifact that enables one-shot builds — every architectural decision made, every component typed, every interface defined.

**Two modes:**
- **New project** — Full spec from an idea or /think output
- **Feature update** — Scoped spec for a new capability on an existing project

---

## Input Expectations

The spec skill consumes ONE of these input types:

### 1. Raw Idea (minimal input)
A sentence or paragraph describing what someone wants to build.
> "I need a tool that triages SOC alerts and enriches them with threat intel"

The spec skill will ask clarifying questions before generating.

### 2. /think Output (preferred input)
A structured analysis from the /think skill or CCT process containing:
- Problem definition and context
- User/stakeholder identification
- Constraints and requirements
- Initial assessment of approaches considered
- Evidence from any Stage 0 prototyping

When /think output is provided, the spec skill extracts decisions and evidence directly — fewer questions needed.

### 3. Feature Requirement (existing project)
A description of new functionality for an existing system, plus a pointer to the existing spec package or project context.
> "Add graph-based attack path analysis to our existing SOC triage system. Current spec at ~/project/specs/soc-triage.md"

The spec skill reads the existing spec, understands current architecture, and produces an addendum — not a replacement.

---

## Spec Generation Process

### Step 1: Assess What We Know

Before generating anything, classify the input completeness:

| Signal | Status | Action |
|--------|--------|--------|
| Problem clearly defined | ✓ or ✗ | If ✗, ask: "What problem does this solve? Who uses it?" |
| Users/stakeholders identified | ✓ or ✗ | If ✗, ask: "Who consumes the output?" |
| Data sources known | ✓ or ✗ | If ✗, ask: "What data does this system need access to?" |
| Success criteria defined | ✓ or ✗ | If ✗, ask: "How do you know it works?" |
| Prototyping evidence exists | ✓ or ✗ | If ✗, note: confidence ratings will be lower |
| Existing system context | ✓ or ✗ | If feature update, read existing spec first |

Ask ALL missing questions in one pass — do not spread across multiple turns.

### Step 2: Decompose into Components

Break the system into discrete components. For each component, determine:

**Approach Type** — What computation does this component need?

| Type | When to Use | Cost | Confidence Floor |
|------|------------|------|-----------------|
| **Static code** | Deterministic logic, parsing, routing, rules | Zero model cost | ★★★★★ |
| **Automation** | Scripted workflows, scheduled tasks, pipelines | Zero model cost | ★★★★★ |
| **Deterministic tool** | Database lookup, API call, exact match retrieval | Zero model cost | ★★★★★ |
| **SLM (Haiku-tier)** | Classification, simple extraction, high-throughput | Low model cost | ★★★★☆ |
| **LLM (Sonnet-tier)** | Reasoning, analysis, generation, moderate complexity | Medium model cost | ★★★☆☆ |
| **LLM (Opus-tier)** | Deep reasoning, novel analysis, high-stakes judgment | Higher model cost | ★★★☆☆ |
| **Hybrid** | Multiple approach types within one component | Varies | Per sub-component |

**Key principle:** Always use the CHEAPEST approach that meets the quality bar. If static code solves it, don't use an LLM. If Haiku handles classification, don't use Sonnet. Evidence from Stage 0 prototyping justifies the selection — without evidence, default to "needs testing" and lower confidence.

### Step 3: Define Agent Swarm

If the system requires multiple components that can execute in parallel or require specialized contexts, define an agent swarm configuration (2-5 agents):

```yaml
swarm:
  name: "soc-triage-team"
  orchestrator:
    capability: routing          # Orchestrator routes — cheapest viable model
    model_constraints: []
    resolved_model: null         # Filled by model selection step below
    role: "Coordinate agent tasks, collect results, synthesize output"
    
  agents:
    - name: recon
      capability: moderate_reasoning
      model_constraints:
        - "must handle multi-source correlation"
        - "data classification: confidential"
      resolved_model: null       # Filled by model selection step
      resolved_justification: "" # Evidence from Stage 0
      role: "Threat intel enrichment and context gathering"
      tools: [mcp-threatintel, mcp-cve-lookup]
      components: [3, 4]
      
    - name: analyst
      capability: deep_reasoning
      model_constraints:
        - "complex incident analysis"
        - "Stage 0: Haiku 71%, Sonnet 89% on eval set"
      resolved_model: null
      resolved_justification: ""
      role: "Incident analysis and correlation"
      tools: [mcp-siem-query]
      components: [5]
      
    - name: reporter
      capability: simple_generation
      model_constraints:
        - "template-driven structured output"
        - "high volume — cost matters"
      resolved_model: null
      resolved_justification: ""
      role: "Generate structured output from analysis"
      tools: []
      components: [6]
```

**Model Resolution:** After defining capabilities and constraints, resolve each agent's model:

1. Check **model registry** — is a model approved for this data classification and use case?
2. Check **Stage 0 evidence** — what did prototyping show about model performance?
3. Check **constraints** — does data need to stay local (→ Ollama/local model)? Is cost critical (→ smallest viable model)? Is this high-stakes (→ strongest available)?
4. Apply **cheapest viable model** principle — don't use Sonnet where Haiku works, don't use API where local works, don't use LLM where static code works

**Capability tiers map to model options:**

| Capability | Typical Resolutions | Notes |
|-----------|-------------------|-------|
| routing | Haiku, local SLM, or static code | Cheapest possible — no reasoning needed |
| simple_classification | Haiku, fine-tuned SLM, local model | High throughput, low cost |
| simple_generation | Haiku, local SLM | Template-constrained output |
| moderate_reasoning | Sonnet, capable local model (Llama 3.3 70B) | Balanced cost/quality |
| deep_reasoning | Sonnet, Opus (justify the cost) | Evidence must show Sonnet insufficient |
| pattern_matching | No model — static code, regex, YARA | Don't use LLM for deterministic patterns |
| semantic_search | Embedding model (local or API) | Purpose-built, not general LLM |
| data_processing | No model — Python, SQL, MCP tools | Don't use LLM for structured transforms |

**Provider options per agent:**
- **API (Anthropic):** Claude Haiku/Sonnet/Opus — managed, metered, cached
- **API (other):** OpenAI, Google, Mistral — when specific capability needed
- **Local (Ollama):** Llama, Mistral, Phi — when data can't leave environment or cost is critical
- **Local (specialized):** Fine-tuned SLM, embedding model — purpose-built for narrow task
- **None:** Static code, rules engine, MCP tool — no model needed

**Swarm sizing rules:**
- 2 agents: Simple pipeline (analyze → report)
- 3 agents: Standard team (gather → analyze → output)
- 4 agents: Specialized team (multiple gather specialists + analyze + output)
- 5 agents: Complex system (multiple specialists + coordinator overhead)
- Beyond 5: Diminishing returns — coordination cost exceeds specialization benefit

Each agent declaration includes the components it owns from the spec, so `/worktree` can set up isolated work environments per agent.

### Step 4: Define Data Contracts

For every component boundary and every agent boundary, define the interface:

```yaml
contracts:
  - from: component_1  # Alert Ingestion
    to: component_2    # Priority Classification
    format: json
    schema:
      alert_id: string
      timestamp: iso8601
      source: string
      raw_data: object
      normalized_fields:
        src_ip: string
        dst_ip: string
        severity_hint: string
    
  - from: agent_recon
    to: agent_analyst
    format: json
    schema:
      alert_id: string
      enrichment:
        threat_intel_matches: array
        cve_references: array
        reputation_scores: object
      confidence: float  # 0.0-1.0
```

Contracts enforce that agents and components can be developed and tested independently. If the contract is defined, two agents in two worktrees can build simultaneously without coordination.

### Step 5: Assign Confidence Ratings

Rate each component based on available evidence:

| Rating | Meaning | Evidence Required | Test Strategy |
|--------|---------|-------------------|---------------|
| ★★★★★ | Ship as-is | Deterministic output, no model dependency | Unit tests |
| ★★★★☆ | High confidence | Evaluated on test dataset, >90% quality | Unit + eval dataset |
| ★★★☆☆ | Moderate — needs verification | Evaluated but <90%, or limited test data | Unit + eval + human review gate |
| ★★☆☆☆ | Low — needs human oversight | Minimal testing, approach unvalidated | Shadow mode, human approval |
| ★☆☆☆☆ | Unvalidated — needs more Stage 0 | No empirical evidence for approach choice | DO NOT BUILD — return to experimentation |

**Rule:** If ANY component rates ★☆☆☆☆, the spec is not ready. Flag it and recommend returning to Stage 0 for that component.

### Step 6: Generate the Spec Package

Produce the complete spec as a markdown document following this structure.

---

## Output Format

The spec package is a single markdown file with this structure:

```markdown
# Spec Package: [System Name]
Generated: [date]
Mode: [New Project | Feature Update]
Status: [Draft | Reviewed | Approved]

## 1. Overview
**Problem:** [one paragraph]
**Users:** [who consumes the output]
**Success criteria:** [how you know it works]
**Scope boundary:** [what this system does NOT do]

## 2. Component Manifest

### Component 1: [Name]
- **Approach:** [static code | automation | deterministic tool | SLM | LLM | hybrid]
- **Capability required:** [routing | simple_classification | moderate_reasoning | deep_reasoning | pattern_matching | semantic_search | data_processing | none]
- **Model:** [resolved model + provider, or "none — deterministic"]
- **Model justification:** [Stage 0 evidence, registry approval, constraint satisfaction]
- **Confidence:** [★ rating]
- **Evidence:** [Stage 0 results or "needs testing"]
- **Input:** [data contract reference]
- **Output:** [data contract reference]
- **Error handling:** [what happens on failure]
- **Governance:** [audit logging, AIUC-1 domain, human gates]
- **Test strategy:** [based on confidence rating]
- **Estimated cost:** [per invocation if model-dependent, or "zero" if deterministic]

[Repeat for each component]

## 3. Agent Swarm Configuration
[YAML block as defined in Step 3]
[Include: agent count, model per agent, role, tools, component ownership]

## 4. Data Contracts
[YAML block as defined in Step 4]
[Every component-to-component and agent-to-agent interface]

## 5. Integration Map
[How components connect — data flow description]
[MCP server topology]
[External service dependencies]

## 6. Compliance Mapping
- **AIUC-1 domains applicable:** [list with per-component mapping]
- **Regulatory frameworks:** [NAIC, HIPAA, etc. if applicable]
- **Risk tier:** [low/medium/high/critical]
- **Governance hooks:** [where audit logging, human gates, and review points exist]

## 7. Build Instructions
[For each agent in the swarm, what it builds and in what order]
[Dependencies between agents — what must complete before what can start]
[Parallel vs sequential build phases]

## 8. Evaluation Criteria
- **Baseline metrics:** [from Stage 0 if available]
- **Target metrics:** [for production]
- **Evaluation dataset:** [location or "needs creation"]
- **Cost target:** [budget per task/invocation]

## 9. Open Questions
[Anything unresolved — each with a recommendation]
[Components rated ★☆☆☆☆ that need Stage 0 work]
```

---

## Feature Update Mode

When speccing a feature update on an existing project:

1. **Read the existing spec first** — understand current components, agents, contracts
2. **Identify integration points** — where does the new feature connect to existing components?
3. **Produce an addendum, not a replacement** — new components, modified contracts, additional agents
4. **Flag breaking changes** — if the feature modifies existing data contracts or component behavior, call it out explicitly
5. **Preserve existing confidence ratings** — don't re-rate components that aren't changing

Output format for feature updates:

```markdown
# Spec Addendum: [Feature Name]
Parent spec: [path to existing spec]
Generated: [date]

## Changes to Existing Components
[Which existing components are modified and how]

## New Components
[Same format as component manifest above]

## Contract Changes
[Modified or new data contracts]

## Agent Swarm Update
[New agents added, or existing agent scope changes]

## Integration Impact
[How this connects to the existing system]
```

---

## Handoff to /worktree

The spec package is designed to be consumed by a `/worktree` skill or Claude Code directly. The agent swarm configuration tells `/worktree`:

- How many worktrees to create (one per agent)
- What branch name per worktree
- What model each agent uses
- What tools each agent needs
- What components each agent builds
- What data contracts define the interfaces between worktrees

A properly written spec enables this flow:
```
/spec output → /worktree reads swarm config → creates worktrees → 
agents build components in parallel → contracts ensure compatibility →
orchestrator integrates → system works on first assembly
```

---

## Quality Checklist

Before finalizing any spec package, verify:

- [ ] Every component has an approach type assigned
- [ ] No component uses a more expensive approach than necessary
- [ ] Every component has a confidence rating with evidence citation
- [ ] No ★☆☆☆☆ components exist (return to Stage 0 if so)
- [ ] Every component boundary has a data contract
- [ ] Every agent boundary has a data contract
- [ ] Agent swarm is 2-5 agents (flag if more needed)
- [ ] Orchestrator uses cheapest viable model
- [ ] Error handling defined for every component
- [ ] Governance hooks specified (audit, human gates, AIUC-1)
- [ ] Build order and dependencies are explicit
- [ ] Scope boundary is clear (what the system does NOT do)
- [ ] Cost estimate exists for model-dependent components
- [ ] Success criteria are measurable

---

## References

Read these files for additional context when generating specs:

- `references/approach-selection.md` — Detailed decision tree for choosing approach types with examples
- `references/swarm-patterns.md` — Common agent swarm patterns with sizing guidance
