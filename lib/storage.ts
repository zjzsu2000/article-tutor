import type { SavedWord, WordEntry } from "./types";

const KEY = "english_study.savedWords";
const QUIZ_KEY = "english_study.quizProgress";

// Chosen option string per question (null = not yet answered).
export type QuizProgress = { answers: (string | null)[] };

type QuizProgressMap = Record<string, QuizProgress>;

function loadQuizMap(): QuizProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function loadQuizProgress(articleId: string): QuizProgress | null {
  const entry = loadQuizMap()[articleId];
  return entry && Array.isArray(entry.answers) ? entry : null;
}

export function saveQuizProgress(
  articleId: string,
  progress: QuizProgress
): void {
  if (typeof window === "undefined") return;
  const map = loadQuizMap();
  map[articleId] = progress;
  window.localStorage.setItem(QUIZ_KEY, JSON.stringify(map));
}

export function clearQuizProgress(articleId: string): void {
  if (typeof window === "undefined") return;
  const map = loadQuizMap();
  delete map[articleId];
  window.localStorage.setItem(QUIZ_KEY, JSON.stringify(map));
}

export function loadSavedWords(): SavedWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isSaved(word: string): boolean {
  const key = word.toLowerCase();
  return loadSavedWords().some((w) => w.word.toLowerCase() === key);
}

export function saveWord(entry: WordEntry): SavedWord[] {
  const list = loadSavedWords();
  const key = entry.word.toLowerCase();
  if (list.some((w) => w.word.toLowerCase() === key)) return list;
  const next: SavedWord[] = [{ ...entry, savedAt: Date.now() }, ...list];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("savedWords:changed"));
  return next;
}

export function removeWord(word: string): SavedWord[] {
  const key = word.toLowerCase();
  const next = loadSavedWords().filter((w) => w.word.toLowerCase() !== key);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("savedWords:changed"));
  return next;
}
