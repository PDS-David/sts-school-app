# Session Model: 3-Term Cap + Collation

## The rule, as implemented

A **session** = exactly 3 terms: `1st Term`, `2nd Term`, `3rd Term`, scoped
by `(school_code, academic_year)`. This is now enforced at the API layer,
not just assumed by convention.

## 1. Running `importFirstTerm.ts` (gets 1st Term data in place)

> **Naming correction:** this section originally described a script called
> `importSecondTerm.ts`, matching the "2nd Term" label the legacy source
> database used. That label was wrong — the legacy system's own report-card
> exports say "First Term" on every card. The script and its data bundle
> have been renamed/relabeled to `importFirstTerm.ts` /
> `data/first_term_import.json` accordingly; the academic year, 2025/2026,
> was already correct and is unchanged. See README.md for the up-to-date
> description of what it does.

This script already existed — this is guidance on running it correctly,
not a new script.

**Prerequisites, in order:**

1. Database created and `backend/schema.sql` applied.
2. `backend/.env` configured (copied from `.env.example`, with your real
   `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`).
3. `npm install` run inside `backend/`.
4. `npm run db:seed` run **first** — this creates the schools, the demo
   **1st Term 2024/2025** placeholder row per school, the admin account, and
   (per `seed.ts`) a starter subject/class set. Unlike the old script,
   `importFirstTerm.ts` does **not** require students to already be
   loaded — it creates any student in its own bundle that doesn't already
   exist (matched by admission number, falling back to an exact
   full_name + class_name + school_code match), so it can run against an
   empty roster.

**Then run the import:**

```bash
cd backend
npx tsx src/db/importFirstTerm.ts
```

**What it does** (from the script's own header, confirmed by reading it):
1. Upserts a **1st Term 2025/2026** row per school. Only marks it
   `is_current` if the school has no current term yet — it will not demote
   a term you've already moved on to (e.g. if 2nd Term is already open).
2. Upserts any subjects present in the bundle that don't already exist.
3. Upserts any students present in the bundle that don't already exist —
   existing students are left completely untouched.
4. Upserts scores, attendance, and class-teacher/admin remarks for that term.
5. Prints a summary, and explicitly lists anything it couldn't match (e.g. a
   name/class mismatch) so you can fix it by hand rather than have it
   silently dropped.

**Safe to re-run** — every write is an upsert (`ON CONFLICT DO UPDATE` for
scores/attendance/class-records, skip-if-exists for students/subjects), so
running it twice re-applies the same data rather than duplicating rows or
overwriting anything you've since edited by hand. Because it no longer
force-marks its term current on every run, re-running it after opening 2nd
or 3rd Term is safe too — it leaves `is_current` alone in that case.

After this step, 1st Term data exists for every student in the bundle. Bring
in 2nd Term the same way once that batch is ready (same script pattern, new
bundle), or have teachers enter it directly through `ScoreEntryScreen`.

## 1b. Resetting between terms/sessions

`backend/src/db/resetAcademicData.ts` is the companion script for clearing
data cleanly at a term or session boundary — e.g. wiping this imported 1st
Term batch before re-running a corrected import, or clearing everything to
start a brand-new academic year. Same run-it-yourself-via-SSH pattern as the
import script, with a mandatory dry run before anything is deleted. See the
"Resetting for a new term or session" section in README.md for full usage.

## 2. The 3-term cap (new)

`backend/src/utils/terms.ts` is the single source of truth:

```ts
export const SESSION_TERM_NAMES = ['1st Term', '2nd Term', '3rd Term'] as const;
```

`POST /terms` (`academic.ts`) now:
- Rejects any `name` outside that list — `400`.
- Rejects creating a term if `(school_code, academic_year)` already has 3
  rows — `409`, with a message naming the 3 terms already present.
- Rejects a duplicate name within the same session — `409`.

`PUT /terms/:id` mirrors the name validation (can't rename a term to
something outside the 3, or to a name that collides with another term
already in that session).

This means: once 1st and 2nd Term exist for a school+year, an admin opening
**3rd Term** just needs `POST /academic/terms` with
`{ name: "3rd Term", academic_year: "2025/2026", school_code, ... }` and then
mark it current the same way 2nd Term was — after that, teachers enter
scores for it exactly as before, through the same `ScoreEntryScreen` Term
picker. A 4th term is no longer possible for that year.

## 3. Session collation (new)

**Backend:** `GET /scores/session-report/:student_id?academic_year=`
(`scores.ts`). For the resolved academic year, it:
- Loads whichever of the (at most 3) terms exist for that school+year.
- Sorts them into 1st → 2nd → 3rd order regardless of insert order, using
  the same `termRank()` helper the cap uses.
- For each subject, builds `term_scores` (one entry per term, `null` if not
  yet entered), a `session_total` (sum of whatever terms are recorded),
  `session_average`, and `session_grade`.
- Returns a grand `summary` (total/average across subjects) and summed
  attendance (`days_present`, `days_opened`) across the terms present.
- Flags `is_complete_session: true` only once all 3 terms exist **and**
  every subject has all 3 recorded — so a partially-entered 3rd Term shows
  up honestly as "in progress," never presented as a final result.

**Authorization** mirrors the existing single-term report exactly (student
sees own, parent sees ward only, teacher sees own school, admin sees all).

**Mobile:** new `SessionReportScreen.tsx`, opened via a "View Session Report
(1st + 2nd + 3rd Term)" button on the existing `MyResultsScreen.tsx` (the
per-term report card). It shows a per-subject table with one column per term
present plus Total/Average/Grade, an in-progress banner while the session
isn't complete, and a session summary card (terms recorded, attendance,
grand total/average). Registered in `StudentTabs.tsx`, `ParentTabs.tsx`, and
`AdminStack.tsx`, next to the existing `MyResults` route in each.

## One assumption worth confirming with you

`session_average` per subject is a **simple arithmetic mean of the term
totals that exist** (e.g. two terms in → average of those two; three terms
in → average of all three). If your school's actual promotion/grading policy
weights terms differently (e.g. 3rd Term counts more because it includes the
promotion exam, or the session result should be a straight sum rather than
an average), tell me the exact formula and I'll adjust
`session_total`/`session_average` in `scores.ts` accordingly — it's isolated
to a few lines in the one endpoint.
