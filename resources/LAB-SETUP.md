# Lab Environment Setup Guide — Noctua

## Overview

The Noctua lab environment is designed for graduate students to build real agentic cybersecurity tools using Claude's autonomous agent capabilities. Rather than relying on traditional infrastructure (Debian servers, ELK stacks), this course centers on rapid prototyping with Claude Max subscription, supplemented by open-source frameworks for multi-vendor exposure.

You will develop autonomous security agents capable of threat detection, incident response, vulnerability assessment, and security architecture using Claude's Agent SDK, MCP servers, and agent teams. This practical approach prepares you to build production-ready security systems in enterprise environments.

## Tool Selection Guide

This course uses three Claude tools, each optimized for different types of work:

### Claude Chat (+ /think skill)
**Access:** claude.ai or Claude desktop app
**Use for:** Incident analysis, threat modeling, brainstorming, applying CCT frameworks, exploring hypotheses, learning concepts, reflecting on results
**Key feature:** The `/think` skill provides structured reasoning output — use it when you need to systematically work through a problem before acting

**When you'll use it:**
- Week 1: Analyzing the Meridian Financial incident
- Week 2: Team-based CCT analysis discussions
- Week 3: Comparing model outputs and evaluating quality
- Week 4: Designing context engineering approaches before building them
- Throughout: CCT journal reflections, threat modeling, design thinking

### Cowork
**Access:** Claude desktop app
**Use for:** Writing reports, organizing lab deliverables, creating policy documents, managing files, formatting audit reports, compiling structured documentation
**Key feature:** File-aware — Cowork can help you organize, format, and manage multiple deliverables

**When you'll use it:**
- Week 1: Organizing your CCT analysis report and metrics log
- Week 9: Structuring your ethics/AIUC-1 audit report
- Week 12: Writing your AI Security Policy document
- Throughout: Formatting and polishing lab deliverables

### Claude Code
**Access:** Terminal/CLI (`claude` command)
**Use for:** Building MCP servers, writing Python scripts, creating multi-agent systems, engineering security tools, implementing RAG pipelines, CI/CD pipelines
**Key feature:** Can read, write, and execute code in your development environment

**When you'll use it:**
- Week 4: Building context-engineered analysis systems
- Weeks 5-6: Building MCP servers
- Weeks 7-8: Building structured output generators and RAG systems
- Weeks 13-15: Rapid prototyping sprints
- Semester 2: Multi-agent systems, red team tools, defense tools, production pipelines

### The Switch Pattern
Most labs follow this flow:
1. **Think in Chat** — Analyze the problem, apply CCT, explore approaches
2. **Spec in Cowork** — Organize your thinking into requirements or deliverable structure
3. **Build in Code** — Implement the solution
4. **Retro in Chat** — Reflect on what worked, what didn't, what you'd change

Not every lab uses all three tools. Some are Chat-only (analysis exercises). Some are Code-only (building sprints). The skill is knowing which tool fits each phase of the work.

### Domain Assist Pattern

Many labs require domain expertise beyond core security (database administration, legal compliance, data science, DevOps, executive communication). When you see a **🧠 Domain Assist** callout, this means:

1. **Open Claude Chat** before starting that section
2. **Ask Claude to brief you** on the domain perspective needed
3. **Apply CCT** to what Claude tells you — don't take it at face value
4. **Proceed with the lab** armed with domain context you didn't have before

Example prompts for Domain Assist:

- "I'm about to audit an AI system for fairness. I've never done this before. Brief me on what fairness metrics matter, what auditors look for, and common pitfalls."
- "I need to write a Terraform deployment template for an ECS task. I've never written Terraform. Walk me through the key concepts I need to understand."
- "I'm scoring a vulnerability using CVSS. Explain the scoring methodology and walk me through how to assess each dimension for an AI agent prompt injection vulnerability."

The goal isn't to become an expert — it's to acquire enough context to do the lab meaningfully and learn from the experience.

---

## Platform Setup

### Claude Setup
- Create Claude account at claude.ai
- Claude Max subscription activation (per course fee)
- Install Claude Code CLI: `npm install -g @anthropic-ai/claude-code`
- Verify: `claude --version`

### OpenAI Platform Setup
- Create account at platform.openai.com
- API key generation and environment variable setup: `export OPENAI_API_KEY=your_key_here`
- Install OpenAI Python SDK: `pip install openai`
- Verify: `python -c "import openai; print(openai.__version__)"`
- Budget management: Set spending limits in your OpenAI account dashboard to avoid surprise charges

### AWS Setup (for open-source models and production labs)
- AWS Academy account activation (provided by institution) OR AWS Free Tier account with course-provided credits
- Region: us-east-1 (recommended for consistency)
- Services used: EC2 (GPU instances for Ollama), ECS (Unit 7 deployment), S3 (artifact storage)
- Ollama on AWS: Launch an EC2 GPU instance, install Ollama, pull your chosen model
- Cost estimation: ~$20-40/month with provided credits

### Anthropic SDK Installation
Install the Anthropic Python SDK for building API-integrated tools in labs:

```bash
pip install anthropic
```

Verify:
```bash
python -c "import anthropic; print(anthropic.__version__)"
```

The SDK is required starting Week 4 (Context Engineering) and used throughout the remainder of the course. It provides access to token usage data and cost tracking via the `response.usage` object.

### Local Machine Specifications
| Component | Minimum | Recommended | Notes |
|-----------|---------|-------------|-------|
| RAM | 8 GB | 16 GB+ | 16GB needed for running Mistral 7B locally |
| CPU | 4 cores | Apple M2+ or modern x86 | Apple Silicon runs Ollama models efficiently |
| GPU | None | NVIDIA 8GB+ VRAM | Required for local model hosting; AWS alternative available |
| Storage | 50 GB free | 100 GB free | Model files are 4-15 GB each |
| OS | macOS 12+, Ubuntu 22+, Win 11 | macOS (Apple Silicon) | Best Claude Code experience on macOS |

---

## Required Accounts and Subscriptions

### Claude Max Subscription (Primary)

A Claude Max subscription is required for all course work. This provides access to:

- **Claude Code CLI**: Command-line interface for autonomous code generation and iteration
- **Claude Agent SDK**: Framework for building agentic workflows with tool use and autonomous decision-making
- **Worktrees**: Isolated development branches for parallel experimentation
- **Subagents**: Specialized agents delegated to specific security domains
- **MCP (Model Context Protocol) Servers**: Bidirectional communication between Claude and custom tools, APIs, and data sources
- **Agent Teams**: Orchestrated multi-agent systems for complex security operations

Claude Max is available through institutional purchase (check with your program) or individual subscription at the current rate. Verify your subscription level grants access to all agent capabilities.

### Additional Accounts (Free Tier Sufficient)

- **GitHub Account (Required)**: All course work is Git-based. Create a free account at https://github.com if you don't have one. SSH key authentication is recommended.
- **AWS Account (Required)**: Free tier sufficient for course labs. Used for ECR (container registry), ECS (container orchestration), and IaC deployments. Sign up at https://aws.amazon.com/free/
- **OpenAI API Account (For Semester 2)**: Free tier with $5 credit sufficient for multi-vendor comparative labs. Sign up at https://platform.openai.com
- **Ollama (Free, Local)**: Used for open-weight model labs and sensitive data scenarios. No account required.

## Development Environment Setup

Choose one of the following setup paths based on your preference and device.

### Option A: GitHub Codespaces (Recommended)

GitHub Codespaces provides a fully configured cloud development environment without local installation complexity.

**Prerequisites:**
- GitHub account with Codespaces access (free tier includes monthly minutes)

**Setup Steps:**

1. Fork the Noctua course repository to your GitHub account
2. Click the green "Code" button on your fork
3. Select the "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for the environment to initialize (2-3 minutes)
6. A VS Code environment opens in your browser with all tools pre-installed

The Codespace includes a `devcontainer.json` that automatically installs:
- Python 3.11+
- Node.js 20+
- Git
- Claude Code CLI
- Docker
- Essential development tools

**Sample devcontainer.json** (reference—included in course repo):

```json
{
  "name": "Noctua Development",
  "image": "mcr.microsoft.com/devcontainers/python:3.11-node-20",
  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/aws-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "postCreateCommand": "bash .devcontainer/setup.sh",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "ms-python.debugpy",
        "GitHub.copilot",
        "ms-vscode.makefile-tools"
      ],
      "settings": {
        "python.defaultInterpreterPath": "/usr/local/bin/python",
        "python.linting.enabled": true,
        "python.linting.pylintEnabled": true
      }
    }
  }
}
```

**Cost:** GitHub Codespaces free tier provides 60 core-hours per month, sufficient for course labs. Paid tiers are available if needed.

### Option B: Local Machine Setup

If you prefer a local development environment, follow these steps.

**System Requirements:**
- macOS 11+, Windows 10/11, or Linux (Ubuntu 20.04+)
- 16GB RAM recommended
- 20GB free disk space
- Administrator access for Docker

**Step 1: Install Python 3.11+**

- **macOS**: Use Homebrew
  ```bash
  brew install python@3.11
  python3 --version
  ```

- **Windows**: Download from https://www.python.org/downloads/ and run the installer. Check "Add Python to PATH" during installation.
  ```powershell
  python --version
  ```

- **Linux**: Use package manager
  ```bash
  sudo apt update
  sudo apt install python3.11 python3.11-venv python3-pip
  python3 --version
  ```

**Step 2: Install Node.js 20+**

- **macOS**: Use Homebrew
  ```bash
  brew install node@20
  node --version
  npm --version
  ```

- **Windows**: Download from https://nodejs.org/ and run the LTS installer.
  ```powershell
  node --version
  npm --version
  ```

- **Linux**: Use NodeSource repository
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install nodejs
  node --version
  ```

**Step 3: Install Git**

- **macOS**: `brew install git`
- **Windows**: Download from https://git-scm.com/
- **Linux**: `sudo apt install git`

Verify and configure:
```bash
git --version
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Generate SSH keys for GitHub authentication:
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copy this and add to GitHub Settings > SSH Keys
```

**Step 4: Install Docker Desktop**

Docker is required for Semester 2 containerized labs and simulated security environments.

- **macOS**: Download from https://www.docker.com/products/docker-desktop
- **Windows**: Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Linux**: Follow https://docs.docker.com/engine/install/

Verify installation:
```bash
docker --version
docker run hello-world
```

**Step 5: Install GitHub CLI (gh)**

The GitHub CLI is used for managing repositories, pull requests, CI/CD workflows, and container registry operations — all from the terminal.

- **macOS**: `brew install gh`
- **Windows**: `winget install --id GitHub.cli`
- **Linux**:
  ```bash
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli-stable.list > /dev/null
  sudo apt update && sudo apt install gh
  ```

Authenticate and verify:
```bash
gh auth login
gh --version
```

**Step 6: Install AWS CLI v2**

AWS CLI is used for ECR (Elastic Container Registry) and ECS (Elastic Container Service) operations when promoting containerized prototypes to cloud deployments.

- **macOS**: `brew install awscli`
- **Windows**: Download from https://aws.amazon.com/cli/
- **Linux**:
  ```bash
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip && sudo ./aws/install
  ```

Configure and verify:
```bash
aws configure  # Enter your Access Key ID, Secret, region (us-east-1), output format (json)
aws --version
aws sts get-caller-identity  # Verify authentication
```

**Step 7: Install Claude Code CLI**

The Claude Code CLI is the primary interface for autonomous development in this course.

```bash
npm install -g @anthropic-ai/claude-code
```

Verify installation:
```bash
claude --version
```

### Claude Code CLI Setup

Once installed, authenticate with your Claude Max account.

**Step 1: Authenticate**

```bash
claude login
```

A browser window opens to authenticate with your Claude account. Complete the login flow and return to the terminal. Your authentication token is stored locally.

**Step 2: Verify Installation**

```bash
claude --version
claude config list
```

**Step 3: Configure for Course**

Create a `.claudeconfig` file in your project root (or use global settings):

```json
{
  "modelId": "claude-opus-4-6",
  "allowedTools": [
    "bash",
    "read",
    "write",
    "glob",
    "grep",
    "edit"
  ],
  "mcpServers": [],
  "workingDirectory": "./",
  "timeout": 300000
}
```

Key settings for the course:

- **modelId**: Use `claude-opus-4-6` for full capabilities. The course may specify different models for cost optimization in specific labs.
- **allowedTools**: Controls which tools Claude can use. The defaults above are recommended. MCP servers will be added per lab.
- **timeout**: Maximum execution time in milliseconds (adjust if labs require longer runs).

**Step 4: Run Your First Command**

```bash
claude "Create a simple Python script that prints 'Noctua Lab Environment Ready'"
```

Claude generates the script, saves it, and reports success. This verifies your setup is working.

### MCP Server Development Setup

Throughout the course, you will build MCP (Model Context Protocol) servers to extend Claude's capabilities for security operations. MCP servers act as bridges between Claude and external tools, APIs, data sources, and custom security functions.

**Install MCP SDKs:**

Python MCP SDK (primary for security tools):
```bash
pip install mcp
```

TypeScript MCP SDK (alternative, if you prefer Node.js):
```bash
npm install @modelcontextprotocol/sdk
```

**Verification: Build a Hello World MCP Server**

Create a file `hello_mcp_server.py`:

```python
import asyncio
import json
from mcp.server.lowlevel import Server
from mcp.types import Tool, TextContent, ToolResult

server = Server("hello-mcp")

@server.tool()
async def get_security_status(tool_name: str) -> str:
    """Returns a mock security status report."""
    return json.dumps({
        "status": "secure",
        "threats": 0,
        "agent_version": "1.0"
    })

async def main():
    async with server:
        print("Hello World MCP Server running...")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
```

Run the server:
```bash
python hello_mcp_server.py
```

If it starts without errors, your MCP development environment is ready.

## Multi-Vendor Framework Setup (Semester 2)

Semester 2 introduces frameworks for building multi-vendor security orchestration. These allow you to build agents that work with multiple LLMs and security platforms.

### CrewAI

CrewAI provides role-based agent teams with task delegation.

```bash
pip install crewai crewai-tools
```

Verify:
```bash
python -c "import crewai; print(crewai.__version__)"
```

### LangGraph

LangGraph enables stateful, multi-step agent workflows.

```bash
pip install langgraph langchain-anthropic langchain-openai langchain-community
```

Verify:
```bash
python -c "import langgraph; print('LangGraph installed')"
```

### AutoGen/AG2

AutoGen (now AG2) provides multi-agent conversation patterns.

```bash
pip install pyautogen-agentchat
```

Verify:
```bash
python -c "import autogen_agentchat; print('AG2 installed')"
```

### Ollama (Local Models)

Ollama runs open-weight models locally, useful for offline security work and sensitive data labs.

**Install Ollama:**

- **macOS**: Download from https://ollama.ai
- **Windows**: Download from https://ollama.ai (WSL 2 required)
- **Linux**:
  ```bash
  curl -fsSL https://ollama.ai/install.sh | sh
  ```

**Pull a Model:**

```bash
ollama pull llama2
```

This downloads a 4GB model. Alternative models:
- `ollama pull mistral` (faster, lighter)
- `ollama pull neural-chat` (optimized for conversation)
- `ollama pull openchat` (low-latency)

**Verify:**

```bash
ollama list
```

You should see your downloaded model listed.

**When to Use Local Models:**

- Labs involving sensitive data that shouldn't leave your machine
- Offline security assessments
- Cost optimization for large batch operations
- Network-isolated environments

## Course Repository Setup

All course work is version-controlled using Git.

**Step 1: Fork the Course Repository**

1. Navigate to the Noctua course repository on GitHub
2. Click the "Fork" button (top right)
3. Select your account as the fork destination
4. Wait for the fork to complete

**Step 2: Clone Your Fork Locally**

```bash
git clone git@github.com:YOUR-USERNAME/Noctua.git
cd Noctua
```

Replace `YOUR-USERNAME` with your GitHub username.

**Step 3: Add Upstream Remote**

This allows you to sync with course updates:

```bash
git remote add upstream git@github.com:COURSE-ORGANIZATION/Noctua.git
git fetch upstream
```

**Step 4: Branch Strategy**

Follow this branch naming convention:

- **main**: Official course releases and reference implementations (do not commit here)
- **dev**: Your personal development branch for in-progress work
- **lab-XX**: Individual branches for each lab (e.g., `lab-01`, `lab-02`)

**Create your dev branch:**

```bash
git checkout -b dev
git push -u origin dev
```

**For each lab, create a new branch:**

```bash
git checkout -b lab-01
# Work on lab 01
git commit -am "Complete lab 01: [description]"
git push -u origin lab-01
```

**Syncing with Course Updates:**

```bash
git fetch upstream
git rebase upstream/main
git push origin main
```

**Git Workflow Expectations:**

- Commit frequently (each functional unit)
- Write descriptive commit messages: "Add threat detection agent" not "update"
- Never force-push to main or dev branches
- Create pull requests for code review (if required by your program)
- Document your work in README files within lab directories

## DevSecOps Promotion Pipeline

Noctua follows a DevSecOps methodology for promoting prototypes from local development to production deployment. This isn't a DevSecOps course — we don't teach CI/CD in detail — but we follow the methodology so that when a prototype is selected by leadership for delivery, the path to production is already paved.

### The Promotion Path

**Local Development (Docker Desktop)**
Every prototype starts as a containerized application on Docker Desktop. From Week 1, students containerize their agents with a `Dockerfile` and `docker-compose.yml`. This ensures reproducibility, isolation, and a clean path to cloud deployment.

**Version Control & CI (GitHub + GH CLI)**
All code lives in GitHub. Students use `gh` for PR workflows, branch management, and triggering CI pipelines. GitHub Actions handles automated testing, linting, and security scanning on every push.

**Container Registry (ECR)**
When a prototype graduates from local Docker to cloud deployment, container images are pushed to Amazon ECR. Students learn to tag, push, and manage container images using the AWS CLI:

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push a local image
docker tag my-agent:latest <account>.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest
```

**Container Orchestration (ECS)**
Production deployments use Amazon ECS for container orchestration. Students define task definitions, services, and load balancers — first manually via CLI, then via Infrastructure as Code.

**Infrastructure as Code (IaC)**
Production infrastructure is defined in code (CloudFormation or Terraform), not clicked in consoles. This ensures repeatability, auditability, and version-controlled infrastructure changes.

### Security Gates at Each Stage

The DevSecOps pipeline includes security checkpoints that align with course content:

- **Pre-commit**: Secrets detection (no API keys in code), linting, type checking
- **PR Review**: Automated security scanning, peer code review, Claude Code review
- **Build**: Container image scanning for vulnerabilities (Trivy, Snyk)
- **Registry**: Image signing and provenance verification
- **Deploy**: Environment-based promotion gates (dev → staging → prod), runtime policy enforcement
- **Production**: Observability, anomaly detection, audit logging

### Containerization from Day 1

Every lab prototype should include a minimal `Dockerfile`. This is the standard pattern:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "agent.py"]
```

And a `docker-compose.yml` for local development:

```yaml
version: "3.8"
services:
  agent:
    build: .
    ports:
      - "8080:8080"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./data:/app/data
```

This pattern — build locally on Docker Desktop, push to ECR, deploy to ECS — is the same pattern used in enterprise AI deployments. Students who follow it from Week 1 will find that promoting a prototype to production is a matter of adding security gates and IaC, not a rewrite.

---

## Lab-Specific Environments

### Course Security Research Platforms (Primary)

#### MASS (Model & Application Security Suite)

MASS is an AI security tool that demonstrates real approaches to solving security assessment and compliance challenges in production AI deployments. It covers vulnerability scanning, compliance mapping, and attack surface analysis across models, prompts, tools, and agent workflows. You will study how MASS approaches these problems — its analyzer architecture, compliance mapping methodology, and MCP-based integration patterns — then use Claude Code to implement your own security assessment capabilities.

**What MASS Teaches (Source Code to Study):**

Study the MASS repository at https://github.com/r33n3/MASS to understand:

**12 Analyzer Architectural Patterns:**
- Input validation analyzer
- Prompt injection analyzer
- Output poisoning analyzer
- Model behavior analyzer
- Data leakage analyzer
- Dependency analyzer
- Configuration analyzer
- Compliance analyzer
- Governance analyzer
- Threat modeling analyzer
- Risk assessment analyzer
- Remediation recommendation analyzer

Each analyzer demonstrates modular security assessment design patterns you will implement in your own tools.

**Compliance Framework Mapping Methodology:**
MASS maps findings to compliance frameworks as a case study:
- **OWASP LLM Top 10** — Architectural pattern for vulnerability classification
- **MITRE ATLAS** — Technique mapping patterns for AI threat modeling
- **NIST AI RMF** — Risk management framework integration patterns
- **EU AI Act** — Regulatory mapping patterns

Study how MASS structures its compliance mappings—you will build similar patterns in your own governance tools.

**MCP Server Design as Tool Exposure Patterns:**
MASS exposes security tools via an MCP server architecture, demonstrating how to bridge autonomous agents with security capabilities. This is a case study in MCP design patterns; you will design your own MCP servers for security functions throughout the course.

**How Students Use MASS:**

1. **Code Review**: Clone the repository and review the 12 analyzers' implementation
2. **Architecture Study**: Understand how MASS structures modular security functions
3. **Implementation**: Build your own security analyzers using similar patterns in Claude Code
4. **Lab Application**: When labs require security assessment, implement your own analyzers inspired by MASS patterns rather than running MASS directly

**Reference Repository:** https://github.com/r33n3/MASS

**Students will use Claude Code to build their own security analyzers inspired by MASS's architecture.**

#### PeaRL (Policy-enforced Autonomous Risk Layer)

PeaRL is an AI security tool that demonstrates real approaches to solving governance and oversight challenges in production autonomous agent deployments. It covers environment-based promotion gates, policy-as-code enforcement, behavioral anomaly detection, fairness attestation, and approval workflows. You will study how PeaRL approaches these problems — its multi-layer governance model, AGP anomaly detection patterns, and context compilation methodology — then use Claude Code to implement your own governance capabilities.

**What PeaRL Teaches (Source Code to Study):**

Study the PeaRL repository at https://github.com/r33n3/PeaRL to understand:

**Governance Model Architectural Patterns:**

- **Environment Hierarchy**: Design pattern for agent environment progression (development → staging/pilot → pre-production → production)
- **Approval Workflow Pattern**: Multi-stage approval systems with stakeholder roles and delegation
- **Fairness Requirements Framework**: Systematic evaluation of agent behavior for bias and fairness
- **Behavioral Anomaly Detection**: Pattern analysis for detecting unexpected or dangerous agent behavior

**Anomaly Detection Patterns (AGP-01 through AGP-05):**

These anomaly governance patterns (AGP) demonstrate automated detection of problematic agent behavior:
- **AGP-01**: Excessive tool usage pattern
- **AGP-02**: Out-of-scope action pattern
- **AGP-03**: Fairness violation pattern
- **AGP-04**: Data leakage pattern
- **AGP-05**: Behavior drift pattern

Study how PeaRL implements these detection patterns—you will design similar anomaly detection in your own governance systems.

**39 MCP Tools as Governance Tooling Example:**

PeaRL exposes 39 tools via MCP, demonstrating comprehensive governance tooling design:
- Context compilation tools
- Findings submission tools
- Environment promotion tools
- Fairness evaluation tools
- Compliance assessment tools
- Behavioral monitoring tools

These tools are an example of comprehensive governance interface design. Study the MCP architecture, but you will design your own governance interfaces for your agents.

**How Students Use PeaRL:**

1. **Architecture Review**: Clone the repository and review the governance model implementation
2. **Pattern Study**: Understand the anomaly detection patterns, approval workflows, and environment hierarchy
3. **Design**: Create your own governance layers for autonomous agents in course labs, inspired by PeaRL's patterns
4. **Implementation**: Build governance systems using Claude Code and custom MCP servers

**Reference Repository:** https://github.com/r33n3/PeaRL

**Students will design their own governance layers inspired by PeaRL's architecture.**

---

### AI Red Teaming & Adversarial Testing Tools

```bash
# Garak (NVIDIA) — LLM vulnerability scanner
pip install garak
garak --list_probes  # List available probe modules

# PyRIT (Microsoft) — Multi-turn adversarial red teaming
pip install pyrit
# Requires Azure OpenAI or compatible endpoint configuration

# Promptfoo — Red teaming with compliance mapping
npm install -g promptfoo
promptfoo init  # Initialize config
promptfoo redteam run  # Run red team evaluation

# DeepTeam — LLM vulnerability testing (40+ vulnerability types)
pip install deepteam
```

### AI Guardrails & Governance Tools

```bash
# NeMo Guardrails (NVIDIA) — Programmable LLM guardrails
pip install nemoguardrails
nemoguardrails chat --config ./config/

# Guardrails AI — Runtime validation framework
pip install guardrails-ai
guardrails hub install hub://guardrails/toxic_language

# Cisco MCP Scanner — MCP supply chain security
pip install mcp-scanner
mcp-scanner scan  # Scans MCP configurations for vulnerabilities
```

### LlamaFirewall (Meta) — Agent Security

```bash
pip install llamafirewall
# Three defense layers: PromptGuard 2, Agent Alignment Checks, CodeShield
# See: https://github.com/meta-llama/llama-firewall
```

### Fairness & Bias Assessment

```bash
# IBM AI Fairness 360
pip install aif360

# Aequitas (University of Chicago)
pip install aequitas
```

### Traditional Security Tools (Supplementary)

Certain labs may use traditional tools for data collection and manual verification:

- Wireshark: `brew install wireshark` (macOS) or `sudo apt install wireshark` (Linux)
- nmap: `brew install nmap` or `sudo apt install nmap`
- Burp Suite Community: https://portswigger.net/burp/communitydownload

### Mock Data and Simulated Environments

The course provides Docker Compose files for creating realistic lab environments without exposing real systems.

**Available Environments** (in `/lab-environments/`):

- **mock-siem**: Simulated SIEM with sample security events and logs
- **vulnerable-app**: Intentionally vulnerable web application for security testing
- **network-traffic**: Captured network traffic samples for analysis
- **log-repository**: Large dataset of real sanitized security logs

**Running a Lab Environment:**

```bash
cd lab-environments/mock-siem
docker-compose up -d
```

Access the environment (details in each lab):

```bash
# Example: Access SIEM dashboard
open http://localhost:5601

# Example: Interact with vulnerable app
curl http://localhost:8080
```

**Stopping Environments:**

```bash
docker-compose down
```

All lab environments are containerized and isolated—they can be safely started and stopped without affecting your system or other labs.

## Verification Checklist

Before beginning coursework, verify your complete setup:

**Core Development Tools:**
- [ ] Claude Max subscription active and verified
- [ ] Claude Code CLI installed (`claude --version`)
- [ ] Claude Code CLI authenticated (`claude login`)
- [ ] Python 3.11+ installed and accessible (`python3 --version`)
- [ ] pip package manager working (`pip --version`)
- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm package manager working (`npm --version`)
- [ ] Git installed and configured (`git config --list`)
- [ ] SSH keys generated and added to GitHub
- [ ] GitHub account created and accessible
- [ ] Course repository forked and cloned locally
- [ ] Git branches (main, dev) verified
- [ ] Docker Desktop installed and running (`docker --version`)
- [ ] GitHub CLI installed and authenticated (`gh auth status`)
- [ ] AWS CLI v2 installed and configured (`aws sts get-caller-identity`)

**Agentic Frameworks and MCP:**
- [ ] MCP SDK installed (Python: `pip list | grep mcp`)
- [ ] First MCP server runs successfully (hello_mcp_server.py)
- [ ] CrewAI installed (Semester 2)
- [ ] LangGraph installed (Semester 2)
- [ ] AutoGen installed (Semester 2)
- [ ] Ollama installed and has at least one model (`ollama list`)
- [ ] OpenAI API account created (Semester 2)

**Course AI Security Tools (Production Approaches Study):**
- [ ] Reviewed MASS source code architecture (12 analyzers, compliance mapping patterns) at https://github.com/r33n3/MASS
- [ ] Understood MASS compliance framework mappings (OWASP LLM, MITRE ATLAS, NIST AI RMF, EU AI Act)
- [ ] Reviewed MASS MCP server design pattern for tool exposure
- [ ] Reviewed PeaRL source code architecture (environment hierarchy, approval workflows, fairness patterns) at https://github.com/r33n3/PeaRL
- [ ] Understood PeaRL governance model and anomaly detection patterns (AGP-01 through AGP-05)
- [ ] Reviewed PeaRL MCP tools design (39 governance tools as comprehensive tooling example)

For each item, run the provided command. If any fail, consult the Troubleshooting section or post in the course discussion forum.

## Troubleshooting

### Claude Code CLI Issues

**Problem:** `claude: command not found`

**Solution:**
1. Verify installation: `npm list -g @anthropic-ai/claude-code`
2. If not installed, run: `npm install -g @anthropic-ai/claude-code`
3. Ensure npm global bin directory is in PATH: `echo $PATH | grep npm`
4. If not present, add to your shell profile (~/.bashrc, ~/.zshrc, etc.): `export PATH="$HOME/.npm-global/bin:$PATH"`

**Problem:** `Authentication failed`

**Solution:**
1. Clear existing credentials: `rm ~/.claude/credentials.json`
2. Re-authenticate: `claude login`
3. If login fails, verify your Claude Max subscription is active in your account dashboard
4. For organizational accounts, contact your administrator to ensure Claude Code access is provisioned

**Problem:** MCP servers don't appear in `claude config`

**Solution:**
1. Verify MCP server is running: Check terminal where server started for error messages
2. Ensure MCP SDK is installed: `pip install mcp --upgrade`
3. Check MCP server configuration in `.claudeconfig` matches actual server details
4. For TypeScript servers, ensure TypeScript compilation completed: `npm run build`

### Python and Dependency Issues

**Problem:** `ModuleNotFoundError: No module named 'mcp'`

**Solution:**
```bash
pip install --upgrade mcp
python3 -m pip install mcp  # Use python3 explicitly if python points to Python 2
```

**Problem:** Version conflicts between packages

**Solution:**
Create a virtual environment to isolate dependencies:
```bash
python3 -m venv noctua-env
source noctua-env/bin/activate  # macOS/Linux
# OR
noctua-env\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Docker Issues

**Problem:** `docker: command not found` or Docker daemon not running

**Solution:**
1. Verify Docker Desktop is installed: Open Applications (macOS) or Programs (Windows)
2. Start Docker Desktop if not running
3. Test with: `docker run hello-world`

**Problem:** Permission denied for docker commands on Linux

**Solution:**
```bash
sudo usermod -aG docker $USER
newgrp docker
docker ps  # Test
```

### Git and GitHub Issues

**Problem:** `Permission denied (publickey)` when pushing to GitHub

**Solution:**
1. Verify SSH key exists: `ls ~/.ssh/id_ed25519.pub`
2. If missing, generate: `ssh-keygen -t ed25519 -C "your.email@example.com"`
3. Copy public key: `cat ~/.ssh/id_ed25519.pub`
4. Add to GitHub: Settings > SSH and GPG keys > New SSH key > Paste
5. Test connection: `ssh -T git@github.com`

**Problem:** `fatal: not a git repository`

**Solution:**
Ensure you're in the correct directory:
```bash
cd Noctua
git status
```

### Node.js and npm Issues

**Problem:** Global npm packages not found

**Solution:**
```bash
npm list -g  # See installed packages
which npm    # Verify npm location
npm config get prefix  # Check global install directory
```

### Ollama Issues

**Problem:** Model download fails or is very slow

**Solution:**
1. Check internet connection
2. Try pulling a smaller model: `ollama pull mistral` (smaller than llama2)
3. Check available disk space: `df -h`
4. Resume partial download: `ollama pull llama2` (automatically resumes)

**Problem:** Model not found after pulling

**Solution:**
```bash
ollama list  # Verify model is listed
ollama show llama2  # Get model details
ollama rm llama2  # Remove and repull if corrupted
ollama pull llama2
```

## Cost Considerations

**Claude Max Subscription:**
- Current pricing: $20/month (subject to change—verify in your account)
- Institutional pricing may be available through your program
- Cost includes all Claude Code, Agent SDK, and MCP capabilities
- Estimate for course: Will vary based on lab complexity; typical programs allocate 1 subscription per student

**OpenAI API Usage (Semester 2):**
- Pricing: ~$0.01-0.10 per 1K tokens depending on model
- Free tier includes $5 credit per month
- Typical course usage: $10-20 per student for entire semester
- Budget-conscious: Use local models (Ollama) for cost-sensitive labs

**GitHub Codespaces:**
- Free tier: 60 core-hours per month (equivalent to ~15 hours of 4-core development)
- Paid: $0.36 per core-hour for usage beyond free tier
- Recommendation: Use free tier during course; upgrade if needed for extended sessions

**All Other Tools:**
- Python, Node.js, Git: Free and open-source
- Docker Desktop: Free
- MCP SDK: Free (open-source)
- CrewAI, LangGraph, AutoGen: Free (open-source)
- Ollama: Free (open-source)
- Burp Suite Community: Free (limited features; Pro available for $399/year)
- Wireshark, nmap: Free and open-source

**Total Estimated Cost Per Student (Full Year):**
- Minimum: $240 (Claude Max, $20/month × 12)
- Typical: $240 + $15 (Claude Max + OpenAI API usage)
- Maximum: $240 + $50 + $399 (if using Burp Suite Pro)

Most students will fall in the typical range. Financial hardship policies should be coordinated with your program.

## Next Steps

1. Complete the Verification Checklist above
2. Post any blockers to the course discussion forum with the specific error message
3. Clone the course repository and review the `/labs` directory structure
4. Read the Lab 1 README for your first assignment
5. Join the course Slack/Discord for real-time support and peer collaboration

Welcome to Noctua. You're now ready to build autonomous security agents.
