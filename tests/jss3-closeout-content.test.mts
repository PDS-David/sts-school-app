import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {buildJss3SupplementRows} from '../backend/src/db/jss3Supplements.js';
const lessons=JSON.parse(readFileSync(new URL('../backend/src/db/data/jss3Supplements.json',import.meta.url),'utf8'));
const get=(id:string)=>lessons.find((l:any)=>l.id===id);
function soundPrompt(body:string){
 assert.match(body,/\*\*s\*\* in \*measure\*/);
 assert.match(body,/first consonant of \*measure\* itself is \/m\//);
 assert.doesNotMatch(body,/first sound of \*measure, jam/);
}
test('sound exercise identifies the medial target without marking initial m as zh',()=>soundPrompt(get('SUP-EN-CONSONANT-PRACTICE').body));
test('negative control detects the old incorrect sound prompt',()=>{
 assert.throws(()=>soundPrompt('Write the first sound of *measure, jam, think, that, yell, wine* as an IPA symbol. Answers: /ʒ/, /dʒ/, /θ/, /ð/, /j/, /w/.'));
});
test('comprehension question and answer use a fact actually stated in the passage',()=>{
 const b=get('SUP-EN-EXAM-PRACTICE').body;
 assert.match(b,/bicycle had a flat tyre/);
 assert.match(b,/What problem delayed Ade/);
 assert.match(b,/1\. His bicycle had a flat tyre\./);
 assert.doesNotMatch(b,/He knew the problem could be solved/);
 assert.match(b,/not\*\* past examination questions/);
});
test('unaccompanied melody does not assert a harmonic cadence from a single note',()=>{
 const b=get('SUP-MUSIC-PRACTICAL').body;
 assert.match(b,/last note alone does not identify a harmonic cadence/);
 assert.match(b,/half cadence ends on the dominant chord V/);
 assert.match(b,/authentic cadence closes with V–I/);
 assert.doesNotMatch(b,/the half-cadence note|the authentic cadence note/);
 assert.match(b,/only an observed performance can/);
});
test('importer emits corrected bodies as standalone instructional-term supplements',()=>{
 const selected=['SUP-EN-CONSONANT-PRACTICE','SUP-EN-EXAM-PRACTICE','SUP-MUSIC-PRACTICAL','SUP-CCA-EMBROIDERY-PRACTICAL'].map(get);
 const originals=selected.map((l:any)=>({filePath:'fixture.docx',className:'JSS 3',termLabel:l.termLabel,subjectName:l.subjectName,weekLabel:'WEEK 1',orderIndex:1,title:'fixture',sourceReference:'source preserved'}));
 const snapshot=JSON.stringify(originals);
 const rows=buildJss3SupplementRows(originals,'/fixture','secondary',selected);
 for(const l of selected){
  const row=rows.find(r=>r.filePath.endsWith(l.id+'.json'));assert.ok(row);assert.ok(row.sourceReference.includes(l.body));assert.notEqual(row.termLabel,'3rd Term');
 }
 assert.equal(JSON.stringify(originals),snapshot);
 assert.throws(()=>buildJss3SupplementRows(originals,'/fixture','primary',selected));
});

test('embroidery pairs a blunt tapestry needle with open-weave cloth and excludes sharp chenille needles',()=>{
 const b=get('SUP-CCA-EMBROIDERY-PRACTICAL').body;
 assert.match(b,/open-weave practice cloth or canvas/);
 assert.match(b,/Chenille needles have sharp points/);
 assert.match(b,/teacher checks that the needle and thread fit/);
 assert.doesNotMatch(b,/tapestry or chenille needles are easier and safer/);
});
