import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useAuth } from '../api/AuthContext';
import { Colors } from '../theme';

import LoginScreen from '../screens/LoginScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import BraineeChatScreen from '../screens/BraineeChatScreen';

import StudentTabs from './StudentTabs';
import TeacherTabs from './TeacherTabs';
import ParentTabs from './ParentTabs';
import AdminStack from './AdminStack';
import FinanceAdminStack from './FinanceAdminStack';

const Stack = createNativeStackNavigator();

const modalOpts: NativeStackNavigationOptions = {
  headerShown: false,
  presentation: 'modal',
};

// Renders the right role-based navigator. Admin and finance_admin keep the
// original tile-dashboard flow (two separate stacks — see FinanceAdminStack
// for why); student, teacher, and parent get the WhatsApp-style bottom-tab
// experience.
function RoleRouter() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'teacher': return <TeacherTabs />;
    case 'parent':  return <ParentTabs />;
    case 'admin':   return <AdminStack />;
    case 'finance_admin': return <FinanceAdminStack />;
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
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="App" component={RoleRouter} />
          {/* Some flows (e.g. voluntary password change) replace('Profile') —
              kept as an alias back into the role-based app so old navigation
              calls elsewhere in the codebase keep working. */}
          <Stack.Screen name="Profile" component={RoleRouter} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={modalOpts} />
          <Stack.Screen name="BraineeChat" component={BraineeChatScreen} options={modalOpts} />
        </>
      )}
    </Stack.Navigator>
  );
}
