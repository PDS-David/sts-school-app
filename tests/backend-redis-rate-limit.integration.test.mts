import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import rateLimit from 'express-rate-limit';
import test, { after } from 'node:test';
import {
  assertRateLimitRedisConfigured,
  consumeRedisQuota,
  createRedisRateLimitStore,
  disconnectRedisRateLimitStore,
  RedisRateLimitStoreError,
} from '../backend/src/utils/redisRateLimitStore.js';

const servers: Server[] = [];

async function startLimiterApp(namespace: string) {
  const store = createRedisRateLimitStore(namespace);
  assert.ok(store, 'the integration workflow must configure Redis');
  const app = express();
  app.use((req, _res, next) => {
    (req as any).user = { id: req.header('x-user-id') ?? 'missing-user', role: 'student' };
    next();
  });
  app.use(rateLimit({
    windowMs: 60_000,
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: req => (req as any).user.id,
    store,
    handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
  }));
  app.get('/limited', (_req, res) => res.json({ ok: true }));
  const server = app.listen(0, '127.0.0.1');
  servers.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/limited`;
}

after(async () => {
  for (const server of servers) {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
  disconnectRedisRateLimitStore();
});

test('independent API instances enforce one shared account quota', async () => {
  const namespace = `bsec027-http-${crypto.randomUUID()}`;
  const [urlA, urlB] = await Promise.all([
    startLimiterApp(namespace),
    startLimiterApp(namespace),
  ]);
  const send = (url: string, userId: string) => fetch(url, { headers: { 'x-user-id': userId } });

  assert.equal((await send(urlA, 'student-1')).status, 200);
  assert.equal((await send(urlB, 'student-1')).status, 200);
  const blocked = await send(urlA, 'student-1');
  assert.equal(blocked.status, 429, 'the second API instance must observe the first instance quota');
  assert.deepEqual(await blocked.json(), { error: 'Too many requests' });
  assert.equal((await send(urlB, 'student-2')).status, 200, 'one account must not consume another account quota');
});

test('shared AI-generation quota is atomic across calls and resets with its own key', async () => {
  const key = `bsec027-ai-${crypto.randomUUID()}`;
  assert.equal(await consumeRedisQuota(key, 2, 60_000), true);
  assert.equal(await consumeRedisQuota(key, 2, 60_000), true);
  assert.equal(await consumeRedisQuota(key, 2, 60_000), false);
});

test('successful-request decrement and explicit reset preserve shared-store semantics', async () => {
  const store = createRedisRateLimitStore(`bsec027-store-${crypto.randomUUID()}`);
  assert.ok(store);
  store.init({ windowMs: 60_000 });
  const first = await store.increment('account');
  assert.equal(first.totalHits, 1);
  await store.decrement('account');
  const afterDecrement = await store.increment('account');
  assert.equal(afterDecrement.totalHits, 1);
  await store.resetKey('account');
  const afterReset = await store.increment('account');
  assert.equal(afterReset.totalHits, 1);
});

test('Redis outages fail closed with an explicit 503 store error', async () => {
  const previousPreferred = process.env.RATE_LIMIT_REDIS_URL;
  const previousLegacy = process.env.REDIS_URL;
  try {
    process.env.RATE_LIMIT_REDIS_URL = 'redis://127.0.0.1:1';
    delete process.env.REDIS_URL;
    disconnectRedisRateLimitStore();
    const store = createRedisRateLimitStore('bsec027-outage');
    assert.ok(store);
    store.init({ windowMs: 60_000 });
    await assert.rejects(
      store.increment('account'),
      error => error instanceof RedisRateLimitStoreError &&
        error.code === 'RATE_LIMIT_STORE_UNAVAILABLE' &&
        error.statusCode === 503,
    );
  } finally {
    if (previousPreferred === undefined) delete process.env.RATE_LIMIT_REDIS_URL;
    else process.env.RATE_LIMIT_REDIS_URL = previousPreferred;
    if (previousLegacy === undefined) delete process.env.REDIS_URL;
    else process.env.REDIS_URL = previousLegacy;
    disconnectRedisRateLimitStore();
  }
});

test('production refuses to start without a shared Redis URL', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousPreferred = process.env.RATE_LIMIT_REDIS_URL;
  const previousLegacy = process.env.REDIS_URL;
  try {
    process.env.NODE_ENV = 'production';
    delete process.env.RATE_LIMIT_REDIS_URL;
    delete process.env.REDIS_URL;
    assert.throws(() => assertRateLimitRedisConfigured(), /Production startup refused/);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousPreferred === undefined) delete process.env.RATE_LIMIT_REDIS_URL;
    else process.env.RATE_LIMIT_REDIS_URL = previousPreferred;
    if (previousLegacy === undefined) delete process.env.REDIS_URL;
    else process.env.REDIS_URL = previousLegacy;
  }
});
