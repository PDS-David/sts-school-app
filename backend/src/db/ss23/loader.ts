import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema, type Ss23Package } from './subjectPackageSchema.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

// SS2 instructional packages live at subjects/<slug>.json.
// SS3 exam-preparation packages live at subjects/ss3/<slug>.json.
export const registeredSs23Subjects = ['agricultural-science', 'biology', 'chemistry', 'mathematics', 'physics'] as const;
export const registeredSs23ExamSubjects = ['agricultural-science', 'biology'] as const;
export type RegisteredSs23Subject = typeof registeredSs23Subjects[number];

export function loadSs23Packages(
  directory = path.join(moduleDir, 'subjects'),
  subjectSlug?: string,
): Ss23Package[] {
  if (subjectSlug &&
      !registeredSs23Subjects.includes(subjectSlug as RegisteredSs23Subject) &&
      !registeredSs23ExamSubjects.includes(subjectSlug as typeof registeredSs23ExamSubjects[number])) {
    throw new Error(`SS23 unregistered subject package requested: ${subjectSlug}`);
  }

  const rootFiles = existsSync(directory)
    ? readdirSync(directory).filter(file => file.endsWith('.json')).sort()
    : [];
  const examDirectory = path.join(directory, 'ss3');
  const examFiles = existsSync(examDirectory)
    ? readdirSync(examDirectory).filter(file => file.endsWith('.json')).sort()
    : [];

  for (const file of rootFiles) {
    const slug = file.slice(0, -5);
    if (!registeredSs23Subjects.includes(slug as RegisteredSs23Subject)) {
      throw new Error(`SS23 unregistered package file: ${file}`);
    }
  }
  for (const file of examFiles) {
    const slug = file.slice(0, -5);
    if (!registeredSs23ExamSubjects.includes(slug as typeof registeredSs23ExamSubjects[number])) {
      throw new Error(`SS23 unregistered SS3 package file: ${file}`);
    }
  }

  const entries = [
    ...rootFiles.map(file => ({ file, fullPath: path.join(directory, file), expectedClass: 'SS 2' as const })),
    ...examFiles.map(file => ({ file, fullPath: path.join(examDirectory, file), expectedClass: 'SS 3' as const })),
  ].filter(entry => !subjectSlug || entry.file === `${subjectSlug}.json`);

  if (subjectSlug && entries.length === 0) {
    throw new Error(`SS23 subject-only package not found: ${subjectSlug}`);
  }

  const packages = entries.map(entry => {
    const pkg = packageSchema.parse(JSON.parse(readFileSync(entry.fullPath, 'utf8')));
    if (`${pkg.subject_slug}.json` !== entry.file) {
      throw new Error(`SS23 package filename/slug mismatch: ${entry.file}`);
    }
    if (pkg.class_name !== entry.expectedClass) {
      throw new Error(`SS23 package class/directory mismatch: ${entry.file}`);
    }
    if (entry.expectedClass === 'SS 2' && pkg.delivery_mode !== 'INSTRUCTIONAL') {
      throw new Error(`SS2 package must use instructional delivery mode: ${entry.file}`);
    }
    if (entry.expectedClass === 'SS 3' && pkg.delivery_mode !== 'EXAM_PREPARATION') {
      throw new Error(`SS3 package must use exam-preparation delivery mode: ${entry.file}`);
    }
    return pkg;
  });

  const keys = packages.map(pkg => `${pkg.class_name}/${pkg.subject_slug}`);
  if (new Set(keys).size !== packages.length) {
    throw new Error('SS23 duplicate class/subject package');
  }
  return packages;
}
