# PHYS-WK-T2-W04 — source indexing and defect record

Status: `IMPLEMENTED_TESTING_DEFERRED`.

## Source identity and extraction

- Source: `SS1-SRC-2c924c964660`, Second Term member `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`.
- Parsed row: `WEEK FOUR`, row index 3, 4,238 characters.
- Body ID/SHA-256: `SS1-SRC-2c924c964660:BODY:91638b728db1f23707da658c9c90880c47e24ae593c5c06cdda6802d098fa94c`.
- The original archive and member hashes were rechecked by `scripts/ss1/prepare_sources.py` in the Physics CI source-inspection step. The source text below is from `word-extractor 1.0.4 getBody()`; embedded figures were not rendered.

## Scheme objective mapping

The scheme topic is “Expansivity and Its Application - Linear, Area and Volume. Anomalous Expansion of Water. Real and Apparent Expansivity”. The five objective-level coverage entries `COV-PHYS-T2-W04-OBJ-1..5` all map to `SUP-SS1-PHYSICS-T2-W04-EXPANSIVITY` as `IMPLEMENTED_EQUIVALENT`:

1. Linear expansivity: definition, coefficient, formula and calculation.
2. Area expansivity: definition, coefficient, formula and approximate relation to linear expansivity.
3. Volume/cubical expansivity: definition, coefficient, formula and approximate relation to linear expansivity.
4. Anomalous expansion of water between 0 °C and 4 °C.
5. Real and apparent expansion of liquids, including expansion of the container.

## Original source evidence

The source Week Four body begins at extracted line 232.

- Lines 235–238 list linear, area, cubic expansivity and anomalous behaviour of water.
- Line 240 defines linear expansivity and explicitly identifies the coefficient as `α`, with unit K⁻¹ or per °C.
- Lines 242–245 contain the linear-expansivity fraction and its denominator (“unit length × temperature change”).
- Lines 249–253 define Δθ, use α and give `L₂ − L₁ = αL₁Δθ`.
- **Lines 254–255 use `X` where `α` is required**: `L₂ = L₁ + X L₁ Δθ` and `L₂ = L₁(1 + X Δθ)`. This is a source notation defect in the extracted text, not a valid alternative coefficient. The immediately preceding lines use α.
- Lines 258–262 give the brass-rod calculation; the worked substitution again prints `X` in one line.
- Lines 267–276 cover area expansivity, β and the approximation β ≈ 2α.
- Lines 280–283 give a second linear-expansion exercise.
- Lines 284–290 introduce volume/cubical expansivity, but use `Y` rather than the standard symbol γ and leave the stated α:β:Y ratio incomplete.
- Lines 292–295 distinguish real and apparent cubic expansivity of a liquid.
- Lines 298–299 explain anomalous expansion of water from 0 °C to 4 °C.
- Line 302 asks for a diagram of anomalous expansion; the source figure has not been inspected.
- Line 303 asks for an experiment to determine apparent cubical expansivity.
- Lines 309–320 contain MCQs and calculations: anomalous water, SI unit, β from α, linear expansivity, mercury cubical expansivity and volume change of a heated iron cube.
- The extracted forms `00C`, `40C`, `600C`, `1000C` and `900C` use a zero where the degree symbol is expected. Context identifies these as 0 °C, 4 °C, 60 °C, 100 °C and 90 °C; this interpretation is recorded as extraction normalization, not a change to the source bytes.
- The source gives no answer key or marks for these questions.

## Package changes and remaining gaps

The existing lesson was strengthened with an explicit notation correction and keyed practice for the source's area-expansivity MCQ, SI unit MCQ, anomalous-water MCQ, linear-expansion calculation, mercury calculation, iron-cube volume calculation and apparent-expansivity experiment.

The confirmed `X`-for-`α` and `Y`-for-`γ` defects are recorded as blocking open item `PHYSICS-T2-W04-SOURCE-NOTATION-DEFECTS`. The source diagram remains with the global visual inventory item `PHYSICS-SOURCE-VISUAL-INVENTORY`; no diagram has been recreated or claimed as original. A reviewed delivery correction is still needed before the original row can be suppressed.

## Validation boundary

Static source-text review, row identity/hash comparison, authored lesson/body-hash update and marking arithmetic only. Automatic Physics package CI may run. No manual test suite, compiler plan, importer, database, migration or device check was executed. Content approval remains PENDING and formal verification DEFERRED.
