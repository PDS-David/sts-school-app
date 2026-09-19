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

### 1.2 — Remainder of Part 1 (this session)

**All student-facing API calls traced against the real route map
(built from every `router.get/post/put/delete` across all of
`backend/src/routes/*.ts`, not assumed):**

- `StudentHomeScreen.tsx` → `/learning/assessments`, `/learning/materials`,
  `/students/me`, `/scores/report/:id` — all real, all match.
- `StudentAssessmentsHomeScreen.tsx`, `StudentProfileScreen.tsx` — pure
  navigation/display screens, no direct API calls (confirmed by grep
  returning nothing, not assumed from the filename).
- `AssessmentsScreen.tsx` → `/learning/assessments` (get+put) — real,
  match. Admin-only actions ("View Results", "Publish") are gated behind
  `{isAdmin && ...}` (line 86); students see a different button entirely
  (`!isAdmin` branch) — confirmed no live student path can trigger them.
- `TakeAssessmentScreen.tsx` → submissions/:id/answers,
  assessments/:id/questions, assessments/:id/submit — all real, all
  covered by `assessments.take`/`assessments.read`, which `student` has.
- `MyResultsScreen.tsx`, `SessionReportScreen.tsx` → both resolve to
  `/scores/report/:id` / `/scores/session-report/:id` — real routes; these
  have no `requirePerm` middleware but do manual ownership checks inside
  (per the routes' own comments) rather than the permission-table pattern
  — consistent with how they were built, not a gap.
- `ChatsScreen.tsx`/`ChatThreadScreen.tsx` → `/messages/contacts`,
  `/messages/conversation/:other`, `/messages` — real, match
  `messages.read`/`messages.write`, which `student` has.
- `MaterialsScreen.tsx` → read calls match `materials.read`; the
  write/delete actions are gated behind `canWrite = role==='teacher' ||
  role==='admin'` (confirmed at the two JSX sites, not just the
  variable's existence) — no live student path can trigger them.
- `BraineeChatScreen.tsx` → uses the `askBrainee()` wrapper
  (`api/brainee.ts`), not raw `api.` calls directly (why the initial grep
  missed it) — traced through to `POST /ai/chat`, a real route with no
  role restriction, fine for `student`.

**Confirmed dead/unreachable registration (not a live bug, but worth a
cleanup note):** `AssessmentResultsScreen` is registered in the student's
`AssessmentsStackNavigator` (`StudentTabs.tsx`) and calls
`GET /learning/assessments/:id/results`, which requires `aiResults.read`
— a permission `student` does NOT have (only `admin`, via the `'*'`
wildcard in `rbac.ts`). However, the only button that navigates there
(`AssessmentsScreen.tsx:95`) is itself gated `{isAdmin && ...}`, so no
student can actually reach this screen through the UI. Low-priority
cleanup: this screen doesn't need to be registered under the student
stack at all, since nothing there can ever navigate to it.

**Confirmed LIVE BUG, found and fixed this session:**
`WeeklyEffortsScreen.tsx` (registered in student's `ProfileStackNavigator`)
rendered its feedback-compose UI (text input + "Send" button) unconditionally
for every role. `sendFeedback()` calls `POST /weekly-efforts/:id/feedback`,
which requires the `weeklyEfforts.feedback` permission — granted to
`parent`/`teacher`/`admin` in `rbac.ts`, but explicitly NOT to `student`
(students only have `weeklyEfforts.read`). A student tapping "Send" on
their own weekly-effort feedback thread would get a 403 — a genuine
dead-end, unlike the `AssessmentResults` case above (this one WAS
reachable, since the read/toggle view has no permission gate and is
shown to everyone). **Fix applied:** added `canGiveFeedback = isParent ||
isTeacher` and gated the compose row behind it — students can still read
existing feedback (unaffected, matches their `weeklyEfforts.read` grant)
but no longer see an input that would fail. Verified `npx tsc --noEmit`
clean in `mobile/` after the change.

**Part 1 is now substantially complete.** Every student-reachable screen
with a direct API call has been traced; one live permission-mismatch bug
found and fixed, one dead navigator registration noted for later cleanup.
Not covered: `StudentSelfClaimScreen`/`ActivateAccountScreen` (guest-phase,
pre-login — arguably out of scope for a "student role" audit specifically,
since they run before any role is assigned; worth a separate pass if
picked up later).

### 1.3 — Student academic-needs completeness check (this session, separate axis from 1.1/1.2)

Explicit project-owner request: not "is every button correct" (1.1/1.2's
question) but "can a student meet ALL their academic needs through this
app." Checked every core academic need a student would plausibly have
against what's actually built and reachable:

- Curriculum content (topics, PIN-gated, Brainee-grounded) — ✅ built (1.1)
- Assessments (take, submit, see own score) — ✅ built (1.1)
- Term results / full-session report — ✅ built (1.1)
- Study materials — ✅ built (1.1)
- Messaging a teacher for help — ✅ built (1.1)
- Brainee AI help (chat/explain/notes/hint) — ✅ built (1.1)
- Weekly effort visibility — ✅ built (1.1)

**Real gap found and fixed:** `StudentProfileScreen.tsx`'s "Attendance"
tile said *"Not available yet for students — ask your teacher"* — but
`GET /scores/report/:student_id` (`scores.ts:295-329`) already returns
`attendance: { days_present, days_opened }` on every call, and
`MyResultsScreen.tsx` (the screen the adjacent "Progress" tile already
points to) already renders it (`MyResultsScreen.tsx:146-147`,
`RowItem label="Days Opened"` / `"Days Present"`). The data and the
display surface both already existed — only the Profile tile was wrong,
telling students to bother their teacher for something already sitting
in their own Results screen. **Fixed:** tile now points to the same
`MyResults` destination as "Progress," with accurate sub-text. No backend
change needed — this was a frontend-only inaccuracy.

**Checked and confirmed deliberate, NOT a gap:** report-card print/export
is explicitly admin+parent-only, per the screen's own comment — *"the
school's own decision was that printing/exporting the finished document
is an admin/parent action, not something... the student themselves does
from here."* A student can view their full report on-screen but not
print/export their own copy. Documented as intentional in the code
itself; not changed.

**Built this session, per explicit project-owner spec:** a self-study
timetable — student-only, deliberately separate from physical-classroom
attendance (now documented in `AGENT_CONTINUATION.md`'s "Confirmed product
intent" section). Design, confirmed with the project owner before building:
subject-priority is automatic (weaker recent `scores.total` → more daily
minutes, not admin-set or self-ranked), the timetable is a simple daily
minutes-split (not a weekly clock-time grid), and a student can toggle
individual subjects out of their plan.

- **Schema:** `student_study_settings` (one row per student, `daily_minutes`)
  and `student_study_subjects` (per-subject include/exclude toggle; absence
  of a row = included by default). Placed in `schema.sql` right after
  `term_access_pins`, matching the file's existing self-study-feature
  grouping.
- **Backend** (`learning.ts`): `GET /study-plan` computes the actual
  allocation at read time (never stored) — subject list is `DISTINCT
  subject_id` from `topics` for the student's own `class_name`+
  `school_code` (reusing the real curriculum data, not a new class-subject
  mapping table); weight per subject is `max(100 - avg_score, 15)` when a
  recent score exists, or a neutral `50` when it doesn't (so an ungraded
  subject isn't starved just for lack of data); `PUT /study-plan/settings`
  and `PUT /study-plan/subjects/:id` are both scoped to the caller's own
  student record via the same `SELECT id FROM students WHERE user_id=$1`
  pattern `term-pins/redeem` already uses, and the subject-toggle route
  rejects any `subject_id` that isn't actually part of the student's class
  curriculum.
- **Mobile:** new `StudyPlanScreen.tsx` (daily-minutes input + per-subject
  toggle switches + live allocated-minutes display, sorted highest-priority
  first), registered in `StudentTabs.tsx`'s `LearningStackNavigator`,
  reachable via a new banner card on `StudentLearningScreen.tsx` ("My Study
  Timetable — Let Brainee split your day across subjects").
- Verified `tsc --noEmit` clean in both `backend/` and `mobile/` after
  every change, per this file's own verification standard.

## Part 2 — Parent Role Audit

Same method as Part 1, scoped to `parent`. Pay particular attention to
`parentProvisioning.ts` (85 lines — how a parent account actually gets
created/linked to a student) and any cross-school scoping, since
`AGENT_CONTINUATION.md`'s own history mentions a past cross-school
messaging bypass fix — check whether the same class of bug (parent sees
another school's or another child's data) could recur anywhere else parent
data is scoped.

### 2.1 — CONFIRMED LIVE BUG, found and fixed this session

`parentProvisioning.ts:findOrCreateParent()`'s existing-parent lookup was
scoped `WHERE role='parent' AND school_code=$1 AND RIGHT(...phone...,10)=$2`
— de-duplication only within one campus. STS is dual-campus
(`school_code` `'primary'`/`'secondary'`, confirmed in `seed.ts`), so a
parent with one child at each campus would get **two separate,
disconnected parent accounts** instead of one — each seeing only the one
child enrolled through it, with no way to unify them after the fact.

This directly contradicts the read side, which is already fully
cross-campus-aware and clearly built assuming one parent account can span
both schools:
- `GET /students/wards` (`students.ts:62-75`) joins `parent_wards` for the
  caller's own id with **no `school_code` filter at all**.
- `getMessageableUsers()`'s parent branch (`scope.ts:401-430`, itself a
  "Pass 21" widening noted in its own comment) explicitly reaches "any
  teacher or admin at any school where this parent has a ward" via
  `SELECT DISTINCT st.school_code FROM students st JOIN parent_wards pw...`
- `GET /finance/invoices` and `GET /scores/report/:student_id` both scope
  parent access purely via `parent_wards`, no `school_code` involved.

So the read side already assumes "one parent, wards across any school" —
the write side was quietly breaking that assumption at the one place a
cross-campus family actually gets created. Same underlying class of bug
`AGENT_CONTINUATION.md` flags as previously fixed in messaging (a scoping
check applied inconsistently across otherwise-related code paths), just in
provisioning instead of a read query this time.

**Fix applied:** dropped the `school_code=$1` filter from the existing-parent
lookup — now matches purely on phone-number suffix across all schools in
this deployment (all belonging to the one real institution, Sow the Seed
Schools — not a multi-tenant SaaS with unrelated third parties, so a
suffix-collision risk here is the same acceptable level of "extremely
unlikely" already accepted by the adjacent username-collision loop a few
lines below, just widened in scope, not a new risk category). The
`school_code` param is still used for the fallback INSERT when truly
creating a new parent account (their "home" school at first creation —
harmless metadata, not load-bearing elsewhere for parents per every read
path checked above). Verified `npm run build` clean in `backend/` after
the change.

### 2.2 — Everything else checked, confirmed correct (no bug)

- `mobile/src/navigation/ParentTabs.tsx` — full screen inventory: only
  `ParentHomeScreen.tsx` makes a direct API call
  (`GET /scores/report/:id`, confirmed real and correctly ownership-checked
  via `parent_wards` at `scores.ts:249-253`, no `school_code` involved).
  `ParentProgressScreen.tsx`, `ParentActivitiesScreen.tsx`,
  `ParentProfileScreen.tsx` are pure navigation/display screens (confirmed
  by grep returning nothing, not assumed from filename — same check Part 1
  used).
- `WeeklyEffortsScreen.tsx`'s parent path: `canGiveFeedback = isParent ||
  isTeacher` (the exact flag Part 1 added for the student-side fix)
  correctly shows the feedback-compose UI to parents; `efUrl` correctly
  scopes to `selectedWardId` from `WardContext` rather than blending
  siblings; backend (`weeklyEfforts.ts:122-124, 154-155`) independently
  enforces the same `parent_wards` scoping regardless of what the client
  sends — defense in depth confirmed, not just a client-side filter.
- `GET /finance/invoices` (`finance.ts:56-79`) — parent scoping via
  `parent_wards` subquery, `student_id` query param can only narrow within
  that set, never widen it (confirmed by reading the actual SQL
  concatenation, not assumed from the comment above it).
- Messaging (`messages.ts`, `scope.ts`) — the cross-school parent-messaging
  bug `AGENT_CONTINUATION.md` references is confirmed already fixed
  ("Pass 21" widening); parent can reach admin and every teacher at any
  school where they have a ward, not just their ward's specific
  class/subject teacher. This also means the "parent messaging asymmetry"
  item in the project's general backlog notes is already resolved, not
  still outstanding.
- `ChangePasswordScreen.tsx`/`SecurityQuestionSetupScreen.tsx` — role-agnostic
  shared components, already traced earlier this session for the
  forced-flow bug report; nothing parent-specific to add.

**Part 2 is closed.** One real cross-campus provisioning bug found and
fixed; every other parent-facing screen and route traced and confirmed
correct.

## Part 3 — Teacher Role Audit

**Pre-Part-3 note (project owner confirmed, this session):** the
"Internal server error" screenshot referenced below is already confirmed
fixed (see 0.5 — the `revocation_reason` migration was the actual cause,
confirmed by a real re-test in the live app). Part 3 does not need to
re-diagnose that specific incident; still worth a quick sanity check that
`PUT /admin/users/:id`'s teacher-editing path has no other issue, but it is
NOT starting from "unfixed."

**Also this session, ahead of Part 3, per explicit school-owner policy:**
teacher accounts no longer get the forced security-question setup step at
fresh login (`auth.ts` `POST /login` now suppresses
`must_set_security_question` specifically for `role==='teacher'`) — a
teacher who forgets their password has admin reset it directly, so
self-service recovery via security question doesn't apply to this role.
Other roles unaffected. Worth keeping in mind during Part 3: any
teacher-facing screen or flow that assumes/checks security-question state
should be read as "never applicable to teacher," not as a gap.

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

### 3.1 — Two fixes made ahead of the formal pass, per explicit school-owner request

Not audit findings in the "traced and found broken" sense — done first
because the owner asked for them directly, documented here for
continuity:
- `auth.ts` `POST /login` no longer surfaces `must_set_security_question`
  for `role==='teacher'` (teacher password resets are admin-only by
  policy; self-service recovery doesn't apply to this role).
- `TeacherMoreScreen.tsx`'s "Security Question — Used to reset your
  password if you forget it" menu item removed (would have been actively
  misleading given the above), along with the now-unreachable local
  `SecurityQuestionSetup` route registration in `TeacherTabs.tsx`'s
  `MoreStack` (root-level registration in `RootNavigator.tsx` untouched,
  still used by other roles).

### 3.2 — Full teacher-facing surface traced, confirmed correct (no live bugs)

Every screen in `TeacherTabs.tsx` checked against `rbac.ts`'s teacher
grants (`materials.*`, `topics.*`, `grades.*`, `students.read`,
`weeklyEfforts.*`, `messages.*`, `attendance.*`, `classRecord.*`) and the
actual backend route it calls:

- `TeacherDashboardHomeScreen.tsx`, `TeacherClassesScreen.tsx` — no
  coming-soon/TODO/FIXME markers (grep returned nothing, not assumed).
  `Dashboard`'s two calls (`/academic/terms/current`, `/students`) are
  real, unguarded reads, fine for `students.read`.
- `StudentDetailScreen.tsx` (shared with admin) — every `/admin/...`-
  prefixed call (`term-pins`, `student-logins-without-link`,
  `parent-logins`) and every parent-link/unlink action is correctly gated
  `{isAdmin && ...}` in the JSX, not just conditionally fetched; confirmed
  by reading each gate, not inferring from one. The one teacher-reachable
  destructive action, `deleteStudent()` (gated `{isTeacher && ...}`, line
  240), calls `DELETE /students/:id`, which requires `grades.write`
  (teacher has it) and is scope-checked server-side via
  `checkTeacherDeleteScope` — itself an alias to `checkTeacherStudentScope`,
  which already carries its own documented fix from a prior live-testing
  pass (a subject-only teacher, or a teacher naming a class/school not
  theirs, is rejected). Not a new finding — confirms a prior fix is still
  in effect, not that anything is currently broken.
- `AttendanceScreen.tsx` — `PUT /attendance/bulk` and `PUT
  /academic/terms/:id` (the days-opened/next-term-begins update) both
  match what the backend actually allows a teacher to touch;
  `academic.ts:92-108` explicitly rejects a teacher attempting to send
  `name`/`academic_year`/`is_current`/`start_date`/`end_date` through this
  route and re-checks the term belongs to the teacher's own school — the
  mobile screen never sends those fields, so this is a defended boundary,
  not an exposed one.
- `ScoreEntryScreen.tsx` — `POST /scores/bulk` and the in-screen "Add
  Subject" action (`POST /academic/subjects`) both check out:
  `academic.ts:159` deliberately allows `requireRole('admin','teacher')`
  here (a teacher entering scores plausibly needs to add a missing
  subject on the spot) — confirmed intentional via the route's own scoping
  of `school_code` to the teacher's own, not a gap.
- `ClassLockScreen.tsx` — `PUT /academic/class-locks` restricts a teacher
  to locking only their own `assigned_class` (`academic.ts:234-247`,
  explicitly documented as narrower than other teacher-write checks
  because locking is more disruptive than a single record write); the
  mobile screen mirrors this (`noClassAssigned` state for a subject-only
  teacher with no `assigned_class`), so no dead button for that case.
- `WeeklyEffortsScreen.tsx` teacher branch (`isTeacherRole`) — already
  covered in Part 1/2's shared review of this file; teacher's own
  create-effort form (`POST /weekly-efforts`) and roster-loading calls
  (`/students`, `/academic/classes`, `/academic/subjects`) are all real,
  ungated by anything teacher lacks.
- `MaterialsScreen.tsx` write-gate (`canWrite = role==='teacher' ||
  role==='admin'`) — already confirmed in Part 1; consistent with
  `materials.write` being granted to teacher.

**Part 3 is closed.** No live bugs found in this pass beyond the two
pre-existing items already resolved earlier this session (the
`revocation_reason` 500, confirmed fixed at 0.5; today's teacher
security-question policy change, not a bug fix but a deliberate product
change). Every teacher-facing screen's actions were checked against both
the actual backend permission and, where relevant, actual scope
enforcement — no dead buttons, no screen offering an action the backend
would reject, no unscoped cross-class/cross-school write found.

## Part 4 — Admin Role Audit

Same method, scoped to `admin`. This role has the widest surface
(`admin.ts` route file, finance, academic setup, staff activation codes,
revocation) — budget the most time here. Cross-check every admin action
against `rbac.ts` and `scope.ts` the same way as Part 3.

### 4.1 — Permission surface (`rbac.ts`, confirmed by reading)

`admin: ['*']` — unrestricted, including `questions.*`/`assessments.*`/
`aiResults.read`/`aiGrading.override`, none of which any other role gets.
One deliberate carve-out, confirmed by its own comment: `admin` does
**not** get finance access despite the `'*'` wildcard — `routes/finance.ts`
checks `req.user.role === 'admin'` explicitly and blocks it, gated instead
to the separate `finance_admin` role (`rbac.ts:60`), because relying on
`requirePerm('finance.*')` would have let `'*'` satisfy it by accident.
Confirmed this boundary is real by reading `finance.ts`'s own role check,
not just trusting the `rbac.ts` comment. `finance_admin` is out of scope
for this pass (it's a distinct, non-overlapping role) — not audited here.

### 4.2 — Live bug found and fixed: Edit User silently blanks phone numbers

**Root cause, all three links confirmed by reading the actual code:**

1. `GET /admin/users` (`backend/src/routes/admin.ts`, pre-fix) never
   selected `u.phone` (or `u.email`) at all — only
   `id,username,full_name,role,school_code,assigned_class,is_active,
   must_change_pw,access_expires_at,created_at,pending_activation,
   assigned_subject_ids`.
2. `AdminUsersScreen.tsx`'s `openEdit()` therefore had no real phone value
   to seed the form with, and hardcoded `phone: ''` unconditionally.
3. `handleSave()` spreads the *entire* form into the `PUT
   /admin/users/:id` payload unconditionally (`{ ...form, full_name:
   form.username }`), and the backend's own update statement is
   `phone=COALESCE($6,phone)` — which treats an empty string as a real,
   intentional value to write, not as "field not sent." An empty string
   is not `NULL`, so `COALESCE` never falls back to the existing value.

**Net effect:** tapping the pencil icon to edit *any* user for *any*
reason (toggling role, class, expiry, anything) and hitting Save silently
overwrote that user's phone number with an empty string — every time,
regardless of whether the admin touched the Phone field. This has been
happening since the Phone field was added to this form; there is no way
to tell from the DB alone how many real phone numbers this has already
erased.

**Fix applied this session (commit follows):**
- `admin.ts`: `GET /users` now also selects `u.phone,u.email`.
- `AdminUsersScreen.tsx`: `openEdit()` now seeds `phone: u.phone ?? ''`
  from the real fetched value instead of hardcoding `''`; the `User`
  interface gained the corresponding `phone?: string | null` field.
- Verified with `tsc --noEmit` (clean) for the backend; the mobile change
  is traced by hand (no bundler build step in this repo) — `phone` is now
  populated end-to-end: selected by the list query, present on the `User`
  type, read into form state on edit, and unchanged if the admin doesn't
  touch the field.
- `email` was added to the same `SELECT` while touching this query since
  it has the identical structural exposure (accepted by `PUT
  /admin/users/:id`'s `email=COALESCE($7,email)` but never selected by
  `GET /users`) — no UI currently edits `email` (it was deliberately
  removed as a form field per this screen's own comment), so it isn't
  actively being blanked today, but the same landmine exists if an
  `email` field is ever added back to this form without also fixing the
  `GET` query. Flagging here rather than silently "fixing" a UI that
  doesn't exist yet.

**Not fixed, flagged only (lower severity, same root pattern):** the Edit
form also unconditionally sends `school_code` and `assigned_class` back
through the same always-COALESCE update, seeded from `u.school_code ?? ''`
/ `u.assigned_class ?? ''`. For `admin`/`finance_admin` accounts (whose
`school_code` is meant to stay `NULL`, per `AGENT_CONTINUATION.md` §3 and
the `(school_code && role==='admin') ? ... : user.school_code` pattern
used throughout `academic.ts`/`learning.ts`/`students.ts`), editing one of
these accounts via this same modal would write `school_code=''` instead
of leaving it `NULL`. Traced this through: every route using that
fallback pattern already treats a falsy `sc` (`''` or `NULL`) the same
way in the `WHERE school_code=$1` clause — both match zero rows — so this
does not currently change observable behavior anywhere grepped
(`academic.ts`, `learning.ts`, `students.ts`, `admin.ts`'s own Excel
export). Still real data-integrity drift from the schema's intent (`NULL`
vs `''` are not the same value), so worth a follow-up pass scoped to
"strip fields the current role doesn't use before building the PUT
payload" in `AdminUsersScreen.tsx`'s `handleSave()` — not done in this
pass to keep the fix scoped to the confirmed, currently-active bug above.

### 4.3 — Rest of `admin.ts` traced, no other live bugs found

- `POST /users` (both the teacher admin-sets-password path and the Task C
  activation-code path), `POST /users/:id/reissue-activation-code`,
  `POST /users/:id/reset-password`, `DELETE /users/:id` (blocks
  self-delete and admin-delete, both confirmed by explicit checks in the
  route) — all traced against their mobile callers in
  `AdminUsersScreen.tsx`; every payload shape matches what the route
  expects, no dead buttons.
- `PUT /users/:id`'s `revocation_reason`/`is_active`/`access_expires_at`/
  `clear_expiry` handling (the Part 3-era fix) re-checked here from the
  admin side: `handleToggle()` sends only `{ is_active: !u.is_active }` —
  a minimal, targeted payload that does *not* trigger the phone/
  school_code issue above, since it doesn't spread the form. Only the
  full Edit-modal Save path is affected.
- Term PINs (`POST`/`GET /admin/term-pins`) and class codes
  (`POST`/`GET /admin/class-codes`) — both traced against
  `AdminTermPinsScreen.tsx`/`AdminClassCodesScreen.tsx`; upsert-on-conflict
  behavior matches the routes' own documented intent (re-issuing replaces
  and clears prior redemption/lockout state, doesn't accumulate rows).
- `GET /audit-log`, `POST /log-email`, `GET /export/excel` — the
  Excel-export `school_code` requirement (QA Pass 8's own documented fix)
  re-confirmed still in place and correct; no regression found.

**Part 4 is closed.** One real, currently-active data-loss bug found and
fixed (phone blanking on every Edit User save); one related but
currently-inert data-integrity issue flagged for a future pass; everything
else in `admin.ts` traced against its mobile callers with no further live
bugs.

---

## Part 5 — AdminUsers blank/collapsed-row bug (long-standing, now resolved)

Not part of the original 4-part per-role plan — a separate, long-standing
bug the project owner had already been living with before this audit
started, surfaced again during live production testing. Documented here
in full because it took three attempts across many commits to actually
resolve, and the final root cause is a real, reusable lesson for this
codebase's shared layout components.

**Symptom:** Admin → More → Users showed correctly-sized white card rows
with no visible name, badges, or (later) only a tiny sliver of colored
content peeking out at the very bottom edge of each row.

**Attempt 1 — `width: '100%'` on `PageContainer`** (commit `8754734`,
another session): diagnosed as `PageContainer` having no explicit width
under the FlatList's `alignItems: 'center'`. A real bug, correctly fixed
in principle — but insufficient alone, as later measured data proved.

**Attempt 2 — `removeClippedSubviews={false}`** (commit `88af7e0`, this
session): a reasonable theory given Android's different default for this
prop and its known interaction with elevated/shadowed views, but the
project owner confirmed "still same" after rebuilding — ruled out.

**Attempt 3 — actual measured data, then the real fix** (commits
`5969fc4` → `ebceed0`, this session): with no USB cable or wireless-ADB
path available (the phone doubles as the dev machine's hotspot, so it
can't simultaneously join a local network as a debugging client), shipped
real `onLayout()` measurements from the device to Render's logs via a
temporary `POST /admin/debug-log` route — using the app's existing
network path to the backend instead of a device-debugging tool. The
actual numbers: `userInfo` (the `flex:1` name/meta/badges container)
measured `width: 0` in every row, with degenerate heights of 460–563px
(text wrapping one character per line into zero available width). `Card`
itself measured only 126–158px wide — nowhere near a real phone screen.

**Real root cause:** `contentContainerStyle={{ alignItems: 'center' }}`
on these FlatLists was applied unconditionally, but it only exists to
support wide-screen/web centering (matching `PageContainer`'s own
wide-screen max-width+center behavior). On a phone, `alignItems: 'center'`
on a column flex container sizes each child to its own intrinsic content
width instead of stretching — combined with `PageContainer`'s
`width: '100%'` from Attempt 1, this created a circular reference ("be
100% of a parent whose own width is *also* determined by content").
Different layout resolution paths handled that ambiguity inconsistently:
the flexible name section collapsed to 0 while the non-shrinking icon
buttons kept their real size — exactly matching both the fully-invisible
symptom and the later colored-sliver-at-bottom symptom.

**Fix:** `alignItems: 'center'` made conditional on `useIsWide()` in all
five files sharing this exact pattern — `AdminUsersScreen.tsx`,
`WeeklyEffortsScreen.tsx`, `AssessmentsScreen.tsx`,
`PromoteStudentsScreen.tsx`, and both lists in `AcademicMgmtScreens.tsx`
(Terms and Subjects). Phones now get React Native's default `'stretch'`
behavior (full width, zero ambiguity); wide/web layouts keep the
centering they were originally built for. The temporary `onLayout`
diagnostic wiring and the `/admin/debug-log` route were removed once the
root cause was confirmed.

**Confirmed fixed** by the project owner directly on a live device
screenshot after rebuilding on `ebceed0` — names, badges, and all action
icons rendering correctly across every row.

**Lesson for future FlatList+PageContainer usage in this codebase:** any
new screen combining a FlatList, `contentContainerStyle={{ alignItems:
'center' }}`, and `PageContainer`-wrapped rows should make that
`alignItems: 'center'` conditional on `useIsWide()` from the start,
rather than risk reintroducing this exact bug.

**Follow-up UX redesign (commit `9899997`, same session):** once
rendering correctly, the project owner flagged the row's 4 unlabeled
action icons (pencil/pause/key/trash) as genuinely hard to distinguish,
and separately noted the row-per-user design wouldn't scale to a school
with 200+ users regardless of icon clarity. Redesigned to a tap-to-select
pattern: rows now show only name + badges + a chevron; tapping one opens
a bottom sheet listing every action as a labelled row (Edit Details,
Deactivate/Reactivate Account, Reset Password/Reissue Activation Code,
Delete User). Also added a search box and role-filter chips above the
list, since "select a user" needed to stay tractable at scale too, not
just "select an action." No backend changes; every existing handler
function reused unchanged.

---



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
