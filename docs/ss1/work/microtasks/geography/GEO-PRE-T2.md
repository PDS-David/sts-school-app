# GEO-PRE-T2 — Geography Second Term preamble disposition

Status: **IMPLEMENTED_TESTING_DEFERRED** (source indexing and disposition only; not approved or verified).

## Source and exact block evidence
- Source: `SS1-SRC-ba9dee61c27c`; member `SSS 1/2nd Term SS1_/2ND TERM S1 GEOGRAPHY.doc`; member SHA-256 `fa120c0e9f2f7a47df2c775afdfe049b41ab2acb1972c1457b31c85e70b3a2e5`.
- Locator method: word-extractor 1.0.4 `getBody()`; 1-based lines, joined with newline, UTF-8, trailing blank lines trimmed.
- Whole preamble lines 1-22 SHA-256 `056fe6213bd0bffeb5c27115f1e66a7b9fdf4ec2ff85aecc4ce83cfaa81b63ff`.
- Title/header lines 1-3 SHA-256 `3f8db4887f31f7944499d942ba3445aa4c52871b72784645e449aca70d02899c`. Line 1 is SECOND TERM E-LEARNING NOTE; line 3 exactly equals the registered subject header and occurs once.
- Scheme lines 5-17 SHA-256 `16f8346eaa97420d7393afa489cfd66d4aeec3126c08eda9e58cd0d7c8efb52c`; scheme rows 8-17 SHA-256 `0bd4de0bf39dab3491a2157bcaa55202c662ef72b56e04681220f9d037ff5825`.
- Reference lines 19-21 SHA-256 `17204e7a2f49ac4901fddd15570d2e1b697576bcb2b3861edc37624ef600a5df`. The source names one reference: *Essential Geography for Senior Secondary Schools*, O.A. Iwena.

## Scheme row dispositions
| Row | Scheme scope | Body mapping | Disposition |
|---|---|---|---|
| 1 | Week 1: REVISION / MOUNTAINS | Week One lines 23-96 | Mountains are taught; the promised First Term revision is absent. Coverage remains PARTIAL. |
| 2 | Week 2: PLATEAUX | Week Two lines 99-155 | Existing supplementary lesson and coverage retained. |
| 3 | Weeks 3-4: LOWLAND (PLAINS) | Week Three and Four lines 158-217 | Existing combined supplementary lesson and coverage retained. |
| 4 | Week 5: THE ENVIRONMENT | Week Five lines 218-292 | Existing supplementary lesson and coverage retained. |
| 5 | Weeks 6-7: WEATHER AND CLIMATE | Week Six and Seven lines 295-448 | Source span indexed; lesson not yet registered. PARTIAL. |
| 6 | Week 8: COMPONENTS OF GIS | Week Eight lines 451-490 | Source span indexed; lesson not yet registered. PARTIAL. |
| 7 | Week 9: MAP READING, MAP TYPES AND SCALE | Week Nine lines 493-580 | Source span indexed; lesson not yet registered. PARTIAL. |
| 8 | Week 10: MAP DISTANCES, CONVERSION, DIRECTION AND BEARING | Week Ten lines 583-659 | Source span indexed; lesson not yet registered. PARTIAL. |
| 9 | Week 11: REVISION | No Week Eleven body | Classified as SCHEME_ONLY by source rule `SS1-SRC-ba9dee61c27c-R002`; represented by MARKER coverage. No revision lesson is fabricated. |

## Source-only blocks and boundaries
- The title and uniquely occurring subject/class header are source metadata, not a lesson objective.
- The reference block is retained as bibliographic source evidence; edition, publisher and reuse rights are not asserted.
- Blank lines 4, 6, 18, 21-22 and inter-week separators are accounted for in the inventory; they contain no additional teaching text.
- No examination row, examination paper, answer key or marking scheme appears in the preamble.

## Package changes
- Added source rule `SS1-SRC-ba9dee61c27c-R002` with exact source SHA, unique whole-line anchor `REVISION`, and SCHEME_ONLY classification for the Week Eleven scheme row only.
- Added PARTIAL coverage for scheme rows 1 and 6-8; added MARKER coverage for row 9. Existing implemented-equivalent coverage for rows 2-5 is preserved.
- Added this disposition record. No source text, original lesson, approval state, verification state, or unrelated subject file was changed.

## Remaining
Weeks 1 and 6-10 still require source-week implementation and/or teacher-approved objective disposition. Owner alias approval and content approval remain separate. This item does not claim Geography or the SS1 class is complete.
