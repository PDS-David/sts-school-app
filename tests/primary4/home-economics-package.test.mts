import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/primary4/researched/homeEconomicsTerms1And2.json' with { type: 'json' };
import { getPrimary4SupplementRecords } from '../../backend/src/db/primary4/primary4Supplements.ts';
import { resolvePrimary4SourceDelivery, safePrimary4Topic } from '../../backend/src/utils/primary4Delivery.ts';

test('Home Economics First and Second Term packages contain 18 complete lessons', () => {
  const lessons = packageData.lessons as any[];
  assert.equal(lessons.length, 18);
  assert.equal(lessons.filter(x => x.term === '1st Term').length, 9);
  assert.equal(lessons.filter(x => x.term === '2nd Term').length, 9);
  for (const lesson of lessons) {
    assert.ok(lesson.objectives.length >= 2, lesson.id);
    assert.ok(lesson.lesson.length > 100, lesson.id);
    assert.ok(lesson.examples.length >= 2, lesson.id);
    assert.ok(lesson.activity.length > 20, lesson.id);
    assert.ok(lesson.evaluation.length >= 3, lesson.id);
  }
});

test('Home Economics source records use stable curriculum keys and scheme provenance', () => {
  const records = getPrimary4SupplementRecords().filter(x => x.subject_name === 'Home Economics' && x.term_label !== '3rd Term');
  assert.equal(records.length, 18);
  assert.ok(records.every(x => x.source_reference.split('\n')[0] === `CURRICULUM_KEY: ${x.stable_key}`));
  assert.ok(records.every(x => x.source_reference.split('\n')[1] === 'PROVENANCE'));
  assert.ok(records.every(x => x.source_reference.includes('syllabus.ng/primary4-scheme-of-work/home-economics/')));
});

test('approved researched Home Economics topics are available with source provenance', () => {
  const record = getPrimary4SupplementRecords().find(x => x.stable_key === 'p4-he-t1-w01')!;
  const topic = {
    id: 999999, school_code: 'primary', class_name: 'Primary 4',
    subject_name: record.subject_name, term_label: record.term_label,
    order_index: record.order_index, title: record.title,
    source_reference: record.source_reference, source_file: record.source_file,
  };
  const result = resolvePrimary4SourceDelivery(topic);
  assert.equal(result?.kind, 'matched');
  assert.equal(result?.source, 'researched-package');
  assert.equal(resolvePrimary4SourceDelivery({ ...topic, source_file: 'wrong-package.json' })?.kind, 'withheld');
  if (result?.kind === 'matched') {
    assert.match(result.text, /Content approval: APPROVED/);
    assert.match(result.text, /Pedagogical verification: VERIFIED/);
    assert.match(result.text, /Assessment rebuild: VERIFIED/);
  }
  const safe = safePrimary4Topic(topic);
  assert.equal(safe.source_reference, record.source_reference);
  assert.equal((safe as any).primary4_delivery.status, 'researched-package-match');
});

test('liquid-soap lesson does not direct pupils to handle caustic soda or strong acids', () => {
  const lesson = packageData.lessons.find((x: any) => x.id === 'p4-he-t2-w08') as any;
  assert.ok(lesson.lesson.includes('must never be handled by pupils'));
  assert.ok(lesson.activity.includes('ready-made liquid soap'));
});
