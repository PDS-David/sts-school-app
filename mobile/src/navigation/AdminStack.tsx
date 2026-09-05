import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors } from '../theme';

// Admin explicitly keeps the existing tile-based dashboard — the WhatsApp-style
// redesign in this pass applies to student, teacher, and parent only.
import DashboardScreen from '../screens/DashboardScreen';
import MyResultsScreen from '../screens/MyResultsScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import AssessmentsScreen from '../screens/AssessmentsScreen';
import TakeAssessmentScreen from '../screens/TakeAssessmentScreen';
import AssessmentResultsScreen from '../screens/AssessmentResultsScreen';
import CreateAssessmentScreen from '../screens/CreateAssessmentScreen';
import EssayAnswerReviewScreen from '../screens/EssayAnswerReviewScreen';
import MessagesScreen from '../screens/MessagesScreen';
import WeeklyEffortsScreen from '../screens/WeeklyEffortsScreen';
import StudentsScreen from '../screens/StudentsScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import ScoreEntryScreen from '../screens/ScoreEntryScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import ExportExcelScreen from '../screens/ExportExcelScreen';
import { ClassSummaryScreen, AuditLogScreen, DeletedStudentsScreen } from '../screens/AdminExtraScreens';
import { TermsMgmtScreen, SubjectsMgmtScreen } from '../screens/AcademicMgmtScreens';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionSetupScreen from '../screens/SecurityQuestionSetupScreen';
import ClassLockScreen from '../screens/ClassLockScreen';

const Stack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = { headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white };

export default function AdminStack() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: 'My Results', ...opts }} />
      <Stack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: 'Session Report', ...opts }} />
      <Stack.Screen name="Materials" component={MaterialsScreen} options={{ headerShown: true, title: 'Materials', ...opts }} />
      <Stack.Screen name="Assessments" component={AssessmentsScreen} options={{ headerShown: true, title: 'Assessments', ...opts }} />
      <Stack.Screen name="TakeAssessment" component={TakeAssessmentScreen} options={{ headerShown: true, title: 'Take Assessment', ...opts }} />
      <Stack.Screen name="AssessmentResults" component={AssessmentResultsScreen} options={{ headerShown: true, title: 'Results', ...opts }} />
      <Stack.Screen name="CreateAssessment" component={CreateAssessmentScreen} options={{ headerShown: true, title: 'Create Assessment', ...opts }} />
      {/* Admin-only oversight of Brainee's grading, with override power — a
          teacher never reaches this screen (see rbac.ts: 'aiGrading.override'
          is not granted to 'teacher'). Reached from AssessmentResultsScreen's
          per-student row. */}
      <Stack.Screen name="EssayAnswerReview" component={EssayAnswerReviewScreen} options={{ headerShown: true, title: "Review Brainee's Grading", ...opts }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: true, title: 'Messages', ...opts }} />
      <Stack.Screen name="WeeklyEfforts" component={WeeklyEffortsScreen} options={{ headerShown: true, title: 'Weekly Efforts', ...opts }} />
      {/* Finance moved out entirely — separate path now, see FinanceAdminStack.tsx.
          Operations Admin (this stack) has no finance route at all. */}
      <Stack.Screen name="Students" component={StudentsScreen} options={{ headerShown: true, title: 'Students', ...opts }} />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} options={{ headerShown: true, title: 'Enroll Student', ...opts }} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} options={{ headerShown: true, title: 'Student', ...opts }} />
      <Stack.Screen name="ScoreEntry" component={ScoreEntryScreen} options={{ headerShown: true, title: 'Enter Scores', ...opts }} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ headerShown: true, title: 'Attendance', ...opts }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ headerShown: true, title: 'Users', ...opts }} />
      <Stack.Screen name="ExportExcel" component={ExportExcelScreen} options={{ headerShown: true, title: 'Export Excel', ...opts }} />
      <Stack.Screen name="ClassSummary" component={ClassSummaryScreen} options={{ headerShown: true, title: 'Class Summary', ...opts }} />
      <Stack.Screen name="AuditLog" component={AuditLogScreen} options={{ headerShown: true, title: 'Audit Log', ...opts }} />
      <Stack.Screen name="DeletedStudents" component={DeletedStudentsScreen} options={{ headerShown: true, title: 'Deleted Students', ...opts }} />
      <Stack.Screen name="TermsMgmt" component={TermsMgmtScreen} options={{ headerShown: true, title: 'Terms', ...opts }} />
      <Stack.Screen name="SubjectsMgmt" component={SubjectsMgmtScreen} options={{ headerShown: true, title: 'Subjects', ...opts }} />
      <Stack.Screen name="ClassLock" component={ClassLockScreen} options={{ headerShown: true, title: 'Close Term Records', ...opts }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...opts }} />
      <Stack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} options={{ headerShown: true, title: 'Security Question', ...opts }} />
    </Stack.Navigator>
  );
}
