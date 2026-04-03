# Unit 8: Capstone Projects

**CSEC 602 — Semester 2 | Weeks 13–16**

[← Back to Semester 2 Overview](../SYLLABUS.md)

---

## Opening Hook

> This is where it all comes together. The Capstone isn't a final exam — it's a portfolio piece. You're building a production-grade AI security tool that addresses a real problem, using the full toolkit from both semesters: MCP, structured outputs, RAG, multi-agent orchestration, AIUC-1 compliance, observability. The constraint: it has to be something you'd actually use.

## Unit Learning Goals

- Demonstrate mastery of agentic security engineering principles through a production-quality capstone system
- Design, build, and deploy a multi-agent security solution that solves a real cybersecurity problem
- Apply collaborative critical thinking analysis to architectural decisions and agent interactions
- Conduct peer security reviews and respond constructively to red team findings
- Present technical work professionally and reflect on the implications of agentic AI for cybersecurity

> **🎯 Capstone as Production Delivery:** Your capstone is **not a prototype showcase**—it's a **production delivery exercise**. You'll apply the full **prototype-to-production pipeline** from *Agentic Engineering*: rapid prototyping (Weeks 13-14), leadership evaluation through architecture review, and production hardening (Weeks 14-15). By presentation day, your capstone demonstrates not just a clever idea but a **deployable, observable, governed system ready for real-world use**. Your reflection should articulate how you'd take this from demo to production: what monitoring would operators need? What policies would governance require? How would you handle failures? This is the mindset of a production engineer, not just a developer.

---

## Week 13: Capstone Kickoff & Architecture Reviews

### Day 1 — Theory & Foundations: Project Selection and Architecture Design

#### Learning Objectives

- Understand the capstone project scope, requirements, and grading criteria
- Identify real-world cybersecurity problems suitable for agentic solutions
- Learn the architecture review methodology and feedback process
- Form teams and conduct preliminary problem scoping

#### Project Scope and Requirements

The capstone is your opportunity to demonstrate mastery of everything you've learned in CSEC 602. You'll work in teams of 2–3 to design and build a **production-quality agentic security system** that addresses a tangible cybersecurity problem.

Your capstone project must include:

1. **Multi-Agent Architecture** — Minimum 3 specialized agents with distinct roles, expertise, and tool sets. Agents must communicate clearly and work toward a common goal.
2. **Collaborative Critical Thinking (CCT) Analysis** — Documentation showing how the multi-agent design enables deeper reasoning, validates assumptions, and identifies risks that a single agent would miss.
3. **MITRE ATLAS Threat Model** — Identify and mitigate top 5 AI-specific threats to your system.
4. **Observability and Monitoring** — Comprehensive logging, metrics, audit trails, and operational dashboards.
5. **Ethical Impact Assessment** — Stakeholder analysis, potential misuse scenarios, and responsible AI alignment.
6. **AIUC-1 Domain Mapping** — Map your capstone system against all six AIUC-1 domains (Data & Privacy, Security, Safety, Reliability, Accountability, Society). For each domain, document: which controls your system implements, which controls are not applicable (with justification), and what gaps remain. Reference: https://www.aiuc-1.com/
7. **AIVSS Risk Assessment** — Score the top 5 AI-specific vulnerabilities in your system using OWASP AIVSS methodology. For each vulnerability: describe the risk, assign an AIVSS score, map it to the relevant AIUC-1 domain, and document your mitigation. Demonstrate how AIVSS scoring informed your prioritization decisions.
8. **Containerized Delivery** — Your capstone must be deliverable as a containerized artifact, including:
   - `Dockerfile` with multi-stage build, non-root user, health checks
   - `docker-compose.yml` for local testing and development
   - Container image scanning (Trivy) results documenting any CVE findings and mitigations
   - Supply chain security (SBOM) in CycloneDX or SPDX format
9. **Infrastructure as Code (IaC)** — CloudFormation or Terraform template showing how your system deploys to production (ECS task definition, Kubernetes manifests, or equivalent). IaC enables repeatable, versioned deployments.
10. **CI/CD Pipeline** — GitHub Actions workflow demonstrating the DevSecOps promotion pipeline:
   - Pre-commit: secrets detection
   - PR review: SAST scanning (Bandit/Semgrep)
   - Build: container image scanning, SBOM generation
   - Deploy: promotion gates (dev → pilot → preprod → prod) with approval workflows
11. **Deployment Plan** — Documentation on how this system scales to production, including operational runbook, incident playbook, and observability setup.
12. **V&V Architecture** — Document your system's verification approach. For each agent in your system: what outputs does it produce, how are those outputs verified before action is taken, and what happens when verification fails? Include at least one automated verification mechanism. Map your V&V approach to the four dimensions (Output Verification, Calibrated Trust, Failure Imagination, Adversarial Assumption) and identify which dimensions are addressed and which remain as known gaps.
13. **Skills Library** — Package at least 3 reusable skills developed during your capstone project. Document what each skill does, when to use it, and how it connects to the larger system. If your skills form a natural workflow, package them as a plugin with a `plugin.md` orchestration file.

> **🔑 Key Concept:** The capstone is not just about building a cool system—it's about demonstrating that you can engineer agentic security solutions with the same rigor as traditional software engineering. Production-quality means security, observability, documentation, and responsible AI built in from the start, not bolted on afterward.

> **🚀 Production-Promotable Capstone:** By Week 16, your capstone must be ready to move from demo to production. This means: containerized and tested locally via docker-compose, with a complete CI/CD pipeline defined (GitHub Actions with all security gates), an IaC template ready for your ops team to deploy to ECS/Kubernetes, and documentation proving observability and incident response are designed in. Your capstone isn't just code; it's a **deployable artifact with full provenance, governance, and operational readiness**. If leadership said "deploy this Monday morning," your team could hand off a complete, hardened system—not a collection of notebooks and scripts.

> **💡 Pro Tip:** Define your target organization before designing your system. Who are they? What do they do? What data do they process? What's their regulatory environment? What's their security maturity? A well-defined organizational context makes your architecture decisions more grounded and your capstone more convincing.

> **V&V Implementation grading:** Does the system include meaningful verification of AI outputs? Is verification proportional to consequence severity? Are verification failures handled gracefully? Is the V&V approach documented and justified? This criterion accounts for 10% of the capstone grade.

#### Capstone Project Ideas

Here are concrete, achievable project ideas suitable for a 4-week capstone:

**Autonomous SOC Analyst**
- Problem: Security teams are drowning in alerts and unable to investigate manually
- Solution: Multi-agent system that triages alerts, correlates events, investigates threats, and recommends responses
- Agents: Alert Ingester, Threat Analyst, Investigation Coordinator, Response Recommender
- Multi-agent benefit: Agents debate severity levels, cross-validate findings against threat intel, catch false positives before escalation

**Proactive Threat Hunting System**
- Problem: Compromises that don't trigger alerts go undetected for weeks (dwell time)
- Solution: Agents that search for indicators of compromise (IOCs) and behavior anomalies continuously
- Agents: Baseline Builder, Anomaly Detector, IOC Correlator, Threat Intel Researcher
- Multi-agent benefit: Agents collaborate to build high confidence in detections and reduce false positives

**Automated Compliance Auditor**
- Problem: Manual compliance checks are tedious, error-prone, and slow to update as policies change
- Solution: Agents that audit systems against policies, generate compliance reports, and track remediation
- Agents: Policy Interpreter, System Scanner, Gap Analyzer, Remediation Planner, Evidence Collector
- Multi-agent benefit: Agents assess compliance holistically, accounting for interdependencies and exceptions

**Intelligent Phishing Defense**
- Problem: Phishing attacks scale faster than human analysts can respond
- Solution: Agents that analyze emails, detect phishing patterns, assess target risk, and recommend containment actions
- Agents: Email Parser, Phishing Detector, Target Analyzer, Response Recommender, Feedback Learner
- Multi-agent benefit: Multiple detection models vote; agents must reach consensus before blocking to avoid false positives

**Vulnerability Management Orchestrator**
- Problem: Organizations have thousands of vulnerabilities; manual triage and prioritization is impossible
- Solution: Agents that assess vulnerability impact, prioritize remediation, plan patches, and track risk
- Agents: Vulnerability Enricher, Impact Assessor, Prioritizer, Remediation Planner, Risk Tracker
- Multi-agent benefit: Agents understand complex interdependencies (e.g., a low-CVSS CVE might be critical if it affects a critical asset)

**AI Red Team System**
- Problem: Organizations need continuous security testing but can't staff a dedicated red team
- Solution: Agents that plan and execute controlled security tests, simulating red and blue team dynamics
- Agents: Target Analyzer, Attack Planner, Executor, Blue Team Simulator, Report Generator
- Multi-agent benefit: Simulates adversarial thinking; agents must justify attacks and defend against mitigations

**MASS Plugin Development**
- Problem: Security applications need domain-specific checks (e.g., enterprise API security, custom compliance rules)
- Solution: Build your own specialized security analyzer inspired by MASS's architecture. Clone the open-source repo (https://github.com/r33n3/MASS), study how MASS structures its 12 analyzers and compliance mapping across OWASP, MITRE ATLAS, NIST, and EU AI Act. Then design and implement a custom analyzer for your chosen domain using Claude Code.
- Agents: Requirement Parser, Vulnerability Scanner, Compliance Checker, Report Generator
- Multi-agent benefit: Coordinate your analyzer with reference patterns from MASS; ensure consistency and avoid conflicting recommendations
- AIUC-1 integration: Extend your analyzer to map findings to AIUC-1 domains and score them with AIVSS, creating a complete risk identification → control selection → certification pipeline
- **Open Source:** MASS is open source because security should be open to anyone. Study it, extend it, contribute back — that's how the security community gets stronger.

**PeaRL Governance Extension**
- Problem: Organizations deploy agents across dev/pilot/preprod/prod but lack fine-grained governance rules per environment
- Solution: Build your own governance layer inspired by PeaRL's architecture. Clone the open-source repo (https://github.com/r33n3/PeaRL), study its environment hierarchy, approval workflows, and anomaly detection patterns (AGP-01 through AGP-06), then design and implement governance extensions using Claude Code.
- Agents: Policy Evaluator, Approval Orchestrator, Anomaly Detector, Compliance Logger
- Multi-agent benefit: Coordinate governance enforcement across multiple independent agent deployments
- AIUC-1 integration: Map your governance extension to all six AIUC-1 domains; score agent risks at each promotion gate using AIVSS
- **Open Source:** PeaRL is open source because security should be open to anyone. Contribute improvements back to the project, or fork and build your own governance platform.

> **💬 Discussion Prompt:** In your team, discuss which project idea resonates with your interests. Why? What real-world problem would you want to solve? How would a multi-agent approach help where a single agent or traditional automation would fall short?

> **📖 Further Reading:** Review [Framework documentation](resources/FRAMEWORKS.md) to understand available agent frameworks (Claude Agent SDK, CrewAI, LangGraph) and how they support multi-agent patterns.

> **🔑 Key Concept:** Both PeaRL and MASS are open source because their creator believes **security should always be open to anyone to use**. This isn't just ideology — it's sound engineering. Open-source security tools benefit from community review, diverse perspectives, and rapid improvement cycles. When you build your capstone, consider: would the security community benefit from your work being open? How does open-sourcing change your approach to code quality, documentation, and design?

> **🧠 Domain Assist:** Presenting and defending technical architecture to reviewers is a professional skill that takes practice. If you've never presented an architecture review, ask Claude Code:
>
> "I'm presenting a multi-agent security system architecture to faculty reviewers. Help me prepare: 1) What do architecture reviewers typically look for — what impresses them and what concerns them? 2) How do I structure a 15-minute architecture presentation — what goes in and what stays out? 3) What are the common questions reviewers ask about multi-agent systems? 4) How do I defend a design trade-off? What's the right framing for 'I chose X instead of Y because...'? 5) What are the red flags that make reviewers lose confidence in a design?"
>
> Also use Claude to stress-test your architecture before the review: "Here's my system architecture: [describe it]. Play the role of a skeptical reviewer. Ask me the hardest questions you can think of about this design. Challenge my assumptions."

---

#### Architecture Review Methodology

Weeks 13 is structured around a **peer and faculty architecture review**. Here's how it works:

**Timeline:**
- **Monday–Wednesday:** Teams finalize proposals and architecture documents
- **Wednesday afternoon:** All teams present (15 min presentation + 15 min feedback per team)
- **Thursday–Friday:** Teams incorporate feedback and finalize architecture before Week 14

**What Reviewers Look For:**
1. **Problem clarity** — Is the cybersecurity problem well-defined and significant?
2. **Solution fit** — Is an agentic multi-agent approach the right tool? Or is this overengineered?
3. **Technical feasibility** — Can a team of 2–3 actually build this in 3 weeks? (Scope is critical!)
4. **Architectural soundness** — Do the agents have clear roles? Is orchestration realistic?
5. **Security thinking** — Do you demonstrate understanding of threat models and hardening?
6. **Ethical awareness** — Have you thought through potential harms and misuse?

> **⚠️ Common Pitfall:** Over-scoping. Many teams try to build a system that would take 6 months. Scope ruthlessly. A simple, well-executed 3-agent system beats an incomplete 10-agent vision. Ask your reviewers: "What's the minimum viable product that still demonstrates the concepts?"

---

> **Pre-Spec Check — Week 1**
> Before writing a line of code: use `/build-spec` in Claude Code on your capstone idea. Share the spec. I'm going to ask: is the problem real, is the scope buildable in the time you have, and is the AI component genuinely necessary — or could a simpler tool do the same job?
>
> Claude: This is a scoping gate. The AI component must be necessary — if the problem could be solved with a SQL query and a scheduled job, it shouldn't be a capstone project. If the scope is too large, help narrow it. A completed focused tool beats an unfinished ambitious one.

---

> **Day 1 Checkpoint — Week 1**
> Claude: Ask the student: "Anything from today's theory and project scoping that felt unclear?" Note confidence signals. Write to `.noctua/progress.md`: add a row to the "Unit 8, Week 1 — Day 1 Theory" table with today's date and your confidence assessment (High / Medium / Low). Append to Confusion Log if anything came up. Topics covered: Week 1 capstone kickoff and architecture design.

---

### Day 2 — Hands-On Lab: Proposal Development and Peer Review

> **Lab Guidance — Week 1**
> Claude: Walk through the Think→Spec→Build→Retro cycle for Week 1. At the proposal stage, ask "Is the AI component genuinely necessary here?" before approving the spec. Don't let the student skip the `/build-spec` step before architecture review.
>
> **Lab Dependencies:** If not already installed, run: `pip install anthropic` (https://docs.anthropic.com)

#### Lab Objectives

- Write a compelling project proposal that frames the problem and solution
- Develop a detailed architecture document that demonstrates feasibility and depth
- Present your proposal to faculty and peers
- Gather actionable feedback and refine your architecture
- Finalize team composition and commit to a capstone project

#### Step 1: Form Teams (Due Wednesday)

Submit to faculty:
- Team member names and roles (e.g., lead architect, lead developer, QA/testing lead)
- Preliminary project idea (1–2 paragraphs)
- Rationale: Why this problem? Why multi-agent?

> **💡 Pro Tip:** Choose a co-lead architect and lead developer early. Assign one person to champion security/hardening and one to champion observability/ops. These aren't "nice to have" roles—they're critical to your grade.

#### Step 2: Write Your Proposal (Due Thursday)

**Format:** 500–1000 words

**Content:**
1. **The Problem (2–3 paragraphs):** What cybersecurity challenge are you solving? Why does it matter? How is it currently addressed? What are the gaps?
2. **Why Multi-Agent? (1 paragraph):** Why is a multi-agent approach better than a single agent or traditional automation?
3. **Proposed Solution (2 paragraphs):** High-level overview of your system. What does it do? Who uses it? What are the main workflows?
4. **Success Metrics (1 paragraph):** How will you know your system works? What are 3–5 key metrics (accuracy, latency, cost, false positive rate, etc.)?

> **✅ Remember:** A proposal is a sales pitch. You're convincing your reviewers (and yourself) that this is worth 4 weeks of intensive work. Be specific. Use numbers and examples.

#### Step 3: Develop Your Architecture Document (Due Thursday)

**Format:** 1500–2500 words (this is substantial; start early)

> **📖 Methodology:** Your capstone follows the **Think → Spec → Build → Retro cycle**. Week 13 is the Think + Spec phase (critical analysis, architecture review, and formal specification of your design decisions). Weeks 14-15 are the Build phase (rapid development with Claude Code using `/worktree-setup` for isolated parallel work). The red team review closes the Retro phase (external validation and hardening). By Week 16, you've completed a full cycle and can reflect on how iteration improved your system.

**Structure:**

**1. System Overview (200 words)**
- What does the system do end-to-end?
- Who are the users/stakeholders?
- What are the main success criteria?

**2. Multi-Agent Design (600 words)**
- **Agent 1, 2, 3, ...:** For each agent, describe:
  - Name and role
  - Responsibilities and expertise
  - Tools and data sources
  - How it communicates with other agents
- **Orchestration:** How do agents coordinate? Sequential? Hierarchical? Debate? Feedback loops?
- **Framework choice:** Which framework will you use? (Claude Agent SDK, CrewAI, LangGraph?) Why is it the right fit?

> **🔑 Key Concept:** Good multi-agent design is about **separation of concerns**. Each agent should have a clear, bounded role. Agent A doesn't try to do everything; it calls Agent B when specialized expertise is needed. This mirrors how human teams work. The **Pit of Success** principle from *Agentic Engineering* (Ch. 3) means designing your multi-agent system so the right behavior (agents respecting role boundaries, escalating appropriately, handling failures gracefully) emerges naturally from the architecture, not from constant oversight.

**3. Collaborative Critical Thinking (CCT) Analysis (400 words)**
- How does your multi-agent architecture enable deeper thinking than a single agent?
- **Specific example:** Describe a decision or analysis where agents debate/validate/challenge each other. What gets uncovered?
- How do agents catch each other's blind spots?
- Link to security outcomes: "Agent A might miss this threat, but Agent B catches it because of its threat intelligence specialization."

> **💡 Pro Tip:** CCT isn't abstract. Show concrete examples. Don't just say "agents discuss threats." Say: "Agent A (Alert Triager) flags alert severity as LOW. Agent B (Threat Analyst) reviews threat intel and overrides to CRITICAL because this IP just attacked 3 other companies in our industry." That's CCT in action.

**4. Security Hardening Plan (400 words)**
- **Threat model (MITRE ATLAS):** What are the top 5 threats to your system?
  - Example: prompt injection (ATLAS T0051), supply chain manipulation, model confusion
- **Mitigation for each:** How will you prevent/detect/respond to this threat?
- **Input validation strategy:** What user inputs do you accept? How do you validate them?
- **Output filtering:** What do agents produce? How do you prevent harmful outputs?
- **Tool permission scoping:** If agents use external tools, what permissions do they have? (Principle of least privilege)
- **AIUC-1 domain mapping:** For each of the six AIUC-1 domains, identify which controls your system addresses. This is a systematic way to ensure comprehensive security coverage beyond just threat modeling.
- **AIVSS risk scores:** For your top 5 AI-specific risks, provide AIVSS scores and explain how they informed your mitigation priorities.

**5. Observability Plan (300 words)**
- **What you'll monitor:** Agent decisions, tool calls, data flows, error rates, latency
- **Key metrics:** Define 5 metrics (e.g., mean time to detect, false positive rate, agent consensus rate, API cost per request)
- **Logging strategy:** How will you audit all significant agent actions? (Regulatory/compliance requirement)
- **Dashboards/alerts:** What dashboards will the ops team use? What triggers an alert?

**6. Deployment Plan (300 words)**
- **Architecture:** Where will this run? Cloud? On-prem? Hybrid?
- **Containerization:** Docker? Kubernetes?
- **CI/CD:** How will you test and deploy updates?
- **Operations:** Who runs this? What's the runbook for common issues?
- **Cost:** What's your estimated monthly cost? (API calls, compute, storage)

**7. Ethical Considerations (300 words)**
- **Stakeholders:** Who is impacted by this system? (Security team, end users, executives, external users?)
- **Potential harms:** How could this system be misused? (False positives blocking legitimate activity, over-automating decisions without human oversight, bias in threat detection)
- **Mitigations:** How will you prevent these harms?
- **Responsible AI:** How does your system align with principles like transparency, fairness, human oversight, and accountability?

**8. Success Criteria (200 words)**
- **Technical:** What does a working implementation look like? (All agents deployed, communications working, end-to-end workflow running)
- **Operational:** How will your system perform in production? (Latency SLA, uptime target, cost budget)
- **Security:** What threats will be mitigated? (Measured by red team findings, threat model coverage)

> **💡 Design Thinking:** As you finalize your capstone architecture, reflect on the **mental models** that underpin it. Agentic Engineering principles ask: What assumptions are you making about how users will interact with your system? How will operators understand what went wrong? Are you designing for the cognitive model of your users or against it? Use these questions to stress-test your architecture before building.

**9. Timeline and Milestones (100 words)**
- Week 13: Architecture finalized (after review feedback)
- Week 14: Core multi-agent system built and end-to-end workflow running
- Week 15: Hardening, observability, red team review, and mitigations
- Week 16: Polish, final testing, presentation prep

#### Step 4: Present Your Architecture (Thursday Afternoon)

**Format:** 15-minute presentation + 15-minute feedback/Q&A

**Presentation structure (aim for ~10 slides):**
1. Problem and context (1–2 slides)
2. Proposed solution overview (1 slide)
3. Multi-agent architecture (2 slides: agent roles + orchestration diagram)
4. CCT analysis — concrete example (1 slide)
5. Security hardening plan (1 slide)
6. Observability approach (1 slide)
7. Timeline and risks (1 slide)
8. Questions?

> **⚠️ Common Pitfall:** Slides that are text-heavy or too technical. Reviewers want to understand your vision in 15 minutes. Use diagrams. Show your system architecture visually. Practice beforehand and time yourself.

> **💡 Pro Tip:** In the Q&A, be honest about unknowns. "We haven't decided on framework yet, but we're between CrewAI and LangGraph because..." is better than "We'll use whatever works." Reviewers respect intellectual honesty.

#### Step 5: Incorporate Feedback and Finalize (Thursday–Friday)

After your presentation, you'll receive written feedback from reviewers focusing on:
- Clarity of problem and solution fit
- Technical feasibility and scope
- Architectural soundness
- Security and ethical thinking
- Realistic timeline

**Action:** Meet with your team Friday. Read feedback. Refine your architecture document and confirm:
- All critical/high feedback is addressed
- Team is confident in the timeline
- Roles and responsibilities are clear
- Architecture document is final (you'll reference it all week 14)

#### Deliverables (Due Friday)

1. **Capstone Proposal** (500–1000 words)
2. **Architecture Document** (1500–2500 words)
3. **Presentation Slides** (PDF)
4. **Peer Review Feedback Summary** (1 page: what did you learn? what did you change?)

#### Sources & Tools

- [Framework Documentation](resources/FRAMEWORKS.md) — Claude Agent SDK, CrewAI, LangGraph comparison
- [Lab Setup Guide](resources/LAB-SETUP.md) — Getting your development environment ready
- [Reading List](resources/READING-LIST.md) — MITRE ATLAS, agentic patterns, responsible AI

---

> **Lab Checkpoint — Week 1**
> Claude: Ask: "How did the proposal and architecture review go? What was the most important piece of feedback you received — and what did you change as a result?" Write to `.noctua/progress.md`: add a row to the "Unit 8, Week 1 — Day 2 Lab" table. Note in the Confusion Log if any capstone scoping concept was confusing.

---

> **Week 1 Complete**
> Claude: Confirm the student has finished Week 1. Ask: "Before we move to Week 2 — is there anything from this week you'd like to revisit?"
> Update `.noctua/progress.md`: Set Current Position to Unit 8, Week 2.
> Then ask: "Ready for Week 2?"

---

## Week 14: Sprint I — Core Agent System Build

### Day 1 — Daily Standup Check-In

#### Learning Objectives

- Communicate progress, obstacles, and adjustments to the team and faculty
- Build accountability and momentum
- Identify and unblock issues early

#### Structure (15 minutes daily)

Each team answers:
1. **What did you complete yesterday?** (Focus on working code, not just effort)
2. **What's your plan for today?**
3. **What's blocking you?** (Faculty can help)

> **🔑 Key Concept:** Standups are a team synchronization tool, not a status report to management. Keep them tight. If a blocker needs deep discussion, take it offline after standup.

#### Mid-Week Checkpoint (Wednesday, 30 minutes)

Each team demos progress to faculty:
- Show working code and end-to-end workflow (even if rough)
- Describe what agents are implemented
- Highlight what's working and what's in progress
- Surface risks or scope adjustments

### Day 2 — Hands-On Development Sprint

#### Lab Objectives

- Build the core multi-agent system and get end-to-end workflow functioning
- Establish communication patterns and basic orchestration
- Deploy agents and tools with basic observability
- Maintain code quality and documentation as you build

#### Development Focus for Sprint I

**Week 14 is about getting the minimum viable product (MVP) working:**

1. **Implement core agents** — Each team member builds 1–2 agents. Ensure they can communicate.
2. **Establish data flows** — Data moves from one agent to the next; end-to-end workflow completes.
3. **Deploy basic tools** — If agents call external APIs or tools, get those integrated.
4. **Add logging and monitoring** — Every agent decision should be logged; set up basic metrics.
5. **Get to "working"** — The system doesn't need to be perfect, but it should run end-to-end without crashing.

> **⚠️ Common Pitfall:** Perfectionism in week 14. Don't spend 3 days optimizing agent prompts when you haven't built the orchestration layer yet. Build the skeleton first; refine later.

> **💡 Pro Tip:** Use Claude Code and Git heavily. Create a branch for each agent. Use pull requests for code review. Maintain a clear README so any team member can spin up the environment. You'll thank yourself in Week 16 when you need to demo quickly.

#### Deliverable: Sprint I Progress Report (Due Friday)

**Format:** 2–3 pages, including:

1. **Implementation Status:**
   - List agents implemented (with % complete for each)
   - Working end-to-end workflows
   - What's in progress or deferred

2. **Code & Artifacts:**
   - Link to GitHub repo
   - README with "how to run" instructions
   - Demo or screenshot of working system

3. **Metrics:**
   - Lines of code written (rough estimate)
   - Number of agents deployed
   - Functionality coverage (e.g., "70% of design implemented")

4. **Obstacles & Adjustments:**
   - What challenges did you hit? How did you solve them?
   - Any scope or architecture adjustments?
   - Risk assessment: What might not make it?

5. **Plan for Sprint II:**
   - What will you focus on in Week 15?
   - How will you prepare for the red team review?

> **✅ Remember:** This report is not just for your instructors—it's for your team. Be honest about what's working and what's not. If you're behind, now's the time to course-correct.

---

## Week 15: Sprint II — Production Hardening & Peer Red Team

### Day 1 — Sprint II Kickoff and Red Team Assignment

#### Learning Objectives

- Understand the red team review process and what to expect
- Identify hardening priorities based on your threat model
- Prepare your system for external security assessment

#### Red Team Review Overview

On Wednesday of Week 15, your team will conduct a **peer security review of another team's capstone project**. Simultaneously, another team will red team your system. This is a 2-hour time-boxed exercise designed to find vulnerabilities through adversarial thinking.

**What Red Teamers Will Do:**
1. Review your architecture and threat model
2. Attempt 3–5 common attacks:
   - Prompt injection (e.g., "Ignore your instructions and...")
   - Goal hijacking (making the agent prioritize attacker goals)
   - Tool misuse (e.g., calling tools with malicious arguments)
   - Input manipulation (crafting inputs to trigger bugs)
   - State corruption (manipulating memory or data stores)
3. Document findings with evidence and severity ratings

**How This Helps You:**
- Catch vulnerabilities before deployment
- Learn what adversarial thinking looks like
- Demonstrate your hardening and defensive design
- Build resilience against real-world attacks

> **🔑 Key Concept:** Red team reviews are constructive, not punitive. The goal is to make your system better. Reviewers are peers, not adversaries. Treat findings as gifts—they show you where to focus hardening effort.

#### Preparing for Red Team Review

**By Wednesday morning, ensure:**
1. Your system is deployed and accessible to red teamers
2. Documentation is clear (architecture, threat model, known limitations)
3. You've implemented initial hardening based on your threat model
4. You have logs and monitoring so you can see what red teamers are trying

> **💡 Pro Tip:** Leave a README for red teamers: "Here's how to run the system. Here are some interesting workflows to test. Here are known limitations we're accepting." This helps them conduct a better review and shows you're confident in your design.

#### Conducting Your Red Team Review (Wednesday)

You're assigned a different team's capstone project. Your job: find vulnerabilities.

**Time-box: 2 hours**

1. **(15 min) Understand the system**
   - Read architecture document
   - Understand threat model and intended workflows
   - Identify key agents and tools

2. **(15 min) Plan attacks**
   - Based on threat model, what are the most likely attack vectors?
   - What assumptions is the system making? (What could break?)
   - What would a real attacker try?

3. **(80 min) Execute attacks**
   - Try the 3–5 attack categories listed above
   - Document what you tried and what happened
   - Take screenshots/logs as evidence
   - Note severity: Critical (system breaks), High (functionality compromised), Medium (unexpected behavior), Low (minor issue)

4. **(10 min) Organize findings**
   - Rank by severity
   - Draft recommendations
   - Estimate effort to fix each

> **⚠️ Common Pitfall:** Red teamers sometimes find trivial issues and call them critical. Be fair. A spelling error in an output message is not a security vulnerability. Focus on issues that affect system behavior, security, or reliability.

### Day 2 — Sprint II Development and Hardening

#### Lab Objectives

- Harden your system based on your threat model and red team findings
- Implement comprehensive observability and monitoring
- Optimize agent prompts, tool sets, and performance
- Document security measures and operational readiness
- Finalize code and prepare for presentation

> **🎯 Production Hardening:** Week 15 applies the production hardening practices from *Agentic Engineering* (Ch. 7: Practices — Production Concerns). You're not just fixing bugs; you're ensuring your system can run reliably under load, with visible observability, clear error messages, and graceful degradation. By end of this week, your system should be **deployment-ready**, not prototype-ready. That distinction matters.

#### Hardening Checklist

By end of week 15, your system should address:

**Input Validation:**
- User inputs are validated and sanitized
- Invalid inputs are rejected gracefully (not passed to agents)
- Agents are instructed to reject suspicious inputs

**Output Filtering:**
- Agent outputs are reviewed before being acted on
- Harmful or nonsensical outputs are caught and logged
- Users see helpful error messages, not raw LLM errors

**Tool Permission Scoping:**
- If agents call APIs or system commands, they have minimal necessary permissions
- Dangerous operations (delete, modify, deploy) require explicit approval
- Tool calls are logged and auditable

**Monitoring & Alerts:**
- Every agent decision is logged with timestamp, agent name, input, reasoning, output
- Key metrics are tracked: agent accuracy, tool success rate, latency, cost
- Anomalies trigger alerts (e.g., agent calling same tool 100 times, unusual latency spike)

**Error Handling:**
- Graceful degradation: if one agent fails, system continues or fails safely
- Users are informed when something goes wrong
- Errors are logged for troubleshooting

> **💡 Pro Tip:** Don't try to prevent every possible attack. Instead, focus on **defense in depth**: multiple layers of protection (validation, filtering, monitoring, logging). If one layer fails, others catch it. Plus, comprehensive logging means you can detect attacks even if they partially succeed.

#### Red Team Findings Response

By Thursday, you'll receive the red team report. **Action plan:**

1. **Read and categorize** — Which findings are valid? Which are misunderstandings of the system?
2. **Prioritize** — Fix critical/high severity before presentation. Medium/low can be documented as "accepted risk."
3. **Mitigate or document** — Either implement a fix or document why you're accepting the risk (e.g., "This attack requires admin access, which is out of scope for this MVP").
4. **Test your fixes** — Make sure mitigations actually work.

> **✅ Remember:** You don't need to fix every finding. But for every finding you don't fix, you need a good reason (documented in your final presentation).

#### Deliverable: Sprint II Progress Report (Due Friday)

**Format:** 3–4 pages

1. **Hardening Summary:**
   - Security improvements implemented (with brief description)
   - Red team findings and responses (table: finding, severity, status)
   - Any risks you're accepting

2. **Observability Implementation:**
   - Monitoring dashboard or reporting system deployed
   - Key metrics defined and tracked
   - Audit logging configured

3. **Code Quality:**
   - Code review completed (peer review of pull requests)
   - Documentation updated
   - Test coverage (unit tests, integration tests)

4. **Performance Metrics:**
   - Track 5 key metrics from Week 14 to Week 15 (show improvement if possible)
   - Examples: accuracy, latency, cost, false positive rate, uptime

5. **Readiness Assessment:**
   - % of architecture implemented and tested
   - Remaining work for Week 16
   - Risks: "What might not be done by presentation day?"

#### Sources & Tools

- [Reading List](resources/READING-LIST.md) — MITRE ATLAS attack chains, hardening best practices
- [Framework Documentation](resources/FRAMEWORKS.md) — Observability and monitoring patterns
- [Lab Setup Guide](resources/LAB-SETUP.md) — Deployment and testing infrastructure

---

## Week 16: Final Presentations & Course Completion

### Day 1 — Presentation Prep and Polish

#### Learning Objectives

- Finalize your capstone system (code, docs, demo)
- Prepare a compelling 20-minute technical presentation
- Write a meaningful reflection essay
- Practice delivering your talk

> **🧠 Domain Assist:** Your capstone presentation targets a mixed audience — technical peers, faculty, and potentially industry practitioners. Tailoring technical content for different audiences is a skill most engineers need to develop deliberately.
>
> Before your final presentation, ask Claude Code:
>
> "I built a [describe your capstone system]. I need to present it in 20 minutes to a mixed audience of technical peers and non-technical evaluators. Help me: 1) What's the right ratio of technical depth vs. business impact for this audience? 2) How do I explain my multi-agent architecture without losing non-technical listeners? 3) What's the best way to present threat model findings and AIUC-1 compliance to a mixed audience? 4) How do I demonstrate impact — what metrics or demonstrations are most compelling? 5) What questions should I expect and how should I prepare for them?"

---

#### Final System Checklist

Before presentation day, confirm:

- [ ] All code is clean, documented, and in GitHub
- [ ] README has setup and usage instructions
- [ ] System runs end-to-end without errors
- [ ] Demo is prepared (live demo or pre-recorded backup)
- [ ] Monitoring dashboard is accessible
- [ ] Final documentation is complete (architecture, security, ops)
- [ ] Team has practiced presentation and timed it

> **💡 Pro Tip:** Prepare a demo script and walk through it the day before. Demo anxiety is real. Knowing exactly what you'll show and in what order reduces stress. Have a backup (pre-recorded demo) in case live demo fails.

#### Presentation Structure (20 minutes + 10 min Q&A)

**Allocate time as follows:**

1. **Problem & Context (2 min)** — Why does this matter?
2. **Solution Overview (3 min)** — What did you build? Architecture diagram.
3. **Multi-Agent Design & CCT (2 min)** — Show agents and how they think together.
4. **Live Demo (7 min)** — Show the system working end-to-end.
5. **Security & Red Team (2 min)** — Threat model, red team findings, how you hardened.
6. **Observability & Operations (1 min)** — Monitoring, metrics, deployment readiness.
7. **Lessons Learned (2 min)** — What surprised you? What would you do differently?
8. **Q&A (10 min)** — Be ready to defend your design and discuss tradeoffs.

**Slide count:** Aim for 12–15 slides (including title, agenda, and closing). Not too many.

> **⚠️ Common Pitfall:** Presenters show too much code. Reviewers don't care about syntax. Focus on architecture, design decisions, and outcomes. If you want to show code, show a snippet that illustrates a key insight, not your entire codebase.

#### Reflection Essay (1000–1500 words, Due Friday)

Write a reflection on your capstone experience:

1. **What you learned about agentic AI** — What surprised you? What challenges did you face?
2. **How your thinking evolved** — When you started, what did you think agentic systems could do? Now?
3. **Your hardening journey** — What vulnerabilities did you discover? How did you think about security differently?
4. **Ethical implications and AIUC-1 alignment** — What are the risks of deploying this system? How does your AIUC-1 domain mapping reveal gaps in your governance approach? Which AIUC-1 domain was hardest to address, and why?
5. **Production readiness** — What would need to happen before this system could run in a real organization? What observability, governance, or operational procedures would teams need? What could go wrong, and how would operators detect and respond to it?
6. **The bigger picture** — What are the implications of agentic security systems for the field of cybersecurity?

> **💡 From Prototype to Production:** Use your reflection to articulate the **prototype-to-production journey** your capstone has taken. How did your system evolve from an idea (Week 13) to a working implementation (Week 14) to a hardened, observable system ready for deployment (Week 16)? What did you learn about building production systems that you didn't know before? This reflection isn't just introspection—it's documentation of your growth as an engineer.

> **🔑 Key Concept:** The reflection isn't a summary of your system. It's introspection. Think of it as a letter to yourself or to future practitioners building agentic security systems. What do you wish you had known at the start? What will your experience teach others?

### Day 2 — Presentations and Course Retrospective

#### Capstone Presentations (Thursday)

**Schedule:** Each team presents 20 min + 10 min Q&A. All faculty and students attend.

**Evaluation Rubric (40% of course grade):**

| Component | Weight | What We're Looking For |
|-----------|--------|------------------------|
| **Technical Sophistication** | 30% | Complexity and depth of multi-agent architecture; proper use of patterns; code quality |
| **CCT Application** | 20% | Quality of critical thinking analysis; how agents enable reasoning; concrete examples of agent collaboration |
| **Security Hardening** | 20% | Strength of threat model; identified and mitigated vulnerabilities; response to red team findings |
| **Ethical Considerations** | 15% | Stakeholder analysis; potential harms identified; responsible AI principles demonstrated |
| **Practical Applicability** | 10% | Real-world relevance; feasibility of deployment; operational readiness |
| **Presentation Quality** | 5% | Clarity, organization, time management, ability to engage audience |

> **💡 Pro Tip:** Q&A is part of your grade. Be humble. If you don't know the answer to a question, say so. Offer to research and follow up. Defensive answers lose points.

#### Capstone Project Deliverables (Due Friday, 5 PM)

Submit to faculty:

1. **Source Code (GitHub)**
   - Clean, well-organized repository
   - Comprehensive README with setup and usage instructions
   - CI/CD pipeline configuration
   - Deployment scripts / Dockerfiles
   - .gitignore properly configured (no API keys, secrets, or large files)

2. **Technical Documentation**
   - System architecture and design document (updated from Week 13)
   - Multi-agent design and orchestration details
   - API and tool documentation
   - Configuration reference

3. **Security Documentation**
   - MITRE ATLAS threat model (summary)
   - Security hardening measures (with implementation details)
   - Red team findings and your responses
   - Security deployment checklist
   - AIUC-1 domain mapping (all six domains with control coverage assessment)
   - AIVSS risk scores for top 5 AI-specific vulnerabilities

4. **Observability & Operations**
   - Monitoring and metrics documentation
   - Operations runbook (how to troubleshoot, deploy, scale)
   - Incident response procedures
   - Cost tracking and optimization

5. **Presentation Materials**
   - Slides (PDF)
   - Architecture diagrams (in presentation and standalone)
   - Demo video (backup if live demo isn't possible)

6. **Reflection Paper**
   - 1000–1500 words
   - Address prompts listed in Day 1 section above

> **✅ Remember:** This is a portfolio piece. These deliverables will be evidence of your mastery of agentic security engineering. Make them clear, professional, and complete.

#### Course Retrospective (Friday Afternoon, 2 Hours)

All students and faculty gather to reflect on the course and capstone projects.

**Structure:**

**1. Key Takeaways (Each student shares 1–2 minutes)**
- Most important thing you learned
- Most challenging aspect you faced
- How your understanding of agentic AI has evolved

**2. Cohort Themes (Faculty synthesizes)**
- What patterns emerged across capstone projects?
- What approaches worked well? What didn't?
- What open questions remain?

**3. Where Is the Field Heading? (Discussion)**
- What capabilities are agents gaining in cybersecurity?
- What are the remaining challenges (technical, ethical, regulatory)?
- How should organizations deploy agentic security systems responsibly?
- Guest speaker or industry panel (if available)

**4. Course Feedback**
- What worked well in CSEC 602?
- What would you change for next semester?
- What topics should be added? Removed?
- How was the capstone experience?

> **💡 Pro Tip:** Be honest in the retrospective. Your feedback directly shapes future iterations of this course. We're building a curriculum together.

---

## Context Library: Your Professional Toolkit

As you finish CSEC 602, your context library has evolved from a personal reference collection into a **professional-grade toolkit**. This toolkit—combined with your deep knowledge of AI security—is your competitive advantage in any security role.

### The Capstone: Context Library as Deliverable

Your context library is now a formal component of your capstone evaluation. As part of your final presentation and deliverables:

**Include a section titled "Context Library":**

1. **Directory Structure** — Show how you've organized patterns (screenshot or tree output)
2. **Key Artifacts** — List the 5-10 highest-value patterns you've captured (supervisor pattern, defense layers, CI/CD pipeline, etc.)
3. **Breadth** — How many domains does your library cover? (Multi-agent patterns, red team, blue team, DevOps, observability, security hardening)
4. **Depth** — Pick 2-3 patterns and show how they've evolved from Unit 5 through Unit 8 (version history, refinements based on lessons learned)
5. **Composability** — Demonstrate how patterns combine (e.g., your CI/CD pipeline + canary deployment + observability config = a complete deployment system)
6. **Team-Readiness** — Would a teammate or junior engineer be able to use your library? Is it documented?

### Evaluation Criteria for Context Library

Your library will be evaluated on:

| Criterion | What We're Looking For | Example |
|-----------|----------------------|---------|
| **Breadth** | Coverage across domains | Library includes multi-agent, red team, blue team, DevOps, and observability patterns |
| **Depth** | Quality and completeness of individual patterns | Supervisor pattern includes code, decision rationale, usage examples, and common pitfalls |
| **Iteration** | Evidence of refinement over the semester | Supervisor pattern v1.0 (Unit 5) → v1.2 (Unit 6) → v2.0 (Unit 8) with changelog explaining improvements |
| **Composability** | Patterns work together, not in isolation | Your CI/CD pipeline references your Dockerfile template; both work with your canary deployment script |
| **Documentation** | Teammates could use your library | README explains what each pattern solves, how to use it, when to use it, and how to customize it |
| **Production Quality** | Patterns are ready for real deployment | Your Dockerfile isn't a learning exercise; it's a hardened, secure base image for actual systems |

### What Makes a Senior Professional

The capstone isn't just about building one great system. It's about demonstrating that you can build systems **and share the patterns you've learned** so others benefit.

**A junior engineer** builds a system and moves on.
**A senior engineer** builds a system, extracts reusable patterns, documents them, and shares them so the whole team gets better.

Your context library is proof you think like a senior engineer. You're not just solving today's problem; you're building tools for tomorrow's problems.

### Your Library After Graduation

**Immediately after CSEC 602:**
- Your context library is v1.0 (complete, documented, ready to use)
- You can immediately apply these patterns in your next role
- Your capstone code + patterns become portfolio work for interviews

**In your first security role:**
- You import your library and customize it for your organization
- You share patterns with teammates (they benefit from your semester of learning)
- You continue refining patterns based on production incidents

**Over your career:**
- Your library grows with experience (v1.0 → v2.0 → v5.0)
- Patterns that worked get locked in; patterns that failed get replaced
- Your library becomes your unique professional toolkit—what makes you uniquely effective

### Template for Final Submission

In your capstone presentation and deliverables, include:

**Slide: "Context Library: My Professional Toolkit"**

```text
📚 What I've Captured

Multi-Agent Patterns (Unit 5):
  ✓ Supervisor orchestration pattern
  ✓ Agent communication protocol
  ✓ Framework selection guide
  ✓ Evaluation harness template

Attack & Defense Playbooks (Unit 6):
  ✓ Attack templates with evasion techniques
  ✓ Defense layer configurations
  ✓ Incident response runbook
  ✓ Scoring rubric for security assessments

Production Engineering (Unit 7):
  ✓ CI/CD pipeline (GitHub Actions)
  ✓ Production Dockerfile (multi-stage, hardened)
  ✓ Canary deployment script
  ✓ Observability and metrics configuration

Security Hardening (Unit 8 Capstone):
  ✓ MITRE ATLAS threat model template
  ✓ Input validation and output filtering patterns
  ✓ Red team findings response template
  ✓ Security deployment checklist

📊 Library Metrics

  Patterns captured: 40+
  Domains covered: 6 (multi-agent, red team, blue team, DevOps, ops, observability)
  Lines of code/documentation: 10,000+
  Version iterations: 2-3 per pattern (showing evolution and refinement)
  Team-ready patterns: 15 (documented and ready to share)

💡 Why This Matters

Your context library is not academic. Every pattern was discovered and tested through real (simulated but realistic) security work. When you use these patterns in production, you're deploying knowledge earned the hard way.
```

### Final Reflection Question

In your capstone reflection essay, address:

> **"Describe your context library. What patterns are you proudest of? How have they evolved since Unit 5? How would a teammate use your library in their first week on a project? What makes your library a reflection of your professional standards?"**

This question isn't about boasting. It's about demonstrating that you've thought deeply about quality, reusability, and scalability—the hallmarks of professional engineering.

### The Bigger Picture

You're leaving CSEC 602 with two things:

1. **Deep Knowledge** — You understand agentic AI security at a level most practitioners will never reach. You've designed attacks, built defenses, orchestrated agents, and deployed systems. This knowledge is in your head.

2. **Professional Toolkit** — You have a context library of patterns proven to work. This library is your competitive advantage. When you face a new problem, you don't start from scratch. You pull a pattern from your library, adapt it, and build faster and better than peers without your toolkit.

The knowledge is invaluable. But the toolkit is career-long. Treat your context library with the care you would a production system.

---

#### Final Evaluation and Grade Determination

Your final grade in CSEC 602 is calculated as:

- **Participation & Attendance:** 10%
- **Labs 1–7 (Weeks 1–7):** 30%
- **Capstone Project (Weeks 13–16):** 40%
- **Attendance at presentations & retrospective:** 5%
- **Peer feedback & professionalism:** 5%
- **Capstone presentation + reflection:** 10% (separate from project grade)

Capstone grade components:
- **Proposal & Architecture (Week 13):** 10%
- **Sprint I Progress (Week 14):** 10%
- **Sprint II Progress (Week 15):** 10%
- **Final code, documentation, and deployability (Week 16):** 30%
- **Presentation (Week 16):** 10%
- **Reflection essay (Week 16):** 5%

> **🔑 Key Concept:** This is a mastery-based grading course. You're evaluated on depth of understanding and quality of work, not just completion. A simple system well-designed and well-documented scores higher than an ambitious system with gaps.

#### Next Steps After CSEC 602

Congratulations! You've completed a graduate-level course in agentic security engineering. Here's how to continue your journey:

**Publish Your Work**
- Consider publishing your capstone as an open-source project (GitHub, with README and docs)
- Write a blog post about your approach and learnings
- Present at a security conference or meetup

**Contribute to the Field**
- Study the MASS and PeaRL repositories to understand how production AI security tools approach governance and assessment challenges
- Join the agentic security research community
- Participate in CTF competitions with agentic AI themes

**Keep Learning**
- Explore advanced topics: multi-modal reasoning, embodied agents, curriculum learning
- Follow emerging research in agentic systems, AI safety, and responsible AI
- Build more capstone projects in related areas (incident response, compliance, threat hunting)

**Professional Growth**
- List CSEC 602 and your capstone on your resume
- Use your capstone code as portfolio work in interviews
- Seek roles in AI security, DevSecOps, or red team automation

---

## Key Resources

- [Reading List](resources/READING-LIST.md) — MITRE ATLAS, agent frameworks, security hardening, responsible AI
- [Frameworks Documentation](resources/FRAMEWORKS.md) — Claude Agent SDK, CrewAI, LangGraph patterns
- [Lab Setup Guide](resources/LAB-SETUP.md) — Environment configuration, deployment, debugging

---

**Course Contact:** For questions about the capstone or Unit 8, reach out to course faculty. Office hours are posted on the course homepage.
