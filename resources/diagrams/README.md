# Course Diagrams

Visual references for the course.

**Quickest option — open the HTML viewer directly in your browser.** Each diagram has a companion `.html` file that renders without installing anything.

For the `.drawio` source files:
- **Desktop app:** [draw.io desktop](https://github.com/jgraph/drawio-desktop/releases) (Windows / Mac / Linux)
- **VS Code:** Install the [Draw.io Integration extension](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) — opens `.drawio` files directly in the editor
- **Browser (upload):** Go to https://app.diagrams.net → File → Open From → This Device

---

## dark-factory-architecture

**HTML viewer (recommended):** `dark-factory-architecture.html` — open in any browser, no install required. Supports zoom, pan, and layer navigation.

**Source file:** `dark-factory-architecture.drawio`

**Title:** Secure Agent Dark Factory — Architecture & Security Map
**Version:** v0.3 (2026-03-15)
**Used in:** Week 1, Unit 7 (Weeks 10–12), Stage Assessment Field Guide

A full-system architecture diagram of the Secure Dark Factory. Covers:

- **Pipeline band** — Ideation (①) through Production (⑧): `/think` → `/spec` → `/worktree-setup` → Orchestrator → Workers → Delivery → Security Gate (MASS 2.0) → Governance Gate (PeaRL) → Production
- **Agent layer** — Deep Agents orchestrator + parallel/sequential worker agents
- **Control plane** — LiteLLM (AI routing, cost caps, budget enforcement)
- **Governance layer** — PeaRL (allowance profiles, approvals, audit trail, promotion gates, cost ledger)
- **Security layer** — MASS 2.0 (static-analysis, redteam, mcp-security, diagnostics); dual-scan: T=0 meta-scan + T=N behavioral drift
- **Identity & secrets** — SPIFFE/SPIRE workload identity (mTLS, short-lived SVIDs); HashiCorp Vault (local) / AWS Secrets Manager + KMS (cloud)
- **Execution substrates** — Local (LocalShellBackend + git worktrees + Nemotron NIM) and Cloud (AWS AgentCore microVMs + Bedrock)
- **Observability** — OpenTelemetry → Grafana Tempo (local) / AWS X-Ray (cloud); PeaRL as trace root
- **Network egress** — Linux netns per worktree (local) / VPC + Network Firewall (cloud); private registry (Nexus OSS / AWS CodeArtifact)
- **Security annotations** — Each layer color-coded to show where OWASP NHI Top 10 risks are addressed

**How to use this in the course:**

| Week | How the diagram applies |
|---|---|
| Week 1 | Overview orientation — where the Secure Dark Factory fits in the threat landscape |
| Week 8 | Map your audit findings to the architecture layers — which layer is missing? |
| Week 10 | NHI governance: identity & secrets layer, allowance profiles, SPIFFE/SPIRE |
| Week 11 | Observability: OTel → Grafana Tempo, PeaRL cost ledger, trace root |
| Week 12 | Deployment: execution substrates, network egress, promotion gates |
| Week 14–15 | Security maturity assessment: use the diagram to map where the target org sits |

**Reading the diagram for assessment purposes:**

When walking into a new company, use the diagram as a reference checklist. Work left-to-right across the layers. Ask: which layers exist at this organization, and which are missing? A company with only the Pipeline band and Agent layer (no governance, no security layer, no observability) is Stage 2. A company with all layers populated is Stage 4+.

---

*Add new diagrams to this directory and document them here.*
