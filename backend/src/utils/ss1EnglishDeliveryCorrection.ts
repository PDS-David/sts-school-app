import { createHash } from 'node:crypto';
import packageData from '../db/ss1/subjects/english.json' with { type: 'json' };
import { packageSchema, type SubjectPackage } from '../db/ss1/subjectPackageSchema.js';

export const SS1_ENGLISH_CORRECTION_MARKER = '[SS1 ENGLISH DELIVERY CORRECTION]';
export const SS1_ENGLISH_WITHHELD_MARKER = '[SS1 ENGLISH TOPIC WITHHELD]';
export const SS1_ENGLISH_WITHDRAWN_FINGERPRINT_PREFIX = 'SS1_ENG_WITHDRAWN:';

const SCHOOL_CODE = 'secondary';
const CLASS_NAME = 'SS 1';
const SUBJECT_NAME = 'English Language';
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const norm = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');
const basename = (value: unknown) => String(value ?? '').split(/[\\/]/).pop() ?? '';

export interface EnglishDeliveryTopic {
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
export interface EnglishDeliveryResolution {
  source: 'ss1-english';
  termLabel: string;
  kind: 'corrected' | 'withheld';
  correctionId: string;
  text: string;
  fingerprint: string;
  sourceHash: string;
  replacementLessonIds: string[];
  reason?: string;
}
export type EnglishQuery = (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>;

/** Learner rendering deliberately omits answer keys and marking criteria. */
function renderLesson(lesson: SubjectPackage['lessons'][number]) {
  return [
    lesson.title,
    lesson.body,
    'LEARNING OBJECTIVES',
    ...lesson.objectives.map((objective, index) => String(index + 1) + '. ' + objective),
    'PRACTICE — ATTEMPT THESE BEFORE DISCUSSING YOUR ANSWERS',
    ...lesson.practice.map(question => question.id + '. ' + question.question + ' (' + question.marks + ' mark(s))'),
    'SOURCES AND ATTRIBUTION',
    ...lesson.provenance.map(source =>
      source.title + ' — ' + source.locator + (source.url ? ' — ' + source.url : '') +
      '\nRights: ' + source.rights + '\nAttribution: ' + source.attribution
    ),
  ].join('\n\n');
}
function sourceTitle(correction: SubjectPackage['delivery_corrections'][number]) {
  const separator = correction.evidence.locator.indexOf(':');
  return separator < 0 ? '' : correction.evidence.locator.slice(separator + 1).trim();
}

function approvalGate(pkg: SubjectPackage, lesson: SubjectPackage['lessons'][number]) {
  if (pkg.package_status !== 'IMPLEMENTED') return 'The English Language package is not yet approved for delivery.';
  if (pkg.open_items.some(item => item.blocks_delivery)) return 'English Language still has blocking review items.';
  if (lesson.state.content_approval !== 'APPROVED' || !lesson.state.approval_reference) {
    return 'This English replacement lesson is awaiting genuine subject-content approval.';
  }
  if (lesson.state.verification !== 'VERIFIED' || !lesson.state.verification_reference) {
    return 'This English replacement lesson has not completed its authorised verification.';
  }
  if (lesson.provenance.some(source => source.reuse_status !== 'PERMITTED')) {
    return 'This English replacement lesson still has unresolved source-rights permission.';
  }
  return null;
}

export function createEnglishDeliveryResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  if (subjectPackage.subject_slug !== 'english' || subjectPackage.canonical_subject !== SUBJECT_NAME) {
    throw new Error('English delivery adapter received an unexpected subject package');
  }

  const sources = new Map(subjectPackage.sources.map(source => [source.source_id, source]));
  const lessons = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  const corrections = subjectPackage.delivery_corrections;
  if (new Set(corrections.map(correction => correction.id)).size !== corrections.length) {
    throw new Error('Duplicate English correction ID');
  }

  const built = new Map<string, { text: string; fingerprint: string; replacementLessonIds: string[] }>();
  const identities = new Set<string>();
  for (const correction of corrections) {
    const source = sources.get(correction.source_id);
    const lesson = lessons.get(correction.replacement_id);
    const title = sourceTitle(correction);
    const identity = [correction.source_id, title].join('|');
    if (!source || !lesson || !title || identities.has(identity) || lesson.term !== source.term ||
        correction.source_sha256 !== source.sha256 ||
        correction.source_lesson_id !== `${correction.source_id}:BODY:${correction.body_sha256}`) {
      throw new Error(`Invalid English correction binding: ${correction.id}`);
    }
    identities.add(identity);
    const text = SS1_ENGLISH_CORRECTION_MARKER + ' ' + correction.id +
      '\nThe original source row is preserved for audit. Study this independently authored replacement only after the English Language approval and verification gates are satisfied.\n\n' +
      renderLesson(lesson);
    const fingerprint = hash(JSON.stringify({
      id: correction.id,
      source: correction.body_sha256,
      lesson,
      packageStatus: subjectPackage.package_status,
      blockingItems: subjectPackage.open_items.filter(item => item.blocks_delivery).map(item => item.id).sort(),
    }));
    built.set(correction.id, { text, fingerprint, replacementLessonIds: [lesson.id] });
  }

  return (topic: EnglishDeliveryTopic): EnglishDeliveryResolution | null => {
    if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
        norm(topic.subject_name) !== norm(SUBJECT_NAME)) return null;

    for (const correction of corrections) {
      const source = sources.get(correction.source_id)!;
      const lesson = lessons.get(correction.replacement_id)!;
      if (topic.term_label !== source.term ||
          basename(topic.source_file) !== basename(source.archive_member)) continue;

      const currentHash = hash(typeof topic.source_reference === 'string' ? topic.source_reference : '');
      // Exact content identity is strongest. If the stored text has changed,
      // the exact source heading still identifies the row that must be withheld.
      // A matching body hash does not authorise substituting a different
      // lesson title. Both source identity and exact title must match.
      if (norm(topic.title) !== norm(sourceTitle(correction))) continue;
      const replacement = built.get(correction.id)!;
      if (currentHash !== correction.body_sha256) {
        return {
          source: 'ss1-english', termLabel: source.term, kind: 'withheld',
          correctionId: correction.id,
          text: SS1_ENGLISH_WITHHELD_MARKER + ' ' + correction.id +
            '\nThis stored English Language source row differs from the reviewed source fingerprint. It is temporarily unavailable while the source is checked.',
          fingerprint: hash(`withheld:source-mismatch:${correction.id}`),
          sourceHash: correction.body_sha256, replacementLessonIds: [],
          reason: 'Stored source fingerprint differs from the reviewed English lesson',
        };
      }

      const gate = approvalGate(subjectPackage, lesson);
      if (gate) {
        return {
          source: 'ss1-english', termLabel: source.term, kind: 'withheld',
          correctionId: correction.id,
          text: `${SS1_ENGLISH_WITHHELD_MARKER} ${correction.id}\\n${gate} The original source row is not shown until the replacement is approved and verified.`,
          fingerprint: hash(`withheld:approval-gate:${correction.id}:${gate}`),
          sourceHash: correction.body_sha256, replacementLessonIds: [], reason: gate,
        };
      }

      return {
        source: 'ss1-english', termLabel: source.term, kind: 'corrected',
        correctionId: correction.id, text: replacement.text, fingerprint: replacement.fingerprint,
        sourceHash: correction.body_sha256, replacementLessonIds: replacement.replacementLessonIds,
      };
    }
    return null;
  };
}

const packageValue = packageSchema.parse(packageData);
const defaultResolver = createEnglishDeliveryResolver(packageValue);
export const resolveEnglishDelivery = (topic: EnglishDeliveryTopic) => defaultResolver(topic);

export function safeEnglishTopic<T extends EnglishDeliveryTopic>(topic: T): T {
  const delivery = resolveEnglishDelivery(topic);
  if (!delivery) return topic;
  return {
    ...topic,
    source_reference: delivery.kind === 'corrected' ? delivery.text : null,
    summary: delivery.text,
    generated_assessment_id: null,
    delivery_correction: {
      id: delivery.correctionId,
      status: delivery.kind,
      provenance: delivery.kind === 'corrected' ? 'approved project-authored English correction' : 'withheld pending English approval/verification',
      reason: delivery.reason,
    },
  };
}

/** Retires only linked assessments for the exact secondary SS 1 English Language row. */
export async function retireStaleEnglishCache(query: EnglishQuery, topicId: unknown, delivery: EnglishDeliveryResolution) {
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
      `${SS1_ENGLISH_WITHDRAWN_FINGERPRINT_PREFIX}${delivery.correctionId}`],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0, closedAssessments: Number(rows[0]?.closed_assessments ?? 0) };
}

const LINKED_SQL = `SELECT t.id, t.school_code, t.class_name, t.term_label, t.title, t.source_file,
       t.source_reference, sub.name AS subject_name, a.id AS assessment_id, a.content_fingerprint
  FROM topics t JOIN subjects sub ON sub.id=t.subject_id JOIN assessments a ON a.id=t.generated_assessment_id`;

export async function englishAssessmentDeliverable(query: EnglishQuery, assessmentId: unknown) {
  const { rows: markerRows } = await query('SELECT content_fingerprint FROM assessments WHERE id=$1', [assessmentId]);
  if (String(markerRows[0]?.content_fingerprint ?? '').startsWith(SS1_ENGLISH_WITHDRAWN_FINGERPRINT_PREFIX)) {
    return { ok: false as const, reason: 'This English Language assessment has been withdrawn pending source correction approval and verification.' };
  }
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id=$1`, [assessmentId]);
  for (const row of rows) {
    const delivery = resolveEnglishDelivery(row);
    if (!delivery) continue;
    if (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint) continue;
    await retireStaleEnglishCache(query, row.id, delivery);
    return { ok: false as const, reason: 'This assessment has been withdrawn because its English Language source lesson was corrected or withheld.' };
  }
  return { ok: true as const };
}

export async function englishWithdrawnAssessmentIds(query: EnglishQuery, assessmentIds: unknown[]) {
  const withdrawn = new Set<unknown>();
  if (!assessmentIds.length) return withdrawn;
  const { rows: markedRows } = await query(
    'SELECT id FROM assessments WHERE id=ANY($1) AND left(content_fingerprint, length($2))=$2',
    [assessmentIds, SS1_ENGLISH_WITHDRAWN_FINGERPRINT_PREFIX],
  );
  for (const row of markedRows) withdrawn.add(row.id);
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id = ANY($1)`, [assessmentIds]);
  for (const row of rows) {
    const delivery = resolveEnglishDelivery(row);
    if (!delivery || (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint)) continue;
    await retireStaleEnglishCache(query, row.id, delivery);
    withdrawn.add(row.assessment_id);
  }
  return withdrawn;
}
