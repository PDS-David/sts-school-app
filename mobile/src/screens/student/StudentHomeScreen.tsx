import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { Card, Loader } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { FAB } from '../../components/FAB';
import { openNotifications, openBraineeChat } from '../../navigation/navigationRef';

export default function StudentHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [recentScores, setRecentScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [a, m] = await Promise.all([
        api.get('/learning/assessments'),
        api.get('/learning/materials'),
      ]);
      setTasks((a.data.assessments ?? []).filter((x: any) => x.status === 'open').slice(0, 4));
      setMaterials((m.data.materials ?? []).slice(0, 4));
    } catch { /* offline — sections below just show what's cached/empty */ }
    try {
      const s = await api.get('/students/me');
      // See the matching comment in MyResultsScreen.tsx — students.user_id
      // is UNIQUE at the DB level, this is just a canary.
      if (s.data.students?.length > 1) {
        console.warn('[StudentHomeScreen] /students/me returned more than one linked student — using the first.');
      }
      const mine = s.data.students?.[0];
      if (mine) {
        const r = await api.get(`/scores/report/${mine.id}`);
        setRecentScores((r.data.scores ?? []).slice(0, 3));
      }
    } catch { /* no linked student record yet, or offline */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle="Here's what's happening today"
        onPressBell={() => openNotifications()}
      />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
      >
        <PageContainer>
        {/* Today's tasks */}
        <Text style={styles.sectionLabel}>Today's Tasks</Text>
        {tasks.length === 0 ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>Nothing due right now — you're all caught up.</Text></Card>
        ) : tasks.map((t) => (
          <TouchableOpacity key={t.id} onPress={() => navigation.navigate('AssessmentsTab', { screen: 'Assessments' })}>
            <Card style={styles.rowCard}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.warning + '20' }]}>
                <Ionicons name="clipboard" size={20} color={Colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{t.title}</Text>
                <Text style={styles.rowMeta}>{t.type ?? 'Assessment'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
            </Card>
          </TouchableOpacity>
        ))}

        {/* Announcements */}
        <Text style={styles.sectionLabel}>Announcements</Text>
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No announcements yet. Your school admin can post updates here.</Text>
        </Card>

        {/* Continue learning */}
        <Text style={styles.sectionLabel}>Continue Learning</Text>
        {materials.length === 0 ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>No materials uploaded yet.</Text></Card>
        ) : materials.map((m) => (
          <TouchableOpacity key={m.id} onPress={() => navigation.navigate('LearningTab', { screen: 'Materials' })}>
            <Card style={styles.rowCard}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="book" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{m.title}</Text>
                <Text style={styles.rowMeta}>{m.subject_name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
            </Card>
          </TouchableOpacity>
        ))}

        {/* Recent activity */}
        <Text style={styles.sectionLabel}>Recent Activity</Text>
        {recentScores.length === 0 ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>No graded scores yet this term.</Text></Card>
        ) : recentScores.map((s, i) => (
          <Card key={i} style={styles.rowCard}>
            <View style={[styles.rowIcon, { backgroundColor: Colors.success + '20' }]}>
              <Ionicons name="bar-chart" size={20} color={Colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{s.subject_name}</Text>
              <Text style={styles.rowMeta}>Grade {s.grade ?? '—'}</Text>
            </View>
          </Card>
        ))}

        </PageContainer>
        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>

      <FAB
        icon="add"
        actions={[
          { icon: 'sparkles-outline', label: 'Ask Brainee', onPress: () => openBraineeChat() },
          { icon: 'chatbox-ellipses-outline', label: 'Start discussion', onPress: () => navigation.getParent()?.navigate('ChatsTab') },
          { icon: 'create-outline', label: 'New message', onPress: () => navigation.getParent()?.navigate('ChatsTab') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginHorizontal: Spacing.md, marginTop: Spacing.md, marginBottom: Spacing.xs },
  emptyCard: { marginHorizontal: Spacing.md },
  emptyText: { color: Colors.textSub, fontSize: Fonts.sizes.sm },
  rowCard: { marginHorizontal: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  rowMeta: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
