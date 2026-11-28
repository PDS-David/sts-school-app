import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { promotionClassOptions, resolveSelectedClass, studentsInClass } from '../../mobile/src/utils/promotionClasses.ts';

test('class options come from the class-teacher anchor plus extra grants, de-duplicated', () => {
  assert.deepEqual(promotionClassOptions({ assigned_class: 'Primary 2', assigned_class_names: [] }), ['Primary 2']);
  assert.deepEqual(
    promotionClassOptions({ assigned_class: ' Primary 2 ', assigned_class_names: ['Primary 2', 'Primary 4', ''] }),
    ['Primary 2', 'Primary 4'],
  );
});

test('subject-only and unassigned teachers get no promotion classes', () => {
  assert.deepEqual(promotionClassOptions({ assigned_class: null, assigned_class_names: ['Primary 2'] }), []);
  assert.deepEqual(promotionClassOptions({ assigned_class: '  ', assigned_class_names: ['Primary 2'] }), []);
  assert.deepEqual(promotionClassOptions(null), []);
});

test('a single class is selected automatically; several require an explicit choice', () => {
  assert.equal(resolveSelectedClass(['Primary 2'], null), 'Primary 2');
  assert.equal(resolveSelectedClass(['Primary 2', 'Primary 4'], null), null);
  assert.equal(resolveSelectedClass(['Primary 2', 'Primary 4'], 'Primary 4'), 'Primary 4');
  assert.equal(resolveSelectedClass(['Primary 2', 'Primary 4'], 'Primary 3'), null, 'an unassigned class can never be selected');
});

test('only students of the selected class are listed', () => {
  const rows = [
    { id: 'a', class_name: 'Primary 2' },
    { id: 'b', class_name: 'Primary 4' },
    { id: 'c', class_name: 'Primary 2' },
  ];
  assert.deepEqual(studentsInClass(rows, 'Primary 2').map(r => r.id), ['a', 'c']);
  assert.deepEqual(studentsInClass(rows, 'Primary 4').map(r => r.id), ['b']);
  assert.deepEqual(studentsInClass(rows, null), []);
});

test('promotion screen wires the class selector to the roster request and every decision', () => {
  const screen = readFileSync('mobile/src/screens/PromoteStudentsScreen.tsx', 'utf8');
  assert.match(screen, /api\.get\('\/students', \{ params: \{ class_name: selectedClass \} \}\)/, 'roster is requested per selected class');
  assert.match(screen, /\{ action, expected_class_name: selectedClass \}/, 'each decision names the selected class');
  assert.match(screen, /Select a class/);
  const chooseClass = screen.slice(screen.indexOf('const chooseClass'), screen.indexOf('const fetchRoster'));
  for (const reset of ['setConfirm(null)', 'setInfo(null)', 'setStudents([])', 'setPickedClass(className)']) {
    assert.ok(chooseClass.includes(reset), `switching class must reset state via ${reset}`);
  }
  assert.ok(!/action: ['"](demote|reinstate)['"]/.test(screen), 'teacher screen never offers demotion or reinstatement');
});
