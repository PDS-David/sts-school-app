import test from 'node:test';
import assert from 'node:assert/strict';
import packageData from '../../backend/src/db/ss1/subjects/french.json' with { type: 'json' };
import {
  createSs1FrenchDeliveryResolver,
  retireStaleSs1FrenchCache,
  SS1_FRENCH_WITHDRAWN_FINGERPRINT_PREFIX,
  type Ss1FrenchResolution,
} from '../../backend/src/utils/ss1FrenchDeliveryCorrection.ts';

test('French resolver refuses any package with partial student-delivery coverage', () => {
  const candidate = structuredClone(packageData) as any;
  candidate.coverage[0].status = 'PARTIAL';
  assert.throws(() => createSs1FrenchDeliveryResolver(candidate), /not approved for student delivery/);
});

test('French resolver refuses unresolved coverage and delivery-blocking open items', () => {
  const unresolved = structuredClone(packageData) as any;
  unresolved.coverage[0].status = 'UNRESOLVED';
  assert.throws(() => createSs1FrenchDeliveryResolver(unresolved), /not approved for student delivery/);

  const blocked = structuredClone(packageData) as any;
  blocked.open_items[0].blocks_delivery = true;
  assert.throws(() => createSs1FrenchDeliveryResolver(blocked), /not approved for student delivery/);
});

test('French resolver refuses unapproved or unimplemented lessons', () => {
  const unapproved = structuredClone(packageData) as any;
  unapproved.lessons[0].state.content_approval = 'PENDING';
  assert.throws(() => createSs1FrenchDeliveryResolver(unapproved), /not approved for student delivery/);

  const unimplemented = structuredClone(packageData) as any;
  unimplemented.lessons[0].state.implementation = 'DRAFT';
  assert.throws(() => createSs1FrenchDeliveryResolver(unimplemented), /not approved for student delivery/);
});

test('French resolver refuses a correction bound to the wrong registered source hash', () => {
  const candidate = structuredClone(packageData) as any;
  candidate.delivery_corrections[0].source_sha256 = '0'.repeat(64);
  assert.throws(() => createSs1FrenchDeliveryResolver(candidate), /Invalid SS1 French correction binding/);
});

test('French resolver refuses duplicate correction identities', () => {
  const candidate = structuredClone(packageData) as any;
  candidate.delivery_corrections[1].id = candidate.delivery_corrections[0].id;
  assert.throws(() => createSs1FrenchDeliveryResolver(candidate), /Duplicate SS1 French correction ID/);
});

const delivery: Ss1FrenchResolution = {
  source: 'ss1-french',
  termLabel: '1st Term',
  kind: 'corrected',
  correctionId: 'SS1-02-french-COR-001',
  text: 'Approved French replacement lesson',
  fingerprint: 'a'.repeat(64),
  sourceHash: 'b'.repeat(64),
  replacementLessonIds: ['SUP-SS1-FRENCH-PURPOSE-T1'],
};

test('French cache retirement uses bound parameters and locks only the matching SS1 French topic', async () => {
  let capturedSql = '';
  let capturedParams: unknown[] = [];
  const query = async (sql: string, params: unknown[] = []) => {
    capturedSql = sql;
    capturedParams = params;
    return { rows: [{ retired: '1', closed_assessments: '1' }] };
  };

  const result = await retireStaleSs1FrenchCache(query, 'topic-123', delivery);
  assert.equal(result.retired, true);
  assert.equal(result.closedAssessments, 1);
  assert.match(capturedSql, /WHERE t\.id=\$1 AND t\.school_code=\$4 AND t\.class_name=\$5 AND s\.name=\$6 AND t\.term_label=\$7/);
  assert.match(capturedSql, /FOR UPDATE OF t/);
  assert.match(capturedSql, /a\.content_fingerprint IS DISTINCT FROM \$3/);
  assert.deepEqual(capturedParams, [
    'topic-123',
    delivery.text,
    delivery.fingerprint,
    'secondary',
    'SS 1',
    'French',
    '1st Term',
    `${SS1_FRENCH_WITHDRAWN_FINGERPRINT_PREFIX}${delivery.correctionId}`,
  ]);
  assert(!capturedSql.includes('topic-123'));
  assert(!capturedSql.includes(delivery.text));
});

test('French cache retirement is idempotent when no stale topic or assessment is found', async () => {
  let calls = 0;
  const result = await retireStaleSs1FrenchCache(async () => {
    calls += 1;
    return { rows: [{ retired: '0', closed_assessments: '0' }] };
  }, 'missing-topic', delivery);
  assert.equal(calls, 1);
  assert.deepEqual(result, { retired: false, closedAssessments: 0 });
});

test('French cache retirement propagates database failures instead of reporting success', async () => {
  await assert.rejects(
    () => retireStaleSs1FrenchCache(async () => { throw new Error('database unavailable'); }, 'topic-123', delivery),
    /database unavailable/,
  );
});
