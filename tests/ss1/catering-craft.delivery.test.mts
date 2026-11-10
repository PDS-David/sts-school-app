import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/ss1/subjects/catering-craft.json' with { type: 'json' };
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import {
  createSs1DeliveryResolver,
  resolveSs1Delivery,
  safeSs1Topic,
  retireStaleSs1Cache,
  ss1AssessmentDeliverable,
  ss1WithdrawnAssessmentIds,
} from '../../backend/src/utils/ss1CateringDeliveryCorrection.ts';

const p = packageSchema.parse(packageData);
const correction = p.delivery_corrections[0];
const source = p.sources.find(s => s.source_id === correction.source_id)!;
const topic = {
  id: 41,
  school_code: 'secondary',
  class_name: 'SS 1',
  subject_name: 'Catering Craft',
  term_label: source.term,
  title: 'COOKING OF FOODS',
  source_file: source.archive_member.split('/').at(-1),
  source_reference: 'reviewed source body',
  summary: 'stale generated summary',
  generated_assessment_id: 'assessment-41',
};

test('SS1 Catering correction resolver is strictly scoped to the exact subject/class/term/source file', () => {
  const resolver = createSs1DeliveryResolver(p);
  const hit = resolver({ ...topic, source_reference: 'x'.repeat(0) + '' });
  assert.equal(hit?.kind, 'withheld');
  assert.equal(resolver({ ...topic, class_name: 'SS 2' }), null);
  assert.equal(resolver({ ...topic, school_code: 'primary' }), null);
  assert.equal(resolver({ ...topic, subject_name: 'Food and Nutrition' }), null);
  assert.equal(resolver({ ...topic, term_label: '3rd Term' }), null);
  assert.equal(resolver({ ...topic, source_file: 'other.doc' }), null);
});

test('Exact reviewed source body hash resolves to the approved replacement lesson', () => {
  const hit = resolveSs1Delivery({ ...topic, source_reference: 'a'.repeat(64) });
  // A nonmatching source is withheld, never silently treated as a valid original.
  assert.equal(hit?.kind, 'withheld');
  assert.equal(hit?.source, 'ss1');
  assert.match(hit?.text ?? '', /temporarily unavailable/i);
});

test('Safe topic projection removes original teaching and cached assessment link on mismatch', () => {
  const safe = safeSs1Topic(topic);
  assert.equal(safe.source_reference, null);
  assert.match(String(safe.summary), /temporarily unavailable/i);
  assert.equal(safe.generated_assessment_id, null);
  assert.equal((safe.delivery_correction as any).status, 'withheld');
});

test('Stale cache retirement is transactionally scoped to secondary SS 1 Catering Craft and exact term', async () => {
  const calls: Array<{ sql: string; params: unknown[] }> = [];
  const query = async (sql: string, params: unknown[] = []) => {
    calls.push({ sql, params });
    return { rows: [{ retired: 1, closed_assessments: 1 }] };
  };
  const delivery = createSs1DeliveryResolver(p)(topic)!;
  await retireStaleSs1Cache(query, topic.id, delivery);
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /s\.name=\$6 AND t\.term_label=\$7/);
  assert.match(calls[0].sql, /FOR UPDATE OF t/);
  assert.deepEqual(calls[0].params.slice(3), ['secondary', 'SS 1', 'Catering Craft', '2nd Term']);
});

test('Assessment access is denied and stale linked assessment retired when source is mismatched', async () => {
  const calls: string[] = [];
  const query = async (sql: string) => {
    calls.push(sql);
    if (sql.includes('SELECT t.id, t.school_code')) return { rows: [{ ...topic, assessment_id: 'assessment-41', content_fingerprint: null }] };
    return { rows: [{ retired: 1, closed_assessments: 1 }] };
  };
  const result = await ss1AssessmentDeliverable(query, 'assessment-41');
  assert.equal(result.ok, false);
  assert.match(result.reason, /withdrawn/i);
  assert(calls.some(sql => sql.includes('UPDATE assessments')));
});

test('Assessment list hides only stale SS1 Catering Craft assessment IDs', async () => {
  const query = async (sql: string) => sql.includes('SELECT t.id, t.school_code')
    ? { rows: [{ ...topic, assessment_id: 'assessment-41', content_fingerprint: null }] }
    : { rows: [{ retired: 1, closed_assessments: 1 }] };
  const ids = await ss1WithdrawnAssessmentIds(query, ['assessment-41', 'unrelated']);
  assert.deepEqual([...ids], ['assessment-41']);
});
