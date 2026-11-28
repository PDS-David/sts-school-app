import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test, { after, before, mock } from 'node:test';
import { collectPayload, type BackupPayload } from '../backend/src/utils/backup.js';
import { pool, query } from '../backend/src/db/pool.js';
import { restore } from '../backend/src/db/restoreBackup.ts';
import {
  AcademicResetRefusal,
  runNewSessionMode,
  runSessionMode,
  runTermMode,
} from '../backend/src/db/resetAcademicData.ts';

// Disposable-database tests for the academic-data reset against progression
// history (migration 0022). The progression table is append-only, so its rows
// are loaded by restoring a backup payload, and `after` restores the pre-test
// backup, which removes every fixture row again.

const TABLE = 'report_roster_progression_decisions';
const SUFFIX = randomUUID().slice(0, 10);
const HISTORY_SCHOOL = `rsth_${SUFFIX}`; // has a progression decision in Y1
const PLAIN_SCHOOL = `rstp_${SUFFIX}`; // no progression decisions, but has roster history
const Y1 = '2025/2026';
const Y2 = '2026/2027';

let baseline: BackupPayload;
const ids = {} as { t1: number; t2: number; hs1: string; hs2: string; pt: number; ps: string };

const dbName = async () => String((await query('SELECT current_database() AS name')).rows[0].name);

async function snapshot() {
  const schools = [HISTORY_SCHOOL, PLAIN_SCHOOL];
  const agg = async (sql: string) => (await query(sql, [schools])).rows[0];
  return {
    terms: await agg(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(t::text,'|' ORDER BY t.id),'')) AS h FROM terms t WHERE t.school_code = ANY($1)`),
    students: await agg(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(s::text,'|' ORDER BY s.id),'')) AS h FROM students s WHERE s.school_code = ANY($1)`),
    materials: await agg(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(m::text,'|' ORDER BY m.id),'')) AS h FROM materials m WHERE m.school_code = ANY($1)`),
    questions: await agg(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(q::text,'|' ORDER BY q.id),'')) AS h FROM questions q WHERE q.school_code = ANY($1)`),
    assessments: await agg(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(a::text,'|' ORDER BY a.id::text),'')) AS h FROM assessments a WHERE a.school_code = ANY($1)`),
    invoices: await agg(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(i::text,'|' ORDER BY i.id::text),'')) AS h FROM invoices i JOIN students s ON s.id=i.student_id WHERE s.school_code = ANY($1)`),
    progression: (await query(`SELECT count(*)::int AS n, md5(COALESCE(string_agg(d::text,'|' ORDER BY d.id),'')) AS h FROM ${TABLE} d`)).rows[0],
  };
}

before(async () => {
  mock.method(console, 'log', () => undefined); // the reset modes narrate; keep test output readable
  baseline = await collectPayload();

  await query('INSERT INTO schools(code,name) VALUES($1,$2),($3,$4)', [HISTORY_SCHOOL, `Reset history ${SUFFIX}`, PLAIN_SCHOOL, `Reset plain ${SUFFIX}`]);
  const term = async (school: string, year: string) => (await query(
    `INSERT INTO terms(name,academic_year,school_code) VALUES('1st Term',$1,$2) RETURNING id`, [year, school])).rows[0].id as number;
  const student = async (school: string, n: number) => (await query(
    `INSERT INTO students(school_code,admission_number,full_name,class_name) VALUES($1,$2,$3,'Primary 4') RETURNING id`,
    [school, `RS-${n}-${SUFFIX}`, `Reset student ${n}`])).rows[0].id as string;
  ids.t1 = await term(HISTORY_SCHOOL, Y1);
  ids.t2 = await term(HISTORY_SCHOOL, Y2);
  ids.hs1 = await student(HISTORY_SCHOOL, 1);
  ids.hs2 = await student(HISTORY_SCHOOL, 2);
  ids.pt = await term(PLAIN_SCHOOL, Y1);
  ids.ps = await student(PLAIN_SCHOOL, 3);

  // Per-term records the reset deletes explicitly (they only SET NULL on cascade).
  for (const [school, termId, student] of [[HISTORY_SCHOOL, ids.t1, ids.hs1], [HISTORY_SCHOOL, ids.t2, ids.hs2], [PLAIN_SCHOOL, ids.pt, ids.ps]] as const) {
    await query(`INSERT INTO materials(school_code,term_id,title,type,url) VALUES($1,$2,'Notes','link','https://example.test/n')`, [school, termId]);
    await query(`INSERT INTO questions(school_code,term_id,stem) VALUES($1,$2,'Q?')`, [school, termId]);
    await query(`INSERT INTO assessments(school_code,term_id,title,status) VALUES($1,$2,'Test','open')`, [school, termId]);
    await query(`INSERT INTO invoices(student_id,term_id,total) VALUES($1,$2,1000)`, [student, termId]);
  }
  // Pre-existing append-only roster history that also protects its student from deletion.
  await query(
    `INSERT INTO report_roster_membership_events(student_id,event_type,from_class_name,to_class_name,actor_id)
     VALUES($1,'enrolled',NULL,'Primary 4',$2)`, [ids.ps, randomUUID()]);

  // One progression decision for HISTORY_SCHOOL / Y1, loaded the way a recovery would.
  const payload = await collectPayload();
  const table = payload.tables.find(t => t.name === TABLE)!;
  const admin = randomUUID();
  const values: Record<string, unknown> = {
    id: '7001', student_id: ids.hs1, school_code: HISTORY_SCHOOL, academic_year: Y1, term_id: ids.t1, term_name: '1st Term',
    decision_type: 'retained', from_class_name: 'Primary 4', to_class_name: 'Primary 4', decided_by: admin, decided_by_role: 'teacher',
    decided_at: '2026-07-01 10:00:00+00', source: 'application', status: 'active', details: {},
  };
  table.rows.push(table.columns.map(c => (c.name in values ? values[c.name] : null)));
  await restore(payload, { apply: true, confirmDatabase: await dbName() });
});

after(async () => {
  mock.restoreAll();
  try {
    if (baseline) await restore(baseline, { apply: true, confirmDatabase: await dbName() });
  } finally {
    await pool.end();
  }
});

function expectRefusal(promise: Promise<unknown>, ...patterns: RegExp[]) {
  return assert.rejects(promise, (e: unknown) => {
    assert.ok(e instanceof AcademicResetRefusal, `expected AcademicResetRefusal, got ${(e as Error)?.stack ?? e}`);
    for (const p of patterns) assert.match((e as Error).message, p);
    return true;
  });
}

test('the reset script contains no statement that deletes or truncates progression history', () => {
  const source = readFileSync(join(process.cwd(), 'backend/src/db/resetAcademicData.ts'), 'utf8').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/(DELETE\s+FROM|TRUNCATE(\s+TABLE)?)\s+(public\.)?(report_roster_progression_decisions|\$\{PROGRESSION_TABLE\})/i.test(source));
  assert.ok(!/--(force|override|allow|bypass|purge)/i.test(source), 'no bypass flag may exist');
});

test('--new-session refuses, with a clear explanation, when progression decisions reference the terms (dry run and --yes)', async () => {
  const before = await snapshot();
  assert.equal(before.progression.n, 1, 'precondition: the fixture decision is present');
  for (const yes of [false, true]) {
    await expectRefusal(
      runNewSessionMode(HISTORY_SCHOOL, Y1, false, yes),
      /Refusing --new-session/,
      /1 progression decision\(s\) for 1 student\(s\)/,
      /append-only audit record/,
      /NOTHING WAS CHANGED/,
      /--session .* to clear scores, attendance and class records while keeping the term rows/,
    );
    assert.deepEqual(await snapshot(), before, `nothing may change when the reset is refused (yes=${yes})`);
  }
});

test('--new-session --include-students refuses when the students have decisions, and does not delete anything else first', async () => {
  const before = await snapshot();
  // Y2 has no decisions of its own: only the student-deletion step is blocked.
  await expectRefusal(
    runNewSessionMode(HISTORY_SCHOOL, Y2, true, true),
    /that --include-students would delete/,
    /do not pass --include-students/,
    /NOTHING WAS CHANGED/,
  );
  assert.deepEqual(await snapshot(), before, 'Y2 terms, materials, questions, assessments and invoices must all still exist');
});

test('--term and --session never touch progression history', async () => {
  const before = await snapshot();
  await runTermMode(String(ids.t1), true);
  await runSessionMode(HISTORY_SCHOOL, Y1, true);
  await runSessionMode(HISTORY_SCHOOL, Y2, true);
  const after = await snapshot();
  assert.deepEqual(after.progression, before.progression);
  assert.deepEqual(after.terms, before.terms, 'term rows are kept by these modes');
  assert.deepEqual(after.students, before.students);
});

test('a blocking foreign key mid-reset rolls the whole reset back instead of leaving it half-applied', async () => {
  const before = await snapshot();
  assert.equal(before.materials.n >= 3, true);
  // PLAIN_SCHOOL has no progression decisions, but its student has roster history (RESTRICT), so
  // the student delete fails AFTER materials/questions/assessments/invoices/terms were deleted.
  await expectRefusal(
    runNewSessionMode(PLAIN_SCHOOL, Y1, true, true),
    /fully rolled back/,
    /NOTHING WAS CHANGED/,
    /report_roster_membership_events/,
  );
  assert.deepEqual(await snapshot(), before, 'every earlier delete in the failed reset must have been rolled back');
});

test('a reset that touches no progression history still works normally', async () => {
  const before = await snapshot();
  await runNewSessionMode(PLAIN_SCHOOL, Y1, false, true);
  const after = await snapshot();
  const plain = await query(
    `SELECT (SELECT count(*)::int FROM terms WHERE school_code=$1) AS terms,
            (SELECT count(*)::int FROM materials WHERE school_code=$1) AS materials,
            (SELECT count(*)::int FROM questions WHERE school_code=$1) AS questions,
            (SELECT count(*)::int FROM assessments WHERE school_code=$1) AS assessments,
            (SELECT count(*)::int FROM invoices i JOIN students s ON s.id=i.student_id WHERE s.school_code=$1) AS invoices,
            (SELECT count(*)::int FROM students WHERE school_code=$1) AS students`, [PLAIN_SCHOOL]);
  assert.deepEqual(plain.rows[0], { terms: 0, materials: 0, questions: 0, assessments: 0, invoices: 0, students: 1 });
  assert.deepEqual(after.progression, before.progression);
});

test('--new-session on a year without decisions proceeds and leaves other years and all history intact', async () => {
  const before = await snapshot();
  await runNewSessionMode(HISTORY_SCHOOL, Y2, false, true);
  const after = await snapshot();
  const rows = await query(
    `SELECT (SELECT count(*)::int FROM terms WHERE school_code=$1 AND academic_year=$2) AS y2_terms,
            (SELECT count(*)::int FROM terms WHERE school_code=$1 AND academic_year=$3) AS y1_terms,
            (SELECT count(*)::int FROM materials WHERE school_code=$1 AND term_id=$4) AS y1_materials`,
    [HISTORY_SCHOOL, Y2, Y1, ids.t1]);
  assert.deepEqual(rows.rows[0], { y2_terms: 0, y1_terms: 1, y1_materials: 1 });
  assert.deepEqual(after.progression, before.progression, 'progression history is byte-identical');
  assert.equal(after.students.n, before.students.n, 'students were not deleted');
});
