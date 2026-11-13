# SMM-004 — Student badges and achievements checkpoint

Task ID: SMM-004
Status: IMPLEMENTED IN BRANCH — awaiting CI/PR review; no runtime verification claimed
Base: `master` at `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Branch: `agent/student-achievements-20261113`

## Scope delivered
- Added student-only `GET /learning/achievements/me`.
- Derives badge state from existing source-of-truth records rather than introducing a duplicate achievement ledger:
  - passed topic completions;
  - assessment submissions;
  - fully graded assessment scores (80%+ and perfect scores).
- Provisional/unreviewed AI essay grades do not count toward score-based badges because the query requires `fully_graded=true`.
- The endpoint resolves the current authenticated student's active student row; it accepts no student ID and cannot be used to query another student.
- Added a student Badges & Achievements screen with earned/in-progress state, progress and earned dates; linked it from the student's Profile navigation.

## Changed files
- `backend/src/routes/learning.ts`
- `mobile/src/screens/student/StudentAchievementsScreen.tsx` (new)
- `mobile/src/screens/student/StudentProfileScreen.tsx`
- `mobile/src/navigation/StudentTabs.tsx`
- This checkpoint.

## Commits
- `95c30c34880573aed29748664a800130fff53dd9` — achievements API.
- `4ac1dbb5f113d50954f69ad714d1aa36bfd942f5` — threshold earned dates.
- `9338fb715115f6e5b26e6036619c86c9558663d9` — achievements screen.
- `ee68e9d9a0443242a6892f8c2f7a9abbc83a0d04` — profile link.
- `4f15dfbbc434a933a8c57dce1aa13488b7c39e62` — navigator registration.

## Verification
- Static review confirms the route requires student role, resolves student ID from the authenticated user, and returns only that student's aggregate achievements.
- Score-based badges require `fully_graded=true`, avoiding provisional AI marks.
- No new schema was added intentionally: the existing `topic_completions`, `submissions`, and `assessments` records are the authoritative evidence, and computing badges avoids duplicate mutable state.
- No automated tests, TypeScript build, or live DB test have been run because no local repository execution environment is available in this session.

## Remaining
- Add executable tests for threshold boundaries and the student-only API; run backend/mobile typechecks when a local runtime is available.
- Product-owner review of badge names, thresholds and whether other milestones should count.
- Continue the remaining unfinished feature backlog after this PR.

## Exact next action
Open a focused PR and inspect CI. Then audit other documented placeholders/features not yet implemented (especially announcements admin authoring UI, remaining calendar surfaces, and any unfinished functionality in `TODO.md`/feature docs).
