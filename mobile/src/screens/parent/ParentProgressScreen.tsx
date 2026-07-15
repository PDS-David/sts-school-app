import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

const ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; screen: string; color: string }[] = [
  { icon: 'bar-chart-outline',   label: 'Grades',           sub: "Ward's term report card", screen: 'MyResults',     color: '#1565C0' },
  { icon: 'calendar-outline',    label: 'Attendance',       sub: 'Days present this term',   screen: 'MyResults',     color: '#E65100' },
  { icon: 'chatbox-ellipses-outline', label: 'Behaviour',   sub: 'Class teacher remarks',    screen: 'MyResults',     color: '#6A1B9A' },
  { icon: 'trending-up-outline', label: 'Homework Status',  sub: 'Weekly effort tracking',   screen: 'WeeklyEfforts', color: '#2E7D32' },
];

export default function ParentProgressScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Progress" onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        {ITEMS.map((it) => (
          <TouchableOpacity key={it.label} onPress={() => navigation.navigate(it.screen)} activeOpacity={0.8}>
            <Card style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: it.color + '20' }]}>
                <Ionicons name={it.icon} size={22} color={it.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{it.label}</Text>
                <Text style={styles.sub}>{it.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
