# PHYS-PORT-D1-FACT-EXPANSIVITY — source notation reconciliation

Status: **IMPLEMENTED_TESTING_DEFERRED**. The original registered second-term .doc was extracted in the Physics CI workflow; source notation is recorded without asserting whether the glyph loss originated in the document or its text-extraction layer.

## Exact source identity

- Source ID: `SS1-SRC-2c924c964660`
- Registered archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Registered member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Parsed row: index 3, `WEEK FOUR`
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:91638b728db1f23707da658c9c90880c47e24ae593c5c06cdda6802d098fa94c`
- Parsed body SHA-256: `91638b728db1f23707da658c9c90880c47e24ae593c5c06cdda6802d098fa94c`

## Original .doc extraction evidence

Physics verification workflow run [43082409860](https://github.com/PDS-David/sts-school-app/actions/runs/43082409860) successfully extracted the three registered Physics .doc members from the checked-in source archive. Its Week Four excerpt records:

- Lines 240–245: linear expansivity is defined; the extracted equation at line 242 omits its denominator in the displayed text, while lines 244–245 express the denominator in words as unit length × temperature change.
- Lines 249–255: the extracted working uses `X` in place of the coefficient symbol in `L₂ = L₁ + X L₁ Δθ` and `L₂ = L₁(1 + X Δθ)`, although the surrounding working defines the coefficient as α.
- Lines 267–276: area expansivity is introduced as β, but the extracted working uses α for both dimensions before simplifying to the small-expansion approximation `β ≈ 2α`.
- Lines 284–290: volume expansivity is labelled `Y`; the extracted relation is `Y = 3α`, while the ratio line is incomplete in the extracted text (`α:β:Y = 1:2`).

These are confirmed properties of the text emitted by the original-source extraction job. The text alone cannot establish whether the original Word equation objects display the correct Greek letters/fractions; no claim is made about the visual appearance of the .doc equation objects.

## Student-facing disposition

The authored lesson `SUP-SS1-PHYSICS-T2-W04-EXPANSIVITY` uses consistent symbols:
- `α`: coefficient of linear expansion;
- `β`: coefficient of area expansion, with `β ≈ 2α` for small expansion of an isotropic solid;
- `γ`: coefficient of volume expansion, with `γ ≈ 3α` under the same approximation.

It distinguishes a coefficient from the actual change in length/area/volume and uses `ΔT` consistently. The lesson has 20 keyed questions and 49 marks; its marking totals were checked. Its content approval remains PENDING and verification remains DEFERRED.

## Package record

A non-blocking open item `PHYSICS-T2-W04-EXPANSIVITY-NOTATION` records the extracted notation/formatting risk. The original source is not edited. A teacher or visual-source reviewer may compare the original equation objects and close the item if the rendered source is unambiguous.

## Validation boundary

The Physics package workflow passed on the recorded run (7/7 package tests; validator passed). No claim is made that the Word equation objects were visually rendered or that a production importer/database/device acceptance test was performed.
