# PHYS-WK-T2-W08 — Second Term Week Eight: fields and gravity

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages have been inspected. Lesson content approval remains PENDING and verification remains DEFERRED.

## Registered source identity

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Member size: 466,432 bytes
- Parsed row: index 7, WEEK 8
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:07b01d34682899f09096e2ac8cd0fb977b722b3d3ffcb6a276bf42f6d5488e96`
- Parsed body length: 3,122 characters
- Parsed body SHA-256: `07b01d34682899f09096e2ac8cd0fb977b722b3d3ffcb6a276bf42f6d5488e96`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868. The run successfully executed `scripts/ss1/prepare_sources.py`, verifying archive SHA-256, exact manifest membership, member sizes and member hashes.

## Source content inventory

The original row covers:
- Field as a region/space under the influence of a physical agency; gravitational, electric and magnetic field types.
- Gravitational field and force of gravity.
- Newton's law of universal gravitation, including direct proportionality to the product of masses and inverse-square dependence on centre-to-centre distance.
- Acceleration due to gravity, average value about 9.81 m s⁻², and free fall without air resistance.
- Magnetic field, mapping with iron filings and a plotting compass, and the definition of a line of force by its tangent direction.
- Evaluation: define field; state Newton's law; define magnetic field; define gravitational field.
- Weekend theory: define gravitational field and acceleration due to gravity and describe variation with latitude; explain a field and name three types.

## Supplement gaps corrected

The existing lesson already taught field concepts, gravitational field strength, weight, free fall and the conditions for `g = 2h/t²`, but it did not explicitly teach two source objectives. The body now adds:
- Newton's law `F = Gm₁m₂/r²`, definitions of the variables, SI units and the approximate SI value of G.
- Magnetic-field definition and field-line mapping using iron filings/compass; tangent direction and N-to-S direction outside a bar magnet.
- The source's latitude question: effective g is generally smaller at the equator and increases towards the poles because of Earth's rotation and shape.

## Source assessments and answer keys

Six source-aligned questions were added as Q16–Q21 (17 marks):
- Q16–Q17: field definition and Newton's law.
- Q18–Q19: magnetic and gravitational field definitions.
- Q20: gravitational field, acceleration due to gravity and latitude variation.
- Q21: field concept and three field types.

The source has no weekend MCQ block; no questions have been invented to fill one. The lesson now has 21 fully answered questions with marking totals.

## Rendered-source and visual disposition

The original .doc was rendered privately to PDF. WEEK 8 occupies source pages 16–18:
- Page 17 contains the Newton's law formula; the equation is visible in the original rendering even though the text extraction loses its formatting.
- Page 18 contains the bar-magnet magnetic-field-line figure. The package already registers original replacement asset `PHYS-ASSET-T2-W08-MAGNETIC-FIELD`, attached to this lesson. It is a newly authored teaching aid, not a recovered source image.
- No gravity-specific figure is present in the source row.

## Package mapping

- Coverage entries `COV-PHYS-T2-W08-OBJ-1` through `OBJ-5` remain `IMPLEMENTED_EQUIVALENT` and now cite the inspected source row and magnetic-field visual.
- Lesson: `SUP-SS1-PHYSICS-T2-W08-FIELDS-GRAVITY`
- Updated body SHA-256: `6e70b3eca81d3bca4c8caebd81307fb952c1efae92e73ee585d2786f60bce7e0`
- Practice: 21 questions; the source-aligned assessment block adds 17 marks.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original archive staging and Physics member verification: passed in workflow run 43126374868.
- Original row text and rendered pages 16–18 inspected.
- Existing magnetic-field SVG is registered and attached to the lesson.
- JSON parse, body SHA-256, question-ID uniqueness, answer presence, marking totals, queue recount and coverage references checked before commit.
- Full package tests, importer and SVG safety for this new commit: not yet run; testing remains deferred until CI.
