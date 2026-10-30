# FR-WK-T1-W04 — French, 1st Term Week 4 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The week is **not fully covered**: three of its five objectives are PARTIAL by design of the completion condition.

## Inputs
- Base: origin/master `0d9ba31` (fetched 30 October 2026). The GitHub API listed no open pull request at fetch time, so none owned French. Prerequisite FR-SRC-T1 is IMPLEMENTED_TESTING_DEFERRED. No `AGENTS.md`.
- Original: `FRENCH Ss1.docx` from the supplied `1st_Term_SS1_-20230730T171406Z-001.zip`, SHA-256 `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864` — **verified** against the task and the registered source `SS1-SRC-945dfb24eaf6`. The composite archive (`02448712…9a3e`) was not supplied, so its hash was **not checked**; the task accepts matching member bytes.
- Method: member read privately outside Git; `word/document.xml` parsed with Python `lxml`; locators are 0-based children of `w:body` (the convention of `FRENCH_SOURCE_NOTES.md` and FR-WK-T1-W03). Child-text hash = SHA-256 over the UTF-8 of each child's concatenated `w:t` text, joined by `\n`. The importer was not run, so the existing body hash `cdb575ad64a1741b51a3e67cf580e8d6fd4937ea1c759445cad9aad8adbea40f` was **not recomputed**.

## Findings
- Week 4 = body children **146–230** (label `WEEK 4` at 146, label hash `b3f936b4823f7d98598f38964d0c5c5c0d91adb471fa266c3aea6ddbe6b69ea4`; next label `WEEK 5` at 231). Whole-week child-text hash `e413c1a080f035bd2f5d3c857668397892abff3d56883abe25d7b8f3776e2701`. Empty paragraphs: 160, 186, 197, 210, 224.
- There is **no scheme-of-work table** in this document, so objectives are the week's own sections. No REVISION/EXAMINATION/SCHEME_ONLY row occurs, so no `classify_marker` rule was added. No `split_before` or `attach_stranded_label` rule is needed on this evidence: `WEEK 4` is alone on its paragraph.
- Every child is a plain paragraph: no table, text box, OMML, tracked change, hidden run, hyperlink or media part. The only non-ASCII character in the week is U+2019; **no accented letter occurs** (`etre`, `francais`, `Vous etes`), which is a source property, not an extraction loss.
- **Drawings:** 20 paragraphs carry a Word drawing with a VML fallback `pict` — 149–159, 187 and 189–196 (zero-height line shapes between a French form and its English gloss; no text, no image). The existing item `FR-VIS-T1-AUXILIARY-SEPARATORS` numbers the same paragraphs 1-based (`150-160, 188, 190-197`); the two schemes differ by one. Their visual disposition stays with that item and is **not** made here. Plain extraction joins French and gloss with no space (`Tu esyou are`, `Nous avonsWe have`).
- **Assessment:** one line only, the DEVOIR at 225–230. No model answer, answer key or mark allocation exists anywhere in the week.

### Objectives (sections of the week)
| Coverage id | Source children | Child-text sha256 | Status | Binding |
|---|---|---|---|---|
| `FRENCH-T1-W04-OBJ-1` two auxiliaries and être conjugation | 147–159 | `a36a5932b7be72186b7852c7be7cd363b8273a774e99d2f08ceeb995bc325c6e` | IMPLEMENTED_EQUIVALENT | `SUP-SS1-FRENCH-AUXILIARIES-T1` |
| `FRENCH-T1-W04-OBJ-2` être sentences (24) | 161–185 | `06501c4338be58ea4b0e76aea4441e1ee6e45af8152a78c7f706ca3b5c1b0f05` | PARTIAL | same |
| `FRENCH-T1-W04-OBJ-3` avoir conjugation | 187–196 | `a8180040a1ed7b9fbd9194850ba6c8ea2b1224177e1213193d4a7b54fbcf6144` | IMPLEMENTED_EQUIVALENT | same |
| `FRENCH-T1-W04-OBJ-4` avoir sentences (24) | 198–223 | `95f83c50857fccff2f826ade0589942fa6820d1ba2e36ed495407b86478845c5` | PARTIAL | same |
| `FRENCH-T1-W04-OBJ-5` DEVOIR, four stems | 225–230 | `c3eda1b2b036c20c2f70b6df518918c32ce84d2b357391445a39d2bfa95675a5` | PARTIAL | same |

### Displacement by `SUP-SS1-FRENCH-AUXILIARIES-T1`
The replacement is one short lesson (`Être et avoir au présent`) with six model être sentences, four avoir sentences, an agreement rule, the beaucoup d’ pattern, the negative with de, and three practice questions. Checked against each exercise in the row it displaces:
- **Conjugation tables (OBJ-1, OBJ-3): covered.** All six present forms of each verb are taught, and Q1 tests three of them. Residual differences, recorded as evidence and not as gaps that block: the replacement gives no English glosses, and it merges il/elle and ils/elles into one row each where the source lists them separately.
- **être sentences (OBJ-2): PARTIAL.** The 24 source sentences group as identity or relationship noun (6), location with `dans la classe` (3), nationality (4), profession (1) and description (10). The replacement covers identity (`élève`), state, one location (`en classe`), one nationality and agreement, but has no counterpart for relationship nouns and possessives, the profession pattern, `dans la classe`, physical-description adjectives or the volume of practice.
- **avoir sentences (OBJ-4): PARTIAL.** The 24 source sentences group as objects and places (14), family (3), money (1), age (1), quantity of friends (1), school courses and homework (3) and clothing with colour (1). The replacement covers possession, age, beaucoup d’ and the negative; it has no counterpart for family nouns, the partitive with money, school expressions or colour agreement.
- **DEVOIR (OBJ-5): PARTIAL.** The four stems ask for free sentences; the replacement's practice completes forms, negates and corrects agreement and has no composition task or model sentences.
- Source defects are recorded verbatim in the coverage evidence and are not presented as correct French (`Tu est beau` 166, `Ells sont` 159/183, `Nous sommes Africaine` 175, `Elle est une professeur` 171, `Il a argent` 207, `beaucoup des amies` 211, `Elles on tune belle mere` 221, `ropes` 222, `parapline` 204, `tableau blanch` 217, `Elles on des ropes roses` 222).

`FRENCH-BODY-004` and correction `SS1-02-french-COR-004` are unchanged. The correction's stated "scope review not done" is now answered for Week 4 by this record; the binding itself needs no change from this review.

## Edits
- `french.json`: added five coverage entries after `FRENCH-BODY-004` (`FRENCH-T1-W04-OBJ-1` … `OBJ-5`) and open items `FRENCH-T1-W04-ETRE-SENTENCE-SCOPE`, `FRENCH-T1-W04-AVOIR-SENTENCE-SCOPE` and `FRENCH-T1-W04-DEVOIR-SCOPE` (all CONTENT, blocking). No lesson, correction, asset or source rule added or changed.
- `QUEUE.json`: `FR-WK-T1-W04` → IMPLEMENTED_TESTING_DEFERRED; added PENDING `FR-LES-T1-W04-ETRE-SENTENCES`, `FR-LES-T1-W04-AVOIR-SENTENCES` and `FR-LES-T1-W04-DEVOIR` after `FR-LES-T1-W03-SELF-ESSAY`; added all three to `FR-SCOPE-AUTHORING-FINISH.depends_on`; counts recomputed (LESSON 36, 115 items; 63 implemented, 48 pending, 4 blocked); `next_runnable` set to the next in order, `FR-WK-T1-W05`.
- No lesson was authored and no source claim was verified or taught.

## Checks run
Authoring checks only: SHA-256 of the member, the label block and the whole week and five objective ranges; JSON parse of `french.json` and the queue (both rewritten with their original formatting); unique coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` entry resolving to an existing lesson, coverage or open item; every `depends_on` resolving; counts and status counts recomputed from items; `git diff` reviewed. No test, typecheck, importer, database or device check was run.

## Remaining
- Sourced practice for the untaught être and avoir sentence groups and a composition task for the DEVOIR (the three new queue items).
- Visual disposition of the 20 line shapes stays with `FR-VIS-T1-AUXILIARY-SEPARATORS`.
- Same-file edits should run sequentially: next in order is `FR-WK-T1-W05`. This does not claim the subject or class complete.
