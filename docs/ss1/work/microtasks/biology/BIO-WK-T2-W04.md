# BIO-WK-T2-W04 — Biology, 2nd Term, Week 4 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and evaluation/assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and conversion

- Source: `SS1-SRC-eb6e9665f42c`; archive member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`; SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`. The assigned member digest was verified against the composite archive and assignment manifest.
- The legacy DOC was converted to a private DOCX copy using LibreOffice 25.2.3.2. The inventory records LibreOffice 24.2.7.2; the Week 4 label and range hashes reproduced the inventory/queue values exactly. No original or converted file was committed.
- The converted `word/document.xml` has 963 direct `w:body` children: blocks 0-961 plus section properties at 962. Block = direct child of `w:body`, zero-based; block text = concatenated `w:t` runs (UTF-8, no normalisation); range hash = SHA-256 of block texts first..last inclusive joined with newline.
- Week 4 label block 262, hash `51a39a7c2f829455c7b65f114ff747cb9660bf21e1579af6d295ae1c57d1cf32`. Body blocks 262-325 have the queue's exact range hash `60f45646c3a041996260c764fe46dd96cb39e48fc54da27bd1f517cdc221fcb5`.
- Topic block 263: `IRRITABILITY / CELL REACTIONS TO ITS ENVIRONMENT`.

## Scheme objectives and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Irritability and types of responses | Blocks 268-284 (range `68564403b3e8922290803d2b4b6c69f9329d776618b412dcc1eb89c2997bde57`) | PARTIAL | Defines irritability, stimulus and response; describes tactic/taxis, nastic and tropic responses with examples. |
| Movement and cyclosis | Blocks 286-297 (range `a4427d8d2aa1f0ebdbf927f7080690819b724f9e5f151168634891c109eec8e0`) | PARTIAL | Lists reasons for movement and describes cyclosis/cytoplasmic streaming. |
| Organelles for movement | Blocks 298-301 (range `1e502a1beee33f5f98bafce17e17017fc9ffa74bb58292c82b41e3e143aec0ca`) | PARTIAL | Describes flagella and cilia. Amoeboid movement is named at 291, but the structure used by Amoeba is not identified in the organelles section. |

The Biology package has no lessons; all three objective records remain PARTIAL until approved lesson content is authored and bound.

## Evaluation, assignment and theory review

| Source item | Locator | Source support and disposition |
|---|---|---|
| Evaluation: examples of nastic, tropic and tactic movement; environmental factors | blocks 282-284 | The three response types and examples are described at 270-279. |
| Evaluation: define cyclosis and give examples | blocks 294-296 | Supported by blocks 289-292. |
| General evaluation: movement structures in Paramecium, Amoeba and Euglena; Amoeba movement; cyclosis; nastic examples; tropism and growth; tactic/nastic differences | blocks 302-308 | Mostly supported by blocks 268-300. The source names amoeboid movement but does not identify the structure used by Amoeba. |
| General evaluation: describe an experiment to demonstrate geotropism | block 309 | Gravity-related tropic responses are described at 278-279, but the source provides no experiment description or keyed observation. |
| Reading assignment | blocks 311-312 | College Biology, Chapter 12, pages 236-243. The cited book itself is not part of this source archive. |
| Weekend assignment | blocks 314-319 (range `ae4368eca9b6c70a7582b5c29e313c84b19d0955298cf3d2453a599dfbc523c4`) | Questions on gravitropism, cyclosis, taxis and nastic movement are supported by the teaching sections. The klinostat item at block 319 introduces an instrument not described in the body. |
| Theory: differences between tropic and nastic movement; horizontal seedling observation | blocks 321-323 (range `6545e6404812f8753396e8f6280695afe58a64151da0dabd97d423e150345042`) | The comparison is supported by blocks 274-279. The horizontal-seedling question relates to the gravity-response description, but no keyed expected observation is supplied. |

No answer key or marking guide accompanies the evaluation, weekend assignment or theory questions. Assignment coverage remains UNRESOLVED.

## Bounded follow-up tasks

- `BIO-FACT-T2-W04-KLINOSTAT`: verify the intended use of the klinostat named at block 319 against an approved Biology reference.
- `BIO-LES-T2-W04-IRRITABILITY-MOVEMENT`: author a clearly labelled supplemental lesson covering response types, movement, cyclosis, the missing Amoeba movement structure, and a teacher-approved conceptual explanation for the geotropism questions. Include the verified klinostat explanation and keyed practice.

## Material census

- Blocks 262-325 contain no drawing, VML fallback, Word table, embedded object or text box; 32 tab elements occur in the range.
- The source asks learners to describe a geotropism experiment, but provides no practical method in this week. No practical procedure or safety instructions were added to this index.
- No source extract or converted DOCX was committed.

## Package and queue changes

- `biology.json`: added `COV-BIO-T2-W04-IRRITABILITY`, `COV-BIO-T2-W04-MOVEMENT` and `COV-BIO-T2-W04-ORGANELLES` (PARTIAL), plus `COV-BIO-T2-W04-ASSESSMENT` (UNRESOLVED). Added blocking open items for missing lessons, the klinostat, the geotropism question and the assignment key. Existing source registrations, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T2-W04` IMPLEMENTED_TESTING_DEFERRED; appended a factual-dependency task and a bounded lesson task; recomputed counts and `next_runnable`. Totals are 24 IMPLEMENTED_TESTING_DEFERRED, 76 PENDING and 5 BLOCKED.
- No answer key, source correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; private DOC conversion; body-child count; Week 4 label and range hashes; hashes for irritability, movement, organelles, evaluation, reading, weekend assignment and theory ranges; question-by-question source comparison; structural drawing/table/tab counts; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
