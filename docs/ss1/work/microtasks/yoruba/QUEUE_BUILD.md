# Yoruba work queue — build note

- Reviewed master SHA: `204849e1a71347a3e8c132f1a857efba0d08d038`. No Yoruba queue existed. The only open PR is #71 (alternate foundation, do not merge); it holds no Yoruba SS1 work and was not used.
- Built from repository evidence only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device). Testing deferred by owner.

## Existing work recognised
- **None for implementation.** There is no `backend/src/db/ss1/subjects/yoruba.json`, no assets directory, no `tests/ss1/yoruba.package.test.mts`, no source rules, lessons, corrections or coverage.
- Three Yoruba sources are assigned in `SOURCE_ASSIGNMENTS.csv`; `backend/src/db/ss1/sourceRegistry.json` holds equal copies (same ID, member, SHA-256, size, term). `WORKER_START.json` lists the expected package path.
- `SS1-02/CHECKPOINT.md` says only that initial schemes/opening sections were read and no package exists.

| Source ID | Term | Member | SHA-256 |
|---|---|---|---|
| `SS1-SRC-48b641249e3b` | 1st Term | `SSS 1/1st Term SS1_/YORUBA.docx` | `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` |
| `SS1-SRC-ec4a5095420d` | 2nd Term | `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx` | `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` |
| `SS1-SRC-4cc6aae9ed7d` | 3rd Term | `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx` | `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3` |

## Evidence limitations
- All three rows are `FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER`: registered metadata, not verified headers. Each registration item reads the heading.
- The week inventory, scheme content, preamble sections, embedded objects and diacritic handling of all three documents are unknown to the repository. Hence one `SOURCE_WEEK_INVENTORY` item per document; no week, objective, lesson, asset or correction item was invented.
- The JSS3 Yoruba files under `docs/jss3` are a different class and were used only as reference notes (tone-mark review, oral-text rights), not as SS1 evidence.

## Queue totals (8 items: 8 PENDING, 0 IN_PROGRESS, 0 BLOCKED, 0 implemented)
- 3 `SOURCE_REGISTRATION` (`YO-SRC-T1..T3`; T1 is explicitly permitted to create `yoruba.json`).
- 3 `SOURCE_WEEK_INVENTORY` (`YO-INV-T1..T3`; each appends its own `YO-WK-*`, `YO-PRE-*`, `YO-VIS-*` and any foundation-request items).
- 1 `SCOPE_DECOMPOSITION` (`YO-SCOPE-OBJECTIVE-INDEXING`), 1 `TEST` (`YO-TEST-PACKAGE`, write-only, deferred).
- Dependency order: `YO-SRC-T1` → `YO-SRC-T2`, `YO-SRC-T3`; `YO-SRC-Tn` → `YO-INV-Tn` → `YO-SCOPE-OBJECTIVE-INDEXING` → `YO-TEST-PACKAGE`.

## Next runnable task
**`YO-SRC-T1`** — the only item with no unmet dependency. Attach `SSS 1-20260507T072431Z-3-001.zip` (a `(1)` display name is fine if the SHA-256 matches `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`) and its member `SSS 1/1st Term SS1_/YORUBA.docx` (SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`). `YO-SRC-T2`/`T3` become runnable after it; the `YO-INV-Tn` items after their registration.

## Unmerged work to preserve
None for Yoruba. PR #71's branch (`b5ced7ebb0efe22df2351baa140266fbf40cbf41`) must still be preserved for the Mathematics, Further Mathematics and Physics D-items; that is outside this queue.
