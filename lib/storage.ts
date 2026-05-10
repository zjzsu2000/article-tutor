import type { SavedWord, WordEntry } from "./types";

const KEY = "english_study.savedWords";

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
