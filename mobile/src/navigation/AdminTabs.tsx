import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { SidebarLayout, SidebarItem, SidebarAction } from '../components/Sidebar';
import { useIsWide } from '../components/layout';
import { navigationRef } from './navigationRef';

// Replaces AdminStack.tsx. Previously a flat stack with no persistent nav
// chrome at all — a tile-grid Dashboard that pushed full-screen pages, no
// way back to "home" except the hardware/gesture back action. That's the
// concrete thing "everything scattered" meant for this role: Student,
// Teacher, and Parent all got a labeled bottom tab bar (see StudentTabs.tsx/
// TeacherTabs.tsx/ParentTabs.tsx) from day one; Admin never did. This gives
// Admin the exact same pattern — same 4-tab shape as Teacher's Dashboard/
// Classes/Chats/More, just with an Academics tab wide enough to hold every
// student/class/assessment-related screen admin already had access to.
//
// Deliberately unchanged in this pass: the "Messages" screen/route name and
// MessagesScreen.tsx itself (not swapped for the newer ChatsScreen/
// ChatThreadScreen used elsewhere) — chat was explicitly left alone for
// this round. Keeping the exact name "Messages" also matters mechanically:
// the message-push deep link (App.tsx / navigationRef.ts) still targets
// 'Messages' by name for admin recipients (set server-side in messages.ts)
// — navigationRef.navigate() finds it fine nested inside this tab's own
// stack, same as it already does for 'MyResults' under Student's two
// separate stacks, but only if the name doesn't change.
import AdminDashboardHomeScreen from '../screens/admin/AdminDashboardHomeScreen';
import AdminMoreScreen from '../screens/admin/AdminMoreScreen';
import AdminTermPinsScreen from '../screens/admin/AdminTermPinsScreen';
import MessagesScreen from '../screens/MessagesScreen';

import MyResultsScreen from '../screens/MyResultsScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import AssessmentsScreen from '../screens/AssessmentsScreen';
import TakeAssessmentScreen from '../screens/TakeAssessmentScreen';
import AssessmentResultsScreen from '../screens/AssessmentResultsScreen';
import CreateAssessmentScreen from '../screens/CreateAssessmentScreen';
import EssayAnswerReviewScreen from '../screens/EssayAnswerReviewScreen';
import WeeklyEffortsScreen from '../screens/WeeklyEffortsScreen';
import StudentsScreen from '../screens/StudentsScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import ScoreEntryScreen from '../screens/ScoreEntryScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import { ClassSummaryScreen, AuditLogScreen, DeletedStudentsScreen } from '../screens/AdminExtraScreens';
import { TermsMgmtScreen, SubjectsMgmtScreen } from '../screens/AcademicMgmtScreens';
import ClassLockScreen from '../screens/ClassLockScreen';

import AdminUsersScreen from '../screens/AdminUsersScreen';
import ExportExcelScreen from '../screens/ExportExcelScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionSetupScreen from '../screens/SecurityQuestionSetupScreen';

const Tab = createBottomTabNavigator();
const DashStack = createNativeStackNavigator();
const AcademicsStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = { headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white };

function DashStackNavigator() {
  return (
    <DashStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <DashStack.Screen name="Dashboard" component={AdminDashboardHomeScreen} />
    </DashStack.Navigator>
  );
}

function AcademicsStackNavigator() {
  return (
    <AcademicsStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <AcademicsStack.Screen name="Students" component={StudentsScreen} options={{ headerShown: true, title: 'Students', ...opts }} />
      <AcademicsStack.Screen name="AddStudent" component={AddStudentScreen} options={{ headerShown: true, title: 'Enroll Student', ...opts }} />
      <AcademicsStack.Screen name="StudentDetail" component={StudentDetailScreen} options={{ headerShown: true, title: 'Student', ...opts }} />
      <AcademicsStack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: 'My Results', ...opts }} />
      <AcademicsStack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: 'Session Report', ...opts }} />
      <AcademicsStack.Screen name="Materials" component={MaterialsScreen} options={{ headerShown: true, title: 'Materials', ...opts }} />
      <AcademicsStack.Screen name="ScoreEntry" component={ScoreEntryScreen} options={{ headerShown: true, title: 'Enter Scores', ...opts }} />
      <AcademicsStack.Screen name="Attendance" component={AttendanceScreen} options={{ headerShown: true, title: 'Attendance', ...opts }} />
      <AcademicsStack.Screen name="Assessments" component={AssessmentsScreen} options={{ headerShown: true, title: 'Assessments', ...opts }} />
      <AcademicsStack.Screen name="TakeAssessment" component={TakeAssessmentScreen} options={{ headerShown: true, title: 'Take Assessment', ...opts }} />
      <AcademicsStack.Screen name="AssessmentResults" component={AssessmentResultsScreen} options={{ headerShown: true, title: 'Results', ...opts }} />
      <AcademicsStack.Screen name="CreateAssessment" component={CreateAssessmentScreen} options={{ headerShown: true, title: 'Create Assessment', ...opts }} />
      {/* Admin-only oversight of Brainee's grading, with override power — see
          rbac.ts: 'aiGrading.override' is not granted to 'teacher'. */}
      <AcademicsStack.Screen name="EssayAnswerReview" component={EssayAnswerReviewScreen} options={{ headerShown: true, title: "Review Brainee's Grading", ...opts }} />
      <AcademicsStack.Screen name="WeeklyEfforts" component={WeeklyEffortsScreen} options={{ headerShown: true, title: 'Weekly Efforts', ...opts }} />
      <AcademicsStack.Screen name="ClassSummary" component={ClassSummaryScreen} options={{ headerShown: true, title: 'Class Summary', ...opts }} />
      <AcademicsStack.Screen name="DeletedStudents" component={DeletedStudentsScreen} options={{ headerShown: true, title: 'Deleted Students', ...opts }} />
      <AcademicsStack.Screen name="TermsMgmt" component={TermsMgmtScreen} options={{ headerShown: true, title: 'Terms', ...opts }} />
      <AcademicsStack.Screen name="SubjectsMgmt" component={SubjectsMgmtScreen} options={{ headerShown: true, title: 'Subjects', ...opts }} />
      <AcademicsStack.Screen name="ClassLock" component={ClassLockScreen} options={{ headerShown: true, title: 'Close Term Records', ...opts }} />
    </AcademicsStack.Navigator>
  );
}

function ChatsStackNavigator() {
  return (
    <ChatsStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ChatsStack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: true, title: 'Messages', ...opts }} />
    </ChatsStack.Navigator>
  );
}

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {/* Previously AdminUsers was the initial screen here directly — no
          menu in between, meaning Change Password/Security Question/Audit
          Log/Export Excel had no tap path to reach them at all. */}
      <MoreStack.Screen name="AdminMore" component={AdminMoreScreen} />
      <MoreStack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ headerShown: true, title: 'Users', ...opts }} />
      <MoreStack.Screen name="AdminTermPins" component={AdminTermPinsScreen} options={{ headerShown: true, title: 'Term PINs', ...opts }} />
      <MoreStack.Screen name="AuditLog" component={AuditLogScreen} options={{ headerShown: true, title: 'Audit Log', ...opts }} />
      <MoreStack.Screen name="ExportExcel" component={ExportExcelScreen} options={{ headerShown: true, title: 'Export Excel', ...opts }} />
      <MoreStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...opts }} />
      <MoreStack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} options={{ headerShown: true, title: 'Security Question', ...opts }} />
    </MoreStack.Navigator>
  );
}

// Hides the bottom tab bar in two cases: on a wide/web screen (the Sidebar
// is the only nav chrome there now — see Sidebar.tsx's comment for why
// this changed from "alongside" to "instead of"), or past a chat thread on
// any screen size (existing convention, unrelated to width).
function tabBarVisibleFor(isWide: boolean) {
  return ({ route }: { route: any }) => {
    const focused = getFocusedRouteNameFromRoute(route) ?? '';
    const hide = isWide || focused === 'ChatThread';
    return { tabBarStyle: hide ? { display: 'none' as const } : undefined };
  };
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { routeName: 'DashboardTab', label: 'Dashboard', icon: 'grid' },
  { routeName: 'AcademicsTab', label: 'Academics', icon: 'school' },
  { routeName: 'ChatsTab', label: 'Chats', icon: 'chatbubbles' },
  { routeName: 'MoreTab', label: 'More', icon: 'menu' },
];

// Previously a duplicate of this exact list lived inside
// AdminDashboardHomeScreen.tsx's own content as a second, screen-local
// mini-sidebar (plus a FAB with a third copy of the same three
// destinations) — moved here so there's exactly one "Quick Actions",
// living in the one real persistent sidebar, reachable from any tab.
const QUICK_ACTIONS: SidebarAction[] = [
  { icon: 'people-outline', label: 'Students', onPress: () => navigationRef.isReady() && navigationRef.navigate('AcademicsTab', { screen: 'Students' }) },
  { icon: 'person-outline', label: 'Users', onPress: () => navigationRef.isReady() && navigationRef.navigate('MoreTab', { screen: 'AdminUsers' }) },
  { icon: 'create-outline', label: 'Enter Scores', onPress: () => navigationRef.isReady() && navigationRef.navigate('AcademicsTab', { screen: 'ScoreEntry' }) },
];

export default function AdminTabs() {
  // Lifts the Tab.Navigator's own focused-route state up to this component
  // so the Sidebar (a plain sibling, not a custom tabBar) can highlight the
  // active item and knows nothing else about navigation internals. See
  // Sidebar.tsx's own comment for why this doesn't use a scoped ref.
  const [tabState, setTabState] = useState<any>(null);
  const activeRouteName = tabState?.routeNames?.[tabState.index];
  const isWide = useIsWide();

  return (
    <SidebarLayout items={SIDEBAR_ITEMS} activeRouteName={activeRouteName} quickActions={QUICK_ACTIONS}>
      <Tab.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSub,
          // Default for every tab that doesn't set its own `options`
          // function (ChatsTab below overrides this per-route instead,
          // since it also needs the ChatThread-specific hide).
          tabBarStyle: isWide ? { display: 'none' } : undefined,
        }}
        screenListeners={{ state: (e: any) => setTabState(e.data.state) }}
      >
        <Tab.Screen name="DashboardTab" component={DashStackNavigator} options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
        <Tab.Screen name="AcademicsTab" component={AcademicsStackNavigator} options={{ title: 'Academics', tabBarIcon: ({ color, size }) => <Ionicons name="school" size={size} color={color} /> }} />
        <Tab.Screen
          name="ChatsTab" component={ChatsStackNavigator}
          options={({ route }) => ({ title: 'Chats', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />, ...tabBarVisibleFor(isWide)({ route }) })}
        />
        <Tab.Screen name="MoreTab" component={MoreStackNavigator} options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} /> }} />
      </Tab.Navigator>
    </SidebarLayout>
  );
}
