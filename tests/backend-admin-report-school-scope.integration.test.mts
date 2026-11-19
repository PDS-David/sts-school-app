import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import scoresRouter from '../backend/src/routes/scores.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

test('school-bound administrators cannot widen score listings, marking overview, or individual reports', async () => {
  const suffix = randomUUID();
  const username = `bsec21-school-admin-${suffix}`;
  const admission = `BSEC21-${suffix}`;
  let adminId: string | undefined;
  let studentId: string | undefined;
  let server: Server | undefined;

  try {
    const { rows: users } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','admin','BSEC21 Primary Administrator','primary',TRUE,FALSE)
       RETURNING id`,
      [username],
    );
    adminId = String(users[0].id);
    const token = signAccess({
      id: adminId,
      username,
      role: 'admin',
      school_code: 'primary',
      assigned_class: null,
      assigned_subject_ids: [],
    });

    const { rows: students } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,'JSS 1','secondary',$2) RETURNING id`,
      [`BSEC21 Foreign Student ${suffix}`, admission],
    );
    studentId = String(students[0].id);
    await query(
      `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
       VALUES($1,'JSS 1','JSS 1','active')`,
      [studentId],
    );

    const app = express();
    app.use(express.json());
    app.use('/scores', scoresRouter);
    app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    });
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => {
      server!.once('listening', resolve);
      server!.once('error', reject);
    });
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/scores`;
    const get = (path: string) => fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const foreignListing = await get('/?school_code=secondary');
    assert.equal(foreignListing.status, 403,
      'school-bound administrators cannot override their assigned school on score listings');

    const foreignOverview = await get('/teacher/overview?school_code=secondary');
    assert.equal(foreignOverview.status, 403,
      'school-bound administrators cannot request marking aggregates for another school');

    const foreignTermReport = await get(`/report/${studentId}`);
    assert.equal(foreignTermReport.status, 404,
      'school-bound administrators cannot retrieve an individual report from another school');

    const foreignSessionReport = await get(`/session-report/${studentId}`);
    assert.equal(foreignSessionReport.status, 404,
      'school-bound administrators cannot retrieve a session report from another school');

    const ownListing = await get('/?school_code=primary');
    assert.equal(ownListing.status, 200,
      'school-bound administrators retain access to score listings in their own school');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (studentId) {
      await query('DELETE FROM report_roster_membership_events WHERE student_id=$1', [studentId]);
      await query('DELETE FROM report_roster_memberships WHERE student_id=$1', [studentId]);
      await query('DELETE FROM students WHERE id=$1', [studentId]);
    }
    if (adminId) await query('DELETE FROM users WHERE id=$1', [adminId]);
  }
});
