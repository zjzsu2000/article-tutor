import type { Locale } from "./i18n";

export type LocalizedString = Record<Locale, string>;

// A vocabulary item is either a single word or a multi-word phrase. Phrases
// are first-class: same lookup panel, same notebook, same dictation — only
// the lookup path and the display badge differ.
export type VocabKind = "word" | "phrase";

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
  // For vocabulary-type questions only: the dictionary key of the word being
  // tested (must resolve via lookupWord). Lets a future feature auto-save
  // missed words into the vocabulary notebook. Unused by the current UI.
  word?: string;
};

export type Article = {
  id: string;
  topicId: string;
  title: string;
  subtitle: string;
  // Optional: every curated article states its level. A learner's own pasted
  // article has none, and the reader simply omits the level chip rather than
  // inventing one.
  level?: "Beginner" | "Intermediate" | "Advanced";
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
  word: string; // a single word, or a multi-word phrase (see `isPhrase`)
  translation: string; // Chinese meaning — the one always-present field
  pronunciation?: string;
  partOfSpeech?: string;
  definition?: string; // English definition, when available
  example?: string;
  exampleTranslation?: string;
  collocation?: string; // 搭配, when available
  sourceWeek?: number; // set for Weekly Stories vocabulary
  // What kind of vocabulary item this is. Explicit rather than inferred, so
  // a saved item's kind is a stored fact and never re-guessed from its text.
  // Optional: entries saved before this field existed fall back to a
  // whitespace check (see `vocabKind` in lib/vocab.ts).
  kind?: VocabKind;
  // True when `translation` is only the friendly "not in the dictionary
  // yet" placeholder rather than a real meaning. Lets the UI invite the
  // learner to write their own meaning, and lets dictation skip the item
  // until it has one.
  unknown?: boolean;
};

// A meaning the learner wrote themselves. Kept separate from the
// dictionary-provided `translation` so neither overwrites the other: the
// dictionary entry can still be improved later, and the learner's own
// wording always wins when both exist.
export type UserEdits = {
  userTranslation?: string;
  userUpdatedAt?: number;
};

// Where a saved word came from. All fields are optional so old entries (and
// words saved before this metadata existed) remain valid. Used by the
// vocabulary notebook to group/filter words by week or article.
export type WordSource = {
  articleId?: string;
  articleTitle?: string;
  track?: "weekly-stories";
  weekNumber?: number;
  sourceLabel?: string; // human-readable group label, e.g. "每周小故事 · 第 1 周"
  // The sentence the item was saved from, kept verbatim so practice can show
  // the word or phrase in context (with the target masked) without reopening
  // the article. Optional: items saved before this field existed simply have
  // no context, and practice degrades to a context-free prompt.
  sourceSentence?: string;
};

export type SavedWord = WordEntry & WordSource & UserEdits & { savedAt: number };
