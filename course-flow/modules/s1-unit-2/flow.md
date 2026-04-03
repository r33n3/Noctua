# Module: Context Engineering & Tool Design (S1 Unit 2)

## Purpose
Moves students from consumers of AI tools to builders of them. By end of unit, every student has built a working MCP server, a secure tool suite with validation and audit logging, a structured output pipeline, and a RAG system with citations. The context library grows from a template into a real engineering asset.

## Outcomes
By the end of this module, the student can:
- Design and implement a production-grade MCP server with input validation, error handling, and audit logging
- Apply the "Pit of Success" principle to tool definitions
- Build structured output pipelines with schema validation and retry logic
- Implement a RAG system with chunking, embedding, retrieval, and citation tracking
- Identify and test for OWASP tool-layer vulnerabilities (injection, scope creep, audit log tampering)

## Related Site Content
- `docs/lab-s1-unit2.html` — student-facing lab guide
- `docs/s1-unit2.html` — unit theory content

## Prerequisites
- Unit 1 completed (CCT framework, context library started)
- `pip install anthropic` (if not already done)
- Node.js or Python 3.10+ for MCP server labs

---

## Instruction Guidance

Students arrive having used AI as a consumer. This unit requires them to think as a tool designer.

1. **Tool design is security design.** Every tool definition is a permission grant. Push students to think adversarially: "What's the most damaging thing this tool could do if called with malicious arguments?"
2. **The Pit of Success framing is mandatory.** Before a student ships a tool, ask: "Is the safe path the easy path? What would you have to do to misuse this tool accidentally?"
3. **Audit logging is not optional.** Students skip logging as "boilerplate." Reframe it: "An auditor is going to ask what this agent did at 2pm on Tuesday. Can you answer that right now?"
4. **RAG is an attack surface.** Poisoned retrieval is a real threat. In Week 8, ask: "What happens if an attacker controls one of your knowledge base documents?"
5. **Context library grows here.** Each week should add at least one pattern. By end of Week 8, the library should cover MCP patterns, structured output schemas, and RAG pipeline configuration.

## Hint Policy
Follow `agent/policies/hint-policy.md` — Early-to-Mid Module rules apply.

Module-specific: For MCP server work, show the SDK registration pattern once; after that, ask "What validation does this endpoint need?" For structured outputs, give the Pydantic/JSON schema pattern but require the student to define the schema fields.

---

## Tasks

1. **Week 5 — MCP Server** — Build a working MCP server with 2–3 security tools. Implement input validation schemas and error handling for all edge cases.
2. **Week 6 — Secure Tool Suite** — Extend to multi-tool server with rate limiting and audit logging. Run red team / blue team security tests. Document Operation Forge Fire findings.
3. **Week 7 — Structured Output Pipeline** — Build a 3-call chained pipeline with schema validation at each step and retry logic. Generate 5–10 sample reports, all valid JSON.
4. **Week 8 — RAG System** — Build end-to-end RAG: ingestion, chunking, embedding, retrieval, Claude integration, citations. Evaluate retrieval precision and citation fidelity.

See `semester-1/weeks/week-05.md` through `week-08.md` for full lab instructions.

## Expected Artifact

**Week 5:** MCP server code (Python or Node.js), tool schema documentation (JSON schemas, deploy instructions)

**Week 6:** Multi-tool MCP server with rate limiting + audit logging, security test results, tool specification document, red team/blue team writeup

**Week 7:** Report generator code (3-call chain), schemas documentation, 5–10 generated reports (valid JSON), validation report (pass rates, retry counts), integration demo

**Week 8:** RAG system code (full pipeline), knowledge base documentation, evaluation report (retrieval precision, citation fidelity, RAG vs. unaugmented comparison), 10–15 sample Q&A with quality scores

Context library additions: MCP pattern, structured output schema pattern, RAG pipeline pattern (saved to `context-library/patterns/`).

---

## Review Guidance

**Recommended review mode:** Security (all weeks — tool design is security design)

**Common gaps:**
- MCP server with no input validation — not acceptable; every tool endpoint needs a schema
- Audit log that can be deleted without detection — probe the governance exercise: "What happens when the log is wiped?"
- Structured output pipeline with no retry logic — "What does your system do on the third failed validation?"
- RAG evaluation that measures only "does it return something" — require precision and citation fidelity metrics

**Probing question bank:**
- "What's the most dangerous tool in your MCP server? What does it do if called with malicious input right now?"
- "Your audit log records everything. Where is it stored, and what prevents an attacker from deleting it?"
- "Show me the validation step between the first and second call in your pipeline. What does it reject?"
- "Your RAG system retrieved [document]. How do you know that document is still accurate?"

## Reflection Prompt
"What changed about how you think about tool definitions after building and attacking your own MCP server? What would you do differently in Week 5 if you started over?"

---

## Completion Gate
The student may advance to Unit 3 when:
- [ ] All four weeks' deliverables produced and saved
- [ ] MCP server, structured output pipeline, and RAG system all running
- [ ] Context library has at least 3 new pattern entries (MCP, structured output, RAG)
- [ ] Reflection entry written in `student-state/reflection-log.md`

## Stretch Challenge
Connect your RAG system to your MCP server. Build a tool that retrieves context from your knowledge base and injects it into agent prompts automatically. Add a freshness check: flag any retrieved document older than 30 days before use.
