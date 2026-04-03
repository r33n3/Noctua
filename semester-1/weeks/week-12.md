# Week 12: Privacy, Data Governance, and AI Security Policy

**Semester 1 | Week 12 of 16**

## Learning Objectives

- Understand privacy risks in AI security systems
- Learn privacy-preserving techniques (differential privacy, federated learning)
- Apply data governance frameworks to AI systems
- Navigate the regulatory landscape (EU AI Act, NIST Cyber AI Profile, GDPR)
- Write a comprehensive AI security policy

---

## Day 1 — Theory

> **Transfer path: Cedar to Rego.** The organizations you'll work in may use OPA with Rego policies rather than Cedar. The concepts transfer directly — policy-as-code, permit/deny rules, entity-based authorization — but the syntax and data model differ. Three things to learn when moving from Cedar to Rego: (1) Rego uses a logic-programming model (rules derive facts); Cedar uses a simpler permit/forbid model. (2) Rego policies are more expressive but harder to analyze statically. (3) Cedar's formally verifiable properties (guaranteed termination, no side effects) don't apply to Rego. If you join a team using OPA/Rego, your Cedar mental model will transfer — the syntax won't.

### Privacy in Security AI Systems

Security agents process highly sensitive data: system logs, network traffic, user behavior, customer information. This data is necessary for security but creates privacy risks:
- **Inference attacks:** An attacker observes model outputs and infers sensitive information about individuals in the training data
- **Training data extraction:** An attacker tricks the model into revealing training data
- **Model inversion:** An attacker reconstructs private features (e.g., faces from facial recognition models)

> **Key Concept:** Privacy in AI is not a "nice-to-have" — it's a regulatory requirement (GDPR Article 22 requires human review of automated decisions affecting people; EU AI Act requires privacy impact assessments). Organizations that collect user data and deploy AI must protect privacy or face substantial penalties (up to 4% of global revenue under GDPR).

### Privacy Risks Specific to Security AI

**Scenario 1: Inference Attack on Threat Model**

A threat detection model is trained on historical incidents from enterprise customers. An attacker queries the model with slightly different inputs and observes how predictions change. Through careful experimentation, the attacker infers that:
- Customer X had an incident of type Y (confidential information)
- Customer X was affected by vulnerability Z
- This is valuable competitive intelligence

**Scenario 2: Model Inversion**

An attacker uses a behavioral profiling model to infer individual user behaviors. By querying the model with different inputs, the attacker reconstructs which users access which systems at what times. This reveals organizational structure and operation security measures.

**Scenario 3: Data Retention**

A security agent stores detailed logs of every decision it made and every tool it called. These logs include full network traffic, system commands, and user actions. If the logs are retained indefinitely, they become a liability: a breach exposes years of operational history.

### Privacy-Preserving Techniques

**Differential Privacy**

The most theoretically sound privacy technique. It provides a *formal mathematical guarantee* that adding noise to data does not leak sensitive individual information:

```
Differential Privacy Definition:
A mechanism M is ε-differentially private if, for any two datasets
differing in one row, the probability distributions of outputs are similar:

P(M(D) = x) / P(M(D') = x) ≤ e^ε

Interpretation: If you know the output of the mechanism, you can't be
much more confident about whether any particular individual's data was
in the dataset.

In practice: Add Laplace noise proportional to the "sensitivity" of the
query. Sensitivity = how much one person's data can change the query result.
```

> **Key Concept:** Differential privacy adds noise to outputs so that removing any single person's data doesn't significantly change the result. The noise is calibrated to the "sensitivity" (how much one person's data can shift the output). Smaller ε = more privacy, more noise, less accuracy.

**Architecture: Applying Differential Privacy**

To implement differential privacy for a threat scoring system:
1. **Measure sensitivity:** How much can one user's presence/absence change the threat score?
2. **Choose privacy budget ε:** Higher ε allows less noise (more accurate). Lower ε requires more noise (more privacy).
3. **Add Laplace noise:** Use `numpy.random.laplace` with scale = sensitivity / epsilon
4. **Output the noisy result:** This is now ε-differentially private

**Claude Code Prompt for Differential Privacy:**

```
I'm implementing differential privacy for my threat scoring system.

Context:
- My threat score ranges 0.0–1.0
- A single user's behavior can change the score by at most 0.1 (sensitivity = 0.1)
- I want ε = 1.0 privacy budget (moderate privacy)

I need to:
1. Implement a function that takes a true threat score and returns a noisy version
2. Use Laplace noise with appropriate scale
3. Explain what ε-differential privacy means
4. Show the trade-off: with ε=1.0, how much noise is added? How does accuracy degrade?
5. Show what happens with ε=0.5 (stronger privacy, more noise)

Provide working Python code with clear comments.
```

The key trade-off: more privacy (lower ε) means more noise, which makes threat scores less precise. You must choose a privacy budget that balances user privacy with operational effectiveness.

> **Discussion Prompt:** Why is differential privacy useful for aggregated statistics (e.g., "threat frequency by region") but more challenging for individual decisions (e.g., "should I grant this user access")? What is the trade-off between privacy and decision quality?

**Federated Learning**

Train models on distributed data without centralizing it. Each organization trains locally, only sharing model updates:

```
Federated Learning Process:

1. Central server sends initial model to all organizations
2. Each organization trains on its local data (no sharing)
3. Each organization sends only model updates to central server
4. Central server averages updates and broadcasts the improved model
5. Repeat

Benefit: Raw data never leaves the organization
Limitation: Slower training, requires synchronization
```

**Data Minimization**

The simplest privacy technique: only collect and retain data you actually need.
- Threat detection doesn't need full payload data; flow-level statistics are often sufficient
- Risk scoring doesn't need individual user behavior logs; aggregated group statistics work
- Incident investigation needs detailed logs, but only for investigation period (not indefinite retention)

> **Regulatory Retention Requirements for Agent Memory**
>
> These requirements apply to conversation history, tool results, scratchpad files, and vector DB entries — anywhere regulated data appears. "We didn't know it was stored there" is not a defense.
>
> | Regulation | Data Type | Retention Period | Key Requirement |
> |---|---|---|---|
> | HIPAA | PHI in any form, including AI-generated clinical documentation | 6 years | Applies to AI-assisted clinical notes, diagnostic summaries, treatment recommendations |
> | PCI DSS | Audit logs containing cardholder data | 1 year | 3 months immediately accessible; full year available on demand |
> | SOX | Financial records including AI-assisted decisions | 7 years | If an AI agent influenced a financial decision, that interaction log may be in scope |
> | GDPR | Any personal data of EU data subjects | Data minimization + right to erasure | No fixed period — but deletion must be verifiable with a proof-of-deletion audit record (Art. 17) |
>
> **Agent memory implication:** If your agent's conversation history or scratchpad files contain PHI, cardholder data, or financial decisions, those files are in scope for the regulation. Design your memory architecture with retention and deletion built in from the start — retrofitting is significantly harder.

### Data Governance Framework

A data governance framework defines how data is classified, accessed, and retained:

**Data Classification:**
- **Public:** No sensitivity; can be shared freely (e.g., threat intelligence feeds)
- **Internal:** Sensitive to organization; restricted to employees (e.g., security architecture docs)
- **Confidential:** Highly sensitive; restricted to authorized personnel (e.g., incident logs)
- **Secret:** Maximum sensitivity; restricted to leadership and compliance (e.g., custom signatures for 0-days)

**Access Controls:**
- Public: Anyone
- Internal: Employees
- Confidential: Authorized security staff (need-to-know)
- Secret: CTO, CISO, compliance officer

**Retention:**
- Threat intelligence: Keep for 5+ years (train models)
- Incident logs: Keep for 2 years (investigation, compliance)
- User activity logs: Keep for 6 months (anomaly detection)
- PII: Delete immediately after incident investigation (minimize exposure)

**Audit:**
- All data access is logged
- Unusual access patterns are flagged
- Compliance audits check adherence to retention policy

### Regulatory Landscape

**EU AI Act (2024)**

The first comprehensive AI regulation. It classifies AI systems by risk and applies proportional requirements:
- **Prohibited Risk:** General-purpose manipulative AI (deep fakes, micro-targeting politicians)
- **High Risk:** AI affecting people's fundamental rights (hiring, credit, parole, security access). Requires: documentation of design and training, conformity assessment by third party, performance testing and monitoring, human oversight procedures, transparency and appeal mechanisms
- **Limited Risk:** AI with transparency risks (chatbots). Requires: disclosure that it's AI, clear identification of AI-generated outputs
- **Minimal Risk:** Everything else (no requirements)

*Application to security AI:* A threat detection or access control system would likely be classified as "High Risk" because it affects security decisions. The organization must implement monitoring, testing, and human oversight.

Further Reading: The [EU AI Act](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689) is surprisingly readable for a regulation. Sections 4–6 detail requirements for high-risk AI.

**NIST Cyber AI Profile**

NIST's guidance for responsible AI in cybersecurity (Dec 2025 draft). It maps to NIST AI RMF and provides concrete guidance for:
- Governance: Establishing AI review boards and approval processes
- Map: Documenting AI systems and their risks
- Measure: Implementing continuous monitoring and performance tracking
- Manage: Incident response and remediation procedures

**AIUC-1: The First AI Agent Standard**

While the EU AI Act and NIST frameworks address AI systems broadly, **AIUC-1** (https://www.aiuc-1.com/) is the world's first standard specifically designed for **AI agent systems**. Developed by a consortium of 60+ CISOs with founding contributions from former Anthropic security experts, MITRE, and the Cloud Security Alliance, AIUC-1 provides the certification framework that bridges the gap between regulatory intent and agent-specific implementation.

> **Key Concept:** AIUC-1 closes a critical gap: NIST AI RMF tells you *what* to govern, EU AI Act tells you *why* you must govern, but neither tells you *how* to certify AI agents specifically. AIUC-1's six domains provide the *how* — concrete control objectives designed for autonomous agent behavior, not just static AI models.

**The Six AIUC-1 Domains:**
1. **Data & Privacy** — Agent data handling, consent management, data minimization for autonomous operations
2. **Security** — Agent authentication, authorization, tool access controls, supply chain integrity
3. **Safety** — Behavioral boundaries, graceful degradation, human override mechanisms
4. **Reliability** — Performance consistency, failure recovery, output quality assurance
5. **Accountability** — Audit trails, decision attribution, governance chain documentation
6. **Society** — Fairness, bias mitigation, societal impact assessment, transparency

**AIUC-1 + NIST AI RMF Alignment:**

| NIST AI RMF Function | AIUC-1 Domain(s) | How They Connect |
|---|---|---|
| Govern | Accountability, Society | Organizational governance structures and societal responsibility |
| Map | Data & Privacy, Security | Identifying agent risks, data flows, and attack surfaces |
| Measure | Reliability, Safety | Testing agent performance, behavioral boundaries, failure modes |
| Manage | Security, Safety, Accountability | Implementing controls, monitoring, incident response |

**OWASP AI Vulnerability Scoring System (AIVSS)**

Complementing AIUC-1's control framework, the **OWASP AI Vulnerability Scoring System (AIVSS)** extends CVSS for AI-specific vulnerabilities. While CVSS works well for traditional software vulnerabilities, it cannot capture risks unique to AI agents: prompt injection severity, context poisoning impact, tool misuse potential, or autonomous decision-making failures.

AIVSS defines **10 core risk categories** that map directly to AIUC-1 domains, creating a closed-loop workflow:
1. **Identify** a vulnerability using AIVSS scoring (e.g., "prompt injection in tool-calling agent scores 8.2 AIVSS")
2. **Map** the vulnerability to the relevant AIUC-1 domain (Security domain, control objective SC-3)
3. **Select** controls from AIUC-1 that address the vulnerability
4. **Verify** implementation through AIUC-1 certification audit

> **Discussion Prompt:** Your organization deploys an autonomous threat detection agent. Using AIUC-1's six domains, what controls would you implement for each? Which domain requires the most attention for a security-focused agent, and why?

**GDPR (General Data Protection Regulation)**

GDPR Article 22 prohibits fully automated decision-making affecting individuals without human review, with limited exceptions. Application to security:
- If an AI access control system denies an employee access, the employee has a right to human review
- If a behavioral analytics system flags a user as suspicious, the user should be notified and have opportunity to respond
- Penalties: Up to €20 million or 4% of global revenue, whichever is higher

**PCI-DSS, HIPAA, SOX**

Industry-specific regulations with AI implications:
- **PCI-DSS (Payment Card Industry):** Requires transparency in fraud detection systems; merchants have right to appeal
- **HIPAA (Healthcare):** Prohibits using AI in high-stakes decisions without explainability; requires impact assessments
- **SOX (Sarbanes-Oxley):** Requires CEOs to certify financial controls; AI affecting financial reporting must be auditable

### Policy Writing Framework

An AI Security Policy should address:
1. **Governance:** Who decides on AI deployments? Committee structure?
2. **Model Selection:** Which models are approved? What security properties must they have?
3. **Tool Management:** How are MCP servers and integrations vetted?
4. **Agent Permissions:** What systems can agents access? For what duration?
5. **Data Handling:** How is sensitive data protected? How long is it retained?
6. **Privacy:** Are differential privacy or federated learning techniques applied?
7. **Incident Response:** What happens if an agent makes a bad decision?
8. **Human Oversight:** Which decisions require human review? What is the escalation path?
9. **Audit and Monitoring:** What is logged? Who reviews logs?
10. **Training and Accountability:** How are staff trained? Who is responsible?
11. **Compliance:** How does the policy align with EU AI Act, NIST, GDPR, and AIUC-1?
12. **AIUC-1 Domain Mapping:** Which AIUC-1 domains does each agent system touch? What controls are required?
13. **AIVSS Risk Scoring:** How are AI-specific vulnerabilities scored and prioritized?
14. **Appeal Mechanisms:** How can users or stakeholders challenge AI decisions?

> **Key Concept:** Governance policies should be **Specs as Source Code** — not prose documents gathering dust on a server. From Agentic Engineering practice, "Specs as Source Code" means that policy requirements are executable, testable, and machine-readable. Policies written this way can be integrated into deployment pipelines: "Deploy this agent only if the policy checklist passes." This transforms governance from a compliance checkbox into a design requirement that shapes how agents are built.

---

## Day 2 — Lab: Write Your Organization's AI Security Policy

**Lab Goal:** Produce a complete, deployable AI Security Policy document covering scope, approved uses, governance, data handling, audit requirements, and incident response. This policy will govern the agent systems you build in Units 3-8.

### Part 1: Policy Writing (90 minutes)

You will write a comprehensive AI Security Policy for a fictional organization:

**Organization Context (Provided):**
- Mid-sized financial services firm (500 employees)
- Deploying agentic security tools for threat detection, incident response, and access control
- Processes sensitive customer data (accounts, transactions, addresses)
- Must comply with GDPR (EU customers), PCI-DSS (payment card data), and local regulations
- Security incidents in the past year: 2 breaches affecting 500+ customers, 15+ attempted breaches

**Policy Template:**

```markdown
# AI Security Policy
## Organization: [Name]
## Version: 1.0
## Effective Date: [Date]
---

## 1. Executive Summary
[1-2 paragraphs] Briefly describe the organization's approach to AI
and the key risks/mitigations.

## 2. Governance & Decision-Making
- **AI Governance Committee:** Who decides on AI deployments?
  - Membership: [CISO, CTO, Compliance Officer, Security Lead, ...]
  - Meeting frequency: [Monthly review of deployments]
  - Authority: [Approve all "High Risk" AI systems per EU AI Act]
  - Escalation: [Decisions escalated to CEO if...?]

- **Approval Process:**
  - All new AI systems must be submitted for review
  - Submission includes: System description, risk assessment, compliance checklist
  - Review committee evaluates against this policy
  - Approval valid for [12 months]; regular re-assessment required

## 3. Model and Tool Selection
- **Approved Models:**
  - [List approved LLMs, detection models, etc.]
  - Why approved: [Security properties, auditability, vendor track record, ...]

- **Evaluation Criteria:**
  - Explainability: Can we understand decisions?
  - Fairness: Have we tested for bias?
  - Robustness: How does it handle adversarial inputs?
  - Compliance: Does it meet regulatory requirements?

- **Prohibited Models:**
  - [List models/approaches that are not allowed]

## 4. Agent Permissions & Scope
- **Agent Categories:**
  - **Investigation Assistants:** Read-only access to logs; cannot take actions
  - **Detection Agents:** Read access to network/endpoint data; can flag anomalies; cannot isolate/block
  - **Response Agents:** Can recommend actions (isolate, block, quarantine); requires human approval

- **Permission Model:**
  - Each agent has a minimal capability set: [List for each category]
  - Access is time-bound: [Agents lose access after X hours/days]
  - Critical actions require [number] humans to approve

- **Escalation Thresholds:**
  - [Agent can autonomously act if confidence > X and impact < Y]
  - [Agent must escalate to human if...]

## 5. Data Handling & Privacy
- **Data Classification:** [Per framework above]
  - Confidential: Incident logs, user activity
  - Internal: Security architecture, threat models
  - Public: Threat intelligence, industry reports

- **Data Minimization:**
  - [Specify for each system: "Threat detection uses only flow-level statistics, not full payloads"]
  - [Retention: "Incident logs retained for 2 years; PII purged after 6 months"]

- **Privacy-Preserving Techniques:**
  - [Differential privacy applied to threat scores (ε=1.0)]
  - [Logs aggregated by region/department, not by individual]
  - [User behavior models trained on federated data]

- **Data Access:**
  - [Only authorized security staff can access incident logs]
  - [All access is logged and audited monthly]
  - [Unusual access patterns trigger investigation]

- **Breach Response:**
  - [If data accessed without authorization: notify affected customers within 72 hours per GDPR]

## 6. Incident Response
- **Agent Failure:** If an agent makes a bad decision (false positive, unfair, etc.):
  1. Decision is logged and marked as suspect
  2. Incident response team investigates root cause
  3. Mitigations are implemented (model update, process change, etc.)
  4. Affected parties are notified and offered appeal/remedy

- **Model Drift:** If agent performance degrades over time:
  1. Monitoring dashboard alerts if accuracy drops > [X%]
  2. Agent is paused pending investigation
  3. Model is retrained or rolled back

- **Security Incident:** If agent is compromised:
  1. All actions taken by agent in past [X] hours are reviewed
  2. Any harmful actions are undone
  3. Root cause investigation
  4. Enhanced monitoring is activated

## 7. Human Oversight & Approval
- **Decision Categories:**
  - **Autonomous:** Information gathering, anomaly flagging (no human review)
  - **Recommended:** Actions affecting security (require human approval)
  - **Critical:** Actions affecting availability or user access (require [N] humans)

- **Approval Workflow:**
  - [For each category, specify who approves, what evidence they need, timeline]

- **Appeal Process:**
  - [Users can appeal AI decisions affecting them]
  - [Appeals are reviewed by human within X days]
  - [Process is documented]

## 8. Audit, Monitoring, Logging
- **Logging Standards:**
  - All AI decisions are logged with: input, reasoning, tools called, output
  - Logs include metadata: timestamp, model version, temperature/config
  - Logs are retained for [X] years

- **Audit Procedures:**
  - [Monthly review of agent decisions]
  - [Quarterly bias audits (measure fairness metrics)]
  - [Annual security assessment of agents and tools]
  - [Compliance audit against this policy]

- **Anomaly Detection:**
  - [Dashboard showing: decision rate by subgroup, false positive rate, tool error rate]
  - [Alerts if any metric deviates from baseline]

## 9. Training & Accountability
- **Staff Training:**
  - All security staff using AI tools receive training on:
    - How the tool works and its limitations
    - How to interpret and evaluate recommendations
    - How to escalate concerns
  - [Annual refresher training]

- **Accountability:**
  - [Security leads are responsible for agent behavior]
  - [CISO is responsible for policy enforcement]
  - [Compliance officer monitors regulatory adherence]
  - [Clear documentation of who made each significant decision]

## 10. Compliance Mapping
- **EU AI Act:**
  - [High-risk systems are documented and approved per Article 6]
  - [Monitoring and performance testing per Article 28]
  - [Human oversight per Article 14]

- **GDPR:**
  - [Article 22 human review: Yes, implemented for access decisions]
  - [Data protection impact assessment completed: Yes, attached]
  - [Data retention policy: [X] years]

- **NIST AI RMF:**
  - [Govern: Governance structure per Section X]
  - [Map: System documentation per Section X]
  - [Measure: Performance monitoring per Section X]
  - [Manage: Incident response per Section X]

- **Industry-Specific:**
  - [PCI-DSS: Fraud detection system meets Section X requirements]

## 11. Policy Governance
- **Review Cycle:** Annual or as needed
- **Amendment Procedure:** [Changes require AI Governance Committee approval]
- **Version History:** [Track changes]
```

> **Pro Tip:** Start by answering the core question: "For this organization, what could go wrong with AI, and how do we prevent it?" Then fill in the policy based on that risk assessment.

### Lab Steps

**Step 1: Download and review the NIST AI Policy Template**

Download NIST's AI Risk Management Framework playbook. Review the policy templates in Appendix A. These form the foundation for your organization's policy. Identify which sections directly apply to the agent systems you've built in Units 1-3.

```bash
# Create policy directory
mkdir -p ~/noctua-labs/unit3/week12
cd ~/noctua-labs/unit3/week12

# Download NIST AI RMF playbook (link from course reading list)
# Review and annotate: which sections apply to your MCP server?
```

**Step 2: Use Claude Code to generate a policy draft**

```
# Claude Code prompt:
# "Write a complete AI Security Policy for Noctua Labs,
# a security operations team using agentic AI tools including
# Claude Code, MCP servers, and multi-agent systems.
# The policy must: cite AIUC-1 domains, address OWASP
# agentic top 10 risks, require audit logging for all tool calls,
# establish a governance process for deploying new AI capabilities,
# define data handling rules for PII in security contexts.
# Format as a professional policy document."
```

**Step 3: Verify the policy covers all six AIUC-1 domains**

Review your draft against the AIUC-1 domains checklist. For each domain, highlight where the policy addresses it. If any domain has no corresponding policy language, draft that section.

**Step 4: Add the AI Incident Response section**

Draft a specific AI Incident Response procedure: what to do when an AI agent takes an unexpected action, when a prompt injection attack is suspected, when bias or fairness violation is detected. Reference the NIST SP 800-61 Rev 2 lifecycle (Preparation → Detection → Containment → Recovery → Post-Incident).

**Step 5: Peer review exchange**

Exchange your policy draft with a classmate. Each reviewer should: (1) identify any AIUC-1 domains not addressed, (2) find any prohibited-use cases not covered, (3) test the policy against a real scenario ("Can I use Claude Code to process PII for threat analysis?") and verify the policy gives a clear answer.

### Part 2: Data Governance Application (30 minutes)

For your organization, create a data governance matrix:

| Data Type | Classification | Retention | Access | Audit |
|---|---|---|---|---|
| Network logs | Confidential | 2 years | Security staff | Monthly review |
| Incident reports | Confidential | 2 years | Authorized staff | All access logged |
| User activity | Confidential | 6 months | CISO/analysts | [monthly] |
| Threat intelligence | Internal | 5 years | All security staff | Quarterly |
| System configurations | Confidential | Indefinite | DevSecOps | Change log |
| Customer data | Secret | Per GDPR | [minimal] | Real-time |

For **Confidential** data processed by agents:
- Data minimization: What is the minimum data required? Can you aggregate, anonymize, or sample?
- Privacy preservation: Can you apply differential privacy? Federated learning?
- Retention: How long do you need to keep raw data? (Aggregate stats longer than raw data)

### Part 3: Compliance Checklist (20 minutes)

Create a checklist confirming your policy addresses all requirements:

```
[ ] EU AI Act compliance
    [ ] High-risk AI systems are documented
    [ ] Conformity assessment plan
    [ ] Performance monitoring and testing
    [ ] Human oversight procedures
    [ ] Transparency and documentation
    [ ] Appeal mechanism

[ ] GDPR compliance
    [ ] Article 22 human review for automated decisions
    [ ] Data protection impact assessment
    [ ] Retention policy
    [ ] Breach notification procedures
    [ ] Data subject rights (access, deletion, explanation)

[ ] NIST AI RMF
    [ ] Governance structure
    [ ] System documentation and risk mapping
    [ ] Performance measurement and monitoring
    [ ] Incident response procedures

[ ] FS-ISAC Responsible AI Principles
    [ ] Safe/Secure/Resilient: Safeguards and resilience testing
    [ ] Explainable/Interpretable: Documentation and explainability
    [ ] Privacy-Enhanced: Data minimization and privacy techniques
    [ ] Fair/Bias-Managed: Bias testing and fairness monitoring
    [ ] Valid/Reliable: Validation and drift detection
    [ ] Accountable/Transparent: Audit trails and accountability

[ ] AIUC-1 AI Agent Standard
    [ ] Data & Privacy: Agent data handling, consent, data minimization
    [ ] Security: Agent authentication, authorization, tool access, supply chain
    [ ] Safety: Behavioral boundaries, graceful degradation, human override
    [ ] Reliability: Performance consistency, failure recovery, output quality
    [ ] Accountability: Audit trails, decision attribution, governance documentation
    [ ] Society: Fairness, bias mitigation, societal impact, transparency

[ ] OWASP Top 10 for Agentic Applications
    [ ] Excessive Agency: Human oversight for critical decisions
    [ ] Insufficient Guardrails: Constraints and behavioral testing
    [ ] Insecure Tool Integration: Input validation and tool sandboxing
    [ ] Lack of Output Validation: Output checking and fact-verification
    [ ] Prompt Injection: Input sanitization and prompt constraints
    [ ] Memory Poisoning: Access controls and integrity checking
    [ ] Supply Chain Vulnerabilities: Dependency auditing and vendor assessment
    [ ] Insufficient Logging: Comprehensive audit trails
    [ ] Over-reliance on AI: Human review and verification procedures
    [ ] Inadequate IAM: Access controls and credential management

[ ] OWASP AI Vulnerability Scoring System (AIVSS)
    [ ] Vulnerabilities scored using AIVSS framework (not just CVSS)
    [ ] Mapped to AIUC-1 domains
    [ ] Prioritized and remediated based on AIVSS severity
```

### Week 12 Cedar Lab: Full Policy Deployment

**Cedar Step 1: Review what can and cannot be expressed in Cedar**

Ask Claude Code: "I have an AI security policy document. Help me identify which requirements can be expressed as Cedar policies and which must remain as operational procedures or application-layer controls." Work through your `ai-security-policy.md` from this unit. Not everything translates to executable policy — and knowing the boundary is part of the skill.

**Cedar Step 2: Write your production Cedar policy**

Using your Week 9 Cedar work as a foundation, write a complete Cedar policy in `cedar-policies/noctua-ai-security-policy.cedar` covering:
- Tool invocation authorization (who can call which tools)
- Data access controls (what data can each agent role access)
- At least one hard `forbid` rule (something that must never be permitted, regardless of other conditions)

Cedar's permit/forbid asymmetry: a `forbid` rule cannot be overridden by a `permit` rule. Use `forbid` for your hardest security boundaries.

**Cedar Step 3: Document the boundary**

For each policy requirement that cannot be expressed in Cedar, document: what the requirement is, why Cedar can't express it, and what control mechanism will enforce it instead (application-layer check, operational procedure, infrastructure control). Add this as a section at the bottom of your `ai-security-policy.md`.

**Cedar Step 4: Forward reference — Unit 7 deployment**

In Semester 2, Unit 7, these Cedar policies are deployed to Amazon Verified Permissions — a managed Cedar evaluation service. The policies you write here become production enforcement. Keep your `cedar-policies/` directory organized; you'll import it directly in Unit 7. Verify your directory contains: `schema.cedarschema`, `aiuc1-b-domain.cedar` (from Week 9), `noctua-ai-security-policy.cedar` (from this step), and `test-entities.json`.

### Context Library: Governance & Compliance Templates

In Unit 3, you've explored ethical AI, responsible principles, governance frameworks, and data handling. Now it's time to capture the governance patterns and decision frameworks that emerge — not just code patterns, but **organizational decision templates, audit checklists, bias testing configurations, regulatory mapping matrices**. These are reusable across organizations and projects.

> **Key Concept:** Your context library isn't just code. It's your personal reference for governance too. When you design an audit checklist that works, save it. When you build a privacy impact assessment template, capture it. When you map AIUC-1 domains to technical controls, extract that mapping. Next project, you don't start from scratch — you adapt your proven templates.

**Expand Your Context Library**

Add new directories to your existing `context-library/`:

```bash
mkdir -p ~/context-library/governance/{policy-templates,audit-checklists,compliance-mappings}
mkdir -p ~/context-library/governance/bias-testing
```

**Unit 3 Task: Extract Governance Patterns**

In this unit, you've refined:
1. **Policy Template Structure:** The sections and content that make a good AI Security Policy
2. **Audit Checklist:** Questions and criteria for evaluating AI system compliance
3. **Regulatory Mapping:** How frameworks like AIUC-1, NIST AI RMF, EU AI Act, GDPR translate to technical controls
4. **Bias Testing Configuration:** Test cases, metrics, and evaluation criteria for fairness

Add to `context-library/governance/policy-templates/ai-security-policy.md`:

```markdown
# AI Security Policy Template

## Standard Sections
[Your refined template with all 11 sections]

## Key Decision Frameworks
[Governance committee structure, approval workflows, escalation thresholds]

## Examples
[Clauses from Unit 3 that were particularly effective]
```

Add to `context-library/governance/audit-checklists/ai-system-audit.md`:

```markdown
# AI System Compliance Audit Checklist

## AIUC-1 Domains
- [ ] A. Data & Privacy: [data minimization, PII protection, consent questions]
- [ ] B. Security (B001-B009): [adversarial robustness, input filtering, access control]
- [ ] C. Safety, D. Reliability, E. Accountability, F. Society

## OWASP Top 10 for Agentic Applications
- [ ] Excessive Agency: [how to verify human oversight]
- [ ] Prompt Injection: [test cases]
- [ ] ... other items

## Audit Scoring & Evidence
[How to document findings, rate severity, track remediation]
```

---

## Deliverables

1. **`ai-security-policy.md`** — complete, peer-reviewed AI Security Policy for Noctua Labs
2. **`cedar-policies/noctua-ai-security-policy.cedar`** — executable Cedar version of your policy
3. **Peer Review Notes** — gaps identified in your peer's policy and in your own
4. **Unit 3 Reflection** (500 words) — how have ethics, bias, and privacy considerations changed how you would design agent systems? Cite specific examples from your labs.

---

## Unit 3 Complete

**What you mastered:**
- AIUC-1 audit methodology (design-time, not post-build)
- OWASP Top 10 for LLM and Agentic applications testing
- Bias detection, analysis, and organizational remediation
- Cedar policy authoring: schema, permit rules, forbid rules, policy-vs-enforcement gap

**What was introduced (returns later):**
- Amazon Verified Permissions (Cedar in production) — Unit 7
- PeaRL governance model integration — Unit 7

**What's waiting next:**

Unit 4 applies everything you've built under the ethical constraints you just defined — your sprint prototype must pass the Unit 3 pre-check before the first line of code is written.

> **Cedar bridge to Semester 2:** The Cedar policies you authored in Week 12 are not theoretical. In Semester 2, Unit 7 (Hardening), you'll deploy them to Amazon Verified Permissions — a managed Cedar policy evaluation service that enforces your policies at every agent invocation. Keep your `cedar-policies/` directory organized. You'll import it directly in Unit 7.

---

> **Study With Claude Code:** Use Claude Code to work through concepts:
> - "Quiz me on the regulatory landscape (EU AI Act, GDPR, NIST AI RMF). Start easy, then get harder."
> - "I think I understand differential privacy but I'm not sure about the ε parameter. Explain it to me differently and then test whether I really get it."
> - "What are the three most common mistakes teams make when writing AI security policies? Do I have any of them?"
> - "Connect this week's policy work to the AIUC-1 domains we audited in Week 9. How do they map?"

---

> **Produce this deliverable using your AI tools.** Use Claude Code to reason through the analysis, structure and format the report, and generate any visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.
