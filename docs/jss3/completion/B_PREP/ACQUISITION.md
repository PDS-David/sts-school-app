# B_PREP — acquiring and validating the two protected-baseline inputs

**Status: preparation only.** Following this file produces two validated input files. It does not run, pass or certify the protected 2,179-row comparison, and no step here claims certification. Every filename marked **NEW OUTPUT NAMES** is a name proposed by this task; none exists in the repository or in any private store.

No hosting provider, database address, username or password is assumed. Use whatever the owner designates. Keep every export, dump, preflight and provenance file **outside Git**.

## 1. Prerequisites
- Python 3.12 (standard library only for the tools below); `psql` and, for dumps, `pg_restore` of a major version **at least** that of the source.
- A working copy of this repository at or after this branch (`scripts/jss3/b_prep/validate_export.py`, `scripts/jss3/preflight_protected_curriculum.sql`, `scripts/jss3/export_protected_curriculum.sql`, `docs/jss3/completion/P1_BASELINE/compare_baseline.py`).
- A private working folder, referred to as `$PRIV`, outside the repository.
- Hash every received file first: `sha256sum <file>` and record it in the provenance file.

## 2. What the tools accept (established by reading the code and testing on synthetic rows)
Export columns produced by `export_protected_curriculum.sql` (one JSON array, one object per `topics` row, ordered by identity then `id`):

`id, school_code, subject_id, subject_name, class_name, term_label, title, description, source_reference, source_file, order_index`

- **Scope:** `topics.class_name` is `Primary 1`–`Primary 6`, `JSS 1`, `JSS 2`, or the legacy spellings `PRY n`, `Grade n`, `JSS1`, `JSS2`. Values are exported **as stored, never rewritten**. Other classes (for example `JSS 3`) are excluded.
- **Identity key** (pass to the comparer exactly): `school_code,class_name,subject_name,term_label,order_index`. This is the database's `topics_ingestion_dedupe` uniqueness with `subject_name` instead of the per-database `subject_id`. The owner must still confirm it against the real export (P1_BASELINE/README).
- **Surrogate columns** `id` and `subject_id` differ between databases and must not be compared: use `--exclude id,subject_id`.
- **Content columns compared by default:** `title, description, source_reference, source_file`. The importer writes only `title`, `source_reference`, `order_index`, `source_file`; `description` is not importer-written. `summary`, `generated_assessment_id`, `term_id`, `created_by` and timestamps are runtime fields and are not exported. Whether these columns are the certified "full content" is **owner decision I6**; nothing here decides it.
- **File format:** the filename must end `.json` (psql output) or `.csv`; the comparer picks the parser by suffix. Use the **same format for both inputs**: CSV carries every value as text, so a JSON-vs-CSV pair reports false differences (`1` vs `"1"`).
- A row whose `subject_id` has no matching `subjects` row exports `subject_name: null`; the comparer then stops BLOCKED (blank identity). Do not delete or edit such rows; report them (see preflight).
- The importer-capture format (`rows.json` from `capture_importer_rows.py`, 10 columns incl. `week_label`, `source_path`) is a different schema. Against a database export it only compares with an explicit `--content title,source_reference,source_file`, and then it is a diagnostic, not the protected gate.

## 3. Input 1 — identified historical certified export or backup  (`--baseline`)
**A current export is not historical.** A file produced today from today's database is not a historical certified baseline, whatever it contains. The baseline needs a record that dates the *data state* (`data_as_of_utc`) and ties it to an owner approval.

Provenance needed (copy `PROVENANCE.template.json`; **NEW OUTPUT NAMES:** `$PRIV/certified_baseline_provenance.json`): `origin`, `export_taken_utc`, `data_as_of_utc`, `scope`, `approval_record`, `export_method`, `sha256`. For a baseline, `data_as_of_utc` must be the backup time or the date the approval record certifies, and must differ from `export_taken_utc` unless the approval record itself is dated that day.

Choose the route that matches what the owner actually holds.

### 3A. An existing row export (JSON or CSV)
```
sha256sum <received-export>
python3 scripts/jss3/b_prep/validate_export.py --export <received-export> \
  --kind certified-baseline --provenance $PRIV/certified_baseline_provenance.json \
  --output $PRIV/certified_baseline_validation.json        # NEW OUTPUT NAMES
```
The file needs at least `school_code, class_name, subject_name, term_label, order_index, title, source_reference, source_file`. If its columns differ from the 11 above, the validator lists the fields found; do not rename or add columns.

### 3B. A database dump restored locally
Disposable loopback PostgreSQL only; database name `jss3_test_<label>` (repository convention, EXECUTION_CONTRACT item 6). Never restore over any shared database.
```
sha256sum <dump>
createdb -h 127.0.0.1 -p <port> jss3_test_baseline
pg_restore -h 127.0.0.1 -p <port> --no-owner --no-privileges --exit-on-error -d jss3_test_baseline <dump>   # custom/tar format
#   plain SQL dump instead:  psql -X -h 127.0.0.1 -p <port> -v ON_ERROR_STOP=1 -d jss3_test_baseline -f <dump.sql>
psql -X -qAt --set ON_ERROR_STOP=1 -h 127.0.0.1 -p <port> -d jss3_test_baseline \
  --file scripts/jss3/preflight_protected_curriculum.sql > $PRIV/certified_baseline_preflight.json     # NEW OUTPUT NAMES
psql -X -qAt --set ON_ERROR_STOP=1 -h 127.0.0.1 -p <port> -d jss3_test_baseline \
  --file scripts/jss3/export_protected_curriculum.sql > $PRIV/certified_baseline_export.json          # NEW OUTPUT NAMES
```
If the export fails because `topics` lacks `term_label`, `source_reference`, `order_index` or `source_file`, **stop and report it**: the backup predates the identity model and cannot serve as an identity-keyed baseline. Do not run `backend/schema.sql` on the restore to make it work.

### 3C. An owner-designated read-only database
Use only the connection the owner designates, supplied by the owner through the standard libpq mechanisms (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and a password prompt, `PGPASSFILE` or equivalent). Do not put credentials on a command line, in a file in the repository or in shell history. The export transaction is `READ ONLY`; also set `PGOPTIONS='-c default_transaction_read_only=on'` and ask for a role that can only `SELECT` from `topics` and `subjects`. Run the same two `psql --file` commands as in 3B, without `-h/-p/-d` overrides.
A live database is the **current** state. It is a valid historical baseline only if the owner states in the approval record that it is a point-in-time restore or frozen copy of the certified state, and gives its date.

## 4. Input 2 — snapshot of the database proposed for release  (`--snapshot`)
Provenance as above (**NEW OUTPUT NAMES:** `$PRIV/release_snapshot_provenance.json`); `approval_record` is the owner's designation of this database as the release candidate; `data_as_of_utc` is the moment the snapshot reflects (it may equal the export time). Routes 3A, 3B and 3C apply unchanged, with `--kind release-snapshot` and files named `release_snapshot_preflight.json`, `release_snapshot_export.json`, `release_snapshot_validation.json` (**NEW OUTPUT NAMES**). Take the snapshot in one `REPEATABLE READ` transaction (the export SQL already does) and do not let imports or migrations run on that database between preflight and export.

## 5. Validate each input, then compare
Preflight output (counts and class names only, no lesson text): `in_scope_rows`, `all_topics_rows`, `rows_with_null_subject_name`, `rows_with_null_order_index`, `rows_with_null_term_label`, `legacy_class_name_rows`, `by_school_class_term`, `out_of_scope_class_names`, `duplicate_identity_groups`. The validator reports `OK` only when the shape is sound, no identity is null/duplicated, every class name is current, and the provenance is complete and its `sha256` matches the file. `NOT_READY` lists each problem. `OK` is **not** certification. `protected_count_matches_2179` is informational.

Only when both validations are `OK` (or the owner has explicitly accepted each listed problem in writing):
```
python3 docs/jss3/completion/P1_BASELINE/compare_baseline.py \
  --baseline $PRIV/certified_baseline_export.json --snapshot $PRIV/release_snapshot_export.json \
  --key school_code,class_name,subject_name,term_label,order_index --exclude id,subject_id \
  --output $PRIV/protected_comparison.json                                  # NEW OUTPUT NAMES
```
Exit 0 PASS, 1 FAIL, 2 BLOCKED. Do **not** pass `--expected-count` for the protected gate (default 2179); a different value or `--content` makes the result a diagnostic. Verified on synthetic data: a dump restored to a second database exports identically (PASS); two exports differing only in `id`/`subject_id` FAIL without `--exclude` and PASS with it; a real content difference still FAILs with `--exclude`.

## 6. Legacy class names
A backup taken before `backend/src/db/renameClassNaming.ts` ran contains `PRY n`, `Grade n`, `JSS1`, `JSS2`. The export now keeps those rows unmodified and the validator flags them. Comparing a legacy-named baseline with a current-named snapshot yields missing/unexpected identities (a truthful FAIL). Applying the rename is a **data change that needs the owner's approval**; if approved, apply it only to a disposable local restore following that script's own header, record it in `export_method` as a derived export, and never to the source database. This task does not run it.

## 7. Return to the owner
`*_validation.json`, `*_preflight.json`, hashes and provenance files (private). Never commit exports; they contain lesson titles and source file names.
