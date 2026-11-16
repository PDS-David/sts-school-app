import { createHash, randomUUID } from 'node:crypto';
import type { Request } from 'express';
import type { PoolClient } from 'pg';
import { query, withTransaction } from '../db/pool.js';
import type { AuthUser } from '../types/index.js';

export type AuditOutcome = 'success' | 'failure' | 'denied';

export interface AuditContext {
  /** Target school for the event; distinct from actor_school_code for global admins. */
  schoolCode?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  metadata?: unknown;
  outcome?: AuditOutcome;
}

export interface AuditEvent {
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
  context?: AuditContext;
}

export class AuditPersistenceError extends Error {
  readonly code = 'AUDIT_PERSISTENCE_FAILED';
  readonly statusCode = 503;
  readonly cause?: unknown;

  constructor(message = 'The security audit record could not be persisted.', cause?: unknown) {
    super(message);
    this.name = 'AuditPersistenceError';
    this.cause = cause;
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ACTION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,99}$/;
const SECRET_KEY_PATTERN = /(password|passwd|token|secret|authorization|cookie|activation|pin|answer|email|phone|address|birth|dob|credential)/i;

function cleanText(value: unknown, maxLength: number): string | null {
  if (value === null || value === undefined) return null;
  return String(value)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function sanitizeDetail(value?: string): string | null {
  if (!value) return null;
  return cleanText(value, 2000)!
    .replace(/((?:password|passwd|token|secret|pin|answer|activation[_ -]?code)\s*[:=]\s*)\S+/gi, '$1[REDACTED]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[REDACTED_PHONE]')
    .slice(0, 1000);
}

function sanitizeMetadataValue(value: unknown, depth = 0, key = ''): unknown {
  if (SECRET_KEY_PATTERN.test(key)) return '[REDACTED]';
  if (depth > 4) return '[TRUNCATED]';
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string') return cleanText(value, 1000);
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.slice(0, 50).map(item => sanitizeMetadataValue(item, depth + 1));
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, 50);
    return Object.fromEntries(entries.map(([childKey, childValue]) => [
      childKey.slice(0, 80),
      sanitizeMetadataValue(childValue, depth + 1, childKey),
    ]));
  }
  return undefined;
}

function sanitizeMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const sanitized = sanitizeMetadataValue(value) as Record<string, unknown>;
  const serialized = stableStringify(sanitized);
  if (Buffer.byteLength(serialized, 'utf8') > 16 * 1024) {
    throw new Error('Audit metadata exceeds the 16 KB safety limit.');
  }
  return sanitized;
}

function stableValue(value: any): any {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableValue(value[key])]));
  }
  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

function buildCanonicalEvent(event: Record<string, any>): Record<string, unknown> {
  return {
    previous_hash: event.previous_hash ?? null,
    actor_id: event.actor_id ?? null,
    actor_name: event.actor_name ?? 'system',
    actor_role: event.actor_role ?? 'system',
    actor_school_code: event.actor_school_code ?? null,
    actor_ip: event.actor_ip ?? null,
    request_id: event.request_id ?? null,
    user_agent: event.user_agent ?? null,
    action: event.action,
    entity: event.entity,
    entity_id: event.entity_id ?? null,
    school_code: event.school_code ?? null,
    detail: event.detail ?? null,
    metadata: event.metadata ?? {},
    outcome: event.outcome ?? 'success',
    created_at: event.created_at instanceof Date
      ? event.created_at.toISOString()
      : new Date(event.created_at).toISOString(),
  };
}

function hashCanonicalEvent(event: Record<string, any>): string {
  return createHash('sha256').update(stableStringify(buildCanonicalEvent(event))).digest('hex');
}

function normalizeContext(context: AuditContext = {}): Required<Pick<AuditContext, 'outcome'>> & AuditContext {
  const outcome = context.outcome ?? 'success';
  if (!['success', 'failure', 'denied'].includes(outcome)) {
    throw new Error('Invalid audit outcome.');
  }
  const requestId = context.requestId && UUID_PATTERN.test(context.requestId)
    ? context.requestId.toLowerCase()
    : randomUUID();
  return {
    ...context,
    requestId,
    ip: cleanText(context.ip, 64),
    userAgent: cleanText(context.userAgent, 512),
    schoolCode: context.schoolCode === undefined ? undefined : cleanText(context.schoolCode, 50),
    metadata: sanitizeMetadata(context.metadata),
    outcome,
  };
}

async function writeAuditRecord(
  client: PoolClient,
  actor: AuthUser | null,
  action: string,
  entity: string,
  entityId?: string,
  detail?: string,
  rawContext: AuditContext = {},
) {
  if (!ACTION_PATTERN.test(action) || !ACTION_PATTERN.test(entity)) {
    throw new Error('Audit action and entity must be safe identifiers.');
  }
  const context = normalizeContext(rawContext);
  const actorId = actor?.id ?? null;
  const actorName = cleanText(actor?.username ?? 'system', 120) ?? 'system';
  const actorRole = cleanText(actor?.role ?? 'system', 40) ?? 'system';
  const actorSchoolCode = cleanText(actor?.school_code, 50);
  const schoolCode = context.schoolCode === undefined ? actorSchoolCode : context.schoolCode;
  const safeEntityId = cleanText(entityId, 128);
  const safeDetail = sanitizeDetail(detail);
  const createdAt = new Date();

  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
    'audit_log:' + (schoolCode ?? '<global>'),
  ]);
  const previous = await client.query(
    'SELECT event_hash FROM audit_log WHERE school_code IS NOT DISTINCT FROM $1 AND event_hash IS NOT NULL ORDER BY id DESC LIMIT 1',
    [schoolCode],
  );
  const previousHash: string | null = previous.rows[0]?.event_hash ?? null;
  const event = {
    previous_hash: previousHash,
    actor_id: actorId,
    actor_name: actorName,
    actor_role: actorRole,
    actor_school_code: actorSchoolCode,
    actor_ip: context.ip ?? null,
    request_id: context.requestId,
    user_agent: context.userAgent ?? null,
    action,
    entity,
    entity_id: safeEntityId,
    school_code: schoolCode,
    detail: safeDetail,
    metadata: context.metadata ?? {},
    outcome: context.outcome,
    created_at: createdAt,
  };
  const eventHash = hashCanonicalEvent(event);
  const { rows } = await client.query(
    `INSERT INTO audit_log(
       actor_id, actor_name, action, entity, entity_id, school_code, detail,
       actor_role, actor_school_code, actor_ip, request_id, user_agent,
       metadata, outcome, previous_hash, event_hash, created_at
     ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
     RETURNING id, event_hash, previous_hash, created_at`,
    [
      actorId, actorName, action, entity, safeEntityId, schoolCode, safeDetail,
      actorRole, actorSchoolCode, context.ip ?? null, context.requestId,
      context.userAgent ?? null, context.metadata ?? {}, context.outcome,
      previousHash, eventHash, createdAt,
    ],
  );
  return rows[0];
}

/** Build request attribution without trusting arbitrary request-id values. */
export function auditContextFromRequest(
  req: Pick<Request, 'ip' | 'get'>,
  overrides: AuditContext = {},
): AuditContext {
  const suppliedRequestId = req.get('x-request-id') ?? undefined;
  return {
    ip: req.ip ?? null,
    userAgent: req.get('user-agent') ?? null,
    requestId: suppliedRequestId && UUID_PATTERN.test(suppliedRequestId) ? suppliedRequestId : randomUUID(),
    ...overrides,
  };
}

/** Persist an audit record inside an existing business transaction. */
export async function auditInTransaction(
  client: PoolClient,
  actor: AuthUser | null,
  action: string,
  entity: string,
  entityId?: string,
  detail?: string,
  context: AuditContext = {},
) {
  try {
    return await writeAuditRecord(client, actor, action, entity, entityId, detail, context);
  } catch (error) {
    if (error instanceof AuditPersistenceError) throw error;
    throw new AuditPersistenceError(undefined, error);
  }
}

/** Strict audit write. Call before returning success for sensitive operations. */
export async function auditStrict(
  actor: AuthUser | null,
  action: string,
  entity: string,
  entityId?: string,
  detail?: string,
  context: AuditContext = {},
) {
  try {
    return await withTransaction(client => writeAuditRecord(client, actor, action, entity, entityId, detail, context));
  } catch (error) {
    if (error instanceof AuditPersistenceError) throw error;
    throw new AuditPersistenceError(undefined, error);
  }
}

/** Execute a sensitive mutation and its audit event atomically. */
export async function withAuditedTransaction<T>(
  actor: AuthUser | null,
  event: AuditEvent,
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return withTransaction(async client => {
    const result = await work(client);
    await auditInTransaction(
      client, actor, event.action, event.entity, event.entityId, event.detail, event.context,
    );
    return result;
  });
}

/** Legacy best-effort event, retained for non-critical events such as login telemetry. */
export async function audit(
  actor: AuthUser | null,
  action: string,
  entity: string,
  entityId?: string,
  detail?: string,
  context: AuditContext = {},
) {
  try {
    return await auditStrict(actor, action, entity, entityId, detail, context);
  } catch (error) {
    console.error('[audit] best-effort record failed', {
      action,
      entity,
      actorId: actor?.id ?? null,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function verifyAuditLogIntegrity(schoolCode?: string): Promise<{
  valid: boolean;
  checked: number;
  invalidRecordId?: string;
  reason?: 'previous_hash_mismatch' | 'event_hash_mismatch';
}> {
  const params: unknown[] = [];
  let where = 'WHERE event_hash IS NOT NULL';
  if (schoolCode !== undefined) {
    params.push(schoolCode);
    where += ' AND school_code IS NOT DISTINCT FROM $1';
  }
  const { rows } = await query(
    `SELECT id, actor_id, actor_name, actor_role, actor_school_code, actor_ip,
            request_id, user_agent, action, entity, entity_id, school_code,
            detail, metadata, outcome, previous_hash, event_hash, created_at
       FROM audit_log ${where}
      ORDER BY school_code NULLS FIRST, id ASC`,
    params,
  );
  const lastHashBySchool = new Map<string, string | null>();
  let checked = 0;
  for (const row of rows) {
    const key = row.school_code ?? '<global>';
    const expectedPrevious = lastHashBySchool.has(key) ? lastHashBySchool.get(key)! : null;
    if ((row.previous_hash ?? null) !== expectedPrevious) {
      return { valid: false, checked, invalidRecordId: String(row.id), reason: 'previous_hash_mismatch' };
    }
    if (hashCanonicalEvent(row) !== row.event_hash) {
      return { valid: false, checked, invalidRecordId: String(row.id), reason: 'event_hash_mismatch' };
    }
    lastHashBySchool.set(key, row.event_hash);
    checked += 1;
  }
  return { valid: true, checked };
}
