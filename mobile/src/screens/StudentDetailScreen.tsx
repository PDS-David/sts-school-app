import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { Card, Btn, Input, Loader, Empty, SectionHeader, RowItem, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

export default function StudentDetailScreen({ route, navigation }: any) {
  const { studentId } = route.params as { studentId: string };
  const { user } = useAuth();
  const isAdmin   = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher' || isAdmin;

  const [student,   setStudent]   = useState<any>(null);
  const [report,    setReport]    = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  // Class-record editing
  const [ctRemark,  setCtRemark]  = useState('');
  const [admRemark, setAdmRemark] = useState('');
  const [saving,    setSaving]    = useState(false);

  // Login / parent linking (admin only)
  const [showLoginPicker,  setShowLoginPicker]  = useState(false);
  const [loginCandidates,  setLoginCandidates]  = useState<any[]>([]);
  const [showParentPicker, setShowParentPicker] = useState(false);
  const [parentCandidates, setParentCandidates] = useState<any[]>([]);
  const [linking, setLinking] = useState(false);

  // Term-PIN management (admin only) — generate/re-issue a term PIN for
  // this student and see whether it's been redeemed yet.
  const TERM_LABELS = ['1st Term', '2nd Term', '3rd Term'];
  const [pinTermLabel, setPinTermLabel] = useState(TERM_LABELS[0]);
  const [termPins, setTermPins]         = useState<any[]>([]);
  const [pinLoading, setPinLoading]     = useState(false);

  const fetchTermPins = async () => {
    try {
      const { data } = await api.get(`/admin/term-pins?student_id=${studentId}`);
      setTermPins(data.term_pins ?? []);
    } catch { /* non-critical */ }
  };

  const generatePin = async () => {
    setPinLoading(true);
    try {
      await api.post('/admin/term-pins', { student_id: studentId, term_label: pinTermLabel });
      fetchTermPins();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not generate PIN');
    } finally {
      setPinLoading(false);
    }
  };

  const fetch = async () => {
    try {
      const [s, r] = await Promise.all([
        api.get(`/students/${studentId}`),
        api.get(`/scores/report/${studentId}`).catch(() => ({ data: null })),
      ]);
      setStudent(s.data.student);
      if (r.data) {
        setReport(r.data);
        setCtRemark(r.data.class_record?.class_teacher_remark ?? '');
        setAdmRemark(r.data.class_record?.admin_remark ?? '');
      }
    } catch {
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetch(); }, [studentId]);
  useEffect(() => { if (isAdmin) fetchTermPins(); }, [studentId]);

  const saveRemarks = async () => {
    if (!report?.term) { Alert.alert('No active term'); return; }
    setSaving(true);
    try {
      await api.put('/attendance/class-records', {
        student_id: studentId,
        term_id: report.term.id,
        class_teacher_remark: ctRemark || null,
        admin_remark: isAdmin ? (admRemark || null) : undefined,
      });
      Alert.alert('Saved', 'Remarks saved successfully.');
      fetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Save failed');
    } finally { setSaving(false); }
  };

  const deleteStudent = () => {
    Alert.alert(
      'Delete Student',
      `Remove ${student?.full_name} from the active student list? ` +
      (isAdmin
        ? 'An admin can restore this from Deleted Students at any time — nothing is permanently erased.'
        : 'This can be undone by an admin from the Deleted Students screen — nothing is permanently erased.'),
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/students/${studentId}`);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.error ?? 'Could not delete this student');
          }
        }},
      ],
    );
  };

  const openLoginPicker = async () => {
    try {
      const { data } = await api.get(`/admin/student-logins-without-link?school_code=${student.school_code}`);
      setLoginCandidates(data.users ?? []);
      setShowLoginPicker(true);
    } catch {
      Alert.alert('Error', 'Could not load available student logins');
    }
  };

  const linkLogin = async (userId: string) => {
    setLinking(true);
    try {
      await api.post(`/students/${studentId}/link-user`, { user_id: userId });
      setShowLoginPicker(false);
      fetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not link login');
    } finally { setLinking(false); }
  };

  const unlinkLogin = () => {
    Alert.alert('Unlink login?', 'The student will no longer be able to sign in as this student record.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unlink', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/students/${studentId}/unlink-user`);
          fetch();
        } catch (e: any) {
          Alert.alert('Error', e?.response?.data?.error ?? 'Could not unlink login');
        }
      }},
    ]);
  };

  const openParentPicker = async () => {
    try {
      const { data } = await api.get(`/admin/parent-logins?school_code=${student.school_code}`);
      setParentCandidates(data.users ?? []);
      setShowParentPicker(true);
    } catch {
      Alert.alert('Error', 'Could not load parent accounts');
    }
  };

  const linkParent = async (parentId: string) => {
    setLinking(true);
    try {
      await api.post(`/students/${studentId}/link-parent`, { parent_id: parentId });
      setShowParentPicker(false);
      fetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not link parent');
    } finally { setLinking(false); }
  };

  const unlinkParent = (parentId: string, name: string) => {
    Alert.alert('Unlink parent?', `${name} will no longer see this student in their app.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unlink', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/students/${studentId}/unlink-parent/${parentId}`);
          fetch();
        } catch (e: any) {
          Alert.alert('Error', e?.response?.data?.error ?? 'Could not unlink parent');
        }
      }},
    ]);
  };

  if (loading) return <Loader />;
  if (!student) return <Empty message="Student not found" />;

  const scores = report?.scores ?? [];
  const att    = report?.attendance;
  const term   = report?.term;
  const summary= report?.summary;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
    >
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.full_name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName}>{student.full_name}</Text>
          <Text style={styles.studentMeta}>
            {student.class_name}  ·  {student.admission_number ?? 'No Adm. No.'}
          </Text>
          {student.gender && <Text style={styles.studentMeta}>{student.gender}</Text>}
        </View>
        {isTeacher && (
          <TouchableOpacity onPress={deleteStudent} style={{ padding: 6 }}>
            <Ionicons name="trash-outline" size={22} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Login account (admin only) */}
      {isAdmin && (
        <Card>
          <SectionHeader title="Login Account" />
          {student.login_username ? (
            <View style={styles.linkRow}>
              <Text style={styles.linkedTxt}>Linked to login: <Text style={{ fontWeight: '800' }}>{student.login_username}</Text></Text>
              <TouchableOpacity onPress={unlinkLogin}><Text style={styles.unlinkTxt}>Unlink</Text></TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.noLinkTxt}>No login linked yet — this student can't sign in until you link one.</Text>
              <Btn label="Link a Student Login" variant="outline" onPress={openLoginPicker} style={{ marginTop: Spacing.xs }} />
            </View>
          )}
          {showLoginPicker && (
            <View style={styles.pickerBox}>
              {loginCandidates.length === 0 ? (
                <Text style={styles.noLinkTxt}>No unlinked student logins found for this school. Create one in Admin → Users first.</Text>
              ) : loginCandidates.map(u => (
                <TouchableOpacity key={u.id} style={styles.pickerRow} onPress={() => linkLogin(u.id)} disabled={linking}>
                  <Text style={styles.pickerName}>{u.full_name}</Text>
                  <Text style={styles.pickerSub}>@{u.username}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowLoginPicker(false)}><Text style={styles.unlinkTxt}>Cancel</Text></TouchableOpacity>
            </View>
          )}
        </Card>
      )}

      {/* Term-PIN management (admin only) */}
      {isAdmin && student.login_username && (
        <Card>
          <SectionHeader title="Term Access PIN" />
          <Text style={styles.noLinkTxt}>
            Generates a PIN that unlocks this term's first topic in every subject once redeemed by the student.
          </Text>
          <View style={styles.termChipRow}>
            {TERM_LABELS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.termChip, pinTermLabel === t && styles.termChipActive]}
                onPress={() => setPinTermLabel(t)}
              >
                <Text style={[styles.termChipTxt, pinTermLabel === t && styles.termChipTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {(() => {
            const existing = termPins.find((p: any) => p.term_label === pinTermLabel);
            return existing ? (
              <View style={styles.linkRow}>
                <Text style={styles.linkedTxt}>
                  PIN: <Text style={{ fontWeight: '800' }}>{existing.pin}</Text>
                  {existing.redeemed_at ? ' — redeemed' : ' — not redeemed yet'}
                </Text>
              </View>
            ) : (
              <Text style={styles.noLinkTxt}>No PIN issued yet for {pinTermLabel}.</Text>
            );
          })()}
          <Btn
            label={pinLoading ? 'Working…' : (termPins.find((p: any) => p.term_label === pinTermLabel) ? 'Re-issue PIN' : 'Generate PIN')}
            onPress={generatePin}
            loading={pinLoading}
            variant="outline"
            style={{ marginTop: Spacing.xs }}
          />
        </Card>
      )}

      {/* Parents */}
      {(isAdmin || (student.parents ?? []).filter((p: any) => p?.parent_id).length > 0) && (
        <Card>
          <SectionHeader title="Parents / Guardians" />
          {(student.parents ?? []).filter((p: any) => p?.parent_id).map((p: any) => (
            <View key={p.parent_id} style={styles.linkRow}>
              <RowItem label={p.name ?? '—'} value={p.phone ?? '—'} />
              {isAdmin && (
                <TouchableOpacity onPress={() => unlinkParent(p.parent_id, p.name)}><Text style={styles.unlinkTxt}>Unlink</Text></TouchableOpacity>
              )}
            </View>
          ))}
          {(student.parents ?? []).filter((p: any) => p?.parent_id).length === 0 && (
            <Text style={styles.noLinkTxt}>No parent linked yet.</Text>
          )}
          {isAdmin && (
            <Btn label="+ Link a Parent" variant="outline" onPress={openParentPicker} style={{ marginTop: Spacing.xs }} />
          )}
          {showParentPicker && (
            <View style={styles.pickerBox}>
              {parentCandidates.length === 0 ? (
                <Text style={styles.noLinkTxt}>No parent accounts found for this school. Create one in Admin → Users first.</Text>
              ) : parentCandidates.map(u => (
                <TouchableOpacity key={u.id} style={styles.pickerRow} onPress={() => linkParent(u.id)} disabled={linking}>
                  <Text style={styles.pickerName}>{u.full_name}</Text>
                  <Text style={styles.pickerSub}>@{u.username}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowParentPicker(false)}><Text style={styles.unlinkTxt}>Cancel</Text></TouchableOpacity>
            </View>
          )}
        </Card>
      )}

      {/* Term summary */}
      {term && (
        <Card>
          <SectionHeader title={`${term.name} — ${term.academic_year}`} />
          <RowItem label="Days Opened"   value={att?.days_opened ?? 0} />
          <RowItem label="Days Present"  value={att?.days_present ?? 0} />
          <RowItem label="Total Score"   value={summary?.total_score ?? 0} />
          <RowItem label="Average"       value={`${summary?.average ?? 0}%`} />
          <RowItem label="Subjects"      value={summary?.subject_count ?? 0} />
        </Card>
      )}

      {/* Subject scores */}
      {scores.length > 0 && (
        <Card>
          <SectionHeader title="Scores" />
          {/* Single combined "CA" column (CA1 + CA2) — see MyResultsScreen
              for why: display-only, ca1/ca2 stay separate in the database. */}
          <View style={styles.tableHeader}>
            {['Subject','CA','Exam','Total','Grd'].map(h => (
              <Text key={h} style={[styles.th, h === 'Subject' && { flex: 2, textAlign: 'left' }]}>{h}</Text>
            ))}
          </View>
          {scores.map((s: any) => (
            <View key={s.subject_id} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 2, textAlign: 'left' }]} numberOfLines={1}>{s.subject_name}</Text>
              <Text style={styles.td}>{Number(s.ca1) + Number(s.ca2)}</Text>
              <Text style={styles.td}>{s.exam}</Text>
              <Text style={[styles.td, { fontWeight: '700' }]}>{Number(s.total)}</Text>
              <Text style={[styles.td, { color: Colors.primary, fontWeight: '700' }]}>{s.grade}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Remarks */}
      {isTeacher && term && (
        <Card>
          <SectionHeader title="Remarks" />
          <Input
            label="Class Teacher's Remark"
            value={ctRemark}
            onChangeText={setCtRemark}
            multiline
            numberOfLines={2}
            placeholder="e.g. Hardworking and focused…"
          />
          {isAdmin && (
            <Input
              label="Head Teacher / Principal Remark"
              value={admRemark}
              onChangeText={setAdmRemark}
              multiline
              numberOfLines={2}
              placeholder="e.g. Excellent result…"
            />
          )}
          <Btn
            label={saving ? 'Saving…' : 'Save Remarks'}
            onPress={saveRemarks}
            loading={saving}
          />
        </Card>
      )}

      {/* View full report card */}
      <Btn
        label="View Full Report Card"
        onPress={() => navigation.navigate('MyResults', { parentStudentId: studentId })}
        variant="outline"
        style={{ margin: Spacing.md }}
      />

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  profileHeader:{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, padding: Spacing.lg, gap: Spacing.md },
  avatar:       { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.white + '30', alignItems: 'center', justifyContent: 'center' },
  avatarText:   { color: Colors.white, fontSize: Fonts.sizes.xxl, fontWeight: '800' },
  studentName:  { color: Colors.white, fontSize: Fonts.sizes.lg, fontWeight: '700' },
  studentMeta:  { color: Colors.white + 'CC', fontSize: Fonts.sizes.sm, marginTop: 2 },
  linkRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linkedTxt:    { fontSize: Fonts.sizes.sm, color: Colors.text, flex: 1 },
  unlinkTxt:    { color: Colors.error, fontSize: Fonts.sizes.xs, fontWeight: '700', padding: 6 },
  noLinkTxt:    { fontSize: Fonts.sizes.xs, color: Colors.textSub, fontStyle: 'italic' },
  pickerBox:    { marginTop: Spacing.sm, backgroundColor: '#F5F7FA', borderRadius: Radius.sm, padding: Spacing.sm },
  pickerRow:    { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  pickerName:   { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  pickerSub:    { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  termChipRow:  { flexDirection: 'row', gap: Spacing.xs, marginVertical: Spacing.sm },
  termChip:     { flex: 1, paddingVertical: 8, borderRadius: Radius.sm, backgroundColor: '#F5F7FA', alignItems: 'center' },
  termChipActive: { backgroundColor: Colors.primary },
  termChipTxt:  { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub },
  termChipTxtActive: { color: Colors.white },
  tableHeader:  { flexDirection: 'row', backgroundColor: Colors.primary + '15', borderRadius: 4, padding: 4, marginBottom: 2 },
  th:           { flex: 1, fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary, textAlign: 'center' },
  tableRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: Colors.border },
  td:           { flex: 1, fontSize: Fonts.sizes.xs, color: Colors.text, textAlign: 'center' },
});
