import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { navigationRef } from '../navigation/navigationRef';
import { useIsWide } from './layout';

export interface SidebarItem {
  routeName: string;   // the Tab.Screen `name` this item navigates to
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// A shortcut into a specific nested screen (not just a top-level tab) —
// e.g. "Students" lives inside AcademicsTab's own stack, not at the tab
// level itself, so this needs a full onPress callback rather than
// SidebarItem's simpler routeName-only navigation.
export interface SidebarAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

// Persistent left-hand nav for wide/web screens, requested explicitly by
// the project owner for ALL roles. Originally shipped ALONGSIDE the bottom
// tab bar (a plain sibling next to an unmodified <Tab.Navigator>, so as not
// to touch its own rendering) — corrected after live testing showed this
// read as duplicated navigation (Dashboard/Academics/Chats/More appearing
// twice on the same screen). The bottom tab bar is now hidden on wide
// screens at the Tab.Navigator level (`tabBarStyle: { display: 'none' }`
// via useIsWide() in each role's *Tabs.tsx) — this sidebar is the ONLY nav
// chrome on wide/web, the bottom bar the only one on narrow/native.
//
// `quickActions`, if given, renders as a second section below the primary
// nav items — this is where a role's "Quick Actions" (previously a
// separate mini-sidebar/FAB duplicated inside the Dashboard screen's own
// content) now lives instead: one real sidebar, not two.
//
// `activeRouteName` comes from the wrapping *Tabs.tsx component's own
// `screenListeners={{ state: ... }}` on its Tab.Navigator — the officially
// supported way to observe a nested navigator's focused route from
// outside it, without a scoped ref (createBottomTabNavigator doesn't
// expose one). Selecting an item navigates via the app-wide
// `navigationRef` (already used for push-notification deep links and
// openNotifications()/openBraineeChat() in navigationRef.ts) rather than a
// tab-navigator-local navigation prop, since this component sits outside
// the Tab.Navigator's own subtree.
export function Sidebar({ items, activeRouteName, quickActions }: {
  items: SidebarItem[];
  activeRouteName?: string;
  quickActions?: SidebarAction[];
}) {
  return (
    <View style={styles.sidebar}>
      {items.map((item) => {
        const active = item.routeName === activeRouteName;
        return (
          <TouchableOpacity
            key={item.routeName}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => { if (navigationRef.isReady()) navigationRef.navigate(item.routeName); }}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={20} color={active ? Colors.primary : Colors.textSub} />
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}

      {quickActions && quickActions.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Quick Actions</Text>
          {quickActions.map((a) => (
            <TouchableOpacity key={a.label} style={styles.item} onPress={a.onPress} activeOpacity={0.7}>
              <Ionicons name={a.icon} size={20} color={Colors.textSub} />
              <Text style={styles.label}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

const SIDEBAR_WIDTH = 220;

// Wraps a role's <Tab.Navigator> (passed as `children`, completely
// unmodified) with the Sidebar on wide screens; on narrow screens this is
// a pure passthrough — `children` renders exactly as it always has, no
// wrapping View at all, so there's zero behavior change on an actual phone.
export function SidebarLayout({ items, activeRouteName, quickActions, children }: {
  items: SidebarItem[];
  activeRouteName?: string;
  quickActions?: SidebarAction[];
  children: React.ReactNode;
}) {
  const isWide = useIsWide();
  if (!isWide) return <>{children}</>;
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Sidebar items={items} activeRouteName={activeRouteName} quickActions={quickActions} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: Colors.card,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    gap: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  itemActive: { backgroundColor: Colors.primary + '18' },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textSub },
  labelActive: { color: Colors.primary, fontWeight: '700' },
  sectionLabel: {
    fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub,
    textTransform: 'uppercase', marginTop: Spacing.lg, marginBottom: Spacing.xs, paddingHorizontal: Spacing.sm,
  },
});
