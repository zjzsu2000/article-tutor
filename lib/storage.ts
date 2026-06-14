import type { SavedWord, WordEntry, WordSource } from "./types";

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

// Defensively coerce one stored item into a SavedWord. Old entries may lack
// the source metadata fields added later; entries from very old builds may
// even lack `savedAt`. We keep anything with a usable `word` string and fill
// safe defaults so the notebook never crashes on legacy data.
function normalizeSavedWord(raw: unknown): SavedWord | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.word !== "string" || r.word.length === 0) return null;
  return {
    ...(r as SavedWord),
    word: r.word,
    translation: typeof r.translation === "string" ? r.translation : "",
    savedAt: typeof r.savedAt === "number" ? r.savedAt : 0,
  };
}

export function loadSavedWords(): SavedWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeSavedWord)
      .filter((w): w is SavedWord => w !== null);
  } catch {
    return [];
  }
}

export function isSaved(word: string): boolean {
  const key = word.toLowerCase();
  return loadSavedWords().some((w) => w.word.toLowerCase() === key);
}

export function saveWord(entry: WordEntry, source?: WordSource): SavedWord[] {
  const list = loadSavedWords();
  const key = entry.word.toLowerCase();
  if (list.some((w) => w.word.toLowerCase() === key)) return list;
  const next: SavedWord[] = [
    { ...entry, ...source, savedAt: Date.now() },
    ...list,
  ];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("savedWords:changed"));
  return next;
}

export function removeWord(word: string): SavedWord[] {
  return removeWords([word]);
}

// Remove one or more words in a single write. Matching is case-insensitive,
// consistent with saveWord/isSaved.
export function removeWords(words: string[]): SavedWord[] {
  if (typeof window === "undefined") return [];
  const keys = new Set(words.map((w) => w.toLowerCase()));
  const next = loadSavedWords().filter((w) => !keys.has(w.word.toLowerCase()));
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("savedWords:changed"));
  return next;
}
