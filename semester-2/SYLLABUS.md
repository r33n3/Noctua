# CSEC 602: Noctua — Advanced Agentic Security Engineering
## Semester 2 Syllabus

**Term:** Semester 2, 2026
**Credits:** 3 units
**Duration:** 16 weeks
**Prerequisite:** CSEC 601
**Delivery Mode:** Hybrid (lecture + hands-on labs)
**Lab-to-Theory Ratio:** 70% hands-on, 30% theory

---

## Course Information

### Course Overview
This course represents the second half of a year-long graduate sequence in advanced agentic security engineering. Students arrive from CSEC 601 having already built multi-agent security systems (Weeks 9-10), conducted basic red teaming (Weeks 13-14), containerized a prototype (Week 15), and internalized AIUC-1 through embedded week-by-week exposure. Semester 2 assumes all of this — it does not re-teach Docker basics, MCP fundamentals, or AIUC-1 introduction.

Semester 2 builds on the Semester 1 foundation: students optimize and compare multi-agent frameworks, conduct sophisticated multi-stage attacks and defenses up to a full autonomous wargame, go deep on production security engineering (supply chain, NHI governance, observability), and complete a capstone with full AIUC-1 certification documentation and Assessment Stack justification.

The course emphasizes practical hands-on experience with cutting-edge tools in the agentic AI ecosystem, including the Claude Agent SDK, CrewAI, LangGraph, and Model Context Protocol (MCP). Students extend what they built in Semester 1 rather than starting from scratch.

### Key Terminology
- **Collaborative Critical Thinking (CCT):** The systematic application of structured reasoning to design robust agentic systems, considering agent interactions, failure modes, security boundaries, and ethical implications. This is distinct from "prompting" and represents deep architectural and design thinking.
- **Context Engineering:** The intentional design and management of information context, instruction clarity, and tool availability to shape agent behavior. This is distinct from "prompt engineering" and encompasses the broader challenge of engineering systems, not just text prompts.

### What Students Arrive With

Students completing CSEC 601 have:
- Built and shipped a real security tool through Weeks 11-15 (concept → sprint → red team → hardened → containerized)
- Applied all six AIUC-1 domains with evidence across 16 weeks
- Survived cross-team red teaming and implemented defenses
- Containerized a prototype and run container security scans
- Built Claude Code skills and plugins
- Experienced scaling limits empirically (Week 7 Break Everything)
- Built multi-agent systems with per-agent cost tracking and inter-agent verification
- Internalized the Engineering Assessment Stack across every architectural decision

Semester 2 does not re-teach any of this. Week 1 begins at the optimization and comparison level.

**V&V Discipline Progression:** In Semester 1, you practiced V&V as a personal skill — verifying AI outputs manually, calibrating trust, imagining failures. In Semester 2, you'll embed V&V into your tools and systems. Your multi-agent systems will verify each other's outputs. Your red team tools will test whether verification mechanisms actually work. Your production systems will include automated verification pipelines. The goal: by capstone, verification is not something you do — it's something your systems do for you.

### Lab Philosophy
Semester 2 labs maximize the capabilities of Claude Max subscriptions and the cutting-edge agentic toolstack:

- **Claude Code and Agent SDK:** Students already know the SDK. Labs extend depth: subagent optimization, concurrent execution, comparative evaluation against CrewAI and LangGraph.
- **Multi-Vendor Perspective:** Students have built with the Claude Agent SDK. Now they compare architectural trade-offs against CrewAI, LangGraph, and AutoGen on the same security problems.
- **Autonomous Rapid Prototyping:** Students are proficient with the toolstack. Sprint velocity is higher. Week 1 starts at a complexity level that Week 11 Semester 1 sprints reached by Week 4.
- **Production Depth:** Semester 1 introduced containerization and CI/CD gates. Semester 2 goes deep: supply chain security (SBOM, dependency signing), NHI governance, OpenTelemetry observability, ECS/Kubernetes deployment.

---

## Learning Objectives

By the end of this course, students will be able to:

1. **Design and implement multi-agent architectures** that orchestrate specialized agents for complex cybersecurity tasks, comparing supervisor, hierarchical, debate, and swarm patterns.

2. **Evaluate and select appropriate agentic frameworks** (Claude Agent SDK, CrewAI, LangGraph) based on security requirements, workflow characteristics, and operational constraints.

3. **Conduct Collaborative Critical Thinking analysis** to design agent systems that are secure, efficient, and resilient to adversarial manipulation.

4. **Execute red team and blue team operations** targeting AI agents, including prompt injection, goal hijacking, tool misuse, and memory poisoning attacks.

5. **Implement guardrails, hardening, and defense strategies** to protect AI agents from adversarial manipulation while maintaining operational effectiveness.

6. **Apply MITRE ATLAS threat modeling** to identify, prioritize, and mitigate AI-specific cybersecurity risks in autonomous systems.

7. **Design and implement supply chain security** for AI systems, including model provenance, dependency management, and training data integrity verification.

8. **Govern non-human identities (NHI)** in multi-agent environments through authentication, authorization, and continuous audit mechanisms.

9. **Implement observability and monitoring** for agentic systems in production using OpenTelemetry, token tracking, cost management, and anomaly detection.

10. **Deploy agentic security systems** to production environments with CI/CD pipelines, containerization, canary deployments, and operational runbooks.

11. **Integrate ethical reasoning and responsible AI principles** into the design and operation of autonomous security systems.

12. **Build, test, and defend real-world agentic security solutions** that demonstrate mastery of the full system lifecycle from design to operation.

---

## Course Structure

### Weekly Format
Each week consists of two class sessions:
- **Day 1 — Theory & Foundations:** Conceptual foundations, historical context, case studies, guided discussions, and key concept development
- **Day 2 — Hands-On Lab:** Practical building using Claude Code and the course toolstack, with immediate prototyping, iteration, and deliverable completion

### Time Commitment
- Day 1 (Theory): 2 hours per week
- Day 2 (Lab): 4-6 hours per week
- Independent work: 4-6 hours per week
- **Total:** 10-14 hours per week, 160-224 hours over 16 weeks

### Unit Organization
- **Unit 5 (Weeks 1-4):** Advanced Multi-Agent Engineering — students already built basic agent teams; now they optimize, compare frameworks, and evaluate at scale
- **Unit 6 (Weeks 5-8):** Advanced Red Team / Blue Team + Wargame — students arrive with red team experience; this unit goes deeper into sophisticated multi-stage attacks, culminating in a full autonomous wargame
- **Unit 7 (Weeks 9-12):** Production Security Engineering (full depth) — supply chain deep, NHI governance deep, observability deep, deployment engineering deep; students already containerized, now they extend
- **Unit 8 (Weeks 13-16):** Capstone — full synthesis with AIUC-1 certification documentation, Assessment Stack justification, V&V architecture, and cost analysis

---

## Weekly Schedule

### Unit 5: Advanced Multi-Agent Engineering (Weeks 1-4)

*Students arrive having built a basic multi-agent SOC system in Semester 1 Weeks 9-10. This unit extends to framework comparison, optimization, and production-scale evaluation.*

| Week | Topic |
|------|-------|
| [Week 1: Multi-Agent Architecture Patterns](weeks/unit-5.md#week-1-multi-agent-architecture-patterns) | SDK deep dive: concurrent execution, cost optimization, per-agent benchmarking |
| [Week 2: CrewAI for Security Operations](weeks/unit-5.md#week-2-crewai-for-security-operations) | Role-based multi-agent framework compared to Claude Agent SDK |
| [Week 3: LangGraph for Stateful Workflows](weeks/unit-5.md#week-3-langgraph-for-stateful-security-workflows) | State machines and incident response; compare to Semester 1 pipeline pattern |
| [Week 4: Agent Evaluation and Benchmarking](weeks/unit-5.md#week-4-agent-evaluation-and-benchmarking) | Quantitative framework comparison: CPT, aMTTR, synthesis quality, ARR |

[→ View Full Unit 5 Content](weeks/unit-5.md)

---

### Unit 6: Advanced Red Team / Blue Team + Wargame (Weeks 5-8)

*Students arrive having done basic cross-team red teaming in Semester 1 Weeks 13-14. This unit goes deeper: sophisticated multi-stage attack chains, advanced defensive architectures, and a full autonomous wargame.*

| Week | Topic |
|------|-------|
| [Week 5: Adversarial AI Threat Landscape](weeks/unit-6.md#week-5-the-adversarial-ai-threat-landscape) | Advanced MITRE ATLAS: multi-stage attack chains, full PeaRL chain execution |
| [Week 6: Red Teaming AI Agents](weeks/unit-6.md#week-6-red-teaming-ai-agents--offensive-techniques) | Sophisticated offensive techniques beyond Semester 1: supply chain attacks, model poisoning |
| [Week 7: Defending AI Agents](weeks/unit-6.md#week-7-defending-ai-agents--guardrails-and-hardening) | Advanced defense: behavioral monitoring, anomaly detection, automated response |
| [Week 8: AI Attacker vs. Defender Wargame](weeks/unit-6.md#week-8-ai-attacker-vs-defender-wargame) | Full autonomous wargame: attack and defend pipelines running simultaneously |

[→ View Full Unit 6 Content](weeks/unit-6.md)

---

### Unit 7: Production Security Engineering (Full Depth) (Weeks 9-12)

*Students arrive having containerized a prototype and run basic CI/CD security gates in Semester 1 Week 15. This unit extends to full production depth: supply chain signing, NHI governance, OpenTelemetry observability, and ECS/Kubernetes deployment.*

| Week | Topic |
|------|-------|
| [Week 9: AI Supply Chain Security](weeks/unit-7.md#week-9-ai-supply-chain-security) | Supply chain deep: SBOM signing, model provenance, dependency integrity verification |
| [Week 10: Non-Human Identity Governance](weeks/unit-7.md#week-10-non-human-identity-nhi-governance) | NHI governance deep: per-agent credentials, rotation, audit, zero-trust for agents |
| [Week 11: Observability and Cost Management](weeks/unit-7.md#week-11-observability-cost-management-and-operational-excellence) | OpenTelemetry, distributed tracing, cost dashboards, anomaly alerting |
| [Week 12: Deploying Agentic Systems](weeks/unit-7.md#week-12-deploying-agentic-security-systems) | ECS/Kubernetes deployment, IaC, canary deployments, operational runbooks |

[→ View Full Unit 7 Content](weeks/unit-7.md)

---

### Unit 8: Capstone (Weeks 13-16)

*Full synthesis. Capstone deliverables include AIUC-1 certification documentation, Engineering Assessment Stack justification, V&V architecture, and cost analysis — the same frameworks carried throughout both semesters.*

| Week | Topic |
|------|-------|
| [Week 13: Capstone Kickoff and Architecture Reviews](weeks/unit-8.md#week-13-capstone-kickoff-and-architecture-reviews) | Proposal review against Assessment Stack; AIUC-1 coverage plan |
| [Week 14: Capstone Development Sprint I](weeks/unit-8.md#week-14-capstone-development-sprint-i) | Build with AIUC-1 baked in from start; Assessment Stack drives every decision |
| [Week 15: Capstone Sprint II and Red Team Review](weeks/unit-8.md#week-15-capstone-development-sprint-ii-and-red-team-review) | Full red team by peers; ARR measurement; V&V documentation complete |
| [Week 16: Capstone Presentations](weeks/unit-8.md#week-16-capstone-presentations-and-course-wrap) | Final demo + AIUC-1 certification checklist + Assessment Stack justification + cost analysis |

[→ View Full Unit 8 Content](weeks/unit-8.md)

---

### Detailed Week Content

For detailed content including lecture notes, labs, and deliverables for each week, please visit the unit documentation files linked above. The remaining content below focuses on assessment, policies, and course resources.

---

## Assessment Breakdown

Final grade calculation:

| Component | Weight | Due Week(s) | Description |
|-----------|--------|------------|-------------|
| Lab Exercises (12 labs) | 20% | 1-12 | Weekly lab deliverables and reports |
| Framework Comparison Report | 10% | 4 | Unit 5 evaluation comparing Claude Agent SDK, CrewAI, LangGraph |
| Red Team Exercise | 8% | 6 | Offensive security assessment of peer system |
| Blue Team Exercise | 7% | 7 | Defensive hardening and response |
| Capstone Project | 40% | 13-16 | Code, documentation, presentation, reflection |
| Peer Red Team Reviews | 10% | 15 | Quality of security review work on peer projects |
| Metrics and Improvement Tracking | 5% | 13-16 | Performance metrics throughout development |

**Letter Grade Scale:**
- A: 90-100%
- B: 80-89%
- C: 70-79%
- D: 60-69%
- F: Below 60%

---

## Course Policies

### Extra Credit: Production-Quality Deliverables

Throughout the course, you may earn extra credit by producing deliverables that go beyond the standard format:

- **Interactive dashboards** — Build a React or HTML dashboard to present your vulnerability assessment, bias analysis, or compliance audit findings instead of a markdown report. (Up to 5% bonus per instance, max 2 per semester)
- **Automated report generators** — Build a tool that produces formatted reports from raw data, rather than manually compiling results. (Up to 5% bonus)
- **Visualization-first presentations** — Create data visualizations that communicate findings more effectively than prose. (Up to 3% bonus)

Extra credit is assessed on: Does the deliverable communicate findings more effectively than the standard format? Is it reusable? Would a security team actually want to use this?

---

### Attendance and Participation
- Attendance at all lectures is expected
- Active participation in labs and team discussions is required
- Excused absences (illness, family emergency, etc.) should be communicated to instructor as soon as possible
- Unexcused absences may impact participation grade

### Assignment Submission
- All assignments due by end of stated deadline
- Late submissions may be accepted with 10% deduction per 24-hour period, up to 3 days late
- Assignments more than 3 days late receive zero credit (exceptions require instructor approval)
- All code must be committed to course repository with clear commit messages

### Academic Integrity
- All work must be original
- Collaboration is encouraged for labs, but individual understanding and contribution is required
- Code/documentation must not be copied from external sources without attribution
- Use of large language models (including Claude) is permitted and encouraged for coding assistance, but with proper attribution
- Violations of academic integrity will result in failing the course and possible disciplinary action

### Responsible Disclosure
- Any vulnerabilities discovered in course assignments or capstone projects must be documented and disclosed only within the course environment
- Findings may not be disclosed publicly or to external parties without instructor approval
- Focus is on building security skills, not finding zero-days

### Ethics of Offensive Security
- All offensive security techniques (red teaming, exploitation, etc.) are practiced ONLY against course-provided systems or student-built systems
- Absolutely no unauthorized testing against production systems or third-party systems
- Students who violate this policy will fail the course and face disciplinary action
- Focus is on defensive security principles and authorized assessments

### Classroom Conduct
- Respect diverse perspectives and backgrounds
- Constructive criticism of ideas is encouraged; personal attacks are not
- Maintain professional demeanor in all interactions
- Violations of this policy will be addressed according to university conduct standards

### Support and Accommodations
- Students with documented disabilities should contact disability services and inform the instructor
- Reasonable accommodations will be made to support equitable access to course materials
- Additional tutoring and office hours are available for students needing support

### Technology and Tools
- All students should have access to:
  - A computer capable of running Docker, Python, and development tools
  - Anthropic Claude API access (Claude Max subscription preferred for full agentic capabilities)
  - GitHub account for code repositories
  - Cloud computing credits (AWS, GCP, or Azure) for deployment (if needed)
- Cost of tools is student responsibility; financial hardship should be discussed with instructor

---

## Course Resources and Readings

### Required Texts and Documentation
- Claude Agent SDK Documentation: https://docs.anthropic.com/agents
- Model Context Protocol (MCP) Specification: https://modelcontextprotocol.io/
- CrewAI Documentation: https://docs.crewai.com/
- LangGraph Documentation: https://langchain-ai.github.io/langgraph/
- MITRE ATLAS Framework: https://atlas.mitre.org/

### Recommended Reading
- "Agentic AI's Impact on Cybersecurity" (arXiv, 2024-2025)
- "Disrupting AI-orchestrated Cyber Espionage" (Anthropic, Sept 2025)
- OWASP Top 10 for LLM Applications
- NIST Cybersecurity Framework and Zero Trust guidance
- "Non-Human Identities: The Silent Threat in Your Infrastructure"
- "The Three Pillars of Observability" and OpenTelemetry documentation
- NIST SP 800-61 Revision 2: Incident Response Lifecycle
- "The Hacker and the State" by Ben Buchanan (selected chapters)
- Papers on agent evaluation and red teaming language models
- Industry case studies on AI security and deployment

### Tools and Frameworks
- Claude Code (IDE and code execution)
- Claude Agent SDK (building agentic systems)
- CrewAI (role-based multi-agent framework)
- LangGraph (stateful workflow orchestration)
- OpenTelemetry (observability)
- Docker and containerization tools
- CI/CD platforms (GitHub Actions, GitLab CI, etc.)
- Vulnerability scanning tools (Snyk, OWASP Dependency-Check)
- Monitoring and logging platforms
- Promptfoo and custom evaluation harnesses

### Professional Organizations and Resources
- SANS Institute: cybersecurity training and resources
- (ISC)²: CISSP and other security certifications
- Cybersecurity and Infrastructure Security Agency (CISA): threat intelligence
- OpenSSF (Open Source Security Foundation): secure development practices
- Anthropic and other AI safety/security research organizations

---

## Contact and Support

**Instructor Office Hours:**
- Times and location TBD
- Drop-in availability or by appointment
- Available for technical questions, capstone guidance, career advice

**Teaching Assistants:**
- Available for lab support and technical questions
- Hours TBD

**Course Communication:**
- Primary: Course management system (Slack, Teams, or similar)
- Email: For formal communications and grade disputes
- GitHub Issues: For technical questions and lab setup issues

**Mental Health and Wellness:**
- University counseling services: [contact information]
- Peer support groups: [contact information]
- If you're struggling, reach out to instructor or advisors

---

## Course Modifications

This syllabus represents the instructor's current plans and intentions for this course. The instructor reserves the right to make reasonable adjustments to topics, readings, assessments, and policies during the semester to enhance student learning, address emergent topics in agentic AI security, or accommodate unforeseen circumstances. Students will be notified of any significant changes.

---

**Course Version:** 1.0
**Last Updated:** March 4, 2026
**Next Review:** September 2026
