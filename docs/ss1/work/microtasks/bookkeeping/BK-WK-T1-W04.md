# BK-WK-T1-W04 — Bookkeeping, 1st Term, Week 4 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 4 is **not delivered**: 10 coverage entries are PARTIAL and 3 are UNRESOLVED, and two lesson items plus two factual-dependency items are appended.

## Inputs
- Base: `origin/master` `f87ef8a0` (merge of PR #269), carrying `next_runnable: BK-WK-T1-W04`. No open PR touched this subject.
- Prerequisites `BK-INV-T1` and `BK-SRC-T1` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-62b02f2adcb3`, member `SSS 1/1st Term SS1_/book keeping.docx`, 38,275 bytes, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`, **re-verified this run**. Nothing from the archive or the extract is committed.
- Locator model (unchanged from BK-WK-T1-W02): blocks are direct children of `w:body` in `word/document.xml`, 0-based (blocks 0-219; block 220 is `w:sectPr`); block text concatenates the block's `w:t` runs with tabs omitted; a range hash is SHA-256 of block texts first..last joined with `\n`, empty blocks included. Reading was done in Python from the original attachment; the importer, parser and compiler were not run.

## Scheme mapping
- The scheme is numbered and explicit: entry 9 at block 22 (`-Meaning of Double entry` 23, `-Identify the account to be credited and debited.` 24) and entry 10 at block 25 (`-Posting of transaction from cash book to ledger.` 26, `-Rule of double entry.` 27). Both entries carry the identical title `Principle of Double entry.`
- Week 4 is the body headed `PRINCIPLE OF DOUBLE ENTRY` (block 159) under the label `WEEK FOUR` (block 158), blocks 158-219.

| Scheme item | Blocks | SHA-256 | Body binding |
|---|---|---|---|
| Entry 9: meaning; identify the account debited/credited | 22-24 | `1aed243f2989ac1e5bfc3e0d678ff629046bde1e1735729ed06797859d0bf4c2` | definition 160; receiver/giver 166-172; answered table 174-175 |
| Entry 10: posting cash book → ledger; rule of double entry | 25-27 | `a72a51e2a1824cc25595785aa53e43a9f61255a0b957ccb0cf20ffa74412f9f7` | posting 177-182; illustration 183-205 |

## Section
- Label block 158 `WEEK FOUR`, SHA-256 `3c43507c7d6178122a308f5e7ede8deda1dd2dfab7a0beebb4601d6d26ea10c2`; range blocks 158-219, SHA-256 `02636ad0bc25b5fc42757c9dba5ea99c2f6b483301d7b5c5f72b478c8b5d86e7`, 3,593 characters, equal to the BK-INV-T1 value.
- Parts: title 159; definition 160; three rules 161-164 (`06c65a5b…d36e67`); application 166-172 (`faf1477c…75a304`); answered identification table 174-175 (`e796b64f…f3b9db`, table 528 characters, 11 data rows); posting heading 177, sub-heading 178, definition 179 (`54afe5a0…265018`), two rules 180-182 (`5f7d2a88…a9cdbaa`); June illustration 183-205 (`e6e28b2c…0b5878`, twenty transactions at 186-205); ASSIGNMENT 1 at 207-209; ASSIGNMENT 2 at 210-217 (`619f7ded…c25a26`); blank blocks 218-219.
- The document has **no ledger account** anywhere: `ledger` occurs only at blocks 26, 177, 178 (`ebe4f8b8…7d17`), 179, 181, 182, 185 and 209, all of them instructions to post.
- Week 4 carries no Word table other than block 175 and no drawing, picture, OLE object or equation; no visual item is raised.

## Coverage entries added (13)
| ID | Objective | Blocks | Status |
|---|---|---|---|
| `COV-BK-T1-W04-SCHEME-9` | Scheme entry 9: meaning; identify account debited/credited | 22-24; 158-219 | PARTIAL |
| `COV-BK-T1-W04-SCHEME-10` | Scheme entry 10: posting cash book → ledger; rule of double entry | 25-27; 177-205 | PARTIAL |
| `COV-BK-T1-W04-MEANING` | Meaning of double entry | 160 | PARTIAL |
| `COV-BK-T1-W04-RULES` | The three stated rules | 161-164 | PARTIAL |
| `COV-BK-T1-W04-TWO-ACCOUNTS` | Receiver/giver and Dr/Cr application | 166-172 | PARTIAL |
| `COV-BK-T1-W04-IDENTIFY` | Identify debit and credit account, 11 transactions | 174-175 | PARTIAL |
| `COV-BK-T1-W04-POSTING-MEANING` | Meaning of posting and order of work | 177-179 | PARTIAL |
| `COV-BK-T1-W04-POSTING-RULES` | Two posting rules | 180-182 | PARTIAL |
| `COV-BK-T1-W04-ILLUSTRATION` | Twenty June transactions, balanced and posted | 183-205 | PARTIAL |
| `COV-BK-T1-W04-ASSIGN-1` | External textbook exercise | 207-209 | UNRESOLVED |
| `COV-BK-T1-W04-ASSIGN-2` | Seven January transactions | 210-217 | PARTIAL |
| `COV-BK-T1-W04-LEDGER-FORMAT` | The form of a ledger account | whole document | UNRESOLVED |
| `COV-BK-T1-W04-BALANCE-OFF` | Balancing off and bringing down a balance | 185 | UNRESOLVED |

PARTIAL means the source teaches the objective (or sets the exercise) but no deliverable lesson exists and the defects below must be settled first. UNRESOLVED means the objective is required but the source supplies nothing usable.

## What the week teaches
| Part | What is supplied | Exercise |
|---|---|---|
| Definition | 160: two-fold aspect, receiver debited, giver credited | none |
| Rules | 161-164: a and b are one rule in two directions, c restates both | none |
| Application | 166-172: two accounts, receiver/giver, Dr and Cr statements | none |
| Identification | 175: eleven rows already answered, instruction at 174 truncated | the answered table itself |
| Posting | 179 definition, 181-182 two transfer rules | none |
| Ledger | nothing: no ruling, no specimen, no folio, no worked posting | required by 185 and 209 |
| Balancing | nothing: no balanced cash book in the document | required by 185 |
| Practice | June illustration 186-205; ASSIGNMENT 2 211-217 | no answers |
| External exercise | ASSIGNMENT 1 at 208 | not supplied |

## Source defects (open item `BOOKKEEPING-T1-W04-SOURCE-DEFECTS`)
| # | Block | Defect |
|---|---|---|
| 1 | 174 | Instruction truncated at `Account to be.`; the table at 175 already prints its answers |
| 2 | 171-172 | Account name run into value with no separator (`Dr. Receiving accountWith value it receives`) |
| 3 | 179 | Posting defined circularly; no ledger, no date, no particulars, no folio |
| 4 | 181-182 | `All items` posted to the opposite side, contradicting the contra `C` rows at 188, 190, 191, 193, 194 and 201 |
| 5 | 194 | June 12 personal withdrawal from the bank is drawings, set among cash book transfers |
| 6 | 196 | June 16 motor van at `N20` against `N3,200` capital (186) and `N1,020` loan (203) |
| 7 | 203 | `Yinka lend us N1,020 cash` (tense and agreement) |
| 8 | 208 | ASSIGNMENT 1 cites an external textbook page that is not supplied |
| 9 | 210-217 | Seven transactions with no statement of the book or accounts required |
| 10 | 22, 25 | Scheme entries 9 and 10 share the identical title |
| 11 | whole document | No ledger account is shown, which the posting objective requires |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Figures and arithmetic (open item `BOOKKEEPING-T1-W04-FIGURE-CHECKS`)
- The week presents no arithmetic to check: the June list is a statement and no cash book, balance or ledger is given. What needs verification is the **N20 motor van** (block 196) and the **drawings treatment** at block 194, plus the classification of each transfer row as contra or posted.
- The answered table at 175 was read line by line: all eleven double entries are correct as stated, including the contra row `viii` (`Bank` debited, `Cash` credited) which depends on Week 3 entry 8.

## Notation and rendering
- Naira is written as a bare `N` throughout (`N800`, `N3,200`, `N20`, `N1,020`), as in Weeks 2 and 3. No currency word, date, year or price level is given, so the figures are undated; they are preserved as written and are not modernised here.
- Blocks 158-219 contain **zero non-ASCII characters** and zero tab characters: no en dash, no curly quote, no diacritic. No normalisation was applied.

## Queue changes
- `BK-WK-T1-W04` → `IMPLEMENTED_TESTING_DEFERRED`; its inventory reference replaced.
- Appended 4 items: `BK-LES-T1-W04-DOUBLE-ENTRY`, `BK-LES-T1-W04-POSTING` (LESSON, PENDING, both depending on `BK-FACT-T1-W04-BRIEF`) and `BK-FACT-T1-W04-BRIEF`, `BK-FACT-T1-W04-TEXTBOOK` (FACTUAL_DEPENDENCY, BLOCKED).
- Counts: items 37 → 41; LESSON 2 → 4 and FACTUAL_DEPENDENCY 2 → 4; coverage 9 → 22; open items 9 → 15; source_rules 3; lessons 0; status 7 implemented / 30 pending / 4 blocked; `next_runnable` → head `BK-WK-T1-W01`.

## Limits
- Indexing only: no lesson, no source rule, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `bookkeeping.json` was edited only to add coverage and open items.
- Not approved and not verified. Three objectives cannot be answered from this document at all: the external exercise, the ledger format and balancing.
- The six open items opened by this task are `BOOKKEEPING-T1-W04-SOURCE-DEFECTS`, `-NO-SOLUTIONS`, `-LEDGER-FORMAT-MISSING`, `-BALANCING-UNTAUGHT`, `-EXTERNAL-TEXT` and `-FIGURE-CHECKS`. None is closed by this note.
