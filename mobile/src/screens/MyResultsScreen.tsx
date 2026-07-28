import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Loader, Empty, GradePill, RowItem, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useWards } from '../api/WardContext';
import { getSchoolBrand } from '../schoolBranding';

export default function MyResultsScreen({ route, navigation }: any) {
  // A parent can pass a specific parentStudentId via route (e.g. from a student
  // detail link); otherwise we fall back to whichever child is selected in the
  // dashboard's child-switcher, so "Ward's Results" always shows exactly one
  // child's report — never a blend of siblings.
  const { parentStudentId } = route?.params ?? {};
  const { user } = useAuth();
  const { selectedWardId } = useWards();
  const effectiveWardId = parentStudentId ?? selectedWardId;

  const [report,    setReport]    = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [error,     setError]     = useState('');

  const fetchReport = async () => {
    setError('');
    try {
      // For student: backend resolves from JWT. For parent: pass ward's student_id.
      // For admin/teacher: parentStudentId is passed in directly (e.g. from
      // StudentDetailScreen's "View Results" button) since neither role has a
      // "ward" of their own — reuse the same param name rather than adding a
      // second one, but resolve it under its own branch.
      let url = '';
      if (user?.role === 'parent' && effectiveWardId) {
        url = `/scores/report/${effectiveWardId}`;
      } else if (user?.role === 'parent') {
        setError('Select a child on the Dashboard first.');
        return;
      } else if (user?.role === 'student') {
        // Fetch own student record first to get id
        const s = await api.get('/students/me');
        // students.user_id is UNIQUE at the DB level (added specifically to
        // guarantee this), so more than one row here should be impossible —
        // this is just a canary in case that's ever somehow bypassed, so it
        // shows up in logs instead of silently picking [0] with no trace.
        if (s.data.students?.length > 1) {
          console.warn('[MyResultsScreen] /students/me returned more than one linked student — using the first.');
        }
        const myStudent = s.data.students[0];
        if (!myStudent) { setError('No student record linked to your account.'); return; }
        url = `/scores/report/${myStudent.id}`;
      } else if ((user?.role === 'admin' || user?.role === 'teacher') && parentStudentId) {
        url = `/scores/report/${parentStudentId}`;
      } else if (user?.role === 'admin' || user?.role === 'teacher') {
        setError('No student selected.');
        return;
      }
      const { data } = await api.get(url);
      setReport(data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not load report');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchReport(); }, [effectiveWardId]);

  if (loading) return <Loader />;
  if (error)   return <Empty message={error} />;
  if (!report || !report.student) return <Empty message="No report available" />;

  const { student, term, scores, attendance, class_record, summary } = report;
  const brand = getSchoolBrand(student.school_code);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReport(); }} />}
    >
      {/* Official letterhead */}
      {brand && (
        <View style={styles.letterhead}>
          <Image source={brand.logo} style={styles.letterheadLogo} resizeMode="contain" />
          <Text style={styles.letterheadName}>{brand.name}</Text>
          <Text style={styles.letterheadMotto}>{brand.motto}</Text>
          <Text style={styles.letterheadDoc}>TERM REPORT CARD</Text>
        </View>
      )}

      {/* Student info */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.full_name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName}>{student.full_name}</Text>
          <Text style={styles.studentMeta}>{student.class_name}  ·  Adm: {student.admission_number ?? '—'}</Text>
        </View>
      </View>

      {/* Term info */}
      <Card>
        <SectionHeader title={term?.name ?? ''} />
        <RowItem label="Academic Year"  value={term?.academic_year ?? '—'} />
        <RowItem label="Days Opened"    value={attendance?.days_opened ?? 0} />
        <RowItem label="Days Present"   value={attendance?.days_present ?? 0} />
        <RowItem label="Subjects Taken" value={summary.subject_count} />
        <RowItem label="Total Score"    value={summary.total_score} />
        <RowItem label="Average"        value={`${summary.average}%`} />
      </Card>

      {/* Session collation — 1st + 2nd + 3rd term totalled together */}
      <Btn
        label="View Session Report (1st + 2nd + 3rd Term)"
        variant="outline"
        onPress={() => navigation.navigate('SessionReport', { parentStudentId })}
        style={{ marginBottom: Spacing.sm }}
      />

      {/* Scores table */}
      <Card>
        <SectionHeader title="Subject Scores" />
        {scores.length === 0 ? (
          <Empty message="No scores have been entered yet for this term." />
        ) : (
          <>
            {/* Single combined "CA" column (CA1 + CA2) rather than two separate
                CA1/CA2 columns — the underlying scores still store ca1 and ca2
                separately (unchanged, so score entry and validation are
                unaffected), this just documents/presents them as one CA here. */}
            <View style={styles.tableHeader}>
              {['Subject','CA','Exam','Total','Grade'].map(h => (
                <Text key={h} style={[styles.thCell, h === 'Subject' && { flex: 2 }]}>{h}</Text>
              ))}
            </View>
            {scores.map((s: any) => (
              <View key={s.subject_id} style={styles.tableRow}>
                <Text style={[styles.tdCell, { flex: 2 }]} numberOfLines={1}>{s.subject_name}</Text>
                <Text style={styles.tdCell}>{Number(s.ca1) + Number(s.ca2)}</Text>
                <Text style={styles.tdCell}>{s.exam}</Text>
                <Text style={[styles.tdCell, { fontWeight: '700' }]}>{s.total}</Text>
                <GradePill grade={s.grade} />
              </View>
            ))}
          </>
        )}
      </Card>

      {/* Class averages */}
      <Card>
        <SectionHeader title="Class Performance" />
        {scores.length === 0 ? (
          <Empty message="Class performance data will appear once scores are entered." />
        ) : (
          <>
            {scores.map((s: any) => (
              <View key={s.subject_id} style={styles.tableRow}>
                <Text style={[styles.tdCell, { flex: 2 }]} numberOfLines={1}>{s.subject_name}</Text>
                <Text style={styles.tdCell}>{s.class_average ?? '—'}</Text>
                <Text style={styles.tdCell}>{s.class_highest ?? '—'}</Text>
              </View>
            ))}
            <View style={[styles.tableHeader, { marginTop: 4 }]}>
              <Text style={[styles.thCell, { flex: 2 }]}>Subject</Text>
              <Text style={styles.thCell}>Avg</Text>
              <Text style={styles.thCell}>Highest</Text>
            </View>
          </>
        )}
      </Card>

      {/* Remarks */}
      {(class_record?.class_teacher_remark || class_record?.admin_remark) && (
        <Card>
          <SectionHeader title="Remarks" />
          {class_record?.class_teacher_remark
            ? <RowItem label="Class Teacher" value={class_record.class_teacher_remark} />
            : null
          }
          {class_record?.admin_remark
            ? <RowItem label="Head/Principal" value={class_record.admin_remark} />
            : null
          }
        </Card>
      )}

      {term?.next_term_begins && (
        <Card style={{ marginBottom: Spacing.xl }}>
          <Text style={styles.nextTerm}>📅  Next term begins: {term.next_term_begins}</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background, padding: Spacing.sm },
  letterhead:  { alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  letterheadLogo: { width: 64, height: 64, borderRadius: 32, marginBottom: 6 },
  letterheadName: { fontSize: Fonts.sizes.md, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  letterheadMotto:{ fontSize: Fonts.sizes.xs, color: Colors.textSub, fontStyle: 'italic', textAlign: 'center', marginTop: 2, paddingHorizontal: Spacing.md },
  letterheadDoc:  { fontSize: Fonts.sizes.xs, color: Colors.text, fontWeight: '700', marginTop: 8, letterSpacing: 1 },
  headerCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md },
  avatar:      { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.white + '30', alignItems: 'center', justifyContent: 'center' },
  avatarText:  { color: Colors.white, fontSize: Fonts.sizes.xl, fontWeight: '800' },
  studentName: { color: Colors.white, fontSize: Fonts.sizes.lg, fontWeight: '700' },
  studentMeta: { color: Colors.white + 'CC', fontSize: Fonts.sizes.sm, marginTop: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.primary + '15', borderRadius: 4, padding: 4, marginBottom: 2 },
  tableRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: Colors.border },
  thCell:      { flex: 1, fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary, textAlign: 'center' },
  tdCell:      { flex: 1, fontSize: Fonts.sizes.xs, color: Colors.text, textAlign: 'center' },
  nextTerm:    { textAlign: 'center', color: Colors.primary, fontWeight: '600', fontSize: Fonts.sizes.sm },
});
