import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('message notification destinations match role navigation', () => {
  const adminTabs = read('mobile/src/navigation/AdminTabs.tsx');
  const parentTabs = read('mobile/src/navigation/ParentTabs.tsx');
  const studentTabs = read('mobile/src/navigation/StudentTabs.tsx');
  const teacherTabs = read('mobile/src/navigation/TeacherTabs.tsx');
  const financeTabs = read('mobile/src/navigation/FinanceAdminTabs.tsx');
  const navigationRef = read('mobile/src/navigation/navigationRef.ts');
  const notifications = read('mobile/src/components/NotificationsContext.tsx');
  assert.ok(adminTabs.includes('ChatsStack.Screen name="Messages"'));
  for (const tabs of [parentTabs, studentTabs]) {
    assert.ok(tabs.includes('ChatsStack.Screen name="ChatThread"'));
  }
  assert.ok(!teacherTabs.includes('ChatThread'));
  assert.ok(!financeTabs.includes('Screen name="Messages"'));
  assert.ok(!financeTabs.includes('Screen name="ChatThread"'));
  assert.ok(notifications.includes("if (user.role !== 'finance_admin' && user.role !== 'teacher')"));
  assert.ok(notifications.includes("screen: user.role === 'admin' ? 'Messages' : 'ChatThread'"));
  assert.ok(navigationRef.includes('navigationRef.navigate(screen, { contact })'));
});

test('assessment and results notification targets are registered', () => {
  const studentTabs = read('mobile/src/navigation/StudentTabs.tsx');
  const parentTabs = read('mobile/src/navigation/ParentTabs.tsx');
  const navigationRef = read('mobile/src/navigation/navigationRef.ts');
  const notificationsScreen = read('mobile/src/screens/NotificationsScreen.tsx');
  assert.ok(studentTabs.includes('AssessmentsStack.Screen name="TakeAssessment"'));
  assert.ok(studentTabs.includes('AssessmentsStack.Screen name="MyResults"'));
  assert.ok(parentTabs.includes('Stack.Screen name="MyResults"'));
  assert.ok(navigationRef.includes("navigationRef.navigate('TakeAssessment'"));
  assert.ok(navigationRef.includes("navigationRef.navigate('MyResults'"));
  assert.ok(notificationsScreen.includes('openAssessment(notification.target.assessmentId'));
  assert.ok(notificationsScreen.includes('openMyResults()'));
});

test('student Downloads shortcut includes PDF and DOC resources', () => {
  const learning = read('mobile/src/screens/student/StudentLearningScreen.tsx');
  const materials = read('mobile/src/screens/MaterialsScreen.tsx');
  assert.ok(learning.includes("label: 'Downloads', typeFilter: 'download'"));
  assert.ok(materials.includes("typeFilter === 'download'"));
  assert.ok(materials.includes("m.type === 'pdf' || m.type === 'doc'"));
});

test('admin message drafts are isolated by recipient', () => {
  const messages = read('mobile/src/screens/MessagesScreen.tsx');
  assert.ok(messages.includes('draftsByContactRef = useRef<Record<string, string>>({})'));
  assert.ok(messages.includes('draftsByContactRef.current[activeContact.id] = body'));
  assert.ok(messages.includes('draftsByContactRef.current[c.id]'));
  assert.ok(messages.includes('draftsByContactRef.current[recipientId]'));
});

test('attendance and score fields identify the learner and component', () => {
  const attendance = read('mobile/src/screens/AttendanceScreen.tsx');
  const scores = read('mobile/src/screens/ScoreEntryScreen.tsx');
  assert.ok(attendance.includes('accessibilityLabel=') && attendance.includes('days present'));
  assert.ok(scores.includes('accessibilityLabel=') && scores.includes(' score'));
});


test('teacher placement-decision screen is reachable and only offers teacher-permitted actions', () => {
  const teacherTabs = read('mobile/src/navigation/TeacherTabs.tsx');
  const classesMenu = read('mobile/src/screens/teacher/TeacherClassesScreen.tsx');
  const screen = read('mobile/src/screens/PromoteStudentsScreen.tsx');
  assert.ok(teacherTabs.includes("import PromoteStudentsScreen from '../screens/PromoteStudentsScreen'"));
  assert.ok(teacherTabs.includes('ReportsStack.Screen name="PromoteStudents"'));
  assert.ok(classesMenu.includes("screen: 'PromoteStudents'"));
  assert.ok(screen.includes('/promotion'));
  // Backend (POST /students/:id/promotion) lets teachers promote/retain/remove only;
  // demote, reinstate and the removed list are administrator-only.
  assert.ok(
    !screen.includes("'demote'") &&
    !screen.includes("'reinstate'") &&
    !screen.includes('report-roster/removed'),
    'teacher screen must not call administrator-only roster actions'
  );
});


test('teacher report remarks require an explicit class context for multi-class rosters', () => {
  const screen = read('mobile/src/screens/teacher/ReportRemarksScreen.tsx');
  assert.ok(screen.includes('const [selectedClass, setSelectedClass] = useState'));
  assert.ok(screen.includes('Select class for report remarks'));
  assert.ok(screen.includes('student.class_name === selectedClass'));
  assert.ok(screen.includes('students.find(student => student.class_name === String(value))'));
  assert.ok(screen.includes('classStudents.map(s =>'));
  assert.ok(screen.includes('classStudents.some(student => student.id === studentId)'));
});


test('multi-class teachers can enroll students into any of their assigned physical classes', () => {
  const screen = read('mobile/src/screens/AddStudentScreen.tsx');
  assert.ok(screen.includes('user?.assigned_class_names ?? []'));
  assert.ok(screen.includes('teacherClasses.has(name)'));
  assert.ok(screen.includes("user?.assigned_class_names?.join('|')"));
});

test('teacher attendance metadata follows the selected term instead of retaining another term values', () => {
  const attendance = read('mobile/src/screens/AttendanceScreen.tsx');
  assert.ok(attendance.includes('const selectedTerm = terms.find(term => term.id === selTerm)'));
  assert.ok(attendance.includes('setDaysOpened(String(selectedTerm.days_opened ?? \'\'))'));
  assert.ok(attendance.includes('setNextTermBegins(selectedTerm.next_term_begins ?? \'\')'));
  assert.ok(attendance.includes('[selTerm, terms]'));
  assert.ok(attendance.includes('setTerms(prev => prev.map(term => term.id === selTerm'));
});

test('attendance saves send term metadata only when the teacher deliberately edited it, and report each outcome', () => {
  const attendance = read('mobile/src/screens/AttendanceScreen.tsx');
  // Dirty tracking against the term as loaded/saved, not against whatever is typed.
  assert.ok(attendance.includes('const daysChanged = isAdmin && daysOpened.trim() !== savedDaysText'));
  assert.ok(attendance.includes('const nextTermChanged = nextTermBegins.trim() !== savedNextTerm'));
  assert.ok(attendance.includes('if (daysChanged) {'));
  assert.ok(attendance.includes('if (nextTermChanged) {'));
  // days_opened is administrator-only: read-only for teachers and never sent by them.
  assert.ok(attendance.includes('editable={isAdmin}'));
  // The old unconditional prefilled-value payload must be gone.
  assert.ok(!attendance.includes('days_opened: daysOpened.trim() ? Number(daysOpened) : undefined'));
  assert.ok(!attendance.includes('next_term_begins: nextTermBegins.trim() || undefined'));
  assert.ok(!attendance.includes('if (daysOpened.trim() || nextTermBegins.trim())'));
  // Same validation rules as the server, and an explicit clear instead of an impossible one.
  assert.ok(attendance.includes("from '../utils/termSettings'"));
  assert.ok(attendance.includes('termUpdate.next_term_begins = normalized.value'));
  // Term failure stops before attendance; attendance failure after a term save says so.
  assert.ok(attendance.includes("title: 'Nothing was saved'"));
  assert.ok(attendance.includes("'Term details saved, attendance NOT saved'"));
  assert.ok(attendance.includes("'Term details and attendance saved'"));
  // Local state adopts the server's stored values, not the typed text.
  assert.ok(attendance.includes('serverTerm?.days_opened'));
});
