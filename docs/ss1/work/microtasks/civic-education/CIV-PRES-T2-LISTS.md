# CIV-PRES-T2-LISTS — Word auto-numbering preservation audit

Status: `IMPLEMENTED_TESTING_DEFERRED`. Source-preservation only; no lesson, coverage row, rule, correction, answer, asset, approval or verification was added.

## Verified input

| Field | Value |
| --- | --- |
| Archive SHA-256 | `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` |
| Archive bytes | 35,828,550 |
| Exact member | `SSS 1/2nd Term SS1_/CIVIC.docx` |
| Member SHA-256 | `1e2505c4b9e197087a55e0532c3a6efc7c08765bf1d86697c6720d253d22cdef` (matches the task and `SOURCE_ASSIGNMENTS.csv`) |
| Member bytes | 21,865 |
| Inspected parts | `word/document.xml`, `word/numbering.xml` |
| Method | `python-docx` 1.2.0 paragraph inspection and direct OOXML numbering inspection; source kept outside the repository |

## Findings

- Exactly **86** paragraphs carry `w:numPr`: **10** scheme paragraphs (Word body paragraphs 6–33) and **76** teaching-body paragraphs (paragraphs 71–243).
- They use **17** numbering instances (`w:numId` 1–17); all are level 0 (`w:ilvl=0`). No nested numbering level was found.
- **79** entries use `decimal`; **7** use `lowerRoman`. Every referenced level has `w:lvlText="%1."` and `w:start="1"`. The two Roman instances are `numId=6` (2 entries) and `numId=13` (5 entries). No bullet-format `w:numPr` entry was found.
- Number markers are OOXML numbering metadata, not literal paragraph characters. Plain-text extraction omits them. The original paragraph text is retained in the hash-verified source; this record identifies each numbered paragraph by its exact source locator and its ordinal within the corresponding numbering instance. No ordinal was inserted into source text.
- The task-highlighted lists reconcile exactly: importance of voting = paragraphs 71–75 (Mammoth lines 141–149); forms of electoral malpractice = paragraphs 130–137 (lines 259–273); constitutional demerits = paragraphs 239–243 (lines 477–485).
- The source's incomplete/garbled passages remain unchanged; this task does not complete lines 211, 279 or 461.

## Numbering-instance register

Each row lists the original Word paragraph sequence in order. The Mammoth raw-text locator is the corresponding 1-based line (`2 × paragraph − 1`), matching the established inventory locators. Item ordinals restart within each distinct `numId`, using its Word number format.

| Word `numId` | `abstractNumId` | Format / level | Item order: Word paragraph → Mammoth line |
| ---: | ---: | --- | --- |
| 1 | 13 | decimal `1.`, level 0 | 1. p6 → L11; 2. p7 → L13; 3. p10 → L19; 4. p13 → L25; 5. p16 → L31; 6. p19 → L37; 7. p22 → L43; 8. p26 → L51; 9. p30 → L59; 10. p33 → L65 |
| 2 | 10 | decimal `1.`, level 0 | 1. p71 → L141; 2. p72 → L143; 3. p73 → L145; 4. p74 → L147; 5. p75 → L149 |
| 3 | 3 | decimal `1.`, level 0 | 1. p77 → L153 |
| 4 | 0 | decimal `1.`, level 0 | 1. p85 → L169; 2. p86 → L171; 3. p87 → L173; 4. p88 → L175; 5. p89 → L177 |
| 5 | 16 | decimal `1.`, level 0 | 1. p99 → L197; 2. p100 → L199; 3. p101 → L201; 4. p102 → L203; 5. p103 → L205 |
| 6 | 2 | lowerRoman `i.`, level 0 | i. p107 → L213; ii. p108 → L215 |
| 7 | 4 | decimal `1.`, level 0 | 1. p117 → L233; 2. p118 → L235; 3. p119 → L237; 4. p120 → L239; 5. p121 → L241 |
| 8 | 14 | decimal `1.`, level 0 | 1. p130 → L259; 2. p131 → L261; 3. p132 → L263; 4. p133 → L265; 5. p134 → L267; 6. p135 → L269; 7. p136 → L271; 8. p137 → L273 |
| 9 | 12 | decimal `1.`, level 0 | 1. p149 → L297; 2. p150 → L299; 3. p151 → L301; 4. p152 → L303; 5. p153 → L305 |
| 10 | 15 | decimal `1.`, level 0 | 1. p159 → L317; 2. p160 → L319; 3. p161 → L321; 4. p162 → L323; 5. p163 → L325 |
| 11 | 6 | decimal `1.`, level 0 | 1. p166 → L331; 2. p167 → L333; 3. p168 → L335; 4. p169 → L337 |
| 12 | 7 | decimal `1.`, level 0 | 1. p173 → L345; 2. p174 → L347; 3. p175 → L349; 4. p176 → L351; 5. p177 → L353 |
| 13 | 5 | lowerRoman `i.`, level 0 | i. p191 → L381; ii. p193 → L385; iii. p195 → L389; iv. p197 → L393; v. p198 → L395 |
| 14 | 8 | decimal `1.`, level 0 | 1. p205 → L409; 2. p207 → L413; 3. p209 → L417; 4. p211 → L421; 5. p213 → L425; 6. p215 → L429 |
| 15 | 11 | decimal `1.`, level 0 | 1. p219 → L437; 2. p220 → L439; 3. p221 → L441; 4. p222 → L443; 5. p223 → L445 |
| 16 | 1 | decimal `1.`, level 0 | 1. p232 → L463; 2. p233 → L465; 3. p234 → L467; 4. p235 → L469; 5. p236 → L471 |
| 17 | 9 | decimal `1.`, level 0 | 1. p239 → L477; 2. p240 → L479; 3. p241 → L481; 4. p242 → L483; 5. p243 → L485 |

## Scope and validation

This is a numbering-preservation record, not a rendered-page or student-importer test. It does not correct, complete, renumber, merge or approve any source content. No tests, importer, database or device checks were run; those remain deferred.

- Archive digest and exact member digest both match repository records.
- Parsed all 249 Word body paragraphs and all 86 numbered paragraphs; resolved each `w:numId` through `word/numbering.xml` to its `abstractNumId`, `numFmt`, `lvlText`, `start` and `ilvl`.
- Reconciled the three highlighted list ranges against the existing inventory's Mammoth line locators.

`CIV-PRES-T2-LISTS` is complete as a source-preservation record only. It makes no curriculum-completion, teacher-approval, student-readiness or runtime-verification claim.
