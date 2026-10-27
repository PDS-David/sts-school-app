# CC-SRC-T2 — Catering Craft, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `436c047e591e93fd04aa12c35ea999d54fb5f3a1` (origin/master); no open PR or branch touched this item.
- Source `SS1-SRC-f433169ca25c`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Member SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (207,872 bytes).
- **Composite archive not supplied.** The member was read from the "2nd Term SS1" zip (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, member path `2nd Term SS1 /2ND TERM S1 CATERING CRAFT PRACTICES.doc`). The composite hash (`024487…65c9a3e`) was **not checked**. Use of this term archive is a deviation for the owner to confirm. The `archive_member` in the package is the manifest value verbatim.
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy was read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `SECOND TERM E-LEARNING NOTE`, then `SUBJECT:  CATERING CRAFT PRACTICE<tabs/spaces>CLASS:  SS 1`, `SCHEME OF WORK` and a 12-row week table.
- Subject confirmed from the header as Catering Craft Practice, not Food and Nutrition; no handoff needed. Content is food commodities and cooking methods.
- The full subject line occurs once, so it is the unique header_text (`CATERING CRAFT PRACTICE` alone occurs twice). It differs from "Catering Craft", so a `source_alias` is declared. No 1st Term scheme is created or implied. No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/catering-craft.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `CATERING-CRAFT-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: CC-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; status counts recomputed; `next_runnable` → `CC-SRC-T3`, `CC-INV-T2`.

## Remaining
- Owner alias approval; confirm use of the term archive. Source has no coverage until indexing.
- Runnable next items edit the same package file; run them one at a time.
