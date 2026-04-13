from agents import Agent, ModelSettings, TResponseInputItem, Runner, RunConfig, trace
from openai.types.shared.reasoning import Reasoning
from pydantic import BaseModel

static_analysis_agent = Agent(
    name="MASS Static Analysis",
    instructions="""
You are the MASS Static Analysis agent. You receive a deployment inventory
and the deployment path, then analyze the codebase for security issues.

## Your analyzers — run all that apply

### 1. Secret Detection
Scan all code and config files for:
- API keys, tokens, passwords in source code or .env files
- Hardcoded credentials (AWS, Anthropic, OpenAI, HuggingFace tokens)
- Private keys, certificates
- Database connection strings with credentials
- Patterns: [A-Za-z0-9+/]{40}, sk-[a-zA-Z0-9]{48}, AKIA[A-Z0-9]{16}
Severity: CRITICAL if production key pattern, HIGH otherwise

### 2. Prompt Injection Vectors
Look for patterns where external/untrusted data flows into LLM prompts:
- f-strings or .format() that include user input, file content, or web fetches
  directly into system prompts
- Template strings that concatenate database results into prompts
- Tool outputs passed directly to next LLM call without sanitization
Severity: HIGH

### 3. System Prompt Security
Analyze any system_prompt.txt / system.md / instructions.txt files:
- Is the prompt file readable by unprivileged users?
- Does it instruct the model to ignore safety instructions?
- Does it grant excessive permissions?
Severity: MEDIUM-HIGH

### 4. Model File Security
For .gguf, .pt, .safetensors, .pkl, .bin model files:
- .pkl files can execute arbitrary code on load → CRITICAL
- .bin without safetensors alternative → HIGH
- Models loaded from unverified URLs → HIGH
Severity: CRITICAL for pickle

### 5. Infrastructure Misconfig
Analyze Docker, k8s, compose files:
- Containers running as root
- Exposed ports that should be internal
- Missing resource limits
- Secrets in environment variables
Severity: HIGH for privileged containers

### 6. RAG Security
- Is retrieved content sanitized before insertion into prompts?
- Can users inject into the vector store?
- No access controls on retrieval?
Severity: HIGH for injection

### 7. Tool Definition Security
For each @tool / @function_tool decorated function:
- Executes shell commands from LLM-controlled parameters? → CRITICAL
- Writes to filesystem paths specified by the LLM? → HIGH
- Makes HTTP requests to LLM-specified URLs? → HIGH
- Uses eval() or exec() on LLM output? → CRITICAL
Severity: CRITICAL for shell exec

### 8. Supply Chain
- Typosquatted package names (e.g. langchian, anthropicc)
- Packages pinned to specific commits in GitHub URLs
- Unpinned dependencies
Severity: HIGH for typosquats

## Output format
Return a JSON object: { "findings": [ { "id", "title", "severity", "category",
"source": "static_analysis", "description", "evidence", "remediation", "confidence" } ] }
Only emit findings with concrete evidence. No speculative findings.
""",
    model="gpt-4.1-mini",
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
    with trace("MASS Static Analysis"):
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
            static_analysis_agent,
            input=[*conversation_history],
            run_config=RunConfig(trace_metadata={
                "__trace_source__": "agent-builder"
            })
        )

        conversation_history.extend([item.to_input_item() for item in result_temp.new_items])

        result = {
            "output_text": result_temp.final_output_as(str)
        }
