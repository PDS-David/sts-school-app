# BIO-WK-T1-W05 — Biology, 1st Term, Week 5 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and high-level practical/assignment scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and locator

- Source: `SS1-SRC-422e0e6ddde9`; member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`; SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`; 957,703 bytes. The archive and assigned member hashes were verified in this session.
- Locator rule from `BIO-INV-T1`: direct child of `w:body` in `word/document.xml`, zero-based; block text is concatenated `w:t` runs (UTF-8, no normalisation; text-box text belongs to its containing block); range hash is SHA-256 of block texts joined with newline, including empty blocks.
- Week label block 679, exact text `WEEK FIVE `, hash `8ee47ba1948276278acd4756c10e25cf6739d5687371d857fd9be652bde6a506`. Week 5 range blocks 679-780, hash `4686f3b47c869d4b3359ada8483a6d7324db6f10dbf211eed9346ed7dd28b8f4`, matching the queue.
- Scheme entry is block 6: `Week 5 -Plant Nutrition`; hash `a7311d7898eea52bee2c7fd42c342dbcfcff6915e60599cf3cf37e3ef116ea53`.

## Scheme objective and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Week 5 — Plant Nutrition | Scheme block 6; label block 679; teaching blocks 680-713 (range `d40f453a5c9ce31f5d5178e3fa4709cd287d60cb0b63dc4a5862b389d44ef1b7`) | PARTIAL | The source describes photosynthetic nutrition, its two stages, products/importance, and chemosynthetic nutrition. The package has no lessons, so source-only teaching is not yet deliverable. |

| Source content | Exact blocks | Evidence |
|---|---|---|
| Photosynthetic nutrition | 682-708 (subrange `087f07499270399435ff7f1b54a112d12d49c451d2f4b48c31b87ac9cd6520ef`) | Defines photosynthetic/holophytic nutrition; describes light and dark reaction stages; identifies the main sugar product and lists the importance of photosynthesis. The drawn reaction scheme and equations are separately assigned to `BIO-VIS-T1-PHOTOSYNTHESIS-SCHEME`. |
| Chemosynthetic nutrition | 710-713 (range `cbd5cdda7738a833e35fdf510f4a96617edcec7aebe93444bba215bb0ef39020`) | Introduces chemosynthetic nutrition and gives a sulphur-bacteria example and equation. This is indexed as source content; no additional mechanism or correction is invented. |

**Equation review gate:** the displayed equation at block 683 and the simplified equation at block 700 do not show the same product expression. The original forms are retained unchanged. `BIO-FACT-T1-W05-EQUATIONS` was appended to verify them against an approved Biology reference before any delivery correction is bound.

## Practical investigations — safe indexing boundary

The source has a section headed `Experiments to test for photosynthesis` at block 714, with five investigation headings at blocks 715, 727, 741, 748 and 760. Their stated aims concern starch in a leaf, the roles of sunlight, carbon dioxide and chlorophyll, and oxygen as a by-product.

The source contains detailed practical methods and chemical-handling instructions. **Those methods, materials, chemical names, quantities and procedural steps are deliberately not reproduced in this task record.** This is a source-indexing record, not practical-use guidance.

- Experiment I has no accompanying figure.
- The figures associated with Experiments II-V are separately assigned to `BIO-VIS-T1-EXPERIMENT-FIGURES`.
- The source range contains no separate safety-precautions or teacher-supervision section. It is not cleared for student practical delivery by this index. A qualified Biology teacher/safety lead must provide an approved safety assessment and supervised-delivery decision before practical use. This is recorded as `BIOLOGY-T1-W05-PRACTICAL-SAFETY` and a blocked queue dependency.

The combined practical range is blocks 714-765, range hash `0cfbbff13910a5c49a63bff22fb10b7b220fb9aacef0d2e0680e7e625dca43e8`.

## Assignment review

The source labels block 773 `ASSIGNMENT` and block 774 `WEEK FIVE`. Questions are in blocks 775-778 (range `6ab2fade68e864264d45056a7a32514ecb3fc62cb282d7b5ca8392aad859f0a2`).

| Question | Source check | Disposition |
|---|---|---|
| 1a. Define photosynthesis | Definition at block 682. | Supported by the source wording. |
| 1b. Describe the light reaction stage | Light reaction described in blocks 685-697. | Supported at source level; no answer key is supplied. |
| 1c. Explain how photosynthesis occurs in green plants | The two-stage account is given across blocks 685-702. | Supported at source level; no answer key is supplied. |
| 1d. List five conditions necessary for photosynthesis | The reviewed teaching text explicitly names light/sunlight, chlorophyll, water and carbon (IV) oxide. It does not identify a fifth condition or give a five-item list. | UNRESOLVED. The fifth condition is not guessed; `BIO-FACT-T1-W05-CONDITIONS` was appended for approved-reference verification, followed by a bounded supplemental lesson task. |

No answer key or marking guide for questions 1a-1d was found. The assignment coverage remains UNRESOLVED.

## Material census

- The Week 5 body range contains 17 drawing elements and 13 VML fallback shapes; the photosynthesis reaction shapes are owned by `BIO-VIS-T1-PHOTOSYNTHESIS-SCHEME`, and the four practical figures by `BIO-VIS-T1-EXPERIMENT-FIGURES`.
- There are no Word tables, embedded OLE objects or text boxes in the Week 5 range.
- A search found no separate safety precautions or teacher-supervision section in blocks 679-780.
- No extra practical steps, quantities, safety instructions, answer key or visual asset were created.

## Package and queue changes

- `biology.json`: added `COV-BIO-T1-W05-SCHEME-5` (PARTIAL), `COV-BIO-T1-W05-PRACTICALS` (PARTIAL) and `COV-BIO-T1-W05-ASSIGNMENT` (UNRESOLVED). Added blocking open items for missing lessons, practical safety review, the missing fifth condition and equation review. Existing sources, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T1-W05` IMPLEMENTED_TESTING_DEFERRED; appended two factual-dependency tasks, one blocked practical-safety dependency and one supplemental lesson task; recomputed counts and `next_runnable`. Totals are 16 IMPLEMENTED_TESTING_DEFERRED, 68 PENDING and 5 BLOCKED.
- No lesson, correction, source rule, answer key or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; Week 5 label, scheme and range hashes; hashes for theory, practical and assignment ranges; high-level review of each experiment aim without reproducing methods; assignment-to-source comparison; drawing/table/tab counts; search for a separate safety section; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, practical safety clearance, delivery verification or week completeness is made.
