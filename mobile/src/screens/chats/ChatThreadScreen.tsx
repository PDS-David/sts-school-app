import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Loader, Empty, Input, Btn } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { useAuth } from '../../api/AuthContext';

interface Contact { id: string; username: string; full_name: string; role: string; }
interface Msg { id: string; sender_id: string; body: string; created_at: string; sender_fullname?: string; pending?: boolean; }

// Same conversation logic as MessagesScreen's thread view, split into its own
// route so it can be pushed from the new WhatsApp-style ChatsScreen (which
// pushes it over the tab bar the way WhatsApp opens a chat over its tab list).
export default function ChatThreadScreen({ route, navigation }: any) {
  const contact: Contact = route.params.contact;
  const { user } = useAuth();
  const [thread, setThread] = useState<Msg[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [loadRetry, setLoadRetry] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    setSendError('');
    navigation.setOptions({ title: contact.full_name });
    api.get(`/messages/conversation/${contact.id}`)
      .then(({ data }) => {
        if (cancelled) return;
        setThread(data.messages ?? []);
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setLoadError(e?.response?.data?.error ?? 'Could not load this conversation. Check your connection and try again.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [contact.id, loadRetry]);

  const sendMessage = async () => {
    if (!body.trim() || sending) return;
    const outgoing = body.trim();
    setSending(true);
    setSendError('');
    try {
      const { data } = await api.post('/messages', { recipient_id: contact.id, body: outgoing });
      setBody('');
      if (data?.message) {
        setThread(prev => [...prev, data.message]);
      }
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      setSendError(e?.response?.data?.error ?? 'Could not send message. Your draft is still here; retry when connected.');
    } finally { setSending(false); }
  };

  if (loading) return <Loader />;
  if (loadError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={loadError} />
      <Btn label="Retry loading conversation" onPress={() => setLoadRetry(v => v + 1)} variant="outline" />
      <Btn label="Back to chats" onPress={() => navigation.goBack()} variant="ghost" style={{ marginTop: Spacing.sm }} />
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.threadHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.threadAvatar}>
          <Text style={styles.threadAvatarText}>{contact.full_name?.[0] ?? '?'}</Text>
        </View>
        <View>
          <Text style={styles.threadName}>{contact.full_name}</Text>
          <Text style={styles.threadRole}>{contact.role}</Text>
        </View>
      </View>

      {!!sendError && <Text style={{ color: Colors.error, paddingHorizontal: Spacing.md, paddingTop: Spacing.xs }}>{sendError}</Text>}
      <FlatList
        ref={flatRef}
        data={thread}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: Spacing.sm, paddingBottom: Spacing.md }}
        ListEmptyComponent={<Empty message="No messages yet. Start the conversation!" />}
        renderItem={({ item: m }) => {
          const mine = m.sender_id === user?.id;
          return (
            <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
              {!mine && <Text style={styles.bubbleSender}>{m.sender_fullname}</Text>}
              <Text style={[styles.bubbleText, mine && { color: Colors.white }]}>{m.body}</Text>
              <Text style={[styles.bubbleTime, mine && { color: Colors.white + 'AA' }]}>
                {m.pending
                  ? 'Sending… (offline)'
                  : new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputRow}>
        <Input
          value={body}
          onChangeText={(value) => { setBody(value); setSendError(''); }}
          placeholder="Type a message…"
          style={{ flex: 1, marginBottom: 0 }}
          multiline
          numberOfLines={2}
        />
        <TouchableOpacity style={[styles.sendBtn, (!body.trim() || sending) && { opacity: 0.5 }]} onPress={sendMessage} disabled={sending || !body.trim()} accessibilityRole='button' accessibilityLabel='Send message'>
          <Ionicons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  threadHeader: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', padding: Spacing.md, paddingTop: Spacing.md + 8, gap: Spacing.sm },
  threadAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.white + '30', alignItems: 'center', justifyContent: 'center' },
  threadAvatarText: { color: Colors.white, fontWeight: '800' },
  threadName: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  threadRole: { color: Colors.white + 'CC', fontSize: Fonts.sizes.xs },
  bubble: { maxWidth: '80%', borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.xs },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  bubbleSender: { fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: '700', marginBottom: 2 },
  bubbleText: { fontSize: Fonts.sizes.sm, color: Colors.text },
  bubbleTime: { fontSize: 10, color: Colors.textSub, marginTop: 3, alignSelf: 'flex-end' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.sm, gap: Spacing.sm, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
});
