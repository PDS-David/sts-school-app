import * as XLSX from 'xlsx';

export interface PhysicalRosterEntry {
  studentId: string;
  fullName: string;
  schoolCode: 'primary' | 'secondary';
  sourceClassName: string;
  className: string;
  rosterIdentity: string;
}

const CLASS_MAP: Record<string, { schoolCode: 'primary' | 'secondary'; className: string }> = {
  'Grade 1': { schoolCode: 'primary', className: 'Primary 1' },
  'Grade 2': { schoolCode: 'primary', className: 'Primary 2' },
  'Grade 3': { schoolCode: 'primary', className: 'Primary 3' },
  'Grade 4': { schoolCode: 'primary', className: 'Primary 4' },
  'Grade 5': { schoolCode: 'primary', className: 'Primary 5' },
  JSS1: { schoolCode: 'secondary', className: 'JSS 1' },
  JSS2: { schoolCode: 'secondary', className: 'JSS 2' },
  JSS3: { schoolCode: 'secondary', className: 'JSS 3' },
  SS1: { schoolCode: 'secondary', className: 'SS 1' },
  SS2: { schoolCode: 'secondary', className: 'SS 2' },
};

const EXPECTED_CLASS_COUNTS: Record<string, number> = {
  'Grade 1': 8,
  'Grade 2': 15,
  'Grade 3': 9,
  'Grade 4': 16,
  'Grade 5': 9,
  JSS1: 8,
  JSS2: 14,
  JSS3: 5,
  SS1: 13,
  SS2: 7,
};

function requiredText(value: unknown, field: string, rowNumber: number): string {
  const result = String(value ?? '').trim();
  if (!result) throw new Error(`Roster row ${rowNumber}: ${field} is required`);
  return result;
}

function normalizeName(value: string): string {
  return value.normalize('NFKC').trim().replace(/\\s+/g, ' ').toLocaleLowerCase('en');
}

/**
 * Parse only the historical source identity columns. Current Enrolment Status,
 * Current Class, verification fields and admission numbers are intentionally
 * ignored: the original report-sheet class is the starting physical roster.
 * Teachers make later placement/removal decisions through the app.
 */
export function parsePhysicalRosterWorkbook(
  buffer: Buffer,
  expectedCount = 104,
): PhysicalRosterEntry[] {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });
  const sheet = workbook.Sheets['Teacher Verification'];
  if (!sheet) throw new Error('Workbook is missing the "Teacher Verification" sheet');

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false });
  if (rows.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} historical roster rows; found ${rows.length}`);
  }

  const seenIds = new Set<string>();
  const seenRosterIds = new Set<string>();
  const seenIdentity = new Set<string>();
  const classCounts = new Map<string, number>();
  const entries: PhysicalRosterEntry[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const fullName = requiredText(row['Student Name'], 'Student Name', rowNumber);
    const sourceClassName = requiredText(row['Last-Term Class'], 'Last-Term Class', rowNumber);
    const section = requiredText(row['School Section'], 'School Section', rowNumber);
    const rosterIdentity = requiredText(row['Roster Identity (not admission no.)'], 'Roster Identity', rowNumber).toUpperCase();
    const studentId = requiredText(row['Internal Student UUID'], 'Internal Student UUID', rowNumber).toLowerCase();
    const mapping = CLASS_MAP[sourceClassName];

    if (!mapping) throw new Error(`Roster row ${rowNumber}: unsupported source class "${sourceClassName}"`);
    if ((section === 'Primary' ? 'primary' : section === 'Secondary' ? 'secondary' : null) !== mapping.schoolCode) {
      throw new Error(`Roster row ${rowNumber}: school section does not match source class "${sourceClassName}"`);
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(studentId)) {
      throw new Error(`Roster row ${rowNumber}: Internal Student UUID must be a valid UUIDv5`);
    }
    if (seenIds.has(studentId)) throw new Error(`Roster row ${rowNumber}: duplicate Internal Student UUID ${studentId}`);
    if (seenRosterIds.has(rosterIdentity)) throw new Error(`Roster row ${rowNumber}: duplicate Roster Identity ${rosterIdentity}`);

    const identityKey = `${mapping.schoolCode}|${sourceClassName}|${normalizeName(fullName)}`;
    if (seenIdentity.has(identityKey)) throw new Error(`Roster row ${rowNumber}: duplicate student name in source class`);

    seenIds.add(studentId);
    seenRosterIds.add(rosterIdentity);
    seenIdentity.add(identityKey);
    classCounts.set(sourceClassName, (classCounts.get(sourceClassName) ?? 0) + 1);
    entries.push({
      studentId,
      fullName,
      schoolCode: mapping.schoolCode,
      sourceClassName,
      className: mapping.className,
      rosterIdentity,
    });
  });

  if (expectedCount === 104) {
    for (const [sourceClass, expected] of Object.entries(EXPECTED_CLASS_COUNTS)) {
      const actual = classCounts.get(sourceClass) ?? 0;
      if (actual !== expected) {
        throw new Error(`Expected ${expected} students in ${sourceClass}; found ${actual}`);
      }
    }
    if (classCounts.size !== Object.keys(EXPECTED_CLASS_COUNTS).length) {
      throw new Error('Workbook contains an unexpected source class');
    }
  }

  return entries;
}
