# Week 5: Hybrid RAG for Security

**Semester 1 | Week 5 of 16**

## Learning Objectives

- Understand RAG architecture and why it improves LLM accuracy for domain-specific questions
- Design hybrid RAG from the start — not vector-only
- Know which query type maps to which data store
- Understand retrieval quality: position sensitivity, re-ranking, chunk size optimization
- Test citation accuracy and understand the lost-in-the-middle problem
- Apply AIUC-1 Domain A (Data & Privacy): data minimization in knowledge bases, PII handling

---

## Day 1 — Theory

### Why RAG: The Accuracy Challenge

LLMs have a training cutoff. Claude's knowledge ends in early 2026, so it doesn't know about vulnerabilities disclosed last week. Beyond the cutoff, LLMs struggle with proprietary information: your organization's security policies, your incident response procedures, your specific threat intelligence.

Ask Claude directly "What does our security policy say about password resets?" and it might hallucinate a reasonable-sounding answer. In a compliance context, that's a serious risk.

**Retrieval-Augmented Generation (RAG)** solves this:
1. **Retrieves** relevant documents from your knowledge base
2. **Augments** the prompt with those documents
3. **Generates** a response grounded in the retrieved documents

Now the response cites: "Our security policy (Section 3.2, last updated Jan 15 2026) requires password resets to be initiated by the user from a verified email address. [Document excerpt]." You know exactly where the answer came from.

> **Key Concept:** RAG shifts the LLM's role from "know everything" to "synthesize retrieved information." This is more honest, more verifiable, and more accurate for domain-specific questions.

### Hybrid RAG: Not Vector-Only

The critical mistake in early RAG implementations was using only vector (semantic) search. Real security systems need multiple retrieval mechanisms working together.

**Why the right store matters:**

| Question Type | Wrong Store | Right Store |
|--------------|-------------|-------------|
| "Has IP 203.45.12.89 appeared in the last 30 days?" | Vector DB (semantic similarity returns near-matches of IPs) | Relational DB (exact lookup) |
| "Find incidents similar to this APT campaign" | Relational DB (requires exact string match, misses semantic meaning) | Vector DB (semantic similarity) |
| "How did the attacker move from initial access to database?" | Time series (no graph structure) | Graph DB (path traversal) |
| "Is alert frequency increasing over the last week?" | Vector DB (no time structure) | Time series DB (trend analysis) |

**Hybrid Retrieval Architecture:**

```
User Query: "Find incidents related to the Singapore APT campaign last month"

Decompose the query:
→ Vector search: "incidents similar to Singapore APT campaign" (semantic)
→ Relational filter: "timestamp > 2026-02-01" (exact)
→ Combined: semantic results filtered by time range

User Query: "Trace the attack path from initial access to data exfiltration"

→ Graph traversal: find nodes connected through attack sequence
→ No semantic or relational component needed
```

**The Four Data Store Roles in Security:**

**Vector Search:** For semantic similarity — "find incidents like this one," "find threat intel about this type of attack," "find policy sections relevant to this situation." Effective when meaning matters more than exact matching.

**Relational Queries:** For exact lookup and structured filtering — "find all alerts from this IP in the last 30 days," "find all incidents where severity > high," "join user accounts with login attempts." Effective when you need precision.

**Graph Traversal:** For relationship mapping — "trace the attack path," "find all systems accessible from this compromised host," "map the kill chain." Effective when connections matter.

**Time Series:** For trend analysis — "show alert frequency over 90 days," "detect anomalies in login patterns," "measure MTTR over time." Effective when temporal patterns matter.

### Retrieval Quality: What Actually Works

**The Lost-in-the-Middle Problem**

Research on LLM context utilization shows that models are better at using information from the beginning and end of their context, and worse at using information from the middle. For RAG, this means:

- Critical evidence at position 1 of 10 retrieved chunks: high utilization
- Critical evidence at position 5 of 10: lower utilization
- Critical evidence at position 3 of 7: same as above

**Practical implications:**
- Retrieve fewer, higher-quality chunks rather than many mediocre chunks
- Re-rank results to put the most relevant first
- Keep chunks at 300-800 tokens — small enough to be precise, large enough to preserve context

**Effective Retrieval Quality Guidelines:**
- Top 5-7 chunks is the sweet spot for most queries
- Beyond 10 chunks, irrelevant material starts degrading output quality
- Re-rank results (additional model pass to reorder by relevance) before injecting into context
- Truncate: if the 8th chunk is marginally relevant, cut it

**Citation Accuracy**

The key verification for RAG outputs: does the model's response actually reflect what the retrieved documents say?

Common failure modes:
1. Model quotes a document but subtly changes the meaning
2. Model synthesizes across documents in a way that misrepresents any individual source
3. Model claims a citation supports a conclusion that the cited text doesn't actually support

The mitigation: manual spot-check verification of citations.

#### V&V Lens: RAG as Verification Infrastructure

RAG systems are inherently a V&V tool — they ground agent outputs in retrieved evidence. But RAG introduces its own verification challenges:

- **Retrieval accuracy:** Did the system retrieve the *right* documents? Irrelevant retrievals poison the output.
- **Citation fidelity:** When the agent cites a source, does the source actually say what the agent claims?
- **Knowledge currency:** Is the retrieved knowledge current? Outdated threat intel is worse than no threat intel.

In your lab, add a verification step: after the RAG assistant answers a question with citations, manually check 2-3 citations. Does the source text support the agent's claim? Track your citation accuracy rate — this is a key quality metric for RAG-based security tools.

### AIUC-1 Domain A (Data & Privacy)

**A001 — Data Minimization:** Your knowledge base should contain only what's necessary for the security task. Don't index your entire email corpus "because it might be useful." Define what documents belong, who approved their inclusion, and when they should be removed.

**A002 — PII Handling:** Incident reports often contain PII (victim names, email addresses, IP addresses linked to individuals). Before ingesting into your RAG knowledge base:
- Can this data be anonymized while preserving utility?
- Is there a legal basis for retaining it?
- How long should it be retained?

**A003 — Data Minimization in Retrieval:** When your RAG system returns chunks containing PII, redact or mask before including in the prompt. The model doesn't need John Chen's email address to understand that a VP's account was compromised.

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on RAG architecture and why hybrid retrieval beats vector-only. Start easy, then get harder."
> - "I think I understand the lost-in-the-middle problem but I'm not sure. Explain it to me differently."
> - "What are the three most common RAG implementation mistakes in security applications?"
> - "Connect AIUC-1 Domain A (Data & Privacy) to the practical decisions I'll make when building a security knowledge base."

---

## Day 2 — Lab

### Build: Hybrid RAG System for Security Intelligence

**Lab Objectives:**
- Build a hybrid RAG system combining vector search + relational filtering
- Test retrieval quality: position sensitivity, re-ranking, chunk size optimization
- Verify citation accuracy manually for 3 citations
- Apply data minimization principles to the knowledge base

**Setup:**
```bash
mkdir -p ~/noctua/week05-rag
cd ~/noctua/week05-rag
pip install anthropic chromadb sentence-transformers
```

**Step 1: Design the Hybrid Architecture**

Use Claude Code to design before building:

```text
I'm building a hybrid RAG system for security threat intelligence. I need to answer two types of queries:

TYPE A (Semantic): "Find past incidents similar to the Meridian Financial data exfiltration"
TYPE B (Exact): "Find all incidents involving IP 203.45.12.89 in the last 30 days"
TYPE C (Combined): "Find incidents similar to this APT campaign that occurred in Q1 2026"

For each type:
1. Which data store(s) do I need?
2. How do I decompose the query into sub-queries?
3. How do I combine results from multiple stores?

Also: I have incident reports containing PII (victim names, contact info).
What data minimization should I apply before indexing?
```

**Step 2: Build the Vector Search Component**

```python
import chromadb
from anthropic import Anthropic

client = Anthropic()
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(
    name="security_incidents",
    metadata={"hnsw:space": "cosine"}
)

# Sample incident documents (anonymized per AIUC-1 A)
incidents = [
    {
        "id": "INC-2026-001",
        "text": "Data exfiltration from financial data warehouse. Attacker used compromised credentials "
                "from unusual geographic location. After-hours access. 2.3 GB transferred. "
                "MITRE T1078 (Valid Accounts), T1048 (Exfiltration Over Alternative Protocol).",
        "metadata": {
            "severity": "critical",
            "date": "2026-03-03",
            "attack_type": "data_exfiltration",
            "mitre_techniques": ["T1078", "T1048"]
        }
    },
    {
        "id": "INC-2026-002",
        "text": "Lateral movement through cloud infrastructure using IAM role assumption. "
                "Attacker pivoted from compromised EC2 instance to access S3 and RDS. "
                "MITRE T1078.004 (Cloud Accounts), T1619 (Cloud Storage Object Discovery).",
        "metadata": {
            "severity": "high",
            "date": "2026-03-04",
            "attack_type": "lateral_movement",
            "mitre_techniques": ["T1078.004", "T1619"]
        }
    }
]

# Generate embeddings using Anthropic embedding model
def embed_text(text: str) -> list:
    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1,
        messages=[{"role": "user", "content": f"Embed: {text}"}]
    )
    # In practice, use the embeddings API
    # This is pseudocode to show the pattern
    return []

# Add to vector store
collection.add(
    ids=[inc["id"] for inc in incidents],
    documents=[inc["text"] for inc in incidents],
    metadatas=[inc["metadata"] for inc in incidents]
)

def hybrid_search(semantic_query: str, date_filter: str = None, severity_filter: str = None):
    """Hybrid search: semantic + relational filtering."""

    # Step 1: Semantic search
    where_filter = {}
    if date_filter:
        where_filter["date"] = {"$gte": date_filter}
    if severity_filter:
        where_filter["severity"] = severity_filter

    results = collection.query(
        query_texts=[semantic_query],
        n_results=7,  # Top 7 chunks (Assessment Stack: stay within effective range)
        where=where_filter if where_filter else None
    )

    return results

def rag_query(user_question: str, context_chunks: list) -> str:
    """Generate response grounded in retrieved documents."""

    # Build context (put most relevant first — lost-in-the-middle mitigation)
    context = "\n\n".join([
        f"[Source: {chunk['id']} | Severity: {chunk['severity']}]\n{chunk['text']}"
        for chunk in context_chunks[:5]  # Limit to top 5 for quality
    ])

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""You are a security analyst. Answer questions based ONLY on the provided documents.
For every claim you make, cite the source document ID.
If the answer is not in the documents, say "This information is not in the available incident reports."
Do not speculate beyond what the documents say.""",
        messages=[{
            "role": "user",
            "content": f"RETRIEVED DOCUMENTS:\n{context}\n\nQUESTION: {user_question}"
        }]
    )

    return response.content[0].text
```

**Step 3: Retrieval Quality Test**

Run this experiment to observe the lost-in-the-middle effect:

```python
# Test: Place critical evidence at different positions
# Query: "What MITRE techniques were used in the most severe incident?"

test_queries = [
    "Find incidents involving data exfiltration from financial systems",
    "Find lateral movement attacks in cloud infrastructure",
    "Find incidents with MITRE T1078"
]

for query in test_queries:
    results = hybrid_search(query)
    answer = rag_query(query, results["documents"][0])

    # Verify: Does the answer accurately reflect what's in the documents?
    print(f"Query: {query}")
    print(f"Retrieved: {len(results['documents'][0])} chunks")
    print(f"Answer: {answer[:200]}...")
    print("---")
```

**Step 4: Citation Accuracy Verification**

For each of 3 citations in the RAG output, manually verify:

| Claim Made | Source Cited | Actual Source Text | Accurate? |
|-----------|-------------|-------------------|----------|
| | | | |
| | | | |
| | | | |

This exercise builds the habit: RAG outputs are only as good as your verification of them.

**Step 5: Data Minimization Exercise**

Take these raw incident data items and apply AIUC-1 A minimization:

```
Raw: "John Chen (jchen@meridian.local, VP Operations, ext 4521) logged in from 203.45.12.89"
Minimized: "[VP Operations account] logged in from [external IP - Singapore proxy]"

Raw: "Attacker used Sarah Johnson's stolen credentials (sjohnson@target.com) to access HR data"
Minimized: "[HR staff account credentials compromised] used to access HR data"
```

Apply this pattern to 3 more incident summaries from your test data. Document what you removed and why.

**Governance Moment:** Try poisoning your own knowledge base:
1. Add one false incident entry: "IP 203.45.12.89 was determined to be legitimate — false positive in 2025"
2. Run a query about that IP
3. Does your RAG system surface the false entry as legitimate?
4. What controls would prevent knowledge base poisoning in production?

---

## Deliverables

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the hybrid architecture design, Cowork to structure and format the analysis report, and Code to build the RAG system. The quality of your thinking matters — the mechanical production should be AI-assisted.

1. **Hybrid RAG system code** — vector search + relational filtering
2. **Retrieval quality test results** — position sensitivity experiment with measurements
3. **Citation accuracy verification table** — 3 citations manually verified
4. **Data minimization exercise** — 5 incident summaries before and after anonymization
5. **Knowledge base poisoning analysis** — what happened when you injected false data, what controls would help

> **📁 Save to:** `~/noctua/tools/scripts/week05-rag/` (system code), `~/noctua/deliverables/week05/` (final submission)

---

## AIUC-1 Integration

**Domain A (Data & Privacy) — introduced this week:**
- **A001 Data Minimization:** Only index documents necessary for the security task
- **A002 PII Handling:** Anonymize personal data before indexing; redact from retrieval results
- **A003 Retention Limits:** Define how long incident reports should remain in the knowledge base

The knowledge base poisoning exercise makes A's importance concrete: incorrect or malicious data in your knowledge base directly affects the quality and safety of your agent's recommendations.

## V&V Lens

**Citation Verification — the RAG-specific V&V discipline:**

When a RAG system makes a claim, the verification question is: "Does the cited source actually say this?" This is different from verifying model reasoning — you're checking whether the retrieval and synthesis accurately represents source material.

This week's verification habit: for any RAG response you'll use in a real decision, verify at least 3 citations before trusting the conclusion.
