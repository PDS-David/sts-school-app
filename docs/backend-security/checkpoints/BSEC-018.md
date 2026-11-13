# Checkpoint — BSEC-018

- **Task ID:** BSEC-018
- **Title:** Enforce school and term scope on whole-class attendance and class-record reads
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
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
- **Exact next action:** add fail-closed school/term checks and school predicates to both GET /attendance and GET /attendance/class-records, then add HTTP regressions.
