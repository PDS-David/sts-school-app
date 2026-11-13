# SMM-004 — Student badges and achievements checkpoint

Task ID: SMM-004
Status: IMPLEMENTED ON CURRENT MASTER — awaiting CI/review
Base: `master` at `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Branch: `agent/student-achievements-current-master-20261113`

## Scope delivered
- Added student-only `GET /learning/achievements/me`.
- Derives badge state from existing source-of-truth records rather than a duplicate badge ledger:
  - passed topic completions;
  - assessment submissions;
  - fully graded assessment scores (80%+ and perfect scores).
- Score-based badges exclude submissions with any answer still marked `ai_graded` or `ai_unavailable`, guarding against the stale `fully_graded` flag.
- Resolves the active student record from the authenticated user; accepts no caller-supplied student ID.
- Added a student Badges & Achievements screen with earned/in-progress state, progress and earned dates; linked it from Profile.

## Changed files
- `backend/src/routes/learning.ts`
- `mobile/src/screens/student/StudentAchievementsScreen.tsx` (new)
- `mobile/src/screens/student/StudentProfileScreen.tsx`
- `mobile/src/navigation/StudentTabs.tsx`
- This checkpoint.

## Commits
- Route: `14961f4ce46dc08483446c67d5c81230b8820928`.
- Screen: `45581791c3239edd1519ba17163093c1fc5e0f39`.
- Navigation: `953815ee499e5b3331382683fa07c26a2c595055`.
- Profile link: `084bde52ee13ed68b58fce8d2c3f41c0b92007fc`.

## Verification
- Static review confirms the endpoint is student-role-only and derives student ID from the authenticated identity.
- Score-based achievements require fully graded results and reject pending AI grading statuses.
- No feature-specific threshold/API tests or device tests have run yet; PR CI is pending.

## Remaining
- Verify the SQL query against the disposable PostgreSQL CI schema and add threshold-boundary tests.
- Confirm actual student navigation and loading/empty states on device.

## Exact next action
Run CI for this current-master PR, fix any failures, and add targeted API/query tests before considering the feature complete.
