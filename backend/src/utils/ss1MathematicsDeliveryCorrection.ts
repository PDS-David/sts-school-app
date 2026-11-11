import { createHash } from 'node:crypto';
import path from 'node:path';
import packageData from '../db/ss1/subjects/mathematics.json' with { type: 'json' };
import { packageSchema, type SubjectPackage } from '../db/ss1/subjectPackageSchema.js';

export const SS1_MATHEMATICS_CORRECTION_MARKER = '[SS1 MATHEMATICS DELIVERY CORRECTION]';
export const SS1_MATHEMATICS_WITHHELD_MARKER = '[SS1 MATHEMATICS TOPIC WITHHELD]';
export const SS1_MATHEMATICS_WITHDRAWN_FINGERPRINT_PREFIX = 'SS1_MATH_WITHDRAWN:';
const SCHOOL_CODE = 'secondary';
const CLASS_NAME = 'SS 1';
const SUBJECT_NAME = 'Mathematics';
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const norm = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');

export interface Ss1MathematicsTopic {
  id?: unknown; school_code?: unknown; class_name?: unknown; subject_name?: unknown;
  term_label?: unknown; title?: unknown; source_file?: unknown; source_reference?: unknown;
  summary?: unknown; generated_assessment_id?: unknown; [key: string]: unknown;
}
export interface Ss1MathematicsResolution {
  source: 'ss1-mathematics'; termLabel: string; kind: 'corrected' | 'withheld';
  correctionId: string; text: string; fingerprint: string; sourceHash: string;
  replacementLessonIds: string[]; reason?: string;
}
export type Ss1MathematicsQuery = (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>;

function renderStudentLesson(lesson: SubjectPackage['lessons'][number]) {
  return [
    lesson.title, lesson.body, 'LEARNING OBJECTIVES',
    ...lesson.objectives.map((objective, index) => `${index + 1}. ${objective}`),
    'PRACTICE QUESTIONS AND ANSWER GUIDE',
    ...lesson.practice.map(question =>
      `${question.id}. ${question.question}\nAnswer: ${question.answer}\nMarks: ${question.marks}\n${question.marking.map(mark => `- ${mark.marks} mark(s): ${mark.criterion}`).join('\n')}`,
    ),
    'SOURCES AND ATTRIBUTION',
    ...lesson.provenance.map(source => `${source.title} — ${source.locator}${source.url ? ` — ${source.url}` : ''}\nRights: ${source.rights}\nAttribution: ${source.attribution}`),
  ].join('\n\n');
}

function scopedBlockers(pkg: SubjectPackage, correction: SubjectPackage['delivery_corrections'][number]) {
  const ids = new Set([correction.id, correction.source_lesson_id, correction.replacement_id]);
  return pkg.open_items.filter(item => item.blocks_delivery && item.affected_ids.some(id => ids.has(id)));
}

function lessonGate(pkg: SubjectPackage, correction: SubjectPackage['delivery_corrections'][number], lesson: SubjectPackage['lessons'][number]) {
  const blockers = scopedBlockers(pkg, correction);
  if (blockers.length) return `This Mathematics topic is awaiting resolution of: ${blockers.map(item => item.id).join(', ')}.`;
  if (lesson.state.implementation !== 'IMPLEMENTED') return 'The Mathematics replacement lesson has not completed implementation.';
  if (lesson.state.content_approval !== 'APPROVED' || !lesson.state.approval_reference) return 'The Mathematics replacement lesson is awaiting owner/content approval.';
  if (lesson.state.verification !== 'VERIFIED' || !lesson.state.verification_reference) return 'The Mathematics replacement lesson has not completed its recorded verification.';
  if (lesson.provenance.some(source => source.reuse_status !== 'PERMITTED')) return 'The Mathematics replacement lesson has unresolved source-rights permission.';
  return null;
}

export function createSs1MathematicsDeliveryResolver(input: SubjectPackage) {
  const pkg = packageSchema.parse(input);
  if (pkg.subject_slug !== 'mathematics' || pkg.canonical_subject !== SUBJECT_NAME) {
    throw new Error('Mathematics delivery adapter received an unexpected subject package');
  }
  const sources = new Map(pkg.sources.map(source => [source.source_id, source]));
  const lessons = new Map(pkg.lessons.map(lesson => [lesson.id, lesson]));
  const corrections = pkg.delivery_corrections;
  if (new Set(corrections.map(item => item.id)).size !== corrections.length) throw new Error('Duplicate SS1 Mathematics correction ID');

  const built = new Map<string, { text: string; fingerprint: string; lesson: SubjectPackage['lessons'][number] }>();
  for (const correction of corrections) {
    const source = sources.get(correction.source_id);
    const lesson = lessons.get(correction.replacement_id);
    if (!source || !lesson || lesson.term !== source.term || correction.source_sha256 !== source.sha256 ||
        correction.source_lesson_id !== `${correction.source_id}:BODY:${correction.body_sha256}`) {
      throw new Error(`Invalid SS1 Mathematics correction binding: ${correction.id}`);
    }
    const text = `${SS1_MATHEMATICS_CORRECTION_MARKER} ${correction.id}\nThe original source row is preserved for audit. This authored replacement is shown only after its scoped approval, verification and source checks pass.\n\n${renderStudentLesson(lesson)}`;
    const fingerprint = hash(JSON.stringify({
      id: correction.id, source: correction.body_sha256, lesson,
      blockers: scopedBlockers(pkg, correction).map(item => item.id).sort(),
    }));
    built.set(correction.id, { text, fingerprint, lesson });
  }

  return (topic: Ss1MathematicsTopic): Ss1MathematicsResolution | null => {
    if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
        norm(topic.subject_name) !== norm(SUBJECT_NAME)) return null;
    const sourceFile = path.basename(String(topic.source_file ?? ''));
    if (!sourceFile || typeof topic.term_label !== 'string') return null;

    for (const correction of corrections) {
      const source = sources.get(correction.source_id)!;
      if (topic.term_label !== source.term || sourceFile !== path.basename(source.archive_member)) continue;
      const replacement = built.get(correction.id)!;
      const currentHash = hash(typeof topic.source_reference === 'string' ? topic.source_reference : '');
      if (currentHash !== correction.body_sha256) {
        return {
          source: 'ss1-mathematics', termLabel: source.term, kind: 'withheld',
          correctionId: correction.id,
          text: `${SS1_MATHEMATICS_WITHHELD_MARKER} ${correction.id}\nThe stored Mathematics source row does not match the reviewed source fingerprint. It is temporarily unavailable while the source is checked.`,
          fingerprint: hash(`withheld:source-mismatch:${correction.id}`),
          sourceHash: correction.body_sha256, replacementLessonIds: [],
          reason: 'Stored source fingerprint differs from the reviewed Mathematics source lesson',
        };
      }
      const gate = lessonGate(pkg, correction, replacement.lesson);
      if (gate) {
        return {
          source: 'ss1-mathematics', termLabel: source.term, kind: 'withheld',
          correctionId: correction.id,
          text: `${SS1_MATHEMATICS_WITHHELD_MARKER} ${correction.id}\n${gate} The original source row is not shown until the replacement passes review.`,
          fingerprint: hash(`withheld:approval-gate:${correction.id}:${gate}`),
          sourceHash: correction.body_sha256, replacementLessonIds: [], reason: gate,
        };
      }
      return {
        source: 'ss1-mathematics', termLabel: source.term, kind: 'corrected',
        correctionId: correction.id, text: replacement.text, fingerprint: replacement.fingerprint,
        sourceHash: correction.body_sha256, replacementLessonIds: [replacement.lesson.id],
      };
    }
    return null;
  };
}

const packageValue = packageSchema.parse(packageData);
const defaultResolver = createSs1MathematicsDeliveryResolver(packageValue);
export const resolveSs1MathematicsDelivery = (topic: Ss1MathematicsTopic) => defaultResolver(topic);

/** Retire cached Brainee summaries/assessments when an exact Mathematics source row is replaced or withheld. */
export async function retireStaleSs1MathematicsCache(query: Ss1MathematicsQuery, topicId: unknown, delivery: Ss1MathematicsResolution) {
  const tombstone = `${SS1_MATHEMATICS_WITHDRAWN_FINGERPRINT_PREFIX}${delivery.correctionId}`;
  const { rows } = await query(
    `WITH target AS MATERIALIZED (
       SELECT t.id, t.generated_assessment_id FROM topics t JOIN subjects s ON s.id=t.subject_id
       WHERE t.id=$1 AND t.school_code=$4 AND t.class_name=$5 AND s.name=$6 AND t.term_label=$7
       FOR UPDATE OF t
     ),
     stale AS MATERIALIZED (
       SELECT a.id FROM assessments a JOIN target ON a.id=target.generated_assessment_id
       WHERE a.content_fingerprint IS DISTINCT FROM $3
     ),
     closed AS (
       UPDATE assessments a SET status='closed', content_fingerprint=$8
       FROM stale WHERE a.id=stale.id AND a.school_code=$4 AND a.class_name=$5 RETURNING a.id
     ),
     updated AS (
       UPDATE topics t SET summary=$2,
         generated_assessment_id=CASE WHEN EXISTS (SELECT 1 FROM stale) THEN NULL ELSE t.generated_assessment_id END
       FROM target WHERE t.id=target.id
       RETURNING t.id
     )
     SELECT (SELECT count(*) FROM updated) AS retired, (SELECT count(*) FROM closed) AS closed_assessments`,
    [topicId, delivery.text, delivery.fingerprint, SCHOOL_CODE, CLASS_NAME, SUBJECT_NAME, delivery.termLabel, tombstone],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0, closedAssessments: Number(rows[0]?.closed_assessments ?? 0) > 0 };
}
