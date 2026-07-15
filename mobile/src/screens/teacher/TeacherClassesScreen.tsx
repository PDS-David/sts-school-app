import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

const ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; screen: string; color: string }[] = [
  { icon: 'people-outline',    label: 'My Classes', sub: 'Students by class',            screen: 'Students',   color: '#1565C0' },
  { icon: 'person-outline',    label: 'Students',   sub: 'Search and view student records', screen: 'Students', color: '#2E7D32' },
  { icon: 'book-outline',      label: 'Resources',  sub: 'Materials for your subjects',   screen: 'Materials',  color: '#6A1B9A' },
  { icon: 'calendar-outline',  label: 'Attendance', sub: 'Record daily attendance',       screen: 'Attendance', color: '#E65100' },
  { icon: 'create-outline',    label: 'Enter Scores', sub: 'Add or edit CA and exam scores', screen: 'ScoreEntry', color: '#C62828' },
  { icon: 'library-outline',   label: 'Subjects',   sub: 'Add a subject not yet in the list', screen: 'SubjectsMgmt', color: '#00838F' },
  { icon: 'lock-closed-outline', label: 'Close Term Records', sub: 'Lock or unlock your class for a term', screen: 'ClassLock', color: '#B71C1C' },
];

export default function TeacherClassesScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Classes" onPressBell={() => openNotifications()} />
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
