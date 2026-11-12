import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/homeEconomicsTerm3Supplements.json' with { type: 'json' };
import { getPrimary4SupplementRecords } from '../../backend/src/db/primary4/primary4Supplements.ts';
import sourceManifest from '../../backend/src/db/primary4/sourceManifest.json' with { type: 'json' };

test('Home Economics Third-Term supplements cover seven scheme topics without replacing sewing records', () => {
  assert.equal(packageData.lessons.length, 7);
  const records = getPrimary4SupplementRecords().filter(x => x.subject_name === 'Home Economics' && x.term_label === '3rd Term');
  assert.equal(records.length, 7);
  assert.deepEqual(records.map(x => x.order_index), [22,23,24,25,26,27,28]);
  const existingTitles = new Set((sourceManifest as any).records.filter((x: any) => x.subject === 'Home Economics' && x.term === '3rd Term').map((x: any) => x.title.toLowerCase()));
  assert.ok(records.every(x => !existingTitles.has(x.title.toLowerCase())));
});

test('every Home Economics third-term supplement has complete lesson components', () => {
  for (const lesson of packageData.lessons as any[]) {
    assert.ok(lesson.objectives.length >= 2, lesson.id);
    assert.ok(lesson.lesson.length > 100, lesson.id);
    assert.ok(lesson.examples.length >= 2, lesson.id);
    assert.ok(lesson.activity.length > 20, lesson.id);
    assert.ok(lesson.evaluation.length >= 3, lesson.id);
  }
});

test('Home Economics practical supplements include age-appropriate safety', () => {
  const baking = packageData.lessons.find((x: any) => x.id === 'p4-he-t3-supp-w06') as any;
  const starch = packageData.lessons.find((x: any) => x.id === 'p4-he-t3-supp-w02') as any;
  const snacks = packageData.lessons.find((x: any) => x.id === 'p4-he-t3-supp-w08') as any;
  assert.ok(baking.lesson.includes('Only an adult should operate an oven'));
  assert.ok(starch.lesson.includes('Heating and hot liquids must be handled by an adult'));
  assert.ok(snacks.lesson.includes('food allergies'));
});
