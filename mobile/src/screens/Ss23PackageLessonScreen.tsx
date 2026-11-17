import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, SectionHeader, Btn } from '../components/UI';
import { getSecureItem } from '../api/secureTokenStorage';
import { LessonImage } from './TopicDetailScreen';
import { Colors, Spacing, Fonts, Radius } from '../theme';

export default function Ss23PackageLessonScreen({ route, navigation }: any) {
  const { lesson } = route.params as { lesson: any };
  const [token, setToken] = useState<string | null>(null);
  const [assetAttempt, setAssetAttempt] = useState(0);
  const isExamPreparation = lesson.delivery_mode === 'EXAM_PREPARATION';

  useEffect(() => {
    let active = true;
    getSecureItem('access_token').then(value => { if (active) setToken(value); }).catch(() => {});
    return () => { active = false; };
  }, []);

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
        <Text style={styles.body}>{lesson.body}</Text>
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
        <Text style={styles.heading}>{isExamPreparation ? 'Examination practice' : 'Practice questions'}</Text>
        {(lesson.practice ?? []).map((question: any, index: number) => (
          <View key={question.id} style={styles.question}>
            <Text style={styles.questionText}>{index + 1}. {question.question}</Text>
            <Text style={styles.marks}>{question.marks} mark(s)</Text>
          </View>
        ))}
        <Text style={styles.note}>Complete the questions in your exercise book or assigned assessment. Model answers and marking guidance are intentionally not displayed in the student lesson view.</Text>
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
  marks: { color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 4 },
  note: { color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 18, marginTop: Spacing.md },
  examNotice: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, padding: Spacing.sm, marginTop: Spacing.sm },
  examNoticeText: { color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 18 },
  locked: { backgroundColor: Colors.primary + '10', borderRadius: Radius.sm, padding: Spacing.md, marginVertical: Spacing.md },
  lockedTitle: { color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
});
