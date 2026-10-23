# English and practical content closeout — 23 October 2026

Base: `05466b7716734674701b42426132571ed89f4995` (master after PR33).
This is implemented lesson correction and source-backed verification, not production deployment or curriculum certification.

## Changes delivered

- SUP-EN-CONSONANT-PRACTICE now asks for the sound of **s in measure**, rather than wrongly marking /ʒ/ as the word's initial sound. The initial sound is /m/.
- SUP-EN-EXAM-PRACTICE replaces an unsupported inferred motive with a question and answer explicitly supported by the passage (the flat tyre). Original exam-style practice remains labelled as such. Removed obsolete wording suggesting Third-Term scheduling is a later implementation batch.
- SUP-MUSIC-PRACTICAL distinguishes an open melodic ending/return to doh from a harmonic cadence. A melody's final note alone does not establish V or V–I.
- SUP-CCA-EMBROIDERY-PRACTICAL pairs a blunt tapestry needle with teacher-selected open-weave cloth; chenille needles are explicitly sharp and excluded from that blunt-needle activity. The teacher checks material compatibility.

Sources checked: Open Music Theory, https://hybrid-pedagogy.github.io/openmusictheory/cadenceTypes.html ; Embroiderers' Guild of America, https://egausa.org/guide-to-embroidery-needles/ . These corrections are labelled supplements; original source rows are untouched.

COVERAGE.csv records existing English equivalent teaching and practical tasks/rubrics that were read during this pass. Generic owner permission for equivalents already exists; do not reopen that permission request. Exact prescribed-book identity, author intent, historical past-paper identity, and observed practical competence remain distinct claims.

## Learner binding and limitations

These are real `jss3Supplements.json` entries emitted by `buildJss3SupplementRows`, not detached report proposals. The regression test exercises that importer path. They are standalone supplement topics, not delivery-override mappings. Publishing this code does not refresh a previously imported production topic or cached assessment. A separately authorised release/import must reconcile changed body hashes and generated assessments before learner use. No production state was inspected or altered.

Fresh captures before and after verify 313 original row objects exactly equal. Exactly four supplement rows change; total 483 remains 234 First / 249 Second / 0 Third, Computer Studies 0. `ROW_PRESERVATION.json` contains the redacted summary. Full copyrighted source captures remain private.

IMPLEMENTED_LESSONS.csv was regenerated from the final capture; teacher schedule was regenerated and is unchanged. No original importer logic, schema, UI, sequencing rule or other-class content changed.

## Reproduction

Use Node 24.19.0, lockfile dependencies, and Python dependencies in `scripts/jss3/acceptance-requirements.txt`. Private input archive: `JSS3_NEXT_STAGE_INPUTS_20261016.zip`, SHA256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`. The archive is not a repository file and is not a certified protected-row baseline.

```sh
node --import tsx --test tests/jss3-closeout-content.test.mts
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$FRESH_EVIDENCE_DIRECTORY" --without-db --tsx-no-ipc
```

The no-IPC flag is the local launcher workaround, not a test exemption. A `--without-db` result is INCOMPLETE for database acceptance even when corpus checks pass. CI separately exercises the repository's PostgreSQL checks. Test outcomes are recorded in VALIDATION.json. No production connection, import, migration or deployment was used.
