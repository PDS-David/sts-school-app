# Test Run Report — 2026-07-09

This is a record of an actual live test run — a real PostgreSQL 16 database
and the real backend server, driven with real HTTP requests — not a
type-check or a code read-through. (The mobile/Expo app itself couldn't be
run in this sandbox — no Android emulator or device is available here; see
"What wasn't tested" below.)

## Environment

- PostgreSQL 16, fresh database, `schema.sql` applied with no modifications.
- Backend started with `npx tsx src/index.ts` against that database.
- Test-only `.env` (dummy JWT secrets, dummy SMTP creds) — not shipped in
  the project; removed after testing.

## What was run, in order

1. `npm run db:seed` — succeeded. Created subjects/classes for both
   schools, a default **1st Term 2024/2025** per school, `admin` /
   `Admin@1234`, and `teacher1` / `Teacher@1234`.
2. `npx tsx src/db/importSecondTerm.ts` — **ran successfully** (created
   "2nd Term 2025/2026" per school, marked current) but **matched zero
   scores**, because `db:seed` doesn't load a student roster — there were no
   students in the fresh database for it to match against. This is expected
   behavior, not a bug: the script's own output explicitly lists every
   unmatched row rather than silently dropping it, exactly as designed. **On
   your real deployment**, your actual student roster will already exist
   (loaded via the Admin screens or however your roster gets in), so this
   will match normally — see `SESSION_COLLATION.md` for the run order that
   avoids this.
3. Logged in as `admin` and `teacher1` via `POST /auth/login` — both
   succeeded, returned valid tokens.
4. **3-term cap**, tested against a real session (`secondary`, `2025/2026`):
   - Created `3rd Term` — succeeded (only 2nd Term existed at that point).
   - Tried creating `3rd Term` again → **409**, "already exists for
     2025/2026."
   - Created `1st Term` to complete the trio — succeeded.
   - Tried creating a 4th term (`2nd Term` again, a valid name) once all 3
     existed → **409**, "already has all 3 terms of a session ... cannot
     exceed 3 terms."
   - Tried an invalid name (`"Mid Term"`) → **400**, correct rejection
     message.
5. **Session collation**, tested against a real student with real scores:
   - Created a test student, entered Mathematics scores for all 3 terms
     (2025/2026) and English Language scores for only 1st and 2nd Term.
   - `GET /scores/session-report/:student_id?academic_year=2025/2026`
     correctly returned: Mathematics `terms_recorded: 3`, session total =
     sum of all 3; English `terms_recorded: 2`, `total: null` for 3rd Term,
     session total = sum of the 2 entered; **`is_complete_session: false`**
     (correct — English wasn't finished yet).
   - Entered the missing English 3rd Term score → re-ran the same request →
     **`is_complete_session: true`**, grand total/average recalculated
     correctly across both subjects.

## Bug found and fixed

Testing a second, brand-new student with **zero** scores entered for the
session surfaced a real bug: the endpoint reported
`is_complete_session: true` for that student too, because
`subjects.every(...)` is vacuously true on an empty array — a session with
literally nothing recorded was being reported as "complete." This was not
visible from the code review or the type-check; it only showed up by
actually calling the endpoint with that specific case.

**Fixed** in `backend/src/routes/scores.ts` — `is_complete_session` now also
requires `subjects.length > 0`. Re-tested against both the zero-score
student (now correctly `false`) and the fully-recorded student (still
correctly `true`).

## Post-fix verification

- Fresh `tsc --noEmit` on the backend — 0 errors.
- Fresh static import-resolution check across all 57 mobile `.ts`/`.tsx`
  files — 0 unresolved imports.
- Rebuilt the delivered zip from a clean copy (no `node_modules`, no test
  `.env`, original `package-lock.json` restored) and unzipped it back out to
  confirm exactly the expected 107 files.

## What wasn't tested (and why)

- **The mobile app itself.** This sandbox has no Android emulator, no iOS
  simulator, and no physical device — there's no way to actually render
  `SessionReportScreen.tsx` or navigate the app here. What *is* covered:
  every relative import in the mobile codebase resolves to a real file (no
  orphaned components, no broken navigation targets), and the API contract
  it depends on (`GET /scores/session-report/:student_id`) was exercised
  live and returns the exact shape the screen expects. Rendering/UX still
  needs a real run-through on your machine — see `TESTING_ON_WINDOWS.md`.
- **Email sending** (password reset, admin notifications) — dummy SMTP
  credentials were used, so these would fail/log rather than send. Not
  exercised.
- **File uploads** (resources) — not exercised in this pass; no upload
  endpoints were touched by the 3-term/session-collation work anyway.
