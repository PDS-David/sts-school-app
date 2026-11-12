# YO-WK-T3-W08 — Yoruba 3rd Term Week 8 objective index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains PENDING; tests, importer, runtime and student delivery verification were not run.

## Inputs and reproducibility
- Repository: `PDS-David/sts-school-app`; working branch: `ss1/yoruba-t3-w08-ede-20261112`.
- Source ID: `SS1-SRC-4cc6aae9ed7d`.
- Archive: `SSS 1-20260507T072431Z-3-001 (1).zip`; SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- DOCX member: `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`; SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`.
- Scheme group: `YO-INV-T3.md` lines 61–67, SHA-256 `33511c69113dda8efe27fc0fcae84dae663a74c7258cc7e19689af787454b9f5`.
- Week section: Mammoth raw-text lines 1879–2160, SHA-256 `ab8f624ff32e4d054d2b7ff7e4dd8fbbfecc38d0bef950c4ec5602f2d6c448fc`.
- Additional independent paragraph locators use 1-based `python-docx Document.paragraphs` ordinals. Paragraph text is joined with LF, trimmed at the edges, UTF-8 encoded and SHA-256 hashed. This is a separate locator/hash method; it is not represented as a reproduction of the Mammoth hashes.
- Week 8 paragraphs 941–1073 (section body; DOCX paragraph ordinals) paragraph-text SHA-256 `2cb6f715aaded5a7dbf54fa4ffded3ad459eb290508f950db7584a5cb6db25e2`.

## Coverage added
Added 22 new objective-level records to `yoruba.json`, retaining the three existing scheme-level EDE/ASA/LITIRESO records. They enumerate:
- EDE: two-sided argument, essay procedure, persuasive language/orthography, topic development, and the outline exercise.
- ASA: source-attributed beliefs, funeral practices by circumstance/occupation, the source's special-death account, and the four-case exercise.
- LITIRESO: oral-poetry definition/forms, oku pipe and its themes, iremoje, and the theme/example exercise.
- Combined exercises, all five MCQs individually, and both APA KEJI written responses.

## Paragraph hash ledger
| DOCX paragraph ordinals | Content | SHA-256 |
|---|---|---|
| 941–969 | EDE teaching | `6b77c4a9fb44d020bb46d0dc3fa2eb85acf68d5ba64562bb374565d4b0be0600` |
| 971–973 | EDE exercise | `548c9cb4db10c7e3b1274333dacc7c1218bfa403aa3ae66d34bc5f72710060f0` |
| 975–976 | EDE reading reference | `53e0d1d70579c70165f804d97d0ae3b56929673f2401bece0d50b96207f29806` |
| 979–1011 | ASA teaching | `d4e1b62f1f1ead7797181605427d711aaf7db8811a60aa57119c029866d3f9aa` |
| 1012–1013 | ASA exercise | `261210199122d7101044576a1abe00761ad525351788dd85aeaee99b15a69768` |
| 1016–1047 | LITIRESO teaching | `afcedfc2fe59a9d921db1ee3b93defee7acde68b21a92d6467c420c604b95903` |
| 1049 | LITIRESO exercise | `830c101119bfb3fa9bd5c4511ab410f1d3d1a31e9b3bf5a74d9e32259352865e` |
| 1052–1053 | LITIRESO reading reference | `dfb3fabf169c1f0e4f5ade10076ca4cdcee3a9081694698ab2cd793fffbf38e1` |
| 1055–1057 | Combined exercises | `9ce617b2d4f218893b15ec026562b1da6f848fa81616c0626727a67bd7b97ef7` |
| 1059–1069 | Five MCQs | `a8f93d5b17f46015d0436361ca0eebb67c2749575cf3daee03dd18a44c683ea8` |
| 1071–1073 | APA KEJI written responses | `9f023d5db5a90acecb7f7ae5c8a19841ff9099e721d23cf3586f9c7bd79122cb` |

## Open gaps retained
1. **ASA scheme gaps:** the scheme's child/adult burial, care of the dead and adult burial inside a house are not adequately taught in the supplied body. Cultural attribution and teacher review required.
2. **LITIRESO scheme gaps:** ijala, rara, olele and ege are not taught; igbala-sisin is only listed. Obtain an appropriate oral-literature source and rights-cleared examples/audio.
3. **Assessment gaps:** no source answer key, marks or rubrics; the poem-composition task lacks teaching; two letter-writing MCQs and one funeral-day MCQ are unsupported/off-week; MCQ options omit (c).
4. **External reading:** the cited Adewoyin (2006) pages 182–188 and 106–112 are not in the archive and cannot be checked or reused.
5. **Orthography:** the source is unmarked ASCII. It cannot validate tone marks or under-dotted vowels in authored material; competent Yoruba-language review is still required.

## Checks and limits
- New coverage IDs checked unique against the package; JSON parsed after mutation.
- All exercises and assessment items are enumerated, but no answer keys were invented for source questions.
- No source document, extract, private render, audio file or external textbook was added to Git.
- No schema/typecheck/test/importer/database/API/UI/device validation was run. Verification remains DEFERRED.
- This task indexes Week 8 only. It does not complete Yoruba or certify student readiness.
