# Module: Production Security Engineering (S2 Unit 7)

## Purpose
Closes the gap between "it works in a lab" and "it runs in production." Students build the operational infrastructure that makes agentic systems trustworthy: secure supply chains, non-human identity governance, observability, and deployment pipelines with security gates. The question throughout is not "does it work?" but "how would you know if it broke — or was compromised?"

## Outcomes
By the end of this module, the student can:
- Audit an AI system's dependency supply chain and generate an SBOM with risk scores
- Design and implement NHI governance for multi-agent systems (credential rotation, JIT access, tiered identity)
- Instrument agents with OpenTelemetry tracing, Prometheus metrics, and structured logging
- Build a CI/CD deployment pipeline with security gates
- Diagnose a production incident using observability data

## Related Site Content
- `docs/lab-s2-unit7.html` — student-facing lab guide

## Prerequisites
- Unit 6 completed (red team/blue team, hardening patterns)
- `pip install anthropic opentelemetry-api opentelemetry-sdk prometheus-client`
- Docker installed (required for Week 12 deployment lab)
- GitHub Actions or equivalent CI/CD access

---

## Instruction Guidance

Students arrive with working multi-agent systems that lack production infrastructure. The framing shift that matters most here:

1. **Production is a different problem class than prototyping.** A system that works in a Jupyter notebook is not a production system. Push on what would need to change for this to run unattended at 2am.
2. **Supply chain is not optional.** Every dependency is an attack surface. Students often treat pip install as inert — make the scanner findings concrete.
3. **NHI governance is the hardest concept.** Students understand human auth; they don't instinctively apply it to agents. Use the question: "If this agent's credentials were stolen, what could an attacker do?" repeatedly.
4. **Observability is how you prove security, not just performance.** Logging and metrics aren't just for debugging — they're the audit trail that lets you detect and respond to compromise. Frame every instrumentation decision through this lens.
5. **The DevSecOps pipeline is the capstone of this unit.** By end of Week 12, students should have a pipeline that would catch a security regression before it reaches production. "Ship it and check later" is not acceptable.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Late Module rules apply.

Module-specific overrides:
- For supply chain scanning: give the tool invocation pattern, but let the student interpret the findings
- For NHI governance: never give the identity schema. Ask: "What does this agent need access to? For how long? What happens when it's done?"
- For observability: give the OpenTelemetry SDK pattern once; after that, ask "What decision would this metric help you make at 2am?"

---

## Tasks

1. **Supply Chain Audit (Week 9)** — Build or configure an AI supply chain scanner. Run it against a target system. Generate an SBOM. Document findings with risk ratings and mitigations.
2. **NHI Governance Implementation (Week 10)** — Catalog all NHIs in a multi-agent system. Implement tiered identity classification, credential rotation schedule, and JIT access for at least one privileged agent.
3. **Observability Stack (Week 11)** — Instrument a multi-agent system with OpenTelemetry tracing, structured JSON logging, and Prometheus metrics. Deploy a monitoring dashboard. Demonstrate detection of a simulated anomaly.
4. **Production Deployment Pipeline (Week 12)** — Build a CI/CD pipeline with security gates (SAST, dependency scan, container scan, secrets detection). Deliver a containerized agent with health checks and a production Dockerfile.

See `semester-2/weeks/unit-7.md` for full lab instructions and deliverable specs.

## Expected Artifact

Four deliverables committed to repo:

**`supply-chain-audit-report.md`** (Week 9)
- AI supply chain scanner tool (functional Python module)
- SBOM in standard format
- Risk findings table with severity ratings and recommended mitigations

**`nhi-governance-report.md`** (Week 10)
- Identity registry (JSON format): all NHIs cataloged, classified by tier, rotation schedule
- JIT access implementation with documentation
- Role review changelog: who/what had access, what changed, and why

**`observability-report.md`** (Week 11)
- Instrumented agent system with OpenTelemetry + Prometheus + structured logging
- Monitoring dashboard (screenshot or live link)
- Anomaly detection demonstration with evidence

**`deployment-pipeline-report.md`** (Week 12)
- Production Dockerfile (multi-stage, non-root, health checks)
- CI/CD pipeline config with security gates
- Deployment documentation (runbook, rollback procedure)
- Week 12 Addendum: DevSecOps promotion pipeline — how a prototype becomes production

---

## Review Guidance

**Recommended review mode:** Security (supply chain, NHI), Grader (observability and deployment pipeline)

**Common gaps:**
- Supply chain scanner that runs but produces findings the student can't interpret — require explanation of each finding
- NHI registry that lists agents but doesn't classify by tier or define rotation — the catalog without governance is incomplete
- Observability implementation that logs everything but defines no alert thresholds — "add logging" is not the same as "add observability"
- Deployment pipeline that runs but has no security gate that would actually block a bad deployment — require one gate that demonstrably blocks something

**What strong work looks like:**
- Supply chain report connects a specific CVE to a specific dependency in their own system — not generic
- NHI governance includes a documented incident response flow: "If Agent X's credential is compromised, we do [Y] within [Z] time"
- Observability dashboard shows a metric that would page an on-call engineer — not just "agent ran successfully"
- CI/CD pipeline has a failing test case that proves the security gate works

**Probing question bank:**
- "Your scanner found [N] vulnerabilities. Which one would you fix first, and why that one over the others?"
- "If Agent B's credential was rotated on a schedule, what happens to in-flight requests during rotation?"
- "Show me the metric that would alert you to a prompt injection attempt. What's the threshold?"
- "Your CI/CD pipeline passed. Name one thing that could still go wrong in production that your pipeline wouldn't catch."

## Reflection Prompt
"What's the biggest gap between your Unit 5 prototype and a system that could run in a real organization? Be specific about what you built in Unit 7 that closes part of that gap — and what's still open."

---

## Completion Gate
The student may advance to Unit 8 when:
- [ ] All 4 artifacts committed to repo
- [ ] Supply chain scanner runs against a real (or provided) target
- [ ] At least one CI/CD gate demonstrably blocks a bad input
- [ ] Reflection entry written in `student-state/reflection-log.md`

## Stretch Challenge
Extend the CI/CD pipeline with an automated AIUC-1 compliance check. On every commit, run a governance scan that flags which AIUC-1 domains have unaddressed gaps in the current codebase. Fail the build if a critical domain gap is detected.
