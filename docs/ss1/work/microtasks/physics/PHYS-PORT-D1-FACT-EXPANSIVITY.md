# PHYS-PORT-D1-FACT-EXPANSIVITY — confirmed source notation defect

Status: `IMPLEMENTED_TESTING_DEFERRED`.

- Source ID: `SS1-SRC-2c924c964660`.
- Source member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`.
- Parsed row: Second Term `WEEK FOUR`, body ID `SS1-SRC-2c924c964660:BODY:91638b728db1f23707da658c9c90880c47e24ae593c5c06cdda6802d098fa94c`.

## Finding

The source defines linear expansivity with α at line 240 and uses α at lines 242, 249 and 253. It then prints `X` in place of α in the final-length equations at lines 254–255 and again in the brass-rod substitution at line 262. This is not a valid alternative symbol; it is a source notation typo. The source also denotes volume expansivity by `Y` at line 285 and leaves the α:β:Y ratio incomplete at line 290.

The current lesson `SUP-SS1-PHYSICS-T2-W04-EXPANSIVITY` uses α for linear, β for area and γ for volume expansivity, and teaches β ≈ 2α and γ ≈ 3α for small expansion in isotropic solids. The exact defect is recorded as blocking package item `PHYSICS-T2-W04-SOURCE-NOTATION-DEFECTS`; the original file is not edited.

Evidence was obtained from the hash-verified archive extraction in the Physics source-inspection CI step. Testing/importer/device verification remains deferred.
