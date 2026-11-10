# AG-FACT-T3-W06-REPRO-TIMINGS — Agricultural Science, Third Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source values include reasonable approximations, but the rabbit entries, cycle definition/sequence and chicken gestation label are incorrect. Several timings also lack the reference point needed to interpret them.

## Source integrity and locators
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact Third Term DOCX member `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`, SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Blocks 609–647 range SHA-256: `9b93295c1afa3ce011ed4215be389a014894b2f0a9bcd145ae2e03af843f26ea`.
- Block 609: `6cabcdc5d127005725d37d9b8e48f34f8d2e760c995d114cde4aa535e9c3e72f`; block 612: `04064887960085606aed5f234dd30e53ef6a4732eb6d7c91a1d9236d9882e422`; block 647: `9ac91737f8db2d9f66a900ee3e52a1f320a9822afd9b172da0a0fbe9309ab13d`.
- Block 724 gestation table: `7b1f4bfc31fe563d88fe519302d11e61eb59129a4ad39d3f8dcde1c48207ac0c`.
- Respiration references elsewhere in the same source: block 532 `afcc926b0937742f62643dfaf20d388c097d6af220e16cd420eb1a95314732f6`; 537 `c17645e396c8d15a624516565074d3250fcbfc6f58777a740cb06e3fce2074f5`; 540 `1c18292c9659a843e71343a1d6c465386dc08e19b83651ab70470b074e845e25`; 541 `400a62fbb1d3786226c64996f593459e8eb6e5dc577af2d7ef957fef2c3cc178`; 546 `68b06737365c0926868d5b54b3b9a047971d0fb659a25956d93fae9d78e4d986`; 552 `2a80555772f8e747a8052164292afcdee862c4eee85bc851b898ccd9b4949fc8`; 597 `dbd3f291bac77d245bae5353032947d891891913b9e9b6f252c62d6d34ee8af1`.

## 1. Puberty / sexual maturity
The source gives cattle “up to 15 months”, goats/sheep “about 6 months” and poultry “about 18 weeks”.
- **Cattle:** puberty is commonly around 10–12 months; first breeding is often delayed until about 14–15 months and adequate body weight. The source likely conflates puberty with first breeding.
- **Ewe:** puberty commonly 6–9 months; breed, nutrition, season and body weight matter.
- **Doe goat:** puberty commonly 5–8 months (Merck table 5–7 months; detailed guidance 6–8 months); first breeding depends on body weight as well as age.
- **Pullet:** first laying commonly 18–22 weeks, depending on breed; 18 weeks is an early end, not a universal poultry value.
- **Rabbit doe:** puberty varies by size: small breeds 3.5–4 months, medium 4–4.5 months, giant 6–9 months.

Sources:
- Merck Veterinary Manual, “Features of the Reproductive Cycle” (cattle puberty 10–12 months, first bred ~14–15; sheep 6–9; goats 5–7; pigs 6–7): https://www.merckvetmanual.com/multimedia/table/features-of-the-reproductive-cycle
- Virginia Tech/Virginia Cooperative Extension, “Enhancing Reproductive Performance in Small Ruminants Part II: Puberty and Estrous Cycles” (goat 5–8 months, sheep 6–9 months; body weight matters): https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/APSC/APSC-158/APSC-158.html
- University of Arizona Cooperative Extension (2026), pullet first laying 18–22 weeks: https://extension.arizona.edu/publication/nine-common-reasons-your-hens-arent-laying
- Merck Veterinary Manual, “Management of Rabbits”, breed-size-specific puberty ages: https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/management-of-rabbits

## 2. Oestrous cycle definition and cycle lengths
Block 612 defines cycle length from the end of one heat to the beginning of another. Standard cycle length is measured **from onset of one oestrus/standing heat to onset of the next**. “Heat” and “oestrus” are synonyms, not separate consecutive phases. The source's claim that all nonpregnant female animals have an oestrous cycle is too broad: species differ, some are seasonal, and rabbits are induced ovulators without a conventional cycle.

| Species | Source value | Reference value | Finding |
|---|---:|---:|---|
| Cow | 20–21 days | Average 21; range 18–24 | Close, but too narrow |
| Ewe | 17–21 days | Average 16–17; range 14–20 (Merck) | 17 is a useful average; 21 is high for the usual range |
| Sow | 14–28 days | Average 21; range 19–23 | Too broad |
| Doe goat | 17–21 days | Average 21; range 18–24 | Use average and range |
| Doe rabbit | “spontaneous” | No conventional spontaneous ovulatory cycle; receptive to mating about 14 of every 16 days | Incorrect |

The cycle is regulated by the hypothalamic-pituitary-ovarian axis (GnRH, FSH, LH, oestrogen and progesterone), not oestrogen alone. Sheep/goats may be seasonal breeders in temperate conditions; cattle and pigs are generally polyoestrous year-round.

Sources:
- Merck Veterinary Manual, “Features of the Reproductive Cycle”: https://www.merckvetmanual.com/multimedia/table/features-of-the-reproductive-cycle
- Virginia Tech/Virginia Cooperative Extension, cycle definition and small-ruminant ranges: https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/APSC/APSC-158/APSC-158.html
- Merck Veterinary Manual, “Management of Rabbits”: https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/management-of-rabbits

## 3. Ovulation timing
The source correctly describes ovulation as release of an oocyte from the ovary, but the more accurate description is release of an oocyte from a mature follicle into the oviduct. FSH stimulates follicular development; the LH surge triggers ovulation.

| Species | Source value | Verified timing and basis |
|---|---:|---|
| Cow | 10–14 hours | About 10–12 h **after the end of standing estrus** |
| Ewe | 20–24 hours | Usually near end of estrus; about 24–30 h **after onset** |
| Sow | 24–36 hours | About 40 h **after onset of estrus** |
| Doe goat | 12–36 hours | About 12–36 h **after onset** in Virginia Tech; Merck reports wider variation (9–72 h), usually toward end |
| Doe rabbit | “spontaneous” | **Induced ovulator**; ovulation about 10–12 h **after mating** |

Sources:
- Merck Veterinary Manual, “Features of the Reproductive Cycle”: https://www.merckvetmanual.com/multimedia/table/features-of-the-reproductive-cycle
- Virginia Tech/Virginia Cooperative Extension, ewe and goat ovulation timing: https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/APSC/APSC-158/APSC-158.html
- Merck Veterinary Manual, “Puberty and Estrus in Goats” (reviewed June 2026): https://www.merckvetmanual.com/management-and-nutrition/management-of-reproduction-goats/puberty-and-estrus-in-goats
- FAO, *The Rabbit: Husbandry, Health and Protection* (induced ovulation 10–12 h after mating): https://www.fao.org/4/t1690e/t1690e.pdf

## 4. Heat/oestrus duration
Heat is the period of sexual receptivity (standing estrus); it is not a separate phase from “oestrus”.

| Species | Source value | Reference value | Finding |
|---|---:|---:|---|
| Cow | 5–24 h | Average ~18 h; range 6–24 h | Broadly close; lower bound should be ~6 h |
| Ewe | 35–36 h | 24–36 h | Too narrow at upper end |
| Sow | 40–48 h | 40–60 h | Too narrow |
| Doe goat | 40–50 h | 24–48 h typical; mean ~36 h, with breed variation | Too high/narrow as a general value |
| Doe rabbit | “spontaneous” | No conventional fixed heat period; receptive about 14 of every 16 days | Incorrect |

Sources:
- Merck Veterinary Manual, “Features of the Reproductive Cycle”: https://www.merckvetmanual.com/multimedia/table/features-of-the-reproductive-cycle
- Virginia Tech/Virginia Cooperative Extension: https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/APSC/APSC-158/APSC-158.html
- Merck Veterinary Manual, “Puberty and Estrus in Goats”: https://www.merckvetmanual.com/management-and-nutrition/management-of-reproduction-goats/puberty-and-estrus-in-goats
- Merck Veterinary Manual, “Management of Rabbits”: https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/management-of-rabbits

## 5. Summary sequence — block 647
The source says “ovulation then heat period then oestrus period”. This is wrong because heat and oestrus are synonyms. Ovulation occurs during or near the end of estrus at species-specific times. A standard mammalian cycle is commonly described as proestrus, estrus, metestrus and diestrus; seasonal species may also undergo anestrus.

Recommended wording:
> The oestrous cycle is the interval from the beginning of one heat (oestrus) to the beginning of the next. During oestrus the female is receptive to mating. Ovulation occurs at a species-specific time during or near the end of heat. If pregnancy does not occur, the cycle proceeds through the remaining phases and eventually returns to oestrus.

## 6. Gestation table — block 724
The source table lists mare 336 days, cow 283, doe goat 150, ewe 150, sow 114, rabbit 31 and hen 21.

| Species | Source value | Verified reference | Finding |
|---|---:|---:|---|
| Mare | 336 d | Average ~338–345 d; broad normal range ~320–380 d | Plausible, below average; mare/season variation |
| Cow | 283 d | Around 9 months; breed variation (Holstein ~279 d, Charolais ~287 d; Zebu longer) | Reasonable approximate value, not universal |
| Doe goat | 150 d | About 150 d; small-ruminant references ~146–155 d | Reasonable |
| Ewe | 150 d | About 150 d; Merck ~144–150 d, Virginia Tech ~140–159 d | Reasonable |
| Sow | 114 d | About 114 d | Correct approximate value |
| Rabbit doe | 31 d | About 31–33 d | Correct approximate value |
| Hen | 21 d | 21 d **egg incubation** | Not gestation; hens are oviparous |

Sources:
- Merck Veterinary Manual, “The Reproductive System in Animals”: https://www.merckvetmanual.com/reproductive-system/reproductive-system-introduction/the-reproductive-system-in-animals
- Merck Veterinary Manual, “Overview of Prolonged Gestation in Cattle and Sheep” (breed variation): https://www.merckvetmanual.com/reproductive-system/prolonged-gestation-in-cattle-and-sheep/overview-of-prolonged-gestation-in-cattle-and-sheep
- Oklahoma State University Extension, “Foaling Management and Care of the Nursing Foal” (mare average 338–345 d, broad range): https://extension.okstate.edu/fact-sheets/foaling-management-and-care-of-the-nursing-foal
- Merck Veterinary Manual, “Management of Rabbits” (31–33 d): https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/management-of-rabbits
- Mississippi State University Extension, “The Avian Embryo” (chicken egg incubation ~21 d): https://www.extension.msstate.edu/publications/the-avian-embryo

## Recommended delivery corrections
1. Separate puberty from first breeding age (cattle puberty 10–12 months; first breeding commonly 14–15 months).
2. Define cycle length as onset-to-onset; heat and oestrus are the same phase.
3. Replace rabbit “spontaneous” cycle/ovulation/heat entries with induced ovulation (~10–12 h after mating) and mating-receptivity information.
4. Give ovulation times with the reference point (after onset, after end, or after mating).
5. Use species-appropriate heat-duration ranges and note breed/season/body-weight variation.
6. Replace the sequence in block 647 with the corrected cycle description.
7. Retain mammalian gestation values as approximate ranges/averages; change hen's 21 days to a separate “egg incubation period” row.
8. State that gestation is measured from conception/ovulation to parturition; incubation from the start of egg incubation to hatch.

## Findings and disposition
- Clear errors: rabbit classified as spontaneous ovulator with a spontaneous cycle/heat; cycle measured end-to-start; block 647 treats heat and oestrus as separate; hen's incubation is listed as gestation.
- Approximate values needing qualification: puberty ages, cycle lengths, ovulation timing and heat durations; timing reference points are missing in several entries.
- Mare/cow/goat/sheep/pig/rabbit gestation values are broadly plausible approximations, with breed/species variation.
- Recommend the evidence-based delivery corrections above. No teacher/owner approval is inferred; no source values or answer key changed.

## Changes and verification
- Added this evidence note and marked `AG-FACT-T3-W06-REPRO-TIMINGS` `IMPLEMENTED_TESTING_DEFERRED`.
- Verified archive/member hashes; inspected blocks 609–647 and table 724 directly in DOCX XML and recomputed source range and key block/table hashes.
- Compared values with Merck Veterinary Manual, Virginia Tech/Virginia Cooperative Extension, FAO, University of Arizona Extension, Mississippi State Extension and Oklahoma State University Extension.
- No source bytes, package content, lesson body, answer key, correction binding, asset, shared schema/compiler or other subject changed.
- No tests, importer, TypeScript checks, DB, learner rendering or device checks were run; testing remains deferred.
