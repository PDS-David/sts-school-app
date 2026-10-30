# OPS-04 — Student-data erasure (soft delete + PII redaction, history retained)

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `e271842d170bc74d6912d6040cfda086438be961`. Prompt line numbers were written against `8ffcd12`; citations are at `e271842` unless marked "new".
Owner decision D7: **not supplied in writing.** Implemented on the owner's instruction to execute OPS-04, using the prompt's recommended default. The owner must confirm D7 before merge. If D7 is hard deletion or anonymised aggregates, this change is the wrong shape (see "Not done").
OPS-01 has not landed, so no numbered migration exists to add. **No schema change was needed** (no new column), so none was written.
Files changed: `backend/src/routes/students.ts`, this note.

## Premise check — contradiction with the prompt

The prompt says to overwrite `full_name` and set `birth_date`, `phone`, `email` and `gender` to NULL. The `students` table has **no** `phone`, `email` or `birth_date` column. Its personal columns are `full_name`, `admission_number`, `gender`, `date_of_birth` (`schema.sql:175-185`). I redacted the columns that exist (`full_name`, `gender`, `date_of_birth`, `admission_number`) and did not invent others. Phone and email live on `users` (including a student's own login and a parent's account), which this endpoint does not touch (see "Not done").

## Old behaviour (base)

- Soft delete only: `DELETE /students/:id` sets `deleted_at`/`deleted_by` (`students.ts:341-343`); admin restore clears them (`students.ts:355-364`). No historical snapshot is kept, and every personal column stays in the row.
- No endpoint redacts personal fields. The only bulk-capable writer of `full_name`, `gender`, `date_of_birth` and `admission_number` is the generic `PUT /students/:id` (`students.ts:204-222`), which sets caller-supplied values, one student at a time, and refuses soft-deleted rows (`deleted_at IS NULL`, `:213`).

## New behaviour

`POST /students/:id/erasure` (new, `students.ts:461`; constant at `:447`), `requireRole('admin')`, body `{ confirmation, reason }`.

| Check / step | Behaviour |
|---|---|
| Role | Non-admin → 403 from `requireRole`. Not DELETE, no query parameter. |
| Id | Not a UUID → 404 (avoids a 500 from Postgres on a malformed id). |
| Body | `reason` 5–500 chars and `confirmation` required (zod), else 400. |
| School | If the admin has a `school_code` and it differs from the student's → 403. An admin with no `school_code` is cross-school everywhere else in the app (`scope.ts:28`, `:52`), so it is not restricted here. |
| Confirmation | Must equal the student's current `admission_number`, or `full_name` when the student has no admission number. Mismatch → 400. The expected value is never echoed. |
| Locking | One transaction (`withTransaction`); the student row is read `FOR UPDATE`. |

### Field-by-field

| Column | Before | After |
|---|---|---|
| `full_name` | real name | `Erased student` |
| `gender` | any | NULL |
| `date_of_birth` | any | NULL |
| `admission_number` | any | `ERASED-` + first 12 hex of `sha256(id)` (deterministic, not reversible, unique per student, so `students_school_admission_unique` still holds — `schema.sql:791-793`) |
| `deleted_at` | NULL or set | set to `now()` only if NULL; otherwise kept |
| `deleted_by` | NULL or set | set to the admin only when `deleted_at` was NULL; otherwise kept |
| `id`, `school_code`, `class_name`, `user_id`, `created_at` | — | unchanged |

12 hex characters were used instead of the prompt's example of 8, to make a collision within one school negligible. A collision would raise a unique-violation error and roll back (500); it would not corrupt data.

### Audit

One `audit_log` row per call, inserted **in the same transaction** (`action='erase_student'`, `entity='student'`, `entity_id`=student id, `school_code`=the student's, `detail`=JSON `{reason, fields_changed, already_erased}`). `fields_changed` lists column **names** only; old values are never written. Deliberate departure from the prompt's implied use of `utils/audit.ts`: that helper swallows insert failures (`audit.ts:23-25`), which would let an erasure commit with no audit record. Here an audit failure rolls the erasure back.

Caveat: `reason` is free text the admin types and is retained. The endpoint comment tells admins not to put personal details in it; nothing enforces that.

### Idempotence

A call on an already-erased student (name = placeholder, admission number = the token, `gender`/`date_of_birth` NULL, `deleted_at` set) skips the `UPDATE`, changes nothing on the student row, and writes one audit row with `already_erased: true`, `fields_changed: []`. Because the admission number is then the token, the confirmation string for a repeat call is that token.

### Restore

`POST /students/:id/restore` (`students.ts:355`) still works on an erased student and makes the row visible again as "Erased student" with the token admission number. It cannot restore the redacted values: they are not stored anywhere, including the audit row.

## Step 2 — downstream reads (placeholder name replaces the historical name)

Reads that return a student's name/admission number from `students` and do not exclude soft-deleted rows will now show `Erased student` / `ERASED-…` for erased students. This is the intended trade-off. Sites found (not edited): `admin.ts:351` (Excel export), `admin.ts:417` (term PINs), `attendance.ts:172`, `finance.ts:65`, `learning.ts:1268`, `:1296`, `scores.ts:33`, `weeklyEfforts.ts:79`, `students.ts:43`, `:67`, `:103`, `:133`, and the `SELECT * FROM students` reads at `scores.ts:291`, `:415`, `attendance.ts:136`. `scores.ts:281` already hides a soft-deleted student's report from non-admins. I did not check each site for a `deleted_at` filter; which of them already hide soft-deleted students is unverified.

## Not done / unresolved (owner action needed before this can be called an erasure workflow)

1. **The student's own login.** If `students.user_id` is set, the matching `users` row keeps `full_name`, `username`, `phone`, `email`. This endpoint does not touch it. Parent accounts and `parent_wards` links are also untouched. Redacting or deleting linked accounts is a separate decision.
2. **Free text elsewhere.** Remarks, class-record comments, weekly-effort comments and AI summaries, submission answers and messages can contain a name. The prompt said to leave those tables untouched; they are untouched.
3. **Legal question:** whether invoice records may be retained after an erasure request. Invoices keep their rows and amounts; only the joined student name changes. Not decided here.
4. **Existing soft-deleted students** are not erased; each needs an explicit call.
5. D7 alternatives (hard delete / anonymised aggregates) would need per-table foreign-key delete behaviour decided first; no SQL was written.
6. No claim of legal compliance is made.

## Acceptance (static)

- No other endpoint was added or changed. No `DELETE FROM students` and no cascade in the new code.
- Idempotent as described above.
- No background job, scheduler or portal added.

No tests, typechecks, DB, migrations, server or device checks were run, and the endpoint was never called. Testing deferred by owner.
