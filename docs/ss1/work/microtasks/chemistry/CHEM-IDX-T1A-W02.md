# CHEM-IDX-T1A-W02 — Chemistry, 1st Term WEEK TWO indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `999c95a86754ed1a997ee9de3b580510ae5679f0` (claim commit `b899f77` on top). `docs/ss1/work/AGENT_PROTOCOL.md` was followed. CHEM-INV-T1A and CHEM-SRC-T1A are `IMPLEMENTED_TESTING_DEFERRED`. CHEM-IDX-T1A-W02 was `PENDING`; `git log origin/master --grep=CHEM-IDX-T1A-W02` returned only the claim commit; no `origin/agent/*` branch had touched chemistry in the last three hours.
- Archive `docs/ss1/sources/SSS1-original.zip` SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — **verified**. Member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`, 2,187,976 bytes, SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` — **verified**. Extracted only that member, to private scratch outside the repository. Nothing from the source is committed.
- Text read with `mammoth` 1.12.2 `extractRawText`: 55,382 characters, 2,129 lines, SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702` — equals the task.
- Locator re-check: lines 246-415 joined with `\n` hash to `3064d93fa4b6050c3522c4be0fa06690cb505b4666a7508d80bcf2cd862e5d05`, equal to the locator. `WEEK TWO` is line 247; `WEEK THREE` is line 417.
- DOCX XML scan of the body children from `WEEK TWO` (child 123) to `WEEK THREE` (child 208): 10 `a:blip` (one JPEG `image43.jpg`, 44,665 bytes, SHA-256 `bb2d3e6c33f4f32bc13ba7563d35c8fd01410a9b476b64b4ad65eeea9d3572b3`, plus nine 70-byte PNG parts that are all 1x1), 19 `w:drawing` (18 anchored, 1 inline), 9 `w:txbxContent`, no `w:pict`, `w:tbl`, `m:oMath`, `w:object`, hyperlink or field; all 203 `w:vertAlign` runs are `baseline`; 55 paragraphs carry automatic numbering or bullets.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `extractRawText` text split on `\n`; a section runs from its first to its last non-blank line; SHA-256 over the UTF-8 lines joined with `\n`. The item's own ranges include trailing blank lines (for example 273-327); the ranges below stop at the last non-blank line. Whitespace-only line 341 (65 spaces) counts as a blank separator, as in CHEM-IDX-T1A-W01, and is recorded separately below.

## Section index (lines 246-415)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK TWO label | 247-247 | `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6` | marker line |
| TOPIC: LABORATORY FAMILIARIZATION | 249-249 | `3b97642c348e5b67a9d080f82f009e0c4065ae9500124f3c8d1f32288ca6799f` | topic line |
| CONTENT | 251-257 | `30d5d967fc79ee87c2a5876b34e15f544391d8db8630dd0c530b633aec877daf` | three bullets: `DEFINTION OF LABORATORY` (253, sic), `LABORATORY APPARATUS; MEANING, USES AND IDENTIFICATION` (255), `LABORATORY SAFETY RULES` (257) |
| DEFINITION OF LABORATORY | 259-261 | `aa93c82bcdfe6549bb2b378b66e8248394273b371b6bd592fdc14624f58e7b34` | heading and one sentence (261) |
| LABORATORY APPARATUS | 265-269 | `e6b2706c99d5689dd71835091ed85381904de27cf71945ec4114066991f3e65d` | heading; one-sentence definition (267); one list sentence (269) |
| SOME LABORATORY APPARATUS AND THEIR USES | 273-325 | `5757db26fa9fc22942856b11b5a157f4ab5e79c38a97136edd899073cdf01f76` | 25 numbered entries; `EVAPORATING DISH:` at 275 with its text at 277; 24 single-paragraph entries 279-325; trailing whitespace on 297 and 301; double spaces on 281, 291 and 299 |
| EVALUATION | 329-333 | `fdb11d10d3eedd03ba5ac02bf2d8827c7802ebc2a85d656bef0921af8310ee03` | 2 questions (331, 333) |
| IDENTIFICATION OF SOME LABORATORY APPARATUS | 337-339 | `18dff616d338009fc710d798038e1e834109766b66efe247cf6b6c5ce827613f` | heading and instruction (339); drawing anchor paragraph is line 341 (whitespace-only) |
| LABORATORY SAFETY RULES | 345-371 | `ed78a788a9770d9a3643d5598bf5fe5f848d61fae462efab816765127117a2f2` | heading; 13 numbered rules (347-371) |
| GENERAL EVALUATION | 375-379 | `889f503496ef27b7351e912109e05314bbfa051f28ef510ba056e6e18a233c83` | 2 questions (377, 379) |
| READING ASSIGNMENT | 383-385 | `8e5fa4a7419acf03312831d6ac964c4964b17ebc6d2549e8ab04745aa823a221` | one textbook reference with pages (385); not supplied, not copied |
| WEEKEND ASSIGNMENT | 387-397 | `6f8dd5626a9ed40e686210a0c1907e29367983623285951b2a5ec25fb26a91e2` | 5 objective questions with options (a)-(d) (389, 391, 393, 395, 397); no answer key |
| THEORY | 401-411 | `fc8f98a43157863ca3529fceae0f8082a4cf7212bf2abb2ee27d660018e9d410` | lettered a. and b. (403, 405), stem (407) and two apparatus prompts (409, 411) |

Every non-blank line from 247 to 411 belongs to a section above (checked by script); lines 413-415 are blank. Nothing is discarded.

## Exercises (indexed, not answered)
- **EVALUATION (329-333):** 331 `Mention ten (10) laboratory pieces of apparatus you know and their uses`; 333 `Define (a) Laboratory (b) Laboratory apparatus`.
- **IDENTIFICATION (337-341):** 339 `Identify the laboratory apparatuses and laboratory set-up labeled A-I below:`; no key.
- **GENERAL EVALUATION (375-379):** 377 `List ten safety measures in the laboratory`; 379 `State the uses of: (a) Evaporating dish (b) Pipette (c) Retort stand (d) Measuring cylinder (e) Conical flask`.
- **READING ASSIGNMENT (383-385):** 385 `Practical Chemistry for School and Collegs by G. O. Ojokuku pg 2-15`; not supplied and not copied.
- **WEEKEND ASSIGNMENT (387-397):** five objective questions (389 an apparatus for preparing poisonous gases; 391 collecting a gas over water; 393 separating immiscible liquids; 395 holding drying agents; 397 coloured reagent bottles). None has an answer key or mark.
- **THEORY (401-411):** 403 `Define Laboratory`; 405 `List five safety measures that must be taken when in the laboratory`; 407 stem `State the use of the following apparatuses`; 409 `Separating funnel`; 411 `Condenser`.
- No answer, marking guide or mark allocation exists anywhere in the week. None is authored here.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Definition of laboratory and of laboratory apparatus (259-267; questions 333, 403).
2. Common apparatus, their descriptions and uses (269-325; questions 331, 379, 389-395, 409, 411).
3. Identification of apparatus and set-up A-I (337-341) — drawing and labels only; no key.
4. Laboratory safety rules (345-371; questions 377, 405).
5. Pipette and coloured reagent bottles (questions 379(b) and 397) — **no teaching text**.

## Scheme mapping and coverage
- Scheme row 2 (line 49, `LABORATORY FAMILIARIZATION`, SHA-256 `b19f8a782a3f5ad75ba5a0d2b64dc465abdc0b023b1f1ddc716276f9910e5dea`) equals the week's topic line 249 after the `TOPIC: ` prefix and maps to this week by title and order. The scheme has no sub-items.
- Package change: **six** coverage entries in `chemistry.json`, none with lesson ids: `COV-CHEM-T1A-W02-SCHEME-2`, `-DEFINITION`, `-APPARATUS-USES`, `-SAFETY` (PARTIAL) and `-IDENTIFICATION`, `-APPARATUS-GAPS` (UNRESOLVED). All still block delivery. The package stays `PENDING`; no coverage beyond indexing is claimed. Week One's `COV-CHEM-T1A-W01-APPARATUS` is unchanged (still UNRESOLVED for Week One).
- Open items for the UNRESOLVED entries: `-IDENTIFICATION` → `CHEM-VIS-T1A-W02-APPARATUS` (existing, PENDING); `-APPARATUS-GAPS` → `CHEM-LES-T1A-W02-APPARATUS-GAPS` (new). Statement-level verification of uses and safety rules stays with `CHEM-FACT-T1A-SAFETY` (existing).

## Findings (source wording retained; nothing corrected)
- Line 269 has thirty comma-separated segments ending `etc.`; two segments run two names together (`funnel (plastic or glass) thistle funnel`, `Woulff’s bottle tripod stand`), so thirty-two apparatus are named. Twelve named there have no entry of their own in 273-325 (brush, thistle funnel, tripod stand, Bunsen burner, beehive shelf, delivery tube, deflagrating spoon, u-tube, thermometer, wash bottle, chemical balance, reagent bottle); eight entries are not named at 269 (evaporating dish, crucible, standard volumetric flask, distillation flask, bell jar, measuring cylinder, Kipps apparatus, centrifuge).
- Spellings differ as written: `DEFINTION` (253) vs `DEFINITION` (259); `desiccated` (269) vs `DESSICATOR` (309); `wire gauze` (269) vs `WIRE GUAZE` (315); `Collegs` (385); stray closing apostrophe after `reactants` (323).
- General evaluation 379(b) asks for the use of a pipette; the only nearby entry is `DROPPING BOTTLE OR DROPPING PIPETTE` (301). Weekend question 5 (397) concerns coloured reagent bottles, which no sentence describes. One bounded follow-up was appended: `CHEM-LES-T1A-W02-APPARATUS-GAPS`.
- The identification exercise (339) refers to labels A-I; the extracted text carries none (line 341 is whitespace only). In the DOCX the nine text boxes read, in document order, `c`, `B`, `A`, `I`, `G`, `H`, `F`, `E`, `D` (the first lowercase). Disposition belongs to `CHEM-VIS-T1A-W02-APPARATUS`; nothing was read into the drawing here.
- Line 363 only names the fire extinguisher, eye wash station, first aid kit and safety shower as places to learn; the block gives no first-aid instruction, chemical name or emergency procedure.
- One bounded follow-up was appended for later factual verification of names and descriptions: `CHEM-FACT-T1A-W02-STATEMENTS`.
- Automatic numbering and bullets (CONTENT bullets, 25 apparatus entries, 13 safety rules and the numbered questions) carry no characters in `extractRawText`; the numbers in this note are counts, not source text.

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: `coverage` goes from eight to fourteen entries. No other field changed.
- `QUEUE.json`: CHEM-IDX-T1A-W02 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CHEM-LES-T1A-W02-APPARATUS-GAPS` (LESSON) and `CHEM-FACT-T1A-W02-STATEMENTS` (FACTUAL_DEPENDENCY) inserted after `CHEM-FACT-T1A-W01-STATEMENTS` (PENDING, depend on CHEM-INV-T1A, CHEM-SRC-T1A, CHEM-IDX-T1A-W02); `counts`, `status_counts` (10 implemented / 98 pending / 1 blocked; 109 items) and `next_runnable` recomputed from the items; one note appended. `next_runnable` shrank from 70 to 53 because the previously stored list had drifted from the items (it omitted `CHEM-LES-T1A-W01-ADVERSE-EFFECTS` and `CHEM-FACT-T1A-W01-STATEMENTS` and held 21 items whose dependencies are not yet implemented); the recount equals the protocol rule and `claim.sh next`. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse with byte-stable re-serialisation; SHA-256 of the archive, member, whole text, week range, scheme row and every section; script check that every non-blank line 247-411 is in a section; DOCX XML scan for drawings, text boxes, tables, equations, scripts and list numbering; unique ID and reference checks; kind and status counts and `next_runnable` recomputed from items; diff inspection.

## Remaining
Weeks Three to Ten, the opening block and the revision/examination markers still need their own indexing; the Week Two drawing disposition (`CHEM-VIS-T1A-W02-APPARATUS`), the safety and statement verification (`CHEM-FACT-T1A-SAFETY`, `CHEM-FACT-T1A-W02-STATEMENTS`) and the apparatus-gap lesson are open. Alias approval items stay owner actions. Not executed here. This does not claim the subject or class complete.
