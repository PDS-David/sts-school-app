import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api/client';
import { Card, Btn, Loader, Empty } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { PageContainer, useIsWide } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';

type Action = 'promote' | 'retain' | 'remove';

interface StudentRow { id: string; full_name: string; admission_number: string | null; class_name: string; }

// Start- and end-of-session placement for the class teacher's own assigned class:
// one tap per student to Promote, Retain or Remove, straight from the roster list
// (StudentDetailScreen offers the same decision one student at a time).
// Backend: POST /students/:id/promotion, which only accepts promote/retain/remove
// from a teacher and only for students in that teacher's assigned class. Demote,
// reinstate and the removed-students list are administrator-only, so they are not
// offered here. Decisions affect the physical report roster only; online accounts
// and academic history are unchanged.

export default function PromoteStudentsScreen() {
  const isWide = useIsWide();
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ student: StudentRow; action: Action; toLabel: string } | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);

  const fetchRoster = useCallback(() => {
    if (!user?.assigned_class) { setLoading(false); return; }
    setLoading(true);
    setLoadError('');
    api.get('/students')
      .then(({ data }) => setStudents(data.students ?? []))
      .catch((e: any) => {
        setLoadError(e?.response?.data?.error ?? 'Could not load your assigned-class roster. Check your connection and retry.');
      })
      .finally(() => setLoading(false));
  }, [user?.assigned_class]);

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  const runAction = async (student: StudentRow, action: Action) => {
    setBusyId(student.id);
    try {
      const { data } = await api.post(`/students/${student.id}/promotion`, { action });
      setStudents(prev => prev.filter(s => s.id !== student.id));
      if (action === 'retain') {
        setInfo({ title: 'Retained', message: `${student.full_name} stays in ${student.class_name}.` });
      } else if (action === 'remove') {
        setInfo({
          title: 'Removed from report roster',
          message: `${student.full_name} was removed from the active physical report roster. Their online account and academic history remain unchanged.  Ask an administrator if this was a mistake.`,
        });
      } else {
        setInfo({
          title: 'Promoted',
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
          <Text style={styles.explainer}>
            {`For each student in ${user?.assigned_class ?? 'your class'}, choose whether they move up, stay, or leave the active physical report roster. These decisions affect report-roster placement only; online classes, logins and academic history are unchanged. Promoted students leave your class list.`}
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
          ListEmptyComponent={<Empty message="No active students left to decide on" />}
          contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.sm, ...(isWide ? { alignItems: 'center' as const } : null) }}
          renderItem={({ item: s }) => (
            <PageContainer style={{ width: '100%' }}>
              <Card style={styles.row}>
                <Text style={styles.name}>{s.full_name}</Text>
                {!!s.admission_number && <Text style={styles.sub}>{s.admission_number}</Text>}
                <View style={styles.actions}>
                  <Btn
                    label="Retain"
                    variant="ghost"
                    loading={busyId === s.id}
                    disabled={busyId !== null}
                    onPress={() => setConfirm({ student: s, action: 'retain', toLabel: s.class_name })}
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
                </View>
              </Card>
            </PageContainer>
          )}
        />
      )}

      {confirm && (
        <ConfirmDialog
          visible
          title={confirm.action === 'promote' ? 'Promote this student?' : confirm.action === 'remove' ? 'Remove this student from the report roster?' : 'Retain this student?'}
          message={confirm.action === 'retain'
            ? `Keep ${confirm.student.full_name} in ${confirm.student.class_name}?`
            : confirm.action === 'remove'
              ? `Remove ${confirm.student.full_name} from the active physical report roster? Their online account and academic history will remain unchanged. Only an administrator can undo this.`
              : `Move ${confirm.student.full_name} from ${confirm.student.class_name} to ${confirm.toLabel} in the physical report roster only? Their online class will remain unchanged.`}
          confirmLabel={confirm.action === 'promote' ? 'Promote' : confirm.action === 'remove' ? 'Remove' : 'Retain'}
          destructive={confirm.action === 'remove'}
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
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: { flex: 1, minWidth: '45%', paddingVertical: 8 },
});
