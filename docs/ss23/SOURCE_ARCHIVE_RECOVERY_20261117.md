# SS2/SS3 source archive recovery and verification — 2026-11-17

## Recovery result

The two owner-supplied combined curriculum archives were recovered from the connected ChatGPT Library. No new upload was requested. The original archive bytes were materialised to a temporary analysis workspace, tested, and left out of Git.

| Archive | Verified SHA-256 | Bytes | Files | Extension inventory |
|---|---|---:|---:|---|
| `SSS 2-20260507T072840Z-3-001.zip` | `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153` | 50,053,686 | 61 | 47 DOCX, 13 DOC, 1 PPTX |
| `SSS 3-20260507T072839Z-3-001.zip` | `045e261aba9475b32b4cb963a2495faf3ddd503860b205aa1e89f0ac07d3c741` | 26,540,265 | 39 | 28 DOCX, 11 DOC |

Both SHA-256 values match the receipt identities already recorded in the repository. Both ZIP integrity tests completed with no errors. All 100 archive members were extracted to a temporary workspace and their member hashes and byte counts were recalculated.

## Reconciliation against the 100-row source register

- 100 archive members were present: 61 SS2 and 39 SS3.
- The existing register contains 100 source assignments across 21 subject slugs.
- 96 received members match the earlier register by SHA-256 and byte count.
- Four received members have different bytes from the older registered version. The received archive candidates and the earlier registered identities remain separate; no version has been silently substituted.

| Class / term | Member | Earlier registered SHA-256 | Received candidate SHA-256 | Disposition |
|---|---|---|---|---|
| SS2 / Second | `ECONOMICS (1).docx` | `2830d6b801994e3b4afb23c4c4f2e89e61572499e29bc59531a28ba696eb9868` | `6ffaa98c3bc21f8f64a983e98be9cb1f3c2653e9a307983094558b0ed72f32af` | Version decision unresolved |
| SS2 / Third | `3RD TERM S2 FURTHER MATHEMATICS.docx` | `45ea9e0a278bc5878d3a19bf3bba9fa0cc2ed7ac071dd883e6128d8545d1fd1e` | `121128fb481493d59bee89531d3292aefaebd5a9fc70b2b2db2c790c838620a9` | Version decision unresolved |
| SS3 / First | `MATHS.docx` | `7c68878f7df2f9c33e4300ab57c6f50d7543271e3a5c291708872e7289c53084` | `5dfe73c71d665b8aab42464972b7996611cc7dabbeb36b164648be8fb7cd7d45` | Version decision unresolved |
| SS3 / First | `1ST TERM S3 ECONOMICS.docx` | `ab8b06a3d1127535cfddf382022a461fcdb8ed4248f0214b7e6ac434bb976435` | `f570f1ad257dc4018c8bec787d1b30ce90312ed01c80cc953ce26b71de10d03c` | Version decision unresolved |

The four earlier byte versions are represented in the existing receipt, but their original bytes were not found in the recovered combined archives or current Library ZIP inventory. The newly received candidates are now available for direct inspection; the old versions cannot be compared substantively until their bytes are recovered from another retained copy.

## Internal header verification

The current 100-row `HEADER_VERIFICATION.csv` reconciles to these counts:

| Header status | Count |
|---|---:|
| Header verifies subject/class/term | 84 |
| Subject and class verified; term not stated internally | 11 |
| Class not stated | 1 |
| Class and term not stated | 2 |
| Term mismatch (SS2 Food & Nutrition duplicate says First Term in the Second-Term folder) | 1 |
| Class mismatch (SS2 Second-Term Geography member says SS3 internally) | 1 |
| **Total** | **100** |

Important source dispositions:

- SS2 Second-Term Geography is held from SS2 implementation pending resolution: its filename/folder say SS2, but the document header says SS3.
- The SS2 Second-Term Food & Nutrition folder contains a misleading duplicate whose internal header says First Term. Do not treat that duplicate as a Second-Term source; retain the other Second-Term candidate separately.
- SS2 Second-Term Data Processing and SS2 First-Term Financial Accounting do not state class/term in their opening header. Their archive assignment and body must be corroborated before certification.
- SS2 Third-Term English does not state class in its header.
- The 11 term-not-stated files retain their archive-folder term assignment as a separate fact; it is not rewritten as an explicit internal-header statement.
- SS3 Literature First and Second Term files are byte-identical.
- SS2 and SS3 Bookkeeping First and Second Term documents are identical after their differing header material; do not invent distinct Second-Term teaching content.
- Filename/header aliases and Alpha/Sigma labels remain recorded as source evidence, not silently normalized.

## Source availability

The 21 source subject slugs remain the authoritative inventory. The archive contains:

- SS2: 19 subjects with First Term, 20 Second-Term member records because of the duplicate Food & Nutrition file, and 19 Third-Term members. Catering Craft First/Third Term and Technical Drawing First Term are absent.
- SS3: 19 First-Term members and 20 Second-Term members. Catering Craft First Term, Food & Nutrition Second Term and Technical Drawing First Term are absent.
- SS3 Third Term has zero members and remains empty.

A member's presence does not establish that it is suitable SS3 teaching. SS3 content must be converted only into examination preparation where its prior-learning topic is established in an earlier class.

## Extraction and visual evidence

- Text was extracted from all 100 members for source mapping. Legacy DOC files were read with a DOC-compatible extractor; DOCX content was read with OOXML-aware extraction; the PowerPoint member was inspected for slide text.
- One SS2 Third-Term Mathematics DOCX contains a malformed internal `word/NULL` relationship that prevents the Python DOCX reader from parsing it. The archive member itself passes ZIP integrity and LibreOffice successfully renders it to PDF; use the rendered source for subsequent page-level extraction.
- Rendered PDFs are being generated for visual reconciliation. Text extraction does not prove that equations, superscripts, tables, diagrams or practical apparatus have been preserved. Page-level review remains a separate QA gate.
- No source archive, extracted full-text file, or page render was added to Git.

## Release and rights boundary

The owner-approved curriculum remains approved; this report does not request curriculum approval again. Source reuse rights, source-version authority, content correctness, independent subject QA, and student delivery are separate gates. Existing packages remain draft/pending until their applicable assessment, visual, rights and independent-review work is completed.

## Immediate implementation consequence

The source-byte recovery blocker is removed. Source-backed implementation can now continue subject by subject from the exact recovered members. The four version conflicts and explicit header mismatches remain quarantined rather than being used as if resolved.

## 2026-11-17 source-question cross-checks

Using the recovered source member text, I independently checked the source-located evaluation prompts already present in the two open SS2 packages:

- Civic Education PR #969: **26 of 26** `ORIGINAL_SOURCE` evaluation prompts were found in the cited First-, Second- and Third-Term source documents. The answer keys and second practice prompts are authored supplements.
- Government PR #974: **30 of 30** `ORIGINAL_SOURCE` evaluation prompts were found in the cited First-, Second- and Third-Term source documents. One Week 7 question had a minor wording omission ("an Emir"); it has been corrected to match the source exactly and a regression assertion was added. Model answers and second practice prompts are authored supplements.
- These checks verify the 56 labelled evaluation prompts, not every additional general-evaluation block, weekend assignment, exercise reference, visual, or answer key. Those remain in the subject open-item registers.
- SS2 Mathematics PR #980 adds 21 draft units for Second and Third Terms. Its new practice prompts are explicitly authored supplements; source exercise and examination blocks are still to be transcribed and reconciled. Second-Term Week 2 and Week 10/11 source-sequence discrepancies remain held.
