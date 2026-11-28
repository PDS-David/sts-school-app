import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test, { after, before } from 'node:test';
import { collectPayload, decryptPayload, encryptPayload, BACKUP_EXCLUDED_TABLES, type BackupPayload } from '../backend/src/utils/backup.js';
import { pool, query } from '../backend/src/db/pool.js';
import { restore } from '../backend/src/db/restoreBackup.ts';

// Disposable-database tests for progression-decision history (migration 0022)
// under the application's backup and disaster-recovery restore.
//
// The table is append-only, so rows are never written to it directly. They are
// built into a backup payload and loaded by restore(), exactly as a real
// recovery would. `after` restores the pre-test backup, which removes the
// fixture rows again and leaves the table empty for other schema tests.

const TABLE = 'report_roster_progression_decisions';
const PASSPHRASE = 'progression-test-passphrase-0123456789';

/** table.trigger -> pg_trigger.tgenabled for every protection this feature relies on. */
const WATCHED: ReadonlyArray<readonly [string, string]> = [
  ['audit_log', 'audit_log_append_only_truncate'],
  ['report_roster_membership_events', 'report_roster_events_append_only_truncate'],
  [TABLE, 'report_roster_progression_append_only_truncate'],
  [TABLE, 'report_roster_progression_append_only_delete'],
  [TABLE, 'report_roster_progression_validate_insert'],
  [TABLE, 'report_roster_progression_guard_update'],
  [TABLE, 'report_roster_progression_check_successor'],
];

async function triggerStates(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const [table, trigger] of WATCHED) {
    const { rows } = await query(
      `SELECT tgenabled FROM pg_trigger WHERE tgrelid = to_regclass($1) AND tgname = $2 AND NOT tgisinternal`,
      [`public.${table}`, trigger],
    );
    out[`${table}.${trigger}`] = rows[0]?.tgenabled ?? 'MISSING';
  }
  return out;
}

const ALL_ENABLED = Object.fromEntries(WATCHED.map(([t, g]) => [`${t}.${g}`, 'O']));

async function databaseName(): Promise<string> {
  const { rows } = await query('SELECT current_database() AS name');
  return String(rows[0].name);
}

/** Everything a failed restore must leave exactly as it found it. */
async function snapshot() {
  const one = async (sql: string, params: unknown[] = []) => (await query(sql, params)).rows[0];
  return {
    progression: await one(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(d::text, '|' ORDER BY d.id), '')) AS h FROM ${TABLE} d`),
    schools: await one(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(s::text, '|' ORDER BY s.code), '')) AS h FROM schools s`),
    terms: await one(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(t::text, '|' ORDER BY t.id), '')) AS h FROM terms t`),
    students: await one(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(s::text, '|' ORDER BY s.id), '')) AS h FROM students s`),
    audit: await one(`SELECT count(*)::int AS n FROM audit_log`),
    triggers: await triggerStates(),
  };
}

async function expectSqlState(promise: Promise<unknown>, code: string, label: string) {
  await assert.rejects(promise, (e: unknown) => {
    assert.equal((e as { code?: string }).code, code, `${label}: expected SQLSTATE ${code}, got ${(e as Error).message}`);
    return true;
  }, label);
}

const ADMIN = randomUUID();
const TEACHER = randomUUID();
const SCHOOL = `prgrst_${randomUUID().slice(0, 10)}`;
const YEAR = '2026/2027';

let baseline: BackupPayload;
let termId: number;
let studentA: string; // retained -> superseded by an administrator promotion
let studentB: string; // promoted -> reversed -> new active decision
let studentC: string; // no decisions; used by tamper scenarios

type Values = Record<string, unknown>;

function decisionRow(payload: BackupPayload, v: Values): unknown[] {
  const table = payload.tables.find(t => t.name === TABLE);
  assert.ok(table, `${TABLE} must be part of the backup`);
  const defaults: Values = {
    school_code: SCHOOL, academic_year: YEAR, term_id: termId, term_name: '1st Term',
    decided_at: '2026-11-01 10:00:00+00', source: 'application', status: 'active', details: {},
  };
  const merged = { ...defaults, ...v };
  return table.columns.map(c => (c.name in merged ? merged[c.name] : null));
}

function addDecisions(payload: BackupPayload, rows: Values[]) {
  const table = payload.tables.find(t => t.name === TABLE)!;
  for (const r of rows) table.rows.push(decisionRow(payload, r));
}

const ended = (status: 'superseded' | 'reversed') => ({
  status, ended_at: '2026-11-10 09:00:00+00', ended_by: ADMIN, ended_by_role: 'admin', ended_reason: 'Administrator correction',
});

/** History covering every state: a superseded->replacement pair, a reversed decision and its fresh successor. */
function historyRows(): Values[] {
  return [
    // Deliberately listed child-before-parent to prove restore orders self-references.
    { id: '9002', student_id: studentA, decision_type: 'promoted', from_class_name: 'Primary 4', to_class_name: 'Primary 5',
      decided_by: ADMIN, decided_by_role: 'admin', reason: 'Retention recorded in error', supersedes_decision_id: '9001' },
    { id: '9001', student_id: studentA, decision_type: 'retained', from_class_name: 'Primary 4', to_class_name: 'Primary 4',
      decided_by: TEACHER, decided_by_role: 'teacher', ...ended('superseded') },
    { id: '9003', student_id: studentB, decision_type: 'promoted', from_class_name: 'Primary 4', to_class_name: 'Primary 5',
      decided_by: TEACHER, decided_by_role: 'teacher', ...ended('reversed') },
    { id: '9004', student_id: studentB, decision_type: 'retained', from_class_name: 'Primary 4', to_class_name: 'Primary 4',
      decided_by: TEACHER, decided_by_role: 'teacher' },
  ];
}

before(async () => {
  baseline = await collectPayload();
  await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SCHOOL, `Progression restore ${SCHOOL}`]);
  const term = await query(
    `INSERT INTO terms(name,academic_year,school_code,is_current) VALUES('1st Term',$1,$2,true) RETURNING id`, [YEAR, SCHOOL]);
  termId = term.rows[0].id;
  const student = async (name: string, n: number) => (await query(
    `INSERT INTO students(school_code,admission_number,full_name,class_name) VALUES($1,$2,$3,'Primary 4') RETURNING id`,
    [SCHOOL, `PR-${n}-${SCHOOL}`, name])).rows[0].id as string;
  studentA = await student('Restore A', 1);
  studentB = await student('Restore B', 2);
  studentC = await student('Restore C', 3);

  const payload = await collectPayload();
  addDecisions(payload, historyRows());
  const result = await restore(payload, { apply: true, confirmDatabase: await databaseName() });
  assert.equal(result.mode, 'applied');
});

after(async () => {
  try {
    if (baseline) await restore(baseline, { apply: true, confirmDatabase: await databaseName() });
  } finally {
    await pool.end();
  }
});

test('backup includes progression-decision records, and they survive the encrypted file round trip', async () => {
  assert.equal((BACKUP_EXCLUDED_TABLES as readonly string[]).includes(TABLE), false);
  const payload = await collectPayload();
  const table = payload.tables.find(t => t.name === TABLE);
  assert.ok(table, 'the backup must contain the progression table');
  const col = (name: string) => table.columns.findIndex(c => c.name === name);
  const summarise = (p: BackupPayload) => p.tables.find(t => t.name === TABLE)!.rows
    .map(r => [String(r[col('id')]), r[col('status')], r[col('decision_type')], r[col('supersedes_decision_id')] === null ? null : String(r[col('supersedes_decision_id')])])
    .sort((a, b) => Number(a[0]) - Number(b[0]));
  assert.deepEqual(summarise(payload), [
    ['9001', 'superseded', 'retained', null],
    ['9002', 'active', 'promoted', '9001'],
    ['9003', 'reversed', 'promoted', null],
    ['9004', 'active', 'retained', null],
  ]);
  const decrypted = decryptPayload(encryptPayload(payload, PASSPHRASE), PASSPHRASE);
  assert.deepEqual(summarise(decrypted), summarise(payload), 'records must be readable from the encrypted backup file');
});

test('restore reloads ended history on a disposable database, keeps the chain and resyncs the id sequence', async () => {
  const { rows } = await query(
    `SELECT id::text AS id, status, decision_type, supersedes_decision_id::text AS supersedes, ended_by_role
       FROM ${TABLE} WHERE school_code=$1 ORDER BY id`, [SCHOOL]);
  assert.deepEqual(rows, [
    { id: '9001', status: 'superseded', decision_type: 'retained', supersedes: null, ended_by_role: 'admin' },
    { id: '9002', status: 'active', decision_type: 'promoted', supersedes: '9001', ended_by_role: null },
    { id: '9003', status: 'reversed', decision_type: 'promoted', supersedes: null, ended_by_role: 'admin' },
    { id: '9004', status: 'active', decision_type: 'retained', supersedes: null, ended_by_role: null },
  ]);
  const seq = await query(`SELECT last_value::text AS last_value, is_called FROM public.${TABLE}_id_seq`);
  assert.deepEqual(seq.rows[0], { last_value: '9004', is_called: true });
});

test('after a restore every append-only trigger is back to its original enabled state and still enforces', async () => {
  assert.deepEqual(await triggerStates(), ALL_ENABLED);
  await expectSqlState(query(`DELETE FROM ${TABLE} WHERE id=9001`), '42501', 'delete');
  await expectSqlState(query(`TRUNCATE ${TABLE}`), '42501', 'truncate');
  await expectSqlState(query(`UPDATE ${TABLE} SET reason='rewritten' WHERE id=9002`), '42501', 'content update');
  await expectSqlState(query(`UPDATE ${TABLE} SET ended_reason='rewritten' WHERE id=9001`), '42501', 'ended decision is final');
  // Rejected by its append-only trigger (42501) or, now that decisions reference
  // roster events, earlier still by the foreign key (0A000). Either way it is refused.
  await assert.rejects(
    query('TRUNCATE report_roster_membership_events'),
    (e: unknown) => ['42501', '0A000'].includes((e as { code?: string }).code ?? ''),
  );
  await expectSqlState(query('TRUNCATE audit_log'), '42501', 'audit truncate');

  // The insert validator must be live again, not merely enabled on paper.
  await assert.rejects(
    query(
      `INSERT INTO ${TABLE}
         (student_id,school_code,academic_year,term_id,term_name,decision_type,from_class_name,to_class_name,decided_by,decided_by_role)
       VALUES($1,'primary',$2,$3,'1st Term','retained','Primary 4','Primary 4',$4,'teacher')`,
      [studentC, YEAR, termId, TEACHER]),
    (e: unknown) => (e as { code?: string }).code === '23514' && /does not match the student/.test((e as Error).message),
  );
});

test('triggers that were not simply enabled are returned to exactly their previous state', async () => {
  const ident = (s: string) => `"${s}"`;
  const set = (table: string, trigger: string, mode: 'ENABLE TRIGGER' | 'ENABLE ALWAYS TRIGGER' | 'DISABLE TRIGGER') =>
    query(`ALTER TABLE public.${ident(table)} ${mode} ${ident(trigger)}`);
  try {
    await set(TABLE, 'report_roster_progression_append_only_truncate', 'ENABLE ALWAYS TRIGGER');
    await set('report_roster_membership_events', 'report_roster_events_append_only_truncate', 'DISABLE TRIGGER');
    const before = await triggerStates();
    assert.equal(before[`${TABLE}.report_roster_progression_append_only_truncate`], 'A');
    assert.equal(before['report_roster_membership_events.report_roster_events_append_only_truncate'], 'D');

    await restore(await collectPayload(), { apply: true, confirmDatabase: await databaseName() });

    assert.deepEqual(await triggerStates(), before, 'ALWAYS stays ALWAYS, DISABLED stays DISABLED, ENABLED stays ENABLED');
  } finally {
    await set(TABLE, 'report_roster_progression_append_only_truncate', 'ENABLE TRIGGER');
    await set('report_roster_membership_events', 'report_roster_events_append_only_truncate', 'ENABLE TRIGGER');
  }
  assert.deepEqual(await triggerStates(), ALL_ENABLED);
});

test('a dry run changes neither data nor trigger state', async () => {
  const before = await snapshot();
  const result = await restore(await collectPayload(), { apply: false });
  assert.equal(result.mode, 'dry-run');
  assert.ok(result.summary.some(line => line.startsWith(`${TABLE}: 4 rows`)));
  assert.deepEqual(await snapshot(), before);
});

// ── failed restores must roll back completely ────────────────────────────────

type Tamper = { label: string; message: RegExp; mutate: (p: BackupPayload) => void };

const tampers: Tamper[] = [
  {
    label: 'a row that violates a table CHECK constraint',
    message: /check constraint|violates/i,
    mutate: p => addDecisions(p, [{ id: '9100', student_id: studentC, decision_type: 'graduated', from_class_name: 'Primary 4',
      to_class_name: 'Primary 5', decided_by: TEACHER, decided_by_role: 'teacher' }]),
  },
  {
    label: 'a decision that points at a superseded decision which is not in the backup',
    message: /foreign key|violates/i,
    mutate: p => addDecisions(p, [{ id: '9101', student_id: studentC, decision_type: 'promoted', from_class_name: 'Primary 4',
      to_class_name: 'Primary 5', decided_by: ADMIN, decided_by_role: 'admin', reason: 'x', supersedes_decision_id: '987654' }]),
  },
  {
    label: 'a decision whose school does not match its student and term (caught by post-load verification)',
    message: /integrity verification/,
    mutate: p => addDecisions(p, [{ id: '9102', student_id: studentC, school_code: 'primary', decision_type: 'retained',
      from_class_name: 'Primary 4', to_class_name: 'Primary 4', decided_by: TEACHER, decided_by_role: 'teacher' }]),
  },
  {
    label: 'a superseded decision with no replacement (caught by the deferred successor check)',
    message: /requires its replacement decision/,
    mutate: p => addDecisions(p, [{ id: '9103', student_id: studentC, decision_type: 'retained', from_class_name: 'Primary 4',
      to_class_name: 'Primary 4', decided_by: TEACHER, decided_by_role: 'teacher', ...ended('superseded') }]),
  },
  {
    label: 'decisions that supersede each other in a cycle (fails after the TRUNCATE has run)',
    message: /circular/i,
    mutate: p => addDecisions(p, [
      { id: '9104', student_id: studentC, decision_type: 'promoted', from_class_name: 'Primary 4', to_class_name: 'Primary 5',
        decided_by: ADMIN, decided_by_role: 'admin', reason: 'x', supersedes_decision_id: '9105' },
      { id: '9105', student_id: studentC, decision_type: 'retained', from_class_name: 'Primary 4', to_class_name: 'Primary 4',
        decided_by: ADMIN, decided_by_role: 'admin', reason: 'x', supersedes_decision_id: '9104' },
    ]),
  },
  {
    label: 'a duplicate row in the backup',
    message: /duplicate/i,
    mutate: p => {
      const table = p.tables.find(t => t.name === TABLE)!;
      table.rows.push([...table.rows[0]]);
    },
  },
];

for (const scenario of tampers) {
  test(`failed restore rolls back completely: ${scenario.label}`, async () => {
    const before = await snapshot();
    assert.equal(before.progression.n, 4, 'precondition: the fixture history is present');
    const payload = await collectPayload();
    scenario.mutate(payload);

    await assert.rejects(restore(payload, { apply: true, confirmDatabase: await databaseName() }), scenario.message);

    assert.deepEqual(await snapshot(), before, 'data and every trigger state must be exactly as before the attempt');
    await expectSqlState(query(`TRUNCATE ${TABLE}`), '42501', 'protection still enforced after the failed restore');
    await expectSqlState(query(`DELETE FROM ${TABLE} WHERE id=9001`), '42501', 'delete still rejected after the failed restore');
  });
}

test('a backup that predates the progression table is refused, leaving history untouched', async () => {
  const before = await snapshot();
  const payload = await collectPayload();
  payload.tables = payload.tables.filter(t => t.name !== TABLE);
  await assert.rejects(
    restore(payload, { apply: true, confirmDatabase: await databaseName() }),
    new RegExp(`Target has tables not present in backup.*${TABLE}`),
  );
  assert.deepEqual(await snapshot(), before);
});
