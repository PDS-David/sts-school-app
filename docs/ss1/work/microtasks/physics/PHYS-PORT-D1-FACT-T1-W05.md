# PHYS-PORT-D1-FACT-T1-W05 — formula disposition

Status: `IMPLEMENTED_TESTING_DEFERRED`. No parser, compiler, importer, database or device test was run.

## Source identity

- Source ID: `SS1-SRC-5c0149cda71d`.
- Source member SHA-256: `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`.
- Parsed row: `WEEK FIVE AND SIX`.
- Parsed body ID: `SS1-SRC-5c0149cda71d:BODY:593683bb0b6b62e3db27e3d4609dcedcfd20ced66ac79fb065477d8f4929a29d`.

## Finding

The earlier PR #71 note reported the expression as `S = (v+u)t over 2` and described the fraction as lost. The extracted wording itself retains the denominator in words: it is mathematically equivalent to

`S = ((u+v)/2)t`

which is average velocity multiplied by elapsed time for uniformly accelerated motion. The claim that the formula is mathematically wrong is therefore **not confirmed** by the available text. The original equation's visual fraction layout has not been independently inspected in the binary member during this run; any remaining issue is a visual/extraction fidelity question.

The current authored supplement `SUP-SS1-PHYSICS-T1-W05-W06-MOTION-GRAPHS` teaches the equations of uniformly accelerated motion and supplies worked examples. The finding is recorded as non-blocking package item `PHYSICS-T1-W05-W06-FORMULA-FORMATTING`; no false correction is introduced.

## Validation boundary

The source/member identity and parsed-row digest are reused from the verified registry and existing source-index evidence. The original member was not rehashed or rendered in this run. Testing remains deferred.
