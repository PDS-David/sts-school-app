import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/homeEconomicsTerm3Supplements.json' with { type: 'json' };
import { buildHomeEconomicsTerm3SupplementPlan } from '../../backend/src/db/primary4/buildHomeEconomicsTerm3SupplementPlan.ts';

test('Home Economics third-term supplements fill scheme topics without replacing existing sewing lessons', () => {
  assert.equal(packageData.lessons.length, 6);
  const plan = buildHomeEconomicsTerm3SupplementPlan();
  assert.equal(plan.existing_topic_rows, 21);
  assert.equal(plan.existing_max_order_index, 21);
  assert.equal(plan.topic_count, 6);
  assert.equal(plan.write_mode, 'INSERT_ONLY_NO_UPDATE');
  assert.equal(plan.requires_explicit_owner_approval, true);
  assert.equal(plan.production_write_performed, false);
  assert.deepEqual(plan.topics.map((topic: any) => topic.order_index), [22,23,24,25,26,27]);
  assert.ok(plan.topics.every((topic: any) => topic.source_reference.includes('PENDING OWNER REVIEW')));
});

test('Home Economics third-term supplementary lessons include age-appropriate safety', () => {
  const baking = packageData.lessons.find((x: any) => x.id === 'p4-he-t3-supp-w05') as any;
  const soap = packageData.lessons.find((x: any) => x.id === 'p4-he-t3-supp-w02') as any;
  const snacks = packageData.lessons.find((x: any) => x.id === 'p4-he-t3-supp-w06') as any;
  assert.ok(baking.lesson.includes('Only an adult should operate an oven'));
  assert.ok(soap.lesson.includes('Heating and hot liquids must be handled by an adult'));
  assert.ok(snacks.lesson.includes('food allergies'));
});
