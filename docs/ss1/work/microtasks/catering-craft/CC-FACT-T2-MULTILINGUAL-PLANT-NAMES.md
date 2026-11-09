# CC-FACT-T2-MULTILINGUAL-PLANT-NAMES — factual dependency review

Status: **IMPLEMENTED_TESTING_DEFERRED**. Findings only. The original table is unchanged; uncertain names are not filled by guesswork.

## Exact source and locator

- Source: `SS1-SRC-f433169ca25c`; member SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
- Full getBody() SHA-256: `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Table heading and rows: lines 681–695; private LibreOffice render page 17; visual disposition `CC-VIS-T2-W04-TBL2.md`.
- Exact row locators: African lemon tea 682; bitter leaf 683; tea bush 684; African nutmeg 685; African black pepper 686; locust beans 687; ginger and garlic 688; mustard seeds 689; basil 690; bay leaves 691; parsley 692; rosemary 693; moringa leaves 694; lovage 695.

## Findings

| Source row | Review result | Evidence / limitation |
|---|---|---|
| Bitter leaf: Ewuro / Shiwaka / Onugbu | **Corroborated** | Nigeria's Medicinal Plants Names database lists Ewuro (Yoruba), Onugbu (Igbo) and Shiwaka (Hausa) for `Vernonia amygdalina`. Infonet Biovision also lists these Nigerian names. |
| African nutmeg: Ariwo / Gujiyamiya / Ehuru | **Broadly corroborated; spelling variant** | Nigeria's Medicinal Plants Names database lists Ariwo/Abo-lakoshe (Yoruba), Gujiyyar dan miya (Hausa) and Ehuru (Igbo) for `Monodora myristica`. The source's `Gujiyamiya` appears to be a shortened/variant spelling; retain source spelling but do not silently normalize it. |
| African black pepper: Iyere / — / Uziza | **Yoruba and Igbo corroborated; Hausa cell incomplete** | University of Cape Coast's Department of Pharmacognosy identifies `Piper guineense` as Uziza (Igbo), Iyere (Yoruba) and Masoro (Hausa). The source's dash in the Hausa cell omits a reported name. |
| Locust beans: Iru / Dawadawa / Ogiri | **Corroborated for the fermented condiment; botanical wording needs care** | Nigerian ethnobotanical/food-condiment sources identify Iru (Yoruba), Dawadawa/Dadawa (Hausa) and Ogiri (Igbo) for fermented African locust-bean condiment. These names can refer to fermented condiments and may also be used for products from different seeds; do not assume every regional `Ogiri` product is necessarily `Parkia biglobosa`. |
| Ginger and garlic: Ayu / — / — | **Incomplete / misleading combined row** | Nigeria-focused plant-name sources distinguish ginger from garlic. Ginger is reported as Atalẹ/Ata ile (Yoruba), Chitta (Hausa), Jinja (Igbo); garlic as Aayu/Ayu (Yoruba), Tafruwa (Hausa), Ayo-ishi (Igbo). `Ayu` alone does not identify both ingredients. The source row should not be used as a combined multilingual equivalence. |
| Tea bush: Efirin / — / Nchaawu | **Ambiguous without botanical identity** | `Tea bush` is used for more than one plant. `Ocimum gratissimum` is called tea bush/scent leaf in some sources and is reported as Efirin (Yoruba), Nchuanwu/Nchaawu (Igbo) and Dai doya tagida (Hausa). `Lippia multiflora` is also called Gambian/tea bush and has different names (e.g. Efinrin-gogoro in Yoruba, Bunsurun fadama/Godon kada in Hausa). The source supplies no botanical name, so the row cannot be resolved as written. |
| African lemon tea: Ewe tea / — / Achara oyinbo | **Unresolved** | No botanical identity or reliable species-matched source was established for this exact English label and the two listed local names. Do not infer that it is the same plant as `Lippia multiflora` or `Ocimum gratissimum`. |
| Mustard seeds, basil, bay leaves, parsley, rosemary, moringa leaves, lovage | **No local equivalents supplied** | The source uses dashes in all language columns. No names are added. The blank cells are preserved until species-specific, language-aware verification is available. |

## References consulted

1. Nigeria Medicinal Plants Names & Pharmacognosy Database (NMPPDB), `Vernonia amygdalina` local names: https://nmppdb.com.ng/species-details?specy=vernonia-amygdalina
2. Infonet Biovision, *Bitter leaf*: https://infonet-biovision.org/crops-fruits-vegetables/bitter-leaf-new
3. NMPPDB, `Monodora myristica` local names: https://www.nmppdb.com.ng/species-details?specy=+monodora-myristica
4. University of Cape Coast, Department of Pharmacognosy & Herbal Medicine, `Piper guineense` local names: https://pharmacognosy.ucc.edu.gh/piperguineense
5. Nigerian Journal of Animal Science, 2021, 23(3), pp. 278–285, tables for ginger, garlic and black pepper local names: https://www.njas.org.ng/index.php/php/article/download/546/467
6. Nigeria-focused ethnobotanical research on `Ocimum gratissimum` local names: https://pmc.ncbi.nlm.nih.gov/articles/PMC3140126/
7. African Pharmacopoeia entry for `Lippia multiflora` (tea bush/Gambian tea): https://austrc.org/docs/Pharmacopeoa/AfricanPharmacopoeia.pdf
8. Recent Nigerian food-condiment review distinguishing Iru/Dadawa/Ogiri: https://link.springer.com/article/10.1007/s44187-025-00409-3

## Disposition

- Bitter leaf, African nutmeg and African black pepper have useful corroboration, with the caveats above.
- The source does not identify botanical species for tea bush or African lemon tea; the table is therefore not a complete, reliable glossary.
- Ginger and garlic must be separated before a lesson can use the local-language names.
- Hausa `Masoro` is reported for African black pepper but is absent from the source table; no source cell is silently filled.
- Package open item `CC-T2-LOCAL-PLANT-NAMES` blocks use of this multilingual table in delivered teaching until the missing species identifications and language entries are resolved.
- The source table and its original wording remain unchanged. No lesson, correction, answer or replacement table is authored here.
- No tests, importer, database or device runs were performed.
