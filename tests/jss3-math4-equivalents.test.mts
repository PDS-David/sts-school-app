import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createDeliveryResolver, deliveryHash } from '../backend/src/utils/jss3DeliveryCorrection.js';
const lessons = JSON.parse(readFileSync(new URL('../backend/src/db/data/jss3Supplements.json', import.meta.url), 'utf8'));
const corrections = JSON.parse(readFileSync(new URL('../backend/src/db/data/jss3DeliveryCorrections.json', import.meta.url), 'utf8'));
const lesson = (id: string) => lessons.find((l: any) => l.id === id);
const formula = lesson('SUP-MATH-CHANGE-SUBJECT');
const triangle = lesson('SUP-MATH-SIMULT-WORDS');
function checkRootAnswers(body: string) {
  const answer = /A: m=(\d+); B: m=(\d+)/.exec(body);
  assert.ok(answer, 'two separately labelled answers required');
  assert.equal(2 * Math.PI * Math.sqrt(Number(answer[1]) / 4), 2 * Math.PI);
  assert.equal(2 * Math.PI * Math.sqrt(Number(answer[2])) / 4, 2 * Math.PI);
}
test('both explicit root scopes are taught without choosing the ambiguous source intent', () => {
  assert.match(formula.body, /T = 2π√\(m\/k\)/);
  assert.match(formula.body, /T = \(2π√m\)\/k/);
  assert.match(formula.body, /do not select the author's intended formula/);
  checkRootAnswers(formula.body);
});
test('root-scope checker rejects swapped answers', () => {
  assert.throws(() => checkRootAnswers(formula.body.replace('A: m=4; B: m=16', 'A: m=16; B: m=4')));
});
test('tank mass and depth are independently consistent with given dimensions and units', () => {
  const mass = /M=(\d+) kg; h=24000\/\(1000×5×3\)=([\d.]+) m/.exec(formula.body);
  assert.ok(mass);
  assert.equal(Number(mass[1]), 1000 * 5 * 4 * 5);
  assert.equal(1000 * 5 * 3 * Number(mass[2]), 24000);
  assert.match(formula.body, /cm² means square centimetres/);
  assert.match(formula.body, /cm³ means cubic centimetres/);
});
test('equilateral equivalent solves every stated side expression and perimeter', () => {
  assert.match(triangle.body, /Newly prepared equivalent/);
  assert.match(triangle.body, /intended numerical problem is not reconstructed/);
  const a = /Answer: x=(\d+), y=(\d+), all sides (\d+) cm and perimeter (\d+) cm/.exec(triangle.body);
  assert.ok(a); const [, x, y, side, perimeter] = a.map(Number);
  assert.equal(x + 4, side); assert.equal(2*x + 1, side); assert.equal(y - 1, side);
  assert.equal(3*side, perimeter);
});
test('existing algebra and statistics corrections include the remaining deterministic source answers', () => {
  const algebra = lesson('SUP-MATH-EXPRESSIONS').body;
  assert.match(algebra, /9x\+45=180, x=15/);
  assert.match(algebra, /30°, 50°, 100°/);
  assert.match(algebra, /n=39: 39,40,41/);
  const stats = lesson('SUP-MATH-DATA-DISPLAY').body;
  assert.match(stats, /Physics72°,History144°,Geography108°,Further Mathematics36°/);
  assert.match(stats, /100Physics pupils;History2\/5/);
  assert.equal([72,144,108,36].reduce((a,b)=>a+b), 360);
});
test('effective delivery uses the changed lessons and their full-body cache fingerprint', () => {
  for (const id of ['SUP-MATH-CHANGE-SUBJECT', 'SUP-MATH-SIMULT-WORDS']) {
    const binding = corrections.find((c: any) => c.replacement_lesson_ids.includes(id));
    assert.ok(binding);
    // A synthetic source body isolates the production resolver; no source hash is changed on disk.
    const c = {...binding, source_body_sha256: deliveryHash('fixture'), previous_source_body_sha256: []};
    const topic = {school_code:c.school_code,class_name:c.class_name,source_reference:'fixture'};
    const resolved = createDeliveryResolver([c], lessons)(topic);
    assert.equal(resolved?.kind, 'corrected');
    assert.ok(resolved?.text.includes(lesson(id).body));
    const changed = lessons.map((l: any) => l.id === id ? {...l,body:l.body+' changed'} : l);
    assert.notEqual(createDeliveryResolver([c], changed)(topic)?.fingerprint, resolved?.fingerprint);
    assert.equal(createDeliveryResolver([c], lessons)({...topic,class_name:'JSS 2'}), null);
  }
});
