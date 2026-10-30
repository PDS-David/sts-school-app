# ENG-WK-T1-W03 — English, 1st Term, Week 3 (indexing)

Status: **IMPLEMENTED_TESTING_DEFERRED** — indexing is complete. Its content gaps are **not** closed.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Base: origin/master `986cedd`, isolated branch `ss1/eng-wk-t1-w03-20261030`. Open PRs at fetch: #242 (Economics ECON-INV-T2) only; none owns English.
- Prerequisite ENG-SRC-T1 is implemented; source `SS1-SRC-a00657d42196` is registered in `backend/src/db/ss1/subjects/english.json`.
- Member `1ST TERM S1 ENGLISH LANGUAGE.doc` taken from the supplied `1st Term SS1` archive, SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef` verified (equals the task's Member SHA-256). The composite archive (`02448712…9a3e`) was not supplied, so its hash was **not checked**.
- Method: text extracted privately with `word-extractor` `getBody()` (81,965 characters, SHA-256 `8c3faa979ab73ef5de1cbc97976405c20332d505d49233cc147bfef691034a4e` after the existing rules R001-R029), then split by a scratch copy of the WEEK-marker logic in `parseTopics` (`backend/src/db/ingestTopics.ts`) so locators match the importer's input. The importer itself was not run. Nothing from the source is committed.

## Week 3 rows (reproduced; hashes equal the existing coverage)
| Row | Label | Body SHA-256 |
|---|---|---|
| ENGLISH-BODY-008 | `WEEK THREE` (essay writing, report writing) | `449da7006b26f4ac12a197463e14953838e91a15ced4a14cb66eae77136fffb5` |
| ENGLISH-BODY-009 | `WEEK 3` B (monophthongs) | `fa385ddd2653424798fad83c378ca8b79ce3b40486330f26cf3c657e23928dae` |
| ENGLISH-BODY-010 | `WEEK 3` C (idioms) | `5729b94b873d9022c6655ae94546989abcd917fbd273fdf3a9faaceca23ff913` |
| ENGLISH-BODY-011 | `WEEK 3` D (entertainment vocabulary) | `dc0a9d077a9bfc0422295f67472f40f519200d1e4846093969b02007838b1d09` |

Every new `objective_locator` is `<body id> :: from '<exact start text>' to before '<exact end text>'` (or `to end of body`). Each anchor was checked to occur exactly once in its body.

## Scheme row 3 → entries
| Scheme objective | Entries |
|---|---|
| Essay writing: types of essays | ES01 (types), ES02 (formal report), ES03 (minutes), ES04 (evaluation), ES05 (reading assignment) |
| Speech work: monophthongs | MN01 (definition), MN02 (twelve vowels), MN03 (evaluation), MN04 (reading assignment) |
| Idioms | ID01 (definition), ID02 (idiom list) |
| Vocabulary development: words associated with entertainment | EN01-EN07 (introduction, sport words, theatre words, evaluation, reading, revision questions, weekend assignment) |

All entry IDs are prefixed `ENGLISH-T1-W03-`. Report writing and minutes are taught in the body but are not named in the scheme row. The monophthong evaluation and reading assignment sit at the end of the Idioms row (displaced from their topic).

## Outcome (19 new entries; ENGLISH-BODY-008..011 kept unchanged)
- **SUPPORTED (3):** ID01, EN01, EN03.
- **IMPLEMENTED_EQUIVALENT (1):** MN02 (via `SUP-SS1-ENGLISH-PHONETICS-T1`).
- **MARKER (1):** SCHEME-ROW → rule `SS1-SRC-a00657d42196-R030`.
- **PARTIAL (9):** ES01 (types listed, none described), ES02 (layout only), ES03 (stops after opening details), ES04 (no scenario or key), MN01, MN03, ID02 (entries to review), EN02 (no 'Football' gloss, repeated clause, 'Wooden clothes'), EN06 (five questions, no key).
- **UNRESOLVED (5):** ES05, MN04, EN04, EN05, EN07 (book pages not supplied).

## Replacement scope check
Correction `SS1-02-english-COR-005` replaces ENGLISH-BODY-009 with `SUP-SS1-ENGLISH-PHONETICS-T1`. It lists the twelve pure vowels with keywords (MN02 equivalent) but does not define a monophthong or contrast single-element and double-element vowels (MN01 stays PARTIAL), and its practice lacks the 'two examples of each sound' task (MN03 stays PARTIAL). No other Week 3 row is displaced by a correction. Source word lists in BODY-009 contain repeated and doubtful entries; they are flagged, not corrected.

## Rule added
`SS1-SRC-a00657d42196-R030` `classify_marker` / `SCHEME_ONLY`, anchored on the Week 3 scheme-table line. It occurs once in the extracted text and in no parsed WEEK body (checked). No other rule changed. Scheme rows 4 to 11 are not classified here.

## Open items added (all block delivery)
`ENGLISH-T1-W03-EXTERNAL-MATERIALS`, `-ESSAY-REPORT-SCOPE`, `-SOURCE-WORDING-REVIEW`, `-ANSWER-KEYS`, `-PHONETICS-REPLACEMENT-SCOPE`.

## Queue edits
ENG-WK-T1-W03 → `IMPLEMENTED_TESTING_DEFERRED`; six PENDING follow-ups appended (ENG-FACT-W03-EXTERNAL-MATERIALS, ENG-LES-W03-ESSAY-REPORT, -IDIOMS, -ENTERTAINMENT-VOCAB, -MONOPHTHONGS-SCOPE, -REVISION-KEYS); counts and status_counts recomputed; one note appended. `next_runnable` is unchanged (`ENG-LES-W02-PHRASAL-VERBS`). Existing IDs, entries and rules otherwise unchanged.

## Checks run (authoring only)
SHA-256 of the member and the four row bodies, JSON parse of both edited files, unique IDs, dependency resolution, anchor uniqueness, that existing coverage/rules/open items/lessons/corrections are byte-for-byte unchanged, that every new PARTIAL/UNRESOLVED entry is named by a blocking open item, and `git diff`. Nothing was executed against the importer, database or tests.

## Remaining
Package status stays PENDING; no approval, certification or verification is recorded or implied. The indexing of Weeks 4-11 remains. Next eligible: `ENG-LES-W02-PHRASAL-VERBS` (current `next_runnable`); the next indexing item is `ENG-WK-T1-W04`. This does not claim the subject or class complete.
