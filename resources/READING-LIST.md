# AgentForge — Reading List and Resources

This reading list is organized into **Core** (required) and **Expanded** (recommended deep-dives) for each topic area. Core readings are assigned weekly; Expanded readings support capstone research and personal exploration.

---

## Critical Thinking and CCT

### Core

- **Thinking, Fast and Slow** by Daniel Kahneman (2011). Cognitive biases and dual-process thinking. Essential for understanding how humans evaluate claims under uncertainty.
- **The Demon-Haunted World** by Carl Sagan (1996). The "Baloney Detection Kit" for evaluating claims and evidence quality. Reference: https://www.themarginalian.org/2014/01/03/baloney-detection-kit-carl-sagan/
- **Asking the Right Questions** by M. Neil Browne and Stuart M. Keeley (10th ed., 2017). Structured methodology for identifying assumptions and evaluating arguments.

### Expanded

- **The Art of Thinking Clearly** by Rolf Dobelli (2013). Practical cognitive bias guide with real-world examples.
- **Collaborative Intelligence** by Dawna Markova and Angie McArthur (2015). Collaborative thinking with diverse perspectives — applicable to team-based security analysis.
- **You Are Not So Smart** by David McRaney (2011). Accessible guide to self-deception and cognitive bias.
- **The Critical Thinking Toolkit** by Foresman, Fosl, and Watson (2015). Pedagogical approaches to teaching critical thinking.
- **Critical Thinking Resources** by Richard Paul and Foundation for Critical Thinking. https://www.criticalthinking.org/

---

## AI Ethics and Responsible AI

### Core

- **FS-ISAC Responsible AI Principles** (FS-ISAC AI Risk Working Group, February 2024). Six principles — security/resiliency, explainability, privacy, fairness, reliability, accountability — for responsible AI in financial services. https://www.fsisac.com/hubfs/Knowledge/AI/FSISAC_ResponsibleAI-Principles.pdf
- **Weapons of Math Destruction** by Cathy O'Neil (2016). Algorithmic decision-making systems that perpetuate bias and discrimination.
- **The Alignment Problem** by Brian Christian (2020). AI alignment challenges: value specification, robustness, and ensuring systems behave according to human intentions.

### Expanded

- **AI Ethics** by Mark Coeckelbergh (2020). Philosophical and practical frameworks for AI governance.
- **The Ethics of Artificial Intelligence and Robotics** edited by Vincent C. Muller (2020). Academic collection on normative issues in AI.
- **Power and Prediction** by Agrawal, Gans, and Goldfarb (2023). Economics of AI decision-making and organizational transformation.
- **Reasoning Models Don't Always Say What They Think** — Anthropic (2025). Demonstrates that reasoning models don't accurately verbalize their reasoning, challenging chain-of-thought monitoring for safety. https://assets.anthropic.com/m/71876fabef0f0ed4/original/reasoning_models_paper.pdf
- **Missing the Mark: Adoption of Watermarking for Generative AI** (March 2025). Low adoption of watermarking in practice and EU AI Act implications. https://arxiv.org/html/2503.18156v3

---

## Agentic Engineering

### Core

- **Agentic Engineering Book** by Jaymin West. The course's core methodology reference for rapid prototyping and production delivery. https://jayminwest.com/agentic-engineering-book
  - *Ch. 1: Foundations & 12 Leverage Points* → Unit 1 (CCT Foundations), Unit 4 (Rapid Prototyping)
  - *Ch. 2: Prompt* → Unit 2 (Context Engineering)
  - *Ch. 3: Model (Selection, Behavior, Limitations)* → Unit 1 (AI Landscape), Unit 6 (Attacker vs. Defender)
  - *Ch. 4: Context (Fundamentals, Strategies, Advanced Patterns)* → Unit 2 (Context Engineering), Unit 5 (Multi-Agent Context)
  - *Ch. 5: Tool Use (Design, Selection, Security, Skills)* → Unit 2 (Tool Design), Unit 7 (Production Security)
  - *Ch. 6: Patterns (Plan-Build-Review, Orchestrator, Expert Swarm, Multi-Agent)* → Unit 4 (Rapid Prototyping), Unit 5 (Multi-Agent Orchestration)
  - *Ch. 7: Practices (Debugging, Evaluation, Cost, Production Concerns)* → Unit 7 (Production Security Engineering)
  - *Ch. 8: Mental Models (Pit of Success, Specs as Source Code, Context as Code)* → Unit 3 (Ethical AI), Unit 4 (Rapid Prototyping), Unit 8 (Capstone)
  - *Ch. 9: Practitioner Toolkit (Claude Code, IDE Integrations)* → Unit 1 (Lab Setup), Unit 4 (Claude Code Deep Dive)
- **Effective Context Engineering for AI Agents** — Anthropic. Context window management, prompt structuring, information architecture. https://anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Building Agents with the Claude Agent SDK** — Anthropic. Agent construction with practical examples. https://anthropic.com/engineering/building-agents-with-the-claude-agent-sdk

### Expanded

- **Building Agentic AI Systems** — Packt Publishing (2025). Production patterns for multi-agent systems.
- **From RAG to Context: A 2025 Year-End Review** — RAGFlow (December 2025). RAG's evolution into broader "Context Engine" patterns. https://ragflow.io/blog/rag-review-2025-from-rag-to-context
- **Context Engineering: A Complete Guide** — CodeConductor (2025). Structured approach to data, knowledge, tools, memory, and structure for LLMs. https://codeconductor.ai/blog/context-engineering

---

## Agentic AI Security — Research Papers

### Core

- **"Agentic AI Security: Threats, Defenses, Evaluation, and Open Challenges"** (arXiv:2510.23883, October 2025). Comprehensive survey of threats to autonomous agent systems. https://arxiv.org/abs/2510.23883
- **"A Survey of Agentic AI and Cybersecurity"** (arXiv:2601.05293, January 2026). Groups security use cases into Autonomous Cyber Defense, Agentic Threat Intelligence, Enterprise Security Automation, and Simulation/Training. https://arxiv.org/html/2601.05293v1
- **"Prompt Injection Attacks on Agentic Coding Assistants"** (arXiv:2601.17548, January 2026). Attack success rates exceeding 85% on Claude Code, Copilot, and Cursor. https://arxiv.org/html/2601.17548v1
- **"Securing Agentic AI: A Comprehensive Threat Model"** (arXiv:2504.19956, April 2025). Nine threats across five domains including cognitive architecture vulnerabilities and governance circumvention. https://arxiv.org/abs/2504.19956

### Expanded

- **"The 2025 AI Agent Index"** (arXiv:2602.17753, February 2026). Documents 30 deployed AI agents with safety features. https://arxiv.org/html/2602.17753v1
- **"Agentic AI as a Cybersecurity Attack Surface"** (arXiv:2602.19555, February 2026). Runtime supply chain vulnerabilities in agentic systems. https://arxiv.org/html/2602.19555v1
- **"The Evolution of Agentic AI in Cybersecurity"** (arXiv:2512.06659, December 2025). Progression from single LLM reasoners to autonomous pipelines. https://arxiv.org/abs/2512.06659
- **"When AI Meets the Web: Prompt Injection in Third-Party AI Chatbot Plugins"** (IEEE S&P 2026). Study of 17 plugins on 10,000+ websites. https://arxiv.org/html/2511.05797v1
- **"Prompt Injection Attacks in LLMs and AI Agent Systems: A Comprehensive Review"** (MDPI, January 2026). Taxonomy of injection techniques, direct jailbreaking, and indirect injection. https://www.mdpi.com/2078-2469/17/1/54

---

## Red Teaming and Adversarial ML

### Core

- **"Red Teaming the Mind of the Machine"** (arXiv:2505.04806, May 2025). 45+ defenses evaluated against adaptive attacks. Roleplay injection achieves 89.6% success rate. https://arxiv.org/html/2505.04806v1
- **"An End-to-End Overview of Red Teaming for LLMs"** (TrustNLP 2025). Comprehensive methodologies, tools, and systematic approaches. https://aclanthology.org/2025.trustnlp-main.23.pdf
- **Adversarial Machine Learning** by Vorobeychik and Kantarcioglu (2022). Foundational evasion, poisoning, and robustness techniques.

### Expanded

- **"M2S: Multi-turn to Single-turn Jailbreak"** (ACL 2025). Consolidating multi-turn attacks into single-turn with 17.5% improvement. https://aclanthology.org/2025.acl-long.805/
- **"Jailbreaking Black Box LLMs in Twenty Queries"** (2025). Efficient black-box jailbreak techniques. https://jailbreaking-llms.github.io/
- **"Jailbreak Attack with Multimodal Virtual Scenario Hypnosis"** (2025). Multimodal attacks achieving 82% success on VLMs. https://www.sciencedirect.com/science/article/abs/pii/S0031320325010520
- **"Jailbreaking LLMs & VLMs: Mechanisms, Evaluation, and Unified Defenses"** (ICLR 2025). Unified framework for text and vision-language model attacks. https://arxiv.org/html/2601.03594v1

---

## AI Supply Chain Security

### Core

- **"Poisoning Attacks on LLMs Require a Near-constant Number of Poison Samples"** — Anthropic (October 2025). 250 poisoned documents can backdoor LLMs of any size. https://arxiv.org/abs/2510.07192
- **"State of MCP Server Security 2025"** — Astrix. Analysis of 5,200+ MCP servers: 88% require credentials, 53% use insecure long-lived secrets. https://astrix.security/learn/blog/state-of-mcp-server-security-2025/
- **"A Security Engineer's Guide to MCP"** — Semgrep (2025). Comprehensive security engineering perspective on MCP. https://semgrep.dev/blog/2025/a-security-engineers-guide-to-mcp/

### Expanded

- **"Securing the AI Supply Chain"** (arXiv:2512.23385, December 2025). Developer-reported security issues in AI projects. https://arxiv.org/html/2512.23385v1
- **"MCPTox: Evaluating Tool Poisoning Attacks in MCP Ecosystems"** (2025). How malicious tool definitions execute unauthorized actions.
- **"Data Poisoning in Training Sets: Hidden Prompts in Code Comments on GitHub"** — Lakera (January 2025). Real-world supply chain attack via GitHub comments. https://www.lakera.ai/blog/training-data-poisoning
- **"Revisiting Backdoor Attacks on LLMs"** (OpenReview 2025). Stealthy poisoning via harmless inputs. https://openreview.net/forum?id=EG6K7ZWOwQ
- **"LLMs May Be More Vulnerable to Data Poisoning Than We Thought"** — Alan Turing Institute (2025). https://www.turing.ac.uk/blog/llms-may-be-more-vulnerable-data-poisoning-we-thought

---

## Governance, Policy, and Compliance Frameworks

### Core

- **NIST Cybersecurity Framework Profile for AI (NIST IR 8596)** — December 2025. Managing AI-related cybersecurity risks. https://nvlpubs.nist.gov/nistpubs/ir/2025/NIST.IR.8596.iprd.pdf
- **OWASP Top 10 for Agentic Applications** — December 2025. First benchmark for agentic security. https://genai.owasp.org/
- **OWASP Top 10 for LLM Applications 2025**. Prompt injection #1 for second consecutive year; five new categories added. https://owasp.org/www-project-top-10-for-large-language-model-applications/
- **MITRE ATLAS** — October 2025 update. 15 tactics, 66 techniques, 14 new agent-specific techniques. https://atlas.mitre.org/
- **NIST AI Risk Management Framework (AI RMF 1.0)**. Governance model for AI risk assessment. https://www.nist.gov/artificial-intelligence

### Expanded

- **AIUC-1: The First AI Agent Standard** — Consortium of 60+ CISOs, founded by former Anthropic security experts with MITRE and Cloud Security Alliance. Six domains: Data & Privacy, Security, Safety, Reliability, Accountability, Society. First accredited auditor: Schellman (2026). https://www.aiuc-1.com/
- **OWASP AI Vulnerability Scoring System (AIVSS)** — Extends CVSS for AI-specific vulnerabilities with 10 core risk categories. Crosswalks to AIUC-1 domains for closed-loop risk management. https://github.com/OWASP/www-project-artificial-intelligence-vulnerability-scoring-system
- **AIUC-AIVSS Crosswalk** — Mapping between AIVSS risk categories and AIUC-1 control domains. https://github.com/OWASP/www-project-artificial-intelligence-vulnerability-scoring-system/blob/main/aiuc-aivss-crosswalk.md
- **EU AI Act Implementation** — Full enforcement August 2, 2026. Quality management, risk management, conformity assessments for high-risk AI. https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- **"The State of Agentic Security and Governance 1.0"** — OWASP GenAI Project (2025). Practical guide to governance for autonomous AI.
- **"Principles for Secure Integration of AI in OT"** — CISA + international agencies (December 2025). Joint guidance for critical infrastructure. https://www.cisa.gov/resources-tools/resources/principles-secure-integration-artificial-intelligence-operational-technology
- **"AI Governance in the Agentic Era"** — IAPP (2025). Governance challenges including Singapore's Model AI Governance Framework.
- **"Frontier AI Risk Management Framework in Practice"** (arXiv:2602.14457, February 2026). Five critical dimensions including cyber offense and self-replication. https://arxiv.org/html/2602.14457v1
- **SAFE-AI: A Framework for Securing AI Systems** — MITRE (2025). https://atlas.mitre.org/pdf-files/SAFEAI_Full_Report.pdf
- **FS-ISAC Navigating Cyber 2025** — Heightened cyber threats in financial sector. https://www.fsisac.com/navigatingcyber2025
- **FS-ISAC Guidance on Generative AI in Financial Services** (2025). 300% increase in AI-generated fraud. https://www.fsisac.com/newsroom/fsisac-releases-guidance-on-the-future-state-of-generative-ai-in-financial-services

---

## Non-Human Identity (NHI) Security

### Core

- **"2025 State of Non-Human Identities Report"** — Entro Security (2025). 97% of NHIs have excessive privileges; long-lived secrets as root cause.
- **"Why Non-Human Identities Are Your Biggest Security Blind Spot in 2026"** — CSO Online (2026). Strategic perspective on NHI risks in the agentic era. https://www.csoonline.com/article/4125156/why-non-human-identities-are-your-biggest-security-blind-spot-in-2026.html

### Expanded

- **OWASP NHI Top 10** — Cloud Security Alliance (June 2025). Standardized NHI security framework.
- **PCI DSS 4.0 NHI Requirements** (March 2025). Updated compliance for NHI management.

---

## AI in Cybersecurity Operations

### Core

- **"Disrupting the First Reported AI-Orchestrated Cyber Espionage"** — Anthropic (September 2025). Real-world agentic cyber attack operating at 80-90% autonomy. https://www.anthropic.com/news/disrupting-AI-espionage
- **"Introducing Aardvark"** — OpenAI (October 2025). Autonomous agent discovering vulnerabilities at scale (92% recall). https://openai.com/index/introducing-aardvark/

### Expanded

- **"Disrupting Malicious Uses of AI"** — OpenAI (October 2025). Identifying and disrupting malicious AI usage. https://openai.com/global-affairs/disrupting-malicious-uses-of-ai-october-2025/
- **"Trusted Access for Cyber: GPT-5.3-Codex"** — OpenAI (February 2026). Identity and trust framework for frontier AI cyber capabilities. https://openai.com/index/trusted-access-for-cyber/
- **"Continuously Hardening ChatGPT Atlas Against Prompt Injection"** — OpenAI (2025). https://openai.com/index/hardening-atlas-against-prompt-injection/
- **"Why SOCs Are Moving Toward Autonomous Security Operations in 2026"** — Help Net Security (February 2026). https://www.helpnetsecurity.com/2026/02/24/socs-autonomous-security-operations-strategies/
- **"Agentic AI: The 2026 Threat Multiplier"** — Barracuda Networks (February 2026). https://blog.barracuda.com/2026/02/27/agentic-ai--the-2026-threat-multiplier-reshaping-cyberattacks
- **"AI Agent Attacks in Q4 2025 Signal New Risks for 2026"** — eSecurity Planet (2026). https://www.esecurityplanet.com/artificial-intelligence/ai-agent-attacks-in-q4-2025-signal-new-risks-for-2026/

---

## Cybersecurity Foundations

### Core

- **The Hacker and the State** by Ben Buchanan (2020). Cyber conflict and geopolitical implications.
- **MITRE ATT&CK Framework**. Adversary tactics and techniques. https://attack.mitre.org/

### Expanded

- **Cybersecurity and Artificial Intelligence** — Springer (Recent Edition). Integrates cybersecurity and AI perspectives.

---

## Rapid Prototyping and Innovation

### Core

- **Sprint** by Jake Knapp, John Zeratsky, and Braden Kowitz (2016). Time-boxed prototyping methodology.
- **The Lean Startup** by Eric Ries (2011). Iterative development and validated learning.

### Expanded

- **Creative Confidence** by Tom Kelley and David Kelley (2013). Fostering innovation in teams.
- **Good Strategy Bad Strategy** by Richard Rumelt (2011). Strategic frameworks for design decisions.

---

## Agent Protocols — Technical Documentation

- **Model Context Protocol (MCP) Specification** — https://modelcontextprotocol.io/
- **Google Agent2Agent Protocol (A2A)** — https://github.com/a2aproject/A2A
- **IBM Agent Communication Protocol (ACP)**
- **Agent Network Protocol (ANP)**
- **"A Survey of Agent Interoperability Protocols: MCP, ACP, A2A, and ANP"** (arXiv:2505.02279, May 2025)
- **"A Survey of AI Agent Protocols"** (arXiv:2504.16736, April 2025)

---

## Framework and Platform Documentation

- **Claude Agent SDK** — https://platform.claude.com/docs/en/agent-sdk/overview
- **CrewAI** — https://docs.crewai.com/
- **LangGraph** — https://langchain-ai.github.io/langgraph/
- **AutoGen/AG2** — https://microsoft.github.io/autogen/
- **Ollama** — https://ollama.ai/
- **Garak** (NVIDIA) — https://github.com/NVIDIA/garak
- **PyRIT** (Microsoft) — https://github.com/Azure/PyRIT
- **Promptfoo** — https://www.promptfoo.dev/
- **NeMo Guardrails** (NVIDIA) — https://github.com/NVIDIA-NeMo/Guardrails
- **LlamaFirewall** (Meta) — https://github.com/meta-llama/llama-firewall
- **Guardrails AI** — https://guardrailsai.com/
- **IBM AI Fairness 360** — https://aif360.readthedocs.io/
- **Aequitas** — https://github.com/dssg/aequitas

---

## Mechanistic Interpretability (Emerging)

- **"Mechanistic Interpretability Named MIT's 2026 Breakthrough Technology"** — MIT Technology Review (January 2026). https://www.technologyreview.com/2026/01/12/1130003/mechanistic-interpretability-ai-research-models-2026-breakthrough-technologies/
- **Gemma Scope 2** — Google DeepMind (2025). Largest open-source interpretability toolkit.
- **"Chain of Thought Monitorability"** — Fabien Roger, Anthropic (2025). Opportunities and fragility of monitoring CoT for safety. https://arxiv.org/pdf/2507.11473

---

## Academic Journals and Conferences

- **Journal of Cybersecurity** — Oxford University Press. https://academic.oup.com/cybersecurity
- **AI and Ethics Journal** — Springer. https://link.springer.com/journal/43681
- **ACM Computing Surveys** — Special issues on AI security and agentic systems
- **IEEE Security & Privacy Magazine** — AI/ML security track
- **IEEE Symposium on Security and Privacy** — https://sp2026.ieee-security.org/
- **USENIX Security Symposium** — Annual adversarial ML and AI security papers
- **NeurIPS, ICML, ICLR, ACL** — Machine learning conferences with growing AI safety tracks

---

## Supplementary Video — AI Engineer YouTube Channel

Conference talks from the [AI Engineer](https://youtube.com/@aiDotEngineer) YouTube channel (260k+ subscribers), curated by topic relevance to course units. All talks are free. The AI Engineer World's Fair and Summit events feature speakers from Anthropic, OpenAI, Google DeepMind, Meta, and leading AI startups.

### Unit 1–2: Foundations, Context Engineering & Tool Design

- **Dex Horthy — "No Vibes Allowed: Solving Hard Problems in Complex Codebases"** (AI Engineer Code Summit, 2025). Advanced context engineering for coding agents — frequent intentional compaction, structured context delivery, handling 300k+ line codebases. https://youtube.com/@aiDotEngineer
- **Dex Horthy — "12-Factor Agents: Patterns of Reliable LLM Applications"** (AI Engineer, 2025). Production patterns for building dependable agents — the 12 engineering principles that separate prototypes from production systems. https://youtube.com/@aiDotEngineer
- **Nico Albanese — "AI SDK Masterclass: Build Your Own Deep Research"** (AI Engineer, 2025). Vercel AI SDK fundamentals + building a Deep Research clone in 30 minutes — demonstrates rapid prototyping methodology. https://youtube.com/@aiDotEngineer

### Unit 4: Rapid Prototyping & Agentic Engineering

- **Anthropic — "Inside the Claude Agents SDK"** (AI Engineer Summit, 2025). The same agent harness that powers Claude Code — structured agent architectures, tool use patterns, subagent delegation. Key insight: "Agents are models using tools in a loop." https://youtube.com/@aiDotEngineer

### Unit 5: Multi-Agent Orchestration

- **AI Engineer World's Fair — Multi-Agent Track** (2025). Multiple talks on agent teams, orchestration patterns, state management, and agent-to-agent communication. Conference featured dedicated tracks on Agent Reliability and SWE-Agents. https://youtube.com/@aiDotEngineer

### Unit 6: AI Attacker vs. AI Defender

- **Simon Willison — "2025 in LLMs, Illustrated by Pelicans on Bicycles"** (AI Engineer World's Fair keynote, 2025). Won Best Speaker trophy. Introduces the **Lethal Trifecta** — when AI agents have access to private data, exposure to untrusted content, and ability to communicate externally, a single poisoned input can exfiltrate data. Uses the GitHub MCP exploit as case study. Essential viewing for understanding prompt injection in agentic systems. https://youtube.com/@aiDotEngineer
- **Leonard Tang (Haize Labs) — "Scaling Judge-Time Compute with Verdict"** (AI Engineer World's Fair, 2025). Why standard evals fail for AI applications. Introduces Verdict — stacked small models that outperform frontier models at evaluation by 10-20% at a fraction of the cost. Directly applicable to red team evaluation pipelines. https://youtube.com/@aiDotEngineer

### Unit 7: Production Security Engineering

- **Abhishek Bhardwaj — "Arrakis: How To Build An AI Sandbox From Scratch"** (AI Engineer, 2025). Why the path to safe AI goes through sandboxes — building secure runtimes for agent code execution with MicroVM isolation, automatic port forwarding, and backtracking. https://youtube.com/@aiDotEngineer
- **Bobby Tiernay & Kam Sween (Auth0) — "Agent Identity and Delegated Access"** (AI Engineer World's Fair, 2025). How agents need clear identity and properly delegated access to act safely — Auth0 AI for dispatching user notifications for approval on sensitive actions. Directly maps to NHI governance. https://youtube.com/@aiDotEngineer
- **AI Engineer World's Fair — Security Track** (2025). Dedicated security track covering MCP security, agent reliability, supply chain risks, and production deployment patterns. https://youtube.com/@aiDotEngineer

### General / Cross-Cutting

- **Swyx — "The Rise of the AI Engineer"** (AI Engineer, 2023-ongoing). The foundational talk defining the AI Engineer role and the "Software 3.0" paradigm — context engineering, tool integration, and the shift from prompt engineering to systems engineering. https://youtube.com/@aiDotEngineer

---

## Online Courses (Supplementary)

- **"AI for Everyone"** by Andrew Ng (Coursera). Broad AI literacy baseline.
- **"Agentic AI Engineering"** specialization (Coursera). Multi-course agent development sequence.
- **DeepLearning.AI Short Courses** — Agents, tool use, multi-agent systems. https://www.deeplearning.ai/

---

## Weekly Reading Schedule

### Semester 1: Foundations

| Week | Topic | Core Reading |
|------|-------|-------------|
| 1 | Threat Landscape | Anthropic — "Disrupting AI-orchestrated cyber espionage" (2025); Course Assessment |
| 2 | Critical Thinking | Kahneman — "Thinking, Fast and Slow" (Ch. 1-7); Sagan — Baloney Detection Kit |
| 3 | AI Fundamentals | Anthropic — Claude Model Card; "Attention Is All You Need" summary |
| 4 | Context Engineering | Anthropic — "Effective Context Engineering for AI Agents" |
| 5 | Agent Protocols | MCP Specification; "A Survey of AI Agent Protocols" (arXiv:2504.16736) |
| 6 | Tool Design & GTG-1002 | Anthropic — "Disrupting the First Reported AI-Orchestrated Cyber Espionage Campaign" Full Report (Nov 2025); West — "Agentic Engineering Book" (tool design) |
| 7 | Cyber Threat Framework | MITRE ATT&CK overview; Buchanan — "The Hacker and the State" (selected) |
| 8 | Risk Management | NIST AI RMF 1.0 overview |
| 9 | Responsible AI | FS-ISAC Responsible AI Principles (full); NIST AI RMF (full) |
| 10 | Agentic Security | OWASP Top 10 for Agentic Apps; "Agentic AI Security" (arXiv:2510.23883) |
| 11 | Bias and Fairness | O'Neil — "Weapons of Math Destruction" (selected); IBM AI Fairness 360 docs |
| 12 | Compliance | EU AI Act summary; NIST Cyber AI Profile (December 2025); AIUC-1 standard (https://www.aiuc-1.com/) |
| 13 | Implementation | Claude Agent SDK (full); West — orchestration patterns chapter |
| 14 | Rapid Prototyping | Knapp et al. — "Sprint" (prototyping chapters) |
| 15 | Integration | OWASP Agentic Top 10 deep review; synthesis |
| 16 | Review | No new reading |

### Semester 2: Advanced

| Week | Topic | Core Reading |
|------|-------|-------------|
| 1 | Multi-Agent Architecture | "Survey of Agentic AI and Cybersecurity" (arXiv:2601.05293); Agent SDK (subagents) |
| 2 | Orchestration Frameworks | CrewAI Documentation (full) |
| 3 | Workflow & State | LangGraph Documentation (full); NIST Incident Response Lifecycle |
| 4 | Evaluation | West — evaluation chapter; Promptfoo Documentation |
| 5 | Threat Landscape | MITRE ATLAS (full); "Prompt Injection on Agentic Coding Assistants" (arXiv:2601.17548) |
| 6 | Red Teaming | "Red Teaming the Mind of the Machine" (arXiv:2505.04806); OWASP Agentic Top 10 (deep) |
| 7 | Defense & Guardrails | NeMo Guardrails docs; LlamaFirewall docs; Guardrails AI docs |
| 8 | Wargame Prep | Buchanan — "The Hacker and the State" (full); PeaRL security research docs |
| 9 | Supply Chain | "State of MCP Server Security 2025"; "Poisoning Attacks on LLMs" (arXiv:2510.07192) |
| 10 | NHI Governance | "2025 State of NHI Report"; Zero Trust for AI (CISA); PeaRL governance docs; AIUC-1 + AIVSS crosswalk |
| 11 | Observability | OpenTelemetry docs (AI observability); NIST IR 8596 monitoring sections |
| 12 | Production Security | Christian — "The Alignment Problem" (deployment chapters); CISA AI guidance |
| 13-16 | Capstone | Directed research aligned with project scope |

---

## Document Information

**Course**: AgentForge Graduate Course
**Academic Year**: 2026
**Last Updated**: March 2026
**Reading List Version**: 3.0 — Restructured into Core/Expanded with September 2025 – March 2026 research
