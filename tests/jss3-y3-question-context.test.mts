import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {JSS3_SUPPLEMENTS,buildJss3SupplementRows,supplementBodyHash} from '../backend/src/db/jss3Supplements.js';
const lesson=JSS3_SUPPLEMENTS.find(s=>s.id==='SUP-YO-IBEERE')!;
test('contextual question exercise has an answer and preserves ambiguity of the isolated source',()=>{
 assert.match(lesson.body,/In a self-introduction, what does Ìwọ ńkọ́/);
 assert.match(lesson.body,/Introduce themselves/);
 assert.match(lesson.body,/does not supply enough context/);
 assert.match(lesson.body,/'taki' and 'iwure' remain unresolved source wording/);
 assert.match(lesson.body,/does not assert that either printed form has been deciphered/);
 assert.doesNotMatch(lesson.body,/both readings of ńkọ́ stay open/);
 const tasks=lesson.body.split('**Practice (questions).**')[1].split('**Answers')[0];
 assert.doesNotMatch(tasks,/taki|iwure/);
 assert.match(tasks,/6\. Choose ta or kí:/);
 const answers=lesson.body.split('**Answers and marking guide (22 marks).**')[1];
 assert.match(answers,/6\. \(a\) ta; \(b\) kí \(1 mark each\)/);
 assert.match(answers,/For Ṣé Adé wá\?, accept Bẹ́ẹ̀ ni, Adé wá and Bẹ́ẹ̀ kọ́, Adé kò wá/);
 assert.match(answers,/For Ṣé Bísí mú ìwé náà wá\?, accept Bẹ́ẹ̀ ni, Bísí mú ìwé náà wá and Bẹ́ẹ̀ kọ́, Bísí kò mú ìwé náà wá/);
 const marks=[...tasks.matchAll(/\((\d+) marks\)/g)].map(m=>Number(m[1]));
 assert.equal(marks.length,7);assert.equal(marks.reduce((a,b)=>a+b,0),22);
 assert.match(lesson.body,/marking guide \(22 marks\)/);
});
test('real supplement builder delivers the corrected context without mutating source rows',()=>{
 const original={filePath:'fixture.docx',className:'JSS 3',termLabel:'1st Term',subjectName:'Yoruba',weekLabel:'WEEK 5',orderIndex:1,title:'fixture',sourceReference:'Original source preserved'};
 const rows=buildJss3SupplementRows([original],'/fixture','secondary',[lesson]);
 assert.equal(rows.length,1);assert.equal(original.sourceReference,'Original source preserved');
 assert.equal(rows[0].termLabel,'1st Term');assert.ok(rows[0].sourceReference.includes(lesson.body));
 const record=readFileSync(new URL('../docs/jss3/replacements/IMPLEMENTED_LESSONS.csv',import.meta.url),'utf8').split('\n').find(l=>l.startsWith('SUP-YO-IBEERE,'))!;
 assert.ok(record.includes(supplementBodyHash(rows[0].sourceReference)));
 assert.ok(!record.includes(supplementBodyHash(rows[0].sourceReference+'tampered')));
 for(const src of lesson.sources.slice(-2)) assert.ok(record.includes(src.url));
});

test('cooperation lesson distinguishes documented rotation without inventing a food rule',()=>{
 const l=JSS3_SUPPLEMENTS.find(s=>s.id==='SUP-YO-IRANLOWO-PRACTICE')!;
 assert.match(l.body,/Akinola \(2007\)/);assert.match(l.body,/Àáró \/ Aaro \(1\)/);
 assert.doesNotMatch(l.body,/Food or drink is not required/);
 assert.match(l.body,/obese/);assert.match(l.body,/not a rule for every community/);
 const original={filePath:'fixture.docx',className:'JSS 3',termLabel:l.termLabel,subjectName:l.subjectName,weekLabel:'WEEK 5',orderIndex:1,title:'fixture',sourceReference:'Original'};
 const row=buildJss3SupplementRows([original],'/fixture','secondary',[l])[0];
 const record=readFileSync(new URL('../docs/jss3/replacements/IMPLEMENTED_LESSONS.csv',import.meta.url),'utf8').split('\n').find(r=>r.startsWith(l.id+','))!;
 assert.ok(record.includes(supplementBodyHash(row.sourceReference)));
});
