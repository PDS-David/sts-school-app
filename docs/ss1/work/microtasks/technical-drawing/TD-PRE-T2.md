# TD-PRE-T2 — Technical Drawing, 2nd Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `8598344a2f50d2c3e2ccad452e0512c475938cbb` (origin/master). Prerequisite TD-SRC-T2 is implemented on master (PR #117). No open PR or branch owns TD-PRE-T2.
- Source `SS1-SRC-af4868d2c026`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`.
- Member SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` **verified** (2,865,886 bytes; equals `SOURCE_ASSIGNMENTS.csv`).
- Container supplied: the ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip` (member path `2nd Term SS1 /2ND TERM S1 TECHNICAL DRAWING.docx`). Its own SHA-256 is `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, which is not the expected composite archive hash, so **no composite hash check is claimed**; the member hash decides.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call); `word/header1.xml`, `footer1.xml`, `footnotes.xml`, `endnotes.xml` and `document.xml` inspected. Line numbers are 1-based lines of `extractRawText().split('\n')` (4,199 lines). Importer, compiler and parser were not run; the parsed-row boundaries come from `parsed_rows.json`.

## Hash-accounted text outside the 19 parsed rows (SHA-256 of lines joined with `\n`)
| Block | Lines | Content | SHA-256 |
|---|---|---|---|
| PRE-01 | 1–10 | title block: `SECOND TERM E-LEARNING NOTE` (1), registered subject line (3), `CLASS:SS1` (5), `TITLE:SECOND TERM SCHEME OF WORK` (7); lines 2, 4, 6, 8–10 blank | `45128bbd38eb5c8ab57b4f2a54e9e4f1db8831f9f556062dbb853202a13af9d4` |
| line 1 | 1 | title line | `c3a8dc39c250fd530499bc2d27d4d50ed829835a1e586e85165d2d16dad0edd9` |
| line 3 | 3 | subject line (= `header_text`) | `ee0609e28bb736ea14071e7971823fe31673fad23dd566e7299c32c134af7407` |
| line 5 | 5 | class line | `321efdc0673b7dc051a2e8978ab4aeefa7b3d60487ead96e12b876142dd2482d` |
| line 7 | 7 | scheme-of-work title | `0aeaa996930ba45863b782dedf324fb764d602ed958ee350182cdf8db528c707` |

The first parsed row (`WEEK 1:` scheme line) starts at line 11. No text follows the last parsed row: the document ends inside row 18 (last non-blank line 4,193, within "Further evaluation questions"), so there is no trailing block.

## Inside parsed rows, recorded for routing (not preamble)
- Lines 11–31 are scheme-table lines = parsed rows 0–10 (Weeks 1–11; combined SHA-256 `f8a991bc7e7b3eaa4c53839e62bf46bfde07170d8a4808ed926e090644b67a43`), owned by TD-SCH-W01..W11.
- Row 10 (`WEEK 11.Revision and Examination.`) spans lines 31–58 (660 characters raw; 655 recorded by the parser, SHA-256 of lines 31–58 `b36d91d4f02b8ff7e6a2879759cc394d2001db3f3f9f56b1194d5a634316784d`). It contains the `Reference materials:` list (lines 35–54, SHA-256 `0a0da4d2f7cf7fbe8f0d78487b723de5cfaf637c9821feabf8580f42350fbc67`, eight textbook entries). The anchor `Reference materials:` occurs once.
- Line 59 `WEEK ONE … DATE:` begins parsed row 11.

## Header/footer parts (not returned by extractRawText)
- `header1.xml`: a blank `Name / Class` form line; text SHA-256 `c71a57eb63b2833932eb537b9432a507d23ef07fecaac444429cabf913182bc4`.
- `footer1.xml`: a code line, a religious tagline and a page number; text SHA-256 `eaa6b97681cec1dc8914332146fefb80c681944091b37f714d1710ec375127aa`. Text is not reproduced here.
- Footnotes and endnotes: empty. No drawing, picture or object appears before the first `DATE:` line, so there is no cover or letterhead image in the preamble (figures begin inside the week rows; see TD-VIS items).

## Edits
- `technical-drawing.json`: added rule `SS1-SRC-af4868d2c026-R002` (classify_marker SCHEME_ONLY, anchor `TITLE:SECOND TERM SCHEME OF WORK`, occurs once), coverage `COV-TD-T2-TITLE-BLOCK` (MARKER, target R002), open items `TD-T2-REFERENCES-IN-ROW-10` (CONTENT) and `TD-T2-FOOTER-TAGLINE` (OWNER_ACTION), both non-blocking. Source row, alias rule R001 and `TECHNICAL-DRAWING-ALIAS-APPROVAL` unchanged; package stays PENDING.
- `QUEUE.json`: TD-PRE-T2 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.
- The scheme objectives (Weeks 1–11) are deliberately **not** mapped in coverage here; that is TD-SCH-W01..W11.

## Remaining
- TD-SCH-W01..W11 (now runnable), TD-VIS-INVENTORY. Same-file edits should run one at a time; next in order is `TD-SCH-W01`.
- Owner: alias approval, footer confirmation. Compiler dispositions for R002 were not generated (importer deferred).

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
