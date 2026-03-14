# Semester 1 Weeks

**CSEC 601 — Semester 1 | 16 Weeks**

This directory contains the week-by-week course files for Semester 1 of the AgenticSecForge / CyberMinds 2026 program. Each file is a complete week: Day 1 theory, Day 2 lab, deliverables, AIUC-1 integration, and V&V lens.

## Week Index

| Week | Title | Key Content | AIUC-1 Domain |
|------|-------|-------------|---------------|
| [Week 1](week-01.md) | CCT + Engineering Assessment + Tool Setup | Agentic era, CCT 5 pillars, Assessment Stack intro, Meridian Financial lab | — |
| [Week 2](week-02.md) | Context Engineering + Model Selection | Model tiers, token economics, prompt caching, SDK cost tracking | E (Accountability) |
| [Week 3](week-03.md) | MCP Servers + Tool Design | MCP architecture, A2A intro, Tool Search Tool, CVE lookup MCP lab | B (Security) |
| [Week 4](week-04.md) | Multi-Tool Systems + Data Architecture | Multi-tool MCP, input validation, data architecture (relational/vector/graph/time series) | D (Reliability), E |
| [Week 5](week-05.md) | Hybrid RAG for Security | Hybrid retrieval, lost-in-the-middle, citation verification, knowledge base poisoning | A (Data & Privacy) |
| [Week 6](week-06.md) | Skill Building + Assessment Crystallization | Skill anatomy, YAML frontmatter, `/tool-select`, `/audit-aiuc1`, full Assessment Stack | All 6 introduced |
| [Week 7](week-07.md) | Break Everything (Scaling Limits Lab) | 7 stations: context stuffing, agent proliferation, RAG flooding, skill stacking, model mismatch, excessive agency, cost cliffs | All 6 tested |
| [Week 8](week-08.md) | Audit Your Own Tools (AIUC-1 Synthesis) | OWASP Top 10 for Agentic Apps, AIVSS scoring, defense in depth, bias testing, governance policy | C (Safety), F (Society) |
| [Week 9](week-09.md) | Multi-Agent Security Systems I | 5 orchestration patterns, worktree 3-layer model, tmux setup, dark factory, SOC agent team lab | B revisited |
| [Week 10](week-10.md) | Multi-Agent Security Systems II | Debate/swarm/expert delegation, per-agent cost tracking, inter-agent verification, scaling limits | B (agent-to-agent trust) |
| [Week 11](week-11.md) | Rapid Prototyping Sprint I | Think→Spec→Build→Retro cycle, Assessment Stack drives architecture, AIUC-1 baked in, CPT metric | All domains in spec |
| [Week 12](week-12.md) | Rapid Prototyping Sprint II | Harden prototype: error handling, security, observability; cost optimization pass; pre-red-team verification | D, E hardened |
| [Week 13](week-13.md) | Red Team Your Prototypes I | MITRE ATLAS, PeaRL AA-TTP framework, dark factory attacker pipelines, Assessment Stack for attacks, build attack tools | B001 testing |
| [Week 14](week-14.md) | Red Team Your Prototypes II | Cross-team attack + defend, four-layer defense model, ARR measurement, defend-and-iterate cycle | B001, C under pressure |
| [Week 15](week-15.md) | Production Hardening | SBOM, dependency scanning, container image scanning, CI/CD gates, decision authority spectrum, AIUC-1 certification readiness | B008, C documented |
| [Week 16](week-16.md) | Midyear Presentations | Synthesis presentation: Assessment Stack justification, AIUC-1 coverage, V&V documentation, cost analysis | Full mapping |

## Progression Overview

Semester 1 follows a build-first progression:

```
Weeks 1-6:   Build foundations (context engineering, tools, RAG, skills)
Week 7:      Break everything empirically (scaling limits)
Week 8:      Audit what you built (AIUC-1 synthesis)
Weeks 9-10:  Multi-agent systems
Weeks 11-12: Sprint: build a prototype
Weeks 13-14: Red team: attack and defend
Week 15:     Production hardening
Week 16:     Present and reflect
```

## Framework Threads

Three frameworks run continuously through all 16 weeks:

**Engineering Assessment Stack** — introduced in Week 1, crystallized in Week 6, applied in every architecture decision, required as a deliverable in Week 16. Reference: [resources/engineering-assessment-stack.md](../../resources/engineering-assessment-stack.md)

**AIUC-1** — domains introduced one at a time (Weeks 2-5), complete framework in Week 6, empirically tested in Week 7, audit synthesis in Week 8, red team in Weeks 13-14, deployment in Week 15, full mapping in Week 16.

**V&V (Verify and Validate)** — light touch in Week 1, grows progressively: output verification (Week 2), tool output trust (Week 3), audit trail (Week 4), citation accuracy (Week 5), adversarial assumption (Week 8), inter-agent verification (Week 10), sprint V&V (Weeks 11-12), adversarial V&V (Weeks 13-14), deployment V&V (Week 15).

## Archive

The original unit files (unit-1.md through unit-4.md) are preserved in [archive/](archive/) for reference. The week files are authoritative.
