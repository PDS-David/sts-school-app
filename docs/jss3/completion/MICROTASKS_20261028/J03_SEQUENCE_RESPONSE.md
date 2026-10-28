# J03 — prepare one supplied sequencing response

```text
Repository: PDS-David/sts-school-app. Fetch latest master, read applicable AGENTS.md and check open PRs. Work on a unique branch. Do not repeat completed work or overwrite another worker. SS1 files are outside scope. Testing is deferred: no tests, typechecks, importer, DB, staging/device or production operations. Source reading, hashes, JSON/reference/diff checks are allowed. Do not invent approvals or claim certification. Commit/push a scoped PR; do not merge. If unable to push, deliver a binary-capable patch with exact base SHA. No token requests. Stop after the one task.

INPUT GATE: owner response naming D6 school code(s), D7 TERM_PIN_ENFORCED setting, and approved placement rows with approver/date/basis. No curriculum source attachment required. Do not guess values or reuse a blank template as approval.

Read docs/jss3/completion/R2_SEQUENCING/R2_APPROVAL_FORM.md, PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv in that directory, docs/jss3/completion/SEQUENTIAL_CLOSEOUT_20261025/TASK_05_REPORT.md and SEQUENCE_SCHEMA_COMPATIBILITY.md, backend/src/db/jss3SequencePlan.ts and backend/src/db/data/jss3SequencePlan.json.

This task ONLY transcribes the supplied response into docs/jss3/completion/R2_SEQUENCING/PLACEMENT_APPROVAL_RESPONSE.csv, plus docs/jss3/completion/MICROTASKS_20261028/J03_RESULT.md. Preserve template IDs and hash binding; mark no unapproved row approved. Verify supplied IDs/anchor titles against the current proposal and record stale/unmatched rows without silently moving them. Do not alter the active plan, run apply tools or touch student progression. Completion means the actual response is accurately recorded, not activation. Subsequent plan compilation and staging dry run require a separate task after testing resumes.
```
