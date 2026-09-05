# Changelog

## [Unreleased] — 2026-09-05 — Finance/Operations Admin split, parent messaging widened, offline cache-invalidation, report Print/Export

Four independent pieces from the same session, listed in the order they
landed. No overlap with the parallel curriculum/topics or Add-Student/web
work landing the same day — none of this touches `topics`, `subjects`,
`students`, or `app.json`'s web config.

### Offline cache-invalidation (`mobile/src/offline/storage.ts`, `mobile/src/api/client.ts`)

The offline GET-cache had no invalidation at all — a screen showing cached
data stayed stale until its own next unrelated fetch, even after a write
had already changed that same data server-side (e.g. entering a score,
then immediately viewing that student's report — the report screen would
still show the pre-write cached copy). Added `cacheInvalidatePrefix()` and
wired it into the response interceptor for any non-GET write that actually
reaches the server. Queued-offline writes are unaffected by design — they
resolve via the existing catch-handler path and haven't really happened
yet, so nothing should be invalidated until they do.

### Parent messaging widened (`backend/src/utils/scope.ts`)

Parents could previously only reach admin plus their ward's *specific*
class/subject teachers — any other teacher at the school, even with zero
relationship to that ward, was unreachable. `getMessageableUsers()`'s
parent branch now matches the breadth a teacher already has to their own
school's staff: any active teacher or admin at any school where the parent
has a (non-deleted) ward. Deliberately **not** extended to parent↔parent or
parent↔unrelated-student messaging — a separate product decision from
"reach every teacher/admin," not implied by it.

### Finance Admin split from Operations Admin (schema, `rbac.ts`, `routes/admin.ts`, `routes/finance.ts`, mobile)

New `finance_admin` role, fully independent of `admin` — neither inherits
the other's access.

- **Schema:** `users.role` converted from a fixed `user_role` ENUM to
  `TEXT` + a `CHECK` constraint. Adding an enum value requires
  `ALTER TYPE ... ADD VALUE`, which Postgres refuses to run inside a
  transaction block — and `migrate.ts` sends the whole `schema.sql` as one
  multi-statement query, which Postgres always wraps in an implicit
  transaction. That would have made adding `finance_admin` (or any future
  role) fail against a live database. The TEXT+CHECK conversion sidesteps
  this permanently: a new role from here on is a plain `ALTER TABLE`
  constraint edit, not an enum migration.
- **Backend:** finance write routes (fee items, invoices, invoice status)
  moved from `admin.ts` (`/admin/finance/...`) to `finance.ts`
  (`/finance/...`), gated to `requireRole('finance_admin')`. `admin` is
  explicitly blocked from every finance route via a `blockOpsAdmin`
  middleware, rather than relying on `requirePerm` — `admin`'s `'*'`
  wildcard would otherwise satisfy that check regardless of intent.
  `finance_admin` also granted `students.read` and the admin-style
  `school_code` query-param override on `GET /students` and
  `GET /academic/terms`, needed to pick a student/term when creating an
  invoice (`finance_admin` has no school of its own, same as `admin`).
- **Mobile:** new `FinanceAdminStack` (Dashboard, Finance, Messages,
  ChangePassword only). `AdminStack` loses its Finance screen/tile
  entirely. `FinanceScreen.tsx` rewritten around `isFinanceAdmin` instead
  of `isAdmin`, and gains real fee-item creation and invoice-creation UI
  (student/term picker + fee-item checklist with a live running total) —
  previously the backend routes existed but nothing in the app could reach
  them. `AdminUsersScreen`, `DashboardScreen`, `AdminSchoolContext`,
  `theme.ts` all updated for the new role.

### Print/Export PDF for reports, admin + parent only (`mobile/src/utils/reportPdf.ts`)

New shared HTML report builder (school letterhead + logo, student info,
scores/attendance table, remarks) reused by both `MyResultsScreen.tsx`
(term report) and `SessionReportScreen.tsx` (session report):

- **Print** opens the native OS print dialog on Android/iOS
  (`expo-print`'s `printAsync`), or a fresh browser tab + `window.print()`
  on web (`expo-print` has no reliable web `printAsync` support across SDK
  versions — this is the same "open a tab, let the browser's own print
  dialog do the work" pattern `ExportExcelScreen.tsx` already established
  for web downloads).
- **Export** generates a real PDF via `printToFileAsync` and hands it to
  the OS share sheet on native (Drive, WhatsApp, email, etc.); on web,
  where there's no filesystem/share sheet, it routes to the same Print
  flow, whose "Save as PDF" destination achieves the same result.
- Restricted to `admin`/`parent` only, matching the confirmed decision that
  a teacher generates the underlying data but doesn't print/export the
  finished document, and a student only ever views their own report
  in-app — both screens gate the buttons on
  `user?.role === 'admin' || user?.role === 'parent'`.
- New deps: `expo-print@~56.0.4`, `expo-asset@~56.0.24` (`expo-sharing` was
  already present).

All four verified via `npx tsc --noEmit` (clean on both `backend/` and
`mobile/`) and a real `npx expo export --platform web` producing a working
bundle. **Not yet exercised against a live/running app** — that's the next
step, tracked in `TEST_PLAN_WEB_MOBILE.md`.

## [Unreleased] — 2026-09-04 — Add-Student mobile screen + Expo web build (items 3 & 4)

Two independent, self-contained pieces — deliberately kept out of the
active curriculum/topics work happening in parallel (didn't touch `topics`,
`topic_completions`, `subjects`, or anything in `learning.ts`'s TOPICS
section).

### Mobile

- **New `AddStudentScreen.tsx`** — there was no "Add Student" screen
  anywhere in the app; students only ever entered via import scripts. Now
  reachable via a FAB on `StudentsScreen`. Captures the usual fields plus
  optional `parent_name`/`parent_phone`/`parent_email` — backend support
  for auto-provisioning a parent account from these already existed
  (`utils/parentProvisioning.ts`), this was the missing UI. Shows generated
  parent credentials once on success, or a "linked to existing parent"
  notice when a sibling's phone matched an existing account.
- **Expo web build enabled** — `react-native-web` + `react-dom` added,
  `expo.web` config added to `app.json` (`npm run web` /
  `expo start --web`). `pushRegistration.ts` now explicitly no-ops on
  `Platform.OS === 'web'` (expo-notifications has no web remote-push
  support) instead of relying on `Device.isDevice` alone.
  `secureTokenStorage.ts` already had a web fallback from an earlier pass.
- **`ExportExcelScreen.tsx` fixed for web** — was still using
  `expo-file-system`/`expo-sharing`, neither of which work on web
  (`cacheDirectory` is `null`, `expo-sharing` has no web implementation at
  all). Now branches on `Platform.OS === 'web'`: fetches the export with
  the same Authorization header, then triggers a standard browser download
  via a throwaway `<a download>` link instead. Native behavior unchanged.



Went back over the existing offline system (`mobile/src/offline/`,
`api/client.ts`) specifically looking for ways it could still fail someone
working with no/patchy signal, beyond what Pass 10/12 already covered. Found
and fixed four real gaps, all in the mobile app; no backend changes.

### Mobile

- **`offline/storage.ts`** — the GET cache and outbox were keyed only by
  URL, with no notion of *which* signed-in user they belonged to. On a
  shared device (a staffroom tablet used by more than one teacher, or a
  parent's phone their child also logs into), the second person to view a
  screen offline could see the first person's cached data for the same URL,
  and a write queued offline by one person could replay under a different
  person's session/token if someone else logged in on that device before
  the first person reconnected. Fixed by namespacing every cache and outbox
  key with the current user's id (`setCacheNamespace`, called from
  `AuthContext` on login, session-restore, and logout). Also added a
  500-entry LRU cap per user on the GET cache — previously unbounded, so a
  device in daily use for months would keep accumulating cache entries
  until it silently started hitting the device's storage quota (`cacheSet`
  never throws, by design, so this would have degraded offline coverage
  over time with no visible symptom).
- **`api/client.ts`** — `/auth/*` requests (login, logout, change-password)
  were being queued into the offline outbox like any other write when
  offline. For login specifically this meant a login attempt with no signal
  resolved with a synthetic `{queued:true}` 202 body instead of rejecting —
  `AuthContext.login()` then tried to read `data.access_token`/`data.user`/
  `data.must_change_pw` off that body, none of which existed, corrupting
  the session with `undefined`s. For change-password it was worse: the
  screen would show "success" and navigate away for a password change that
  hadn't actually happened yet. For logout, a queued logout could later
  replay using whichever token was active on the device *at flush time* —
  possibly a different user's, on a shared device. Fixed by excluding
  `/auth/` from the outbox the same way `/ai/` already was — these need a
  live round trip by nature (verifying a credential, revoking a token,
  checking an old password can't happen against a local cache), so they now
  fail immediately and honestly instead.
- **`api/client.ts`** — the 401 → refresh-token flow force-logged-out the
  user (clearing tokens, emitting `forcedLogout`) on *any* error from
  `POST /auth/refresh`, including a network-level failure to even reach
  that endpoint. Since a 401 on the original request already proves the
  device was online a moment earlier, this only bit when connectivity
  dropped in the narrow window between the 401 and the refresh retry — but
  when it did, it wiped a possibly-still-valid session and dumped the user
  back to the Login screen, which itself needs a connection, stranding them
  from their own offline cache for no reason but a momentary blip. Fixed to
  only force-logout when the server actually responded rejecting the
  refresh (expired/revoked token, or no refresh token to send); a bare
  network failure during the refresh attempt now just fails that one
  request and leaves the session alone.
- **`AuthContext.tsx`** — `logout()` now checks the outbox first: if online,
  it tries to flush pending writes before logging out; if anything's still
  queued afterward (i.e. actually offline), it warns the person by name of
  count and lets them cancel, since those changes won't finish syncing
  until they sign back in on that same device.
- **`LoginScreen.tsx`**, **`ChangePasswordScreen.tsx`**, **`api/brainee.ts`**
  — now show a distinct "you're offline" message when the failure has no
  server response, instead of the generic error implying bad credentials /
  a server problem (a side effect of the `/auth/` and `/ai/` outbox
  exclusions above: these requests now reject on network failure instead of
  silently queuing, so the UI needed to explain why in plain terms).

`npx tsc --noEmit` clean on `mobile/` (fresh `npm install`, 552 packages,
no errors). Backend untouched this pass.

## [Unreleased] — 2026-07-15 — Teacher role scoped to CRUD + traditional scores + reports; AI grading is admin-oversight-only

Policy change: a teacher on this platform never authors a test/quiz/essay
assignment and never opens AI Marking or a student's Brainee self-assessment
results — that is exclusively an admin/Brainee responsibility. A teacher's
grading surface is now only the traditional CA1/CA2/Exam score entry system
(`scores` table via `ScoreEntryScreen`/`grades.*`), plus their existing,
unchanged Materials, Weekly Effort notes, Student CRUD, and Report Card
generation.

### Backend

- **`rbac.ts`** — removed `questions.read`, `questions.write`,
  `assessments.read`, `assessments.create`, `assessments.schedule` from the
  `teacher` role entirely (admin-only now, via `*`).
- **`routes/learning.ts`** — `GET /assessments/:id/results` and
  `GET /assessments/:id/submissions` now require a new `aiResults.read`
  permission (admin-only) instead of the shared `grades.read` (which a
  teacher still needs for the traditional scores endpoints in
  `routes/scores.ts`, so it could no longer be reused here without also
  granting teacher access). `PUT /submissions/:id/answers/:answerId/review`
  (Brainee grade override) now requires `aiGrading.override` (admin-only)
  instead of `grades.write`, for the same reason. `GET
  /assessments/:id/questions` and `GET /submissions/:id/answers` had their
  explicit `role === 'teacher'` branches removed — a teacher hitting either
  route now gets the same 403 as any other unauthorized role.
- No changes to `routes/scores.ts`, `routes/students.ts`,
  `routes/weeklyEfforts.ts`, or `routes/attendance.ts` — the traditional
  teacher-facing grading/reporting system is untouched.

### Mobile

- **`TeacherTabs.tsx`** — removed the entire Assessments tab (Create
  Assessment, Marking, essay review, results) from the teacher's app.
  Deleted `TeacherAssessmentsHomeScreen.tsx` (orphaned). A teacher's score
  entry is reached the same way it already was, via Classes → Enter Scores.
- **`TeacherDashboardHomeScreen.tsx`** — removed the "New Assessment" quick
  action, the "Create assessment" FAB action, and the "Open Assessments"
  stat (which called an endpoint the teacher role can no longer read);
  replaced with a "Students" quick-access shortcut.
- **`AdminStack.tsx`** — added `EssayAnswerReviewScreen` (Brainee grading
  oversight, with override power) — previously only reachable from the
  teacher's now-removed Assessments tab.
- **`AssessmentsScreen.tsx`** — renamed the internal `isTeacher` flag to
  `isAdmin` to match reality: only admin (never teacher) reaches this
  screen's staff controls now.
- Plain-language fixes so a student never sees a raw grading symbol/code:
  `AssessmentResultsScreen.tsx` no longer appends a bare `*` to a
  not-fully-graded score (now a separate "Not final yet" label);
  `TakeAssessmentScreen.tsx`'s post-submit screen now shows the real
  running total and, when an essay answer is still pending, a plain
  sentence ("Brainee is still checking one or more of your written
  answers…") instead of silently showing a partial number with no
  explanation.



Built the six gaps flagged in the AI audit into real, working features — all
under the "Brainee" brand in the frontend. Nothing here touches `scores`,
`attendance`, or `class_records` (the traditional, teacher-entered term
grading system) — every AI-graded thing lives in the STS Virtual School's
own tables (`questions`/`assessments`/`submissions`/`weekly_efforts`).

### Backend

- **`schema.sql`** — new `submission_answers` table (one row per
  question per submission: mcq or essay, Brainee's suggestion, the final
  awarded score, who/when it was reviewed). `submissions.fully_graded`
  flag. `weekly_efforts.ai_summary` + `ai_summary_generated_at`.
- **`POST /learning/assessments/:id/submit`** — MCQs still auto-grade
  exactly as before. Essay answers are now graded by Brainee immediately
  (`grading_status='ai_graded'`) unless the answer is blank (scored 0, no
  AI call) or Brainee's call fails, in which case the answer is marked
  `ai_unavailable` — awarded_points stays null and a teacher must grade it.
  This was a live, real test in this pass, not a code-read: Gemini is
  unreachable from this sandbox, so I watched an essay answer actually go
  through the whole path and land on `ai_unavailable`, then confirmed a
  teacher's review resolves it and recomputes `total_score` correctly.
- **`GET /learning/assessments/:id/submissions`** — fills the "Teacher
  pending marking" gap from `docs/ARCHIVED_redesign-branch-NOTES.md` — a
  real list of submissions with a `fully_graded`/`pending_essay_count`.
- **`GET /learning/submissions/:id/answers`** — full per-question detail
  for teacher/admin. Students/parents only ever see a finalized score —
  an essay Brainee has graded but a teacher hasn't reviewed yet shows as
  "pending", with no numbers, so a provisional AI score can't be mistaken
  for a confirmed one.
- **`PUT /learning/submissions/:id/answers/:answerId/review`** — teacher
  confirms/overrides an essay score; recomputes `total_score` and
  `fully_graded` from all per-question rows.
- **`backend/src/routes/ai.ts`** — new `POST /ai/chat`, `/ai/explain`,
  `/ai/notes`, `/ai/hint`, `/ai/generate-questions` (previously only
  `/ai/ping` existed). `/ai/hint` is scoped to a question in an assessment
  currently open to the requesting student, and the prompt never includes
  `correct_keys` — Brainee structurally can't leak the answer, because it's
  never given it. `/ai/generate-questions` (teacher/admin) drafts
  candidate questions as **JSON, never saved automatically** — a teacher
  still has to POST each one they want to keep to the existing
  `/learning/questions`, same as if they'd typed it by hand.
- **`backend/src/utils/ai.ts`** — added `generateJSON()` for routes that
  need structured output (question drafts, essay scores) instead of prose.
- **`POST /weekly-efforts`** — after saving, best-effort asks Brainee to
  turn the teacher's flags/mcq_avg into a short, plain-language,
  encouraging summary a young student can read on their own. Never blocks
  or fails the save itself — confirmed live in this pass: with Gemini
  unreachable, the weekly effort still saved fine and `ai_summary` stayed
  null, exactly as designed.

### Mobile

- **Rebrand**: every user-facing "AI" label is now "Brainee". Checked with
  a repo-wide grep — no leftover "AI" wording in any screen.
- **`src/api/brainee.ts`** (new) — thin client for all `/ai/*` routes.
- **`src/screens/BraineeChatScreen.tsx`** (new) — the actual destination
  for "Ask Brainee". Reachable from anywhere via `openBraineeChat()`
  (`navigationRef.ts`), same pattern already used for Notifications.
- **`StudentHomeScreen`** — "Ask AI" (previously a dead end that opened
  human messaging) is now "Ask Brainee" and opens the real chat screen.
- **`StudentAssessmentsHomeScreen`** — "AI Feedback: Coming soon"
  (permanently disabled) is now "Ask Brainee" and works.
- **`TeacherAssessmentsHomeScreen`** — "AI Marking" (which was actually
  just the existing rule-based MCQ auto-grading, not AI) renamed to
  "Marking" with an accurate subtitle covering both instant MCQ marking
  and Brainee-assisted essay marking.
- **`AssessmentResultsScreen`** — each result row now shows a "needs
  grading" badge when Brainee couldn't grade an essay, and taps through to
  the new **`EssayAnswerReviewScreen`** (new) — shows Brainee's suggested
  essay score/feedback with an editable override, or a manual-grade
  prompt when Brainee's call failed.
- **`WeeklyEffortsScreen`** — shows Brainee's plain-language "Brainee
  says" summary ahead of the raw numbers/flag codes, when one exists.
- **`CreateAssessmentScreen`** — new "Draft with Brainee" button opens a
  modal where a teacher gives a topic and gets back candidate questions;
  nothing is saved until the teacher taps "Keep" on a specific draft.
- **`src/api/client.ts`** — `/ai/*` requests are excluded from the
  offline write-outbox. Queuing "explain this" or "grade this essay" for
  silent replay whenever connectivity returns would hand the student a
  stale, out-of-context answer later with no way to know it wasn't live;
  these now fail immediately and honestly instead.

### Verified

- `tsc --noEmit` clean on both `backend` and `mobile`.
- Full live run against a real local Postgres instance (not just a code
  read): admin/teacher/student accounts created via the real API, an
  assessment with one MCQ + one essay question created and opened, a
  student submission driven through `POST /submit` for real. Confirmed:
  MCQ auto-grades correctly; the essay genuinely attempted a live Gemini
  call (visible in the server log reaching
  `generativelanguage.googleapis.com`) and correctly fell back to
  `ai_unavailable` when this sandbox's own network blocked that domain;
  the teacher's pending-marking inbox showed it; the student's own view
  correctly hid the ungraded score; a teacher review resolved it and the
  total/`fully_graded` recomputed correctly; and confirmed directly in
  Postgres that `scores`/`attendance`/`class_records` had zero rows
  throughout.
- All six new/changed `/ai/*` endpoints exercised live and confirmed to
  fail cleanly (normalized error, correct status code) rather than crash,
  given the same real-but-blocked Gemini call.
- Role/scope guards tested live: `/ai/hint` as a teacher → 403; missing
  `question_id` → 400; a question not in a currently-open assessment for
  that student → 404; `/ai/generate-questions` as a student → 403;
  `/ai/ping` as a teacher → 403.
- **Not verified:** an actual successful Gemini response, for the same
  reason as the previous pass — this sandbox's network allowlist blocks
  Gemini's API domain outright. Everything up to and including that call
  was exercised for real; only the model's actual reply is unverified.

## [Unreleased] — 2026-07-14 — Gemini AI hub wired in (no feature built on it yet)

Ported the standalone Gemini call hub (`generate(prompt, task, options)`)
from the AISchoolonair project into this backend, so this app can reuse the
same Gemini API key/billing instead of registering with a new AI provider.
This pass deliberately does **not** build any AI feature — it only wires the
hub in and verifies the connection works, per instruction.

- **Added** `backend/src/utils/ai.ts` — TypeScript port of the source
  project's `ai.js`. Same model routing, retry/fallback chain, and optional
  fail-open Redis rate limit as the source; logic unchanged, only the module
  system adapted (this project is ESM + strict TypeScript, the source file
  was plain CommonJS-style JS). One adaptation: the optional `ioredis`
  loader uses a dynamic `import()` instead of `require()`, since this
  project's backend runs with `"type": "module"`.
- **Added** `backend/src/routes/ai.ts` — `POST /ai/ping`, admin-only. Sends
  a trivial prompt through `generate()` and returns the response, so the
  wiring can be confirmed end-to-end before any real feature is built on it.
  Mounted at `/ai` (not `/api/ai`) to match this project's existing
  convention — no other route in this backend uses an `/api` prefix.
- **Added** `@google/genai` (`^1.48.0`) to `backend/package.json`.
- **Added** `GEMINI_API_KEY` (required) and `REDIS_URL` (optional) to
  `backend/.env.example`. Values are blank placeholders — the real key
  needs to be added to your own local `.env` by hand, same value already in
  use for edu-platform.

### Verified

- `tsc --noEmit` passes clean.
- Started the server locally and confirmed live over HTTP: `GET /` health
  check works, `POST /ai/ping` correctly returns 401 with no token and 401
  with an invalid token (identical behavior to every other route's
  `requireAuth`), and unrelated routes (`GET /students`) are unaffected.
- Called `generate()` directly (outside the HTTP layer, since a valid
  signed JWT plus a live Postgres instance for the `requireAuth` DB check
  weren't available for this pass): confirmed it throws the documented
  clear error when `GEMINI_API_KEY` is unset, and — with a placeholder key —
  confirmed it actually attempts a real network call to
  `generativelanguage.googleapis.com`, and cleanly normalizes the failure
  into a `500`/"AI request failed" error rather than crashing.
- **Not verified in this pass:** an actual successful Gemini response. This
  sandbox's own network egress allowlist blocks
  `generativelanguage.googleapis.com` outright (confirmed by the "Host not
  in allowlist" error above), so a real end-to-end call couldn't be made
  here regardless of key validity. `POST /ai/ping` needs to be hit once
  locally, with a real `GEMINI_API_KEY` in `.env` and a real admin JWT,
  before relying on this for a real feature.

## [Unreleased] — 2026-07-14 — Live test-run pass: 4 real bugs found and fixed

This pass didn't change any features — it ran the existing app for real
(real Postgres, real migrate/seed/import, real HTTP requests as every role,
including deliberately adversarial ones) and fixed what broke. Full details,
including exact repro steps and verification, in
`TEST_RUN_REPORT_PASS21_LIVE.md`. Summary:

1. **`importFirstTerm.ts` left the wrong term current on a fresh install.**
   `seed.ts`'s empty placeholder term blocked the real imported term from
   being promoted to current, right after the exact operation meant to
   populate real data. Fixed: an empty current term (no scores/attendance/
   class-records attached) is now treated as "no current term yet"; a
   genuinely in-progress term with real data is still correctly left alone.
2. **`resetAcademicData.ts --new-session` didn't delete what it claimed to.**
   Materials, questions, assessments, and invoices use `ON DELETE SET NULL`
   on `term_id`, not `CASCADE` — the tool's own printed summary claimed
   these cascaded away with the term row; they didn't, they were silently
   orphaned instead. Fixed: now explicitly deleted, matching what the tool
   has always told the admin it does.
3. **`POST /students` and `PUT /students/:id` had no scope check at all.**
   Confirmed live: a Grade-1-only primary teacher successfully created a
   student in Grade 2, and in the secondary school entirely — both should
   have been rejected. Fixed with a new `checkTeacherRosterScope()` (POST)
   and reuse of the existing, already-correct `checkTeacherDeleteScope()`
   (PUT) — same pattern already proven on `DELETE /students/:id`.
4. **`GET /scores` let a subject-only teacher pull an entire class's scores
   across every subject, not just their own.** Confirmed live: a
   Mathematics-only teacher retrieved 210 rows across 15 subjects for a
   class they don't teach, via a single `?class_name=` request with no
   subject filter enforced. Fixed: `subject_id` is now unconditionally
   forced to the requester's own `assigned_subject_id` for a subject-only
   teacher, regardless of what (if anything) the client passed.

## [Unreleased] — 2026-07-13 — Pass 21: Legacy First Term import (corrected), single-CA report display, reset utility — merged with a parallel data-import pass

This pass was produced independently, in parallel with the Pass 16–20
access-control work above, starting from an intermediate snapshot of this
build (specifically, before the Pass 20 "thorough check" that added the
`GET /scores`/`GET /weekly-efforts` scoping fixes and the `DISTINCT` fix to
`getMessageableUsers()`). This entry documents its actual content, merged
into the current build with those three fixes kept intact rather than
reverted — see the note at the end of this entry for how that merge was
done and verified.

Integrates the recovered legacy `school.db` (108 students, 1,639 scores,
83 attendance rows, 108 class-record remarks across both schools) so
teachers do not have to re-key First Term 2025/2026 results by hand, while
leaving score entry, validation, and every other part of the app untouched.

### Fixed — term mislabeled "2nd Term," should be "1st Term"
- A prior pass (`importSecondTerm.ts` / `data/second_term_import.json`)
  imported this same legacy data labeled as **2nd Term**, matching the
  legacy database's own term-table label. That label was the actual typo:
  every report card the legacy system itself exported (`FilesSEC.zip`,
  `FilesPRY.zip`) says **First Term** — the primary-school cards spell out
  "First term 2025/2026" in full; the secondary-school cards say "First Term"
  too (with a stale "2024/2025" template typo on the year, which is ignored —
  2025/2026 was already correct in the legacy DB and matches the primary
  cards).
- Renamed `backend/src/db/importSecondTerm.ts` →
  `backend/src/db/importFirstTerm.ts`, and its bundle to
  `backend/src/db/data/first_term_import.json`, with the term name inside
  corrected to `1st Term`. Updated `README.md`, `SESSION_COLLATION.md`, and
  `TESTING_ON_WINDOWS.md` accordingly. Older CHANGELOG/MERGE_REPORT/
  TEST_RUN_REPORT entries referencing the old name are left as-is — they're
  a record of what actually happened at the time, not a live guide.
- One extra, empty duplicate term row in the legacy DB (no scores,
  attendance, or class records ever attached to it) was dropped when the
  bundle was rebuilt from `school.db` directly.
- A handful of legacy subjects were entered twice under different casing
  (e.g. `Basic science` vs `BASIC SCIENCE`), each with a genuinely different
  set of students' scores attached (verified: no student has scores under
  both spellings of the same subject). The rebuilt bundle folds each such
  pair into one canonical subject rather than importing duplicates.

### Added — the import now creates students too, not just scores
- The old script only matched against *existing* students and required the
  roster to be loaded first by some other means. `importFirstTerm.ts` now
  also upserts any student in the bundle that doesn't already exist
  (matched by admission number, falling back to exact
  full_name + class_name + school_code for the ~18 legacy records with no
  admission number) — so this import alone is enough to go from an empty
  database to fully populated First Term report cards, with zero manual
  student or score entry.
- Existing students, once created, are never overwritten by a re-run.

### Changed — import no longer force-demotes the current term
- The old script unconditionally marked its term current, demoting whatever
  was current before — meaning re-running it after an admin had already
  opened 2nd or 3rd Term would silently yank the term picker back. The
  rebuilt script only marks 1st Term current if the school has **no**
  current term yet; otherwise it leaves `is_current` untouched. Still safe
  to re-run at any point in the session.

### Added — single "CA" column on report displays (CA1 + CA2 combined)
- `MyResultsScreen.tsx` (student/parent report) and `StudentDetailScreen.tsx`
  (admin/teacher view) now show one **CA** column (`ca1 + ca2`) instead of
  separate CA1/CA2 columns, matching how the report card should read.
- **Scope, deliberately narrow:** this is a display-only change. The
  `scores` table still stores `ca1` and `ca2` separately, `ScoreEntryScreen`
  still takes them as two separate inputs, and `routes/scores.ts` validation
  (`ca1_max`/`ca2_max` per school) is untouched — so this does not affect
  score entry for 3rd Term or any other in-progress term. If a single
  combined CA field is wanted at entry time too, that's a bigger, separate
  change (schema + validation + form), not implemented here.

### Added — `resetAcademicData.ts`, an admin CLI for clearing data between terms/sessions
- New `backend/src/db/resetAcademicData.ts`, run the same way as the import
  script (by hand, via SSH — not an API route or mobile button, since every
  mode is destructive). Three modes, each requiring an explicit `--yes` after
  a mandatory dry run:
  - `--term <id>` — clear one term's scores/attendance/class-records only.
  - `--session <school_code> <year>` — clear a whole session's data, keep
    the term rows, roster, and subjects.
  - `--new-session <school_code> <old_year> [--include-students]` — retire
    an entire past session's term rows (cascading to their data); subjects
    and, by default, students carry over. `--include-students` opts into a
    genuine full roster wipe for schools that re-register every session.
- See "Resetting for a new term or session" in `README.md` for full usage.

### Reconciliation note — this pass merged with, not instead of, the Pass 20 thorough-check fixes
- This pass's own diff, taken on its own, doesn't include the `GET /scores`
  class_name gate, the `GET /weekly-efforts` teacher_id restriction, or the
  `DISTINCT` fix in `getMessageableUsers()` — all three were added in this
  build's own Pass 20 *after* this pass's starting snapshot was taken, so
  they were never at risk of being reverted here; they simply weren't part
  of what this pass touched. Confirmed by diffing `backend/src/routes/
  scores.ts`, `backend/src/routes/weeklyEfforts.ts`, and `backend/src/utils/
  scope.ts` between this pass's own version and this build's post-Pass-20
  state: the only differences are exactly those three fixes, present here
  and absent there — nothing else in those three files changed between the
  two, so there was no real merge conflict to resolve, just a matter of
  keeping the newer file.
- Everything else in this entry (the renamed import script and data bundle,
  `resetAcademicData.ts`, the CA-display change, and the doc updates) was
  brought in as-is.
- `npx tsc --noEmit` passes clean in both `backend/` and `mobile/` after the
  merge; the backend still boots cleanly end-to-end. The new import/reset
  scripts were not run against a live database in this environment (no
  Postgres available here) — they were only checked for compilation and
  logic, not executed.

## [Unreleased] — 2026-07-13 — Pass 20: Reconciliation with a parallel audit pass + tighten student-record access to class teachers

A second, independently-produced audit pass (covering the same Pass 16–18
follow-ups as Pass 19) surfaced three real gaps this build had missed, and
this build's own review surfaced two gaps in that parallel pass, plus one
fix in it that looked right but didn't actually work end-to-end. This entry
reconciles the two into one build, then closes an access-control gap raised
directly during that review.

### Brought in from the parallel pass (all three genuine, independent finds)
- **`DELETE /learning/materials/:id` now lets admin remove any material.**
  It previously only ever matched `WHERE created_by=$2`, so even admin
  couldn't take down a material some other (e.g. departed) teacher had
  uploaded. Admin now bypasses the `created_by` check entirely; a non-admin
  teacher is still limited to their own uploads.
- **`PUT /learning/assessments/:id/status` (publish/close) is now scoped
  the same way creating an assessment already was.** Previously any teacher
  in the school could open or close *any* assessment regardless of whether
  they created it or teach that class/subject — only `school_code` was
  checked. Now gated by `checkTeacherContentScope()`, same as creation.
- **Soft-deleted students no longer appear as contacts to teachers or
  admin.** Pass 19 added `deleted_at` filtering to the student and parent
  branches of `getMessageableUsers()` (the two that already joined
  `students` directly) but missed the teacher and admin branches, which
  select from `users` with no join back to `students` at all. Added a
  `LEFT JOIN students` + `(role <> 'student' OR deleted_at IS NULL)` guard
  to both.

### Rejected from the parallel pass, with reasons
- **Its fix for the hybrid-teacher class-picker gap was not adopted.** It
  loosened `GET /students`'s class-scoping to honor an explicit
  `class_name` param for any teacher with an `assigned_subject_id` — but no
  mobile screen (including the one its own changelog cited as needing "no
  mobile changes") ever actually sends that param, so in practice a real
  user's picker never changed. This build's Pass 19 fix (point the picker
  at `GET /academic/classes`, which carries no student records at all)
  actually reaches the screen and was kept instead — see the Pass 19 entry.
- **Its RECIPIENT_ERROR/teacher-branch fixes were incomplete.** It fixed the
  admin-unreachable-via-NULL-school_code bug in the student and parent
  branches but left the same bug in the teacher branch untouched (and its
  `RECIPIENT_ERROR.teacher` copy, left unchanged, is the tell). This build's
  Pass 19 already covered all three branches; kept as-is.
- **It left a stale claim in the Pass 18 changelog uncorrected** (that a
  parent could already message the ward's other linked parent — never true
  on either branch). This build's Pass 19 correction is kept.

### Fixed — a subject-only teacher could pull a full-school student roster through several screens, not just the one already fixed in Pass 19
- Raised directly in this pass's review: Pass 19 fixed the Create Assessment
  picker (by pointing it at `GET /academic/classes` instead of
  `GET /students`) but didn't address the same underlying cause — a teacher
  with no `assigned_class` calling `GET /students` with no `class_name`
  fell through to "no class filter", i.e. the full roster (names, admission
  numbers, dates of birth) for every class in the school. This wasn't
  introduced by anyone in this reconciliation; it predates Pass 16.
- **`GET /students` (`backend/src/routes/students.ts`) now requires a
  non-class-teacher to name a specific class.** A teacher with no
  `assigned_class` (a pure subject specialist, or an edge-case account with
  neither) gets an empty list unless `class_name` is given explicitly —
  no more default whole-school dump. A class teacher's own `assigned_class`
  still always wins over anything passed in, unchanged from before, and
  admin is completely unaffected (its own `effectiveSchool` path, not this
  gate). Per explicit product direction for this pass: a teacher's access to
  actual student records stays limited to their own class — full stop, with
  no carve-out for also holding a subject assignment. (Content *creation* —
  materials/assessments/questions — is intentionally different: Pass 17
  already established that a subject teacher may publish for any class in
  their subject, and that stays true; this change is specifically about
  browsing student *records*, e.g. rosters, scores, attendance.)
- **`ScoreEntryScreen.tsx` and `AttendanceScreen.tsx`** no longer fetch the
  whole school's roster up front and slice it client-side by class. Both now
  fetch their class list from `GET /academic/classes` and re-fetch just the
  selected class's roster from `GET /students?class_name=...` whenever the
  class changes — and the class picker itself only offers a teacher's own
  class when they have one (matching what the backend will actually honor,
  rather than showing choices that would silently come back as their own
  class regardless of what's picked). `AttendanceScreen.tsx` also gained the
  same admin school-switcher wiring (`useAdminSchool` + `SchoolSwitcherBar`)
  already established in `ScoreEntryScreen.tsx`/`StudentsScreen.tsx`, since
  without an explicit school scope admin would otherwise see an empty class
  list post-fix (previously — undocumented until now — admin got every
  student from every school mixed together on this screen with no way to
  tell them apart; not something to preserve, but not silently regressed
  into "shows nothing" either).
- **`WeeklyEffortsScreen.tsx`** gained a "Class" picker step (teacher role
  only; admin's existing behavior on this shared, four-role screen was left
  untouched, out of scope for this pass) before its "Student" picker, since
  it previously populated that picker from the same unfiltered
  `GET /students` call with no class grouping in the UI at all.
- **`TeacherDashboardHomeScreen.tsx`** no longer fetches a whole-school
  student count for a teacher with no `assigned_class` — it would now come
  back as 0 (misleadingly implying zero students) rather than a real count;
  skips the call and shows "—" instead, same as the offline/error case
  already did.
- **Not changed:** `CreateAssessmentScreen.tsx`'s class picker (Pass 19)
  still shows every class in the school to every teacher, including a pure
  class teacher with no subject assignment at all — who will only ever be
  able to save against their own class. This is a minor UX rough edge (a
  confusing 403 is possible if they pick another class), not an access-
  control issue: `checkTeacherContentScope()` still correctly gates the
  save either way, and no student *record* data is exposed by the picker
  itself (just class names). Distinguishing that specific case client-side
  would require exposing `assigned_subject_id` to the mobile app (currently
  deliberately omitted from the login response — see `backend/src/routes/
  auth.ts`), which felt like a larger, separate change than this pass's
  brief called for; flagging as a possible follow-up.

### Fixed — a thorough post-implementation check found the same whole-school-dump pattern in two more places
- Requested as a follow-up check on this pass before testing/APK build.
  `GET /students` wasn't the only endpoint with "no class filter = the whole
  school" as its default for a subject-only teacher — the same shape existed
  in two more places, one of which was actually reachable through the real
  app, not just a raw API call:
  - **`GET /scores`** (`backend/src/routes/scores.ts`): a subject-only
    teacher with no `class_name` passed got every score for every student in
    every class in their school, across every subject. No mobile screen
    currently calls this without a `class_name` (`ScoreEntryScreen.tsx`
    always has one selected first, per this pass), so this was an
    API-level gap rather than one exploitable through the app's own UI
    today — closed anyway, same fix as `GET /students`: a non-class-teacher
    with no explicit `class_name` now gets an empty result.
  - **`GET /weekly-efforts`** (`backend/src/routes/weeklyEfforts.ts`): same
    root cause, but this one WAS reachable through the real UI —
    `WeeklyEffortsScreen.tsx`'s main feed calls this with no filters
    whatsoever for a teacher, so a subject-only teacher's feed showed every
    weekly-effort entry for every student in every class, logged by every
    other teacher too. Fixed differently from the other two, to keep the
    existing feed screen working without adding a class-filter UI to it: a
    class teacher still sees every entry for their own class regardless of
    who logged it (unchanged — they're the class's overall guardian), but a
    subject-only teacher is now restricted to just the entries they
    personally logged (`WHERE teacher_id = <them>`), rather than getting
    nothing or the whole school.
  - **Checked and found already safe:** `GET /attendance` and
    `GET /attendance/class-records` (`backend/src/routes/attendance.ts`)
    already required an explicit `class_name` + `term_id` (400 if missing) —
    no gap there. `PUT /attendance`, `PUT /attendance/class-records`, and
    `POST /weekly-efforts` (single-record writes) already route through
    `checkTeacherStudentScope()`, which is correctly broader-by-design for
    writes (a subject teacher may write across any class in their subject —
    an intentional difference from the read-list endpoints above, not a
    bug). `GET /finance/invoices` gives every teacher whole-school
    visibility with no class restriction at all — checked, and its own doc
    comment confirms this is a deliberate, pre-existing design choice
    (invoices are treated as school-wide administrative data, not
    teacher-authored academic records), so left unchanged rather than
    folded into this pass's principle without being asked.
- **Also found and fixed:** the teacher and admin branches of
  `getMessageableUsers()` (`backend/src/utils/scope.ts`, touched earlier in
  this same pass for the soft-delete fix) were missing `DISTINCT`, unlike
  their student/parent sibling branches. `students.user_id` has no unique
  constraint in the schema — if a single user account were ever linked to
  more than one `students` row, the new `LEFT JOIN` added earlier in this
  pass would have silently listed that contact twice. Added `DISTINCT` to
  both as a defensive correctness fix (the same gap exists in the parallel
  audit pass this was reconciled with, in case that's relevant elsewhere).
- **Also checked, no issue found:** the server boots cleanly end-to-end
  (`tsx src/index.ts` against a dummy `DATABASE_URL`, no live Postgres
  available in this environment) with no import-time or route-wiring
  errors; all permissions referenced by routes touched across Passes 16–20
  exist in `rbac.ts`'s role/permission map; `mobile/eas.json` is valid JSON.

### Verified
- `npx tsc --noEmit` passes clean in both `backend/` and `mobile/`.
- Hand-trace: a subject-only teacher calling `GET /students` with no
  `class_name` should now get an empty list, not the whole school; the same
  call with `class_name=SS3` should still work. A class teacher should see
  identical behavior to before this pass, in every screen touched. Admin
  should be unaffected everywhere except `AttendanceScreen.tsx`, where it
  now needs a school picked first (previously: worked without one, but
  mixed every school's students together). None of this was run against a
  live database in this environment.

## [Unreleased] — 2026-07-13 — Pass 19: Follow-up audit fixes (all gaps flagged during Passes 16–18)

Not a port from the reference branch — this pass closes out every gap that
was explicitly flagged-but-deferred in the Pass 16–18 CHANGELOG entries,
plus one further bug found while re-reading `getMessageableUsers()` closely
enough to fix the others. Requested before this build goes onto a device
for hands-on testing.

### Fixed — admin was silently unreachable in messaging contacts for student, parent, AND teacher accounts
- `getMessageableUsers()`'s student and (post–Pass 18) parent branches used
  a join shape like `u.school_code = st.school_code AND (... OR u.role =
  'admin')`; the teacher branch used a plain `WHERE school_code = $1`.
  Admin rows have `school_code = NULL`, and `NULL = anything` is never true
  in SQL — so despite this file's own doc comments, the `RECIPIENT_ERROR`
  copy in `messages.ts`, and the mobile screens all promising "any school
  admin" reach, **no student, parent, or teacher account could actually see
  any admin in their contacts list, ever.** This was flagged as "worth a
  quick manual check" after Pass 18 and turned out to be a real, currently-
  shipped bug, not just a docs mismatch. Fixed in all three branches by
  checking `role = 'admin'` as an alternative to the school_code match
  rather than ANDing it inside the same condition.

### Fixed — soft-deleted students' logins still showed up as, and could still see, messaging contacts
- Flagged as a deliberate exclusion in Pass 16 and repeated in Pass 18: a
  soft-deleted student's own account login isn't automatically deactivated
  by `students.deleted_at`, so `getMessageableUsers()` never filtered on it.
  Added `st.deleted_at IS NULL` to both the student and parent branches, and
  `st2.deleted_at IS NULL` to the classmate `EXISTS` subquery in the student
  branch, so a deleted student's login neither appears as a classmate to
  others nor sees any contacts of its own once deleted.

### Fixed — `POST /learning/questions` had no class/subject scope check
- Flagged in Pass 17: `/materials` and `/assessments` were gated by the new
  `checkTeacherContentScope()`, but `/questions` — which feeds directly into
  an assessment — was left on `questions.write` alone, the same gap in the
  same shape. Now gated identically to its two siblings.

### Fixed — `RECIPIENT_ERROR` copy in `messages.ts` was stale after Pass 18
- `parent`'s 403 text still said "class teacher(s)" only; updated to mention
  subject teachers and admin. `teacher`'s text updated to mention admin
  explicitly now that the cross-school admin bug above is fixed.

### Fixed — a teacher with BOTH an assigned class and an assigned subject only saw their own class in the Create Assessment class picker
- Flagged in Pass 17: `CreateAssessmentScreen.tsx` built its class picker
  from `GET /students`, which restricts to the caller's own `assigned_class`
  whenever one is set — so a hybrid class-and-subject teacher never saw the
  other classes their subject-teacher scope would actually let them publish
  an assessment for, even though the backend already allowed it.
  **Not fixed by loosening `GET /students`'s scoping** — that endpoint
  returns full roster data (names, admission numbers, DOB) for every
  student in a class, and widening its visibility for this one hybrid case
  would leak that roster data into a picker that only needs class *names*.
  Instead, switched the picker to `GET /academic/classes` (already used
  by `ClassLockScreen.tsx` for the same purpose) — it lists the school's
  class names with no roster/student data attached, and isn't scoped to
  the caller's own class at all, so every teacher now sees every class as a
  candidate. `checkTeacherContentScope()` on the backend is still what
  actually decides which of those choices are allowed to save; this change
  only fixes what the picker *shows*.

### Corrected — an inaccurate claim in the Pass 18 changelog entry
- Pass 18's entry claimed a parent could already message "the ward's other
  linked parent(s)". On re-reading the parent branch while making the fixes
  above, this was never actually implemented on either the reference branch
  or this codebase's own history — corrected in both the CHANGELOG (this
  note) and the doc comment above `getMessageableUsers()`. Not added as a
  new feature here since it wasn't part of this pass's ask; flagging in
  case it's wanted as a follow-up.

### Verified
- `npx tsc --noEmit` passes clean in both `backend/` and `mobile/`.
- Hand-trace: a teacher (no assigned_class, assigned_subject_id set) should
  now see every class in the school in the Create Assessment picker, and a
  save for a class they don't teach the subject in should still 403 from
  `checkTeacherContentScope()`. A student, parent, or teacher account should
  now see every admin in their contacts (previously: none, for any of the
  three). A soft-deleted student's login should show zero contacts and stop
  appearing as a classmate to others. None of this was run against a live
  database in this environment — recommend it as the first thing to check
  once this build is on the emulator/device.
- **Not attempted in this pass: actually producing a signed installable
  `.apk`.** This sandboxed environment has no network path to Expo's build
  infrastructure or the Android SDK/Gradle toolchain (its allowlist covers
  package registries — npm, PyPI, crates, GitHub — but not `expo.dev`,
  `dl.google.com`, or the Gradle plugin portal), so `eas build` or a local
  `expo run:android` can't run here. What this pass DID do: added
  `mobile/eas.json` (a `preview` profile producing an `.apk`, a
  `production` profile producing a Play-Store `.aab`) — without it, the
  `eas build -p android --profile preview` command already documented in
  the README would have failed outright, since no EAS Build config existed
  in the project at all. See the updated README note for the two things
  still needed before running that command for real: setting
  `app.json → expo.extra.apiUrl` to a real, phone-reachable backend URL
  (it's currently the Android-emulator-only `10.0.2.2` alias), and running
  the build from a machine with internet access to `expo.dev`.

## [Unreleased] — 2026-07-10 — Pass 18: Reconcile parent messaging scope (final scope.ts merge)

Last and most delicate of this porting sequence — the only one that
touches a function two *different* independently-developed branches had
each already modified, in different branches of the same conditional.

### Fixed — parents could only message their ward's class teacher, not subject teachers or admin
- `getMessageableUsers()`'s student branch (this codebase's own Pass 11/12
  lineage) already let a student message their class teacher, any subject
  teacher, any school admin, their own parent(s), **and their classmates**
  (same class, same school). The parent branch, however, had never been
  widened to match — a parent could only reach their ward's class
  teacher, full stop. This exact widening (parent → class teacher + any
  subject teacher + any school admin) existed on a *separate* branch (a
  different Pass 11) that never had classmate messaging at all — the two
  features were built independently and never merged before this pass.
- **What changed:** only the `parent` branch's query inside
  `getMessageableUsers()` (`backend/src/utils/scope.ts`). The `WHERE`
  condition on the joined `users` row now matches `(role = 'teacher' AND
  (assigned_class matches OR assigned_subject_id is set)) OR role =
  'admin'` — the identical shape already used by the student branch just
  above it — instead of the old `role = 'teacher' AND assigned_class
  matches` only.
- **What deliberately did NOT change:** the student branch (including its
  classmate-messaging block) is byte-for-byte untouched — verified by
  diffing the full function before and after this edit. `backend/src/
  routes/messages.ts` also needed no changes: both `GET /messages/contacts`
  and the `POST /messages` recipient check already route through this same
  `getMessageableUsers()` function, so widening it here widens both
  automatically. (`RECIPIENT_ERROR.parent`'s 403 copy in `messages.ts` —
  "You may only message your child's/children's class teacher(s)" — is now
  slightly stale wording, since a parent can be rejected for a recipient
  outside class-teacher/subject-teacher/admin/other-parent reach and get a
  message that undersells their actual scope; left as-is since this pass's
  brief was scope.ts only, flagging as a cosmetic follow-up.)
- **Also deliberately NOT done:** did not add a `deleted_at IS NULL` filter
  to this query, even though the reference branch's version of this same
  query has one — Pass 16 explicitly decided not to extend soft-delete
  filtering to `getMessageableUsers()` (a soft-deleted student's own login
  isn't auto-deactivated, so this was flagged as its own follow-up, not
  silently bundled into this pass).
- **Verified by hand-trace (no live database in this environment):**
  - A parent with a ward in JSS1 should now see: the JSS1 class teacher,
    every subject teacher in the parent's school (Math, English, etc.,
    regardless of which class they teach), every admin account, and the
    ward's other linked parent (already true) — where previously only the
    class teacher and other parent appeared.
  - A student in JSS1 should see exactly what they saw before this pass:
    their class teacher, every subject teacher, every admin, their own
    parent(s), and their JSS1 classmates — completely unchanged, since the
    student branch was never touched.
  - A teacher and an admin's own contact lists are unaffected — neither
    branch was touched.
- **Mobile:** no changes needed. `ChatsScreen.tsx` and `ChatThreadScreen.tsx`
  are confirmed still role-agnostic — they render whatever `/messages/
  contacts` returns (using `contact.role` only as a display label), exactly
  as noted when classmate messaging first shipped. Diffed against Pass 17's
  versions of both files: byte-identical, no drift across Passes 13–17.
- **Verified:** `npx tsc --noEmit` passes clean in `backend/`. Not verified
  against a live database in this environment — recommend the hand-trace
  scenarios above as the first thing to check on the Windows emulator this
  build is intended for.

## [Unreleased] — 2026-07-10 — Pass 17: Subject teachers can create materials/assessments for any class (merge-port from parallel branch)

### Fixed — a subject teacher (no assigned_class) couldn't publish materials or assessments for any class at all
- `POST /learning/materials` and `POST /learning/assessments` previously
  only checked `materials.write` / `assessments.create` — permissions every
  teacher has regardless of which class or subject they actually teach —
  so any teacher in a school could publish content for any class, in any
  subject, whether or not they teach it. There was also no path at all for
  a pure subject teacher (assigned to a subject, not a class) to publish
  content outside a class they happen to be the class teacher for.
- **New helper:** `checkTeacherContentScope()` (`backend/src/utils/scope.ts`)
  — a teacher may write content when EITHER their `assigned_class` matches
  the target `class_name` (a class teacher may publish for their class, in
  any subject), OR their `assigned_subject_id` matches the target
  `subject_id` (a subject specialist may publish in their subject for ANY
  class in their school). `class_name` may legitimately be null (a
  school-wide resource); that's fine as long as the subject matches. A
  teacher with neither an assigned class nor an assigned subject has no
  content scope at all and is refused outright (fail closed). Admin is
  unrestricted, as everywhere else.
- **Deliberately kept separate from `checkTeacherStudentScope()`/
  `checkTeacherDeleteScope`** (the function merged with the soft-delete and
  class-lock checks in Pass 16) rather than folding into it — content
  creation and per-student writes are different relationships (no student,
  no soft-delete concept, no class-lock concept for a material/assessment),
  so keeping the two functions apart avoids either one picking up checks
  that don't apply to it.
- **Routes updated:** `POST /learning/materials` and `POST
  /learning/assessments` now call `checkTeacherContentScope()` as an
  additional check before insert.
- **Scoped narrowly, matching the source branch and this pass's brief:**
  `POST /learning/questions` was NOT updated in this pass, even though the
  source branch applies the identical check there too (a question feeds
  directly into an assessment, so the gap is the same shape). Flagging as a
  known follow-up rather than silently expanding this pass's scope — the
  guardrail for this pass was explicitly "strictly to materials/assessments
  creation."
- **Mobile:** no changes needed. Verified `CreateAssessmentScreen.tsx` and
  `MaterialsScreen.tsx` are byte-identical to the source branch's versions —
  `MaterialsScreen.tsx` already takes class as a free-text "Class
  (optional)" field (no restriction to the teacher's own class), and
  `CreateAssessmentScreen.tsx`'s class picker is already populated from
  `GET /students`, which — for a teacher with no `assigned_class` — already
  returns every class in the school (unrestricted), so a subject teacher
  already sees every class as a valid choice. The one gap this doesn't cover
  is a teacher who has *both* an assigned_class and an assigned_subject_id:
  `GET /students` restricts to their own class whenever `assigned_class` is
  set, so that specific hybrid case would still only see their own class in
  the picker even though the new backend rule would allow more. Not fixed
  here since it wasn't reported as an issue and touches `GET /students`'
  own scoping, which is out of scope for this pass.
- **Verified:** `npx tsc --noEmit` passes clean in both `backend/` and
  `mobile/`. Not verified against a live database in this environment (no
  running Postgres instance available) — recommend testing: (1) a subject
  teacher (assigned_subject_id set, no assigned_class) can create a
  material/assessment for their subject in a class they don't teach; (2) a
  teacher with neither assigned_class nor assigned_subject_id is refused;
  (3) a class teacher can still publish for their own class in any subject,
  unchanged from before; (4) scores/attendance writes are completely
  unaffected (still gated by `checkTeacherStudentScope`, untouched by this
  pass).

## [Unreleased] — 2026-07-10 — Pass 16: Soft-delete + admin restore for students (merge-port from parallel branch)

Largest of the ports from the sibling branch to date — touches schema,
scope enforcement, the students routes, and the mobile admin UI.

### Fixed — DELETE /students/:id permanently destroyed every record tied to a student, with no undo and no real permission check
- Previously, `DELETE /students/:id` only required `grades.write` — the same
  permission every teacher has for routine score entry — so any teacher in a
  school (not just the student's own class/subject teacher) could
  permanently delete any other student's record. The delete was a hard
  `DELETE FROM students`, which (via `ON DELETE CASCADE`) instantly wiped
  every score, attendance record, class record, weekly effort, submission,
  and invoice ever recorded for that student, with no way back.
- **Schema:** added nullable `students.deleted_at` / `students.deleted_by`
  columns and an index on `deleted_at` (`backend/schema.sql`) — additive,
  safe to run against an existing database with data already in it.
- **Scope:** `checkTeacherStudentScope()` (`backend/src/utils/scope.ts`) now
  treats a soft-deleted student as not-found for every write path —
  including for admin — since a deleted record must be explicitly restored
  before anything can be written to it again. This merges cleanly with
  Pass 12's class-lock check already living in the same function: a write is
  now rejected if the student is deleted, OR if the class/term is locked,
  OR if the teacher lacks the base school/class relationship — all three
  checks coexist. `checkTeacherDeleteScope` is exported as an alias of the
  same function, used by the delete route below.
- **DELETE /students/:id:** now gated by `checkTeacherDeleteScope()` — a
  teacher may delete a student on their own, without admin approval, exactly
  when that student is under their class or subject care (the same
  relationship already required to write that student's scores/attendance);
  a teacher outside that relationship gets a 403 (404 for a cross-school
  id). The delete itself is now `UPDATE students SET deleted_at=now(),
  deleted_by=$1` instead of a hard delete, so historical scores/attendance
  still resolve correctly and nothing is destroyed.
- **New routes (admin only):** `GET /students/deleted` (lists soft-deleted
  students, optionally filtered by `school_code`) and
  `POST /students/:id/restore` (clears `deleted_at`/`deleted_by`).
- **Read-path filtering:** every existing student-visibility query now
  excludes soft-deleted students — roster (`GET /students`), `GET
  /students/wards`, `GET /students/me`, and `resolveViewerClassNames()`
  (which in turn scopes materials/assessments visibility for students and
  parents). `GET /students/:id` excludes deleted students for everyone
  except admin, who can still open a deleted student's detail page to see
  the "Restore" action.
- **Audit:** both delete and restore write to `audit_log`, with the delete
  entry noting which role performed it.
- **Mobile:** Admin → "Deleted Students" screen (`AdminExtraScreens.tsx`)
  lists deleted students for the selected school with a one-tap Restore;
  wired into `AdminStack.tsx` and the admin dashboard grid alongside the
  existing Class Locks entry. `StudentDetailScreen.tsx`'s delete button is
  now shown to teachers as well as admin (matching the backend's
  teacher-scoped delete), and its confirmation copy now explains the delete
  is recoverable via an admin restore rather than implying it's permanent.
- **Deliberately not touched in this pass:** `getMessageableUsers()`
  (messaging contacts) does not filter on `deleted_at` — a soft-deleted
  student's own linked login isn't automatically deactivated, so their
  classmates/parent/teacher contacts could still resolve. Flagging as a
  follow-up rather than changing silently, since it wasn't in this pass's
  listed read paths (roster/wards/me/GET :id/materials/assessments) and
  touches a different scoping helper with its own recent product-decision
  history.
- **Migration note for existing databases:** run the updated
  `backend/schema.sql` against your database (or just the new `ALTER TABLE`
  / `CREATE INDEX` statements at the bottom of the file) before deploying
  this pass — the two new columns are nullable and additive, so this is
  safe to run without downtime or a data backfill.
- **Verified:** `npx tsc --noEmit` passes clean in both `backend/` and
  `mobile/`. Not verified against a live database in this environment (no
  running Postgres instance available) — recommend testing: (1) a teacher
  deleting a student in their own class succeeds and the student disappears
  from roster/wards/me/materials but the row survives in the DB; (2) a
  teacher attempting to delete a student outside their class/school gets a
  403/404; (3) admin sees the student in `GET /students/deleted` and
  `POST /students/:id/restore` brings it back everywhere; (4) a write
  attempt (score/attendance) against a deleted student's id 404s even for
  admin, until restored.

## [Unreleased] — 2026-07-10 — Pass 15: Verified — scores/bulk & attendance validation (no change needed)

Third of six planned ports from the sibling branch (see Pass 13's entry
for context). This one turned out to require no code change.

### Checked, not changed — `/scores/bulk` and attendance validation
- The original merge analysis (comparing all three source builds before
  Pass 13 started) flagged two items as exclusive to the sibling branch:
  "`POST /scores/bulk` had none of the validation `POST /scores` has" and
  "attendance `days_present` had zero validation."
- Full file-by-file diff against the sibling branch's `scores.ts` and
  `attendance.ts` (not just a changelog-text comparison, the actual code)
  shows both are **already present and identical** in this codebase's
  lineage — `scoreEntrySchema`/`bodySchema` validation on `/scores/bulk`,
  and `validateDaysPresent()` (whole-number, non-negative, capped at the
  term's `days_opened`) on both single and bulk attendance routes. The only
  differences between the two branches in these two files are Pass 12's own
  class-lock scope-check plumbing (`student_id:term_id` keying) and audit
  calls — both already correct and untouched here.
- **Conclusion:** this was a mis-attribution in the original three-way
  comparison, not a real gap — these two validations were part of the
  shared Pass 10 baseline both branches inherited, not something the
  sibling branch added independently. No code was changed in this pass.
- **Verified:** `npx tsc --noEmit` passes clean in `backend/` and `mobile/`
  (no source changed, so this simply reconfirms the prior pass's clean
  state).

## [Unreleased] — 2026-07-10 — Pass 14: Admin Class Summary cross-school fix (merge-port from parallel branch)

Second of six ports from the sibling branch (see Pass 13's entry for the
full context on why these are being ported one at a time).

### Fixed — admin Class Summary silently blended two schools' same-named classes
- `GET /scores` (`backend/src/routes/scores.ts`) filtered by `class_name`
  but — for the `admin` role only — never scoped by `school_code`. The
  teacher branch already scoped by the teacher's own `school_code`; admin
  has no `school_code` of their own (by design, since they oversee every
  school), so this could only ever be caught by explicitly passing one in.
- Since class names aren't unique across schools (e.g. "JSS1" exists in
  both the primary and secondary school), an admin viewing one school's
  Class Summary/ranking screen would silently also pick up scores from the
  other school's same-named class — inflating or corrupting the ranking
  with no error or indication anything was wrong.
- **Fix:** `GET /scores` now accepts an optional `school_code` query param;
  when the caller is `admin` and supplies one, the query adds
  `AND s.school_code=$N`. `mobile/src/screens/AdminExtraScreens.tsx`
  (`ClassSummaryScreen`) now always passes the currently-selected admin
  school (`useAdminSchool()`'s `selectedSchoolCode`) on every fetch.
- **Scope of this fix:** deliberately narrow — the teacher-role branch of
  this same query (already correctly scoped) was left untouched, as was
  everything else in `scores.ts`.
- **Verified:** `npx tsc --noEmit` passes clean in both `backend/` and
  `mobile/`. Not verified against a live database with two schools' data in
  this pass (no running Postgres instance available in this environment) —
  recommend seeding both schools with a same-named class (e.g. "JSS1" in
  both), then confirming the admin Class Summary screen shows only the
  selected school's students, before shipping.

## [Unreleased] — 2026-07-10 — Pass 13: Secure token storage (merge-port from parallel branch)

This project has two parallel histories after Pass 10 — this branch (Pass
11 "Doc corrections + classmate messaging" → Pass 12 "Audit log gaps +
class locks") and a sibling branch that took Pass 11 in a different
direction ("Product-decision fixes"). Starting this pass, work items that
were only built on the sibling branch are being ported across one at a
time, in dependency order, rather than merged all at once. This is the
first of six such ports.

### Changed — auth tokens moved from AsyncStorage to expo-secure-store
- **Why:** `access_token`/`refresh_token` were stored in plain
  `AsyncStorage`, which is unencrypted on both Android and iOS — recoverable
  from a device backup, a rooted/jailbroken device, or (on older Android)
  another app with storage permissions. Since a stolen `refresh_token` is a
  7-day bearer credential for that account (`JWT_REFRESH_EXPIRES_IN`), this
  was a real exposure. `expo-secure-store` (Keychain on iOS,
  Keystore-backed EncryptedSharedPreferences on Android) was already listed
  in `mobile/package.json` but unused.
- **New `mobile/src/api/secureTokenStorage.ts`**: wraps
  `expo-secure-store` with a plain-`AsyncStorage` fallback on
  `Platform.OS === 'web'` (no native secure-storage primitive exists in a
  browser; this app's shipped target is Android/iOS, not web).
- **One-time silent migration**: `migrateLegacyTokens()` is kicked off once
  at `client.ts` module load and awaited lazily by the request interceptor,
  so the first request after this update — and every request after that —
  is guaranteed to see tokens already moved into `SecureStore`. Any
  already-logged-in user's existing plaintext tokens are read once, copied
  into `SecureStore`, and the old `AsyncStorage` copies are wiped. Without
  this, every user with the app already installed would be silently signed
  out the moment this update lands; with it, nobody has to log in again.
- **Updated call sites**: `mobile/src/api/client.ts` (request interceptor,
  401 refresh flow), `mobile/src/api/AuthContext.tsx` (`login`/`logout`),
  and `mobile/src/screens/ExportExcelScreen.tsx` (reads the token directly
  to attach it to a raw `fetch`/download call, bypassing the axios
  interceptor) — these are the only three places that touched
  `access_token`/`refresh_token` directly. The `user` object itself
  (id/username/role/school_code — no credential) intentionally stays in
  plain `AsyncStorage`, unchanged.
- **Merge note:** `client.ts` and `AuthContext.tsx` have both changed
  independently on *this* branch since Pass 10 (class-lock support added
  `assigned_class` to the `User` type in Pass 12's lineage; the
  in-flight-flush de-dupe guard on `flushOutbox()` was already present on
  both branches from Pass 10 and is untouched here). Only the token-storage
  calls were swapped — no other logic in either file was reverted or
  altered.
- **Verified:** `npx tsc --noEmit` passes clean in both `mobile/` and
  `backend/` after `npm install`. Not verified against a running Android
  emulator/device in this pass (no emulator available in this environment)
  — recommend a real login → background/kill app → relaunch → confirm
  still-logged-in round trip on a device before shipping, to exercise the
  migration path for real.

## [Unreleased] — 2026-07-10 — Pass 12: Audit log gaps + class locks

Raised directly by the school owner in response to the offline-conflict
gap flagged at the end of Pass 11 (two devices editing the same record
offline, whichever syncs second silently wins). Decision: leave that
specific mechanism as-is for now, but add two things instead — a proper
audit trail on the writes that were missing one, and a way for a class
teacher to stop writes to her class altogether once its records are final
for a term. Neither of these "fixes" the underlying overwrite race in the
general case; they make it visible after the fact (audit log) and give
staff a way to avoid it entirely for the period that matters most — once a
term is being closed out.

### Audit log — four writable endpoints had no audit trail at all
`utils/audit.ts` already existed and was already used by user management,
score entry (`POST /scores`), class-record remarks, login, and student
management. But **`POST /scores/bulk` — the only score-writing endpoint the
mobile `ScoreEntryScreen` actually calls — was never audited**, nor were
`PUT /attendance`, `PUT /attendance/bulk`, or `POST /weekly-efforts`. In
practice this meant the two most common write actions in the app (entering
a class's scores, marking a class's attendance) left no trace of who did it
or when. All four now call `audit()` with a per-batch summary (one log line
per save, not one per student — a 30-student class save would otherwise
flood the log). No `GET /admin/audit-log` or mobile `AuditLogScreen` changes
were needed — both are already fully generic and pick up new action types
automatically.

Also flagged, not fixed in this pass (kept in scope to what was asked):
materials/questions/assessments (`learning.ts`) and finance/invoices
(`finance.ts`) mutations are similarly unaudited. Finance in particular is
worth a follow-up pass given it's money.

### Class locks — a class teacher can now "close" her class's records
New `class_locks` table (`school_code`, `class_name`, `term_id`,
`locked_by`, `locked_at`). While a lock row exists for a given class+term,
every write to that class's scores, attendance, class-record remarks, and
weekly efforts is rejected with a 403 explaining who locked it and when —
**including the class teacher's own further writes**, which is the actual
point: this is for closing out a term, not just restricting other people.
Admin is never blocked by a lock (matches the "admin unrestricted" pattern
used everywhere else in this app) and can always unlock any class, e.g. if
the class teacher is unavailable and a correction is needed.

- **Enforcement is centralized**: `checkTeacherStudentScope()`
  (`utils/scope.ts`) now takes an optional `termId` and checks
  `class_locks` right after its existing school/class checks. Every one of
  the four write routes already called this function for the school/class
  check, so passing `termId` through (already available at every call site)
  was the entire enforcement change — no route duplicates the lock check
  itself. `POST /scores/bulk`'s scope-check loop was also corrected in the
  process: it was keyed by student only, which would have checked the wrong
  student/term combination's lock status for a student who appears twice in
  one batch under two different `term_id`s; it's now keyed by
  `student_id:term_id` pairs.
- **New routes** in `academic.ts`: `GET /academic/class-locks` (read status)
  and `PUT /academic/class-locks` (lock/unlock, body `{class_name, term_id,
  school_code?, locked}`). A teacher may only lock/unlock her own
  `assigned_class`; admin must specify `school_code` (no school of their
  own) and may lock/unlock any class. Both actions are audited
  (`lock_class` / `unlock_class`).
- **`POST /auth/login`'s response now includes `assigned_class`** in the
  `user` object — it was already being fetched and put into the JWT
  payload, just never actually sent to the client. The mobile app needs it
  to know which class (if any) a teacher can lock, without a separate
  round trip.
- **New mobile screen**: `ClassLockScreen.tsx`, reachable from both
  Teacher → Classes → "Close Term Records" and Admin → Dashboard → "Class
  Locks". Shows current lock status (who, when) for a chosen class+term and
  a single lock/unlock button. No changes were needed to
  `ScoreEntryScreen`/`AttendanceScreen`/`StudentDetailScreen`/
  `WeeklyEffortsScreen` — their existing `catch (e) { Alert.alert('Error',
  e?.response?.data?.error ...) }` pattern already surfaces whatever the
  backend sends, including the new lock-rejection message, with zero
  screen-level changes.
- Not verified against a live database in this pass (no running Postgres
  instance available in this environment) — both backend and mobile
  typecheck clean (`npx tsc --noEmit`), but run an actual lock → attempt a
  write → confirm 403 → unlock → confirm write succeeds round-trip before
  shipping.

## [Unreleased] — 2026-07-10 — Pass 11: Doc corrections + classmate messaging

### Docs corrected (no code change)
- **README.md said `POST /auth/signup` exists ("Self-register — teacher/parent
  only").** It doesn't — `backend/src/routes/auth.ts` has an explicit comment
  stating self-signup was deliberately removed at the school owner's request,
  and account creation is admin-only (`POST /admin/users`). The signup row
  has been removed from the API table and replaced with a note on how
  accounts actually get created. This was a stale doc, not a stale feature —
  the code was already correct; only README had drifted.
- **README's Offline Support section implied everything works offline.**
  Two real exceptions were verified in code and added: first login (needs a
  live round trip to issue tokens) and admin's Excel export
  (`ExportExcelScreen.tsx` downloads a binary file directly via
  `expo-file-system`, bypassing the cache/outbox entirely).

### Added — students can message their classmates
- **What changed:** `getMessageableUsers()` (`backend/src/utils/scope.ts`),
  the single source of truth for both `GET /messages/contacts` and the
  `POST /messages` recipient check, now also returns other students who (a)
  have a login, (b) are in the same `class_name`, and (c) are in the same
  `school_code` as the caller. Nothing else in the student scope changed —
  class teacher, subject teachers, admin, and own parent(s) are all still
  included exactly as before.
- **Why scoped to classmates only, not "any student":** this app is used by
  minors. An open student directory (any student messaging any other student
  school-wide or across schools) is a materially different — and much
  harder to moderate — safety surface than "the people already in your own
  classroom." Same-class-same-school mirrors real-world exposure a student
  already has. If cross-class or cross-school student messaging is wanted
  later, treat it as its own explicit product decision, not a natural
  extension of this one.
- **No mobile changes needed:** `ChatsScreen.tsx`/`ChatThreadScreen.tsx` are
  already role-agnostic — they render whatever `GET /messages/contacts`
  returns and open a thread with whatever recipient was tapped. A classmate
  now simply appears in a student's contact list like any other allowed
  recipient, with the same "Direct" messaging UI, unread badges, and offline
  queueing (queued sends already work per-verb, not per-role — see
  `api/client.ts`).
- **Error message updated:** the 403 shown when a student tries to message
  someone outside their allowed scope now reads "You may only message your
  teachers, admin, your parent(s), or a classmate" (was previously silent on
  classmates since they weren't allowed at all).
- Not verified against a live database in this pass (no running Postgres
  instance available in this environment) — the query mirrors the existing,
  already-verified pattern for parent/admin scope in the same function
  (`u.role = 'x' AND EXISTS (...)`), but run a real create-two-same-class-
  students → message → verify round-trip before shipping.

## [Unreleased] — 2026-07-10 — Pass 10: Cross-cutting (offline, errors, edge cases) — FINAL PASS

Live-tested against a real Postgres 16 instance + running backend, real HTTP
requests via curl and a couple of small standalone Node repro scripts that
mirror the mobile app's exact `client.ts`/`offline/storage.ts` logic (no
emulator/adb in this sandbox — same tracing approach as every prior pass).
Created fresh test fixtures for this pass: one `secondary`/JSS1 student and
a `parent` account linked to them (neither ships in this zip, per the usual
per-pass policy). Four bugs found and fixed, all cross-cutting in the sense
the previous nine passes flagged this pass to look for: a race condition in
the offline sync path, and three missing-validation gaps that mirror each
other across scores/attendance/terms.

### Fixed — duplicate offline-queued writes on reconnect (e.g. duplicate messages)
- **Root cause:** both `client.ts`'s own module-level `subscribeConnectivity`
  listener and `OfflineBanner.tsx`'s separate listener called `flushOutbox()`
  on every reconnect event, with nothing to stop them running concurrently.
  The old `flushOutbox()` read the entire outbox into memory once at the top
  of the function, so two overlapping calls both saw the same still-queued
  items and both dispatched every one of them to the server before either
  had gotten far enough to remove anything from storage.
- **Impact:** for outbox items hitting a table with a `UNIQUE` constraint
  (`scores`, `attendance`) the second copy just failed on the constraint and
  was misreported as a dropped/invalid item (`failed: 1`) even though the
  first copy had actually succeeded. For `messages` — which has no such
  constraint — this created a real duplicate row: **a message sent once
  while offline would arrive twice** once the device reconnected.
- **Live repro (before fix):** a small standalone script implementing the
  exact same outbox/flush logic as `client.ts` (verified line-for-line
  against the real file) queued one `POST /messages`, then fired two
  concurrent `flushOutbox()` calls exactly as the two real listeners would —
  both reported `synced: 1`, and the real `messages` table ended up with
  **2** identical rows.
- **Fix:** `flushOutbox()` in `mobile/src/api/client.ts` now guards its body
  behind an in-flight-promise lock — any number of concurrent callers (the
  two existing ones, or any added later) collapse into a single actual
  flush and all `await` the same result.
- **Verified after fix:** same repro, same two concurrent calls → exactly
  **1** message row. A subsequent *sequential* flush (after the lock
  cleared) still ran normally and synced a second, genuinely-new queued
  message — confirming the fix doesn't block legitimate later syncs.
- `mobile/src/api/client.ts`.

### Fixed — `POST /scores/bulk` had none of the validation `POST /scores` has
- **Root cause:** `ScoreEntryScreen.tsx` (the only mobile screen that writes
  scores) calls `POST /scores/bulk`, not the single-score `POST /scores`.
  The single-score route validates shape via a `zod` schema and rejects any
  `ca1`/`ca2`/`exam` over the student's school's configured max
  (`ca1_max`/`ca2_max`/`exam_max`) — `/bulk` did neither.
- **Live repro (before fix):** `secondary` school caps CA1 at 15.
  `POST /scores/bulk` with `ca1: 50` saved silently (`{"saved":1}`, row
  landed in the DB with `ca1: 50.00`, grade computed off the inflated
  total). A large enough overflow (`ca1: 999`) instead hit the `total`
  generated column's `NUMERIC(5,2)` precision limit and crashed with a raw,
  unhelpful `"Internal server error"` 500 rather than a clean validation
  message.
- **Fix:** extracted the single-score route's `zod` schema to a shared
  `scoreEntrySchema` used by both routes; `/bulk` now validates the whole
  `scores` array's shape, then re-checks every row's `ca1`/`ca2`/`exam`
  against its student's school config (cached per student within the
  request to avoid one query per row) before writing anything.
- **Verified after fix:** the `ca1: 50` and `ca1: 999` repros above both now
  return a clean `400` with the same message `POST /scores` already gives,
  and nothing is written. A valid in-range batch save still succeeds
  unchanged, and the single-score route (now sharing the extracted schema)
  still rejects/accepts exactly as before.
- `backend/src/routes/scores.ts`.

### Fixed — attendance `days_present` had zero validation
- **Root cause:** neither `PUT /attendance` nor `PUT /attendance/bulk`
  (`AttendanceScreen.tsx` calls the latter) checked `days_present` for
  being a non-negative integer, or for fitting within the term's own
  `days_opened`.
- **Live repro (before fix):** `days_present: -5` and `days_present: 9999`
  (term's `days_opened` was 60) both saved without error — either would
  produce an attendance percentage over 100% or negative on any report
  reading that row.
- **Fix:** added a shared `validateDaysPresent()` check (non-negative,
  integer, `<= days_opened` for the given term) to both routes; `/bulk`
  validates every entry against the batch's term before writing any of it,
  matching the existing all-or-nothing pattern already used there for scope
  checks.
- **Verified after fix:** negative, non-integer, and over-`days_opened`
  values are all now a clean `400` on both routes (nothing partially saved
  on the bulk route), while a valid value still saves unchanged.
- `backend/src/routes/attendance.ts`.

### Fixed — term `days_opened` had zero validation (and could break the attendance fix above)
- **Root cause:** `POST /terms` and `PUT /terms/:id` never validated
  `days_opened` — found while testing the attendance fix above:
  `AttendanceScreen.tsx` also lets an admin update the term's
  `days_opened` inline, and a negative value there (`-20`, live-verified
  it saved) would then make the new `days_present` check reject even a
  valid `days_present: 0`, since `0` is not `<= -20`.
- **Fix:** added a shared `validateDaysOpened()` check (non-negative
  integer, or omitted) to both routes.
- **Verified after fix:** negative and non-integer values are now a clean
  `400` on both `POST /terms` and `PUT /terms/:id`; a valid update
  (restoring the term to `60`) and a valid new-term creation both still
  succeed unchanged.
- `backend/src/routes/academic.ts`.

### Checked, not changed — role-branch sweep
Grepped every screen with `role ===` branching (`AcademicMgmtScreens`,
`AssessmentsScreen`, `DashboardScreen`, `FinanceScreen`, `MaterialsScreen`,
`ScoreEntryScreen`, `WeeklyEffortsScreen`, plus `MyResultsScreen`/
`SessionReportScreen` already fixed in Pass 9) for the `if (role==='x'){}
else if (role==='y'){}` -with-no-fallback shape that caused Pass 9's bug.
Cross-checked each against `RootNavigator`/`*Tabs.tsx` to confirm which
roles can actually reach each screen. No new instance of that shape found —
`AssessmentsScreen`/`MaterialsScreen` are only ever registered for
student/teacher/admin (not parent) navigators, which is a real product
restriction, not an unreachable/broken branch. `WeeklyEffortsScreen`'s
teacher/parent/student branches all correctly match their own
`GET /weekly-efforts` server-side scope, live-verified per role.

### Checked, not changed — `OfflineBanner`/`client.ts` claims from the original handoff
Re-verified the standing claim that `client.ts` has real token-refresh-on-401,
an offline outbox, and GET response caching: confirmed all three still work
as described by tracing `network.ts` (genuinely uses `NetInfo`, not a stub),
`storage.ts`, and the request/response interceptors in `client.ts`. The one
real bug in this area was the concurrent-flush race fixed above.

### Checked, not changed — empty-state data
`ClassSummaryScreen` (0 students in a class → empty `classes`/`ranked`
arrays, no crash), `ScoreEntryScreen` (0 students in a class → existing
`Empty` component, no crash) both traced end-to-end and confirmed safe.
`GET /scores/report/:student_id` and `GET /scores/session-report/:student_id`
were already confirmed safe on zero-score data in Pass 9.

**Flagged, not built — a small client-side gap, not a data-safety issue:**
`ScoreEntryScreen.tsx` shows the school's CA1/CA2/exam max as a hint label
but doesn't clamp the input or block Save client-side if a teacher types
over it — the request just gets the new server-side `400` above instead of
a silent save. Worth a client-side clamp/inline-error for a nicer UX, but
not a data-integrity risk anymore now that the backend enforces it either
way.

## [Unreleased] — 2026-07-10 — Pass 9: Reports

Live-tested against a real Postgres 16 instance + running backend, real HTTP
requests via curl (no emulator/adb in this sandbox — traced each screen's
exact API calls and exercised those same calls live). Created fresh test
data for this pass: two `secondary`/JSS1 students (with real, distinct
CA1/CA2/exam scores across all three terms of 2024/2025 for one of them, a
single-term partial record for the other), a `primary`/Grade 1 student with
zero scores (empty-state check), a 2nd and 3rd term for `secondary`
(only 1st Term existed after seed), a student user account and a parent
account linked via `link-user`/`link-parent`. None of this ships in this
zip (test data never carries over between passes).

Went in assuming report math itself was the main risk, per the previous
handoff's framing — it wasn't. `GET /scores/report/:student_id` and
`GET /scores/session-report/:student_id` both hand-checked correct: pulled
the raw `scores` rows via `psql` for a student with 77/84 totals recorded
identically across all three terms, and the API's `total_score`/`average`
(term report: 161 / 80.5) and `grand_total`/`grand_average` (session report:
483 / 80.5) matched by-hand arithmetic exactly, including `class_average`/
`class_highest` computed correctly against a second student in the same
class. Per-role scoping was also live-verified correct on both report
routes: a linked parent got their own ward's report and a clean `403` on an
unrelated student's; a student got their own and a `403` on someone else's;
a teacher got their own-school student's report and a `403` on a
cross-school student. The admin-`NULL`-school_code footgun that hit Pass
7/8 doesn't apply here — both routes resolve a specific student by id, not
a bare `WHERE school_code=$1` list query. Zero-score empty states (a
student with no scores yet in the resolved term) also confirmed non-crashing
(`total_score: 0, average: 0`, no divide-by-zero).

The real bugs this pass were both frontend, and both about **admin/teacher
never being able to open a student's report card at all**, not about wrong
numbers once you get there:

### Fixed — "View Full Report Card" / "View Session Report" completely broken for admin
- **`MyResultsScreen.tsx` and `SessionReportScreen.tsx` only ever branched
  on `user.role === 'parent'` or `'student'`** when deciding which student
  id to fetch a report for. `StudentDetailScreen.tsx` has always had a
  "View Full Report Card" button, reachable by admin from `Students` →
  any student, that calls
  `navigation.navigate('MyResults', { parentStudentId: studentId })` — but
  since admin matched neither branch, `studentId`/`url` was left as the
  empty string `''`, and `api.get('')` silently resolved against the
  client's own `baseURL` (the API's root health-check route,
  `{status:"ok",...}`, not a report), so the screen always rendered "No
  report available" for every admin, for every student, since the button
  was built. Live-verified the exact failure mode: `curl`'d the API root
  with a valid admin token and got back `{"status":"ok","app":"Sow the
  Seed School API","version":"1.0.0"}` — no `student` key, which is exactly
  what makes `MyResultsScreen`'s `if (!report || !report.student)` guard
  fire and show the empty state. The backend route itself
  (`GET /scores/report/:student_id`) already fully supports admin callers
  with no restriction (verified above) — this was purely a missing
  frontend branch. Fixed by adding an `admin`/`teacher` branch to both
  screens that uses the `parentStudentId`/`effectiveWardId` param already
  being passed in from `StudentDetailScreen`. Re-verified by tracing the
  full call chain end-to-end: `StudentDetailScreen` → `parentStudentId` →
  `MyResultsScreen`'s new branch → `GET /scores/report/:id` → real data.
- **The same missing-role-branch bug also existed in `SessionReportScreen`
  independently** (reached via `MyResultsScreen`'s "View Session Report"
  button, which forwards the same `parentStudentId`) — fixed the same way.

### Fixed — teacher's "View Full Report Card" button crashed navigation entirely
- **Found while checking whether the above admin fix also covered
  teacher** (the button is unconditional in `StudentDetailScreen.tsx`, not
  gated by role, and teachers reach the same `StudentDetail` screen from
  their own `Classes` tab): `TeacherTabs.tsx`'s `ClassesStack` registers
  `StudentDetail` but never registered a `MyResults` or `SessionReport`
  screen anywhere in the whole teacher navigator. Tapping "View Full Report
  Card" as a teacher would have thrown React Navigation's "screen doesn't
  exist in this navigator" error, not just shown an empty state — worse
  than the admin case, since admin's screens at least existed and rendered
  (incorrectly empty), while teacher's navigation action would have failed
  outright. This is a separate root cause from the two fixes above (a
  missing route registration, not a missing role branch) that happened to
  surface from the same "who can reach the Report Card button" question, so
  fixing it in the same pass rather than deferring — per the working style
  note that a bug found deeper than it first looks is fine to follow to a
  real fix as long as each piece is verified independently. Fixed by adding
  `MyResults` and `SessionReport` to `TeacherTabs.tsx`'s `ClassesStack`,
  reusing the same screens/backend routes admin now correctly uses (backend
  already scopes teacher to their own school on both routes, verified
  above). Re-verified via `npx tsc --noEmit` on `mobile/` (clean) and by
  re-tracing the teacher navigation path: `ClassesTab → Students →
  StudentDetail → MyResults` now resolves to a registered screen.

### Flagged, not changed — low-priority, currently unreachable
- **`ClassSummaryScreen.tsx`'s ranking query (`GET /scores?class_name=X&
  term_id=Y`) has no school-code scoping for admin**, only `class_name` —
  if two schools ever had a class with the identical name, an admin viewing
  one school's Class Summary could see scores blended in from the other
  school's same-named class. Checked whether this is actually reachable
  today: `classes` table has `UNIQUE(school_code, name)`, not a global
  unique constraint, so it's possible in principle — but `academic.ts` only
  exposes `GET /academic/classes` (read-only, no `POST`/`PUT`/`DELETE`), so
  the seeded class lists (`Nursery 1..Grade 6` for primary,
  `JSS1..SS3` for secondary — no overlap) can't currently be edited via any
  route the app or a direct API caller can reach. Same shape as Pass 8's
  `fee_items`→`invoice_items` cascade note: not exploitable today, only
  worth revisiting if a "manage classes" endpoint gets built later.

## [Unreleased] — 2026-07-10 — Pass 8: Finance & exports

Live-tested against a real Postgres 16 instance + running backend, real HTTP
requests via curl (no emulator/adb in this sandbox — see handoff note).
Created fresh cross-school test data for this pass: `primary`- and
`secondary`-school students, fee items in both schools, a `primary`-school
parent linked to a `primary` student, invoices spanning both schools — none
of it ships in this zip (test data never carries over between passes).
Postgres and the backgrounded `tsx watch` process both died silently
mid-pass exactly as the Pass 7 handoff warned they might; recovered with the
documented restart-and-retry-in-one-call approach both times, no code was
at fault.

Checked first, per the handoff note's specific ask, whether
`finance.ts`/`admin.ts`'s finance routes had the same "write endpoint
trusts a role-wide permission with no relationship scoping" shape that
broke in Pass 4 and Pass 7. They don't, structurally: every finance *write*
(`POST /admin/finance/fee-items`, `POST /admin/finance/invoices`,
`PUT /admin/finance/invoices/:id/status`) lives under `admin.ts`, which
gates the whole router on `requireRole('admin')` — there's no
teacher/parent/student write path to leak through in the first place, and
admin having cross-school reach here is the existing intended design (same
as `export/excel`, same as messaging contacts fixed in Pass 7), not a bug.
The finance *reads* in `finance.ts` (`GET /fee-items`, `GET /invoices`) do
have real per-role scoping (parent → own ward only via `parent_wards`,
teacher → own school only, student → self only) and were live-verified
correct for all four roles, including attempts to widen access via
`student_id=`/`school_code=` query-param overrides (blocked in both cases —
confirmed by reading the code and confirmed live). So this pass's real bugs
turned out to be data-integrity gaps in the admin-only write paths and one
generic, shared bug in error handling — not access-control leaks.

### Fixed — silently-empty "successful" Excel export
- **`GET /admin/export/excel` returned a real `200` with a real `.xlsx`
  attachment — but a useless one — whenever `school_code` couldn't be
  resolved**, i.e. whenever called with no `?school_code=` param, because
  admin's own `school_code` is `NULL` (same root cause as the Pass 7
  contacts bug) and every sheet's query does `WHERE school_code=$1` with
  `$1 = NULL`, which matches nothing in Postgres. Live-verified: hit the
  endpoint with no query param, got `HTTP 200`, downloaded a 17.5KB file
  that opened fine in Excel/openpyxl and *looked* like a successful export,
  but every sheet was header-only (0 data rows) and the Scores sheet was
  missing entirely. The mobile `ExportExcelScreen.tsx` always sends an
  explicit `school_code` from its picker (default `'primary'`), so this
  wasn't reachable from the app's own UI — but any direct API caller, or
  a future UI regression that dropped the param, would get a silently
  wrong "successful" file with zero indication anything went wrong. Unlike
  the Pass 7 contacts fix (where admin got global reach across all
  schools), this report is inherently single-school by design (mirrors the
  school picker), so the fix here is a real `400` when `school_code` is
  missing or doesn't match a row in the `schools` table, rather than
  admin-sees-everything. Re-verified: no param → `400` with a clear
  message; `?school_code=nonexistent` → `400`; `?school_code=primary` →
  unchanged `200` with full data, byte-for-byte the same sheets as before
  the fix.

### Fixed — Postgres foreign-key error mis-messaging on create/update
- **The global `23503` (foreign_key_violation) handler in `src/index.ts`
  assumed every FK violation was a blocked `DELETE`** (something already
  referencing a row you're trying to remove — the case it was written for
  in Pass 2) and always returned `"This can't be deleted because it still
  has related records..."`, **including when the violation actually
  happened on `INSERT`/`UPDATE`** because the new row pointed at a parent
  that doesn't exist. Live-verified via `POST /admin/finance/invoices`
  with a `student_id` that doesn't exist: got back `HTTP 409` with *"This
  can't be deleted because it still has related records (in
  \"invoices\")"* — nonsensical for a create request, and actively
  misleading about which table/direction the problem was in. This is a
  shared, app-wide handler, not finance-specific, so the same wrong
  message would have fired for any bad foreign-key reference on any
  `INSERT`/`UPDATE` anywhere in the app (e.g. a bad `term_id`,
  `subject_id`, `entered_by`, etc.) — finance invoice creation is just
  where this pass happened to hit it first. Fixed by branching on
  Postgres's own `detail` wording, which already reliably distinguishes the
  two cases (`"is not present in table"` for a bad reference on
  insert/update vs. `"is still referenced from table"` for a blocked
  delete) — no schema or query changes needed. Re-verified both directions
  after the fix: bad `student_id` on invoice creation now returns `400`
  with *`student id "..." doesn't match an existing record.`*; the
  original Pass-2 case (deleting a teacher who has already entered scores,
  reconstructed live via a temporary test score row) still correctly
  returns `409` with the original "can't be deleted" message, unchanged.

### Fixed — invoice creation accepted data that didn't add up
- **`POST /admin/finance/invoices` did no validation at all on its inputs**,
  live-verified three ways: (1) a `primary`-school student could be
  invoiced using a `secondary`-school fee item — wrong amount charged
  (₦80,000 secondary tuition landed on a primary pupil's invoice), no
  error, no warning; (2) a `fee_item_ids` array mixing one real id with one
  nonexistent one silently dropped the bad one and created an invoice for
  less than the admin evidently intended, again with no error; (3) an
  empty `fee_item_ids` array created a real, persisted ₦0 invoice. None of
  this is a cross-school *access* leak (only admin can reach this route),
  but it's the same "write endpoint trusts its inputs with no relationship
  check" shape flagged after Pass 4 and Pass 7 — here showing up as a
  money/data-integrity bug rather than an authorization one. Added
  validation, in order: `fee_item_ids` must be a non-empty array; the
  `student_id` must resolve to a real student (404 otherwise, with the
  now-correctly-worded error from the fix above); the `term_id` must
  resolve to a real term belonging to *that same student's* school (400
  otherwise); every `fee_item_id` must exist, and must belong to that same
  school (400 otherwise, naming the mismatched fee item). Re-verified all
  six cases live — the three original bugs now correctly reject with a
  `400`/`404` and a specific message, and the legitimate matching-school
  path still succeeds unchanged (same total, same response shape).
- **`PUT /admin/finance/invoices/:id/status` accepted any string as
  `status`, and returned `200` with an empty `{}` body for a nonexistent
  invoice id instead of a `404`.** Live-verified: set a real invoice's
  status to `"asdfasdf_not_a_real_status"` and got `HTTP 200` back — the
  mobile `FinanceScreen.tsx`'s `STATUS_COLOR` map and the `?status=`
  filter on `GET /finance/invoices` only know `'unpaid'`/`'partial'`/
  `'paid'`, so a bad value silently fell out of both (badge renders in a
  fallback gray, filtering by any real status stops finding that
  invoice). Also live-verified `PUT` on a random nonexistent invoice id
  returning `200 {}` rather than a `404`. Fixed with the same enum-check
  pattern already used for assessment status in `routes/learning.ts`
  (`PUT /assessments/:id/status`), plus a `rows[0]` existence check.
  Re-verified: garbage status → `400` with the valid options listed;
  nonexistent invoice id → `404`; valid status update → unchanged `200`
  behavior.

### Flagged, not changed — product/UX decisions
- **There is no mobile UI for creating fee items or invoices at all.**
  `FinanceScreen.tsx` (the only finance screen, used by admin/parent/
  teacher alike) can *view* fee items and invoices and admin can *mark an
  invoice paid*, but creating a fee item or generating a student's invoice
  has no screen anywhere in `AdminStack.tsx` — the backend routes
  (`POST /admin/finance/fee-items`, `POST /admin/finance/invoices`) exist
  and work (see fixes above) but are only reachable via direct API calls
  today. Didn't build new screens for this unilaterally per the working
  style — flagging so you can decide whether that's an intentional
  "backend-first, UI later" gap or something to prioritize.
- **`fee_items` → `invoice_items` is `ON DELETE CASCADE`** (checked in
  `schema.sql`, not reachable via any route since there's no
  `DELETE /admin/finance/fee-items/:id` endpoint at all): deleting a fee
  item that's already been invoiced would silently cascade-delete the
  corresponding `invoice_items` rows without recalculating the parent
  invoice's stored `total`, leaving a stale total that no longer matches
  its line items. Purely theoretical right now (no route triggers it,
  confirmed by grepping for every finance route) — noting it in case a
  delete/edit-fee-item screen gets built later, since that would be the
  moment this becomes reachable.
- Invoice status is a free-text column with no DB-level `CHECK` constraint
  (now enum-validated at the application layer per the fix above, but the
  column itself would still accept anything via a direct DB write or a
  future second code path). Not changed — a DB constraint is a real schema
  migration decision, not a same-pass judgment call.

## [Unreleased] — 2026-07-09 — Pass 7: Messaging & notifications

Live-tested against a real Postgres 16 instance + running backend, real HTTP
requests via curl (no emulator/adb in this sandbox — see handoff note).
Created fresh cross-school test data for this pass: a `primary`-school
teacher/student/parent trio alongside the existing `secondary`-school
`teacher1`, specifically to probe cross-school messaging.

### Fixed — security (confirmed live, not just read from code)
- **`POST /messages` let `parent`/`teacher`/`admin` senders message *any*
  user in the system, including across schools and with zero relationship
  to the recipient.** The route only checked recipient scope for `student`
  senders (`studentAllowedRecipients()`); every other role was gated on
  `messages.write` alone — a permission every account of that role has,
  everywhere. `GET /messages/contacts` (what the Chats/Messages UI actually
  shows and lets someone tap) was correctly scoped per role the whole
  time — the gap was purely that the *write* side never checked the same
  thing. Live-verified: `secparent1` (`secondary` school, whose own
  contacts list correctly showed only their ward's class teacher)
  successfully sent a direct message to `pristudent1`, a `primary`-school
  student with zero relationship to them, just by passing that student's
  user id as `recipient_id`. `teacher1` (`secondary`) did the same to
  `priparent1` (`primary`) — an entirely unrelated parent in a different
  school. This is exactly the "student/parent messaging someone they
  shouldn't" case this pass's plan called out, just found on the
  parent/teacher side rather than student (student-side was already
  correctly enforced and re-confirmed still blocked). Fixed with a new
  shared `getMessageableUsers()` helper (`backend/src/utils/scope.ts`,
  mirroring the `resolveViewerClassNames()` pattern from Pass 6) that both
  `GET /messages/contacts` and `POST /messages` now call — the write path
  enforces exactly what the read path already promised, for every role.
  Re-verified after the fix: the same two cross-school sends now correctly
  403 with a role-specific message, while legitimate same-school flows
  (teacher → their student's parent, parent → their ward's class teacher)
  still work.
- Old `rbac.ts` had a `canMessage()` function with a comment stating
  "Parents, teachers, admin: can message anyone" — traced its call sites
  before assuming it was live logic (per the working-style note about
  verifying "dead code" claims): it's never imported or called anywhere.
  `routes/messages.ts` has always had its own separate, inline enforcement
  that diverged from that comment. Left `canMessage()` in place (unused,
  same as found) rather than deleting unrelated dead code in a messaging
  pass — worth a follow-up cleanup pass if it's confirmed to have no other
  callers planned.

### Fixed — broken feature (admin messaging was completely unusable)
- **`GET /messages/contacts` always returned an empty list for `admin`
  accounts.** The old query did `... FROM users WHERE school_code=$1 ...`
  for the teacher/admin branch, using the caller's own `school_code` as
  `$1` — but `admin.school_code` is `NULL` in this schema (admin isn't
  scoped to one school), and `school_code = NULL` never matches anything in
  SQL. Live-verified: logged in as `admin`, `GET /messages/contacts`
  returned `{"contacts": []}` — meaning the Admin "Messages" screen
  (`MessagesScreen.tsx`, used only by `AdminStack`) has shown "No contacts
  available" and been entirely unusable since it was built, for every admin
  account, ever. `getMessageableUsers()` (see above) now gives `admin` every
  other active user across every school — matches `permissions.admin =
  ['*']` used everywhere else in the app, and is also a **behavior change**
  worth calling out explicitly: before this fix, `POST /messages` for admin
  had no scoping at all (same bug as parent/teacher above) but happened to
  "work" by accident since nothing blocked it; now it's properly scoped to
  "every active user," which is the same practical reach but through an
  intentional, enforced path instead of an absent one. Live-verified:
  `admin` → `secstudent1` (a student, different implicit "school" than
  admin's own null one) now succeeds via the fixed path.

### Implemented — unread counts & notification delivery (Pass 7 test scope)
- **`GET /messages/contacts` now returns `unread_count` and
  `last_message_at` per contact.** Previously absent entirely — `ChatListItem`
  (the WhatsApp-style row component used by `ChatsScreen`) already accepted
  `unread` and `timeLabel` props, but `ChatsScreen` never passed them
  because the backend never sent the data to pass. Added a single grouped
  query (`GROUP BY` the other-party id, `COUNT(*) FILTER` for unread,
  `MAX(created_at)` for last-message time) rather than one round-trip per
  contact. Live-verified end-to-end: `teacher1` messages `secparent1` twice
  → `secparent1`'s contacts list shows `unread_count: 2` for `teacher1` →
  `secparent1` opens the conversation (`GET /messages/conversation/:other`,
  which already marked messages read — unchanged) → contacts list now shows
  `unread_count: 0` for the same contact, `last_message_at` preserved.
- **`ChatsScreen.tsx`** now sorts contacts by `last_message_at` (most
  recent first, WhatsApp-style) and passes `unread`/`timeLabel` through to
  `ChatListItem`; also refreshes contacts on screen focus so returning from
  a just-read thread updates the badge without a manual pull-to-refresh.
  (`MessagesScreen.tsx`, the admin-only variant, is unaffected — it never
  rendered `unread`/`timeLabel` in the first place and the new response
  fields are purely additive.)
- **`NotificationsContext.tsx`'s own comment always claimed this feed
  covered "unread-looking conversations," but the code never actually built
  any `kind: 'message'` notifications** — only `'assessment'` ones. The
  `AppNotification` type included `'message'` as a valid `kind`, and
  `NotificationsScreen`'s icon map (`KIND_ICON`) already had an entry for
  it — both dead ends with nothing ever populating them. Unread messages
  never appeared in the Notifications screen or contributed to the bell
  badge in `AppHeader`, regardless of how many were waiting. Now folds
  `unread_count > 0` contacts from the same `GET /messages/contacts` call
  into the feed as `message` notifications. Live-verified: with 2 unread
  messages from `teacher1` sitting on `secparent1`'s account (from the
  test above, before opening the thread), the assembled feed included a
  `"New message from Demo Class Teacher" / "2 unread messages"` entry.
- **Known limitation, not fixed this pass:** `NotificationsContext`'s
  "mark all read" is local-only (no backing notifications table — same
  pre-existing limitation the `'assessment'` items already had). Because a
  message notification's id is stable per-contact (`message-{contactId}`,
  not per-message), dismissing it and then receiving a *new* unread message
  from the same contact won't re-surface a fresh notification until some
  other state change forces a refetch with a different unread count showing
  up under the same id — the badge/list will still reflect the true
  `unread_count` on next `refresh()`, just without a distinct "new"
  transition. Not a regression (Pass 6 and earlier had the identical
  limitation for assessments), but worth a proper `notifications` table if
  this becomes a real product priority.

### Verified working, no changes needed
- Student-side recipient scoping (class teacher, subject teachers, admin,
  own parent(s); blocking student-to-student) was already correct — checked
  again post-refactor since its logic moved into the new shared helper, and
  it still 403s a student attempting to message an unrelated student.
- `GET /messages/conversation/:other` correctly marks only the *caller's*
  received messages read, scoped to that specific other-party id — checked
  since it now feeds the new unread-count logic.


## [Unreleased] — 2026-07-09 — Pass 6: Parent & student portals

Live-tested against a real Postgres 16 instance + running backend, real HTTP
requests via curl (no emulator/adb in this sandbox — see handoff note).

### Fixed — broken feature (assessments could never be taken by anyone, ever)
Three independent bugs combined to make the entire "take an assessment" flow
completely non-functional for every student, on every assessment, since the
feature was first built. Found while live-testing
`StudentAssessmentsHomeScreen.tsx` → `AssessmentsScreen.tsx` →
`TakeAssessmentScreen.tsx` for Pass 6's data-scoping pass — this went further
than a scoping bug once it became clear the underlying flow didn't work at
all, so it's fixed here rather than just flagged.

- **No way to ever publish a draft assessment.** `assessments.status`
  defaults to `'draft'` at creation (`schema.sql`) and **nothing** — no
  backend route, no UI control — ever changed it. Every assessment ever
  created (via `CreateAssessmentScreen.tsx`) was permanently stuck in
  `'draft'`, so `AssessmentsScreen.tsx`'s "Take Assessment" button (gated on
  `status === 'open'`) could never work, for anyone. Added
  `PUT /learning/assessments/:id/status` (teacher/admin, scoped to own
  school, matching the existing `PUT /finance/invoices/:id/status` pattern)
  and wired "Publish" / "Close" buttons into `AssessmentsScreen.tsx`'s
  existing teacher card actions.
- **`TakeAssessmentScreen.tsx` never fetched this assessment's own
  questions.** The code called the unrelated `GET /learning/questions`
  (**every** question in the school) and did `.slice(0, 20)`, with a comment
  reading `// simplified - in prod fetch per-assessment` — a placeholder that
  was apparently never replaced. Compounding this: `GET /learning/questions`
  requires the `questions.read` permission, which **only teachers/admins
  have** per `rbac.ts` — so this call would have 403'd for every real student
  account regardless. Added `GET /learning/assessments/:id/questions`,
  returning the real, ordered `assessment_questions` set for that specific
  assessment. Students get `stem`/`options`/`points` only — `correct_keys`
  is stripped server-side, never sent to the client taking the test.
  Teachers/admins previewing the same assessment get `correct_keys`
  included, for review. Live-verified end-to-end: teacher publishes a
  JSS1-only quiz with one question → JSS1 student fetches it, sees exactly
  that one question, submits the correct answer, gets auto-graded `10/10`
  against the real `assessment_questions` link (not a coincidental match) →
  an SS3 student's account gets `404 Assessment not found` on the same
  question-fetch URL.

### Fixed — security (confirmed live, not just read from code)
- **Cross-class data leak, `GET /learning/materials` and
  `GET /learning/assessments`.** Both routes scoped results to the caller's
  `school_code` only — `class_name` was an *optional* query filter that no
  screen ever actually passed. Live-verified: created a material explicitly
  for `SS3` only and a JSS1-only material in the same `secondary` school,
  then logged in as a JSS1 student — `GET /learning/materials` returned
  **both**, including a material titled "SS3 Only Exam Prep - CONFIDENTIAL".
  Same for assessments: a JSS1 student's account could see the title,
  subject, and question count of an unpublished, `'draft'`-status
  `SS3`-only assessment. Fixed with a new shared helper,
  `resolveViewerClassNames()` (`backend/src/utils/scope.ts`, mirroring the
  existing `checkTeacherStudentScope()` pattern from Pass 4's write-side
  fix): for `student` role, resolves their own `class_name` from `students`;
  for `parent`, resolves every linked ward's `class_name` via
  `parent_wards` (a parent with two children in different classes correctly
  sees both classes' materials, verified live). A `class_name IS NULL`
  material/assessment is treated as school-wide (visible to every class) —
  this matches the schema, which already allows a `NULL` class on both
  tables. `teacher`/`admin` behavior is unchanged (still school-wide, as
  before — only student/parent reads were ever unrestricted here).
  Additionally, once class-scoped, student/parent assessment reads now also
  exclude `status = 'draft'` rows — a draft isn't published to anyone yet,
  so browsing its title/metadata shouldn't be possible either, independent
  of the class fix above.
- Live-verified the negative case too: a parent account with zero linked
  wards gets an empty list from both endpoints rather than an error or a
  default-to-everything fallback.

### Found, not fixed — flagged for a product decision
- **Teachers can author materials/questions/assessments for *any* class in
  their own school, not just their `assigned_class`.** Confirmed live:
  `teacher1` (`assigned_class: JSS1`) successfully created a material and a
  full assessment (with a linked question) for `SS3` via
  `POST /learning/materials` / `POST /learning/questions` /
  `POST /learning/assessments` — none of the three write routes check
  `class_name` against the teacher's own `assigned_class`, unlike
  scores/attendance/class-records/weekly-efforts writes, which Pass 4 locked
  down with `checkTeacherStudentScope()`. This might be intentional — a
  teacher could legitimately teach more than one class for a given subject,
  and `assigned_class` is a single free-text field with no multi-class
  concept anywhere else in the schema either (same underlying ambiguity as
  the still-open `assigned_subject_id` UI gap from Pass 2). Not touched this
  pass since it's a design question, not an unambiguous bug like the ones
  above — flagging for a decision: should teacher writes to
  materials/questions/assessments be restricted to `assigned_class` (and if
  so, what happens to teachers who legitimately cover multiple classes,
  given there's currently no way to express that), or is school-wide write
  access for these three specifically intended?



Live-tested against a real Postgres 16 instance + running backend, real HTTP
requests via curl (no emulator/adb in this sandbox — see handoff note).

### Fixed — broken feature
- **`AttendanceScreen.tsx` could never show existing attendance.** Its own
  code had a `// (In production: fetch existing attendance records here)`
  comment where that fetch should have been — every time the screen opened,
  or the class/term selection changed, every input silently reset to blank,
  even for a class/term that already had saved data. This made "editing
  after the fact" effectively impossible: a teacher had no way to see what
  was already recorded, only to blindly re-enter values from memory.
  **There was also no backend route to read attendance back at all** — only
  `PUT /attendance` and `PUT /attendance/bulk` existed. Added
  `GET /attendance?class_name=&term_id=`, scoped identically to the existing
  `GET /class-records` bulk route (teacher → own school+class, admin → all),
  and wired the screen to actually call it and pre-fill. Verified live:
  saved 45 → read back 45 → edited to 50 → read back 50.

### Fixed — security (confirmed live, not just read from code)
- **Cross-school data leak, `GET /weekly-efforts`.** A teacher with no
  `assigned_class` set (a subject-only teacher, as opposed to a class
  teacher) had **no school-level restriction at all** on this endpoint —
  confirmed live: a `primary`-school subject teacher could see a
  `secondary`-school student's logged weekly effort via a plain
  `GET /weekly-efforts` with no query params. Fixed by always scoping to
  `s.school_code = user.school_code` for any teacher, with the existing
  `class_name` filter applied as an *additional* narrowing only when
  `assigned_class` is set, rather than being the only restriction.
- **Missing ownership check, `GET/POST /weekly-efforts/:id/feedback`.**
  Neither endpoint checked whether the calling user had any relationship to
  the student behind the given `weekly_effort` id — confirmed live: the
  same unrelated subject teacher could read (200, empty array in this case,
  but no rejection) any other school's feedback thread by id. Added
  `checkWeeklyEffortAccess()` (mirrors the existing ownership-check pattern
  used for `GET /class-records/:student_id/:term_id`): student → own record
  only, parent → linked ward only, teacher → own school only, admin → all.
  Nonexistent ids now 404 rather than confirming/denying existence any other
  way.
- **Field-level authorization gap, `PUT /class-records`.** The mobile UI
  already restricted the `admin_remark` (head teacher/principal) field to
  admin accounts only — but that was client-side only. Confirmed live: a
  class teacher could call the endpoint directly with an `admin_remark`
  value and it would save. Added a server-side check rejecting
  `admin_remark` from any non-admin sender (`class_teacher_remark` is
  unaffected — teachers can still set that one, as intended).

### Fixed — permission gap
- **Teachers could never post weekly-effort feedback**, including on
  efforts they themselves logged — `weeklyEfforts.feedback` only existed on
  the `parent` role in `rbac.ts`, despite `WeeklyEffortsScreen.tsx` showing
  every role an unconditional reply box. Confirmed live with `teacher1`
  replying to their own logged effort → `403 Permission denied`. Added
  `weeklyEfforts.feedback` to the teacher role (safe now that the ownership
  check above exists — previously granting this would have let *any*
  teacher, not just the right one, post to *any* effort).

### Confirmed working, unchanged
- `PUT /attendance` and `PUT /attendance/bulk` upsert correctly; editing a
  previously-saved value overwrites it (not append/duplicate).
- Class-teacher-remark save/edit flow, including partial updates (setting
  only one of the two remark fields via `COALESCE` in the `ON CONFLICT`
  clause) — confirmed teacher can still successfully set
  `class_teacher_remark` alone after the field-level fix above.
- `weekly_efforts` is a genuinely separate data source from
  `attendance`/`class_records` (distinct table, distinct concept — weekly
  task/MCQ tracking vs termly days-present and remarks), not two screens
  reading the same underlying data as the QA plan wondered.
- Parent's existing linked-ward feedback flow (read + post) still works
  correctly through the new ownership check; an unrelated parent (not linked
  via `parent_wards`) is correctly blocked with `403 Not your ward`.

### Verified
- Backend: `npx tsc --noEmit` — 0 errors.
- Mobile: `npx tsc --noEmit -p tsconfig.json` — 0 errors.
- All five fixes above were exploited/confirmed-broken live *before* being
  fixed, then re-tested live *after* to confirm both the fix and that
  legitimate access for every role still works (not just that the attack
  is blocked) — including a genuine class-name collision test (`"JSS1"`
  created in both `primary` and `secondary`) to rule out the school scoping
  only appearing to work by coincidence of term-id partitioning.



**Reported symptom:** Terms screen showed "No terms created yet" for admin,
despite terms existing in the database.

**Root cause:** `users.school_code` is `NULL` for every admin account by
design — one admin manages *both* schools (`primary` and `secondary`), so
they aren't tied to either one. Nearly every backend route that lists or
creates school-scoped data (terms, subjects, classes, students, materials,
assessments, fee items) falls back to `req.user.school_code` when no
explicit `school_code` is passed — correct for teacher/student/parent (who
each belong to exactly one school), but for admin that fallback is `NULL`,
so the query becomes `WHERE school_code = NULL`, which matches zero rows in
Postgres. This wasn't unique to Terms — it affected every admin-only screen
the same way: Subjects, Students, Score Entry, Finance (fee items), Class
Summary, Audit Log, and the Dashboard's own stats/branding.

**Fix — `AdminSchoolContext`:** a new context (`mobile/src/api/AdminSchoolContext.tsx`,
mirroring the existing `WardContext` pattern used for parents switching
between children) that lets admin explicitly pick which of the two schools
they're currently viewing, persisted across sessions. A new
`SchoolSwitcherBar` component surfaces this choice at the top of every
affected screen. Every one of those screens now passes
`school_code: selectedSchoolCode` explicitly instead of relying on the
broken fallback.

**Files changed:**
- Added: `mobile/src/api/AdminSchoolContext.tsx`, `mobile/src/components/SchoolSwitcherBar.tsx`
- Wired in: `App.tsx`, `DashboardScreen.tsx`, `AcademicMgmtScreens.tsx` (Terms
  + Subjects), `StudentsScreen.tsx`, `AdminExtraScreens.tsx` (Class Summary +
  Audit Log), `FinanceScreen.tsx`, `ScoreEntryScreen.tsx`

### Bonus fixes found while tracing this

- **Security: cross-school data leak.** `backend/src/routes/academic.ts`'s
  `school_code` query-param override (terms, subjects, classes) had **no
  role check** — any authenticated teacher/student/parent could pass
  `?school_code=<the other school>` and read that school's terms/subjects/
  classes, not just their own. Fixed by gating the override to
  `role === 'admin'` only, matching the safer pattern already used in
  `finance.ts` and `students.ts`. Verified: a teacher in `secondary` passing
  `?school_code=primary` now still only gets `secondary`'s data back.
- **Wrong score-entry caps.** `ScoreEntryScreen` read `schools.data[0]` for
  the CA1/CA2/Exam max-score config — always the *first* school in the list
  (`primary`), regardless of which school the teacher actually belonged to.
  Confirmed this was live, not just theoretical: this project's own seed
  data has `primary` at 20/20/60 and `secondary` at **15/15/70** — a teacher
  in `secondary` was being shown the wrong caps entirely. Fixed to match the
  school actually in view by `code`, not by array position.
- **`GET /academic/terms/current`** had no `school_code` override at all
  (even for admin) — added the same gated override for consistency with the
  rest of `academic.ts`.
- **`backend/src/routes/learning.ts`** (materials, assessments — both GET
  and POST) had no override support at all, so admin could never use these
  even in principle. Added the same gated pattern, for when/if a Materials
  or Assessments tile is added to the admin dashboard (neither currently is,
  so this was a latent gap rather than a visible symptom).

### Verified
- Backend: `npx tsc --noEmit` — 0 errors.
- Mobile: `npx tsc --noEmit` (full project, now that `mobile/package.json`
  and `tsconfig.json` are present) — 0 errors.
- Manually exercised against a locally seeded Postgres instance: logged in
  as admin and as `teacher1` (`secondary`), confirmed Terms/Subjects/Finance
  all return real data once a school is selected, confirmed the
  cross-school override is correctly blocked for the teacher account, and
  confirmed the schools list really does have divergent 15/15/70 vs 20/20/60
  caps (so the score-cap fix isn't cosmetic).

## [Unreleased] — 2026-07-08 — Merge verification pass

This pass compared `sts-school-app-fixed-v5` against `sts-school-app-whatsapp-redesign`
to check for beneficial changes to bring forward. Full findings in `MERGE_REPORT.md`.

### Changed
- Nothing. Forensic diff of all 81 shared files found Version A already contains
  every feature from Version B, plus additional fixes B never received (see
  `MERGE_REPORT.md` for the full file-by-file breakdown).

### Added
- `docs/ARCHIVED_redesign-branch-FIXES_LOG.md` — the redesign branch's own
  changelog, kept for historical reference.
- `docs/ARCHIVED_redesign-branch-NOTES.md` — the redesign branch's own
  implementation notes, kept for historical reference.
- `MERGE_REPORT.md`, `REGRESSION_REPORT.md`, `TODO.md` — this merge pass's
  deliverables.

### Verified
- Backend (`backend/`): `npm install` + `tsc --noEmit` — **0 errors**.
- Mobile (`mobile/src/`): static resolution of every relative import across
  all 56 `.ts`/`.tsx` files — **0 unresolved imports**, confirming no
  orphaned components or broken navigation targets.

### Not touched (as of the merge pass)
- No application code was modified in the merge pass itself. The project
  shipped as Version A (`sts-school-app-fixed-v5`) unchanged, because it was
  already the more complete and more secure of the two inputs.

## [Unreleased] — 2026-07-08 — Session model: 3-term cap + collation

Follow-up work requested after the merge pass. Full details in `SESSION_COLLATION.md`.

### Added
- **3-term session cap.** `POST /terms` and `PUT /terms/:id` now reject any
  term name outside `1st Term` / `2nd Term` / `3rd Term`, and `POST /terms`
  refuses to create a 4th term for the same `school_code` + `academic_year`.
  (`backend/src/utils/terms.ts`, `backend/src/routes/academic.ts`)
- **Session collation endpoint.** `GET /scores/session-report/:student_id?academic_year=`
  collates whichever of the session's terms have been entered so far into a
  per-subject session total/average/grade, plus a grand total/average and
  summed attendance — and reports `is_complete_session` once all 3 terms are
  in. (`backend/src/routes/scores.ts`)
- **Session Report screen.** New `SessionReportScreen.tsx`, reachable via a
  "View Session Report" button on the existing term Report Card
  (`MyResultsScreen.tsx`), registered in `StudentTabs.tsx`, `ParentTabs.tsx`,
  and `AdminStack.tsx` alongside the existing `MyResults` route.

### Changed
- Nothing existing was altered in behavior — the 3-term cap only rejects
  requests that were already invalid for this app's model (a 4th term, or a
  term name outside the canonical 3); every valid 1st/2nd/3rd Term flow that
  worked before still works identically.

### Verified
- Backend: `npx tsc --noEmit` — 0 errors (re-run after these changes).
- Mobile: static import-resolution check across all 57 `.ts`/`.tsx` files —
  0 unresolved imports.

## [Unreleased] — 2026-07-09 — Live test run (real backend + real Postgres)

Actually ran the backend against a real, fresh PostgreSQL 16 database — not
just a type-check — to exercise the 3-term cap and session collation with
real HTTP requests. Full detail in `TEST_RUN_REPORT.md`.

### Fixed
- **`GET /scores/session-report/:student_id`** returned `is_complete_session: true`
  for a student with **zero** scores entered for any term — `subjects.every(...)`
  is vacuously true on an empty array. Fixed by additionally requiring
  `subjects.length > 0`. This was only caught by actually calling the
  endpoint with a real "blank" student, not by type-checking or reading the
  code. (`backend/src/routes/scores.ts`)

### Confirmed working, by real request/response, not just by reading the code
- `POST /academic/terms` correctly creates 1st/2nd/3rd Term for a session.
- Rejects a 4th distinct term for a session already at 3 — `409`.
- Rejects a duplicate term name within an incomplete session — `409`.
- Rejects any term name outside `1st Term` / `2nd Term` / `3rd Term` — `400`.
- `GET /scores/session-report/:student_id` correctly collates a subject
  that has all 3 terms recorded (session_total/average/grade correct) and a
  subject missing 3rd Term data (recorded as `terms_recorded: 2`, session
  total only from the 2 entered terms), and correctly reports
  `is_complete_session: false` while any subject is incomplete.
- `db/importSecondTerm.ts` runs successfully against a fresh database (0
  students yet loaded → 0 matches, as expected — see `TEST_RUN_REPORT.md`
  for what that means for your actual rollout).
