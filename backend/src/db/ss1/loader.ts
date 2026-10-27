/**
 * SS1 manifest + per-subject package loader.
 *
 * Deterministic discovery: the 21 registered subject slugs are always reported, in registry order. A missing file is
 * the explicit state PACKAGE_MISSING; a package whose implementation status is PENDING/IN_PROGRESS/BLOCKED is reported
 * as such. Nothing is silently skipped, and an UNREGISTERED file in the subjects directory is an error.
 * No DB access; file reads happen only inside the exported functions (never on module import).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import {
  SS1_AUTHORITATIVE_ARCHIVE, SS1_CLASS_NAME, SS1_SUBJECTS, SS1_TERMS, ss1SubjectBySlug,
  type Ss1SubjectRegistration,
} from './constants.js';
import { lessonContentHash, LESSON_ID_RE, SHA256_RE, SOURCE_ID_RE } from './identity.js';
import { parseSubjectPackage, type Ss1SubjectPackage } from './subjectPackageSchema.js';

// ── source manifest ────────────────────────────────────────────────────────
const manifestSchema = z.object({
  manifest_version: z.literal('ss1-source-manifest-v1'),
  authoritative_archive: z.object({ name: z.string(), sha256: z.string().regex(SHA256_RE), library_file_id: z.string() }).strict(),
  derived_from: z.string(),
  note: z.string(),
  sources: z.array(z.object({
    source_id: z.string().regex(SOURCE_ID_RE),
    archive_member: z.string().min(5),
    sha256: z.string().regex(SHA256_RE),
    bytes: z.number().int().positive(),
    term_label: z.enum(SS1_TERMS),
    assigned_subject_slug: z.string(),
    worker: z.string(),
    mapping_status: z.string(),
  }).strict()),
}).strict();
export type Ss1SourceManifest = z.infer<typeof manifestSchema>;
export type Ss1ManifestSource = Ss1SourceManifest['sources'][number];

export const DEFAULT_MANIFEST_PATH = fileURLToPath(new URL('./data/sourceManifest.json', import.meta.url));
export const DEFAULT_SUBJECTS_DIR = fileURLToPath(new URL('./subjects/', import.meta.url));

let manifestCache: { path: string; value: Ss1SourceManifest } | undefined;
export function loadSourceManifest(manifestPath: string = DEFAULT_MANIFEST_PATH): Ss1SourceManifest {
  if (manifestCache?.path === manifestPath) return manifestCache.value;
  const value = manifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')));
  const errors: string[] = [];
  if (value.authoritative_archive.sha256 !== SS1_AUTHORITATIVE_ARCHIVE.sha256) errors.push('manifest archive hash differs from contract constant');
  if (value.sources.length !== SS1_AUTHORITATIVE_ARCHIVE.documentEntries) errors.push(`manifest has ${value.sources.length} sources, expected ${SS1_AUTHORITATIVE_ARCHIVE.documentEntries}`);
  const ids = new Set<string>(); const hashes = new Set<string>();
  for (const s of value.sources) {
    if (ids.has(s.source_id)) errors.push(`duplicate source_id ${s.source_id}`);
    if (hashes.has(s.sha256)) errors.push(`duplicate source hash ${s.sha256}`);
    ids.add(s.source_id); hashes.add(s.sha256);
    if (!ss1SubjectBySlug(s.assigned_subject_slug)) errors.push(`${s.source_id}: assigned slug ${s.assigned_subject_slug} is not registered`);
  }
  if (errors.length) throw new Error(`SS1 source manifest invalid:\n  ${errors.join('\n  ')}`);
  manifestCache = { path: manifestPath, value };
  return value;
}

export const manifestBySha = (m: Ss1SourceManifest): Map<string, Ss1ManifestSource> => new Map(m.sources.map(s => [s.sha256, s]));
export const manifestById = (m: Ss1SourceManifest): Map<string, Ss1ManifestSource> => new Map(m.sources.map(s => [s.source_id, s]));

// ── package state ──────────────────────────────────────────────────────────
export type Ss1PackageState = 'PACKAGE_MISSING' | 'PACKAGE_PENDING' | 'PACKAGE_IN_PROGRESS' | 'PACKAGE_BLOCKED' | 'PACKAGE_IMPLEMENTED' | 'PACKAGE_INVALID';
export interface Ss1SubjectStatus {
  slug: string; canonicalSubject: string; worker: string; state: Ss1PackageState;
  file: string | null; manifestSourceIds: string[]; contentApproval: string | null; verification: string | null; errors: string[];
}
export interface Ss1Registry {
  manifest: Ss1SourceManifest;
  statuses: Ss1SubjectStatus[];
  /** Valid packages only (any implementation status), in registry order. */
  packages: Ss1SubjectPackage[];
  /** Cross-package and per-file errors. Non-empty => the import must be blocked. */
  errors: string[];
}

const PLACEHOLDER_RE = /\b(?:TODO|TBD|FIXME|LOREM IPSUM|PLACEHOLDER|XXX)\b/i;

/** Static (no parsed originals needed) validation of ONE package against the manifest and registry. */
export function validatePackageStatic(pkg: Ss1SubjectPackage, reg: Ss1SubjectRegistration, manifest: Ss1SourceManifest): string[] {
  const errors: string[] = [];
  const e = (m: string) => errors.push(`[${pkg.subject_slug}] ${m}`);
  const byId = manifestById(manifest);
  if (pkg.subject_slug !== reg.slug) e(`subject_slug ${pkg.subject_slug} != ${reg.slug}`);
  if (pkg.canonical_subject !== reg.canonicalSubject) e(`canonical_subject "${pkg.canonical_subject}" != registered "${reg.canonicalSubject}" (a different canonical name needs the foundation owner)`);
  const impl = pkg.package_status.implementation;

  if (impl === 'PENDING' && (pkg.lessons.length || pkg.assets.length || pkg.delivery_corrections.length)) {
    e('PENDING package must not contain lessons, assets or delivery corrections (no fabricated skeleton content)');
  }
  if (pkg.package_status.verification !== 'NOT_RUN' && impl !== 'IMPLEMENTED') e('verification status set on a package that is not IMPLEMENTED');

  // sources
  const pkgSources = new Map<string, Ss1SubjectPackage['sources'][number]>();
  for (const s of pkg.sources) {
    if (pkgSources.has(s.source_id)) e(`duplicate source ${s.source_id}`);
    pkgSources.set(s.source_id, s);
    const m = byId.get(s.source_id);
    if (!m) { e(`source ${s.source_id} is not in the manifest`); continue; }
    if (m.sha256 !== s.sha256) e(`source ${s.source_id}: sha256 differs from manifest`);
    if (m.archive_member !== s.archive_member) e(`source ${s.source_id}: archive_member differs from manifest`);
    if (m.term_label !== s.term_label) e(`source ${s.source_id}: term ${s.term_label} differs from manifest folder term ${m.term_label}`);
    if (s.class_name !== SS1_CLASS_NAME) e(`source ${s.source_id}: class must be ${SS1_CLASS_NAME}`);
    if (s.role !== 'CROSS_SUBJECT_HANDOFF') {
      if (m.assigned_subject_slug !== pkg.subject_slug) e(`source ${s.source_id}: manifest assigns it to ${m.assigned_subject_slug}; declare role CROSS_SUBJECT_HANDOFF instead of absorbing it`);
      if (s.canonical_subject !== pkg.canonical_subject) e(`source ${s.source_id}: canonical_subject differs from package`);
    } else if (!ss1SubjectBySlug(s.handoff_to_slug ?? '')) e(`source ${s.source_id}: handoff_to_slug is not a registered slug`);
  }
  if (impl === 'IMPLEMENTED') {
    for (const m of manifest.sources.filter(x => x.assigned_subject_slug === pkg.subject_slug)) {
      if (!pkgSources.has(m.source_id)) e(`IMPLEMENTED package does not account for manifest source ${m.source_id} (${m.archive_member})`);
      else if (!pkgSources.get(m.source_id)!.assignment_confirmed) e(`source ${m.source_id}: filename-based assignment not confirmed against the document header`);
    }
  }

  // rules
  const ruleIds = new Set<string>();
  for (const r of pkg.source_rules) {
    if (ruleIds.has(r.rule_id)) e(`duplicate rule_id ${r.rule_id}`);
    ruleIds.add(r.rule_id);
    const s = pkgSources.get(r.source_id);
    if (!s) { e(`${r.rule_id}: source ${r.source_id} is not declared in package.sources`); continue; }
    if (s.sha256 !== r.source_sha256) e(`${r.rule_id}: source_sha256 differs from declared source (rules are hash-scoped)`);
    if (r.op === 'explicit_source_alias') {
      if (r.canonical_subject !== pkg.canonical_subject) e(`${r.rule_id}: alias target "${r.canonical_subject}" is not this package's canonical subject`);
      if (!s.assignment_confirmed) e(`${r.rule_id}: alias requires source assignment_confirmed=true`);
    }
    if (r.op === 'exclude_proven_duplicate' && !pkgSources.get(r.source_id)) e(`${r.rule_id}: excluded source must be declared`);
  }

  // lessons
  const lessonIds = new Set<string>(); const seq = new Set<string>();
  const coverageIds = new Set(pkg.coverage.map(c => c.objective_id));
  for (const l of pkg.lessons) {
    if (lessonIds.has(l.id)) e(`duplicate lesson id ${l.id}`);
    lessonIds.add(l.id);
    const m = LESSON_ID_RE.exec(l.id);
    if (!m || m[1] !== reg.idToken) e(`${l.id}: id token must be ${reg.idToken}`);
    if (l.canonical_subject !== pkg.canonical_subject) e(`${l.id}: canonical_subject differs from package`);
    const sk = `${l.term_label}|${l.sequence}`;
    if (seq.has(sk)) e(`${l.id}: duplicate sequence ${l.sequence} in ${l.term_label}`);
    seq.add(sk);
    const expected = lessonContentHash(l);
    if (expected !== l.content_hash) e(`${l.id}: content_hash ${l.content_hash} != computed ${expected}`);
    const blob = [l.title, l.body, ...l.objectives, ...l.practice.flatMap(p => [p.prompt, p.answer, p.marking])].join('\n');
    if (PLACEHOLDER_RE.test(blob)) e(`${l.id}: contains placeholder text`);
    if (new Set(l.practice.map(p => p.id)).size !== l.practice.length) e(`${l.id}: duplicate practice ids`);
    if (l.provenance.kind === 'SOURCE_DERIVED' && l.provenance.source_locators.length === 0) e(`${l.id}: SOURCE_DERIVED needs source_locators`);
    if (l.provenance.kind !== 'SOURCE_DERIVED' && l.references.length === 0) e(`${l.id}: ${l.provenance.kind} needs at least one reference`);
    if (l.provenance.kind === 'ADAPTED_REFERENCE' && !l.reuse.some(r => r.permission !== 'NOT_REUSED')) e(`${l.id}: ADAPTED_REFERENCE needs a reuse record with a permission basis`);
    for (const sid of [...l.provenance.source_ids, ...l.provenance.source_locators.map(x => x.source_id)]) {
      if (!byId.has(sid)) e(`${l.id}: provenance source ${sid} is not in the manifest`);
    }
    for (const o of l.covers_objectives) if (!coverageIds.has(o)) e(`${l.id}: covers_objectives ${o} is not in coverage`);
  }

  // delivery corrections
  const dcIds = new Set<string>(); const dcHashes = new Set<string>();
  for (const c of pkg.delivery_corrections) {
    if (dcIds.has(c.id)) e(`duplicate delivery correction ${c.id}`);
    dcIds.add(c.id);
    const s = pkgSources.get(c.source_id);
    if (!s) e(`${c.id}: source ${c.source_id} not declared`);
    else {
      if (s.sha256 !== c.source_sha256) e(`${c.id}: source_sha256 differs from declared source`);
      if (s.term_label !== c.term_label) e(`${c.id}: term differs from source term`);
    }
    if (c.canonical_subject !== pkg.canonical_subject) e(`${c.id}: subject differs from package`);
    for (const h of [c.source_body_sha256, ...(c.previous_source_body_sha256 ?? [])]) {
      const k = `${c.source_id}|${h}`;
      if (dcHashes.has(k)) e(`${c.id}: competing corrections for one source body hash`);
      dcHashes.add(k);
    }
    for (const id of c.replacement_lesson_ids) if (!lessonIds.has(id)) e(`${c.id}: replacement lesson ${id} is not in this package`);
  }

  // assets
  const assetKeys = new Set<string>(); const figure = new Set<string>();
  for (const a of pkg.assets) {
    if (!a.asset_key.startsWith(`ss1-${pkg.subject_slug}-`)) e(`${a.asset_key}: must start with ss1-${pkg.subject_slug}-`);
    if (assetKeys.has(a.asset_key)) e(`duplicate asset_key ${a.asset_key}`);
    assetKeys.add(a.asset_key);
    const ref = a.binding.kind === 'SUPPLEMENT' ? `S:${a.binding.lesson_id}` : `L:${a.binding.source_id}:${a.binding.week_label}:${a.binding.source_body_sha256}`;
    const fk = `${ref}|${a.figure_order}`;
    if (figure.has(fk)) e(`${a.asset_key}: duplicate figure_order ${a.figure_order} for the same lesson`);
    figure.add(fk);
    if (a.binding.kind === 'SUPPLEMENT' && !lessonIds.has(a.binding.lesson_id)) e(`${a.asset_key}: bound supplement ${a.binding.lesson_id} is not in this package`);
    if (a.binding.kind === 'SOURCE_LESSON' && !pkgSources.has(a.binding.source_id)) e(`${a.asset_key}: bound source ${a.binding.source_id} not declared`);
    if (a.rights.status === 'UNRESOLVED' && a.displayed) e(`${a.asset_key}: rights UNRESOLVED assets must not be displayed`);
  }

  // open items + coverage
  const oiIds = new Set<string>();
  for (const o of pkg.open_items) { if (oiIds.has(o.id)) e(`duplicate open item ${o.id}`); oiIds.add(o.id); }
  const markerRules = pkg.source_rules.filter(r => r.op === 'classify_marker');
  const covIds = new Set<string>();
  for (const c of pkg.coverage) {
    if (covIds.has(c.objective_id)) e(`duplicate coverage objective ${c.objective_id}`);
    covIds.add(c.objective_id);
    if (!pkgSources.has(c.scheme_locator.source_id)) e(`${c.objective_id}: scheme_locator source not declared`);
    for (const oi of c.open_item_ids) if (!oiIds.has(oi)) e(`${c.objective_id}: unknown open item ${oi}`);
    for (const ev of c.evidence) {
      if (ev.kind === 'SUPPLEMENT' && !lessonIds.has(ev.lesson_id)) e(`${c.objective_id}: evidence lesson ${ev.lesson_id} not in package`);
      if (ev.kind === 'SOURCE_LESSON' && !pkgSources.has(ev.source_id)) e(`${c.objective_id}: evidence source ${ev.source_id} not declared`);
    }
    if (c.status === 'MARKER') {
      const markerEvidence = c.evidence.flatMap(ev => (ev.kind === 'SOURCE_LESSON' ? [ev] : []));
      const ok = markerEvidence.some(ev => markerRules.some(r => r.source_id === ev.source_id && 'week_label' in r && r.week_label === ev.week_label));
      if (!ok) e(`${c.objective_id}: MARKER coverage needs a classify_marker rule for its source evidence`);
    }
    if (c.status === 'SUPPORTED') {
      // evidence that a marker rule classifies as non-teaching cannot prove teaching
      const srcEvidence = c.evidence.flatMap(ev => (ev.kind === 'SOURCE_LESSON' ? [ev] : []));
      const onlyMarkers = srcEvidence.length > 0 && srcEvidence.every(ev => markerRules.some(r => r.source_id === ev.source_id && 'week_label' in r && r.week_label === ev.week_label));
      if (onlyMarkers) e(`${c.objective_id}: SUPPORTED evidence is only marker-classified rows (overlap/evaluation-only is not teaching)`);
    }
  }
  if (impl === 'IMPLEMENTED') {
    for (const c of pkg.coverage) if (c.status === 'UNRESOLVED' || c.status === 'PARTIAL') {
      const blocking = c.open_item_ids.some(id => pkg.open_items.find(o => o.id === id && o.status === 'OPEN'));
      if (!blocking) e(`${c.objective_id}: ${c.status} must reference an OPEN open_item`);
    }
  }
  return errors;
}

export interface LoadOptions { subjectsDir?: string; manifestPath?: string; }

/** Discover, parse and validate every registered subject package. Deterministic order; explicit missing/pending states. */
export function loadSs1Registry(options: LoadOptions = {}): Ss1Registry {
  const dir = options.subjectsDir ?? DEFAULT_SUBJECTS_DIR;
  const manifest = loadSourceManifest(options.manifestPath ?? DEFAULT_MANIFEST_PATH);
  const errors: string[] = [];
  const statuses: Ss1SubjectStatus[] = [];
  const packages: Ss1SubjectPackage[] = [];

  const present = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')).sort() : [];
  const registered = new Set(SS1_SUBJECTS.map(s => `${s.slug}.json`));
  for (const f of present) if (!registered.has(f)) errors.push(`unregistered subject package file: ${f} (file names must be <registered-slug>.json)`);

  for (const reg of SS1_SUBJECTS) {
    const manifestSourceIds = manifest.sources.filter(s => s.assigned_subject_slug === reg.slug).map(s => s.source_id).sort();
    const base: Ss1SubjectStatus = {
      slug: reg.slug, canonicalSubject: reg.canonicalSubject, worker: reg.worker, state: 'PACKAGE_MISSING',
      file: null, manifestSourceIds, contentApproval: null, verification: null, errors: [],
    };
    const file = `${reg.slug}.json`;
    if (!present.includes(file)) { statuses.push(base); continue; }
    base.file = path.join(dir, file);
    try {
      const pkg = parseSubjectPackage(JSON.parse(readFileSync(base.file, 'utf8')), file);
      const staticErrors = validatePackageStatic(pkg, reg, manifest);
      if (staticErrors.length) { base.state = 'PACKAGE_INVALID'; base.errors = staticErrors; errors.push(...staticErrors); }
      else {
        packages.push(pkg);
        base.state = ({ PENDING: 'PACKAGE_PENDING', IN_PROGRESS: 'PACKAGE_IN_PROGRESS', BLOCKED: 'PACKAGE_BLOCKED', IMPLEMENTED: 'PACKAGE_IMPLEMENTED' } as const)[pkg.package_status.implementation];
        base.contentApproval = pkg.package_status.content_approval;
        base.verification = pkg.package_status.verification;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      base.state = 'PACKAGE_INVALID'; base.errors = [msg]; errors.push(`[${reg.slug}] ${msg}`);
    }
    statuses.push(base);
  }

  // cross-package uniqueness
  const seen = (label: string) => { const m = new Map<string, string>(); return (k: string, owner: string) => { const prev = m.get(k); if (prev) errors.push(`${label} ${k} used by both ${prev} and ${owner}`); else m.set(k, owner); }; };
  const lessonSeen = seen('lesson id'); const assetSeen = seen('asset_key'); const dcSeen = seen('delivery correction'); const ruleSeen = seen('rule_id');
  for (const p of packages) {
    p.lessons.forEach(l => lessonSeen(l.id, p.subject_slug));
    p.assets.forEach(a => assetSeen(a.asset_key, p.subject_slug));
    p.delivery_corrections.forEach(c => dcSeen(c.id, p.subject_slug));
    p.source_rules.forEach(r => ruleSeen(r.rule_id, p.subject_slug));
  }
  // one source may be primary-owned by only one package
  const owners = new Map<string, string>();
  for (const p of packages) for (const s of p.sources) {
    if (s.role === 'CROSS_SUBJECT_HANDOFF') continue;
    const prev = owners.get(s.source_id);
    if (prev) errors.push(`source ${s.source_id} claimed as primary by both ${prev} and ${p.subject_slug}`);
    owners.set(s.source_id, p.subject_slug);
  }
  return { manifest, statuses, packages, errors };
}
