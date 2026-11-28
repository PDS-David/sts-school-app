import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import { saveAttendanceBulk } from '../backend/src/utils/attendanceWrites.ts';

const unique = () => randomInt(100_000_000, 999_999_999).toString();

after(async () => {
  await pool.end();
});

// saveAttendanceBulk now re-validates days_present against the term's current
// days_opened under a row lock (the HTTP route already enforced the same rule).
// The bootstrap term has days_opened=0, so these atomicity tests use their own
// disposable term with a realistic days_opened instead of mutating shared data.
async function createDisposableTerm(): Promise<number> {
  const { rows } = await query(
    `INSERT INTO terms(name,academic_year,school_code,days_opened)
     VALUES('1st Term',$1,'primary',100) RETURNING id`,
    [`BULK/${unique()}`.slice(0, 20)],
  );
  return rows[0].id;
}

async function createStudent(admissionNumber: string): Promise<string> {
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number)
     VALUES($1,'Primary 1','primary',$2) RETURNING id`,
    [`Attendance Atomicity ${admissionNumber}`, admissionNumber],
  );
  return rows[0].id;
}

test('a valid bulk attendance batch upserts every requested student', async () => {
  const termId = await createDisposableTerm();
  const admissions = [`BSEC4-A-${unique()}`, `BSEC4-B-${unique()}`];
  const studentIds: string[] = [];

  try {
    studentIds.push(await createStudent(admissions[0]));
    studentIds.push(await createStudent(admissions[1]));

    await saveAttendanceBulk([
      { student_id: studentIds[0], days_present: 12 },
      { student_id: studentIds[1], days_present: 9 },
    ], termId);

    const { rows } = await query(
      'SELECT student_id,days_present FROM attendance WHERE student_id=ANY($1::uuid[]) AND term_id=$2',
      [studentIds, termId],
    );
    assert.equal(rows.length, 2);
    assert.deepEqual(
      Object.fromEntries(rows.map((row: any) => [row.student_id, row.days_present])),
      { [studentIds[0]]: 12, [studentIds[1]]: 9 },
    );
  } finally {
    await query('DELETE FROM students WHERE admission_number=ANY($1::text[])', [admissions]);
    await query('DELETE FROM terms WHERE id=$1', [termId]);
  }
});

test('a later foreign-key failure rolls back earlier attendance writes in the batch', async () => {
  const termId = await createDisposableTerm();
  const admission = `BSEC4-ROLLBACK-${unique()}`;
  let studentId: string | undefined;

  try {
    studentId = await createStudent(admission);

    await assert.rejects(
      saveAttendanceBulk([
        { student_id: studentId, days_present: 11 },
        { student_id: '00000000-0000-0000-0000-000000000000', days_present: 7 },
      ], termId),
      (error: any) => error?.code === '23503',
    );

    const { rows } = await query(
      'SELECT id FROM attendance WHERE student_id=$1 AND term_id=$2',
      [studentId, termId],
    );
    assert.equal(rows.length, 0, 'the first row must be rolled back with the failed second row');
  } finally {
    await query('DELETE FROM students WHERE admission_number=$1', [admission]);
    await query('DELETE FROM terms WHERE id=$1', [termId]);
  }
});
