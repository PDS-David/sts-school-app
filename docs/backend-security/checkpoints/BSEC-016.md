# Checkpoint — BSEC-016

- **Task ID:** BSEC-016
- **Title:** Enforce class and active-ward scope on weekly-effort feedback access
- **Status:** focused verification passed; PR review pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** b8651cebaa480097fd1c40c9b02c11b228187caa
- **Working branch:** agent/backend-weekly-feedback-access-scope-20261113
- **Latest implementation commit:** ec93168258a71825d3be5627180df56c9a5199c4
- **Checkpoint update:** this commit
- **Changed files planned:** backend/src/routes/weeklyEfforts.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** no active PR changes weeklyEfforts.ts or the new feedback-scope integration test. PR #797 changes finance.ts only; PR #790 changes auth.ts and credential tests.
- **Defect:** checkWeeklyEffortAccess allows every teacher in the same school to read or reply to any weekly-effort feedback thread, regardless of assigned class or who logged the record. This contradicts GET /weekly-efforts, which restricts class teachers to their assigned class and subject-only teachers to entries they personally logged. Parent feedback access also accepts parent_wards links to soft-deleted students, unlike active-ward scoping in other read paths.
- **Acceptance criteria:**
  1. Class teachers can read/reply only to weekly-effort records for their assigned class in their own school.
  2. Subject-only teachers can read/reply only to records they personally logged in their own school.
  3. Teachers without a school assignment fail closed.
  4. Parents can read/reply only for currently active linked wards; soft-deleted ward records are denied.
  5. Students remain limited to their own record; admins retain global access.
  6. Add PostgreSQL HTTP regressions for each role/scope boundary and verify backend typecheck.
  7. No production records or data are changed.
- **Verification:** Backend weekly-effort feedback access scope workflow 43469213275 passed: PostgreSQL 16 bootstrap, HTTP permission regression suite, and backend TypeScript typecheck. Repository-wide SS1/JSS3 workflows failed only on an unrelated existing mobile TypeScript error in mobile/src/screens/NotificationsScreen.tsx (BtnProps does not define size); no weekly-efforts file is implicated.
- **Remaining:** PR review/merge after repository-wide CI baseline is restored; no production data changed.
- **Exact next action:** review PR diff and confirm no overlapping changes before merge.
