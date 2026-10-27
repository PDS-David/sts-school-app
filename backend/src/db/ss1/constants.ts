/**
 * SS1 ingestion foundation — frozen constants (contract `ss1-subject-v1`).
 * Pure data: no I/O, no DB, safe to import anywhere.
 *
 * Policy (owner, 26 Oct 2026): SS1 has instructional First, Second AND Third Terms.
 * JSS3's Third-Term instruction ban and Computer Studies exclusion DO NOT apply here.
 * Senior substantive teaching finishes by end of SS2; SS3 is exam preparation (not touched here).
 */

export const SS1_CONTRACT_VERSION = 'ss1-subject-v1' as const;
export const SS1_CLASS_NAME = 'SS 1' as const;
export const SS1_SCHOOL_CODE = 'secondary' as const;
export const SS1_TERMS = ['1st Term', '2nd Term', '3rd Term'] as const;
export type Ss1Term = (typeof SS1_TERMS)[number];

/** The ONE authoritative source archive (bytes are never committed). */
export const SS1_AUTHORITATIVE_ARCHIVE = {
  name: 'SSS 1-20260507T072431Z-3-001.zip',
  sha256: '024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e',
  libraryFileId: 'libfile_c7ec4e1ab0d88191b888fc536b2778f0',
  documentEntries: 61,
} as const;

/** Synthetic rows live under this pseudo-folder so they can never collide with a real source path. */
export const SS1_SUPPLEMENT_DIR = '__ss1_supplements__' as const;
export const SS1_SUPPLEMENT_MARKER = '[SS1 SUPPLEMENT]' as const;

export interface Ss1SubjectRegistration {
  slug: string;
  /** Canonical `subjects.name` used for DB rows (matches names the generic importer already produces). */
  canonicalSubject: string;
  /** Upper-case token used in lesson IDs: SUP-SS1-<idToken>-NNN. */
  idToken: string;
  /** Worker prompt that owns the package (02..07 => A..F). */
  worker: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  /**
   * Names the generic filename/header inference may produce for this subject that are NOT the canonical name.
   * Such a mismatch is only accepted when the package carries an explicit `explicit_source_alias` rule.
   * (e.g. the generic pattern maps "data process" to "Computer Studies": that is a filename inference, not proof.)
   */
  genericInferredNames: readonly string[];
}

/** Deterministic registry order (alphabetical by slug). Worker assignment mirrors SOURCE_ASSIGNMENTS.csv. */
export const SS1_SUBJECTS: readonly Ss1SubjectRegistration[] = [
  { slug: 'agricultural-science', canonicalSubject: 'Agricultural Science', idToken: 'AGRIC', worker: 'C', genericInferredNames: [] },
  { slug: 'biology', canonicalSubject: 'Biology', idToken: 'BIO', worker: 'C', genericInferredNames: [] },
  { slug: 'bookkeeping', canonicalSubject: 'Book Keeping', idToken: 'BOOKKEEP', worker: 'D', genericInferredNames: [] },
  { slug: 'catering-craft', canonicalSubject: 'Catering Craft Practices', idToken: 'CATERING', worker: 'F', genericInferredNames: [] },
  { slug: 'chemistry', canonicalSubject: 'Chemistry', idToken: 'CHEM', worker: 'C', genericInferredNames: [] },
  { slug: 'civic-education', canonicalSubject: 'Civic Education', idToken: 'CIVIC', worker: 'E', genericInferredNames: [] },
  { slug: 'commerce', canonicalSubject: 'Commerce', idToken: 'COMMERCE', worker: 'D', genericInferredNames: [] },
  { slug: 'data-processing', canonicalSubject: 'Data Processing', idToken: 'DATAPROC', worker: 'E', genericInferredNames: ['Computer Studies'] },
  { slug: 'economics', canonicalSubject: 'Economics', idToken: 'ECON', worker: 'D', genericInferredNames: [] },
  { slug: 'english', canonicalSubject: 'English Language', idToken: 'ENG', worker: 'A', genericInferredNames: [] },
  { slug: 'financial-accounting', canonicalSubject: 'Financial Accounting', idToken: 'FINACC', worker: 'D', genericInferredNames: [] },
  { slug: 'food-and-nutrition', canonicalSubject: 'Food & Nutrition', idToken: 'FOODNUT', worker: 'F', genericInferredNames: [] },
  { slug: 'french', canonicalSubject: 'French', idToken: 'FRENCH', worker: 'A', genericInferredNames: [] },
  { slug: 'further-mathematics', canonicalSubject: 'Further Mathematics', idToken: 'FMATHS', worker: 'B', genericInferredNames: [] },
  { slug: 'geography', canonicalSubject: 'Geography', idToken: 'GEO', worker: 'C', genericInferredNames: [] },
  { slug: 'government', canonicalSubject: 'Government', idToken: 'GOVT', worker: 'E', genericInferredNames: [] },
  { slug: 'literature', canonicalSubject: 'Literature-in-English', idToken: 'LIT', worker: 'A', genericInferredNames: [] },
  { slug: 'mathematics', canonicalSubject: 'Mathematics', idToken: 'MATHS', worker: 'B', genericInferredNames: [] },
  { slug: 'physics', canonicalSubject: 'Physics', idToken: 'PHYS', worker: 'B', genericInferredNames: [] },
  { slug: 'technical-drawing', canonicalSubject: 'Technical Drawing', idToken: 'TECHDRAW', worker: 'B', genericInferredNames: [] },
  { slug: 'yoruba', canonicalSubject: 'Yoruba', idToken: 'YORUBA', worker: 'A', genericInferredNames: [] },
];

export const ss1SubjectBySlug = (slug: string): Ss1SubjectRegistration | undefined =>
  SS1_SUBJECTS.find(s => s.slug === slug);

export const ss1SubjectByCanonical = (name: string): Ss1SubjectRegistration | undefined =>
  SS1_SUBJECTS.find(s => s.canonicalSubject === name);
