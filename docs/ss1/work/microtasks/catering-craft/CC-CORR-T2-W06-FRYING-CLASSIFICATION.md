# CC-CORR-T2-W06-FRYING-CLASSIFICATION — correction prepared, binding blocked

## Known source and issue
- Registered source ID: SS1-SRC-f433169ca25c.
- Original source member SHA-256: fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59.
- Source locator: CC-IDX-T2-W06.md, getBody lines 845–927; the source observation is at line 900.
- Source issue: the original Week Six text places frying under “Moist-heat method”.
- Correct replacement lesson: SUP-SS1-CC-T2-W06-COOKING-PRINCIPLES.
- Correct teaching: frying uses hot fat/oil; it is not moist-heat cooking.

## Why no delivery correction record is currently present
The repository contract requires the exact importer-parsed body and the deterministic original lesson identity derived from it. The index note records the exact week-range hash, but the importer trims parsed blocks. The importer was not run, and the exact parsed body hash/lesson ID has not been confirmed. A week-range hash must not be substituted for the importer-generated parsed-body hash without proof.

## Resolution status
- Factual research and corrected replacement lesson: implemented.
- Original source file: preserved unchanged.
- `delivery_corrections[]` binding: BLOCKED pending owner-authorised importer/source parsing.
- Tests/importer/database/device verification: remain deferred; no run is claimed.

## Required next step
After owner authorises the deferred importer/source parse, capture the exact parsed Week Six body, compute the original lesson ID using the repository's `originalLessonId(source_id, body)` function, and add the delivery correction pointing to SUP-SS1-CC-T2-W06-COOKING-PRINCIPLES. Do not invent or infer the identity.
