import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import { claimStudentAccount, registerSelfServiceAccount } from '../backend/src/utils/selfRegistration.ts';

const suffix = () => randomInt(100_000_000, 999_999_999).toString();
const admission = (label: string) => `BSEC8-${label}-${suffix()}`;
const phone = () => `080${suffix().slice(0, 8)}`;

after(async () => {
  await pool.end();
});

test('concurrent self-registration cannot create two student accounts for one admission', async () => {
  const admissionNumber = admission('STUDENT-RACE');
  const usernames = [`bsec8-student-a-${suffix()}`, `bsec8-student-b-${suffix()}`];
  let studentId: string | undefined;

  try {
    const { rows } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,$2,'primary',$3) RETURNING id`,
      ['BSEC8 Student Race', 'Primary 4', admissionNumber],
    );
    studentId = rows[0].id;

    const results = await Promise.all(usernames.map(username => registerSelfServiceAccount({
      role: 'student',
      fullName: 'BSEC8 Student Race',
      phone: '08000000000',
      schoolCode: 'primary',
      username,
      passwordHash: 'test-password-hash',
      admissionNumber,
    })));

    assert.equal(results.filter(result => result.kind === 'registered').length, 1);
    assert.equal(results.filter(result => result.kind === 'student_not_found').length, 1);

    const { rows: links } = await query(
      'SELECT user_id FROM students WHERE id=$1',
      [studentId],
    );
    assert.ok(links[0].user_id);

    const { rows: accounts } = await query(
      'SELECT id FROM users WHERE username=ANY($1::text[])',
      [usernames],
    );
    assert.equal(accounts.length, 1);
    assert.equal(accounts[0].id, links[0].user_id);
  } finally {
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    await query('DELETE FROM users WHERE username=ANY($1::text[])', [usernames]);
  }
});

test('concurrent parent self-registration with one normalized phone creates one account and one ward link', async () => {
  const admissionNumber = admission('PARENT-RACE');
  const localPhone = phone();
  const internationalPhone = `+234${localPhone.slice(1)}`;
  const usernames = [`bsec8-parent-a-${suffix()}`, `bsec8-parent-b-${suffix()}`];
  let studentId: string | undefined;

  try {
    const { rows } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,$2,'primary',$3) RETURNING id`,
      ['BSEC8 Parent Ward', 'Primary 2', admissionNumber],
    );
    studentId = rows[0].id;

    const results = await Promise.all(usernames.map((username, index) => registerSelfServiceAccount({
      role: 'parent',
      fullName: 'BSEC8 Parent',
      phone: index === 0 ? localPhone : internationalPhone,
      schoolCode: 'primary',
      username,
      passwordHash: 'test-password-hash',
      wardAdmissionNumber: admissionNumber,
    })));

    assert.equal(results.filter(result => result.kind === 'registered').length, 1);
    assert.equal(results.filter(result => result.kind === 'parent_phone_exists').length, 1);

    const { rows: parents } = await query(
      `SELECT id FROM users
       WHERE role='parent' AND right(regexp_replace(phone, '\\D', '', 'g'),10)=$1`,
      [localPhone.replace(/\D/g, '').slice(-10)],
    );
    assert.equal(parents.length, 1);

    const { rows: links } = await query(
      'SELECT parent_id FROM parent_wards WHERE student_id=$1',
      [studentId],
    );
    assert.deepEqual(links.map(row => row.parent_id), [parents[0].id]);
  } finally {
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    await query('DELETE FROM users WHERE username=ANY($1::text[])', [usernames]);
  }
});

test('concurrent class-code claims can link one student to only one account', async () => {
  const className = `BSEC8 Claim ${suffix()}`;
  const admissionNumber = admission('CLAIM-RACE');
  const accessCode = `claim-${suffix()}`;
  let studentId: string | undefined;
  let claimedUsername: string | undefined;
  let accessCodeId: number | undefined;

  try {
    const { rows: students } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,$2,'primary',$3) RETURNING id`,
      ['BSEC8 Claim Student', className, admissionNumber],
    );
    studentId = students[0].id;
    const { rows: codes } = await query(
      `INSERT INTO class_access_codes(school_code,class_name,code)
       VALUES('primary',$1,$2) RETURNING id`,
      [className, accessCode],
    );
    accessCodeId = codes[0].id;

    const results = await Promise.all([1, 2].map(() => claimStudentAccount({
      schoolCode: 'primary',
      className,
      studentId: studentId!,
      admissionNumber,
      accessCode,
      passwordHash: 'test-password-hash',
    })));

    assert.equal(results.filter(result => result.kind === 'claimed').length, 1);
    assert.equal(results.filter(result => result.kind === 'student_not_found').length, 1);
    const successfulClaim = results.find(result => result.kind === 'claimed');
    if (successfulClaim?.kind === 'claimed') claimedUsername = successfulClaim.username;

    const { rows: linked } = await query('SELECT user_id FROM students WHERE id=$1', [studentId]);
    assert.ok(linked[0].user_id);
    const { rows: accounts } = await query(
      `SELECT id FROM users WHERE id=$1`,
      [linked[0].user_id],
    );
    assert.equal(accounts.length, 1);
    assert.equal(accounts[0].id, linked[0].user_id);
  } finally {
    if (claimedUsername) await query('DELETE FROM users WHERE username=$1', [claimedUsername]);
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    if (accessCodeId) await query('DELETE FROM class_access_codes WHERE id=$1', [accessCodeId]);
  }
});

test('failed student-link write rolls back the newly inserted self-registration account', async () => {
  const admissionNumber = admission('ROLLBACK');
  const username = `bsec8-rollback-${suffix()}`;
  const triggerName = `bsec8_fail_link_${suffix()}`;
  const functionName = `bsec8_fail_link_fn_${suffix()}`;
  let studentId: string | undefined;

  try {
    const { rows } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,$2,'primary',$3) RETURNING id`,
      ['BSEC8 Rollback Student', 'Primary 3', admissionNumber],
    );
    studentId = rows[0].id;

    await query(`CREATE FUNCTION public.${functionName}() RETURNS trigger
      LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.id = '${studentId}'::uuid THEN
          RAISE EXCEPTION 'simulated student-link failure';
        END IF;
        RETURN NEW;
      END;
      $$`);
    await query(`CREATE TRIGGER ${triggerName}
      BEFORE UPDATE OF user_id ON public.students
      FOR EACH ROW EXECUTE FUNCTION public.${functionName}()`);

    await assert.rejects(registerSelfServiceAccount({
      role: 'student',
      fullName: 'BSEC8 Rollback Student',
      phone: '08000000000',
      schoolCode: 'primary',
      username,
      passwordHash: 'test-password-hash',
      admissionNumber,
    }), /simulated student-link failure/);

    const { rows: accounts } = await query('SELECT id FROM users WHERE username=$1', [username]);
    assert.equal(accounts.length, 0, 'account insert must roll back with the failed student link');
    const { rows: studentRows } = await query('SELECT user_id FROM students WHERE id=$1', [studentId]);
    assert.equal(studentRows[0].user_id, null);
  } finally {
    await query(`DROP TRIGGER IF EXISTS ${triggerName} ON public.students`);
    await query(`DROP FUNCTION IF EXISTS public.${functionName}()`);
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    await query('DELETE FROM users WHERE username=$1', [username]);
  }
});
