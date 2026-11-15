# Checkpoint — BSEC-018

- **Task ID:** BSEC-018
- **Title:** Enforce school and term scope on whole-class attendance and class-record reads
- **Status:** implementation and all required CI checks passed; PR review/merge pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** af35f2f669d10e9b56b2abeae71e7abb3b0a8862
- **Working branch:** agent/backend-attendance-report-scope-20261113
- **Changed files planned:** backend/src/routes/attendance.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** no other active PR changes attendance.ts or the attendance report scope integration test.
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
- **Verification:** Backend attendance report tenant scope workflow 43473296057, attendance batch integrity workflow 43473296161, student report term scope workflow 43473296101, academic term tenant-isolation workflow 43473296521, SS1 package integrity gate 43473296098, and JSS3 implementation/asset checks 43473296096 all passed against the current master merge base. PostgreSQL 16 regressions verify same-school reads, foreign-term rejection, unassigned teacher denial, subject-only class selection and administrator global/history access.
- **Remaining:** merge PR #815 after its checkpoint-only update is reverified. No production records or data were changed.
- **Exact next action:** review PR #815 and merge using its current expected head SHA once all checks pass.
