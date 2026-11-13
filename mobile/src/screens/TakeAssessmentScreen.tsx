import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Loader, Empty, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface Question {
  id: number;
  stem: string;
  type: string;
  options: Array<{ key: string; text: string }>;
  points: number;
}

export default function TakeAssessmentScreen({ route, navigation }: any) {
  const { assessmentId, title, alreadySubmitted, submissionId } = route.params as {
    assessmentId: string; title: string; alreadySubmitted?: boolean; submissionId?: number | string | null;
  };

  const [questions,  setQuestions]  = useState<Question[]>([]);
  const [answers,    setAnswers]    = useState<Record<number, string>>({});
  const [loading,    setLoading]    = useState(true);
  const [loadError,  setLoadError]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [result,     setResult]     = useState<any>(null);
  const [current,    setCurrent]    = useState(0);
  const [questionRetry, setQuestionRetry] = useState(0);

  // Previously a student could reopen an assessment they'd already
  // submitted and silently overwrite their (possibly AI-graded) prior
  // answers just by tapping "Take Assessment" again — nothing distinguished
  // a fresh attempt from a resubmission. reviewMode shows their existing
  // submission first; retaking is now an explicit, confirmed choice via the
  // "Retake" button below rather than the default path. The backend's
  // resubmission support (upsert on submissions) is unchanged/still used —
  // this only changes what the student sees before that happens.
  const [reviewMode,    setReviewMode]    = useState(!!alreadySubmitted);
  const [reviewLoading, setReviewLoading] = useState(!!alreadySubmitted);
  const [reviewData,    setReviewData]    = useState<any>(null);
  const [reviewError,   setReviewError]   = useState('');
  const [reviewRetry,   setReviewRetry]   = useState(0);
  const [dialog, setDialog] = useState<{ title: string; message: string; confirmLabel?: string; destructive?: boolean; hideCancel?: boolean; onConfirm?: () => void } | null>(null);

  useEffect(() => {
    if (!alreadySubmitted) return;
    let cancelled = false;
    setReviewLoading(true);
    setReviewError('');
    if (!submissionId) {
      setReviewError('Your previous submission was detected, but its review reference is unavailable. Your existing attempt has been preserved. Return to Assessments or contact your teacher.');
      setReviewLoading(false);
      return;
    }
    api.get(`/learning/submissions/${submissionId}/answers`)
      .then(({ data }) => {
        if (cancelled) return;
        setReviewData(data);
        setReviewLoading(false);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setReviewError(e?.response?.data?.error ?? 'Could not load your previous submission. Retry the review; your existing attempt has not been changed.');
        setReviewLoading(false);
      });
    return () => { cancelled = true; };
  }, [alreadySubmitted, submissionId, reviewRetry]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    // Student endpoint returns this assessment's ordered questions with answer keys stripped.
    api.get(`/learning/assessments/${assessmentId}/questions`)
      .then(({ data }) => {
        if (cancelled) return;
        setQuestions(data.questions ?? []);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setLoadError(e?.response?.data?.error ?? 'Could not load this assessment');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [assessmentId, questionRetry]);

  const select = (questionId: number, key: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: key }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => !answers[q.id]).length;
    setDialog({
      title: unanswered > 0 ? 'Unanswered questions' : 'Submit assessment?',
      message: unanswered > 0
        ? `You have ${unanswered} unanswered question(s). You can go back to review them, or submit the answers you have provided.`
        : 'After submission, your answers will be recorded for marking.',
      confirmLabel: 'Submit',
      destructive: unanswered > 0,
      onConfirm: () => { setDialog(null); void doSubmit(); },
    });
  };

  const doSubmit = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const payload: Record<string, string> = {};
      Object.entries(answers).forEach(([qId, key]) => { payload[qId] = key; });
      const { data } = await api.post(`/learning/assessments/${assessmentId}/submit`, { answers: payload });
      setResult(data);
      setSubmitted(true);
    } catch (e: any) {
      setDialog({ title: 'Submission failed', message: e?.response?.data?.error ?? 'Check your connection and try again. Your answers are still on this screen.', hideCancel: true });
    } finally { setSubmitting(false); }
  };

  if (reviewLoading) return <Loader />;

  if (reviewMode && reviewError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={reviewError} />
      {!!submissionId && <Btn label="Retry submission review" onPress={() => setReviewRetry(v => v + 1)} variant="outline" />}
      <Btn label="Back to Assessments" onPress={() => navigation.goBack()} variant="ghost" style={{ marginTop: Spacing.sm }} />
    </View>
  );

  if (reviewMode && reviewData) {
    const sub = reviewData.submission;
    const revAnswers: any[] = reviewData.answers ?? [];
    const fullyGraded = sub?.fully_graded !== false;
    const handleRetake = () => {
      setDialog({
        title: 'Retake assessment?',
        message: 'This will replace your current answers and score with a new attempt. Your previous submission cannot be recovered afterward.',
        confirmLabel: 'Retake',
        destructive: true,
        onConfirm: () => { setDialog(null); setAnswers({}); setCurrent(0); setReviewError(''); setReviewMode(false); },
      });
    };
    return (
      <>
      <ScrollView contentContainerStyle={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Ionicons name="document-text-outline" size={64} color={Colors.primary} />
          <Text style={styles.resultTitle}>Your Submission</Text>
          <Text style={styles.resultScore}>{sub?.total_score ?? '—'}</Text>
          <Text style={styles.resultLabel}>marks scored</Text>
          {!fullyGraded && (
            <Text style={styles.resultNote}>
              Brainee is still checking one or more of your written answers — check back soon for your final score.
            </Text>
          )}
        </View>
        {revAnswers.map((a, i) => (
          <Card key={a.id} style={{ marginTop: Spacing.sm }}>
            <Text style={styles.reviewStem}>{i + 1}. {a.stem}</Text>
            <Text style={styles.reviewYourAnswer}>
              Your answer: {a.question_type === 'essay' ? (a.answer_text || '(left blank)') : (a.selected_key || '(left blank)')}
            </Text>
            <Text style={styles.reviewPoints}>
              {a.pending_review ? 'Pending your teacher\'s review' : `${a.awarded_points ?? 0} / ${a.max_points} marks`}
            </Text>
            {a.ai_feedback ? <Text style={styles.reviewFeedback}>{a.ai_feedback}</Text> : null}
          </Card>
        ))}
        <Btn label="Retake Assessment" onPress={handleRetake} variant="outline" style={{ marginTop: Spacing.md }} />
        <Btn label="Back to Assessments" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.sm, marginBottom: Spacing.xl }} />
      </ScrollView>
      <ConfirmDialog visible={!!dialog} title={dialog?.title ?? ''} message={dialog?.message ?? ''} confirmLabel={dialog?.confirmLabel} destructive={dialog?.destructive} hideCancel={dialog?.hideCancel} onConfirm={() => { const action = dialog?.onConfirm; if (action) action(); else setDialog(null); }} onCancel={() => setDialog(null)} />
      </>
    );
  }

  if (loading) return <Loader />;
  if (loadError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={loadError} />
      <Btn label="Retry loading questions" onPress={() => setQuestionRetry(v => v + 1)} variant="outline" />
      <Btn label="Back to Assessments" onPress={() => navigation.goBack()} variant="ghost" style={{ marginTop: Spacing.sm }} />
    </View>
  );
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
      <ConfirmDialog visible={!!dialog} title={dialog?.title ?? ''} message={dialog?.message ?? ''} confirmLabel={dialog?.confirmLabel} destructive={dialog?.destructive} hideCancel={dialog?.hideCancel} onConfirm={() => { const action = dialog?.onConfirm; if (action) action(); else setDialog(null); }} onCancel={() => setDialog(null)} />
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
  reviewStem:       { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  reviewYourAnswer: { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginBottom: Spacing.xs },
  reviewPoints:     { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary },
  reviewFeedback:   { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: Spacing.xs, fontStyle: 'italic' },
});
