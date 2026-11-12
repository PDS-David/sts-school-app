# PHYS-PORT-D1-FACT-T3-W10 — restrained thermal-force derivation

Status: **IMPLEMENTED_TESTING_DEFERRED**. The original registered third-term .doc was extracted in the Physics CI workflow and the branch-reported formula issue is confirmed in its extracted text.

## Exact source identity

- Source ID: `SS1-SRC-bed91bb4ef0e`
- Registered archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`
- Registered member SHA-256: `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`
- Parsed row: index 9, `WEEK 10`
- Parsed body ID: `SS1-SRC-bed91bb4ef0e:BODY:90b1db64e4c1152d3e995236b0ef16f078040f74b343178795e382a7ca5c64e3`
- Parsed body SHA-256: `90b1db64e4c1152d3e995236b0ef16f078040f74b343178795e382a7ca5c64e3`

## Original .doc extraction evidence

Physics verification workflow run [43082409860](https://github.com/PDS-David/sts-school-app/actions/runs/43082409860) extracted the registered third-term .doc. Its Week Ten excerpt records:

- Line 522: a bar is heated and then prevented from contracting as it cools; the source defines E (Young's modulus), A (cross-sectional area), α (linear expansivity) and a temperature decrease.
- Line 526: `F = EAe/L`.
- Lines 527–529: `α = e/L × θ`, hence `e = αLθ`.
- Line 530: the substitution is emitted as `F = EAαeLθ/eL`, with a garbled/unbalanced arrangement of symbols.
- Line 531: the stated result is `F = EAαθ`.

The algebraic result is correct when the extension `e = αLθ` is substituted into `F = EAe/L`. The intermediate line 530 is poorly formatted/garbled in the extracted text; the issue is not that the final relation is wrong.

For a restrained thermal change, the magnitude relation is `F = EAα|ΔT|`; the sign/direction depends on whether expansion or contraction is restrained. The student lesson states the magnitude and explains the direction in words rather than implying a signed force convention that the source does not define.

## Student-facing disposition

The existing lesson `SUP-SS1-PHYSICS-T3-W10-ELASTIC-ENERGY` teaches the derivation in a clean sequence and gives worked examples. The source's worked steel-rod question uses A = 2 cm², a temperature change from 100 °C to 10 °C, α = 12 × 10⁻⁶ K⁻¹ and E = 2 × 10¹¹ N/m². Using SI units and the magnitude of ΔT = 90 K gives:

`F = (2 × 10¹¹)(2 × 10⁻⁴)(12 × 10⁻⁶)(90) = 43,200 N`.

The lesson includes the corresponding thermal-force treatment. Its approval remains PENDING and verification remains DEFERRED.

## Package record

A non-blocking open item `PHYSICS-T3-W10-FORCE-DERIVATION-NOTATION` records the source extraction/derivation formatting issue. The original source is not edited.

## Validation boundary

The Physics package workflow passed on run 43082409860 (7/7 package tests; registered SS1 package validator passed). No Word equation-object rendering or production importer/database/device acceptance is claimed.
