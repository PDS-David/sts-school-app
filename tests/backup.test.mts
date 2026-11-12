import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encryptPayload, decryptPayload, requirePassphrase, BackupConfigError, type BackupPayload } from '../backend/src/utils/backup.ts';
import { fkOrder } from '../backend/src/db/restoreBackup.ts';

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
