# Case Study: LiteLLM Supply Chain Attack (March 24, 2026)

> **Incident date:** March 24, 2026
> **Status:** Initial disclosure — verify all details against updated primary sources before course delivery.
> **Sources:** FutureSearch disclosure, Endor Labs analysis, Simon Willison, The Hacker News, BerriAI/litellm#24512, Endor Labs / ramimac.me (TeamPCP tracking)
> **Last updated:** March 24, 2026

---

## Classification

| Dimension | Classification |
|-----------|---------------|
| OWASP Agentic Top 10 | #7 Supply Chain Vulnerabilities, #10 Inadequate IAM |
| AIUC-1 Domains | B. Security (B008 — protect deployment environment), A. Data & Privacy |
| MITRE ATT&CK | T1195.002 — Supply Chain: Compromise Software Supply Chain |
| Defense Layer | Layer 3 (Execution enforcement) and Layer 4 (Infrastructure isolation) |
| Agentic Scope | **Not agent behavior** — targets the infrastructure agents run on |

---

## What Happened

On March 24, 2026, LiteLLM versions 1.82.7 and 1.82.8 were published to PyPI
containing credential-stealing malware. LiteLLM is a Python library that provides
a unified API for routing calls to 100+ LLM providers (OpenAI, Anthropic, Azure,
Bedrock, etc.) — approximately 97 million downloads per month.

### The Attack Chain

**Stage 0 — Trivy Compromise (March 19)**

TeamPCP compromised Trivy, a widely-used container security scanner.
They hijacked release tags in the `trivy-action` GitHub Action to point
at malicious commits. This affected any CI/CD pipeline using Trivy for scanning.

**Stage 1 — Credential Cascade**

LiteLLM used Trivy in their CI/CD pipeline for security scanning.
The compromised Trivy extracted PyPI publishing credentials from
LiteLLM's CI environment.

**Stage 2 — Malicious Package Publication**

Using stolen credentials, attackers published LiteLLM 1.82.7 and 1.82.8
directly to PyPI. No corresponding release exists on GitHub — the
normal release process was completely bypassed. Version pinning failed
because the attacker published *under the pinned version number*.

**Stage 3a — Version 1.82.7 Payload**

12 lines of obfuscated code inserted into `proxy/proxy_server.py`.
Triggered on import — `import litellm` is sufficient to execute it.

**Stage 3b — Version 1.82.8 Escalation**

A `.pth` file (`litellm_init.pth`) added to the wheel package.
Python's `site` module automatically executes `.pth` files during
interpreter initialization — the malware runs on **every Python
process startup**, even if LiteLLM is never imported.
Just having the package installed is sufficient to execute the payload.

**Stage 4 — Three-Stage Credential Theft**

- *Harvester:* SSH keys, AWS/GCP/Azure credentials, Kubernetes configs,
  database passwords, `.env` files, `.git-credentials`, shell history,
  crypto wallet files, API keys
- *Persistence:* systemd user service at `~/.config/sysmon/sysmon.py`
  polling a C2 server every 50 minutes for additional binaries
- *Lateral Movement:* deploys privileged pod to every Kubernetes node,
  installing a backdoor on the host OS

**Stage 5 — Exfiltration**

Harvested credentials encrypted (AES-256/RSA-4096) and sent to
`models.litellm[.]cloud` via HTTPS POST. The C2 domain mimics the
legitimate LiteLLM domain — a lookalike designed to pass casual log review.

### Discovery (Accidental)

The attack was discovered by FutureSearch when an MCP plugin running
inside Cursor pulled LiteLLM as a transitive dependency — the developer
never ran `pip install litellm` directly. The `.pth` launcher contained
a bug: it spawned child Python processes via `subprocess.Popen`, but
because `.pth` files trigger on every interpreter startup, the child
re-triggered the same `.pth`, creating an exponential fork bomb that
crashed the machine. **The bug in the malware is what exposed the malware.**

### The Cruel Irony

LiteLLM is an API key management gateway. The attacker targeted the one
package that, by definition, has access to every LLM API key in the
organization. The package designed to manage your AI credentials
became the tool that stole them all.

---

## Course Analysis

### Through the Four Defense Layers

**Layer 1 (Soft — CLAUDE.md):**
A CLAUDE.md rule saying "never install unverified packages" would not
have prevented this. The developer was running `pip install` as normal
operation. The package was on PyPI, the trusted registry. Soft controls
are **irrelevant against supply chain attacks** — the trust model itself
is the vulnerability.

**Layer 2 (Application — role gates, credentials):**
- Noctua Keystore **WOULD HAVE HELPED**: API keys in the encrypted vault
  are not readable by a credential harvester scanning `.env` files.
  The harvester targets plaintext files, not encrypted vaults.
- Scoped credentials **WOULD HAVE LIMITED BLAST RADIUS**: separate keys
  per service with minimal permissions means a stolen key can only
  access one service, not everything.
- **BUT**: environment variables loaded into the shell (via `eval $(noctua-keys export)`)
  ARE vulnerable once the malware is running in the same process.
  The keystore protects at-rest credentials, not in-memory credentials.

**Layer 3 (Execution — hooks, enforcement):**
- Hash-pinned dependencies (`pip install --require-hashes`) **WOULD HAVE
  CAUGHT THIS**: the hash of the malicious wheel doesn't match the hash
  of the legitimate package. Installation fails immediately.
- `pip-audit` / `safety` scanning **WOULD HAVE CAUGHT THIS** — after the
  advisory was published (but not before, during the zero-day window).
- Egress filtering **WOULD HAVE BLOCKED EXFILTRATION**: if outbound traffic
  is restricted to known API domains (`api.openai.com`, `api.anthropic.com`),
  the POST to `models.litellm.cloud` would be denied.

**Layer 4 (Infrastructure — containers, isolation):**
- Running in a container with no network egress would contain the blast.
- Separate Python virtual environments per project limit exposure.
- Ephemeral CI/CD runners (destroyed after each job) limit persistence.
  The systemd backdoor doesn't survive if the runner is a disposable container.

---

### Through OWASP Agentic Top 10

**#7 Supply Chain Vulnerabilities:**
The compromised dependency was not a direct import — it was a
transitive dependency pulled in by an MCP plugin. The developer
never ran `pip install litellm` directly. Supply chain risk
extends to EVERY dependency in the tree, not just direct ones.

**#10 Inadequate Identity and Access Management:**
- The PyPI publishing token was a single static credential
- PyPI Trusted Publishers (OIDC-based, no static tokens) would have
  prevented this: the stolen CI/CD credentials couldn't publish to PyPI
  without a valid OIDC token from the legitimate GitHub Actions run
- The credential was shared across the CI/CD pipeline, not scoped

---

### Through AIUC-1 Domains

**B. Security (B008 — Protect Model Deployment Environment):**
The deployment environment (PyPI, CI/CD, developer machines) was
not protected against supply chain manipulation. B008 requires
verifying integrity of the deployment pipeline — hash verification,
SBOM validation, signed packages.

**A. Data & Privacy:**
Credentials harvested include PII-adjacent data (`.git-credentials`,
shell history) and high-value secrets that protect PII (database
passwords, cloud tokens with access to user data stores).

---

### The Cascading Attack Pattern

```
Trivy (security tool)
  → compromised via tag hijacking
  → used in LiteLLM CI/CD
  → CI/CD credentials stolen
  → PyPI publishing token obtained
  → malicious LiteLLM published
  → installed by developers worldwide
  → credentials harvested from every machine
  → those credentials used for NEXT target
  → "This campaign is almost certainly not over" — Endor Labs
```

Compare to PeaRL rugpull:
```
L1 → L2 → L3 → L4 → L5 → L6 → L7
Each level's success enables the next level's attempt.
```

The pattern is identical. The scope is different:
- **PeaRL:** one agent, one project, seven escalation levels
- **TeamPCP:** one tool, five ecosystems, cascading credential chains

---

## Discussion Questions

1. Your security scanner (Trivy) was compromised and used to steal
   your publishing credentials. How do you verify the integrity of
   your security tools themselves? Who watches the watchmen?

2. LiteLLM was pulled in as a transitive dependency by an MCP plugin.
   How would you audit the FULL dependency tree of your MCP servers?
   How deep should that audit go?

3. Version pinning (`pip install litellm==1.82.7`) failed because the
   attacker published a malicious version with that number. Hash
   pinning would have caught it. Why don't most teams use hash pinning?
   What's the operational cost vs the security benefit?

4. The noctua-keystore protects secrets at rest but not in memory.
   Once `eval $(noctua-keys export)` loads keys into environment
   variables, any process on the machine can read them. How would you
   design a credential system that protects keys even from malicious
   code running in the same environment?

5. The malware was discovered because it had a BUG (fork bomb).
   If the malware had worked correctly, how long would it have
   remained undetected? What monitoring would have caught a
   correctly-functioning credential stealer?

6. Egress filtering (blocking outbound traffic to unknown domains)
   would have prevented exfiltration. Why don't most development
   environments have egress filtering? Should they?

7. Map this attack to the AWS Agentic Scoping Matrix. The attack
   doesn't involve AI agency at all — it targets the INFRASTRUCTURE
   that agents run on. Where does infrastructure security fit in
   the scoping model? Is there a gap?

---

## The Three Course Case Studies

This case study completes the three-vector threat model for this course:

| Case Study | Vector | Lesson |
|-----------|--------|--------|
| **PeaRL Governance Bypass** (course-generated, 2025) | Agent attacks its own governance from inside | Governance must be enforced outside the reasoning loop |
| **GTG-1002 AI Cyber Espionage** (Anthropic, November 2025) | Adversary weaponizes the same architecture you build | Agent architecture is dual-use; intent validation is the difference |
| **LiteLLM Supply Chain** (TeamPCP, March 2026) | Adversary compromises the tools and dependencies agents run on | Your agent's security includes its entire dependency tree |

Together: inside-out (PeaRL), outside-in (GTG-1002), underneath (LiteLLM).
Students who understand all three can defend against the full threat landscape.

---

## Primary Sources

- FutureSearch disclosure: `futuresearch.ai/blog/litellm-pypi-supply-chain-attack/`
- BerriAI/litellm GitHub Issue #24512
- Simon Willison: `simonwillison.net/2026/Mar/24/malicious-litellm/`
- Endor Labs analysis (via The Hacker News)
- TeamPCP campaign tracking: `ramimac.me/trivy-teampcp/`
