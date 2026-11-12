# PHYS-WK-T2-W10 — Second Term Week Ten: production of continuous electric current

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages have been inspected. Source indexing and assessment keys are complete; a detailed visual aid remains a delivery blocker.

## Registered source identity

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Member size: 466,432 bytes
- Parsed row: index 9, WEEK TEN, “PRODUCTION OF CONTINUOUS ELECTRIC CURRENT”
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:d65e459bdba0977fcfff1e1e41b8575ae84d30783a01a4756060e9dad9f20da6`
- Parsed body length: 3,040 characters
- Parsed body SHA-256: `d65e459bdba0977fcfff1e1e41b8575ae84d30783a01a4756060e9dad9f20da6`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868; source-staging verified archive SHA-256, manifest membership, member size and member hash.

## Source content inventory

The source row covers:
- Continuous current, electric charge, current, emf and potential difference.
- Mechanical generation: a prime mover drives an armature/rotor in a magnetic field; changing flux induces an emf.
- Chemical generation: a cell uses two dissimilar electrodes in an electrolyte to convert chemical energy into electrical energy.
- Heat generation: a thermocouple uses dissimilar metals and a temperature difference to produce an emf.
- Solar generation: a photovoltaic cell converts light energy into electrical energy.
- Two diagram-based evaluation prompts, five weekend MCQs and two theory questions. The theory's mechanical-generation prompt repeats the first evaluation; the heat-generation prompt is distinct.

## Source corrections

Correction records:
- `CORR-PHYSICS-T2-W10-GALVANIC-CELL-POLARITY`: the source gives positive anode/negative cathode for a chemical cell generating current. In a galvanic cell delivering current, the anode is negative (oxidation) and cathode positive (reduction). The lesson corrects the polarity and distinguishes galvanic from electrolytic cells.
- `CORR-PHYSICS-T2-W10-PHOTOVOLTAIC-TERMINOLOGY`: the source calls solar-cell operation the photoelectric effect. The lesson uses the more precise photovoltaic effect for semiconductor solar cells.

The lesson also clarifies that a DC generator uses a commutator/rectifier arrangement for unidirectional output; an alternator with slip rings produces alternating current.

## Source assessments and answer keys

Eight distinct source assessment items were added as Q19–Q26 (19 marks):
- Q19: mechanical-to-electrical generation diagram and explanation (5 marks).
- Q20: chemical-cell diagram and explanation (5 marks).
- Q21–Q25: all five weekend MCQs (5 marks).
- Q26: heat-to-electrical generation with a thermocouple diagram (4 marks).

The repeated mechanical-generation theory prompt is keyed once. The lesson now has 26 questions with complete answers and marking arrays.

## Rendered-source and visual disposition

The original .doc was rendered privately to PDF. WEEK TEN occupies source pages 20–22. Pages 21–22 contain the evaluation, MCQs and theory prompts; no instructional generator, cell or thermocouple figure is present in the original source.
- Existing registered asset `PHYS-ASSET-T2-W10-CONTINUOUS-CURRENT` is a four-source overview and is attached to the lesson.
- That overview does not show the detailed generator armature/field/commutator, galvanic-cell electrodes/electrolyte or thermocouple hot/cold junctions required to support the diagram questions. A new delivery-blocking visual item `PHYS-ASSET-T2-W10-DETAILED-GENERATION-DIAGRAMS` and open item `PHYSICS-T2-W10-DETAILED-GENERATION-DIAGRAMS` have been added.

## Package mapping

- Coverage entries `COV-PHYS-T2-W10-OBJ-1` through `OBJ-5` remain `IMPLEMENTED_EQUIVALENT` and now include exact original-row evidence.
- Lesson: `SUP-SS1-PHYSICS-T2-W10-CONTINUOUS-CURRENT`
- Practice: 26 questions; source-aligned additions total 19 marks.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original source row and rendered pages 20–22 inspected.
- Original archive member identity checked against the verified source manifest.
- JSON parse, unique practice IDs, answer presence, marking totals, coverage references and queue recount checked before commit.
- Full package tests, importer and SVG safety for this commit: pending CI.
