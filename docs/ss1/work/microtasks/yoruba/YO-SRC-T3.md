# YO-SRC-T3 — Yoruba, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `05afe2ce56c5ce49e8e98fd3fcc255350066cfaf` (origin/master). YO-SRC-T1 and YO-SRC-T2 are implemented on master; no open PR or branch owned YO-SRC-T3 (the only open PR was #160, a Technical Drawing item touching other files).
- Source `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`.
- Member SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3` **verified** (68,373 bytes); equals `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`.
- Container supplied: ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip` (member path `3rd Term SS1 /3RD TERM S1 YORUBA.docx`), own SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`, not the expected composite hash, so **no composite hash check is claimed**; the member hash decides. A 2nd Term ZIP was also supplied and not used.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call); `word/document.xml` w:t runs compared with the extraction; header, footer, footnote and endnote parts read. Nothing from the source is committed.

## Findings
- Opening lines of the extraction (2,463 lines): line 1 `ISE-:EDE YORUBA` + 4 tabs + 31 spaces + `CLASS: SS1`; line 3 `ILANA ISE OSOOSE FUN SAA KETA`; line 5 `Ose: `; line 7 first scheme line. Line 1 is 60 characters with no trailing whitespace; the whole line occurs once (SHA-256 `cd75f590d1060a7b6cefbd92ba58e0bf42064f11a9439b9f0db209a4a1d87504`). `ISE-:EDE YORUBA` and `CLASS: SS1` also occur once each; `YORUBA` alone occurs 10 times (59 case-insensitively), so the full line is used as header_text, as in T2.
- Subject confirmed as Yoruba (the heading names EDE YORUBA, the Yoruba language), class SS1, third term. The next heading reads as the third-term scheme of work, and `word/footer2.xml` carries the code `1GSCHS/3RD TERM/YOR/SS1` (not returned by `extractRawText`). Subject, class and term therefore come from the document, not the filename. No subject discrepancy was found.
- The heading differs from `Yoruba` beyond case and whitespace (label `ISE-:`, prefix `EDE `, class text), so a `source_alias` rule is declared. Its `approval_reference` states mapping support only, not teacher approval.
- **Diacritics: none exist in this document.** The w:t text and the extraction contain only ASCII letters plus U+2019 (×33), U+2013 (×28), U+2018 (×23), U+2026 (×9), U+201C (×2), U+201D (×1); no precomposed tone-marked or subdot letters and no combining marks. Extraction removed nothing, the text is NFC (identical to its NFD form), and no normalization was applied to the anchor or text. This differs from the 2nd Term document, which has precomposed subdot and tone-marked letters.
- Other parts: `header1.xml` is a blank `Name:… Class:…` form line; `footer1.xml`, `footnotes.xml` and `endnotes.xml` are empty. These are not in the extracted text; no text is copied into Git beyond the footer code quoted above.

## Edits
- `yoruba.json`: added the source entry and rule `SS1-SRC-4cc6aae9ed7d-R001`; `YORUBA-OBJECTIVE-INDEXING` affected_ids gained the source and its detail/required_action now name all three registered terms. The 1st and 2nd Term sources, rules and everything else are unchanged; package stays PENDING; lessons, corrections, assets and coverage remain empty.
- `QUEUE.json`: YO-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; status counts recomputed; `next_runnable` → `YO-INV-T1`. The earlier registry-equality statement in this item's `implementation_reference` is replaced by the implementation record, as for T2.

## Remaining
- All three assigned Yoruba sources are now registered. Source-week inventory (YO-INV-T1, T2, T3), objective indexing, coverage and lessons are not started; none is claimed. Same-file edits should run one at a time; next in order is `YO-INV-T1` (YO-INV-T2 and YO-INV-T3 are also runnable).

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
