import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { useWards } from '../../api/WardContext';
import { Card, Loader } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { FAB } from '../../components/FAB';
import { openNotifications } from '../../navigation/navigationRef';

export default function ParentHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { wards, selectedWardId, selectWard, loading: wardsLoading } = useWards();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!selectedWardId) { setLoading(false); return; }
    try {
      const { data } = await api.get(`/scores/report/${selectedWardId}`);
      setReport(data);
    } catch { /* offline or not yet loaded */ }
    setLoading(false);
  }, [selectedWardId]);

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
        {report?.summary ? (
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statVal}>{report.summary.average ?? '—'}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statVal}>{report.attendance?.days_present ?? '—'}</Text>
              <Text style={styles.statLabel}>Days Present</Text>
            </View>
          </View>
        ) : (
          <Card style={{ marginHorizontal: Spacing.md }}>
            <Text style={styles.hint}>No report data yet for this term.</Text>
          </Card>
        )}

        <Text style={styles.sectionLabel}>School Announcements</Text>
        <Card style={{ marginHorizontal: Spacing.md }}>
          <Text style={styles.hint}>No announcements yet. Your school admin can post updates here.</Text>
        </Card>

        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>

      <FAB
        icon="add"
        actions={[
          { icon: 'chatbubble-outline', label: 'Message teacher', onPress: () => navigation.getParent()?.navigate('ChatsTab') },
          { icon: 'alert-circle-outline', label: 'Report absence', onPress: () => navigation.getParent()?.navigate('ChatsTab') },
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
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.sm },
  statChip: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', elevation: 1 },
  statVal: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
