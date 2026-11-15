import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema, type Ss23Package } from './subjectPackageSchema.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

// Add a subject here only after its source map and package task have been registered.
export const registeredSs23Subjects = ['agricultural-science'] as const;
export type RegisteredSs23Subject = typeof registeredSs23Subjects[number];

export function loadSs23Packages(
  directory = path.join(moduleDir, 'subjects'),
  subjectSlug?: string,
): Ss23Package[] {
  if (subjectSlug && !registeredSs23Subjects.includes(subjectSlug as RegisteredSs23Subject)) {
    throw new Error(`SS23 unregistered subject package requested: ${subjectSlug}`);
  }

  const allFiles = existsSync(directory)
    ? readdirSync(directory).filter(file => file.endsWith('.json')).sort()
    : [];

  for (const file of allFiles) {
    const slug = file.slice(0, -5);
    if (!registeredSs23Subjects.includes(slug as RegisteredSs23Subject)) {
      throw new Error(`SS23 unregistered package file: ${file}`);
    }
  }

  const files = subjectSlug ? allFiles.filter(file => file === `${subjectSlug}.json`) : allFiles;
  if (subjectSlug && files.length !== 1) {
    throw new Error(`SS23 subject-only package not found: ${subjectSlug}`);
  }

  const packages = files.map(file => {
    const pkg = packageSchema.parse(JSON.parse(readFileSync(path.join(directory, file), 'utf8')));
    if (`${pkg.subject_slug}.json` !== file) {
      throw new Error(`SS23 package filename/slug mismatch: ${file}`);
    }
    return pkg;
  });

  if (new Set(packages.map(pkg => pkg.subject_slug)).size !== packages.length) {
    throw new Error('SS23 duplicate subject package slug');
  }
  return packages;
}
