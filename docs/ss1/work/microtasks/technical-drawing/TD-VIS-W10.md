# TD-VIS-W10 — Week Ten tangency figure-by-figure disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All 19 DrawingML placements were inspected; they resolve to 17 unique PNG parts. Two diagrams are each reused at two placements. Seventeen unique figures/composites have bind-as-asset dispositions. No OLE or WMF objects occur in this row; no app/display verification is claimed.

## Source and method

- Source member: `SS1-SRC-af4868d2c026`; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Week Ten row: parsed row 18; `word/document.xml` body children [1581, 1983); rendered PDF pages 43–54.
- Source lesson ID: `SS1-SRC-af4868d2c026:BODY:e369f415d98376d3894019f69ed19f39bf84863e1580ffd41d43af39331c1863`.
- Inspected all 19 DrawingML placements and opened all 17 unique PNG parts; matched each to the source paragraph and assessment context. Original media and rendered previews remain outside Git.

## Figure inventory and disposition

| Figure | XML body child(s) / source part | Observed visual content | Original PNG SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | 1597 / `word/media/image88.png` | Four cases illustrating joining an arc of known radius to a straight line or to two lines at different inclinations, including right-angle, acute and obtuse arrangements. | `d60e54fa139e1377f8d79624bf78257ce158b6daa6a2fc02b7e5dbe8045f4d2f` | Bind a faithful derivative. |
| F02 | 1627 / `word/media/image89.png` | Four construction cases for an arc of known radius tangent to two straight lines, with the offset parallels and centre intersection. | `d568c39398f13fb4563ef5e5ddbf730fccea3b3b548c8b412071a3abfdb34b3a` | Bind a faithful derivative. |
| F03 | 1662 / `word/media/image90.png` | Internal joining of two arcs/circles using the difference of radii and a centre-locus construction. | `a7a7390711e3f6f64ea957fe74a9648962c9cc78d4be704b0d3a8d3f5757de2d` | Bind a faithful derivative. |
| F04 | 1693 / `word/media/image91.png` | Arc R2 externally tangent to an existing arc AB and straight line CD, with parallel offset line and centre G. | `3276cc08908666f3dc9b7b057fd99d43535723958b25f8a25d9a4de0fc6967d1` | Bind a faithful derivative. |
| F05 | 1709 / `word/media/image92.png` | Common external tangent construction for two equal-diameter circles, using centre line and corresponding tangent points. | `690f796e3f5a237326dcd1846ecbbd99ddd555e39fcf7543e09c4921cedd3ba2` | Bind a faithful derivative. |
| F06 | 1735, 1930 / `word/media/image93.png` | Common external tangent construction for two unequal circles; the same diagram is reused in a later question about tangency type. | `d53c17838cbf73f8ee2eb7cc45dbbcad77befe53cbb111fbd471b6eb6507551a` | Bind a faithful derivative. |
| F07 | 1755 / `word/media/image94.png` | Common internal tangent construction for two equal circles using the centre midpoint and an auxiliary semicircle. | `aca3c2b10a11fe23c7c1922c3aa57b6ad4990c823cc5a0b6285ae4d896663b5e` | Bind a faithful derivative. |
| F08 | 1782 / `word/media/image95.png` | Common internal tangent construction for two unequal circles using auxiliary radius and semicircle construction. | `b182427ea3ca4753534122dee7690a8131a48c0ab32c8f63754cacf91f2967e8` | Bind a faithful derivative. |
| F09 | 1803 / `word/media/image96.png` | Dimensioned template containing two circles and joining arcs; assessment asks for arc centres and tangency points. | `c3f1529dc21b2901a0665d8e9c67796e6a81a51b00e7a54c676f6ae0164dbdf6` | Bind a faithful derivative. |
| F10 | 1827, 1958 / `word/media/image97.png` | Dimensioned spanner outline with multiple radii and tangency points; reused in evaluation and theory. | `0006889807b741467b19070a6f79638547310dccfa5776dbab6a9e0749bb2347` | Bind a faithful derivative. |
| F11 | 1847 / `word/media/image98.png` | Dimensioned machine-part profile with multiple arcs/radii, to be constructed at half full size. | `9cdbc52ff6e06a9090d87c0e353c486b74d9b6f43a468d164f731fb1660090da` | Bind a faithful derivative. |
| F12 | 1874 / `word/media/image99.png` | Full-size dimensioned template with circular and blended-arc geometry; preserve all radii and tangency points. | `39077b2755a98923d0200572093e05ae03917828ff85dddcc5960f80dff619a3` | Bind a faithful derivative. |
| F13 | 1896 / `word/media/image100.png` | Two-circle diagram with a labelled line X-X used to classify the line as a common tangent/bisector/normal. | `eb989caad41617e30d3ed32a832f646a348a6a5c2727af5ebef1babd9331fe90` | Bind a faithful derivative. |
| F14 | 1906 / `word/media/image101.png` | Two-circle/arc centre-locus diagram labelled with radii Rp, Ry, Rz and Rc for an equation question. | `b0045124f2c7e2912463328503e8013f537b92b21d28a1b904b5f113d13d891e` | Bind a faithful derivative. |
| F15 | 1919 / `word/media/image102.png` | Two smaller circles and a central arc of radius 80 with centres P, Q and O; assessment asks for PO and QO. | `d8336cd590cf84c98a79e31e4129e9261ad7cbb0356aec98a3fa742e45aff4a0` | Bind a faithful derivative. |
| F16 | 1945 / `word/media/image103.png` | Dimensioned symmetric/oval template with end holes, radii and centre/tangency marks for the theory construction. | `5e982a35638cb0957ba4cd546cc0587ecc2c3ade594d232fb3a2c6a645d2700f` | Bind a faithful derivative. |
| F17 | 1980 / `word/media/image104.png` | Composite sheet of six separate tangency problems; each subfigure has its own radii, construction geometry and dimension labels. | `5f39fa450a1e10f7dfeaf9eda9a769b5d747cb77196b2e981dbfc67d1aeb6e65` | Bind a faithful derivative. |

The 19 placements resolve to 17 unique parts because `image93.png` is reused at body children 1735 and 1930, and `image97.png` is reused at 1827 and 1958. One derivative for each repeated source part must serve both placements. F17 is a composite sheet of six tangency problems and must remain complete unless a later presentation design explicitly splits it while retaining all six subfigures.

## Instructional coverage represented

The diagrams cover arcs tangent to straight lines and two lines at right, acute and obtuse inclinations; external and internal joining of arcs; common external and internal tangents for equal and unequal circles; and dimensioned machine-part, spanner and template constructions. The assessment figures also test recognition of tangent type, radius relationships and distances between centres. All figures are instructional or assessment-bearing; none is excluded.

## Queue follow-ups

Seventeen bounded ASSET tasks have been appended: `TD-ASSET-W10-F01` through `TD-ASSET-W10-F17`. F06 and F10 cover their repeated placements. The composite six-problem sheet remains one asset task. Each task specifies exact source part, SHA-256, XML locator, purpose and unique SVG path, and requires faithful geometry, radii, dimensions, labels, derivative hash/byte count, alt text and provenance.

## Checks and limits

- Recomputed the registered DOCX member SHA-256 and all 17 unique embedded PNG-part SHA-256 values.
- Confirmed 19 DrawingML placements, 17 unique media parts and the two repeated source parts.
- Visually inspected all 17 unique image previews and matched each to the surrounding text.
- Did not create SVG derivatives, bind package assets, run subject schema/tests/compiler/importer, or verify app display. Those remain outstanding.
- No approval, certification or deployment is claimed.
