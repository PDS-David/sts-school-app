# TD-VIS-W03 — Week Three figure-by-figure visual disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All 19 DrawingML placements were inspected; they resolve to 18 unique source image parts. Eighteen unique figures are assigned bind-as-asset dispositions. One image part is reused at two placements and therefore receives one derivative task. No app/display verification is claimed.

## Source and method

- Source: `SS1-SRC-af4868d2c026`; registered DOCX member SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` (recomputed and matched).
- Week Three teaching row: parsed row 13; `word/document.xml` body children [336, 697); PDF pages 9–18.
- Source lesson ID: `SS1-SRC-af4868d2c026:BODY:032f7d5dee7e629db1c14d2cec1893d434e3e315aced4f243197b4f8d61223cf`.
- Inspected all 19 DrawingML placements and opened all 18 unique PNG/JPEG parts. The 54-page PDF contact sheet and individual previews were used to identify the diagrams; neighbouring source paragraphs were checked for construction purpose.
- Original source bytes and rendered previews remain outside Git. Hashes below refer to the original embedded media parts.

## Figure inventory and disposition

| Figure | XML body child(s) / source part | Observed visual content | Original media SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | 344 / `word/media/image18.png` | Four reference examples distinguishing regular polygons, an equilateral triangle, a re-entrant polygon and an irregular polygon. | `81a93f47e12c2b0b861d4ae3ee57a50fbedf43e045a46eb406aaa26fc03476b3` | Bind a faithful derivative. |
| F02 | 369 / `word/media/image19.png` | Regular pentagon construction by the exterior-angle method, with 72-degree turns and labelled vertices. | `b9a45ad0d646d55d8bd82b895c66bb7d7bf484a9e9e72dcc4f4905cdcb9bae99` | Bind a faithful derivative. |
| F03 | 391 / `word/media/image20.png` | Regular pentagon construction using a circumscribing circle, radius/arc steps and side stepping. | `ead7a669a1db8849bdd7adac42c33f746c001da9951102afee139859d55fb03d` | Bind a faithful derivative. |
| F04 | 410 / `word/media/image21.jpeg` | Regular hexagon construction from a given side using 60-degree exterior turns. | `ab1fc1e6b47ac19b1f269e184a8a3d042fe2395c1007b514750c543d242a262c` | Bind a faithful derivative. |
| F05 | 425 / `word/media/image22.png` | Regular hexagon constructed in a circumscribing circle from the distance across opposite corners. | `d65a7f0b94ba65c5790958254e1aa85418bc13dae95a0333a97ec652702e7ba0` | Bind a faithful derivative. |
| F06 | 441 / `word/media/image23.png` | Regular octagon construction from a given side using 45-degree exterior angles. | `40b48774051f958859a6075d29b68455b70e952beac4358f347bb769e3de8548` | Bind a faithful derivative. |
| F07 | 463 / `word/media/image24.png` | Two-part construction illustration for a regular octagon using a circumscribing circle and distance across flats. | `56a3af13cfbb7e74bde23c1e66bbd8110e71e6f464d26b0ee359a52a7a8fa0a5` | Bind a faithful derivative. |
| F08 | 482 / `word/media/image25.png` | Regular octagon constructed by bisecting four quadrants of a circle whose diameter is the distance across corners. | `f07d1742224d7e4d656eab9b7633ffc866fcc58fd21367836e5b54f9f39ed694` | Bind a faithful derivative. |
| F09 | 499 / `word/media/image26.png` | General construction of a regular pentagon from given diagonals using a semicircle, divisions and bisectors. | `8ddc23ea5c6e7c76dab1682b7de6924ba990e659936beb913041a88c8e5ade1e` | Bind a faithful derivative. |
| F10 | 530 / `word/media/image27.png` | Regular heptagon construction from the distance across corners, with a divided diameter and stepped-off side. | `d9bbba08c416b0ee7f1bbfa33643e5209149a7d6206b83cc32f0db3a7c4b5fa3` | Bind a faithful derivative. |
| F11 | 553 / `word/media/image28.png` | General construction of a polygon when one side length is given, using a semicircle, trial divisions and a circumscribing circle. | `d3d0bce0dbe7f9ff0ffec131e7f69b1d5ec4473b3746708628a403b4d930ffb4` | Bind a faithful derivative. |
| F12 | 575 / `word/media/image29.png` | Two-triangle method for locating circle centres for regular polygons of different side counts on a common base. | `7a2603253023ab26d7d0de31721fba3445874394891d0a4a2a9a44f9439e2ea1` | Bind a faithful derivative. |
| F13 | 593, 679 / `word/media/image30.png` | Triangle ABD showing the two pentagon diagonals and the given 30, 60 and 70 length data; reused in the evaluation and theory tasks. | `9b1910a869c34393edd38519e72e2a95a812f71276c87180c87fd2f2a1c8d14e` | Bind a faithful derivative. |
| F14 | 624 / `word/media/image31.jpeg` | Circle-based pentagon construction with stepped divisions, used in the weekend question about the input needed for a general regular-polygon construction. | `06ef7bd560488a4084d03e0580fe2531b4bfe7523e59acea9c23050ea15fcb02` | Bind a faithful derivative. |
| F15 | 640 / `word/media/image32.png` | Overlapping-circle and polygon construction diagram used by the weekend multiple-choice question on the required measurement; preserve all labelled arcs and intersections. | `ea347afc1957819a95cbd310c673e1d102152b4894a0c0d174cdd439c6ef9b25` | Bind a faithful derivative. |
| F16 | 651 / `word/media/image33.jpeg` | Circle and arc construction with a divided baseline, used to identify the type of figure being constructed. | `5238bb7ebda73cf713d3e85e612bc80bd4c4931da3aac04cc3d916c12aeed87b` | Bind a faithful derivative. |
| F17 | 660 / `word/media/image34.jpeg` | Four labelled polygon outlines, including a concave/re-entrant form, for the source classification question. | `45901456b9981c7bb461b6eb6cab39f5d28037a40211483269fe56f59075002a` | Bind a faithful derivative. |
| F18 | 671 / `word/media/image35.png` | Circle/arc construction with numbered divisions and construction marks, used to identify the polygon produced when the method is completed. | `466c03842956ab91f74db23c92b8b5e228ffabd7292773de2cc5684cd38cdba0` | Bind a faithful derivative. |

The 19 placements resolve to 18 unique media parts because `word/media/image30.png` is reused at body children 593 and 679. The image is one triangle ABD carrying the stated 30, 60 and 70 lengths for the pentagon-diagonal construction; one faithful derivative serves both uses. Image F07 is a composite illustration with two octagon-construction subfigures and must remain a single composite unless a later layout decision explicitly splits it without losing the original relationship.

## Additional notation and source observations

- Two OMML objects occur in this row. Their exact equation/angle content is not replaced or inferred by this visual inventory; the separate `TD-FACT-W03-NOTATION` task remains responsible for notation recovery.
- The source describes both exterior-angle and circumscribing-circle construction methods, including pentagon, hexagon, octagon and heptagon examples, a general diagonal method, a general given-side method and the two-triangle method.
- Several evaluation figures are assessment-bearing. Their answer choices are not resolved here; the asset derivatives must preserve the figure exactly enough for the learner to interpret the question without giving away an answer.

## Queue follow-ups

Eighteen bounded ASSET tasks have been appended: `TD-ASSET-W03-F01` through `TD-ASSET-W03-F18`. Each names the exact source part, original SHA-256, XML locator, visual purpose and unique SVG output path. F13 covers the two repeated placements. The tasks require faithful geometry, construction marks and labels, verified provenance, derivative hash/byte count and useful alt text; no dimensions or answers may be invented.

## Checks and limits

- Recomputed the registered DOCX member SHA-256 and each of the 18 unique media-part SHA-256 values.
- Confirmed 19 DrawingML placements, 18 unique media parts, and the duplicate placement of image30.
- Visually inspected all 18 unique media previews and checked surrounding source text.
- Did not create SVG derivatives, bind package assets, resolve the two OMML objects, run the subject schema/tests/compiler/importer, or verify app display. Those remain outstanding.
- No approval, certification or deployment is claimed.
