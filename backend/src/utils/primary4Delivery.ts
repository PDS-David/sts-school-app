import { createHash } from 'node:crypto';
import manifestData from '../db/primary4/sourceManifest.json' with { type: 'json' };

type ManifestRecord = {
  id: number;
  subject: string;
  term: string;
  order_index: number;
  title: string;
  source_sha256: string;
  source_chars: number;
  source_words: number;
  review_flag: 'HIGH_SHORT_SOURCE' | 'SHORT_SOURCE_REVIEW' | 'CONTENT_PRESENT';
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
const normalize = (value: unknown) => String(value ?? '').replace(/\\s+/g, ' ').trim().toLocaleLowerCase('en');
const sha256 = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');

export type Primary4SourceDelivery =
  | { source: 'primary4-export'; kind: 'matched'; topicId: number; text: string; sourceHash: string; reviewRequired: boolean; reviewFlag: ManifestRecord['review_flag'] }
  | { source: 'primary4-export'; kind: 'withheld'; topicId: number | null; text: string; reason: string };

function isPrimary4(topic: Primary4Topic): boolean {
  return topic.school_code === 'primary' && normalize(topic.class_name) === 'primary 4';
}

/** Bind the live topic row to the exact source_reference captured in the supplied export.
 * This verifies export integrity only; it does not claim the original Word file was re-hashed.
 */
export function resolvePrimary4SourceDelivery(topic: Primary4Topic): Primary4SourceDelivery | null {
  if (!isPrimary4(topic)) return null;
  const id = Number(topic.id);
  const record = Number.isSafeInteger(id) ? records.get(id) : undefined;
  const withheld = (reason: string): Primary4SourceDelivery => ({
    source: 'primary4-export',
    kind: 'withheld',
    topicId: Number.isSafeInteger(id) ? id : null,
    text: '[PRIMARY 4 SOURCE WITHHELD] This topic is temporarily unavailable because its curriculum source does not match the reviewed database export.',
    reason,
  });
  if (!record) return withheld('No matching Primary 4 export record');
  if (normalize(topic.subject_name) !== normalize(record.subject) ||
      normalize(topic.term_label) !== normalize(record.term) ||
      Number(topic.order_index) !== record.order_index ||
      normalize(topic.title) !== normalize(record.title)) {
    return withheld('Topic identity differs from the exported record');
  }
  if (typeof topic.source_reference !== 'string' || !topic.source_reference.trim()) {
    return withheld('Exported source text is missing');
  }
  const sourceHash = sha256(topic.source_reference);
  if (sourceHash !== record.source_sha256) return withheld('Source text hash differs from the exported record');
  return {
    source: 'primary4-export',
    kind: 'matched',
    topicId: id,
    text: topic.source_reference,
    sourceHash,
    reviewRequired: record.review_flag !== 'CONTENT_PRESENT',
    reviewFlag: record.review_flag,
  };
}

/** Hide cached teaching and assessment links if the stored source has drifted.
 * Short source notes remain available but are explicitly flagged during lesson delivery.
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

/** Exclude stale generated assessments whose Primary 4 source no longer matches the export. */
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
