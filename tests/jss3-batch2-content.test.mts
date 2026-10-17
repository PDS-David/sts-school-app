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

// ── Batch 2 English First-Term review (SL-180 to SL-221) ───────────────────────────────────────────
const EN_T1_ROWS = ['SL-180', 'SL-183', 'SL-191', 'SL-192', 'SL-198', 'SL-201', 'SL-202', 'SL-206', 'SL-207', 'SL-216', 'SL-217', 'SL-221'];
test('the twelve English First-Term lead rows each carry an individually reviewed decision', () => {
  const closure = csv('docs/jss3/SEMANTIC_CLOSURE.csv'); const decisions = csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv');
  const leads = ['LEAD_ONLY_NEEDS_READING', 'ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION'];
  for (const id of EN_T1_ROWS) {
    const d = decisions.find(r => r.candidate_id === id); assert.ok(d, id);
    assert.ok(d.rationale.startsWith('Read:') || d.support_kind === 'marker', `${id} rationale records what was read`);
    assert.ok(d.limitation.length > 5, id);
    const c = closure.find(r => r.candidate_id === id)!; assert.equal(c.canonical_subject, 'English Language', id);
    assert.equal(c.disposition, d.disposition, id); assert.ok(!leads.includes(c.disposition), id);
    if (d.support_kind === 'supplement') {
      const s = byId(d.row_filter); assert.ok(s, id); assert.equal(s.subjectName, 'English Language');
      assert.ok(s.body.toLowerCase().includes(d.anchor_regex.toLowerCase()), `${id} anchor`);
    }
    if (d.support_kind === 'original') assert.match(c.support_locator, /anchor_sha256=[0-9a-f]{16}; row_sha256=[0-9a-f]{16}; verified_by=SEMANTIC_DECISIONS\.csv/, id);
  }
  // Only the omission with no executable teaching at all closes as a new replacement, and only partially.
  assert.equal(closure.find(r => r.candidate_id === 'SL-202')!.disposition, 'REPLACEMENT_IMPLEMENTED_PARTIAL');
  // Partial coverage is never reported as complete.
  for (const id of ['SL-198', 'SL-221']) assert.equal(closure.find(r => r.candidate_id === id)!.disposition, 'ORIGINAL_LESSON_PARTIAL', id);
  for (const id of ['SL-192', 'SL-201', 'SL-206', 'SL-207', 'SL-217']) assert.equal(closure.find(r => r.candidate_id === id)!.disposition, 'EXISTING_SUPPLEMENT_PARTIAL', id);
});
test('SUP-VOWEL-ER is a complete attributed lesson appended to the English First-Term bucket', () => {
  const s = byId('SUP-VOWEL-ER'); assert.ok(s);
  assert.equal(s.subjectName, 'English Language'); assert.equal(s.termLabel, '1st Term'); assert.deepEqual(s.gapIds, ['EN1-11']);
  assert.match(s.origin, /not recovered/i); assert.ok(s.sources.length >= 2 && s.sources.every(x => x.url.startsWith('https://')));
  for (const part of [/Objectives:/, /Teaching:/, /Minimal pairs/, /Practice A/, /Practice B/, /Practice C/, /Answers and marking guide/]) assert.match(s.body, part);
  // Appended last in its subject/term bucket so no existing orderIndex moves.
  const bucket = JSS3_SUPPLEMENTS.filter(x => x.subjectName === 'English Language' && x.termLabel === '1st Term');
  assert.equal(bucket[bucket.length - 1].id, 'SUP-VOWEL-ER');
  // The printed symbols are not presented as established fact, and the lesson does not claim a recovered note.
  assert.match(s.body, /by inference/); assert.match(s.body, /not a recovered author's note/); assert.match(s.body, /cannot say what the printed \/c\/ was meant to be/);
  assert.match(s.body, /do not infer pronunciation accuracy from a correct written sort/);
  assert.doesNotMatch(s.body, /scheme (?:means|intends) \/ɔː\//);
});
test('records name SUP-VOWEL-ER and keep the English owner questions open', () => {
  const impl = csv('docs/jss3/replacements/IMPLEMENTED_LESSONS.csv'); const cov = csv('docs/jss3/replacements/CURRENT_COVERAGE.csv'); const ob = csv('docs/jss3/OPEN_BLOCKERS.csv');
  const i = impl.find(r => r.id === 'SUP-VOWEL-ER')!; assert.ok(i); assert.equal(i.term, '1st Term'); assert.equal(i.gap_ids, 'EN1-11'); assert.equal(i.order_index, '34');
  assert.ok(cov.some(r => r.id === 'EN1-11' && r.supplement_ids.includes('SUP-VOWEL-ER') && r.supplement_ids.includes('SUP-IPA')));
  const sched = csv('docs/jss3/replacements/TEACHER_SCHEDULE_SUPPLEMENTS.csv'); assert.ok(sched.some(r => r.supplement_id === 'SUP-VOWEL-ER' && r.term === '1st Term'));
  const o12 = ob.find(r => r.id === 'OB-12')!; assert.ok(o12); assert.match(o12.detail, /recommended/); assert.match(o12.detail, /by inference/);
  assert.match(ob.find(r => r.id === 'OB-01')!.next_action, /English/);
});

// ── Batch 2 English Third-Term scheme lines (SL-501 to SL-514) ─────────────────────────────────────
const EN_T3_ROWS = ['SL-501', 'SL-502', 'SL-503', 'SL-505', 'SL-506', 'SL-507', 'SL-509', 'SL-510', 'SL-511', 'SL-512', 'SL-513', 'SL-514'];
test('the twelve English Third-Term lead rows are decided without inventing past questions or Third-Term content', () => {
  const closure = csv('docs/jss3/SEMANTIC_CLOSURE.csv'); const decisions = csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv');
  for (const id of EN_T3_ROWS) {
    const d = decisions.find(r => r.candidate_id === id); assert.ok(d, id); assert.ok(d.rationale.length > 40 && d.limitation.length > 5, id);
    const c = closure.find(r => r.candidate_id === id)!; assert.equal(c.canonical_subject, 'English Language', id); assert.equal(c.disposition, d.disposition, id);
    assert.ok(!['LEAD_ONLY_NEEDS_READING', 'ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION'].includes(c.disposition), id);
    if (d.support_kind === 'supplement') { const s = byId(d.row_filter); assert.ok(s, id); assert.ok(s.body.toLowerCase().includes(d.anchor_regex.toLowerCase()), `${id} anchor`); }
    if (d.support_kind === 'original') assert.match(c.support_locator, /anchor_sha256=[0-9a-f]{16}; row_sha256=[0-9a-f]{16}; verified_by=SEMANTIC_DECISIONS\.csv/, id);
  }
  // Past-question lines stay open for the owner; they are not closed by stand-in practice.
  for (const id of ['SL-513', 'SL-514']) assert.equal(closure.find(r => r.candidate_id === id)!.disposition, 'OWNER_INPUT_NEEDED_PAST_QUESTIONS', id);
  for (const id of ['SL-502', 'SL-506']) assert.equal(closure.find(r => r.candidate_id === id)!.disposition, 'EXISTING_SUPPLEMENT_PARTIAL', id);
  assert.equal(closure.find(r => r.candidate_id === 'SL-501')!.disposition, 'STRUCTURAL_MARKER');
  // All 24 English leads are now reviewed.
  const en = closure.filter(r => r.canonical_subject === 'English Language');
  assert.equal(en.filter(r => ['LEAD_ONLY_NEEDS_READING', 'ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION'].includes(r.disposition)).length, 0);
  assert.equal(EN_T1_ROWS.length + EN_T3_ROWS.length, 24);
  // No supplement exists for Third Term, and no past-paper lesson was added.
  assert.ok(JSS3_SUPPLEMENTS.every(s => s.termLabel !== ('3rd Term' as string)));
  assert.ok(!JSS3_SUPPLEMENTS.some(s => /past (?:question|paper)/i.test(s.title)));
});
test('OB-13 keeps the past-question gap and OB-01 records English as fully reviewed', () => {
  const ob = csv('docs/jss3/OPEN_BLOCKERS.csv'); const o13 = ob.find(r => r.id === 'OB-13')!; assert.ok(o13);
  assert.match(o13.detail, /none is invented/); assert.match(o13.detail, /zero executable rows/);
  const o1 = ob.find(r => r.id === 'OB-01')!; assert.match(o1.next_action, /English \(all 24 English leads/); assert.doesNotMatch(o1.next_action, /Not yet reviewed:[^.]*English/);
});
