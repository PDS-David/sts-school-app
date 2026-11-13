# CHEM-IDX-T1B-W01 — Chemistry, 1st Term (second original), Week One index

Status: **IMPLEMENTED_TESTING_DEFERRED** (source indexing only; not approved, not verified). No lesson, answer key, source correction, visual asset or reuse permission is created by this task.

## Inputs and source identity
- Source: `SS1-SRC-84df18289b7a`, archive member `SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx`.
- Owner-supplied composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified against the uploaded ZIP.
- Member SHA-256: `0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a` — verified against the extracted member bytes.
- CHEM-INV-T1B recorded Mammoth 1.12.2 `extractRawText` whole-source text: 118,241 characters, 3,303 lines, SHA-256 `05f0cdbe8ac5f71a677ad7adc38851d922b0ef51822b5afde7979508c055c862`.
- Week range: lines 43–728, raw-range SHA-256 `f5fb2013de4658198475c1106b421e5e28adde12b6892f4b88d6159e4f2083f4`.
- Importer-view trimmed body SHA-256: `f4afd8770866b2355948dd1ca8eb092cd9de7645611e1a460ab4440c9bd854de`; parsed title: `Chemistry as a Subject and as a Central Science`.
- Locator source: `CHEM-INV-T1B.md`. Line numbers are 1-based Mammoth raw-text lines; section ranges end before the next marker. The inventory's verified whole-week locator and importer body digest are retained; no claim is made that this task reran Mammoth or the importer.

## Week One section index

| Section | Source lines | Indexing note |
|---|---:|---|
| WEEK 1 marker and title | 43–51 | Exact week marker and parsed title are recorded in CHEM-INV-T1B. |
| CHEMISTRY AS A DISCIPLINE | 53–55 | Science as organised/systematised knowledge; chemistry as a discipline. |
| CHEMISTRY AS A SUBJECT AND AS A CENTRAL SCIENCE | 57–69 | Chemistry definition, etymology passage, everyday relevance and examples of useful materials/products. |
| CHEMISTRY-A CENTRAL SCIENCE | 71–89 | Chemistry's connections to biology, physics, geology, medicine, ecology and engineering; central-science summary. |
| BRANCHES OF CHEMISTRY | 97–145 | Pure chemistry begins at 103; applied chemistry begins at 117; descriptions of pure and applied areas continue to the next section. |
| CAREER OPPORTUNITIES | 149–183 | Career sectors, roles, workforce percentage claims, group discussion and the careers wheel. |
| EVALUATION 1 | 185–265 | Four multiple-choice items, five fill-in statements and five discussion prompts; first fill-in is at line 225. |
| THE SCIENTIFIC METHOD | 267–289 | Introductory description and six listed steps, including observation, questions, hypothesis/prediction, experiment, analysis and reproduction. |
| CHEMISTRY LABORATORY COMMON EQUIPMENT | 291–657 | Photo/name table at body block 148 (8x4, 32 thumbnails); captioned equipment material and apparatus descriptions; safety statements are handed to CHEM-FACT-T1B-SAFETY. |
| EVALUATION 2 | 659–728 | Repeats the same four multiple-choice items, five fill-in statements and five discussion prompts; first fill-in is at line 699. |

The complete week range (43–728) is retained. No section or assessment block is discarded.

## Objective candidates (index only; all remain unresolved)

1. **Chemistry as a discipline** — explain science as systematised knowledge and describe chemistry as a scientific discipline (53–55).
2. **Chemistry as a subject and its relevance** — define chemistry and explain examples of its relevance to everyday life and useful materials (57–69).
3. **Chemistry as a central science** — explain chemistry's links to biological, physical, geological, medical, environmental and engineering fields (71–89).
4. **Pure and applied chemistry** — distinguish pure from applied chemistry; identify organic, inorganic and physical chemistry; identify and describe the applied areas named by the source: analytical (qualitative and quantitative), industrial, biochemistry, geochemistry, petrochemistry, radiochemistry, biotechnology, medicinal/pharmaceutical and environmental chemistry (97–145).
5. **Career opportunities** — identify sectors and examples of chemistry-related work in industry, education, government and non-traditional fields (149–183). The percentages in the source (including 66%, 26%, 7% and 1%) are not verified by this indexing task; CHEM-FACT-T1B-DATED owns later fact review. The careers wheel's provenance and rights are separately owned by CHEM-VIS-T1B-W01-CAREERS.
6. **Scientific method** — identify the listed inquiry activities and distinguish observation, question, hypothesis, experiment, data analysis and conclusion (267–289). This index does not certify the source's method wording as a universal or factually complete sequence.
7. **Laboratory equipment identification** — recognise common apparatus named in the photo/name table and captions (291–359). No image-to-name pairing or reuse right is certified; CHEM-VIS-T1B-W01-EQUIPMENT owns image-by-image review.
8. **Laboratory equipment uses** — describe the functions of the apparatus named in the text (363–657). The safety-related statements are not approved here and are split out to CHEM-FACT-T1B-SAFETY.
9. **Laboratory safety equipment and handling** — identify the source's safety-equipment and safe-handling statements as a candidate topic (413–425, 459, 471, 485, 641–643). No safety statement is approved by this index; CHEM-FACT-T1B-SAFETY owns verification.
10. **Assessment objectives** — preserve the assessment prompts on branches, chemistry definition, applied disciplines, central science and careers (185–265 and 659–728). Neither block has an answer key or mark allocation in the source.

## Assessment duplication finding
The first and second evaluation blocks are text-identical after trimming paragraph-edge whitespace:
- EVALUATION 1: lines 185–265; fill-in statements at 225, 227, 229, 231 and 233; discussion questions at 239–247.
- EVALUATION 2: lines 659–728; corresponding fill-in statements at 699, 701, 703, 705 and 707; discussion questions at 713–721.
- The four MCQs and the five fill-in prompts are repeated verbatim in the same order. The five discussion prompts are also repeated verbatim. No answer or marking is supplied or authored here.

## Visual and factual handoffs
- Careers wheel: `CHEM-VIS-T1B-W01-CAREERS` (image1.png; 13 labelled spokes; external description link; rights unresolved).
- Equipment table/photos: `CHEM-VIS-T1B-W01-EQUIPMENT` (32 thumbnails and 17 captioned photographs; image-by-image pairing and rights unresolved).
- Safety statements: `CHEM-FACT-T1B-SAFETY`.
- Career workforce percentages and other dated claims: `CHEM-FACT-T1B-DATED`.
- External links and image provenance: `CHEM-FACT-T1B-PROVENANCE`.

## Package and queue changes
- Added ten objective-candidate records to `backend/src/db/ss1/subjects/chemistry.json`, each with source ID, exact section line locator, the whole-week raw-range hash and importer body hash. Every record is `UNRESOLVED` with an empty `lesson_ids` array. No teaching coverage is claimed.
- No source rule, lesson, correction, asset, open item, answer or mark was added.
- Updated `CHEM-IDX-T1B-W01` to `IMPLEMENTED_TESTING_DEFERRED` in `QUEUE.json`; status counts and next-runnable list recomputed. The two visual tasks depending on this index are now eligible.
- Package remains `PENDING`; source alias approval remains an owner action.

## Authoring checks (not tests)
- Verified composite archive and Chemistry T1B member SHA-256.
- Confirmed the task's source ID and week locator against CHEM-SRC-T1B / CHEM-INV-T1B.
- Confirmed the two evaluation blocks have identical question text and line-offset correspondence using the source DOCX paragraphs.
- Checked new coverage IDs for uniqueness and JSON syntax before commit.
- Not run: Mammoth, importer/compiler, package tests, TypeScript, database or device checks. Testing remains deferred by owner.

## Exact next actions
1. Run `CHEM-VIS-T1B-W01-CAREERS` and `CHEM-VIS-T1B-W01-EQUIPMENT` separately; do not reuse source images without rights evidence.
2. Continue `CHEM-IDX-T1B-W02` and the remaining Week One/term tasks.
3. Keep the two repeated evaluation blocks and missing answer keys visible until an approved assessment replacement is authored and verified.
