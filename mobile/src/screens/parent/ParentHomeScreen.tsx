import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { useWards } from '../../api/WardContext';
import { useNotifications } from '../../components/NotificationsContext';
import { Card, Loader, Btn } from '../../components/UI';
import { PageContainer, StatChipRow, StatChip } from '../../components/layout';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { FAB } from '../../components/FAB';
import { openNotifications } from '../../navigation/navigationRef';

export default function ParentHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { wards, selectedWardId, selectWard, loading: wardsLoading } = useWards();
  const { notifications, refresh: refreshNotifications, announcementsLoaded, announcementsError } = useNotifications();
  const announcements = notifications.filter(n => n.kind === 'announcement').slice(0, 3);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!selectedWardId) {
      // Announcements are account-scoped, not ward-scoped. Refresh them even
      // when no child is linked/selected so the dashboard's retry message works.
      setReport(null);
      setReportError('');
      await refreshNotifications();
      setLoading(false);
      return;
    }
    setReportLoading(true);
    setReportError('');
    setReport(null);
    try {
      const { data } = await api.get(`/scores/report/${selectedWardId}`);
      setReport(data);
    } catch (e: any) {
      setReportError(e?.response?.data?.error ?? 'Could not load this child’s report. Check your connection and retry.');
    } finally {
      setReportLoading(false);
    }
    await refreshNotifications();
    setLoading(false);
  }, [selectedWardId, refreshNotifications]);

  useEffect(() => { load(); }, [load]);

  if (wardsLoading || loading) return <Loader />;

  const selectedWard = wards.find(w => w.id === selectedWardId);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={selectedWard ? `Viewing ${selectedWard.full_name}` : 'No child selected'}
        onPressBell={() => openNotifications()}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <PageContainer>
        {wards.length > 0 ? (
          <View style={styles.wardSection}>
            <Text style={styles.sectionLabel}>Your Children</Text>
            <View style={styles.wardRow}>
              {wards.map(w => {
                const active = w.id === selectedWardId;
                return (
                  <TouchableOpacity key={w.id} style={[styles.wardChip, active && styles.wardChipActive]} onPress={() => selectWard(w.id)} activeOpacity={0.8}>
                    <Text style={[styles.wardChipText, active && styles.wardChipTextActive]} numberOfLines={1}>{w.full_name}</Text>
                    <Text style={[styles.wardChipSub, active && styles.wardChipTextActive]} numberOfLines={1}>{w.class_name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.wardSection}>
            <Text style={styles.hint}>No children are linked to your account yet. Contact the school admin.</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Child Summary</Text>
        {reportError ? (
          <Card style={{ marginHorizontal: Spacing.md }}>
            <Text style={styles.hint}>{reportError}</Text>
            <Btn label="Retry report" variant="outline" onPress={() => load()} style={{ marginTop: Spacing.sm }} />
          </Card>
        ) : reportLoading ? (
          <Card style={{ marginHorizontal: Spacing.md }}><Text style={styles.hint}>Loading this child’s report…</Text></Card>
        ) : report?.summary ? (
          <StatChipRow>
            <StatChip value={report.summary.average ?? '—'} label="Average" />
            <StatChip value={report.attendance?.days_present ?? '—'} label="Days Present" />
          </StatChipRow>
        ) : (
          <Card style={{ marginHorizontal: Spacing.md }}>
            <Text style={styles.hint}>No report data yet for this term.</Text>
          </Card>
        )}

        <Text style={styles.sectionLabel}>School Announcements</Text>
        {announcementsError ? (
          <Card style={{ marginHorizontal: Spacing.md }}>
            <Text style={styles.hint}>{announcements.length ? 'Could not refresh announcements. Showing the last available notices.' : 'Could not load announcements. Pull down to retry.'}</Text>
          </Card>
        ) : null}
        {!announcementsError && !announcementsLoaded ? (
          <Card style={{ marginHorizontal: Spacing.md }}><Text style={styles.hint}>Loading announcements…</Text></Card>
        ) : null}
        {!announcementsError && announcementsLoaded && announcements.length === 0 ? (
          <Card style={{ marginHorizontal: Spacing.md }}>
            <Text style={styles.hint}>No announcements yet. Your school admin can post updates here.</Text>
          </Card>
        ) : null}
        {announcements.map(item => (
          <Card key={item.id} style={{ marginHorizontal: Spacing.md }}>
            <Text style={styles.announcementTitle}>{item.title}</Text>
            <Text style={styles.hint}>{item.body}</Text>
            <Text style={styles.announcementDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </Card>
        ))}
        </PageContainer>

        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>

      <FAB
        icon="add"
        actions={[
          { icon: 'chatbubble-outline', label: 'Message teacher', onPress: () => navigation.getParent()?.navigate('ChatsTab') },
          { icon: 'document-text-outline', label: 'View report', onPress: () => navigation.getParent()?.navigate('ProgressTab') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginHorizontal: Spacing.md, marginTop: Spacing.md, marginBottom: Spacing.xs },
  wardSection: { paddingHorizontal: Spacing.md },
  wardRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  wardChip: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, minWidth: 110 },
  wardChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  wardChipText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  wardChipSub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 1 },
  wardChipTextActive: { color: Colors.white },
  hint: { fontSize: Fonts.sizes.sm, color: Colors.textSub },
  announcementTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  announcementDate: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 6 },
});
