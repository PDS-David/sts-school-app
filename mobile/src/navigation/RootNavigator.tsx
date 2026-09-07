import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useAuth } from '../api/AuthContext';
import { Colors } from '../theme';

import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionSetupScreen from '../screens/SecurityQuestionSetupScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import BraineeChatScreen from '../screens/BraineeChatScreen';

import StudentTabs from './StudentTabs';
import TeacherTabs from './TeacherTabs';
import ParentTabs from './ParentTabs';
import AdminTabs from './AdminTabs';
import FinanceAdminTabs from './FinanceAdminTabs';

const Stack = createNativeStackNavigator();

const modalOpts: NativeStackNavigationOptions = {
  headerShown: false,
  presentation: 'modal',
};

// Renders the right role-based navigator. Every role now gets the same
// labeled bottom-tab-bar shape (AdminStack/FinanceAdminStack's old flat,
// tab-less tile dashboards were replaced with AdminTabs/FinanceAdminTabs —
// same pattern already used by student/teacher/parent since day one).
function RoleRouter() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'teacher': return <TeacherTabs />;
    case 'parent':  return <ParentTabs />;
    case 'admin':   return <AdminTabs />;
    case 'finance_admin': return <FinanceAdminTabs />;
    case 'student':
    default:        return <StudentTabs />;
  }
}

export default function RootNavigator() {
  const { user, mustChangePw, mustSetSecurityQuestion, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // `key` forces React to fully remount this Stack.Navigator (and land on
  // its first/default screen) on every phase transition, rather than
  // reconciling screens within the same navigator instance. This matters
  // because screen NAMES overlap between phases on purpose (e.g.
  // "SecurityQuestionSetup" exists both in the forced branch below and
  // again in the final authenticated branch, for voluntary later use) —
  // without a key change, React Navigation sees the currently-active
  // route name is still "valid" in the new screen set and just keeps
  // showing it, rather than resetting to "App". Confirmed as a real bug
  // this way, not hypothetically: mustChangePw's transition happened to
  // work without this because ChangePassword-forced and
  // SecurityQuestionSetup-forced share no screen names, so the route
  // reset was accidental, not because the underlying pattern was safe.
  const phase = !user ? 'guest' : mustChangePw ? 'change-pw' : mustSetSecurityQuestion ? 'security-q' : 'app';

  return (
    <Stack.Navigator id={undefined} key={phase} screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} />
        </>
      ) : mustChangePw ? (
        // Declarative, not an imperative navigation.replace() fired from
        // LoginScreen right after login() — see the comment on
        // AuthContext.tsx's AuthState.mustChangePw for why that raced this
        // exact branch and silently lost, letting a forced password change
        // be skipped entirely. There is no other screen registered in this
        // branch on purpose: while this is true, the forced flow IS the app.
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} initialParams={{ forced: true }} />
      ) : mustSetSecurityQuestion ? (
        <Stack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} initialParams={{ forced: true }} />
      ) : (
        <>
          <Stack.Screen name="App" component={RoleRouter} />
          {/* Some flows (e.g. voluntary password change) replace('Profile') —
              kept as an alias back into the role-based app so old navigation
              calls elsewhere in the codebase keep working. */}
          <Stack.Screen name="Profile" component={RoleRouter} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white }} />
          <Stack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} options={{ headerShown: true, title: 'Security Question', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={modalOpts} />
          <Stack.Screen name="BraineeChat" component={BraineeChatScreen} options={modalOpts} />
        </>
      )}
    </Stack.Navigator>
  );
}
