# SS1 Agricultural Science — fact and content review register

**Subject package:** `backend/src/db/ss1/subjects/agricultural-science.json`  
**Review aid generated:** 2026-11-11  
**Package state:** `PENDING`

> This is an issue-level review index, not an approval. It does not change any package state or release gate. A qualified Agricultural Science reviewer (and, where specified, a veterinarian, forestry specialist, geologist or other relevant specialist) must record the decision against the exact lesson and evidence. Keep unresolved or disputed source claims explicit; do not force a single answer where multiple options are defensible.

## Current status

| Issue class | Total | Blocking delivery | Non-blocking |
|---|---:|---:|---:|
| Fact review | 31 | 26 | 5 |
| Content review | 14 | 9 | 5 |
| **Combined** | **45** | **35** | **10** |

The full package currently has 100 open items, 90 of which block delivery. All 47 lessons and 40 assets still have content approval pending, and lesson/asset verification remains deferred.

## Review protocol

For every blocking item:
1. Open the linked fact note, original source row and affected lesson(s).
2. Verify the claim against the cited primary/authoritative reference; check edition, page, jurisdiction, date and species where relevant.
3. Decide whether to **APPROVE**, **REVISE**, or **WITHDRAW** the affected claim/question. Do not treat an ambiguous multiple-choice item as having a unique answer.
4. If revised, update the learner-facing lesson/correction and regenerate the lesson approval register because its body hash changes.
5. Record reviewer name, role/qualification, date, exact item ID, affected lesson IDs and a durable approval reference. Only then may the corresponding package state be updated.

Content approval does not establish technical verification. Do not set verification to VERIFIED from a content review.

## Fact review items

### AGRICULTURAL-SCIENCE-T1-W01-FACT-CHECKS — **BLOCKING**

- **Affected records:** `COV-AG-T1-W01-MEANING`, `COV-AG-T1-W01-IMPORTANCE`, `COV-AG-T1-W01-CROP-SCIENCE-ASPECTS`
- **Evidence note(s):** [AG-FACT-T1-W01-FACT-CHECKS.md](AG-FACT-T1-W01-FACT-CHECKS.md)
- **Finding:** Week 1 fact review AG-FACT-T1-W01-FACT-CHECKS.md resolves the etymology discrepancy (Latin ager/agri + cultura), records a qualified correction for the recreation/tourism claim, and documents that the agro-based/agro-allied distinction and crop-pathology scope are already clarified in learner supplements. The original source is unchanged. The game-reserve/horse-sport wording still requires qualified content review; the cited textbook page ranges remain unverified because the exact editions were unavailable. No importer-bound delivery correction is claimed.
- **Required action:** Obtain qualified review of the proposed game-reserve/horse-sport wording; verify the cited textbook page ranges against the exact editions if they are to be retained; and, at the authorised importer stage, confirm the exact original Week 1 row/body hash before binding any delivery-only etymology or wording correction. Existing supplements remain content_approval PENDING.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W02-EXPORT-FACT — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W02-EXPORT-ITEM`, `SS1-SRC-7aa642b0085b`
- **Finding:** Weekend assignment Q4 at block 178 asks which item is not a source of foreign-exchange earnings in Nigeria (options include cotton, yam, cocoa and palm produce). Week 1 block 104 lists cocoa, coffee, groundnut, cotton, palm produce and timber as exports, but omission of yam from that list does not prove that yam is not exported or establish the intended answer.
- **Required action:** Research authoritative Nigerian agricultural-export evidence and determine whether the item has a defensible answer for the source's context; if not, record a source-backed correction or mark the question unresolved. Do not infer the answer from omission alone.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W03-CREDIT-OPTIONS — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W03-CREDIT-OPTIONS`, `SS1-SRC-7aa642b0085b`
- **Finding:** Week 3 weekend assignment block 310 asks where farmers can collect credit facilities and lists commercial banks, agricultural banks, thrift and savings societies, and mortgage. The source mentions commercial/agricultural bank loans (block 207) but does not teach thrift/savings societies or explain why mortgage is the exception.
- **Required action:** Verify the options against authoritative Nigerian agricultural-finance sources and determine whether the item has a defensible answer; do not rely on intuition alone or infer a key from the options.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W04-NGO-STATUS — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W04-NGO-STATUS`, `SS1-SRC-7aa642b0085b`
- **Finding:** Weekend Q5 417 classifies Agricultural Development Authority as the NGO exception, but the source does not explain its status or classify the other organisations beyond its example list.
- **Required action:** Verify the Nigerian status of Agricultural Development Authority and the listed organisations against authoritative records; recommend a sourced correction if needed.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W04-PEST-CONTROL — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W04-PEST-CONTROL-ITEM`, `SS1-SRC-7aa642b0085b`
- **Finding:** Weekend Q2 414 asks which of quarantine, crop rotation, fumigation and mulching is not a pest-control method. The source teaches plant quarantine at 371; crop rotation appears at Week 6 block 436; fumigation and mulching are not taught as pest-control methods. The question has no clear source-derived key.
- **Required action:** Verify the pest-control status of all four options against authoritative references and recommend a precise correction or withdrawal if the options do not yield one defensible answer.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W05-GENETICS-ITEM — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W05-GENETICS-ITEM`, `SS1-SRC-7aa642b0085b`
- **Finding:** Weekend Q2 454 offers 'Genetic engineering', while source 429 says 'genetics and breeding'; the source does not equate these terms.
- **Required action:** Verify the MCQ against authoritative genetics references and recommend retention, correction or withdrawal.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W06-INCUBATOR-ITEM — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W06-INCUBATOR-ITEM`, `SS1-SRC-7aa642b0085b`
- **Finding:** Weekend Q1 block 519 asks which option is not a farm machine: planter, incubator, sowing machine or plough. The source gives no definition or classification of an incubator.
- **Required action:** Verify the classification of incubators and the question's category boundary against authoritative agricultural-engineering references; recommend a precise correction if needed.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W07-GAME-RESERVE-USE — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W07-GAME-RESERVE-USE`, `SS1-SRC-7aa642b0085b`
- **Finding:** Weekend Q4 608 says agricultural land should not be used for game reserves or pastures, while the source classifies wildlife conservation/game reserves and grazing/pasture as agricultural uses at 558 and 561.
- **Required action:** Verify the intended land-use classification and recommend a precise correction or withdrawal; do not mark an answer that contradicts the source's own categories.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W07-LABOUR-FACTOR — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W07-LABOUR-FACTOR`, `SS1-SRC-7aa642b0085b`
- **Finding:** Weekend Q5 609 includes labour as a possible factor influencing land use; the source discusses climate, topography and population but does not state whether labour is a factor.
- **Required action:** Verify the intended answer using authoritative land-use/agricultural-economics sources and recommend a correction if the source scope is incomplete.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W07-LAND-MOBILITY — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W07-LAND-MOBILITY`, `SS1-SRC-7aa642b0085b`
- **Finding:** Week 7 block 549 says 'Land is mobile i.e. cannot be moved from a place of plenty to a place of scarcity.' The gloss contradicts the adjective. An original clarification supplement has now been authored and mapped in the subject package (SUP-SS1-AGRICULTURAL-SCIENCE-T1-W07-LAND-CLARIFICATIONS). It remains unapproved and unverified; the source wording is unchanged and the delivery-only correction still requires exact importer-confirmed row identity before it can be bound.
- **Required action:** Verify the intended land characteristic against an authoritative reference and record a source-backed correction or unresolved disposition; do not silently edit the source. The clarification supplement must receive content approval; bind the source correction only after the importer confirms the exact original lesson ID and body hash.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W08-LAND-USE-ACT — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W08-LAND-USE-ACT`, `SS1-SRC-7aa642b0085b`
- **Finding:** Week 7 block 583 says the Land Use Decree 1978 'prevents individuals from owning land'. This is overbroad: section 1 vests radical title in the State Governor to hold in trust, but sections 5–6 permit statutory/customary rights of occupancy to be granted to persons and organisations; sections 21–22 regulate alienation by approval/consent; section 24 recognises devolution of occupancy rights on death under customary law. The Supreme Court in Ogunleye v Oni (1990) and Abioye v Yakubu (1991) confirms that existing holders/occupiers and customary interests continue as rights of occupancy. The Act removes absolute freehold/radical title from private persons, but does not eliminate individual/family/community landholding rights. An original clarification supplement has now been authored and mapped in the subject package (SUP-SS1-AGRICULTURAL-SCIENCE-T1-W07-LAND-CLARIFICATIONS). It remains unapproved and unverified; the source wording is unchanged and the delivery-only correction still requires exact importer-confirmed row identity before it can be bound.
- **Required action:** Replace block 583's blanket claim with a precise explanation: 'The Land Use Act 1978 vests radical title in the Governor of each State to hold in trust. Individuals, families and communities may hold statutory or customary rights of occupancy; these rights may be inherited and may be assigned, mortgaged or subleased subject to the Act's applicable consent/approval requirements.' Distinguish the loss of absolute freehold title from the continued legal rights of occupancy; do not say individuals cannot own or hold land. Keep source bytes unchanged and bind the correction only through the approved correction workflow. The Week 8 Agricultural Laws and Reforms objective also needs a separate lesson explaining the Act's provisions and effects. The clarification supplement must receive content approval; bind the source correction only after the importer confirms the exact original lesson ID and body hash.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W08-PROMINENT-TENURE — **BLOCKING**

- **Affected records:** `COV-AG-T1-W08-PROMINENT-TENURE`, `AG-FACT-T1-W08-PROMINENT-TENURE`, `SS1-SRC-7aa642b0085b`
- **Finding:** The source's two Week 8 questions conflate a legal land-tenure system with a mode of acquiring an agricultural plot. A sourced clarification lesson now exists as SUP-SS1-AGRICULTURAL-SCIENCE-T1-W08-TENURE-CLARIFICATION and is mapped to COV-AG-T1-W08-PROMINENT-TENURE. NBS GHS-Panel Wave 4 (2018/19) and Wave 5 (2023/24) support family inheritance as the most common reported national mode of acquiring agricultural plots; this does not make inheritance the legal tenure system. The lesson remains content_approval PENDING and verification DEFERRED; exact delivery correction and teacher acceptance remain outstanding.
- **Required action:** Obtain qualified Agricultural Science/legal curriculum review of the distinction and the proposed wording for the two assessment items; record any approval only from a genuine review. At the authorised importer stage, confirm the exact original source row before binding any delivery-only correction. Do not change the archived source.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W10-BIENNIAL-DEFINITION — **BLOCKING**

- **Affected records:** `AG-FACT-T1-W10-BIENNIAL-CLASSIFICATION`, `SS1-SRC-7aa642b0085b`
- **Finding:** Week 10 block 878 defines biennial crops as completing their life cycle 'within as year' and lists cassava, pepper, onions, carrot and ginger. The definition is textually defective and the examples need classification verification.
- **Required action:** Verify the intended biennial definition and each listed example against authoritative crop-science sources; recommend a precise correction or unresolved disposition without changing original source text.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W02-03-GREEN-MANURE — **NON-BLOCKING**

- **Affected records:** `AG-FACT-T2-W02-03-GREEN-MANURE-ITEM`, `SS1-SRC-956594d97094`
- **Finding:** The replacement lesson now resolves the timing conflict without inventing one universal stage: many green manures are incorporated at or near early flowering/full bloom before seed set, while species-specific guidance may recommend earlier or slightly later termination. RHS, Infonet-Biovision and Alberta Agriculture guidance are cited in the lesson provenance. The replacement remains PENDING content approval and DEFERRED verification.
- **Required action:** During subject review, confirm the species-dependent timing explanation and keyed P5. Do not generalise one exact flowering stage to all green-manure crops.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W04-05-MULCHING-MCQ — **NON-BLOCKING**

- **Affected records:** `AG-FACT-T2-W04-05-MULCHING-MCQ`, `SS1-SRC-956594d97094`
- **Finding:** The complete replacement lesson now teaches mulching benefits accurately and includes keyed P7. The source row is replaced through CORR-AG-T2-W04-05-SELECTED-CROPS-REPLACEMENT. The lesson remains PENDING content approval and DEFERRED verification.
- **Required action:** During subject review, confirm the replacement lesson's mulching explanation and keyed P7. No separate source-row correction is outstanding for this MCQ.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W06-POLYGASTRIC — **NON-BLOCKING**

- **Affected records:** `AG-FACT-T2-W06-POLYGASTRIC-ITEM`, `SS1-SRC-956594d97094`
- **Finding:** The replacement lesson now explains cattle, sheep and goats as polygastric ruminants with four stomach compartments and rabbit as a hindgut fermenter, not a polygastric ruminant. The corrected answer to the source MCQ is rabbit; the source row is replaced through CORR-AG-T2-W06-AGRICULTURAL-ECOLOGY-REPLACEMENT.
- **Required action:** During subject review, confirm the animal-classification explanation and keyed P6. The lesson remains PENDING content approval and DEFERRED verification.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W07-MICA-MCQ — **NON-BLOCKING**

- **Affected records:** `AG-FACT-T2-W07-MICA-MCQ`, `SS1-SRC-956594d97094`
- **Finding:** The replacement lesson SUP-SS1-AGRICULTURAL-SCIENCE-T2-W07-ROCK-CHARACTERISTICS now teaches the mineral-versus-rock distinction explicitly: mica is a mineral group, sandstone and limestone are sedimentary rocks, and dolostone is the clearer name for the rock composed mainly of dolomite. Its keyed P4 assesses this distinction. The original row is replaced for learner delivery by CORR-AG-T2-W07-PEAT-TYPO-REPLACEMENT; the replacement lesson remains PENDING content approval and DEFERRED verification.
- **Required action:** During genuine subject review, confirm the revised mineral-versus-rock explanation and keyed P4 in the replacement lesson. No separate source-row correction is required for this MCQ; original source bytes remain unchanged.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W07-ROCK-FACTUAL-ACCURACY — **BLOCKING**

- **Affected records:** `COV-AG-T2-W07-ROCK-FACTUAL-ACCURACY`, `AG-FACT-T2-W07-ROCK-CHARACTERISTICS`, `SS1-SRC-956594d97094`
- **Finding:** The original Week 7 rock-characteristic lists contain two clear crystallinity errors and several overgeneralizations. A sourced clarification lesson now exists as SUP-SS1-AGRICULTURAL-SCIENCE-T2-W07-ROCK-CHARACTERISTICS and is mapped to COV-AG-T2-W07-ROCK-FACTUAL-ACCURACY. It preserves the original source and teaches the scientific patterns and exceptions, but remains content_approval PENDING and verification DEFERRED. Any exact delivery correction to the original parsed row still requires importer-confirmed source_lesson_id/body_sha256.
- **Required action:** Obtain qualified Agricultural Science/geology review of the clarification lesson and its keyed practice; record approval only from a genuine review. At the authorised importer stage, confirm the exact original Week 7 parsed row and decide whether a source-hash-bound delivery correction is needed. Do not change the archived source.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W01-EMASCULATOR — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W01-EMASCULATOR`, `SS1-SRC-458a07f7ea5a`
- **Finding:** Description 45 says an emasculator castrates male animals by 'rushing their spermatid cord'. The terminology appears inaccurate.
- **Required action:** Verify purpose/anatomical terminology against authoritative veterinary references and recommend safe, non-procedural wording; do not add castration instructions.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W02-DRYING-POWER — **NON-BLOCKING**

- **Affected records:** `AG-FACT-T3-W02-DRYING-POWER`, `SS1-SRC-458a07f7ea5a`
- **Finding:** The original broad “most common” regional-prevalence wording is superseded in the companion farm-power lesson by an evidence-based question distinguishing sunlight as the heat source for traditional open-sun drying from solar-thermal drying and solar-PV pumping. The evidence supports sunlight as the best answer among the printed options but does not establish a universal prevalence claim for every crop, season or locality.
- **Required action:** During subject review, confirm the revised practice question and answer in SUP-SS1-AGRICULTURAL-SCIENCE-T3-W02-FARM-POWER-OPERATIONS. No further source-row correction is required for this item; original source bytes remain preserved.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W02-WATER-POWER — **BLOCKING**

- **Affected records:** `AG-CORR-T3-W02-WATER-POWER`, `SS1-SRC-458a07f7ea5a`
- **Finding:** A source-hash-bound delivery correction (CORR-AG-T3-W02-POWER-WATER-REPLACEMENT) is now recorded against the actual parser/compiler identity. The replacement lesson is PENDING content approval and DEFERRED verification; the original source bytes remain unchanged and the learner route must withhold this row until approval/verification are complete.
- **Required action:** Obtain genuine subject-content approval and verification for the replacement lesson, then confirm the Agricultural Science learner route applies the exact source-hash-bound correction without deleting learner work. Do not deliver the original row while the replacement is pending.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W03-CROP-CLAIM — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W03-CROP-MECHANIZATION`, `SS1-SRC-458a07f7ea5a`
- **Finding:** Disadvantage block 315 says very few crops such as maize and rice can be mechanized. The claim may be overgeneralised or inconsistent with modern crop mechanization.
- **Required action:** Verify the claim against authoritative agricultural-engineering sources and recommend a qualified/corrected delivery statement without altering the source.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W03-LABOUR-MCQ — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W03-LABOUR-MCQ`, `SS1-SRC-458a07f7ea5a`
- **Finding:** Weekend MCQ 360 asks which is not a limitation of mechanization in West Africa, offering labour as the exception. The source lists small holdings, technical know-how and capital constraints, but also says mechanization displaces labour (310).
- **Required action:** Verify the intended category and regional context for labour in mechanization limitations; recommend a precise correction or clarification if the item is ambiguous.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W03-MECHANIZATION-DEFINITION — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W03-MECHANIZATION-DEFINITION`, `SS1-SRC-458a07f7ea5a`
- **Finding:** Definition block 289 describes mechanization as use of machines and also farm inputs such as insecticides, improved seeds and fertilizer. This may conflate mechanization with agricultural inputs/technology.
- **Required action:** Verify the scope of agricultural mechanization against authoritative agricultural-engineering references and recommend a precise delivery correction if the input list is conceptually misclassified.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W04-DIGESTIVE-ACCURACY — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W04-DIGESTIVE-ACCURACY`, `SS1-SRC-458a07f7ea5a`
- **Finding:** Digestive comparison table 431 claims monogastrics are not aided by bacteria and cannot synthesise their own protein, while polygastrics can; enzyme section 407-416 describes trypsinogen as converting proteins/peptones. These categorical statements and enzyme nomenclature/actions require verification.
- **Required action:** Verify the comparison table and enzyme names/actions against authoritative veterinary/animal-biology sources; distinguish microbial fermentation and species differences, and recommend exact corrections without changing source bytes.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W04-REPRODUCTIVE-ACCURACY — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W04-REPRODUCTIVE-ACCURACY`, `SS1-SRC-458a07f7ea5a`
- **Finding:** Male-system text 485-486 says the vas deferens connects testes to the uterus masculinus and that sperm are stored there; female-system text 492 calls Cowper's glands Bartholin's glands. These anatomical relationships/terms, the generic vaginal length and 'sex-inhibited characters' wording at 482 require specialist verification.
- **Required action:** Verify male and female reproductive anatomy and terminology against authoritative farm-animal veterinary references; distinguish species-specific structures and recommend precise non-procedural corrections.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W05-RESPIRATION-ACCURACY — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W05-RESPIRATION-ACCURACY`, `SS1-SRC-458a07f7ea5a`
- **Finding:** The source's three respiration equations at 532, 537 and 540 have ambiguous/missing reaction arrows and coefficient formatting; anaerobic respiration is equated with ethanol fermentation (539-541) in a farm-animal lesson. The bronchioles description at 546 and gill-raker/operculum functions at 552/597 also require verification.
- **Required action:** Verify equations and their formatting, distinguish animal anaerobic respiration from alcoholic fermentation, and check airway/gill anatomy and MCQ 597 against authoritative biology references. Preserve the original displayed equations and record any delivery-only correction separately.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W06-LACTATION-COLOSTRUM — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W06-LACTATION-COLOSTRUM`, `SS1-SRC-458a07f7ea5a`
- **Finding:** The source says lactation is controlled by oxytocin and can be increased by injecting it (750), says goat milk is the best/richest (751), calls colostrum's protective components 'antibiotic' (755), and describes poultry parturition as 'hatching' (733). These claims/terms need veterinary and dairy-science verification; no dosage or administration method is supplied or added.
- **Required action:** Verify lactation physiology, colostrum immunoglobulins/terminology, milk-composition comparisons and the distinction between laying and hatching. Recommend safe educational wording; do not provide oxytocin doses or injection instructions.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W06-REPRO-TIMINGS — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W06-REPRO-TIMINGS`, `SS1-SRC-458a07f7ea5a`
- **Finding:** Species sexual-maturity ages (609), oestrus-cycle intervals (613-617), ovulation times (622-626), heat durations (630-634) and gestation values (table 724) are presented as general species figures. The measurement basis and species/breed variation are not stated; the gestation table also concatenates paired species/values in cells.
- **Required action:** Verify each species-specific timing against authoritative veterinary reproduction references, clarify whether ovulation times are duration or timing relative to heat, and resolve the table's merged cell layout without changing the original source.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W07-EGG-TIMINGS — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W07-EGG-FORMATION`, `SS1-SRC-458a07f7ea5a`
- **Finding:** The source's egg-formation sequence and stage timings have been reviewed against authoritative poultry-science references. A clarification lesson now exists as SUP-SS1-AGRICULTURAL-SCIENCE-T3-W07-EGG-FORMATION and is mapped to COV-AG-T3-W07-EGG-FORMATION. It teaches approximate domestic-hen values (infundibulum 15–17 min, magnum about 3 h, isthmus about 75 min, shell gland about 20–21 h, vagina a few seconds to less than 1 min; total about 25–26 h) and explicitly warns that timings vary and are not universal across bird species. The lesson remains content_approval PENDING and verification DEFERRED.
- **Required action:** Obtain qualified poultry/animal-science review of the timing lesson and keyed practice. At the authorised importer stage, confirm the exact original egg-formation row and bind any delivery-only correction by source ID/body hash. Do not reuse unlicensed source figures.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W07-HORMONE-ACCURACY — **BLOCKING**

- **Affected records:** `AG-FACT-T3-W07-HORMONES`, `SS1-SRC-458a07f7ea5a`
- **Finding:** The original hormone table 828 contains incomplete or inaccurate sex/site/function assignments. A sourced clarification lesson now exists as SUP-SS1-AGRICULTURAL-SCIENCE-T3-W07-HORMONES and is mapped to COV-AG-T3-W07-HORMONES. It teaches the qualified roles of all seven hormones, including male FSH/LH, hypothalamic synthesis/posterior-pituitary release of oxytocin and species-dependent relaxin/progesterone sources. The lesson remains content_approval PENDING and verification DEFERRED.
- **Required action:** Obtain qualified animal-science/veterinary subject review of the independently authored hormone lesson and its keyed practice. At the authorised importer stage, confirm the original parsed row and decide whether a source-hash-bound delivery correction is needed. Do not reuse or reproduce the original source table without rights clearance.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

## Content review items

### AGRICULTURAL-SCIENCE-T1-W03-STORAGE-SOLUTION — **NON-BLOCKING**

- **Affected records:** `AG-CORR-T1-W03-STORAGE-SOLUTION`, `SS1-SRC-7aa642b0085b`
- **Finding:** The complete Week Three replacement lesson now corrects the source's absolute storage claim. It states that storage facilities and methods exist, but capacity, condition, affordability, geographic access and cold-chain services are inadequate or uneven for many farmers, especially for perishable produce. The correction is bound by CORR-AG-T1-W03-STORAGE-REPLACEMENT. Replacement approval and verification remain pending.
- **Required action:** During subject review, confirm the balanced storage/cold-chain explanation in SUP-SS1-AGRICULTURAL-SCIENCE-T1-W03-AGRICULTURAL-DEVELOPMENT. Do not restore the absolute claim that no facilities exist; do not invent storage-capacity statistics.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T1-W09-ASSESSMENT-SCOPE — **BLOCKING**

- **Affected records:** `SS1-SRC-7aa642b0085b`, `AG-FACT-T1-W09-SCOPE`
- **Evidence note(s):** [AG-FACT-T1-W09-SCOPE.md](AG-FACT-T1-W09-SCOPE.md)
- **Finding:** The AI-authored evidence brief and two bounded original lessons are now available. They are explicitly not a subject-expert decision. A qualified Agricultural Science/forestry reviewer must approve or amend the five grouped farmstead-planning principles, forestry scope and the school-level interpretation of primary forest product before these lessons can be approved for learner release.
- **Required action:** Obtain and record qualified subject-expert review against the decisions in AG-FACT-T1-W09-SCOPE.md; then update content_approval and approval_reference only from the genuine review record.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W02-03-SOURCE-TERMS — **NON-BLOCKING**

- **Affected records:** `AG-CORR-T2-W02-03-SOURCE-TERMS`, `SS1-SRC-956594d97094`
- **Finding:** The complete Weeks Two and Three replacement lesson corrects “post-posting operations” to “post-planting operations”, “plating space” to “planting space”, and explains that mineral fertilisers are manufactured/formulated products while organic manures may be prepared on-farm. The source row is bound through CORR-AG-T2-W02-03-CULTURAL-PRACTICES-REPLACEMENT. Replacement approval and verification remain pending.
- **Required action:** During subject review, confirm the corrected terminology and keyed practice in SUP-SS1-AGRICULTURAL-SCIENCE-T2-W02-03-CULTURAL-PRACTICES. No further source-row correction is required; original source bytes remain unchanged.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W04-05-CEREALS-TABLE-STRUCTURE — **BLOCKING**

- **Affected records:** `COV-AG-T2-W04-05-SELECTED-CROPS`, `AG-VIS-T2-TBL-CEREALS`, `SS1-SRC-956594d97094`
- **Finding:** The original Second Term cereals table at block 286 is a 17-row, three-column Word table: a blank S/N header, Maize and Rice columns, and sixteen attribute rows. The Word structure preserves each crop/value pairing, but the concatenated plain-text block removes cell separators and makes attribute/value boundaries ambiguous.
- **Required action:** When the owner-authorised importer/lesson mapping stage binds the original Weeks Four–Five lesson, preserve the Maize and Rice columns and all sixteen attribute rows as a structured table or explicit paired list. Retain every numeric value, unit, range, date and spelling exactly as printed; do not normalize or correct figures in this visual task. Do not rely on concatenated plain text or create a duplicate supplement for already-taught content. If the frozen importer/schema cannot preserve the table, request a versioned foundation change.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W04-05-LEGUMES-TABLE-STRUCTURE — **BLOCKING**

- **Affected records:** `COV-AG-T2-W04-05-SELECTED-CROPS`, `AG-VIS-T2-TBL-LEGUMES`, `SS1-SRC-956594d97094`
- **Finding:** The original Second Term legumes table at block 298 is a 17-row, three-column Word table: blank S/N header, Cowpea and Groundnut columns, and sixteen attribute rows. The Word structure preserves each crop/attribute/value pairing, but concatenated plain-text extraction removes cell separators and makes the values ambiguous.
- **Required action:** When the owner-authorised importer/lesson mapping stage binds the original Weeks Four–Five lesson, preserve the Cowpea and Groundnut columns and all sixteen attribute rows as a structured table or explicit paired list. Retain every printed figure, unit, range, date, cultivar name and spelling exactly; do not normalize or correct in this visual task. Do not rely on concatenated plain text or create a duplicate supplement for already-taught content. If the frozen importer/schema cannot preserve the table, request a versioned foundation change.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W04-05-ROOTS-TABLE-STRUCTURE — **BLOCKING**

- **Affected records:** `COV-AG-T2-W04-05-SELECTED-CROPS`, `AG-VIS-T2-TBL-ROOTS`, `SS1-SRC-956594d97094`
- **Finding:** The original Second Term roots/tubers table at block 309 is a 17-row, three-column Word table: blank S/N header, Yam and Cassava columns, and sixteen attribute rows. The Word structure preserves each crop/attribute/value pairing, but concatenated plain-text extraction removes cell separators. The Cassava Seed rate cell is blank in the source; this absence is itself source information and must not be filled by inference.
- **Required action:** When the owner-authorised importer/lesson mapping stage binds the original Weeks Four–Five lesson, preserve the Yam and Cassava columns and all sixteen attribute rows as a structured table or explicit paired list. Preserve the blank Cassava seed-rate cell as blank/not supplied; retain every other printed figure, unit, range, date, name and spelling exactly. Do not rely on concatenated plain text or create a duplicate supplement for already-taught content. If the frozen importer/schema cannot preserve the structure, request a versioned foundation change.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W04-05-TABLE-ANOMALIES — **BLOCKING**

- **Affected records:** `AG-CORR-T2-W04-05-TABLE-TEXT`, `SS1-SRC-956594d97094`
- **Finding:** The three original 17×3 crop tables (blocks 286, 298, 309) were re-extracted from the verified DOCX and their Word XML inspected. The superscript zero in '260C-300C' and '200c' is a degree marker, so display may normalize to 26°C–30°C and 20°C without changing numbers. Verified text repairs: 'per boiling'→'parboiling' (FAO/NAERLS rice-processing sources); '2/3 0f'→'2/3 of'; '30cmwithin row'→'30 cm within row'; joined binomials separated; 'Arachishypogea'→'Arachis hypogaea'; 'Dioscoreacayenesis'→'Dioscorea cayenensis'; 'Dioscoreadomentorum'→'Dioscorea dumetorum'; malformed yam list restructured with a closing parenthesis and separator, using supported names. 'Dioscorea rotundata' is retained as a common alternative taxonomy. The cassava sweet/bitter mapping conflicts with Nigerian parallel sources (NOU AFS202 and University of Melbourne) and Kew's modern taxonomy, so no swap is made. 'Dried loamy soil' remains unresolved; do not guess 'deep' or 'dry'.
- **Required action:** When the original Week Four–Five lesson and body_sha256 exist and a same-subject/same-term replacement lesson is authored, bind only the verified text corrections using exact source ID/hash and lesson IDs/hashes. Preserve all numeric figures, units, ranges, dates, seed rates, spacing and maturity periods verbatim. Leave 'Dried loamy soil' and the sweet/bitter cassava mapping unchanged pending a teacher-approved original or subject-expert decision. Do not fabricate lesson IDs/body hashes or edit the archived source.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W06-TERMINOLOGY — **NON-BLOCKING**

- **Affected records:** `AG-CORR-T2-W06-ECOLOGY-TERMINOLOGY`, `SS1-SRC-956594d97094`
- **Finding:** The full Week Six replacement lesson now uses autotrophs/heterotrophs for organisms and autotrophic/heterotrophic nutrition for processes. It also explains the ecosystem terminology and is bound through CORR-AG-T2-W06-AGRICULTURAL-ECOLOGY-REPLACEMENT. Replacement approval and verification remain pending.
- **Required action:** During subject review, confirm the terminology and keyed practice in SUP-SS1-AGRICULTURAL-SCIENCE-T2-W06-AGRICULTURAL-ECOLOGY. No separate source-row correction is outstanding; source bytes remain unchanged.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W07-PEAT-TYPO — **BLOCKING**

- **Affected records:** `AG-CORR-T2-W07-PEAT-TYPO`, `SS1-SRC-956594d97094`
- **Finding:** A source-hash-bound delivery correction (CORR-AG-T2-W07-PEAT-TYPO-REPLACEMENT) is now recorded against the actual parser/compiler identity. The replacement lesson corrects “peak” to “peat” and explains peat as an organic-rich, generally unlithified deposit and precursor to coal. The replacement remains PENDING content approval and DEFERRED verification.
- **Required action:** Obtain genuine subject-content approval and verification for SUP-SS1-AGRICULTURAL-SCIENCE-T2-W07-ROCK-CHARACTERISTICS, then confirm the learner route applies the exact source-hash-bound correction without deleting learner work. Do not deliver the original row while the replacement is pending.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W08-QUESTION-WORDING — **NON-BLOCKING**

- **Affected records:** `AG-CORR-T2-W08-QUESTION-WORDING`, `SS1-SRC-956594d97094`
- **Finding:** A complete Week Eight replacement lesson now teaches rock weathering and explicitly distinguishes weathering from rock formation and erosion. The source evaluation wording is corrected in CORR-AG-T2-W08-QUESTION-WORDING-REPLACEMENT. The replacement remains PENDING content approval and DEFERRED verification.
- **Required action:** Obtain genuine subject-content approval and verification for SUP-SS1-AGRICULTURAL-SCIENCE-T2-W08-ROCK-WEATHERING, then confirm the exact source-hash-bound learner correction. Do not deliver the original row while the replacement is pending.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T2-W09-SOIL-TERMS — **NON-BLOCKING**

- **Affected records:** `AG-CORR-T2-W09-SOIL-TERMS`, `SS1-SRC-956594d97094`
- **Finding:** A complete Week Nine replacement lesson now teaches the five soil-forming factors and corrects “sloppy area” to “sloping area” and “rock formation” to “soil formation” through CORR-AG-T2-W09-SOIL-TERMS-REPLACEMENT. The replacement remains PENDING content approval and DEFERRED verification.
- **Required action:** Obtain genuine subject-content approval and verification for SUP-SS1-AGRICULTURAL-SCIENCE-T2-W09-SOIL-FORMATION, then confirm the exact source-hash-bound learner correction. Do not deliver the original row while the replacement is pending.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W01-TOOL-NAMES — **BLOCKING**

- **Affected records:** `AG-CORR-T3-W01-TOOL-NAMES`, `SS1-SRC-458a07f7ea5a`
- **Finding:** A source-hash-bound delivery correction (CORR-AG-T3-W01-TOOL-NAMES-REPLACEMENT) is now recorded against the actual parser/compiler identity. The complete 30-tool reference lesson preserves the original Hand towel distractor at block 66 and corrects only the transplanting option at block 67 to Hand Trowel. The replacement remains PENDING content approval and DEFERRED verification.
- **Required action:** Obtain genuine subject-content approval and verification for SUP-SS1-AGRICULTURAL-SCIENCE-T3-W01-TOOL-REFERENCE, then confirm the learner route applies the exact source-hash-bound correction without deleting learner work. Do not deliver the original row while the replacement is pending.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W02-TEXT — **BLOCKING**

- **Affected records:** `AG-CORR-T3-W02-POWER-TEXT`, `SS1-SRC-458a07f7ea5a`
- **Finding:** A source-hash-bound delivery correction (CORR-AG-T3-W02-POWER-WATER-REPLACEMENT) is now recorded against the actual parser/compiler identity. The replacement lesson is PENDING content approval and DEFERRED verification; the original source bytes remain unchanged and the learner route must withhold this row until approval/verification are complete.
- **Required action:** Obtain genuine subject-content approval and verification for the replacement lesson, then confirm the Agricultural Science learner route applies the exact source-hash-bound correction without deleting learner work. Do not deliver the original row while the replacement is pending.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

### AGRICULTURAL-SCIENCE-T3-W06-EMBRYO-LAMB — **BLOCKING**

- **Affected records:** `COV-AG-T3-W06-UNTAUGHT-EMBRYO-AND-LAMB`, `AG-LES-T3-W06-EMBRYO-LAMB-PRESENTATION`, `SS1-SRC-458a07f7ea5a`
- **Finding:** A bounded supplement now teaches sheep embryo development and normal lamb presentation using the University of Florida College of Veterinary Medicine Drost ovine guide and peer-reviewed sheep embryology/lambing reviews. It is deliberately non-procedural. However, no independent named veterinary reviewer has signed off this repository lesson; veterinary approval is still required before learner release.
- **Required action:** Obtain an independent review/sign-off from a qualified veterinarian or veterinary reproduction lecturer. Do not add repositioning, extraction, assisted-delivery or treatment instructions. Keep content_approval PENDING and do not certify delivery until review is recorded.
- **Reviewer decision:** [ ] APPROVE  [ ] REVISE  [ ] WITHDRAW
- **Reviewer / qualification:** ____________________  **Date:** __________
- **Approval reference:** ____________________

## Release rule

No blocking fact or content item may be silently closed or reclassified to make the package pass. Update the package only after the stated evidence and genuine review decision exist. The package's own delivery guard remains authoritative; this register is only a navigational aid.
