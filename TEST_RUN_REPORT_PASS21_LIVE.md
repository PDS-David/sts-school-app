# Pass 21 — Live Test-Run Report & Bug Fixes (2026-07-14)

This build (`sts-school-app-pass21-final`) was test-run for real — a live
PostgreSQL 16 instance, actually migrated, seeded, imported, and exercised
via real HTTP requests as every role (admin, teacher, student, parent),
including deliberately hostile/edge-case requests — not just `tsc --noEmit`.
Four real bugs were found this way and fixed. None of them were catchable by
a type-check or code review alone; all four only showed up when actually
running the app against real data and real requests.

## ✅ Clean before any fixes
- Backend and mobile both typecheck clean (`tsc --noEmit`, 0 errors) — before
  and after every fix below.
- `GET /scores/report/:student_id` scoping (admin/teacher/student/parent) —
  all five role combinations tested, all behaved exactly as they should.
- Messaging: admin reachable from teacher/student/parent, cross-school
  isolation between teachers, soft-deleted students correctly excluded from
  (and restored to) contact lists.
- `DELETE /learning/materials/:id` admin override, `PUT
  /assessments/:id/status` scope check — both verified working correctly.
- `--term`, `--session`, and `--new-session` modes of
  `resetAcademicData.ts` all verified end-to-end (after the fix below for
  `--new-session`).

## Bug 1 — Fresh install left the wrong term "current" (`importFirstTerm.ts`)
**Found by:** running the exact sequence a brand-new install actually
follows — `migrate` → `seed` → `importFirstTerm.ts` — against a truly empty
database, then checking which term was actually marked current afterward.

**What happened:** `seed.ts` always creates a placeholder "1st Term
2024/2025" and marks it current. `importFirstTerm.ts`'s own rule ("only
promote the imported term if the school has no current term yet") saw that
placeholder, correctly-but-uselessly concluded a current term already
existed, and left the real "1st Term 2025/2026" — the one it had just
populated with 1,639 real scores — NOT current. Right after the exact
operation meant to populate real data, the app would show an empty
placeholder term by default instead.

**Fix:** the "already has a current term" check now also looks at whether
that current term actually has any data attached (scores/attendance/class
records). An empty placeholder is treated the same as "no current term yet"
and gets promoted automatically; a genuine in-progress term (2nd/3rd Term an
admin has actually started entering data into) is correctly left alone.

**Verified:** fresh install → correct term auto-promoted. Re-running the
import a second time → correctly idempotent, no change. Simulated a real
in-progress 2nd Term with an actual score in it → correctly NOT demoted by
a subsequent import run.

## Bug 2 — `resetAcademicData.ts --new-session` didn't actually delete what it claimed to
**Found by:** creating a real assessment, material, and invoice tied to a
term, then running `--new-session` end-to-end (not just reading the dry-run
output) and checking whether those rows were actually gone afterward.

**What happened:** the function's own printed summary claimed deleting the
term row would cascade to "any questions/assessments tied to those terms."
It doesn't — `schema.sql` sets `materials`, `questions`, `assessments`, and
`invoices` to `ON DELETE SET NULL` on `term_id`, not `CASCADE` (only
`scores`, `attendance`, and `class_records` actually cascade). Running
`--new-session` left a still-`open` assessment sitting in the database
indefinitely, orphaned rather than removed, directly contradicting what the
tool told the admin it had just done.

**Fix:** `materials`, `questions`, `assessments`, and `invoices` for the
retiring term(s) are now explicitly deleted before the term rows themselves
— matching the printed summary to what actually happens instead of the
other way around.

**Verified:** created one of each of the four row types tied to a real
term, ran `--new-session --yes`, confirmed all four are genuinely gone
afterward (previously: still present, `term_id` silently nulled).

## Bug 3 — `POST /students` and `PUT /students/:id` had no scope check at all
**Found by:** logging in as a real class teacher (Grade 1, primary school)
and directly attempting to create/edit students outside that scope.

**What happened:** both routes were gated only on the generic `grades.write`
permission every teacher has, with no check at all beyond that. Confirmed
live: a Grade-1-only primary teacher successfully created a student in
Grade 2 (wrong class, same school) **and in the secondary school entirely**
— both returned `201 Created`. This is a direct violation of the
school-isolation rule the rest of this app enforces everywhere else
(`DELETE /students/:id` already had the correct check — POST and PUT simply
never got it).

**Fix:** added `checkTeacherRosterScope()` for `POST /students` (target
school/class must match the requester's own) and reused the existing
`checkTeacherDeleteScope()` for `PUT /students/:id` (same rule, already
proven correct on the delete path). Admin remains unrestricted on both.

**Verified:** own class → succeeds; other class, same school → `403`; other
school entirely → `403`; admin → succeeds regardless. Same four cases
re-tested for `PUT`.

## Bug 4 — `GET /scores` let a subject-only teacher pull an entire class's scores across every subject
**Found by:** creating a real subject-only teacher account (Mathematics,
no assigned class) and requesting another class's scores directly.

**What happened:** the route only blocked a subject-only teacher when *no*
`class_name` was supplied at all. Supplying any `class_name` — including a
class this teacher has no relationship to whatsoever — returned every
subject's scores for that entire class, no subject restriction applied
anywhere. Confirmed live: a Mathematics-only teacher account retrieved all
210 score rows across 15 different subjects for a class ("JSS2") they don't
teach, with a single `?class_name=JSS2` request.

**Fix:** for a subject-only teacher, `sc.subject_id` is now unconditionally
forced to their own `assigned_subject_id` — regardless of whether the
caller also passed a (possibly different, possibly forged) `subject_id`.
A mismatched or absent `subject_id` from the client no longer matters; the
query only ever returns their own subject.

**Verified:** no `subject_id` param + arbitrary class → returns only their
own subject's rows (not empty, not everything — exactly their subject, this
was the actual missing behavior). Spoofed `subject_id` for someone else's
subject → `0` rows. Their genuine own subject, specific class → correct
data returned. Their own subject, no class filter at all → correctly
returns their subject across every class in the school (the legitimate,
intended reach for a subject specialist).

*(Considered and deliberately did NOT change: `GET /students` allowing a
subject-only teacher to fetch an arbitrary class's roster once they name
it. Unlike the scores bug above, this is consistent with — not a violation
of — this app's existing subject-teacher design: `checkTeacherContentScope`
already grants a subject teacher reach across every class in their own
school for their own subject, and `ScoreEntryScreen.tsx` genuinely needs a
class roster to let a subject teacher enter scores against real student
names. Changing this would break that legitimate flow without closing a
real gap.)*

## Bottom line
Four real, exploitable-if-shipped bugs found by actually running this app
against real data and real requests rather than trusting its own comments
and prior changelog entries. All four are fixed and re-verified live in this
pass. Recommend the same kind of live run — not just `tsc --noEmit` — be
repeated against the real production database before this or any future
pass is used to build an APK.
