# Verification & Validation (V&V) Documentation Template

Use this template for every system you build in this course. The capstone requires a completed V&V document covering all four dimensions. Fill in each section with evidence — not assertions.

---

## System Identification

**System name:**
**Version:**
**Date:**
**Author:**
**AIUC-1 domains addressed:**

---

## Dimension 1: Output Verification

*Does the system produce correct outputs? Verified against ground truth, not just "it looks right."*

### What was tested

| Test case | Input | Expected output | Actual output | Pass/Fail |
|---|---|---|---|---|
| | | | | |

### Test methodology
- [ ] Unit tests (deterministic components)
- [ ] Confusion matrix (classifiers)
- [ ] Human expert review (reasoning outputs)
- [ ] Cross-reference (multi-source validation)

### Evidence
*(Link to test results, test files, or evaluation output)*

### Known limitations
*(What scenarios were NOT tested? Why? What is the residual risk?)*

---

## Dimension 2: Calibrated Trust

*Do you know when to trust the system's output and when not to? Uncertainty is quantified.*

### Confidence signals
How does the system signal confidence vs. uncertainty in its outputs?

| Output type | Confidence signal | How it was validated |
|---|---|---|
| | | |

### False positive / false negative analysis

| Scenario | Observed rate | Acceptable threshold | Status |
|---|---|---|---|
| False positives (system flags something benign) | | | |
| False negatives (system misses something real) | | | |

### Human review triggers
Under what conditions should a human review the output before action is taken?

- [ ] Confidence below ____%
- [ ] Output involves ____________ (list high-stakes categories)
- [ ] Input came from ____________ (untrusted source types)
- [ ] System flags its own uncertainty

---

## Dimension 3: Failure Imagination

*What happens when the system fails? Failure modes are documented before they occur.*

### Failure mode analysis

| Failure mode | Likelihood (1–5) | Impact (1–5) | Risk score | Mitigation |
|---|---|---|---|---|
| Model returns hallucinated output | | | | |
| Tool call fails or times out | | | | |
| Input contains prompt injection attempt | | | | |
| Dependency (API, DB) unavailable | | | | |
| Cost cap exceeded | | | | |
| *(add system-specific modes)* | | | | |

### Graceful degradation behavior
What does the system do when a component fails? *(describe, don't just say "error handling")*

### Recovery procedure
*(How is the system restored to normal operation? Who is responsible?)*

---

## Dimension 4: Adversarial Assumption

*Assume an intelligent adversary is trying to make the system fail or be weaponized. What do they exploit?*

### OWASP top risks for this system

| OWASP Risk | Applicable? | Test performed | Finding | Mitigation |
|---|---|---|---|---|
| LLM01: Prompt Injection | | | | |
| LLM02: Insecure Output Handling | | | | |
| LLM06: Sensitive Information Disclosure | | | | |
| LLM07: Insecure Plugin Design | | | | |
| LLM08: Excessive Agency | | | | |
| NHI5: Overprivileged NHI | | | | |

### AIVSS scores for identified vulnerabilities

| Vulnerability | AIVSS Score | Severity | Remediation status |
|---|---|---|---|
| | | | |

### Red team findings
*(Document any adversarial tests performed. If none, explain why and note the residual risk.)*

### MITRE ATLAS coverage

| Tactic | Most relevant technique | Coverage status |
|---|---|---|
| Initial Access | | Mitigated / Monitored / Unaddressed |
| Privilege Escalation | | |
| Persistence | | |
| Exfiltration | | |

---

## V&V Summary

| Dimension | Status | Confidence | Outstanding issues |
|---|---|---|---|
| Output Verification | Complete / Partial / Not started | High / Medium / Low | |
| Calibrated Trust | Complete / Partial / Not started | High / Medium / Low | |
| Failure Imagination | Complete / Partial / Not started | High / Medium / Low | |
| Adversarial Assumption | Complete / Partial / Not started | High / Medium / Low | |

**Overall V&V confidence:** High / Medium / Low

**Recommendation:** Ready for production / Needs remediation / Not ready — explain:

---

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | | | Initial |
