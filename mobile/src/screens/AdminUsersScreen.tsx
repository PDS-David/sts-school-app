import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/client';
import { Loader, Empty, Btn, Input, Badge, Card, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { PageContainer } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface User {
  id: string; username: string; full_name: string; role: string;
  school_code: string; assigned_class: string; is_active: boolean;
  access_expires_at: string | null;
  assigned_subject_ids?: number[];
  // Now selected by GET /admin/users (Part 4 audit fix) — previously absent,
  // which made every Edit-User save silently blank the target's phone
  // number (see openEdit/handleSave below for the actual fix).
  phone?: string | null;
  // Task C: true when the account was created under the activation-code
  // flow and hasn't been activated yet (no password set). Used to show
  // "Reissue Activation Code" instead of "Reset Password" for that account.
  pending_activation?: boolean;
}

// 'finance_admin' deliberately excluded from SCHOOL_ROLES/EXPIRY_ROLES below,
// same as 'admin' — it has no school of its own (manages fee items/invoices
// across both schools via the switcher) and no access-expiry window.
const ROLES = ['teacher','parent','student','admin','finance_admin'];
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

// Mirrors backend/src/routes/admin.ts's classTeacherUsername() exactly —
// display-only here (the backend is the actual source of truth and
// recomputes/enforces this itself), so the admin sees the real username
// that will be created before hitting Save, not just after.
function classTeacherUsername(className: string): string {
  return className.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default function AdminUsersScreen() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  // Alert.alert() doesn't reliably render on web via react-native-web —
  // same documented root cause as the Log Out bug ConfirmDialog.tsx was
  // built to fix (see that file's own comment). This screen had SIX
  // Alert.alert() calls, all silently broken on web, including the one
  // showing a freshly-created teacher's generated password — meaning the
  // account saved fine but the admin had no way to see or hand over the
  // password it was created with. Replaced all six with these two pieces
  // of local state driving ConfirmDialog below.
  const [infoDialog, setInfoDialog] = useState<{ title: string; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string; message: string; confirmLabel: string; destructive: boolean; onConfirm: () => void;
  } | null>(null);
  const [editUser,setEditUser]= useState<User | null>(null);
  const [schools, setSchools] = useState<{code:string; name:string}[]>([]);
  const [classesBySchool, setClassesBySchool] = useState<Record<string, {id:number; name:string}[]>>({});
  const [subjectsBySchool, setSubjectsBySchool] = useState<Record<string, {id:number; name:string}[]>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Form state. full_name and email were removed as user-facing fields —
  // full_name is always derived from username on save (see handleSave).
  const [form, setForm] = useState({
    username: '', role: 'teacher',
    school_code: '', assigned_class: '', phone: '',
    access_expires_at: '', // YYYY-MM-DD, blank = no expiry
    assigned_subject_ids: [] as number[],
    initial_password: '', // teacher only — admin sets the actual first-login password directly (see handleSave)
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
  // A class teacher's username is hard-coded from their assigned class
  // (see classTeacherUsername() above) — not admin-typed. Only applies to
  // *new* teacher accounts with a class picked; a subject-only teacher
  // (no assigned_class) still gets an admin-chosen username, same as
  // every non-teacher role, and an existing account's username is never
  // editable anyway (PUT /admin/users/:id doesn't accept one).
  const isNewClassTeacher = !editUser && form.role === 'teacher' && !!form.assigned_class;

  const openNew = () => {
    setEditUser(null);
    setForm({
      username: '', role: 'teacher', school_code: '', assigned_class: '',
      phone: '', access_expires_at: '', assigned_subject_ids: [], initial_password: '',
    });
    setModal(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({
      username: u.username, role: u.role,
      // Part 4 audit fix: this used to hardcode phone: '' regardless of the
      // user's actual saved phone, and GET /admin/users didn't even return
      // phone at all — so every Edit-User save round-tripped an empty
      // string back through PUT /admin/users/:id's `phone=COALESCE($6,phone)`,
      // which silently overwrote (blanked) the real phone number on every
      // single edit, for every role, regardless of what field the admin
      // actually meant to change. Now correctly seeded from the fetched value.
      school_code: u.school_code ?? '', assigned_class: u.assigned_class ?? '', phone: u.phone ?? '',
      access_expires_at: u.access_expires_at ? u.access_expires_at.slice(0, 10) : '',
      assigned_subject_ids: u.assigned_subject_ids ?? [], initial_password: '',
    });
    setModal(true);
  };

  const handleSave = async () => {
    // access_expires_at only applies to teacher/parent roles. An empty string
    // means "no expiry" — for edits that has to be sent explicitly (clear_expiry)
    // since the backend otherwise leaves an existing expiry untouched.
    const showsExpiry = EXPIRY_ROLES.includes(form.role);
    // Teacher creation only (not edit — this form doesn't reset an existing
    // teacher's password): admin must supply the actual first-login
    // password directly, same 8-character minimum the backend enforces.
    if (!editUser && form.role === 'teacher' && form.initial_password.length < 8) {
      setInfoDialog({ title: 'Password too short', message: 'Enter a first-login password of at least 8 characters for this teacher.' });
      return;
    }
    // Full Name and Email fields were removed from this form — full_name
    // mirrors username on both create and edit, except for a new class
    // teacher, whose username is the hard-coded class slug (not a human
    // name) — full_name uses the actual class label instead so the Users
    // list stays readable (e.g. "JSS 1" rather than "jss1").
    const payload: any = {
      ...form,
      full_name: isNewClassTeacher ? form.assigned_class : form.username,
    };
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
        if (form.role === 'teacher') {
          // Admin set this password directly (see handleSave's validation
          // above and admin.ts POST /users) — no activation code involved
          // for this role. Username comes from the actual server response,
          // not form.username — for a class teacher, form.username was
          // never shown/typed (it's hidden and hard-coded server-side from
          // the assigned class), so echoing the request's own value would
          // show blank/stale text instead of the real created username.
          setInfoDialog({
            title: 'Teacher Created',
            message: `Username: ${data?.user?.username}\nPassword: ${form.initial_password}\n\nShare these with them directly. They'll be asked to change their password the first time they log in.`,
          });
        } else {
          // Task C: account creation no longer generates a temp password —
          // admin shares this one-time activation code instead, and the
          // account owner sets their own password via the "Activate your
          // account" link on the login screen.
          const activationCode = data?.user?.activation_code;
          setInfoDialog({
            title: 'User Created',
            message: `Username: ${form.username}\nActivation code: ${activationCode}\n\nShare these with them. They'll use "Activate your account" on the login screen to set their own password.`,
          });
        }
      }
    } catch (e: any) {
      setInfoDialog({ title: 'Error', message: e?.response?.data?.error ?? 'Save failed' });
    }
  };

  const handleToggle = async (u: User) => {
    try {
      await api.put(`/admin/users/${u.id}`, { is_active: !u.is_active });
      fetchUsers();
    } catch (e: any) {
      setInfoDialog({ title: 'Error', message: e?.response?.data?.error ?? 'Could not update this user' });
    }
  };

  const handleResetPw = (u: User) => {
    setConfirmDialog({
      title: 'Reset Password',
      message: `Reset password for ${u.username}? A new temporary password will be generated.`,
      confirmLabel: 'Reset',
      destructive: true,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const { data } = await api.post(`/admin/users/${u.id}/reset-password`, {});
          setInfoDialog({
            title: 'Password Reset',
            message: `New password: ${data?.temporary_password}\n\nShare this with them. They'll be asked to set a new password on next login.`,
          });
        } catch (e: any) {
          setInfoDialog({ title: 'Error', message: e?.response?.data?.error ?? 'Could not reset password' });
        }
      },
    });
  };

  // Task C: for an account still pending activation, this replaces Reset
  // Password — there's no password to reset yet, only a lost/expired
  // activation code to reissue.
  const handleReissueCode = (u: User) => {
    setConfirmDialog({
      title: 'Reissue Activation Code',
      message: `Generate a new activation code for ${u.username}? The old code will stop working.`,
      confirmLabel: 'Reissue',
      destructive: true,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const { data } = await api.post(`/admin/users/${u.id}/reissue-activation-code`, {});
          setInfoDialog({
            title: 'Activation Code Reissued',
            message: `New activation code: ${data?.activation_code}\n\nShare this with them along with their username. They'll use "Activate your account" on the login screen.`,
          });
        } catch (e: any) {
          setInfoDialog({ title: 'Error', message: e?.response?.data?.error ?? 'Could not reissue activation code' });
        }
      },
    });
  };

  const handleDelete = (u: User) => {
    setConfirmDialog({
      title: 'Delete User',
      message: `Delete ${u.username}? This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await api.delete(`/admin/users/${u.id}`);
          fetchUsers();
        } catch (e: any) {
          // Most commonly hit for a teacher who has already entered scores/
          // attendance — the backend blocks the delete to keep that history
          // attributable and returns a clear message; surface it here rather
          // than letting the promise reject silently.
          setInfoDialog({ title: 'Error', message: e?.response?.data?.error ?? 'Could not delete this user' });
        }
      },
    });
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <PageContainer style={{ padding: Spacing.sm, paddingBottom: 0 }}>
        <TouchableOpacity style={styles.addBtn} onPress={openNew}>
          <Ionicons name="person-add" size={20} color={Colors.white} />
          <Text style={styles.addBtnText}>Add User</Text>
        </TouchableOpacity>
      </PageContainer>

      <FlatList
        data={users}
        keyExtractor={u => u.id}
        // Android defaults this to true (iOS defaults to false) — known to
        // miscalculate clip bounds for elevated/shadowed views like Card
        // (elevation: 2), producing an oversized, mostly-blank row with real
        // content squeezed into a small visible sliver. Root cause of the
        // long-standing AdminUsers blank-row bug that the width:100% fix
        // (see PageContainer usage below) only partly addressed.
        removeClippedSubviews={false}
        ListEmptyComponent={<Empty message="No users yet" />}
        contentContainerStyle={{ padding: Spacing.sm, alignItems: 'center' }}
        renderItem={({ item: u }) => (
          <PageContainer style={{ width: '100%' }}>
          <ErrorBoundary fallbackLabel={`Couldn't display user "${u.username ?? u.id}"`}>
          <Card style={styles.userCard}>
            <View style={styles.userRow}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.full_name || u.username}</Text>
                <Text style={styles.userMeta}>@{u.username}  ·  {u.school_code ?? 'All'}</Text>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                  <Badge label={u.role} color={Colors.roleBadge[u.role as keyof typeof Colors.roleBadge] ?? Colors.primary} />
                  {!u.is_active && <Badge label="INACTIVE" color={Colors.error} />}
                  {u.pending_activation && <Badge label="PENDING ACTIVATION" color={Colors.warning} />}
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
                <TouchableOpacity onPress={() => (u.pending_activation ? handleReissueCode(u) : handleResetPw(u))} style={styles.iconBtn}>
                  <Ionicons name={u.pending_activation ? 'refresh-circle' : 'key'} size={18} color={Colors.accent} />
                </TouchableOpacity>
                {u.role !== 'admin' && (
                  <TouchableOpacity onPress={() => handleDelete(u)} style={styles.iconBtn}>
                    <Ionicons name="trash" size={18} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
          </ErrorBoundary>
          </PageContainer>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title={editUser ? 'Edit User' : 'New User'} />
          {!editUser && !isNewClassTeacher && (
            <Input label="Username" value={form.username} onChangeText={v => setForm(f => ({ ...f, username: v }))} autoCapitalize="none" />
          )}
          <Input label="Phone"          value={form.phone}          onChangeText={v => setForm(f => ({ ...f, phone: v }))}         keyboardType="phone-pad" />

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

          {!editUser && form.role === 'teacher' && (
            <Input
              label="First-Login Password"
              value={form.initial_password}
              onChangeText={v => setForm(f => ({ ...f, initial_password: v }))}
              autoCapitalize="none"
              secureTextEntry
            />
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
              {isNewClassTeacher && (
                <Text style={styles.expiryHint}>
                  Username will be "{classTeacherUsername(form.assigned_class)}" — hard-coded from the class, one class-teacher account per class. Leave "Assigned Class" as "None" instead if this is a subject-only teacher and you want to choose their username yourself.
                </Text>
              )}

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

      <ConfirmDialog
        visible={!!infoDialog}
        title={infoDialog?.title ?? ''}
        message={infoDialog?.message ?? ''}
        hideCancel
        onConfirm={() => setInfoDialog(null)}
        onCancel={() => setInfoDialog(null)}
      />
      <ConfirmDialog
        visible={!!confirmDialog}
        title={confirmDialog?.title ?? ''}
        message={confirmDialog?.message ?? ''}
        confirmLabel={confirmDialog?.confirmLabel}
        destructive={confirmDialog?.destructive}
        onConfirm={() => confirmDialog?.onConfirm()}
        onCancel={() => setConfirmDialog(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  addBtn:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12, paddingHorizontal: Spacing.lg, alignSelf: 'flex-start' },
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
