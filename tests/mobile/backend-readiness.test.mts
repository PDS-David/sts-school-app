import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BACKEND_COLD_START_TIMEOUT_MS,
  BACKEND_READINESS_FRESHNESS_MS,
  createBackendReadinessGate,
} from '../../mobile/src/api/backendReadiness.ts';

const noDelay = async () => {};

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
    BACKEND_READINESS_FRESHNESS_MS,
    BACKEND_COLD_START_TIMEOUT_MS,
    noDelay,
  );

  await gate.ensureReady('https://api.example.test');
  now += BACKEND_READINESS_FRESHNESS_MS - 1;
  await gate.ensureReady('https://api.example.test');
  assert.equal(calls, 1);

  now += 1;
  await gate.ensureReady('https://api.example.test');
  assert.equal(calls, 2);
});

test('transient Render 503 is retried once before readiness is cached', async () => {
  let calls = 0;
  const gate = createBackendReadinessGate(async () => {
    calls++;
    if (calls === 1) throw { response: { status: 503 } };
  }, Date.now, undefined, undefined, noDelay);

  await gate.ensureReady('https://api.example.test');
  await gate.ensureReady('https://api.example.test');
  assert.equal(calls, 2);
});

test('offline status is not retried and is not cached as ready', async () => {
  let calls = 0;
  let delays = 0;
  const offline = Object.assign(new Error('offline'), { code: 'ERR_OFFLINE' });
  const gate = createBackendReadinessGate(
    async () => { calls++; throw offline; },
    Date.now,
    undefined,
    undefined,
    async () => { delays++; },
  );

  await assert.rejects(gate.ensureReady('https://api.example.test'), /offline/);
  assert.equal(calls, 1);
  assert.equal(delays, 0);
});

test('a failed readiness probe is not cached and the next API operation retries', async () => {
  let calls = 0;
  const gate = createBackendReadinessGate(async () => {
    calls++;
    if (calls <= 2) throw new Error('database not ready');
  }, Date.now, undefined, undefined, noDelay);

  await assert.rejects(gate.ensureReady('https://api.example.test'), /database not ready/);
  await gate.ensureReady('https://api.example.test');
  assert.equal(calls, 3);
});

test('network failure invalidation forces a fresh readiness probe', async () => {
  let calls = 0;
  const gate = createBackendReadinessGate(async () => { calls++; });

  await gate.ensureReady('https://api.example.test');
  gate.invalidate();
  await gate.ensureReady('https://api.example.test');

  assert.equal(calls, 2);
});
