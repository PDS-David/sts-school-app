# BASELINE3 — protected-curriculum evidence (Primary reconstruction), without inventing certification

**Status: PARTIAL / protected 2,179 gate NOT passed.** `certification_claimed` is false everywhere. OB-06 stays open. This task regenerated Primary output at the historical baseline and at current master and found them equal. That is source-output equality, not preservation of a certified database.

## Finding recorded first: R6 is not a certification or export source
`AGENT_1F-R6_CONTENT_DECISIONS.zip` (SHA256 `b087654c07e7516f023451de6f4ffc7cbdaedc6ff2e3156f675a335477610960`) and its `REPORT.md` (`233c93901a67aa4b5d121666dcb15166cb45f4a604248f2231f992f0dc0621b2`) were re-hashed here and match; all three internal checksums pass. The report calls itself "document reconciliation only. Not a curriculum certification." Section 5 item 4 lists the exact preservation of the 2,179 protected rows as not done; the only supplied mention is R5V's "not done, by scope", and no attachment defines or lists them. The archive holds `REPORT.md`, `OWNER_DECISIONS.md`, `CONTENT_GAPS.csv`, `SHA256SUMS`: no row identities, export, backup, approval record or importer commit. Machine record: `evidence/r6_verification.json`.
BASELINE2's wording that asked for R6 as the missing record is marked superseded (done in PR #30; its original observations are unchanged).

| Item | Status |
|---|---|
| Implemented | `scripts/jss3/baseline3/build_baseline3_evidence.py` + 9 tests (PR #30 added `combine_exports.py` + 5 tests); no importer/runtime change; `capture_importer_rows.py` and the P1 comparer used unmodified |
| Observed | Primary, as supplied: 1,450 rows, byte-identical row file at `5424620` and master, audit PASSED, comparer diagnostic PASS (`--expected-count 1450`), protected gate FAIL (count only) |
| Observed (variant) | Primary with the 18 nested zips extracted: 1,474 rows, equal hist/current, audit BLOCKED |
| Not established | Identity of a certified database/export; which rows (if any) the historical certification covered; why 2,179 |
| Not authorised / not done | Production import, migration, deployment, row removal to force a count |

## Relationship to PR #30 (earlier partial BASELINE3)
PR #30 recorded the R6 finding, re-ran the **secondary** (JSS1/JSS2) capture on master `f28c119` (741 rows, row-file SHA256 `ab3b1285…c567`, equal to historical `5424620`; audit-clearing JSS set, diagnostic PASS), added `scripts/jss3/baseline2/combine_exports.py` (+5 tests) and stated that Primary inputs were unavailable. This change supplies the Primary half. `evidence/baseline3_inputs_and_state.json` is that earlier run's record and its "Primary not available / not performed" entries are historical; they are superseded for Primary by this report. `combine_exports.py` was not run on real data here because the secondary raw rows are private and were not supplied to this task; combined figures below are count arithmetic.

## Base and environment
- Recorded reference master `f28c1198f3585c2c489ebe7a8906303cd730030c`. Master then advanced to `6bac464` (PR #30, an earlier partial BASELINE3: docs, evidence and `combine_exports.py` only; `git diff f28c119 6bac464 -- backend package-lock.json` is empty). This branch is rebased onto it, its work was merged with PR #30's, and the current-side Primary capture was re-run on the rebased tree (same row-file hash). Open PRs could not be listed (unauthenticated API rate-limited). Historical checkout `54246201616939fe98897dc10f7b2e3f46472b40` (the BASELINE2 baseline). No `AGENTS.md` exists in the repo.
- Node 24.19.0 (installed from the `node-linux-x64@24.19.0` npm package because the sandbox default is 22.22.2), `npm ci --ignore-scripts` in each checkout. Resolved versions identical on both sides: mammoth 1.12.2, word-extractor 1.0.4, jszip 3.10.1, tsx 4.23.1, typescript 5.9.3.
- Each checkout's own importer and helpers ran. `primaryCurriculumResolutions.ts` (and the JSS1/JSS2 resolution modules) are byte-identical between the two commits; `ingestTopics.ts` differs by the later JSS3 additions only. No database connection (DB env vars removed by the capture script).

## Inputs and source scope (private, outside Git)
| Input | SHA256 | Result |
|---|---|---|
| `curriculum_basic_1-3.zip` | `0cb6f85c…3725` | BASIC ONE 42, TWO 52, THREE 46 files: counts equal `INPUT_INVENTORY.json` |
| `curriculum_basic_4-6.zip` | `dd4bbc31…4d92` | FOUR 44, SIX 56: equal inventory. **FIVE 45 vs inventory 46** |
| `AGENT_1F-R6_CONTENT_DECISIONS.zip` | `b087654c…0960` | See above |

- The grouped zips are alternatives to the six individual BASIC archives; their hashes cannot be matched to the inventory hashes, so equivalence is shown by per-class file counts only. BASIC FIVE is one file short of the inventory count; which file is not identifiable here. Folder names use `_` instead of spaces at the archive level; inner `BASIC FIVE/…` paths (which the importer's Primary 5 rule matches) are intact. One entry is stored as `#U207f.docx` (an extraction escape of U+207F); it is excluded by the folder rule either way.
- All 18 nested term zips were checked. The importer never opens zips; the term folders are already extracted beside them. 16 of 18 nested zips are fully matched by byte-identical files beside them; 4 entries in the other 2 (Primary 4 and Primary 5 First Term) are not (`evidence/nested_zip_vs_extracted.csv`): Primary 5 First Term Basic Science `.doc`, Agric `.doc`, Maths `.docx`; Primary 4 First Term Agric `.docx`.
- **Variant A (as supplied)** is the primary result. **Variant B** extracts the 18 nested zips beside their originals (the method earlier BASELINE work used for the JSS archives). B restores the `.doc` Basic Science and Agric files named in the importer's Primary 5 First Term rule; A contains `.docx` copies of those that the rule excludes.
- **Duplicates, explicit:** 83 exact byte duplicates are ignored by the importer in both variants (`evidence/exact_byte_duplicates_ignored.csv`, variant A with sha256). 15 files are excluded by the importer's own verified rules in both. Variant B additionally has 6 normalised-content duplicates (Primary 4 Mathematics First Term, `.doc` vs `.docx` of the same lesson), which is why its audit blocks (`evidence/variantB_audit_blocking_content_duplicates.json`). Nothing was deleted to remove them.

## Results (same schema both sides, 10 columns; identity key `school_code,class_name,subject_name,term_label,order_index`)
| Variant | Importer audit | Rows hist / current | Row file hash equal | Protected gate (2,179) | Diagnostic (`--expected-count` = own count) |
|---|---|---|---|---|---|
| A as supplied | PASSED (exit 0) | 1,450 / 1,450 | yes (`c0c8c3c7…193e1d`) | FAIL (count only) | PASS |
| B nested zips extracted | BLOCKED (exit 1) | 1,474 / 1,474 | yes (`5cd0a7b1…4a54d`) | FAIL (count only) | PASS |

No missing, unexpected, duplicate or content-differing identities in either. Negative control (one row dropped, one title given a trailing space) is detected: FAIL (`comparer_primaryA_negctl.json`). A diagnostic PASS is equality of two generated sets, not the protected gate.
Primary rows by class/term, A (1st/2nd/3rd): P1 58/80/82, P2 92/79/90, P3 87/93/78, P4 106/72/85, P5 59/74/74, P6 78/85/78. B differs only in P4 1st Term (117) and P5 1st Term (72): 24 identities present only in B, 16 identities with the same key but different body/source (`evidence/variantA_vs_B_row_delta.csv`, identity columns and file names only).

## Reconciling with earlier counts (no forcing)
- Earlier raw candidates: Primary 1,492 + JSS1/JSS2 741 = 2,233 (commits `29f135b`/`40049bb`, from the individual BASIC archives with 24 nested zips extracted; audit blocked). **1,492 was not reproduced** by either arrangement here (A 1,450, B 1,474). The earlier source root is not in Git, the BASIC FIVE count differs from the inventory, and the commit pair differs, so the cause is not determinable from these inputs and no cause is asserted.
- Combined with the committed BASELINE2 secondary count (741): A = **2,191** (+12 over 2,179), B = **2,215** (+36). Neither equals 2,179. 2,233 and 2,179 differ by 54; nothing here identifies any of those rows. No rows were removed, no subset chosen, and the expected gate was not changed.
- The combination is arithmetic on counts. A row-level combined comparison was **not** performed: the secondary raw rows are private BASELINE2 captures and the JSS archives were not supplied here. Schemas are identical; source scopes differ (secondary: as supplied, audit BLOCKED by 6 files; Primary A: audit PASSED), so even a combined PASS would not be one uniform source scope. `evidence/combined_counts.json`.

## Three separate questions
| | Question | Answer |
|---|---|---|
| a | Do the historical and current importers produce equal output from the same sources? | **Yes** for Primary (A and B) and, per BASELINE2, JSS1/JSS2. Source-output equality only |
| b | Is an identified certified database/export preserved? | **Not testable.** No such artefact exists in Git or in the supplied inputs (R6 is not one) |
| c | What did the historical certification cover? | **Unknown.** No record names the importer commit, source archives, class/school filters, approver or date |

## Exact missing evidence (close the gate with either; do not request R6)
1. A certified database dump/backup, or a row export, of the 2,179 protected rows with stable identity and full content (so `compare_baseline.py` can run against it; `scripts/jss3/export_protected_curriculum.sql` can produce the export from an authorised local restore); **or**
2. A written certification record naming the importer commit, the source archives/hashes and the school/class filters that yield exactly 2,179.
If neither exists, the 2,179 count remains an unverified figure; nothing in this evidence supports or refutes it. Separately, the BASELINE2 owner decision on the 6 blocking JSS1/JSS2 files remains open, and which BASIC FIVE file the inventory counts but the grouped zip lacks is unknown.

## Reproduce (outputs outside Git)
```
# extract both grouped zips into <priv>/src ; variant B = copy, then extract each nested .zip into its own folder
python3 -I scripts/jss3/baseline2/capture_importer_rows.py --checkout <worktree@5424620> --sources <priv>/src --school-code primary --output <priv>/out/primaryA_hist --label primaryA_hist
python3 -I scripts/jss3/baseline2/capture_importer_rows.py --checkout <worktree@master>  --sources <priv>/src --school-code primary --output <priv>/out/primaryA_cur  --label primaryA_cur
python3 docs/jss3/completion/P1_BASELINE/compare_baseline.py --baseline <priv>/out/primaryA_hist/rows.json --snapshot <priv>/out/primaryA_cur/rows.json --key school_code,class_name,subject_name,term_label,order_index --output <priv>/out/cmp/primaryA_gate.json   # add --expected-count 1450 for diagnostic
python3 -I scripts/jss3/baseline2/build_sanitized_evidence.py --private-out <priv>/out --sources <priv>/src --evidence <dir> --configs primaryA primaryB --compare-dir <priv>/out/cmp
python3 -I scripts/jss3/baseline3/build_baseline3_evidence.py --help
```
Private exports (`rows.json`, `importer.log`) contain lesson text and are not committed.

## Tests and checksums
- `python3 -m unittest scripts/jss3/baseline3/test_baseline3.py`: 9 OK. `scripts/jss3/baseline2/test_baseline2.py` and `test_combine_exports.py`: 12 OK. `P1_BASELINE` suite: 13 OK.
- `cd docs/jss3/completion/BASELINE3/evidence && sha256sum -c SHA256SUMS`.
- The full JSS3 acceptance runner was not run: no teaching/runtime behaviour changed.
