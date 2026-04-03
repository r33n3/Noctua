# Week 7: Structured Outputs & Security Reporting

**Semester 1 | Week 7 of 16**

## Opening Hook

> A Claude that returns "this looks suspicious" is a conversational tool. A Claude that returns `{"severity": "critical", "playbook": "P-CRITICAL-01", "confidence": 0.92}` is a SOC component. Structured outputs are how you cross that line — and this week you build the reporting pipeline that makes AI-generated findings actionable by automated security infrastructure.

## Learning Objectives

- Distinguish natural language from deterministic structured outputs
- Design JSON schemas for compliance-ready security reports
- Implement output validation and constraint enforcement
- Chain multiple Claude calls with different schemas for complex pipelines
- Integrate structured reports into downstream systems (SIEM, SOAR, ticketing)

---

## Day 1 — Theory

### The Determinism Imperative

In early AI use, security analysts accepted outputs like "this seems suspicious" or "probably moderate severity." In 2026, this is unacceptable. Modern security infrastructure requires deterministic, machine-readable outputs.

**The problem with natural language:**
- "This might be a threat" — does the SOAR platform escalate or not?
- "Probably moderate severity" — which SLA applies?
- "Seems suspicious" — which playbook runs?

**The solution — structured JSON:**

```json
{
  "severity": "critical",
  "action": "block",
  "confidence": 0.92,
  "sla_tier": 1,
  "playbook": "P-CRITICAL-01"
}
```

Now your SOAR platform can act automatically. The JSON is unambiguous — it routes to the right playbook, triggers the right SLA, and creates an auditable decision record.

> **Key Concept:** Structured outputs are the bridge between AI reasoning and automated security infrastructure. Without them, AI is a conversational assistant. With them, it's an integrated component in your SOC pipeline.

---

### Structured Output Formats for Security

Security has established standards you should use rather than inventing your own schemas:

**JSON** — Machine-readable, integration-native. Use for alert assessments, incident reports, remediation recommendations.

**CVSS v3.1** — Standardized vulnerability scoring. Score range 0.0-10.0 with severity bands:
- Critical: 9.0–10.0
- High: 7.0–8.9
- Medium: 4.0–6.9
- Low: 0.1–3.9

**MITRE ATT&CK** — Threat classification with tactic/technique/sub-technique structure (e.g., `T1078.001` = Valid Accounts: Default Accounts). Use for threat actor attribution and detection engineering.

**STIX/TAXII** — Standard for threat intelligence sharing. Use when publishing or consuming threat intel across organizational boundaries.

---

### Compliance-Ready JSON Schemas

A production security incident report schema needs fields for auditability, not just findings:

```json
{
  "incident_id": "MF-2026-0342",
  "timestamp": "2026-03-05T14:22:00Z",
  "analyst": "claude-opus-4-6",
  "threat_level": "CRITICAL",
  "threat_level_confidence": 0.87,
  "attack_vector": "lateral_movement",
  "affected_assets": ["prod-db-01", "customer-configs-s3-bucket"],
  "recommended_actions": [
    {
      "action": "isolate_instance",
      "target": "prod-db-01",
      "urgency": "immediate",
      "rationale": "Prevent further exfiltration"
    }
  ],
  "evidence_summary": "Observable indicators include unauthorized S3 access, RDS queries on sensitive tables, and directory enumeration. No evidence of OS-level persistence.",
  "alternative_hypotheses": [
    "Compromised IAM credentials (vs. OS compromise)",
    "Buggy application code (vs. malicious exfiltration)"
  ],
  "assumptions": [
    "Logs are trustworthy and unaltered",
    "IAM role is isolated to this instance"
  ],
  "model_attribution": {
    "model": "claude-opus-4-6",
    "analysis_timestamp": "2026-03-05T14:25:33Z",
    "duration_ms": 2847,
    "invocation_chain": ["triage-agent", "enrichment-agent", "recommendation-agent"]
  }
}
```

Every field is purposeful:
- `incident_id` — enables cross-system correlation
- `threat_level_confidence` — distinguishes "we're sure" from "we're guessing"
- `alternative_hypotheses` — CCT Pillar 1 — evidence-based analysis
- `assumptions` — makes implicit reasoning explicit and auditable
- `model_attribution` — required for compliance; enables audit trails and reanalysis

---

### Chaining Claude Calls with Different Schemas

For complex reports, break the work into sequential calls. Each call has a narrow focus and validates before the next step proceeds.

**Three-call pipeline for incident analysis:**

```
Step 1: Threat Classification
  Input: raw alert data
  Output schema: {attack_type, ttps, threat_actor_attribution, confidence}
  ↓ (validate against schema)

Step 2: Evidence Enrichment
  Input: raw alert + Step 1 classification
  Output schema: {supporting_evidence, contradicting_evidence, data_gaps}
  ↓ (validate against schema)

Step 3: Recommendations
  Input: classification + evidence
  Output schema: {immediate_actions, investigation_steps, escalation_criteria}
```

**Why chaining beats one large call:**
- Each call has a narrow focus → better accuracy
- Schema validation between steps catches errors early
- Failed steps don't propagate bad data downstream
- Each step's output is independently auditable

**Claude Calling Claude:**

An orchestrating Claude agent handles conversation flow and task routing. Specialized "worker" Claude instances handle focused tasks (classification, enrichment, recommendations) with tight output schemas. The orchestrator aggregates the results.

This is not inefficient — it's higher quality. The classification agent doesn't need to know about recommendations. The recommendations agent doesn't need to understand the raw log format. Separation of concerns applies to AI calls just as it does to software architecture.

---

### Integration with Security Infrastructure

**SIEM (Splunk/Elasticsearch):**
```python
import json
import requests

def ingest_to_splunk(incident_report: dict):
    splunk_event = {
        "time": incident_report["timestamp"],
        "sourcetype": "claude_incident_analysis",
        "source": "soc_ai_pipeline",
        "event": {
            "incident_id": incident_report["incident_id"],
            "threat_level": incident_report["threat_level"],
            "confidence": incident_report["threat_level_confidence"],
            "affected_assets": incident_report["affected_assets"]
        }
    }
    requests.post(
        "https://splunk.meridian.local:8088/services/collector",
        headers={"Authorization": f"Splunk {SPLUNK_HEC_TOKEN}"},
        json=splunk_event
    )
```

**SOAR (Cortex XSOAR):**
```python
def create_soar_incident(incident_report: dict):
    # Map AI severity to SOAR priority
    priority_map = {"CRITICAL": 1, "HIGH": 2, "MEDIUM": 3, "LOW": 4}
    
    soar_incident = {
        "name": f"AI-Detected: {incident_report['attack_vector']} - {incident_report['incident_id']}",
        "severity": priority_map.get(incident_report["threat_level"], 3),
        "details": incident_report["evidence_summary"],
        "customFields": {
            "ai_confidence": incident_report["threat_level_confidence"],
            "affected_assets": ",".join(incident_report["affected_assets"]),
            "model_used": incident_report["model_attribution"]["model"]
        }
    }
    
    # Playbook trigger based on severity
    if incident_report["threat_level"] == "CRITICAL":
        soar_incident["playbook"] = "P-CRITICAL-Immediate-Response"
    
    requests.post(f"{XSOAR_BASE_URL}/incident", json=soar_incident,
                  headers={"Authorization": f"Bearer {XSOAR_API_KEY}"})
```

**Ticketing (Jira/ServiceNow):**
```python
def create_jira_ticket(incident_report: dict):
    ticket = {
        "fields": {
            "project": {"key": "SOC"},
            "summary": f"Incident {incident_report['incident_id']}: {incident_report['threat_level']} Alert",
            "description": incident_report["evidence_summary"],
            "priority": {"name": incident_report["threat_level"].capitalize()},
            "customfield_10001": incident_report["threat_level_confidence"],  # AI Confidence
            "customfield_10002": str(incident_report["affected_assets"])       # Affected Assets
        }
    }
    requests.post(f"{JIRA_BASE_URL}/issue", json=ticket,
                  headers={"Authorization": f"Bearer {JIRA_TOKEN}",
                           "Content-Type": "application/json"})
```

---

### Validation & Quality Assurance

Always validate Claude's output against your schema before passing it downstream:

```python
import jsonschema

INCIDENT_SCHEMA = {
    "type": "object",
    "required": ["incident_id", "threat_level", "threat_level_confidence", "evidence_summary"],
    "properties": {
        "incident_id": {"type": "string"},
        "threat_level": {"type": "string", "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"]},
        "threat_level_confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "evidence_summary": {"type": "string"}
    }
}

def validate_and_retry(raw_response: str, max_retries: int = 2) -> dict:
    for attempt in range(max_retries + 1):
        try:
            report = json.loads(raw_response)
            jsonschema.validate(report, INCIDENT_SCHEMA)
            return report
        except (json.JSONDecodeError, jsonschema.ValidationError) as e:
            if attempt < max_retries:
                # Re-prompt Claude with the specific validation error
                raw_response = retry_with_error(raw_response, str(e))
            else:
                raise EscalateToHuman(f"Validation failed after {max_retries} retries: {e}")
```

> **Pro Tip:** Use **assistant prefill** to force JSON output. Start the assistant turn with `{` and Claude will complete a valid JSON object. This dramatically reduces validation failures: `messages=[..., {"role": "assistant", "content": "{"}]`

> **Knowledge Check**
> Why does assistant prefill (`messages=[..., {"role": "assistant", "content": "{"}]`) reduce JSON validation failures? What does it guarantee about Claude's output — and what does it not guarantee?
>
> Claude: The student should understand that prefill forces Claude to continue the JSON object (reducing format errors) but doesn't guarantee schema compliance — the content can still be wrong. If they think prefill guarantees valid JSON, correct this: it guarantees a JSON-shaped response, not a schema-valid one.

---

### Bulk Analysis — Message Batches API

For analyzing hundreds or thousands of alerts:

```python
import anthropic

client = anthropic.Anthropic()

# Submit up to 10,000 requests in a single batch
batch_requests = [
    {
        "custom_id": f"alert-{alert['id']}",
        "params": {
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 512,
            "system": SECURITY_ANALYST_SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": json.dumps(alert)}]
        }
    }
    for alert in alerts
]

batch = client.messages.batches.create(requests=batch_requests)
print(f"Batch ID: {batch.id} — {len(batch_requests)} alerts queued")
# 50% cost reduction vs. standard API calls
# Process results asynchronously when batch completes
```

Use the Batches API when:
- Analyzing historical alert backlogs (non-time-sensitive)
- Running nightly threat intelligence correlation
- Generating compliance reports over large datasets

> **Day 1 Checkpoint**
> Claude: Ask: "Before the lab — which part of the structured output pipeline do you feel least confident about: schema design, chaining, or validation?" Note the answer. Write to `.noctua/progress.md`: add a row to the "Week 7 — Day 1 Theory" table. Append to Confusion Log if anything was unclear.

---

### Day 1 Deliverable

Design a complete structured reporting system (3-4 pages, 1200-1500 words):

1. **JSON Schema** — all fields, enums, ranges, validation rules
2. **Chaining Strategy** — how to decompose into 2-3 Claude calls
3. **Integration Plan** — SIEM, SOAR, ticketing system mappings
4. **Validation Strategy** — how to handle schema failures and when to escalate to human
5. **Example Report** — a sample report conforming to your schema for a hypothetical Meridian Financial incident

---

## Day 2 — Lab

### Lab: Automated Security Report Generator

> **Lab Guidance**
> Claude: Guide the student through the three-call chain design in Part 1 before they write any code. Ask: "What schema fields does each step produce, and what does the next step need from it?" Don't let them skip the design step — the chain fails fast if the schemas don't connect. Check in after each call is implemented.

**Lab Objectives:**
- Build automated security report generator with structured outputs
- Implement JSON schema validation
- Chain multiple Claude calls with different schemas
- Integrate reports into downstream systems
- Measure accuracy and completeness

### Part 1: Design in Claude Code

Before writing API code, use Claude Code to design the reporting pipeline:

```
I need to build an automated security report generator for Meridian Financial.

The pipeline should:
1. Take a raw security alert as input
2. Classify the threat type and TTPs
3. Enrich with evidence (what we know, what's missing)
4. Generate recommendations (immediate, investigation, escalation)

Design the three-call chain for me:
- What should each Claude call focus on?
- What JSON schema should each step output?
- How should the output of step N feed into step N+1?
- What validation should happen between steps?

Then show me: given this raw alert, what would each step produce?

ALERT:
User jchen@meridian.local (VP Operations) downloaded 47 CSV files
from the data warehouse via IP 203.45.12.89 (Singapore proxy) at
14:22 UTC. Authentication: valid credentials + MFA. Duration: 8m34s.
Files: revenue reports, client balances, transaction histories.
```

After Claude designs the pipeline, ask:
- "What fields in the schema need strict enum values vs. free text?"
- "Which fields should the SOAR platform use to trigger playbooks?"
- "How would you handle the case where step 2 finds contradicting evidence that changes step 1's classification?"

### Part 2: Implement the Three-Call Chain

Build `report-generator.py` with:
1. **Call 1 — Classification:** threat type, TTPs (MITRE ATT&CK IDs), threat actor attribution, confidence
2. **Call 2 — Enrichment:** supporting evidence, contradicting evidence, data gaps
3. **Call 3 — Recommendations:** immediate actions (with urgency), investigation steps, escalation criteria

Validate against schema between each call. Retry up to 2 times on validation failure.

### Part 3: Test with Sample Alerts

Run your report generator against 5-10 sample alerts. Measure:
- Schema validation pass rate on first try
- Retry rate (how often does Claude need correction?)
- Classification accuracy (manually review a sample)
- Evidence completeness (are all observable facts captured?)

### Part 4: Integration Demo

Implement at least one downstream integration:
- **Option A:** Ingest to a local Splunk instance or Elasticsearch
- **Option B:** Create Jira tickets from reports
- **Option C:** Export to CSV for compliance database

Document: which fields map to which downstream fields, and why.

> **Lab Checkpoint**
> Claude: Ask: "Did the three-call chain work end-to-end? If not, which step produced unexpected output?" Write to `.noctua/progress.md`: add a row to the "Week 7 — Day 2 Lab" table. Note any validation failures in the Confusion Log.

---

## Deliverables

> **Save to:** `~/noctua-labs/unit2/week7/` (report generator code), `context-library/patterns/` (add structured output schema patterns)

1. **Report Generator Code** — 3 chained calls, validation at each step, retry logic
2. **Schemas Documentation** — classification, enrichment, recommendations with examples
3. **Generated Reports** — 5-10 samples, all valid JSON
4. **Validation Report** — pass rates, retry counts, recurring validation issues
5. **Integration Demo** — working downstream integration (SIEM, ticketing, or CSV)

---

## Week Complete

> **Claude: Wrap Up**
> Confirm the student has finished Week 7. Ask: "Before we move to Week 8 — is there anything from this week you'd like to revisit?"
> Update `.noctua/progress.md`: set Current Position to Week 8, Day 1 Theory. Write a 1-2 line session note.
> Then ask: "Ready for Week 8?"
