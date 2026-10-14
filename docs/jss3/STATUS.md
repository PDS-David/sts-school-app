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

## Important acceptance boundary

This code is NOT a claim that JSS3 content is complete, certified, imported or deployed. The user authorized the commit/push on 15 October. No production database operation is part of the push. Startup and build do not run migrations or import curriculum.

The previous R9 content register is retained unchanged in CONTENT_GAPS_R9_UNCHANGED.csv: one closed item, 52 open and ten open-held. Later symbol and preservation evidence improves individual findings but does not supply missing lessons. Do not close gaps solely from a test pass. CONTENT_MATERIAL_REQUIREMENTS.md lists the exact missing material; its historical agent-work notes must be read alongside the fresh evidence here.

## Completed review items

SHORT_SOURCE_ROWS.csv identifies every one of the 13 short output rows: eleven revision/examination markers, one excursion heading, and the known Expository heading. They are not thirteen proven missing lessons and must not be counted as thirteen complete teaching bodies.

KEY_BODY_VERIFICATIONS.csv provides 23 exact-body comparisons. It closes the replay-only limitation for the Second-Term Yoruba bodies and confirms Simple Machine/English preservation and Civic duplicate provenance.

SOURCE_LINE_RECONCILIATION.csv retains all 585 prior candidate IDs/lines, including the 47 already classified as metadata. Of the other 538, 32 are found in current same-file executable bodies, two in pre-hold/pre-redistribution parsed bodies, three elsewhere (not proof of equivalent objective coverage), and 501 still require scheme/structural/semantic disposition. These are line candidates, not lesson counts. No semantic closure is claimed from text search alone.

## Still required before unconditional JSS3 certification/import

1. Genuine Alpha Civic scheme and notes; missing English and Yoruba material; the ten held lesson bodies; five complete textbook references/passages/questions; unresolved phonetic/label/coverage decisions. See the material list and register.
2. Complete semantic dispositions for remaining source-line candidates and any scheme objectives not already covered by the register. Do not invent material or silently exclude objectives.
3. Verify Music composites against original RTF geometry and actual phone-size readability; confirm Basic Technology display is unclipped and all three GIFs animate. Recovered media bytes alone do not certify display or layout.
4. Compare the certified 2,179 Primary/JSS1/JSS2 rows with an authoritative row export. No such certified row export was found in the supplied inputs. No production rows were changed by this work.
5. Run live PostgreSQL asset tests. The included GitHub workflow provisions a disposable database and uses repository assets; its outcome must be checked, not assumed. Local metadata tests used a simulated client.
6. Review existing-database compatibility, backup/rollback and obtain authorization for the particular production migration/import. Existing imported English content may require a controlled update; do not use a destructive reset or bypass importer mismatch checks.

## Asset operation

Assets and manifests are under curriculum-assets/jss3. They are not automatically attached or imported. The hidden Music tail duplicates part of a composite; the hidden Basic Technology icon remains undecided. Neither is enabled by this commit.

`attachTopicAssets.ts` defaults to dry-run. Existing metadata differences block unless --update-metadata is explicitly supplied; that flag still previews only unless --apply is added. It can update caption, kind, sort order and visibility, never bytes/hash/MIME/topic identity. Never bypass the title guard to work around an incorrect mapping.

An authorized migration must install the topic_assets table before the new asset endpoints can operate. Use the project's reviewed schema migration procedure on a test database first. The mobile screen reports missing asset requests and allows retry while leaving lesson text readable.

## Scope and provenance

No original curriculum documents or source text were rewritten. No curriculum holds released. No SS curriculum changes. The asset screen changes were supplied in Task 2; this integration fixes token-refresh ordering and failure/retry behaviour. The supplied Task 2 bundle contains local commits for 01–05 plus assets, despite its report's unqualified no-commit wording. This implementation integrates 06–08 as well.

For the local full-source verification package, use STS_JSS3_INTEGRATED_VERIFICATION.zip. Use its report and source hashes to reproduce the 139-test full-source run. The GitHub workflow tests software and asset delivery against a disposable database; it does not certify missing lesson content.
