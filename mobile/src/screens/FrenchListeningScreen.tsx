import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
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
  { q: 'Quel livre cherche Ada ?', options: ['Un livre sur les animaux.', 'Un livre sur les voitures.', 'Un livre sur la musique.'], answer: 0 },
  { q: 'Où doit-elle regarder ?', options: ['Sur la première étagère, à droite.', 'Sur la deuxième étagère, à gauche.', 'Près de la porte.'], answer: 1 },
  { q: 'Que demande Ada au bibliothécaire ?', options: ['Si elle peut acheter le livre.', 'Si elle peut emprunter le livre.', 'Si elle peut lire dehors.'], answer: 1 },
  { q: 'Que demande le bibliothécaire à Ada ?', options: ['Si elle a sa carte.', 'Si elle connaît le directeur.', 'Si elle a de l’argent.'], answer: 0 },
  { q: 'Que montre Ada ?', options: ['Son cahier.', 'Son téléphone.', 'Sa carte.'], answer: 2 },
  { q: 'Quand doit-elle rendre le livre ?', options: ['Lundi prochain.', 'Vendredi prochain.', 'Demain matin.'], answer: 1 },
  { q: 'Combien de personnes parlent dans le dialogue ?', options: ['Deux personnes.', 'Trois personnes.', 'Quatre personnes.'], answer: 0 },
  { q: 'Qui indique où se trouve le livre ?', options: ['Ada.', 'Le bibliothécaire.', 'Un autre élève.'], answer: 1 },
  { q: 'Quelle expression de politesse Ada utilise-t-elle ?', options: ['Pardon.', 'S’il vous plaît.', 'Merci.'], answer: 2 },
  { q: 'Quelle expression termine la conversation ?', options: ['À demain.', 'Au revoir.', 'Bonne nuit.'], answer: 1 },
];

const STANDARD_AUDIO = require('../../assets/french/SS1_French_Dialogue_standard.mp3');
const SLOW_AUDIO = require('../../assets/french/SS1_French_Dialogue_slow.mp3');

export default function FrenchListeningScreen({ navigation }: any) {
  const standardPlayer = useAudioPlayer(STANDARD_AUDIO);
  const slowPlayer = useAudioPlayer(SLOW_AUDIO);
  const standardStatus = useAudioPlayerStatus(standardPlayer);
  const slowStatus = useAudioPlayerStatus(slowPlayer);
  const recordedAudioPlaying = standardStatus.playing || slowStatus.playing;
  const [voices, setVoices] = useState<Array<{ identifier: string; name: string; language: string }>>([]);
  const [currentLine, setCurrentLine] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.82);
  const [activeRecording, setActiveRecording] = useState<'standard' | 'slow'>('standard');
  const activeRecordingStatus = activeRecording === 'slow' ? slowStatus : standardStatus;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    Speech.getAvailableVoicesAsync()
      .then(found => { if (active) setVoices(found.filter(v => v.language?.toLowerCase().startsWith('fr'))); })
      .catch(() => { if (active) setVoices([]); });
    return () => { active = false; Speech.stop(); standardPlayer.pause(); slowPlayer.pause(); };
  }, [standardPlayer, slowPlayer]);

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
        rate: speechRate,
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
  }, [speakerVoices, speechRate]);

  const playRecorded = (mode: 'standard' | 'slow') => {
    Speech.stop();
    setSpeaking(false);
    setCurrentLine(-1);
    const player = mode === 'standard' ? standardPlayer : slowPlayer;
    const otherPlayer = mode === 'standard' ? slowPlayer : standardPlayer;
    const status = mode === 'standard' ? standardStatus : slowStatus;
    setActiveRecording(mode);
    otherPlayer.pause();
    if (status.playing) {
      player.pause();
      return;
    }
    void player.seekTo(0)
      .then(() => player.play())
      .catch(() => Alert.alert('Audio unavailable', 'The recorded French dialogue could not be played on this device. You can use the device speech fallback below.'));
  };

  const stop = () => {
    Speech.stop();
    standardPlayer.pause();
    slowPlayer.pause();
    setSpeaking(false);
    setCurrentLine(-1);
  };
  const playAll = () => { stop(); speakLine(0, true); };
  const formatTime = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
  };

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
          <Text style={styles.voiceNoteText}>The two recordings are bundled in the app and play offline. Ada and the librarian have distinct synthetic French voices. Device text-to-speech remains available for individual-line practice.</Text>
        </View>
        <Text style={styles.recordingHeading}>Recorded dialogue</Text>
        <View style={styles.speedRow}>
          <Btn label={standardStatus.playing ? 'Pause standard' : 'Play standard recording'} onPress={() => playRecorded('standard')} disabled={!standardStatus.isLoaded} style={{ flex: 1 }} />
          <Btn label={slowStatus.playing ? 'Pause slow' : 'Play slow recording'} onPress={() => playRecorded('slow')} disabled={!slowStatus.isLoaded} variant="outline" style={{ flex: 1 }} />
        </View>
        <Text style={styles.audioStatus}>
          {recordedAudioPlaying ? 'Playing recorded French dialogue' : 'Recorded audio ready'} · {formatTime(activeRecordingStatus.currentTime)} / {formatTime(activeRecordingStatus.duration)}
        </Text>
        <Btn label={speaking ? 'Playing device speech…' : 'Play with device speech'} onPress={playAll} disabled={speaking || recordedAudioPlaying} variant="outline" style={{ marginTop: Spacing.md }} />
        <View style={styles.speedRow}>
          <Text style={styles.speedLabel}>Device voice speed</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: speechRate === 0.68 }} style={[styles.speedButton, speechRate === 0.68 && styles.speedButtonActive]} onPress={() => setSpeechRate(0.68)}>
            <Text style={[styles.speedButtonText, speechRate === 0.68 && styles.speedButtonTextActive]}>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: speechRate === 0.82 }} style={[styles.speedButton, speechRate === 0.82 && styles.speedButtonActive]} onPress={() => setSpeechRate(0.82)}>
            <Text style={[styles.speedButtonText, speechRate === 0.82 && styles.speedButtonTextActive]}>Normal</Text>
          </TouchableOpacity>
        </View>
        <Btn label="Stop audio" onPress={stop} disabled={!speaking && !recordedAudioPlaying} variant="outline" style={{ marginTop: Spacing.xs }} />
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
              <TouchableOpacity onPress={() => { stop(); speakLine(index); }} accessibilityRole="button" accessibilityLabel={'Play line ' + (index + 1)}>
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
        <Text style={styles.intro}>Choose one answer for each question. Each correct answer earns one mark. Submit when you have answered all ten.</Text>
        {QUESTIONS.map((item, index) => (
          <View key={index} style={styles.question}>
            <Text style={styles.questionText}>{index + 1}. {item.q}</Text>
            {item.options.map((option, optionIndex) => {
              const selected = selectedAnswers[index] === optionIndex;
              const correct = item.answer === optionIndex;
              const showResult = quizSubmitted;
              return (
                <TouchableOpacity
                  key={optionIndex}
                  disabled={quizSubmitted}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, disabled: quizSubmitted }}
                  onPress={() => setSelectedAnswers(current => ({ ...current, [index]: optionIndex }))}
                  style={[styles.option, selected && styles.optionSelected, showResult && correct && styles.optionCorrect, showResult && selected && !correct && styles.optionIncorrect]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{String.fromCharCode(65 + optionIndex)}. {option}</Text>
                  {showResult && correct ? <Ionicons name="checkmark-circle" size={18} color={Colors.success} /> : null}
                  {showResult && selected && !correct ? <Ionicons name="close-circle" size={18} color={Colors.error} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        {!quizSubmitted ? (
          <Btn label={Object.keys(selectedAnswers).length === QUESTIONS.length ? 'Submit answers' : 'Answer all 10 questions'} disabled={Object.keys(selectedAnswers).length !== QUESTIONS.length} onPress={() => setQuizSubmitted(true)} style={{ marginTop: Spacing.md }} />
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Your score: {QUESTIONS.filter((item, index) => selectedAnswers[index] === item.answer).length} / 10</Text>
            <Text style={styles.intro}>Correct answers are marked in green. Review the dialogue and try again if needed.</Text>
            <Btn label="Try again" onPress={() => { setSelectedAnswers({}); setQuizSubmitted(false); }} variant="outline" />
          </View>
        )}
      </Card>
      <Btn label="Return to lesson" onPress={() => navigation.goBack()} variant="outline" style={{ marginTop: Spacing.md }} />
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
  recordingHeading: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '700', marginTop: Spacing.md },
  audioStatus: { color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: Spacing.xs },
  line: { padding: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border, borderRadius: Radius.sm },
  activeLine: { backgroundColor: Colors.primary + '12', borderColor: Colors.primary, borderWidth: 1 },
  lineTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  speaker: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700' },
  frenchText: { color: Colors.text, fontSize: Fonts.sizes.md, lineHeight: 23, paddingRight: Spacing.xs },
  translation: { color: Colors.textSub, fontSize: Fonts.sizes.sm, lineHeight: 19, marginTop: 4, fontStyle: 'italic' },
  question: { paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  speedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm, marginBottom: Spacing.xs },
  speedLabel: { color: Colors.textSub, fontSize: Fonts.sizes.xs, fontWeight: '600', marginRight: 'auto' },
  speedButton: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  speedButtonActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '14' },
  speedButtonText: { color: Colors.textSub, fontSize: Fonts.sizes.xs, fontWeight: '600' },
  speedButtonTextActive: { color: Colors.primary },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.xs, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, padding: Spacing.sm, marginTop: Spacing.xs },
  optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  optionCorrect: { borderColor: Colors.success, backgroundColor: Colors.success + '12' },
  optionIncorrect: { borderColor: Colors.error, backgroundColor: Colors.error + '10' },
  optionText: { flex: 1, color: Colors.text, fontSize: Fonts.sizes.sm, lineHeight: 19 },
  optionTextSelected: { fontWeight: '700' },
  resultBox: { marginTop: Spacing.md, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.primary + '10' },
  resultTitle: { color: Colors.primary, fontSize: Fonts.sizes.lg, fontWeight: '800', marginBottom: Spacing.xs },
  questionText: { color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600', lineHeight: 20 },
  answerToggle: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700', marginTop: 5 },
  answer: { color: Colors.success, fontSize: Fonts.sizes.sm, marginTop: 4 },
});
