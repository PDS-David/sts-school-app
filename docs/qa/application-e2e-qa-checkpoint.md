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
