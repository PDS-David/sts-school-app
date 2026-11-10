# MATH-WK-T1-W03 — Mathematics, 1st Term Week 3 objective and exercise review

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains PENDING; verification remains DEFERRED. This is an objective-level review of the existing replacement, not a claim that the original DOCX was re-extracted in this session.

## Source identity

- Source ID: `SS1-SRC-0c9004137f95`
- Archive member: `SSS 1/1st Term SS1_/MATHss1.docx`
- Member SHA-256: `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb`
- Parsed row: 2, source label `WEEK 3`, title “RULES OF BASE NUMBER”.
- Parsed body length: 2,682 characters.
- Original body SHA-256: `afaa3393da2e57113812e989319e9184af8a0104680cea01cee7ebcaa83573e7`
- Original body ID: `SS1-SRC-0c9004137f95:BODY:afaa3393da2e57113812e989319e9184af8a0104680cea01cee7ebcaa83573e7`

## Objective coverage

1. Valid digits/base rule — covered.
2. Addition in the same base — covered.
3. Subtraction in the same base — covered; source answer corrected.
4. Multiplication in the same base — covered.
5. Division in the same base — **added during this review** because the original source rule includes division but the first replacement did not.
6. Unknown-base equation — covered; the negative root is rejected.
7. Binary coding/programming application — covered, including five-bit letter codes and yes/no bits.
8. Assessment exercise mapping — mapped below.

## Exercise-by-exercise mapping

| Source item | Replacement coverage |
|---|---|
| Worked addition: 174₈ + 233₈ | Example 1; answer 427₈ |
| Worked subtraction: 2311₄ − 213₄ | Example 2; corrected answer 2032₄ |
| Worked multiplication: 214₅ × 23₅ | Example 3; answer 11032₅ |
| Unknown base: 104ₓ = 68 | Example 4; x = 8, negative root rejected |
| Binary letter coding | Section 3 and M1W3-Q3 |
| Assessment: 4103₆ = 2112₆ + x | M1W3-Q2 |
| Assessment: 614₈ − 506₈ | M1W3-Q1(b) |
| Assessment: 123ᵧ = 83 | M1W3-Q1(c) |
| Assessment: 1101₂ × 10₂ | New M1W3-Q4 |
| Assessment: “I LOVE MATHEMATICS” in binary | M1W3-Q3 |
| Same-base division rule | New worked Example 6 and M1W3-Q5 |
| Yes/No binary state | New section 3 statement and M1W3-Q6 |

The public close-equivalent page gives the Week 3 rules, examples, programming application, assessment and assignment at lines 127–163. It is used as corroboration only and is not asserted byte-identical to the archive member.

## Source defects and notation

The correction binding `CORR-MATHEMATICS-T1-W03-BASE-OPERATIONS` retains two source corrections:
- `104ₓ = 68`: source permits a negative root; a base must be a positive integer greater than every digit, so x = 8.
- `2311₄ − 213₄`: source result is wrong; the correct result is 2032₄.

The initial replacement omitted division despite the source's rule listing it; this is now corrected in the lesson body and practice.

The original row has equation/superscript/subscript extraction loss. The project evidence records about 86 additional characters recovered by equation-aware extraction. Existing open item `OI-MATH-001` remains unresolved; no source hash or original row was altered.

## External assignment pointer

The source points to MAN Mathematics for Senior Secondary Schools 1, page 8, Exercise C4 items 1, 2, 3 and 7, plus miscellaneous items 3, 6, 10, 14 and 15. The textbook questions are not reproduced. Original replacement practice covers the core row skills; the external assignment pointer remains recorded for the teacher.

## Files changed

- `backend/src/db/ss1/subjects/mathematics.json`
- `docs/ss1/work/microtasks/mathematics/QUEUE.json`
- `docs/ss1/work/microtasks/mathematics/MATH-WK-T1-W03.md`

## Verification boundary

All new answer calculations and marking totals were checked during authoring. No package schema test, compiler/plan, typecheck, importer, database or device checks were run because testing is deferred by owner instruction. Approval remains PENDING; verification remains DEFERRED.
