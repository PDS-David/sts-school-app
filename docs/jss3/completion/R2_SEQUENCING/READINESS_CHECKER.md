# JSS3 offline sequence readiness checker

**IMPLEMENTED — TESTING DEFERRED BY OWNER.** No test, checker run, typecheck,
conversion of real approvals, DB query or activation was performed.

Base master: 351337dbf01d6320c2d393e3f5cf6729780a94ca.
Dependency: PR67's merged scripts/jss3/convert_placement_approvals.py.
Files added: scripts/jss3/check_sequence_readiness.py,
tests/test_jss3_sequence_readiness.py, and this document.
No SS1 files, active plan, curriculum, schema, workflow or runtime routes changed.

## Behaviour

Recomputes the expected plan AND receipt in memory using the current converter
and current repository catalog/proposal/template/relations/policy. All reviewed
hash, approval, calendar-date, subject/term and anchor rules are inherited.
The entire bundle must match the recomputation byte-for-byte. Editing a plan
and merely recomputing its receipt hash cannot pass. Stale inputs, altered
counts/PIN/status and a school absent from D6 are refused.

Manual formatting changes also change bundle bytes: regenerate from genuinely
reviewed inputs rather than editing a plan. Names and hashes are provenance,
not digital signatures. The checker cannot authenticate a person who rewrites
all inputs and invents approval references. Verify actual owner authority.
It also cannot prove capture freshness; use the later verified candidate capture.

PENDING/KEEP_AT_END IDs remain visible and appended. They do not become approvals
and do not block a separately authorised approved subset. All-pending plans are
inert. D7's expected PIN boolean is reported but never read from or applied to
the backend environment.

## Exact inputs

Reuse CONVERTER.md's real files:
- Completed PLACEMENT_APPROVAL_RESPONSE.csv.
- placement-authorization.json with actual D6/D7, approvers and reviewed hashes.
- Private original-rows.json from the candidate's actual importer capture.
- Converter output directory: jss3SequencePlan.json + conversion-receipt.json.
- Exact intended school_code.

Current repo inputs are read from this checkout, not a historical bundle checkout.
No extra archive, approval questionnaire or SS1 attachment is required. Changed
inputs require genuine review, not silently updating approval hashes.

## Command for the later verification/preparation stage

Python3.10+ standard library only, from repository root:

~~~bash
python3 scripts/jss3/check_sequence_readiness.py \
  --response /private/PLACEMENT_APPROVAL_RESPONSE.csv \
  --authorization /private/placement-authorization.json \
  --originals /private/capture/original-rows.json \
  --bundle /private/converted-plan \
  --school-code secondary \
  --output /private/NEW-readiness-report.json
~~~

secondary is an example, not an approval. Use the actual authorised code.
--output is optional. Without it, JSON goes to stdout only. With it, use a NEW
file in an existing writable directory; existing files/symlinks are refused,
including input files. No application data is written. Report includes hashes
of checker/converter and reviewed inputs/bundle, plus findings and requirements.

| Exit/status | Meaning |
|---|---|
| 0 / CONSISTENT_FOR_OPERATOR_REVIEW | Matching bundle with approved placements for the school; operator review only. |
| 2 / BLOCKED | Missing/unreadable input, invalid approval/hash, stale/altered bundle or wrong school. |
| 2 / NO_APPROVED_PLACEMENTS | Valid bundle has no approved placements to activate. |
| 2 / argument or report-write error | Fix arguments/output path; no successful report is implied. |

Every report retains ready_for_activation=false and database_actions=false.
Only a consistent nonempty approved plan gets ready_for_operator_review=true.
There is no apply, overwrite, bypass, environment mutation or DB/network code.

## Remaining activation requirements

All are NOT_CHECKED_OFFLINE, not falsely marked missing or passed. Reuse actual
existing evidence; do not restart completed audits.

1. Actual owner/delegate authority behind the references.
2. Owner-deferred converter, TypeScript-plan-schema and sequence/API/PG verification.
3. Designated target identity/school and live PIN matching D6/D7.
4. Additive rank/audit schema and stored row identities/content, checked through
   the existing apply tool's dry run on the separately authorised target.
5. Plan-version/audit history and any already applied or edited ranks.
6. Appropriate staging apply/rollback rehearsal and recoverable backup.
7. Authority for this exact plan hash, school and target. Production release has
   additional gates; converter sign-off alone does not authorise a write.

No local Boolean-attestation input can make those checks pass. This is a static
readiness handoff, not a replacement DB applier or JSS3 certificate. Rerun on the
actual candidate if relevant files change.

## Deferred verification

Tests use the existing converter suite's synthetic fixture and cover consistent
but unauthorised output, tampered plan with recomputed hash, receipt edits,
stale inputs, school mismatch, duplicate JSON keys, reformatting, changed
authority, all-pending state, exclusive report writing and missing inputs.

At the later owner-authorised test phase:

~~~bash
python3 -m unittest discover -s tests -p test_jss3_placement_converter.py
python3 -m unittest discover -s tests -p test_jss3_sequence_readiness.py
~~~

Then follow CONVERTER.md for the TypeScript consumer and existing real-PG suites.
No CI runner was changed; explicitly invoke these Python suites later. No test
pass, operational readiness or deployment is claimed by this implementation.
