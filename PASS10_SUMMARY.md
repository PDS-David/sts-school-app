# STS School App — QA Wrap-up (Passes 0–10, final)

Plain-language summary for a human reviewer before this goes anywhere near
production. Full technical detail for every fix is in `CHANGELOG.md`
(newest first); dated per-pass notes are in `TODO.md`.

## The shape of what got found

Across 10 passes, the bugs fell into a small number of repeating shapes,
more than they fell into "this one feature was just broken":

1. **A write endpoint trusted a role-wide permission with no check that the
   data actually belonged to the person writing it.** This was the single
   biggest category — Pass 4 found it first (a teacher could write scores/
   attendance/class-records for *any* student, not just their own school's
   or class's), and the same shape reappeared in Pass 7 (messaging — any
   parent/teacher/admin could message anyone) and nearly did in Pass 8
   (finance turned out to be safe, structurally, but it was worth checking).
   All of these are fixed with a small number of shared helper functions
   (`checkTeacherStudentScope()`, `getMessageableUsers()`,
   `resolveViewerClassNames()` in `backend/src/utils/scope.ts`) rather than
   scattered one-off checks, so the same mistake is much harder to
   reintroduce in a new route later.

2. **A screen or handler that only accounted for 2 of the app's 4 roles.**
   Pass 6's broken assessment flow, Pass 7's admin-`NULL`-`school_code`
   messaging bug, and Pass 9's admin/teacher report-card buttons were all
   this same "if (role === 'x') {} else if (role === 'y') {}, nothing else"
   shape. Pass 10 did a final sweep for this specific pattern across every
   remaining screen and didn't find a new instance — the four roles'
   branches now look consistent everywhere they're exercised.

3. **Validation that existed in one place but not its sibling endpoint.**
   This was Pass 10's main theme: `POST /scores` validated max scores but
   `POST /scores/bulk` (the one the app actually calls) didn't; attendance
   and term-length fields had no validation anywhere. None of these are
   security holes — they're same-school teachers/admins submitting data
   that's simply out of range — but any of them would have quietly
   corrupted a report card's numbers with no error to anyone.

4. **Frontend-only bugs where the backend was actually fine.** Pass 9's
   report cards and Pass 10's offline-outbox race are both this: the
   underlying data/logic was correct, but a wiring bug (a missing role
   branch; two listeners both calling the same function with no lock
   between them) meant it either wasn't reachable or ran twice.

## What's genuinely solid right now

- Every write endpoint that handles student-linked data (scores,
  attendance, class records, weekly efforts, messages) now checks the
  actual relationship between the writer and the data, not just a
  role-level permission.
- Every report/summary route that was checked (`/scores/report`,
  `/scores/session-report`) computes correct numbers — hand-verified
  against raw `psql` data — and scopes correctly per role.
- Backend and mobile both pass `npx tsc --noEmit` cleanly as of this pass.
- The offline story (outbox, GET caching, token refresh) is real and
  reasonably well-built, not just a stub — Pass 10 confirmed this by
  tracing the actual code, not by trusting the claim.

## What still needs a human decision, not just a code fix

These aren't bugs — they're places where a previous pass found a genuine
gap and deliberately didn't build UI or make a product call unilaterally:

- **No mobile screen to add or edit a student.** The backend fully
  supports it; nothing in the app calls it. (Flagged since the very first
  session, before this 10-pass plan even started.)
- **No mobile screen to create a fee item or invoice.** Same situation —
  backend routes exist and now validate correctly (Pass 8), but are only
  reachable via direct API calls today.
- **Parents can only message their ward's class teacher**, not subject
  teachers or admin. May be intentional (keeps the messaging surface
  small) or may be a real gap — worth asking whoever owns the product
  side.
- **Teachers can write materials/questions/assessments for any class in
  their own school**, not just their `assigned_class`. Lower severity than
  the student-scoping bugs (same school, not cross-school), but worth a
  look if this app scales to schools with many teachers per school.
- **`ClassSummaryScreen`'s ranking query scopes by `class_name` only, not
  `school_code`, for admin.** Currently unreachable — there's no create/
  edit route for `classes`, so two schools can't currently share a class
  name — but would silently blend two schools' rankings together if a
  "manage classes" feature is ever added without also fixing this.
- **`DELETE /students/:id` only requires `grades.write`**, the same
  permission a teacher needs for routine score entry — meaning any teacher
  can permanently delete a student record. Worth deciding whether deletion
  should be admin-only.

## Two smaller things worth a glance, not a blocker

- **Auth tokens are stored in plain `AsyncStorage`, not `expo-secure-store`**
  — even though `expo-secure-store` is already a dependency. Not urgent,
  but worth hardening before any real rollout.
- **`ScoreEntryScreen.tsx` shows the CA1/CA2/exam max as a hint label but
  doesn't clamp the input client-side.** No longer a data-integrity risk
  (Pass 10 made the backend reject it either way), just a rougher UX than
  a client-side clamp would give — a teacher who overtypes now gets a
  server error alert instead of the field just refusing the extra digits.

## Before this goes anywhere near production

- **Postgres version:** this was tested against Postgres 16 in the
  sandbox; a prior handoff noted production runs **Postgres 18**. Nothing
  found in 10 passes looked version-specific, but that's worth a final
  sanity check against the real version before deploy.
- **The GitHub PAT hygiene issue** flagged across earlier sessions (on the
  sister `edu-platform` project, and worth double-checking here too) —
  make sure nothing exposed made it into this repo's history either.
- **None of this was tested against production data**, by design — every
  pass used a local Postgres copy with fresh or seeded test fixtures only.
  A final pass against a *staging* environment with production-shaped data
  volumes (the real student/score counts, not a handful of test rows)
  would be a reasonable next step before a real launch, particularly for
  anything report/export-related where N+1 query patterns (the per-student
  school-config lookups added in Pass 10, for instance) could behave
  differently at scale.
