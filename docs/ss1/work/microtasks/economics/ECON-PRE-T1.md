# ECON-PRE-T1 — Economics: 1st Term preamble classification

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only; nothing was run (no schema parse, compiler/plan, test, typecheck, importer, database, device, migration, import or deployment). Base: `origin/master` `697ee2f` at fetch; claim commit by A3. Open claims at start: biology (A2), chemistry (A1), role-tester (T1); no agent branch had touched Economics in the previous three hours. Open PRs were not checked. Prerequisites `ECON-INV-T1` and `ECON-SRC-T1` are `IMPLEMENTED_TESTING_DEFERRED`.

## Inputs
- Archive `docs/ss1/sources/SSS1-original.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (checked).
- Member `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc`, 1,264,128 bytes, SHA-256 `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc` (re-verified after extraction to private scratch; nothing from it is committed).
- Text: word-extractor 1.0.4 `getBody()`, 53,430 characters, 1,060 lines (823 non-blank), SHA-256 `026eeec9b2b8a68bba6bed3719a921e08030d56b2bb4cfdafd40352133e5037e` (equal to ECON-INV-T1). Line numbers are 1-based over that text split on `\n`; block hashes are SHA-256 over the stated lines joined with `\n`, UTF-8, no trailing newline, edge blank lines trimmed; lines keep trailing spaces and tabs. `<TAB>` marks a tab.
- Authoring checks only: the importer's `WEEK_MARKER` pattern was applied to the extract in Python to list the parsed week labels and to confirm the two anchors fall in no parsed row. The importer, compiler and schema were not run.

## Opening block, lines 1-43 (SHA-256 `619fc6e5db6827df8bd4ce0289b0b59be7b207c8daa798c1f42fdd2fb9fb8a9b`, equal to ECON-INV-T1)

| Lines | Content | SHA-256 | Disposition |
| --- | --- | --- | --- |
| 1-17 | blank except line 3, a lone tab | — | separator |
| 18 | `FIRST TERM E-LEARNING NOTE` | `a85bde6fd6d2022b18ecfd09c17b8f7561ddecd2bfc198ba2c0bbdccb98ccb29` | R002 (SCHEME_ONLY), `COV-ECON-T1-TITLE` |
| 20 | `SUBJECT: ECONOMICS` + 7 tabs + 6 spaces + `CLASS: SS1` | `fa487c23f4fed8db1f00e1a89a47bf5229726026f32f15a4ecee9659d4aeaef7` | registered `header_text`, anchor of the existing alias rule -R001 |
| 22 | `SCHEME` | `3bcf428c8e53cab52ae6a9e570ce3b1f15a19c3d842ec482e866c4e76e0dc843` | R002 |
| 24 | `WEEK<TAB>TOPIC ` (one trailing space) | `0a7bcefdb62032fcabc408940fc69708f54b2d2b8d2daa70f3af30be038a450e` | R002 |
| 18-24 | title block | `8de89c4335f671cb5200d758745472a34f45ad219fd18da9c440e054fb1eb7f4` | `SS1-SRC-2ab0c50bcab6-R002` |
| 25-36 | scheme lines (next table) | `c89bc5024417b437280cf2a534aecf0ce5975865620c3a00ae747237cfae1116` | mapped in `COV-ECON-T1-TITLE`; lines 24-36 with the header `0f6909d39c1b1a1488935604f59ace2b45823507d9d95d0786428aa5f6d5a03f` |
| 38-41 | `REFERENCE BOOKS` and three titles | `8f7569b944d06de85311a8bb2e3b7e11ea589cab05fbe38df8286d816ad23f60` | `SS1-SRC-2ab0c50bcab6-R003` / `COV-ECON-T1-REFERENCES` |
| 42-43 | blank | — | separator before `WEEK ONE` (line 44) |

Compiler preamble value: the text before the first parsed body label (`WEEK ONE`, line 44, offset 757) hashes to `02206a3b8b2495e54ea6d712b40eb8e873228ac2feda19e35a02adad4538d521`. This is the value `PREAMBLE_REQUIRES_COVERAGE` will hold for `text.slice(0, index of the first body)`; it was computed by slicing, not by running the importer. It differs from the 1-43 line hash above only by the trailing newline.

## Scheme lines 25-36 mapped to the week items
Twelve lines carry **thirteen week numbers**: line 36 combines weeks 12 and 13. Earlier records that say "thirteen rows" count week numbers, not lines. Rows 1-6 print no week number; rows 7-13 print one, so the mapping of rows 1-6 rests on order alone and the numbering is not inferred.

| Scheme row | Line | SHA-256 of the line | Text (verbatim) | Body marker line | Queue item |
| --- | --- | --- | --- | --- | --- |
| 1 | 25 | `e811a525b79a7903f2d0737fb7a1805b26f22afc701b88ef9172d3806bddb78a` | `Meaning of Economics.` | 44 `WEEK ONE` | `ECON-WK-T1-W01` (done; `COV-ECON-T1-W01-SCHEME-1`) |
| 2 | 26 | `ecdc1ba4b1e9b6b47cd65abab598132f35c55339f9827136c2504dcb85c8083c` | `Economics as a Science, Arts or Social subject.` | 117 `WEEK TWO` | `ECON-WK-T1-W02` (done; `COV-ECON-T1-W02-SCHEME-2`) |
| 3 | 27 | `406edde4a273ff0af00c0135ad94681a7874b88f5f4f23f41b9c8aebb5492afe` | `Basic Concept of Economics.` | 172 `WEEK THREE` | `ECON-WK-T1-W03` |
| 4 | 28 | `57434201fe14cacb2aa52c759239e8803047ae84659c0aeefc4978b63b7261b1` | `Importance of Opportunity Cost to an Individual, Firms and the Government.` | 250 `WEEK FOUR` | `ECON-WK-T1-W04` |
| 5 | 29 | `692439e2f674e373b72da542d8202f861809d94b910ff68242ac7cbd9f83c5ff` | `Basic Economic Problems of the Society.` | 302 `WEEK FIVE` | `ECON-WK-T1-W05` |
| 6 | 30 | `35ed60144d63885e510df1d0bffa3856a6b67d41e132834e81b99847e50c5364` | `Basic Tools for Economics Analysis.` | 372 `WEEK SIX` | `ECON-WK-T1-W06` |
| 7 | 31 | `5c30f9566ba667f8c61a23e4cc0bdaf1961bb49a6d69d1817fe15a350ed29462` | `7.   Data Collection and Presentation.` | 618 `WEEK SEVEN` | `ECON-WK-T1-W07` |
| 8 | 32 | `0f5b4f0c138244adf7ab5717adca8f9c3f91f48a0a20ecca1f0bc4cd66e3c453` | `8    Theory of Production.` | 800 `WEEK EIGHT` | `ECON-WK-T1-W08` |
| 9 | 33 | `ee7504a4b064cf9dd9fabeb37c8820b881bcff356e4254f27a9042c51b98dacd` | `9.   Land as a Factor of Production.` | 899 `WEEK NINE` | `ECON-WK-T1-W09` |
| 10 | 34 | `02eb68647d16894993addf04791c28870b7aa3df02ed1f852f4cf6bb692b7918` | `10. Labour as a Factor of Production` | 985 `WEEK TEN` | `ECON-WK-T1-W10` |
| 11 | 35 | `d673ac0d09177a92ac329bad6d88442368522b61c2dd9e0d620570f66c434fc7` | `11. Revision.` | none | `ECON-MARK-T1-REVEXAM` |
| 12 & 13 | 36 | `f0d3d25c7129aee0e275a82702154515638082512e2d9020c587a114ab9716eb` | `12 & 13. Examination.` | none | `ECON-MARK-T1-REVEXAM` |

The extract has exactly ten parsed bodies (`WEEK ONE` to `WEEK TEN`) and no `WEEK ELEVEN`, `TWELVE` or `THIRTEEN` marker. Row 4 names the individual, firms and the government, while the Week Four topic line (251) reads `Importance of opportunity cost to individual`; recorded, not corrected.

## Reference list, lines 38-41
`REFERENCE BOOKS` (38) and three unnumbered titles: `Amplified and Simplified Economics for Senior Secondary School by Femi Longe` (39, ends with two trailing spaces, included verbatim in the anchor; line hash `f64e42292aa63a1c8021446003886b9c82a9740cc51170e547598f8d9e7ada9c`), `Comprehensive Economics for Senior Secondary School by J.V. Anyaele` (40, `66dfe6e5c42179bc50d813364340e509ec3a6ef4ca180655ccf531bf550214f4`) and `Fundamentals of Economics for SSS By. R.A.I. Anyanwuocha` (41, `c2e819b6a5f846a1a42bd79828fc684824ff1138a0afc544a4b3c6ddca76a3ac`). No edition, publisher or year is stated. The author names also recur inside the week bodies (Longe on 10 lines, Anyaele on 1, Anyanwuocha on 2); those lines belong to the week items.

## Edits
- `backend/src/db/ss1/subjects/economics.json`: two `classify_marker` rules, `SS1-SRC-2ab0c50bcab6-R002` (anchor `FIRST TERM E-LEARNING NOTE`, once in the text) and `-R003` (the 219-character reference block, once in the text), both `SCHEME_ONLY` and matching no parsed row; two `MARKER` coverage entries, `COV-ECON-T1-TITLE` (targets R002; also carries the scheme mapping) and `COV-ECON-T1-REFERENCES` (targets R003). No lesson, week coverage, correction, asset or open item added; the existing alias rule `-R001` and its pending owner confirmation are unchanged; `package_status` stays `PENDING`.
- `QUEUE.json`: `ECON-PRE-T1` to `IMPLEMENTED_TESTING_DEFERRED`; `status_counts` and `next_runnable` recomputed from the items; one note appended. Nothing depends on this item, so no new item became runnable.
- This file. No other subject, shared schema or compiler file touched.
- Authoring checks only: JSON parse and round-trip, anchor occurrence counts, field and enum shape against `subjectPackageSchema.ts` read by eye and by a Python check, queue recount.

## Remaining
Rows 11 and 12 & 13 stay with `ECON-MARK-T1-REVEXAM`; rows 3-10 stay with `ECON-WK-T1-W03` to `W10`. Open from this item: the importer's treatment of the two rules is unverified (testing deferred), and the earlier "thirteen rows" wording in `ECON-INV-T1`, the queue objective and the Week 1 and Week 2 scheme evidence counts week numbers, not lines; it was left unchanged. This does not claim the subject or class complete.
