/**
 * SS1 compiler: validated subject packages + parsed-original provenance  =>  executable supplement rows,
 * delivery-correction / asset / coverage plans and a disposition report.
 *
 * PURE: no DB, no file I/O, no network, nothing executed at import time. Deterministic ordering everywhere.
 * Fail-closed: every cross-reference (week label, exact anchor, body hash, replacement lesson, duplicate target) is
 * verified against what the importer actually parsed. Missing packages are reported, never silently skipped, and a
 * package is never described as "teaching complete" while any scheme objective is PARTIAL/UNRESOLVED or an open item
 * blocks delivery.
 */
import path from 'node:path';
import { SS1_CLASS_NAME, SS1_SUPPLEMENT_DIR, SS1_TERMS, ss1SubjectBySlug } from './constants.js';
import {
  canonicalWeekLabel, normalizeTitle, ss1SupplementReference, ss1TopicIdentityKey, supplementSourceFile,
} from './identity.js';
import type { Ss1Registry } from './loader.js';
import type { ExcludedDuplicate } from './sourceRules.js';
import type { Ss1Asset, Ss1Coverage, Ss1DeliveryCorrection, Ss1Lesson, Ss1SubjectPackage } from './subjectPackageSchema.js';

export interface CurriculumRow {
  filePath: string; className: string; termLabel: string; subjectName: string;
  weekLabel: string; orderIndex: number; title: string; sourceReference: string;
}

export type Ss1Disposition = 'ORIGINAL' | 'SPLIT_PART' | 'MERGED_STRANDED_LABEL' | 'MARKER';

/** One importer-parsed ORIGINAL SS1 row (after source rules), as seen before DB numbering. */
export interface Ss1OriginalRecord {
  sourceId: string; sourceSha256: string; sourceIdentity: string; sourceBasename: string;
  termLabel: string; subjectName: string; weekLabel: string; title: string;
  rawBodySha256: string; normalizedBodySha256: string; bodyChars: number;
  disposition: Ss1Disposition; ruleIds: string[]; marker?: string; splitPart?: number;
  /** In-memory only (anchor checks). Never serialised into plans. */
  body: string;
  /** The importer's row object; `orderIndex` is read AFTER numbering. */
  row?: { orderIndex: number };
}

export interface AliasUse { sourceId: string; inferredSubject: string; canonicalSubject: string; ruleId: string | null }

export interface CompileInput {
  registry: Ss1Registry;
  originals: readonly Ss1OriginalRecord[];
  excluded: readonly ExcludedDuplicate[];
  /** rule_id => number of times it matched across all sections of its source. */
  ruleMatches: ReadonlyMap<string, number>;
  aliasUses: readonly AliasUse[];
  /** manifest source_ids whose document was read in this run. */
  sourcesSeen: ReadonlySet<string>;
  root: string;
  options: { allowPartialSources: boolean; requireAllPackages: boolean };
}

export interface PlannedAsset {
  asset_key: string; package_slug: string; subject: string; term_label: string;
  target: { kind: 'SUPPLEMENT'; lesson_id: string; source_file: string } | { kind: 'SOURCE_LESSON'; source_id: string; week_label: string; source_body_sha256: string };
  expected_title: string; file: string; sha256: string; bytes: number; media_type: string; alt_text: string;
  caption: string | null; figure_order: number; displayed: boolean; source_locator: string; rights_status: string;
}
export interface PlannedCorrection {
  id: string; package_slug: string; subject: string; term_label: string; source_id: string; source_title: string;
  source_body_sha256: string; previous_source_body_sha256: string[]; replacement_lesson_ids: string[]; severity: string;
}
export interface Ss1SubjectDisposition {
  slug: string; subject: string; state: string; worker: string;
  originalRows: number; markerRows: number; splitRows: number; supplementRows: number; excludedDuplicates: number;
  coverage: Record<string, number>; openItems: number; blockingOpenItems: number;
  teachingComplete: boolean; claim: string;
}
export interface CompileOutput {
  supplementRows: CurriculumRow[];
  supplementMeta: Array<{ lessonId: string; slug: string; subject: string; term: string; sequence: number; contentHash: string; filePath: string }>;
  assets: PlannedAsset[];
  corrections: PlannedCorrection[];
  schemeOnlyRows: Array<{ sourceId: string; subject: string; term: string; weekLabel: string; title: string; classification: string; ruleIds: string[] }>;
  subjects: Ss1SubjectDisposition[];
  errors: string[];
  /** Non-blocking notes (e.g. pending packages) — always printed. */
  notes: string[];
}

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const occurrences = (h: string, n: string) => { let c = 0; for (let i = h.indexOf(n); n && i !== -1; i = h.indexOf(n, i + n.length)) c += 1; return c; };

/** Resolve an exact source-lesson locator to exactly one original record, or an error string. */
export function resolveLocator(
  originals: readonly Ss1OriginalRecord[], sourceId: string, weekLabel: string, anchor: string | undefined,
): { record: Ss1OriginalRecord } | { error: string } {
  const want = canonicalWeekLabel(weekLabel);
  const byWeek = originals.filter(o => o.sourceId === sourceId && canonicalWeekLabel(o.weekLabel) === want);
  if (byWeek.length === 0) return { error: `no parsed row for ${sourceId} / ${weekLabel}` };
  if (anchor) {
    const hits = byWeek.filter(o => o.body.includes(anchor));
    if (hits.length === 0) return { error: `anchor not found in ${sourceId} / ${weekLabel}` };
    if (hits.length > 1) return { error: `anchor matches ${hits.length} rows in ${sourceId} / ${weekLabel}` };
    if (occurrences(hits[0].body, anchor) !== 1) return { error: `anchor occurs more than once in ${sourceId} / ${weekLabel}` };
    return { record: hits[0] };
  }
  if (byWeek.length > 1) return { error: `${sourceId} / ${weekLabel} resolves to ${byWeek.length} rows (scheme table + lesson, or a split); an exact anchor is required` };
  return { record: byWeek[0] };
}

export function compileSs1(input: CompileInput): CompileOutput {
  const errors: string[] = []; const notes: string[] = [];
  const { registry, originals } = input;
  const supplementRows: CurriculumRow[] = []; const supplementMeta: CompileOutput['supplementMeta'] = [];
  const assets: PlannedAsset[] = []; const corrections: PlannedCorrection[] = []; const subjects: Ss1SubjectDisposition[] = [];
  const schemeOnlyRows: CompileOutput['schemeOnlyRows'] = [];

  // ── run-level source accounting ─────────────────────────────────────────
  const sourceKnown = new Set(registry.manifest.sources.map(s => s.source_id));
  for (const o of originals) if (!sourceKnown.has(o.sourceId)) errors.push(`original row bound to unknown source ${o.sourceId}`);
  if (input.sourcesSeen.size > 0 && !input.options.allowPartialSources) {
    for (const s of registry.manifest.sources) {
      if (!input.sourcesSeen.has(s.source_id)) errors.push(`manifest source not present in this run: ${s.source_id} (${s.archive_member}); pass --ss1-allow-partial-sources only for a deliberate subset`);
    }
  }
  for (const o of originals) {
    if (!(SS1_TERMS as readonly string[]).includes(o.termLabel)) errors.push(`SS1 row in unsupported term "${o.termLabel}": ${o.sourceIdentity}`);
  }
  for (const reg of registry.statuses) {
    if (reg.state === 'PACKAGE_INVALID') errors.push(`[${reg.slug}] package invalid — see loader errors`);
  }

  // rules matched exactly once (only for sources actually read)
  for (const pkg of registry.packages) {
    for (const r of pkg.source_rules) {
      if (!input.sourcesSeen.has(r.source_id)) continue;
      const n = input.ruleMatches.get(r.rule_id) ?? 0;
      if (n !== 1) errors.push(`[${pkg.subject_slug}] ${r.rule_id} (${r.op}) matched ${n} times; a rule must match exactly once`);
    }
  }
  // alias discipline: a generic-inferred subject that differs from canonical is accepted only through an explicit rule
  for (const a of input.aliasUses) {
    if (!a.ruleId) errors.push(`unapproved subject alias: ${a.sourceId} inferred "${a.inferredSubject}" but canonical subject is "${a.canonicalSubject}" (needs an explicit_source_alias rule in the ${a.canonicalSubject} package)`);
  }
  // duplicate exclusions need target evidence among parsed originals
  const excludedKeys = new Set(input.excluded.map(x => `${x.sourceId}|${canonicalWeekLabel(x.weekLabel)}|${x.normalizedBodySha256}`));
  for (const x of input.excluded) {
    const target = originals.find(o => o.sourceId === x.duplicateOf.sourceId
      && canonicalWeekLabel(o.weekLabel) === canonicalWeekLabel(x.duplicateOf.weekLabel)
      && o.normalizedBodySha256 === x.duplicateOf.normalizedBodySha256);
    if (!target) errors.push(`${x.ruleId}: duplicate target ${x.duplicateOf.sourceId} / ${x.duplicateOf.weekLabel} with that hash is not among the kept rows`);
    else if (excludedKeys.has(`${target.sourceId}|${canonicalWeekLabel(target.weekLabel)}|${target.normalizedBodySha256}`)) errors.push(`${x.ruleId}: duplicate target is itself excluded`);
  }

  // ── per package ────────────────────────────────────────────────────────
  for (const status of registry.statuses) {
    const reg = ss1SubjectBySlug(status.slug)!;
    const pkg: Ss1SubjectPackage | undefined = registry.packages.find(p => p.subject_slug === status.slug);
    const mine = originals.filter(o => o.subjectName === reg.canonicalSubject);
    const disp: Ss1SubjectDisposition = {
      slug: reg.slug, subject: reg.canonicalSubject, state: status.state, worker: reg.worker,
      originalRows: mine.length,
      markerRows: mine.filter(o => o.disposition === 'MARKER').length,
      splitRows: mine.filter(o => o.disposition === 'SPLIT_PART').length,
      supplementRows: 0, excludedDuplicates: input.excluded.filter(x => registry.manifest.sources.find(s => s.source_id === x.sourceId)?.assigned_subject_slug === reg.slug).length,
      coverage: {}, openItems: 0, blockingOpenItems: 0, teachingComplete: false,
      claim: 'NOT_CLAIMED: package missing or not implemented',
    };
    for (const o of mine.filter(o => o.disposition === 'MARKER')) {
      schemeOnlyRows.push({ sourceId: o.sourceId, subject: o.subjectName, term: o.termLabel, weekLabel: o.weekLabel, title: o.title, classification: o.marker ?? 'MARKER', ruleIds: o.ruleIds });
    }

    if (!pkg) {
      notes.push(`[${reg.slug}] ${status.state}${status.state === 'PACKAGE_MISSING' ? ' — no package file yet' : ''} (worker ${reg.worker}); originals only: ${mine.length} row(s)`);
      if (input.options.requireAllPackages) errors.push(`[${reg.slug}] ${status.state}: all packages are required for this run`);
      subjects.push(disp);
      continue;
    }

    const impl = pkg.package_status.implementation;
    disp.openItems = pkg.open_items.filter(o => o.status === 'OPEN').length;
    disp.blockingOpenItems = pkg.open_items.filter(o => o.status === 'OPEN' && o.blocks_student_delivery).length;
    for (const c of pkg.coverage) disp.coverage[c.status] = (disp.coverage[c.status] ?? 0) + 1;
    if (impl !== 'IMPLEMENTED') {
      notes.push(`[${reg.slug}] package status ${impl}: lessons/assets/corrections are NOT compiled; originals only`);
      if (input.options.requireAllPackages) errors.push(`[${reg.slug}] package not IMPLEMENTED`);
      subjects.push(disp);
      continue;
    }

    const e = (m: string) => errors.push(`[${reg.slug}] ${m}`);

    // lessons → rows (destination bucket must already exist in the original plan; append-only)
    const lessonsSorted = [...pkg.lessons].sort((a, b) =>
      cmp(a.term_label, b.term_label) || a.sequence - b.sequence || cmp(a.id, b.id));
    const lessonById = new Map<string, Ss1Lesson>(lessonsSorted.map(l => [l.id, l]));
    for (const l of lessonsSorted) {
      if (!originals.some(o => o.subjectName === l.canonical_subject && o.termLabel === l.term_label)) {
        e(`${l.id}: destination ${l.canonical_subject} / ${l.term_label} is absent from the original-source plan (no silent redistribution)`);
        continue;
      }
      const credits = l.reuse.filter(r => r.required_credit).map(r => r.required_credit as string);
      const filePath = path.join(input.root, SS1_SUPPLEMENT_DIR, supplementSourceFile(l.id));
      supplementRows.push({
        filePath, className: SS1_CLASS_NAME, termLabel: l.term_label, subjectName: l.canonical_subject,
        weekLabel: `SUPPLEMENT ${l.id}`, orderIndex: 0, title: l.title,
        sourceReference: ss1SupplementReference({
          id: l.id, title: l.title, termLabel: l.term_label, subjectName: l.canonical_subject, objectives: l.objectives, body: l.body,
          practice: l.practice, originStatement: l.provenance.origin_statement, references: l.references, credits,
        }),
      });
      supplementMeta.push({ lessonId: l.id, slug: reg.slug, subject: l.canonical_subject, term: l.term_label, sequence: l.sequence, contentHash: l.content_hash, filePath });
      disp.supplementRows += 1;
    }

    // delivery corrections: exact source identity + body hash; ambiguity fails closed
    for (const c of [...pkg.delivery_corrections].sort((a, b) => cmp(a.id, b.id))) {
      const hashes = new Set([c.source_body_sha256, ...(c.previous_source_body_sha256 ?? [])]);
      const want = canonicalWeekLabel(c.source_week_label);
      const hits = originals.filter(o => o.sourceId === c.source_id && canonicalWeekLabel(o.weekLabel) === want && hashes.has(o.rawBodySha256));
      if (hits.length !== 1) { e(`${c.id}: matches ${hits.length} original rows by source ${c.source_id} / ${c.source_week_label} / body hash; must be exactly 1`); continue; }
      const hit = hits[0];
      if (normalizeTitle(hit.title) !== normalizeTitle(c.source_title)) e(`${c.id}: row title "${hit.title}" differs from correction source_title "${c.source_title}"`);
      if (hit.subjectName !== c.canonical_subject || hit.termLabel !== c.term_label) e(`${c.id}: row bucket ${hit.subjectName}/${hit.termLabel} differs from correction`);
      for (const id of c.replacement_lesson_ids) {
        const rl = lessonById.get(id);
        if (!rl) e(`${c.id}: replacement ${id} is not an implemented lesson of this package`);
        else if (rl.canonical_subject !== c.canonical_subject) e(`${c.id}: replacement ${id} is in another subject`);
      }
      corrections.push(toPlannedCorrection(c, reg.slug));
    }

    // coverage evidence: exact locators, marker discipline
    for (const cov of pkg.coverage) verifyCoverage(cov, originals, e);

    // assets: bindings resolve to exactly one row/lesson
    for (const a of [...pkg.assets].sort((x, y) => cmp(x.asset_key, y.asset_key))) {
      const planned = planAsset(a, pkg, originals, lessonById, e);
      if (planned) assets.push(planned);
    }

    // honest completeness: never "complete" with PARTIAL/UNRESOLVED objectives or blocking open items
    const unresolved = pkg.coverage.filter(c => c.status === 'PARTIAL' || c.status === 'UNRESOLVED').length;
    disp.teachingComplete = pkg.coverage.length > 0 && unresolved === 0 && disp.blockingOpenItems === 0;
    disp.claim = disp.teachingComplete
      ? 'CODE-LEVEL ONLY: coverage mapped, no open blockers; NOT verified or approved'
      : `NOT COMPLETE: ${unresolved} PARTIAL/UNRESOLVED objective(s), ${disp.blockingOpenItems} blocking open item(s)${pkg.coverage.length === 0 ? ', no coverage mapping' : ''}`;
    subjects.push(disp);
  }

  // append-only deterministic order across the whole run
  // (importer numbering keeps arrival order within a bucket, so arrival order IS the final order: subject, term, sequence, id)
  const ordered = [...supplementMeta].sort((a, b) => cmp(a.subject, b.subject) || cmp(a.term, b.term) || a.sequence - b.sequence || cmp(a.lessonId, b.lessonId));
  const rank = new Map(ordered.map((m, i) => [m.filePath, i]));
  supplementRows.sort((a, b) => (rank.get(a.filePath) ?? 0) - (rank.get(b.filePath) ?? 0));
  supplementMeta.sort((a, b) => (rank.get(a.filePath) ?? 0) - (rank.get(b.filePath) ?? 0));

  return { supplementRows, supplementMeta, assets, corrections, schemeOnlyRows, subjects, errors, notes };
}

function toPlannedCorrection(c: Ss1DeliveryCorrection, slug: string): PlannedCorrection {
  return {
    id: c.id, package_slug: slug, subject: c.canonical_subject, term_label: c.term_label, source_id: c.source_id,
    source_title: c.source_title, source_body_sha256: c.source_body_sha256,
    previous_source_body_sha256: [...(c.previous_source_body_sha256 ?? [])].sort(),
    replacement_lesson_ids: [...c.replacement_lesson_ids], severity: c.severity,
  };
}

function verifyCoverage(cov: Ss1Coverage, originals: readonly Ss1OriginalRecord[], e: (m: string) => void): void {
  const loc = resolveLocator(originals, cov.scheme_locator.source_id, cov.scheme_locator.week_label, cov.scheme_locator.anchor);
  if ('error' in loc) e(`${cov.objective_id}: scheme_locator — ${loc.error}`);
  for (const ev of cov.evidence) {
    if (ev.kind !== 'SOURCE_LESSON') continue;
    const r = resolveLocator(originals, ev.source_id, ev.week_label, ev.anchor);
    if ('error' in r) { e(`${cov.objective_id}: evidence — ${r.error}`); continue; }
    if (cov.status === 'SUPPORTED' && r.record.disposition === 'MARKER') e(`${cov.objective_id}: SUPPORTED evidence ${ev.source_id} / ${ev.week_label} is a marker row (${r.record.marker}); a marker is not teaching`);
    if (cov.status === 'MARKER' && r.record.disposition !== 'MARKER') e(`${cov.objective_id}: MARKER evidence ${ev.source_id} / ${ev.week_label} is not classified by a classify_marker rule`);
  }
}

function planAsset(
  a: Ss1Asset, pkg: Ss1SubjectPackage, originals: readonly Ss1OriginalRecord[],
  lessonById: ReadonlyMap<string, Ss1Lesson>, e: (m: string) => void,
): PlannedAsset | null {
  const base = {
    asset_key: a.asset_key, package_slug: pkg.subject_slug, file: a.file, sha256: a.sha256, bytes: a.bytes, media_type: a.media_type,
    alt_text: a.alt_text, caption: a.caption ?? null, figure_order: a.figure_order, displayed: a.displayed,
    source_locator: a.source_locator, rights_status: a.rights.status,
  };
  if (a.binding.kind === 'SUPPLEMENT') {
    const l = lessonById.get(a.binding.lesson_id);
    if (!l) { e(`${a.asset_key}: bound lesson ${a.binding.lesson_id} is not an implemented lesson`); return null; }
    return { ...base, subject: l.canonical_subject, term_label: l.term_label, expected_title: l.title,
      target: { kind: 'SUPPLEMENT', lesson_id: l.id, source_file: supplementSourceFile(l.id) } };
  }
  const want = canonicalWeekLabel(a.binding.week_label);
  const b = a.binding;
  const hits = originals.filter(o => o.sourceId === b.source_id && canonicalWeekLabel(o.weekLabel) === want && o.rawBodySha256 === b.source_body_sha256);
  if (hits.length !== 1) { e(`${a.asset_key}: binding matches ${hits.length} original rows (source ${b.source_id} / ${b.week_label} / hash); must be exactly 1`); return null; }
  return { ...base, subject: hits[0].subjectName, term_label: hits[0].termLabel, expected_title: hits[0].title,
    target: { kind: 'SOURCE_LESSON', source_id: b.source_id, week_label: hits[0].weekLabel, source_body_sha256: b.source_body_sha256 } };
}

// ── post-numbering plan (DB identity) ─────────────────────────────────────
export interface Ss1PlanRow {
  kind: 'ORIGINAL' | 'SUPPLEMENT';
  className: string; subjectName: string; termLabel: string; orderIndex: number; identityKey: string;
  title: string; sourceFile: string; weekLabel: string;
  rawBodySha256: string; sourceId: string | null; lessonId: string | null; disposition: string; ruleIds: string[];
}

/** Build the final identity plan AFTER the importer numbered `normalRows`. `rowFiles` maps each original record's row. */
export function buildIdentityPlan(
  originals: readonly Ss1OriginalRecord[], supplements: CompileOutput['supplementMeta'],
  normalRows: readonly CurriculumRow[], sha256: (s: string) => string,
): { rows: Ss1PlanRow[]; errors: string[] } {
  const errors: string[] = []; const rows: Ss1PlanRow[] = [];
  for (const o of originals) {
    if (!o.row) { errors.push(`original ${o.sourceId} / ${o.weekLabel} has no importer row`); continue; }
    rows.push({
      kind: 'ORIGINAL', className: SS1_CLASS_NAME, subjectName: o.subjectName, termLabel: o.termLabel, orderIndex: o.row.orderIndex,
      identityKey: ss1TopicIdentityKey(o.subjectName, o.termLabel, o.row.orderIndex), title: o.title, sourceFile: o.sourceBasename,
      weekLabel: o.weekLabel, rawBodySha256: o.rawBodySha256, sourceId: o.sourceId, lessonId: null, disposition: o.disposition, ruleIds: o.ruleIds,
    });
  }
  const byFile = new Map(normalRows.map(r => [r.filePath, r]));
  for (const m of supplements) {
    const r = byFile.get(m.filePath);
    if (!r) { errors.push(`supplement ${m.lessonId} has no numbered importer row`); continue; }
    rows.push({
      kind: 'SUPPLEMENT', className: SS1_CLASS_NAME, subjectName: r.subjectName, termLabel: r.termLabel, orderIndex: r.orderIndex,
      identityKey: ss1TopicIdentityKey(r.subjectName, r.termLabel, r.orderIndex), title: r.title, sourceFile: supplementSourceFile(m.lessonId),
      weekLabel: r.weekLabel, rawBodySha256: sha256(r.sourceReference), sourceId: null, lessonId: m.lessonId, disposition: 'SUPPLEMENT', ruleIds: [],
    });
  }
  rows.sort((a, b) => cmp(a.subjectName, b.subjectName) || cmp(a.termLabel, b.termLabel) || a.orderIndex - b.orderIndex);
  const seen = new Set<string>();
  for (const r of rows) { if (seen.has(r.identityKey)) errors.push(`duplicate topic identity ${r.identityKey}`); seen.add(r.identityKey); }
  return { rows, errors };
}

export interface SnapshotRow { subject_name: string; term_label: string; order_index: number; title: string; source_file: string; source_reference_sha256: string }

/**
 * Fail-closed existing-row compatibility. Every snapshot row must be reproduced EXACTLY (same bucket position, title,
 * file and body hash). Extra planned rows are allowed only if they are appended AFTER the last snapshot position of
 * their bucket. Anything else is reported; nothing is repaired or reordered.
 */
export function compareToSnapshot(plan: readonly Ss1PlanRow[], snapshot: readonly SnapshotRow[]): string[] {
  const errors: string[] = [];
  const byKey = new Map(plan.map(p => [p.identityKey, p]));
  const lastInBucket = new Map<string, number>();
  for (const s of snapshot) {
    const key = ss1TopicIdentityKey(s.subject_name, s.term_label, s.order_index);
    const bucket = `${s.subject_name}|${s.term_label}`;
    lastInBucket.set(bucket, Math.max(lastInBucket.get(bucket) ?? 0, s.order_index));
    const p = byKey.get(key);
    if (!p) { errors.push(`snapshot row missing from plan: ${s.subject_name} / ${s.term_label} / #${s.order_index} "${s.title}"`); continue; }
    if (p.title !== s.title) errors.push(`snapshot title differs at ${s.subject_name} / ${s.term_label} / #${s.order_index}: "${s.title}" vs planned "${p.title}"`);
    if (p.sourceFile !== s.source_file) errors.push(`snapshot source_file differs at ${s.subject_name} / ${s.term_label} / #${s.order_index}: ${s.source_file} vs ${p.sourceFile}`);
    if (p.rawBodySha256 !== s.source_reference_sha256) errors.push(`snapshot body differs at ${s.subject_name} / ${s.term_label} / #${s.order_index}`);
  }
  const snapKeys = new Set(snapshot.map(s => ss1TopicIdentityKey(s.subject_name, s.term_label, s.order_index)));
  for (const p of plan) {
    if (snapKeys.has(p.identityKey)) continue;
    const last = lastInBucket.get(`${p.subjectName}|${p.termLabel}`);
    if (last !== undefined && p.orderIndex <= last) errors.push(`planned row would be inserted inside existing sequence: ${p.subjectName} / ${p.termLabel} / #${p.orderIndex} "${p.title}"`);
  }
  return errors;
}
