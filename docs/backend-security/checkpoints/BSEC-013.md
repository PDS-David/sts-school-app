# Checkpoint — BSEC-013

- **Task ID:** BSEC-013
- **Title:** Enforce mandatory per-account AI rate limits when optional Redis is absent or unavailable
- **Status:** implementation committed; latest CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Working branch:** agent/backend-ai-rate-limit-fail-closed-20261113
- **Latest implementation commit:** fa2df1e6481d9c2502d1d658f0ab580316c6c780
- **Changed files:**
  - backend/src/routes/ai.ts
  - tests/backend-ai-rate-limit.integration.test.mts
  - .github/workflows/backend-ai-rate-limit.yml
  - this checkpoint
- **Defect:** the shared AI generate() limiter uses optional Redis and deliberately fails open when REDIS_URL is absent, ioredis is missing, or Redis commands fail. In that common configuration, every authenticated non-admin role could repeatedly invoke paid Gemini/shared-agent requests without a mandatory request ceiling.
- **Implementation:** add express-rate-limit middleware to the AI router after authentication. It enforces 20 requests per account per 60-second window using the built-in in-memory store, independent of Redis availability. It applies to every AI route, preserves the existing admin diagnostic bypass, and leaves the optional Redis limiter as an additional distributed layer when configured. Bound chat messages/history, explain/notes topics, generated-question topics and admin ping prompts before paid provider calls; validate hint IDs.
- **Regression coverage:** a PostgreSQL-backed HTTP integration test sends 21 invalid chat requests for one user and verifies the 21st is 429; a second user behind the same IP retains a separate quota; an administrator retains the existing bypass; oversized chat/history/explain inputs return 400 before provider invocation. Invalid/oversized payloads ensure no external AI provider is called.
- **Verification:** source/tests fetched back from GitHub and reviewed. Dedicated PostgreSQL 16 workflow added; CI pending. No external AI provider was called and no production usage or secrets were accessed.
- **Remaining:** run rate-limit HTTP integration test and backend TypeScript typecheck; fix genuine failures; open focused PR; verify required checks.
- **Exact next action:** inspect branch head and CI run for Backend AI per-account rate limiting.