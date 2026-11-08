# BIO-WK-T2-W06 — Biology, 2nd Term, Week 6 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and evaluation/assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and conversion

- Source: `SS1-SRC-eb6e9665f42c`; archive member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`; SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`. The assigned member digest was verified against the composite archive and assignment manifest.
- The legacy DOC was converted to a private DOCX copy using LibreOffice 25.2.3.2. The inventory records LibreOffice 24.2.7.2; the Week 6 label and range hashes reproduced the inventory/queue values exactly. No original or converted file was committed.
- The converted `word/document.xml` has 963 direct `w:body` children: blocks 0-961 plus section properties at 962. Block = direct child of `w:body`, zero-based; block text = concatenated `w:t` runs (UTF-8, no normalisation); range hash = SHA-256 of block texts first..last inclusive joined with newline.
- Week 6 label block 481, hash `f0edcbda6aafa4c18d5105756f809a9eb17f927397ee0853793fd82c04d4acc0`. Body blocks 481-572 have the queue's exact range hash `0bff8954b7b9936d96f11ffdab0bf739acba8ce6e074f4dfd9236fb2220b7d45`.
- Scheme row 12 at preamble block 12 is `Basic Ecological Concepts`, hash `a7f2e2b0f519195afdeabfdfaa6b8b68ae43f03a60b4fb9a7d9909a536e0eab7`. Scheme row 13 at block 13 is `Biomes`, hash `923b13b59420a08eb268290b93a1c70d296a8b817ce8947adb6a49f366ef5ace`.

## Scheme objective and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Week 6 — Basic Ecological Concepts | Scheme row block 12; label block 481; teaching blocks 489-548 | PARTIAL | Defines ecology and branches, ecological terms, biosphere/ecosphere portions and ecosystem components. The package has no lessons, so source-only teaching is not yet deliverable. |

| Source content | Exact blocks and range hash | Evidence |
|---|---|---|
| Ecology and branches | 489-498 (`6c24b7e04a9d965893503b0b3f2ceb21bbf435552bd4984e9e32c915ff9c8caf`) | Defines ecology, its practical study aims, autecology and synecology. |
| Ecological terms and ecosphere portions | 504-528 (`3ec5d455f47d79afcbc184220cb2bab1cf6f52542b777572860e6ac4082be40b`) | Defines environment, biosphere/ecosphere, lithosphere, hydrosphere, atmosphere, habitat and its subdivisions, ecological niche, population, community, ecosystem and biome. |
| Ecosystem components | 534-548 (`4215a767fc6eb343bb1f0d41a8b2640a42265404db8785905f46ee79059a785f`) | Describes abiotic components and biotic components, including producers, consumers and decomposers. |

## Cross-week Biomes mapping

The Week 6 content list includes `Biome` at block 486 and the body gives a brief definition at block 527. The scheme assigns `Biomes` to Week 7 (preamble block 13). Week 6 therefore records an introductory mention only; the full topic is not duplicated here. `BIO-SCOPE-T2-W06-BIOMES` will compare the Week 7 body before deciding whether any scope correction is needed.

## Evaluation, assignment and theory review

| Source item | Locator | Source support and disposition |
|---|---|---|
| Evaluation: define ecology and differentiate its branches | blocks 500-502 (`9b64dae6bc5bbbd8441a778b4c262fba00eaf356639a8979daeffbb24653174a`) | Supported by blocks 489-498. |
| Evaluation: define community, population, ecosystem and differentiate biosphere/ecosystem | blocks 530-532 (`bd6f68511d96d74deb8827028fe626804d80cc67191718e9623141191b24feb7`) | Supported by the definitions at blocks 504-528. |
| General evaluation: ecosphere, habitat/niche, habitat subdivisions, population/community, ecosystem/biome and abiotic/biotic factors | blocks 549-556 (`3a8c9fef389100784f055178db8c4c143ec82326424c0dd72bb20715dd7bd1cc`) | Related terms and component descriptions are present. The biome question relies on the brief Week 6 definition and the Week 7 scheme placement noted above. |
| Reading assignment | blocks 558-559 | College Biology, chapter 23, pages 496-499. The cited book itself is not part of this source archive. |
| Weekend assignment | blocks 561-566 (`5aeeec8352afa1d5827ff98807d644a65af36a1d45b85df7db58e56d919025eb`) | Questions on terrestrial habitat, biotic factors, population, ecosystem and atmospheric composition are related to blocks 506-513 and 514-547. |
| Theory: definitions and the three ecosphere portions | blocks 568-570 (`b7f94ef835b588714273e2e364dcdc0bb202a22150be7fd93f2ffa1dcb07a04c`) | Definitions and the lithosphere/hydrosphere/atmosphere descriptions are present in blocks 508-526. |

No answer key or marking guide accompanies the evaluation, weekend assignment or theory items.

## Source figures requiring later fact review

The biosphere/ecosphere section at blocks 511-513 gives surface-coverage proportions and atmospheric gas percentages. These are recorded as source statements, not as current verified figures. `BIO-FACT-T2-W06-ENVIRONMENT-FACTS` was appended to verify them against authoritative current environmental/science references before a current lesson is authored.

## Bounded follow-up tasks

- `BIO-FACT-T2-W06-ENVIRONMENT-FACTS`: verify the surface-coverage and atmospheric-composition figures at blocks 511-513 and cite current authoritative sources.
- `BIO-SCOPE-T2-W06-BIOMES`: compare the brief Week 6 Biomes mention with the Week 7 scheme/body before deciding whether to treat it as an introduction or scope misplacement.
- `BIO-LES-T2-W06-ECOLOGY`: author an approved supplemental lesson for ecology, ecological terms, ecosphere portions and abiotic/biotic components using verified environmental figures.

## Material census

- Blocks 481-572 contain no drawing, VML fallback, Word table, embedded object or text box; 14 tab elements occur in the range.
- No experiment or practical section appears in Week 6.
- No source extract or converted DOCX was committed.

## Package and queue changes

- `biology.json`: added `COV-BIO-T2-W06-ECOLOGY` and `COV-BIO-T2-W06-ECOSYSTEM-COMPONENTS` (PARTIAL), plus `COV-BIO-T2-W06-ASSESSMENT` (UNRESOLVED). Added open items for missing lessons, Biomes scope, environment figures and the assignment key. Existing source registrations, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T2-W06` IMPLEMENTED_TESTING_DEFERRED; appended a factual-dependency task, a cross-week scope task and a bounded lesson task; recomputed counts and `next_runnable`. Totals are 26 IMPLEMENTED_TESTING_DEFERRED, 79 PENDING and 6 BLOCKED.
- No answer key, source correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; private DOC conversion; body-child count; Week 6 label, scheme and range hashes; hashes for ecological terms, ecosystem components, evaluation, reading, weekend assignment and theory ranges; cross-week Biomes marker comparison; structural drawing/table/tab counts; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
