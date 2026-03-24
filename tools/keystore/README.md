# Noctua Keystore

Encrypted local secret management for the Noctua course. No secret ever touches disk in plaintext.

## Why Not Just Use .env?

A `.env` file stores secrets in plaintext. Any process, script, or agent that can read files can read your secrets. In the PeaRL Governance Bypass case study, the autonomous agent read `.env.example` to discover the governance flag, then wrote directly to `.env` to escalate its own privileges. A plaintext credential file is an invitation to every agent in your environment.

The Noctua Keystore encrypts all secrets with AES-256-GCM using a master password. The encrypted vault file is unreadable without the password. Even if an agent reads `~/.noctua/vault.enc`, it gets encrypted bytes — not your API keys.

## Architecture

```
~/.noctua/
├── vault.enc    # AES-256-GCM encrypted JSON (chmod 600)
└── vault.salt   # PBKDF2 salt for key derivation (chmod 600)
```

**Encryption:** AES-256-GCM (authenticated encryption)
**Key derivation:** PBKDF2-SHA256, 100K iterations
**Salt:** 32 bytes, randomly generated per vault
**Nonce:** 12 bytes, randomly generated per save
**Permissions:** 600 (owner read/write only)

The master password never touches disk. It's prompted at runtime, used to derive the AES key, then discarded. The derived key exists only in memory during the operation.

## Quick Start

```bash
# 1. Run setup
chmod +x setup.sh && ./setup.sh

# 2. Create your vault
noctua-keys init
# Enter and confirm a master password

# 3. Add your API keys
noctua-keys add ANTHROPIC_API_KEY
# Paste your key when prompted (input is hidden)

noctua-keys add OPENAI_API_KEY
noctua-keys add THREAT_INTEL_KEY
noctua-keys add SIEM_API_TOKEN

# 4. Verify
noctua-keys list
# Shows key names with masked values

# 5. Load into shell
eval $(noctua-keys export)
# All secrets now available as environment variables
```

## Shell Integration

Add this to `~/.bashrc` or `~/.zshrc` to load keys on every new terminal:

```bash
# Noctua Keystore — load encrypted secrets
if command -v noctua-keys &> /dev/null && [ -f "$HOME/.noctua/vault.enc" ]; then
    eval $(noctua-keys export)
fi
```

You'll be prompted for your master password once per terminal session.

**For sessions where you don't want to be prompted** (e.g., scripts), you can cache temporarily:

```bash
# Cache for current session only (NOT recommended for shared machines)
export NOCTUA_MASTER=$(noctua-keys get ANTHROPIC_API_KEY > /dev/null && echo "cached")
```

## Claude Code Integration

### Environment Variables

After running `eval $(noctua-keys export)`, Claude Code automatically picks up:

```bash
# These are set by the keystore export
ANTHROPIC_API_KEY=sk-ant-...    # Claude Code uses this natively
OPENAI_API_KEY=sk-...           # For comparison exercises
```

### MCP Server Configuration

In `.mcp.json`, reference environment variables — never hardcode keys:

```json
{
  "mcpServers": {
    "threat-intel": {
      "command": "node",
      "args": ["./servers/threat-intel/index.js"],
      "env": {
        "TI_API_KEY": "${THREAT_INTEL_KEY}"
      }
    },
    "siem-connector": {
      "command": "python3",
      "args": ["./servers/siem/server.py"],
      "env": {
        "SIEM_TOKEN": "${SIEM_API_TOKEN}",
        "SIEM_HOST": "https://siem.lab.local"
      }
    }
  }
}
```

The `.mcp.json` file is safe to commit — it contains no secrets, only variable references.

### Retrieving Individual Keys in Scripts

```bash
# In a shell script
API_KEY=$(noctua-keys get THREAT_INTEL_KEY)
curl -H "Authorization: Bearer $API_KEY" https://api.threatintel.example/v1/indicators

# In Python
import subprocess
key = subprocess.check_output(
    ["noctua-keys", "get", "ANTHROPIC_API_KEY"],
    input=b"your-master-password\n"
).decode().strip()
```

### PreToolUse Hook — Block Credential Exposure

Create a hook that prevents Claude Code from accidentally exposing keys:

```bash
#!/bin/bash
# .claude/hooks/block-credential-exposure.sh
# Blocks commands that would print secrets to the terminal

COMMAND="$1"

# Block env var dumping
if echo "$COMMAND" | grep -qE 'env\s*\||\$.*KEY|\$.*TOKEN|\$.*SECRET|cat.*\.env|cat.*vault'; then
    echo "BLOCKED: Command would expose credentials"
    exit 1
fi
```

Wire it up in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "bash .claude/hooks/block-credential-exposure.sh"
      }]
    }]
  }
}
```

## Git Protection

### Pre-commit Secret Scanning

After running `setup.sh`, configure git-secrets in your project:

```bash
cd ~/noctua

# Initialize git-secrets
git secrets --install

# Add patterns for common API keys
git secrets --add 'sk-ant-[a-zA-Z0-9]{20,}'     # Anthropic
git secrets --add 'sk-[a-zA-Z0-9]{20,}'          # OpenAI  
git secrets --add 'ghp_[a-zA-Z0-9]{36}'          # GitHub PAT
git secrets --add 'AKIA[0-9A-Z]{16}'             # AWS Access Key
git secrets --add '[0-9a-f]{32}'                  # Generic 32-char hex (careful — may false positive)

# Test it
echo "sk-ant-abc123def456ghi789jkl012mno345" > test-leak.txt
git add test-leak.txt
git commit -m "test"  # Should BLOCK with error
rm test-leak.txt
```

### .gitignore

Add these lines (provided in `gitignore-credentials` after setup):

```gitignore
.env
.env.local
.env.*.local
*.enc
*.salt
vault.*
*.pem
*.key
.claude/settings.local.json
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `noctua-keys init` | Create a new encrypted vault |
| `noctua-keys add NAME` | Add or update a secret (prompts for value) |
| `noctua-keys add NAME -v VALUE` | Add with value inline (less secure — shows in history) |
| `noctua-keys get NAME` | Print secret value to stdout (for shell capture) |
| `noctua-keys list` | Show all key names with masked values |
| `noctua-keys delete NAME` | Remove a secret |
| `noctua-keys export` | Print `export` statements for shell sourcing |
| `noctua-keys env` | Print `.env` format (reference only — do not save) |
| `noctua-keys rotate` | Change master password (re-encrypts vault) |
| `noctua-keys check` | Verify vault integrity and permissions |

## Course Lab: Week 1 Setup Sequence

```bash
# Step 1: Clone course repo
git clone https://github.com/r33n3/Noctua.git
cd Noctua

# Step 2: Set up keystore
cd tools/keystore
chmod +x setup.sh && ./setup.sh

# Step 3: Initialize vault
noctua-keys init
# Choose a strong master password — you'll use it every session

# Step 4: Add your API keys
noctua-keys add ANTHROPIC_API_KEY
# Paste key from console.anthropic.com

noctua-keys add OPENAI_API_KEY  
# Paste key from platform.openai.com (if using for comparison)

# Step 5: Load into shell
eval $(noctua-keys export)

# Step 6: Verify Claude Code can see it
claude --version  # Should work if ANTHROPIC_API_KEY is set

# Step 7: Set up git protection
cd ~/noctua
git secrets --install
git secrets --add 'sk-ant-[a-zA-Z0-9]{20,}'
git secrets --add 'sk-[a-zA-Z0-9]{20,}'

# Step 8: Copy credential gitignore patterns
cat tools/keystore/gitignore-credentials >> .gitignore
git add .gitignore
git commit -m "Add credential protection patterns"

# Step 9: Set up Claude Code hook to block credential exposure  
mkdir -p .claude/hooks
# Create the hook script (see PreToolUse section above)

# Done! Your environment is secure.
# Every lab from here forward uses env vars from the keystore.
```

## Security Model

### What the keystore protects against:

| Threat | Protection |
|--------|-----------|
| Agent reads credential file | Vault is encrypted — unreadable without password |
| Agent reads .env | No .env file exists — secrets are in vault |
| Accidental git commit | git-secrets blocks known key patterns pre-commit |
| Credential in shell history | `noctua-keys add` prompts for value (hidden input) |
| File permission exposure | Vault files are chmod 600 (owner only) |
| Shoulder surfing | `list` shows masked values, `get` is for scripts not display |

### What the keystore does NOT protect against:

| Threat | Mitigation |
|--------|-----------|
| Agent reads env vars at runtime | PreToolUse hook blocks `env` and `echo $KEY` commands |
| Master password brute force | Use a strong password; PBKDF2 100K iterations slows attempts |
| Memory dump | Out of scope for local dev — production uses Vault/SSM |
| Compromised machine | If attacker has root, all bets are off — same as any local secret store |
| Agent social engineers user for password | PeaRL case study lesson — don't type your master password when an agent asks |

### Progression to Production

| Stage | Secret Management |
|-------|-------------------|
| Stage 0 (Sandbox) | Noctua Keystore — encrypted local vault |
| Stage 1 (Dev) | Noctua Keystore + git-secrets + PreToolUse hooks |
| Stage 2 (Preprod) | Transition to HashiCorp Vault or AWS SSM |
| Stage 3 (Prod) | Vault/SSM with role-based access, rotation, audit logging |

The keystore is the right tool for development. Production requires centralized secrets management with rotation, audit trails, and role-based access that a local vault can't provide.

---

## Supply Chain Attack Resistance

The LiteLLM supply chain attack (March 24, 2026) included a credential harvester
that scanned developer machines. Here is what the keystore does and does not protect
against in that attack pattern.

**What the harvester targeted:**

| Target | Keystore status | Why |
|--------|----------------|-----|
| `.env` files | **PROTECTED** | No `.env` file exists — secrets are in the encrypted vault |
| Credential files in home dir | **PROTECTED** | API keys are not written to disk in any plaintext file |
| AWS/GCP/Azure credential files (`~/.aws/credentials`) | **NOT PROTECTED** | These are outside the keystore's scope — use IAM roles in production |
| SSH keys | **NOT PROTECTED** | Separate concern — use hardware keys or SSH CA for high-value access |
| `.git-credentials` | **NOT PROTECTED** | Store git tokens in keystore manually; remove `~/.git-credentials` |
| Environment variables in a running shell | **NOT PROTECTED** | Once `eval $(noctua-keys export)` runs, keys are in the process environment |

**The in-memory gap explained:**

After running `eval $(noctua-keys export)`, API keys exist as environment variables
in your shell session. Any process running in that session — including a malicious
`.pth` file triggered by a compromised package — can read `os.environ` and find them.
The keystore protects keys at rest; it cannot protect keys that are loaded into memory.

**Mitigations for the gaps:**

```bash
# 1. Minimize session scope — load keys, run your tool, clear them
eval $(noctua-keys export)
python my_tool.py
unset ANTHROPIC_API_KEY OPENAI_API_KEY  # Clear immediately after

# 2. Use subprocess isolation — pass only the key(s) a specific tool needs
ANTHROPIC_API_KEY=$(noctua-keys get ANTHROPIC_API_KEY) python specific_tool.py

# 3. For production: use IAM roles and instance profiles
#    No files or env vars to steal — credentials are issued per-request by the cloud provider
```

**Egress filtering as the last line of defense:**

Even if credentials are stolen from memory, egress filtering blocks exfiltration.
If outbound traffic is restricted to known API domains (`api.anthropic.com`,
`api.openai.com`, etc.), the POST to a C2 server (`models.litellm.cloud` in the
LiteLLM attack) is denied at the network level before any data leaves the machine.

See: `docs/resources/case-studies/CASE-STUDY-LITELLM-SUPPLY-CHAIN.md` for full analysis.
