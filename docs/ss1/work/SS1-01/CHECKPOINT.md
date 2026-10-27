# SS1-01 checkpoint
Status: IMPLEMENTED — TESTING DEFERRED BY OWNER (nothing executed: no tests, tsc, dry runs, DB, device).
Done: backend/src/db/ss1/* (constants, identity, schema, sourceRules, loader, compiler, importerHooks, data/sourceManifest.json); SS1 hooks in ingestTopics.ts; scripts/ss1/{prepare_sources.py,build_subject_packages.mts}; docs/ss1/contracts/{CONTRACT.md,WORKER_START.json,example-subject-package.json}; tests/ss1/foundation.test.mts; tests/test_ss1_prepare_sources.py; manual-dispatch workflow .github/workflows/ss1-foundation.yml.
Known input issue: the 3 per-term ZIPs supplied in chat match 58/61 manifest hashes. Different bytes: 1ST TERM S1 CHEMISTRY.doc (manifest has .docx), MATHss1.docx, 2nd Term GOVT.docx. Re-supply from the authoritative composite.
Resume: run deferred verification (docs/ss1/contracts/CONTRACT.md "Foundation interface"); first CI typecheck on PR is unplanned verification, not sign-off.
