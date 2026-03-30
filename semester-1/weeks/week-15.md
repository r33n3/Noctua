# Week 15: Production Hardening

**Semester 1 | Week 15 of 16**

## Learning Objectives

- Apply supply chain security concepts: SBOM, dependency scanning, container image scanning
- Understand CI/CD pipeline basics with security gates
- Apply the environment security principles from Week 8 to a real deployment pipeline
- Map the decision authority spectrum to your tool: what automates, what needs human gates
- Produce an AIUC-1 certification readiness checklist for your prototype
- Complete the Assessment Stack justification documentation for Week 16

---

## Day 1 — Theory

### From Prototype to Production

Your Week 14 prototype is hardened against known attacks. Production deployment adds three more layers: supply chain security, environment security, and decision authority governance.

**The production readiness question:** "Can we deploy this in an environment we don't fully control, where attackers may have access to our dependencies, our container images, and our runtime environment?"

The answer requires three things the prototype doesn't have yet:
1. A verified, auditable supply chain
2. An isolated, minimal runtime environment
3. A documented decision authority model

### Supply Chain Security

**What is the supply chain for an AI security tool?**

```
Training data → Pre-trained model → Fine-tuning data →
Model weights → Application code → Dependencies →
Container image → Registry → Deployment environment
```

Each step is an attack surface. The Week 7 OWASP Supply Chain risk was theoretical. Production deployment makes it concrete.

**SBOM: Software Bill of Materials**

A Software Bill of Materials lists every dependency in your tool, its version, and its known vulnerabilities. Generate an SBOM automatically using:

```bash
# For Python projects using pip
pip-audit --output-format=json --output=sbom.json

# Or using syft (works for containers too)
syft . -o spdx-json > sbom.json
```

The SBOM tells you: "If CVE-2026-XXXX affects requests==2.28.1, which of my tools is affected?"

**Container Image Scanning**

Before pushing a container to a registry or deploying it, scan for vulnerabilities:

```bash
# Build your container
docker build -t your-tool:latest .

# Scan with Trivy
trivy image your-tool:latest

# Output severity summary
trivy image --severity HIGH,CRITICAL your-tool:latest
```

A production container should have zero Critical vulnerabilities and minimal High vulnerabilities. If Trivy finds Critical issues, they must be resolved before deployment.

**Dependency Pinning**

```
# Bad: unpinned (production environment installs latest, may break)
anthropic
requests

# Good: pinned (reproducible build, known vulnerabilities)
anthropic==0.40.0
requests==2.32.3
```

Pin all dependencies in `requirements.txt`. Use `pip-compile` (pip-tools) to generate pinned requirements from a high-level `requirements.in`.

### Containerization for Production

Your Week 11 prototype already has a Dockerfile. Production deployment adds security hardening:

```dockerfile
# Production-hardened Dockerfile
FROM python:3.11-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final stage: minimal image
FROM python:3.11-slim

# Run as non-root (security)
RUN useradd --no-create-home --shell /bin/false appuser

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy application code
COPY . .

# Set permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Environment variables for runtime
ENV PATH="/home/appuser/.local/bin:${PATH}"
ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["python", "-m", "your_tool"]
```

Key hardening decisions:
- **Multi-stage build:** Compiler tools (pip, gcc) are in the builder stage, not the final image
- **Non-root user:** If the container is compromised, the attacker doesn't have root
- **Minimal base image:** `python:3.11-slim` has fewer packages to exploit than `python:3.11`
- **No secrets in image:** `ANTHROPIC_API_KEY` comes from environment at runtime, not baked in

### CI/CD with Security Gates

A CI/CD pipeline runs automated checks before merging code or deploying a container. Minimum security gates for your prototype:

```yaml
# .github/workflows/security.yml (conceptual structure)
# Stage 1: Test
- run: pytest tests/

# Stage 2: Security scan
- run: pip-audit --desc on   # Check for vulnerable dependencies
- run: bandit -r . -ll        # Check for common Python security issues
- run: trivy fs . --exit-code 1 --severity HIGH,CRITICAL  # Filesystem scan

# Stage 3: Container scan (after build)
- run: trivy image your-tool:latest --exit-code 1 --severity CRITICAL

# Stage 4: Deploy (only if all gates pass)
```

The `--exit-code 1` flags cause the pipeline to fail if Critical/High vulnerabilities are found. A failed gate stops deployment — even if all functional tests pass.

**Security gate as AIUC-1 B008:** The CI/CD pipeline that scans for vulnerabilities before deployment is the operational implementation of B008 (Protect Model Deployment Environment).

### Decision Authority Spectrum

From Week 9's dark factory discussion: the decision authority spectrum runs from full human control to full autonomy. Production deployment requires documenting where your tool sits.

**The five positions:**

1. **Full human control** — tool produces analysis, human decides everything
2. **Human-supervised autonomy** — tool recommends and acts, human can review and override
3. **Supervised autonomy** — tool acts, humans monitor and can interrupt
4. **Supervised full autonomy** — tool acts, humans review after the fact
5. **Full autonomy** — lights-out, no human involvement

For most security operations tools: position 2 is the default. Position 3 for low-risk, high-confidence actions. Position 1 for high-stakes, low-reversibility decisions.

**Documentation requirement:** For each action your tool can take, document its position on this spectrum and the rationale. This maps directly to AIUC-1 Domain C (Safety).

### Environment Security Integration

Your prototype runs in an environment. That environment has its own security requirements:

**Credential management:**
```bash
# Bad: hardcoded in code
ANTHROPIC_API_KEY = "sk-ant-..."

# Bad: in .env committed to git
# ANTHROPIC_API_KEY=sk-ant-...  ← In .gitignore? Always verify.

# Good: from environment at runtime
import os
api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    raise RuntimeError("ANTHROPIC_API_KEY must be set")
```

**Secrets scanning:** Before every commit, scan for accidentally committed credentials:
```bash
# Install detect-secrets
pip install detect-secrets

# Scan repository
detect-secrets scan . --all-files

# Add to pre-commit hooks
detect-secrets audit .secrets.baseline
```

**Network segmentation:** In production, your tool should only accept connections from authorized sources. If it's a CLI tool, that's implicit (runs on the analyst's machine). If it's a service, bind to `localhost` during development and add authentication before exposing to a network.

### AIUC-1 Certification Readiness

Production deployment is the point where AIUC-1 compliance is checked holistically. Use the following checklist:

| Domain | Control | Evidence Required | Status |
|--------|---------|------------------|--------|
| A — Data & Privacy | Data minimization implemented | List fields collected; justify each | |
| A | PII handling policy | Where is PII stored? How long? | |
| B — Security | Input validation on all tool parameters | Code reference + test evidence | |
| B | Least privilege tool access | Agent tool definitions, per-agent limits | |
| B001 | Adversarial robustness testing | Week 13-14 attack log + ARR measurement | |
| B008 | Deployment environment protected | Container scan results, CI/CD gates | |
| C — Safety | Human gates for high-stakes actions | Decision authority spectrum document | |
| C | Safety gate implementation | Code showing confidence thresholds | |
| D — Reliability | Error handling comprehensive | Error handling checklist from Week 12 | |
| D | Graceful degradation | Fallback paths documented and tested | |
| E — Accountability | All decisions logged | Log schema, log coverage map | |
| E | Decision reconstruction possible | Sample log → reconstructed decision exercise | |
| F — Society | Bias testing performed | Week 8 bias test results | |
| F | Fairness assessment | Disparate impact measurement | |

Completion target before Week 16: all rows with "Yes" or documented accepted risk.

---

## Day 2 — Lab

### Step 1: SBOM and Dependency Audit (20 min)

Generate your SBOM and run `pip-audit` on your prototype:

```bash
cd your-prototype-directory
pip-audit --output-format=json --output=sbom.json
pip-audit --desc on  # Human-readable summary
```

For any vulnerable dependency:
- Can you upgrade to a patched version? Do it.
- If upgrade breaks compatibility: document as residual risk with severity and planned fix timeline.

### Step 2: Container Hardening (25 min)

Apply the production Dockerfile pattern to your prototype:

1. Convert to multi-stage build
2. Add non-root user
3. Remove development dependencies from final image
4. Scan with Trivy: `trivy image your-tool:latest`

Target: zero Critical vulnerabilities in the final image.

```bash
# Build
docker build -t your-tool:latest .

# Scan
trivy image --severity CRITICAL,HIGH your-tool:latest

# If findings: rebuild after fixing, rescan
```

### Step 3: Secrets Scan (10 min)

Run detect-secrets or equivalent against your entire codebase:

```bash
detect-secrets scan . --all-files > .secrets.baseline
```

If any secrets are found: rotate them immediately (the secret is compromised once it touches git). Remove from code. Add environment variable pattern.

### Step 4: Decision Authority Documentation (15 min)

For each action your tool takes, document its decision authority position:

```
| Action | Position | Rationale | Reversible? |
|---|---|---|---|
| Analyze incident and report | 1 (full human control) | Report only, no action | N/A |
| Flag IP as suspicious | 2 (human-supervised) | Logged recommendation | Yes |
| Block IP at firewall | 1 (full human control) | Irreversible without manual | No |
```

Actions that are irreversible (block IP, disable account, delete file) must be at position 1 or 2. Never automate irreversible actions without human confirmation.

### Step 5: AIUC-1 Certification Readiness Check (20 min)

Complete the certification checklist above. For every row marked anything other than "Yes":
- Document the gap
- Classify as: (a) fixed before Week 16, (b) accepted risk with rationale, (c) deferred to Semester 2

This completed checklist is a Week 16 deliverable.

### Step 6: Assessment Stack Justification Documentation (10 min)

Compile your Assessment Stack justification table from Weeks 11-12 into a final version. This is the document you'll present in Week 16:

```
| Layer | Decision | Justification | Cost Implication |
|---|---|---|---|
| Problem Type | Reasoning — threat attribution | Evidence is ambiguous, novel scenarios | LLM required |
| Computation | Reasoning + deterministic IOC matching | IOC lookup is exact; attribution is reasoning | Hybrid |
| Model | Haiku (recon) + Sonnet (analysis) | Routing cheap, analysis needs judgment | $X/transaction |
| Data Architecture | Vector (threat intel) + relational (metadata) | Semantic search + exact filtering | [storage costs] |
| Integration | MCP tools (synchronous) | Real-time incident response requirement | [latency SLA] |
| Verification | Schema validation + human review threshold | Reasoning outputs reviewed above confidence=70 | [human cost] |
```

---

## Deliverables

1. **SBOM and dependency audit results** — pip-audit output, vulnerable dependencies resolved or documented
2. **Hardened container** — production Dockerfile with multi-stage build, non-root user, Trivy scan results showing zero Critical
3. **Secrets scan results** — clean scan or documentation of secrets rotated + environment variable refactor
4. **Decision authority document** — every tool action classified on the spectrum with rationale
5. **AIUC-1 certification readiness checklist** — all six domains, every control marked Yes / Accepted Risk / Deferred
6. **Final Assessment Stack justification table** — one row per layer, decisions made across Weeks 11-14

---

## AIUC-1 Integration

**Domain B008 (Protect Deployment Environment):** Trivy container scanning and the CI/CD security gates are the operational implementation of B008. The scan results are your evidence.

**Domain C (Safety) fully documented:** The decision authority spectrum document is the formal implementation of Domain C for your prototype. Before Week 16, every action your tool takes has an assigned human oversight level.

## V&V Lens

**Deployment Verification:** V&V doesn't end when tests pass and attacks are blocked. It includes: "Can this run in production safely?" The SBOM, container scan, and secrets scan are V&V checks at the deployment level.

**AIUC-1 as Completion Criteria:** The certification readiness checklist is the completion criteria for Semester 1. A tool that passes the functional tests, survives red teaming, and has a clean AIUC-1 checklist is a production-ready prototype.

---

### Dark Factory Gradient: Decision Authority Spectrum

Not every decision should be automated, and not every decision needs a human. The art of production deployment is drawing the line:

| Decision Type | Autonomy Level | Example | Rationale |
|---|---|---|---|
| **Informational** | Full autonomy | Log enrichment, alert classification | Low consequence; wrong answer wastes analyst time, doesn't cause harm |
| **Protective — reversible** | Autonomy + notification | Add firewall rule, increase monitoring | Easily reversed; notification ensures human awareness |
| **Protective — hard to reverse** | Human approval required | Quarantine production server, disable user account | Business impact if wrong; human judgment needed |
| **Destructive** | Human approval required | Wipe compromised system, terminate instance | Irreversible; must verify before acting |
| **External communication** | Human only | Notify regulators, contact law enforcement, issue customer disclosure | Legal/reputational consequences; AI cannot own this decision |

Your capstone should explicitly document where on this spectrum each agent decision falls and what the override mechanism is. This IS your dark factory governance policy.

---

## Production Readiness: Layer 3 and Layer 4 Checklist

Week 15 is where Layer 3 (Operations) and Layer 4 (Security) patterns become non-negotiable. Infrastructure can be deployed, but without operational observability and security hardening, it will fail silently or be exploited.

Run your final pre-deployment audit:

```
/check-prod-readiness ~/noctua/tools/sprint-ii/
```

**Layer 3 — Operations (required for production):**
- **3.1** Structured logging — all log messages use key-value fields, not f-strings
- **3.2** Correlation IDs — `trace_id` flows through every agent, tool call, and log entry
- **3.3** Health checks — `/health` endpoint verifies dependencies (DB, external APIs), returns 503 when degraded
- **3.4** Graceful shutdown — SIGTERM handler finishes in-flight work before exit
- **3.5** Metrics — Prometheus or equivalent exports `alerts_processed`, latency histograms, error rates

**Layer 4 — Security (required for production):**
- **4.1** No `==` for secret comparison — use `hmac.compare_digest()`
- **4.2** No user input interpolated into log strings — structured fields only
- **4.3** All tool inputs have explicit length/size bounds
- **4.4** Credentials loaded via CredentialProvider with refresh interval, not `os.environ[]` at startup
- **4.5** Every automated action has an audit record with `trace_id`, `agent_id`, `decision_basis`, and outcome

**Target: READY status** (no CRITICAL or HIGH findings) before production deployment. Include the report in your Week 15 submission.

---

> **📖 Case Study Connection:** Your defense in depth implementation from this week mirrors the PeaRL case study's mitigation phases. Phase 1 controls (role gates, API restrictions) stop known attack paths at the application layer. Phase 2 controls (behavioral anomaly detection, context drift checking) represent the execution environment layer. Your production system needs both — and the architectural controls (separate users, container isolation, secrets management) that make bypass physically impossible.

---

> **📚 Study With Claude:** Upload this week's reading material to Claude Chat and try:
> - "Quiz me on the key concepts from this reading. Start easy, then get harder."
> - "I think I understand production containerization for AI tools but I'm not sure. Explain it to me differently and then test whether I really get it."
> - "What are the three most common supply chain security mistakes teams make when deploying AI systems? Do I have any of them?"
> - "Connect this week's production hardening to the Week 7 Break Everything station on Cost Cliffs. How does production deployment change cost dynamics?"

---

> **🛠️ Produce this deliverable using your AI tools.** Use Chat to reason through the analysis, Cowork to structure and format the report, and Code to generate any data or visualizations. The quality of your thinking matters — the mechanical production should be AI-assisted.
