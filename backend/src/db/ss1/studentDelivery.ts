import { createHash } from 'node:crypto';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPackages } from './loader.js';
import type { SubjectPackage } from './subjectPackageSchema.js';

export type StudentSs1Lesson = SubjectPackage['lessons'][number] & {
  subject_slug: string;
  canonical_subject: string;
  package_status: SubjectPackage['package_status'];
  classroom_verification_pending: boolean;
};

const packages = loadPackages();
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(moduleDir, '../../../..');
const normalize = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');

function isStudentDeliverable(lesson: SubjectPackage['lessons'][number]): boolean {
  const state = lesson.state;
  const verificationHasEvidence = state.verification === 'VERIFIED'
    ? Boolean(state.verification_reference?.trim())
    : state.verification === 'DEFERRED' && state.verification_reference === null;
  return state.content_approval === 'APPROVED' &&
    Boolean(state.approval_reference?.trim()) &&
    state.implementation === 'IMPLEMENTED' &&
    verificationHasEvidence &&
    lesson.provenance.length > 0 &&
    lesson.provenance.every(source => source.reuse_status === 'PERMITTED');
}

/**
 * Deliver only lessons from packages explicitly marked IMPLEMENTED with no
 * delivery-blocking open items. A lesson whose classroom verification is
 * DEFERRED remains visibly flagged; it is never represented as verified.
 */
export function listStudentSs1Lessons(subjectName?: string): StudentSs1Lesson[] {
  const expectedSubject = subjectName ? normalize(subjectName) : null;
  return packages.flatMap(subjectPackage => {
    if (subjectPackage.package_status !== 'IMPLEMENTED' ||
        subjectPackage.open_items.some(item => item.blocks_delivery)) return [];
    if (expectedSubject && normalize(subjectPackage.canonical_subject) !== expectedSubject) return [];
    return subjectPackage.lessons.filter(isStudentDeliverable).map(lesson => ({
      ...lesson,
      subject_slug: subjectPackage.subject_slug,
      canonical_subject: subjectPackage.canonical_subject,
      package_status: subjectPackage.package_status,
      classroom_verification_pending: lesson.state.verification === 'DEFERRED',
    }));
  });
}

export function getStudentSs1Lesson(lessonId: string): StudentSs1Lesson | null {
  return listStudentSs1Lessons().find(lesson => lesson.id === lessonId) ?? null;
}

export function isStudentDeliverableSs1Lesson(lesson: SubjectPackage['lessons'][number]): boolean {
  return isStudentDeliverable(lesson);
}

export interface StudentSs1Asset {
  id: string;
  lesson_id: string;
  term: string;
  path: string;
  sha256: string;
  bytes: number;
  media_type: string;
  alt: string;
  order: number;
}

function isStudentDeliverableAsset(asset: SubjectPackage['assets'][number]): boolean {
  return asset.state.content_approval === 'APPROVED' &&
    Boolean(asset.state.approval_reference?.trim()) &&
    asset.state.implementation === 'IMPLEMENTED' &&
    asset.state.verification === 'VERIFIED' &&
    Boolean(asset.state.verification_reference?.trim()) &&
    asset.provenance.reuse_status === 'PERMITTED';
}

export function listStudentSs1Assets(lessonId: string): StudentSs1Asset[] {
  const lesson = getStudentSs1Lesson(lessonId);
  if (!lesson) return [];
  const subjectPackage = packages.find(item => item.subject_slug === lesson.subject_slug);
  if (!subjectPackage) return [];
  return subjectPackage.assets
    .filter(asset => asset.lesson_id === lessonId && isStudentDeliverableAsset(asset))
    .sort((a, b) => a.order - b.order)
    .map(asset => ({ ...asset, term: lesson.term }));
}

export function readStudentSs1Asset(assetId: string): { asset: StudentSs1Asset; bytes: Buffer } | null {
  for (const lesson of listStudentSs1Lessons()) {
    const asset = listStudentSs1Assets(lesson.id).find(item => item.id === assetId);
    if (!asset) continue;
    const file = path.resolve(repositoryRoot, asset.path);
    const relative = path.relative(repositoryRoot, file);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || !existsSync(file)) {
      throw new Error(`SS1 asset path is missing or escapes repository: ${asset.id}`);
    }
    const real = realpathSync(file);
    if (!real.startsWith(repositoryRoot + path.sep) || !statSync(real).isFile()) {
      throw new Error(`SS1 asset path is unsafe: ${asset.id}`);
    }
    const bytes = readFileSync(real);
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (bytes.length !== asset.bytes || digest !== asset.sha256) {
      throw new Error(`SS1 asset integrity mismatch: ${asset.id}`);
    }
    return { asset, bytes };
  }
  return null;
}
