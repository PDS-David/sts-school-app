# FRONTEND-LEARNING-001 — Lesson discovery recovery checkpoint

Task ID: FRONTEND-LEARNING-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Worker branch: `agent/frontend-learning-discovery-20261113`

## Baseline and ownership checks
- Inspected latest master history before editing.
- Searched open PRs and branches for student learning/topic discovery work; no active matching PR or branch was found.
- Read `mobile/src/screens/student/StudentLearningScreen.tsx` and `mobile/src/screens/SubjectTopicsScreen.tsx`.
- No backend endpoints, lesson content, curriculum mappings, PIN/lock rules or access scopes were changed.

## Findings
- Student Learning swallowed failures from `GET /academic/subjects` and displayed “No subjects assigned yet”, incorrectly presenting a network/API failure as a valid empty state.
- Subject Topics swallowed failures from `GET /learning/topics` and could display “No topics yet” when the topics request had actually failed.
- Neither screen offered a recovery action for these failures.

## Implemented
- Add an explicit subject-loading error and retry action to the Learning screen.
- Add a distinct topic-loading error and retry action to the Subject Topics screen.
- Keep genuine empty states separate from failed requests.
- Preserve offline cache behavior, lesson package retrieval, sequence locks and Term PIN navigation.

## Changed files
- `mobile/src/screens/student/StudentLearningScreen.tsx`
- `mobile/src/screens/SubjectTopicsScreen.tsx`

## Commits
- `5404da2dfd263f217e4123f9a97752ed6f149757` — add subject discovery retry state.
- `c68e73fe6d0f457bfeccd79db5404a5d98ee2cef` — distinguish topic load errors from empty subjects.
- Checkpoint commit: pending.

## Verification
- Static inspection confirms both retry controls reissue the existing GET endpoints.
- Static inspection confirms successful empty responses retain the original empty-state messages.
- No content, PIN or sequence-lock logic changed.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available. The mobile package has no test/typecheck scripts.
- No runtime or device-readiness claim is made.

## Remaining work
- Run mobile typecheck and test online, offline-cache and network-failure states in an executable checkout.
- Verify topic and package lesson rendering for all supported class levels and subject types.

## Exact next action
Compare with current `master` and open a focused PR. Continue the wider frontend audit in another independent student journey.
