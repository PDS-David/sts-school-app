# PHYS-FACT-T3-INTERNAL-RESISTANCE-FORMULA — missing brackets in current equation

Status: **IMPLEMENTED — testing/verification deferred**.

## Source locator
Registered source `SS1-SRC-bed91bb4ef0e`; Third Term Week One parsed row 0; body ID `SS1-SRC-bed91bb4ef0e:BODY:9f8307d972fbe53ef0930e1c6650615116513e515c52e1d125560f0a9887c231`; source body SHA-256 `9f8307d972fbe53ef0930e1c6650615116513e515c52e1d125560f0a9887c231`.

SchoolGist *Physics SSS 1 Third Term*, Week One PDF lines 106–107 prints the unbracketed relation `I = E / R + r = V/R`. The repository checkpoint `docs/ss1/work/SS1-03/CHECKPOINT.md`, section 3, independently records that the original .doc has the same reported expression and that it needs brackets.

## Correct relation
For a source of emf E, external resistance R and internal resistance r in series:
`I = E/(R + r)`.
The terminal potential difference across the external resistor is:
`V = IR = E − Ir`.
The printed expression `E/R + r` is not equivalent: division must apply to the total resistance `R + r`.

The authored lesson `SUP-SS1-PHYSICS-T3-W01-ELECTRIC-CIRCUITS` teaches the bracketed relation and includes a worked circuit calculation. Content approval remains PENDING and verification DEFERRED.

Reference: https://schoolgist.ng/storage/postFiles/SS1-Physics-3rd-Term-Lesson-Note-pdf.pdf
