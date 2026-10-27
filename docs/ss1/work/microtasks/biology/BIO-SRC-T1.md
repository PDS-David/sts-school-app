# BIO-SRC-T1 — Biology, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `b2c5c61d47f34fef38bc44890e04d9816e5812bf` (origin/master); no open PR touched this item.
- Source `SS1-SRC-422e0e6ddde9`, member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`.
- Member SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (957,703 bytes).
- **Composite archive not supplied with this task.** The member was read from the "1st Term SS1" zip supplied earlier in the session (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`). The composite archive hash (`024487…65c9a3e`) was **not checked**. The owner had authorised a standalone/term-archive source only for AG-SRC-T1; its use here is a deviation to confirm.
- Method: member text extracted with `mammoth.extractRawText({path})` (the importer's own call; mammoth installed in a scratch directory). Nothing from the source is committed.

## Findings
- Opening text: `BIOLOGY`, blank line, `SCHEME OF WORK S S ONE`, then the scheme (Weeks 1–10).
- `BIOLOGY` alone occurs twice (also within `BIOLOGY AND INQUIRY`), so the two-paragraph heading is the unique header_text; it needs a `source_alias` (same pattern as French).
- Subject confirmed by the heading and teaching content (Week One: biology and inquiry). No week inventory or objectives recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/biology.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `BIOLOGY-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: BIO-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; counts recomputed; `next_runnable` → `BIO-SRC-T2`.

## Remaining
- Owner alias approval; confirm the term-archive source use. Source has no coverage until indexing.
- Runnable next: `BIO-SRC-T2`, `BIO-SRC-T3`, `BIO-INV-T1` (sequential edits to the same files).
