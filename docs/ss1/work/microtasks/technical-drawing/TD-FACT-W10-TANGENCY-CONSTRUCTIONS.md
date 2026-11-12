# TD-FACT-W10-TANGENCY-CONSTRUCTIONS — source-backed construction inventory

**Status:** IN PROGRESS. The original registered DOCX was re-extracted and its member SHA-256 matched the registry. All written construction methods and exercise prompts are transcribed below. Two source-method gaps and the numerical dimensions embedded in several assessment templates still require figure-by-figure transcription before this task can be closed.

## Source identity

- Source ID: `SS1-SRC-af4868d2c026`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256 (recomputed): `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`
- Parsed row 18; source lesson ID `SS1-SRC-af4868d2c026:BODY:e369f415d98376d3894019f69ed19f39bf84863e1580ffd41d43af39331c1863`; body children [1581,1983).
- Locators below are zero-based body-child indices. The source member remains unchanged.

## Written construction methods

### 1. Arc tangent to one straight line or two inclined straight lines

- Topic statement: child 1589. Figure group: image88.png, body child 1597 (four cases).
- **Known radius R tangent to line AB:** child 1611; draw AB; draw parallel line A1B1 at distance R; choose point C on A1B1; with C as centre and radius R draw the arc to touch AB (children 1613–1616).
- **Known radius R tangent to two perpendicular lines:** child 1618; draw a parallel offset at distance R from each line; their intersection Q is the arc centre; with Q and radius R draw the arc to touch both lines at T (children 1620–1623).
- The source says the same procedure applies to acute- and obtuse-inclined line pairs (child 1624; image88 cases 1(c), 1(d)). The precise inclinations are depicted, not specified numerically in the text.

### 2. External joining of arcs/circles

- Topic statement: child 1637; figures image90/image91 and their source anchors in `TD-VIS-W10.md`.
- **External joining of one arc to a known arc/circle:** child 1639; given radii R and r, draw the given arc/circle of radius R; with the same centre draw a locus arc of radius R+r; choose a point on that locus and with radius r draw the joining arc tangent to the original at T (children 1643–1646).
- **Arc of radius R1 externally tangent to two circles:** child 1648; draw circles A and B of radii R and r; join centres P and Q; draw a locus arc from P using R1+R; draw a second locus arc from Q using the same stated R1+R; their intersection O is the proposed centre; join O to P and Q to locate tangent points T; draw the required arc from O through the tangent points (children 1650–1656).
- **Source inconsistency:** step 1654 repeats R1+R for the second circle even though that circle is assigned radius r in step 1650. Do not silently replace it with R1+r; retain the literal source reading and flag for subject-owner correction.
- **Arc R2 externally tangent to arc AB and straight line CD:** child 1693; draw a parallel arc to AB at radius (radius of AB + R2); draw FG parallel to CD at distance R2; intersection G is the centre of the joining arc (children 1703–1706; figure image91.png, child 1693).

### 3. Internal joining of arcs/circles

- Topic statement: child 1661; figures image90.png / image91.png as cross-referenced in the visual inventory.
- **Internal joining of one arc to a known arc/circle:** child 1675; draw given arc/circle of radius R; draw a concentric locus arc of radius R−r; choose a point on the locus and with radius r draw the joining arc to touch the given arc internally (children 1677–1681).
- **Arc of radius R1 internally tangent to two circles:** child 1683; draw circles A and B of radii R and r; join centres S and V; draw locus arcs using R1−R and R1−r from the respective centres; their intersection U is the proposed centre; draw lines through U and the circle centres to the tangent points T; with U as centre and UT as radius draw the joining arc (children 1685–1690).
- This method assumes the required arc is large enough for both radius differences to be non-negative. The source does not state that condition; it should be taught as a geometric feasibility check, not silently omitted.

### 4. Common tangents to two circles

- **Common external tangent, equal diameters:** child 1709; draw both circles and centre line; bisect their horizontal diameters at P and Q; the bisectors meet the circles at E and F; EF is the required tangent (children 1721–1725; figure image92.png, child 1709).
- **Common external tangent, unequal diameters:** child 1734; draw both circles and join centres A and B; with O as centre and radius CB mark E on AB; with A as centre and radius AE draw a circle; construct semicircle on AB to meet that circle at F; draw AF to meet the larger circle at G; draw BH parallel to AG; GH is the required tangent (children 1745–1752; figure image93.png, children 1735 and 1930).
- **Common internal tangent, equal circles:** child 1755; draw circles; join centres A and B; bisect AB at C; construct semicircle on AC to meet circle A at D; with C as centre and radius CD draw an arc to meet the second circle at E; DE is the required tangent (children 1766–1771; figure image94.png, child 1755).
- **Common internal tangent, unequal circles:** child 1782; draw circles and join centres A and B; with D as centre and radius CB mark E on AB; with A as centre and radius AE draw an arc; semicircle on AB meets that arc at F (children 1793–1797; figure image95.png, child 1782).
- **Incomplete source procedure:** the written method stops after step (v) at child 1797. No subsequent written steps were found before the evaluation heading at child 1800. The diagram must be inspected to establish the intended final tangent construction; do not invent missing steps.

## Dimensioned assessment constructions

The visual inventory `TD-VIS-W10.md` identifies each figure and exact placement; all dimension callouts must be transcribed from the source images before this fact task is closed.

| Exercise | Source locator | Figure / known textual dimensions and requirements |
|---|---:|---|
| Evaluation 1(a) | 1801–1803 | Full-size dimensioned template; show every arc centre and point of tangency (image96.png, child 1803). |
| Evaluation 1(b) | 1819–1821 | Circles P and Q, diameters 50 and 40; an arc R150 joins both circles externally at the upper part; an arc radius 20 joins both internally at the lower point. |
| Evaluation 2 | 1826–1827 | Full-size dimensioned spanner; identify all arc centres and tangent points (image97.png, child 1827; repeated at 1958). |
| Evaluation 3 | 1847–1848 | Half-full-size machine part; identify all arc centres and tangent points (image98.png, child 1847). |
| Evaluation 4 | 1874–1875 | Full-size dimensioned template; identify all arc centres and tangent points (image99.png, child 1874). |
| Theory 1 | 1944–1945 | Full-size template; show arc centres and tangent points; same template family as evaluation image96. |
| Theory 2 | 1958–1959 | Full-size spanner; show arc centres and tangent points; image97 is reused. |

## Weekend assessment

- Reading assignment child 1891: J.N. Green, *Technical Drawing*, pp. 58–59.
- Q1, child 1896: classify line X–X as bisector, normal, external tangent or internal tangent; figure image100.png at child 1896.
- Q2, children 1905–1906: choose the correct radius equation from Rc+Rx=Rz; Rp+Ry=Rz; Rp+Ry=Rc; Rz−Ry=Rc; figure image101.png at child 1905. The source formatting uses subscript letters in R-values.
- Q3, child 1919–1920: determine PO and QO for two circles and an arc of radius 80; options 105/102, 65/62, 130/124, 57/55; figure image102.png at child 1919.
- Q4, children 1929–1930: identify whether the radius-80 arc in Q3 is externally or internally tangent (or choose the distractors vertical/horizontal).
- Q5, children 1939–1940: classify the construction in the displayed figure as common external tangent, common internal tangent, bisector or normal; figure image93.png reused at child 1930/1939.
- Theory questions repeat the full-size template (1944–1945) and spanner (1958–1959).
- Further evaluation child 1980: draw each of the six tangency problems shown, full size, showing centres and tangent points (composite image104.png).

## Notation and source-quality observations

- Radius labels R1, R2 and R-subscript terms are true subscript runs, not decimal values. The source's R150 is R1 with subscript 50, and the separate radius 20 in evaluation 1(b) is plain 20; preserve the figure's exact typographic distinction.
- The external two-circle method repeats R1+R for both locus radii despite the second circle being labelled r. This is an apparent source error requiring owner/editor review.
- The unequal-circle internal tangent written method ends mid-procedure at child 1797; the missing final steps must be recovered from figure or author evidence.
- The four assessment templates are dimensioned drawings. Their complete dimension strings are not yet transcribed here; this is the outstanding portion preventing task closure.

## Verification boundary

- Re-extracted the source DOCX and matched the registered member hash.
- Transcribed all written construction procedures, locators, textual dimensions and question prompts.
- Matched the 17 unique visual assets and 19 placements to `TD-VIS-W10.md`.
- Did not execute OLE objects, complete the image-dimension transcription, create SVG derivatives, create answer keys, run schema/tests/compiler/importer, verify app display, or claim approval/deployment.


## Figure callout inspection — original media opened at native resolution

The original embedded PNGs image88–image104 were extracted from the registered DOCX and inspected individually or in a labelled contact sheet. The committed byte-for-byte source assets preserve the same image data; the following transcriptions supplement the existing visual inventory.

### Dimensioned templates

- **image96.png (evaluation 1a / theory 1):** two unequal circles joined by upper and lower arcs; left circle R44, right circle R32, joining arcs R50 (upper) and R50 (lower), centre spacing 100 mm. The source labels arc radii at the callout arrows; use the dimension arrows, not the apparent drawing scale.
- **image97.png (evaluation 2 / theory 2, spanner):** radii called out R40, R30, R23, R20, R53 and R55; handle width 34 mm; a 30° angular construction is shown at the head. The exact radii must remain attached to their individual leader arrows in the original image.
- **image98.png (evaluation 3, machine part):** two holes Ø16; central bore Ø50; central boss Ø102; overall horizontal width 64 mm; radii include R16, R26, R38, R50 and R60; additional small boss/hole callouts are printed in the original raster. The source specifies half-full-size drawing. The raster must remain the controlling reference for those smaller callouts rather than retyping uncertain low-resolution digits.
- **image99.png (evaluation 4):** left circle Ø100; centre spacing 150 mm; vertical offset 20 mm; joining/fillet radii R20, R45, R25 and R2. The lower and upper connecting profiles are tangent arcs.
- **image100.png (weekend Q1):** the line X–X is a common internal tangent: it touches the upper-left circle and the right-hand circle on opposite sides of their centre line. It is not a perpendicular bisector or a normal.
- **image101.png (weekend Q2):** two given circles of radii Rx and Ry with a larger arc centred at O; the diagram labels the centre distances Rc and Rz and the arc radius Rp. For the lower circle the external-contact radius relation is **Rz = Rp + Ry**. The corresponding option is the statement 'Rp + Ry = Rz'. The upper construction has its own centre-distance relation and must not be conflated with the lower one.
- **image102.png (weekend Q3/Q4):** left circle radius 25 mm, right circle radius 22 mm, joining arc radius 80 mm. For external tangency, PO = 80 + 25 = **105 mm** and QO = 80 + 22 = **102 mm**. Therefore the correct ordered pair is **105, 102**; the joining arc is **externally tangent** to both circles.
- **image103.png (weekend Q5):** two circles on a common horizontal centre line, centre spacing 80 mm; left outside diameter Ø40 and bore Ø20; right outside diameter Ø70 and bore Ø20. The upper and lower joining arcs are each R120 and are externally tangent to the two outside circles. The bores are not the tangency references.
- **image104.png (weekend Q6 composite):** four independent tangency profiles. Top-left: R50 and R20 with 65 mm horizontal span. Top-right: R35 and two R12 fillets with 40 mm span. Middle-left: R25, R40, R12 and R80 with 50 mm span. Middle-right: R30, R35 and R6 with 45 mm span and 6 mm vertical offset. Bottom-left: R22, R55, R12 and R85 with 75 mm span and 10 mm vertical offset. Bottom-right: radii R100, R8, R9, R6, R105, R140 and R15; base length 112 mm, overall height 100 mm and 25 mm base thickness. All six subprofiles are distinct; do not collapse the composite into one construction.

### Weekend answer key (figure-backed)

1. Q1 / image100: **common internal tangent**.
2. Q2 / image101: **Rp + Ry = Rz** for the lower circle's external contact.
3. Q3 / image102: **PO = 105 mm; QO = 102 mm**.
4. Q4 / image102: **external tangency**.
5. Q5 / image103: two **external tangent joining arcs**, R120, joining the Ø40 and Ø70 outside circles at 80 mm centre spacing.
6. Q6 / image104: construction identification is by six independent profiles and their callout radii as transcribed above; any multiple-choice letter must be taken from the original question's option ordering, not inferred from this visual key.

## Remaining limitations

- The small print on image98 and several image104 leader-arrow endpoints are low resolution. The exact original raster is bound and retained for the student to zoom; the uncertain micro-callouts are not independently retyped as authoritative values.
- The final tangent line for the unequal-circle internal tangent construction (image95 / children 1793–1797) is absent from the written source steps. The image shows the intended tangent direction, but the source procedure still needs a corrected, fully stated step sequence approved by the subject owner.
- The repeated R1+R locus for the second circle in child 1654 remains a source typo pending correction. The mathematically correct locus is R1+r, but the source wording is retained in the package and flagged.
