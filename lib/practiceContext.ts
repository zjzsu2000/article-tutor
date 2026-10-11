import { getArticle, lookupWord } from "./mockData";
import { findEncounter } from "./practice";
import { tokenize } from "./tokens";
import { getUserArticle, toArticle } from "./userArticles";
import type { SavedWord } from "./types";

/**
 * Fill in reading context for saved words that predate it.
 *
 * Two fields arrived at different times, so three data shapes exist in real
 * notebooks and each needs different work:
 *
 * 1. Both fields present — nothing to do.
 * 2. `sourceSentence` but no `encounteredText` — what the currently deployed
 *    build writes. The sentence is authoritative, so the met form is
 *    recovered *from that sentence*: "I have admired this group" tells us an
 *    `admire` entry was met as `admired`. Without this, the question asks for
 *    the lemma and the sentence cannot be masked, so the learner loses both
 *    the tense practice and the context.
 * 3. Neither — everything saved before this feature. The item still knows its
 *    article, so both the sentence and the form are recovered from it.
 *
 * Deliberately read-time only: nothing is written back to localStorage, so
 * there is no migration to get wrong, and an item whose article has since
 * changed simply stops resolving instead of carrying a stale sentence.
 */
export function withReadingContext(item: SavedWord): SavedWord {
  if (item.encounteredText?.trim()) return item; // shape 1

  const sentence = item.sourceSentence?.trim();
  if (sentence) {
    // Shape 2. Only the saved sentence is consulted: it is where the learner
    // actually met the word, so another sentence from the same article would
    // be a different encounter. A sentence the item cannot be found in yields
    // nothing, and the question falls back to the lemma with its context
    // withheld — the safe outcome, not a guess.
    const found = findEncounter([sentence], item.word, resolveLemma, tokenize);
    return found ? { ...item, encounteredText: found.encountered } : item;
  }

  // Shape 3.
  if (!item.articleId) return item;
  const sentences = articleSentences(item.articleId);
  if (sentences.length === 0) return item;
  const found = findEncounter(sentences, item.word, resolveLemma, tokenize);
  if (!found) return item;
  return {
    ...item,
    sourceSentence: found.sentence,
    encounteredText: found.encountered,
  };
}

// What a token in an article normalizes to, or undefined when the dictionary
// does not cover it. This is the same resolution the reader uses, so a token
// is recognised exactly when tapping it would have produced this entry.
function resolveLemma(token: string): string | undefined {
  const entry = lookupWord(token);
  return entry.unknown ? undefined : entry.word;
}

function articleSentences(articleId: string): string[] {
  const curated = getArticle(articleId);
  if (curated) return curated.sentences.map((s) => s.text);
  // Learner-added articles live in localStorage and are adapted on read.
  const own = getUserArticle(articleId);
  return own ? toArticle(own).sentences.map((s) => s.text) : [];
}
