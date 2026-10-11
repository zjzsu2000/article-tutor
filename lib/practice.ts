import type { SavedWord } from "./types";
import {
  canonicalMeaning,
  chineseAnswerMatches,
  chineseGlosses,
  hasDistinctEncountered,
  meaningSource,
  normalizeAnswer,
  normalizeChineseAnswer,
  encounteredForm,
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

// Saved data is whatever is in the browser's localStorage, which may predate
// any given field or have been hand-edited. Every read of an item's text goes
// through here, so a number or an object can never reach `.trim()`.
function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

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
  // The form the learner met, when it differs from the item's word. In zh→en
  // this *is* the expected answer whenever the question has context, so the
  // panel only shows it once the question is settled; in en→zh it is dropped
  // if it would carry the Chinese answer.
  metAs?: string;
  // The item's part of speech, screened the same way. Raw item metadata is
  // never rendered: adversarial or malformed saved data would otherwise walk
  // straight past every other safeguard.
  partOfSpeech?: string;
  // The mode actually used: a question falls back to "typed" when there are
  // not enough distractors to build an honest multiple choice.
  answerMode: PracticeAnswerMode;
  prompt: string; // Chinese meaning (zh→en) or the English item (en→zh)
  canonicalAnswer: string; // what is shown as *the* answer
  acceptedAnswers: string[]; // everything a typed answer may match
  choices?: string[]; // present only for multiple-choice
  // The learner's own wording, when the dictionary owns the canonical answer.
  // Shown beside the Chinese prompt as their note — it is not *the* canonical
  // answer, though typing it is accepted (see `acceptedAnswers`). Not exposed
  // at all in en→zh, where it is one of the answers.
  learnerNote?: string;
  sourceSentence?: string; // the saved sentence, verbatim
  maskedSentence?: string; // the context shown before any hint is used
  contextMasked: boolean; // false when the target could not be located
  // True when a sentence exists but showing it would reveal the answer, so it
  // is held back until the answer is known.
  contextWithheld: boolean;
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

// Full-width Latin letters and digits are visually the same answer on many
// Chinese keyboards. Fold them before matching so `ｃａｐｔａｉｎ` cannot sit in a
// prompt while `captain` is the accepted answer. Every replacement is one
// UTF-16 code unit, so match offsets still map back to the original text.
function foldFullWidthLatin(text: string): string {
  return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
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
/**
 * The pattern that finds `target` the way grading would accept it.
 *
 * `normalizeAnswer` folds curly apostrophes to straight ones and turns most
 * punctuation into a separator, so "don’t" answers "don't" and
 * "look/forward/to" answers "look forward to". Masking and leak detection
 * must recognise at least those spellings, or the answer stays readable in a
 * prompt while still being graded correct.
 *
 * This is deliberately a little *wider* than grading — it also treats a
 * hyphen as a separator, which `normalizeAnswer` keeps — because erring
 * towards over-hiding cannot expose an answer, while erring the other way
 * can. See the hyphen/space note in the review package.
 *
 * Returns null when the target has no letters or digits to anchor on.
 */
function targetPattern(target: string): string | null {
  const parts = foldFullWidthLatin(target)
    .split(/[^A-Za-z0-9'‘’]+/)
    .filter(Boolean);
  if (parts.length === 0) return null;
  const body = parts
    .map((part) => escape(part).replace(/['‘’]/g, "['‘’]"))
    .join("[^A-Za-z0-9]+");
  return body;
}

export function maskTarget(
  sentence: string,
  target: string
): { text: string; masked: boolean } {
  const clean = target.trim();
  if (!sentence || !clean) return { text: sentence, masked: false };

  const body = targetPattern(clean);
  if (!body) return { text: sentence, masked: false };

  // A letter/digit on either side means we are inside a bigger word. The
  // apostrophe guard keeps "book" from matching the "book" in "book's".
  const re = new RegExp(`(^|[^A-Za-z0-9'‘’])(${body})(?![A-Za-z0-9'‘’])`, "gi");

  const folded = foldFullWidthLatin(sentence);
  let masked = false;
  let cursor = 0;
  let text = "";
  for (let match = re.exec(folded); match; match = re.exec(folded)) {
    const start = match.index + match[1].length;
    const end = start + match[2].length;
    text += sentence.slice(cursor, start) + MASK;
    cursor = end;
    masked = true;
  }
  if (masked) text += sentence.slice(cursor);
  return masked ? { text, masked: true } : { text: sentence, masked: false };
}

/**
 * Mask every given form of the target. A learner who tapped "admired" has an
 * item headed "admire": both forms must be hidden, or the context would spell
 * out the very answer the question is asking for.
 */
export function maskAll(
  sentence: string,
  targets: string[]
): { text: string; masked: boolean } {
  let text = sentence;
  let masked = false;
  // Longest first, so "look forward to" is masked before "look".
  for (const target of [...new Set(targets)].sort((a, b) => b.length - a.length)) {
    const result = maskTarget(text, target);
    text = result.text;
    masked = masked || result.masked;
  }
  return { text, masked };
}

/**
 * Does `sentence` still contain `target` as a whole word or phrase? Uses the
 * same boundary rules as masking, so "booked" does not count as "book".
 */
/**
 * The text `sentence` actually contains for `target`, or null.
 *
 * Matching is punctuation- and case-flexible (grading is), so the spelling in
 * the sentence can differ from the lemma: "look forward to" is found inside
 * "look-forward-to". Recovery must keep what the sentence really said —
 * returning the lemma instead would make the question expect a form the
 * learner never saw, and mark the one they did see wrong.
 */
export function findWordMatch(sentence: string, target: string): string | null {
  const clean = target.trim();
  if (!sentence || !clean) return null;
  const body = targetPattern(clean);
  if (!body) return null;
  const re = new RegExp(`(^|[^A-Za-z0-9'‘’])(${body})(?![A-Za-z0-9'‘’])`, "i");
  const match = re.exec(foldFullWidthLatin(sentence));
  if (!match) return null;
  const start = match.index + match[1].length;
  return sentence.slice(start, start + match[2].length);
}

export function containsWord(sentence: string, target: string): boolean {
  const clean = target.trim();
  if (!sentence || !clean) return false;
  const body = targetPattern(clean);
  if (!body) return false;
  const re = new RegExp(`(^|[^A-Za-z0-9'‘’])(${body})(?![A-Za-z0-9'‘’])`, "i");
  return re.test(foldFullWidthLatin(sentence));
}

// Bracket *characters* only — their contents stay. A leak often hides inside
// brackets ("The captain（船长）stood."), which `normalizeChineseAnswer` would
// delete wholesale.
function stripBracketChars(text: string): string {
  return text.replace(/[（）()【】\[\]「」『』〔〕〈〉《》]/g, "");
}

/**
 * Normalize text for *leak detection* on the Chinese side.
 *
 * Both sides of the comparison must reduce text the way **grading** does, or
 * the check is stricter than the grader and the answer stays readable while
 * still scoring. So this is `normalizeChineseAnswer` — the grader's own
 * function — applied after flattening bracket characters.
 */
export function leakNormalize(text: string): string {
  return normalizeChineseAnswer(stripBracketChars(text));
}

// Brackets are read two ways by the grader: `normalizeChineseAnswer` drops a
// parenthetical entirely ("男警察（复数 policemen）" is answered by 男警察),
// while a learner may equally type the bracketed spelling ("船[长]"). Both
// readings are checked, so neither can slip past.
function leakForms(text: string): string[] {
  const forms = [normalizeChineseAnswer(text), leakNormalize(text)];
  return [...new Set(forms.filter((f) => f.length > 0))];
}

/**
 * Would showing `text` hand the learner one of the answers it will be graded
 * against? Substring-based, because Chinese has no word boundaries to anchor.
 */
export function revealsChineseAnswer(
  text: string,
  accepted: string[]
): boolean {
  const haystacks = leakForms(text);
  if (haystacks.length === 0) return false;
  return accepted.some((answer) =>
    leakForms(answer).some((needle) =>
      haystacks.some((haystack) => haystack.includes(needle))
    )
  );
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

/**
 * Find where a saved item appears in an article, for items saved before the
 * sentence and encountered form were recorded.
 *
 * Tries the literal item first; failing that, asks `resolveLemma` what each
 * word in the sentence normalizes to, which is how "admired" is recognised as
 * the encounter behind an "admire" entry. Returns null when the article does
 * not contain the item at all, so nothing is invented.
 *
 * Pure: the caller supplies the sentences and the lemma resolver.
 */
export function findEncounter(
  sentences: string[],
  lemma: string,
  resolveLemma: (token: string) => string | undefined,
  tokenizeSentence: (sentence: string) => { type: string; text: string }[]
): { sentence: string; encountered: string } | null {
  const target = lemma.trim();
  if (!target) return null;
  const key = vocabKey(target);

  // A literal appearance is the best evidence, and the only option for
  // phrases. The *matched text* is returned, not the lemma: the sentence may
  // spell it differently ("look-forward-to") and that is what the learner met.
  for (const sentence of sentences) {
    const match = findWordMatch(sentence, target);
    if (match) return { sentence, encountered: match };
  }
  if (/\s/.test(target)) return null; // phrases are not inflected token-wise

  for (const sentence of sentences) {
    for (const token of tokenizeSentence(sentence)) {
      if (token.type !== "word") continue;
      const resolved = resolveLemma(token.text);
      if (resolved && vocabKey(resolved) === key) {
        return { sentence, encountered: token.text };
      }
    }
  }
  return null;
}

// ── Eligibility ──────────────────────────────────────────────────────────

/**
 * The English answer a question should expect.
 *
 * A question built on a saved sentence is asking about *that* sentence, so it
 * expects the form the learner met there: the context "I have ______ this
 * group for years" wants `admired`, not the lemma `admire`. Accepting both
 * would throw away exactly the tense/number practice the context provides.
 *
 * Items with no context — legacy entries, or anything saved before the
 * encountered form was kept — fall back to the dictionary lemma, which is all
 * we know about them.
 *
 * The one rule, in one place, so no React code re-derives it.
 */
export function practiceEnglishAnswer(item: SavedWord): string {
  const context = str(item.sourceSentence).trim();
  const met = str(item.encounteredText).trim();
  if (context && met) return met;
  return str(item.word).trim();
}

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
  return direction === "zh-to-en"
    ? practiceEnglishAnswer(item)
    : canonicalMeaning(item);
}

function normalizeFor(direction: PracticeDirection, text: string): string {
  return direction === "zh-to-en"
    ? normalizeAnswer(text)
    : normalizeChineseAnswer(text);
}

/**
 * The readable pieces of everything on screen while the question is open.
 *
 * Comparing an option against a whole visible string is not enough: a prompt
 * of "队长 leader 或 chief" contains "leader" as one segment among several,
 * and an option of exactly "leader" is then defensible while being marked
 * wrong. Each script is split out and compared with its own rule — English by
 * whole word (so "art" never rejects "party"), Chinese by containment (it has
 * no word boundaries).
 */
export function visibleSegments(surfaces: (string | undefined)[]): {
  english: string[];
  chinese: string[];
} {
  const english = new Set<string>();
  const chinese = new Set<string>();
  for (const surface of surfaces) {
    if (!surface) continue;
    // Fold the complete surface first. Folding runs separately would split a
    // mixed-width spelling (`leadｅｒ`) into `lead` + `er`, letting the visually
    // identical `leader` option survive the echo guard.
    const folded = foldFullWidthLatin(surface);
    for (const run of folded.match(/[A-Za-z0-9'‘’-]+/g) ?? []) {
      const token = run.replace(/^[-'‘’]+|[-'‘’]+$/g, "");
      if (token.length > 0) english.add(token);
    }
    for (const run of folded.match(/[\u4e00-\u9fff]+/g) ?? []) chinese.add(run);
  }
  return { english: [...english], chinese: [...chinese] };
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
  // Both the lemma and the form this item is actually answered with, so
  // options built on either cannot collide.
  for (const form of [item.word, practiceEnglishAnswer(item)]) {
    const key = normalizeAnswer(form);
    if (key && !keys.includes(`en:${key}`)) keys.push(`en:${key}`);
  }

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
  rand: () => number = Math.random,
  guard: {
    acceptedAnswers?: string[];
    englishForms?: string[];
    /** Everything the learner can read while the question is open. */
    surfaces?: (string | undefined)[];
  } = {}
): string[] | null {
  if (!correct.trim()) return null;
  const accepted = guard.acceptedAnswers ?? [];
  const englishForms = (guard.englishForms ?? []).filter(Boolean);

  // An option that *contains* the answer is as bad as one that equals it:
  // "老船长" beside the answer "船长" is defensible. An option that repeats
  // something already on screen is worse — the learner is looking straight at
  // it, so choosing it is defensible while being marked wrong. That includes
  // a Chinese option quoting the English prompt ("判断力；理智（common sense
  // 常识）" under "sense"), an English option equal to a learner-written
  // meaning ("leader"), and either of those buried in a mixed-script prompt
  // or in the learner's visible note.
  // Only what is actually on screen. The answer's own forms are deliberately
  // NOT included: in en→zh they are the prompt (and so already a surface),
  // while in zh→en the answer belongs in the correct option — treating it as
  // an echo there would reject every question.
  const visible = visibleSegments(guard.surfaces ?? []);
  const echoesVisible = (text: string) => {
    const normalizedText = foldFullWidthLatin(text);
    const option = visibleSegments([text]);
    return (
      visible.english.some((token) => containsWord(normalizedText, token)) ||
      visible.chinese.some((shown) =>
        option.chinese.some(
          (candidate) => candidate.includes(shown) || shown.includes(candidate)
        )
      )
    );
  };
  const echoesPrompt = echoesVisible;
  if (echoesPrompt(correct)) return null; // the key would give itself away

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
    // Visible containment, not just key equality.
    if (direction === "en-to-zh" && revealsChineseAnswer(text, accepted)) continue;
    if (direction === "zh-to-en" && englishForms.some((f) => containsWord(text, f))) continue;
    if (echoesPrompt(text)) continue;
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
  const target = str(item.word).trim();
  if (!target) return null;

  const zhToEn = config.direction === "zh-to-en";
  const englishAnswer = practiceEnglishAnswer(item);
  const met = encounteredForm(item);
  const prompt = zhToEn ? meaning : englishAnswer;
  const canonicalAnswer = zhToEn ? englishAnswer : meaning;

  // Chinese → English expects exactly one English form: the one this question
  // is built on (see `practiceEnglishAnswer`). The lemma is deliberately not
  // a second accepted answer when the context asks for an inflected form.
  //
  // Chinese answers accept the canonical meaning, each of its glosses, and —
  // when the dictionary owns the canonical answer — the learner's own wording
  // as well. Accepting their note is not the same as replacing the canonical
  // answer with it.
  const acceptedAnswers = zhToEn
    ? [englishAnswer]
    : [
        ...chineseGlosses(meaning),
        ...(meaningSource(item) === "dictionary"
          ? chineseGlosses(item.userTranslation?.trim() ?? "")
          : []),
      ];

  // A Chinese gloss can spell out the English answer — 31 of this app's
  // dictionary entries carry forms inside the gloss ("男警察（复数
  // policemen）"). In zh→en that prints the answer in the question, so every
  // English form is masked out of the prompt and out of the learner's note.
  const englishForms = [englishAnswer, target, met];
  const maskedPrompt = zhToEn ? maskAll(prompt, englishForms).text : prompt;
  const rawNote =
    meaningSource(item) === "dictionary"
      ? str(item.userTranslation).trim() || undefined
      : undefined;
  // In en→zh the learner's note is itself an accepted Chinese answer, so it is
  // not exposed at all there; in zh→en it is shown with English forms masked.
  const learnerNote = !rawNote
    ? undefined
    : zhToEn
      ? maskAll(rawNote, englishForms).text
      : undefined;
  // A prompt has to survive masking with something to think about, and a
  // typed question has to have at least one answer that grading can match.
  // Otherwise the item is dropped for this direction (it usually still works
  // in the other one) rather than shown as an unanswerable question.
  if (!/[A-Za-z\u4e00-\u9fff]/.test(maskedPrompt)) return null;
  const answerable = zhToEn
    ? normalizeAnswer(englishAnswer).length > 0
    : acceptedAnswers.some((a) => normalizeChineseAnswer(a).length > 0);
  if (!answerable) return null;
  // English → Chinese shows the item itself, which a bilingual selection can
  // carry a Chinese gloss into ("captain（船长）stood"), and a junk all-English
  // meaning makes the prompt its own answer. Either way, do not ask it here.
  if (!zhToEn && revealsChineseAnswer(prompt, acceptedAnswers)) return null;

  const sourceSentence = str(item.sourceSentence).trim() || undefined;
  // The context is only masked in zh→en, where the English target *is* the
  // answer. In en→zh the English is already on screen, so the sentence is
  // shown as-is and simply helps with polysemous words.
  //
  // Masking hides the encountered form *and* the lemma, then the result is
  // checked: if the answer is still readable, the context is withheld rather
  // than handed to the learner. A sentence that cannot be masked safely is
  // not a usable question context.
  const maskResult =
    sourceSentence && zhToEn
      ? maskAll(sourceSentence, [englishAnswer, target, met])
      : { text: sourceSentence ?? "", masked: false };
  // In zh→en the sentence is where the answer lives, so it is shown only when
  // masking actually happened *and* the answer is no longer readable. A
  // sentence we could not mask is withheld rather than guessed at.
  // zh→en: the sentence is where the English answer lives, so it is shown
  // only when masking worked and the answer is no longer readable.
  // en→zh: the sentence is shown unmasked to disambiguate — but a learner's
  // own article may be bilingual ("The captain（船长）stood by the door."), so
  // it is checked against *every* accepted Chinese answer first.
  const contextWithheld = zhToEn
    ? Boolean(sourceSentence) &&
      (!maskResult.masked || containsWord(maskResult.text, canonicalAnswer))
    : Boolean(sourceSentence) &&
      revealsChineseAnswer(sourceSentence ?? "", acceptedAnswers);

  const screenIncidental = (text: unknown): string | undefined => {
    const value = str(text).trim();
    if (!value) return undefined;
    if (englishForms.some((form) => form && containsWord(value, form))) {
      return undefined;
    }
    if (revealsChineseAnswer(value, acceptedAnswers)) return undefined;
    return value;
  };
  const screenMetAs = (text: string): string | undefined => {
    if (!zhToEn && revealsChineseAnswer(text, acceptedAnswers)) return undefined;
    return text;
  };
  const visiblePartOfSpeech = screenIncidental(item.partOfSpeech);
  const visibleMetAs = hasDistinctEncountered(item)
    ? screenMetAs(met)
    : undefined;
  const visibleContext = sourceSentence && !contextWithheld
    ? zhToEn ? maskResult.text : sourceSentence
    : undefined;

  let answerMode = config.answerMode;
  let choices: string[] | undefined;
  if (answerMode === "multiple-choice") {
    const built = buildChoices(canonicalAnswer, pool, item, config.direction, rand, {
      acceptedAnswers,
      englishForms,
      // Both surfaces the learner reads while the question is open.
      surfaces: [
        maskedPrompt,
        learnerNote,
        visiblePartOfSpeech,
        // zh→en reveals the met form only after answering; en→zh may show it
        // before answering, so include it in the echo guard there.
        !zhToEn ? visibleMetAs : undefined,
        visibleContext,
      ],
    });
    if (built) choices = built;
    else answerMode = "typed"; // not enough honest distractors
  }

  // Hint ladder. zh→en climbs from a nudge to the answer to the full
  // sentence; en→zh has its context on screen from the start (it cannot leak
  // the Chinese answer), so the only thing left to reveal is the meaning.
  // The full-sentence rung exists whenever something is being held back —
  // masked or withheld, in either direction. The strict ladder only reaches
  // it once the answer is already known, so it cannot leak.
  const contextRung = Boolean(sourceSentence) && (contextWithheld || maskResult.masked);
  // A one-letter answer's "first letters" hint is the whole answer, and this
  // rung does not settle the question — so it is only offered when it really
  // hides something.
  const lettersHelp =
    zhToEn && answerMode === "typed" && letterHint(englishAnswer) !== englishAnswer;
  const hints: HintKind[] = [
    ...(lettersHelp ? (["letters"] as HintKind[]) : []),
    "answer" as HintKind,
    ...(contextRung ? (["unmasked-context"] as HintKind[]) : []),
  ];

  return {
    item,
    direction: config.direction,
    metAs: visibleMetAs,
    partOfSpeech: visiblePartOfSpeech,
    answerMode,
    prompt: maskedPrompt,
    canonicalAnswer,
    acceptedAnswers,
    choices,
    learnerNote,
    sourceSentence,
    // Only ever the safe form: withheld when the answer survived masking.
    maskedSentence:
      sourceSentence && !contextWithheld ? maskResult.text : undefined,
    contextMasked: maskResult.masked && !contextWithheld,
    contextWithheld,
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
          question.acceptedAnswers.some(
            (accepted) => normalizeAnswer(accepted) === normalizeAnswer(answer)
          )
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
  // Questions are built before the round is capped, so an item rejected for
  // this direction (an unusable prompt, a prompt that would leak) is replaced
  // by the next candidate instead of silently shortening the round.
  // Weakness order decides *which* items are asked about; the shuffle only
  // decides the order they appear in. Building before capping means an item
  // rejected for this direction is replaced by the next-weakest one instead
  // of shortening the round.
  const questions: PracticeQuestion[] = [];
  for (const item of orderByWeakest(eligible, statOf)) {
    if (questions.length >= size) break;
    const question = buildQuestion(item, pool, config, rand);
    if (question) questions.push(question);
  }
  return shuffle(questions, rand);
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
