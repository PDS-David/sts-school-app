# BASELINE2 — protected-baseline reconstruction (JSS1/JSS2 only) and provenance trace

> **Correction (BASELINE3, 2026-10-22):** R6 `REPORT.md` section 5 item 4 (AGENT_1F-R6_CONTENT_DECISIONS.zip, SHA256 `b087654c…0960`) says only that the 2,179 rows' exact preservation is unverified and that no attachment defines or lists them. R6 is NOT a certification or export source; do not request it as proof. The original observations below are kept unchanged; the two items marked SUPERSEDED are replaced by `../BASELINE3/REPORT.md`.

**Status: PARTIAL / protected gate NOT passed.** `certification_claimed` is false everywhere. OB-06 stays open. Nothing here verifies the 2,179 certified rows.

| Item | Status |
|---|---|
| Implemented | Capture script, sanitised-evidence builder, 7 tests (`scripts/jss3/baseline2/`). No importer/runtime change |
| Observed | JSS1/JSS2 historical vs current importer output, 741 rows each, byte-identical. Source-output equality only |
| NOT done | Primary (1,492 rows recorded earlier): the six BASIC ONE–SIX archives were not attached, so not regenerated. 2,179-row gate cannot run. No database restore existed, so no certified-database preservation check |
| Provenance | NOT established. See "Provenance" |
| Not authorised/not done | Production import/migration/deployment, device or school approval |

## Base and environment
- Base master `4cc7bf2e9900a7158be2b0a4214d01fac17f94ae`. Branch `jss3/baseline2-20261022-r4m8`. No AGENTS.md exists in the repo.
- Node 24.19.0, `npm ci --ignore-scripts` at workspace root, both checkouts. Python 3.13. Resolved versions identical on both sides: mammoth 1.12.2, word-extractor 1.0.4, jszip 3.10.1, tsx 4.23.1, typescript 5.9.3. Only difference in lockfiles between the two commits: one added line (`package-lock.json`).
- Historical checkout: `5424620` (2026-10-07, last change to `backend/src/db/*` before 29f135b; `git diff 5424620 29f135b -- backend/src/db` is empty). Its own importer and all helper modules; hashes are in `evidence/capture_summary.json`.
- Current checkout: master above.

## Inputs (private, kept outside Git)
Attached: `JSS 1-…(1)` SHA256 `2d89d37b…58a1`, `JSS 2-…(2)` SHA256 `c11ac3cc…6627`. Both match `docs/jss3/replacements/INPUT_INVENTORY.json`. The 6 nested term zips inside them were extracted beside their originals. Per-file hashes: `evidence/source_inventory.csv`.
Not attached: `curriculum_basic_1-3.zip`, `curriculum_basic_4-6.zip` (and the repo inventory's BASIC ONE–SIX archives). Not requested again for anything else.

## Results
Same schema both sides: `school_code, class_name, subject_name, term_label, order_index, title, week_label, source_file, source_path, source_reference` (nulls, whitespace, line endings untouched). Identity key `school_code,class_name,subject_name,term_label,order_index` is the importer's own persisted identity (`backend/schema.sql`, constraint `topics_ingestion_dedupe`; `subject_name` stands in for DB-assigned `subject_id`).

| Source set | Importer audit | Rows hist / current | Row files identical | Comparer, protected gate (2,179) | Comparer, diagnostic (`--expected-count 741`) |
|---|---|---|---|---|---|
| As supplied | BLOCKED (6 files) | 741 / 741 | yes | FAIL (count only) | PASS (diagnostic) |
| Audit-clearing (6 files removed) | PASSED | 741 / 741 | yes | FAIL (count only) | PASS (diagnostic) |

Rows by class/term (all runs): JSS1 120/112/137, JSS2 114/133/125. No missing, unexpected, duplicate or content-differing identities. Negative control (one row dropped, one trailing space added) is detected: FAIL (`comparer_negctl.json`).
A diagnostic PASS is equality of two generated sets, not the protected-curriculum gate.

### Why the audit blocks as supplied (exactly these 6 files, none produced rows)
1. `JSS2 1ST TERM_/ 2 MATHEMATICS.docx`: 162-byte non-zip stub.
2. `JSS2 1ST TERM -…/ENOTE SOCIAL STUDIES JSS2 1ST TERM.docx`: resolution rule `1st Term/ENOTE SOCIAL STUDIES JSS2 1ST TERM.docx` needs a `WEEK TWO` anchor. The attachment holds two different files with this name (sha `da37a04a…`, `083eb7fa…`); only the `JSS2 1ST TERM_` one carries the anchor and yields the 9 Social Studies rows. The approved importer was therefore run on a source set that did not contain the other copy.
3. 4 unsupported formats: two `.rtf` (JSS1 Music handout) and two `.pptx` (JSS2 e-note), each present twice.
Removing them (diagnostic only, not an approved scope) gives audit PASSED and the same 741 rows. Earlier importer commits give different counts (732, 766, 873, 943, 957, 1712) and do not pass the audit, so none is a better candidate than `5424620`.

## Discrepancy analysis
- Baseline vs snapshot, JSS1/JSS2: none.
- vs the 2,179 target: not measurable. Previously recorded Primary 1,492 + this 741 = 2,233, which is 54 above 2,179. Nothing in Git identifies which 54 (if any) are outside the certified set; no subset was forced. The Primary half could not be regenerated here.

## Provenance (traced separately)
- Searched all 291 commits on all refs for `2,179`/`2179`. First appearance: `baa4aa6` (2026-10-15), `docs/jss3/CONTENT_MATERIAL_REQUIREMENTS.md`: "Preservation of the 2,179 protected rows (R6 `REPORT.md` section 5; R6 is not part of this set)". `docs/jss3/STATUS.md` in the same commit: no certified row export found in the supplied inputs.
- No commit contains the 2,179 identities, an approval record, the approving importer commit, class/school filters, or an audit output that yields 2,179. The 2,233 count first appears 2026-10-15 (`6cdafc1`) as raw-source generated candidates.
- **SUPERSEDED — Missing historical record (as originally written):** R6 `REPORT.md` section 5 (and whatever export or audit output it summarises) — who certified, when, against which database/backup and which importer commit/source set. Unavailable to this task; not reconstructed or inferred.
- `compare_protected.py` (old `ingestTopics.ts` inside a current checkout) was not used; this task runs each commit's own tree.

## Reproduce (outputs go outside Git)
```
python3 -I scripts/jss3/baseline2/capture_importer_rows.py --checkout <worktree-at-5424620> --sources <private-root> --school-code secondary --output <private-out>/hist --label hist
python3 -I scripts/jss3/baseline2/capture_importer_rows.py --checkout <worktree-at-master> --sources <private-root> --school-code secondary --output <private-out>/cur --label cur
python3 docs/jss3/completion/P1_BASELINE/compare_baseline.py --baseline <private-out>/hist/rows.json --snapshot <private-out>/cur/rows.json --key school_code,class_name,subject_name,term_label,order_index --output <private-out>/gate.json
python3 -I scripts/jss3/baseline2/build_sanitized_evidence.py --private-out <private-out-parent> --sources <private-root> --evidence <dir> --configs <names> --compare-dir <dir>
```
`<private-root>` holds the two extracted JSS archives. Private exports (rows.json, importer.log) contain lesson text and are not in this PR.

## Tests
- `python3 -m unittest discover -s docs/jss3/completion/P1_BASELINE -p 'test_*.py'`: 13 OK.
- `python3 -m unittest scripts/jss3/baseline2/test_baseline2.py`: 7 OK.
- Evidence checksums: `cd docs/jss3/completion/BASELINE2/evidence && sha256sum -c SHA256SUMS`.

## Remaining to close the gate
1. *(Done by BASELINE3: Primary regenerated from the two grouped zips; 1,450 rows as supplied, historical equals current. The 2,179 gate still fails on count.)* The six BASIC ONE–SIX archives (or the two `curriculum_basic_*` zips) to regenerate Primary the same way; then the 2,179 count and scope can be tested.
2. SUPERSEDED (R6 is not a source): originally "R6 `REPORT.md` section 5 or the certified export/backup it describes, to establish provenance and the scope that removes the 54-row difference."
3. Owner decision on the 6 blocking secondary files (which Social Studies copy is authoritative; Music RTF and JSS2 PPTX conversion or exclusion).
