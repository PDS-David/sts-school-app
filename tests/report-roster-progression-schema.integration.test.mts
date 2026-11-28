import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test, { after } from 'node:test';
import type { PoolClient } from 'pg';
import { pool } from '../backend/src/db/pool.js';

const root = process.cwd();
const migration = readFileSync(join(root, 'backend/migrations/0022_report_roster_progression_decisions.sql'), 'utf8');
const schema = readFileSync(join(root, 'backend/schema.sql'), 'utf8');

after(async () => {
  await pool.end();
});

// ── static: migration/schema parity and scope ────────────────────────────────

function canonicalSql(sql: string): string {
  return sql
    .replace(/--[^\n]*/g, '')
    .replace(/public\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

test('schema.sql mirrors migration 0022 statement-for-statement', () => {
  const startMarker = 'CREATE TABLE IF NOT EXISTS public.report_roster_progression_decisions';
  const migrationBody = migration.slice(migration.indexOf(startMarker));
  const schemaStart = schema.indexOf('CREATE TABLE IF NOT EXISTS report_roster_progression_decisions');
  assert.ok(schemaStart > 0, 'schema.sql must define report_roster_progression_decisions');
  const schemaBody = schema.slice(schemaStart);
  assert.ok(
    canonicalSql(schemaBody).startsWith(canonicalSql(migrationBody)),
    'schema.sql section must match migration 0022 (ignoring comments and the public. prefix)',
  );
});

test('migration 0022 is structure only: no backfill and no writes to existing records', () => {
  const executable = migration.replace(/--[^\n]*/g, '');
  assert.ok(!/\bINSERT\s+INTO\b/i.test(executable), 'no backfill in the foundation migration');
  assert.ok(!/\bDELETE\s+FROM\b/i.test(executable));
  for (const table of ['students', 'scores', 'attendance', 'class_records', 'report_roster_memberships', 'report_roster_membership_events', 'users', 'parent_wards']) {
    assert.ok(!new RegExp(`\\bUPDATE\\s+(public\\.)?${table}\\b`, 'i').test(executable), `must not UPDATE ${table}`);
    assert.ok(!new RegExp(`\\bALTER\\s+TABLE\\s+(public\\.)?${table}\\b`, 'i').test(executable), `must not ALTER ${table}`);
  }
});

// ── database behaviour (rolled back; the table is append-only by design) ─────

type Fixture = {
  schoolCode: string;
  otherSchoolCode: string;
  termId: number;
  otherTermId: number;
  studentId: string;
  otherSchoolStudentId: string;
};

const ADMIN = randomUUID();
const OTHER_ADMIN = randomUUID();
const TEACHER = randomUUID();

async function withFixture(run: (client: PoolClient, f: Fixture) => Promise<void>) {
  const client = await pool.connect();
  const suffix = randomUUID().slice(0, 12);
  try {
    await client.query('BEGIN');
    const schoolCode = `prog_${suffix}`;
    const otherSchoolCode = `prog_other_${suffix}`;
    await client.query('INSERT INTO schools(code,name) VALUES($1,$2),($3,$4)', [schoolCode, `Prog ${suffix}`, otherSchoolCode, `Prog Other ${suffix}`]);
    const term = await client.query(
      `INSERT INTO terms(name,academic_year,school_code,is_current) VALUES('1st Term','2026/2027',$1,true) RETURNING id`,
      [schoolCode],
    );
    const otherTerm = await client.query(
      `INSERT INTO terms(name,academic_year,school_code,is_current) VALUES('1st Term','2026/2027',$1,true) RETURNING id`,
      [otherSchoolCode],
    );
    const student = await client.query(
      `INSERT INTO students(school_code,admission_number,full_name,class_name) VALUES($1,$2,'Progression Student','Primary 4') RETURNING id`,
      [schoolCode, `P-${suffix}`],
    );
    const otherStudent = await client.query(
      `INSERT INTO students(school_code,admission_number,full_name,class_name) VALUES($1,$2,'Other School Student','Primary 4') RETURNING id`,
      [otherSchoolCode, `O-${suffix}`],
    );
    await run(client, {
      schoolCode,
      otherSchoolCode,
      termId: term.rows[0].id,
      otherTermId: otherTerm.rows[0].id,
      studentId: student.rows[0].id,
      otherSchoolStudentId: otherStudent.rows[0].id,
    });
  } finally {
    await client.query('ROLLBACK').catch(() => undefined);
    client.release();
  }
}

type Decision = Partial<{
  studentId: string; schoolCode: string; academicYear: string; termId: number; termName: string;
  type: string; from: string; to: string | null; by: string; role: string; reason: string | null;
  supersedes: number | null; status: string; source: string;
}>;

function insertDecision(client: PoolClient, f: Fixture, d: Decision = {}) {
  return client.query(
    `INSERT INTO report_roster_progression_decisions
       (student_id,school_code,academic_year,term_id,term_name,decision_type,from_class_name,to_class_name,
        decided_by,decided_by_role,reason,supersedes_decision_id,status,source)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
    [
      d.studentId ?? f.studentId,
      d.schoolCode ?? f.schoolCode,
      d.academicYear ?? '2026/2027',
      d.termId ?? f.termId,
      d.termName ?? '1st Term',
      d.type ?? 'promoted',
      d.from ?? 'Primary 4',
      d.to === undefined ? ((d.type ?? 'promoted') === 'promoted' ? 'Primary 5' : ((d.type ?? 'promoted') === 'retained' ? (d.from ?? 'Primary 4') : null)) : d.to,
      d.by ?? TEACHER,
      d.role ?? 'teacher',
      d.reason === undefined ? null : d.reason,
      d.supersedes ?? null,
      d.status ?? 'active',
      d.source ?? 'application',
    ],
  );
}

async function expectReject(client: PoolClient, sql: string, params: unknown[], code: string, label: string) {
  await client.query('SAVEPOINT expect_reject');
  await assert.rejects(
    () => client.query(sql, params),
    (err: any) => {
      assert.equal(err.code, code, `${label}: expected SQLSTATE ${code}, got ${err.code} (${err.message})`);
      return true;
    },
    label,
  );
  await client.query('ROLLBACK TO SAVEPOINT expect_reject');
}

async function expectInsertReject(client: PoolClient, f: Fixture, d: Decision, code: string, label: string) {
  await client.query('SAVEPOINT expect_insert_reject');
  await assert.rejects(
    () => insertDecision(client, f, d),
    (err: any) => {
      assert.equal(err.code, code, `${label}: expected SQLSTATE ${code}, got ${err.code} (${err.message})`);
      return true;
    },
    label,
  );
  await client.query('ROLLBACK TO SAVEPOINT expect_insert_reject');
}

function endDecision(client: PoolClient, id: number, status: 'superseded' | 'reversed', by = ADMIN, reason = 'Administrator correction') {
  return client.query(
    `UPDATE report_roster_progression_decisions
        SET status=$2, ended_at=now(), ended_by=$3, ended_by_role='admin', ended_reason=$4
      WHERE id=$1`,
    [id, status, by, reason],
  );
}

test('0022 applies to an already-current database idempotently and writes no rows', async () => {
  await withFixture(async (client, f) => {
    const before = await client.query(`SELECT md5(string_agg(s::text, '|' ORDER BY s.id)) AS h, count(*)::int AS n FROM students s WHERE school_code=$1`, [f.schoolCode]);
    await client.query(migration);
    await client.query(migration);
    const after = await client.query(`SELECT md5(string_agg(s::text, '|' ORDER BY s.id)) AS h, count(*)::int AS n FROM students s WHERE school_code=$1`, [f.schoolCode]);
    assert.deepEqual(after.rows[0], before.rows[0], 'students unchanged by the migration');
    const rows = await client.query('SELECT count(*)::int AS n FROM report_roster_progression_decisions');
    assert.equal(rows.rows[0].n, 0, 'foundation migration must not backfill any decision');
  });
});

test('only one active decision per student per academic year; a new year or an ended decision frees the slot', async () => {
  await withFixture(async (client, f) => {
    const first = await insertDecision(client, f, { type: 'promoted' });
    await expectInsertReject(client, f, { type: 'retained' }, '23505', 'second active decision, same year');
    await expectInsertReject(client, f, { type: 'removed' }, '23505', 'removal after promotion, same year');

    // A new academic year allows a new decision (needs a matching term).
    const nextTerm = await client.query(
      `INSERT INTO terms(name,academic_year,school_code) VALUES('1st Term','2027/2028',$1) RETURNING id`,
      [f.schoolCode],
    );
    await insertDecision(client, f, { academicYear: '2027/2028', termId: nextTerm.rows[0].id, type: 'retained', from: 'Primary 5' });

    // Reversing the first decision frees that year's slot for a fresh decision.
    await endDecision(client, first.rows[0].id, 'reversed');
    await insertDecision(client, f, { type: 'retained' });
    const active = await client.query(
      `SELECT count(*)::int AS n FROM report_roster_progression_decisions WHERE student_id=$1 AND academic_year='2026/2027' AND status='active'`,
      [f.studentId],
    );
    assert.equal(active.rows[0].n, 1);
    const history = await client.query(`SELECT count(*)::int AS n FROM report_roster_progression_decisions WHERE student_id=$1 AND academic_year='2026/2027'`, [f.studentId]);
    assert.equal(history.rows[0].n, 2, 'the reversed decision stays in history');
  });
});

test('decision shape is enforced by the database', async () => {
  await withFixture(async (client, f) => {
    await expectInsertReject(client, f, { type: 'promoted', to: 'Primary 4' }, '23514', 'promotion into the same class');
    await expectInsertReject(client, f, { type: 'promoted', to: null }, '23514', 'promotion without a destination');
    await expectInsertReject(client, f, { type: 'retained', to: 'Primary 5' }, '23514', 'retention into a different class');
    await expectInsertReject(client, f, { type: 'removed', to: 'Primary 5' }, '23514', 'removal with a destination');
    await expectInsertReject(client, f, { type: 'graduated' }, '23514', 'unknown decision type');
    await expectInsertReject(client, f, { academicYear: '  ' }, '23514', 'blank academic year');
    await expectInsertReject(client, f, { role: 'parent' }, '23514', 'non staff role');
    await expectInsertReject(client, f, { status: 'reversed' }, '23514', 'rows cannot be born ended');
    await insertDecision(client, f, { type: 'retained' });
  });
});

test('tenant isolation: decision must match the student school and the term school, year and name', async () => {
  await withFixture(async (client, f) => {
    await expectInsertReject(client, f, { schoolCode: f.otherSchoolCode, termId: f.otherTermId }, '23514', 'school differs from the student school');
    await expectInsertReject(client, f, { studentId: f.otherSchoolStudentId }, '23514', 'student belongs to another school');
    await expectInsertReject(client, f, { termId: f.otherTermId }, '23514', 'term belongs to another school');
    await expectInsertReject(client, f, { academicYear: '2025/2026' }, '23514', 'term academic year mismatch');
    await expectInsertReject(client, f, { termName: '2nd Term' }, '23514', 'term name mismatch');
    await expectInsertReject(client, f, { schoolCode: 'no_such_school' }, '23514', 'unknown school is rejected by the validator before the FK check');
  });
});

test('superseding is administrator-only, reasoned, linked and completed in the same transaction', async () => {
  await withFixture(async (client, f) => {
    const retained = await insertDecision(client, f, { type: 'retained' });
    const retainedId: number = retained.rows[0].id;

    // Superseding replacement must be an administrator with a reason.
    await endDecision(client, retainedId, 'superseded');
    await expectInsertReject(client, f, { type: 'promoted', supersedes: retainedId, role: 'teacher', by: ADMIN, reason: 'x' }, '23514', 'teacher cannot supersede');
    await expectInsertReject(client, f, { type: 'promoted', supersedes: retainedId, role: 'admin', by: ADMIN, reason: '  ' }, '23514', 'admin supersede needs a reason');
    await expectInsertReject(client, f, { type: 'promoted', supersedes: retainedId, role: 'admin', by: OTHER_ADMIN, reason: 'Override' }, '23514', 'must be the same admin who ended the old decision');
    await expectInsertReject(client, f, { type: 'promoted', supersedes: 999999999, role: 'admin', by: ADMIN, reason: 'Override' }, '23514', 'unknown superseded decision is rejected by the validator before the FK check');

    // Without its replacement, the end state fails when constraints are checked.
    await client.query('SAVEPOINT incomplete');
    await assert.rejects(() => client.query('SET CONSTRAINTS ALL IMMEDIATE'), (e: any) => e.code === '23514');
    await client.query('ROLLBACK TO SAVEPOINT incomplete');

    const replacement = await insertDecision(client, f, { type: 'promoted', supersedes: retainedId, role: 'admin', by: ADMIN, reason: 'Retention recorded in error; promoted by headteacher' });
    await client.query('SET CONSTRAINTS ALL IMMEDIATE');

    // One replacement per decision; the chain is queryable and nothing was erased.
    await expectInsertReject(client, f, { type: 'removed', supersedes: retainedId, role: 'admin', by: ADMIN, reason: 'Again' }, '23505', 'a decision can be superseded only once');
    const chain = await client.query(
      `SELECT id,status,decision_type,supersedes_decision_id,ended_by_role FROM report_roster_progression_decisions WHERE student_id=$1 ORDER BY id`,
      [f.studentId],
    );
    assert.equal(chain.rowCount, 2);
    assert.equal(chain.rows[0].status, 'superseded');
    assert.equal(chain.rows[0].decision_type, 'retained');
    assert.equal(chain.rows[0].ended_by_role, 'admin');
    assert.equal(chain.rows[1].id, replacement.rows[0].id);
    assert.equal(chain.rows[1].status, 'active');
    assert.equal(String(chain.rows[1].supersedes_decision_id), String(retainedId));
  });
});

test('reversal needs an administrator and a reason, and cannot coexist with a replacement', async () => {
  await withFixture(async (client, f) => {
    const decision = await insertDecision(client, f, { type: 'retained' });
    const id: number = decision.rows[0].id;
    const end = (sql: string) => expectReject(client, sql, [id], '23514', sql);

    await end(`UPDATE report_roster_progression_decisions SET status='reversed', ended_at=now(), ended_by='${ADMIN}', ended_by_role='teacher', ended_reason='x' WHERE id=$1`);
    await end(`UPDATE report_roster_progression_decisions SET status='reversed', ended_at=now(), ended_by='${ADMIN}', ended_by_role='admin', ended_reason='  ' WHERE id=$1`);
    await end(`UPDATE report_roster_progression_decisions SET status='reversed', ended_by='${ADMIN}', ended_by_role='admin', ended_reason='x' WHERE id=$1`);

    await endDecision(client, id, 'reversed');
    await client.query('SET CONSTRAINTS ALL IMMEDIATE');
    const ended = await client.query('SELECT status, ended_reason FROM report_roster_progression_decisions WHERE id=$1', [id]);
    assert.equal(ended.rows[0].status, 'reversed');
    assert.equal(ended.rows[0].ended_reason, 'Administrator correction');
  });
});

test('decision content is immutable, ended decisions are final, and rows cannot be deleted or truncated', async () => {
  await withFixture(async (client, f) => {
    const decision = await insertDecision(client, f, { type: 'promoted' });
    const id: number = decision.rows[0].id;

    for (const [column, value] of [
      ['decision_type', 'retained'], ['to_class_name', 'Primary 6'], ['decided_by', randomUUID()],
      ['academic_year', '2025/2026'], ['reason', 'edited'], ['student_id', f.otherSchoolStudentId],
    ] as const) {
      await expectReject(
        client,
        `UPDATE report_roster_progression_decisions SET ${column}=$2 WHERE id=$1`,
        [id, value],
        '42501',
        `immutable ${column}`,
      );
    }
    await expectReject(client, 'UPDATE report_roster_progression_decisions SET status=status WHERE id=$1', [id], '42501', 'no-op update that does not end the decision');
    await expectReject(client, 'DELETE FROM report_roster_progression_decisions WHERE id=$1', [id], '42501', 'delete');

    await endDecision(client, id, 'reversed');
    await expectReject(client, `UPDATE report_roster_progression_decisions SET ended_reason='rewritten' WHERE id=$1`, [id], '42501', 'ended decision is final');
    await expectReject(
      client,
      `UPDATE report_roster_progression_decisions SET status='active', ended_at=NULL, ended_by=NULL, ended_by_role=NULL, ended_reason=NULL WHERE id=$1`,
      [id],
      '42501',
      'ended decision cannot be reactivated',
    );
  });
});

test('students and roster history are RESTRICTed once a decision exists', async () => {
  await withFixture(async (client, f) => {
    await insertDecision(client, f, { type: 'retained' });
    await expectReject(client, 'DELETE FROM students WHERE id=$1', [f.studentId], '23503', 'student with decisions cannot be deleted');
    await expectReject(client, 'DELETE FROM terms WHERE id=$1', [f.termId], '23503', 'term with decisions cannot be deleted');
  });
});

test('decision rows can optionally reference at most one roster history event', async () => {
  await withFixture(async (client, f) => {
    const event = await client.query(
      `INSERT INTO report_roster_membership_events(student_id,event_type,from_class_name,to_class_name,actor_id)
       VALUES($1,'retained','Primary 4','Primary 4',$2) RETURNING id`,
      [f.studentId, TEACHER],
    );
    const second = await client.query(
      `INSERT INTO students(school_code,admission_number,full_name,class_name) VALUES($1,$2,'Second','Primary 4') RETURNING id`,
      [f.schoolCode, `S2-${randomUUID().slice(0, 8)}`],
    );
    const link = (studentId: string) => client.query(
      `INSERT INTO report_roster_progression_decisions
         (student_id,school_code,academic_year,term_id,term_name,decision_type,from_class_name,to_class_name,decided_by,decided_by_role,source,roster_event_id)
       VALUES($1,$2,'2026/2027',$3,'1st Term','retained','Primary 4','Primary 4',$4,'admin','historical_reconciliation',$5) RETURNING id`,
      [studentId, f.schoolCode, f.termId, ADMIN, event.rows[0].id],
    );
    await link(f.studentId);
    await client.query('SAVEPOINT dup_event');
    await assert.rejects(() => link(second.rows[0].id), (e: any) => e.code === '23505');
    await client.query('ROLLBACK TO SAVEPOINT dup_event');
  });
});

test('TRUNCATE is rejected by the append-only trigger', async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await assert.rejects(
      () => client.query('TRUNCATE report_roster_progression_decisions'),
      (err: any) => {
        assert.equal(err.code, '42501');
        return true;
      },
    );
  } finally {
    await client.query('ROLLBACK').catch(() => undefined);
    client.release();
  }
});
