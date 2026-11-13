# SMM-004 — Student badges and achievements checkpoint

Task ID: SMM-004
Status: IMPLEMENTED — stacked behind current-master OPS-01 and calendar
PR base: `master` (this branch includes OPS-01 PR #737 and calendar PR #740 before achievements)
Branch: `agent/student-achievements-rebased-20261113`

## Scope delivered
- Added student-only `GET /learning/achievements/me`.
- Derives badges from passed topic completions and assessment submissions; no duplicate badge ledger.
- Awards first/10th/25th topic milestones, first assessment, 80%+ fully graded assessment, and perfect-score badges.
- Score-based badges require `fully_graded=true` and reject submissions with answer grading status `ai_graded` or `ai_unavailable`.
- Resolves the active student row from authenticated identity; no caller-supplied student ID.
- Added a student achievements screen with earned/in-progress state, progress and earned dates; linked from Profile alongside School Calendar. Load failures now show a retry warning rather than masquerading as an empty achievements feed.

## Changed files
- `backend/src/routes/learning.ts`
- `mobile/src/screens/student/StudentAchievementsScreen.tsx` (new)
- `mobile/src/screens/student/StudentProfileScreen.tsx`
- `mobile/src/navigation/StudentTabs.tsx`
- This checkpoint.

## Commits
- API: `90b215bf3c7aee43c118cbc1c9629a019893d0b8`.
- Screen: `f2adda838c8afee911edfbd21d99a7abc2a67469`.
- Navigation: `ba097e0159041da92ec7bb22312b7f896f869551`.
- Profile: `445078236e8b85e3d5c82d62cdcc239464f1c52e`.

## Verification
- Static review confirms student-only access, identity-derived student lookup and exclusion of provisional AI essay grades.
- Combined CI, threshold/API tests and device acceptance are pending.

## Remaining
- Add threshold-boundary and student-only API tests.
- Verify loading/error/empty states and navigation on student devices/accounts.

## Exact next action
Open this PR against calendar PR #740, run combined CI and add focused tests. Merge order: OPS-01 #737, calendar #740, then achievements.
