import { resolveSupplementRevision } from './jss3SupplementRevision.js';
import { createHash } from 'node:crypto';
import lessonsData from '../db/data/jss3Supplements.json' with { type: 'json' };
import correctionsData from '../db/data/jss3DeliveryCorrections.json' with { type: 'json' };

/**
 * The ONE JSS3 delivery-correction mechanism (reconciles Batch 2 worker A's pure resolver and worker B's
 * route cache code). Immutable audit rows (topics.source_reference as imported, submissions, topic_completions)
 * are never rewritten. A topic whose original text is audited as unsafe/wrong is DELIVERED from the replacement
 * lessons instead, on every student/teacher path: topic list, study summary, fallback, practice questions,
 * standard-assessment generation, assessment listing, direct assessment read and submission.
 *
 * Matching (fails closed, never serves the audited original):
 *   1. SHA-256 of the stored source text equals a correction's current or previous audited hash -> corrected.
 *   2. Otherwise school + class + subject + term + normalised title identify an audited topic whose stored text
 *      has changed -> WITHHELD pending review (no teaching, no AI generation, no assessment).
 *   3. Otherwise no correction (other schools, classes, subjects, terms and topics are untouched).
 * Each assessment generated for a corrected topic stores the correction fingerprint (assessments.content_fingerprint,
 * a hash over the correction id, audited source hash and the full selected lesson objects). An assessment is
 * deliverable only while that fingerprint equals the one resolved now; anything else is closed and unlinked.
 */
export const JSS3_CORRECTION_MARKER = '[JSS3 DELIVERY CORRECTION]';
export const JSS3_WITHHELD_MARKER = '[JSS3 TOPIC WITHHELD]';
const JSS3_SCHOOL_CODE = 'secondary';
const JSS3_CLASS_NAME = 'JSS 3';

export interface DeliveryCorrection {
  id: string; school_code: string; class_name: string; subject_name?: string; term_label?: string;
  source_title: string; source_body_sha256: string; previous_source_body_sha256?: string[]; replacement_lesson_ids: string[];
}
export interface DeliveryLesson { id: string; title: string; body: string; origin: string; sources: { title: string; url: string }[] }
export interface DeliveryTopic {
  school_code?: unknown; class_name?: unknown; subject_name?: unknown; term_label?: unknown; title?: unknown;
  source_reference?: unknown; summary?: unknown; generated_assessment_id?: unknown; [k: string]: unknown;
}
export type DeliveryResolution =
  | { kind: 'corrected'; correctionId: string; text: string; fingerprint: string; sourceHash: string; replacementLessonIds: string[]; matchedBy: 'hash' }
  | { kind: 'withheld'; correctionId: string; text: string; fingerprint: string; reason: string };

export const deliveryHash = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const norm = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

export function createDeliveryResolver(corrections: readonly DeliveryCorrection[], lessons: readonly DeliveryLesson[]) {
  const byId = new Map(lessons.map(l => [l.id, l]));
  if (byId.size !== lessons.length) throw new Error('Duplicate lesson ID');
  const ids = new Set<string>(); const hashes = new Set<string>();
  for (const c of corrections) {
    if (ids.has(c.id)) throw new Error(`Duplicate correction id ${c.id}`);
    ids.add(c.id);
    for (const h of [c.source_body_sha256, ...(c.previous_source_body_sha256 ?? [])]) {
      if (!/^[0-9a-f]{64}$/.test(h)) throw new Error(`Invalid source hash in ${c.id}`);
      if (hashes.has(`${c.school_code}|${c.class_name}|${h}`)) throw new Error(`Competing corrections for one source hash (${c.id})`);
      hashes.add(`${c.school_code}|${c.class_name}|${h}`);
    }
    if (!c.replacement_lesson_ids.length || new Set(c.replacement_lesson_ids).size !== c.replacement_lesson_ids.length) throw new Error(`Empty or duplicate replacement in ${c.id}`);
    for (const id of c.replacement_lesson_ids) if (!byId.has(id)) throw new Error(`Missing replacement ${id} for ${c.id}`);
  }
  const build = (c: DeliveryCorrection) => {
    const selected = c.replacement_lesson_ids.map(id => byId.get(id)!);
    const parts = selected.map(l => `${l.title}\n\n${l.origin}\n\n${l.body}\n\nReferences:\n${l.sources.map(s => `${s.title}: ${s.url}`).join('\n')}`);
    const text = `${JSS3_CORRECTION_MARKER} ${c.id}\nThe original notes for this topic are withdrawn because they contain unsafe or incorrect teaching. Study the corrected/equivalent teaching below.\n\n${parts.join('\n\n---\n\n')}`;
    return { text, fingerprint: deliveryHash(JSON.stringify({ id: c.id, source: c.source_body_sha256, lessons: selected })) };
  };
  return (topic: DeliveryTopic): DeliveryResolution | null => {
    const candidates = corrections.filter(c => c.school_code === topic.school_code && c.class_name === topic.class_name);
    if (!candidates.length) return null;
    const hash = deliveryHash(typeof topic.source_reference === 'string' ? topic.source_reference : '');
    const hit = candidates.find(c => c.source_body_sha256 === hash || (c.previous_source_body_sha256 ?? []).includes(hash));
    if (hit) { const b = build(hit); return { kind: 'corrected', correctionId: hit.id, text: b.text, fingerprint: b.fingerprint, sourceHash: hit.source_body_sha256, replacementLessonIds: [...hit.replacement_lesson_ids], matchedBy: 'hash' }; }
    const known = candidates.find(c => norm(c.source_title) === norm(topic.title)
      && (!c.subject_name || norm(c.subject_name) === norm(topic.subject_name))
      && (!c.term_label || norm(c.term_label) === norm(topic.term_label)));
    if (!known) return null;
    const text = `${JSS3_WITHHELD_MARKER} ${known.id}\nThis topic is temporarily unavailable while its notes are reviewed. Please ask your teacher.`;
    return { kind: 'withheld', correctionId: known.id, text, fingerprint: deliveryHash(`withheld:${known.id}`), reason: 'Corrected source fingerprint mismatch; review required' };
  };
}

const defaultResolver = createDeliveryResolver(correctionsData as unknown as DeliveryCorrection[], lessonsData as unknown as DeliveryLesson[]);
export const resolveDelivery = (topic: DeliveryTopic): DeliveryResolution | null => defaultResolver(topic) ?? resolveSupplementRevision(topic);

/** Student/teacher-facing copy of a topic row: corrected text, never the audited original, no stale cache link. Never mutates the row. */
export function safeJss3Topic<T extends DeliveryTopic>(topic: T, resolve: (t: DeliveryTopic) => DeliveryResolution | null = resolveDelivery): T {
  const r = resolve(topic);
  if (!r) return topic;
  return { ...topic, source_reference: r.kind === 'corrected' ? r.text : null, summary: r.text, generated_assessment_id: null,
    delivery_correction: { id: r.correctionId, status: r.kind, provenance: r.kind === 'corrected' ? 'corrected/equivalent teaching' : 'withheld pending review' } };
}

export type Q = (text: string, params?: unknown[]) => Promise<{ rows: any[] }>;

/**
 * Retire cached output built from the original text, in ONE statement that locks the topic row: the cached
 * summary becomes the delivered text, and a linked assessment whose fingerprint is not the current one is closed
 * and unlinked together with that summary update. Idempotent. Submissions and topic_completions are untouched.
 */
export async function retireStaleJss3Cache(query: Q, topicId: unknown, r: DeliveryResolution): Promise<{ retired: boolean; closedAssessments: number }> {
  // P1 write boundary: every statement below is confined to secondary / JSS 3 rows, so an id from any other class or school
  // locks, closes and rewrites nothing (the whole statement becomes a no-op), regardless of what the caller resolved.
  const { rows } = await query(
    `WITH t AS (SELECT id, generated_assessment_id FROM topics WHERE id=$1 AND school_code=$4 AND class_name=$5 FOR UPDATE),
          stale AS (SELECT a.id FROM assessments a JOIN t ON a.id=t.generated_assessment_id
                     WHERE a.school_code=$4 AND a.class_name=$5 AND a.content_fingerprint IS DISTINCT FROM $3),
          closed AS (UPDATE assessments SET status='closed'
                      WHERE id IN (SELECT id FROM stale) AND status<>'closed' AND school_code=$4 AND class_name=$5 RETURNING id),
          upd AS (UPDATE topics SET summary=$2,
                    generated_assessment_id=CASE WHEN EXISTS (SELECT 1 FROM stale) THEN NULL ELSE generated_assessment_id END
                  WHERE id=$1 AND school_code=$4 AND class_name=$5 AND (summary IS DISTINCT FROM $2 OR EXISTS (SELECT 1 FROM stale)) RETURNING id)
     SELECT (SELECT count(*) FROM upd) AS retired, (SELECT count(*) FROM closed) AS closed_assessments`,
    [topicId, r.text, r.kind === 'corrected' ? r.fingerprint : '__withheld__', JSS3_SCHOOL_CODE, JSS3_CLASS_NAME]);
  return { retired: Number(rows[0]?.retired ?? 0) > 0, closedAssessments: Number(rows[0]?.closed_assessments ?? 0) };
}

const LINKED_SQL = `SELECT t.id, t.school_code, t.class_name, t.term_label, t.title, t.source_reference, sub.name AS subject_name,
       a.id AS assessment_id, a.content_fingerprint
  FROM topics t JOIN subjects sub ON sub.id=t.subject_id JOIN assessments a ON a.id=t.generated_assessment_id`;

/**
 * Is this assessment currently deliverable? Topic-generated assessments are checked against the correction
 * fingerprint resolved NOW, so an assessment built from original text cannot be read or submitted by ID even if
 * its status is still 'open'. Stale ones are retired (closed+unlinked) on first contact. Other assessments pass.
 */
export async function assessmentDeliverable(query: Q, assessmentId: unknown, resolve: (t: DeliveryTopic) => DeliveryResolution | null = resolveDelivery): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id=$1`, [assessmentId]);
  for (const row of rows) {
    const r = resolve(row);
    if (!r) continue;
    if (r.kind === 'corrected' && row.content_fingerprint === r.fingerprint) continue;
    await retireStaleJss3Cache(query, row.id, r);
    return { ok: false, reason: 'This assessment has been withdrawn because the topic notes were corrected.' };
  }
  return { ok: true };
}

/** Subset of the given assessment ids that must not be listed/served (retired as a side effect). */
export async function withdrawnAssessmentIds(query: Q, assessmentIds: unknown[], resolve: (t: DeliveryTopic) => DeliveryResolution | null = resolveDelivery): Promise<Set<unknown>> {
  const out = new Set<unknown>();
  if (!assessmentIds.length) return out;
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id = ANY($1)`, [assessmentIds]);
  for (const row of rows) {
    const r = resolve(row);
    if (!r || (r.kind === 'corrected' && row.content_fingerprint === r.fingerprint)) continue;
    await retireStaleJss3Cache(query, row.id, r);
    out.add(row.assessment_id);
  }
  return out;
}
