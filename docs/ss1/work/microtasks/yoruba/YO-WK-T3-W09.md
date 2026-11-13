# YO-WK-T3-W09 — completed source-week objective and exercise index

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is source indexing only. No lesson, Yoruba correction, tone/sub-dot normalisation, answer key, mark allocation, parser rule, schema change or compiler change was authored.

## Integrity and extraction

- Source: `SS1-SRC-4cc6aae9ed7d`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`
- Member size: 68,373 bytes; SHA-256: `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3` (verified directly from the attached ZIP).
- Existing Mammoth 1.12.2 extractRawText locator retained: 63,445 characters, 2,463 lines.
- Week label `OSE KESAN-AN`: Mammoth line 2161, char offset 46059.
- Whole teaching section: lines 2161-2312; SHA-256 `f26fc75fd0e48893b4579f2fb6ae3f46e2b68a3e82618fd03c56eede41b240e4`.
- Scheme group 9: lines 69-73; SHA-256 `a15ef24840b5fdfd282028fa7f03210b94a9a475c53a98fe406811d2b98de9f7`. The scheme is flat and unnumbered; the week-to-group mapping is positional, as recorded by YO-INV-T3.
- For sub-block and question hashes, a second reproducible locator is recorded: 0-based paragraph indices in the original DOCX, using python-docx `paragraph.text` exactly, preserving paragraph order and tabs; SHA-256 is over UTF-8 of the selected paragraph texts joined with LF. These are not represented as Mammoth hashes.

## Objective-to-body mapping

| Scheme strand | Exact source scope | Body result |
|---|---|---|
| EDE: akaye oloro geere; read passages, answer questions, identify difficult words | scheme lines 69-73 | Two reading passages and 15 MCQs are present; no separate difficult-word list, gloss or vocabulary exercise is present |
| ASA: Yoruba funeral customs, burial of kings and notable persons | scheme lines 69-73 | ASA ISINKU NI ILE YORUBA / ISINKU OBA ATI ABAMI EDA; Alaafin burial is used as the example |
| LITIRESO: collection of proverbs from WAEC/NECO set text | scheme lines 69-73 | Body instead contains two prose comprehension passages under LITIRESO; no proverb collection or analysis is present |

## Full section inventory

| Block | Mammoth lines | Original DOCX paragraphs | Paragraph-text SHA-256 | Inventory |
|---|---:|---:|---|---|
| Week marker / AKAYE 1 | 2161-2179 | 1080-1089 | `cdb32f49b54311d276c132a13e2200217a86b31c44b978ece0ce67aba8f59912` (1081-1089) | Passage about Yoruba culture, dance and masquerade; five MCQs |
| AKAYE 2 | 2181-2209 | 1090-1103 | `671de38c8baf69b853187f3de63f30b5eb44ec8f7170087bf54783dc54ea8e45` | Passage about Bola, gifts/bribery, workplace robbery and police investigation; ten MCQs |
| ASA: king burial | 2211-2245 | 1105-1122 | `0f25899877d219c995bcd418ba2704dcfd9dda99459241ff734bdc63b02c6e63` | Historical description of Alaafin burial, rites, grave goods, attendants and modern changes |
| LITIRESO heading/reference | 2249-2255 | 1124-1130 | `75baff2d1fcfcddaf5f01e324541852e571e6f82bebf5c7c82cc156fbeabd102` | General reading heading and reference to Eto Iro ati Girama fun Ile-Iwe Sekondiri Agba, p.75 |
| LITIRESO passage 1 | 2259-2277 | 1131-1139 | `14d2101e68fdbb7d08bc8779bc6b25c937fbcb4f16071d8c3a8d1c0089d96f0f` | Igba oye/harmattan passage; five MCQs |
| LITIRESO passage 2 | 2281-2305 | 1140-1152 | `7d536647aa8555c6698c2d32c422923d86cc70672efbf70477e2d100e1a56d4c` | Karonwi neighbourhood robbery passage; five MCQs |
| APA KEJI | 2307-2311 | 1153-1154 | `3708b8680f7987c1e7ac9a500e8189e07c6fb35a4d0236ebbdc0752364e4ff8f` | One written question: explain the burial of a king |

## Exercise-by-exercise inventory

Every question has an exact DOCX paragraph locator and an individual SHA-256. The associated Mammoth line range is the section range shown above.

| Exercise | DOCX paragraph | SHA-256 | What it tests |
|---|---:|---|---|
| EDE passage 1 Q1 | 1085 | `befd1ba5b8d17588a7cf8b666d3c36474c6fed7e1d7201897f31d2e40cc1ff98` | Identify an item not listed as part of culture in the passage |
| EDE passage 1 Q2 | 1086 | `91d29484f0d1883f833f920e7884a4d1ceb0cbfbfbbe4cc2ce214c88b7ba8970` | Circumstance in which dancing occurs |
| EDE passage 1 Q3 | 1087 | `bb497e197cd5216cd26b995a5ad35043f43715a77705d01c8b68cac1a98c5960` | Group said to entertain children in the past |
| EDE passage 1 Q4 | 1088 | `a8bcf09623341bb500e70df4fea34401c5519382dfe362180a9ea13e7c8fc0c0` | Pronoun reference in the passage |
| EDE passage 1 Q5 | 1089 | `f1a5fc93b3b6644cc8a739b5928a94c261741c9ce999f7457d29b88f717d4429` | Best title for the passage |
| EDE passage 2 Q1 | 1094 | `30eb78b7804726c99fc6d79591fa1beadba3f1e0834b5a9a9e9c4ce2f2e6a042` | What Bola was blessed with |
| EDE passage 2 Q2 | 1095 | `3906b08ad30b063c7aa4c0b01a5118c199c3b85476e5fb7de7da7af8853136f0` | Bola's workplace |
| EDE passage 2 Q3 | 1096 | `e2c7e0edc5e4162fa82176ad76edad491af3cef5cdace4dae289b9859c71d30d` | Ajike's age at marriage |
| EDE passage 2 Q4 | 1097 | `cf3f1d674fdaf0da821a9d471c5b249e7120854ccb99fcbd9e4628a03cebd06a` | Bola's supervisor |
| EDE passage 2 Q5 | 1098 | `03d644dc9d193a6952bcea5d604ec20f50dc08e1f0cde9df3a93d748f22e8f2e` | Why Bola refuses gifts from certain customers |
| EDE passage 2 Q6 | 1099 | `15eebd8e9b8b5ae12a292a603866242c32f4ea217dc91075f9fcf73085ee3425` | Referent of “onitohun” |
| EDE passage 2 Q7 | 1100 | `4025406e996d9aa3ba1c194e5402fc38d06a5aa65abc6e56d0c1119fbf850306` | Character described by a letter as a particular type |
| EDE passage 2 Q8 | 1101 | `81621fafbbbad02540bfdcbd12e6ee28b8b6dd6606da56e6f8a4948e259ab1d9` | Pronoun reference |
| EDE passage 2 Q9 | 1102 | `71e68d37c35c100bd6030307e45d6a5550abd15b87669334231830ff02596cd2` | Occupation of Ootoleke |
| EDE passage 2 Q10 | 1103 | `feb82f50ec460ad5a22a8014ef3f24516efceaae87db5cda935bbecc8ca4db71` | Select the true statement |
| LITIRESO passage 1 Q1 | 1135 | `465613f4104b3800f9383e548cebfbe98a7e03c5410ded110d82408055a1554f` | Why the narrator prefers harmattan to the hot season |
| LITIRESO passage 1 Q2 | 1136 | `4f9b66b7bd2d2ad5fb4f3b5b5d9e5474503c863c74e435af21c8332ce731f32f` | Identify an effect that is not a harmattan problem |
| LITIRESO passage 1 Q3 | 1137 | `93c5903e1261331edebda5c0f711e216e94e1ede64fc0419ea72752aed12af77` | Why fruit trees produce less during harmattan |
| LITIRESO passage 1 Q4 | 1138 | `cd041ce6b7e9c5656a5ecf06aa54482f6bae33233d556df65033206b949e82fe` | Identify a benefit not stated in the passage |
| LITIRESO passage 1 Q5 | 1139 | `541d179f470ab0737d797dab32cbead31ddd442be665fdf5be33db9cf8b34fd3` | Identify what is not a harmattan disadvantage |
| LITIRESO passage 2 Q1 | 1148 | `45f1bda5b40b37b95e62efcf06e7ea2913776c365c3e3e90f49e2f43c47965a4` | Select the true statement about Karonwi |
| LITIRESO passage 2 Q2 | 1149 | `ab0a409a4afeef356555eecb0be24318690588d4ba7fba92e0d7cbab8c8df4e4` | What robbers do when gunfire fails to frighten residents |
| LITIRESO passage 2 Q3 | 1150 | `543e311692e5b359639a7fc2c1dd9bdecd866917ad3f909d0f701eb701bac806` | Synonym for the underlined expression |
| LITIRESO passage 2 Q4 | 1151 | `bd694df2b3753d49374a044ec9a798113898ee4a0d2103b4b1456a8bd7bc438c` | Weapon not used by residents |
| LITIRESO passage 2 Q5 | 1152 | `83c955c0e66cde23906b8c934251c0cd01eb4c72e18cd0f25d24bd70a137f4f9` | Best title for the passage |
| APA KEJI Q1 | 1154 | `366c4e4ed505103caeea301582c84a9d5b405ee9976494ca3b162e7e5d7b1467` | Explain the burial of a king |

**Count:** 26 exercise items (15 EDE MCQs, 10 prose-comprehension MCQs under the LITIRESO heading, one written APA KEJI prompt). No answers, keys, marks or rubrics are present in the source.

## Exact content gaps and cautions

1. The EDE scheme also requires identifying difficult words, but no vocabulary list or gloss appears in either passage.
2. The LITIRESO scheme requires proverbs from the WAEC/NECO set text; the body contains two prose comprehension passages. The assigned text and proverb collection are not identified.
3. The ASA passage describes historical Alaafin burial practices including human sacrifice, attendants and grave goods. It also states that practices have changed in modern Oyo. This is indexed as a source description only; it is not independently verified and must not be presented as current practice or endorsed.
4. The entire registered third-term document contains no Yoruba tone marks or sub-dot letters (YO-INV-T3). This index does not insert or normalise diacritics.
5. The source has no answer key or marks for any of the 26 exercises.

## Package and queue changes

- Added source evidence to the eight existing Week 9 coverage entries; no lesson IDs were added because no lesson was authored and no parsed-row identity exists.
- Updated `YORUBA-T3-W09-LIT-SCHEME-MISMATCH` with direct DOCX evidence.
- Added precise open items for missing EDE vocabulary, assessment keys, missing orthography and ASA historical-context review.
- Added four follow-up lesson tasks (EDE comprehension/vocabulary, ASA burial customs, LITIRESO reading passages, and the missing proverb objective) and three blocked factual dependencies (notation, prescribed literature source, ASA historical context).
- Marked `YO-WK-T3-W09` `IMPLEMENTED_TESTING_DEFERRED`.
- No schema/compiler/parser changes; no lesson or answer was authored. Package remains `PENDING`.

## Verification boundary

No tests, typechecks, parser/compiler runs, importer/database/device checks or classroom verification were performed. The archive/member hash, DOCX paragraph hashes, exercise count and exact mismatch evidence were checked during indexing only. Testing deferred by owner.
