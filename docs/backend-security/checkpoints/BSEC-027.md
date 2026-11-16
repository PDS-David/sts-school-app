# Checkpoint — BSEC-027

- **Task ID:** BSEC-027
- **Title:** Introduce distributed Redis-backed rate limiting
- **Status:** reserved for the assigned task; implementation not yet started
- **Assignment:** replace process-local-only request quotas with a shared Redis-backed store so limits remain effective across multiple API instances.
- **Scope:** authentication/login attempts, AI request quotas, authenticated message sending, and other abuse-sensitive request limiters. Preserve each route's existing thresholds, key semantics, response headers and 429 payloads unless a security review justifies a change.
- **Constraints:** keep Redis credentials out of source control; handle Redis startup and outage behavior deliberately; do not silently claim distributed enforcement when the shared store is absent; retain deterministic tests using a disposable Redis service or a controlled store adapter.
- **Acceptance:** two independent app instances share the same quota; account-keyed limits remain keyed to authenticated identities; IP/account normalization behavior remains correct; Redis failure behavior is explicit and observable; focused integration tests and backend typecheck pass.
- **Next action:** inspect the existing optional Redis logic in `backend/src/utils/ai.ts`, current express-rate-limit configurations, package lock and environment configuration before selecting the shared-store implementation.
- **Related work:** earlier academic route tenant-isolation changes are preserved in BSEC-031-04.
- **Reclassification:** The previous checkpoint content described school-bound administrator academic term, subject and class authorization. It has been preserved as `BSEC-031-04.md` and merged through PR #918.
- **Replacement record:** docs/backend-security/checkpoints/BSEC-031-04.md
