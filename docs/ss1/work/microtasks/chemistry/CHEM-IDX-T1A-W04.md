# CHEM-IDX-T1A-W04 — Chemistry, 1st Term WEEK FOUR indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `7ef0c05ed1945a80a08929cff845109ae440a6be`. `docs/ss1/work/AGENT_PROTOCOL.md` was followed. CHEM-INV-T1A and CHEM-SRC-T1A are `IMPLEMENTED_TESTING_DEFERRED`. CHEM-IDX-T1A-W04 was `PENDING`; `git log origin/master --grep=CHEM-IDX-T1A-W04` returned nothing; no `origin/agent/*` branch had touched chemistry in the last three hours.
- Archive `docs/ss1/sources/SSS1-original.zip` SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — **verified**. Member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`, 2,187,976 bytes, SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` — **verified**. Extracted only that member, to private scratch outside the repository. Nothing from the source is committed.
- Text read with `mammoth` 1.12.2 `extractRawText`: 55,382 characters, 2,129 lines, SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702` — equals the task.
- Locator re-check: lines 608-867 joined with `\n` hash to `4aea3a2b6e25c43d020c89763df5216007c01031981f9040d4373a57b580dd9c`, equal to the locator. `WEEK FOUR` is line 609; `WEEK FIVE` is line 869.
- DOCX XML scan of the body children from `WEEK FOUR` (child 304) to `WEEK FIVE` (child 434): 15 `a:blip`, all 70-byte 1x1 PNG spacers (decoded); 30 `w:drawing`; no `w:txbxContent`, `w:pict`, `w:tbl`, `m:oMath`, `w:object`, hyperlink or field; `w:vertAlign` runs: 255 baseline, 11 subscript, 12 superscript (all 23 non-baseline runs are in the radical formulae at 795, 803-815 and 825); 23 paragraphs carry automatic numbering or bullets.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `extractRawText` text split on `\n`; a section runs from its first to its last non-blank line; SHA-256 over the UTF-8 lines joined with `\n`. The item's own ranges include trailing blank lines (for example 621-625); the ranges below stop at the last non-blank line. Whitespace-only line 817 (a tab and a space) counts as a blank separator, as in CHEM-IDX-T1A-W01.

## Section index (lines 608-867)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK FOUR label | 609-609 | `3c43507c7d6178122a308f5e7ede8deda1dd2dfab7a0beebb4601d6d26ea10c2` | marker line |
| TOPIC:  ELEMENTS, SYMBOLS & VALENCY | 611-611 | `ea7d69f76b4aa2a4394b12d35f8c5e1c06fe7fad54ab2c67b34803a397c0ff3e` | topic line; two spaces after `TOPIC:`; wording differs from scheme row 4 `ELEMENTS & SYMBOLS, VALENCY` |
| CONTENT | 613-619 | `6fec3a77d6e33a71e0619923a65221612f95a63417eb162355c81ca3f109f890` | three entries: `ELEMENTS AND SYMBOLS` (615), `CLASSIFICATION OF ELEMENTS` (617), `VALENCY` (619); the body also has `RADICALS` and a metals/non-metals differences section that the list does not name |
| ELEMENTS AND SYMBOLS | 621-623 | `8de03cd3f31bbd864f4410e721e26badc6e4633184615b519e2530b5d2b0d00e` | heading; definition of an element and a count of known elements (623) |
| SYMBOLS OF ELEMENTS | 627-695 | `25f65075e9c281876847981b627ab2eb0bd3b44f00b234a3e351787570506d14` | heading; three derivations (629); first-letter group 631-649 (8 elements); capital plus small letter group 651-671 (9); Latin-name group 675-695 (9); tab-separated text, not Word tables |
| EVALUATION 1 | 699-703 | `68982b7db02fbdcf9271ea473b3886c134b0b970124b4d77cb40c100211072a2` | 2 questions (701 with a leading space, 703) |
| CLASSIFICATION OF ELEMENTS | 707-715 | `f8030a8c5d990e5584d3b9a403b97898a84eaee8ccb386fa0ea53e87256d406f` | heading; metals and non-metals (709-713); metalloids (715) |
| THE DIFFERENCES BETWEEN METALS AND NON-METALS | 719-737 | `a3cea309a01d5e6723d7fdcd1cd86d3614dfadf01c5984ecb231dce92028aaa1` | heading; tab-separated header (721); typed points 1-5 (723-733, point 2 wraps over 725-727); density row 735-737 with no typed number; trailing whitespace on 727 and 737 |
| EVALUATION 2 | 741-745 | `1e9d6217755ca6053a7120d92a1acd83a0f88ad316225c2298b9dcf0df787ad9` | 2 questions (743, 745) |
| VALENCY | 749-789 | `988a3c2792442031190e31a62fccc3e089d8aa19276f98e6c5168da93fb0fe06` | heading; definition (751); dependence on structure (753); lead-in (755); 12-row element/symbol/valency table 759-783 (tab-separated); two explanatory paragraphs (787, 789) |
| RADICALS | 793-815 | `44b7d09383808966785de7b1cfb25e510c16f0453ce62f44347b3ae44d4eef03` | heading; definition of a radical and acid radicals (795); valency of a radical (797); 7-row radical/formula/valency table 801-815 (tab-separated); formulae are flattened and use the digit zero as typed |
| GENERAL EVALUATION/REVISION | 821-827 | `278ed0c592993b2bdd61081dcd2f41a27c8faa5db5b5fe355ba5e6e95172e5e6` | 3 questions (823, 825, 827); trailing whitespace on 825 |
| READING ASSIGNMENT | 829-831 | `e9e7c7b949a8d61c0c8f3c8aacbaa563a3e559a8a9b716cd3b764a5155fa4429` | one textbook reference with pages (831); not supplied, not copied |
| WEEKEND ASSIGNMENT | 835-849 | `ed187a80d00d01e0d361f851a52e04a77e1f0e656db7a53fb97a577afe83cebe` | 5 objective questions with options (837, 839, 841, 843-845, 847-849); 845 begins with spaces; 849 begins `iron (b)` with no `(a)`; no answer key |
| THEORY | 853-863 | `850bac0ad11c2b031487bb2fc94a48d2e7100fce9719231c157c229c12c1292c` | 855 `1. a. Define an element.`; 857 and 859 continue it; 861 `2. a. What are metalloids?`; 863 continues it; 857 and 863 begin with spaces and carry no typed letter |

Every non-blank line from 609 to 863 belongs to a section above (checked by script); lines 864-868 are blank. Nothing is discarded.

## Exercises (indexed, not answered)
- **EVALUATION 1 (699-703):** 701 ` How many elements are discovered now?`; 703 `Write the symbols for the following elements: silicon, iodine, fluorine, sulphur, silver, Iron, copper, potassium and sodium.`
- **EVALUATION 2 (741-745):** 743 `What are metalloids?`; 745 `State two differences between metals and non-metals.`
- **GENERAL EVALUATION/REVISION (821-827):** 823 `Define (i) valency (ii) Radical`; 825 `Write the valency of: a) Oxygen (b) Potassium c) Sulphur d) S042- e) NH4+`; 827 `Classify the following into physical or chemical changes:` four examples (rusting of iron, fermentation of palm wine, evaporation of a salt solution, melting of ice).
- **READING ASSIGNMENT (829-831):** 831 `New School Chemistry for SSS by O.Y Ababio. Pg 26, 32-33`; not supplied and not copied.
- **WEEKEND ASSIGNMENT (835-849):** five objective questions (837 the combining power of oxygen; 839 which is a metalloid; 841 the symbol Au; 843-845 the standard used in defining valency; 847-849 a metal that is liquid at room temperature). None has an answer key or mark.
- **THEORY (853-863):** 855 `1. a. Define an element.`; 857 `Write the symbols of the following elements`; 859 `(i)  Manganese (ii) Caesium     (iii) Cobalt`; 861 `2. a. What are metalloids?`; 863 `Give two differences between metals and non-metal`.
- No answer, marking guide or mark allocation exists anywhere in the week. None is authored here.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Elements and the three derivations of symbols (621-695; questions 701, 703, 841, 855).
2. Symbols asked for but not given: silicon, manganese, caesium, cobalt (703, 857-859) — **no table row**.
3. Classification of elements and metals versus non-metals (707-737; questions 743, 745, 839, 847, 861, 863).
4. Valency (749-789; questions 823(i), 825(c), 837, 843).
5. Valencies asked for but not given: oxygen, potassium (825, 837) — **no table row**.
6. Radicals (793-815; questions 823(ii), 825(d)(e)).

## Scheme mapping and coverage
- Scheme row 4 (line 53, `ELEMENTS & SYMBOLS, VALENCY`, SHA-256 `a1cb7406976849488f3621a6448ddd1d1a354062f4573fdf5667b8316296e183`) maps to the week by position and by the three subjects the topic line `ELEMENTS, SYMBOLS & VALENCY` names; the wording differs. The scheme has no sub-items.
- Package change: **seven** coverage entries in `chemistry.json`, none with lesson ids: `COV-CHEM-T1A-W04-SCHEME-4`, `-ELEMENTS-SYMBOLS`, `-CLASSIFICATION`, `-VALENCY`, `-RADICALS` (PARTIAL) and `-SYMBOLS-GAPS`, `-VALENCY-GAPS` (UNRESOLVED). All still block delivery. The package stays `PENDING`; no coverage beyond indexing is claimed.
- Open item for both UNRESOLVED entries: `CHEM-LES-T1A-W04-SYMBOLS-VALENCY-GAPS` (new). Statement-level verification stays with `CHEM-FACT-T1A-W04-STATEMENTS` (new); notation preservation stays with `CHEM-PRES-T1A-FORMULAE` (existing).

## Findings (source wording retained; nothing corrected)
- Notation: the extracted text flattens the formulae, and shows the digit zero where the letter O belongs (`0H-` 805, `N03-` 807, `N02-` 809, `C032-` 811, `S042-` 813, `HC03-` 815; also 795 and 825). The DOCX XML carries the digits after symbols as subscripts and the charges as superscripts. Recorded as written; preservation is CHEM-PRES-T1A-FORMULAE's.
- Range note for CHEM-PRES-T1A-FORMULAE: it cites valency rules at 765-791 and the radical table at 793-819. In the indexed text the valency table is 759-783 with explanatory paragraphs 787-789, and the radical table is 801-815 (section 793-815). That item should use these ranges.
- Spellings and symbols as written: `Bramine` (657), `Berylium` (665), `Lithium ... L` (671), `Hydragyrium` (679), `non-metal` (863), `Iron` capitalised (703). En dashes in `Non – metals` (721) and `non – metal` (789).
- The CONTENT list (613-619) names three topics; the body adds a metals/non-metals differences section (719-737) and a radicals section (793-815). Recorded, not moved.
- Weekend question 5 options: line 849 begins `iron (b) gold (c) tin (d) mercury` with no `(a)`; both 847 and 849 carry automatic numbering. Theory lines 857 and 863 begin with spaces and carry no typed letter. Preserved.
- Revision question 827 (classify four changes) concerns Week Three content (lines 497-561); no coverage is claimed for it here.
- Symbols for silicon, manganese, caesium and cobalt and valencies for oxygen and potassium have no row (see coverage). One bounded follow-up: `CHEM-LES-T1A-W04-SYMBOLS-VALENCY-GAPS`. One bounded follow-up for later verification: `CHEM-FACT-T1A-W04-STATEMENTS`.
- Trailing whitespace on 727, 737, 825 and 859; leading spaces on 701, 845, 857, 863. Preserved.

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: `coverage` goes from twenty-one to twenty-eight entries. No other field changed.
- `QUEUE.json`: CHEM-IDX-T1A-W04 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CHEM-LES-T1A-W04-SYMBOLS-VALENCY-GAPS` (LESSON) and `CHEM-FACT-T1A-W04-STATEMENTS` (FACTUAL_DEPENDENCY) inserted after `CHEM-FACT-T1A-W03-STATEMENTS` (PENDING, depend on CHEM-INV-T1A, CHEM-SRC-T1A, CHEM-IDX-T1A-W04); `counts`, `status_counts` (12 implemented / 100 pending / 1 blocked; 113 items) and `next_runnable` recomputed from the items; one note appended. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse with byte-stable re-serialisation; SHA-256 of the archive, member, whole text, week range, scheme row and every section; script check that every non-blank line 609-863 is in a section; DOCX XML scan for drawings, text boxes, tables, equations, scripts, spacer dimensions, sub/superscript runs and list numbering; unique ID and reference checks; kind and status counts and `next_runnable` recomputed from items; diff inspection.

## Remaining
Weeks Five to Ten, the opening block and the revision/examination markers still need their own indexing; formulae preservation, the symbol and valency lesson and the Week Four statement verification are open. Alias approval items stay owner actions. Not executed here. This does not claim the subject or class complete.
