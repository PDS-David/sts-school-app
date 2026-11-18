import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

const require=createRequire(new URL('../backend/package.json',import.meta.url));
const pg=require('pg');
const connectionString=process.env.TEST_DATABASE_URL;

test('PostgreSQL 18 migrations and live API: rights approval, eligibility, ownership, timer, autosave, duplicate submit and physical-data isolation',
  {skip:!connectionString?'TEST_DATABASE_URL is not configured (dedicated disposable PostgreSQL database required).':false},
  async()=>{
    const client=new pg.Client({connectionString});
    await client.connect();
    const schema='exam_it_'+randomUUID().replace(/-/g,'');
    let server:any=null;
    let pool:any=null;
    try{
      await client.query('CREATE SCHEMA '+schema);
      await client.query('SET search_path TO '+schema);
      await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
      await client.query('CREATE TABLE schools(code TEXT PRIMARY KEY)');
      await client.query(`CREATE TABLE users(
        id UUID PRIMARY KEY,username TEXT,role TEXT,school_code TEXT,assigned_class TEXT,
        assigned_class_names TEXT[] DEFAULT '{}',can_manage_all_schools BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,access_expires_at TIMESTAMPTZ,revocation_reason TEXT,
        pending_admin_review BOOLEAN DEFAULT false)`);
      await client.query('CREATE TABLE students(id UUID PRIMARY KEY,user_id UUID,school_code TEXT,class_name TEXT,deleted_at TIMESTAMPTZ)');
      await client.query('CREATE TABLE teacher_subjects(user_id UUID,subject_id INTEGER)');
      await client.query('CREATE TABLE scores(id BIGINT PRIMARY KEY,score NUMERIC)');
      await client.query('CREATE TABLE attendance(id BIGINT PRIMARY KEY,present BOOLEAN)');
      await client.query('CREATE TABLE report_remarks(id BIGINT PRIMARY KEY,remark TEXT)');
      await client.query('CREATE TABLE report_cards(id BIGINT PRIMARY KEY,payload TEXT)');
      await client.query('CREATE TABLE report_roster_memberships(id BIGINT PRIMARY KEY,student_id UUID)');
      await client.query("INSERT INTO scores VALUES(1,72)");
      await client.query("INSERT INTO attendance VALUES(1,true)");
      await client.query("INSERT INTO report_remarks VALUES(1,'unchanged')");
      await client.query("INSERT INTO report_cards VALUES(1,'unchanged')");
      await client.query("INSERT INTO report_roster_memberships VALUES(1,'00000000-0000-4000-8000-000000000001')");

      const questionBankSql=await readFile(new URL('../backend/migrations/0012_online_question_bank.sql',import.meta.url),'utf8');
      const examSql=await readFile(new URL('../backend/migrations/0014_formal_online_examinations.sql',import.meta.url),'utf8');
      await client.query(questionBankSql);
      await client.query(examSql);

      const school='primary',admin=randomUUID(),studentUser=randomUUID(),otherUser=randomUUID();
      const student=randomUUID(),otherStudent=randomUUID();
      await client.query('INSERT INTO schools(code) VALUES($1)',[school]);
      await client.query(`INSERT INTO users(id,username,role,school_code,can_manage_all_schools,is_active) VALUES
        ($1,'test-admin','admin',$3,true,true),($2,'test-student','student',$3,false,true)`,[admin,studentUser,school]);
      await client.query('INSERT INTO users(id,username,role,school_code,is_active) VALUES($1,$2,$3,$4,true)',[otherUser,'other-student','student',school]);
      await client.query('INSERT INTO students(id,user_id,school_code,class_name) VALUES($1,$2,$3,$4),($5,$6,$3,$7)',
        [student,studentUser,school,'SS 3',otherStudent,otherUser,'JSS 3']);

      const {rows: subjectRows}=await client.query("SELECT id FROM question_bank_subjects WHERE code='MATHEMATICS'");
      const {rows: questionRows}=await client.query("SELECT id FROM question_bank_questions WHERE question_number='AI-GEN-001' AND board='WAEC'");
      assert.ok(subjectRows[0]);assert.ok(questionRows[0]);
      const questionId=questionRows[0].id;
      const dbUrl=new URL(connectionString);
      dbUrl.searchParams.set('options','-c search_path='+schema);
      process.env.DATABASE_URL=dbUrl.toString();
      process.env.JWT_SECRET='online-exam-integration-test-secret';
      process.env.JWT_REFRESH_SECRET='online-exam-integration-refresh-secret';
      process.env.FREE_LAUNCH_MODE='true';
      process.env.NODE_ENV='test';
      const express=require('express');
      const [{default:router},{signAccess},{pool:databasePool}]=await Promise.all([
        import('../backend/src/routes/onlineExams.ts'),
        import('../backend/src/utils/jwt.ts'),
        import('../backend/src/db/pool.ts')
      ]);
      pool=databasePool;
      const app=express();app.use(express.json());app.use('/online-exams',router);
      server=app.listen(0);
      await new Promise(resolve=>server.once('listening',resolve));
      const base='http://127.0.0.1:'+server.address().port;
      const token=(id:string,username:string,role='student')=>signAccess({id,username,role,school_code:school,assigned_class:null,assigned_class_names:[],can_manage_all_schools:role==='admin'});
      const studentToken=token(studentUser,'test-student');
      const otherToken=token(otherUser,'other-student');
      const adminToken=token(admin,'test-admin','admin');
      const request=async(path:string,method='GET',auth=studentToken,body?:any,schoolHeader?:string)=>{
        const response=await fetch(base+path,{method,headers:{...(auth?{Authorization:'Bearer '+auth}:{}),...(schoolHeader?{'x-school-code':schoolHeader}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
        return {status:response.status,data:await response.json()};
      };
      const examDraft={
        board:'WAEC',subject_name:'Mathematics',class_name:'SS 3',examination_type:'Mock',
        title:'SS3 Mathematics Mock',instructions:'Read each question carefully.',duration_minutes:30,
        starts_at:new Date(Date.now()-60000).toISOString(),ends_at:new Date(Date.now()+2*60*60*1000).toISOString(),
        sections:[{title:'Section A',instructions:'Answer the question.',questions:[{question_id:questionId,marks:2}]}]
      };

      assert.equal((await request('/online-exams/exams','GET','')).status,401);
      const rejectedPilot=await request('/online-exams/admin/exams','POST',adminToken,examDraft,school);
      assert.equal(rejectedPilot.status,400);
      await client.query("UPDATE question_bank_questions SET review_status='approved' WHERE id=$1",[questionId]);
      const created=await request('/online-exams/admin/exams','POST',adminToken,examDraft,school);
      assert.equal(created.status,201);
      const examId=created.data.exam.id;
      const published=await request('/online-exams/admin/exams/'+examId+'/publish','POST',adminToken,{},school);
      assert.equal(published.status,200);assert.equal(published.data.eligible_candidates,1);

      const otherList=await request('/online-exams/exams','GET',otherToken);
      assert.equal(otherList.status,200);assert.equal(otherList.data.exams.length,0);
      assert.equal((await request('/online-exams/exams/'+examId+'/start','POST',otherToken)).status,404);
      const list=await request('/online-exams/exams');
      assert.equal(list.status,200);assert.equal(list.data.exams.length,1);
      const started=await request('/online-exams/exams/'+examId+'/start','POST');
      assert.equal(started.status,200);
      assert.equal(started.data.questions.length,1);
      assert.equal(JSON.stringify(started.data).includes('correct_answer'),false);
      const attemptId=started.data.attempt.id;
      const resumed=await request('/online-exams/exams/'+examId+'/start','POST');
      assert.equal(resumed.status,200);assert.equal(resumed.data.attempt.id,attemptId);
      const foreignRead=await request('/online-exams/attempts/'+attemptId,'GET',otherToken);
      assert.equal(foreignRead.status,404);

      const onlineQuestionId=started.data.questions[0].id;
      const saved=await request('/online-exams/attempts/'+attemptId+'/responses/'+onlineQuestionId,'PUT',studentToken,{response:{key:'B'}});
      assert.equal(saved.status,200);assert.equal(saved.data.saved,true);
      const recovered=await request('/online-exams/attempts/'+attemptId);
      assert.equal(recovered.status,200);assert.equal(recovered.data.saved_responses.length,1);
      assert.deepEqual(recovered.data.saved_responses[0].response,{key:'B'});

      await client.query('UPDATE online_exam_attempts SET deadline_at=now()-interval \'1 second\' WHERE id=$1',[attemptId]);
      const lateSave=await request('/online-exams/attempts/'+attemptId+'/responses/'+onlineQuestionId,'PUT',studentToken,{response:{key:'A'}});
      assert.equal(lateSave.status,409);
      const submitted=await request('/online-exams/attempts/'+attemptId+'/submit','POST',studentToken,{confirm:true});
      assert.equal(submitted.status,200);assert.equal(submitted.data.status,'submitted');
      assert.equal(Number(submitted.data.score),2);
      const duplicate=await request('/online-exams/attempts/'+attemptId+'/submit','POST',studentToken,{confirm:true});
      assert.equal(duplicate.status,200);assert.equal(duplicate.data.already_submitted,true);
      const result=await request('/online-exams/attempts/'+attemptId+'/results');
      assert.equal(result.status,200);assert.equal(Number(result.data.attempt.score),2);
      const duplicateAttempts=await client.query('SELECT COUNT(*)::int AS n FROM online_exam_attempts WHERE exam_id=$1 AND student_id=$2',[examId,student]);
      assert.equal(duplicateAttempts.rows[0].n,1);

      const physical=await client.query(`SELECT (SELECT score FROM scores WHERE id=1) AS score,
        (SELECT present FROM attendance WHERE id=1) AS present,
        (SELECT remark FROM report_remarks WHERE id=1) AS remark,
        (SELECT payload FROM report_cards WHERE id=1) AS report_card,
        (SELECT COUNT(*)::int FROM report_roster_memberships) AS roster_count`);
      assert.equal(Number(physical.rows[0].score),72);
      assert.equal(physical.rows[0].present,true);
      assert.equal(physical.rows[0].remark,'unchanged');
      assert.equal(physical.rows[0].report_card,'unchanged');
      assert.equal(physical.rows[0].roster_count,1);
      const audit=await client.query('SELECT COUNT(*)::int AS n FROM online_exam_audit_events WHERE exam_id=$1',[examId]);
      assert.ok(audit.rows[0].n>=4);
    }finally{
      if(server) await new Promise(resolve=>server.close(resolve));
      if(pool) await pool.end();
      await client.query('RESET search_path');
      await client.query('DROP SCHEMA IF EXISTS '+schema+' CASCADE');
      await client.end();
    }
  });
