# OPS-03 — Decide and document the row-security posture

Status: BLOCKED ON OWNER DECISION D6 · Depends: none · Base: `origin/master` (record the SHA)
Writes: `docs/app/remaining-20261030/evidence/OPS-03.md`, and (only if the owner chooses option B) `backend/schema.sql` + an OPS-01 migration

## Why

`backend/schema.sql` contains no `ROW LEVEL SECURITY` and no `CREATE POLICY`. Every access rule lives in application SQL (`scope.ts`, `checkTeacherStudentScope`, per-route branches). The manual states: "No row-level security policies are declared in schema.sql; application queries enforce scope. Hosted database provider defaults do not prove per-user RLS."

Today that is a single-layer defence. It has already failed once in production-shaped code: score, attendance and class-record writes trusted `requirePerm` alone until QA Pass 4 (`scope.ts:5-38` documents the incident), and the score-report read path still has a `finance_admin` gap (`SEC-01`).

## Do (decision record; recommended option A)

1. Write the decision record in the evidence file. It must cover:
   - **Option A (recommended):** stay application-only; make the API the only DB client; document the DB role's least privilege (no `SUPERUSER`, no `BYPASSRLS`, `CONNECT` only from the API host); record the residual risk (one missed `WHERE` = one leak).
   - **Option B:** RLS per school-scoped table, using a session variable set by the pool (`SET LOCAL app.user_id`/`app.role`), with policies for `students`, `scores`, `attendance`, `class_records`, `weekly_efforts`, `invoices`, `submissions`. Analyse every route that uses a service-level query and state which would break.
   - **Option C:** no change; record as accepted risk with a review date.
2. Quantify the current surface: count the routes that query by an id without a school predicate (cite each `path:line`). This is the number that makes the decision meaningful.
3. If D6 chooses B, produce a written, phased design only — no policy SQL in this task; each policy needs its own tests, which are deferred.
4. Do not weaken any existing scope helper while analysing.

## Acceptance (static)

- The evidence file states the chosen option, the evidence for it, the residual risk, and who must approve.
- Every count is derived from the current tree with cited lines.
- No application or schema change in option A/C; none in option B beyond the design.

## Do not

- Add RLS policies without per-route analysis and a migration.
- Claim the hosted database is or is not protected beyond what the repository shows.
- Change permissions or scope helpers in this task.
