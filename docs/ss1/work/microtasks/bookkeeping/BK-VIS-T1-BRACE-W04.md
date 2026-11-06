# BK-VIS-T1-BRACE-W04 — Bookkeeping, 1st Term, Week 4 right brace disposition

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 4 is **not delivered**; this task adds no lesson, asset, rule or coverage row.

## Inputs
- Base: `origin/master` `0a3680d`. Prerequisites `BK-INV-T1` and `BK-SRC-T1` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-62b02f2adcb3`, member `SSS 1/1st Term SS1_/book keeping.docx`, 38,275 bytes, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`, **re-verified from the supplied member**. Nothing from it is committed.
- Locator model unchanged from BK-INV-T1: blocks are direct children of `w:body` in `word/document.xml`, 0-based; block text concatenates `w:t` runs with tabs omitted; range hash is SHA-256 of block texts joined with `\n`. Week 4 range blocks 158-219 reproduced: `02636ad0bc25b5fc42757c9dba5ea99c2f6b483301d7b5c5f72b478c8b5d86e7`.

## What the drawing is
| Item | Value |
|---|---|
| Block | 170, empty text (SHA-256 of the empty string, 0 characters) |
| Shape | `Right Brace 1` (`wp:docPr` id 1; VML type `#_x0000_t88`; DrawingML preset `rightBrace`) |
| Size | 90805 x 542290 EMU = 7.15pt x 42.7pt |
| Placement | `wrapNone`; 158.05pt from the column edge, 19.7pt below the top of block 170 |
| Content | no text box, no `w:t`, no data, scale, angle or measurement |
| Neighbours | block 171 `a.` tab `Dr. Receiving account` tab `With value it receives`; block 172 `b.` tab `Cr. Giving account` two tabs `With value it gives out.` |

It is the eighth and last VML object in the member (BK-INV-T1). No image part, OLE object or equation exists.

## Disposition
- **Excluded from delivered lessons.** The brace is decorative and holds no teaching geometry, so no asset is created and nothing from the drawing is committed.
- **What it adds:** a visual tie between the two receiving/giving lines. By its coordinates it sits between each account name and its value phrase. This reading is taken from stored geometry, **not from a rendered page**; no app or display check is claimed.
- **Does the text keep its structure?** Yes for the pairing a./b., Dr./Cr. and receiving/giving. Omitting the brace loses no wording. The tab separator between the account name and its value phrase is not carried by the extracted text (Dr. line one tab, Cr. line two tabs), so the lines read as run-ons. This is already defect 2 in `BOOKKEEPING-T1-W04-SOURCE-DEFECTS`.
- **Residual gap:** none new. The lesson item `BK-LES-T1-W04-DOUBLE-ENTRY` must restate the pairing as its own text and must not copy the uncorrected run-on. No open item or task is appended.

## Package change
`backend/src/db/ss1/subjects/bookkeeping.json`: one evidence entry appended to `COV-BK-T1-W04-TWO-ACCOUNTS`. Status stays PARTIAL; `lesson_ids` stays empty. Coverage 40, open items 27, lessons 0, assets 0, source rules 3 unchanged.

## Correction to a prior record
`BK-WK-T1-W04.md` states that Week 4 carries no drawing. Block 170 lies inside Week 4 (blocks 158-219) and holds this brace, as BK-INV-T1 recorded. That note is outside this task's allowed paths and is left unchanged; the correction is recorded here and in the queue.

## Queue
`BK-VIS-T1-BRACE-W04` -> `IMPLEMENTED_TESTING_DEFERRED`. Status counts 11 implemented / 28 pending / 6 blocked; items 45 unchanged; kind counts unchanged; removed from `next_runnable` (head `BK-MARK-T1-REVISION`); one note appended. `BK-VIS-T2-BRACE-W04` (2nd Term, block 171) is a separate item and is untouched.

## Checks performed
- Member SHA-256 and byte size; block 170-172 XML read in the original (no text box, no `w:t`); Week 4 range hash; JSON syntax and byte-stable re-serialisation; queue status counts recomputed from items; no new IDs.
- Deferred by owner: full tests, type checks, importer/capture, DB scripts, device/display rendering and teacher approval. Not run.
