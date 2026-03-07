# CSEC 602: AgentForge — Advanced Agentic Security Engineering
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
This course represents the second half of a year-long graduate sequence in advanced agentic security engineering. Building upon the fundamentals established in CSEC 601, this semester shifts focus from individual agent development to multi-agent orchestration, adversarial AI security, and production-ready system design. Students will orchestrate complex multi-agent systems, conduct offensive and defensive security operations with AI agents, and deploy autonomous security engineering systems to production environments.

The course emphasizes practical hands-on experience with cutting-edge tools in the agentic AI ecosystem, including the Claude Agent SDK, CrewAI, LangGraph, and Model Context Protocol (MCP). Students will build, evaluate, attack, defend, and deploy real agentic systems that solve tangible cybersecurity challenges.

### Key Terminology
- **Collaborative Critical Thinking (CCT):** The systematic application of structured reasoning to design robust agentic systems, considering agent interactions, failure modes, security boundaries, and ethical implications. This is distinct from "prompting" and represents deep architectural and design thinking.
- **Context Engineering:** The intentional design and management of information context, instruction clarity, and tool availability to shape agent behavior. This is distinct from "prompt engineering" and encompasses the broader challenge of engineering systems, not just text prompts.

### Lab Philosophy
Semester 2 labs maximize the capabilities of Claude Max subscriptions and the cutting-edge agentic toolstack:

- **Claude Code and Agent SDK:** Students leverage Claude's IDE, real-time code execution, worktrees for branch isolation, and the Agent SDK's subagent capabilities for orchestrating specialized agent teams.
- **Multi-Vendor Perspective:** Beyond Claude's ecosystem, students gain hands-on experience with CrewAI, LangGraph, and AutoGen to understand architectural trade-offs across frameworks.
- **Autonomous Rapid Prototyping:** By Semester 2, students are expected to be proficient with the agentic toolstack and are expected to prototype complex systems quickly, iterating on design through building rather than extensive planning.
- **Production Focus:** Labs shift from "proof of concept" to "production-ready," incorporating observability, error handling, deployment strategies, and operational considerations.

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
- **Unit 5 (Weeks 1-4):** Multi-Agent Orchestration for Security
- **Unit 6 (Weeks 5-8):** AI Attacker vs. AI Defender
- **Unit 7 (Weeks 9-12):** Production Security Engineering
- **Unit 8 (Weeks 13-16):** Capstone Projects

---

## Weekly Schedule

### Unit 5: Multi-Agent Orchestration for Security (Weeks 1-4)

| Week | Topic |
|------|-------|
| [Week 1: Multi-Agent Architecture Patterns](weeks/unit-5.md#week-1-multi-agent-architecture-patterns) | Single-agent limitations and multi-agent patterns |
| [Week 2: CrewAI for Security Operations](weeks/unit-5.md#week-2-crewai-for-security-operations) | Role-based multi-agent framework |
| [Week 3: LangGraph for Stateful Workflows](weeks/unit-5.md#week-3-langgraph-for-stateful-security-workflows) | State machines and incident response |
| [Week 4: Agent Evaluation and Benchmarking](weeks/unit-5.md#week-4-agent-evaluation-and-benchmarking) | Quantitative metrics and testing |

[→ View Full Unit 5 Content](weeks/unit-5.md)

---

### Unit 6: AI Attacker vs. AI Defender (Weeks 5-8)

| Week | Topic |
|------|-------|
| [Week 5: Adversarial AI Threat Landscape](weeks/unit-6.md#week-5-the-adversarial-ai-threat-landscape) | Threat modeling with MITRE ATLAS |
| [Week 6: Red Teaming AI Agents](weeks/unit-6.md#week-6-red-teaming-ai-agents--offensive-techniques) | Offensive security assessment techniques |
| [Week 7: Defending AI Agents](weeks/unit-6.md#week-7-defending-ai-agents--guardrails-and-hardening) | Guardrails, hardening, and defense strategies |
| [Week 8: AI Attacker vs. Defender Wargame](weeks/unit-6.md#week-8-ai-attacker-vs-defender-wargame) | Full security competition |

[→ View Full Unit 6 Content](weeks/unit-6.md)

---

### Unit 7: Production Security Engineering (Weeks 9-12)

| Week | Topic |
|------|-------|
| [Week 9: AI Supply Chain Security](weeks/unit-7.md#week-9-ai-supply-chain-security) | Model provenance and dependency management |
| [Week 10: Non-Human Identity Governance](weeks/unit-7.md#week-10-non-human-identity-nhi-governance) | Authentication and authorization for agents |
| [Week 11: Observability and Cost Management](weeks/unit-7.md#week-11-observability-cost-management-and-operational-excellence) | Production monitoring and optimization |
| [Week 12: Deploying Agentic Systems](weeks/unit-7.md#week-12-deploying-agentic-security-systems) | CI/CD, containerization, and operations |

[→ View Full Unit 7 Content](weeks/unit-7.md)

---

### Unit 8: Capstone Projects (Weeks 13-16)

| Week | Topic |
|------|-------|
| [Week 13: Capstone Kickoff and Architecture Reviews](weeks/unit-8.md#week-13-capstone-kickoff-and-architecture-reviews) | Proposal and architectural design |
| [Week 14: Capstone Development Sprint I](weeks/unit-8.md#week-14-capstone-development-sprint-i) | Building the core system |
| [Week 15: Capstone Sprint II and Red Team Review](weeks/unit-8.md#week-15-capstone-development-sprint-ii-and-red-team-review) | Hardening and peer security assessment |
| [Week 16: Capstone Presentations](weeks/unit-8.md#week-16-capstone-presentations-and-course-wrap) | Final demo and reflection |

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
