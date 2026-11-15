import { createHash } from 'node:crypto';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSs23Packages } from './loader.js';
import { packageSchema, type Ss23Package } from './subjectPackageSchema.js';

export type Ss23ClassName = 'SS 2' | 'SS 3';
type Ss23Unit = Ss23Package['units'][number];
type Ss23Asset = Ss23Package['assets'][number];

export type StudentSs23Unit = Ss23Unit & {
  subject_slug: string;
  canonical_subject: string;
  package_status: Ss23Package['package_status'];
};

export interface StudentSs23Asset {
  id: string;
  unit_id: string;
  class_name: Ss23ClassName;
  term: string;
  path: string;
  sha256: string;
  bytes: number;
  media_type: string;
  alt: string;
  order: number;
}

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepositoryRoot = path.resolve(moduleDir, '../../../..');
const normalize = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');

function isStudentDeliverableUnit(subjectPackage: Ss23Package, unit: Ss23Unit): boolean {
  const state = unit.state;
  const verificationHasEvidence = state.verification === 'VERIFIED' && Boolean(state.verification_reference?.trim());
  return subjectPackage.package_status === 'IMPLEMENTED' &&
    !subjectPackage.open_items.some(item => item.blocks_delivery) &&
    state.content_approval === 'APPROVED' &&
    Boolean(state.approval_reference?.trim()) &&
    state.implementation === 'IMPLEMENTED' &&
    verificationHasEvidence &&
    unit.provenance.length > 0 &&
    unit.provenance.every(source => source.reuse_status === 'PERMITTED') &&
    unit.practice.every(question =>
      question.provenance.length > 0 &&
      question.provenance.every(source => source.reuse_status === 'PERMITTED'),
    );
}

function isStudentDeliverableAsset(asset: Ss23Asset): boolean {
  return asset.state.content_approval === 'APPROVED' &&
    Boolean(asset.state.approval_reference?.trim()) &&
    asset.state.implementation === 'IMPLEMENTED' &&
    asset.state.verification === 'VERIFIED' &&
    Boolean(asset.state.verification_reference?.trim()) &&
    asset.provenance.reuse_status === 'PERMITTED';
}

function safeStudentUnit(unit: StudentSs23Unit) {
  return {
    id: unit.id,
    class_name: unit.class_name,
    delivery_mode: unit.delivery_mode,
    unit_type: unit.unit_type,
    term: unit.term,
    subject: unit.subject,
    title: unit.title,
    week_label: unit.week_label,
    objectives: unit.objectives,
    body: unit.body,
    // Student delivery intentionally omits model answers, explanations,
    // marking criteria and source-provenance records.
    practice: unit.practice.map(question => ({
      id: question.id,
      question: question.question,
      ...(question.options ? { options: question.options } : {}),
      marks: question.marks,
    })),
  };
}

export function studentSs23UnitPreview(unit: StudentSs23Unit, locked: boolean) {
  return {
    id: unit.id,
    title: unit.title,
    term: unit.term,
    week_label: unit.week_label,
    subject: unit.subject,
    subject_slug: unit.subject_slug,
    canonical_subject: unit.canonical_subject,
    class_name: unit.class_name,
    delivery_mode: unit.delivery_mode,
    unit_type: unit.unit_type,
    practice_count: unit.practice.length,
    locked,
  };
}

export function createSs23StudentDelivery(
  inputPackages: Ss23Package[] = loadSs23Packages(),
  repositoryRoot = defaultRepositoryRoot,
) {
  const packages = inputPackages.map(pkg => packageSchema.parse(pkg));

  function listUnits(className: Ss23ClassName, subjectName?: string): StudentSs23Unit[] {
    const expectedSubject = subjectName ? normalize(subjectName) : null;
    const expectedMode = className === 'SS 2' ? 'INSTRUCTIONAL' : 'EXAM_PREPARATION';
    return packages.flatMap(subjectPackage => {
      if (subjectPackage.class_name !== className ||
          subjectPackage.delivery_mode !== expectedMode ||
          subjectPackage.package_status !== 'IMPLEMENTED' ||
          subjectPackage.open_items.some(item => item.blocks_delivery)) return [];
      if (expectedSubject && normalize(subjectPackage.canonical_subject) !== expectedSubject) return [];
      return subjectPackage.units
        .filter(unit => unit.class_name === className &&
          unit.delivery_mode === expectedMode &&
          (className !== 'SS 3' || unit.term === '1st Term' || unit.term === '2nd Term') &&
          isStudentDeliverableUnit(subjectPackage, unit))
        .map(unit => ({
          ...unit,
          subject_slug: subjectPackage.subject_slug,
          canonical_subject: subjectPackage.canonical_subject,
          package_status: subjectPackage.package_status,
        }));
    });
  }

  function getUnit(unitId: string, className: Ss23ClassName): StudentSs23Unit | null {
    return listUnits(className).find(unit => unit.id === unitId) ?? null;
  }

  function listAssets(unitId: string, className: Ss23ClassName): StudentSs23Asset[] {
    const unit = getUnit(unitId, className);
    if (!unit) return [];
    const subjectPackage = packages.find(pkg => pkg.subject_slug === unit.subject_slug);
    if (!subjectPackage) return [];
    return subjectPackage.assets
      .filter(asset => asset.unit_id === unitId && isStudentDeliverableAsset(asset))
      .sort((a, b) => a.order - b.order)
      .map(asset => ({ ...asset, class_name: className, term: unit.term }));
  }

  function readAsset(assetId: string, className: Ss23ClassName): { asset: StudentSs23Asset; bytes: Buffer } | null {
    for (const unit of listUnits(className)) {
      const asset = listAssets(unit.id, className).find(item => item.id === assetId);
      if (!asset) continue;
      const file = path.resolve(repositoryRoot, asset.path);
      const relative = path.relative(repositoryRoot, file);
      if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || !existsSync(file)) {
        throw new Error(`SS23 asset path is missing or escapes repository: ${asset.id}`);
      }
      const real = realpathSync(file);
      if (!real.startsWith(repositoryRoot + path.sep) || !statSync(real).isFile()) {
        throw new Error(`SS23 asset path is unsafe: ${asset.id}`);
      }
      const bytes = readFileSync(real);
      const digest = createHash('sha256').update(bytes).digest('hex');
      if (bytes.length !== asset.bytes || digest !== asset.sha256) {
        throw new Error(`SS23 asset integrity mismatch: ${asset.id}`);
      }
      return { asset, bytes };
    }
    return null;
  }

  return { listUnits, getUnit, listAssets, readAsset, safeStudentUnit };
}

const defaultDelivery = createSs23StudentDelivery();

export const listStudentSs23Units = defaultDelivery.listUnits;
export const getStudentSs23Unit = defaultDelivery.getUnit;
export const listStudentSs23Assets = defaultDelivery.listAssets;
export const readStudentSs23Asset = defaultDelivery.readAsset;
export const safeStudentSs23Unit = defaultDelivery.safeStudentUnit;
