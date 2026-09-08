import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Fonts, Radius } from '../theme';

// A branded, cross-platform confirmation dialog. Built specifically to
// replace window.confirm()/Alert.alert() for destructive actions: the
// former works but looks like a generic, unstyled browser popup (real
// owner feedback — functionally fine, presentation not good enough); the
// latter (Alert.alert()) doesn't reliably show anything at all on web via
// react-native-web, which is what caused the original Log Out bug this
// component exists to properly fix. React Native's own <Modal> renders
// consistently on both web and native, so one component covers both.
export function ConfirmDialog({
  visible, title, message, confirmLabel = 'Confirm', destructive = false, onConfirm, onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        {/* Swallow taps inside the card so they don't bubble to the
            backdrop's onPress and dismiss the dialog unintentionally. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, destructive && styles.confirmBtnDestructive]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  title: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  message: { fontSize: Fonts.sizes.md, color: Colors.textSub, marginBottom: Spacing.lg, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: Spacing.md, borderRadius: Radius.md },
  cancelLabel: { fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.textSub },
  confirmBtn: {
    paddingVertical: 10, paddingHorizontal: Spacing.md, borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  confirmBtnDestructive: { backgroundColor: Colors.error },
  confirmLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.white },
});
