# TODO

> **Update 2026-07-10 (Pass 10 — Cross-cutting: offline, errors, edge cases —
> FINAL PASS):** Four bugs found and fixed, all live-verified against the
> real backend (two via standalone Node repro scripts mirroring the mobile
> app's exact outbox logic, since there's no emulator in this sandbox): (1)
> a race condition where `client.ts`'s and `OfflineBanner.tsx`'s separate
> `subscribeConnectivity` listeners both called `flushOutbox()` on every
> reconnect with no lock between them — for `messages` (no `UNIQUE`
> constraint) this created a real duplicate row per offline-queued message,
> live-reproduced as 2 identical messages from 1 queued send, fixed with an
> in-flight-promise guard. (2) `POST /scores/bulk` — the endpoint the mobile
> UI actually calls — had none of `POST /scores`'s validation: a same-school
> teacher could submit a CA1 above the school's configured max and have it
> save silently, or crash with a raw Postgres `NUMERIC` overflow 500 for a
> large enough value; fixed by sharing the existing `zod` schema and
> max-score check between both routes. (3) `PUT /attendance`/
> `PUT /attendance/bulk` never validated `days_present` at all — negative or
> wildly-over-`days_opened` values saved silently; fixed with a shared
> validator. (4) found while testing (3): `POST /terms`/`PUT /terms/:id`
> never validated `days_opened` either, and a negative value there (which
> `AttendanceScreen.tsx` can itself set) would then make fix (3) reject even
> a valid `days_present: 0`; fixed the same way. All four re-verified
> broken-before/fixed-after, plus each adjacent valid case re-confirmed
> unchanged. `npx tsc --noEmit` clean on both `backend/` and `mobile/`. Full
> detail in `CHANGELOG.md`. This was the last pass in the QA plan — see
> `PASS10_SUMMARY.md` for the closing summary across all 10 passes.
>
> **Flagged, not built:** `ScoreEntryScreen.tsx` shows the CA1/CA2/exam max
> as a hint label but doesn't clamp input or block Save client-side if a
> teacher types over it — no longer a data-integrity risk (the backend now
> rejects it either way) but a rougher UX than a client-side clamp/inline
> error would give.

> **Update 2026-07-10 (Pass 9 — Reports):** Went in expecting report *math*
> to be the risk (per the previous handoff), but both `GET /scores/report/
> :student_id` and `GET /scores/session-report/:student_id` hand-checked
> correct against raw `psql` data — total/average and grand-total/
> grand-average matched exactly, `class_average`/`class_highest` matched,
> and per-role scoping (parent→ward, student→self, teacher→own-school) was
> all live-verified correct with real `403`s on cross-account attempts. The
> real bugs were both frontend, both about the report screens being
> unreachable rather than wrong: (1) `MyResultsScreen.tsx` and
> `SessionReportScreen.tsx` only branched on `role==='parent'` or
> `'student'` when picking which student id to fetch — so admin, despite
> `StudentDetailScreen.tsx` having a "View Full Report Card" button that
> passes a real `parentStudentId`, always fell through to an empty `url`
> and silently fetched the API's root health-check route instead, showing
> "No report available" for every student, always. Live-confirmed by
> curling the API root with an admin token and seeing exactly the
> `{status:"ok",...}` payload (no `student` key) that trips the screen's
> empty-state guard. Fixed by adding an admin/teacher branch to both
> screens. (2) Teacher's version of the same button was worse — not just
> wrong data but a hard navigation crash — because `TeacherTabs.tsx`'s
> `ClassesStack` (where `StudentDetail` lives for teachers) never
> registered `MyResults`/`SessionReport` as screens at all. Fixed by
> registering both. All fixes re-verified: `npx tsc --noEmit` clean on
> both `backend/` and `mobile/`, full call chains re-traced end-to-end.
> Full detail in `CHANGELOG.md`.
>
> **Flagged, not changed — currently unreachable:** `ClassSummaryScreen`'s
> ranking query scopes by `class_name` only, not `school_code`, for admin —
> a theoretical cross-school blend if two schools ever shared a class name.
> Not reachable today since `classes` has no create/edit route (seed-only,
> non-overlapping names by construction); worth a look only if a "manage
> classes" feature gets built.

> **Update 2026-07-10 (Pass 8 — Finance & exports):** Checked first,
> per the previous handoff's specific ask, whether `finance.ts`/`admin.ts`
> had the same "write endpoint trusts a role-wide permission with no
> relationship scoping" shape that broke in Pass 4 and 7 — they don't,
> structurally, since every finance write lives under `admin.ts`'s
> router-level `requireRole('admin')` gate and there's no non-admin write
> path to leak through. The finance *reads* do have real per-role scoping
> and were live-verified correct for all four roles including query-param
> override attempts. This pass's real bugs turned out to be: (1)
> `GET /admin/export/excel` returned a real `200` with a real, openable
> `.xlsx` file that was silently empty (header-only sheets, no Scores
> sheet) whenever `school_code` was unresolvable — same root cause as
> Pass 7's admin-NULL-`school_code` bug, not reachable from the app's own
> UI (which always sends an explicit school), but a live footgun for any
> direct API caller; now a clear `400` instead of a silent empty
> "success". (2) The shared, app-wide `23503` (foreign-key violation)
> error handler in `src/index.ts` assumed every FK violation was a
> blocked `DELETE` and always said *"This can't be deleted..."* — even
> when the real cause was an `INSERT`/`UPDATE` pointing at a nonexistent
> parent row (live-verified via a bad `student_id` on invoice creation
> getting that exact nonsensical message). This is a generic bug that
> could have fired anywhere in the app on a bad foreign-key reference, not
> just finance — fixed by branching on Postgres's own `detail` wording,
> which already reliably distinguishes the two cases. (3)
> `POST /admin/finance/invoices` had zero input validation — live-verified
> a primary-school student could be invoiced with a secondary-school fee
> item at the wrong price, a nonexistent `fee_item_id` silently dropped
> out of the total instead of erroring, and an empty `fee_item_ids` array
> created a real ₦0 invoice; added existence + same-school checks for
> student/term/fee-items. (4) `PUT /admin/finance/invoices/:id/status`
> accepted any string as `status` (mobile only knows
> `unpaid`/`partial`/`paid`) and returned `200 {}` for a nonexistent
> invoice id instead of `404` — added the same enum-check pattern already
> used for assessment status in Pass 6, plus an existence check. All four
> fixes live-verified broken-before/fixed-after against a real running
> backend; full detail and exact repro steps in `CHANGELOG.md`.
>
> **Flagged, not built — a product question:** there is no mobile UI
> anywhere for *creating* a fee item or an invoice — `FinanceScreen.tsx`
> can only view fee items/invoices and mark an invoice paid. The backend
> routes exist and now validate correctly, but today they're only
> reachable via direct API calls, not from the app. Worth deciding whether
> that's an intentional backend-first sequencing or a real gap to build
> next.

> **Update 2026-07-09 (Pass 7 — Messaging & notifications):** Found and
> fixed a cross-school messaging bug live-verified to be as serious as it
> sounds: `POST /messages` only ever checked `messages.write` (a role-wide
> permission) for `parent`/`teacher`/`admin` senders — `GET /messages/
> contacts` (what the Chats UI actually shows) was correctly scoped per
> role, but nothing enforced that same scope on the actual send. Confirmed
> live: a `secondary`-school parent, whose own contacts list correctly
> showed only their ward's class teacher, could send a direct message to a
> `primary`-school student they have zero relationship to, just by knowing
> a user id — and a `secondary` teacher could do the same to an unrelated
> `primary` parent. Fixed with a new shared `getMessageableUsers()` helper
> (`backend/src/utils/scope.ts`) used by both `GET /messages/contacts` and
> `POST /messages`, so the write path now enforces exactly what the read
> path already promised. Also found and fixed, same pass: `admin`'s
> `school_code` is `NULL`, and the old contacts query did `WHERE
> school_code=$1` — so `GET /messages/contacts` silently returned an empty
> list for every admin account ever, meaning the Admin "Messages" screen
> has been unusable since it was built. Admin now correctly gets every
> active user, matching `permissions.admin = ['*']` used everywhere else.
> Also implemented (not just a bugfix — a genuine gap): `unread_count` and
> `last_message_at` per contact, wired into the WhatsApp-style `ChatsScreen`
> (unread badge + last-active sort, via `ChatListItem` props that already
> existed but were never populated) and into `NotificationsContext` (unread
> messages now actually appear in the notification feed/bell badge — the
> code's own comment always claimed to cover "unread-looking conversations"
> but never did). All fixes live-verified against a real running backend;
> full detail in `CHANGELOG.md`.
>
> **One item flagged, not changed — a product question:** parents can only
> message their ward's *class* teacher, not subject teachers or admin
> (unlike students, who can reach both). This asymmetry pre-dates this pass
> and wasn't touched — the fix above enforces the existing scope
> server-side, it doesn't expand it. Worth deciding whether parents should
> be able to reach admin directly (e.g. for a billing question) the way
> students already can.

> **Update 2026-07-09 (Pass 6 — Parent & student portals):** Found the
> entire "take an assessment" flow was completely non-functional, for every
> student, since the feature was built — three combined bugs: (1)
> `assessments.status` defaults to `'draft'` and nothing anywhere (route or
> UI) ever changed it, so the "Take Assessment" button could never activate;
> added `PUT /learning/assessments/:id/status` + Publish/Close buttons.
> (2) `TakeAssessmentScreen.tsx` fetched the wrong questions entirely — the
> unrelated, unscoped `GET /learning/questions` (which also 403s for
> students — teacher/admin-only permission) sliced to the first 20, with a
> `// simplified - in prod fetch per-assessment` comment marking the gap;
> added `GET /learning/assessments/:id/questions`, scoped per-assessment,
> answers stripped for students. (3) `GET /learning/materials` and
> `GET /learning/assessments` only scoped by school, not class — a student
> in one class could see (and a draft assessment's title/metadata leaked to)
> every other class's materials and assessments in the same school. Fixed
> with a new `resolveViewerClassNames()` helper covering both routes for
> student/parent roles (parents with multiple wards in different classes
> covered too). All three confirmed broken before and fixed after via real
> HTTP requests against a running backend — including a full publish →
> fetch-correct-questions → submit → correctly-auto-graded cycle.
>
> **One item flagged, not fixed — needs a product decision:** teachers can
> write materials/questions/assessments for *any* class in their own school,
> not just their `assigned_class` (unlike scores/attendance/class-records/
> weekly-efforts, locked down in Pass 4). Might be intentional if a teacher
> covers multiple classes — but there's currently no schema concept of that,
> same ambiguity as the open `assigned_subject_id` UI gap below. See
> `CHANGELOG.md` for full detail.


> **Update 2026-07-09 (Pass 5 — Attendance & class records):** Found and
> fixed five real issues, all confirmed live against a running backend (see
> `CHANGELOG.md` for full detail): (1) `AttendanceScreen.tsx` never actually
> fetched existing attendance — the code had a literal
> "fetch existing attendance records here" placeholder comment instead —
> and there was no backend route to do so at all; added
> `GET /attendance?class_name=&term_id=` and wired the screen to it.
> (2) `GET /weekly-efforts` leaked every school's data to any teacher without
> `assigned_class` set (subject-only teachers had zero school-level
> restriction). (3) `GET/POST /weekly-efforts/:id/feedback` had no ownership
> check at all — any authenticated user could read/would-be-post to any
> other student's feedback thread by id. (4) `PUT /class-records` let any
> teacher set `admin_remark` (the principal's field) directly via the API,
> bypassing the UI-only restriction. (5) Teachers could never post
> weekly-effort feedback at all, including on their own logged efforts —
> `weeklyEfforts.feedback` only existed on the `parent` role, despite the UI
> offering every role a reply box; fixed once the ownership check in (3)
> made it safe to grant.
>
> **Nothing found that needed a product decision this pass** — all five
> were unambiguous bugs (a missing check, a missing endpoint, or a
> permission that didn't match what the UI already offered), not judgment
> calls.

> **Update 2026-07-09 (Pass 4 — Score entry & assessments):** Before starting
> this pass, found this zip had diverged from a snapshot that predated two
> previously-verified fixes from an earlier session — the deactivation-window
> check in `requireAuth` and the `GET /students/me` student-self-lookup route
> were both missing (this branch's own Pass 1 apparently re-tested auth from
> scratch and found different, real issues instead — see its own notes below
> — but without the earlier session's fixes carried forward). **Reapplied
> both**, live-verified again (deactivation takes effect on the very next
> request; student self-lookup → own score report works end to end).
>
> Pass 4 itself found a serious, previously-undiscovered systemic bug:
> **every teacher-write endpoint trusted `requirePerm('X.write')` alone, with
> no check that the student being written actually belongs to the teacher's
> own school/class.** Live-verified by using a primary-school teacher's
> login to silently overwrite a secondary-school student's real score data
> with garbage (`ca1:1,ca2:1,exam:1`) — it succeeded, HTTP 200, no error.
> Same gap existed in attendance, class-record remarks, and weekly efforts.
> Fixed once, in a new shared helper (`backend/src/utils/scope.ts`,
> `checkTeacherStudentScope`) rather than patching each route ad hoc, and
> applied it to: `POST /scores`, `POST /scores/bulk` (checks every distinct
> student_id in the batch before writing any of it), `PUT /attendance`,
> `PUT /attendance/bulk`, `PUT /attendance/class-records`, and
> `POST /weekly-efforts`. Admins remain unrestricted (matches every other
> route). Live-verified: the exact attack above now 403s
> ("You can't write records for a student outside your school"); all four
> routes still work normally for a teacher's own school+class; admin
> writes are unaffected.
>
> Also found and fixed, same pass: `POST /assessments/:id/submit` never
> checked the assessment's `status` (draft/open/closed) or `start_at`/
> `end_at` window — live-verified a student could submit to (and get a full
> auto-graded score on) a still-draft, never-published assessment. Added
> status + time-window + school/class scope checks. Not reachable through
> the normal app flow (`TakeAssessmentScreen.tsx` already lists only
> `?status=open` assessments client-side) but it's the same
> defense-in-depth gap as the write-scoping issue above, and worth closing
> regardless. Also fixed the same missing-scoping pattern on
> `GET /assessments/:id/results` — a teacher from one school could view any
> other school's assessment results by ID; now 404s for out-of-scope IDs
> (matches the "404 not 403" pattern used elsewhere in this app so the
> endpoint doesn't confirm the record exists at all).
>
> Grade auto-calculation (`getGrade`) verified correct at every boundary
> (69→B, 70→A, etc.) and on edit/upsert. Per-school CA1/CA2/exam max
> validation verified against real school config, not just the hardcoded
> default. `tsc --noEmit` clean on backend; mobile import-resolution clean
> (60 files, 0 unresolved).
>
> **Found, not fixed — smaller inconsistency worth a decision:**
> `POST /learning/questions` always uses `req.user!.school_code` and ignores
> any `school_code` in the request body — unlike `POST /assessments`, which
> already has an explicit `(school_code && role==='admin') ? school_code :
> user.school_code` branch for exactly this reason. Since admin accounts
> have `school_code: null`, any question an admin creates directly ends up
> with `school_code: null` — invisible to every teacher's `GET /questions`
> (which filters by their own non-null school_code). In practice
> `questions.write`/`assessments.create` are teacher-only permissions per
> `rbac.ts` today, so this likely isn't hit by real usage, but if admin is
> ever expected to author questions directly, this route silently breaks
> that. Left as-is pending confirmation of whether admin-authored questions
> are an intended use case.

> **Update 2026-07-09 (Pass 1 — Auth & session):** QA plan resumed at Pass 1,
> tested live against all 4 roles. One bug found and fixed: malformed JSON in
> a request body was returning a generic `500` instead of `400` (not a crash —
> the earlier crash-safety fix held — but mislabeled a client error as a
> server fault). Fixed in `backend/src/index.ts`'s global error handler.
>
> One real finding **not yet fixed, pending a decision**: deactivating a user
> (`is_active: false`) or letting `access_expires_at` lapse only takes effect
> at that user's *next login or token refresh* — `requireAuth` checks the
> JWT's signature/expiry but never re-checks `is_active`/`access_expires_at`
> against the DB per-request, so an already-issued access token keeps working
> for up to its full remaining lifetime (`JWT_EXPIRES_IN`, 15m default) after
> an admin deactivates the account. Verified live. Fixing it means adding a
> DB lookup to `requireAuth` on every request — a latency/DB-load tradeoff in
> exchange for immediate revocation. Left as-is pending a product decision.
> below (was: `attendance.ts`'s `/class-records/:student_id/:term_id` had no
> ownership check, and RBAC only granted `classRecord.read` to teacher/admin).
> Fix deliberately did **not** just add `classRecord.read` to student/parent —
> that permission also guards the *bulk* whole-class listing
> (`GET /class-records?class_name=&term_id=`), so granting it would have
> leaked every other student's remarks through that route instead. Instead
> the single-record route now does its own per-request ownership check
> (student → own record only, parent → linked ward only, teacher → own
> school only, admin → all), mirroring the existing pattern in
> `GET /scores/report/:student_id`. Live-tested against a real Postgres 16 +
> running backend: self-access (200), cross-student access (403), ward
> access (200), unrelated-student-as-parent (403), same-school teacher (200),
> cross-school teacher (403), admin (200), nonexistent student (404), and
> confirmed the bulk listing route is still 403 for student accounts
> (no new leak introduced). `tsc --noEmit` clean before and after.

> **Update 2026-07-08:** Session collation (1st + 2nd + 3rd Term → session
> total) is now implemented — see `SESSION_COLLATION.md`. One open question
> from that work: confirm whether `session_average` should be a simple mean
> of terms entered, or weighted/summed differently per your school's actual
> promotion policy.

Genuine open items, carried over from the redesign branch's own notes
(`docs/ARCHIVED_redesign-branch-NOTES.md`) — these are real product/backend
gaps, not merge artifacts. None of them are fixed in either version:

- **Announcements** (Student Home, Parent Home): no announcements/school-notice
  endpoint exists yet in the backend. UI currently shows an honest "no
  announcements yet" placeholder.
- **Teacher "pending marking" count**: there's no graded/ungraded flag on
  submissions yet, so the dashboard currently shows a raw "Open Assessments"
  count rather than a true marking backlog.
- **Teacher Analytics / Calendar, Student Badges, Parent Upcoming
  Tests/Calendar/School Events**: all currently "Coming soon" placeholders —
  no backing data source exists for any of these yet.

## Not a to-do, but worth flagging for DD directly

`backend/.env.example` should be checked to confirm `JWT_SECRET` /
`JWT_REFRESH_SECRET` are set to real random values in every real deployment —
`utils/jwt.ts` will refuse to start in `NODE_ENV=production` if they're left
at their placeholder defaults, which is correct behavior, just noting it here
so it isn't mistaken for a bug during deployment.
