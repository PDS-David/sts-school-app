// Generic SS1 invariants over EVERY subject package and queue.
// Read-only: never edits content. Run (authorised verification stage only):
//   node --import tsx --test tests/ss1/_invariants.test.mts
// Each test collects ALL violations across all subjects and reports them with the exact
// subject and ID, so one run gives a complete defect list instead of the first failure.
// Unfinished packages are not failures (an empty package passes); only invalid ones are.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';

const root = new URL('../../', import.meta.url);
const subjectsDir = new URL('backend/src/db/ss1/subjects/', root);
const queueFor = (slug: string) => new URL(`docs/ss1/work/microtasks/${slug}/QUEUE.json`, root);
const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const slugs = readdirSync(subjectsDir).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort();
const load = (slug: string): any => JSON.parse(readFileSync(new URL(`${slug}.json`, subjectsDir), 'utf8'));
const loadQueue = (slug: string): any | null => existsSync(queueFor(slug)) ? JSON.parse(readFileSync(queueFor(slug), 'utf8')) : null;
const DONE = 'IMPLEMENTED_TESTING_DEFERRED';

function report(name: string, problems: string[]) {
  assert.equal(problems.length, 0, `${name}: ${problems.length} violation(s)\n  ` + problems.slice(0, 60).join('\n  ') + (problems.length > 60 ? `\n  ... ${problems.length - 60} more` : ''));
}
const dups = (ids: string[]) => ids.filter((x, i) => ids.indexOf(x) !== i);

test('there is a package file for the expected set of SS1 subjects', () => {
  assert(slugs.length >= 21, `only ${slugs.length} subject packages found`);
});

test('every package parses against the frozen schema', () => {
  const p: string[] = [];
  for (const s of slugs) {
    const r = packageSchema.safeParse(load(s));
    if (r.success) continue;
    const raw = load(s);
    const seen = new Set<string>();
    for (const i of r.error.issues) {
      const rec = raw[i.path[0] as string]?.[i.path[1] as number];
      const k = `${i.code}|${i.path.filter(x => typeof x !== 'number').join('.')}`;
      if (seen.has(k) && seen.size > 6) continue; seen.add(k);
      p.push(`${s}: ${i.path.join('.')} [id=${rec?.id ?? rec?.lesson_id ?? '-'}] ${i.code}: ${i.message.slice(0, 80)}`);
    }
  }
  report('schema', p);
});

test('package identity: slug matches file, schema version, package_status stays PENDING', () => {
  const p: string[] = [];
  for (const s of slugs) {
    const j = load(s);
    if (j.subject_slug !== s) p.push(`${s}: subject_slug is ${j.subject_slug}`);
    if (j.schema_version !== 'ss1-subject-v1') p.push(`${s}: schema_version ${j.schema_version}`);
    if (j.package_status !== 'PENDING') p.push(`${s}: package_status is ${j.package_status}, expected PENDING (no certification is recorded)`);
    for (const src of j.sources ?? []) if (src.class_name !== 'SS 1') p.push(`${s}: source ${src.source_id} class_name ${src.class_name}`);
  }
  report('identity', p);
});

test('IDs are unique within every collection', () => {
  const p: string[] = [];
  for (const s of slugs) {
    const j = load(s);
    const sets: Record<string, string[]> = {
      lessons: (j.lessons ?? []).map((x: any) => x.id), coverage: (j.coverage ?? []).map((x: any) => x.id),
      open_items: (j.open_items ?? []).map((x: any) => x.id), delivery_corrections: (j.delivery_corrections ?? []).map((x: any) => x.id),
      source_rules: (j.source_rules ?? []).map((x: any) => x.id), sources: (j.sources ?? []).map((x: any) => x.source_id),
    };
    for (const [k, ids] of Object.entries(sets)) for (const d of new Set(dups(ids))) p.push(`${s}: duplicate ${k} id ${d}`);
    const q = loadQueue(s);
    if (q) for (const d of new Set(dups(q.items.map((t: any) => t.id)))) p.push(`${s}: duplicate queue item id ${d}`);
  }
  report('unique ids', p);
});

test('lesson bodies hash exactly and marking is complete and totals correctly', () => {
  const p: string[] = [];
  for (const s of slugs) for (const l of load(s).lessons ?? []) {
    if (sha(l.body) !== l.body_sha256) p.push(`${s}: ${l.id} body_sha256 does not match the UTF-8 body`);
    if (!l.objectives?.length) p.push(`${s}: ${l.id} has no objectives`);
    if (!l.practice?.length) p.push(`${s}: ${l.id} has no practice`);
    if (l.class_name !== 'SS 1') p.push(`${s}: ${l.id} class_name ${l.class_name}`);
    for (const q of l.practice ?? []) {
      if (!String(q.answer ?? '').trim()) p.push(`${s}: ${l.id}/${q.id} has an empty answer`);
      const t = (q.marking ?? []).reduce((n: number, m: any) => n + m.marks, 0);
      if (q.marks !== t) p.push(`${s}: ${l.id}/${q.id} marks ${q.marks} != marking total ${t}`);
      if ((q.marking ?? []).some((m: any) => !String(m.criterion ?? '').trim() || !(m.marks > 0))) p.push(`${s}: ${l.id}/${q.id} has a blank criterion or non-positive mark`);
    }
  }
  report('lessons', p);
});

function knownIds(slug: string, j: any): { ids: Set<string>; sourceIds: Set<string> } {
  const ids = new Set<string>(); const sourceIds = new Set<string>();
  for (const k of ['lessons', 'coverage', 'delivery_corrections', 'source_rules', 'open_items', 'assets'])
    for (const x of j[k] ?? []) if (x.id) ids.add(x.id);
  for (const x of j.sources ?? []) { ids.add(x.source_id); sourceIds.add(x.source_id); }
  for (const t of loadQueue(slug)?.items ?? []) ids.add(t.id);
  return { ids, sourceIds };
}
function resolves(ref: string, ids: Set<string>, sourceIds: Set<string>): boolean {
  if (ids.has(ref)) return true;
  const m = /^(SS1-SRC-[0-9a-f]{12})(?::|$)/.exec(ref);   // source body / locator reference
  return !!m && sourceIds.has(m[1]);
}

test('coverage and open-item references resolve (packages, source locators or queue items)', () => {
  const p: string[] = [];
  for (const s of slugs) {
    const j = load(s); const { ids, sourceIds } = knownIds(s, j);
    for (const c of j.coverage ?? []) {
      if (!sourceIds.has(c.source_id)) p.push(`${s}: coverage ${c.id} source_id ${c.source_id} is not a registered source`);
      for (const r of c.lesson_ids ?? []) if (!resolves(r, ids, sourceIds)) p.push(`${s}: coverage ${c.id} lesson_ids -> ${r} does not resolve`);
    }
    for (const o of j.open_items ?? []) for (const r of o.affected_ids ?? []) if (!resolves(r, ids, sourceIds)) p.push(`${s}: open item ${o.id} affected_ids -> ${r} does not resolve`);
  }
  report('references', p);
});

test('every PARTIAL or UNRESOLVED coverage entry is referenced by an open item (subjects whose source indexing is complete)', () => {
  // The indexing done-condition requires this for indexed content. Subjects that still have source
  // indexing items open hold pre-indexing placeholder entries, so they are reported, not failed.
  const p: string[] = []; const info: string[] = [];
  for (const s of slugs) {
    const j = load(s); const q = loadQueue(s);
    const indexingComplete = !!q && q.items.filter((t: any) => String(t.kind).startsWith('SOURCE_')).every((t: any) => t.status === DONE);
    const ref = new Set<string>((j.open_items ?? []).flatMap((o: any) => o.affected_ids ?? []));
    const miss = (j.coverage ?? []).filter((c: any) => (c.status === 'PARTIAL' || c.status === 'UNRESOLVED') && !ref.has(c.id));
    if (indexingComplete) for (const c of miss) p.push(`${s}: coverage ${c.id} is ${c.status} with no open item`);
    else if (miss.length) info.push(`${s}=${miss.length}`);
  }
  if (info.length) console.log(`# INFO partial/unresolved entries without an open item in subjects still being indexed: ${info.join(', ')}`);
  report('open items', p);
});

test('no lesson or package records invented approval, verification or acceptance', () => {
  const p: string[] = [];
  for (const s of slugs) {
    const j = load(s);
    for (const l of j.lessons ?? []) {
      const st = l.state ?? {};
      if (st.content_approval !== 'PENDING') p.push(`${s}: ${l.id} content_approval ${st.content_approval}`);
      if (st.verification !== 'DEFERRED') p.push(`${s}: ${l.id} verification ${st.verification}`);
      if (st.approval_reference != null) p.push(`${s}: ${l.id} approval_reference is set`);
      if (st.verification_reference != null) p.push(`${s}: ${l.id} verification_reference is set`);
    }
    for (const a of j.assets ?? []) {
      const st = a.state ?? {};
      if (st.content_approval && st.content_approval !== 'PENDING') p.push(`${s}: asset ${a.id} content_approval ${st.content_approval}`);
      if (st.verification && st.verification !== 'DEFERRED') p.push(`${s}: asset ${a.id} verification ${st.verification}`);
    }
  }
  report('state', p);
});

test('delivery corrections bind a same-term replacement and preserve source identity', () => {
  const p: string[] = [];
  for (const s of slugs) {
    const j = load(s);
    const src = new Map<string, any>((j.sources ?? []).map((x: any) => [x.source_id, x]));
    const les = new Map<string, any>((j.lessons ?? []).map((x: any) => [x.id, x]));
    const targets: string[] = [];
    for (const c of j.delivery_corrections ?? []) {
      const so = src.get(c.source_id); const le = les.get(c.replacement_id);
      if (!so) { p.push(`${s}: ${c.id} source ${c.source_id} not registered`); continue; }
      if (!le) { p.push(`${s}: ${c.id} replacement ${c.replacement_id} is not a lesson`); continue; }
      if (c.source_sha256 !== so.sha256) p.push(`${s}: ${c.id} source_sha256 differs from the registered source`);
      if (le.term !== so.term) p.push(`${s}: ${c.id} replacement term ${le.term} != source term ${so.term}`);
      if (!/^[0-9a-f]{64}$/.test(c.body_sha256 ?? '')) p.push(`${s}: ${c.id} body_sha256 is not a SHA-256`);
      targets.push(`${c.source_id}:${c.body_sha256}`);
    }
    for (const d of new Set(dups(targets))) p.push(`${s}: two corrections target the same source body ${d}`);
  }
  report('corrections', p);
});

test('every lesson has provenance with a rights basis and a reuse status', () => {
  const p: string[] = []; const warn: string[] = [];
  for (const s of slugs) for (const l of load(s).lessons ?? []) {
    if (!l.provenance?.length) { p.push(`${s}: ${l.id} has no provenance`); continue; }
    for (const r of l.provenance) {
      if (!String(r.rights ?? '').trim()) p.push(`${s}: ${l.id} provenance "${r.title}" has no rights basis`);
      if (!['PERMITTED', 'PENDING'].includes(r.reuse_status)) p.push(`${s}: ${l.id} provenance "${r.title}" reuse_status ${r.reuse_status}`);
      if (r.url && !/^https?:\/\//.test(r.url)) p.push(`${s}: ${l.id} provenance url ${r.url} is not http(s)`);
      if (r.reuse_status === 'PERMITTED' && /not (re-?checked|fetched|opened)/i.test(r.locator ?? '')) warn.push(`${s}: ${l.id} "${r.title}" is PERMITTED but its locator says the page was not opened`);
    }
  }
  if (warn.length) console.log(`# WARN ${warn.length} PERMITTED reference(s) not opened by the author, e.g. ${warn.slice(0, 3).join(' || ')}`);
  report('provenance', p);
});

test('queue files parse and their counts, dependencies and next_runnable are consistent', () => {
  const p: string[] = [];
  for (const s of slugs) {
    const q = loadQueue(s); if (!q) { p.push(`${s}: no QUEUE.json`); continue; }
    const by = new Map<string, any>(q.items.map((t: any) => [t.id, t]));
    const vocab: string[] = q.status_vocabulary ?? [];
    for (const t of q.items) {
      if (vocab.length && !vocab.includes(t.status)) p.push(`${s}: ${t.id} status ${t.status} not in vocabulary`);
      if (t.status === 'IN_PROGRESS') p.push(`${s}: ${t.id} is IN_PROGRESS (claims, not the queue, mark work in progress)`);
      for (const d of t.depends_on ?? []) if (!by.has(d)) p.push(`${s}: ${t.id} depends on missing ${d}`);
    }
    const recount: Record<string, number> = {};
    for (const t of q.items) recount[t.status] = (recount[t.status] ?? 0) + 1;
    for (const [k, v] of Object.entries<number>(q.status_counts ?? {})) if ((recount[k] ?? 0) !== v) p.push(`${s}: status_counts.${k}=${v} but recount is ${recount[k] ?? 0}`);
    for (const [k, v] of Object.entries(recount)) if (!(k in (q.status_counts ?? {}))) p.push(`${s}: status_counts is missing ${k} (${v})`);
    if (q.counts && typeof q.counts === 'object') {
      const kinds: Record<string, number> = {};
      for (const t of q.items) kinds[t.kind] = (kinds[t.kind] ?? 0) + 1;
      for (const [k, v] of Object.entries<number>(q.counts)) if (typeof v === 'number' && k in kinds && kinds[k] !== v) p.push(`${s}: counts.${k}=${v} but recount is ${kinds[k]}`);
    }
    if (Array.isArray(q.next_runnable)) {
      const want = q.items.filter((t: any) => t.status === 'PENDING' && (t.depends_on ?? []).every((d: string) => by.get(d)?.status === DONE)).map((t: any) => t.id);
      const a = new Set<string>(q.next_runnable), b = new Set<string>(want);
      for (const x of want) if (!a.has(x)) p.push(`${s}: next_runnable is missing eligible ${x}`);
      for (const x of q.next_runnable) if (!b.has(x)) p.push(`${s}: next_runnable lists ineligible ${x}`);
    }
  }
  report('queues', p);
});

test('no extracted originals or renderings are tracked outside the registered archive', () => {
  const files = execFileSync('git', ['ls-files'], { cwd: new URL(root).pathname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n').filter(Boolean);
  const p: string[] = [];
  for (const f of files) {
    if (f === 'docs/ss1/sources/SSS1-original.zip') continue;
    if (/^docs\/ss1\//.test(f) && /\.(docx?|rtf|odt|zip|pdf|png|jpe?g|gif|tiff?)$/i.test(f)) p.push(`tracked original/rendering: ${f}`);
  }
  report('hygiene', p);
});
