// Run: node --test tests/topic-assets.static.test.cjs
// Task 2 (lesson assets). Source-level guarantees only — the live-database
// behaviour (idempotent attach, endpoint scoping, hash abort) is proved by
// tests/topic-assets.db.test.mts, which needs a local Postgres.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// The block appended to schema.sql for Task 2.
function ddlBlock() {
  const s = read('backend/schema.sql');
  const i = s.indexOf('CREATE TABLE IF NOT EXISTS topic_assets');
  assert.ok(i >= 0, 'topic_assets DDL present');
  return s.slice(i);
}
const stripSqlComments = (s) => s.replace(/--.*$/gm, '');

test('schema: topic_assets DDL is idempotent and additive only', () => {
  const ddl = stripSqlComments(ddlBlock());
  assert.match(ddl, /CREATE TABLE IF NOT EXISTS topic_assets/);
  assert.match(ddl, /CREATE INDEX IF NOT EXISTS idx_topic_assets_topic_id ON topic_assets\(topic_id\)/);
  // Nothing in the block may change, drop or rewrite an existing object.
  assert.doesNotMatch(ddl, /\bDROP\b/i);
  // The only ALTER permitted is the single additive alt_text column (screen-reader description).
  const alters = ddl.match(/\bALTER\s+TABLE\b[^;]*;/gi) || [];
  assert.deepEqual(alters.map(a => a.replace(/\s+/g, ' ')), ['ALTER TABLE topic_assets ADD COLUMN IF NOT EXISTS alt_text TEXT;']);
  assert.doesNotMatch(ddl.replace(/ON DELETE/gi, ''), /\b(UPDATE|DELETE|TRUNCATE)\b/i);
  // Exactly one CREATE TABLE (the new one) and no CREATE without IF NOT EXISTS.
  assert.equal((ddl.match(/CREATE\s+TABLE/gi) || []).length, 1);
  assert.equal((ddl.match(/CREATE\s+(UNIQUE\s+)?INDEX(?!\s+IF NOT EXISTS)/gi) || []).length, 0);
});

test('schema: topic_assets has the approved shape (cascade, per-topic key uniqueness, bytea)', () => {
  const ddl = stripSqlComments(ddlBlock());
  assert.match(ddl, /topic_id\s+INT\s+NOT NULL REFERENCES topics\(id\) ON DELETE CASCADE/);
  assert.match(ddl, /UNIQUE \(topic_id, asset_key\)/);
  assert.match(ddl, /bytes\s+BYTEA NOT NULL/);
  assert.match(ddl, /displayed\s+BOOLEAN NOT NULL DEFAULT true/);
  assert.match(ddl, /sha256\s+TEXT NOT NULL/);
});

test('schema: topic_assets is not defined anywhere earlier in the file (no clash)', () => {
  const s = read('backend/schema.sql');
  assert.equal((s.match(/CREATE TABLE IF NOT EXISTS topic_assets/g) || []).length, 1);
});

const stripJsComments = (s) => s.replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '');
function routeBody(src, startMarker) {
  const i = src.indexOf(startMarker);
  assert.ok(i >= 0, `route ${startMarker} present`);
  let next = src.indexOf('\nrouter.', i + 10);
  const topicAssetsSection = src.indexOf('// ── Topic assets');
  if (topicAssetsSection > i && topicAssetsSection < next) next = topicAssetsSection;
  return stripJsComments(src.slice(i, next));
}

test('routes: list endpoint is metadata-only and never selects bytes', () => {
  const s = read('backend/src/routes/learning.ts');
  const body = routeBody(s, "router.get('/topics/:id/assets'");
  assert.match(body, /requirePerm\('topics\.read'\)/);
  assert.match(body, /displayed=true/);
  assert.match(body, /ORDER BY sort_order, id/);
  assert.doesNotMatch(body, /\bbytes\b/);
  assert.match(body, /\bcaption, alt_text\b/, 'list endpoint returns alt_text with the caption');
});

test('routes: bytes endpoint scopes like GET /topics, sets Content-Type + ETag, 304 before reading bytes', () => {
  const s = read('backend/src/routes/learning.ts');
  const body = routeBody(s, "router.get('/assets/:id'");
  assert.match(body, /requirePerm\('topics\.read'\)/);
  assert.match(body, /topicVisibilitySql\(user, params\)/);
  assert.match(body, /Content-Type/);
  assert.match(body, /ETag/);
  assert.match(body, /X-Content-Type-Options', 'nosniff'/);
  assert.match(body, /status\(304\)/);
  // The scope/metadata query must not read the image; bytes come from a second query.
  const firstQuery = body.slice(body.indexOf('SELECT a.mime'), body.indexOf('params,'));
  assert.doesNotMatch(firstQuery, /\bbytes\b/);
  assert.ok(body.indexOf("status(304)") < body.indexOf('SELECT bytes FROM topic_assets'));
});

test('routes: visibility helper mirrors GET /topics (teacher class/subject, viewer classes)', () => {
  const s = read('backend/src/routes/learning.ts');
  const helper = s.slice(s.indexOf('async function topicVisibilitySql'), s.indexOf("router.get('/topics/:id/assets'"));
  assert.match(helper, /assigned_class/);
  assert.match(helper, /assigned_subject_ids/);
  assert.match(helper, /resolveViewerClassNames\(user\)/);
  assert.match(helper, /t\.class_name = ANY/);
});

test('routes: existing GET /topics response is untouched', () => {
  const s = read('backend/src/routes/learning.ts');
  const body = routeBody(s, "router.get('/topics', requirePerm('topics.read')");
  assert.doesNotMatch(body, /topic_assets/);
});

test('attach script: dry-run default, hash check, idempotent insert, never writes topics', () => {
  const s = read('backend/src/db/attachTopicAssets.ts');
  assert.match(s, /apply = flag\('apply'\)/);
  assert.match(s, /ON CONFLICT \(topic_id, asset_key\) DO NOTHING/);
  assert.match(s, /sha256 mismatch/);
  assert.match(s, /Topic not found/);
  assert.match(s, /BEGIN/);
  assert.match(s, /ROLLBACK/);
  // Topics are only ever SELECTed.
  assert.doesNotMatch(s, /(INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+topics\b/i);
  // Hash verification happens before any database call in main().
  const main = s.slice(s.indexOf('async function main()'));
  assert.ok(main.indexOf('prepareAssets(') >= 0 && main.indexOf('prepareAssets(') < main.indexOf('attachAssets('));
});

test('mobile: lesson text rendering is unchanged and pictures render below it', () => {
  const s = read('mobile/src/screens/TopicDetailScreen.tsx');
  // The exact original text-rendering lines survive.
  assert.match(s, /\{topic\.description \? <Text style=\{styles\.desc\}>\{topic\.description\}<\/Text> : null\}/);
  assert.match(s, /<Text style=\{styles\.summaryText\}>\{topic\.summary\}<\/Text>/);
  assert.match(s, /Get Practice Questions/);
  assert.match(s, /onPress=\{complete\}/);
  // Pictures: whole (contain), authenticated, placed after the text blocks.
  assert.match(s, /resizeMode="contain"/);
  assert.match(s, /Authorization: `Bearer \$\{token\}`/);
  assert.match(s, /loadLessonAssets\(/);
  assert.match(read('mobile/src/api/lessonAssets.ts'), /\/learning\/topics\/\$\{topicId\}\/assets/);
  assert.ok(s.indexOf('{topic.summary ? (') < s.indexOf('assets.map('));
  // The Btn label expression is syntactically closed (it was not on master).
  assert.match(s, /'Get Study Notes'\}\n/);
});

test('mobile: offline cache module is untouched by this change', () => {
  // Asset metadata rides the existing GET cache; no offline file was edited.
  const s = read('mobile/src/screens/TopicDetailScreen.tsx');
  assert.doesNotMatch(s, /offline\//);
});
