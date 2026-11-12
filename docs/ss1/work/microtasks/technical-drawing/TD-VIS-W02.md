# TD-VIS-W02 — Week Two figure-by-figure visual disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All 11 placements were inspected; they resolve to nine unique source PNG parts. Nine unique figures are assigned bind-as-asset dispositions. Duplicate placements reuse the same source part and therefore share one derivative task. No app/display verification is claimed.

## Source and method

- Source: `SS1-SRC-af4868d2c026`; registered DOCX member SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` (recomputed and matched).
- Week Two teaching row: parsed row 12; `word/document.xml` body children [163, 336); PDF pages 4–8.
- Inspected all 11 DrawingML placements in order, opened each of the nine unique PNG parts, and checked surrounding text in the source row. Original source bytes and rendered previews remain outside Git.
- All nine unique parts are PNG. No OLE object or OMML object occurs in this row.

## Figure inventory and disposition

| Figure | XML body child(s) / source part | Source context and observed geometry | Original PNG SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | 171, 297 / `word/media/image9.png` | Example 1 and weekend-assignment reuse: escribed circle on triangle ABC, with extended sides/exterior-angle bisectors locating the centre O. The same source part is placed twice. | `b587f0b199329dd91d1391e57685c86f3c707a93a23458673c95e6f98f159dc8` | Bind one faithful derivative and reuse it at both placements. |
| F02 | 182 / `word/media/image10.png` | Example 2: polygon with escribed circles on its sides; shows external-angle bisectors, centres and perpendicular radii. | `8e198997c189ce24285cb9a46c4d477ac3468b08aba6e759e797e0761ef966d3` | Bind a faithful derivative; required for the polygon construction. |
| F03 | 215 / `word/media/image11.png` | Example 1 under “Drawing of circles to pass through given points”: circle through A and R, tangent to line P–R–Q at R, centre O. | `932e77b6ec4e1a4509f35bc5b96dd3ee3e0a8867d694da421852a482d7becff4` | Bind a faithful derivative; required for the point-and-line tangency construction. |
| F04 | 234 / `word/media/image12.png` | Example 2: circle through two given points F and G, tangent to line CD; includes the auxiliary semicircle and construction lines. | `578b1afbae4eef28bd2e5dcac24868fad1ce909deb4f90f7bf0f3c8bf3da29c2` | Bind a faithful derivative; required for the two-point tangency construction. |
| F05 | 252, 326 / `word/media/image13.png` | Evaluation/theory task reused twice: line AB with point Q and external point P; used to construct a circle through P touching AB at Q. | `6b059a066c4199bff0ad68933f53b995be27d194a31f6dec962429f5b2774dba` | Bind one faithful derivative and reuse it at both placements. |
| F06 | 266 / `word/media/image14.png` | Evaluation task: given line AC and points P and B; construct a circle through P and B that touches AC. | `892b14f000dbfbd77af8cb900213912d73129d6254b62ca9c2fb5629e2c82094` | Bind a faithful derivative; required for the source construction question. |
| F07 | 277 / `word/media/image15.png` | General evaluation: circle of stated diameter 40 and external point S; construct a tangent from S to the circle. | `9184757ddfba498fbb8b63c7eeb8ae0df50a6b67fd0d45e5a7e040561aee07e5` | Bind a faithful derivative; required for the tangent construction exercise. |
| F08 | 306 / `word/media/image16.png` | Weekend-assignment classification figure: a circle tangent to the sides/lines of a triangular construction; multiple-choice options distinguish circumscribed/escribed circle or triangle. No answer is assigned in this inventory. | `e24fbc50d442d05d97a5d4d0bf9421a01b9cbf4cb3f1c6a80c910325374aad55` | Bind a faithful derivative; required to answer the classification question. |
| F09 | 315 / `word/media/image17.png` | Weekend-assignment question: circle with diameter AB and inscribed triangle ABC; the learner identifies the triangle type. | `5d05f031522d62230fe2e69c365852bd702b39df170c2c382ee4a7ee43a0930d` | Bind a faithful derivative; required for the diameter/triangle question. |

The 11 DrawingML placements resolve to nine unique media parts: `image9.png` and `image13.png` are each reused once. All nine unique figures are instructional or assessment-bearing; none is excluded.

## Queue follow-ups

Nine bounded ASSET tasks have been appended: `TD-ASSET-W02-F01` through `TD-ASSET-W02-F09`. Each task names the exact source part, source-part SHA-256, XML locator, learner-facing purpose and unique SVG asset path. F01 and F05 explicitly cover their two source placements. Tasks require faithful geometry and labels, source/derivative hashes, byte count, alt text and provenance; they prohibit invented dimensions and committing extracted original PNGs.

## Checks and limits

- Recomputed the registered DOCX member SHA-256 and each of the nine unique embedded PNG-part SHA-256 values.
- Confirmed 11 DrawingML placements in the Week Two body-child range, 9 unique PNG parts, and two repeated placements.
- Visually inspected all nine unique PNG previews and matched them to surrounding source text.
- Did not create derivative SVGs, bind package assets, run subject schema/tests/compiler/importer, or verify app display. Those remain outstanding.
- No approval, certification or deployment is claimed.
