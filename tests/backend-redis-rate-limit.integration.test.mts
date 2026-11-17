import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import rateLimit from 'express-rate-limit';
import test, { after } from 'node:test';
import type { Store, Options, ClientRateLimitInfo } from 'express-rate-limit';
import {
  assertRateLimitPostgresConfigured,
  consumePostgresQuota,
  createPostgresRateLimitStore,
  RateLimitStoreUnavailableError,
} from '../backend/src/utils/postgresRateLimitStore.js';
import { pool } from '../backend/src/db/pool.js';

const servers: Server[] = [];

async function startLimiterApp(namespace: string) {
  const store = createPostgresRateLimitStore(namespace);
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
  await pool.end();
});

test('independent API instances enforce one shared account quota', async () => {
  const namespace = `bsec027-http-${randomUUID()}`;
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
  const key = `bsec027-ai-${randomUUID()}`;
  assert.equal(await consumePostgresQuota(key, 2, 60_000), true);
  assert.equal(await consumePostgresQuota(key, 2, 60_000), true);
  assert.equal(await consumePostgresQuota(key, 2, 60_000), false);
});

test('successful-request decrement and explicit reset preserve shared-store semantics', async () => {
  const store = createPostgresRateLimitStore(`bsec027-store-${randomUUID()}`);
  store.init({ windowMs: 60_000 } as Options);
  const first = await store.increment('account');
  assert.equal(first.totalHits, 1);
  await store.decrement('account');
  const afterDecrement = await store.increment('account');
  assert.equal(afterDecrement.totalHits, 1);
  await store.resetKey('account');
  const afterReset = await store.increment('account');
  assert.equal(afterReset.totalHits, 1);
});

test('production refuses to start without a shared PostgreSQL DATABASE_URL', async () => {
  await assert.rejects(
    assertRateLimitPostgresConfigured({ NODE_ENV: 'production' } as NodeJS.ProcessEnv),
    /Production startup refused: DATABASE_URL is required/,
  );
});

test('PostgreSQL store errors are represented as fail-closed 503 errors', () => {
  const error = new RateLimitStoreUnavailableError(new Error('simulated database outage'));
  assert.equal(error.code, 'RATE_LIMIT_STORE_UNAVAILABLE');
  assert.equal(error.statusCode, 503);
  assert.match(error.message, /shared rate-limit store is unavailable/i);
});

test('rate-limit middleware returns HTTP 503 when the PostgreSQL store is unavailable', async () => {
  const failingStore: Store = {
    init(_options: Options) {},
    async increment(_key: string): Promise<ClientRateLimitInfo> {
      throw new RateLimitStoreUnavailableError(new Error('simulated database outage'));
    },
    async decrement(_key: string) {},
    async resetKey(_key: string) {},
    async resetAll() {},
  };

  const app = express();
  app.use(rateLimit({
    windowMs: 60_000,
    limit: 2,
    store: failingStore,
    passOnStoreError: false,
  }));
  app.get('/limited', (_req, res) => res.json({ ok: true }));
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if ((error as { code?: string })?.code === 'RATE_LIMIT_STORE_UNAVAILABLE') {
      res.setHeader('Retry-After', '5');
      return res.status(503).json({ error: 'Request protection is temporarily unavailable.' });
    }
    return res.status(500).json({ error: 'Unexpected test error' });
  });

  const server = app.listen(0, '127.0.0.1');
  servers.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  const response = await fetch(`http://127.0.0.1:${port}/limited`);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('retry-after'), '5');
  assert.deepEqual(await response.json(), {
    error: 'Request protection is temporarily unavailable.',
  });
});
