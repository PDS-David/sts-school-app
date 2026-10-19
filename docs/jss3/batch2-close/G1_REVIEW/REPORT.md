# Independent F and G1 implementation review — 19 October 2026

Reviewed master 8b64b8dca199abee6709543388261728940d2e39 (F merged) and G1 full branch 80d6593ba1fa21422189596963c014bfd39439bb. The smaller G1 branch is an earlier alternative; do not apply both. G2 was not changed.

## Findings and repairs

- F's 74 composed upserts, correction mechanism, regenerated records and eleven new asset bindings are present on master. Its old report saying “not merged” is historical. No new production status is inferred from the merge.
- G1 full adds six lessons and five hash-matched delivery corrections. Original source rows remain untouched.
- Corrected child-development examples that equated population windows with individual reassurance or advised waiting. The CDC 15-month checklist advises prompt discussion and screening for missed milestones; WHO windows are descriptive, not diagnostic clearance. Removed unsupported urgency reassurance.
- Corrected categorical claims that smoke cannot affect stratospheric ozone. NASA documents smoke aerosols from exceptional fires influencing ozone-destroying chemistry. The CO2 warming/ozone distinction remains.
- Distinguished sales revenue from profit. Removed unnecessary export/employment percentages that were only secondarily sourced; retained economic objectives and arithmetic examples.
- Confirmed Modupe Oshikoya in World Athletics and Jerry Okorodudu in Olympedia. They are no longer treated as unknown names. Removed the unsupported “first Nigerian to win two Olympic medals” superlative.
- Restored F's historical decision-merge log and coverage-conflict evidence overwritten by G1 regeneration. Updated the remaining-gap register's merged status and the incorrect claim that the unsafe smallpox table is still served unchanged.
- Regenerated lesson hashes/source URLs from actual importer output. G1 had changed B's working delivery records without refreshing checksums; refreshed both B checksum manifests. Historical originals remain available in earlier Git commits.

## Scope and limits

All 156 F lesson objects remain identical to master. G1 adds six. All 313 original row objects equal the earlier F capture. Final capture: 475 total, 230 First Term, 245 Second Term, zero Third Term, zero Computer Studies. Source documents remain private.

This review uses Node 24.19.0 and the documented --tsx-no-ipc workaround because the sandbox blocks the tsx CLI socket. Dependencies were reused from the existing local checkout; no lockfile was changed. Test results are in VERIFICATION.json.

Local PostgreSQL is unavailable here, so the two DB suites are not newly certified in this review. F's report records prior live-Postgres tests; these are inherited evidence. No schema migration, deployment, import or production query was performed. assessments.content_fingerprint must exist before the new routes run in production; inspect/apply the reviewed migration through the separately authorised release process.

Still open: school project guidelines, observed practical competence, unresolved school sports-name readings (Chidima Anyway / Stephen Meaning), teacher review of inherited biography claims and new teaching, protected-row baseline, device acceptance and production release steps. G2 owns the English/Yoruba work and is untouched. This is implementation verification, not curriculum certification.

## Reproduction

Use scripts/jss3/verify_handoff.py with the 39-file verified source root, --tsx-no-ipc, JSS3_CAPTURE_DIR pointing to the fresh current capture, and JSS3_BASE_CAPTURE_DIR pointing to the audited 86a1a61 capture. Separately run DB suites on a throwaway local PostgreSQL instance as documented in their test headers. Do not use production credentials for tests.
