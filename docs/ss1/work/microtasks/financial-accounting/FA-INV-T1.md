# FA-INV-T1 — Financial Accounting, 1st Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** — the 1st Term inventory is complete. No lesson, coverage entry, rule, correction or asset was written.
Testing deferred by owner. No tests, typechecks, importer/plan runs, database/device checks, migrations, imports or deployments were run.

## Inputs
- Starting master `1eb2800` (PR #181 and PR #182 merged by the owner while this item was in progress; the work began from `85af71f` and does not touch the English files those commits changed); the task prompt's reviewed base was `0ee6033d…`. No branch or PR for FA-INV-T1 existed (GitHub API listed no open SS1 Financial Accounting PR); no other agent owned this item.
- Archive `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — re-verified this run against the attachment.
- Member `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`, 1,166,213 bytes, SHA-256 `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb` — verified and equal to `SOURCE_ASSIGNMENTS.csv` and to source `SS1-SRC-cf77df509ac3` (registered by FA-SRC-T1). Member path retained verbatim.
- Text extracted privately with `mammoth.extractRawText` (1.12.2) and the structure probed with JSZip; nothing from the source, no extract and no render is committed. Locators are 1-based lines over the extracted text split on `\n`; a section hash is SHA-256 over its lines joined with `\n`, UTF-8.
- Whole text: 41,252 characters, 1,691 lines, 625 non-blank, SHA-256 `8b5d32570047a689876a556a6492f95d6a6c1847413aef9d34b04e15a74b7686`. Non-ASCII is limited to U+201C (47), U+2013 (43), U+2019 (14), U+201D (8), U+2026 (3), U+2018 (2).

## Sections (seven labels for ten scheme weeks)
| ID | Exact label | Lines | Body SHA-256 |
|---|---|---|---|
| preamble | `FIRST TERM E-LEARNING NOTE`, header, `SCHEME OF WORK` | 1–41 | `e8216daeefd734c242a6668155d9109764b35a99e523a9f88940b361fd6b6ecd` |
| W01 | `WEEK ONE` — `INTRODUCTION TO BOOK – KEEPING AND ACCOUNTING` | 65–263 | `9c7f09369d4ed8878008d314426d26e60575fde599764f2cd6b6e1849d6f7e17` |
| W02 | `WEEK TWO` — `TRANSACTIONS – MEANING AND CLASSIFICATION` | 269–347 | `6bcefda712dc427ebb06d9a36e94486f9487f8829cad683a6b1cdf5f744cdab4` |
| W03 | `WEEK THREE` — `BOOKS OF ACCOUNTS` | 353–517 | `ceeb81718319d69d21106826a24d61b37019705f3c03069fd7620e14219c403e` |
| W04-05 | `WEEK FOUR AND FIVE` — `DOUBLE ENTRY BOOK – KEEPING` | 523–797 | `a9835d1ba8b04e5d6ed12873b5432401a59063a75bd2ed58225739e3b701a481` |
| W06-07 | `WEEK SIX AND SEVEN` — `BALANCING OFF LEDGER ACCOUNTS` | 803–1027 | `927b5d524c2ec95cd05d42b90cff629d2c374703bc40db0601efaec9ec298d0c` |
| W08 | `WEEK EIGHT` — `SOURCE DOCUMENTS` | 1037–1205 | `20ea54a908f75691bf2e112399f1b732be013da720c914a3a04128760c8f9ffd` |
| W09-10 | `WEEK NINE AND TEN` — `SUBSIDIARY BOOKS` | 1211–1689 | `28935bdc83d87e366f6c096d5abec25287788aa44fdcf23292366ece106546c5` |

Every section carries a `TOPIC:` line (67, 271, 355, 525, 805, 1039, 1213) and a `CONTENT` list; the topic is not stranded as in the Economics source.

## Scheme of work (lines 41–61)
Seven rows for ten weeks: `Introduction to Book-Keeping and Accounting` (row 1, **no literal number**), `2 Transactions – Meaning and Classifications`, `3 Books of Accounts – Layout and Formats`, `4 - 5 Double Entry Principle: …; Combinations of Cash and Bank Account`, `6 – 7 Balancing of Ledger Accounts; extraction of the Trial Balance`, `8 Source Documents: …`, `9 -10 Subsidiary Books: …`. Separators are mixed (hyphen in `4 - 5`, en dash in `6 – 7` and `9 -10`); the header row is `WEEK\tTOPIC ` with a trailing space. There is **no revision or examination row and no revision/examination section anywhere**: `EXAMINATION` occurs only inside prose at 723 and 961. A revision heading therefore cannot erase teaching here; nothing needed a `classify_marker` rule.

## Parser findings (recorded only; no rule added)
- `split_before` candidate: exactly seven `WEEK <WORD>` lines at 65, 269, 353, 523, 803, 1037 and 1211, upper case and alone on the line. Three are compound (`WEEK FOUR AND FIVE`, `WEEK SIX AND SEVEN`, `WEEK NINE AND TEN`); no numeric `WEEK 1` form occurs. Scheme rows (45–61) must not split, and row 1's missing number means a scheme row cannot be recognised by its number.
- `attach_stranded_label` candidate: every `TOPIC:` line is already attached beneath its marker; what needs attaching is the `CONTENT` bullet list to its section. The 260 numbered-list entries are bullets, not headings.
- `classify_marker` candidate: none. `GENERAL EVALUATION QUESTIONS` blocks (765, 995, 1173, 1655) are assessment blocks inside the teaching sections, not calendar markers; they are part of their section bodies.
- Table flattening: only three real `w:tbl` exist — table 0 is a 1×1 empty cover shell, table 1 is the one-row eight-cell ledger header (`Date|Narration|Folio|Amount|Date|Narration|Folio|Amount`), table 2 the one-row five-cell journal header (`Date|Narration|Folio|Details |Totals`). All other layouts are tab text plus drawn rules.
- Drawing anchors arrive as `w:pict` with VML: 136 `<v:line>` rules across 32 drawing paragraphs and 3 straight arrow connectors (paragraph 235). Rule counts per group are in the visual items; `word-extractor`/`mammoth` give the labels but not the geometry.

## Assessment blocks (all inside the teaching sections)
`EVALUATION` at 185, 229, 311, 485, 727, 765 (`GENERAL`), 867, 895, 981, 995 (`GENERAL`), 1105, 1155, 1173 (`GENERAL`), 1299, 1645, 1655 (`GENERAL`); `READING ASSIGNMENT` at 237, 319, 493, 757, 987; `WEEKEND ASSIGNMENT` at 243, 325, 499, 779, 1009, 1187, 1669; `THEORY` at 257, 513, 793, 1023, 1685 (printed `THOERY` at 1201); no answer key is printed for any objective or weekend item.

## Figures, tables and media
- Real tables: 3 (see above). Drawn rulings: 136 `v:line` across these groups —
  - Week 2 classification tree (299–307; labels `Transactions` / `Cash Transactions` / `Credit Transactions`; 2 diagonals, paragraph 151). `FA-VIS-T1-W02-T03-DIAGRAMS`
  - Week 3 path of transactions (467–481; labels at 471 and 481; 3 arrow connectors, paragraph 235). Same item.
  - Week 3 ledger format box (385–415; table 1 plus 9 rules, paragraph 193) and journal format box (431–465; table 2 plus 6 rules, paragraph 221). `FA-VIS-T1-W03-FORMATS`
  - Week 4–5 solution: ten ledger-account boxes, 2 rules each (paragraphs 295, 302, 309, 317, 324, 330, 337, 345, 351, 355) at 573–718. `FA-VIS-T1-W04-TACCOUNTS`
  - Week 6–7: Cash Account 2 + 6 rules (paragraphs 420, 425) at 843–863; Trial Balance 3 + 6 rules (paragraphs 464, 475) at 921–953; a ruling-only 2-rule box with no cell text (paragraph 482) at 969. `FA-VIS-T1-W06-RULING`
  - Week 9–10: six book layouts, 80 rules (paragraphs 698, 704, 705, 725, 731, 750, 770, 780, 792, 809) and 1,083 tab characters: cash book 1393–1419, purchases journal 1449–1493, sales journal 1497–1531, returns outwards 1537–1567, returns inwards 1579–1605, general journal 1613–1631. `FA-VIS-T1-W09-COLUMN-LAYOUT`
- Embedded media: `word/media/image1.jpeg` 870,389 bytes SHA-256 `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a` (the same publisher advertisement bytes as the Economics 1st Term source) and `word/media/image2.jpeg` 106,321 bytes SHA-256 `e0c6cda049555ab63895f065db5ff6daa1fa6227e6da97ea5ae2c053d3d33581`; both anchored before the title (paragraphs 5 and 16) with an empty text box (paragraph 4) and table 0. Publisher adverts, not teaching; do not commit, do not use as assets. `FA-VIS-T1-PUBLISHER-MEDIA`
- Page breaks: 4 (paragraphs 5, 272, 747, 788) — before the title, before Week Three, and two inside Week 9–10 (before the purchases-journal total at 747 in document order and before the returns-outwards total at 788). Typographic, not section boundaries.
- Footer: `mr osho /1 ST TERM/FINANCIAL ACCOUNT/SS1 Page 1` (footer2; the stray space inside `1 ST` is in the source). Headers are empty. Six superscripts (`st` ×3, `th` ×3) are in ordinals.

## Preservation and factual findings (each has an item)
- Columns: two-sided ledgers, folio, `c/d`, `b/d`, contra `c`, the `Trial Balance as at …` heading and Dr/Cr columns, journal `Details`/`Totals` — `FA-PRES-T1-COLUMNS`. No lesson may reflow a ledger into prose or drop a side.
- Currency and dates: plain capital `N`, thousands split as `39, 900` / `2, 270, 800`, date forms `July 1`, `Jul 3`, `Jul10`, `31st July, 2016`, `April 2016` — `FA-PRES-T1-CURRENCY`; quoted amounts keep the printed spacing.
- Wording, kept distinct from any correction: `TOPIC: INTRODUCTION TO BOOK – KEEPING …` (67), `interprete` (93), `bankdrafts` (293), `The recording into the Ledger are done …` (379), `The recording of financial transactions into the Journal does not follow the double entry principle` (461, an unverified claim), `… credit the account that gives values.` (555), `Enter the data` for date (835), `Invoics` (1067), `Credit not` (1075), `THOERY` (1201), `T, Okediran` (1407), `financial transitions` (1689), `Returns Outward` singular (637, 677) — `FA-PRES-T1-SOURCE-WORDING`.
- Dated and regulatory claims: Pacioli 1494, Royal Niger Company charter 1886, ICAN 1 Sep 1965, ANAN 31 Jul 1979 as the `second professional accounting body`, the regulator set CBN/NDIC/SEC/CAC/NSE and LSBIR/FBIR (169–179), and the 2016 illustration dates — `FA-FACT-T1-DATED-REFERENCES`. Each needs a primary citation or an explicit unverified flag; dated examples are dated illustrations, not current law or rates.
- Worked answers: Week 4–5 postings and balance (Cash 64,000/64,000, balance 39,900), the trial balance at 111,000 debit and 111,000 credit, Week 9–10 totals (purchases 2,270,800; sales 692,200; returns outwards 166,430; returns inwards 89,775; cash book 201,000/239,000). Read-and-check arithmetic agrees on every total recalculated this run. Two issues must be settled by reading, not assumed: the Returns Outwards account dates the S. Dauda entry `Jul 12` (665) although the transaction (566) and the S. Dauda account (677) date it 21 July; and the N8,400 sundry-expenses cheque sits in an undetermined cash-book column in the flattened text, where the printed balances place it in the Bank column. Both stay open in `FA-FACT-T1-ARITHMETIC`.
- External material: five reading assignments to `Simplified and Amplified Financial Accounting` (pp. 1–7, 16–17, 41, 20–27, 80–94) and `Business Accounting 1` (pp. 21–38, 37–48; exercises 3.6, 3.9A, 3.10A, 3.11A) plus `Simplified … Exercise 7, 8x and 9`; neither textbook is in the archive. `FA-FACT-T1-EXTERNAL-MATERIALS` forbids claiming their content.
- Content gap (not corrected here): the scheme (55) and the Week 4–5 CONTENT list (533) promise `Combinations of Cash Account and Bank Account`, but the section never teaches the cash book; the two-column cash book appears only as a Week 9–10 illustration (1393–1419). `FA-WK-T1-W04-W05` must record it as a precise open item plus a small lesson task.
- No password, credential, executable instruction or unsafe step was found; all figures are illustrative Naira examples.

## Edits made by this item
- Appended to `docs/ss1/work/microtasks/financial-accounting/QUEUE.json` 20 items, each `PENDING`, with dependencies `FA-INV-T1` + `FA-SRC-T1` (plus specific week items for the two factual checks): `FA-PRE-T1`, `FA-WK-T1-W01`, `FA-WK-T1-W02`, `FA-WK-T1-W03`, `FA-WK-T1-W04-W05`, `FA-WK-T1-W06-W07`, `FA-WK-T1-W08`, `FA-WK-T1-W09-W10`, `FA-VIS-T1-W02-T03-DIAGRAMS`, `FA-VIS-T1-W03-FORMATS`, `FA-VIS-T1-W04-TACCOUNTS`, `FA-VIS-T1-W06-RULING`, `FA-VIS-T1-W09-COLUMN-LAYOUT`, `FA-VIS-T1-PUBLISHER-MEDIA`, `FA-PRES-T1-COLUMNS`, `FA-PRES-T1-CURRENCY`, `FA-PRES-T1-SOURCE-WORDING`, `FA-FACT-T1-DATED-REFERENCES`, `FA-FACT-T1-ARITHMETIC`, `FA-FACT-T1-EXTERNAL-MATERIALS`.
- Set `FA-INV-T1` to `IMPLEMENTED_TESTING_DEFERRED` with the evidence above; recomputed `counts` (28 items) and `status_counts` (4 implemented, 23 pending, 1 blocked) and `next_runnable` (21 eligible); appended a queue note.
- No lesson, coverage entry, correction, asset or parser rule was written; the package and every other subject, shared file and test file are untouched.

## Checks run
Hashes (archive, member, whole text, preamble and seven section bodies), JSON syntax of the queue, unique IDs, every `depends_on` resolving to an existing item, counts and status counts recomputed from the items, and `next_runnable` recomputed from dependency eligibility (all 21 listed items are eligible; no ineligible item is listed). Diff reviewed: only the queue's notes, counts, status counts, the FA-INV-T1 record and the appended items changed.

## Not done
No tests, typechecks, importer/plan run, database or device check, migration, import or deployment (deferred by owner). No merge. Financial Accounting stays a separate subject; it was not merged into Bookkeeping. The week count and labels above are what the document contains; no lesson or coverage was inferred from a scheme row.
