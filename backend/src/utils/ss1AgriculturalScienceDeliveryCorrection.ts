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
  'CORR-AG-T1-W09-ENVIRONMENTAL-FACTORS-REPLACEMENT': 'ENVIRONMENTAL FACTORS AFFECTING AGRICULTURAL PRODUCTION (CROPAND ANIMAL DISTRIBUTION AND PRODUCTION)',
  'CORR-AG-T3-W01-TOOL-NAMES-REPLACEMENT': 'SIMPLE FARM TOOLS',
  'CORR-AG-T2-W07-PEAT-TYPO-REPLACEMENT': 'ROCK FORMATION AND TYPES',
  'CORR-AG-T2-W08-QUESTION-WORDING-REPLACEMENT': 'ROCK WEATHERING',
  'CORR-AG-T2-W09-SOIL-TERMS-REPLACEMENT': 'FACTORS OF SOIL FORMATION',
  'CORR-AG-T2-W06-AGRICULTURAL-ECOLOGY-REPLACEMENT': 'AGRICULTURAL ECOLOGY',
  'CORR-AG-T2-W02-03-CULTURAL-PRACTICES-REPLACEMENT': 'CULTURAL PRACTICES',
  'CORR-AG-T2-W04-05-SELECTED-CROPS-REPLACEMENT': 'HUSBANDRY AND CULTIVATION OF SOME SELECTED CROPS',
  'CORR-AG-T1-W03-STORAGE-REPLACEMENT': 'PROBLEMS OF AGRICULTURAL DEVELOPMENT IN NIGERIA AND THEIR POSSIBLE SOLUTIONS',
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

function correctionScopePrefix(correction: SubjectPackage['delivery_corrections'][number]) {
  const match = correction.id.match(/^CORR-AG-(T[123])-W([0-9]{2}(?:-[0-9]{2})?)-/);
  if (!match) throw new Error(`Invalid Agricultural Science correction scope: ${correction.id}`);
  return `AGRICULTURAL-SCIENCE-${match[1]}-W${match[2]}-`;
}

function blockingItemsForCorrection(pkg: SubjectPackage, correction: SubjectPackage['delivery_corrections'][number]) {
  const prefix = correctionScopePrefix(correction);
  return pkg.open_items.filter(item => item.blocks_delivery && item.id.startsWith(prefix));
}

function approvalGate(
  pkg: SubjectPackage,
  lesson: SubjectPackage['lessons'][number],
  correction: SubjectPackage['delivery_corrections'][number],
) {
  // A package-wide PENDING status or a different week's blocker must not suppress
  // this correction. Delivery is gated by the exact correction's teaching week.
  if (blockingItemsForCorrection(pkg, correction).length) {
    return 'This Agricultural Science teaching week still has unresolved delivery-blocking review items.';
  }
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
      blockingItems: blockingItemsForCorrection(subjectPackage, correction).map(item => item.id).sort(),
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

      const gate = approvalGate(subjectPackage, lesson, correction);
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

export interface AgriculturalScienceAssetMetadata {
  asset_key?: unknown;
  sha256?: unknown;
  mime?: unknown;
}

/** Assets are deliverable only with the exact approved replacement lesson that owns them. */
export function createAgriculturalScienceAssetDeliveryResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  const resolveTopic = createAgriculturalScienceDeliveryResolver(subjectPackage);
  const assets = new Map(subjectPackage.assets.map(asset => [asset.id, asset]));
  const lessons = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  return (topic: AgriculturalScienceDeliveryTopic, metadata: AgriculturalScienceAssetMetadata): boolean => {
    const delivery = resolveTopic(topic);
    if (!delivery || delivery.kind !== 'corrected') return false;
    const asset = assets.get(String(metadata.asset_key ?? ''));
    if (!asset || asset.sha256 !== metadata.sha256 || asset.media_type !== metadata.mime) return false;
    const lesson = lessons.get(asset.lesson_id);
    const correction = subjectPackage.delivery_corrections.find(item => item.id === delivery.correctionId);
    if (!lesson || !correction || !delivery.replacementLessonIds.includes(lesson.id) || approvalGate(subjectPackage, lesson, correction)) return false;
    if (asset.state.content_approval !== 'APPROVED' || !asset.state.approval_reference ||
        asset.state.implementation !== 'IMPLEMENTED' ||
        asset.state.verification !== 'VERIFIED' || !asset.state.verification_reference ||
        asset.provenance.reuse_status !== 'PERMITTED') return false;
    return true;
  };
}

const packageValue = packageSchema.parse(packageData);
const defaultResolver = createAgriculturalScienceDeliveryResolver(packageValue);
export const resolveAgriculturalScienceDelivery = (topic: AgriculturalScienceDeliveryTopic) => defaultResolver(topic);
const defaultAssetResolver = createAgriculturalScienceAssetDeliveryResolver(packageValue);
export const agriculturalScienceAssetDeliverable = (topic: AgriculturalScienceDeliveryTopic, metadata: AgriculturalScienceAssetMetadata) => defaultAssetResolver(topic, metadata);

export interface AgriculturalScienceSupplementResolution {
  source: 'ss1-agricultural-science';
  lessonId: string;
  kind: 'supplement' | 'withheld';
  text: string;
  fingerprint: string;
  reason?: string;
}

function renderCompiledSupplement(lesson: SubjectPackage['lessons'][number]) {
  return [
    lesson.body, 'OBJECTIVES', ...lesson.objectives, 'PRACTICE AND MARKING GUIDE',
    ...lesson.practice.map(question =>
      `${question.id}. ${question.question}\nAnswer: ${question.answer}\nMarks: ${question.marks}\n${question.marking.map(mark => `${mark.marks}: ${mark.criterion}`).join('\n')}`,
    ),
  ].join('\n\n');
}

function renderStudentSupplement(lesson: SubjectPackage['lessons'][number]) {
  return [
    lesson.title, lesson.body, 'LEARNING OBJECTIVES',
    ...lesson.objectives.map((objective, index) => `${index + 1}. ${objective}`),
    'PRACTICE QUESTIONS',
    ...lesson.practice.map(question => `${question.id}. ${question.question}`),
  ].join('\n\n');
}

export function createAgriculturalScienceSupplementResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  const lessons = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  return (topic: AgriculturalScienceDeliveryTopic): AgriculturalScienceSupplementResolution | null => {
    if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
        norm(topic.subject_name) !== norm(SUBJECT_NAME)) return null;
    const sourceFile = String(topic.source_file ?? '').split(/[\\/]/).pop() ?? '';
    if (!sourceFile.startsWith('SUP-SS1-AGRICULTURAL-SCIENCE-')) return null;
    const lesson = lessons.get(sourceFile);
    const withheld = (reason: string): AgriculturalScienceSupplementResolution => ({
      source: 'ss1-agricultural-science', lessonId: sourceFile, kind: 'withheld',
      text: `${SS1_AGRICULTURAL_SCIENCE_WITHHELD_MARKER} ${sourceFile}\nThis Agricultural Science supplement is temporarily unavailable because its stored content does not match the approved, verified lesson package.`,
      fingerprint: hash(`supplement-withheld:${sourceFile}:${reason}`), reason,
    });
    if (!lesson) return withheld('Unknown package supplement identity');
    if (topic.term_label !== lesson.term || norm(topic.title) !== norm(lesson.title)) return withheld('Stored supplement title or term differs from the package');
    const stored = typeof topic.source_reference === 'string' ? topic.source_reference : '';
    if (stored !== renderCompiledSupplement(lesson)) return withheld('Stored supplement body differs from the compiled package lesson');
    if (lesson.state.implementation !== 'IMPLEMENTED' || lesson.state.content_approval !== 'APPROVED' ||
        !lesson.state.approval_reference || lesson.state.verification !== 'VERIFIED' ||
        !lesson.state.verification_reference || lesson.provenance.some(source => source.reuse_status !== 'PERMITTED')) {
      return withheld('Supplement implementation, approval, verification or rights evidence is incomplete');
    }
    const text = renderStudentSupplement(lesson);
    return { source: 'ss1-agricultural-science', lessonId: lesson.id, kind: 'supplement', text,
      fingerprint: hash(JSON.stringify({ lessonId: lesson.id, bodyHash: lesson.body_sha256, text })) };
  };
}

function stripSourceAssessmentSections(source: string) {
  const heading = /^(?:\s*#{1,6}\s*)?(?:\d+[.)]\s*)?(?:WEEKEND\s+ASSIGNMENT|GENERAL\s+EVALUATION|REVISION\s+QUESTIONS|OBJECTIVE\s+QUESTIONS|THEORY\s+QUESTIONS|PRACTICE\s+AND\s+MARKING\s+GUIDE|EVALUATION|ASSIGNMENT|EXERCISE)\b[^\n]*$/im;
  const match = heading.exec(source);
  return { text: (match ? source.slice(0, match.index) : source).trim(), removed: Boolean(match) };
}

export interface AgriculturalScienceSourceProjection {
  source: 'ss1-agricultural-science';
  sourceFile: string;
  sourceLessonId: string;
  kind: 'sanitized' | 'supplemented' | 'withheld';
  text: string;
  fingerprint: string;
  supplementIds: string[];
}

export function createAgriculturalScienceSourceProjectionResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  return (topic: AgriculturalScienceDeliveryTopic): AgriculturalScienceSourceProjection | null => {
  if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
      norm(topic.subject_name) !== norm(SUBJECT_NAME) || typeof topic.source_reference !== 'string') return null;
  if (resolveAgriculturalScienceDelivery(topic)) return null;
  const sourceFile = String(topic.source_file ?? '').split(/[\\/]/).pop() ?? '';
  if (!sourceFile || sourceFile.startsWith('SUP-SS1-AGRICULTURAL-SCIENCE-')) return null;
  const source = subjectPackage.sources.find(item =>
    item.term === topic.term_label && item.archive_member.split('/').pop() === sourceFile);
  if (!source) return null;
  const sourceLessonId = `${source.source_id}:BODY:${hash(topic.source_reference)}`;
  const { text: teachingText, removed } = stripSourceAssessmentSections(topic.source_reference);
  const coverage = subjectPackage.coverage.filter(item => item.lesson_ids.includes(sourceLessonId));
  const supplementIds = [...new Set(coverage.flatMap(item => item.lesson_ids)
    .filter(id => id.startsWith('SUP-SS1-AGRICULTURAL-SCIENCE-')))];
  const verifiedSupplements = supplementIds
    .map(id => subjectPackage.lessons.find(lesson => lesson.id === id))
    .filter((lesson): lesson is SubjectPackage['lessons'][number] => Boolean(lesson))
    .filter(lesson =>
      lesson.state.implementation === 'IMPLEMENTED' &&
      lesson.state.content_approval === 'APPROVED' && Boolean(lesson.state.approval_reference) &&
      lesson.state.verification === 'VERIFIED' && Boolean(lesson.state.verification_reference) &&
      lesson.provenance.every(item => item.reuse_status === 'PERMITTED'));
  if (!removed && verifiedSupplements.length === 0) return null;
  if (!teachingText && verifiedSupplements.length === 0) {
    return {
      source: 'ss1-agricultural-science', sourceFile, sourceLessonId, kind: 'withheld',
      text: `${SS1_AGRICULTURAL_SCIENCE_WITHHELD_MARKER} ${sourceLessonId}\nThis source row contains no learner-safe teaching material after assessment content was excluded.`,
      fingerprint: hash(`withheld-source:${sourceLessonId}`), supplementIds: [],
    };
  }
  const text = [
    teachingText,
    verifiedSupplements.length ? 'VERIFIED PACKAGE CLARIFICATIONS — USE THESE TO RESOLVE OR QUALIFY ANY CONFLICTING SOURCE STATEMENT' : '',
    ...verifiedSupplements.map(renderStudentSupplement),
  ].filter(Boolean).join('\n\n');
  return {
    source: 'ss1-agricultural-science', sourceFile, sourceLessonId,
    kind: verifiedSupplements.length ? 'supplemented' : 'sanitized',
    text,
    fingerprint: hash(JSON.stringify({
      sourceLessonId, originalSourceHash: hash(topic.source_reference), teachingTextHash: hash(teachingText),
      supplementIds: verifiedSupplements.map(lesson => lesson.id),
      supplementHashes: verifiedSupplements.map(lesson => lesson.body_sha256),
    })),
    supplementIds: verifiedSupplements.map(lesson => lesson.id),
  };
  };
}

const defaultSourceProjectionResolver = createAgriculturalScienceSourceProjectionResolver(packageValue);
export const resolveAgriculturalScienceSourceProjection = (topic: AgriculturalScienceDeliveryTopic) => defaultSourceProjectionResolver(topic);

const defaultSupplementResolver = createAgriculturalScienceSupplementResolver(packageValue);
export const resolveAgriculturalScienceSupplement = (topic: AgriculturalScienceDeliveryTopic) => defaultSupplementResolver(topic);

export function safeAgriculturalScienceTopic<T extends AgriculturalScienceDeliveryTopic>(topic: T): T {
  const delivery = resolveAgriculturalScienceDelivery(topic);
  if (delivery) {
    const replacement = delivery.kind === 'corrected'
      ? packageValue.lessons.find(lesson => delivery.replacementLessonIds.includes(lesson.id))
      : undefined;
    const learnerText = replacement ? renderStudentSupplement(replacement) : delivery.text;
    return {
      ...topic,
      source_reference: delivery.kind === 'corrected' && replacement ? learnerText : null,
      summary: learnerText,
      generated_assessment_id: null,
      delivery_correction: {
        id: delivery.correctionId,
        status: delivery.kind,
        provenance: delivery.kind === 'corrected' && replacement
          ? 'approved verified replacement; student projection excludes answer keys and marking criteria'
          : 'withheld pending subject approval/verification',
        reason: delivery.reason ?? (delivery.kind === 'corrected' && !replacement ? 'Replacement lesson is missing from the package' : undefined),
      },
    };
  }
  const supplement = resolveAgriculturalScienceSupplement(topic);
  if (supplement) {
    return {
      ...topic,
      source_reference: supplement.kind === 'supplement' ? supplement.text : null,
      summary: supplement.text,
      generated_assessment_id: null,
      delivery_correction: {
        id: supplement.lessonId,
        status: supplement.kind === 'supplement' ? 'corrected' : 'withheld',
        provenance: supplement.kind === 'supplement' ? 'owner-approved verified package supplement; teacher marking material withheld' : 'withheld pending exact package identity and verification',
        reason: supplement.reason,
      },
    };
  }
  const projection = resolveAgriculturalScienceSourceProjection(topic);
  if (!projection) return topic;
  return {
    ...topic,
    source_reference: projection.kind === 'withheld' ? null : projection.text,
    summary: null,
    generated_assessment_id: null,
    delivery_correction: {
      id: projection.sourceLessonId,
      status: projection.kind,
      provenance: 'source assessments excluded; only verified package supplements appended to learner grounding',
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

export async function retireStaleAgriculturalScienceSourceCache(
  query: AgriculturalScienceQuery,
  topicId: unknown,
  projection: AgriculturalScienceSourceProjection,
) {
  const tombstone = `${SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX}${projection.sourceLessonId}`;
  const { rows } = await query(
    `WITH target AS MATERIALIZED (
       SELECT t.id, t.generated_assessment_id
       FROM topics t JOIN subjects s ON s.id=t.subject_id
       WHERE t.id=$1 AND t.school_code=$2 AND t.class_name=$3
         AND s.name=$4 AND t.source_file=$5
       FOR UPDATE OF t
     ),
     stale AS MATERIALIZED (
       SELECT a.id FROM assessments a JOIN target ON a.id=target.generated_assessment_id
       WHERE a.content_fingerprint IS DISTINCT FROM $6
     ),
     closed AS (
       UPDATE assessments a SET status='closed', content_fingerprint=$7
       FROM stale WHERE a.id=stale.id RETURNING a.id
     ),
     updated AS (
       UPDATE topics topic
       SET summary=NULL,
           generated_assessment_id=CASE WHEN EXISTS (SELECT 1 FROM stale) THEN NULL ELSE topic.generated_assessment_id END
       FROM target
       WHERE topic.id=target.id
       RETURNING topic.id
     )
     SELECT (SELECT count(*) FROM stale) AS retired,
            (SELECT count(*) FROM closed) AS closed_assessments,
            (SELECT count(*) FROM updated) AS updated_topics`,
    [topicId, SCHOOL_CODE, CLASS_NAME, SUBJECT_NAME, projection.sourceFile,
      projection.fingerprint, tombstone],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0,
    closedAssessments: Number(rows[0]?.closed_assessments ?? 0) > 0,
    updatedTopic: Number(rows[0]?.updated_topics ?? 0) > 0 };
}

const LINKED_SQL = `SELECT t.id, t.school_code, t.class_name, t.term_label, t.title, t.source_file,
       t.source_reference, sub.name AS subject_name, a.id AS assessment_id, a.content_fingerprint
  FROM topics t JOIN subjects sub ON sub.id=t.subject_id JOIN assessments a ON a.id=t.generated_assessment_id`;

export async function retireStaleAgriculturalScienceSupplementCache(
  query: AgriculturalScienceQuery,
  topicId: unknown,
  supplement: AgriculturalScienceSupplementResolution,
) {
  const expectedFingerprint = supplement.kind === 'supplement'
    ? supplement.fingerprint
    : `${SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX}${supplement.lessonId}`;
  const { rows } = await query(
    `WITH target AS MATERIALIZED (
       SELECT t.id, t.generated_assessment_id
       FROM topics t JOIN subjects s ON s.id=t.subject_id
       WHERE t.id=$1 AND t.school_code=$2 AND t.class_name=$3
         AND s.name=$4 AND t.source_file=$5
       FOR UPDATE OF t
     ),
     stale AS MATERIALIZED (
       SELECT a.id FROM assessments a JOIN target ON a.id=target.generated_assessment_id
       WHERE a.content_fingerprint IS DISTINCT FROM $6
     ),
     closed AS (
       UPDATE assessments a SET status='closed', content_fingerprint=$7
       FROM stale WHERE a.id=stale.id RETURNING a.id
     ),
     updated AS (
       UPDATE topics topic
       SET summary=$8,
           generated_assessment_id=CASE WHEN EXISTS (SELECT 1 FROM stale) THEN NULL ELSE topic.generated_assessment_id END
       FROM target
       WHERE topic.id=target.id
       RETURNING topic.id
     )
     SELECT (SELECT count(*) FROM stale) AS retired,
            (SELECT count(*) FROM closed) AS closed_assessments,
            (SELECT count(*) FROM updated) AS updated_topics`,
    [topicId, SCHOOL_CODE, CLASS_NAME, SUBJECT_NAME, supplement.lessonId, expectedFingerprint,
      `${SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX}${supplement.lessonId}`, supplement.text],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0,
    closedAssessments: Number(rows[0]?.closed_assessments ?? 0) > 0,
    updatedTopic: Number(rows[0]?.updated_topics ?? 0) > 0 };
}

export async function agriculturalScienceAssessmentDeliverable(query: AgriculturalScienceQuery, assessmentId: unknown) {
  const { rows: markerRows } = await query('SELECT content_fingerprint FROM assessments WHERE id=$1', [assessmentId]);
  if (String(markerRows[0]?.content_fingerprint ?? '').startsWith(SS1_AGRICULTURAL_SCIENCE_WITHDRAWN_FINGERPRINT_PREFIX)) {
    return { ok: false as const, reason: 'This Agricultural Science assessment has been withdrawn pending source correction approval and verification.' };
  }
  const { rows } = await query(`${LINKED_SQL} WHERE t.generated_assessment_id=$1`, [assessmentId]);
  for (const row of rows) {
    const delivery = resolveAgriculturalScienceDelivery(row);
    if (delivery) {
      if (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint) continue;
      await retireStaleAgriculturalScienceCache(query, row.id, delivery);
      return { ok: false as const, reason: 'This assessment has been withdrawn because the Agricultural Science source lesson was corrected or withheld.' };
    }
    const supplement = resolveAgriculturalScienceSupplement(row);
    if (supplement) {
      if (supplement.kind === 'supplement' && row.content_fingerprint === supplement.fingerprint) continue;
      await retireStaleAgriculturalScienceSupplementCache(query, row.id, supplement);
      return { ok: false as const, reason: 'This assessment has been withdrawn because its Agricultural Science supplement contains stale or teacher-only material.' };
    }
    const projection = resolveAgriculturalScienceSourceProjection(row);
    if (projection) {
      if (projection.kind !== 'withheld' && row.content_fingerprint === projection.fingerprint) continue;
      await retireStaleAgriculturalScienceSourceCache(query, row.id, projection);
      return { ok: false as const, reason: 'This assessment has been withdrawn because its Agricultural Science source was sanitized or supplemented.' };
    }
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
    if (delivery) {
      if (delivery.kind === 'corrected' && row.content_fingerprint === delivery.fingerprint) continue;
      await retireStaleAgriculturalScienceCache(query, row.id, delivery);
      withdrawn.add(row.assessment_id);
      continue;
    }
    const supplement = resolveAgriculturalScienceSupplement(row);
    if (supplement) {
      if (supplement.kind === 'supplement' && row.content_fingerprint === supplement.fingerprint) continue;
      await retireStaleAgriculturalScienceSupplementCache(query, row.id, supplement);
      withdrawn.add(row.assessment_id);
    }
    const projection = resolveAgriculturalScienceSourceProjection(row);
    if (projection) {
      if (projection.kind !== 'withheld' && row.content_fingerprint === projection.fingerprint) continue;
      await retireStaleAgriculturalScienceSourceCache(query, row.id, projection);
      withdrawn.add(row.assessment_id);
    }
  }
  return withdrawn;
}
