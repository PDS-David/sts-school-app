import * as XLSX from 'xlsx';

export type StudentClassListEntry = {
  fullName: string;
  className: string;
  schoolCode: 'primary' | 'secondary';
  sourceClass: string;
  rowNumber: number;
};

const CLASS_MAP: Record<string, { className: string; schoolCode: 'primary' | 'secondary' }> = {
  'Grade 1': { className: 'Primary 1', schoolCode: 'primary' },
  'Grade 2': { className: 'Primary 2', schoolCode: 'primary' },
  'Grade 3': { className: 'Primary 3', schoolCode: 'primary' },
  'Grade 4': { className: 'Primary 4', schoolCode: 'primary' },
  'Grade 5': { className: 'Primary 5', schoolCode: 'primary' },
  JSS1: { className: 'JSS 1', schoolCode: 'secondary' },
  JSS2: { className: 'JSS 2', schoolCode: 'secondary' },
  JSS3: { className: 'JSS 3', schoolCode: 'secondary' },
  SS1: { className: 'SS 1', schoolCode: 'secondary' },
  SS2: { className: 'SS 2', schoolCode: 'secondary' },
};

const EXPECTED_COUNTS: Record<string, number> = {
  'Grade 1': 8, 'Grade 2': 15, 'Grade 3': 9, 'Grade 4': 16, 'Grade 5': 9,
  JSS1: 8, JSS2: 14, JSS3: 5, SS1: 13, SS2: 7,
};

export function normalizeRosterName(value: string): string {
  return value.normalize('NFKC').trim().replace(/\\s+/g, ' ').toLocaleLowerCase('en');
}

export function parseStudentClassListWorkbook(buffer: Buffer): StudentClassListEntry[] {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });
  const studentsSheet = workbook.Sheets.Students;
  const summarySheet = workbook.Sheets.Summary;
  if (!studentsSheet || !summarySheet) throw new Error('Workbook must contain Students and Summary worksheets.');

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(studentsSheet, { header: 1, defval: '', raw: false });
  const header = (rawRows[0] ?? []).map(value => String(value).trim());
  for (const required of ['S/N', 'Student Name', 'Class', 'Section']) {
    if (!header.includes(required)) throw new Error('Students worksheet is missing column: ' + required);
  }
  const col = (name: string) => header.indexOf(name);
  const entries: StudentClassListEntry[] = [];
  const seen = new Set<string>();
  const counts = new Map<string, number>();

  rawRows.slice(1).forEach((row, index) => {
    if (!row.some(value => String(value ?? '').trim())) return;
    const rowNumber = index + 2;
    const serial = Number(row[col('S/N')]);
    const fullName = String(row[col('Student Name')] ?? '').normalize('NFKC').trim().replace(/\\s+/g, ' ');
    const sourceClass = String(row[col('Class')] ?? '').trim();
    const section = String(row[col('Section')] ?? '').trim();
    const mapping = CLASS_MAP[sourceClass];
    if (!Number.isInteger(serial) || serial !== entries.length + 1) {
      throw new Error('Row ' + rowNumber + ': S/N must be sequential starting at 1.');
    }
    if (fullName.length < 2 || fullName.length > 180) throw new Error('Row ' + rowNumber + ': invalid Student Name.');
    if (!mapping) throw new Error('Row ' + rowNumber + ': unsupported class "' + sourceClass + '".');
    const expectedSection = mapping.schoolCode === 'primary' ? 'Primary' : 'Secondary';
    if (section !== expectedSection) throw new Error('Row ' + rowNumber + ': Section does not match class "' + sourceClass + '".');
    const key = mapping.schoolCode + '|' + normalizeRosterName(fullName);
    if (seen.has(key)) throw new Error('Row ' + rowNumber + ': duplicate student name in the same school: ' + fullName);
    seen.add(key);
    counts.set(sourceClass, (counts.get(sourceClass) ?? 0) + 1);
    entries.push({ fullName, className: mapping.className, schoolCode: mapping.schoolCode, sourceClass, rowNumber });
  });

  if (entries.length !== 104) throw new Error('Expected exactly 104 student rows; found ' + entries.length + '.');
  for (const [sourceClass, expected] of Object.entries(EXPECTED_COUNTS)) {
    const actual = counts.get(sourceClass) ?? 0;
    if (actual !== expected) throw new Error(sourceClass + ': expected ' + expected + ' students; found ' + actual + '.');
  }
  if (counts.size !== Object.keys(EXPECTED_COUNTS).length) throw new Error('Students worksheet contains an unexpected class.');

  const summaryRows = XLSX.utils.sheet_to_json<unknown[]>(summarySheet, { header: 1, defval: '', raw: false });
  const summaryHeader = (summaryRows[0] ?? []).map(value => String(value).trim());
  const classCol = summaryHeader.indexOf('Class');
  const countCol = summaryHeader.indexOf('Number of Students');
  if (classCol < 0 || countCol < 0) throw new Error('Summary worksheet is missing Class or Number of Students.');
  const summaryCounts = new Map<string, number>();
  for (const row of summaryRows.slice(1)) {
    const className = String(row[classCol] ?? '').trim();
    if (!className || /^total$/i.test(className)) continue;
    const count = Number(row[countCol]);
    if (!Number.isInteger(count) || count < 0) throw new Error('Summary contains an invalid count for ' + className + '.');
    summaryCounts.set(className, count);
  }
  for (const [sourceClass, expected] of Object.entries(EXPECTED_COUNTS)) {
    if (summaryCounts.get(sourceClass) !== expected) {
      throw new Error('Summary mismatch for ' + sourceClass + ': expected ' + expected + '.');
    }
  }
  return entries;
}
