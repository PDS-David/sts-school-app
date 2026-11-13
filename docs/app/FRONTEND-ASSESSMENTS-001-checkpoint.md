# FRONTEND-ASSESSMENTS-001 — Assessment journeys checkpoint

Task ID: FRONTEND-ASSESSMENTS-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `af406a3e73f811ec27f02ba3b7e19b51873664bc`
Worker branch: `agent/frontend-assessment-recovery-latest-20261113`

## Baseline and ownership checks
- Inspected current master commit and open PR list before changes.
- Searched assessment-related open PRs and branches. No active open PR was modifying the assessment screens or assessment submission flow; older assessment-related branches were present but no matching open PR was found.
- Read the student list/attempt screens, admin create/results screens and shared API client.
- No backend route, grading algorithm, answer-key delivery, role permission or database contract was changed.

## Findings
- Assessment list fetch failures were swallowed, leaving an empty list indistinguishable from a valid no-assessments state.
- Question fetch errors had no retry action.
- When an existing submission's answer review request failed, the screen silently switched into a fresh attempt. That exposed an existing submission to accidental overwrite if the student continued.
- The API client's generic offline outbox could synthesize a successful queued response for assessment submission, assessment creation and question creation. The UI could report success without a real server response.
- Admin assessment creation silently swallowed setup failures for subjects, classes and the question bank.
- Admin assessment results silently swallowed API errors and showed an empty state instead of offering recovery.
- Brainee draft count displayed a maximum of 10 but did not enforce it.

## Implemented
- Student/admin assessment list: explicit load error and retry.
- Student question retrieval: explicit error and retry.
- Existing submissions: keep review mode after retrieval failure; retry review or return to list. Missing submission IDs fail closed with guidance rather than opening a fresh attempt.
- Retakes remain explicit and confirmed; local answers are reset only after confirmation.
- Guard against duplicate in-flight/completed submit calls.
- Exclude assessment creation, question creation and assessment submission from synthetic offline outbox responses. These actions now require real server confirmation before the UI can report success.
- Admin assessment creation: explicit setup loading/error/retry for subjects, classes and question bank.
- Brainee draft question count validation: whole number from 1 through 10.
- Admin assessment results: visible loading errors, retry and pull-to-refresh recovery while preserving any already-loaded result rows.

## Changed files
- `mobile/src/screens/AssessmentsScreen.tsx`
- `mobile/src/screens/TakeAssessmentScreen.tsx`
- `mobile/src/screens/CreateAssessmentScreen.tsx`
- `mobile/src/screens/AssessmentResultsScreen.tsx`
- `mobile/src/api/client.ts`

## Commits
- `ad63beb8184c2f05b7b64b3b0cdb0cc2168df236` — applied `mobile/src/api/client.ts` recovery changes on latest master.
- `33d4f5693c3699381514adce559570a7e39311e8` — applied `mobile/src/screens/AssessmentsScreen.tsx` recovery changes on latest master.
- `b598a2b8207ad8b31faebb91cd490ee8651cb46e` — applied `mobile/src/screens/TakeAssessmentScreen.tsx` recovery changes on latest master.
- `a9b416aac68bb327b4fb1d76272f7c25b9cf3634` — applied `mobile/src/screens/CreateAssessmentScreen.tsx` recovery changes on latest master.
- `1a79bfae53f76cec018bafbf6912621e55e51893` — applied `mobile/src/screens/AssessmentResultsScreen.tsx` recovery changes on latest master.
- Checkpoint commit: pending.

## Verification
- Static inspection confirms list/question/results retry paths reissue their existing GET endpoints.
- Static inspection confirms failed review retrieval preserves the previous attempt and does not route into a fresh attempt.
- Static inspection confirms retake requires explicit confirmation.
- Static inspection confirms assessment create, question create and assessment submit no longer accept synthetic queued responses as server success.
- Static inspection confirms assessment setup errors are separated from valid empty states and draft count validation matches the UI's stated range.
- Existing role-scoped endpoints and grading rules were not changed.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available. The mobile package declares no test/typecheck script.
- No runtime, grading, network or device-readiness claim is made.

## Remaining work
- Run mobile TypeScript and frontend tests in an executable checkout; add regression coverage for offline exclusions and review-failure behavior.
- Verify on student accounts: first attempt, partial answers, essay answers, offline submission, retry after reconnect, existing submission review, pending essay grading and confirmed retake.
- Verify admin creation, question-bank selection, publication, results navigation and essay grading on admin/teacher accounts. Confirm teacher access remains aligned with backend RBAC.

## Exact next action
Open a focused PR from this latest-master branch and continue the broader audit with notifications and parent/teacher/admin navigation.
