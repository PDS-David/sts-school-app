import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {buildJss3SupplementRows} from '../backend/src/db/jss3Supplements.js';
const all=JSON.parse(readFileSync('backend/src/db/data/jss3Supplements.json','utf8'));
const l=all.find((x:any)=>x.id==='SUP-YO-MARRIAGE');
function supported(b:string){
 for(const [term,meaning] of [['Isihun','consent'],['Ipalemo','prepare'],['Ifa iyawo','consultation'],['Ojo igbeyawo','celebration'],['Ese iyawo wiwe','symbolic']]){
  assert.ok(b.split(`**${term}**`)[1]?.split('\n')[0].includes(meaning),term);
 }
 assert.match(b,/particular post-wedding activity is not established/);
 assert.match(b,/No pupil is asked to perform religious rites, intimate practices/);
 assert.match(b,/14 marks \(6 original \+ 8 additional\)/);
}
test('documented terms have explanations, marking and explicit uncertainty',()=>supported(l.body));
test('negative controls reject a removed explanation and false school confirmation',()=>{
 assert.throws(()=>supported(l.body.replace('families prepare','families celebrate')));
 assert.throws(()=>supported(l.body.replace('particular post-wedding activity is not established','confirms both school labels')));
});
test('runtime supplement builder binds revised lesson without changing input rows',()=>{
 const original=[{filePath:'fixture.docx',className:'JSS 3',subjectName:'Yoruba',termLabel:'2nd Term',weekLabel:'WEEK 1',orderIndex:1,title:'fixture',sourceReference:'unchanged'}];
 const before=JSON.stringify(original);
 const rows=buildJss3SupplementRows(original,'/fixture','secondary',[l]);
 assert.equal(rows.length,1);assert.equal(rows[0].termLabel,'2nd Term');assert.ok(rows[0].sourceReference.includes(l.body));assert.equal(JSON.stringify(original),before);
});
test('A6 preserves the existing lesson identity',()=>{
 assert.equal(l.subjectName,'Yoruba');assert.equal(l.termLabel,'2nd Term');
 assert.deepEqual(l.gapIds,['YO-SL-344']);
});
