import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, SectionHeader, Btn } from '../components/UI';
import { getSecureItem } from '../api/secureTokenStorage';
import { LessonImage } from './TopicDetailScreen';
import { Colors, Spacing, Fonts, Radius } from '../theme';

export default function Ss23PackageLessonScreen({ route, navigation }: any) {
  const { lesson } = route.params as { lesson: any };
  const [token, setToken] = useState<string | null>(null);
  const [assetAttempt, setAssetAttempt] = useState(0);
  const [generatedLesson, setGeneratedLesson] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const isExamPreparation = lesson.delivery_mode === 'EXAM_PREPARATION';

  useEffect(() => {
    let active = true;
    getSecureItem('access_token').then(value => { if (active) setToken(value); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const generateLesson = async () => {
    if (lesson.locked || generating) return;
    setGenerating(true);
    setGenerationError(null);
    try {
      const { data } = await api.post(`/learning/ss23/units/${encodeURIComponent(lesson.id)}/generate`);
      if (!data?.ok || !data.lesson) throw new Error(data?.error ?? 'The AI lesson could not be generated.');
      setGeneratedLesson(data.lesson);
      setRevealed({});
    } catch (error: any) {
      setGenerationError(error?.response?.data?.error ?? error?.message ?? 'The AI lesson could not be generated. Check your connection and retry.');
    } finally {
      setGenerating(false);
    }
  };
  useEffect(() => {
    if (!lesson.locked) void generateLesson();
  }, [lesson.id, lesson.locked]);

  if (lesson.locked) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: Spacing.md }}>
        <Card>
          <Text style={styles.meta}>{lesson.canonical_subject} · {lesson.term}</Text>
          <SectionHeader title={lesson.title} />
          <View style={styles.locked}>
            <Text style={styles.lockedTitle}>This term is locked</Text>
            <Text style={styles.note}>Redeem the Term PIN issued by your school to unlock this lesson.</Text>
          </View>
          <Btn label="Enter Term PIN" onPress={() => navigation.navigate('TermPinRedeem')} />
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: Spacing.md }}>
      <Card>
        <Text style={styles.meta}>
          {lesson.canonical_subject} · {lesson.class_name} · {lesson.term} · Week {lesson.week_label}
        </Text>
        <SectionHeader title={lesson.title} />
        {isExamPreparation && (
          <View style={styles.examNotice}>
            <Text style={styles.examNoticeText}>SS3 examination preparation only. This activity revises established learning; it does not introduce a new instructional topic.</Text>
          </View>
        )}
        {generatedLesson ? (
          <>
            <Text style={styles.body}>{generatedLesson.introduction}</Text>
            {generatedLesson.sections.map((section: any, index: number) => (
              <View key={index} style={{ marginTop: Spacing.md }}>
                <Text style={styles.heading}>{section.heading}</Text>
                <Text style={styles.body}>{section.content}</Text>
              </View>
            ))}
            <Text style={styles.heading}>Lesson recap</Text>
            <Text style={styles.body}>{generatedLesson.summary}</Text>
          </>
        ) : (
          <View style={{ marginTop: Spacing.sm }}>
            {generating ? <Text style={styles.note}>The AI curriculum engine is preparing this lesson from the approved topic and objectives…</Text> : null}
            {generationError ? (
              <>
                <Text style={styles.generationError}>{generationError}</Text>
                <Text style={styles.note}>The approved source note is shown below for reference; it is not the AI-generated lesson.</Text>
                <Text style={styles.body}>{lesson.body}</Text>
              </>
            ) : null}
            {!generating ? <Btn label="Generate AI lesson" onPress={generateLesson} loading={generating} /> : null}
          </View>
        )}
        {lesson.assets?.length > 0 && token ? (
          <View style={{ marginTop: Spacing.md }}>
            {lesson.assets.map((asset: any) => (
              <LessonImage key={`${asset.id}:${assetAttempt}`} asset={asset} token={token} onRetry={() => setAssetAttempt(value => value + 1)} />
            ))}
          </View>
        ) : null}
        <Text style={styles.heading}>Learning objectives</Text>
        {(lesson.objectives ?? []).map((objective: string, index: number) => (
          <Text key={index} style={styles.objective}>{index + 1}. {objective}</Text>
        ))}
        <Text style={styles.heading}>{isExamPreparation ? 'AI-generated examination practice' : 'AI-generated practice questions'}</Text>
        {generatedLesson ? generatedLesson.practice_questions.map((question: any, index: number) => (
          <View key={index} style={styles.question}>
            <Text style={styles.questionText}>{index + 1}. {question.stem}</Text>
            {question.options.map((option: any) => <Text key={option.key} style={styles.option}>{option.key}. {option.text}</Text>)}
            <TouchableOpacity onPress={() => setRevealed(current => ({ ...current, [index]: !current[index] }))} accessibilityRole="button">
              <Text style={styles.reveal}>{revealed[index] ? 'Hide answer and explanation' : 'Reveal answer and explanation'}</Text>
            </TouchableOpacity>
            {revealed[index] && <View style={styles.answer}>
              <Text style={styles.answerText}>Correct answer: {question.correct_keys.join(', ')}</Text>
              <Text style={styles.answerText}>{question.explanation}</Text>
            </View>}
          </View>
        )) : (
          <Text style={styles.note}>AI-generated practice questions will appear with the generated lesson.</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  meta: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: Spacing.xs },
  generationError: { color: Colors.error, fontSize: Fonts.sizes.xs, marginTop: Spacing.sm },
  option: { color: Colors.text, fontSize: Fonts.sizes.sm, marginTop: 4, marginLeft: Spacing.sm },
  reveal: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700', marginTop: Spacing.sm },
  answer: { backgroundColor: Colors.primary + '10', borderRadius: Radius.sm, padding: Spacing.sm, marginTop: Spacing.sm },
  answerText: { color: Colors.text, fontSize: Fonts.sizes.sm, lineHeight: 19, marginBottom: 4 },
  body: { color: Colors.text, fontSize: Fonts.sizes.sm, lineHeight: 22, marginTop: Spacing.sm },
  heading: { color: Colors.primary, fontSize: Fonts.sizes.md, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.xs },
  objective: { color: Colors.text, fontSize: Fonts.sizes.sm, lineHeight: 21, marginBottom: 4 },
  question: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, marginTop: Spacing.sm },
  questionText: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '700', lineHeight: 21 },
  marks: { color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 4 },
  note: { color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 18, marginTop: Spacing.md },
  examNotice: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, padding: Spacing.sm, marginTop: Spacing.sm },
  examNoticeText: { color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 18 },
  locked: { backgroundColor: Colors.primary + '10', borderRadius: Radius.sm, padding: Spacing.md, marginVertical: Spacing.md },
  lockedTitle: { color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
});
