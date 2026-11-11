# PHYS-PORT-D1-FACT-T2-W01 — source correction disposition

Status: `IMPLEMENTED_TESTING_DEFERRED`. No parser, compiler, importer, database or device test was run.

## Source identity

- Source ID: `SS1-SRC-2c924c964660`.
- Source member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`.
- Registered member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`.
- Parsed row: `WEEK ONE`.
- Original body ID: `SS1-SRC-2c924c964660:BODY:d7ca9ce778fcf4db276b9157c50e7f76d9603963d74af1cbc69fde22fa582f3c`.

## Finding and disposition

The earlier project-authored branch records that this source week defines heat as “the study of relative motion of fluid” and lists photoelectric emission as an effect of heat. The current master package already contains the precise correction binding:

- `CORR-PHYSICS-T2-W01-HEAT-ENERGY`
- Replacement: `SUP-SS1-PHYSICS-T2-W01-HEAT-TEMPERATURE`
- Replacement body SHA-256: `96fa8eb0163d609c1a62b6a885702a9fd5843c55984f07022c1fa1c215ffe470`

The replacement defines heat as energy transferred because of a temperature difference, distinguishes heat from internal energy, and correctly distinguishes thermionic emission (heating) from photoelectric emission (light). It also keys the phase-change assessment correction. The correction binding targets the exact original body ID and source hash; the source file itself remains unchanged.

This task is complete as a package-level correction candidate/binding. The lesson remains content-approval PENDING and verification DEFERRED; the correction is not evidence of production runtime delivery.

## Validation boundary

Static cross-check of the queue, source registration, lesson provenance, coverage and existing correction binding. The original member was not rehashed or rendered in this run. Testing remains deferred.
