# SS1-01 checkpoint

Base master: `351337dbf01d6320c2d393e3f5cf6729780a94ca`.
Task branch: `ss1/foundation-20261026-codex`.
Status: IMPLEMENTED — TESTING DEFERRED BY OWNER.

Implemented strict schema, 61-source registry, deterministic package loader,
pure compiler/disposition builder, five declarative rule operations, exact
correction/asset identities, source/asset hash guards, private archive staging,
real-importer plan CLI, existing-row compatibility helper, deferred negative
controls/preservation comparison, worker contract and machine handoff.

Importer SS1 reviewed path uses existing extractor/parser and fails closed on
pending packages. It is plan-only until later runtime integration and verification;
generic SS1 writes cannot bypass it. Existing transaction-level row compatibility
SQL remains intact. No changes to JSS3, SS2, SS3 policies, UI, schema, lockfiles or
other workers' content. Copied only prompt docs from PR65 to make dependencies
available on this branch; do not recreate historical source archives.

No subject content authored. All 21 subject packages are intentionally missing
and will report pending blockers. The 61-source metadata inventory is not teaching
coverage evidence. No tests/typechecks/dry runs/DB/device/release operations run.
No production/source bytes committed. Publish branch and draft PR; record actual
head in PR and final response. Do not merge before the separate verification phase.

Next: owner may assign SS1-02–07 against published foundation SHA. Each uses its
own subject paths and the one private SS1 archive. SS1-08 later integrates runtime
corrections/assets and full acceptance tooling. No additional batch starts here.
