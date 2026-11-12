import { createHash } from 'node:crypto';
import manifestData from '../db/primary4/sourceManifest.json' with { type: 'json' };
import { buildHomeEconomicsImportPlan } from '../db/primary4/buildHomeEconomicsImportPlan.js';
import { buildHomeEconomicsTerm3SupplementPlan } from '../db/primary4/buildHomeEconomicsTerm3SupplementPlan.js';
import { buildBasicScienceTerm3ImportPlan } from '../db/primary4/buildBasicScienceTerm3ImportPlan.js';
import { buildBasicTechnologyTerms1And2ImportPlan } from '../db/primary4/buildBasicTechnologyTerms1And2ImportPlan.js';

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
type ResearchedRecord = {
  stable_key: string;
  subject: string;
  term: string;
  order_index: number;
  title: string;
  source_sha256: string;
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
  summary?: unknown;
  generated_assessment_id?: unknown;
  [key: string]: unknown;
};

const records = new Map<number, ManifestRecord>(
  (manifestData as { records: ManifestRecord[] }).records.map(record => [record.id, record]),
);
const sha256 = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const normalize = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');

function makeResearchedRecord(topic: any): ResearchedRecord {
  return {
    stable_key: String(topic.stable_key),
    subject: String(topic.subject_name),
    term: String(topic.term_label),
    order_index: Number(topic.order_index),
    title: String(topic.title),
    source_sha256: sha256(String(topic.source_reference)),
  };
}

// The same deterministic builders produce both the insert-only import plan and
// the exact source fingerprints accepted by student delivery. Pending lessons
// are deliberately withheld until their package metadata is approved/verified.
const researchedPlans = [
  buildHomeEconomicsImportPlan(),
  buildHomeEconomicsTerm3SupplementPlan(),
  buildBasicScienceTerm3ImportPlan(),
  buildBasicTechnologyTerms1And2ImportPlan(),
];
const researchedRecords = new Map<string, ResearchedRecord>(
  researchedPlans.flatMap(plan => plan.topics.map((topic: any) => {
    const record = makeResearchedRecord(topic);
    return [record.stable_key, record] as const;
  })),
);

export type Primary4SourceDelivery =
  | { source: 'primary4-export'; kind: 'matched'; topicId: number; text: string; sourceHash: string; reviewRequired: boolean; reviewFlag: ReviewFlag }
  | { source: 'primary4-export'; kind: 'withheld'; topicId: number | null; text: string; reason: string };

function isPrimary4(topic: Primary4Topic): boolean {
  return topic.school_code === 'primary' && normalize(topic.class_name) === 'primary 4';
}

function pendingApproval(source: string): boolean {
  const approval = /Content approval:\s*([A-Z_]+)/.exec(source)?.[1];
  const verification = /Pedagogical verification:\s*([A-Z_]+)/.exec(source)?.[1];
  return approval !== 'APPROVED' || verification !== 'VERIFIED';
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
  const withheld = (reason: string): Primary4SourceDelivery => ({
    source: 'primary4-export',
    kind: 'withheld',
    topicId,
    text: '[PRIMARY 4 SOURCE WITHHELD] This topic is temporarily unavailable because its curriculum source is missing, changed or still awaiting approval and verification.',
    reason,
  });
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
  if (!researched) return withheld('Researched-package key is not registered');
  if (normalize(topic.subject_name) !== normalize(researched.subject) ||
      normalize(topic.term_label) !== normalize(researched.term) ||
      Number(topic.order_index) !== researched.order_index ||
      normalize(topic.title) !== normalize(researched.title)) {
    return withheld('Researched-package topic identity differs from its registered lesson');
  }
  const sourceHash = sha256(source);
  if (sourceHash !== researched.source_sha256) return withheld('Researched-package source hash mismatch');
  if (pendingApproval(source)) return withheld('Researched lesson is pending owner approval and independent verification');
  return {
    source: 'primary4-export',
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
      primary4_delivery: { status: 'withheld' },
    } as T;
  }
  return {
    ...topic,
    primary4_delivery: {
      status: 'source-export-match',
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
