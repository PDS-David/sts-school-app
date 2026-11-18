import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

const connectionString=process.env.TEST_DATABASE_URL;
test('PostgreSQL 18 formal-exam migration, attempt uniqueness, autosave and physical-data isolation',
  {skip:!connectionString?'TEST_DATABASE_URL is not configured (dedicated disposable PostgreSQL database required).':false},
  async()=>{
    const client=new pg.Client({connectionString});
    await client.connect();
    const schema='exam_it_'+randomUUID().replace(/-/g,'');
    try{
      await client.query('CREATE SCHEMA '+schema);
      await client.query('SET search_path TO '+schema);
      await client.query('CREATE TABLE schools(code TEXT PRIMARY KEY)');
      await client.query('CREATE TABLE users(id UUID PRIMARY KEY)');
      await client.query('CREATE TABLE students(id UUID PRIMARY KEY)');
      await client.query('CREATE TABLE question_bank_subjects(id BIGINT PRIMARY KEY)');
      await client.query('CREATE TABLE question_bank_questions(id UUID PRIMARY KEY)');
      await client.query('CREATE TABLE scores(id BIGINT PRIMARY KEY, score NUMERIC)');
      await client.query('CREATE TABLE attendance(id BIGINT PRIMARY KEY, present BOOLEAN)');
      await client.query('CREATE TABLE report_remarks(id BIGINT PRIMARY KEY, remark TEXT)');
      await client.query("INSERT INTO scores VALUES(1,72)");
      await client.query("INSERT INTO attendance VALUES(1,true)");
      await client.query("INSERT INTO report_remarks VALUES(1,'unchanged')");
      const sql=await readFile(new URL('../backend/migrations/0014_formal_online_examinations.sql',import.meta.url),'utf8');
      await client.query(sql);
      const school='TEST-SCHOOL',admin=randomUUID(),student=randomUUID(),subject=1,exam=randomUUID(),section=randomUUID(),question=randomUUID();
      await client.query('INSERT INTO schools(code) VALUES($1)',[school]);
      await client.query('INSERT INTO users(id) VALUES($1)',[admin]);
      await client.query('INSERT INTO students(id) VALUES($1)',[student]);
      await client.query('INSERT INTO question_bank_subjects(id) VALUES($1)',[subject]);
      await client.query(`INSERT INTO online_exams(id,school_code,subject_id,subject_name,class_name,board,examination_type,title,instructions,duration_minutes,starts_at,ends_at,created_by)
        VALUES($1,$2,$3,'Mathematics','SS 3','WAEC','Mock','Test exam','Read each question carefully.',30,now(),now()+interval '2 hours',$4)`,
        [exam,school,subject,admin]);
      await client.query('INSERT INTO online_exam_sections(id,exam_id,title,position) VALUES($1,$2,$3,0)',[section,exam,'Section A']);
      await client.query('INSERT INTO question_bank_questions(id) VALUES($1)',[question]);
      await client.query(`INSERT INTO online_exam_questions(exam_id,section_id,question_bank_question_id,position,marks,question_snapshot,provenance)
        VALUES($1,$2,$3,0,2,'{"stem":"Question?","question_type":"mcq"}','{"board":"WAEC","rights_status":"original_generated"}')`,
        [exam,section,question]);
      await client.query('INSERT INTO online_exam_candidates(exam_id,student_id,eligible_class) VALUES($1,$2,$3)',[exam,student,'SS 3']);
      const attempt=randomUUID();
      await client.query(`INSERT INTO online_exam_attempts(id,exam_id,student_id,deadline_at,total_marks)
        VALUES($1,$2,$3,LEAST(now()+interval '30 minutes',now()+interval '2 hours'),2)`,[attempt,exam,student]);
      await client.query(`INSERT INTO online_exam_responses(attempt_id,exam_question_id,response)
        SELECT $1,id,'"A"'::jsonb FROM online_exam_questions WHERE exam_id=$2
        ON CONFLICT(attempt_id,exam_question_id) DO UPDATE SET response=EXCLUDED.response,saved_at=now()`,[attempt,exam]);
      await client.query(`INSERT INTO online_exam_responses(attempt_id,exam_question_id,response)
        SELECT $1,id,'"B"'::jsonb FROM online_exam_questions WHERE exam_id=$2
        ON CONFLICT(attempt_id,exam_question_id) DO UPDATE SET response=EXCLUDED.response,saved_at=now()`,[attempt,exam]);
      const saved=await client.query('SELECT response FROM online_exam_responses WHERE attempt_id=$1',[attempt]);
      assert.equal(saved.rows.length,1);
      assert.equal(saved.rows[0].response,'B');
      await assert.rejects(
        client.query('INSERT INTO online_exam_attempts(exam_id,student_id,deadline_at,total_marks) VALUES($1,$2,now()+interval \'10 minutes\',2)',[exam,student]),
        (err:any)=>err.code==='23505'
      );
      const physical=await client.query(`SELECT (SELECT score FROM scores WHERE id=1) AS score,
        (SELECT present FROM attendance WHERE id=1) AS present,
        (SELECT remark FROM report_remarks WHERE id=1) AS remark`);
      assert.equal(Number(physical.rows[0].score),72);
      assert.equal(physical.rows[0].present,true);
      assert.equal(physical.rows[0].remark,'unchanged');
    }finally{
      await client.query('RESET search_path');
      await client.query('DROP SCHEMA IF EXISTS '+schema+' CASCADE');
      await client.end();
    }
  });
