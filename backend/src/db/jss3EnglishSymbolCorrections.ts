/**
 * JSS3 First-Term English (`js 3 english.doc`) — occurrence-specific phonetic-symbol corrections (Task 3).
 *
 * Rules:
 *  - NO global character replacement. Every APPLIED entry is keyed by an exact `before` context string
 *    (the symbol plus enough surrounding source text to be unique) and an exact `after` string.
 *  - A `before` context must match EXACTLY ONCE. Zero or several matches throw (the importer records the
 *    throw as a file read error, which blocks the audit). The only tolerated zero-match case is when the
 *    exact `after` string is already present exactly once (idempotent re-application).
 *  - Only entries whose evidence comes from the ORIGINAL source file are APPLIED. Everything else is HELD or
 *    OPEN: it is NOT changed here; its `before` context must still be present, unchanged, exactly once.
 *  - Provenance: the exact original ("before") text of every change is kept in this table, and the original
 *    `.doc` is never modified. Nothing is added to lesson text, and no schema/UI change is made.
 *
 * Scope: this module receives the First-Term English lesson BODY only (text from "WEEK ONE (1)" onward).
 * The scheme-of-work lines for Weeks 2 and 4–9 sit before that marker and are discarded by the existing English
 * rule, so they never reach an importer row; they are recorded in SCHEME_ONLY_OCCURRENCES for the register only.
 *
 * Evidence tiers (all from the original .doc, per R10/R11):
 *  DIRECT   — the same document names the sound/uses the IPA character elsewhere (schwa lesson: "schwa" x3,
 *             IPA U+0259 at three transcriptions).
 *  EXAMPLES — the symbol's own row lists example words that fix the sound (Week 7 consonant list), and the
 *             document already uses the real IPA character for θ and ʃ in transcriptions.
 */

export type SymbolStatus = 'APPLIED' | 'HELD' | 'OPEN';

export interface SymbolOccurrence {
  id: string;
  /** R9 gap id this occurrence belongs to ('none' when R9 has no defensible id). */
  r9: string;
  /** R10/R11 source locator (T1 paragraph number in the numbered R7A text). */
  locator: string;
  /** Exact source context; must occur exactly once in the lesson body. */
  before: string;
  /** Exact replacement for APPLIED entries; null for HELD/OPEN. */
  after: string | null;
  status: SymbolStatus;
  evidence: string;
}

const SCHWA = 'ə'; // ə
const CYR_SCHWA = 'Ә'; // Ә (look-alike)

const SCHWA_EVIDENCE =
  'DIRECT: lesson defines the sound as the neutral vowel and calls it schwa (L0686-0688); document already uses IPA ə U+0259 at L0746/L0747/L0749; U+04D8 is a Cyrillic letter';

export const JSS3_ENGLISH_SYMBOL_OCCURRENCES: readonly SymbolOccurrence[] = [
  // ── Week 2 schwa lesson: Cyrillic Ә (U+04D8) -> IPA ə (U+0259), five separate occurrences ──────────────
  {
    id: 'P-W2L-1', r9: 'EN1-12', locator: 'T1 L0685', status: 'APPLIED',
    before: `SPEECH WORK: VOWEL /${CYR_SCHWA}/\nCONTENT:-`,
    after: `SPEECH WORK: VOWEL /${SCHWA}/\nCONTENT:-`,
    evidence: SCHWA_EVIDENCE,
  },
  {
    id: 'P-W2L-2', r9: 'EN1-12', locator: 'T1 L0688', status: 'APPLIED',
    before: `ᴐ:t${CYR_SCHWA}/ The vowel is a short version`,
    after: `ᴐ:t${SCHWA}/ The vowel is a short version`,
    evidence: SCHWA_EVIDENCE + '; only the final Ә of /wᴐ:tӘ/ is changed (ᴐ is held, see H-W2L-openo)',
  },
  {
    id: 'P-W2L-3', r9: 'EN1-12', locator: 'T1 L0689', status: 'APPLIED',
    before: `common spelling of /${CYR_SCHWA}/ sound`,
    after: `common spelling of /${SCHWA}/ sound`,
    evidence: SCHWA_EVIDENCE,
  },
  {
    id: 'P-W2L-4', r9: 'EN1-12', locator: 'T1 L0691', status: 'APPLIED',
    before: `identify the vowel /${CYR_SCHWA}/ (i) manner`,
    after: `identify the vowel /${SCHWA}/ (i) manner`,
    evidence: SCHWA_EVIDENCE,
  },
  {
    id: 'P-W2L-5', r9: 'EN1-12', locator: 'T1 L0692', status: 'APPLIED',
    before: `identify the vowel /${CYR_SCHWA}/ (i) backward`,
    after: `identify the vowel /${SCHWA}/ (i) backward`,
    evidence: SCHWA_EVIDENCE,
  },

  // ── Week 7 consonant list (lesson body of plan row #15): look-alikes -> IPA, row examples fix the sound ─
  {
    id: 'P-L7-theta', r9: 'EN1-17', locator: 'T1 L1092', status: 'APPLIED',
    before: '/0/    as in anthem, think, both.',
    after: '/θ/    as in anthem, think, both.',
    evidence: 'EXAMPLES: anthem, think, both; document uses IPA θ in [θərˈməˌmitɚ] thermometer (L0749)',
  },
  {
    id: 'P-L7-eth', r9: 'none', locator: 'T1 L1093', status: 'APPLIED',
    before: '/∂ /     as in this, father, breathes.',
    after: '/ð/     as in this, father, breathes.',
    evidence: 'EXAMPLES: this, father, breathes (voiced th); U+2202 PARTIAL DIFFERENTIAL and the inner space before the closing slash are replaced',
  },
  {
    id: 'P-L7-esh', r9: 'none', locator: 'T1 L1096', status: 'APPLIED',
    before: '/S/    as in ship, lashes, fish.',
    after: '/ʃ/    as in ship, lashes, fish.',
    evidence: 'EXAMPLES: ship, lashes, fish; document uses IPA ʃ in [ˈmʌʃˌrum] mushroom (L0748)',
  },
  {
    id: 'P-L7-ezh', r9: 'EN1-13', locator: 'T1 L1097', status: 'APPLIED',
    before: '//   as in genre, vision, garage.',
    after: '/ʒ/   as in genre, vision, garage.',
    evidence: 'EXAMPLES: genre, vision, garage; stored as invisible private-use U+F053 (glyph the author saw cannot be established from the file); sound fixed by the row examples',
  },
  {
    id: 'P-L7-tesh', r9: 'none', locator: 'T1 L1099', status: 'APPLIED',
    before: '/tS/     as in cheap, richer, teach.',
    after: '/tʃ/     as in cheap, richer, teach.',
    evidence: 'EXAMPLES: cheap, richer, teach',
  },
  {
    id: 'P-L7-dezh', r9: 'EN1-13', locator: 'T1 L1100', status: 'APPLIED',
    before: '/d/ as in  joy, rejoice, page.',
    after: '/dʒ/ as in  joy, rejoice, page.',
    evidence: 'EXAMPLES: joy, rejoice, page; stored as d + invisible private-use U+F053',
  },
  {
    id: 'P-L7-eng', r9: 'none', locator: 'T1 L1107', status: 'APPLIED',
    before: '/J/  as in singer, bang, ______',
    after: '/ŋ/  as in singer, bang, ______',
    evidence: 'EXAMPLES: singer, bang; the blank third example slot is left untouched (H-L7-blank-eng)',
  },

  // ── HELD / OPEN in the lesson body: present, unchanged, must still match exactly once ─────────────────
  {
    id: 'H-W2L-openo', r9: 'none', locator: 'T1 L0688', status: 'HELD', after: null,
    before: '/wᴐ:t',
    evidence: 'HELD: U+1D10 (sideways open o) -> ɔ is Medium-high only (glyph + example "water"); the 2nd-Term file uses the same character and is out of scope; owner/teacher to confirm',
  },
  {
    id: 'H-W2L-6', r9: 'EN1-12', locator: 'T1 L0688', status: 'HELD', after: null,
    before: 'version of the /ӡ:/ sound',
    evidence: 'HELD: /ӡ:/ (U+04E1) candidate ɜː needs the school vowel chart (TQ6); no decision supplied',
  },
  {
    id: 'H-W2L-dup', r9: 'EN1-12', locator: 'T1 L0685', status: 'HELD', after: null,
    before: 'Speech Work: SPEECH WORK: VOWEL',
    evidence: 'HELD: duplicated label is a wording fix, not a phonetic symbol; outside Task 3 scope',
  },
  {
    id: 'H-W2L-7', r9: 'EN1-12', locator: 'T1 L0692', status: 'OPEN', after: null,
    before: '(v) potato (vii) captor',
    evidence: 'OPEN: item (vi) missing or (vii) mis-numbered; original assignment must be inspected (TQ8)',
  },
  {
    id: 'H-L7-blank-r', r9: 'none', locator: 'T1 L1102', status: 'OPEN', after: null,
    before: '/r/    as in rag, borrow,______',
    evidence: 'OPEN: blank example slot; words not in the source (TQ7); editorial words not applied',
  },
  {
    id: 'H-L7-blank-w', r9: 'EN1-17', locator: 'T1 L1103', status: 'OPEN', after: null,
    before: '/w/   as in win, rewind,______',
    evidence: 'OPEN: blank example slot; words not in the source (TQ7); editorial words not applied',
  },
  {
    id: 'H-L7-blank-j', r9: 'EN1-17', locator: 'T1 L1104', status: 'OPEN', after: null,
    before: '/j/     as in yes, _______.',
    evidence: 'OPEN: blank example slot; words not in the source (TQ7); editorial words not applied',
  },
];

/**
 * Scheme-of-work occurrences (T1 L0010-L0051). They precede "WEEK ONE (1)", are dropped by the existing English
 * rule, and therefore never reach an importer row. Recorded for the register only; no text rule exists for them.
 */
export interface SchemeOnlyOccurrence { id: string; r9: string; locator: string; printed: string; status: SymbolStatus; note: string }
export const JSS3_ENGLISH_SCHEME_ONLY_OCCURRENCES: readonly SchemeOnlyOccurrence[] = [
  { id: 'P-S1-schwce', r9: 'EN1-12', locator: 'T1 L0010 (Wk2)', printed: 'The Schwce sound / /', status: 'HELD', note: 'Spelling Schwa and empty slot /ə/ are source-supported but are not imported; fix belongs in the source document' },
  { id: 'P-W4', r9: 'EN1-13', locator: 'T1 L0022 (Wk4)', printed: 'Consonant /3/ and /d3/', status: 'HELD', note: 'Provisional /ʒ/ and /dʒ/ only; confirmation against the original scheme still required' },
  { id: 'P-W5', r9: 'EN1-17', locator: 'T1 L0027 (Wk5)', printed: 'consonant sounds/d/,/0/,/z/', status: 'HELD', note: '/0/ -> θ is a candidate (support comes from Week 7); /d/ kept as printed, not changed to ð' },
  { id: 'P-W6', r9: 'EN1-11', locator: 'T1 L0033 (Wk6)', printed: 'Contrasting /3:/ and /c/', status: 'OPEN', note: 'Pair not identifiable; /ɜː/ plausible for /3:/ only' },
  { id: 'P-W7', r9: 'EN1-14', locator: 'T1 L0039 (Wk7)', printed: 'The consonant sound // and // (contrastion)', status: 'OPEN', note: 'Slashes empty in the source; cannot be recovered' },
  { id: 'P-W8', r9: 'EN1-15', locator: 'T1 L0045 (Wk8)', printed: 'SPEECH WORK: the consonant', status: 'OPEN', note: 'Heading truncated' },
  { id: 'P-W9', r9: 'EN1-17', locator: 'T1 L0051 (Wk9)', printed: 'The consonant sound /w/ and /j/', status: 'OPEN', note: 'Symbols are plain letters and need no change; only "SPEECH WORKS" wording noted' },
];

function occurrences(text: string, needle: string): number {
  let n = 0;
  for (let i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + needle.length)) n++;
  return n;
}

/**
 * Apply the APPLIED entries to the First-Term English lesson body. Idempotent; throws on any anchor that is
 * missing or ambiguous; leaves every HELD/OPEN occurrence untouched (and verifies it is still there).
 */
export function applyJss3EnglishSymbolCorrections(body: string): string {
  let out = body;
  for (const occ of JSS3_ENGLISH_SYMBOL_OCCURRENCES) {
    const before = occurrences(out, occ.before);
    if (occ.status !== 'APPLIED') {
      if (before !== 1) throw new Error(`JSS3 English symbol occurrence ${occ.id} (${occ.status}): expected exactly one match, found ${before}`);
      continue;
    }
    const after = occ.after as string;
    if (before === 1) {
      const at = out.indexOf(occ.before);
      out = out.slice(0, at) + after + out.slice(at + occ.before.length);
    } else if (before === 0 && occurrences(out, after) === 1) {
      continue; // already applied: never double-apply
    } else {
      throw new Error(`JSS3 English symbol correction ${occ.id}: expected exactly one match of the original context, found ${before}`);
    }
  }
  return out;
}

const cp = (s: string) => [...s].map(c => 'U+' + (c.codePointAt(0) as number).toString(16).toUpperCase().padStart(4, '0')).join(' ');

/** Audit rows (original and corrected text with code points) for the register and the report script. */
export function describeJss3EnglishSymbolCorrections(): Array<{ id: string; r9: string; locator: string; status: SymbolStatus; before: string; after: string; beforeCodepoints: string; afterCodepoints: string; evidence: string }> {
  return JSS3_ENGLISH_SYMBOL_OCCURRENCES.map(o => ({
    id: o.id, r9: o.r9, locator: o.locator, status: o.status,
    before: o.before, after: o.after ?? o.before,
    beforeCodepoints: cp(o.before), afterCodepoints: cp(o.after ?? o.before),
    evidence: o.evidence,
  }));
}
