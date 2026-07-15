import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { useWards } from '../api/WardContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { Card, Loader, Empty, Badge, Btn, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

const STATUS_COLOR: Record<string, string> = {
  unpaid: Colors.error, partial: Colors.warning, paid: Colors.success,
};

export default function FinanceScreen() {
  const { user } = useAuth();
  const { selectedWardId, selectedWard } = useWards();
  const { selectedSchoolCode } = useAdminSchool();
  const isAdmin  = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const [invoices,  setInvoices]  = useState<any[]>([]);
  const [feeItems,  setFeeItems]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);

  const fetch = async () => {
    // Reads go through /finance now (scoped per-role server-side); admin's
    // write actions (mark-paid, creating fee items/invoices) still use /admin.
    // Parent: narrow to the selected child only, same reasoning as elsewhere —
    // one child's fee status should never appear next to a sibling's.
    const invUrl = isParent && selectedWardId
      ? `/finance/invoices?student_id=${selectedWardId}`
      : '/finance/invoices';
    try {
      const [inv, fee] = await Promise.all([
        api.get(invUrl),
        // Admin has no school of their own — fee items are always school-scoped
        // server-side, so admin needs to say which school explicitly (via the
        // switcher) or this silently comes back empty.
        api.get('/finance/fee-items', { params: { school_code: isAdmin ? (selectedSchoolCode ?? undefined) : undefined } }),
      ]);
      setInvoices(inv.data.invoices ?? []);
      setFeeItems(fee.data.fee_items ?? []);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, [selectedWardId, selectedSchoolCode]);

  const markPaid = async (id: string) => {
    await api.put(`/admin/finance/invoices/${id}/status`, { status: 'paid' });
    fetch();
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {isAdmin && <SchoolSwitcherBar />}
      {isParent && selectedWard && (
        <Text style={styles.wardLabel}>Showing fees for {selectedWard.full_name}</Text>
      )}
      {/* Fee Schedule */}
      <Card style={{ margin: Spacing.sm }}>
        <SectionHeader title="Fee Schedule" />
        {feeItems.length === 0 ? <Text style={styles.none}>No fee items configured</Text> : feeItems.map(f => (
          <View key={f.id} style={styles.feeRow}>
            <Text style={styles.feeName}>{f.name} {f.class_name ? `(${f.class_name})` : '(All)'}</Text>
            <Text style={styles.feeAmt}>₦{Number(f.amount).toLocaleString()}</Text>
          </View>
        ))}
      </Card>

      {/* Invoices */}
      <Card style={{ margin: Spacing.sm }}>
        <SectionHeader title="Invoices" />
        {invoices.length === 0 ? <Empty message="No invoices" /> : null}
      </Card>
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
            {isAdmin && inv.status !== 'paid' && (
              <Btn label="Mark as Paid" onPress={() => markPaid(inv.id)} variant="outline" style={{ marginTop: Spacing.sm }} />
            )}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wardLabel: { textAlign: 'center', color: Colors.primary, fontWeight: '700', fontSize: Fonts.sizes.sm, marginTop: Spacing.sm },
  feeRow:    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: Colors.border },
  feeName:   { fontSize: Fonts.sizes.sm, color: Colors.text },
  feeAmt:    { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary },
  none:      { color: Colors.textSub, textAlign: 'center', padding: Spacing.md },
  invHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.xs },
  invName:   { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  invMeta:   { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  invAmt:    { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
});
