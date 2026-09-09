# HANDOFF — Roster self-claim, remaining Da requests (2026-09)

Read AGENT_CONTINUATION.md first. `git fetch && git log --oneline -5
origin/master` before starting — confirm you're at or past this doc's
own commit.

Da's actual goal (clarified after an initial ask that would have broken
the app): stop the operations admin from being the sole distributor of
every login. He has past years' report sheets listing student names +
classes and wants to bulk-seed those as records, then let each real
student find their own name and set up their own account — instead of
one shared "Student" login (architecturally impossible here:
users.username is UNIQUE, and every academic feature — scores, topics,
term-PINs, messaging — is keyed to one real person per account; a
shared login would mean every student sees the same single account's
data, not their own).

---

## TASK A — Bulk import students from past report sheets

Da will provide file(s) — likely PDF or Word, format unconfirmed, get
this from him directly before starting rather than guessing. Mirror the
existing dry-run-then---yes convention (ingestTopics.ts,
renameClassNaming.ts, cleanupStaleClasses.ts are all examples in
backend/src/db/).

- Parse name + class per student. Ask Da whether the sheets also list
  an admission number or any other per-student identifier — this
  matters a lot for Task B's verification step below, check before
  assuming there isn't one.
- Insert as students rows ONLY — user_id stays NULL (no login yet).
  students.user_id is nullable by design for exactly this
  (schema.sql comment: "if student has login"), so this is the
  intended, already-supported shape, not a workaround.
- Same safety pattern as every other one-off script here: dry run
  prints exactly what would be inserted (name, class, school_code) and
  flags anything ambiguous (duplicate-looking names within a class,
  unparseable rows) for a human look; --yes only after Da's reviewed
  the dry run.
- Watch for the same real issues past sessions hit with messy real
  files: inconsistent class-name spelling (reuse the current PRY/JSS/SS
  naming convention, not old pre-rename forms), merged-cell or
  multi-student-per-line quirks in whatever format Da provides.

## TASK B — Self-service "claim your account" flow

This is the actual unlock for the whole ask. Currently
POST /students/:id/link-user (backend/src/routes/students.ts) exists
and does exactly the DB write needed, but is requireRole('admin') —
there's no path for an unauthenticated prospective student to reach it.

Open design question — get Da's explicit answer before building, don't
decide this alone: with only a name + class to go on, ANY website
visitor could claim to be any real, named student and see that
student's actual grades/report card/messages. Some verification step is
needed for real students to safely self-claim their own record without
this door open to any stranger. Candidates, weakest to strongest,
depending on what's actually in the report sheets (see Task A):
- Admission number (if present in the sheets) — reasonably strong,
  usually not public.
- Date of birth — moderate, sometimes guessable/known socially.
- A single per-class (not per-student) registration code the class
  teacher reads out once — cheap for admin to distribute (one code per
  class, not one secret per student, so it doesn't reintroduce the
  cumbersomeness this is meant to remove), combined with name+admission
  number as the actual identity check; the code just gates "is this
  someone who was actually told to do this" rather than being the real
  security boundary.
Confirm with Da which of these (or a combination) fits what's actually
in his data before writing any backend route.

Once that's settled:
- New backend route, e.g. POST /auth/claim-student — public
  (requireAuth NOT applied), takes name/class/whatever verification
  field was agreed + a chosen username + password. Looks up a students
  row matching on the agreed fields with user_id IS NULL, creates a new
  users row (role='student', must_change_pw=false since they're
  choosing their own password right here, not being handed a temp
  one), links it via the same UPDATE POST /students/:id/link-user
  already does, inside one transaction. Enforce a reasonable username
  uniqueness check and password strength minimum, same as the existing
  admin-create-user path.
  Rate-limit this route (see app.use('/auth', rateLimit(...)) in
  backend/src/index.ts — this new route needs to sit under that same
  limiter or a stricter one, since it's an unauthenticated write path
  that could otherwise be hammered to enumerate/brute-force student
  identity fields).
- New mobile screen (e.g. ClaimAccountScreen.tsx), reachable from
  LoginScreen.tsx via a "New here? Set up your account" link — search/
  pick name + class (scoped to a school, same pattern as every other
  class picker in this app), enter the verification field, choose
  username + password, submit, land logged in.

## TASK C — Same idea for teachers, once A+B land — architecturally different, don't copy-paste

Students have a separate students table a login can attach to later;
teachers don't — a teacher IS a users row directly (role,
assigned_class, assigned_subjects all live there). There's no
equivalent "roster row with no login yet" concept for teachers today.
To offer the same self-claim flow for teachers, you'd need to decide
with Da first whether to: (a) have admin pre-create placeholder users
rows (role='teacher', a random unusable password, some claimed_at IS
NULL marker) that a real teacher then claims the same way, mirroring
Task B's shape onto users directly instead of students; or (b) leave
teacher account creation as admin-driven (there are usually far fewer
teachers than students, so the original cumbersomeness complaint may
not really apply here — confirm with Da whether this is even wanted
before building it). Don't assume (a); ask.

---

## Other items from the same request, already resolved or scoped

- "No button wider than 22 inches" — not something screen UI is
  measured in (density-independent pixels, not physical inches; varies
  by device DPI). The actual concern (buttons/content stretching
  full-width on a wide browser window) was already fixed this session —
  see CHANGELOG.md's button/PageContainer overhaul entries. Nothing
  further needed here unless Da flags a specific screen that still
  looks wrong.
- "Students/teachers can use the app without errors" — this needs
  actual live testing of Section C (Teacher) and D/E (Parent/Student)
  of TEST_PLAN_WEB_MOBILE.md, which this whole session never reached
  (it's been almost entirely Admin/Finance Admin territory). Once Task
  B gives students a way to actually get an account, that's the natural
  point to run this — walk Da through creating one real student/teacher
  account each and using every screen that role has, logging results
  into that file's own progress log as you go, same convention as
  every other pass.
- APK build — needs Da's own Expo/EAS account credentials or a local
  Android SDK, neither of which exists in an agent sandbox. What an
  agent CAN do: confirm mobile/app.json/eas.json are in a buildable
  state (correct package name, version, permissions), then hand Da the
  exact command to run himself:
    cd C:\dev\sts-school-app-live\mobile
    npx eas build --platform android --profile preview
  (--profile preview for a shareable installable APK rather than a
  Play-Store-bound AAB — confirm eas.json actually has a preview
  profile configured with "buildType": "apk"; add one if missing).
  This requires Da to have (or create) a free Expo account and run
  npx eas login once first. The build itself runs on Expo's servers,
  not locally — Da doesn't need Android Studio installed, just an
  Expo account and this command.
