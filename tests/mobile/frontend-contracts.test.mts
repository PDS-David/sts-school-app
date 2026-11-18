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
