import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Card, Btn, Loader, Badge, SectionHeader } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';

type ConceptPerformance = {
  topic_id: number;
  topic_title: string;
  subject_name: string;
  concept: string;
  attempts: number;
  correct_attempts: number;
  accuracy: number | string;
  last_attempt_at?: string | null;
};

type Remediation = {
  id: string;
  topic_id: number;
  topic_title: string;
  concept: string;
  recommendation: string;
  status: string;
  accuracy: number | string;
  updated_at?: string;
};

const EMPTY_PROGRESS = { concept_performance: [], remediation_recommendations: [] };

export default function StudentPracticeProgressScreen({ navigation }: any) {
  const [progress, setProgress] = useState<any>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/class-practice/progress');
      setProgress({
        concept_performance: Array.isArray(data?.concept_performance) ? data.concept_performance : [],
        remediation_recommendations: Array.isArray(data?.remediation_recommendations) ? data.remediation_recommendations : [],
      });
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Your practice progress could not be loaded. Check your connection and retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const concepts: ConceptPerformance[] = progress.concept_performance ?? [];
  const recommendations: Remediation[] = progress.remediation_recommendations ?? [];
  const averageAccuracy = concepts.length
    ? Math.round(concepts.reduce((sum, item) => sum + Number(item.accuracy || 0), 0) / concepts.length * 100)
    : 0;
  const totalAttempts = concepts.reduce((sum, item) => sum + Number(item.attempts || 0), 0);

  if (loading) return <Loader />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} />}
    >
      <Card>
        <SectionHeader title="My Practice Progress" />
        <Text style={styles.intro}>See what you have practised, how your understanding is improving, and which lesson concepts need another look.</Text>
        {error ? (
          <View>
            <Text style={styles.error}>{error}</Text>
            <Btn label="Retry" variant="outline" onPress={() => { setLoading(true); void load(); }} style={{ marginTop: Spacing.sm }} />
          </View>
        ) : (
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{concepts.length}</Text>
              <Text style={styles.statLabel}>Concepts practised</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalAttempts}</Text>
              <Text style={styles.statLabel}>Question attempts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{averageAccuracy}%</Text>
              <Text style={styles.statLabel}>Average accuracy</Text>
            </View>
          </View>
        )}
      </Card>

      {!error && (
        <>
          <Card style={{ marginTop: Spacing.md }}>
            <SectionHeader title="Concepts you have practised" />
            {concepts.length === 0 ? (
              <Text style={styles.muted}>You have not completed an adaptive practice set yet. Finish a lesson, then open Adaptive AI Practice to begin.</Text>
            ) : concepts.map((item, index) => {
              const accuracy = Math.max(0, Math.min(100, Math.round(Number(item.accuracy || 0) * 100)));
              return (
                <View key={String(item.topic_id) + ':' + item.concept} style={[styles.conceptRow, index > 0 && styles.divider]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.conceptName}>{item.concept}</Text>
                    <Text style={styles.meta}>{item.topic_title} · {item.subject_name} · {item.attempts} attempts</Text>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: accuracy + '%' }]} />
                    </View>
                  </View>
                  <Badge label={accuracy + '%'} color={accuracy >= 70 ? Colors.success : Colors.warning} />
                </View>
              );
            })}
          </Card>

          <Card style={{ marginTop: Spacing.md }}>
            <SectionHeader title="Recommended revision" />
            {recommendations.length === 0 ? (
              <View style={styles.emptyRow}>
                <Ionicons name="checkmark-circle-outline" size={22} color={Colors.success} />
                <Text style={styles.muted}>No outstanding revision recommendations. Keep practising to maintain your progress.</Text>
              </View>
            ) : recommendations.map((item, index) => (
              <View key={item.id} style={[styles.recommendation, index > 0 && styles.divider]}>
                <Ionicons name="book-outline" size={20} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.conceptName}>{item.concept}</Text>
                  <Text style={styles.meta}>{item.topic_title}</Text>
                  <Text style={styles.recommendationText}>{item.recommendation}</Text>
                </View>
                <Badge label={Math.round(Number(item.accuracy || 0) * 100) + '%'} color={Colors.warning} />
              </View>
            ))}
          </Card>
        </>
      )}

      <Btn
        label="Go to my lessons"
        onPress={() => navigation.getParent()?.navigate('LearningTab')}
        style={{ marginTop: Spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  intro: { color: Colors.textSub, fontSize: Fonts.sizes.sm, lineHeight: 21 },
  stats: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  stat: { flex: 1, backgroundColor: Colors.background, borderRadius: Radius.md, padding: Spacing.sm },
  statValue: { color: Colors.primary, fontSize: Fonts.sizes.xl, fontWeight: '800', textAlign: 'center' },
  statLabel: { color: Colors.textSub, fontSize: Fonts.sizes.xs, textAlign: 'center', marginTop: 3 },
  conceptRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  conceptName: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '700' },
  meta: { color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 3 },
  track: { height: 6, borderRadius: 3, backgroundColor: Colors.border, marginTop: Spacing.sm, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  divider: { borderTopWidth: 1, borderTopColor: Colors.border },
  recommendation: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: Spacing.sm },
  recommendationText: { color: Colors.text, fontSize: Fonts.sizes.sm, lineHeight: 20, marginTop: Spacing.xs },
  emptyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  muted: { flex: 1, color: Colors.textSub, fontSize: Fonts.sizes.sm, lineHeight: 20 },
  error: { color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: Spacing.sm },
});
