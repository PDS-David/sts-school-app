# MATH-WK-T1-W05 — Mathematics, 1st Term Week Five standard form and approximation index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains PENDING; verification remains DEFERRED.

## Source identity

- Source ID: `SS1-SRC-0c9004137f95`
- Archive member: `SSS 1/1st Term SS1_/MATHss1.docx`
- Member SHA-256: `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb`
- Parsed row: 4, title “STANDARD FORM AND APPROXIMATION”.
- Original body length: 3,151 characters.
- Original body SHA-256: `6e1b2a32216d22ca137412f198d8c9df38606143f3c1dc4c09b2bbe7bec24acf`
- Original body ID: `SS1-SRC-0c9004137f95:BODY:6e1b2a32216d22ca137412f198d8c9df38606143f3c1dc4c09b2bbe7bec24acf`
- Replacement: `SUP-SS1-MATHEMATICS-T1-W05-STANDARD-FORM`
- Replacement body SHA-256: `94344dac24315eded0e5fa74d59e08377fc8489627e91bb61091a189b862c492`

## Objective coverage

1. Normalized standard form `a × 10ⁿ`, where `1 ≤ a < 10` and n is an integer.
2. Ordinary whole numbers and decimal fractions to standard form.
3. Positive- and negative-power standard forms to ordinary numbers.
4. Addition, subtraction, multiplication and division in standard form.
5. Rounding to place values.
6. Significant figures.
7. Decimal places.
8. Bounds of accuracy and practical measurement problems.

## Source worked-example and exercise mapping

- Standard-form examples and decimal fractions → lesson sections 1 and 6; Q1, Q5.
- Standard-form to ordinary-form examples → section 5; Q4.
- Addition and subtraction → section 2; Q2 and Q11.
- Multiplication and division → section 3; Q2.
- Rounding to nearest ten/hundred/thousand → sections 4 and 7; Q3 and Q6.
- Significant figures and decimal places → sections 4 and 7; Q3, Q7 and Q8.
- Weekend assignment conversions and approximations → Q8.
- Practical paper thickness and measurement bounds → section 8; Q9.
- Large amount rounding to 2 s.f. → Q10.

## Source defects corrected

- Standard-form leading factor must satisfy `1 ≤ a < 10`; 10 is not an allowed normalized leading factor.
- `5.24 × 10⁻⁵ − 4.33 × 10⁻⁶ = 0.00004807`, not 0.00004803.
- 4517 rounded to the nearest thousand is 5,000, not 500.
- 0.0089 rounded to 3 decimal places is 0.009, not 0.089.
- The original text loses exponent notation; the replacement writes powers explicitly.

## External scope evidence

Public close-equivalent PDF, Week Five, pages 16–20, lines 1216–1420:
https://api.nogofar.com/wp-content/uploads/lesson-uploads/2025/08/FIRST-TERM-SS1-MATHEMATICS-.pdf

Additional close-equivalent scope reference:
https://schoolgist.ng/mathematics-lesson-note-for-ss1-first-term-3

These sources are not asserted byte-identical to the archive DOCX. No external wording, worked examples, tables or exercises are copied.

## Reading assignment

The source points to New General Mathematics SSS1 pages 6–7, Review Tests 3 and 4. The pointer is retained; the textbook exercises are not reproduced. Original equivalent practice is supplied.

## Files changed

- `backend/src/db/ss1/subjects/mathematics.json`
- `docs/ss1/work/microtasks/mathematics/QUEUE.json`
- `docs/ss1/work/microtasks/mathematics/MATH-WK-T1-W05.md`

## Verification boundary

All new calculation answers and marking totals were checked during authoring. No schema test, compiler/plan, typecheck, importer, database or device checks were run because testing is deferred by owner instruction. Approval remains PENDING; verification remains DEFERRED.
