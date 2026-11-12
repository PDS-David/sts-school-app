import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { createSs1LiteratureDeliveryResolver } from '../../backend/src/utils/ss1LiteratureDelivery.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = packageSchema.parse(JSON.parse(readFileSync(path.resolve(here, '../../backend/src/db/ss1/subjects/literature.json'), 'utf8')));
const titles: Record<string, string[]> = {
  '1st Term': [
    'Introduction to the study of Literature-In-English','GENRE OF LITERATURE – PROSE, POETRY AND DRAMA',
    'FICTION AND NON-FICTION','ELEMENT OF PROSE','WHAT IS PROSE?','WHAT IS POETRY?',
    'DIFFERENT FORMS OF POETRY AND TYPES OF POETRY','WHAT IS DRAMA','ORAL TRADITION OF LITERATURE',
  ],
  '2nd Term': [
    'INTRODUCTION TO AFRICA DRAMA – HARVEST OF CORRUPTION','THE BLOOD OF A STRANGER','AFRICAN PEOTRY',
    'THE DINNING TABLE (GBANABOM HALLOWELL)','THE ANVIL AND THE HAMMER',
    'NON – AFRICAN DRAMA – OTHELLO By Shakespare','SHE STOOPS TO CONQUER','NON-AFRICAN POETRY','THE SCHOOLBOY',
  ],
  '3rd Term': [
    'INTRODUCTION TO AFRICA DRAMA – HARVEST OF CORRUPTION','THE BLOOD OF A STRANGER','AFRICAN PEOTRY',
    'THE DINNING TABLE (GBANABOM HALLOWELL)','THE ANVIL AND THE HAMMER',
    'NON – AFRICAN DRAMA – OTHELLO By Shakespare','SHE STOOPS TO CONQUER','NON-AFRICAN POETRY','THE SCHOOLBOY',
  ],
};

test('all 27 Literature lessons resolve from their exact term, source file and topic heading', () => {
  const resolve = createSs1LiteratureDeliveryResolver(pkg);
  for (const source of pkg.sources) {
    for (const [index, title] of titles[source.term].entries()) {
      const topic = {
        id: index + 1, school_code: 'secondary', class_name: 'SS 1',
        subject_name: 'Literature-in-English', term_label: source.term,
        source_file: path.basename(source.archive_member), title, source_reference: `WEEK ${index + 1}\\nTOPIC: ${title}\\nlesson body`,
      };
      const result = resolve(topic);
      assert(result, `${source.term}: ${title}`);
      assert.equal(result.kind, 'lesson');
      assert.equal(result.lessonId, pkg.lessons.find(l => l.term === source.term && l.id.endsWith(`W${String(index + 1).padStart(2,'0')}`))?.id);
      assert.match(result.text, /PRACTICE QUESTIONS AND MARKING GUIDE/);
      assert.match(result.text, /Answer:/);
    }
  }
});

test('Literature resolver does not cross subjects, terms or source files', () => {
  const resolve = createSs1LiteratureDeliveryResolver(pkg);
  const source = pkg.sources.find(s => s.term === '2nd Term')!;
  const base = {
    school_code: 'secondary', class_name: 'SS 1', subject_name: 'Literature-in-English',
    term_label: '2nd Term', source_file: path.basename(source.archive_member),
    title: titles['2nd Term'][0], source_reference: titles['2nd Term'][0],
  };
  assert.equal(resolve({ ...base, subject_name: 'English Language' }), null);
  assert.equal(resolve({ ...base, term_label: '3rd Term' }), null);
  assert.equal(resolve({ ...base, source_file: 'other.docx' }), null);
  assert.equal(resolve({ ...base, title: 'not a Literature source topic' }), null);
  assert.equal(resolve({ ...base, source_reference: 'unrelated source text' }), null);
});

test('Literature resolver refuses packages with unresolved coverage or blocking owner items', () => {
  const partial = structuredClone(pkg) as any;
  partial.coverage[0].status = 'PARTIAL';
  assert.throws(() => createSs1LiteratureDeliveryResolver(partial), /not approved for student delivery/);
  const blocked = structuredClone(pkg) as any;
  blocked.open_items.push({ id: 'test-blocker', kind: 'CONTENT', detail: 'block', required_action: 'resolve', affected_ids: ['x'], blocks_delivery: true });
  assert.throws(() => createSs1LiteratureDeliveryResolver(blocked), /not approved for student delivery/);
});
