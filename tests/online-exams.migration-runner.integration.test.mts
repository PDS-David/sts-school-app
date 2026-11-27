import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require=createRequire(new URL('../backend/package.json',import.meta.url));
const {Client}=require('pg');
const connectionString=process.env.TEST_DATABASE_URL;
const backendDirectory=fileURLToPath(new URL('../backend/',import.meta.url));

// The runner must apply the COMPLETE numbered sequence. The expected versions come from
// backend/migrations itself, so a newly added migration cannot silently leave this fixture
// behind again (it previously stopped at 0018 and missed 0019 PIN/session tables and 0020).
const expectedVersions=readdirSync(new URL('../backend/migrations/',import.meta.url))
  .map((file)=>/^(\d{4})_.+\.sql$/.exec(file)?.[1])
  .filter((version):version is string=>Boolean(version))
  .sort();

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
    assert.match(incrementalOutput,/Applied 0018 0018_online_exam_submission_claim_fence\.sql/);
    assert.match(incrementalOutput,/Applied 0019 0019_pin_auth_sessions\.sql/);
    assert.match(incrementalOutput,/Applied 0020 0020_pin_gate_only_for_admin_issued_credentials\.sql/);

    verifier=new Client({connectionString:target.toString()});
    await verifier.connect();
    const {rows}=await verifier.query('SELECT version,name FROM public.schema_migrations ORDER BY version');
    assert.ok(expectedVersions.length>=20&&expectedVersions[0]==='0001'&&expectedVersions.at(-1)!>='0020','the numbered sequence now includes 0019 and 0020');
    assert.deepEqual(rows.map((row:any)=>row.version),expectedVersions);
    assert.equal(rows.find((row:any)=>row.version==='0013')?.name,'0013_ai_class_practice.sql');
    assert.equal(rows.find((row:any)=>row.version==='0014')?.name,'0014_formal_online_examinations.sql');
    assert.equal(rows.find((row:any)=>row.version==='0019')?.name,'0019_pin_auth_sessions.sql');
    assert.equal(rows.find((row:any)=>row.version==='0020')?.name,'0020_pin_gate_only_for_admin_issued_credentials.sql');
    const {rows:objects}=await verifier.query(`
      SELECT to_regclass('public.class_practice_sets') AS practice,
             to_regclass('public.online_exams') AS exams,
             to_regclass('public.online_exam_responses') AS responses,
             to_regclass('public.question_bank_question_reviews') AS reviews,
             to_regclass('public.teacher_class_subjects') AS teacher_subject_grants
    `);
    assert.ok(objects[0].practice&&objects[0].exams&&objects[0].responses&&objects[0].reviews&&objects[0].teacher_subject_grants);
    const {rows:claimColumns}=await verifier.query(`
      SELECT column_name FROM information_schema.columns
       WHERE table_schema='public' AND table_name='online_exam_attempts'
         AND column_name='submission_claim_token'
    `);
    assert.deepEqual(claimColumns.map((row:any)=>row.column_name),['submission_claim_token']);
    const {rows:columns}=await verifier.query(`
      SELECT column_name FROM information_schema.columns
       WHERE table_schema='public' AND table_name='online_exam_responses'
         AND column_name IN ('marking_confidence','marking_details')
    `);
    assert.deepEqual(columns.map((row:any)=>row.column_name).sort(),['marking_confidence','marking_details']);

    // Authentication objects that requireAuth now depends on (0019).
    const {rows:authObjects}=await verifier.query(`
      SELECT to_regclass('public.auth_sessions') AS sessions,
             to_regclass('public.auth_login_lanes') AS lanes,
             to_regclass('public.auth_login_attempts') AS attempts
    `);
    assert.ok(authObjects[0].sessions&&authObjects[0].lanes&&authObjects[0].attempts,'0019 authentication tables exist');
    const {rows:pinColumns}=await verifier.query(`
      SELECT column_name FROM information_schema.columns
       WHERE table_schema='public' AND table_name='users'
         AND column_name IN ('must_set_pin','must_change_pw','pin_hash_version','pin_set_at')
    `);
    assert.deepEqual(pinColumns.map((row:any)=>row.column_name).sort(),['must_change_pw','must_set_pin','pin_hash_version','pin_set_at']);
    const {rows:trigger}=await verifier.query(`SELECT tgname FROM pg_trigger WHERE tgname='users_enforce_pin_state_trg' AND NOT tgisinternal`);
    assert.equal(trigger.length,1,'0019 credential-write trigger is installed');
  }finally{
    if(verifier) await verifier.end();
    if(created){
      await admin.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1 AND pid<>pg_backend_pid()',[databaseName]);
      await admin.query('DROP DATABASE IF EXISTS "'+databaseName+'" WITH (FORCE)');
    }
    await admin.end();
  }
});
