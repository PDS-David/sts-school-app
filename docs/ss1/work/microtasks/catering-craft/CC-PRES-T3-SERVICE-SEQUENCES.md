# CC-PRES-T3-SERVICE-SEQUENCES — source-faithful preservation index

**Status:** IMPLEMENTED_TESTING_DEFERRED. This record keeps the source's service and table-laying sequences as separate source-faithful units. It does not rewrite, reorder, correct or enrich the original steps.

## Verified source
- Source ID: `SS1-SRC-d068ede78d16`
- Member: `SSS 1/3rd Term SS1_/3RD TERM S1 CATERING CRAFT PRACTICES.doc`
- Member SHA-256: `a2de209dab8d7b6a88c4e44ad3746c349db5b953d805c47457fa9185ab6e7d3e`
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full-body SHA-256 `b3499393aa9c5958398d008115ef024d58f039f85978d7d4460e03449fdac666` (56,838 characters, 940 lines).

## Separate sequence units
| Unit | Exact source lines | Preservation boundary |
|---|---:|---|
| Gueridon mise-en-place and procedure | 514–539 | Keep equipment list, set-up order and procedure together |
| Remaining table-service types | 544–570 | Preserve each service type and its original sequence separately |
| Self-service and single-point service, including vending | 603–670 | Preserve self-service, cafeteria/one-point and vending descriptions as distinct source sections |
| Specialized service types a–f | 697–707 | Preserve each named type and its steps |
| Banquet service | 712–718 | Preserve the source's banquet procedure and list order |
| Table laying and table setting | 751–829 | Preserve the tablecloth, table appointments and setting steps in original order |
| A la carte / classic / table d'hôte cover lay-ups | 883–911 | Preserve each cover layout separately; do not merge them into one generic setting |

Week indexes `CC-IDX-T3-W05.md` through `CC-IDX-T3-W09.md` contain the section indexes, source locators and per-week hashes.

## Preservation controls
- The source's exact step order, item lists, labels and wording remain in the verified source archive. The locators above point to that original member.
- Any correction or enrichment (including current hygiene, heat-handling or table-setting guidance) must be authored in a separate record and must not overwrite source text.
- Do not treat the source sequences as proof that a practical was performed or observed.
- No lesson, coverage, source rule, correction, answer or asset is created here. No tests, importer, database or device runs were performed; testing remains deferred by the owner.
