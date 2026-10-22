# MATH4 — effective teaching completion, 22 October 2026

Base: `56bd7c83ed91f63a565c59b6d4241b485623e968`. No original curriculum body, importer, runtime route, UI or database was changed.

## Implemented
- Existing algebra and statistics delivery already answers the deterministic defects recorded in OB-21, including the second pie-chart exercise. The source paragraphs and delivery bindings were checked; see DISPOSITIONS.csv. These are not newly missing lessons.
- `SUP-MATH-CHANGE-SUBJECT`: newly labelled equivalent practice distinguishes two parenthesised root scopes, derives both rearrangements, gives independently checked answers, solves the fully specified water-tank exercise, and explains square/cubic-unit notation. It does not guess the original unparenthesised formula.
- `SUP-MATH-SIMULT-WORDS`: fully specified equilateral-triangle equivalent, worked answer and marked practice. Removed the inaccurate blanket statement that the original diagram is absent; incomplete/ambiguous labels remain a source-intent issue.
- Existing delivery bindings serve both changed bodies; the production resolver fingerprints the full lesson objects, so changed content invalidates old generated assessments through the existing correction mechanism. Regression tests exercise that resolver.
- IMPLEMENTED_LESSONS.csv regenerated from a fresh importer capture. Teacher schedule regenerated and unchanged. CI includes the six new tests. Updated OB-14/21 and task routing to distinguish existing implementation from source-intent questions.

## Verification observed
Node24.19.0, locked installed Node dependencies; Python virtualenv with repository requirements. Six focused tests pass, including a deliberately incorrect swapped-answer negative control. Backend/mobile types, static and asset checks pass. Full real-source suite: 333 tests, 326 pass, zero failures, seven explicit database skips. Corpus acceptance exits2 INCOMPLETE because local PostgreSQL is absent; this is not full database acceptance. CI PostgreSQL checks must pass before merge.

Fresh unmodified-main captures at base and after: all313 original row objects exactly equal; only SUP-MATH-CHANGE-SUBJECT and SUP-MATH-SIMULT-WORDS changed. 170 supplements, 483 total, First234/Second249/Third0, Computer Studies0. No count pin changed. Full captures remain outside Git. RESULTS.json is sanitised.

Commands:
```
node --import tsx --test tests/jss3-math4-equivalents.test.mts
python3 scripts/jss3/capture_rows.py --root <39-source ALL root> --output <private capture>
python3 scripts/jss3/build_implemented_lessons.py backend/src/db/data/jss3Supplements.json <capture>/supplemented-rows.json docs/jss3/replacements/IMPLEMENTED_LESSONS.csv
python3 scripts/jss3/build_teacher_schedule.py
PATH=<requirements-venv>/bin:$PATH python3 scripts/jss3/run_acceptance.py --archive <verified ZIP> --output <fresh private output> --without-db --tsx-no-ipc
```
The first archive path failed ZIP validation; the second copy matched the known archive SHA256. A first dependency check failed because the virtualenv was not on PATH; the final fresh run used PATH correctly and passed. Neither failed attempt is counted as evidence of success.

## Residual source questions, not claims of recovered teaching
The original root scope, split triangle labels, and cancellation-stroke targets83/111 are not inferred. Noninteger solutions alone do not prove a source error. Missing textbook-only exercise wording cannot be recovered from page references; equivalent practice now exists. Existing bearing example2 uses its210-degree label, not the apparent angle of the not-to-scale drawing. No new drawing interpretation was imposed.

## Release boundaries
This completes the supported MATH4 equivalent-teaching implementation, not all JSS3 release certification. Historical certified2179-row provenance, school-specific text/rights decisions, practical observation, exact progression-policy approval, designated staging/device checks and production authorisation remain separate. No production import, migration, deployment or student-data cleanup occurred.
