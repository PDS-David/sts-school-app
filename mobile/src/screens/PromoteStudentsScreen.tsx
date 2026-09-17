import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api/client';
import { Card, Btn, Loader, Empty } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { PageContainer } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface StudentRow { id: string; full_name: string; admission_number: string | null; class_name: string; }

// Added at explicit school-owner request for the 2026/2027 session's 1st
// Term: end-of-term/session class movement, one student at a time. Class
// teacher only — deliberately no admin version of this screen (see
// backend/src/routes/students.ts's POST /:id/promotion, which has no admin
// bypass either). "Retain" is a no-op on class_name but still recorded for
// the audit trail — see that route for why. Past terms' scores/report cards
// are NOT snapshotted against the student's old class — a school-owner
// decision, since those records "don't matter again" once a new term's
// records are entered — so promoting/demoting here does change what a
// promoted student's Term 1 report would show as their class if reprinted
// later. That trade-off was made deliberately, not missed.
export default function PromoteStudentsScreen() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ student: StudentRow; action: 'promote' | 'demote'; toLabel: string } | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);

  const fetchRoster = useCallback(() => {
    if (!user?.assigned_class) { setLoading(false); return; }
    setLoading(true);
    api.get('/students')
      .then(({ data }) => setStudents(data.students))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [user?.assigned_class]);

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  const runAction = async (student: StudentRow, action: 'promote' | 'demote' | 'retain') => {
    setBusyId(student.id);
    try {
      const { data } = await api.post(`/students/${student.id}/promotion`, { action });
      if (action === 'retain') {
        setStudents(prev => prev.filter(s => s.id !== student.id));
        setInfo({ title: 'Retained', message: `${student.full_name} stays in ${student.class_name}.` });
      } else {
        setStudents(prev => prev.filter(s => s.id !== student.id));
        setInfo({
          title: action === 'promote' ? 'Promoted' : 'Demoted',
          message: `${student.full_name} moved from ${data.from_class} to ${data.to_class}.`,
        });
      }
    } catch (e: any) {
      setInfo({ title: 'Could not do that', message: e?.response?.data?.error ?? 'Check your connection and try again.' });
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  if (loading) return <Loader />;

  const noClassAssigned = !user?.assigned_class;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <PageContainer style={{ padding: Spacing.md, paddingBottom: 0 }}>
        <Card style={{ marginBottom: Spacing.sm }}>
          <Text style={styles.explainer}>
            For each student in {user?.assigned_class ?? 'your class'}, choose whether they move up to the
            next class, stay where they are, or move down — this updates their class right away. Once you act
            on a student, they drop off this list; anyone still listed hasn't been decided on yet.
          </Text>
        </Card>
      </PageContainer>

      {noClassAssigned ? (
        <PageContainer style={{ padding: Spacing.md }}>
          <Card><Text style={styles.explainer}>You aren't set as the class teacher for any class, so there's no roster here for you to promote. Ask an admin if this looks wrong.</Text></Card>
        </PageContainer>
      ) : (
        <FlatList
          data={students}
          keyExtractor={s => s.id}
          ListEmptyComponent={<Empty message="No students left to decide on" />}
          contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.sm, alignItems: 'center' }}
          renderItem={({ item: s }) => (
            <PageContainer style={{ width: '100%' }}>
              <Card style={styles.row}>
                <Text style={styles.name}>{s.full_name}</Text>
                {!!s.admission_number && <Text style={styles.sub}>{s.admission_number}</Text>}
                <View style={styles.actions}>
                  <Btn
                    label="Demote"
                    variant="outline"
                    loading={busyId === s.id}
                    onPress={() => setConfirm({ student: s, action: 'demote', toLabel: 'a lower class' })}
                    style={styles.actionBtn}
                  />
                  <Btn
                    label="Retain"
                    variant="ghost"
                    loading={busyId === s.id}
                    onPress={() => runAction(s, 'retain')}
                    style={styles.actionBtn}
                  />
                  <Btn
                    label="Promote"
                    variant="primary"
                    loading={busyId === s.id}
                    onPress={() => setConfirm({ student: s, action: 'promote', toLabel: 'the next class' })}
                    style={styles.actionBtn}
                  />
                </View>
              </Card>
            </PageContainer>
          )}
        />
      )}

      {confirm && (
        <ConfirmDialog
          visible
          title={confirm.action === 'promote' ? 'Promote this student?' : 'Demote this student?'}
          message={`Move ${confirm.student.full_name} to ${confirm.toLabel}? This changes their class right away.`}
          confirmLabel={confirm.action === 'promote' ? 'Promote' : 'Demote'}
          destructive={confirm.action === 'demote'}
          onConfirm={() => runAction(confirm.student, confirm.action)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {info && (
        <ConfirmDialog
          visible
          title={info.title}
          message={info.message}
          hideCancel
          onConfirm={() => setInfo(null)}
          onCancel={() => setInfo(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  explainer: { fontSize: Fonts.sizes.sm, color: Colors.textSub, lineHeight: 20 },
  row:     { marginBottom: Spacing.sm, width: '100%' },
  name:    { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub:     { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: { flex: 1, paddingVertical: 8 },
});
