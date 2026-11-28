import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api/client';
import { Card, Btn, Loader, Empty } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';
import { useAuth } from '../api/AuthContext';
import { PageContainer, useIsWide } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ADMIN_ONLY_PROMOTION_NOTE, availableActions, decisionLabel, promotionClassOptions, resolveSelectedClass, studentsInClass } from '../utils/promotionClasses';

interface StudentRow {
  id: string;
  full_name: string;
  admission_number: string | null;
  class_name: string;
  roster_decision?: string | null;
  admin_only_promotion?: boolean;
}

interface RemovedRow {
  id: string;
  full_name: string;
  admission_number: string | null;
  class_name: string;
}

type PlacementAction = 'promote' | 'retain' | 'remove';

// Start- and end-of-session physical report-roster decisions for the teacher's
// own assigned classes. A teacher with several classes picks one class at a time;
// only that class's students are listed and every decision names that class so
// the server can refuse it if the student has since moved. Teachers may promote,
// retain or remove; demotion and reinstatement remain administrator-only. Each
// student gets one decision per academic year, so a decided student shows their
// decision instead of buttons. A teacher can undo a removal they made themselves
// (not an administrator's), listed under the roster. These actions never change
// the independent online-learning identity or historical academic records.
export default function PromoteStudentsScreen() {
  const isWide = useIsWide();
  const { user } = useAuth();
  const classOptions = promotionClassOptions(user);
  const classKey = classOptions.join('|');
  const [pickedClass, setPickedClass] = useState<string | null>(null);
  const selectedClass = resolveSelectedClass(classOptions, pickedClass);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [removed, setRemoved] = useState<RemovedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ student: StudentRow; action: PlacementAction } | null>(null);
  const [confirmUndo, setConfirmUndo] = useState<RemovedRow | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const requestSeq = useRef(0);

  const chooseClass = (className: string) => {
    if (busyId !== null || className === selectedClass) return;
    // Never carry a pending decision, message or roster across classes.
    requestSeq.current += 1;
    setConfirm(null);
    setConfirmUndo(null);
    setInfo(null);
    setStudents([]);
    setRemoved([]);
    setLoadError('');
    setPickedClass(className);
  };

  const fetchRoster = useCallback(() => {
    const seq = ++requestSeq.current;
    setStudents([]);
    setRemoved([]);
    setConfirm(null);
    setConfirmUndo(null);
    if (!selectedClass) {
      setLoading(false);
      setLoadError('');
      return;
    }
    setLoading(true);
    setLoadError('');
    api.get('/students', { params: { class_name: selectedClass } })
      .then(({ data }) => {
        if (seq !== requestSeq.current) return; // a newer class selection superseded this response
        setStudents(studentsInClass<StudentRow>(data.students ?? [], selectedClass));
      })
      .catch((e: any) => {
        if (seq !== requestSeq.current) return;
        setLoadError(e?.response?.data?.error ?? 'Could not load the class roster. Check your connection and retry.');
      })
      .finally(() => { if (seq === requestSeq.current) setLoading(false); });
    // Removals this teacher can still undo. Best effort: the roster itself is what matters.
    api.get('/students/report-roster/my-removals', { params: { class_name: selectedClass } })
      .then(({ data }) => {
        if (seq !== requestSeq.current) return;
        setRemoved((data.students ?? []).filter((row: RemovedRow) => row.class_name === selectedClass));
      })
      .catch(() => { if (seq === requestSeq.current) setRemoved([]); });
  }, [selectedClass, classKey]);

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  const runAction = async (student: StudentRow, action: PlacementAction) => {
    setBusyId(student.id);
    try {
      const { data } = await api.post(`/students/${student.id}/promotion`, { action, expected_class_name: selectedClass });
      if (action === 'retain') {
        // A retained student stays in the class; mark the decision instead of hiding them.
        setStudents(prev => prev.map(s => (s.id === student.id ? { ...s, roster_decision: 'retain' } : s)));
      } else {
        setStudents(prev => prev.filter(s => s.id !== student.id));
      }
      if (action === 'remove') {
        setRemoved(prev => [{ id: student.id, full_name: student.full_name, admission_number: student.admission_number, class_name: student.class_name }, ...prev]);
      }
      if (action === 'retain') {
        setInfo({
          title: 'Retained',
          message: `${student.full_name} stays in ${student.class_name}. The decision is saved for this academic year and the student is marked as retained in the class list.`,
        });
      } else if (action === 'remove') {
        setInfo({
          title: 'Removed from report roster',
          message: `${student.full_name} was removed from the active physical report roster. Their online account and academic history remain unchanged. If this was a mistake, use Undo removal below the class list; after that only an administrator can restore the student.`,
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
      if (e?.response?.status === 409) fetchRoster(); // placement changed elsewhere; reload this class
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  const runUndo = async (row: RemovedRow) => {
    setBusyId(row.id);
    try {
      await api.post(`/students/${row.id}/promotion`, { action: 'undo_remove', expected_class_name: selectedClass });
      setInfo({ title: 'Removal undone', message: `${row.full_name} is back in ${row.class_name}. You can now decide on them again.` });
      fetchRoster();
    } catch (e: any) {
      setInfo({ title: 'Could not do that', message: e?.response?.data?.error ?? 'Check your connection and try again.' });
      fetchRoster(); // the list of undoable removals may have changed
    } finally {
      setBusyId(null);
      setConfirmUndo(null);
    }
  };

  const noClassAssigned = classOptions.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <PageContainer style={{ padding: Spacing.md, paddingBottom: 0 }}>
        <Card style={{ marginBottom: Spacing.sm }}>
          <Text style={styles.explainer}>
            For each student in your assigned physical classes, choose whether to promote them to the next class, retain them, or remove them from the active physical report roster. These decisions affect report-roster placement only; online accounts and academic history remain unchanged.
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
        <>
          {classOptions.length > 1 && (
            <PageContainer style={{ paddingHorizontal: Spacing.md }}>
              <Text style={styles.selectorLabel}>Select a class</Text>
              <View style={styles.selectorRow}>
                {classOptions.map(className => (
                  <Btn
                    key={className}
                    label={className}
                    variant={className === selectedClass ? 'primary' : 'outline'}
                    disabled={busyId !== null}
                    onPress={() => chooseClass(className)}
                    accessibilityLabel={`${className}${className === selectedClass ? ', selected' : ''}`}
                    style={styles.selectorBtn}
                  />
                ))}
              </View>
            </PageContainer>
          )}
          {!selectedClass ? (
            <PageContainer style={{ padding: Spacing.md }}>
              <Card>
                <Text style={styles.explainer}>Choose one of your classes above to see its students.</Text>
              </Card>
            </PageContainer>
          ) : loading ? (
            <Loader />
          ) : loadError ? (
            <View style={{ flex: 1, justifyContent: 'center', padding: Spacing.md }}>
              <Empty message={loadError} />
              <Btn label='Retry class roster' variant='outline' onPress={() => fetchRoster()} />
            </View>
          ) : (
            <FlatList
              key={selectedClass}
              data={students}
              keyExtractor={student => student.id}
              removeClippedSubviews={false}
              ListHeaderComponent={classOptions.length > 1 ? <Text style={styles.classHeading}>{selectedClass}</Text> : null}
              ListEmptyComponent={<Empty message={`No active students left to decide on in ${selectedClass}`} />}
              ListFooterComponent={removed.length ? (
                <View style={{ marginTop: Spacing.md }}>
                  <Text style={styles.classHeading}>Removed by you this academic year</Text>
                  {removed.map(row => (
                    <Card key={row.id} style={styles.row}>
                      <Text style={styles.name}>{row.full_name}</Text>
                      {!!row.admission_number && <Text style={styles.sub}>{row.admission_number}</Text>}
                      <Btn label='Undo removal' variant='outline' loading={busyId === row.id} disabled={busyId !== null}
                        onPress={() => setConfirmUndo(row)} style={{ marginTop: Spacing.sm }} />
                    </Card>
                  ))}
                </View>
              ) : null}
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
                    {(() => {
                      const decided = decisionLabel(student.roster_decision);
                      const actions = availableActions(student);
                      return (
                        <>
                          {!!decided && <Text style={styles.decided}>{decided}. Only one decision is allowed per academic year; ask an administrator to correct a mistake.</Text>}
                          {!decided && student.admin_only_promotion && <Text style={styles.sub}>{ADMIN_ONLY_PROMOTION_NOTE}</Text>}
                          {actions.length > 0 && (
                            <View style={styles.actions}>
                              {actions.includes('retain') && (
                                <Btn label='Retain' variant='ghost' loading={busyId === student.id} disabled={busyId !== null}
                                  onPress={() => setConfirm({ student, action: 'retain' })} style={styles.actionBtn} />
                              )}
                              {actions.includes('promote') && (
                                <Btn label='Promote' variant='primary' loading={busyId === student.id} disabled={busyId !== null}
                                  onPress={() => setConfirm({ student, action: 'promote' })} style={styles.actionBtn} />
                              )}
                              {actions.includes('remove') && (
                                <Btn label='Remove' variant='outline' loading={busyId === student.id} disabled={busyId !== null}
                                  onPress={() => setConfirm({ student, action: 'remove' })} style={styles.actionBtn} />
                              )}
                            </View>
                          )}
                        </>
                      );
                    })()}
                  </Card>
                </PageContainer>
              )}
            />
          )}
        </>
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

      {confirmUndo && (
        <ConfirmDialog
          visible
          title='Undo this removal?'
          message={`Put ${confirmUndo.full_name} back in ${confirmUndo.class_name}? You can then retain, promote or remove them again.`}
          confirmLabel='Undo removal'
          onConfirm={() => runUndo(confirmUndo)}
          onCancel={() => setConfirmUndo(null)}
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
  decided: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text, marginTop: Spacing.sm },
  selectorLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  selectorBtn: { paddingVertical: 8, paddingHorizontal: Spacing.md },
  classHeading: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: { flex: 1, minWidth: '30%', paddingVertical: 8 },
});
