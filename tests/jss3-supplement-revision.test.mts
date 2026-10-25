import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { JSS3_SUPPLEMENTS, buildJss3SupplementRows } from '../backend/src/db/jss3Supplements.ts';
import { supplementReference } from '../backend/src/db/jss3SupplementReference.ts';
import { createSupplementRevisionResolver, SUPPLEMENT_UPDATE_MARKER } from '../backend/src/utils/jss3SupplementRevision.ts';
import { createDeliveryResolver, resolveDelivery, deliveryHash, safeJss3Topic } from '../backend/src/utils/jss3DeliveryCorrection.ts';
const json=(p:string)=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const registry=json('../backend/src/db/data/jss3YorubaRevisions.json');
const old=json('./fixtures/jss3-ibeere-previous.json');
const lessons=JSS3_SUPPLEMENTS;
const lesson=lessons.find(x=>x.id===old.lesson.id)!;
const topic={school_code:'secondary',class_name:'JSS 3',subject_name:lesson.subjectName,term_label:lesson.termLabel,title:lesson.title,source_reference:supplementReference(old.lesson),summary:'old notes',generated_assessment_id:'old-id'};
test('actual reviewed previous reference is upgraded through public delivery resolver without mutating source',()=>{
 assert.equal(deliveryHash(topic.source_reference),old.sha256);
 assert.ok(registry.find((r:any)=>r.lessonId===lesson.id).versions.some((v:any)=>v.sha256===old.sha256&&v.commit===old.commit));
 const before=structuredClone(topic),r=resolveDelivery(topic)!;
 assert.equal(r.kind,'corrected');if(r.kind!=='corrected')throw Error('not corrected');
 assert.match(r.text,/JSS3 SUPPLEMENT UPDATE/);assert.ok(r.text.endsWith(supplementReference(lesson)));
 assert.doesNotMatch(r.text,/original notes.*unsafe/i);
 const safe=safeJss3Topic(topic);assert.equal(safe.generated_assessment_id,null);assert.equal(safe.summary,r.text);assert.deepEqual(topic,before);
});
test('all four current references equal importer bytes and are matched; changed content changes fingerprint',()=>{
 assert.equal(registry.length,4);
 const originals=lessons.map(s=>({filePath:'x',className:'JSS 3',termLabel:s.termLabel,subjectName:s.subjectName,weekLabel:'1',orderIndex:1,title:'x',sourceReference:'x'}));
 const built=buildJss3SupplementRows(originals,'/r','secondary');
 for(const reg of registry){const l=lessons.find(x=>x.id===reg.lessonId)!;const ref=supplementReference(l);assert.equal(built.find(x=>x.filePath.endsWith('/'+l.id+'.json'))!.sourceReference,ref);
 const t={...topic,subject_name:l.subjectName,term_label:l.termLabel,title:l.title,source_reference:ref};assert.equal(resolveDelivery(t)!.kind,'corrected');}
 const revised=lessons.map(x=>x.id===lesson.id?{...x,body:x.body+'\nReviewed additional explanation.'}:x);
 assert.notEqual(createSupplementRevisionResolver(registry,revised)(topic)!.fingerprint,resolveDelivery(topic)!.fingerprint);
});
test('unreviewed bytes withheld, wrong scope untouched, malformed registry rejected',()=>{
 assert.equal(resolveDelivery({...topic,source_reference:'unknown'})!.kind,'withheld');
 for(const [k,v] of Object.entries({school_code:'primary',class_name:'JSS 2',subject_name:'French',term_label:'3rd Term',title:'Other lesson'}))assert.equal(resolveDelivery({...topic,[k]:v}),null,k);
 assert.throws(()=>createSupplementRevisionResolver([...registry,registry[0]],lessons),/Duplicate/);
 assert.throws(()=>createSupplementRevisionResolver([{lessonId:'MISSING',versions:registry[0].versions}],lessons),/Missing/);
 assert.throws(()=>createSupplementRevisionResolver([{...registry[0],versions:[{sha256:'bad',commit:'bad'}]}],lessons),/Invalid/);
 assert.throws(()=>createSupplementRevisionResolver(registry,[...lessons,lessons[0]]),/Duplicate/);
});
test('existing original correction fingerprints and texts are unchanged',()=>{
 const corrections=json('../backend/src/db/data/jss3DeliveryCorrections.json');const before=createDeliveryResolver(corrections,lessons);
 // Exact body hashes are not reversible: same-title unknown-text paths still compare all original corrections.
 for(const c of corrections){const t={school_code:c.school_code,class_name:c.class_name,subject_name:c.subject_name,term_label:c.term_label,title:c.source_title,source_reference:'unreviewed original'};assert.deepEqual(resolveDelivery(t),before(t));}
 const s=resolveDelivery(topic)!;assert.ok(s.text.startsWith(SUPPLEMENT_UPDATE_MARKER));
});

// Registry reproducibility: the checked-in registry must equal the generator's output for its explicit history ref.
const HISTORY_REF='94982cbc5e9e2b2d61aa77ff4d2173135b17cca8';
const hasHistory=spawnSync('git',['cat-file','-e',HISTORY_REF+'^{commit}'],{cwd:new URL('..',import.meta.url).pathname}).status===0;
test('checked-in revision registry is exactly reproducible from the explicit history ref',{skip:!hasHistory&&'history ref not present in this (shallow) checkout'},()=>{
 const out=mkdtempSync(tmpdir()+'/yrev-')+'/r.json',root=new URL('..',import.meta.url).pathname;
 const r=spawnSync('python3',['scripts/jss3/build_yoruba_revision_register.py','--history-ref',HISTORY_REF,'--output',out],{cwd:root,encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);assert.equal(readFileSync(out,'utf8'),readFileSync(new URL('../backend/src/db/data/jss3YorubaRevisions.json',import.meta.url),'utf8'));
 const second=spawnSync('python3',['scripts/jss3/build_yoruba_revision_register.py','--history-ref',HISTORY_REF,'--output',out+'2'],{cwd:root,encoding:'utf8'});assert.equal(second.status,0);assert.equal(readFileSync(out+'2','utf8'),readFileSync(out,'utf8'));
 for(const v of registry.flatMap((x:any)=>x.versions))assert.equal(spawnSync('git',['merge-base','--is-ancestor',v.commit,HISTORY_REF],{cwd:root}).status,0,'accepted commit must be an ancestor of the history ref');
});
