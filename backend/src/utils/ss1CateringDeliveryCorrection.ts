import { createHash } from 'node:crypto';
import packageData from '../db/ss1/subjects/catering-craft.json' with { type: 'json' };
import { packageSchema, type SubjectPackage } from '../db/ss1/subjectPackageSchema.js';

export const SS1_CATERING_CORRECTION_MARKER = '[SS1 CATERING CRAFT DELIVERY CORRECTION]';
export const SS1_CATERING_WITHHELD_MARKER = '[SS1 CATERING CRAFT TOPIC WITHHELD]';
export const SS1_CATERING_WITHDRAWN_FINGERPRINT_PREFIX = 'SS1_CC_WITHDRAWN:';
const SCHOOL_CODE = 'secondary';
const CLASS_NAME = 'SS 1';
const SUBJECT_NAME = 'Catering Craft';
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const norm = (value: unknown) => String(value ?? '').replace(/\\s+/g, ' ').trim().toLocaleLowerCase('en');

export interface Ss1DeliveryTopic {
  id?: unknown;
  school_code?: unknown;
  class_name?: unknown;
  subject_name?: unknown;
  term_label?: unknown;
  title?: unknown;
  source_file?: unknown;
  source_reference?: unknown;
  summary?: unknown;
  generated_assessment_id?: unknown;
  [key: string]: unknown;
}
export interface Ss1DeliveryResolution {
  source: 'ss1';
  termLabel: string;
  kind: 'corrected' | 'withheld';
  correctionId: string;
  text: string;
  fingerprint: string;
  sourceHash: string;
  replacementLessonIds: string[];
  reason?: string;
}
export type Ss1Query = (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>;

function renderLesson(lesson: SubjectPackage['lessons'][number]) {
  return [
    lesson.title,
    lesson.body,
    'LEARNING OBJECTIVES',
    ...lesson.objectives.map((objective, index) => `${index + 1}. ${objective}`),
    'PRACTICE QUESTIONS AND MARKING GUIDE',
    ...lesson.practice.map(question =>
      `${question.id}. ${question.question}\nAnswer: ${question.answer}\nMarks: ${question.marks}\n${question.marking.map(mark => `- ${mark.marks} mark(s): ${mark.criterion}`).join('\n')}`,
    ),
    'SOURCES AND ATTRIBUTION',
    ...lesson.provenance.map(source => `${source.title} — ${source.locator}${source.url ? ` — ${source.url}` : ''}\nRights: ${source.rights}\nAttribution: ${source.attribution}`),
  ].join('\n\n');
}

export function createSs1DeliveryResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  if (subjectPackage.subject_slug !== 'catering-craft' || subjectPackage.canonical_subject !== SUBJECT_NAME) {
    throw new Error('SS1 delivery adapter received an unexpected subject package');
  }
  const sources = new Map(subjectPackage.sources.map(source => [source.source_id, source]));
  const lessons = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  const corrections = subjectPackage.delivery_corrections;
  if (new Set(corrections.map(correction => correction.id)).size !== corrections.length) {
    throw new Error('Duplicate SS1 Catering Craft correction ID');
  }

  const built = new Map<string, { text: string; fingerprint: string; replacementLessonIds: string[] }>();
  for (const correction of corrections) {
    const source = sources.get(correction.source_id);
    const lesson = lessons.get(correction.replacement_id);
    if (!source || !lesson || lesson.term !== source.term || correction.source_sha256 !== source.sha256 ||
        correction.body_sha256 !== correction.source_lesson_id.split(':BODY:')[1]) {
      throw new Error(`Invalid SS1 Catering Craft correction binding: ${correction.id}`);
    }
    const text = `${SS1_CATERING_CORRECTION_MARKER} ${correction.id}\nThe original source passage contains an incorrect classification. Study this approved, project-authored correction instead. The original source record remains preserved for audit.\n\n${renderLesson(lesson)}`;
    const fingerprint = hash(JSON.stringify({ id: correction.id, source: correction.body_sha256, lesson }));
    built.set(correction.id, { text, fingerprint, replacementLessonIds: [lesson.id] });
  }

  return (topic: Ss1DeliveryTopic): Ss1DeliveryResolution | null => {
    if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
        norm(topic.subject_name) !== norm(SUBJECT_NAME)) return null;

    for (const correction of corrections) {
      const source = sources.get(correction.source_id)!;
      const lesson = lessons.get(correction.replacement_id)!;
      if (topic.term_label !== source.term || norm(topic.title) !== 'cooking of foods' ||
          topic.source_file !== source.archive_member.split('/').at(-1)) continue;

      const currentHash = hash(typeof topic.source_reference === 'string' ? topic.source_reference : '');
      const replacement = built.get(correction.id)!;
      if (currentHash === correction.body_sha256) {
        return {
          source: 'ss1', termLabel: source.term, kind: 'corrected', correctionId: correction.id,
          text: replacement.text, fingerprint: replacement.fingerprint,
          sourceHash: correction.body_sha256, replacementLessonIds: replacement.replacementLessonIds,
        };
      }
      return {
        source: 'ss1', termLabel: source.term, kind: 'withheld', correctionId: correction.id,
        text: `${SS1_CATERING_WITHHELD_MARKER} ${correction.id}\nThis topic is temporarily unavailable because its stored source does not match the reviewed lesson fingerprint. Ask your teacher while the source is checked.`,
        fingerprint: hash(`withheld:${correction.id}`), sourceHash: correction.body_sha256,
        replacementLessonIds: [], reason: 'Stored source fingerprint differs from the reviewed source lesson',
      };
    }
    return null;
  };
}

const packageValue = packageSchema.parse(packageData);
const defaultResolver = createSs1DeliveryResolver(packageValue);
export const resolveSs1Delivery = (topic: Ss1DeliveryTopic) => defaultResolver(topic);

export function safeSs1Topic<T extends Ss1DeliveryTopic>(topic: T): T {
  const delivery = resolveSs1Delivery(topic);
  if (!delivery) return topic;
  return {
    ...topic,
    source_reference: delivery.kind === 'corrected' ? delivery.text : null,
    summary: delivery.text,
    generated_assessment_id: null,
    delivery_correction: {
      id: delivery.correctionId,
      status: delivery.kind,
      provenance: delivery.kind === 'corrected' ? 'approved project-authored correction' : 'withheld pending source review',
    },
  };
}

/** Retires only linked assessments for the exact SS1 Catering Craft row; learner work is untouched. */
export async function retireStaleSs1Cache(query: Ss1Query, topicId: unknown, delivery: Ss1DeliveryResolution) {
  const fingerprint = delivery.kind === 'corrected' ? delivery.fingerprint : '__withheld__';
  const { rows } = await query(
    `WITH t AS (
       SELECT t.id, t.generated_assessment_id
       FROM topics t JOIN subjects s ON s.id=t.subject_id
       WHERE t.id=$1 AND t.school_code=$4 AND t.class_name=$5
         AND s.name=$6 AND t.term_label=$7
       FOR UPDATE OF t
     ),
     stale AS (
       SELECT a.id FROM assessments a JOIN t ON a.id=t.generated_assessment_id
       WHERE a.school_code=$4 AND a.class_name=$5 AND a.content_fingerprint IS DISTINCT FROM $3
     ),
     closed AS (
       UPDATE assessments a SET status='closed', content_fingerprint=$8
       WHERE a.id IN (SELECT id FROM stale) AND a.school_code=$4 AND a.class_name=$5
         AND (a.status<>'closed' OR a.content_fingerprint IS DISTINCT FROM $8)
       RETURNING a.id
     ),
     upd AS (
       UPDATE topics SET summary=$2,
         generated_assessment_id=CASE WHEN EXISTS (SELECT 1 FROM stale) THEN NULL ELSE generated_assessment_id END
       WHERE id IN (SELECT id FROM t)
         AND (summary IS DISTINCT FROM $2 OR EXISTS (SELECT 1 FROM stale))
       RETURNING id
     )
     SELECT (SELECT count(*) FROM upd) AS retired, (SELECT count(*) FROM closed) AS closed_assessments`,
    [topicId, delivery.text, fingerprint, SCHOOL_CODE, CLASS_NAME, SUBJECT_NAME, delivery.termLabel, `${SS1_CATERING_WITHDRAWN_FINGERPRINT_PREFIX}${delivery.correctionId}`],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0, closedAssessments: Number(rows[0]?.closed_assessments ?? 0) };
}

const LINKED_SQL = `SELECT t.id, t.school_code, t.class_name, t.term_label, t.title, t.source_file,
       t.source_reference, sub.name AS subject_name, a.id AS assessment_id, a.content_fingerprint
  FROM topics t JOIN subjects sub ON sub.id=t.subject_id JOIN assessments a ON a.id=t.generated_assessment_id`;

export async function ss1AssessmentDeliverable(query: Ss1Query, assessmentId: unknown) {
  const { rows: markerRows } = await query('SELECT content_fingerprint FROM assessments WHERE id=$1', [assessmentId]);
  if (String(markerRows[0]?.content_fingerprint ?? '').startsWith(SS1_CATERING_WITHDRAWN_FINGERPRINT_PREFIX)) {
    return { ok: false as const, reason: 'This Catering Craft assessment has been withdrawn because its source lesson was corrected or withheld.' };
  }
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id=$1`, [assessmentId]);
  for (const row of rows) {
    const delivery = resolveSs1Delivery(row);
    if (!delivery) continue;
    if (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint) continue;
    await retireStaleSs1Cache(query, row.id, delivery);
    return { ok: false as const, reason: 'This assessment has been withdrawn because the Catering Craft lesson source was corrected or withheld.' };
  }
  return { ok: true as const };
}

export async function ss1WithdrawnAssessmentIds(query: Ss1Query, assessmentIds: unknown[]) {
  const withdrawn = new Set<unknown>();
  if (!assessmentIds.length) return withdrawn;
  const { rows: markedRows } = await query(
    'SELECT id FROM assessments WHERE id=ANY($1) AND content_fingerprint LIKE $2',
    [assessmentIds, `${SS1_CATERING_WITHDRAWN_FINGERPRINT_PREFIX}%`],
  );
  for (const row of markedRows) withdrawn.add(row.id);
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id = ANY($1)`, [assessmentIds]);
  for (const row of rows) {
    const delivery = resolveSs1Delivery(row);
    if (!delivery || (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint)) continue;
    await retireStaleSs1Cache(query, row.id, delivery);
    withdrawn.add(row.assessment_id);
  }
  return withdrawn;
}
