// Run from repository root after composing upserts and applying code.patch.
import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const d='docs/jss3/batch2-close/A_MATH_TECH_BUSINESS/';const read=p=>JSON.parse(fs.readFileSync(p));const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const up=read(d+'SUPPLEMENT_UPSERTS.json'), staged=read('backend/src/db/data/jss3Supplements.json');
const base=JSON.parse(execFileSync('git',['show','86a1a6195f47370ebbdecbc806e06d4661fbef58:backend/src/db/data/jss3Supplements.json'],{encoding:'utf8'}));
assert.equal(new Set(up.map(x=>x.id)).size,up.length);
for(const u of up){const old=base.find(x=>x.id===u.id);assert.equal(u.expected_old_sha256,old?hash(JSON.stringify(old)):null);assert.equal(u.op,old?'replace':'add');assert.deepEqual(staged.find(x=>x.id===u.id),u.lesson);assert.equal(u.id,u.lesson.id);}
for(const old of base.filter(x=>!up.some(u=>u.id===x.id)))assert.deepEqual(staged.find(x=>x.id===old.id),old);
let checks=0;const eq=(a,b)=>{assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);checks++};
eq(parseInt('111',2),7);eq(parseInt('10000',2),16);eq(parseInt('10101',2),21);eq(376/8,47);eq(840/3,280);eq(396/(2*(22/7)*7)-7,2);eq(Math.round(Math.sin(46.65*Math.PI/180)*1e4)/1e4,0.7272);
eq(3*280+2*200,1240);eq(5*280+7*200,2800);eq(45+46+47,138);eq((28+2)/5,3*2);eq(3/6+1/2,1);eq(6/3+1/2,5/2);eq(3/(5+1),1/2);eq(1/1+1/2,3/2);eq(2*2+3*3,13);eq(3*2+2*3,12);eq(5/30*360,60);eq(200**2+150**2,250**2);eq(150-20-20,110);eq(200-40,160);
// Independently recalculate both explicit (not inferred source) averages datasets.
const a=[5,7,4,8,5,7,10,9,6,3];eq(a.reduce((s,x)=>s+x,0)/a.length,6.4);const f=[2,1,2,1,3,1,2,3,4,1];eq(f.reduce((s,x)=>s+x,0),20);eq(f.reduce((s,x,i)=>s+x*i,0),99);
eq(20/150*360+25/150*360+70/150*360+25/150*360+10/150*360,360);eq(70+92-50-55,57);
// Detect a deliberately wrong worked result, rather than echoing body assertions.
assert.throws(()=>eq(parseInt('111',2),9));assert.throws(()=>eq(376/8,48));assert.throws(()=>eq(840/3,260));
const c=read(d+'DELIVERY_CORRECTIONS.json');assert.equal(new Set(c.map(x=>x.source_body_sha256)).size,c.length);
for(const x of c)for(const id of x.replacement_lesson_ids)assert.ok(staged.some(l=>l.id===id));
const ev=read(d+'OBJECTIVE_EVIDENCE.json');for(const e of ev)for(const component of e.components){const l=staged.find(l=>l.id===component.support);if(l)assert.ok(l.body.includes(component.body_anchor),`${e.candidate_id}: ${component.body_anchor}`);}
console.log(JSON.stringify({upserts:up.length,additions:up.filter(x=>x.op==='add').length,unchangedExistingLessons:base.filter(x=>!up.some(u=>u.id===x.id)).length,arithmeticChecks:checks,negativeControls:3,deliveryCorrections:c.length,objectiveRecords:ev.length,passed:true},null,2));
