# Literature work queue — build note

- Reviewed master SHA: `4df391a5779d42ae88ecfc7389fad2d3b3231b4a`. No `AGENTS.md` exists. The only open PR is #71 (alternate foundation, not used); no open PR touches Literature.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
No package, tests or assets exist on master, and no `origin/ss1/*` branch holds Literature work. The only repository evidence is `docs/ss1/work/SS1-02/CHECKPOINT.md`, which states that the 1st Term opening and the 2nd/3rd Term schemes and openings were read only and that no package exists, plus a draft label ("Literature-in-English") in `author_packages.py` that produced nothing. Literature is not a `FOUNDATION_RECONCILIATION.md` D-item, so there is no unmerged work to preserve. Nothing is recorded as implemented, and the checkpoint's observations are not treated as source evidence.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**. The 1st Term member is `LIT. IN ENGLISH.docx`; the others are `LITERATURE.docx`.
- The canonical subject name must come from the header, not from the draft script label.
- The 2nd and 3rd Term documents are called near-identical by the checkpoint ("not yet proved identical or fully read") but differ in SHA-256 and size (57389 vs 56647 bytes). No duplicate exclusion is made; `LIT-FACT-T2-T3-RELATIONSHIP` records the comparison.
- Week counts, scheme content and the book/extract each document names are unknown. Worker A requires the actual text to be determined from the document, a modern equivalent to be labelled and never presented as the school's prescribed text, and no page numbers or editions to be invented.

## Queue totals (9 items: 8 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`LIT-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`LIT-INV-T1..T3`; week counts and named texts unknown, not guessed) |
| FACTUAL_DEPENDENCY | 2 (`LIT-FACT-T2-T3-RELATIONSHIP` PENDING; `LIT-FACT-CONTENT-APPROVAL` BLOCKED) |
| TEST | 1 (`LIT-TEST-PACKAGE`, write-only, deferred) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`LIT-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/LIT. IN ENGLISH.docx`, member sha256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, attachments vs `SOURCE_ASSIGNMENTS.csv`, required-file paths exist, diff limited to the two allowed files.
