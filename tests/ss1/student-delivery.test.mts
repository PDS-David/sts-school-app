import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudentSs1Lesson, isStudentDeliverableSs1Lesson, listStudentSs1Lessons } from '../../backend/src/db/ss1/studentDelivery.js';

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
