import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { SidebarLayout, SidebarItem } from '../components/Sidebar';
import { useIsWide } from '../components/layout';

// Replaces FinanceAdminStack.tsx. finance_admin has one real destination
// (Finance) plus account-settings screens, so this is a much lighter version
// of the same tab-bar treatment given to every other role — 2 tabs, no
// grouping decisions needed since there's nothing to group. No Chats tab
// (SEC-02 / owner decision D2): finance_admin has no messages.* permission
// and the contacts endpoint now returns nothing for this role.
import FinanceScreen from '../screens/FinanceScreen';
import FinanceAdminMoreScreen from '../screens/admin/FinanceAdminMoreScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionSetupScreen from '../screens/SecurityQuestionSetupScreen';

const Tab = createBottomTabNavigator();
const FinanceStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = { headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white };

function FinanceStackNavigator() {
  return (
    <FinanceStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <FinanceStack.Screen name="Finance" component={FinanceScreen} options={{ headerShown: true, title: 'Finance', ...opts }} />
    </FinanceStack.Navigator>
  );
}

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="FinanceAdminMore" component={FinanceAdminMoreScreen} />
      <MoreStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...opts }} />
      <MoreStack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} options={{ headerShown: true, title: 'Security Question', ...opts }} />
    </MoreStack.Navigator>
  );
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { routeName: 'FinanceTab', label: 'Finance', icon: 'receipt' },
  { routeName: 'MoreTab', label: 'More', icon: 'menu' },
];

export default function FinanceAdminTabs() {
  const [tabState, setTabState] = useState<any>(null);
  const activeRouteName = tabState?.routeNames?.[tabState.index];
  const isWide = useIsWide();

  return (
    <SidebarLayout items={SIDEBAR_ITEMS} activeRouteName={activeRouteName}>
      <Tab.Navigator
        id={undefined}
        screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.primary, tabBarInactiveTintColor: Colors.textSub, tabBarStyle: isWide ? { display: 'none' } : undefined }}
        screenListeners={{ state: (e: any) => setTabState(e.data.state) }}
      >
        <Tab.Screen name="FinanceTab" component={FinanceStackNavigator} options={{ title: 'Finance', tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} /> }} />
        <Tab.Screen name="MoreTab" component={MoreStackNavigator} options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} /> }} />
      </Tab.Navigator>
    </SidebarLayout>
  );
}
