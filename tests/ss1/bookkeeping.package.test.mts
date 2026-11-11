// Executed in GitHub Actions as the focused Bookkeeping package verification suite.
// node --import tsx --test tests/ss1/bookkeeping.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules, compilePackages } from '../../backend/src/db/ss1/compiler.ts';
import { isSchemeWorkWeekHeader } from '../../backend/src/db/ss1/topicParserRules.ts';
import { loadPackages } from '../../backend/src/db/ss1/loader.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/bookkeeping.json', import.meta.url), 'utf8'));
const manifest = [
  { source_id: 'SS1-SRC-62b02f2adcb3', sha256: '9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0', archive_member: 'SSS 1/1st Term SS1_/book keeping.docx', term: '1st Term' },
  { source_id: 'SS1-SRC-97c1db5b1eb0', sha256: 'c8c75f55e327d7d3e6ece6b3caca2ea841d3d3a45d324ceb221843c265157af3', archive_member: 'SSS 1/2nd Term SS1_/Book keeping.docx', term: '2nd Term' },
  { source_id: 'SS1-SRC-97f226215927', sha256: '343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d', archive_member: 'SSS 1/3rd Term SS1_/BOOK KEEPING_.docx', term: '3rd Term' },
];
const hash = (s: string) => createHash('sha256').update(s).digest('hex');

test('Bookkeeping package follows the frozen schema and registers the three assigned sources', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'bookkeeping');
  assert.equal(p.canonical_subject, 'Bookkeeping');
  assert.deepEqual(
    p.sources.map(s => ({ source_id: s.source_id, sha256: s.sha256, archive_member: s.archive_member, term: s.term })),
    manifest,
  );
  assert(p.sources.every(s => s.class_name === 'SS 1'));
});

test('Authored lesson bodies have exact hashes and complete keyed marking', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const l of p.lessons) {
    assert(!ids.has(l.id), `duplicate lesson id: ${l.id}`);
    ids.add(l.id);
    assert.equal(hash(l.body), l.body_sha256);
    assert.equal(l.subject, 'Bookkeeping');
    assert.equal(l.class_name, 'SS 1');
    assert(l.objectives.length > 0 && l.practice.length > 0);
    for (const q of l.practice) {
      assert(q.answer.trim().length > 0);
      assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0));
      assert(q.marking.every(m => m.criterion.trim() && m.marks > 0));
    }
  }
});

test('Delivery corrections bind the exact original identity to a same-term replacement', () => {
  const p = packageSchema.parse(raw);
  for (const c of p.delivery_corrections) {
    const s = p.sources.find(s => s.source_id === c.source_id);
    const l = p.lessons.find(l => l.id === c.replacement_id);
    assert(s && l);
    assert.equal(c.source_sha256, s.sha256);
    assert.equal(c.source_lesson_id, `${c.source_id}:BODY:${c.body_sha256}`);
    assert.equal(l.term, s.term);
  }
});

test('Owner sign-off and package-level technical verification are recorded for every lesson', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'IMPLEMENTED');
  for (const l of p.lessons) {
    assert.equal(l.state.content_approval, 'APPROVED');
    assert.match(l.state.approval_reference ?? '', /^OWNER SIGN-OFF PROVIDED 2026-11-09:/);
    assert.match(l.state.approval_reference ?? '', /all 32 SS1 Bookkeeping lessons/);
    assert.equal(l.state.verification, 'VERIFIED');
    assert.match(l.state.verification_reference ?? '', /Bookkeeping package verification run 42534557322 passed 21\/21 tests/);
  }
});

test('Accounting corrections preserve the correct overdraft and returns balances', () => {
  const p = packageSchema.parse(raw);
  const overdraft = p.lessons.find(l => l.id === 'SUP-SS1-BOOKKEEPING-T2-W09');
  assert(overdraft);
  assert.match(overdraft.body, /balance c\/d on the debit side.*balance b\/d down on the credit side/s);
  assert.doesNotMatch(overdraft.body, /brought down on the debit side/);
  const trial = p.lessons.find(l => l.id === 'SUP-SS1-BOOKKEEPING-T3-W04-TRIAL-BALANCE-PREPARATION');
  assert(trial);
  assert.match(trial.body, /returns inwards normally debit; returns outwards normally credit/);
  const returns = trial.practice.find(q => q.id === 'Q2');
  assert(returns);
  assert.equal(returns.answer, '(a) Debit. (b) Debit. (c) Credit. (d) Credit.');
  assert.equal(returns.marking[1].criterion, 'Returns inwards — debit');
  assert.equal(returns.marking[2].criterion, 'Returns outwards — credit');
});

test('Source aliases carry the recorded owner confirmation without implying lesson approval', () => {
  const p = packageSchema.parse(raw);
  for (const r of p.source_rules.filter(r => r.op === 'source_alias')) {
    assert.match(r.approval_reference, /^OWNER CONFIRMED 2026-11-08:/);
    assert.match(r.approval_reference, /metadata alias/);
    assert(p.sources.some(s => s.source_id === r.source_id && s.sha256 === r.source_sha256));
  }
  for (const id of ['BOOKKEEPING-ALIAS-APPROVAL', 'BOOKKEEPING-ALIAS-APPROVAL-T2', 'BOOKKEEPING-ALIAS-APPROVAL-T3']) {
    assert.equal(p.open_items.find(x => x.id === id)?.blocks_delivery, false);
  }
});

test('Rule guards reject wrong source hashes and missing or ambiguous anchors', () => {
  const p = packageSchema.parse(raw);
  for (const r of p.source_rules) {
    const input = { source_id: r.source_id, sha256: r.source_sha256, filePath: 'synthetic-bookkeeping-probe.docx', text: r.anchor };
    assert.throws(() => applyRules({ ...input, sha256: '0'.repeat(64) }, [r]), /source mismatch/);
    assert.throws(() => applyRules({ ...input, text: r.anchor + '\\n' + r.anchor }, [r]), /ambiguous/);
    assert.throws(() => applyRules({ ...input, text: 'anchor absent' }, [r]), /missing/);
  }
});

test('Preamble marker coverage targets its exact SCHEME_ONLY rule, not an invented lesson', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['COV-BK-T1-REVISION-1', 'RULE-BK-T1-REVISION-1'],
    ['COV-BK-T1-REVISION-11', 'RULE-BK-T1-REVISION-11'],
    ['COV-BK-T1-EXAM-12', 'RULE-BK-T1-EXAM-12'],
  ]);
  for (const [coverageId, ruleId] of expected) {
    const c = p.coverage.find(x => x.id === coverageId);
    const r = p.source_rules.find(x => x.id === ruleId);
    assert(c && r);
    assert.equal(c.status, 'MARKER');
    assert.deepEqual(c.lesson_ids, [ruleId]);
    if (r.op !== 'classify_marker') assert.fail('marker target must be a classify_marker rule');
    assert.equal(r.kind, 'SCHEME_ONLY');
  }
});

// The full-source compiler/parser comparison is a separate integration check; this suite verifies the subject package itself.

test('Coverage entries resolve to registered sources and declared lesson or marker targets', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(s => s.source_id));
  const lessonIds = new Set(p.lessons.map(l => l.id));
  const markerRules = new Set(p.source_rules
    .filter(r => r.op === 'classify_marker')
    .map(r => r.id));
  for (const c of p.coverage) {
    assert(sourceIds.has(c.source_id), `unknown coverage source: ${c.id}`);
    assert(c.evidence.length > 0, `coverage evidence missing: ${c.id}`);
    for (const target of c.lesson_ids) {
      assert(lessonIds.has(target) || markerRules.has(target),
        `unknown coverage target ${target} in ${c.id}`);
    }
    if (['SUPPORTED', 'IMPLEMENTED_EQUIVALENT', 'MARKER'].includes(c.status)) {
      assert(c.lesson_ids.length > 0, `complete coverage has no target: ${c.id}`);
    }
    if (c.status === 'MARKER') {
      assert(c.lesson_ids.every(id => markerRules.has(id)),
        `marker coverage must target a classify_marker rule: ${c.id}`);
    }
  }
});

test('Third-term revision and examination markers remain scheme-only', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['COV-BK-T3-REVISION-1', 'RULE-BK-T3-REVISION-1'],
    ['COV-BK-T3-REVISION-11', 'RULE-BK-T3-REVISION-11'],
    ['COV-BK-T3-EXAM-12', 'RULE-BK-T3-EXAM-12'],
  ]);
  for (const [coverageId, ruleId] of expected) {
    const c = p.coverage.find(x => x.id === coverageId);
    const r = p.source_rules.find(x => x.id === ruleId);
    assert(c && r);
    assert.equal(c.status, 'MARKER');
    assert.deepEqual(c.lesson_ids, [ruleId]);
    if (r.op !== 'classify_marker') assert.fail('marker target must be a classify_marker rule');
    assert.equal(r.kind, 'SCHEME_ONLY');
  }
});

test('Third-term source boundaries use exact week labels and unique anchors', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['RULE-BK-T3-W02', ['2', '                                PETTY CASH BOOK']],
    ['RULE-BK-T3-W03', ['3', 'TRIAL BALANCE AND CORRECTION OF ERRORS']],
    ['RULE-BK-T3-W04', ['4', 'RULES OF TRIAL BALANCE ']],
    ['RULE-BK-T3-W05', ['5', 'TRIAL BALANCE ERRORS OR UNDISCLOSED ERRORS']],
    ['RULE-BK-T3-W06', ['6', 'ERRORS THAT WILL AFFECT THE AGREEMNENT OF THE TRIAL BALANCE']],
    ['RULE-BK-T3-W07', ['7', '                            TRADING PROFIT AND LOSS ACCOUNT AND BALANCE SHEET(FINAL ACCOUNT)']],
    ['RULE-BK-T3-W08', ['8', '                PREPARATION OF FINAL ACCOUNT OF A SOLE TRADER']],
    ['RULE-BK-T3-W10', ['10', 'LAYOUT OF BALANCE SHEET']],
  ]);
  for (const [id, [week, anchor]] of expected) {
    const rule = p.source_rules.find(x => x.id === id);
    assert(rule && rule.op === 'split_before');
    assert.equal(rule.source_id, 'SS1-SRC-97f226215927');
    assert.equal(rule.source_sha256, '343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d');
    assert.equal(rule.week_label, week);
    assert.equal(rule.anchor, anchor);
  }
  assert(!p.source_rules.some(x => x.id === 'RULE-BK-T3-W09'),
    'Week 9 has no distinct source heading; do not invent a split boundary');
});

test('Third-term equivalent lessons have complete marked practice and exact coverage links', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['SUP-SS1-BOOKKEEPING-T3-W05-NOT-AFFECT', ['bc61f8ae5e06f2d19a34a33434c34e526db9c3ecd4e9a07266b02e399691e16e', 'COV-BK-T3-W05-NOT-AFFECT']],
    ['SUP-SS1-BOOKKEEPING-T3-W07-TRADING', ['03c907cc07de181c42d175a50e8ff6dca00789b947a780e106708dd893888786', 'COV-BK-T3-W07-DEFINITION']],
    ['SUP-SS1-BOOKKEEPING-T3-W08-PREP', ['df5b68dea2fb111be4d3543447185e484ed7ad7db0d9073cb2d7dd9df572732d', 'COV-BK-T3-W08-PREPARATION']],
    ['SUP-SS1-BOOKKEEPING-T3-W09-PNL', ['289fc07daf4c232339d96f3b252244d5e9ade7d87804142969af526be5a0b45c', 'COV-BK-T3-W09-PURPOSE']],
    ['SUP-SS1-BOOKKEEPING-T3-W10-USERS', ['63adfa99cf4b7629b85b9eec3c07e9ac48693f579d798543301db56fc7a94a3a', 'COV-BK-T3-W10-USERS']],
    ['SUP-SS1-BOOKKEEPING-T3-W10-BALANCE-SHEET', ['ba3101b1a53027a2ffa747c6827c3b61ab0c846e99a8ee6bc8eadb41e7b82118', 'COV-BK-T3-W10-PREPARATION']],
  ]);
  for (const [id, [hash, coverageId]] of expected) {
    const lesson = p.lessons.find(x => x.id === id);
    const coverage = p.coverage.find(x => x.id === coverageId);
    assert(lesson && coverage);
    assert.equal(lesson.body_sha256, hash);
    assert.equal(lesson.state.implementation, 'IMPLEMENTED');
    assert.equal(lesson.state.content_approval, 'APPROVED');
    assert.equal(lesson.state.verification, 'VERIFIED');
    assert(lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert.equal(question.marking.reduce((sum, part) => sum + part.marks, 0), question.marks);
    }
    assert.equal(coverage.status, 'IMPLEMENTED_EQUIVALENT');
    assert(coverage.lesson_ids.includes(id));
  }
});

test('Owner-confirmed second-term duplicate is excluded by matching parsed teaching, not file metadata', () => {
  const p = packageSchema.parse(raw);
  const r = p.source_rules.find(x => x.id === 'RULE-BK-T2-EXCLUDE-DUPLICATE');
  assert(r && r.op === 'exclude_duplicate');
  assert.equal(r.source_id, 'SS1-SRC-97c1db5b1eb0');
  assert.equal(r.source_sha256, 'c8c75f55e327d7d3e6ece6b3caca2ea841d3d3a45d324ceb221843c265157af3');
  assert.equal(r.target_source_id, 'SS1-SRC-62b02f2adcb3');
  assert.equal(r.target_sha256, '9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0');
  assert.match(r.evidence.explanation, /Owner confirmed/);
  const reconstructed = p.coverage.filter(c => c.id.startsWith('COV-BK-T2-RECON-'));
  assert.equal(reconstructed.length, 10, 'each reconstructed Bookkeeping week has its own coverage record');
  for (const c of reconstructed) {
    assert.equal(c.source_id, 'SS1-SRC-97c1db5b1eb0', 'the registered T2 source is only the term-bucket key');
    assert.equal(c.status, 'IMPLEMENTED_EQUIVALENT');
    assert.equal(c.lesson_ids.length, 1);
    assert.match(c.lesson_ids[0], /^SUP-SS1-BOOKKEEPING-T2-W\d{2}$/);
    assert.match(c.objective_locator, /not the duplicate source body/);
    assert.match(c.evidence[0].explanation, /solely the assigned second-term manifest bucket/);
  }
  assert.equal(p.coverage.some(c => /^COV-BK-T2-(?:REVISION|EXAM|WEEK)/.test(c.id)), false,
    'do not index copied duplicate-source markers or weeks');
  assert.equal(p.open_items.find(x => x.id === 'BOOKKEEPING-T2-TEXT-MATCHES-T1')?.blocks_delivery, false);
});

test('First-term equivalent cash-book and double-entry supplements are complete', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['SUP-SS1-BOOKKEEPING-T1-W01-CASH-BOOK', ['49f61996459c289622628c0dc026c100c8bfa7e78be5659fafb6928ff165faf8', 'COV-BK-T1-W01-SCHEME-2']],
    ['SUP-SS1-BOOKKEEPING-T1-W02-DOUBLE-CASH-BOOK', ['6c057d9a40e6647be00242b5c05778e0ecae097e2b43b87de80071956ce31553', 'COV-BK-T1-W02-DIFF']],
    ['SUP-SS1-BOOKKEEPING-T1-W03-CONTRA', ['a672eb81e9cac6761f5f706457a86ecfb260c81b78c37c4d8ac6aafbe3bc7624', 'COV-BK-T1-W03-EXPLAIN']],
    ['SUP-SS1-BOOKKEEPING-T1-W04-DOUBLE-ENTRY', ['9e4ea698ce2c45600892f133605c7041d36bf1e20f7fa17e980ce036636717b4', 'COV-BK-T1-W04-LEDGER-FORMAT']],
    ['SUP-SS1-BOOKKEEPING-T1-W04-POSTING', ['549804b2fb559513bdf2a560961f57e81a2277e38ab8a0c5fac2b7a3c770e1e5', 'COV-BK-T1-W04-POSTING-REPLACEMENT']],
  ]);
  for (const [id, [hash, coverageId]] of expected) {
    const lesson = p.lessons.find(x => x.id === id);
    const coverage = p.coverage.find(x => x.id === coverageId);
    assert(lesson && coverage);
    assert.equal(lesson.body_sha256, hash);
    assert.equal(lesson.state.implementation, 'IMPLEMENTED');
    assert.equal(lesson.state.content_approval, 'APPROVED');
    assert.equal(lesson.state.verification, 'VERIFIED');
    assert(lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert.equal(question.marking.reduce((sum, part) => sum + part.marks, 0), question.marks);
    }
    assert(coverage.lesson_ids.includes(id));
  }
  assert.equal(p.coverage.find(x => x.id === 'COV-BK-T1-W01-BANK-ACCOUNT').status, 'IMPLEMENTED_EQUIVALENT');
  assert.equal(p.coverage.find(x => x.id === 'COV-BK-T1-W01-ILLUS-2').status, 'IMPLEMENTED_EQUIVALENT');
  assert.equal(p.coverage.find(x => x.id === 'COV-BK-T1-W04-ILLUSTRATION').status, 'IMPLEMENTED_EQUIVALENT');
});

test('Owner-approved first-term delivery corrections bind each exact original body to its authored replacement', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['CORR-BK-T1-W01', ['e4dbc7a1ff59d4a1fe5da4b9ff975ab60c94df281e8774f5bf2330ddc21d7ccd', 'SUP-SS1-BOOKKEEPING-T1-W01-CASH-BOOK']],
    ['CORR-BK-T1-W02', ['bb5f26395bbe6ce4bae80f128748821df86b6895d8a4a4e87ead79c6d31f2e4b', 'SUP-SS1-BOOKKEEPING-T1-W02-DOUBLE-CASH-BOOK']],
    ['CORR-BK-T1-W03', ['194de4c5fde3e27a5596871b7a860b26a5456eaedf0d3c24ab31f89e2132eb8a', 'SUP-SS1-BOOKKEEPING-T1-W03-CONTRA']],
    ['CORR-BK-T1-W04', ['890fb8fac8b6f9b6cf32bfe5fc5a3e21bcd464e447b214ac1a9eb9d7128f8409', 'SUP-SS1-BOOKKEEPING-T1-W04-DOUBLE-ENTRY']],
  ]);
  assert.equal(p.delivery_corrections.length, expected.size);
  for (const [id, [bodyHash, replacementId]] of expected) {
    const c = p.delivery_corrections.find(x => x.id === id);
    assert(c);
    assert.equal(c.source_id, 'SS1-SRC-62b02f2adcb3');
    assert.equal(c.body_sha256, bodyHash);
    assert.equal(c.source_lesson_id, `SS1-SRC-62b02f2adcb3:BODY:${bodyHash}`);
    assert.equal(c.replacement_id, replacementId);
    assert.match(c.evidence.explanation, /Owner approved/);
  }
  for (const item of p.open_items.filter(x => /^BOOKKEEPING-T1-W0[1-4]-/.test(x.id))) {
    assert.equal(item.blocks_delivery, false, `approved replacement should resolve delivery blocker: ${item.id}`);
    assert.match(item.required_action, /owner approval/i);
  }
  // Approval substitutes the delivery lesson; it never rewrites the registered source or claims it is technically verified.
  assert.equal(p.sources.find(s => s.source_id === 'SS1-SRC-62b02f2adcb3')?.sha256,
    '9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0');
  for (const l of p.lessons.filter(x => x.term === '1st Term')) {
    assert.equal(l.state.content_approval, 'APPROVED');
    assert.equal(l.state.verification, 'VERIFIED');
  }
});



test('First-term extension lessons populate Weeks 5-10 without claiming recovered source pages', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['SUP-SS1-BOOKKEEPING-T1-W05-DOUBLE-COLUMN-LAYOUT', '2e7da7cc0c764fc75adf97957211d7936ba19a4c8b8574c4ff3c06fb7e49ccc9'],
    ['SUP-SS1-BOOKKEEPING-T1-W06-DOUBLE-COLUMN-PREPARATION', '3344375aa2da1567815adb31ba818ead1a432298fa0d32b71332dfc850f78bab'],
    ['SUP-SS1-BOOKKEEPING-T1-W07-CONTRA-PRACTICE', '2e02958366bc070ac053d3bd8cd6ef6e04f75d93fd44cd6175c65fad1a04b177'],
    ['SUP-SS1-BOOKKEEPING-T1-W08-DOUBLE-ENTRY-FOUNDATION', 'e83139ef64dacf1408c4e3b4a4ee1e623865a0be918eb5f7ce6232197fc9b26c'],
    ['SUP-SS1-BOOKKEEPING-T1-W09-DEBIT-CREDIT-IDENTIFICATION', '8f26052d3b161ffe71f34906e83f354962c1b7ee4f194a92e70124b4a1d8d91a'],
    ['SUP-SS1-BOOKKEEPING-T1-W10-CASHBOOK-TO-LEDGER', '633a1ec5d574e2702a6c5476a1563a4648f42bb79b241a2307ee24545d629e05'],
  ]);
  for (const [id, bodyHash] of expected) {
    const lesson = p.lessons.find(x => x.id === id);
    assert(lesson, `missing first-term extension lesson: ${id}`);
    assert.equal(lesson.term, '1st Term');
    assert.equal(lesson.body_sha256, bodyHash);
    assert.equal(lesson.state.implementation, 'IMPLEMENTED');
    assert.equal(lesson.state.content_approval, 'APPROVED');
    assert.equal(lesson.state.verification, 'VERIFIED');
    assert(lesson.objectives.length > 0 && lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert.equal(question.marking.reduce((sum, part) => sum + part.marks, 0), question.marks);
    }
  }
  const weeks = new Set(p.lessons
    .filter(x => x.term === '1st Term')
    .map(x => x.id.match(/T1-W(\d{2})/)?.[1])
    .filter(Boolean));
  assert.deepEqual([...weeks].sort(), ['01','02','03','04','05','06','07','08','09','10']);
  const scope = p.open_items.find(x => x.id === 'BOOKKEEPING-T1-SCHEME-VS-BODY');
  assert.equal(scope?.blocks_delivery, false);
  assert.match(scope?.required_action ?? '', /original-source completeness question open/);
});

test('First-term bank-account and twenty-transaction delivery replacements are fully worked', () => {
  const p = packageSchema.parse(raw);
  const bank = p.lessons.find(x => x.id === 'SUP-SS1-BOOKKEEPING-T1-W01-CASH-BOOK');
  const posting = p.lessons.find(x => x.id === 'SUP-SS1-BOOKKEEPING-T1-W04-DOUBLE-ENTRY');
  assert(bank && posting);
  assert.match(bank.body, /Separate bank-account worked example/);
  assert.match(bank.body, /closing bank balance is 8,750 debit/);
  assert.match(posting.body, /Full integrated illustration — twenty original June transactions/);
  assert.match(posting.body, /Closing cash balance: 4,950 debit/);
  assert.match(posting.body, /Closing bank balance: 11,550 debit/);
  assert.equal(p.coverage.find(x => x.id === 'COV-BK-T1-W01-ILLUS-2')?.status, 'IMPLEMENTED_EQUIVALENT');
  assert.equal(p.coverage.find(x => x.id === 'COV-BK-T1-W04-ILLUSTRATION')?.status, 'IMPLEMENTED_EQUIVALENT');
});

test('Third-term Week 1 revision marker has a project-authored revision lesson, not invented source content', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(x => x.id === 'SUP-SS1-BOOKKEEPING-T3-W01-REVISION');
  assert(lesson);
  assert.equal(lesson.term, '3rd Term');
  assert.equal(lesson.state.content_approval, 'APPROVED');
  assert.equal(lesson.state.verification, 'VERIFIED');
  assert(lesson.objectives.length >= 4 && lesson.practice.length >= 2);
  assert.match(lesson.provenance[0].locator, /no revision body/);
  assert.equal(p.source_rules.find(x => x.id === 'RULE-BK-T3-REVISION-1')?.kind, 'SCHEME_ONLY');
});


test('Third-term petty cash, trial balance and suspense gaps have authored lessons and exact coverage', () => {
  const p = packageSchema.parse(raw);
  const expected = new Map([
    ['SUP-SS1-BOOKKEEPING-T3-W02-PETTY-CASH', ['46a849b06cd31f8186cb9b1fa1062cf8a218b584bbda3dbb45daed1ae57430f1', ['COV-BK-T3-W02-MEANING', 'COV-BK-T3-W02-COLUMNS', 'COV-BK-T3-W02-POSTING']]],
    ['SUP-SS1-BOOKKEEPING-T3-W03-TRIAL-BALANCE', ['6de1fcf0310c0906bc00abd74e009dd7385b9db1fba402d515e6c663403f8431', ['COV-BK-T3-W03-MEANING', 'COV-BK-T3-W03-FUNCTIONS', 'COV-BK-T3-W03-EXTRACTION']]],
    ['SUP-SS1-BOOKKEEPING-T3-W04-TRIAL-BALANCE-PREPARATION', ['46718d2f2e499b80734ccabeab065afd5c5439697df2e1593ae2a12df8a99b47', ['COV-BK-T3-W04-RULES', 'COV-BK-T3-W04-PREPARATION']]],
    ['SUP-SS1-BOOKKEEPING-T3-W06-SUSPENSE', ['fcf96e7e2a4c14d870dc3ebd59b8be73ae248e574aa42532909572784233badd', ['COV-BK-T3-W06-SUSPENSE']]],
  ]);
  for (const [id, [expectedHash, coverageIds]] of expected) {
    const lesson = p.lessons.find(x => x.id === id);
    assert(lesson, `missing lesson ${id}`);
    assert.equal(lesson.body_sha256, expectedHash);
    assert.equal(lesson.state.implementation, 'IMPLEMENTED');
    assert.equal(lesson.state.content_approval, 'APPROVED');
    assert.equal(lesson.state.verification, 'VERIFIED');
    assert(lesson.practice.length >= 3);
    for (const q of lesson.practice) {
      assert.equal(q.marks, q.marking.reduce((sum, part) => sum + part.marks, 0));
    }
    for (const coverageId of coverageIds) {
      const coverage = p.coverage.find(x => x.id === coverageId);
      assert(coverage);
      assert.equal(coverage.status, 'IMPLEMENTED_EQUIVALENT');
      assert(coverage.lesson_ids.includes(id));
    }
  }
  const w5 = p.lessons.find(x => x.id === 'SUP-SS1-BOOKKEEPING-T3-W05-NOT-AFFECT');
  assert(w5);
  for (const id of ['COV-BK-T3-W05-MEANING', 'COV-BK-T3-W05-TYPES', 'COV-BK-T3-W05-AFFECT']) {
    const c = p.coverage.find(x => x.id === id);
    assert(c && c.status === 'IMPLEMENTED_EQUIVALENT');
    assert(c.lesson_ids.includes(w5.id));
  }
  assert.equal(p.coverage.filter(x => x.id.startsWith('COV-BK-T3-') && x.status === 'PARTIAL').length, 0);
});


test('scheme-of-work WEEK column heading is not parsed as a Week 1 lesson marker', () => {
  const markerPattern = /^[ \t]*week\s*[:.\-]*\s*((?:\d+(?:\s*(?:&|and|,|-)\s*\d+)?)|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen))/gim;
  const schemePreamble = 'SCHEME OF WORK  \nWEEK\n1                 Revision\n2. Petty cash book\n11 revision\n12 exam\n';
  const marker = [...schemePreamble.matchAll(markerPattern)][0];
  assert(marker);
  assert.equal(isSchemeWorkWeekHeader(schemePreamble, marker.index!, marker[0]), true);

  const sameLineWeek = 'SCHEME OF WORK\nWEEK 1 Revision\n';
  const sameLineMatch = [...sameLineWeek.matchAll(markerPattern)][0];
  assert(sameLineMatch);
  assert.equal(isSchemeWorkWeekHeader(sameLineWeek, sameLineMatch.index!, sameLineMatch[0]), false);

  const nonSchemeWeek = 'INTRODUCTION\nWEEK\n1 Revision\n';
  const nonSchemeMatch = [...nonSchemeWeek.matchAll(markerPattern)][0];
  assert(nonSchemeMatch);
  assert.equal(isSchemeWorkWeekHeader(nonSchemeWeek, nonSchemeMatch.index!, nonSchemeMatch[0]), false);
});


test('Bookkeeping source rules compile the scheme preamble as markers, not a Week 1 lesson', () => {
  const complete = JSON.parse(JSON.stringify(raw));
  const source = complete.sources.find((s: any) => s.term === '3rd Term');
  assert(source);
  const pkg = {
    ...complete,
    sources: [source],
    source_rules: complete.source_rules.filter((r: any) => r.source_id === source.source_id),
    lessons: complete.lessons.filter((l: any) => l.term === '3rd Term'),
    coverage: complete.coverage.filter((c: any) => c.id.startsWith('COV-BK-T3-')),
    delivery_corrections: [],
    assets: [],
  };
  const rules = pkg.source_rules;
  const markerRules = rules.filter((r: any) => r.op === 'classify_marker');
  const splitRules = rules.filter((r: any) => r.op === 'split_before');
  const text = [
    source.header_text,
    'SCHEME OF WORK',
    'WEEK',
    ...markerRules.map((r: any) => r.anchor),
    ...splitRules.map((r: any) => r.anchor),
  ].join('\n') + '\n';

  const weekMarker = /^[ \t]*week\s*[:.\-]*\s*((?:\d+(?:\s*(?:&|and|,|-)\s*\d+)?)|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen))/gim;
  const parse = (input: string) => {
    const matches = [...input.matchAll(weekMarker)].filter(m => !isSchemeWorkWeekHeader(input, m.index!, m[0]));
    return matches.map((m, i) => {
      const start = m.index!;
      const end = i + 1 < matches.length ? matches[i + 1].index! : input.length;
      const body = input.slice(start, end).trim();
      const title = body.split('\n').map(line => line.trim()).find(line => line && !/^week\b/i.test(line)) ?? '(untitled)';
      return { weekLabel: m[0].trim(), title, body };
    });
  };
  const plan = compilePackages(
    [pkg],
    [{ source_id: source.source_id, sha256: source.sha256, filePath: 'SSS 1/3rd Term SS1_/BOOK KEEPING_.docx', text }],
    parse,
  );
  const sourceRows = plan.rows.filter(row => row.filePath === 'SSS 1/3rd Term SS1_/BOOK KEEPING_.docx');
  assert.deepEqual(sourceRows.map(row => row.weekLabel.match(/\d+/)?.[0]), ['2', '3', '4', '5', '6', '7', '8', '10']);
  for (const rule of markerRules) {
    assert(plan.dispositions.some(d => d.id === rule.id && d.status === 'SCHEME_ONLY'));
  }
});


test('Complete Bookkeeping delivery baseline remains present and internally approved', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'bookkeeping');
  assert.equal(p.package_status, 'IMPLEMENTED');
  assert.equal(p.lessons.length, 32);
  assert.deepEqual(
    ['1st Term', '2nd Term', '3rd Term'].map(term => p.lessons.filter(l => l.term === term).length),
    [11, 10, 11],
  );
  assert.equal(p.lessons.reduce((n, l) => n + l.objectives.length, 0), 110);
  assert.equal(p.lessons.reduce((n, l) => n + l.practice.length, 0), 75);
  assert.equal(p.coverage.length, 81);
  assert.equal(p.coverage.filter(c => c.status === 'IMPLEMENTED_EQUIVALENT').length, 75);
  assert.equal(p.coverage.filter(c => c.status === 'MARKER').length, 6);
  assert.equal(p.open_items.filter(item => item.blocks_delivery).length, 0);
  assert(p.lessons.every(l => l.state.implementation === 'IMPLEMENTED'));
  assert(p.lessons.every(l => l.state.content_approval === 'APPROVED'));
  assert(p.lessons.every(l => l.state.verification === 'VERIFIED'));
});


test('SS1 package loader can validate every registered subject package', () => {
  const packages = loadPackages();
  const slugs = packages.map(p => p.subject_slug);
  assert(slugs.includes('bookkeeping'));
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(slugs.length, 21);
});
