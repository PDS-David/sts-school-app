# GOV-MARK-T2 — Government, 2nd Term teaching-body marker disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All marker text is retained exactly as source content.

## Source identity

- Source ID: SS1-SRC-c76f430c7cf8
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e
- Member: `SSS 1/2nd Term SS1_/GOVT.docx`
- Member SHA-256: bce2ae4a8b26f1737631e99387fed3cba661e328da3df274f673b6850088d782

## Ten EVALUATION occurrences

A full scan of the Word body found exactly ten standalone `EVALUATION` paragraphs:

| Body child | Teaching week | Existing coverage |
|---:|---|---|
| 82 | Week One | `COV-GOV-T2-W01-EVALUATION-MARKER` |
| 141 | Week Two | `COV-GOV-T2-W02-EVALUATION-MARKER` |
| 172 | Week Three | `COV-GOV-T2-W03-EVALUATION-MARKER` |
| 205 | Week Four | `COV-GOV-T2-W04-EVALUATION-MARKER` |
| 278 | Week Five | `COV-GOV-T2-W05-EVALUATION-MARKER` |
| 318 | Week Six | `COV-GOV-T2-W06-EVALUATION-MARKER` |
| 369 | Week Seven | `COV-GOV-T2-W07-EVALUATION-MARKER` |
| 414 | Week Eight | `COV-GOV-T2-W08-EVALUATION-MARKER` |
| — | Week Nine | No EVALUATION marker occurs |
| 442 | Week Ten | `COV-GOV-T2-W10-EVALUATION-MARKER` |
| 505 | Week Eleven | `COV-GOV-T2-W11-EVALUATION-MARKER` |

All ten occurrences already have corresponding package coverage entries with status `MARKER`. No new coverage entry was needed.

## Other marker classes

No standalone teaching-body marker was found for:
- `READING ASSIGNMENT`
- `WEEKEND`
- `THEORY`
- `GENERAL EVALUATION`
- `REVISION`
- `EXAMINATION`

Reading instructions and further-reading pointers do appear within some weeks, but these are ordinary source content, not standalone marker headings.

## Rule/schema decision

No `classify_marker` rule was added for EVALUATION. The strict schema only permits marker kinds `REVISION`, `EXAMINATION` and `SCHEME_ONLY`; adding an unsupported `EVALUATION` kind would invalidate the package. The EVALUATION headings remain original teaching-body markers and are not removed or reclassified.

The separate preamble row “12–13 Revision and Examination” is handled by `GOV-REV-T2` and its `SCHEME_ONLY` rule. It is not a body marker and is not conflated with the ten EVALUATION headings.

## Checks and limits

- Re-inspected the complete Word body and counted exact standalone marker paragraphs.
- Matched all ten EVALUATION paragraphs to the existing Week One–Eight, Ten and Eleven MARKER coverage entries.
- Confirmed Week Nine has no EVALUATION marker.
- Confirmed no other standalone marker classes listed above occur in the body.
- Added no lesson, coverage entry or unsupported source rule.
- No tests, typechecks, compiler/importer, database or app/device checks run; testing remains deferred by owner.
