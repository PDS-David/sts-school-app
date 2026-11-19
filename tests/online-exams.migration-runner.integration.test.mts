import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require=createRequire(new URL('../backend/package.json',import.meta.url));
const {Client}=require('pg');
const connectionString=process.env.TEST_DATABASE_URL;
const backendDirectory=fileURLToPath(new URL('../backend/',import.meta.url));

test('production migration runner applies the complete PostgreSQL 18 sequence through formal examinations', {
  skip:!connectionString?'TEST_DATABASE_URL is not configured (disposable PostgreSQL database required).':false,
},async()=>{
  const admin=new Client({connectionString});
  await admin.connect();
  const databaseName='online_exam_migrations_'+randomUUID().replace(/-/g,'');
  let created=false;
  let verifier:any=null;
  try{
    await admin.query('CREATE DATABASE "'+databaseName+'"');
    created=true;
    const target=new URL(connectionString);
    target.pathname='/'+databaseName;
    target.searchParams.delete('options');
    target.searchParams.delete('search_path');
    const env={...process.env,DATABASE_URL:target.toString()};
    const run=(mode:string)=>execFileSync(process.execPath,['--import','tsx','src/db/migrate.ts',mode],{
      cwd:backendDirectory,env,encoding:'utf8',stdio:['ignore','pipe','pipe'],
    });
    const freshOutput=run('--fresh');
    assert.match(freshOutput,/Fresh schema applied and baseline migration stamped\./);
    const incrementalOutput=run('--all');
    assert.match(incrementalOutput,/Applied 0013 0013_ai_class_practice\.sql/);
    assert.match(incrementalOutput,/Applied 0014 0014_formal_online_examinations\.sql/);
    assert.match(incrementalOutput,/Applied 0015 0015_online_exam_marking_confidence\.sql/);
    assert.match(incrementalOutput,/Applied 0016 0016_question_bank_subject_reviews\.sql/);
    assert.match(incrementalOutput,/Applied 0017 0017_pilot_question_provenance_locators\.sql/);

    verifier=new Client({connectionString:target.toString()});
    await verifier.connect();
    const {rows}=await verifier.query('SELECT version,name FROM public.schema_migrations ORDER BY version');
    const expected=Array.from({length:17},(_,index)=>String(index+1).padStart(4,'0'));
    assert.deepEqual(rows.map((row:any)=>row.version),expected);
    assert.equal(rows.find((row:any)=>row.version==='0013')?.name,'0013_ai_class_practice.sql');
    assert.equal(rows.find((row:any)=>row.version==='0014')?.name,'0014_formal_online_examinations.sql');
    const {rows:objects}=await verifier.query(`
      SELECT to_regclass('public.class_practice_sets') AS practice,
             to_regclass('public.online_exams') AS exams,
             to_regclass('public.online_exam_responses') AS responses,
             to_regclass('public.question_bank_question_reviews') AS reviews
    `);
    assert.ok(objects[0].practice&&objects[0].exams&&objects[0].responses&&objects[0].reviews);
    const {rows:columns}=await verifier.query(`
      SELECT column_name FROM information_schema.columns
       WHERE table_schema='public' AND table_name='online_exam_responses'
         AND column_name IN ('marking_confidence','marking_details')
    `);
    assert.deepEqual(columns.map((row:any)=>row.column_name).sort(),['marking_confidence','marking_details']);
  }finally{
    if(verifier) await verifier.end();
    if(created){
      await admin.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1 AND pid<>pg_backend_pid()',[databaseName]);
      await admin.query('DROP DATABASE IF EXISTS "'+databaseName+'" WITH (FORCE)');
    }
    await admin.end();
  }
});
