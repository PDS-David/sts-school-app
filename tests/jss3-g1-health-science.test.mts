import test from 'node:test';
import assert from 'node:assert/strict';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.ts';

const by = (id: string) => JSS3_SUPPLEMENTS.find(s => s.id === id)!;
const eco = by('SUP-BS-PLANT-ANIMAL-ECONOMY');
const dev = by('SUP-HE-CHILD-DEVELOPMENT-STAGES');

test('G1 lessons exist, are placed in First/Second term buckets and cover the named scheme gaps', () => {
  assert.ok(eco && dev);
  assert.deepEqual(eco.gapIds.sort(), ['WG-BS-SL266', 'WG-BS-SL275']);
  assert.deepEqual(dev.gapIds, ['WG-HE-SL554']);
  assert.equal(eco.subjectName, 'Basic Science'); assert.equal(eco.termLabel, '2nd Term');
  assert.equal(dev.subjectName, 'Home Economics'); assert.equal(dev.termLabel, '2nd Term');
});

test('G1 lessons have objectives, teaching, worked example, practice and a marking guide', () => {
  for (const s of [eco, dev]) for (const part of ['Objectives:', 'Teaching:', 'Worked example:', 'Practice (questions):', 'Answers (marking guide):'])
    assert.ok(s.body.includes(part), `${s.id}: ${part}`);
  for (const s of [eco, dev]) assert.ok(s.sources.length >= 3 && s.sources.every(x => x.url.startsWith('https://')));
});

test('SL-266/275 lesson teaches income, employment and trade with dated, non-fixed statistics', () => {
  for (const w of ['Income.', 'Employment.', 'Trade.', 'export', 'raw materials', 'value addition']) assert.ok(new RegExp(w, 'i').test(eco.body), w);
  assert.match(eco.body, /second quarter of 2026/); assert.match(eco.body, /estimates differ by year and method/);
});

test('SL-554 lesson gives typical ranges and says they are not diagnostic deadlines', () => {
  assert.match(dev.body, /Ranges, not deadlines/); assert.match(dev.body, /not tests that diagnose/);
  assert.match(dev.body, /between about 8 and 18 months/); assert.match(dev.body, /between about 4 and 9 months/);
  assert.doesNotMatch(dev.body, /must (walk|talk|sit) by|should have .* by \d+ months|is delayed if/i);
});

test('G1 health lesson carries no foreign immunisation table, dose, homemade recipe or diagnosis instruction', () => {
  const t = dev.body + eco.body;
  assert.doesNotMatch(t, /\b\d+\s?(mg|ml)\b|BCG|smallpox|MMR|OPV\b/i);
  assert.doesNotMatch(t, /homemade|salt and sugar|oral rehydration/i);
  assert.match(dev.body, /current Nigerian schedule/);
});

test('G1 lessons do not repeat the ozone/greenhouse confusion', () => {
  const t = (eco.body + dev.body).toLowerCase();
  assert.doesNotMatch(t, /depletes? the ozone|ozone layer/);
});
