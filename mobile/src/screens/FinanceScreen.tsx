import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { useWards } from '../api/WardContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { Card, Loader, Empty, Badge, Btn, Input, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { PageContainer } from '../components/layout';
import { ConfirmDialog } from '../components/ConfirmDialog';

const STATUS_COLOR: Record<string, string> = {
  unpaid: Colors.error, partial: Colors.warning, paid: Colors.success,
};

export default function FinanceScreen({ navigation }: any) {
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
  const [loadError, setLoadError] = useState('');
  const [updatingInvoiceId, setUpdatingInvoiceId] = useState<string | null>(null);
  const [feeSaving, setFeeSaving] = useState(false);
  const [invOptionsLoading, setInvOptionsLoading] = useState(false);
  const [invOptionsError, setInvOptionsError] = useState('');
  const [confirmPaid, setConfirmPaid] = useState<any>(null);
  const [infoDialog, setInfoDialog] = useState<{ title: string; message: string } | null>(null);

  // Compact switcher lives in the native header now (finance_admin only —
  // parent has no school to switch), not as a full-width block in the
  // content area — see SchoolSwitcherBar.tsx's `compact` doc.
  useEffect(() => {
    navigation.setOptions({ headerRight: isFinanceAdmin ? () => <SchoolSwitcherBar compact /> : undefined });
  }, [navigation, isFinanceAdmin]);

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
    setLoading(true);
    setLoadError('');
    setInvoices([]);
    setFeeItems([]);
    const errors: string[] = [];
    try {
      const { data } = await api.get(invUrl);
      setInvoices(data.invoices ?? []);
    } catch { errors.push('invoices'); }
    try {
      // finance_admin has no school of its own — fee items are school-scoped.
      const { data } = await api.get('/finance/fee-items', { params: { school_code: isFinanceAdmin ? (selectedSchoolCode ?? undefined) : undefined } });
      setFeeItems(data.fee_items ?? []);
    } catch { errors.push('fee schedule'); }
    if (errors.length) setLoadError(`Could not load ${errors.join(' and ')}. Check your connection and retry.`);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, [selectedWardId, selectedSchoolCode]);

  const markPaid = async () => {
    if (!confirmPaid || updatingInvoiceId !== null) return;
    const invoice = confirmPaid;
    setConfirmPaid(null);
    setUpdatingInvoiceId(invoice.id);
    try {
      await api.put(`/finance/invoices/${invoice.id}/status`, { status: 'paid' });
      await fetch();
      setInfoDialog({ title: 'Payment updated', message: `Invoice for ${invoice.student_name} has been marked as paid.` });
    } catch (e: any) {
      setInfoDialog({ title: 'Could not update payment', message: e?.response?.data?.error ?? 'Please check your connection and try again.' });
    } finally {
      setUpdatingInvoiceId(null);
    }
  };

  const handleSaveFeeItem = async () => {
    if (feeSaving) return;
    const amount = Number(feeForm.amount);
    if (!feeForm.name.trim() || !feeForm.amount.trim()) { setInfoDialog({ title: 'Required fields', message: 'Enter a fee name and amount.' }); return; }
    if (!Number.isFinite(amount) || amount <= 0) { setInfoDialog({ title: 'Invalid amount', message: 'Enter a valid amount greater than zero.' }); return; }
    if (!selectedSchoolCode) { setInfoDialog({ title: 'Select a school', message: 'Choose a school before creating a fee item.' }); return; }
    setFeeSaving(true);
    try {
      await api.post('/finance/fee-items', {
        name: feeForm.name.trim(),
        amount,
        class_name: feeForm.class_name.trim() || null,
        school_code: selectedSchoolCode,
      });
      setFeeModal(false);
      setFeeForm({ name: '', amount: '', class_name: '' });
      await fetch();
      setInfoDialog({ title: 'Fee item created', message: 'The fee item is now available in this school’s fee schedule.' });
    } catch (e: any) { setInfoDialog({ title: 'Could not save fee item', message: e?.response?.data?.error ?? 'Save failed. Check your connection and try again.' }); }
    finally { setFeeSaving(false); }
  };

  const loadInvoiceOptions = async () => {
    setInvOptionsLoading(true);
    setInvOptionsError('');
    setStudents([]);
    setTerms([]);
    try {
      const [s, t] = await Promise.all([
        api.get('/students', { params: { school_code: selectedSchoolCode ?? undefined } }),
        api.get('/academic/terms', { params: { school_code: selectedSchoolCode ?? undefined } }),
      ]);
      setStudents(s.data.students ?? []);
      setTerms(t.data.terms ?? []);
    } catch (e: any) {
      setInvOptionsError(e?.response?.data?.error ?? 'Could not load students and terms for this school. Retry before creating an invoice.');
    } finally { setInvOptionsLoading(false); }
  };

  const openInvoiceModal = () => {
    if (isFinanceAdmin && !selectedSchoolCode) {
      setInfoDialog({ title: 'Select a school', message: 'Choose a school before creating an invoice.' });
      return;
    }
    setInvForm({ student_id: '', term_id: '', fee_item_ids: [] });
    setInvModal(true);
    loadInvoiceOptions();
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
    if (saving) return;
    if (invOptionsLoading || invOptionsError || !students.length || !terms.length) {
      setInfoDialog({ title: 'Invoice options unavailable', message: 'Load the current school’s students and terms before creating an invoice.' });
      return;
    }
    if (!invForm.student_id || !invForm.term_id || invForm.fee_item_ids.length === 0) {
      setInfoDialog({ title: 'Incomplete invoice', message: 'Select a student, a term, and at least one fee item.' });
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
      await fetch();
      setInfoDialog({ title: 'Invoice created', message: 'The invoice has been created for the selected student and term.' });
    } catch (e: any) {
      setInfoDialog({ title: 'Could not create invoice', message: e?.response?.data?.error ?? 'Check your connection and try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {isParent && selectedWard && (
        <Text style={styles.wardLabel}>Showing fees for {selectedWard.full_name}</Text>
      )}
      <PageContainer style={{ padding: Spacing.sm, flex: 1 }}>
        {loadError ? (
          <Card>
            <Text style={styles.loadError}>{loadError}</Text>
            <Btn label="Retry loading" onPress={() => { setLoading(true); fetch(); }} variant="outline" />
          </Card>
        ) : null}
        {/* Fee Schedule */}
        <Card>
          <View style={styles.sectionRow}>
            <SectionHeader title="Fee Schedule" />
            {isFinanceAdmin && (
              <TouchableOpacity onPress={() => setFeeModal(true)} style={styles.addBtn} accessibilityRole='button' accessibilityLabel='Add fee item'>
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
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
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
                <Btn label={updatingInvoiceId === inv.id ? 'Updating…' : 'Mark as Paid'} onPress={() => setConfirmPaid(inv)} variant='outline' style={{ marginTop: Spacing.sm }} disabled={updatingInvoiceId !== null} loading={updatingInvoiceId === inv.id} accessibilityLabel={`Mark invoice for ${inv.student_name} as paid`} />
              )}
            </Card>
          )}
        />
      </PageContainer>

      {/* Add Fee Item modal */}
      <Modal visible={feeModal} animationType="slide" onRequestClose={() => setFeeModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title="New Fee Item" />
          <Input label="Name" value={feeForm.name} onChangeText={v => setFeeForm(f => ({ ...f, name: v }))} />
          <Input label="Amount (₦)" value={feeForm.amount} onChangeText={v => setFeeForm(f => ({ ...f, amount: v }))} keyboardType="numeric" />
          <Input label="Class (optional — blank means All)" value={feeForm.class_name} onChangeText={v => setFeeForm(f => ({ ...f, class_name: v }))} />
          <View style={styles.modalActions}>
            <Btn label="Cancel" onPress={() => setFeeModal(false)} variant="outline" style={{ flex: 1 }} />
            <Btn label={feeSaving ? 'Saving…' : 'Save'} onPress={handleSaveFeeItem} style={{ flex: 1 }} disabled={feeSaving} loading={feeSaving} />
          </View>
        </ScrollView>
      </Modal>

      {/* New Invoice modal */}
      <Modal visible={invModal} animationType="slide" onRequestClose={() => setInvModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title="New Invoice" />
          {invOptionsLoading ? <Loader /> : invOptionsError ? (
            <View><Empty message={invOptionsError} /><Btn label='Retry students and terms' variant='outline' onPress={() => loadInvoiceOptions()} /></View>
          ) : !students.length || !terms.length ? (
            <Empty message='Students and academic terms must be available before an invoice can be created.' />
          ) : null}

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
              <TouchableOpacity key={f.id} style={styles.checkRow} onPress={() => toggleFeeItem(f.id)} accessibilityRole='checkbox' accessibilityState={{ checked }} accessibilityLabel={`${f.name}, ₦${Number(f.amount).toLocaleString()}`}>
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
            <Btn label={saving ? 'Creating…' : 'Create Invoice'} onPress={handleCreateInvoice} style={{ flex: 1 }} disabled={saving || invOptionsLoading || !!invOptionsError || !students.length || !terms.length || !feeItems.length} loading={saving} />
          </View>
        </ScrollView>
      </Modal>
      <ConfirmDialog visible={!!confirmPaid} title='Mark invoice as paid?' message={confirmPaid ? `Mark ${confirmPaid.student_name}’s invoice of ₦${Number(confirmPaid.total).toLocaleString()} as paid?` : ''} confirmLabel='Mark as paid' onConfirm={markPaid} onCancel={() => setConfirmPaid(null)} />
      <ConfirmDialog visible={!!infoDialog} title={infoDialog?.title ?? ''} message={infoDialog?.message ?? ''} hideCancel onConfirm={() => setInfoDialog(null)} onCancel={() => setInfoDialog(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadError: { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm },
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
