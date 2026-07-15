import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, TextInput, StyleProp, ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Spacing, Radius, Fonts } from '../theme';

// ── Button ────────────────────────────────────────────────────────────────────
interface BtnProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  style?: StyleProp<ViewStyle>;
}
export function Btn({ label, onPress, loading, disabled, variant = 'primary', style }: BtnProps) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger  = variant === 'danger';
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isPrimary && { backgroundColor: Colors.primary },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
        isDanger  && { backgroundColor: Colors.error },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={isOutline ? Colors.primary : Colors.white} size="small" />
        : <Text style={[styles.btnText, isOutline && { color: Colors.primary }, variant === 'ghost' && { color: Colors.primary }]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words';
}
export function Input({ label, error, style, multiline, numberOfLines, ...rest }: InputProps) {
  return (
    <View style={[{ marginBottom: Spacing.sm }, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, multiline && { height: numberOfLines ? numberOfLines * 22 : 88, textAlignVertical: 'top' }]}
        placeholderTextColor={Colors.textSub}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...rest}
      />
      {error ? <Text style={styles.errText}>{error}</Text> : null}
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color ?? Colors.primary }]}>
      <Text style={styles.badgeText}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {right}
    </View>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function Empty({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ── Loader ────────────────────────────────────────────────────────────────────
export function Loader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

// ── Grade pill ────────────────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, string> = {
  A: '#1B5E20', B: '#2E7D32', C: '#F57F17', D: '#E65100', E: '#BF360C', F: '#B71C1C',
};
export function GradePill({ grade }: { grade: string }) {
  return (
    <View style={[styles.gradePill, { backgroundColor: GRADE_COLORS[grade] ?? '#757575' }]}>
      <Text style={styles.gradeText}>{grade}</Text>
    </View>
  );
}

// ── Row item ──────────────────────────────────────────────────────────────────
export function RowItem({
  label, value, labelStyle, valueStyle,
}: { label: string; value: string | number; labelStyle?: StyleProp<TextStyle>; valueStyle?: StyleProp<TextStyle> }) {
  return (
    <View style={styles.rowItem}>
      <Text style={[styles.rowLabel, labelStyle]}>{label}</Text>
      <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: Radius.md, paddingVertical: 13, paddingHorizontal: Spacing.md, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: Fonts.sizes.md, color: Colors.text, backgroundColor: Colors.white },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textSub, marginBottom: 4 },
  errText: { color: Colors.error, fontSize: Fonts.sizes.xs, marginTop: 3 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  badge: { borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  badgeText: { color: Colors.white, fontSize: Fonts.sizes.xs, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: Spacing.sm },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyText: { color: Colors.textSub, fontSize: Fonts.sizes.md, textAlign: 'center' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gradePill: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3, alignItems: 'center', minWidth: 28 },
  gradeText: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.sm },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSub, flex: 1 },
  rowValue: { fontSize: Fonts.sizes.sm, color: Colors.text, fontWeight: '600', flex: 1, textAlign: 'right' },
});
