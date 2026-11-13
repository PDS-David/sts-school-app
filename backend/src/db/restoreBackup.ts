/**
 * Restore an encrypted .sts-backup file into a database.
 *
 *   cd backend
 *   $env:BACKUP_PASSPHRASE="<the server's passphrase>"
 *   node --import tsx src/db/restoreBackup.ts --file sts-backup-2026-11-20.sts-backup            # DRY RUN
 *   node --import tsx src/db/restoreBackup.ts --file <f> --apply --confirm-database <exact db name>
 *
 * Target must already have the schema (run db:bootstrap on a new empty database first). --apply
 * TRUNCATEs every table in the backup and reloads it, in ONE transaction (all or nothing), in
 * foreign-key order, then resets serial sequences. Dry run is the default and writes nothing.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { pool } from './pool.js';
import { decryptPayload, type BackupPayload } from '../utils/backup.js';

const ident = (s: string) => '"' + s.replace(/"/g, '""') + '"';

/** Orders tables so parents load before children. Throws on a cycle. */
export function fkOrder(names: string[], edges: [string, string][]): string[] {
  const set = new Set(names);
  const deps = new Map(names.map(n => [n, new Set<string>()]));
  for (const [child, parent] of edges) if (child !== parent && set.has(child) && set.has(parent)) deps.get(child)!.add(parent);
  const out: string[] = [];
  const left = new Set(names);
  while (left.size) {
    const ready = [...left].filter(n => [...deps.get(n)!].every(d => !left.has(d))).sort();
    if (!ready.length) throw new Error('Circular foreign keys between: ' + [...left].join(', '));
    for (const r of ready) { out.push(r); left.delete(r); }
  }
  return out;
}

/**
 * Reject malformed or partial payloads before opening a destructive restore
 * transaction. The encrypted container authenticates bytes, not the schema
 * shape or completeness of a backup created by an older application build.
 */
export function validateBackupPayloadShape(p: BackupPayload): void {
  if (!p || p.version !== 1 || typeof p.database !== 'string' ||
      !p.database || typeof p.created_at !== 'string' || !Array.isArray(p.tables)) {
    throw new Error('Backup payload is malformed or uses an unsupported version.');
  }

  const tableNames = new Set<string>();
  for (const table of p.tables) {
    if (!table || typeof table.name !== 'string' || !table.name ||
        tableNames.has(table.name) || !Array.isArray(table.columns) ||
        !table.columns.length || !Array.isArray(table.rows)) {
      throw new Error('Backup payload contains an invalid or duplicate table definition.');
    }
    tableNames.add(table.name);

    const columnNames = new Set<string>();
    for (const column of table.columns) {
      if (!column || typeof column.name !== 'string' || !column.name ||
          typeof column.type !== 'string' || !column.type || columnNames.has(column.name)) {
        throw new Error(`Backup table "${table.name}" contains an invalid or duplicate column definition.`);
      }
      columnNames.add(column.name);
    }
    for (let index = 0; index < table.rows.length; index++) {
      const row = table.rows[index];
      if (!Array.isArray(row) || row.length !== table.columns.length) {
        throw new Error(`Backup table "${table.name}" row ${index + 1} does not match its column count.`);
      }
    }
  }
}

/**
 * Ensure the backup describes the complete target schema. TRUNCATE ... CASCADE
 * can erase dependent tables not named in the backup, so a partial/older
 * backup must be refused rather than silently destroying unrepresented data.
 */
async function validateTargetSchema(
  client: import('pg').PoolClient,
  tables: BackupPayload['tables'],
  present: Set<string>,
): Promise<void> {
  const backupNames = new Set(tables.map(table => table.name));
  const targetNames = new Set([...present].filter(name => name !== 'app_bootstrap' && name !== 'backup_log'));

  const extra = [...targetNames].filter(name => !backupNames.has(name)).sort();
  if (extra.length) {
    throw new Error(
      'Target has tables not present in backup (refusing destructive restore): ' + extra.join(', '),
    );
  }

  for (const table of tables) {
    const { rows: currentColumns } = await client.query(
      `SELECT column_name, data_type, udt_name, character_maximum_length,
              numeric_precision, numeric_scale, is_nullable, column_default,
              is_identity, is_generated
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name=$1
       ORDER BY ordinal_position`,
      [table.name],
    );
    if (currentColumns.length !== table.columns.length) {
      throw new Error(`Target schema mismatch for "${table.name}": column count differs from backup.`);
    }

    const currentByName = new Map(currentColumns.map((column: any) => [column.column_name, column]));
    for (const backupColumn of table.columns) {
      const current = currentByName.get(backupColumn.name) as Record<string, unknown> | undefined;
      if (!current || current.data_type !== backupColumn.type) {
        throw new Error(`Target schema mismatch for "${table.name}.${backupColumn.name}": column is missing or has a different type.`);
      }
      const metadata = [
        'udt_name',
        'character_maximum_length',
        'numeric_precision',
        'numeric_scale',
        'is_nullable',
        'column_default',
        'is_identity',
        'is_generated',
      ] as const;
      for (const field of metadata) {
        const backupValue = (backupColumn as Record<string, unknown>)[field];
        if (backupValue !== undefined && backupValue !== current[field]) {
          throw new Error(`Target schema mismatch for "${table.name}.${backupColumn.name}": ${field} differs from backup.`);
        }
      }
    }
  }
}

const toParam = (v: unknown, type: string) =>
  v === null || v === undefined ? null
    : (type === 'json' || type === 'jsonb') ? JSON.stringify(v) : v;

export async function restore(p: BackupPayload, opts: { apply: boolean; confirmDatabase?: string }) {
  validateBackupPayloadShape(p);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: db } = await client.query('SELECT current_database() AS d');
    const database = db[0].d as string;
    const { rows: have } = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`);
    const present = new Set(have.map((r: any) => r.table_name));
    const tables = p.tables.filter(t => t.name !== 'app_bootstrap' && t.name !== 'backup_log');
    const missing = tables.filter(t => !present.has(t.name)).map(t => t.name);
    if (missing.length) throw new Error('Target is missing tables (run db:bootstrap first): ' + missing.join(', '));

    await validateTargetSchema(client, tables, present);

    const { rows: fks } = await client.query(
      `SELECT cl.relname AS child, pl.relname AS parent FROM pg_constraint c
         JOIN pg_class cl ON cl.oid=c.conrelid JOIN pg_class pl ON pl.oid=c.confrelid
         JOIN pg_namespace n ON n.oid=cl.relnamespace WHERE c.contype='f' AND n.nspname='public'`);
    const order = fkOrder(tables.map(t => t.name), fks.map((r: any) => [r.child, r.parent]));
    const byName = new Map(tables.map(t => [t.name, t]));
    const summary = order.map(n => `${n}: ${byName.get(n)!.rows.length} rows`);

    if (!opts.apply) {
      await client.query('ROLLBACK');
      return { mode: 'dry-run' as const, database, summary };
    }
    if (opts.confirmDatabase !== database) throw new Error('--confirm-database must equal the connected database name.');

    await client.query(`TRUNCATE ${order.map(ident).join(', ')} RESTART IDENTITY`);
    for (const name of order) {
      const t = byName.get(name)!;
      if (!t.rows.length) continue;
      const cols = t.columns.map(c => ident(c.name)).join(',');
      const ph = t.columns.map((_, i) => `$${i + 1}`).join(',');
      for (const row of t.rows) {
        await client.query(`INSERT INTO public.${ident(name)}(${cols}) VALUES(${ph})`, row.map((v, i) => toParam(v, t.columns[i].type)));
      }
    }
    // Re-sync serial/identity sequences to the restored data.
    for (const name of order) {
      for (const c of byName.get(name)!.columns) {
        const { rows: seq } = await client.query(`SELECT pg_get_serial_sequence($1,$2) AS s`, [`public.${ident(name)}`, c.name]);
        if (seq[0]?.s) await client.query(`SELECT setval($1, COALESCE((SELECT max(${ident(c.name)}) FROM public.${ident(name)}), 1), (SELECT count(*) > 0 FROM public.${ident(name)}))`, [seq[0].s]);
      }
    }
    await client.query('COMMIT');
    return { mode: 'applied' as const, database, summary };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  const { values } = parseArgs({ options: {
    file: { type: 'string' }, apply: { type: 'boolean' }, 'confirm-database': { type: 'string' },
  } });
  try {
    if (!values.file) throw new Error('--file <backup> is required.');
    const pass = process.env.BACKUP_PASSPHRASE?.trim();
    if (!pass) throw new Error('Set BACKUP_PASSPHRASE in the environment.');
    const payload = decryptPayload(readFileSync(values.file), pass);
    console.log(`Backup from ${payload.created_at} (database "${payload.database}"), ${payload.tables.length} tables.`);
    const r = await restore(payload, { apply: values.apply === true, confirmDatabase: values['confirm-database'] });
    console.log(r.mode === 'dry-run' ? `DRY RUN against "${r.database}" - nothing written. Add --apply --confirm-database ${r.database} to restore.` : `Restored into "${r.database}".`);
    r.summary.forEach(s => console.log('  ' + s));
  } catch (e: any) {
    console.error('Restore refused/failed:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) void main();
