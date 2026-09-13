# APP_WIDE_AUDIT.md

Mirrors the audit that was done on the sister app (AISchoolOnair,
`PDS-David/edu-platform`) this same session — systematic, evidence-based,
one section per concern, nothing reported without reading the actual code
or running an actual check. Ordered by explicit request: **database
compatibility first, then each role, one at a time.** Whoever picks this
up next — read `AGENT_CONTINUATION.md` first (this repo's own "how to work
here" doc), then this file.

**Rule for every finding in this document:** cite the actual file/line or
the actual command output that proves it. A suspicion is not a finding.

---

## Part 0 — Database Compatibility Audit (DO THIS FIRST, per explicit request)

This has TWO independent axes, and both must be checked — a clean result
on one says nothing about the other:

### 0.1 — schema.sql vs live production (tooling already exists — RUN IT)

`backend/src/db/checkDrift.ts` (added last commit, `db:check-drift`) already
does this properly: applies `schema.sql` into a disposable throwaway schema
in the same database, diffs it against `public` via `information_schema`,
reports missing/extra tables, columns, enums, constraints, indexes, and
type/nullability mismatches. Read its own header comment before running —
it explains exactly why it's safe against production (read-only against
`public`, drops its own throwaway schema in a `finally`).

**This has NOT been run yet as of this writing.** Whoever has real
production DB credentials (the EXTERNAL Render Postgres URL, not the
internal `dpg-...` hostname — that only resolves from inside Render's own
network, confirmed by an actual ENOTFOUND failure this session) needs to
run:
```
cd backend
export NODE_ENV=production
export DATABASE_URL="<the EXTERNAL Render Postgres URL>"
npx tsx src/db/checkDrift.ts
```
Report the full output verbatim in this file under a new `### Drift check
results (date)` heading. Exit code 1 means real drift was found — treat
every non-informational line as a bug to fix (`npm run db:migrate` for
missing tables/columns/enums/indexes; missing constraints need a manual
`ALTER TABLE ... ADD CONSTRAINT`, since `checkDrift.ts` won't auto-fix
anything, only report).

### 0.2 — schema.sql vs application code (NOT covered by checkDrift.ts — do this by hand)

`checkDrift.ts` only proves production matches `schema.sql`. It says
nothing about whether the TypeScript code (routes, `scope.ts`, `rbac.ts`,
any raw SQL string anywhere in `backend/src/`) references a table/column/
enum value that was never in `schema.sql` at all, or has silently drifted
from what `schema.sql` says (e.g. assumes a column is nullable when
`schema.sql` says `NOT NULL`, or queries an enum value that isn't in the
type). This exact class of bug caused the `activation_code` 500 mentioned
in `checkDrift.ts`'s own header comment — but that incident was a
code-vs-*production* mismatch; a code-vs-*schema.sql* mismatch is a
DIFFERENT, equally real risk (schema.sql could be internally self-
consistent and match production perfectly, while the actual query code
still references something that was never defined anywhere).

**Method:**
1. Read `schema.sql` in full (737 lines — not long) and build a mental (or
   written) map of every table, its columns with nullability, every enum
   type and its values, and every foreign key.
2. Grep every route file (`backend/src/routes/*.ts`) and every util
   (`scope.ts`, `rbac.ts`, `parentProvisioning.ts`, etc.) for raw SQL
   (`pool.query(...)`, template-literal SQL) and cross-check every
   table/column name referenced against step 1's map.
3. Specifically check: every `INSERT`/`UPDATE` against a `NOT NULL` column
   — does the code path guarantee a value is always provided? (The
   `activation_code` incident was exactly this pattern — worth grepping for
   it specifically as a known-risky shape.)
4. Specifically check every enum comparison/insert (`status = 'x'`,
   `WHERE type = $1` where `$1` is app-supplied) against `schema.sql`'s
   actual enum values — a typo'd or renamed value here fails at query time,
   not at compile time, since this is raw `pg`, not a typed ORM.
5. Cross-check `backend/src/types/*.ts` (if any TypeScript interfaces model
   DB rows) against `schema.sql` too — a stale interface won't cause a
   runtime DB error, but will cause the app to silently expect a field
   that either doesn't exist or has a different shape than the type claims.

Report every finding with the exact file:line and the exact schema.sql
line it contradicts. This is the part explicitly asked to be **implemented
now**, not just planned — see below.

---

## Part 1 — Student Role Audit

Every screen a `student` role can reach in `mobile/src/screens/` (check
`mobile/src/navigation/` or equivalent for the actual route-to-role
mapping — do not assume from filenames alone), cross-referenced against
the actual backend routes it calls. Same method as the AISchoolOnair
audit: for each screen — alert()-style jarring popups vs proper in-app
error handling, silently swallowed failures, dead/mismatched API calls
(compare every `fetch`/api-client call in the student-facing screens
against the real registered Express routes in `backend/src/routes/*.ts`),
TODO/FIXME markers, and anything flagged "coming soon" in `TODO.md` that
still has a live, clickable entry point in the app (a dead button is worse
than a missing feature — a missing feature is honest, a dead button looks
broken). `TODO.md` already flags several student/parent screens as
"coming soon" — confirm which ones actually still render as if live vs.
correctly show a coming-soon state.

## Part 2 — Parent Role Audit

Same method as Part 1, scoped to `parent`. Pay particular attention to
`parentProvisioning.ts` (85 lines — how a parent account actually gets
created/linked to a student) and any cross-school scoping, since
`AGENT_CONTINUATION.md`'s own history mentions a past cross-school
messaging bypass fix — check whether the same class of bug (parent sees
another school's or another child's data) could recur anywhere else parent
data is scoped.

## Part 3 — Teacher Role Audit

Same method, scoped to `teacher`. `rbac.ts` (87 lines) is short enough to
read in full — confirm every permission it grants/denies for `teacher`
actually matches what the teacher-facing screens attempt to do (a screen
that lets a teacher attempt an action `rbac.ts` will reject is a dead-end
bug, even if the backend correctly blocks it — the frontend shouldn't
offer an action that always fails). This is also where the screenshot bug
from this session (Internal server error on saving a teacher's assigned
class/subjects + access-expiry) lives — trace and fix the actual cause of
that 500 as part of this pass, not as a separate task, since it's a live,
already-reported instance of exactly this category.

## Part 4 — Admin Role Audit

Same method, scoped to `admin`. This role has the widest surface
(`admin.ts` route file, finance, academic setup, staff activation codes,
revocation) — budget the most time here. Cross-check every admin action
against `rbac.ts` and `scope.ts` the same way as Part 3.

---

## Verification standard for every part (non-negotiable, matches the AISchoolOnair audit's own standard)

- Every finding is read directly from the actual current code, not
  inferred from a filename, a comment, or what a doc claims.
- Any fix must be verified before being called done: `npm run build`
  (TypeScript compiles) at minimum for backend changes; for mobile
  changes, at minimum confirm the file's imports/exports are consistent
  (no bundler here to run standalone, unlike edu-platform's `vite build` —
  check if this repo has an equivalent fast-fail check before assuming
  none exists).
- Re-fetch `origin/master` immediately before every build and every commit
  — this repo is under active multi-session development (evidenced by the
  TODO.md handoff entries and this session's own commit history); assume
  it has moved since you last pulled.
- If a session runs out of room mid-part, leave a clear, explicit status
  in this file (which sub-items are done, which aren't) rather than a
  silent partial state — same rule Part 0 itself states above for the
  drift-check results.
