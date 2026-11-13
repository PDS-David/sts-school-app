import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { useNotifications } from '../../components/NotificationsContext';
import { Card, Btn, Loader } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { FAB } from '../../components/FAB';
import { openNotifications, openBraineeChat, openTextStudy } from '../../navigation/navigationRef';

export default function StudentHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { notifications, refresh: refreshNotifications, announcementsLoaded, announcementsError } = useNotifications();
  const announcements = notifications.filter(n => n.kind === 'announcement').slice(0, 3);
  const [tasks, setTasks] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [recentScores, setRecentScores] = useState<any[]>([]);
  const [tasksError, setTasksError] = useState('');
  const [materialsError, setMaterialsError] = useState('');
  const [scoresError, setScoresError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setTasksError('');
    setMaterialsError('');
    setScoresError('');
    try {
      const { data } = await api.get('/learning/assessments');
      setTasks((data.assessments ?? []).filter((x: any) => x.status === 'open').slice(0, 4));
    } catch (e: any) {
      setTasksError(e?.response?.data?.error ?? 'Could not refresh open assessments.');
    }
    try {
      const { data } = await api.get('/learning/materials');
      setMaterials((data.materials ?? []).slice(0, 4));
    } catch (e: any) {
      setMaterialsError(e?.response?.data?.error ?? 'Could not refresh learning materials.');
    }
    try {
      const s = await api.get('/students/me');
      if (s.data.students?.length > 1) {
        console.warn('[StudentHomeScreen] /students/me returned more than one linked student — using the first.');
      }
      const mine = s.data.students?.[0];
      if (!mine) {
        setRecentScores([]);
        setScoresError('No student record is linked to this account yet. Contact the school administrator.');
      } else {
        const r = await api.get(`/scores/report/${mine.id}`);
        setRecentScores((r.data.scores ?? []).slice(0, 3));
      }
    } catch (e: any) {
      setScoresError(e?.response?.data?.error ?? 'Could not load recent results.');
    }
    await refreshNotifications();
    setLoading(false);
  }, [refreshNotifications]);

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
        {tasksError ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{tasks.length ? 'Could not refresh assessments. Showing the last available list.' : tasksError}</Text>
            <Btn label="Retry dashboard" variant="outline" onPress={() => load()} style={{ marginTop: Spacing.sm }} />
          </Card>
        ) : tasks.length === 0 ? (
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

        <Text style={styles.sectionLabel}>Learning Materials</Text>
        {materialsError ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{materials.length ? 'Could not refresh materials. Showing the last available items.' : materialsError}</Text>
            <Btn label="Retry materials" variant="outline" onPress={() => load()} style={{ marginTop: Spacing.sm }} />
          </Card>
        ) : materials.length === 0 ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>No learning materials are available yet.</Text></Card>
        ) : materials.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => navigation.getParent()?.navigate('LearningTab', { screen: 'Materials' })}>
            <Card style={styles.rowCard}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.primary + '18' }]}><Ionicons name="book" size={20} color={Colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowMeta}>{item.subject_name ?? item.type ?? 'Learning resource'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
            </Card>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Recent Results</Text>
        {scoresError ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{recentScores.length ? 'Could not refresh results. Showing the last available marks.' : scoresError}</Text>
            <Btn label="Retry results" variant="outline" onPress={() => load()} style={{ marginTop: Spacing.sm }} />
          </Card>
        ) : recentScores.length === 0 ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>No scores have been published yet.</Text></Card>
        ) : recentScores.map((score) => (
          <TouchableOpacity key={score.subject_id} onPress={() => navigation.navigate('AssessmentsTab', { screen: 'MyResults' })}>
            <Card style={styles.rowCard}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.success + '20' }]}><Ionicons name="bar-chart" size={20} color={Colors.success} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{score.subject_name}</Text>
                <Text style={styles.rowMeta}>Total: {score.total ?? '—'} · Grade: {score.grade ?? '—'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
            </Card>
          </TouchableOpacity>
        ))}

        {/* Announcements are loaded from the school/class/role-scoped API feed. */}
        <Text style={styles.sectionLabel}>Announcements</Text>
        {announcementsError ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{announcements.length ? 'Could not refresh announcements. Showing the last available notices.' : 'Could not load announcements. Pull down to retry.'}</Text>
          </Card>
        ) : null}
        {!announcementsError && !announcementsLoaded ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>Loading announcements…</Text></Card>
        ) : null}
        {!announcementsError && announcementsLoaded && announcements.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No announcements yet. Your school admin can post updates here.</Text>
          </Card>
        ) : null}
        {announcements.map(item => (
          <Card key={item.id} style={styles.emptyCard}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.emptyText}>{item.body}</Text>
            <Text style={styles.rowMeta}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </Card>
        ))}
        </PageContainer>
        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>

      <FAB
        icon="add"
        actions={[
          { icon: 'sparkles-outline', label: 'Ask Brainee', onPress: () => openBraineeChat() },
          { icon: 'book-outline', label: 'Study my text', onPress: () => openTextStudy() },
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
