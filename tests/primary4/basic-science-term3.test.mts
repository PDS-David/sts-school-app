import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/basicScienceTerm3.json' with { type: 'json' };
import { buildBasicScienceTerm3ImportPlan } from '../../backend/src/db/primary4/buildBasicScienceTerm3ImportPlan.ts';

test('Basic Science third-term package covers the missing NERDC Primary 4 topics', () => {
  assert.equal(packageData.lessons.length, 3);
  assert.deepEqual(packageData.lessons.map((lesson: any) => lesson.title), [
    'Safety in Our Environment',
    'The Human Body: The Mouth and Its Functions',
    'Water Cycle and Formation of Rain',
  ]);
  for (const lesson of packageData.lessons as any[]) {
    assert.ok(lesson.objectives.length >= 3);
    assert.ok(lesson.lesson.length > 250);
    assert.ok(lesson.examples.length >= 2);
    assert.ok(lesson.activity.length > 20);
    assert.ok(lesson.evaluation.length >= 4);
  }
});

test('Basic Science third-term import plan is insert-only and records proposed term allocation', () => {
  const plan = buildBasicScienceTerm3ImportPlan();
  assert.equal(plan.topic_count, 3);
  assert.equal(plan.write_mode, 'INSERT_ONLY_NO_UPDATE');
  assert.equal(plan.requires_explicit_owner_approval, true);
  assert.equal(plan.production_write_performed, false);
  assert.ok(plan.topics.every((topic: any) => topic.source_reference.includes('does not prescribe this term placement')));
});
