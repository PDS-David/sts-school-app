# SS1-08 Catering Craft delivery checkpoint

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER** (scoped subject adapter; not full SS1-08 completion)

- Repository: `PDS-David/sts-school-app`
- Base: `b00788a3426e3ecd32174e8edecd176899501de1`
- Branch: `ss1/SS1-08-20261110-catering-delivery`
- Integration snapshot before final handoff metadata: `dd23304b3e003c601d95dedd671fbff9e8b95d8c`
- Subject: SS 1 / Catering Craft / secondary school scope
- Package source: `backend/src/db/ss1/subjects/catering-craft.json` (existing master package; unchanged in this branch)

## Existing subject package evidence

- 38 authored lesson/assessment records, all recorded as owner-content-approved; verification remains DEFERRED.
- 36 coverage records across the First, Second and Third Terms.
- First Term is explicitly linked to a separately hash-bound public Lagos State scheme record, not falsely represented as an archive member.
- Second and Third Term archive source headings have explicit source alias records.
- One exact delivery correction binds the Second Term "COOKING OF FOODS" original parser body to `SUP-SS1-CATERING-CRAFT-T2-W06-COOKING-PRINCIPLES`.
- No deployable Catering Craft asset is registered. The Third Term scanned tablecloth image is intentionally excluded because reproduction rights are not established; the text procedure remains available.

## Implemented in this branch

1. Added `backend/src/utils/ss1CateringDeliveryCorrection.ts`.
   - Loads and validates the strict Catering Craft subject package.
   - Resolves only secondary / SS 1 / Catering Craft / Second Term / exact source filename / exact original parsed-body SHA.
   - Delivers the authored correction only on exact fingerprint match.
   - Fails closed by withholding the matching source topic when its stored body differs.
   - Creates correction fingerprints for generated assessments.
   - Retires stale linked assessment/cache in a single scoped SQL statement, locking only the exact SS1 Catering Craft topic row; learner submissions and topic completions are not deleted.
   - Hides stale linked assessments and rejects stale assessment question/submit access.\n   - Writes a persistent withdrawal tombstone on the assessment fingerprint so it remains hidden after the topic link is cleared.

2. Updated `backend/src/routes/learning.ts`.
   - Applies safe SS1 topic projection in topic list and topic update responses.
   - Applies correction/withholding before completion summary, practice and assessment generation.
   - Stores the SS1 correction fingerprint on generated assessments.
   - Filters withdrawn SS1 Catering Craft assessments from learner lists, including closed stale assessments.
   - Guards assessment question access and submission.
   - Preserves old learner submission records while blocking learner/parent answer-detail access for a withdrawn linked assessment.
   - Existing JSS3 correction logic remains in place and is called independently.

3. Added `tests/ss1/catering-craft.delivery.test.mts` with deferred tests for subject/class/term/source-file isolation, exact body hash, safe projection, SQL scope, assessment retirement and assessment list filtering.

## Not done / blocked from claiming full SS1-08

- Tests, TypeScript checks, importer plans/dry-runs, database rehearsals and device checks were not run, per the owner's explicit deferral.
- No importer or production database write was performed.
- This branch does not complete the global SS1-08 assignment for all 21 subjects and all 61 archive sources.
- No final all-subject asset-plan builder, schedule/implemented-lessons generator, full-source acceptance runner or global `IMPLEMENTATION_HANDOFF.md` has been delivered here.
- No actual learner account/device observation or teacher practical observation is claimed.
- The original source archive is not copied into the branch.

## Deferred verification for this scoped adapter

Run only when the owner starts SS1-09 and the complete integration candidate is ready:

```bash
node --import tsx --test tests/ss1/catering-craft.package.test.mts
node --import tsx --test tests/ss1/catering-craft.delivery.test.mts
```

Then run the final integrated SS1 acceptance suite against a disposable PostgreSQL database, with source hash and other-class preservation captures. The current branch is not a release candidate and must not be merged into auto-deploying master before the authorised verification/release phase.

## Resume point

Next integration owner must:
1. Review this adapter against the final SS1-08 shared route/importer implementation.
2. Confirm final compiled topic identity and exact source hash using the real source archive and actual importer parser during the authorised verification stage.
3. Wire any additional topic/assessment routes identified by full route tracing.
4. Include Catering Craft in the final all-subject SS1 acceptance runner and source-to-row asset plan.
5. Keep source verification, classroom practical verification and release authorisation separate.
