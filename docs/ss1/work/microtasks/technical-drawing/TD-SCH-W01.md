# TD-SCH-W01 — Technical Drawing, 2nd Term Week 1 scheme row

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `05afe2ce56c5ce49e8e98fd3fcc255350066cfaf` (origin/master). Prerequisites TD-SRC-T2 and TD-PRE-T2 are implemented on master. No open PR existed and no branch owned TD-SCH-W01 when work started.
- Source `SS1-SRC-af4868d2c026`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`.
- Member SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` **verified** (2,865,886 bytes); equals the prompt and `SOURCE_ASSIGNMENTS.csv`.
- Container supplied: the ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip` (member path `2nd Term SS1 /2ND TERM S1 TECHNICAL DRAWING.docx`). Its own SHA-256 is `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, which is not the expected composite archive hash, so **no composite hash check is claimed**; the member hash decides. A second ZIP (3rd Term) was also supplied and not used.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call); `word/document.xml` inspected for run formatting. Line numbers are 1-based lines of `extractRawText().split('\n')` (4,199 lines). Importer, compiler and parser were not run; parsed-row identities come from `parsed_rows.json`.

## Row 0 hash accounting
- Parsed row 0, label `WEEK 1`, is line 11 in full: `WEEK 1:` + 8 spaces + the objective text, 79 characters. SHA-256 of line 11 `08c316219062202674404113758809456aaa229a8faaabbb1ca19dcbab0cc889` equals the recorded row body hash. Row ID `SS1-SRC-af4868d2c026:BODY:08c316219062202674404113758809456aaa229a8faaabbb1ca19dcbab0cc889`.
- The objective as written in the scheme: `Revision of the work for last term. Inscribed and circumscribed` (63 characters; the line ends with a full stop and has no noun after "circumscribed").

## Teaching row that covers it
- Parsed row 11, `WEEK ONE`, title line 61 `Revision of last term work. Inscribed and circumscribed circles`; lines 59–342 after trimming; trimmed body SHA-256 `a4e3d54d3b4f61aaea4abaf5c2ed3b4d3644563bbe904d5db1c57c69cf4082b6` (equals the recorded row hash; the untrimmed range hashes differently). Row ID `SS1-SRC-af4868d2c026:BODY:a4e3d54d3b4f61aaea4abaf5c2ed3b4d3644563bbe904d5db1c57c69cf4082b6`.

| Part of the objective | Where taught | Lines | SHA-256 (lines joined with `\n`) |
|---|---|---|---|
| Inscribed circles | four constructions with methods (triangle; three equal circles in an equilateral triangle; sector; regular polygon, rhombus or kite) and two evaluation questions | 75–195 | `8402719aa8dd35b28c8698a4a414663efb08a5ab40e2955fa52f926158185531` |
| Circumscribed circles | circumscribe a circle on a triangle, three-step method, two evaluation questions | 201–239 | `8299e517d9cbc78a46de7dec40a5560a0f00a3157ba3370242bd7fe342608d67` |
| Revision of last term's work | row title (line 61) and five general evaluation/revision constructions, three marked WAEC | 61; 243–261 | `a6ed9397…afa447` (line 61); `101c2bc440f02e9c2598f883306b001015cbb1133a0be81c56fe3ee33aac9072` (243–261) |

## Classification
- Rule `SS1-SRC-af4868d2c026-R003`: `classify_marker`, kind `SCHEME_ONLY`, anchor `Revision of the work for last term. Inscribed and circumscribed`.
- Anchor check on the unmodified extracted text: 1 occurrence (also 1 case-insensitively). The shorter phrase `Inscribed and circumscribed` alone occurs twice (this line and the row 11 title), so the full 63-character anchor is needed. The only parsed row body containing it is row 0.
- Because the anchor lies inside a parsed row, the compiler classifies that row (disposition keyed to the row 0 body ID), unlike the preamble rule R002 whose coverage target is the rule ID. Row 0's body stays in the plan as an `ORIGINAL`-sourced row labelled SCHEME_ONLY; nothing is discarded. I therefore bound the coverage to the teaching row (row 11) rather than adding a second MARKER entry for row 0.

## Edits
- `technical-drawing.json`: rule R003; coverage `COV-TD-T2-SCH-W01` (SUPPORTED, target row 11 ID, four evidence entries); open item `TD-T2-W01-REVISION-SCOPE` (VERIFICATION, non-blocking). Source row, rules R001/R002, `COV-TD-T2-TITLE-BLOCK` and the other open items unchanged; package stays PENDING.
- `QUEUE.json`: TD-SCH-W01 → IMPLEMENTED_TESTING_DEFERRED; status counts recomputed; `next_runnable` → `TD-SCH-W02`. `runnable_now` (`TD-SRC-T2`) was already stale and is untouched.

## Limits of this coverage entry
- SUPPORTED means the row's text teaches the objective at topic level. It is not a factual review, answer-key review or delivery certification.
- **Revision scope is unverified.** The scheme names no topics for "the work for last term", the row's revision practice is questions only, and the 1st Term source is not supplied (TD-MISSING-T1). Recorded as non-blocking open item `TD-T2-W01-REVISION-SCOPE`.
- **Observed in row 11, not actioned (routed):** (a) the drawings the row relies on are not in the extracted text (for example "the figure shown above" on lines 283, 301, 315) → TD-VIS-W01; (b) degree signs are superscript `0` runs in the .docx and flatten to `670` (line 193), `1050` (237, 335), `550` (251), `600` (257, 331), which misstates the angles in delivered text → TD-WK-W01. Neither was changed or added to the package here.

## Remaining
- Next in order: `TD-SCH-W02` (also runnable now: TD-SCH-W03..W11, TD-VIS-INVENTORY, TD-WK-W01). Same-file edits should run one at a time.
- Owner: alias approval (`TECHNICAL-DRAWING-ALIAS-APPROVAL`), footer confirmation, revision-scope confirmation.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
