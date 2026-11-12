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
- Q1–Q3 and Q5 depend on the specific constructions shown in images31–35. The source images are now registered, but a definitive option letter should be entered only after each question's exact figure and option mapping is checked against the original page. No option letters are guessed here.

## Notation and visual source recovery

The original Week Three XML contains 26 superscript-zero degree markers, one separate subscript punctuation run and two recoverable OMML equations. Their exact values/formulas are recorded in TD-FACT-W03-NOTATION.md. No source text was changed.

## Verification boundary

Original source figures are registered and their file integrity is tested. The construction methods and recoverable numerical values above are keyed; remaining MCQ/assessment marking, teacher approval and student UI rendering are still open.
