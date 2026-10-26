import { createHash } from 'node:crypto';
import { packageSchema, type SubjectPackage, type SourceRule } from './subjectPackageSchema.js';
import registryData from './sourceRegistry.json' with { type: 'json' };
export const registry = registryData;
export const registeredSubjects = [...new Set(registry.map(s => s.assigned_subject_slug))].sort();
export const sha256 = (s: string | Uint8Array): string => createHash('sha256').update(s).digest('hex');
export interface ParsedTopic { weekLabel: string; title: string; body: string }
export interface SourceInput { source_id: string; sha256: string; filePath: string; text: string }
export interface Row { filePath: string; className: string; termLabel: string; subjectName: string; weekLabel: string; orderIndex: number; title: string; sourceReference: string }
export interface IdentifiedRow { id: string; source_id: string | null; body_sha256: string; row: Row }
export interface Plan { version: 'ss1-plan-v1'; rows: Row[]; identified_rows: IdentifiedRow[]; dispositions: { id: string; status: string; detail: string }[]; assets: SubjectPackage['assets']; corrections: SubjectPackage['delivery_corrections']; blockers: string[]; ready: boolean }
function must(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(`SS1: ${message}`); }
function unique(values: string[], label: string) { must(new Set(values).size === values.length, `duplicate ${label}`); }
function once(body: string, anchor: string) { const i = body.indexOf(anchor); must(i >= 0 && body.indexOf(anchor, i + 1) < 0, `anchor missing or ambiguous: ${anchor.slice(0, 80)}`); return i; }
export const originalLessonId = (sourceId: string, body: string) => `${sourceId}:BODY:${sha256(body)}`;
/** Structural insertions only. No instructional character is deleted or rewritten. */
export function applyRules(input: SourceInput, rules: SourceRule[]): string {
  let text = input.text;
  for (const r of rules) {
    must(r.source_id === input.source_id && r.source_sha256 === input.sha256, `rule ${r.id} source mismatch`);
    once(input.text, r.anchor);
    if (r.op === 'split_before' || r.op === 'attach_stranded_label') {
      must(/^(?:[0-9]{1,2})(?:\s*(?:-|&|and)\s*[0-9]{1,2})?$/.test(r.week_label), `rule ${r.id}: numeric week label required`);
      const i = once(text, r.anchor);
      must(i === 0 || text[i - 1] === '\n', `rule ${r.id}: anchor must start at a line boundary`);
      if (r.op === 'attach_stranded_label') {
        const next = once(text, r.following_anchor);
        must(next >= i + r.anchor.length && text.slice(i + r.anchor.length, next).trim() === '', `rule ${r.id}: label must immediately precede following anchor`);
      }
      text = text.slice(0, i) + `WEEK ${r.week_label}\n` + text.slice(i);
    }
  }
  return text;
}
function renderLesson(l: SubjectPackage['lessons'][number]) {
  return [l.body, 'OBJECTIVES', ...l.objectives, 'PRACTICE AND MARKING GUIDE', ...l.practice.map(q => `${q.id}. ${q.question}\nAnswer: ${q.answer}\nMarks: ${q.marks}\n${q.marking.map(m => `${m.marks}: ${m.criterion}`).join('\n')}`)].join('\n\n');
}
/** Pure: no filesystem, network, database, process or environment access. */
export function compilePackages(rawPackages: unknown[], inputs: SourceInput[], parse: (text: string) => ParsedTopic[]): Plan {
  const packages = rawPackages.map(p => packageSchema.parse(p)).sort((a, b) => a.subject_slug.localeCompare(b.subject_slug, 'en'));
  unique(packages.map(p => p.subject_slug), 'packages'); unique(packages.map(p => p.canonical_subject.toLowerCase()), 'canonical subjects'); unique(inputs.map(s => s.source_id), 'source inputs');
  const plan: Plan = { version: 'ss1-plan-v1', rows: [], identified_rows: [], dispositions: [], assets: [], corrections: [], blockers: [], ready: false };
  const inputMap = new Map(inputs.map(s => [s.source_id, s]));
  for (const s of inputs) must(registry.some(r => r.source_id === s.source_id && r.sha256 === s.sha256), `unregistered or altered input ${s.source_id}`);
  for (const slug of registeredSubjects) if (!packages.some(p => p.subject_slug === slug)) plan.blockers.push(`MISSING_PACKAGE:${slug}`);
  const originals: IdentifiedRow[] = [], supplements: IdentifiedRow[] = [];
  for (const p of packages) {
    must(registeredSubjects.includes(p.subject_slug), `unregistered subject ${p.subject_slug}`);
    if (p.package_status === 'PENDING') plan.blockers.push(`PENDING_PACKAGE:${p.subject_slug}`);
    unique(p.sources.map(s => s.source_id), 'package sources'); unique(p.source_rules.map(r => r.id), 'rule IDs');
    const expected = registry.filter(r => r.assigned_subject_slug === p.subject_slug);
    for (const r of expected) if (!p.sources.some(s => s.source_id === r.source_id)) plan.blockers.push(`UNACCOUNTED_SOURCE:${r.source_id}`);
    for (const s of p.sources) {
      const r = expected.find(r => r.source_id === s.source_id);
      must(r && r.sha256 === s.sha256 && r.archive_member === s.archive_member && r.term_from_folder === s.term && s.canonical_subject === p.canonical_subject, `manifest mismatch ${s.source_id}`);
      const input = inputMap.get(s.source_id);
      if (!input) { plan.blockers.push(`MISSING_INPUT:${s.source_id}`); continue; }
      must(input.sha256 === s.sha256, `source hash ${s.source_id}`);
      const rules = p.source_rules.filter(r => r.source_id === s.source_id);
      const text = applyRules(input, rules);
      once(input.text, s.header_text);
      const normalizeHeading = (v: string) => v.replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');
      if (normalizeHeading(s.header_text) !== normalizeHeading(p.canonical_subject)) must(rules.some(r => r.op === 'source_alias' && r.observed_subject === s.header_text && r.canonical_subject === p.canonical_subject), `unapproved source heading alias ${s.source_id}`);
      for (const alias of rules.filter(r => r.op === 'source_alias')) must(alias.op === 'source_alias' && alias.canonical_subject === p.canonical_subject && alias.observed_subject === alias.anchor, `alias ${alias.id} must explicitly bind observed heading`);
      const exclusions = rules.filter(r => r.op === 'exclude_duplicate');
      must(exclusions.length <= 1, `multiple exclusions ${s.source_id}`);
      if (exclusions.length) {
        const rule = exclusions[0];
        if (rule.op !== 'exclude_duplicate') throw new Error('unreachable');
        const target = p.sources.find(t => t.source_id === rule.target_source_id);
        const targetInput = inputMap.get(rule.target_source_id);
        must(target && targetInput && target.source_id !== s.source_id && target.sha256 === rule.target_sha256 && target.sha256 === s.sha256 && target.term === s.term && targetInput.text === input.text, `duplicate proof ${rule.id}`);
        must(!p.source_rules.some(r => r.source_id === target.source_id && r.op === 'exclude_duplicate'), `duplicate chain/cycle ${rule.id}`);
        plan.dispositions.push({ id: s.source_id, status: 'PROVEN_DUPLICATE', detail: target.source_id }); continue;
      }
      const topics = parse(text);
      const firstBody = topics[0]?.body;
      if (firstBody && text.indexOf(firstBody) > 0) plan.dispositions.push({ id: `${s.source_id}:PREAMBLE`, status: 'PREAMBLE_REQUIRES_COVERAGE', detail: sha256(text.slice(0, text.indexOf(firstBody))) });
      if (!topics.length) plan.blockers.push(`NO_PARSED_LESSONS:${s.source_id}`);
      const markerRules = rules.filter(r => r.op === 'classify_marker');
      for (const rule of markerRules) {
        const matches = topics.filter(t => t.body.includes(rule.anchor));
        if (rule.op === 'classify_marker' && rule.kind === 'SCHEME_ONLY' && matches.length === 0) {
          plan.dispositions.push({ id: rule.id, status: 'SCHEME_ONLY', detail: rule.evidence.locator });
        } else must(matches.length === 1, `marker ${rule.id} must bind exactly one parsed row`);
      }
      for (const t of topics) {
        must(t.title.trim() && t.title !== '(untitled)' && t.body.trim(), `empty lesson ${s.source_id}`);
        const id = originalLessonId(s.source_id, t.body);
        const markers = markerRules.filter(r => t.body.includes(r.anchor));
        must(markers.length <= 1, `ambiguous marker ${id}`);
        plan.dispositions.push({ id, status: markers.length ? (markers[0] as Extract<SourceRule, {op:'classify_marker'}>).kind : 'ORIGINAL', detail: s.archive_member });
        // Marker bodies are retained; classification is not authority to discard instructional lines.
        originals.push({ id, source_id: s.source_id, body_sha256: sha256(t.body), row: { filePath: input.filePath, className: 'SS 1', subjectName: p.canonical_subject, termLabel: s.term, weekLabel: t.weekLabel, title: t.title, sourceReference: t.body, orderIndex: 0 } });
      }
    }
    for (const r of p.source_rules) must(p.sources.some(s => s.source_id === r.source_id), `orphan rule ${r.id}`);
    for (const l of p.lessons) {
      must(l.id.startsWith(`SUP-SS1-${p.subject_slug.toUpperCase()}-`) && l.subject === p.canonical_subject && l.body_sha256 === sha256(l.body), `lesson identity/hash ${l.id}`);
      unique(l.practice.map(q => q.id), `practice IDs ${l.id}`);
      for (const q of l.practice) must(q.marks === q.marking.reduce((n, m) => n + m.marks, 0), `mark total ${l.id}/${q.id}`);
      if (l.state.implementation !== 'IMPLEMENTED' || l.state.content_approval !== 'APPROVED' || !l.state.approval_reference || l.provenance.some(s => s.reuse_status !== 'PERMITTED')) plan.blockers.push(`LESSON_NOT_APPROVED:${l.id}`);
      must(l.state.verification !== 'VERIFIED' || !!l.state.verification_reference, `verification evidence ${l.id}`);
      const body = renderLesson(l);
      supplements.push({ id: l.id, source_id: null, body_sha256: sha256(body), row: { filePath: `__ss1_supplements__/${p.subject_slug}/${l.id}`, className: 'SS 1', subjectName: l.subject, termLabel: l.term, weekLabel: 'supplement', orderIndex: 0, title: l.title, sourceReference: body } });
    }
    for (const item of p.open_items) if (item.blocks_delivery) plan.blockers.push(`OPEN_ITEM:${item.id}:${item.required_action}`);
  }
  // Preserve registry member order within each original bucket; never interleave supplements.
  const member = new Map(registry.map(s => [s.source_id, s.archive_member]));
  originals.sort((a, b) => (member.get(a.source_id!)! < member.get(b.source_id!)! ? -1 : member.get(a.source_id!)! > member.get(b.source_id!)! ? 1 : 0));
  supplements.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  plan.identified_rows = [...originals, ...supplements];
  unique(plan.identified_rows.map(r => r.id), 'lesson identity (identical bodies require explicit source resolution)');
  const byId = new Map(plan.identified_rows.map(r => [r.id, r]));
  const corrected = new Set<string>();
  for (const p of packages) {
    unique(p.coverage.map(c => c.id), 'coverage IDs');
    if (!p.coverage.length) plan.blockers.push(`NO_COVERAGE:${p.subject_slug}`);
    for (const source of p.sources) if (!p.coverage.some(c => c.source_id === source.source_id)) plan.blockers.push(`SOURCE_WITHOUT_COVERAGE:${source.source_id}`);
    for (const c of p.coverage) {
      must(p.sources.some(s => s.source_id === c.source_id), `coverage source ${c.id}`);
      for (const id of c.lesson_ids) {
        const marker = c.status === 'MARKER' && p.source_rules.some(r => r.id === id && r.source_id === c.source_id && r.op === 'classify_marker' && r.kind === 'SCHEME_ONLY') && plan.dispositions.some(d => d.id === id && d.status === 'SCHEME_ONLY');
        must(marker || (byId.has(id) && byId.get(id)!.row.subjectName === p.canonical_subject), `coverage target ${c.id}/${id}`);
      }
      if (c.status === 'PARTIAL' || c.status === 'UNRESOLVED') plan.blockers.push(`INCOMPLETE_COVERAGE:${c.id}`);
      else must(c.lesson_ids.length && c.evidence.length, `coverage proof required ${c.id}`);
      if (c.status === 'SUPPORTED') must(c.lesson_ids.some(id => byId.get(id)?.source_id !== null && byId.has(id)), `supported source lesson required ${c.id}`);
      if (c.status === 'MARKER') must(c.lesson_ids.every(id => plan.dispositions.some(d => d.id === id && ['REVISION', 'EXAMINATION', 'SCHEME_ONLY'].includes(d.status))), `marker classification required ${c.id}`);
      if (c.status === 'IMPLEMENTED_EQUIVALENT') must(c.lesson_ids.some(id => p.lessons.some(l => l.id === id)), `equivalent missing supplement ${c.id}`);
    }
    for (const c of p.delivery_corrections) {
      const original = byId.get(c.source_lesson_id), replacement = byId.get(c.replacement_id), source = p.sources.find(s => s.source_id === c.source_id);
      must(original && replacement && source && original.source_id === c.source_id && original.body_sha256 === c.body_sha256 && source.sha256 === c.source_sha256 && p.lessons.some(l => l.id === c.replacement_id) && original.row.termLabel === replacement.row.termLabel, `correction identity ${c.id}`);
      must(!corrected.has(c.source_lesson_id), `duplicate correction ${c.source_lesson_id}`); corrected.add(c.source_lesson_id);
      plan.corrections.push(c);
    }
    for (const a of p.assets) {
      must(byId.has(a.lesson_id) && byId.get(a.lesson_id)!.row.subjectName === p.canonical_subject, `asset target ${a.id}`);
      must(a.path.startsWith(`backend/src/db/ss1/assets/${p.subject_slug}/`) && !a.path.split('/').some(x => x === '..' || x === '.') && !a.path.includes('\\'), `asset path ${a.id}`);
      if (a.state.content_approval !== 'APPROVED' || !a.state.approval_reference || a.state.implementation !== 'IMPLEMENTED' || a.provenance.reuse_status !== 'PERMITTED') plan.blockers.push(`ASSET_NOT_APPROVED:${a.id}`);
      must(a.state.verification !== 'VERIFIED' || !!a.state.verification_reference, `asset verification evidence ${a.id}`);
      plan.assets.push(a);
    }
  }
  unique(plan.assets.map(a => a.id), 'asset IDs'); unique(plan.assets.map(a => `${a.lesson_id}:${a.order}`), 'asset position'); unique(plan.corrections.map(c => c.id), 'correction IDs');
  const counts = new Map<string, number>();
  for (const r of plan.identified_rows) { const k = JSON.stringify([r.row.className, r.row.subjectName, r.row.termLabel]); const n = (counts.get(k) ?? 0) + 1; counts.set(k, n); r.row.orderIndex = n; }
  plan.rows = plan.identified_rows.map(r => r.row);
  plan.blockers.sort(); plan.ready = plan.blockers.length === 0;
  return plan;
}
/** Used by later snapshot checks. Existing importer SQL repeats this guard transactionally. */
export function assertExistingCompatible(existing: Row[], planned: Row[]) {
  const key = (r: Row) => JSON.stringify([r.className, r.subjectName, r.termLabel, r.orderIndex]);
  const buckets = new Set(planned.map(r => JSON.stringify([r.className, r.subjectName, r.termLabel])));
  const map = new Map(planned.map(r => [key(r), r]));
  for (const r of existing) if (buckets.has(JSON.stringify([r.className, r.subjectName, r.termLabel]))) {
    const p = map.get(key(r)); must(p && p.title === r.title && p.sourceReference === r.sourceReference && p.filePath === r.filePath, `existing row mismatch ${key(r)}; migration must be reviewed separately`);
  }
}
