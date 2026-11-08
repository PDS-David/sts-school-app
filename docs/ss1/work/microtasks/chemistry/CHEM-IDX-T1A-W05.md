# CHEM-IDX-T1A-W05 — Chemistry, 1st Term WEEK FIVE indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `f821528f2948a08a110a564665324f8adb721346`. `docs/ss1/work/AGENT_PROTOCOL.md` was followed. CHEM-INV-T1A and CHEM-SRC-T1A are `IMPLEMENTED_TESTING_DEFERRED`. CHEM-IDX-T1A-W05 was `PENDING`; `git log origin/master --grep=CHEM-IDX-T1A-W05` returned nothing; no `origin/agent/*` branch had touched chemistry in the last three hours.
- Archive `docs/ss1/sources/SSS1-original.zip` SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — **verified**. Member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`, 2,187,976 bytes, SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` — **verified**. Extracted only that member, to private scratch outside the repository. Nothing from the source is committed.
- Text read with `mammoth` 1.12.2 `extractRawText`: 55,382 characters, 2,129 lines, SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702` — equals the task.
- Locator re-check: lines 868-1115 joined with `\n` hash to `0928fd18ab69956502440832da5e87685c9c54ffc584ef53a8763eb6dccfb31d`, equal to the locator. `WEEK FIVE` is line 869; `WEEK SIX` is line 1117.
- DOCX XML scan of the body children from `WEEK FIVE` (child 434) to `WEEK SIX` (child 558): 8 `a:blip`, all 70-byte 1x1 PNG spacers (decoded); 16 `w:drawing`; no `w:txbxContent`, `w:pict`, `w:tbl`, `m:oMath`, `w:object`, hyperlink or field; `w:vertAlign` runs: 247 baseline, 25 subscript, 4 superscript (29 non-baseline runs in the formulae at 925, 941-949, 971-975, 985, 1015, 1077, 1089 and 1091); 32 paragraphs carry automatic numbering.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `extractRawText` text split on `\n`; a section runs from its first to its last non-blank line; SHA-256 over the UTF-8 lines joined with `\n`. The item's own ranges include trailing blank lines (for example 883-901); the ranges below stop at the last non-blank line. Whitespace-only line 1095 (three spaces) counts as a blank separator, as in CHEM-IDX-T1A-W01.

## Section index (lines 868-1115)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK FIVE label | 869-869 | `700c30e110b71fbdb4d6aaa0ea0a922cb9d63b799643acd01e32055226c62598` | marker line |
| TOPIC: COMPOUNDS AND MIXTURES | 871-871 | `149400f37cd8676cac2c884c40580425280151651e978bdaa48e431450b91bdc` | topic line |
| CONTENT | 873-881 | `0c3fa2ca674e41f47037df6821ca4ac8fff2ef2d65eb1acc89c8fec9a5436cc6` | four entries: `COMPOUND` (875), `FORMULAE OF COMPOUNDS` (877), `MIXTURES` (879), `DIFFERENCES BETWEEN COMPOUNDS AND MIXTURES` (881); the body also has `PROPERTIES OF A COMPOUND` and `WRITING FORMULA FROM VALENCIES`, which the list does not name |
| COMPOUND | 883-899 | `34a1b028fc3dc9ac82ece008daccca3d9ebbe8c94a056df1dcae195c276be5c8` | heading; definition (885, two sentences); lead-in (887); tab-separated table 889-899 of five compounds with constituent elements (no formulae) |
| PROPERTIES OF A COMPOUND | 903-913 | `6d04cb5511c71b001940a9b615aa8e35b52e7fc4db89a3748e4ef57ed0f58ce9` | heading; five automatically numbered statements (905-913) |
| EVALUATION 1 | 917-921 | `b691cbc2bbef78de6b82c6f082c9d445cd9c9b8bec7c00fe44d4a49e4f94ffbc` | 2 questions (919, 921); line 917 has trailing whitespace |
| FORMULAE OF COMPOUNDS | 923-949 | `3a4d69295cdbdf8e8f37d0118a9550929b9c9b3dc9c50cf8bc4fec33f1d31ab4` | heading; molecule notation (925); three formula-writing statements (927-931); `Examples` (935); tab-separated table 937-949 of six compounds with formulae; the formulae are flattened and some use the digit zero as typed |
| WRITING FORMULA FROM VALENCIES | 953-985 | `0a06cd2e7c6e482fcd526067e87d4406757391974d2bd9730215640a4e598438` | heading; lead-in (955); four rules (957-963); two worked examples (969-975 sodium tetraoxosulphate(VI); 979-985 calcium chloride) as tab-separated text |
| EVALUATION 2 | 989-993 | `2883400705473b568614eb2b6b08f4a48c5e57f45c41934c255ffa964ed21a1f` | 2 questions (991, 993) |
| MIXTURES | 997-1021 | `b10f1109f4f0974ed8dacbf323b53f436dd8d85fb2b46400d3e42bf32d46e960` | heading; definition (999); lead-in (1001); tab-separated table 1005-1021 of eight mixtures with constituents; trailing whitespace on 1015 |
| DIFFERENCES BETWEEN MIXTURES AND COMPOUNDS | 1027-1055 | `8535e239c195df7407f2cec8ec444ad3d6d71d1eadbeb29eb4af01a347a06893` | heading; two-column header (1029); four typed points wrapped over many short lines (1031-1055), with a line-break hyphen in `repre- / sented` (1045-1047); text, not a Word table; trailing whitespace on 1035-1043 |
| EVALUATION 3 | 1059-1065 | `6da9147a626260e90ed17a38c3eb3a07d9b6d6f5bac57c5b26c88441287bae3b` | 3 questions (1061, 1063, 1065) |
| READING ASSIGNMENT | 1069-1071 | `2f100fb05023501d4b8e5bbd7e7321ad410699baab52e8f597fe5fb392d54f41` | one textbook reference with pages (1071); not supplied, not copied |
| GENERAL EVALUATION/REVISION | 1075-1079 | `d0c294b9192fb11d06613e18a6563ffbad36aeaf29c52171d3c4fbb9a1ed8268` | 2 questions (1077, 1079); trailing whitespace on 1077 |
| WEEKEND ASSIGNMENT | 1083-1093 | `6ef80407ee09b9a8cf065c3416de0d6915c7c2578a99163b2b9aaf990bf33843` | heading with a trailing tab and space (1083); 5 objective questions with options (1085, 1087, 1089, 1091, 1093); no answer key; line 1095 is whitespace-only |
| THEORY | 1097-1111 | `cea874b47e50d4e326b1262b88bf5ef10d0b9514211c1ada0e029b480410c508` | 1099 `1. a. Define (i) Compound (ii) Mixture`; 1101 b; 1103 `2. a.` four differences; 1105 b `What is the formula of`; 1107, 1109, 1111 items i)-iii); typed letters and numbers, no automatic numbering |

Every non-blank line from 869 to 1111 belongs to a section above (checked by script); lines 1112-1116 are blank or whitespace-only. Nothing is discarded.

## Exercises (indexed, not answered)
- **EVALUATION 1 (917-921):** 919 `Define a compound.`; 921 `Give three examples of a compound.`
- **EVALUATION 2 (989-993):** 991 `Write the formulae of; (i) tetraoxosulphate(vi) acid (ii) Magnesium Chloride`; 993 `State three properties of a compound`.
- **EVALUATION 3 (1059-1065):** 1061 `List five (5) compounds and their formulae`; 1063 `What is a mixture?`; 1065 `State four differences between compound and mixture`.
- **READING ASSIGNMENT (1069-1071):** 1071 `New School Chemistry for SSS by O.Y Ababio. Pg 11, 36 to 37`; not supplied and not copied.
- **GENERAL EVALUATION/REVISION (1075-1079):** 1077 `State the valency of the following elements and radicals: Na, K, S, O, SO42-, NO3-, CO32-`; 1079 `Write the formula of:` four compounds (lead(II) tetraoxosulphate(VI), hydrochloric acid, sodium trioxocarbonate(IV), calcium hydroxide).
- **WEEKEND ASSIGNMENT (1083-1093):** five objective questions (1085 which is a mixture; 1087 which is a compound; 1089 the formula of ammonia; 1091 the formula for sand; 1093 whether compounds are always heterogeneous or homogeneous). None has an answer key or mark.
- **THEORY (1097-1111):** 1099 `1. a. Define (i) Compound (ii) Mixture`; 1101 `b. Give two examples each of compound and Mixtures`; 1103 `2. a. State four differences between compound and mixture`; 1105 `b. What is the formula of`; 1107 `i) tetraoxosulphate (vi) acid`; 1109 `ii) Ammonium sulphide`; 1111 `iii) Sodium tetraoxophosphate`.
- No answer, marking guide or mark allocation exists anywhere in the week. None is authored here.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Compound: definition and examples (883-899; questions 919, 921, 1087).
2. Properties of a compound (903-913; questions 993, 1093).
3. Formulae of compounds: notation and examples (923-949; questions 1061, 1089).
4. Writing a formula from valencies (953-985; questions 991, 1079, 1105-1111).
5. Valencies and formulae asked for but not given: hydrogen (acid formulae), the tetraoxophosphate radical, sand and silicon (991, 1107, 1111, 1091) — **no supporting text**.
6. Mixtures (997-1021; questions 1063, 1085, 1099).
7. Differences between mixtures and compounds (1027-1055; questions 1065, 1093, 1103).

## Scheme mapping and coverage
- Scheme row 5 (line 55, `COMPOUNDS AND MIXTURES` with a trailing space, SHA-256 `be2dc61771dfc361f0c67e14b0eb33c4c57105e462bf5c0f7c898a2e045e8500`) equals the week's topic line 871 after the `TOPIC: ` prefix and maps to this week by title and order. The scheme has no sub-items.
- Package change: **eight** coverage entries in `chemistry.json`, none with lesson ids: `COV-CHEM-T1A-W05-SCHEME-5`, `-COMPOUND`, `-PROPERTIES`, `-FORMULAE`, `-FORMULA-WRITING`, `-MIXTURES`, `-DIFFERENCES` (PARTIAL) and `-FORMULA-GAPS` (UNRESOLVED). All still block delivery. The package stays `PENDING`; no coverage beyond indexing is claimed.
- Open item for the UNRESOLVED entry: `CHEM-LES-T1A-W05-FORMULA-GAPS` (new). Statement-level verification stays with `CHEM-FACT-T1A-W05-STATEMENTS` (new); notation preservation with `CHEM-PRES-T1A-FORMULAE` (existing; its ranges 935-949 and 953-987 for this week agree with this index).

## Findings (source wording retained; nothing corrected)
- Notation: the digit zero stands where the letter O belongs in `02` (925), `H20` (941), `C02` (945), `S04` (971, 975) and `Na2S04` (975) and in `C02` at option (a) of 1091; `Ca(NO3)2` (949), `CO2` (1015), `SO42-`, `NO3-`, `CO32-` (1077) and `SO2`, `NO2`, `SiO2` (1091) use the letter. Line 1077 therefore writes the same radicals differently from Week Four's table (`S042-`, `N03-`, `C032-`). The DOCX XML carries the digits after symbols as subscripts and the charges as superscripts. Recorded as written; preservation is CHEM-PRES-T1A-FORMULAE's.
- Missing support (see coverage): no valency row for hydrogen in Weeks One to Five; no tetraoxophosphate radical; no formula for sand and no valency for silicon. Oxygen and potassium (asked at 1077) are already recorded in `COV-CHEM-T1A-W04-VALENCY-GAPS`. Supported across weeks, for orientation only: sodium (Week Four 771), magnesium (773), chloride (767), hydroxide (805), trioxocarbonate(IV) (811), tetraoxosulphate(VI) (813), ammonium (803).
- Numeral case and naming differ as written: `(VI)` (969), `(vi)` (991, 1079, 1107), `Carbon (iv)oxide` (1007), `Lead II chloride` (947), `Lead (ii) tetraoxosulphate (vi)` (1079); `homogenous` (913, 1031); `chemogeneous` (1093); `alkanol` (1013).
- The CONTENT list (873-881) names four topics; the body adds `PROPERTIES OF A COMPOUND` (903) and `WRITING FORMULA FROM VALENCIES` (953). Recorded, not moved.
- The differences block is two-column text wrapped over short lines with a line-break hyphen (`repre- / sented`, 1045-1047) and a capital `Formula.` at 1049; theory items are typed (`1.`, `a.`, `i)`), not automatically numbered. Preserved.
- Trailing whitespace on 917, 925, 1015, 1035-1043, 1077, 1083 and 1111; leading tabs or spaces on many table lines (937-949, 1029-1055, 1101, 1105, 1111). Preserved.
- One bounded follow-up for the gaps: `CHEM-LES-T1A-W05-FORMULA-GAPS`. One bounded follow-up for later verification: `CHEM-FACT-T1A-W05-STATEMENTS`.

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: `coverage` goes from twenty-eight to thirty-six entries. No other field changed.
- `QUEUE.json`: CHEM-IDX-T1A-W05 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CHEM-LES-T1A-W05-FORMULA-GAPS` (LESSON) and `CHEM-FACT-T1A-W05-STATEMENTS` (FACTUAL_DEPENDENCY) inserted after `CHEM-FACT-T1A-W04-STATEMENTS` (PENDING, depend on CHEM-INV-T1A, CHEM-SRC-T1A, CHEM-IDX-T1A-W05); `counts`, `status_counts` (13 implemented / 101 pending / 1 blocked; 115 items) and `next_runnable` recomputed from the items; one note appended. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse with byte-stable re-serialisation; SHA-256 of the archive, member, whole text, week range, scheme row and every section; script check that every non-blank line 869-1111 is in a section; DOCX XML scan for drawings, text boxes, tables, equations, scripts, spacer dimensions, sub/superscript runs and list numbering; grep over Weeks One to Five for hydrogen valency, phosphate, silicon and sand; unique ID and reference checks; kind and status counts and `next_runnable` recomputed from items; diff inspection.

## Remaining
Weeks Six to Ten, the opening block and the revision/examination markers still need their own indexing; formulae preservation, the formula-gap lesson and the Week Five statement verification are open. Alias approval items stay owner actions. Not executed here. This does not claim the subject or class complete.
