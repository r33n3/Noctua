# REVIEW.md — Security Agent Projects
# Noctua AI Security Engineering Course Template
# Copy to your project root and customize for your system.

## Critical: Always Flag
- Hardcoded API keys, tokens, or credentials (any format)
- Environment variables read without validation
- File paths constructed from user/agent input without sanitization
- Shell commands constructed from dynamic input (command injection)
- MCP tool inputs passed through without schema validation
- Agent permissions broader than task requires (least privilege violation)
- Missing is_error handling on tool failure responses
- Secrets in logs, error messages, or agent output
- CLAUDE.md security rules without matching hooks (guidance without enforcement)

## High: Flag with Evidence
- Tool descriptions too vague for reliable selection
- Missing input validation on any external data path
- Error messages that reveal system architecture to potential attacker
- Agent with write access that only needs read access
- Subagent with model: opus when model: haiku would suffice (cost governance)
- Missing structured logging for agent decisions
- RAG retrieval without source validation (injection surface)

## Medium: Note for Awareness
- Missing /compact before long agent operations
- Inconsistent error handling patterns across tools
- Tool schemas without description fields on parameters
- Hardcoded model names instead of configuration
- Missing retry limits on agent loops (failure cap governance)

## Low: Skip Unless Pattern
- Style preferences (formatting, naming conventions)
- Comment quality (unless comments are actively misleading)
- Import ordering

## Review Context
This is a security agent system built in the Noctua AI Security Engineering course.
Review with the assumption that:
1. An adversary WILL attempt prompt injection via tool outputs
2. The agent WILL try to exceed its intended scope under goal pressure
3. Error messages WILL be read by attackers for reconnaissance
4. Any credential in plaintext WILL be found

Apply the External Enforcement Principle: if a security constraint
exists only in CLAUDE.md (Layer 1 GUIDANCE), flag it as needing a
matching hook (Layer 3 ENFORCEMENT) or infrastructure control (Layer 4).

## Elevation Context
This REVIEW.md is read during /code-review runs (ASSISTIVE gate prerequisite)
and by GitHub Action reviews (Delegated Autonomous gate prerequisite).
Passing review with no Critical/High findings is required evidence for
PeaRL elevation gates. Update this file as your system's risk profile evolves.
