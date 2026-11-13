# SMM-004 — Student badges and achievements checkpoint

Task ID: SMM-004
Status: IMPLEMENTED — stacked on current-master calendar PR #764
Base: `agent/calendar-master-merged-ops-20261113` (PR #764)
Branch: `agent/student-achievements-master-merged-ops-20261113`

## Scope delivered
- Added student-only `GET /learning/achievements/me`.
- Derives badges from passed topic completions and assessment submissions; no duplicate badge ledger.
- Awards first/10th/25th topic milestones, first assessment, 80%+ fully graded assessment and perfect-score badges.
- Score-based badges require `fully_graded=true` and reject submissions with answer grading status `ai_graded` or `ai_unavailable`.
- Resolves the active student row from authenticated identity; no caller-supplied student ID.
- Added student achievements screen with earned/in-progress state, progress and earned dates; linked from Profile alongside School Calendar.
- Failed achievements refreshes show a retry warning and preserve the last successful view.

## Changed files
- `backend/src/routes/learning.ts`
- `mobile/src/screens/student/StudentAchievementsScreen.tsx` (new)
- `mobile/src/screens/student/StudentProfileScreen.tsx`
- `mobile/src/navigation/StudentTabs.tsx`
- This checkpoint.

## Commits
- API: `846a00ad0830f91b5e85469651c42e35d1d65ffe`.
- Screen: `734110b1686d42a04dbc76c480060cd577cbc43b`.
- Navigation: `94ccc25e9a3d04cab32d97e9da9a0d3108f183ba`.
- Profile: `5a12a168eb79c3971c7661648ced9fc3075375b2`.

## Verification
- Static review confirms student-only access, identity-derived student lookup and exclusion of provisional AI essay grades.
- Combined CI, threshold/API tests and device acceptance are pending.

## Remaining
- Add threshold-boundary and student-only API tests.
- Verify loading/error/empty states and navigation on student devices/accounts.

## Exact next action
Open this PR against the calendar branch, run full CI and add focused tests. Merge #764 first, then this PR.
