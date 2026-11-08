# BIO-WK-T2-W02 — Biology, 2nd Term, Week 2 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and evaluation/assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and conversion

- Source: `SS1-SRC-eb6e9665f42c`; archive member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`; SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`. The assigned member digest was verified against the composite archive and assignment manifest.
- The legacy DOC was converted to a private DOCX copy using LibreOffice 25.2.3.2. The inventory records LibreOffice 24.2.7.2; the Week 2 label and range hashes reproduced the inventory/queue values exactly. No original or converted file was committed.
- The converted `word/document.xml` has 963 direct `w:body` children: blocks 0-961 plus section properties at 962. Block = direct child of `w:body`, zero-based; block text = concatenated `w:t` runs (UTF-8, no normalisation); range hash = SHA-256 of block texts first..last inclusive joined with newline.
- Week 2 label block 92, hash `fdeecaa4bc5e4727501357833e68fa6e6193db9c231ff17723dde4b3f5756a38`. Body blocks 92-159 have the queue's exact range hash `10e481daa51fd5e6585f55855601248966ec640b9e7a832e20ff0979de7f98c6`.
- Scheme row 8 at preamble block 8 is `Sexual Reproduction (Conjugation, Meiosis) and Excretory Organelles in Living Cells`, hash `fa8257ee8564e29a540ff34a3d7dd83188da93b9a753ce51a9799df9843c8ea0`.

## Scheme objectives and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Sexual reproduction — conjugation and fusion of gametes | Blocks 100-103 (range `b8a550d1c4d8bfc8f074b52119fca1194b4665e1af591986ce75d916daadd8d4`) | PARTIAL | Introduces conjugation and fusion of gametes and gives a general account of gamete formation/fertilization. The package has no lesson. |
| Meiosis | Blocks 109-129 (range `aced3521a461e545c8f8585eb5e89d978ad176f488be9278a315ff0b7a8f68bb`) | PARTIAL | Defines meiosis, describes two successive divisions and their stages, mentions crossing over, and lists reproductive products. The package has no lesson. |
| Excretory organelles in living cells | Content-list block 99 only (hash `2d17c0444a8bb80aa0d2c11b40c4f727bb5a2ed8834bd327a6338a71c15cbfd5`) | UNRESOLVED | The scheme row names this objective and the content list contains “Excretion”, but no excretion or excretory-organelle teaching body appears in Week 2 blocks 92-159. |

## Evaluation and revision review

| Source item | Locator | Source support and disposition |
|---|---|---|
| Evaluation: conjugation in Spirogyra; define spermatogenesis and oogenesis | blocks 105-107 | Conjugation in Spirogyra is covered by block 102. The source mentions gametogenesis at 103 but does not define spermatogenesis or oogenesis. |
| Evaluation: crossing over; four life processes involving meiosis | blocks 131-133 | Crossing over is described at 116. The source lists reproductive products at 124-129; it does not clearly explain four life processes involving meiosis. |
| General evaluation: conjugation in Mucor; sites of meiosis; sexual reproduction in Hydra; define meiosis; importance of meiosis; excretory products | blocks 135-141 | Meiosis is defined and its stages are described. The source does not teach conjugation in Mucor, sexual reproduction in Hydra, named sites/structures where meiosis occurs, or five excretory products in this week. |
| Reading assignment | blocks 143-144 | College Biology, chapter 16, pages 301-305. The cited book itself is not part of this source archive. |
| Weekend assignment | blocks 146-151 | Chromosome-number continuity and the timing of meiosis relative to fertilization are supported by blocks 103 and 110. The centrosome/spindle-origin question is not taught. The excretory-structure question is not supported by Week 2 teaching. The body-cell/gamete comparison is only partly supported by the haploid/diploid and reduction-division descriptions. |
| Theory: five differences between mitosis and meiosis; sexual and asexual reproduction; phases of meiosis | blocks 153-157 | Some contrasts are stated at block 110; phases are described at 115-122. The sexual/asexual comparison is supported by Week 1 blocks 43-44. The source does not set out a complete five-point comparison. |

No answer key or marking guide accompanies the evaluation, revision, weekend assignment or theory items. The assessment coverage remains UNRESOLVED.

## Missing teaching and bounded follow-up tasks

- `BIO-LES-T2-W02-SEXUAL-REPRODUCTION-MEIOSIS`: produce an approved supplemental lesson for sexual reproduction, conjugation, gametogenesis (including definitions requested at block 107), meiosis and its stages/importance.
- `BIO-LES-T2-W02-EXCRETION`: supply the missing scheme objective on excretion, excretory products and excretory structures/organelles using approved Biology references. The source's single content-list word is not treated as teaching.
- `BIO-FACT-T2-W02-REVISION-FACTS`: verify the unsupported revision prompts (including organism-specific conjugation/reproduction, sites of meiosis, spindle origin and excretory products/structures) against approved Biology references before answers or corrections are authored.

## Material census

- The Week 2 range contains no drawing, VML fallback, Word table, embedded object or text box; three tab elements occur in the range.
- No experiment or practical section appears in blocks 92-159.
- No source extract or converted DOCX was committed.

## Package and queue changes

- `biology.json`: added `COV-BIO-T2-W02-SEXUAL-REPRODUCTION` (PARTIAL), `COV-BIO-T2-W02-MEIOSIS` (PARTIAL), `COV-BIO-T2-W02-EXCRETION` (UNRESOLVED) and `COV-BIO-T2-W02-ASSESSMENT` (UNRESOLVED), plus blocking open items for missing lessons, excretion, gametogenesis, factual review and the answer key. Existing source registrations, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T2-W02` IMPLEMENTED_TESTING_DEFERRED; appended two bounded lesson tasks and one factual-dependency task; recomputed counts and `next_runnable`. Totals are 22 IMPLEMENTED_TESTING_DEFERRED, 73 PENDING and 5 BLOCKED.
- No answer key, source correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; private DOC conversion; body-child count; Week 2 label and range hashes; hashes for sexual reproduction, meiosis, evaluation, revision, reading assignment, weekend assignment and theory ranges; search for the excretion heading and any excretion teaching in Week 2; structural drawing/table/tab counts; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
