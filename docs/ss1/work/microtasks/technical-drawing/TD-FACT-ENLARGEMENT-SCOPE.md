# TD-FACT-ENLARGEMENT-SCOPE — Week Six–Seven source reconciliation and construction inventory

**Status:** IMPLEMENTED — TESTING DEFERRED. The original combined Week Six–Seven row teaches **both reduction and enlargement**. The earlier blocked conclusion that only reduction appeared in the row was caused by the source member being unavailable in that execution; the original DOCX is now inspected directly. The combined source lesson identity is preserved. The independently authored enlargement supplement is retained as optional reinforcement, not as the sole coverage for the scheme objective.

## Source identity and method

- Source ID: `SS1-SRC-af4868d2c026`.
- Source member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Combined Week Six–Seven lesson ID/body SHA-256: `SS1-SRC-af4868d2c026:BODY:97461c6ebcdd67d8af003002e111d7a1ffe244724f382b3c35c79d88585dbc05`.
- Parsed row 16; `word/document.xml` body children [1009, 1210); source PDF pages 27–30.
- The row title is “Reduction of plain figures”, but the body explicitly contains both “Reduction of similar figures” (child 1017) and “Enlargement of similar figures” (child 1069). The body also explains that enlargement uses the same method as reduction, with the scale factor greater than one.
- The 11 DrawingML figures and the one OLE/WMF preview are individually inventoried in `TD-VIS-W06-W07.md`.

## Direct evidence that enlargement is taught

| XML body child | Source wording / evidence | Classification |
|---:|---|---|
| 1013–1014 | Content lists “Reduction of similar figures” and “Enlargement of similar figures”. | Both objectives are explicitly in the teaching content. |
| 1017 | Section heading “Reduction of similar figures”. | Reduction section. |
| 1069 | Section heading “Enlargement of similar figures”. | Enlargement section. |
| 1071–1073 | The source states that the enlargement method is the same as reduction, but enlargement increases size; it contrasts 2:5 (reduction) with 5:2 (enlargement). | Direct conceptual teaching of enlargement and ratio direction. |
| 1075–1087 | Example 1 constructs a similar polygon with **area ratio 5:3**, explicitly described as an enlargement scale. The semicircle/perpendicular construction uses 5 and 3 divisions and parallel lines to obtain the enlarged polygon. | Worked area-enlargement construction. |
| 1088–1105 | Example 2 enlarges a given figure from pole T using rays through visible edges, perpendicular projections, arcs and corresponding points. | Worked figure-enlargement construction. |
| 1107–1108 | Evaluation asks for a regular pentagon of side 30 mm enlarged in ratio **3:2**. | Applied linear enlargement exercise. |

The scheme objective “Enlargement and reduction of plain figures” for both Weeks 6 and 7 is therefore supported by the original combined lesson. The source row must remain one combined lesson; do not split it into two fabricated source bodies.

## Reduction construction inventory

| XML body child | Source task and method | Ratio / dimensions |
|---:|---|---|
| 1019–1034 | Reduce rectangle ABCD to similar rectangle A1B1C1D1. Draw the original; choose pole P; radiate to all four corners; divide PA into five equal parts; use the third division to draw A1D1 parallel to AD; repeat for remaining sides. | Image : original = **3:5** (linear). The source gives no fixed rectangle dimensions in the paragraph. |
| 1036–1050 | Reduce polygon ABCDE. Construct the given polygon from supplied data; radiate from A through B, C, D and E; divide AB into five; from the fourth division draw B1C1, C1D1 and D1E1 parallel to the corresponding original sides. | Image : original = **4:5** (linear). |
| 1052–1063 | Construct a similar polygon in **area ratio 3:5**. Radiate from B to D/E; extend AB; mark five equal units; draw semicircles on A–5 and A–3; erect a perpendicular at B to meet them at 3₁/5₁; use the resulting parallel construction to locate A1 and the remaining vertices. | **3:5 area ratio**, not a linear 3:5 side ratio. |
| 1065–1067 | Evaluation: construct a regular hexagon with side 40 mm and reduce it by 3:5; reduce a 40×60 photo frame by 4:7. | 3:5 and 4:7 linear ratios as worded in the questions. |

## Enlargement construction inventory

| XML body child | Source task and method | Ratio / dimensions |
|---:|---|---|
| 1071–1087 | Enlarge a similar polygon in **area ratio 5:3**. Extend AB; mark five units; draw semicircles on A–5 and A–3; erect a perpendicular at B; use 3₁/5₁ and a parallel to locate A1 and the remaining image vertices. | **5:3 area ratio**; source explicitly calls it an enlargement scale. |
| 1088–1105 | Enlarge a given stepped/object figure from pole T. Extend the base line; draw rays from T through visible edges; project perpendiculars to the base; use arcs from A to locate corresponding positions; project through the enlarged height A1B1 to obtain the enlarged outline. | The method is given, but the source does not state a numerical scale factor for this example. |
| 1107–1108 | Enlarge a regular pentagon ABCDE with side 30 mm. | Image : original = **3:2** (linear). |

## General evaluation, assignments and source dimensions

- Body children 1112–1113: construct pentagon ABCDE with AB=40, BC=35, CD=65, AE=45, ED=55, ∠ABC=120°, ∠BAE=105°; then construct a similar pentagon with **area ratio 3:5**.
- Body children 1114–1115: construct square, pentagon, hexagon, heptagon, octagon, nonagon and decagon on a common 30 mm base.
- Body children 1116–1117: construct a nonagon with distance across corners A/C=40 mm; construct a similar nonagon with **area ratio 5:4**.
- Body children 1118–1120: construct irregular hexagon ABCDEF with AB=51, BC=30, CD=23, DE=36, EF=30, AD=70, AF=38, ∠FAB=110°, ∠ABC=88°; construct a similar hexagon with **area ratio 3:5**.
- Body children 1132–1133: construct the irregular pentagon shown in image57 and reduce its area in ratio **5:7**.
- Weekend objective questions at body children 1147–1185 test the polygon formed about centre K, side ratios among quadrilaterals P–T, ratios of three irregular hexagons J/K/M, the location of enlargement centre O, and the side ratio of rectangles ABCD/A1B1C1D1. Their figures and options are retained in `TD-VIS-W06-W07.md`; keyed answers remain in `TD-KEY-W06-W07-ANSWERS`.
- Theory question 1 (body children 1194–1196) uses diagonals AD=70, BD=60 and AB=30 from the repeated triangle ABD figure; it supplies BC=40, CD=35, DE=55 and ∠DEA=90°, then asks for AE. This triangle is visually repeated in Week Three image30 and Week Eight–Nine image83; cross-row derivative reuse is tracked by `TD-ASSET-W06-W07-F12` and `TD-ASSET-W08-W09-F20`.
- Theory question 2 (body children 1204–1207) gives AB=51, BC=30, CD=23, DE=36, EA=38, ∠EAB=110°, ∠ABC=88°; construct the pentagon and a similar figure with **area ratio 5:3**.

## Coverage decision and supplement disposition

- The original combined lesson directly covers reduction and enlargement. Bind the same original source lesson ID to the Week Six and Week Seven scheme objectives without splitting or changing its body hash.
- Retain `SUP-SS1-TECHNICAL-DRAWING-T2-W06-ENLARGEMENT` as independently authored supplementary explanation/practice, but it is no longer the only/equivalent coverage. It must not be used to imply that the original source lacked enlargement.
- Exact figures are inventoried in `TD-VIS-W06-W07.md`; derivatives and package asset bindings remain pending in `TD-ASSET-W06-W07-F01..F12`.
- Full answer keys and marking criteria remain open in `TD-KEY-W06-W07-ANSWERS`.

## Checks and limits

- Confirmed the original source member SHA-256 and original lesson body identity.
- Inspected the full source text of the combined row and identified explicit reduction and enlargement sections, construction examples, ratios and exercises.
- Confirmed 11 DrawingML placements, 11 unique raster parts and one OLE/WMF preview; visual dispositions are in TD-VIS-W06-W07.md.
- No original source bytes changed. No derivative assets, answer keys, package tests/compiler/importer or app display verification are claimed.
- No approval, certification or deployment is claimed.
