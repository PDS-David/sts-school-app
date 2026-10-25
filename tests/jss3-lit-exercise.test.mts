// Task 03: the literature-method lesson is bound to the delivered story and stays a labelled selected equivalent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { JSS3_SUPPLEMENTS, buildJss3SupplementRows } from '../backend/src/db/jss3Supplements.ts';
import { supplementReference } from '../backend/src/db/jss3SupplementReference.ts';
import { resolveDelivery, deliveryHash } from '../backend/src/utils/jss3DeliveryCorrection.ts';
import { JSS3_ATTRIBUTIONS } from '../backend/src/db/jss3Attributions.ts';
const root = new URL('..', import.meta.url).pathname;
const prev = JSON.parse(readFileSync(new URL('./fixtures/jss3-lit-method-previous.json', import.meta.url), 'utf8'));
const by = (id: string) => JSS3_SUPPLEMENTS.find(s => s.id === id)!;
const method = by('SUP-YO-LIT-METHOD'), story = by('SUP-YO-LICENSED-STORY');
const questions = () => [...method.body.matchAll(/^(\d)\. \*\*([^*]+?)\((\d+) marks?\)\.\*\*/gm)].map(m => ({ n: +m[1], marks: +m[3] }));

test('identity, destination and gap IDs are preserved; story is in the same accessible term', () => {
  assert.equal(method.title, prev.lesson.title);
  assert.deepEqual(method.gapIds, ['YO-SL-095', 'YO-SL-324']);
  assert.equal(method.subjectName, 'Yoruba'); assert.equal(method.termLabel, '1st Term');
  assert.equal(story.subjectName, method.subjectName); assert.equal(story.termLabel, method.termLabel);
  assert.ok(!/3rd|Computer/i.test(method.termLabel + method.subjectName));
  assert.ok(method.body.includes(`**${story.title}**`), 'method must name the story by the title a learner can find');
  const git = spawnSync('git', ['show', `${prev.commit}:backend/src/db/data/jss3Supplements.json`], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (git.status === 0) assert.deepEqual(JSS3_SUPPLEMENTS.map(s => s.id), JSON.parse(git.stdout).map((s: any) => s.id), 'lesson order unchanged');
});

test('paragraph anchors cited by the exercise exist in the story', () => {
  const paras = [...story.body.matchAll(/^\[(\d+)\]/gm)].map(m => +m[1]);
  assert.deepEqual(paras, Array.from({ length: paras.length }, (_, i) => i + 1)); assert.equal(paras.length, 12);
  const cited = [...method.body.matchAll(/paragraphs? ([\d, and–to]+)/g)].flatMap(m => m[1].match(/\d+/g) ?? []).map(Number);
  assert.ok(cited.length >= 10);
  for (const n of cited) assert.ok(n >= 1 && n <= 12, `paragraph ${n} is not in the story`);
  assert.ok(!/Third Term|BECE/.test(method.body));
});

test('five or more concrete questions, full answers, and arithmetically correct marks', () => {
  const q = questions(); assert.ok(q.length >= 5); assert.deepEqual(q.map(x => x.n), q.map((_, i) => i + 1));
  const total = q.reduce((a, b) => a + b.marks, 0); assert.equal(total, 20);
  assert.match(method.body, /marking guide, 20 marks/);
  const guide = method.body.slice(method.body.indexOf('**Answers'), method.body.indexOf('**Assessment'));
  for (const x of q) assert.match(guide, new RegExp(`^${x.n}\\. `, 'm'), `answer ${x.n}`);
  assert.match(method.body, /not the school's set text|selected equivalent/); assert.match(method.body, /do not need any other book/i);
});

test('no story text is copied into the method lesson (so no attribution duty moves with it)', () => {
  const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{M}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  const sw = words(story.body.slice(story.body.indexOf('Complete story text:'), story.body.indexOf('Teaching guide:'))), mw = words(method.body);
  const grams = new Set<string>(); for (let i = 0; i + 5 <= sw.length; i++) grams.add(sw.slice(i, i + 5).join(' '));
  for (let i = 0; i + 5 <= mw.length; i++) assert.ok(!grams.has(mw.slice(i, i + 5).join(' ')), `copied run: ${mw.slice(i, i + 5).join(' ')}`);
  assert.ok(!/©|Creative Commons/.test(method.body));
  const rec = JSS3_ATTRIBUTIONS.filter(a => a.supplement_id === story.id); assert.equal(rec.length, 1); // story record untouched and still bound
});

test('importer reference hash; tamper rejected; Task 02 serves the new method from the reviewed older reference', () => {
  const built = buildJss3SupplementRows(JSS3_SUPPLEMENTS.map(l => ({ filePath: 'x', className: 'JSS 3', termLabel: l.termLabel, subjectName: l.subjectName, weekLabel: '1', orderIndex: 1, title: 'x', sourceReference: 'x' })), '/r', 'secondary')
    .find(r => r.filePath.endsWith('/SUP-YO-LIT-METHOD.json'))!;
  assert.equal(built.sourceReference, supplementReference(method));
  assert.notEqual(deliveryHash(built.sourceReference), prev.sha256);
  const topic = { school_code: 'secondary', class_name: 'JSS 3', subject_name: 'Yoruba', term_label: '1st Term', title: method.title };
  const oldRef = supplementReference(prev.lesson); assert.equal(deliveryHash(oldRef), prev.sha256);
  const served = resolveDelivery({ ...topic, source_reference: oldRef })!; assert.equal(served.kind, 'corrected');
  if (served.kind === 'corrected') assert.ok(served.text.endsWith(supplementReference(method)) && served.text.includes('Ramúramù ewúrẹ́: complete Yoruba story'));
  assert.equal(resolveDelivery({ ...topic, source_reference: built.sourceReference })!.kind, 'corrected');
  assert.equal(resolveDelivery({ ...topic, source_reference: built.sourceReference + ' ' })!.kind, 'withheld');
  assert.equal(resolveDelivery({ ...topic, source_reference: oldRef.replace('10 marks', '11 marks') })!.kind, 'withheld');
  assert.equal(createHash('sha256').update(method.body).digest('hex').length, 64);
});
