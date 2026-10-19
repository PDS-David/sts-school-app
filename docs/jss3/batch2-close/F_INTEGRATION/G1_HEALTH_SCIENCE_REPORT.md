# G1 — Health and Science content (partial; corpus-dependent parts open)

Branch: `jss3/g1-health-science-20261019`, from master `8b64b8d` (F integration merged as PR 6). Node 22.22.2.

## Done and tested
- **SUP-BS-PLANT-ANIMAL-ECONOMY** (Basic Science, 2nd Term; SL-266 and SL-275): income, employment, trade, exports, raw materials, value addition, sustainable use. Nigerian evidence is quoted as dated NBS figures and flagged as changing quarterly; employment share is not given as one fixed number because sources differ.
- **SUP-HE-CHILD-DEVELOPMENT-STAGES** (Home Economics, 2nd Term; SL-554, Third-Term scheme line kept in an earlier term as with the other Third-Term HE lessons): stages with approximate ages, WHO motor-development windows (1st to 99th percentile) and CDC/AAP 75 per cent milestones, stated as typical ranges and not diagnostic deadlines. No immunisation table, dose or recipe; families are sent to the current Nigerian schedule on the child health card.
- Allow-list gains `WG-BS-SL266`, `WG-BS-SL275`, `WG-HE-SL554`. Records regenerated for these rows (IMPLEMENTED_LESSONS, CURRENT_COVERAGE, WIDER_WORKSTREAMS, TEACHER_SCHEDULE_SUPPLEMENTS, SEMANTIC_DECISIONS).
- New test `tests/jss3-g1-health-science.test.mts` (6 pass). All `tests/jss3-*.test.mts`: 214 tests, 167 pass, 0 fail, 47 skipped (need the private corpus or a database). Backend `tsc --noEmit` exit 0.

## NOT done (blocked on the private corpus, which is not in the repo)
- Delivery corrections for the bush-burning (SL-020) and deforestation (SL-022) rows: the mechanism is hash-guarded on the original row text, which cannot be computed without the corpus. No hash was guessed.
- Decathlon and sports-name corrections: the original row text is not available. Reference event lists from World Athletics are recorded in REMAINING_GAPS.
- SEMANTIC_CLOSURE and xref rebuild; real-corpus and database tests; Node 24.19.0; teacher certification.
- Left open as instructed: school project guidelines (B-05) and observed practical competence (B-06).

## Four levels
Integrated in code: yes (branch, not merged). Tested local: partial, corpus-free suites only. In production: no. Curriculum-certified: no.
