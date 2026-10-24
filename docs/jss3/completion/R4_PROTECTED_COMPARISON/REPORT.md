# R4 — protected Primary/JSS1/JSS2 comparison: BLOCKED on owner-held inputs

Base: master `eadc0772f1caca91165e9a6c1d320b8655eef58e`. Branch `jss3/r4-protected-baseline-20261024-k7m2`. Contract: `NEXT_AGENT_TASKS/EXECUTION_CONTRACT.md` (no `AGENTS.md` exists).

**The protected comparison was NOT run. Nothing is certified and the figure 2,179 is neither confirmed nor refuted.** No database, restore, remote source or production system was contacted. No curriculum content, JSS3 lesson or row was changed or filtered. This is not another reconstruction audit; the known facts in the task (reconstructed totals were not 2,179; R6 is not the certified export; the JSS3 private ZIP is not the protected-row baseline) are taken as given and not re-investigated.

## What is missing (precisely)
| Item | Needed | Status |
|---|---|---|
| **A** (checklist I1) | An identified pre-JSS3 certified export or backup with the seven provenance fields (`origin, export_taken_utc, data_as_of_utc, scope, approval_record, export_method, sha256`) **or** read access to a point-in-time restore/frozen copy | NOT SUPPLIED |
| **A-alt** (I1-alt) | Historical record naming the exact importer commit, source archive hashes and class/school filters that yield the certified set | NOT SUPPLIED |
| **B** (I2) | Release snapshot for the same protected scope, with owner designation of the release-candidate database and provenance | NOT SUPPLIED |
| Owner decisions | I4 identity key confirmation, I6 what counts as full content, I7 engine version/route/who exports, I8 legacy class-name policy | OPEN (unchanged from B_PREP `INPUT_CHECKLIST.json`) |

Searched: this task's uploads (none), tracked repository files (only templates and reports; no export, dump, backup or filled provenance file), and the sandbox. Master's own status table still lists these as owner-held.

A present-day baseline would need an explicit owner decision and would **not** be historical certification; none was substituted.

## Exact operator commands (existing tooling, from `B_PREP/ACQUISITION.md`; no filenames invented beyond that file's "NEW OUTPUT NAMES")
Keep everything under a private `$PRIV` outside Git. Pick the route that matches what the owner holds, for **both** inputs (same file format for both).
- **3A existing row export:** `sha256sum <file>`, then `python3 scripts/jss3/b_prep/validate_export.py --export <file> --kind certified-baseline --provenance $PRIV/certified_baseline_provenance.json --output $PRIV/certified_baseline_validation.json` (use `--kind release-snapshot` and the `release_snapshot_*` names for B).
- **3B dump:** restore only to an isolated loopback database `jss3_test_baseline` (`createdb`, then `pg_restore --no-owner --no-privileges --exit-on-error` or `psql -v ON_ERROR_STOP=1 -f`), then `psql -X -qAt --set ON_ERROR_STOP=1 … --file scripts/jss3/preflight_protected_curriculum.sql > $PRIV/certified_baseline_preflight.json` and the same with `scripts/jss3/export_protected_curriculum.sql > $PRIV/certified_baseline_export.json`. If `topics` lacks `term_label, source_reference, order_index` or `source_file`, stop and report; do not run `backend/schema.sql` on the restore.
- **3C designated read-only database:** owner supplies libpq settings (`PGHOST, PGPORT, PGDATABASE, PGUSER`, password via prompt/`PGPASSFILE`), `PGOPTIONS='-c default_transaction_read_only=on'`, a SELECT-only role, then the same two `psql --file` commands. Valid as historical only if the approval record says it is a point-in-time restore or frozen copy, with its date.
- **Compare, only when both validations are OK (or each listed problem is accepted in writing):**
  `python3 docs/jss3/completion/P1_BASELINE/compare_baseline.py --baseline $PRIV/certified_baseline_export.json --snapshot $PRIV/release_snapshot_export.json --key school_code,class_name,subject_name,term_label,order_index --exclude id,subject_id --output $PRIV/protected_comparison.json`
  Exit 0 PASS, 1 FAIL, 2 BLOCKED. No `--expected-count` and no `--content` for the gate. Excluded columns are only the surrogates `id` and `subject_id` (they differ between databases and are not content); no content field is excluded.
- Legacy class names (`PRY n`, `Grade n`, `JSS1`, `JSS2`) in an old backup are reported, not rewritten; applying `renameClassNaming.ts` to a disposable restore needs owner approval and must be recorded as a derived export.
- Return only validation/preflight JSON, hashes and provenance. Never commit exports.

## What was verified without the inputs (tooling readiness only; not evidence about the real rows)
- `--help` read for `compare_baseline.py` and `validate_export.py` before use.
- `P1_BASELINE/test_compare_baseline.py`: 18/18 OK (includes missing/extra/duplicate, content mismatch naming fields only, exclude does not hide real differences, blank identity and malformed CSV fail closed).
- `scripts/jss3/b_prep/test_b_prep.py`: 6 OK, 3 SKIPPED (the SQL preflight/export tests need `JSS3_LOCAL_TEST_DATABASE_URL`; no PostgreSQL here). B_PREP records running them on a disposable PG16; not repeated.
- New `selfcheck_synthetic.py` (stdlib, 50 synthetic rows, real CLI, protected-gate flags): identical and surrogate-ids-only-different PASS (exit 0); changed title, source_reference, source_file, description, a changed identity field, a removed row, an added row and a duplicated identity all FAIL (exit 1); surrogate-ids-only FAILs without `--exclude`. 11/11 as expected. Output: `results_selfcheck_synthetic.json`. These are the negative controls; they must be re-run on the real pair once supplied.
- No comparer or export defect was demonstrated, so no tool was changed.

## Files
`REPORT.md`, `results.json` (sanitised status), `selfcheck_synthetic.py`, `results_selfcheck_synthetic.json`. No raw export, credential or student record is included.

## Statuses
Implementation: nothing to fix. Protected comparison: **BLOCKED / NOT PERFORMED**. Certification: not claimed. Publication: see PR. Merge: not done (integrator only).
