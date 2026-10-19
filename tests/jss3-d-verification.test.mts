// D (French, Social Studies, Civic Education, Agricultural Science): delivery corrections and verified-fact guards.
//   node --import tsx --test tests/jss3-d-verification.test.mts
import assert from 'node:assert/strict';
import test from 'node:test';
import corrections from '../backend/src/db/data/jss3DeliveryCorrections.json' with { type: 'json' };
import lessons from '../backend/src/db/data/jss3Supplements.json' with { type: 'json' };
import { createDeliveryResolver, JSS3_WITHHELD_MARKER } from '../backend/src/utils/jss3DeliveryCorrection.js';

const C = (corrections as any[]).filter(c => c.package === 'D'); const L = lessons as any[];
const body = (id: string) => L.find(l => l.id === id)!.body as string;
const urls = (id: string) => (L.find(l => l.id === id)!.sources as any[]).map(s => s.url);

test('all 23 D delivery corrections are active in the resolver and fail closed on changed text', () => {
  assert.equal(C.length, 23);
  const r = createDeliveryResolver(corrections as any[], L);
  for (const c of C) {
    const t = { school_code: c.school_code, class_name: c.class_name, subject_name: c.subject_name, term_label: c.term_label, title: c.source_title, source_reference: `edited text for ${c.id}`, summary: null, generated_assessment_id: null };
    const w = r(t) as any;
    assert.equal(w?.kind, 'withheld', c.id);
    assert.ok(w.text.startsWith(JSS3_WITHHELD_MARKER), c.id);
    for (const id of c.replacement_lesson_ids) assert.ok(L.find(l => l.id === id), `${c.id} -> ${id}`);
  }
});

test('constitution amendment: the 2026 bill is a State Police bill sent 16 Sep 2026, and is not law', () => {
  for (const id of ['SUP-CIVIC-CONSTITUTION', 'SUP-CIVIC-SECURITY', 'SUP-CIVIC-FREE-FAIR']) {
    assert.doesNotMatch(body(id), /covering many areas|bill covering electoral reform|bill covering policing/, id);
    assert.match(body(id), /16 September 2026/, id);
    assert.match(body(id), /State Police/, id);
  }
  assert.match(body('SUP-CIVIC-CONSTITUTION'), /bill is not a law|not part of the Constitution unless/);
  assert.match(body('SUP-CIVIC-CONSTITUTION'), /24 state Houses of Assembly/);
  assert.match(body('SUP-CIVIC-CONSTITUTION'), /four-fifths/);
});

test('NDLEA 1989, NDE Act 1989, FCT area councils, Green Revolution 14 April 1980, GDP rebasing base year 2019', () => {
  assert.match(body('SUP-CIVIC-SECURITY'), /Decree No\. 48 of 1989/);
  assert.match(body('SUP-CIVIC-SECURITY'), /began operations in 1990/);
  assert.match(body('SUP-CIVIC-SELF-EMPLOYMENT'), /1989 No\. 24/);
  assert.match(body('SUP-CIVIC-FREE-FAIR'), /only part of Nigeria where INEC conducts local government elections/);
  assert.match(body('SUP-SS-AGRIC-ECONOMY'), /14 April 1980/);
  assert.match(body('SUP-SS-AGRIC-ECONOMY'), /May 1976/);
  assert.match(body('SUP-SS-AGRIC-ECONOMY'), /base year 2019/);
  assert.match(body('SUP-SS-NATURE-ECONOMY'), /base year 2019/);
  assert.ok(urls('SUP-CIVIC-SECURITY').some(u => /ndlea\.gov\.ng/.test(u)));
  assert.ok(urls('SUP-CIVIC-SELF-EMPLOYMENT').some(u => /placng\.org/.test(u)));
});

test('French answer keys: corrected forms', () => {
  assert.match(body('SUP-FR-PRESENT'), /partent; nous nous levons; commençons/);
  assert.doesNotMatch(body('SUP-FR-PRESENT'), /nous levons \(/);
  assert.match(body('SUP-FR-JOURNEE-DUREE'), /le douze juin, la fête de la démocratie/);
  assert.match(body('SUP-FR-JOURNEE-DUREE'), /novembre the onzième and décembre the douzième/);
  assert.match(body('SUP-FR-ACCORD'), /1 \(6 marks\): grande, bonne, vieille, belle, heureuse, grosse\./);
  assert.match(body('SUP-FR-DECRIRE-PERSONNE'), /le menton \(the chin\)/);
});
