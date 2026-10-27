/**
 * SS1 subject package schema — contract `ss1-subject-v1` (FROZEN).
 *
 * One package per subject at `backend/src/db/ss1/subjects/<slug>.json`. Workers own their package file only.
 * Packages are DATA: no executable code, no free-form keys (every object is `.strict()`).
 * A new rule/operation/field requires the foundation owner (see docs/ss1/contracts/CONTRACT.md "Escalation").
 *
 * Status axes are separate on purpose:
 *   implementation  — did the worker build it?            (PENDING | IN_PROGRESS | IMPLEMENTED | BLOCKED)
 *   content_approval— did the school/teacher approve it?   (NOT_REQUESTED | PENDING | APPROVED | REJECTED)
 *   verification    — did the later test phase pass it?    (NOT_RUN | PASSED | FAILED)  [set only by SS1-09]
 */
import { z } from 'zod';
import { SS1_CLASS_NAME, SS1_CONTRACT_VERSION, SS1_TERMS } from './constants.js';
import { LESSON_ID_RE, SHA256_RE, SOURCE_ID_RE } from './identity.js';

const termEnum = z.enum(SS1_TERMS);
const sha = z.string().regex(SHA256_RE, 'must be lower-case hex sha256');
const sourceId = z.string().regex(SOURCE_ID_RE, 'must be a manifest source_id (SS1-SRC-<12 hex>)');
const lessonId = z.string().regex(LESSON_ID_RE, 'must be SUP-SS1-<SUBJECT>-NNN');
const text = (min: number) => z.string().min(min).refine(s => s.trim().length >= min, 'blank text');
/** Exact anchors must be long enough to be meaningful and must match exactly once. */
const anchor = z.string().min(8);
const weekLabel = z.string().min(1);
const httpsUrl = z.string().url().startsWith('https://');
const relPath = z.string().min(1).refine(
  p => !p.startsWith('/') && !p.includes('\\') && !p.split('/').some(seg => seg === '..' || seg === '' || seg === '.'),
  'must be a relative, traversal-free POSIX path',
);

// ── package_status ─────────────────────────────────────────────────────────
export const packageStatusSchema = z.object({
  implementation: z.enum(['PENDING', 'IN_PROGRESS', 'IMPLEMENTED', 'BLOCKED']),
  content_approval: z.enum(['NOT_REQUESTED', 'PENDING', 'APPROVED', 'REJECTED']),
  verification: z.enum(['NOT_RUN', 'PASSED', 'FAILED']),
  updated_by: text(2),
  note: z.string().optional(),
}).strict();

// ── sources ────────────────────────────────────────────────────────────────
export const evidenceLocatorSchema = z.object({
  kind: z.enum(['HEADER', 'WEEK_LABEL', 'SECTION', 'LINE_RANGE']),
  value: text(1),
}).strict();

export const sourceSchema = z.object({
  source_id: sourceId,
  sha256: sha,
  archive_member: text(5),
  class_name: z.literal(SS1_CLASS_NAME),
  term_label: termEnum,
  canonical_subject: text(3),
  /** Verbatim text of the document's own subject header (source spelling preserved), or null if the document has none. */
  document_header_subject: z.string().nullable(),
  /** True only after the worker compared the real header/content with the filename-based manifest assignment. */
  assignment_confirmed: z.boolean(),
  role: z.enum(['PRIMARY', 'DUPLICATE_PROVEN', 'CROSS_SUBJECT_HANDOFF']),
  /** Required when role is CROSS_SUBJECT_HANDOFF: the slug that should own the misfiled material. Never silent deletion. */
  handoff_to_slug: z.string().optional(),
  evidence_locator: evidenceLocatorSchema,
}).strict().superRefine((s, ctx) => {
  if (s.role === 'CROSS_SUBJECT_HANDOFF' && !s.handoff_to_slug) ctx.addIssue({ code: 'custom', message: 'CROSS_SUBJECT_HANDOFF needs handoff_to_slug' });
});

// ── source_rules (constrained operation vocabulary) ───────────────────────
const ruleBase = {
  rule_id: z.string().regex(/^[A-Z0-9]+(?:-[A-Z0-9]+)*-R\d{2,3}$/, 'rule_id like CHEM-R01'),
  source_id: sourceId,
  source_sha256: sha,
  reason: text(15),
};
export const markerClassification = z.enum(['SCHEME_ONLY', 'EVALUATION_ONLY', 'HEADING_ONLY', 'EXAM_OR_REVISION_MARKER']);

export const sourceRuleSchema = z.discriminatedUnion('op', [
  z.object({
    ...ruleBase, op: z.literal('split_before_anchor'),
    week_label: weekLabel, anchor, new_title: z.string().min(3).max(200).optional(),
  }).strict(),
  z.object({
    ...ruleBase, op: z.literal('attach_stranded_label'),
    week_label: weekLabel,
    /** The stranded label text; after removing the week marker the topic body must equal this exactly. */
    label_anchor: anchor,
    direction: z.enum(['NEXT', 'PREVIOUS']),
    use_label_as_title: z.boolean().default(false),
  }).strict(),
  z.object({
    ...ruleBase, op: z.literal('classify_marker'),
    week_label: weekLabel, anchor, classification: markerClassification,
  }).strict(),
  z.object({
    ...ruleBase, op: z.literal('explicit_source_alias'),
    /** The subject name the generic importer inferred (e.g. "Computer Studies"). */
    inferred_subject: text(3),
    canonical_subject: text(3),
    /** Where in the real document the owner/worker saw the proof (header text). */
    header_evidence: text(8),
  }).strict(),
  z.object({
    ...ruleBase, op: z.literal('exclude_proven_duplicate'),
    week_label: weekLabel, anchor,
    normalized_body_sha256: sha,
    duplicate_of: z.object({
      source_id: sourceId, week_label: weekLabel, normalized_body_sha256: sha,
    }).strict(),
  }).strict(),
]);

// ── lessons ────────────────────────────────────────────────────────────────
export const practiceItemSchema = z.object({
  id: z.string().regex(/^Q\d{2,3}$/),
  prompt: text(8),
  answer: text(1),
  marking: text(5),
}).strict();

export const reuseRecordSchema = z.object({
  work: text(5),
  creators: text(2),
  url: httpsUrl.optional(),
  licence: text(2),
  licence_url: httpsUrl.optional(),
  permission: z.enum(['NOT_REUSED', 'PUBLIC_DOMAIN', 'OPEN_LICENCE', 'OWNER_PERMISSION']),
  required_credit: z.string().optional(),
  changes: z.string().optional(),
}).strict();

export const lessonSchema = z.object({
  id: lessonId,
  class_name: z.literal(SS1_CLASS_NAME),
  term_label: termEnum,
  canonical_subject: text(3),
  /** Position among this package's supplements in the same term (append-only after original rows). */
  sequence: z.number().int().min(1),
  title: z.string().min(5).max(200).refine(s => s.trim().length >= 5, 'blank text'),
  objectives: z.array(text(5)).min(1),
  body: text(300),
  practice: z.array(practiceItemSchema).min(1),
  covers_objectives: z.array(z.string().regex(/^[A-Z0-9][A-Z0-9-]{2,39}$/)).min(1),
  provenance: z.object({
    kind: z.enum(['SOURCE_DERIVED', 'AUTHORED_EQUIVALENT', 'ADAPTED_REFERENCE']),
    source_ids: z.array(sourceId),
    source_locators: z.array(z.object({ source_id: sourceId, week_label: weekLabel, anchor: z.string().optional() }).strict()),
    origin_statement: text(30),
  }).strict(),
  reuse: z.array(reuseRecordSchema),
  references: z.array(z.object({ title: text(3), url: httpsUrl }).strict()),
  content_hash: sha,
}).strict();

// ── delivery_corrections ──────────────────────────────────────────────────
export const deliveryCorrectionSchema = z.object({
  id: z.string().regex(/^DC-SS1-[A-Z0-9]+-\d{3}$/),
  source_id: sourceId,
  source_sha256: sha,
  class_name: z.literal(SS1_CLASS_NAME),
  term_label: termEnum,
  canonical_subject: text(3),
  source_title: text(3),
  source_week_label: weekLabel,
  /** Raw body hash of the stored original row (see identity.ts). A same-title row with another hash is never selected. */
  source_body_sha256: sha,
  previous_source_body_sha256: z.array(sha).optional(),
  replacement_lesson_ids: z.array(lessonId).min(1),
  severity: z.enum(['UNSAFE', 'INCORRECT', 'UNUSABLE', 'SUPERSEDED']),
  reason: text(20),
}).strict();

// ── assets ─────────────────────────────────────────────────────────────────
export const assetSchema = z.object({
  asset_key: z.string().regex(/^ss1-[a-z0-9-]+-[a-z0-9][a-z0-9._-]{2,100}$/, 'asset_key must start with ss1-<slug>-'),
  binding: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('SOURCE_LESSON'), source_id: sourceId, week_label: weekLabel, source_body_sha256: sha }).strict(),
    z.object({ kind: z.literal('SUPPLEMENT'), lesson_id: lessonId }).strict(),
  ]),
  /** Path inside the private asset directory (never in Git unless small and rights-cleared). */
  file: relPath,
  sha256: sha,
  bytes: z.number().int().positive(),
  media_type: z.enum(['image/png', 'image/jpeg', 'image/webp']),
  alt_text: text(15),
  caption: z.string().optional(),
  figure_order: z.number().int().min(1),
  displayed: z.boolean(),
  source_locator: text(5),
  rights: z.object({
    status: z.enum(['SOURCE_DOCUMENT', 'PUBLIC_DOMAIN', 'OPEN_LICENCE', 'OWNER_PERMISSION', 'UNRESOLVED']),
    statement: text(10),
    licence: z.string().optional(),
    licence_url: httpsUrl.optional(),
  }).strict(),
}).strict();

// ── coverage ───────────────────────────────────────────────────────────────
export const coverageEvidenceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('SOURCE_LESSON'), source_id: sourceId, week_label: weekLabel, anchor: z.string().optional() }).strict(),
  z.object({ kind: z.literal('SUPPLEMENT'), lesson_id: lessonId }).strict(),
]);
export const coverageStatus = z.enum(['SUPPORTED', 'IMPLEMENTED_EQUIVALENT', 'PARTIAL', 'UNRESOLVED', 'MARKER']);
export const coverageSchema = z.object({
  objective_id: z.string().regex(/^[A-Z0-9][A-Z0-9-]{2,39}$/),
  term_label: termEnum,
  objective_text: text(5),
  scheme_locator: z.object({ source_id: sourceId, week_label: weekLabel, anchor: z.string().optional() }).strict(),
  status: coverageStatus,
  evidence: z.array(coverageEvidenceSchema),
  open_item_ids: z.array(z.string()).default([]),
  note: z.string().optional(),
}).strict().superRefine((c, ctx) => {
  const src = c.evidence.filter(e => e.kind === 'SOURCE_LESSON').length;
  const sup = c.evidence.filter(e => e.kind === 'SUPPLEMENT').length;
  const need = (ok: boolean, msg: string) => { if (!ok) ctx.addIssue({ code: 'custom', message: msg }); };
  if (c.status === 'SUPPORTED') need(src > 0, 'SUPPORTED needs SOURCE_LESSON evidence (a title or overlap alone is not proof)');
  if (c.status === 'IMPLEMENTED_EQUIVALENT') need(sup > 0, 'IMPLEMENTED_EQUIVALENT needs SUPPLEMENT evidence');
  if (c.status === 'PARTIAL') need(c.evidence.length > 0 && c.open_item_ids.length > 0 && !!c.note, 'PARTIAL needs evidence, a note and open_item_ids');
  if (c.status === 'UNRESOLVED') need(c.open_item_ids.length > 0, 'UNRESOLVED needs open_item_ids');
  if (c.status === 'MARKER') need(src > 0, 'MARKER needs SOURCE_LESSON evidence (and a classify_marker rule is checked by the compiler)');
});

// ── open_items ─────────────────────────────────────────────────────────────
export const openItemSchema = z.object({
  id: z.string().regex(/^OI-[A-Z0-9]+-\d{3}$/),
  kind: z.enum(['MISSING_FACT', 'MISSING_MATERIAL', 'MISSING_PERMISSION', 'OWNER_ACTION', 'SUBJECT_MISMATCH', 'SOURCE_BYTES_DIFFER', 'OTHER']),
  description: text(20),
  owner_action: text(10),
  affected_ids: z.array(z.string().min(3)).min(1),
  blocks_student_delivery: z.boolean(),
  status: z.enum(['OPEN', 'RESOLVED']),
}).strict();

// ── package ────────────────────────────────────────────────────────────────
export const subjectPackageSchema = z.object({
  schema_version: z.literal(SS1_CONTRACT_VERSION),
  subject_slug: z.string().regex(/^[a-z][a-z0-9-]+$/),
  canonical_subject: text(3),
  package_status: packageStatusSchema,
  sources: z.array(sourceSchema),
  source_rules: z.array(sourceRuleSchema),
  lessons: z.array(lessonSchema),
  delivery_corrections: z.array(deliveryCorrectionSchema),
  assets: z.array(assetSchema),
  coverage: z.array(coverageSchema),
  open_items: z.array(openItemSchema),
}).strict();

export type Ss1PackageStatus = z.infer<typeof packageStatusSchema>;
export type Ss1Source = z.infer<typeof sourceSchema>;
export type Ss1SourceRule = z.infer<typeof sourceRuleSchema>;
export type Ss1Lesson = z.infer<typeof lessonSchema>;
export type Ss1DeliveryCorrection = z.infer<typeof deliveryCorrectionSchema>;
export type Ss1Asset = z.infer<typeof assetSchema>;
export type Ss1Coverage = z.infer<typeof coverageSchema>;
export type Ss1OpenItem = z.infer<typeof openItemSchema>;
export type Ss1SubjectPackage = z.infer<typeof subjectPackageSchema>;

/** Names of the constrained operations (documented in CONTRACT.md; anything else is rejected by the schema). */
export const SS1_RULE_OPS = [
  'split_before_anchor', 'attach_stranded_label', 'classify_marker', 'explicit_source_alias', 'exclude_proven_duplicate',
] as const;

/** Parse + validate one package. Throws a readable error naming the first failing paths. */
export function parseSubjectPackage(input: unknown, label = 'package'): Ss1SubjectPackage {
  const r = subjectPackageSchema.safeParse(input);
  if (!r.success) {
    const issues = r.error.issues.slice(0, 12).map(i => `  ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`SS1 ${label} failed schema ${SS1_CONTRACT_VERSION}:\n${issues}`);
  }
  return r.data;
}
