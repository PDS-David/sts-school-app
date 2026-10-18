import api from './client';

// Thin wrapper around the backend's /ai/* routes (backend/src/routes/ai.ts).
// Every function here is what the app presents to users as "Brainee" — the
// backend has no idea of that branding; it's applied only here and in the UI.

export interface BraineeChatTurn {
  role: 'user' | 'brainee';
  text: string;
}

async function callBrainee(path: string, body: Record<string, unknown>): Promise<string> {
  try {
    const { data } = await api.post(`/ai/${path}`, body);
    if (!data?.ok) throw new Error(data?.error ?? "Brainee couldn't answer that.");
    return data.reply as string;
  } catch (err: any) {
    if (!err?.response) {
      throw new Error("Brainee needs an internet connection to answer — you're offline right now.");
    }
    const serverMessage = err?.response?.data?.error;
    throw new Error(serverMessage ?? "Brainee is unavailable right now. Please try again shortly.");
  }
}

export function askBrainee(message: string, history?: BraineeChatTurn[]) {
  return callBrainee('chat', { message, history });
}

export function askBraineeToExplain(topic: string, subject?: string, class_name?: string) {
  return callBrainee('explain', { topic, subject, class_name });
}

export function askBraineeForNotes(topic: string, subject?: string) {
  return callBrainee('notes', { topic, subject });
}

export async function askBraineeForHint(question_id: number) {
  return callBrainee('hint', { question_id });
}

export interface DraftQuestion {
  stem: string;
  options?: { key: string; text: string }[];
  correct_keys?: string[];
  marks?: number;
}

export async function askBraineeToDraftQuestions(params: {
  subject?: string; class_name?: string; topic: string; type?: 'mcq' | 'essay'; count?: number;
}): Promise<DraftQuestion[]> {
  try {
    const { data } = await api.post('/ai/generate-questions', params);
    if (!data?.ok) throw new Error(data?.error ?? "Brainee couldn't draft those questions.");
    return data.drafts as DraftQuestion[];
  } catch (err: any) {
    if (!err?.response) {
      throw new Error("Brainee needs an internet connection to answer — you're offline right now.");
    }
    const serverMessage = err?.response?.data?.error;
    throw new Error(serverMessage ?? "Brainee is unavailable right now. Please try again shortly.");
  }
}

// Learner- or teacher-supplied text (a set book extract, a passage, a past
// question). Sent for this one request only; the server does not store it.
export type TextStudyMode =
  | 'summary' | 'story_elements' | 'devices' | 'vocabulary' | 'questions' | 'past_question' | 'mark_answer';
export type TextStudyGenre = 'prose' | 'drama' | 'poetry' | 'passage' | 'other';

export interface TextStudyInput {
  mode: TextStudyMode;
  text?: string;
  title?: string;
  genre?: TextStudyGenre;
  question?: string;
  answer?: string;
  class_name?: string;
}

export function askBraineeAboutText(input: TextStudyInput) {
  return callBrainee('text-study', { ...input });
}
