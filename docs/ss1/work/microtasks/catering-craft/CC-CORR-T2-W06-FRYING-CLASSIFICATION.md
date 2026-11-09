# CC-CORR-T2-W06-FRYING-CLASSIFICATION — correction prepared, exact binding still blocked

## Known source and issue
- Registered source ID: SS1-SRC-f433169ca25c.
- Original source member SHA-256: fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59.
- Source locator: CC-IDX-T2-W06.md, getBody lines 845–927; source observation at line 900.
- Exact issue: original Week Six text places frying under the moist-heat heading.
- Correct replacement: SUP-SS1-CC-T2-W06-COOKING-PRINCIPLES, which teaches frying as a hot-fat method.

## Owner authorisation and execution result
The owner authorised the narrowly scoped source-importer run on 2026-11-09. The original archive exists in the repository at `docs/ss1/sources/SSS1-original.zip` (35,828,550 bytes; SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e). The connected GitHub file action reports no bytes for this binary ZIP; the execution container cannot resolve github.com, and the archive is not present in the connected Library. The importer therefore has not been run in this session. No parsed body, body hash or original lesson ID is fabricated.

## Status
- Factual finding and replacement lesson: implemented.
- Owner approval for the replacement lesson: recorded.
- Exact delivery-correction binding: BLOCKED pending source bytes and the parser's exact output.
- Tests, full typechecks, database/device verification and deployment: not run; remain deferred.

## Required next step
Make the exact archive bytes (or exact source .doc member) available to the execution environment. Run only the existing source extraction/parser for SS1-SRC-f433169ca25c; capture the Week Six parsed body including its WEEK heading and parser trimming; compute `originalLessonId(source_id, body)`; then add the delivery correction with the exact `source_lesson_id` and `body_sha256` pointing to SUP-SS1-CC-T2-W06-COOKING-PRINCIPLES. Do not substitute the week-range hash.
