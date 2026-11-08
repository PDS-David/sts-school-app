# MATH-LES-T1-W01-ASSESSMENT-PRACTICE — implementation record

**Status:** IMPLEMENTED — TESTING DEFERRED BY OWNER. Content approval remains PENDING; verification remains DEFERRED.

## Scope

Extended `SUP-SS1-MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS` with eight separately keyed practice items for the eight assessment operations that were not previously carried by the lesson. No source row was changed and no printed exercise was copied as an answer key.

## Added items

| Practice ID | Skill | Answer | Marks |
|---|---|---:|---:|
| M1W1-Q4 | Multiplication: 2,184 × 11 | 24,024 | 1 |
| M1W1-Q5 | Multiplication: 217 × 405 | 87,885 | 1 |
| M1W1-Q6 | Subtraction: 36 − 23 | 13 | 1 |
| M1W1-Q7 | Subtraction: 104 − 94 | 10 | 1 |
| M1W1-Q8 | Division: 336 ÷ 4 | 84 | 1 |
| M1W1-Q9 | Division: 1,848 ÷ 12 | 154 | 1 |
| M1W1-Q10 | Signed division: (−18) ÷ (−3) | 6 | 1 |
| M1W1-Q11 | Signed division: −25 ÷ 4 | −25/4 or −6.25 | 1 |

Every item has its own answer and one-mark criterion. The marking criteria sum to the declared mark for each item. The body now includes worked explanations and a reminder that these are authored practice marks, not marks printed in or approved by the source.

## Coverage and open items

- `COV-MATH-T1-W01-OBJ-8` is now `IMPLEMENTED_EQUIVALENT`, bound to the existing supplement.
- `OI-MATH-T1-W01-ASSESSMENT-GAPS` is closed as an authoring gap: the existing four carried assessment items plus these eight cover all twelve assessment items; the eight class-work items were already covered.
- `OI-MATH-005` remains open and blocking because teacher content approval is still required. No approval is claimed.

## Integrity and verification boundary

- Lesson body SHA-256: `9b75756dad026ddf8d903a5cc69292bf0782088597d63387ffc8962001114195`.
- Arithmetic was recomputed independently while authoring.
- The original binary archive and DOCX render were not available in this execution environment; source locators and source/member hashes are inherited from the existing repository evidence and were not reverified in this run.
- No test suite, schema test, compiler, importer, typecheck, database operation or device check was run, in accordance with the owner's instruction to defer testing until implementation is complete.

## Files changed

- `backend/src/db/ss1/subjects/mathematics.json`
- `docs/ss1/work/microtasks/mathematics/QUEUE.json`
- This implementation note.
