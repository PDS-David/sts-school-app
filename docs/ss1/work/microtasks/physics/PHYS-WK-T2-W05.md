# PHYS-WK-T2-W05 — Second Term Week Five: heat transfer

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages have been inspected. Lesson content approval remains PENDING and verification remains DEFERRED.

## Registered source identity and verification

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Member size: 466,432 bytes
- Parsed row: index 4, WEEK FIVE, “Heat Transfer - Conduction, Convection, Radiation and Their Applications”
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:b9ff6beb9eabb79d76839bfdefbdc9bf074d5950aaf71a329193c0f8f7e939bd`
- Parsed body length: 6,517 characters
- Parsed body SHA-256: `b9ff6beb9eabb79d76839bfdefbdc9bf074d5950aaf71a329193c0f8f7e939bd`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868. The run successfully executed `scripts/ss1/prepare_sources.py`, which verifies the archive SHA-256, exact manifest membership, member sizes and member SHA-256 values.

## Source content inventory

The source row covers:
- Conduction: transfer through a material; metals as good conductors; wooden/ebonite handles, metal cooking utensils, thick brick walls and the stone-floor/carpet comparison.
- Convection: transfer in liquids and gases; domestic water boilers, motorcar cooling, sea/land breezes, chimneys, ventilation, bonfires, room radiators, thermals/glider lift, wind and wall-mounted air conditioners.
- Radiation: transfer without a material medium; radiant energy/infrared; radiometer, thermopile and Leslie cube; clothing, factory roofs, light-coloured walls and cooking-surface applications.
- Thermos/vacuum flask: stopper, vacuum between double walls, silvered surfaces and insulating supports.
- Evaluation/theory: definitions of the three heat-transfer methods, two radiation applications and the thermos-flask construction question.
- Weekend assignment: five MCQs on silvering, dark clothing, wool as an insulator, copper/lead conductivity and the stone-floor/carpet comparison.

The evaluation and theory sections repeat the same two prompts; one answer key for each distinct prompt is sufficient.

## Source corrections and lesson additions

Correction record: `CORR-PHYSICS-T2-W05-HEAT-TRANSFER`.

- The source reverses/contradicts radiation-surface behaviour. Dull dark surfaces are generally good absorbers and good emitters; shiny polished surfaces are generally poor absorbers and poor emitters and reflect more radiation.
- Thermal radiation is electromagnetic; at ordinary temperatures it is mainly infrared. Infrared is not the name for all electromagnetic radiation.
- The source duplicates “conduction” in the stopper explanation. The corrected explanation is that the stopper reduces conduction and limits air movement/convection and evaporation.
- The source's radiator/room-shadow wording is unclear and is not repeated. The lesson explains rising warm air and convection currents accurately.
- The source weekend statement that a stone floor feels warm while a carpet feels cold is false. A stone floor usually feels colder because it conducts energy away from the feet faster; carpet traps air and insulates.
- The lesson body was expanded to include source-aligned applications that were previously missing: brick walls, stone floor/carpet, water boilers, engine cooling, chimneys, ventilation, bonfires, room radiators, thermals, winds, air conditioners, radiometer, thermopile and Leslie cube.

## Source assessments and answer keys

Eight distinct source assessment items were added as Q17–Q24:
- Q17: definitions of conduction, convection and radiation (3 marks).
- Q18: two applications of radiation (2 marks).
- Q19–Q23: all five weekend MCQs (5 marks).
- Q24: thermos-flask construction and heat exchange (5 marks).

The two evaluation questions are repeated verbatim in the theory section, so they are not duplicated. Added source assessment practice totals 15 marks. The lesson now has 24 fully answered questions.

## Rendered-source and visual disposition

The original .doc was rendered privately to PDF. WEEK FIVE occupies source pages 9–12:
- Page 10 contains a low-resolution conduction-rod/heat-flow figure. A dedicated original SVG replacement is still required; task `PHYS-ASSET-T2-W05-CONDUCTION-ROD-DIAGRAM` and open item `PHYSICS-T2-W05-CONDUCTION-DIAGRAM` have been added and block delivery until completed.
- Page 12 contains the thermos-flask question but no source flask diagram. The package already has original asset `PHYS-ASSET-T2-W05-VACUUM-FLASK`, attached to this lesson, which supplies the required labelled cutaway schematic. It is not represented as a recovered source figure.
- No other instructional figures were visible on pages 9–12; the recurring provider logo is a watermark, not a teaching asset.

## Package mapping

- Existing Week Five coverage entries remain `IMPLEMENTED_EQUIVALENT` and now include exact original-row evidence.
- Lesson: `SUP-SS1-PHYSICS-T2-W05-HEAT-TRANSFER`
- Updated body SHA-256: `56fe0d8e691501b99043eb99e99736f2cdb2bf0b7f67771da3dd738e121f81a1`
- Practice: 24 questions; the new source-aligned assessment block adds 15 marks.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original archive staging and Physics member verification: passed in workflow run 43126374868.
- Original row text and rendered pages 9–12 inspected.
- JSON parse, body SHA-256, question-ID uniqueness, answer presence, marking totals, queue recount and coverage references checked before commit.
- Full package tests, importer and SVG safety for this new commit: not yet run; testing remains deferred until CI.
