# Engineering Assessment Stack

Six-layer decision framework for AI security engineering.
Apply at every architectural decision point.

## Layer 1: Problem Type
What kind of problem am I solving?
- Classification (known categories, binary output)
- Correlation (connecting data points across sources)
- Reasoning (novel situation, ambiguous evidence)
- Generation (producing something new)
- Retrieval (finding specific information)

## Layer 2: Computation Approach
What type of computation fits this problem?
- Deterministic (regex, rules, exact match, signatures)
- Statistical (classifiers, embeddings, anomaly detection)
- Reasoning (LLM — when deterministic/statistical insufficient)

## Layer 3: Model Selection
If reasoning is needed, which model tier?
- Haiku ($1/MTok): routing, classification, high-throughput
- Sonnet ($3/MTok): balanced reasoning, operational workflow
- Opus ($5/MTok): deep analysis, complex judgment, rare high-stakes
- Specialized: fine-tuned models for narrow tasks
- None: deterministic tool handles it without LLM

## Layer 4: Data Architecture
Where does the data live? What query type matches the question?
- Relational DB: exact lookup, structured filtering, joins
- Vector DB: semantic similarity, conceptual search
- Graph DB: relationship traversal, path analysis
- Time series DB: trends, anomaly detection over time
- Search index: full text search
- Context window: ephemeral, per-request (watch for lost-in-middle)

## Layer 5: Integration Pattern
How does this component connect to the system?
- Real-time (streaming, low latency) vs. batch (async, high volume)
- MCP tool call vs. direct API vs. embedded function
- Agent-managed vs. human-triggered vs. autonomous
- A2A (agent-to-agent) vs. MCP (agent-to-tool)

## Layer 6: Verification
How do I confirm the output is correct?
- Test suite (deterministic tools)
- Confusion matrix (classifiers)
- Human review (reasoning outputs)
- Cross-reference (multi-source validation)
- Behavioral monitoring (production agents)
