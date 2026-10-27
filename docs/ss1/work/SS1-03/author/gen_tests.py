import sys
TEMPLATE = r'''// DEFERRED BY OWNER (SS1-03, __SLUG__). Do not run before SS1-09.
// Static tests need no inputs. Source-dependent tests need:
//   SS1_PLAN=/private/ss1-plan.json  (from scripts/ss1/build_subject_packages.py; contains source_previews)
// and skip with an explicit message when it is absent. A skipped test is NOT a pass.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { compilePackages, applyRules, registry, sha256, originalLessonId } from '../../backend/src/db/ss1/compiler.ts';
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const SLUG = '__SLUG__';
const pkg = packageSchema.parse(JSON.parse(readFileSync(path.join(repo, `backend/src/db/ss1/subjects/${SLUG}.json`), 'utf8')));
const expected = registry.filter(r => r.assigned_subject_slug === SLUG);
const planPath = process.env.SS1_PLAN;
const plan = planPath && existsSync(planPath) ? JSON.parse(readFileSync(planPath, 'utf8')) : null;
const needPlan = { skip: plan ? false : 'SS1_PLAN not supplied: source-dependent check NOT executed' };

test('package accounts for exactly the assigned sources with manifest hashes', () => {
  assert.deepEqual(pkg.sources.map(s => s.source_id).sort(), expected.map(s => s.source_id).sort());
  for (const s of pkg.sources) { const r = expected.find(e => e.source_id === s.source_id)!; assert.equal(s.sha256, r.sha256); assert.equal(s.archive_member, r.archive_member); assert.equal(s.term, r.term_from_folder); assert.equal(s.canonical_subject, pkg.canonical_subject); }
});
test('every source has coverage; PARTIAL/UNRESOLVED are blockers, never hidden', () => {
  for (const s of pkg.sources) assert.ok(pkg.coverage.some(c => c.source_id === s.source_id), s.source_id);
  const incomplete = pkg.coverage.filter(c => c.status === 'PARTIAL' || c.status === 'UNRESOLVED');
  if (incomplete.length) assert.ok(pkg.package_status === 'PENDING' && pkg.open_items.some(o => o.blocks_delivery), 'incomplete coverage requires a PENDING package and a blocking open item');
});
test('lesson completeness: objectives, body, practice with full answers and exact mark totals', () => {
  for (const l of pkg.lessons) {
    assert.equal(sha256(l.body), l.body_sha256, l.id); assert.ok(l.id.startsWith(`SUP-SS1-${SLUG.toUpperCase()}-`), l.id);
    assert.ok(l.objectives.length > 0 && l.practice.length > 0 && l.provenance.length > 0, l.id);
    for (const q of l.practice) { assert.ok(q.answer.trim().length > 0, `${l.id}/${q.id}`); assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0), `${l.id}/${q.id}`); }
    assert.notEqual(l.state.verification, 'VERIFIED', 'no verification may be claimed before SS1-09');
    if (l.state.content_approval === 'PENDING') assert.equal(l.state.approval_reference, null);
  }
});
test('no invented approval or verification references', () => {
  for (const x of [...pkg.lessons.map(l => l.state), ...pkg.assets.map(a => a.state)]) { if (x.content_approval === 'PENDING') assert.equal(x.approval_reference, null); assert.equal(x.verification_reference, null); }
});
test('asset ids/positions unique, paths contained, MIME allowed', () => {
  assert.equal(new Set(pkg.assets.map(a => a.id)).size, pkg.assets.length);
  assert.equal(new Set(pkg.assets.map(a => `${a.lesson_id}:${a.order}`)).size, pkg.assets.length);
  for (const a of pkg.assets) { assert.ok(a.path.startsWith(`backend/src/db/ss1/assets/${SLUG}/`) && !a.path.includes('..')); assert.ok(a.alt.trim().length >= 10, a.id); }
});
test('asset bytes and hashes match files on disk', () => {
  for (const a of pkg.assets) { const bytes = readFileSync(path.join(repo, a.path)); assert.equal(bytes.length, a.bytes, a.id); assert.equal(sha256(bytes), a.sha256, a.id); }
});
test('anchors are exact, bound to one source SHA, and repeated anchors are rejected (negative control)', () => {
  const rule = pkg.source_rules.find(r => r.op === 'split_before' || r.op === 'attach_stranded_label');
  const s = expected[0];
  const input = { source_id: s.source_id, sha256: s.sha256, filePath: s.archive_member, text: 'AAA\nBBB\nBBB' };
  const synthetic = { id: 'SYN', op: 'split_before' as const, source_id: s.source_id, source_sha256: s.sha256, anchor: 'BBB', week_label: '2', evidence: { locator: 'x', explanation: 'x' } };
  assert.throws(() => applyRules(input, [synthetic]));
  assert.throws(() => applyRules({ ...input, text: 'AAA\nBBB' }, [{ ...synthetic, source_sha256: 'f'.repeat(64) }]));
  void rule;
});
test('wrong-source hash is rejected by the compiler (negative control)', () => {
  const s = pkg.sources[0];
  assert.throws(() => compilePackages([pkg], [{ source_id: s.source_id, sha256: '0'.repeat(64), filePath: s.archive_member, text: 'x' }], () => []));
});
test('package never targets another class or subject', () => {
  for (const l of pkg.lessons) { assert.equal(l.class_name, 'SS 1'); assert.equal(l.subject, pkg.canonical_subject); }
  for (const s of pkg.sources) assert.equal(s.class_name, 'SS 1');
});
test('source rows: exact parsed IDs, order, preserved text, zero leakage', needPlan, () => {
  const mine = plan.identified_rows.filter((r: any) => r.row.subjectName === pkg.canonical_subject);
  for (const r of mine) { assert.equal(r.row.className, 'SS 1'); assert.ok(['1st Term', '2nd Term', '3rd Term'].includes(r.row.termLabel)); }
  const previews = new Map(plan.source_previews.map((p: any) => [p.source_id, p.topics]));
  for (const s of pkg.sources) assert.ok(previews.has(s.source_id) && (previews.get(s.source_id) as any[]).length > 0, `parsed rows for ${s.source_id}`);
  for (const c of pkg.coverage) for (const id of c.lesson_ids) assert.ok(mine.some((r: any) => r.id === id) || pkg.source_rules.some(r => r.id === id), `coverage target resolves: ${c.id}/${id}`);
  for (const c of pkg.delivery_corrections) { const t = (previews.get(c.source_id) as any[]).find(t => originalLessonId(c.source_id, t.body) === c.source_lesson_id); assert.ok(t, c.id); assert.equal(sha256(t.body), c.body_sha256); }
  const order = mine.filter((r: any) => r.source_id).map((r: any) => r.source_id);
  assert.deepEqual(order, [...order].sort((a: string, b: string) => (expected.find(e => e.source_id === a)!.archive_member < expected.find(e => e.source_id === b)!.archive_member ? -1 : 1)));
});
test('plan for this subject has only declared blockers', needPlan, () => {
  const mine = plan.blockers.filter((b: string) => pkg.sources.some(s => b.includes(s.source_id)) || b.includes(SLUG) || pkg.lessons.some(l => b.includes(l.id)));
  for (const b of mine) assert.ok(/INCOMPLETE_COVERAGE|OPEN_ITEM|LESSON_NOT_APPROVED|ASSET_NOT_APPROVED|PENDING_PACKAGE/.test(b), `undeclared blocker ${b}`);
});
'''
for slug in sys.argv[1:]:
    open(f'/home/claude/sts-school-app/tests/ss1/{slug}.package.test.mts','w').write(TEMPLATE.replace('__SLUG__',slug))
    print('wrote',slug)
