# Local verification commands

Run these from the repository root after `npm ci`.

## No database required

- `npm test` — runs the static Node suites and SS1 package/assessment tests.
- `npm run test:static` — runs root `.cjs` tests and the explicitly listed non-database `.mts` regression suites.
- `npm run test:ss1` — runs the SS1 package and bookkeeping assessment suites.
- `npm run typecheck` — typechecks backend and mobile using their existing tsconfig files.

These commands do not start the API, mobile app or any cloud service.

## Disposable PostgreSQL required

`npm run test:db` runs the root `*.db.test.mts` suites. Use a local disposable PostgreSQL instance only. Each suite checks its own environment variable and refuses non-local database hosts; set the exact variables named by the suite:

- `TOPIC_ASSETS_TEST_DATABASE_URL`
- `JSS3_V3_TEST_DATABASE_URL`
- `JSS3_YO_TEST_DATABASE_URL`
- `JSS3_SEQ_TEST_DATABASE_URL`
- `JSS3_LOCAL_TEST_DATABASE_URL`
- `MIGRATION_TEST_DATABASE_URL`

The JSS3 acceptance scripts may also require the local curriculum asset directory described in `scripts/jss3/README.md`. Do not point any test variable at a production, staging or shared school database.

## Important limits

- `npm test` intentionally excludes database suites.
- `npm run test:db` is destructive to its named disposable test databases: the integration suites create/drop isolated test databases and fixtures.
- A passing typecheck/static suite is not teacher approval, content approval, device acceptance or production-release approval.
- Owner-controlled acceptance/device testing remains deferred until explicitly re-enabled.
