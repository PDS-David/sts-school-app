# PHYS-PORT-D1-FACT-T3-W10 — thermal-force formula disposition

Status: `IMPLEMENTED_TESTING_DEFERRED`.

- Source ID: `SS1-SRC-bed91bb4ef0e`.
- Source member SHA-256: `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`.
- Parsed row: Third Term `WEEK 10`, body ID `SS1-SRC-bed91bb4ef0e:BODY:90b1db64e4c1152d3e995236b0ef16f078040f74b343178795e382a7ca5c64e3`.

## Finding

The extracted source lines 527–531 show:

- Line 527: `α = change in length/original length × temperature change`.
- Line 528: `α = e/L × Ө`.
- Line 529: `e = αLӨ`.
- Line 530: `F = EAαeLӨ/eL`.
- Line 531: `F = EAαӨ`.

As plain linear text, lines 527–528 are inconsistent with line 529. The consistent intended relation is `α = e/(LΔT)`, giving `e = αLΔT`; substituting into `F = EAe/L` gives `F = EAαΔT`. The final result is correct. The extraction has flattened a fraction/grouping somewhere in the derivation; without a rendered original page, it is not possible to prove whether the source Word equation itself was wrong or whether the fraction layout was lost during extraction.

The current replacement lesson `SUP-SS1-PHYSICS-T3-W10-ELASTIC-ENERGY` derives `F = EAαΔT` correctly and states the assumptions of complete restraint and linear elasticity. The ambiguity is recorded as non-blocking item `PHYSICS-T3-W10-FRACTION-FORMATTING`; no false factual correction is made.

The archive/member identity is reused from the verified source registry; no source bytes were changed. Testing remains deferred.
