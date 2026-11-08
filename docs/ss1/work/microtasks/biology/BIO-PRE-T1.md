# BIO-PRE-T1 — Biology, 1st Term preamble and scheme (blocks 0-12)

Status: **IMPLEMENTED_TESTING_DEFERRED** (record only; not approved, not verified). Nothing was run: no importer, compiler, zod parse, test, typecheck, database or device. No package, rule, coverage, lesson, correction or asset was written.

## Inputs
- Base: origin/master `697ee2f` (fetched 2026-11-08). Agent A2. Claim held on `biology`.
- Archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx` SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`: both verified equal to the queue before parsing.
- Locator rule unchanged from BIO-INV-T1: `word/document.xml`, block = direct child of `w:body`, 0-based (1,106 blocks; block 1105 is `w:sectPr`), text = concatenation of `w:t` runs, UTF-8, no normalisation, range hash = block texts joined with `\n`, empty blocks included.
- Reproduced: range 0-12 = `5e35e4ce64e6bf70cf09fd56ca0a7d14e8a55fb4da727d8a4d3dfa187c95202c` (equals the queue value).

## Block map
| Block | Text (verbatim) | Block SHA-256 | Classification | Where it is handled |
| --- | --- | --- | --- | --- |
| 0 | `BIOLOGY` | `9bdc62601f52570ee012e25a8882128c13360df285b3d0ff1c7fb9b94507b51f` | title; first line of registered `header_text` | `biology.json` source `SS1-SRC-422e0e6ddde9` (header_text `BIOLOGY\n\nSCHEME OF WORK S S ONE`); alias approval open item `BIOLOGY-ALIAS-APPROVAL` |
| 1 | `SCHEME OF WORK S S ONE` | `a06733878c404afb306873ef37e1a2bba94880b982648da73d2d4b5e4c25b5e9` | class line; second line of `header_text` | same |
| 2 | `Week 1 -Recognizing Living things` | `b6fa7da3944e18a573ba816bd780fc8033197df0c554893a8e6c891e55a6b383` | scheme line 1 | already mapped: `COV-BIO-T1-W01-SCHEME-1`; BIO-WK-T1-W01 |
| 3 | `Week 2 -Living things and non-living things` | `046f1ca8950cb6ab6a05ba314bcc5a5b61ffd35f81caa7eef9f8529e2d8258be` | scheme line 2 | already mapped: `COV-BIO-T1-W02-SCHEME-2`; BIO-WK-T1-W02 |
| 4 | `Week 3 -Classification of Living things` | `90846288953e56236069142972ddfd5b1db1e76a5d61e83007ecc1f7af34b813` | scheme line 3 | BIO-WK-T1-W03 (pending) |
| 5 | `Week 4 -        Organization of life` (eight spaces after the hyphen) | `588337efbfccb7f5e67be12cba53b91278499230039352f1cede4071495f58ce` | scheme line 4 | BIO-WK-T1-W04 (pending) |
| 6 | `Week 5 -Plant Nutrition` | `a7311d7898eea52bee2c7fd42c342dbcfcff6915e60599cf3cf37e3ef116ea53` | scheme line 5 | BIO-WK-T1-W05 (pending) |
| 7 | `Week 6 - Nutrient cycling in Nature` | `c2c9d6de15c9e85f2424f85a328436ae6ff161dbde8bde99962005840f02280e` | scheme line 6 | already mapped: `COV-BIO-T1-W06-SCHEME-6`; BIO-WK-T1-W06 |
| 8 | `Week 7 -Nutrition in Animals` | `d0bd685e636204acea325dde295cd9b42df7e4b91ac23cfb319c33fc2b0c109d` | scheme line 7 | BIO-WK-T1-W07 (pending) |
| 9 | `Week 8 -Mode of Nutrition` | `ad6d990b444dc21fd579eac3924771ea05fc8c1a0f780f549e1af8868a0e13fa` | scheme line 8 | BIO-WK-T1-W08 (pending) |
| 10 | `Week 9 - Basic ecological concept` | `d1280651e04f2949bdf20742f3d11e06ded8d319bde136b880fa79bbe9c33e72` | scheme line 9 | BIO-WK-T1-W09 (pending) |
| 11 | `Week 10 -Growth, Irritability and Movement ` (trailing space) | `a978ff61f7d1d5d23a8c74052effefeecb2ab9dd65c926c9c29d25af44a0f28f` | scheme line 10 | BIO-WK-T1-W10 (pending) |
| 12 | one space | `36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145068` | blank separator | none; not teaching |

Sub-range hashes: blocks 0-1 `7b5751b4a82eca8d4c042c2af4b56b3068bd5df4f6a91eaeb8c870d4fd308321`; scheme blocks 2-11 `d8caa35cb1bdf465beb5a6f937c10942a92ce098a7a1c3cd45fcc907e1b05b61`. The registered two-paragraph `header_text` (blank line between) hashes to `5495edf737adf79154a12ce0330f8bfd58cfe87b437befb2db49a59a64c6c75f`.

Every block 0-12 is accounted for. The scheme lines are plain paragraphs with no list numbering and no drawings, shapes or tables in the range. The week bodies start at block 13 (`WEEK ONE`).

## Findings (not adjudicated)
- Scheme spacing is inconsistent: block 5 has eight spaces after the hyphen, blocks 7 and 10 one space, the others none; block 11 ends with a space. Kept as written.
- Scheme lines use `Week <n>` with digits, while body labels mix words and digits (`WEEK ONE`, `WEEK 6`, `WEEK SEVEN`; BIO-INV-T1). Whether the importer treats the scheme lines as separate rows is **unverified**; BIO-WK-T1-W02 records that its reproduced generic parse gave ten scheme-line rows. This item did not reproduce that parse.
- Scheme titles and body headings agree in substance except Week 1 (scheme `Recognizing Living things`, body `BIOLOGY AND INQUIRY`, already recorded as `BIOLOGY-T1-W01-SCHEME-BODY-MISMATCH`) and Week 7 (scheme `Nutrition in Animals`, body heading `ANIMAL NUTRITION (FOOD SUBSTANCES)` at block 836); Week 10 scheme `Growth, Irritability and Movement` against body heading `GROWTH` (block 986) is for BIO-WK-T1-W10 to confirm.
- No REVISION, EXAMINATION or references text exists anywhere in the document (BIO-INV-T1). No header, footer, comment, tracked change, footnote or endnote text was found in the package parts (`word/` has no header or footer part; `commentsExtended.xml` and `people.xml` are present but the body has no comment references).
- Blocks 0-1 and 12 need no coverage entry: the title and class line are registered as the source header, and block 12 is blank. No new open item is needed; the header alias remains the owner action `BIOLOGY-ALIAS-APPROVAL`.

## Edits
- `QUEUE.json`: BIO-PRE-T1 -> `IMPLEMENTED_TESTING_DEFERRED`; status_counts, next_runnable and one note updated; no other item changed.
- This file. `biology.json` not touched.
- Authoring checks only: JSON parse and round trip, unique IDs, dependency resolution, recount, diff limited to the two allowed paths.

## Remaining
`BIOLOGY-ALIAS-APPROVAL` is still an owner action. Pending scheme blocks 4, 5, 6, 8, 9, 10, 11 are for BIO-WK-T1-W03, -W04, -W05, -W07, -W08, -W09 and -W10. No subject or class completion is claimed.
