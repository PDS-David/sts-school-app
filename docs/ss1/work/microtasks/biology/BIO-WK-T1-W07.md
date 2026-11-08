# BIO-WK-T1-W07 — Biology, 1st Term, Week 7 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and locator

- Source: `SS1-SRC-422e0e6ddde9`; member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`; SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`; 957,703 bytes. The archive and assigned member hashes were verified in this session.
- Locator rule from `BIO-INV-T1`: direct child of `w:body` in `word/document.xml`, zero-based; block text is concatenated `w:t` runs (UTF-8, no normalisation; text-box text belongs to its containing block); range hash is SHA-256 of block texts joined with newline, including empty blocks.
- Week label block 835, exact text `WEEK 7`, hash `5d222602d23f6b6f007aa6721de2a971a44013ddf864d5b98d8b6d25dcaeace1`. Week 7 range blocks 835-925, hash `d447b3593efc132f6eed1264640b15969a8a5712d3111a4e0470d6c8adb553a6`, matching the queue.
- Scheme entry is block 8: `Week 7 -Nutrition in Animals`; hash `d0bd685e636204acea325dde295cd9b42df7e4b91ac23cfb319c33fc2b0c109d`.

## Scheme objective and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Week 7 — Nutrition in Animals | Scheme block 8; label block 835; body blocks 836-920 | PARTIAL | The source covers food substances, balanced diet and digestive enzymes. The package has no lessons, so source-only teaching is not yet deliverable. |

| Source content | Exact blocks | Evidence |
|---|---|---|
| Food substances and balanced diet | 836-902 (range `bc8819630019a8f76af63df674753745f6712a09ea487ef7e2433bd6be524fc1`) | Introduces food substances and describes carbohydrate, protein, fats/oils, mineral salts, vitamins, water and roughage, their stated roles and sources, and balanced diet. The mineral and vitamin tables at blocks 881 and 888 are assigned to `BIO-VIS-T1-TBL-MINERALS-VITAMINS`; this index does not reconstruct their row/column pairing or independently verify their health claims. |
| Digestive enzymes | 903-920 (range `4165132912c236e1d99513b354b101ed76152674328de29c423c320169f7b588`) | Defines digestive enzymes, lists characteristics, describes proteases, amylase and lipases, and includes a digestive-enzyme table. The enzyme table at block 920 is assigned to `BIO-VIS-T1-TBL-ENZYMES`. |
| Protein breakdown diagram | block 859 | The source shows a protein-to-amino-acid breakdown sequence. Its diagram/arrow disposition is owned by `BIO-VIS-T1-PROTEIN-BREAKDOWN`; this task does not redraw or reinterpret it. |

## Assignment review

The source labels block 921 `ASSIGNMENT` and block 922 `WEEK SEVEN`. Questions are in blocks 923-924 (range `bf5db9fa7dcd0cf4453dce77dd29c1e868ea6c90e8981dbd415420a181598d1b`).

| Question | Source check | Disposition |
|---|---|---|
| 1a. Define enzyme | Definition at block 903. | Supported by the source text. |
| 1b. State five characteristics of enzymes | Characteristics are listed at blocks 904-913. | Supported by the source text. |

No answer key, model response or marking guide accompanies the assignment. The assignment coverage remains UNRESOLVED for delivery until a teacher-approved key is available.

## Source claims retained for review

This is an index, not a correction pass. The original text remains unchanged. The following exact locations need authoritative review before any corrected supplement is authored:

- Block 838 groups “water and roughages” in the final food-substance entry while later balanced-diet text lists water among the six groups.
- Block 841's monosaccharide formula.
- Block 844's statement describing how sucrose is formed.
- Block 871's printed formula for tristearin.
- Blocks 916-917's statements about amylase and the breakdown of starch and sugars.
- The source tables at 881, 888 and 920 contain additional nutrition and enzyme claims; their visual/table reconstruction and fact review remain with their respective existing tasks.

These points are recorded in `BIOLOGY-T1-W07-FOOD-CLAIMS` and `BIO-FACT-T1-W07-FOOD-CLAIMS`. No external correction is substituted for the source.

## Practical and visual census

- No experiment or practical section is present in blocks 835-925.
- The range contains three native drawing elements with VML fallbacks, three Word tables and 42 tab elements. The protein-breakdown diagram and the mineral, vitamin and enzyme tables have existing visual-disposition tasks; no new asset or visual task was needed.
- No answer key or separate practical instructions were found in this week.

## Package and queue changes

- `biology.json`: added `COV-BIO-T1-W07-SCHEME-7` (PARTIAL), `COV-BIO-T1-W07-ENZYMES` (PARTIAL) and `COV-BIO-T1-W07-ASSIGNMENT` (UNRESOLVED), plus blocking open items for missing lessons, the assignment key and factual review. Existing sources, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T1-W07` IMPLEMENTED_TESTING_DEFERRED; appended a factual-dependency task and a bounded supplemental lesson task; recomputed counts and `next_runnable`. Totals are 17 IMPLEMENTED_TESTING_DEFERRED, 69 PENDING and 5 BLOCKED.
- No lesson, answer key, correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; Week 7 label, scheme and range hashes; hashes for food-substance, enzyme and assignment ranges; comparison of assignment prompts with source teaching; structural drawing/table/tab counts; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
