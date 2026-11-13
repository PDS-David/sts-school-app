import test from 'node:test';
import assert from 'node:assert/strict';
import manifest from '../../backend/src/db/primary4/sourceManifest.json' with { type: 'json' };
import archiveCorrections from '../../backend/src/db/primary4/researched/archiveLessonCorrections.json' with { type: 'json' };
import { resolvePrimary4SourceDelivery, safePrimary4Topic, primary4WithdrawnAssessmentIds, primary4AssessmentDeliverable, retireStalePrimary4Cache } from '../../backend/src/utils/primary4Delivery.ts';

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

test('approved archive correction takes precedence over the superseded Primary 4 export source', () => {
  const result = resolvePrimary4SourceDelivery(baseTopic);
  assert.equal(result?.kind, 'matched');
  if (result?.kind === 'matched') {
    assert.equal(result.source, 'archive-correction');
    assert.equal(result.displayTitle, 'CHANGES IN NATURE');
    assert.match(result.text, /Content approval: APPROVED/);
    assert.match(result.text, /Assessment rebuild: VERIFIED/);
  }
});

test('source delivery does not match another class, school, subject, term, title, order or changed body', () => {
  assert.equal(resolvePrimary4SourceDelivery({ ...baseTopic, class_name: 'Primary 5' }), null);
  assert.equal(resolvePrimary4SourceDelivery({ ...baseTopic, school_code: 'secondary' }), null);
  for (const changed of [
    { subject_name: 'Basic Technology' }, { term_label: '2nd Term' },
    { title: 'Different title' }, { order_index: 2 },
  ]) {
    assert.equal(resolvePrimary4SourceDelivery({ ...baseTopic, ...changed })?.kind, 'withheld');
  }
});

test('safe topic projection removes a drifted original export source, summary and assessment link', () => {
  const record = manifest.records.find((item: any) => item.id === 300) as any;
  const topic = {
    id: record.id, school_code: 'primary', class_name: 'Primary 4',
    subject_name: record.subject, term_label: record.term, order_index: record.order_index,
    title: record.title, source_reference: 'changed original source body',
    summary: 'stale lesson', generated_assessment_id: 91,
  };
  const safe = safePrimary4Topic(topic);
  assert.equal(safe.source_reference, null);
  assert.equal(safe.summary, null);
  assert.equal(safe.generated_assessment_id, null);
  assert.equal((safe as any).primary4_delivery.status, 'withheld');
});

test('retiring an approved archive correction closes stale assessment and clears cached summary/link', async () => {
  const calls: Array<{ sql: string; params?: unknown[] }> = [];
  const query = async (sql: string, params?: unknown[]) => {
    calls.push({ sql, params });
    return { rows: [{ retired: 1, closed_assessments: 1, updated_topics: 1 }] };
  };
  const correction = (archiveCorrections.corrections as any[])[0];
  const result = resolvePrimary4SourceDelivery({
    ...baseTopic, id: correction.topic_id, subject_name: correction.subject, term_label: correction.term,
    order_index: correction.source_order_index, title: correction.source_title,
  });
  assert.equal(result?.kind, 'matched');
  if (!result || result.kind !== 'matched') return;
  const retired = await retireStalePrimary4Cache(query, correction.topic_id, result);
  assert.deepEqual(retired, { retired: true, closedAssessments: 1, updatedTopic: true });
  assert.match(calls[0].sql, /UPDATE assessments a SET status='closed'/);
  assert.match(calls[0].sql, /generated_assessment_id=CASE WHEN EXISTS/);
  assert.equal(calls[0].params?.[1], result.sourceHash);
  assert.equal(calls[0].params?.[3], true);
});

test('Primary 4 assessment is rejected when its linked correction fingerprint is stale', async () => {
  const correction = (archiveCorrections.corrections as any[])[0];
  const topic = {
    ...baseTopic, id: correction.topic_id, subject_name: correction.subject, term_label: correction.term,
    order_index: correction.source_order_index, title: correction.source_title,
    generated_assessment_id: 91, content_fingerprint: null,
  };
  let linkedRead = false;
  const query = async (sql: string) => {
    if (sql.startsWith('SELECT content_fingerprint')) return { rows: [{ content_fingerprint: null }] };
    if (sql.includes('JOIN assessments a')) {
      linkedRead = true;
      return { rows: [topic] };
    }
    return { rows: [{ retired: 1, closed_assessments: 1, updated_topics: 1 }] };
  };
  const result = await primary4AssessmentDeliverable(query, 91);
  assert.equal(linkedRead, true);
  assert.equal(result.ok, false);
  assert.match(result.reason, /withdrawn/i);
});

test('withdrawn assessment lookup hides only stale or withheld Primary 4 assessments', async () => {
  const query = async (sql: string) => {
    if (sql.includes('left(content_fingerprint')) return { rows: [] };
    if (sql.includes('JOIN assessments a')) return { rows: [
      { ...baseTopic, source_reference: outline + ' changed', generated_assessment_id: 91, content_fingerprint: null },
      { ...baseTopic, class_name: 'Primary 5', generated_assessment_id: 92, content_fingerprint: null },
    ] };
    return { rows: [{ retired: 1, closed_assessments: 1, updated_topics: 1 }] };
  };
  const ids = await primary4WithdrawnAssessmentIds(query, [91, 92, 93]);
  assert.deepEqual([...ids], [91]);
});


test('archive correction package contains structurally complete lessons and explicit approval gates', () => {
  assert.equal(archiveCorrections.corrections.length, 33);
  assert.equal(archiveCorrections.hidden_topic_ids.length, 16);
  assert.equal(archiveCorrections.provenance.archive_sha256, '69731806a1c59185a4d5f8f408cb87fb0897778265d654676e134615b88d4da5');
  const ids = archiveCorrections.corrections.map((record: any) => record.topic_id);
  assert.equal(new Set(ids).size, ids.length);
  for (const record of archiveCorrections.corrections as any[]) {
    const sourceIdentity = manifest.records.find((item: any) => item.id === record.topic_id) as any;
    assert.ok(sourceIdentity, record.title);
    assert.equal(record.source_title, sourceIdentity.title);
    assert.equal(record.source_order_index, sourceIdentity.order_index);
    assert.equal(record.subject, sourceIdentity.subject);
    assert.equal(record.term, sourceIdentity.term);
    assert.ok(record.objectives.length >= 2, record.title);
    assert.ok(record.lesson.length >= 100, record.title);
    assert.ok(record.examples.length >= 2, record.title);
    assert.ok(record.activity.length >= 20, record.title);
    assert.ok(record.evaluation.length >= 3, record.title);
    assert.equal(record.content_approval, 'APPROVED');
    assert.equal(record.pedagogical_verification, 'VERIFIED');
    assert.equal(record.assessment_rebuild_status, 'VERIFIED');
  }
});

test('approved archive corrections replace the stale exported lesson body', () => {
  const correction = (archiveCorrections.corrections as any[])[0];
  const topic = {
    ...baseTopic,
    id: correction.topic_id,
    subject_name: correction.subject,
    term_label: correction.term,
    order_index: correction.source_order_index,
    title: correction.source_title,
    source_reference: 'old short export outline',
    summary: 'stale generated summary',
    generated_assessment_id: 77,
  };
  const result = resolvePrimary4SourceDelivery(topic);
  assert.equal(result?.kind, 'matched');
  if (result?.kind === 'matched') {
    assert.equal(result.source, 'archive-correction');
    assert.equal(result.displayTitle, correction.title);
  }
  const safe = safePrimary4Topic(topic);
  assert.equal(safe.source_reference, result && result.kind === 'matched' ? result.text : null);
  assert.equal(safe.title, correction.title);
  assert.equal((safe as any).primary4_delivery.status, 'archive-correction-match');
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


test('every retired Primary 4 outline/merged row matches a known export identity before hiding', () => {
  for (const id of archiveCorrections.hidden_topic_ids as number[]) {
    const record = manifest.records.find((item: any) => item.id === id) as any;
    assert.ok(record, `missing manifest row for hidden id ${id}`);
    const topic = {
      id,
      school_code: 'primary',
      class_name: 'Primary 4',
      subject_name: record.subject,
      term_label: record.term,
      order_index: record.order_index,
      title: record.title,
      source_reference: 'old outline source',
      summary: 'stale summary',
      generated_assessment_id: 91,
    };
    const delivery = resolvePrimary4SourceDelivery(topic);
    assert.equal(delivery?.kind, 'withheld', `hidden id ${id}`);
    if (delivery?.kind === 'withheld') assert.equal(delivery.hideFromStudent, true, `hidden id ${id}`);
  }
});

test('every length-flagged Primary 4 export row is corrected or explicitly suppressed', () => {
  const flagged = (manifest.records as any[]).filter(record => record.review_flag !== 'CONTENT_PRESENT');
  const corrected = new Set((archiveCorrections.corrections as any[]).map(record => record.topic_id));
  const hidden = new Set(archiveCorrections.hidden_topic_ids as number[]);
  assert.equal(flagged.length, 45);
  const unresolved = flagged.filter(record => !corrected.has(record.id) && !hidden.has(record.id));
  assert.deepEqual(unresolved, []);
  assert.equal(flagged.filter(record => corrected.has(record.id)).length, 32);
  assert.equal(flagged.filter(record => hidden.has(record.id)).length, 13);
});

test('Roman Numerals lesson correction expands the source table into explicit rules and worked examples', () => {
  const correction = (archiveCorrections.corrections as any[]).find(record => record.topic_id === 311);
  assert.ok(correction);
  assert.equal(correction.source_title, 'Roman Numerals');
  assert.equal(correction.source_order_index, 4);
  assert.match(correction.lesson, /I = 1, V = 5, X = 10, L = 50 and C = 100/);
  assert.match(correction.lesson, /IV = 4 and IX = 9/);
  assert.ok(correction.evaluation.length >= 5);
});
