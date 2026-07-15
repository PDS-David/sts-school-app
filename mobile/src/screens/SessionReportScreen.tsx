import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import api from '../api/client';
import { Card, Loader, Empty, GradePill, RowItem, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useWards } from '../api/WardContext';
import { getSchoolBrand } from '../schoolBranding';

// A session is fixed at exactly 3 terms (1st, 2nd, 3rd). This screen collates
// whichever terms have been entered so far for the resolved academic year
// into a running session total per subject — it works correctly even before
// the 3rd term exists, and clearly flags that the session isn't complete yet.
export default function SessionReportScreen({ route }: any) {
  const { parentStudentId, academic_year: academicYearParam } = route?.params ?? {};
  const { user } = useAuth();
  const { selectedWardId } = useWards();
  const effectiveWardId = parentStudentId ?? selectedWardId;

  const [report,     setReport]     = useState<any>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState('');

  const fetchReport = async () => {
    setError('');
    try {
      let studentId = '';
      if (user?.role === 'parent' && effectiveWardId) {
        studentId = effectiveWardId;
      } else if (user?.role === 'parent') {
        setError('Select a child on the Dashboard first.');
        return;
      } else if (user?.role === 'student') {
        const s = await api.get('/students/me');
        const myStudent = s.data.students[0];
        if (!myStudent) { setError('No student record linked to your account.'); return; }
        studentId = myStudent.id;
      } else if ((user?.role === 'admin' || user?.role === 'teacher') && effectiveWardId) {
        // effectiveWardId falls back to parentStudentId — the id passed in from
        // MyResultsScreen's "View Session Report" button, or directly from
        // StudentDetailScreen. Neither admin nor teacher has a WardContext
        // selection, so effectiveWardId here is always the explicit param.
        studentId = effectiveWardId;
      } else if (user?.role === 'admin' || user?.role === 'teacher') {
        setError('No student selected.');
        return;
      }
      const qs = academicYearParam ? `?academic_year=${encodeURIComponent(academicYearParam)}` : '';
      const { data } = await api.get(`/scores/session-report/${studentId}${qs}`);
      setReport(data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not load session report');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchReport(); }, [effectiveWardId, academicYearParam]);

  if (loading) return <Loader />;
  if (error)   return <Empty message={error} />;
  if (!report || !report.student) return <Empty message="No session report available" />;

  const { student, academic_year, terms, terms_present, is_complete_session, subjects, attendance, summary } = report;
  const brand = getSchoolBrand(student.school_code);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReport(); }} />}
    >
      {brand && (
        <View style={styles.letterhead}>
          <Image source={brand.logo} style={styles.letterheadLogo} resizeMode="contain" />
          <Text style={styles.letterheadName}>{brand.name}</Text>
          <Text style={styles.letterheadMotto}>{brand.motto}</Text>
          <Text style={styles.letterheadDoc}>SESSION REPORT — {academic_year}</Text>
        </View>
      )}

      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.full_name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName}>{student.full_name}</Text>
          <Text style={styles.studentMeta}>{student.class_name}  ·  Adm: {student.admission_number ?? '—'}</Text>
        </View>
      </View>

      {!is_complete_session && (
        <Card style={{ backgroundColor: '#FFF7E6', borderColor: '#F0B429', borderWidth: 1 }}>
          <Text style={styles.pendingTxt}>
            ⏳ Session in progress — {terms_present} of 3 terms recorded so far
            ({terms.map((t: any) => t.name).join(', ')}). Totals below reflect only
            the terms entered; they'll update automatically once the remaining
            term's scores are in.
          </Text>
        </Card>
      )}

      <Card>
        <SectionHeader title={`${academic_year} Session Summary`} right={is_complete_session ? <Badge label="Complete" color={Colors.success} /> : <Badge label="In progress" color="#F0B429" />} />
        <RowItem label="Terms Recorded" value={`${terms_present} / 3`} />
        <RowItem label="Days Opened (session)"  value={attendance?.days_opened ?? 0} />
        <RowItem label="Days Present (session)" value={attendance?.days_present ?? 0} />
        <RowItem label="Subjects" value={summary.subject_count} />
        <RowItem label="Session Grand Total" value={summary.grand_total} />
        <RowItem label="Session Average" value={`${summary.grand_average}%`} />
      </Card>

      <Card>
        <SectionHeader title="Subject Collation (1st + 2nd + 3rd Term)" />
        <View style={styles.tableHeader}>
          {['Subject', ...terms.map((t: any) => shortTermLabel(t.name)), 'Total', 'Avg', 'Grade'].map((h, i) => (
            <Text key={i} style={[styles.thCell, i === 0 && { flex: 2 }]}>{h}</Text>
          ))}
        </View>
        {subjects.map((s: any) => (
          <View key={s.subject_id} style={styles.tableRow}>
            <Text style={[styles.tdCell, { flex: 2 }]} numberOfLines={1}>{s.subject_name}</Text>
            {s.term_scores.map((ts: any) => (
              <Text key={ts.term_id} style={styles.tdCell}>{ts.total ?? '—'}</Text>
            ))}
            <Text style={[styles.tdCell, { fontWeight: '700' }]}>{s.session_total}</Text>
            <Text style={styles.tdCell}>{s.session_average}</Text>
            {s.session_grade ? <GradePill grade={s.session_grade} /> : <Text style={styles.tdCell}>—</Text>}
          </View>
        ))}
        {!subjects.length && <Text style={styles.pendingTxt}>No scores recorded for any term in this session yet.</Text>}
      </Card>
    </ScrollView>
  );
}

function shortTermLabel(name: string) {
  const m = name.match(/^(\d)/);
  return m ? `T${m[1]}` : name;
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
  pendingTxt:  { fontSize: Fonts.sizes.xs, color: Colors.text, lineHeight: 18 },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.primary + '15', borderRadius: 4, padding: 4, marginBottom: 2 },
  tableRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: Colors.border },
  thCell:      { flex: 1, fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary, textAlign: 'center' },
  tdCell:      { flex: 1, fontSize: Fonts.sizes.xs, color: Colors.text, textAlign: 'center' },
});
