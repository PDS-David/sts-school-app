// Batch 2 F integration: compose every worker's SUPPLEMENT_UPSERTS.json exactly once, hash-guarded.
// Usage: node scripts/jss3/compose_batch2_upserts.mjs [--write]
import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const P='backend/src/db/data/jss3Supplements.json',D='docs/jss3/batch2-close/';
const PKGS=['A_MATH_TECH_BUSINESS','B_HEALTH_SCIENCE','C_ENGLISH_YORUBA','D_FRENCH_SOCIAL_CIVIC_AGRIC','E_MUSIC_CCA'];
const hash=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
const all=JSON.parse(fs.readFileSync(P,'utf8'));const base=new Map(all.map(l=>[l.id,hash(l)]));
const seen=new Map();const report=[];
const REB=JSON.parse(fs.readFileSync(D+'F_INTEGRATION/REBASED_UPSERTS.json','utf8'));const rebased=new Map(REB.map(r=>[r.id,r]));
for(const pkg of PKGS){
  const raw=JSON.parse(fs.readFileSync(`${D}${pkg}/SUPPLEMENT_UPSERTS.json`,'utf8'));const ups=Array.isArray(raw)?raw:(raw.upserts??raw.lessons);
  assert(Array.isArray(ups),`${pkg}: unrecognised upsert container`);
  for(let u of ups){
    if(rebased.has(u.id)){const cur=all.find(l=>l.id===u.id);assert.notEqual(u.expected_old_sha256,hash(cur),`${u.id}: A's original guard now matches; rebasing no longer needed`);assert.equal(rebased.get(u.id).superseded_guard_sha256,u.expected_old_sha256);u=rebased.get(u.id);}
    assert.equal(u.id,u.lesson?.id,`${pkg}: id mismatch ${u.id}`);
    assert(!seen.has(u.id),`Duplicate/competing upsert ${u.id}: ${seen.get(u.id)} vs ${pkg}`);seen.set(u.id,pkg);
    const i=all.findIndex(l=>l.id===u.id);
    if(u.op==='add'){assert(i<0,`${pkg}: ${u.id} already exists; add refused`);assert.equal(u.expected_old_sha256,null);all.push(u.lesson);}
    else if(u.op==='replace'){assert(i>=0,`${pkg}: ${u.id} missing for replace`);assert.equal(u.expected_old_sha256,hash(all[i]),`HASH GUARD FAILED ${u.id} (${pkg}): current master lesson differs from the one the worker replaced`);all[i]=u.lesson;}
    else assert.fail(`${pkg}: unknown op ${u.op}`);
    report.push({pkg,id:u.id,op:u.op,rebased:rebased.has(u.id)||undefined});
  }
}
assert.equal(new Set(all.map(l=>l.id)).size,all.length,'duplicate lesson ids after compose');
if(process.argv.includes('--write'))fs.writeFileSync(P,JSON.stringify(all,null,2)+'\n');
console.log(JSON.stringify({validated:true,written:process.argv.includes('--write'),before:base.size,after:all.length,upserts:report.length,adds:report.filter(r=>r.op==='add').length,replaces:report.filter(r=>r.op==='replace').length,rebased:report.filter(r=>r.rebased).length,byPackage:Object.fromEntries(PKGS.map(p=>[p[0],report.filter(r=>r.pkg===p).length]))}));
