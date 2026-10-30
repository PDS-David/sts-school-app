# SEC-01b — Soft-deleted students' reports are admin-only

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented, not approved, not verified).
Base: `origin/master` `017b172d59b5e1e54c1cec1b6d72d240a029782e`. Files: `backend/src/routes/scores.ts`, this note.
Follow-up to SEC-01 (PR #270). The commit that added this rule was pushed to the SEC-01 branch after that PR was merged, so it never reached master; this PR re-lands it. `SEC-01.md` is not edited; where it says teachers now get 404 for soft-deleted students, this note supersedes it.

## Old behaviour (base)
- `GET /scores/report/:student_id` and `GET /scores/session-report/:student_id` load the student with `SELECT * FROM students WHERE id=$1` and no `deleted_at` predicate. After SEC-01, `authoriseReportAccess` (`scores.ts:246`) rejected wrong roles, but only the teacher branch, through `checkTeacherStudentScope` (`scope.ts:50`), returned 404 for a soft-deleted student. A parent could still read a deleted ward's report because the `parent_wards` row survives deletion.
- Everywhere else deleted students are hidden from non-admins: lists and ward lookups (`students.ts:45,70,89`), message contacts (`scope.ts:222-231,394,425`), login (`middleware/auth.ts:30,62`); admin sees them (`students.ts:131`) and restores them (`POST /students/:id/restore`).

## New behaviour
- After the role allow-list passes, `authoriseReportAccess` returns 404 `Student not found` when `student.deleted_at` is set and the caller is not admin (`scores.ts:275`). Unauthorised callers still get their 403 first, so existence is not revealed to them.
- Admin keeps read access: reports are the history that soft deletion preserves for records and restore.
- No query, column or response key changed.

## Static matrix for a soft-deleted student (derived from the code; not executed)
| Role | Result |
|---|---|
| admin | allowed |
| teacher (in scope) | 404 |
| teacher (out of scope) | 403 |
| parent (linked ward) | 404 (was allowed) |
| parent (not linked) | 403 |
| student (own record) | 404 (login is already blocked for deleted students) |
| student (other record) | 403 |
| finance_admin | 403 |

## Not changed
Writes still reject deleted students for every role including admin (`scope.ts:50`); reads differ on purpose. The student self-learning flow (AI-taught, independent of teachers) uses no report route and is untouched.

Consistent with the system reference: soft deletion keeps dependent history with an explicit admin restore; no reference text gives parents or teachers access to deleted students' reports.

No tests, typechecks, DB, migrations, server or device checks were run. Testing deferred by owner.
