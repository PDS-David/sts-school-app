import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Loader, Empty, Input, Btn, Card } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { cacheGet, cacheSet } from '../offline';

interface Contact { id: string; username: string; full_name: string; role: string; }
interface Msg     { id: string; sender_id: string; body: string; created_at: string; sender_fullname?: string; pending?: boolean; }

export default function MessagesScreen() {
  const { user } = useAuth();
  const [contacts,     setContacts]     = useState<Contact[]>([]);
  const [activeContact,setActiveContact]= useState<Contact | null>(null);
  const [thread,       setThread]       = useState<Msg[]>([]);
  const [body,         setBody]         = useState('');
  const [loading,      setLoading]      = useState(true);
  const [sending,      setSending]      = useState(false);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    api.get('/messages/contacts')
      .then(({ data }) => setContacts(data.contacts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openConversation = async (c: Contact) => {
    setActiveContact(c);
    try {
      const { data } = await api.get(`/messages/conversation/${c.id}`);
      setThread(data.messages ?? []);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
    } catch { }
  };

  const sendMessage = async () => {
    if (!body.trim() || !activeContact) return;
    const outgoing = body.trim();
    setSending(true);
    try {
      const { data } = await api.post('/messages', { recipient_id: activeContact.id, body: outgoing });
      setBody('');
      // Append directly instead of re-fetching: works the same whether the
      // message actually reached the server or was queued offline (in which
      // case `data.message.pending` is true and it'll sync automatically).
      if (data?.message) {
        setThread(prev => [...prev, data.message]);
        const convoUrl = `/messages/conversation/${activeContact.id}`;
        const cached = await cacheGet(convoUrl);
        const prevMessages = (cached?.data as any)?.messages ?? [];
        await cacheSet(convoUrl, { messages: [...prevMessages, data.message] });
      }
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not send message');
    } finally { setSending(false); }
  };

  if (loading) return <Loader />;

  // Thread view
  if (activeContact) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.threadHeader}>
          <TouchableOpacity onPress={() => setActiveContact(null)} style={{ padding: 6 }}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.threadAvatar}>
            <Text style={styles.threadAvatarText}>{activeContact.full_name?.[0] ?? '?'}</Text>
          </View>
          <View>
            <Text style={styles.threadName}>{activeContact.full_name}</Text>
            <Text style={styles.threadRole}>{activeContact.role}</Text>
          </View>
        </View>

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
            onChangeText={setBody}
            placeholder="Type a message…"
            style={{ flex: 1, marginBottom: 0 }}
            multiline
            numberOfLines={2}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={sending}>
            <Ionicons name="send" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Contact list
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {contacts.length === 0
        ? <Empty message="No contacts available" />
        : (
          <FlatList
            data={contacts}
            keyExtractor={c => c.id}
            contentContainerStyle={{ padding: Spacing.sm }}
            renderItem={({ item: c }) => (
              <TouchableOpacity style={styles.contactRow} onPress={() => openConversation(c)} activeOpacity={0.7}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>{c.full_name?.[0] ?? '?'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{c.full_name}</Text>
                  <Text style={styles.contactRole}>{c.role}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
              </TouchableOpacity>
            )}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  threadHeader:     { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', padding: Spacing.md, paddingTop: Spacing.md + 8, gap: Spacing.sm },
  threadAvatar:     { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.white + '30', alignItems: 'center', justifyContent: 'center' },
  threadAvatarText: { color: Colors.white, fontWeight: '800' },
  threadName:       { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  threadRole:       { color: Colors.white + 'CC', fontSize: Fonts.sizes.xs },
  bubble:           { maxWidth: '80%', borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.xs },
  bubbleMine:       { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  bubbleOther:      { alignSelf: 'flex-start', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  bubbleSender:     { fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: '700', marginBottom: 2 },
  bubbleText:       { fontSize: Fonts.sizes.sm, color: Colors.text },
  bubbleTime:       { fontSize: 10, color: Colors.textSub, marginTop: 3, alignSelf: 'flex-end' },
  inputRow:         { flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.sm, gap: Spacing.sm, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  sendBtn:          { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  contactRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginBottom: 8, elevation: 1, gap: Spacing.md },
  contactAvatar:    { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  contactAvatarText:{ color: Colors.white, fontWeight: '800', fontSize: Fonts.sizes.lg },
  contactName:      { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  contactRole:      { fontSize: Fonts.sizes.sm, color: Colors.textSub },
});
