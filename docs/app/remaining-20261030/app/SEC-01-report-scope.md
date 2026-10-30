# SEC-01 — Close the report role and class-scope gaps

Status: READY · Depends: none · Owner decision: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/scores.ts`, `docs/app/remaining-20261030/evidence/SEC-01.md`

## Why (verified at master `8ffcd12`)

`GET /scores/report/:student_id` (`backend/src/routes/scores.ts:237-339`) branches only for `student` (247-248), `parent` (249-253) and `teacher` (254-256). There is **no `else`**, and the route has no `requirePerm`. A `finance_admin` token therefore matches no branch and receives the full report — scores, computed averages, class position, attendance and remarks.

The teacher branch checks only `student.school_code !== user.school_code` (255). A teacher assigned to a class can read any student in the school, not just their own class, although `checkTeacherStudentScope` (`backend/src/utils/scope.ts:40-64`) already encodes the intended rule (school equality at 59-61, assigned-class equality at 62-64).

`GET /scores/session-report/:student_id` (`scores.ts:346-449`) repeats both problems at 355-364.

## Do

1. Replace the open `else if` chains with an explicit allow-list: `student` (own record), `parent` (linked ward), `teacher` (own school **and** own class when `assigned_class` is set), `admin` (all). Every other role — including `finance_admin` — returns 403.
2. For the teacher branch, reuse the existing scope helper rather than duplicating the comparison:
   - call `checkTeacherStudentScope(user, studentId)` and return its `{status, error}` unchanged when non-null;
   - document in one comment why the helper's class-lock branch is not triggered here (no `termId` is passed for a read).
   Keep the existing 404 behaviour for a missing or soft-deleted student.
3. Apply the identical rule to both handlers; keep response shapes and queries unchanged.
4. Record in the evidence note a 5-role × 3-target matrix (own, other class, other school) with the expected status for each, derived from the code you wrote. Do not claim it was executed.

## Acceptance (static)

- No handler can reach report construction without passing an allow-list branch.
- `finance_admin` appears in no accepted branch and is not silently treated as admin.
- Teacher access is narrowed to assigned class when one is set; same-school teachers without an assigned class keep school-wide read (state this explicitly in the note).
- No query, column or response key changed; mobile report code needs no edit.

## Do not

- Change score calculation, ranking, attendance or remarks.
- Use `requireRole('teacher','admin')` as the only guard — it would not fix the class scope.
- Touch `GET /scores` (list), which already scopes by class/subject at `scores.ts:47-51`.
