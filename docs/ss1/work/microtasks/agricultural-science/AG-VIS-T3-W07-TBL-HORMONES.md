# AG-VIS-T3-W07-TBL-HORMONES — Agricultural Science, Third Term Week Seven

Status: **IMPLEMENTED_TESTING_DEFERRED**. The source hormone table has been structurally inspected and its cell relationships recorded. No table text or derivative has been copied into learner-facing assets; reuse remains pending rights evidence and factual review.

## Integrity and locator
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact source member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`; 5,406,306 bytes; SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified against the source manifest.
- Table locator: `word/document.xml`, zero-based direct-body block 828 (the 829th direct body child).
- The table is a native Word `w:tbl`, not a picture or other embedded media. It has 8 rows and 4 cells per row; no horizontal/vertical cell merges and no embedded drawing/picture objects.
- Column grid widths: 1,980 / 1,080 / 1,440 / 5,310 twips. The fourth (FUNCTIONS) column is widest.
- The source document core metadata names `AKANDE ANTHONY` as creator; there is no `dc:rights` statement.

## Cell structure and content

The header row is **HORMONE | SEX | SITE OF SECRETION | FUNCTIONS**. Each of the seven data rows retains one hormone and its corresponding sex, secretion site and functions in the same row. Multiple functions are separate paragraphs in the fourth cell, not independent table rows.

| Hormone | Sex (source) | Secretion site (source) | Functions listed in the source |
|---|---|---|---|
| Testosterone / Androgen | Male | Testes | Development of male secondary sexual characteristics; sperm production through spermatogenesis |
| Oestrogen | Female | Ovary | Female secondary sexual characteristics; production of ova/eggs through oogenesis; mammary-gland development |
| Progesterone | Female | Corpus luteum | Uterus development and implantation of the fertilized ovum; inhibition of oestrus/ovulation; mammary-gland development; continuance of pregnancy |
| Oxytocin | Female | Pituitary | Uterine-wall contraction during parturition; milk let-down; claimed aid to sperm transportation in the vagina |
| Relaxin | Female | Pituitary | Relaxation of pelvic ligaments during parturition |
| Follicle stimulating hormone (FSH) | Female | Pituitary | Growth of the ovarian follicle |
| Luteinizing hormone | Female | Pituitary | Secretion of oestrogen and progesterone; follicle rupture and release of ova |

The source claims above are recorded for structural fidelity only. They are not endorsed as accurate or complete animal physiology. In particular, the source assigns FSH/LH only to females, lists relaxin secretion at the pituitary, and says oxytocin aids sperm transportation in the vagina. The existing package blocker `AGRICULTURAL-SCIENCE-T3-W07-HORMONE-ACCURACY` remains the authoritative factual-review gate; this visual-disposition task does not correct or silently rewrite those claims.

## Legibility and layout inspection
- Rendered the source DOCX privately for authoring inspection. The complete table appears intact on source page 28.
- The heading row is legible; “SITE OF SECRETION” wraps to two lines. The long FUNCTIONS text wraps within the wide fourth column.
- The Testosterone/Androgen, Oestrogen, Progesterone, Oxytocin and Luteinizing hormone rows contain multiple function paragraphs in the same cell; FSH and Relaxin have one listed function each. Row heights expand to accommodate the text.
- The table does not split across pages. The preceding introductory sentence is split across pages 27–28, but the table itself is together on page 28.
- Preserve all four columns, all seven hormone rows, and paragraph grouping within each FUNCTIONS cell if a rights-cleared equivalent is authored. Do not flatten cells into a single unlabeled paragraph or reorder the rows.

## Table digest discrepancy
- The task/inventory records table text SHA-256 `dc4ce1cf72d8b6490cf5260a040f348e35fad1b3ab6e6b80b884f0326fe1a3e`.
- Direct concatenation of the 1,148 text characters in the table's `w:t` XML nodes yields SHA-256 `23d71c760fadf5dd5905d5e23e91a46de2c4e0c34845c5c57892c337d20b5cb9`; the recorded digest was not reproduced by this extraction method.
- The composite archive and exact DOCX member hashes both match their manifest values. The table's dimensions, row count, cell contents and locator were independently inspected. Treat the text-digest difference as a metadata/extraction-method discrepancy, not evidence that the source member is corrupt. No source file or recorded digest was changed.

## Rights and reuse decision
- The source table is structured text, not an image; no derivative image is required to preserve it.
- No licence, reuse permission or attribution terms are stated on the page/table or in DOCX core rights metadata. Creator metadata alone is not a reuse grant.
- **Reuse:** do not reproduce the source table verbatim in learner-facing material unless written permission or a licence is obtained.
- **Alternative:** if permission is unavailable, author a new semantic table independently from authoritative, rights-cleared animal-physiology sources, after resolving the existing hormone-accuracy blocker. Preserve the four-column relationship and row mapping without copying the source wording.

## Changes and validation
- Added blocking open item `AGRICULTURAL-SCIENCE-T3-W07-HORMONE-TABLE-RIGHTS` for the source table's unestablished reuse permission.
- Marked `AG-VIS-T3-W07-TBL-HORMONES` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue kind counts, status counts and `next_runnable`.
- Verified archive and DOCX member SHA-256; inspected the table's XML structure, all 32 cells, row/cell mapping, metadata and nearby text; rendered the source page for visual inspection.
- Package and queue JSON parsed; no duplicate open-item or queue-item IDs introduced.
- Importer, compiler, tests, typecheck, learner rendering, app/device display and CI were not run; testing remains deferred.
- No source bytes, media, lesson bodies, asset rows, shared schema/compiler, other subject or delivery assets changed.
