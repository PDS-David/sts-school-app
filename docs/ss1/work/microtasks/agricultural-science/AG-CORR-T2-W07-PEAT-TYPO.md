# AG-CORR-T2-W07-PEAT-TYPO — Agricultural Science, Second Term Week Seven

Status: **BLOCKED — intended term verified; delivery binding awaits an original lesson.**

## Source identity and exact locator

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Exact locator: direct-body block 458 in `word/document.xml`.
- Block SHA-256 (UTF-8 text): `a2b6fc4e91f20afe96d2b2439ddb7904a271c5deb876ebbd3409307496946681`
- Verbatim source phrase: “carbonaceous rocks e.g. coal, peak, and lignite.”

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## Finding

**“Peak” is a typographical error for “peat.”** Peat is an organic, carbon-rich deposit formed from partially decomposed plant material in waterlogged, low-oxygen environments. It is the precursor to lignite and later coal during coalification. It is not a coal rank in the same sense as lignite, but it is correctly included among carbonaceous organic deposits and in school-level descriptions of carbonaceous sedimentary materials.

Authoritative geology sources confirm the sequence and terminology:
- The US Geological Survey states that peat is the precursor to coal and that burial, pressure and heat transform peat through coalification into lignite and higher coal ranks.
- The University of Cambridge chapter on carbonaceous sedimentary rocks and the Geoscience Handbook identify peat and lignite as carbonaceous/organic deposits.
- Open educational geology texts list peat, lignite, bituminous coal and anthracite as examples/stages of organic sedimentary material.

“Peak” is not a recognised example in this geological context. The intended word is recoverable without guesswork.

## Recommended delivery correction

Replace only the word “peak” with **“peat”** in the delivery rendering of block 458:

“...carbonaceous rocks e.g. coal, peat, and lignite.”

The correction preserves the source's list structure and does not add a new example or change any numerical content. The original DOCX wording remains untouched.

## Why no delivery correction is bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating a delivery-correction record now would require fabricated identifiers.

Therefore:
- The intended geological term is **verified**, not unresolved.
- No source bytes or source transcript are changed.
- No `delivery_corrections` record is created yet.
- The binding remains blocked until an original Week Seven lesson and its body hash exist and a valid replacement lesson is authored/identified.
- Existing package open item `AGRICULTURAL-SCIENCE-T2-W07-PEAT-TYPO` is updated to record the verified correction and this exact binding gate.

## Sources consulted

1. **US Geological Survey**, “What are the types of coal?” Explains that peat is the precursor to coal and that coalification transforms peat through lignite and subsequent coal ranks. https://www.usgs.gov/faqs/what-are-types-coal
2. **US Geological Survey**, *Coal: A Complex Natural Resource*, Circular 1143. Describes peat deposits and their relationship to later lignite and coal formation. https://pubs.usgs.gov/circ/c1143/html/text.html
3. **Boggs, S. Jr.**, *Petrology of Sedimentary Rocks*, Chapter 13 “Carbonaceous sedimentary rocks,” Cambridge University Press. Describes peat and lignite within carbonaceous sedimentary materials. https://www.cambridge.org/core/books/abs/petrology-of-sedimentary-rocks/carbonaceous-sedimentary-rocks/4C3231FC6897C4A684B5CBF43B3AD58D
4. **The Geoscience Handbook**, “Carbonaceous and Kerogen-rich Rocks.” Lists peat as a surface deposit of decomposed/partly humified plant debris and lignite as brown coal. https://prfdec.natur.cuni.cz/IGP/main/mazuch/geologicka_prirucka/Walker%20et%20al.-Geoscience%20Handbook%284thEd%29%282009%29.pdf

## Changes and remaining gate

- Added this correction investigation record with exact source/member/block hashes.
- Verified “peak” → “peat” against USGS and geological references.
- Updated the existing package peat-typo open item with the confirmed term and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T2-W07-PEAT-TYPO` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
