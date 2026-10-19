Focused tests for worker D (Node 22.22.0 used here; rerun on Node 24.19.0):
1. Copy master 9ee0597 to a disposable tree, apply `../code.patch`, then compose SUPPLEMENT_UPSERTS.json into backend/src/db/data/jss3Supplements.json (adds appended, one replace guarded by its SHA-256).
2. `JSS3_REPO=<that tree> node --import tsx --test docs/jss3/batch2-close/D_FRENCH_SOCIAL_CIVIC_AGRIC/tests/jss3-d-delivery.test.mts` (8 tests; run it without JSS3_REPO on unpatched master as a negative control: tests 1 and 2 fail as intended).
3. `python3 scripts/jss3/capture_rows.py --root <ALL> --output <dir>` in the composed tree: expected 423 rows (313 original, 110 supplements), original row objects exactly equal, Third Term zero.
master_supplements_base.json is the 90-lesson master file used to verify the replace hash.
