import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Card, Btn, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

type DialogueLine = { speaker: 'Ada' | 'Le bibliothécaire'; text: string; translation: string };
const DIALOGUE: DialogueLine[] = [
  { speaker: 'Ada', text: 'Bonjour, monsieur. Je cherche un livre sur les animaux.', translation: 'Good morning, sir. I am looking for a book about animals.' },
  { speaker: 'Le bibliothécaire', text: 'Bonjour. Regardez la deuxième étagère, à gauche.', translation: 'Good morning. Look at the second shelf, on the left.' },
  { speaker: 'Ada', text: 'Merci. Est-ce que je peux emprunter ce livre ?', translation: 'Thank you. Can I borrow this book?' },
  { speaker: 'Le bibliothécaire', text: 'Oui. Avez-vous votre carte ?', translation: 'Yes. Do you have your card?' },
  { speaker: 'Ada', text: 'Oui, la voici. Quand dois-je rendre le livre ?', translation: 'Yes, here it is. When must I return the book?' },
  { speaker: 'Le bibliothécaire', text: 'Vendredi prochain.', translation: 'Next Friday.' },
  { speaker: 'Ada', text: 'Très bien. Merci et au revoir.', translation: 'Very good. Thank you and goodbye.' },
  { speaker: 'Le bibliothécaire', text: 'Au revoir.', translation: 'Goodbye.' },
];
const QUESTIONS = [
  { q: 'Quel livre cherche Ada ?', a: 'Un livre sur les animaux.' },
  { q: 'Où doit-elle regarder ?', a: 'La deuxième étagère, à gauche.' },
  { q: 'Quand doit-elle rendre le livre ?', a: 'Vendredi prochain.' },
  { q: 'Écrivez une demande polie pour emprunter un livre.', a: 'Est-ce que je peux emprunter ce livre, s’il vous plaît ?' },
];

export default function FrenchListeningScreen({ navigation }: any) {
  const [voices, setVoices] = useState<Array<{ identifier: string; name: string; language: string }>>([]);
  const [currentLine, setCurrentLine] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [answersVisible, setAnswersVisible] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let active = true;
    Speech.getAvailableVoicesAsync()
      .then(found => { if (active) setVoices(found.filter(v => v.language?.toLowerCase().startsWith('fr'))); })
      .catch(() => { if (active) setVoices([]); });
    return () => { active = false; Speech.stop(); };
  }, []);

  const speakerVoices = useMemo(() => {
    const ada = voices.find(v => /female|woman|am[eé]lie|julie|audrey|marie/i.test(v.name)) || voices[0];
    const librarian = voices.find(v => v.identifier !== ada?.identifier && /male|man|thomas|henri|paul|daniel/i.test(v.name))
      || voices.find(v => v.identifier !== ada?.identifier) || ada;
    return { ada, librarian };
  }, [voices]);

  const speakLine = useCallback((index: number, continueSequence = false) => {
    if (index >= DIALOGUE.length) {
      setSpeaking(false);
      setCurrentLine(-1);
      return;
    }
    const line = DIALOGUE[index];
    const voice = line.speaker === 'Ada' ? speakerVoices.ada : speakerVoices.librarian;
    setCurrentLine(index);
    setSpeaking(true);
    try {
      Speech.speak(line.text, {
        language: 'fr-FR',
        voice: voice?.identifier,
        rate: 0.82,
        pitch: line.speaker === 'Ada' ? 1.08 : 0.94,
        onDone: () => continueSequence ? speakLine(index + 1, true) : (setSpeaking(false), setCurrentLine(-1)),
        onStopped: () => setSpeaking(false),
        onError: () => {
          setSpeaking(false);
          Alert.alert('French audio unavailable', 'Install or enable a French text-to-speech voice in your device settings, then try again.');
        },
      });
    } catch {
      setSpeaking(false);
      Alert.alert('French audio unavailable', 'The device could not start speech playback. Check the French text-to-speech voice in device settings.');
    }
  }, [speakerVoices]);

  const stop = () => { Speech.stop(); setSpeaking(false); setCurrentLine(-1); };
  const playAll = () => { Speech.stop(); speakLine(0, true); };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.eyebrow}>
          <Ionicons name="headset-outline" size={18} color={Colors.primary} />
          <Text style={styles.eyebrowText}>SS1 FRENCH · THIRD TERM · LISTENING</Text>
        </View>
        <SectionHeader title="À la bibliothèque" />
        <Text style={styles.intro}>Listen to Ada speaking with the librarian. Listen once for the general meaning, then replay the dialogue and answer the questions.</Text>
        <View style={styles.voiceNote}>
          <Ionicons name="information-circle-outline" size={17} color={Colors.textSub} />
          <Text style={styles.voiceNoteText}>Spoken French is generated by your device’s French text-to-speech voice. Two different voices are used when your device provides them.</Text>
        </View>
        <Btn label={speaking ? 'Playing dialogue…' : 'Play full dialogue'} onPress={playAll} disabled={speaking} style={{ marginTop: Spacing.md }} />
        <Btn label="Stop audio" onPress={stop} disabled={!speaking} variant="outline" style={{ marginTop: Spacing.xs }} />
        <TouchableOpacity style={styles.translationToggle} onPress={() => setShowTranslations(v => !v)}>
          <Ionicons name={showTranslations ? 'eye-off-outline' : 'eye-outline'} size={17} color={Colors.primary} />
          <Text style={styles.translationToggleText}>{showTranslations ? 'Hide English translations' : 'Show English translations'}</Text>
        </TouchableOpacity>
        {!voices.length ? <Text style={styles.voiceHint}>If playback has no French accent, install or enable a French voice in your device’s Text-to-Speech settings.</Text> : null}
      </Card>

      <Card style={{ marginTop: Spacing.md }}>
        <SectionHeader title="Dialogue transcript" />
        {DIALOGUE.map((line, index) => (
          <View key={index} style={[styles.line, currentLine === index && styles.activeLine]}>
            <View style={styles.lineTop}>
              <Text style={styles.speaker}>{line.speaker}</Text>
              <TouchableOpacity onPress={() => { Speech.stop(); speakLine(index); }} accessibilityRole="button" accessibilityLabel={'Play line ' + (index + 1)}>
                <Ionicons name="play-circle" size={27} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.frenchText}>{line.text}</Text>
            {showTranslations ? <Text style={styles.translation}>{line.translation}</Text> : null}
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: Spacing.md }}>
        <SectionHeader title="Compréhension orale" />
        <Text style={styles.intro}>Answer these questions after listening. Each question is worth one mark.</Text>
        {QUESTIONS.map((item, index) => (
          <View key={index} style={styles.question}>
            <Text style={styles.questionText}>{index + 1}. {item.q}</Text>
            <TouchableOpacity onPress={() => setAnswersVisible(v => ({ ...v, [index]: !v[index] }))}>
              <Text style={styles.answerToggle}>{answersVisible[index] ? 'Hide answer' : 'Reveal answer'}</Text>
            </TouchableOpacity>
            {answersVisible[index] ? <Text style={styles.answer}>{item.a}</Text> : null}
          </View>
        ))}
      </Card>
      <Btn label="Back to French topics" onPress={() => navigation.goBack()} variant="outline" style={{ marginTop: Spacing.md }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: Spacing.sm },
  eyebrowText: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700', letterSpacing: 0.5 },
  intro: { color: Colors.textSub, fontSize: Fonts.sizes.sm, lineHeight: 20, marginBottom: Spacing.sm },
  voiceNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, backgroundColor: Colors.textSub + '12', padding: Spacing.sm, borderRadius: Radius.sm },
  voiceNoteText: { flex: 1, color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 17 },
  translationToggle: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', paddingVertical: Spacing.sm },
  translationToggleText: { color: Colors.primary, fontSize: Fonts.sizes.sm, fontWeight: '600' },
  voiceHint: { color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 17 },
  line: { padding: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border, borderRadius: Radius.sm },
  activeLine: { backgroundColor: Colors.primary + '12', borderColor: Colors.primary, borderWidth: 1 },
  lineTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  speaker: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700' },
  frenchText: { color: Colors.text, fontSize: Fonts.sizes.md, lineHeight: 23, paddingRight: Spacing.xs },
  translation: { color: Colors.textSub, fontSize: Fonts.sizes.sm, lineHeight: 19, marginTop: 4, fontStyle: 'italic' },
  question: { paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  questionText: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600', lineHeight: 20 },
  answerToggle: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700', marginTop: 5 },
  answer: { color: Colors.success, fontSize: Fonts.sizes.sm, marginTop: 4 },
});
