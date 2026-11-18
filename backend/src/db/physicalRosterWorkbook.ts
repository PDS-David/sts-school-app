import * as XLSX from 'xlsx';

export type PhysicalRosterEnrolmentStatus = 'active' | 'transferred' | 'left';

export interface PhysicalRosterEntry {
  studentId: string;
  internalStudentId: string;
  matchedProductionStudentId: string | null;
  fullName: string;
  schoolCode: 'primary' | 'secondary';
  sourceClassName: string;
  className: string | null;
  rosterIdentity: string;
  enrolmentStatus: PhysicalRosterEnrolmentStatus;
  verifiedBy: string;
  verificationDate: string;
  evidence: string;
}

type ClassMapping = { schoolCode: 'primary' | 'secondary'; className: string };

const SOURCE_CLASS_MAP: Record<string, ClassMapping> = {
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

const CURRENT_CLASS_MAP: Record<string, ClassMapping> = {
  'Pre-Nursery': { schoolCode: 'primary', className: 'Pre-Nursery' },
  Reception: { schoolCode: 'primary', className: 'Reception' },
  'Nursery 1': { schoolCode: 'primary', className: 'Nursery 1' },
  'Nursery 2': { schoolCode: 'primary', className: 'Nursery 2' },
  'KG 1': { schoolCode: 'primary', className: 'KG 1' },
  'KG 2': { schoolCode: 'primary', className: 'KG 2' },
  'Primary 1': { schoolCode: 'primary', className: 'Primary 1' },
  'Primary 2': { schoolCode: 'primary', className: 'Primary 2' },
  'Primary 3': { schoolCode: 'primary', className: 'Primary 3' },
  'Primary 4': { schoolCode: 'primary', className: 'Primary 4' },
  'Primary 5': { schoolCode: 'primary', className: 'Primary 5' },
  'Primary 6': { schoolCode: 'primary', className: 'Primary 6' },
  JSS1: { schoolCode: 'secondary', className: 'JSS 1' },
  'JSS 1': { schoolCode: 'secondary', className: 'JSS 1' },
  JSS2: { schoolCode: 'secondary', className: 'JSS 2' },
  'JSS 2': { schoolCode: 'secondary', className: 'JSS 2' },
  JSS3: { schoolCode: 'secondary', className: 'JSS 3' },
  'JSS 3': { schoolCode: 'secondary', className: 'JSS 3' },
  SS1: { schoolCode: 'secondary', className: 'SS 1' },
  'SS 1': { schoolCode: 'secondary', className: 'SS 1' },
  SS2: { schoolCode: 'secondary', className: 'SS 2' },
  'SS 2': { schoolCode: 'secondary', className: 'SS 2' },
  SS3: { schoolCode: 'secondary', className: 'SS 3' },
  'SS 3': { schoolCode: 'secondary', className: 'SS 3' },
};

const EXPECTED_SOURCE_CLASS_COUNTS: Record<string, number> = {
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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_V5_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requiredText(value: unknown, field: string, rowNumber: number): string {
  const result = String(value ?? '').trim();
  if (!result) throw new Error('Roster row ' + rowNumber + ': ' + field + ' is required');
  return result;
}

function normalizeName(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');
}

function isValidVerificationDate(value: string): boolean {
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  if (iso) {
    const year = Number(iso[1]), month = Number(iso[2]), day = Number(iso[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }
  const local = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(value);
  if (local) {
    const first = Number(local[1]), second = Number(local[2]), year = Number(local[3]);
    // Nigeria's worksheet dates are day-first; accept either day/month or month/day
    // only when the numeric values form a real calendar date.
    const day = first > 12 ? first : second;
    const month = first > 12 ? second : first;
    if (day < 1 || day > 31 || month < 1 || month > 12) return false;
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }
  return false;
}

function parseStatus(value: string, rowNumber: number): PhysicalRosterEnrolmentStatus {
  const status = value.trim().toLocaleLowerCase('en').replace(/\s+/g, ' ');
  if (status === 'still enrolled - same class' || status === 'promoted' || status === 'retained') return 'active';
  if (status === 'transferred') return 'transferred';
  if (status === 'left school') return 'left';
  throw new Error('Roster row ' + rowNumber + ': enrolment status "' + value + '" is not verified for import; select a verified status or resolve the record first');
}

/**
 * Parse historical identities and verified current-enrolment decisions.
 * Historical class is retained as provenance only. Only verified active
 * enrolments receive an active report-roster placement. Transfers and leavers
 * are recorded as skipped candidates, never imported as active students.
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
    throw new Error('Expected ' + expectedCount + ' historical roster rows; found ' + rows.length);
  }

  const seenInternalIds = new Set<string>();
  const seenTargetIds = new Set<string>();
  const seenRosterIds = new Set<string>();
  const seenIdentity = new Set<string>();
  const sourceClassCounts = new Map<string, number>();
  const entries: PhysicalRosterEntry[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const fullName = requiredText(row['Student Name'], 'Student Name', rowNumber);
    const sourceClassName = requiredText(row['Last-Term Class'], 'Last-Term Class', rowNumber);
    const section = requiredText(row['School Section'], 'School Section', rowNumber);
    const rosterIdentity = requiredText(row['Roster Identity (not admission no.)'], 'Roster Identity', rowNumber).toUpperCase();
    const internalStudentId = requiredText(row['Internal Student UUID'], 'Internal Student UUID', rowNumber).toLowerCase();
    const statusText = requiredText(row['Current Enrolment Status'], 'Current Enrolment Status', rowNumber);
    const enrolmentStatus = parseStatus(statusText, rowNumber);
    const verifiedBy = requiredText(row['Verified By'], 'Verified By', rowNumber);
    const verificationDate = requiredText(row['Verification Date'], 'Verification Date', rowNumber);
    const evidence = String(row['Evidence / Notes'] ?? '').trim();
    const matchedValue = String(row['Matched Production Student ID'] ?? '').trim().toLowerCase();
    const sourceMapping = SOURCE_CLASS_MAP[sourceClassName];

    if (!sourceMapping) throw new Error('Roster row ' + rowNumber + ': unsupported source class "' + sourceClassName + '"');
    if ((section === 'Primary' ? 'primary' : section === 'Secondary' ? 'secondary' : null) !== sourceMapping.schoolCode) {
      throw new Error('Roster row ' + rowNumber + ': school section does not match historical source class "' + sourceClassName + '"');
    }
    if (!UUID_V5_PATTERN.test(internalStudentId)) {
      throw new Error('Roster row ' + rowNumber + ': Internal Student UUID must be a valid UUIDv5');
    }
    if (!isValidVerificationDate(verificationDate)) {
      throw new Error('Roster row ' + rowNumber + ': Verification Date must be a valid date (YYYY-MM-DD or day/month/year)');
    }
    if (matchedValue && !UUID_PATTERN.test(matchedValue)) {
      throw new Error('Roster row ' + rowNumber + ': Matched Production Student ID must be a valid UUID');
    }
    if ((enrolmentStatus === 'transferred' || enrolmentStatus === 'left') && !evidence) {
      throw new Error('Roster row ' + rowNumber + ': Evidence / Notes is required for transferred or left-school records');
    }

    let className: string | null = null;
    if (enrolmentStatus === 'active') {
      const currentClass = requiredText(row['Current Class (verified)'], 'Current Class (verified)', rowNumber);
      const currentMapping = CURRENT_CLASS_MAP[currentClass];
      if (!currentMapping) throw new Error('Roster row ' + rowNumber + ': unsupported verified current class "' + currentClass + '"');
      if (currentMapping.schoolCode !== sourceMapping.schoolCode) {
        throw new Error('Roster row ' + rowNumber + ': verified current class belongs to a different school section');
      }
      if ((statusText.trim().toLocaleLowerCase('en') === 'still enrolled - same class'
          || statusText.trim().toLocaleLowerCase('en') === 'retained')
          && currentMapping.className !== sourceMapping.className) {
        throw new Error('Roster row ' + rowNumber + ': same-class/retained status must keep the historical class as current class');
      }
      if (statusText.trim().toLocaleLowerCase('en') === 'promoted'
          && currentMapping.className === sourceMapping.className) {
        throw new Error('Roster row ' + rowNumber + ': promoted status requires a different verified current class');
      }
      className = currentMapping.className;
    }

    const identityKey = sourceMapping.schoolCode + '|' + sourceClassName + '|' + normalizeName(fullName);
    const studentId = matchedValue || internalStudentId;
    if (seenInternalIds.has(internalStudentId)) throw new Error('Roster row ' + rowNumber + ': duplicate Internal Student UUID ' + internalStudentId);
    if (seenTargetIds.has(studentId)) throw new Error('Roster row ' + rowNumber + ': duplicate target student UUID ' + studentId);
    if (seenRosterIds.has(rosterIdentity)) throw new Error('Roster row ' + rowNumber + ': duplicate Roster Identity ' + rosterIdentity);
    if (seenIdentity.has(identityKey)) throw new Error('Roster row ' + rowNumber + ': duplicate student name in historical source class');

    seenInternalIds.add(internalStudentId);
    seenTargetIds.add(studentId);
    seenRosterIds.add(rosterIdentity);
    seenIdentity.add(identityKey);
    sourceClassCounts.set(sourceClassName, (sourceClassCounts.get(sourceClassName) ?? 0) + 1);
    entries.push({
      studentId,
      internalStudentId,
      matchedProductionStudentId: matchedValue || null,
      fullName,
      schoolCode: sourceMapping.schoolCode,
      sourceClassName,
      className,
      rosterIdentity,
      enrolmentStatus,
      verifiedBy,
      verificationDate,
      evidence,
    });
  });

  if (expectedCount === 104) {
    for (const [sourceClass, expected] of Object.entries(EXPECTED_SOURCE_CLASS_COUNTS)) {
      const actual = sourceClassCounts.get(sourceClass) ?? 0;
      if (actual !== expected) {
        throw new Error('Expected ' + expected + ' historical students in ' + sourceClass + '; found ' + actual);
      }
    }
    if (sourceClassCounts.size !== Object.keys(EXPECTED_SOURCE_CLASS_COUNTS).length) {
      throw new Error('Workbook contains an unexpected historical source class');
    }
  }

  return entries;
}