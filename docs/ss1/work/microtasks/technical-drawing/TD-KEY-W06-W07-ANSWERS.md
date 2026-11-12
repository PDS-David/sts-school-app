# TD-KEY-W06-W07-ANSWERS — Week Seven reduction supplement

**Status:** IMPLEMENTED — TESTING DEFERRED. This note keys the Week Six–Seven source examples, evaluation, general revision and weekend tasks to the extent the supplied dimensions and figures permit. It explicitly identifies under-specified source constructions rather than fabricating dimensions or answer coordinates. This is a proposed teacher key, not an approved marking scheme.

## Source identity

- Source member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`
- Combined teaching row: WEEK SIX AND SEVEN, source body SHA-256 `97461c6ebcdd67d8af003002e111d7a1ffe244724f382b3c35c79d88585dbc05`.
- Source exercise locators: children 1065–1067.
- Supplement: `SUP-SS1-TECHNICAL-DRAWING-T2-W07-REDUCTION`.

## Source evaluation solutions

### Evaluation 1 — Regular hexagon, side 40 mm, reduced in ratio 3:5

Interpreting 3:5 as a linear image:original ratio, the new side is:
40 × 3/5 = **24 mm**.

The perimeter changes from 6×40 = 240 mm to 6×24 = 144 mm. The area ratio is the square of the linear ratio: (3/5)² = **9:25**.

The source says “reduce it by the ratio 3:5” but does not explicitly label the ratio as linear or areal. The ordinary drawing interpretation is linear; if the source author intended an area ratio, the side factor would instead be √(3/5). This interpretation should be confirmed during content approval.

### Evaluation 2 — Photo frame 40 mm × 60 mm, reduced in ratio 4:7

Interpreting 4:7 as linear image:original:
- Reduced first dimension = 40 × 4/7 = **22.86 mm** (2 d.p.).
- Reduced second dimension = 60 × 4/7 = **34.29 mm** (2 d.p.).

## Supplement practice answer coverage

The five questions in the Week Seven supplement cover:
1. 40 mm × 20 mm rectangle reduced linearly 3:5 → 24 mm × 12 mm; area 288 mm².
2. 40 mm × 60 mm photo frame reduced linearly 4:7 → 22.86 mm × 34.29 mm.
3. Area ratio 3:5 → linear factor √(3/5) ≈ 0.7746; 100 mm becomes 77.46 mm.
4. Linear enlargement 5:3 → 1.667; area enlargement 5:3 → linear factor √(5/3) ≈ 1.291.
5. Regular hexagon side 40 mm reduced linearly 3:5 → side 24 mm; area ratio 9:25.

Each practice question has positive integer marking criteria whose sum equals the question's mark value.

## Remaining combined-row answer work

The source's other Week Six–Seven construction/evaluation items depend on original figures, exact labels, and dimensions. They remain unkeyed until their faithful derivatives are available and reviewed. The 11 source figure derivatives and the cross-row triangle reuse check remain outstanding. Do not substitute the independently authored supplement diagrams for the source figures.

## Verification boundary

No teacher approval, schema/compiler/importer run, student rendering, or deployment is claimed in this note.

## Source enlargement evaluation

The combined row's enlargement evaluation asks for a regular pentagon of side 30 mm enlarged in the linear ratio 3:2 (image : original). The scale factor is 3/2=1.5, so each image side is 30×1.5=**45 mm** and the image perimeter is 5×45=**225 mm**. The five interior angles remain 108°; the figure is similar to the original. A centre-of-enlargement construction should use rays through the five original vertices and proportional division 3:2, then join corresponding image vertices.

The source's general revision task also contains a pentagon with AB=40, BC=35, CD=65, AE=45, ED=55, ∠ABC=120° and ∠BAE=105°, followed by an area reduction 3:5. The polygon must first be constructed using the two stated angles and the five side lengths. The area-reduction linear factor is √(3/5)≈0.7746; each corresponding side of the reduced similar polygon is multiplied by that factor. The final measured area/side coordinates depend on the correct intersection branch in the source construction and should be checked against the original drawing before marking.


## General evaluation / revision — keyed construction procedures

### Q1 — irregular pentagon, then area reduction 3:5

Given AB=40 mm, BC=35 mm, CD=65 mm, DE=55 mm, AE=45 mm, angle ABC=120° and angle BAE=105°:

1. Draw AB=40 mm.
2. At B construct a 120° ray from BA and mark C so BC=35 mm.
3. At A construct a 105° ray from AB and mark E so AE=45 mm.
4. With C as centre radius 65 mm and E as centre radius 55 mm, draw intersecting arcs. Choose the upper intersection consistent with the source's convex A-B-C-D-E outline; mark it D.
5. Join C-D and D-E. Check all five side lengths and both given angles before removing construction lines.
6. For area ratio image:original=3:5, use linear factor √(3/5)=0.7745967. Apply that factor to every corresponding length using a pole/ray or the geometric-mean semicircle construction; draw image edges parallel to the original edges.

Numerical construction check using the convex branch with AB horizontal: C≈(57.50,30.31) mm, E≈(−11.65,43.47) mm and D≈(23.54,85.74) mm. The resulting polygon area is approximately 3,725.26 mm²; the reduced area is approximately 2,235.16 mm². These coordinates and areas are computational checks, not dimensions to copy in place of the drawing. Accept equivalent rigid rotations/reflections and rounding within drawing tolerance.

Suggested rubric (12 marks): AB and angle setup (2); C correctly located and BC dimension (2); E correctly located and AE dimension (2); D from the two specified radii and correct branch (2); complete labelled pentagon and checks (2); correct √(3/5) area-to-linear conversion and similar reduction construction (2).

### Q2 — regular polygons on a common 30 mm base

For a regular n-gon with side s=30 mm, the circumcentre lies on the perpendicular bisector of the base. Its perpendicular distance from the base is h=s/[2 tan(π/n)], and the circumradius is R=s/[2 sin(π/n)].

| Polygon | n | Centre height h from base | Circumradius R |
|---|---:|---:|---:|
| Square | 4 | 15.00 mm | 21.21 mm |
| Pentagon | 5 | 20.65 mm | 25.52 mm |
| Hexagon | 6 | 25.98 mm | 30.00 mm |
| Heptagon | 7 | 31.15 mm | 34.57 mm |
| Octagon | 8 | 36.21 mm | 39.20 mm |
| Nonagon | 9 | 41.21 mm | 43.86 mm |
| Decagon | 10 | 46.16 mm | 48.54 mm |

Construction: draw the common 30 mm base; bisect it; erect its perpendicular; locate each centre at the tabulated height (or construct it by the source's two-triangle method); draw the circumcircle and step the 30 mm chord around it n times. Check closure and equal central angles 360°/n. Suggested rubric: 2 marks per polygon (1 centre/circumcircle, 1 equal chord stepping and closure), total 14.

### Q3 — regular nonagon, chord AC=40 mm, area enlargement 5:4

A regular nonagon has central angle 40° between adjacent vertices. If A and C are the labelled corners with B between them, chord AC subtends 80° at the centre. Therefore:
- Circumradius R = 40/[2 sin 40°] ≈ 31.11 mm.
- Circumdiameter ≈ 62.23 mm.
- Side length = 2R sin 20° ≈ 21.28 mm.
- For area ratio image:original=5:4, linear scale factor = √(5/4) ≈ 1.11803. Every corresponding side in the enlarged nonagon is 1.11803 times the original.

Construct the chord/circumcircle using the 80° central angle, divide the circle into nine equal 40° sectors, and step off the nine equal sides. Then apply the area-ratio scale factor using a geometric-mean construction or a pole and proportional rays. This interpretation depends on A and C being two vertices with one intervening vertex B. If “across corners” was intended to mean a diameter, the source is geometrically imprecise for an odd-sided polygon and needs author clarification.

Suggested rubric (8 marks): interpret AC as the two-step chord and derive radius (2); construct nine equal central divisions (2); close and label the nonagon (2); convert 5:4 area ratio to √(5/4) linear ratio and enlarge similar figure (2).

### Q4 — irregular hexagon and area reduction 3:5

Given AB=51, BC=30, CD=23, DE=36, EF=30, AD=70, AF=38, angle FAB=110° and angle ABC=88°:

1. Draw AB=51 mm.
2. At A construct the 110° ray and mark F=38 mm from A.
3. At B construct the 88° ray on the same side of AB as F and mark C=30 mm from B.
4. Locate D at the intersection of the circle centred at A radius 70 mm and circle centred at C radius 23 mm. Use the branch consistent with the labelled convex A-B-C-D-E-F outline.
5. Locate E at the intersection of the circle centred at D radius 36 mm and circle centred at F radius 30 mm. Use the source figure to choose the correct branch.
6. Join A-B-C-D-E-F-A and check all dimensions and angles.
7. For area ratio image:original=3:5, use linear factor √(3/5)=0.7745967 and construct a similar reduced hexagon.

Numerical branch check with AB horizontal and the convex branch: C≈(49.95,29.98) mm, F≈(−13.00,35.71) mm, D≈(46.12,52.66) mm, E≈(10.18,54.76) mm; polygon area ≈2,920.64 mm². Reduced area ≈1,752.38 mm². These coordinates are checks only; a drawn figure may be rigidly rotated/reflected.

Suggested rubric (12 marks): base and angle setup (2); F and C placed correctly (2); D located from AD/CD (2); E located from DE/EF (2); closed and labelled hexagon with checks (2); correct area-ratio conversion and similar reduction (2).

### Q5 — source irregular pentagon (image57) and area reduction 5:7

The figure labels AB=95 mm, BC=65 mm, CD=70 mm, DE=75 mm, diagonal BE=120 mm and angle BAE=90°. In right triangle ABE:
AE=√(BE²−AB²)=√5,975≈77.30 mm.

The remaining chain B-C-D-E is not uniquely located by BC, CD, DE and the fixed endpoints B/E alone: one degree of freedom remains unless an additional angle, diagonal or exact vertex-location condition is supplied. The illustrative raster outline is not a dimensioned geometric constraint. Therefore a unique exact pentagon and unique numerical reduced coordinates cannot be keyed from the supplied information. Do not select an arbitrary chain configuration.

If the author confirms a missing angle/diagonal or supplies a native dimensioned drawing, construct the pentagon from that constraint, then reduce its area in the ratio 5:7 using linear factor √(5/7)≈0.84515. The reduction method and factor are determinable; the original polygon itself is not uniquely specified.

Suggested rubric (6 marks): derive AE≈77.30 mm (2); identify and document the missing independent constraint (2); state and correctly apply the area-to-linear factor √(5/7) (2). Do not award construction-coordinate marks until the missing source constraint is resolved.

## Week Six–Seven weekend assignment — source figure keys

- Q1 / image58: K is the centre of a hexagon. The centre-to-base construction uses the 60°/45° reference triangles; the exact polygon type should be keyed from the labelled rays in the original image.
- Q2 / image61: quadrilaterals P and S have side ratio 1:4 (the baseline divisions show P at 3–4 units and S at 12–16 units; corresponding side ratios are 1:4).
- Q3 / image60: the three irregular hexagons J, K and M have side ratio 10:6:3 (option B). The labelled scale divisions provide the proportional side lengths.
- Q4 / image61: the pole O is at any convenient distance from L (option D); the ray construction preserves the required proportional geometry.
- Q5 / image62: rectangle ABCD : rectangle A1B1C1D1 is 7:5 (option A), as shown by the numbered proportional baseline.

For the weekend MCQs, retain the source's original option letters only where the source figure and options are unambiguous. The general pentagon construction described above remains under-specified and must not be treated as a uniquely solvable assessment.

## Verification boundary

This key contains original proposed solutions and marking rubrics, not an approved teacher marking scheme. All construction branches must be checked against the source diagrams during teacher review. Package schema/integrity success does not prove that a student-facing renderer displays the figures correctly. No teacher approval or live student UI rendering is claimed.
