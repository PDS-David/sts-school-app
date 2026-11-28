import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import academicRouter from '../backend/src/routes/academic.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => { await pool.end(); });

async function makeUser(role: 'teacher' | 'admin', schoolCode: string | null, assignedClass: string | null, classNames: string[] = []) {
  const username = `term-settings-${role}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,$6::text[],TRUE,FALSE) RETURNING id`,
    [username, role, `Term Settings ${role}`, schoolCode, assignedClass, classNames],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id, username, role, school_code: schoolCode, assigned_class: assignedClass,
      assigned_class_names: classNames, assigned_subject_ids: [],
    }),
  };
}

test('class teachers can update attendance term details but cannot edit academic term administration fields', async () => {
  const suffix = randomUUID();
  const year = `TERM-TEACHER/${suffix}`;
  const { rows: primaryTerms } = await query(
    `INSERT INTO terms(name,academic_year,school_code,days_opened,next_term_begins)
     VALUES('1st Term',$1,'primary',40,'Old date') RETURNING id`, [year]);
  const { rows: secondaryTerms } = await query(
    `INSERT INTO terms(name,academic_year,school_code,days_opened)
     VALUES('1st Term',$1,'secondary',40) RETURNING id`, [year]);
  const primaryTermId = Number(primaryTerms[0].id);
  const secondaryTermId = Number(secondaryTerms[0].id);
  const classTeacher = await makeUser('teacher','primary','Primary 4',['Primary 5']);
  const subjectTeacher = await makeUser('teacher','primary',null,['Primary 4']);
  const admin = await makeUser('admin','primary',null);
  let server: Server | undefined;

  try {
    const app = express();
    app.use(express.json());
    app.use('/academic', academicRouter);
    server = app.listen(0,'127.0.0.1');
    await new Promise<void>((resolve,reject)=>{ server!.once('listening',resolve); server!.once('error',reject); });
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/academic/terms`;
    const put = (termId:number, token:string, body:Record<string,unknown>) => fetch(`${base}/${termId}`,{
      method:'PUT',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(body),
    });

    const allowed = await put(primaryTermId,classTeacher.token,{days_opened:55,next_term_begins:'Monday, 12 January'});
    assert.equal(allowed.status,200);
    const allowedBody = await allowed.json() as {term:{days_opened:number;next_term_begins:string}};
    assert.equal(allowedBody.term.days_opened,55);
    assert.equal(allowedBody.term.next_term_begins,'Monday, 12 January');

    const forbiddenField = await put(primaryTermId,classTeacher.token,{is_current:true});
    assert.equal(forbiddenField.status,403,'teachers cannot change term activation or academic configuration');
    const crossSchool = await put(secondaryTermId,classTeacher.token,{days_opened:60});
    assert.equal(crossSchool.status,404,'teacher cannot update another school term');
    const subjectTeacherDenied = await put(primaryTermId,subjectTeacher.token,{days_opened:60});
    assert.equal(subjectTeacherDenied.status,403,'subject teachers cannot update class-teacher attendance settings');

    const adminUpdate = await put(primaryTermId,admin.token,{is_current:true,name:'2nd Term'});
    assert.equal(adminUpdate.status,200,'administrators retain existing term-management capability');
  } finally {
    if(server){server.closeAllConnections();await new Promise<void>(resolve=>server!.close(()=>resolve()));}
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])',[[classTeacher.id,subjectTeacher.id,admin.id]]);
    await query('DELETE FROM terms WHERE id=ANY($1::int[])',[[primaryTermId,secondaryTermId]]);
  }
});
