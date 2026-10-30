# OPS-02 — Restore TLS certificate validation

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented, not approved, not verified).
Base: `origin/master` `aee51207e4c00fbfb4b6aa8d83348a6e0d72cad0`. Files: `backend/src/db/pool.ts`, `backend/.env.example`, this note.

## Old behaviour (quoted verbatim, `backend/src/db/pool.ts:7-10` at base)

```ts
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

In production the connection was encrypted but the server certificate was not validated. This was the only `ssl` setting in `backend/src` (no other `new Pool`/`new Client`).

## New behaviour

`resolveSsl(env)` (exported, `pool.ts`) builds the `ssl` option; `pool` calls `resolveSsl(process.env)`.

| NODE_ENV | DATABASE_SSL | DATABASE_SSL_CA | DATABASE_SSL_REJECT_UNAUTHORIZED | Result |
|---|---|---|---|---|
| not production | not `'true'` | any | any | `ssl: false` (unchanged; CA and escape hatch ignored) |
| production | any | unset | not `'false'` | `{ rejectUnauthorized: true }` |
| production | any | valid PEM | not `'false'` | `{ rejectUnauthorized: true, ca }` |
| production | any | set, no PEM block | any | throws at startup with a clear message |
| production | any | unset or valid PEM | `'false'` | `rejectUnauthorized: false` (+ `ca` if given) and one `console.warn` at startup |
| not production | `'true'` | same rows as production | same | same as the production rows |

Only the exact string `'false'` disables validation; any other value is ignored. `DATABASE_SSL_CA` is PEM text (not a path); a literal `\n` is converted to a newline so it fits one env line.

## Not changed

`DATABASE_URL`, JWT/bcrypt settings, secrets, non-production behaviour, any other file.

## Things the owner must check before deploying

- **Production will now fail to connect if the provider's certificate does not chain to a trusted CA.** The scripts under `backend/src/db/` that use `NODE_ENV=production` as the SSL switch against the external Render URL (for example `checkDrift.ts`, `createStagingAdmin.ts`) go through this pool and are affected the same way. If the provider uses a private CA, set `DATABASE_SSL_CA`. Use the escape hatch only as a temporary measure.
- Whether the current Render database certificate validates was **not tested** (no connection made).

## Not done / not verified

No tests, typechecks, database connection, migrations or deploy were run (testing deferred by owner). No certificate, key or connection string is committed.
