import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  REPORT_PRINT_EXPORT_DENIED_MESSAGE,
  assertCanPrintOrExportReports,
  canPrintOrExportReports,
} from '../../mobile/src/utils/reportAccess.ts';

const read = (path: string) => readFileSync(path, 'utf8');

test('policy: administrators, finance administrators and parents may print and export', () => {
  for (const role of ['admin', 'finance_admin', 'parent']) {
    assert.equal(canPrintOrExportReports(role), true, role);
    assert.doesNotThrow(() => assertCanPrintOrExportReports(role), role);
  }
});

test('policy: teachers and students may NOT print or export', () => {
  for (const role of ['teacher', 'student']) {
    assert.equal(canPrintOrExportReports(role), false, role);
    assert.throws(() => assertCanPrintOrExportReports(role), { message: REPORT_PRINT_EXPORT_DENIED_MESSAGE }, role);
  }
});

test('policy: unknown, missing, empty or differently-cased roles are denied', () => {
  for (const role of [undefined, null, '', 'Teacher', 'ADMIN', 'superadmin', 'class_teacher']) {
    assert.equal(canPrintOrExportReports(role as string | null | undefined), false, String(role));
    assert.throws(() => assertCanPrintOrExportReports(role as string | null | undefined), String(role));
  }
});

for (const [file, builder] of [
  ['mobile/src/screens/MyResultsScreen.tsx', 'buildTermReportHtml'],
  ['mobile/src/screens/SessionReportScreen.tsx', 'buildSessionReportHtml'],
] as const) {
  test(`${file}: gate uses the shared policy and teachers are not named anywhere in it`, () => {
    const src = read(file);
    assert.match(src, /import \{ canPrintOrExportReports \} from '\.\.\/utils\/reportAccess'/);
    assert.match(src, /const canPrintExport = canPrintOrExportReports\(user\?\.role\);/);
    // No local role list may reappear next to the print/export gate.
    assert.ok(!/canPrintExport\s*=\s*user\?\.role\s*===/.test(src), 'no inline role comparison for canPrintExport');
    const gateLine = src.split('\n').find(line => line.includes('const canPrintExport'))!;
    assert.ok(!gateLine.includes('teacher') && !gateLine.includes('student'));
  });

  test(`${file}: handlers re-check the policy and pass the role to reportPdf`, () => {
    const src = read(file);
    for (const [handler, marker] of [['handlePrint', "setPdfBusy('print')"], ['handleExport', "setPdfBusy('export')"]]) {
      const start = src.indexOf(`const ${handler} = async () => {`);
      assert.ok(start >= 0, handler);
      const body = src.slice(start, src.indexOf(marker, start));
      assert.match(body, /if \(!canPrintExport\) return;/, `${handler} must bail out before doing any work`);
    }
    assert.match(src, /await printReportHtml\(html, user\?\.role\)/);
    assert.match(src, /await exportReportHtml\(html, .*, user\?\.role\)/);
    // Viewing is untouched: the HTML builder is still reachable and the buttons remain gated, not removed.
    assert.ok(src.includes(builder));
    assert.match(src, /\{canPrintExport && \(/);
    assert.ok(src.includes("label={pdfBusy === 'print' ? 'Opening…' : 'Print'}"));
    assert.ok(src.includes("label={pdfBusy === 'export' ? 'Exporting…' : 'Export PDF'}"));
  });
}

test('reportPdf refuses to print or export for a disallowed role before touching expo-print, the browser or the share sheet', () => {
  const src = read('mobile/src/utils/reportPdf.ts');
  assert.match(src, /import \{ assertCanPrintOrExportReports \} from '\.\/reportAccess'/);
  const print = src.slice(src.indexOf('export async function printReportHtml'));
  assert.match(print, /^export async function printReportHtml\(html: string, role: string \| null \| undefined\): Promise<void> \{\n  assertCanPrintOrExportReports\(role\);/);
  const exp = src.slice(src.indexOf('export async function exportReportHtml'));
  assert.match(exp, /^export async function exportReportHtml\(html: string, filenameBase: string, role: string \| null \| undefined\): Promise<void> \{\n  assertCanPrintOrExportReports\(role\);/);
  // The guard precedes every side effect in both functions.
  assert.ok(print.indexOf('assertCanPrintOrExportReports') < print.indexOf('window.open'));
  assert.ok(print.indexOf('assertCanPrintOrExportReports') < print.indexOf('Print.printAsync'));
  assert.ok(exp.indexOf('assertCanPrintOrExportReports') < exp.indexOf('Print.printToFileAsync'));
  assert.ok(exp.indexOf('assertCanPrintOrExportReports') < exp.indexOf('Sharing.shareAsync'));
  assert.match(exp, /return printReportHtml\(html, role\);/);
  // Stale claim that teachers may print/export must not return.
  assert.ok(!/admins, parents, and teachers/.test(src));
});

test('no other screen calls the report print/export functions (every caller is covered by this policy)', () => {
  const callers = ['MyResultsScreen', 'SessionReportScreen'];
  const dirs = ['mobile/src/screens', 'mobile/src/screens/admin', 'mobile/src/screens/teacher', 'mobile/src/screens/parent', 'mobile/src/screens/student', 'mobile/src/components', 'mobile/src/navigation'];
  const offenders: string[] = [];
  for (const dir of dirs) {
    for (const name of readdirSync(dir)) {
      if (!/\.tsx?$/.test(name)) continue;
      const src = read(`${dir}/${name}`);
      if (/\b(printReportHtml|exportReportHtml)\b/.test(src) && !callers.some(c => name.startsWith(c))) offenders.push(`${dir}/${name}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('teachers keep read access: report screens remain registered in the teacher navigator', () => {
  const teacherTabs = read('mobile/src/navigation/TeacherTabs.tsx');
  assert.ok(teacherTabs.includes('name="MyResults" component={MyResultsScreen}'));
  assert.ok(teacherTabs.includes('name="SessionReport" component={SessionReportScreen}'));
});
