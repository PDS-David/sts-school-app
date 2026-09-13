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

### 0.3 — results of the 0.2 static audit (done this session)

**Root cause hypothesis for the reported "Internal server error" (teacher
edit screen, class+subjects+access-expiry Save) — HIGH CONFIDENCE, needs
DB access to confirm definitively:**

`PUT /admin/users/:id` (`backend/src/routes/admin.ts:124-155`) — the exact
endpoint behind that screenshot — references `revocation_reason` in its
`UPDATE users SET ...` statement. That column was added to `schema.sql`
as a later, incremental `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (see
schema.sql's own "Admin-facing revocation reason" comment block). Nothing
in this repo runs `db:migrate` automatically on deploy — confirmed by
reading `backend/package.json`'s `build`/`start` scripts (only `tsc` and
`node dist/index.js`) and finding no `render.yaml`/`Procfile`/
`postinstall` hook anywhere in the repo. `db:migrate` has always been a
manual, human-triggered step. This session's own attempt to run it failed
with `ENOTFOUND dpg-...` (the Render *internal* hostname, which only
resolves from inside Render's network — the external URL is needed from a
local machine), which is at minimum proof that a manual migrate attempt
was already failing recently for an unrelated reason (wrong connection
string), raising real doubt about whether the newest schema.sql columns
have ever successfully reached production at all.

If `revocation_reason` (or any other recently-added column) is genuinely
missing from production, `PUT /admin/users/:id`'s UPDATE would throw
Postgres error `42703 undefined_column` — which, before this session,
`backend/src/index.ts`'s global error handler did NOT special-case (it
already special-cases `23505`/`23503`/`23502` with clear messages, added
per its own comments after "QA Pass 2" found constraint violations falling
through to a bare 500 — `42703`/`42P01` were simply never added). That
falls straight through to the generic `console.error(err); res.status(500)
.json({error:'Internal server error'})` — an exact match for the
screenshot.

**Wider blast radius if this hypothesis is confirmed — this is not just
the one screen:** grepping every reference to the newest schema.sql
columns (`revocation_reason`, `must_set_security_question`,
`security_question`, `activation_code`, `deleted_at`) across the whole
backend shows they are NOT confined to admin.ts. `auth.ts` reads
`revocation_reason` and `must_set_security_question`/`security_question`
on **every login and refresh** (`POST /auth/login`, `POST /auth/refresh`,
the forgot-password flow). `students.ts` and `scope.ts` filter on
`deleted_at` throughout the student-visibility logic. If any of these
columns are missing in production, the actual impact could be login
itself failing for some/all users, not just this one admin screen — this
needs to be confirmed or ruled out before anything else in this audit.

**Fix applied this session (commit follows):** added `42703`/`42P01`
(undefined_column/undefined_table) as an explicitly-logged case in
`index.ts`'s error handler — deliberately keeps the same generic message
to the client (this is a genuine server bug, not an ordinary thing an
admin should see a specific message for, unlike the existing constraint-
violation cases), but the server-side log now explicitly names this as
"likely an unrun migration" with a pointer back to this file, instead of
being an unlabeled raw Postgres error mixed in with everything else in
the logs.

**THE URGENT NEXT STEP, before anything else in this audit continues:**
someone with the real EXTERNAL Render Postgres URL needs to run, in order:
```
cd backend
export NODE_ENV=production
export DATABASE_URL="<the EXTERNAL Render Postgres URL, not the dpg-... internal hostname>"
npx tsx src/db/checkDrift.ts
```
If it reports missing columns (very likely `revocation_reason` at
minimum, possibly others), run `npm run db:migrate` against that same
`DATABASE_URL` immediately after — per this hypothesis, that alone may
fix both the reported screenshot bug AND any related login failures,
with no further code change needed. Report the exact `checkDrift.ts`
output here, in this file, once run.

### 0.4 — `checkDrift.ts` result (run against production, this session)

```
Creating throwaway schema "_drift_check_1789260208056"…
Applying schema.sql into the throwaway schema…
Introspecting expected (throwaway) vs actual (public) schema…

✅ No drift found — production schema matches schema.sql exactly.

Cleaning up throwaway schema "_drift_check_1789260208056"…
```

**This disproves the 0.3 hypothesis as stated.** `revocation_reason` and
every other column in `schema.sql` (including `activation_code`,
`must_set_security_question`, `security_question`, `deleted_at`) are
confirmed present in production with matching types/nullability/enums/
constraints/indexes — a prior `db:migrate` run (triggered earlier this
session to fix the unrelated `activation_code` issue) applied the entire
file at once, including whatever `revocation_reason`'s migration was,
before this drift check ever ran. Production schema is fully in sync with
`schema.sql` as of this result.

**What this means for the original screenshot (teacher edit → "Internal
server error"):** the missing-column theory is now ruled out. The 500 was
either (a) already fixed as a side effect of that earlier `db:migrate`
run and just hasn't been re-tested in the app yet, or (b) has a different
root cause entirely (application logic in `PUT /admin/users/:id`, not a
schema mismatch) that 0.2's static code audit didn't catch. **Next step,
before continuing to Parts 1–4: re-attempt the exact failing action in
the live app (edit that same teacher's class/subjects/access-expiry and
Save) and report whether it now succeeds.** If it still fails, capture
the exact new error and check Render's live logs for the specific
Postgres/JS error at that moment — the code-level cause at that point is
NOT a schema drift issue and needs to be traced directly in
`admin.ts`'s `PUT /users/:id` handler instead.

### 0.5 — CONFIRMED FIXED — Part 0 closed

Project owner re-attempted the exact failing action in the live Android
app (same teacher, PRY 1, same subjects, access-expiry field) —
**saves successfully now.** Root cause was (a), not (b): the earlier
`db:migrate` run (triggered to fix the unrelated `activation_code` issue)
applied `revocation_reason`'s migration at the same time, and that alone
resolved this screenshot's bug with no code change needed. No further
action required on this specific issue.

**Part 0 is fully closed as of this result.** Both axes (0.1 production-
vs-schema.sql, 0.2 code-vs-schema.sql) have been checked; the one concrete
finding from 0.2 has been confirmed fixed in production. Proceeding to
Part 1.

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

### 1.1 — In progress (this session) — major discovery first

Before auditing, confirmed the Topics/PIN-gating/curriculum-grounding
feature (previously thought unbuilt, per an earlier session's spec doc)
is now **fully implemented** — `schema.sql`'s `topics` table has
`term_label`/`source_reference`/`order_index`/`source_file` (added via
incremental `ALTER`s, easy to miss by only reading the base `CREATE
TABLE`), `term_access_pins` exists, `backend/src/db/ingestTopics.ts` is a
real curriculum importer, and `GET /learning/topics`
(`backend/src/routes/learning.ts:112-221`) implements real per-student
lock/unlock logic (first ordered topic per `subject_id`+`class_name`+
`term_label` group locked until PIN redemption; every later topic locked
until the previous one is `passed=true`). `POST /topics/:id/complete`
(`learning.ts:296+`) grounds Brainee's generated summary/questions in
`source_reference` when present, with `source_reference` itself shown as
a labeled fallback if generation fails. This closes the loop on the
project owner's original question this session about whether uploaded
curriculum files were ever integrated — they now are, end to end.

**Screens checked, API calls confirmed real (not dead/mismatched):**
- `SubjectTopicsScreen.tsx:22` → `GET /learning/topics?subject_id=...` ✅ matches `learning.ts:112`
- `TopicDetailScreen.tsx:27` → `POST /learning/topics/:id/complete` ✅ matches `learning.ts:296`
- `TermPinRedeemScreen.tsx:20` → `POST /learning/term-pins/redeem` ✅ matches `learning.ts:475`
- `StudentLearningScreen.tsx:21` → `GET /academic/subjects` ✅ matches `academic.ts:150`

**Lock-state UI confirmed correct, not a dead-button case:**
`SubjectTopicsScreen.tsx` sets `disabled={locked}` on each topic row
(line 72) with a distinct locked visual style (lock icon, muted color) —
tapping a locked topic genuinely does nothing, by design, rather than
erroring.

**"Coming soon" placeholders confirmed honest, not dead buttons:**
`ParentActivitiesScreen.tsx` (Upcoming Tests/Calendar/School Events),
`TeacherMoreScreen.tsx` (Analytics/Calendar), and
`StudentProfileScreen.tsx` (Badges) all set `screen: null` for these
entries, and their `onPress` handlers guard with
`disabled={!it.screen}` / `it.screen && navigation.navigate(...)` —
confirmed in `ParentActivitiesScreen.tsx` — so these correctly show as
inert placeholders rather than throwing or navigating to a broken screen.

**Not yet done — remaining for Part 1:**
- Full pass over the rest of the student screen set (`StudentHomeScreen`,
  `StudentAssessmentsHomeScreen`, `AssessmentsScreen`,
  `TakeAssessmentScreen`, `AssessmentResultsScreen`, `MyResultsScreen`,
  `SessionReportScreen`, `WeeklyEffortsScreen`, `ChatsScreen`/
  `ChatThreadScreen`, `MaterialsScreen`, `StudentProfileScreen`'s other
  tiles) — same method: every API call traced against a real route,
  every TODO/FIXME noted, every error path checked for a bare
  alert()-style popup vs proper handling.
- `StudentSelfClaimScreen` and `ActivateAccountScreen` (guest-phase
  screens, Task B/C flows) haven't been traced yet either, though they
  aren't strictly "student role" screens (reachable pre-login).

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
