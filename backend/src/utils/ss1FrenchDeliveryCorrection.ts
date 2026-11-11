import { createHash } from 'node:crypto';
import path from 'node:path';
import packageData from '../db/ss1/subjects/french.json' with { type: 'json' };
import { packageSchema, type SubjectPackage } from '../db/ss1/subjectPackageSchema.js';

export const SS1_FRENCH_CORRECTION_MARKER = '[SS1 FRENCH DELIVERY CORRECTION]';
export const SS1_FRENCH_WITHDRAWN_FINGERPRINT_PREFIX = 'SS1_FR_WITHDRAWN:';
const SCHOOL_CODE = 'secondary';
const CLASS_NAME = 'SS 1';
const SUBJECT_NAME = 'French';
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const norm = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');

export interface Ss1FrenchTopic {
  id?: unknown; school_code?: unknown; class_name?: unknown; subject_name?: unknown;
  term_label?: unknown; title?: unknown; source_file?: unknown; source_reference?: unknown;
  summary?: unknown; generated_assessment_id?: unknown; [key: string]: unknown;
}
export interface Ss1FrenchResolution {
  source: 'ss1-french'; termLabel: string; kind: 'corrected'; correctionId: string;
  text: string; fingerprint: string; sourceHash: string; replacementLessonIds: string[];
}
export type Ss1FrenchQuery = (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>;

function renderLesson(lesson: SubjectPackage['lessons'][number]) {
  return [
    lesson.title, lesson.body, 'LEARNING OBJECTIVES',
    ...lesson.objectives.map((objective, index) => `${index + 1}. ${objective}`),
    'PRACTICE QUESTIONS AND MARKING GUIDE',
    ...lesson.practice.map(question =>
      `${question.id}. ${question.question}\nAnswer: ${question.answer}\nMarks: ${question.marks}\n${question.marking.map(mark => `- ${mark.marks} mark(s): ${mark.criterion}`).join('\n')}`,
    ),
    'SOURCES AND ATTRIBUTION',
    ...lesson.provenance.map(source => `${source.title} — ${source.locator}${source.url ? ` — ${source.url}` : ''}\nRights: ${source.rights}\nAttribution: ${source.attribution}`),
  ].join('\n\n');
}

export function createSs1FrenchDeliveryResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  if (subjectPackage.subject_slug !== 'french' || subjectPackage.canonical_subject !== SUBJECT_NAME ||
      subjectPackage.package_status !== 'IMPLEMENTED' ||
      subjectPackage.lessons.some(l => l.state.content_approval !== 'APPROVED' || !l.state.approval_reference ||
        l.state.implementation !== 'IMPLEMENTED' || l.provenance.some(s => s.reuse_status !== 'PERMITTED')) ||
      subjectPackage.coverage.some(c => c.status === 'PARTIAL' || c.status === 'UNRESOLVED') ||
      subjectPackage.open_items.some(item => item.blocks_delivery)) {
    throw new Error('SS1 French package is not approved for student delivery');
  }
  const sources = new Map(subjectPackage.sources.map(source => [source.source_id, source]));
  const lessons = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  const corrections = subjectPackage.delivery_corrections;
  if (new Set(corrections.map(c => c.id)).size !== corrections.length) throw new Error('Duplicate SS1 French correction ID');
  const built = new Map<string, { text: string; fingerprint: string; replacementLessonIds: string[]; sourceHash: string; term: string; filename: string }>();
  for (const correction of corrections) {
    const source = sources.get(correction.source_id), lesson = lessons.get(correction.replacement_id);
    if (!source || !lesson || lesson.term !== source.term || correction.source_sha256 !== source.sha256 ||
        correction.body_sha256 !== correction.source_lesson_id.split(':BODY:')[1]) {
      throw new Error(`Invalid SS1 French correction binding: ${correction.id}`);
    }
    const text = `${SS1_FRENCH_CORRECTION_MARKER} ${correction.id}\nThis lesson is the approved, project-authored French replacement for the exact source passage. The source remains preserved for audit.\n\n${renderLesson(lesson)}`;
    const fingerprint = hash(JSON.stringify({ id: correction.id, source: correction.body_sha256, lesson }));
    built.set(correction.id, { text, fingerprint, replacementLessonIds: [lesson.id], sourceHash: correction.body_sha256, term: source.term, filename: path.basename(source.archive_member) });
  }
  return (topic: Ss1FrenchTopic): Ss1FrenchResolution | null => {
    if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME || norm(topic.subject_name) !== norm(SUBJECT_NAME)) return null;
    const filename = path.basename(String(topic.source_file ?? ''));
    const sourceHash = hash(typeof topic.source_reference === 'string' ? topic.source_reference : '');
    for (const correction of corrections) {
      const replacement = built.get(correction.id)!;
      if (topic.term_label !== replacement.term || filename !== replacement.filename || sourceHash !== replacement.sourceHash) continue;
      return { source: 'ss1-french', termLabel: replacement.term, kind: 'corrected', correctionId: correction.id,
        text: replacement.text, fingerprint: replacement.fingerprint, sourceHash: replacement.sourceHash,
        replacementLessonIds: replacement.replacementLessonIds };
    }
    return null;
  };
}

const packageValue = packageSchema.parse(packageData);
const defaultResolver = createSs1FrenchDeliveryResolver(packageValue);
export const resolveSs1FrenchDelivery = (topic: Ss1FrenchTopic) => defaultResolver(topic);

/** Replace cached lesson summary and close only the assessment attached to this exact French topic. */
export async function retireStaleSs1FrenchCache(query: Ss1FrenchQuery, topicId: unknown, delivery: Ss1FrenchResolution) {
  const { rows } = await query(
    `WITH t AS (
       SELECT t.id, t.generated_assessment_id FROM topics t JOIN subjects s ON s.id=t.subject_id
       WHERE t.id=$1 AND t.school_code=$4 AND t.class_name=$5 AND s.name=$6 AND t.term_label=$7 FOR UPDATE OF t
     ),
     stale AS (
       SELECT a.id FROM assessments a JOIN t ON a.id=t.generated_assessment_id
       WHERE a.school_code=$4 AND a.class_name=$5 AND a.content_fingerprint IS DISTINCT FROM $3
     ),
     closed AS (
       UPDATE assessments a SET status='closed', content_fingerprint=$8
       WHERE a.id IN (SELECT id FROM stale) AND a.school_code=$4 AND a.class_name=$5
         AND (a.status<>'closed' OR a.content_fingerprint IS DISTINCT FROM $8) RETURNING a.id
     ),
     upd AS (
       UPDATE topics SET summary=$2,
         generated_assessment_id=CASE WHEN EXISTS (SELECT 1 FROM stale) THEN NULL ELSE generated_assessment_id END
       WHERE id IN (SELECT id FROM t) AND (summary IS DISTINCT FROM $2 OR EXISTS (SELECT 1 FROM stale)) RETURNING id
     )
     SELECT (SELECT count(*) FROM upd) AS retired, (SELECT count(*) FROM closed) AS closed_assessments`,
    [topicId, delivery.text, delivery.fingerprint, SCHOOL_CODE, CLASS_NAME, SUBJECT_NAME, delivery.termLabel,
      `${SS1_FRENCH_WITHDRAWN_FINGERPRINT_PREFIX}${delivery.correctionId}`],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0, closedAssessments: Number(rows[0]?.closed_assessments ?? 0) };
}
