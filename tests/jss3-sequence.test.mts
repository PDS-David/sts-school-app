// Task 05 — resolver properties and plan-validator rules (pure; the route/database behaviour is in jss3-sequence.db.test.mts).
import assert from 'node:assert/strict';
import test from 'node:test';
import { orderSequenceGroup, resolveSequenceGroup, type SeqTopic } from '../backend/src/utils/jss3Sequence.js';
import { approvedPlacements, planHash, validateSequencePlan } from '../backend/src/db/jss3SequencePlan.js';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';
import { JSS3_SEQUENCE_PLAN } from '../backend/src/db/jss3SequencePlan.js';

// Bucket: n originals (order_index 1..n), then supplements n+1.. ; placed[i] = anchor k (rank k + j/1000) or null (unplaced).
function bucket(n: number, placed: Array<number | null>): SeqTopic[] {
  const perAnchor = new Map<number, number>();
  const t: SeqTopic[] = Array.from({ length: n }, (_, i) => ({ id: i + 1, order_index: i + 1, sequence_rank: null }));
  placed.forEach((k, i) => {
    let rank: number | null = null;
    if (k != null) { const j = (perAnchor.get(k) ?? 0) + 1; perAnchor.set(k, j); rank = k + j / 1000; }
    t.push({ id: n + i + 1, order_index: n + i + 1, sequence_rank: rank });
  });
  return t;
}
const legacy = (g: SeqTopic[], passed: Set<number>, pinOk: boolean) => {
  const s = [...g].sort((a, b) => a.order_index! - b.order_index!);
  return new Map(s.map((t, i) => [t.id, i === 0 ? pinOk : passed.has(s[i - 1].id)]));
};
function* subsets(ids: number[]) { for (let m = 0; m < (1 << ids.length); m++) yield new Set(ids.filter((_, i) => m & (1 << i))); }

const SHAPES: Array<[number, Array<number | null>]> = [
  [1, []], [1, [1]], [2, [1, 2]], [3, [1, 1, null]], [3, [2, 2, null]], [4, [null, null]], [4, [2, null, 3, 1]], [2, [2, 2, 2]], [5, [3, 5]],
];

test('no ranks stored: resolver equals the legacy rule for every student state (including unreachable ones)', () => {
  for (const [n, placed] of SHAPES) {
    const g = bucket(n, placed.map(() => null));
    for (const pinOk of [true, false]) for (const passed of subsets(g.map(t => t.id))) {
      const r = resolveSequenceGroup(g, passed, pinOk), l = legacy(g, passed, pinOk);
      for (const t of g) assert.equal(!r.get(t.id)!.locked, l.get(t.id), `n=${n} pin=${pinOk} passed=${[...passed]} topic=${t.id}`);
    }
  }
});
test('placed: no passed or legacy-open topic is ever re-locked; originals chain unchanged; first stays first', () => {
  let checked = 0;
  for (const [n, placed] of SHAPES) {
    const g = bucket(n, placed);
    const originals = g.filter(t => t.id <= n);
    for (const pinOk of [true, false]) for (const passed of subsets(g.map(t => t.id))) {
      const r = resolveSequenceGroup(g, passed, pinOk), l = legacy(g, passed, pinOk);
      for (const t of g) { if (l.get(t.id)) assert.equal(r.get(t.id)!.locked, false, `re-lock: n=${n} placed=${placed} pin=${pinOk} passed=${[...passed]} t=${t.id}`); checked++; }
      originals.forEach((o, i) => { // non-gating: original k+1 opens iff original k passed (PIN for the first), or legacy-open
        const chainOpen = i === 0 ? pinOk : passed.has(originals[i - 1].id);
        if (chainOpen) assert.equal(r.get(o.id)!.locked, false);
        if (!chainOpen && !l.get(o.id)) assert.equal(r.get(o.id)!.locked, true, `original ${o.id} opened without cause`);
      });
    }
    const order = orderSequenceGroup(g);
    assert.equal(order[0].id, 1, 'original #1 first');
    assert.deepEqual(order.filter(t => t.id <= n).map(t => t.id), originals.map(t => t.id), 'originals keep relative order');
    const r = resolveSequenceGroup(g, new Set(), true);
    assert.deepEqual([...r.values()].filter(v => v.is_sequence_first).length, 1);
    assert.deepEqual(order.map(t => r.get(t.id)!.sequence_position), order.map((_, i) => i + 1));
  }
  assert.ok(checked > 8000, `property cases checked: ${checked}`);
});
test('policy cases: returning A (passed O1,O2), fresh with PIN, display order', () => {
  const g = bucket(4, [2, 2, null]); // O1 O2 S1 S2 O3 O4 S3
  assert.deepEqual(orderSequenceGroup(g).map(t => t.id), [1, 2, 5, 6, 3, 4, 7]);
  const A = resolveSequenceGroup(g, new Set([1, 2]), true);
  for (const id of [3, 5, 6]) assert.equal(A.get(id)!.locked, false, `topic ${id} open`); // frontier O3 NOT re-locked; S1,S2 open at once
  assert.equal(A.get(4)!.locked, true);
  assert.equal(A.get(7)!.locked, true);
  const fresh = resolveSequenceGroup(g, new Set(), true);
  assert.deepEqual([...fresh].filter(([, v]) => !v.locked).map(([id]) => id), [1]);
  const noPin = resolveSequenceGroup(g, new Set(), false);
  assert.equal([...noPin.values()].every(v => v.locked), true);
  const C = resolveSequenceGroup(g, new Set([1, 2, 3, 4, 5]), true);
  assert.equal(C.get(7)!.locked, false, 'unplaced supplement opens after last original (never later than today)');
});
test('plan validator: unknown id, duplicate, missing approval fields, anchor < 1, pending with anchor are all rejected', () => {
  const id = JSS3_SUPPLEMENTS[0].id, id2 = JSS3_SUPPLEMENTS[1].id;
  const ok = { plan_version: 'T-v1', policy: 'test policy text', school_codes: ['x'],
    placements: [{ supplement_id: id, status: 'APPROVED', after_original_order_index: 2, anchor_title: 'A', approver: 'Teacher T', approved_on: '2026-10-26', basis: 'teacher confirmed order' }] };
  assert.doesNotThrow(() => validateSequencePlan(ok));
  const bad = (p: any) => assert.throws(() => validateSequencePlan({ ...ok, placements: p }));
  bad([{ ...ok.placements[0], supplement_id: 'SUP-NOT-A-LESSON' }]);
  bad([ok.placements[0], ok.placements[0]]);
  bad([{ ...ok.placements[0], approver: undefined }]);
  bad([{ ...ok.placements[0], approved_on: '26/10/2026' }]);
  bad([{ ...ok.placements[0], after_original_order_index: 0 }]);
  bad([{ supplement_id: id2, status: 'PENDING', after_original_order_index: 1 }]);
  assert.equal(approvedPlacements(validateSequencePlan({ ...ok, placements: [...ok.placements, { supplement_id: id2, status: 'PENDING' }] })).length, 1);
  assert.notEqual(planHash(validateSequencePlan(ok)), planHash(validateSequencePlan({ ...ok, school_codes: ['y'] })));
});
test('shipped plan is empty and names no school: nothing can be applied until the owner supplies D6 and the response file', () => {
  assert.deepEqual(JSS3_SEQUENCE_PLAN.school_codes, []);
  assert.equal(approvedPlacements(JSS3_SEQUENCE_PLAN).length, 0);
});
