# AG-CORR-T2-W07-PEAT-TYPO — Agricultural Science, Second Term Week Seven

Status: **IMPLEMENTED — approval and verification deferred**. The correction is bound to the actual parser/compiler row; it is not yet approved for learner delivery.

## Immutable source identity

- Source ID: `SS1-SRC-956594d97094`
- Archive: `SSS 1-20260507T072431Z-3-001.zip`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Actual parser/compiler row ID: `SS1-SRC-956594d97094:BODY:d6a132c9ce637c6fee7ca4e1e88aa707220a68298bde2794d5657e49533c9e22`
- Body SHA-256: `d6a132c9ce637c6fee7ca4e1e88aa707220a68298bde2794d5657e49533c9e22`
- Direct-body block 458 SHA-256: `a2b6fc4e91f20afe96d2b2439ddb7904a271c5deb876ebbd3409307496946681`

The exact source-row identity was reproduced in CI from the hash-pinned archive using Mammoth extraction, source rules, the actual `parseTopics` implementation and `compilePackages`. The regression test pins all 30 original teaching-row IDs.

## Finding

The source phrase is “carbonaceous rocks e.g. coal, peak, and lignite.” **“Peak” is a typographical error for “peat.”**

Peat is an organic-rich, generally unlithified deposit formed from partially decomposed plant material in wetlands. It is the precursor to coal; with burial, compression and heating, it can develop into lignite and higher coal ranks. Peat should therefore be described carefully as an organic sediment/deposit or early coal precursor, not as a fully lithified rock like sandstone. The replacement lesson explains this distinction rather than repeating the source's over-broad classification.

## Learner-delivery correction

Added `CORR-AG-T2-W07-PEAT-TYPO-REPLACEMENT`:

- Original row: `SS1-SRC-956594d97094:BODY:d6a132c9ce637c6fee7ca4e1e88aa707220a68298bde2794d5657e49533c9e22`
- Replacement lesson: `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W07-ROCK-CHARACTERISTICS`
- The replacement covers igneous, sedimentary and metamorphic rock formation and characteristics, including scientific exceptions for crystallinity, fossils, layering, hardness and erosion resistance.
- The replacement now explains peat's organic origin, unlithified status and role in coalification, and includes keyed practice on correcting the typo.
- Original DOCX bytes remain unchanged.

## Evidence

1. **U.S. Geological Survey**, “What are the types of coal?” Identifies peat as the precursor to coal and explains the coalification sequence. https://www.usgs.gov/faqs/what-are-types-coal
2. **U.S. Geological Survey**, *Coal: A Complex Natural Resource*, Circular 1143. Explains peat deposits and their conversion to lignite and coal through burial, compression and heat. https://pubs.usgs.gov/circ/c1143/html/text.html
3. **British Geological Survey**, “Rock Classification Scheme: Peat.” Defines peat as an organic-rich, unlithified deposit and the unlithified end-member of the humic coal series. https://webapps.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=PEAT
4. **Original source**, Second Term Week Seven, block 458. Direct context for the corrupted word “peak”.

## Release gate

The replacement lesson remains `content_approval: PENDING` and `verification: DEFERRED`. The learner route must withhold the original row until the replacement has genuine subject-content approval and verification. No production import, authenticated learner-route observation, device check or classroom practical verification is claimed.
