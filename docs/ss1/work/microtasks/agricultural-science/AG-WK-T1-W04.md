# AG-WK-T1-W04 — Agricultural Science, First Term Week 4 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. This indexes source material only; no lesson authoring, approval, verification or delivery acceptance is claimed.

## Inputs and integrity
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- First Term member SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Original `word/document.xml` inspected; no source bytes or conversions committed.

## Reproducible locators
Block = direct child of `w:body`, zero-based. Block text is concatenated `w:t` runs, UTF-8, no normalisation. Range hash = SHA-256 of block texts joined by newline, including empty blocks.
- Scheme entry 4: block 15 — “Roles of Government and Non-governmental Organization in Agricultural Development.”
- Week label: block 327; topic spans blocks 328–329.
- Government roles: blocks 335–381; NGO roles: blocks 386–399.
- Week range: blocks 327–420; SHA-256 `e7b9099d4ca963ad728a67b5fb866a6ad2f39d637861800077bc6ffce58fcf8f`, re-derived and matched.

## Scheme objective coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Government roles | Policy/goals 338–345; programmes/planning 349–351; inputs 355–356; amenities 358–359; storage/processing 361–362; extension 364–365; education 367–368; quarantine 370–371; research 373–381 | **PARTIAL** — source-taught; package row/importer identity unverified |
| NGO roles | Definition/examples 387–392; research 394; finance 395; inputs 396; extension 397; rural development 398; irrigation/drainage 399 | **PARTIAL** — source-taught; package row/importer identity unverified |

The government section lists seven research institutes at 375–381; the NGO section gives six contribution areas. Core source content supports the five-role/five-institute questions.

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 346–347 | Five goals of agricultural policy | Supported by 340–345. |
| 352–353 | Five government programmes | Supported by the list at 351. |
| 382–384 | Five government roles; five research institutes | Supported by 336–381; seven institutes are named. |
| 400–402 | Five NGO roles; five NGO examples | Roles supported by 394–399. Examples **UNRESOLVED** for Nigeria-specific framing: list 387–392 explicitly labels Hunger Project (Ghana) and Catholic Relief Service (Gambia). |
| 404–408 | Research institutes, NGO examples, government and NGO roles | Institute and role questions supported; NGO examples remain unresolved for Nigeria-specific scope. |
| 409–411 | Reading assignment | Book/page references recorded; books/pages not opened or verified. |
| 412–417 | Weekend MCQs | Q1 (413) asks the purpose of Farm Settlement Scheme, but 351 only names it. Q2 (414) asks for a pest-control exception among quarantine, crop rotation, fumigation and mulching; source does not yield a clear unique key. Q3–Q4 (415–416) are supported by government roles and policy goals. Q5 (417) classifies Agricultural Development Authority as the exception but does not explain its status; a fact check is appended. |
| 418–420 | Five programmes and two objectives each | Programme names are listed at 351; programme-specific objectives are **UNRESOLVED**. Broad policy goals at 340–345 are not objectives for each named programme. |

## Follow-up tasks
- `AG-LES-T1-W04-NGO-EXAMPLES`: supply five verified NGOs operating in or contributing to agricultural development in Nigeria, keeping the original mixed-geography list intact.
- `AG-LES-T1-W04-PROGRAMME-OBJECTIVES`: teach two verified objectives for at least five listed programmes and resolve the Farm Settlement Scheme question.
- `AG-FACT-T1-W04-PEST-CONTROL-ITEM`: determine whether the pest-control MCQ has one defensible answer.
- `AG-FACT-T1-W04-NGO-STATUS`: verify the NGO/government-agency classification in weekend Q5.

## Changes and validation
- Added four coverage entries (two PARTIAL, two UNRESOLVED) and five precise open items.
- Marked `AG-WK-T1-W04` `IMPLEMENTED_TESTING_DEFERRED`; appended four bounded follow-up tasks; recomputed queue counts and `next_runnable`.
- Parsed queue/package JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source text, lesson bodies, rules, corrections, assets, shared code or other subjects modified.
