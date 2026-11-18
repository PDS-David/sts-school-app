import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api/client';
import { Card, Btn, Loader, Empty } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';
import { useAuth } from '../api/AuthContext';
import { PageContainer, useIsWide } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface StudentRow {
  id: string;
  full_name: string;
  admission_number: string | null;
  class_name: string;
}

type PlacementAction = 'promote' | 'retain' | 'remove';

// Start- and end-of-session physical report-roster decisions for the teacher's
// own assigned class. Teachers may promote, retain or remove; demotion and
// reinstatement remain administrator-only. These actions never change the
// independent online-learning identity or historical academic records.
export default function PromoteStudentsScreen() {
  const isWide = useIsWide();
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ student: StudentRow; action: PlacementAction } | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);

  const fetchRoster = useCallback(() => {
    if (!user?.assigned_class) {
      setStudents([]);
      setLoading(false);
      return;
    }
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

  const runAction = async (student: StudentRow, action: PlacementAction) => {
    setBusyId(student.id);
    try {
      const { data } = await api.post(`/students/${student.id}/promotion`, { action });
      setStudents(prev => prev.filter(s => s.id !== student.id));
      if (action === 'retain') {
        setInfo({
          title: 'Retained',
          message: `${student.full_name} stays in ${student.class_name}. The decision is recorded in the physical report-roster history.`,
        });
      } else if (action === 'remove') {
        setInfo({
          title: 'Removed from report roster',
          message: `${student.full_name} was removed from the active physical report roster. Their online account and academic history remain unchanged.`,
        });
      } else {
        setInfo({
          title: 'Promoted',
          message: `${student.full_name} moved from ${data.from_class} to ${data.to_class} in the physical report roster only. Their online account and historical academic records remain unchanged.`,
        });
      }
    } catch (e: any) {
      setInfo({
        title: 'Could not do that',
        message: e?.response?.data?.error ?? 'Check your connection and try again.',
      });
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  if (loading) return <Loader />;
  if (loadError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: Spacing.md, backgroundColor: Colors.background }}>
        <Empty message={loadError} />
        <Btn label='Retry class roster' variant='outline' onPress={() => fetchRoster()} />
      </View>
    );
  }

  const noClassAssigned = !user?.assigned_class;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <PageContainer style={{ padding: Spacing.md, paddingBottom: 0 }}>
        <Card style={{ marginBottom: Spacing.sm }}>
          <Text style={styles.explainer}>
            For each student in {user?.assigned_class ?? 'your assigned class'}, choose whether to promote them to the next class, retain them, or remove them from the active physical report roster. These decisions affect report-roster placement only; online accounts and academic history remain unchanged.
          </Text>
        </Card>
      </PageContainer>

      {noClassAssigned ? (
        <PageContainer style={{ padding: Spacing.md }}>
          <Card>
            <Text style={styles.explainer}>You aren't assigned to a physical class, so there is no roster here to process. Ask an administrator if this looks wrong.</Text>
          </Card>
        </PageContainer>
      ) : (
        <FlatList
          data={students}
          keyExtractor={student => student.id}
          removeClippedSubviews={false}
          ListEmptyComponent={<Empty message='No active students left to decide on' />}
          contentContainerStyle={{
            padding: Spacing.md,
            paddingTop: Spacing.sm,
            ...(isWide ? { alignItems: 'center' as const } : null),
          }}
          renderItem={({ item: student }) => (
            <PageContainer style={{ width: '100%' }}>
              <Card style={styles.row}>
                <Text style={styles.name}>{student.full_name}</Text>
                {!!student.admission_number && <Text style={styles.sub}>{student.admission_number}</Text>}
                <View style={styles.actions}>
                  <Btn
                    label='Retain'
                    variant='ghost'
                    loading={busyId === student.id}
                    disabled={busyId !== null}
                    onPress={() => setConfirm({ student, action: 'retain' })}
                    style={styles.actionBtn}
                  />
                  <Btn
                    label='Promote'
                    variant='primary'
                    loading={busyId === student.id}
                    disabled={busyId !== null}
                    onPress={() => setConfirm({ student, action: 'promote' })}
                    style={styles.actionBtn}
                  />
                  <Btn
                    label='Remove'
                    variant='outline'
                    loading={busyId === student.id}
                    disabled={busyId !== null}
                    onPress={() => setConfirm({ student, action: 'remove' })}
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
            ? `Keep ${confirm.student.full_name} in ${confirm.student.class_name} for the next reporting period?`
            : confirm.action === 'remove'
              ? `Remove ${confirm.student.full_name} from the active physical report roster? Their online account and academic history will remain unchanged.`
              : `Promote ${confirm.student.full_name} to the next class in the physical report roster only? Their online account and academic history will remain unchanged.`}
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
  row: { marginBottom: Spacing.sm, width: '100%' },
  name: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: { flex: 1, minWidth: '30%', paddingVertical: 8 },
});
