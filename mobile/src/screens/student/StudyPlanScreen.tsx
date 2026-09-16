import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, RefreshControl } from 'react-native';
import api from '../../api/client';
import { Card, Loader, Empty, Btn, Input } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';

interface StudySubject {
  subject_id: number;
  name: string;
  included: boolean;
  avg_score: number | null;
  allocated_minutes: number;
}

export default function StudyPlanScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyMinutes, setDailyMinutes] = useState('120');
  const [savingMinutes, setSavingMinutes] = useState(false);
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/learning/study-plan');
      setDailyMinutes(String(data.daily_minutes));
      setSubjects(data.subjects ?? []);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not load your study plan.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveMinutes = async () => {
    const minutes = Number(dailyMinutes);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 960) {
      setError('Enter a whole number of minutes between 1 and 960.');
      return;
    }
    setSavingMinutes(true);
    try {
      await api.put('/learning/study-plan/settings', { daily_minutes: minutes });
      await load(); // re-fetch so every subject's allocated_minutes reflects the new total
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not save.');
    } finally {
      setSavingMinutes(false);
    }
  };

  const toggleSubject = async (subjectId: number, next: boolean) => {
    setTogglingId(subjectId);
    // Optimistic flip so the switch feels instant; allocated_minutes across
    // every subject is re-derived from the server right after, since a
    // single toggle changes everyone else's share too.
    setSubjects(prev => prev.map(s => s.subject_id === subjectId ? { ...s, included: next } : s));
    try {
      await api.put(`/learning/study-plan/subjects/${subjectId}`, { included: next });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not update that subject.');
      await load(); // roll back the optimistic flip to the real server state
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: Spacing.md }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <Card style={{ marginBottom: Spacing.md }}>
        <Text style={styles.introText}>
          Brainee splits your daily study time across your subjects automatically —
          subjects you're scoring lower in get more time, so nothing gets left behind.
        </Text>
      </Card>

      <Card style={{ marginBottom: Spacing.md }}>
        <Text style={styles.label}>How many minutes can you study per day?</Text>
        <View style={styles.minutesRow}>
          <Input
            value={dailyMinutes}
            onChangeText={setDailyMinutes}
            keyboardType="numeric"
            style={{ flex: 1, marginBottom: 0 }}
          />
          <Btn label="Save" onPress={saveMinutes} loading={savingMinutes} style={{ paddingHorizontal: Spacing.md }} />
        </View>
      </Card>

      {error && (
        <Card style={{ marginBottom: Spacing.md, backgroundColor: Colors.error + '12' }}>
          <Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm }}>{error}</Text>
        </Card>
      )}

      <Text style={styles.sectionLabel}>Your Subjects</Text>
      {subjects.length === 0 && <Empty message="No subjects found for your class yet." />}

      {subjects.map((s) => (
        <Card key={s.subject_id} style={styles.subjectRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subjectName}>{s.name}</Text>
            <Text style={styles.subjectMeta}>
              {s.avg_score != null ? `Recent score: ${s.avg_score}%` : 'No score yet'}
              {s.included && s.allocated_minutes > 0 ? `  ·  ${s.allocated_minutes} min/day` : ''}
            </Text>
          </View>
          <Switch
            value={s.included}
            disabled={togglingId === s.subject_id}
            onValueChange={(next) => toggleSubject(s.subject_id, next)}
            trackColor={{ true: Colors.primary }}
          />
        </Card>
      ))}

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  introText: { fontSize: Fonts.sizes.sm, color: Colors.textSub, lineHeight: 20 },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs },
  minutesRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  sectionLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginBottom: Spacing.xs },
  subjectRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  subjectName: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  subjectMeta: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
