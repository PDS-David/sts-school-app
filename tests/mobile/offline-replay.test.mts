import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldEnqueueOfflineWrite } from '../../mobile/src/offline/replayPolicy.ts';

test('normal failed writes remain eligible for offline queueing', () => {
  assert.equal(shouldEnqueueOfflineWrite({ method: 'post' }), true);
});

test('outbox replay failures are not enqueued as replacement writes', () => {
  assert.equal(shouldEnqueueOfflineWrite({ method: 'post', _skipOfflineQueue: true }), false);
});

test('requests without config remain eligible for offline queueing', () => {
  assert.equal(shouldEnqueueOfflineWrite(undefined), true);
});
