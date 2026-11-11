import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import packageData from '../../backend/src/db/ss1/subjects/french.json' with { type: 'json' };
import { createSs1FrenchDeliveryResolver } from '../../backend/src/utils/ss1FrenchDeliveryCorrection.ts';

test('French student-delivery adapter only accepts the approved SS1 French package', () => {
  const resolve = createSs1FrenchDeliveryResolver(packageData as any);
  assert.equal(typeof resolve, 'function');
  assert.equal(packageData.package_status, 'IMPLEMENTED');
  assert.equal(packageData.delivery_corrections.length, 28);
});

test('French delivery resolver does not widen school, class or subject access', () => {
  const resolve = createSs1FrenchDeliveryResolver(packageData as any);
  const probe = {
    school_code: 'secondary',
    class_name: 'SS 1',
    subject_name: 'French',
    term_label: '1st Term',
    source_file: 'FRENCH Ss1.docx',
    source_reference: 'not-the-reviewed-source-body',
  };
  assert.equal(resolve({ ...probe, school_code: 'primary' }), null);
  assert.equal(resolve({ ...probe, class_name: 'SS 2' }), null);
  assert.equal(resolve({ ...probe, subject_name: 'English Language' }), null);
  assert.equal(resolve(probe), null, 'an unrecognised source fingerprint must never receive a replacement');
});

test('French delivery resolver positively selects the exact registered source, term and replacement', () => {
  const candidate = structuredClone(packageData) as any;
  const correction = candidate.delivery_corrections[0];
  const source = candidate.sources.find((item: any) => item.source_id === correction.source_id);
  const body = 'Synthetic source body used only to verify exact resolver matching.';
  const bodyHash = createHash('sha256').update(body, 'utf8').digest('hex');
  correction.body_sha256 = bodyHash;
  correction.source_lesson_id = `${correction.source_id}:BODY:${bodyHash}`;
  correction.source_sha256 = source.sha256;

  const resolve = createSs1FrenchDeliveryResolver(candidate);
  const topic = {
    school_code: 'secondary',
    class_name: 'SS 1',
    subject_name: 'French',
    term_label: source.term,
    source_file: source.archive_member.split(/[\\\\/]/).pop(),
    source_reference: body,
  };
  const result = resolve(topic);
  assert.ok(result);
  assert.equal(result.correctionId, correction.id);
  assert.equal(result.sourceHash, bodyHash);
  assert.deepEqual(result.replacementLessonIds, [correction.replacement_id]);
  assert.match(result.text, /SS1 FRENCH DELIVERY CORRECTION/i);
  assert.equal(resolve({ ...topic, term_label: '3rd Term' }), null);
  assert.equal(resolve({ ...topic, source_file: 'another-subject.docx' }), null);
});
