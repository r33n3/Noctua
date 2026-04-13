# MASS — OpenAI Agents SDK

Seven agents for the Model & Application Security Suite (MASS), implemented
using the OpenAI Agents SDK (`openai-agents-python`). Runner executes in your
process with client-side tools — compare this to the Claude Managed Agents
implementation in `../claude-managed-agents/` where Anthropic runs the loop.

## Agent Architecture

Same DAG as the Claude implementation:

```
User prompt
    │
    └── MASS Security Orchestrator (01)          gpt-4.1
            │
            ├── MASS Static Analysis (02)        gpt-4.1-mini  ─┐ parallel
            ├── MASS MCP Security (04)           gpt-4.1-mini  ─┘
            │
            ├── MASS Red Team (03)               gpt-5.4        if warranted
            │
            ├── MASS Security Judge (05)         gpt-4.1       ─┐
            ├── MASS Remediation Judge (06)      gpt-4.1       ─┤ parallel tribunal
            ├── MASS Evidence Judge (07)         gpt-4.1       ─┘
            │
            └── Report + Policies
```

## Local Development

```bash
pip install openai-agents pydantic
export OPENAI_API_KEY=sk-proj-...

# Run a scan directly
python 01-orchestrator.py /path/to/scan/target
```

## Deploy to OpenAI Agent Builder

1. Go to `platform.openai.com/agent-builder`
2. Create a new agent for each file
3. Paste the Python file contents into the code editor
4. Set the model per the table in the agent table above
5. Deploy workers first, orchestrator last (needs worker IDs)

## Key difference from Claude Managed Agents

| | Claude Managed Agents | OpenAI Agents SDK |
|---|---|---|
| Loop runs where | Anthropic infrastructure | Your process (Runner) |
| Tool execution | Server-side container | Client-side (your code) |
| Deploy step | `deploy.py` creates agents via API | Local run or Agent Builder |
| Cost | ~$0.41/scan | ~$0.22/scan |
| Multi-agent | Callable agents (server orchestrates) | handoffs + as_tool() |

The logic — DAG phases, finding schema, tribunal aggregation — is identical.
The infrastructure differs. This is the Unit 5 comparison exercise.

## Extending MASS

Each agent is a Python file with an `Agent(name, instructions, tools, handoffs)` definition.

1. **Add a new analyzer**: Create a new `.py` file following `02-static-analysis.py`.
   Wire it into the orchestrator as a handoff or `.as_tool()` call.

2. **Add a new judge**: Follow `05-security-judge.py`. Add it to Phase 8
   and update the aggregation weights in the orchestrator.

3. **Add new function tools**: Use the `@function_tool` decorator for automatic
   schema generation. Add to the relevant agent's `tools=[...]` list.

4. **Change models**: Edit `ModelSettings(model="gpt-4.1")` in any file.
   Use `gpt-4.1-mini` for cost optimization, `gpt-5.4` for the hardest attack work.

## Cost estimate per scan

| Agent | Model | Est. tokens | Est. cost |
|---|---|---|---|
| Orchestrator | gpt-4.1 | ~8k | ~$0.02 |
| Static Analysis | gpt-4.1-mini | ~12k | ~$0.01 |
| MCP Security | gpt-4.1-mini | ~4k | ~$0.003 |
| Red Team | gpt-5.4 | ~10k | ~$0.15 |
| 3× Judges | gpt-4.1 | ~6k each | ~$0.04 |
| **Total** | | | **~$0.22/scan** |
