import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import api from '../api/client';
import { Card, Loader, Btn, Input, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

interface Answer {
  id: number;
  question_id: number;
  question_type: 'mcq' | 'essay';
  stem: string;
  selected_key: string | null;
  answer_text: string | null;
  max_points: string;
  awarded_points: string | null;
  ai_suggested_points: string | null;
  ai_feedback: string | null;
  grading_status: 'auto' | 'ai_graded' | 'teacher_reviewed' | 'ai_unavailable';
}

export default function EssayAnswerReviewScreen({ route }: any) {
  const { submissionId } = route.params as { submissionId: string };
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/learning/submissions/${submissionId}/answers`);
      setAnswers(data.answers ?? []);
    } catch { /* offline or error — screen just stays empty */ }
    setLoading(false);
    setRefreshing(false);
  }, [submissionId]);

  useEffect(() => { load(); }, [load]);

  const save = async (answer: Answer) => {
    const raw = drafts[answer.id] ?? answer.awarded_points ?? answer.ai_suggested_points ?? '0';
    const points = Math.max(0, Math.min(Number(answer.max_points), Number(raw) || 0));
    setSaving(answer.id);
    try {
      await api.put(`/learning/submissions/${submissionId}/answers/${answer.id}/review`, { awarded_points: points });
      await load();
    } catch { /* keep the draft on screen so the teacher can retry */ }
    setSaving(null);
  };

  const acceptSuggestion = (answer: Answer) => {
    setDrafts((d) => ({ ...d, [answer.id]: answer.ai_suggested_points ?? '0' }));
    save({ ...answer, awarded_points: answer.ai_suggested_points });
  };

  if (loading) return <Loader />;

  return (
    <ScrollView
      contentContainerStyle={{ padding: Spacing.md }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      {answers.map((a) => (
        <Card key={a.id} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.stem}>{a.stem}</Text>
            {a.question_type === 'mcq' ? (
              <Badge label="MCQ · Auto" color={Colors.success} />
            ) : a.grading_status === 'teacher_reviewed' ? (
              <Badge label="Reviewed" color={Colors.success} />
            ) : a.grading_status === 'ai_unavailable' ? (
              <Badge label="Needs grading" color={Colors.error} />
            ) : (
              <Badge label="Brainee suggested" color={Colors.accent} />
            )}
          </View>

          {a.question_type === 'mcq' ? (
            <Text style={styles.meta}>
              Selected: {a.selected_key ?? '—'} · Score: {a.awarded_points ?? 0}/{a.max_points}
            </Text>
          ) : (
            <>
              <Text style={styles.answerText}>{a.answer_text || '(no answer submitted)'}</Text>

              {a.grading_status === 'ai_unavailable' && (
                <Text style={styles.warnText}>
                  Brainee couldn't grade this one automatically — please grade it yourself below.
                </Text>
              )}
              {a.ai_feedback && a.grading_status !== 'teacher_reviewed' && (
                <Text style={styles.aiFeedback}>Brainee's note: {a.ai_feedback}</Text>
              )}
              {a.ai_suggested_points != null && a.grading_status !== 'teacher_reviewed' && (
                <Text style={styles.meta}>Brainee's suggestion: {a.ai_suggested_points}/{a.max_points}</Text>
              )}

              <View style={styles.gradeRow}>
                <Input
                  value={drafts[a.id] ?? a.awarded_points ?? a.ai_suggested_points ?? ''}
                  onChangeText={(v) => setDrafts((d) => ({ ...d, [a.id]: v }))}
                  placeholder={`0 - ${a.max_points}`}
                  keyboardType="numeric"
                  style={{ width: 90 }}
                />
                <Btn label="Save score" onPress={() => save(a)} loading={saving === a.id} style={{ flex: 1 }} />
              </View>
              {a.grading_status === 'ai_graded' && (
                <Btn
                  label={`Accept Brainee's ${a.ai_suggested_points}/${a.max_points}`}
                  onPress={() => acceptSuggestion(a)}
                  variant="outline"
                  loading={saving === a.id}
                  style={{ marginTop: Spacing.xs }}
                />
              )}
            </>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm },
  stem: { flex: 1, fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  meta: { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: Spacing.xs },
  answerText: { fontSize: Fonts.sizes.sm, color: Colors.text, marginTop: Spacing.sm, lineHeight: 20 },
  warnText: { fontSize: Fonts.sizes.xs, color: Colors.error, marginTop: Spacing.xs },
  aiFeedback: { fontSize: Fonts.sizes.xs, color: Colors.accent, marginTop: Spacing.xs, fontStyle: 'italic' },
  gradeRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, alignItems: 'center' },
});
