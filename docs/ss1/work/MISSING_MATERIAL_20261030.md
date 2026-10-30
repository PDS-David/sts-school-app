# Missing-material acquisition memo — 30 October 2026 (UNR-06)

Base: `origin/master` `4ed61dd`. Status: `IMPLEMENTED_TESTING_DEFERRED`. This memo only describes what the owner (or a named expert) must supply. **Nothing was downloaded, fabricated or committed, no source content is copied here, no package or queue was edited, and nothing was run.** Facts below were read from the queues, packages and contract at the base SHA; anything marked *proposal* is a recommendation, not a repo rule.

## 1. What each request really is

Not every row is a missing file. Read in this order:

| Kind | Rows | What the owner does |
|---|---|---|
| **Supply a file** | `TD-MISSING-T1`, `TD-MISSING-T3`, `FM-FACT-T3-MISSING-MATERIAL`, `FR-ASSET-EXAM-AUDIO-ACQUISITION`, `ENG-FACT-ORAL-AUDIO`, `ENG-FACT-PRESCRIBED-PASSAGES`, the 10 English pages (§5) | Provide the item, or take the stated alternative |
| **Decide (a file is one of two options)** | `MATH-LES-T1-W08-LOGARITHMS`, `MATH-LES-T1-W09-LOG-POWERS` (via `MATH-OWNER-LOG-METHOD`) | Say tables (name the edition, grant reuse) or calculator |
| **Nothing to supply; follows another row** | `FR-ASSET-EXAM-AUDIO-INSTALL`, `ENG-ASSET-AUDIO-MODEL` | Wait for the audio row above |
| **Nothing external to supply** | `YO-ASSET-T1-W03-VOWEL-CHART` | The block is an expert notation decision, not a missing document |

Every supply row except `ENG-FACT-ORAL-AUDIO` already carries a no-file alternative in its queue item (confirm the document does not exist, accept an original equivalent, or choose the calculator method). The alternatives are given per row.

## 2. Handling rules that apply to every row

These come from `docs/ss1/contracts/CONTRACT.md` and the compiler.

- **Hash.** SHA-256, lowercase 64-character hex, over the **exact original file bytes**. A new source also needs its byte count. Source documents are registered by a manifest row (`source_id, archive_member, sha256, bytes, term_from_folder, assigned_subject_slug, worker, mapping_status` in `SOURCE_ASSIGNMENTS.csv`, mirrored in `backend/src/db/ss1/sourceRegistry.json`). The compiler rejects an input absent from the registry as `unregistered or altered input`. Registering a new source is a later task: the Technical Drawing and Further Mathematics completion conditions say a new registration item is appended once a document is supplied.
- **Privacy.** The contract says: do not commit archive bytes, original full-document text, private plans or credentials. Only hashes, locators and short evidence go in Git. *Proposal:* hand over files out of band; the worker stages them under `/private/` as the contract describes.
- **Rights.** The contract states that a citation alone is not reuse permission. Any supplied extract, table or recording needs a stated rights basis, and lessons or assets with `reuse_status` other than `PERMITTED` block delivery.
- **Audio assets.** Allowed types are `audio/mpeg` and `audio/wav`. An asset record needs `path` (under `backend/src/db/ss1/assets/<slug>/`), `sha256`, `bytes`, `media_type`, `alt`, `order`, `lesson_id`, `source_locator`, `provenance`, `state`. *Proposal:* keep audio out of Git until the rights evidence exists.
- **Accepted file formats for source documents.** The contract fixes none. The existing manifest members are `.docx`. *Proposal:* supply originals in their native format (a `.docx` for a school document; a PDF or scan of the cited pages, or a typed extract, for a textbook).

## 3. Index

| # | Artefact | Subject / class / term | Kind | Closes or unblocks |
|---|---|---|---|---|
| 1 | `TD-MISSING-T1` | Technical Drawing, SS 1, 1st Term | Supply | Registration item; `TD-T2-W01-REVISION-SCOPE` check |
| 2 | `TD-MISSING-T3` | Technical Drawing, SS 1, 3rd Term | Supply | Registration item |
| 3 | `FM-FACT-T3-MISSING-MATERIAL` | Further Mathematics, SS 1, 3rd Term | Supply | `OI-FM-003`, `COV-FM-T3-SCHEME` |
| 4 | `FR-ASSET-EXAM-AUDIO-ACQUISITION` | French, SS 1, 3rd Term, Week 1 | Supply | `FRENCH-EXAM-AUDIO` |
| 5 | `FR-ASSET-EXAM-AUDIO-INSTALL` | French, SS 1, 3rd Term | Follows #4 | Asset entry |
| 6 | `ENG-FACT-PRESCRIBED-PASSAGES` | English, SS 1 (1st to 3rd Term reading) | Supply | `ENGLISH-PRESCRIBED-PASSAGES` |
| 7 | `ENG-FACT-ORAL-AUDIO` | English, SS 1, 1st and 3rd Term | Supply | Audio identity and rights record |
| 8 | `ENG-ASSET-AUDIO-MODEL` | English, SS 1 | Follows #7 | Asset entry |
| 9 | `YO-ASSET-T1-W03-VOWEL-CHART` | Yoruba, SS 1, 1st Term, Week 3 | Decision, not supply | `YO-T1-W03-EDE-07` |
| 10 | `MATH-LES-T1-W08-LOGARITHMS` | Mathematics, SS 1, 1st Term, Week 8 | Decision | `COV-MATH-T1-R07` |
| 11 | `MATH-LES-T1-W09-LOG-POWERS` | Mathematics, SS 1, 1st Term, Week 9 | Decision | `COV-MATH-T1-R08` |
| 12-21 | Ten English textbook pages | English, SS 1, 1st Term, Weeks 2 and 3 | Supply | See §5 |

## 4. Records

### 1. `TD-MISSING-T1` — Technical Drawing, 1st Term source document
- **State today:** `BLOCKED`. `SOURCE_ASSIGNMENTS.csv` holds exactly one Technical Drawing row, the 2nd Term (`SS1-SRC-af4868d2c026`). The queue says absence of a 1st Term document is not proof that none exists.
- **Supply:** the 1st Term Technical Drawing document, **or** the owner's confirmation that none exists.
- **Objective IDs it unblocks:** none yet, because no coverage exists for it. It lets `TD-T2-W01-REVISION-SCOPE` (verification of `COV-TD-T2-SCH-W01`) be checked: the 2nd Term Week 1 scheme says "Revision of the work for last term" without naming topics.
- **Format / hash / privacy:** original file; SHA-256 and bytes; private (§2).
- **Runnable once supplied:** a new registration item with its manifest row, then indexing. Owner confirmation instead closes the item and the revision-scope check stays unverifiable.

### 2. `TD-MISSING-T3` — Technical Drawing, 3rd Term source document
- Same as #1 for the 3rd Term. No dependent verification item exists. Runnable once supplied: a registration item. Alternative: owner confirmation that no 3rd Term document exists.

### 3. `FM-FACT-T3-MISSING-MATERIAL` — Further Mathematics, 3rd Term
- **State today:** `BLOCKED`. Source `SS1-SRC-c7a7523bdb0d` has no scheme of work and parsed Weeks 2, 3, 4, 5, 6 and 8 only (Week 6 repeats Week 5); Weeks 1, 7 and 9-12 are absent.
- **Supply:** the scheme of work and Weeks 1, 7 and 9-12, **or** the owner's confirmation that the supplied document is the whole term. Do not infer a scheme from filenames.
- **Objective IDs it unblocks:** `COV-FM-T3-SCHEME` (UNRESOLVED, no lessons) and `OI-FM-003` (`blocks_delivery: true`).
- **Also noted in `OI-FM-003`:** Week 3 refers to graphs that are not drawn in the source (y = 5, y = -3, x = 2, x = -4, and a curve with tangents). A teacher may supply those figures "if wanted".
- **Format / hash / privacy:** original `.docx`(s); SHA-256 and bytes; private. `FM-INV-T3` verified the 3rd Term original against a standalone copy; the composite archive was not supplied, so its hash was never checked. Supplying it would close that gap.
- **Runnable once supplied:** a new registration/indexing item. Owner confirmation records the open item as settled.

### 4. `FR-ASSET-EXAM-AUDIO-ACQUISITION` — French, 3rd Term Week 1 exam recording
- **State today:** `BLOCKED`. Week 1 names WAEC/NECO cassette/CD practice without identifying a recording. `french.json` has no assets and no `assets/french/` directory.
- **Supply:** the recording's identity (examining body, year, paper, track), the permitted audio file, and a rights record; **or** the owner's approval of `SUP-SS1-FRENCH-DIALOGUE-T3` as the original equivalent.
- **Objective IDs it unblocks:** the open item `FRENCH-EXAM-AUDIO` (`OWNER_ACTION`, blocks delivery), which affects `SS1-SRC-8a2ec1fe30e3` and `SUP-SS1-FRENCH-DIALOGUE-T3`. No coverage entry names the recording, so there is no objective ID to list.
- **Format / hash / privacy:** `audio/mpeg` or `audio/wav`; SHA-256 and bytes of the exact audio; rights per §2.
- **Runnable once supplied:** `FR-ASSET-EXAM-AUDIO-INSTALL`. **Runnable now, with no input:** `FR-FACT-EXAM-AUDIO-REQUIREMENTS` is `PENDING` documentation work that needs no audio.

### 5. `FR-ASSET-EXAM-AUDIO-INSTALL` — French audio asset entry
- **Nothing to supply.** It depends on #4. It needs the #4 audio and rights record to build the asset record in §2. If the owner approves the equivalent in #4, this item closes as not required.

### 6. `ENG-FACT-PRESCRIBED-PASSAGES` — English prescribed-book extracts
- **State today:** `BLOCKED`. Open item `ENGLISH-PRESCRIBED-PASSAGES` says Effective English, Countdown, NOSEC, Intensive English and Progressive English references lack supplied passages or a consistently identified edition.
- **Supply:** exact authorised extracts with edition, **or** the owner's recorded acceptance of the labelled equivalent reading activity.
- **Objective IDs it unblocks:** the open item (`CONTENT`, blocks delivery), which affects `SUP-SS1-ENGLISH-READING-T1`, `-T2` and `-T3`. The ten UNRESOLVED entries in §5 are a subset of the same material.
- **Format / hash / privacy:** *proposal:* extract plus a copy of the edition page; hash recorded; private; rights per §2.
- **Runnable once supplied or accepted:** the queue item completes and the open item is updated. `ENG-LES-READING-T1` to `-T3` are listed as its prerequisites, not as items it unblocks.

### 7. `ENG-FACT-ORAL-AUDIO` — English audio model identity and rights
- **State today:** `BLOCKED`. No authorised audio is in the package.
- **Supply:** a concrete audio file or accessible authorised recording, its permission basis, and the phonetics/stress objectives it supports. The lessons concerned are `SUP-SS1-ENGLISH-PHONETICS-T1`, `-PHONETICS-T3` and `-STRESS-T3`; the coverage entries those lessons serve are `ENGLISH-BODY-009`, `-021`, `-024`, `-037`, `-069`, `-071`, `-073`, `-079`, `-085`, `ENGLISH-T1-W03-MN01` (PARTIAL) and `-MN02`. Which of them the audio actually supports is for the task to record; this memo does not judge it.
- **Note:** oral observation is a separate deferred verification. This item does not install an asset or conduct observation, and `ENGLISH-ORAL-OBSERVATION` (`VERIFICATION`, blocks delivery) stays open.
- **Format / hash / privacy:** `audio/mpeg` or `audio/wav`; SHA-256 and bytes; rights per §2.
- **Runnable once supplied:** `ENG-ASSET-AUDIO-MODEL`.

### 8. `ENG-ASSET-AUDIO-MODEL` — English audio asset entry
- **Nothing to supply.** `english.json` has no assets and `assets/english/` is absent. It depends on #7 and needs a `lesson_id` binding, hash, bytes and alt text.

### 9. `YO-ASSET-T1-W03-VOWEL-CHART` — Yoruba Week 3 vowel chart
- **Nothing external to supply.** This is an authored two-panel SVG rebuilt from the prose at lines 519-545 of the already-registered 1st Term `YORUBA.docx` (`SS1-SRC-48b641249e3b`). No source render is committed.
- **What blocks it:** `YO-FACT-T1-W03-DEFECTS` (`BLOCKED`, needs a named expert decision with evidence on the listed defects and the sub-dot letter notation) and `YO-LES-T1-W03-EDE` (`PENDING`). The owner's input is that expert decision, not a document.
- **Objective ID:** `YO-T1-W03-EDE-07` ("The ATE FAWELI vowel chart", PARTIAL).
- **Ownership:** `yoruba.json` belongs to the curriculum worker; this memo read it only.

### 10. `MATH-LES-T1-W08-LOGARITHMS` and 11. `MATH-LES-T1-W09-LOG-POWERS`
- **State today:** `BLOCKED` on `MATH-OWNER-LOG-METHOD`. Open item `OI-MATH-003` (`FACT`, blocks delivery) says Weeks 8 and 9 teach logarithms with four-figure tables, the tables are not in the supplied archive, and the school has not said whether tables or a calculator are to be used.
- **Decision, either option unblocks both:** (A) tables: name the edition and grant reuse permission; or (B) confirm a calculator-based method.
- **Objective IDs:** `COV-MATH-T1-R07` (Week 8, PARTIAL) and `COV-MATH-T1-R08` (Week 9, PARTIAL).
- **Hash / privacy:** only if option A includes a file: SHA-256 of the exact bytes, private, rights per §2.
- **Runnable once decided:** the two replacement-lesson items. `MATH-FACT-LOG-TABLES` is `PENDING`; the decision item says it is raised only after that one has stated what the source provides.

## 5. The ten English textbook pages

All ten are UNRESOLVED in `english.json` and belong to open items `ENGLISH-T1-W02-EXTERNAL-MATERIALS` and `ENGLISH-T1-W03-EXTERNAL-MATERIALS` (queue items `ENG-FACT-W02-EXTERNAL-MATERIALS` and `ENG-FACT-W03-EXTERNAL-MATERIALS`, both `PENDING`). **No edition, publisher or ISBN is recorded anywhere in the English package**; the entries for `ES05` and `MN04` say so explicitly, and the open item says editions are not consistently identified. The owner supplies the edition together with the pages. The column below gives the title and pages exactly as cited.

| # | Objective ID | Week | Cited as | Role |
|---|---|---|---|---|
| 12 | `ENGLISH-T1-W02-CM01` | 2 | Effective English, Unit 3, pp. 54-55 (the religion passage) | Comprehension passage and reading assignment |
| 13 | `ENGLISH-T1-W02-CM03` | 2 | Effective English, Unit 3, Practice 3, p. 56 | Evaluation |
| 14 | `ENGLISH-T1-W02-LB02` | 2 | Countdown by Evans, Exercise (b), p. 160 | Evaluation |
| 15 | `ENGLISH-T1-W02-LB03` | 2 | Countdown by Evans, p. 159 | Reading assignment |
| 16 | `ENGLISH-T1-W02-LB05` | 2 | Countdown by Evans, pp. 271-272, questions 91-100 | Weekend assignment |
| 17 | `ENGLISH-T1-W03-ES05` | 3 | Count Down in English, pp. 2-5 (essay types) | Reading assignment |
| 18 | `ENGLISH-T1-W03-MN04` | 3 | Standard Speech 10, Book Diction in English Course, p. 11 | Reading assignment |
| 19 | `ENGLISH-T1-W03-EN04` | 3 | Effective English for SS 1, p. 148 | Evaluation (practice) |
| 20 | `ENGLISH-T1-W03-EN05` | 3 | Countdown in English, p. 169 | Reading assignment |
| 21 | `ENGLISH-T1-W03-EN07` | 3 | Countdown, p. 352, Passage A, numbers 1-18 | Weekend assignment |

- **Supply:** the exact pages (with answers for the exercises and questions), with edition, **or** the owner's recorded acceptance of a labelled equivalent activity. Both queue items accept either.
- **Do not assume the titles are one book.** "Countdown by Evans", "Countdown in English", "Countdown" and "Count Down in English" are cited differently in the source. The owner should say which are the same book.
- **Format / hash / privacy / rights:** per §2 and the *proposal* under #6.
- **Runnable once supplied or accepted:** `ENG-FACT-W02-EXTERNAL-MATERIALS` and `ENG-FACT-W03-EXTERNAL-MATERIALS` can complete and update their open items and coverage. Authoring any lesson that teaches a supplied passage would be a new item. UNR-01 binds from lesson bodies alone (per its prompt), so it does not wait on this.
- **Outside the ten, same request:** `ENG-FACT-W01-EXTERNAL-MATERIALS` (`PENDING`) lists Countdown pp. 240-241, Effective English p. 273, the previous term's examination questions with solutions, WASSCE/NECO Lexis and structure past questions, and answers to the nine-word spelling task. If the owner has those, they can go in the same hand-over.

## 6. Not done

No file was downloaded or requested from any source, no content was copied, and no package or queue changed. No item was marked supplied, approved or complete.
