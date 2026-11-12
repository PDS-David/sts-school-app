import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/basicTechnologyTerms1And2.json' with { type: 'json' };
import { buildBasicTechnologyTerms1And2ImportPlan } from '../../backend/src/db/primary4/buildBasicTechnologyTerms1And2ImportPlan.ts';
import { resolvePrimary4SourceDelivery } from '../../backend/src/utils/primary4Delivery.ts';

test('Basic Technology proposed First and Second Terms cover the missing NERDC topic areas', () => {
  const lessons = packageData.lessons as any[];
  assert.equal(lessons.length, 8);
  assert.equal(lessons.filter(x => x.term === '1st Term').length, 4);
  assert.equal(lessons.filter(x => x.term === '2nd Term').length, 4);
  for (const lesson of lessons) {
    assert.ok(lesson.objectives.length >= 3, lesson.id);
    assert.ok(lesson.lesson.length > 200, lesson.id);
    assert.ok(lesson.examples.length >= 2, lesson.id);
    assert.ok(lesson.activity.length > 20, lesson.id);
    assert.ok(lesson.evaluation.length >= 4, lesson.id);
  }
});

test('Basic Technology term allocation is explicit, proposed and insert-only', () => {
  const plan = buildBasicTechnologyTerms1And2ImportPlan();
  assert.equal(plan.topic_count, 8);
  assert.equal(plan.term_allocation, 'PROPOSED_LOCAL_SEQUENCE_NOT_STATED_BY_NERDC');
  assert.equal(plan.write_mode, 'INSERT_ONLY_NO_UPDATE');
  assert.equal(plan.requires_explicit_owner_approval, true);
  assert.equal(plan.production_write_performed, false);
  assert.ok(plan.topics.every((topic: any) => topic.source_reference.includes('NERDC does not prescribe First-Term or Second-Term placement')));
  assert.ok(plan.topics.every((topic: any) => topic.source_reference.startsWith('CURRICULUM_KEY: ')));
});

test('Basic Technology practical activities do not ask pupils to operate vehicles or dangerous tools', () => {
  const vehicle = packageData.lessons.find((x: any) => x.id === 'p4-bt-t1-w05') as any;
  const materials = packageData.lessons.find((x: any) => x.id === 'p4-bt-t2-w03') as any;
  assert.ok(vehicle.lesson.includes('must not operate a vehicle'));
  assert.ok(materials.activity.includes('without using sharp tools'));
});

test('proposed Basic Technology lessons remain withheld until owner approval and verification', () => {
  const topic = buildBasicTechnologyTerms1And2ImportPlan().topics[0] as any;
  const result = resolvePrimary4SourceDelivery({
    id: 999999, school_code: 'primary', class_name: 'Primary 4',
    subject_name: topic.subject_name, term_label: topic.term_label,
    order_index: topic.order_index, title: topic.title, source_reference: topic.source_reference,
  });
  assert.equal(result?.kind, 'withheld');
  assert.equal(result?.source, 'researched-package');
  if (result?.kind === 'withheld') assert.match(result.reason, /pending owner approval and independent verification/);
});
