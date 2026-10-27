# Agricultural Science work queue — build note

- Reviewed master SHA: `682af40f8e10747a226842db4516fac613e3c773`. No `AGENTS.md` exists. No open PR (other than the alternate foundation #71, not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `agricultural-science.json`, no tests, no assets, no Worker C (SS1-04) checkpoint or handoff, and no source notes for this subject. No origin/ss1/* branch holds unmerged SS1 agriculture work (the only match is the Worker C prompt; other "agric" hits are JSS3). Nothing is recorded as implemented. This absence is a finding, not a gap in the search.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term), from `SOURCE_ASSIGNMENTS.csv`; hashes also equal `sourceRegistry.json`. All are filename-based assignments; **no document header has been verified**. The 2nd Term filename reads "AGRICULTRAL".
- Week counts, scheme/preamble content, drawings, tables and media are unknown. The 3rd Term file is 5.4 MB, which suggests embedded media but proves nothing.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`AG-SRC-T1..T3`) |
| SOURCE_WEEK_INVENTORY | 3 (`AG-INV-T1..T3`) |
| TEST | 1 (`AG-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`AG-FACT-CONTENT-APPROVAL`, BLOCKED) |

`AG-SRC-T1` is explicitly permitted to create the minimum package; T2/T3 depend on it. Each inventory worker appends the per-week, visual and other small items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`AG-SRC-T1`** (no dependencies). Required attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`, member sha256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
