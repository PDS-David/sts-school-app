import test from 'node:test';
import assert from 'node:assert/strict';
import manifest from '../../backend/src/db/primary4/sourceManifest.json' with { type: 'json' };
import archiveCorrections from '../../backend/src/db/primary4/researched/archiveLessonCorrections.json' with { type: 'json' };
import { resolvePrimary4SourceDelivery, safePrimary4Topic, primary4WithdrawnAssessmentIds } from '../../backend/src/utils/primary4Delivery.ts';

const outline = 'WEEK 1:\u00a0CHANGES IN NATURE\n\nUNITS:\n\nTypes of changes :Temporary changes(reversible) and Permanent changes (irreversible)';
const baseTopic = {
  id: 208, school_code: 'primary', class_name: 'Primary 4',
  subject_name: 'Basic Science', term_label: '1st Term', order_index: 1,
  title: ':\u00a0CHANGES IN NATURE', source_reference: outline,
  summary: null, generated_assessment_id: null,
};

test('Primary 4 export manifest records 248 unique topic identities across the 11 assigned subjects', () => {
  assert.equal(manifest.records.length, 248);
  assert.equal(new Set(manifest.records.map((record: any) => record.id)).size, 248);
  assert.equal(manifest.expected_subjects.length, 11);
  assert.deepEqual(manifest.expected_terms, ['1st Term', '2nd Term', '3rd Term']);
  assert.equal(manifest.provenance.original_archive_independently_rehashed, false);
});

test('source delivery matches exact Primary 4 identity and source fingerprint', () => {
  const result = resolvePrimary4SourceDelivery(baseTopic);
  assert.equal(result?.kind, 'matched');
  assert.equal(result?.source, 'primary4-export');
  if (result?.kind === 'matched') {
    assert.equal(result.topicId, 208);
    assert.equal(result.reviewRequired, true);
    assert.equal(result.reviewFlag, 'SHORT_SOURCE_REVIEW');
    assert.equal(result.text, outline);
  }
});

test('source delivery does not match another class, school, subject, term, title, order or changed body', () => {
  assert.equal(resolvePrimary4SourceDelivery({ ...baseTopic, class_name: 'Primary 5' }), null);
  assert.equal(resolvePrimary4SourceDelivery({ ...baseTopic, school_code: 'secondary' }), null);
  for (const changed of [
    { subject_name: 'Basic Technology' }, { term_label: '2nd Term' },
    { title: 'Different title' }, { order_index: 2 },
    { source_reference: outline + ' changed' },
  ]) {
    assert.equal(resolvePrimary4SourceDelivery({ ...baseTopic, ...changed })?.kind, 'withheld');
  }
});

test('safe topic projection removes drifted source, summary and generated assessment link', () => {
  const safe = safePrimary4Topic({ ...baseTopic, source_reference: outline + ' changed', summary: 'stale lesson', generated_assessment_id: 91 });
  assert.equal(safe.source_reference, null);
  assert.equal(safe.summary, null);
  assert.equal(safe.generated_assessment_id, null);
  assert.equal((safe as any).primary4_delivery.status, 'withheld');
});

test('withdrawn assessment lookup hides only assessments linked to drifted Primary 4 topics', async () => {
  const query = async () => ({ rows: [
    { ...baseTopic, source_reference: outline + ' changed', generated_assessment_id: 91 },
    { ...baseTopic, generated_assessment_id: 92 },
  ] });
  const ids = await primary4WithdrawnAssessmentIds(query, [91, 92, 93]);
  assert.deepEqual([...ids], [91]);
});


test('archive correction package contains structurally complete lessons and explicit approval gates', () => {
  assert.equal(archiveCorrections.corrections.length, 32);
  assert.equal(archiveCorrections.hidden_topic_ids.length, 16);
  assert.equal(archiveCorrections.provenance.archive_sha256, '69731806a1c59185a4d5f8f408cb87fb0897778265d654676e134615b88d4da5');
  const ids = archiveCorrections.corrections.map((record: any) => record.topic_id);
  assert.equal(new Set(ids).size, ids.length);
  for (const record of archiveCorrections.corrections as any[]) {
    assert.ok(record.objectives.length >= 2, record.title);
    assert.ok(record.lesson.length >= 100, record.title);
    assert.ok(record.examples.length >= 2, record.title);
    assert.ok(record.activity.length >= 20, record.title);
    assert.ok(record.evaluation.length >= 3, record.title);
    assert.equal(record.content_approval, 'PENDING_OWNER_REVIEW');
    assert.equal(record.pedagogical_verification, 'VERIFIED');
  }
});

test('archive corrections are withheld until explicit owner approval and never fall back to stale exported text', () => {
  const correction = (archiveCorrections.corrections as any[])[0];
  const topic = {
    ...baseTopic,
    id: correction.topic_id,
    subject_name: correction.subject,
    term_label: correction.term,
    order_index: correction.order_index,
    title: correction.title,
    source_reference: 'old short export outline',
    summary: 'stale generated summary',
    generated_assessment_id: 77,
  };
  const result = resolvePrimary4SourceDelivery(topic);
  assert.equal(result?.kind, 'withheld');
  if (result?.kind === 'withheld') {
    assert.equal(result.source, 'archive-correction');
    assert.match(result.reason, /pending owner approval/i);
  }
  const safe = safePrimary4Topic(topic);
  assert.equal(safe.source_reference, null);
  assert.equal(safe.summary, null);
  assert.equal(safe.generated_assessment_id, null);
});

test('superseded Primary 4 outline and merged rows are explicitly hidden from student delivery', () => {
  const record = manifest.records.find((item: any) => item.id === 432) as any;
  assert.ok(record);
  const topic = {
    id: record.id,
    school_code: 'primary',
    class_name: 'Primary 4',
    subject_name: record.subject,
    term_label: record.term,
    order_index: record.order_index,
    title: record.title,
    source_reference: record.source_reference,
    summary: 'stale outline summary',
    generated_assessment_id: 88,
  };
  const result = resolvePrimary4SourceDelivery(topic);
  assert.equal(result?.kind, 'withheld');
  if (result?.kind === 'withheld') {
    assert.equal(result.source, 'archive-correction');
    assert.equal(result.hideFromStudent, true);
  }
  const safe = safePrimary4Topic(topic);
  assert.equal((safe as any).primary4_delivery.hide_from_student, true);
  assert.equal(safe.source_reference, null);
  assert.equal(safe.generated_assessment_id, null);
});
