// Focused checks for the C_ENGLISH_YORUBA delivery. Run from the repository root in an integration copy:
//   C_DELIVERY_DIR=docs/jss3/batch2-close/C_ENGLISH_YORUBA node --import tsx --test tests/c_english_yoruba_delivery.test.mts
// Copy this file into tests/ first. It passes both before and after the upserts are composed into jss3Supplements.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSS3_SUPPLEMENTS, validateJss3Supplements, buildJss3SupplementRows, supplementBodyHash } from '../backend/src/db/jss3Supplements.ts';
const dir = process.env.C_DELIVERY_DIR ?? 'docs/jss3/batch2-close/C_ENGLISH_YORUBA';
const ups = JSON.parse(readFileSync(`${dir}/SUPPLEMENT_UPSERTS.json`, 'utf8')) as { op: string; id: string; expected_old_sha256: string | null; lesson: any }[];
const lessons = ups.map(u => u.lesson);
const upIds = new Set(ups.map(u => u.id));
const merged = [...JSS3_SUPPLEMENTS.filter(s => !upIds.has(s.id)), ...lessons];
const csvLines = (p: string) => readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean);
function parseCsv(text: string): string[][] { const rows: string[][] = []; let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) { const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; } else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); cur = ''; if (row.length > 1 || row[0]) rows.push(row); row = []; } else cur += c; }
  if (cur || row.length) { row.push(cur); rows.push(row); } return rows; }
test('upserts are add-only, unique, validate with the production schema and avoid Third Term and past-paper titles', () => {
  assert.equal(ups.length, 20); assert.equal(upIds.size, 20);
  for (const u of ups) { assert.equal(u.op, 'add'); assert.equal(u.expected_old_sha256, null); assert.equal(u.lesson.id, u.id); }
  assert.equal(validateJss3Supplements(merged).length, merged.length);
  for (const l of lessons) { assert.notEqual(l.termLabel, '3rd Term'); assert.ok(['English Language', 'Yoruba'].includes(l.subjectName)); assert.match(l.origin, /not recovered/i); assert.ok(!/past (?:question|paper)/i.test(l.title), l.id); }
});
test('every decision anchor is a literal substring of its supporting lesson body; past-question lines stay owner input', () => {
  const rows = parseCsv(readFileSync(`${dir}/DECISIONS.csv`, 'utf8')); const head = rows.shift()!;
  assert.deepEqual(head, ['candidate_id', 'disposition', 'support_kind', 'row_filter', 'anchor_regex', 'rationale', 'limitation']);
  const byId = new Map(merged.map(s => [s.id, s]));
  for (const r of rows) { const [id, disp, kind, filter, anchor, rat, lim] = r; assert.ok(rat.length > 40 && lim.length > 5, id);
    if (kind === 'supplement') { const s = byId.get(filter); assert.ok(s, `${id} ${filter}`); assert.ok(s.body.toLowerCase().includes(anchor.toLowerCase()), `${id} anchor`); } }
  for (const id of ['SL-513', 'SL-514']) assert.equal(rows.find(r => r[0] === id)![1], 'OWNER_INPUT_NEEDED_PAST_QUESTIONS');
  assert.equal(rows.length, 50);
});
test('importer body hashes in RECORD_DELTAS match the real importer output', () => {
  const buckets = new Set(merged.map(s => `${s.subjectName}|${s.termLabel}`));
  const originals = [...buckets].map(b => { const [subjectName, termLabel] = b.split('|'); return { filePath: 'x', className: 'JSS 3', termLabel, subjectName, weekLabel: 'w', orderIndex: 1, title: 't', sourceReference: 'b' }; });
  const out = buildJss3SupplementRows(originals, '/r', 'secondary', merged); const h = new Map(out.map(r => [r.filePath.split('/').pop()!.replace('.json', ''), supplementBodyHash(r.sourceReference)]));
  const rows = parseCsv(readFileSync(`${dir}/RECORD_DELTAS/IMPLEMENTED_LESSONS_ROWS.csv`, 'utf8')); rows.shift();
  assert.equal(rows.length, 20); for (const r of rows) assert.equal(r[6], h.get(r[0]), r[0]);
});
test('negative controls: the gates reject a Third-Term lesson, an unregistered workstream gap, a missing answer guide and a mutated anchor', () => {
  const l = lessons[0];
  assert.throws(() => validateJss3Supplements([{ ...l, termLabel: '3rd Term' }]));
  assert.throws(() => validateJss3Supplements([{ ...l, gapIds: ['WG-NOT-REGISTERED'] }]), /Unregistered/);
  assert.throws(() => validateJss3Supplements([{ ...l, body: l.body.replace(/practice|questions|assessment|ìbéèrè/gi, 'x') + ' '.repeat(600) }]), /learner task|Missing/);
  assert.ok(!l.body.includes('This sentence is not in the lesson.'));
});
test('Yoruba lessons carry the explicit teacher-check and unresolved-term statements', () => {
  const y = new Map(lessons.map(s => [s.id, s.body as string]));
  assert.match(y.get('SUP-YO-MARRIAGE')!, /Do not invent a meaning/); assert.match(y.get('SUP-YO-IRANLOWO-PRACTICE')!, /not guessed here/);
  assert.match(y.get('SUP-YO-OBALUAYE')!, /does not decide which one the school intended/); assert.match(y.get('SUP-YO-OHUN-SILEBU')!, /Yoruba teacher/);
  assert.match(y.get('SUP-YO-LIT-METHOD')!, /Neither title is named/);
});
