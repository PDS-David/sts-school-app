# AG-INV-T1 — Agricultural Science, 1st Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `21a5f7d` (fetched; no open PR; no existing AG-INV-T1 branch). `AGENTS.md` is absent.
- Prerequisite AG-SRC-T1 is `IMPLEMENTED_TESTING_DEFERRED`; package `backend/src/db/ss1/subjects/agricultural-science.json` exists with source `SS1-SRC-7aa642b0085b` and no lessons or coverage.
- Original: standalone `1ST_TERM_S1_AGRICULTURAL_SCIENCE.docx`, SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — hashed before conversion; equals `SOURCE_ASSIGNMENTS.csv`. A 1st Term archive (`8055d852…e636`) was also supplied; it is not the composite archive (`02448712…9a3e`), so the composite hash was **not checked**. Its Agricultural Science member was listed, not hashed.
- Method: `word/document.xml` read with lxml in a private scratch directory; both embedded images viewed. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0-931; block 932 is `w:sectPr`). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. Python: `T=[''.join(x.text or '' for x in b.iter('{W}t')) for b in body]; sha256('\n'.join(T[a:b+1]).encode())`.

## Week inventory (10 teaching weeks)
| Week | Exact label (whitespace collapsed here) | Label block | Blocks | Label sha256 | Range sha256 | Table |
|---|---|---|---|---|---|---|
| 1 | `"WEEK 1 DATE ………………………………"` | 45 | 45-142 | `5eb6b6b00efdf9aae73f1cd5aa450709df1388889b447b0946caafccf24d0182` | `2c35bf392e022db022285268ace50e651d3ba15cff8c9a462194bb41bca4ac00` | - |
| 2 | `"WEEK 2DATE…………………………………………."` | 143 | 143-185 | `4ac4fdcd85db205e1136ac8685fad67e0f12d08c1c63428703752d584060662b` | `0675d4a5ba07886d9387b83c5394bbc786dc6eff52c20e43ce3420cc99895ceb` | block 160 |
| 3 | `"WEEK 3 DATE ………………………………"` | 186 | 186-326 | `8b6eff349e41502af912d6a1eef8850b16804dbf5e9a79f1bb50772269aa0eb8` | `fbc4d190de76b9f916b8349eb1e2b34992b3a9f1839aad4aeb175ccc37ecfefb` | - |
| 4 | `"WEEK 4 DATE ………………………………"` | 327 | 327-420 | `229efc755c549882fb696c614c2eea52c0f6ede90cf8d89b08907c57d1011de1` | `e7b9099d4ca963ad728a67b5fb866a6ad2f39d637861800077bc6ffce58fcf8f` | - |
| 5 | `"WEEK 5 DATE ………………………………"` | 421 | 421-472 | `ac5436a3583cf2ab3d3d597e97625e07f68566a4532919e95abcc7c8fda31847` | `0b511ea943b8ca423eb1fc0e16807edaedf56048210b5e6a9638ecd6fe745819` | - |
| 6 | `"WEEK 6 DATE ………………………………"` | 473 | 473-533 | `5056bc5e7bd4597466f4482b114a23c6bb8c36ef953fed94e1a8dc08bc9a2bf5` | `19248abe8aded1d7f739cf4d6f75759c8eb099022e21e45614135bc4815d36c5` | block 486 |
| 7 | `"WEEK 7 DATE ………………………………"` | 534 | 534-617 | `b5ca2dbd91ad1c43c1f09bdf71862696673aaefffcd459e4d5715918c1ff1627` | `dd96618ec8f4bed3121558a23f941d506c6fa6ca0be4bccf91ebc31b703a9aa1` | - |
| 8 | `"WEEK 8 DATE ………………………………"` | 618 | 618-720 | `fd2ec2c6ab406ac79c707a303a8c4e5ffabdbad7d4e5b49c395e6664b6c8809d` | `5b0cac0de95cf5e17ccd5c4c5544da456300a217f35414511af3ee3525a70d14` | - |
| 9 | `"WEEK 9 DATE ………………………………"` | 721 | 721-865 | `e49a67c5f9ee04d211c522971f42cfc83eaf339ea51894512b072dbb1082f102` | `888982547014538459e63665cd22a6f311c6acbeeb72bb511cf855ff495b4018` | - |
| 10 | `"WEEK 10 DATE ………………………………"` | 866 | 866-931 | `40b4d4f8953b8b0330d7667294b3dcc1444b464bdcee30bd13c5e8e42d9b8b29` | `63ef5e359e9b53ed3a47905e9ee92a78704a699a47f8f2e9b4349f888a325208` | - |

Topic lines: W1 block 47, W2 144, W3 188, W4 328-329, W5 423, W6 475, W7 536, W8 620, W9 723, W10 867. The scheme (blocks 12-23) is one auto-numbered Word list of twelve items; items 1-10 match the ten bodies in order, items 11 (`Revision of the Term’s Work.`, block 22) and 12 (`Examination.`, block 23) have **no body** — there is no WEEK 11 or WEEK 12 label and the document ends at block 931. Week numbers in the scheme are implicit in the list numbering and absent from extracted text.

## Other sections and objects
- Blocks 0-44: cover (one-cell table block 2, drawing block 4), `FIRST TERM E-LEARNING NOTE` (8), `SUBJECT:  AGRICULTURAL SCIENCE    CLASS:  SS1` (9), scheme (10-23), REFERENCES (25-29: four books), empty blocks 30-44. Range sha256 `6c16cc92e1f72d3f0deaa85356717c814d7044ca83597343d2b50b2a1f533e50`.
- Tables: block 2 (empty cover wrapper), block 160 (Week 2, 13 rows incl. header × 2), block 486 (Week 6, 15 rows incl. header × 3).
- Images: `media/image1.jpeg` (cover) and `media/image2.jpeg` (page header) are tutor-brand pages, not teaching figures. No equations (`m:oMath` 0), no OLE objects, no other drawings. Header has no text; footer carries the tutor name, subject/term/class and a page field.
- Practical observation/recording sections: none found. Safe-chemical-handling content: none found; agro-chemicals (pesticides, herbicides, fungicides, nematicides, fumigants, fertilizers) are named only as items or roles (e.g. blocks 105, 251, 396, 428, 498) with no doses, rates, mixing or protective-equipment text. Later items must neither invent doses nor imply the source supplies them.

## Structural rule findings (findings only; no rule written)
- `split_before`: not needed on the evidence — all ten labels are line-start paragraphs beginning `WEEK <n>`. Hazards for the unrun parser: block 143 is `WEEK 2DATE…` (no space); `WEEKEND ASSIGNMENT` lines (blocks 126, 174, 305, 412, 452, 518, 604, 707, 790, 852, 920) also begin with `WEEK`, and scheme header block 11 is `WEEK  TOPIC`. Whether the importer mis-splits on these is **unverified**.
- `attach_stranded_label`: no stranded label observed; each label shares its paragraph with its DATE field.
- `classify_marker`: scheme blocks 22 (REVISION) and 23 (EXAMINATION) are the only marker lines; they sit in preamble material with no body (SCHEME_ONLY candidates). Per-week `GENERAL EVALUATION/REVISION QUESTIONS` headings are inside lesson bodies and must not be classified as revision markers.

## Observed content issues (for the AG-WK items; source text not altered)
- Week 8: scheme topic is Agricultural Laws and Reforms but the body covers land tenure only; empty `EVALUATION` (blocks 643-645).
- Week 9: Evaluation 4-5 (farmstead, blocks 785-786) and WK 9A forestry items (791-801) have no teaching blocks in the week; reading assignments point to pasture/forage and a different chapter.
- Week 4 Weekend Q2 (pest control, block 414) and Week 6 cereals questions (490, 511) test material taught elsewhere or not at all; Week 10 Theory 2 (block 931) asks for a table the source lacks.
- Fact checks needed before any lesson: block 549 (`Land is mobile…`), blocks 878-879 (biennial/perennial definitions), General Evaluation branch counts (blocks 117, 140 vs eleven listed).

## Edits
- `QUEUE.json`: AG-INV-T1 → `IMPLEMENTED_TESTING_DEFERRED`; 16 PENDING items appended (AG-PRE-T1; AG-MARK-T1-REVISION, AG-MARK-T1-EXAM; AG-WK-T1-W01..W10; AG-VIS-T1-TBL-W02, AG-VIS-T1-TBL-W06, AG-VIS-T1-BRANDING), each depending on AG-INV-T1 and AG-SRC-T1; counts and `next_runnable` recomputed; one note appended. No existing ID or item otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.

## Remaining
Alias approval (`AGRICULTURAL-SCIENCE-ALIAS-APPROVAL`) is still an owner open item. 2nd and 3rd Term inventories (AG-INV-T2, AG-INV-T3) are unread. Next eligible: `AG-WK-T1-W09` (heaviest uncovered-objective risk); then the remaining AG-WK, AG-PRE, AG-MARK and AG-VIS items, which share one package file and should run sequentially. This does not claim the subject or class complete.
