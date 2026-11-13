# Primary 4 curriculum completion and archive reconciliation

**Class:** Primary 4  
**Original archive:** `BASIC FOUR-20260507T065839Z-3-001.zip`  
**Archive SHA-256:** `69731806a1c59185a4d5f8f408cb87fb0897778265d654676e134615b88d4da5`

## Archive inventory and source identity

- Outer ZIP: 44 entries, including 41 Word documents and 3 nested ZIP archives.
- The 41 outer Word entries contain 7 byte-identical duplicate pairs, leaving 34 distinct outer Word files.
- The nested ZIPs contain 28 further Word entries. Twenty-seven are byte-identical copies of files already present; one is a distinct First-Term Agricultural Science document.
- Recursive total: 69 Word-file entries, 35 distinct document byte streams.
- The 248-row Primary 4 database export covers 28 of the 33 subject-term combinations across the 11 assigned subjects.
- `BASIC FOUR/3rd Term Basic 4/BASIC SCIENCE THIRD TERM PRY 4.docx` is headed **BASIC TECHNOLOGY THIRD TERM PRIMARY 4**. Its content is Basic Technology and is assigned accordingly; it is not treated as Basic Science.

## Five source-missing combinations completed

The supplied archive contains no original source document for these combinations. They now have 38 clearly labelled, newly authored researched lessons. These are not described as recovered or verbatim archive notes.

| Subject and term | Lessons | Curriculum basis |
|---|---:|---|
| Home Economics — First Term | 9 | Lagos State Unified Scheme of Work |
| Home Economics — Second Term | 9 | Lagos State Unified Scheme of Work |
| Basic Science — Third Term | 5 | NERDC Primary 4 Basic Science |
| Basic Technology — First Term | 4 | NERDC curriculum plus approved local term allocation |
| Basic Technology — Second Term | 4 | NERDC curriculum plus approved local term allocation |

The Basic Science Third-Term package now covers all five Primary 4 topic areas absent as distinct records in the supplied export: Safety in Our Environment, Human Body (the mouth), Water, Water Cycle and Measuring Liquids. NERDC does not prescribe term placement; the user has approved this local Third-Term allocation.

NERDC does not prescribe a First/Second-Term allocation for the additional Basic Technology progression. The user has approved the clearly labelled local allocation. It is not represented as an official NERDC term assignment. The original Third-Term Basic Technology source remains preserved.

All 38 lessons have explicit owner approval, pedagogical verification, and assessment-rebuild verification in their provenance. The package tests enforce these gates and verify that each lesson has objectives, explanatory notes, examples, an activity and evaluation prompts.

## Export/source reconciliation

Each exported topic was compared with the canonical Word document selected by subject and term. Normalized token-presence coverage is a triage measure, not a semantic or pedagogical quality score.

- 227 of 248 records have at least 95% token-presence coverage.
- 21 records fall below 95%. Manual inspection found that these records do contain lesson-level source text; the lower token ratio is caused by comparing an individual lesson block with a larger multi-topic document or outline. Two short teaching notes within this group were strengthened by the Roman Numerals and English My Family corrections. The 21 records are not treated as 21 missing topics.
- The source-length audit flagged 45 records: 22 `HIGH_SHORT_SOURCE` and 23 `SHORT_SOURCE_REVIEW`.
- All 45 length-flagged rows now have an explicit disposition: 32 are replaced with expanded lesson notes and 13 are suppressed as superseded outline/merged rows. Three additional superseded rows are also hidden, giving 16 hidden IDs total.
- Length flags are triage indicators, not a lesson-quality verdict. The coverage tests assert that no length-flagged row is left without a correction or an explicit suppression.

## Source parser corrections

### Basic Science — First Term

The canonical source is `1st termBasicscience4.docx`. It begins with a short scheme outline, then detailed lesson notes. The detailed section uses malformed headings such as `WEEK: WEEK 2`. The source resolver now selects the detailed section and normalizes the exact source's malformed week headings so the shared parser can split lesson blocks correctly.

### Cultural & Creative Arts — First Term

The canonical source is `PRY 4 CCA First term E.docx`. It contains a scheme outline followed by detailed lesson notes. The previous exact-source rule kept the outline and truncated the detailed section. The source resolver now retains the detailed lesson section. A regression test confirms that detailed content and later week markers survive while the preceding scheme outline is excluded.

### Home Economics — Third Term

The canonical source is `PRY 4 HOME ECONS RD TERM.docx`. It contains an 11-week outline followed by 10 detailed lesson blocks. The outline-only records are suppressed from student delivery where detailed lessons are present; original rows remain available for staff audit.

## Approved archive-based lesson corrections

The delivery-only correction package now contains **33** newly authored lesson-note replacements mapped to exact existing topic IDs and original exported row identities:

- Basic Science First Term: 11 topics.
- Cultural & Creative Arts First Term: 12 topics.
- Mathematics First Term: 8 topics, including an expanded Roman Numerals lesson.
- English Language: 2 topics.

These replacements are newly authored from the archive topic sequence and source material, not verbatim reproductions. Each correction has owner approval and pedagogical verification. The original topic IDs are preserved; no replacement topic rows are inserted.

The 16 superseded rows remain hidden from students/parents but visible to staff for audit: Basic Science First-Term outline/revision/merged rows, CCA First-Term outline/revision/exam, and Home Economics Third-Term outline-only rows.

## Assessment rebuild behaviour

When a corrected or researched Primary 4 lesson is opened through the learning route:

1. The delivery layer verifies the exact topic identity and approved source fingerprint.
2. Any linked assessment whose stored content fingerprint does not match the approved lesson is closed and tagged as withdrawn.
3. The stale cached lesson summary and assessment link are cleared.
4. The learning route regenerates the lesson summary and a fresh five-question standard assessment from the approved lesson source on the next topic-completion request.
5. Assessment question retrieval, submission and answer review reject stale or withdrawn Primary 4 assessments.

The tests verify the source fingerprint, stale assessment retirement, topic-link clearing, and rejection of an assessment built from old lesson content. The production database is not directly connected in this session, so existing live rows are not bulk-updated here; the deployed learning route performs this rebuild safely when the affected lesson is next accessed.

## Verification

The Primary 4 CI workflow runs:

- focused Primary 4 tests, including source parser regressions, package approval checks, all 45 source-flag dispositions and assessment retirement;
- the 33-combination coverage audit;
- the backend TypeScript build.

The final run for this completion branch must pass before the changes are merged.

## Safety and provenance

- No production database rows, schema migrations, environment variables or deployment settings are modified by this branch.
- No ingestion with `--yes` is run.
- The original Word archive hash and duplicate inventory are retained above. Exported `source_reference` hashes in `sourceManifest.json` are distinct from the original Word-file hashes.
- The 38 researched lessons and 33 archive corrections are newly authored content with source attribution; they are not represented as copied textbook pages.
