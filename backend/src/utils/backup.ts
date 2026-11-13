/**
 * Encrypted full-database backup, written in Node (no pg_dump needed on Render's runtime).
 *
 * File format (".sts-backup"): MAGIC(8) | salt(16) | iv(12) | authTag(16) | AES-256-GCM(gzip(JSON)).
 * Key = scrypt(BACKUP_PASSPHRASE, salt). Without the passphrase the file is unreadable, so it is
 * safe to email. The JSON carries per-column data types so restoreBackup.ts can round-trip bytea,
 * json/jsonb and arrays exactly.
 */
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import type { PoolClient } from 'pg';
import { pool, query } from '../db/pool.js';
import { sendEmail } from './email.js';

export const MAGIC = Buffer.from('STSBKP01');
// Gmail rejects messages over 25 MB and base64 adds ~33%, so keep the raw attachment well under.
export const MAX_EMAIL_ATTACHMENT_BYTES = 17 * 1024 * 1024;
export const BACKUP_INTERVAL_DAYS = 7;

export interface BackupTable {
  name: string;
  columns: {
    name: string;
    type: string;
    udt_name?: string;
    character_maximum_length?: number | null;
    numeric_precision?: number | null;
    numeric_scale?: number | null;
    is_nullable?: string;
    column_default?: string | null;
    is_identity?: string;
    is_generated?: string;
  }[];
  rows: unknown[][];
}
export interface BackupPayload {
  version: 1;
  created_at: string;
  database: string;
  tables: BackupTable[];
}

export class BackupConfigError extends Error {}

export function requirePassphrase(env: NodeJS.ProcessEnv = process.env): string {
  const p = env.BACKUP_PASSPHRASE?.trim();
  if (!p || p.length < 16) {
    throw new BackupConfigError('BACKUP_PASSPHRASE must be set to at least 16 characters.');
  }
  return p;
}

// JSON replacer: bytea -> {"$b64": "..."} so images survive compactly and exactly.
const replacer = (_k: string, v: unknown) =>
  v && typeof v === 'object' && (v as any).type === 'Buffer' && Array.isArray((v as any).data)
    ? { $b64: Buffer.from((v as any).data).toString('base64') }
    : v;
export const reviver = (_k: string, v: unknown) =>
  v && typeof v === 'object' && typeof (v as any).$b64 === 'string' && Object.keys(v as object).length === 1
    ? Buffer.from((v as any).$b64, 'base64')
    : v;

export function encryptPayload(payload: BackupPayload, passphrase: string): Buffer {
  const plain = gzipSync(Buffer.from(JSON.stringify(payload, replacer), 'utf8'));
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(passphrase, salt, 32);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([MAGIC, salt, iv, cipher.getAuthTag(), body]);
}

export function decryptPayload(file: Buffer, passphrase: string): BackupPayload {
  if (file.length < 52 || !file.subarray(0, 8).equals(MAGIC)) throw new Error('Not an STS backup file.');
  const salt = file.subarray(8, 24), iv = file.subarray(24, 36), tag = file.subarray(36, 52), body = file.subarray(52);
  const decipher = createDecipheriv('aes-256-gcm', scryptSync(passphrase, salt, 32), iv);
  decipher.setAuthTag(tag);
  let plain: Buffer;
  try {
    plain = Buffer.concat([decipher.update(body), decipher.final()]);
  } catch {
    throw new Error('Wrong passphrase or corrupted backup file.');
  }
  return JSON.parse(gunzipSync(plain).toString('utf8'), reviver) as BackupPayload;
}

/** Reads every base table in `public` inside one REPEATABLE READ snapshot, so the backup is consistent. */
export async function collectPayload(): Promise<BackupPayload> {
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    const { rows: db } = await client.query('SELECT current_database() AS d');
    const { rows: tbls } = await client.query(
      `SELECT table_name FROM information_schema.tables
        WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name`);
    const tables: BackupTable[] = [];
    for (const { table_name } of tbls) {
      const { rows: cols } = await client.query(
        `SELECT column_name, data_type, udt_name, character_maximum_length, numeric_precision, numeric_scale,
               is_nullable, column_default, is_identity, is_generated FROM information_schema.columns
          WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position`, [table_name]);
      const ident = '"' + String(table_name).replace(/"/g, '""') + '"';
      // Anything the JS driver would round or reformat (timestamps keep microseconds, dates, numerics,
      // arrays, enums, intervals...) is exported as PostgreSQL's own text form, so restore is exact.
      const NATIVE = new Set(['integer', 'smallint', 'bigint', 'boolean', 'text', 'character varying', 'character', 'uuid', 'bytea', 'json', 'jsonb']);
      const select = cols.map((c: any) => {
        const q = '"' + String(c.column_name).replace(/"/g, '""') + '"';
        return NATIVE.has(c.data_type) ? q : `${q}::text`;
      }).join(', ');
      const res = await client.query({ text: `SELECT ${select} FROM public.${ident}`, rowMode: 'array' });
      tables.push({
        name: table_name,
        columns: cols.map((c: any) => ({
          name: c.column_name,
          type: c.data_type,
          udt_name: c.udt_name,
          character_maximum_length: c.character_maximum_length,
          numeric_precision: c.numeric_precision,
          numeric_scale: c.numeric_scale,
          is_nullable: c.is_nullable,
          column_default: c.column_default,
          is_identity: c.is_identity,
          is_generated: c.is_generated,
        })),
        rows: res.rows as unknown[][],
      });
    }
    await client.query('COMMIT');
    return { version: 1, created_at: new Date().toISOString(), database: db[0].d, tables };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

export async function buildEncryptedBackup(): Promise<{ file: Buffer; tables: number; rows: number; filename: string }> {
  const passphrase = requirePassphrase();
  const payload = await collectPayload();
  const file = encryptPayload(payload, passphrase);
  const stamp = payload.created_at.slice(0, 10);
  return {
    file,
    tables: payload.tables.length,
    rows: payload.tables.reduce((n, t) => n + t.rows.length, 0),
    filename: `sts-backup-${stamp}.sts-backup`,
  };
}

// ── backup_log (created on demand, so no schema.sql / bootstrap-checksum change is needed) ──
export async function ensureBackupLog() {
  await query(`CREATE TABLE IF NOT EXISTS backup_log (
    id          BIGSERIAL PRIMARY KEY,
    kind        TEXT NOT NULL CHECK (kind IN ('backup','reminder')),
    status      TEXT NOT NULL,
    size_bytes  BIGINT,
    tables      INTEGER,
    row_count   BIGINT,
    emailed     BOOLEAN NOT NULL DEFAULT FALSE,
    detail      TEXT,
    created_by  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
}

export interface BackupStatus {
  last_backup_at: string | null;
  last_status: string | null;
  last_emailed: boolean | null;
  days_since: number | null;
  overdue: boolean;
  configured: boolean;
}

export async function getBackupStatus(): Promise<BackupStatus> {
  await ensureBackupLog();
  const { rows } = await query(
    `SELECT status, emailed, created_at FROM backup_log WHERE kind='backup' ORDER BY id DESC LIMIT 1`);
  const { rows: okRows } = await query(
    `SELECT created_at FROM backup_log WHERE kind='backup' AND status IN ('emailed') ORDER BY id DESC LIMIT 1`);
  const lastOk: Date | null = okRows[0]?.created_at ?? null;
  const days = lastOk ? (Date.now() - new Date(lastOk).getTime()) / 86_400_000 : null;
  let configured = true;
  try { requirePassphrase(); } catch { configured = false; }
  return {
    last_backup_at: rows[0]?.created_at ? new Date(rows[0].created_at).toISOString() : null,
    last_status: rows[0]?.status ?? null,
    last_emailed: rows[0]?.emailed ?? null,
    days_since: days === null ? null : Math.floor(days),
    overdue: days === null || days >= BACKUP_INTERVAL_DAYS,
    configured,
  };
}

function recipients(): string[] {
  return (process.env.ADMIN_LOG_RECIPIENTS ?? '').split(',').map(s => s.trim()).filter(Boolean);
}

/** Builds the backup and emails it (or, if too large, records that it must be downloaded). */
export async function runBackup(actor: string): Promise<{ status: string; emailed: boolean; size_bytes: number; tables: number; rows: number }> {
  await ensureBackupLog();
  try {
    const b = await buildEncryptedBackup();
    const to = recipients();
    let status = 'not_emailed';
    let emailed = false;
    let detail: string | null = null;
    if (!to.length) {
      detail = 'ADMIN_LOG_RECIPIENTS is empty; nothing was emailed. Run npm run db:backup-export from a computer.';
    } else if (b.file.length > MAX_EMAIL_ATTACHMENT_BYTES) {
      detail = 'Backup is too large to email; run npm run db:backup-export from a computer.';
      await sendEmail({
        to, subject: '[STS School] Backup NOT emailed - too large to attach',
        html: `<p>The weekly backup (${(b.file.length / 1048576).toFixed(1)} MB) is too large to email.
               Ask your developer to run <code>npm run db:backup-export</code> (saves an encrypted file to a computer).</p>`,
      });
    } else {
      await sendEmail({
        to, subject: `[STS School] Encrypted database backup ${b.filename}`,
        html: `<p>Encrypted backup attached (${b.tables} tables, ${b.rows} rows, ${(b.file.length / 1048576).toFixed(1)} MB).</p>
               <p>It can only be opened with the <b>BACKUP_PASSPHRASE</b> set on the server. Keep this email somewhere safe
               and do not forward it.</p>`,
        attachments: [{ filename: b.filename, content: b.file, contentType: 'application/octet-stream' }],
      });
      status = 'emailed';
      emailed = true;
    }
    await query(
      `INSERT INTO backup_log(kind,status,size_bytes,tables,row_count,emailed,detail,created_by)
       VALUES('backup',$1,$2,$3,$4,$5,$6,$7)`,
      [status, b.file.length, b.tables, b.rows, emailed, detail, actor]);
    return { status, emailed, size_bytes: b.file.length, tables: b.tables, rows: b.rows };
  } catch (e: any) {
    const msg = e instanceof BackupConfigError ? e.message : 'Backup failed. Check server logs.';
    if (!(e instanceof BackupConfigError)) console.error('[backup] failed:', e?.message);
    await query(
      `INSERT INTO backup_log(kind,status,detail,created_by) VALUES('backup','failed',$1,$2)`, [msg, actor]).catch(() => {});
    throw e;
  }
}

/** Sends the weekly reminder (email + push to admins) if a backup is overdue and no reminder went out in the last 7 days. */
export async function sendReminderIfDue(): Promise<boolean> {
  await ensureBackupLog();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: lock } = await client.query('SELECT pg_try_advisory_xact_lock(1937001, 5) AS ok');
    if (!lock[0].ok) { await client.query('ROLLBACK'); return false; }
    const { rows } = await client.query(
      `SELECT
         (SELECT max(created_at) FROM backup_log WHERE kind='backup' AND status IN ('emailed')) AS last_ok,
         (SELECT max(created_at) FROM backup_log WHERE kind='reminder') AS last_reminder`);
    const cutoff = Date.now() - BACKUP_INTERVAL_DAYS * 86_400_000;
    const overdue = !rows[0].last_ok || new Date(rows[0].last_ok).getTime() < cutoff;
    const reminded = rows[0].last_reminder && new Date(rows[0].last_reminder).getTime() >= cutoff;
    if (!overdue || reminded) { await client.query('ROLLBACK'); return false; }
    await client.query(`INSERT INTO backup_log(kind,status,created_by) VALUES('reminder','sent','system')`);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  const to = recipients();
  if (to.length) {
    await sendEmail({
      to, subject: '[STS School] Weekly backup is due',
      html: '<p>The weekly database backup is due. Open the admin dashboard and tap <b>Back up now</b>.</p>',
    });
  }
  try {
    const { sendPushToUser } = await import('./push.js');
    const { rows: admins } = await query(`SELECT id FROM users WHERE role='admin' AND is_active = TRUE`);
    for (const a of admins) {
      await sendPushToUser(a.id, { title: 'Weekly backup due', body: 'Tap Back up now on the admin dashboard.', data: { type: 'backup_due' } });
    }
  } catch (e: any) { console.error('[backup] push reminder failed:', e?.message); }
  return true;
}

/** Hourly check. Safe on a single instance; the advisory lock also protects against duplicate instances. */
export function startBackupScheduler(): () => Promise<void> {
  let stopped = false;
  let inFlight: Promise<void> | undefined;
  const tick = () => {
    if (stopped || inFlight) return;
    inFlight = sendReminderIfDue()
      .then(
        () => undefined,
        (e) => { console.error('[backup] reminder check failed:', e?.message); },
      )
      .finally(() => { inFlight = undefined; });
  };
  const initial = setTimeout(tick, 60_000);
  const interval = setInterval(tick, 60 * 60 * 1000);
  initial.unref();
  interval.unref();

  return async () => {
    stopped = true;
    clearTimeout(initial);
    clearInterval(interval);
    await inFlight;
  };
}
