// Run: node --test tests/mobile-staging-api-target.test.cjs
// Offline. Runs the REAL `expo config` evaluation of mobile/app.config.js + app.json (no network,
// no EAS account, no device) and unit-tests the shared validator. It proves what the build
// configuration resolves to; it does not prove an installed APK or Metro inlining (needs a build).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const mobile = path.join(root, 'mobile');
const appJson = JSON.parse(fs.readFileSync(path.join(mobile, 'app.json'), 'utf8'));
const PROD = appJson.expo.extra.apiUrl; // read, never hard-coded
const eas = JSON.parse(fs.readFileSync(path.join(mobile, 'eas.json'), 'utf8'));
const { assertStagingApiUrl, assertKnownTarget, resolveApiBaseUrl } = require(path.join(mobile, 'config', 'apiTarget.js'));
const STG = 'https://staging-api.invalid'; // reserved .invalid TLD: syntactically valid, resolves nowhere

function expoConfig(env) {
  // Minimal env on purpose so a developer's shell cannot leak EXPO_PUBLIC_API_URL / STS_BUILD_TARGET in.
  const clean = { PATH: process.env.PATH, HOME: fs.mkdtempSync(path.join(os.tmpdir(), 'expo-home-')),
    CI: '1', EXPO_OFFLINE: '1', EXPO_NO_TELEMETRY: '1', ...env };
  const r = spawnSync(process.execPath, [require.resolve('expo/bin/cli', { paths: [mobile] }), 'config', '--json', '--type', 'public'],
    { cwd: mobile, env: clean, encoding: 'utf8', timeout: 120000 });
  return { status: r.status, out: r.stdout, err: r.stderr, json: () => JSON.parse(r.stdout) };
}

test('production prod host is read from app.json and is a real https URL', () => {
  assert.match(PROD, /^https:\/\//);
});

test('eas.json: preview and production profiles are untouched; staging extends preview and carries no URL', () => {
  assert.equal(eas.build.preview.env, undefined);
  assert.equal(eas.build.production.env, undefined);
  // exact pre-D_PREP values: ordinary preview/production builds must not have changed
  assert.deepEqual(eas.build.preview, { distribution: 'internal', android: { buildType: 'apk' } });
  assert.deepEqual(eas.build.production, { android: { buildType: 'app-bundle' } });
  assert.deepEqual(eas.build.staging, { extends: 'preview', environment: 'preview', env: { STS_BUILD_TARGET: 'staging' } });
  assert.ok(!JSON.stringify(eas).includes('EXPO_PUBLIC_API_URL'), 'no invented URL / variable value in eas.json');
});

test('normal build (no STS_BUILD_TARGET): config identical to app.json, production URL preserved', () => {
  const r = expoConfig({});
  assert.equal(r.status, 0, r.err);
  const c = r.json();
  assert.equal(c.extra.apiUrl, PROD);
  assert.equal(c.extra.buildTarget, undefined);
  assert.equal(c.extra.productionApiUrl, undefined);
  assert.equal(c.extra.eas.projectId, appJson.expo.extra.eas.projectId);
  assert.deepEqual(c.extra, appJson.expo.extra, 'ordinary build: extra is exactly app.json extra');
  for (const k of ['name', 'slug', 'version']) assert.equal(c[k], appJson.expo[k], k);
  assert.equal(c.android.package, appJson.expo.android.package);
});

test('normal build with EXPO_PUBLIC_API_URL set: manifest unchanged (override happens only at bundle time)', () => {
  const r = expoConfig({ EXPO_PUBLIC_API_URL: STG });
  assert.equal(r.status, 0, r.err);
  assert.equal(r.json().extra.apiUrl, PROD);
});

test('staging build, URL absent: config evaluation fails (cannot silently use production)', () => {
  const r = expoConfig({ STS_BUILD_TARGET: 'staging' });
  assert.notEqual(r.status, 0);
  assert.match(r.err + r.out, /EXPO_PUBLIC_API_URL is not set/);
});

test('staging build, empty URL / the known production URL / unfilled placeholder: all refused', () => {
  for (const [value, re] of [['', /not set/], [PROD, /production host/], [PROD.toUpperCase().replace('HTTPS', 'https'), /production host|bare origin/],
    ['https://<staging-host>', /placeholder/]]) {
    const r = expoConfig({ STS_BUILD_TARGET: 'staging', EXPO_PUBLIC_API_URL: value });
    assert.notEqual(r.status, 0, `accepted ${value}`);
    assert.match(r.err + r.out, re, value);
  }
});

test('staging build, valid HTTPS staging origin: extra.apiUrl is staging, production recorded only for the runtime guard', () => {
  const r = expoConfig({ STS_BUILD_TARGET: 'staging', EXPO_PUBLIC_API_URL: STG });
  assert.equal(r.status, 0, r.err);
  const c = r.json();
  assert.equal(c.extra.apiUrl, STG);
  assert.equal(c.extra.buildTarget, 'staging');
  assert.equal(c.extra.productionApiUrl, PROD);
  assert.equal(c.extra.eas.projectId, appJson.expo.extra.eas.projectId);
  assert.equal(c.android.package, appJson.expo.android.package);
});

test('mobile/.env precedence (observed, not assumed): loaded when the shell is silent, shell wins, production in .env is refused', () => {
  const envFile = path.join(mobile, '.env');
  assert.ok(!fs.existsSync(envFile), 'refusing to clobber an existing mobile/.env');
  try {
    fs.writeFileSync(envFile, 'EXPO_PUBLIC_API_URL=https://dotenv-host.invalid\n');
    const fromDotenv = expoConfig({ STS_BUILD_TARGET: 'staging' });
    assert.equal(fromDotenv.status, 0, fromDotenv.err);
    assert.equal(fromDotenv.json().extra.apiUrl, 'https://dotenv-host.invalid'); // Expo CLI does load mobile/.env
    const shellWins = expoConfig({ STS_BUILD_TARGET: 'staging', EXPO_PUBLIC_API_URL: STG });
    assert.equal(shellWins.status, 0, shellWins.err);
    assert.equal(shellWins.json().extra.apiUrl, STG);
    fs.writeFileSync(envFile, `EXPO_PUBLIC_API_URL=${PROD}\n`);
    const prodDotenv = expoConfig({ STS_BUILD_TARGET: 'staging' });
    assert.notEqual(prodDotenv.status, 0);
    assert.match(prodDotenv.err + prodDotenv.out, /production host/);
  } finally {
    fs.rmSync(envFile, { force: true });
  }
});

test('typo in STS_BUILD_TARGET is an error, never an implicit normal build', () => {
  const r = expoConfig({ STS_BUILD_TARGET: 'stagging', EXPO_PUBLIC_API_URL: STG });
  assert.notEqual(r.status, 0);
  assert.match(r.err + r.out, /unrecognised STS_BUILD_TARGET/);
  assert.throws(() => assertKnownTarget({ STS_BUILD_TARGET: 'Staging' }));
  assert.doesNotThrow(() => assertKnownTarget({}));
  assert.doesNotThrow(() => assertKnownTarget({ STS_BUILD_TARGET: '' }));
});

test('validator rejects unusable staging URLs and accepts a bare https origin', () => {
  const bad = ['http://staging-api.invalid', 'https://localhost', 'https://127.0.0.1', 'https://10.0.2.2', 'ftp://x.invalid',
    'staging-api.invalid', 'https://user:pw@staging-api.invalid', 'https://staging-api.invalid/', 'https://staging-api.invalid/api',
    'https://staging-api.invalid?x=1', 'https://staging-api.invalid#f', ' https://staging-api.invalid', 'https://stag ing.invalid', undefined, null, 42];
  for (const u of bad) assert.throws(() => assertStagingApiUrl(u, PROD), /\[staging build\]/, String(u));
  assert.equal(assertStagingApiUrl(STG, PROD), STG);
  assert.equal(assertStagingApiUrl('https://staging-api.invalid:8443', PROD), 'https://staging-api.invalid:8443');
  assert.throws(() => assertStagingApiUrl(PROD, PROD), /production host/);
  assert.throws(() => assertStagingApiUrl(PROD.replace(/^https:\/\/([^/]+)/, (_m, h) => 'https://' + h.toUpperCase()), PROD));
});

test('validator (R5): trailing-dot production host, extra loopback/unspecified hosts, port 0 are refused', () => {
  const prodHost = new URL(PROD).hostname;
  for (const u of [`https://${prodHost}.`, `https://${prodHost}..`, `https://${prodHost}:8443`, 'https://localhost.', 'https://foo.localhost',
    'https://0.0.0.0', 'https://[::]', 'https://staging-api.invalid.', 'https://staging-api.invalid:0']) {
    assert.throws(() => assertStagingApiUrl(u, PROD), /\[staging build\]/, u);
  }
  for (const u of [`https://${prodHost}.`, `https://${prodHost}:8443`]) {
    const r = expoConfig({ STS_BUILD_TARGET: 'staging', EXPO_PUBLIC_API_URL: u });
    assert.notEqual(r.status, 0, `config accepted ${u}`);
  }
});

test('validator (R5): fails closed when the production reference is missing or unusable', () => {
  for (const p of [undefined, null, '', 'not a url', 42]) assert.throws(() => assertStagingApiUrl(STG, p), /production API URL in app\.json/, String(p));
});

test('runtime resolver (R5): ordinary build behaves exactly as before', () => {
  assert.equal(resolveApiBaseUrl({ envUrl: undefined, configuredUrl: PROD, extra: { apiUrl: PROD } }), PROD);
  assert.equal(resolveApiBaseUrl({ envUrl: STG, configuredUrl: PROD, extra: { apiUrl: PROD } }), STG); // documented .env override
  assert.equal(resolveApiBaseUrl({ envUrl: undefined, configuredUrl: undefined, extra: undefined }), 'http://10.0.2.2:4000');
  assert.equal(resolveApiBaseUrl({ envUrl: undefined, configuredUrl: PROD, extra: undefined }), PROD);
});

test('runtime resolver (R5): a staging manifest can never resolve to production, absent, empty or malformed', () => {
  const extra = { apiUrl: STG, buildTarget: 'staging', productionApiUrl: PROD };
  assert.equal(resolveApiBaseUrl({ envUrl: STG, configuredUrl: STG, extra }), STG);
  for (const envUrl of [undefined, '', PROD, 'https://<staging-host>', 'http://staging-api.invalid', 'not a url', `${PROD}/`]) {
    assert.throws(() => resolveApiBaseUrl({ envUrl, configuredUrl: PROD, extra }), /\[staging build\]/, String(envUrl));
  }
  // a staging manifest without its production reference cannot be proven safe
  assert.throws(() => resolveApiBaseUrl({ envUrl: STG, configuredUrl: STG, extra: { buildTarget: 'staging' } }), /production API URL in app\.json/);
});

test('client.ts uses the shared resolver and keeps the literal env access Metro needs for inlining', () => {
  const s = fs.readFileSync(path.join(mobile, 'src/api/client.ts'), 'utf8').replace(/\/\/.*$/gm, '');
  assert.match(s, /process\.env\.EXPO_PUBLIC_API_URL/);
  assert.match(s, /resolveApiBaseUrl\(\{ envUrl, configuredUrl, extra: Constants\.expoConfig\?\.extra \}\)/);
  assert.ok(!/sts-school-backend|onrender\.com/.test(s), 'no hard-coded production URL in client.ts');
});

function exportBundle(env) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-export-'));
  const clean = { PATH: process.env.PATH, HOME: fs.mkdtempSync(path.join(os.tmpdir(), 'expo-home-')),
    CI: '1', EXPO_OFFLINE: '1', EXPO_NO_TELEMETRY: '1', ...env };
  const r = spawnSync(process.execPath, [require.resolve('expo/bin/cli', { paths: [mobile] }), 'export', '--platform', 'android',
    '--no-minify', '--no-bytecode', '--output-dir', out], { cwd: mobile, env: clean, encoding: 'utf8', timeout: 240000 });
  const jsDir = path.join(out, '_expo', 'static', 'js', 'android');
  const js = fs.existsSync(jsDir) ? fs.readdirSync(jsDir).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(jsDir, f), 'utf8')) : [];
  return { status: r.status, err: r.stderr + r.stdout, bundle: js.join('\n'), out };
}

test('bundled runtime path (R5): real Metro bundle of a staging build inlines the staging URL and never contains the production host', () => {
  const prodHost = new URL(PROD).hostname;
  const ok = exportBundle({ STS_BUILD_TARGET: 'staging', EXPO_PUBLIC_API_URL: STG });
  try {
    assert.equal(ok.status, 0, ok.err);
    assert.ok(ok.bundle.length > 1e6, 'bundle produced');
    assert.match(ok.bundle, new RegExp(`var envUrl = "${STG.replace(/[.]/g, '\\.')}";`), 'literal inlined into client.ts');
    const code = ok.bundle.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''); // comments survive --no-minify; only code counts
    assert.ok(!code.includes('process.env.EXPO_PUBLIC_API_URL'), 'no un-inlined env access left in executable code');
    assert.ok(!ok.bundle.includes(prodHost), 'production host is not in the staging bundle');
    assert.match(ok.bundle, /resolveApiBaseUrl\)\(\{\s*envUrl,/);
  } finally { fs.rmSync(ok.out, { recursive: true, force: true }); }
  const bad = exportBundle({ STS_BUILD_TARGET: 'staging' });
  try {
    assert.notEqual(bad.status, 0, 'a staging bundle without the URL must not be produced');
    assert.equal(bad.bundle, '');
    assert.match(bad.err, /EXPO_PUBLIC_API_URL is not set/);
  } finally { fs.rmSync(bad.out, { recursive: true, force: true }); }
});
