// ── ClassSummaryScreen.tsx ────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Card, Loader, Empty, SectionHeader, GradePill } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';

export function ClassSummaryScreen() {
  const { selectedSchoolCode } = useAdminSchool();
  const [classes,   setClasses]   = useState<string[]>([]);
  const [subjects,  setSubjects]  = useState<any[]>([]);
  const [terms,     setTerms]     = useState<any[]>([]);
  const [selClass,  setSelClass]  = useState('');
  const [selTerm,   setSelTerm]   = useState<number | ''>('');
  const [scores,    setScores]    = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  useEffect(() => {
    setLoading(true);
    const sc = selectedSchoolCode ?? undefined;
    Promise.all([
      api.get('/students', { params: { school_code: sc } }),
      api.get('/academic/terms', { params: { school_code: sc } }),
      api.get('/academic/subjects', { params: { school_code: sc } }),
    ])
      .then(([s, t, sub]) => {
        const cls = [...new Set((s.data.students as any[]).map((x: any) => x.class_name))].sort();
        setClasses(cls);
        setSelClass(cls[0] ?? '');
        setTerms(t.data.terms);
        setSubjects(sub.data.subjects);
        const cur = t.data.terms.find((x: any) => x.is_current);
        setSelTerm(cur ? cur.id : '');
      }).catch(() => {}).finally(() => setLoading(false));
  }, [selectedSchoolCode]);

  const fetchScores = async () => {
    if (!selClass || !selTerm) return;
    try {
      // school_code is required here, not optional — class names aren't
      // unique across schools ("JSS1" can exist in more than one), so
      // without this an admin viewing one school's ranking could silently
      // pick up another school's same-named class too. See the matching
      // fix in backend/src/routes/scores.ts (GET /).
      const sc = selectedSchoolCode ?? undefined;
      const { data } = await api.get('/scores', {
        params: { class_name: selClass, term_id: selTerm, school_code: sc },
      });
      setScores(data.scores);
    } catch { } finally { setRefreshing(false); }
  };
  useEffect(() => { fetchScores(); }, [selClass, selTerm]);

  // Aggregate by student
  const byStudent: Record<string, { name: string; total: number; subjects: number }> = {};
  scores.forEach(sc => {
    if (!byStudent[sc.student_id]) byStudent[sc.student_id] = { name: sc.full_name, total: 0, subjects: 0 };
    byStudent[sc.student_id].total += Number(sc.total);
    byStudent[sc.student_id].subjects++;
  });
  const ranked = Object.entries(byStudent)
    .map(([id, d]) => ({ id, ...d, avg: d.subjects ? +(d.total / d.subjects).toFixed(1) : 0 }))
    .sort((a, b) => b.total - a.total);

  if (loading) return <Loader />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchScores(); }} />}
    >
      <SchoolSwitcherBar />
      <Card style={{ margin: Spacing.sm }}>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={selClass} onValueChange={setSelClass}>
            {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={selTerm} onValueChange={v => setSelTerm(Number(v))}>
            {terms.map(t => <Picker.Item key={t.id} label={`${t.name} – ${t.academic_year}`} value={t.id} />)}
          </Picker>
        </View>
      </Card>

      <Card style={{ margin: Spacing.sm }}>
        <SectionHeader title={`${selClass} Rankings`} />
        {ranked.length === 0 ? <Empty message="No scores for this selection" /> : (
          <>
            <View style={styles.tableHeader}>
              {['Pos','Student','Subjects','Total','Avg'].map(h => (
                <Text key={h} style={[styles.th, h === 'Student' && { flex: 2 }]}>{h}</Text>
              ))}
            </View>
            {ranked.map((r, i) => (
              <View key={r.id} style={[styles.row, i % 2 === 0 && { backgroundColor: '#F5F7FA' }, i < 3 && { borderLeftWidth: 3, borderLeftColor: ['#FFD700','#C0C0C0','#CD7F32'][i] }]}>
                <Text style={styles.td}>{i + 1}</Text>
                <Text style={[styles.td, { flex: 2, textAlign: 'left' }]} numberOfLines={1}>{r.name}</Text>
                <Text style={styles.td}>{r.subjects}</Text>
                <Text style={[styles.td, { fontWeight: '700' }]}>{r.total}</Text>
                <Text style={[styles.td, { color: Colors.primary }]}>{r.avg}%</Text>
              </View>
            ))}
          </>
        )}
      </Card>
    </ScrollView>
  );
}

// ── AuditLogScreen.tsx ────────────────────────────────────────────────────────
export function AuditLogScreen() {
  const { selectedSchoolCode } = useAdminSchool();
  const [logs,    setLogs]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/audit-log', { params: { school_code: selectedSchoolCode ?? undefined } })
      .then(({ data }) => setLogs(data.audit_log)).catch(() => {}).finally(() => setLoading(false));
  }, [selectedSchoolCode]);

  if (loading) return <Loader />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.sm }}>
      <SchoolSwitcherBar />
      {logs.length === 0 ? <Empty message="No audit log entries" /> : logs.map(l => (
        <View key={l.id} style={styles.logRow}>
          <View style={styles.logDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.logAction}>{l.action} → {l.entity}</Text>
            <Text style={styles.logMeta}>{l.actor_name} · {new Date(l.created_at).toLocaleString()}</Text>
            {l.detail && <Text style={styles.logDetail}>{l.detail}</Text>}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ── DeletedStudentsScreen.tsx ──────────────────────────────────────────────────
// Admin-only. Lists every soft-deleted student (see backend/schema.sql —
// students.deleted_at/deleted_by) for the currently-selected school, with a
// one-tap Restore. This is the "bring back deleted records" side of the
// teacher-delete change: a teacher can delete a student under their own
// class/subject care without asking admin first, but nothing is ever gone
// for good — it just moves here until an admin restores it (or leaves it
// here indefinitely; nothing auto-purges it).
export function DeletedStudentsScreen() {
  const { selectedSchoolCode } = useAdminSchool();
  const [students,  setStudents]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchDeleted = async () => {
    try {
      const { data } = await api.get('/students/deleted', {
        params: { school_code: selectedSchoolCode ?? undefined },
      });
      setStudents(data.students ?? []);
    } catch { } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { setLoading(true); fetchDeleted(); }, [selectedSchoolCode]);

  const restore = (id: string, name: string) => {
    Alert.alert('Restore student?', `${name} will reappear in the student list and all their scores/attendance history will be reachable again.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Restore', onPress: async () => {
        setRestoringId(id);
        try {
          await api.post(`/students/${id}/restore`);
          fetchDeleted();
        } catch (e: any) {
          Alert.alert('Error', e?.response?.data?.error ?? 'Could not restore this student');
        } finally { setRestoringId(null); }
      }},
    ]);
  };

  if (loading) return <Loader />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: Spacing.sm }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDeleted(); }} />}
    >
      <SchoolSwitcherBar />
      {students.length === 0 ? <Empty message="No deleted students for this school" /> : students.map(s => (
        <Card key={s.id} style={{ marginBottom: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.deletedName}>{s.full_name}</Text>
              <Text style={styles.logMeta}>{s.class_name} · {s.admission_number ?? 'No Adm. No.'}</Text>
              <Text style={styles.logMeta}>
                Deleted {new Date(s.deleted_at).toLocaleString()}
                {s.deleted_by_name ? ` by ${s.deleted_by_name} (${s.deleted_by_role})` : ''}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => restore(s.id, s.full_name)}
              disabled={restoringId === s.id}
              style={styles.restoreBtn}
            >
              <Text style={styles.restoreBtnTxt}>{restoringId === s.id ? 'Restoring…' : 'Restore'}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  pickerWrap:  { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white, marginBottom: Spacing.sm },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: 6, marginBottom: 4 },
  th:          { flex: 1, color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.xs, textAlign: 'center' },
  row:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderColor: Colors.border },
  td:          { flex: 1, fontSize: Fonts.sizes.xs, color: Colors.text, textAlign: 'center' },
  logRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: 6, elevation: 1 },
  logDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 5 },
  logAction:   { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  logMeta:     { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  logDetail:   { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2, fontStyle: 'italic' },
  deletedName: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  restoreBtn:    { backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingVertical: 8, paddingHorizontal: 14 },
  restoreBtnTxt: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.sm },
});
