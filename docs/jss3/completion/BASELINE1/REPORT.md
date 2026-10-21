# BASELINE1 — protected 2,179-row comparison

**Read this first.** Status: **BLOCKED_EXTERNAL_INPUT**. No comparison of the protected rows was performed and nothing about them is verified. `certification_claimed` is not set anywhere. OB-06 in `docs/jss3/OPEN_BLOCKERS.csv` stays open.

## Status

| Item | Status |
|---|---|
| IMPLEMENTED | Nothing new. The comparer (`docs/jss3/completion/P1_BASELINE/compare_baseline.py`) already exists in master and was not changed. No unimplemented code was found for this task |
| VERIFIED | Comparer's 13 synthetic tests pass (`python3 -m unittest discover -s docs/jss3/completion/P1_BASELINE -p 'test_*.py'`, Python 3.12.3). Synthetic fixtures only; this is not evidence about the real rows |
| BLOCKED_EXTERNAL_INPUT | The owner's certified full-content export of the 2,179 Primary/JSS1/JSS2 rows, and the release snapshot of the same scope |
| NOT PERFORMED | The acceptance comparison; validation of field schema and full-content scope; verification of baseline provenance; the corpus acceptance run (`run_acceptance.py`), which this task does not need and which the missing inputs would not change; production deployment, import or migration |

## Why blocked
The attached `JSS3_NEXT_STAGE_INPUTS_20261016.zip` was listed (not extracted in full). It holds the 39 JSS3 source documents, the Music RTF, `SOURCE_INVENTORY.csv`, the scheme-only manifest, and historical captures. Its `portable_verification/capture/ROW_PRESERVATION.json` records 313 original and 41 supplement rows (354 total), and its own README states that no protected 2,179-row database baseline is supplied. The raw-source captures are not a certified export and are not a substitute. No file for the release snapshot is present either.

## Exact remaining inputs
1. The certified full-content export of the 2,179 Primary/JSS1/JSS2 rows (JSON or CSV), curriculum rows only, no student records.
2. The proposed release snapshot of the same protected scope, in an equivalent format with the same field schema.
3. The stable identity column(s) (comma-separated for `--key`), the full lesson-content column(s), and who certified the baseline and when.

Then, from repository root:
```
python3 -m unittest discover -s docs/jss3/completion/P1_BASELINE -p 'test_*.py'
python3 docs/jss3/completion/P1_BASELINE/compare_baseline.py --baseline <certified-export> --snapshot <release-snapshot> --key <identity columns> --output "$PWD/baseline-evidence/result.json"
```
Do not pass `--content` or `--expected-count` for the acceptance run. Publish only the sanitised `result.json` (identities, field names and input hashes), never the exports.

## Environment
Host Node v22.22.2 (the contract's 24.19.0 was not needed; only Python tooling ran), Python 3.12.3. Base master `cdfc3fe282232e6464cff4ff02f11b3129ce1c2f`. Final SHA: recorded in the PR.

## Changed files
- `docs/jss3/completion/BASELINE1/REPORT.md` (this report only)
