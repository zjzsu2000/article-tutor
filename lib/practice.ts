import type { SavedWord } from "./types";
import {
  canonicalMeaning,
  chineseAnswerMatches,
  chineseGlosses,
  meaningSource,
  normalizeAnswer,
  normalizeChineseAnswer,
  vocabKey,
} from "./vocab";

/**
 * The vocabulary practice session model.
 *
 * Everything that decides *what is asked, what counts as right, and what a
 * hint reveals* lives here, as pure functions with an injectable `rand`. The
 * React component only renders a `PracticeQuestion` and reports the answer
 * back, so the four direction × answer-mode combinations are four sets of
 * parameters through one pipeline — not four implementations.
 *
 * This module must stay free of `window` and of localized UI copy.
 */

export type PracticeDirection = "zh-to-en" | "en-to-zh";
export type PracticeAnswerMode = "typed" | "multiple-choice";

export type PracticeConfig = {
  direction: PracticeDirection;
  answerMode: PracticeAnswerMode;
};

// What a hint can reveal, in the order it is offered. The ladder is built per
// question, so the UI never has to ask "which direction is this again?".
export type HintKind =
  | "letters" // zh→en: first letter of each word in the target
  | "answer" // the target word/phrase (zh→en) or the meaning (en→zh)
  | "unmasked-context"; // the source sentence with the target restored

export type PracticeQuestion = {
  item: SavedWord;
  direction: PracticeDirection;
  // The mode actually used: a question falls back to "typed" when there are
  // not enough distractors to build an honest multiple choice.
  answerMode: PracticeAnswerMode;
  prompt: string; // Chinese meaning (zh→en) or the English item (en→zh)
  canonicalAnswer: string; // what is shown as *the* answer
  acceptedAnswers: string[]; // everything a typed answer may match
  choices?: string[]; // present only for multiple-choice
  // The learner's own wording, when the dictionary owns the canonical answer.
  // Shown as their note; never the graded answer.
  learnerNote?: string;
  sourceSentence?: string; // the saved sentence, verbatim
  maskedSentence?: string; // the context shown before any hint is used
  contextMasked: boolean; // false when the target could not be located
  hints: HintKind[];
};

export type Grade = {
  correct: boolean;
  // The answer to show the learner afterwards — always the canonical one.
  canonicalAnswer: string;
};

// ── Context masking ──────────────────────────────────────────────────────

const MASK = "________";

// Escape a literal for use inside a RegExp.
function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Hide `target` inside `sentence`, so a learner can see the context without
 * being handed the answer.
 *
 * - case-insensitive, and works for multi-word phrases
 * - flexible whitespace between the words of a phrase
 * - never matches inside a longer word: masking "book" leaves "booked" alone
 * - when the target cannot be found, the sentence is returned unchanged with
 *   `masked: false`, so callers can be honest about it rather than pretending
 */
export function maskTarget(
  sentence: string,
  target: string
): { text: string; masked: boolean } {
  const clean = target.trim();
  if (!sentence || !clean) return { text: sentence, masked: false };

  const words = clean.split(/\s+/).filter(Boolean).map(escape);
  if (words.length === 0) return { text: sentence, masked: false };

  // A letter/digit on either side means we are inside a bigger word. The
  // apostrophe guard keeps "book" from matching the "book" in "book's".
  const body = words.join("[\\s]+");
  const re = new RegExp(`(^|[^A-Za-z0-9'’])(${body})(?![A-Za-z0-9'’])`, "gi");

  let masked = false;
  const text = sentence.replace(re, (_m, lead: string) => {
    masked = true;
    return `${lead}${MASK}`;
  });
  return masked ? { text, masked: true } : { text: sentence, masked: false };
}

// The "first letters" hint: keep the opening letter of every word, hide the
// rest, and leave punctuation (hyphens, apostrophes) visible as scaffolding.
export function letterHint(target: string): string {
  return target
    .split(/\s+/)
    .map((part) =>
      part
        .split("")
        .map((ch, i) => (i === 0 || !/[A-Za-z]/.test(ch) ? ch : "_"))
        .join("")
    )
    .join(" ");
}

// ── Eligibility ──────────────────────────────────────────────────────────

/**
 * Both directions need a Chinese meaning: one uses it as the prompt, the
 * other as the answer. An item with neither a dictionary meaning nor a
 * learner-written one is excluded until it has one.
 */
export function isPractisable(item: SavedWord): boolean {
  return canonicalMeaning(item).length > 0;
}

// ── Distractors and choices ──────────────────────────────────────────────

// The answer text of an item in a given direction: the English item itself,
// or its canonical Chinese meaning.
export function answerTextOf(
  item: SavedWord,
  direction: PracticeDirection
): string {
  return direction === "zh-to-en" ? item.word.trim() : canonicalMeaning(item);
}

function normalizeFor(direction: PracticeDirection, text: string): string {
  return direction === "zh-to-en"
    ? normalizeAnswer(text)
    : normalizeChineseAnswer(text);
}

export const MAX_CHOICES = 4;
export const MIN_CHOICES = 3;

/**
 * Everything that makes two vocabulary items indistinguishable as answers.
 *
 * An item is identified by its English spelling *and* by every Chinese gloss
 * it can be answered with — both namespaces, in both directions, because
 * ambiguity is symmetric:
 *
 * - English→Chinese: "船长；队长" and "队长" are both graded correct when
 *   typed, so they must never be offered as rival options.
 * - Chinese→English: with the prompt "船长；队长" on screen, an option glossed
 *   "队长" (`leader`) is just as defensible as `captain`, even though only one
 *   is graded correct. The pool already knows each item's meaning, so this
 *   needs no thesaurus — only the glosses the learner can actually see.
 *
 * The learner's own wording counts as one of the item's meanings whenever it
 * would also be graded correct.
 */
export function ambiguityKeys(item: SavedWord): string[] {
  const keys: string[] = [];
  const english = normalizeAnswer(item.word);
  if (english) keys.push(`en:${english}`);

  const addGlosses = (text: string) => {
    for (const gloss of chineseGlosses(text)) {
      const key = normalizeChineseAnswer(gloss);
      if (key) keys.push(`zh:${key}`);
    }
  };
  addGlosses(canonicalMeaning(item));
  // A learner note is accepted alongside a dictionary answer, so it makes the
  // item ambiguous with anything else carrying that meaning.
  if (meaningSource(item) === "dictionary") {
    addGlosses(item.userTranslation?.trim() ?? "");
  }
  return keys;
}

/**
 * Build the option list for one multiple-choice question.
 *
 * Distractors come from the learner's own vocabulary pool, so the options are
 * always real words they have met. A candidate is rejected when it is
 * indistinguishable from the answer — same English spelling, or a shared
 * Chinese gloss (see `ambiguityKeys`) — and candidates are checked against
 * each other too, so no two rival options mean the same thing. This runs in
 * both directions: multiple choice must never mark an answer wrong that the
 * learner could defend from what is on screen.
 *
 * Returns null when fewer than `MIN_CHOICES` honest options exist — the
 * caller then falls back to typing rather than padding with invented data.
 */
export function buildChoices(
  correct: string,
  pool: SavedWord[],
  item: SavedWord,
  direction: PracticeDirection,
  rand: () => number = Math.random
): string[] | null {
  if (!correct.trim()) return null;

  // Anything sharing an identity with the answer is off limits as a
  // distractor; taken options join the blocked set as we go.
  const blocked = new Set<string>(ambiguityKeys(item));

  const candidates: string[] = [];
  for (const other of pool) {
    if (vocabKey(other.word) === vocabKey(item.word)) continue;
    const text = answerTextOf(other, direction);
    if (!text) continue;
    const keys = ambiguityKeys(other);
    if (keys.length === 0) continue;
    if (keys.some((k) => blocked.has(k))) continue;
    for (const k of keys) blocked.add(k);
    candidates.push(text);
  }

  const distractors = shuffle(candidates, rand).slice(0, MAX_CHOICES - 1);
  if (distractors.length + 1 < MIN_CHOICES) return null;
  return shuffle([correct, ...distractors], rand);
}

export function shuffle<T>(items: T[], rand: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── Question building ────────────────────────────────────────────────────

/**
 * Turn one saved item into one question.
 *
 * `pool` is the same scope the round was drawn from, used only for
 * distractors. Returns null for items that cannot be asked about.
 */
export function buildQuestion(
  item: SavedWord,
  pool: SavedWord[],
  config: PracticeConfig,
  rand: () => number = Math.random
): PracticeQuestion | null {
  const meaning = canonicalMeaning(item);
  if (!meaning) return null;
  const target = item.word.trim();
  if (!target) return null;

  const zhToEn = config.direction === "zh-to-en";
  const prompt = zhToEn ? meaning : target;
  const canonicalAnswer = zhToEn ? target : meaning;

  // Typed answers: English compares against the item itself; Chinese accepts
  // the canonical meaning, each of its glosses, and — when the dictionary
  // owns the canonical answer — the learner's own wording as well. Accepting
  // their note is not the same as replacing the canonical answer with it.
  const acceptedAnswers = zhToEn
    ? [target]
    : [
        ...chineseGlosses(meaning),
        ...(meaningSource(item) === "dictionary"
          ? chineseGlosses(item.userTranslation?.trim() ?? "")
          : []),
      ];

  const sourceSentence = item.sourceSentence?.trim() || undefined;
  // The context is only masked in zh→en, where the English target *is* the
  // answer. In en→zh the English is already on screen, so the sentence is
  // shown as-is and simply helps with polysemous words.
  const maskResult =
    sourceSentence && zhToEn
      ? maskTarget(sourceSentence, target)
      : { text: sourceSentence ?? "", masked: false };

  let answerMode = config.answerMode;
  let choices: string[] | undefined;
  if (answerMode === "multiple-choice") {
    const built = buildChoices(canonicalAnswer, pool, item, config.direction, rand);
    if (built) choices = built;
    else answerMode = "typed"; // not enough honest distractors
  }

  // Hint ladder. zh→en climbs from a nudge to the answer to the full
  // sentence; en→zh has its context on screen from the start (it cannot leak
  // the Chinese answer), so the only thing left to reveal is the meaning.
  const hints: HintKind[] = zhToEn
    ? [
        ...(answerMode === "typed" ? (["letters"] as HintKind[]) : []),
        "answer",
        ...(maskResult.masked ? (["unmasked-context"] as HintKind[]) : []),
      ]
    : ["answer"];

  return {
    item,
    direction: config.direction,
    answerMode,
    prompt,
    canonicalAnswer,
    acceptedAnswers,
    choices,
    learnerNote:
      meaningSource(item) === "dictionary"
        ? item.userTranslation?.trim() || undefined
        : undefined,
    sourceSentence,
    maskedSentence: sourceSentence ? maskResult.text : undefined,
    contextMasked: maskResult.masked,
    hints,
  };
}

// ── Grading ──────────────────────────────────────────────────────────────

/**
 * Grade one answer. Multiple choice is exact-match on the chosen option;
 * typed answers go through the direction's normalization — English is
 * case/punctuation tolerant, Chinese additionally accepts any single gloss of
 * a multi-gloss dictionary entry.
 */
export function gradeAnswer(question: PracticeQuestion, input: string): Grade {
  const answer = input.trim();
  const correct =
    question.answerMode === "multiple-choice"
      ? answer === question.canonicalAnswer
      : question.direction === "zh-to-en"
        ? normalizeAnswer(answer).length > 0 &&
          normalizeAnswer(answer) === normalizeAnswer(question.canonicalAnswer)
        : chineseAnswerMatches(answer, question.acceptedAnswers);
  return { correct, canonicalAnswer: question.canonicalAnswer };
}

// ── Round building ───────────────────────────────────────────────────────

export type PracticeStat = { right: number; wrong: number; lastAt: number };
export type StatLookup = (item: SavedWord) => PracticeStat;

const NO_STAT: PracticeStat = { right: 0, wrong: 0, lastAt: 0 };

/**
 * Weakest first (more misses than hits), then least recently practised.
 * Pure: the caller supplies the stat lookup, so this stays window-free.
 */
export function orderByWeakest(
  items: SavedWord[],
  statOf: StatLookup = () => NO_STAT
): SavedWord[] {
  return [...items].sort((a, b) => {
    const sa = statOf(a);
    const sb = statOf(b);
    const scoreA = sa.wrong - sa.right;
    const scoreB = sb.wrong - sb.right;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return sa.lastAt - sb.lastAt;
  });
}

export const ROUND_SIZE = 10;

/**
 * Build a full round: take the weakest items in scope, cap the round, shuffle
 * the order, and turn each into a question. Items that cannot be asked about
 * are dropped rather than shown broken.
 */
export function buildRound(
  items: SavedWord[],
  config: PracticeConfig,
  options: {
    pool?: SavedWord[];
    statOf?: StatLookup;
    size?: number;
    rand?: () => number;
  } = {}
): PracticeQuestion[] {
  const { pool = items, statOf, size = ROUND_SIZE, rand = Math.random } = options;
  const eligible = items.filter(isPractisable);
  const picked = shuffle(orderByWeakest(eligible, statOf).slice(0, size), rand);
  return picked
    .map((item) => buildQuestion(item, pool, config, rand))
    .filter((q): q is PracticeQuestion => q !== null);
}

// ── Stat keys ────────────────────────────────────────────────────────────

/**
 * Practice stats are kept per item *and direction*: spelling an English word
 * and recalling its Chinese meaning are different skills, and one should not
 * overwrite the other's history.
 *
 * The legacy key (the bare vocab key, written before directions existed) is
 * read as zh→en history — that is the only direction that existed — and is
 * never rewritten, so old data keeps counting without a migration.
 */
export function practiceStatKey(
  word: string,
  direction: PracticeDirection
): string {
  return `${vocabKey(word)}|${direction}`;
}

export function legacyStatKey(word: string): string {
  return vocabKey(word);
}
