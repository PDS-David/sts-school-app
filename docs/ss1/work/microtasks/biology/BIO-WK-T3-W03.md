# BIO-WK-T3-W03 — Biology, 3rd Term, scheme row 3 (STIs)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and assessment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and locator

- Source ID: `SS1-SRC-78059230037f`; archive member `SSS 1/3rd Term SS1_/3RD TERM S1 BIOLOGY.docx`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `1e9a758cdd07bd13511059b6d8ef6db0f618f99b14cdf11d20d33c183cb1bca4`. Both match the archive and assignment manifest.
- Native DOCX was read without conversion. `word/document.xml` has 803 direct `w:body` children (blocks 0-801 plus `w:sectPr` at 802). Block = direct child of `w:body`, zero-based; block text = concatenated `w:t` runs (UTF-8, no normalisation); range hash = SHA-256 of block texts first..last inclusive joined with newline.
- Body label block 175 is exactly `WEEK SEVEN` (with the source's spacing/date line), hash `e43a5742583e8a8ba386bade0de387b049a94a50485144d8443fbc82e136ed11`. Blocks 175-215 have the queue's exact range hash `3e25575a5318d1b1efb11d9e15e9a689b9e1a7de2209728bd1b6b9c4fb7138cd`.
- Scheme row 3 is `Sexually Transmitted Infections (STI)`; body topic heading block 177 is `SEXUALLY TRANSMITTED INFECTIONS`. The label says WEEK SEVEN despite this being scheme row 3. A second WEEK SEVEN label occurs at block 474 and is associated with the combined scheme rows 6/7 task. Both original labels are retained; no numbering correction is made here.

## Scheme objective and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Scheme row 3 — Sexually Transmitted Infections (STI) | Scheme row 3; body label block 175; heading block 177; table blocks 182-183; HIV/AIDS blocks 185-194 | PARTIAL | The source defines STIs, provides a four-row table and a section on HIV/AIDS. The package has no registered lesson, and the medical/health claims require current authoritative review before use. |

| Source section | Exact blocks and range hash | Source coverage |
|---|---|---|
| STI definition and table | 182-183 (`5c6d5b6de7f764067dcb9fee7871b33db3bb893a95a9f175810b1d12fe36fb8a`) | Defines STIs and presents gonorrhoea, syphilis, AIDS and genital warts in a table with causative organism, symptoms and prevention/control columns. The medical content is preserved as source evidence, not endorsed as current health advice. |
| HIV and AIDS | 185-194 (`247717dfec1a266ba7145e0db9c9727afc7a0512618d0eb83e6e609a75aa69f5`) | Describes HIV in relation to AIDS, immune-system effects and source-stated transmission/prevention. The expansion of HIV differs between table block 183 and body block 186. The source's claims require current public-health review. |

The table at block 183 has 5 rows × 4 columns: disease, causative organism, symptoms and prevention/control. Its visual preservation is assigned to existing task `BIO-VIS-T3-TBL-STI`.

## Evaluation, general evaluation and assignment review

No answer key or marking guide accompanies the Week 3-position evaluation, general evaluation, weekend assignment or theory.

| Section | Exact locator | Source support and gaps |
|---|---|---|
| Evaluation | Heading 196; questions 197-198 (range `c19817132e38e3cd22ee0addcbb8b6711d721662becd92b9e3eefe0168e30058`) | The table supplies four STI examples and agents. The introductory list at block 182 names additional examples without giving their agents/details, so a five-STI answer is only partly supported. |
| General evaluation/revision | Heading 199; questions 200-205 (range `7edaac0eb527d9a4e8fc7be99f22029ab2f947c833ba0ee4979692dc5df24cf6`) | Q200 revises beneficial/harmful effects from Week 2. Q201 asks for five bacterial diseases and symptoms beyond this week's STI table. Q202 asks for airborne diseases/symptoms not taught here. Q203's STI definition is supported; Q204's five-STI agent/transmission/symptom request is only partly supported by the four-row table. |
| Reading assignment | Block 205 | College Biology, chapter 21, pages 469-472. The cited book is not part of the archive and was not opened. |
| Weekend assignment | Heading 206; questions 207-211 (range `bc0ba3ce1c2ab853528394973dc506c6b5d6512bcae0f9ea5c41f2ff5cdcb958`) | Questions distinguish bacterial/viral disease groups and test STI identification; the table supports some examples but no answer key is supplied. The question about a disease whose symptoms resemble other diseases is not explained in the body. |
| Theory | Heading 212; questions 213-214 (range `65315e4154a1e18cb60490704f42f96ac0d63c688e0c585dbbd9521987d3f56e`) | The body lists several transmission routes and prevention/control statements, but does not provide five complete, independently verified routes and five approved control measures. It briefly distinguishes HIV as a pathogen and AIDS as a disease; no marking guide is supplied. |

## Factual review and preservation

- The table at block 183 expands HIV as `Human immune – deficiency virus`, while block 186 says `Acquired immune deficiency virus`. This inconsistency is preserved and flagged.
- The source's STI names, causative agents, symptom summaries, transmission and prevention/control claims require current authoritative public-health verification. No individual medical advice is inferred.
- The HIV/AIDS section includes a kissing-related transmission claim; it is retained as source wording for review, not repeated as current advice.
- The table and body are not used to generate a keyed health lesson until the factual-review task `BIO-FACT-T3-W03-STI-CLAIMS` is complete.

## Structural census

The Week 3-position range has one Word table at block 183 (5×4), no embedded images, shape drawings, equations or OLE objects, and no tab elements. The table's row/column relationships are owned by `BIO-VIS-T3-TBL-STI`.

## Package and queue changes

- `biology.json`: added `COV-BIO-T3-W03-STI` and `COV-BIO-T3-W03-HIV-AIDS` (PARTIAL) and `COV-BIO-T3-W03-ASSESSMENT` (UNRESOLVED). Added blocking open items for missing lesson content, health-claim review and teacher-approved marking, plus a non-blocking label-alignment owner decision.
- `QUEUE.json`: marked `BIO-WK-T3-W03` IMPLEMENTED_TESTING_DEFERRED; retained the existing STI-table visual task; appended `BIO-FACT-T3-W03-STI-CLAIMS`, `BIO-SCOPE-T3-W03-LABEL-ALIGNMENT` and `BIO-LES-T3-W03-STI`; recomputed status counts and `next_runnable`.
- No health claims were corrected, no answer key or medical advice was authored, and no source extract/image was committed.

## Authoring checks and verification boundary

Checks performed: archive/member SHA-256; native DOCX body-child count; label, scheme-row and range hashes; teaching/assessment range hashes; STI table row/column count and cell content; review of all evaluation/general/weekend/theory items; package JSON references; queue IDs, dependencies and status counts.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
