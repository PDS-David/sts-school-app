# Visual integration — 20 October 2026

Base master: `72b30bd562dac7a0554203a0a38dcb82224f31ff` (V2 merged). V1 branch `jss3/v1-business-visual-recovery-20261019` was merged without conflicts, preserving its history. Its delivery was already implemented on that branch, not yet on master. V3 had no remote delivery branch.

- V1: 19 Business asset bindings and four teaching lessons integrated. Preserve the worker report as historical; this integration report supersedes its publication state. The shorthand alt-text override now survives shared manifest regeneration, with hash validation.
- V2: 18 figures were already on master. Applied its two exact declarative lessons once, registered their gap, reconciled shared records, and added them to the six relevant existing delivery corrections so original lesson openings receive the figure explanations too. Worker base hash remains historical, not a guard against all later shared-file changes.
- V3: 12 Science assets, eight displayed unique assets; 17 bindings including replacements, 13 displayed. Two corrected Science lessons are source-hash guarded. Reconciled all 12 BT illustrations and animations and supplied descriptions. See `V3_SCIENCE/REPORT.md`.
- Resulting capture: 313 original rows +170 supplements =483; First234, Second249, Third0; Computer0. All 313 before/after original row objects are exactly equal. This says nothing about the unavailable certified 2,179-row export.

## Validation and expectation changes

Node24.19.0. Types, static, source tests, asset parser/metadata and fresh captures are recorded in `VISUAL_VERIFICATION.json`. The full-source gate validates all39 input hashes. Explicit `--tsx-no-ipc` adapter was used consistently with the preceding sandbox runs. No assertion is disabled by that adapter. CairoSVG was installed to run the V1 figure regeneration check.

Three expectation reconciliations are intentional: correction totals63→65 for the two guarded Science replacements; V2 test now requires the exact proposed entries to be applied once instead of requiring their absence; wider-workstream records carry both Math lesson links. No source totals were forced. V3 negative controls reject ambiguous identities, changed bodies and drift; shifted indices regenerate from identity. Existing tests continue to check all correction hashes against actual source rows.

No production connection, import, deployment or schema application occurred. Local PostgreSQL was unavailable: database suites remain separately required, with skips explicitly reported. No phone acceptance was performed. Drawn-figure recovery does not settle all Math equations, school choices, sequencing or practical certification.

## Next

Use `NEXT_SMALL_TASKS.md` one assignment at a time. Historical `NEXT_EXECUTION_PROMPTS.md` remains background, not an instruction to restart completed V tasks. The current app code and assets are implemented in the repository; they are not claimed to be deployed or present in production.
