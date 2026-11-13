# SS2 / SS3 original source receipt — 2026-11-13

Archives were supplied by the owner in-session. They are **not committed** (no repository-upload authorisation, unlike SSS1). Re-supply is needed to re-run extraction; identity is pinned by the hashes below and in `SOURCE_ASSIGNMENTS.csv` (100 members, SHA-256 each).

| Archive | SHA-256 | Members |
|---|---|---|
| 1st_Term_SS2_-20230730T171410Z-001.zip | cad70d044dfcbe5aa89b7a076627b49914ce4d57403326a1ec0790f03af1e12d | 19 |
| 2nd_Term_SS2_-20230730T171421Z-001.zip | b3052b8313bee6fbd0b10586e8c7059782ddd59549f1f514549945c5c6f174b6 | 22 |
| 3rd_Term_SS2_-20230730T171429Z-001.zip | d99f84d0569a0db633f8acd1b865df7959a0bd006d2890d61cf32ba92622ab62 | 20 |
| 1st_Term_SS3_-20230730T171413Z-001.zip | bfbd5ff32edd803a3924cce5087c5cc37def0cc0d105f85379c33524306c2f40 | 19 |
| 2nd_Term_SS3_-20230730T171425Z-001.zip | 6a5452ac893977067537dd4fe8ac802a82c6eba4a428cbd668b0cddae7e628e0 | 20 |
| 3rd_Term_SS3_-20230730T171433Z-001.zip | b253b0ae5d3622d533459a0072ace4edefc0123dc5e434dabbc4189473f630e1 | **0 (folder entry only, 198 bytes)** |

ZIP integrity test passed for all six. Subject slugs in the CSV come from filenames only (`FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER`); header verification is a separate task. Regenerate with `python3 -I scripts/ss23/build_source_inventory.py <dir-of-zips> <out.csv>`.

## Findings (evidence: inventory CSV)
1. **SS3 Third Term archive is empty.** No SS3 3rd-term source exists.
2. **Missing subject-term files** (no source at all): Technical Drawing SS2 T1, SS3 T1; Catering Craft SS2 T1, SS2 T3, SS3 T1; Food & Nutrition SS3 T2; Technical Drawing and Catering have no SS2/SS3 coverage beyond the terms listed in the CSV.
3. **Byte-identical files used for two terms:** SS3 Literature in English T1 = T2 (so no distinct SS3 T2 Literature source); SS2 Food & Nutrition `F _ N (1) (1).docx` in the T2 folder is the T1 file (header says "FIRST TERM"), so the real T2 file is `F _ N (1).docx`.
4. **Book-keeping T1 and T2 are identical after the header line** for both SS2 and SS3 (header changes only FIRST/SIGMA term): second-term Book-keeping has no distinct source.
5. Header/filename mismatches not yet checked (e.g. `ENGLISH.txt` titled "ALPHA TERM"; "Alpha/Sigma" term names vs First/Second).

Not done: week/topic extraction, per-subject coverage, any lesson content.
