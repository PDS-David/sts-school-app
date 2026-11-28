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
import { BACKUP_EXCLUDED_TABLES, decryptPayload, type BackupPayload, type BackupTable } from '../utils/backup.js';

const ident = (s: string) => '"' + s.replace(/"/g, '""') + '"';
const EXCLUDED_TABLES = new Set<string>(BACKUP_EXCLUDED_TABLES);
const PROGRESSION_TABLE = 'report_roster_progression_decisions';

/**
 * Append-only protections that a deliberate, explicitly confirmed
 * disaster-recovery restore must lift, and only for the lifetime of its single
 * transaction. Each entry is switched off with ALTER TABLE ... DISABLE TRIGGER
 * and switched back to the exact state it had before (see
 * disableRestoreTriggers / reinstateRestoreTriggers). PostgreSQL applies
 * trigger-state changes transactionally and other sessions cannot see them
 * before COMMIT, so the protections are never weakened for anyone else, and a
 * rollback undoes the change automatically.
 */
export interface RestoreTriggerBypass {
  table: string;
  trigger: string;
  why: string;
}
export const RESTORE_TRIGGER_BYPASSES: readonly RestoreTriggerBypass[] = [
  { table: 'audit_log', trigger: 'audit_log_append_only_truncate', why: 'restore replaces the table with TRUNCATE' },
  { table: 'report_roster_membership_events', trigger: 'report_roster_events_append_only_truncate', why: 'restore replaces the table with TRUNCATE' },
  { table: PROGRESSION_TABLE, trigger: 'report_roster_progression_append_only_truncate', why: 'restore replaces the table with TRUNCATE' },
  {
    table: PROGRESSION_TABLE,
    trigger: 'report_roster_progression_validate_insert',
    why: 'it only accepts brand-new active rows in dependency order, so it cannot reload ended (superseded/reversed) history; ' +
      'verifyProgressionHistory re-checks the same rules before COMMIT',
  },
];

/**
 * Orders rows so every row comes after the row it references through a
 * self-referencing foreign key (here supersedes_decision_id). Insertion order
 * in a backup is not guaranteed to follow the reference direction, and the
 * constraint is checked per row. Throws on duplicate ids or a reference cycle;
 * a reference to a row that is not in the backup is left for the database's
 * foreign-key check to reject.
 */
export function orderRowsParentsFirst(table: BackupTable, idColumn: string, parentColumn: string): unknown[][] {
  const idIdx = table.columns.findIndex(c => c.name === idColumn);
  const parentIdx = table.columns.findIndex(c => c.name === parentColumn);
  if (idIdx < 0 || parentIdx < 0) {
    throw new Error(`Backup table "${table.name}" lacks the ${idColumn}/${parentColumn} columns.`);
  }
  const byId = new Map<string, unknown[]>();
  for (const row of table.rows) {
    const id = String(row[idIdx]);
    if (byId.has(id)) throw new Error(`Backup table "${table.name}" contains duplicate ${idColumn} ${id}.`);
    byId.set(id, row);
  }
  const ordered: unknown[][] = [];
  const done = new Set<string>();
  const inProgress = new Set<string>();
  const visit = (row: unknown[]): void => {
    const id = String(row[idIdx]);
    if (done.has(id)) return;
    if (inProgress.has(id)) throw new Error(`Backup table "${table.name}" has circular ${parentColumn} references.`);
    inProgress.add(id);
    const parentId = row[parentIdx];
    if (parentId !== null && parentId !== undefined) {
      const parent = byId.get(String(parentId));
      if (parent) visit(parent);
    }
    inProgress.delete(id);
    done.add(id);
    ordered.push(row);
  };
  for (const row of table.rows) visit(row);
  return ordered;
}

/**
 * The insert-time validator is lifted during restore (see
 * RESTORE_TRIGGER_BYPASSES), so its cross-table rules are re-verified here on
 * the data that was actually loaded. Any violation aborts and rolls back the
 * whole restore. The successor rule (a superseded decision has a replacement, a
 * reversed one does not) is enforced separately by the deferred constraint
 * trigger, which stays enabled and is flushed with SET CONSTRAINTS ALL IMMEDIATE.
 */
async function verifyProgressionHistory(client: import('pg').PoolClient): Promise<void> {
  const { rows } = await client.query(
    `SELECT d.id, 'the student belongs to a different school than the decision' AS problem
       FROM public.${PROGRESSION_TABLE} d
       JOIN public.students s ON s.id = d.student_id
      WHERE s.school_code IS DISTINCT FROM d.school_code
     UNION ALL
     SELECT d.id, 'the term does not match the decision school, academic year and term name'
       FROM public.${PROGRESSION_TABLE} d
       JOIN public.terms t ON t.id = d.term_id
      WHERE t.school_code IS DISTINCT FROM d.school_code
         OR t.academic_year IS DISTINCT FROM d.academic_year
         OR t.name IS DISTINCT FROM d.term_name
     UNION ALL
     SELECT d.id, 'the replaced decision is for another student or year, or was not ended as superseded by the same administrator'
       FROM public.${PROGRESSION_TABLE} d
       JOIN public.${PROGRESSION_TABLE} p ON p.id = d.supersedes_decision_id
      WHERE p.student_id <> d.student_id
         OR p.school_code <> d.school_code
         OR p.academic_year <> d.academic_year
         OR p.status <> 'superseded'
         OR p.ended_by IS DISTINCT FROM d.decided_by
     ORDER BY 1
     LIMIT 10`,
  );
  if (rows.length) {
    throw new Error(
      'Restored progression decisions failed integrity verification (restore rolled back): ' +
      rows.map((r: any) => `decision ${r.id}: ${r.problem}`).join('; '),
    );
  }
}

interface SavedTriggerState extends RestoreTriggerBypass {
  /** pg_trigger.tgenabled before the restore touched it: O origin, A always, R replica, D disabled. */
  state: string;
}

async function readTriggerState(
  client: import('pg').PoolClient,
  table: string,
  trigger: string,
): Promise<string | null> {
  const { rows } = await client.query(
    `SELECT tgenabled FROM pg_trigger
      WHERE tgrelid = to_regclass($1) AND tgname = $2 AND NOT tgisinternal`,
    [`public.${ident(table)}`, trigger],
  );
  return rows[0]?.tgenabled ?? null;
}

/**
 * Records the current state of every registered trigger whose table is part of
 * the restore, then disables the ones that are currently enabled. Triggers that
 * are already disabled, or that only fire in replica mode, are left alone so
 * their state is preserved exactly.
 */
async function disableRestoreTriggers(
  client: import('pg').PoolClient,
  tablesInRestore: ReadonlySet<string>,
): Promise<SavedTriggerState[]> {
  const saved: SavedTriggerState[] = [];
  for (const bypass of RESTORE_TRIGGER_BYPASSES) {
    if (!tablesInRestore.has(bypass.table)) continue;
    const state = await readTriggerState(client, bypass.table, bypass.trigger);
    if (state === null) continue; // trigger does not exist on this target
    saved.push({ ...bypass, state });
    if (state === 'O' || state === 'A') {
      await client.query(`ALTER TABLE public.${ident(bypass.table)} DISABLE TRIGGER ${ident(bypass.trigger)}`);
    }
  }
  return saved;
}

/** Puts every trigger back to its recorded state and proves it before COMMIT. */
async function reinstateRestoreTriggers(
  client: import('pg').PoolClient,
  saved: readonly SavedTriggerState[],
): Promise<void> {
  for (const s of saved) {
    if (s.state === 'A') {
      await client.query(`ALTER TABLE public.${ident(s.table)} ENABLE ALWAYS TRIGGER ${ident(s.trigger)}`);
    } else if (s.state === 'O') {
      await client.query(`ALTER TABLE public.${ident(s.table)} ENABLE TRIGGER ${ident(s.trigger)}`);
    }
  }
  for (const s of saved) {
    const now = await readTriggerState(client, s.table, s.trigger);
    if (now !== s.state) {
      throw new Error(
        `Trigger ${s.table}.${s.trigger} was not returned to its original state ` +
        `(expected "${s.state}", found "${now}"); restore rolled back.`,
      );
    }
  }
}

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
  const targetNames = new Set([...present].filter(name => !EXCLUDED_TABLES.has(name)));

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
    const tables = p.tables.filter(t => !EXCLUDED_TABLES.has(t.name));
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

    // The audit tables are append-only during normal application operation. A
    // deliberate, explicitly confirmed disaster-recovery restore is the only
    // path allowed to replace their contents. Only the registered triggers are
    // disabled, inside this transaction, and each is returned to its exact
    // previous state (and verified) before COMMIT. A rollback also rolls back
    // the trigger-state changes.
    const savedTriggers = await disableRestoreTriggers(client, new Set(byName.keys()));

    await client.query(`TRUNCATE ${order.map(ident).join(', ')} RESTART IDENTITY`);
    for (const name of order) {
      const t = byName.get(name)!;
      if (!t.rows.length) continue;
      const cols = t.columns.map(c => ident(c.name)).join(',');
      const ph = t.columns.map((_, i) => `$${i + 1}`).join(',');
      const rows = name === PROGRESSION_TABLE ? orderRowsParentsFirst(t, 'id', 'supersedes_decision_id') : t.rows;
      for (const row of rows) {
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
    // Flush deferred constraint triggers now: their failures then surface here
    // with a clear message, and PostgreSQL refuses ALTER TABLE on a table that
    // still has pending trigger events, which the re-enable below would hit.
    await client.query('SET CONSTRAINTS ALL IMMEDIATE');
    if (byName.has(PROGRESSION_TABLE)) await verifyProgressionHistory(client);
    await reinstateRestoreTriggers(client, savedTriggers);
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
