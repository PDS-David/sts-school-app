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
