# Implemented replacement teaching — 16 October 2026

78 attributed supplements (including eight from the CCA, French, Social Studies and Music review batch) are now executable through the existing importer. They supply actual teaching, exercises and answer/assessment guides, rather than links alone. `backend/src/db/data/jss3Supplements.json` is the authoritative new content. `IMPLEMENTED_LESSONS.csv` maps each lesson to its gaps, destination, stable order and exact executable-body hash. `CURRENT_COVERAGE.csv` preserves all 63 historical IDs without overwriting R9.

## Verified plan

| Plan | First | Second | Third | Total |
| --- | ---: | ---: | ---: | ---: |
| Original sources | 151 | 162 | 0 | 313 |
| With supplements | 170 | 184 | 0 | 354 |

Computer Studies remains zero. All 313 original row objects are exactly unchanged, including bodies, titles, source files and order indexes. Two main() captures matched the unmodified importer's stdout. Original heading holds remain held; their ten objectives have separately identified teaching replacements. Existing Music and Basic Technology asset identities do not shift.

The importer requires all 39 reviewed source filenames in their correct JSS3 terms when supplements are requested. It rejects primary batches, missing destination buckets, duplicate IDs, duplicate application, Third-Term instruction, unsupported subjects and missing attribution. Existing original-source audit gates remain active. The complete combined-source run passed without a database connection.

The five missing textbook references now have self-contained new reading/grammar exercises. They do not copy complete British Council passages or claim Oxford editions/pages. This supersedes the earlier catalog's proposed exact reading selections. The complete public-domain texts of O. Henry's *The Gift of the Magi* and Chekhov's *The Proposal* (Julius West translation) are included in their lesson bodies, with separate guides and original questions. Downloads, selection boundaries, hashes and license copies are in `literature/`. New Yoruba short story, poem and dictation are clearly identified as original classroom practice, not traditional or government-prescribed texts.

The scale/blueprint, proofreading and simple/compound-time lessons have original PNG teaching graphics, manifests, hashes and a reproducible generator in `curriculum-assets/jss3/supplements/`. All three graphics were visually inspected at full size. This is not a claim of phone acceptance.

The complete licensed Yoruba story *Ramúramù ewúrẹ́* by Olajide Akoni is now included, with attribution, CC BY 4.0 notice and new JSS3 analysis tasks. Its original reading level is stated; it is not represented as a prescribed BECE book. Inheritance and naming lessons cite NOUN course sections.

## Run the reviewable plan

From repository root, with the previously verified 39-source layout (including the supplied Music DOCX):

```bash
node --import tsx backend/src/db/ingestTopics.ts --root /path/to/ALL --school-code secondary --jss3-supplements
```

Omitting the flag reproduces the original-source 313-row plan. The flag is explicit so historical audits remain reproducible and incomplete source batches cannot silently acquire JSS3 content. New lessons append within each subject/term bucket, preserving every existing topic/asset identity. They are First/Second-Term supplementary teaching, not new Third-Term weeks. Use the coverage map to schedule them before the term's assessment.

After a separately authorised curriculum import, preview the three new asset attachments against the intended database:

```bash
node --import tsx backend/src/db/attachTopicAssets.ts --manifest curriculum-assets/jss3/supplements/BASIC_TECH_MANIFEST.csv --assets curriculum-assets/jss3/supplements --subject "Basic Technology" --class-name "JSS 3" --term-label "1st Term"
node --import tsx backend/src/db/attachTopicAssets.ts --manifest curriculum-assets/jss3/supplements/BUSINESS_MANIFEST.csv --assets curriculum-assets/jss3/supplements --subject "Business Studies" --class-name "JSS 3" --term-label "2nd Term"
node --import tsx backend/src/db/attachTopicAssets.ts --manifest curriculum-assets/jss3/supplements/MUSIC_MANIFEST.csv --assets curriculum-assets/jss3/supplements --subject "Music" --class-name "JSS 3" --term-label "1st Term"
```

All three target order 12 in their respective buckets, with exact title guards. Asset commands above are previews; no `--apply` is included. A code push is not a production curriculum import. Existing database mismatch checks are not bypassed.

## Limits that remain

- One multi-strand Yoruba entry remains partial: YO-T1-W2 oral-performance text scope. YORUBA_OBJECTIVE_MAP.csv verifies 24 scheme-strand links with exact source hashes, table locators, supporting body hashes and character anchors. Six formerly partial entries now have explicit original-body/replacement mappings, including four attributed lineage-praise excerpts. Replacement literature is not claimed to be the unidentified government-prescribed book. A web candidate confusing lineage praise with deity/animal praise was rejected.
- Five provenance/mapping entries remain explicit. Original ordinals and destinations are preserved; new material does not prove a missing original heading.
- Remaining source-line candidate dispositions still need review. The agricultural excursion and Music example now have separate complete replacements, documented in WIDER_WORKSTREAMS.csv. The Music example distinguishes the two main beats of 6/8 from its six quaver divisions. Practical participation and musical performance are not certified by the written material.
- The earlier 2,233 raw-source candidate rows were equal before/after the earlier integration. That is not an authoritative identification of the historical certified 2,179 database rows. This change has no production database writes.
- Device readability/animation and the exact production migration/import remain unperformed. Practical hockey/Taekwondo and pronunciation need observed performance; an online written answer does not certify movement or speech competence.

This delivery materially implements replacements. It does not declare all of JSS3 certified or live.

## Latest source-line triage

`../LATEST_SOURCE_LINE_DISPOSITION.csv` retains all 585 historical candidate IDs. Of these, 113 are document/reference lines, 102 have text-presence matches, 29 link to objective maps, one links to the excursion replacement, six are structural week labels, and six retain prior observations. **328 require semantic review.** Text-presence matches are explicitly not coverage certificates. The original reconciliation file is unchanged.

Reproduce objective anchors with `python scripts/jss3/map_yoruba_objectives.py --sources /path/to/ALL --rows /path/to/supplemented-rows.json`; reproduce conservative source-line triage with `python scripts/jss3/reconcile_source_lines.py --rows /path/to/supplemented-rows.json`. Both consume the captured executable rows; neither connects to a database.
