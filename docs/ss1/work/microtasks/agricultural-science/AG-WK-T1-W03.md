# AG-WK-T1-W03 — Agricultural Science, First Term Week 3 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no lesson authorship, approval, verification or delivery acceptance is claimed.

## Inputs and integrity
- Base master: `69bba13767d722ca73315a35d91d0891121524b2`; branch: `agent/agricultural-science`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified).
- Member `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx` SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` (verified).
- Inspected original `word/document.xml`; no source bytes or conversions are committed.

## Reproducible locators
Block = direct child of `w:body`, zero-based. Block text is concatenated `w:t` runs, UTF-8, no normalisation. Range hash = SHA-256 of block texts joined with newline, including empty blocks.

- Scheme entry 3: block 14 — “Problems of Agricultural Development in Nigeria and their Possible Solutions.”
- Week label: block 186; topic: block 188.
- Week range: blocks 186–326; SHA-256 `fbc4d190de76b9f916b8349eb1e2b34992b3a9f1839aad4aeb175ccc37ecfefb`, re-derived and matched.
- Fifteen numbered problem headings: 193, 198, 203, 210, 219, 225, 232, 241, 245, 250, 257, 266, 272, 277, 282.
- Corresponding solutions: 195–196, 200–201, 205–208, 212, 222–223, 227–230, 234–237, 243, 247–248, 252–253, 259–261, 268–270, 274–275, 279–280, 284–287.

## Scheme objective and coverage

| Objective | Source evidence | Status |
|---|---|---|
| Problems of Agricultural Development in Nigeria and their Possible Solutions | Fifteen problems and solutions, blocks 193–287 | **PARTIAL** — original source teaching exists; no package lesson or importer-confirmed original-row ID yet. |

Coverage entry: `COV-AG-T1-W03-PROBLEMS`. PARTIAL is a delivery-mapping limitation, not a claim that the source teaching is absent.

## Assessment-by-assessment scope

| Blocks | Assessment item | Finding |
|---|---|---|
| 214–217 | Solutions for inadequate land and poor farmer finances | Supported by blocks 195–196 and 205–208. |
| 238–239 | Solutions for illiteracy and transport | Supported by blocks 222–223 and 227–230. |
| 263–264 | Solutions for unfavourable climate and poor inputs | Supported by blocks 252–253 and 259–261. |
| 291–292 | Solutions for crude tools and natural hazards | Supported by blocks 268–270 and 284–287. |
| 294–295 | Five problems and two solutions each | Supported by the fifteen numbered problems and their solution sections. |
| 296 | Who are extension agents? | A concise description appears at 273: agents teach farmers improved methods. |
| 297 | Discuss roles of agricultural extension | **UNRESOLVED** — only one role is stated at 273; training/employment/incentives at 274–275 are recommendations for staffing, not a broader list of extension roles. |
| 298 | Four solutions to natural hazards | Supported by 284–287 (printed “Afforrestation”; cover crops; terracing/strip cropping; insurance). |
| 299 | Five agricultural inputs | Supported by 204 and 251 (machinery, improved seed, fertilizers, pesticides, herbicides). |
| 301–303 | Reading assignment | Two book/page references are present; neither book nor page range was opened or verified. |
| 305–310 | Weekend multiple choice | Q1 irrigation is supported by 259; Q2 distinguishes the simple tool hoe (Week 2 block 149) from machinery examples; Q3 crop rotation is supported later in Week 6 block 436; Q4 herbicide is named as an input at 204/251 but never defined (**UNRESOLVED**); Q5 lists credit sources not fully taught at 310 vs bank loans at 207 (**fact check appended**). |
| 311–313 | Theory: five problems and two solutions each | Supported by the fifteen problems and their corresponding solutions. |

## Defects and bounded follow-ups
- Block 235's storage/processing solution is malformed: “Government should such as millers and threshers should be made available…” Its intended missing phrase cannot be recovered from this sentence. A bounded correction-binding task `AG-CORR-T1-W03-STORAGE-SOLUTION` was appended; no repair is guessed.
- The heading at block 257 runs “UnfavourableClimate”; block 284 prints “Afforrestation”. These source spellings are preserved and recorded, not silently changed.
- `AG-LES-T1-W03-EXTENSION-ROLES`: supplement for the broader extension roles requested at block 297.
- `AG-LES-T1-W03-INPUT-TERMINOLOGY`: safe, non-operational terminology for herbicide and related terms; no doses, rates, mixing or handling instructions.
- `AG-FACT-T1-W03-CREDIT-OPTIONS`: verify the credit-source options in block 310 against authoritative Nigerian sources.

Pests and diseases are described at blocks 245–248; pesticides/agro-chemicals are mentioned, but no doses, application rates or handling directions are supplied. None were invented.

## Changes and validation
- Added three coverage entries (one PARTIAL, two UNRESOLVED) and five precise open items to the subject package.
- Marked `AG-WK-T1-W03` `IMPLEMENTED_TESTING_DEFERRED`; appended four bounded follow-up tasks; recomputed queue counts and `next_runnable`.
- Parsed JSON and checked unique IDs, references, and that each PARTIAL/UNRESOLVED coverage entry has an open item.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No original source text, parsing rules, corrections, assets, lesson bodies, shared code or other subjects were modified.
