# OPS-03 — Row-security posture: decision record

Status: `IMPLEMENTED_TESTING_DEFERRED` (documentation only; implemented, not approved, not verified)
Base: `origin/master` `e271842d170bc74d6912d6040cfda086438be961`. Prompt line numbers were written against `8ffcd12`; every citation below is at `e271842`.
Owner decision D6: **not supplied in writing.** This record was produced on the owner's instruction to execute OPS-03; it adopts the prompt's recommended default (Option A) as a *proposal*. The owner must confirm or change it (see "Approval").
Files changed: this note only. No application, schema or permission change.

## Premise check

- `backend/schema.sql` contains no `ROW LEVEL SECURITY`, `CREATE POLICY` or `BYPASSRLS` (grep over the file returns nothing). Confirmed.
- Of the seven tables the prompt lists for Option B, only `students` has a `school_code` column in its `CREATE TABLE` (`schema.sql:175-185`). `scores`, `attendance`, `class_records`, `weekly_efforts`, `invoices` and `submissions` have none, and no `ADD COLUMN IF NOT EXISTS school_code` exists for them. A policy on those six would have to join through `students` (or `terms`) on every row check.
- The pool is one shared `pg.Pool` and `query()` is `pool.query` (`backend/src/db/pool.ts:60-66`); a transaction helper exists (`withTransaction`, `pool.ts:68-79`) but is used by only two route files (`finance.ts` 2 refs, `learning.ts` 4 refs).

## Current surface (derived from the tree)

Method: every `router.<verb>(` handler under `backend/src/routes/` was listed (114 handlers), then every handler whose SQL selects/updates/deletes a row by a client-supplied id was read by hand. "School predicate" means the SQL or an in-handler comparison ties the target row to the caller's `school_code`. Handlers acting only on the caller's own id (`/auth/*`, `GET /students/me`) are excluded.

### A. Reachable by a non-admin role, id-keyed, **no school check** (3)

| # | Handler | Evidence |
|---|---|---|
| A1 | `POST /students/:id/link-parent` | `students.ts:367-377`: gated by `requirePerm('grades.write')`, which every teacher holds (`utils/rbac.ts:39`). It reads the parent by `parent_id` (`:369`) and inserts into `parent_wards` for `req.params.id` (`:371-374`). No call to `checkTeacherStudentScope`; no school comparison on either id. |
| A2 | `DELETE /students/:id/unlink-parent/:parentId` | `students.ts:380-384`: same permission, `DELETE FROM parent_wards WHERE student_id=$1 AND parent_id=$2` (`:381`), no scope check. |
| A3 | `PUT /learning/topics/:id` | `learning.ts:353-374`: loads the topic by id with no school predicate (`:355`) and updates by id (`:368-373`). The only guard is `checkTeacherContentScope` (`:362`), which compares class name / subject id to the teacher's assignment and never compares `school_code` (`scope.ts:171-192`). |

These three are the same shape as the QA Pass 4 incident documented at `scope.ts:5-12` (a permission that is identical for every teacher in every school). They are findings, not changes made here. A1/A2 would be closed by `checkTeacherStudentScope` (as `PUT/DELETE /students/:id` already do, `students.ts:205`, `:337`); A3 needs a school comparison. Each is a separate task.

### B. Non-admin reachable, compensated by an ownership predicate that is not a school predicate (2)

- `DELETE /learning/materials/:id` — teachers limited to `created_by` (`learning.ts:106-111`).
- `DELETE /learning/topics/:id` — teachers limited to `created_by` (`learning.ts:387-392`).

### C. Admin-only, id-keyed, no school predicate (12)

`admin.ts` applies `requireRole('admin')` to the whole router (`admin.ts:10`). Admin is unrestricted across schools by design (`scope.ts:25-30`, `:51`), so none of these is a defect against the current model; they are counted because they are exactly what a "school-bound admin" model, or RLS, would change.

- `admin.ts:179-192` reissue-activation-code · `:194-236` `PUT /users/:id` · `:238-244` reset-password · `:251-255` approve · `:257-265` `DELETE /users/:id`
- `admin.ts:391` student lookup for `POST /term-pins`; `admin.ts:415-425` `GET /term-pins` (no school filter at all, returns every school's live PINs)
- `academic.ts:170-173` `DELETE /subjects/:id`
- `students.ts:355-364` restore · `:391-408` link-user · `:411-416` unlink-user

(`admin.ts:270-281` `GET /audit-log` filters by `school_code` only if the caller passes one.)

### D. `finance_admin`, global by design (1)

- `PUT /finance/invoices/:id/status` — `finance.ts:152-162`, `UPDATE invoices ... WHERE id=$2`. `finance_admin` has `school_code = NULL` (`students.ts:17-19` comment), so a school predicate cannot be expressed for that role today.

### E. Id-keyed **with** an in-handler school comparison (9)

`learning.ts:920-923` (assessment status), `:1060-1064` (submit), `:1260-1263` (results), `:1288-1291` (submissions), `:1366-1371` (answer review); `academic.ts:104-107` (teacher term update); `scores.ts:291-297` and `:415` (reports, via `authoriseReportAccess`); `attendance.ts:136-144`; `weeklyEfforts.ts:141-155`. These depend on the comparison being present in each handler; none is enforced by the database.

### Totals

| Class | Count |
|---|---:|
| A — non-admin, no school check | **3** |
| B — non-admin, ownership predicate only | 2 |
| C — admin-only, no school predicate | 12 |
| D — finance_admin global | 1 |
| E — school comparison in handler | 9 |

The number that matters for the decision is **A = 3**: three live endpoints reachable by a teacher account where one missed check already means a cross-school write. Class E shows the single-layer model works when the check is written, and class C shows how much of the API is "trust the role" with no school boundary at all. Counts are from a hand read of the listed handlers; a handler that reaches an id through a helper in `utils/` was only counted if the helper was read. Not exhaustive for `db/*.ts` CLI scripts, which are run by the owner and not exposed through the API.

## Options

### Option A (recommended default) — application-only, hardened and documented

- The API is the only DB client. The deployed DB role should have no `SUPERUSER`, no `BYPASSRLS`, no `CREATEROLE`, and accept connections only from the API host. These are **operational settings the repository cannot show**; nothing here claims they are set. `OPS-05` is where they would be inspected with owner credentials.
- TLS validation is already enforced in production (`pool.ts:19-42`, OPS-02).
- Residual risk: one missed `WHERE` is one leak. Section A above is the live evidence.
- Follow-ups that fit this option and are **not** part of this task: close A1–A3 with the existing helpers; decide whether admin should become school-bound (changes class C); give `finance_admin` an explicit school list.

### Option B — RLS on school-scoped tables

- Mechanism: the pool sets `SET LOCAL app.user_id`, `app.role`, `app.school_code` per request; policies read them via `current_setting(..., true)`.
- Tables: `students` (has `school_code`), and `scores`, `attendance`, `class_records`, `weekly_efforts`, `invoices`, `submissions` (no `school_code`; each policy must join to `students`/`terms`, with a performance cost on every row check and the requirement that the join itself not recurse into a policy).
- What breaks without per-route work:
  1. **Every query.** `SET LOCAL` only lasts for a transaction, but the code runs 217 route-level `query(` calls and 23 in `utils/` against the bare pool (`pool.query`), plus 18 `client.query(` calls. Option B means routing all of them through a per-request connection/transaction. That is a change to the data-access layer, not a policy file.
  2. **Global roles.** `admin` (cross-school) and `finance_admin` (`school_code NULL`) need explicit bypass policies, which reproduces the class C/D gaps inside the database.
  3. **Unauthenticated and pre-auth paths** that read tables before a user exists: `/auth/login`, `/refresh`, `/self-claim`, `/self-register`, `/activate`, `/forgot-password/*` (`auth.ts:13`, `:111`, `:301`, `:417`, `:524`, `:621`).
  4. **Background / service-level queries** with no request user: `utils/push.ts`, `utils/email.ts`, `utils/audit.ts`, and all `backend/src/db/*.ts` CLI scripts (imports, resets, ingest). These need a service role that bypasses RLS, which is the same blind spot as Option A for those paths.
  5. **Cross-school reads that are intentional:** admin `GET /students` with a `school_code` override (`students.ts:17-19`).
- Phasing (design only, no policy SQL here): (1) OPS-01 migration ledger first; (2) introduce a request-scoped DB handle behind `query()` with no policy change; (3) close A1–A3 in the app; (4) enable RLS in `FORCE` mode on `students` only, behind a feature flag, with a bypass role for CLI scripts; (5) extend table by table, each with its own tests (currently deferred by the owner).

### Option C — no change, accepted risk

Record as accepted risk with a review date. The owner would need to choose the date; none is invented here.

## Recommendation

Option A now, with the three class-A endpoints treated as the actionable output of this task. Option B is not justified while the DB is reachable only from the API, and its cost (items 1, 3 and 4 above) is larger than the leak surface it would remove (A = 3). Revisit if the database is ever exposed to any client other than the API, or if the number in class A grows.

## Approval

- Chooses D6 and accepts the residual risk: **the owner**.
- Confirms DB role privileges and network reachability (Option A's operational half): **the owner / hosting operator** — not verifiable from this repository.
- No reviewer other than the owner is named in the repository for this decision.

## Deliberately not changed

`schema.sql`, `scope.ts` and every other scope helper, permissions, routes. No RLS, no policy SQL, no migration.

No tests, typechecks, DB, migrations, server or device checks were run. Testing deferred by owner.
