import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import api from '../api/client';
import { Card, Loader, Empty, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

export default function AssessmentResultsScreen({ route, navigation }: any) {
  const { assessmentId } = route.params as { assessmentId: string };
  const [results,   setResults]   = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  const fetch = async () => {
    try {
      const { data } = await api.get(`/learning/assessments/${assessmentId}/results`);
      setResults(data.results);
    } catch { } finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { fetch(); }, []);

  const avg = results.length
    ? (results.reduce((s, r) => s + Number(r.total_score ?? 0), 0) / results.length).toFixed(1)
    : 0;
  const high = results.length ? Math.max(...results.map(r => Number(r.total_score ?? 0))) : 0;
  const low  = results.length ? Math.min(...results.map(r => Number(r.total_score ?? 0))) : 0;

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Summary strip */}
      {results.length > 0 && (
        <View style={styles.strip}>
          {[
            { label: 'Submissions', val: results.length },
            { label: 'Average',     val: avg },
            { label: 'Highest',     val: high },
            { label: 'Lowest',      val: low },
          ].map(s => (
            <View key={s.label} style={styles.chip}>
              <Text style={styles.chipVal}>{s.val}</Text>
              <Text style={styles.chipLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={r => r.id}
        contentContainerStyle={{ padding: Spacing.sm }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
        ListEmptyComponent={<Empty message="No submissions yet" />}
        renderItem={({ item: r, index }) => {
          const score = Number(r.total_score ?? 0);
          const pct   = r.total_marks ? Math.round(score / r.total_marks * 100) : 0;
          const pendingCount = Number(r.pending_essay_count ?? 0);
          return (
            <TouchableOpacity onPress={() => navigation.navigate('EssayAnswerReview', { submissionId: r.id })} activeOpacity={0.8}>
              <Card style={styles.resultRow}>
                <View style={styles.rank}>
                  <Text style={styles.rankNum}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{r.student_name}</Text>
                  <Text style={styles.meta}>{r.class_name}</Text>
                  <Text style={styles.sub}>{r.submitted_at ? `Submitted: ${new Date(r.submitted_at).toLocaleString()}` : ''}</Text>
                  {pendingCount > 0 && (
                    <View style={{ marginTop: Spacing.xs, alignSelf: 'flex-start' }}>
                      <Badge label={`${pendingCount} needs grading`} color={Colors.error} />
                    </View>
                  )}
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreVal}>{score}</Text>
                  <Text style={styles.scorePct}>{pct}%</Text>
                  {r.fully_graded === false && (
                    <Text style={styles.notFinal}>Not final yet</Text>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  strip:      { flexDirection: 'row', backgroundColor: Colors.primary, padding: Spacing.md, gap: Spacing.sm },
  chip:       { flex: 1, alignItems: 'center' },
  chipVal:    { color: Colors.white, fontWeight: '800', fontSize: Fonts.sizes.lg },
  chipLabel:  { color: Colors.white + 'BB', fontSize: Fonts.sizes.xs },
  resultRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rank:       { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  rankNum:    { fontWeight: '800', color: Colors.primary, fontSize: Fonts.sizes.sm },
  name:       { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  meta:       { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  sub:        { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  scoreBox:   { alignItems: 'center' },
  notFinal:   { fontSize: 10, color: Colors.error, marginTop: 2 },
  scoreVal:   { fontSize: Fonts.sizes.xl, fontWeight: '900', color: Colors.primary },
  scorePct:   { fontSize: Fonts.sizes.xs, color: Colors.textSub },
});
