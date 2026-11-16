import { connect as connectNet, type Socket } from 'node:net';
import { connect as connectTls } from 'node:tls';

type RedisValue = string | number | null | RedisValue[];
type ParsedResp = { value: RedisValue; next: number; error?: Error };

type RedisConfig = {
  host: string;
  port: number;
  tls: boolean;
  username?: string;
  password?: string;
  database: number;
};

type PendingCommand = {
  resolve: (value: RedisValue) => void;
  reject: (error: Error) => void;
};

export class RedisRateLimitStoreError extends Error {
  readonly code = 'RATE_LIMIT_STORE_UNAVAILABLE';
  readonly statusCode = 503;

  constructor(cause: unknown) {
    super('The shared rate-limit store is unavailable. Retry the request shortly.', { cause });
    this.name = 'RedisRateLimitStoreError';
  }
}

function configuredRedisUrl(): string | null {
  const value = process.env.RATE_LIMIT_REDIS_URL?.trim() || process.env.REDIS_URL?.trim();
  return value || null;
}

export function assertRateLimitRedisConfigured(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV !== 'production') return;
  if (!(env.RATE_LIMIT_REDIS_URL?.trim() || env.REDIS_URL?.trim())) {
    throw new Error(
      'Production startup refused: configure RATE_LIMIT_REDIS_URL (or REDIS_URL) ' +
      'to enable shared Redis-backed request limits. Process-local limits are not an acceptable production fallback.',
    );
  }
}

function parseRedisConfig(raw: string): RedisConfig {
  const url = new URL(raw);
  if (url.protocol !== 'redis:' && url.protocol !== 'rediss:') {
    throw new Error('Redis URL must use redis:// or rediss://.');
  }
  if (!url.hostname) throw new Error('Redis URL must include a host.');
  const databaseText = url.pathname.replace(/^\//, '');
  const database = databaseText ? Number(databaseText) : 0;
  if (!Number.isSafeInteger(database) || database < 0) {
    throw new Error('Redis URL database path must be a non-negative integer.');
  }
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 6379,
    tls: url.protocol === 'rediss:',
    ...(url.username ? { username: decodeURIComponent(url.username) } : {}),
    ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
    database,
  };
}

function encodeCommand(args: Array<string | number>): Buffer {
  const chunks: Buffer[] = [Buffer.from(`*${args.length}\r\n`)];
  for (const value of args) {
    const encoded = Buffer.from(String(value), 'utf8');
    chunks.push(Buffer.from(`$${encoded.length}\r\n`), encoded, Buffer.from('\r\n'));
  }
  return Buffer.concat(chunks);
}

function parseResp(buffer: Buffer, offset = 0): ParsedResp | undefined {
  if (offset >= buffer.length) return undefined;
  const marker = buffer[offset];
  const lineEnd = buffer.indexOf('\r\n', offset);
  if (lineEnd < 0) return undefined;
  const line = buffer.toString('utf8', offset + 1, lineEnd);
  const afterLine = lineEnd + 2;

  if (marker === 43) return { value: line, next: afterLine }; // +
  if (marker === 45) return { value: null, next: afterLine, error: new Error(`Redis command failed: ${line}`) }; // -
  if (marker === 58) {
    const value = Number(line);
    if (!Number.isSafeInteger(value)) throw new Error('Redis returned an invalid integer.');
    return { value, next: afterLine };
  }
  if (marker === 36) {
    const length = Number(line);
    if (!Number.isInteger(length) || length < -1) throw new Error('Redis returned an invalid bulk-string length.');
    if (length === -1) return { value: null, next: afterLine };
    const end = afterLine + length;
    if (buffer.length < end + 2) return undefined;
    if (buffer.toString('utf8', end, end + 2) !== '\r\n') throw new Error('Redis returned a malformed bulk string.');
    return { value: buffer.toString('utf8', afterLine, end), next: end + 2 };
  }
  if (marker === 42) {
    const count = Number(line);
    if (!Number.isInteger(count) || count < -1) throw new Error('Redis returned an invalid array length.');
    if (count === -1) return { value: null, next: afterLine };
    const values: RedisValue[] = [];
    let cursor = afterLine;
    for (let i = 0; i < count; i++) {
      const item = parseResp(buffer, cursor);
      if (!item) return undefined;
      if (item.error) throw item.error;
      values.push(item.value);
      cursor = item.next;
    }
    return { value: values, next: cursor };
  }
  throw new Error(`Redis returned an unsupported RESP marker: ${String.fromCharCode(marker)}`);
}

class RedisClient {
  private socket: Socket | null = null;
  private connecting: Promise<void> | null = null;
  private authenticated = false;
  private buffer = Buffer.alloc(0);
  private pending: PendingCommand[] = [];

  constructor(private readonly config: RedisConfig) {}

  private async ensureConnected(): Promise<void> {
    if (this.socket?.writable && this.authenticated) return;
    if (this.connecting) return this.connecting;
    this.connecting = this.openAndAuthenticate();
    try {
      await this.connecting;
    } finally {
      this.connecting = null;
    }
  }

  private async openAndAuthenticate(): Promise<void> {
    const socket = this.config.tls
      ? connectTls({ host: this.config.host, port: this.config.port })
      : connectNet({ host: this.config.host, port: this.config.port });

    await new Promise<void>((resolve, reject) => {
      const event = this.config.tls ? 'secureConnect' : 'connect';
      const onError = (error: Error) => {
        socket.off(event, onConnect);
        reject(error);
      };
      const onConnect = () => {
        socket.off('error', onError);
        resolve();
      };
      socket.once(event, onConnect);
      socket.once('error', onError);
      socket.setTimeout(3000, () => socket.destroy(new Error('Redis connection timed out.')));
    });

    this.socket = socket;
    this.buffer = Buffer.alloc(0);
    socket.on('data', chunk => this.handleData(chunk));
    socket.on('error', error => this.fail(error));
    socket.on('close', () => this.fail(new Error('Redis connection closed.')));
    socket.setTimeout(3000, () => socket.destroy(new Error('Redis command timed out.')));

    try {
      if (this.config.password) {
        const auth = this.config.username
          ? ['AUTH', this.config.username, this.config.password]
          : ['AUTH', this.config.password];
        await this.sendRaw(auth);
      }
      if (this.config.database > 0) {
        await this.sendRaw(['SELECT', this.config.database]);
      }
      this.authenticated = true;
    } catch (error) {
      socket.destroy();
      this.fail(error instanceof Error ? error : new Error('Redis authentication failed.'));
      throw error;
    }
  }

  private sendRaw(args: Array<string | number>): Promise<RedisValue> {
    const socket = this.socket;
    if (!socket?.writable) return Promise.reject(new Error('Redis connection is not writable.'));
    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
      socket.write(encodeCommand(args), error => {
        if (error) this.fail(error);
      });
    });
  }

  private handleData(chunk: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.pending.length) {
      let parsed: ParsedResp | undefined;
      try {
        parsed = parseResp(this.buffer);
      } catch (error) {
        const pending = this.pending.shift();
        pending?.reject(error instanceof Error ? error : new Error('Invalid Redis response.'));
        continue;
      }
      if (!parsed) return;
      this.buffer = this.buffer.subarray(parsed.next);
      const pending = this.pending.shift();
      if (!pending) return;
      if (parsed.error) pending.reject(parsed.error);
      else pending.resolve(parsed.value);
    }
  }

  private fail(error: Error): void {
    this.authenticated = false;
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    const pending = this.pending.splice(0);
    for (const item of pending) item.reject(error);
  }

  async command(args: Array<string | number>): Promise<RedisValue> {
    await this.ensureConnected();
    return this.sendRaw(args);
  }

  disconnect(): void {
    const socket = this.socket;
    this.socket = null;
    this.authenticated = false;
    this.buffer = Buffer.alloc(0);
    socket?.destroy();
    this.fail(new Error('Redis client disconnected.'));
  }
}

let redisClient: RedisClient | null = null;
let redisClientUrl: string | null = null;

function getRedisClient(): RedisClient | null {
  const raw = configuredRedisUrl();
  if (!raw) return null;
  if (!redisClient || redisClientUrl !== raw) {
    redisClient?.disconnect();
    redisClient = new RedisClient(parseRedisConfig(raw));
    redisClientUrl = raw;
  }
  return redisClient;
}

async function redisCommand(args: Array<string | number>): Promise<RedisValue> {
  const client = getRedisClient();
  if (!client) throw new Error('Redis is not configured.');
  try {
    return await client.command(args);
  } catch (error) {
    throw new RedisRateLimitStoreError(error);
  }
}

const INCREMENT_SCRIPT = [
  "local hits = redis.call('INCR', KEYS[1])",
  "local ttl = redis.call('PTTL', KEYS[1])",
  "if ttl < 0 then redis.call('PEXPIRE', KEYS[1], ARGV[1]); ttl = tonumber(ARGV[1]) end",
  'return {hits, ttl}',
].join('\n');

const DECREMENT_SCRIPT = [
  "if redis.call('EXISTS', KEYS[1]) == 1 then",
  "  local hits = redis.call('DECR', KEYS[1])",
  "  if hits <= 0 then redis.call('DEL', KEYS[1]) end",
  'end',
  'return 1',
].join('\n');

function responsePair(value: RedisValue): [number, number] {
  if (!Array.isArray(value) || value.length !== 2) throw new Error('Redis returned an invalid rate-limit counter response.');
  const hits = Number(value[0]);
  const ttl = Number(value[1]);
  if (!Number.isSafeInteger(hits) || !Number.isFinite(ttl)) throw new Error('Redis returned invalid rate-limit counter values.');
  return [hits, ttl];
}

export function createRedisRateLimitStore(namespace: string) {
  if (!configuredRedisUrl()) return undefined;
  let windowMs = 60_000;
  const prefix = `sts:rate-limit:${namespace}:`;

  return {
    init(options: { windowMs?: number }) {
      if (typeof options.windowMs === 'number' && Number.isFinite(options.windowMs) && options.windowMs > 0) {
        windowMs = Math.ceil(options.windowMs);
      }
    },
    async increment(key: string) {
      try {
        const result = await redisCommand(['EVAL', INCREMENT_SCRIPT, 1, prefix + key, windowMs]);
        const [totalHits, ttl] = responsePair(result);
        return {
          totalHits,
          resetTime: new Date(Date.now() + (ttl >= 0 ? ttl : windowMs)),
        };
      } catch (error) {
        if (error instanceof RedisRateLimitStoreError) throw error;
        throw new RedisRateLimitStoreError(error);
      }
    },
    async decrement(key: string) {
      await redisCommand(['EVAL', DECREMENT_SCRIPT, 1, prefix + key]);
    },
    async resetKey(key: string) {
      await redisCommand(['DEL', prefix + key]);
    },
  };
}

/** Shared counter for non-HTTP AI calls (learning generation, summaries, etc.). */
export async function consumeRedisQuota(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (!configuredRedisUrl()) return true; // local/test mode uses the HTTP limiter's in-process fallback
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs < 1) {
    throw new Error('Invalid Redis quota configuration.');
  }
  const safeKey = `sts:quota:${key}`;
  try {
    const result = await redisCommand(['EVAL', INCREMENT_SCRIPT, 1, safeKey, Math.ceil(windowMs)]);
    const [totalHits] = responsePair(result);
    return totalHits <= limit;
  } catch (error) {
    if (error instanceof RedisRateLimitStoreError) throw error;
    throw new RedisRateLimitStoreError(error);
  }
}

export function disconnectRedisRateLimitStore(): void {
  redisClient?.disconnect();
  redisClient = null;
  redisClientUrl = null;
}
