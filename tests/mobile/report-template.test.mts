import assert from 'node:assert/strict';
import test from 'node:test';
import { renderTermReportHtml } from '../../mobile/src/utils/reportTemplate.ts';

const primaryBrand = {
  code: 'primary' as const,
  name: 'Sow the Seed Nursery & Primary School',
  shortName: 'Nursery & Primary',
  motto: 'Growing in Wisdom and finding favour with God and Man. (Luke 2:52)',
  logo: 1,
  address: 'Olosan Road, Alakia, Ibadan',
  phone: '+2348107551000',
};

const secondaryBrand = {
  code: 'secondary' as const,
  name: 'Sow the Seed Model College',
  shortName: 'Model College',
  motto: 'We all shall be taught of God. John 6:45',
  logo: 1,
  address: 'Olosan Road, Alakia',
  phone: '08033269042',
};

function report(schoolCode: 'primary' | 'secondary') {
  return {
    student: {
      school_code: schoolCode,
      full_name: 'Oludotun Mary',
      admission_number: 'AG012',
      class_name: schoolCode === 'primary' ? 'Grade 4' : 'JSS2',
    },
    term: { name: 'Second Term', academic_year: '2025/2026', days_opened: 120 },
    attendance: { days_opened: 120, days_present: 114 },
    scores: [{
      subject_name: 'English Language',
      ca1: 18,
      ca2: 20,
      exam: 57,
      total: 95,
      grade: 'A',
      class_highest: 98,
      class_average: 77.38,
      teacher_remark: 'Excellent progress',
    }],
    summary: { total_score: 1611, average: 84.8, subject_count: 19 },
    class_record: {
      class_teacher_remark: 'Well mannered',
      admin_remark: 'Excellent result, keep it up.',
    },
  };
}

test('primary report uses the exact supplied assessment maxima and full report sections', () => {
  const html = renderTermReportHtml(report('primary'), primaryBrand, 'data:image/png;base64,logo');

  for (const expected of [
    'ACADEMIC REPORT',
    'Second Term',
    '2025/2026',
    'STUDENT NAME',
    'ADMISSION NO.',
    'DAYS SCHOOL OPENED',
    'DAYS PRESENT',
    'DAYS ABSENT',
    'ATTENDANCE RATE',
    'CA 1<br>(20)',
    'CA 2<br>(20)',
    'EXAM<br>(60)',
    'TOTAL<br>(100)',
    'HIGHEST<br>IN CLASS',
    'CLASS<br>AVERAGE',
    'English Language',
    'Excellent progress',
    'TOTAL SCORE',
    'AVERAGE',
    'SUBJECTS TAKEN',
    'KEY:',
    "CLASS TEACHER'S REMARK",
    "HEAD TEACHER'S REMARK",
    "CLASS TEACHER'S SIGNATURE",
    "HEAD TEACHER'S SIGNATURE",
    '© 2025/2026',
  ]) assert.ok(html.includes(expected), `missing report field: ${expected}`);

  assert.ok(html.includes('114</span>'));
  assert.ok(html.includes('6</span>'));
  assert.ok(html.includes('95%'));
  assert.ok(!html.includes('Overall Position'));
  assert.ok(!html.includes('POSITION</th>'));
});

test('secondary report uses the secondary assessment maxima and principal labels', () => {
  const html = renderTermReportHtml(report('secondary'), secondaryBrand, '');

  assert.ok(html.includes('CA 1<br>(15)'));
  assert.ok(html.includes('CA 2<br>(15)'));
  assert.ok(html.includes('EXAM<br>(70)'));
  assert.ok(html.includes("PRINCIPAL'S REMARK"));
  assert.ok(html.includes("PRINCIPAL'S SIGNATURE"));
  assert.ok(!html.includes("HEAD TEACHER'S REMARK"));
});

test('student, subject, remarks and branding text are escaped before HTML rendering', () => {
  const data = report('primary');
  data.student.full_name = '<script>alert(1)</script>';
  data.scores[0].subject_name = '<img src=x onerror=alert(1)>';
  data.class_record.class_teacher_remark = '<b>not markup</b>';
  const html = renderTermReportHtml(data, {
    ...primaryBrand,
    name: '<img src=x>',
  }, '');

  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(html.includes('&lt;b&gt;not markup&lt;/b&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x>'));
});

test('missing remarks are explicitly represented without fabricating content', () => {
  const data = report('secondary');
  data.class_record.class_teacher_remark = null;
  data.class_record.admin_remark = null;
  const html = renderTermReportHtml(data, secondaryBrand, '');

  assert.equal((html.match(/No remark entered/g) ?? []).length, 2);
});
