import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {buildJss3SupplementRows} from '../backend/src/db/jss3Supplements.js';
import {supplementReference} from '../backend/src/db/jss3SupplementReference.js';
import {deliveryHash, resolveDelivery, safeJss3Topic} from '../backend/src/utils/jss3DeliveryCorrection.js';
import {spawnSync} from 'node:child_process';
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

test('elision is taught and assessed without requiring the meaning of raw iparoje',()=>{
 const b=get('SUP-YO-ISUNKI').body;
 assert.match(b,/Elision leaves out a sound/);
 assert.match(b,/wárápá → wáápá: r disappears/);
 assert.match(b,/It is not confirmed/);
 const tasks=b.split('**Practice (questions).**')[1].split('**Answers')[0];
 assert.doesNotMatch(tasks,/iparoje/);
 assert.match(tasks,/which consonant disappears/);
 assert.match(b,/4\. r disappears \(1\); ìpajẹ \/ elision \(1\)/);
});
test('syllable definition uses a tone-bearing centre rather than one breath',()=>{
 const b=get('SUP-YO-OHUN-SILEBU').body;
 assert.match(b,/centred on a vowel/); assert.match(b,/centre can carry tone/);
 assert.doesNotMatch(b,/smallest part of a word you can say in one breath/);
 assert.ok(get('SUP-YO-OHUN-SILEBU').sources.some((s:any)=>s.url.includes('archive.phonetics.ucla.edu')));
});
test('French auxiliary and pronominal agreement exceptions have answered practice',()=>{
 const b=get('SUP-FR-PASSE-COMPOSE').body;
 assert.match(b,/Elle a sorti le sac/); assert.match(b,/Awa s’est lavé les mains/);
 assert.match(b,/Ils se sont parlé/); assert.match(b,/subject agreement is not automatic/);
 assert.match(b,/5 \(4 marks\)/); assert.match(b,/total 28 marks/);
 assert.match(b,/following direct object/);
});
test('Music supplies unambiguous replacements without guessing the source chord',()=>{
 const b=get('SUP-MUSIC-REVISION-OMEGA').body;
 assert.match(b,/original pitches remain unidentified/);
 assert.match(b,/not a transcription of the unreadable chord/);
 assert.match(b,/C \(2 marks\): \(i\) G major; \(ii\) A minor/);
 assert.match(b,/E \(2 marks\): \(i\) F; \(ii\) A/);
 assert.match(b,/totals 7 marks/);
 assert.doesNotMatch(b,/Ask your teacher which answer your class expects/);
});
test('PHE achievement task can be answered entirely from supplied verified examples',()=>{
 const b=get('SUP-PHE-NIGERIAN-HEROES').body;
 assert.match(b,/Choose three people from the verified examples/);
 assert.match(b,/Chioma Ajunwa — 1996 Olympic long-jump gold/);
 assert.match(b,/Tobi Amusan — 2022 world 100 m hurdles title/);
 assert.match(b,/Total 18 marks/);
 assert.doesNotMatch(b,/sports people not named in this lesson/);
 assert.match(b,/Stephen Meaning.*remain unresolved/);
});

const closeoutRegistry=JSON.parse(readFileSync(new URL('../backend/src/db/data/jss3CloseoutRevisions.json',import.meta.url),'utf8'));
test('all five reviewed stored references receive current text; unknown references fail closed',()=>{
 assert.deepEqual(closeoutRegistry.map((r:any)=>r.lessonId),['SUP-YO-ISUNKI','SUP-YO-OHUN-SILEBU','SUP-FR-PASSE-COMPOSE','SUP-MUSIC-REVISION-OMEGA','SUP-PHE-NIGERIAN-HEROES']);
 for(const r of closeoutRegistry){
  const l=get(r.lessonId), reference=supplementReference(l);
  const t={school_code:'secondary',class_name:'JSS 3',subject_name:l.subjectName,term_label:l.termLabel,title:l.title,source_reference:reference,summary:'stale',generated_assessment_id:'stale'};
  const got=resolveDelivery(t)!;assert.equal(got.kind,'corrected');assert.ok(got.text.endsWith(reference));
  const safe=safeJss3Topic(t);assert.equal(safe.summary,got.text);assert.equal(safe.generated_assessment_id,null);assert.equal(t.summary,'stale');
  assert.equal(resolveDelivery({...t,source_reference:'unreviewed bytes'})!.kind,'withheld');
  assert.equal(resolveDelivery({...t,class_name:'JSS 2'}),null);
  assert.equal(resolveDelivery({...t,school_code:'primary'}),null);
 }
});
const historyRef='c6b2dfafd05a9f0545152ccd401250baea742a2c';
const prior=spawnSync('git',['show',historyRef+':backend/src/db/data/jss3Supplements.json'],{cwd:new URL('..',import.meta.url).pathname,encoding:'utf8',maxBuffer:4*1024*1024});
test('closeout history hashes match the actual prior commit and refresh those exact bytes',{skip:prior.status!==0&&'reviewed history ref absent in shallow checkout'},()=>{
 const old=JSON.parse(prior.stdout);
 for(const r of closeoutRegistry){
  const l=old.find((x:any)=>x.id===r.lessonId), ref=supplementReference(l);
  assert.deepEqual(r.versions,[{sha256:deliveryHash(ref),commit:historyRef}]);
  const t={school_code:'secondary',class_name:'JSS 3',subject_name:l.subjectName,term_label:l.termLabel,title:l.title,source_reference:ref};
  const got=resolveDelivery(t)!;assert.equal(got.kind,'corrected');assert.ok(got.text.endsWith(supplementReference(get(l.id))));
 }
});
