import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudentSs1Lesson, isStudentDeliverableSs1Lesson, listStudentSs1Lessons, listStudentSs1Assets, readStudentSs1Asset } from '../../backend/src/db/ss1/studentDelivery.js';

test('SS1 student delivery exposes only lessons with approval, implementation, verification and permitted provenance', () => {
  const lessons = listStudentSs1Lessons();
  assert.ok(lessons.length > 0, 'at least one individually certified SS1 lesson must be available');
  for (const lesson of lessons) {
    assert.equal(isStudentDeliverableSs1Lesson(lesson), true, lesson.id);
    assert.equal(lesson.state.content_approval, 'APPROVED');
    assert.ok(lesson.state.approval_reference?.trim());
    assert.equal(lesson.state.implementation, 'IMPLEMENTED');
    assert.equal(lesson.state.verification, 'VERIFIED');
    assert.ok(lesson.state.verification_reference?.trim());
    assert.ok(lesson.provenance.length > 0);
    assert.ok(lesson.provenance.every(source => source.reuse_status === 'PERMITTED'));
  }
});

test('SS1 student delivery filters by canonical subject name', () => {
  const subjects = [...new Set(listStudentSs1Lessons().map(lesson => lesson.canonical_subject))];
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
