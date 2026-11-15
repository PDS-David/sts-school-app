# CHEM-VIS-T1B-W02-TABLES — table disposition

Status: **BLOCKED** (table structure indexed; original archive needed to calculate object hashes and inspect full cell contents).

## Source
- Member `SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx`, SHA-256 `0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a`.
- Week Two raw-text range lines 729-1346; SHA-256 `7bf6ab74ead834c12c50830bc00f89df57cfa5e5d1610f1feaac029ac33f3d3c`.
- Locator method: Mammoth 1.12.2 `extractRawText`; 1-based line numbers.

## Table register
| Object | Line/block locator | Shape | Disposition |
|---|---|---|---|
| Chemical properties definition box | line 1005 / nested table at body block 469 | 1×2 | Teaching text; retain the two-cell grouping. |
| “Physical and Chemical Properties” banner | line 1007 / body block 473 | 1×1 | Heading/layout object, not a data table. |
| Physical properties definition box | line 1009 / body block 475 | 2×2 | Teaching text; preserve row/cell relationships. |
| Change-of-state table | line 1031 / body block 492 | 7×3 | Teaching data: Start from, Change to, Name; rows include melting, freezing and gas transitions. |
| Empty layout table | line 1117 / body block 527 | 2×2 | No teaching cells; contains the 1×1 spacer `image51.gif`. Classify as layout/non-content. |

## Flattening and integrity
A cell-per-line text extraction loses row/column pairing and can make definitions, labels and change-of-state entries appear as unrelated paragraphs. Preserve the table dimensions and cell order. The inventory does not provide a hash for each individual table or image object. No per-object hash is invented.

## Required recovery
The task's expected composite ZIP is `SSS 1-20260507T072431Z-3-001.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`. The current inventory binds the member hash but does not provide per-table object hashes. Reopen the exact source archive, hash each object/cell XML as specified by the task, and visually compare the full tables before changing status.

No table or source text is changed; no approval is claimed.
