import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { SidebarLayout, SidebarItem } from '../components/Sidebar';

// NOTE (teacher role policy): a teacher on this platform never creates a
// test/quiz/essay assignment, never opens AI Marking, and never views a
// student's self-assessment results with Brainee — those are exclusively
// admin/Brainee territory (see backend/src/utils/rbac.ts). This is why
// CreateAssessmentScreen, AssessmentsScreen (teacher marking/results view),
// and EssayAnswerReviewScreen are intentionally NOT imported here. A
// teacher's grading surface is only ScoreEntryScreen — CA1/CA2/Exam scores
// for their own subject or class — reached from the Classes tab below.
import TeacherDashboardHomeScreen from '../screens/teacher/TeacherDashboardHomeScreen';
import TeacherClassesScreen from '../screens/teacher/TeacherClassesScreen';
import TeacherMoreScreen from '../screens/teacher/TeacherMoreScreen';
import ChatsScreen from '../screens/chats/ChatsScreen';
import ChatThreadScreen from '../screens/chats/ChatThreadScreen';

import StudentsScreen from '../screens/StudentsScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import MyResultsScreen from '../screens/MyResultsScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ScoreEntryScreen from '../screens/ScoreEntryScreen';
import { SubjectsMgmtScreen } from '../screens/AcademicMgmtScreens';
import WeeklyEffortsScreen from '../screens/WeeklyEffortsScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionSetupScreen from '../screens/SecurityQuestionSetupScreen';
import ClassLockScreen from '../screens/ClassLockScreen';

const Tab = createBottomTabNavigator();
const DashStack = createNativeStackNavigator();
const ClassesStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = { headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white };

function DashStackNavigator() {
  return (
    <DashStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <DashStack.Screen name="Dashboard" component={TeacherDashboardHomeScreen} />
    </DashStack.Navigator>
  );
}

function ClassesStackNavigator() {
  return (
    <ClassesStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ClassesStack.Screen name="ClassesHome" component={TeacherClassesScreen} />
      <ClassesStack.Screen name="Students" component={StudentsScreen} options={{ headerShown: true, title: 'Students', ...opts }} />
      <ClassesStack.Screen name="StudentDetail" component={StudentDetailScreen} options={{ headerShown: true, title: 'Student', ...opts }} />
      <ClassesStack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: 'Report Card', ...opts }} />
      <ClassesStack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: 'Session Report', ...opts }} />
      <ClassesStack.Screen name="Materials" component={MaterialsScreen} options={{ headerShown: true, title: 'Resources', ...opts }} />
      <ClassesStack.Screen name="Attendance" component={AttendanceScreen} options={{ headerShown: true, title: 'Attendance', ...opts }} />
      <ClassesStack.Screen name="ScoreEntry" component={ScoreEntryScreen} options={{ headerShown: true, title: 'Enter Scores', ...opts }} />
      <ClassesStack.Screen name="SubjectsMgmt" component={SubjectsMgmtScreen} options={{ headerShown: true, title: 'Subjects', ...opts }} />
      <ClassesStack.Screen name="ClassLock" component={ClassLockScreen} options={{ headerShown: true, title: 'Close Term Records', ...opts }} />
    </ClassesStack.Navigator>
  );
}

function ChatsStackNavigator() {
  return (
    <ChatsStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ChatsStack.Screen name="ChatsList" component={ChatsScreen} />
      <ChatsStack.Screen name="ChatThread" component={ChatThreadScreen} />
    </ChatsStack.Navigator>
  );
}

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="More" component={TeacherMoreScreen} />
      <MoreStack.Screen name="WeeklyEfforts" component={WeeklyEffortsScreen} options={{ headerShown: true, title: 'Weekly Efforts', ...opts }} />
      <MoreStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...opts }} />
      <MoreStack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} options={{ headerShown: true, title: 'Security Question', ...opts }} />
    </MoreStack.Navigator>
  );
}

function tabBarVisibleFor() {
  return ({ route }: { route: any }) => {
    const focused = getFocusedRouteNameFromRoute(route) ?? '';
    return { tabBarStyle: focused === 'ChatThread' ? { display: 'none' as const } : undefined };
  };
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { routeName: 'DashboardTab', label: 'Dashboard', icon: 'grid' },
  { routeName: 'ClassesTab', label: 'Classes', icon: 'people' },
  { routeName: 'ChatsTab', label: 'Chats', icon: 'chatbubbles' },
  { routeName: 'MoreTab', label: 'More', icon: 'menu' },
];

export default function TeacherTabs() {
  const [tabState, setTabState] = useState<any>(null);
  const activeRouteName = tabState?.routeNames?.[tabState.index];

  return (
    <SidebarLayout items={SIDEBAR_ITEMS} activeRouteName={activeRouteName}>
      <Tab.Navigator
        id={undefined}
        screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.primary, tabBarInactiveTintColor: Colors.textSub }}
        screenListeners={{ state: (e: any) => setTabState(e.data.state) }}
      >
        <Tab.Screen name="DashboardTab" component={DashStackNavigator} options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
        <Tab.Screen name="ClassesTab" component={ClassesStackNavigator} options={{ title: 'Classes', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }} />
        <Tab.Screen
          name="ChatsTab" component={ChatsStackNavigator}
          options={({ route }) => ({ title: 'Chats', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />, ...tabBarVisibleFor()({ route }) })}
        />
        <Tab.Screen name="MoreTab" component={MoreStackNavigator} options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} /> }} />
      </Tab.Navigator>
    </SidebarLayout>
  );
}
