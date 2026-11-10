import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema } from './subjectPackageSchema.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const subjectsDir = path.join(here, 'subjects');

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

async function main() {
  const files = (await readdir(subjectsDir, { withFileTypes: true }))
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => entry.name)
    .sort();

  assert(files.length > 0, `No subject package JSON files found in ${subjectsDir}`);

  const summaries: Array<Record<string, unknown>> = [];
  const failures: string[] = [];

  for (const file of files) {
    const fullPath = path.join(subjectsDir, file);
    const raw = JSON.parse(await readFile(fullPath, 'utf8')) as unknown;
    const subject = packageSchema.parse(raw);
    const lessonIds = subject.lessons.map(lesson => lesson.id);
    const ruleIds = subject.source_rules.map(rule => rule.id);

    assert(new Set(lessonIds).size === lessonIds.length, `${file}: duplicate lesson IDs`);
    assert(new Set(ruleIds).size === ruleIds.length, `${file}: duplicate source-rule IDs`);

    for (const lesson of subject.lessons) {
      assert(lesson.body_sha256 === sha256(lesson.body), `${file}: body hash mismatch for ${lesson.id}`);
      assert(lesson.practice.length > 0, `${file}: no practice questions in ${lesson.id}`);
      const practiceIds = lesson.practice.map(question => question.id);
      assert(new Set(practiceIds).size === practiceIds.length, `${file}: duplicate practice IDs in ${lesson.id}`);
      for (const question of lesson.practice) {
        const markingTotal = question.marking.reduce((total, criterion) => total + criterion.marks, 0);
        assert(question.marks === markingTotal, `${file}: marking total mismatch in ${lesson.id}/${question.id}`);
      }
    }

    for (const coverage of subject.coverage) {
      for (const lessonId of coverage.lesson_ids) {
        const lessonExists = lessonIds.includes(lessonId);
        const markerExists = coverage.status === 'MARKER' && ruleIds.includes(lessonId);
        assert(lessonExists || markerExists, `${file}: unresolved coverage target ${coverage.id} -> ${lessonId}`);
      }
      if (coverage.status === 'IMPLEMENTED_EQUIVALENT') {
        assert(coverage.lesson_ids.some(id => lessonIds.includes(id)), `${file}: equivalent coverage has no supplement: ${coverage.id}`);
      }
    }

    const blockedItems = subject.open_items.filter(item => item.blocks_delivery);
    const unapprovedLessons = subject.lessons.filter(lesson =>
      lesson.state.content_approval !== 'APPROVED' ||
      !lesson.state.approval_reference ||
      lesson.state.verification !== 'VERIFIED' ||
      !lesson.state.verification_reference ||
      lesson.provenance.some(source => source.reuse_status !== 'PERMITTED')
    );

    summaries.push({
      file,
      subject: subject.canonical_subject,
      packageStatus: subject.package_status,
      lessons: subject.lessons.length,
      coverage: subject.coverage.length,
      blockedOpenItems: blockedItems.length,
      unapprovedOrUnverifiedLessons: unapprovedLessons.length
    });
  }

  process.stdout.write(`${JSON.stringify({ valid: true, packages: summaries }, null, 2)}\\n`);
  if (failures.length) {
    process.stderr.write(failures.join('\\n') + '\\n');
    process.exitCode = 1;
  }
}

main().catch(error => {
  process.stderr.write(`SS1 package validation failed: ${error instanceof Error ? error.message : String(error)}\\n`);
  process.exitCode = 1;
});
