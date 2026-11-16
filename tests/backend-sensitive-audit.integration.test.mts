import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import {
  auditStrict,
  verifyAuditLogIntegrity,
  AuditPersistenceError,
} from '../backend/src/utils/audit.js';
import type { AuthUser } from '../backend/src/types/index.js';

after(async () => {
  await pool.end();
});

function actor(): AuthUser {
  return {
    id: randomUUID(),
    username: 'bsec029-audit-test',
    role: 'admin',
    school_code: 'primary',
    assigned_class: null,
    assigned_subject_ids: [],
  };
}

test('strict audit writes redact sensitive metadata and preserve a verifiable school hash chain', async () => {
  const user = actor();
  const marker = randomUUID();
  const first = await auditStrict(
    user,
    'BSEC029_TEST_FIRST',
    'security_test',
    marker,
    'audit test event',
    {
      schoolCode: 'primary',
      outcome: 'success',
      metadata: {
        test_marker: marker,
        password: 'must-not-be-stored',
        nested: { access_token: 'also-secret', safe_count: 3 },
      },
    },
  );
  const second = await auditStrict(
    user,
    'BSEC029_TEST_SECOND',
    'security_test',
    marker,
    'second audit test event',
    { schoolCode: 'primary', outcome: 'denied', metadata: { test_marker: marker } },
  );

  assert.ok(first?.id);
  assert.ok(first?.event_hash);
  assert.ok(second?.event_hash);
  assert.equal(second.previous_hash, first.event_hash);

  const stored = await query(
    'SELECT metadata, outcome FROM audit_log WHERE entity_id=$1 AND action=$2 ORDER BY id DESC LIMIT 1',
    [marker, 'BSEC029_TEST_FIRST'],
  );
  assert.equal(stored.rows[0].metadata.password, '[REDACTED]');
  assert.equal(stored.rows[0].metadata.nested.access_token, '[REDACTED]');
  assert.equal(stored.rows[0].metadata.nested.safe_count, 3);

  const integrity = await verifyAuditLogIntegrity('primary');
  assert.equal(integrity.valid, true);
  assert.ok(integrity.checked >= 2);
});

test('audit log rejects UPDATE and DELETE mutations', async () => {
  const user = actor();
  const marker = randomUUID();
  const event = await auditStrict(
    user,
    'BSEC029_IMMUTABLE_TEST',
    'security_test',
    marker,
    'append-only trigger regression',
    { schoolCode: 'primary', metadata: { test_marker: marker } },
  );
  assert.ok(event?.id);

  await assert.rejects(
    query('UPDATE audit_log SET detail=$1 WHERE id=$2', ['tampered', event.id]),
    (error: unknown) => (error as { code?: string }).code === '42501',
  );
  await assert.rejects(
    query('DELETE FROM audit_log WHERE id=$1', [event.id]),
    (error: unknown) => (error as { code?: string }).code === '42501',
  );
});

test('strict audit rejects oversized metadata and reports persistence failure', async () => {
  await assert.rejects(
    auditStrict(actor(), 'BSEC029_OVERSIZE_TEST', 'security_test', randomUUID(), 'oversize', {
      schoolCode: 'primary',
      metadata: { payload: 'x'.repeat(17 * 1024) },
    }),
    (error: unknown) => error instanceof AuditPersistenceError
      && error.code === 'AUDIT_PERSISTENCE_FAILED',
  );
});
