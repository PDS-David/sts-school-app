import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, SectionHeader } from '../components/UI';
import { getSecureItem } from '../api/secureTokenStorage';
import { LessonImage } from './TopicDetailScreen';
import { Colors, Spacing, Fonts, Radius } from '../theme';

export default function Ss1PackageLessonScreen({ route }: any) {
  const { lesson } = route.params as { lesson: any };
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [token, setToken] = useState<string | null>(null);
  const [assetAttempt, setAssetAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    getSecureItem('access_token').then(value => { if (active) setToken(value); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: Spacing.md }}>
      <Card>
        <Text style={styles.meta}>{lesson.canonical_subject} · {lesson.term}</Text>
        <SectionHeader title={lesson.title} />
        <Text style={styles.body}>{lesson.body}</Text>
        {lesson.assets?.length > 0 && token ? (
          <View style={{ marginTop: Spacing.md }}>
            {lesson.assets.map((asset: any) => (
              <LessonImage key={`${asset.id}:${assetAttempt}`} asset={asset} token={token} onRetry={() => setAssetAttempt(value => value + 1)} />
            ))}
          </View>
        ) : null}
        <Text style={styles.heading}>Learning objectives</Text>
        {lesson.objectives.map((objective: string, index: number) => (
          <Text key={index} style={styles.objective}>{index + 1}. {objective}</Text>
        ))}
        <Text style={styles.heading}>Practice and marking guide</Text>
        {lesson.practice.map((question: any, index: number) => (
          <View key={question.id} style={styles.question}>
            <Text style={styles.questionText}>{index + 1}. {question.question}</Text>
            {question.options?.map((option: string, optionIndex: number) => (
              <Text key={optionIndex} style={styles.option}>{option}</Text>
            ))}
            <TouchableOpacity onPress={() => setRevealed(current => ({ ...current, [index]: !current[index] }))} accessibilityRole="button">
              <Text style={styles.reveal}>{revealed[index] ? 'Hide answer and marking guide' : 'Reveal answer and marking guide'}</Text>
            </TouchableOpacity>
            {revealed[index] && (
              <View style={styles.answer}>
                <Text style={styles.answerText}>Answer: {question.answer}</Text>
                <Text style={styles.answerText}>Marks: {question.marks}</Text>
                {question.marking.map((criterion: any, criterionIndex: number) => (
                  <Text key={criterionIndex} style={styles.criterion}>• {criterion.marks} mark(s): {criterion.criterion}</Text>
                ))}
              </View>
            )}
          </View>
        ))}
        <Text style={styles.sourceHeading}>Sources and attribution</Text>
        {lesson.provenance.map((source: any, index: number) => (
          <Text key={index} style={styles.source}>{source.title} — {source.locator}{source.url ? ` · ${source.url}` : ''}{'\n'}Rights: {source.rights}{'\n'}Attribution: {source.attribution}</Text>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  meta: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: Spacing.xs },
  body: { color: Colors.text, fontSize: Fonts.sizes.sm, lineHeight: 22, marginTop: Spacing.sm },
  heading: { color: Colors.primary, fontSize: Fonts.sizes.md, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.xs },
  objective: { color: Colors.text, fontSize: Fonts.sizes.sm, lineHeight: 21, marginBottom: 4 },
  question: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, marginTop: Spacing.sm },
  questionText: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '700', lineHeight: 21 },
  option: { color: Colors.text, fontSize: Fonts.sizes.sm, marginTop: 4, marginLeft: Spacing.sm },
  reveal: { color: Colors.primary, fontSize: Fonts.sizes.sm, fontWeight: '700', marginTop: Spacing.sm },
  answer: { backgroundColor: Colors.primary + '10', borderRadius: Radius.sm, padding: Spacing.sm, marginTop: Spacing.sm },
  answerText: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600', marginBottom: 4 },
  criterion: { color: Colors.text, fontSize: Fonts.sizes.xs, lineHeight: 18 },
  sourceHeading: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '700', marginTop: Spacing.lg },
  source: { color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 18, marginTop: Spacing.xs },
});
