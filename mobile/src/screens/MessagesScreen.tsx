import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../api/client';
import { Loader, Empty, Input, Btn, Card } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { cacheGet, cacheSet } from '../offline';

interface Contact { id: string; username: string; full_name: string; role: string; }
interface Msg     { id: string; sender_id: string; body: string; created_at: string; sender_fullname?: string; pending?: boolean; }

export default function MessagesScreen() {
  const { user } = useAuth();
  // Used by admin (AdminTabs.tsx) — this one flat screen doubles as both
  // the contact list and the thread view, and is what a message-push deep
  // link targets for admin (see navigationRef.ts's openMessageThread +
  // App.tsx's tap handler). finance_admin no longer has a Chats tab (SEC-02). Deliberately not swapped for the newer ChatsScreen/
  // ChatThreadScreen used by student/teacher/parent — chat was left as-is
  // in the tab-bar redesign pass, only the surrounding navigation shell
  // changed. A `contact` route param means "open straight into this
  // thread" instead of landing on the contact list first, matching how
  // ChatThreadScreen
  // already behaves for parent/student/teacher.
  const route = useRoute<any>();
  const routeContact = route.params?.contact as Contact | undefined;

  // Found live: on phones using on-screen (gesture/button) navigation
  // rather than a physical/capacitive one, the send button sat directly
  // behind the system nav bar with no way to tap it — inputRow had no
  // safe-area awareness at all. insets.bottom is the height of whatever
  // system UI (gesture bar or 3-button nav) overlaps the bottom of the
  // screen; adding it as extra padding pushes the send button above that
  // area on every device, while costing nothing extra on devices that
  // don't have one (insets.bottom is 0 there).
  const insets = useSafeAreaInsets();

  const [contacts,     setContacts]     = useState<Contact[]>([]);
  const [activeContact,setActiveContact]= useState<Contact | null>(null);
  const [thread,       setThread]       = useState<Msg[]>([]);
  const [body,         setBody]         = useState('');
  const [loading,      setLoading]      = useState(true);
  const [contactsError, setContactsError] = useState('');
  const [contactsRetry, setContactsRetry] = useState(0);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState('');
  const [sending,      setSending]      = useState(false);
  const [sendError, setSendError] = useState('');
  const threadRequestRef = useRef(0);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setContactsError('');
    api.get('/messages/contacts')
      .then(({ data }) => { if (!cancelled) setContacts(data.contacts ?? []); })
      .catch((e: any) => { if (!cancelled) setContactsError(e?.response?.data?.error ?? 'Could not load contacts. Check your connection and retry.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [contactsRetry]);

  const openConversation = async (c: Contact) => {
    const requestId = ++threadRequestRef.current;
    setActiveContact(c);
    setThread([]);
    setThreadLoading(true);
    setThreadError('');
    setSendError('');
    try {
      const { data } = await api.get(`/messages/conversation/${c.id}`);
      if (requestId !== threadRequestRef.current) return;
      setThread(data.messages ?? []);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
    } catch (e: any) {
      if (requestId === threadRequestRef.current) setThreadError(e?.response?.data?.error ?? 'Could not load this conversation. Retry to see the saved messages.');
    } finally {
      if (requestId === threadRequestRef.current) setThreadLoading(false);
    }
  };

  // Deep-link entry: if a push tap (or anything else) navigated here with a
  // `contact` param, open straight into that thread rather than waiting for
  // a tap on the contact list. Re-runs if the param changes (e.g. tapping a
  // second push notification while already on this screen).
  useEffect(() => {
    if (routeContact) {
      openConversation(routeContact);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeContact?.id]);

  const sendMessage = async () => {
    if (!body.trim() || !activeContact || sending || threadLoading || !!threadError) return;
    const outgoing = body.trim();
    setSending(true);
    setSendError('');
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
      setSendError(e?.response?.data?.error ?? 'Could not send message. Your draft is still here; retry when connected.');
    } finally { setSending(false); }
  };

  if (loading) return <Loader />;
  if (!activeContact && contactsError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={contactsError} />
      <Btn label="Retry loading contacts" onPress={() => setContactsRetry(v => v + 1)} variant="outline" />
    </View>
  );

  // Thread view
  if (activeContact) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.threadHeader}>
          <TouchableOpacity onPress={() => { threadRequestRef.current += 1; setThreadLoading(false); setActiveContact(null); }} style={{ padding: 6 }}>
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

        {threadLoading ? <Loader /> : threadError ? (
          <View style={{ flex: 1, justifyContent: 'center', padding: Spacing.md }}>
            <Empty message={threadError} />
            <Btn label="Retry conversation" onPress={() => activeContact && openConversation(activeContact)} variant="outline" />
          </View>
        ) : (
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
        )}

        {!!sendError && <Text style={{ color: Colors.error, paddingHorizontal: Spacing.md, paddingTop: Spacing.xs }}>{sendError}</Text>}
        <View style={[styles.inputRow, { paddingBottom: Spacing.sm + insets.bottom }]}>
          <Input
            value={body}
            onChangeText={(value) => { setBody(value); setSendError(''); }}
            placeholder="Type a message…"
            style={{ flex: 1, marginBottom: 0 }}
            multiline
            numberOfLines={2}
          />
          <TouchableOpacity style={[styles.sendBtn, (!body.trim() || sending) && { opacity: 0.5 }]} onPress={sendMessage} disabled={sending || threadLoading || !!threadError || !body.trim()} accessibilityRole='button' accessibilityLabel='Send message'>
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
            contentContainerStyle={{ padding: Spacing.sm, paddingBottom: Spacing.sm + insets.bottom }}
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