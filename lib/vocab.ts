import { getDict, locales } from "./i18n";
import type { SavedWord, UserEdits, VocabKind, WordEntry } from "./types";

// Shared, window-free helpers for vocabulary items (words *and* phrases).
// Kept out of lib/storage.ts so components and future non-browser callers can
// import them without pulling in localStorage access.

// The dedupe / identity key for a vocabulary item. Lowercased and
// whitespace-collapsed so "Look  After" and "look after" are the same item.
// For single words this is exactly the old `word.toLowerCase()` behaviour,
// which keeps previously saved entries matching.
export function vocabKey(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

// Whitespace inference, used only to classify text that has no stored kind
// yet (a fresh selection, or an entry saved before `kind` existed).
export function isPhraseText(text: string): boolean {
  return /\s/.test(text.trim());
}

// The kind of a vocabulary item: the stored value when there is one, and the
// whitespace fallback for legacy entries.
export function vocabKind(entry: WordEntry): VocabKind {
  return entry.kind ?? (isPhraseText(entry.word) ? "phrase" : "word");
}

export function isPhrase(entry: WordEntry): boolean {
  return vocabKind(entry) === "phrase";
}

// The friendly "not in the dictionary yet" strings, in every locale. Entries
// saved before `WordEntry.unknown` existed stored one of these in
// `translation`, so we still recognise them as "no real meaning".
const LEGACY_PLACEHOLDERS = ["暂无释义", "No translation yet"];
const PLACEHOLDERS = new Set([
  ...locales.map((l) => getDict(l).panel.notInDict),
  ...LEGACY_PLACEHOLDERS,
]);

// Does this entry carry a real dictionary meaning (as opposed to nothing, or
// the placeholder text)?
export function hasDictionaryMeaning(entry: WordEntry): boolean {
  const t = entry.translation?.trim() ?? "";
  return t.length > 0 && !entry.unknown && !PLACEHOLDERS.has(t);
}

// The meaning to show the learner: their own wording wins, the dictionary
// meaning is the fallback, and the placeholder never counts. Returns "" when
// the item has no usable meaning yet.
export function displayMeaning(entry: WordEntry & UserEdits): string {
  const own = entry.userTranslation?.trim() ?? "";
  if (own) return own;
  return hasDictionaryMeaning(entry) ? entry.translation.trim() : "";
}

// Usable in dictation only once there is something to prompt with.
export function hasMeaning(entry: WordEntry & UserEdits): boolean {
  return displayMeaning(entry).length > 0;
}

// A group key derived from a saved word's source metadata. Weekly Stories
// words group by week; other articles group by article id; words saved before
// this metadata existed fall back to "uncategorized" so nothing is lost.
export type GroupKey = string; // "week:1" | "article:<id>" | "uncategorized"

export function groupKeyOf(w: SavedWord): GroupKey {
  // Priority reflects where the learner actually saved the word:
  // 1. Explicit weekly-save metadata (new saves from a Weekly Stories article).
  if (typeof w.weekNumber === "number") return `week:${w.weekNumber}`;
  // 2. Article source metadata (new saves from any article). This must come
  //    before sourceWeek: a common word saved from a non-weekly article can
  //    still carry the dictionary's sourceWeek, but it belongs to its article.
  if (w.articleId) return `article:${w.articleId}`;
  // 3. Weekly track flag without a number (defensive).
  if (w.track === "weekly-stories") return "week:0";
  // 4. Legacy fallback: words saved before article-source metadata existed
  //    still carry the dictionary's sourceWeek, with no articleId.
  if (typeof w.sourceWeek === "number") return `week:${w.sourceWeek}`;
  return "uncategorized";
}

// Answer comparison for dictation: case-insensitive, whitespace-collapsed,
// and forgiving about surrounding punctuation and curly apostrophes, so a
// learner is never marked wrong for typing "don't" as "don’t".
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9'\- ]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function answersMatch(input: string, target: string): boolean {
  const a = normalizeAnswer(input);
  return a.length > 0 && a === normalizeAnswer(target);
}
