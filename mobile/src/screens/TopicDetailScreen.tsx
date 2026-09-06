import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Loader, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

// POST /learning/topics/:id/complete is excluded from the offline outbox
// (see api/client.ts) — it needs a live round trip and fails immediately,
// honestly, when offline. Once it's been called successfully at least once
// for a topic, though, the resulting `summary` comes back on every GET
// /learning/topics (a normal cached GET), so re-reading an
// already-completed topic works fully offline from then on.
export default function TopicDetailScreen({ route, navigation }: any) {
  const { topic: initialTopic } = route.params as { topic: any };
  const [topic, setTopic]           = useState(initialTopic);
  const [loading, setLoading]       = useState(false);
  const [practice, setPractice]     = useState<any[]>([]);
  const [revealed, setRevealed]     = useState<Record<number, boolean>>({});
  const [assessmentStatus, setAssessmentStatus] = useState<string | null>(null);
  const [note, setNote]             = useState<string | undefined>(undefined);
  const [summaryIsFallback, setSummaryIsFallback] = useState(false);

  const complete = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/learning/topics/${topic.id}/complete`);
      setTopic((t: any) => ({ ...t, summary: data.summary }));
      setSummaryIsFallback(!!data.summary_is_fallback);
      setPractice(data.practice_questions ?? []);
      setAssessmentStatus(data.assessment_status ?? null);
      setNote(data.note);
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      Alert.alert(
        'Could not load this topic',
        msg ?? "You're offline — getting a new topic's study notes needs a connection. Try again once you're back online.",
      );
    } finally {
      setLoading(false);
    }
  };

  const takeAssessment = () => {
    // TakeAssessment lives in the Assessments tab's own stack, not the
    // Learning stack this screen is in — explicit nested navigation here
    // rather than a bare navigate('TakeAssessment', ...), which isn't
    // reliably guaranteed to resolve across sibling tab stacks.
    navigation.navigate('AssessmentsTab', {
      screen: 'TakeAssessment',
      params: {
        assessmentId: topic.generated_assessment_id,
        title: `${topic.title} — Topic Assessment`,
      },
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: Spacing.md }}>
      <Card>
        <SectionHeader title={topic.title} />
        {topic.description ? <Text style={styles.desc}>{topic.description}</Text> : null}

        {topic.summary ? (
          <View style={{ marginTop: Spacing.sm }}>
            <Text style={styles.summaryLabel}>Study Notes</Text>
            {summaryIsFallback && (
              <View style={styles.fallbackBox}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.textSub} />
                <Text style={styles.fallbackText}>
                  We couldn't generate a polished lesson right now, so here's the school's
                  original curriculum note for this topic instead. Try again later for the
                  full write-up.
                </Text>
              </View>
            )}
            <Text style={styles.summaryText}>{topic.summary}</Text>
          </View>
        ) : (
          <Btn
            label={loading ? 'Loading…' : 'Get Study Notes'}
            onPress={complete}
            loading={loading}
            style={{ marginTop: Spacing.sm }}
          />
        )}

        {note && (
          <View style={styles.noteBox}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        )}
      </Card>

      {(assessmentStatus === 'open' || topic.generated_assessment_id) && (
        <Btn
          label="Take Topic Assessment"
          onPress={takeAssessment}
          style={{ marginTop: Spacing.md }}
        />
      )}

      {practice.length > 0 && (
        <Card style={{ marginTop: Spacing.md }}>
          <SectionHeader title="Practice Questions" />
          <Text style={styles.practiceHint}>Just for your own revision — these aren't graded.</Text>
          {practice.map((q: any, i: number) => (
            <View key={i} style={styles.practiceQ}>
              <Text style={styles.stem}>{i + 1}. {q.stem}</Text>
              {(q.options ?? []).map((o: any) => (
                <Text
                  key={o.key}
                  style={[
                    styles.option,
                    revealed[i] && (q.correct_keys ?? []).includes(o.key) && styles.correctOption,
                  ]}
                >
                  {o.key}. {o.text}
                </Text>
              ))}
              <TouchableOpacity onPress={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}>
                <Text style={styles.revealTxt}>{revealed[i] ? 'Hide answer' : 'Reveal answer'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      )}

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  desc: { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 4 },
  summaryLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  fallbackBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: Colors.textSub + '15', padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.sm },
  fallbackText: { fontSize: Fonts.sizes.xs, color: Colors.textSub, flex: 1, lineHeight: 16 },
  summaryText: { fontSize: Fonts.sizes.sm, color: Colors.text, lineHeight: 20 },
  noteBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm, backgroundColor: Colors.success + '15', padding: Spacing.sm, borderRadius: Radius.sm },
  noteText: { fontSize: Fonts.sizes.xs, color: Colors.text, flex: 1 },
  practiceHint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, fontStyle: 'italic', marginBottom: Spacing.sm },
  practiceQ: { marginBottom: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  stem: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  option: { fontSize: Fonts.sizes.sm, color: Colors.text, paddingVertical: 2 },
  correctOption: { color: Colors.success, fontWeight: '700' },
  revealTxt: { fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: '700', marginTop: 4 },
});
