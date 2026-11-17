import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';
import { useAuth } from '../../api/AuthContext';

const ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; screen: string; color: string }[] = [
  {
    icon: 'document-text-outline',
    label: 'Generate Student Reports',
    sub: 'Open students in your assigned physical class and print or export their report cards',
    screen: 'Students',
    color: '#1565C0',
  },
  {
    icon: 'trending-up-outline',
    label: 'Class Decisions',
    sub: 'Promote, retain, demote, or remove students when the school year is reviewed',
    screen: 'PromoteStudents',
    color: '#1B5E20',
  },
];

export default function TeacherClassesScreen({ navigation }: any) {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Reports" onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        <Card style={{ marginBottom: Spacing.sm }}>
          <Text style={styles.intro}>
            Your school role is to generate reports for students in your assigned physical class.
            Scores and attendance are maintained by the school; you can add the class-teacher remark
            when preparing a report. Class progression decisions remain yours to make when required.
          </Text>
          <Text style={styles.className}>Assigned class: {user?.assigned_class ?? 'Not assigned'}</Text>
        </Card>
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
  intro: { fontSize: Fonts.sizes.sm, color: Colors.textSub, lineHeight: 20 },
  className: { marginTop: Spacing.sm, fontSize: Fonts.sizes.sm, color: Colors.primary, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2, lineHeight: 17 },
});
