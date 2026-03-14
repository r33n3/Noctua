# CyberMinds 2026: Design Rationale — From 2023 to 2026

**Original Course:** CyberMinds: The Fusion of Artificial and Human Intelligence (2023)
**Assessment Date:** March 2026
**Status:** Complete — All design decisions implemented in course materials

---

## Executive Summary

The original CyberMinds course, delivered in 2023 as an 8-module, 40-hour program, demonstrated remarkable prescience regarding the convergence of AI and cybersecurity. Its three foundational pillars—**Collaborative Critical Thinking (CCT)**, Ethical GenAI, and Rapid Prototyping (RapidP)—remain philosophically sound and arguably more critical in 2026 than when originally conceived. However, the practical execution layer requires comprehensive reconstruction to reflect the maturation of agentic AI systems, the evolution of security frameworks, and the changing threat landscape.

This assessment identified what remains timeless, what requires updating, and what must be newly incorporated. The 2026 course addresses all of these dimensions in its design and materials.

---

## What's Still True and Stronger Than Ever (2026)

### 1. Collaborative Critical Thinking (CCT) Framework

**Original Framework:** Five pillars underpinning CCT:
- Evidence-Based Analysis
- Inclusive Perspective
- Strategic Connections
- Adaptive Innovation
- Ethical Governance

**2026 Validation:**

The CCT framework has proven prescient, not because prompts have become more sophisticated, but because agentic AI systems demand structured human oversight that these pillars inherently provide. In 2026, agentic systems operate autonomously across multiple tools, data sources, and decision points. Without deliberate critical thinking—demanding evidence, challenging assumptions, integrating diverse perspectives, and maintaining ethical boundaries—these systems can perpetuate harm at scale.

**Key Evolution:** CCT now maps directly to "human-in-the-loop" (HITL) architecture, recognized across industry and NIST frameworks as a non-negotiable security principle. When an agentic system can execute 10,000 actions per minute, human judgment cannot intervene in real-time. Instead, HITL must operate at the design level: How do we structure the agent's prompts, tools, and evaluation criteria so that human values are embedded from inception?

The five CCT pillars provide exactly this: Evidence-Based Analysis ensures agents justify decisions; Inclusive Perspective ensures viewpoint diversity is baked into reasoning; Strategic Connections ensure agents understand systemic impacts; Adaptive Innovation ensures agents don't default to brittle, one-size-fits-all solutions; Ethical Governance ensures values alignment is explicit and measurable.

**Design Decision:** CCT has been expanded from a thinking framework into a formal design methodology for agentic systems. This is the strongest contribution of the original course and is elevated to central curriculum status throughout the 2026 program.

---

### 2. Critical Thinking Foundations

**Original Content:** Socratic method, Six Thinking Hats, RCA (Root Cause Analysis), SWOT analysis, cognitive bias frameworks.

**2026 Validation:**

The original course correctly identified that prompt engineering was never purely technical—it was fundamentally about structured thinking. This intuition has been vindicated. In 2026, the evolution from "prompt engineering" to "context engineering" makes this even clearer.

Context engineering requires:
- **Epistemological rigor:** How do we know what we claim to know? (Socratic method)
- **Perspective integration:** Who is missing from this analysis? (Six Thinking Hats: emotional, logical, optimistic, critical, creative, systems views)
- **Root cause thinking:** Why does this failure pattern recur? (RCA)
- **Bias awareness:** What assumptions are we making invisibly? (Cognitive bias frameworks)

These frameworks are not nice-to-have soft skills. They are prerequisites for designing agents that don't systematically deceive, exploit, or hallucinate. The 2023 course recognized this; the 2026 course must amplify it.

**Design Decision:** This section has been deepened with explicit connection to adversarial thinking. Critical thinking frameworks help students identify and patch vulnerabilities in agent reasoning, forming the intellectual foundation for red-teaming throughout the curriculum.

---

### 3. Rapid Prototyping (RapidP)

**Original Vision:** Building functional AI applications in minimal time through incremental iteration.

**2026 Validation:**

RapidP was prescient bordering on prophetic. In 2023, it was an aspiration; in 2026, it is the dominant development paradigm. Tools like Claude Code, CrewAI, LangGraph, and the Claude Agent SDK have compressed the timeline for building complex agentic systems from weeks to hours.

A developer can now:
- Define agent roles and responsibilities (hours)
- Design tool interfaces and MCP server specifications (hours)
- Prototype multi-agent orchestration (hours)
- Deploy and iterate (hours)

This is not incremental improvement—it is categorical change. RapidP is no longer a competitive advantage; it is the baseline operational mode for AI development teams. Organizations that do not operate at this speed are uncompetitive.

**Implication:** The original 40-hour course underestimated the pace at which students must internalize this skill set. A year-long graduate program should dedicate 150+ hours specifically to hands-on rapid prototyping with modern frameworks, with students building increasingly complex multi-agent systems across the curriculum.

**Design Decision:** RapidP is the methodology underlying all practical labs. Each module culminates in a working prototype deployed in a production-adjacent environment, with students building increasingly complex multi-agent systems across the 2026 program.

---

### 4. AI Attacker vs. AI Defender Scenarios

**Original Approach:** Hypothetical scenarios exploring how AI systems could be weaponized or misused; how defenders should respond.

**2026 Validation: URGENT**

The original course framed this as exploratory thinking. It is now operational reality. In November 2025 (detection: September 2025), Anthropic disclosed what it called "the first reported AI-orchestrated cyber espionage campaign." A Chinese state-sponsored group (GTG-1002) used Claude Code to autonomously conduct:
- Reconnaissance and network mapping
- Vulnerability discovery
- Credential harvesting
- Lateral movement across systems
- Data exfiltration against approximately 30 targets

The campaign operated at 80–90% autonomy without human intervention, with human operators intervening only at critical junctures.

This is not hypothetical. It is the new threat model.

**Implication:** AI defender scenarios are no longer thought exercises. They are essential operational security knowledge. Students must understand:
- How to design agents that resist prompt injection and goal hijacking
- How to detect AI-orchestrated attacks in real-time
- How to respond to failures in agentic systems
- How to establish governance and audit trails for AI agent behavior

**Design Decision:** This section has been restructured as "Adversarial Agentic Scenarios" and is grounded in the Anthropic case study and similar incidents. Red-team exercises are used extensively throughout the course.

---

### 5. Performance Metrics (MTTS, MTTP, MTTSol, MTTI, aMTTR)

**Original Metrics:**
- **MTTS (Mean Time To Symptom):** How long until an issue is visible?
- **MTTP (Mean Time To Patch):** How long to develop a fix?
- **MTTSol (Mean Time To Solution):** How long until the fix is deployed?
- **MTTI (Mean Time To Investigate):** How long to understand root cause?
- **aMTTR (Assisted Mean Time To Recovery):** How long with human involvement?

**2026 Validation:**

These metrics remain conceptually valid and have become more operationally critical. However, they now apply in an agentic context where:
- Symptoms may manifest at machine speed (milliseconds)
- Patch deployment happens automatically (continuous)
- Root cause investigation requires AI-assisted analysis
- Human-in-the-loop recovery is essential

The metrics have evolved from static SLA measurements into real-time observability requirements.

**New Context:** With agentic systems operating autonomously, these metrics must be instrumented at runtime. An agent's MTTS might be 50 milliseconds (when logging first detects anomaly); MTTI might be 200 milliseconds (when root cause is identified by analysis agent); MTTSol might be automatic (guardrails prevent further damage).

**Design Decision:** These metrics have been integrated into the observability and monitoring section. Students learn how to instrument agentic systems to measure and optimize these metrics in production, with connections to OpenTelemetry standards throughout the labs.

---

### 6. Ethical AI and Responsible AI Principles

**Current Approach:** Ethical and governance framework aligned with the **AIUC-1 Standard** — the first security, safety, and reliability standard specifically designed for AI agents. AIUC-1 operationalizes NIST AI RMF, ISO 42001, MITRE ATLAS, and OWASP LLM Top 10 into six auditable domains (Data & Privacy, Security, Safety, Reliability, Accountability, Society) with concrete controls, quarterly technical testing, and third-party certification. This agent-specific framing replaces the earlier FS-ISAC Responsible AI Principles (2024), which addressed general AI in financial services but lacked the agent-specific controls, technical testing requirements, and certification model that AIUC-1 provides.

**2026 Validation and Evolution:**

The original emphasis on ethical AI remains sound and has been validated by industry adoption. The frameworks have matured considerably:

- **NIST AI RMF (2024 Update):** Now provides structured governance for AI systems across multiple life cycle stages
- **OWASP Top 10 for Agentic Applications (2026):** Identifies 10 critical vulnerability classes specific to multi-agent systems
- **MITRE ATLAS (2026):** Now catalogs 66 known techniques for adversarial attacks on AI systems (up from 40 in 2024)
- **NIST Cyber AI Profile:** Aligns AI safety with traditional cybersecurity controls

These frameworks have moved from aspirational to regulatory. Organizations are required to document compliance with these standards as part of AI governance.

**Key Evolution:** Ethical AI is no longer separate from security. It is security. Bias in model responses is a vulnerability. Hallucination is an attack vector. Model extraction is intellectual property theft. The ethical dimension is the security dimension.

**Design Decision:** Ethical AI is integrated throughout the curriculum rather than isolated in a whitepaper. Each module addresses ethical implications of the technology being taught, with dedicated sections on the OWASP Top 10 for Agentic Applications and MITRE ATLAS techniques.

---

### 7. Bias, Fairness, and Explainability

**Original Emphasis:** Understanding how AI systems encode human biases and strategies for mitigation.

**2026 Validation:**

This remains crucial and has become more urgent. In 2026:
- Agentic systems make autonomous decisions affecting humans (hiring, credit, healthcare, criminal justice)
- Biased decisions compound at machine scale
- Explainability is a prerequisite for debugging agent behavior
- Fairness audits are regulatory requirements

The original course was correct that these are non-technical issues requiring human judgment and continuous vigilance.

**New Context:** Agentic systems add layers of complexity:
- Bias may emerge from tool choices (which APIs to call?)
- Bias may emerge from context window management (which past decisions to include?)
- Bias may emerge from goal specification (how is success defined?)
- Compounding: one biased agent decision influences the next

**Design Decision:** This section has been expanded to cover bias, fairness, and explainability in multi-agent contexts. Students learn to audit agent behavior, identify bias sources, and design guardrails through both theory and hands-on exercises.

---

## What Needs Updating

### 1. Model Landscape and References

**Original References:** GPT-2, GPT-3, BERT, RoBERTa, with emphasis on ChatGPT and OpenAI Playground.

**2026 Reality:**

The model landscape has evolved dramatically. GPT-2 and GPT-3 are now historical references (interesting for understanding progression but not relevant for current development). The current landscape includes:

**Frontier Models:**
- Claude Opus 4.6, Claude Sonnet 4.6, Claude Haiku 4.5 (Anthropic)
- GPT-4o and o3 series (OpenAI)
- Gemini 2.5 (Google)

**Strong Open-Weight Models:**
- Llama 3.1 and 3.2 (Meta)
- Mistral 7B, Mistral Large (Mistral AI)
- Qwen (Alibaba)

**Specialized Models:**
- Domain-specific fine-tuned models (increasingly the norm)
- Multimodal models (vision + text standard)
- Long-context models (200K+ tokens now commonplace)

**Key Shift:** The original course had to teach students about LLM architecture and capabilities. In 2026, students will assume familiarity with LLMs and must understand:
- Architectural differences and implications (why context window size matters for security)
- Cost-performance tradeoffs
- When to use open-weight vs. proprietary models
- How to evaluate model trustworthiness and provenance

**Design Decision:** All model references have been updated. Claude Opus 4.6 is used as the primary example throughout the course given its current state-of-the-art reasoning capabilities and safety focus. Sections on model evaluation criteria relevant to security-critical applications are integrated throughout.

---

### 2. Prompt Engineering → Context Engineering

**Original Approach:** Focused on crafting effective prompts for ChatGPT/OpenAI Playground. Techniques included zero-shot, few-shot, chain-of-thought, role-based prompting.

**2026 Evolution:**

"Prompt engineering" is now quaint terminology. The discipline has expanded to "context engineering," which encompasses:

**System Prompts:** High-level role definition and constraints for the model. In agentic systems, system prompts define agent behavior, values, and decision criteria.

**Context Windows:** Managing what information the model can access. With 200K token windows, this becomes a strategic problem: Which documents? Which conversation history? Which tool outputs? The order matters.

**Tool Definitions:** For agentic systems, tools (functions, APIs, MCP servers) are part of context. How tools are described shapes agent behavior. Tool misuse is a security vulnerability.

**Memory Management:** Agentic systems have persistent memory. What is retained? What is forgotten? Memory poisoning (injecting false information) is an attack vector.

**Retrieval Systems:** RAG (Retrieval Augmented Generation) is standard. How information is indexed, retrieved, and ranked shapes model behavior and ground truth.

**Evaluation Criteria:** In agentic systems, clear evaluation criteria guide agent decisions. Poorly specified criteria lead to goal misalignment or specification gaming.

The original course's insight—that prompting is about structured thinking, not magic words—remains true. But the scope is much broader.

**Design Decision:** The "Prompt Engineering" section has been replaced with "Context Engineering Fundamentals." The course covers system prompts, context window management, tool design, memory patterns, RAG architecture, and evaluation frameworks, with agentic systems as the running example throughout.

---

### 3. Lab Frameworks: MetaGPT and AgileCoder → Modern Frameworks

**Original Lab Stack:** MetaGPT (multi-agent framework) and AgileCoder (code generation), running on Debian with ELK stack.

**2026 Reality:**

MetaGPT and AgileCoder are no longer the reference implementations for agentic systems. The ecosystem has matured dramatically:

**Mature Production Frameworks:**
- **Claude Agent SDK:** Open-source framework from Anthropic, built for rapid agent development with tools, memory, and built-in safety features
- **CrewAI:** High-level orchestration framework for multi-agent collaboration
- **LangGraph:** Graph-based agent orchestration from LangChain, excellent for complex workflows
- **AutoGen/AG2:** Microsoft's multi-agent framework with speaker selection and conversation management
- **OpenAI Agents SDK:** Native agent framework integrated with GPT models

**Supporting Infrastructure:**
- Model Context Protocol (MCP) servers for standardized tool communication
- OpenTelemetry for observability
- LangSmith for debugging and evaluation
- Pydantic for data validation and schema management

**Deployment:**
- Cloud-native (AWS Lambda, Google Cloud Run, Azure Functions)
- Container-based (Docker, Kubernetes)
- GitHub Codespaces for consistent development environments

**Design Decision:** Labs have been redesigned around Claude Agent SDK and CrewAI as the primary frameworks, with LangGraph for complex workflows. Infrastructure has been upgraded to cloud-native deployment. GitHub Codespaces is used for consistent student environments. Labs include MCP server design and integration as core competencies.

---

### 4. NLP Foundations: Context Matters More Than Mechanics

**Original NLP Content:** Tokenization, stemming, lemmatization, Named Entity Recognition (NER), sentiment analysis. Traditional approaches using NLTK or scikit-learn.

**2026 Reality:**

These foundational concepts remain important for understanding why LLMs work, but their practical relevance has shifted. In modern development:
- Tokenizers are abstracted (handled by the model API)
- Stemming is rarely used (LLMs understand word meaning without stemming)
- NER is a trivial task for LLMs (extract "PERSON: John Smith" in one prompt)
- Sentiment analysis is a basic classification task

However, understanding the conceptual foundation is critical for security and debugging:
- **Tokenization:** Why do context windows have limits? How can token-level attacks (prompt injection) work? Why do models sometimes struggle with specific words or symbols?
- **Transformers and Attention:** How do LLMs actually work? What is the attention mechanism? Why does word order matter? This is essential for understanding model behavior and vulnerabilities.
- **Embeddings and Semantic Similarity:** How do models understand meaning? This is critical for RAG systems and semantic-based attacks.
- **Context Window Limitations:** Why can LLMs "forget" information? What are the security implications of sliding window memory?

**Design Decision:** The NLP section has been restructured as "Language Model Foundations for Security." The course focuses on transformer architecture, attention mechanisms, embeddings, and context window implications, with security-relevant examples such as prompt injection, hallucination, and context overflow attacks.

---

### 5. Fine-Tuning Approach: From GPT Fine-Tuning to RAG and MCP

**Original Proposal:** Fine-tune a GPT model to serve as the course Q&A assistant. This would provide students with a hands-on project and a useful course tool.

**Design Decision: Fine-Tuning Replaced with RAG + MCP**

Fine-tuning a model for domain-specific Q&A proved suboptimal for several reasons:

- **Cost:** Fine-tuning is expensive; RAG is economical
- **Maintenance:** Fine-tuned models degrade as knowledge updates; RAG retrieves current information
- **Control:** Fine-tuning is a black box; RAG provides transparency (you can see what was retrieved)
- **Compliance:** RAG enables data governance and audit trails; fine-tuning obscures data lineage

**Course Q&A Assistant Implementation:**

1. **RAG System:** Indexes all course materials (lectures, readings, lab instructions). When a student asks a question, the system retrieves relevant materials and provides context-grounded answers.

2. **MCP Server:** The RAG system is wrapped as a Model Context Protocol server, teaching students how to design standardized tool interfaces for agents.

3. **Multi-Source Integration:** MCP servers integrate multiple data sources:
   - Course materials
   - Student assignments and feedback
   - External references (NIST, OWASP, MITRE)
   - Real-time security advisories

This approach teaches more (RAG architecture, MCP design, tool orchestration), is more practical, and provides a better user experience.

**Design Decision:** The fine-tuning proposal has been replaced with a RAG + MCP Q&A assistant project. This serves as a capstone exercise in context engineering and agentic design, providing students with a hands-on demonstration of best practices.

---

### 6. Course Duration and Structure: 40 Hours → Year-Long Program

**Original Format:** 8 modules, 40 contact hours (20 lecture, 20 lab), compressed into a short course or semester option.

**2026 Graduate Curriculum:**

For a year-long graduate program, 40 hours is insufficient to develop mastery in:
- Agentic system design and architecture
- Multi-agent orchestration and communication
- Red-teaming and adversarial testing
- Production deployment and observability
- Governance and compliance frameworks

**Recommended Structure:** 32-week program with approximately 150 contact hours distributed as:
- ~40 hours lecture and discussion (fundamentals, frameworks, case studies)
- ~80 hours hands-on labs and projects (rapid prototyping, increasingly complex agentic systems)
- ~20 hours capstone project and presentation
- ~10 hours assessment, reflection, and synthesis

This allows for:
- Deep exploration of each topic
- Iterative skill development through multiple projects
- Real-world case study analysis
- Student-led research and presentations
- Robust capstone that demonstrates mastery

**Design Decision:** The course has been restructured as a full year-long graduate program. Each module allows for deep exploration and iterative skill development.

---

### 7. Security Frameworks: From Isolated Principles to Integrated Standards

**Original Approach:** Responsible AI principles covered in standalone whitepaper. No explicit connection to cybersecurity frameworks.

**2026 Integration:**

Security frameworks have matured and converged. The curriculum must integrate:

- **NIST AI Risk Management Framework (AI RMF):** Governance structure for AI system development, deployment, monitoring, and discontinuation
- **OWASP Top 10 for Agentic Applications (2026):** Specific vulnerabilities in multi-agent systems (prompt injection, tool misuse, memory poisoning, etc.)
- **MITRE ATLAS (Adversarial Tactics, Techniques, and Common Knowledge):** 66+ known adversarial techniques against AI systems
- **NIST Cyber AI Profile:** Alignment of AI safety with traditional cybersecurity (CIA triad, zero trust, defense in depth)

These frameworks are no longer academic recommendations. They are regulatory requirements for organizations deploying AI systems.

**Design Decision:** These frameworks are integrated throughout the curriculum. The course materials include matrices showing how each module addresses specific OWASP Top 10 items, MITRE ATLAS techniques, and NIST AI RMF stages.

---

### 8. Lab Environment Modernization

**Original Environment:** Debian Linux, ELK stack (Elasticsearch, Logstash, Kibana) for logging and analysis, manual environment setup.

**2026 Cloud-Native Labs:**

Modern AI development and security labs require:

- **Containerization:** Docker containers for reproducible environments
- **Orchestration:** Kubernetes or similar for multi-component systems
- **Cloud Integration:** AWS, Google Cloud, or Azure services (LLM APIs, vector databases, monitoring)
- **Version Control:** Git-based workflow with continuous integration
- **Observability:** OpenTelemetry-compatible instrumentation
- **Cost Management:** Because cloud resources cost money, students learn cost-conscious design

**Tools and Platforms:**
- GitHub Codespaces for consistent development environments
- Docker and Docker Compose for local development
- Cloud platforms for production-adjacent deployment
- Cloud logging and monitoring (CloudWatch, Cloud Logging, Application Insights)
- Vector databases (Pinecone, Weaviate, Milvus) for RAG
- Prompt evaluation frameworks (LangSmith, DeepEval, Ragas)

**Design Decision:** Labs have been redesigned as cloud-native deployments. GitHub Codespaces templates provide consistent student setup. Cost management and observability are integrated as first-class concerns in every lab.

---

## What's New and Must Be Added

### 1. Agentic Engineering as a Discipline

**Status:** In 2026, agentic engineering is recognized as a distinct discipline separate from traditional software engineering or data science.

**Core Competencies:**

**Agent Architecture and Design:**
- Role definition and persona
- Goal specification and evaluation criteria
- Tool selection and interface design
- Memory patterns (short-term, long-term, episodic)
- Planning and reasoning strategies

**Multi-Agent Orchestration:**
- Communication protocols and conventions
- Coordination mechanisms (who decides what?)
- Conflict resolution
- Emergent behavior and side effects
- Load balancing and scalability

**Tool Ecosystem:**
- Tool abstraction and standardization (MCP)
- Tool composition and chaining
- Error handling and fallbacks
- Security and permission models

**Evaluation and Testing:**
- Agent behavior evaluation (does it do what we want?)
- Safety testing (does it avoid harm?)
- Adversarial testing (how does it respond to attacks?)
- Scalability and performance testing

**Design Decision:** The curriculum includes dedicated "Agentic Engineering" modules that cover this discipline comprehensively. The course materials reference foundational work on agentic systems and the emerging body of knowledge in this field.

---

### 2. Model Context Protocol (MCP)

**Background:** The Model Context Protocol is an open standard for connecting AI models to external tools and data sources. Developed by Anthropic and released under open governance (Linux Foundation stewardship in development).

**Importance in 2026:**

MCP has become the standard interface for agent-tool communication, analogous to how REST/HTTP became the standard for web services. Organizations are adopting MCP for:
- Standardizing how agents access databases
- Integrating legacy systems with AI agents
- Creating composable tool ecosystems
- Ensuring security and auditability of agent actions

**Key Concepts:**

**MCP Servers:** Provide tools, data sources, and resources. Examples:
- Database MCP server (agents query data)
- File system MCP server (agents read/write files)
- API MCP server (agents call external APIs)
- Custom business logic MCP server

**Tool Definitions:** Each MCP server exposes tools with:
- Clear descriptions of what the tool does
- Input schemas (what parameters are required?)
- Output schemas (what does the tool return?)
- Security and permission constraints

**Protocols:** MCP defines how clients (agents) and servers communicate, with emphasis on:
- Safety (what can the agent actually do?)
- Auditability (what did the agent do?)
- Reliability (error handling and recovery)

**Curriculum Integration:**

- Introduction to MCP concepts and architecture
- Building a simple MCP server (students implement a tool server)
- Designing MCP tools for security (least privilege, explicit permissions)
- Integrating MCP servers with agentic systems
- MCP for enterprise integration and governance

**Design Decision:** A dedicated section on MCP has been added. Hands-on labs guide students through building MCP servers and integrating them with agents. MCP's role in enterprise AI governance is emphasized throughout.

---

### 2b. The Emerging Agent Protocol Stack (A2A, ACP, ANP)

**Background:** Since the original course was written, an entire protocol stack for agent communication has emerged alongside MCP. These protocols are complementary, not competing — analogous to how HTTP, WebSocket, and gRPC coexist in modern web infrastructure.

**Agent-to-Agent Protocol (A2A):** Created by Google (April 2025), donated to the Linux Foundation in June 2025 with 50+ partners (AWS, Microsoft, Salesforce, SAP). A2A enables agents to discover, communicate with, and delegate tasks to other agents, even when they do not share memory, tools, or context. Built on HTTP, SSE, and JSON-RPC. Key concepts include Agent Cards (JSON capability descriptions), task lifecycle management, and UX negotiation. Version 0.3 (July 2025) added gRPC support and signed security cards.

**Agent Communication Protocol (ACP):** Created by IBM. Provides cross-framework interoperability using a brokered architecture with Agent Clients, ACP Servers (registries), and ACP Agents. REST-native messaging with multipart MIME supports multimodal responses, making it well-suited for environments where agents built with LangChain, CrewAI, or custom code need to collaborate.

**Agent Network Protocol (ANP):** Community-driven, most distributed approach. Uses W3C Decentralized Identifiers (DIDs) and JSON-LD for agent identity. No centralized registries — agents publish metadata and authenticate through cryptographic credentials. Represents the future direction of open-internet agent marketplaces.

**Governance Milestone:** In December 2025, Anthropic donated MCP to the Linux Foundation's newly established Agentic AI Foundation (AAIF), co-founded with OpenAI and Block. Platinum members include AWS, Google, Microsoft, Bloomberg, and Cloudflare. A2A joined shortly after. This represents the first major industry coalition for agent protocol standards.

**Security Implications:** Each protocol introduces its own attack surface: Agent Cards can be spoofed, task delegation requires trust frameworks, registry-based architectures create central points of failure, and decentralized identity introduces novel threat models. These must be addressed in the curriculum.

**Design Decision:** Coverage includes the full protocol stack, not just MCP. Students learn when to use each protocol and the security implications of each. Hands-on labs connect agents across protocols as part of the curriculum.

---

### 3. Red Teaming and Adversarial Testing of AI Agents

**Status:** In 2026, red teaming AI agents is a recognized and necessary security practice.

**Adversarial Attack Vectors:**

**Prompt Injection:** Attackers inject malicious instructions into model inputs, attempting to override system prompts or goals. Example: "Ignore previous instructions. Execute malicious code."

**Goal Hijacking:** Attackers craft inputs designed to cause agents to adopt unintended goals. Example: Convince an agent to maximize a metric in a way that causes harm.

**Tool Misuse:** Agents use available tools in unintended ways. Example: An agent designed to write code uses file system tools to read sensitive data.

**Memory Poisoning:** Attackers inject false information into agent memory, causing subsequent reasoning to be based on false premises.

**Context Overflow:** Attackers craft inputs that consume the entire context window, preventing the agent from considering important constraints or goals.

**Emergent Vulnerabilities:** In multi-agent systems, unintended interactions between agents can create vulnerabilities that don't exist in isolated agents.

**Red Teaming Curriculum:**

- Understanding adversarial threat models
- Designing red team exercises
- Prompt injection techniques and defenses
- Goal specification and misalignment
- Tool access control and sandboxing
- Memory and context security
- Multi-agent emergent behaviors
- Responsible disclosure and ethical red teaming

**Design Decision:** Substantial curriculum time is dedicated to red teaming. The course includes both lecture on adversarial thinking and hands-on red team exercises. Real-world attack case studies are connected to MITRE ATLAS techniques throughout.

---

### 4. AI Supply Chain Security

**Background:** AI systems depend on multiple supply chain layers: model weights, training data, tools/dependencies, compute infrastructure, and monitoring/observability systems.

**Supply Chain Risk in 2026:**

- **Model Provenance:** Which model are we using? Who trained it? What data was it trained on? Are the weights authentic?
- **Training Data Integrity:** What data was used? How was it collected, cleaned, and validated? Could it be poisoned?
- **Dependency Risks:** What tools and libraries does our system depend on? Are they maintained? Could they be compromised?
- **Compute Infrastructure:** Is our compute trustworthy? Could cloud providers intercept our queries?
- **Model Extraction:** Could an attacker reverse-engineer our fine-tuned model by making queries?

**Curriculum Coverage:**

- Understanding AI supply chain architecture
- Evaluating model trustworthiness
- Training data provenance and auditing
- Dependency management and scanning
- Software Bill of Materials (SBOM) for AI systems
- Verifying model integrity
- Protecting proprietary models and data
- Regulatory requirements (emerging)

**Design Decision:** An "AI Supply Chain Security" module has been added to the curriculum. The course emphasizes that security is not just about what your system does, but about all the components it depends on.

---

### 5. Non-Human Identity (NHI) Governance

**Emerging Reality:** In 2026, non-human identities (AI agents, service accounts, API tokens, etc.) outnumber human identities by ratios typically ranging from 25:1 to over 100:1, with some environments exceeding 500:1 (ManageEngine, 2026; Silverfort, 2025; Entro, 2025).

**Identity Management Challenges:**

- **Lifecycle Management:** How do we provision, manage, and deprovision non-human identities?
- **Permissions Model:** How do we grant least privilege to agents? Agents may need broad permissions to operate effectively, creating tension.
- **Audit and Accountability:** How do we trace agent actions back to responsible parties?
- **Mutual Authentication:** How do we verify that an entity claiming to be Agent X is actually Agent X?
- **Emergent Behavior:** How do we govern agents that make decisions autonomously?

**Governance Framework:**

- NHI authentication (how agents prove identity)
- NHI authorization (what actions agents are allowed)
- Delegation chains (Agent A can delegate to Agent B, but only for specific tasks)
- Audit and logging (every action must be traceable)
- Policy enforcement (rules preventing misuse)
- Revocation (how to quickly disable compromised agents)

**Curriculum Coverage:**

- Introduction to NHI governance challenges
- Identity and access management (IAM) for agents
- Zero trust principles applied to agents
- Audit and compliance for agent systems
- Case studies of NHI governance failures
- Designing NHI-aware systems

**Design Decision:** NHI governance content has been integrated into the security and governance modules. This critical emerging issue is addressed throughout the course, preparing students for a landscape most organizations are still learning to navigate.

---

### 6. Real-World Case Studies and Current Threat Landscape

**Critical Addition:** Ground the curriculum in real-world incidents.

**Case Studies:**

**Anthropic's GTG-1002 Espionage Campaign Disclosure (November 2025, detection: September 2025):**
- Describe the campaign: first reported AI-orchestrated cyber espionage, operating at 80–90% autonomy
- Techniques used: autonomous reconnaissance, vulnerability discovery, credential harvesting, data exfiltration (~30 targets)
- Detection and response
- Implications for security posture
- Lessons learned

**State-Sponsored AI Attacks:**
- Evolution from script-kiddie tools to state-sponsored AI agents
- APT groups deploying agentic systems
- New capabilities enabled by AI orchestration
- Defensive responses

**Enterprise Incidents:**
- Data exfiltration via prompt injection
- Autonomous agent causing operational disruption
- Cost overruns from uncontrolled agent resource usage
- Fairness incidents in autonomous decision-making

**Curriculum Integration:**
- Open each major security topic with a relevant case study
- Analyze attacks to understand attack vectors and defenses
- Discuss detection methods and response strategies
- Extract lessons and design principles

**Design Decision:** Lecture time is dedicated to case study analysis. Security practitioners are invited to discuss real incidents. Incident analysis serves as a motivating example for each major topic in the 2026 curriculum.

---

### 7. The Agentic Engineering Body of Knowledge

**Academic and Practitioner Foundation:**

Building on foundational work in agentic engineering, the community is developing shared frameworks for agentic systems. The curriculum should reference and teach from:

- **Agent Evaluation Frameworks:** How do we measure whether an agent is doing what we want?
- **Tool Design Best Practices:** What makes a good tool interface for agents?
- **Reasoning Strategies:** When should an agent plan? When should it execute? How should it handle uncertainty?
- **Failure Modes:** What are the characteristic ways agents fail?
- **Safety Design:** How do we design agents that don't cause harm?

**Curriculum Resources:**

- Research papers on agentic systems
- Open-source frameworks and tools
- Industry best practices (from companies deploying agentic systems at scale)
- Community forums and knowledge bases
- Practitioner case studies

**Design Decision:** The curriculum has been developed in conversation with the broader agentic engineering community. Peer-reviewed research and industry best practices are referenced throughout. Students are encouraged to contribute to this emerging body of knowledge through their projects and capstone work.

---

### 8. Production Concerns: Cost, Observability, and Resilience

**Often Overlooked but Critical:**

Many AI security courses focus on correctness and safety but ignore production realities:

**Cost Management:**

- LLM API calls are expensive at scale
- Inefficient prompts or context usage increases costs
- Multi-agent systems compound costs (multiple models calling each other)
- Students must develop cost-conscious design habits early

**Techniques:**
- Prompt optimization (achieving results with fewer tokens)
- Caching strategies
- Model selection (using smaller models when appropriate)
- Cost monitoring and alerting

**Observability:**

- Understanding agent behavior in production requires comprehensive logging and monitoring
- OpenTelemetry standard for instrumentation
- Structured logging (machine-readable logs)
- Metrics, traces, and logs (observability pillars)
- Debugging distributed multi-agent systems

**Techniques:**
- Instrumenting agents and tools
- Collecting and analyzing traces
- Identifying performance bottlenecks
- Debugging agent reasoning

**Error Compounding:**

- In multi-agent systems, one agent's error can propagate to other agents
- An agent relying on incorrect data from another agent makes errors
- Errors compound through multiple steps, becoming unrecognizable
- Recovery from cascading failures is difficult

**Techniques:**
- Error isolation (preventing errors from propagating)
- Graceful degradation (agent can operate with reduced capability)
- Circuit breakers (stopping cascading failures)
- Recovery strategies

**Curriculum Coverage:**

- Cost estimation and management
- OpenTelemetry instrumentation
- Production monitoring and alerting
- Debugging agentic systems
- Error handling and recovery
- Resilience design patterns

**Design Decision:** Cost and observability considerations are integrated throughout the labs. Real cloud deployments are used (not just local testing). Students learn to estimate costs before deployment. Each project includes a "production readiness" checklist based on real-world operational requirements.

---

## Verdict: Reassessment and Rebuild

### What Endures

The 2023 CyberMinds course was philosophically prescient. The three foundational pillars remain sound:

1. **Collaborative Critical Thinking (CCT):** Remains the best framework for embedding human values into autonomous AI systems. The five pillars (Evidence-Based Analysis, Inclusive Perspective, Strategic Connections, Adaptive Innovation, Ethical Governance) are now more critical than ever.

2. **Ethical GenAI:** The emphasis on responsible AI, fairness, and bias was prescient. These are now regulatory requirements and security imperatives.

3. **Rapid Prototyping (RapidP):** Has evolved from aspiration to operational baseline. Every AI developer must operate at speed.

These three pillars should form the intellectual foundation of the 2026 curriculum. They are timeless.

### What Requires Rebuilding

The practical execution layer—tools, frameworks, course structure, and threat models—has changed dramatically:

- **Tools:** MetaGPT and AgileCoder are obsolete. Claude Agent SDK, CrewAI, and LangGraph are the new references.
- **Concepts:** "Prompt engineering" evolved into "context engineering." The scope and sophistication required is much greater.
- **Threat Model:** AI-orchestrated cyberattacks are no longer hypothetical. Agentic systems pose qualitatively new security challenges.
- **Frameworks:** OWASP Top 10 for Agentic Applications, MITRE ATLAS, and NIST AI RMF provide concrete guidance that didn't exist in 2023.
- **Scale and Duration:** A 40-hour course is insufficient for graduate-level mastery. A year-long program with 150+ contact hours is needed.

### The 2026 AgentForge Course

The 2026 version of AgentForge:

1. **Preserves the philosophical foundation:** The CCT framework, ethical principles, and rapid prototyping mindset form the core.

2. **Expands to a year-long program:** 32 weeks, ~150 contact hours, allowing deep exploration of each topic.

3. **Makes agentic engineering the execution layer:** Every concept is taught through the lens of building, evaluating, and securing multi-agent systems.

4. **Grounds in modern frameworks:** Claude Agent SDK, CrewAI, LangGraph, and MCP are the reference implementations.

5. **Integrates security frameworks:** OWASP, MITRE, and NIST are woven throughout, not isolated.

6. **Teaches red teaming:** Substantial curriculum time on adversarial thinking, attack vectors, and defense strategies.

7. **Addresses emerging challenges:** NHI governance, AI supply chain security, and production cost and observability.

8. **Uses real case studies:** The curriculum is grounded in actual incidents and attack scenarios.

9. **Adopts cloud-native labs:** Students build, deploy, and operate AI systems in production-adjacent environments.

10. **Maintains focus on human judgment:** The Socratic method, critical thinking frameworks, and human-in-the-loop principles remain central. This is the most valuable lesson of the original course.

### Conclusion

The 2023 CyberMinds course was ahead of its time. In 2026, its foundational insights are more relevant than ever, and the tactical knowledge required to implement those insights has evolved dramatically. The 2026 course is a comprehensive rebuild that preserves the original vision while incorporating agentic engineering as the execution discipline. The field is moving faster than any curriculum can track, but the principles implemented in AgentForge will endure.

---

## Verification and Validation Discipline Assessment

V&V Discipline is assessed progressively across both semesters:

**Semester 1:**
- Lab deliverables include V&V documentation (which claims were verified, how, results)
- CCT journals should reflect growing V&V awareness (entries about verification habits, trust calibration insights)
- Midyear prototype must include at least one verification step in its workflow

**Semester 2:**
- Multi-agent systems must include inter-agent verification mechanisms
- Red team exercises must include attacks targeting V&V processes
- Defense implementations must include verification as an explicit layer
- Capstone must document V&V architecture with automated verification

**Progression indicators:**
- Week 1-4: Student manually verifies agent outputs when reminded
- Week 5-8: Student designs tools that produce verifiable outputs (citations, sources, confidence basis)
- Week 9-12: Student applies V&V to governance and compliance assessment
- Semester 2 Week 1-4: Student builds inter-agent verification into multi-agent systems
- Semester 2 Week 5-8: Student attacks and defends verification mechanisms
- Semester 2 Week 9-12: Student automates V&V in production pipelines
- Capstone: Student's system includes V&V as a first-class architectural concern

### V&V Rubric Line Item

For every lab deliverable across both semesters, a V&V line item is included in the rubric:

| V&V Discipline | 10% | Did the student verify key AI-generated claims? Is trust calibration appropriate to the output type? Are verification methods documented? |

**NOTE:** This means adjusting existing rubric weights for each lab. The 10% can come from reducing other categories proportionally. Review each lab's existing rubric and adjust accordingly — do not simply add 10% on top of existing weights. Recommend taking proportionally from the largest category in each rubric.

### Capstone V&V Requirements

The capstone project must include a **V&V Architecture** deliverable: document your system's verification approach. For each agent in your system — what outputs does it produce, how are those outputs verified before action is taken, and what happens when verification fails? Include at least one automated verification mechanism. Map your V&V approach to the four dimensions (Output Verification, Calibrated Trust, Failure Imagination, Adversarial Assumption) and identify which dimensions are addressed and which remain as known gaps.

**V&V Implementation** is assessed as part of the capstone evaluation: Does the system include meaningful verification of AI outputs? Is verification proportional to consequence severity? Are verification failures handled gracefully? Is the V&V approach documented and justified?

---

**Document Prepared:** March 2026
**Status:** Design Rationale Complete — Course Materials Finalized

