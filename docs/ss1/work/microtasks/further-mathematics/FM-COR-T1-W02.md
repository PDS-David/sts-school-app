# FM-COR-T1-W02 — Delivery correction binding

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a delivery binding only; it is not content approval, verification or acceptance.

## Exact binding

- Correction ID: `CORR-FURTHER-MATHEMATICS-T1-W02-EQUATIONS`
- Source ID: `SS1-SRC-e9efc9a976ed`
- Source member SHA-256: `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145`
- Source parsed row/body ID: `SS1-SRC-e9efc9a976ed:BODY:5afb4090baf876604503aa80e92f0e7c6537967652d9a11f004b0d4520e1aa7c`
- Source body SHA-256: `5afb4090baf876604503aa80e92f0e7c6537967652d9a11f004b0d4520e1aa7c`
- Single replacement ID: `SUP-SS1-FURTHER-MATHEMATICS-T1-W02-EQUATIONS`
- Replacement body SHA-256: `fe5e13bd865d5efba54ae554d2f6cf70224451b0e2f6491cf39af78e21e64ce9`
- Scope coverage: `COV-FM-T1-W02-OBJ-1` (linear-form equations) and `COV-FM-T1-W02-OBJ-2` (quadratic-form equations).

## Why a replacement is bound

The original row has an unqualified equal-base rule and false converse, flattened superscripts, two lost equation objects, unanswered evaluation/weekend/theory items, missing rejection explanations and an evaluation item that requires logarithms. The replacement covers both teaching objectives, corrects the equal-base conditions, explicitly writes indices, restores the omitted quadratic example, explains the rejected branches, answers the assessment items and teaches the logarithm step needed to finish (2^x=3).

The replacement contains nine original practice items with complete answers and marking guides totalling 38 marks.

## Open decisions and limitations

This binding does not close:
- `OI-FM-T1-W02-FACT-DEFECTS`
- `OI-FM-T1-W02-ASSESSMENT-GAPS`
- `FM-FACT-T1-W02-EQ-OBJECTS` (the two 41-byte Equation Native objects are still undecoded)
- The teacher decision on whether the logarithm step should be taught in Week Two or reserved for the logarithms week.

The original source row remains unchanged. Content approval remains PENDING and verification remains DEFERRED. No tests, importer, compiler or database checks were run.
