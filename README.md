# AgentForge: AI Security Engineering

**Build-First AI Security — From Prototype to Production**

A year-long graduate-level program where students forge their own agentic security tools using Claude Code, the Claude Agent SDK, and context engineering — then ship them to production.

*Evolved from the original CyberMinds course (2023) for the Agentic Era, 2026*

---

## Course Philosophy

AgentForge is built on four foundational pillars that shape how we teach and practice cybersecurity in the age of AI agents:

### 1. Collaborative Critical Thinking (CCT)

The discipline of structured questioning, evidence-based analysis, and team collaboration applied to AI-augmented security work. This is not just about writing better prompts—it's about building better thinking habits.

The **5 Pillars of CCT**:
- **Evidence-Based Analysis** — Grounding decisions in data and empirical reasoning
- **Inclusive Perspective** — Soliciting diverse viewpoints and challenging groupthink
- **Strategic Connections** — Linking disparate ideas and identifying systemic patterns
- **Adaptive Innovation** — Iterating quickly when faced with ambiguity
- **Ethical Governance** — Ensuring decisions align with organizational values and societal impact

### 2. Ethical AI & Responsible AI

Grounded in the FS-ISAC Responsible AI Principles (2024) and aligned with NIST AI RMF, this pillar has expanded to cover modern AI security threats:
- OWASP Top 10 for Agentic Applications
- MITRE ATLAS (Adversarial Threat Landscape for AI Systems)
- Goal hijacking and prompt injection in multi-agent systems
- AI supply chain security and non-human identity (NHI) governance

### 3. Rapid Prototyping → Production Delivery

What was aspirational in 2023 is now operational. Agentic engineering tools (Claude Code, Agent SDK, worktrees, subagents, MCP servers) make it possible to go from concept to working prototype in a single lab session. Students will build real cybersecurity tools, not mockups.

But prototyping is only half the story. This course teaches the **full delivery pipeline**: rapid prototype → leadership evaluation → production hardening → deployment. When leadership selects a prototype for delivery, students learn to accelerate that prototype into production-ready code — adding observability, security controls, CI/CD, governance gates, and operational runbooks. The goal is not just "build fast" but "build fast, then ship."

This pipeline follows the **Plan-Build-Review** pattern from Jaymin West's Agentic Engineering methodology: plan the architecture with clear specs, build rapidly using Claude Code and agentic workflows, review through structured evaluation — then repeat at production scale when a prototype is selected for delivery.

### 4. Agentic Engineering

The emerging discipline of designing, building, orchestrating, and securing AI agent systems. This course adopts Jaymin West's Agentic Engineering methodology as its delivery framework, built on the **Core Four Pillars** — Prompt, Model, Context, and Tools — and operationalized through patterns that accelerate both prototyping and production delivery:

- **Context Engineering** — Managing context windows, system prompts, memory, and retrieval. Students build personal context libraries that compound across projects.
- **Tool Design** — Defining agent capabilities through MCP servers, structured tool definitions, and the "Pit of Success" principle (make the right thing easy, the wrong thing hard).
- **Orchestration Patterns** — Coordinating multi-agent workflows using orchestrator patterns, expert swarms, and execution topologies suited to the problem.
- **Specs as Source Code** — Treating specifications as executable artifacts that drive agent behavior, not as documentation that drifts from implementation.
- **12 Leverage Points** — A framework for identifying where small changes in agentic systems produce outsized improvements, from AI developer workflows through context management.

---

## What's New in 2026

The cybersecurity and AI landscape has shifted dramatically since the original 2023 CyberMinds course:

- **Context Engineering** has evolved as a discipline. "Prompt engineering" is increasingly dated; the real work is managing context windows, tool definitions, system prompts, memory architectures, and semantic retrieval.

- **The First AI-Orchestrated Cyberattack** was disclosed by Anthropic in September 2025, operating at 80-90% autonomy without human intervention for extended periods. This is no longer theoretical.

- **Mature Security Frameworks** now exist for agentic systems: OWASP Top 10 for Agentic Apps (2026), NIST Cyber AI Profile (December 2025), and MITRE ATLAS cataloging 66 adversarial techniques.

- **Multi-Agent Orchestration** is production-ready. Claude Agent SDK, CrewAI, LangGraph, and AutoGen/AG2 provide mature platforms for building agent teams at scale.

- **Non-Human Identities (NHIs)** outnumber human identities in enterprise systems by an estimated 50:1 ratio, creating new governance and security challenges.

- **Research-Grade Security Tools** now make operational AI security testing feasible in educational and enterprise settings, enabling hands-on assessment, governance, and autonomy control as part of the curriculum.

---

## Course Structure

**Duration:** Two 16-week semesters, 3 credit hours each
**Format:** 70% hands-on labs and projects, 30% theory and frameworks
**Delivery:** In-person labs with asynchronous readings and reflections

### Semester 1: Foundations — CCT, Ethical AI, and Agentic Fundamentals (CSEC 601)

Building the critical thinking and ethical foundation while getting hands-on with agentic tools from Week 1.

| Unit | Weeks | Focus Area | Key Outcomes |
|------|-------|-----------|--------------|
| **Unit 1: CCT Foundations & AI Landscape** | 1-4 | Critical thinking frameworks, cognitive biases, the CCT 5 Pillars, modern AI landscape | Apply CCT to real security decisions; understand the evolution from LLMs to agents |
| **Unit 2: Context Engineering & Tool Design** | 5-8 | Evolution from prompts to context engineering, MCP servers, tool design patterns, structured outputs | Design and implement MCP servers; build context-aware agent systems |
| **Unit 3: Ethical AI & Responsible AI** | 9-12 | NIST AI RMF, OWASP Top 10 for Agentic Apps, bias and fairness, explainability, FS-ISAC Responsible AI Principles applied to agentic systems | Conduct risk assessments; build guardrails into agent systems |
| **Unit 4: Rapid Prototyping with Agentic Tools** | 13-15 | Claude Code, worktrees, subagents, agent teams—building real cybersecurity tools in single lab sessions | Deliver working prototypes of security tools; measure MTTS, MTTP, MTTSol |
| **Week 16: Midyear Project Presentations** | 16 | Team-based rapid prototyping project showcase | Present and defend a functional agentic security system |

### Semester 2: Advanced — Agentic Security Engineering (CSEC 602)

Deep technical work: multi-agent systems, red teaming, adversarial AI, and production deployment patterns.

| Unit | Weeks | Focus Area | Key Outcomes |
|------|-------|-----------|--------------|
| **Unit 5: Multi-Agent Orchestration** | 1-4 | Claude Agent SDK, CrewAI, LangGraph, AutoGen—designing agent teams for security operations | Build and evaluate multi-agent SOC and threat analysis systems |
| **Unit 6: AI Attacker vs. AI Defender** | 5-8 | Red teaming AI agents, prompt injection, goal hijacking, tool misuse, adversarial ML, real-world case studies | Conduct adversarial testing; harden agents against known attack patterns |
| **Unit 7: Production Security Engineering** | 9-12 | AI supply chain security, NHI governance, observability, cost management, deployment patterns | Design secure agent deployments; implement monitoring and audit trails |
| **Unit 8: Capstone Projects** | 13-16 | Full agentic cybersecurity systems—built, tested, red-teamed, and presented | Deliver production-grade security agent system with documentation and threat assessment |

---

## Lab Environment

The lab stack is centered on **Claude Max subscription** capabilities, with multi-vendor exposure for comparative learning.

### Agentic Development Stack
- **Claude Code** — Integrated development environment for agentic engineering
- **Claude Agent SDK** — Building custom multi-agent systems in Python and TypeScript
- **Worktrees, Subagents, Agent Teams** — Parallel development, task delegation, coordinated workflows
- **MCP (Model Context Protocol) Servers** — Connecting agents to external tools, databases, APIs, and security platforms

### AI Red Teaming & Adversarial Testing
- **Garak** (NVIDIA) — LLM vulnerability scanner with 37+ probe modules
- **PyRIT** (Microsoft) — Multi-turn adversarial AI red teaming framework
- **Promptfoo** — Red teaming and evals with OWASP/NIST/MITRE compliance mapping
- **DeepTeam** — 40+ vulnerability types including prompt injection, jailbreaks, PII leakage
- **MASS** — AI deployment security assessment and compliance mapping

### AI Guardrails & Governance
- **NeMo Guardrails** (NVIDIA) — Programmable guardrails for LLM-based systems
- **LlamaFirewall** (Meta) — Agent security with PromptGuard, alignment checks, CodeShield
- **Guardrails AI** — Runtime validation framework with community validators
- **PeaRL** — Policy enforcement and governance for autonomous AI agents
- **Cisco MCP Scanner** — MCP component security evaluation for agent supply chain

### Fairness & Bias Assessment
- **IBM AI Fairness 360** — Bias detection and fairness metrics for ML models
- **Aequitas** (U of Chicago) — Bias and fairness audit toolkit

### Agent Orchestration Frameworks
- **CrewAI** — Role-based multi-agent teams with flexible orchestration
- **LangGraph** — Stateful agent workflows with built-in state machines and persistence
- **AutoGen/AG2** — Multi-agent conversation patterns and hierarchical teams
- **OpenAI Agents SDK** — Cross-platform agent development and analysis

### Infrastructure & DevSecOps Pipeline
- **Docker Desktop** — Local containerization from Day 1; every prototype ships as a container
- **AWS CLI + ECR/ECS** — Container registry and orchestration for cloud-native promotion
- **GitHub CLI (gh)** — PR workflows, CI/CD triggers, branch management, and security scanning
- **Infrastructure as Code** — CloudFormation/Terraform for repeatable, auditable deployments
- **Ollama + Open-Weight Models** — Local model deployment for sensitive security research
- **Python 3.11+** — Primary language
- **Git / GitHub Actions** — Version control, worktrees, automated security gates

---

## Performance Metrics

The five core metrics from the original CyberMinds course remain valid and are now measurable in real-time using agentic tools:

- **MTTS (Mean Time to Strategy)** — How quickly a team identifies the core security problem and strategic approach
- **MTTP (Mean Time to Plan)** — How quickly a validated plan emerges from the strategy
- **MTTSol (Mean Time to Solution)** — How quickly a working solution prototype exists
- **MTTI (Mean Time to Implementation)** — How quickly the solution is hardened and deployed
- **aMTTR (Mean Time to Auto-Remediation)** — How quickly an agent system can detect and remediate security incidents autonomously

Students will track these metrics across lab exercises to quantify how agentic tools and CCT practices accelerate each phase of security engineering.

---

## Repository Structure

```
CyberMinds-2026/
├── README.md                          # This file
├── COURSE-ASSESSMENT.md               # Comparative analysis: 2023 vs. 2026 landscape
│
├── semester-1/
│   ├── SYLLABUS.md                   # Full Semester 1 syllabus with policies
│   ├── weeks/
│   │   ├── week-01.md
│   │   ├── week-02.md
│   │   └── ... through week-16.md
│   └── labs/
│       ├── lab-01-first-agent.md      # Hello World with Claude Agent SDK
│       ├── lab-02-cct-frameworks.md   # Applying CCT to security decisions
│       ├── lab-03-context-engineering.md
│       ├── lab-04-mcp-servers.md
│       └── ... (lab guides for each unit)
│
├── semester-2/
│   ├── SYLLABUS.md                   # Full Semester 2 syllabus with policies
│   ├── weeks/
│   │   ├── week-01.md
│   │   ├── week-02.md
│   │   └── ... through week-16.md
│   └── labs/
│       ├── lab-05-multi-agent-orchestration.md
│       ├── lab-06-prompt-injection-attacks.md
│       ├── lab-07-red-team-exercise.md
│       └── ... (advanced lab guides)
│
├── resources/
│   ├── LAB-SETUP.md                  # Environment setup guide (all platforms)
│   ├── READING-LIST.md               # Updated reading list for 2026
│   ├── FRAMEWORKS.md                 # Reference for security frameworks
│   ├── TOOLS-GUIDE.md                # Setup and comparison of multi-vendor tools
│   └── API-REFERENCE.md              # Claude SDK, CrewAI, LangGraph reference
│
└── original-materials/
    ├── CYBEMINDS-2023-OVERVIEW.md    # Original course philosophy
    └── EVOLUTION.md                  # How the course evolved from 2023 to 2026
```

---

## Prerequisites

Admission to this course requires:

- **Academic Standing:** Graduate level in Computer Science, Cybersecurity, Information Security, or closely related field
- **Programming:** Proficiency in Python (primary language for labs)
- **Cybersecurity Fundamentals:** Understanding of threat models, defense strategies, network security, and incident response
- **Machine Learning Basics:** Familiarity with supervised learning, neural networks, and model evaluation concepts
- **Tools & Platforms:** GitHub account, Git version control, command-line proficiency
- **Software:** Claude Max subscription (provided by the program or required as a course fee)

**Strongly Recommended:**
- Experience with security tools (SIEM, IDS/IPS, vulnerability scanners)
- Exposure to API design and REST architecture
- Basic understanding of software supply chain security

---

## Assessment & Grading

| Component | Weight | Description |
|-----------|--------|-------------|
| Lab Exercises & Participation | 30% | Hands-on labs, code reviews, in-class activities, and engagement |
| Weekly CCT Reflections & Journals | 10% | Reflective writing on critical thinking and decision-making |
| Semester 1 Midyear Project | 20% | Team-based rapid prototype of an agentic security tool |
| Semester 2 Capstone Project | 30% | Full-scale agentic cybersecurity system with threat assessment and deployment guide |
| Peer Reviews & Red Team Exercises | 10% | Constructive feedback on peers' work; adversarial testing of systems |

**Grading Scale:** A (90-100), B (80-89), C (70-79), D (60-69), F (below 60)

**Late Work Policy:** Labs submitted after the deadline receive a 10% penalty per day, up to 3 days. No credit after 3 days without prior arrangement.

---

## Recommended Reading

### Critical Thinking & CCT
- **"Thinking, Fast and Slow"** by Daniel Kahneman — The cognitive science foundation for understanding bias in decision-making
- **"The Art of Thinking Clearly"** by Rolf Dobelli — 99 cognitive biases explained with practical examples
- **"Collaborative Intelligence"** by Dawna Markova and Angie McArthur — Building teams that think better together
- **Carl Sagan's Baloney Detection Kit** (excerpt from *The Demon-Haunted World*) — Skeptical inquiry methods
- **Richard Paul's Critical Thinking Frameworks** — Structured approaches to evaluating arguments and evidence

### Agentic Engineering & AI Systems
- **"Agentic Engineering Book"** by Jaymin West (jayminwest.com/agentic-engineering-book) — Essential reference for this course
- **Anthropic — "Building Agents with the Claude Agent SDK"** (anthropic.com/engineering) — Official SDK documentation and patterns
- **Anthropic — "Effective Context Engineering for AI Agents"** — Managing context windows and semantic retrieval
- **"Designing AI Agents"** (emerging body of work from multiple researchers) — Agent architecture patterns
- **CrewAI Documentation** (docs.crewai.com) — Role-based multi-agent framework
- **LangGraph Documentation** (langchain-ai.github.io/langgraph) — State machines and workflow management

### AI Security & Adversarial Techniques
- **OWASP Top 10 for Agentic Applications (2026)** — Web application security adapted for AI agents
- **NIST AI Risk Management Framework (AI RMF 1.0)** — Governance and risk assessment
- **NIST Cyber AI Profile (December 2025 draft)** — Integrating AI capabilities with cybersecurity
- **MITRE ATLAS — Adversarial Threat Landscape for AI Systems** (atlas.mitre.org) — 66 documented techniques
- **"Adversarial Machine Learning"** by Vorobeychik and Kantarcioglu — Academic foundation for attack strategies
- **Anthropic AI Safety Research** (anthropic.com/research) — Ongoing work on adversarial robustness

### Ethics & Responsible AI
- **"Weapons of Math Destruction"** by Cathy O'Neil — Real-world harms from algorithmic systems
- **"AI Ethics"** by Mark Coeckelbergh — Philosophical and practical frameworks
- **FS-ISAC — "Responsible AI Principles" (2024)** — Industry framework for financial services covering security, explainability, privacy, fairness, validity, and accountability
- **"The Ethics of Artificial Intelligence"** edited by Bostrom and Yudkowsky — Foundational perspectives

### Rapid Prototyping & Agile Methods
- **"Sprint"** by Jake Knapp, John Zeratsky, and Brendan Brown — Time-boxed design and development
- **"The Lean Startup"** by Eric Ries — Build-measure-learn feedback loops

---

## How to Use This Repository

### For Instructors
1. Start with the full syllabi in `semester-1/SYLLABUS.md` and `semester-2/SYLLABUS.md`
2. Review lab guides in the `labs/` directories to understand learning objectives and assessment rubrics
3. Check `resources/LAB-SETUP.md` to prepare your lab environment
4. Distribute weekly readings and labs through your institution's learning management system

### For Students
1. Read this README and the full course syllabus to understand expectations
2. Complete the lab environment setup (`resources/LAB-SETUP.md`) in Week 1
3. Work through weekly readings and labs in sequence
4. Maintain a CCT reflection journal as specified in the assessment guidelines
5. Collaborate with peers on team projects while maintaining academic integrity

### For Security Practitioners
This repository can be adapted for:
- Corporate security team training programs
- Incident response team upskilling
- AI/ML security auditing and testing
- Building internal AI agents for security operations

---

## Communication & Support

- **Office Hours:** [Schedule per syllabus]
- **Discussion Forum:** [GitHub Discussions or institution platform]
- **Emergency Contact:** [Contact information per syllabus]
- **Lab Technical Issues:** Submit an issue with complete error logs and environment details

---

## License

Course materials and curriculum design © 2023-2026. All Rights Reserved.

Students may use materials for educational purposes only. Commercial use, publication, or distribution requires explicit written permission.

---

## Acknowledgments

Developed in collaboration with cybersecurity and AI research communities, informed by:
- Anthropic's work on agentic AI and prompt injection vulnerabilities
- NIST and OWASP contributions to AI security frameworks
- Jaymin West's foundational work in agentic engineering
- Feedback from 2023-2025 course cohorts and industry practitioners

---

## Quick Links

- [Semester 1 Syllabus](semester-1/SYLLABUS.md)
- [Semester 2 Syllabus](semester-2/SYLLABUS.md)
- [Lab Setup Guide](resources/LAB-SETUP.md)
- [Reading List](resources/READING-LIST.md)
- [Security Frameworks Reference](resources/FRAMEWORKS.md)

---

**Last Updated:** March 2026

For questions or feedback, open an issue in this repository.
