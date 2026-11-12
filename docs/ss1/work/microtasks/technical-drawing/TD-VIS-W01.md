# TD-VIS-W01 — Week One figure-by-figure visual disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All eight source figures have been inspected individually and assigned a bind-as-asset disposition. The derivative asset tasks are separate and remain pending. No app/display verification is claimed.

## Source and method

- Source: `SS1-SRC-af4868d2c026`, `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`.
- Registered member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`; recomputed from the inspected DOCX and matched.
- Week One teaching row: parsed row 11; `word/document.xml` body children [29, 163); PDF pages 1–3.
- Inspected the eight DrawingML placements in document order, opened each private PNG preview, and checked the neighbouring source paragraph text. Original extracted images and the PDF remain outside Git.
- Figure locators below use zero-based `word/document.xml` body-child indices and exact `word/media/` part names. Hashes are of the original embedded PNG bytes; those bytes are not committed.

## Figure inventory and disposition

| Figure | XML locator / source part | Source context and observed geometry | Original image SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | body child 38; `word/media/image1.png` | “Example 1 — To inscribe a circle in a given triangle.” Triangle ABC with angle-bisector construction meeting at O; perpendicular OD locates the incircle radius. | `402a3e9cc5fb78e084f293073cecea0b3583898619dae1811ca3f9d3788009d2` | Bind a faithful derivative; required to teach the incircle construction. |
| F02 | body child 48; `word/media/image2.png` | “To inscribe three equal circles in an equilateral triangle, each circle to touch two sides and two other circles.” Three mutually tangent equal circles packed within an equilateral triangle, with construction centres and perpendiculars. | `3208e6f4e1e99345a0314ff8eb2e6213068f6e2c43e66a10edf81034ccbc7402` | Bind a faithful derivative; required for the three-circle construction. |
| F03 | body child 65; `word/media/image3.png` | “To inscribe a circle in any sector.” Sector boundary/arc, tangent construction and an inscribed circle with centre O. | `d8b99726c444a2a4f5ddd37a257063fd14ba3d7fc6355f160d8c47ea3be94ed4` | Bind a faithful derivative; required for the sector construction. |
| F04 | body child 80; `word/media/image4.png` | Follows “To inscribe a circle in any regular polygon, rhombus or deltoid (kite).” Regular pentagon-like polygon with an inscribed circle, centre O and radius/contact construction. | `1a5b6534add875edea4a88dc323c5cc412d72838a96f1b78c0e41a4e65c00de6` | Bind a faithful derivative; required for the polygon/kite construction. |
| F05 | body child 98; `word/media/image5.png` | “To circumscribe a circle on a triangle or inscribe a triangle in a circle.” Triangle ABC with circumcircle and centre O/construction lines. | `0c6072f927a9422ae7af4261171f3195722c6f4b306563de3b394cfffc54cc4d` | Bind a faithful derivative; required for the circumcircle construction. |
| F06 | body child 130; `word/media/image6.png` | Weekend-assignment figure above the classification question (inscribed / circumscribed / escribed / “rebated”); shows a triangle within a circle. | `ca409b5493cb7c6f4ff01c6ea91e0782833b8a8fe43da2fc54c83aa0daedb191` | Bind a faithful derivative; the diagram is necessary to answer the classification question. |
| F07 | body child 136; `word/media/image7.png` | Weekend-assignment figure for the following question about “the circle P”; shows a labelled circle P in a larger circle/triangle construction. The source's multiple-choice classification is preserved; no answer is inferred in this inventory. | `bd259025a978bec8f9e53eab347a7d05cae7f36f64c513d0d2399f55f42f5340` | Bind a faithful derivative; required to answer the circle-P classification question. |
| F08 | body child 150; `word/media/image8.png` | “Which ... represents the radius of the circle drawn below?” Circle/triangle PQR with centre O and candidate radii/segments including OT. | `d0c1aae277ffd0bfaa342b30aee4c3eee999d1067e566c455c542cbefeab2272` | Bind a faithful derivative; required to identify the radius from the labelled diagram. |

## Queue follow-ups

Eight bounded ASSET tasks have been appended: `TD-ASSET-W01-F01` through `TD-ASSET-W01-F08`. Each task names its exact source image part, SHA-256, body-child locator, intended learner-facing use, and a unique allowed SVG asset path. The tasks require faithful geometry and labels, source/derivative provenance, SHA-256, byte count and alt text. They do not permit invented dimensions or execution of embedded content.

All eight figures are instructional or assessment-bearing; none is excluded. No source PNG is copied into the repository. The source figures' visible construction labels are to be preserved in the derivatives. The asset tasks remain PENDING until faithful derivatives are produced and bound in the package.

## Checks and limits

- Recomputed the source member SHA-256 and each of the eight original PNG-part SHA-256 values.
- Confirmed exactly eight DrawingML picture placements in the Week One body-child range and matched each placement to its surrounding paragraph.
- Visually inspected all eight individual PNG previews.
- Did not create derivative SVGs, bind package assets, run the subject schema/test/compiler/importer, or verify the application display. Those remain outstanding.
- No approval, certification or deployment is claimed.
