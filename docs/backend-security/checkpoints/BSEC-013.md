# Checkpoint — BSEC-013

- **Task ID:** BSEC-013
- **Title:** Enforce mandatory per-account AI rate limits when optional Redis is absent or unavailable
- **Status:** focused verification passed; repository-wide CI pending; PR review pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Working branch:** agent/backend-ai-rate-limit-fail-closed-20261113
- **Latest branch commit:** 8a5f36fc45741861f07c6387eda3fd31fe916d84
- **Changed files:**
  - backend/src/routes/ai.ts
  - tests/backend-ai-rate-limit.integration.test.mts
  - .github/workflows/backend-ai-rate-limit.yml
  - this checkpoint
- **Defect:** the shared AI generate() limiter uses optional Redis and deliberately fails open when REDIS_URL is absent, ioredis is missing, or Redis commands fail. In that common configuration, every authenticated non-admin role could repeatedly invoke paid Gemini/shared-agent requests without a mandatory request ceiling.
- **Implementation:** add express-rate-limit middleware to the AI router after authentication. It enforces 20 requests per account per 60-second window using the built-in in-memory store, independent of Redis availability. It applies to every AI route, preserves the existing admin diagnostic bypass, and leaves the optional Redis limiter as an additional distributed layer when configured. Bound chat messages/history, explain/notes topics, generated-question topics and admin ping prompts before paid provider calls; validate hint IDs.
- **Regression coverage:** a PostgreSQL-backed HTTP integration test sends 21 invalid chat requests for one user and verifies the 21st is 429; a second user behind the same IP retains a separate quota; an administrator retains the existing bypass; oversized chat/history/explain inputs return 400 before provider invocation. Invalid/oversized payloads ensure no external AI provider is called.
- **Verification:** GitHub Actions run 43455647046 passed: locked dependency installation, PostgreSQL 16 bootstrap, per-account 20/minute rate-limit HTTP regression, second-user quota isolation, admin bypass, oversized-prompt rejection, and backend TypeScript typecheck. JSS3 and SS1 repository-wide gates are still pending. No external AI provider was called and no production usage or secrets were accessed.
- **Remaining:** run rate-limit HTTP integration test and backend TypeScript typecheck; fix genuine failures; open focused PR; verify required checks.
- **Exact next action:** inspect branch head and CI run for Backend AI per-account rate limiting.