import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { loadManifest, prepareAssets } from '../backend/src/db/attachTopicAssets.js';
import { resolveDelivery } from '../backend/src/utils/jss3DeliveryCorrection.js';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';
const root=path.resolve(import.meta.dirname,'..');
const spec=JSON.parse(readFileSync(path.join(root,'scripts/jss3/v3/science_assets.json'),'utf8'));
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const base=path.join(root,'curriculum-assets/jss3/v3-science');
test('V3: every asset matches its bytes; incorrect source figures remain audit-only',()=>{
 assert.equal(spec.length,12);assert.equal(spec.filter((a:any)=>a.displayed).length,8);
 for(const a of spec){assert.equal(sha(readFileSync(path.join(base,a.file))),a.sha256);assert.ok(a.alt_text.length>30);}
 assert.deepEqual(spec.filter((a:any)=>!a.displayed).map((a:any)=>a.asset_key).sort(),['BS-GEN-SOURCE-1','BS-GEN-SOURCE-2','BS-GEN-SOURCE-3','BS-PRISM-SOURCE']);
});
test('V3: model allele combinations agree with the corrected teaching',()=>{
 const cross=(a:string,b:string)=>[...a].flatMap(x=>[...b].map(y=>[x,y].sort().join(''))).sort();
 assert.deepEqual(cross('TT','Tt'),['TT','TT','Tt','Tt']);assert.deepEqual(cross('TT','tt'),['Tt','Tt','Tt','Tt']);assert.deepEqual(cross('Tt','Tt'),['TT','Tt','Tt','tt']);
 const l=JSS3_SUPPLEMENTS.find(x=>x.id==='SUP-BS-FAMILY-TRAITS-V3')!;
 assert.match(l.body,/many genes and environmental/);assert.match(l.body,/not a promise/);assert.match(l.body,/1\/4, 1\/2, 1\/4/);
});
test('V2 pending teaching additions are now registered executable lessons',()=>{
 for(const id of ['SUP-MATH-V2-FIGURES-1','SUP-MATH-V2-FIGURES-2'])assert.ok(JSS3_SUPPLEMENTS.find(x=>x.id===id));
});
const capture=process.env.JSS3_CAPTURE_DIR;
test('V3 real-source binding rejects body drift, duplicate targets and asset/order mismatch; index shifts regenerate safely',{skip:!capture},()=>{
 const rows=JSON.parse(readFileSync(path.join(capture!,'supplemented-rows.json'),'utf8'));const dir=mkdtempSync(path.join(tmpdir(),'v3-'));
 const run=(r:any[])=>{writeFileSync(path.join(dir,'cap.json'),JSON.stringify(r));return spawnSync('python3',['scripts/jss3/v3/build_science_manifests.py','--capture',path.join(dir,'cap.json'),'--out',path.join(dir,'out')],{cwd:root,encoding:'utf8'});};
 try{
  assert.equal(run(rows).status,0);
  const m=rows.find((r:any)=>r.subjectName==='Basic Science'&&r.title==='FAMILY TRAITS');assert.ok(m);
  assert.notEqual(run([...rows,m]).status,0);
  assert.notEqual(run(rows.map((r:any)=>r===m?{...r,sourceReference:r.sourceReference+' changed'}:r)).status,0);
  assert.equal(run(rows.map((r:any)=>({...r,orderIndex:r.orderIndex+50}))).status,0);
  const bindings=JSON.parse(readFileSync(path.join(dir,'out/V3_BINDINGS.json'),'utf8'));
  assert.equal(bindings.find((b:any)=>b.asset_key==='BS-GENETICS-CORRECTED').order_index,m.orderIndex+50);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('V3 real source routes to corrected lesson and modified source fails closed',{skip:!capture},()=>{
 const rows=JSON.parse(readFileSync(path.join(capture!,'original-rows.json'),'utf8'));
 for(const title of ['FAMILY TRAITS','LIGHT ENERGY']){
  const r=rows.find((r:any)=>r.subjectName==='Basic Science'&&r.title===title);assert.ok(r);
  const t={school_code:'secondary',class_name:'JSS 3',subject_name:r.subjectName,term_label:r.termLabel,title:r.title,source_reference:r.sourceReference};
  const d=resolveDelivery(t)!;assert.equal(d.kind,'corrected');assert.ok(d.text.includes('Practice'));
  assert.equal(resolveDelivery({...t,source_reference:r.sourceReference+' changed'})!.kind,'withheld');
 }
});
test('V3 real attachment parser accepts all manifests, retaining held flags and descriptive metadata',()=>{
 const all=['1ST','2ND'].flatMap(t=>prepareAssets(loadManifest(path.join(base,`V3_SCIENCE_${t}_MANIFEST.csv`)),base));
 assert.equal(all.length,17);assert.equal(all.filter(a=>a.displayed).length,13);
 assert.ok(all.every(a=>a.alt_text && a.alt_text.length>30 && a.expected_title));
});
