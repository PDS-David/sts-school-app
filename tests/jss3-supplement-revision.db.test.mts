// Real routes and SQL; standalone synthetic data, no private source capture required.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import {supplementReference} from '../backend/src/db/jss3SupplementReference.ts';
import {resolveDelivery,retireStaleJss3Cache} from '../backend/src/utils/jss3DeliveryCorrection.ts';
const db=process.env.JSS3_YO_TEST_DATABASE_URL;
if(!db){test('supplement revision database checks require JSS3_YO_TEST_DATABASE_URL',{skip:true},()=>{});}else{
 const u=new URL(db);assert.ok(['localhost','127.0.0.1','[::1]'].includes(u.hostname));assert.match(u.pathname,/^\/jss3_test_/);
 process.env.DATABASE_URL=db;process.env.NODE_ENV='development';process.env.TERM_PIN_ENFORCED='false';
 const prompts:string[]=[];
 const stub=http.createServer((req,res)=>{let b='';req.on('data',d=>b+=d);req.on('end',()=>{const p=String(JSON.parse(b).prompt);prompts.push(p);const n=/Draft 5 multiple/.test(p)?5:3;res.setHeader('content-type','application/json');res.end(JSON.stringify({text:JSON.stringify(Array.from({length:n},(_,i)=>({stem:`Q${i}?`,options:[{key:'A',text:'A'},{key:'B',text:'B'}],correct_keys:['A'],marks:1})))}));});});
 await new Promise<void>(r=>stub.listen(0,'127.0.0.1',r));process.env.AI_AGENT_SERVICE_URL=`http://127.0.0.1:${(stub.address() as AddressInfo).port}`;
 await import('express-async-errors');const {default:express}=await import('express');const {pool,query}=await import('../backend/src/db/pool.js');
 const {default:router}=await import('../backend/src/routes/learning.js');const {signAccess}=await import('../backend/src/utils/jwt.js');
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/jss3-ibeere-previous.json',import.meta.url),'utf8'));
 const ref=supplementReference(fixture.lesson),tag='zz_supp_revision_'+Date.now();
 let subject:number,student:string,user:string,admin:string,server:any,base:string,token:string,adminToken:string;
 const topics:number[]=[],assessments:string[]=[];
 const one=async(sql:string,args:any[]=[])=> (await query(sql,args)).rows[0];
 const api=async(method:string,p:string,body?:any)=>{const r=await fetch(base+'/learning'+p,{method,headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:r.status,body:await r.json() as any};};
 const make=async(source=ref)=>{
 const t=(await one(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,source_reference,summary) VALUES('secondary',$1,'JSS 3','1st Term',$2,$3,'STALE SUMMARY') RETURNING id`,[subject,fixture.lesson.title,source])).id;topics.push(t);
 const a=(await one(`INSERT INTO assessments(school_code,subject_id,class_name,title,total_marks,status) VALUES('secondary',$1,'JSS 3',$2,1,'open') RETURNING id`,[subject,tag])).id;assessments.push(a);
 await query('UPDATE topics SET generated_assessment_id=$1 WHERE id=$2',[a,t]);return {t,a};};
 before(async()=>{
 await query(readFileSync(new URL('../backend/schema.sql',import.meta.url),'utf8'));
 subject=(await one(`INSERT INTO subjects(school_code,name) VALUES('secondary','Yoruba') RETURNING id`)).id;
 user=(await one(`INSERT INTO users(username,password_hash,role,school_code,full_name) VALUES($1,'x','student','secondary',$1) RETURNING id`,[tag])).id;
 student=(await one(`INSERT INTO students(school_code,admission_number,full_name,class_name,user_id) VALUES('secondary',$1,$1,'JSS 3',$2) RETURNING id`,[tag,user])).id;
 token=signAccess({id:user,username:tag,role:'student',school_code:'secondary',assigned_class:null,assigned_subject_ids:[]});
 admin=(await one(`INSERT INTO users(username,password_hash,role,school_code,full_name) VALUES($1,'x','admin','secondary',$1) RETURNING id`,[tag+'_adm'])).id;
 adminToken=signAccess({id:admin,username:tag+'_adm',role:'admin',school_code:'secondary',assigned_class:null,assigned_subject_ids:[]});
 const app=express();app.use(express.json());app.use('/learning',router);server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base=`http://127.0.0.1:${(server.address() as AddressInfo).port}`;
 });
 after(async()=>{
 if(server)await new Promise<void>(r=>server.close(()=>r()));await new Promise<void>(r=>stub.close(()=>r()));
 if(student){await query('DELETE FROM submissions WHERE student_id=$1',[student]);await query('DELETE FROM topic_completions WHERE student_id=$1',[student]);}
 await query('DELETE FROM topics WHERE id=ANY($1)',[topics]);if(subject){await query('DELETE FROM assessments WHERE subject_id=$1',[subject]);await query('DELETE FROM questions WHERE subject_id=$1',[subject]);}
 if(student)await query('DELETE FROM students WHERE id=$1',[student]);if(user)await query('DELETE FROM users WHERE id=$1',[user]);if(admin)await query('DELETE FROM users WHERE id=$1',[admin]);if(subject)await query('DELETE FROM subjects WHERE id=$1',[subject]);await pool.end();
 });
 test('old stored supplement serves current notes; stale direct assessment access and submissions blocked; history retained',async()=>{
 const {t,a}=await make();await query('INSERT INTO topic_completions(topic_id,student_id,passed,score_percent) VALUES($1,$2,true,100)',[t,student]);
 const sub=(await one('INSERT INTO submissions(assessment_id,student_id,total_score) VALUES($1,$2,1) RETURNING id',[a,student])).id;
 const list=await api('GET','/topics?class_name=JSS%203');assert.equal(list.status,200);const shown=list.body.topics.find((x:any)=>x.id===t);assert.match(shown.summary,/JSS3 SUPPLEMENT UPDATE/);assert.equal(shown.generated_assessment_id,null);
 assert.equal((await api('GET',`/assessments/${a}/questions`)).status,403); // first cache mutation via direct read
 assert.equal((await api('POST',`/assessments/${a}/submit`,{answers:{}})).status,403); // after unlink: route status guard
 const row=await one('SELECT source_reference,summary,generated_assessment_id FROM topics WHERE id=$1',[t]);assert.equal(row.source_reference,ref);assert.match(row.summary,/JSS3 SUPPLEMENT UPDATE/);assert.equal(row.generated_assessment_id,null);
 assert.equal((await one('SELECT status FROM assessments WHERE id=$1',[a])).status,'closed');assert.equal((await one('SELECT passed FROM topic_completions WHERE topic_id=$1 AND student_id=$2',[t,student])).passed,true);assert.ok(await one('SELECT id FROM submissions WHERE id=$1',[sub]));
 const r=resolveDelivery({...row,school_code:'secondary',class_name:'JSS 3',subject_name:'Yoruba',term_label:'1st Term',title:fixture.lesson.title})!;assert.deepEqual(await retireStaleJss3Cache(query,t,r),{retired:false,closedAssessments:0});
 });
 test('first contact by submission refuses stale open assessment without adding a submission',async()=>{
 const {t,a}=await make();assert.equal((await api('POST',`/assessments/${a}/submit`,{answers:{}})).status,403);assert.equal((await one('SELECT count(*)::int n FROM submissions WHERE assessment_id=$1',[a])).n,0);assert.equal((await one('SELECT generated_assessment_id FROM topics WHERE id=$1',[t])).generated_assessment_id,null);
 });
 test('completion uses current text for AI and unknown stored bytes are withheld without AI',async()=>{
 const {t}=await make();prompts.length=0;const done=await api('POST',`/topics/${t}/complete`);assert.equal(done.status,200);assert.match(done.body.summary,/JSS3 SUPPLEMENT UPDATE/);assert.ok(prompts.length>=2);for(const p of prompts)assert.match(p,/JSS3 SUPPLEMENT UPDATE/);
 const unknown=await make('unreviewed edited text');prompts.length=0;const held=await api('POST',`/topics/${unknown.t}/complete`);assert.equal(held.status,200);assert.equal(held.body.delivery_correction.status,'withheld');assert.equal(prompts.length,0);
 });
 test('real SQL transaction rollback preserves prior cache/assessment state on failure',async()=>{
 const {t,a}=await make();const c=await pool.connect();try{await c.query('BEGIN');const r=resolveDelivery({school_code:'secondary',class_name:'JSS 3',subject_name:'Yoruba',term_label:'1st Term',title:fixture.lesson.title,source_reference:ref})!;await retireStaleJss3Cache((sql,args)=>c.query(sql,args),t,r);await assert.rejects(c.query('SELECT 1/0'));await c.query('ROLLBACK');}finally{c.release();}
 assert.equal((await one('SELECT summary FROM topics WHERE id=$1',[t])).summary,'STALE SUMMARY');assert.equal((await one('SELECT status FROM assessments WHERE id=$1',[a])).status,'open');
 });

 test('teacher/admin topic update response never returns stale or unreviewed stored text',async()=>{
  const put=async(id:number)=>{const r=await fetch(base+'/learning/topics/'+id,{method:'PUT',headers:{authorization:`Bearer ${adminToken}`,'content-type':'application/json'},body:JSON.stringify({description:'edited description'})});return {status:r.status,body:await r.json() as any};};
  const {t,a}=await make();const ok=await put(t);assert.equal(ok.status,200);
  assert.match(ok.body.topic.summary,/JSS3 SUPPLEMENT UPDATE/);assert.equal(ok.body.topic.generated_assessment_id,null);assert.equal(ok.body.topic.description,'edited description');assert.ok(!('subject_name' in ok.body.topic));
  assert.equal((await one('SELECT source_reference FROM topics WHERE id=$1',[t])).source_reference,ref); // stored source untouched
  assert.equal((await one('SELECT status FROM assessments WHERE id=$1',[a])).status,'open'); // a response guard does not itself mutate the cache
  const unknown=await make('unreviewed edited text');const held=await put(unknown.t);assert.equal(held.status,200);
  assert.ok(!JSON.stringify(held.body).includes('unreviewed edited text'));assert.equal(held.body.topic.generated_assessment_id,null);
 });
}
