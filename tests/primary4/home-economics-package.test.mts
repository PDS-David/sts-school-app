import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/homeEconomicsTerms1And2.json' with { type: 'json' };
import { buildHomeEconomicsImportPlan } from '../../backend/src/db/primary4/buildHomeEconomicsImportPlan.ts';

test('researched Home Economics package has structured lessons for both missing terms', () => {
  const lessons = packageData.lessons as any[];
  assert.equal(lessons.length, 17);
  assert.deepEqual([...new Set(lessons.map(x => x.term))].sort(), ['1st Term', '2nd Term']);
  for (const lesson of lessons) {
    assert.ok(lesson.id && lesson.title && lesson.lesson.length > 100);
    assert.ok(lesson.objectives.length >= 2);
    assert.ok(lesson.examples.length >= 2);
    assert.ok(lesson.activity.length > 20);
    assert.ok(lesson.evaluation.length >= 3);
  }
});

test('Home Economics import plan is reproducible, insert-only and requires owner approval', () => {
  const plan = buildHomeEconomicsImportPlan();
  assert.equal(plan.topic_count, 17);
  assert.equal(plan.write_mode, 'INSERT_ONLY_NO_UPDATE');
  assert.equal(plan.requires_explicit_owner_approval, true);
  assert.equal(plan.production_write_performed, false);
  assert.equal(new Set(plan.topics.map((topic: any) => topic.stable_key)).size, 17);
  assert.ok(plan.topics.every((topic: any) => topic.class_name === 'Primary 4' && topic.subject_name === 'Home Economics'));
  assert.ok(plan.topics.every((topic: any) => topic.source_reference.includes('PENDING OWNER REVIEW')));
});

test('liquid-soap lesson does not direct pupils to handle caustic soda or strong acids', () => {
  const lesson = packageData.lessons.find((x: any) => x.id === 'p4-he-t2-w08') as any;
  assert.ok(lesson.lesson.includes('must never be handled by pupils'));
  assert.ok(lesson.activity.includes('ready-made liquid soap'));
});
