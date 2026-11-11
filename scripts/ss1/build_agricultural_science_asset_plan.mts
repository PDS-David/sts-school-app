#!/usr/bin/env node
/**
 * End-to-end Agricultural Science asset-plan handoff.
 * Run after private, hash-bound source staging; it does not access PostgreSQL.
 *
 *   python scripts/ss1/prepare_sources.py --archive docs/ss1/sources/SSS1-original.zip --output <private-stage>
 *   node --import tsx scripts/ss1/build_agricultural_science_asset_plan.mts --staged-root <private-stage> --out-dir <private-output>
 */
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import path from 'node:path';
import mammoth from 'mammoth';
// @ts-ignore — word-extractor ships no TypeScript declarations
import WordExtractor from 'word-extractor';
import packageData from '../../backend/src/db/ss1/subjects/agricultural-science.json' with { type: 'json' };
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { buildFromFiles } from '../../backend/src/db/ss1/loader.ts';
import { parseTopics } from '../../backend/src/db/ingestTopics.ts';
import { buildAssetPlan, writeAssetPlanArtifacts } from './build_asset_plan.mjs';

const arg = (name: string) => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
};
const stagedRoot = arg('staged-root');
const outDir = arg('out-dir');
if (!stagedRoot || !outDir) throw new Error('Required: --staged-root <private-source-stage> --out-dir <new-private-output-directory>');
const root = path.resolve(stagedRoot);
const stageStat = lstatSync(root);
if (!stageStat.isDirectory() || stageStat.isSymbolicLink()) throw new Error('Staged source root must be a real directory, not a symlink.');
const stageManifestPath = path.join(root, 'STAGING.json');
if (!existsSync(stageManifestPath)) throw new Error('Missing STAGING.json; create this directory with scripts/ss1/prepare_sources.py.');
const stageManifest = JSON.parse(readFileSync(stageManifestPath, 'utf8'));
if (stageManifest.archive_sha256 !== '024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e') {
  throw new Error('Staged source archive hash does not match the registered SS1 source archive.');
}
const repoRoot = process.cwd();
if (!existsSync(path.join(repoRoot, 'backend/src/db/ss1/subjects/agricultural-science.json'))) {
  throw new Error('Run this command from the repository root.');
}
const subjectPackage = packageSchema.parse(packageData);
const files = subjectPackage.sources.map(source => path.resolve(root, source.archive_member));
for (const source of subjectPackage.sources) {
  const staged = stageManifest.sources.find((item: any) => item.archive_member === source.archive_member);
  if (!staged || staged.sha256 !== source.sha256 || !Number.isSafeInteger(Number(staged.bytes)) || Number(staged.bytes) <= 0) {
    throw new Error(`Staged source manifest does not match package source ${source.source_id}.`);
  }
}
for (let index = 0; index < files.length; index++) {
  if (!existsSync(files[index])) throw new Error(`Missing staged source member: ${subjectPackage.sources[index].archive_member}`);
}
const wordExtractor = new WordExtractor();
const extract = async (file: string): Promise<string> => {
  const extension = path.extname(file).toLowerCase();
  if (extension === '.doc') {
    const document = await wordExtractor.extract(file);
    const text = document.getBody();
    if (!text.trim()) throw new Error(`Source extraction returned no text: ${file}`);
    return text;
  }
  if (extension === '.docx' || extension === '.docm') {
    const document = await mammoth.extractRawText({ path: file });
    if (!document.value.trim()) throw new Error(`Source extraction returned no text: ${file}`);
    return document.value;
  }
  throw new Error(`Unsupported Agricultural Science source format: ${extension}`);
};

const { plan } = await buildFromFiles(root, files, extract, parseTopics, subjectPackage.subject_slug);
const compilerPlan = {
  assets: plan.assets,
  identified_rows: plan.identified_rows.map(item => ({
    id: item.id,
    source_id: item.source_id,
    body_sha256: item.body_sha256,
    row: {
      className: item.row.className,
      subjectName: item.row.subjectName,
      termLabel: item.row.termLabel,
      orderIndex: item.row.orderIndex,
      title: item.row.title,
    },
  })),
};
const result = buildAssetPlan({ compilerPlan, subjectPackage, repoRoot });
const output = writeAssetPlanArtifacts({ result, subjectPackage, outDir: path.resolve(outDir) });
if (!output.ready) {
  console.error(`BLOCKED: no attachable CSV emitted. Report: ${output.reportPath}`);
  for (const blocker of result.blockers) console.error(` - ${blocker}`);
  process.exitCode = 2;
} else {
  console.log(`READY: ${result.records.length} approved asset(s), ${output.manifestPaths.length} manifest(s).`);
  for (const manifestPath of output.manifestPaths) console.log(manifestPath);
}
