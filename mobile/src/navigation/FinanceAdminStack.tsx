import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors } from '../theme';

// finance_admin's own path, deliberately separate from AdminStack (Operations
// Admin). Only Dashboard, Finance, Messages, and ChangePassword — no Users,
// Terms, Subjects, Audit Log, Scores, Attendance, or anything academic.
import DashboardScreen from '../screens/DashboardScreen';
import FinanceScreen from '../screens/FinanceScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = { headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white };

export default function FinanceAdminStack() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Finance" component={FinanceScreen} options={{ headerShown: true, title: 'Finance', ...opts }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: true, title: 'Messages', ...opts }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...opts }} />
    </Stack.Navigator>
  );
}
