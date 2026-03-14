# Approach Selection Guide

Decision tree for choosing the right computation approach per component.

## The Core Question

**"What is the cheapest approach that meets the quality bar for this component?"**

Always start at the top (cheapest) and only move down when the cheaper option demonstrably fails.

---

## Decision Tree

```
Does this component need to handle novel/ambiguous input?
│
├── NO → Is the logic rule-based or pattern-based?
│         │
│         ├── YES → STATIC CODE or AUTOMATION
│         │         Examples:
│         │         - Log parsing (regex, JSON schema)
│         │         - Alert routing (if/else rules)
│         │         - Data normalization (field mapping)
│         │         - Scheduled tasks (cron, pipelines)
│         │         - Input validation (schema check)
│         │         Confidence: ★★★★★
│         │
│         └── NO → Is it a lookup or exact match?
│                   │
│                   ├── YES → DETERMINISTIC TOOL (MCP/API)
│                   │         Examples:
│                   │         - CVE lookup by ID
│                   │         - IP reputation check
│                   │         - DNS resolution
│                   │         - Database query by key
│                   │         - Hash lookup against known-bad list
│                   │         Confidence: ★★★★★
│                   │
│                   └── NO → Consider SLM or LLM (below)
│
└── YES → How complex is the reasoning required?
          │
          ├── SIMPLE (classification, extraction, templated generation)
          │   → SLM (Haiku-tier)
          │     Examples:
          │     - Alert priority classification (critical/non-critical)
          │     - Entity extraction from unstructured text
          │     - Template-based report generation
          │     - Sentiment/intent classification
          │     - Simple summarization
          │     Confidence: ★★★★☆ (with eval dataset)
          │
          ├── MODERATE (analysis, correlation, multi-step reasoning)
          │   → LLM (Sonnet-tier)
          │     Examples:
          │     - Incident analysis with multiple data sources
          │     - Threat correlation across indicators
          │     - Code review for security issues
          │     - Context-aware enrichment
          │     - Multi-factor risk assessment
          │     Confidence: ★★★☆☆ (needs human review gate)
          │
          └── COMPLEX (novel judgment, deep reasoning, high-stakes)
              → LLM (Opus-tier)
                Examples:
                - Novel attack pattern identification
                - Strategic risk assessment
                - Complex forensic analysis
                - Adversarial scenario modeling
                - Cross-domain synthesis
                Confidence: ★★★☆☆ (needs human review gate)
                Note: Verify Opus is worth 1.7x Sonnet cost 
                for this specific task. Often Sonnet suffices.
```

---

## Hybrid Components

Some components need multiple approaches internally:

```
Example: Threat Intel Enrichment
├── Step 1: IP lookup against reputation DB → DETERMINISTIC TOOL
├── Step 2: CVE lookup by ID → DETERMINISTIC TOOL  
├── Step 3: Summarize findings into context → SLM (Haiku)
└── Step 4: Assess threat level given context → LLM (Sonnet)

Spec this as: Approach = Hybrid
Sub-components rated individually
Overall confidence = lowest sub-component rating
```

---

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|---------------|-----------------|
| Using LLM for log parsing | Logs are structured — regex works | Static code |
| Using LLM for database lookups | Exact match doesn't need reasoning | Deterministic tool (MCP) |
| Using Opus for classification | Binary classification is simple | SLM (Haiku) |
| Using Sonnet for everything | Wastes cost on simple components | Right-size per component |
| Using Haiku for deep analysis | Haiku lacks reasoning depth | LLM (Sonnet or Opus) |
| Skipping deterministic tools | MCP + rules engine often beats LLM | Always check rule-based first |

---

## Evidence Requirements by Approach Type

| Approach | What Counts as Evidence | Minimum for ★★★★☆ |
|----------|------------------------|-------------------|
| Static code | Unit tests pass | 100% on test suite |
| Automation | Pipeline runs successfully | 3 consecutive successful runs |
| Deterministic tool | Query returns correct results | 100% accuracy on test queries |
| SLM | Eval dataset with labeled examples | >90% on 50+ examples |
| LLM (Sonnet) | Eval dataset with expert review | >85% on 30+ complex scenarios |
| LLM (Opus) | Eval dataset with expert review | >85% on 30+ complex scenarios |

Without evidence, maximum confidence is ★★☆☆☆ regardless of approach type.
