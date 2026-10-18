import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { Btn, Input, Card } from '../components/UI';
import { askBraineeAboutText, TextStudyMode, TextStudyGenre } from '../api/brainee';

// Lets a learner or teacher type or paste a text (a set book extract, a
// passage) or a past question, and have Brainee work only on that text. The
// text is sent for this request only and is not stored on the server.

const MODES: { id: TextStudyMode; label: string; needsText: boolean; needsQuestion: boolean; needsAnswer: boolean }[] = [
  { id: 'summary', label: 'Summarise', needsText: true, needsQuestion: false, needsAnswer: false },
  { id: 'story_elements', label: 'Plot, characters, theme', needsText: true, needsQuestion: false, needsAnswer: false },
  { id: 'devices', label: 'Figures of speech', needsText: true, needsQuestion: false, needsAnswer: false },
  { id: 'vocabulary', label: 'Vocabulary', needsText: true, needsQuestion: false, needsAnswer: false },
  { id: 'questions', label: 'Practice questions', needsText: true, needsQuestion: false, needsAnswer: false },
  { id: 'past_question', label: 'Explain a past question', needsText: false, needsQuestion: true, needsAnswer: false },
  { id: 'mark_answer', label: 'Mark my answer', needsText: false, needsQuestion: true, needsAnswer: true },
];

const GENRES: { id: TextStudyGenre; label: string }[] = [
  { id: 'prose', label: 'Prose' }, { id: 'drama', label: 'Drama' }, { id: 'poetry', label: 'Poetry' },
  { id: 'passage', label: 'Passage' }, { id: 'other', label: 'Other' },
];

export default function TextStudyScreen({ navigation }: any) {
  const [mode, setMode] = useState<TextStudyMode>('summary');
  const [genre, setGenre] = useState<TextStudyGenre>('prose');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const cfg = MODES.find((m) => m.id === mode)!;
  const showText = cfg.needsText || mode === 'past_question' || mode === 'mark_answer';

  const run = async () => {
    if (busy) return;
    setBusy(true); setError(''); setReply('');
    try {
      const out = await askBraineeAboutText({
        mode, genre, title: title.trim() || undefined, text: text.trim() || undefined,
        question: cfg.needsQuestion ? question.trim() : undefined,
        answer: cfg.needsAnswer ? answer.trim() : undefined,
      });
      setReply(out);
    } catch (err: any) {
      setError(err?.message ?? "Brainee couldn't answer that just now.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Ionicons name="close" size={24} color={Colors.white} onPress={() => navigation.goBack()} style={styles.closeIcon} />
        <Text style={styles.headerTitle}>Study my text</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing.md }} keyboardShouldPersistTaps="handled">
        <Text style={styles.note}>
          Type or paste your set text, a passage, or a past question. Brainee works only on what you add. Your text is
          not saved.
        </Text>

        <Text style={styles.label}>What do you want to do?</Text>
        <View style={styles.chips}>
          {MODES.map((m) => (
            <TouchableOpacity key={m.id} onPress={() => setMode(m.id)} style={[styles.chip, mode === m.id && styles.chipOn]}>
              <Text style={[styles.chipText, mode === m.id && { color: Colors.white }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {cfg.needsText && (
          <>
            <Text style={styles.label}>Kind of text</Text>
            <View style={styles.chips}>
              {GENRES.map((g) => (
                <TouchableOpacity key={g.id} onPress={() => setGenre(g.id)} style={[styles.chip, genre === g.id && styles.chipOn]}>
                  <Text style={[styles.chipText, genre === g.id && { color: Colors.white }]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="Title (optional)" value={title} onChangeText={setTitle} placeholder="Title of the text" />
          </>
        )}

        {cfg.needsQuestion && (
          <Input label="The question" value={question} onChangeText={setQuestion} multiline numberOfLines={5}
            placeholder="Type or paste the question, with its options if it has any" />
        )}
        {showText && (
          <Input
            label={cfg.needsText ? 'Your text' : 'Passage or poem for the question (optional)'}
            value={text} onChangeText={setText} multiline numberOfLines={10}
            placeholder="Type or paste here (up to 12,000 characters)"
          />
        )}
        {cfg.needsAnswer && (
          <Input label="Your answer" value={answer} onChangeText={setAnswer} multiline numberOfLines={8}
            placeholder="Type your answer or essay" />
        )}

        <Btn label="Ask Brainee" onPress={run} loading={busy} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {reply ? (
          <Card style={{ marginTop: Spacing.md }}>
            <Text selectable style={styles.reply}>{reply}</Text>
          </Card>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 54 : 24, paddingBottom: Spacing.md, paddingHorizontal: Spacing.md,
  },
  closeIcon: { position: 'absolute', left: Spacing.md, top: Platform.OS === 'ios' ? 54 : 24 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.lg, fontWeight: '700' },
  note: { color: Colors.textSub, fontSize: Fonts.sizes.sm, marginBottom: Spacing.md },
  label: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600', marginBottom: Spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.md },
  chip: { paddingVertical: 6, paddingHorizontal: Spacing.sm, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  chipOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.text, fontSize: Fonts.sizes.sm },
  error: { color: Colors.error, marginTop: Spacing.sm },
  reply: { color: Colors.text, fontSize: Fonts.sizes.md, lineHeight: 22 },
});
