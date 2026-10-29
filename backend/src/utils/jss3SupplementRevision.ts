import { createHash } from 'node:crypto';
import lessonsData from '../db/data/jss3Supplements.json' with { type: 'json' };
import revisionsData from '../db/data/jss3YorubaRevisions.json' with { type: 'json' };
import closeoutRevisions from '../db/data/jss3CloseoutRevisions.json' with { type: 'json' };
import { supplementReference, type SupplementReferenceLesson } from '../db/jss3SupplementReference.js';
import type { DeliveryTopic, DeliveryResolution } from './jss3DeliveryCorrection.js';

interface Revision { lessonId: string; versions: { sha256: string; commit: string }[] }
interface Lesson extends SupplementReferenceLesson { id: string; subjectName: string; termLabel: string }
const hash = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const norm = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
export const SUPPLEMENT_UPDATE_MARKER = '[JSS3 SUPPLEMENT UPDATE]';

/** Explicitly reviewed lessons only. History hashes identify approved older references,
 * never arbitrary same-title content. Source rows and pupil history remain immutable. */
export function createSupplementRevisionResolver(revisions: readonly Revision[], lessons: readonly Lesson[]) {
  const byId = new Map(lessons.map(l => [l.id, l]));
  if (byId.size !== lessons.length) throw new Error('Duplicate lesson ID');
  const ids = new Set<string>(); const identities = new Set<string>();
  const prepared = revisions.map(r => {
    if (ids.has(r.lessonId)) throw new Error('Duplicate revision ID'); ids.add(r.lessonId);
    const lesson = byId.get(r.lessonId);
    if (!lesson) throw new Error(`Missing revision lesson ${r.lessonId}`);
    if (!['1st Term', '2nd Term'].includes(lesson.termLabel)) throw new Error('Invalid revision destination');
    const identity = [lesson.subjectName, lesson.termLabel, lesson.title].map(norm).join('|');
    if (identities.has(identity)) throw new Error('Ambiguous revision identity'); identities.add(identity);
    if (!r.versions.length || r.versions.some(v => !/^[0-9a-f]{64}$/.test(v.sha256) || !/^[0-9a-f]{40}$/.test(v.commit))) throw new Error('Invalid reviewed revision history');
    if (new Set(r.versions.map(v => v.sha256)).size !== r.versions.length) throw new Error('Duplicate revision hash');
    const reference = supplementReference(lesson);
    const currentHash = hash(reference);
    return { r, lesson, reference, currentHash, accepted: new Set([currentHash, ...r.versions.map(v => v.sha256)]),
      fingerprint: hash(JSON.stringify({ id: `SUPPLEMENT-REVISION:${r.lessonId}`, lesson })) };
  });
  return (topic: DeliveryTopic): DeliveryResolution | null => {
    if (topic.school_code !== 'secondary' || topic.class_name !== 'JSS 3') return null;
    const p = prepared.find(p => norm(topic.subject_name) === norm(p.lesson.subjectName)
      && norm(topic.term_label) === norm(p.lesson.termLabel) && norm(topic.title) === norm(p.lesson.title));
    if (!p) return null;
    const correctionId = `SUPPLEMENT-REVISION:${p.r.lessonId}`;
    const storedHash = hash(typeof topic.source_reference === 'string' ? topic.source_reference : '');
    if (!p.accepted.has(storedHash)) return { kind: 'withheld', correctionId,
      text: '[JSS3 TOPIC WITHHELD]\nThis lesson is temporarily unavailable while its stored version is reviewed. Please ask your teacher.',
      fingerprint: hash(`withheld:${correctionId}`), reason: 'Unreviewed supplement reference; review required' };
    return { kind: 'corrected', correctionId, text: `${SUPPLEMENT_UPDATE_MARKER}\nStudy the current reviewed lesson below.\n\n${p.reference}`,
      fingerprint: p.fingerprint, sourceHash: p.currentHash, replacementLessonIds: [p.r.lessonId], matchedBy: 'hash' };
  };
}
export const resolveSupplementRevision = createSupplementRevisionResolver([...revisionsData, ...closeoutRevisions], lessonsData);
