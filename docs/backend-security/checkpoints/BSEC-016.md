# Checkpoint — BSEC-016

- **Task ID:** BSEC-016
- **Title:** Enforce class and active-ward scope on weekly-effort feedback access
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** b8651cebaa480097fd1c40c9b02c11b228187caa
- **Working branch:** agent/backend-weekly-feedback-access-scope-20261113
- **Last commit:** pending
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
- **Exact next action:** extract and harden checkWeeklyEffortAccess using the same class/teacher scope as GET /weekly-efforts, then add HTTP tests.
