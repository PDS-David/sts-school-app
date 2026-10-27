# FM-PRE-T1 — Further Mathematics, 1st Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `f9dc3c339baf49dacc042b21d2978b8309b8058c` (origin/master). No open PR touched this item; the SS1-03 and queue branches carry no unmerged diff; no `AGENTS.md`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Member `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc`, SHA-256 `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145` **verified**, 1,460,736 bytes; source `SS1-SRC-e9efc9a976ed`; equals `SOURCE_ASSIGNMENTS.csv`.
- Method, all private and outside Git: (1) `word-extractor` 1.0.4 (the repo's pinned `^1.0.4`), `extract()` then `getBody()`, the importer's own call, plus `getHeaders({includeFooters:true})`, footnotes, endnotes, annotations and text boxes; (2) LibreOffice headless conversion to a 41-page PDF, page images viewed, `pdfimages` and `pdftotext`. Line numbers below are 1-based lines of `getBody().split('\n')`. The importer, compiler and parser were not run.

## Hash-accounted non-week text (SHA-256 of the lines joined with `\n`)
| Block | Lines | Content | SHA-256 |
|---|---|---|---|
| PRE-01 | 1–17 | whitespace only (one tab) | `9f74d6012b6c38112b9539b7691348d917629dcf526c9af20b9d4718a204de15` |
| PRE-02 | 18 | `SUBJECT: … CLASS: SS1` header | `ba6b921ca029659e316df01f2df97758947120ad364a823c669bd43b502258e5` |
| PRE-03 | 19–22 | `SCHEME OF WORK` and `WEEK / TOPIC` header | `e034b736fd8d52aae674b9651dd34b71b950baf20d2f524ec9b5532a26e4656c` |
| PRE-04 | 23–41 | scheme weeks 1–10 | `1ac1371f6ebd4d398483f7eb039b7bf39b9381eeaf95ea17add0015809e7e415` |
| PRE-05 | 42–44 | scheme 11 Revision, 12 Examination | `444f7b4ffe4c682586d81db3160fa9290b8cfb71bd4ef831917866eb3f1d6998` |
| PRE-06 | 45 | blank | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| PRE-07 | 46–48 | `REFERENCE(S)` and two textbook titles | `dc0862daf4d7f686874d3d9e30865d495d6fe60ad3e7fc26fd228c9bac58f15d` |
| PRE-08 | 49–64 | whitespace only | `886760af898381620a8980841c646ae70e894b5292c3138e6dfd75b6904deffb` |
| all | 1–64 | whole preamble; `WEEK ONE` starts at line 65 | `5becbc18e830bc1dfacbc216948c760244a12de88d0bb826fb035e5dd7cb14aa` |
| header/footer story | n/a | running page header/footer text | `4bf24f3ec818d84477a212b376aa64b8f73853d8004fa857985964b414ed15b3` |

Mapping: PRE-02 → source `header_text` and `RULE-FM-T1-ALIAS`; PRE-04 → row-level `COV-FM-T1-R00..R10` (PARTIAL; objective binding belongs to FM-WK-T1-W01..W10); PRE-05 → `COV-FM-T1-EXAM` / `RULE-FM-T1-SCHEME-EXAM` (anchor occurs once); PRE-07 → **new** `RULE-FM-T1-REFERENCES` (SCHEME_ONLY) and `COV-FM-T1-REFERENCES` (MARKER), because the existing exam marker covers scheme items 11–12 only; PRE-01, 03, 06, 08 are whitespace or table headings with no teaching content; header/footer story → open item `OI-FM-007`. Footnotes, endnotes, annotations and text boxes are empty. The anchors for the header, exam rule, revision rule and reference rule each occur exactly once in `getBody()`. Compiler dispositions for the new rule were not generated (importer deferred).

## Header verification
**Matches.** Line 18 equals the registered `header_text` exactly and occurs once; it names Further Mathematics, class SS1. The package's old locator "line 2" does not use `getBody()` numbering; the explanation now says so.

## Week-to-scheme-topic list (verbatim scheme wording; parsed-row ids from SS1-03 `parsed_rows.json`, not recomputed)
| Wk | Scheme topic (lines 23–40) | Body row(s) by label and title |
|---|---|---|
| 1 | Indices: Basic Laws & Application of indices | row 0 `WEEK ONE` INDICES (line 65) |
| 2 | Indicial and Exponential Equations | row 1 `WEEK TWO` (line 173) |
| 3 | Logarithms - Laws and application | row 2 `WEEK THREE` LOGARITHM… (line 333) |
| 4 | General review of basic concept of set theory | row 3 `WEEK FOUR` REVIEW OF BASIC CONCEPT OF SET, 107 chars, heading only (line 752) |
| 5 | Operation of sets and Venn diagrams | rows 4 and 5, both labelled `WEEK FIVE`: SETS (line 755) and OPERATION OF SET AND VENN DIAGRAMS (line 1097) |
| 6 | Review of First Half Terms Lesson & Periodic Test | row 6 `WEEK SIX` revision questions (line 1344) |
| 7 | Binary operations and basic laws of binary operations (i) Definition (ii) Solution of simple problems on binary operations (iii) Closure, commutative, associative and distributive laws | row 7 `WEEK SEVEN` (line 1398) |
| 8 | Binary operations continues: (i) Solution to problems on laws of binary operations (ii) Identity and inverse elements of a given binary operations (iii) Addition and multiplication tables for binary operations | row 8 `WEEK EIGHT:` (line 1550) |
| 9 | Surds: (i) Definition of surds (ii) Rules and manipulation of surds (iii) Rationalization of surds at the denominator and equality of surds. | row 9 `WEEK NINE` SURDS (line 1653) |
| 10 | Measures of central tendency: (i) Mean, Median and Mode of grouped and ungrouped data (ii) Estimation of mode from the histogram of a grouped data. | row 10 `WEEK TEN` (line 1915) |
| 11 | Revision | scheme only (no body row) |
| 12 | Examination | scheme only (no body row) |

Observation for the week items, not decided here: the scheme's Week 4 topic (set theory review) has only a heading row in the body, and the substantive Sets content sits under a second `WEEK FIVE` label, so scheme Week 5 has two body rows. FM-WK-T1-W04/W05 and `FM-FACT-T1-W04-STRANDED-LABEL` own that question.

## Letterhead and vendor branding: **present** in the 1st Term
The queue said the 1st Term had no such record. It does. None is text in `getBody()` output.
- Rendered page 1: an image-only cover (one picture; logo, tutor name "MR OSHO TUTORS", a tagline, a vision statement, an e-learning offer and personal contact details).
- Rendered page 2: a letterhead picture above the SUBJECT line (logo, tutor name, tagline, contact details).
- Running page header/footer text `MR OSHO/1ST TERM/FURTHER MATHEMATICS/SS1 Page N`, found by exact text search on 40 of 41 rendered pages (page 1's footer is visible in the render).
- Picture fingerprints of the JPEG streams in the private PDF render (render derivatives, not hashes of the bytes embedded in the `.doc`): cover `1b626625…9a14`, letterhead `aeb4455b…aa9f` (full values in the private render only).
- Contact details are deliberately not reproduced here. Other pictures in later pages are week figures, not preamble; they belong to the FM-VIS figure items.

## Edits
- `further-mathematics.json`: appended a re-read sentence to `SS1-SRC-e9efc9a976ed` header evidence; added rule `RULE-FM-T1-REFERENCES`, coverage `COV-FM-T1-REFERENCES`, open item `OI-FM-007` (PERMISSION, blocking). `OI-FM-004` and all other entries are unchanged. No lesson, correction or asset touched.
- `QUEUE.json`: FM-PRE-T1 → IMPLEMENTED_TESTING_DEFERRED; added PENDING `FM-VIS-T1-BRANDING`; `FM-FACT-VENDOR-PERMISSION` now also depends on it; counts recomputed; `next_runnable` set to the first dependency-satisfied item in queue order.

## Remaining
- `FM-VIS-T1-BRANDING`, then the owner decision in `FM-FACT-VENDOR-PERMISSION`.
- `OI-FM-004`'s text still says the 2nd and 3rd Terms only; `OI-FM-007` supplements it.
- The 1st Term week items (FM-WK-T1-W01..W10) and `FM-FACT-EQUATION-LOSS-T1` are now unblocked; 30 PENDING items have satisfied dependencies. Same-file edits should run one at a time: next in order is `FM-PRE-T2`.
