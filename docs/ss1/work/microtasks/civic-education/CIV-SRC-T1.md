# CIV-SRC-T1 — Civic Education, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `346cea5f0348a990d12be92b1418c93f6f0c51ca` (origin/master); no open PR or branch touched this item.
- Source `SS1-SRC-fe52495abec9`, manifest member `SSS 1/1st Term SS1_/CIVIC SSS1.docx`.
- Member SHA-256 `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (24,152 bytes).
- Read from the "1st Term SS1" zip (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`, member path `1st Term SS1 /CIVIC SSS1.docx`), as the owner directed. The same member bytes were also confirmed in the composite archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, verified).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). Nothing from the source is committed.

## Findings
- Opening text: `ALPHA TERM SCHEME OF WORK FOR SS1`, blank line, `CIVIC EDUCATION`, then the week table (introduction to civic education, values, community service, HIV/AIDS, youth empowerment).
- Subject confirmed from the header as Civic Education; no handoff needed. The document says "ALPHA TERM", not "1st Term"; the term comes from the manifest folder.
- `CIVIC EDUCATION` alone occurs 6 times, so the two-paragraph heading is the unique header_text and needs a `source_alias` (same pattern as Biology). No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/civic-education.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `CIVIC-EDUCATION-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: CIV-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. Source has no coverage until indexing.
- Runnable items edit the same package file; run them one at a time.
