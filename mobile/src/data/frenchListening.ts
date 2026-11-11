export type FrenchDialogueLine = {
  speaker: 'Ada' | 'Le bibliothécaire';
  text: string;
  translation: string;
};

export const FRENCH_DIALOGUE: FrenchDialogueLine[] = [
  { speaker: 'Ada', text: 'Bonjour, monsieur. Je cherche un livre sur les animaux.', translation: 'Good morning, sir. I am looking for a book about animals.' },
  { speaker: 'Le bibliothécaire', text: 'Bonjour. Regardez la deuxième étagère, à gauche.', translation: 'Good morning. Look at the second shelf, on the left.' },
  { speaker: 'Ada', text: 'Merci. Est-ce que je peux emprunter ce livre ?', translation: 'Thank you. Can I borrow this book?' },
  { speaker: 'Le bibliothécaire', text: 'Oui. Avez-vous votre carte ?', translation: 'Yes. Do you have your card?' },
  { speaker: 'Ada', text: 'Oui, la voici. Quand dois-je rendre le livre ?', translation: 'Yes, here it is. When must I return the book?' },
  { speaker: 'Le bibliothécaire', text: 'Vendredi prochain.', translation: 'Next Friday.' },
  { speaker: 'Ada', text: 'Très bien. Merci et au revoir.', translation: 'Very good. Thank you and goodbye.' },
  { speaker: 'Le bibliothécaire', text: 'Au revoir.', translation: 'Goodbye.' },
];

export type FrenchListeningQuestion = {
  q: string;
  options: [string, string, string];
  answer: 0 | 1 | 2;
};

export const FRENCH_LISTENING_QUESTIONS: FrenchListeningQuestion[] = [
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

export function gradeFrenchListeningAnswers(answers: Record<number, number>) {
  const answered = FRENCH_LISTENING_QUESTIONS.filter((_, index) =>
    Number.isInteger(answers[index]) && answers[index] >= 0 && answers[index] < 3,
  ).length;
  const score = FRENCH_LISTENING_QUESTIONS.reduce(
    (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
    0,
  );
  return {
    answered,
    total: FRENCH_LISTENING_QUESTIONS.length,
    score,
    complete: answered === FRENCH_LISTENING_QUESTIONS.length,
  };
}
