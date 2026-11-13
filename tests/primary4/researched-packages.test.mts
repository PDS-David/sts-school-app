import test from 'node:test';
import assert from 'node:assert/strict';
import homeEconomics12 from '../../backend/src/db/primary4/researched/homeEconomicsTerms1And2.json' with { type: 'json' };
import homeEconomics3 from '../../backend/src/db/primary4/researched/homeEconomicsTerm3Supplements.json' with { type: 'json' };
import basicScience3 from '../../backend/src/db/primary4/researched/basicScienceTerm3.json' with { type: 'json' };
import basicTechnology12 from '../../backend/src/db/primary4/researched/basicTechnologyTerms1And2.json' with { type: 'json' };
import { getPrimary4SupplementRecords } from '../../backend/src/db/primary4/primary4Supplements.ts';

const packages = [homeEconomics12, homeEconomics3, basicScience3, basicTechnology12];

test('all researched Primary 4 gap packages have owner approval, pedagogical verification and assessment rebuild verification', () => {
  for (const pkg of packages as any[]) {
    assert.equal(pkg.provenance.content_approval, 'APPROVED', pkg.package_id);
    assert.equal(pkg.provenance.pedagogical_verification, 'VERIFIED', pkg.package_id);
    assert.equal(pkg.provenance.assessment_rebuild_status, 'VERIFIED', pkg.package_id);
    assert.ok(pkg.provenance.scheme_basis || pkg.provenance.curriculum_basis, pkg.package_id);
    assert.ok(pkg.provenance.scheme_url || pkg.provenance.source_url, pkg.package_id);
    for (const lesson of pkg.lessons) {
      assert.ok(lesson.objectives.length >= 2, lesson.id);
      assert.ok(lesson.lesson.length >= 350, lesson.id);
      assert.ok(lesson.examples.length >= 2, lesson.id);
      assert.ok(lesson.activity.length >= 20, lesson.id);
      assert.ok(lesson.evaluation.length >= 3, lesson.id);
    }
  }
});

test('all five previously source-missing combinations now have approved lesson records', () => {
  const records = getPrimary4SupplementRecords();
  const count = (subject: string, term: string) => records.filter(row => row.subject_name === subject && row.term_label === term).length;
  assert.equal(count('Home Economics', '1st Term'), 9);
  assert.equal(count('Home Economics', '2nd Term'), 9);
  assert.equal(count('Basic Science', '3rd Term'), 5);
  assert.equal(count('Basic Technology', '1st Term'), 4);
  assert.equal(count('Basic Technology', '2nd Term'), 4);
  assert.equal(records.length, 38);
  assert.ok(records.every(row => row.source_reference.includes('Content approval: APPROVED')));
  assert.ok(records.every(row => row.source_reference.includes('Pedagogical verification: VERIFIED')));
  assert.ok(records.every(row => row.source_reference.includes('Assessment rebuild: VERIFIED')));
});

test('NERDC term placements not specified by the curriculum are explicitly labelled as owner-approved local allocations', () => {
  assert.equal(basicScience3.provenance.term_allocation, 'OWNER_APPROVED_LOCAL_ALLOCATION');
  assert.equal(basicTechnology12.provenance.term_allocation, 'OWNER_APPROVED_LOCAL_ALLOCATION');
  assert.match(basicScience3.provenance.source_note, /NERDC does not prescribe term placement/i);
  assert.match(basicTechnology12.provenance.source_note, /not an official NERDC or Lagos State term allocation/i);
});
