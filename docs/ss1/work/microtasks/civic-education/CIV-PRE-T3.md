# CIV-PRE-T3 — Civic Education (3rd Term preamble and scheme/body reconciliation)

Status: IMPLEMENTED — TESTING DEFERRED. Preamble indexing and scheme-marker classification only. No scheme row was converted into a lesson.

## Source identity

- Source ID: `SS1-SRC-0dc1f445683f`
- Member: `SSS 1/3rd Term SS1_/3RD TERM S1 CIVIC EDUCATION.docx`
- Member SHA-256: `8790f478409619cb22a9a00d31a0069589c5277c27ecd81221ef76edf16d3ea1`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`

## Scheme rows and actual body mapping

The scheme is ordinary Word paragraphs, not a table.

| Scheme paragraph | Scheme row | Actual body mapping |
|---:|---|---|
| 6 | WEEK 1: Revision of last term’s work | No separate Week 1 body. |
| 8 | WEEK 2-3: Cultism | Combined body marker WEEKS 2 and 3 at paragraph 42. |
| 14 | WEEK 4 - 5: Law and order | Combined body marker WEEKS 4 & 5 at paragraph 149. |
| 20 | WEEK 6: Respect for constituted authority | Body marker WEEK 6 at paragraph 244. |
| 25 | WEEK 7: Employment and Unemployment | Body marker WEEKS 7 & 8 at paragraph 306; body combines two week numbers. |
| 30 | WEEK 8 - 9: Capitalist democracy | Body marker WEEK 9 at paragraph 368. Scheme/body numbering differs; preserve both. |
| 36 | WEEK 10: Revision of the term’s work | No separate Week 10 body. |
| 38 | WEEK 11 & 12: Examination & Closing | No corresponding body section. |

## Source-bound parser disposition

The scheme uses same-line WEEK-number paragraphs. These can be mistaken for actual body markers by the generic parser. Added eight source-bound `classify_marker` rules with `kind: SCHEME_ONLY` and `match_mode: WHOLE_LINE`, one per exact scheme paragraph. Each anchor is unique in the source and is kept separate from the body labels.

Added `COV-CIV-T3-SCHEME-MARKERS` with status `MARKER`, linked to the eight rule IDs. The compiler can therefore classify the preamble scheme rows without deleting or rewriting them.

## Actual teaching-body markers

- WEEKS 2 and 3 — Cultism.
- WEEKS 4 & 5 — Law and Order.
- WEEK 6 — Respect for Constituted Authority.
- WEEKS 7 & 8 — Employment and Unemployment.
- WEEK 9 — Capitalist Democracy.

The scheme's Week 1 revision, Week 10 revision and Weeks 11–12 examination/closing do not have separate teaching bodies. No Week 10 or examination lesson was invented.

## Boundary

The source's numbering and topic wording are preserved. No lesson, answer, assessment key, approval or classroom verification was invented. Test code is authored but not run.
