# SMM-004 — Student badges and achievements checkpoint

Task ID: SMM-004
Status: IMPLEMENTED — stacked behind SMM-002 calendar and OPS-01 migration runner
Base: `agent/calendar-current-master-20261113` (PR #728; itself depends on OPS-01 PR #724)
Branch: `agent/student-achievements-stacked-20261113`

## Scope delivered
- Added student-only `GET /learning/achievements/me`.
- Derives badges from existing source-of-truth records: passed topic completions and assessment submissions; no duplicate badge ledger.
- Awards first/10th/25th topic milestones, first assessment, 80%+ fully graded assessment, and perfect-score badges.
- Score-based badges require `fully_graded=true` and reject any submission with answer grading status `ai_graded` or `ai_unavailable`, so provisional AI essay grades do not count.
- Resolves the active student row from the authenticated user; no caller-supplied student ID.
- Added student achievements screen with progress, earned state and earned dates; linked it from Student Profile and registered the route alongside School Calendar.

## Changed files
- `backend/src/routes/learning.ts`
- `mobile/src/screens/student/StudentAchievementsScreen.tsx` (new)
- `mobile/src/screens/student/StudentProfileScreen.tsx`
- `mobile/src/navigation/StudentTabs.tsx`
- This checkpoint.

## Commits
- API: `a36189dd6d2336ee73a440bd3bf7f519a72cb362`.
- Screen: `1aadb6a07bd710863273c16fe1ef53920b33c16d`.
- Navigation: `78ede4b2cc65977d7fb9271789a080d2cd985503`.
- Profile link: `b77d62382beba5fb100247211318dfadda4c7c6a`.

## Verification
- Static review confirms student-only access and identity-derived student lookup.
- Pending AI essay grading is explicitly excluded from score-based badge calculations.
- Combined CI, feature-specific SQL threshold tests and device tests remain pending.

## Remaining
- Add threshold-boundary and student-only API tests.
- Verify badge screen loading/error/empty states and navigation on a student device/account.

## Exact next action
Open this PR against the calendar branch, run combined CI, and add focused tests. Merge order: OPS-01 #724, calendar #728, then this achievements PR.
