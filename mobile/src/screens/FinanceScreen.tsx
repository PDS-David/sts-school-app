import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { useWards } from '../api/WardContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { Card, Loader, Empty, Badge, Btn, Input, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

const STATUS_COLOR: Record<string, string> = {
  unpaid: Colors.error, partial: Colors.warning, paid: Colors.success,
};

export default function FinanceScreen() {
  const { user } = useAuth();
  const { selectedWardId, selectedWard } = useWards();
  const { selectedSchoolCode } = useAdminSchool();
  // Finance is a completely separate path from Operations Admin now — only
  // finance_admin gets write access (creating fee items/invoices, marking
  // paid). 'admin' never reaches this screen at all (not registered in
  // AdminTabs.tsx, only FinanceAdminTabs.tsx); this flag only distinguishes
  // finance_admin from parent, who only ever sees their own ward's
  // invoices, read-only.
  const isFinanceAdmin = user?.role === 'finance_admin';
  const isParent = user?.role === 'parent';
  const [invoices,  setInvoices]  = useState<any[]>([]);
  const [feeItems,  setFeeItems]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);

  // ── Add Fee Item modal ──────────────────────────────────────────────────────
  const [feeModal, setFeeModal] = useState(false);
  const [feeForm, setFeeForm] = useState({ name: '', amount: '', class_name: '' });

  // ── New Invoice modal ────────────────────────────────────────────────────────
  const [invModal, setInvModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [invForm, setInvForm] = useState<{ student_id: string; term_id: string; fee_item_ids: number[] }>({
    student_id: '', term_id: '', fee_item_ids: [],
  });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const invUrl = isParent && selectedWardId
      ? `/finance/invoices?student_id=${selectedWardId}`
      : '/finance/invoices';
    try {
      const [inv, fee] = await Promise.all([
        api.get(invUrl),
        // finance_admin has no school of its own — fee items are always
        // school-scoped server-side, so it needs to say which school
        // explicitly (via the switcher) or this comes back empty.
        api.get('/finance/fee-items', { params: { school_code: isFinanceAdmin ? (selectedSchoolCode ?? undefined) : undefined } }),
      ]);
      setInvoices(inv.data.invoices ?? []);
      setFeeItems(fee.data.fee_items ?? []);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, [selectedWardId, selectedSchoolCode]);

  const markPaid = async (id: string) => {
    // Moved off /admin/finance/... — finance is its own path now, gated to
    // finance_admin only (routes/finance.ts).
    await api.put(`/finance/invoices/${id}/status`, { status: 'paid' });
    fetch();
  };

  const handleSaveFeeItem = async () => {
    if (!feeForm.name || !feeForm.amount) { Alert.alert('Name and amount required'); return; }
    try {
      await api.post('/finance/fee-items', {
        name: feeForm.name,
        amount: Number(feeForm.amount),
        class_name: feeForm.class_name || null,
        school_code: selectedSchoolCode,
      });
      setFeeModal(false);
      setFeeForm({ name: '', amount: '', class_name: '' });
      fetch();
    } catch (e: any) { Alert.alert('Error', e?.response?.data?.error ?? 'Save failed'); }
  };

  const openInvoiceModal = async () => {
    setInvForm({ student_id: '', term_id: '', fee_item_ids: [] });
    setInvModal(true);
    try {
      const [s, t] = await Promise.all([
        api.get('/students', { params: { school_code: selectedSchoolCode ?? undefined } }),
        api.get('/academic/terms', { params: { school_code: selectedSchoolCode ?? undefined } }),
      ]);
      setStudents(s.data.students ?? []);
      setTerms(t.data.terms ?? []);
    } catch { Alert.alert('Error', 'Could not load students/terms for this school.'); }
  };

  const toggleFeeItem = (id: number) => {
    setInvForm(f => ({
      ...f,
      fee_item_ids: f.fee_item_ids.includes(id)
        ? f.fee_item_ids.filter(x => x !== id)
        : [...f.fee_item_ids, id],
    }));
  };

  const invoiceTotal = feeItems
    .filter(f => invForm.fee_item_ids.includes(f.id))
    .reduce((sum, f) => sum + Number(f.amount), 0);

  const handleCreateInvoice = async () => {
    if (!invForm.student_id || !invForm.term_id || invForm.fee_item_ids.length === 0) {
      Alert.alert('Select a student, a term, and at least one fee item.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/finance/invoices', {
        student_id: invForm.student_id,
        term_id: Number(invForm.term_id),
        fee_item_ids: invForm.fee_item_ids,
      });
      setInvModal(false);
      fetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not create invoice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {isFinanceAdmin && <SchoolSwitcherBar />}
      {isParent && selectedWard && (
        <Text style={styles.wardLabel}>Showing fees for {selectedWard.full_name}</Text>
      )}
      {/* Fee Schedule */}
      <Card style={{ margin: Spacing.sm }}>
        <View style={styles.sectionRow}>
          <SectionHeader title="Fee Schedule" />
          {isFinanceAdmin && (
            <TouchableOpacity onPress={() => setFeeModal(true)} style={styles.addBtn}>
              <Ionicons name="add" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
        {feeItems.length === 0 ? <Text style={styles.none}>No fee items configured</Text> : feeItems.map(f => (
          <View key={f.id} style={styles.feeRow}>
            <Text style={styles.feeName}>{f.name} {f.class_name ? `(${f.class_name})` : '(All)'}</Text>
            <Text style={styles.feeAmt}>₦{Number(f.amount).toLocaleString()}</Text>
          </View>
        ))}
      </Card>

      {/* Invoices */}
      <View style={styles.sectionRow}>
        <SectionHeader title="Invoices" />
        {isFinanceAdmin && (
          <Btn label="+ New Invoice" onPress={openInvoiceModal} variant="outline" style={styles.newInvBtn} />
        )}
      </View>
      {invoices.length === 0 ? <Empty message="No invoices" /> : null}
      <FlatList
        data={invoices}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: Spacing.sm, paddingBottom: Spacing.xl }}
        renderItem={({ item: inv }) => (
          <Card>
            <View style={styles.invHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.invName}>{inv.student_name}</Text>
                <Text style={styles.invMeta}>{inv.class_name} · {new Date(inv.issued_at).toLocaleDateString()}</Text>
              </View>
              <Badge label={inv.status} color={STATUS_COLOR[inv.status] ?? Colors.textSub} />
            </View>
            <Text style={styles.invAmt}>₦{Number(inv.total).toLocaleString()}</Text>
            {isFinanceAdmin && inv.status !== 'paid' && (
              <Btn label="Mark as Paid" onPress={() => markPaid(inv.id)} variant="outline" style={{ marginTop: Spacing.sm }} />
            )}
          </Card>
        )}
      />

      {/* Add Fee Item modal */}
      <Modal visible={feeModal} animationType="slide" onRequestClose={() => setFeeModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title="New Fee Item" />
          <Input label="Name" value={feeForm.name} onChangeText={v => setFeeForm(f => ({ ...f, name: v }))} />
          <Input label="Amount (₦)" value={feeForm.amount} onChangeText={v => setFeeForm(f => ({ ...f, amount: v }))} keyboardType="numeric" />
          <Input label="Class (optional — blank means All)" value={feeForm.class_name} onChangeText={v => setFeeForm(f => ({ ...f, class_name: v }))} />
          <View style={styles.modalActions}>
            <Btn label="Cancel" onPress={() => setFeeModal(false)} variant="outline" style={{ flex: 1 }} />
            <Btn label="Save" onPress={handleSaveFeeItem} style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </Modal>

      {/* New Invoice modal */}
      <Modal visible={invModal} animationType="slide" onRequestClose={() => setInvModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title="New Invoice" />

          <Text style={styles.filterLabel}>Student</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={invForm.student_id} onValueChange={v => setInvForm(f => ({ ...f, student_id: v }))}>
              <Picker.Item label="Select a student..." value="" />
              {students.map((s: any) => (
                <Picker.Item key={s.id} label={`${s.full_name} (${s.class_name})`} value={String(s.id)} />
              ))}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Term</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={invForm.term_id} onValueChange={v => setInvForm(f => ({ ...f, term_id: v }))}>
              <Picker.Item label="Select a term..." value="" />
              {terms.map((t: any) => (
                <Picker.Item key={t.id} label={`${t.name} — ${t.academic_year}`} value={String(t.id)} />
              ))}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Fee Items</Text>
          {feeItems.length === 0 ? (
            <Text style={styles.none}>No fee items for this school yet — add one first.</Text>
          ) : feeItems.map(f => {
            const checked = invForm.fee_item_ids.includes(f.id);
            return (
              <TouchableOpacity key={f.id} style={styles.checkRow} onPress={() => toggleFeeItem(f.id)}>
                <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={22} color={checked ? Colors.primary : Colors.textSub} />
                <Text style={styles.checkLabel}>{f.name} {f.class_name ? `(${f.class_name})` : '(All)'}</Text>
                <Text style={styles.feeAmt}>₦{Number(f.amount).toLocaleString()}</Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.invAmt}>₦{invoiceTotal.toLocaleString()}</Text>
          </View>

          <View style={styles.modalActions}>
            <Btn label="Cancel" onPress={() => setInvModal(false)} variant="outline" style={{ flex: 1 }} disabled={saving} />
            <Btn label={saving ? 'Creating…' : 'Create Invoice'} onPress={handleCreateInvoice} style={{ flex: 1 }} disabled={saving} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wardLabel: { textAlign: 'center', color: Colors.primary, fontWeight: '700', fontSize: Fonts.sizes.sm, marginTop: Spacing.sm },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.sm },
  addBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  newInvBtn: { paddingHorizontal: Spacing.md },
  feeRow:    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: Colors.border },
  feeName:   { fontSize: Fonts.sizes.sm, color: Colors.text },
  feeAmt:    { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary },
  none:      { color: Colors.textSub, textAlign: 'center', padding: Spacing.md },
  invHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.xs },
  invName:   { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  invMeta:   { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  invAmt:    { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  modalWrapOuter: { flex: 1, backgroundColor: Colors.background },
  modalWrap: { padding: Spacing.md, paddingBottom: Spacing.xl },
  modalActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  filterLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text, marginTop: Spacing.md, marginBottom: 4 },
  pickerWrap: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, backgroundColor: Colors.card },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8 },
  checkLabel: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.text },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderColor: Colors.border },
  totalLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
});
