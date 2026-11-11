import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import packageData from '../../backend/src/db/ss1/subjects/mathematics.json' with { type: 'json' };
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { createSs1MathematicsDeliveryResolver, retireStaleSs1MathematicsCache } from '../../backend/src/utils/ss1MathematicsDeliveryCorrection.ts';

const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const packageValue = packageSchema.parse(packageData);
const topicFor = (correction: typeof packageValue.delivery_corrections[number], overrides: Record<string, unknown> = {}) => {
  const source = packageValue.sources.find(item => item.source_id === correction.source_id)!;
  const titleByCorrection: Record<string, string> = {
    'CORR-MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS': 'REVISION AND BASIC OPERATIONS OF INTEGER',
    'CORR-MATHEMATICS-T1-W02-NUMBER-BASES': 'NUMBER BASES /BASE NUMBER.',
    'CORR-MATHEMATICS-T1-W03-BASE-OPERATIONS': 'RULES OF BASE NUMBER',
    'CORR-MATHEMATICS-T1-W04-MODULAR-ARITHMETIC': 'MODULAR ARITHMETIC',
    'CORR-MATHEMATICS-T1-W05-STANDARD-FORM': 'STANDARD FORM AND APPROXIMATION',
    'CORR-MATHEMATICS-T1-W06-INDICES': 'INDICES',
    'CORR-MATHEMATICS-T1-W08-LOGARITHMS': 'LOGARITHMS OF WHOLE NUMBERS',
    'CORR-MATHEMATICS-T1-W09-LOG-POWERS': 'SQUARES OR POWERS OF NUMBERS IN LOGARITHMS',
    'CORR-MATHEMATICS-T1-W10-EQUATIONS-VARIATION': 'SIMPLE EQUATION AND VARIATION',
    'CORR-MATHEMATICS-T2-2-00': 'Quadratic equation by (a) Factorization (b) Completing the square method',
    'CORR-MATHEMATICS-T2-2-01': 'General form of quadratic equation leading to Formular method',
    'CORR-MATHEMATICS-T2-2-02': 'Solution of quadratic equation by graphical method.',
    'CORR-MATHEMATICS-T2-W04-SETS': 'IDEA OF SETS',
    'CORR-MATHEMATICS-T2-2-04': 'SETS',
    'CORR-MATHEMATICS-T2-2-06': 'TRIGONOMETRIC RATIOS',
    'CORR-MATHEMATICS-T2-2-07': 'Application of sine, cosine and tangent, simple problems with respect to right angle triangles.',
    'CORR-MATHEMATICS-T2-2-08': 'Introduction of circle and its properties',
    'CORR-MATHEMATICS-T2-2-09': 'LOGIC',
    'CORR-MATHEMATICS-T3-3-00': 'Mensuration: The concept of B – D a shape cube, cuboids, cylinder, triangular prism, cone, rectangular based pyramid, total surface area of cone, cylinder and their volumes.',
    'CORR-MATHEMATICS-T3-3-01': '(a) Volumes of frustums of cone, rectangular based pyramid and other pyramids',
    'CORR-MATHEMATICS-T3-3-04': 'Deductive proof',
    'CORR-MATHEMATICS-T3-3-05': 'STATISTICS',
    'CORR-MATHEMATICS-T3-3-07': 'Collection, Tabulation and Presentation of Grouped Data',
    'CORR-MATHEMATICS-T3-W09-GROUPED-DATA': 'Calculation of Range, Median and Mode of Grouped data',
    'CORR-MATHEMATICS-T3-3-09': 'Statistical Graphs',
    'CORR-MATHEMATICS-T3-3-10': 'Mean Deviation, Variance and standard Deviation of Grouped Data use in solving practical problems related to real life situations',
  };
  return {
    school_code: 'secondary', class_name: 'SS 1', subject_name: 'Mathematics',
    term_label: source.term, title: titleByCorrection[correction.id],
    source_file: source.archive_member.split('/').at(-1),
    source_reference: 'not-the-reviewed-source-body',
    ...overrides,
  };
};

test('Mathematics package contains unique lessons, source bindings, and correctly totalled marking criteria', () => {
  assert.equal(packageValue.subject_slug, 'mathematics');
  assert.equal(packageValue.lessons.length, 27);
  assert.equal(packageValue.delivery_corrections.length, 26);
  assert.equal(new Set(packageValue.lessons.map(item => item.id)).size, packageValue.lessons.length);
  assert.equal(new Set(packageValue.delivery_corrections.map(item => item.id)).size, packageValue.delivery_corrections.length);
  for (const lesson of packageValue.lessons) {
    assert.equal(hash(lesson.body), lesson.body_sha256, lesson.id);
    assert(lesson.practice.length > 0, lesson.id);
    for (const question of lesson.practice) {
      assert(question.answer.trim(), `${lesson.id}/${question.id} must have an answer`);
      assert.equal(question.marks, question.marking.reduce((sum, criterion) => sum + criterion.marks, 0),
        `${lesson.id}/${question.id} marking total`);
    }
  }
});

test('Mathematics delivery is restricted to SS 1 secondary Mathematics and exact source-row identity', () => {
  const resolve = createSs1MathematicsDeliveryResolver(packageValue);
  for (const correction of packageValue.delivery_corrections) {
    const topic = topicFor(correction);
    assert.equal(resolve({ ...topic, school_code: 'primary' } as any), null);
    assert.equal(resolve({ ...topic, class_name: 'SS 2' } as any), null);
    assert.equal(resolve({ ...topic, subject_name: 'Further Mathematics' } as any), null);
    const result = resolve(topic as any);
    assert.equal(result?.kind, 'withheld', correction.id);
    assert.equal(result?.correctionId, correction.id);
    assert.match(result?.text ?? '', /source fingerprint/i);
  }
});

test('Mathematics replacement is shown only after source, scoped blockers, approval and verification pass', () => {
  const fixture = JSON.parse(JSON.stringify(packageValue));
  const correction = fixture.delivery_corrections[0];
  const lesson = fixture.lessons.find((item: any) => item.id === correction.replacement_id);
  const sourceText = 'synthetic reviewed source row for delivery test';
  correction.body_sha256 = hash(sourceText);
  correction.source_lesson_id = `${correction.source_id}:BODY:${correction.body_sha256}`;
  fixture.open_items = fixture.open_items.filter((item: any) => !item.affected_ids.includes(correction.replacement_id) &&
    !item.affected_ids.includes(correction.source_lesson_id) && !item.affected_ids.includes(correction.id));
  lesson.state = {
    content_approval: 'APPROVED', approval_reference: 'test-only approval fixture',
    implementation: 'IMPLEMENTED', verification: 'VERIFIED', verification_reference: 'test-only verification fixture',
  };
  const resolve = createSs1MathematicsDeliveryResolver(packageSchema.parse(fixture));
  const topic = topicFor(correction, { source_reference: sourceText });
  const result = resolve(topic as any);
  assert.equal(result?.kind, 'corrected');
  assert(result?.text.includes(lesson.title));
  assert.deepEqual(result?.replacementLessonIds, [lesson.id]);
});

test('stale Mathematics topic cache is retired and its generated assessment is closed', async () => {
  const correction = packageValue.delivery_corrections[0];
  const resolver = createSs1MathematicsDeliveryResolver(packageValue);
  const delivery = resolver(topicFor(correction) as any)!;
  const calls: Array<{ sql: string; params: unknown[] }> = [];
  const query = async (sql: string, params: unknown[] = []) => {
    calls.push({ sql, params });
    return { rows: [{ retired: 1, closed_assessments: 1 }] };
  };
  const result = await retireStaleSs1MathematicsCache(query, 8123, delivery);
  assert.deepEqual(result, { retired: true, closedAssessments: true });
  assert(calls[0].sql.includes('FOR UPDATE OF t'));
  assert.equal(calls[0].params[0], 8123);
  assert.equal(calls[0].params[3], 'secondary');
  assert.equal(calls[0].params[5], 'Mathematics');
});
