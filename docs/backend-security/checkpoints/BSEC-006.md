# Checkpoint — BSEC-006

- **Task ID:** BSEC-006
- **Title:** Stop the API safely after uncaught exceptions and unhandled rejections
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- **Working branch:** agent/backend-fatal-shutdown-20261113
- **Last commit:** pending
- **Files planned:** backend/src/index.ts; backend/src/utils/backup.ts (scheduler stop handle); new fatal-process shutdown helper; child-process regression tests; focused workflow; this checkpoint.
- **Defect:** index.ts registers unhandledRejection and uncaughtException handlers that only log and keep the server running. This suppresses Node's default fatal behavior and allows the process to continue after an unhandled rejection or uncaught exception, when application state may be inconsistent.
- **Scope boundary:** no active PR changes backend/src/index.ts, backend/src/utils/backup.ts or the new helper. Open PRs #692-#705 change other routes, middleware, helpers and tests. Do not touch those paths.
- **Acceptance criteria:**
  1. Unhandled rejections and uncaught exceptions trigger one idempotent fatal-shutdown path.
  2. Stop accepting new requests, close active HTTP connections after a bounded grace period, stop the backup scheduler and close the database pool.
  3. Process exits non-zero after cleanup; it must not resume normal service.
  4. Child-process regression tests prove both fatal event types terminate the process with exit code 1.
  5. Backend typecheck and tests pass; no production process or data changed.
- **Verification:** index.ts inspection confirms both process handlers only log and keep the server running. Node process safety guidance requires termination after uncaught exceptions rather than continuing. No production data accessed or changed.
- **Remaining:** implement idempotent graceful fatal shutdown, scheduler stop function, child-process tests and CI; open PR and verify.
- **Exact next action:** inspect the backup scheduler lifecycle, then add a stop callback and a shared fatal shutdown helper.
