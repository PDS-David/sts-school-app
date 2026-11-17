# Checkpoint — BSEC-024

- **Task ID:** BSEC-024
- **Title:** Validate direct-message inputs and rate-limit authenticated senders
- **Status:** merged; focused CI verification passed
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Implementation branch:** agent/backend-messaging-input-abuse-controls-20261116
- **PR:** https://github.com/PDS-David/sts-school-app/pull/897
- **Merge commit:** 50b61ed850d414951c9bf614d06b678a1985354e
- **Changed files:** backend/src/routes/messages.ts; tests/backend-messaging-input-abuse-controls.integration.test.mts; .github/workflows/backend-messaging-input-abuse-controls.yml; this checkpoint.
- **Defects:** direct-message creation accepted unbounded message text and unchecked recipient/context values; malformed conversation UUIDs reached PostgreSQL and could become HTTP 500 errors. The authenticated write endpoint had no sender-specific rate limit, allowing one account to flood another user's inbox and grow the messages table without a per-account throttle.
- **Implementation:** validate recipient UUID, trimmed body length (1–10,000 characters), context type length and scalar context ID; validate conversation participant UUID before querying; limit each authenticated sender to 30 send requests per 60-second window, keyed by authenticated user ID rather than client-supplied network headers. Invalid inputs are rejected before database writes.
- **Rate-limit note:** BSEC-027 replaced process-local stores with shared Redis-backed quotas for auth/IP, login-account, AI HTTP, AI generation and message-sender limits. Production requires RATE_LIMIT_REDIS_URL (or REDIS_URL); Redis outages fail closed with HTTP 503. Local/test environments may use MemoryStore only when Redis is not configured.
- **Regression coverage:** PostgreSQL HTTP test covers malformed recipient, empty and oversized bodies, malformed conversation IDs, numeric context ID normalization, 30-request acceptance and 31st-request HTTP 429, and confirms rejected requests are not persisted.
- **Verification:** workflow `43940770785` passed all steps: PostgreSQL 16 bootstrap, messaging input and abuse-control regressions, and backend TypeScript typecheck. SS1 package integrity `43940770704`, SS23 integrity `43940770808` and JSS3 implementation/asset checks `43940770674` also passed on implementation head `eb6bf158e6a186a1244359300f87f07cc969f73f`.
- **Production safety:** no production database or data was accessed or changed.
- **Remaining:** no BSEC-024 code work remains. Shared Redis rate limiting was completed under BSEC-027.
