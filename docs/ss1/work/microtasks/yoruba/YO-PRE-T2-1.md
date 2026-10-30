# YO-PRE-T2-1 — Yoruba, 2nd Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The 2nd Term front matter is classified **SCHEME_ONLY**, not as teaching text: two MARKER coverage entries and one `classify_marker` rule record it, the page header and footers outside `extractRawText` are recorded with their hashes, and one open item keeps the term-wide confirmation and the lost automatic list numbering with the owner. No lesson, asset or delivery change.

## Inputs
- Base: `5de3001`, the `ss1/yo-wk-t2-w11` tip after the owner merged PR #226 (W12) into it. No PR was open when work started. The owner has merged #211 (W02), #212 (W03), #213 (W04), #215 (W05), #216 (W06), #218 (W07), #220 (W08), #222 (W09), #223 (W10), #224 (W11), #226 (W12), #219 (W01) and #214 (the 1st Term preamble), and also merged #225, an owner-opened PR from `ss1/yo-wk-t2-w04` to master, so `origin/master` is `779b829` and now contains Weeks 1-4 only; Weeks 5-12 exist only in the stacked branches. This branch is stacked and its PR targets `ss1/yo-wk-t2-w11`.
- Prerequisite `YO-SRC-T2` is `IMPLEMENTED_TESTING_DEFERRED`. `YO-PRE-T2-1` was the `next_runnable` recorded by Week 12.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run** from the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`).
- Method (private, outside Git): the same mammoth 1.12.2 `extractRawText` output as Weeks 1-12 (53,525 characters, 2,433 lines), plus the DOCX parts (`word/document.xml`, `word/header1.xml`, `word/footer1.xml`, `word/footer2.xml`, `word/_rels/document.xml.rels`, `word/numbering.xml`) read directly. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8; part hashes are over the unchanged file bytes. The importer, parser and compiler were not run.

## Front-matter blocks
- The document opens at line 3 and reaches the first teaching label at line 149 (`\t\t\tOSE KINNI`, SHA-256 `b7e9218db066e7bbdddb0fb05a076de376ecb45fe31923e958c4f8133f2d6989`). The front matter is lines 3-141; lines 142-148 are whitespace only (142 and 144-148 empty, 143 is three tab characters), so no text sits between the scheme and the first section.

| Element | Lines | Characters | SHA-256 |
|---|---|---|---|
| Title `SECOND TERM E-NOTE` | 3 | 18 | `f79e08bd1b5aee7b204e71b0d86d8488df0ee4f980f6848177c64d3459939c2b` |
| Subject/class line | 5 | 34 | `7f60b3e1794cd6ae3378d951088a300853029505c79bd2ca1326d51bfe2d5bcc` |
| Title block | 3-5 | 54 | `12c4f4d35d0f0e7c1e22491d7d2985a8eaa763039fed3ecd60fa7b83111e51fe` |
| Scheme heading `ILANA ISE OSOOSE FUN SAA KEJI` | 7 | 31 | `a0b97e0f1529e5e76c45a2bbc346c526b4fdb1334ad63c0abf65d04660f10130` |
| Scheme list | 7-141 | 2,591 | `1239d3fde57b34ddf1e8a401d21bb709e3ede3f669daefe4f8e0845b52d95cc7` |
| Scheme rows only | 9-141 | 2,560 | `b3d8ec826acef71bc7419fb4e5612959e8089751cbf50d852232c71eb22d0b12` |
| Whole front matter | 3-141 | 2,647 | `044ca198991b51d73a9afe62b4d402e5a855210bdd0cd60dc02a4d92c82a1cbc` |

- Line 3 is the document's only term title and is the anchor of the new scheme-only rule. Line 5 reads `SUBJECT; YORUBA.` followed by six tab characters and `CLASS-; SS1` (34 characters); it equals the registered `header_text` of the source and is already the anchor of the `source_alias` rule `SS1-SRC-ec4a5095420d-R001`.
- The title block contains **0** characters in U+00C0-U+024F, **0** combining marks and **0** other non-ASCII characters. The whole front matter contains exactly **4** non-ASCII characters, all U+2013 en dashes, at lines 55, 59, 69 and 71 inside scheme rows 4-6; there is no tone mark, no sub-dot and no combining mark anywhere in the block, and no marks were added or normalised.
- Neither block is a teaching body: the title block names the term, subject and class and the scheme list lists twelve rows without defining, explaining or illustrating any of them.

## The 12-row scheme
- The list is headed `ILANA ISE OSOOSE FUN SAA KEJI` at line 7 and has twelve rows, each a paragraph opening with a Yoruba ordinal label. Rows 1-9 add indented EDE/ASA/LITIRESO sub-lines after the label; rows 10-12 do not. The rows are paragraphs, not a Word table: there is no header row, no column table and no numeral in the text.

| Row | Label (verbatim) | Lines | Block SHA-256 | YO-WK-T2 item | Disposition |
|---|---|---|---|---|---|
| 1 | `Ose  kinni- Ede-Atunyewo awon isori oro` | 9-23 | `1d57865591bfc8d86e0690f5806f73279f4f89dc8ee1f64c979a0d278ddc3d51` | `YO-WK-T2-W01` | teaching week |
| 2 | `Ose keji  Ede- Awon isori gbolohun gege bi ihun won.` | 27-35 | `b53285363baae5728ce43137e19f236e58d9c264234c8cb54fdaee1319d33650` | `YO-WK-T2-W02` | teaching week |
| 3 | ` Ose keta    Ede- Awon isori gbolohun gege bi ise won.` | 37-43 | `2d55c9d18854ce5458f51a5afc2542918b006d82b6e7426a78e2f72f6f7208fb` | `YO-WK-T2-W03` | teaching week |
| 4 | `Ose kerin Ede- Aroko  Asapejuwe;ilana kiko aroko` | 45-55 | `21818e1ffba31b71926e8292140cacf0315b00187358446a68feea8297baf6d2` | `YO-WK-T2-W04` | teaching week |
| 5 | ` Ose karun-un  Ede- Aayan Ogbufo; ilana sise aayan ogbufo.` | 57-67 | `55c53e211535fa77ed6c031487d304be3141521cf8e093de9408c34abd5f659a` | `YO-WK-T2-W05` | teaching week |
| 6 | `Ose kefa Ede - Aayan Ogbufo; sise ogbufo ayoka ede Geesi si ede Yoruba.` | 69-79 | `2de02ce7721cc33f01b7ade59a9be44cce27128c7302d955b7c284e4688f2810` | `YO-WK-T2-W06` | teaching week |
| 7 | `ose keje- Ede- Onka  Yoruba;onkaye lati ori  ookan titi de Egbaa (1- 2000)` | 81-91 | `90af69d72b37b7347417348791b180ad3d5b37aab457eefc80e2ea0d077a0d88` | `YO-WK-T2-W07` | teaching week |
| 8 | `Ose kejo- Ede- Atunyewo eko lori eka ede Yoruba; Ijesa, Ekiti,Oyo.abbl.` | 93-105 | `5e8dee089a86032a35e024eaaf1bffb5a95dafd66ad0971eeca5e0a64e825d37` | `YO-WK-T2-W08` | scheme-only: no teaching section exists |
| 9 | `Ose kesan-an` | 107-123 | `d6f35818a8c31544d32b7324e5e17c62e5c2ab03c70b71b42b11fb7b0dda6027` | `YO-WK-T2-W09` | teaching week |
| 10 | `Ose  kewaa-  Ede- Isori oro-oruko` | 125-137 | `6f81346dd5b5fb196cf342cad485c8e10474df2337d60cbb53ae713b8716fb8f` | `YO-WK-T2-W10` | teaching week |
| 11 | `Ose kokanla- Agbeyewo ise saa keji lapapo..` | 139 | `c8639358723f993c5605c822e3392ca3a6f4a772825dfa509886c158d9f31027` | `YO-WK-T2-W11` | scheme-only: revision marker, rule `SS1-SRC-ec4a5095420d-R002` |
| 12 | `Ose kejila-  Idanwo saa keji.` plus two spaces and two tabs | 141 | `aa097f81f0441460a3fe8b00396ccc6ca1cd78fa38dcf732732079b423f43f3d` | `YO-WK-T2-W12` | scheme-only: examination marker, rule `SS1-SRC-ec4a5095420d-R003` |

- The mapping is documentary rather than positional: every row carries its own Yoruba ordinal label, so each binds to one `YO-WK-T2` item by the label. Rows 8, 11 and 12 are scheme-only. Week 8 (93-105) is the only instructional week of the term with no teaching section at all (there is no `OSE KEJO` label anywhere); Week 11 (139) is the term-wide revision pointer and Week 12 (141) the examination pointer, both already disposed as markers. The per-week `YORUBA-T2-W01..W10-SCHEME-MAPPING` items keep their own confirmations open.
- Row and block defects, recorded and not normalised: the heading at 7 has no punctuation; the rows mix a leading space (37, 57), a lowercase `ose` (81) and double spaces (9, 125); rows 6 and 5 use an en dash where rows 4, 7 and 8 use a hyphen; line 85 ends with a tab and line 91 contains a tab plus trailing spaces; `Ede-Atunyewo` (9), `Ekiti,Oyo` (93) and `oriki orile,ijala` (137) are fused; `abbl` is unexpanded (93, 117, 137); row 9's label is alone on 107 with its strands on 109-123; rows 11-12 carry no strand prefix; line 139 ends with a double full stop and line 141 ends with two spaces and two tabs. No correction wording is authored here.

## Page header and footers (outside extractRawText)
| Part | Bytes | SHA-256 | Section reference | Content |
|---|---|---|---|---|
| `word/header1.xml` | 1,762 | `2831364fe6929ee316c4129699c5984f50017cd19a3a44ce77a0751dd7533bbc` | default header, rId7 | literal fill-in line of 57 characters: `NAME`, a run of U+2026 ellipses, spaces, one tab, `CLASS` and a further run of ellipses (text SHA-256 `0a8a06be902cea9070a5b1376719624c23b85f4b52f3661bd69249d406eed1c9`) |
| `word/footer2.xml` | 2,155 | `27904d82969625457f9a286ccecef7023ad4124f8b04fdedc91c6671498c9c0b` | default footer, rId9 | `PAGE` field with cached result `1`, then the running code `WKLAS/2ND TERM/YORUBA/S.S. 1` (28 characters, text SHA-256 `610538f2403ece869479f76d814705148eb69ec157dcd9ae2fbe67a85b95c7cd`), run-split as `WKLA` + `S/2ND` + ` TERM/` + `YORUBA/S.S. 1` |
| `word/footer1.xml` | 1,324 | `5b6de2d077ca8c65c9a2b8d3162a95d02c0af6033496df86b3d07f078a330f57` | even-page footer, rId8 | `PAGE` field only, with no cached result |

- The relationships are fixed in `word/_rels/document.xml.rels` (rId7 header, rId8 footer1, rId9 footer2) and the single `w:sectPr` in `word/document.xml` references rId7 as the default header and rId8/rId9 as the even and default footers.
- None of these strings occurs in the 2,433-line extraction: `WKLAS`, `PAGE` and `NAME` each occur 0 times, so all three parts are outside `extractRawText` and outside the hash-accounted body block.
- They are page metadata, not teaching text: a name/class fill-in line, a page-number field and a running code that names `2ND TERM`, `YORUBA` and `S.S. 1` and misspells `CLASS` as `WKLAS`; the misspelling is retained verbatim, not corrected. `YO-INV-T2` recorded that `footer1.xml` "has no text"; it in fact carries a `PAGE` field with no cached result and no literal text beyond it, which is recorded here as a correction.

## Automatic list numbering
- `word/document.xml` is 485,316 bytes (SHA-256 `dafcae0608c9ce426d79b65c2d174261664227529ba6aedea947657071c62680`), with 1,216 paragraphs, 0 tables and 0 drawings.
- **94** paragraphs carry `w:numPr` in the whole document; **14** of them are this scheme's sub-topic paragraphs, and the twelve `Ose` label paragraphs carry none. Seven are bulleted via numId 19 (lines 11, 13, 15, 17, 19, 73 and 95) and seven carry lower-Roman numbering via numId 20 (51, 53), numId 21 (61), numId 22 (101, 103) and numId 23 (115, 117), per `word/numbering.xml`.
- `extractRawText` emits no generated bullet or number, so none of these markers appears in the extracted text; the literal paragraph text is retained and no numbering is invented. The decision on preserving the markers belongs to the open item below.

## Coverage entries added (2, both MARKER)
| ID | Objective | Lines | Block SHA-256 | `lesson_ids` |
|---|---|---|---|---|
| `YO-T2-PRE-TITLE` | Title block naming the term, subject and class; also records the page header and footers outside the extraction | 3-5 | `12c4f4d35d0f0e7c1e22491d7d2985a8eaa763039fed3ecd60fa7b83111e51fe` | `["SS1-SRC-ec4a5095420d-R004"]` |
| `YO-T2-PRE-SCHEME-LIST` | The 12-row `ILANA ISE OSOOSE FUN SAA KEJI` scheme, with the per-row mapping | 7-141 | `1239d3fde57b34ddf1e8a401d21bb709e3ede3f669daefe4f8e0845b52d95cc7` | `["SS1-SRC-ec4a5095420d-R004"]` |

- Each entry carries three evidence entries: the title entry records the block, the classification and the header/footer parts; the scheme entry records the list structure, the twelve per-row block hashes and the numbering/notation audit. A MARKER entry records scheme or preamble text that must not be taught and must not be discarded; it is not a delivery claim.
- Both entries list the classifying rule id in `lesson_ids`, the MARKER pattern used by `physics.json`, `mathematics.json` and `english.json`, and the form the compiler's MARKER proof expects (`backend/src/db/ss1/compiler.ts:114` requires a non-empty `lesson_ids`, line 124 requires every listed id to be a marker disposition). The five earlier Yoruba MARKER entries (the three `YO-T1-PRE-*` entries and `YO-T2-W11-SCHEME-REVISION`, `YO-T2-W12-SCHEME-EXAMINATION`) carry empty lists; this item does not change them and leaves the reconciliation to the foundation request `YO-FND-T2-01`.

## Classification
- Rule `SS1-SRC-ec4a5095420d-R004` (`classify_marker`, kind `SCHEME_ONLY`) is anchored at `SECOND TERM E-NOTE`, which occurs exactly once in the 2,433-line extraction, and covers the front matter lines 3-141. It is the fourth rule on this source, after the alias R001, the revision marker R002 and the examination marker R003.
- The classification is scheme-only because the block has no teaching proposition: it names the term, subject and class and lists twelve scheme rows without defining, explaining or illustrating any of them. The scheme rows are not treated as teaching bodies; the per-week objective indexes remain authoritative for what each week teaches.
- The parser still produces no rows for this source (zero `week` substrings and zero bare-number lines, so `parseTopics` returns `[]`); the marker rule therefore matches no parsed row and records its `SCHEME_ONLY` disposition against its own rule id. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists and no row identity is claimed; that gap remains with `YO-FND-T2-01` (PENDING).

## Open item added
- `YORUBA-T2-PRE-SCHEME-MAPPING` (CONTENT, `blocks_delivery: true`, affected ids `YO-T2-PRE-TITLE` and `YO-T2-PRE-SCHEME-LIST`): records the two front-matter blocks, all twelve per-row hashes, the mapping to `YO-WK-T2-W01..W12`, the scheme-only dispositions of rows 8, 11 and 12, the header/footer parts and the 14 lost automatic list markers.
- `required_action`: the owner or expert confirms once for the term the twelve row-to-item bindings and the scheme-only dispositions, and decides whether the 14 automatically numbered sub-topic paragraphs need their Word bullet or lower-Roman markers preserved in any delivery artefact, since `extractRawText` emits none; until then the per-week `YORUBA-T2-W01..W10-SCHEME-MAPPING` items stay open. No teaching is authored and no scheme row is treated as a teaching body.

## Queue changes
- YO-PRE-T2-1 → `IMPLEMENTED_TESTING_DEFERRED`; the previous `next_runnable` value is consumed. No item was appended: preamble indexing produces no lesson or asset task.
- Counts: **120 items unchanged**; coverage 282 → 284; open items 112 → 113; source rules 6 → 7; lessons 0; assets 0; status 32 implemented / 69 pending / 19 blocked; `next_runnable` → `YO-FND-T2-01`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records the 2nd Term preamble and its open item, and its required action starts at the 2nd Term foundation item, then the 3rd Term.

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema, compiler, parser or importer edit, no plan run. `yoruba.json` was edited only to add one source rule, two coverage entries, one open item and the indexing record.
- Not approved and not verified. The scheme rows are recorded verbatim and are not taught; no correction is authored for the heading, labels, numbering or the `WKLAS` footer. The automatic list markers are recorded as absent from the extraction, not reconstructed. The row identity gap is recorded, not resolved.
