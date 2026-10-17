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

// ── Prompt 1: Yoruba semantic review (27 leads) ─────────────────────────────
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let row: string[] = []; let cur = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [head, ...rest] = rows; return rest.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
const csv = (rel: string) => parseCsv(readFileSync(path.join(here, '..', rel), 'utf8'));
const YO_NEW: Record<string, [string, string[]]> = {
  'SUP-YO-ISUNKI': ['1st Term', ['YO-SL-087']], 'SUP-YO-IBEERE': ['1st Term', ['YO-SL-099']], 'SUP-YO-CLAUSE-REL': ['1st Term', ['YO-SL-105']],
  'SUP-YO-OBATALA': ['1st Term', ['YO-SL-106']], 'SUP-YO-ORAL-TEXTS': ['2nd Term', ['YO-SL-323', 'YO-SL-327']],
};
test('Yoruba review lessons sit in the term the scheme names, with complete teaching, practice and marking', () => {
  validateJss3Supplements(JSS3_SUPPLEMENTS);
  for (const [id, [term, gaps]] of Object.entries(YO_NEW)) {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, 'Yoruba'); assert.equal(s.termLabel, term); assert.deepEqual(s.gapIds, gaps);
    assert.match(s.body, /Objectives:/); assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/); assert.match(s.body, /Assessment/);
    assert.match(s.origin, /not recovered/); assert.ok(s.sources.length >= 1 && s.sources.every(x => x.url.startsWith('https://')));
  }
});
test('new Yoruba lessons keep uncertain scheme terms uncertain and invent no traditional verse', () => {
  assert.match(byId('SUP-YO-ISUNKI').body, /'iparoje'[^.]*no source consulted defines it/); assert.match(byId('SUP-YO-ISUNKI').body, /no definition is invented/);
  assert.match(byId('SUP-YO-IBEERE').body, /inference, not confirmed/);
  const ob = byId('SUP-YO-OBATALA').body; assert.match(ob, /Ọbalúayé/); assert.match(ob, /unconfirmed/); assert.match(ob, /not taught in this lesson/);
  const t = byId('SUP-YO-ORAL-TEXTS'); assert.match(t.body, /No Ṣàngó pípè, Ọya pípè or iwì egúngún verse is supplied or invented/);
  assert.match(t.body, /First produced by the National Open University of Nigeria/); assert.match(t.body, /CC BY-SA 4\.0/); assert.match(t.body, /Kolawole 2023, CC BY/);
  assert.ok(t.sources.some(x => x.url.includes('10.17159/tl.v60i3.14628')) && t.sources.some(x => x.url.includes('ENG105_02.pdf')));
  // the excerpts are the only quoted chant lines; the genre lesson stays verse-free
  assert.match(byId('SUP-YO-ORAL-GENRES').body, /supplies no verses/);
});
test('all 27 Yoruba lead rows now carry an individually reviewed decision', () => {
  const closure = csv('docs/jss3/SEMANTIC_CLOSURE.csv'); const decisions = csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv');
  const yo = closure.filter(r => r.canonical_subject === 'Yoruba');
  assert.equal(yo.filter(r => ['LEAD_ONLY_NEEDS_READING', 'ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION'].includes(r.disposition)).length, 0);
  const ids = ['SL-087','SL-093','SL-095','SL-096','SL-097','SL-099','SL-100','SL-103','SL-105','SL-106','SL-111','SL-112','SL-113','SL-114','SL-322','SL-323','SL-324','SL-325','SL-326','SL-327','SL-343','SL-344','SL-349','SL-350','SL-351','SL-570','SL-572'];
  assert.equal(ids.length, 27);
  for (const id of ids) {
    const d = decisions.find(r => r.candidate_id === id); assert.ok(d, id); assert.ok(d.rationale.length > 20 && d.limitation.length > 5, id);
    const c = closure.find(r => r.candidate_id === id)!; assert.equal(c.disposition, d.disposition, id);
    if (d.support_kind === 'supplement') { const s = byId(d.row_filter); assert.ok(s, id); assert.ok(s.body.toLowerCase().includes(d.anchor_regex.toLowerCase()), `${id} anchor`); }
  }
  assert.equal(closure.find(r => r.candidate_id === 'SL-095')!.disposition, 'OWNER_INPUT_NEEDED_SET_TEXT');
  assert.equal(closure.find(r => r.candidate_id === 'SL-324')!.disposition, 'OWNER_INPUT_NEEDED_SET_TEXT');
});
test('records name each new Yoruba lesson and keep the open owner questions', () => {
  const impl = csv('docs/jss3/replacements/IMPLEMENTED_LESSONS.csv'); const cov = csv('docs/jss3/replacements/CURRENT_COVERAGE.csv'); const ob = csv('docs/jss3/OPEN_BLOCKERS.csv');
  for (const [id, [term, gaps]] of Object.entries(YO_NEW)) {
    const i = impl.find(r => r.id === id); assert.ok(i, id); assert.equal(i.term, term);
    for (const g of gaps) assert.ok(cov.some(r => r.id === g && r.supplement_ids.includes(id)), g);
  }
  assert.ok(ob.some(r => r.id === 'OB-10') && ob.some(r => r.id === 'OB-11'));
  assert.ok(!/remaining Yoruba/.test(ob.find(r => r.id === 'OB-01')!.next_action));
});
