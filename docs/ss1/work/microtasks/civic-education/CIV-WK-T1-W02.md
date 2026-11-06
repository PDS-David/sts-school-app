# CIV-WK-T1-W02 - Civic Education, 1st Term, Week 2 (source-section index)

Status: **IMPLEMENTED_TESTING_DEFERRED** - section index plus coverage records. This item is **not** a lesson and not an approved teaching week. It writes six PARTIAL/UNRESOLVED coverage rows and one blocking open item to `backend/src/db/ss1/subjects/civic-education.json`, whose `package_status` stays `PENDING`; no lesson, SUPPORTED or IMPLEMENTED_EQUIVALENT row, rule, correction, asset or answer was authored. Testing deferred by owner.

## Inputs
- Source `SS1-SRC-fe52495abec9`; member `SSS 1/1st Term SS1_/CIVIC SSS1.docx`, 24,152 bytes, SHA-256 `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a` - recomputed from the supplied standalone attachment, equal to the queue item and CIV-INV-T1.
- Extraction: `mammoth` 1.12.2 `extractRawText` in a private scratch directory; text SHA-256 `5c13b2993572de127842693962da27c4f82085bd11dd1085d8c8015b53d0182d`, 20,117 characters, 511 lines - equal to CIV-INV-T1, so no renumbering was needed. Member, text and extracts stay outside Git.
- Read: `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/subjects/civic-education.json`, `CIV-INV-T1.md`, this subject's `QUEUE.json`, and (as the format precedent) `CIV-WK-T1-W01.md`.

## Locator rule (re-verified)
1-based lines of the `extractRawText` output split on `\n`; a week runs from its marker to the line before the next marker; digest = SHA-256 of the UTF-8 lines joined with `\n`, untrimmed. Week 2 sits between `WEEK TWO` (173) and `WEEK THREE` (211): lines `173-210` = `1dfa4413154b91e1dd63f78e9fede595bea987f5ec3c638d17d9737688377915`, byte-for-byte the queue locator and completion condition.

## Week 2 sections as indexed
| Block | Lines | SHA-256 |
|---|---|---|
| Marker + topic (`WEEK TWO`, `TOPIC: VALUES`) | `173-175` | `1c7c3eba114c69e50322287edc74309c4fd77399c57216a2271ce6879d4c537c` |
| Definition (2 paragraphs, no heading) | `177-179` | `bb52d02e408e4bc91e17ba57d19765237587e7f0d2e4674501d4d74d1d21d275` |
| `TYPES OF VALUE` (heading + lead + 7 items) | `181-197` | `5631ccf5c7dbec2bd36a789be8d0fc6c57a308c4225f4454741022ba80029bbe` |
| - heading + lead | `181-183` | `fc8de27540e9d1261f6c771ee42b2f93f86a780dcf5d813a2cca8b5b7f1990a7` |
| - the seven items alone | `185-197` | `bd4209f49a4f20a4d768c2feb37192d0cc216180ff73c07d84d213a46085bea1` |
| `SELFLESSNESS:` paragraph | `199` | `c43310418d4db13f9e02de1f6fb03fdfbeb6128a1092294667ccf4995f9626fc` |
| `JUSTICE:` paragraph | `201` | `952cecb1be71888e318de06d7dd8c0178d4eac42096e39a51cd004720c3a1bc8` |
| `Assignment` block (heading + instruction + trailing blanks) | `205-209` | `9bd5c88849021f88a9302172254ec560990935c1cdf96a48d3891e963ce1f89e` |
| - heading + instruction | `205-207` | `a716a35d4c65517d6ac37e052164191e9e3475b421685baf7fcb410cceca2042` |
| Blank separators / empty paragraphs | `202-204`, `208-210` | `75a11da44c802486bc6f65640aa48a730f0f684c5c07a42ba3cd1735eb3fb070` (identical three-blank range) |

The 17 non-blank lines are 173, 175, 177, 179, 181, 183, 185-197 (odd), 199, 201, 205 and 207: 1 marker + 1 topic + 2 definition + 2 types heading/lead + 7 items + 1 + 1 + 2 assignment = 17, each in exactly one block, so **no section is discarded**. Even lines are mammoth's blank separators; 203 and 209 are the two empty Word paragraphs (body children 45 and 48).

### Per-line digests (locators for later authoring)
| Line | SHA-256 of the line as printed |
|---|---|
| 173 | `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6` |
| 175 | `3482eb4d9365aa2ae1f69ddb915398242c188e15e618c60196e1f20e6069456a` |
| 177 | `c5d642fead907d87a8a76a4f1807ef894738610d76c0a115817628a858b1bef4` |
| 179 | `8101fa05e044bd448006e00afc1fe146111b058b647dd74363af59a845e2deb8` |
| 181 | `4b15339cf50790fe724e1b32bf58f49ad9ba1861abddfb6cd43a34198b195a72` |
| 183 | `62339f1f87b06f14034c26260a215883b735bf0ae11a0aa27d5dd9a49db3b4a8` |
| 185 | `1a2c494ec75b88f2410e7a213e35639badb5d079d942e0f2009e55ff8a0d33bd` |
| 187 | `7ab6c9148cd6c72c71e0786808b16a13a818014aba7df70ee00af34116111c80` |
| 189 | `a1b14db94434084b789c0069291250652a46b455cbb2b5c347c9231af8ac51b5` |
| 191 | `5f9740dd7874801f460dfe0f92e5be0cf2cfd04088d7d5ab996c92a428d3ee8b` |
| 193 | `9f4024faec10ef6d29aa32d7935d94b1a816fd4fe0359fbf12d49d44b5ff33b8` |
| 195 | `a7851294fc3c91c5e6ea93f773c01b85bc1a6998c2eb3d2c54a0ff77b52112a5` |
| 197 | `336fe12303855aed329bf5124800edc452a05529fd390c4f4616e2ebb4eb4d86` |
| 199 | `c43310418d4db13f9e02de1f6fb03fdfbeb6128a1092294667ccf4995f9626fc` |
| 201 | `952cecb1be71888e318de06d7dd8c0178d4eac42096e39a51cd004720c3a1bc8` |
| 205 | `2615aa9dc055f82c829d331d2d1d4732e32be8b3ce7eb31f27033b956af89df7` |
| 207 | `d7b2d7629a361a364b0707081e771d0d89154d58310a2098df3afbe2133a0a20` |

## Objective candidates (index entries, none claimed as covered)
1. **Definition of values** (`177`): state the civic-education sense of "value" (importance a person or group gives to accepted ideas and beliefs; moral principles guiding interactions). The same line first offers a monetary/non-monetary sense and then restricts to civic education.
2. **Nature, effects and sources of values** (`179`): what values point to (good, constructive things), what they are said to solve, and where they come from (the family, the environment, people).
3. **Types of value** (`181-197`): name the seven types. The list ends "etc.", so the source itself marks it non-exhaustive.
4. **Selflessness** (`199`): define it and illustrate it with the named public figure.
5. **Justice** (`201`): define it (fairness; absence of favouritism, bias, sentiment) and say what its absence does to peace.
6. **Assignment** (`205-207`): discuss at least four values showing their attributes manifestation (an open task, not a question with an answer).

## Scheme promise versus body
Scheme row 2 (lines 19-27, range digest `53761bd10d1892346bec7f084e2894ffd5da8659420eb150ad2144a8a1277e10`; owned by `CIV-PRE-T1`, cited only as the promise): week cell `19` = "2"; label `21` = `VALUE `; `23` = "Definition of values and its source"; `25` = "Types of values/basic human values justice selfishness, honesty"; `27` = "Types of values continued - integrity, faithfulness self control". Against it the body:
- gives a definition and a partial "source" (179), covered by candidates 1-2;
- names seven types but defines two (199, 201); hard work, discipline, love, contentment and integrity are bare labels (187, 189, 193, 195, 197);
- never mentions honesty, faithfulness or self control (they occur only at scheme lines 25 and 27) and teaches "selflessness" where the scheme says "selfishness" - recorded, not repaired.

## Findings the task brief did not anticipate
- **Lines 199 and 201 do not stop mid-sentence.** Both end with a full stop in the text view and in the XML runs (`word/document.xml` body children 43 and 44; 44 is split in four runs, the last being " be at peace."). The brief's truncation claim was not reproduced; nothing was completed or repaired. The honest defects are different: 199 closes with a garbled phrase about "man's humanity against man", and 201's last sentence, as printed, says a society can exist without justice and be at peace, the opposite of its evident sense. Both are preserved verbatim in the private extract only.
- **The Assignment is unkeyed**: "answer", "mark" and "evaluation" occur nowhere in the document, so no answer, mark or guide exists and none was invented. It also asks for attributes, while the body supplies attributes for none of the seven types and a definition for only two.
- **Presentation facts the text view loses** (checked in `word/document.xml` and `word/numbering.xml`): the seven items are one Word auto-numbered `ListParagraph` list (`numId` 5, `lowerLetter`, "%1.", so a. to g.); bold appears only on the markers (173, 175), the `SELFLESSNESS:` label (199) and `Assignment ` (205), not on `JUSTICE:` or the headings 181/183; Week 2 is body children 30-48 with no table, picture, object, hyperlink, tab or break and the package holds no `word/media`, so no asset work arises.
- **Wording defects preserved, not corrected** (pinned by line digest): 177 spaced en dash, "appropriates", "esteem quality of or importance", "setoff"; 179 "these instilled", "a active", "Its emanates", plural "terrorisms"; 183 no terminal full stop; 195 and 207 trailing spaces (195 one, 207 two) and 205 trailing space; 199 "got an unofficial titled"; plus the two defects above.
- **Facts for later verification** (none verified here): the named person, the spelling of his first name, "Late" and the unofficial title at 199; the claim at 179 that values solve corruption, terrorism, cultism, thuggery and robbery.

## Package changes (`civic-education.json`, PENDING)
| Coverage row | Status | Basis |
|---|---|---|
| `COV-CIV-T1-W02-DEFINITION` | PARTIAL | 177-179 and scheme line 23 |
| `COV-CIV-T1-W02-TYPES-LIST` | PARTIAL | 181-197, scheme lines 25, 27 |
| `COV-CIV-T1-W02-SELFLESSNESS` | PARTIAL | 199 |
| `COV-CIV-T1-W02-JUSTICE` | PARTIAL | 201 |
| `COV-CIV-T1-W02-TYPES-UNDEFINED` | UNRESOLVED | five bare labels plus scheme-only honesty, faithfulness, self control, selfishness |
| `COV-CIV-T1-W02-ASSIGNMENT` | UNRESOLVED | 205-207, no key |

One blocking `CONTENT` open item, `CIVIC-EDUCATION-T1-W02-VALUES-GAPS`, names these rows. No row is SUPPORTED: no supplement or original-lesson mapping teaches any of them and the week's wording is defective, so no coverage is claimed beyond indexing. Week 3 (211+) holds types of justice and the importance of values; it belongs to `CIV-WK-T1-W03` and was not indexed.

## Edits
- `QUEUE.json`: `CIV-WK-T1-W02` PENDING -> `IMPLEMENTED_TESTING_DEFERRED` with the computed reference; one note appended; one follow-up item added; `counts` (LESSON 1 -> 2) and `status_counts` (IMPLEMENTED_TESTING_DEFERRED 7 -> 8, PENDING 34, BLOCKED 1) recomputed from the items; `next_runnable` re-derived (W02 removed, the follow-up added, TEST items excluded).
- `civic-education.json` and this file. No other path changed.

## Follow-up (single, bounded)
`CIV-LES-T1-W02-VALUES-TYPES` (LESSON, depends on `CIV-SRC-T1`, `CIV-WK-T1-W02`): original teaching for the five undefined values with a keyed four-value assignment answer, fact verification of the named-person and effects claims, neutral wording, drafting only. Owner choice recorded in the open item: whether honesty, faithfulness, self control and selfishness are taught or kept scheme-only.

## Checks run (authoring only)
Member SHA-256 and size recomputed; text re-extracted with mammoth 1.12.2 and its digest, length and line count equal to CIV-INV-T1; Week 2 range digest equal to the queue locator; every digest in this file generated from the extract; the 17-line accounting; XML structure and numbering checks above; document-wide keyword census. JSON syntax, stable-ID uniqueness, reference integrity and queue arithmetic are checked before commit. Deferred (owner): Zod parse, importer, compiler, tests, typecheck, database, device.
