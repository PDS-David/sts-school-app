# Integration and production-release readiness checkpoint

**Task ID:** INT-RELEASE-001  
**Status:** IN PROGRESS — production release blocked  
**Repository:** PDS-David/sts-school-app  
**Target:** master  
**Inspection base:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26  
**Checkpoint branch:** agent/integration-release-readiness-20261113  
**Updated:** 2026-11-13

## Verified repository state

- Repository is public; connected GitHub identity has admin/maintain/push/pull permissions.
- Default branch is `master`; latest inspected commit is `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26` (merge of PR #681).
- No existing branch named `integration-release-readiness` was found. Numerous curriculum, backend, frontend, database, mobile and QA branches are active; do not rewrite or reuse them.
- 29 open PRs were listed at inspection time. Key dependencies and release-impacting PRs are listed below.
- The current `.github/workflows` directory contains subject/package validation, asset, audio and lockfile-sync workflows. It contains no general application CI workflow and no deployment/release workflow. No `render.yaml`, Dockerfile, or Procfile was found in the complete master tree.
- Recent Actions runs are dominated by PR checks. At inspection time several jobs were queued/pending; PR #683's STS Work Queue Health run #43450440354 failed at “Validate durable task registry”; subsequent steps were skipped. This is a real failing check, not a green gate.
- Master commit #681 had no combined status entries and the commit-workflow-runs endpoint returned no PR-triggered runs for that merge commit. This is not evidence that all master checks passed.
- The repository's production API origin is configured in `mobile/app.json` as `https://sts-school-backend.onrender.com`. No live HTTP health response was obtained in this inspection.
- The mobile EAS configuration defines development/preview APK and production Android App Bundle profiles, but no signed release build or device verification is evidenced on master.

## Open PR integration queue (observed)

| PR | Scope | Integration condition / current evidence |
|---|---|---|
| #708 | Versioned DB migration ledger | Open; mergeable metadata true. CI was queued/pending on head `bcdd9f6af8b085f2c93720ffd1f26b1066ac7104`. No live DB test. |
| #710 | School calendar/events; adds migration 0002 | Stacked on #708. Must merge after #708 and pass combined migration checks. Do not deploy until migration is applied to target DB under approved runbook. |
| #707 | Dependency security audit | Open diagnostic PR. Reports 40 locked-tree vulnerabilities (2 low, 16 moderate, 20 high, 2 critical); it is not a remediation and intentionally exposes the audit failure. |
| #696 | Android offline/session reliability | Draft; five tests committed but not executed per PR description; Android workflow #43450462430 was in progress at inspection. |
| #711 | Independent E2E checkpoint | Draft; all 12 journeys recorded NOT RUN; requires execution-capable test environment/device. |
| #683 | Work orchestrator v1 | Draft; workflow run #43450440354 failed validation of durable task registry; do not merge until fixed and rerun. |
| #712 | Assessment recovery | Open; static inspection only, no tests/typecheck/device evidence claimed. |
| #685, #694, #688, #691, #690, #692, #695, #697, #698, #700, #701, #702, #703, #704, #705, #706 | Product/backend/frontend reliability and features | Open; individually inspect changed paths, dependencies and required checks before merge. Do not merge by PR age or title. |

## Production, database and backup evidence

- `docs/app/REBUILD_DATABASE.md` explicitly records that the previous Render Free Postgres database expired on **2026-10-04** and was deleted. It describes recreating `sts-school-db` on Render Free, which expires 30 days after creation, with a 14-day grace period and deletion after day 44.
- The same runbook gives an example creation date of 2026-11-12 and an upgrade-by date of 2026-12-07. This is an example schedule, **not evidence** that a new database was actually created on that date or that a paid upgrade has occurred. Current Render instance, creation date, plan, database availability and backup status are unverified because no Render account/credential access is available here.
- The runbook says Free Postgres has no provider backups; a weekly external `pg_dump` plus restore rehearsal is required until a paid plan with automatic backups is verified. No current backup artifact, checksum, or restore rehearsal evidence was found in the inspected records.
- `docs/app/remaining-20261030/ops/OPS-05-drift-backup.md` is explicitly BLOCKED pending owner credentials/approval and says not to run production drift/backup operations. It requires a disposable restore rehearsal. No production drift result or restore rehearsal is evidenced.
- `docs/app/remaining-20261030/evidence/OPS-02.md` records TLS validation as IMPLEMENTED_TESTING_DEFERRED and explicitly says Render certificate validation was not tested.
- PR #708 is not merged; therefore master still uses the pre-ledger migration state. PR #710 depends on #708. Neither production migration nor migration adoption has been authorised/evidenced.
- No production write, migration, deployment, provider login or secret access was performed.

## Release blockers

1. Confirm current Render database exists, is accessible, is on a non-expiring paid plan, and has automatic backups enabled; obtain owner-authorised evidence without disclosing credentials.
2. Obtain a current off-provider backup, checksum and successful restore rehearsal on a disposable database; capture OPS-05 evidence privately.
3. Run the approved read-only production drift assessment and reconcile any drift; no migration until owner-approved.
4. Merge #708 only after all required checks pass; then rebase/validate #710 against the merged migration base and merge only after its complete checks pass.
5. Resolve #707's actual dependency vulnerabilities (do not merge the diagnostic workflow as if it were a fix); rerun audit and application builds.
6. Repair #683's failing durable queue validator before merge.
7. Collect required CI results for the backend/frontend reliability PRs and run independent end-to-end journeys with synthetic accounts.
8. Establish actual deployment ownership/configuration and a controlled deployment/rollback procedure. No deployment workflow or Render config is present in master.
9. Verify live API health, database connectivity and service version using an authorised non-secret health/status endpoint; current health is UNKNOWN.
10. Complete Android TypeScript/build, signed EAS production AAB, install/upgrade and physical-device role/offline/push tests. Current evidence is configuration only, not release acceptance.

## Integration policy

- Do not merge any PR while checks are queued, pending, failing, or required results are absent.
- Preserve each active worker's branch. Integrate one coherent PR at a time, respecting explicit stack dependencies (#708 before #710).
- Do not use auto-merge or bypass protection/checks. Do not deploy unapproved code or run migrations against production.
- Treat CI success as code verification only, not production deployment or operational health.
- Never commit secrets, database URLs, backup files, student data, provider screenshots or private logs.

## Task log

| Task | Status | Changed files | Commit SHA | Test/evidence |
|---|---|---|---|---|
| INT-RELEASE-001-A repository/branch/PR inventory | DONE | none | n/a | GitHub repo metadata, open PR search, branch search, master tree and recent commit inspection |
| INT-RELEASE-001-B workflow/deployment inventory | DONE (findings recorded) | none | n/a | .github/workflows tree; Actions run list; no deploy workflow/config found |
| INT-RELEASE-001-C database/backup history | DONE (current state unknown) | none | n/a | REBUILD_DATABASE.md, OPS-05 runbook, OPS-02 evidence and R7 release report |
| INT-RELEASE-001-D safe PR integration | BLOCKED | none | n/a | No complete green required-check evidence; explicit dependencies and failing #683 |
| INT-RELEASE-001-E live production health / Render state | BLOCKED | none | n/a | No Render connector/credentials or verified health response |
| INT-RELEASE-001-F Android release acceptance | BLOCKED | none | n/a | EAS profiles exist; no signed build/device evidence |

## Exact next action

Refresh the latest open PR list and Actions run/job results. Fetch current #708 head and required checks; wait for all required jobs to complete, inspect failures and logs, and merge #708 only if every required check passes and GitHub confirms it is mergeable. Then revalidate #710 against the merged master before considering it. In parallel, request owner-authorised Render/backup evidence; do not infer current database status from the historical expiry schedule.
