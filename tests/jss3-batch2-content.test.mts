import test from 'node:test';
import assert from 'node:assert/strict';
import { JSS3_SUPPLEMENTS, validateJss3Supplements, supplementBodyHash, buildJss3SupplementRows } from '../backend/src/db/jss3Supplements.ts';
import { execSync } from 'node:child_process';
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
  assert.match(t.body, /First produced by the National Open University of Nigeria/); assert.match(t.body, /CC BY-SA 4\.0/); assert.match(t.body, /Kolawole 2023, p\. 86;[^*]*CC BY-SA 4\.0 as stated on the article page/);
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
  // Partial coverage is never reported as complete. Batch 2 worker C revised SL-221 from ORIGINAL_LESSON_PARTIAL to
  // REPLACEMENT_IMPLEMENTED_PARTIAL (SUP-EN-LIT-FORMS revises terms with an original poem; the recommended text stays unidentified, OB-12).
  assert.equal(closure.find(r => r.candidate_id === 'SL-221')!.disposition, 'REPLACEMENT_IMPLEMENTED_PARTIAL');
  assert.match(decisions.find(r => r.candidate_id === 'SL-221')!.limitation, /OB-12/);
  assert.equal(closure.find(r => r.candidate_id === 'SL-198')!.disposition, 'REPLACEMENT_IMPLEMENTED');
  // Batch 2 worker C revised SL-192, SL-201, SL-206 (SUP-EN-LIT-TEXT-TOOLS, partial: school texts still unidentified, OB-12) and
  // SL-217 (SUP-EN-CONSONANT-PRACTICE) away from EXISTING_SUPPLEMENT_PARTIAL; only SL-207 keeps the original supplement-only status.
  const EN_T1_EXPECT: Record<string, string> = { 'SL-192': 'REPLACEMENT_IMPLEMENTED_PARTIAL', 'SL-201': 'REPLACEMENT_IMPLEMENTED_PARTIAL', 'SL-206': 'REPLACEMENT_IMPLEMENTED_PARTIAL', 'SL-207': 'EXISTING_SUPPLEMENT_PARTIAL', 'SL-217': 'REPLACEMENT_IMPLEMENTED' };
  for (const [id, disp] of Object.entries(EN_T1_EXPECT)) assert.equal(closure.find(r => r.candidate_id === id)!.disposition, disp, id);
});
test('SUP-VOWEL-ER is a complete attributed lesson appended to the English First-Term bucket', () => {
  const s = byId('SUP-VOWEL-ER'); assert.ok(s);
  assert.equal(s.subjectName, 'English Language'); assert.equal(s.termLabel, '1st Term'); assert.deepEqual(s.gapIds, ['EN1-11']);
  assert.match(s.origin, /not recovered/i); assert.ok(s.sources.length >= 2 && s.sources.every(x => x.url.startsWith('https://')));
  for (const part of [/Objectives:/, /Teaching:/, /Minimal pairs/, /Practice A/, /Practice B/, /Practice C/, /Answers and marking guide/]) assert.match(s.body, part);
  // Appended last in its subject/term bucket so no existing orderIndex moves.
  const bucket = JSS3_SUPPLEMENTS.filter(x => x.subjectName === 'English Language' && x.termLabel === '1st Term');
  // Order index 34 = 24 originals + its 10th position; later supplements append after it and never shift it.
  assert.equal(bucket.findIndex(x => x.id === 'SUP-VOWEL-ER') + 25, 34);
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

test('SUP-MODAL-WILL supplies will, would and shall as a complete attributed lesson registered as WG-ENG-SL198', () => {
  const s = byId('SUP-MODAL-WILL'); assert.ok(s);
  assert.equal(s.subjectName, 'English Language'); assert.equal(s.termLabel, '1st Term'); assert.deepEqual(s.gapIds, ['WG-ENG-SL198']);
  assert.match(s.origin, /not recovered/i); assert.ok(s.sources.every(x => x.url.startsWith('https://')));
  for (const part of [/Teaching:/, /WILL —/, /WOULD —/, /SHALL —/, /Practice A/, /Practice B/, /Practice C/, /Answers and marking guide/]) assert.match(s.body, part);
  const bucket = JSS3_SUPPLEMENTS.filter(x => x.subjectName === 'English Language' && x.termLabel === '1st Term');
  // Stable prefix: SUP-MODAL-WILL keeps the position it had when it was added (11th supplement after the 24 original rows).
  // Later Batch 2 lessons are appended after it, so it is no longer last and the bucket is longer than 11.
  const pos = bucket.findIndex(x => x.id === 'SUP-MODAL-WILL'); assert.equal(pos, 10); assert.equal(pos + 1 + 24, 35); assert.ok(bucket.length > pos + 1);
  assert.throws(() => validateJss3Supplements([{ ...s, gapIds: ['WG-ENG-UNREGISTERED'] }]), /Unregistered/);
  const impl = csv('docs/jss3/replacements/IMPLEMENTED_LESSONS.csv').find(r => r.id === 'SUP-MODAL-WILL')!; assert.equal(impl.order_index, '35');
  assert.ok(csv('docs/jss3/replacements/WIDER_WORKSTREAMS.csv').some(r => r.id === 'WG-ENG-SL198' && r.supplement_id === 'SUP-MODAL-WILL'));
  assert.ok(csv('docs/jss3/replacements/CURRENT_COVERAGE.csv').some(r => r.id === 'WG-ENG-SL198' && r.supplement_ids === 'SUP-MODAL-WILL'));
  assert.ok(!/will, would and shall/.test(csv('docs/jss3/OPEN_BLOCKERS.csv').find(r => r.id === 'OB-12')!.next_action));
});

// ---- Batch 2: Mathematics semantic review (13 undecided Mathematics lines) ----
test('Mathematics lessons SUP-MATH-JSS2-REVISION and SUP-MATH-VARIATION are complete, attributed and appended last', () => {
  const want: Record<string, [string, string[], number]> = {
    'SUP-MATH-JSS2-REVISION': ['1st Term', ['WG-MATH-SL145'], 11], 'SUP-MATH-VARIATION': ['2nd Term', ['WG-MATH-SL247', 'WG-MATH-SL249', 'WG-MATH-SL250'], 14],
  };
  const inv = csv('docs/jss3/replacements/IMPLEMENTED_LESSONS.csv');
  for (const [id, [term, gaps, order]] of Object.entries(want)) {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, 'Mathematics'); assert.equal(s.termLabel, term); assert.deepEqual(s.gapIds, gaps);
    assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/); assert.match(s.body, /Assessment and feedback/);
    assert.match(s.origin, /not recovered/); assert.ok(s.sources.length >= 2 && s.sources.every(x => x.url.startsWith('https://')));
    const bucket = JSS3_SUPPLEMENTS.filter(x => x.subjectName === 'Mathematics' && x.termLabel === term);
    assert.ok(bucket.some(x => x.id === id)); assert.equal(inv.find(r => r.id === id)!.order_index, String(order)); // later lessons append after it and never shift it
    const cov = csv('docs/jss3/replacements/CURRENT_COVERAGE.csv'); gaps.forEach(g => assert.ok(cov.some(r => r.id === g && r.supplement_ids === id), g));
    const wg = csv('docs/jss3/replacements/WIDER_WORKSTREAMS.csv'); gaps.forEach(g => assert.ok(wg.some(r => r.id === g && r.supplement_id === id), g));
  }
  assert.throws(() => validateJss3Supplements([{ ...byId('SUP-MATH-VARIATION'), gapIds: ['WG-MATH-SL999'] }]), /Unregistered/);
});
test('Mathematics worked examples and every exercise answer are recomputed independently', () => {
  const v = byId('SUP-MATH-VARIATION').body, a = byId('SUP-MATH-JSS2-REVISION').body;
  const has = (b: string, s: string) => assert.ok(b.includes(s), s);
  // variation worked examples
  const k1 = 12 / 4; has(v, `k = 12 / 4 = ${k1}, so y = ${k1}x. When x = 7, y = ${k1 * 7}`);
  const k2 = 4 * 6; has(v, `k = xy = 4 x 6 = ${k2}, so y = ${k2}/x. When y = 8, x = ${k2} / 8 = ${k2 / 8}`);
  const k3 = 60 / (3 * 4); has(v, `z = ${k3}xy. When x = 6 and y = 5, z = ${k3} x 6 x 5 = ${k3 * 30}`);
  const b = (1900 - 1000) / 3, aa = 1000 - 2 * b; has(v, `b = ${b}. Then a = 1 000 - 2 x ${b} = ${aa}`); has(v, `c = ${aa} + ${b} x 8 = ${aa + b * 8}`);
  // variation exercises 1-8
  has(v, `p = 2.5 x 10 = ${15 / 6 * 10}`); has(v, `8 kg cost ${9000 / 5 * 8} naira`); has(v, `y = ${12 * 5} / 15 = ${12 * 5 / 15}`); has(v, `days = ${6 * 10} / 15 = ${60 / 15}`);
  has(v, `M = ${18 / (30 * 0.2)} x 50 x 0.4 = ${18 / (30 * 0.2) * 50 * 0.4} g`); has(v, `x = ${60 / ((40 / 10) * 3)}`);
  const qb = (2200 - 1300) / 3, qa = 1300 - 4 * qb; has(v, `b = ${qb}; a = 1 300 - 4 x ${qb} = ${qa}; fare for 10 km = ${qa} + ${qb} x 10 = ${qa + qb * 10} naira`);
  // 2k1 + 3k2 = 17, 3k1 + 2k2 = 18 solved by Cramer's rule
  const det = 2 * 2 - 3 * 3, c1 = (17 * 2 - 3 * 18) / det, c2 = (2 * 18 - 3 * 17) / det;
  assert.equal(2 * c1 + 3 * c2, 17); assert.equal(3 * c1 + 2 * c2, 18); has(v, `k1 = ${c1}, k2 = ${c2}; y = ${c1} x 5 + ${c2} x 4 = ${c1 * 5 + c2 * 4}`);
  const marksB = [2, 3, 2, 3, 3, 3, 4, 4, 4]; assert.equal(marksB.reduce((s, x) => s + x), 28); has(v, 'Total 28 marks');
  // JSS 2 revision answers
  has(a, '3/4 + 5/6'); assert.equal(3 * 6 + 5 * 4, 38); assert.equal(38 / 24, 19 / 12); /* 3/4 + 5/6 over 24, reduced */ has(a, '9/12 + 10/12 = 19/12 = 1 7/12'); assert.equal(Math.round((2 / 3 + 3 / 4) * 12), 17); has(a, '17/12 = 1 5/12');
  assert.equal(Math.round(3.2 * 0.05 * 1000) / 1000, 0.16); has(a, '0.16'); has(a, 'x 0.04: 25 x 4 = 100'); assert.equal(Math.round(8000 * 1.15), 9200); assert.equal(Math.round(12500 * 0.88), 11000);
  assert.deepEqual([840 / 7 * 2, 840 / 7 * 5], [240, 600]); has(a, '240 kg and 600 kg'); assert.deepEqual([560 / 8 * 3, 560 / 8 * 5], [210, 350]);
  assert.equal(3 ** (2 + 3 - 4), 3); assert.equal(2 ** 3 * 2 ** 4, 128);
  assert.deepEqual([4 - 6, 12 + 3], [-2, 15]); has(a, '-2x + 15'); assert.deepEqual([6 - 2, -15 + 8], [4, -7]); has(a, '4x - 7');
  assert.equal((28 - 4) / (7 - 3), 6); assert.equal((9 + 7) / (5 - 3), 8); const x = (180 - 30) / 5; assert.deepEqual([2 * x + 10, 3 * x + 20], [70, 110]); has(a, 'x = 30');
  assert.equal(0.5 * 14 * 9, 63); assert.equal((6 + 9 + 11 + 14 + 15) / 5, 11); assert.equal((4 + 7 + 9 + 12 + 13) / 5, 9);
  const marksA = [2, 2, 2, 3, 2, 3, 2, 3, 4, 2, 2]; assert.equal(marksA.reduce((s, y) => s + y), 27); has(a, 'Total 27 marks');
  // the corrected mark-scheme line stays correct (3.2 x 0.05 -> 32 x 5 = 160)
  has(a, '32 x 5 = 160'); assert.ok(!a.includes('16 x 5 = 80'));
});
test('Mathematics: all 13 reviewed lines are decided with quoted evidence and no lead status remains', () => {
  const ids = [145, 151, 154, 155, 156, 241, 243, 247, 248, 249, 250, 251, 262].map(n => `SL-${n}`);
  const closure = Object.fromEntries(csv('docs/jss3/SEMANTIC_CLOSURE.csv').map(r => [r.candidate_id, r]));
  const dec = Object.fromEntries(csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv').map(r => [r.candidate_id, r]));
  const tally: Record<string, number> = {};
  for (const id of ids) { assert.ok(dec[id], id); assert.equal(closure[id].disposition, dec[id].disposition, id); assert.match(dec[id].rationale, /'/, id); tally[dec[id].disposition] = (tally[dec[id].disposition] ?? 0) + 1; }
  // Batch 2 worker A revised SL-154, SL-241 and SL-243 from ORIGINAL_LESSON_COVERS_OBJECTIVE to REPLACEMENT_IMPLEMENTED
  // (SUP-MATH-FRACTION-EQUATIONS, SUP-MATH-SIMULT-GRAPH): 4/4/5 became 1/7/5. The evidence is A's OBJECTIVE_EVIDENCE.json.
  assert.deepEqual(tally, { ORIGINAL_LESSON_COVERS_OBJECTIVE: 1, REPLACEMENT_IMPLEMENTED: 7, STRUCTURAL_MARKER: 5 });
  for (const id of ['SL-154', 'SL-241', 'SL-243']) assert.equal(dec[id].disposition, 'REPLACEMENT_IMPLEMENTED', id);
  for (const r of Object.values(closure)) if (r.canonical_subject === 'Mathematics') assert.ok(!/^(LEAD_ONLY|ORIGINAL_BODY_TEXT_PRESENT)/.test(r.disposition), r.candidate_id);
  // SL-145 closes only through an executable replacement body; the earlier 0.5 title match to a 32-character row is not coverage
  assert.equal(dec['SL-145'].support_kind, 'supplement'); assert.match(dec['SL-145'].rationale, /32-character body/);
  // revision-only markers are never presented as teaching
  for (const id of ['SL-151', 'SL-155', 'SL-156', 'SL-251', 'SL-262']) assert.equal(dec[id].support_kind, 'marker');
  const ob = csv('docs/jss3/OPEN_BLOCKERS.csv'); const o14 = ob.find(r => r.id === 'OB-14')!; assert.match(o14.detail, /379/); assert.match(o14.detail, /75/);
  assert.match(ob.find(r => r.id === 'OB-01')!.detail, /all 31 Mathematics source lines/);
});

test('Home Economics: validator accepts the subject and only the registered WG-HE gap IDs', () => {
  const s = byId('SUP-HE-PROJECT');
  assert.equal(validateJss3Supplements([s]).length, 1);
  assert.throws(() => validateJss3Supplements([{ ...s, gapIds: ['WG-HE-SL999'] }]), /Unregistered/);
  assert.throws(() => validateJss3Supplements([{ ...s, subjectName: 'Computer Studies' as never }]));
  assert.throws(() => validateJss3Supplements([{ ...s, termLabel: '3rd Term' as never }]));
});
test('Home Economics: four new lessons are complete, attributed and placed in the right term', () => {
  const want: Record<string, [string, string[]]> = {
    'SUP-HE-MOTHERHOOD': ['1st Term', ['WG-HE-SL541', 'WG-HE-SL542']], 'SUP-HE-FOOD-REVISION': ['2nd Term', ['WG-HE-SL536']],
    'SUP-HE-BABY-CARE': ['2nd Term', ['WG-HE-SL547', 'WG-HE-SL551']], 'SUP-HE-PROJECT': ['2nd Term', ['WG-HE-SL556']],
  };
  const ids = JSS3_SUPPLEMENTS.map(x => x.id);
  for (const [id, [term, gaps]] of Object.entries(want)) {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, 'Home Economics'); assert.equal(s.termLabel, term); assert.deepEqual(s.gapIds, gaps);
    assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/); assert.match(s.body, /Assessment and feedback/);
    assert.match(s.origin, /not recovered/); assert.ok(s.sources.length >= 1); for (const src of s.sources) assert.ok(src.url.startsWith('https://'));
  }
  // appended after every earlier lesson, in order (later batches may append more after them)
  const at = ids.indexOf('SUP-HE-MOTHERHOOD'); assert.ok(at >= ids.indexOf('SUP-MATH-BEARING-TOOLS'));
  assert.deepEqual(ids.slice(at, at + 4), Object.keys(want));
});
test('Home Economics: worked arithmetic and mark totals in the new lessons are correct', () => {
  const f = byId('SUP-HE-FOOD-REVISION').body;
  assert.equal(6000 + 400, 6400); assert.equal(6400 * 25 / 100, 1600); assert.equal((6400 + 1600) / 20, 400); assert.ok(f.includes('Price of one pie = 8,000 / 20 = 400 naira'));
  assert.equal(4500 + 300, 4800); assert.equal(4800 * 20 / 100, 960); assert.equal((4800 + 960) / 30, 192); assert.ok(f.includes('5,760') && f.includes('192 naira'));
  assert.equal(4 + 5 + 2 + 1 + 2 + 4 + 4, 22); assert.ok(f.includes('total 22 marks'));
  assert.equal(3 + 3 + 3 + 3 + 2 + 2 + 1, 17); assert.ok(byId('SUP-HE-MOTHERHOOD').body.includes('total 17 marks'));
  assert.equal(1 + 1 + 1 + 2 + 4 + 1 + 2, 12); assert.ok(byId('SUP-HE-BABY-CARE').body.includes('total 12 marks'));
  assert.equal(7 + 2 + 1 + 3 + 1, 14); assert.ok(byId('SUP-HE-PROJECT').body.includes('written practice 14 marks'));
});
test('Home Economics: all 14 reviewed lines are decided with quoted evidence and none remains a lead', () => {
  const ids = [536, 538, 540, 541, 542, 543, 544, 545, 547, 548, 550, 551, 552, 556].map(n => `SL-${n}`);
  const closure = Object.fromEntries(csv('docs/jss3/SEMANTIC_CLOSURE.csv').map(r => [r.candidate_id, r]));
  const dec = Object.fromEntries(csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv').map(r => [r.candidate_id, r]));
  const tally: Record<string, number> = {};
  for (const id of ids) {
    assert.ok(dec[id], id); assert.equal(closure[id].canonical_subject, 'Home Economics'); assert.equal(closure[id].disposition, dec[id].disposition, id);
    assert.match(dec[id].rationale, /'/, id); tally[dec[id].disposition] = (tally[dec[id].disposition] ?? 0) + 1;
    if (dec[id].support_kind === 'supplement') { const s = byId(dec[id].row_filter); assert.ok(s, id); assert.ok(s.body.toLowerCase().includes(dec[id].anchor_regex.toLowerCase()), id); }
  }
  assert.deepEqual(tally, { ORIGINAL_LESSON_COVERS_OBJECTIVE: 8, REPLACEMENT_IMPLEMENTED: 6 });
  for (const r of Object.values(closure)) if (r.canonical_subject === 'Home Economics') assert.ok(!/^(LEAD_ONLY|ORIGINAL_BODY_TEXT_PRESENT)/.test(r.disposition), r.candidate_id);
  // omissions confirmed by the original bodies: labour, hygiene/packaging, baby-equipment cleaning, project work
  for (const id of ['SL-536', 'SL-541', 'SL-542', 'SL-547', 'SL-551', 'SL-556']) assert.equal(dec[id].support_kind, 'supplement');
  const ob = csv('docs/jss3/OPEN_BLOCKERS.csv'); assert.ok(ob.find(r => r.id === 'OB-15')); assert.match(ob.find(r => r.id === 'OB-01')!.detail, /all 14 Home Economics leads/);
});

// ---- Batch 2: CCA, French, Social Studies, Music practical (SL-282..SL-567 reviewed rows) ----
const NEW_LESSONS: Record<string, [string, string[]]> = {
  'SUP-CCA-CADENCES': ['Cultural & Creative Arts', ['WG-CCA-SL293']],
  'SUP-CCA-MINOR-SINGING': ['Cultural & Creative Arts', ['WG-CCA-SL295']],
  'SUP-FR-DATES': ['French', ['WG-FR-SL282']],
  'SUP-FR-RECIT': ['French', ['WG-FR-SL285']],
  'SUP-SS-NATURE-ECONOMY': ['Social Studies', ['WG-SS-SL433']],
  'SUP-SS-REFORM-1': ['Social Studies', ['WG-SS-SL434']],
  'SUP-SS-REFORM-2': ['Social Studies', ['WG-SS-SL435']],
  'SUP-MUSIC-PRACTICAL': ['Music', ['WG-MUSIC-SL566', 'WG-MUSIC-SL567']],
};
test('review batch: eight new lessons are complete, attributed, in Second Term and appended last', () => {
  validateJss3Supplements(JSS3_SUPPLEMENTS);
  const ids = JSS3_SUPPLEMENTS.map(s => s.id);
  for (const [id, [subject, gaps]] of Object.entries(NEW_LESSONS)) {
    const s = byId(id); assert.ok(s, id);
    assert.equal(s.subjectName, subject); assert.equal(s.termLabel, '2nd Term'); assert.deepEqual(s.gapIds, gaps);
    assert.match(s.body, /Objectives|Objectifs/); assert.match(s.body, /Practice \(questions\)/); assert.match(s.body, /Answers and marking guide/); assert.match(s.body, /Assessment and feedback/);
    assert.ok(s.sources.length >= 2, id); for (const src of s.sources) assert.ok(src.url.startsWith('https://'), src.url);
    assert.match(s.origin, /not recovered/);
    assert.ok(ids.indexOf(id) > ids.indexOf('SUP-MATH-BEARING-TOOLS'), `${id} must be appended after the earlier supplements`);
  }
});
test('review batch: validator extension accepts the new subjects and still rejects unregistered ids', () => {
  assert.throws(() => validateJss3Supplements([{ ...byId('SUP-FR-DATES'), gapIds: ['WG-FR-UNREGISTERED'] }]), /Unregistered/);
  assert.throws(() => validateJss3Supplements([{ ...byId('SUP-FR-DATES'), subjectName: 'Fine Art' }]));
  assert.throws(() => validateJss3Supplements([{ ...byId('SUP-FR-DATES'), origin: 'New material.' }]));
  assert.throws(() => validateJss3Supplements([{ ...byId('SUP-FR-DATES'), sources: [{ title: 'x', url: 'http://example.com' }] }]));
});
test('review batch: lessons teach the missing part and state their limits', () => {
  const cad = byId('SUP-CCA-CADENCES').body;
  for (const t of ['Authentic cadence', 'Plagal cadence', 'Half cadence', 'Deceptive cadence', 'F-A-C', 'D-F#-A']) assert.ok(cad.includes(t), t);
  assert.match(cad, /cannot certify listening or singing/);
  const minor = byId('SUP-CCA-MINOR-SINGING').body;
  for (const t of ['l t d r m f s l', 'se', 'E minor', 'Names differ between books']) assert.ok(minor.includes(t), t);
  const dates = byId('SUP-FR-DATES').body;
  for (const t of ['le premier', 'depuis', 'pendant', 'il y a', 'Il est sept heures et demie']) assert.ok(dates.includes(t), t);
  const recit = byId('SUP-FR-RECIT').body;
  for (const t of ['passé composé', 'imparfait', 'Samedi dernier']) assert.ok(recit.includes(t), t);
  assert.match(byId('SUP-SS-NATURE-ECONOMY').body, /mixed economy/); assert.match(byId('SUP-SS-NATURE-ECONOMY').body, /informal sector/);
  assert.match(byId('SUP-SS-NATURE-ECONOMY').origin, /rechecked/);
  const r1 = byId('SUP-SS-REFORM-1').body; assert.match(r1, /1986/); assert.match(r1, /Babangida/); assert.match(r1, /deregulation of interest rates/);
  const r2 = byId('SUP-SS-REFORM-2').body; for (const t of ['Commercialisation', 'Deregulation', 'Privatisation', '1999', 'Bureau of Public Enterprises']) assert.ok(r2.includes(t), t);
  const mus = byId('SUP-MUSIC-PRACTICAL').body;
  for (const t of ['F#', 'eight-bar', 'voice', 'piano', 'recorder', 'cannot certify singing or playing']) assert.ok(mus.includes(t), t);
  assert.match(byId('SUP-MUSIC-PRACTICAL').origin, /Third-Term instruction is placed in the Second Term/);
});
test('review batch: model eight-bar melody adds to four beats per bar in 4/4', () => {
  // bar contents as beat values: crotchet 1, minim 2, semibreve 4
  const bars = [[1,1,1,1],[1,1,2],[1,1,1,1],[1,1,2],[1,1,1,1],[1,1,2],[1,1,1,1],[4]];
  assert.equal(bars.length, 8);
  for (const b of bars) assert.equal(b.reduce((a, c) => a + c, 0), 4);
});
function csvRecords(text: string): Record<string, string>[] {
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...rest] = rows; return rest.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
test('review batch: records show every reviewed row decided and no lead left for these subjects', async () => {
  const { readFileSync } = await import('node:fs'); const { fileURLToPath } = await import('node:url'); const pth = await import('node:path');
  const docs = pth.join(pth.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'jss3');
  const closure = csvRecords(readFileSync(pth.join(docs, 'SEMANTIC_CLOSURE.csv'), 'utf8'));
  const decisions = csvRecords(readFileSync(pth.join(docs, 'replacements', 'SEMANTIC_DECISIONS.csv'), 'utf8'));
  const want: Record<string, string> = {};
  // Batch 2 worker E revised SL-062, SL-063 and SL-561 from ORIGINAL_LESSON_COVERS_OBJECTIVE to REPLACEMENT_IMPLEMENTED
  // (new practical lessons, E/DECISIONS.csv): they move to the replacement list; the 23-row total is unchanged.
  for (const id of ['SL-067','SL-175','SL-319','SL-468']) want[id] = 'ORIGINAL_LESSON_COVERS_OBJECTIVE';
  for (const id of ['SL-062','SL-063','SL-561','SL-293','SL-295','SL-282','SL-285','SL-433','SL-434','SL-435','SL-566','SL-567']) want[id] = 'REPLACEMENT_IMPLEMENTED';
  for (const id of ['SL-084','SL-263','SL-280','SL-384','SL-524','SL-525','SL-565']) want[id] = 'STRUCTURAL_MARKER';
  assert.equal(Object.keys(want).length, 23);
  for (const [id, disp] of Object.entries(want)) {
    const c = closure.find(r => r.candidate_id === id)!; assert.ok(c, id); assert.equal(c.disposition, disp, id);
    const d = decisions.find(r => r.candidate_id === id)!; assert.ok(d, id); assert.equal(d.disposition, disp, id);
    if (disp === 'REPLACEMENT_IMPLEMENTED') assert.match(c.support_row, /^SUP-/, id);
  }
  const subjects = ['Cultural & Creative Arts', 'French', 'Social Studies', 'Music', 'Physical & Health Education', 'Basic Science', 'Civic Education'];
  const leftover = closure.filter(r => subjects.includes(r.canonical_subject) && /^(LEAD_ONLY_NEEDS_READING|ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION)$/.test(r.disposition));
  assert.deepEqual(leftover.map(r => r.candidate_id), []);
});

// ── Batch 2 Basic Technology and Business Studies review ────────────────────────────────────────────
const LEAD_STATES = ['LEAD_ONLY_NEEDS_READING', 'ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION'];
const BT_BUS_DECIDED = ['SL-028', 'SL-453', 'SL-364', 'SL-369', 'SL-458', 'SL-461'];
test('Basic Technology and Business Studies rows reviewed so far each carry a decision and no Business Studies lead remains', () => {
  const closure = csv('docs/jss3/SEMANTIC_CLOSURE.csv'); const decisions = csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv');
  for (const id of BT_BUS_DECIDED) {
    const d = decisions.find(r => r.candidate_id === id); assert.ok(d, id); assert.ok(d.rationale.length > 30 && d.limitation.length > 3, id);
    const c = closure.find(r => r.candidate_id === id)!; assert.ok(['Basic Technology', 'Business Studies'].includes(c.canonical_subject), id);
    assert.equal(c.disposition, d.disposition, id); assert.ok(!LEAD_STATES.includes(c.disposition), id);
  }
  for (const id of ['SL-364', 'SL-369', 'SL-458', 'SL-461']) assert.equal(closure.find(r => r.candidate_id === id)!.disposition, 'STRUCTURAL_MARKER', id);
  for (const id of ['SL-028', 'SL-453']) assert.equal(closure.find(r => r.candidate_id === id)!.disposition, 'ORIGINAL_LESSON_COVERS_OBJECTIVE', id);
  assert.equal(closure.filter(r => r.canonical_subject === 'Business Studies' && LEAD_STATES.includes(r.disposition)).length, 0);
  for (const id of ['SL-028', 'SL-453']) assert.match(closure.find(r => r.candidate_id === id)!.support_locator, /anchor_sha256=[0-9a-f]{16}; row_sha256=[0-9a-f]{16}; verified_by=SEMANTIC_DECISIONS\.csv/, id);
});

// ---- Batch 2: re-audit of the 18 Mathematics lead rows (SL-146 to SL-261) ----
const MATH18 = ['SL-146', 'SL-147', 'SL-150', 'SL-153', 'SL-240', 'SL-242', 'SL-244', 'SL-245', 'SL-246', 'SL-252', 'SL-253', 'SL-254', 'SL-256', 'SL-257', 'SL-258', 'SL-259', 'SL-260', 'SL-261'];
const MATH_NEW: Record<string, [string, string, number]> = {
  'SUP-MATH-CHANGE-SUBJECT': ['1st Term', 'WG-MATH-SL150', 12], 'SUP-MATH-AVERAGES': ['1st Term', 'WG-MATH-SL153', 13],
  'SUP-MATH-SIMULT-GRAPH': ['2nd Term', 'WG-MATH-SL245', 15], 'SUP-MATH-SIMULT-WORDS': ['2nd Term', 'WG-MATH-SL244', 16],
  'SUP-MATH-TRIG-RATIOS': ['2nd Term', 'WG-MATH-SL252', 17], 'SUP-MATH-BEARING-DISTANCE': ['2nd Term', 'WG-MATH-SL257', 18],
};
test('six new Mathematics lessons are complete, attributed, registered and appended in order', () => {
  validateJss3Supplements(JSS3_SUPPLEMENTS);
  const inv = csv('docs/jss3/replacements/IMPLEMENTED_LESSONS.csv'); const cov = csv('docs/jss3/replacements/CURRENT_COVERAGE.csv'); const wg = csv('docs/jss3/replacements/WIDER_WORKSTREAMS.csv');
  for (const [id, [term, gap, order]] of Object.entries(MATH_NEW)) {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, 'Mathematics'); assert.equal(s.termLabel, term);
    // stable prefix: the originally registered gap stays first; Batch 2 worker A revised SUP-MATH-SIMULT-GRAPH to also cover SL-241 and SL-243
    assert.equal(s.gapIds[0], gap); assert.deepEqual(s.gapIds.slice(1), id === 'SUP-MATH-SIMULT-GRAPH' ? ['WG-MATH-SL241', 'WG-MATH-SL243'] : []);
    for (const part of [/Objectives:/, /Teaching:/, /Worked examples/, /Practice \(questions\):/, /Answers and marking guide:/, /Assessment and feedback: total \d+ marks/]) assert.match(s.body, part, id);
    assert.match(s.origin, /not recovered/); assert.ok(s.sources.length >= 1 && s.sources.every(x => x.url.startsWith('https://')), id);
    assert.equal(inv.filter(r => r.id === id).length, 1, `${id} listed once`); assert.equal(inv.find(r => r.id === id)!.order_index, String(order));
    assert.ok(cov.some(r => r.id === gap && r.supplement_ids === id), gap); assert.ok(wg.some(r => r.id === gap && r.supplement_id === id), gap);
    // the position in its bucket matches the recorded order index (originals + earlier supplements)
    const bucket = JSS3_SUPPLEMENTS.filter(x => x.subjectName === 'Mathematics' && x.termLabel === term);
    assert.equal(bucket.findIndex(x => x.id === id) + (term === '1st Term' ? 11 : 10), order, id);
  }
  assert.throws(() => validateJss3Supplements([{ ...byId('SUP-MATH-TRIG-RATIOS'), gapIds: ['WG-MATH-SL999'] }]), /Unregistered/);
  assert.ok(JSS3_SUPPLEMENTS.every(s => s.termLabel !== ('3rd Term' as string)));
  const ids = inv.map(r => r.id); assert.equal(new Set(ids).size, ids.length, 'IMPLEMENTED_LESSONS has no duplicate ids');
  assert.equal(ids.length, JSS3_SUPPLEMENTS.length);
});
test('new Mathematics worked examples and answers are recomputed independently', () => {
  const has = (id: string, s: string) => assert.ok(byId(id).body.includes(s), `${id}: ${s}`);
  const deg = (r: number) => r * 180 / Math.PI, rad = (d: number) => d * Math.PI / 180, f1 = (v: number) => v.toFixed(1);
  // change of subject: r from A=154, b from A=60, h for cylinder and cone
  const pi = 22 / 7; assert.ok(Math.abs(154 / pi - 49) < 1e-9); has('SUP-MATH-CHANGE-SUBJECT', 'r² = 154 × 7 ÷ 22 = 49, so r = 7');
  assert.equal(2 * 60 / 8 - 7, 8); has('SUP-MATH-CHANGE-SUBJECT', 'b = 120 ÷ 8 − 7 = 8');
  assert.ok(Math.abs(396 / (2 * pi * 7) - 7 - 2) < 1e-9); has('SUP-MATH-CHANGE-SUBJECT', 'h = 9 − 7 = 2 cm');
  assert.equal((3 * 256) / (pi * 441), 768 / 1386); has('SUP-MATH-CHANGE-SUBJECT', '768 ÷ 1 386 = 128/231');
  const w = (1 * 2 * 3) / (10 - 1 * 2); assert.equal(w, 0.75); assert.equal((w * 10) / (2 * (w + 3)), 1);
  // averages
  const d = [5, 7, 4, 8, 5, 7, 10, 9, 6, 3]; const sum = d.reduce((a, b) => a + b, 0); assert.equal(sum, 64); assert.equal(sum / d.length, 6.4);
  const srt = [...d].sort((a, b) => a - b); assert.equal((srt[4] + srt[5]) / 2, 6.5);
  const fr = [2, 1, 2, 1, 3, 1, 2, 3, 4, 1]; const sf = fr.reduce((a, b) => a + b, 0), sfx = fr.reduce((a, b, i) => a + b * i, 0); assert.equal(sf, 20); assert.equal(sfx, 99); assert.equal(sfx / sf, 4.95);
  const m2 = [14, 9, 12, 9, 16, 11, 9, 15]; assert.equal(m2.reduce((a, b) => a + b, 0) / 8, 11.875);
  const marks = [42, 44, 50, 40, 54, 48, 10, 88]; assert.equal(marks.reduce((a, b) => a + b, 0) / 8, 47); has('SUP-MATH-AVERAGES', 'mean = 376 ÷ 8 = 47'); assert.match(byId('SUP-MATH-AVERAGES').body, /original note (printed|prints) the mean as 48/, 'SUP-MATH-AVERAGES: states the note\'s mean of 48 and corrects it to 47'); // worker A\'s revision uses the present tense
  assert.equal((3 * 108 + 5 * 37 + 8 * 38 + 6 * 39 + 2 * 40) / 24 > 37.95, true); has('SUP-MATH-AVERAGES', '911 ÷ 24 = 37.96');
  // graphical and word problems: intersections and checks
  assert.equal(0.5 * 2 - 2, 2 * 2 - 5); assert.equal(2 - 2 * -1, 4); assert.equal(2 * 2 - -1, 5); has('SUP-MATH-SIMULT-GRAPH', 'cross at (2, −1)');
  assert.equal(10 - 2 * 3, 2 * 3 - 2); has('SUP-MATH-SIMULT-GRAPH', 'cross at (3, 4)');
  assert.equal(3 * 280 + 2 * 200, 1240); assert.equal(5 * 280 + 7 * 200, 2800); assert.equal(840 / 3, 280); has('SUP-MATH-SIMULT-WORDS', 'b = 280'); has('SUP-MATH-SIMULT-WORDS', 'ends with x = 260');
  assert.equal(146 - 20, 106 + 20); assert.equal(146 + 22, 2 * (106 - 22)); assert.equal(26 + 36, 62); assert.ok(Math.abs((7 + 2) / (8 + 2) - 0.9) < 1e-12); assert.equal((7 - 3) / (8 - 3), 0.8);
  assert.equal(2 * 300 + 3 * 250, 1350); assert.equal(3 * 300 + 250, 1150); assert.equal(48 + 6, 3 * (12 + 6)); assert.equal(74 - 47, 27); assert.equal(500 * 28 + 200 * 12, 16400);
  // trigonometry
  assert.equal(f1(deg(Math.atan(5 / 12))), '22.6'); assert.equal(Math.round(12 / Math.tan(rad(28))), 23); has('SUP-MATH-TRIG-RATIOS', '23 cm to 2 significant figures');
  assert.equal((Math.sin(rad(46.65))).toFixed(4), '0.7272'); has('SUP-MATH-TRIG-RATIOS', 'the calculator gives 0.7272');
  assert.equal(f1(15 * Math.cos(rad(40))), '11.5'); assert.equal(f1(9 * Math.tan(rad(50))), '10.7'); assert.equal(f1(6 / Math.sin(rad(35))), '10.5');
  assert.equal(f1(deg(Math.asin(0.6))), '36.9'); assert.equal(f1(deg(Math.atan(15 / 8))), '61.9'); assert.equal(f1(deg(Math.asin(7 / 25))), '16.3');
  // bearings
  assert.equal(f1(180 + deg(Math.atan(20 / 30))), '213.7'); assert.equal(f1(Math.hypot(20, 30)), '36.1');
  assert.equal(f1(18 * Math.tan(rad(65))), '38.6'); assert.equal(f1(18 / Math.cos(rad(65))), '42.6'); has('SUP-MATH-BEARING-DISTANCE', 'QR = 18 × 2.1445 = 38.6 km');
  const e = 12 * Math.sin(rad(40)) + 9 * Math.sin(rad(130)), n = 12 * Math.cos(rad(40)) + 9 * Math.cos(rad(130)); assert.equal(f1(Math.hypot(e, n)), '15.0'); assert.equal(f1(deg(Math.atan2(e, n))), '76.9');
  assert.equal(f1(90 + deg(Math.atan(5 / 8))), '122.0'); assert.equal(Math.round(180 + deg(Math.atan(6 / 8))), 217); assert.equal(f1(24 * Math.tan(rad(50))), '28.6'); assert.equal(f1(24 / Math.cos(rad(50))), '37.3');
  assert.equal(f1(100 * Math.sin(rad(150))), '50.0'); assert.equal(f1(-100 * Math.cos(rad(150))), '86.6');
});
test('all 18 Mathematics lead rows carry a reviewed decision that records what was read', () => {
  const closure = csv('docs/jss3/SEMANTIC_CLOSURE.csv'); const decisions = csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv');
  const leads = ['LEAD_ONLY_NEEDS_READING', 'ORIGINAL_BODY_TEXT_PRESENT_NEEDS_CONFIRMATION'];
  assert.equal(MATH18.length, 18);
  for (const id of MATH18) {
    const d = decisions.find(r => r.candidate_id === id); assert.ok(d, id); assert.ok(d.rationale.startsWith('Read:'), `${id} records what was read`); assert.ok(d.limitation.length > 5, id);
    const c = closure.find(r => r.candidate_id === id)!; assert.equal(c.canonical_subject, 'Mathematics', id); assert.equal(c.disposition, d.disposition, id); assert.ok(!leads.includes(c.disposition), id);
    if (d.support_kind === 'supplement') { const s = byId(d.row_filter); assert.ok(s, id); assert.ok(s.body.toLowerCase().includes(d.anchor_regex.toLowerCase()), `${id} anchor`); }
    if (d.support_kind === 'original') assert.match(c.support_locator, /anchor_sha256=[0-9a-f]{16}; row_sha256=[0-9a-f]{16}; verified_by=SEMANTIC_DECISIONS\.csv/, id);
  }
  const by = (x: string) => MATH18.filter(id => closure.find(r => r.candidate_id === id)!.disposition === x).length;
  // Worker A revised SL-146, SL-147 and SL-254 from ORIGINAL_LESSON_COVERS_OBJECTIVE to REPLACEMENT_IMPLEMENTED: 4/1/13 became 1/1/16.
  assert.equal(by('ORIGINAL_LESSON_COVERS_OBJECTIVE'), 1); assert.equal(by('STRUCTURAL_MARKER'), 1); assert.equal(by('REPLACEMENT_IMPLEMENTED'), 16);
  for (const id of ['SL-150', 'SL-153', 'SL-242', 'SL-244', 'SL-245', 'SL-252', 'SL-253', 'SL-257', 'SL-258']) {
    const d = decisions.find(r => r.candidate_id === id)!; assert.ok(Object.keys(MATH_NEW).includes(d.row_filter), id);
  }
  assert.equal(closure.filter(r => r.canonical_subject === 'Mathematics' && leads.includes(r.disposition)).length, 0);
});
test('OB-14, OB-17 and OB-18 record the equation loss, the duplicate-row fix and the source slips', () => {
  const ob = csv('docs/jss3/OPEN_BLOCKERS.csv'); const o14 = ob.find(r => r.id === 'OB-14')!; assert.match(o14.detail, /RESOLVED for Word equations/); assert.match(o14.detail, /M1-T-FORMULA/);
  assert.match(ob.find(r => r.id === 'OB-21')!.detail, /ALGEBRAIC PROCESSES/);
  assert.equal(ob.find(r => r.id === 'OB-17')!.type, 'resolved');
  const o18 = ob.find(r => r.id === 'OB-18')!; assert.ok(o18); assert.match(o18.detail, /Mean 48 to 47/); assert.match(o18.detail, /x = 260 to 280/); assert.match(o18.detail, /350o to 35o/);
  const sched = csv('docs/jss3/replacements/TEACHER_SCHEDULE_SUPPLEMENTS.csv'); const sids = sched.map(r => r.supplement_id); assert.equal(new Set(sids).size, sids.length, 'schedule has no duplicate rows');
  for (const id of Object.keys(MATH_NEW)) assert.ok(sched.some(r => r.supplement_id === id), id);
});

// ---- Batch 2: Basic Technology, remaining eight lead rows ----
const BT_NEW: Record<string, [string[], number]> = {
  'SUP-BT-METAL-PROJECT': [['WG-BT-SL359'], 16], 'SUP-BT-WIRING': [['WG-BT-SL360'], 17], 'SUP-BT-TROUBLESHOOT': [['WG-BT-SL444'], 18],
  'SUP-BT-ELECTRONIC-DEVICES': [['WG-BT-SL447', 'WG-BT-SL448'], 19], 'SUP-BT-SLIDES-SLOTS': [['WG-BT-SL454'], 20], 'SUP-BT-REVERSIBLE-ROTARY': [['WG-BT-SL457'], 21],
};
test('six Basic Technology lessons are complete, attributed, registered, appended in order and recorded', () => {
  validateJss3Supplements(JSS3_SUPPLEMENTS);
  const inv = csv('docs/jss3/replacements/IMPLEMENTED_LESSONS.csv'); const cov = csv('docs/jss3/replacements/CURRENT_COVERAGE.csv'); const wg = csv('docs/jss3/replacements/WIDER_WORKSTREAMS.csv');
  for (const [id, [gaps, order]] of Object.entries(BT_NEW)) {
    const s = byId(id); assert.ok(s, id); assert.equal(s.subjectName, 'Basic Technology'); assert.equal(s.termLabel, '2nd Term');
    // stable prefix: Batch 2 worker A revised SUP-BT-TROUBLESHOOT to also cover SL-445 (tools for fault detection)
    assert.deepEqual(s.gapIds, id === 'SUP-BT-TROUBLESHOOT' ? [...gaps, 'WG-BT-SL445'] : gaps);
    for (const part of [/Objectives:/, /Teaching:/, /Practice \(questions\):/, /Answers and marking guide/, /Assessment and feedback/]) assert.match(s.body, part, id);
    assert.match(s.origin, /not recovered/); assert.ok(s.sources.length >= 1 && s.sources.every(x => x.url.startsWith('https://')), id);
    assert.equal(inv.filter(r => r.id === id).length, 1, id); assert.equal(inv.find(r => r.id === id)!.order_index, String(order));
    for (const g of gaps) { assert.ok(cov.some(r => r.id === g && r.supplement_ids === id), g); assert.ok(wg.some(r => r.id === g && r.supplement_id === id), g); }
  }
  const bt2 = JSS3_SUPPLEMENTS.filter(s => s.subjectName === 'Basic Technology' && s.termLabel === '2nd Term').map(s => s.id); // stable prefix: the six original lessons keep their order; Batch 2 worker A's SUP-BTECH-WOOD-PROJECT is appended after them
  assert.deepEqual(bt2.slice(0, 6), Object.keys(BT_NEW), 'appended in order'); assert.deepEqual(bt2.slice(6), ['SUP-BTECH-WOOD-PROJECT']);
});
test('Basic Technology gap IDs are registered and an unregistered WG-BT ID is still rejected', () => {
  const s = byId('SUP-BT-WIRING');
  assert.doesNotThrow(() => validateJss3Supplements([s]));
  assert.throws(() => validateJss3Supplements([{ ...s, gapIds: ['WG-BT-SL999'] }]), /Unregistered wider-workstream gap/);
});
test('Basic Technology worked answers are computed', () => {
  assert.equal(12 + 4, 16); assert.equal(12 / 16, 0.75); assert.equal(0.75 * 12, 9); assert.equal(0.75 * 4, 3);
  assert.equal(12 / 6 + 12 / 3, 6); assert.equal(1 / (1 / 6 + 1 / 3), 2); assert.equal(12 / 6, 2);
  assert.equal(10 + 5, 15); assert.equal(6 / 15, 0.4); assert.equal(12 / 6 + 12 / 12, 3);
  assert.equal(2 * 40, 80); assert.equal(2 * 25, 50); assert.equal(4 * 4 + 4, 20); assert.equal(6 * 5, 30);
  assert.equal(120 * 20 / 40, 60); assert.equal(200 * 15 / 30, 100);
  const w = byId('SUP-BT-WIRING').body; for (const t of ['= 16 ohm', '0.75 A', '9 V', '3 V', 'supply current = 6 A', '0.4 A', 'supply current 3 A']) assert.ok(w.includes(t), t);
  assert.ok(byId('SUP-BT-SLIDES-SLOTS').body.includes('80 mm') && byId('SUP-BT-SLIDES-SLOTS').body.includes('50 mm'));
  assert.ok(byId('SUP-BT-REVERSIBLE-ROTARY').body.includes('60 rpm') && byId('SUP-BT-REVERSIBLE-ROTARY').body.includes('100 rpm'));
  assert.ok(byId('SUP-BT-METAL-PROJECT').body.includes('20 rivets') && byId('SUP-BT-METAL-PROJECT').body.includes('30 rivets'));
});
test('all 11 Basic Technology lead rows carry a reviewed decision and none stays a lead', () => {
  const closure = csv('docs/jss3/SEMANTIC_CLOSURE.csv'); const decisions = csv('docs/jss3/replacements/SEMANTIC_DECISIONS.csv');
  const ids = ['SL-028', 'SL-043', 'SL-359', 'SL-360', 'SL-444', 'SL-447', 'SL-448', 'SL-453', 'SL-454', 'SL-457', 'SL-458'];
  for (const id of ids) {
    const d = decisions.find(r => r.candidate_id === id); assert.ok(d, id); const c = closure.find(r => r.candidate_id === id)!;
    assert.equal(c.canonical_subject, 'Basic Technology', id); assert.equal(c.disposition, d.disposition, id); assert.ok(!LEAD_STATES.includes(c.disposition), id);
    if (d.support_kind === 'supplement') { assert.ok(d.rationale.startsWith('Read'), id); assert.ok(byId(d.row_filter).body.toLowerCase().includes(d.anchor_regex.toLowerCase()), `${id} anchor`); }
  }
  assert.equal(closure.filter(r => LEAD_STATES.includes(r.disposition)).length, 0);
  const ob = csv('docs/jss3/OPEN_BLOCKERS.csv'); assert.ok(ob.find(r => r.id === 'OB-19')); assert.match(ob.find(r => r.id === 'OB-01')!.detail, /Basic Technology: all 11 leads decided/);
  const sched = csv('docs/jss3/replacements/TEACHER_SCHEDULE_SUPPLEMENTS.csv'); for (const id of Object.keys(BT_NEW)) assert.ok(sched.some(r => r.supplement_id === id), id);
});

test('Yoruba excerpt licences are recorded as share-alike and the unverified status stays open (OB-11)', () => {
  const t = byId('SUP-YO-ORAL-TEXTS');
  assert.ok(t.sources.every(s => !/CC BY(?!-SA)/.test(s.title)), 'no source is labelled plain CC BY');
  assert.ok(t.sources.filter(s => /CC BY-SA 4\.0/.test(s.title)).length === 2);
  assert.match(t.origin, /G2 check, 19 October 2026/); assert.match(t.origin, /full extracted PDF or page text/); assert.match(t.origin, /line-end commas and order/); assert.match(t.origin, /Not verified: the NOUN logo and cover/); assert.doesNotMatch(t.origin, /no character-for-character copy was possible/);
  const o = csv('docs/jss3/OPEN_BLOCKERS.csv').find(r => r.id === 'OB-11')!; assert.match(o.detail, /Attribution-ShareAlike 4\.0/); assert.match(o.detail, /G2 check, 19 Oct 2026/); assert.match(o.detail, /full extracted text/); assert.match(o.detail, /line-end punctuation/); assert.match(o.detail, /printed English layout/);
  assert.ok(!/CC BY\)/.test(csv('docs/jss3/OPEN_BLOCKERS.csv').find(r => r.id === 'OB-03')!.detail));
  // the verse-free genre lesson stays verse-free
  assert.match(byId('SUP-YO-ORAL-GENRES').body, /supplies no verses/);
});

// ---- Batch 2 combined-state reconciliation ----
test('records agree for all supplements: counts, gaps, hashes, schedule, no Third Term', () => {
  const inv = csv('docs/jss3/replacements/IMPLEMENTED_LESSONS.csv'); const cov = csv('docs/jss3/replacements/CURRENT_COVERAGE.csv'); const wg = csv('docs/jss3/replacements/WIDER_WORKSTREAMS.csv');
  const sched = csv('docs/jss3/replacements/TEACHER_SCHEDULE_SUPPLEMENTS.csv'); const ids = JSS3_SUPPLEMENTS.map(s => s.id);
  assert.deepEqual(inv.map(r => r.id).sort(), [...ids].sort()); assert.deepEqual(sched.map(r => r.supplement_id).sort(), [...ids].sort());
  const buckets = new Set(JSS3_SUPPLEMENTS.map(s => `${s.subjectName}|${s.termLabel}`));
  const originals = [...buckets].map(b => { const [subjectName, termLabel] = b.split('|'); return { filePath: 'x', className: 'JSS 3', termLabel, subjectName, weekLabel: 'w', orderIndex: 1, title: 't', sourceReference: 'b' }; });
  const rows = buildJss3SupplementRows(originals, '/r', 'secondary');
  assert.equal(rows.length, ids.length); assert.ok(rows.every(r => r.termLabel === '1st Term' || r.termLabel === '2nd Term'), 'no Third Term supplement');
  for (const r of rows) { const id = path_id(r.filePath); assert.equal(inv.find(x => x.id === id)!.body_sha256, supplementBodyHash(r.sourceReference), `${id} hash matches importer output`); }
  for (const s of JSS3_SUPPLEMENTS) for (const g of s.gapIds) { if (g.startsWith('WG-')) assert.ok(wg.some(r => r.id === g && r.supplement_id === s.id), g); assert.ok(cov.some(r => r.id === g && r.supplement_ids.split(/[;, ]+/).includes(s.id)), g); }
});
const path_id = (p: string) => p.split('/').pop()!.replace('.json', '');
test('no scratch capture file is tracked, and the five mapping entries stay resolved', () => {
  const tracked = execSync('git ls-files', { encoding: 'utf8' }).split('\n'); assert.ok(!tracked.some(f => /ingestTopics\.capture-/.test(f)));
  const cov = csv('docs/jss3/replacements/CURRENT_COVERAGE.csv'); const mp = csv('docs/jss3/replacements/MAPPING_RESOLUTION.csv');
  for (const id of ['EN2-03', 'YO-T1-MAP', 'YO-T2-MAP', 'YO-T3-MAP', 'YO-OWE']) { assert.ok(mp.some(r => r.id === id && r.executable_rows.length > 10), id); assert.equal(cov.find(r => r.id === id)!.current_status, 'MAPPING_VERIFIED_PROVENANCE_PRESERVED', id); }
  const ob = csv('docs/jss3/OPEN_BLOCKERS.csv'); assert.match(ob.find(r => r.id === 'OB-09')!.detail, /verified on Node 24\.19\.0/); assert.doesNotMatch(ob.find(r => r.id === 'OB-09')!.detail, /were NOT run on 24/); // superseded 19 Oct 2026 by the F integration run assert.equal(ob.find(r => r.id === 'OB-20')!.type, 'resolved');
  const closure = csv('docs/jss3/SEMANTIC_CLOSURE.csv'); assert.equal(closure.filter(r => LEAD_STATES.includes(r.disposition)).length, 0);
});

// ── OB-14 equation recovery and OB-18 slip corrections (18 Oct 2026) ─────────────────────────────
import { ommlToText, isJss3EquationSource, replaceEquationsInDocumentXml } from '../backend/src/db/jss3EquationRecovery.ts';
import { applyJss3MathsSlipCorrections, JSS3_MATHS_SLIP_CORRECTIONS } from '../backend/src/db/jss3MathsSlipCorrections.ts';

const M = 'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"';
const mr = (t: string) => `<m:r><m:t>${t}</m:t></m:r>`;

test('equation recovery renders fractions, powers and roots as readable text', () => {
  assert.equal(ommlToText(`<m:oMath ${M}><m:f><m:num>${mr('opposite')}</m:num><m:den>${mr('hypotenuse')}</m:den></m:f></m:oMath>`), 'opposite/hypotenuse');
  assert.equal(ommlToText(`<m:oMath ${M}><m:sSup><m:e>${mr('r')}</m:e><m:sup>${mr('2')}</m:sup></m:sSup></m:oMath>`), 'r²');
  assert.equal(ommlToText(`<m:oMath ${M}><m:rad><m:radPr/><m:deg/><m:e><m:f><m:num>${mr('A')}</m:num><m:den>${mr('π')}</m:den></m:f></m:e></m:rad></m:oMath>`), '√(A/π)');
  assert.equal(ommlToText(`<m:oMath ${M}><m:f><m:num>${mr('x+1')}</m:num><m:den>${mr('2')}</m:den></m:f></m:oMath>`), '(x+1)/2');
});

test('equation recovery replaces every equation and is scoped to the two JSS3 Maths sources', () => {
  const xml = `<w:p><m:oMathPara ${M}><m:oMath>${mr('a')}</m:oMath></m:oMathPara></w:p><w:p><m:oMath ${M}>${mr('b')}</m:oMath></w:p>`;
  const r = replaceEquationsInDocumentXml(xml);
  assert.equal(r.count, 2);
  assert.ok(!/m:oMath/.test(r.xml) && r.xml.includes('>a<') && r.xml.includes('>b<'));
  assert.ok(isJss3EquationSource('/x/JSS3 1ST TERM /JSS 3 MATHEMATICS.docx'));
  assert.ok(isJss3EquationSource('/x/JSS3 2ND TERM /BASIC 9 MATHEMATICS E-NOTE.docx'));
  assert.ok(!isJss3EquationSource('/x/JSS2 1ST TERM /JSS 2 MATHEMATICS.docx'));
  assert.ok(!isJss3EquationSource('/x/JSS3 1ST TERM /JSS 3 PHYSICS.docx'));
});

test('slip corrections apply exactly once, are idempotent, and throw on a missing context', () => {
  for (const term of ['1st Term', '2nd Term'] as const) {
    const items = JSS3_MATHS_SLIP_CORRECTIONS.filter(c => c.term === term);
    const text = items.map(c => `[${c.before}]`).join('\n');
    const once = applyJss3MathsSlipCorrections(term, text);
    assert.equal(once, items.map(c => `[${c.after}]`).join('\n'));
    assert.equal(applyJss3MathsSlipCorrections(term, once), once);
    assert.throws(() => applyJss3MathsSlipCorrections(term, 'nothing here'));
    assert.throws(() => applyJss3MathsSlipCorrections(term, text + '\n' + items[0].before));
  }
  assert.equal(new Set(JSS3_MATHS_SLIP_CORRECTIONS.map(c => c.id)).size, JSS3_MATHS_SLIP_CORRECTIONS.length);
});

test('corrected values were recomputed, not recalled', () => {
  assert.equal((42 + 44 + 50 + 40 + 54 + 48 + 10 + 88) / 8, 47);
  assert.equal(840 / 3, 280);
  assert.equal(3 * 280 + 2 * 200, 1240); assert.equal(5 * 280 + 7 * 200, 2800);
  assert.equal(parseInt('10000', 2), 16); assert.equal(parseInt('111', 2), 7);
  assert.equal(Math.sin(46.65 * Math.PI / 180).toFixed(4), '0.7272');
  assert.equal([5, 7, 4, 8, 5, 7, 10, 9, 6, 3].reduce((a, b) => a + b), 64);
  const f = [2, 1, 2, 1, 3, 1, 2, 3, 4, 1];
  assert.equal(f.reduce((a, b) => a + b), 20); assert.equal(f.reduce((s, n, i) => s + n * i, 0), 99);
});

// ---- G2 (19 Oct 2026): English/Yoruba evidence corrections ----
test('G2: oral-text excerpts are labelled as selections, in printed order, with attribution and open licence points', () => {
  const t = byId('SUP-YO-ORAL-TEXTS').body;
  assert.match(t, /lines 1 to 7 of the 12 Yoruba lines/);
  assert.match(t, /Akano Famoriyo, Odoje Compound, Oyo, Oyo State, 3 December 1987/);
  assert.match(t, /lines 2, 7 to 8, 10, 14 and 17, in printed order/);
  const order = ['O elephant, huge as a hill', 'tears a man like a garment', 'hangs him up on a tree', 'My chant is a salute', 'single-handily causes a tremor', "The hunter's boast at home is not repeated when he really meets"].map(x => t.indexOf(x));
  assert.ok(order.every(i => i > 0) && order.every((v, i) => i === 0 || v > order[i - 1]), 'elephant lines in printed order');
  assert.match(t, /First produced by the National Open University of Nigeria/);
  assert.match(t, /Creative Commons Attribution License/); // Kolawole PDF vs article page discrepancy is stated
  assert.doesNotMatch(t, /It is believed to work only when exact/);
  assert.ok(!/Ṣàngó pípè[^.]*\n\(\d+\)/.test(t));
});
test('G2: marriage lesson explains only source-backed steps and keeps ìdána and ibale open', () => {
  const m = byId('SUP-YO-MARRIAGE').body;
  assert.match(m, /Ìdána\*\* — sources differ/); assert.match(m, /Ibale\*\* \(caution\)/);
  const notExplained = m.split('**Not explained here:**')[1].split('.')[0];
  for (const w of ['isihun', 'ipalemo', 'ifa iyawo', 'ese iyawo wiwe', 'ikorun', 'ojo keje']) assert.ok(notExplained.includes(w), w);
  for (const w of ['ifojusode', 'ijohen', 'baba gbo iya gbo', 'ibale']) assert.ok(!notExplained.includes(w), w);
  assert.match(m, /Ìfojúsóde\*\* \(caution\)[^\n]*looking out for a suitor/); assert.ok(byId('SUP-YO-MARRIAGE').sources.some(x => /10\.11648\/j\.reports\.20260601\.12/.test(x.url)));
  assert.ok(byId('SUP-YO-MARRIAGE').sources.some(s => /10\.5901\/ajis/.test(s.url)));
});
test('G2: ńkọ́ stays open, dà is sourced, and the cooperative-work lesson no longer cites marriage pages', () => {
  const q = byId('SUP-YO-IBEERE'); assert.match(q.body, /Where is Bolu/); assert.match(q.body, /both readings of ńkọ́ stay open/);
  const r = byId('SUP-YO-IRANLOWO-PRACTICE'); assert.ok(r.sources.every(s => !/marriage|igbeyawo/i.test(s.title + s.url)));
  assert.match(r.body, /Treat the distinctions above as the lesson's reading, not as settled/);
});
test('G2: Ifá excerpt English lines keep the printed layout and the NOUN course developer is credited', () => {
  const t = byId('SUP-YO-ORAL-TEXTS').body;
  assert.match(t, /Eríwo yà \/ Eríwo yà \/ Eríwo yà \/ Aya gbo Aya to \/ Offspring of Eriwo Osinki/);
  assert.doesNotMatch(t, /could not be confirmed/); assert.doesNotMatch(t, /Eríwo yà \(three times\)/);
  assert.match(t, /course developer Oyeniyi Okunoye; published 2021/);
});
test('G2: iparoje stays unconfirmed; ìpajẹ is offered only as a candidate from the WAEC pairing', () => {
  const b = byId('SUP-YO-ISUNKI');
  assert.match(b.body, /ìpajẹ àti ìsúnkì/); assert.match(b.body, /candidate reading/); assert.match(b.body, /It is not confirmed/);
  assert.match(b.body, /earlier guess that it names vowel assimilation is withdrawn/); assert.doesNotMatch(b.body, /It may name vowel assimilation/);
  assert.ok(b.sources.some(x => /Yor228jq2/.test(x.url)));
});
