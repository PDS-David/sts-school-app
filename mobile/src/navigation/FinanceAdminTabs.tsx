import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

// Replaces FinanceAdminStack.tsx. finance_admin only ever had 2 real
// destinations (Finance, Messages) plus account-settings screens, so this
// is a much lighter version of the same tab-bar treatment given to every
// other role — 3 tabs, no grouping decisions needed since there's nothing
// to group. Chat (MessagesScreen, route name "Messages") deliberately
// unchanged — same reasoning as AdminTabs.tsx.
import FinanceScreen from '../screens/FinanceScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionSetupScreen from '../screens/SecurityQuestionSetupScreen';

const Tab = createBottomTabNavigator();
const FinanceStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = { headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white };

function FinanceStackNavigator() {
  return (
    <FinanceStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <FinanceStack.Screen name="Finance" component={FinanceScreen} options={{ headerShown: true, title: 'Finance', ...opts }} />
    </FinanceStack.Navigator>
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
      <MoreStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...opts }} />
      <MoreStack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} options={{ headerShown: true, title: 'Security Question', ...opts }} />
    </MoreStack.Navigator>
  );
}

export default function FinanceAdminTabs() {
  return (
    <Tab.Navigator id={undefined} screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.primary, tabBarInactiveTintColor: Colors.textSub }}>
      <Tab.Screen name="FinanceTab" component={FinanceStackNavigator} options={{ title: 'Finance', tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} /> }} />
      <Tab.Screen name="ChatsTab" component={ChatsStackNavigator} options={{ title: 'Chats', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} /> }} />
      <Tab.Screen name="MoreTab" component={MoreStackNavigator} options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}
