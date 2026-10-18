# JSS3 implementation and completion status

Updated 15 October 2026. This is the Sow the Seed School repository, not edu-platform.

## Verified locally

The integrated curriculum implementation (prior patches 01–08), lesson-asset support, twelve occurrence-specific English symbol corrections and asset-loading/metadata fixes pass:

- 139/139 JSS3 tests with all real-source variables set; zero failed or skipped.
- 16/16 static checks and 12/12 focused asset-fix tests.
- Backend and mobile TypeScript.
- Full original-source dry run: 313 rows (First 151, Second 162, Third zero); Computer Studies zero.
- All 39 document hashes match the earlier R4B inventory.
- 29 asset hashes and destination titles match the current plan; 27 displayed, two hidden.
- Basic Technology image bytes match the original DOCX, including 58-, 89- and 66-frame GIFs.

Actual main() output capture (not a replay of parsing steps) confirms all seven Third-Term English teaching bodies, all five Basic Science bodies including Simple Machine, and all three Second-Term Yoruba bodies reach their executable rows unchanged. All eight First-Term Civic bodies equal the corresponding Third-Term bodies. Genuine Alpha Civic content is still not supplied.

All four Music composites reconstruct pixel-for-pixel from the documented original-RTF render crops and overlays (MUSIC_COMPOSITE_CHECK.json). This verifies the supplied recomposition, not phone readability or pedagogical completeness.

## GitHub verification

Commit `50b58e69479d57926bcf969fcd9d61150a70238d` passed [GitHub run 38653220961](https://github.com/PDS-David/sts-school-app/actions/runs/38653220961): backend/mobile types, 16 static checks, 12 focused regressions, and all 18 live PostgreSQL tests, with no skipped tests. All 27 displayed assets downloaded byte-identical, including the three GIFs; hidden assets were not served. Test records were cleaned up. A fresh-database setup defect was fixed by creating the schema before test cleanup. This is a disposable test database, not production.

## Important acceptance boundary

This code is NOT a claim that JSS3 content is complete, certified, imported or deployed. The user authorized the commit/push on 15 October. No production database operation is part of the push. Startup and build do not run migrations or import curriculum.

The previous R9 content register is retained unchanged in CONTENT_GAPS_R9_UNCHANGED.csv: one closed item, 52 open and ten open-held. Later symbol and preservation evidence improves individual findings but does not supply missing lessons. Do not close gaps solely from a test pass. CONTENT_MATERIAL_REQUIREMENTS.md lists the exact missing material; its historical agent-work notes must be read alongside the fresh evidence here.

## Completed review items

SHORT_SOURCE_ROWS.csv identifies every one of the 13 short output rows: eleven revision/examination markers, one excursion heading, and the known Expository heading. They are not thirteen proven missing lessons and must not be counted as thirteen complete teaching bodies.

KEY_BODY_VERIFICATIONS.csv provides 23 exact-body comparisons. It closes the replay-only limitation for the Second-Term Yoruba bodies and confirms Simple Machine/English preservation and Civic duplicate provenance.

SOURCE_LINE_RECONCILIATION.csv retains all 585 prior candidate IDs/lines, including the 47 already classified as metadata. Of the other 538, 32 are found in current same-file executable bodies, two in pre-hold/pre-redistribution parsed bodies, three elsewhere (not proof of equivalent objective coverage), and 501 still require scheme/structural/semantic disposition. These are line candidates, not lesson counts. No semantic closure is claimed from text search alone.

## Owner update and replacement sourcing — 15 October

The owner explicitly selected the attached Civic file for First Term and authorised internet equivalents for other missing items. The attachment matches the existing Civic source exactly; no duplicate is needed. See replacements/CIVIC_OWNER_DECISION.json. The earlier demand for a different Alpha-labelled file is superseded by that source choice; Omega provenance remains recorded.

replacements/INTERNET_EQUIVALENTS.json maps all 63 historical IDs and records 36 sources, verification levels and adaptation limits. Nine lesson drafts cover ten IDs; these are not imported. Source discovery does not establish lesson completion.

A fresh baseline/current comparison using all eight newly supplied protected-class archives and their 24 nested ZIPs finds exactly equal generated row objects: Primary 1,492 and JSS1/JSS2 741 (2,233 total). Both versions block raw-source audit acceptance. This is stronger source-output preservation evidence, not verification of the historical certified 2,179 database rows. See replacements/README.md.

## Still required before unconditional JSS3 certification/import

1. Implement the owner-authorised replacements for missing English and Yoruba material; the ten held lesson bodies; five complete textbook references/passages/questions; unresolved phonetic/label/coverage decisions. See the material list and register.
2. Complete semantic dispositions for remaining source-line candidates and any scheme objectives not already covered by the register. Do not invent material or silently exclude objectives.
3. Verify actual phone-size Music readability; confirm Basic Technology display is unclipped and all three GIFs animate. The four Music composites now match their documented source crops exactly, but this does not certify device display or layout.
4. Compare the certified 2,179 Primary/JSS1/JSS2 rows with an authoritative row export. The new source-output comparison confirms 2,233 raw-input candidate rows unchanged, but does not identify the historical certified subset. No production rows were changed by this work.
5. Live PostgreSQL asset tests are complete (18/18, run linked above). Existing-production-database compatibility and device acceptance remain separate gates.
6. Review existing-database compatibility, backup/rollback and obtain authorization for the particular production migration/import. Existing imported English content may require a controlled update; do not use a destructive reset or bypass importer mismatch checks.

## Asset operation

Assets and manifests are under curriculum-assets/jss3. They are not automatically attached or imported. The hidden Music tail duplicates part of a composite; the hidden Basic Technology icon remains undecided. Neither is enabled by this commit.

`attachTopicAssets.ts` defaults to dry-run. Existing metadata differences block unless --update-metadata is explicitly supplied; that flag still previews only unless --apply is added. It can update caption, kind, sort order and visibility, never bytes/hash/MIME/topic identity. Never bypass the title guard to work around an incorrect mapping.

An authorized migration must install the topic_assets table before the new asset endpoints can operate. Use the project's reviewed schema migration procedure on a test database first. The mobile screen reports missing asset requests and allows retry while leaving lesson text readable.

## Scope and provenance

No original curriculum documents or source text were rewritten. No curriculum holds released. No SS curriculum changes. The asset screen changes were supplied in Task 2; this integration fixes token-refresh ordering and failure/retry behaviour. The supplied Task 2 bundle contains local commits for 01–05 plus assets, despite its report's unqualified no-commit wording. This implementation integrates 06–08 as well.

For the local full-source verification package, use STS_JSS3_INTEGRATED_VERIFICATION.zip. Use its report and source hashes to reproduce the 139-test full-source run. The GitHub workflow tests software and asset delivery against a disposable database; it does not certify missing lesson content.

## Implemented supplement update (15 October 2026)

35 attributed lessons now run through the importer with `--jss3-supplements`. The combined plan is 348 rows: First 166, Second 182, Third 0; Computer Studies 0. Actual main() captures prove all 313 original row objects unchanged. Full selected English literature texts, four original comprehension passages, grammar/writing lessons, ten held-entry teaching replacements, Yoruba practice texts and two new teaching graphics are included. See replacements/IMPLEMENTATION.md for the exact coverage and current limitations. Seven multi-strand Yoruba entries remain partial; do not read the number of mapped IDs as certification. No production import has been performed.

16 October: replacement batch expanded to 38 lessons, adding inheritance, naming ceremonies and the complete licensed Yoruba story Ramúramù ewúrẹ́. Current combined plan: 351 (168 First, 183 Second, zero Third); originals remain 313 unchanged. See replacements/IMPLEMENTATION.md and NEXT_AGENT_HANDOFF.md for limits and continuation.

16 October follow-up: 41 supplements, combined plan 354 (170 First, 184 Second); agricultural excursion, Music time-signature examples and four lineage-praise excerpts added. YORUBA_OBJECTIVE_MAP.csv records 24 verified scheme-strand links. Six formerly partial Yoruba entries now have mapped replacement coverage; YO-T1-W2 oral-performance scope remains partial. Source-line reconciliation, certified-row identity and device/production acceptance remain separate blockers.

18 October 2026 (Batch 2 verification): 90 supplements, combined plan 403 rows (192 First, 211 Second, zero Third); the 313 original rows are unchanged from the Batch 1 capture (compared after removing the scratch path). All 328 semantic lines are classified and none remains a lead; 177 decisions are individually reviewed. All 90 lessons were returned by GET /learning/topics for a JSS 3 student against a throwaway local database (ROUTE_RETRIEVAL_EVIDENCE.tsv). Earlier counts in this file (35, 38, 41, 78) are historical. Node 24.19.0 was not available; see OB-09. No production import has occurred.
