# LIT-WK-T1-W01 — Literature: 1st Term Week 1 (introduction to the study of Literature)

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only; nothing was run (no schema parse, compiler/plan, importer, test, typecheck, database or device). Base: master `532270f` (fetched 2026-11-07). Not approved, not verified.

## Inputs
- Member `LIT. IN ENGLISH.docx`, SHA-256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea` (31804 bytes), re-verified from the standalone attachment.
- mammoth 1.12.2 `extractRawText`: 609 lines. Span lines 37-99, block SHA-256 `b4ad59792cac040a9cab42eedeed7f3b2794837bb257e375b297a9a129a78518` (reproduced; equals the queue value). Line hash = SHA-256 of the line; range hash = lines joined with `\n`.
- Parsed row reproduced with the importer's `WEEK_MARKER` logic outside the importer (the nine scheme rows and Week 2 hashes match the recorded values): `SS1-SRC-470d43e54e5b:BODY:87271eccd4241024527cef8b191ee87bf73d10188fb894490bb5287a234481c2`. It awaits confirmation by the compiler.

## Span map
Label 37 (tab-padded) · heading 41 · meaning 43 · subject 47-49 · English Literature vs Literature-In-English 53-55 · reasons 59-83 (heading 59, label 61, eleven items 63-83) · Literary Appreciation 87-91 · `Class Work` 95, questions 97 and 99. No assignment marker, no set text, no visual group.

## Coverage written (literature.json)
| ID | Status | Basis |
| --- | --- | --- |
| `COV-LIT-T1-W01-MEANING` | SUPPORTED | line 43 taught as printed |
| `COV-LIT-T1-W01-SUBJECT` | PARTIAL | line 49 `It minors the society.` is garbled; intended word not asserted |
| `COV-LIT-T1-W01-ENGLIT-VS-LITENG` | PARTIAL | line 55 claims unreferenced; see below |
| `COV-LIT-T1-W01-REASONS` | SUPPORTED | eleven items 63-83, list only, matches question 99's "11" |
| `COV-LIT-T1-W01-APPRECIATION` | SUPPORTED | lines 89-91 |
| `COV-LIT-T1-W01-CLASSWORK-Q1` | PARTIAL | line 97; answerable from 89-91; no key or marks |
| `COV-LIT-T1-W01-CLASSWORK-Q2` | PARTIAL | line 99; answerable from 63-83; no key or marks |

Open items (all block delivery): `LITERATURE-T1-W01-COVERAGE`, `-MINORS-CORRECTION` (FACT), `-ENGLIT-CLAIMS` (FACT), `-CLASSWORK-KEYS` (CONTENT).

## Findings settled
- Line 49: recorded as a likely typing slip; the source does not say what was meant, so a teacher must confirm the word. Contract has no character-level correction, so the fix is a delivery replacement.
- Line 55: checked 2026-11-07 through web copies only (not a page-cited edition). An Oxford Old English course page dates the Beowulf manuscript to around the turn of the eleventh century and says composition-date theories lack consensus; a web copy of the WASSCE Literature-in-English syllabus divides texts into African and non-African prose, drama and poetry and never frames the subject as works from British colonies. Neither claim is adjudicated; both need an authoritative dated reference and a teacher decision.
- Reasons list: eleven items, equal to what question 99 asks.
- Exercises: both accounted for; no assignment marker exists in this week. No answer was written.
- No source rule added: the row parses without one. The `Class Work` text occurs 7 times, so it is not an anchor; its classification is left to `LIT-MARK-T1`.

## Queue
`LIT-WK-T1-W01` set to `IMPLEMENTED_TESTING_DEFERRED`; `LIT-LES-T1-W01-CORRECTED-WEEK` (LESSON) appended; counts recomputed from items (32 items: 7 implemented, 24 pending, 1 blocked); `next_runnable` recomputed (dependencies satisfied, TEST excluded, blocked excluded).

## Checks performed
JSON parse and byte round trip of both files; coverage, open-item and queue IDs unique; every coverage `lesson_ids` target and open-item `affected_ids` target resolves; each quoted anchor occurs once in the extract; block, line and range hashes recomputed; source file hash; diff limited to the three allowed paths.

Not run: zod parse, compiler/plan, importer, tests, typecheck, database, device.

## Remaining
Follow-up `LIT-LES-T1-W01-CORRECTED-WEEK`. The three alias open items still block delivery. No package, subject or class completion is claimed.
