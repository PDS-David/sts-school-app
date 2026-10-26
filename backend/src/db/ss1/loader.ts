import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema } from './subjectPackageSchema.js';
import { compilePackages, registeredSubjects, registry, sha256, type ParsedTopic, type SourceInput } from './compiler.js';
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
export function loadPackages(directory = path.join(moduleDir, 'subjects')) {
  const files = existsSync(directory) ? readdirSync(directory).filter(f => f.endsWith('.json')).sort() : [];
  for (const f of files) if (!registeredSubjects.includes(f.slice(0, -5))) throw new Error(`SS1 unregistered package file ${f}`);
  return files.map(f => {
    const p = packageSchema.parse(JSON.parse(readFileSync(path.join(directory, f), 'utf8')));
    if (`${p.subject_slug}.json` !== f) throw new Error(`SS1 package filename/slug mismatch ${f}`);
    return p;
  });
}
export async function buildFromFiles(root: string, files: string[], extract: (file: string) => Promise<string>, parse: (text: string) => ParsedTopic[]) {
  const packages = loadPackages();
  const inputs: SourceInput[] = [];
  const owned = new Set<string>();
  for (const source of registry) {
    // Root is the NEW_DIR produced by prepare_sources.py, preserving archive member paths.
    const file = path.resolve(root, source.archive_member);
    if (!files.some(f => path.resolve(f) === file)) continue;
    if (!realpathSync(file).startsWith(realpathSync(root) + path.sep)) throw new Error(`SS1 source escaped root ${source.source_id}`);
    const bytes = readFileSync(file);
    if (sha256(bytes) !== source.sha256 || bytes.length !== Number(source.bytes)) throw new Error(`SS1 source hash/size mismatch ${source.source_id}`);
    inputs.push({ source_id: source.source_id, sha256: source.sha256, filePath: file, text: await extract(file) });
    owned.add(file);
  }
  const plan = compilePackages(packages, inputs, parse);
  const source_previews = inputs.map(input => ({ source_id: input.source_id, sha256: input.sha256, topics: parse(input.text).map(topic => ({ ...topic, id: `${input.source_id}:BODY:${sha256(topic.body)}`, body_sha256: sha256(topic.body) })) }));
  const repoRoot = path.resolve(moduleDir, '../../../..');
  for (const a of plan.assets) {
    const file = path.resolve(repoRoot, a.path);
    if (!existsSync(file)) { plan.blockers.push(`MISSING_ASSET:${a.id}`); continue; }
    const real = realpathSync(file);
    if (!real.startsWith(realpathSync(repoRoot) + path.sep) || !statSync(file).isFile()) throw new Error(`SS1 asset escape/non-file ${a.id}`);
    const bytes = readFileSync(file);
    if (bytes.length !== a.bytes || sha256(bytes) !== a.sha256) throw new Error(`SS1 asset hash/size ${a.id}`);
  }
  plan.blockers.sort(); plan.ready = plan.blockers.length === 0;
  return { plan: { ...plan, source_previews }, owned };
}
