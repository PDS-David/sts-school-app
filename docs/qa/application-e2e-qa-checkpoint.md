# Application End-to-End QA Checkpoint

- Task ID: APP-E2E-QA-001
- Status: BLOCKED — repository inspection started; acceptance journeys NOT RUN
- Repository: PDS-David/sts-school-app
- Target branch: master
- QA branch: agent/application-e2e-qa-20261113
- Baseline master HEAD observed: 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- Checkpoint date: 2026-11-13
- Commit SHA: populated by this checkpoint commit; see branch history
- Test result: No end-to-end, unit, integration, device, or database test has been executed in this session.

## Scope and acceptance matrix

No journey is marked PASS without execution. Each row remains NOT RUN.

| ID | Journey | Status | Evidence required |
|---|---|---|---|
| E2E-01 | Student registration, activation and login | NOT RUN | Registration response, activation flow, persisted account state, successful authenticated student session |
| E2E-02 | Parent login and child access | NOT RUN | Parent authentication, linked-child list, child-scoped data and cross-child denial |
| E2E-03 | Teacher login and class management | NOT RUN | Teacher authentication, assigned class/subject scope, allowed management actions and out-of-scope denial |
| E2E-04 | Administrator and school-management workflows | NOT RUN | School-admin/platform-admin role matrix, school-scoped CRUD, audit trail and forbidden cross-school access |
| E2E-05 | Attendance and score entry | NOT RUN | Attendance create/update/read, score validation, duplicate handling and class/subject scope |
| E2E-06 | Report cards | NOT RUN | Correct student/term report, component totals, access scope, retry/error states and print/export |
| E2E-07 | Learning materials and assessments | NOT RUN | Published material visibility, assessment metadata/question access, withdrawal and role scope |
| E2E-08 | Assessment submission and marking | NOT RUN | Student submission, duplicate/idempotency behavior, teacher marking, grading status and unauthorized marking denial |
| E2E-09 | Messaging and notifications | NOT RUN | Contact discovery, send/receive, recipient isolation, notification persistence and delivery/read state |
| E2E-10 | Offline synchronization | NOT RUN | Queue persistence, reconnect replay, retry after mid-replay disconnect, duplicate prevention and conflict handling |
| E2E-11 | Finance and invoices | NOT RUN | Fee/invoice visibility, parent read-only boundary, authorized finance writes, payment-state consistency |
| E2E-12 | Permissions and data isolation | NOT RUN | Role × school × class × student matrix; negative cross-tenant and IDOR tests across all relevant endpoints |

## Repository inspection

- Confirmed repository exists, is public, writable by the connected GitHub identity, and defaults to master.
- Recent master HEAD at inspection: 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26 (merge of PR #681).
- Prior PR #350 is merged, but its report is an SS1 curriculum/static audit dated 2026-11-07. It is not evidence for these application journeys.
- Existing root scripts include only a focused SS1 English package test and package validation. Backend scripts expose selected SS1 and Primary 4 suites. Mobile package scripts expose Expo start/platform commands and no test or typecheck script.
- Open implementation PRs observed include #692 (auth claims), #696 (offline replay/session restore), #697 (report retry), #695 (finance feedback), #690 (messaging recipient journey), #694 (announcements UI), #686 (school calendar/parent upcoming tests), and #688 (teacher analytics). Their descriptions explicitly state that several automated, database, or device checks were not run. These PRs are not treated as verified.
- Existing branch list includes multiple active implementation branches. This QA work is isolated on its own branch and does not modify implementation-owned files.

## Defect and blocker register

### QA-ENV-001 — Acceptance execution environment unavailable
- Severity: BLOCKER (QA execution blocker; not classified as an application defect)
- Reproduction: Attempt to run repository commands, install dependencies, start services, run test suites, or launch a device from the available GitHub connector session.
- Expected: A checkout with Node/npm, dependency installation, test command execution, service/database configuration, and (for mobile journeys) emulator/device access.
- Actual: The available repository integration supports GitHub repository/branch/file/PR operations but exposes no shell, package runner, workflow-dispatch action, live application environment, or device control. Consequently no test was executed.
- Impact: All 12 acceptance journeys remain NOT RUN. No application failure is inferred from this tooling limitation.
- Required resolution: Provide an execution-capable checkout/CI runner with approved non-production test credentials, database and service configuration, and Android emulator/device access for mobile-only checks.

## Current implementation evidence to re-check during execution

The open PR descriptions identify work that must be independently exercised after merge or against the corresponding PR branch:
- Authentication claims freshness and authorization scope: PR #692.
- Offline outbox replay and cold-start session recovery: PR #696.
- Report-card retry behavior: PR #697.
- Finance loading, payment feedback and fee validation: PR #695.
- Messaging recipient picker and send journey: PR #690.
- Teacher analytics/marking scope: PR #688.
- School calendar and parent upcoming assessments: PR #686.
- Student/parent announcement feed and admin announcement management: PRs #685 and #694.

These are candidate test targets, not confirmed defects or passing implementations.

## Changed files

- docs/qa/application-e2e-qa-checkpoint.md

## Verification performed

- Repository metadata, branch inventory, recent commits, open PR descriptions, and package manifests inspected through GitHub.
- Dedicated branch created from master.
- No test command was run; no test pass is claimed.
- No production data, database, secrets, deployment, or application runtime was accessed.

## Remaining work

1. Obtain an execution-capable checkout or CI runner and test environment.
2. Inventory all existing automated tests and CI workflows from the complete checkout.
3. Run existing automated tests and preserve full logs/results.
4. Implement missing regression tests for the 12 journeys, including negative authorization/data-isolation cases.
5. Execute each journey end-to-end; record exact environment, commands, test data, result, and evidence.
6. For every reproduced failure, create a defect with severity, preconditions, exact steps, expected result, actual result, logs/request IDs, and owner.
7. Fix straightforward QA-owned test defects; route implementation defects to their active worker/PR without overwriting their files.
8. Re-run affected tests and full relevant suites; open focused PRs and update this checkpoint with commit SHAs and evidence.

## Exact next action

Run the suite from a full repository checkout with a configured non-production backend/database and mobile test environment. Start by inventorying test and workflow files, then execute the existing backend and package test scripts before adding the E2E harness. Do not mark any journey passed until the real journey has executed.


---

## Render-connected QA pass — 2026-11-17

### Infrastructure access and inspection
- Confirmed the only available Render workspace: `My Workspace` (`tea-d7au7aadbo4c73arnk40`).
- Connected Postgres: `sts-school-db-2`, PostgreSQL 18, Frankfurt, free plan, available; created 2026-11-12 and expires 2026-12-12.
- Two backend web services point to the same repository and `master`, both in Frankfurt:
  - `sts-school-app` (`srv-dbqmsa142hec73foh6i0`)
  - `sts-school-backend` (`srv-d9bl507aqgkc739ji4i0`)
- No Render Key Value instances exist in the workspace.
- Read-only database inspection found the `public` schema and 40 application tables. Approximate live-row counts from `pg_stat_user_tables`: 1 user, 0 students, 18 classes, 12 subjects, 6 terms, 1,408 topics; 0 attendance, scores, invoices, messages, submissions and materials. Counts are approximate statistics, not exact counts.
- No production data or schema was modified.

### Confirmed defect QA-RENDER-001 — backend startup blocked by missing Redis
- Severity: P1.
- Both Render services repeatedly failed to start on 2026-11-16. Their build stages succeeded, but deployment events ended `update_failed` with `nonZeroExit: 1`.
- Runtime logs explicitly report missing `RATE_LIMIT_REDIS_URL` / `REDIS_URL`. Source inspection confirms `backend/src/index.ts` calls `assertRateLimitRedisConfigured()` before starting Express, and `backend/src/utils/redisRateLimitStore.ts` deliberately refuses production startup without shared Redis.
- Latest deployment at inspection (commit `4377def33080a198d4e93ce50abd04ddbc5010ac`, 2026-11-17 00:17 UTC) was still `update_in_progress`; terminal result must be checked before reporting its outcome.
- Defect record: https://github.com/PDS-David/sts-school-app/issues/951
- No bypass was made. Process-local rate limiting is explicitly rejected by the implementation.
- Render's Free Key Value plan is 25 MB and in-memory only; data is lost on restarts and Render says free instances are not for production. Paid 256 MB plan is listed at $10/month. No paid resource was created and no billing change was made without explicit cost approval.

### Confirmed defect QA-RENDER-002 — database schema is behind deployed route requirements; migration adoption blocked
- Severity: P1 for calendar route availability; schema adoption is owner-gated.
- Read-only SQL confirmed `public.app_bootstrap` exists, while `public.schema_migrations` and `public.school_events` do not.
- Current `backend/src/routes/schoolEvents.ts` queries and writes `school_events`; current `backend/schema.sql` and migration `0002_school_events.sql` define it. Therefore authenticated calendar route operations will fail against this database until the missing relation is safely applied.
- `backend/src/db/migrate.ts` intentionally refuses to baseline an existing schema without a recorded migration ledger. `backend/migrations/README.md` requires OPS-05 schema-drift evidence and owner approval; `--fresh` is only for clean installations. No migration or baseline write was attempted.
- Defect record: https://github.com/PDS-David/sts-school-app/issues/952

### QA execution limits after Render access
- Render Postgres query capability is read-only. It cannot create isolated test fixtures or execute migrations.
- No staging database/service exists in the workspace; the connected database contains live school records and was treated as production. No test users or school data were inserted.
- The Render connector exposes resource inspection, read-only SQL, logs, events, deploys and metrics, but no shell, test runner, HTTP client, or device/emulator. Public endpoint inspection through the available web fetch was also inaccessible.
- Thus no student, parent, teacher, administrator, attendance, report-card, materials, assessment, messaging, offline-sync or finance journey was executed. All 12 remain NOT RUN.
- No production test writes, migrations, deploy triggers, service configuration updates, or infrastructure creation were performed.

### Updated remaining work / exact next action
1. Owner authorizes a persistent paid Render Key Value plan (published entry plan $10/month) or provides an existing production-grade Redis-compatible endpoint. Then configure `RATE_LIMIT_REDIS_URL` on the canonical API service; resolve whether the duplicate backend service is intentionally retained before configuring it.
2. Re-check both deployments triggered at 2026-11-17 00:17 UTC and verify terminal state and health only after Redis is configured.
3. Perform OPS-05 read-only schema drift review and obtain owner approval for baseline adoption; then apply the reviewed migration path, including `0002_school_events.sql`.
4. Provide an isolated staging database and service with test-only credentials and an execution-capable runner (CI or checkout) plus Android emulator/device access.
5. Run existing automated suites, add missing E2E regression coverage and execute all 12 journeys. Record evidence and create/route defects without using production data.
