# TD-VIS-W06-W07 — Week Six–Seven figure-by-figure visual disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All 11 DrawingML placements were inspected individually. They resolve to 11 unique raster source parts. The row also contains one embedded AutoCAD object with a WMF preview; its visible diagram repeats the Week Three triangle ABD with labels 30/60/70. That repeated figure is routed to a reuse-validation task rather than creating a second independent diagram.

## Source and method

- Source member: `SS1-SRC-af4868d2c026`; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Combined Week Six–Seven teaching row: parsed row 16; `word/document.xml` body children [1009, 1210); rendered PDF pages 27–30.
- Source lesson ID: `SS1-SRC-af4868d2c026:BODY:97461c6ebcdd67d8af003002e111d7a1ffe244724f382b3c35c79d88585dbc05`.
- Inspected all 11 DrawingML placements and opened all 11 unique PNG/JPEG parts. The paired OLE preview at body child 1194 was rendered and inspected without executing the embedded AutoCAD object.
- Original source media, OLE bytes and rendered previews remain outside Git.

## DrawingML figure inventory and disposition

| Figure | XML body child / source part | Observed visual content | Original media SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | 1019 / `word/media/image52.png` | Rectangle ABCD reduced to similar rectangle A1B1C1D1 in ratio 3:5, using radial lines from external point P and parallels. | `0b2a6a12ce86c219fdf0e449ffd078cf66092c08d1a1106dfc646bbdea4117e0` | Bind a faithful derivative. |
| F02 | 1035 / `word/media/image53.jpeg` | Polygon ABCDE reduced to A1B1C1D1E1 in ratio 4:5, with rays from A and equal divisions along AB. | `2506080bb2062fd3ded96bcfe44528e3b71cea3d6ac19b72b32969f4486de73e` | Bind a faithful derivative. |
| F03 | 1053 / `word/media/image54.jpeg` | Polygon area reduction construction in ratio 3:5, using radiating diagonals, semicircles, perpendiculars and parallel sides. | `a913597ad877c784b30f42f990ed0c3726be9b13f25407b666d742e35b26a213` | Bind a faithful derivative. |
| F04 | 1074 / `word/media/image55.jpeg` | Polygon area enlargement construction in ratio 5:3, using radiating lines, semicircles and parallel edges. | `cbf2e59007a829f37a20cd1da880519fd2b2d6721272154ae0d69f66095ee34c` | Bind a faithful derivative. |
| F05 | 1087 / `word/media/image56.jpeg` | Enlargement of a stepped/object outline from a pole T, using projection lines, arcs and corresponding points. | `66dc199a41dd2d4df315987b0eedafd7c5e5d2126143a1fb6b0f89b70559610f` | Bind a faithful derivative. |
| F06 | 1120 / `word/media/image57.png` | Dimensioned five-sided polygon with a 90-degree angle at A and labelled side/diagonal data AB 95, BC 65, CD 70, DE 75 and BE 120. | `3a944a3bb00e1390283213653b70b83233b5a5afc9be61aa7a1d4eec50c71ea6` | Bind a faithful derivative. |
| F07 | 1137 / `word/media/image58.png` | Construction sketch with a vertical centre line through K, a base ST, and 60-degree and 45-degree base angles, used by a polygon-centre question. | `019f8259e5975156bc4e4021ab01f77c6f1e3900b789a4ccd6c99d068c5791ae` | Bind a faithful derivative. |
| F08 | 1147 / `word/media/image59.jpeg` | Series of similar quadrilateral outlines labelled P, Q, R, S and T along a numbered baseline/ray construction. | `68e12539b6ff86caa899f06404162c50542fff18fce4c2e38a829cd037f25125` | Bind a faithful derivative. |
| F09 | 1160 / `word/media/image60.png` | Three irregular hexagons labelled J, K and M arranged from a common centre O with scale divisions, used for a side-ratio question. | `1e4fe74b1b46035d16092021ce1480c668114c065ef7dcdc5c820cb53a41a7b0` | Bind a faithful derivative. |
| F10 | 1171 / `word/media/image61.png` | Enlargement construction with centre O, rays through labelled points and a numbered baseline; used to identify the required centre distance. | `6d78f838cdfc0bc61c209e00b9703f1b7e78a1c2412f74eb2204ae057151b9d5` | Bind a faithful derivative. |
| F11 | 1184 / `word/media/image62.png` | Original rectangle ABCD and reduced/enlarged rectangle A1B1C1D1 connected by rays from P and numbered proportional divisions. | `815e2557180232ee6cdde5d73e86b66351b1c1b9ab460b327b1c9c0336ed0c81` | Bind a faithful derivative. |

All 11 raster figures are instructional or assessment-bearing. F01–F05 illustrate reduction/enlargement methods; F06–F11 are construction or assessment diagrams that must remain legible with their dimensions, labels and proportional construction marks.

## Embedded AutoCAD object and duplicate-source reconciliation

- OLE object: `word/embeddings/oleObject17.bin`, `AutoCAD.Drawing.15`, anchored at body child 1194.
- Safe preview: `word/media/image63.wmf`, 19,308 bytes; SHA-256 `aff737699c5bbbb3ee5435a5920be3bd11c6459b7549fc4ed26f4f4cbbe276a5`.
- The rendered WMF preview shows triangle ABD with AB=30, BD=60 and AD=70. It visually matches the Week Three source figure `word/media/image30.png` (Week Three body children 593 and 679), which already has the bounded asset task `TD-ASSET-W03-F13`.
- Reuse is preferred over duplicate art. A bounded task `TD-ASSET-W06-W07-F12` has been added to verify that the derivative created for `TD-ASSET-W03-F13` preserves this second occurrence and bind it to the Week Six–Seven source lesson as well. If geometry/labels do not match on the derivative review, the task must split into a separate derivative rather than force reuse.
- No OLE control was executed.

## Queue follow-ups

Eleven bounded ASSET tasks have been appended: `TD-ASSET-W06-W07-F01` through `F11`. A twelfth cross-row reuse-validation task, `TD-ASSET-W06-W07-F12`, references the existing Week Three figure asset task. Each task records its source locator, original media hash and intended purpose; derivative tasks require exact geometry/labels, provenance, derivative SHA-256, byte count and alt text. No original source media is committed.

## Checks and limits

- Confirmed 11 DrawingML placements, 11 unique raster parts, one OLE object and one WMF preview in the row.
- Recomputed the 11 original raster-part SHA-256 values and the WMF preview SHA-256.
- Visually inspected all 11 individual raster previews and the OLE WMF preview; checked neighbouring source text for construction and assessment context.
- Did not create SVG derivatives, bind package assets, run subject schema/tests/compiler/importer, or verify app display. Those remain outstanding.
- No approval, certification or deployment is claimed.
