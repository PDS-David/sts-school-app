// Deferred by owner. Run only during the authorised SS1 verification stage.
import test from 'node:test';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/ss1/subjects/english.json' with { type: 'json' };
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import {
  createEnglishDeliveryResolver, safeEnglishTopic, retireStaleEnglishCache,
  englishAssessmentDeliverable, englishWithdrawnAssessmentIds,
  SS1_ENGLISH_WITHDRAWN_FINGERPRINT_PREFIX,
} from '../../backend/src/utils/ss1EnglishDeliveryCorrection.ts';

const original = packageSchema.parse(packageData);
const correction = original.delivery_corrections[0];
const source = original.sources.find(s => s.source_id === correction.source_id)!;
const lesson = original.lessons.find(l => l.id === correction.replacement_id)!;
const title = correction.evidence.locator.slice(correction.evidence.locator.indexOf(':') + 1).trim();
const body = 'WEEK 1\\nB. Review of Word Class- Parts of Speech\\nSynthetic reviewed English source text.';
const digest = createHash('sha256').update(body, 'utf8').digest('hex');
const clone = JSON.parse(JSON.stringify(original));
clone.delivery_corrections[0].body_sha256 = digest;
clone.delivery_corrections[0].source_lesson_id = `${correction.source_id}:BODY:${digest}`;
const fixture = packageSchema.parse(clone);
const fixtureTopic = {
  id: 901, school_code: 'secondary', class_name: 'SS 1', subject_name: 'English Language',
  term_label: source.term, title, source_file: source.archive_member.split('/').at(-1),
  source_reference: body, summary: 'stale generated summary', generated_assessment_id: 902,
};

function approvedFixture() {
  const value = JSON.parse(JSON.stringify(fixture));
  value.package_status = 'IMPLEMENTED';
  value.open_items = value.open_items.map((item: any) => ({ ...item, blocks_delivery: false }));
  value.lessons = value.lessons.map((entry: any) => ({
    ...entry, state: {
      ...entry.state, content_approval: 'APPROVED', approval_reference: 'owner-approved-fixture',
      verification: 'VERIFIED', verification_reference: 'verification-fixture',
    },
  }));
  return packageSchema.parse(value);
}

test('English resolver is isolated by school, class, subject, term, source file and exact title', () => {
  const resolver = createEnglishDeliveryResolver(fixture);
  const matched = resolver(fixtureTopic);
  assert.equal(matched?.kind, 'withheld');
  assert.match(matched?.reason ?? '', /not yet approved/i);
  assert.equal(resolver({ ...fixtureTopic, school_code: 'primary' }), null);
  assert.equal(resolver({ ...fixtureTopic, class_name: 'SS 2' }), null);
  assert.equal(resolver({ ...fixtureTopic, subject_name: 'Literature' }), null);
  assert.equal(resolver({ ...fixtureTopic, term_label: '3rd Term' }), null);
  assert.equal(resolver({ ...fixtureTopic, source_file: 'other.docx' }), null);
  assert.equal(resolver({ ...fixtureTopic, title: 'A different lesson' }), null);
});

test('Unapproved package is withheld even when the exact source fingerprint matches', () => {
  const hit = createEnglishDeliveryResolver(fixture)(fixtureTopic);
  assert.equal(hit?.kind, 'withheld');
  assert.match(hit?.reason ?? '', /not yet approved/i);
  const safe = safeEnglishTopic(fixtureTopic);
  assert.equal(safe.source_reference, null);
  assert.equal(safe.generated_assessment_id, null);
  assert.match(String(safe.summary), /WITHHELD/);
  assert(String(safe.summary).includes('\nThe English Language package is not yet approved for delivery.'));
  assert(!String(safe.summary).includes('\\n'));
});

test('Approved and verified fixture delivers replacement without exposing answer keys', () => {
  const resolver = createEnglishDeliveryResolver(approvedFixture());
  const hit = resolver(fixtureTopic);
  assert.equal(hit?.kind, 'corrected');
  assert.deepEqual(hit?.replacementLessonIds, [lesson.id]);
  assert.match(hit?.text ?? '', /LEARNING OBJECTIVES/);
  assert.match(hit?.text ?? '', /PRACTICE/);
  assert.doesNotMatch(hit?.text ?? '', /Answer:/);
  assert.doesNotMatch(hit?.text ?? '', /marking guide/i);
});

test('Source hash mismatch withholds source text and stale assessment link', () => {
  const topic = { ...fixtureTopic, source_reference: 'unreviewed changed source' };
  const safe = safeEnglishTopic(topic);
  assert.equal(safe.source_reference, null);
  assert.equal(safe.generated_assessment_id, null);
  assert.match(String(safe.summary), /temporarily unavailable/i);
  assert.equal((safe.delivery_correction as any).status, 'withheld');
});

test('Stale cache retirement is scoped to secondary SS 1 English Language and exact term', async () => {
  const calls: Array<{ sql: string; params: unknown[] }> = [];
  const query = async (sql: string, params: unknown[] = []) => {
    calls.push({ sql, params });
    return { rows: [{ retired: 1, closed_assessments: 1 }] };
  };
  const delivery = createEnglishDeliveryResolver(fixture)({ ...fixtureTopic, source_reference: 'changed' })!;
  await retireStaleEnglishCache(query, fixtureTopic.id, delivery);
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /s\.name=\$6 AND t\.term_label=\$7/);
  assert.match(calls[0].sql, /FOR UPDATE OF t/);
  assert.deepEqual(calls[0].params.slice(3, 7), ['secondary', 'SS 1', 'English Language', source.term]);
  assert.match(String(calls[0].params[7]), /^SS1_ENG_WITHDRAWN:/);
});

test('Assessment access and assessment lists reject withdrawn English source content', async () => {
  const query = async (sql: string, params: unknown[] = []) => {
    if (sql.includes('SELECT content_fingerprint FROM assessments')) return { rows: [{ content_fingerprint: null }] };
    if (sql.includes('SELECT id FROM assessments')) return { rows: [] };
    if (sql.includes('SELECT t.id, t.school_code')) return { rows: [{ ...fixtureTopic, source_reference: 'changed', assessment_id: 902, content_fingerprint: null }] };
    return { rows: [{ retired: 1, closed_assessments: 1 }] };
  };
  const access = await englishAssessmentDeliverable(query, 902);
  assert.equal(access.ok, false);
  const hidden = await englishWithdrawnAssessmentIds(query, [902]);
  assert.deepEqual([...hidden], [902]);
});

test('Withdrawal tombstone remains effective after the topic link is cleared', async () => {
  const query = async (sql: string) => sql.includes('SELECT content_fingerprint FROM assessments')
    ? { rows: [{ content_fingerprint: `${SS1_ENGLISH_WITHDRAWN_FINGERPRINT_PREFIX}COR-001` }] }
    : { rows: [] };
  const result = await englishAssessmentDeliverable(query, 902);
  assert.equal(result.ok, false);
});
test('Approved learner lesson uses readable line breaks and keeps answer keys out of student notes', () => {
  const hit = createEnglishDeliveryResolver(approvedFixture())(fixtureTopic);
  assert.equal(hit?.kind, 'corrected');
  const text = hit?.text ?? '';
  assert(text.includes('\nLEARNING OBJECTIVES\n'));
  assert(text.includes('\nSOURCES AND ATTRIBUTION\n'));
  assert(text.includes('\nRights: '));
  assert.doesNotMatch(text, /Answer:/);
  assert.doesNotMatch(text, /marking guide/i);
});
