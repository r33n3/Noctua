# Noctua: AI Security Engineering

Site: (https://r33n3.github.io/Noctua/)

**Build-First AI Security — From Prototype to Production**

A year-long graduate-level program where students forge their own agentic security tools using Claude Code, the Claude Agent SDK, and context engineering — then ship them to production.

*A graduate-level AI security engineering program for the Agentic Era, 2026*

---

## Getting Started

**Step 1 — Open the course site (your reading layer)**
👉 [https://r33n3.github.io/Noctua/](https://r33n3.github.io/Noctua/) — keep this open throughout the course.

**Step 2 — Clone and mount this repo in Claude Code**
```bash
git clone https://github.com/r33n3/Noctua.git
cd Noctua
claude
```

**Step 3 — Two-screen setup (recommended)**
Course site on one screen, Claude Code on the other. You'll move between them constantly — reading on the site, working through exercises in Claude Code.

**Step 4 — First session**
CLAUDE.md auto-loads when you open the repo in Claude Code. Claude will greet you, ask you to choose an instructor persona and learning style, and orient you to Week 1.

**Step 5 — Returning sessions**
Claude reads your saved progress and picks up exactly where you left off.

---

## Repository Structure

```
docs/              — Student-facing site (GitHub Pages)
course-flow/       — Agent-driven instructional layer (sequencing, hints, gates)
agent/             — Agent behavior: profiles, review modes, policies
student-state/     — Per-student preferences and progress (from templates)
semester-1/weeks/  — Semester 1 content (weeks 1–16)
semester-2/weeks/  — Semester 2 content (units 5–8)
```

See [COURSE-ARCHITECTURE.md](COURSE-ARCHITECTURE.md) for the full two-layer design.
See [course-manifest.yaml](course-manifest.yaml) for the module map.

---

## Course Philosophy

Noctua is built on four foundational pillars that shape how we teach and practice cybersecurity in the age of AI agents:

### 1. Collaborative Critical Thinking (CCT)

The discipline of structured questioning, evidence-based analysis, and team collaboration applied to AI-augmented security work. This is not just about writing better prompts—it's about building better thinking habits.

The **5 Pillars of CCT**:
- **Evidence-Based Analysis** — Grounding decisions in data and empirical reasoning
- **Inclusive Perspective** — Soliciting diverse viewpoints and challenging groupthink
- **Strategic Connections** — Linking disparate ideas and identifying systemic patterns
- **Adaptive Innovation** — Iterating quickly when faced with ambiguity
- **Ethical Governance** — Ensuring decisions align with organizational values and societal impact

### Verification and Validation (V&V) Discipline

Working alongside CCT, V&V Discipline is the practice of confirming that AI-generated findings, recommendations, and outputs are accurate before acting on them. In the agentic era, security professionals must resist two failure modes: blind trust (accepting AI outputs without scrutiny) and blind rejection (dismissing AI capabilities entirely). V&V Discipline provides the middle ground — a systematic approach to verifying AI outputs that scales from simple manual checks to automated verification pipelines.

V&V Discipline has four dimensions that deepen across the course:
- **Output Verification** — Confirming AI claims against independent evidence
- **Calibrated Trust** — Adjusting scrutiny based on output type and consequence
- **Failure Imagination** — Pre-computing the blast radius of acting on wrong information
- **Adversarial Assumption** — Considering whether outputs could be influenced by an attacker

### Using AI to Bridge Expertise Gaps

Security professionals constantly work at the intersection of domains they're not experts in. A SOC analyst investigating a database anomaly needs to think like a DBA. A security engineer writing deployment policies needs to understand Kubernetes. A compliance auditor assessing AI fairness needs to understand statistical metrics.

In this course, you will frequently encounter tasks that require domain knowledge you don't have yet. **This is intentional, and using Claude to fill those gaps is not only permitted — it's a core skill we're teaching.**

When a lab asks you to "think like a database administrator," open Claude Chat and ask: "I'm a security analyst investigating a suspicious query on a customer_accounts table. Help me think about this from a DBA's perspective — what would concern a DBA here? What's normal vs. abnormal for this type of query?" Claude gives you the domain context; you apply the critical thinking.

This isn't a shortcut. It's how modern security practitioners work. The person who can rapidly acquire domain context through AI and combine it with CCT-level scrutiny is more effective than someone who either (a) fakes expertise they don't have, or (b) stops working when they hit a knowledge boundary.

Throughout this course, you'll see **🧠 Domain Assist** callouts in labs where you're likely to need domain knowledge you don't have. These are explicit invitations to use Claude Chat to build that context before proceeding.

### AI-Native Deliverables

Every deliverable in this course should be produced using AI tools. When a lab says "write a report," the expectation is that you use Claude Chat to reason through the content, Cowork to organize and format it, and Claude Code to generate any data, visualizations, or automated components. Manually typing a 2,000-word report from scratch is not the goal — producing a high-quality, well-reasoned deliverable efficiently using your full toolkit is.

This doesn't mean AI does the work for you. It means AI accelerates the mechanical parts (formatting, structure, boilerplate) so you can spend your time on the parts that matter (analysis, judgment, insight, verification). Every deliverable still requires your thinking — but the production process should be AI-augmented.

### 2. Ethical AI & Responsible AI

Grounded in the AIUC-1 Standard — the first security, safety, and reliability standard for AI agents — and aligned with NIST AI RMF, this pillar covers the full spectrum of AI agent security:
- OWASP Top 10 for Agentic Applications
- MITRE ATLAS (Adversarial Threat Landscape for AI Systems)
- Goal hijacking and prompt injection in multi-agent systems
- AI supply chain security and non-human identity (NHI) governance

### 3. Rapid Prototyping → Production Delivery

What was aspirational in 2023 is now operational. Agentic engineering tools (Claude Code, Agent SDK, worktrees, subagents, MCP servers) make it possible to go from concept to working prototype in a single lab session. Students will build real cybersecurity tools, not mockups.

But prototyping is only half the story. This course teaches the **full delivery pipeline**: rapid prototype → leadership evaluation → production hardening → deployment. When leadership selects a prototype for delivery, students learn to accelerate that prototype into production-ready code — adding observability, security controls, CI/CD, governance gates, and operational runbooks. The goal is not just "build fast" but "build fast, then ship."

This pipeline follows the **Think → Spec → Build → Retro** cycle as its delivery framework: think critically about the architecture before writing any spec, produce a formal spec before building, build rapidly using Claude Code and agentic workflows, and run a structured retrospective — then repeat at production scale when a prototype is selected for delivery.

### 4. Agentic Engineering

The emerging discipline of designing, building, orchestrating, and securing AI agent systems. This course applies the **Think → Spec → Build → Retro** development cycle as its delivery framework, powered by four core Claude Code build skills — `/think`, `/spec`, `/worktree-setup`, and `/retro` — plus `/harness-assess` to evaluate whether an environment's controls are actually implemented and enforceable. Harness engineering is the discipline, `/harness-assess` is the review skill, and evaluation harnesses are test artifacts. It is built on the **Core Four Pillars** — Prompt, Model, Context, and Tools — operationalized through patterns that accelerate both prototyping and production delivery:

- **Context Engineering** — Managing context windows, system prompts, memory, and retrieval. Students build personal context libraries that compound across projects.
- **Tool Design** — Defining agent capabilities through MCP servers, structured tool definitions, and the "Pit of Success" principle (make the right thing easy, the wrong thing hard).
- **Orchestration Patterns** — Coordinating multi-agent workflows using orchestrator patterns, expert swarms, and execution topologies suited to the problem.
- **Specs as Source Code** — Treating specifications as executable artifacts that drive agent behavior, not as documentation that drifts from implementation.
- **12 Leverage Points** — A framework for identifying where small changes in agentic systems produce outsized improvements, from AI developer workflows through context management.
- **Tool Selection Discipline** — Matching the right tool to the right cognitive task. Claude Chat (with `/think`) for analysis and reasoning, Cowork for documentation and deliverables, Claude Code for building and engineering. This mirrors how security professionals work: you don't analyze an incident in your IDE, and you don't write production code in a chat window. Learning when to switch tools is a core agentic engineering skill.

---

## What's New in 2026

The cybersecurity and AI landscape has shifted dramatically since 2023:

- **Context Engineering** has evolved as a discipline. "Prompt engineering" is increasingly dated; the real work is managing context windows, tool definitions, system prompts, memory architectures, and semantic retrieval.

- **The first reported AI-orchestrated cyber espionage campaign** (Anthropic, November 2025) saw a Chinese state-sponsored group (GTG-1002) use Claude Code to autonomously conduct reconnaissance, credential harvesting, and data exfiltration against ~30 targets, operating at 80–90% autonomy without human intervention. This is no longer theoretical.

- **Mature Security Frameworks** now exist for agentic systems: OWASP Top 10 for Agentic Apps (2026), NIST Cyber AI Profile (December 2025), and MITRE ATLAS cataloging 15 tactics and 66 techniques (including 46 sub-techniques, as of the October 2025 update; the framework is actively evolving).

- **Multi-Agent Orchestration** is production-ready. Claude Agent SDK, CrewAI, LangGraph, and AutoGen/AG2 provide mature platforms for building agent teams at scale.

- **Non-Human Identities (NHIs)** outnumber human identities by ratios typically ranging from 25:1 to over 100:1, with some environments exceeding 500:1 (ManageEngine, 2026; Silverfort, 2025; Entro, 2025), creating new governance and security challenges.

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
| **Unit 1: CCT Foundations & AI Landscape** | 1-4 | Critical thinking frameworks, cognitive biases, the CCT 5 Pillars, V&V Discipline, modern AI landscape | Apply CCT and V&V Discipline to real security decisions; understand the evolution from LLMs to agents |
| **Unit 2: Context Engineering & Tool Design** | 5-8 | Evolution from prompts to context engineering, MCP servers, tool design patterns, structured outputs | Design and implement MCP servers; build context-aware agent systems |
| **Unit 3: Ethical AI & Responsible AI** | 9-12 | NIST AI RMF, OWASP Top 10 for Agentic Apps, bias and fairness, explainability, AIUC-1 Standard applied to agentic systems | Conduct risk assessments using AIUC-1 domains; build guardrails into agent systems; map controls to AIUC-1 requirements |
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

The five core performance metrics remain valid and are now measurable in real-time using agentic tools:

- **MTTS (Mean Time to Strategy)** — How quickly a team identifies the core security problem and strategic approach
- **MTTP (Mean Time to Plan)** — How quickly a validated plan emerges from the strategy
- **MTTSol (Mean Time to Solution)** — How quickly a working solution prototype exists
- **MTTI (Mean Time to Implementation)** — How quickly the solution is hardened and deployed
- **aMTTR (Mean Time to Auto-Remediation)** — How quickly an agent system can detect and remediate security incidents autonomously

Students will track these metrics across lab exercises to quantify how agentic tools and CCT practices accelerate each phase of security engineering.

---

## Repository Structure

```
Noctua/
├── README.md                          # This file
├── COURSE-ASSESSMENT.md               # Comparative analysis: 2023 vs. 2026 landscape
│
├── docs/                              # GitHub Pages site — PRIMARY COURSE CONTENT
│   ├── index.html                     # Course home page
│   ├── semester1.html                 # Semester 1 overview
│   ├── semester2.html                 # Semester 2 overview
│   ├── labs.css                       # Shared stylesheet for all lab pages
│   ├── labs.js                        # Shared JS (quizzes, progress tracking, sidebar)
│   │
│   ├── lab-s1-unit1.html             # Unit 1 lab guide: CCT Foundations & AI Landscape
│   ├── lab-s1-unit2.html             # Unit 2 lab guide: Context Engineering & Tool Design
│   ├── lab-s1-unit3.html             # Unit 3 lab guide: Ethical AI & Responsible AI
│   ├── lab-s1-unit4.html             # Unit 4 lab guide: Rapid Prototyping
│   ├── lab-s2-unit5.html             # Unit 5 lab guide: Multi-Agent Orchestration
│   ├── lab-s2-unit6.html             # Unit 6 lab guide: AI Attacker vs. AI Defender
│   ├── lab-s2-unit7.html             # Unit 7 lab guide: Production Security Engineering
│   ├── lab-s2-unit8.html             # Unit 8 lab guide: Capstone Projects
│   │
│   ├── s1-unit[1-4].html             # Semester 1 theory/lecture pages (Units 1–4)
│   ├── s2-unit[5-8].html             # Semester 2 theory/lecture pages (Units 5–8)
│   │
│   ├── assessment.html               # Assessment guide
│   ├── frameworks.html               # Security frameworks reference
│   ├── reading.html                  # Reading list
│   └── lab-setup.html                # Lab environment setup guide
│
├── semester-1/
│   ├── SYLLABUS.md                   # Full Semester 1 syllabus with policies
│   └── weeks/
│       ├── week-01.md through week-16.md   # Weekly content (aligned to HTML)
│
├── semester-2/
│   ├── SYLLABUS.md                   # Full Semester 2 syllabus with policies
│   └── weeks/
│       ├── unit-5.md through unit-8.md     # Unit content (aligned to HTML)
│
├── resources/                         # Reference materials
│
└── original-materials/
    ├── CYBEMINDS-2023-OVERVIEW.md    # Original course philosophy
    └── EVOLUTION.md                  # How the course evolved from 2023 to 2026
```

> **Note:** The `docs/lab-s[1-2]-unit[N].html` files are the canonical course content. The Markdown week files in `semester-1/weeks/` and `semester-2/weeks/` are supporting content aligned to the HTML. When HTML and Markdown conflict, HTML is correct.

---

## Prerequisites

Admission to this course requires:

- **Academic Standing:** Graduate level in Computer Science, Cybersecurity, Information Security, or closely related field
- **Programming:** Proficiency in Python (primary language for labs)
- **Cybersecurity Fundamentals:** Understanding of threat models, defense strategies, network security, and incident response
- **Machine Learning Basics:** Familiarity with supervised learning, neural networks, and model evaluation concepts
- **Tools & Platforms:** GitHub account, Git version control, command-line proficiency
- **Software:** Claude Max subscription (provided by the program or required as a course fee)

**Required Platform Access (provided through course fees or institutional licensing):**
- **Claude Max subscription** — Primary platform for Chat, Cowork, and Claude Code
- **OpenAI Platform account** — API access for model comparison and multi-model evaluation
- **AWS Academy or lab account** — For running open-source models (Ollama/vLLM) and production deployment labs (Unit 7)

**Required Hardware (student-provided laptop):**
- Minimum: 8GB RAM, 4-core CPU, 50GB free storage
- Recommended: 16GB RAM, Apple Silicon (M2+) or NVIDIA GPU, 100GB free storage
- Note: Students with machines below recommended specs will use AWS for model hosting. The course provides cloud credits for this purpose.

**Required Software:**
- Claude Code CLI (installation guide in LAB-SETUP.md)
- Python 3.10+ with pip
- Git and GitHub account
- Docker Desktop (for containerization labs in Unit 7)
- VS Code or equivalent IDE
- Ollama (optional — for local open-source model hosting; AWS alternative provided)

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
- **"The 5 Habits of Mind Framework"** by Seth Jaeger, EdD — The foundational framework the course's CCT 5 Pillars are built on. Jaeger's habits (Evidence, Perspective, Connections, Supposition, Significance) are the direct source of the course's five pillars. [sethjaeger.com](https://www.sethjaeger.com/p/the-5-habits-of-mind-framework-for.html)
- **"Thinking, Fast and Slow"** by Daniel Kahneman — The cognitive science foundation for understanding bias in decision-making
- **"The Art of Thinking Clearly"** by Rolf Dobelli — 99 cognitive biases explained with practical examples
- **"Collaborative Intelligence"** by Dawna Markova and Angie McArthur — Building teams that think better together
- **Carl Sagan's Baloney Detection Kit** (excerpt from *The Demon-Haunted World*) — Skeptical inquiry methods
- **Richard Paul's Critical Thinking Frameworks** — Structured approaches to evaluating arguments and evidence

### Agentic Engineering & AI Systems
- **"Agentic Engineering Book"** by Jaymin West (jayminwest.com/agentic-engineering-book) — Additional reading — original source for many agentic engineering patterns used in this course.
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
- **AIUC-1 Standard** (https://www.aiuc-1.com/) — The first security, safety, and reliability standard for AI agents, covering six domains: Data & Privacy, Security, Safety, Reliability, Accountability, and Society. Operationalizes NIST AI RMF, ISO 42001, MITRE ATLAS, and OWASP LLM Top 10 into auditable controls with third-party certification.
- **"The Ethics of Artificial Intelligence"** edited by Bostrom and Yudkowsky — Foundational perspectives

### Rapid Prototyping & Agile Methods
- **"Sprint"** by Jake Knapp, John Zeratsky, and Brendan Brown — Time-boxed design and development
- **"The Lean Startup"** by Eric Ries — Build-measure-learn feedback loops

---

## How to Use This Repository

### For Instructors
1. Start with the full syllabi in `semester-1/SYLLABUS.md` and `semester-2/SYLLABUS.md`
2. Review lab guides in the `labs/` directories to understand learning objectives and assessment rubrics
3. Check `docs/lab-setup.html` to prepare your lab environment
4. Distribute weekly readings and labs through your institution's learning management system

### For Students
1. Read this README and the full course syllabus to understand expectations
2. Complete the lab environment setup (`docs/lab-setup.html`) in Week 1
3. Work through weekly readings and labs in sequence
4. Maintain a CCT reflection journal as specified in the assessment guidelines
5. Collaborate with peers on team projects while maintaining academic integrity
6. **Use Claude Chat as a study partner** throughout the course. Don't just use it during labs — use it to quiz yourself on concepts, explore topics that interest you, test your understanding before exams, and dig deeper into areas where you want more expertise. Upload course readings and ask Claude to quiz you. Ask it to explain concepts you're struggling with from a different angle. Challenge it when you disagree. This is active learning, not passive consumption.

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
- [Lab Setup Guide](docs/lab-setup.html)
- [Reading List](docs/reading.html)
- [Security Frameworks Reference](docs/frameworks.html)

---

**Last Updated:** April 2026

For questions or feedback, open an issue in this repository.
