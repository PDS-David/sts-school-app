import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/basicTechnologyTerms1And2.json' with { type: 'json' };
import { getPrimary4SupplementRecords } from '../../backend/src/db/primary4/primary4Supplements.ts';
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

test('Basic Technology term allocation is explicit and proposed, not presented as official', () => {
  const records = getPrimary4SupplementRecords().filter(x => x.subject_name === 'Basic Technology');
  assert.equal(records.length, 8);
  assert.equal(records.filter(x => x.term_label === '1st Term').length, 4);
  assert.equal(records.filter(x => x.term_label === '2nd Term').length, 4);
  assert.ok(records.every(x => x.source_reference.includes('Term allocation: PROPOSED_LOCAL_SEQUENCE_NOT_STATED_BY_NERDC')));
});

test('proposed Basic Technology lessons remain withheld until owner approval and verification', () => {
  const record = getPrimary4SupplementRecords().find(x => x.stable_key === 'p4-bt-t1-w02')!;
  const result = resolvePrimary4SourceDelivery({
    id: 999999, school_code: 'primary', class_name: 'Primary 4',
    subject_name: record.subject_name, term_label: record.term_label,
    order_index: record.order_index, title: record.title,
    source_reference: record.source_reference, source_file: record.source_file,
  });
  assert.equal(result?.kind, 'withheld');
  assert.equal(result?.source, 'researched-package');
  if (result?.kind === 'withheld') assert.match(result.reason, /pending owner approval and independent verification/);
});

test('Basic Technology practical activities do not ask pupils to operate vehicles or dangerous tools', () => {
  const vehicle = packageData.lessons.find((x: any) => x.id === 'p4-bt-t1-w05') as any;
  const materials = packageData.lessons.find((x: any) => x.id === 'p4-bt-t2-w03') as any;
  assert.ok(vehicle.lesson.includes('must not operate a vehicle'));
  assert.ok(materials.activity.includes('without using sharp tools'));
});
