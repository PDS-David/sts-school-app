import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { SidebarLayout, SidebarItem } from '../components/Sidebar';

import ParentHomeScreen from '../screens/parent/ParentHomeScreen';
import ParentProgressScreen from '../screens/parent/ParentProgressScreen';
import ParentActivitiesScreen from '../screens/parent/ParentActivitiesScreen';
import ParentProfileScreen from '../screens/parent/ParentProfileScreen';
import ChatsScreen from '../screens/chats/ChatsScreen';
import ChatThreadScreen from '../screens/chats/ChatThreadScreen';

import MyResultsScreen from '../screens/MyResultsScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import WeeklyEffortsScreen from '../screens/WeeklyEffortsScreen';
import FinanceScreen from '../screens/FinanceScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionSetupScreen from '../screens/SecurityQuestionSetupScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProgressStack = createNativeStackNavigator();
const ActivitiesStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const opts: NativeStackNavigationOptions = { headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white };

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={ParentHomeScreen} />
    </HomeStack.Navigator>
  );
}

function ProgressStackNavigator() {
  return (
    <ProgressStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen name="ProgressHome" component={ParentProgressScreen} />
      <ProgressStack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: "Ward's Results", ...opts }} />
      <ProgressStack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: "Session Report", ...opts }} />
      <ProgressStack.Screen name="WeeklyEfforts" component={WeeklyEffortsScreen} options={{ headerShown: true, title: 'Weekly Efforts', ...opts }} />
    </ProgressStack.Navigator>
  );
}

function ActivitiesStackNavigator() {
  return (
    <ActivitiesStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ActivitiesStack.Screen name="ActivitiesHome" component={ParentActivitiesScreen} />
      <ActivitiesStack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: "Ward's Results", ...opts }} />
      <ActivitiesStack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: "Session Report", ...opts }} />
    </ActivitiesStack.Navigator>
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

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ParentProfileScreen} />
      <ProfileStack.Screen name="Finance" component={FinanceScreen} options={{ headerShown: true, title: 'Fees', ...opts }} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...opts }} />
      <ProfileStack.Screen name="SecurityQuestionSetup" component={SecurityQuestionSetupScreen} options={{ headerShown: true, title: 'Security Question', ...opts }} />
    </ProfileStack.Navigator>
  );
}

function tabBarVisibleFor() {
  return ({ route }: { route: any }) => {
    const focused = getFocusedRouteNameFromRoute(route) ?? '';
    return { tabBarStyle: focused === 'ChatThread' ? { display: 'none' as const } : undefined };
  };
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { routeName: 'HomeTab', label: 'Home', icon: 'home' },
  { routeName: 'ProgressTab', label: 'Progress', icon: 'bar-chart' },
  { routeName: 'ActivitiesTab', label: 'Activities', icon: 'calendar' },
  { routeName: 'ChatsTab', label: 'Chats', icon: 'chatbubbles' },
  { routeName: 'ProfileTab', label: 'Profile', icon: 'person' },
];

export default function ParentTabs() {
  const [tabState, setTabState] = useState<any>(null);
  const activeRouteName = tabState?.routeNames?.[tabState.index];

  return (
    <SidebarLayout items={SIDEBAR_ITEMS} activeRouteName={activeRouteName}>
      <Tab.Navigator
        id={undefined}
        screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.primary, tabBarInactiveTintColor: Colors.textSub }}
        screenListeners={{ state: (e: any) => setTabState(e.data.state) }}
      >
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
        <Tab.Screen name="ProgressTab" component={ProgressStackNavigator} options={{ title: 'Progress', tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} /> }} />
        <Tab.Screen name="ActivitiesTab" component={ActivitiesStackNavigator} options={{ title: 'Activities', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }} />
        <Tab.Screen
          name="ChatsTab" component={ChatsStackNavigator}
          options={({ route }) => ({ title: 'Chats', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />, ...tabBarVisibleFor()({ route }) })}
        />
        <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
      </Tab.Navigator>
    </SidebarLayout>
  );
}
