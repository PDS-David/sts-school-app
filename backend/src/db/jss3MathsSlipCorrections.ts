/**
 * JSS3 Mathematics — occurrence-specific corrections of arithmetic slips in the school's own notes (OB-18).
 *
 * Same rules as jss3EnglishSymbolCorrections.ts: no global replacement; every entry is an exact `before`
 * context that must match EXACTLY ONCE in the recovered text of its source (zero or several matches throw;
 * the only tolerated zero-match case is the exact `after` already being present once, so re-application is
 * idempotent). The original .docx is never modified; the exact original text of each change is kept here.
 *
 * Authorisation: the owner confirmed on 2026-10-17 that the original Mathematics rows may change. Each entry
 * states the evidence for the correction. An entry marked INFERRED rests on the school's own other working in the
 * same note (not on an outside source) and is listed so a teacher can overrule it.
 * Entries that cannot be settled from the note itself are in JSS3_MATHS_OPEN_SLIPS and are NOT changed.
 */
export interface MathsSlip {
  id: string;
  /** Folder of the source: '1st Term' or '2nd Term'. */
  term: '1st Term' | '2nd Term';
  before: string;
  after: string;
  kind: 'COMPUTED' | 'INFERRED';
  evidence: string;
}

export const JSS3_MATHS_SLIP_CORRECTIONS: readonly MathsSlip[] = [
  { id: 'M1-BIN-P16', term: '1st Term', before: 'P \t\t\t16 \t\t\t1000\n', after: 'P \t\t\t16 \t\t\t10000\n', kind: 'COMPUTED',
    evidence: '16 = 10000 in base two (1×2⁴); the next rows Q 17 = 10001 and R 18 = 10010 only fit 10000' },
  { id: 'M1-BIN-111', term: '1st Term', before: '= 4 + 2 + 1\n\n= 910', after: '= 4 + 2 + 1\n\n= 710', kind: 'COMPUTED',
    evidence: '4 + 2 + 1 = 7, not 9' },
  { id: 'M1-MARKS-LIST', term: '1st Term', before: '5, 7, 4, 8, 5, 7, 10, 9, 3.  Find', after: '5, 7, 4, 8, 5, 7, 10, 9, 6, 3.  Find', kind: 'INFERRED',
    evidence: 'the example names 10 pupils but lists nine marks; the school\'s own working adds (5+7+4+8+5+7+10+9+6+3) = 64, so the missing mark is 6' },
  { id: 'M1-MARKS-SORTED', term: '1st Term', before: 'ascending order of magnitude 3, 4, 5, 5, 6, 7, 8, 9, 10\n', after: 'ascending order of magnitude 3, 4, 5, 5, 6, 7, 7, 8, 9, 10\n', kind: 'INFERRED',
    evidence: 'the ten marks sorted; the school\'s own median (6+7)/2 and its modes 5 and 7 need two 7s' },
  { id: 'M1-FREQ-TABLE', term: '1st Term',
    before: '3\t\t4\n\n5\t\t1\n\n6\t\t7\n\n7\t\t3\n', after: '3\t\t1\n\n4\t\t3\n\n5\t\t1\n\n6\t\t2\n\n7\t\t3\n', kind: 'INFERRED',
    evidence: 'the first table totals 25 pupils; the school\'s own ALTERNATIVELY table and its sum 0+0+1+2+2+3+4+4+5+6+6+7+7+7+8+8+8+8+9 give 3 → 1, 4 → 3, 6 → 2 (20 pupils)' },
  { id: 'M1-FX-3', term: '1st Term', before: '1x 3 = 9', after: '1x 3 = 3', kind: 'COMPUTED', evidence: '1 × 3 = 3; the table total fx = 99 only fits 3' },
  { id: 'M1-FX-9', term: '1st Term', before: '1 x 9 = 99', after: '1 x 9 = 9', kind: 'COMPUTED', evidence: '1 × 9 = 9; the column 0+1+4+3+12+5+12+21+32+9 = 99' },
  { id: 'M1-MEAN-47', term: '1st Term', before: '+88)/8\n\nMean = 48', after: '+88)/8\n\nMean = 47', kind: 'COMPUTED',
    evidence: '42+44+50+40+54+48+10+88 = 376 and 376 ÷ 8 = 47' },
  { id: 'M1-GRAPH-PAIR', term: '1st Term', before: '(b) 2x-y=10 and 4x-2y=4r', after: '(b) 2x+y=10 and 4x-2y=4', kind: 'INFERRED',
    evidence: 'the school\'s own table for (b) uses y=10-2x (that is 2x+y=10) and y=-2+2x (4x-2y=4), its answer is (2, 0), and its exercise writes 2x+y=10, 4x-2y=4; 2x-y=10 and 4x-2y=4 are parallel lines with no solution; the stray "r" is dropped' },
  { id: 'M1-WORD-X', term: '1st Term', before: 'x-22.5', after: 'x=22.5', kind: 'COMPUTED', evidence: '30 - 7.5 = 22.5; a minus sign was typed for equals' },
  { id: 'M1-WORD-BOX', term: '1st Term', before: '3x=840\n\n\tx=260', after: '3x=840\n\n\tx=280', kind: 'COMPUTED', evidence: '840 ÷ 3 = 280; check 3(280)+2(200) = 1240 and 5(280)+7(200) = 2800' },
  { id: 'M1-CYL-H', term: '1st Term', before: 'h = 2m\n', after: 'h = 2cm\n', kind: 'INFERRED', evidence: 'the radius and area in this exercise are in centimetres, so the height is in centimetres' },
  { id: 'M2-SIN-4665', term: '2nd Term', before: 'Sin 46.65o  = 0.7266', after: 'Sin 46.65o  = 0.7272', kind: 'COMPUTED', evidence: 'sin 46.65° = 0.72722 to 4 d.p.; four-figure tables give sin 46.6° = 0.7266 and add the mean difference for 0.05°' },
  { id: 'M2-DEPRESSION', term: '2nd Term', before: 'depression of an object at sea is 350o.', after: 'depression of an object at sea is 35o.', kind: 'INFERRED', evidence: '350° cannot be an angle of depression (it must be acute); 35° is the likely intended value' },
];

/** Slips found but NOT changed because the note itself cannot settle them. */
export const JSS3_MATHS_OPEN_SLIPS: readonly { id: string; term: string; note: string }[] = [
  { id: 'M1-T-FORMULA', term: '1st Term', note: 'assignment formula is typed "T = 2 π√m/k": the root sign is plain text, so it cannot be told whether the root covers m or m/k' },
  { id: 'M1-BIN-LABELS', term: '1st Term', note: 'the add and subtract answers in the binary worked solutions appear with their labels swapped (101111−10011 = 11100 is shown under 1., 101111+10011 = 1000010 under 2.); the layout cannot be safely edited' },
];

export function applyJss3MathsSlipCorrections(term: '1st Term' | '2nd Term', text: string): string {
  let out = text;
  for (const c of JSS3_MATHS_SLIP_CORRECTIONS) {
    if (c.term !== term) continue;
    const count = out.split(c.before).length - 1;
    if (count === 1) { out = out.replace(c.before, () => c.after); continue; }
    if (count === 0 && out.split(c.after).length - 1 >= 1) continue; // already applied
    throw new Error(`JSS3 Maths correction ${c.id}: expected exactly one match, found ${count}`);
  }
  return out;
}
