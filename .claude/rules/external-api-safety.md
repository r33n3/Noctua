---
paths:
  - "**/mcp/**"
  - "**/servers/**"
  - "**/tools/**"
  - "**/integrations/**"
---

# External API Safety Rules

When calling external APIs, verify:
- Connection pooling (not new connection per request)
- Retry with exponential backoff + jitter + cap
- Circuit breaker for dependency failure
- Timeout on every request (never wait forever)
- isError pattern on failure responses
- Structured error categorization (transient/validation/permission)

Reference: AI-CODE-ANTIPATTERNS.md patterns 1.1, 1.3, 2.1, 2.5, 2.6
