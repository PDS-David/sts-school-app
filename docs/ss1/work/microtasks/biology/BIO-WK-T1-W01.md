# BIO-WK-T1-W01 — Biology, 1st Term, Week 1 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No tests, typechecks, importer, database or device checks were run. Week 1 is **not** a complete, certified or taught week.

## Inputs
- Branch `ss1/bio-wk-t1-w01`, cut from origin/master `cc6cf68` (the merge of PR #326, FM-WK-T1-W02). Working tree clean at start; the open-PR list for `PDS-David/sts-school-app` was read through the GitHub API and no other branch touches this task's three allowed paths. Biology work on master: BIO-SRC-T1/T2/T3, BIO-INV-T1, BIO-INV-T2 and BIO-WK-T1-W06 are IMPLEMENTED_TESTING_DEFERRED; nothing in this subject was previously indexed for Week 1. No `AGENTS.md` or `QODER.md` exists in the repository.
- Source: composite archive `SSS 1-20260507T072431Z-3-001.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`. Member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`, SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`, 957,703 bytes, **verified** from the member supplied as the standalone attachment before parsing; the equal hash is what decides, so the composite archive hash was not re-checked. Source `SS1-SRC-422e0e6ddde9`. The archive, the member and the `word/document.xml` extract were kept outside Git; nothing from the document is committed.
- Prerequisites BIO-INV-T1 and BIO-SRC-T1 are IMPLEMENTED_TESTING_DEFERRED; the week inventory, the block locators and the locator rule were reused, not re-derived.

## Locator rule (re-verified, numbering unchanged)
Block = direct child of `w:body` in `word/document.xml`, 0-based; block text = concatenation of its `w:t` runs, UTF-8, no normalisation, with text-box text counted in the block that holds the text box; range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. Re-verified this run: 1,106 blocks (block 1105 is `w:sectPr`); label block 13 `WEEK ONE` SHA-256 `635789fb4e63974d59acfd3667c0b0fb9a4b935d51684c017ac9879e598deb6b`; blocks 13-41 range SHA-256 `b525781e0c5aa33f22f18a3896b527830e31892386fa39b05d1bad8cd0a2a450` over 3,326 characters; scheme block 2 SHA-256 `b6fa7da3944e18a573ba816bd780fc8033197df0c554893a8e6c891e55a6b383`. All equal the queue locators. Consequence of the rule used twice below: `w:tab` characters are not `w:t` text, so tab-aligned columns lose their separation in block text while no content is lost.

## Objective
| Scheme entry | Locator | Status | Teaching blocks |
|---|---|---|---|
| 1. Recognizing Living things | scheme block 2; Week 1 label block 13; body blocks 13-41 (range `b525781e0c5aa33f22f18a3896b527830e31892386fa39b05d1bad8cd0a2a450`) | UNRESOLVED — the week's range teaches `BIOLOGY AND INQUIRY`; the scheme wording has no teaching in 13-41 (`COV-BIO-T1-W01-SCHEME-1`) | see Assessment scope and the mismatch below |

Objectives taken from the week's own teaching, each bound to exact blocks:

| Coverage id | Objective | Blocks | Status |
|---|---|---|---|
| `COV-BIO-T1-W01-SCHEME-1` | Scheme entry 1, 'Week 1 -Recognizing Living things' | scheme 2; 13-41 | UNRESOLVED |
| `COV-BIO-T1-W01-BIOLOGY-SCIENCE` | Science and Biology defined, Greek derivation, division into Zoology and Botany | 15-18 (range `68d3f2723d4435e3b4fb9e4e30bf013fedf60630dae16c0dcd29c06578e3dc6b`) | PARTIAL |
| `COV-BIO-T1-W01-BRANCHES` | The thirteen further aspects of Biology named for recall | 20-21 (range `e0eda69b9f67fddba1c5a8e75b0b0e4ac14459ae620f18ed2f142f7560ffe4a2`) | PARTIAL |
| `COV-BIO-T1-W01-INQUIRY` | Nature and role of inquiry; what the scientific process or approach is | 23; 25-26 (range `93100dc5694573b09cb189b062bed395e98a37bb5170b71faf50c58be4a051c0`) | PARTIAL |
| `COV-BIO-T1-W01-PROCESS-ORDER` | The ordered sequence of process steps | 27 (`6f85d0af621f25a53e3b94e1fceade1b03df4de8a6d5f9e9a9f30257621ac42a`) | PARTIAL |
| `COV-BIO-T1-W01-PROCESS-STEPS` | Observation, hypothesis, experiment; aim, apparatus/materials, method, result, conclusion | 29-37 (range `9a4c7d7c2d622d417eff50ad395d94037c5830a1d7521982f2c632d441ea8950`) | PARTIAL |
| `COV-BIO-T1-W01-PROCESS-GAP` | Classification, inference, measurement, identification and control as process steps | named at 27, referred to at 29 | UNRESOLVED |
| `COV-BIO-T1-W01-THEORY-LAW` | Hypothesis tested to theory; theory said to become a law or principle | 38-40 (range `58d3c24e95a33a4a3d3296c0759c9690ccc1f577d4bf496c26af19bda6cfb9c1`) | PARTIAL |
| `COV-BIO-T1-W01-ASSESSMENT` | Week 1 assessment: the term's first assignment | 122-132 (range `446679e98fe2de07ff9266dde247ee2923865140ca99a907e5677b4bf9590304`) | UNRESOLVED |

Every PARTIAL row is PARTIAL for the same recorded reason: `backend/src/db/ss1/subjects/biology.json` has `lessons[]` length 0, there is no parsed row for the week, and the importer has not been run. Taught in the source is not deliverable.

## Scheme/body mismatch
Scheme block 2 reads `Week 1 -Recognizing Living things`; the body title at block 14 is `BIOLOGY AND INQUIRY`, a topic the scheme never lists for any week. The string `recogniz` occurs at block 2 (the scheme line) and at block 961 only — a Week 9 sentence, `BIOMES are large easily recognizable terrestrial ecosystems ...` (`898c0b42de15216fbef0775573741f14fd73036a59264d0ffb6590a9b5f79452`) — and in no teaching block of Week 1 or Week 2. The teaching that does answer the scheme wording is in Week 2's range (blocks 42-132, range `3f8bb1d8f9370ac595b47404008b1aab7e570100bb966d0d660e6683ec7cb5d9`): living and non-living things defined at 45-46 (range `f7aded0bf71baf079599156767d19bd2b88cc8aeeda90e754f2c1cf6bb84107c`), ten characteristics at 48-67 (range `f7db1d1dab282a6e8bd49197de50900dbdf6d1e3317cb6bec21a87706ff0101b`) and the plant/animal comparison at 68-87 (range `86037b08f5147933c1cf5864e5cd7c8be4824a4b2e0187ab004051743d47e495`), i.e. blocks 45-87 (range `8839e55f241f7f195ca572c975aaa7347079454a957e551d9939b4f0fcf7ef95`) — and the scheme's own next line assigns that teaching to Week 2 (`Week 2 -Living things and non-living things`, block 3, `046f1ca8950cb6ab6a05ba314bcc5a5b61ffd35f81caa7eef9f8529e2d8258be`). Nothing is re-scoped here; `BIOLOGY-T1-W01-SCHEME-BODY-MISMATCH` is open and `BIO-FACT-T1-W01-SCOPE` asks which label the week keeps.

## Content not carried by the week
- Branches (block 21, `5265f69ebf664d056495d24ca54729fa15958a0d53ce6b61c04e2320c1bbd0f9`): Morphology, Anatomy, Physiology, Genetics, Ecology, Virology, Bacteriology, Microbiology, Taxonomy, Histology, Mycology, Embryology, Evolution, closing with `e.t.c`. Doc-wide search over all 1,106 blocks: Morphology, Anatomy, Genetics, Virology, Bacteriology, Microbiology, Histology, Mycology and Taxonomy occur at block 21 and nowhere else ('taxonomy' once, at 21; the later teaching spells the noun `TAXANOMY` at block 135); Physiology and Embryology recur only as criteria of the 'modern classification system' at block 156 (`d004feb04357069024c2498a4f43466201e946e0e701c01b7a0edf6535891c64`, Week 3); Evolution only as `the evolutionary trend` at block 654 (`3efb6e870fdcf73c908a43a673b8a0da4feef093c7a818f3b7fbc3e71de6d518`, Week 4); Ecology alone is defined, at block 953 (`2f47be0cc93961b4c7c4b2663067a8704cd4885c21738e6f2f85708d292d3e9f`) with autecology and synecology at 954-955 (Week 9). Only one of thirteen branches is ever taught.
- Process steps: `inference`, `measurement` and `identification` occur at exactly two blocks each — 27 (the list) and 29 (inside the observation definition) — and nowhere else in the document. `classification` occurs at 4, 27, 29, 134, 135, 156, 188, 248, 249, 261, 278: 4 is the Week 3 scheme line and 134-278 is taxonomy teaching, so the process step is named and never taught. `control` occurs 15 times (27, 573-579, 593, 617, 620, 722-723, 744, 974, 1052): pest and disease control, the wording of Week 5 experiments, abiotic factors and a hormone function — never a control as a process step. Block 27 collapses it into `control or conclusion`.
- Theory and law: the words `theory` (27, 38, 40), `law` (27, 40) and `hypothesis` (27, 30, 31, 38, 40) occur nowhere else, so block 40's claim that a theory proven to be true `becomes a LAW OR PRINCIPLE` cannot be checked against any other passage of this source; it is recorded as the source's wording under `BIOLOGY-T1-W01-THEORY-LAW-FACT` (kind FACT) and is not delivered as fact.

## Week 1 material census
Blocks 13-41 hold 29 `w:p` paragraphs and nothing else: 0 drawings, 0 `w:pict`, 0 `w:object`, 0 `w:tbl`, 0 `w:txbxContent`, 0 line breaks, 0 `w:sym` and 0 hyperlinks, with 10 `w:tab` characters at blocks 17, 18, 29, 30, 31, 33, 34, 35, 36 and 37 (one each, immediately after the `(a)`/`(b)` and `(i)`-`(viii)` markers). The long gap inside block 15 is literal spaces inside a single `w:t`, not a tab. Week 1 therefore sets no experiment, no apparatus list, no quantity and no safety instruction; the first experiments with materials in this document are the Week 5 experiments I-V at blocks 714-765. Per the queue item, none is invented here.

## Assessment scope (blocks 122-132)
There is no assignment section inside blocks 13-41. The term's first assessment is the block headed `ASSIGNMENT` (122, `ab04ccc137d5...`) / `WEEK ONE AND TWO` (123, `fc089902cb7e...`; the two together range `899cfdf915fe641c22b721772d4051f253f6f0c9d4ef76c566a1672a642ecb21`).

| Item | Blocks | Where it is answered | Disposition |
|---|---|---|---|
| Q1 `Which of the following groups embraces the rest?` (Class/Kingdom/Phylum/Species) | 124-125 (range `4afc00ad436fb4c1d2486926e6e85bedabccea5a27712c906bf563a61b55a166`) | Week 3 ranks, blocks 134-143 (range `61f3ebaa12c6471ed4e020335c1b57511ca518ae0642ac78f810af664ebbf79d`; rank list 136, `a018fe50087d...`) | **Set before it is taught** (also recorded by BIO-INV-T1) |
| Q2 characteristic most plants do not possess | 126-127 (range `bcf23c55457e2fba37076af765e5fb811f5ec8b317b8c0c99b6971393617f7c5`) | Week 2 characteristics 48-67 | Week 2 teaching |
| Q3 carbohydrate storage in animal cells | 128-129 (range `6621f634ef0afe2cfc24efbb45d17e9fa2e18a995e32fd96a77efe265ca0d378`) | Week 2 comparison table line 75 (`8b2b929ae80693af5a9a911f38f8a8acec2a648450e49b0b202c786be54b0f44`, `Animal stores food as glycogen`) | Week 2 teaching |
| Q4 `All living organisms ...` | 130 (`7d0913a0987a48bdae1474fa00696ef56eb2357982b4c7cf14c585a2d6ff9ab6`) | Week 2 characteristics 48-67 | Week 2 teaching |
| ESSAY Q5 five differences between plant and animal | 131-132 (range `6dc62d04b5aa5c76f0e87e4b4ca555ee05c62cd62d662aa0e33f2b9a1fac482d`) | Week 2 comparison 68-87 | Week 2 teaching |

No question asks about science, the definition of Biology, Zoology or Botany, the thirteen aspects of block 21, the scientific approach, the process steps, observation, hypothesis, experiment, theory or law: **Week 1's own teaching is untested by the term's first assignment.** No key exists for any of the five questions (`lessons[]` length 0) and none is inferred here. `BIOLOGY-T1-W01-ASSESSMENT-MISPLACED` is open and `COV-BIO-T1-W01-ASSESSMENT` is appended as UNRESOLVED.

## Observed defects (retained uncorrected)
1. The definition of Biology is cut across blocks 15 and 16, so block 16 opens with the fragment `Organisms.`
2. Block 15 writes `two Greek work` and glosses `bios` and `Logos` with inconsistent capitalisation.
3. Block 17 is a definition of Zoology that ends with a question mark, and uses the singular `animal` for animals.
4. Block 18 reads `is the study of different type of plant` with no subject.
5. Block 21 lists thirteen branches and closes with `e.t.c`, defining none of them.
6. Block 26 uses `process` three times in one sentence (`a process of science which involves the process of making sequence of enquiries`).
7. Block 27 promises classification, inference, measurement, identification and control and writes `control or conclusion` as one step; its last three names carry no separators.
8. Block 29 defines observation as `the use of human senses to describe an observation`.
9. Block 31 defines experiment as `the process used for testing of hypothesis through experimentation` — the thing in terms of itself.
10. The parts of an experiment are numbered (iv)-(viii) at 33-37, continuing the (i)-(iii) of 29-31, so aim, apparatus, method, result and conclusion read as steps of the same order as observation, hypothesis and experiment.
11. Block 34 prints `APPARATUS//MATERIALS`.
12. Block 37 has no final stop.
13. Block 40 states that a theory proven to be true `becomes a LAW OR PRINCIPLE`.

## Visual disposition
Week 1 contains no drawing, picture, embedded object, table or text box (census above), so no asset item is added by this task and none of the 24 existing `BIO-VIS-*` items is affected.

## Appended tasks
- `BIO-LES-T1-W01-BIOLOGY-AND-INQUIRY` — LESSON, PENDING; depends on BIO-SRC-T1, BIO-WK-T1-W01 and BIO-FACT-T1-W01-SCOPE.
- `BIO-LES-T1-W01-ASSESSMENT` — LESSON, PENDING; depends on BIO-SRC-T1, BIO-WK-T1-W01, BIO-WK-T1-W02 (so the single combined Weeks 1-2 assignment is dispositioned once) and BIO-FACT-T1-W01-SCOPE.
- `BIO-FACT-T1-W01-SCOPE` — FACTUAL_DEPENDENCY, BLOCKED; depends on BIO-SRC-T1 and BIO-WK-T1-W01. Carries six numbered questions, including the theory/law reference.
- Neither lesson is runnable until the expert decision is recorded; no lesson text, answer key or correction is authored here.

## Edits
- `biology.json`: nine coverage entries appended (6 PARTIAL rows: BIOLOGY-SCIENCE, BRANCHES, INQUIRY, PROCESS-ORDER, PROCESS-STEPS, THEORY-LAW; 3 UNRESOLVED rows: SCHEME-1, PROCESS-GAP, ASSESSMENT) — coverage 2 → 11; five open items appended (`BIOLOGY-T1-W01-COVERAGE`, `BIOLOGY-T1-W01-SCHEME-BODY-MISMATCH`, `BIOLOGY-T1-W01-ASSESSMENT-MISPLACED`, `BIOLOGY-T1-W01-SOURCE-DEFECTS`, all CONTENT, and `BIOLOGY-T1-W01-THEORY-LAW-FACT`, FACT), all blocking — open_items 6 → 11. Sources, source rules, lessons, delivery corrections and assets untouched; `package_status` remains PENDING.
- `QUEUE.json`: `BIO-WK-T1-W01` set to IMPLEMENTED_TESTING_DEFERRED with its inventory reference kept verbatim and an `Indexing result (2026-11-05)` passage appended (as BIO-WK-T1-W06 does); completion_condition unchanged; three items appended; counts recomputed (LESSON 2 → 4, FACTUAL_DEPENDENCY 2 → 3) and status_counts recomputed from the items (63 items: 7 IMPLEMENTED_TESTING_DEFERRED, 53 PENDING, 3 BLOCKED); `BIO-WK-T1-W01` removed from `next_runnable`, which now has 49 entries; one note appended. No other item, note or field changed.
- This file.

## Checks run (authoring only)
Member SHA-256 recomputed from the supplied attachment before parsing and equal to the queue; 1,106 blocks parsed; Week 1 label and range hashes equal to the queue locators; scheme block 2 hash computed. **Every one of the 74 SHA-256 values cited by the new coverage and open-item entries was re-derived from the member's `word/document.xml` and checked positionally** — each `block N (sha256 …)` compared with the recomputed digest of block N, each `blocks A-B (range sha256 …)` with the recomputed span digest, and each bare digest located in the block/span it is cited against: 57 adjacency checks, 0 mismatches. Week 1 construct census taken from the block XML; doc-wide string searches for recogniz, inference, measurement, identification, classification, control, theory, law, hypothesis, each of the thirteen branch names, Kingdom/Phylum/Species, glycogen and taxonomy. `biology.json` passed a line-by-line reimplementation of `subjectPackageSchema.ts` (strict key sets, enums, non-blank text, 64-hex digests) with no errors; unique coverage and open-item ids; all 11 PARTIAL/UNRESOLVED rows named by a blocking open item; every `affected_ids` value resolves to a package id or to a queue item id; queue duplicate-id, dependency-integrity and `next_runnable` checks (each entry PENDING with all dependencies IMPLEMENTED_TESTING_DEFERRED) passed; both files JSON-parse and round-trip byte-exactly through the project serialisation with CRLF, and the pre-existing package arrays, coverage rows, open items, notes and every other queue item were compared against `HEAD` and are unchanged. A real Zod parse, the importer, the compiler, tests, type checks, the database and devices were **not** run — deferred by owner; `node_modules` is not installed in this environment.

## Remaining
Week 1 has no deliverable lesson: the six PARTIAL rows need the normal import/parse step, the three UNRESOLVED rows (the scheme's own objective, the missing process steps and the week's assessment) need `BIO-FACT-T1-W01-SCOPE` before anything can be authored, and the theory/law wording needs an authoritative reference. Next eligible Biology items are BIO-INV-T3, BIO-TEST-PACKAGE and BIO-PRE-T1. This does not claim the week, subject or class complete.
