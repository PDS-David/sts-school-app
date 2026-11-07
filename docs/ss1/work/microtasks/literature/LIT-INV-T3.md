# LIT-INV-T3 — Literature-in-English, 3rd Term inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `679ab8b` (master). Branch `agent/literature-ss1`. No `AGENTS.md`; no `origin/*` Literature branch.
- Archive `docs/ss1/sources/SSS1-original.zip`: SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**; 35,828,550 bytes.
- Source `SS1-SRC-2422e423a240`, member `SSS 1/3rd Term SS1_/LITERATURE.docx`: SHA-256 `319a4898820bc98f19f48a592404baa0b54527b704fadddbd9484277fa91e9c3` **verified**; 56,647 bytes.
- Method (private scratch, not committed): `mammoth` 1.12.2 `extractRawText`: 1,225 lines, 466 non-blank, last non-blank line 1223. Whole extract 1–1223: `ce7c3ba11a15e6c4a659049783e421511d48296a09babe21beb64670ccbe17ef` (76,798 bytes). The same procedure reproduces the recorded 2nd Term whole-extract hash `27ea88a8…1f0c`, so line numbers are comparable.
- Block convention (as `LIT-INV-T2`): SHA-256 of the stated 1-based lines joined with `\n`, UTF-8, edge blank lines trimmed.
- Structure (`word/document.xml`): `w:tbl` 1; `w:drawing`, `w:pict`, `w:br`, `w:hyperlink`, `m:oMath`, tracked changes: 0; no media, header or footer part.

## Main finding: text identical to 2nd Term
Lines 2–1225 of this extract equal the 2nd Term extract line for line. Only line 1 differs:
- 2nd Term: `SECOND TERM SCHEME OF WORK 2016/2017`
- 3rd Term: `THIRD TERM SCHEME OF WORK ` (trailing space; no year)

The scheme table lists the same nine works in the same order as the 2nd Term scheme (so the 3rd Term scheme names no new content). All ten block hashes below equal the 2nd Term ones. The docx files differ in bytes (57,389 vs 56,647) but not in extracted text, tables or media. The contract allows exclusion only for byte-identical same-term sources, so **no exclusion applies**; each week is indexed in its own right.

## Opening and scheme (lines 1–82)
`THIRD TERM SCHEME OF WORK ` (1), `CLASS: SS1` (3), `LITERATURE – IN – ENGLISH ` (5; trailing space; equals registered `header_text`). Scheme: one 12 × 2 table, lines 7–53, block `98ce4b4f1941cb55af76c05e1e74a3e41ed9a0763b9fe10d2a35d5612925c6a1`. Lines 1–82 block: `0fec1d64acb9512342c16003c6694a2f0de9645499efb796c155eeacb8f5ac5e`. Row wording divergences are those listed in `LIT-INV-T2.md` (`INRODUCTION`, `9.`, `11 – 12 `); recorded, not harmonised.

## Week inventory
| Item | Label (line) | Strand | Lines | Block SHA-256 | Names (exact `TOPIC:` wording) |
|---|---|---|---|---|---|
| W01 | `WEEK ONE` 83 | African drama | 83–241 | `2ec677a55a9701a8838cbb20e80ef8aab5807740d1af2762d33c26034fbd9a68` | `INTRODUCTION TO AFRICA DRAMA – HARVEST OF CORRUPTION` |
| W02 | `WEEK TWO` 265 | African drama | 265–345 | `5849c3e14507e456c06999f4f98e5d5caa2a7d9b451fc5484f63c616125d80e9` | `THE BLOOD OF A STRANGER` |
| W03 | `WEEK THREE` 377 | African poetry | 377–503 | `fd6867988435487fae05ea226165a4ef4952339f8600582301cf706d14dc2e91` | `AFRICAN PEOTRY` (poem `PIANO AND DRUMS`) |
| W04 | `WEEK FOUR` 539 | African poetry | 539–633 | `b2959866c7d1dba0f5b1390b61333d8469e6c8afd11a0d8ac94634c08ce3b08c` | `THE DINNING TABLE (GBANABOM HALLOWELL)` |
| W05 | `WEEK FIVE` 641 | African poetry | 641–755 | `047b8582e461cb5916d04f6bd53a7a5cc10f0fd39b88e9763f6a6c7dfcb451d0` | `THE ANVIL AND THE HAMMER` |
| W06 | `WEEK SIX` 785 | non-African drama | 785–847 | `02626434963c7f4bd45732e649691d15b5efb6e9aafc82433014512cf555475d` | `NON – AFRICAN DRAMA – OTHELLO By Shakespare` |
| W07 | `WEEK SEVEN` 861 | non-African drama | 861–939 | `13ca9dbea132c89d8c5f86966787329f694457f4d81ff2002ea6e891163dc047` | `SHE STOOPS TO CONQUER` |
| W08 | `WEEK EIGHT` 965 | non-African poetry | 965–1113 | `99035d9af9f91feb8019ab23b4274b4cfaace054b4587bf1314388705923946b` | `NON-AFRICAN POETRY` (poem `The Pulley`) |
| W09 | `WEEK NINE` 1115 | non-African poetry | 1115–1223 | `afeb14f07a4de98cf01a9b09e589f0a0caa942c151a36df9678a0f61fdcd0ab8` | `THE SCHOOLBOY` `BY WILLIAMS BLAKES` |

Per-week sections, line-level anchors, typos and flags are those in `LIT-INV-T2.md` (identical lines). Scheme rows 10 `REVISION` (49) and 11 `11 – 12 ` / `EXAMINATION` (51–53) have no body. The word `examination` also occurs once in Week 8 body prose (line 1049, "failure in examination"); it is not a marker.

## What text each section names
Each week names one work in its `TOPIC:` line. The document never says prescribed, set text, edition or page number, so none may be presented as a school-prescribed text. Plays (W01, W02, W06, W07) are supplied as author notes, summary, themes and characters, plus short dialogue-style or quoted passages; the five poems (W03, W04, W05, W08, W09) are supplied in full. No prose-fiction strand. Strands stay separate: African drama (W01–02), African poetry (W03–05), non-African drama (W06–07), non-African poetry (W08–09).

## Markers, visuals, rule findings
- Markers: seven assignment markers at lines 235, 499, 629, 751, 805, 1109, 1221 (same trailing spaces as 2nd Term); none is class work. No schema kind exists for assignment markers; scheme rows 49 and 53 can only be `SCHEME_ONLY`. Findings only; no rule written.
- Visual groups: none. The only table is the scheme (plain text, no merged cells).
- `split_before` / `attach_stranded_label`: not needed (same labels as 2nd Term; read, not run).
- Reuse/attribution checks and possibly inaccurate statements: same locations as `LIT-INV-T2.md` (poems, Palmer commentary, quoted play passages, author biographies, literary-term passages). Source wording stays distinct from any later correction.

## Owner question (blocks nothing in indexing; needed before approval)
**Is the 3rd Term Literature scheme meant to repeat the 2nd Term scheme (same nine works, same notes), or was the wrong file supplied for 3rd Term?**
- A: Intentional repeat → keep as indexed; lessons for 3rd Term may link to the same teaching, with 3rd Term ids.
- B: Wrong file → supply the correct 3rd Term document; this source stays PENDING and no 3rd Term lesson is authored from it.
Until answered, `LIT-FACT-T2-T3-RELATIONSHIP` stays PENDING (this note supplies its evidence).

## Queue changes
- `LIT-INV-T3` → IMPLEMENTED_TESTING_DEFERRED.
- 11 items appended, all PENDING, each depends on `LIT-INV-T3` + `LIT-SRC-T3`: `LIT-PRE-T3` (lines 1–82), `LIT-MARK-T3`, `LIT-WK-T3-W01`…`W09`. No visual item.
- `counts`, `status_counts`, `next_runnable` recomputed. No other item changed (checked by comparing parsed JSON with the base). No package, rule, coverage entry, lesson or asset written.

## Remaining
Next eligible in queue order: `LIT-FACT-T2-T3-RELATIONSHIP`, then `LIT-MARK-T1`; not executed.
