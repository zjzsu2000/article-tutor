import type { Locale } from "./i18n";

export type LocalizedString = Record<Locale, string>;

export type Topic = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  emoji: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  articleId: string;
};

export type Sentence = {
  id: string;
  text: string;
  translation: string;
  grammar: string;
};

export type Article = {
  id: string;
  topicId: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
  sentences: Sentence[];
};

export type WordEntry = {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  translation: string;
  example: string;
  exampleTranslation: string;
};

export type SavedWord = WordEntry & { savedAt: number };
