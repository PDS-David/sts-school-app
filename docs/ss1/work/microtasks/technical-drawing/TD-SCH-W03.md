# TD-SCH-W03 — Technical Drawing, 2nd Term Week 3 scheme row

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `e60b1fe7ac28c2fd94841cd67a2f3622b42f09f9` (origin/master, fetched 2026-10-30). Prerequisites `TD-SRC-T2` and `TD-PRE-T2` are `IMPLEMENTED_TESTING_DEFERRED` on master; `TD-SCH-W01` and `TD-SCH-W02` are implemented. No open PR owned this task or this subject at the start of the run.
- Source `SS1-SRC-af4868d2c026`, member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`. Member SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` **re-verified this run** (2,865,886 bytes) from the supplied partial archive `2nd_Term_SS1_-20230730T171417Z-001.zip`; the composite archive hash was not checked.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText({path})` (the importer's .docx call), 60,458 characters, 4,199 lines; `word/document.xml` inspected with lxml for drawings, picts, OLE objects, `oMath` and superscript runs. Importer, compiler and parser were not run; parsed-row identities come from `SS1-03/evidence/parsed_rows.json`.

## Row 2 hash accounting
- Parsed row 2, label `WEEK 3`, is line 15 in full: `WEEK 3:Polygons` (colon, no space), 15 characters, starting at character offset 217. SHA-256 of line 15 `889970c0e7531c64896709e01c2ea08cfd39b1061bb2d7d56a18fb9dee3723df` equals the recorded body hash. Row ID `SS1-SRC-af4868d2c026:BODY:889970c0e7531c64896709e01c2ea08cfd39b1061bb2d7d56a18fb9dee3723df`. `eqTitleMatch` is true in parsed_rows.json.
- The objective as written is `Polygons` (the parser title is `:Polygons`). It is scheme-table text only; it carries no teaching body.

## Teaching row that covers it
- Parsed row 13, `WEEK THREE`, heading line 711, topic line 713 `Topic:Polygons and irregular figures`; the row runs to line 1472 (line 1473 is the `WEEK FOUR` heading). Trimmed body SHA-256 `032f7d5dee7e629db1c14d2cec1893d434e3e315aced4f243197b4f8d61223cf` (11,124 characters) equals the recorded row hash, recomputed by slicing. Row ID `SS1-SRC-af4868d2c026:BODY:032f7d5dee7e629db1c14d2cec1893d434e3e315aced4f243197b4f8d61223cf`.

| Part of the row | Content | Lines | SHA-256 (lines joined with `\n`) |
|---|---|---|---|
| Heading / topic | `WEEK THREE` heading; `Topic:Polygons and irregular figures` | 711; 713 | `01124b928afab576495fc27f07d6c5983fd39de96fc4f03eda20c702d4d11040`; `2b5f8f71a7d9fd5de9da35aef836dc506d764dfd69ee3dc1fdb897ba51b81c15` |
| Content list | (i) Meaning and types of polygon. (ii) Construction of polygons. | 715-719 | `babfad933f68e6e6cc8b8cf4b09a548a6e3faab770a6bf5b367665e3d01582db` |
| Meaning and types | definition and naming by number of sides | 721-759 | `9ac372c80f2eb281c682d97ba3bc28d55d92fcfbb0c4b617f2e7e3e37618c9fd` |
| First evaluation | define a polygon; state three types | 761-769 | `d25dab43d6dfa5ec36cadf9d14e5dcc54266339d9290c5b8be776e8013c46b92` |
| Construction of polygons | worked methods (pentagon, hexagon, octagon and others) | 771-1113 | `5d953fe6400d9faaceddf9798228e263ac13b93a260ec90670f2152a37c037ba` |
| General methods | general methods; two-triangle method on a given base | 1115-1249 | `95c6aad99574812929f81bbea03181a3f4fa3cbe434b62fb61ce2c758b9fda36` |
| Second evaluation | evaluation questions | 1251-1293 | `e092a11d7d7997a0d654ca51cd00a96dc1fe810c30d3876d6180ee561261ceed` |
| General evaluation | general evaluation / revisional questions | 1295-1307 | `35c98c91f9d061e32659106444f452c23fb90397122e7b9dd99656d54310e197` |
| Reading assignment | `Technical drawing by JN Green. Pages 28-33,38,63.` | 1309-1313 | `51e34aa56fec8f2190b29370260a36491fe8e7f8c938401ad4bda765377ca9e2` |
| Weekend assignment | objective questions (from 1319) and two theory questions (from 1431) | 1315-1472 | `ca30eae16051c529bc4992d035669c0b3f1155fcdb0d4376a9b9341fecfbaa44` |

## Classification and anchor uniqueness
- Rule `SS1-SRC-af4868d2c026-R005`: `classify_marker`, kind `SCHEME_ONLY`, anchor `WEEK 3:Polygons` (15 characters).
- Anchor check on the unmodified extracted text: **1 occurrence**, only inside parsed row 2. The shorter string `Polygons` occurs **5** times, so the full row body is required.
- As with TD-SCH-W01 and TD-SCH-W02, the anchor sits inside a parsed row, so the compiler classifies that row SCHEME_ONLY and nothing is discarded; the coverage entry is bound to the teaching row (row 13). A unique anchor exists, so **no open item was added**.

## Edits
- `technical-drawing.json`: added rule R005 and coverage `COV-TD-T2-SCH-W03` (SUPPORTED, target row 13 body ID, three evidence entries with block hashes). Source rules 4 → 5; coverage 3 → 4. Source, lessons, delivery_corrections, assets, open_items and `package_status` PENDING are unchanged.
- `QUEUE.json`: TD-SCH-W03 → `IMPLEMENTED_TESTING_DEFERRED`; `status_counts` recomputed (5 implemented / 29 pending / 5 blocked; total 39); `runnable_now` recomputed; review date and reviewed master updated; `next_runnable` → `TD-SCH-W04`; a note appended.

## Limits of this coverage entry
- SUPPORTED means the extracted row text teaches the objective at topic level. It is not a factual review, answer-key review or delivery certification.
- Construction methods are recorded as the row states them. They were **not** checked against the cited textbook (JN Green, pages 28-33, 38, 63), which is not supplied. No textbook pages were copied.
- **Figures:** the row relies on drawings not in the text extract: 38 `w:drawing` and 21 `w:pict` anchors inside the WEEK THREE paragraphs, 0 OLE objects, 2 `oMath`; the text refers to them as "above" and "below". Routed to `TD-VIS-W03`; nothing was invented.
- **Flattened notation, retained verbatim:** 27 superscript runs occur in the row and degree values read as bare digits (for example `3600` at line 807, `450` at line 963). Line 959 reads `Determine the size of the exterior angle thus: .` where an equation object did not reach the text extract. Not corrected here.

## Remaining
- Next in order: `TD-SCH-W04` (scheme week 4, `Plain scales`). Same-file edits should run one at a time.
- Owner items unchanged: `TECHNICAL-DRAWING-ALIAS-APPROVAL`, `TD-T2-FOOTER-TAGLINE`, `TD-T2-REFERENCES-IN-ROW-10`, `TD-T2-W01-REVISION-SCOPE`.

Checks run: source/member hashes, row and block hashes, JSON syntax and byte-for-byte round trip, anchor occurrence counts, reference consistency, diff inspection. No importer, compiler, test, typecheck, database or device run — testing deferred by owner.
