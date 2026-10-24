// R3: every delivered Yoruba lesson that reproduces third-party text must have a body-bound attribution record.
import assert from 'node:assert/strict';
import test from 'node:test';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';
import { JSS3_ATTRIBUTIONS, attributionBodyHash, attributionsForTopic, publicAttribution } from '../backend/src/db/jss3Attributions.js';
import { attributionLines } from '../mobile/src/api/lessonAttribution.ts';

const REQUIRED = ['SUP-YO-ORAL-TEXTS', 'SUP-YO-ORAL-GENRES', 'SUP-YO-LICENSED-STORY'];
const get = (id: string) => ({ lesson: JSS3_SUPPLEMENTS.find(s => s.id === id)!, rec: JSS3_ATTRIBUTIONS.find(a => a.supplement_id === id) });
const topicOf = (l: any) => ({ subject_name: l.subjectName, term_label: l.termLabel, class_name: 'JSS 3', title: l.title });

test('each known third-party Yoruba lesson has exactly one record matching its identity and body hash', () => {
  for (const id of REQUIRED) {
    const { lesson, rec } = get(id);
    assert.ok(lesson && rec, id);
    assert.equal(JSS3_ATTRIBUTIONS.filter(a => a.supplement_id === id).length, 1, id);
    assert.equal(rec!.body_sha256, attributionBodyHash(lesson.body), `${id}: body changed, re-verify credit`);
    assert.equal(attributionsForTopic(topicOf(lesson)).length, 1, id);
  }
});
test('any Yoruba lesson body that states a copyright/Creative Commons credit is registered (catches the next omission)', () => {
  const registered = new Set(JSS3_ATTRIBUTIONS.map(a => a.supplement_id));
  const unregistered = JSS3_SUPPLEMENTS.filter(s => s.subjectName === 'Yoruba' && /©|Creative Commons licen[cs]e|licensed under/i.test(s.body)
    && !registered.has(s.id)).map(s => s.id);
  assert.deepEqual(unregistered, []);
});
test('LICENSED-STORY credit: CC BY 4.0, creator, illustrator, year, changes, delivered wording', () => {
  const { lesson, rec } = get('SUP-YO-LICENSED-STORY'); const c = rec!.credits[0];
  assert.equal(c.licence, 'CC BY 4.0'); assert.equal(c.year, 2018);
  assert.ok(lesson.sources.some(s => s.url === c.source_url));
  for (const t of [c.required_credit, 'Olajide Akoni', 'Offei Tettey Eugene', c.licence_url]) assert.ok(lesson.body.includes(t), t);
  assert.doesNotMatch(JSON.stringify(rec), /share-?alike|BY-SA|legally cleared/i, 'story is CC BY, not BY-SA; no clearance claim');
  const line = attributionLines(publicAttribution(rec!, new Set()) as any).credits[0].text;
  for (const need of ['© African Storybook Initiative 2018', 'Olajide Akoni', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/', 'Changes made:']) assert.ok(line.includes(need), need);
});
test('negative: missing credit in the body is detected', () => {
  const { lesson, rec } = get('SUP-YO-LICENSED-STORY');
  const stripped = lesson.body.replace(rec!.credits[0].required_credit, '');
  assert.notEqual(attributionBodyHash(stripped), rec!.body_sha256);
  assert.ok(!stripped.includes(rec!.credits[0].required_credit));
});
test('negative: a changed body no longer matches the pinned hash (all three lessons)', () => {
  for (const id of REQUIRED) { const { lesson, rec } = get(id); assert.notEqual(attributionBodyHash(lesson.body + ' '), rec!.body_sha256, id); }
});
test('negative: wrong lesson/class/term receives no record, and records are not cross-assigned', () => {
  const { lesson } = get('SUP-YO-LICENSED-STORY');
  for (const bad of [{ class_name: 'JSS 2' }, { term_label: '2nd Term' }, { subject_name: 'English Language' }, { title: 'Other lesson' }])
    assert.equal(attributionsForTopic({ ...topicOf(lesson), ...bad }).length, 0, JSON.stringify(bad));
  const other = get('SUP-YO-ORAL-TEXTS').lesson;
  assert.ok(attributionsForTopic(topicOf(other)).every(a => a.supplement_id === 'SUP-YO-ORAL-TEXTS'));
});
