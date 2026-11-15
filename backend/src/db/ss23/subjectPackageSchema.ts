import { z } from 'zod';
import {
  assetSchema, correctionSchema, coverageSchema, digest, externalSchemeSourceSchema, lessonSchema,
  openItemSchema, ruleSchema, sourceSchema, term,
} from '../ss1/subjectPackageSchema.js';

/**
 * SS2 / SS3 subject packages. Extends the SS1 building blocks (rules, coverage, assets, corrections,
 * open items) and changes only what is class-specific: class name, source-id shape and lesson-id shape.
 * SS1 schemas are untouched, so SS1 validation cannot regress.
 */
export const SS23_VERSION = 'ss23-subject-v1' as const;
export const className = z.enum(['SS 2', 'SS 3']);
export type ClassName = z.infer<typeof className>;
/** SS23-SRC-<first 12 hex of sha256>; byte-identical twins get a -SS<n>T<n> suffix. */
export const SOURCE_ID = /^SS23-SRC-[a-f0-9]{12}(?:-SS[23]T[123])?$/;
const lessonId = /^SUP-SS[23]-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

export const ss23SourceSchema = sourceSchema.extend({ source_id: z.string().regex(SOURCE_ID), class_name: className });
export const ss23ExternalSourceSchema = externalSchemeSourceSchema.extend({
  source_id: z.string().regex(/^SS23-EXT-[A-Z0-9]+(?:-[A-Z0-9]+)*$/), class_name: className,
});
/** Lessons in a package are always authored supplements (SUP-); original source bodies are referenced as <source_id>:BODY:<sha>. */
export const ss23LessonSchema = lessonSchema.extend({ id: z.string().regex(lessonId), class_name: className });

export const ss23PackageSchema = z.object({
  schema_version: z.literal(SS23_VERSION),
  class_name: className,
  subject_slug: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
  canonical_subject: z.string().min(1),
  package_status: z.enum(['PENDING', 'IMPLEMENTED']),
  sources: z.array(ss23SourceSchema),
  external_sources: z.array(ss23ExternalSourceSchema),
  source_rules: z.array(ruleSchema),
  lessons: z.array(ss23LessonSchema),
  delivery_corrections: z.array(correctionSchema),
  assets: z.array(assetSchema),
  coverage: z.array(coverageSchema),
  open_items: z.array(openItemSchema),
}).strict();
export type Ss23Package = z.infer<typeof ss23PackageSchema>;

export const registryRowSchema = z.object({
  source_id: z.string().regex(SOURCE_ID), sha256: digest, bytes: z.number().int().positive(),
  archive_member: z.string().min(1), class_name: className, term, assigned_subject_slug: z.string().min(1),
  header_status: z.string().min(1), identical_to: z.array(z.string()),
}).strict();
export const registrySchema = z.array(registryRowSchema);
export type RegistryRow = z.infer<typeof registryRowSchema>;
