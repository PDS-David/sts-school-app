import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import { saveAttendanceBulk } from '../backend/src/utils/attendanceWrites.ts';

const unique = () => randomInt(100_000_000, 999_999_999).toString();

after(async () => {
  await pool.end();
});

async function currentPrimaryTerm(): Promise<number> {
  const { rows } = await query(
    `SELECT id FROM terms
     WHERE school_code='primary' AND academic_year='2026/2027' AND name='1st Term'`,
  );
  assert.equal(rows.length, 1, 'bootstrap must create the primary first term');
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
  const termId = await currentPrimaryTerm();
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
  }
});

test('a later foreign-key failure rolls back earlier attendance writes in the batch', async () => {
  const termId = await currentPrimaryTerm();
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
  }
});
