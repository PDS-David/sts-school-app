# BASELINE3 — protected-curriculum evidence (no certification claimed)

**Status: PARTIAL / historical gate UNRESOLVED.** Primary was not reconstructed (inputs not available). `certification_claimed` is false. OB-06 stays open.

## Recorded first: R6 is not a baseline source
- `AGENT_1F-R6_CONTENT_DECISIONS.zip` SHA256 `b087654c07e7516f023451de6f4ffc7cbdaedc6ff2e3156f675a335477610960`; `REPORT.md` SHA256 `233c93901a67aa4b5d121666dcb15166cb45f4a604248f2231f992f0dc0621b2`. Both re-verified here; the zip's own `SHA256SUMS` passes (3 files).
- Section 5 item 4: "Exact preservation of the 2,179 protected rows. The only supplied mention is R5V's 'not done, by scope'; no attachment defines or lists them."
- So R6 neither certifies nor exports anything. BASELINE2's "missing record: R6" wording is corrected (original text kept, marked SUPERSEDED). OB-06 and task 04 updated. Do not request R6 again.

## Status by gate
| Gate | State |
|---|---|
| a. Historical vs current source-output equality | JSS1/JSS2: equal, 741 rows (PR28; re-run on master `f28c1198f3585c2c489ebe7a8906303cd730030c`, same row-file SHA256 `ab3b1285e4f649dedcf7c7c0f0a88a2fd860f2622dbc18c43c8b21b75d6cc567`). Primary: NOT PERFORMED |
| b. Preservation of an identified certified database/export | UNRESOLVED. No certified export or backup exists in Git or in supplied files |
| c. Historical certification scope | UNKNOWN. No approval record, importer commit, filters or list of the 2,179 identities has been found |

## Inputs
- Uploads searched (chat uploads and whole filesystem): `curriculum_basic_1-3.zip`, `curriculum_basic_4-6.zip` and individual BASIC ONE–SIX archives are **not available**. Only the two JSS zips (verified in BASELINE2) and the R6 zip are present. Either Primary form suffices; neither was supplied.
- Nothing was substituted for Primary. The earlier 1,492 Primary / 2,233 total figures remain historical, unreproduced here. 54 rows were not removed and the 2,179 gate was not changed.

## Work done
1. Master moved after PR28 (now `f28c119`; only `jss3Supplements.json` differs under `backend/src/db`). Re-ran `capture_importer_rows.py` on master with Node 24.19.0 against the BASELINE2 audit-clearing JSS set: audit PASSED, 741 rows, row-file SHA256 equal to the historical `5424620` capture. Comparer diagnostic (`--expected-count 741`): PASS. This is equality of generated sets, not the protected gate.
2. Added `scripts/jss3/baseline2/combine_exports.py` (+5 tests): merges per-school exports only if field sets are identical, one `school_code` per input, no repeated school and no duplicate identity; rows are unchanged. Ready for Primary + secondary once Primary exists. Not run on real data.
3. Evidence: `evidence/` (R6 record, input availability, re-run summary, comparer report, SHA256SUMS). No lesson text, no row dumps.

## Tests
- `python3 -m unittest scripts/jss3/baseline2/test_baseline2.py scripts/jss3/baseline2/test_combine_exports.py`: 12 OK.
- `cd docs/jss3/completion/BASELINE3/evidence && sha256sum -c SHA256SUMS`: OK.

## Exact missing evidence
1. Primary sources: grouped `curriculum_basic_1-3.zip` + `curriculum_basic_4-6.zip`, or the six individual BASIC ONE–SIX archives (SHA256s in `docs/jss3/replacements/INPUT_INVENTORY.json`). Needed only for gate a (Primary half).
2. For gates b and c: a genuine certified full-content export or dated database backup of the 2,179 rows (curriculum rows only), plus who/when/against which importer commit and source set. If none exists, the 2,179 count cannot be established and should be treated as an unverified figure.

## Reproduce once Primary is supplied
```
python3 -I scripts/jss3/baseline2/capture_importer_rows.py --checkout <worktree@5424620> --sources <private-primary-root> --school-code primary --output <private>/primary_hist --label primary_hist
python3 -I scripts/jss3/baseline2/capture_importer_rows.py --checkout <worktree@master> --sources <private-primary-root> --school-code primary --output <private>/primary_cur --label primary_cur
python3 -I scripts/jss3/baseline2/combine_exports.py --input <private>/primary_hist/rows.json <private>/secondary_hist/rows.json --output <private>/all_hist.json
```
(then the same for `cur`, then `compare_baseline.py --key school_code,class_name,subject_name,term_label,order_index`; Primary audit status must be recorded as in BASELINE2).
