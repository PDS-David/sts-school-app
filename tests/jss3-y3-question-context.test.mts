import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {JSS3_SUPPLEMENTS,buildJss3SupplementRows,supplementBodyHash} from '../backend/src/db/jss3Supplements.js';
const lesson=JSS3_SUPPLEMENTS.find(s=>s.id==='SUP-YO-IBEERE')!;
test('contextual question exercise has an answer and preserves ambiguity of the isolated source',()=>{
 assert.match(lesson.body,/In a self-introduction, what does Ìwọ ńkọ́/);
 assert.match(lesson.body,/Introduce themselves/);
 assert.match(lesson.body,/does not supply enough context/);
 assert.match(lesson.body,/taki.*iwure.*remain inferred/);
 assert.doesNotMatch(lesson.body,/both readings of ńkọ́ stay open/);
 const tasks=lesson.body.split('**Practice (questions).**')[1].split('**Answers')[0];
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
