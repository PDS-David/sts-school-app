import assert from 'node:assert/strict';
import { randomInt, randomUUID } from 'node:crypto';
import test, { after } from 'node:test';
import { BackupConfigError, collectPayload, runScheduledBackupIfDue } from '../backend/src/utils/backup.js';
import { auditStrict, verifyAuditLogIntegrity } from '../backend/src/utils/audit.js';
import type { AuthUser } from '../backend/src/types/index.js';
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

test('scheduled backup failure is persisted and retried no more than daily', async () => {
  const previousPassphrase = process.env.BACKUP_PASSPHRASE;
  delete process.env.BACKUP_PASSPHRASE;
  try {
    await assert.rejects(runScheduledBackupIfDue(), BackupConfigError);
    const { rows } = await query(
      `SELECT status, detail FROM backup_log
        WHERE kind='backup' AND created_by='system-scheduler'
        ORDER BY id DESC LIMIT 1`,
    );
    assert.equal(rows[0]?.status, 'failed');
    assert.match(rows[0]?.detail ?? '', /BACKUP_PASSPHRASE/);
    assert.equal(await runScheduledBackupIfDue(), false, 'a failed attempt must not retry within 24 hours');
  } finally {
    if (previousPassphrase === undefined) delete process.env.BACKUP_PASSPHRASE;
    else process.env.BACKUP_PASSPHRASE = previousPassphrase;
  }
});

test('restore preserves audit history and re-enables append-only protection', async () => {
  const user: AuthUser = {
    id: randomUUID(),
    username: 'bsec030-restore-test',
    role: 'admin',
    school_code: 'primary',
    assigned_class: null,
    assigned_subject_ids: [],
  };
  const marker = `BSEC030-${suffix()}`;
  const beforeBackup = await auditStrict(
    user, 'BSEC030_BACKUP_SNAPSHOT', 'backup_test', marker, 'included in backup',
    { schoolCode: 'primary', metadata: { marker } },
  );
  assert.ok(beforeBackup?.id);

  const payload = await collectPayload();
  const { rows: databaseRows } = await query('SELECT current_database() AS name');
  const database = String(databaseRows[0].name);

  const afterBackup = await auditStrict(
    user, 'BSEC030_AFTER_SNAPSHOT', 'backup_test', marker, 'must disappear after restore',
    { schoolCode: 'primary', metadata: { marker } },
  );
  assert.ok(afterBackup?.id);

  await restore(payload, { apply: true, confirmDatabase: database });

  const { rows: restored } = await query('SELECT event_hash FROM audit_log WHERE id=$1', [beforeBackup.id]);
  assert.equal(restored.length, 1, 'the snapshot audit event must be restored');
  assert.ok(restored[0].event_hash);
  const { rows: removed } = await query('SELECT id FROM audit_log WHERE id=$1', [afterBackup.id]);
  assert.equal(removed.length, 0, 'events created after the backup snapshot must not survive the restore');

  await assert.rejects(
    query('DELETE FROM audit_log WHERE id=$1', [beforeBackup.id]),
    (error: unknown) => (error as { code?: string }).code === '42501',
  );
  await assert.rejects(
    query('TRUNCATE audit_log'),
    (error: unknown) => (error as { code?: string }).code === '42501',
  );

  const integrity = await verifyAuditLogIntegrity('primary');
  assert.equal(integrity.valid, true, 'restored audit hash chain must remain verifiable');
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
