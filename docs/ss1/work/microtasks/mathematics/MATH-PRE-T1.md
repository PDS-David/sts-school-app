# MATH-PRE-T1 — Mathematics: 1st Term preamble inventory

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only; nothing was run (no schema parse, compiler/plan, test, typecheck, importer, database, device, migration, import or deployment). Base: master `4159336c7068d2235209221f5f14adc4986acec5` (fetched 2026-10-29; local HEAD equals `origin/master`). Open PRs at start: #188 (Government) and #189 (Literature); neither touches Mathematics.

## Inputs

- Archive `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified).
- Member `SSS 1/1st Term SS1_/MATHss1.docx`, 819,678 bytes, SHA-256 `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb` (re-verified this task).
- Extraction: mammoth 1.12.2 `extractRawText()` (the importer's own call, no equation recovery): 28,396 characters, 1,209 lines, 564 non-blank. ZIP has 101 parts, including `word/header1.xml`, `word/footer1.xml` and 81 PNGs; `word/document.xml` contains `w:tbl` 0, `w:drawing` 320, `w:pict` 2, `m:oMath` 666 and `w:sectPr` 2.
- Line numbers below are 1-based lines of that extract. Block hashes are SHA-256 over the stated lines joined with `\n`, UTF-8, no trailing newline, leading/trailing blank lines trimmed. Lines keep their trailing spaces and tabs unless stated otherwise.

## Non-week region (lines 1-39)

| Lines | Content | SHA-256 | Disposition |
| --- | --- | --- | --- |
| 1-2 | blank | — | — |
| 3 | `SS1 GENERAL MATHEMATICS SCHEME OF WORK FOR FIRST TERM ` (one trailing space) | `4f69457fb98d5f8bae0adadeb8c7f60080125030ece078745d2f2898fddfa833` | `RULE-MATH-T1-ALIAS` (source registration) and `COV-MATH-T1-TITLE` |
| 4 | blank | — | — |
| 5 | `WEEK[S]` + 43 spaces + `TOPIC` (55 characters) | `b0dc014ff28cc622ac333ea55b91be3f727c95c28bcf10e9dc7c2c435091321b` | `COV-MATH-T1-TITLE` (with line 3; block 3-5 `65262773200258982a17bc7f02dbbc5fde81e4d9ff83f1692659c5ce56b0be14`) |
| 7-25 | ten scheme topic rows (see next table) | `70d03f876ed4017074b68f0bad8ac26422035ebd0499a4007943c7581e3155a7` | one row per week: `MATH-WK-T1-W01`..`W10`; existing `COV-MATH-T1-R00`..`R09` cite scheme lines 1-10 |
| 27, 29, 31 | `Revision.` / `Examination.` / `Examination` | `7d9e656eb6916ccd863b2ba66defe54c10a54b319d3bfa3fbbc00a37c79a4cba` | `COV-MATH-T1-EXAM` (MARKER, `RULE-MATH-T1-SCHEME-EXAM`) |
| 33, 35, 37, 39 | `REFERENCE  BOOKS` and three titles | `a817c8c4fb8f8cc24a694d09e990830b2924985f5c519fa9c6a530d046b053f0` | `COV-MATH-T1-REFERENCES` (MARKER, `RULE-MATH-T1-REFERENCES`) |
| 1-39 | whole non-week region | `b4714bdb55b30d3a9d9a4910874072ad7e07f0b91ebf0896faebaacbe5e1862a` | accounted by the three coverages above |
| before line 41 | `text.slice(0, index of "Week 1.")` (lines 1-40, offset 1527) | `63fa18ae46b16474b0452c0c2be4513ae991c68f4e0de9a8193308c54ad41b87` | exact value the compiler's `PREAMBLE_REQUIRES_COVERAGE` detail will hold; computed by slicing, the importer was not run |
| header/footer parts | `Lesson   note` (three spaces) and ` PAGE   \* MERGEFORMAT 1` | `8c711de4e58e0320480d3d58c48fb6d68d3945a2a8f8cc83ed6ef3aa8c1f4d7d` / `81e2cbcfa8fd4a2746ca99bdee0f6af313d695dbe8def8fcde79435499967e7c` | page furniture, recorded here only (not body text; already noted in `header_evidence`) |

Lines 6, 8-24 (even), 26, 28, 30, 32, 34, 36, 38 and 40 are blank. Line 41 is `Week 1.`, the first parsed label; parsed bodies start there.

## The scheme rows are an auto-numbered list

- `word/document.xml` paragraphs 3-15 (0-based) — the 13 scheme rows, extracted lines 7 through 31 — all carry `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="20"/></w:numPr>`.
- `word/numbering.xml`: num 20 maps to abstractNum 20, `w:numFmt` decimal, `w:start` 1, `w:lvlText` `%1` (no period).
- Word therefore renders week numbers 1-13 beside the 13 scheme rows. `mammoth.extractRawText()` emits no list markers, so the extracted text has no numbers and line 5's `WEEK[S]` column is empty textually.
- The parsed body has explicit labels `Week 1.` through `Week 11` (11 rows in `docs/ss1/work/SS1-03/evidence/parsed_rows.json`), so scheme rows 12-13 (the two examination lines) have no teaching body. Nothing is lost from those rows: they are markers only, and no examination lesson is invented.
- Scheme rows 1-11 correspond by order to body Weeks 1-11 (rows 1-10 are teaching, row 11 is revision, whose body is parsed Week 11).

## Scheme topic rows (lines 7-25) mapped to the week items

| Scheme row | Line | Hash of the line | Week item | Objective text (verbatim) |
| --- | --- | --- | --- | --- |
| 1 | 7 | `7983ef7f2c914c795c00044aabb2dcb4365b3f8ac9837c16935aa8d7074954fd` | `MATH-WK-T1-W01` | `Revision of Jss3 work and basic operations of integers; addition, subtraction,           multiplication and division.` |
| 2 | 9 | `e7c3bc08190b25e1a30bb3d5045329bdf962a2fc6a82f8df354c84aca535d6ba` | `MATH-WK-T1-W02` | `Number Bases; [a] Conversion from one base number to base ten. [b] Conversion of decimal fraction [bicimals] in one base to base ten.   [c] Conversion of numbers from one base to another.` |
| 3 | 11 | `211510b9f9db039c903205ed61d007cd806909bdf73f7e36e1289381e8724659` | `MATH-WK-T1-W03` | `[a] Addition, subtraction, multiplication and division of number bases . [b] Application of number bases to computer programming.` |
| 4 | 13 | `dde801e5520deaffb5cf6abbbab2a23ec88683423123762588b6c1e286290a7b` | `MATH-WK-T1-W04` | `Concept of Modular Arithmetic; Addition, subtraction, multiplication and division of operations of modular arithmetic.` |
| 5 | 15 | `da8824cb62d20f353c78b9547433c277dc10bf917061b613905acaf53ff7bcdc` | `MATH-WK-T1-W05` | `Standard form and Approximation` |
| 6 | 17 | `14528a78270dcb3ffc0dbacb4e5dac579cfff423c9a28b964ddc0631e5e9bf2d` | `MATH-WK-T1-W06` | `Indices; [a]Application of laws of indices. [b] Negative, zero and fractional indices.` |
| 7 | 19 | `a3f2da8ef844af4d1b7858455cdbc3205cb947cd89e85b225566c3e968048fdf` | `MATH-WK-T1-W07` | `Reviewof first half term and periodic test` (source spacing, sic) |
| 8 | 21 | `82de06d46b67b839bb46499917618e3d6fe29e87b624a7f3ec0d8754af01c4a7` | `MATH-WK-T1-W08` | `Logarithms of numbers greater than 1 [whole number]→ use of logarithm table for multiplication and division of numbers.` |
| 9 | 23 | `104c6913b6b9901483c4af4a4f9c3837082c0d4d5a4a302331bbe8cb7a497c78` | `MATH-WK-T1-W09` | `Logarithms CTD; [a] calculations involving powers and roots. [b] Relationship between indices and logarithms.` |
| 10 | 25 | `c853db5a779e68f79f2fe25c949b8863333791ba11a5720745b0c8ae77059c87` | `MATH-WK-T1-W10` | `[a] simple equation and variation. [b] Change of subject of formulae. [c] Type of variation; direct, inverse, joint and partial variation. [d] Applicationof variation to practical problems.` |
| 11 | 27 | `067123e0afb74e0255aa210d2d56577c04613c68ae2b1d2cd4c3bf2845cf6103` | `MATH-WK-T1-W11` | `Revision.` |
| 12-13 | 29, 31 | `b3c848512dc884346eb57d4a56795261223381674eeaccead4706d2caf88163b`, `2bf2ad58276441a0a5400537f08f33cb0378f5ff6299b45ae606d9700e95d6f1` | none (examination markers) | `Examination.` / `Examination` |

No lesson task is appended: the scheme rows name objectives that the existing `MATH-WK-T1-W01`..`W11` items already own, and this task identifies no new uncovered objective.

## Revision/examination block (lines 27-31)

- Block hash `7d9e656eb6916ccd863b2ba66defe54c10a54b319d3bfa3fbbc00a37c79a4cba`; three auto-numbered scheme rows 11-13.
- `RULE-MATH-T1-SCHEME-EXAM` was re-anchored from `Revision.\n\nExamination.\n\nExamination\n\nREFERENCE  BOOKS` (54 characters, previously conflating the reference heading) to `Revision.\n\nExamination.\n\nExamination` (36 characters). The new anchor occurs exactly once in the extract and matches no parsed row (the first parsed body starts at `Week 1.`, line 41), so the compiler will emit a `SCHEME_ONLY` disposition for it exactly as before.
- `COV-MATH-T1-EXAM` (MARKER) objective/locator/evidence updated to scheme rows 11-13 and the block hash. Row 11's teaching body is parsed Week 11 (`COV-MATH-T1-R10`); rows 12-13 have no body. Marker bodies are retained; nothing is discarded.

## Reference-book list (lines 33-39)

- Block hash `a817c8c4fb8f8cc24a694d09e990830b2924985f5c519fa9c6a530d046b053f0`. Heading is `REFERENCE  BOOKS` with two spaces. Line 39 ends with 13 tab characters, kept verbatim in the anchor.
- New `RULE-MATH-T1-REFERENCES` (classify_marker, kind `SCHEME_ONLY`) uses the exact 225-character anchor of lines 33-39; it occurs exactly once and matches no parsed row. New `COV-MATH-T1-REFERENCES` (MARKER) maps it.
- Titles verbatim: `MAN MATHEMATICS FOR SENIOR SECONDARY SCHOOLS 1`; `ESSENTIAL MATHEMATICS FOR SENIOR SECONDARY SCHOOLS 1 BY A.J.S OLUWASANMI`; `NEW GENERAL MATHEMATICS FOR SENIOR SECONDARY SCHOOL 1 BY M.F.MACRAE ETAL`. No edition, publisher or year is stated in the source, and none is added.

## Title and scheme header (lines 3-5)

- New `RULE-MATH-T1-TITLE` (classify_marker, kind `SCHEME_ONLY`) anchors on the title line 3 without its trailing space (53 characters; the title is also the registered `header_text`, which occurs once). New `COV-MATH-T1-TITLE` (MARKER) records line 3 `4f69457f…`, line 5 `b0dc014f…`, lines 3-5 `65262773…` and the pre-body slice `63fa18ae…`.
- The rule states document identity only; the scheme rows that follow are mapped as described above.

## Package changes

`backend/src/db/ss1/subjects/mathematics.json` only:

- Added `RULE-MATH-T1-TITLE` and `RULE-MATH-T1-REFERENCES` (both `classify_marker` / `SCHEME_ONLY`), re-anchored `RULE-MATH-T1-SCHEME-EXAM`; now 10 source rules.
- Added `COV-MATH-T1-TITLE` and `COV-MATH-T1-REFERENCES`, updated `COV-MATH-T1-EXAM` (all `MARKER`); now 36 coverage entries.
- Unchanged: 3 sources, 6 lessons, 6 delivery corrections, 0 assets, 7 open items, `package_status` `PENDING`; all 2nd/3rd Term rules and coverage entries untouched.

`docs/ss1/work/microtasks/mathematics/QUEUE.json`: `MATH-PRE-T1` set to `IMPLEMENTED_TESTING_DEFERRED` with this evidence; `status_counts` now 20 implemented / 66 pending / 9 blocked (95 total); `review` date 2026-10-29 and master SHA updated; `next_runnable` is `MATH-PRE-T2`; `runnable_now` recomputed to the 59 pending items whose dependencies are implemented. A note records the change; notes 1-7 remain the queue-generation snapshot.

## Validation performed

- `JSON.parse` on both changed JSON files; the files still round-trip byte-for-byte at 2-space indentation with CRLF line endings.
- Rule and coverage IDs unique; each 1st Term `classify_marker` anchor occurs exactly once in the raw extract (plain string count, not the importer) and is absent from lines 41 onward, so no parsed body can bind it ambiguously.
- Every `MARKER` target among the 1st Term coverages is either a parsed body ID (REVISION bodies) or a `SCHEME_ONLY` rule that will produce a disposition (anchor matches no parsed row).
- Diff reviewed; only the three allowed paths are touched.

Not run (deferred by owner): zod schema parse, compiler/plan, tests/typechecks, importer, database/device checks, migration, import, deployment.

## Findings for later work

- The scheme is not a table object (`w:tbl` 0): it is 13 auto-numbered paragraphs whose numbers mammoth drops. Any future equation-aware or richer extractor considered under `OI-MATH-001` should also emit list numbers; the coverage mapping here does not depend on them because row order is stable and each row text is unique.
- Scheme rows 12-13 are examination weeks with no body; no examination lesson exists and none is invented. `MATH-WK` items cover weeks 1-11 only.
- Reference titles carry no edition, publisher or year; later lessons must not cite page numbers or editions.
- Source wording defects in the scheme (`Jss3`, `Reviewof`, `Applicationof`, `CTD`, the space before the full stop in row 3) are quoted, not corrected.
- Header/footer parts are page furniture (`Lesson   note`, a PAGE field); no coverage is needed for them.
- The Preamble will still surface as `PREAMBLE_REQUIRES_COVERAGE` in a compiler plan because the compiler emits that disposition for any text before the first parsed body; the three coverages above map the whole region, and the recorded slice hash `63fa18ae…` lets a later run check it without guessing.

## Remaining

`MATH-PRE-T1` is complete with testing deferred. Next runnable: `MATH-PRE-T2`. Still open in this queue: `MATH-PRE-T3`, `MATH-VIS-T1`..`T3` (and `MATH-VIS-T3-OLE`), 32 `MATH-WK-*` items, `MATH-FACT-LOG-TABLES`, `MATH-FACT-ADVERT-T2`/`T3`, `MATH-PORT-D2-*`, `MATH-CMP-D4-*` and `MATH-APPROVAL-ALIASES`. No subject or class completion is claimed.
