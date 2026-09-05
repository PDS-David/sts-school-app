import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Card, Loader } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

const SHORTCUTS: { icon: keyof typeof Ionicons.glyphMap; label: string; typeFilter?: string; color: string }[] = [
  { icon: 'document-text', label: 'Resources', color: '#6A1B9A' },
  { icon: 'videocam',      label: 'Videos',    typeFilter: 'video', color: '#1565C0' },
  { icon: 'download',      label: 'Downloads', typeFilter: 'doc',   color: '#2E7D32' },
];

export default function StudentLearningScreen({ navigation }: any) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/academic/subjects')
      .then(({ data }) => setSubjects(data.subjects ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Learning" onPressBell={() => openNotifications()} />
      <ScrollView>
        <Text style={styles.sectionLabel}>Subjects</Text>
        <View style={styles.grid}>
          {subjects.length === 0 && (
            <Card style={{ marginHorizontal: Spacing.md, flex: 1 }}>
              <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>No subjects assigned yet.</Text>
            </Card>
          )}
          {subjects.map((s) => (
            <TouchableOpacity key={s.id} style={styles.tile} onPress={() => navigation.navigate('SubjectTopics', { subjectId: s.id, subjectName: s.name })} activeOpacity={0.8}>
              <View style={styles.tileIcon}><Ionicons name="school" size={22} color={Colors.primary} /></View>
              <Text style={styles.tileLabel} numberOfLines={2}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Lessons & Resources</Text>
        <View style={styles.grid}>
          {SHORTCUTS.map((sc) => (
            <TouchableOpacity
              key={sc.label}
              style={styles.tile}
              onPress={() => navigation.navigate('Materials', { typeFilter: sc.typeFilter })}
              activeOpacity={0.8}
            >
              <View style={[styles.tileIcon, { backgroundColor: sc.color + '18' }]}>
                <Ionicons name={sc.icon} size={22} color={sc.color} />
              </View>
              <Text style={styles.tileLabel}>{sc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginHorizontal: Spacing.md, marginTop: Spacing.md, marginBottom: Spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.sm },
  tile: { width: '30%', margin: '1.5%', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', elevation: 1, minHeight: 90, justifyContent: 'center' },
  tileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tileLabel: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.text, textAlign: 'center' },
});
