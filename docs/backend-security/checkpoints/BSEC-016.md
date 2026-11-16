# Checkpoint — BSEC-016

- **Task ID:** BSEC-016
- **Title:** Enforce class and active-ward scope on weekly-effort feedback access
- **Status:** merged
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** af35f2f669d10e9b56b2abeae71e7abb3b0a8862
- **Working branch:** agent/backend-weekly-feedback-access-scope-20261113
- **PR:** https://github.com/PDS-David/sts-school-app/pull/801 (merged 2026-11-13T17:36:49Z)
- **Merge commit:** d48f4fcc693665a6838ac48fb4c071130c171b4d
- **Latest implementation commit:** 0064deb5d2cd4ece0398233e2ab0a3968ab7d6ca
- **Checkpoint update:** this commit
- **Changed files planned:** backend/src/routes/weeklyEfforts.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** no other active PR changes weeklyEfforts.ts or the feedback-scope integration test.
- **Defect:** checkWeeklyEffortAccess allows every teacher in the same school to read or reply to any weekly-effort feedback thread, regardless of assigned class or who logged the record. This contradicts GET /weekly-efforts, which restricts class teachers to their assigned class and subject-only teachers to entries they personally logged. Parent feedback access also accepts parent_wards links to soft-deleted students, unlike active-ward scoping in other read paths.
- **Acceptance criteria:**
  1. Class teachers can read/reply only to weekly-effort records for their assigned class in their own school.
  2. Subject-only teachers can read/reply only to records they personally logged in their own school.
  3. Teachers without a school assignment fail closed.
  4. Parents can read/reply only for currently active linked wards; soft-deleted ward records are denied.
  5. Students remain limited to their own record; admins retain global access.
  6. Add PostgreSQL HTTP regressions for each role/scope boundary and verify backend typecheck.
  7. No production records or data are changed.
- **Verification:** Backend weekly-effort feedback access scope workflow 43473280362, SS1 package integrity gate 43473281976, and JSS3 implementation/asset checks 43473280611 all passed against the current master merge base. The focused workflow includes PostgreSQL 16 HTTP authorization regressions and backend TypeScript typecheck.
- **Remaining:** none for BSEC-016. No production data changed.
- **Exact next action:** continue with the next independently scoped backend defect.
