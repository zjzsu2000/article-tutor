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

export type QuestionType = "vocabulary" | "detail" | "main_idea";

export type Question = {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Article = {
  id: string;
  topicId: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
  sentences: Sentence[];
  quiz?: Question[];
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
