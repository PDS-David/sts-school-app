# SS2 / SS3 Source Archive Revalidation — 2026-11-17

## Exact archive receipt

Both original combined archives were attached again in the 2026-11-17 execution and their complete bytes were read directly. The archive hashes match the registered identities exactly.

| Class | Archive | SHA-256 | Members | First Term | Second Term | Third Term | File types |
|---|---|---|---:|---:|---:|---:|---|
| SS2 | `SSS 2-20260507T072840Z-3-001.zip` | `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153` | 61 | 19 | 22 | 20 | 47 DOCX, 13 DOC, 1 PPTX |
| SS3 | `SSS 3-20260507T072839Z-3-001.zip` | `045e261aba9475b32b4cb963a2495faf3ddd503860b205aa1e89f0ac07d3c741` | 39 | 19 | 20 | 0 | 28 DOCX, 11 DOC |

**Reconciliation correction:** the prior `SS3_ORIGINAL_ARCHIVE_POLICY_AUDIT_20261116.md` says 38 document files and 18 first-term entries. The attached archive actually contains 39 document files: 19 first-term and 20 second-term. Its member count and archive hash are unchanged.

## Extraction verification

- All 100 document/presentation members were extracted from the exact archives.
- Text extraction succeeded for all 100 members using DOCX parsing, Antiword for legacy DOC, PowerPoint text extraction, and LibreOffice text conversion as a fallback for one malformed DOCX package.
- The source archives remain uncommitted. No original page images, third-party diagrams or complete rendered-page QA are certified by this text extraction.
- The repository's source assignment and header-verification registers remain the authoritative source-ID crosswalk; this revalidation does not silently replace any source ID.

## Source availability by class

The register contains 21 canonical subject assignments in each class.

### SS2

| Subject | Archive terms present | Reconciliation |
|---|---|---|
| Agricultural Science, Biology, Chemistry, Civic Education, Commerce, Data Processing, Economics, English, Financial Accounting, French, Further Mathematics, Geography, Government, Literature, Mathematics, Physics, Yoruba | First, Second, Third | Source members present; content completeness still requires subject-level mapping. |
| Bookkeeping | First, Second, Third | First- and Second-Term extracted substantive text is near-identical apart from the term marker; do not treat it as evidence of distinct Second-Term teaching without a content comparison. |
| Food and Nutrition | First folder entry, two Second-Term folder entries, Third | The First-Term-folder file is byte-identical to one Second-Term-folder file and its internal heading says Second Term. The other Second-Term-folder file is the actual Second-Term candidate. Therefore a valid distinct First-Term source is not established. |
| Catering Craft | Second only | First and Third terms have no source member. |
| Technical Drawing | Second, Third | First Term has no source member. |

**Class/header anomaly:** the file `2ND TERM S2 GEOGRAPHY.docx` is in the SS2 Second-Term folder, but its internal header says `CLASS: SS3`. Do not certify it as SS2 Geography until the class discrepancy is resolved.

### SS3

| Subject | Archive terms present | Reconciliation |
|---|---|---|
| Agricultural Science, Biology, Chemistry, Civic Education, Commerce, Data Processing, Economics, English, Financial Accounting, French, Further Mathematics, Geography, Government, Mathematics, Physics, Yoruba | First, Second | The presence of a source does not authorize new SS3 instruction; apply exam-preparation-only and prior-learning gates. |
| Literature in English | First, Second | The two files are byte-identical (16,468 bytes; SHA-256 `6bbfed9e3c54476559de4699fd7e02d4ac059037817a438f5d29f70ac6be9328`). Treat Second Term as duplicate evidence, not a distinct term curriculum. |
| Bookkeeping | First, Second | Extracted substantive text is near-identical apart from the term marker; do not treat it as distinct Second-Term curriculum without further source evidence. |
| Food and Nutrition | First only | Second Term has no source member. |
| Catering Craft | Second only | First Term has no source member. |
| Technical Drawing | Second only | First Term has no source member. |

The SS3 archive has no Third-Term folder or source documents. No SS3 Third-Term source material may be created from this archive.

## Four source-version discrepancies — preserved, not selected

The newly attached files match the *received* hashes below. They differ from earlier registered source versions. No version is selected as authoritative in this revalidation.

| Class / Term | Member | Earlier registered SHA-256 | Reattached SHA-256 | Reattached bytes |
|---|---|---|---|---:|
| SS2 Second | `ECONOMICS (1).docx` | `2830d6b801994e3b4afb23c4c4f2e89e61572499e29bc59531a28ba696eb9868` | `6ffaa98c3bc21f8f64a983e98be9cb1f3c2653e9a307983094558b0ed72f32af` | 818,985 |
| SS2 Third | `3RD TERM S2 FURTHER MATHEMATICS.docx` | `45ea9e0a278bc5878d3a19bf3bba9fa0cc2ed7ac071dd883e6128d8545d1fd1e` | `121128fb481493d59bee89531d3292aefaebd5a9fc70b2b2db2c790c838620a9` | 923,488 |
| SS3 First | `MATHS.docx` | `7c68878f7df2f9c33e4300ab57c6f50d7543271e3a5c291708872e7289c53084` | `5dfe73c71d665b8aab42464972b7996611cc7dabbeb36b164648be8fb7cd7d45` | 1,209,620 |
| SS3 First | `1ST TERM S3 ECONOMICS.docx` | `ab8b06a3d1127535cfddf382022a461fcdb8ed4248f0214b7e6ac434bb976435` | `f570f1ad257dc4018c8bec787d1b30ce90312ed01c80cc953ce26b71de10d03c` | 767,596 |

Required disposition: recover the earlier exact member bytes from repository history/artifacts if available, compare both versions' substantive scheme, lesson and assessment content, and preserve both identities. If the earlier bytes cannot be recovered or authority cannot be established, keep affected coverage unresolved and prevent certification.

## Implementation consequences

1. The archive bytes are no longer a blocker for direct source inspection in this execution. Source-dependent work can proceed from the exact received files.
2. A valid source member is not proof that every week, assessment, diagram, table, equation or practical requirement has been implemented.
3. SS2 remains instructional across three terms. Missing or misattributed terms above remain unresolved; do not manufacture replacements.
4. SS3 remains examination preparation only. Source teaching units must be converted only where prior SS1/SS2 learning is evidenced; otherwise retain an unresolved disposition.
5. Source reuse rights, specialist subject QA, independent answer/mark verification and student-delivery readiness remain separate gates.
