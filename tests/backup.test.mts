import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encryptPayload, decryptPayload, requirePassphrase, BackupConfigError, BACKUP_EXCLUDED_TABLES, type BackupPayload, type BackupTable } from '../backend/src/utils/backup.ts';
import { fkOrder, orderRowsParentsFirst, RESTORE_TRIGGER_BYPASSES } from '../backend/src/db/restoreBackup.ts';

const payload: BackupPayload = {
  version: 1, created_at: '2026-11-12T00:00:00.000Z', database: 'sts',
  tables: [{ name: 'topic_assets', columns: [{ name: 'id', type: 'integer' }, { name: 'bytes', type: 'bytea' }, { name: 'meta', type: 'jsonb' }],
    rows: [[1, Buffer.from([0, 1, 2, 250, 255]), { a: [1, 2] }], [2, null, null]] }],
};

test('round trip preserves bytea, json and nulls', () => {
  const out = decryptPayload(encryptPayload(payload, 'a-long-test-passphrase'), 'a-long-test-passphrase');
  const row = out.tables[0].rows[0] as any[];
  assert.ok(Buffer.isBuffer(row[1]));
  assert.deepEqual([...row[1]], [0, 1, 2, 250, 255]);
  assert.deepEqual(row[2], { a: [1, 2] });
  assert.deepEqual(out.tables[0].rows[1], [2, null, null]);
});

test('wrong passphrase and tampering are rejected', () => {
  const f = encryptPayload(payload, 'a-long-test-passphrase');
  assert.throws(() => decryptPayload(f, 'another-long-passphrase!'), /Wrong passphrase/);
  const t = Buffer.from(f); t[t.length - 1] ^= 1;
  assert.throws(() => decryptPayload(t, 'a-long-test-passphrase'), /Wrong passphrase or corrupted/);
  assert.throws(() => decryptPayload(Buffer.from('nope'), 'x'), /Not an STS backup/);
});

test('encrypted file does not contain plaintext', () => {
  assert.equal(encryptPayload(payload, 'a-long-test-passphrase').includes('topic_assets'), false);
});

test('passphrase must be set and long enough', () => {
  assert.throws(() => requirePassphrase({} as any), BackupConfigError);
  assert.throws(() => requirePassphrase({ BACKUP_PASSPHRASE: 'short' } as any), BackupConfigError);
  assert.equal(requirePassphrase({ BACKUP_PASSPHRASE: 'x'.repeat(16) } as any), 'x'.repeat(16));
});

test('fkOrder puts parents first and rejects cycles', () => {
  assert.deepEqual(fkOrder(['c', 'b', 'a'], [['c', 'b'], ['b', 'a']]), ['a', 'b', 'c']);
  assert.throws(() => fkOrder(['a', 'b'], [['a', 'b'], ['b', 'a']]), /Circular/);
});

const selfRef = (rows: unknown[][]): BackupTable => ({
  name: 'report_roster_progression_decisions',
  columns: [{ name: 'id', type: 'bigint' }, { name: 'supersedes_decision_id', type: 'bigint' }],
  rows,
});

test('orderRowsParentsFirst places every referenced row before the row that references it', () => {
  const ordered = orderRowsParentsFirst(selfRef([['3', '2'], ['2', '1'], ['1', null], ['4', null]]), 'id', 'supersedes_decision_id');
  assert.deepEqual(ordered.map(r => r[0]), ['1', '2', '3', '4']);
  const position = new Map(ordered.map((r, i) => [r[0], i]));
  for (const [id, parent] of ordered) if (parent !== null) assert.ok(position.get(parent)! < position.get(id)!);
});

test('orderRowsParentsFirst keeps already-ordered input stable and tolerates parents outside the table', () => {
  const rows = [['1', null], ['2', '1'], ['5', '999']];
  assert.deepEqual(orderRowsParentsFirst(selfRef(rows), 'id', 'supersedes_decision_id').map(r => r[0]), ['1', '2', '5']);
});

test('orderRowsParentsFirst rejects cycles, duplicate ids and missing columns', () => {
  assert.throws(() => orderRowsParentsFirst(selfRef([['1', '2'], ['2', '1']]), 'id', 'supersedes_decision_id'), /circular/i);
  assert.throws(() => orderRowsParentsFirst(selfRef([['1', null], ['1', null]]), 'id', 'supersedes_decision_id'), /duplicate id 1/);
  assert.throws(() => orderRowsParentsFirst(selfRef([]), 'id', 'no_such_column'), /lacks the id\/no_such_column columns/);
});

test('append-only audit tables are in scope for backups and their restore bypasses are explicit', () => {
  const excluded = new Set<string>(BACKUP_EXCLUDED_TABLES);
  for (const table of ['audit_log', 'report_roster_membership_events', 'report_roster_progression_decisions']) {
    assert.equal(excluded.has(table), false, `${table} must be captured by backups`);
  }
  const bypasses = RESTORE_TRIGGER_BYPASSES.map(b => `${b.table}.${b.trigger}`).sort();
  assert.deepEqual(bypasses, [
    'audit_log.audit_log_append_only_truncate',
    'report_roster_membership_events.report_roster_events_append_only_truncate',
    'report_roster_progression_decisions.report_roster_progression_append_only_truncate',
    'report_roster_progression_decisions.report_roster_progression_validate_insert',
  ]);
  // Update/delete guards and the successor check must never be lifted by a restore.
  assert.ok(!RESTORE_TRIGGER_BYPASSES.some(b => /guard_update|append_only_delete|update_delete|check_successor/.test(b.trigger)));
});
