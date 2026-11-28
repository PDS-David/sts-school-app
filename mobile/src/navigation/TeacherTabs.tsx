// Teacher navigation exposes physical-class record entry, editing and report generation.
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { SidebarLayout, SidebarItem, SidebarAction } from '../components/Sidebar';
import { navigationRef } from './navigationRef';
import { useIsWide } from '../components/layout';
import { useAuth } from '../api/AuthContext';

import TeacherDashboardHomeScreen from '../screens/teacher/TeacherDashboardHomeScreen';
import TeacherClassesScreen from '../screens/teacher/TeacherClassesScreen';
import TeacherMoreScreen from '../screens/teacher/TeacherMoreScreen';
import TeacherQuestionReviewScreen from '../screens/teacher/TeacherQuestionReviewScreen';
import StudentsScreen from '../screens/StudentsScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import MyResultsScreen from '../screens/MyResultsScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import ScoreEntryScreen from '../screens/ScoreEntryScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ReportRemarksScreen from '../screens/teacher/ReportRemarksScreen';
import PromoteStudentsScreen from '../screens/PromoteStudentsScreen';

const Tab = createBottomTabNavigator();
const DashStack = createNativeStackNavigator();
const ReportsStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTintColor: Colors.white,
};

function DashStackNavigator() {
  return (
    <DashStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <DashStack.Screen name="Dashboard" component={TeacherDashboardHomeScreen} />
    </DashStack.Navigator>
  );
}

function ReportsStackNavigator({ subjectTeacher = false }: { subjectTeacher?: boolean }) {
  return (
    <ReportsStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ReportsStack.Screen name="ReportsHome" component={TeacherClassesScreen} />
      <ReportsStack.Screen name="Students" component={StudentsScreen} options={{ headerShown: true, title: 'Report Roster', ...opts }} />
      {!subjectTeacher && <ReportsStack.Screen name="StudentDetail" component={StudentDetailScreen} options={{ headerShown: true, title: 'Student Report', ...opts }} />}
      {!subjectTeacher && <ReportsStack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: 'Term Report', ...opts }} />}
      {!subjectTeacher && <ReportsStack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: 'Session Report', ...opts }} />}
      {!subjectTeacher && <ReportsStack.Screen name="AddStudent" component={AddStudentScreen} options={{ headerShown: true, title: 'Add Physical-Class Student', ...opts }} />}
      <ReportsStack.Screen name="ScoreEntry" component={ScoreEntryScreen} options={{ headerShown: true, title: 'Enter / Edit Scores', ...opts }} />
      {!subjectTeacher && <ReportsStack.Screen name="Attendance" component={AttendanceScreen} options={{ headerShown: true, title: 'Attendance', ...opts }} />}
      {!subjectTeacher && <ReportsStack.Screen name="ReportRemarks" component={ReportRemarksScreen} options={{ headerShown: true, title: 'Report Remarks', ...opts }} />}
      {!subjectTeacher && <ReportsStack.Screen name="PromoteStudents" component={PromoteStudentsScreen} options={{ headerShown: true, title: 'Promote / Retain / Remove', ...opts }} />}
    </ReportsStack.Navigator>
  );
}

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="More" component={TeacherMoreScreen} />
      <MoreStack.Screen name="TeacherQuestionReview" component={TeacherQuestionReviewScreen} options={{ headerShown: false }} />
    </MoreStack.Navigator>
  );
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { routeName: 'DashboardTab', label: 'Dashboard', icon: 'grid' },
  { routeName: 'ReportsTab', label: 'Student Reports', icon: 'document-text' },
  { routeName: 'MoreTab', label: 'More', icon: 'menu' },
];

const QUICK_ACTIONS: SidebarAction[] = [
  {
    icon: 'document-text-outline',
    label: 'Generate Reports',
    onPress: () => navigationRef.isReady() && navigationRef.navigate('ReportsTab', { screen: 'Students' }),
  },
];

export default function TeacherTabs() {
  const { user } = useAuth();
  const subjectTeacher = !!user && user.role === 'teacher' && !user.assigned_class;
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
          tabBarStyle: isWide ? { display: 'none' } : undefined,
        }}
        screenListeners={{ state: (e: any) => setTabState(e.data.state) }}
      >
        <Tab.Screen name="DashboardTab" component={DashStackNavigator} options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
        <Tab.Screen name="ReportsTab" children={() => <ReportsStackNavigator subjectTeacher={subjectTeacher} />} options={{ title: 'Reports', tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} /> }} />
        <Tab.Screen name="MoreTab" component={MoreStackNavigator} options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} /> }} />
      </Tab.Navigator>
    </SidebarLayout>
  );
}
