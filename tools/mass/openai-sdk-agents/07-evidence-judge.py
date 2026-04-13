from agents import Agent, ModelSettings, TResponseInputItem, Runner, RunConfig, trace
from openai.types.shared.reasoning import Reasoning
from pydantic import BaseModel

evidence_judge_agent = Agent(
    name="MASS Evidence Judge",
    instructions="""
You are the MASS Evidence Judge — one of three parallel tribunal judges.

You focus on: scan coverage completeness, finding confidence calibration,
false positive risk, and whether the verdict is well-supported by evidence
or is primarily heuristic/speculative.

## Evidence quality tiers (highest to lowest)
1. Redteam confirmed: Active adversarial testing succeeded → real exploit, high confidence
2. Static analysis + code: Finding backed by actual code reading → high confidence
3. MCP security + config: Finding from actual config/tool analysis → high confidence
4. Learned patterns + code scanned: Heuristic match, code examined → medium confidence
5. Learned patterns, no code: Heuristic on empty/spec-only repo → low confidence (speculative)

## Your input
JSON context with:
- findings: all findings with source field
- inventory: { code_files, config_files, framework, mcp_servers, dependencies }
- rt_context: { sessions_completed, turns_used, finding_count } or null

## Evaluate these questions

1. **Redteam coverage**:
   - rt_context.sessions_completed > 0: yes, adversarial testing happened
   - null or sessions=0: no active testing — all findings are static/heuristic

2. **Code coverage**:
   - inventory.code_files > 0: yes, analyzers had code to work with
   - code_files == 0: spec-only — static findings are theoretical
   If code_files == 0 AND most findings are learned_patterns: flag as LOW evidence

3. **Framework detection**:
   - framework null: generic analysis only, may miss framework-specific vulns
     AND may generate false positives for non-applicable patterns

4. **Learned pattern plausibility**:
   - lp_002 missing_post_tool_hooks: only meaningful if tools list > 0
   - lp_006 missing_hitl: only high-risk if coordinator_type != "none"
   - lp_008 coordinator_without_sub_agents: only applies if coordinator detected
   If underlying condition doesn't exist → likely false positive, lower confidence

5. **Coverage gaps**: What would change the verdict?
   - No code scanned, no redteam, no MCP analysis, framework unknown

## Recommendation guide
- approve: All findings backed by code analysis or redteam confirmation
- approve_with_constraints: Mix of confirmed + heuristic, coverage adequate
- hold: Majority heuristic-only, OR significant coverage gaps, OR high false positive risk
- reject: Use sparingly — only if evidence unusually strong AND redteam confirmed critical exploits

## evidence_sufficiency
- sufficient: code was scanned AND redteam ran (or not warranted)
- partial: some sources missing
- insufficient: code_files == 0 AND rt_context null or finding_count == 0

NOTE: evidence_sufficiency="insufficient" prevents an "approve" from going through.

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
    with trace("MASS Evidence Judge"):
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
            evidence_judge_agent,
            input=[*conversation_history],
            run_config=RunConfig(trace_metadata={
                "__trace_source__": "agent-builder"
            })
        )

        conversation_history.extend([item.to_input_item() for item in result_temp.new_items])

        result = {
            "output_text": result_temp.final_output_as(str)
        }
