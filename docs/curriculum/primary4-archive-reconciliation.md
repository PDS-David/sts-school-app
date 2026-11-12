# Primary 4 original archive reconciliation

**Archive:** `BASIC FOUR-20260507T065839Z-3-001.zip`  
**Archive SHA-256:** `69731806a1c59185a4d5f8f408cb87fb0897778265d654676e134615b88d4da5`

## Inventory

- Outer ZIP: 44 entries, including 41 Word documents and 3 nested ZIP archives.
- The 41 outer Word entries contain 7 byte-identical duplicate pairs, leaving 34 distinct Word files.
- The nested ZIPs contain 28 further Word entries. Twenty-seven are byte-identical copies of files already present; one is a distinct First-Term Agricultural Science document.
- Recursive total: 69 Word-file entries, 35 distinct document byte streams.
- The 248-row Primary 4 database export covers 28 of the 33 subject-term combinations across the 11 assigned subjects.

## Five subject-term combinations without an original source document

- Home Economics — First Term
- Home Economics — Second Term
- Basic Science — Third Term
- Basic Technology — First Term
- Basic Technology — Second Term

These gaps are not filled by the supplied archive. Any replacement lessons for them must remain clearly identified as researched/newly authored material, not archive-derived notes.

## Confirmed source identity

`BASIC FOUR/3rd Term Basic 4/BASIC SCIENCE THIRD TERM PRY 4.docx` is headed **BASIC TECHNOLOGY THIRD TERM PRIMARY 4**. Its content covers Basic Technology and must remain assigned to Basic Technology, not Basic Science.

## Source/export reconciliation

Each exported topic was compared with the canonical Word document selected by subject and term. Normalized token-presence coverage is a triage measure, not a semantic or pedagogical quality score.

- 227 of 248 records have at least 95% token-presence coverage.
- 21 records fall below 95% and need closer source reconciliation.
- The existing source-length audit flags 45 records: 22 `HIGH_SHORT_SOURCE` and 23 `SHORT_SOURCE_REVIEW`. The flagged records are concentrated in Basic Science First Term (12), CCA First Term (13), English Language First Term (1), English Language Third Term (1), Home Economics Third Term (11), and Mathematics First Term (7).
- Length flags are not proof of incompleteness. The archive confirms that several are scheme-outline rows for which fuller lesson notes exist elsewhere in the same document; others are genuinely skeletal lesson notes and need expansion.

## Ingestion defects found

### Basic Science — First Term

The canonical source is `1st termBasicscience4.docx`. It contains a week-by-week outline followed by lesson notes. The detailed section uses headings such as `WEEK: WEEK 2`. The current parser does not recognise that doubled form as a week marker. The export consequently contains short outline rows and merged/missing detailed week rows. The document has detailed material for the early weeks; later outline topics still need lesson-level content.

### Cultural & Creative Arts — First Term

The canonical source is `PRY 4 CCA First term E.docx`. It contains a scheme outline followed by detailed lesson notes. The current exact-source rule in `primaryCurriculumResolutions.ts` truncates the file at the start of the detailed section, retaining the outline instead of the teaching notes. The detailed section contains notes for Weeks 1–8 and Week 13; the scheme topics for Weeks 9–12 need separate completion.

### Home Economics — Third Term

The canonical source is `PRY 4 HOME ECONS RD TERM.docx`. It contains an 11-week outline followed by 10 detailed lesson blocks (Weeks 2–11). The export includes both the outline rows and detailed lesson rows. The outline-only records should be suppressed from student delivery where the corresponding detailed lessons are present.

## Delivery correction package prepared

A delivery-only correction package now contains 32 newly authored lesson-note replacements mapped to exact existing topic IDs and original exported row identities:

- Basic Science First Term: 11 topics (Changes in Nature through Measuring Time)
- Cultural & Creative Arts First Term: 12 topics (Arts and Design through Musical Instruments)
- Mathematics First Term: 7 topics (Ordering Fractions through Decimal Operations)
- English Language: 2 topics (My Family composition and Antonyms)

The package does not insert new topic rows. It replaces the source text and corrects learner-facing titles only after approval. All 32 corrections currently have `PENDING_OWNER_REVIEW` and `assessment_rebuild_status=PENDING`; they remain withheld from student delivery until both approval and assessment regeneration are completed.

Sixteen superseded rows are hidden from students/parents but retained for staff audit: Basic Science First-Term revision/merged rows, CCA First-Term revision/exam, and Home Economics Third-Term outline-only rows.

## Required next corrections

1. Correct the Primary 4 source resolution for Basic Science First Term and CCA First Term, with regression tests.
2. Preserve source provenance and original topic IDs when reconstructing detailed lesson notes.
3. Suppress duplicate outline-only Home Economics Third-Term rows from student delivery without deleting the original audit records.
4. Complete missing lesson-level material for Basic Science First-Term later weeks, CCA First-Term Weeks 9–12, and the short Mathematics/English records that remain outline-level.
5. Keep researched term allocations and newly authored content explicitly labelled and gated until owner approval.
6. Re-run focused Primary 4 tests, coverage audit, backend build, and a dry-run against the extracted archive before any database import.

## Safety

This reconciliation does not modify production data, database schema, environment variables, or deployment state. No import should be run with `--yes` until the corrected source mapping, topic counts, and owner-approved lesson packages have been verified.
