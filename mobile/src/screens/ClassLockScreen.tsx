import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Loader, Empty, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageContainer, useIsWide } from '../components/layout';

interface Term { id: number; name: string; academic_year: string; }
interface ClassLock { id: number; class_name: string; term_id: number; locked_by_name: string | null; locked_at: string; }

// Added at the school owner's explicit request as a deliberately simpler
// alternative to per-record conflict resolution: a class teacher can "close"
// her own class's records for a term, blocking every score/attendance/
// remark/weekly-effort write to that class — including her own — until it's
// unlocked again. See backend/src/utils/scope.ts for where this is actually
// enforced; this screen just manages the lock itself.
export default function ClassLockScreen({ navigation }: any) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { selectedSchoolCode } = useAdminSchool();
  const effectiveSchoolCode = isAdmin ? selectedSchoolCode : user?.school_code ?? null;
  // Placed here, with the component's other hooks, before any early return
  // below — see ScoreEntryScreen.tsx's own fix for why this ordering
  // matters (a hook called only on some renders crashes the whole tree).
  const isWide = useIsWide();

  // Compact switcher lives in the native header now (admin only — a class
  // teacher has one fixed school_code, nothing to switch), not as a
  // full-width block in the content area — see SchoolSwitcherBar.tsx's
  // `compact` doc.
  useEffect(() => {
    navigation.setOptions({ headerRight: isAdmin ? () => <SchoolSwitcherBar compact /> : undefined });
  }, [navigation, isAdmin]);

  const [classes,  setClasses]  = useState<string[]>([]);
  const [terms,    setTerms]    = useState<Term[]>([]);
  const [selClass, setSelClass] = useState('');
  const [selTerm,  setSelTerm]  = useState<number | ''>('');
  const [lock,     setLock]     = useState<ClassLock | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [setupError, setSetupError] = useState('');
  const [setupRetry, setSetupRetry] = useState(0);
  const [lockLoading, setLockLoading] = useState(false);
  const [lockError, setLockError] = useState('');
  const [lockRetry, setLockRetry] = useState(0);
  const [confirmLock, setConfirmLock] = useState<boolean | null>(null);
  const [infoDialog, setInfoDialog] = useState<{ title: string; message: string } | null>(null);
  const [busy,     setBusy]     = useState(false);

  // Teacher: only their own assigned class is relevant here at all — they
  // can't lock/unlock anyone else's (enforced server-side too). Admin:
  // picks from every class in whichever school is selected in the switcher.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSetupError('');
    setClasses([]);
    setTerms([]);
    setSelClass('');
    setSelTerm('');
    setLock(null);
    if (isAdmin && !effectiveSchoolCode) {
      setSetupError('Select a school before managing class locks.');
      setLoading(false);
      return;
    }
    const sc = effectiveSchoolCode ?? undefined;
    if (!isAdmin) {
      if (user?.assigned_class) setSelClass(user.assigned_class);
      api.get('/academic/terms', { params: { school_code: sc } })
        .then(({ data }) => {
          if (!cancelled) {
            setTerms(data.terms ?? []);
            const current = (data.terms ?? []).find((term: any) => term.is_current);
            if (current) setSelTerm(current.id);
          }
        })
        .catch((e: any) => { if (!cancelled) setSetupError(e?.response?.data?.error ?? 'Could not load academic terms. Retry before changing a class lock.'); })
        .finally(() => { if (!cancelled) setLoading(false); });
    } else {
      Promise.all([
        api.get('/academic/classes', { params: { school_code: sc } }),
        api.get('/academic/terms',   { params: { school_code: sc } }),
      ]).then(([classesRes, termsRes]) => {
        if (cancelled) return;
        const names = (classesRes.data.classes ?? []).map((x: any) => x.name);
        const schoolTerms = termsRes.data.terms ?? [];
        setClasses(names);
        setTerms(schoolTerms);
        if (names.length) setSelClass(names[0]);
        const current = schoolTerms.find((term: any) => term.is_current);
        if (current) setSelTerm(current.id);
      }).catch((e: any) => { if (!cancelled) setSetupError(e?.response?.data?.error ?? 'Could not load classes and terms for this school. Retry before changing a class lock.'); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }
    return () => { cancelled = true; };
  }, [isAdmin, effectiveSchoolCode, setupRetry]);

  const fetchLock = useCallback(async () => {
    if (!selClass || !selTerm) { setLock(null); setLockError(''); setLockLoading(false); return; }
    setLockLoading(true);
    setLockError('');
    try {
      const { data } = await api.get('/academic/class-locks', {
        params: { class_name: selClass, term_id: selTerm, school_code: isAdmin ? effectiveSchoolCode ?? undefined : undefined },
      });
      setLock(data.lock ?? null);
    } catch (e: any) {
      setLock(null);
      setLockError(e?.response?.data?.error ?? 'Could not verify the current lock status. Retry before changing this class.');
    } finally { setLockLoading(false); }
  }, [selClass, selTerm, isAdmin, effectiveSchoolCode, lockRetry]);

  useEffect(() => { fetchLock(); }, [fetchLock]);

  const toggleLock = async (locked: boolean) => {
    if (!selClass || !selTerm || busy || lockLoading || lockError) return;
    setBusy(true);
    try {
      await api.put('/academic/class-locks', {
        class_name: selClass,
        term_id: selTerm,
        school_code: isAdmin ? effectiveSchoolCode ?? undefined : undefined,
        locked,
      });
      await fetchLock();
      setInfoDialog({
        title: locked ? 'Class locked' : 'Class unlocked',
        message: locked
          ? `${selClass} is now closed for this term. Scores, attendance, remarks and weekly efforts cannot be saved until it is unlocked.`
          : `${selClass} is open again for this term.`,
      });
    } catch (e: any) {
      setInfoDialog({ title: 'Could not update class lock', message: e?.response?.data?.error ?? 'Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader />;
  if (setupError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={setupError} />
      <Btn label='Retry class and term setup' variant='outline' onPress={() => setSetupRetry(v => v + 1)} />
    </View>
  );

  const noClassAssigned = !isAdmin && !user?.assigned_class;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView>
      <PageContainer style={{ padding: Spacing.md }}>
        <Card style={{ marginBottom: Spacing.md }}>
          <Text style={styles.explainer}>
            Locking a class stops any further changes to its scores, attendance,
            remarks, and weekly efforts for the selected term — for every
            teacher, including you. Use this once a term's records are final,
            e.g. just before report cards are printed. You can unlock it again
            any time to make a correction.
          </Text>
        </Card>

        {noClassAssigned ? (
          <Card><Text style={styles.explainer}>You aren't set as the class teacher for any class, so there's nothing here for you to lock. Ask an admin if this looks wrong.</Text></Card>
        ) : (
          <>
            <SectionHeader title="Class & Term" />
            <Card style={{ marginBottom: Spacing.md }}>
              <View style={isWide ? styles.filterRow : undefined}>
                <View style={isWide ? styles.filterCol : undefined}>
                  {isAdmin ? (
                    <>
                      <Text style={styles.label}>Class</Text>
                      <View style={styles.pickerWrap}>
                        <Picker selectedValue={selClass} onValueChange={setSelClass}>
                          <Picker.Item label="Select a class…" value="" />
                          {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
                        </Picker>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.label}>Class</Text>
                      <Text style={styles.readonlyValue}>{selClass}</Text>
                    </>
                  )}
                </View>

                <View style={isWide ? styles.filterCol : undefined}>
                  <Text style={[styles.label, isWide ? undefined : { marginTop: Spacing.sm }]}>Term</Text>
                  <View style={styles.pickerWrap}>
                    <Picker selectedValue={selTerm} onValueChange={(v) => setSelTerm(v as number | '')}>
                      <Picker.Item label="Select a term…" value="" />
                      {terms.map(t => <Picker.Item key={t.id} label={`${t.name} (${t.academic_year})`} value={t.id} />)}
                    </Picker>
                  </View>
                  {terms.length === 0 ? <Text style={styles.statusSub}>No academic terms are available for this school.</Text> : null}
                </View>
              </View>
            </Card>

            {selClass && selTerm !== '' && (
              lockLoading ? <Loader /> : lockError ? (
                <Card>
                  <Empty message={lockError} />
                  <Btn label='Retry lock status' variant='outline' onPress={() => setLockRetry(v => v + 1)} />
                </Card>
              ) : (
                <Card>
                  <View style={styles.statusRow}>
                    <Ionicons
                      name={lock ? 'lock-closed' : 'lock-open-outline'}
                      size={22}
                      color={lock ? Colors.error : Colors.success}
                    />
                    <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                      <Text style={styles.statusTitle}>{lock ? 'Locked' : 'Open'}</Text>
                      {lock && (
                        <Text style={styles.statusSub}>
                          Locked by {lock.locked_by_name ?? 'a class teacher'} on{' '}
                          {new Date(lock.locked_at).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Btn
                    label={lock ? 'Unlock This Class' : 'Lock This Class'}
                    onPress={() => setConfirmLock(!lock)}
                    loading={busy}
                    disabled={busy || lockLoading}
                    variant={lock ? 'outline' : 'primary'}
                    style={{ marginTop: Spacing.sm }}
                  />
                </Card>
              )
            )}
          </>
        )}
      </PageContainer>
      </ScrollView>
      <ConfirmDialog
        visible={confirmLock !== null}
        title={confirmLock ? 'Lock this class?' : 'Unlock this class?'}
        message={confirmLock
          ? `Lock ${selClass} for this term? This blocks score, attendance, remark and weekly-effort changes for all teachers until it is unlocked.`
          : `Unlock ${selClass} for this term? Teachers will be able to edit score, attendance, remark and weekly-effort records again.`}
        confirmLabel={confirmLock ? 'Lock class' : 'Unlock class'}
        destructive={confirmLock === true}
        onConfirm={() => { const value = confirmLock; setConfirmLock(null); if (value !== null) toggleLock(value); }}
        onCancel={() => setConfirmLock(null)}
      />
      <ConfirmDialog visible={!!infoDialog} title={infoDialog?.title ?? ''} message={infoDialog?.message ?? ''} hideCancel onConfirm={() => setInfoDialog(null)} onCancel={() => setInfoDialog(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  explainer: { fontSize: Fonts.sizes.sm, color: Colors.textSub, lineHeight: 20 },
  label: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: 4, fontWeight: '600' },
  readonlyValue: { fontSize: Fonts.sizes.md, color: Colors.text, fontWeight: '700', paddingVertical: 6 },
  pickerWrap: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm },
  filterRow:   { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  filterCol:   { flex: 1, minWidth: 0 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  statusSub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
