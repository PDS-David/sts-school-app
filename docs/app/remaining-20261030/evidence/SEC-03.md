# SEC-03 — Teacher-school equality on promotion, demotion and retention

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented, not approved, not verified).
Base: `origin/master` `017b172d59b5e1e54c1cec1b6d72d240a029782e`. Files: `backend/src/routes/students.ts`, this note.

## Old behaviour (base)
- `POST /students/:id/promotion` (`students.ts:245`) is teacher-only (`requireRole('teacher')`). It loads the student by id with `deleted_at IS NULL` and no school predicate (`students.ts:252-255`), then authorises with one condition, `!user.assigned_class || user.assigned_class !== student.class_name` (`students.ts:261`).
- `class_name` and `assigned_class` are plain text such as "JSS 1" that repeat across schools. A teacher in school A whose `assigned_class` equals a school-B student's `class_name` passed the check and could promote, demote or retain that student; the target class is then looked up in the student's school (`students.ts:270-272`) and `class_name` is overwritten (`students.ts:293-296`).
- The system reference records this as a source observation: promotion checks `assigned_class` but lacks an explicit teacher-school equality condition.

## New behaviour
- One guard, before the `retain` branch, so promote, demote and retain share it: the teacher must have a `school_code`, `student.school_code` must equal it, and the existing assigned-class condition must hold. Any failure returns the same 403 and message as before, so the response does not reveal whether the student exists in another school.
- Soft-deleted and missing students still return 404 from the existing query. The 409 for a class not in the school's list, the 400 at the ends of the sequence, the classes.id ordering rule, the audit calls and every authorised response body are unchanged. No admin path was added.

## Static matrix (derived from the code; not executed)
| Case | Result |
|---|---|
| Same school, student in the teacher's assigned class | allowed (unchanged) |
| Same school, student in another class | 403 |
| Other school, identical class label | 403 (was allowed) |
| Teacher with no assigned class | 403 |
| Teacher with no school_code | 403 |
| Soft-deleted or missing student | 404 |
| Admin, parent, student, finance_admin | 403 from `requireRole('teacher')`, as before |

## Deviation from the prompt's preference
The prompt prefers `checkTeacherStudentScope`. I used an inline guard instead: that helper's denial text refers to writing records and its school mismatch message differs from this route's, which would change denial bodies, and it adds a second student query. The inline guard gives the same school and class rules and the same `deleted_at` 404 (from this route's own query). No `termId` is involved, so a class lock still never blocks a promotion.

## Not changed
No per-session enrolment history (that is DATA-03). The student self-learning flow (AI-taught, independent of teachers) is untouched; only which teachers may move a student's class label is narrowed.

No tests, typechecks, DB, migrations, server or device checks were run. Testing deferred by owner.
