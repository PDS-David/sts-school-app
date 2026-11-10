# AG-VIS-T3-W07-REPRODUCTIVE-TRACT — Agricultural Science, Third Term Week Seven

Status: **IMPLEMENTED_TESTING_DEFERRED**. The two original images were inspected. Neither is copied, altered, or bound as a learner-facing asset; reuse remains blocked pending rights evidence.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and exact Third Term DOCX member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6f35c27935999e12a` — verified.
- Source paragraph: `word/document.xml` direct-body block 804.
- VML relationship rId31 → `word/media/image19.jpeg`; SHA-256 `3608f505f1cfbc5fe16573174586c8173a491714e2cb52a37ee2e3ad5b237c72`; 2,999,309 bytes; 2448×3264 pixels.
- DrawingML relationship rId32 → `word/media/image20.jpeg`; SHA-256 `c229d0efd92b90136ad54f51a108179b8c95982fe880c08ce5c9979d728de951`; 45,714 bytes; 592×793 pixels.
- The two images are separately positioned in the same source paragraph. The VML picture includes crop attributes; the DrawingML image is positioned separately.

## Visual content and teaching value

### image19.jpeg — photographed fertile-egg page
- This is a photographed textbook page headed **“Structure of a Fertile Egg”**, not a female reproductive-tract diagram.
- The visible paragraph says the egg is oval/oblong and either brown or white, with colour differences due to breed.
- The cross-section labels **shell**, **double membrane**, **air space**, **yolk**, **albumen**, **germinal disc (embryo)** and **chalaza**.
- The photo is perspective-distorted and low contrast, with a portion of adjacent-page material visible at the right. The diagram and its principal labels are still readable on close inspection, though it is not ideal for enlarged projection.
- The prose at block 795 already mentions yolk, albumen, chalaza, shell membranes and shell; the photographed page adds the egg-shape/colour statement and labels air space and germinal disc, which are not stated in that prose.

### image20.jpeg — poultry female reproductive tract
- A clear, upright labelled diagram. Labels are legible at native 592×793 resolution.
- It identifies **ovary**, **immature ova**, **mature ovum at ovulation**, **infundibulum**, **oviduct**, **magnum**, **isthmus**, **uterus**, **vagina**, **cloaca**, **large intestine** and **vent**.
- This is useful visual support for the egg-formation sequence at blocks 794–795. It gives spatial context and names additional structures; it does not provide a male system or explanatory functions beyond labels.
- Preserve the full diagram and all labels if a rights-cleared replacement is sourced; do not crop away the lower cloaca/vent labels.

## Rights and reuse decision
- Neither image shows a photographer/publisher credit, copyright notice or reuse licence in the DOCX.
- image19 EXIF records an Infinix X559C camera and capture date 2019-04-08; this is capture metadata, not authorship or a licence.
- image20 has no EXIF rights metadata. Its embedded Word description contains a local filename referring to “reproductive-system-animal-science”; that is not a creator attribution or licence.
- **Reuse:** do not copy either image into learner-facing lessons or package assets unless a licence or written permission is obtained.
- **Derivative:** no crop, trace, redraw or derivative was created. A derivative of either unlicensed source would not resolve the rights issue.
- If these visual functions are required for delivery and permission is unavailable, use separately sourced rights-cleared replacements: (1) a fertile-egg cross-section with all seven source labels above, and (2) a poultry female reproductive-tract diagram retaining all named structures and leader-line relationships. The egg-shape/colour text may be taught as text only if separately authorised and factually reviewed; do not reproduce the photographed page.

## Original replacement assets now authored
Two new, independently authored SVGs are registered in `agricultural-science.json` and linked to the egg-formation supplement:
- `AG-ART-T3-W07-EGG-OVIDUCT-01` — `backend/src/db/ss1/assets/agricultural-science/t3-w07-poultry-oviduct.svg`; 4,965 bytes; SHA-256 `6a77e539204e845ca67f244b68fb1db9d4cc5c765b79e579b5e5bf2e31fb7759`.
- `AG-ART-T3-W07-EGG-CROSS-SECTION-01` — `backend/src/db/ss1/assets/agricultural-science/t3-w07-fertile-egg-cross-section.svg`; 3,550 bytes; SHA-256 `a2106024242f8c37532cc95a014281663927ea098755f5251862a5f277e54cc2`.

Both are original vector artwork, not copies, traces or derivatives of image19/image20. Asset approval remains PENDING and verification DEFERRED. The original unlicensed images must be excluded from learner delivery; the importer/learner route has not yet been verified.

## Changes and validation
- Added blocking open item `AGRICULTURAL-SCIENCE-T3-W07-REPRODUCTIVE-TRACT-RIGHTS`, identifying both images and the exact rights gap.
- Marked `AG-VIS-T3-W07-REPRODUCTIVE-TRACT` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts, status counts and `next_runnable`.
- Verified archive/member/image hashes; inspected both images; checked relationship IDs, block position, dimensions, metadata and nearby egg-formation prose.
- Parsed package/queue JSON; checked unique IDs and confirmed every PARTIAL/UNRESOLVED coverage row has an open-item reference.
- Importer, learner rendering and app/device display **not run**; testing remains deferred.
- No source bytes, media, asset rows, lessons, shared schema/compiler, other subject or delivery assets changed.
