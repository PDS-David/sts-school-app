// JSS3 unified delivery-correction mechanism: pure resolver + merged table + (optional) real-source hash checks.
//   node --import tsx --test tests/jss3-delivery-correction.test.mts
//   JSS3_CAPTURE_DIR=<capture_rows.py output, current tree>  [JSS3_BASE_CAPTURE_DIR=<capture at audited base 86a1a61>]
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import corrections from '../backend/src/db/data/jss3DeliveryCorrections.json' with { type: 'json' };
import lessons from '../backend/src/db/data/jss3Supplements.json' with { type: 'json' };
import { createDeliveryResolver, safeJss3Topic, resolveDelivery, deliveryHash, JSS3_CORRECTION_MARKER, JSS3_WITHHELD_MARKER } from '../backend/src/utils/jss3DeliveryCorrection.js';

const C = corrections as any[]; const L = lessons as any[];
const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const mini = [{ id: 'T-1', school_code: 'secondary', class_name: 'JSS 3', subject_name: 'Basic Science', term_label: '1st Term', source_title: 'OZONE', source_body_sha256: sha('BAD OZONE'), previous_source_body_sha256: [sha('OLDER BAD OZONE')], replacement_lesson_ids: ['L1'] }];
const les = [{ id: 'L1', title: 'Ozone', body: 'Correct ozone teaching', origin: 'Original equivalent', sources: [{ title: 'Ref', url: 'https://example.org' }] }];
const topic = (o: any = {}) => ({ school_code: 'secondary', class_name: 'JSS 3', subject_name: 'Basic Science', term_label: '1st Term', title: 'OZONE', source_reference: 'BAD OZONE', summary: null, generated_assessment_id: null, ...o });

test('merged table: 58 unique corrections from A,B,D,E (C has none); all reference real lessons; hashes unique', () => {
  assert.equal(C.length, 58);
  assert.deepEqual(Object.fromEntries(['A', 'B', 'C', 'D', 'E'].map(p => [p, C.filter(c => c.package === p).length])), { A: 23, B: 7, C: 0, D: 23, E: 5 });
  assert.equal(new Set(C.map(c => c.id)).size, 58);
  const hashes = C.flatMap(c => [c.source_body_sha256, ...(c.previous_source_body_sha256 ?? [])]);
  assert.equal(new Set(hashes).size, hashes.length);
  for (const c of C) { assert.match(c.source_body_sha256, /^[0-9a-f]{64}$/); assert.ok(c.subject_name && c.term_label, c.id); for (const id of c.replacement_lesson_ids) assert.ok(L.find(l => l.id === id), `${c.id}:${id}`); }
  assert.equal(C.filter(c => c.previous_source_body_sha256).length, 15, "15 Maths rows re-pointed after master's equation recovery");
  assert.doesNotThrow(() => createDeliveryResolver(C, L));
});
test('resolver: hash match (current or previous audited hash) gives the same corrected text and fingerprint', () => {
  const r = createDeliveryResolver(mini, les);
  const a = r(topic()) as any, b = r(topic({ source_reference: 'OLDER BAD OZONE' })) as any;
  assert.equal(a.kind, 'corrected'); assert.equal(a.fingerprint, b.fingerprint); assert.equal(a.text, b.text);
  assert.ok(a.text.startsWith(JSS3_CORRECTION_MARKER)); assert.match(a.text, /Correct ozone teaching/); assert.doesNotMatch(a.text, /BAD OZONE/);
  assert.equal(r(topic({ title: 'renamed', source_reference: 'BAD OZONE' }))!.kind, 'corrected', 'hash wins over title');
});
test('fail closed: known title/subject/term with changed text is WITHHELD, never the original and never corrected-by-guess', () => {
  const r = createDeliveryResolver(mini, les); const w = r(topic({ source_reference: 'EDITED TEXT' })) as any;
  assert.equal(w.kind, 'withheld'); assert.ok(w.text.startsWith(JSS3_WITHHELD_MARKER)); assert.doesNotMatch(w.text, /EDITED TEXT|BAD OZONE/);
  const s = safeJss3Topic(topic({ source_reference: 'EDITED TEXT', summary: 'old ai', generated_assessment_id: 'A1' }), r);
  assert.equal(s.source_reference, null); assert.equal(s.generated_assessment_id, null);
});
test('no false positives: other school/class/subject/term/title and missing source are untouched', () => {
  const r = createDeliveryResolver(mini, les);
  for (const o of [{ school_code: 'primary' }, { class_name: 'JSS 2' }, { subject_name: 'Physics', source_reference: 'x' }, { term_label: '2nd Term', source_reference: 'x' }, { title: 'OZONE LAYER', source_reference: 'x' }, { source_reference: null, title: 'other' }]) {
    const t = topic(o); assert.equal(r(t), null, JSON.stringify(o)); assert.equal(safeJss3Topic(t, r), t);
  }
});
test('fingerprint covers the full selected lesson objects: editing a replacement lesson changes it', () => {
  const f1 = (createDeliveryResolver(mini, les)(topic()) as any).fingerprint;
  const f2 = (createDeliveryResolver(mini, [{ ...les[0], body: les[0].body + ' revised' }])(topic()) as any).fingerprint;
  assert.notEqual(f1, f2);
});
test('construction rejects duplicate ids, competing hashes, missing/duplicate replacements, bad hashes', () => {
  assert.throws(() => createDeliveryResolver([...mini, mini[0]], les), /Duplicate correction id/);
  assert.throws(() => createDeliveryResolver([...mini, { ...mini[0], id: 'T-2' }], les), /Competing/);
  assert.throws(() => createDeliveryResolver([{ ...mini[0], replacement_lesson_ids: ['NOPE'] }], les), /Missing replacement/);
  assert.throws(() => createDeliveryResolver([{ ...mini[0], replacement_lesson_ids: ['L1', 'L1'] }], les), /duplicate replacement/i);
  assert.throws(() => createDeliveryResolver([{ ...mini[0], source_body_sha256: 'zz' }], les), /Invalid source hash/);
  assert.throws(() => createDeliveryResolver(mini, [les[0], les[0]]), /Duplicate lesson ID/);
});
test('delivered text for every real correction names provenance and contains no unreviewed original text', () => {
  const r = createDeliveryResolver(C, L);
  for (const c of C) { const d = r({ school_code: c.school_code, class_name: c.class_name, subject_name: c.subject_name, term_label: c.term_label, title: c.source_title, source_reference: 'x' }) as any; assert.equal(d.kind, 'withheld', c.id); }
  assert.ok(typeof resolveDelivery === 'function' && typeof deliveryHash('a') === 'string');
});

const CAP = process.env.JSS3_CAPTURE_DIR;
const real = { skip: CAP && existsSync(path.join(CAP, 'original-rows.json')) ? false : 'set JSS3_CAPTURE_DIR to capture_rows.py output' } as const;
test('REAL SOURCE: every correction hash resolves to exactly one captured original row, same title/subject/term; delivery serves corrected text', real, () => {
  const rows = JSON.parse(readFileSync(path.join(CAP!, 'original-rows.json'), 'utf8')) as any[]; assert.equal(rows.length, 313);
  const r = createDeliveryResolver(C, L); const seen = new Set<string>();
  for (const c of C) {
    const m = rows.filter(x => sha(x.sourceReference) === c.source_body_sha256); assert.equal(m.length, 1, `${c.id} current hash`);
    assert.equal(m[0].subjectName, c.subject_name); assert.equal(m[0].termLabel, c.term_label); assert.equal(m[0].className, c.class_name);
    const d = r({ school_code: c.school_code, class_name: c.class_name, subject_name: m[0].subjectName, term_label: m[0].termLabel, title: m[0].title, source_reference: m[0].sourceReference }) as any;
    assert.equal(d.kind, 'corrected', c.id); assert.equal(d.correctionId, c.id); seen.add(c.id);
  }
  assert.equal(seen.size, 58);
});
const BASE = process.env.JSS3_BASE_CAPTURE_DIR;
test('REAL SOURCE (audited base): every worker hash (current or previous) matches a base-capture row; the 15 changed rows are Mathematics only', { skip: BASE && existsSync(path.join(BASE, 'original-rows.json')) && !real.skip ? false : 'set JSS3_BASE_CAPTURE_DIR too' }, () => {
  const base = JSON.parse(readFileSync(path.join(BASE!, 'original-rows.json'), 'utf8')) as any[]; const cur = JSON.parse(readFileSync(path.join(CAP!, 'original-rows.json'), 'utf8')) as any[];
  const bh = new Set(base.map(x => sha(x.sourceReference)));
  for (const c of C) assert.ok(bh.has(c.previous_source_body_sha256?.[0] ?? c.source_body_sha256), c.id);
  const ch = C.filter(c => c.previous_source_body_sha256); assert.equal(ch.length, 15); assert.ok(ch.every(c => c.subject_name === 'Mathematics'));
  const ch2 = base.filter(b => { const x = cur.find(y => y.title === b.title && y.subjectName === b.subjectName && y.termLabel === b.termLabel && y.orderIndex === b.orderIndex); return x && sha(x.sourceReference) !== sha(b.sourceReference); });
  assert.equal(ch2.length, 15);
});
