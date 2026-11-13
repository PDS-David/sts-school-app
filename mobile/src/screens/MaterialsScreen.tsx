import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { Card, Btn, Input, Loader, Empty, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { getMaterialDownloadTarget, isSafeMaterialUrl } from '../utils/materialDownload';
import { ConfirmDialog } from '../components/ConfirmDialog';

const TYPE_ICON: Record<string, string> = {
  pdf: 'document-text', video: 'videocam', doc: 'document', link: 'link',
};
const TYPE_COLOR: Record<string, string> = {
  pdf: '#B71C1C', video: '#1565C0', doc: '#2E7D32', link: '#E65100',
};

export default function MaterialsScreen({ route }: any) {
  const { user } = useAuth();
  const canWrite = user?.role === 'teacher' || user?.role === 'admin';
  // Optional: the WhatsApp-style Learning tab links here with a type filter
  // (e.g. 'video' for the Videos shortcut). Filtered client-side since the
  // materials endpoint doesn't take a type param — everything still loads,
  // it's just narrowed in the list below.
  const typeFilter: string | undefined = route?.params?.typeFilter;
  // StudentLearningScreen's per-subject tiles navigate here with subjectId —
  // this was previously never read, so tapping e.g. "Mathematics" landed on
  // an unfiltered "All Subjects" list instead of narrowing to that subject.
  // Seeded once from the initial route param; the filter Picker below still
  // lets the person change it freely afterward.
  const initialSubjectId: string | undefined = route?.params?.subjectId != null ? String(route.params.subjectId) : undefined;
  const [materials, setMaterials] = useState<any[]>([]);
  const [subjects,  setSubjects]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string; confirmLabel?: string; destructive?: boolean; hideCancel?: boolean; onConfirm?: () => void } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [modal,     setModal]     = useState(false);
  const [filterSub, setFilterSub] = useState(initialSubjectId ?? '');
  const [form, setForm] = useState({ title: '', type: 'pdf', url: '', subject_id: '', class_name: '' });

  const fetch = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const params = filterSub ? `?subject_id=${encodeURIComponent(filterSub)}` : '';
      const [m, s] = await Promise.all([api.get(`/learning/materials${params}`), api.get('/academic/subjects')]);
      setMaterials(m.data.materials ?? []);
      setSubjects(s.data.subjects ?? []);
    } catch (e: any) {
      setLoadError(e?.response?.data?.error ?? 'Could not load learning materials and subjects. Check your connection and retry.');
    } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, [filterSub]);

  const handleOpen = async (url: string) => {
    if (!isSafeMaterialUrl(url)) {
      setDialog({ title: 'Invalid material link', message: 'Only secure HTTPS links can be opened.', hideCancel: true });
      return;
    }
    try {
      await Linking.openURL(url);
    } catch {
      setDialog({ title: 'Unable to open link', message: 'This material link could not be opened on this device.', hideCancel: true });
    }
  };

  const handleDownload = async (material: any) => {
    const target = getMaterialDownloadTarget(material.url, material.title, material.type);
    if (!target) {
      setDialog({ title: 'Invalid download link', message: 'Only secure HTTPS file links can be downloaded.', hideCancel: true });
      return;
    }
    setDownloadingId(String(material.id));
    try {
      const directory = new Directory(Paths.document, 'learning-materials');
      directory.create({ idempotent: true, intermediates: true });
      let downloaded = new File(directory, target.fileName);
      if (!downloaded.exists) {
        const task = File.createDownloadTask(target.url, downloaded);
        const result = await task.downloadAsync();
        if (!result || !result.exists) throw new Error('The download did not produce a file.');
        downloaded = result;
      }
      if (!(await Sharing.isAvailableAsync())) {
        setDialog({ title: 'Download complete', message: 'The file is saved in the app documents folder, but sharing is unavailable on this device.', hideCancel: true });
        return;
      }
      await Sharing.shareAsync(downloaded.uri, {
        mimeType: target.mimeType,
        dialogTitle: 'Save or open learning material',
      });
    } catch {
      setDialog({ title: 'Download failed', message: 'The link may require sign-in or may not point directly to a downloadable file. Try opening the link instead.', hideCancel: true });
    } finally {
      setDownloadingId(null);
    }
  };

  const visibleMaterials = typeFilter ? materials.filter((m) => m.type === typeFilter) : materials;

  const handleSave = async () => {
    if (saving) return;
    if (!form.title.trim() || !form.url.trim()) { setDialog({ title: 'Required fields', message: 'Enter a material title and URL.', hideCancel: true }); return; }
    if (!isSafeMaterialUrl(form.url.trim())) { setDialog({ title: 'Invalid URL', message: 'Material links must use a valid HTTPS address.', hideCancel: true }); return; }
    setSaving(true);
    try {
      await api.post('/learning/materials', { ...form, title: form.title.trim(), url: form.url.trim(), subject_id: Number(form.subject_id) || null });
      setModal(false);
      await fetch();
      setDialog({ title: 'Material uploaded', message: 'The learning material has been added.', hideCancel: true });
    } catch (e: any) {
      setDialog({ title: 'Could not upload material', message: e?.response?.data?.error ?? 'Save failed. Check your connection and try again.', hideCancel: true });
    } finally { setSaving(false); }
  };

  const handleDelete = (id: number) => {
    setDialog({
      title: 'Delete material?',
      message: 'Students will no longer be able to access this material from the learning library.',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        setDialog(null);
        try {
          await api.delete(`/learning/materials/${id}`);
          await fetch();
          setDialog({ title: 'Material deleted', message: 'The material was removed from the learning library.', hideCancel: true });
        } catch (e: any) {
          setDialog({ title: 'Could not delete material', message: e?.response?.data?.error ?? 'Please check your connection and try again.', hideCancel: true });
        }
      },
    });
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Filter */}
      <View style={styles.filterRow}>
        <View style={[styles.pickerWrap, { flex: 1 }]}>
          <Picker selectedValue={filterSub} onValueChange={setFilterSub}>
            <Picker.Item label="All Subjects" value="" />
            {subjects.map(s => <Picker.Item key={s.id} label={s.name} value={String(s.id)} />)}
          </Picker>
        </View>
        {canWrite && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
            <Ionicons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {loadError ? (
        <View style={{ paddingHorizontal: Spacing.sm }}>
          <Card>
            <Text style={{ color: Colors.error, marginBottom: Spacing.sm }}>{loadError}</Text>
            <Btn label="Retry loading materials" onPress={fetch} variant="outline" />
          </Card>
        </View>
      ) : null}
      <FlatList
        data={visibleMaterials}
        keyExtractor={m => String(m.id)}
        ListEmptyComponent={<Empty message={typeFilter ? `No ${typeFilter} materials yet` : 'No materials uploaded yet'} />}
        contentContainerStyle={{ padding: Spacing.sm }}
        renderItem={({ item: m }) => (
          <Card style={styles.matCard}>
            <View style={styles.matRow}>
              <View style={[styles.typeIcon, { backgroundColor: (TYPE_COLOR[m.type] ?? Colors.primary) + '20' }]}>
                <Ionicons name={(TYPE_ICON[m.type] ?? 'document') as any} size={24} color={TYPE_COLOR[m.type] ?? Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.matTitle}>{m.title}</Text>
                <Text style={styles.matMeta}>{m.subject_name} {m.class_name ? `· ${m.class_name}` : ''}</Text>
                <Text style={styles.matBy}>By {m.uploaded_by}</Text>
              </View>
              <View style={{ gap: 4 }}>
                <TouchableOpacity onPress={() => handleOpen(m.url)} style={styles.openBtn}>
                  <Ionicons name="open-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
                {(m.type === 'pdf' || m.type === 'doc') && (
                  <TouchableOpacity
                    onPress={() => handleDownload(m)}
                    disabled={downloadingId === String(m.id)}
                    style={styles.openBtn}
                    accessibilityRole="button"
                    accessibilityLabel={downloadingId === String(m.id) ? 'Downloading material' : 'Download material'}
                  >
                    <Ionicons
                      name={downloadingId === String(m.id) ? 'hourglass-outline' : 'download-outline'}
                      size={18}
                      color={downloadingId === String(m.id) ? Colors.textSub : Colors.primary}
                    />
                  </TouchableOpacity>
                )}
                {canWrite && (
                  <TouchableOpacity onPress={() => handleDelete(m.id)}>
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
        )}
      />

      {/* Upload Modal */}
      <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title="Upload Material" />
          <Input label="Title" value={form.title} onChangeText={v => setForm(f => ({ ...f, title: v }))} />
          <Input label="URL (Google Drive / YouTube / etc.)" value={form.url} onChangeText={v => setForm(f => ({ ...f, url: v }))} autoCapitalize="none" />
          <Input label="Class (optional)" value={form.class_name} onChangeText={v => setForm(f => ({ ...f, class_name: v }))} placeholder="e.g. JSS 1" />
          <Text style={styles.lbl}>Subject</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}>
              <Picker.Item label="All subjects" value="" />
              {subjects.map(s => <Picker.Item key={s.id} label={s.name} value={String(s.id)} />)}
            </Picker>
          </View>
          <Text style={styles.lbl}>Type</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              {['pdf','video','doc','link'].map(t => <Picker.Item key={t} label={t.toUpperCase()} value={t} />)}
            </Picker>
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
            <Btn label="Cancel" onPress={() => setModal(false)} variant="outline" style={{ flex: 1 }} />
            <Btn label={saving ? 'Uploading…' : 'Upload'} onPress={handleSave} loading={saving} disabled={saving} style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </Modal>
      <ConfirmDialog visible={!!dialog} title={dialog?.title ?? ''} message={dialog?.message ?? ''} confirmLabel={dialog?.confirmLabel} destructive={dialog?.destructive} hideCancel={dialog?.hideCancel} onConfirm={() => { const action = dialog?.onConfirm; if (action) action(); else setDialog(null); }} onCancel={() => setDialog(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: 'row', padding: Spacing.sm, gap: Spacing.sm, alignItems: 'center' },
  pickerWrap:{ borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white },
  addBtn:    { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  matCard:   { marginBottom: 8 },
  matRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  typeIcon:  { width: 46, height: 46, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  matTitle:  { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  matMeta:   { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  matBy:     { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  openBtn:   { padding: 4 },
  modalWrapOuter: { flex: 1, backgroundColor: Colors.background },
  modalWrap: { padding: Spacing.lg, paddingBottom: Spacing.lg * 3 },
  lbl:       { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 2 },
});
