import React from 'react';
import { View, Text, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { Colors, Spacing, Radius, Fonts } from '../theme';

// ── Why this exists ──────────────────────────────────────────────────────────
// This app was built mobile-first: a View with flex:1 fills whatever width
// it's given, which is exactly right on a 390px phone screen. Ported to a
// 1920px browser window (now that Expo web is enabled), the same flex:1
// content just keeps stretching — a two-chip stats row becomes two ~800px
// boxes, an action list becomes a full-bleed bar. Nothing was ever wrong
// per se; there was just never a ceiling on how wide "fill available space"
// was allowed to go.
//
// Most cloud-console UIs (AWS, GCP, Render, Vercel...) solve this the same
// way: cap the content column at a moderate width and center it, so text
// lines and buttons stay a human size regardless of monitor width, with the
// page background filling the rest. This is that cap, applied once here
// instead of copy-pasted into every screen.
export const WIDE_BREAKPOINT = 768;
const CONTENT_MAX_WIDTH = 1040; // moderate — this is a utility dashboard, not a dense analytics console

export function useIsWide() {
  const { width } = useWindowDimensions();
  return width >= WIDE_BREAKPOINT;
}

// Wrap a screen's scrollable content in this. Below the breakpoint it's a
// no-op (full width, as every screen already behaves). At/above it, content
// is capped and centered — the background still fills the window, only the
// content column stops growing.
export function PageContainer({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const isWide = useIsWide();
  if (!isWide) return <View style={style}>{children}</View>;
  return (
    <View style={styles.centerWrap}>
      <View style={[styles.capped, style]}>{children}</View>
    </View>
  );
}

// A stat chip that hugs its own content (a term name, a count) instead of
// stretching to fill whatever row it's placed in — the flex:1 version of
// this is exactly what produced the giant pill-shaped boxes on web. Chips
// wrap onto a new line on narrow screens rather than being forced to share
// one row.
export function StatChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.statRow}>{children}</View>;
}

export function StatChip({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <View style={styles.statChip}>
      {typeof value === 'string' || typeof value === 'number'
        ? <Text style={styles.statVal} numberOfLines={1}>{value}</Text>
        : value}
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: { alignItems: 'center', width: '100%' },
  capped: { width: '100%', maxWidth: CONTENT_MAX_WIDTH },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: Spacing.sm },
  statChip: {
    minWidth: 130,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    elevation: 1,
  },
  statValueWrap: { alignItems: 'center' },  statVal: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
