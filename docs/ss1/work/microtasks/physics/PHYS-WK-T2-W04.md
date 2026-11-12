# PHYS-WK-T2-W04 — Second Term Week Four: expansivity

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages have been inspected. Lesson content approval remains PENDING and verification remains DEFERRED.

## Registered source identity and verification

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Member size: 466,432 bytes
- Parsed row: index 3, WEEK FOUR, “Expansivity and Its Application - Linear, Area and Volume. Anomalous Expansion of Water. Real and Apparent Expansivity”
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:91638b728db1f23707da658c9c90880c47e24ae593c5c06cdda6802d098fa94c`
- Parsed body length: 4,238 characters
- Parsed body SHA-256: `91638b728db1f23707da658c9c90880c47e24ae593c5c06cdda6802d098fa94c`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868. The run successfully executed `scripts/ss1/prepare_sources.py`, which verifies the complete archive SHA-256, exact manifest membership, member sizes and member SHA-256 values. All three Physics members were independently checked against `SOURCE_ASSIGNMENTS.csv`.

## Source content and formula inventory

The row covers five objective areas:

1. Linear expansivity of solids: definition, coefficient, formula, change/final length and a brass-rod worked example.
2. Area expansivity: definition, coefficient, relation to linear expansivity and derivation of the approximate area formula.
3. Cubical expansivity of solids/liquids: definition, formula and relation to linear expansivity.
4. Real and apparent cubic expansivity of a liquid in an expansible vessel.
5. Anomalous expansion of water from 0 °C to 4 °C and normal expansion above 4 °C.

The source's brass example is correct: a 2 m rod, `α=18×10⁻⁶ K⁻¹`, and `ΔT=100 K` gives `L₂=2.0036 m`. The area derivation includes the small squared term `(αΔT)²` and then correctly neglects it for small expansion. The volume coefficient is stated as three times the linear coefficient. The real/apparent relation is `γᵣ=γₐ+γ_container`.

## Source corrections

Correction record: `CORR-PHYSICS-T2-W04-EXPANSIVITY-NOTATION`.

- The rendered linear-expansion derivation on source page 7 displays `X` where the coefficient `α` is required.
- The source uses `Y` for cubical expansivity and prints `α:β:Y=1:2`, although it also states `Y=3α`. The student supplement normalises this to `γ` and the approximate isotropic-solid ratio `α:β:γ=1:2:3`.
- The area coefficient unit is printed as “per 8C”; the intended temperature interval unit is per °C, equivalent in interval size to K. The lesson uses SI `K⁻¹`.
- The source heading says “real and apparent cubic expansivity of water”, but the definition concerns a liquid in an expansible vessel generally. The lesson explains real and apparent liquid expansion.
- The source's anomalous-water description is correct but does not state maximum density at about 4 °C; the lesson adds this key explanation.

## Source assessments and answer keys

Nine original assessment prompts were added to `SUP-SS1-PHYSICS-T2-W04-EXPANSIVITY` as Q21–Q29, with answers and complete marking:

- Q21: evaluation — final length of a 2 m brass rod after a 90 K rise (2.000324 m).
- Q22: evaluation — derivation of the approximate area-expansion expression.
- Q23–Q27: all five weekend MCQs, covering the 0–4 °C interval, SI unit, area coefficient, linear coefficient calculation and mercury cubical expansivity.
- Q28–Q29: both theory questions, covering anomalous water behaviour and the volume increase of an iron cube (0.027 cm³).

The source weekend assignment numbering jumps from question 4 to question 6. No missing question 5 has been invented. The nine added items total 20 marks. The lesson now contains 29 questions with complete answers and marking arrays.

## Rendered-source and visual disposition

The original .doc was rendered privately to PDF. WEEK FOUR spans source pages 7–9. The pages contain the source text and a repeated provider watermark but no instructional diagram. However, the source theory prompt explicitly asks students to explain anomalous water behaviour “with the aid of a diagram”. This is a real visual gap, not an extraction artefact. A separate delivery-blocking asset task, `PHYS-ASSET-T2-W04-ANOMALOUS-WATER-DIAGRAM`, and open item `PHYSICS-T2-W04-ANOMALOUS-WATER-DIAGRAM` have been added. The SVG has not yet been created; do not claim visual completion.

## Package mapping

- Coverage entries `COV-PHYS-T2-W04-OBJ-1` through `OBJ-5` remain `IMPLEMENTED_EQUIVALENT` and are now tied to the inspected source row and authored supplement.
- Lesson: `SUP-SS1-PHYSICS-T2-W04-EXPANSIVITY`
- Lesson body SHA-256 is unchanged; the practice array and source provenance locator were updated.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original archive staging and Physics member verification: passed in workflow run 43126374868.
- Original row text and rendered pages 7–9 inspected.
- JSON parse, question-ID uniqueness, answer presence, mark totals, queue recount and coverage references checked before commit.
- Full package tests, importer, SVG safety and database/device verification for this new commit: not yet run; testing remains deferred until CI.
