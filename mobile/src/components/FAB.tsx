import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, Radius } from '../theme';

export interface FabAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

interface FabProps {
  icon?: keyof typeof Ionicons.glyphMap;
  actions: FabAction[];
}

// A single contextual FAB, WhatsApp-style: one action opens it directly,
// several actions pop a short menu above it. Placement is left to the
// screen (bottom-right, above the tab bar).
export function FAB({ icon = 'add', actions }: FabProps) {
  const [open, setOpen] = useState(false);

  if (actions.length === 0) return null;

  const handlePress = () => {
    if (actions.length === 1) { actions[0].onPress(); return; }
    setOpen(true);
  };

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={handlePress} activeOpacity={0.85}>
        <Ionicons name={icon} size={26} color={Colors.white} />
      </TouchableOpacity>

      {actions.length > 1 && (
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
            <View style={styles.menu}>
              {actions.map((a, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.menuItem, i < actions.length - 1 && styles.menuItemBorder]}
                  onPress={() => { setOpen(false); a.onPress(); }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={a.icon} size={20} color={Colors.primary} />
                  <Text style={styles.menuLabel}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', right: Spacing.lg, bottom: Spacing.lg + 8,
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  overlay: { flex: 1, backgroundColor: '#00000040', justifyContent: 'flex-end', alignItems: 'flex-end', padding: Spacing.lg },
  menu: {
    backgroundColor: Colors.card, borderRadius: Radius.md, minWidth: 200, marginBottom: 76,
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6,
    overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 14, paddingHorizontal: Spacing.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuLabel: { fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.text },
});
