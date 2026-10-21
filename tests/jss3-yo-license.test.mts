// YO-LICENSE: attribution register, lesson identity, learner-visible wording. CI-safe (no database, no private corpus).
import assert from 'node:assert/strict';
import test from 'node:test';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';
import { JSS3_ATTRIBUTIONS, attributionBodyHash, attributionsForTopic, publicAttribution } from '../backend/src/db/jss3Attributions.js';
import { attributionLines, undisplayedVisuals } from '../mobile/src/api/lessonAttribution.ts';
import { loadLessonAssets } from '../mobile/src/api/lessonAssets.ts';

const lesson = JSS3_SUPPLEMENTS.find(s => s.id === 'SUP-YO-ORAL-TEXTS')!;
const rec = JSS3_ATTRIBUTIONS.find(a => a.supplement_id === 'SUP-YO-ORAL-TEXTS')!;
const noun = rec.credits.find(c => c.id === 'noun-eng105-m2')!;
const kol = rec.credits.find(c => c.id === 'kolawole-2023')!;
const topic = { subject_name: lesson.subjectName, term_label: lesson.termLabel, class_name: 'JSS 3', title: lesson.title };

test('register identity equals the delivered lesson and pins its verified body (YO-TEXT must update the hash deliberately)', () => {
  assert.equal(rec.subjectName, lesson.subjectName); assert.equal(rec.termLabel, lesson.termLabel); assert.equal(rec.title, lesson.title);
  assert.equal(rec.body_sha256, attributionBodyHash(lesson.body), 'lesson body changed: re-verify excerpts/attribution, then update body_sha256');
});
test('every credit appears in the lesson text and its source is listed among the lesson sources', () => {
  for (const c of rec.credits) {
    assert.ok(lesson.sources.some(s => s.url === c.source_url), c.id);
    assert.ok(lesson.body.includes(c.licence_url) || c.id === 'kolawole-2023', c.id);
  }
  assert.ok(lesson.body.includes(noun.required_credit)); assert.ok(lesson.body.includes(noun.download_line!));
  assert.ok(lesson.body.includes('Oyeniyi Okunoye')); assert.ok(lesson.body.includes('Kolawole (2023)'));
  assert.equal(noun.required_credit, 'First produced by the National Open University of Nigeria');
  assert.equal(noun.licence, 'CC BY-SA 4.0'); assert.equal(noun.year, 2021);
});
test('Kolawole licence discrepancy (article page BY-SA vs PDF "Attribution") is kept visible, not flattened', () => {
  assert.match(kol.licence, /Creative Commons Attribution License/); assert.match(kol.licence, /CC BY-SA 4\.0/);
});
test('the notice does not assert that the school has chosen share-alike distribution (owner decision stays open)', () => {
  assert.doesNotMatch(rec.notice, /shared under|we license|cleared|permission granted/i);
  assert.doesNotMatch(JSON.stringify(rec), /legally cleared|compatible with the app/i);
});
test('identity matching is exact: other class, term, subject or title receive nothing', () => {
  assert.equal(attributionsForTopic(topic).length, 1);
  for (const bad of [{ class_name: 'JSS 2' }, { term_label: '1st Term' }, { subject_name: 'English Language' }, { title: lesson.title + ' (copy)' }, { class_name: null }])
    assert.equal(attributionsForTopic({ ...topic, ...bad }).length, 0, JSON.stringify(bad));
  assert.equal(attributionsForTopic({ ...topic, title: ` ${lesson.title.toUpperCase()}  ` }).length, 1, 'whitespace/case tolerant like the asset title guard');
});
test('cover and logo are reported NOT displayed until bound assets exist; nothing is faked', () => {
  const none = publicAttribution(rec, new Set());
  const n = none.credits.find(c => c.id === 'noun-eng105-m2')!;
  assert.deepEqual(n.visuals.map(v => [v.role, v.displayed]), [['cover', false], ['logo', false]]);
  assert.ok(noun.requested_visuals.every(v => v.state === 'unbound' && v.reason));
  const bound = publicAttribution(rec, new Set(['NOUN-ENG105-M2-COVER', 'NOUN-ENG105-M2-LOGO']));
  assert.ok(bound.credits.find(c => c.id === 'noun-eng105-m2')!.visuals.every(v => v.displayed));
  assert.deepEqual(undisplayedVisuals(none as any), ['noun-eng105-m2:cover', 'noun-eng105-m2:logo']);
});
test('learner-visible wording carries credit, creator, publisher, year, licence, source and changes', () => {
  const l = attributionLines(publicAttribution(rec, new Set()) as any);
  assert.equal(l.heading, 'Sources and licences');
  const t = l.credits.find(c => c.key === 'noun-eng105-m2')!;
  for (const need of ['First produced by the National Open University of Nigeria', 'Oyeniyi Okunoye', 'University Village, Jabi, Abuja', '2021', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'ENG105_02.pdf', 'Six of 37 printed lines', 'nouonline.net'])
    assert.ok(t.text.includes(need), need);
  assert.ok(t.accessibilityLabel.startsWith('Credit.'));
  assert.ok(l.credits.find(c => c.key === 'kolawole-2023')!.text.includes('Akano Famoriyo'));
});
test('mobile loader carries attributions; older servers give none; malformed attributions reject', async () => {
  const a = [{ supplement_id: 'X' }];
  assert.deepEqual((await loadLessonAssets(1, async () => ({ data: { assets: [], attributions: a } }), async () => null)).attributions, a);
  assert.deepEqual((await loadLessonAssets(1, async () => ({ data: { assets: [] } }), async () => null)).attributions, []);
  await assert.rejects(loadLessonAssets(1, async () => ({ data: { assets: [], attributions: 'x' } }), async () => null), /Invalid attribution response/);
});
