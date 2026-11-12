# PHYS-WK-T2-W09 — Second Term Week Nine: electric field and field quantities

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages have been inspected. Source indexing is complete; the quantitative lesson is separately queued and remains a delivery blocker.

## Registered source identity

- Source ID: `SS1-SRC-2c924c964660`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`
- Member size: 466,432 bytes
- Parsed row: index 8, WEEK NINE
- Parsed body ID: `SS1-SRC-2c924c964660:BODY:3939388bd9db499f247d2b614187f300c4b7c030a84cdac372df3f46f3db08f7`
- Parsed body length: 3,669 characters
- Parsed body SHA-256: `3939388bd9db499f247d2b614187f300c4b7c030a84cdac372df3f46f3db08f7`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868; the source-staging step verified archive SHA-256, exact manifest membership, member sizes and hashes.

## Source content inventory

The original row covers:
1. Electric field definition and direction of force on a small positive test charge.
2. Electric lines of force, tangent direction, arrows and five stated properties.
3. Four field patterns: isolated positive, isolated negative, unlike pair and like-positive pair.
4. Coulomb's law: force proportional to the product of charges and inversely proportional to the square of their separation; `F=kQ₁Q₂/r²`, `k=9×10⁹ N m² C⁻²`, `k=1/(4πε₀)`.
5. Electric field intensity `E=F/Q`, a vector.
6. Electric potential `V=W/Q`, a scalar, unit J/C or volt.
7. Flux density as the source defines it: `D=Q/A`, unit C m⁻².
8. Evaluation prompts on field-line properties, Coulomb's law, definitions of E and V, and potential versus potential energy.
9. Five weekend MCQs and two numerical theory questions.

## Covered field-line objectives and visuals

The existing lesson `SUP-SS1-PHYSICS-T2-W09-ELECTRIC-FIELD-LINES` covers the first four objective groups. Its practice now includes Q16, the source's “state four properties of lines of force” prompt (4 marks). The original page-19 diagrams are represented by two registered original SVGs:
- `PHYS-ASSET-T2-W09-ELECTRIC-FIELD-PATTERNS`
- `PHYS-ASSET-T2-W09-ELECTRIC-FIELD-ADDITIONAL`

They cover isolated positive/negative charges, unlike charges, like-positive charges and the uniform parallel-plate pattern. The original .doc bytes remain unchanged; these are original teaching aids, not recovered images.

The source's statement that every field line must terminate on a charge is incomplete for isolated/net charges. The lesson correctly explains that lines may extend to or from infinity when no opposite charge is present. Correction record: `CORR-PHYSICS-T2-W09-FIELD-LINE-TERMINATION`.

## Quantitative content gap — separate lesson required

The current field-pattern lesson does not teach Coulomb's law, E, V, potential energy or D. Five coverage entries have therefore been added as `UNRESOLVED`, with open item `PHYSICS-T2-W09-QUANTITATIVE-ELECTRIC-QUANTITIES` and task `PHYS-LESSON-T2-W09-ELECTRIC-QUANTITIES`. These objectives are not claimed as covered. The new lesson must teach the source formulae, vector/scalar distinctions, units, worked examples, and key all source evaluations, MCQs and numerical theory questions.

The source calls `D=Q/A` “flux density”. In modern SI terminology, charge per unit area is usually surface charge density `σ=Q/A`, while electric displacement `D` is distinct (`D=εE` in a linear isotropic medium). The new lesson must preserve the source's stated relation while clarifying the terminology. Correction record: `CORR-PHYSICS-T2-W09-FLUX-DENSITY-NOTATION`.

## Source numerical question ambiguity

Rendered source page 20 visibly prints the work in the potential-difference question as **20MJ** for a 5 μC charge. Using the literal printed value gives `V=W/Q=4×10¹² V`. If the intended prefix was mJ, the result would instead be `4×10³ V`. No silent correction has been made. Open item `PHYSICS-T2-W09-POTENTIAL-WORK-PREFIX` asks the Physics teacher to confirm the intended prefix; it does not block the other content.

## Source assessments and answer keys

- Existing field-line lesson Q16 now keys the source property question (4 marks).
- The queued quantitative lesson must key the remaining evaluation prompts, five weekend MCQs and two numerical theory questions. This source-indexing task does not claim those answers have already been authored.
- Reading assignment: New School Physics, pp. 72–73.

## Checks

- Original source row and rendered pages 18–20 inspected, including field patterns, Coulomb formula, units and theory values.
- Existing original field-pattern SVGs are registered and attached to the lesson.
- JSON parse, unique practice IDs, answer/mark totals, coverage references and queue recount checked before commit.
- Full package tests and compiler for this commit: pending CI.
- Content approval remains PENDING; verification remains DEFERRED.
