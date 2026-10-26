import { z } from 'zod';
export const VERSION = 'ss1-subject-v1' as const;
export const digest = z.string().regex(/^[a-f0-9]{64}$/);
// Validate without normalizing source anchors, lesson bodies or spelling.
const text = z.string().min(1).refine(value => value.trim().length > 0, 'Must contain non-whitespace text');
export const term = z.enum(['1st Term', '2nd Term', '3rd Term']);
const evidence = z.object({ locator: text, explanation: text }).strict();
const provenance = z.object({ title: text, locator: text, url: z.string().url().nullable(), rights: text, reuse_status: z.enum(['PERMITTED', 'PENDING']), attribution: text }).strict();
const state = z.object({ content_approval: z.enum(['PENDING', 'APPROVED']), approval_reference: text.nullable(), implementation: z.enum(['DRAFT', 'IMPLEMENTED']), verification: z.enum(['DEFERRED', 'VERIFIED']), verification_reference: text.nullable() }).strict();
export const sourceSchema = z.object({ source_id: text, sha256: digest, archive_member: text, class_name: z.literal('SS 1'), term: term, canonical_subject: text, header_text: text, header_evidence: evidence }).strict();
const ruleBase = { id: text, source_id: text, source_sha256: digest, anchor: text, evidence };
export const ruleSchema = z.discriminatedUnion('op', [
  z.object({ ...ruleBase, op: z.literal('split_before'), week_label: text }).strict(),
  z.object({ ...ruleBase, op: z.literal('attach_stranded_label'), week_label: text, following_anchor: text }).strict(),
  z.object({ ...ruleBase, op: z.literal('classify_marker'), kind: z.enum(['REVISION', 'EXAMINATION', 'SCHEME_ONLY']) }).strict(),
  z.object({ ...ruleBase, op: z.literal('source_alias'), observed_subject: text, canonical_subject: text, approval_reference: text }).strict(),
  z.object({ ...ruleBase, op: z.literal('exclude_duplicate'), target_source_id: text, target_sha256: digest }).strict(),
]);
export const lessonSchema = z.object({ id: z.string().regex(/^SUP-SS1-[A-Z0-9]+(?:-[A-Z0-9]+)*$/), class_name: z.literal('SS 1'), term, subject: text, title: text, objectives: z.array(text).min(1), body: text, body_sha256: digest, practice: z.array(z.object({ id: text, question: text, answer: text, marks: z.number().int().positive(), marking: z.array(z.object({ criterion: text, marks: z.number().int().positive() }).strict()).min(1) }).strict()).min(1), provenance: z.array(provenance).min(1), state }).strict();
export const correctionSchema = z.object({ id: text, source_id: text, source_sha256: digest, source_lesson_id: text, body_sha256: digest, replacement_id: text, reason: text, evidence }).strict();
export const assetSchema = z.object({ id: text, lesson_id: text, path: text, sha256: digest, bytes: z.number().int().positive(), media_type: z.enum(['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'application/pdf', 'audio/mpeg', 'audio/wav']), alt: text, order: z.number().int().nonnegative(), source_locator: text, provenance, state }).strict();
export const coverageSchema = z.object({ id: text, source_id: text, objective: text, objective_locator: text, status: z.enum(['SUPPORTED', 'IMPLEMENTED_EQUIVALENT', 'PARTIAL', 'UNRESOLVED', 'MARKER']), lesson_ids: z.array(text), evidence: z.array(evidence) }).strict();
export const packageSchema = z.object({ schema_version: z.literal(VERSION), subject_slug: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/), canonical_subject: text, package_status: z.enum(['PENDING', 'IMPLEMENTED']), sources: z.array(sourceSchema), source_rules: z.array(ruleSchema), lessons: z.array(lessonSchema), delivery_corrections: z.array(correctionSchema), assets: z.array(assetSchema), coverage: z.array(coverageSchema), open_items: z.array(z.object({ id: text, kind: z.enum(['CONTENT', 'FACT', 'PERMISSION', 'OWNER_ACTION', 'VERIFICATION']), detail: text, required_action: text, affected_ids: z.array(text).min(1), blocks_delivery: z.boolean() }).strict()) }).strict();
export type SubjectPackage = z.infer<typeof packageSchema>;
export type SourceRule = z.infer<typeof ruleSchema>;
