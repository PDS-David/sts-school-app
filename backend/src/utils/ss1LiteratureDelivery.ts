import { createHash } from 'node:crypto';
import path from 'node:path';
import packageData from '../db/ss1/subjects/literature.json' with { type: 'json' };
import { packageSchema, type SubjectPackage } from '../db/ss1/subjectPackageSchema.js';

export const SS1_LITERATURE_DELIVERY_MARKER = '[SS1 LITERATURE STUDY LESSON]';
export const SS1_LITERATURE_WITHDRAWN_FINGERPRINT_PREFIX = 'SS1_LITERATURE_WITHDRAWN:';
const SCHOOL_CODE = 'secondary';
const CLASS_NAME = 'SS 1';
const SUBJECT_NAME = 'Literature-in-English';
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const norm = (value: unknown) => String(value ?? '').normalize('NFKC').replace(/\\s+/g, ' ').trim().toLocaleLowerCase('en');

export interface Ss1LiteratureTopic {
  id?: unknown; school_code?: unknown; class_name?: unknown; subject_name?: unknown;
  term_label?: unknown; title?: unknown; source_file?: unknown; source_reference?: unknown;
  summary?: unknown; generated_assessment_id?: unknown; [key: string]: unknown;
}
export interface Ss1LiteratureResolution {
  source: 'ss1-literature'; termLabel: string; kind: 'lesson';
  lessonId: string; text: string; fingerprint: string; sourceHash: string;
}
export type Ss1LiteratureQuery = (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>;

const SOURCE_TITLES: Record<string, Record<string, string>> = {
  '1st Term': {
    'introduction to the study of literature-in-english': 'SUP-SS1-LITERATURE-T1-W01-CORRECTED',
    'genre of literature – prose, poetry and drama': 'SUP-SS1-LITERATURE-T1-W02-PROSE',
    'fiction and non-fiction': 'SUP-SS1-LITERATURE-T1-W03',
    'element of prose': 'SUP-SS1-LITERATURE-T1-W04',
    'what is prose?': 'SUP-SS1-LITERATURE-T1-W05-W06',
    'what is poetry?': 'SUP-SS1-LITERATURE-T1-W07',
    'different forms of poetry and types of poetry': 'SUP-SS1-LITERATURE-T1-W08',
    'what is drama': 'SUP-SS1-LITERATURE-T1-W09',
    'oral tradition of literature': 'SUP-SS1-LITERATURE-T1-W10',
  },
  '2nd Term': {
    'introduction to africa drama – harvest of corruption': 'SUP-SS1-LITERATURE-T2-W01',
    'the blood of a stranger': 'SUP-SS1-LITERATURE-T2-W02',
    'african peotry': 'SUP-SS1-LITERATURE-T2-W03',
    'the dinning table (gbanabom hallowell)': 'SUP-SS1-LITERATURE-T2-W04',
    'the anvil and the hammer': 'SUP-SS1-LITERATURE-T2-W05',
    'non – african drama – othello by shakespare': 'SUP-SS1-LITERATURE-T2-W06',
    'she stoops to conquer': 'SUP-SS1-LITERATURE-T2-W07',
    'non-african poetry': 'SUP-SS1-LITERATURE-T2-W08',
    'the schoolboy': 'SUP-SS1-LITERATURE-T2-W09',
  },
  '3rd Term': {
    'introduction to africa drama – harvest of corruption': 'SUP-SS1-LITERATURE-T3-W01',
    'the blood of a stranger': 'SUP-SS1-LITERATURE-T3-W02',
    'african peotry': 'SUP-SS1-LITERATURE-T3-W03',
    'the dinning table (gbanabom hallowell)': 'SUP-SS1-LITERATURE-T3-W04',
    'the anvil and the hammer': 'SUP-SS1-LITERATURE-T3-W05',
    'non – african drama – othello by shakespare': 'SUP-SS1-LITERATURE-T3-W06',
    'she stoops to conquer': 'SUP-SS1-LITERATURE-T3-W07',
    'non-african poetry': 'SUP-SS1-LITERATURE-T3-W08',
    'the schoolboy': 'SUP-SS1-LITERATURE-T3-W09',
  },
};

function renderLesson(lesson: SubjectPackage['lessons'][number]) {
  return [
    `${SS1_LITERATURE_DELIVERY_MARKER} ${lesson.id}`,
    lesson.title, lesson.body, 'LEARNING OBJECTIVES',
    ...lesson.objectives.map((objective, index) => `${index + 1}. ${objective}`),
    'PRACTICE QUESTIONS AND MARKING GUIDE',
    ...lesson.practice.map(question =>
      `${question.id}. ${question.question}\\nAnswer: ${question.answer}\\nMarks: ${question.marks}\\n${question.marking.map(mark => `- ${mark.marks} mark(s): ${mark.criterion}`).join('\\n')}`,
    ),
    'SOURCES AND ATTRIBUTION',
    ...lesson.provenance.map(source => `${source.title} — ${source.locator}${source.url ? ` — ${source.url}` : ''}\\nRights: ${source.rights}\\nAttribution: ${source.attribution}`),
  ].join('\\n\\n');
}

export function createSs1LiteratureDeliveryResolver(input: SubjectPackage) {
  const subjectPackage = packageSchema.parse(input);
  if (subjectPackage.subject_slug !== 'literature' || subjectPackage.canonical_subject !== SUBJECT_NAME ||
      subjectPackage.package_status !== 'IMPLEMENTED' ||
      subjectPackage.lessons.some(lesson => lesson.state.content_approval !== 'APPROVED' ||
        !lesson.state.approval_reference || lesson.state.implementation !== 'IMPLEMENTED' ||
        lesson.provenance.some(source => source.reuse_status !== 'PERMITTED')) ||
      subjectPackage.coverage.some(item => item.status === 'PARTIAL' || item.status === 'UNRESOLVED') ||
      subjectPackage.open_items.some(item => item.blocks_delivery)) {
    throw new Error('SS1 Literature package is not approved for student delivery');
  }
  const sources = new Map(subjectPackage.sources.map(source => [source.term, source]));
  const lessons = new Map(subjectPackage.lessons.map(lesson => [lesson.id, lesson]));
  const built = new Map<string, { lesson: SubjectPackage['lessons'][number]; text: string; fingerprint: string; sourceHash: string; filename: string; term: string; title: string }>();
  for (const [term, titleMap] of Object.entries(SOURCE_TITLES)) {
    const source = sources.get(term);
    if (!source) throw new Error(`Missing SS1 Literature source for ${term}`);
    for (const [title, lessonId] of Object.entries(titleMap)) {
      const lesson = lessons.get(lessonId);
      if (!lesson || lesson.term !== term) throw new Error(`Missing SS1 Literature lesson binding: ${lessonId}`);
      const text = renderLesson(lesson);
      built.set(`${term}:${title}`, {
        lesson, text,
        fingerprint: hash(JSON.stringify({ source: source.sha256, term, title, lesson })),
        sourceHash: source.sha256, filename: path.basename(source.archive_member), term, title,
      });
    }
  }
  return (topic: Ss1LiteratureTopic): Ss1LiteratureResolution | null => {
    if (topic.school_code !== SCHOOL_CODE || topic.class_name !== CLASS_NAME ||
        norm(topic.subject_name) !== norm(SUBJECT_NAME)) return null;
    const term = String(topic.term_label ?? '');
    const title = norm(topic.title);
    const filename = path.basename(String(topic.source_file ?? ''));
    const entry = built.get(`${term}:${title}`);
    if (!entry || filename !== entry.filename || typeof topic.source_reference !== 'string' ||
        !norm(topic.source_reference).includes(title)) return null;
    return { source: 'ss1-literature', termLabel: term, kind: 'lesson',
      lessonId: entry.lesson.id, text: entry.text, fingerprint: entry.fingerprint, sourceHash: entry.sourceHash };
  };
}

const packageValue = packageSchema.parse(packageData);
const defaultResolver = createSs1LiteratureDeliveryResolver(packageValue);
export const resolveSs1LiteratureDelivery = (topic: Ss1LiteratureTopic) => defaultResolver(topic);

export async function retireStaleSs1LiteratureCache(query: Ss1LiteratureQuery, topicId: unknown, delivery: Ss1LiteratureResolution) {
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
      `${SS1_LITERATURE_WITHDRAWN_FINGERPRINT_PREFIX}${delivery.lessonId}`],
  );
  return { retired: Number(rows[0]?.retired ?? 0) > 0, closedAssessments: Number(rows[0]?.closed_assessments ?? 0) };
}
