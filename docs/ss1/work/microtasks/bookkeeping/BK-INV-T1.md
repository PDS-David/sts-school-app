# BK-INV-T1 — Bookkeeping, 1st Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `30d614e` (`Merge pull request #170 from PDS-David/ss1/bio-inv-t1-20261028`), fetched at start; GitHub reported **no open pull requests** and no `ss1/bk-inv-t1*` branch. `AGENTS.md` is absent.
- Prerequisite **BK-SRC-T1** is `IMPLEMENTED_TESTING_DEFERRED`; `backend/src/db/ss1/subjects/bookkeeping.json` exists with source `SS1-SRC-62b02f2adcb3`, three registered sources and no lessons, coverage, corrections or assets. BK-INV-T2/T3 remain PENDING.
- Original: member `SSS 1/1st Term SS1_/book keeping.docx`, **38,275 bytes**, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0` — hashed before any conversion; equals row 21 of `SOURCE_ASSIGNMENTS.csv`.
- Container: this session received the **composite archive** `SSS 1-20260507T072431Z-3-001 (1).zip`; its SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` was checked and matches. (BK-SRC-T1 had only a per-term ZIP and explicitly did *not* check the composite hash; this note does check it.)
- Method: `word/document.xml` parsed with the Python standard library in a private scratch directory; tab-rounded text and table cells read directly from the XML; mammoth 1.12.2 `extractRawText` used only to obtain the importer's own text view. Nothing from the document is committed; no importer, plan, test, typecheck, database or device command was run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0–219; block 220 is `w:sectPr`; 221 children in total). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation — so `w:tab` elements are **omitted**, unlike mammoth, which renders them as `\t`. Range hash = SHA-256 of block texts first..last inclusive joined with `\n`, empty blocks included. Python: `T=[''.join(x.text or '' for x in b.iter('{W}t')) for b in body]; sha256('\n'.join(T[a:b+1]).encode())`.

Whole body, blocks 0–219: `ca09a3081a2be0f916c72103932c2099b7fe83a52da0c2b3b5cda8df3aaf842f`.
Importer view (mammoth raw text): 9,504 characters, 671 lines (266 non-empty), 0 conversion messages, SHA-256 `3fed1c3bfeac7435b2506503da1d4c414420b88984a83ac20407f1b78d28bb11`.

## Week inventory (4 teaching weeks)
| Week | Exact label | Label block | Blocks | Label sha256 | Range sha256 | Parsed title | Body chars | Parsed body sha256 |
|---|---|---|---|---|---|---|---|---|
| 1 | `"WEEK ONE "` (trailing space) | 30 | 30–86 | `d6daf1e694c6b67d3872739f78e9ed66d657349d3adba8de1bdc261001e1fef8` | `0aa3088772e53f5e135529b39c31129af5dee4b4019ac1cdfb0758aaa96cf6d3` | `"1.0.\tTopic: Single Column cash book"` | 1,934 | `e4dbc7a1ff59d4a1fe5da4b9ff975ab60c94df281e8774f5bf2330ddc21d7ccd` |
| 2 | `"WEEK TWO"` | 87 | 87–108 | `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6` | `ed00cfec8ef42cc9b1b02f35df0d866d77d2b5560db48a295b3e35dff3496218` | `"DOUBLE COLUMN CASH BOOK"` | 1,148 | `bb5f26395bbe6ce4bae80f128748821df86b6895d8a4a4e87ead79c6d31f2e4b` |
| 3 | `"WEEK THREE"` | 109 | 109–157 | `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` | `f82efa6d2cfe027ab42113ec3d4781f3852d5b91a9527aff9863f286a0b58997` | `"CONTRA ENTRY"` | 1,555 | `194de4c5fde3e27a5596871b7a860b26a5456eaedf0d3c24ab31f89e2132eb8a` |
| 4 | `"WEEK FOUR"` | 158 | 158–219 | `3c43507c7d6178122a308f5e7ede8deda1dd2dfab7a0beebb4601d6d26ea10c2` | `02636ad0bc25b5fc42757c9dba5ea99c2f6b483301d7b5c5f72b478c8b5d86e7` | `"PRINCIPLE OF DOUBLE ENTRY"` | 3,833 | `890fb8fac8b6f9b6cf32bfe5fc5a3e21bcd464e447b214ac1a9eb9d7128f8409` |

Parsed titles and body hashes were obtained by replicating the importer's `WEEK_MARKER` and title rules on the extracted text; the importer itself was not run. `body_sha256` here is the exact UTF-8 hash of the parsed body, i.e. the identity component of `originalLessonId`.

Per-week sections:
- **Week 1** — label 30; topic line 31; introduction/NOTE 33–36; Illustration 1 statement 37–48; its tab-aligned T-account 49–57; bank-account definition 58; Illustration 2 statement 59–69; its T-account 70–80; blanks 81–86.
- **Week 2** — label 87; heading 88; meaning 89; accounting entries 90–92; example instruction 93–94; placeholder year `19x9` (95); nine dated transactions 96–104; blanks 105–108. **No solution.**
- **Week 3** — label 109; heading 110; definitions 111–113; (a) payment of cash to bank 114–115; flattened Effect/Action pairs 116–118; example 119–120; cash book table 122; folio-"C" note 124; (b) withdrawals from bank 126–127; second Effect/Action pair 130–132; example 133; cash book table 135; blanks 136–157.
- **Week 4** — label 158; heading 159; definition 160; three rules 161–164; application 166–172; illustration 174–175 (eleven answered rows); posting from cash book to ledger 177–182; illustration statement 183–205 (twenty June transactions); ASSIGNMENT 207–217; blanks 218–219. **No solution and no answers.**

## Other sections and objects
- **Preamble, blocks 0–29** (also the 957-character, SHA-256 `ac4973152f293e3b3b8dff8ed9ae68e6a9cd0595a1713e2440d5fbfe6da6bb05`, opening of the mammoth text; range hash `581587fcf71c6d77b82abac943b40f79becbda4807c855bd3431cf63bc6d302b`): `FIRST TERM` (0), `SCHEME OF WORKS` (1), the flattened scheme header row (2), and twelve scheme entries with dashed sub-items (3–29). All twelve entries precede the first `WEEK` marker, so the generic parser treats this whole block as preamble outside every parsed row.
- The twelve entries are **manually numbered text**, not a Word auto-numbered list: no `w:numPr` exists in any of blocks 0–29 and the numbers are present in `w:t`, so `1.`…`12.` survive extraction as `N.\t<text>`.
- Scheme-to-body mapping (an observation about this file, not a claim about the term):
  | # | Scheme entry (block) | Carried by |
  |---|---|---|
  | 1 | `Revision.` (3) | marker only — no body |
  | 2 | `Cash book` (4; subs 5–6) | Week 1 |
  | 3 | `Single column cash book` (7; sub 8) | Week 1 |
  | 4 | `Preparation of single column cash-book (continues)` (9) | Week 1 |
  | 5 | `Double column cash book` (10; subs 11–12) | Week 2 |
  | 6 | `Double column cash book` (13; subs 14, 15) | Week 2; **sub 14 "Difference between single column cash book." has no teaching**; sub 15 has only an unsolved example |
  | 7 | `Double column cash book.` (16; sub 17) | Week 2; sub 17 has only an unsolved example |
  | 8 | `Contra Entry.` (18; subs 19–21) | Week 3 |
  | 9 | `Principle of Double entry.` (22; subs 23–24) | Week 4 |
  | 10 | `Principle of Double entry.` (25; subs 26–27) | Week 4 |
  | 11 | `Revision.` (28) | marker only — no body |
  | 12 | `Examination` (29) | marker only — no examination material |
- **Tables (3, all real `w:tbl`):** block 122 (4 rows × 10 columns; sha256 `50f7bcab93db04a2fa33854ba34f46d6e95918e4455540913256e0bd02990bb8`), block 135 (3 × 10; `bc543e99e8376f0fe5228f6c3310772051ac2dcd1c71bb8bb96202015256fcc7`), block 175 (12 × 4; `35d1163dd177a22a8987a9ff139ad68ad22462b43b152e07172182d5a834597a`). By cell position, 122 is Dr Bank / Cr Cash and 135 is Dr Cash / Cr Bank — both correct contras.
- **Drawings:** no `word/media` part, no image, no OLE object, no equation (`m:oMath` 0). Eight VML objects sit in five paragraphs: block 49 (two straight-arrow connectors = the Cash-account ruling), block 56 (two groups = double rule under the debit total), block 70 (the same connector pair for the Bank account), block 79 (one group = double rule under the bank total), block 170 (one right brace beside the receiving/giving lines). The 11 package parts contain no header or footer part, so there is no page branding.
- The "Effect / Action Required" pairs at 116–118 and 130–132 are **paragraph text, not a table**; blocks 116 and 130 have identical block text (`1db4bc45a5efc035e858390ba776222e60cb197f34071115e157e232365c432c`), so a block-text locator alone is ambiguous — cite the index.

## Structural rule findings (findings only; no rule written)
- `split_before`: **not needed and not usable here.** The four labels are standalone line-start paragraphs and the importer's `WEEK_MARKER` (`backend/src/db/ingestTopics.ts:313-317`) already accepts spelled-out numbers; replicating it over the extracted text gives exactly 4 matches, at offsets 957, 2,905, 4,063 and 5,665, each at a line start. But `backend/src/db/ss1/compiler.ts:22-23` restricts `week_label` to digits (`^(?:[0-9]{1,2})(?:\s*(?:-|&|and)\s*[0-9]{1,2})?$`), so a split rule could not be written for `WEEK ONE` even if one were wanted. Recorded, not resolved: no rule is required, so no foundation change is requested by this item. Hazard for the unrun parser: label 30 carries a trailing space; `week` occurs nowhere else in the document (verified: exactly these four occurrences).
- `attach_stranded_label`: **no stranded label.** Each label is its own paragraph. The stranded column label `TOPIC` at the end of block 2 belongs to the scheme header row, not to a week.
- `classify_marker`: blocks 28 (`11.Revision.`) and 29 (`12.Examination`) are preamble lines with no body → `SCHEME_ONLY` candidates, together with block 3 (`1.Revision.`). No `EVALUATION`, `REVISION` or examination heading occurs inside any week body, so no in-body heading is at risk of being classified as a marker.

## Parsed-row findings (importer view, not an importer run)
- Four parsed rows, one per label; preamble text is dropped from every row (see above).
- Week 1's parsed title keeps the numbering prefix — `"1.0.\tTopic: Single Column cash book"` — because the TOPIC-field rule requires `TOPIC` at the start of a line and this line begins `1.0.`. Weeks 2–4 fall back to their first credible line (`DOUBLE COLUMN CASH BOOK`, `CONTRA ENTRY`, `PRINCIPLE OF DOUBLE ENTRY`). Any later title work must therefore be a reviewed mapping, not a same-title fallback.
- Table cells are emitted one per line with empty cells as empty lines, so row grouping survives only as blank-line positions and the Cash/Bank columns cannot be told apart without counting cells.

## Observed content issues (for the BK-WK/BK-PRES/BK-VIS items; source text not altered)
- **Illustration 1 arithmetic/transcription:** the printed solution uses `115` (block 53) where the question says `155` (block 47) and `750` (block 52) where the question says `700`. It reconciles internally (2,115 = 2,115) but with the question's figures the debit is 2,155, the credit items 1,055 and the balance **1,100**, not the printed 1,010.
- **Illustration 2:** a *bank* account opened with `cash in hand` (block 62); its credit side repeats Illustration 1's dates and items (blocks 72–76); the June 9 cheque purchase of 300 (block 67) is omitted; June 7 has no amount (block 66); and three figures do not reconcile — credit items 1,505, printed credit total 3,180 (gap 1,675), printed balances 1,010 and 1,910 (sum 2,920).
- **Week 2:** the worked example (blocks 93–104) has no solution; the scheme sub-item "Difference between single column cash book." (block 14) is taught nowhere.
- **Week 3:** blocks 119–120 give a N300 cash balance and then N710 paid into the bank with no explanation of the second amount — needs an authoring check; the tables themselves are correct contras.
- **Week 4:** the posting illustration (183–205) and both ASSIGNMENT questions (207–217) have no solution or answers; ASSIGNMENT 1 cites "simplified and amplified book-keeping and accounting page 56 revision question 5x", an external textbook page that is not supplied and must not be copied; the illustration instruction at block 174 is truncated ("Account to be."); `Bought motor van by cheque N20` (block 196) is implausible and needs verification; `Withdrew cash from bank for personal use` (block 194) is drawings, not a contra, and must not be taught as one; block 203 reads `Yinka lend us`.
- **Currency and dating:** the naira is written as a bare capital `N` with no currency code or sign; the Week 2 example uses the placeholder year `19x9`; `docProps/core.xml` records creation and last modification on **2020-05-30** (revision 2), and `docProps/app.xml` 10 pages / 1,372 words. All money figures are therefore historical; any update needs dated primary data and no figure was changed here.
- **Coverage of the term:** four week bodies for a twelve-entry scheme, with no Week 5–12 bodies. Recorded as an observation about this file and an owner question in BK-PRE-T1; no week, lesson or missing-material claim was invented, and the 2nd Term file's own duplication question (`BOOKKEEPING-T2-TEXT-MATCHES-T1`) is left to its owner decision.

## Edits
- `QUEUE.json`: BK-INV-T1 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; **13 PENDING items appended** — `BK-PRE-T1`; `BK-MARK-T1-REVISION`, `BK-MARK-T1-EXAM`; `BK-WK-T1-W01`…`W04`; `BK-PRES-T1-WORKED`, `BK-PRES-T1-CURRENCY`; `BK-VIS-T1-TACC-W01`, `BK-VIS-T1-TBL-W03`, `BK-VIS-T1-TBL-W04`, `BK-VIS-T1-BRACE-W04` — each depending on BK-INV-T1 and BK-SRC-T1; counts, `status_counts` and `next_runnable` recomputed; one note appended. No existing ID or item otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.

## Remaining
Alias approval open items (`BOOKKEEPING-ALIAS-APPROVAL*`) and `BOOKKEEPING-T2-TEXT-MATCHES-T1` remain owner actions. BK-INV-T2 should wait for that answer; BK-INV-T3 is unread. Next eligible: `BK-WK-T1-W02` (no worked solution and an untaught objective), then `BK-WK-T1-W04`, `BK-WK-T1-W01`, `BK-WK-T1-W03`, then the preamble, marker, visual and preservation items, which share one package file and should run sequentially. This does not claim the subject or class complete.
