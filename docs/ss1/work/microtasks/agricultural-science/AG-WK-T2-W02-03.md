# AG-WK-T2-W02-03 — Agricultural Science, Second Term Weeks Two and Three

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no crop-specific rates, fertilizer/herbicide rates or handling instructions were invented.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Second Term member `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx` SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme item 2–3: block 8; combined week label 31; topic 32.
- Pre-planting: blocks 38–73; planting: 74–134; post-planting/post-harvest: 135–231.
- Week range 31–278; SHA-256 `e251c8cbae1ddbd96d258e22b897e588dc6cd69adcde2c84b21212db14ed0d72`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Pre-planting operations | Cultural practices definition 38; clearing, stumping, layout, land preparation/tillage, ploughing, harrowing and ridging 41–59 | Source-taught |
| Planting operations | Definition, germination, sowing methods, planting considerations and nursery 74–126 | Source-taught |
| Post-planting and post-harvest operations | Thinning, supplying, irrigation, manuring/fertilizer, mulching, weeding, harvesting, processing and storage 135–220 | Source-taught |
| Combined scheme objective | Cultural practices across pre-/during-/post-planting | **PARTIAL** — package row/importer identity unverified |

## Assessment and practical scope
- Evaluations 61–66 cover clearing, stumping, tillage, ridging and primary/secondary tillage; all map to 42–59.
- Practical demonstration 68–73 explicitly requires clearing and tilling the school farm, layout and ten maize ridges. This practical component is retained as a distinct activity.
- Planting evaluation 128–133 maps to germination 83, in-situ sowing 93–95, spacing 108, nursery 118–126 and conditions 86–90.
- Post-planting evaluation 222–230 maps to thinning 152, weeding 205–207, supplying 158, manure 170–177, fertilizer 179–184 and application methods 188–192.
- General evaluation 232–234 and theory 272–275 are supported by the cultural-practices definition and pre-/planting/post-planting content.
- Field work 236–237 requires demonstration of all practices taught using simple tools; preserved.
- Weekend MCQs 240–270 map to tillage/ploughing/harrowing 48–50, ridging 59, stumping 43, layout 44–45, tillage advantages 53–57, planting considerations 102–115, nursery 122–126, mulching 197–203, weeding 205–207, thinning 152–156, supplying 158–162, organic/inorganic manure 174–184 and farmyard manure 176.

## Defects and follow-ups
- Block 175 says green manure is ploughed in just before flowering; weekend MCQ 268 says “as soon as it flowers”. `AG-FACT-T2-W02-03-GREEN-MANURE-ITEM` verifies the discrepancy.
- Block 180 says inorganic fertilizers are “usually prepared in the farm”; `AG-CORR-T2-W02-03-SOURCE-TERMS` verifies the statement before any delivery correction.
- Minor text defects: “post-posting operations” at block 39 conflicts with “post-planting operations” heading at 135; “plating space” at MCQ 254. These are included in the correction review.
- No crop-specific numerical planting spacing or seed-rate figures appear; none are supplied by this indexing record.
- Fertilizer caution at 186 and herbicide mention at 205 are preserved; no doses, rates, mixing or handling instructions are added.

## Changes and validation
- Added one PARTIAL coverage entry and three precise open items.
- Marked `AG-WK-T2-W02-03` `IMPLEMENTED_TESTING_DEFERRED`; appended two bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and the PARTIAL coverage's open-item link.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.


## Implementation follow-up (2026-11-11)

The exact source row `SS1-SRC-956594d97094:BODY:9b05ec628817f7406a90c51277a6e8fe5c6318c250a89cd9a819d6c529b29797` is now bound by `CORR-AG-T2-W02-03-CULTURAL-PRACTICES-REPLACEMENT` to the complete replacement lesson `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W02-03-CULTURAL-PRACTICES`. It covers pre-planting, planting, post-planting, harvest and post-harvest operations; corrects “post-posting” and “plating space”; distinguishes manufactured mineral fertilisers from on-farm organic manures; and reconciles green-manure timing as species-dependent, commonly at/near early flowering or full bloom before seed set. Coverage is IMPLEMENTED_EQUIVALENT. Content approval and learner-route verification remain pending.
