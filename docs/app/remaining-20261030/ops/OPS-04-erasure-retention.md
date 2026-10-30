# OPS-04 — Define and implement student-data erasure

Status: BLOCKED ON OWNER DECISION D7 · Depends: OPS-01 · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/students.ts`, `backend/migrations/<next>_erasure.sql` (only if a column is needed), `docs/app/remaining-20261030/evidence/OPS-04.md`

## Why

The app has a soft delete (`students.deleted_at`, `deleted_by`) and an explicit admin restore (`students.ts:239-244` documents that no historical snapshot is kept). It has no erasure workflow: the reference manual states there is "no demonstrated ... general legal erasure workflow or formal security/privacy certification."

Soft delete is the right default — it preserves scores, invoices and audit history. It is not erasure: `full_name`, `phone`, `email`, `birth_date` and `admission_number` remain in the row and in every report query that includes a soft-deleted student. A school that receives an erasure request has no safe operation other than direct SQL, which the manual explicitly warns is not equivalent to a safe application operation.

## Do (recommended default for D7: soft delete + PII redaction, history retained)

1. Add an admin-only `POST /students/:id/erasure` (not DELETE, not a query parameter), requiring a typed confirmation string in the body (e.g. the student's admission number) and a reason. It must:
   - refuse a non-admin caller and a student outside the admin's school;
   - set `deleted_at`/`deleted_by` if not already set;
   - overwrite `full_name` with a fixed placeholder (`"Erased student"`), set `birth_date`, `phone`, `email` and `gender` to `NULL`, and replace `admission_number` with a deterministic, non-reversible token (e.g. `ERASED-<8 hex of sha256(id)>`) so the per-school unique constraint still holds;
   - leave `id`, `school_code`, `class_name`, scores, attendance, remarks, weekly efforts, invoices and submissions untouched (academic and financial history must remain internally consistent);
   - write one `audit_log` row with action `erase_student`, the reason, and the fields changed — never the old values.
2. Guard downstream reads: confirm every student join selects only the columns it needs, so the placeholder name does not silently replace a historical name on a report (it will, and that is the intended trade-off — record it in the note).
3. If D7 chooses hard deletion or anonymised aggregates instead, stop and report: scores, invoices and submissions have foreign keys and the foreign-key delete behaviour must be decided per table before any SQL is written.
4. Evidence note: field-by-field before/after, the retained tables, and the unresolved legal question (whether invoice records may be retained).

## Acceptance (static)

- No endpoint other than the new one modifies personal fields in bulk.
- The operation is idempotent (running it twice changes nothing beyond the audit row).
- No `DELETE FROM students` and no cascade.
- Restore of an erased student remains possible administratively but does not restore the redacted PII (state this).

## Do not

- Run the endpoint or any SQL.
- Add a background job, retention scheduler or DSAR portal.
- Claim legal compliance.
