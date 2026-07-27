import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Loader, Empty, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

interface Question {
  id: number;
  stem: string;
  type: string;
  options: Array<{ key: string; text: string }>;
  points: number;
}

export default function TakeAssessmentScreen({ route, navigation }: any) {
  const { assessmentId, title } = route.params as { assessmentId: string; title: string };

  const [questions,  setQuestions]  = useState<Question[]>([]);
  const [answers,    setAnswers]    = useState<Record<number, string>>({});
  const [loading,    setLoading]    = useState(true);
  const [loadError,  setLoadError]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [result,     setResult]     = useState<any>(null);
  const [current,    setCurrent]    = useState(0);

  useEffect(() => {
    // Found in QA Pass 6: this used to call the unrelated, unscoped
    // GET /learning/questions (which 403s for students — questions.read is
    // admin-only) and slice the first 20 results, with no actual
    // connection to this assessment. GET /learning/assessments/:id/questions
    // now returns the real, ordered question set (answers stripped) for
    // exactly this assessment.
    api.get(`/learning/assessments/${assessmentId}/questions`)
      .then(({ data }) => {
        setQuestions(data.questions ?? []);
        setLoading(false);
      })
      .catch((e) => {
        setLoadError(e?.response?.data?.error ?? 'Could not load this assessment');
        setLoading(false);
      });
  }, [assessmentId]);

  const select = (questionId: number, key: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: key }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => !answers[q.id]).length;
    if (unanswered > 0) {
      Alert.alert(
        'Unanswered Questions',
        `You have ${unanswered} unanswered question(s). Submit anyway?`,
        [
          { text: 'Review', style: 'cancel' },
          { text: 'Submit', style: 'destructive', onPress: doSubmit },
        ],
      );
    } else {
      Alert.alert('Submit Assessment', 'Are you sure you want to submit?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: doSubmit },
      ]);
    }
  };

  const doSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: Record<string, string> = {};
      Object.entries(answers).forEach(([qId, key]) => { payload[qId] = key; });
      const { data } = await api.post(`/learning/assessments/${assessmentId}/submit`, { answers: payload });
      setResult(data);
      setSubmitted(true);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Submission failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Loader />;
  if (loadError) return <Empty message={loadError} />;
  if (questions.length === 0) return <Empty message="No questions available for this assessment" />;

  if (submitted && result) {
    const hasEssay = questions.some(q => q.type === 'essay');
    const fullyGraded = result.submission?.fully_graded !== false;
    const displayScore = result.submission?.total_score ?? result.auto_score;
    return (
      <ScrollView contentContainerStyle={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          <Text style={styles.resultTitle}>Submitted!</Text>
          <Text style={styles.resultScore}>{displayScore}</Text>
          <Text style={styles.resultLabel}>marks scored</Text>
          <Text style={styles.resultSub}>
            {Object.keys(answers).length} of {questions.length} questions answered
          </Text>
          {hasEssay && !fullyGraded && (
            <Text style={styles.resultNote}>
              Brainee is still checking one or more of your written answers — check back soon for your final score.
            </Text>
          )}
          <Btn
            label="Back to Assessments"
            onPress={() => navigation.goBack()}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </ScrollView>
    );
  }

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const progress = answered / questions.length;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>{current + 1} / {questions.length}</Text>
        <Text style={styles.statusText}>{answered} answered</Text>
      </View>

      {/* Question */}
      <ScrollView contentContainerStyle={styles.qContainer}>
        <Card>
          <Text style={styles.qNumber}>Question {current + 1}</Text>
          <Text style={styles.qStem}>{q.stem}</Text>

          {/* Essay questions have no options to select — previously this
              silently rendered nothing at all for them (only the MCQ option
              list below was ever built), meaning a student could not type
              an answer to an essay question no matter what: the field was
              just missing. The backend already fully supports essays (auto
              -sends them to Brainee for AI grading on submit), so this was
              a real, live gap — confirmed reachable since CreateAssessmentScreen
              already lets an admin pick 'essay' as a question type. */}
          {q.type === 'essay' ? (
            <TextInput
              style={styles.essayInput}
              multiline
              textAlignVertical="top"
              placeholder="Type your answer here…"
              placeholderTextColor={Colors.textSub}
              value={answers[q.id] ?? ''}
              onChangeText={(text) => select(q.id, text)}
            />
          ) : (
            (q.options ?? []).map((opt) => {
              const selected = answers[q.id] === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() => select(q.id, opt.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionKey, selected && { backgroundColor: Colors.primary }]}>
                    <Text style={[styles.optionKeyText, selected && { color: Colors.white }]}>{opt.key}</Text>
                  </View>
                  <Text style={[styles.optionText, selected && { color: Colors.primary, fontWeight: '700' }]}>
                    {opt.text}
                  </Text>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })
          )}
        </Card>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navRow}>
        <Btn
          label="← Prev"
          onPress={() => setCurrent(c => Math.max(0, c - 1))}
          variant="outline"
          disabled={current === 0}
          style={{ flex: 1 }}
        />
        {current < questions.length - 1 ? (
          <Btn
            label="Next →"
            onPress={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
            style={{ flex: 1 }}
          />
        ) : (
          <Btn
            label={submitting ? 'Submitting…' : 'Submit'}
            onPress={handleSubmit}
            loading={submitting}
            style={{ flex: 1, backgroundColor: Colors.success }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  progressBar:    { height: 4, backgroundColor: Colors.border },
  progressFill:   { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  statusRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  statusText:     { fontSize: Fonts.sizes.xs, color: Colors.textSub, fontWeight: '600' },
  qContainer:     { padding: Spacing.md, paddingBottom: Spacing.xl },
  qNumber:        { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.xs },
  qStem:          { fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.text, lineHeight: 22, marginBottom: Spacing.md },
  essayInput:     { minHeight: 140, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, fontSize: Fonts.sizes.sm, color: Colors.text },
  option:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.sm, backgroundColor: Colors.white },
  optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '0D' },
  optionKey:      { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  optionKeyText:  { fontWeight: '700', fontSize: Fonts.sizes.sm, color: Colors.text },
  optionText:     { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.text },
  navRow:         { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  // Result
  resultContainer:{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  resultCard:     { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.xl, alignItems: 'center', width: '100%', elevation: 3 },
  resultTitle:    { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.text, marginTop: Spacing.md },
  resultScore:    { fontSize: 64, fontWeight: '900', color: Colors.primary, marginTop: Spacing.md },
  resultLabel:    { fontSize: Fonts.sizes.lg, color: Colors.textSub },
  resultSub:      { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: Spacing.sm },
  resultNote:     { fontSize: Fonts.sizes.sm, color: Colors.accent, marginTop: Spacing.md, textAlign: 'center', lineHeight: 20 },
});
