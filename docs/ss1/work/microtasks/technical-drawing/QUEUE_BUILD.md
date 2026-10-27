# Technical Drawing work queue — build note

- Reviewed master SHA: `f4117a6427aa7f59454a1d70c0834231b9c0fb10` (merge of PR #93). No Technical Drawing queue existed and no open PR owns this task; the only open PR is #71, which is not used as a foundation. No `AGENTS.md` exists in the repository.
- Built from repository evidence only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device). Testing deferred by owner.

## Existing work recognised
- **Finding: no Technical Drawing package exists** on master, on PR #71, or on any `ss1/*` remote branch (searched by path). The SS1-03 checkpoint lists the subject as NOT STARTED, so nothing is registered or implemented and nothing is marked complete.
- Exactly one source is assigned in `SOURCE_ASSIGNMENTS.csv`: `SS1-SRC-af4868d2c026`, 2nd Term, `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx` (2,865,886 bytes, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER). No header text for it is recorded anywhere in the repository.
- The 1st and 3rd Term documents are not supplied. They are recorded as BLOCKED `TD-MISSING-T1` and `TD-MISSING-T3`; absence from the archive is not proof the terms do not exist.

## Unmerged work that must be preserved
None found for this subject: no D-item exists in the reconciliation document, and PR #71's checkpoint also says NOT STARTED. There are therefore no branch port or comparison items.

## Evidence limitations
- Facts come from `docs/ss1/work/SS1-03/CHECKPOINT.md` section 4 and `evidence/parsed_rows.json`: 19 parsed rows, rows 0-10 scheme-table lines (15-79 characters; row 10 "Revision and Examination" is 655), rows 11-18 teaching rows for Weeks 1, 2, 3, 4, 5, 6-7, 8-9, 10. Every row has its own item. Row text beyond titles and lengths was not read.
- The document holds 94 drawings, 17 OLE objects and WMF figures (WMF is not an allowed asset MIME). Their row locations, contents and rights status are unknown; visual items are inventory-first.
- Rows 5/6 and 7/8 of the scheme are textually identical apart from the week number, so any rule anchor must include the week heading.
- Scheme Weeks 6-7 say "Enlargement and reduction" but the teaching row is titled "Reduction of plain figures"; this is a verification item, not an established gap.
- Equation/superscript loss is only known for row 13 (about 38 characters); HANDOFF.json says plain extraction drops equations in this source.
- Asset files belong under `backend/src/db/ss1/assets/technical-drawing/` (the schema and contract path), not the `curriculum-assets/ss1/` path in the worker prompt.

## Queue totals (39 items)
- Status: 0 IMPLEMENTED_TESTING_DEFERRED, 34 PENDING, 5 BLOCKED, 0 IN_PROGRESS.
- Kinds: 1 SOURCE_REGISTRATION, 2 MISSING_MATERIAL, 1 SOURCE_PREAMBLE_INDEXING, 19 SOURCE_WEEK_INDEXING (11 scheme rows, 8 teaching rows), 1 FACTUAL_DEPENDENCY, 9 VISUAL_DISPOSITION, 2 ASSET, 1 OWNER_DECISION, 1 SCOPE_DECOMPOSITION, 2 TEST.
- No lesson-writing item: no specific uncovered objective is established. `TD-FACT-ENLARGEMENT-SCOPE` appends one only if the gap is confirmed.

## Next runnable task
**`TD-SRC-T2`** — no dependencies, PENDING; the only runnable item (all others depend on it). It may create the minimum package (explicit permission in its allowed paths and completion condition). Attach archive `SSS 1-20260507T072431Z-3-001 (1).zip` (sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a filename variant is fine if the hash matches) and member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx` (sha256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`).

## Checks done
JSON syntax, 39 unique IDs, all `depends_on` resolve, no cycles, totals match, source hash and member equal the CSV row.
