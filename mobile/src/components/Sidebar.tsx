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

// Persistent left-hand nav for wide/web screens, requested explicitly by
// the project owner for ALL roles, ALONGSIDE (not replacing) the existing
// bottom tab bar — which is why this is a plain sibling component next to
// an unmodified <Tab.Navigator>, not a custom `tabBar` render prop (that
// would replace the bottom bar's own rendering, not add to it).
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
export function Sidebar({ items, activeRouteName }: { items: SidebarItem[]; activeRouteName?: string }) {
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
    </View>
  );
}

const SIDEBAR_WIDTH = 220;

// Wraps a role's <Tab.Navigator> (passed as `children`, completely
// unmodified) with the Sidebar on wide screens; on narrow screens this is
// a pure passthrough — `children` renders exactly as it always has, no
// wrapping View at all, so there's zero behavior change on an actual phone.
export function SidebarLayout({ items, activeRouteName, children }: {
  items: SidebarItem[];
  activeRouteName?: string;
  children: React.ReactNode;
}) {
  const isWide = useIsWide();
  if (!isWide) return <>{children}</>;
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Sidebar items={items} activeRouteName={activeRouteName} />
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
});
