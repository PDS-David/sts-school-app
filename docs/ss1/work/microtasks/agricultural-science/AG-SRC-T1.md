# AG-SRC-T1 — Agricultural Science, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `9ea92b594014d0eb515622ec23373af0c296f972` (origin/master); no open PR touched this item.
- Source `SS1-SRC-7aa642b0085b`, member `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`.
- Member SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (1,076,843 bytes).
- Enclosing archive supplied: a "1st Term SS1" zip, SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`. It is **not** the composite archive (`024487…65c9a3e`), so the composite hash was **not checked**.
- Method: the member was read from its `word/document.xml`; nothing was extracted to Git. The importer/mammoth output was not generated (deferred).

## Findings
- First text paragraph: `FIRST TERM E-LEARNING NOTE` (occurs once). One image-only paragraph precedes it.
- Next paragraph: `SUBJECT:  AGRICULTURAL SCIENCE` … `CLASS:  SS1` — confirms the subject and class; the scheme-of-work topics are agricultural.
- Header-level only; no week inventory or objectives were recorded (see AG-INV-T1).

## Edits
- Created `backend/src/db/ss1/subjects/agricultural-science.json`: PENDING envelope, this one source, `source_alias` rule `SS1-SRC-7aa642b0085b-R001` (approval_reference `PENDING-OWNER`, no approval invented), open item `AGRICULTURAL-SCIENCE-ALIAS-APPROVAL` (OWNER_ACTION, blocks delivery). Lessons, corrections, assets and coverage are empty.
- Updated `QUEUE.json`: AG-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; counts recomputed; `next_runnable` → `AG-SRC-T2`.

## Remaining
- Owner alias approval (open item). Source has no coverage yet: blocker stays until indexing.
- Runnable next: `AG-SRC-T2`, `AG-SRC-T3`, `AG-INV-T1` (all depend only on this item; same-subject edits should run sequentially).
