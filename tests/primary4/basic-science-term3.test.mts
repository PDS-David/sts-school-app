import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/basicScienceTerm3.json' with { type: 'json' };
import { getPrimary4SupplementRecords } from '../../backend/src/db/primary4/primary4Supplements.ts';

test('Basic Science third-term package covers the missing NERDC Primary 4 topics', () => {
  assert.equal(packageData.lessons.length, 5);
  assert.deepEqual(packageData.lessons.map((lesson: any) => lesson.title), [
    'Safety in Our Environment',
    'The Human Body: The Mouth and Its Functions',
    'Water: Properties, States, Uses and Safe Water',
    'Water Cycle and Formation of Rain',
    'Measuring Liquids: Volume and Metric Units',
  ]);
  for (const lesson of packageData.lessons as any[]) {
    assert.ok(lesson.objectives.length >= 3);
    assert.ok(lesson.lesson.length > 250);
    assert.ok(lesson.examples.length >= 2);
    assert.ok(lesson.activity.length > 20);
    assert.ok(lesson.evaluation.length >= 4);
  }
});

test('Basic Science term placement is owner-approved and ready for student delivery', () => {
  const records = getPrimary4SupplementRecords().filter(x => x.subject_name === 'Basic Science' && x.term_label === '3rd Term');
  assert.equal(records.length, 5);
  assert.deepEqual(records.map(x => x.order_index), [1,2,3,4,5]);
  assert.ok(records.every(x => x.source_reference.includes('Term allocation: OWNER_APPROVED_LOCAL_ALLOCATION')));
  assert.ok(records.every(x => x.source_reference.includes('Content approval: APPROVED')));
  assert.ok(records.every(x => x.source_reference.includes('Assessment rebuild: VERIFIED')));
});
