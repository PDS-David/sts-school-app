import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require=createRequire(new URL('../backend/package.json',import.meta.url));
const pg=require('pg');
const connectionString=process.env.TEST_DATABASE_URL??process.env.DATABASE_URL;

test('class-practice API enforces ownership and serializes concurrent submissions without touching physical reports',
  {skip:!connectionString?'TEST_DATABASE_URL or DATABASE_URL is not configured.':false},
  async()=>{
    const client=new pg.Client({connectionString});
    await client.connect();
    const schema='class_practice_it_'+randomUUID().replace(/-/g,'');
    let server:any=null;
    let pool:any=null;
    let ownsPublicSettingsFixture=false;
    try{
      await client.query('CREATE SCHEMA '+schema);
      await client.query('SET search_path TO '+schema);
      await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
      const {rows:settingsFixture}=await client.query("SELECT to_regclass('public.learning_access_settings') AS existing");
      if(!settingsFixture[0].existing){
        await client.query('CREATE TABLE public.learning_access_settings(id INTEGER PRIMARY KEY,free_launch_mode BOOLEAN,term_pin_enforced BOOLEAN,curriculum_sequence_enforced BOOLEAN)');
        await client.query('INSERT INTO public.learning_access_settings VALUES(1,true,false,false)');
        ownsPublicSettingsFixture=true;
      }
      await client.query(`CREATE TABLE users(
        id UUID PRIMARY KEY,username TEXT,role TEXT,school_code TEXT,assigned_class TEXT,
        assigned_class_names TEXT[] DEFAULT '{}',can_manage_all_schools BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,access_expires_at TIMESTAMPTZ,revocation_reason TEXT,
        pending_admin_review BOOLEAN DEFAULT false)`);
      await client.query('CREATE TABLE students(id UUID PRIMARY KEY,user_id UUID,school_code TEXT,class_name TEXT,deleted_at TIMESTAMPTZ)');
      await client.query('CREATE TABLE teacher_subjects(user_id UUID,subject_id INTEGER)');
      await client.query('CREATE TABLE topics(id INTEGER PRIMARY KEY,title TEXT,subject_id INTEGER)');
      await client.query('CREATE TABLE subjects(id INTEGER PRIMARY KEY,name TEXT,school_code TEXT)');
      await client.query('CREATE TABLE terms(id INTEGER PRIMARY KEY,name TEXT,school_code TEXT)');
      await client.query('CREATE TABLE topic_completions(student_id UUID,topic_id INTEGER)');
      await client.query('CREATE TABLE scores(id BIGINT PRIMARY KEY,score NUMERIC)');
      await client.query('CREATE TABLE attendance(id BIGINT PRIMARY KEY,present BOOLEAN)');
      await client.query('CREATE TABLE report_remarks(id BIGINT PRIMARY KEY,remark TEXT)');
      await client.query('INSERT INTO scores VALUES(1,72)');
      await client.query('INSERT INTO attendance VALUES(1,true)');
      await client.query("INSERT INTO report_remarks VALUES(1,'unchanged')");
      const migration=await readFile(new URL('../backend/migrations/0013_ai_class_practice.sql',import.meta.url),'utf8');
      await client.query(migration);

      const school='secondary',studentUser=randomUUID(),otherUser=randomUUID(),student=randomUUID(),otherStudent=randomUUID(),topic=501;
      await client.query("INSERT INTO users(id,username,role,school_code,is_active) VALUES($1,'student-one','student',$3,true),($2,'student-two','student',$3,true)",[studentUser,otherUser,school]);
      await client.query("INSERT INTO students(id,user_id,school_code,class_name) VALUES($1,$2,$3,'SS 1'),($4,$5,$3,'SS 1')",[student,studentUser,school,otherStudent,otherUser]);
      await client.query("INSERT INTO subjects(id,name,school_code) VALUES(1,'Mathematics',$1)",[school]);
      await client.query("INSERT INTO topics(id,title,subject_id) VALUES($1,'Linear and spatial reasoning',1)",[topic]);

      const questions=(order:string[])=>order.map((concept,index)=>({id:'q'+index,concept,question:'Test '+concept,options:[{key:'A',text:'Yes'},{key:'B',text:'No'},{key:'C',text:'Maybe'},{key:'D',text:'None'}],correct_answer:'A',explanation:'Because the lesson establishes this result.',marks:1}));
      const insertSet=async(order:string[])=>{
        const {rows}=await client.query(`INSERT INTO class_practice_sets(student_id,topic_id,class_name,subject_name,term_label,topic_title,questions)
          VALUES($1,$2,'SS 1','Mathematics','First Term','Completed lesson',$3::jsonb) RETURNING id`,
          [student,topic,JSON.stringify(questions(order))]);
        return rows[0].id;
      };
      const first=await insertSet(['Algebra','Geometry']);
      const second=await insertSet(['Geometry','Algebra']);
      const duplicate=await insertSet(['Algebra','Geometry']);

      const dbUrl=new URL(connectionString);
      dbUrl.searchParams.set('options','-c search_path='+schema);
      process.env.DATABASE_URL=dbUrl.toString();
      process.env.JWT_SECRET='class-practice-integration-test-secret';
      process.env.JWT_REFRESH_SECRET='class-practice-integration-refresh-secret';
      process.env.FREE_LAUNCH_MODE='true';
      process.env.NODE_ENV='test';
      const express=require('express');
      const [{default:router},{signAccess},{pool:databasePool}]=await Promise.all([
        import('../backend/src/routes/classPractice.ts'),
        import('../backend/src/utils/jwt.ts'),
        import('../backend/src/db/pool.ts')
      ]);
      pool=databasePool;
      const app=express();app.use(express.json());app.use('/class-practice',router);
      server=app.listen(0);
      await new Promise(resolve=>server.once('listening',resolve));
      const base='http://127.0.0.1:'+server.address().port;
      const token=(id:string,username:string)=>signAccess({id,username,role:'student',school_code:school,assigned_class:'SS 1',assigned_class_names:[],can_manage_all_schools:false});
      const one=token(studentUser,'student-one'),two=token(otherUser,'student-two');
      const submit=async(setId:string,auth:string)=>{
        const response=await fetch(base+'/class-practice/sets/'+setId+'/submit',{
          method:'POST',headers:{Authorization:'Bearer '+auth,'Content-Type':'application/json'},
          body:JSON.stringify({answers:[{question_id:'q0',answer:'A'},{question_id:'q1',answer:'B'}]}),
          signal:AbortSignal.timeout(15000)
        });
        return {status:response.status,data:await response.json()};
      };

      const concurrent=await Promise.all([submit(first,one),submit(second,one)]);
      assert.deepEqual(concurrent.map(x=>x.status).sort(),[200,200]);
      const recovered=await fetch(base+'/class-practice/sets/'+first,{headers:{Authorization:'Bearer '+one},signal:AbortSignal.timeout(15000)});
      assert.equal(recovered.status,200);
      const recoveredBody=await recovered.json();
      assert.equal(recoveredBody.result.submitted,true);
      assert.equal(recoveredBody.result.results.length,2);
      assert.equal((await fetch(base+'/class-practice/sets/'+first,{headers:{Authorization:'Bearer '+two}})).status,404);
      const duplicates=await Promise.all([submit(duplicate,one),submit(duplicate,one)]);
      assert.deepEqual(duplicates.map(x=>x.status).sort(),[200,409]);
      assert.equal((await submit(first,two)).status,404);

      const {rows:attempts}=await client.query('SELECT COUNT(*)::int AS n FROM class_practice_attempts WHERE student_id=$1',[student]);
      assert.equal(attempts[0].n,6);
      const {rows:performance}=await client.query('SELECT concept,attempts,correct_attempts,accuracy FROM class_practice_concept_performance WHERE student_id=$1 ORDER BY concept',[student]);
      assert.deepEqual(performance.map((x:any)=>x.concept),['Algebra','Geometry']);
      assert.deepEqual(performance.map((x:any)=>[Number(x.attempts),Number(x.correct_attempts),Number(x.accuracy)]),[[3,2,2/3],[3,1,1/3]].map(x=>[x[0],x[1],Number(x[2].toFixed(4))]));
      const {rows:recommendations}=await client.query("SELECT COUNT(*)::int AS n FROM class_practice_remediation_recommendations WHERE student_id=$1 AND status='open'",[student]);
      assert.equal(recommendations[0].n,2);

      const {rows:physical}=await client.query('SELECT (SELECT score FROM scores WHERE id=1) AS score,(SELECT present FROM attendance WHERE id=1) AS present,(SELECT remark FROM report_remarks WHERE id=1) AS remark');
      assert.deepEqual(physical[0],{score:'72',present:true,remark:'unchanged'});
      const otherProgress=await fetch(base+'/class-practice/progress',{headers:{Authorization:'Bearer '+two},signal:AbortSignal.timeout(15000)});
      assert.equal(otherProgress.status,200);
      assert.deepEqual((await otherProgress.json()).concept_performance,[]);
    } finally {
      if(server) await new Promise<void>(resolve=>server.close(()=>resolve()));
      if(pool) await pool.end();
      await client.query('DROP SCHEMA IF EXISTS '+schema+' CASCADE');
      if(ownsPublicSettingsFixture)await client.query('DROP TABLE IF EXISTS public.learning_access_settings');
      await client.end();
    }
  });
