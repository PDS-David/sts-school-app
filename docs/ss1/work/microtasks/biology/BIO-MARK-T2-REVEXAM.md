# BIO-MARK-T2-REVEXAM — Biology, 2nd Term scheme row "Revision and Examination"

Status: **IMPLEMENTED_TESTING_DEFERRED** (record only; not approved, not verified). Nothing was run: no importer, compiler, zod parse, test, typecheck, database or device. No package, rule, coverage, lesson, correction or asset was written.

## Inputs
- Base: origin/master `9d1e4b5` (fetched 2026-11-08). Agent A2. Claim held on `biology`.
- Member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc` SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`: verified equal to the queue.
- Method and locator rule as BIO-INV-T2 and BIO-PRE-T2: LibreOffice 24.2.7.2 conversion of the verified .doc, `word/document.xml` of the converted copy, 963 blocks (block 962 is `w:sectPr`), block = direct child of `w:body`, 0-based, text = concatenation of `w:t` runs, no normalisation. The importer's own .doc route (word-extractor) was not run.

## The marker
- Block 17: `Revision and Examination`, SHA-256 `4ebd2846ac1f994f8e722e904995bf68b68234dfa0674e1cd0b4efed9163c964`. It is scheme row 11 (the last item of the auto-numbered scheme list, BIO-PRE-T2), after block 16 `Ecological Management ` and before blank block 18 and `REFERENCES` (19).
- Classification: **scheme-only marker in the preamble, not a lesson.** It is a single line of preamble text outside every week body. The text occurs exactly once in the document (case-insensitive search over all blocks).
- No instructional body exists for it. The converted document has ten week labels only: blocks 29, 92, 160, 262, 326, 481, 573, 683, 760, 887 (`WEEK ONE` to `WEEK TEN`); there is no `WEEK ELEVEN`, `WEEK TWELVE` or any numeric week 11 or 12 label. The last teaching block is 961 (the Week 10 theory question, `Mention three examples each of the following above.`), followed only by `w:sectPr`. Week 10's range is blocks 887-961, range sha256 `ecd6d1b683de45e47f55530180e8605b5f8057ccff672cc87ce7ac74fd5fb830` (reproduced). No revision worksheet, examination paper, marking scheme or mark allocation exists anywhere in the document; the searches for `revis`, `examin`, `marking` and `test` found only block 17, the evaluation headings listed below and block 477 (a Week 5 theory question asking for a table of food tests).
- Nothing is invented: no revision content, topics list, examination structure or timetable was written, and none should be inferred from the scheme row.

## Lines that look related but are not this marker
These are evaluation sections inside the week bodies; they carry teaching questions and stay with their week items. Classification never discards a body (contract).
| Block | Text | SHA-256 | Week |
| --- | --- | --- | --- |
| 71, 135, 237, 458, 549, 735 | `GENERAL EVALUATION/REVISIONAL QUESTIONS` (identical) | `7b3214a546d2adfe65742b9e665fdc02280124084bd1e8d8f627e9d7e1ac578a` | 1, 2, 3, 5, 6, 8 |
| 658 | `GENERAL EVALUATION/REVISIONAL QUESTIONS ` (trailing space) | `50333771e190effac8eb2e526837e028077732a70a88b35c4bf26eacbf95c29d` | 7 |
| 302, 869 | `GENERAL EVALUATION` (no `REVISIONAL`) | `26c33607b72aa50a93b6f214452db566d6e7d5292a1b98f35644af22cdc90b1a` | 4, 9 |
| 940 | `REVISIONAL QUESTIONS` | `42d08023990227e553cb490b0c6df81414aa5690c95a02940d002ca6b0c3d2bc` | 10 |

Block 940 heads blocks 941-946 (range 940-947 sha256 `8a990e845bd89db21b7a117ab5b78cf93efc62189573d03955931d63850de639`): questions on parasitism and predation, parasitism against amensalism, growth hormones in plants and animals, and mitotic cell division. These are teaching questions inside Week 10 (scheme topic Ecological Management); the growth-hormone and mitosis questions are not about that topic. That is a finding for BIO-WK-T2-W10, not a task here. None of these headings may be classified as REVISION or EXAMINATION markers.

## Findings for later work (findings only; nothing written)
- Contract position: `classify_marker` supports REVISION, EXAMINATION and SCHEME_ONLY, and SCHEME_ONLY may identify preamble material outside parsed rows; a MARKER coverage entry for such an item targets the SCHEME_ONLY rule ID, not a lesson ID (CONTRACT.md, Coverage and blockers). The compiler records a SCHEME_ONLY disposition when its anchor matches no parsed row. Block 17 sits before the first week label, so SCHEME_ONLY is the fitting kind; REVISION and EXAMINATION would claim a parsed row that does not exist here. Whether the importer's extracted text (word-extractor on the .doc) keeps the anchor `Revision and Examination` outside every parsed row was **not tested**.
- A later delivery step needs a `classify_marker` SCHEME_ONLY rule with anchor `Revision and Examination` and one MARKER coverage entry for scheme row 11, written only after the parse is reproduced; this item deliberately wrote neither, as the other biology items wrote none. Row 11 has no objective-level teaching to map, so it adds no coverage gap beyond the marker itself.
- The scheme gives the row no week number in text; it is list item 11 (BIO-PRE-T2).

## Edits
- `QUEUE.json`: BIO-MARK-T2-REVEXAM -> `IMPLEMENTED_TESTING_DEFERRED`; status_counts, next_runnable and one note updated; no other item changed.
- This file. `biology.json` not touched.
- Authoring checks only: JSON parse and round trip, unique IDs, dependency resolution, recount, diff limited to the allowed paths, hash recomputation.

## Remaining
`BIOLOGY-ALIAS-APPROVAL-T2` is still an owner action. The marker rule and coverage entry wait on a reproduced parse. BIO-WK-T2-W01..W10 and the BIO-VIS-T2 items are unchanged. No subject or class completion is claimed.
