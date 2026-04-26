# MASS — Claude Agent SDK

Seven agents for the Model & Application Security Suite (MASS), implemented
using the Claude Agent SDK (`claude-agent-sdk`). The agent loop runs in your
caller process — compare this to `../claude-managed-agents/` where Anthropic's
infrastructure runs the loop on hosted compute.

## Agent Architecture

Same DAG as the Managed Agents implementation:

```
User prompt
    │
    └── MASS Security Orchestrator (01)          claude-sonnet-4-6
            │
            ├── MASS Static Analysis (02)        claude-haiku-4-5   ─┐ parallel
            ├── MASS MCP Security (04)           claude-haiku-4-5   ─┘
            │
            ├── MASS Red Team (03)               claude-sonnet-4-6   if warranted
            │
            ├── MASS Security Judge (05)         claude-sonnet-4-6  ─┐
            ├── MASS Remediation Judge (06)      claude-sonnet-4-6  ─┤ parallel tribunal
            ├── MASS Evidence Judge (07)         claude-sonnet-4-6  ─┘
            │
            └── Report + Policies
```

## Installation

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

Run the full orchestrated scan:

```python
import asyncio
from 01-orchestrator import run_workflow, WorkflowInput

result = asyncio.run(run_workflow(WorkflowInput(
    input_as_text="Scan /path/to/your/ai-deployment for security issues."
)))
print(result["output_text"])
```

Or run any individual agent directly from the command line:

```bash
python 01-orchestrator.py "Scan /path/to/deployment"
python 02-static-analysis.py "Analyze /path/to/codebase for secrets and injection vectors"
python 03-redteam.py "Run adversarial tests against the target agent"
python 04-mcp-security.py "Check MCP server configs in /path/to/deployment"
python 05-security-judge.py "Here is the findings JSON: {...}"
python 06-remediation-judge.py "Here is the findings JSON: {...}"
python 07-evidence-judge.py "Here is the findings JSON: {...}"
```

## How the SDK pattern works

Each agent is defined with `ClaudeAgentOptions` and invoked via `query()`, an
async generator that streams events back to your process:

```python
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-6",
    system_prompt="Your system prompt here..."
)

async def run_agent(prompt: str) -> str:
    result_text = ""
    async for event in query(prompt, options=options):
        if hasattr(event, "text"):
            result_text += event.text
    return result_text
```

Every tool call, subagent handoff, and model response is visible as an event
in your process. This is the key difference from Managed Agents where the loop
is opaque server-side infrastructure.

## Comparison: this implementation vs. the other MASS implementations

| | Claude Agent SDK (this) | Claude Managed Agents | OpenAI Agents SDK |
|---|---|---|---|
| Loop runs where | Your process | Anthropic infrastructure | Your process (Runner) |
| Tool execution | Client-side (your code) | Server-side container | Client-side (your code) |
| Deploy step | `pip install` + `ANTHROPIC_API_KEY` | `deploy.py` creates agents via API | Local run or Agent Builder |
| Event observability | Full — every tool call visible | Limited — server opaque | Full via RunResult |
| Models | claude-sonnet-4-6 / claude-haiku-4-5 | claude-opus-4-7 / claude-sonnet-4-6 | gpt-4.1 / gpt-5.4 |
| Cost | ~$0.18/scan | ~$0.41/scan | ~$0.22/scan |
| Multi-agent | Separate `query()` calls per agent | `AgentDefinition` + subagents list | handoffs + `as_tool()` |

The logic — DAG phases, finding schema, tribunal aggregation — is identical
across all three implementations. The infrastructure and SDK invocation differ.
This is the Unit 5 comparison exercise.

## Model mapping from OpenAI SDK version

| OAI model | Claude model | Role |
|---|---|---|
| `gpt-4.1` | `claude-sonnet-4-6` | Orchestrator, all three judges |
| `gpt-4.1-mini` | `claude-haiku-4-5` | Static analysis, MCP security |
| `gpt-5.4` | `claude-sonnet-4-6` | Red team adversarial testing |

## Extending MASS

Each agent is a Python file with a `ClaudeAgentOptions` definition and a
`run_workflow` function.

1. **Add a new analyzer**: Create a new `.py` file following `02-static-analysis.py`.
   Call `run_workflow` from the orchestrator and merge findings into the DAG.

2. **Add a new judge**: Follow `05-security-judge.py`. Add it to Phase 8
   and update the aggregation weights in the orchestrator.

3. **Add function tools**: Pass a `tools=[...]` list to `ClaudeAgentOptions`.
   Each tool is a dict with `name`, `description`, and `input_schema`.

4. **Change models**: Edit `model=` in any agent's `ClaudeAgentOptions`.
   Use `claude-haiku-4-5` for cost optimization, `claude-sonnet-4-6` for
   complex reasoning and adversarial work.

## Cost estimate per scan

| Agent | Model | Est. tokens | Est. cost |
|---|---|---|---|
| Orchestrator | claude-sonnet-4-6 | ~8k | ~$0.02 |
| Static Analysis | claude-haiku-4-5 | ~12k | ~$0.007 |
| MCP Security | claude-haiku-4-5 | ~4k | ~$0.002 |
| Red Team | claude-sonnet-4-6 | ~10k | ~$0.10 |
| 3x Judges | claude-sonnet-4-6 | ~6k each | ~$0.05 |
| **Total** | | | **~$0.18/scan** |
