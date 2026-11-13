# Checkpoint — BSEC-018

- **Task ID:** BSEC-018
- **Title:** Enforce school and term scope on whole-class attendance and class-record reads
- **Status:** implementation and focused verification passed; PR review pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 7451e263136b4fedc5fd876f5822c755b6c7b1c7
- **Working branch:** agent/backend-attendance-report-scope-20261113
- **Changed files planned:** backend/src/routes/attendance.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** PR #797 changes finance.ts; PR #801 changes weeklyEfforts.ts; PR #809 changes academic.ts. No active PR changes attendance.ts or the new attendance read-scope test.
- **Defects found:** GET /attendance only adds a school predicate when req.user.school_code is non-null. A teacher account missing its school assignment therefore falls through to a cross-school attendance query. GET /attendance/class-records does not add any school predicate for teachers at all; a teacher can supply a class name and term ID and retrieve another school's class records when the class label matches. Neither whole-class read validates that the requested term belongs to the teacher's school, unlike the write-side and individual-report routes.
- **Acceptance criteria:**
  1. Teachers without school_code fail closed on whole-class attendance/class-record reads.
  2. Teachers remain pinned to assigned_class; subject-only teachers must specify a class, consistent with student roster behavior.
  3. Both whole-class endpoints validate positive term IDs and reject cross-school terms for teachers (and school-bound admins).
  4. SQL always includes the caller's school predicate for teachers; admins preserve existing global/assigned-school behavior.
  5. Soft-deleted student records are excluded from non-admin whole-class reports.
  6. PostgreSQL HTTP regressions prove cross-school reads are denied and valid same-school reads remain available.
  7. Backend TypeScript and focused tests pass; no production data changes.
- **Latest implementation commit:** 9967f4fa7ba2ca51d462817d21cb62f75d0733eb
- **Verification:** Backend attendance report tenant scope workflow 43470650104 passed (PostgreSQL 16 HTTP scope regressions and backend TypeScript typecheck). Existing attendance batch integrity, student report term scope and academic term tenant-isolation workflows also passed on the same head SHA.
- **Remaining:** PR review/merge. No production records or data were changed.
- **Exact next action:** review PR #815 and merge after all required repository checks pass.
