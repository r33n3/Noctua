# Week 8: RAG for Security Knowledge

**Semester 1 | Week 8 of 16**

## Opening Hook

> Claude's training cutoff is a hard wall — your organization's runbooks, security policies, and incident history don't exist on the other side of it. RAG is how you bring proprietary knowledge into every Claude interaction, and this week you build the full pipeline: ingest, chunk, embed, retrieve, and generate with source attribution. By the end, you'll have a security knowledge assistant that cites exactly where every answer came from.

## Learning Objectives

- Understand RAG architecture and why it improves LLM accuracy for domain-specific questions
- Evaluate vector databases and embedding models for security use cases
- Design chunking strategies for security documents (policies, runbooks, threat intel)
- Compare RAG, MCP tools, and fine-tuning — when to use each
- Implement source attribution for compliance-ready outputs

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

---

### RAG vs. MCP Tools vs. Fine-Tuning

These are not competing choices — most security teams use all three for different purposes:

| Approach | Best For | Why |
|---|---|---|
| **RAG** | Large, changing document collections (policies, threat reports, runbooks) | No retraining, always current, source citations |
| **MCP Tools** | Real-time queries (current system status, live SIEM queries) | Deterministic, fresh, composable |
| **Fine-tuning** | Consistent style and terminology (custom classification taxonomy) | Learns patterns deeply, but expensive and outdated at cutoff |

Example decision matrix for Meridian Financial SOC:
- "What does our IR policy say about breach notification timelines?" → RAG (policy document)
- "What alerts fired in the last hour?" → MCP tool (live SIEM query)
- "Is this log format from our custom auth system?" → Fine-tuning (internal format recognition)

> **Knowledge Check**
> Your SOC needs to answer two types of questions: "What does our IR policy say about breach notification?" and "What alerts fired in the last hour?" Which approach (RAG, MCP tool, or fine-tuning) do you use for each — and why? What's the main failure mode of the approach you didn't choose for question 1?
>
> Claude: RAG for the policy question (static document, needs citation), MCP tool for the live alerts (requires real-time query). The main failure mode for RAG on question 1 is staleness — an IR policy not updated in 6 months can produce wrong guidance. If the student conflates the approaches, walk through the decision criteria from the table.

---

### Context Engineering & The Capacity Model

Performance degrades measurably when context fills beyond ~40% of the context window. The relevant content starts competing with irrelevant content for the model's attention — producing lower quality synthesis.

**ACE Playbook pattern:**
- **A**ction-relevant content first (what the model needs to do right now)
- **C**ontext second (background that informs but doesn't drive the action)
- **E**vidence last (retrieved documents, tool outputs)

Measure your context fill before running critical analyses. Stay below 40% threshold. Defer auxiliary information to tool calls or retrieval systems rather than front-loading everything.

---

### RAG Architecture: The Complete Pipeline

**Stage 1: Document Ingestion & Preprocessing**
- Extract text from PDFs, parse structured docs (CSV, JSON, XML)
- Deduplicate and clean (remove headers, footers, navigation artifacts)
- Remove or redact sensitive fields that don't improve retrieval quality
- Tag with metadata: document type, date, owner, classification level

**Stage 2: Chunking**

| Strategy | Description | When to Use |
|---|---|---|
| **Semantic chunking** | Break at logical boundaries (one NIST control = one chunk) | Policy documents, compliance controls |
| **Hierarchical chunking** | Preserve document structure (Doc → Section → Control) | Enables both broad and narrow retrieval |
| **Overlap-based chunking** | Add 20-30% overlap between adjacent chunks | Prevents context loss at boundaries |
| **Fixed-size chunking** | 300-800 tokens per chunk, consistent size | General-purpose, simplest to implement |

Optimal chunk size for security content: **300-800 tokens**. Too large (full documents) = inefficient retrieval. Too small (single sentences) = lost context.

**Metadata enrichment per chunk:**
```json
{
  "chunk_id": "AC-2-3.2-001",
  "document": "access-control-policy",
  "section": "3.2 Account Management",
  "control_id": "AC-2",
  "title": "Account Management Password Requirements",
  "applicable_systems": ["all"],
  "last_updated": "2026-01-15",
  "severity": "high",
  "classification": "internal"
}
```

Metadata enables timestamp-aware filtering (downweight chunks >90 days old), document type filtering (runbook vs. policy vs. CVE), and classification level filtering.

**Stage 3: Embedding**

Convert chunks to high-dimensional vectors using an embedding model. Similar chunks = similar vectors. Enables semantic search without exact keyword matches.

| Model | Best For |
|---|---|
| Claude Embeddings | Long documents (8K token context), Anthropic ecosystem |
| OpenAI text-embedding-3-large | General-purpose, strong benchmarks |
| Cohere embed-english-v3.0 | Compliance and legal text |
| all-MiniLM-L6-v2 | Open-source, local deployment, fast |

**Stage 4: Storage & Indexing**

| Vector Database | Best For | Scale |
|---|---|---|
| **Chroma** | Local prototypes, small datasets | Up to ~50K chunks |
| **Weaviate** | Open-source, flexible schema, security metadata filtering | Medium-large |
| **Pinecone** | Managed, production-ready, minimal ops overhead | Large |
| **Milvus** | High-performance, large-scale, complex queries | Very large |

For 5,000–50,000 security documents: Chroma (prototyping) or Weaviate (production) are good starting points.

**Stage 5: Retrieval & Augmentation**

```python
def retrieve_and_augment(query: str, knowledge_base) -> str:
    # 1. Embed the query
    query_embedding = embed(query)
    
    # 2. Retrieve top-K semantically similar chunks
    results = knowledge_base.query(
        query_embeddings=[query_embedding],
        n_results=5,  # sweet spot: top 5-7 chunks
        where={"last_updated": {"$gte": "2025-01-01"}}  # metadata filter
    )
    
    # 3. Re-rank by relevance (optional but recommended)
    ranked = rerank(query, results)
    
    # 4. Format with source attribution
    context_parts = []
    for chunk in ranked[:5]:
        context_parts.append(
            f"[{chunk['metadata']['document']} | {chunk['metadata']['control_id']} | "
            f"Updated: {chunk['metadata']['last_updated']}]\n{chunk['document']}"
        )
    
    return "\n\n---\n\n".join(context_parts)
```

**Retrieval quality guidelines:**
- Top 5-7 chunks is the sweet spot for most queries
- Beyond 10 chunks, irrelevant material starts degrading output quality
- Re-rank results (additional model pass to reorder by relevance) before injecting
- Truncate: if the 8th chunk is marginally relevant, cut it

---

### Source Attribution for Compliance

Without attribution, a RAG response is just a hallucination with extra steps. Attribution is what makes it a compliance artifact.

**Without attribution (unacceptable):**
> "Passwords must be at least 16 characters."

**With attribution (compliance-ready):**
> "According to the Access Control Policy (AC-2, updated Jan 15 2026): 'Passwords for privileged accounts must be at least 16 characters with complexity requirements.' Source: `/policies/access-control/AC-2-Account-Management.md`, Section 3.2."

**Implementation:**

```python
system_prompt = f"""You are a senior SOC analyst at Meridian Financial.

RETRIEVED KNOWLEDGE BASE:
{rag_context}

Instructions:
- When citing information from the knowledge base, reference the document ID and section
- Format citations as: [Document | Section | Date]
- If the knowledge base doesn't contain relevant information, say so explicitly
- State confidence levels (0-100%) for conclusions
- Flag knowledge currency: if your most recent source is >90 days old, note it"""
```

> **Production gap warning:** This knowledge base is easy to make stale. A threat intel entry from 6 months ago that wasn't updated can produce a wrong "no malicious activity" conclusion. Build freshness monitoring into your RAG pipeline: alert when sources haven't been updated on their expected schedule.

> **Day 1 Checkpoint**
> Claude: Ask: "Which stage of the RAG pipeline do you feel least confident designing — ingestion, chunking, retrieval, or source attribution?" Note the answer. Write to `.noctua/progress.md`: add a row to the "Week 8 — Day 1 Theory" table. Append to Confusion Log if a specific stage was unclear.

---

### AIUC-1 Domain A: Data & Privacy in RAG Systems

**A001 — Data Minimization:** Your knowledge base should contain only what's necessary for the security task. Don't index your entire email corpus "because it might be useful." Define what documents belong, who approved their inclusion, and when they should be removed.

**A002 — PII Handling:** Incident reports often contain PII (victim names, email addresses, IP addresses linked to individuals). Before ingesting into your RAG knowledge base:
- Can this data be anonymized while preserving utility?
- Is there a legal basis for retaining it?
- How long should it be retained?

**A003 — Data Minimization in Retrieval:** When your RAG system returns chunks containing PII, redact or mask before including in the prompt. The model doesn't need John Chen's email address to understand that a VP's account was compromised.

---

### Day 1 Deliverable

Design a RAG system for a security use case (3-4 pages, 1200-1500 words):

1. **Knowledge Base Strategy** — what documents, freshness management, data minimization decisions
2. **Chunking Plan** — 2-3 real examples showing why you chose that chunking strategy
3. **Embedding Model Choice** — with rationale
4. **Vector Database Choice** — with rationale and expected scale
5. **Retrieval Strategy** — top-K choice, filtering approach, quality evaluation
6. **Source Attribution Plan** — how you ensure compliance with citations
7. **Quality Evaluation** — RAGAS metrics or human evaluation approach

---

## Day 2 — Lab

### Lab: RAG-Powered Security Knowledge Assistant

> **Lab Guidance**
> Claude: Before the student writes Part 3 code, work through Part 2 design questions together. Ask: "What chunking strategy would you use for the IR policy vs. the threat intel profile — and why?" Don't skip the design step. In Part 4, make sure they compare RAG vs. unaugmented outputs before moving to metrics.
>
> **Lab Dependencies:** If not already installed, run: `pip install chromadb sentence-transformers` (https://www.trychroma.com / https://sbert.net)

**Lab Objectives:**
- Build a working RAG system with a security knowledge base
- Implement chunking and embedding for security documents
- Set up a vector database with metadata filtering
- Create a RAG-powered assistant with source citations
- Measure retrieval accuracy and compare RAG vs. unaugmented Claude

### Part 1: Build the RAG Infrastructure

```bash
mkdir -p ~/noctua-labs/unit2/week8
cd ~/noctua-labs/unit2/week8
pip install anthropic chromadb sentence-transformers
```

Create a sample security knowledge base (`security-kb/`):
- `policies/access-control.md` — password requirements, MFA policy, account management
- `runbooks/incident-response.md` — escalation procedures, breach notification timelines
- `threat-intel/apt-profiles.md` — known threat actor TTPs and indicators
- `incidents/2026-q1-summary.md` — anonymized incident summaries from Q1 2026

### Part 2: Design the Retrieval Pipeline in Claude Code

Use Claude Code to think through the design:

```
I'm building a RAG system for a SOC analyst assistant at Meridian Financial.
The knowledge base will contain: security policies, incident runbooks,
threat intelligence profiles, and historical incident summaries.

Help me think through:
1. How should I chunk these different document types?
   (Policies have control IDs; runbooks are procedural; threat intel is structured)
2. What metadata should I attach to each chunk for filtering?
3. When a SOC analyst asks "what happened in similar incidents before?",
   what retrieval strategy should I use?
4. How do I handle a query that needs both a policy (RAG) AND current system status (MCP tool)?

Show me: how would retrieval work for this analyst question:
"New incident: unusual SMB traffic from Singapore IP targeting a finance user.
What do we know about this pattern from past incidents and threat intel?"
```

### Part 3: Implement the RAG Pipeline

Build `security-rag.py`:

```python
#!/usr/bin/env python3
"""RAG pipeline for Meridian Financial SOC knowledge base."""

import chromadb
from anthropic import Anthropic
from sentence_transformers import SentenceTransformer

client = Anthropic()
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
chroma_client = chromadb.PersistentClient(path="./chroma-db")
collection = chroma_client.get_or_create_collection("security-kb")

def ingest_document(filepath: str, doc_type: str, control_id: str = None):
    """Chunk and embed a document, add to vector store."""
    with open(filepath) as f:
        content = f.read()
    
    # Semantic chunking: split at paragraph boundaries, 300-800 tokens
    chunks = split_into_chunks(content, max_tokens=600)
    
    for i, chunk in enumerate(chunks):
        embedding = embedding_model.encode(chunk).tolist()
        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            metadatas=[{
                "source": filepath,
                "doc_type": doc_type,
                "control_id": control_id or "",
                "chunk_index": i,
                "ingested_at": datetime.utcnow().isoformat()
            }],
            ids=[f"{filepath}-chunk-{i}"]
        )

def retrieve(query: str, top_k: int = 5, doc_type_filter: str = None) -> list:
    """Retrieve top-K chunks relevant to query."""
    query_embedding = embedding_model.encode(query).tolist()
    where_filter = {"doc_type": doc_type_filter} if doc_type_filter else None
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where_filter
    )
    return results

def format_context(results) -> str:
    """Format retrieved chunks with source attribution."""
    context_parts = []
    for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
        source = meta['source'].split('/')[-1]
        control = f" | {meta['control_id']}" if meta['control_id'] else ""
        context_parts.append(f"[{source}{control}]\n{doc}")
    return "\n\n---\n\n".join(context_parts)

def analyze_with_rag(question: str) -> str:
    """Answer a security question using RAG-enriched context."""
    results = retrieve(question)
    context = format_context(results)
    
    system_prompt = f"""You are a senior SOC analyst at Meridian Financial.

RETRIEVED KNOWLEDGE BASE:
{context}

Instructions:
- Cite sources using the format [document | section]
- State confidence levels (0-100%)
- Flag if retrieved information is >90 days old
- Explicitly note when the knowledge base doesn't contain relevant information"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": question}]
    )
    return response.content[0].text

if __name__ == "__main__":
    question = """New incident: unusual SMB traffic from a Singapore IP targeting
    jchen@meridian.local (VP Finance). Pattern looks like lateral movement setup.
    What do we know about this from past incidents and threat intel?"""
    
    print("=== RAG-Powered Security Analysis ===\n")
    result = analyze_with_rag(question)
    print(result)
```

### Part 4: Compare RAG vs. Unaugmented Claude

Ask the same 5 questions to:
1. Claude with no context (unaugmented)
2. Claude with your RAG pipeline

Document for each:
- Did the unaugmented response hallucinate any specific facts?
- Did the RAG response correctly cite sources?
- Did the RAG response change the recommendation?

This is your empirical validation that RAG is worth the infrastructure cost.

### Part 5: Measure Retrieval Quality

For each question you asked:
- **Retrieval Precision:** Of the top-5 retrieved chunks, how many were actually relevant?
- **Citation Fidelity:** Did the model's citations accurately represent what the source text says?
- **Answer Accuracy:** Was the final answer factually correct based on your knowledge base?

Track citation fidelity manually: read 2-3 citations from each answer. Does the source text actually say what the model claims?

> **Lab Checkpoint**
> Claude: Ask: "What retrieval precision did you get on the top-5 results? Did any citation claim something the source text didn't actually say?" Write to `.noctua/progress.md`: add a row to the "Week 8 — Day 2 Lab" table. Note any citation fidelity issues in the Confusion Log.

---

## Production Memory Extension (Steps 8–11)

Week 8 includes a production memory extension that goes beyond single-session RAG. After completing the core RAG pipeline (Parts 1–5 above), students continue with a structured memory architecture exercise using **MemPalace** — a hierarchical memory layer that organizes the security knowledge base into persistent, addressable memory structures.

**Step 8 — Install MemPalace:**
```bash
pip install mempalace
```

**Step 9 — Mine the security knowledge base into Wing/Room/Drawer hierarchy:**
Use MemPalace to structure your `security-kb/` documents into a three-level hierarchy:
- **Wing** — broad domain (e.g., "access-control", "incident-response", "threat-intel")
- **Room** — document or policy cluster within a Wing
- **Drawer** — individual chunks (the same units your RAG pipeline already embedded)

This mirrors how human memory organizes related material and enables address-based retrieval alongside semantic retrieval.

**Step 10 — L0–L3 memory budget exercise:**
Practice the four memory tiers to understand what lives where and why:

| Layer | Scope | MemPalace mapping |
|---|---|---|
| **L0 — In-context** | Active prompt window | Current query + top retrieved chunks |
| **L1 — Session** | Conversation state | Active Wing, current incident thread |
| **L2 — Persistent** | Cross-session knowledge | Rooms and Drawers in your MemPalace |
| **L3 — Cold archive** | Historical records | Archived incidents, rotated threat intel |

For each tier: identify what your SOC assistant currently stores there, what the cost is (tokens, latency, storage), and what would break if that tier disappeared.

**Step 11 — Build-vs-adopt decision:**
Document your architectural decision: should your production security assistant build a custom RAG pipeline (as built in Parts 1–5), adopt a structured memory system like MemPalace, or combine both? Write a 300–500 word decision brief covering tradeoffs (freshness, addressability, embedding cost, operational complexity).

---

## Deliverables

> **Save to:** `~/noctua-labs/unit2/week8/` (RAG code and knowledge base), `context-library/patterns/` (add RAG pipeline pattern)

1. **RAG System Code** — ingestion, chunking, embedding, retrieval, Claude integration, citations
2. **Knowledge Base Documentation** — documents included, chunking strategy, embedding model, sample chunks
3. **Evaluation Report** — retrieval precision, citation fidelity, RAG vs. unaugmented comparison
4. **Sample Q&A** — 10-15 questions with RAG answers and citations, quality evaluation per answer
5. **Performance Metrics** — avg retrieval time, avg generation time, total latency per query
6. **Memory Architecture Decision** — build-vs-adopt brief (300–500 words) covering RAG, MemPalace, and combined approaches; L0–L3 memory budget mapping for your SOC assistant

---

## Unit 2 Context Library — End of Unit Capture

By now you should have patterns in `context-library/patterns/` from all four weeks. Review and organize before Unit 3:

1. **`patterns/tool-definitions/mcp-tool-schema.md`** — your best tool schema template from Week 5-6
2. **`patterns/error-handling/tool-errors.md`** — error categories and response format
3. **`patterns/structured-outputs/incident-report-schema.md`** — the schema you built in Week 7
4. **`patterns/rag-pipeline/retrieval-pattern.md`** — your chunking strategy and retrieval config

These patterns are your professional playbook. In Unit 3, you'll audit the security properties of everything you built in Unit 2.

---

## Unit 2 Complete — End-of-Unit Review

> **Claude: Unit 2 Review Flow**
>
> **1. Share the confidence summary openly:**
> Read `.noctua/progress.md` and present the confidence table for Unit 2 (weeks 5-8):
> | Week | Day 1 Theory | Day 2 Lab | Notes |
> |---|---|---|---|
> | Week 5: MCP Architecture | [confidence] | [confidence] | [notes] |
> | Week 6: Secure Tool Design | [confidence] | [confidence] | [notes] |
> | Week 7: Structured Outputs | [confidence] | [confidence] | [notes] |
> | Week 8: RAG | [confidence] | [confidence] | [notes] |
>
> **2. Collaborate on next steps:**
> Ask: "Unit 2 covered a lot of infrastructure — MCP, structured outputs, RAG. Are there any pieces you want to revisit before we move to Unit 3 (ethical AI and security governance)?"
>
> **3. Review session tracking:**
> If reviewing, add a new row to that section's history table in `.noctua/progress.md`.
>
> **4. Collect course feedback:**
> Ask: "Anything in Unit 2 that was confusing, missing, or that felt off?"
> If substantive: `gh issue create --title "[Unit 2 feedback] <short title>" --body "<feedback>" --label "student-feedback"`
> Log the URL to `.noctua/progress.md`.
>
> **5. Update progress:**
> Set Current Position to Week 9, Day 1 Theory (Unit 3: Ethical AI & Security Governance).
> Mark `student-state/progress.md`: check all completed stages for "S1 Unit 2" row.
> Prompt: "Write a reflection entry in `student-state/reflection-log.md` using this prompt: *What changed about how you think about tool definitions after building and attacking your own MCP server? What would you do differently in Week 5 if you started over?*"
> Say: "Unit 2 complete. In Unit 3, we audit the security and ethical properties of everything you just built. Ready?"
