import type { Article, Sentence } from "./types";

// Learner-added articles: paste a title and some English text, read it with
// the same reader as every curated article.
//
// These deliberately do NOT enter `lib/mockData.ts` or the static route table
// — they live only in this browser, and are read through one client-side
// route that adapts them into the existing `Article` shape. Translations,
// grammar notes and quizzes stay empty for now; the reader already renders
// those fields conditionally.

const KEY = "english_study.userArticles";

export type UserArticle = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
};

export const USER_ARTICLE_PREFIX = "user-";

function normalize(raw: unknown): UserArticle | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.text !== "string") return null;
  if (r.text.trim().length === 0) return null;
  return {
    id: r.id,
    title: typeof r.title === "string" && r.title.trim() ? r.title : r.id,
    text: r.text,
    createdAt: typeof r.createdAt === "number" ? r.createdAt : 0,
  };
}

export function loadUserArticles(): UserArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalize)
      .filter((a): a is UserArticle => a !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function getUserArticle(id: string): UserArticle | undefined {
  return loadUserArticles().find((a) => a.id === id);
}

function write(list: UserArticle[]): UserArticle[] {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("userArticles:changed"));
  return list;
}

export function addUserArticle(title: string, text: string): UserArticle {
  const article: UserArticle = {
    id: `${USER_ARTICLE_PREFIX}${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2, 6)}`,
    title: title.trim(),
    text: text.trim(),
    createdAt: Date.now(),
  };
  write([article, ...loadUserArticles()]);
  return article;
}

export function updateUserArticle(
  id: string,
  title: string,
  text: string
): UserArticle[] {
  return write(
    loadUserArticles().map((a) =>
      a.id === id ? { ...a, title: title.trim(), text: text.trim() } : a
    )
  );
}

export function removeUserArticle(id: string): UserArticle[] {
  return write(loadUserArticles().filter((a) => a.id !== id));
}

// Abbreviations that end in a period without ending a sentence. Short list on
// purpose — a wrong split only affects where a tappable sentence begins, and
// the learner can always re-paste with clearer line breaks.
const ABBREVIATIONS = /\b(mr|mrs|ms|dr|prof|st|vs|etc|e\.g|i\.e)\.$/i;

// Split pasted text into reader sentences. Paragraph breaks always split;
// inside a paragraph we split after . ! ? … followed by whitespace.
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  for (const para of text.split(/\n\s*\n|\r\n\s*\r\n/)) {
    const cleaned = para.replace(/\s+/g, " ").trim();
    if (!cleaned) continue;
    let buffer = "";
    for (const chunk of cleaned.split(/(?<=[.!?…])\s+/)) {
      buffer = buffer ? `${buffer} ${chunk}` : chunk;
      if (ABBREVIATIONS.test(buffer)) continue; // "Mr." is not a sentence end
      out.push(buffer);
      buffer = "";
    }
    if (buffer.trim()) out.push(buffer.trim());
  }
  return out;
}

// Rough reading time for a young learner, in whole minutes.
function estimateMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 90));
}

/**
 * Adapt a learner-added article into the `Article` shape the existing reader
 * consumes. Translation and grammar are empty strings: `InfoPanel` skips
 * empty fields, so a sentence tap shows the sentence and its read-aloud
 * button without pretending an explanation exists.
 */
export function toArticle(source: UserArticle): Article {
  const sentences: Sentence[] = splitSentences(source.text).map((text, i) => ({
    id: `s${i + 1}`,
    text,
    translation: "",
    grammar: "",
  }));
  return {
    id: source.id,
    topicId: "user",
    title: source.title,
    subtitle: "",
    minutes: estimateMinutes(source.text),
    sentences,
  };
}
