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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} />
        </>
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
