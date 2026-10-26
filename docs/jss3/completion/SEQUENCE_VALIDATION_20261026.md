# Unapproved sequence-placement metadata —26October2026

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**.

Base master: `198b86eae4b6b9384d0cd2932f8bac02b1e383fb`.
Scope: one validation defect in `backend/src/db/jss3SequencePlan.ts`.

Previously, PENDING and KEEP_AT_END rejected an original index or approver,
but accepted an anchor_title or approved_on date left over from an approval.
Those fields were not used to activate a placement (only APPROVED is applied),
so this is misleading approval metadata, not evidence of an access bypass.

The validator now rejects all four anchor/approval fields for both unapproved
statuses. `basis` remains allowed as a reason for holding/appending a lesson.
Approved-placement validation and the shipped empty plan are unchanged.
No placement approval, school activation, PIN configuration, database write,
source-content change or production action was performed.

Regression cases were added to the existing `tests/jss3-sequence.test.mts`:
both statuses reject each of the four fields individually; entries carrying
only their non-approval basis remain accepted and yield zero approved rows.
The existing approved-placement and empty-plan cases remain in that suite.

No tests, typecheck, importer dry run, DB suite or device checks were executed,
as the owner requested that testing wait until source-code implementation is
finished. Code/diff were reviewed; that is not a passing test claim.

For the later verification worker, on Node24.19.0 with locked dependencies:

```bash
node --import tsx --test tests/jss3-sequence.test.mts
npx tsc --noEmit -p backend/tsconfig.json
```

The existing real-PostgreSQL sequence suite remains part of the later full
acceptance runner. No new suite registration is necessary because the cases
extend the already registered file. Do not merge/deploy this functional change
as verified until that deferred validation is actually completed.

This closes the implementation of this specific metadata-validation defect.
It does not close Ọya acquisition, rights decisions, actual sequence activation,
protected-baseline comparison, database/device acceptance or release.
