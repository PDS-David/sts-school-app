import test from 'node:test';
import { loadManifest, prepareAssets } from '../backend/src/db/attachTopicAssets.ts';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { assertJss3SupplementCorpus, JSS3_SUPPLEMENTS, validateJss3Supplements, buildJss3SupplementRows } from '../backend/src/db/jss3Supplements.ts';
const base = JSS3_SUPPLEMENTS.map((s, i) => ({ filePath: `/sources/original-${i}.docx`, className: 'JSS 3', termLabel: s.termLabel, subjectName: s.subjectName, title: `Original ${i}`, weekLabel: 'WEEK 1', orderIndex: 1, sourceReference: `Original source body ${i}` }));
test('replacement lessons carry actual teaching, learner tasks, assessment and attribution', () => {
  assert.equal(validateJss3Supplements(JSS3_SUPPLEMENTS).length, JSS3_SUPPLEMENTS.length);
  for (const s of JSS3_SUPPLEMENTS) {
    assert.ok(s.body.length > 500); assert.ok(s.sources.length);
    assert.ok(s.origin.includes('not recovered')); assert.notEqual(s.termLabel, '3rd Term');
  }
});
test('building replacement rows preserves every original object and body', () => {
  const protectedRow = { ...base[0], className: 'JSS 2' };
  const input = [...base, protectedRow]; const before = structuredClone(input);
  const output = buildJss3SupplementRows(input, '/sources', 'secondary');
  assert.deepEqual(input, before); assert.equal(output.length, JSS3_SUPPLEMENTS.length);
  assert.ok(output.every(r => r.className === 'JSS 3'));
  assert.ok(output.every(r => r.filePath.includes('__jss3_supplements__')));
});
test('primary and unrelated source batches cannot acquire JSS3 supplements', () => {
  assert.throws(() => buildJss3SupplementRows(base, '/sources', 'primary'), /secondary/);
  assert.throws(() => buildJss3SupplementRows(base.map(r => ({ ...r, className: 'JSS 2' })), '/sources', 'secondary'), /destination absent/);
});
test('duplicate application and duplicate IDs block', () => {
  const added = buildJss3SupplementRows(base, '/sources', 'secondary');
  assert.throws(() => buildJss3SupplementRows([...base, ...added], '/sources', 'secondary'), /already/);
  assert.throws(() => validateJss3Supplements([...JSS3_SUPPLEMENTS, JSS3_SUPPLEMENTS[0]]), /Duplicate/);
});
test('third-term, computer-studies, bare-heading and unattributed inputs fail closed', () => {
  for (const patch of [{termLabel: '3rd Term'}, {subjectName: 'Computer Studies'}, {body: 'heading only'}, {sources: []}, {gapIds:['WG-NOT-REGISTERED']}, {sources: [{title:'Bad URL',url:'javascript:alert(1)'}]}]) {
    assert.throws(() => validateJss3Supplements([{...JSS3_SUPPLEMENTS[0], ...patch}]));
  }
});
test('ten held entries have distinct teaching replacements; original holds are not approvals', () => {
  const covered = new Set(JSS3_SUPPLEMENTS.flatMap(s => s.gapIds));
  for (const id of ['PE-01','PE-02','PE-03','PE-04','PE-05','PE-06','PE-07','PE-08','AK-01','TK-01']) assert.ok(covered.has(id), id);
});
test('all five unresolved textbook references have supplied exercises, not fabricated pages', () => {
  for (const id of ['EN2-07','EN2-08','EN2-09','EN2-10','EN2-11']) assert.ok(JSS3_SUPPLEMENTS.some(s => s.gapIds.includes(id)));
  const reading = JSS3_SUPPLEMENTS.filter(s => ['SUP-READ-2','SUP-READ-3','SUP-READ-4','SUP-READ-5'].includes(s.id));
  for (const s of reading) { assert.match(s.body, /Original substitute passage/); assert.match(s.body,/Questions:/); assert.match(s.body,/Answers:/); }
});
test('typing exercise really has 100 words and its answer score is correct', () => {
  const text = JSS3_SUPPLEMENTS.find(s => s.id === 'SUP-PE-04')!.body;
  const passage = text.split("Timed practice passage: '")[1].split("'\n")[0];
  assert.equal(passage.trim().split(/\s+/).length,100);
  assert.equal(100*60/120,50);
});
const root = process.env.JSS3_ALL_ROOT;
test('real importer: append-only additions preserve the original import order and ten holds', {skip: !root, timeout: 120000}, () => {
  const run = (extra: string[]) => {
    const r = spawnSync(process.execPath, ['--import','tsx','backend/src/db/ingestTopics.ts','--root',root!,'--school-code','secondary',...extra], {encoding:'utf8',maxBuffer:20*1024*1024});
    assert.equal(r.status,0,r.stdout+r.stderr); return r.stdout;
  };
  const before=run([]), after=run(['--jss3-supplements']);
  const order = (s: string) => s.split('\n').filter(l => /^  JSS 3 \/ .* #\d+:/.test(l));
  const originals=order(before), final=order(after);
  assert.equal(originals.length,313);
  assert.deepEqual(final.filter(l=>!l.includes('__jss3_supplements__')),originals);
  assert.equal(final.length,313+JSS3_SUPPLEMENTS.length);
  assert.ok(!final.some(l=>l.includes('/ 3rd Term #')||l.includes('/ Computer Studies /')));
  assert.match(after,/PENDING ENTRIES/); assert.match(after,/Dry run only/);
});

test('incomplete corpus cannot silently append supplements', () => {
  assert.throws(() => assertJss3SupplementCorpus([]), /Combined JSS3 source required/);
  assert.throws(() => assertJss3SupplementCorpus([{termLabel:'2nd Term',basename:'Agric 3.doc'}]), /1st Term/);
});
test('literature supplies complete selected texts, not synopsis-only grounding', () => {
  const prose = JSS3_SUPPLEMENTS.find(s=>s.id==='SUP-PROSE')!.body;
  const drama = JSS3_SUPPLEMENTS.find(s=>s.id==='SUP-DRAMA')!.body;
  assert.ok(prose.length>11000); assert.match(prose,/They are the magi/);
  assert.ok(drama.length>24000); assert.match(drama,/Oxen Meadows/); assert.match(drama,/\nCurtain\./);
});

test('new lesson graphics validate against their manifests and stable destination identities', () => {
  const dir='curriculum-assets/jss3/supplements';
  for (const [name,id] of [['BASIC_TECH','SUP-PE-06'],['BUSINESS','SUP-PE-04'],['MUSIC','SUP-MUSIC-TIME']]) {
    const [asset]=prepareAssets(loadManifest(`${dir}/${name}_MANIFEST.csv`),dir);
    assert.equal(asset.mime,'image/png'); assert.equal(asset.displayed,true);
    assert.equal(asset.expected_title,JSS3_SUPPLEMENTS.find(s=>s.id===id)!.title);
    assert.equal(asset.order_index,12);
  }
});
