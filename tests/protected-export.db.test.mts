import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const url=process.env.TOPIC_ASSETS_TEST_DATABASE_URL;
if(!url) test('protected export PostgreSQL round trip',{skip:'explicit disposable local DB required'},()=>{});
else {
 assert.ok(['127.0.0.1','localhost','[::1]'].includes(new URL(url).hostname));
 process.env.DATABASE_URL=url;process.env.NODE_ENV='development';
 const {pool,query}=await import('../backend/src/db/pool.js');
 const root=path.resolve(import.meta.dirname,'..');const school='zz_protected_export';
 test('read-only export preserves full curriculum values, excludes JSS3 and does not alter rows',async()=>{
  try {
   await query(readFileSync(path.join(root,'backend/schema.sql'),'utf8'));
   await query('INSERT INTO schools(code,name) VALUES($1,$2)',[school,'Disposable export test']);
   const s=(await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id',[school,'Mathematics'])).rows[0].id;
   const body='Line one\nLine two\r\n"quoted" \\ literal / ẹ / ½';
   for (const cls of ['Primary 1','JSS 1','JSS 3']) await query('INSERT INTO topics(school_code,subject_id,class_name,term_label,title,description,source_reference,source_file,order_index) VALUES($1,$2,$3,$4,$5,NULL,$6,$7,1)',[school,s,cls,'1st Term','Export fixture',body,'original.docx']);
   const before=(await query('SELECT * FROM topics WHERE school_code=$1 ORDER BY id',[school])).rows;
   const run=spawnSync('psql',[url,'-X','-qAt','--set','ON_ERROR_STOP=1','--file',path.join(root,'scripts/jss3/export_protected_curriculum.sql')],{encoding:'utf8'});
   assert.equal(run.status,0,run.stderr);
   const rows=JSON.parse(run.stdout).filter((r:any)=>r.school_code===school);
   assert.deepEqual(rows.map((r:any)=>r.class_name).sort(),['JSS 1','Primary 1']);
   for(const r of rows){assert.equal(r.source_reference,body);assert.equal(r.description,null);assert.equal(r.source_file,'original.docx');assert.equal(r.subject_name,'Mathematics');assert.ok(before.some((b:any)=>b.id===r.id));assert.ok(!('generated_assessment_id' in r));}
   assert.deepEqual((await query('SELECT * FROM topics WHERE school_code=$1 ORDER BY id',[school])).rows,before);
  } finally {
   await query('DELETE FROM topics WHERE school_code=$1',[school]);await query('DELETE FROM subjects WHERE school_code=$1',[school]);await query('DELETE FROM schools WHERE code=$1',[school]);await pool.end();
  }
 });
}
