import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import { createStudentWithParent } from '../backend/src/utils/parentProvisioning.ts';

const unique = () => randomInt(100_000_000, 999_999_999).toString();
const makePhone = () => `080${unique().slice(0, 8)}`;
const suffixOf = (phone: string) => phone.replace(/\D/g, '').slice(-10);

after(async () => {
  await pool.end();
});

test('concurrent cross-school student creation reuses one parent account and links both wards', async () => {
  const phone = makePhone();
  const suffix = suffixOf(phone);
  const admissions = [`BSEC2-A-${unique()}`, `BSEC2-B-${unique()}`];

  try {
    const [primary, secondary] = await Promise.all([
      createStudentWithParent(
        { full_name: 'Atomicity Test Primary', class_name: 'Primary 1', school_code: 'primary', admission_number: admissions[0] },
        { school_code: 'primary', parent_name: 'Atomicity Parent', parent_phone: phone },
      ),
      createStudentWithParent(
        { full_name: 'Atomicity Test Secondary', class_name: 'JSS 1', school_code: 'secondary', admission_number: admissions[1] },
        { school_code: 'secondary', parent_name: 'Atomicity Parent', parent_phone: `+234${phone.slice(1)}` },
      ),
    ]);

    assert.ok(primary.parent);
    assert.ok(secondary.parent);
    assert.equal(primary.parent.id, secondary.parent.id);
    assert.equal([primary.parent.created, secondary.parent.created].filter(Boolean).length, 1);
    assert.equal([primary.parent.temporary_password, secondary.parent.temporary_password].filter(Boolean).length, 1);

    const { rows: parents } = await query(
      `SELECT id FROM users
       WHERE role='parent' AND RIGHT(regexp_replace(phone, '\\D', '', 'g'), 10)=$1`,
      [suffix],
    );
    assert.equal(parents.length, 1);

    const studentIds = [String(primary.student.id), String(secondary.student.id)];
    const { rows: links } = await query(
      'SELECT student_id FROM parent_wards WHERE parent_id=$1 AND student_id=ANY($2::uuid[])',
      [primary.parent.id, studentIds],
    );
    assert.equal(links.length, 2);
  } finally {
    await query('DELETE FROM students WHERE admission_number=ANY($1::text[])', [admissions]);
    await query(
      `DELETE FROM users
       WHERE role='parent' AND RIGHT(regexp_replace(phone, '\\D', '', 'g'), 10)=$1`,
      [suffix],
    );
  }
});

test('a parent insert failure rolls back the student row in the same transaction', async () => {
  const phone = makePhone();
  const suffix = suffixOf(phone);
  const admission = `BSEC2-ROLLBACK-${unique()}`;
  const collisionUsername = `bsec2-collision-${unique()}`;
  const collisionEmail = `bsec2-${unique()}@example.test`;

  try {
    await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,email)
       VALUES($1,'test-hash','student','Unique Email Holder','primary',$2)`,
      [collisionUsername, collisionEmail],
    );

    await assert.rejects(
      createStudentWithParent(
        { full_name: 'Atomicity Rollback Student', class_name: 'Primary 1', school_code: 'primary', admission_number: admission },
        { school_code: 'primary', parent_name: 'Rollback Parent', parent_phone: phone, parent_email: collisionEmail },
      ),
      (error: any) => error?.code === '23505',
    );

    const { rows: students } = await query(
      'SELECT id FROM students WHERE school_code=$1 AND admission_number=$2',
      ['primary', admission],
    );
    assert.equal(students.length, 0);

    const { rows: parents } = await query(
      `SELECT id FROM users
       WHERE role='parent' AND RIGHT(regexp_replace(phone, '\\D', '', 'g'), 10)=$1`,
      [suffix],
    );
    assert.equal(parents.length, 0);
  } finally {
    await query('DELETE FROM students WHERE admission_number=$1', [admission]);
    await query('DELETE FROM users WHERE username=$1 OR email=$2', [collisionUsername, collisionEmail]);
    await query(
      `DELETE FROM users
       WHERE role='parent' AND RIGHT(regexp_replace(phone, '\\D', '', 'g'), 10)=$1`,
      [suffix],
    );
  }
});
