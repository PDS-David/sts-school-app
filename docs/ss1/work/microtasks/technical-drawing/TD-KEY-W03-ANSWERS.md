# TD-KEY-W03-ANSWERS — Week Three polygon constructions

**Status:** PARTIAL — source figures are now registered; several construction methods and numerical answers are keyed. Diagram-dependent MCQ options and the complete assessment rubric remain open.

## Package implementation

Lesson ID: `SUP-SS1-TECHNICAL-DRAWING-T2-W03-POLYGON-CONSTRUCTIONS`. Six marked practice questions cover definitions, regular-polygon angles, octagon and hexagon construction, the common-base two-triangle method and under-specified geometry. The 18 original Week Three media assets are registered and byte/hash tested.

## Verified angle and construction keys

For a regular n-sided polygon:
- Exterior angle = 360°/n.
- Interior angle = 180°−360°/n.

Pentagon: 72°/108°; hexagon: 60°/120°; heptagon: approximately 51.43°/128.57° (the source rounds to 52°/128°); octagon: 45°/135°; nonagon: 40°/140°.

A regular hexagon inscribed in a circle has side equal to the radius. A regular octagon can be constructed by bisecting the four right-angle quadrants to obtain eight points at 45° intervals. The common-base two-triangle method starts with a 45° triangle for the square and a 60° triangle for the hexagon; the centre positions are then stepped/interpolated to locate the remaining regular polygons.

## Source evaluation / theory

### Pentagon with the two diagonals AD and BD

The original figure image30 gives AB=30 mm, AD=70 mm and BD=60 mm. The text supplies BC=40 mm, CD=35 mm, DE=55 mm and ∠DEA=90°.

- Construct triangle ABD from sides 30, 60 and 70 mm by intersecting arcs.
- Locate C from the intersection of circles centred at B (radius 40 mm) and D (radius 35 mm), choosing the intersection consistent with the labelled polygon order in the source figure.
- In right triangle AED, AD=70 mm is the hypotenuse and DE=55 mm. Therefore AE=√(70²−55²)=√1,875≈**43.30 mm**.
- Complete E using the perpendicular at E and join the polygon in order A-B-C-D-E.
- The equal-area reduction to a triangle follows the source's diagonal/common-base construction; preserve the source figure and mark the transfer lines rather than infer a different polygon.

### Irregular hexagon

Given AB=51, BC=30, CD=23, DE=36, EF=30, AD=70, AF=38, ∠FAB=110° and ∠ABC=88°:
1. Draw AB=51 mm.
2. At A construct the 110° ray and mark F at 38 mm.
3. At B construct the 88° ray and mark C at 30 mm.
4. Locate D as the intersection of the circle centred at A radius 70 mm and circle centred at C radius 23 mm, choosing the intersection consistent with the source figure.
5. Locate E as the intersection of circles centred at D radius 36 mm and F radius 30 mm.
6. Join A-B-C-D-E-F-A. If either pair of circles has two intersections, use the source figure to choose the intended branch; do not select by arbitrary preference.

## Weekend objective questions

- Q4 (re-entrant polygon): choose the concave polygon with one interior angle greater than 180°. The exact option letter depends on the labelled source figure and option order.
- Q1 / image31: **D — length of sides**. The figure is the two-circle construction for a regular pentagon from a known side AB.
- Q2 / image32: **B — distance across corners**. The figure constructs the regular heptagon from a circle whose diameter is the given across-corners distance.
- Q3 / image33: **C — regular polygon**. The numbered diameter divisions and intersecting arcs are the initial construction of a regular polygon.
- Q4 / image34: **C**. It is the only concave/re-entrant polygon (one interior angle exceeds 180°).
- Q5 / image35: **C — pentagon**. The two-circle construction divides the semicircle into five equal parts and uses the second division to locate the regular pentagon centre.

## Notation and visual source recovery

The original Week Three XML contains 26 superscript-zero degree markers, one separate subscript punctuation run and two recoverable OMML equations. Their exact values/formulas are recorded in TD-FACT-W03-NOTATION.md. No source text was changed.

## Verification boundary

Original source figures are registered and their file integrity is tested. The construction methods and recoverable numerical values above are keyed; remaining MCQ/assessment marking, teacher approval and student UI rendering are still open.


## Source construction marking criteria (proposed teacher rubric)

These are original marking criteria for the supplied construction tasks; they are not claimed to be the source author's original marking scheme.

### Theory Q1 — dimensioned pentagon (10 marks)

- Draw AB=30 mm and construct triangle ABD with AD=70 mm and BD=60 mm (2).
- Locate C using BC=40 mm and CD=35 mm, selecting the branch consistent with the source vertex order (2).
- Construct the right-angle locus for E (∠DEA=90°) and intersect it with the circle centred at D, radius DE=55 mm (2).
- Calculate AE=√(70²−55²)=43.30 mm and show the perpendicular/right-angle condition (2).
- Join and label A-B-C-D-E in order; maintain dimensions and construction lines legibly (2).

### Theory Q2 — irregular hexagon (10 marks)

- Draw AB=51 mm and the 110° ray at A; locate F at AF=38 mm (2).
- Draw the 88° ray at B; locate C at BC=30 mm (2).
- Locate D from AD=70 mm and CD=23 mm using intersecting arcs (2).
- Locate E from DE=36 mm and EF=30 mm using intersecting arcs (2).
- Join and label A-B-C-D-E-F-A; retain the correct intersection branch and dimension labels (2).

### General revision — regular polygons on a common 40 mm base (14 marks)

Award 2 marks each for the square, pentagon, hexagon, heptagon, octagon, nonagon and decagon: 1 mark for a correctly located centre/circumcircle using the two-triangle method, and 1 mark for stepping off equal sides and closing the polygon with equal central spacing. The base AB=40 mm is common to all seven figures.

### General revision — nonagon across corners 40 mm (6 marks)

- Draw the circumcircle with diameter 40 mm (1).
- Divide the horizontal diameter into nine equal parts and construct the endpoint arcs (2).
- Locate the chord representing one side using the second division and the source general method (1).
- Step the chord around the circle to obtain nine equal sides and close/label the nonagon (2).

### Area reduction after construction

For an area ratio image:original = 3:5, the linear scale factor is √(3/5)=0.7746 (2 marks). Award remaining marks for a correct pole/ray or geometric-mean construction, parallel corresponding edges, consistent image:original ratio, and a closed similar polygon. Do not use 3/5 as the linear scale factor when the ratio is explicitly an area ratio.

