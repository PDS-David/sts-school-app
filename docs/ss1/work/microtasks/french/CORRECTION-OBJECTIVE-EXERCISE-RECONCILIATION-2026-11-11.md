# SS1 French — correction-to-objective-and-exercise reconciliation

**Repository baseline:** `master` at `c25c40cd89420d98a990b5ab41beb79873c5e756`  
**Subject package:** `backend/src/db/ss1/subjects/french.json` (blob `d872c173839daf887f99e9a5012ba7cdfd72847c`)  
**Audit type:** repository-side desk reconciliation; not teacher approval, learner observation, database import or production acceptance.

## Executive result

- 28 correction bindings are present and each maps a registered source body hash to an authored replacement lesson.
- 40 authored lessons/supplements are present (20 1st Term, 9 2nd Term, 11 3rd Term).
- 55 coverage records: 42 marked `IMPLEMENTED_EQUIVALENT`, 11 marked `PARTIAL`, and 2 scheme markers.
- All 40 lesson states remain `content_approval=PENDING` and `verification=DEFERRED`; package status remains `PENDING`.
- This reconciliation confirms traceability and the currently recorded objective statuses. It does **not** convert `IMPLEMENTED_EQUIVALENT` into proof that every individual source exercise has a keyed replacement or that every learner objective has been taught and assessed.

## 28 correction bindings

| # | Source row / correction | Replacement lesson | Coverage result | Linked lesson practice | Desk verdict |
|---:|---|---|---|---:|---|
| 1 | `FRENCH-BODY-001` / `SS1-02-french-COR-001`<br>SS1-SRC-945dfb24eaf6: L’importante de la langue Francaise au Nigeria. | `SUP-SS1-FRENCH-PURPOSE-T1` | PARTIAL, IMPLEMENTED_EQUIVALENT | 14 across 3 linked lessons | PARTIAL — evidence/owner gap remains |
| 2 | `FRENCH-BODY-002` / `SS1-02-french-COR-002`<br>SS1-SRC-945dfb24eaf6: LES PAYS FRANCOPHONE EN AFRIQUE | `SUP-SS1-FRENCH-COUNTRIES-T1` | IMPLEMENTED_EQUIVALENT, PARTIAL | 14 across 3 linked lessons | PARTIAL — evidence/owner gap remains |
| 3 | `FRENCH-BODY-003` / `SS1-02-french-COR-003`<br>SS1-SRC-945dfb24eaf6: L’introduction au cours | `SUP-SS1-FRENCH-GREETINGS-T1` | IMPLEMENTED_EQUIVALENT, PARTIAL | 7 across 3 linked lessons | PARTIAL — evidence/owner gap remains |
| 4 | `FRENCH-BODY-004` / `SS1-02-french-COR-004`<br>SS1-SRC-945dfb24eaf6: GRAMMAIRE ET CONJUGASION | `SUP-SS1-FRENCH-AUXILIARIES-T1` | IMPLEMENTED_EQUIVALENT | 13 across 4 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 5 | `FRENCH-BODY-005` / `SS1-02-french-COR-005`<br>SS1-SRC-945dfb24eaf6: L’oral importance des accents francais tells | `SUP-SS1-FRENCH-ACCENTS-T1` | PARTIAL, IMPLEMENTED_EQUIVALENT | 9 across 2 linked lessons | PARTIAL — evidence/owner gap remains |
| 6 | `FRENCH-BODY-006` / `SS1-02-french-COR-006`<br>SS1-SRC-945dfb24eaf6: Les professions/métiers | `SUP-SS1-FRENCH-PROFESSIONS-T1` | PARTIAL | 6 across 1 linked lessons | PARTIAL — evidence/owner gap remains |
| 7 | `FRENCH-BODY-007` / `SS1-02-french-COR-007`<br>SS1-SRC-945dfb24eaf6: Parler de son environment immediate | `SUP-SS1-FRENCH-ENVIRONMENT-T1` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 8 | `FRENCH-BODY-008` / `SS1-02-french-COR-008`<br>SS1-SRC-945dfb24eaf6: Etre capable de dire ce que l’on fait habituellement. | `SUP-SS1-FRENCH-ROUTINE-T1` | IMPLEMENTED_EQUIVALENT | 9 across 2 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 9 | `FRENCH-BODY-009` / `SS1-02-french-COR-009`<br>SS1-SRC-945dfb24eaf6: Exprimer ses gouts et ses preferences. | `SUP-SS1-FRENCH-PREFERENCES-T1` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 10 | `FRENCH-BODY-010` / `SS1-02-french-COR-010`<br>SS1-SRC-b6245ffb69e5: L’ORAL IMPORTANCE DES ACCENTS FRANÇAIS TELS QUE ACCENT | `SUP-SS1-FRENCH-ACCENTS-T2` | IMPLEMENTED_EQUIVALENT | 3 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 11 | `FRENCH-BODY-011` / `SS1-02-french-COR-011`<br>SS1-SRC-b6245ffb69e5: Revision des alphabets francaise | `SUP-SS1-FRENCH-ALPHABET-T2` | IMPLEMENTED_EQUIVALENT | 4 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 12 | `FRENCH-BODY-012` / `SS1-02-french-COR-012`<br>SS1-SRC-b6245ffb69e5: D’indtifier des consonnes francais | `SUP-SS1-FRENCH-SOUNDS-T2` | IMPLEMENTED_EQUIVALENT | 6 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 13 | `FRENCH-BODY-013` / `SS1-02-french-COR-013`<br>SS1-SRC-b6245ffb69e5: Les voyelles orales composees (compound oral) | `SUP-SS1-FRENCH-SOUNDS-T2` | IMPLEMENTED_EQUIVALENT | 6 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 14 | `FRENCH-BODY-014` / `SS1-02-french-COR-014`<br>SS1-SRC-b6245ffb69e5: Culture et civilisation en Frnace | `SUP-SS1-FRENCH-CULTURE-T2` | IMPLEMENTED_EQUIVALENT | 4 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 15 | `FRENCH-BODY-015` / `SS1-02-french-COR-015`<br>SS1-SRC-b6245ffb69e5: Les moyens de transport | `SUP-SS1-FRENCH-TRANSPORT-T2` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 16 | `FRENCH-BODY-016` / `SS1-02-french-COR-016`<br>SS1-SRC-b6245ffb69e5: Le voyage par avion | `SUP-SS1-FRENCH-FLIGHT-T2` | IMPLEMENTED_EQUIVALENT | 3 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 17 | `FRENCH-BODY-017` / `SS1-02-french-COR-017`<br>SS1-SRC-b6245ffb69e5: LA GRAMMAIRE | `SUP-SS1-FRENCH-IMPARFAIT-T2` | IMPLEMENTED_EQUIVALENT | 6 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 18 | `FRENCH-BODY-018` / `SS1-02-french-COR-018`<br>SS1-SRC-b6245ffb69e5: Grammaire le passe compose passe compose avec avoir | `SUP-SS1-FRENCH-PASSE-T2` | IMPLEMENTED_EQUIVALENT | 6 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 19 | `FRENCH-BODY-019` / `SS1-02-french-COR-019`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: LES PRACTIQUES DE LA LECTURE LE DIALOQUE | `SUP-SS1-FRENCH-DIALOGUE-T3` | PARTIAL | 3 across 1 linked lessons | PARTIAL — evidence/owner gap remains |
| 20 | `FRENCH-BODY-020` / `SS1-02-french-COR-020`<br>SS1-SRC-8a2ec1fe30e3: TOPIC:  COMP ARER LE MONDE D’HIER ET D’AUJOURD’HUI? | `SUP-SS1-FRENCH-CHANGE-T3` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 21 | `FRENCH-BODY-021` / `SS1-02-french-COR-021`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: EXPRIMER SATISFACTION | `SUP-SS1-FRENCH-REACTIONS-T3` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 22 | `FRENCH-BODY-022` / `SS1-02-french-COR-022`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: EXPRIMER SES SENTIMENTS POSITIVES ET NEGATIVES: | `SUP-SS1-FRENCH-REACTIONS-T3` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 23 | `FRENCH-BODY-023` / `SS1-02-french-COR-023`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: EXPRIMER SES GOUTS. | `SUP-SS1-FRENCH-PREFERENCES-T3` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 24 | `FRENCH-BODY-024` / `SS1-02-french-COR-024`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: EXPRIMER SON OPINION/ TON AVENIR. | `SUP-SS1-FRENCH-OPINION-T3` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 25 | `FRENCH-BODY-025` / `SS1-02-french-COR-025`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: EXPRIMER EN BON FRANCAIS | `SUP-SS1-FRENCH-ILLNESS-T3` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 26 | `FRENCH-BODY-026` / `SS1-02-french-COR-026`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: LA GRAMMAIRE | `SUP-SS1-FRENCH-GRAMMAR-T3` | IMPLEMENTED_EQUIVALENT | 3 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 27 | `FRENCH-BODY-027` / `SS1-02-french-COR-027`<br>SS1-SRC-8a2ec1fe30e3: TOPIC: LA GRAMMAIRE | `SUP-SS1-FRENCH-REPORTED-T3` | IMPLEMENTED_EQUIVALENT | 3 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |
| 28 | `FRENCH-BODY-028` / `SS1-02-french-COR-028`<br>SS1-SRC-8a2ec1fe30e3: TOPIC : LA GRAMMAIRE / VOCABULAIRE | `SUP-SS1-FRENCH-VOCABULARY-T3` | IMPLEMENTED_EQUIVALENT | 5 across 1 linked lessons | Mapped — verify exercise-by-exercise; not approved |

## Residual objective and delivery gaps

### FRENCH-UNCLEAR-OCCUPATIONS

The original profession table was inspected in full (rendered source pages 10-12 and the underlying DOCX table). Row 12 is printed as 'Un computateur / Une computateur'; row 26 as 'Un couteur / Une couteure'. No heading, neighbouring row or example identifies the intended occupations. The replacement teaches 44 clear entries and adds informaticien/informaticienne as a clearly labelled modern computing profession, but does not claim that it is the source meaning. 'Couteur' is not silently changed to couturier.

**Required closure:** Owner/teacher must provide the intended occupation for 'couteur' and confirm whether 'computateur' should be replaced by informaticien/informaticienne or omitted as an obsolete/unclear source term. Until then FRENCH-BODY-006 stays PARTIAL.

### FRENCH-EXAM-AUDIO

The source Week 1 says 'Reference a une cassette' and 'Reference a une C.D selon WAEC ET NECO' but names no exam year, session, paper, track, publisher, title or rights holder. The student app now bundles two original synthetic MP3 recordings (standard and slow) and plays them offline through Expo Audio. Device French text-to-speech remains as a line-by-line fallback. The spoken dialogue is an original curriculum equivalent, not a WAEC/NECO recording.

**Required closure:** The app now provides two bundled original MP3 recordings for the dialogue, with an offline Expo Audio player. Owner/teacher must still approve this as the classroom equivalent and explicitly accept omission of the unidentified official recording, or supply the exact exam-board recording identity and a permitted audio file/licence (exam board, year/session, paper/track, language and rights). Do not label synthetic speech as official WAEC/NECO audio.

### FRENCH-AUTHORING-FINISH

The source-objective matrix now maps all 28 parsed source rows and the revision/examination scheme markers; all inspected T1/T2 visual objects have explicit text-equivalent dispositions; the original sources compile against all 40 authored supplements; the French package suite passes 10/10 tests. A replacement-side objective/practice inventory has now been added for all 40 lessons. It maps the authored objectives to their lesson practice items, and the alphabet and irregular future-tense gaps found in that scan have been corrected. The original-source exercise-by-exercise equivalence audit remains open because the three original DOCX source files are not present in the repository; the repository records their private archive member names and hashes but does not contain the source bodies or original exercise text. The specific source/owner gaps are listed separately.

**Required closure:** Complete FR-FACT-REPLACEMENT-SCOPE by auditing each of the 28 corrections against the exact parsed source body, all objectives/exercises, the replacement lesson(s), and any required supplemental lesson. Record a per-correction verdict and keep only evidenced residual gaps as PARTIAL/open items. Then close the umbrella; do not approve content or claim runtime delivery as part of this authoring step.

### FRENCH-T1-W01-FACT-CLAIMS

Dated primary evidence now documents French in the 2014 primary/JSS curriculum and as a Senior Secondary Humanities offering; FME's 2019 Service Charter describes the second-official-language directive and teacher retraining; the NFLV's 2016 brochure records the Badagry centre's 1991–1992 establishment and says French was declared second official language in 1997. Limits: no primary source establishes 'most important foreign language after English'; no original declaration/speech or gazetted instrument was located; the 2014 NPE contains no 'second official language' wording; the claim that French was not imposed and the full economic/commercial/political/cultural motive remain unverified. Do not teach those unsupported parts as facts.

**Required closure:** Keep OBJ-1/2/3 at PARTIAL until the unresolved superlative, current legal-status and adoption-motive claims are supported by an authenticated primary source or explicitly excluded by the teacher. Do not author a lesson presenting the unresolved claims as established fact.

### FRENCH-T1-W02-HEADINGS-INTENT

Week 2 ends with two bare headings, 'Chefs d'etats/presidents' (child 75) and 'Mornaies.' (child 76), with no content. The replacement addresses the first at concept level (dated head of state for Nigeria only) and the second through its currency reference. The intended scope of both is not stated in the source.

**Required closure:** Owner or teacher confirms what each heading was meant to teach (for example which countries' leaders). Do not invent leaders or content; leaders change, so any list needs dated official records (queue item FR-FACT-T1-W02-HEADS-OF-STATE).

### FRENCH-T1-W03-GREETING-SCOPE

Clear expressions now taught in SUP-SS1-FRENCH-COURTESY-CELEBRATIONS-T1. Intended meaning remains unconfirmed for children 92 Bonsoir nuit; 96 Bonjour nee; 114 Bon paque; 126 Bonjour maman, comment?; 128 Vous avez bien. Owner selected supply intended meanings on 2026-11-07 but has not yet provided them. Routine spelling/usage corrections for classmates, marriage and birth are taught as original conventional formulas, not additional owner decisions.

**Required closure:** Owner: supply intended meanings or explicitly approve replacement/omission for each listed row. Then update exact coverage; do not infer Easter versus Passover or repair incomplete wording by guesswork.

## Consistency findings requiring correction

1. Historical Week 1–4 indexing notes were not synchronized with the current package. For example, `FR-WK-T1-W01.md` still describes OBJ-4/OBJ-5 as unresolved and refers to supplements that have since been authored; the current package marks the neighbour and benefits objectives `IMPLEMENTED_EQUIVALENT`. `FR-WK-T1-W02.md` still says both DEVOIR exercises lack counterparts, while current coverage links the Anglophone supplement and demonym supplement. `FR-WK-T1-W03.md` predates the completed eight-field self-presentation supplement and still reports that objective as partial. `FR-WK-T1-W04.md` still lists three authoring tasks as outstanding even though the corresponding être, avoir and four-stem composition supplements now exist. These historical task notes must be refreshed or explicitly marked superseded before they are used as current audit evidence.
2. **Resolved in this reconciliation branch:** correction `SS1-02-french-COR-005` and the Week 5 indexing note are being aligned with `VISUAL_DISPOSITION.md`: the inspected punctuation drawing is represented by accessible text and needs no separate image asset. This does not close the separate learner oral-performance/approval gate.
3. The `QUEUE.json` header says its snapshot was generated from `dd739bba...` and its introductory notes describe an older package state (27 lessons, 29 coverage records, 3 open items), whereas current `master` contains 40 lessons, 55 coverage records and 8 open items. The queue must be regenerated/reconciled against current master before it is used to schedule remaining work.

## What is actually closed by this reconciliation

- Source-row identities and 28 correction bindings are traceable.
- Current objective coverage statuses and replacement lesson references are indexed.
- The linked practice counts can be computed from the currently authored lessons.
- The ten `PARTIAL` coverage records and seven delivery-blocking open items remain visible; none is silently upgraded.

## What remains before authoring can be called complete

- Refresh the stale Week 1–3 work records and the queue snapshot.
- Resolve the punctuation drawing contradiction with a direct source-object inspection record.
- Audit each of the 28 original source bodies against every objective, source exercise, replacement lesson and answer/marking scheme. Where the source has an exercise, cite the exact question and show the replacement exercise and keyed answer; where it has none, state that new practice is authored rather than equivalent.
- Close or explicitly teacher-approve each blocking source ambiguity in `french.json`.
- Keep content approval, oral learner verification, database delivery, app runtime and production build as separate acceptance gates.

**No lesson approval, learner observation, official exam recording, database write or production release is claimed by this report.**


## Follow-up correction in this branch

The Week 5 punctuation-drawing contradiction is corrected in `french.json` and `FR-WK-T1-W05.md`: the visual equivalent is recorded as implemented, while learner oral performance remains unobserved. The Week 1–3 indexing notes now include current-state supersession notes, and `QUEUE.json` carries an explicit stale-snapshot warning. These documentation corrections do not alter lesson approval or verification states.


### Additional scope correction — Week 2 Anglophone objective

The current package's `FRENCH-T1-W02-OBJ-2` status is corrected to `PARTIAL`. Its previous `IMPLEMENTED_EQUIVALENT` label contradicted the evidence that the Anglophone supplement covers only Namibia, Kenya and South Africa and does not verify the other twelve countries or reproduce the exhaustive source exercise. New blocking open item `FRENCH-T1-W02-ANGLOPHONE-SCOPE` requires either authoritative evidence for all 15 classifications and a complete keyed exercise, or explicit teacher approval to narrow/replace the source objective. Correction `SS1-02-french-COR-002` now records this limitation.


### Research evidence for the Week 2 Anglophone scope gap

ANGLOPHONE_COUNTRY_SCOPE_RESEARCH.md now records all 15 source countries and the evidence located so far. It distinguishes legal official language from working language and broader English use, documents constitutional counterexamples (Egypt: Arabic; Angola: Portuguese; Libya: Arabic; Ethiopia: Amharic as federal working language), and flags current-text checks for Sudan and Somalia. This research does not yet complete the 15-country exercise or replace the required teacher/owner decision.


## Structural assessment-item audit

A static scan of the current branch's French package (blob 6ececab52165434558f4dd09445cd43bb0d16f91) found:

- 40 lessons, each with a non-empty lesson body, objectives, practice items and provenance.
- 189 practice questions, carrying 549 marks in total.
- Every question has a non-empty stem, keyed answer and marking rubric.
- Every rubric's item marks sum to the question's declared marks.
- No structural omissions or mark-sum mismatches were found by this scan.

This is a structural integrity result only. It does not prove that each question assesses the correct source objective, that every original source exercise has a replacement, that a teacher has approved the language/content, or that learners can perform the required oral tasks. The 28-row source exercise reconciliation and teacher review remain open.


### Closure of a non-blocking caution

The non-blocking item FRENCH-T1-W01-NEIGHBOURS-LANGUAGE-STATUS was removed from package open_items because the current neighbour lesson explicitly makes no current legal-language-status claim; it distinguishes French-speaking populations from legal official status. For future current-affairs use, Article 12 of Niger's 2025 Charter of Refoundation identifies Hausa as the national language and English/French as working languages. The official Niger Presidency page publishes the Charter and the Journal officiel copy is linked in QUEUE.json. This does not change the Week 1 learning objective or approval state.


## Replacement-side objective/practice audit — 11 November 2026

A new `OBJECTIVE-PRACTICE-ALIGNMENT-2026-11-11.md` inventory maps each of the 40 authored lessons' objectives to the questions in that lesson. It is an audit of the replacement curriculum only; it does not claim that the original source exercises have been individually reproduced. The audit found and fixed two concrete under-assessed areas: the complete 26-letter alphabet sequence (Alphabet Q4) and six irregular simple-future forms (Future Q4). It also corrected the oral-accent coverage status to PARTIAL: a teacher-led checklist exists, but no learner oral performance has yet been observed.

The package now contains 40 lessons, 191 practice questions and 557 practice marks. Coverage status: 42 IMPLEMENTED_EQUIVALENT, 11 PARTIAL, 2 scheme markers. All 40 lessons remain content approval PENDING and learner verification DEFERRED.
