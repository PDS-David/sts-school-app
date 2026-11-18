# DP-PRE-T2 — Data Processing, 2nd Term source preamble

Status: **IMPLEMENTED_TESTING_DEFERRED** (preamble indexed; source gaps recorded; not approved or verified). Testing deferred by owner.

## Verified inputs

- Source ID: `SS1-SRC-6880a598b05b`
- Manifest assignment: `2nd Term`, subject slug `data-processing`. This term identity comes from `SOURCE_ASSIGNMENTS.csv` and the source registry; the document itself has no term title.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — matches the task attachment.
- Exact member: `SSS 1/2nd Term SS1_/Data processing.docx`
- Member SHA-256: `83221771b598f2ccfe1199bfc6f72c5ca9f09f6d899c0479cd128f59564500b4` — matches both the task and `SOURCE_ASSIGNMENTS.csv` (193,094 bytes).
- Method: inspected only this verified DOCX member. The archive and extracted source bytes remain outside Git.

## Preamble blocks 0–1

Locator: `word/document.xml`, direct children of `w:body`, zero-based.

| Block | Exact extracted text | Classification |
|---|---|---|
| 0 | `                Data processing  ` (16 leading spaces, 2 trailing) | Title-only subject heading; not a scheme row or teaching body |
| 1 | empty string | Blank paragraph; no content to classify |

SHA-256 of block texts 0–1 joined with one LF, UTF-8 and no normalization:

`906999658bdbe8a8e746d16114778bde078577dca4a31e49d8b36a83eb9accd9`

This matches the task locator and the prior inventory `DP-INV-T2.md`. The document has 263 direct body children: blocks 0–261 and final `w:sectPr` at block 262.

Block 2 is the first teaching label: `WEEK 2TOPIC: information processing` (the label and topic are fused in one paragraph, separated by six tab characters). Therefore this source contains no Week 1 body before it.

## Other preamble findings

The verified document has no scheme table/list, references list, `SUBJECT`/`CLASS` line, or term title. The unique title heading `Data processing` matches canonical `Data Processing` apart from case; no `source_alias` rule is needed. No Computer Studies or ICT alias is inferred.

The existing full inventory in `DP-INV-T2.md` records the source's week labels as 2, 3–4, 5, 6, 7, 8, 9 and 10. Weeks 11–12 are absent. The filename is not used to infer a term title or to fill any missing week.

## Disposition

- Blocks 0–1 are classified as title-only metadata plus a blank paragraph.
- No `classify_marker` or other source rule is added: there is no scheme-only objective or teaching content in these blocks.
- No coverage row, lesson body, practice question, answer key, correction or asset is invented from the title or absent scheme.
- Three blocking source gaps are recorded in the package: missing Week 1, missing scheme/objectives, and missing Weeks 11–12.
- The source has no references list; no external source or reuse permission is inferred from its absence.
- Package remains `PENDING`. AI lesson bodies and practice are downstream outputs once supported topics/objectives are available.

## Edits and deferred checks

- `data-processing.json`: strengthened the T2 source-header evidence with the verified XML block locator/hash and added the three source-gap open items. Existing source registration, lessons, coverage and rules were otherwise preserved.
- `QUEUE.json`: DP-PRE-T2 moved to `IMPLEMENTED_TESTING_DEFERRED`; status counts and `next_runnable` recomputed.
- No tests, typecheck, importer, database, device or production checks were run, as required by the owner's deferred-testing instruction.
- No archive bytes, full source text or private extracts were committed.
