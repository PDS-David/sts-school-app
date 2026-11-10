# BIO-SEC-T1-PESTS-DISEASES — Unlisted agricultural pest and disease sections

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a source-section index, not an approved syllabus placement or a new lesson.

## Source identity and locator

- Source ID: `SS1-SRC-422e0e6ddde9`; member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`.
- Verified member SHA-256: `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` (957,703 bytes); matches the archive and assignment manifest.
- Locator rule: direct child of `w:body` in `word/document.xml`, zero-based. Block text is concatenated `w:t` runs; range hash is SHA-256 of block texts joined with newlines, including empty blocks.
- Combined section blocks 550-629: `4b3d3a1ca273e08edbcb5ef984b35b8522406648f2c0a42c0674b00b3fde5cd3`, matching the queue.
- Heading block 550: `THE PEST`; heading block 605: `DISEASES OF AGRICULTURAL IMPORTANCE`.

## Section A — The Pest (blocks 550-604)

| Subtopic | Locator | What the source covers |
|---|---|---|
| Pest definition and crop-pest groups | 550-557 (`d4319c038697f159d9e73b31221e3e67dc8e7315e9b1268ba1ae3683a4fe16b4`) | Defines a pest and describes insect pests, crop-eating insects, sap-sucking, biting/chewing and piercing/sucking groups. |
| Worm pests and animal pests | 558-565 (`f78f2e45ba38039657c5d2edfc839bae3386b8de7e822a3cfa8f9e8b76c06360`) | Describes subterranean worms, pod/stem borers, army worms, mammal pests and bird pests. |
| Effects of pests | 568-574 (`276b4cfc027aff9b73e6e36c97cdb6efd87d47659352eefb76e49ea34bb22292`) | Lists source-stated effects on vegetation, food availability, crop quality/quantity, farmer finances and disease transmission. |
| Pest control categories | 575-579 (`085d28afe0e3f8d7a35d92a5ab0e53d6d9a0378011fe2e2e632d70c96d7f94d2`) | Names chemical, cultural, physical and biological control categories. Specific chemical product names are retained only in the original source and are not copied as instructions. |
| Yam beetle life history | 580-590 (`a28180709ea2093af3be678d1705196ce58fc65b1f4dee1b801aae7de255d7cf`) | Describes the pest's life history and damage to yam tubers. Its drawing is part of the existing `BIO-VIS-T1-PEST-LIFECYCLES` task. |
| Rhinoceros beetle life history | 591-604 (`b8e4262cb39d45703ef34c7328e6a330b9f320951758a119c9efcb780cae1b5b`) | Describes the beetle's effects/life history and source-stated control. Its drawing is part of the same visual task. |

## Section B — Diseases of Agricultural Importance (blocks 605-629)

| Subtopic | Locator | What the source covers |
|---|---|---|
| Disease groups and examples | 605-610 (`4d1976b707204414e32e8901dea50f51b0fc2f1e0cccd03e3450d35545381082`) | Defines disease and groups examples under viral, bacterial, fungal and protozoan diseases. Examples include Rinder pest, anthrax, brucellosis, tuberculosis, trypanosomiasis and piroplasmosis. Names/spellings and disease/agent associations require veterinary review. |
| General effects | 611-619 (`18faf7d219d6932efb8589acb46332c1eb9a11b9568f758597149062aab4d37b`) | Lists source-stated effects on crop/animal yield, quality, form, survival, farmer income, production cost and marketability. |
| General control | 620-629 (`903e176905a6854c89a133607e4aec6e232153f771baae40e9568152c605750d`) | Lists source-stated categories including environmental/breeding-ground management, chemicals, vaccination, sanitation, isolation of new stock, grazing/bedding management and veterinary checks. Chemical/veterinary claims require qualified review; no doses or procedures are inferred. |

## Scheme relationship and disposition

These sections are within the Week 3 body range (133-644), but neither heading is named by scheme row 3, `Classification of Living things`. They are not silently merged into the classification objective.

The source does not establish whether these sections belong in Week 3, another scheme week or supplemental material. The package records three UNRESOLVED coverage items and a non-blocking owner-placement open item `BIOLOGY-T1-W03-PESTS-PLACEMENT`.

## Visual preservation

The yam beetle and rhinoceros beetle life-cycle drawings at blocks 582-593 remain assigned to existing task `BIO-VIS-T1-PEST-LIFECYCLES`. No duplicate visual task or redraw was created.

## Factual and safety boundary

The source lists agricultural/animal disease names and control statements involving chemicals, vaccines and isolation. These are retained as source evidence and flagged for veterinary/agricultural review. No chemical rates, pesticide doses, animal treatment steps or veterinary procedures are added.

## Package and queue changes

- `biology.json`: added UNRESOLVED coverage records for pests, agricultural diseases and disease control, plus owner-placement and factual-review open items.
- `QUEUE.json`: marked `BIO-SEC-T1-PESTS-DISEASES` IMPLEMENTED_TESTING_DEFERRED, retained the existing pest-life-cycle visual task, and recomputed status counts and `next_runnable`.
- No source text or drawings were moved, deleted, corrected or rewritten; no lesson or treatment procedure was invented.

## Verification boundary

The archive member hash, section headings, block/range hashes and existing visual-task references were checked. No tests, importer/compiler, database rehearsal or production import was run, as required by the owner's testing deferral.
