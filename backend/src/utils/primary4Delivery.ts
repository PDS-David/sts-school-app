import { createHash } from 'node:crypto';
import manifestData from '../db/primary4/sourceManifest.json' with { type: 'json' };
import { getPrimary4SupplementRecords } from '../db/primary4/primary4Supplements.js';
import archiveCorrectionData from '../db/primary4/researched/archiveLessonCorrections.json' with { type: 'json' };

type ReviewFlag = 'HIGH_SHORT_SOURCE' | 'SHORT_SOURCE_REVIEW' | 'CONTENT_PRESENT' | 'RESEARCHED_VERIFIED';
type ManifestRecord = {
  id: number;
  subject: string;
  term: string;
  order_index: number;
  title: string;
  source_sha256: string;
  source_chars: number;
  source_words: number;
  review_flag: ReviewFlag;
};
type ArchiveCorrection = {
  topic_id: number;
  subject: string;
  term: string;
  order_index: number;
  title: string;
  source_archive_file: string;
  material_type: string;
  content_approval: string;
  pedagogical_verification: string;
  objectives: string[];
  lesson: string;
  examples: string[];
  activity: string;
  evaluation: string[];
};
type ArchiveCorrectionPackage = {
  provenance: Record<string, string>;
  hidden_topic_ids: number[];
  corrections: ArchiveCorrection[];
};
type ResearchedRecord = {
  stable_key: string;
  subject: string;
  term: string;
  order_index: number;
  title: string;
  source_sha256: string;
  source_file: string;
};
type Primary4Topic = {
  id?: unknown;
  school_code?: unknown;
  class_name?: unknown;
  subject_name?: unknown;
  term_label?: unknown;
  order_index?: unknown;
  title?: unknown;
  source_reference?: unknown;
  source_file?: unknown;
  summary?: unknown;
  generated_assessment_id?: unknown;
  [key: string]: unknown;
};

const records = new Map<number, ManifestRecord>(
  (manifestData as { records: ManifestRecord[] }).records.map(record => [record.id, record]),
);
const sha256 = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const normalize = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');

// The same source-reference formatter is used by the existing ingestTopics.ts
// pipeline and by student delivery, so the stored source text must match exactly.
const archivePackage = archiveCorrectionData as ArchiveCorrectionPackage;
const archiveCorrections = new Map<number, ArchiveCorrection>(
  archivePackage.corrections.map(record => [record.topic_id, record]),
);
const archiveHiddenTopicIds = new Set<number>(archivePackage.hidden_topic_ids);
const researchedRecords = new Map<string, ResearchedRecord>();
let researchedRegistryUnavailable = false;
try {
  for (const record of getPrimary4SupplementRecords()) {
    researchedRecords.set(record.stable_key, {
      stable_key: record.stable_key,
      subject: record.subject_name,
      term: record.term_label,
      order_index: record.order_index,
      title: record.title,
      source_sha256: sha256(record.source_reference),
      source_file: record.source_file,
    });
  }
} catch (error) {
  // A malformed researched package must not take down existing Primary 4 lessons
  // or the shared learning route. It only disables researched-package delivery.
  researchedRegistryUnavailable = true;
}

export type Primary4SourceDelivery =
  | { source: 'primary4-export' | 'researched-package' | 'archive-correction'; kind: 'matched'; topicId: number; text: string; sourceHash: string; reviewRequired: boolean; reviewFlag: ReviewFlag }
  | { source: 'primary4-export' | 'researched-package' | 'archive-correction'; kind: 'withheld'; topicId: number | null; text: string; reason: string; hideFromStudent?: boolean };

function isPrimary4(topic: Primary4Topic): boolean {
  return topic.school_code === 'primary' && normalize(topic.class_name) === 'primary 4';
}

function pendingApproval(source: string): boolean {
  const approval = /Content approval:\s*([A-Z_]+)/.exec(source)?.[1];
  const verification = /Pedagogical verification:\s*([A-Z_]+)/.exec(source)?.[1];
  return approval !== 'APPROVED' || verification !== 'VERIFIED';
}

function archiveCorrectionSourceReference(record: ArchiveCorrection): string {
  const provenance = archivePackage.provenance;
  return [
    `CURRICULUM_KEY: primary4-archive-correction-${record.topic_id}`,
    'PROVENANCE',
    `Package: ${archiveCorrectionData.package_id}`,
    `Material type: ${record.material_type}`,
    `Source archive: ${record.source_archive_file}`,
    `Archive SHA-256: ${provenance.archive_sha256}`,
    `Curriculum basis: ${provenance.authoring_note}`,
    `Rights status: ${provenance.rights_status}`,
    `Content approval: ${record.content_approval}. Pedagogical verification: ${record.pedagogical_verification}.`,
    '',
    `LESSON TITLE: ${record.title}`,
    `CLASS: Primary 4 | SUBJECT: ${record.subject} | TERM: ${record.term}`,
    '',
    'LEARNING OBJECTIVES',
    ...record.objectives.map((item, index) => `${index + 1}. ${item}`),
    '',
    'LESSON NOTES',
    record.lesson,
    '',
    'EXAMPLES',
    ...record.examples.map(item => `- ${item}`),
    '',
    'CLASS ACTIVITY',
    record.activity,
    '',
    'EVALUATION',
    ...record.evaluation.map((item, index) => `${index + 1}. ${item}`),
  ].join('\n');
}

function primary4IdentityMatches(topic: Primary4Topic, expected: { subject: string; term: string; order_index: number; title: string }): boolean {
  return normalize(topic.subject_name) === normalize(expected.subject)
    && normalize(topic.term_label) === normalize(expected.term)
    && Number(topic.order_index) === expected.order_index
    && normalize(topic.title) === normalize(expected.title);
}

/** Bind a live Primary 4 row to either the read-only export or a deterministic
 * researched package. Export hashes prove export-text identity only; they do
 * not claim that original Word files were independently re-hashed.
 */
export function resolvePrimary4SourceDelivery(topic: Primary4Topic): Primary4SourceDelivery | null {
  if (!isPrimary4(topic)) return null;
  const id = Number(topic.id);
  const topicId = Number.isSafeInteger(id) ? id : null;
  const source = typeof topic.source_reference === 'string' ? topic.source_reference : '';
  const withheld = (reason: string, source: 'primary4-export' | 'researched-package' | 'archive-correction' = 'primary4-export', hideFromStudent = false): Primary4SourceDelivery => ({
    source,
    kind: 'withheld',
    topicId,
    text: '[PRIMARY 4 SOURCE WITHHELD] This topic is temporarily unavailable because its curriculum source is missing, changed or still awaiting approval and verification.',
    reason,
    ...(hideFromStudent ? { hideFromStudent: true } : {}),
  });
  if (topicId !== null) {
    const correction = archiveCorrections.get(topicId);
    if (correction) {
      if (!primary4IdentityMatches(topic, correction)) {
        return withheld('Archive correction identity differs from the exported topic', 'archive-correction');
      }
      const correctionText = archiveCorrectionSourceReference(correction);
      const sourceHash = sha256(correctionText);
      if (pendingApproval(correctionText)) {
        return withheld('Archive-based lesson correction is pending owner approval', 'archive-correction');
      }
      return {
        source: 'archive-correction',
        kind: 'matched',
        topicId,
        text: correctionText,
        sourceHash,
        reviewRequired: false,
        reviewFlag: 'RESEARCHED_VERIFIED',
      };
    }
    if (archiveHiddenTopicIds.has(topicId)) {
      const originalIdentity = records.get(topicId);
      if (originalIdentity && primary4IdentityMatches(topic, originalIdentity)) {
        return withheld('Superseded outline or merged source row is suppressed from student delivery', 'archive-correction', true);
      }
    }
  }
  if (!source.trim()) return withheld('Curriculum source text is missing');

  const original = topicId === null ? undefined : records.get(topicId);
  if (original) {
    if (normalize(topic.subject_name) !== normalize(original.subject) ||
        normalize(topic.term_label) !== normalize(original.term) ||
        Number(topic.order_index) !== original.order_index ||
        normalize(topic.title) !== normalize(original.title)) {
      return withheld('Topic identity differs from the exported record');
    }
    const sourceHash = sha256(source);
    if (sourceHash !== original.source_sha256) return withheld('Source text hash differs from the exported record');
    return {
      source: 'primary4-export',
      kind: 'matched',
      topicId: topicId!,
      text: source,
      sourceHash,
      reviewRequired: original.review_flag !== 'CONTENT_PRESENT',
      reviewFlag: original.review_flag,
    };
  }

  const stableKey = /^CURRICULUM_KEY:\s*([^\s]+)/m.exec(source)?.[1];
  if (!stableKey) return withheld('No matching Primary 4 export or researched-package identity');
  const researched = researchedRecords.get(stableKey);
  if (researchedRegistryUnavailable) return withheld('Researched lesson package is temporarily unavailable while its content is checked', 'researched-package');
  if (!researched) return withheld('Researched-package key is not registered', 'researched-package');
  if (normalize(topic.subject_name) !== normalize(researched.subject) ||
      normalize(topic.term_label) !== normalize(researched.term) ||
      normalize(topic.source_file) !== normalize(researched.source_file) ||
      Number(topic.order_index) !== researched.order_index ||
      normalize(topic.title) !== normalize(researched.title)) {
    return withheld('Researched-package topic identity differs from its registered lesson', 'researched-package');
  }
  const sourceHash = sha256(source);
  if (sourceHash !== researched.source_sha256) return withheld('Researched-package source hash mismatch', 'researched-package');
  if (pendingApproval(source)) return withheld('Researched lesson is pending owner approval and independent verification', 'researched-package');
  return {
    source: 'researched-package',
    kind: 'matched',
    topicId: topicId!,
    text: source,
    sourceHash,
    reviewRequired: false,
    reviewFlag: 'RESEARCHED_VERIFIED',
  };
}

/** Hide cached teaching and assessment links if the stored source has drifted
 * or a researched lesson has not passed owner approval and verification.
 */
export function safePrimary4Topic<T extends Primary4Topic>(topic: T): T {
  const delivery = resolvePrimary4SourceDelivery(topic);
  if (!delivery) return topic;
  if (delivery.kind === 'withheld') {
    return {
      ...topic,
      source_reference: null,
      summary: null,
      generated_assessment_id: null,
      description: 'This Primary 4 lesson is being checked. It will become available after its curriculum source is approved and verified.',
      primary4_delivery: { status: 'withheld', source: delivery.source, hide_from_student: delivery.hideFromStudent === true },
    } as T;
  }
  return {
    ...topic,
    ...(delivery.source === 'archive-correction' ? { source_reference: delivery.text, summary: null, generated_assessment_id: null } : {}),
    primary4_delivery: {
      status: delivery.source === 'primary4-export' ? 'source-export-match' : delivery.source === 'archive-correction' ? 'archive-correction-match' : 'researched-package-match',
      source: delivery.source,
      source_review_required: delivery.reviewRequired,
      source_review_flag: delivery.reviewFlag,
    },
  } as T;
}

/** Exclude stale generated assessments whose Primary 4 source no longer matches an approved source. */
export async function primary4WithdrawnAssessmentIds(
  query: (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>,
  assessmentIds: Array<string | number>,
): Promise<Set<string | number>> {
  if (!assessmentIds.length) return new Set();
  const { rows } = await query(
    `SELECT t.*, sub.name AS subject_name
       FROM topics t JOIN subjects sub ON sub.id=t.subject_id
      WHERE t.generated_assessment_id=ANY($1)
        AND t.school_code='primary' AND t.class_name='Primary 4'`,
    [assessmentIds],
  );
  return new Set(rows
    .filter((topic: any) => resolvePrimary4SourceDelivery(topic)?.kind === 'withheld')
    .map((topic: any) => topic.generated_assessment_id));
}
