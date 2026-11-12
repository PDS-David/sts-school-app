# TD-VIS-W08-W09 — Equal-area figure-by-figure visual disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All 26 DrawingML placements were inspected; they resolve to 24 unique source image parts. Two source parts are each reused at two placements. Twenty-three unique figures require new derivatives; the repeated 30/60/70 pentagon-diagonal triangle is routed to a cross-row reuse-validation task using the existing Week Three derivative task. No app/display verification is claimed.

## Source and method

- Source member: `SS1-SRC-af4868d2c026`; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Combined Week Eight–Nine row: parsed row 17; `word/document.xml` body children [1210, 1581); rendered PDF pages 31–42.
- Source lesson ID: `SS1-SRC-af4868d2c026:BODY:865bb6bbb80331ca2182e97801040727e986ad3f9334b61018a33f239e4eb97a`.
- Inspected all 26 DrawingML placements and opened all 24 unique PNG/JPEG parts. Neighbouring source paragraphs were checked to identify the exact equal-area construction or assessment use.
- Original media and rendered previews remain outside Git. Hashes below refer to the original embedded parts.

## Figure inventory and disposition

| Figure | XML body child(s) / source part | Observed visual content | Original media SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | 1217 / `word/media/image64.jpeg` | Polygon-to-triangle equal-area construction for a polygon with an interior angle less than 180 degrees; rays and a common base show the transformation. | `dae66c80109e0793308c731669865fa7d28bcff549a7174244ca83e6b71f5c85` | Bind a faithful derivative. |
| F02 | 1233 / `word/media/image65.jpeg` | Polygon-to-triangle equal-area construction where the relevant interior angle is greater than 180 degrees; preserve all auxiliary rays and intersections. | `89394991e2fbed2fad54f24b1d10831738309adc6dfab00a5220e48fd8ca0a28` | Bind a faithful derivative. |
| F03 | 1246 / `word/media/image66.jpeg` | Triangle equal in area to a regular hexagon, with hexagon vertices, centre and projection lines. | `4d4e4336874b1d54a0816dd9f00ea848170bbb2a6b948554df2ebb659f46f428` | Bind a faithful derivative. |
| F04 | 1264 / `word/media/image67.png` | Triangle equal in area to a parallelogram, using a shared base and diagonal/parallel construction. | `afb76e41c744f2b5edd58e334b1e3ebbe147c36ab9cc78ace96159619bdcbcd3` | Bind a faithful derivative. |
| F05 | 1276 / `word/media/image68.jpeg` | Parallelogram equal in area to a given triangle, with a 90-degree perpendicular and parallel construction. | `79c92f8d65f655b8a5403dcc093bfb2faaa47dcececd89fb88953b25e813cdb7` | Bind a faithful derivative. |
| F06 | 1295 / `word/media/image69.jpeg` | Triangle equal in area to a given triangle but with a different base, using an auxiliary line and parallel construction. | `a9f64880fa2eb35a48ffb9126215522d07172e902090ae1688250f3dbb223e14` | Bind a faithful derivative. |
| F07 | 1309 / `word/media/image70.jpeg` | Construction of a triangle from a stated area (4½ cm² in the source example), with a rectangular/base-height construction. | `4befd45a83f9b9733df09f04032071a3dd026af6297cb869d6a943063d3dab0b` | Bind a faithful derivative. |
| F08 | 1325 / `word/media/image71.jpeg` | Rectangle of a different side length but equal area to a given rectangle, using a diagonal and parallel line. | `e937763a161e58ee0344632348d448ffec821e0bdb22f1899532ddebb3dff4f3` | Bind a faithful derivative. |
| F09 | 1339 / `word/media/image72.jpeg` | Square equal in area to a given rectangle, using a semicircle and radius transfer. | `e221811663fb255498aefff2cc65f81070d0b0c576d2d9567a8b207489a480c8` | Bind a faithful derivative. |
| F10 | 1357 / `word/media/image73.jpeg` | Rectangle equal in area to a given triangle: perpendicular altitude, midpoint of the altitude and parallel top edge. | `1125db39a48ae82446e7313e23c2f0fa3dc6a1ed1fc64a68207e7922c060418c` | Bind a faithful derivative. |
| F11 | 1371 / `word/media/image74.jpeg` | Square equal in area to a given parallelogram, with perpendicular, semicircle and radius transfer construction. | `937f11392d74aabd3e7dc1a9427fbd0d248a3adcdf92523db73694c2de13f362` | Bind a faithful derivative. |
| F12 | 1391 / `word/media/image75.jpeg` | Triangle divided into four equal-area strips by lines parallel to one side, using a semicircle/division construction. | `fc85a7cf59bf0a72d4053ebf134a76518a6bef1dbb412a8ee199fe8fbe0f8d5c` | Bind a faithful derivative. |
| F13 | 1409 / `word/media/image76.jpeg` | Triangle divided into two equal areas by a line perpendicular to one side. | `83759d53c26f90b1999e83b60da4a5692feb4c553ea813994492f591c4617f21` | Bind a faithful derivative. |
| F14 | 1425 / `word/media/image77.jpeg` | Triangle divided into two equal areas by a line drawn from a specified point, with auxiliary arcs. | `48b48d414c9e10af0c34ba24f485835de65bf96218b3433e7096a735a1795b1f` | Bind a faithful derivative. |
| F15 | 1439 / `word/media/image78.jpeg` | Circle equal in area to the sum of two given circles, with intersecting diameters and right-angle construction. | `d11eddd6f02b2485f670bee37227d1597883c64ed918a6790af54dc9c779419d` | Bind a faithful derivative. |
| F16 | 1455 / `word/media/image79.jpeg` | Square equal in area to the sum of two given squares, using a right-angle and diagonal construction. | `8c73b782f28f58ece4b0dbb87eee9b9854574bd41501be62e9c24b9eb0499883` | Bind a faithful derivative. |
| F17 | 1468 / `word/media/image80.jpeg` | Square equal in area to the difference of two given squares, with a right-angle construction. | `fd4321622a810615aa0349c51255d09014248dc67833c83619160ec68906d19c` | Bind a faithful derivative. |
| F18 | 1483 / `word/media/image81.jpeg` | Square having twice the area of a given square, constructed from the diagonal. | `552f1e0a6fb3d33b2630b6c92b453d045e09476d43beeaaa8487fc6a086bcc3f` | Bind a faithful derivative. |
| F19 | 1496, 1558 / `word/media/image82.png` | Irregular pentagon with angle labels 30, 135 and 120 degrees and given side data AB=70, BC=40, DE=75 and AE=80; reused in evaluation and theory. | `f444a46e967fa07abbb970a02cfb672662b1f7241575335794d4d3b4f05ad3c0` | Bind a faithful derivative. |
| F20 | 1508, 1570 / `word/media/image83.jpeg` | Triangle ABD with AD=70, BD=60 and AB=30 for the pentagon-diagonal construction; visually repeats the Week Three image30 and Week Six–Seven OLE preview. | `bc7716e9f9f34c8479b2858ead6abb51d8563af7951040397a7b61b1115afbd6` | Reuse/validate existing W03-F13 derivative; bind to this lesson. |
| F21 | 1527 / `word/media/image84.png` | Composite equal-area figure showing rectangle JKLM, square KFGH and semicircle JFE for a multiple-choice area relationship. | `97bcb96061c29062eaf23d6a3c0c3dc895c59fbe3438529288c0a4dbbc16602c` | Bind a faithful derivative. |
| F22 | 1533 / `word/media/image85.png` | Composite figure for questions about the area ratio of rectangle RSTU and square TVWX and angle SXY. | `189a9fd08e3ea34d1fdea06fd9747a3665fe62a17ccb899dc07a5e171bf676d2` | Bind a faithful derivative. |
| F23 | 1540 / `word/media/image86.png` | Parallelogram-like figure with points V, U, S, T, M, Z and O, used to compare areas of labelled triangles. | `6c534a99df09fa5aaccb822181f9ab448ae9b9e7158a18fcb9d4fb0b1bd3023a` | Bind a faithful derivative. |
| F24 | 1554 / `word/media/image87.png` | Polygon BCDEG with diagonals to compare against candidate equal-area triangles/polygons in the multiple-choice question. | `b1d380298fd2fe4d7b7900443571dac7d1b576a0c77a397a44bc13fbacd19890` | Bind a faithful derivative. |

The 26 placements resolve to 24 unique parts: `image82.png` is reused at body children 1496 and 1558; `image83.jpeg` is reused at 1508 and 1570. The latter shows the same triangle ABD with dimensions 30, 60 and 70 already inventoried in Week Three and Week Six–Seven. Its derivative must be shared only after the existing Week Three asset task has verified the geometry and labels.

## Instructional coverage represented

The figure set covers equal-area conversions between polygons and triangles; regular polygons and parallelograms; rectangles and squares; division of triangles into equal areas; circles equal to sums of circles; squares equal to sums/differences of squares; and squares with twice the area. Assessment diagrams include irregular-polygon construction data, area-equivalence comparisons, and labelled triangle-area relationships. All are required for the source teaching or assessment; none is excluded.

## Queue follow-ups

Twenty-four bounded ASSET tasks have been appended: `TD-ASSET-W08-W09-F01` through `F24`. F19 covers both placements of image82. F20 is a cross-row reuse-validation task dependent on `TD-ASSET-W03-F13`; it must reuse the Week Three derivative only if the derivative is confirmed equivalent to the Week Eight–Nine source. The remaining tasks specify unique SVG paths and exact source hashes/locators. Each task requires faithful geometry, labels, provenance, derivative SHA-256, byte count and alt text.

## Checks and limits

- Recomputed the registered DOCX member SHA-256 and all 24 unique embedded media-part SHA-256 values.
- Confirmed 26 DrawingML placements, 24 unique media parts and the two duplicate placements.
- Visually inspected all 24 unique image previews and matched each to surrounding source text.
- Did not create SVG derivatives, bind package assets, run subject schema/tests/compiler/importer, or verify app display. Those remain outstanding.
- No approval, certification or deployment is claimed.
