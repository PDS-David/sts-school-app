# Biology work queue — build note

- Reviewed master SHA: `07fe5116e50bc8848aa2837a72e3f28419e41933`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `biology.json`, tests, assets, Worker C (SS1-04) checkpoint/handoff or source notes for Biology. No origin/ss1/* branch holds unmerged SS1 biology work (matches outside JSS3 documents are only the Worker C prompt, manifest and registry). Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**.
- The 1st Term file is named "BIOLOGY 1 alfa term - Copy.docx". A copy-style filename proves neither duplication nor subject; no other 1st Term Biology document is assigned, so no duplicate rule is implied.
- Week counts, scheme/preamble content, labelled diagrams and any medical/health statements are unknown. Worker C requires diagrams to be preserved and outdated medical claims to be corrected from primary sources while keeping the source's history distinct.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`BIO-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`BIO-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`BIO-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`BIO-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`BIO-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`, member sha256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
