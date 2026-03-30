---
paths:
  - "**/webhook*"
  - "**/handler*"
  - "**/endpoint*"
  - "**/routes/**"
---

# Handler Safety Rules

When building request/webhook handlers, verify:
- Idempotency check (what happens if this fires twice?)
- Input bounds (length, size limits on all parameters)
- Structured logging with trace_id
- Audit record for every action taken
- No SQL injection (parameterized queries only)

Reference: AI-CODE-ANTIPATTERNS.md patterns 2.2, 4.2, 4.3, 4.5
