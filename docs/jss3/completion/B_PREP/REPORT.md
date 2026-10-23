# B_PREP — protected-baseline acquisition preparation

**Status: preparation complete; protected comparison NOT performed; nothing certified.** `certification_claimed` is false everywhere. OB-06 stays open.

Base: master `3d0b78adf37f4b373b0c42caa44a0102bbce06b0` (fetched at start; no `AGENTS.md` exists in the repository). Branch `b-prep/acquisition-prep`. Read: EXECUTION_CONTRACT.md, BASELINE3/REPORT.md + `combined_counts.json`, P1_BASELINE/, `export_protected_curriculum.sql`, `combine_exports.py`. Reused established findings; did not request R6, repeat the Primary reconstruction, select a subset for 2,179 or change the gate.

## Findings (from code, tested on synthetic rows in a disposable loopback PostgreSQL 16.15 with `backend/schema.sql`)
1. **Export schema** is 11 columns (`id, school_code, subject_id, subject_name, class_name, term_label, title, description, source_reference, source_file, order_index`). It differs from the importer-capture schema (10 columns, `week_label`, `source_path`); a default comparison between them is BLOCKED ("row lacks a compared content column").
2. **Defect fixed — silent row loss:** the SQL filter matched only `Primary|PRY n`, `JSS 1`, `JSS 2`. `Grade n`, `JSS1`, `JSS2` (legacy names mapped by `renameClassNaming.ts`) were silently dropped. On the fixture the old SQL exported 5 of 7 in-scope rows; the new one exports 7, values unmodified.
3. **Defect fixed — surrogate ids:** the comparer's default content set included `id` and `subject_id`, which differ between databases, so equal content FAILed. Added `--exclude` (validated: unknown/identity columns and `--content` combination rejected; result records `excluded_columns`).
4. **Unhandled but now diagnosable:** a topic with no matching subject exports `subject_name: null` and the comparer stops BLOCKED with a generic message. New preflight SQL and validator count and name this case. Rows are never altered.
5. **Format traps documented:** parser chosen by `.json`/`.csv` suffix; mixed formats give false differences.
6. **Not decidable here:** the importer writes only title/source_reference/order_index/source_file to `topics`; whether those are the certified "full content" is an owner decision (checklist I6).

## Changes
| File | Change |
|---|---|
| `scripts/jss3/export_protected_curriculum.sql` | filter widened to legacy class spellings (values unmodified) |
| `scripts/jss3/preflight_protected_curriculum.sql` | NEW OUTPUT NAMES: read-only counts/class names, no lesson text |
| `scripts/jss3/b_prep/validate_export.py` | NEW OUTPUT NAMES: shape + provenance-completeness validator (no values in output; never certifies) |
| `scripts/jss3/b_prep/test_b_prep.py` | NEW: 9 tests (6 pure, 3 PostgreSQL) |
| `docs/jss3/completion/P1_BASELINE/compare_baseline.py` + tests | `--exclude`; 5 new tests (13 → 18) |
| `docs/jss3/completion/B_PREP/` | ACQUISITION.md, INPUT_CHECKLIST.json, PROVENANCE.template.json (template, NEW OUTPUT NAMES), this report |
No importer/runtime/backend change; no data created beyond synthetic fixtures in a throwaway database.

## Tests (exact)
- `cd docs/jss3/completion/P1_BASELINE && python3 -m unittest test_compare_baseline` → 18 OK.
- `cd scripts/jss3/b_prep && python3 -m unittest test_b_prep` → 9 run, OK, **3 SKIPPED** without a database (documented skip, not a pass).
- Same with `JSS3_LOCAL_TEST_DATABASE_URL=postgresql://postgres@127.0.0.1:<port>/jss3_test_bprep` (schema loaded) → 9 OK, 0 skipped.
- Existing: `baseline2/test_baseline2.py` 7 OK, `test_combine_exports.py` 5 OK, `baseline3/test_baseline3.py` 9 OK.
- Manual end-to-end on synthetic data (not committed): `pg_dump -Fc` → second database via `pg_restore` → export both → compare = PASS (count diagnostic); ids shifted → FAIL without / PASS with `--exclude id,subject_id`; null-subject row → BLOCKED.
- Not run: JSS3 acceptance runner (no teaching/runtime change). CI results are not yet known.

## Exact unresolved inputs (owner)
See `INPUT_CHECKLIST.json`: **I1** identified historical certified export/backup (or the alternative written certification record I1-alt) with provenance and approval record; **I2** the designated release-candidate snapshot with provenance; **I6** what counts as full content; **I7** engine/version and access route; **I8** class-naming policy for a pre-rename backup. Identity key (I4) is established in code but still needs owner confirmation with the real export.

## Statuses
Implementation: done. Testing: as above. Publication: see PR. Integration, merge, deployment, production access: not done, not authorised.
