# MATH-PORT-D2-RULES

Compared the two marker rules in PR #71 with the master's existing `source_rules`.

| PR #71 rule | Master rule | Comparison | Disposition |
|---|---|---|---|
| `MATHS-R01`, T2 Week Six, anchor `Review of the first half` | `RULE-MATH-T2-W06-REVISION`, anchor `Review of the first half term’s work and periodic test` | Both use `classify_marker` and classify the 64-character revision/test row as a revision marker. The master anchor is more specific and matches the indexed row. | Equivalent; keep master rule unchanged. |
| `MATHS-R02`, T3 Week 7, anchor `REVISION` | `RULE-MATH-T3-W07-REVISION`, anchor `WEEK 7\n\nREVISION` | Both use `classify_marker` and classify the 16-character revision row as a revision marker. The master anchor includes the week heading and is more specific. | Equivalent; keep master rule unchanged. |

The branch's `EXAM_OR_REVISION_MARKER` classification and the master's `kind: REVISION` are semantically equivalent. No marker rule was copied or weakened. No tests were run.

**Status:** IMPLEMENTED_TESTING_DEFERRED.
