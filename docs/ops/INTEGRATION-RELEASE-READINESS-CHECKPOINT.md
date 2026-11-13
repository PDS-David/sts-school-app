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


## Update — 2026-11-13 15:17 UTC

- Master advanced during this inspection to `6e98fa46c2ef400527c9615d5afff237a8b1f8fd` (merge of PR #682). The checkpoint branch initially fell 46 commits behind current master; it has been refreshed by a two-parent merge commit so the PR is based on the latest inspected master without dropping any master changes.
- PR #708 head is now `78b9434821593bac68bf7a422c1143657b0919d1`. Its latest integrity gate run #43450585649 passed backend/mobile TypeScript, hashes, JSON, package validators and related static checks. The JSS3/acceptance workflow for that head was still queued (#43450584916); earlier run #43449643758 on the prior head failed the static/focused regressions, so the current rerun must finish and be inspected before merge. Other workflow runs on the PR head were queued/in progress. Therefore #708 remains unmerged.
- PR #696 Android workflow #43450462430 ran offline replay regression tests and mobile TypeScript successfully, but Android JS bundle export was cancelled; the build artifact step was skipped. No signed AAB or device result exists.
- PR #714 has a new integrity workflow run queued (#43450732890); its status is not yet a pass. CodeRabbit review was skipped because manual review is required for this OSS repository.
- A direct HTTPS request to the configured Render root endpoint could not resolve DNS from this execution environment (`curl: (6) Could not resolve host`). This is an environment/network limitation and does not prove the service is down. The source exposes only `GET /` as a basic process response; no dedicated `/health` route was found in `backend/src/index.ts`.
- GitHub branch-protection endpoint returned 403 to the connected integration, so required-check/ruleset policy could not be independently read. PR mergeability alone is not proof that required checks passed.
- Exact continuation: refresh #708's head checks until all are complete; inspect the JSS3/static test failure logs if the rerun fails; only merge after all required checks pass. Then validate #710 against the merged #708 base. Keep the production blockers above open.


## Update — 2026-11-13 15:18 UTC

- Latest observed `master` advanced to `af406a3e73f811ec27f02ba3b7e19b51873664bc` (merge of PR #685). The checkpoint branch has been refreshed to this master snapshot with a merge commit; the checkpoint remains the only branch-specific file.
- The first follow-up commit for ORCH-001 URL validation had an escaping mistake and its CI run #43450954587 failed. The correction is now committed at `6e555135d6a478c7c4c9fc07b800a4a03953cb82` with the intended single-backslash Python raw regex `r"^https://\S+$"`; run #43450997964 was pending at last inspection. Do not merge PR #717 until this latest run passes.
- PR #708's current required workflow state was not returned by the latest first-page Actions query; the prior run on head `78b9434` had its integrity gate pass, while the main acceptance/JSS3 run remained queued. Refresh checks by exact run ID/commit before any merge.
- PR #714 checks from its earlier branch head are stale after the checkpoint refresh; rerun and inspect current-head checks before merging the documentation PR.


## Update — 2026-11-13 15:19 UTC

- PR #708 is mergeable at GitHub metadata level but its branch remains based on master `982c1d2` while current master is `af406a3` (78 commits ahead of the merge base). Its changed-file set is 9 paths. I did not alter the active migration branch; I left an integration comment requesting refresh/rebase and complete rerun. #708 remains a hard prerequisite for #710.
- Latest known #708 integrity gate #43450585649 passed, but its JSS3/static acceptance run #43450584916 was still queued. Earlier static/focused regressions failed on an earlier head; current-head success has not been demonstrated.
- PR #717 contains the corrected queue URL validator and regression tests. The first follow-up CI run failed because of an escaping typo; the second correction is at `6e555135d6a478c7c4c9fc07b800a4a03953cb82`, and its workflow #43450997964 was pending with no jobs reported at the last poll. PR #683 remains blocked until this follow-up is green and its own workflow reruns successfully.
- PR #714's checkpoint branch is now exactly based on current master `af406a3e73f811ec27f02ba3b7e19b51873664bc`, 3 commits ahead and 0 behind; the checkpoint is fetched back and the PR is mergeable. Its current-head workflow evidence still needs a fresh check.

---

## Continuation update — 2026-11-13 17:07 UTC

This section supersedes earlier PR-state snapshots above. It records subsequent integration work without deleting the historical evidence.

### Previously owned integration deliverables

- This checkpoint was merged through PR #714 on 2026-11-13 at 15:27 UTC.
- The durable work-queue HTTPS URL validator fix and regression tests were merged through PR #717 at 16:06 UTC.
- The work-orchestrator implementation PR #683 was merged at 16:05 UTC after the URL validator defect was corrected in #717.
- The diagnostic dependency audit PR #707 was merged at 15:27 UTC. It is an audit workflow, not proof that all vulnerabilities were remediated.
- The first migration/calendar PRs #708 and #710 were closed as superseded, not merged. Their replacements were integrated in the correct order: migration ledger PR #737 merged at 15:52 UTC, then calendar/events PR #764 merged. #737's disposable PostgreSQL migration suite passed 3 integration tests, and its JSS3 verify run #43453221768 passed. #764's combined run #43455081897 passed backend/mobile TypeScript, static regressions, PostgreSQL schema replay and migration-ledger tests. No production DB was touched.
- Achievements PR #766 and announcement authoring PR #768 were also merged. Their prior PRs #743/#744 were superseded rather than merged.
- Android core implementation PR #727 was merged. Follow-up PR #792 was closed as superseded after its verified mobile implementation and checkpoint were carried onto the current CI-repair branch through PR #803.

### Current CI repair integration

- PR #788 remains OPEN and is the current master CI repair unit. Its original CI identified two independent problems: stale Financial Accounting Week 3 body hash and Geography coverage COV-GEO-T1-SCHEME-3 incorrectly listing a source BODY locator as a parsed lesson ID.
- Child PR #798 was reviewed and merged into the #788 branch at commit `420e82e6d1ab71a5ca07888fbc0f65a3ff12f093`. It removed only the invalid `lesson_ids` entry; the coverage remains `UNRESOLVED`, and exact source locator/hash evidence remains in `objective_locator`/evidence. It does not fabricate a lesson or claim teaching coverage.
- Android follow-up PR #803 was merged into the #788 branch at `2e3d126239e288f1fff00970b2f9d50eb6f73aa9`. It carries the safer outbox flush-promise cleanup, supported notification retry styling and the updated Android checkpoint from #792.
- On the combined #788 head `2e3d126239e288f1fff00970b2f9d50eb6f73aa9`, the latest run set was still in progress at the last poll: package integrity, cross-subject compiler, JSS3/PostgreSQL acceptance, mobile TypeScript and Android readiness were queued/running. Earlier #788 head `420e82e` passed package integrity, mobile TypeScript, Android readiness, Agricultural Science, Catering Craft and all-subject compiler checks; the current head must pass its own reruns before #788 can merge.
- PR #792 is closed as superseded by #803/#788. PR #803 is merged into the #788 branch, not directly into master.

### Updated production / release assessment

- Current master includes a dedicated versioned migration ledger and migration 0002 for school events. These are code/test integration results, not evidence that the production DB has adopted the ledger or applied migration 0002.
- The API exposes only a basic root `GET /` response (`status: ok`, app name and static version). No dedicated liveness/readiness route was found, and the root response does not test database connectivity. Attempts to open the configured Render API root and `/health` endpoint from the available web environment were inaccessible; this is not proof of service outage or health.
- The configured client API origin remains `https://sts-school-backend.onrender.com`. No provider-side Render access, live database status, service environment, deployment event or secret inventory is available through this repository connection.
- The historical Free Postgres expiry on 2026-10-04 remains confirmed. The 2026-11-12 database creation date in `REBUILD_DATABASE.md` is an example schedule, not a verified current resource. The replacement's plan, creation date, availability and backup configuration remain UNKNOWN.
- OPS-05 remains BLOCKED on owner credentials/approval. No current production dump, checksum, provider snapshot, disposable restore rehearsal or drift result has been evidenced. Free Render Postgres has no provider backups; the runbook requires weekly off-provider `pg_dump` and a restore rehearsal until paid automatic backups are verified.
- The workflow inventory has grown substantially and includes mobile Android readiness, backend regression, migration and curriculum validation workflows. It still contains no general backend production deployment workflow, no `render.yaml`, Dockerfile or Procfile. `build-french-mobile-release.yml` is a mobile build workflow, not a backend deployment workflow.
- `mobile/eas.json` defines an Android production App Bundle profile. CI has exported an Android JavaScript bundle and passed offline replay tests/TypeScript on verified heads, but no signed APK/AAB, EAS production build, emulator install/upgrade, physical-device test, or store submission is evidenced.
- Dependency audit output in current mobile CI reported 16 findings (2 low, 10 moderate, 4 high) on the source Android branch. The earlier diagnostic audit PR #707 reported 40 findings on its own historical dependency snapshot. A current, post-integration audit/remediation result is still required.

### Current blockers and exact next actions

1. Refresh PR #788's current-head checks for `2e3d126239e288f1fff00970b2f9d50eb6f73aa9`. Require all required checks to complete successfully; investigate any new failure and rerun. Merge #788 only after its current-head checks pass.
2. Once #788 is merged, verify master contains the Android promise cleanup, supported retry styling, financial-accounting body hash and Geography unresolved coverage correction. Close any superseded duplicate branches/PRs only after confirming their changes are included.
3. Add a non-sensitive DB readiness health endpoint or equivalent documented probe, then configure/verify the provider health check with owner approval. Do not call the static root response database health.
4. Obtain owner-authorised Render evidence for the current DB plan, creation date, availability and backup policy. If still Free, calculate the real expiry from the dashboard's actual creation date and upgrade before the deadline.
5. Execute OPS-05 only after explicit owner approval: read-only drift check, current backup, checksum, disposable restore rehearsal and private evidence record. Never commit connection strings, dump files or student data.
6. Establish the real backend deployment mechanism and a documented rollback procedure. Do not create a production deploy workflow that guesses provider settings or secrets.
7. Complete a signed EAS production AAB build and install/upgrade tests on supported Android devices; verify API connectivity, login, offline replay, push/notification behaviour and role-scoped flows.
8. Run a fresh dependency audit against the exact post-merge lockfiles and remediate exploitable vulnerabilities without suppressing audit failures.

**Current task status:** code-level integration is active; production release remains BLOCKED. The next worker must start with the current #788 check runs on the exact head SHA above, not the historical runs.
## Continuation update — 2026-11-13 17:10 UTC

- PR #788 is now MERGED into master at `acc6ff5f62113df659fbd0f39afe18ac44e7debf`. All seven workflows on its exact combined head `2e3d126239e288f1fff00970b2f9d50eb6f73aa9` passed: mobile TypeScript, Android readiness, SS1 integrity, JSS3/PostgreSQL acceptance, all-subject compiler, Agricultural Science and Catering Craft.
- PR #803 was merged into #788's branch before #788's final checks; the mobile changes are therefore included in master. PR #792 was closed as superseded after confirming its implementation was carried forward.
- A new health endpoint implementation is under review in PR #808. Its first workflow run confirmed all three HTTP-level behavior tests passed, but TypeScript rejected the original `pg` QueryConfig `query_timeout` approach. The implementation was corrected to use a transaction-scoped PostgreSQL `SET LOCAL statement_timeout = '5s'`; a fresh current-head workflow result is pending. Do not merge #808 until its new health test and typecheck both pass.
- The checkpoint refresh PR itself (#806) is based on the exact post-#788 master and has passed its latest package integrity, mobile TypeScript and JSS3/PostgreSQL acceptance checks; this update will trigger a fresh verification pass.

**Updated next action:** finish the fresh PR #808 checks, then merge the checkpoint refresh after its current-head checks pass. Production remains blocked on Render account evidence, OPS-05 drift/backup/restore approval, provider health-check configuration, deployment ownership and signed Android release/device acceptance.
## Continuation update — 2026-11-13 17:12 UTC

- PR #808 (health endpoints) is now MERGED into master at `7451e263136b4fedc5fd876f5822c755b6c7b1c7`.
- The merged API exposes `GET /health/live` (process-only) and `GET /health/ready` (bounded PostgreSQL `SELECT 1` inside a transaction with `SET LOCAL statement_timeout = '5s'`). Readiness returns 503 with a generic body on database failure and does not reveal connection details or exception text.
- Current-head CI for PR #808 passed all four workflow groups: dedicated health endpoint tests + backend typecheck, existing fatal-process regression + backend typecheck, SS1 package integrity, and JSS3/PostgreSQL integration acceptance. The HTTP suite passed 3/3 cases: liveness does not query DB; readiness succeeds when DB probe succeeds; readiness returns a safe 503 without leaking a simulated secret on DB failure.
- This is application code and test evidence only. Render's provider health-check path has not been configured. The recommended readiness path is `/health/ready`; no provider-side configuration or live production request has been performed.
- A Render integration is available for connection, which would permit direct verification of service/database status and backup settings. It is not yet connected; continue repository-only work until the owner connects it.

**Updated next action:** finish the latest PR #806 checkpoint verification and merge it after its current-head required checks pass. Then, with owner-authorised Render access, configure the provider's health-check path to `/health/ready`, inspect the actual PostgreSQL plan/creation date/backups, and execute OPS-05 only after explicit approval.