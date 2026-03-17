# Tool Requirements — Noctua AI Security Course

## Platform Requirement

### macOS (Apple Silicon — M2 or later)

**Required.** The course toolchain is built around Claude Code, which Anthropic develops and tests natively on macOS. Apple Silicon also runs Ollama local models efficiently without a discrete GPU.

| Why macOS over Windows/WSL2 | Detail |
|---|---|
| Claude Code native | Full feature set, no WSL2 path or file-watcher friction |
| Docker Desktop | Native containerization, no Linux subsystem layer |
| Ollama | ARM-native binaries, fast local model inference |
| Unix file permissions | Container labs require Unix permissions — WSL2 mounts Windows drives as `/mnt/c/...` and causes permission mismatches |
| Git worktree support | Claude Code's isolated worktree agent loop works cleanly on native Unix filesystem |

**Minimum specs:** 16 GB RAM, 100 GB free storage, macOS 13+
**Recommended:** M2 Pro/Max or M3, 32 GB RAM (required for running Mistral 7B locally alongside Docker)

Windows/WSL2 is workable but adds an environment friction layer that costs lab time. Linux (Ubuntu 22.04+) is an acceptable alternative.

---

## Anthropic Tools

### Claude Enterprise License

**Required for all course participants.**

Enterprise provides full access to all Claude capabilities used in course labs:

| Capability | Why It's Required |
|---|---|
| **Claude Code CLI** | Autonomous agent loop for sprint labs (Weeks 11–15, all Semester 2 units). Reads, writes, and executes code in your environment. |
| **Worktrees** | Claude Code spins up isolated git worktrees per task — clean branching, automatic cleanup. The `/worktree-setup` skill and `EnterWorktree`/`ExitWorktree` agent tools are Claude Code-specific. |
| **Claude Chat** | Think phase of every sprint. Structured reasoning via `/think` skill. Incident analysis, threat modeling, CCT framework application. |
| **Cowork** | Spec and documentation phase. File-aware — organizes lab deliverables, formats audit reports, compiles policy documents. |
| **Claude Research** | Multi-step agentic research (Opus 4 lead + Sonnet 4 subagents). Used for threat actor background, CVE research, framework comparisons. Also an observable example of the orchestrator-worker architecture taught in Weeks 5–6. |
| **Subagents** | Delegated specialist agents used in multi-agent security labs. Required for Semester 2 red team and defense units. |
| **MCP Server hosting** | Bidirectional communication between Claude and custom tools. Core of Weeks 5–6 and all agent-to-tool labs. |
| **Extended context** | Large log files, multi-file codebases, and long incident timelines require enterprise context limits. |

> **Why Enterprise over Max:** Enterprise provides SSO, audit logs, usage controls, and higher rate limits appropriate for a classroom cohort running concurrent sprint labs. It also includes the API access required for tool development exercises.

---

## CLI Installation

```bash
# Claude Code CLI
npm install -g @anthropic-ai/claude-code
claude --version

# Anthropic Python SDK (agent development labs)
pip install anthropic
python -c "import anthropic; print(anthropic.__version__)"
```

---

## Runtime Dependencies

| Tool | Install | Why |
|---|---|---|
| **Python 3.11+** | `brew install python@3.11` | All lab code. 3.11 required for `tomllib` stdlib and type hint syntax used in course scaffolding. |
| **Node.js 20+** | `brew install node@20` | Claude Code CLI runtime. Also required for MCP servers built in TypeScript. |
| **Git** | `brew install git` | All version control. Claude Code's worktree isolation requires Git 2.5+. |
| **GitHub CLI** | `brew install gh` | PR creation, Codespaces, and CI/CD pipeline labs. `gh auth login` required before sprint labs. |
| **Docker Desktop** | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) | Week 11+ containerization. All sprints require a working Dockerfile. Students containerize on Day 1 to avoid Week 15 surprises. |

---

## MCP / Tool Prototyping

| Tool | Install | Why |
|---|---|---|
| **fastmcp** | `pip install fastmcp` | Rapid MCP server prototyping. Reduces an MCP server to a decorated Python function — preferred for sprint labs where speed matters over production hardening. Standard `mcp` SDK is used for production implementations. |
| **MCP SDK (Python)** | `pip install mcp` | Production MCP server development. Used alongside fastmcp — fastmcp for iteration, mcp SDK for deliverables. |
| **MCP SDK (TypeScript)** | `npm install @modelcontextprotocol/sdk` | TypeScript MCP servers for labs requiring Node-native integrations. |

---

## Cloud CLI Tools

| Tool | Install | Why |
|---|---|---|
| **AWS CLI** | `brew install awscli` + `aws configure` | Required for Unit 7 production deployment labs. Services used: **ECR** (container image registry), **ECS** (Fargate task deployment), **S3** (artifact and log storage), **IAM** (permission boundary labs), **CloudWatch** (agent observability). |
| **Azure CLI** | `brew install azure-cli` + `az login` | Multi-cloud comparison labs and organizations standardized on Azure. Used for **Azure Container Apps** deployment alternative, **Azure AI Services** API comparisons, and enterprise SSO integration labs. |

> Both CLIs are required. AWS is the primary deployment target; Azure CLI is required for Semester 2 multi-cloud unit and enterprise environment simulations.

---

## Agent Frameworks (Semester 2)

These are installed as labs require them — not Day 1.

| Framework | Install | Why |
|---|---|---|
| **CrewAI** | `pip install crewai` | Role-based multi-agent orchestration. Used in comparative labs to contrast with Claude's native agent teams. |
| **LangGraph** | `pip install langgraph` | State-machine agent graphs. Used for deterministic workflow labs where graph topology matters. |
| **AutoGen** | `pip install pyautogen` | Microsoft's conversational multi-agent framework. Multi-vendor exposure lab. |
| **ChromaDB** | `pip install chromadb` | Local vector store for RAG labs (Week 5). Auto-generates embeddings — no separate embedding call required. |

---

## Security Testing Tools (Semester 2)

| Tool | Install | Why |
|---|---|---|
| **Garak** | `pip install garak` | LLM vulnerability scanner. Automated red teaming across prompt injection, jailbreak, and data leakage probes. |
| **PyRIT** | `pip install pyrit` | Microsoft's Python Risk Identification Toolkit. Adversarial prompt generation and risk scoring. |
| **NeMo Guardrails** | `pip install nemoguardrails` | NVIDIA's guardrail framework. Defense labs — input/output rails, topical restrictions, jailbreak resistance. |
| **LlamaFirewall** | `pip install llamafirewall` | Meta's prompt injection and jailbreak detection layer. Used in defense-in-depth architecture labs. |

---

## Local Model Hosting

| Tool | Install | Why |
|---|---|---|
| **Ollama** | [ollama.ai](https://ollama.ai) | Runs open-weight models locally (Mistral 7B, Llama 3). Required for sensitive data labs where cloud API calls are inappropriate. Also used for cost comparison — running a local model vs. API cost per transaction. |

Models pulled as needed:
```bash
ollama pull mistral        # 4.1 GB
ollama pull llama3.2       # 2.0 GB
ollama pull nomic-embed-text  # embedding model for local RAG
```

---

## Quick Reference Install Order

```bash
# 1. Homebrew (macOS package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Core runtime
brew install python@3.11 node@20 git gh awscli azure-cli

# 3. Claude Code CLI
npm install -g @anthropic-ai/claude-code

# 4. Python packages (core)
pip install anthropic fastmcp mcp chromadb

# 5. Docker Desktop — install via GUI from docker.com

# 6. Ollama — install via GUI from ollama.ai

# 7. Verify
claude --version
python -c "import anthropic; print('SDK:', anthropic.__version__)"
aws --version
az --version
docker --version
```

> Semester 2 frameworks (CrewAI, LangGraph, AutoGen, security testing tools) are installed at the start of the relevant unit, not on Day 1.
