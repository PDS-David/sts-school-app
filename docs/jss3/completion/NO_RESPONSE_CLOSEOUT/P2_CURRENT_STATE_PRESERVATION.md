# P2 — current-state preservation utility

Implemented; testing deferred by owner. No database contacted, utility executed,
test/typecheck run, production write or historical certification performed.
Base: 0b24cc84ac40778986a186348edac2eaa8ef1fac (P1 and rollback repair merged).

## Scope and contract

`scripts/jss3/current_state_preservation/preserve.py` uses Python 3 standard
library and the PostgreSQL `psql` client. Capture is an explicit invocation,
never startup/import behaviour. The SQL is REPEATABLE READ, READ ONLY, with
timeouts and row_security off (an RLS-restricted partial view must fail).

Protect **all schools and every topic not exactly `JSS 3`**, including Primary,
JSS1/JSS2, SS1–SS3, legacy spellings, unknown/null class values; no rewriting.
Also capture full referenced subject rows and full attached asset rows including
bytes. Every column is retained, including IDs, generated caches, timestamps,
sequence_rank and asset metadata. **No volatile fields are excluded.** Stop
learning/cache and unrelated curriculum writes across the maintenance window.
Shared subject modifications are detected. Unreferenced subjects, users,
completions and assessments are outside this curriculum-snapshot comparison;
this is not a database backup or proof of runtime-data preservation.

Same-database primary IDs, not reconstructed title/order keys, identify rows.
Capture refuses empty protected scope, duplicate IDs, missing/cross-school
subject relationships, assets outside scope and malformed data. JSONB row text
is retained verbatim inside the envelope, avoiding float rounding in comparisons.
All added/removed/modified rows fail preservation. Reports list IDs and old/new
row hashes without dumping content. Full values remain in private snapshots.

Endpoint/database name/OID, operator target label, operation ID, maintenance
reference and schema must match. The after timestamp must be later. Endpoint
identity is not a globally unique cluster identifier; operator target identity
must remain trustworthy and no failover/restore/proxy retargeting may occur.
Schema changes require a separately reviewed workflow: this comparator blocks
them instead of silently ignoring columns. The existing topic_assets schema is
required; this tool does not install it.

## Future authorised use (NOT run here)

Use a private folder outside Git with restrictive OS permissions. Snapshots
contain source text and binary assets. Python creates output files exclusively
with mode 0600; use equivalent Windows ACLs. Never attach snapshots to public PRs.
Use a SELECT-only role with visibility of every in-scope row and the necessary
schema metadata. Privately configure PGHOST, PGPORT, PGDATABASE, PGUSER and
PGPASSFILE or PGSERVICE. No URL/password CLI argument or printed diagnostics.
Do not use production credentials until that exact read operation is authorised.

```bash
# Substitute operator-authorised identifiers and private paths.
python3 scripts/jss3/current_state_preservation/preserve.py capture \
  --phase before --target-label TARGET_ID --operation-id OPERATION_ID \
  --operator-reference APPROVAL_REFERENCE --maintenance-reference WINDOW_REFERENCE \
  --output /private/before.json

# Perform ONLY the separately authorised JSS3 operation during the paused window.

python3 scripts/jss3/current_state_preservation/preserve.py capture \
  --phase after --target-label TARGET_ID --operation-id OPERATION_ID \
  --operator-reference APPROVAL_REFERENCE --maintenance-reference WINDOW_REFERENCE \
  --output /private/after.json

python3 scripts/jss3/current_state_preservation/preserve.py compare \
  --before /private/before.json --after /private/after.json \
  --output /private/comparison.json
```

Capture emits counts plus output SHA-256; keep those hashes separately in the
release evidence. Embedded digests detect accidental payload drift, not malicious
rewriting. Comparison returns 0 UNCHANGED, 1 CHANGED, 2 BLOCKED; emits a fresh
machine-readable report when possible. Existing files are never overwritten.
On CHANGED/BLOCKED, stop the release workflow and investigate; this tool cannot
undo changes and does not authorise a rollback. Use the separately rehearsed
backup/rollback plan. Concurrent writes invalidate attribution of differences
to JSS3. Neither snapshot observes transient changes between captures.

## Historical evidence stays separate

No expected count of 2179, no selected subset and no changes to P1_BASELINE or
B_PREP. UNCHANGED means equality of the observed current protected scope only.
The historical certified-2179 comparison remains unproven. This tool does not
waive that claim, certify curriculum, or prove a production release successful.

## Inspection and deferred cases

Inspected repository table definitions, source references, explicit transaction,
subprocess argument array, private output handling and comparison branches.
Execution and tests remain deferred. Later verify: same input scope unchanged;
add/delete/edit topic; class reclassification either direction; subject rename;
asset byte/metadata edits; duplicate/malformed IDs; RLS visibility; stale/different
schema or endpoint; timestamp reversal; output overwrite refusal; connection
failure and secret-safe error behaviour. Historical certification must remain
false in every result.
