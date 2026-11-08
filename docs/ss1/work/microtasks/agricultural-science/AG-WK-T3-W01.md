# AG-WK-T3-W01 — Agricultural Science, Third Term Week One

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no drawings or tool descriptions are invented here.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Scheme Week 1: block 7; Week One label 26; topic 27.
- Tool list 36; practical/project 38; selected descriptions/functions 41–45; maintenance 47–54; evaluation 56–58; weekend 63–69; theory 71–73.
- Week One label block 26 SHA-256 `635789fb4e63974d59acfd3667c0b0fb9a4b935d51684c017ac9879e598deb6b`; range blocks 26–75 SHA-256 `fd12c22ae7e30ab3b7903457502daa6125da806655322eab6090e7f4e0e819d7`, both re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Examples of simple farm tools | 30 tools listed at block 36 | Source-taught |
| Descriptions and functions | Five selected tools described at 41–45 | **PARTIAL** — only five of 30 |
| General maintenance | Six practices at 49–54 | Source-taught |
| Overall objective | Simple farm tools, functions and maintenance | **PARTIAL** — package row/importer identity unverified |

The 30 listed tools are: cutlass, hoe, bolt and nut, shovel, garden fork, hand fork, axe, screw driver, digger, head pan, spanner, mallet, budding knife, plier, harvesting knife, crowbar, sickle, wheel barrow, shear, emasculator, mattock, hammer, watering can, chisel, pruning saw, secateurs, rake, hand trowel, spade and manure drag.

Only five selected tools have descriptions/functions: cutlass; spade and shovel; garden fork; secateurs; emasculator (41–45). General maintenance at 49–54: store wooden-part tools away from termites, oil/grease metal parts, paint metal parts for long storage, sharpen blunt edges, clean/wash after use, keep nozzles clear.

## Practical and assessment scope
- Practical/project block 38 requires a drawing book, drawings of all 30 tools, short descriptions, maintenance methods and uses. The requirement is preserved as a student project; the source does not supply drawings or descriptions for 25 tools.
- Evaluation 57 asks for seven post-planting tools; the source does not map tools to post-planting activities.
- Evaluation 58 (maintenance) is supported by 49–54.
- Weekend MCQ 64 (cutlass/weeding) supported by 41; Q65 (garden fork/digging/loosening) supported by 43; Q67 prints “Hand Towel” while the tool list says “Hand trowel” (36); Q68 identifies sickle for rice harvesting but the source does not state that use; Q69 oiling/greasing metal parts is stated at 50, though rust prevention is not explicitly explained.
- Theory 72 (four pre-planting tools) supported by cutlass, spade/shovel and garden fork at 41–43; theory 73 (pruning/stem cutting) supported by secateurs at 44.
- Reading assignment block 61 recorded; book/pages not opened or verified.

## Follow-ups and defects
- `AG-LES-T3-W01-TOOL-REFERENCE`: verified descriptions, uses and maintenance for all 30 tools; map at least seven to post-planting activities and support the drawing-book project.
- `AG-CORR-T3-W01-TOOL-NAMES`: verify “Hand Towel” vs “Hand trowel” in MCQ 67.
- `AG-FACT-T3-W01-EMASCULATOR`: verify “rushing their spermatid cord” and provide a safe, non-procedural veterinary definition; no castration instructions.
- Evaluation 57's seven post-planting tools are separately recorded as unresolved and included in the tool-reference follow-up.

## Changes and validation
- Added three coverage entries (one PARTIAL, two UNRESOLVED) and five precise open items.
- Marked `AG-WK-T3-W01` `IMPLEMENTED_TESTING_DEFERRED`; appended three bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.
