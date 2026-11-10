# Agricultural Science SS1 — original-row identity map and implementation record

Base commit: `28cbdbf14aaadcb72f7172a42661f2c0f4b72029`  
Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`

## Source-member integrity

| Term | Exact archive member | SHA-256 |
| 1st Term | `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx` | `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` |
| 2nd Term | `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx` | `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` |
| 3rd Term | `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx` | `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` |

All three member hashes match the subject package source registry and the supplied archive.

## Identity reproduction method

The original row IDs below were reproduced from the exact DOCX members using Mammoth 1.12.2 `extractRawText` behavior and the repository's `ingestTopics.ts` `parseTopics`/week-marker logic. Paragraphs contribute raw text followed by two newline characters; tabs are preserved; non-text breaks and unsupported/property elements are omitted as in the Mammoth document reader. The repository's `originalLessonId(source_id, body)` rule hashes the exact UTF-8 parsed body.

Cross-check: First-Term Week One body SHA-256 reproduced as `eb23c6d757163ec4e7bfce9f79ede198e00e4437be3317ac9781b3e9dec6c2b9`, matching the previously recorded Week One reference.

**Verification boundary:** this is deterministic authoring-stage identity reproduction. The importer/compiler plan, database import and authenticated learner delivery were not executed. These IDs must not be described as importer-run or student-delivery verified until that phase.

## Parsed week rows and marker classification

The Second-Term Week Ten row is classified by source rule R003 as a `SCHEME_ONLY` revision marker, not an instructional lesson. The other listed week rows are teaching rows or the Second-Term Week One revision activity.

| Term/week | Topic label | Original lesson ID |
| T1W1 | Week 1 — Introduction to Agriculture | `SS1-SRC-7aa642b0085b:BODY:eb23c6d757163ec4e7bfce9f79ede198e00e4437be3317ac9781b3e9dec6c2b9` |
| T1W2 | Week 2 — Types of Agriculture | `SS1-SRC-7aa642b0085b:BODY:94ffd0f85730fc3f1804f07342e16b1da91dd1323231b7fb6e41b11b96f8cf35` |
| T1W3 | Week 3 — Agricultural Development in Nigeria | `SS1-SRC-7aa642b0085b:BODY:de6febf42e9195e6171f87f05840f7ac0d5a7337820ec98392670ebc3b1485aa` |
| T1W4 | Week 4 — Government and NGOs | `SS1-SRC-7aa642b0085b:BODY:0c1b6e6e543aa10d8aaeb5963231c20ff8e3c3a58be635e0071c1dbc052eb244` |
| T1W5 | Week 5 — Science and Technology | `SS1-SRC-7aa642b0085b:BODY:6388d1c618d180353e769423def1f31de4b76cf5b07fd218d957f0d807c9bedc` |
| T1W6 | Week 6 — Agro-allied Industries | `SS1-SRC-7aa642b0085b:BODY:599c15d5fc22a602566d6336b315c0b49710b870d1be5090881a6820f144adbb` |
| T1W7 | Week 7 — Land and its Uses | `SS1-SRC-7aa642b0085b:BODY:43f4fb240312605deaf233087f1673161e8070b3db0e801fcf2f5d99846df7cb` |
| T1W8 | Week 8 — Agricultural Laws and Reforms | `SS1-SRC-7aa642b0085b:BODY:bcd8c0ecc2862267e6f54895abbff1a39a16ded4137d630c3c931d13b1c6910a` |
| T1W9 | Week 9 — Environmental Factors | `SS1-SRC-7aa642b0085b:BODY:69348da19f944ceab550cee06d2dfb83692ecbe2efba67f6903df81d81d873fd` |
| T1W10 | Week 10 — Crop Classification | `SS1-SRC-7aa642b0085b:BODY:007f80ec64ec9dafb7a327359ba0ada8605d18109b826ab6ed39e1fe86fcc658` |
| T2W1 | Week One — Revision of Last Term's Work | `SS1-SRC-956594d97094:BODY:3d8958e8d868273f4f1ee87c24a7096de404fb15a6eeb93197f05299ff37e7c0` |
| T2W23 | Weeks Two and Three — Cultural Practices | `SS1-SRC-956594d97094:BODY:1beb6d785bb09aa20fdffc82f7efaa1cdcdbd565c29d689f4575757ec6ea20e9` |
| T2W45 | Weeks Four and Five — Selected Crops | `SS1-SRC-956594d97094:BODY:12d2bff62a3b676cec1218abdde9a8f57a09e2057bd5f6d880e50cb0dee77886` |
| T2W6 | Week Six — Agricultural Ecology | `SS1-SRC-956594d97094:BODY:5e12e6d75046c73227b73e5a70eb56fd6a83ccbaf4d206b9dc3d4cc609e008f6` |
| T2W7 | Week Seven — Rock Formation and Types | `SS1-SRC-956594d97094:BODY:d6a132c9ce637c6fee7ca4e1e88aa707220a68298bde2794d5657e49533c9e22` |
| T2W8 | Week Eight — Rock Weathering | `SS1-SRC-956594d97094:BODY:1f941dd52a764e5665229f0caad9aa3a3bca2ecf1ffad1ac4f3810601bfa573b` |
| T2W9 | Week Nine — Factors of Soil Formation | `SS1-SRC-956594d97094:BODY:1d566e884981c34293a7c08a90ce5177dc063ea5813da9a7f27e69e09c5f77ee` |
| T2W10 | Week Ten — Revision marker | `SS1-SRC-956594d97094:BODY:a729dbf0c8f75421a7983e1a36a0c72ccb9378dd4ac4f25148f4d0c2dd30d36c` |
| T3W1 | Week One — Simple Farm Tools | `SS1-SRC-458a07f7ea5a:BODY:0c06c5383b974616b0e06a23a1165fe3beeeec8b89b232c0383f83a6d2e056ff` |
| T3W2 | Week Two — Farm Power | `SS1-SRC-458a07f7ea5a:BODY:57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b` |
| T3W3 | Week Three — Farm Mechanization | `SS1-SRC-458a07f7ea5a:BODY:926ec9d0dd8bfdeebfd345eb9bd0f034b7d4ae770706b3345351f3d28294cc32` |
| T3W4 | Week Four — Anatomy and Physiology of Farm Animals | `SS1-SRC-458a07f7ea5a:BODY:f5e7e44f6958567c83585854643e2fcfe312cf70b7189a8a45f3c3bf4542dcae` |
| T3W5 | Week Five — Respiratory System | `SS1-SRC-458a07f7ea5a:BODY:ee2b1a466d20eb2f30bcfe48cf2f8329ba035d2528c6ca91bcce87ac6ea5b8dd` |
| T3W6 | Week Six — Reproduction in Farm Animals | `SS1-SRC-458a07f7ea5a:BODY:32a9361d7a977244ca32d9f64c9279aef6edec9ca35ca915dd87ff11f8030daa` |
| T3W7 | Week Seven — Reproduction in Farm Animals II | `SS1-SRC-458a07f7ea5a:BODY:15f96ac5ec76ec2f957b90b0f4ecfb688cf23f30a8999cd0fe80383d2eb108bf` |
| T3W8 | Week Eight — Environmental Physiology | `SS1-SRC-458a07f7ea5a:BODY:791302b51e960fafa427a66d0b1ce1f662567b3bb9bb9c374531d39c2ed1e5de` |
| T3W9 | Week Nine — Pig Management | `SS1-SRC-458a07f7ea5a:BODY:b431485e025fd5054046a9041249f1b34a5042973238fbf2b652cbf27fbf4ef7` |
| T3W10 | Week Ten — Cattle Management | `SS1-SRC-458a07f7ea5a:BODY:705e543e7a04a9a5058603f332ba4a44c4e81c4f6ab98b0571e6edcde4efb31b` |

## Learner-facing work added

- `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W01-REVISION-PRACTICE`: original First-Term revision practice with 13 questions, model answers and criterion-level marking. It is not represented as a recovered official paper.
- `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W08-ENVIRONMENTAL-MEASURES`: extended with Nigeria-specific regional climate and livestock reasoning.
- `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W09-PIG-MANAGEMENT-REPLACEMENT`: complete safe replacement for Third-Term Week Nine, preserving pig production objectives while excluding unverified drug doses, injections, pesticide application and corrosive-disinfectant procedures.
- `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W10-CATTLE-MANAGEMENT-REPLACEMENT`: complete safe replacement for Third-Term Week Ten, correcting cattle-housing wording, preserving 275–283 days (9½ months), and excluding unendorsed veterinary/chemical procedures.

## Delivery corrections

- `CORR-AG-T3-W09-PIG-SAFE-REPLACEMENT` replaces the unsafe Week Nine learner body with the safe pig-management replacement.
- `CORR-AG-T3-W10-CATTLE-SAFE-REPLACEMENT` replaces the unsafe Week Ten learner body with the safe cattle-management replacement.

Original DOCX bytes and source wording remain unchanged. These correction records do not prove that the live learner interface already applies the replacements.

## Deferred work

No test suite, TypeScript check, importer/compiler plan, database rehearsal, mobile/web learner-view check or production import was run in this authoring stage. Formal subject-expert/owner approval remains pending; package status therefore remains `PENDING`. Remaining permission and verification items are retained in the package.

Remaining PARTIAL/UNRESOLVED coverage after this implementation: none.

## Visual assets added

An original animal-systems visual atlas is now registered as `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W04-W05-ANIMAL-SYSTEMS-ATLAS`. Five independently authored SVGs cover comparative digestive systems, mammalian male/female reproductive pathways, mammalian respiration/fish gills, pig external anatomy and cattle external anatomy. Unlicensed source images are not reused. Asset registration and provenance are implemented; actual learner-route display, file-integrity execution and content approval remain deferred.
