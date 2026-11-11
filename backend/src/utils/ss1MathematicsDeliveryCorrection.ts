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

const SOURCE_TITLES: Record<string, string> = {
  'CORR-MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS': 'REVISION AND BASIC OPERATIONS OF INTEGER',
  'CORR-MATHEMATICS-T1-W02-NUMBER-BASES': 'NUMBER BASES /BASE NUMBER.',
  'CORR-MATHEMATICS-T1-W03-BASE-OPERATIONS': 'RULES OF BASE NUMBER',
  'CORR-MATHEMATICS-T1-W04-MODULAR-ARITHMETIC': 'MODULAR ARITHMETIC',
  'CORR-MATHEMATICS-T1-W05-STANDARD-FORM': 'STANDARD FORM AND APPROXIMATION',
  'CORR-MATHEMATICS-T1-W06-INDICES': 'INDICES',
  'CORR-MATHEMATICS-T1-W08-LOGARITHMS': 'LOGARITHMS OF WHOLE NUMBERS',
  'CORR-MATHEMATICS-T1-W09-LOG-POWERS': 'SQUARES OR POWERS OF NUMBERS IN LOGARITHMS',
  'CORR-MATHEMATICS-T1-W10-EQUATIONS-VARIATION': 'SIMPLE EQUATION AND VARIATION',
  'CORR-MATHEMATICS-T2-2-00': 'Quadratic equation by (a) Factorization (b) Completing the square method',
  'CORR-MATHEMATICS-T2-2-01': 'General form of quadratic equation leading to Formular method',
  'CORR-MATHEMATICS-T2-2-02': 'Solution of quadratic equation by graphical method.',
  'CORR-MATHEMATICS-T2-W04-SETS': 'IDEA OF SETS',
  'CORR-MATHEMATICS-T2-2-04': 'SETS',
  'CORR-MATHEMATICS-T2-2-06': 'TRIGONOMETRIC RATIOS',
  'CORR-MATHEMATICS-T2-2-07': 'Application of sine, cosine and tangent, simple problems with respect to right angle triangles.',
  'CORR-MATHEMATICS-T2-2-08': 'Introduction of circle and its properties',
  'CORR-MATHEMATICS-T2-2-09': 'LOGIC',
  'CORR-MATHEMATICS-T3-3-00': 'Mensuration: The concept of B – D a shape cube, cuboids, cylinder, triangular prism, cone, rectangular based pyramid, total surface area of cone, cylinder and their volumes.',
  'CORR-MATHEMATICS-T3-3-01': '(a) Volumes of frustums of cone, rectangular based pyramid and other pyramids',
  'CORR-MATHEMATICS-T3-3-04': 'Deductive proof',
  'CORR-MATHEMATICS-T3-3-05': 'STATISTICS',
  'CORR-MATHEMATICS-T3-3-07': 'Collection, Tabulation and Presentation of Grouped Data',
  'CORR-MATHEMATICS-T3-W09-GROUPED-DATA': 'Calculation of Range, Median and Mode of Grouped data',
  'CORR-MATHEMATICS-T3-3-09': 'Statistical Graphs',
  'CORR-MATHEMATICS-T3-3-10': 'Mean Deviation, Variance and standard Deviation of Grouped Data use in solving practical problems related to real life situations',
};
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
    if (!source || !lesson || !SOURCE_TITLES[correction.id] || lesson.term !== source.term || correction.source_sha256 !== source.sha256 ||
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
      if (topic.term_label !== source.term || sourceFile !== path.basename(source.archive_member) ||
          norm(topic.title) !== norm(SOURCE_TITLES[correction.id])) continue;
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

/** Permit only the exact, approved and verified Mathematics SVG registered in the subject package. */
export function mathematicsAssetDeliverable(topic: Ss1MathematicsTopic, storedAsset: { asset_key?: unknown; sha256?: unknown; mime?: unknown }) {
  if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
      norm(topic.subject_name) !== norm(SUBJECT_NAME)) return false;
  const asset = packageValue.assets.find(item => item.id === storedAsset.asset_key);
  if (!asset || asset.sha256 !== storedAsset.sha256 || asset.media_type !== storedAsset.mime ||
      asset.state.content_approval !== 'APPROVED' || asset.state.implementation !== 'IMPLEMENTED' ||
      asset.state.verification !== 'VERIFIED' || asset.provenance.reuse_status !== 'PERMITTED') return false;
  const lesson = packageValue.lessons.find(item => item.id === asset.lesson_id);
  if (!lesson || lesson.term !== topic.term_label) return false;
  const source = packageValue.sources.find(item => item.term === lesson.term);
  if (!source || path.basename(source.archive_member) !== path.basename(String(topic.source_file ?? ''))) return false;
  const expectedTitle = asset.source_locator.split(' — ').at(-1)?.trim() ?? '';
  return norm(topic.title) === norm(expectedTitle);
}

/** Prevent raw Mathematics source rows (including unresolved weeks) from leaking into student topic lists/details. */
export function safeSs1MathematicsTopic<T extends Ss1MathematicsTopic>(topic: T): T {
  if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
      norm(topic.subject_name) !== norm(SUBJECT_NAME)) return topic;
  const sourceFile = path.basename(String(topic.source_file ?? ''));
  const source = packageValue.sources.find(item => item.term === topic.term_label &&
    path.basename(item.archive_member) === sourceFile);
  if (!source || typeof topic.source_reference !== 'string') return topic;
  const delivery = defaultResolver(topic);
  if (delivery?.kind === 'corrected') {
    return {
      ...topic, source_reference: delivery.text, summary: delivery.text, generated_assessment_id: null,
      delivery_correction: { id: delivery.correctionId, status: 'corrected',
        provenance: 'approved and verified Mathematics replacement lesson' },
    } as T;
  }
  const correctionId = delivery?.correctionId ?? `${source.source_id}:BODY:${hash(topic.source_reference)}`;
  return {
    ...topic, source_reference: null,
    summary: delivery?.text ?? `${SS1_MATHEMATICS_WITHHELD_MARKER} ${correctionId}\nThis Mathematics source row has no approved, verified student replacement yet.`,
    generated_assessment_id: null,
    delivery_correction: { id: correctionId, status: 'withheld',
      provenance: 'withheld pending exact source mapping, approval and verification',
      reason: delivery?.reason ?? 'No approved replacement is bound to this exact source row' },
  } as T;
}

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
