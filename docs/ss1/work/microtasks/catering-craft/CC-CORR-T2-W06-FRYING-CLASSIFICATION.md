# CC-CORR-T2-W06-FRYING-CLASSIFICATION — resolved and identity-bound

## Original source and factual issue
- Registered source ID: SS1-SRC-f433169ca25c.
- Original archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e.
- Original source member: `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Member SHA-256: fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59.
- Week Six locator: CC-IDX-T2-W06.md, getBody lines 845–927; frying is incorrectly listed under “Moist-heat method” at line 900.
- Correct replacement: SUP-SS1-CATERING-CRAFT-T2-W06-COOKING-PRINCIPLES; frying is correctly taught as a hot-fat method.

## Exact parser identity — verified
The owner authorised a narrowly scoped source-parser run on 2026-11-09. GitHub Actions workflow run **42547557010** completed successfully. It:
1. Verified the exact archive SHA-256 and registered member SHA-256.
2. Extracted only the registered Second Term Catering Craft source member to runner scratch.
3. Ran WordExtractor 1.0.4 `getBody()` and the repository's exact `ingestTopics.ts::parseTopics` function.
4. Captured the Week Six parser output identity without uploading or committing the source body.

Verified parser result:
- Week label: `WEEK SIX`
- Title: `COOKING OF FOODS`
- Parsed body length: 4,453 characters
- Body SHA-256: `fb7e873509e94a65eaba0d93790c2171ee68729f1bc5ee049e8dc8bed204e1de`
- Exact original lesson ID: `SS1-SRC-f433169ca25c:BODY:fb7e873509e94a65eaba0d93790c2171ee68729f1bc5ee049e8dc8bed204e1de`
- Parsed week count for the document: 12
- Temporary artifact: 13643689148, one-day retention; contains identity metadata only, no source body.

The parser-generated body hash matches the previously indexed Week Six range hash; this is now independently confirmed rather than assumed.

## Delivery correction
Package record `CC-CORR-T2-W06-FRYING` now binds the exact original source lesson ID and body hash to `SUP-SS1-CATERING-CRAFT-T2-W06-COOKING-PRINCIPLES`. The original source file and source hash remain unchanged. The inaccurate classification is corrected in the delivery replacement.

## Status
- Source identity: VERIFIED by the scoped parser run.
- Factual correction: IMPLEMENTED.
- Delivery correction binding: IMPLEMENTED.
- Original source preservation: CONFIRMED.
- Full tests, typechecks, database/device checks, deployment and classroom practical verification: remain deferred; none are claimed.
