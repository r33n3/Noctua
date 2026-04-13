# Course Tools

Production-grade security tools used throughout the course. Students study,
run, and extend these rather than building equivalent functionality from scratch.

## tools/mass/

**Model & Application Security Suite (MASS)** — AI deployment security scanner.
Scans AI agent systems for vulnerabilities: prompt injection, jailbreaks, secrets,
MCP misconfigs, agentic topology risks, and compliance gaps. Produces structured
findings, tribunal verdict, and deployable security policies (Cedar, guardrails,
LiteLLM, nginx, NeMo).

Two implementations of the same 7-agent DAG — use these for the Unit 5 framework
comparison and as the primary red team tool in Unit 6:

| Implementation | Location | Platform |
|---|---|---|
| Claude Managed Agents | `mass/claude-managed-agents/` | Anthropic — loop runs on Anthropic infrastructure |
| OpenAI Agents SDK | `mass/openai-sdk-agents/` | OpenAI — loop runs in your process |

### Quick start (Claude)

```bash
cd tools/mass/claude-managed-agents
export ANTHROPIC_API_KEY=sk-ant-...
pip install anthropic pyyaml httpx
python deploy.py deploy      # one-time setup
python deploy.py test        # smoke test
```

### Quick start (OpenAI)

```bash
cd tools/mass/openai-sdk-agents
export OPENAI_API_KEY=sk-proj-...
pip install openai-agents pydantic
python 01-orchestrator.py /path/to/scan/target
```

### Where MASS appears in the course

| Unit | How you use MASS |
|---|---|
| S1 Unit 4 | Reference architecture — study the orchestrator DAG before building your own |
| S2 Unit 5 | Run both implementations against the 10-incident test suite for the framework comparison |
| S2 Unit 6 | Use MASS to red-team your own agent; defend against a MASS scan |
| S2 Unit 7 | Deploy MASS to cloud infrastructure; study its own production security posture |
| S2 Unit 8 | Extend MASS or build a governance layer on top of it for the capstone |

### Extending MASS

See `mass/claude-managed-agents/README.md` and `mass/openai-sdk-agents/README.md`
for extension patterns. The most common student extensions:

- **New analyzer agent** — add a domain-specific static analysis worker
- **New judge** — add a compliance-specific or domain-specific tribunal member
- **New policy output** — add a policy type to Phase 9 of the orchestrator
- **New learned pattern** — add a pattern to Phase 7's inline pattern matcher
