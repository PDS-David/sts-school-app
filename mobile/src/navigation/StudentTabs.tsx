import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import StudentLearningScreen from '../screens/student/StudentLearningScreen';
import StudentAssessmentsHomeScreen from '../screens/student/StudentAssessmentsHomeScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import ChatsScreen from '../screens/chats/ChatsScreen';
import ChatThreadScreen from '../screens/chats/ChatThreadScreen';

import MaterialsScreen from '../screens/MaterialsScreen';
import AssessmentsScreen from '../screens/AssessmentsScreen';
import TakeAssessmentScreen from '../screens/TakeAssessmentScreen';
import AssessmentResultsScreen from '../screens/AssessmentResultsScreen';
import MyResultsScreen from '../screens/MyResultsScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import WeeklyEffortsScreen from '../screens/WeeklyEffortsScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const LearningStack = createNativeStackNavigator();
const AssessmentsStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const stackScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTintColor: Colors.white,
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={StudentHomeScreen} />
    </HomeStack.Navigator>
  );
}

function LearningStackNavigator() {
  return (
    <LearningStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <LearningStack.Screen name="LearningHome" component={StudentLearningScreen} />
      <LearningStack.Screen name="Materials" component={MaterialsScreen} options={{ headerShown: true, title: 'Materials', ...stackScreenOptions }} />
    </LearningStack.Navigator>
  );
}

function AssessmentsStackNavigator() {
  return (
    <AssessmentsStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <AssessmentsStack.Screen name="AssessmentsHome" component={StudentAssessmentsHomeScreen} />
      <AssessmentsStack.Screen name="Assessments" component={AssessmentsScreen} options={{ headerShown: true, title: 'Assessments', ...stackScreenOptions }} />
      <AssessmentsStack.Screen name="TakeAssessment" component={TakeAssessmentScreen} options={{ headerShown: true, title: 'Take Assessment', ...stackScreenOptions }} />
      <AssessmentsStack.Screen name="AssessmentResults" component={AssessmentResultsScreen} options={{ headerShown: true, title: 'Results', ...stackScreenOptions }} />
      <AssessmentsStack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: 'My Results', ...stackScreenOptions }} />
      <AssessmentsStack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: 'Session Report', ...stackScreenOptions }} />
    </AssessmentsStack.Navigator>
  );
}

function ChatsStackNavigator() {
  return (
    <ChatsStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ChatsStack.Screen name="ChatsList" component={ChatsScreen} />
      <ChatsStack.Screen name="ChatThread" component={ChatThreadScreen} options={{ headerShown: false }} />
    </ChatsStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={StudentProfileScreen} />
      <ProfileStack.Screen name="MyResults" component={MyResultsScreen} options={{ headerShown: true, title: 'My Results', ...stackScreenOptions }} />
      <ProfileStack.Screen name="SessionReport" component={SessionReportScreen} options={{ headerShown: true, title: 'Session Report', ...stackScreenOptions }} />
      <ProfileStack.Screen name="WeeklyEfforts" component={WeeklyEffortsScreen} options={{ headerShown: true, title: 'Weekly Efforts', ...stackScreenOptions }} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: 'Change Password', ...stackScreenOptions }} />
    </ProfileStack.Navigator>
  );
}

// Hides the bottom tab bar once you've pushed past a tab's landing screen
// into a chat thread — same as WhatsApp, where the tab bar disappears inside
// a conversation.
function tabBarVisibleFor(routeNames: string[]) {
  return ({ route }: { route: any }) => {
    const focused = getFocusedRouteNameFromRoute(route) ?? routeNames[0];
    return { tabBarStyle: focused === 'ChatThread' ? { display: 'none' as const } : undefined };
  };
}

export default function StudentTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.primary, tabBarInactiveTintColor: Colors.textSub }}
    >
      <Tab.Screen
        name="HomeTab" component={HomeStackNavigator}
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="LearningTab" component={LearningStackNavigator}
        options={{ title: 'Learning', tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="AssessmentsTab" component={AssessmentsStackNavigator}
        options={{ title: 'Assessments', tabBarIcon: ({ color, size }) => <Ionicons name="clipboard" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="ChatsTab" component={ChatsStackNavigator}
        options={({ route }) => ({
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
          ...tabBarVisibleFor(['ChatsList'])({ route }),
        })}
      />
      <Tab.Screen
        name="ProfileTab" component={ProfileStackNavigator}
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
