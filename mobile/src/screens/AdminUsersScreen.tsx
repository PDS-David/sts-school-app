import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/client';
import { Loader, Empty, Btn, Input, Badge, Card, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

interface User {
  id: string; username: string; full_name: string; role: string;
  school_code: string; assigned_class: string; is_active: boolean;
  access_expires_at: string | null;
  assigned_subject_ids?: number[];
}

const ROLES = ['teacher','parent','student','admin'];
const EXPIRY_ROLES = ['teacher', 'parent'];
const SCHOOL_ROLES = ['teacher', 'parent', 'student'];

function formatExpiry(iso: string | null): string {
  if (!iso) return 'No expiry';
  const d = new Date(iso);
  const expired = d.getTime() <= Date.now();
  return `${expired ? 'Expired' : 'Expires'} ${d.toLocaleDateString()}`;
}

// YYYY-MM-DD, built from local date parts (not toISOString) so the date
// shown/stored matches the day the admin actually tapped, regardless of
// timezone offset.
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function AdminUsersScreen() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editUser,setEditUser]= useState<User | null>(null);
  const [schools, setSchools] = useState<{code:string; name:string}[]>([]);
  const [classesBySchool, setClassesBySchool] = useState<Record<string, {id:number; name:string}[]>>({});
  const [subjectsBySchool, setSubjectsBySchool] = useState<Record<string, {id:number; name:string}[]>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Form state
  const [form, setForm] = useState({
    username: '', full_name: '', role: 'teacher',
    school_code: '', assigned_class: '', phone: '', email: '',
    access_expires_at: '', // YYYY-MM-DD, blank = no expiry
    assigned_subject_ids: [] as number[],
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users ?? []);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { api.get('/academic/schools').then(({ data }) => setSchools(data.schools ?? [])).catch(() => {}); }, []);

  // Prefetch classes + subjects for every school once, up front, rather than
  // re-fetching on every School picker change — dataset per school is small
  // and there are only ever a couple of schools.
  useEffect(() => {
    if (!schools.length) return;
    (async () => {
      const classesMap: Record<string, {id:number; name:string}[]> = {};
      const subjectsMap: Record<string, {id:number; name:string}[]> = {};
      await Promise.all(schools.map(async (s) => {
        try {
          const [{ data: classesData }, { data: subjectsData }] = await Promise.all([
            api.get('/academic/classes', { params: { school_code: s.code } }),
            api.get('/academic/subjects', { params: { school_code: s.code } }),
          ]);
          classesMap[s.code] = classesData.classes ?? [];
          subjectsMap[s.code] = subjectsData.subjects ?? [];
        } catch { }
      }));
      setClassesBySchool(classesMap);
      setSubjectsBySchool(subjectsMap);
    })();
  }, [schools]);

  const availableClasses = classesBySchool[form.school_code] ?? [];
  const availableSubjects = subjectsBySchool[form.school_code] ?? [];

  const openNew = () => {
    setEditUser(null);
    setForm({
      username: '', full_name: '', role: 'teacher', school_code: '', assigned_class: '',
      phone: '', email: '', access_expires_at: '', assigned_subject_ids: [],
    });
    setModal(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({
      username: u.username, full_name: u.full_name ?? '', role: u.role,
      school_code: u.school_code ?? '', assigned_class: u.assigned_class ?? '', phone: '', email: '',
      access_expires_at: u.access_expires_at ? u.access_expires_at.slice(0, 10) : '',
      assigned_subject_ids: u.assigned_subject_ids ?? [],
    });
    setModal(true);
  };

  const handleSave = async () => {
    // access_expires_at only applies to teacher/parent roles. An empty string
    // means "no expiry" — for edits that has to be sent explicitly (clear_expiry)
    // since the backend otherwise leaves an existing expiry untouched.
    const showsExpiry = EXPIRY_ROLES.includes(form.role);
    const payload: any = { ...form };
    if (!showsExpiry || !form.access_expires_at) {
      delete payload.access_expires_at;
      if (editUser && showsExpiry) payload.clear_expiry = true;
    }
    try {
      if (editUser) {
        await api.put(`/admin/users/${editUser.id}`, payload);
        setModal(false);
        fetchUsers();
      } else {
        const { data } = await api.post('/admin/users', payload);
        setModal(false);
        fetchUsers();
        const temp = data?.user?.temporary_password;
        Alert.alert(
          'User Created',
          `Username: ${form.username}\nPassword: ${temp}\n\nShare these with them. They'll be asked to set a new password on first login.`,
        );
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Save failed');
    }
  };

  const handleToggle = async (u: User) => {
    try {
      await api.put(`/admin/users/${u.id}`, { is_active: !u.is_active });
      fetchUsers();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not update this user');
    }
  };

  const handleResetPw = (u: User) => {
    Alert.alert('Reset Password', `Reset password for ${u.username}? A new temporary password will be generated.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: async () => {
        try {
          const { data } = await api.post(`/admin/users/${u.id}/reset-password`, {});
          Alert.alert(
            'Password Reset',
            `New password: ${data?.temporary_password}\n\nShare this with them. They'll be asked to set a new password on next login.`,
          );
        } catch (e: any) {
          Alert.alert('Error', e?.response?.data?.error ?? 'Could not reset password');
        }
      }},
    ]);
  };

  const handleDelete = (u: User) => {
    Alert.alert('Delete User', `Delete ${u.username}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/admin/users/${u.id}`);
          fetchUsers();
        } catch (e: any) {
          // Most commonly hit for a teacher who has already entered scores/
          // attendance — the backend blocks the delete to keep that history
          // attributable and returns a clear message; surface it here rather
          // than letting the promise reject silently.
          Alert.alert('Error', e?.response?.data?.error ?? 'Could not delete this user');
        }
      }},
    ]);
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={openNew}>
        <Ionicons name="person-add" size={20} color={Colors.white} />
        <Text style={styles.addBtnText}>Add User</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={u => u.id}
        ListEmptyComponent={<Empty message="No users yet" />}
        contentContainerStyle={{ padding: Spacing.sm }}
        renderItem={({ item: u }) => (
          <Card style={styles.userCard}>
            <View style={styles.userRow}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.full_name || u.username}</Text>
                <Text style={styles.userMeta}>@{u.username}  ·  {u.school_code ?? 'All'}</Text>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                  <Badge label={u.role} color={Colors.roleBadge[u.role as keyof typeof Colors.roleBadge] ?? Colors.primary} />
                  {!u.is_active && <Badge label="INACTIVE" color={Colors.error} />}
                  {u.assigned_class && <Badge label={u.assigned_class} color={Colors.textSub} />}
                  {EXPIRY_ROLES.includes(u.role) && (
                    <Badge
                      label={formatExpiry(u.access_expires_at)}
                      color={u.access_expires_at && new Date(u.access_expires_at).getTime() <= Date.now() ? Colors.error : Colors.textSub}
                    />
                  )}
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => openEdit(u)} style={styles.iconBtn}>
                  <Ionicons name="pencil" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggle(u)} style={styles.iconBtn}>
                  <Ionicons name={u.is_active ? 'pause-circle' : 'play-circle'} size={18} color={Colors.warning} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleResetPw(u)} style={styles.iconBtn}>
                  <Ionicons name="key" size={18} color={Colors.accent} />
                </TouchableOpacity>
                {u.role !== 'admin' && (
                  <TouchableOpacity onPress={() => handleDelete(u)} style={styles.iconBtn}>
                    <Ionicons name="trash" size={18} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title={editUser ? 'Edit User' : 'New User'} />
          {!editUser && (
            <Input label="Username" value={form.username} onChangeText={v => setForm(f => ({ ...f, username: v }))} autoCapitalize="none" />
          )}
          <Input label="Full Name"      value={form.full_name}      onChangeText={v => setForm(f => ({ ...f, full_name: v }))} />
          <Input label="Phone"          value={form.phone}          onChangeText={v => setForm(f => ({ ...f, phone: v }))}         keyboardType="phone-pad" />
          <Input label="Email"          value={form.email}          onChangeText={v => setForm(f => ({ ...f, email: v }))}         keyboardType="email-address" />

          {SCHOOL_ROLES.includes(form.role) && (
            <>
              <Text style={styles.filterLabel}>School</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={form.school_code} onValueChange={v => setForm(f => ({ ...f, school_code: v }))}>
                  <Picker.Item label="Select a school..." value="" />
                  {schools.map(s => <Picker.Item key={s.code} label={s.name} value={s.code} />)}
                </Picker>
              </View>
            </>
          )}

          {form.role === 'teacher' && (
            <>
              <Text style={styles.filterLabel}>Assigned Class</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={form.assigned_class} onValueChange={v => setForm(f => ({ ...f, assigned_class: v }))}>
                  <Picker.Item label="None" value="" />
                  {availableClasses.map(c => <Picker.Item key={c.id} label={c.name} value={c.name} />)}
                </Picker>
              </View>

              <Text style={styles.filterLabel}>Assigned Subjects</Text>
              <View style={styles.chipRow}>
                {availableSubjects.length === 0 && (
                  <Text style={styles.chipEmptyHint}>Select a school to see its subjects.</Text>
                )}
                {availableSubjects.map(sub => {
                  const selected = form.assigned_subject_ids.includes(sub.id);
                  return (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => setForm(f => ({
                        ...f,
                        assigned_subject_ids: selected
                          ? f.assigned_subject_ids.filter(id => id !== sub.id)
                          : [...f.assigned_subject_ids, sub.id],
                      }))}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{sub.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <Text style={styles.filterLabel}>Role</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
              {ROLES.map(r => <Picker.Item key={r} label={r} value={r} />)}
            </Picker>
          </View>
          {EXPIRY_ROLES.includes(form.role) && (
            <>
              <Text style={styles.filterLabel}>Access Expires On</Text>
              <TouchableOpacity
                style={styles.pickerWrap}
                onPress={() => {
                  if (form.access_expires_at) {
                    // Second tap when a date is already set clears it back
                    // to "no expiry" rather than reopening the picker.
                    setForm(f => ({ ...f, access_expires_at: '' }));
                  } else {
                    setShowDatePicker(true);
                  }
                }}
              >
                <Text style={styles.dateButtonText}>
                  {form.access_expires_at
                    ? new Date(form.access_expires_at + 'T00:00:00').toLocaleDateString()
                    : 'No expiry — tap to set a date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={form.access_expires_at ? new Date(form.access_expires_at + 'T00:00:00') : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setForm(f => ({ ...f, access_expires_at: toDateString(selectedDate) }));
                    }
                  }}
                />
              )}
              <Text style={styles.expiryHint}>
                After this date the account auto-locks and can only be reactivated by an admin (tap the date again to clear it for indefinite access).
              </Text>
            </>
          )}
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
            <Btn label="Cancel" onPress={() => setModal(false)} variant="outline" style={{ flex: 1 }} />
            <Btn label="Save"   onPress={handleSave}            style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  addBtn:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, margin: Spacing.sm, borderRadius: Radius.md, padding: Spacing.md, justifyContent: 'center' },
  addBtnText:  { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  userCard:    { marginBottom: 8 },
  userRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userInfo:    { flex: 1 },
  userName:    { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  userMeta:    { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  actions:     { flexDirection: 'row', gap: 2 },
  iconBtn:     { padding: 6 },
  modalWrapOuter: { flex: 1, backgroundColor: Colors.background },
  modalWrap:   { padding: Spacing.lg, paddingBottom: Spacing.lg * 3 },
  filterLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 2 },
  pickerWrap:  { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white, marginBottom: Spacing.sm },
  expiryHint:  { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: -4, marginBottom: Spacing.sm, fontStyle: 'italic' },
  chipRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.sm },
  chip:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipSelected:{ backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText:    { fontSize: Fonts.sizes.xs, color: Colors.text, fontWeight: '600' },
  chipTextSelected: { color: Colors.white },
  chipEmptyHint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, fontStyle: 'italic' },
  dateButtonText: { padding: Spacing.md, fontSize: Fonts.sizes.md, color: Colors.text },
});