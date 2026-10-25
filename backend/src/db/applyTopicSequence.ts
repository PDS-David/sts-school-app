// Apply / roll back approved JSS3 supplement placements (Task 05). NEVER run against production without owner action.
//
//   node --import tsx src/db/applyTopicSequence.ts --school-code <code> [--plan file.json] [--dry-run | --apply]
//   node --import tsx src/db/applyTopicSequence.ts --school-code <code> --rollback [--plan-version V] [--dry-run | --apply]
//
// Safety: DRY RUN is the default. Writes only topics.sequence_rank (+ audit rows), never order_index, titles, bodies, assets or
// completions. All checks run before any write; one transaction; second apply is a no-op. Rollback is scoped to one school and
// plan version, restores only ranks this tool wrote, and skips any rank edited since (reported, never overwritten).
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pool } from './pool.js';
import { JSS3_SUPPLEMENTS } from './jss3Supplements.js';
import { supplementReference } from './jss3SupplementReference.js';
import { JSS3_SEQUENCE_PLAN, approvedPlacements, planHash, validateSequencePlan, type SequencePlan } from './jss3SequencePlan.js';

type Q = (text: string, params?: unknown[]) => Promise<{ rows: any[] }>;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const SUP_FILE = /^SUP-[A-Z0-9-]+\.json$/;

export interface PlannedChange { supplement_id: string; topic_id: number; previous_rank: string | null; new_rank: number; noop: boolean }
export interface ApplyResult { dryRun: boolean; planVersion: string; planHash: string; schoolCode: string; changes: PlannedChange[]; written: number }

export async function applySequencePlan(q: Q, plan: SequencePlan, o: { schoolCode: string; apply: boolean; transaction?: boolean }): Promise<ApplyResult> {
  plan = validateSequencePlan(plan);
  if (!plan.school_codes.includes(o.schoolCode)) throw new Error(`School "${o.schoolCode}" is not named in plan.school_codes (D6 not authorised for it)`);
  const approved = approvedPlacements(plan);
  const hash = planHash(plan);
  const byAnchor = new Map<string, PlannedChange[]>();
  const changes: PlannedChange[] = [];
  const staged: Array<{ ch: PlannedChange; key: string }> = [];
  for (const p of approved) {
    const lesson = JSS3_SUPPLEMENTS.find(s => s.id === p.supplement_id)!;
    const { rows } = await q(
      `SELECT t.id, t.title, t.source_reference, t.order_index, t.sequence_rank, t.subject_id, t.term_label FROM topics t
       JOIN subjects s ON s.id=t.subject_id
       WHERE t.school_code=$1 AND t.class_name='JSS 3' AND t.source_file=$2 AND s.name=$3 AND t.term_label=$4`,
      [o.schoolCode, `${lesson.id}.json`, lesson.subjectName, lesson.termLabel]);
    if (rows.length !== 1) throw new Error(`${p.supplement_id}: expected exactly one supplement row in ${o.schoolCode}, found ${rows.length}`);
    const sup = rows[0];
    if (norm(sup.title) !== norm(lesson.title)) throw new Error(`${p.supplement_id}: stored title differs from the plan's lesson`);
    if (sha(sup.source_reference ?? '') !== sha(supplementReference(lesson))) throw new Error(`${p.supplement_id}: stored body differs from the reviewed lesson`);
    const k = p.after_original_order_index!;
    const { rows: bucket } = await q(
      `SELECT id, title, order_index, source_file, sequence_rank FROM topics
       WHERE school_code=$1 AND subject_id=$2 AND class_name='JSS 3' AND term_label=$3 AND order_index IS NOT NULL`,
      [o.schoolCode, sup.subject_id, sup.term_label]);
    const originals = bucket.filter((r: any) => !SUP_FILE.test(r.source_file ?? ''));
    const anchor = originals.find((r: any) => r.order_index === k);
    if (!anchor) throw new Error(`${p.supplement_id}: anchor ${k} is not an original lesson of this bucket`);
    if (anchor.sequence_rank != null) throw new Error(`${p.supplement_id}: anchor ${k} is itself placed`);
    if (norm(anchor.title) !== norm(p.anchor_title!)) throw new Error(`${p.supplement_id}: anchor title mismatch at ${k} (expected "${p.anchor_title}")`);
    if (k < 1 || k > Math.max(...originals.map((r: any) => r.order_index))) throw new Error(`${p.supplement_id}: anchor ${k} out of range`);
    const key = `${sup.subject_id}|${sup.term_label}|${k}`;
    staged.push({ ch: { supplement_id: p.supplement_id, topic_id: sup.id, previous_rank: sup.sequence_rank, new_rank: 0, noop: false }, key });
    (byAnchor.get(key) ?? byAnchor.set(key, []).get(key)!).push(staged[staged.length - 1].ch);
    (staged[staged.length - 1] as any).order = sup.order_index;
  }
  // rank = k + n/1000 where n is the position among approved supplements on that anchor, by current append order
  for (const [key, list] of byAnchor) {
    const k = Number(key.split('|')[2]);
    const order = new Map(staged.filter(s => s.key === key).map(s => [s.ch.topic_id, (s as any).order as number]));
    list.sort((a, b) => order.get(a.topic_id)! - order.get(b.topic_id)!);
    list.forEach((ch, i) => {
      ch.new_rank = Number((k + (i + 1) / 1000).toFixed(6));
      ch.noop = ch.previous_rank != null && Number(ch.previous_rank) === ch.new_rank;
      if (ch.previous_rank != null && !ch.noop) throw new Error(`${ch.supplement_id}: already has a different sequence_rank (${ch.previous_rank}); roll back first`);
      changes.push(ch);
    });
  }
  let written = 0;
  if (o.apply) {
    const tx = o.transaction !== false;
    if (tx) await q('BEGIN');
    try {
      for (const ch of changes.filter(c => !c.noop)) {
        await q('UPDATE topics SET sequence_rank=$1 WHERE id=$2 AND school_code=$3 AND sequence_rank IS NULL', [ch.new_rank, ch.topic_id, o.schoolCode]);
        await q(`INSERT INTO topic_sequence_audit(plan_version, plan_hash, school_code, topic_id, previous_rank, new_rank) VALUES($1,$2,$3,$4,NULL,$5)`,
          [plan.plan_version, hash, o.schoolCode, ch.topic_id, ch.new_rank]);
        written++;
      }
      if (tx) await q('COMMIT');
    } catch (e) { if (tx) await q('ROLLBACK'); throw e; }
  }
  return { dryRun: !o.apply, planVersion: plan.plan_version, planHash: hash, schoolCode: o.schoolCode, changes, written };
}

export interface RollbackResult { dryRun: boolean; restored: number[]; skippedEdited: number[] }
export async function rollbackSequencePlan(q: Q, o: { schoolCode: string; planVersion: string; apply: boolean }): Promise<RollbackResult> {
  const { rows } = await q(
    `SELECT a.id, a.topic_id, a.previous_rank, a.new_rank, t.sequence_rank AS current_rank FROM topic_sequence_audit a
     JOIN topics t ON t.id=a.topic_id
     WHERE a.school_code=$1 AND a.plan_version=$2 AND a.rolled_back_at IS NULL AND t.school_code=$1 ORDER BY a.applied_at`, [o.schoolCode, o.planVersion]);
  const restored: number[] = [], skippedEdited: number[] = [];
  for (const r of rows) (r.current_rank != null && Number(r.current_rank) === Number(r.new_rank) ? restored : skippedEdited).push(r.topic_id);
  if (o.apply) {
    await q('BEGIN');
    try {
      for (const r of rows.filter((x: any) => restored.includes(x.topic_id))) {
        await q('UPDATE topics SET sequence_rank=$1 WHERE id=$2 AND school_code=$3 AND sequence_rank=$4', [r.previous_rank, r.topic_id, o.schoolCode, r.new_rank]);
        await q('UPDATE topic_sequence_audit SET rolled_back_at=now() WHERE id=$1', [r.id]);
      }
      await q('COMMIT');
    } catch (e) { await q('ROLLBACK'); throw e; }
  }
  return { dryRun: !o.apply, restored, skippedEdited };
}

async function main() {
  const a = process.argv.slice(2);
  const val = (f: string) => { const i = a.indexOf(f); return i >= 0 ? a[i + 1] : undefined; };
  const school = val('--school-code');
  if (!school) throw new Error('--school-code is required (no default: D6 must be named by the owner)');
  const apply = a.includes('--apply');
  if (apply && a.includes('--dry-run')) throw new Error('--apply and --dry-run are mutually exclusive');
  const q: Q = (t, p) => pool.query(t, p as any[]);
  if (a.includes('--rollback')) {
    const pv = val('--plan-version') ?? JSS3_SEQUENCE_PLAN.plan_version;
    console.log(JSON.stringify(await rollbackSequencePlan(q, { schoolCode: school, planVersion: pv, apply }), null, 1));
  } else {
    const plan = val('--plan') ? validateSequencePlan(JSON.parse(readFileSync(val('--plan')!, 'utf8'))) : JSS3_SEQUENCE_PLAN;
    const r = await applySequencePlan(q, plan, { schoolCode: school, apply });
    console.log(`${r.dryRun ? 'DRY RUN (nothing written)' : 'APPLIED'} plan ${r.planVersion} hash ${r.planHash} school ${r.schoolCode}`);
    for (const c of r.changes) console.log(`${c.noop ? 'no-op ' : 'set   '} ${c.supplement_id} topic ${c.topic_id} rank ${c.previous_rank ?? 'NULL'} -> ${c.new_rank}`);
    console.log(`${r.changes.length} approved placement(s); ${r.written} written`);
  }
  await pool.end();
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(e => { console.error(e.message); process.exit(1); });
