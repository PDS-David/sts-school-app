# YO-WK-T1-W07 — Yoruba, 1st Term, Week 7 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 7 is **not delivered**: 11 of its 12 coverage entries are PARTIAL and the twelfth (`YO-T1-W07-ASA-03`) is UNRESOLVED because the benefits named in the topic are never taught. Two lesson items plus one factual-dependency item are appended. Week 7 has **two strands and no LITIRESO section**.

## Inputs
- Base: `ss1/yo-wk-t1-w06` at `7c0e86c` (the corrected Week 6 tip, PR #201), which is stacked on `ss1/yo-wk-t1-w05` at `4dc44d5` (PR #200) and `ss1/yo-wk-t1-w04` at `3d72c04` (PR #199), and on master `f4f0719d57b11fba39b499501060da59efe6532b` (the merge of PR #198, Week 3). PRs #199–#201 are open and unmerged, so this branch is **stacked** and its PR targets `ss1/yo-wk-t1-w06`; it is merged after #199–#201, following the precedent recorded in `ceb9a31` ("Stacked on ss1/yo-wk-t1-w01 (PR #196); merge after #193-#196").
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. `YO-WK-T1-W07` was the `next_runnable` recorded by Week 6 in #201.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): the same mammoth 1.12.2 `extractRawText` output as Weeks 1–6 (1,781 lines) and a top-level walk of `word/document.xml` to locate tables, automatic numbering, VML shapes and media. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…5b4f6af6`) carries **no week numbers and no week markers**. Week 7 has **only two topics**, 18 and 19:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Akoto ede Yoruba` | 43 | `28840fc0…a2030070` | EDE heading line 1507 `AKOLE ISE: AKOTO EDE YORUBA` — word for word apart from the label |
| `Iwa omoluabi ati anfaani re` | 45 | `85727e39…2bcae849` | ASA heading line 1645, word for word (case and label aside) |

- Week 7 has **two strands and no LITIRESO section**, as Week 6 does. Week 8 supplies three topics again (lines 47 `Aroko kiko`, 49 and 51) and has three strands, so the two-topic structure holds only for Weeks 6 and 7.
- Line 47 `Aroko kiko` opens Week 8 (EDE heading 1689 `AKOLE ISE: AROKO KIKO`). The inference for Week 7 is recorded as open item `YORUBA-T1-W07-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).

## Section
- Teaching label `OSE KEJE`, line 1503, SHA-256 `da1345df…75743e88`; section lines 1503–1684, trimmed section SHA-256 `bfab796f…f54a7ef9`, equal to the YO-INV-T1 value. Week 8 begins at 1685 (`OSE KEJO`).
- Parts: `EKA ISE: EDE` 1505–1641 (`f84b2dbd…30d42fb4`), `EKA ISE: ASA` 1643–1667 (`afeefeac…8949d61d`), `Igbelewon` 1669–1677 (`42e1b169…204ba869`), `Ise asetilewa` 1681 (`a00fccf1…f9036f6f`). There is **no LITIRESO part** and the word LITIRESO does not occur in the week.
- Week 7 contains **one Word table**, table 8 (3 columns × 6 rows) at 1513–1639 inside the EDE part: header row `SIPELI ATIJO | SIPELI TUNTUN | IFIYESI`, then five data rows — header plus the dropped-`i` row (1513–1533), doubled consonants (1535–1551), vowel length (1553–1581), syllabic nasal and vowel forms (1583–1605) and word division (1607–1639). The `IFIYESI` (explanation) cell is filled for four rows and **empty** for the fourth.
- Week 7 contains **no other visual object**: no drawing, picture, text box, OLE object, equation, VML shape or media file occurs in the week, and `word/media/` remains empty. Table 8 is the week's only visual object, and its cell structure is recorded under `YORUBA-T1-W07-SOURCE-DEFECTS`.
- 12 paragraphs carry Word automatic numbering and `extractRawText` drops their markers: the eight `iwa omoluabi` items (1653–1667) and the four questions (1671–1677). The eight are numbered as if they formed a procedure, though they are a bare list.
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (12: 11 PARTIAL, 1 UNRESOLVED)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W07-SCHEME-EDE` | Scheme topic 18 (`Akoto ede Yoruba`) bound to the EDE part | 43; 1505–1641 | `28840fc0…a2030070`; `f84b2dbd…30d42fb4` |
| `YO-T1-W07-SCHEME-ASA` | Scheme topic 19 (`Iwa omoluabi ati anfaani re`) bound to the ASA part | 45; 1643–1667 | `85727e39…2bcae849`; `afeefeac…8949d61d` |
| `YO-T1-W07-EDE-01` | `Akoto` defined as the 1974 new spelling; changes announced | 1509–1511 | `287dde53…bc53163d` |
| `YO-T1-W07-EDE-02` | Table 8 introduced; the vowel `i` dropped in `Aiya`, `Aiye`, `Eiye` | 1513–1533 | `bb722d9f…d91e229a` |
| `YO-T1-W07-EDE-03` | Doubled consonants simplified in place names | 1535–1551 | `feaad67e…fc9f5a07` |
| `YO-T1-W07-EDE-04` | Vowel length marked by doubling | 1553–1581 | `2451530c…8a81a0e0` |
| `YO-T1-W07-EDE-05` | Syllabic nasal and vowel forms (`On` to `Oun`, `Enia` to `Eniyan`) | 1583–1605 | `18325f0f…d877508d` |
| `YO-T1-W07-EDE-06` | Word division (`Tani` to `Ta ni`) | 1607–1639 | `4dab716c…4331135c` |
| `YO-T1-W07-ASA-01` | `Omoluabi` defined; the home named as where character is taught | 1647–1649 | `728cc5d4…5db8720b` |
| `YO-T1-W07-ASA-02` | Eight named `iwa omoluabi`, listed without definition or example | 1651–1667 | `e1abf634…abfb9e98` |
| `YO-T1-W07-ASA-03` | **UNRESOLVED** — the benefits (`anfaani`) promised by the topic | 1643–1667; heading 1645 | `afeefeac…8949d61d` |
| `YO-T1-W07-ASSESS` | Four questions and one practical, no key | 1669–1677; 1681 | `42e1b169…204ba869`; `a00fccf1…f9036f6f` |

Full values are reproducible with the method above. Eleven entries are PARTIAL: they record what the source does teach while no deliverable lesson exists and no parsed row identity exists. `YO-T1-W07-ASA-03` is **UNRESOLVED**: the scheme topic and the ASA heading both name `anfaani re` (its benefits), but the word `anfaani` occurs only in the heading at 1645 and the body states no benefit at all. That gap is raised as an OWNER_ACTION open item, not filled.

## Source defects (open item `YORUBA-T1-W07-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 1509–1511 | The definition is a single run-on sentence with `fi enu ko le lori`; nothing states what changed or why, and 1511 has no final stop before the table |
| 2 | 1513–1639 | Table 8: the `IFIYESI` column is filled in only four of the five data rows (none at 1583–1605); its notes are not tied to individual pairs; every cell stacks several forms as separate paragraphs so extraction joins them (`AiyaAiyeEiye`); `Ebute-Meta` is repeated unchanged in the second row; and the fifth row pairs eight new forms with seven old ones, so positional pairing breaks from the third item (`Gegebi` facing `Wi pe`) |
| 3 | 1531 | The note writes a capital `I` for the lower-case vowel (for `i`) and uses curly double quotes — the only non-ASCII characters in the week |
| 4 | 1535–1549 | The place names carry no tone marks and no sub-dot letters (`Osogbo`, `Ogbomoso`, `Ota`), so the spellings the row teaches are incomplete |
| 5 | 1647–1649 | ASA: a two-sentence definition, then a new sentence beginning with lower-case `ise`; `ko eso rode` is garbled, `bii` stands for `bi`, and no benefit of good character appears anywhere |
| 6 | 1651–1667 | Eight bare noun phrases with no definition, example or explanation, and no link back to the definition at 1647 |
| 7 | 1671–1681 | Four questions and one practical, all automatically numbered, with no answers or marks; the practical repeats question 1673; both ask for ten old spellings while the table supplies 24 in five unequal groups (3, 4, 7, 6 and 7) whose last group cannot be paired |

No correction wording is authored here; the lessons must not copy the uncorrected text and must not reuse the table's misaligned rows.

## Notation (open item `YORUBA-T1-W07-NOTATION`)
- Lines 1503–1684 contain **no** tone-marked or sub-dot character: 0 characters in U+00C0–U+024F and 0 combining marks. The only non-ASCII characters are one pair of curly double quotes (U+201C/U+201D) at 1531.
- This is the same document-wide condition as `YORUBA-T1-W01..W06-NOTATION`, but in a week whose subject is spelling it is decisive: the old and new forms in table 8 are exactly where sub-dot letters (`o`, `e`, `s`) and vowel marks belong, so `Osogbo`, `Ogbomoso`, `Ota`, `Olopaa` and `Alaaanu` omit letters the lesson is about, and the difference between `Olopa` and `Olopaa` cannot be seen as a vowel-length change in the orthography the document itself uses.
- No tone mark, sub-dot or other symbol was added or normalised.

## Assessment and missing benefits
- `Igbelewon` (1669–1677) has four questions: the definition of `akoto` (1671), ten old spellings with their new forms (1673), a profile of `iwa omoluabi` (1675) and five behaviours with an explanation (1677). `Ise asetilewa` (1681) repeats question 1673 almost word for word and adds the requirement to explain the change in each. Neither has answers, marking or completion criteria (open item `YORUBA-T1-W07-ASSESSMENT-GAPS`).
- The exercises are not answerable from the text as it stands: the table supplies 24 old forms in five unequal groups and its last group cannot be paired, so ten spellings cannot be selected unambiguously; question 1677 asks for explanations although none of the eight behaviours is explained; and the practical's 1974 attribution is the only date in the week.
- The ASA strand stops at the eighth behaviour (1667): `anfaani` occurs only in the heading at 1645, so `YO-T1-W07-ASA-03` is UNRESOLVED and `YORUBA-T1-W07-BENEFITS-MISSING` (OWNER_ACTION) requires the owner to name an authoritative source for the benefits or to defer them explicitly.

## Queue changes
- YO-WK-T1-W07 → `IMPLEMENTED_TESTING_DEFERRED`; the previous `next_runnable` value is consumed.
- Appended 3 PENDING/BLOCKED items directly after YO-WK-T1-W07: `YO-LES-T1-W07-EDE` and `YO-LES-T1-W07-ASA` (LESSON, PENDING, depending on `YO-SRC-T1`, `YO-WK-T1-W07` and `YO-FACT-T1-W07-DEFECTS`) and `YO-FACT-T1-W07-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED, depending on `YO-SRC-T1` and `YO-WK-T1-W07`).
- Counts: 75 items (from 72), kinds add LESSON 2 and FACTUAL_DEPENDENCY 1; status 13 implemented / 55 pending / 7 blocked; `next_runnable` → `YO-WK-T1-W08`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` updated to Weeks 1–7 (15/15/23/19/14/12/12) and its required action now starts at `YO-WK-T1-W08`.

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items.
- Not approved and not verified. The scheme mapping for Weeks 6–8 is inferred and flagged: Week 7 has two topics and no third, and no objective was invented beyond the source text. The missing benefits are recorded as UNRESOLVED and raised to the owner, not supplied.
