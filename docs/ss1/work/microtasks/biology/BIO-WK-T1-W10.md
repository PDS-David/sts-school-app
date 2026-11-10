# BIO-WK-T1-W10 — Biology, 1st Term, Week 10 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and locator

- Source: `SS1-SRC-422e0e6ddde9`; member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`; SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`; 957,703 bytes. The archive and assigned member hashes were verified in this session.
- Locator rule from `BIO-INV-T1`: direct child of `w:body` in `word/document.xml`, zero-based; block text is concatenated `w:t` runs (UTF-8, no normalisation; text-box text belongs to its containing block); range hash is SHA-256 of block texts joined with newline, including empty blocks.
- Week label block 985, exact text `WEEK TEN`, hash `3ee3bfdc68d8630b1fb02fe862672c802a6d5e762236767928f0d739d3291e10`. Week 10 range blocks 985-1104, hash `9c91bae8cde7ad21425a3c40ab314c04aa4c62c7b2cde3f7da40798633501bea`, matching the queue.
- Scheme entry is block 11: `Week 10 -Growth, Irritability and Movement `; hash `a978ff61f7d1d5d23a8c74052effefeecb2ab9dd65c926c9c29d25af44a0f28f`.

## Scheme objectives and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Growth | Blocks 986-1054 | PARTIAL | Defines growth and its processes, covers mitosis, meristematic growth and growth regulation by plant/animal hormones. |
| Irritability | Blocks 1057-1073 | PARTIAL | Defines irritability/stimulus and describes tactic, nastic and tropic responses. |
| Movement | Blocks 1074-1092 | PARTIAL | Defines movement, lists reasons, defines cyclosis and gives a movement-organelle/mechanism table. |

The source has no lessons in the package; all three scheme coverage records remain PARTIAL until approved lesson content is authored and bound.

| Source content | Exact blocks and range hash | Evidence |
|---|---|---|
| Growth processes and mitosis | 986-1021 (`eab008243f6bdd5b240e62c436c0748e261de30f5e5cb787b17f2b53675e3b05`) | Defines growth, then cell division, cell enlargement and cell differentiation. Defines mitosis and names interphase, prophase, metaphase, anaphase and telophase/cytokinesis. Four mitosis figures are owned by `BIO-VIS-T1-MITOSIS`. |
| Plant growth and hormones | 1026-1037 | Describes meristematic tissue and apical/auxiliary growth, names plant hormones and lists their stated effects. |
| Animal hormones | 1038-1054; table begins at 1042 | Introduces endocrine glands, lists hormones and gives broad functions. The hormone table's layout and factual checking remain with `BIO-VIS-T1-HORMONE-TABLE`. |
| Irritability and responses | 1057-1073 (`bf40ffd4845ee2497b7e95e925bfc2075c24f3ca893577314f9a5e5639674a48`) | Defines irritability and stimulus; distinguishes taxis, nastism and tropism and gives examples. |
| Movement and cyclosis | 1074-1092 (`1be721a64362beb982ed9ba0ae9d2f05467c2aeb30914c6474868e8cfccf7334`) | Defines movement and lists reasons for it; defines cyclosis/cytoplasmic streaming. The table at blocks 1084-1092 lists organisms, movement organelles and mechanisms and is owned by `BIO-VIS-T1-MOVEMENT-TABLE`. |

## Assignment review

The source places the `WEEK TEN` label at block 1094 **before** the `ASSIGNMENT` heading at block 1095. Questions are in blocks 1096-1103 (range `39830b4d86cdc30788eb80170210457d16be57f39de6fb2192f0d19f5d9c2c47`). This order is preserved; the label is not moved.

| Question | Source check | Disposition |
|---|---|---|
| 1. Explain cell division, cell enlargement and cell differentiation | Descriptions are at blocks 989-991. | Supported by the source text. |
| 2. State the locomotory organelles in Amoeba, Paramecium, toad and earthworm | The movement table at blocks 1084-1092 includes all four organisms and their movement structures. | Supported by the source table. |

No answer key, model response or marking guide accompanies the assignment. Assignment coverage remains UNRESOLVED for delivery until a teacher-approved key is available.

## Material census

- The Week 10 range contains 11 drawing elements and 7 VML fallback shapes, 134 tab elements and no Word tables, embedded objects or text boxes.
- The four mitosis figures, hormone table and movement table remain with their existing visual-disposition tasks. No new visual task or asset was needed.
- No experiment or practical section appears in blocks 985-1104.

## Package and queue changes

- `biology.json`: added `COV-BIO-T1-W10-GROWTH`, `COV-BIO-T1-W10-IRRITABILITY` and `COV-BIO-T1-W10-MOVEMENT` (all PARTIAL), plus `COV-BIO-T1-W10-ASSIGNMENT` (UNRESOLVED). Added blocking open items for missing lessons and the assignment key. Existing sources, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T1-W10` IMPLEMENTED_TESTING_DEFERRED; appended `BIO-LES-T1-W10-GROWTH-IRRITABILITY-MOVEMENT`; recomputed counts and `next_runnable`. Totals are 20 IMPLEMENTED_TESTING_DEFERRED, 69 PENDING and 5 BLOCKED.
- No lesson, answer key, correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; Week 10 label, scheme and range hashes; hashes for the growth, irritability, movement and assignment ranges; comparison of assignment prompts with source teaching; structural drawing/table/tab counts; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
