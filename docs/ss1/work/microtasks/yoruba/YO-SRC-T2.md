# YO-SRC-T2 — Yoruba, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `616a5370fa7a6f29deda3578cc0ef1312f8721ed` (origin/master). YO-SRC-T1 is implemented on master; no open PR owns YO-SRC-T2.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`.
- Member SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **verified** (66,197 bytes); equals `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`.
- Container supplied: ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip` (member path `2nd Term SS1 /2ND TERM S1 YORUBA.docx`), own SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, not the expected composite hash, so **no composite hash check is claimed**; the member hash decides.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read with `mammoth` 1.12.2 `extractRawText({path})`; `word/document.xml` w:t runs compared with the extraction. Nothing from the source is committed.

## Findings
- Opening lines: line 3 `SECOND TERM E-NOTE`; line 5 `SUBJECT; YORUBA.` + six tabs + `CLASS-; SS1`; line 7 `ILANA ISE OSOOSE FUN SAA KEJI`; line 9 first week heading. The subject line occurs once (SHA-256 `7f60b3e1794cd6ae3378d951088a300853029505c79bd2ca1326d51bfe2d5bcc`, no trailing whitespace); `YORUBA` case-insensitively occurs on 67 lines.
- Subject confirmed as Yoruba, class SS1, second term, from the document itself. The heading differs from `Yoruba` beyond case/whitespace (labels, full stop), so a `source_alias` is declared; its `approval_reference` states mapping support only.
- Diacritics: precomposed tone-marked and subdot letters (ẹ ×6, ọ ×4, acute/grave vowels, ń) are present and identical in the XML and the extraction; extracted text is NFC, no combining marks, no normalization applied. One U+00AD soft hyphen appears in the extraction (line 1053) but not in the w:t runs.
- `header1.xml`, `footer1.xml`, `footer2.xml` exist; not inspected (out of scope for this item).

## Edits
- `yoruba.json`: added the source entry and rule `SS1-SRC-ec4a5095420d-R001`; `YORUBA-OBJECTIVE-INDEXING` affected_ids gained the source and its detail now names both registered terms. The 1st Term source and rule are unchanged; package stays PENDING.
- `QUEUE.json`: YO-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- YO-SRC-T3 and the source-week inventory items; no coverage or lessons exist. Same-file edits should run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
