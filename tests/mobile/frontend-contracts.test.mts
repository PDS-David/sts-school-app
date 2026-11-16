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
  assert.match(adminTabs, /ChatsStack\\.Screen name="Messages"/);
  for (const tabs of [parentTabs, studentTabs, teacherTabs]) {
    assert.match(tabs, /ChatsStack\\.Screen name="ChatThread"/);
  }
  assert.doesNotMatch(financeTabs, /\\.Screen name="Messages"|\\.Screen name="ChatThread"/);
  assert.match(notifications, /if \\(user\\.role !== 'finance_admin'\\)/);
  assert.match(notifications, /screen: user\\.role === 'admin' \\? 'Messages' : 'ChatThread'/);
  assert.match(navigationRef, /navigationRef\\.navigate\\(screen, \\{ contact \\}\\)/);
});

test('assessment and results notification targets are registered', () => {
  const studentTabs = read('mobile/src/navigation/StudentTabs.tsx');
  const parentTabs = read('mobile/src/navigation/ParentTabs.tsx');
  const navigationRef = read('mobile/src/navigation/navigationRef.ts');
  const notificationsScreen = read('mobile/src/screens/NotificationsScreen.tsx');
  assert.match(studentTabs, /AssessmentsStack\\.Screen name="TakeAssessment"/);
  assert.match(studentTabs, /AssessmentsStack\\.Screen name="MyResults"/);
  assert.match(parentTabs, /(?:ProgressStack|ActivitiesStack)\\.Screen name="MyResults"/);
  assert.match(navigationRef, /navigationRef\\.navigate\\('TakeAssessment'/);
  assert.match(navigationRef, /navigationRef\\.navigate\\('MyResults'/);
  assert.match(notificationsScreen, /openAssessment\\(notification\\.target\\.assessmentId/);
  assert.match(notificationsScreen, /openMyResults\\(\\)/);
});

test('student Downloads shortcut includes PDF and DOC resources', () => {
  const learning = read('mobile/src/screens/student/StudentLearningScreen.tsx');
  const materials = read('mobile/src/screens/MaterialsScreen.tsx');
  assert.match(learning, /label: 'Downloads', typeFilter: 'download'/);
  assert.match(materials, /typeFilter === 'download'/);
  assert.match(materials, /m\\.type === 'pdf' \\|\\| m\\.type === 'doc'/);
});

test('admin message drafts are isolated by recipient', () => {
  const messages = read('mobile/src/screens/MessagesScreen.tsx');
  assert.match(messages, /draftsByContactRef = useRef<Record<string, string>>/);
  assert.match(messages, /draftsByContactRef\\.current\\[activeContact\\.id\\] = body/);
  assert.match(messages, /draftsByContactRef\\.current\\[c\\.id\\]/);
  assert.match(messages, /draftsByContactRef\\.current\\[recipientId\\]/);
});

test('attendance and score fields identify the learner and component', () => {
  const attendance = read('mobile/src/screens/AttendanceScreen.tsx');
  const scores = read('mobile/src/screens/ScoreEntryScreen.tsx');
  assert.match(attendance, /accessibilityLabel=.*days present/);
  assert.match(scores, /accessibilityLabel=.*score/);
});
