import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BACKEND_COLD_START_TIMEOUT_MS,
  BACKEND_READINESS_FRESHNESS_MS,
  createBackendReadinessGate,
} from '../../mobile/src/api/backendReadiness.ts';

test('first API operation waits for database readiness at the canonical origin', async () => {
  const calls: Array<{ url: string; timeoutMs: number }> = [];
  const gate = createBackendReadinessGate(async (url, timeoutMs) => {
    calls.push({ url, timeoutMs });
  });

  await gate.ensureReady('https://sts-school-app.onrender.com/');

  assert.deepEqual(calls, [{
    url: 'https://sts-school-app.onrender.com/health/ready',
    timeoutMs: BACKEND_COLD_START_TIMEOUT_MS,
  }]);
  assert.equal(BACKEND_COLD_START_TIMEOUT_MS, 90_000);
});

test('concurrent API operations share one cold-start readiness probe', async () => {
  let calls = 0;
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const gate = createBackendReadinessGate(async () => {
    calls++;
    await pending;
  });

  const first = gate.ensureReady('https://api.example.test');
  const second = gate.ensureReady('https://api.example.test');
  assert.equal(first, second);
  assert.equal(calls, 1);

  release();
  await Promise.all([first, second]);
  assert.equal(calls, 1);
});

test('a successful readiness probe is reused only within the freshness window', async () => {
  let calls = 0;
  let now = 1_000;
  const gate = createBackendReadinessGate(
    async () => { calls++; },
    () => now,
  );

  await gate.ensureReady('https://api.example.test');
  now += BACKEND_READINESS_FRESHNESS_MS - 1;
  await gate.ensureReady('https://api.example.test');
  assert.equal(calls, 1);

  now += 1;
  await gate.ensureReady('https://api.example.test');
  assert.equal(calls, 2);
});

test('a failed readiness probe is not cached and the next request retries', async () => {
  let calls = 0;
  const gate = createBackendReadinessGate(async () => {
    calls++;
    if (calls === 1) throw new Error('database not ready');
  });

  await assert.rejects(gate.ensureReady('https://api.example.test'), /database not ready/);
  await gate.ensureReady('https://api.example.test');
  assert.equal(calls, 2);
});

test('network failure invalidation forces a fresh readiness probe', async () => {
  let calls = 0;
  const gate = createBackendReadinessGate(async () => { calls++; });

  await gate.ensureReady('https://api.example.test');
  gate.invalidate();
  await gate.ensureReady('https://api.example.test');

  assert.equal(calls, 2);
});
