import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudentSs1Lesson, isStudentDeliverableSs1Lesson, listStudentSs1Lessons, listStudentSs1Assets, readStudentSs1Asset, studentSs1LessonPreview } from '../../backend/src/db/ss1/studentDelivery.js';
import { studentTopicPreview } from '../../backend/src/utils/jss3Sequence.js';
import { loadPackages } from '../../backend/src/db/ss1/loader.js';

test('SS1 student delivery exposes approved implemented lessons without hiding deferred classroom verification', () => {
  const lessons = listStudentSs1Lessons();
  assert.ok(lessons.length > 0, 'at least one individually certified SS1 lesson must be available');
  for (const lesson of lessons) {
    assert.equal(isStudentDeliverableSs1Lesson(lesson), true, lesson.id);
    assert.equal(lesson.state.content_approval, 'APPROVED');
    assert.ok(lesson.state.approval_reference?.trim());
    assert.equal(lesson.state.implementation, 'IMPLEMENTED');
    assert.equal(lesson.package_status, 'IMPLEMENTED');
    if (lesson.state.verification === 'VERIFIED') {
      assert.ok(lesson.state.verification_reference?.trim());
      assert.equal(lesson.classroom_verification_pending, false);
    } else {
      assert.equal(lesson.state.verification, 'DEFERRED');
      assert.equal(lesson.state.verification_reference, null);
      assert.equal(lesson.classroom_verification_pending, true);
    }
    assert.ok(lesson.provenance.length > 0);
    assert.ok(lesson.provenance.every(source => source.reuse_status === 'PERMITTED'));
  }
});

test('SS1 student delivery filters by canonical subject name', () => {
  const all = listStudentSs1Lessons();
  assert.ok(all.some(lesson => lesson.classroom_verification_pending), 'deferred classroom verification must be surfaced rather than silently relabelled');
  const subjects = [...new Set(all.map(lesson => lesson.canonical_subject))];
  for (const subject of subjects) {
    const filtered = listStudentSs1Lessons(subject);
    assert.ok(filtered.length > 0, subject);
    assert.ok(filtered.every(lesson => lesson.canonical_subject === subject));
  }
});

test('SS1 student delivery lookup rejects unknown lesson IDs', () => {
  const lesson = listStudentSs1Lessons()[0];
  if (lesson) assert.deepEqual(getStudentSs1Lesson(lesson.id), lesson);
  assert.equal(getStudentSs1Lesson('not-a-real-ss1-lesson'), null);
});

test('SS1 package assets are delivered only for certified lessons and their own verified asset records', () => {
  const lessons = listStudentSs1Lessons();
  const assets = lessons.flatMap(lesson => listStudentSs1Assets(lesson.id));
  assert.ok(assets.length > 0, 'at least one verified SS1 lesson asset must be available');
  for (const asset of assets) {
    assert.ok(lessons.some(lesson => lesson.id === asset.lesson_id));
    const result = readStudentSs1Asset(asset.id);
    assert.ok(result, asset.id);
    assert.equal(result.asset.sha256, asset.sha256);
    assert.equal(result.bytes.length, asset.bytes);
  }
});


test('locked SS1 lesson previews contain metadata only and never expose teaching content or source details', () => {
  const lesson = listStudentSs1Lessons()[0];
  assert.ok(lesson, 'a certified lesson fixture must exist');
  const preview = studentSs1LessonPreview(lesson, true);
  assert.equal(preview.locked, true);
  assert.equal(preview.id, lesson.id);
  assert.equal(preview.practice_count, lesson.practice.length);
  assert.equal('body' in preview, false);
  assert.equal('practice' in preview, false);
  assert.equal('provenance' in preview, false);
  assert.equal('objectives' in preview, false);
  assert.equal('assets' in preview, false);
});


test('locked student topic previews expose navigation metadata only', () => {
  const source = {
    id: 42,
    title: 'Quadratic equations',
    school_code: 'secondary',
    subject_id: 7,
    subject_name: 'Mathematics',
    class_name: 'SS 1',
    term_id: 2,
    term_label: '1st Term',
    order_index: 4,
    description: 'Hidden teaching text',
    summary: 'Hidden generated summary',
    source_file: 'private-source.docx',
    source_reference: 'private locator',
  };
  const preview = studentTopicPreview(source, false, {
    locked: true,
    sequence_position: 4,
    is_sequence_first: false,
  });
  assert.equal(preview.id, 42);
  assert.equal(preview.school_code, 'secondary');
  assert.equal(preview.locked, true);
  assert.equal(preview.sequence_position, 4);
  assert.equal('description' in preview, false);
  assert.equal('summary' in preview, false);
  assert.equal('source_file' in preview, false);
  assert.equal('source_reference' in preview, false);
});


test('Technical Drawing is not exposed to students while its package and lesson approvals remain pending', () => {
  const lessons = listStudentSs1Lessons('Technical Drawing');
  assert.deepEqual(lessons, [], 'pending Technical Drawing content must not enter student delivery');
});


test('unapproved Technical Drawing figures are hidden from student asset lists and direct byte lookup', () => {
  const subject = loadPackages().find(item => item.subject_slug === 'technical-drawing');
  assert.ok(subject, 'Technical Drawing package must be registered');
  assert.ok(subject.assets.length > 0, 'Technical Drawing source assets must be covered by this regression');

  for (const lesson of subject.lessons) {
    assert.deepEqual(listStudentSs1Assets(lesson.id), [], `unapproved lesson assets leaked: ${lesson.id}`);
  }
  for (const asset of subject.assets) {
    assert.equal(readStudentSs1Asset(asset.id), null, `unapproved asset bytes leaked: ${asset.id}`);
  }
});
