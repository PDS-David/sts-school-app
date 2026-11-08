# AG-WK-T1-W02 — Agricultural Science, First Term Week 2 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is source indexing and evidence, not lesson authoring, approval, verification or delivery acceptance.

## Inputs and integrity

- Base used: `dee46c73956eb02b55b6c3cb265059e068196f45`; branch: `agent/agricultural-science`.
- Composite archive: `SSS 1-20260507T072431Z-3-001.zip`; SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`; SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified against the manifest.
- Inspected the original `word/document.xml`, including the actual Word table structure. No extracted source or conversion is committed.

## Reproducible locators

A block is a direct child of `w:body` in `word/document.xml`, numbered from zero. Block text is the concatenation of its `w:t` runs, UTF-8, without normalisation. A range hash is SHA-256 over block texts first-to-last inclusive joined by newline, including empty blocks.

- Scheme entry 2: block 13 — “Types of Agriculture: Subsistence and Commercial Agriculture.”
- Week label: block 143 — exact text `WEEK 2DATE………………………………………….` (no space before DATE).
- Topic: block 144 — `TYPES OF AGRICULTURE:SUBSISTENCE AND COMMERCIAL AGRICULTURE`.
- Teaching: definitions at blocks 149 and 152.
- Comparison table: block 160; 13 rows including header, two columns and 12 paired comparison rows. Block-text SHA-256: `9cc53b2bd0d0fccc6e1b1201a426be4d0157bc8bae17412a737ce50cfd485c5a`.
- Week range: blocks 143–185; SHA-256 `0675d4a5ba07886d9387b83c5394bbc786dc6eff52c20e43ce3420cc99895ceb` — independently re-derived and matched to the inventory.

## Scheme objective and coverage

| Scheme objective | Source teaching | Status |
|---|---|---|
| Types of Agriculture: Subsistence and Commercial Agriculture | Definitions at 149 and 152; twelve paired contrasts in table 160 | **PARTIAL** — the source teaches the objective, but the package has no lesson rows and the importer/parsed-row identity has not been verified. |

The coverage entry is `COV-AG-T1-W02-TYPES`. Its PARTIAL status is strictly a delivery-mapping limitation, not a claim that the original teaching is absent. No parsed lesson ID was guessed and no duplicate supplement was created for the core objective.

## Assessment, assignment and theory scope

| Blocks | Item(s) | Source-scope finding |
|---|---|---|
| 153–157 | Evaluation Q1–Q4 | Q1–Q2 are answered by the definitions (149, 152). Q3 asks for ten simple tools; the text names only cutlass, hoe and axe (149). Q4 asks for ten complex machines; the text names only tractors, bulldozers, planters and harvesters (152). |
| 162–164 | Evaluation | Define the two types and state five differences; supported by 149, 152 and table 160. |
| 165–170 | General evaluation/revision | Q1–Q2 and Q3 revisit Week 1 agriculture/importance/agro-based industries (Week 1 blocks 53–107); Q4 is supported by 149 and 152; Q5 is supported by table 160. Q3 asks for five agro-based industries and raw materials, while Week 1 block 103 names textile, beverage and tyre/foam industries but does not give five distinct industry categories. |
| 171–173 | Reading assignment | Names *Essential Agricultural Science*, chapter 1, pages 2–6, and *Fundamental Agricultural Science*, chapter 1, pages 1–4. These books/pages were not opened or verified. |
| 174–179 | Weekend assignment | Q1–Q2 are supported by definitions 149 and 152. Q3 depends on the Week 1 agro-based-industry teaching (103); the options are not fully keyed by an explicit source list. Q4 (178), about foreign-exchange earnings, is not conclusively answerable from the Week 1 export list at 104: omission of yam does not prove non-export. Q5 is supported by table 160, row 12 (subsistence farming has no access to credit facilities). |
| 180–183 | Theory | Q1 asks for five agro-based industries and raw materials; Week 1 block 103 gives fewer than five distinct industry categories. Q2(a)–(b) ask for five characteristics each of subsistence and commercial agriculture; table 160 provides twelve paired contrasts. |

The General Evaluation/Revision heading at block 165 does not erase the questions beneath it. They are retained and assessed for scope. No reading source was claimed checked.

## Follow-up work appended

- `AG-LES-T1-W02-TOOLS-MACHINES`: supply the ten simple-tool and ten complex-machine examples demanded by evaluation Q3–Q4, as a clearly labelled assessment supplement.
- `AG-LES-T1-W02-AGRO-INDUSTRIES`: teach five distinct agro-based industries and raw materials for the cross-week revision questions; distinguish agro-based from agro-allied.
- `AG-FACT-T1-W02-EXPORT-ITEM`: verify the foreign-exchange question with authoritative evidence; do not infer a key from the source list's omission.

Open items in the package record the above follow-ups and the outstanding original-row delivery mapping. The existing Week 2 comparison-table visual task `AG-VIS-T1-TBL-W02` remains separate and pending; this indexing task does not claim a visual disposition.

## Changes and checks

- Added one PARTIAL coverage row and three precise open items to the subject package.
- Marked `AG-WK-T1-W02` `IMPLEMENTED_TESTING_DEFERRED`; appended three bounded tasks; recomputed queue kind counts, status counts and `next_runnable`.
- Verified the composite archive, exact source member and Week 2 range hashes; checked task dependencies and allowed write paths; JSON was parsed and structural IDs/references are checked before commit.
- No source bytes, lesson bodies, parsing rules, corrections, assets, shared schema/compiler or other subject files were changed.
- Importer, TypeScript checks, database, device rendering and tests were **not run**; testing remains deferred by owner.
