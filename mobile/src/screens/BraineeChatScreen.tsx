import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform,
  ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { Btn, Input } from '../components/UI';
import { askBrainee, BraineeChatTurn } from '../api/brainee';

interface Bubble extends BraineeChatTurn {
  id: string;
}

const BRAINEE_AVATAR = require('../../assets/brainee-avatar.png');

export default function BraineeChatScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Bubble[]>([
    { id: 'intro', role: 'brainee', text: "Hi! I'm Brainee, your learning buddy. Ask me to explain something, help you study, or give you a hint when you're stuck." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userBubble: Bubble = { id: `u-${Date.now()}`, role: 'user', text };
    const history = messages.slice(-6).map(({ role, text }) => ({ role, text }));
    setMessages((prev) => [...prev, userBubble]);
    setInput('');
    setSending(true);
    try {
      const reply = await askBrainee(text, history);
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: 'brainee', text: reply }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: 'brainee', text: err?.message ?? "Sorry, I couldn't answer that just now." }]);
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Ionicons name="close" size={24} color={Colors.white} onPress={() => navigation.goBack()} style={styles.closeIcon} />
        <Image source={BRAINEE_AVATAR} style={styles.headerAvatar} resizeMode="contain" accessibilityLabel="Brainee learning robot avatar" />
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Brainee</Text>
          <Text style={styles.headerSubtitle}>Your learning buddy</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => (
          <View style={[styles.bubbleRow, item.role === 'user' && styles.bubbleRowUser]}>
            {item.role === 'brainee' && (
              <Image source={BRAINEE_AVATAR} style={styles.messageAvatar} resizeMode="contain" accessibilityLabel="Brainee" />
            )}
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleBrainee]}>
              <Text style={[styles.bubbleText, item.role === 'user' && { color: Colors.white }]}>{item.text}</Text>
            </View>
          </View>
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      {sending && (
        <View style={styles.typingRow}>
          <Image source={BRAINEE_AVATAR} style={styles.typingAvatar} resizeMode="contain" accessibilityLabel="Brainee" />
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.typingText}>Brainee is thinking…</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <Input
          value={input}
          onChangeText={setInput}
          placeholder="Ask Brainee anything…"
          style={{ flex: 1 }}
        />
        <Btn label="Send" onPress={send} loading={sending} style={styles.sendBtn} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 54 : 24, paddingBottom: Spacing.md, paddingHorizontal: Spacing.md,
  },
  closeIcon: { position: 'absolute', left: Spacing.md, top: Platform.OS === 'ios' ? 54 : 24, zIndex: 1 },
  headerAvatar: {
    width: 48, height: 58, marginLeft: 36, marginRight: Spacing.sm,
    backgroundColor: Colors.white, borderRadius: Radius.md,
  },
  headerCopy: { flex: 1 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.lg, fontWeight: '700' },
  headerSubtitle: { color: Colors.white, opacity: 0.86, fontSize: Fonts.sizes.xs, marginTop: 2 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.sm, gap: Spacing.xs },
  bubbleRowUser: { justifyContent: 'flex-end' },
  messageAvatar: { width: 34, height: 44, marginBottom: 2 },
  bubble: { maxWidth: '80%', padding: Spacing.sm, borderRadius: Radius.md },
  bubbleBrainee: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  bubbleUser: { backgroundColor: Colors.primary },
  bubbleText: { fontSize: Fonts.sizes.md, color: Colors.text },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingBottom: Spacing.xs },
  typingAvatar: { width: 28, height: 36 },
  typingText: { color: Colors.textSub, fontSize: Fonts.sizes.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.card },
  sendBtn: { paddingHorizontal: Spacing.md },
});
