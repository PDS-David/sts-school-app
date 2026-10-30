// Shared class-name helpers for DB scripts. The mapping used to live inside
// renameClassNaming.ts, which runs on import, so it could not be reused.

export const LEGACY_CLASS_MAPPING: Record<string, string> = {
  JSS1: 'JSS 1',
  JSS2: 'JSS 2',
  JSS3: 'JSS 3',
  SS1: 'SS 1',
  SS2: 'SS 2',
  SS3: 'SS 3',
  'Grade 1': 'Primary 1',
  'Grade 2': 'Primary 2',
  'Grade 3': 'Primary 3',
  'Grade 4': 'Primary 4',
  'Grade 5': 'Primary 5',
  'Grade 6': 'Primary 6',
  'PRY 1': 'Primary 1',
  'PRY 2': 'Primary 2',
  'PRY 3': 'Primary 3',
  'PRY 4': 'Primary 4',
  'PRY 5': 'Primary 5',
  'PRY 6': 'Primary 6',
};

/**
 * Turn a class name from an old source (report card, import file) into the name
 * this school's `classes` table actually uses: the raw name if the school has it,
 * else its canonical rename if the school has that, else null (do not guess).
 */
export function resolveClassName(raw: string, schoolClassNames: ReadonlySet<string>): string | null {
  const name = raw.trim();
  if (schoolClassNames.has(name)) return name;
  const mapped = LEGACY_CLASS_MAPPING[name];
  return mapped && schoolClassNames.has(mapped) ? mapped : null;
}
