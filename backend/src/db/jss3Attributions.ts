/** Licence/attribution records for JSS3 lessons that reproduce third-party material.
 * Delivered with the lesson (GET /learning/topics/:id/assets → `attributions`) so the learner path shows credit
 * independently of the lesson text. Matched by exact lesson identity; never inferred. Records state what was
 * verified and which requested visuals are NOT yet bound — no visual is ever fabricated.
 */
import { createHash } from 'node:crypto';
import { z } from 'zod';
import data from './data/jss3Attributions.json' with { type: 'json' };

const visual = z.object({
  role: z.enum(['cover', 'logo']), asset_key: z.string().min(3),
  state: z.enum(['unbound', 'bound']), reason: z.string().min(10).optional(),
}).strict().refine(v => v.state === 'bound' || !!v.reason, 'an unbound visual must say why');
const credit = z.object({
  id: z.string().min(3), role: z.string().min(3), work: z.string().min(10), creators: z.string().min(3),
  publisher: z.string().min(3), year: z.number().int(), required_credit: z.string().min(10),
  licence: z.string().min(3), licence_url: z.string().url().startsWith('https://'), source_url: z.string().url().startsWith('https://'),
  source_sha256_recorded: z.string().regex(/^[0-9a-f]{64}$/).optional(), download_line: z.string().optional(),
  changes: z.string().min(10), requested_visuals: z.array(visual),
}).strict();
const record = z.object({
  supplement_id: z.string().regex(/^SUP-[A-Z0-9-]+$/), subjectName: z.string(), termLabel: z.enum(['1st Term', '2nd Term']), title: z.string().min(5),
  body_sha256: z.string().regex(/^[0-9a-f]{64}$/), notice: z.string().min(30), credits: z.array(credit).min(1),
}).strict();
export type Jss3Attribution = z.infer<typeof record>;
export const JSS3_ATTRIBUTIONS: Jss3Attribution[] = z.array(record).parse(data);

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
export const attributionBodyHash = (body: string) => createHash('sha256').update(body).digest('hex');
/** Exact identity only: subject + term + title (whitespace/case-insensitive), JSS 3. */
export function attributionsForTopic(t: { subject_name?: string | null; term_label?: string | null; class_name?: string | null; title?: string | null }): Jss3Attribution[] {
  if (t.class_name !== 'JSS 3') return [];
  return JSS3_ATTRIBUTIONS.filter(a => norm(a.subjectName) === norm(t.subject_name ?? '') && a.termLabel === t.term_label && norm(a.title) === norm(t.title ?? ''));
}
/** Learner-facing form: only fields a reader needs; visuals marked bound only when displayed assets with those keys exist. */
export function publicAttribution(a: Jss3Attribution, boundKeys: ReadonlySet<string>) {
  return {
    supplement_id: a.supplement_id, notice: a.notice,
    credits: a.credits.map(c => ({
      id: c.id, role: c.role, work: c.work, creators: c.creators, publisher: c.publisher, year: c.year,
      required_credit: c.required_credit, licence: c.licence, licence_url: c.licence_url, source_url: c.source_url,
      download_line: c.download_line ?? null, changes: c.changes,
      visuals: c.requested_visuals.map(v => ({ role: v.role, asset_key: v.asset_key, displayed: boundKeys.has(v.asset_key) })),
    })),
  };
}
