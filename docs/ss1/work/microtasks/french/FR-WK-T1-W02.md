# FR-WK-T1-W02 — French, 1st Term Week 2 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The week is **not fully covered**: three objectives are PARTIAL by design of the completion condition.

## Inputs
- Starting SHA: `656327870c44e7ab0cc0b8818bf4af061048c36e` (origin/master, after PR #152). GitHub API listed 0 open PRs and no `fr-wk-t1-w02` branch existed. Prerequisite FR-SRC-T1 is IMPLEMENTED_TESTING_DEFERRED. No `AGENTS.md`.
- Member `SSS 1/1st Term SS1_/FRENCH Ss1.docx`, SHA-256 `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864` **verified**; source `SS1-SRC-945dfb24eaf6`; equals `SOURCE_ASSIGNMENTS.csv` (97,321 bytes).
- Container supplied: a "1st Term SS1" zip (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`), member path `1st Term SS1 /FRENCH Ss1.docx`. The composite archive hash (`024487…c9a3e`) was **not** checked; no composite check is claimed.
- Method: member extracted privately outside Git; `word/document.xml` parsed with Python `lxml`; locators are 0-based children of `w:body` (convention of `FRENCH_SOURCE_NOTES.md`). Importer/mammoth output was not generated, so the existing body hash `970d1e7a…56a7e5` was **not recomputed**.

## Findings
- Week 2 = body children **21–77** (label at 21, heading `LES PAYS FRANCOPHONE EN AFRIQUE` at 22, Week 3 label at 78).
- There is **no scheme-of-work table** in this document, so objectives are the week's own sections: Francophone list (22–46), DEVOIR 1 (48–49) with Anglophone list (51–66), DEVOIR 2 (68–69) with examples (70–73), bare headings 75 and 76. No REVISION/EXAMINATION/SCHEME_ONLY row, so no `classify_marker` rule was added; the DEVOIR labels sit inside a teaching row and discard nothing.
- No tracked-change, hidden, text-box, table or OMML content. 36 Word drawings, each with a `pict` fallback, sit in children 23, 30–46, 52–66 and 71–73; their dispositions belong to `FR-VIS-T1-COUNTRY-SEPARATORS` and are not made here.
- **Exercises displaced by `SUP-SS1-FRENCH-COUNTRIES-T1`:** DEVOIR 1 (write the Anglophone countries) has no counterpart; DEVOIR 2 (names of the countries' peoples; wording garbled) is answered only for Nigeria, Egypt and Ghana. Children 75 and 76 are headings with no exercise.

| Coverage id | Source children | Status | Binding |
|---|---|---|---|
| `FRENCH-T1-W02-OBJ-1` Francophone list and capitals | 22–46 | IMPLEMENTED_EQUIVALENT | `SUP-SS1-FRENCH-COUNTRIES-T1` (23 countries; grouping label not taught) |
| `FRENCH-T1-W02-OBJ-2` Anglophone list, capitals, DEVOIR 1 | 48–66 | PARTIAL | same (reference only; exercise has no counterpart) |
| `FRENCH-T1-W02-OBJ-3` peoples of countries, DEVOIR 2 | 68–73 | PARTIAL | same (three examples only) |
| `FRENCH-T1-W02-OBJ-4` heads of state (heading only) | 75 | PARTIAL | same (concept and one dated example) |
| `FRENCH-T1-W02-OBJ-5` currencies (heading only) | 76 | IMPLEMENTED_EQUIVALENT | same (heading level; reading as monnaies is an interpretation) |

`FRENCH-BODY-002` and correction `SS1-02-french-COR-002` are unchanged. The correction's stated "scope review not done" is now partly answered by this record; the binding itself needs no change from this review.

## Edits
- `french.json`: added the five coverage entries and open items `FRENCH-T1-W02-UNCOVERED-EXERCISES` (CONTENT) and `FRENCH-T1-W02-HEADINGS-INTENT` (OWNER_ACTION), both blocking. No lesson, correction or asset added or changed.
- `QUEUE.json`: FR-WK-T1-W02 → IMPLEMENTED_TESTING_DEFERRED; added PENDING `FR-LES-T1-W02-ANGLOPHONE`, `FR-LES-T1-W02-DEMONYMS`, `FR-FACT-T1-W02-HEADS-OF-STATE`; added them to `FR-SCOPE-AUTHORING-FINISH.depends_on`; counts recomputed; `next_runnable` set to the next in order.
- No source claim was verified or taught; no country fact was asserted beyond what the existing supplement already states.

## Remaining
- Owner or teacher answer on the two bare headings; sourced practice for both DEVOIR exercises.
- Same-file edits should run sequentially: next in order is `FR-WK-T1-W03`.
