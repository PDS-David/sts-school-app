/** Stable-ID placement plan for JSS3 supplements (Task 05). Only APPROVED rows are ever written.
 *  An empty `school_codes` (D6 not yet named by the owner) makes every apply refuse. */
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { JSS3_SUPPLEMENTS } from './jss3Supplements.js';
import planData from './data/jss3SequencePlan.json' with { type: 'json' };

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const placementSchema = z.object({
  supplement_id: z.string().regex(/^SUP-[A-Z0-9-]+$/),
  status: z.enum(['APPROVED', 'KEEP_AT_END', 'PENDING']),
  after_original_order_index: z.number().int().min(1).optional(), // D3: >= 1, so original #1 stays first
  anchor_title: z.string().min(1).optional(),                     // guard against a shifted order_index
  approver: z.string().min(2).optional(),
  approved_on: isoDate.optional(),
  basis: z.string().min(10).optional(),
}).strict();
const planSchema = z.object({
  plan_version: z.string().regex(/^[A-Za-z0-9._-]+$/),
  policy: z.string().min(10),
  school_codes: z.array(z.string().min(1)),
  placements: z.array(placementSchema),
}).strict();
export type SequencePlan = z.infer<typeof planSchema>;
export type Placement = z.infer<typeof placementSchema>;

export function validateSequencePlan(input: unknown): SequencePlan {
  const plan = planSchema.parse(input);
  const seen = new Set<string>();
  for (const p of plan.placements) {
    const lesson = JSS3_SUPPLEMENTS.find(s => s.id === p.supplement_id);
    if (!lesson) throw new Error(`Unknown supplement id: ${p.supplement_id}`);
    if (seen.has(p.supplement_id)) throw new Error(`Duplicate placement: ${p.supplement_id}`);
    seen.add(p.supplement_id);
    if (p.status === 'APPROVED') {
      for (const f of ['after_original_order_index', 'anchor_title', 'approver', 'approved_on', 'basis'] as const) {
        if (p[f] == null) throw new Error(`APPROVED placement ${p.supplement_id} missing ${f}`);
      }
    } else {
      // Pending/end-of-term entries may explain their disposition in `basis`,
      // but must not retain fields that represent an approved placement.
      for (const field of ['after_original_order_index', 'anchor_title', 'approver', 'approved_on'] as const) {
        if (p[field] != null) {
          throw new Error(`${p.status} placement ${p.supplement_id} must not carry ${field}`);
        }
      }
    }
  }
  return plan;
}
export const approvedPlacements = (plan: SequencePlan) => plan.placements.filter(p => p.status === 'APPROVED');
export const planHash = (plan: SequencePlan): string =>
  createHash('sha256').update(JSON.stringify({ v: plan.plan_version, s: [...plan.school_codes].sort(),
    p: approvedPlacements(plan).map(p => [p.supplement_id, p.after_original_order_index, p.anchor_title, p.approver, p.approved_on]).sort() })).digest('hex');
export const JSS3_SEQUENCE_PLAN: SequencePlan = validateSequencePlan(planData);
