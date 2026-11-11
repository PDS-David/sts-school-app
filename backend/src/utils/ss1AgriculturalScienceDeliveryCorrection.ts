import { createHash } from 'node:crypto';
import packageData from '../db/ss1/subjects/agricultural-science.json' with { type: 'json' };
import { packageSchema, type SubjectPackage } from '../db/ss1/subjectPackageSchema.js';

export const SS1_AGRICULTURAL_SCIENCE_CORRECTION_MARKER = '[SS1 AGRICULTURAL SCIENCE DELIVERY CORRECTION]';
export const SS1_AGRICULTURAL_SCIENCE_WITHHELD_MARKER = '[SS1 AGRICULTURAL SCIENCE TOPIC WITHHELD]';
export const SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX = 'SS1_AG_WITHDRAWN:';

const SCHOOL_CODE = 'secondary';
const CLASS_NAME = 'SS 1';
const SUBJECT_NAME = 'Agricultural Science';
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const norm = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');

// The source row title is part of the delivery identity. The body hash is still
// authoritative; the title prevents a correction from matching another week
// in the same term/source document before the body fingerprint is checked.
const SOURCE_TITLES: Record<string, string> = {
  'CORR-AG-T3-W02-POWER-WATER-REPLACEMENT': 'FARM POWER',
  'CORR-AG-T3-W09-PIG-SAFE-REPLACEMENT': 'LIVESTOCK MANAGEMENT',
  'CORR-AG-T3-W10-CATTLE-SAFE-REPLACEMENT': 'LIVESTOCK MANAGEMENT II',
};

export interface AgriculturalScienceDeliveryTopic {
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

export interface AgriculturalScienceDeliveryResolution {
  source: 'ss1-agricultural-science';
  termLabel: string;
  kind: 'corrected' | 'withheld';
  correctionId: string;
  text: string;
  fingerprint: string;
  sourceHash: string;
  replacementLessonIds: string[];
  reason?: string;
}

export type AgriculturalScienceQuery = (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>;

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

function approvalGate(pkg: SubjectPackage, lesson: SubjectPackage['lessons'][number]) {
  if (pkg.package_status !== 'IMPLEMENTED') return 'The Agricultural Science package is not yet approved for delivery.';
  if (pkg.open_items.some(item => item.blocks_delivery)) return 'Agricultural Science still has blocking review items.';
  if (lesson.state.content_approval !== 'APPROVED' || !lesson.state.approval_reference) {
    return 'The replacement lesson is awaiting genuine subject-content approval.';
  }
  if (lesson.state.verification !== 'VERIFIED' || !lesson.state.verification_reference) {
    return 'The replacement lesson has not completed its authorised verification.';
  }
  if (lesson.provenance.some(source => source.reuse_status !== 'PERMITTED')) {
    return 'The replacement lesson still has unresolved source-rights permission.';
  }
  return null;
}

export function createAgriculturalScienceDeliveryResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  if (subjectPackage.subject_slug !== 'agricultural-science' || subjectPackage.canonical_subject !== SUBJECT_NAME) {
    throw new Error('Agricultural Science delivery adapter received an unexpected subject package');
  }

  const sources = new Map(subjectPackage.sources.map(source => [source.source_id, source]));
  const lessons = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  const corrections = subjectPackage.delivery_corrections;
  if (new Set(corrections.map(correction => correction.id)).size !== corrections.length) {
    throw new Error('Duplicate Agricultural Science correction ID');
  }

  const built = new Map<string, { text: string; fingerprint: string; replacementLessonIds: string[] }>();
  for (const correction of corrections) {
    const source = sources.get(correction.source_id);
    const lesson = lessons.get(correction.replacement_id);
    const expectedTitle = SOURCE_TITLES[correction.id];
    if (!source || !lesson || !expectedTitle || lesson.term !== source.term ||
        correction.source_sha256 !== source.sha256 ||
        correction.source_lesson_id !== `${correction.source_id}:BODY:${correction.body_sha256}`) {
      throw new Error(`Invalid Agricultural Science correction binding: ${correction.id}`);
    }
    const text = `${SS1_AGRICULTURAL_SCIENCE_CORRECTION_MARKER} ${correction.id}\nThe original source row is preserved for audit. This authored replacement is subject to the subject's approval and verification gate.\n\n${renderLesson(lesson)}`;
    const fingerprint = hash(JSON.stringify({
      id: correction.id,
      source: correction.body_sha256,
      lesson,
      packageStatus: subjectPackage.package_status,
      blockingItems: subjectPackage.open_items.filter(item => item.blocks_delivery).map(item => item.id).sort(),
    }));
    built.set(correction.id, { text, fingerprint, replacementLessonIds: [lesson.id] });
  }

  return (topic: AgriculturalScienceDeliveryTopic): AgriculturalScienceDeliveryResolution | null => {
    if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
        norm(topic.subject_name) !== norm(SUBJECT_NAME)) return null;

    for (const correction of corrections) {
      const source = sources.get(correction.source_id)!;
      const lesson = lessons.get(correction.replacement_id)!;
      const expectedTitle = SOURCE_TITLES[correction.id];
      const sourceFile = String(topic.source_file ?? '').split(/[\\/]/).pop();
      if (topic.term_label !== source.term || norm(topic.title) !== norm(expectedTitle) ||
          sourceFile !== source.archive_member.split('/').at(-1)) continue;

      const currentHash = hash(typeof topic.source_reference === 'string' ? topic.source_reference : '');
      const replacement = built.get(correction.id)!;
      if (currentHash !== correction.body_sha256) {
        return {
          source: 'ss1-agricultural-science', termLabel: source.term, kind: 'withheld',
          correctionId: correction.id,
          text: `${SS1_AGRICULTURAL_SCIENCE_WITHHELD_MARKER} ${correction.id}\nThis stored Agricultural Science source row does not match the reviewed source fingerprint. It is temporarily unavailable while the source is checked.`,
          fingerprint: hash(`withheld:source-mismatch:${correction.id}`),
          sourceHash: correction.body_sha256, replacementLessonIds: [],
          reason: 'Stored source fingerprint differs from the reviewed source lesson',
        };
      }

      const gate = approvalGate(subjectPackage, lesson);
      if (gate) {
        return {
          source: 'ss1-agricultural-science', termLabel: source.term, kind: 'withheld',
          correctionId: correction.id,
          text: `${SS1_AGRICULTURAL_SCIENCE_WITHHELD_MARKER} ${correction.id}\n${gate} The original source row is not shown until the replacement is approved and verified.`,
          fingerprint: hash(`withheld:approval-gate:${correction.id}:${gate}`),
          sourceHash: correction.body_sha256, replacementLessonIds: [],
          reason: gate,
        };
      }

      return {
        source: 'ss1-agricultural-science', termLabel: source.term, kind: 'corrected',
        correctionId: correction.id, text: replacement.text, fingerprint: replacement.fingerprint,
        sourceHash: correction.body_sha256, replacementLessonIds: replacement.replacementLessonIds,
      };
    }
    return null;
  };
}

const packageValue = packageSchema.parse(packageData);
const defaultResolver = createAgriculturalScienceDeliveryResolver(packageValue);
export const resolveAgriculturalScienceDelivery = (topic: AgriculturalScienceDeliveryTopic) => defaultResolver(topic);

export function safeAgriculturalScienceTopic<T extends AgriculturalScienceDeliveryTopic>(topic: T): T {
  const delivery = resolveAgriculturalScienceDelivery(topic);
  if (!delivery) return topic;
  return {
    ...topic,
    source_reference: delivery.kind === 'corrected' ? delivery.text : null,
    summary: delivery.text,
    generated_assessment_id: null,
    delivery_correction: {
      id: delivery.correctionId,
      status: delivery.kind,
      provenance: delivery.kind === 'corrected' ? 'approved project-authored correction' : 'withheld pending subject approval/verification',
      reason: delivery.reason,
    },
  };
}

/** Retires only linked assessments for the exact SS1 Agricultural Science row; learner work is untouched. */
export async function retireStaleAgriculturalScienceCache(
  query: AgriculturalScienceQuery,
  topicId: unknown,
  delivery: AgriculturalScienceDeliveryResolution,
) {
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
    [topicId, delivery.text, fingerprint, SCHOOL_CODE, CLASS_NAME, SUBJECT_NAME, delivery.termLabel,
      `${SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX}${delivery.correctionId}`],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0, closedAssessments: Number(rows[0]?.closed_assessments ?? 0) };
}

const LINKED_SQL = `SELECT t.id, t.school_code, t.class_name, t.term_label, t.title, t.source_file,
       t.source_reference, sub.name AS subject_name, a.id AS assessment_id, a.content_fingerprint
  FROM topics t JOIN subjects sub ON sub.id=t.subject_id JOIN assessments a ON a.id=t.generated_assessment_id`;

export async function agriculturalScienceAssessmentDeliverable(query: AgriculturalScienceQuery, assessmentId: unknown) {
  const { rows: markerRows } = await query('SELECT content_fingerprint FROM assessments WHERE id=$1', [assessmentId]);
  if (String(markerRows[0]?.content_fingerprint ?? '').startsWith(SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX)) {
    return { ok: false as const, reason: 'This Agricultural Science assessment has been withdrawn pending source correction approval and verification.' };
  }
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id=$1`, [assessmentId]);
  for (const row of rows) {
    const delivery = resolveAgriculturalScienceDelivery(row);
    if (!delivery) continue;
    if (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint) continue;
    await retireStaleAgriculturalScienceCache(query, row.id, delivery);
    return { ok: false as const, reason: 'This assessment has been withdrawn because the Agricultural Science source lesson was corrected or withheld.' };
  }
  return { ok: true as const };
}

export async function agriculturalScienceWithdrawnAssessmentIds(query: AgriculturalScienceQuery, assessmentIds: unknown[]) {
  const withdrawn = new Set<unknown>();
  if (!assessmentIds.length) return withdrawn;
  const { rows: markedRows } = await query(
    'SELECT id FROM assessments WHERE id=ANY($1) AND left(content_fingerprint, length($2))=$2',
    [assessmentIds, SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX],
  );
  for (const row of markedRows) withdrawn.add(row.id);
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id = ANY($1)`, [assessmentIds]);
  for (const row of rows) {
    const delivery = resolveAgriculturalScienceDelivery(row);
    if (!delivery || (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint)) continue;
    await retireStaleAgriculturalScienceCache(query, row.id, delivery);
    withdrawn.add(row.assessment_id);
  }
  return withdrawn;
}
