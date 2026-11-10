import test from 'node:test';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/ss1/subjects/catering-craft.json' with { type: 'json' };
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import {
  createSs1DeliveryResolver,
  safeSs1Topic,
  retireStaleSs1Cache,
  ss1AssessmentDeliverable,
  ss1WithdrawnAssessmentIds,
  SS1_CATERING_WITHDRAWN_FINGERPRINT_PREFIX,
} from '../../backend/src/utils/ss1CateringDeliveryCorrection.ts';

const p = packageSchema.parse(packageData);
const correction = p.delivery_corrections[0];
const sourceBody = 'WEEK 6\\nCOOKING OF FOODS\\nSynthetic reviewed source text for resolver tests.';
const sourceBodyHash = createHash('sha256').update(sourceBody, 'utf8').digest('hex');
const fixture = JSON.parse(JSON.stringify(p));
fixture.delivery_corrections[0].body_sha256 = sourceBodyHash;
fixture.delivery_corrections[0].source_lesson_id = `${correction.source_id}:BODY:${sourceBodyHash}`;
const fixturePackage = packageSchema.parse(fixture);
const source = p.sources.find(s => s.source_id === correction.source_id)!;
const topic = {
  id: 41,
  school_code: 'secondary',
  class_name: 'SS 1',
  subject_name: 'Catering Craft',
  term_label: source.term,
  title: 'COOKING OF FOODS',
  source_file: source.archive_member.split('/').at(-1),
  source_reference: sourceBody,
  summary: 'stale generated summary',
  generated_assessment_id: 'assessment-41',
};

test('SS1 Catering correction resolver is strictly scoped to the exact subject/class/term/source file', () => {
  const resolver = createSs1DeliveryResolver(fixturePackage);
  const hit = resolver({ ...topic, source_reference: 'changed source text' });
  assert.equal(hit?.kind, 'withheld');
  assert.equal(resolver({ ...topic, class_name: 'SS 2' }), null);
  assert.equal(resolver({ ...topic, school_code: 'primary' }), null);
  assert.equal(resolver({ ...topic, subject_name: 'Food and Nutrition' }), null);
  assert.equal(resolver({ ...topic, term_label: '3rd Term' }), null);
  assert.equal(resolver({ ...topic, source_file: 'other.doc' }), null);
});

test('Exact reviewed source body hash resolves to the approved replacement lesson', () => {
  const hit = createSs1DeliveryResolver(fixturePackage)({ ...topic, source_reference: sourceBody });
  assert.equal(hit?.kind, 'corrected');
  assert.equal(hit?.source, 'ss1');
  assert.match(hit?.text ?? '', /approved, project-authored correction/i);
  assert.deepEqual(hit?.replacementLessonIds, [correction.replacement_id]);
});

test('Safe topic projection removes original teaching and cached assessment link on mismatch', () => {
  const safe = safeSs1Topic({ ...topic, source_reference: 'altered after review' });
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
  const delivery = createSs1DeliveryResolver(fixturePackage)({ ...topic, source_reference: 'altered after review' })!;
  await retireStaleSs1Cache(query, topic.id, delivery);
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /s\.name=\$6 AND t\.term_label=\$7/);
  assert.match(calls[0].sql, /FOR UPDATE OF t/);
  assert.deepEqual(calls[0].params.slice(3, 7), ['secondary', 'SS 1', 'Catering Craft', '2nd Term']);
  assert.match(String(calls[0].params[7]), /^SS1_CC_WITHDRAWN:/);
});

test('Assessment access is denied and stale linked assessment retired when source is mismatched', async () => {
  const calls: string[] = [];
  const query = async (sql: string) => {
    calls.push(sql);
    if (sql.includes('SELECT content_fingerprint FROM assessments')) return { rows: [{ content_fingerprint: null }] };
    if (sql.includes('SELECT t.id, t.school_code')) return { rows: [{ ...topic, source_reference: 'altered after review', assessment_id: 'assessment-41', content_fingerprint: null }] };
    return { rows: [{ retired: 1, closed_assessments: 1 }] };
  };
  const result = await ss1AssessmentDeliverable(query, 'assessment-41');
  assert.equal(result.ok, false);
  assert.match(result.reason, /withdrawn/i);
  assert(calls.some(sql => sql.includes('UPDATE assessments')));
});

test('Assessment list hides only stale SS1 Catering Craft assessment IDs', async () => {
  const query = async (sql: string) => {
    if (sql.includes('SELECT id FROM assessments')) return { rows: [] };
    if (sql.includes('SELECT t.id, t.school_code')) return { rows: [{ ...topic, source_reference: 'altered after review', assessment_id: 'assessment-41', content_fingerprint: null }] };
    return { rows: [{ retired: 1, closed_assessments: 1 }] };
  };
  const ids = await ss1WithdrawnAssessmentIds(query, ['assessment-41', 'unrelated']);
  assert.deepEqual([...ids], ['assessment-41']);
});

test('Withdrawal tombstone keeps an assessment hidden after its topic link is cleared', async () => {
  const query = async (sql: string) => {
    if (sql.includes('SELECT id FROM assessments')) return { rows: [{ id: 'assessment-41' }] };
    return { rows: [] };
  };
  const ids = await ss1WithdrawnAssessmentIds(query, ['assessment-41']);
  assert.deepEqual([...ids], ['assessment-41']);
  assert.match(SS1_CATERING_WITHDRAWN_FINGERPRINT_PREFIX, /^SS1_CC_WITHDRAWN:/);
});

test('Assessment ID remains non-deliverable after topic unlink through withdrawal tombstone', async () => {
  let linkedLookupCalled = false;
  const query = async (sql: string) => {
    if (sql.includes('SELECT content_fingerprint FROM assessments')) {
      return { rows: [{ content_fingerprint: `${SS1_CATERING_WITHDRAWN_FINGERPRINT_PREFIX}CC-CORR-T2-W06-FRYING` }] };
    }
    if (sql.includes('SELECT t.id, t.school_code')) linkedLookupCalled = true;
    return { rows: [] };
  };
  const result = await ss1AssessmentDeliverable(query, 'assessment-41');
  assert.equal(result.ok, false);
  assert.equal(linkedLookupCalled, false);
});
