import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { Card, Btn, Loader, Empty, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

const STATUS_COLOR: Record<string, string> = {
  draft: Colors.textSub, open: Colors.success, closed: Colors.error,
};

export default function AssessmentsScreen({ navigation }: any) {
  const { user } = useAuth();
  // Named isAdmin, not isTeacher: a teacher no longer has 'assessments.read'
  // (see rbac.ts) and never reaches this screen at all — only a student
  // (their own AssessmentsTab) or admin (oversight/creation) land here.
  const isAdmin = user?.role === 'admin';
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);

  const fetch = async () => {
    try {
      const { data } = await api.get('/learning/assessments');
      setAssessments(data.assessments);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleTake = (a: any) => {
    if (a.status !== 'open') { Alert.alert('Assessment is not open'); return; }
    navigation.navigate('TakeAssessment', {
      assessmentId: a.id,
      title: a.title,
      alreadySubmitted: !!a.already_submitted,
      submissionId: a.my_submission_id ?? null,
    });
  };

  // Found in QA Pass 6: there was no way anywhere — UI or API — to move an
  // assessment out of 'draft', so "Take Assessment" could never work for any
  // student. This wires up the new PUT /assessments/:id/status route.
  const handleStatusChange = async (a: any, status: 'open' | 'closed' | 'draft') => {
    try {
      await api.put(`/learning/assessments/${a.id}/status`, { status });
      fetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {isAdmin && (
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateAssessment')}>
          <Ionicons name="add-circle" size={20} color={Colors.white} />
          <Text style={styles.addBtnTxt}>Create Assessment</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={assessments}
        keyExtractor={a => a.id}
        ListEmptyComponent={<Empty message="No assessments yet" />}
        contentContainerStyle={{ padding: Spacing.sm }}
        renderItem={({ item: a }) => (
          <Card>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{a.title}</Text>
                <Text style={styles.meta}>{a.subject_name} · {a.class_name}</Text>
              </View>
              <Badge label={a.status} color={STATUS_COLOR[a.status] ?? Colors.textSub} />
            </View>
            <Text style={styles.detail}>Questions: {a.question_count} · Total: {a.total_marks} marks</Text>
            {a.start_at && <Text style={styles.detail}>Opens: {new Date(a.start_at).toLocaleString()}</Text>}
            {a.end_at   && <Text style={styles.detail}>Closes: {new Date(a.end_at).toLocaleString()}</Text>}
            <View style={styles.actions}>
              {!isAdmin && (
                <Btn
                  label={a.already_submitted ? `View My Result${a.my_score != null ? ` (${a.my_score})` : ''}` : 'Take Assessment'}
                  onPress={() => handleTake(a)}
                  variant={a.already_submitted ? 'outline' : undefined}
                  style={{ flex: 1 }}
                />
              )}
              {isAdmin && (
                <Btn label="View Results" onPress={() => navigation.navigate('AssessmentResults', { assessmentId: a.id })} style={{ flex: 1 }} variant="outline" />
              )}
              {isAdmin && a.status === 'draft' && (
                <Btn label="Publish" onPress={() => handleStatusChange(a, 'open')} style={{ flex: 1 }} />
              )}
              {isAdmin && a.status === 'open' && (
                <Btn label="Close" onPress={() => handleStatusChange(a, 'closed')} style={{ flex: 1 }} variant="outline" />
              )}
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, margin: Spacing.sm, borderRadius: Radius.md, padding: Spacing.md, justifyContent: 'center' },
  addBtnTxt: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  header:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.xs },
  title:     { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  meta:      { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  detail:    { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 2 },
  actions:   { flexDirection: 'row', marginTop: Spacing.sm, gap: Spacing.sm },
});
