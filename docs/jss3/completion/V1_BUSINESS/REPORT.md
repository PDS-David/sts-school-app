# V1 — Business Studies visual recovery and account layouts

Base: `28c0b9262fd6aad8104af29d7dd67e22fadf85db` (master at start and at push time). Branch: `jss3/v1-business-visual-recovery-20261019`.
Inputs: `JSS3_NEXT_STAGE_INPUTS_20261016.zip`; all 39 source hashes verified (`SHA256SUMS`). Private originals are not committed.

## What changed
- **19 assets delivered through the existing path** (`topic_assets`, `attachTopicAssets.ts`, authenticated `/learning/topics/:id/assets` route, unchanged):
  - 16 on the original lessons: Double Entry (5), Trial Balance (6), Trading/P&L (2), Memorandum (1), Business Letter (1), Simple Tabulation (1);
  - 3 on new supplement lessons (worked answers).
  - Manifests: `curriculum-assets/jss3/supplements/V1_BUSINESS_1ST_MANIFEST.csv`, `V1_BUSINESS_2ND_MANIFEST.csv`. Every row has caption, descriptive alt text, sha256 and a title guard.
  - `build_v1_manifests.py` resolves each destination from the captured rows by source file + term + title + body sha256 (originals) or lesson id (supplements). It never uses a hard-coded row number and fails on 0 or >1 matches. Resolved bindings: `V1_ASSET_BINDINGS.csv`.
- **4 new supplement lessons** (labelled "Newly prepared teaching", not recovered content): `SUP-BUS-LEDGER-ANSWERS`, `SUP-BUS-TRIALBAL-PRACTICE` (1st Term, orders 17, 18), `SUP-BUS-TRADING-PL-ANSWER`, `SUP-BUS-PAPER-SIZES` (2nd Term, orders 14, 15). Each has teaching, practice questions, answers and a marking guide.
- Figures are redrawn from the source tables and line objects (`assets/generate_v1_figures.py`, SVG sources included). Two embedded JPEGs from the Third-Term file are attached byte-identically (sha256 pinned).
- The shorthand chart is untouched (same key, bytes, caption, order). **On master it had no alt text anywhere**; one was added to its manifest row.
- No row was changed or removed. 313 original rows are byte-equal; before/after comparison by identity and body hash is in `ROW_COMPARISON.json` (475 to 479 rows, +4 supplements only).

## Classification (28 reviewed occurrences: see `VISUAL_REGISTER.csv`)
- **Recovered and implemented:** Dr/Cr layout, worked examples 1–4, blank trial-balance ruling, cash book, ledgers (both figures), Madam Cash trial balance, trading layout, P&L layout, memo sample, letter sample, 5×3 table.
- **Source error with implemented correction:** second-method trial balance (Building label lost; Dr is 9,000 as printed rows but shown as 11,000; restored Building 2,000 gives 11,000 = 11,000); "Janlo" typo; A4 printed as 219 mm (should be 210).
- **Already delivered correctly:** personal-budget table, menu exercise text, existing shorthand chart.
- **Decorative:** eraser and correction-fluid photographs (not attached).
- **Unresolved, with exact missing evidence:**
  - Worked Example 1 start date (Jan. 5 vs Jan. 2): the author's intended date.
  - Madam Cash year (2005 vs 2008): the intended year.
  - Papaluwe and babasuwe exercises have no teacher answer key in the source. Newly prepared answers are delivered and labelled; the key itself is missing.
  - Landscape/portrait numbers in the paper-size table: unit and meaning unstated.
- Correction method: original rows are kept; the correction is delivered as a flagged figure plus supplement text. The delivery-correction mechanism was deliberately not used, because it withholds the whole original topic and these texts are not unsafe.

## Verification (all numbers observed)
- `verify_handoff.py --tsx-no-ipc` (sandbox denies the tsx IPC socket; same workaround as the baseline): backend/mobile types pass; static pass; JSS3 suite 258 tests, 251 pass, 0 fail, 7 skipped (baseline: 242/237/0/5); asset-focused 15/15; capture 479 rows, originals exactly equal. `VERIFY_RESULTS.json`.
- Local PostgreSQL 16 (isolated, port 54331): batch2 asset resolution + topic-assets + V1 DB tests 24 pass, 0 fail, 1 skipped. Covers title-guard rejection of a shifted row, idempotent re-attach, metadata-drift abort, sha256 conflict refusal, stored bytes/alt text.
- `tests/jss3-v1-business.test.mts` (16 tests): independent arithmetic for every cash book, ledger, trial balance and trading/P&L answer; lesson text carries the figures' numbers; manifest bytes/MIME/metadata; tampered and missing files rejected; alt text matches the spec and survives regeneration; builder rejects a wrong body hash, a retitled lesson, or a missing lesson; generator reproduces committed SVGs.
- Shared-file edits (needed for existing tests to pass; all appends): `jss3Supplements.json` (+4), allow-list in `jss3Supplements.ts` (+4 gap IDs), four `docs/jss3/replacements/*.csv` registers (+16 rows, exact rows in `REGISTER_APPENDS.csv`), one hard-coded count in `tests/jss3-batch2-assets.db.test.mts` (43 to 62). The integration agent should re-apply `build_supplements.py apply` and `apply_register_rows.py` rather than merge whole files.

## Limitations (not verified)
- Rendered only with LibreOffice; no Word render. Debit/credit sides of the Sales ledger were confirmed by double-entry balancing, not by a faithful visual.
- Not run: HTTP retrieval through the live route with real users, device rendering, production attach. Node was v22.22.2, not 24.19.0.
- The memo/letter samples have unknown provenance/licence; the letter image is only 250×290 px and its small text is hard to read.
- The new teaching has had no teacher review.

## Reproduce
```
npm ci --ignore-scripts
python3 scripts/jss3/verify_handoff.py --inputs <INPUTS> --output <OUT> --tsx-no-ipc
python3 scripts/jss3/capture_rows.py --root <INPUTS>/ALL --output <CAP>   # with env from <OUT>/source-env.json
python3 docs/jss3/completion/V1_BUSINESS/assets/generate_v1_figures.py docs/jss3/completion/V1_BUSINESS/assets
python3 docs/jss3/completion/V1_BUSINESS/build_v1_manifests.py --capture <CAP>/supplemented-rows.json --all-root <INPUTS>/ALL
JSS3_V1_CAPTURE=<CAP>/supplemented-rows.json JSS3_ALL_ROOT=<INPUTS>/ALL node --import tsx --test tests/jss3-v1-business.test.mts
JSS3_ASSET_TEST_DATABASE_URL=postgres://...@127.0.0.1/db JSS3_CAPTURE_DIR=<CAP> node --import tsx --test tests/jss3-v1-business.db.test.mts
```
