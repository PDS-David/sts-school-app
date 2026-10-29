# YO-VIS-T1-03 — Yoruba, 1st Term, the eight Word tables

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. All eight tables are mapped to their weeks, their structure is captured from `word/document.xml`, and every one is content-bearing; the disposition is **render each table as a table in the lesson, under the per-table rule below**. No render is committed and no asset is created.

## Inputs
- Base: `ss1/yo-vis-t1-02` at `a6872ad` (PR #206, merged into `ss1/yo-vis-t1-01` on 2026-10-29), stacked on #199–#206. Only #199 is on master (`9f745bb`); the rest of the chain is merged into its predecessor branch and the train tip remains `ss1/yo-vis-t1-02`, which this PR targets. It merges after the chain.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`, re-verified from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` plus a depth-aware walk of `word/document.xml` over every top-level `w:tbl`, reading `w:tblGrid`/`w:gridCol`, `w:tr`, `w:tc`, `w:gridSpan`, `w:vMerge`, `w:tblHeader` and the `w:p` count inside each cell. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run; nothing was rendered.

## Inventory and week map
The document holds exactly eight `w:tbl` start tags, all direct children of `w:body`, so none is nested. Weeks 2, 3, 5 and 8 contain no table; Week 3's EDE strand is the ATE FAWELI drawing disposed of in `YO-VIS-T1-01`.

| Table | Week | Section anchor | w:tbl body lines | Grid (columns × twips) | Rows | Cells | Paragraphs | Empty cells | Header row |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | `OSE KIN-IN-NI` at 61; heading "Ikini akoko / igba." at 117 | 121–165 | 3 × 753/2373/2484 | 8 | 24 | 24 | 1 | blank · `IGBA / AKOKO` · `IKINI` |
| 2 | 1 | caption "Ikini akoko Ise" at 169 | 173–233 | 4 × 918/1638/3330/1800 | 8 | 32 | 32 | 1 | blank · `ISE` · `IKINI` · `IDAHUN` |
| 3 | 4 | `OSE KERIN` at 725; heading "Alaye lori ibi isenupe" at 747 | 749–801 | 3 × 1818/1800/5400 | 9 | 27 | 27 | 0 | `IBI ISENUPE` · `KONSONANTI TI A PE` · `ISESI AFIPE` |
| 4 | 4 | heading "Alaye lori ona isenupe" at 813 | 815–861 | 3 × 1908/2970/2820 | 8 | 24 | 24 | 0 | `ONA ISENUPE` · `KONSONANTI TI A PE` · `IRU IDIWO TI AFIPE SE FUN EEMI` |
| 5 | 4 | heading "Alaye ni kikun" at 867 | 871–885 | 3 × 2678/2811/2673 | 3 | 9 | 9 | 1 | blank · `IRO KONSONANTI` · `ALAYE` |
| 6 | 4 | caption "ATE IRO KONSONANTI" at 889 | 891–1079 | 10 × 1260/1087/810/935/720/970/705/810/990/1080 | 9 | 90 | 96 | 48 | manner · voicing · eight place columns |
| 7 | 6 | `OSE KEFA` at 1285; lead-in "Apeere apa silebu ni wonyi;" at 1301 | 1303–1389 | 4 × 2000/2610/1543/1260 | 5 | 20 | 38 | 0 | `APA` · `ALEYE` · `APEERE ORO` · `APA` |
| 8 | 7 | `OSE KEJE` at 1503; lead-in at 1511 | 1513–1639 | 3 × 1458/1800/1710 | 6 | 18 | 63 | 1 | `SIPELI ATIJO` · `SIPELI TUNTUN` · `IFIYESI` |

Totals: 8 tables, 56 rows, 244 cells, 313 cell paragraphs. The queue's 56 rows and 244 cells are reproduced exactly.

Block hashes (SHA-256 over the stated `w:tbl` body lines, edge blanks trimmed):

| Table | Block SHA-256 |
|---|---|
| 1 | `1f0eda29b8072c0e8c4252416b496f8ac68a60411ca83f42d3583663fb670d46` |
| 2 | `e15985eb6b3f709ab6d59f6f159c3d0e949fd582e51dd80c619953201ff29bba` |
| 3 | `3dde3ebd92cc0bf6a9b290578d62847976a988447867920975f07bf4cc109f2e` |
| 4 | `6df126d2c82c850456367249c7160375029c03d1dc495404d919b44a0c256c8f` |
| 5 | `f566899a4290f09b40ab85fd9f992bda8bc664f1c3c56d798c6e8662250eea30` |
| 6 | `c288585298c0c273b120deb0dcac13f6c94970f5e546abec3a89a6048584ddaf` |
| 7 | `753a9d0315c4df2fb8ae3e702623fd2ddb9aabb6e4fceb3d4808dbc19e136c7d` |
| 8 | `fba577d1a6d77517c9656182643e563707ae35fa61826015bcaa65f47abadb83` |

## What the XML shows
- Every row carries the full column count (row cell counts are uniform 3, 4, 3, 3, 3, 10, 4 and 3), and there is no `w:gridSpan`, no `w:vMerge` and no `w:tblHeader` anywhere. No cell is merged and no header repeats across pages; visual grouping rests on position and blank cells alone.
- Tables 6, 7 and 8 stack several paragraphs inside single cells: 96 paragraphs in 90 cells, 38 in 20 and 63 in 18. Six cells of table 6, ten of table 7 and eleven of table 8 hold more than one paragraph.
- Empty cells: 48 in table 6, and one each in tables 1, 2, 5 and 8. In table 6 a blank means "no consonant at this manner-by-place intersection"; elsewhere it is an unused corner or a note cell with no text.
- `extractRawText` emits every cell paragraph as its own line, separated by blank lines, so the tables do not survive as structures in text. Table 1's header arrives as line 121 after its heading at 117 and its cells as 24 separate lines; table 6's 90 cells arrive as 48 non-blank lines in row-major order with no column membership; table 8's 18 cells arrive as 63 lines. A reader of the extract cannot recover any cell's row or column.

## Content-bearing verdict
All eight are content-bearing; none is a layout-only table.

- **Tables 1 and 2** (Week 1 ASA) pair a time of day, or an occupation, with the greeting used and, in table 2, the expected response. The three-way or two-way row association is the content.
- **Tables 3, 4 and 5** (Week 4 EDE) pair a consonant class with its members and its articulation description. The class-to-members association is the content.
- **Table 6** (Week 4 EDE) is a classification matrix: seven manner rows by eight place columns, with two label columns. The meaning of a consonant is its position in the grid.
- **Table 7** (Week 6 EDE) pairs each of the four syllable parts with its explanation, example words and example sounds.
- **Table 8** (Week 7 EDE) pairs each old spelling with its new spelling and a note, and supplies the rows used by `YO-T1-W07-EDE-02` to `EDE-06`.

## Representation rule for lessons
Recorded on `YORUBA-T1-TABLES` and on the eight affected objectives.

- Render each table as a table: the header row above its columns and one row per source row. Keep the header text as printed; do not invent a heading for a blank corner.
- Keep a blank cell blank. It means "no value", not "same as the cell above" and not "look in the prose".
- Keep a multi-paragraph cell on separate lines in the same order. Do not join stacked forms, and do not align examples with sounds by counting lines in the extract.
- Do not fill a gap from the prose and do not reorder rows. Defects stay visible until their `YO-FACT` decision; they are not repaired silently.
- Table 1: 3 columns, blank corner preserved. Table 2: 4 columns, blank corner and the `IDAHUN` response column preserved.
- Tables 3, 4 and 5: 3 columns, the consonant list kept in its own column.
- Table 6: 10 columns, the two label columns plus the eight place columns, with all 48 blanks preserved. This table may not be written as prose, a flat list or a two-column glossary.
- Table 7: 4 columns, the stacked example and sound cells kept as aligned sub-lines.
- Table 8: 3 columns with the old and new forms aligned pair by pair; the fifth row's seven old forms are not paired positionally with its eight new forms, and its empty note cell stays empty.

## Source defects already on record
This note adds no new defect wording; it cross-references what the week items already hold.

- `YORUBA-T1-W01-SOURCE-DEFECTS`: mixed-case time numerals (table 1); the table 2 numerals run I to Viii and skip Vii.
- `YORUBA-T1-W04-SOURCE-DEFECTS`: garbled glosses and the `B, m` / `J,s` tokens in table 3; capital I for l, J against table 6's Dz and a truncated gloss in table 4; b and g missing and s doubled in table 5; P and Y missing, `Akinyun`, `II` for l, split place headers and the absence of merged cells in table 6.
- `YORUBA-T1-W06-VISUALS`: table 7's fourth header repeats the first column's label.
- `YORUBA-T1-W07-SOURCE-DEFECTS`: table 8's `IFIYESI` column is filled in only four of five rows, stacked forms run together in extraction, `Ebute-Meta` is repeated unchanged, and the fifth row pairs eight new forms with seven old ones.

## Decision
- **Represent as tables in the lessons.** These are Word tables, not drawings; the lesson authors the grid from the XML-backed structure recorded here and does not reproduce, screenshot or imitate a page render.
- **Recreate as a figure/asset** rejected: an image of a table is worse than a table and would commit a render. **Reference** rejected: the source is not published and the content is in the document. **Omit** rejected: the row and column association is the teaching content and the extract loses it.
- No asset file is created, no render is committed and no table text is copied into Git; only header tokens are quoted.
- No schema or compiler change is needed: the rule lives in the open item, which the lesson items read.

## Package and queue changes
- One evidence entry appended to each of `YO-T1-W01-ASA-02`, `YO-T1-W01-ASA-03`, `YO-T1-W04-EDE-02`, `YO-T1-W04-EDE-03`, `YO-T1-W04-EDE-04`, `YO-T1-W04-EDE-05`, `YO-T1-W06-EDE-02` and `YO-T1-W07-EDE-02`: locator with the block hash, the XML structure and the representation instruction.
- New open item `YORUBA-T1-TABLES` (VERIFICATION, `blocks_delivery` true, the same eight objectives), inserted after `YORUBA-OBJECTIVE-INDEXING`; open items 47 → 48.
- `YO-VIS-T1-03` → `IMPLEMENTED_TESTING_DEFERRED` with the corrected anchors and the week map.
- Counts: 80 items unchanged; status 18 implemented / 53 pending / 9 blocked; `next_runnable` → `YO-FND-T1-01`.

## Limits
- Structure is read from XML only; no page render was produced or inspected, so pagination, row heights, borders and on-screen alignment are not confirmed, and the disposition does not depend on them.
- The existing Week 4 open item describes table 6 with the caption line included (889–1079, hash `65d31d3c…`); this note records the `w:tbl` body alone (891–1079). The two are consistent and neither is rewritten here.
- Table cell text is not reproduced beyond short header tokens; the full content stays in the private extract and the source document.
- Indexing and disposition only: no lesson authored, no asset, no delivery change, no schema or compiler edit, no parser/importer run, nothing displayed in the app.
- Not approved and not verified.
