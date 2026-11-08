# MATH-WK-T1-W06 — Mathematics, 1st Term Week Six indices review

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains PENDING; verification remains DEFERRED.

## Source identity

- Source ID: `SS1-SRC-0c9004137f95`
- Archive member: `SSS 1/1st Term SS1_/MATHss1.docx`
- Member SHA-256: `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb`
- Parsed row: 5, label WEEK 6, title “INDICES”.
- Original body length: 868 characters.
- Original body SHA-256: `222c8e646d2cf0325c980bac9b4b8e76b9b22aea908263b3011377f446c9423c`
- Original body ID: `SS1-SRC-0c9004137f95:BODY:222c8e646d2cf0325c980bac9b4b8e76b9b22aea908263b3011377f446c9423c`
- Replacement: `SUP-SS1-MATHEMATICS-T1-W06-INDICES`
- Replacement body SHA-256: `9bb60355e6afa0fea23688a8901d174a987f899f7f71c2d0154d9f39a95ea1e0`

## Scheme objectives and coverage

1. **Laws of indices** — product, quotient, power-of-a-power, zero, negative and power-of-product/quotient laws.
2. **Negative and fractional indices** — reciprocal powers, roots, rational powers and real-domain restrictions.
3. **Solving equations involving indices** — same-base equations, variable-base equations with fractional powers, and equations with unknown indices.

All three objectives are recorded as `IMPLEMENTED_EQUIVALENT` in objective-level coverage entries.

## Source exercise mapping

The public close-equivalent PDF, Week Six, lines 1424–1637, supplies the exercise inventory. It is not asserted byte-identical to the archive DOCX.

- Laws examples and simplifications → sections 2–3 and existing M1W6-Q1/Q2.
- Negative/fractional index evaluations → examples 5–7 and M1W6-Q1/Q2.
- `3³ × 6⁻³ × 2⁵` → M1W6-Q4.
- `(27/125)^(1/3) × (4/9)^(1/2)` → M1W6-Q5.
- `2^(r−3)=1/8` → worked Example 8 and M1W6-Q7(a).
- `5x=40x^(−1/2)` → worked Example 9 and M1W6-Q7(b).
- `4^(c−1)=64` → worked Example 10 and M1W6-Q6.
- `9^(x−1)=27^(x+1)` → worked Example 11 and M1W6-Q10.
- `2^(n−1)=16` → worked Example 12 and M1W6-Q9(c).
- `y^(−2)=9`, `√(2s)=9` → M1W6-Q9(a,b).
- `2x³=54` and `a^(2/3)=9` → M1W6-Q12.
- `9^(1/2) × 27^(2/3) ÷ 64^(1/3)` → M1W6-Q8.
- Compound fractional-index simplification → M1W6-Q11.

## Ambiguous source notation

The extracted public PDF loses or misplaces superscripts/fraction bars in:
- `5^(p−3)=8×5^(−2)`;
- the expression printed as `9^(2x+1)=81^(x−2)`;
- one compound quotient/simplification in the general evaluation.

These are recorded in `MATH-T1-W06-AMBIGUOUS-EQUATION-NOTATION`. The replacement includes clear equivalent exercises but does not claim to reconstruct the ambiguous original questions. The global `OI-MATH-001` equation-aware extraction decision remains open.

## External source evidence

Public close-equivalent PDF, Week Six, pages 21–25, lines 1424–1637:
https://api.nogofar.com/wp-content/uploads/lesson-uploads/2025/08/FIRST-TERM-SS1-MATHEMATICS-.pdf

No external wording or exercises are copied. All replacement examples and practice are independently authored.

## Files changed

- `backend/src/db/ss1/subjects/mathematics.json`
- `docs/ss1/work/microtasks/mathematics/QUEUE.json`
- `docs/ss1/work/microtasks/mathematics/MATH-WK-T1-W06.md`

## Verification boundary

All new answer calculations and marking totals were checked during authoring. No schema test, compiler/plan, typecheck, importer, database or device checks were run because testing is deferred by owner instruction. Approval remains PENDING; verification remains DEFERRED.
