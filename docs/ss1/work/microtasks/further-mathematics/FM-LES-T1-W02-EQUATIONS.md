# FM-LES-T1-W02-EQUATIONS — Further Mathematics, 1st Term Week 2 equations

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; not approved or verified). Testing deferred by owner.

## Decision
`FM-PORT-D3-L002` already ported the replacement `SUP-SS1-FURTHER-MATHEMATICS-T1-W02-EQUATIONS`, so no second lesson was written. It was compared with the completion condition and `OI-FM-T1-W02-FACT-DEFECTS` on current master (`ad3096c`):
- 1 equal-base rule: stated with a > 0 and a not 1; the false converse is named and rejected (the equal-base contradiction was already corrected at dispatch).
- 2 and 4 unknown and multiplication: x for the unknown, × for multiplication.
- 3 duplicated step: one clean working for example d).
- 5 and 7 rejected branches: both stated in words (5^x = -25, 3^x = -3).
- 6 two-column working: read in order.
- 9 weekend item 4: explained, wording left for a teacher.
- Every index and power carries an explicit caret; all 13 unanswered items are worked; practice Q1-Q8 are original with complete marking.
- **8 quadratic Evaluation item (a): not passed.** The lesson stopped at 2^x = 3 and only named Week 3. It did not teach how to finish.

## Change made
Only the narrow gap:
- New body section 8, "When the bases cannot be matched: one step with a logarithm": a logarithm as the undoing of a power (log_b(k) = y means b^y = k), only positive numbers have a real logarithm (the same fact as the rejection rule), take the logarithm of both sides, power rule, x = log(k) ÷ log(a). Worked examples 2^x = 3 (x ≈ 1.584963, computed with base 10 and with natural logarithms) and 5^x = 40 (x ≈ 2.292030); warnings that log(3) ÷ log(2) is neither log(3 ÷ 2) nor log(3) − log(2).
- Three sentences edited: section 5 (Evaluation a) and the lead-in to it; section 7 (last sentence). Fourth objective added.
- Practice Q9 (original, 5 marks): 3^(2x) − 4(3^x) − 21 = 0; substitution, factorising (y − 7)(y + 3), rejecting y = −3 in words, then 3^x = 7 finished as x = log(7) ÷ log(3) ≈ 1.771. Practice is now 9 items, 38 marks, every marking list sums.
- New provenance entry: OpenStax College Algebra 2e section 6.6 (CC BY 4.0). Only extracts of the page were read through a search tool, not the full page; the definition, the take-the-logarithm-of-both-sides method, the power property and the positivity condition were checked, and every number was recomputed.
- Body hash: `fe5e13bd865d5efba54ae554d2f6cf70224451b0e2f6491cf39af78e21e64ce9` (was `0f61001b9487a7d01eced4ade42cd5bc84299b14b793514f33159d11c7446871`). State unchanged: content_approval PENDING, implementation IMPLEMENTED, verification DEFERRED.
- Scheme Week 3 (Logarithms) is not covered and is not claimed; only the single step is taught.

## Evidence and records updated
- `COV-FM-T1-W02-OBJ-1` and `-OBJ-2`: already pointed at the lesson (IMPLEMENTED_EQUIVALENT); lesson-hash literals updated; `-OBJ-2` gains one objective-level evidence entry that supersedes the earlier "does not teach the logarithm step". `COV-FM-T1-R01` stays PARTIAL, with a dated update to its port note.
- `OI-FM-T1-W02-FACT-DEFECTS` and `OI-FM-T1-W02-ASSESSMENT-GAPS`: the lines that said the step was only named, and "eight items, 33 marks", are updated. Both stay OPEN and blocking.
- `QUEUE.json`: this item → IMPLEMENTED_TESTING_DEFERRED (closed by reference to the port, plus the addition); `status_counts` recomputed 26 / 56 / 7; a note added; `next_runnable` unchanged. The `FM-PORT-D3-L002` record is not edited and keeps the hash current when it was written.

## Not done (separate tasks)
No row binding (`FM-COR-T1-W02`), no equation-object recovery (`FM-FACT-T1-W02-EQ-OBJECTS`), no change to the printed row. A teacher still has to decide whether the school wants the logarithm step inside Week 2 and how weekend item 4 should be worded.

## Checks (authoring checks, not tests)
JSON parse with original formatting kept; unique lesson IDs; all body hashes recomputed from UTF-8; marking sums for all 9 practice items; coverage references resolve; queue dependencies resolve; status counts recomputed; logarithm values recomputed numerically. No typecheck, suite, importer, database or device run.
