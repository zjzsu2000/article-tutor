import type { SavedWord, WordEntry } from "./types";

const KEY = "english_study.savedWords";
const QUIZ_KEY = "english_study.quizProgress";
const QUIZ_HISTORY_KEY = "english_study.quizHistory";

// How many recently shown question ids to remember per article, used to
// reduce repeats when building a new attempt.
const HISTORY_CAP = 6;

// The in-progress (or finished) Challenge attempt for one article: the
// selected question ids, in order, plus the chosen option per question
// (null = not yet answered). Storing the ids lets a reload resume the same
// attempt instead of re-randomizing.
export type QuizProgress = {
  questionIds: string[];
  answers: (string | null)[];
};

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
  if (
    !entry ||
    !Array.isArray(entry.questionIds) ||
    !Array.isArray(entry.answers) ||
    entry.questionIds.length !== entry.answers.length
  ) {
    return null; // absent, legacy (no questionIds), or malformed
  }
  return entry;
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

type QuizHistoryMap = Record<string, string[]>;

function loadQuizHistoryMap(): QuizHistoryMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function loadQuizHistory(articleId: string): string[] {
  const entry = loadQuizHistoryMap()[articleId];
  return Array.isArray(entry) ? entry.filter((x) => typeof x === "string") : [];
}

// Record the question ids shown in an attempt, most-recent-first, deduped
// and capped, so the next attempt can prefer fresher questions.
export function recordQuizHistory(articleId: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  const map = loadQuizHistoryMap();
  const prev = Array.isArray(map[articleId]) ? map[articleId] : [];
  const merged = [...ids, ...prev.filter((id) => !ids.includes(id))];
  map[articleId] = merged.slice(0, HISTORY_CAP);
  window.localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(map));
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
