# PHYS-WK-T2-W07 — Second Term Week Seven: gold-leaf electroscope and lightning protection

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages have been inspected. Lesson content approval remains PENDING and verification remains DEFERRED.

## Registered source identity

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Member size: 466,432 bytes
- Parsed row: index 6, WEEK SEVEN
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:ff0474d250d038ced292af853aeea78bbc2ffbd31f3792df61ac11f1544957d8`
- Parsed body length: 4,364 characters
- Parsed body SHA-256: `ff0474d250d038ced292af853aeea78bbc2ffbd31f3792df61ac11f1544957d8`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868. The run successfully executed `scripts/ss1/prepare_sources.py`, verifying the archive SHA-256, exact manifest membership, member sizes and member hashes.

## Source content inventory

The original row covers:
- Gold-leaf electroscope: brass cap/disc, metal rod, gold/aluminium leaf, insulating stopper and earthed metal case with glass windows.
- Uses: testing whether an object is charged; comparing charge sign using a known charged electroscope; testing conductivity/insulation by observing charge leakage and leaf collapse.
- Charging an insulated body by contact and by induction.
- Induction sequence: bring a charged rod near without contact, earth the conductor momentarily, remove the Earth connection and then remove the inducing rod.
- Lightning as an electrical discharge and lightning conductors as building protection.
- Evaluation: two uses of an electroscope; draw a labelled electroscope; state the function of lightning conductors; define lightning.
- Weekend assignment: five MCQs on charge detection, lightning protection, the sensitive electroscope part, earthing the case and capacitor storage.
- Theory: explain two uses of the electroscope and draw a labelled diagram. The diagram prompt repeats the evaluation prompt.

## Source corrections and student supplement additions

Correction record: `CORR-PHYSICS-T2-W07-INDUCTION-LIGHTNING`.

- The source says positive charge “conducts away” when the body is earthed. In a metal conductor, electrons move: with a positive inducing rod, electrons flow from Earth into the conductor.
- The source says a negative inducing rod leaves the body negative. The correct sequence leaves the isolated conductor positive: electrons are repelled and flow to Earth. In both cases the final induced charge is opposite to the inducing rod. The Earth connection must be removed before the inducing rod.
- The source says a lightning conductor ionizes air and discharges the cloud before a lightning flash. This is not the modern protection mechanism. A properly bonded and grounded system intercepts a strike, provides a conductive path and disperses current safely into Earth; it does not prevent lightning or reliably discharge the cloud in advance. See the National Weather Service “Lightning Rods” guidance: https://www.weather.gov/safety/lightning-rods.
- The source repeatedly uses “lighting” where “lightning” is intended.
- The source's MCQ about the earthed casing has a mismatched statement/options. It has been rewritten to ask directly why the casing is earthed; the keyed answer is screening from external electrical interference.

## Source assessments and answer keys

Ten distinct source assessment items were added as Q17–Q26 (20 marks):
- Q17–Q18: two uses of the electroscope and a labelled electroscope diagram.
- Q19–Q20: function of a lightning conductor and definition of lightning.
- Q21–Q25: all five weekend MCQs, with the malformed casing item clarified.
- Q26: explanation of two electroscope uses.

The theory diagram question repeats the evaluation diagram question and is keyed once. The lesson now contains 26 questions with complete answers and marking arrays.

## Rendered-source and visual disposition

The original .doc was rendered privately to PDF. WEEK SEVEN occupies source pages 14–16:
- Page 14 contains the original gold-leaf electroscope figure. Registered original replacement: `PHYS-ASSET-T2-W07-GOLD-LEAF-ELECTROSCOPE`.
- Page 15 contains the original three-stage induction figure. Registered original replacement: `PHYS-ASSET-T2-W07-CHARGING-INDUCTION`. The SVG explicitly shows disconnecting Earth before removing the inducing rod.
- The source contains no lightning-conductor diagram. The lesson explains the modern protection path in text; no source figure is claimed or fabricated.
- Repeated provider branding is a watermark, not a teaching asset.

## Package mapping

- Coverage entries `COV-PHYS-T2-W07-OBJ-1` through `OBJ-4` remain `IMPLEMENTED_EQUIVALENT` and now cite exact original row and visual evidence.
- Lesson: `SUP-SS1-PHYSICS-T2-W07-GOLD-LEAF-ELECTROSCOPE`
- Updated body SHA-256: `e6f0548cd1a7e22470dfe274707d026171ce8d9d77692ce7b7e3334a7b740970`
- Practice: 26 questions; new source-aligned block adds 20 marks.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original archive staging and Physics member verification: passed in workflow run 43126374868.
- Original row text and rendered pages 14–16 inspected.
- Existing electroscope and induction SVGs are registered and attached to the lesson.
- JSON parse, body SHA-256, question-ID uniqueness, answer presence, marking totals, queue recount and coverage references checked before commit.
- Full package tests, importer and SVG safety for this new commit: not yet run; testing remains deferred until CI.
