// Subject-specific CI guard. This checks package structure, real source parser/compiler identities,
// and the correction adapter's fail-closed approval/fingerprint logic. It does not certify authenticated route behavior,
// teacher approval, database import or release readiness.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules, compilePackages } from '../../backend/src/db/ss1/compiler.ts';
import { parseTopics } from '../../backend/src/db/ingestTopics.ts';
import { createAgriculturalScienceDeliveryResolver, createAgriculturalScienceAssetDeliveryResolver, safeAgriculturalScienceTopic } from '../../backend/src/utils/ss1AgriculturalScienceDeliveryCorrection.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/agricultural-science.json', import.meta.url), 'utf8'));
const manifestText = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');

// Small CSV reader for this plain-text manifest, including quoted commas and escaped quotes.
function parseCsv(value: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (quoted) {
      if (char === '"' && value[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field.length === 0) quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') {
      row.push(field);
      if (row.some(cell => cell.length > 0)) rows.push(row);
      row = []; field = '';
    } else if (char !== '\r') field += char;
  }
  assert.equal(quoted, false, 'manifest CSV must not end inside a quoted field');
  if (row.length || field.length) { row.push(field); if (row.some(cell => cell.length > 0)) rows.push(row); }
  return rows;
}

const manifestRows = parseCsv(manifestText);
const manifestHeader = manifestRows[0] ?? [];
const manifest = manifestRows.slice(1).map(cells =>
  Object.fromEntries(manifestHeader.map((key, index) => [key, cells[index] ?? '']))
);
const assigned = manifest.filter(row => row.assigned_subject_slug === 'agricultural-science');

test('Agricultural Science package follows the frozen SS1 schema and registers all assigned terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.schema_version, 'ss1-subject-v1');
  assert.equal(p.subject_slug, 'agricultural-science');
  assert.equal(p.canonical_subject, 'Agricultural Science');
  assert.deepEqual(p.sources.map(source => source.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert.equal(p.sources.length, assigned.length, 'exactly one registered source per assigned manifest document');
  assert.equal(new Set(p.sources.map(source => source.source_id)).size, p.sources.length);
  assert.equal(new Set(p.sources.map(source => source.archive_member)).size, p.sources.length);
});

test('Every registered source identity, SHA-256 and archive member matches SOURCE_ASSIGNMENTS.csv', () => {
  const p = packageSchema.parse(raw);
  assert.deepEqual(
    p.sources.map(source => ({
      source_id: source.source_id,
      sha256: source.sha256,
      archive_member: source.archive_member,
      term: source.term,
      class_name: source.class_name,
      canonical_subject: source.canonical_subject,
    })).sort((a, b) => a.source_id.localeCompare(b.source_id)),
    assigned.map(row => ({
      source_id: row.source_id,
      sha256: row.sha256,
      archive_member: row.archive_member,
      term: row.term_from_folder,
      class_name: 'SS 1',
      canonical_subject: 'Agricultural Science',
    })).sort((a, b) => a.source_id.localeCompare(b.source_id)),
  );
  for (const row of assigned) {
    assert.match(row.sha256, /^[a-f0-9]{64}$/);
    assert(row.archive_member.length > 0);
    assert(['1st Term', '2nd Term', '3rd Term'].includes(row.term_from_folder));
  }
});

test('Source rules bind registered hashes and source aliases require a recorded owner decision', () => {
  const p = packageSchema.parse(raw);
  const aliasDecisionPath = 'docs/ss1/work/microtasks/agricultural-science/OWNER-DEC-AL-20261111.md#DEC-AL-AG-2026-11-11';
  const aliasDecision = readFileSync(new URL('../../docs/ss1/work/microtasks/agricultural-science/OWNER-DEC-AL-20261111.md', import.meta.url), 'utf8');
  const approvedAliasIds = new Set([
    'SS1-SRC-7aa642b0085b-R001',
    'SS1-SRC-956594d97094-R001',
    'SS1-SRC-458a07f7ea5a-R001',
  ]);
  const aliases = p.source_rules.filter(rule => rule.op === 'source_alias');
  assert.equal(aliases.length, 3, 'the three registered term headings each need one explicit alias rule');
  for (const rule of p.source_rules) {
    const source = p.sources.find(candidate => candidate.source_id === rule.source_id);
    assert(source, `rule ${rule.id} must reference a registered source`);
    assert.equal(rule.source_sha256, source.sha256, `rule ${rule.id} must bind the registered source hash`);
    assert(rule.anchor.trim().length > 0);
    if (rule.op === 'source_alias') {
      if (approvedAliasIds.has(rule.id)) {
        assert.equal(rule.approval_reference, aliasDecisionPath, 'approved aliases must cite the exact owner decision record');
        assert.match(aliasDecision, new RegExp(rule.id));
        const pendingOwnerAction = p.open_items.find(item =>
          item.kind === 'OWNER_ACTION' &&
          item.blocks_delivery &&
          item.affected_ids.includes(rule.id) &&
          item.affected_ids.includes(rule.source_id)
        );
        assert.equal(pendingOwnerAction, undefined, `approved alias ${rule.id} must not remain an open owner action`);
      } else {
        assert.match(rule.approval_reference, /^PENDING-OWNER:/, 'an unapproved source-heading alias must not invent owner approval');
        const pendingOwnerAction = p.open_items.find(item =>
          item.kind === 'OWNER_ACTION' &&
          item.blocks_delivery &&
          item.affected_ids.includes(rule.id) &&
          item.affected_ids.includes(rule.source_id)
        );
        assert(pendingOwnerAction, `unapproved alias ${rule.id} needs a blocking owner-approval item`);
      }
    }
  }
  assert.match(aliasDecision, /FIRST TERM E-LEARNING NOTE/);
  assert.match(aliasDecision, /SECOND TERM E-LEARNING NOTE/);
  assert.match(aliasDecision, /THIRD TERM E-LEARNING NOTE/);
});

test('No lesson claims unreferenced approval or completed verification', () => {
  const p = packageSchema.parse(raw);
  for (const lesson of p.lessons) {
    assert.equal(lesson.state.content_approval === 'APPROVED', Boolean(lesson.state.approval_reference));
    assert.equal(lesson.state.verification === 'VERIFIED', Boolean(lesson.state.verification_reference));
    assert.equal(hash(lesson.body), lesson.body_sha256, `lesson body hash ${lesson.id}`);
    assert.equal(lesson.subject, p.canonical_subject);
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0 && lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert(question.answer.trim().length > 0, `complete answer required: ${lesson.id}/${question.id}`);
      assert.equal(question.marks, question.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
      assert(question.marking.every(criterion => criterion.criterion.trim() && criterion.marks > 0));
    }
  }
});

test('Agricultural Science source-rule guards reject wrong hashes and missing or ambiguous anchors', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const input = { source_id: rule.source_id, sha256: rule.source_sha256, filePath: 'synthetic-scope-probe.docx', text: rule.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [rule]), /missing/);
  }
});

// This CI test executes the real parser/compiler in a source-only plan. Full learner-route delivery,
// database rehearsal, asset rendering, subject-expert approval and release verification remain separate.


test('Agricultural Science original row identities match the real Mammoth parser and SS1 compiler', async () => {
  const p = packageSchema.parse(raw);
  const archiveBytes = readFileSync(new URL('../../docs/ss1/sources/SSS1-original.zip', import.meta.url));
  const archive = await JSZip.loadAsync(archiveBytes);
  const inputs = [];

  for (const source of p.sources) {
    const member = archive.file(source.archive_member);
    assert(member, `archive member missing: ${source.archive_member}`);
    const bytes = await member.async('nodebuffer');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256, `source bytes changed: ${source.source_id}`);
    const extracted = await mammoth.extractRawText({ buffer: bytes });
    inputs.push({
      source_id: source.source_id,
      sha256: source.sha256,
      filePath: source.archive_member,
      text: extracted.value,
    });
  }

  const plan = compilePackages([p], inputs, parseTopics);
  const identified = new Map(plan.identified_rows.map(row => [row.id, row]));
  const expectedOriginalRowIds = [
    'SS1-SRC-7aa642b0085b:BODY:eb23c6d757163ec4e7bfce9f79ede198e00e4437be3317ac9781b3e9dec6c2b9',
    'SS1-SRC-7aa642b0085b:BODY:94ffd0f85730fc3f1804f07342e16b1da91dd1323231b7fb6e41b11b96f8cf35',
    'SS1-SRC-7aa642b0085b:BODY:de6febf42e9195e6171f87f05840f7ac0d5a7337820ec98392670ebc3b1485aa',
    'SS1-SRC-7aa642b0085b:BODY:0c1b6e6e543aa10d8aaeb5963231c20ff8e3c3a58be635e0071c1dbc052eb244',
    'SS1-SRC-7aa642b0085b:BODY:6388d1c618d180353e769423def1f31de4b76cf5b07fd218d957f0d807c9bedc',
    'SS1-SRC-7aa642b0085b:BODY:599c15d5fc22a602566d6336b315c0b49710b870d1be5090881a6820f144adbb',
    'SS1-SRC-7aa642b0085b:BODY:43f4fb240312605deaf233087f1673161e8070b3db0e801fcf2f5d99846df7cb',
    'SS1-SRC-7aa642b0085b:BODY:bcd8c0ecc2862267e6f54895abbff1a39a16ded4137d630c3c931d13b1c6910a',
    'SS1-SRC-7aa642b0085b:BODY:e09cfcf9d560ec4b441526635970e83b8beddb0b9c7b38e33232df037351c064',
    'SS1-SRC-7aa642b0085b:BODY:007f80ec64ec9dafb7a327359ba0ada8605d18109b826ab6ed39e1fe86fcc658',
    'SS1-SRC-956594d97094:BODY:3d8958e8d868273f4f1ee87c24a7096de404fb15a6eeb93197f05299ff37e7c0',
    'SS1-SRC-956594d97094:BODY:9b05ec628817f7406a90c51277a6e8fe5c6318c250a89cd9a819d6c529b29797',
    'SS1-SRC-956594d97094:BODY:12d2bff62a3b676cec1218abdde9a8f57a09e2057bd5f6d880e50cb0dee77886',
    'SS1-SRC-956594d97094:BODY:5e12e6d75046c73227b73e5a70eb56fd6a83ccbaf4d206b9dc3d4cc609e008f6',
    'SS1-SRC-956594d97094:BODY:d6a132c9ce637c6fee7ca4e1e88aa707220a68298bde2794d5657e49533c9e22',
    'SS1-SRC-956594d97094:BODY:1f941dd52a764e5665229f0caad9aa3a3bca2ecf1ffad1ac4f3810601bfa573b',
    'SS1-SRC-956594d97094:BODY:1d566e884981c34293a7c08a90ce5177dc063ea5813da9a7f27e69e09c5f77ee',
    'SS1-SRC-956594d97094:BODY:a729dbf0c8f75421a7983e1a36a0c72ccb9378dd4ac4f25148f4d0c2dd30d36c',
    'SS1-SRC-458a07f7ea5a:BODY:0c06c5383b974616b0e06a23a1165fe3beeeec8b89b232c0383f83a6d2e056ff',
    'SS1-SRC-458a07f7ea5a:BODY:57c54e51896e3d54fcb43c690c056b45ebcfffd8e132e8bc5038de6c0ea5879b',
    'SS1-SRC-458a07f7ea5a:BODY:926ec9d0dd8bfdeebfd345eb9bd0f034b7d4ae770706b3345351f3d28294cc32',
    'SS1-SRC-458a07f7ea5a:BODY:4929a8943042eca1d591fc065d91d0ab52c0d08b429501ed8a70f94582daf9c9',
    'SS1-SRC-458a07f7ea5a:BODY:8637bc0cb41adbde83ca0d9a532217d60ec206a8cff04e088fb2f14d7854f394',
    'SS1-SRC-458a07f7ea5a:BODY:32a9361d7a977244ca32d9f64c9279aef6edec9ca35ca915dd87ff11f8030daa',
    'SS1-SRC-458a07f7ea5a:BODY:15f96ac5ec76ec2f957b90b0f4ecfb688cf23f30a8999cd0fe80383d2eb108bf',
    'SS1-SRC-458a07f7ea5a:BODY:791302b51e960fafa427a66d0b1ce1f662567b3bb9bb9c374531d39c2ed1e5de',
    'SS1-SRC-458a07f7ea5a:BODY:b431485e025fd5054046a9041249f1b34a5042973238fbf2b652cbf27fbf4ef7',
    'SS1-SRC-458a07f7ea5a:BODY:705e543e7a04a9a5058603f332ba4a44c4e81c4f6ab98b0571e6edcde4efb31b',
  ].sort();
  assert.deepEqual(
    plan.identified_rows.filter(row => row.source_id !== null).map(row => row.id).sort(),
    expectedOriginalRowIds,
    'all 30 original lesson IDs must match the hash-pinned source archive and actual parser',
  );

  // Emit the exact parser/compiler identities for source rows so any correction
  // binding is based on the real importer output, not a reconstructed hash map.
  console.log('AGRICULTURAL_SOURCE_ROW_IDENTITIES', JSON.stringify(
    plan.identified_rows
      .filter(row => row.source_id !== null)
      .map(row => ({
        id: row.id,
        source_id: row.source_id,
        week_label: row.row.weekLabel,
        title: row.row.title,
        body_sha256: row.body_sha256,
      })),
    null,
    2,
  ));

  for (const source of p.sources) {
    assert(
      plan.identified_rows.some(row => row.source_id === source.source_id),
      `actual parser/compiler produced no original rows for ${source.source_id}`,
    );
  }

  for (const correction of p.delivery_corrections) {
    assert(identified.has(correction.source_lesson_id), `correction source row is not compiler-identified: ${correction.id}`);
    assert(identified.has(correction.replacement_id), `correction replacement is not compiler-identified: ${correction.id}`);
  }

  for (const coverage of p.coverage) {
    for (const id of coverage.lesson_ids) {
      if (id.includes(':BODY:')) {
        assert(identified.has(id), `coverage references an unrecognized original source row: ${coverage.id} -> ${id}`);
      }
    }
  }
});


test('Agricultural Science learner delivery withholds corrected source rows until package and lesson approval gates pass', async () => {
  const p = packageSchema.parse(raw);
  const archiveBytes = readFileSync(new URL('../../docs/ss1/sources/SSS1-original.zip', import.meta.url));
  const archive = await JSZip.loadAsync(archiveBytes);
  const inputs = [];
  for (const source of p.sources) {
    const member = archive.file(source.archive_member);
    assert(member, `archive member missing: ${source.archive_member}`);
    const bytes = await member.async('nodebuffer');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256);
    const extracted = await mammoth.extractRawText({ buffer: bytes });
    inputs.push({ source_id: source.source_id, sha256: source.sha256, filePath: source.archive_member, text: extracted.value });
  }
  const plan = compilePackages([p], inputs, parseTopics);
  const resolver = createAgriculturalScienceDeliveryResolver(p);
  const sourceTitles: Record<string, string> = {
    'CORR-AG-T1-W09-ENVIRONMENTAL-FACTORS-REPLACEMENT': 'ENVIRONMENTAL FACTORS AFFECTING AGRICULTURAL PRODUCTION (CROPAND ANIMAL DISTRIBUTION AND PRODUCTION)',
    'CORR-AG-T3-W01-TOOL-NAMES-REPLACEMENT': 'SIMPLE FARM TOOLS',
    'CORR-AG-T2-W07-PEAT-TYPO-REPLACEMENT': 'ROCK FORMATION AND TYPES',
    'CORR-AG-T2-W08-QUESTION-WORDING-REPLACEMENT': 'ROCK WEATHERING',
    'CORR-AG-T2-W09-SOIL-TERMS-REPLACEMENT': 'FACTORS OF SOIL FORMATION',
    'CORR-AG-T2-W06-AGRICULTURAL-ECOLOGY-REPLACEMENT': 'AGRICULTURAL ECOLOGY',
    'CORR-AG-T2-W02-03-CULTURAL-PRACTICES-REPLACEMENT': 'CULTURAL PRACTICES',
    'CORR-AG-T2-W04-05-SELECTED-CROPS-REPLACEMENT': 'HUSBANDRY AND CULTIVATION OF SOME SELECTED CROPS',
    'CORR-AG-T1-W03-STORAGE-REPLACEMENT': 'PROBLEMS OF AGRICULTURAL DEVELOPMENT IN NIGERIA AND THEIR POSSIBLE SOLUTIONS',
    'CORR-AG-T3-W02-POWER-WATER-REPLACEMENT': 'FARM POWER',
    'CORR-AG-T3-W09-PIG-SAFE-REPLACEMENT': 'LIVESTOCK MANAGEMENT',
    'CORR-AG-T3-W10-CATTLE-SAFE-REPLACEMENT': 'LIVESTOCK MANAGEMENT II',
  };

  for (const correction of p.delivery_corrections) {
    const source = p.sources.find(candidate => candidate.source_id === correction.source_id)!;
    const row = plan.identified_rows.find(candidate => candidate.id === correction.source_lesson_id);
    assert(row, `correction source row must be found by the real parser: ${correction.id}`);
    assert.equal(row.row.title, sourceTitles[correction.id], `correction source title must match the real parser identity: ${correction.id}`);
    const topic = {
      id: 900 + p.delivery_corrections.indexOf(correction),
      school_code: 'secondary',
      class_name: 'SS 1',
      subject_name: 'Agricultural Science',
      term_label: source.term,
      title: sourceTitles[correction.id],
      source_file: source.archive_member.split('/').at(-1),
      source_reference: row.row.sourceReference,
      summary: 'stale generated summary',
      generated_assessment_id: 'stale-assessment',
    };

    const pending = resolver(topic);
    assert.equal(pending?.kind, 'withheld', 'pending subject package/lesson must never expose original source text');
    assert.match(pending?.text ?? '', /withheld/i);
    const safe = safeAgriculturalScienceTopic(topic);
    assert.equal(safe.source_reference, null);
    assert.equal(safe.generated_assessment_id, null);
    assert.match(String(safe.summary), /withheld/i);

    assert.equal(resolver({ ...topic, class_name: 'SS 2' }), null, 'correction must not cross class boundaries');
    assert.equal(resolver({ ...topic, school_code: 'primary' }), null, 'correction must not cross school scope');
    assert.equal(resolver({ ...topic, subject_name: 'Catering Craft' }), null, 'correction must not cross subject boundaries');
    assert.equal(resolver({ ...topic, title: 'UNRELATED WEEK' }), null, 'correction must not match another source row');

    const changedSource = resolver({ ...topic, source_reference: `${topic.source_reference} changed` });
    assert.equal(changedSource?.kind, 'withheld', 'changed stored source must fail closed');
    assert.match(changedSource?.reason ?? '', /fingerprint/i);

    // Synthetic test-only approval proves the positive path. These references
    // are fixtures and do not alter or assert approval of the real package.
    const approvedFixture = JSON.parse(JSON.stringify(p));
    approvedFixture.package_status = 'IMPLEMENTED';
    approvedFixture.open_items = approvedFixture.open_items.map((item: any) => ({ ...item, blocks_delivery: false }));
    const replacement = approvedFixture.lessons.find((lesson: any) => lesson.id === correction.replacement_id);
    replacement.state.content_approval = 'APPROVED';
    replacement.state.approval_reference = 'TEST_ONLY_APPROVAL_FIXTURE';
    replacement.state.verification = 'VERIFIED';
    replacement.state.verification_reference = 'TEST_ONLY_VERIFICATION_FIXTURE';
    const approved = createAgriculturalScienceDeliveryResolver(approvedFixture)(topic);
    assert.equal(approved?.kind, 'corrected');
    assert.ok(approved?.text.includes(replacement.title));

    const lessonAsset = approvedFixture.assets.find((asset: any) => asset.lesson_id === replacement.id);
    if (lessonAsset) {
      lessonAsset.state.content_approval = 'APPROVED';
      lessonAsset.state.approval_reference = 'TEST_ONLY_ASSET_APPROVAL_FIXTURE';
      lessonAsset.state.verification = 'VERIFIED';
      lessonAsset.state.verification_reference = 'TEST_ONLY_ASSET_VERIFICATION_FIXTURE';
      const assetResolver = createAgriculturalScienceAssetDeliveryResolver(approvedFixture);
      const metadata = { asset_key: lessonAsset.id, sha256: lessonAsset.sha256, mime: lessonAsset.media_type };
      assert.equal(assetResolver(topic, metadata), true, 'approved asset for the exact corrected lesson may be delivered');
      assert.equal(assetResolver(topic, { ...metadata, sha256: '0'.repeat(64) }), false, 'stored asset bytes must match the package hash');
      assert.equal(assetResolver({ ...topic, title: 'UNRELATED WEEK' }, metadata), false, 'asset must not cross topic identity');
      lessonAsset.state.verification = 'DEFERRED';
      lessonAsset.state.verification_reference = null;
      assert.equal(createAgriculturalScienceAssetDeliveryResolver(approvedFixture)(topic, metadata), false, 'unverified asset must remain hidden');
    }
  }
});


test('Agricultural Science correction adapter is wired through learner topic and assessment routes', () => {
  const route = readFileSync(new URL('../../backend/src/routes/learning.ts', import.meta.url), 'utf8');
  assert.ok(route.includes('safeAgriculturalScienceTopic(safeSs1Topic(safeJss3Topic(r)))'));
  assert.ok(route.includes('safeAgriculturalScienceTopic(safeSs1Topic(safeJss3Topic(full[0] ?? rows[0])))'));
  assert.ok(route.includes('resolveAgriculturalScienceDelivery(topic)'));
  assert.ok(route.includes('agriculturalScienceAssetDeliverable(visible[0], asset)'));
  assert.ok(route.includes('agriculturalScienceAssetDeliverable(meta[0], meta[0])'));
  const assetPlanWrapper = readFileSync(new URL('../../scripts/ss1/build_agricultural_science_asset_plan.mts', import.meta.url), 'utf8');
  assert.ok(assetPlanWrapper.includes('STAGING.json'));
  assert.ok(assetPlanWrapper.includes('stageManifest.archive_sha256'));
  assert.ok(assetPlanWrapper.includes('buildFromFiles'));
  assert.ok(assetPlanWrapper.includes('writeAssetPlanArtifacts'));
  assert.ok(!assetPlanWrapper.includes('source.bytes'));
  assert.ok(route.includes('retireStaleAgriculturalScienceCache(query, topic.id, agriculturalScienceDelivery)'));
  assert.ok(route.includes('agriculturalScienceWithdrawnAssessmentIds(query, openIds)'));
  assert.equal(route.split('agriculturalScienceAssessmentDeliverable(query,').length - 1, 3);
});
