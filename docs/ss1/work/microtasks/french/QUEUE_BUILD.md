# French work queue — build note

- Reviewed master SHA: `dd739bba4101c0b1e2f5924863deaaa0b38c27c7` (no French queue existed; no open PR owns this task; PR #71 not used).
- Built from repository evidence only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device). Testing deferred by owner.

## Existing work recognised (recorded, not verified)
- 3 sources registered in `french.json`; hashes, members and terms equal `SOURCE_ASSIGNMENTS.csv` → `FR-SRC-T1..T3` IMPLEMENTED_TESTING_DEFERRED.
- 27 authored lessons (`FR-LES-*`) and 28 delivery-correction bindings (`FR-COR-*`): implemented code, content approval PENDING, verification DEFERRED. Their whole-row scope review is **not** done and is tracked separately.
- 29 coverage entries, all row-level IMPLEMENTED_EQUIVALENT (not proof of objective-level checking).
- `tests/ss1/french.package.test.mts` (6 tests) written, not run → `FR-TEST-PACKAGE-EXISTING`.
- Open items `FRENCH-UNCLEAR-OCCUPATIONS`, `FRENCH-EXAM-AUDIO`, `FRENCH-AUTHORING-FINISH` are unchanged in `french.json`.

## Remaining tasks supported by repository evidence (41 PENDING, 4 BLOCKED)
- 28 week-indexing items (T1 W1–9, T2 W1–9, T3 W1–10; labels match the coverage locators and FRENCH_SOURCE_NOTES.md) + 3 non-week-text items (`FR-PRE-*`).
- `FR-FACT-OCCUPATIONS` (factual inspection of *computateur*/*couteur* — the agent inspects context first).
- Exam audio: `FR-FACT-EXAM-AUDIO-REQUIREMENTS` (PENDING, documentation only) → `FR-ASSET-EXAM-AUDIO-ACQUISITION` → `FR-ASSET-EXAM-AUDIO-INSTALL` → `FR-VERIFY-ORAL-OBSERVATION` (all BLOCKED; acquisition does not depend on installation or oral observation).
- `FRENCH-AUTHORING-FINISH` decomposed: `FR-SCOPE-AUTHORING-FINISH` (umbrella) over the week/preamble items, 5 `FR-VIS-*` visual dispositions, `FR-FACT-REPLACEMENT-SCOPE`, `FR-TEST-FULL-SOURCE-REGRESSION`.
- `FR-FACT-CONTENT-APPROVAL` (BLOCKED, separate owner stage).
- No lesson-writing item: no specific uncovered objective is named in the repository (the T2 future tense is already supplied). Add one only after indexing names it.

## Unknowns requiring original documents
- Each week's actual scheme objectives, and whether any week has more than one teaching section.
- Whether T1 has opening text; which T3 weeks carry the revision/examination markers; content of the T2 opening scheme.
- The two unclear profession strings' context; the exact WAEC/NECO recording identity.

## Checks done
JSON syntax, 104 unique IDs, all `depends_on` resolve, no cycles, status totals (59 IMPLEMENTED_TESTING_DEFERRED / 41 PENDING / 4 BLOCKED), source hashes vs CSV.

## Next runnable task
**`FR-WK-T1-W01`** — first PENDING item whose dependency (`FR-SRC-T1`) is complete. Attach the 1st Term French member (`SSS 1/1st Term SS1_/FRENCH Ss1.docx`, sha256 `2bedee52…c43e864`).
