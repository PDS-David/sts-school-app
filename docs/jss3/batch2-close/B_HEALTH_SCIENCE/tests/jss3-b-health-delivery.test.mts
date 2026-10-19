// Worker B: delivery corrections for unsafe/incorrect original JSS3 health and science teaching.
// Run from repo root (after F copies this to tests/):
//   node --import tsx --test tests/jss3-b-health-delivery.test.mts
// Source-backed hash checks run only when JSS3_CAPTURE_DIR points at capture_rows.py output (original-rows.json); never published.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { validateJss3Supplements } from '../backend/src/db/jss3Supplements.js';
import lessons from '../backend/src/db/data/jss3Supplements.json' with { type: 'json' };
import corrections from '../backend/src/db/data/jss3DeliveryCorrections.json' with { type: 'json' };
import { jss3CorrectionFor, safeJss3Topic, retireStaleJss3Cache, sha256, JSS3_CORRECTION_MARKER } from '../backend/src/utils/jss3TeachingCorrections.js';

const CHILD = corrections.find((c: any) => c.id === 'HOME-CHILD-CARE-CONTD-ORT-HONEY')!;
const mk = (o: any = {}) => ({ id: 7, school_code: 'secondary', class_name: 'JSS 3', term_label: '2nd Term', title: 'CHILD CARE [CONTD]',
  source_reference: 'ORIGINAL UNSAFE TEXT', summary: null, generated_assessment_id: null, ...o });

test('all composed supplements pass the production schema, including Basic Science and new gap IDs', () => {
  const v = validateJss3Supplements(lessons);
  for (const id of ['SUP-HOME-CHILD-SAFETY','SUP-BS-OZONE-CLIMATE','SUP-BS-MAGNET-POLES','SUP-BS-ELECTRIC-CIRCUITS','SUP-PHE-HIV-STI-FACTS','SUP-PHE-PUBERTY-TEEN-PREG','SUP-BS-PREGNANCY-FACTS','SUP-PHE-MEDICINES-DRUGS'])
    assert.ok(v.find(x => x.id === id), id);
});
test('every correction names existing replacement lessons and a 64-hex source hash', () => {
  for (const c of corrections as any[]) {
    assert.match(c.source_body_sha256, /^[0-9a-f]{64}$/);
    for (const id of c.replacement_lesson_ids) assert.ok((lessons as any[]).find(l => l.id === id), `${c.id}:${id}`);
    assert.equal(c.class_name, 'JSS 3'); assert.equal(c.school_code, 'secondary');
  }
  assert.equal(CHILD.source_body_sha256, '5892e2bd051ebec2ebeee4d65eaf632ec9be5f6de4888ad7be504eb04c660c20');
});
test('negative control: audited hash match is replaced; unsafe advice absent from delivered text', () => {
  const t = mk({ source_reference: 'x', title: 'renamed' });
  assert.equal(jss3CorrectionFor(t), null); // neither hash nor title: no false positive
  const byTitle = safeJss3Topic(mk());
  assert.ok(byTitle.source_reference.startsWith(JSS3_CORRECTION_MARKER));
  assert.equal(byTitle.summary, byTitle.source_reference);
  const text = byTitle.source_reference as string;
  assert.doesNotMatch(text, /10 level of teaspoon|Glucose, sugar or honey should be added|Small pox/i);
  assert.match(text, /must never be given to a child under 12 months/);
  assert.match(text, /Do not mix a salt-and-sugar drink by guessing/);
  assert.doesNotMatch(text, /\b\d+\s*(mg|ml|teaspoon|tsp)\b/i, 'no dose or recipe');
});
test('changed-source handling: same title/term but different stored text still fails closed', () => {
  const c = jss3CorrectionFor(mk({ source_reference: 'REIMPORTED DIFFERENT TEXT' }));
  assert.equal(c?.matchedBy, 'title');
});
test('stale cached summary/assessment link is dropped; current cache keeps its link', () => {
  const fresh = safeJss3Topic(mk({ summary: 'old AI notes from unsafe text', generated_assessment_id: 'A1' }));
  assert.equal(fresh.generated_assessment_id, null);
  const text = safeJss3Topic(mk()).summary;
  const current = safeJss3Topic(mk({ summary: text, generated_assessment_id: 'A2' }));
  assert.equal(current.generated_assessment_id, 'A2');
});
test('other schools, classes and topics are untouched (primary/JSS1/JSS2 negative control)', () => {
  for (const o of [{ school_code: 'primary' }, { class_name: 'JSS 1' }, { class_name: 'JSS 2' }, { title: 'CHILD CARE', term_label: '2nd Term' }]) {
    const t = mk(o); assert.equal(safeJss3Topic(t), t);
  }
});
test('retire: closes the old assessment and replaces cache in one statement; no-op otherwise', async () => {
  const calls: any[] = [];
  const q = async (sql: string, p?: unknown[]) => { calls.push([sql, p]); return { rows: [{ retired: '1', closed_assessments: '1' }] }; };
  assert.equal(await retireStaleJss3Cache(q, mk()), true);
  assert.equal(calls.length, 1);
  assert.match(calls[0][0], /UPDATE assessments SET status='closed'/);
  assert.match(calls[0][0], /generated_assessment_id=NULL/);
  assert.match(calls[0][0], /summary IS DISTINCT FROM \$1/);
  const none = async () => { throw new Error('must not query'); };
  assert.equal(await retireStaleJss3Cache(none as any, mk({ class_name: 'JSS 1' })), false);
  const already = async () => ({ rows: [{ retired: '0', closed_assessments: '0' }] });
  assert.equal(await retireStaleJss3Cache(already, mk()), false);
});
test('science corrections: ozone and magnetism', () => {
  const g = (id: string) => (lessons as any[]).find(l => l.id === id).body as string;
  assert.match(g('SUP-BS-MAGNET-POLES'), /north-seeking pole, or north pole/);
  assert.doesNotMatch(g('SUP-BS-MAGNET-POLES'), /pointing towards the geographical north pole is the south pole/i);
  assert.match(g('SUP-BS-OZONE-CLIMATE'), /Ozone depletion does not cause global warming/);
  assert.match(g('SUP-BS-OZONE-CLIMATE'), /Carbon dioxide does not deplete the ozone layer/);
  assert.match(g('SUP-BS-ELECTRIC-CIRCUITS'), /12\.91/);
  assert.match(g('SUP-PHE-HIV-STI-FACTS'), /old advice not to become pregnant is replaced/);
});
const cap = process.env.JSS3_CAPTURE_DIR;
test('source-backed: audited hashes equal the importer-captured original rows', { skip: !cap || !existsSync(path.join(cap, 'original-rows.json')) }, () => {
  const rows = JSON.parse(readFileSync(path.join(cap!, 'original-rows.json'), 'utf8'));
  for (const c of corrections as any[]) {
    const r = rows.filter((x: any) => x.subjectName === c.subject_name && x.termLabel === c.term_label && x.title === c.source_title);
    assert.equal(r.length, 1, c.id); assert.equal(sha256(r[0].sourceReference), c.source_body_sha256, c.id);
    const t = { ...mk(), title: r[0].title, term_label: r[0].termLabel, source_reference: r[0].sourceReference };
    assert.equal(jss3CorrectionFor(t)?.matchedBy, 'hash');
  }
});
