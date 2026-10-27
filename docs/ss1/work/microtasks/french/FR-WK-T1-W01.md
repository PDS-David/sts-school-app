# FR-WK-T1-W01 — French, 1st Term Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The week is **not fully covered**: four objectives remain UNRESOLVED and one PARTIAL, by design of the completion condition.

## Inputs
- Starting SHA: `1c6bd808c8a3b15da0d625a155f8b9bbc0fc9a85` (origin/master). No open PR touched this item; prerequisite FR-SRC-T1 was already IMPLEMENTED_TESTING_DEFERRED. No `AGENTS.md`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`).
- Member `SSS 1/1st Term SS1_/FRENCH Ss1.docx`, SHA-256 `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864` **verified**, 97,321 bytes; source `SS1-SRC-945dfb24eaf6`.
- Method: member extracted privately outside Git; `word/document.xml` parsed with Python `lxml`, locators are 0-based children of `w:body` (the convention in `FRENCH_SOURCE_NOTES.md`). Importer/mammoth output was not generated, so the existing body hash `09796ff9…f493d` was **not recomputed** here.

## Findings
- Week 1 = body children **2–20** (label at 2, content 3–20; Week 2 label at 21). Children 5, 8, 10, 12, 15, 18, 20 are empty.
- It contains **no exercise, question or assignment, no drawing/pict/OMML/text-box/hidden or tracked-change text**. So no source exercise is displaced by the replacement; Q1–Q3 in `SUP-SS1-FRENCH-PURPOSE-T1` are newly authored, not equivalents of source exercises.
- There is **no scheme-of-work table** before Week 1 (children 0–1 are `FRENCH` and `SS 1`). Week 1 is an ordinary teaching row, not REVISION/EXAMINATION/SCHEME_ONLY, so no `classify_marker` rule was added. Preamble indexing belongs to FR-PRE-T1.
- Child 19 is cut off mid-word (`… political e.t`) and nothing follows it.

| Coverage id | Source children | Status | Binding |
|---|---|---|---|
| `FRENCH-T1-W01-OBJ-1` usefulness/importance of French | 3–4, 6 | PARTIAL | `SUP-SS1-FRENCH-PURPOSE-T1` (learner-facing reasons only) |
| `FRENCH-T1-W01-OBJ-2` government attention, schools, Badagry | 7, 9, 11 | UNRESOLVED | none |
| `FRENCH-T1-W01-OBJ-3` how French was adopted | 13–14 | UNRESOLVED | none |
| `FRENCH-T1-W01-OBJ-4` four Francophone neighbours | 16–17 | UNRESOLVED | none |
| `FRENCH-T1-W01-OBJ-5` benefits to Nigeria (cut off) | 19 | UNRESOLVED | none |

`FRENCH-BODY-001` and correction `SS1-02-french-COR-001` are unchanged; they remain a row-level association and do not cover OBJ-2 to OBJ-5.

## Edits
- `backend/src/db/ss1/subjects/french.json`: added the five coverage entries above and open items `FRENCH-T1-W01-FACT-CLAIMS` (FACT) and `FRENCH-T1-W01-UNCOVERED-CONTENT` (CONTENT), both blocking. No lesson, correction or asset added or changed.
- `QUEUE.json`: FR-WK-T1-W01 → IMPLEMENTED_TESTING_DEFERRED; added PENDING `FR-FACT-T1-W01-POLICY`, `FR-LES-T1-W01-NEIGHBOURS`, `FR-LES-T1-W01-BENEFITS`; added them to `FR-SCOPE-AUTHORING-FINISH.depends_on`; counts recomputed.
- No source claim was verified or taught; no policy fact was asserted.

## Remaining
- Dated primary sources for OBJ-1 to OBJ-3 (FR-FACT-T1-W01-POLICY); lessons for OBJ-4 and OBJ-5; owner/teacher decision on the cut-off sentence.
- `next_runnable` holds one item (queue convention); 39 PENDING items currently have satisfied dependencies. Same-file edits should run sequentially: next in order is `FR-WK-T1-W02`.
