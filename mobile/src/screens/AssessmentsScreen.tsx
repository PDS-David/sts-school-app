import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { Card, Btn, Loader, Empty, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { PageContainer, useIsWide } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';

const STATUS_COLOR: Record<string, string> = {
  draft: Colors.textSub, open: Colors.success, closed: Colors.error,
};

export default function AssessmentsScreen({ navigation }: any) {
  const isWide = useIsWide();
  const { user } = useAuth();
  // Named isAdmin, not isTeacher: a teacher no longer has 'assessments.read'
  // (see rbac.ts) and never reaches this screen at all — only a student
  // (their own AssessmentsTab) or admin (oversight/creation) land here.
  const isAdmin = user?.role === 'admin';
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loadError, setLoadError] = useState('');
  const [dialog, setDialog] = useState<{ title: string; message: string; confirmLabel?: string; destructive?: boolean; hideCancel?: boolean; onConfirm?: () => void } | null>(null);

  const fetch = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await api.get('/learning/assessments');
      setAssessments(data.assessments ?? []);
    } catch (e: any) {
      setLoadError(e?.response?.data?.error ?? 'Could not load assessments. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetch(); }, []);

  const handleTake = (a: any) => {
    if (a.status !== 'open') { setDialog({ title: 'Assessment unavailable', message: 'This assessment is not currently open.', hideCancel: true }); return; }
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
  const handleStatusChange = (a: any, status: 'open' | 'closed' | 'draft') => {
    const action = status === 'open' ? 'publish' : status === 'closed' ? 'close' : 'reopen';
    setDialog({
      title: `${action[0].toUpperCase() + action.slice(1)} assessment?`,
      message: status === 'open'
        ? 'Students who are eligible for this assessment will be able to start it when its availability window allows.'
        : 'Students will no longer be able to submit new attempts while this assessment is closed.',
      confirmLabel: action[0].toUpperCase() + action.slice(1),
      destructive: status === 'closed',
      onConfirm: async () => {
        setDialog(null);
        try {
          await api.put(`/learning/assessments/${a.id}/status`, { status });
          await fetch();
        } catch (e: any) {
          setDialog({ title: 'Could not update assessment', message: e?.response?.data?.error ?? 'Check your connection and try again.', hideCancel: true });
        }
      },
    });
  };

  if (loading) return <Loader />;

  if (loadError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={loadError} />
      <Btn label="Retry loading assessments" onPress={fetch} variant="outline" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {isAdmin && (
        <PageContainer style={{ padding: Spacing.sm, paddingBottom: 0 }}>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateAssessment')}>
            <Ionicons name="add-circle" size={20} color={Colors.white} />
            <Text style={styles.addBtnTxt}>Create Assessment</Text>
          </TouchableOpacity>
        </PageContainer>
      )}
      <FlatList
        data={assessments}
        keyExtractor={a => a.id}
        // See AdminUsersScreen.tsx's FlatList for why this is set explicitly.
        removeClippedSubviews={false}
        ListEmptyComponent={<Empty message="No assessments yet" />}
        contentContainerStyle={{ padding: Spacing.sm, ...(isWide ? { alignItems: 'center' as const } : null) }}
        renderItem={({ item: a }) => (
          <PageContainer style={{ width: '100%' }}>
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
          </PageContainer>
        )}
      />
      <ConfirmDialog visible={!!dialog} title={dialog?.title ?? ''} message={dialog?.message ?? ''} confirmLabel={dialog?.confirmLabel} destructive={dialog?.destructive} hideCancel={dialog?.hideCancel} onConfirm={() => { const action = dialog?.onConfirm; if (action) action(); else setDialog(null); }} onCancel={() => setDialog(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12, paddingHorizontal: Spacing.lg, alignSelf: 'flex-start' },
  addBtnTxt: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  header:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.xs },
  title:     { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  meta:      { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  detail:    { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 2 },
  actions:   { flexDirection: 'row', marginTop: Spacing.sm, gap: Spacing.sm },
});
