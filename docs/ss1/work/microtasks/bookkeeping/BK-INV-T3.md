# BK-INV-T3 — Bookkeeping, 3rd Term source inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (source inventory only; not approved, not verified). No lesson, coverage entry or source rule is authored by this inventory.

## Inputs and identity
- Supplied original member: `SSS 1/3rd Term SS1_/BOOK KEEPING_.docx`.
- Exact file bytes SHA-256: `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`; this exactly matches the registered manifest row and package source `SS1-SRC-97f226215927`.
- Registered archive member and term: `SSS 1/3rd Term SS1_/BOOK KEEPING_.docx`, `3rd Term`; canonical subject `Bookkeeping`, class `SS 1`.
- The composite ZIP itself was not supplied in this turn, so its archive hash was not rechecked. The member hash is sufficient to identify the supplied DOCX against the existing manifest record.
- First non-empty document paragraph (body block 2): `SS 1 OMEGA TERM BOOK- KEEPING`. The existing package source alias correctly records this observed heading; alias owner approval remains pending. The heading says `OMEGA TERM`, while the manifest folder assigns `3rd Term`; retain both facts without treating the title as a manifest change.
- DOCX core properties: creator `Elias`, last modified by `fash`, revision 2, created and modified `2016-05-19T02:50:00Z`. These are document metadata, not proof that every example transaction occurred on that date.

## Reproducible locator convention
A block is a direct child of `w:body` in `word/document.xml`, zero-based. There are 499 content blocks (0–498) followed by `w:sectPr` at block 499 (500 direct children total). Block text is the concatenation of descendant `w:t` runs, UTF-8, without normalisation; `w:tab` nodes are omitted. Range hash is SHA-256 of block texts from first through last inclusive, joined by one newline; empty blocks are included.

- Whole content blocks 0–498: SHA-256 `fe4b5a86ca9c2fb0582ab0adf09b6223b9d2e35d44abde61c6f00829e223be5b`.
- Preamble blocks 0–43: SHA-256 `bccc05419af499fe4b74c00fa80fb410ba127765bf6d3d6e0c487e9c899d8434`.
- Petty-cash section blocks 44–81: SHA-256 `19b0480e70d710ff1707389b5ca1997a3e61ef78018a677e4c0f68466580aee6`.
- Trial-balance and ledger section blocks 85–259: SHA-256 `63dc9291dd76d28f3f2aac03e36220265942069b6f4c835bba4118df80287706`.
- Errors and suspense-account section blocks 261–392: SHA-256 `3ff8ce00524df2d8e0822ee1c5867eb859ec9c1447c0835915a3bd363a9c4b5c`.
- Final-accounts section blocks 394–468: SHA-256 `9077fa3508b3526e4da9837c51a6295f5a92999205ab81a37955658f31b41448`.

## Scheme inventory and body mapping
The scheme is in preamble blocks 4–41. It has twelve manually typed entries, with no Word automatic numbering detected in the scheme paragraphs. The source has no literal `WEEK ONE`, `WEEK TWO`, or other teaching-week marker in its body. After the scheme, the teaching content is one continuous unlabelled body divided by topic headings, not ten explicitly labelled week bodies. Therefore the scheme gives ten teaching-week slots, but source week boundaries are not directly marked in the body. The mappings below are objective-to-section observations, not parser-verified week boundaries.

| Scheme week | Exact scheme entry / locator | Corresponding source material and inventory finding |
|---|---|---|
| 1 | `1 Revision`, block 5, hash `001512a6ddbf840fdbd3388e661b790495094a020e23a723cbd9cf14eeaa0204` | No revision section or revision questions appear before the Week 2 scheme topic/body. Scheme marker only. |
| 2 | `2 Petty cash book`, blocks 6–9 | Petty cash book section blocks 44–81: meaning, imprest system, procedures, ruling and one tab-aligned petty cash book illustration. |
| 3 | `3 Trial balance and correction of errors`, blocks 10–13 | Trial balance section blocks 85–150: meaning, a long debit/credit account classification list, differences from balance sheet, and purposes. Extraction/balancing material continues at blocks 166–259. |
| 4 | `4 Trial balance and correction of error`, blocks 14–16 | Rules and preparation objective: rules are introduced at blocks 151–175; ledger balancing, cash-account illustration, ledger postings and a trial balance example occur at blocks 166–259. No explicit week boundary separates this from Week 3. |
| 5 | `5 Trial balance and correction of errors`, blocks 17–21 | Error definitions/types and journal correction illustration at blocks 261–307. The scheme asks for errors affecting and not affecting the trial balance; the source does not cleanly divide these into two complete, separately labelled teaching treatments. |
| 6 | `6 Trial Balance and correction of errors`, blocks 22–23 | Suspense-account correction material at blocks 308–392, including error types, procedures, Fashola Ltd illustration, journal entries and a suspense account. |
| 7 | `7 Trading Account`, blocks 24–27 | Final-account terminology at blocks 394–417 defines trading account, cost of goods sold, goods available for sale and gross/net profit. No standalone trading-account format or worked trading-account example is present in the identified section. |
| 8 | `8 Trading account`, blocks 28–29 | Preparation-of-final-accounts steps at blocks 418–423, but no separate simple trading-account layout or worked calculation is supplied. This is a scheme/body gap, not an invitation to invent a source lesson. |
| 9 | `9 profit and loss Account`, blocks 30–33 | Profit and loss account is defined at block 403; final-account steps at 418–423 mention deducting expenses from gross profit. No distinct P&L layout, net-sales calculation or worked P&L example is supplied. |
| 10 | `10 balance sheet`, blocks 34–38 | Balance sheet definition at block 404, layout at blocks 426–452, evaluation at 456 and a balance-sheet assignment at 457–468. The scheme's explicit “Users of balance sheet” objective has no identifiable teaching section. |
| 11 | `11 revision`, block 40, hash `b6d1ba5101b51df16c679e834778c5122b62ba0722f8b3685cd0d92892466166` | No revision body, worksheet, questions, answers or marking scheme follows this scheme marker. |
| 12 | `12 exam`, block 41, hash `96bdf60333eb1cb78ace49a418eb4ba0f4fffec531a07fece7da63eecacba7be` | No examination paper, questions, marks, duration or marking scheme supplied. |

## Source section detail
- **Preamble, blocks 0–43:** title block 2; scheme heading block 3; `WEEK` column label block 4; twelve scheme entries and their sub-items blocks 5–41; remaining blocks are blank/spacing. All scheme material precedes the first teaching section at block 44.
- **Petty cash, blocks 44–81:** definitions at 45–47; procedures at 48–61; layout and example at 62–81. The layout is text with tab spacing and embedded VML drawing objects, not a native Word table. The example's listed analysis amounts are postage 30, cleaning 35, transport 55, medical expense 55, ledger 70, total 245; the source's cash float is 700 and reimbursement/balance lines are shown at blocks 76–81. Preserve as printed pending detailed arithmetic review.
- **Trial balance, blocks 85–259:** definition and layout at 85–136; differences and purposes at 141–150; rules/classification diagram at 151–164; ledger balancing procedure at 166–175; Mr Odili June 1999 transactions and cash account at 180–204; ledger entries at 206–240; trial balance at 242–254; evaluation at 254–256 and textbook assignment at 259. The printed trial balance totals show debit 10,000 and credit 1,000 at blocks 251–253; record as a source inconsistency for later arithmetic review, not silently correct.
- **Errors/suspense, blocks 261–392:** error definitions at 261–267; correction exercise at 269–277; printed journal answers at 280–303; errors said to affect trial-balance agreement at 308–314; correction process at 315–320; explanations at 321–325; further error categories and Fashola Ltd case at 329–343; printed journal at 345–378; suspense account at 380–388; evaluation/assignment at 391–392. The suspense-account solution prints totals of 1,400 on both sides at 386, but the visible listed debit entries (100 + 100 + 500 + 250) total 950 while visible credit entries (500 + 300 + 500 + 100) total 1,400. Preserve the mismatch for worked-material review.
- **Final accounts, blocks 394–468:** final accounts overview and definitions at 394–417; preparation steps at 418–423; balance-sheet layout at 426–452; evaluation at 456; assignment balances at 457–468. The assignment heading says 31 Dec. 1983 at block 457, while the instruction says 31 Dec. 1883 at block 468. Do not choose a corrected year without a documented decision.

## Visual and embedded-object inventory
- No native Word tables (`w:tbl`), no `word/media` files, no DrawingML images, no OLE objects and no equations were found.
- There are **67 VML drawing objects** in 26 paragraphs. They are predominantly straight connectors, arrows and account ruling, not separate image files. Object groups occur at blocks 62–63, 77–78, 90–91, 103, 117, 130, 141, 156, 158–161, 190, 207, 214, 220, 225, 233, 243, 281, 345, 354–355, 367–368, 381, 429 and 442.
- Tab-aligned layouts include the petty cash book (62–81), trial-balance list and classification diagram (90–164), cash account and individual ledger accounts (189–243), journal and suspense account (280–388), and balance sheet (428–452). Their columns/rules may not survive a plain-text rendering faithfully; separate visual dispositions are queued.
- The ledger-account VML connectors are interspersed with tab-aligned account text. Preserve the text and identify each account/side when authoring any replacement; do not treat the connector objects as independent instructional pictures.

## Structural parser findings (findings only; no source rule added here)
- The scheme is a preamble, not a sequence of parsed week rows: all twelve manually typed scheme entries occur before the first body topic at block 44.
- The body contains no explicit `WEEK n` line or stranded week label. The importer/parser's actual result has not been run in this task; do not claim the document parses into ten lesson rows.
- `classify_marker` is the likely source-rule family for the three scheme-only markers (Week 1 revision, Week 11 revision, Week 12 examination), because their exact anchors are in preamble material and have no corresponding body. Exact rule authoring belongs to the marker-disposition tasks.
- No `attach_stranded_label` case is evidenced: no detached week label immediately precedes a following body anchor.
- `split_before` may be needed if a reviewed mapping chooses to create parser boundaries at body topic headings, but the current document does not itself mark those headings as week labels. Do not add split rules until each anchor and week assignment is reviewed against the contract and parser behavior.

## Preservation and currency observations
- The source uses `#` before monetary values (for example, petty cash figures and the June 1999 illustration); it does not explicitly name a currency, use an ISO currency code or identify a currency symbol. Do not silently replace `#` with a currency sign.
- Dated examples include June 1999 (block 180), a balance sheet layout dated 31 Dec. 2000 (block 428), and an assignment dated 31 Dec. 1983 / 1883 (blocks 457 and 468). These are historical source examples, not current financial values.
- The document metadata date is 2016-05-19T02:50:00Z. No inflation, conversion or economic refresh was performed.

## Implementation boundary
- Source member bytes match the existing manifest/package registration exactly.
- This inventory does not add lessons, coverage entries, correction rules or marker rules; those are separate bounded tasks.
- The original DOCX is not copied into the repository. No original text or figures are changed.
- No importer, compiler, database, typecheck, test or delivery verification was run. The queue records follow-on indexing, preservation, marker and visual tasks as PENDING.
