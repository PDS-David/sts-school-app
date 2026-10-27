/**
 * SS1 identity + hashing rules (contract `ss1-subject-v1`). Pure functions; the single place where hashes are defined.
 *
 * Hash vocabulary (all lower-case hex SHA-256):
 *  - raw body hash        : sha256(UTF-8 bytes of the EXACT stored `topics.source_reference`). Used for delivery corrections
 *                           (same definition as JSS3's `deliveryHash`).
 *  - normalized body hash : sha256(NFKC, lower-case, whitespace-collapsed, trimmed). Used for duplicate proof
 *                           (same definition as the importer's `normalizedBodyHash`).
 *  - lesson content hash  : sha256(canonicalJson({title, objectives, body, practice})) of the authored lesson.
 *  - source hash          : sha256 of the original document bytes (from the manifest; never recomputed from extracts).
 */
import { createHash } from 'node:crypto';
import { SS1_CLASS_NAME, SS1_SCHOOL_CODE, SS1_SUPPLEMENT_DIR, SS1_SUPPLEMENT_MARKER } from './constants.js';

export const sha256Hex = (data: string | Uint8Array): string =>
  createHash('sha256').update(typeof data === 'string' ? Buffer.from(data, 'utf8') : data).digest('hex');

export const rawBodyHash = (storedText: string): string => sha256Hex(storedText);

export const normalizeBodyText = (s: string): string => s.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
export const normalizedBodyHash = (s: string): string => sha256Hex(normalizeBodyText(s));

/** Whitespace/case-insensitive title comparison key (same idea as the JSS3 resolver's `norm`). */
export const normalizeTitle = (s: unknown): string => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

/** Canonical week label: "WEEK 3", "Week: Three", "week 9 and 10" => "3", "3", "9&10". */
const WORD_TO_NUMBER: Record<string, string> = {
  one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7',
  eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13',
};
export function canonicalWeekLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/^\s*(?:week|ose)\s*[:.\-]*\s*/i, '')
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen)\b/g, w => WORD_TO_NUMBER[w])
    .replace(/\band\b/g, '&')
    .replace(/[\s,]+/g, '')
    .replace(/-/g, '&');
}

/** Deterministic JSON: object keys sorted, arrays keep order, strings NFC. No undefined. */
export function canonicalJson(value: unknown): string {
  const walk = (v: unknown): unknown => {
    if (v === null || typeof v === 'number' || typeof v === 'boolean') return v;
    if (typeof v === 'string') return v.normalize('NFC');
    if (Array.isArray(v)) return v.map(walk);
    if (typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(v as Record<string, unknown>).sort()) {
        const x = (v as Record<string, unknown>)[k];
        if (x !== undefined) out[k] = walk(x);
      }
      return out;
    }
    throw new Error(`canonicalJson: unsupported value of type ${typeof v}`);
  };
  return JSON.stringify(walk(value));
}

export interface LessonHashInput {
  title: string;
  objectives: readonly string[];
  body: string;
  practice: ReadonlyArray<{ id: string; prompt: string; answer: string; marking: string }>;
}
export const lessonContentHash = (l: LessonHashInput): string =>
  sha256Hex(canonicalJson({ title: l.title, objectives: l.objectives, body: l.body, practice: l.practice }));

/** DB topic identity (existing UNIQUE constraint `topics_ingestion_dedupe`): never hard-code a topic id. */
export interface TopicIdentity { schoolCode: string; className: string; subjectName: string; termLabel: string; orderIndex: number }
export const topicIdentityKey = (t: TopicIdentity): string =>
  JSON.stringify([t.schoolCode, t.className, t.subjectName, t.termLabel, t.orderIndex]);
export const ss1TopicIdentityKey = (subjectName: string, termLabel: string, orderIndex: number): string =>
  topicIdentityKey({ schoolCode: SS1_SCHOOL_CODE, className: SS1_CLASS_NAME, subjectName, termLabel, orderIndex });

/** Stable lookup key for a supplement row after import: `topics.source_file` is `<LESSON_ID>.json`. */
export const supplementSourceFile = (lessonId: string): string => `${lessonId}.json`;
export const supplementFilePath = (root: string, lessonId: string): string =>
  `${root.replace(/[\\/]+$/, '')}/${SS1_SUPPLEMENT_DIR}/${supplementSourceFile(lessonId)}`;

/** An asset row's DB identity is (topic, asset_key); the plan identity adds its binding so a moved index cannot re-bind it. */
export const assetPlanKey = (assetKey: string, binding: { kind: string; ref: string }): string =>
  JSON.stringify([assetKey, binding.kind, binding.ref]);

export const LESSON_ID_RE = /^SUP-SS1-([A-Z0-9]+)-(\d{3,4})$/;
export const SOURCE_ID_RE = /^SS1-SRC-[0-9a-f]{12}$/;
export const SHA256_RE = /^[0-9a-f]{64}$/;

export interface SupplementTextInput {
  id: string; title: string; termLabel: string; subjectName: string;
  objectives: readonly string[]; body: string;
  practice: ReadonlyArray<{ id: string; prompt: string; answer: string; marking: string }>;
  originStatement: string;
  references: ReadonlyArray<{ title: string; url: string }>;
  credits: ReadonlyArray<string>;
}
/** The exact text stored in `topics.source_reference` for an SS1 supplement (deterministic). */
export function ss1SupplementReference(l: SupplementTextInput): string {
  const lines: string[] = [];
  lines.push(`${SS1_SUPPLEMENT_MARKER} ${l.id}`);
  lines.push(l.title);
  lines.push(`Class: ${SS1_CLASS_NAME} | Term: ${l.termLabel} | Subject: ${l.subjectName}`);
  lines.push('', 'Learning objectives:');
  l.objectives.forEach((o, i) => lines.push(`${i + 1}. ${o}`));
  lines.push('', l.body.trim());
  lines.push('', 'Practice questions:');
  l.practice.forEach((p, i) => lines.push(`${i + 1}. ${p.prompt}`));
  lines.push('', 'Answers and marking guide:');
  l.practice.forEach((p, i) => lines.push(`${i + 1}. ${p.answer} — Marking: ${p.marking}`));
  lines.push('', `Origin: ${l.originStatement}`);
  if (l.references.length) {
    lines.push('', 'References:');
    l.references.forEach(r => lines.push(`${r.title}: ${r.url}`));
  }
  if (l.credits.length) {
    lines.push('', 'Credits:');
    l.credits.forEach(c => lines.push(c));
  }
  return lines.join('\n');
}
