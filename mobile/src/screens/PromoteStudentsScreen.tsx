import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api/client';
import { Card, Btn, Loader, Empty } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { PageContainer, useIsWide } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface StudentRow { id: string; full_name: string; admission_number: string | null; class_name: string; }

// Start- and end-of-session class placement, one student at a time, done by the
// class teacher for their own assigned class (backend: POST /students/:id/promotion,
// teacher-scoped to assigned_class; demotion is admin-only and not offered here).
// "Retain" leaves the class unchanged but is recorded in the roster history.
// Promote/Remove move the student out of this roster; the Removed tab lets the
// teacher reinstate a student removed by mistake. Past scores keep the class they
// were recorded under (scores.class_name is stamped at entry time).

export default function PromoteStudentsScreen() {
  const isWide = useIsWide();
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [showRemoved, setShowRemoved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ student: StudentRow; action: 'promote' | 'demote' | 'retain' | 'remove' | 'reinstate'; toLabel: string } | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);

  const fetchRoster = useCallback(() => {
    if (!user?.assigned_class) { setLoading(false); return; }
    setLoading(true);
    setLoadError('');
    api.get(showRemoved ? '/students/report-roster/removed' : '/students')
      .then(({ data }) => setStudents(data.students ?? []))
      .catch((e: any) => {
        setLoadError(e?.response?.data?.error ?? 'Could not load your assigned-class roster. Check your connection and retry.');
      })
      .finally(() => setLoading(false));
  }, [user?.assigned_class, showRemoved]);

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  const runAction = async (student: StudentRow, action: 'promote' | 'demote' | 'retain' | 'remove' | 'reinstate') => {
    setBusyId(student.id);
    try {
      const { data } = await api.post(`/students/${student.id}/promotion`, { action });
      setStudents(prev => prev.filter(s => s.id !== student.id));
      if (action === 'retain') {
        setInfo({ title: 'Retained', message: `${student.full_name} stays in ${student.class_name}.` });
      } else if (action === 'remove') {
        setInfo({
          title: 'Removed from report roster',
          message: `${student.full_name} was removed from the active physical report roster. Their online account and academic history remain unchanged. You can reinstate them from the Removed list.`,
        });
      } else if (action === 'reinstate') {
        setInfo({
          title: 'Reinstated',
          message: `${student.full_name} is active again in ${student.class_name}.`,
        });
      } else {
        setInfo({
          title: action === 'promote' ? 'Promoted' : 'Demoted',
          message: `${student.full_name} moved from ${data.from_class} to ${data.to_class} in the physical report roster. Their online class remains unchanged.`,
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
  if (loadError) return (
    <View style={{ flex: 1, justifyContent: 'center', padding: Spacing.md, backgroundColor: Colors.background }}>
      <Empty message={loadError} />
      <Btn label='Retry class roster' variant='outline' onPress={() => fetchRoster()} />
    </View>
  );

  const noClassAssigned = !user?.assigned_class;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <PageContainer style={{ padding: Spacing.md, paddingBottom: 0 }}>
        <Card style={{ marginBottom: Spacing.sm }}>
          <View style={styles.viewTabs}>
            <Btn label="Active roster" variant={!showRemoved ? 'primary' : 'outline'} onPress={() => setShowRemoved(false)} style={styles.tabBtn} />
            <Btn label="Removed" variant={showRemoved ? 'primary' : 'outline'} onPress={() => setShowRemoved(true)} style={styles.tabBtn} />
          </View>
          <Text style={styles.explainer}>
            {showRemoved
              ? `These students were removed from ${user?.assigned_class ?? 'your class'}'s physical report roster. Reinstate a student to make them eligible for future reports again.`
              : `For each student in ${user?.assigned_class ?? 'your class'}, choose whether they move up, stay, or leave the active physical report roster. These decisions affect report-roster placement only; online classes, logins and academic history are unchanged.`}
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
          // See AdminUsersScreen.tsx's FlatList for why this is set explicitly.
          removeClippedSubviews={false}
          ListEmptyComponent={<Empty message={showRemoved ? 'No removed students in your assigned class' : 'No active students left to decide on'} />}
          contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.sm, ...(isWide ? { alignItems: 'center' as const } : null) }}
          renderItem={({ item: s }) => (
            <PageContainer style={{ width: '100%' }}>
              <Card style={styles.row}>
                <Text style={styles.name}>{s.full_name}</Text>
                {!!s.admission_number && <Text style={styles.sub}>{s.admission_number}</Text>}
                <View style={styles.actions}>
                  {showRemoved ? (
                    <Btn
                      label="Reinstate"
                      variant="primary"
                      loading={busyId === s.id}
                      disabled={busyId !== null}
                      onPress={() => setConfirm({ student: s, action: 'reinstate', toLabel: s.class_name })}
                      style={styles.actionBtn}
                    />
                  ) : (
                    <>
                      <Btn
                        label="Retain"
                        variant="ghost"
                        loading={busyId === s.id}
                        onPress={() => setConfirm({ student: s, action: 'retain', toLabel: s.class_name })}
                        disabled={busyId !== null}
                        style={styles.actionBtn}
                      />
                      <Btn
                        label="Promote"
                        variant="primary"
                        loading={busyId === s.id}
                        disabled={busyId !== null}
                        onPress={() => setConfirm({ student: s, action: 'promote', toLabel: 'the next class' })}
                        style={styles.actionBtn}
                      />
                      <Btn
                        label="Remove"
                        variant="outline"
                        loading={busyId === s.id}
                        disabled={busyId !== null}
                        onPress={() => setConfirm({ student: s, action: 'remove', toLabel: 'the active report roster' })}
                        style={styles.actionBtn}
                      />
                    </>
                  )}
                </View>
              </Card>
            </PageContainer>
          )}
        />
      )}

      {confirm && (
        <ConfirmDialog
          visible
          title={confirm.action === 'promote' ? 'Promote this student?' : confirm.action === 'demote' ? 'Demote this student?' : confirm.action === 'remove' ? 'Remove this student from the report roster?' : confirm.action === 'reinstate' ? 'Reinstate this student?' : 'Retain this student?'}
          message={confirm.action === 'retain'
            ? `Keep ${confirm.student.full_name} in ${confirm.student.class_name}?`
            : confirm.action === 'remove'
              ? `Remove ${confirm.student.full_name} from the active physical report roster? Their online account and academic history will remain unchanged.`
              : confirm.action === 'reinstate'
                ? `Reinstate ${confirm.student.full_name} in ${confirm.student.class_name}'s physical report roster?`
                : `Move ${confirm.student.full_name} to ${confirm.toLabel} in the physical report roster only? Their online class will remain unchanged.`}
          confirmLabel={confirm.action === 'promote' ? 'Promote' : confirm.action === 'demote' ? 'Demote' : confirm.action === 'remove' ? 'Remove' : confirm.action === 'reinstate' ? 'Reinstate' : 'Retain'}
          destructive={confirm.action === 'demote' || confirm.action === 'remove'}
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
  viewTabs: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  tabBtn: { flex: 1 },
  name:    { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub:     { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: { flex: 1, minWidth: '45%', paddingVertical: 8 },
});
