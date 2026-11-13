import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import test, { after } from 'node:test';
import { collectPayload } from '../backend/src/utils/backup.js';
import { pool, query } from '../backend/src/db/pool.js';
import { restore, validateBackupPayloadShape } from '../backend/src/db/restoreBackup.ts';

const suffix = () => randomInt(100_000_000, 999_999_999).toString();

after(async () => {
  await pool.end();
});

test('restore refuses an unbacked table that references a table in the backup', async () => {
  const tableName = `bsec11_restore_child_${suffix()}`;
  await query(`DROP TABLE IF EXISTS public.${tableName}`);

  try {
    const payload = await collectPayload();
    const { rows: databaseRows } = await query('SELECT current_database() AS name');
    const database = String(databaseRows[0].name);

    await query(
      `CREATE TABLE public.${tableName} (
         id SERIAL PRIMARY KEY,
         school_code TEXT NOT NULL REFERENCES public.schools(code)
       )`,
    );
    await query(`INSERT INTO public.${tableName}(school_code) VALUES('primary')`);

    await assert.rejects(
      restore(payload, { apply: true, confirmDatabase: database }),
      /Target has tables not present in backup/,
    );

    const { rows } = await query(`SELECT COUNT(*)::int AS count FROM public.${tableName}`);
    assert.equal(rows[0].count, 1, 'restore refusal must preserve the dependent table row');
  } finally {
    await query(`DROP TABLE IF EXISTS public.${tableName}`);
  }
});

test('restore refuses schema column drift before truncating existing data', async () => {
  const payload = await collectPayload();
  const { rows: databaseRows } = await query('SELECT current_database() AS name');
  const database = String(databaseRows[0].name);
  const schools = payload.tables.find(table => table.name === 'schools');
  assert.ok(schools);

  const { rows: before } = await query('SELECT COUNT(*)::int AS count FROM schools');
  const codeColumn = schools.columns.find(column => column.name === 'code');
  assert.ok(codeColumn);
  codeColumn.type = 'jsonb';

  await assert.rejects(
    restore(payload, { apply: true, confirmDatabase: database }),
    /Target schema mismatch for "schools.code"/,
  );

  const { rows: afterRows } = await query('SELECT COUNT(*)::int AS count FROM schools');
  assert.equal(afterRows[0].count, before[0].count);
});

test('backup and restore preserve the target migration ledger', async () => {
  await query(`CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    checksum TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await query(
    `INSERT INTO public.schema_migrations(version,name,checksum)
     VALUES('0001','0001_baseline.sql','baseline-test-checksum')
     ON CONFLICT(version) DO NOTHING`,
  );

  const payload = await collectPayload();
  assert.equal(
    payload.tables.some(table => table.name === 'schema_migrations'),
    false,
    'schema migration history must not be captured as restorable application data',
  );

  const { rows: databaseRows } = await query('SELECT current_database() AS name');
  const database = String(databaseRows[0].name);
  await query(
    `INSERT INTO public.schema_migrations(version,name,checksum)
     VALUES('0002','0002_after-backup.sql','later-migration-checksum')
     ON CONFLICT(version) DO NOTHING`,
  );

  await restore(payload, { apply: true, confirmDatabase: database });

  const { rows } = await query('SELECT version FROM public.schema_migrations ORDER BY version');
  assert.deepEqual(rows.map(row => row.version), ['0001', '0002']);
});

test('restore rejects malformed row widths before connecting to the target database', async () => {
  const payload = await collectPayload();
  const table = payload.tables[0];
  table.rows.push([]);

  assert.throws(
    () => validateBackupPayloadShape(payload),
    /does not match its column count/,
  );
});
