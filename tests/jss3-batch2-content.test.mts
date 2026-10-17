import test from 'node:test';
import assert from 'node:assert/strict';
import { JSS3_SUPPLEMENTS, validateJss3Supplements } from '../backend/src/db/jss3Supplements.ts';
const byId = (id: string) => JSS3_SUPPLEMENTS.find(s => s.id === id)!;
test('Batch 2 lessons exist in the right subject and First/Second Term bucket', () => {
  const want: Record<string, [string, string]> = {
    'SUP-YO-ORAL-GENRES': ['Yoruba', '1st Term'], 'SUP-AGRIC-PRICING': ['Agricultural Science', '1st Term'], 'SUP-CIVIC-ELECTIONS': ['Civic Education', '2nd Term'],
  };
  for (const [id, [subject, term]] of Object.entries(want)) {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, subject); assert.equal(s.termLabel, term);
    assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/); assert.match(s.body, /Assessment/);
  }
});
test('Yoruba oral-genre lesson covers all five scheme genres and invents no verse', () => {
  const b = byId('SUP-YO-ORAL-GENRES').body;
  for (const g of ['ìjálá', 'iwì egúngún', 'Ọya pípè', 'Ṣàngó pípè', 'iyẹ̀rẹ̀ Ifá']) assert.ok(b.includes(g), g);
  assert.match(b, /supplies no verses/); assert.match(b, /must not be invented or 'completed' from memory/);
  assert.ok(!/"[^"]{40,}"/.test(b) && !/“[^”]{40,}”/.test(b), 'no long quoted chant text');
  const origin = byId('SUP-YO-ORAL-GENRES').origin;
  assert.match(origin, /'yala'/); // printed wording preserved
  assert.match(origin, /ìjálá/); assert.match(origin, /owner-confirmed, not inferred/);
  assert.ok(!/not resolved/.test(origin), 'yala is no longer unresolved');
  assert.match(origin, /not recovered/);
});
test('Batch 2 gap IDs are registered and sources are https links', () => {
  validateJss3Supplements(JSS3_SUPPLEMENTS);
  assert.deepEqual(byId('SUP-AGRIC-PRICING').gapIds, ['WG-AGRIC-PRICING']);
  assert.deepEqual(byId('SUP-CIVIC-ELECTIONS').gapIds, ['WG-CIVIC-ELECTIONS']);
  assert.throws(() => validateJss3Supplements([{ ...byId('SUP-AGRIC-PRICING'), gapIds: ['WG-UNREGISTERED'] }]), /Unregistered/);
  for (const id of ['SUP-YO-ORAL-GENRES', 'SUP-AGRIC-PRICING', 'SUP-CIVIC-ELECTIONS']) for (const src of byId(id).sources) assert.ok(src.url.startsWith('https://'));
});
test('no supplement is placed in Third Term', () => {
  assert.ok(JSS3_SUPPLEMENTS.every(s => s.termLabel !== '3rd Term'));
});
test('Business Studies First-Term scheme topics SL-045 to SL-054 each have a complete attributed lesson', () => {
  const ids = ['INTRO','OFFICE','EQUIPMENT','ATTITUDE','STAFF','OCCUPATION','COMMERCE','DIVISION','PRODUCTION','FACTORS'].map(x => `SUP-BUS-${x}`);
  ids.forEach((id, i) => {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, 'Business Studies'); assert.equal(s.termLabel, '1st Term');
    assert.deepEqual(s.gapIds, [`WG-BUS-SL0${45 + i}`]); assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/);
    assert.ok(s.sources.length >= 2); assert.match(s.origin, /not recovered/);
  });
});
test('Mathematics Second-Term scale drawing, clinometer and bearing-instrument lessons are complete', () => {
  const m: Record<string, string> = { 'SUP-MATH-SCALE': 'WG-MATH-SL261', 'SUP-MATH-CLINOMETER': 'WG-MATH-SL256', 'SUP-MATH-BEARING-TOOLS': 'WG-MATH-SL260' };
  for (const [id, gap] of Object.entries(m)) {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, 'Mathematics'); assert.equal(s.termLabel, '2nd Term'); assert.deepEqual(s.gapIds, [gap]);
    assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/); assert.match(s.origin, /not recovered/);
  }
  assert.match(byId('SUP-MATH-CLINOMETER').body, /15\.5 m/); assert.match(byId('SUP-MATH-BEARING-TOOLS').body, /245°/);
});
