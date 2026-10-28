# J04 — check receipt of actual protected baseline files

```text
Repository: PDS-David/sts-school-app. Fetch latest master, read applicable AGENTS.md and check open PRs. Work on a unique branch. Do not repeat completed work or overwrite another worker. SS1 files are outside scope. Testing is deferred: no tests, typechecks, importer, DB, staging/device or production operations. Source reading, hashes, JSON/reference/diff checks are allowed. Do not invent approvals or claim certification. Commit/push a scoped PR; do not merge. If unable to push, deliver a binary-capable patch with exact base SHA. No token requests. Stop after the one task.

INPUT GATE: A, historical certified Primary/JSS1/JSS2 export or backup, and B, owner-designated release snapshot, with provenance. Read docs/jss3/completion/B_PREP/ACQUISITION.md and INPUT_CHECKLIST.json there; docs/jss3/completion/SEQUENTIAL_CLOSEOUT_20261025/TASK_07_REPORT.md; docs/jss3/completion/P1_BASELINE/README.md. Use the format defined by those files, not a guessed CSV. Original JSS3/SS1 term ZIPs are NOT substitutes.

Each input needs origin, export_taken_utc, data_as_of_utc, scope, approval_record, export_method, sha256. The actual filenames can differ; identify role A/B by provenance, not filename. If no historical export exists, ask for the documented alternate certified-set definition; do not fabricate one or trim to 2179.

Task is receipt checking only: hash files, inspect supplied metadata/format and report whether each is suitable for the existing comparator, plus precise missing fields and unresolved I4/I6/I7/I8 choices. No database contact, restore, comparison suite or production export in this task. Keep data private; commit only non-sensitive receipt metadata to docs/jss3/completion/MICROTASKS_20261028/J04_RESULT.md. A usable receipt permits the later comparison when testing resumes; it does not prove row equality.
```
