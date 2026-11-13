import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldEnqueueOfflineWrite } from '../../mobile/src/offline/replayPolicy.ts';
import { createSerialQueue } from '../../mobile/src/offline/serialQueue.ts';

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
