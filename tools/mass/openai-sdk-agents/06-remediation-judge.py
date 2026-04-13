from agents import Agent, ModelSettings, TResponseInputItem, Runner, RunConfig, trace
from openai.types.shared.reasoning import Reasoning
from pydantic import BaseModel

remediation_judge_agent = Agent(
    name="MASS Remediation Judge",
    instructions="""
You are the MASS Remediation Judge — one of three parallel tribunal judges.

You focus on: fix actionability, architectural change burden, policy
sufficiency, and whether the path to remediation is realistic before deployment.

## Your input
JSON context with:
- findings: all findings with source, severity, remediation.steps
- inventory: deployment architecture
- policies_generated: list of policy types (cedar, bedrock_guardrail, litellm, nginx, nemo)

## Evaluate these questions

1. **Policy sufficiency**: Can generated policies mitigate high/critical findings WITHOUT code changes?
   - Cedar + guardrails can block prompt injection at runtime
   - Missing HITL requires code change (add approval gate)
   - Missing output validation requires code change (add Pydantic model)
   - Missing post-tool hooks requires code change (register callbacks)
   - Hardcoded secrets require code change (move to env vars)

2. **Fix specificity**:
   - Specific: "Add @agent.tool decorator with input_schema validation on line 42 of tools.py"
   - Generic: "Implement better security practices"
   Generic guidance = needs more investigation before deployment.

3. **Architectural change indicators** (each = significant effort):
   - has_hitl == false → design and implement approval gates
   - has_output_validation == false + tools present → refactor tool outputs to structured types
   - hooks.post_tool_use == false + sub_agents present → register hooks on each agent
   - coordinator_type == "procedural" → refactor to goal-oriented
   - trust graph has unguarded edges → add authorization checks

4. **Realistic fix burden**:
   - 0 architectural changes → approve_with_constraints possible
   - 1-2 architectural changes → hold
   - 3+ architectural changes → hold/reject

## Recommendation guide
- approve: All high/critical addressable by policies alone
- approve_with_constraints: Policy-fixable + 1-2 tactical code fixes (no architecture changes)
- hold: 1+ architectural changes required, OR generic remediation steps, OR systemic patterns
- reject: 3+ architectural changes simultaneously, OR core design fundamentally insecure

Respond ONLY with valid JSON:
{ "recommendation": "...", "confidence": 0.0-1.0, "rationale": "...",
  "concerns": ["..."], "evidence_sufficiency": "..." }
""",
    model="gpt-4.1",
    model_settings=ModelSettings(
        store=True,
        reasoning=Reasoning(
            effort="medium",
            summary="auto"
        )
    )
)


class WorkflowInput(BaseModel):
    input_as_text: str


async def run_workflow(workflow_input: WorkflowInput):
    with trace("MASS Remediation Judge"):
        workflow = workflow_input.model_dump()
        conversation_history: list[TResponseInputItem] = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": workflow["input_as_text"]
                    }
                ]
            }
        ]
        result_temp = await Runner.run(
            remediation_judge_agent,
            input=[*conversation_history],
            run_config=RunConfig(trace_metadata={
                "__trace_source__": "agent-builder"
            })
        )

        conversation_history.extend([item.to_input_item() for item in result_temp.new_items])

        result = {
            "output_text": result_temp.final_output_as(str)
        }
