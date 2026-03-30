---
paths:
  - "**/*async*"
  - "**/*concurrent*"
  - "**/*parallel*"
  - "**/*worker*"
---

# Async Safety Rules

When working with async code, check for:
- Shared mutable state accessed by multiple coroutines (use asyncio.Lock)
- Race conditions in read-modify-write sequences
- Unbounded task creation (use semaphores or task groups with limits)
- Missing await on coroutines (especially in error paths)

Reference: AI-CODE-ANTIPATTERNS.md patterns 1.2, 2.3, 2.4
