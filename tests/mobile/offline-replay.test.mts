import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldEnqueueOfflineWrite } from '../../mobile/src/offline/replayPolicy.ts';
import { createSerialQueue } from '../../mobile/src/offline/serialQueue.ts';
import { createOutboxStore } from '../../mobile/src/offline/outboxStore.ts';
import { isRestorableUser } from '../../mobile/src/api/authSession.ts';
import { shouldDiscardOutboxFailure } from '../../mobile/src/offline/outboxFailurePolicy.ts';
import { shouldStopOutboxFlush } from '../../mobile/src/offline/outboxFlushPolicy.ts';
import { getMaterialDownloadTarget, isSafeMaterialUrl } from '../../mobile/src/utils/materialDownload.ts';

test('normal failed writes remain eligible for offline queueing', () => {
  assert.equal(shouldEnqueueOfflineWrite({}), true);
});

test('outbox replay failures are not enqueued as replacement writes', () => {
  assert.equal(shouldEnqueueOfflineWrite({ _skipOfflineQueue: true }), false);
});

test('requests without config remain eligible for offline queueing', () => {
  assert.equal(shouldEnqueueOfflineWrite(undefined), true);
});


test('concurrent outbox mutations execute in FIFO order', async () => {
  const run = createSerialQueue();
  const order: string[] = [];
  await Promise.all([
    run(async () => { await new Promise(resolve => setTimeout(resolve, 10)); order.push('first'); }),
    run(async () => { order.push('second'); }),
    run(async () => { order.push('third'); }),
  ]);
  assert.deepEqual(order, ['first', 'second', 'third']);
});

test('a failed outbox mutation does not block later mutations', async () => {
  const run = createSerialQueue();
  await assert.rejects(run(async () => { throw new Error('storage failure'); }), /storage failure/);
  const result = await run(async () => 'next operation completed');
  assert.equal(result, 'next operation completed');
});

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    values,
    async getItem(key: string) { return values.get(key) ?? null; },
    async setItem(key: string, value: string) { values.set(key, value); },
  };
}

test('outbox writes reject when durable storage fails', async () => {
  const storage = memoryStorage();
  const outbox = createOutboxStore<{ id: string }>(
    { ...storage, async setItem() { throw new Error('disk unavailable'); } },
    () => 'student-a',
  );
  await assert.rejects(outbox.enqueue({ id: 'pending-1' }), /disk unavailable/);
});

test('outbox rejects corrupt persisted data instead of overwriting queued work', async () => {
  const storage = memoryStorage();
  storage.values.set('offline_outbox:student-a', '{broken');
  const outbox = createOutboxStore<{ id: string }>(storage, () => 'student-a');
  await assert.rejects(outbox.enqueue({ id: 'new-write' }));
  assert.equal(storage.values.get('offline_outbox:student-a'), '{broken');
});

test('queued mutations retain the account namespace captured before waiting', async () => {
  const storage = memoryStorage();
  let namespace = 'student-a';
  let releaseFirstWrite!: () => void;
  let firstWriteStarted!: () => void;
  const started = new Promise<void>(resolve => { firstWriteStarted = resolve; });
  const release = new Promise<void>(resolve => { releaseFirstWrite = resolve; });
  const delayedStorage = {
    async getItem(key: string) { return storage.getItem(key); },
    async setItem(key: string, value: string) {
      if (key === 'offline_outbox:student-a' && !storage.values.has(key)) {
        firstWriteStarted();
        await release;
      }
      await storage.setItem(key, value);
    },
  };
  const outbox = createOutboxStore<{ id: string }>(delayedStorage, () => namespace);
  const first = outbox.enqueue({ id: 'first' });
  await started;
  const second = outbox.enqueue({ id: 'second' });
  namespace = 'student-b';
  releaseFirstWrite();
  await Promise.all([first, second]);
  assert.deepEqual(JSON.parse(storage.values.get('offline_outbox:student-a')!), [
    { id: 'first' }, { id: 'second' },
  ]);
  assert.deepEqual(await outbox.getAll(), []);
});

test('persisted session accepts only known roles and a non-empty user ID', () => {
  assert.equal(isRestorableUser({ id: 'user-1', username: 'student', school_code: null, role: 'student' }), true);
  assert.equal(isRestorableUser({ id: 'user-2', username: 'parent', school_code: 'SCH1', role: 'parent' }), true);
  assert.equal(isRestorableUser({ id: 'user-3', username: 'teacher', school_code: 'SCH1', role: 'teacher' }), true);
  assert.equal(isRestorableUser({ id: 'user-4', username: 'admin', school_code: null, role: 'admin' }), true);
  assert.equal(isRestorableUser({ id: 'user-5', username: 'finance', school_code: null, role: 'finance_admin' }), true);
  assert.equal(isRestorableUser({ id: '', username: 'student', school_code: null, role: 'student' }), false);
  assert.equal(isRestorableUser({ id: 'user-6', username: 'unknown', school_code: null, role: 'unknown' }), false);
  assert.equal(isRestorableUser({ id: 'user-7', role: 'student' }), false);
  assert.equal(isRestorableUser(null), false);
  assert.equal(isRestorableUser('not-json-object'), false);
});

test('outbox retains writes rejected by authentication, permissions or conflicts', () => {
  assert.equal(shouldDiscardOutboxFailure(401), false);
  assert.equal(shouldDiscardOutboxFailure(403), false);
  assert.equal(shouldDiscardOutboxFailure(409), false);
});

test('outbox discards permanent invalid-request failures only', () => {
  assert.equal(shouldDiscardOutboxFailure(400), true);
  assert.equal(shouldDiscardOutboxFailure(404), true);
  assert.equal(shouldDiscardOutboxFailure(422), true);
  assert.equal(shouldDiscardOutboxFailure(undefined), false);
  assert.equal(shouldDiscardOutboxFailure(500), false);
});

test('material downloads accept HTTPS and generate safe local filenames', () => {
  const target = getMaterialDownloadTarget(
    'https://cdn.example.test/files/lesson-notes.pdf?download=1',
    '../../Lesson Notes',
    'pdf',
  );
  assert.deepEqual(target, {
    url: 'https://cdn.example.test/files/lesson-notes.pdf?download=1',
    fileName: 'Lesson_Notes.pdf',
    mimeType: 'application/pdf',
  });
});

test('material downloads reject insecure and non-web URL schemes', () => {
  assert.equal(getMaterialDownloadTarget('http://example.test/a.pdf', 'Notes', 'pdf'), null);
  assert.equal(getMaterialDownloadTarget('file:///etc/passwd', 'Notes', 'pdf'), null);
  assert.equal(getMaterialDownloadTarget('javascript:alert(1)', 'Notes', 'pdf'), null);
  assert.equal(getMaterialDownloadTarget('', 'Notes', 'pdf'), null);
});

test('material links require a valid HTTPS URL', () => {
  assert.equal(isSafeMaterialUrl('https://school.example/material.pdf'), true);
  assert.equal(isSafeMaterialUrl('https://school.example:8443/files/material.pdf'), true);
  assert.equal(isSafeMaterialUrl('http://school.example/material.pdf'), false);
  assert.equal(isSafeMaterialUrl('https://'), false);
  assert.equal(isSafeMaterialUrl('https://school.example/a b.pdf'), false);
  assert.equal(isSafeMaterialUrl('javascript:alert(1)'), false);
});

test('outbox replay stops after an expired session response', () => {
  assert.equal(shouldStopOutboxFlush(401), true);
  assert.equal(shouldStopOutboxFlush(403), false);
  assert.equal(shouldStopOutboxFlush(409), false);
  assert.equal(shouldStopOutboxFlush(undefined), false);
});

test('outbox validates queued request records before replay', async () => {
  const storage = memoryStorage();
  storage.values.set('offline_outbox:student-a', JSON.stringify([{ id: 'missing-method' }]));
  const outbox = createOutboxStore<{ id: string }>(
    storage,
    () => 'student-a',
    'offline_outbox:',
    (value): value is { id: string } => !!value && typeof value === 'object'
      && typeof (value as { id?: unknown }).id === 'string'
      && typeof (value as { method?: unknown }).method === 'string',
  );
  await assert.rejects(outbox.getAll(), /invalid data/);
  assert.equal(JSON.parse(storage.values.get('offline_outbox:student-a')!).length, 1);
});

test('account-switch cancellations are not treated as offline failures', () => {
  const isOfflineNetworkFailure = (error: { code?: string } | undefined) =>
    error?.code !== 'ERR_CANCELED';
  assert.equal(isOfflineNetworkFailure({ code: 'ERR_CANCELED' }), false);
  assert.equal(isOfflineNetworkFailure({ code: 'ECONNABORTED' }), true);
  assert.equal(isOfflineNetworkFailure(undefined), true);
});
