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

export type QuestionType =
  | "vocabulary"
  | "detail"
  | "main_idea"
  | "grammar"
  | "tense"
  | "singular_plural"
  | "comparative";

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
  // Optional: marks an article as part of a learning track (e.g. the
  // 18-week "Weekly Stories / 每周小故事" track). Existing articles leave
  // these undefined and are unaffected.
  track?: "weekly-stories";
  weekNumber?: number;
  chineseTitle?: string;
  focus?: LocalizedString;
};

// Lightweight index entry for the Weekly Stories track. Lets the listing
// show all 18 weeks — including ones not yet integrated — without creating
// a route or a full Article. `articleId` is set only once a week is fully
// adapted, so unfinished weeks never produce a broken link.
export type WeeklyStory = {
  week: number;
  titleEn: string;
  titleZh: string;
  theme: LocalizedString;
  articleId?: string;
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
