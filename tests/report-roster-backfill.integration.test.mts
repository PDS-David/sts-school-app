import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import test, { after } from 'node:test';
import { pool } from '../backend/src/db/pool.js';

const migration = readFileSync(join(process.cwd(), 'backend/migrations/0005_report_roster_memberships.sql'), 'utf8');
const explicitEnrolment = readFileSync(join(process.cwd(), 'backend/migrations/0006_require_explicit_report_roster_enrolment.sql'), 'utf8');

after(async () => {
  await pool.end();
});

test('0005 provisional backfill is made inactive by 0006 until physical roster identity is confirmed', async () => {
  const client = await pool.connect();
  const suffix = randomUUID();
  const schoolCode = `roster_backfill_${suffix.slice(0, 12)}`;
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO schools(code,name) VALUES($1,$2)', [schoolCode, `Roster Backfill ${suffix}`]);
    const active = await client.query(
      `INSERT INTO students(school_code,admission_number,full_name,class_name)
       VALUES($1,$2,$3,'Primary 4') RETURNING id,user_id,class_name`,
      [schoolCode, `ACTIVE-${suffix}`, 'Backfill Active Student'],
    );
    const removed = await client.query(
      `INSERT INTO students(school_code,admission_number,full_name,class_name,deleted_at)
       VALUES($1,$2,$3,'Primary 5',now()) RETURNING id,user_id,class_name`,
      [schoolCode, `REMOVED-${suffix}`, 'Backfill Removed Student'],
    );

    await client.query(migration);
    await client.query(migration);
    await client.query(explicitEnrolment);
    await client.query(explicitEnrolment);

    const memberships = await client.query(
      `SELECT student_id,class_name,source_class_name,status,removed_at
       FROM report_roster_memberships WHERE student_id=ANY($1::uuid[])`,
      [[active.rows[0].id, removed.rows[0].id]],
    );
    assert.equal(memberships.rowCount, 2);
    const activeMembership = memberships.rows.find(row => row.student_id === active.rows[0].id);
    const removedMembership = memberships.rows.find(row => row.student_id === removed.rows[0].id);
    assert.equal(activeMembership?.class_name, 'Primary 4');
    assert.equal(activeMembership?.source_class_name, 'Primary 4');
    assert.equal(activeMembership?.status, 'removed', 'online-only student rows must not become active report-roster members');
    assert.ok(activeMembership?.removed_at);
    assert.equal(removedMembership?.class_name, 'Primary 5');
    assert.equal(removedMembership?.source_class_name, 'Primary 5');
    assert.equal(removedMembership?.status, 'removed');
    assert.ok(removedMembership?.removed_at);

    const events = await client.query(
      `SELECT student_id,event_type,to_class_name
       FROM report_roster_membership_events WHERE student_id=ANY($1::uuid[])`,
      [[active.rows[0].id, removed.rows[0].id]],
    );
    assert.equal(events.rowCount, 3, '0006 adds one reconciliation event and remains idempotent');
    assert.ok(events.rows.some(row => row.student_id === active.rows[0].id && row.event_type === 'enrolled'));
    assert.ok(events.rows.some(row => row.student_id === active.rows[0].id && row.event_type === 'removed'));
    assert.ok(events.rows.some(row => row.student_id === removed.rows[0].id && row.event_type === 'removed'));

    const students = await client.query(
      'SELECT id,user_id,class_name FROM students WHERE id=ANY($1::uuid[])',
      [[active.rows[0].id, removed.rows[0].id]],
    );
    const studentById = new Map(students.rows.map(row => [row.id, row]));
    assert.equal(studentById.get(active.rows[0].id)?.user_id, active.rows[0].user_id);
    assert.equal(studentById.get(active.rows[0].id)?.class_name, active.rows[0].class_name);
    assert.equal(studentById.get(removed.rows[0].id)?.user_id, removed.rows[0].user_id);
    assert.equal(studentById.get(removed.rows[0].id)?.class_name, removed.rows[0].class_name,
      'backfill must not rewrite the online student identity or class');
  } finally {
    await client.query('ROLLBACK');
    client.release();
  }
});
