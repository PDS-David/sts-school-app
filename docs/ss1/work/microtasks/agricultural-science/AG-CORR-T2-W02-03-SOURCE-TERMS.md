# AG-CORR-T2-W02-03-SOURCE-TERMS — Agricultural Science, Second Term Weeks Two and Three

Status: **IMPLEMENTED — approval and verification deferred**. The correction is bound to the actual parser/compiler row; original source bytes are unchanged.

## Immutable source identity

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Actual parser/compiler row: `SS1-SRC-956594d97094:BODY:9b05ec628817f7406a90c51277a6e8fe5c6318c250a89cd9a819d6c529b29797`
- Direct-body locators:
  - Block 39: `post-posting operations`; block 135: heading `POST -PLANTING OPERATIONS`.
  - Block 180: inorganic fertiliser description.
  - Block 254: MCQ option `plating space`; block 255: `Planting space` in the immediately following MCQ.
- Recomputed UTF-8 block hashes:
  - Block 39: `c5309b3fd481bbed308bc62b30194078783fe4fa18b96cb75bb6829518bbdc98`
  - Block 180: `e2adf9c1bb9560701f9850324e18755cdc4271e4aaf068d7029a9085dcc30983`
  - Block 254: `a18f28553ddea84238affe7f3e7d78edcda5b25da97e43750c04146fc45695ba`
  - Block 135: `a9bf905d1a60432c16024a5ffcfb46600da1712f58c23aadf4ce1868a61bf975`
  - Block 255: `f810910012f99800692b11c3fa194f4b9f243cda7f31deb4a5c7f8fc335f7896`

The row identity is reproduced in CI using the hash-pinned archive, Mammoth extraction, actual `parseTopics` and `compilePackages`. The regression test pins all 30 original teaching-row IDs.

## Verified corrections

1. **Block 39 — “post-posting operations”:** corrected to **post-planting operations**. The source itself classifies cultural practices as pre-planting, planting and post-planting; block 135 uses the post-planting heading, and the listed operations (thinning, supplying, irrigation, manuring, mulching and weeding) belong after planting.
2. **Block 254 — “plating space”:** corrected to **planting space**. Block 255 uses the correct term and defines the distance between plants/seeds.
3. **Block 180 — inorganic fertilisers “usually prepared on the farm”:** corrected in the replacement lesson. Inorganic/mineral fertilisers are manufactured or processed nutrient products; organic manures such as compost and animal manure may be prepared or collected on the farm. The lesson directs learners to soil-test and local extension advice and invents no application rates.

## Learner-delivery correction

Added `CORR-AG-T2-W02-03-CULTURAL-PRACTICES-REPLACEMENT`:

- Original row: `SS1-SRC-956594d97094:BODY:9b05ec628817f7406a90c51277a6e8fe5c6318c250a89cd9a819d6c529b29797`
- Replacement: `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W02-03-CULTURAL-PRACTICES`
- The replacement covers pre-planting, planting, post-planting, harvesting and post-harvest operations, with corrected terms and keyed practice.
- Original source bytes remain unchanged.

## Green-manure timing reconciliation

The source says “just before flowering” at block 175; the weekend MCQ says “as soon as it flowers” at block 268. These are close, not necessarily contradictory, because timing varies by species and objective. The replacement teaches incorporation at or near early flowering/full bloom before seed set, while tissues are still relatively tender; it explicitly notes species-specific variation. Sources: RHS green-manure guidance, Infonet-Biovision sustainable agriculture manual, and Alberta Agriculture legume green-manuring guidance. See `AG-FACT-T2-W02-03-GREEN-MANURE-ITEM.md`.

## Evidence

- FAO, *Plant Nutrition for Food Security: A Guide for Integrated Nutrient Management*: https://www.fao.org/3/a0443e/a0443e00.htm
- Infonet-Biovision, *Sustainable Agriculture Extension Manual*: https://infonet-biovision.org/sites/default/files/pdf/sustainable_agriculture_extension_manual.pdf
- Royal Horticultural Society, *Using Green Manures*: https://schoolgardening.rhs.org.uk/resources/info-sheet/using-green-manures.aspx
- Alberta Agriculture, *Legume Green Manuring*: https://www1.agric.gov.ab.ca/$department/deptdocs.nsf/all/agdex133

## Release gate

The replacement lesson remains `content_approval: PENDING` and `verification: DEFERRED`. The learner route withholds the original row until the subject package and replacement lesson pass genuine approval and verification. No production import, authenticated learner-route observation or field-practical verification is claimed.
