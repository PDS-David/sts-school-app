# AG-CORR-T3-W01-TOOL-NAMES — Agricultural Science, Third Term Week One

Status: **IMPLEMENTED — approval and verification deferred**. The delivery correction is bound to the actual parser/compiler row; it is not yet approved for learner delivery.

## Immutable source identity

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive: `SSS 1-20260507T072431Z-3-001.zip`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Actual parser/compiler row ID: `SS1-SRC-458a07f7ea5a:BODY:0c06c5383b974616b0e06a23a1165fe3beeeec8b89b232c0383f83a6d2e056ff`
- Body SHA-256: `0c06c5383b974616b0e06a23a1165fe3beeeec8b89b232c0383f83a6d2e056ff`

The row identity was reproduced in CI from the hash-pinned archive using Mammoth extraction, the actual `parseTopics` implementation and `compilePackages`. The regression test pins all 30 original teaching-row IDs.

## Finding

- Block 36 lists **Hand trowel** as tool 28.
- Block 67 asks which tool is used for transplanting seedlings but prints “Hand Towel”. The intended option is **Hand Trowel**.
- Block 66 belongs to the preceding digging/loosening question. Its “Hand towel” wording is an intentional distractor and is retained unchanged.
- The source/member and block hashes remain as recorded in the earlier investigation; the original DOCX bytes have not been edited.

## Learner-delivery correction

Added `CORR-AG-T3-W01-TOOL-NAMES-REPLACEMENT`:

- Original row: `SS1-SRC-458a07f7ea5a:BODY:0c06c5383b974616b0e06a23a1165fe3beeeec8b89b232c0383f83a6d2e056ff`
- Replacement lesson: `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W01-TOOL-REFERENCE`
- The replacement is a complete Week One lesson: all 30 tools, the five selected tool descriptions, post-planting operations, care/maintenance, safety and the 30 original schematic SVG references.
- The replacement practice preserves the block 66 “Hand towel” distractor in the digging/loosening MCQ and corrects block 67 to “Hand Trowel” for transplanting. It also retains the source's weeding and rice-harvesting practice items.
- No source bytes or source transcript were changed.

## Evidence

1. Original source block 36 directly lists “Hand trowel”; block 67 uses “Hand Towel” for transplanting.
2. National Open University of Nigeria, *CRP 304 Module 4*, section 3.5 “Nursery Tools and their Uses”: hand trowel is used for transplanting seedlings from nursery to field. https://oer.nou.edu.ng/sites/default/files/OER_Files/CRP304_04.pdf
3. Oregon State University Extension, *An Educator's Guide to Vegetable Gardening*, “Garden Tools”: hand trowel is useful for transplanting seedlings and bulbs. https://extension.oregonstate.edu/sites/default/files/documents/em9032.pdf
4. University of Minnesota Extension, “Garden Tools”: trowel use for transplanting and loosening soil around plants. https://www.ucanr.edu/program/uc-master-gardener-program/tools
5. The parallel lesson copies that repeat “Hand Towel” were treated as evidence of a propagated typo, not as correction authority.

## Release gate

The replacement lesson and its 30 SVG assets remain `content_approval: PENDING` and `verification: DEFERRED`. The runtime adapter withholds the original row until the package and replacement lesson have genuine approval and verification. No authenticated learner-route observation, database import, device check or classroom practical verification is claimed.
