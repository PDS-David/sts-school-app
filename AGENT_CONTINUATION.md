# AGENT_CONTINUATION.md

This file is for whichever agent (or agent session) picks up work on this
repo next. It's not user-facing — `README.md` is the setup/reference doc for
humans. This one is about *how to work on this codebase correctly* and *what
state it's actually in*, which drift apart from README over time.

**Read this before making changes, especially before touching auth,
permissions, or anything AI-generated (Brainee).**

---

## 1. What this app is

Full-stack school management app for Sow the Seed Schools (Model College +
a nursery/primary campus). Expo/React Native frontend (`mobile/`),
Node.js/Express/TypeScript backend (`backend/`), PostgreSQL via raw `pg`
(no ORM). Four roles: `student`, `parent`, `teacher`, `admin`.

"Brainee" is the AI assistant the app presents to users — it's a branding
layer only. The actual hub is `backend/src/routes/ai.ts` +
`backend/src/utils/ai.ts` (Gemini, with an optional shared-agent-service
delegation mode — see the header comment in `utils/ai.ts` before touching
routing/fallback logic there).

## 2. Trust code over docs — a concrete example of why

`README.md` line ~42/110 says a teacher can "create assessments" / "publish
... an assessment." **This is false as of whenever `assessments.*` was
deliberately removed from teacher's permissions.** The actual, current, and
carefully-commented source of truth is `backend/src/utils/rbac.ts`:

```
// Deliberately EXCLUDED, on purpose, not by omission: 'questions.*' and
// 'assessments.*' (no teacher builds a test/quiz/essay prompt — that is
// exclusively an admin or Brainee/AI responsibility)...
// Do not add any of these back for 'teacher'.
```

README wasn't updated when that decision was made or reversed. **Don't
trust README (or this file, eventually) over the actual code** —
`rbac.ts` for permissions, `schema.sql` for the real schema, the route
files for actual behavior. When you find a doc/code mismatch, fix the doc
(and note it in `TODO.md` if it's not something you can fully reconcile in
the moment) rather than silently working around it.

## 3. Core conventions (apply these to anything new you build)

- **Scoping helpers**, both in `backend/src/utils/scope.ts`:
  - `checkTeacherContentScope()` — governs *publishing content*
    (materials/questions/assessments/topics): a teacher may act on their
    `assigned_class` (any subject) OR their `assigned_subject_ids` (any
    class, via the `teacher_subjects` many-to-many table). Admin
    unrestricted.
  - `resolveViewerClassNames()` — governs *what a viewer (student/parent)
    can see*, returns `null` for admin/teacher (unrestricted) or an array
    of class names to filter by.
  - These are deliberately separate from the *student-records* scope rule
    (scores/attendance/weekly-efforts), which is narrower — a subject
    teacher can publish an assessment for any class in their subject but
    can't browse that class's roster/scores through `GET /students` etc.
    without naming it explicitly. See README's "Student Records Scope"
    section (this part of README is accurate as of this writing) for the
    detail if you're touching that area.
- **`assessments.status`**: `'draft' | 'open' | 'closed'`. `GET
  /learning/assessments` already filters `status != 'draft'` for
  students/parents — this is the de facto "not visible yet" gate, reused by
  the topics feature (section 6) rather than inventing a new one.
- **`school_code`**: admin accounts have `school_code = NULL`. Every
  write route follows the same pattern: `const sc = (school_code &&
  role==='admin') ? school_code : user.school_code`. Copy this exactly for
  new routes — a few earlier passes shipped routes that always used
  `user.school_code`, silently writing `NULL` for admin-authored rows.
- **`created_by`**: NULL for AI/Brainee-authored rows (questions,
  assessments) rather than attributing them to whichever human's request
  triggered generation. Set to the real user id for genuinely
  human-authored rows.
- **No test suite exists.** Every change is verified via `tsc --noEmit`
  (must be clean before any commit) plus careful manual code tracing
  against the actual schema/route code — not assumption. If you have DB
  access, live-verify; if not, see section 5.
- **`TODO.md`**: append/update notes rather than deleting history. When you
  fix something a prior note flagged as open, mark it resolved *above* the
  original note (don't delete the original — it's useful context for why
  the thing existed). `CHANGELOG.md` is the full historical log — long
  (100KB+), only grep/search it, don't read it end to end.

## 4. Git workflow this user expects

- **Pull before starting work, every session.** Other agents/sessions push
  to this repo — you will hit merge conflicts or fast-forward rejections if
  you assume your last clone is current. `git fetch && git log --oneline
  origin/master` to check before you push.
- **Set local git identity before your first commit** in a fresh clone —
  `git config user.email` / `user.name` aren't set by default here:
  ```
  git config user.email "qa@sts-school-app.local"
  git config user.name "QA Pass"
  ```
- **Commit and push each discrete fix separately** when the user asks for
  multiple fixes in one session — don't batch unrelated fixes into one
  commit unless told to.
- **The user issues a fresh GitHub PAT per session** (revokes it after) —
  don't expect a previously-used token to still work.
- **This user actively works across multiple projects** (this one and a
  separate EdTech platform, AISchoolOnAir/`PDS-David/edu-platform`) —
  confirm which repo you're in before assuming context carries over. Don't
  mix up rbac/schema/conventions between them.

## 5. No live DB access in most agent sandboxes

Sandboxed agent environments typically can't reach the user's local
Postgres or a hosted one — network is usually locked to a fixed allowlist
(GitHub, package registries). If you need something live-verified:
- Give the user exact commands to run locally (they're usually on
  PowerShell/Windows — `npm run db:seed`, `psql` queries, etc.) and have
  them paste back output.
- Otherwise, verify via `tsc --noEmit`, careful reading of the actual
  schema/route code, and standalone logic checks for pure functions (e.g. a
  throwaway Node script to test a bcrypt/normalization function in
  isolation — see git history around the self-service password reset work
  for an example).
- Say explicitly which verification method you used — don't imply
  "verified" when you mean "type-checked and traced by hand."

## 6. What's shipped recently (this session) — read before extending these

**Self-service password recovery** (`backend/src/routes/auth.ts`,
`utils/password.ts`): security-question/answer based, not email/SMS — no
delivery channel exists for this school (parents/students often lack a
usable email or SMS budget wasn't approved). `GET
/auth/forgot-password/question` + `POST /auth/forgot-password/reset`, gated
by the same `is_active`/`access_expires_at` check as login, with
per-account lockout (5 wrong attempts → 1hr) independent of the broader
per-IP `/auth` rate limiter. New user columns: `security_question`,
`security_answer_hash`, `must_set_security_question` (defaults `TRUE` —
retrofits existing accounts too), `security_answer_fail_count`,
`security_answer_locked_until`.

**Admin revocation reason** (`users.revocation_reason`, set via `PUT
/admin/users/:id`, auto-clears on reactivation): surfaced instead of a
generic message at login, refresh, every authenticated request
(`requireAuth`), and the forgot-password routes.

**Mobile UI for both of the above is now built** (was flagged as
outstanding in an earlier version of this doc): `ForgotPasswordScreen.tsx`
and `SecurityQuestionSetupScreen.tsx`, registered in `RootNavigator` plus
every role's nested stack (`AdminStack`, `TeacherTabs`, `ParentTabs`,
`StudentTabs`, `FinanceAdminStack`), with a "Security Question" menu entry
in the student/parent/teacher profile screens and a "Forgot password?"
link on `LoginScreen`. `AuthContext.login()` threads
`must_set_security_question` through so `LoginScreen`/
`ChangePasswordScreen` chain into forced setup correctly.

**Real gap found and fixed while building this:** a mid-session
deactivation (or access-period expiry) used to log the user out **silently
with no message at all** — not even a generic one. `client.ts`'s
refresh-failure handler cleared the session and fired `emitForcedLogout()`
with no payload; `AuthContext`'s listener just cleared `user` state.
Fixed: `authEvents.ts`'s event now carries an optional message (preferring
the original failing request's error body — which already includes
`revocation_reason` — falling back to the refresh call's own message, then
a generic line), and `AuthContext` shows it via `Alert` before the person
lands back at Login. This is the actual mobile-side completion of the
admin-revocation-reason work — the backend always had the reason in the
response body, but nothing displayed it in this one code path.

**Topics + completion** (`backend/src/routes/learning.ts`, new `topics` /
`topic_completions` tables): admin/teacher create `topics` rows (same
subject/class/term scoping as materials/questions/assessments — no
document-parsing ingestion pipeline exists or was ever planned; a "topic"
was already a free-text string typed into Brainee's
explain/notes/generate-questions prompts before this, this table just gives
it a persistent identity). `POST /learning/topics/:id/complete`
(student-only) marks completion and has Brainee generate: a study summary
(cached once per topic, not per student), fresh practice questions (never
persisted — ephemeral, same pattern as `/ai/explain`/`/ai/notes`), and a
"standard assessment" (generated once per topic into real
`questions`/`assessments`/`assessment_questions` rows).

**Important design decision, confirmed explicitly by the user — don't
re-litigate this without asking:** the topic-completion assessment is
created `status='open'` immediately, not `'draft'`. There is **no per-item
admin approval** for AI-generated study content or assessments. The only
approval gate is account-level (`is_active`/`access_expires_at`, already
enforced by `requireAuth` on every request) — once admin grants a student
account access, everything Brainee produces for them works uninterrupted.
An earlier draft of this feature (mid-session) mistakenly gated the
assessment behind `status='draft'` + manual admin approval — that was
wrong and was corrected. If you're tempted to add an approval step here,
check with the user first.

**Mobile UI for topics is also not built yet.** Natural integration
points: `StudentLearningScreen.tsx` (entry point, currently just
subject tiles), a new topics list screen modeled on `MaterialsScreen.tsx`,
and a "Mark complete" action that calls the new endpoint and shows the
returned summary/practice/assessment. The existing `AssessmentsScreen.tsx`
will render a topic-generated assessment with **zero changes needed** —
confirmed by a full field-level audit against `GET /learning/assessments`
(exact match: `title`, `status`, `subject_name`, `class_name`,
`question_count`, `total_marks`, `already_submitted`, `my_score`).

**Parent auto-provisioning** (`backend/src/utils/parentProvisioning.ts`,
wired into `POST /students`): give `parent_phone` (+ optional
`parent_name`/`parent_email`) when creating a student, and a parent account
is found (by phone, digit-suffix matched so `+234...`/`0...` formatting
differences still match, scoped per school — siblings share one account)
or auto-created (same `generateTempPassword()`/`must_change_pw` mechanism
as manually-created accounts) and linked via `parent_wards`, all in one
request. Response includes `parent: { id, username, temporary_password? }`
— `temporary_password` only present when a new account was actually
created, omitted when an existing sibling-parent was reused.

**Important gap found while building this — there is no student-creation
form anywhere in the mobile app.** `POST /students` exists and now
supports parent auto-provisioning, but nothing in `mobile/src` ever calls
it — `StudentsScreen.tsx` is read-only (search/view only),
`StudentDetailScreen.tsx` only edits/links an *already-existing* student.
The actual current way students get created is the one-off import scripts
(`backend/src/db/importFirstTerm.ts` / `importGenuineFirstTerm.ts`), run
locally against legacy CSV/SQLite data — and that legacy source data has
**no parent-contact fields at all**, so parent auto-provisioning was
deliberately *not* threaded into those scripts (would mean guessing at
fields that don't exist in the source, risking breakage of an
already-QA'd import path). If/when an "Add Student" mobile screen gets
built, that's where `parent_name`/`parent_phone`/`parent_email` fields
belong — check with the user on design/scope before building it, since
it's a real net-new admin screen, not an extension of something existing.

**Known adjacent work by someone else, not yet reconciled:** a commit
("Class naming convention: JSS1/SS1 -> JSS 1/SS 1...") mentioned in its
message that it's "part of the curriculum-aware AI recommendation feature
work," confirmed with someone referred to as "Da." This sounds adjacent to
(possibly overlapping with) the topics feature above. If you're touching
either area, check with the user first about whether these are meant to be
the same effort or genuinely separate.

## 7. Mobile-app endpoint audit (done this session, for reference)

Every `api.*` call across all 38 screens in `mobile/src/screens/` was
cross-referenced against every registered backend route (path + HTTP
verb) — zero mismatches found (no dead/nonexistent endpoint calls
anywhere). If you add a new backend route, it's safe to assume nothing
else broke as a side effect — but re-run this check if you *rename* or
*change the verb* of an existing route, since something upstream may still
be calling the old shape:

```bash
# From mobile/: list every endpoint called
grep -rhoE "api\.(get|post|put|delete|patch)\(['\`][^'\`]+" src/ | sed -E "s/api\.[a-z]+\(['\`]//" | sort -u

# From backend/: list every registered route per file
for f in src/routes/*.ts; do echo "--- $f ---"; grep -oE "router\.(get|post|put|delete|patch)\('[^']*'" "$f"; done
```
