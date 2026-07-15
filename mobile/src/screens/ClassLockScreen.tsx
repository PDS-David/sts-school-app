import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Loader, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';

interface Term { id: number; name: string; academic_year: string; }
interface ClassLock { id: number; class_name: string; term_id: number; locked_by_name: string | null; locked_at: string; }

// Added at the school owner's explicit request as a deliberately simpler
// alternative to per-record conflict resolution: a class teacher can "close"
// her own class's records for a term, blocking every score/attendance/
// remark/weekly-effort write to that class — including her own — until it's
// unlocked again. See backend/src/utils/scope.ts for where this is actually
// enforced; this screen just manages the lock itself.
export default function ClassLockScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { selectedSchoolCode } = useAdminSchool();
  const effectiveSchoolCode = isAdmin ? selectedSchoolCode : user?.school_code ?? null;

  const [classes,  setClasses]  = useState<string[]>([]);
  const [terms,    setTerms]    = useState<Term[]>([]);
  const [selClass, setSelClass] = useState('');
  const [selTerm,  setSelTerm]  = useState<number | ''>('');
  const [lock,     setLock]     = useState<ClassLock | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [busy,     setBusy]     = useState(false);

  // Teacher: only their own assigned class is relevant here at all — they
  // can't lock/unlock anyone else's (enforced server-side too). Admin:
  // picks from every class in whichever school is selected in the switcher.
  useEffect(() => {
    if (isAdmin && !effectiveSchoolCode) { setLoading(false); return; }
    setLoading(true);
    const sc = effectiveSchoolCode ?? undefined;
    if (!isAdmin) {
      if (user?.assigned_class) setSelClass(user.assigned_class);
      api.get('/academic/terms', { params: { school_code: sc } })
        .then(t => { setTerms(t.data.terms); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      Promise.all([
        api.get('/academic/classes', { params: { school_code: sc } }),
        api.get('/academic/terms',   { params: { school_code: sc } }),
      ]).then(([c, t]) => {
        setClasses(c.data.classes.map((x: any) => x.name));
        setTerms(t.data.terms);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [isAdmin, effectiveSchoolCode]);

  const fetchLock = useCallback(() => {
    if (!selClass || !selTerm) { setLock(null); return; }
    api.get('/academic/class-locks', {
      params: { class_name: selClass, term_id: selTerm, school_code: isAdmin ? effectiveSchoolCode ?? undefined : undefined },
    }).then(({ data }) => setLock(data.lock)).catch(() => setLock(null));
  }, [selClass, selTerm, isAdmin, effectiveSchoolCode]);

  useEffect(() => { fetchLock(); }, [fetchLock]);

  const toggleLock = async (locked: boolean) => {
    if (!selClass || !selTerm) return;
    setBusy(true);
    try {
      await api.put('/academic/class-locks', {
        class_name: selClass,
        term_id: selTerm,
        school_code: isAdmin ? effectiveSchoolCode ?? undefined : undefined,
        locked,
      });
      fetchLock();
      Alert.alert(locked ? 'Class locked' : 'Class unlocked', locked
        ? `${selClass} is now closed for this term — no scores, attendance, remarks, or weekly efforts can be saved until it's unlocked.`
        : `${selClass} is open again for this term.`);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not update the lock. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader />;

  const noClassAssigned = !isAdmin && !user?.assigned_class;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        {isAdmin && <SchoolSwitcherBar />}

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

              <Text style={[styles.label, { marginTop: Spacing.sm }]}>Term</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={selTerm} onValueChange={(v) => setSelTerm(v as number | '')}>
                  <Picker.Item label="Select a term…" value="" />
                  {terms.map(t => <Picker.Item key={t.id} label={`${t.name} (${t.academic_year})`} value={t.id} />)}
                </Picker>
              </View>
            </Card>

            {selClass && selTerm !== '' && (
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
                  onPress={() => toggleLock(!lock)}
                  loading={busy}
                  variant={lock ? 'outline' : 'primary'}
                  style={{ marginTop: Spacing.sm }}
                />
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  explainer: { fontSize: Fonts.sizes.sm, color: Colors.textSub, lineHeight: 20 },
  label: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: 4, fontWeight: '600' },
  readonlyValue: { fontSize: Fonts.sizes.md, color: Colors.text, fontWeight: '700', paddingVertical: 6 },
  pickerWrap: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  statusSub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
