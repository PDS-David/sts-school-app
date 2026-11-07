# LIT-FACT-T2-T3-RELATIONSHIP — 2nd vs 3rd Term Literature documents

Status: **IMPLEMENTED_TESTING_DEFERRED** (comparison evidence only; not approved, not verified).

## Inputs
- Archive `docs/ss1/sources/SSS1-original.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` verified.
- 2nd Term `SS1-SRC-1728961e97b5`, `SSS 1/2nd Term SS1_/LITERATURE.docx`, `a12244cb…dd757`, 57,389 bytes (verified).
- 3rd Term `SS1-SRC-2422e423a240`, `SSS 1/3rd Term SS1_/LITERATURE.docx`, `319a4898…91e9c3`, 56,647 bytes (verified).
- Method (private scratch, not committed): `mammoth` 1.12.2 `extractRawText` for text; `lxml` over `word/document.xml` for paragraph style, numbering, alignment and run formatting (bold, italic, underline, strike, caps).

## Per-section comparison
| Section | Lines | Text | Block SHA-256 (both terms) |
|---|---|---|---|
| Title line | 1 | **DIFFERS** | 2nd `SECOND TERM SCHEME OF WORK 2016/2017`; 3rd `THIRD TERM SCHEME OF WORK ` (trailing space; no year) |
| Class and header | 3, 5 | identical | `CLASS: SS1`; `LITERATURE – IN – ENGLISH ` |
| Scheme table (named works) | 7–53 | identical | `98ce4b4f1941cb55af76c05e1e74a3e41ed9a0763b9fe10d2a35d5612925c6a1` |
| Week 1 | 83–241 | identical | `2ec677a5…4fbd9a68` |
| Week 2 | 265–345 | identical | `5849c3e1…125d80e9` |
| Week 3 | 377–503 | identical | `fd686798…14dc2e91` |
| Week 4 | 539–633 | identical | `b2959866…8ce3b08c` |
| Week 5 | 641–755 | identical | `047b8582…fcb451d0` |
| Week 6 | 785–847 | identical | `02626434…f555475d` |
| Week 7 | 861–939 | identical | `13ca9dbe…163dc047` |
| Week 8 | 965–1113 | identical | `99035d9a…5923946b` |
| Week 9 | 1115–1223 | identical | `afeb14f0…fdcd0ab8` |
| Whole extract 1–1223 | | differs only through line 1 | 2nd `27ea88a8…fba51f0c`; 3rd `ce7c3ba1…ccbe17ef` |

Full week hashes are in `LIT-INV-T3.md`. Markers (seven assignment lines 235, 499, 629, 751, 805, 1109, 1221; scheme rows 49, 53), named works, text-versus-summary supply and strands are therefore identical. No image, drawing or media in either file, so nothing visual differs.

## What differs below text level
- Paragraphs: 612 in each. Only paragraph 0 (the title) differs in text. Paragraph style, numbering, alignment and bold/italic/underline/strike/caps are identical for all 612.
- `word/document.xml` is 307,791 vs 298,588 bytes. After removing revision-id attributes it still differs; the 2nd Term file contains 66 spell-check marker elements (`w:proofErr`) and 63 more runs than the 3rd Term file (932 vs 869). That is editing/save markup, not teaching content. Core properties differ in creation date and revision count only (not recorded here beyond this sentence).
- Other package parts (styles, numbering, theme, fonts) are the same size in both files; `word/settings.xml` differs (7,297 vs 6,797 bytes), not examined further.

## Consequence for the week items
- The only content difference is the title line (term name and the `2016/2017` year). It is passed to `LIT-PRE-T3` (annotated). `LIT-WK-T3-W01`…`W09` and `LIT-MARK-T3` already record that their blocks equal the 2nd Term ones.
- **No exclusion rule is added** and neither document or section is treated as a duplicate (the contract allows exclusion only for byte-identical same-term sources; these files are neither). Coverage and lessons for 3rd Term must use 3rd Term ids; where teaching is genuinely the same, link by content, never by reusing 2nd Term ids.
- Open for the owner (unchanged, see `LIT-INV-T3.md`): is the repeat intended, or was the wrong 3rd Term file supplied? `LIT-FACT-CONTENT-APPROVAL` stays BLOCKED.
