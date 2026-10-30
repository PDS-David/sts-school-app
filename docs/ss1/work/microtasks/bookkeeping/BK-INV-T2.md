# BK-INV-T2 — Bookkeeping, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `6862d45` (`Merge pull request #230 from PDS-David/ss1/yo-wk-t2-w07`), fetched at start. One open PR (#229, Yoruba) and no `ss1/bk-inv-t2*` branch; neither touches Bookkeeping. `AGENTS.md` is absent. BK-INV-T2 was `PENDING` on this master.
- Prerequisite **BK-SRC-T2** is `IMPLEMENTED_TESTING_DEFERRED`; `backend/src/db/ss1/subjects/bookkeeping.json` already registers source `SS1-SRC-97c1db5b1eb0`. Package not edited here.
- Original: member `SSS 1/2nd Term SS1_/Book keeping.docx`, **38,245 bytes**, SHA-256 `c8c75f55e327d7d3e6ece6b3caca2ea841d3d3a45d324ceb221843c265157af3` — hashed before any conversion; equals the required member hash. It was read from the per-term archive `2nd_Term_SS1_-20230730T171417Z-001.zip` (member path inside it: `2nd Term SS1 /Book keeping.docx`). The composite archive was **not** supplied, so its hash was not checked.
- For comparison only, the 1st Term member (SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`) was read from the supplied 1st Term per-term archive.
- Method: `word/document.xml` parsed with the Python standard library in a private scratch directory; tab-rounded text and table cells read from the XML; mammoth 1.12.2 `extractRawText` used only to obtain the importer's own text view, with the importer's `WEEK_MARKER`/title logic replicated in a scratch script. Nothing from the document is committed; no importer, plan, test, typecheck, database or device command was run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0–220; block 221 is `w:sectPr`; 222 children). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation (so `w:tab` is omitted, unlike mammoth). Range hash = SHA-256 of block texts first..last inclusive joined with `\n`, empty blocks included.

Whole body, blocks 0–220: `31d2a6ba26971e8592078e9730ac070100a7f3ddaa88d3da77134d0781207e4f`.
Importer view (mammoth raw text): 9,506 characters, 673 lines (267 non-empty), 0 conversion messages, SHA-256 `286837fdb7d0235faaee92af9501b9001272f0d92c7317d89ba498c2392f94a5`.

## Week inventory (4 teaching weeks)
| Week | Exact label | Label block | Blocks | Label sha256 | Range sha256 | Parsed title | Body chars | Parsed body sha256 |
|---|---|---|---|---|---|---|---|---|
| 1 | `"WEEK ONE " (trailing space)` | 31 | 31–87 | `d6daf1e694c6b67d3872739f78e9ed66d657349d3adba8de1bdc261001e1fef8` | `0aa3088772e53f5e135529b39c31129af5dee4b4019ac1cdfb0758aaa96cf6d3` | `"1.0.\tTopic: Single Column cash book"` | 1,934 | `e4dbc7a1ff59d4a1fe5da4b9ff975ab60c94df281e8774f5bf2330ddc21d7ccd` |
| 2 | `"WEEK TWO"` | 88 | 88–109 | `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6` | `ed00cfec8ef42cc9b1b02f35df0d866d77d2b5560db48a295b3e35dff3496218` | `"DOUBLE COLUMN CASH BOOK"` | 1,148 | `bb5f26395bbe6ce4bae80f128748821df86b6895d8a4a4e87ead79c6d31f2e4b` |
| 3 | `"WEEK THREE"` | 110 | 110–158 | `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` | `f82efa6d2cfe027ab42113ec3d4781f3852d5b91a9527aff9863f286a0b58997` | `"CONTRA ENTRY"` | 1,555 | `194de4c5fde3e27a5596871b7a860b26a5456eaedf0d3c24ab31f89e2132eb8a` |
| 4 | `"WEEK FOUR"` | 159 | 159–220 | `3c43507c7d6178122a308f5e7ede8deda1dd2dfab7a0beebb4601d6d26ea10c2` | `02636ad0bc25b5fc42757c9dba5ea99c2f6b483301d7b5c5f72b478c8b5d86e7` | `"PRINCIPLE OF DOUBLE ENTRY"` | 3,833 | `890fb8fac8b6f9b6cf32bfe5fc5a3e21bcd464e447b214ac1a9eb9d7128f8409` |

Replicated importer offsets in the mammoth text: 959, 2,907, 4,065 and 5,667 (each at a line start). Per-week sections:
- **Week 1** — label 31; topic 32; introduction/NOTE 34–35; CASH ACCOUNT 37; Illustration 1 statement 38–48; T-account 49–58; BANK ACCOUNT 59; Illustration 2 statement 60–68; T-account 70–81; blanks 82–87.
- **Week 2** — label 88; heading 89; meaning 90; accounting entries 91–93; example instruction 94–95; placeholder year `19x9` (96); nine dated transactions 97–105; blanks 106–109. **No solution.**
- **Week 3** — label 110; heading 111; definitions 112–114; (a) cash to bank 115–116; flattened Effect/Action 117–119; example 120–121; table 123; folio-"C" note 125; (b) withdrawals 127–128; Effect/Action 131–133; example 134; table 136; blanks 137–158.
- **Week 4** — label 159; heading 160; definition 161; three rules 162–165; application 167–173; illustration 175–176 (eleven answered rows); posting 178–183; illustration statement 185–206 (twenty June transactions); ASSIGNMENT 208–218; blanks 219–220. **No solution and no answers.**

## Other sections and objects
- **Preamble, blocks 0–30** (range hash `4adb4f4b5643b1c3ad04e7e0b8b82f9849d93ee0a0fd9ac0ab5350294af3e527`; the 959-character mammoth opening, SHA-256 `74432c33823e083b135e5b4b6ce3f19ee99ed6f67d90d8841a84b0e26fef0b8c`): `SIGMA TERM` (0), `SCHEME OF WORKS` (1), the scheme header `SUBJECT: BOOK-KEEPINGCLASS: SS 1 ` (2), stranded ` TOPIC` (3), and twelve manually numbered scheme entries with dashed sub-items (4–30). No `w:numPr` in blocks 0–30. All precede the first `WEEK` marker, so the parser leaves them outside every row.
- Scheme-to-body mapping (observation about this file only): entries 1 and 11 `Revision.` (blocks 4, 29) and 12 `Examination` (30) are markers with no body; entries 2–4 → Week 1; 5–7 → Week 2 (**sub 15 "Difference between single column cash book." has no teaching**; subs 16 and 18 have only an unsolved example); 8 → Week 3; 9–10 → Week 4.
- **Tables (3, all real `w:tbl`):** block 123 (4×10; block-text sha256 `50f7bcab93db04a2fa33854ba34f46d6e95918e4455540913256e0bd02990bb8`), block 136 (3×10; `bc543e99e8376f0fe5228f6c3310772051ac2dcd1c71bb8bb96202015256fcc7`), block 176 (12×4; `35d1163dd177a22a8987a9ff139ad68ad22462b43b152e07172182d5a834597a`). By cell position 123 is Dr Bank / Cr Cash and 136 is Dr Cash / Cr Bank (correct contras).
- **Drawings:** no `word/media`, image, OLE object or equation. Eight VML objects in five paragraphs: block 50 (connector pair = Cash T-account ruling), 57 (two groups = double rule), 71 (connector pair = Bank T-account), 80 (one group = double rule), 171 (`Right Brace 1`). No header/footer part.
- The "Effect / Action Required" pairs at 117–119 and 131–133 are paragraph text, not a table; blocks 117 and 131 have identical text (`1db4bc45a5efc035e858390ba776222e60cb197f34071115e157e232365c432c`), so cite the index.

## Comparison with the 1st Term source (observation, not a duplication ruling)
Every week label, week range hash and parsed week body hash equals the 1st Term source's. The block lists differ only at block 0 (`SIGMA TERM` vs `FIRST TERM`) and the scheme header (one block in 1st Term, split into blocks 2–3 here), which shifts later block numbers by one. Document properties differ: created 2016-01-26T13:32:00Z here vs 2020-05-30T10:24:00Z, modified 2020-05-30T12:08:00Z vs 2020-05-30T10:24:00Z; 7,825 vs 7,824 characters. Whether this is the intended 2nd Term document stays with the owner (`BOOKKEEPING-T2-TEXT-MATCHES-T1`); no duplicate coverage is linked and no 1st Term entry was changed. The title `SIGMA TERM` is recorded as a finding, not as proof of the term.

## Structural rule findings (findings only; no rule written)
- `split_before`: not needed and not usable. The four labels are standalone line-start paragraphs and `WEEK_MARKER` (`backend/src/db/ingestTopics.ts`, `const WEEK_MARKER`) already accepts spelled-out numbers, giving exactly 4 matches; `backend/src/db/ss1/compiler.ts:23` restricts `week_label` to digits, so a split rule could not be written for `WEEK ONE`. Label 31 carries a trailing space; `week` occurs nowhere else.
- `attach_stranded_label`: none needed. `TOPIC` (block 3) is a stranded scheme-table column label, not a week label.
- `classify_marker`: blocks 4, 29 (`Revision.`) and 30 (`Examination`) are preamble lines with no body → `SCHEME_ONLY` candidates. No `EVALUATION`/`REVISION` heading occurs in any week body.

## Parsed-row findings (importer view, not an importer run)
Four rows; preamble dropped from every row. Week 1's parsed title keeps its numbering prefix (`1.0.\tTopic: Single Column cash book`); Weeks 2–4 fall back to their first credible line. `originalLessonId` is `<source_id>:BODY:<body sha256>` (`compiler.ts:15`), so identical bodies under two sources get distinct ids but duplicate content. Table cells are emitted one per line, so row grouping survives only as blank-line positions.

## Observed content issues (source text not altered; same figures as the 1st Term file)
- **Illustration 1:** solution prints `115` (block 54) and `750` (block 53) where the question says `155` (block 48) and `700` (block 44); it reconciles internally (2,115) but with the question's figures the debit is 2,155, credit items 1,055, balance **1,100**, not 1,010.
- **Illustration 2:** a *bank* account opened with `cash in hand` (63); credit side repeats Illustration 1's items (73–77); June 9 cheque purchase of 300 (68) omitted; June 7 has no amount (67); credit items 1,505 vs printed total 3,180; printed balances 1,010 and 1,910.
- **Week 2:** worked example (97–105) has no solution; sub-item "Difference between single column cash book." is taught nowhere.
- **Week 3:** blocks 120–121 give a N300 cash balance and N710 paid in; table 123 records contra entries of 300 and 710 (1,010 in total), more than the stated balance — authoring check.
- **Week 4:** posting illustration (185–206) and both ASSIGNMENT questions have no answers; ASSIGNMENT 1 (209) cites an unsupplied textbook page and must not be copied; illustration instruction (175) truncated at "Account to be."; `Bought motor van by cheque N20` (197) implausible; `Withdrew cash from bank for personal use` (195) is drawings, not a contra; block 204 reads `Yinka lend us`; table rows vi and x ("Goods were returned to …") need a direction check.
- **Currency and dating:** naira is a bare `N`; placeholder year `19x9`; all money figures historical; any update needs dated primary data and no figure was changed.
- **Coverage:** four week bodies for a twelve-entry scheme; no Week 5–12 bodies. Observation only.

## Edits
- `QUEUE.json`: BK-INV-T2 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; **13 PENDING items appended** (`BK-PRE-T2`; `BK-MARK-T2-REVISION`, `BK-MARK-T2-EXAM`; `BK-WK-T2-W01`…`W04`; `BK-PRES-T2-WORKED`, `BK-PRES-T2-CURRENCY`; `BK-VIS-T2-TACC-W01`, `BK-VIS-T2-TBL-W03`, `BK-VIS-T2-TBL-W04`, `BK-VIS-T2-BRACE-W04`), each depending on BK-INV-T2 and BK-SRC-T2; counts, `status_counts` and `next_runnable` recomputed; one note appended. No other item changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse of QUEUE.json; unique IDs; all `depends_on` and `next_runnable` references resolve; only BK-INV-T2 changed among existing items; SHA-256 calculation; diff inspection.

## Remaining
`BOOKKEEPING-ALIAS-APPROVAL*` and `BOOKKEEPING-T2-TEXT-MATCHES-T1` remain owner actions; the new `BK-*-T2` items should wait for the latter. Next eligible per the queue: `BK-WK-T1-W02` (no worked solution and an untaught objective); next unread inventory is `BK-INV-T3`. Not executed here. This does not claim the subject or class complete.
