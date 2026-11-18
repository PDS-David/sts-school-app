import { Router } from 'express';
import multer from 'multer';
import { createHash } from 'node:crypto';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { query, withTransaction } from '../db/pool.js';
import { auditContextFromRequest, auditInTransaction } from '../utils/audit.js';
import { parseStudentClassListWorkbook, normalizeRosterName } from '../db/studentClassListWorkbook.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!/\.xlsx$/i.test(file.originalname)) return callback(null, false);
    callback(null, true);
  },
});
router.use(requireAuth, requireRole('admin'));

function requireGlobalAdmin(req: any, res: any): boolean {
  if (req.user?.school_code) {
    res.status(403).json({ error: 'A global administrator is required to import records into both school sections.' });
    return false;
  }
  return true;
}

async function inspectWorkbook(buffer: Buffer) {
  const entries = parseStudentClassListWorkbook(buffer);
  const namesBySchool = {
    primary: entries.filter(entry => entry.schoolCode === 'primary').map(entry => normalizeRosterName(entry.fullName)),
    secondary: entries.filter(entry => entry.schoolCode === 'secondary').map(entry => normalizeRosterName(entry.fullName)),
  };
  const conflicts: Array<{ schoolCode: string; fullName: string; existingClass: string }> = [];
  for (const schoolCode of ['primary', 'secondary'] as const) {
    const { rows } = await query(
      `SELECT s.full_name, COALESCE(m.class_name, s.class_name) AS class_name
         FROM students s
         LEFT JOIN report_roster_memberships m ON m.student_id=s.id AND m.status='active'
        WHERE s.school_code=$1 AND s.deleted_at IS NULL
          AND lower(regexp_replace(trim(s.full_name), '\s+', ' ', 'g')) = ANY($2::text[])`,
      [schoolCode, namesBySchool[schoolCode]],
    );
    for (const row of rows) conflicts.push({ schoolCode, fullName: row.full_name, existingClass: row.class_name });
  }
  const { rows: schools } = await query(
    'SELECT code FROM schools WHERE code = ANY($1::text[]) ORDER BY code',
    [['primary', 'secondary']],
  );
  if (schools.length !== 2) throw new Error('Both primary and secondary school records must exist before import.');
  return { entries, conflicts };
}

router.post('/preview', upload.single('file'), async (req, res) => {
  if (!requireGlobalAdmin(req, res)) return;
  if (!req.file) return res.status(400).json({ error: 'Attach Student_Class_List.xlsx in the file field.' });
  const buffer = req.file.buffer;
  const { entries, conflicts } = await inspectWorkbook(buffer);
  const classTotals = Object.fromEntries(
    [...new Set(entries.map(entry => entry.className))].sort().map(className => [
      className, entries.filter(entry => entry.className === className).length,
    ]),
  );
  return res.json({
    preview: true,
    sha256: createHash('sha256').update(buffer).digest('hex'),
    total: entries.length,
    classTotals,
    schoolTotals: { primary: entries.filter(e => e.schoolCode === 'primary').length, secondary: entries.filter(e => e.schoolCode === 'secondary').length },
    conflicts,
    canImport: conflicts.length === 0,
    note: 'No database records were changed by this preview.',
  });
});

router.post('/confirm', upload.single('file'), async (req, res) => {
  if (!requireGlobalAdmin(req, res)) return;
  if (!req.file) return res.status(400).json({ error: 'Attach the same workbook used for preview.' });
  if (req.body?.confirm !== 'true') return res.status(400).json({ error: 'Explicit confirm=true is required.' });
  const buffer = req.file.buffer;
  const sha256 = createHash('sha256').update(buffer).digest('hex');
  if (typeof req.body?.sha256 !== 'string' || req.body.sha256 !== sha256) {
    return res.status(409).json({ error: 'Workbook does not match the approved preview. Preview again before confirming.' });
  }
  const { entries } = await inspectWorkbook(buffer);
  const result = await withTransaction(async client => {
    await client.query('SELECT pg_advisory_xact_lock(1937001, 104)');
    // Recheck under the transaction lock to prevent a preview/confirm race.
    const schoolNames = {
      primary: entries.filter(e => e.schoolCode === 'primary').map(e => normalizeRosterName(e.fullName)),
      secondary: entries.filter(e => e.schoolCode === 'secondary').map(e => normalizeRosterName(e.fullName)),
    };
    for (const schoolCode of ['primary', 'secondary'] as const) {
      const duplicate = await client.query(
        `SELECT s.id, s.full_name FROM students s
          WHERE s.school_code=$1 AND s.deleted_at IS NULL
            AND lower(regexp_replace(trim(s.full_name), '\s+', ' ', 'g')) = ANY($2::text[])
          LIMIT 1`,
        [schoolCode, schoolNames[schoolCode]],
      );
      if (duplicate.rows[0]) throw new Error('Import stopped: "' + duplicate.rows[0].full_name + '" already exists in ' + schoolCode + '. No records were imported.');
    }

    let inserted = 0;
    const bySchool: Record<string, number> = { primary: 0, secondary: 0 };
    for (const entry of entries) {
      const student = await client.query(
        `INSERT INTO students (school_code, full_name, class_name)
         VALUES ($1,$2,$3) RETURNING id`,
        [entry.schoolCode, entry.fullName, entry.className],
      );
      const studentId = student.rows[0].id as string;
      await client.query(
        `INSERT INTO report_roster_memberships
          (student_id,class_name,source_class_name,status,joined_at,changed_by)
         VALUES ($1,$2,$3,'active',now(),$4)`,
        [studentId, entry.className, entry.sourceClass, req.user!.id],
      );
      await client.query(
        `INSERT INTO report_roster_membership_events
          (student_id,event_type,to_class_name,actor_id,details)
         VALUES ($1,'enrolled',$2,$3,$4::jsonb)`,
        [studentId, entry.className, req.user!.id, JSON.stringify({
          source: 'student_class_list_bulk_import',
          source_file_sha256: sha256,
          source_row: entry.rowNumber,
          source_class: entry.sourceClass,
          school_code: entry.schoolCode,
        })],
      );
      inserted += 1;
      bySchool[entry.schoolCode] += 1;
    }
    await auditInTransaction(
      client, req.user!, 'bulk_import_physical_student_roster', 'physical_student_roster',
      sha256, 'Imported 104 physical student records from the approved Student_Class_List workbook.',
      auditContextFromRequest(req, { metadata: { count: inserted, bySchool, source: 'Student_Class_List.xlsx', sha256 } }),
    );
    return { inserted, bySchool };
  });
  return res.status(201).json({
    success: true,
    imported: result.inserted,
    schoolTotals: result.bySchool,
    message: 'Physical student records and active report-roster memberships imported atomically. No login or parent accounts were created.',
  });
});

export default router;
