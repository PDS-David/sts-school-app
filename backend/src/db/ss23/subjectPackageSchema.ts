import { createHash } from 'node:crypto';
import { z } from 'zod';

export const VERSION = 'ss23-subject-v1' as const;
export const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const term = z.enum(['1st Term', '2nd Term', '3rd Term']);
export const examBoard = z.enum(['WAEC', 'NECO', 'JAMB', 'CROSS_BOARD']);
const text = z.string().min(1).refine(value => value.trim().length > 0, 'Must contain non-whitespace text');
const substantiveText = z.string().min(500).refine(value => value.trim().length >= 500, 'Lesson body must contain at least 500 non-whitespace characters');
const evidence = z.object({ locator: text, explanation: text }).strict();
const state = z.object({
  content_approval: z.enum(['PENDING', 'APPROVED']),
  approval_reference: text.nullable(),
  implementation: z.enum(['DRAFT', 'IMPLEMENTED']),
  verification: z.enum(['DEFERRED', 'VERIFIED']),
  verification_reference: text.nullable(),
}).strict().superRefine((value, ctx) => {
  if (value.content_approval === 'APPROVED' && !value.approval_reference?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Approved content requires a real approval reference', path: ['approval_reference'] });
  }
  if (value.verification === 'VERIFIED' && !value.verification_reference?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Verified content requires a verification reference', path: ['verification_reference'] });
  }
  if (value.verification === 'DEFERRED' && value.verification_reference !== null) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Deferred verification cannot claim a verification reference', path: ['verification_reference'] });
  }
  if (value.verification === 'VERIFIED' &&
      (value.content_approval !== 'APPROVED' || value.implementation !== 'IMPLEMENTED')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Verified content must also be approved and implemented' });
  }
});
const provenance = z.object({
  source_id: z.string().regex(/^SS23-(?:SRC|EXT)-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/),
  source_sha256: digest,
  role: z.enum(['ORIGINAL_SOURCE', 'AUTHORED_SUPPLEMENT']),
  locator: text,
  rights: text,
  attribution: text,
  reuse_status: z.enum(['PERMITTED', 'PENDING']),
}).strict();

const markingCriterion = z.object({ criterion: text, marks: z.number().int().positive() }).strict();
export const practiceSchema = z.object({
  id: text,
  question: text,
  options: z.array(text).min(2).optional(),
  answer: text,
  explanation: z.string().min(30).refine(value => value.trim().length >= 30, 'A substantive answer explanation is required'),
  marks: z.number().int().positive(),
  marking: z.array(markingCriterion).min(1),
}).strict().superRefine((question, ctx) => {
  const awarded = question.marking.reduce((sum, item) => sum + item.marks, 0);
  if (awarded !== question.marks) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Marking criteria total ${awarded}, expected ${question.marks}`, path: ['marking'] });
  }
});

const sourceId = z.string().regex(/^SS23-SRC-[a-f0-9]{12}$/);
const externalSourceId = z.string().regex(/^SS23-EXT-[A-Z0-9]+(?:-[A-Z0-9]+)*$/);
export const sourceSchema = z.object({
  source_id: sourceId,
  sha256: digest,
  bytes: z.number().int().positive(),
  archive_member: text,
  class_name: z.enum(['SS 2', 'SS 3']),
  term,
  canonical_subject: text,
  header_text: text,
  header_evidence: evidence,
  rights: text,
  attribution: text,
  reuse_status: z.enum(['PERMITTED', 'PENDING']),
}).strict();

const externalSourceBaseSchema = z.object({
  source_id: externalSourceId,
  sha256: digest,
  class_name: z.enum(['SS 2', 'SS 3']),
  term,
  canonical_subject: text,
  title: text,
  url: z.string().url(),
  content: text,
  evidence,
  rights: text,
  attribution: text,
  reuse_status: z.enum(['PERMITTED', 'PENDING']),
}).strict();

export const externalSourceSchema = externalSourceBaseSchema.superRefine((source, ctx) => {
  if (sha256(source.content) !== source.sha256) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'External source content hash mismatch', path: ['sha256'] });
  }
});

const ruleBase = { id: text, source_id: sourceId, source_sha256: digest, anchor: text, evidence };
export const sourceRuleSchema = z.discriminatedUnion('op', [
  z.object({ ...ruleBase, op: z.literal('split_before'), week_label: text }).strict(),
  z.object({ ...ruleBase, op: z.literal('attach_stranded_label'), week_label: text, following_anchor: text }).strict(),
  z.object({ ...ruleBase, op: z.literal('classify_marker'), kind: z.enum(['REVISION', 'EXAMINATION', 'SCHEME_ONLY']), match_mode: z.enum(['SUBSTRING', 'WHOLE_LINE']).optional() }).strict(),
  z.object({ ...ruleBase, op: z.literal('source_alias'), observed_subject: text, canonical_subject: text, approval_reference: text }).strict(),
  z.object({ ...ruleBase, op: z.literal('exclude_duplicate'), target_source_id: sourceId, target_sha256: digest }).strict(),
]);

const unitBase = {
  term,
  subject: text,
  title: text,
  week_label: z.string().regex(/^[0-9]{1,2}(?:\s*(?:-|&|and)\s*[0-9]{1,2})?$/),
  objectives: z.array(text).min(2),
  body: substantiveText,
  body_sha256: digest,
  practice: z.array(practiceSchema).min(2),
  provenance: z.array(provenance).min(1),
  state,
};

export const ss2UnitSchema = z.object({
  id: z.string().regex(/^SUP-SS2-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  class_name: z.literal('SS 2'),
  delivery_mode: z.literal('INSTRUCTIONAL'),
  unit_type: z.literal('LESSON'),
  ...unitBase,
}).strict();

export const ss3UnitSchema = z.object({
  id: z.string().regex(/^PREP-SS3-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  class_name: z.literal('SS 3'),
  delivery_mode: z.literal('EXAM_PREPARATION'),
  unit_type: z.enum(['REVISION_UNIT', 'PRACTICAL_GUIDE', 'PAST_QUESTION_SET', 'MOCK_EXAM', 'EXAM_STRATEGY']),
  term: z.enum(['1st Term', '2nd Term']),
  exam_targets: z.array(examBoard).min(1),
  subject: text,
  title: text,
  week_label: z.string().regex(/^[0-9]{1,2}(?:\s*(?:-|&|and)\s*[0-9]{1,2})?$/),
  objectives: z.array(text).min(2),
  body: substantiveText,
  body_sha256: digest,
  practice: z.array(practiceSchema).min(2),
  provenance: z.array(provenance).min(1),
  state,
}).strict();

const assetSchema = z.object({
  id: text,
  unit_id: text,
  path: text,
  sha256: digest,
  bytes: z.number().int().positive(),
  media_type: z.enum(['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'application/pdf', 'audio/mpeg', 'audio/wav']),
  alt: text,
  order: z.number().int().nonnegative(),
  source_locator: text,
  provenance: provenance,
  state,
}).strict();

const coverageSchema = z.object({
  id: text,
  source_id: z.string().regex(/^SS23-(?:SRC|EXT)-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/),
  objective: text,
  objective_locator: text,
  status: z.enum(['SUPPORTED', 'IMPLEMENTED_EQUIVALENT', 'PARTIAL', 'UNRESOLVED', 'MARKER']),
  unit_ids: z.array(text),
  evidence: z.array(evidence),
}).strict();

const openItemSchema = z.object({
  id: text,
  kind: z.enum(['CONTENT', 'FACT', 'PERMISSION', 'OWNER_ACTION', 'VERIFICATION', 'VISUAL']).nullable().optional(),
  detail: text,
  required_action: text,
  affected_ids: z.array(text).min(1),
  blocks_delivery: z.boolean(),
}).strict();

const commonFields = {
  schema_version: z.literal(VERSION),
  subject_slug: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
  canonical_subject: text,
  package_status: z.enum(['PENDING', 'IMPLEMENTED']),
  sources: z.array(sourceSchema).min(1),
  external_sources: z.array(externalSourceSchema),
  source_rules: z.array(sourceRuleSchema),
  assets: z.array(assetSchema),
  coverage: z.array(coverageSchema).min(1),
  open_items: z.array(openItemSchema),
};

function validateReferences(pkg: {
  canonical_subject: string;
  sources: z.infer<typeof sourceSchema>[];
  external_sources: z.infer<typeof externalSourceSchema>[];
  source_rules: z.infer<typeof sourceRuleSchema>[];
  assets: z.infer<typeof assetSchema>[];
  coverage: z.infer<typeof coverageSchema>[];
  open_items: z.infer<typeof openItemSchema>[];
  units: Array<z.infer<typeof ss2UnitSchema> | z.infer<typeof ss3UnitSchema>>;
}, ctx: z.RefinementCtx) {
  const issue = (message: string, path: (string | number)[]) =>
    ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });
  const original = new Map(pkg.sources.map(source => [source.source_id, source]));
  const all = new Map<string, { sha256: string; class_name: string; term: string; canonical_subject: string }>();
  const allSourceIds = [...pkg.sources.map(source => source.source_id), ...pkg.external_sources.map(source => source.source_id)];
  if (new Set(allSourceIds).size !== allSourceIds.length) issue('Duplicate source IDs', ['sources']);
  for (const source of [...pkg.sources, ...pkg.external_sources]) {
    if (source.canonical_subject !== pkg.canonical_subject) issue('Source canonical subject does not match package', ['sources', source.source_id]);
    if (source.source_id.startsWith('SS23-SRC-') && source.source_id !== `SS23-SRC-${source.sha256.slice(0, 12)}`) issue('Original source ID is not derived from its SHA-256', ['sources', source.source_id]);
  }
  for (const source of pkg.sources) all.set(source.source_id, source);
  for (const source of pkg.external_sources) all.set(source.source_id, source);

  for (const rule of pkg.source_rules) {
    const source = original.get(rule.source_id);
    if (!source || source.sha256 !== rule.source_sha256) issue(`Source rule ${rule.id} is not bound to its original source hash`, ['source_rules', rule.id]);
  }
  const unitIds = new Set(pkg.units.map(unit => unit.id));
  if (unitIds.size !== pkg.units.length) issue('Duplicate unit IDs', ['units']);
  if (new Set(pkg.source_rules.map(rule => rule.id)).size !== pkg.source_rules.length) issue('Duplicate source-rule IDs', ['source_rules']);
  if (new Set(pkg.coverage.map(row => row.id)).size !== pkg.coverage.length) issue('Duplicate coverage IDs', ['coverage']);
  if (new Set(pkg.assets.map(asset => asset.id)).size !== pkg.assets.length) issue('Duplicate asset IDs', ['assets']);
  for (const [index, unit] of pkg.units.entries()) {
    if (unit.subject !== pkg.canonical_subject) issue('Unit subject does not match package subject', ['units', index, 'subject']);
    if (sha256(unit.body) !== unit.body_sha256) issue('Unit body hash mismatch', ['units', index, 'body_sha256']);
    for (const [pIndex, ref] of unit.provenance.entries()) {
      const source = all.get(ref.source_id);
      if (!source || source.sha256 !== ref.source_sha256) issue('Unit provenance source/hash is missing or mismatched', ['units', index, 'provenance', pIndex]);
      else {
        if (source.class_name !== unit.class_name || source.term !== unit.term) issue('Unit provenance class/term does not match unit', ['units', index, 'provenance', pIndex]);
        if (ref.role === 'ORIGINAL_SOURCE' && !ref.source_id.startsWith('SS23-SRC-')) issue('Original-source provenance must reference SS23-SRC', ['units', index, 'provenance', pIndex, 'role']);
        if (ref.role === 'AUTHORED_SUPPLEMENT' && !ref.source_id.startsWith('SS23-EXT-')) issue('Authored supplements must reference SS23-EXT', ['units', index, 'provenance', pIndex, 'role']);
      }
    }
  }
  for (const [index, asset] of pkg.assets.entries()) {
    if (!unitIds.has(asset.unit_id)) issue('Asset references an unknown unit', ['assets', index, 'unit_id']);
    const source = all.get(asset.provenance.source_id);
    if (!source || source.sha256 !== asset.provenance.source_sha256) issue('Asset provenance source/hash is missing or mismatched', ['assets', index, 'provenance']);
    const unit = pkg.units.find(candidate => candidate.id === asset.unit_id);
    if (source && unit && (source.class_name !== unit.class_name || source.term !== unit.term)) issue('Asset provenance class/term does not match its unit', ['assets', index, 'provenance']);
    if (asset.provenance.role === 'ORIGINAL_SOURCE' && !asset.provenance.source_id.startsWith('SS23-SRC-')) issue('Original asset provenance must reference SS23-SRC', ['assets', index, 'provenance', 'role']);
    if (asset.provenance.role === 'AUTHORED_SUPPLEMENT' && !asset.provenance.source_id.startsWith('SS23-EXT-')) issue('Supplementary asset provenance must reference SS23-EXT', ['assets', index, 'provenance', 'role']);
  }
  for (const source of pkg.sources) {
    if (!pkg.coverage.some(row => row.source_id === source.source_id)) issue('Every original source requires an explicit coverage disposition', ['coverage', source.source_id]);
  }
  for (const source of pkg.external_sources) {
    if (!pkg.coverage.some(row => row.source_id === source.source_id)) issue('Every external source requires an explicit coverage disposition', ['coverage', source.source_id]);
  }
  for (const [index, row] of pkg.coverage.entries()) {
    if (!all.has(row.source_id)) issue('Coverage references an unknown source', ['coverage', index, 'source_id']);
    if (['SUPPORTED', 'IMPLEMENTED_EQUIVALENT'].includes(row.status) && row.unit_ids.length === 0) issue('Supported coverage must link to at least one delivered unit', ['coverage', index, 'unit_ids']);
    for (const id of row.unit_ids) if (!unitIds.has(id)) issue('Coverage references an unknown unit', ['coverage', index, 'unit_ids']);
  }
  const openIds = pkg.open_items.map(item => item.id);
  if (new Set(openIds).size !== openIds.length) issue('Duplicate open-item IDs', ['open_items']);
}

export const ss2PackageSchema = z.object({
  ...commonFields,
  class_name: z.literal('SS 2'),
  delivery_mode: z.literal('INSTRUCTIONAL'),
  units: z.array(ss2UnitSchema).min(1),
}).strict().superRefine((pkg, ctx) => {
  if (pkg.sources.some(source => source.class_name !== 'SS 2')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'SS2 package cannot include non-SS2 original sources', path: ['sources'] });
  }
  if (pkg.external_sources.some(source => source.class_name !== 'SS 2')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'SS2 package cannot include non-SS2 external sources', path: ['external_sources'] });
  }
  validateReferences(pkg, ctx);
});

export const ss3PackageSchema = z.object({
  ...commonFields,
  class_name: z.literal('SS 3'),
  delivery_mode: z.literal('EXAM_PREPARATION'),
  sources: z.array(sourceSchema.extend({ class_name: z.literal('SS 3'), term: z.enum(['1st Term', '2nd Term']) })).min(1),
  external_sources: z.array(externalSourceBaseSchema.extend({ class_name: z.literal('SS 3'), term: z.enum(['1st Term', '2nd Term']) }).superRefine((source, ctx) => {
    if (sha256(source.content) !== source.sha256) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'External source content hash mismatch', path: ['sha256'] });
  })),
  units: z.array(ss3UnitSchema).min(1),
}).strict().superRefine((pkg, ctx) => {
  // SS3 source and unit schemas expose only first and second terms.
  validateReferences(pkg, ctx);
});

export const packageSchema = z.union([ss2PackageSchema, ss3PackageSchema]);
export type Ss23Package = z.infer<typeof packageSchema>;
export type Ss23SourceRule = z.infer<typeof sourceRuleSchema>;

export function sha256(value: string | Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}
