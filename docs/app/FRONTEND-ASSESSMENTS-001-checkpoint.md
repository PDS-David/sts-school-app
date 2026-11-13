# FRONTEND-ASSESSMENTS-001 — Student assessment journey checkpoint

Task ID: FRONTEND-ASSESSMENTS-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Worker branch: `agent/frontend-assessment-recovery-20261113`

## Baseline and ownership checks
- Inspected current master commit and open PR list before changes.
- Searched assessment-related open PRs and branches. No active open PR was modifying the student assessment screen or assessment submission flow; older assessment-related branches were present but no matching open PR was found.
- Read `mobile/src/screens/AssessmentsScreen.tsx`, `mobile/src/screens/TakeAssessmentScreen.tsx`, and `mobile/src/api/client.ts`.
- No backend route, grading algorithm, question answer-key delivery, role permission or assessment database contract was changed.

## Findings
- Assessment list fetch failures were swallowed, leaving an empty list indistinguishable from a valid no-assessments state.
- Question fetch errors had no retry action.
- When an existing submission's answer review request failed, the screen silently switched into a fresh attempt. That exposed an existing submission to accidental overwrite if the student continued.
- The API client's generic offline outbox could synthesize a successful queued response for POST assessment submissions. The screen could interpret that placeholder as a successful exam submission even though the server had not received it.

## Implemented
- Add explicit assessment-list error messaging and retry.
- Add question retrieval error messaging and retry.
- Keep previously submitted attempts in review mode after review retrieval failures; provide a review retry and a route back to assessments. Missing submission IDs fail closed with guidance instead of opening a fresh attempt.
- Keep retaking as an explicit, confirmed action; clear any local answer state when a student confirms retake.
- Add a submission guard against repeated in-flight/completed submission calls.
- Exclude `POST /learning/assessments/:id/submit` from offline write queueing so the student only sees success after the server returns a real response. Offline submission now fails visibly and can be retried when connected.

## Changed files
- `mobile/src/screens/AssessmentsScreen.tsx`
- `mobile/src/screens/TakeAssessmentScreen.tsx`
- `mobile/src/api/client.ts`

## Commits
- `632c99f2b90c07d2066f6d04031002f4134ebee6` — assessment list retry.
- `dfd6a27041729b4c19397fb2ba2e07628b9de3aa` — preserve existing attempts on review errors.
- `28290fb26be71fb82f301a771cb58f90d35c109e` — question retry and submission guards.
- `8e7eee36570b64738893178269f012f61b06da43` — require live confirmation for exam submission.
- `53e503bbd50b1cd28bfaade673595e4f04ea13ab` — document immediate-result offline exclusion.
- Checkpoint created in commit `84eb935ee000ac777474b345887dab37c1244be1`.

## Verification
- Static inspection confirms assessment list and question retries reissue their existing GET endpoints.
- Static inspection confirms a failed review request no longer exits review mode or changes the existing submission.
- Static inspection confirms retake requires explicit student confirmation.
- Static inspection confirms assessment submission is excluded from the synthetic offline outbox path and therefore cannot be shown as submitted based only on a queued placeholder.
- Existing role-scoped endpoints and grading rules were not changed.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available. The mobile package declares no test or typecheck script.
- No runtime, grading, network or device-readiness claim is made.

## Remaining work
- Run mobile TypeScript and frontend tests in an executable checkout; add automated regression coverage for the assessment submission offline exclusion and review-failure behavior.
- Verify on student accounts: first attempt, partial answers, essay answers, network failure before submit, retry after reconnect, existing submission review, pending essay grading and confirmed retake.
- Verify admin publish/close and results navigation separately; verify teacher/student role access remains aligned with backend RBAC.

## Exact next action
Compare this branch against current `master`, open a focused PR, and continue the broader audit with assessment result and administrator management journeys.
