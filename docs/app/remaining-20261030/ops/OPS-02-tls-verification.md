# OPS-02 — Restore TLS certificate validation

Status: READY · Depends: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/db/pool.ts`, `backend/.env.example`, `docs/app/remaining-20261030/evidence/OPS-02.md`

## Why (verified at master `8ffcd12`)

`backend/src/db/pool.ts:9-12` sets:

```ts
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
```

In production the connection is encrypted but the server certificate chain is **not validated**, so any party able to intercept the connection can present a forged certificate and read or alter school and student data. The reference manual flags this: "The production pool enables TLS with rejectUnauthorized:false, so that setting encrypts without validating the certificate chain."

This is the only TLS setting in the backend and the one authenticated-data path that every request depends on.

## Do

1. Default to verification: `rejectUnauthorized: true` when TLS is enabled.
2. Support standard Node options without inventing a config system:
   - `DATABASE_SSL_CA` — PEM contents (or a path, chosen explicitly) for providers that use a private CA; pass it as `ca`.
   - `DATABASE_SSL_REJECT_UNAUTHORIZED` — accept only the literal `'false'` as an explicit, documented escape hatch for a provider that cannot supply a valid chain. When used, log one startup warning naming the risk. Do not make it the default.
   - Keep `NODE_ENV !== 'production'` behaviour unchanged (no TLS locally) unless `DATABASE_SSL=true` is set.
3. Update `backend/.env.example` with the three variables and a one-line explanation each. Do not add real values.
4. Do not touch `DATABASE_URL`, secrets, JWT config or `bcrypt` settings.
5. Evidence note: the exact decision table (NODE_ENV × DATABASE_SSL × CA present × escape hatch) and the old line quoted verbatim.

## Acceptance (static)

- Production no longer defaults to `rejectUnauthorized: false`.
- Setting `DATABASE_SSL_REJECT_UNAUTHORIZED=false` is the only way to disable validation, and it is visible at startup.
- A supplied CA is actually passed to `pg`.
- No certificate, key or connection string is committed.

## Do not

- Connect to any database.
- Silently fall back to `false` when `DATABASE_SSL_CA` is malformed — fail at startup with a clear message.
- Claim the production connection was tested.
