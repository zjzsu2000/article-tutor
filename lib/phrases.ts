import { findWordEntry } from "./mockData";
import { getDict, defaultLocale, type Locale } from "./i18n";
import { isPhraseText } from "./vocab";
import type { WordEntry } from "./types";

// Phrase lookup for multi-word vocabulary items ("look after", "in the end").
//
// There is no phrase dictionary yet, and deliberately no parallel phrase
// store: a phrase produces an ordinary `WordEntry` with `isPhrase: true`, so
// it saves, groups, and drills exactly like a single word. What we *can* do
// without a dictionary is gloss the phrase word by word, which gives the
// learner a starting point before they write their own meaning.

export type PhrasePart = { word: string; translation: string | null };

// The known-word glosses for a phrase, in order. Words the dictionaries do
// not cover come back with `translation: null` rather than being dropped, so
// the panel can still show the phrase's full shape.
export function glossParts(phrase: string): PhrasePart[] {
  return phrase
    .split(/\s+/)
    .filter((w) => w.replace(/[^A-Za-z']/g, "").length > 0)
    .map((w) => {
      const hit = findWordEntry(w);
      return {
        word: w,
        translation: hit ? hit.translation : null,
      };
    });
}

/**
 * Look up a selected span of text.
 *
 * Single words go straight to the existing word lookup path (unchanged
 * behaviour). Multi-word spans become a phrase entry: no dictionary meaning
 * yet (`unknown: true`), which is exactly the case the learner's own meaning
 * is for — the info panel invites them to write one, and dictation waits
 * until they have.
 */
export function lookupPhrase(
  raw: string,
  locale: Locale = defaultLocale
): WordEntry {
  const text = raw.trim().replace(/\s+/g, " ");
  const t = getDict(locale);
  if (!isPhraseText(text)) {
    // Not actually a phrase — keep one code path for single words.
    const hit = findWordEntry(text);
    return (
      hit ?? {
        word: text,
        translation: t.panel.notInDict,
        unknown: true,
        kind: "word",
      }
    );
  }
  return {
    word: text,
    translation: t.panel.phraseNoEntry,
    unknown: true,
    kind: "phrase",
  };
}
