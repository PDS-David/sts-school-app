# SEC-01 — Report role and class-scope gaps

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented, not approved, not verified).
Base: `origin/master` `f87ef8a9f0c4eb9a8d6ab959e13d6f280abcd293` (30 October 2026). The prompt's line numbers (verified at `8ffcd12`) still matched at this base.
Files changed: `backend/src/routes/scores.ts`, this note.

## Old behaviour (base `f87ef8a`)
- `GET /scores/report/:student_id` (`scores.ts:237`) and `GET /scores/session-report/:student_id` (`scores.ts:346`) authorised with an open `if / else if` chain (`scores.ts:247-256` and `scores.ts:355-364`) over `student`, `parent` and `teacher` only. There was no final `else` and no `requirePerm`, so any other role matched no branch and fell through to report construction. `finance_admin` is a valid role (`backend/src/types/index.ts:6`), so it received the full report. `admin` also reached it only by falling through.
- The teacher branch compared only `student.school_code !== user.school_code` (`scores.ts:255`, `scores.ts:363`), so a class-assigned teacher could read any student in the school.
- `checkTeacherStudentScope` (`backend/src/utils/scope.ts:40-64`) already encodes the intended rule: school equality at 59-61, assigned-class equality at 62-64, 404 for a missing or soft-deleted student at 49-50. The class-lock branch (66-80) runs only when `termId` is passed.

## New behaviour
- One shared `authoriseReportAccess(user, student)` (`scores.ts:245`) is called by both handlers (`scores.ts:278`, `scores.ts:378`); each returns `{status, error}` unchanged when it denies.
- Allow-list: `student` own record (else 403 `Access denied`); `parent` linked ward (else 403 `Not your ward`); `teacher` through `checkTeacherStudentScope(user, student.id)` with no `termId`; `admin` all; every other role, including `finance_admin`, 403 `Access denied`.
- Queries, columns, response shapes, score calculation, ranking, attendance and remarks are unchanged. No edit is needed in mobile report code.

## Static access matrix (derived from the code written; not executed)
"Own" is the role's natural target: the student's own record, the parent's linked ward, a student in the teacher's assigned class, any student for admin and finance_admin.
| Role | Own | Other class, same school | Other school |
|---|---|---|---|
| student | allowed | 403 Access denied | 403 Access denied |
| parent | allowed | 403 Not your ward | 403 Not your ward |
| teacher with assigned class | allowed | 403 (scope.ts:62-64 wording) | 403 (scope.ts:59-61 wording) |
| teacher without assigned class | allowed | allowed (school-wide read kept) | 403 (scope.ts:59-61 wording) |
| admin | allowed | allowed | allowed |
| finance_admin | 403 Access denied | 403 Access denied | 403 Access denied |
A missing student returns 404 before authorisation, as before. For a soft-deleted student every cell above becomes 404 except admin (allowed), after the allow-list check.

## Behaviour differences to be aware of
- Teachers: class-assigned teachers lose read access to other classes (intended). Teachers without an assigned class keep school-wide read, as the prompt states.
- Soft-deleted students: the old report handlers did not check `deleted_at` for any role. They now return 404 `Student not found` for every role except admin, checked after the role allow-list so an unauthorised caller still gets 403. Admin keeps read access, consistent with `students.ts:131` (admin sees deleted records) and the restore route. Parents, who previously could read a deleted ward's report through the surviving `parent_wards` row, are now refused. A deleted student's own login is already blocked by `middleware/auth.ts:30,62`. This follows the system reference (soft deletion keeps dependent history with explicit admin restore; the reference states no parent or teacher access to deleted students' reports). Writes still reject deleted students for every role including admin (`scope.ts:50`); reads differ on purpose.
- Teacher denial messages come from the helper and say "write records"; the wording is unchanged because `scope.ts` is outside this task's writes.
- `admin` is now an explicit branch instead of an accidental fall-through; `finance_admin` is no longer treated as admin.

## Deliberately not changed
`GET /scores` (list), score calculation, ranking, attendance, remarks, `scope.ts`, mobile code, route-level `requirePerm`.

No tests, typechecks, DB, migrations, server or device checks were run. Testing deferred by owner.
