import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import { checkTeacherStudentScope, checkTermSchoolScope } from '../backend/src/utils/scope.js';
import type { AuthUser } from '../backend/src/types/index.js';

const unique = () => randomInt(100_000_000, 999_999_999).toString();

after(async () => {
  await pool.end();
});

test('student writes reject a term belonging to another school for teachers and administrators', async () => {
  const year = `BSEC9/${unique()}`;
  const admission = `BSEC9-STUDENT-${unique()}`;
  let studentId: string | undefined;
  let primaryTermId: number | undefined;
  let secondaryTermId: number | undefined;

  const teacher: AuthUser = {
    id: 'bsec9-teacher',
    username: 'bsec9-teacher',
    role: 'teacher',
    school_code: 'primary',
    assigned_class: 'Primary 4',
    assigned_subject_ids: [],
  };
  const admin: AuthUser = {
    id: 'bsec9-admin',
    username: 'bsec9-admin',
    role: 'admin',
    school_code: null,
    assigned_class: null,
    assigned_subject_ids: [],
  };

  try {
    const { rows: students } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,$2,'primary',$3) RETURNING id`,
      ['BSEC9 Scope Student', 'Primary 4', admission],
    );
    studentId = students[0].id;

    const { rows: primaryTerms } = await query(
      `INSERT INTO terms(name,academic_year,school_code)
       VALUES('1st Term',$1,'primary') RETURNING id`,
      [year],
    );
    primaryTermId = primaryTerms[0].id;

    const { rows: secondaryTerms } = await query(
      `INSERT INTO terms(name,academic_year,school_code)
       VALUES('1st Term',$1,'secondary') RETURNING id`,
      [year],
    );
    secondaryTermId = secondaryTerms[0].id;

    const teacherMismatch = await checkTeacherStudentScope(teacher, studentId, secondaryTermId);
    assert.deepEqual(teacherMismatch, {
      status: 400,
      error: 'The selected term belongs to a different school than the student.',
    });

    const adminMismatch = await checkTeacherStudentScope(admin, studentId, secondaryTermId);
    assert.deepEqual(adminMismatch, teacherMismatch, 'global admin access must not permit cross-school term references');

    assert.equal(await checkTeacherStudentScope(teacher, studentId, primaryTermId), null);
    assert.equal(await checkTeacherStudentScope(admin, studentId, primaryTermId), null);
  } finally {
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    if (primaryTermId) await query('DELETE FROM terms WHERE id=$1', [primaryTermId]);
    if (secondaryTermId) await query('DELETE FROM terms WHERE id=$1', [secondaryTermId]);
  }
});

test('term scope rejects nonexistent and invalid term identifiers', async () => {
  assert.deepEqual(await checkTermSchoolScope('primary', 0), {
    status: 400,
    error: 'A valid term_id is required',
  });
  assert.deepEqual(await checkTermSchoolScope('primary', 2_147_483_647), {
    status: 404,
    error: 'Term not found',
  });
  assert.deepEqual(await checkTermSchoolScope(null, 1), {
    status: 400,
    error: 'A school is required to validate this term',
  });
});
