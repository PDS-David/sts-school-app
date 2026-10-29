# TD-SCH-W02 — Technical Drawing, 2nd Term Week 2 scheme row

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `4159336c7068d2235209221f5f14adc4986acec5` (origin/master, fetched). Prerequisites `TD-SRC-T2` and `TD-PRE-T2` are `IMPLEMENTED_TESTING_DEFERRED` on master; `TD-SCH-W01` is implemented. No open PR owned TD-SCH-W02.
- Source `SS1-SRC-af4868d2c026`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`.
- Member SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` **re-verified this run** (2,865,886 bytes) from the supplied archive. The archive `SSS 1-20260507T072431Z-3-001 (1).zip` was hashed this run: 35,828,550 bytes, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, matching the prompt.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call); `word/document.xml` inspected for runs, drawings and text boxes. Line numbers are 1-based lines of `extractRawText().split('\n')` (60,458 characters, 4,199 lines). Importer, compiler and parser were not run; parsed-row identities come from `SS1-03/evidence/parsed_rows.json`.

## Row 1 hash accounting
- Parsed row 1, label `WEEK 2`, is line 13 in full: `WEEK 2` + 9 spaces + `Escribed circle.`, 31 characters. SHA-256 of line 13 `e3b8e93efcf30567d0a6e891a8d4de2815581d457109a5ad5221636a3f7f71d4` equals the recorded body hash. Row ID `SS1-SRC-af4868d2c026:BODY:e3b8e93efcf30567d0a6e891a8d4de2815581d457109a5ad5221636a3f7f71d4`. Line 13 starts at character offset 184; parsed row 1 `len` is 31 and `eqTitleMatch` is true in parsed_rows.json.
- The objective as written is `Escribed circle.` (noun in the singular, with the source's full stop). It is scheme-table text only; it carries no teaching body.

## Teaching row that covers it
- Parsed row 12, `WEEK TWO`, heading line 343 (`WEEK TWO` + spaces + `DATE:……`), title line 345 `Escribed circles`; the row runs to line 710 (line 711 is the `WEEK THREE` heading). Trimmed body SHA-256 `04066d5e7502b3a90b291d9c0053dfc81a77f9a8579dcbe516add089052f4ffd` (equals the recorded row hash; 4,668 characters). Row ID `SS1-SRC-af4868d2c026:BODY:04066d5e7502b3a90b291d9c0053dfc81a77f9a8579dcbe516add089052f4ffd`.
- The scheme's singular `Escribed circle.` becomes the row's plural title `Escribed circles`, and the row teaches two content objectives, the first being that topic.

| Part of the row | Content | Lines | SHA-256 (lines joined with `\n`) |
|---|---|---|---|
| Heading / title | `WEEK TWO` heading; title `Escribed circles` | 343; 345 | `198d2f91f9cc3b8cba7ff7edc16f9870838e79826cc020c61317004ed1f33bcf`; `2d224c4f10713286cfc54bf3def60377fdcb05839e9a844c8c0e8e49dac1639c` |
| Content list | (i) Escribed circles. (ii) Drawing of circles to touch some given points. | 349–353 | `130eeb0436a70f1bf540374a8125a018cc57f7332a0de5cb2166fb367348aa57` |
| Example 1 | `To escribe a circle on a given triangle.` — extend two sides, bisect the two exterior angles, perpendicular from O to a side, draw with radius OQ | 357–377 | `5f145f8fe7c3d70aa72ffbfe7711ec0d726fb0cac8f095a6e85249987cebd678` |
| Example 2 | `To escribecircles on a given polygon.` — join opposite corners, bisect external angles, perpendicular to a side, repeat per side | 383–429 | `13526c4250fc302e6d6cc05aa901153d1a86b7bc8fbb45969553f1b66ac263dc` |
| Evaluation (first set) | escribe a circle on a 55–60–50 mm triangle; describe circles about a 50 mm hexagon | 433–437 | `cdb409d8f412002de4906a870478d776ecf9a46d7c799258cd95bbb5c5228eff` |
| Second objective, worked constructions | circle through a given point touching a line at that point (Example 1); circle through two given points touching a given line (Example 2) | 447–521 | `c571ceaf507500bd802ecb00c7a3062112f0250a5ef3d1b7271de70e732c8598` |
| Second evaluation / general revision | two practice constructions; general revision questions (one is Week 1 revision: inscribed circles in an equilateral triangle) | 527–603 | `f684828a4f175603909e94380d04b5b9a7898c92f4b498d072d32b4ba3f95827` |
| Reading assignment | `Technical drawing by JN Green. Pages 21, 73-75.` | 613–615 | `82226d167c527080cdba65712b66aa3d60b1405b48a7cf955b05457b97a16e73` |
| Weekend assignment | objective questions and two theory constructions | 619–705 | `500dc397e649cbc25d45fa922fdfbc44f09cc84bb4439ea5e2c8ce9c0ce4d60e` |
| Whole row body | trimmed from `WEEK TWO` (line 343) to before `WEEK THREE` (line 711) | 343–710 | `04066d5e7502b3a90b291d9c0053dfc81a77f9a8579dcbe516add089052f4ffd` |

## Classification and anchor uniqueness
- Rule `SS1-SRC-af4868d2c026-R004`: `classify_marker`, kind `SCHEME_ONLY`, anchor `WEEK 2         Escribed circle.` (31 characters).
- Anchor check on the unmodified extracted text: **1 occurrence**. The shorter string `Escribed circle` (no full stop) occurs **4** times — line 13 and three times inside the WEEK TWO teaching row; `Escribed circles` occurs **3** times inside that row. The full 31-character row body is therefore required, and it lies only inside parsed row 1.
- Because the anchor is inside a parsed row, the compiler classifies that row (disposition keyed to the row 1 body ID) as SCHEME_ONLY, unlike the preamble rule R002 whose coverage target is the rule ID. Row 1's body stays in the plan and nothing is discarded. As with TD-SCH-W01, the coverage entry is bound to the teaching row (row 12), not to a second MARKER entry for the scheme row.
- A unique anchor exists, so **no open item was added**.

## Edits
- `technical-drawing.json`: added rule R004 and coverage `COV-TD-T2-SCH-W02` (SUPPORTED, target row 12 body ID, three evidence entries with per-block hashes). Source rules 3 → 4; coverage 2 → 3. The single source, lessons (0), delivery_corrections (0), assets (0), open_items (4) and `package_status` PENDING are unchanged; R001–R003, `COV-TD-T2-TITLE-BLOCK`, `COV-TD-T2-SCH-W01` and the other open items are untouched.
- `QUEUE.json`: TD-SCH-W02 → `IMPLEMENTED_TESTING_DEFERRED`; `status_counts` recomputed to 4 implemented / 30 pending / 5 blocked (total 39); review date `2026-10-29`, reviewed master `4159336c7068d2235209221f5f14adc4986acec5`; `next_runnable` → `TD-SCH-W03`; a note appended.
- `runnable_now` was stale (`["TD-SRC-T2"]`, an item already implemented; TD-SCH-W01 left it untouched). It is now recomputed: `TD-SCH-W03`–`TD-SCH-W11`, `TD-WK-W01`, `TD-WK-W02`, `TD-VIS-INVENTORY`. This is a queue-metadata correction, not a status change.

## Limits of this coverage entry
- SUPPORTED means the extracted row text teaches the objective at topic level. It is not a factual review, answer-key review or delivery certification.
- The construction methods in Examples 1 and 2 are recorded as the row states them. They were **not** checked against the cited textbook (JN Green pages 21, 73-75), which is not supplied; that check belongs to TD-WK-W02 if the owner supplies the book. No textbook pages were copied.
- `Example 2` reads `To escribecircles on a given polygon.` and line 519 reads `thecentre`: both are the .docx's own run text (verified in `word/document.xml`), retained verbatim and not corrected here.
- **Figures:** the row relies on drawings that are not in the text extract — 11 `w:drawing` and 13 `w:pict` anchors inside the WEEK TWO paragraphs (0 OLE objects, 0 `oMath`), with references `as shown above` (line 423) and `as shown below` (lines 557, 583, 603). Routed to `TD-VIS-W02`; nothing was invented.
- **Superscripts:** no superscript run occurs in this row, so no flattened degree-sign defect was found (contrast Week One's `670`/`1050`/`550`/`600` losses recorded in TD-SCH-W01).

## Remaining
- Next in order: `TD-SCH-W03` (scheme week 3, `Polygons`). Other runnable items: TD-SCH-W04–W11, TD-VIS-INVENTORY, TD-WK-W01, TD-WK-W02. Same-file edits should run one at a time.
- Owner: alias approval (`TECHNICAL-DRAWING-ALIAS-APPROVAL`), footer confirmation (`TD-T2-FOOTER-TAGLINE`), reference-row scope (`TD-T2-REFERENCES-IN-ROW-10`), revision scope (`TD-T2-W01-REVISION-SCOPE`).

Checks run: source/member hashes, row and block hashes, JSON syntax, anchor occurrence counts, reference consistency, diff inspection. No importer, compiler, test, typecheck, database or device run — testing deferred by owner.
