import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AuthProvider } from './api/AuthContext';
import { WardProvider } from './api/WardContext';
import { AdminSchoolProvider } from './api/AdminSchoolContext';
import { NotificationsProvider } from './components/NotificationsContext';
import RootNavigator from './navigation/RootNavigator';
import { navigationRef, openMessageThread, openAssessment } from './navigation/navigationRef';
import OfflineBanner from './components/OfflineBanner';

// Expo notifications are silent by default while the app is open. Option
// A's in-app polling already handles the "app open, on the relevant
// screen" case, but a push should still surface something if the user's
// on a different screen than the one polling would refresh.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Keep the splash screen up until we've resolved (loaded or failed) the icon
// font, so screens never mount with icons half-downloaded and Metro's asset
// server never gets bombarded with one request per <Ionicons> instance.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  // fontsError is intentionally not surfaced to the user: if the icon font
  // can't be fetched (e.g. dev-server hiccup), we still let the app render
  // rather than block the whole UI on a non-critical asset.
  const [fontsLoaded, fontsError] = useFonts({
    ...Ionicons.font,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      if (fontsError) {
        console.warn('Icon font failed to load, continuing without it:', fontsError);
      }
      setReady(true);
    }
  }, [fontsLoaded, fontsError]);

  const onLayoutRootView = useCallback(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  // Tap-routing for pushes. Reads `data.type` set server-side (utils/push.ts
  // call sites in messages.ts / scores.ts / learning.ts) — same "kind"
  // vocabulary AppNotification.kind already uses in NotificationsContext.tsx,
  // so tap-routing and the in-app notification list share one vocabulary
  // instead of inventing a second one. Registered once for the app's
  // lifetime; covers both a tap while the app is backgrounded and a tap on
  // the app's own foreground alert (shouldShowAlert: true above).
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown> | undefined;
      if (!data) return;
      switch (data.type) {
        case 'message':
          // `data.screen` is set server-side (messages.ts) based on the
          // recipient's role — 'ChatThread' for parent/student/teacher,
          // 'Messages' for admin, since AdminStack.tsx has no nested
          // chats-stack. Falls back to openMessageThread's own default
          // ('ChatThread') if an older push payload didn't include it.
          if (data.contact) openMessageThread(data.contact as any, data.screen as string | undefined);
          break;
        case 'assessment':
          if (data.assessmentId) openAssessment(data.assessmentId as string, (data.title as string) ?? '');
          break;
        case 'score':
          // No dedicated deep link yet — MyResultsScreen isn't reachable
          // with a single id/param the way the other two are. Falls back
          // to whatever screen the user is already on.
          break;
      }
    });
    return () => sub.remove();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AuthProvider>
        <WardProvider>
          <AdminSchoolProvider>
            <NotificationsProvider>
              <StatusBar style="light" />
              <NavigationContainer ref={navigationRef}>
                <OfflineBanner />
                <RootNavigator />
              </NavigationContainer>
            </NotificationsProvider>
          </AdminSchoolProvider>
        </WardProvider>
      </AuthProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
  );
}