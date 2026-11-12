# PHYS-WK-T2-W03 — Second Term Week Three: thermal expansion of solids

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row has now been inspected. Lesson content approval remains PENDING and verification remains DEFERRED.

## Registered source identity and verification

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Member size: 466,432 bytes
- Parsed row: index 2, WEEK THREE, “Expansion of Solid, Effect and Applications of Expansion”
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:35319222af7c43db21bfd51b1f897b2b74d81ebe320d3b8f97de427db549e303`
- Parsed body length: 2,792 characters
- Parsed body SHA-256: `35319222af7c43db21bfd51b1f897b2b74d81ebe320d3b8f97de427db549e303`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868. The run successfully executed `scripts/ss1/prepare_sources.py`; that script checks the full source archive SHA-256, exact manifest membership, each member size and each member SHA-256. The three Physics member sizes and hashes were also independently checked against `SOURCE_ASSIGNMENTS.csv`.

## Source content inventory

The scheme objective is one combined objective: expansion of solids, its effects and applications. The original row teaches:

- Effects/applications: hot-water cracking of a glass tumbler from uneven expansion; noise from zinc roofing; bridge rollers; bottle-stopper removal; concrete expansion spaces; railway-track gaps; bimetallic strips in thermostats.
- Advantages: fire alarms/electric bells, wheel-rim fitting, bimetallic thermometers, hot riveting and bimetallic temperature controls/electric cookers.
- Disadvantages: glass cracking, watch-balance temperature effects, bridge movement, overhead-wire sag, railway-track distortion and pipe bursting.
- Evaluation: (1) mention four effects; (2) mention four advantages and disadvantages.
- Reading assignment: New School Physics, pp. 37–42.
- Weekend assignment: five multiple-choice questions on railway expansion gaps, glass cracking, bottle stoppers, useful applications and cooling of solids.
- Theory: the same two prompts as the evaluation section. These are duplicates, not four distinct theory questions.

There is no formula or unit prescribed in the Week Three source row. The lesson's linear-expansion calculation is explicitly labelled as a Week Four extension.

## Rendered-source and visual disposition

The original .doc was rendered privately to PDF for inspection. WEEK THREE occupies source pages 6–7. Those pages contain a repeated provider logo/header watermark and the text listed above; there is no instructional diagram or figure in the row. The watermark is not treated as a teaching asset. No image asset is required for this row. The wider three-term visual inventory remains open under `PHYSICS-SOURCE-VISUAL-INVENTORY`.

## Source corrections and factual disposition

Correction record: `CORR-PHYSICS-T2-W03-THERMAL-EXPANSION`.

- The source says overhead wires sag because of contraction in winter. The student lesson correctly explains that wires expand and sag more in heat; cooling contracts them.
- The bottle-stopper example is clarified: warming the glass neck enlarges its opening and can loosen the stopper.
- “Bursting of water metal pipes” is clarified: freezing water expands inside a pipe; the metal pipe is not simply bursting because it expands.
- The source's bridge disadvantage sentence is incomplete in the original rendered document. Its missing ending is not guessed; the lesson independently explains thermal movement and structural damage.
- The watch-balance statement says expansion makes the watch fast. This is not repeated. Expansion of an uncompensated balance wheel increases its moment of inertia and tends to lengthen its oscillation period; the total watch rate also depends on the hairspring and temperature compensation. See the Seiko Museum and Watch Museum references in the correction record. Bounded follow-up `PHYS-FACT-T2-W03-WATCH-BALANCE` is resolved.

## Assessment answer-key coverage

Seven source-aligned assessment items were added to `SUP-SS1-PHYSICS-T2-W03-THERMAL-EXPANSION-SOLIDS`:

- Q14–Q18: all five source weekend MCQs, with answer options, keyed answers and one mark each.
- Q19: the evaluation/theory prompt on four effects of thermal expansion, keyed for four marks.
- Q20: the repeated evaluation/theory prompt on four advantages and four disadvantages, keyed for eight marks.

The original evaluation and theory sections repeat the same two prompts; one keyed item for each distinct prompt covers both. Added source-assessment practice totals 17 marks. The lesson now contains 20 questions with complete answers and marking arrays. Each new item's marking sums to its question total.

## Package mapping

- Coverage: `COV-PHYS-T2-W03-OBJ-1` remains `IMPLEMENTED_EQUIVALENT`, bound to the exact source body identity and the authored supplement.
- Lesson: `SUP-SS1-PHYSICS-T2-W03-THERMAL-EXPANSION-SOLIDS`
- Existing lesson body SHA-256 is unchanged; only the practice array and provenance locator were updated.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original archive staging step and Physics member hashes: passed in workflow run 43126374868.
- Independently checked the three extracted Physics member sizes and SHA-256 values against the manifest: passed.
- Source row text and rendered pages inspected: passed.
- JSON parse, question-ID uniqueness, answer presence, marking totals and coverage references: checked before commit.
- Full package tests, SVG safety, importer and database/device verification: not run in this item; testing remains deferred.
