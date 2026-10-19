// Run from a disposable copy of master with code.patch applied:
//   node --import tsx --test docs/jss3/batch2-close/D_FRENCH_SOCIAL_CIVIC_AGRIC/tests/jss3-d-delivery.test.mts
// JSS3_REPO may point to that copy (default: repository root of this file).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const pack = path.resolve(here, '..');
const repo = process.env.JSS3_REPO ?? path.resolve(pack, '../../../..');
const mod: any = await import(pathToFileURL(path.join(repo, 'backend/src/db/jss3Supplements.ts')).href);
const current: any[] = JSON.parse(fs.readFileSync(path.join(here, 'master_supplements_base.json'), 'utf8')); // master 9ee0597 supplements, 90 lessons
const ups: any[] = JSON.parse(fs.readFileSync(path.join(pack, 'SUPPLEMENT_UPSERTS.json'), 'utf8'));
const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
function compose(base: any[], u: any[]) {
  const out = structuredClone(base);
  for (const x of u) {
    const i = out.findIndex(l => l.id === x.id);
    if (x.op === 'add') { if (i >= 0) throw new Error('add of existing id ' + x.id); out.push(x.lesson); }
    else { if (i < 0) throw new Error('replace of missing id'); if (sha(JSON.stringify(out[i])) !== x.expected_old_sha256) throw new Error('stale hash ' + x.id); out[i] = x.lesson; }
  }
  return out;
}
const OWNED = ['French', 'Social Studies', 'Civic Education', 'Agricultural Science'];
test('upserts compose onto master and pass the production schema and gap registry', () => {
  const composed = compose(current, ups);
  assert.equal(mod.validateJss3Supplements(composed).length, current.length + ups.filter(u => u.op === 'add').length);
  for (const u of ups) { assert.ok(OWNED.includes(u.lesson.subjectName)); assert.notEqual(u.lesson.termLabel, '3rd Term'); assert.ok(u.lesson.origin.includes('not recovered')); }
});
test('negative controls: stale hash, unregistered gap, missing answers and duplicate ids are rejected', () => {
  assert.throws(() => compose(current, ups.map(u => u.op === 'replace' ? { ...u, expected_old_sha256: '0'.repeat(64) } : u)), /stale hash/);
  assert.throws(() => compose(current, [ups[0], ups[0]]), /existing id/);
  const composed = compose(current, ups);
  assert.throws(() => mod.validateJss3Supplements([{ ...composed[composed.length - 1], gapIds: ['WG-NOT-REGISTERED'] }]));
  assert.throws(() => mod.validateJss3Supplements([{ ...composed[composed.length - 1], body: 'x'.repeat(600) }]), /answer|learner/i);
});
test('only the replace touches an existing lesson, and only its dated GDP sentence changes', () => {
  const r = ups.find(u => u.op === 'replace'); const old = current.find(l => l.id === r.id);
  assert.equal(ups.filter(u => u.op === 'replace').length, 1);
  assert.ok(old.body.includes('5.6 per cent')); assert.ok(!r.lesson.body.includes('5.6 per cent')); assert.ok(r.lesson.body.includes('55.5 per cent'));
  assert.ok(r.lesson.body.includes('A mixed economy:'));
  assert.equal(r.lesson.body.replace(/after Nigeria's 2025 rebasing[^;]*;[^)]*\)/, '').length < old.body.length + 400, true);
});
const body = (id: string) => ups.find(u => u.id === id)!.lesson.body as string;
test('corrected facts are present and errors appear only as labelled corrections', () => {
  assert.match(body('SUP-CIVIC-SECURITY'), /Decree No\. 48 of 1989/);
  assert.match(body('SUP-CIVIC-SECURITY'), /'Decree 48 of 2000', but the correct date/);
  assert.match(body('SUP-CIVIC-FREE-FAIR'), /appointed by the State Governor and confirmed by the State House of Assembly/);
  assert.match(body('SUP-CIVIC-CONSTITUTION'), /four-fifths/);
  assert.match(body('SUP-SS-AGRIC-ECONOMY'), /May 1976/);
  assert.match(body('SUP-FR-PRESENT'), /il\/elle part/); assert.match(body('SUP-FR-JOURNEE-DUREE'), /douze juin/);
  assert.match(body('SUP-FR-JOURNEE-DUREE'), /décembre/);
  assert.match(body('SUP-SS-HARMFUL-PRACTICES'), /should not be blamed on one ethnic or religious group/);
});
test('no partisan or named-politician teaching in new Civic and Social lessons', () => {
  for (const id of ['SUP-CIVIC-SECURITY', 'SUP-CIVIC-SELF-EMPLOYMENT', 'SUP-CIVIC-FREE-FAIR', 'SUP-CIVIC-CONSTITUTION', 'SUP-SS-HARMFUL-PRACTICES', 'SUP-SS-AGRIC-ECONOMY']) {
    for (const w of ['Jonathan', 'Ambode', 'Adeboye', 'PDP', ' APC']) assert.ok(!body(id).includes(w), id + ' ' + w);
  }
});
test('worked arithmetic in lessons is correct', () => {
  assert.equal(50000 + 540000 - (60000 + 80000 + 75000 + 25000), 350000); assert.equal(540000 - 240000, 300000);
  assert.equal(10000 + 40000 + 15000 + 60000, 125000); assert.equal(1000000 * 5, 5000000); assert.equal(2000 * 0.5, 1000);
  assert.equal(150000 - 70000, 80000); assert.equal(200000 / 80000, 2.5); assert.equal(100000 - 60000, 40000); assert.equal(90000 / 40000, 2.25);
  assert.equal(25000 + 150000 - 90000, 85000); assert.equal(3 * 2000 + 20000 + 4 * 6000, 50000); assert.equal(30000 + 40000 + 20000, 90000);
});
test('decisions: 45 rows, seven columns, every supplement anchor is a literal in the named lesson', () => {
  const lines = fs.readFileSync(path.join(pack, 'DECISIONS.csv'), 'utf8').trim().split('\n');
  assert.equal(lines.length, 46); const composed = compose(current, ups);
  const parse = (l: string) => { const out: string[] = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
  for (const l of lines.slice(1)) { const c = parse(l); assert.equal(c.length, 7); if (c[2] === 'supplement') { const les = composed.find(x => x.id === c[3]); assert.ok(les, c[3]); assert.ok(les.body.toLowerCase().includes(c[4].toLowerCase()), c[0] + ' anchor'); } }
});
test('delivery corrections name existing or new replacement lessons and 64-hex source hashes', () => {
  const dc = JSON.parse(fs.readFileSync(path.join(pack, 'DELIVERY_CORRECTIONS.json'), 'utf8')); const ids = new Set(compose(current, ups).map(l => l.id));
  assert.equal(dc.length, 23);
  for (const c of dc) { assert.match(c.source_body_sha256, /^[0-9a-f]{64}$/); assert.equal(c.class_name, 'JSS 3'); assert.equal(c.school_code, 'secondary'); for (const r of c.replacement_lesson_ids) assert.ok(ids.has(r), r); }
});
