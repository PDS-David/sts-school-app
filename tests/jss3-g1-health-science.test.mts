// G1: Health and Science content. Run: JSS3_CAPTURE_DIR=<capture of current tree> node --import tsx --test tests/jss3-g1-health-science.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.ts';
const S = new Map(JSS3_SUPPLEMENTS.map(s => [s.id, s]));
const G1 = ['SUP-BS-ECON-RESOURCES', 'SUP-HE-CHILD-STAGES', 'SUP-BS-BUSH-BURNING', 'SUP-BS-DEFORESTATION', 'SUP-PHE-COMBINED-EVENTS', 'SUP-PHE-NIGERIAN-HEROES'];
const corr = JSON.parse(readFileSync('backend/src/db/data/jss3DeliveryCorrections.json', 'utf8')) as any[];
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
test('six G1 lessons are complete: objectives, teaching, practice, marking guide, claim sources, https links', () => {
  for (const id of G1) { const s = S.get(id)!; assert.ok(s, id); assert.match(s.body, /\*\*Objectives:\*\*/); assert.match(s.body, /\*\*Teaching/); assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/); assert.match(s.body, /Where the claims come from/); assert.match(s.origin, /not recovered school-source text/); assert.ok(s.sources.length >= 4); for (const x of s.sources) assert.match(x.url, /^https:\/\//); }
});
test('ozone teaching distinguishes CO2 warming without denying stratospheric smoke effects', () => {
  for (const id of ['SUP-BS-BUSH-BURNING', 'SUP-BS-DEFORESTATION']) {
    const b = S.get(id)!.body;
    assert.match(b, /CFCs/); assert.match(b, /stratosphere/); assert.match(b, /smoke/i);
    assert.doesNotMatch(b, /not by carbon dioxide or smoke|they do not destroy the protective ozone layer/);
    assert.match(b, /ozone-destroying|influence that chemistry/);
  }
});
test('no immunisation schedule, dose, or home recipe appears in the child-stages lesson', () => {
  const b = S.get('SUP-HE-CHILD-STAGES')!.body; assert.ok(!/\b\d+\s?(mg|ml)\b/i.test(b)); assert.ok(!/BCG|OPV|pentavalent|measles vaccine/i.test(b)); assert.match(b, /child health card/i); assert.match(b, /a dated table is not printed/i);
  assert.match(b, /typical range/i); assert.match(b, /not a deadline/i);
});
test('combined-events lesson carries the World Athletics order and corrects the earlier errors', () => {
  const b = S.get('SUP-PHE-COMBINED-EVENTS')!.body;
  assert.match(b, /Day 1: 100 m, long jump, shot put, high jump, 400 m\. Day 2: 110 m hurdles, discus throw, pole vault, javelin throw, 1,500 m/);
  assert.match(b, /Day 1: 100 m hurdles, high jump, shot put, 200 m\. Day 2: long jump, javelin throw, 800 m/); assert.match(b, /60 m hurdles, high jump, shot put, long jump, 800 m/); assert.match(b, /not the one who collects most medals/);
});
test('sports-heroes lesson corrects only confirmed errors and keeps unconfirmed names flagged', () => {
  const b = S.get('SUP-PHE-NIGERIAN-HEROES')!.body; assert.match(b, /4 × 100 m relay at the 1992/); assert.match(b, /Oyedeji/); assert.match(b, /Nwankwo Kanu/); for (const n of ['Chidima Anyway', 'Stephen Meaning', 'Jerry Okorodudu', 'Modupe Oshikoya']) assert.ok(b.includes(n)); assert.match(b, /not re-checked/); assert.ok(!/Stephen Keshi/.test(b));
});
test('five G1 delivery corrections exist, point at G1 lessons and are unique per source hash', () => {
  const ids = ['BS-BUSH-BURNING-OZONE', 'BS-DEFORESTATION-OZONE', 'PHE-COMBINED-EVENTS-1T', 'PHE-COMBINED-EVENTS-2T', 'PHE-SPORTS-HEROES-FACTS'];
  for (const id of ids) { const c = corr.find(x => x.id === id); assert.ok(c, id); for (const l of c.replacement_lesson_ids) assert.ok(G1.includes(l)); assert.match(c.source_body_sha256, /^[0-9a-f]{64}$/); }
  const hs = corr.flatMap(c => [c.source_body_sha256, ...(c.previous_source_body_sha256 ?? [])]); assert.equal(hs.length, new Set(hs).size); assert.equal(corr.length, 63);
});
test('with a real capture, each G1 correction hash equals the current original row it withdraws', { skip: !process.env.JSS3_CAPTURE_DIR || !existsSync(`${process.env.JSS3_CAPTURE_DIR}/original-rows.json`) }, () => {
  const rows = JSON.parse(readFileSync(`${process.env.JSS3_CAPTURE_DIR}/original-rows.json`, 'utf8')) as any[];
  const want: Record<string, [string, string, number, string]> = { 'BS-BUSH-BURNING-OZONE': ['Basic Science', '1st Term', 5, 'BUSH BURNING'], 'BS-DEFORESTATION-OZONE': ['Basic Science', '1st Term', 7, 'DEFORESTATION'], 'PHE-COMBINED-EVENTS-1T': ['Physical & Health Education', '1st Term', 3, 'COMBINED EVENTS'], 'PHE-COMBINED-EVENTS-2T': ['Physical & Health Education', '2nd Term', 1, 'COMBINED EVENTS'], 'PHE-SPORTS-HEROES-FACTS': ['Physical & Health Education', '2nd Term', 3, 'NIGERIAN SPORTS HEROES AND HEROINE'] };
  for (const [id, [s, t, o, title]] of Object.entries(want)) { const r = rows.find(x => x.subjectName === s && x.termLabel === t && x.orderIndex === o); assert.equal(r.title, title); assert.equal(corr.find(x => x.id === id).source_body_sha256, sha(r.sourceReference), id); }
  assert.equal(rows.length, 313);
});

test('development windows do not diagnose normality or justify delayed screening', () => {
 const b = S.get('SUP-HE-CHILD-STAGES')!.body;
 assert.doesNotMatch(b, /no reason for worry|probably normal|neither an emergency/);
 assert.match(b, /health worker now/); assert.match(b, /not a screening clearance/);
});
test('economics distinguishes profit from sales revenue and omits unverified national shares', () => {
 const b = S.get('SUP-BS-ECON-RESOURCES')!.body;
 assert.match(b, /Profit is revenue minus/); assert.doesNotMatch(b, /41%|25%|one in three workers/);
 assert.ok(S.get('SUP-BS-ECON-RESOURCES')!.sources.some(x => x.url.includes('nigerianstat.gov.ng')));
});
test('confirmed athlete names have supporting records', () => {
 const b = S.get('SUP-PHE-NIGERIAN-HEROES')!.body;
 assert.match(b, /Modupe Oshikoya is confirmed/); assert.match(b, /Jerry Okorodudu is recorded/);
 assert.doesNotMatch(b, /first Nigerian to win two Olympic medals/);
});
