# SEC-03 — Require teacher-school equality on promotion

Status: READY · Depends: none · Owner decision: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/students.ts`, `docs/app/remaining-20261030/evidence/SEC-03.md`

## Why (verified at master `8ffcd12`)

`POST /students/:id/promotion` (`backend/src/routes/students.ts:245-302`) is teacher-only. It loads the student by id with no school predicate (`252-255`), then authorises with one condition:

```
if (!user.assigned_class || user.assigned_class !== student.class_name) return 403
```

(`students.ts:261-263`). The target class is then chosen from `classes` filtered by **the student's** school (`students.ts:270-272`), and `class_name` is overwritten (`293-296`).

A teacher in school A whose `assigned_class` string equals a school-B student's `class_name` (e.g. both `"JSS 1"`) passes the only check and can promote, demote or retain that student. The reference manual records this as a source observation: "Promotion checks assigned_class but lacks an explicit teacher-school equality condition."

## Do

1. Add the school check before the class check: reject when `student.school_code !== user.school_code` with 403 and a message that does not disclose whether the student exists elsewhere.
2. Keep the existing class condition and the "no admin bypass" intent. Prefer calling `checkTeacherStudentScope(user, req.params.id)` (it already enforces 404 for missing/soft-deleted, school at `scope.ts:59-61`, class at `62-64`) **without** a `termId`, so a class lock does not block a promotion; add one comment saying why no lock is passed.
3. Keep the 409 for a class name that is not in the school's class list and the 400 for sequence ends. Do not change the class-ordering rule (classes.id order) or the audit calls.
4. Record the resulting matrix (same school/same class, same school/other class, other school, soft-deleted) in the evidence note.

## Acceptance (static)

- A teacher cannot reach the UPDATE without `student.school_code === user.school_code` and the assigned-class condition.
- Soft-deleted students remain 404.
- Retention, promotion and demotion all use the same guard.
- Audit rows and response bodies are unchanged for authorised callers.

## Do not

- Add an admin path to this route (the route is deliberately teacher-only).
- Create a per-session enrolment history here — class-at-time preservation is `DATA-03`.
- Run the route, a database query or a test.
