# SS1 test report, 2026-11-08 run 3 (tester T1)

Tested SHA: `c4fdf77` (master after the run-3 claim commit; content head `d2c90f2`). Environment: Node v22.23.4, `npm ci --ignore-scripts`. Changes made by this run: this report and a fix to `docs/ss1/work/tester/verify-sections.py` (tester tool). No package, queue, source, UI or shared code touched. Importer, DB, deployment, device work and CI were not run or checked (CI: not checked).
Compared with run 2 (`TEST_REPORT_20261108_RUN2.md`, tested `65035ef`). 45 commits landed since.

Nothing on master blocks every agent: no schema-invalid file is newly introduced (the six D1 packages were already invalid in run 2).

## Results

| Check | Run 2 | Run 3 |
|---|---|---|
| `cd backend && npx tsc --noEmit` | pass | pass |
| `node --import tsx --test tests/ss1/*.test.mts` (repo root) | 23 pass / 25 fail / 2 skipped (50) | 31 pass / 25 fail / 2 skipped (58) |
| `_invariants.test.mts` | 8 pass, 4 fail | 8 pass, 4 fail (tests 2, 5, 7, 11) |
| `schema-check.mts .` | 6 packages fail | 6 packages fail, 12 issues |
| archive SHA256 | not re-stated | `024487129a86...c9a3e`: matches |
| per-file | english 0/6, french 0/6, literature 0/8, mathematics file-level fail | same failing set (test numbers 27-38, 50-57, and `mathematics.package.test.mts` fails at parse time) |

Per-file pass counts for the files that pass were not broken down this run; the +8 passing tests are consistent with the extra bookkeeping contract tests added in this window (5 commits touch `tests/ss1/bookkeeping.package.test.mts`) but I did not confirm that split.

## Defect delta

| # | Run 2 | Run 3 | Status |
|---|---|---|---|
| D1 schema failures | 12 in 6 packages | 12 in 6 packages, identical IDs: english `SS1-02-english-COR-012..015` (`evidence.objective_scope_audit` unrecognised); french `lessons.35.provenance.0.url` (`SUP-SS1-FRENCH-ORAL-ACCENTS-T1`) and `open_items.9.kind` (`FRENCH-T1-W05-PUNCTUATION-DRAWING-DISPOSITION`, enum); literature `lessons.0.provenance.0.url` (`SUP-SS1-LITERATURE-T1-W02-PROSE`) and `open_items.9.kind` (`LIT-ASSIGNMENT-MARKER-SCHEMA-GAP`); mathematics `open_items.13.kind` (`OI-MATH-T3-W03-ANGLE-57-5`), `open_items.14.kind` (`OI-MATH-T2-T3-REFERENCE-URLS`); physics `lessons.12.provenance.0.url` (`SUP-SS1-PHYSICS-T2-W02-THERMOMETERS-EVAPORATION`); technical-drawing `source_rules.6.kind` (`SS1-SRC-af4868d2c026-R007`) | RECURRING, still blocks the english, french, literature and mathematics per-package tests. Suggested owners: english/french/literature/mathematics: owner of the `agent/*` branch for that subject; physics and technical-drawing: `agent/physics-technical-drawing-ss1`. |
| D2 Mathematics lesson `body_sha256` | 3 | 3: `SUP-SS1-MATHEMATICS-T1-W03-BASE-OPERATIONS`, `-T1-W05-STANDARD-FORM`, `-T1-W06-INDICES` | RECURRING |
| D3 PARTIAL/UNRESOLVED without open item (indexing complete) | english 15, technical-drawing 20 | english 15 (`ENGLISH-BODY-008, 010, 011, 059, 061-067, 070, 074`, `ENGLISH-T2-W07-TP01`, `ENGLISH-T3-W06-SO03`), technical-drawing 20 (`COV-TD-T2-W01-*` x5, `-W03-*` x5, `-W04-*` x3, `-W05-*` x2, `-W06/W07-REDUCTION`, `-W08/W09-EQUAL-AREA`, `-W10-TANGENCY`) | RECURRING (35 total) |
| D4 stale `next_runnable` | 32 violations | 39 violations: bookkeeping 14 (missing BK-INV-T3, BK-PRE-T2, BK-MARK-T2-REVISION, BK-MARK-T2-EXAM, BK-WK-T2-W01..W04, BK-PRES-T2-WORKED, BK-PRES-T2-CURRENCY, BK-VIS-T2-TACC-W01, -TBL-W03, -TBL-W04, -BRACE-W04), catering-craft 3 (CC-FACT-T2-*), civic-education, commerce, data-processing, geography, government 1 each (the `*-TEST-PACKAGE` item), french 1 (FR-COR-001), physics 3 (PHYS-PORT-D1-*), yoruba 13 (5 eligible items missing, 8 `YO-LES-T3-W04..W07-EDE/ASA` listed but ineligible) | WORSE overall: bookkeeping went from 6 to 14 after the 26 owner commits (new T2 items) and the queue was not recounted at the end; agricultural-science is now clean; other subjects unchanged. |

New defects: none new in kind. D4 count rose; D1-D3 unchanged.

## Independent verification of worker output (recomputed from the archive, not from the notes)

Archive `docs/ss1/sources/SSS1-original.zip` SHA256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`: verified.

1. **Chemistry `CHEM-IDX-T1A-W07` (agent A5, commit `bf3b2ad`).** Member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`: 2,187,976 bytes, SHA256 `07053f97...bb3a`, as recorded. mammoth text: 55,382 characters, 2,129 lines, text SHA256 `f88594cb...e702`, as recorded. Range 1336-1489 hashes to the recorded `8afae8fe...b66d`. All 12 section rows recomputed: 12 of 12 match, 0 unparsed. `chemistry.json` holds 7 W07 coverage entries, 5 PARTIAL and 2 UNRESOLVED, as the commit message says. Regression on the earlier notes with the fixed tool: `CHEM-IDX-T1A-W04` 15 of 15, `-W05` 16 of 16 (31, as in run 2).
2. **Biology `BIO-PRE-T3` (agent A2, commit `feb3885`).** Member `SSS 1/3rd Term SS1_/3RD TERM S1 BIOLOGY.docx` SHA256 `1e9a758c...1bca4`, as recorded. Parsed `word/document.xml` directly (w:t runs per direct child of `w:body`, 0-based): 803 blocks, block 802 is `w:sectPr`. Range 0-24 `2a9906ba...b874`, block 25 `95035b77...eb35`, sub-ranges 0-2, 5-12 and 14-22 all match; blocks 3, 13, 23, 24 are empty. 21 of 21 block rows in the table match. Not checked: the claims about numbering (`numId` 26 and 76), footer text, absence of tracked changes, and the pairing of scheme rows with body topic lines.
3. **Biology `BIO-MARK-T2-REVEXAM` (agent A2, commit `3708bcd`).** Member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc` SHA256 `41cfcb18...4b44`, as recorded. Converted with LibreOffice 24.2.7.2 (the worker's stated version): 963 blocks, block 962 is `w:sectPr`. Block 17 is `Revision and Examination` with the recorded hash `4ebd2846...c964`, and the text occurs once. The ten week labels are at blocks 29, 92, 160, 262, 326, 481, 573, 683, 760, 887 (`WEEK ONE` to `WEEK TEN`); no `WEEK ELEVEN` or `TWELVE` exists. Week 10 range 887-961 `ecd6d1b6...b830`, range 940-947 `8a990e84...e639`, and every listed `GENERAL EVALUATION/REVISIONAL QUESTIONS` variant hash (blocks 71, 135, 237, 458, 549, 735, 658, 302, 869, 940) match. The importer's own `.doc` route (word-extractor) was not run, as the worker also said.

Not verified: correctness of coverage statuses, objective wording, follow-up decisions, the classification of the Biology marker as SCHEME_ONLY, and the Chemistry W07 queue follow-ups. Not looked at in depth: the 26 owner commits for Bookkeeping and Agricultural Science (`AG-INV-T3`, `AG-MARK-T1-REVISION`, `AG-MARK-T1-EXAM`, `BK-*`); only their file paths were scanned. Coverage-locator spot checks (three per subject) were not done this run.

## Tool defect found and fixed (tester tools)

`docs/ss1/work/tester/verify-sections.py` took the first integer cell as the line range, so tables that start with a `#` column (as `CHEM-IDX-T1A-W07.md` does) gave 12 false mismatches. It now prefers an explicit `a-b` range and accepts a bare integer only when it is the sole integer cell; ambiguous rows are listed UNPARSED. Re-run on Chemistry W04, W05 and W07: 15, 16 and 12 rows, all matching.

## Observations on how the work is being done

- Worker agents (A2 Biology, A5 Chemistry) follow the protocol: claim, one item per commit, release; checked commits stay inside the item's allowed paths; packages stay PENDING; `biology.json` untouched by the two Biology items; `chemistry.json` passes the schema after W07.
- The 26 owner commits (author David Oludotun) go straight to master with no claim files for Bookkeeping or Agricultural Science, so the claim list does not show who is working there. They also change `tests/ss1/bookkeeping.package.test.mts`, a tester-owned path, five times (a "deferred package contract test"). I did not review those tests for correctness. They add to D4: the bookkeeping queue was extended without a `next_runnable` recount.
- Agent identity: commits by A5 are authored "Claude Worker", A2 as "A2" or "Claude"; only the message identifies the agent.
- Done-conditions still differ between subjects (see run 2): Chemistry W07 adds 5 PARTIAL and 2 UNRESOLVED entries and relies on queue follow-ups rather than open items; this passes Chemistry's condition, not English's, so test 7 does not report it while Chemistry indexing is incomplete.
- Prompt/protocol hazard: the standing prompt chains `cd backend && ... ; node ... tests/ss1/*.test.mts`. The tests live at the repo root, so from `backend/` the glob matches nothing and `node --test` reports 0 tests with exit code 0, which looks like a green run. Run the tests from the repo root (as this report did).
- Eight `agent/*` branches exist (`french-yoruba-ss1`, `literature-ss1`, `literature-ss1-execution-20261107`, `maths-further-maths-ss1`, `physics-technical-drawing-ss1`, `ss1-independent-qa`, `ss1-source-inspection`, `ss1-source-inspection-english`). `branch-check.sh` was not run on any of them: nobody asked and no PR merge was pending. The D1 and D2 defects in french, literature, mathematics and physics are likely already addressed or in progress there; I did not check.
- Credentials: a GitHub token was supplied in the session. It was used only as an in-memory request header and written to no file or report. Because it appeared in plain chat, the owner should consider rotating it.

## What was NOT tested

CI, importer, DB, deployment, device behaviour, UI; `branch-check.sh` on any branch; correctness of coverage statuses and follow-up decisions; the owner commits for Bookkeeping and Agricultural Science beyond their file paths; the three coverage-locator spot checks per subject; per-file test counts for passing files.

## Next run

`git fetch && git pull --rebase origin master && npm ci --ignore-scripts && node --import tsx --test tests/ss1/_invariants.test.mts` (from the repo root). Priorities: D1 (blocks four per-package test files), D2, D4 recount for bookkeeping and yoruba; then verify the next worker commits, and run `branch-check.sh` on the branches if the owner asks.
