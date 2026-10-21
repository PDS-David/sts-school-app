# A1 — Science database acceptance — 20 October 2026

Developed on master `02e596e8e53e1beea7a4b4b0aa52ba9308638a4d`; master advanced to `deef5275c6861f6d5d73ad28f4d342c34d6bf019` (M1, M2, D1, S1, A2 work; no file overlap) before publication, so the commit was rebased onto it and the fresh capture and every suite below were re-run on that merged head with identical results (logs are from the merged-head run). Scope: A1 only (V3 Science database acceptance). No production access, import, migration or deployment. A push is not deployment.

## Environment (actual)

Node 24.19.0 (npm-distributed binary), locked dependencies (`npm ci --ignore-scripts`), disposable LOCAL PostgreSQL 16.15 on 127.0.0.1:55432 (one database per suite), `backend/schema.sql` applied by each suite. Inputs: `JSS3_NEXT_STAGE_INPUTS_20261016.zip`; `SHA256SUMS` 61/61 OK; all 39 inventoried sources hash-verified by the handoff verifier.

## Fresh capture

`python3 scripts/jss3/verify_handoff.py --inputs <inputs> --output <evidence>`: backend types, mobile types, static, full `jss3*.test.mts`, asset-focused and capture all exit 0 (`logs/handoff-RESULTS.json`). Capture: 313 originals + 170 supplements = 483; all 313 original row objects exactly equal (`logs/ROW_PRESERVATION.json`). This says nothing about the unavailable certified 2,179-row export.

## New suite: `tests/jss3-v3-science-assets.db.test.mts`

Run: `JSS3_V3_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/v3_test JSS3_CAPTURE_DIR=<capture> node --import tsx --test tests/jss3-v3-science-assets.db.test.mts` — **14 pass, 0 fail, 0 skipped**. Expected identities are derived independently from `science_assets.json` + the capture (not from the manifests), then compared per record:

- 12 definitions → 17 records / 13 displayed / 8 unique displayed images; only `BS-GEN-SOURCE-1..3` and `BS-PRISM-SOURCE` are held. `V3_BINDINGS.json` and both manifests match key-by-key on identity, term, title, order_index, body hash, file, sha256, caption, alt text and displayed.
- Wrong-identity rejection before any write (table stays at 0 rows): shift onto a real different Science lesson, shift to a missing order, one wrong title inside an otherwise valid batch, 2nd-term manifest aimed at 1st Term, wrong subject, wrong class, wrong school; dry run writes nothing.
- Both manifests attach with title guards ON: each record on its intended lesson, body hash of the target equals the captured body, bytes identical to files, MIME, alt text, caption, displayed; lesson rows untouched.
- Idempotence: 0 inserts, identical row ids/metadata/bytes.
- Metadata consent: drift refused; `--update-metadata` without `--apply` writes nothing; with consent only the named field of the named record changes and bytes stay; new bytes under an existing key and MIME changes are refused even with consent.
- Authenticated retrieval through the real router: every displayed record listed on its own lesson in manifest order with exact metadata and identical served bytes, correct Content-Type, private cache, nosniff; 401 without token; held figures never listed and 404 by id; JSS 1 student and another-school student get empty lists and 404 (also with a matching `If-None-Match`, so no ETag oracle) for all 17 records; owner gets 304.
- Held-source hiding is consent-gated: releasing a withdrawn figure needs `--update-metadata`, becomes visible only then, and is restored.
- Delivery, both Science replacements (`V3-BS-FAMILY-TRAITS-V3`, `V3-BS-LIGHT-V3`), real routes under school `secondary`: list and completion are taught from the replacement lesson only; original-text markers never appear in the response or in any AI prompt; stale summary retired; assessment fingerprint equals the resolver's; stored original row immutable. Changed source (original + edit) is WITHHELD: null source, withheld marker, zero AI calls, no assessment, no completion row, changed row not rewritten. Control: other class/school is not captured.

These delivery tests need the real school code, so the suite refuses to run if `secondary` already has a Basic Science subject (use a fresh disposable database). Residue is asserted zero.

### Negative controls (the suite fails when the product or data is wrong)

Recorded in `logs/mutation-controls.log`; each mutation reverted afterwards: bytes route ignoring `displayed` (2 fail), a held figure flipped to displayed in a manifest (4 fail), one record's order_index shifted (7 fail), delivery resolver disabled (5 fail), class scoping removed from topic visibility (3 fail). Baseline 14/14.

## Existing suites (declared variables, same capture)

| Suite | Variable(s) | Result |
|---|---|---|
| `jss3-v1-business.db` | `JSS3_ASSET_TEST_DATABASE_URL`, `JSS3_CAPTURE_DIR` | 4/4 |
| `jss3-batch2-assets.db` | same | 3/3 |
| `jss3-v2-math-assets.db` | `JSS3_V2_TEST_DATABASE_URL`, `JSS3_CAPTURE_DIR` | 5/5 |
| `jss3-delivery-correction.db` | `JSS3_DELIVERY_TEST_DATABASE_URL`, `JSS3_CAPTURE_DIR` | 8/8 |
| `topic-assets.db` | `TOPIC_ASSETS_TEST_DATABASE_URL`, `T2_REAL_ASSETS=curriculum-assets/jss3` | 18/18; real assets: 27 displayed byte-identical (3 GIFs), hidden icon not served |
| `jss3-v3-science` (non-DB) with capture | `JSS3_CAPTURE_DIR` | 6/6 — the two real-source tests skipped in the earlier integration now run |

Skips: none in any suite above. The earlier integration's 11 skips in the no-database run are the DB/capture-gated tests covered here.

## Limits

Local PostgreSQL 16.15, not the production server/version. Not phone acceptance (A2), not Word rendering, not teacher or practical certification. No schema was applied to any shared database. Image rights not established. The 2,179-row protected baseline remains unverified (P1). Production release gates in `NEXT_SMALL_TASKS.md` are unchanged.
