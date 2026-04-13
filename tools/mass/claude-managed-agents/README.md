# MASS — Claude Managed Agents

Seven agents for the Model & Application Security Suite (MASS), deployed via
Anthropic's Claude Managed Agents. Anthropic runs the agent loop and tool
execution in a hosted container — you deploy once and run per-scan sessions.

## Agent Architecture

```
User prompt
    │
    └── MASS Security Orchestrator (01)          claude-sonnet-4-6
            │
            ├── MASS Static Analysis (02)        claude-haiku-4-5  ─┐ parallel
            ├── MASS MCP Security (04)           claude-haiku-4-5  ─┘
            │
            ├── MASS Red Team (03)               claude-opus-4-6    if warranted
            │
            ├── MASS Security Judge (05)         claude-sonnet-4-6 ─┐
            ├── MASS Remediation Judge (06)      claude-sonnet-4-6 ─┤ parallel tribunal
            ├── MASS Evidence Judge (07)         claude-sonnet-4-6 ─┘
            │
            └── Report + Policies (Cedar, Claude guardrails, LiteLLM, nginx, NeMo)
```

**Tribunal aggregation weights:** security=0.40, remediation=0.30, evidence=0.30
**Risk levels:** SAFE (≥0.85) / MEDIUM (≥0.55) / HIGH (≥0.25) / CRITICAL (<0.25)

## Deploy

```bash
export ANTHROPIC_API_KEY=sk-ant-...
pip install anthropic pyyaml httpx

# Deploy workers first, orchestrator last (needs worker IDs)
python deploy.py deploy

# Check status
python deploy.py status

# Run a smoke-test scan against MASS itself
python deploy.py test
```

`deploy.py` writes `agent_ids.json` after the first deploy. Subsequent runs
(`python deploy.py update`) patch existing agents in-place — safe to re-run
after editing YAML configs.

## Run a scan session

After deploying, run a scan using the Anthropic Python SDK:

```python
import anthropic
import json

client = anthropic.Anthropic()

# Load orchestrator ID from agent_ids.json
with open("agent_ids.json") as f:
    ids = json.load(f)
orchestrator_id = ids["mass-orchestrator"]

# Create a session and stream results
session = client.beta.sessions.create(
    agent=orchestrator_id,
    title="Scan: my-agent-project",
)

with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(
        session.id,
        events=[{"type": "user.message", "content": [{"type": "text", "text":
            "Scan /path/to/my-agent-project for security vulnerabilities. "
            "Run the full MASS DAG and return a complete security report."
        }]}],
    )
    for event in stream:
        if event.type == "agent.message":
            for block in event.content:
                if hasattr(block, "text"):
                    print(block.text, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[{event.name}]", flush=True)
        elif event.type == "session.status_idle":
            break
```

## Extending MASS

Each agent is a YAML file: `name`, `model`, `tools`, and a `system` prompt.
To extend:

1. **Add a new analyzer**: Create a new YAML following the worker pattern
   (see `02-static-analysis.yaml`). Add it to `DEPLOY_ORDER` in `deploy.py`.
   Wire it into the orchestrator's Phase 2 by editing `01-orchestrator.yaml`.

2. **Add a new judge**: Follow `05-security-judge.yaml` pattern. Add it to
   Phase 8 in the orchestrator and update the aggregation weights.

3. **Add a new policy type**: Edit Phase 9 of `01-orchestrator.yaml`.
   Current policy types: Cedar, Claude API guardrails, LiteLLM, nginx, NeMo Guardrails.

4. **Change models**: Edit the `model:` field in any YAML. Workers use
   `claude-haiku-4-5` (fast/cheap); orchestrator and judges use `claude-sonnet-4-6`.
   Upgrade the red team to `claude-opus-4-6` for harder attack sessions.

## Policy outputs

Phase 9 of each scan produces 5 deployable policy files:

| Policy | What it is | Use when |
|---|---|---|
| Cedar | Agent authorization rules | Applying AIUC-1 access controls |
| Claude API guardrails | System prompt safety fragment + API controls | Claude-first deployments |
| LiteLLM config | Rate limits + provider guardrails | Multi-provider proxy deployments |
| nginx config | Proxy rules + rate limiting | Web-facing agent endpoints |
| NeMo Guardrails colang | Input/output rails | Deploying with NeMo Guardrails layer |

## Cost estimate per scan

| Agent | Model | Est. tokens | Est. cost |
|---|---|---|---|
| Orchestrator | claude-sonnet-4-6 | ~8k | ~$0.04 |
| Static Analysis | claude-haiku-4-5 | ~12k | ~$0.02 |
| MCP Security | claude-haiku-4-5 | ~4k | ~$0.01 |
| Red Team | claude-opus-4-6 | ~10k | ~$0.25 |
| 3× Judges | claude-sonnet-4-6 | ~6k each | ~$0.09 |
| **Total** | | | **~$0.41/scan** |
