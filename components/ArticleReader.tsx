"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Article, Sentence, WordEntry, WordSource } from "@/lib/types";
import { lookupWord } from "@/lib/mockData";
import { lookupPhrase } from "@/lib/phrases";
import {
  neighbourWord,
  shrinkWordRange,
  spanText,
  tokenize,
} from "@/lib/tokens";
import { getDict, type Locale } from "@/lib/i18n";
import {
  ttsPause,
  ttsResume,
  ttsSpeakSequence,
  ttsStop,
  useTTSState,
} from "@/lib/tts";
import InfoPanel, { type PhraseControls } from "./InfoPanel";
import ArticleQuiz from "./ArticleQuiz";

// A vocabulary selection is a *range* of tokens inside one sentence. A tap
// selects the single word it landed on (anchor === start === end); the
// learner can then widen the range one word at a time to build a phrase.
// Nothing is ever widened automatically.
type WordSelection = {
  kind: "word";
  entry: WordEntry;
  key: string;
  sentenceIdx: number;
  anchor: number; // token index of the originally tapped word
  start: number; // first token in the selection (inclusive)
  end: number; // last token in the selection (inclusive)
};

type Selection =
  | WordSelection
  | { kind: "sentence"; sentence: Sentence; key: string }
  | null;

export default function ArticleReader({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const [selection, setSelection] = useState<Selection>(null);
  const [readingIndex, setReadingIndex] = useState<number | null>(null);
  const t = getDict(locale);
  const { supported, speaking, paused, sequenceId } = useTTSState();
  // Tracks the sequenceId of the article's own read-aloud, so we can tell
  // whether the speech currently playing belongs to us or was started by
  // something else (e.g. a word/sentence tap from InfoPanel).
  const ownSeqRef = useRef<number | null>(null);
  const isOurSpeech =
    ownSeqRef.current !== null && ownSeqRef.current === sequenceId;

  // Source metadata attached to any word saved while reading this article, so
  // the vocabulary notebook can group saved words by week (Weekly Stories) or
  // by article title (other articles). The sentence the learner saved from is
  // added per selection below, so practice can show the item in context.
  const articleSource: WordSource = useMemo(
    () => ({
      articleId: article.id,
      articleTitle: article.title,
      track: article.track,
      weekNumber: article.weekNumber,
      sourceLabel:
        article.track === "weekly-stories"
          ? `${t.home.weeklyHeading} · ${t.weekly.week(article.weekNumber ?? 0)}`
          : article.title,
    }),
    [article, t]
  );

  const tokenized = useMemo(
    () =>
      article.sentences.map((s) => ({
        sentence: s,
        tokens: tokenize(s.text),
      })),
    [article]
  );

  // Stop any speech when switching to a different article (or unmounting).
  useEffect(() => () => ttsStop(), [article.id]);

  // Clear the reading highlight when speech stops OR when another caller
  // takes over the TTS engine (e.g. a word tap mid-article).
  useEffect(() => {
    if (!speaking || !isOurSpeech) {
      setReadingIndex(null);
    }
  }, [speaking, isOurSpeech]);

  // While the full article is reading, the side panel follows the currently
  // spoken sentence so the learner can listen and read the translation at the
  // same time. A manual word/sentence tap takes over until the next sentence
  // boundary; when reading stops, the last sentence stays shown.
  const readingSentence =
    isOurSpeech && readingIndex != null
      ? (article.sentences[readingIndex] ?? null)
      : null;

  const prevReadingRef = useRef<number | null>(null);
  useEffect(() => {
    if (
      isOurSpeech &&
      readingIndex != null &&
      readingIndex !== prevReadingRef.current
    ) {
      setSelection(null); // auto-follow takes over at each new sentence
    }
    prevReadingRef.current = isOurSpeech ? readingIndex : null;
  }, [isOurSpeech, readingIndex]);

  const lastReadingRef = useRef<Sentence | null>(null);
  useEffect(() => {
    if (readingSentence) lastReadingRef.current = readingSentence;
  }, [readingSentence]);

  const wasReadingRef = useRef(false);
  useEffect(() => {
    const readingActive = isOurSpeech && speaking;
    if (wasReadingRef.current && !readingActive) {
      const last = lastReadingRef.current;
      if (last) {
        setSelection(
          (cur) =>
            cur ?? { kind: "sentence", sentence: last, key: `reading:${last.id}` }
        );
      }
    }
    wasReadingRef.current = readingActive;
  }, [isOurSpeech, speaking]);

  const effectiveSelection: Selection =
    selection ??
    (readingSentence
      ? {
          kind: "sentence",
          sentence: readingSentence,
          key: `reading:${readingSentence.id}`,
        }
      : null);

  // Build the selection for a token range: single words keep the existing
  // word-lookup path exactly as before; multi-word ranges go through phrase
  // lookup, which yields a first-class phrase entry the learner can save and
  // give their own meaning to.
  const selectRange = (
    sentenceIdx: number,
    anchor: number,
    start: number,
    end: number
  ) => {
    const { sentence, tokens } = tokenized[sentenceIdx];
    const text = spanText(tokens, start, end);
    if (!text) return;
    const entry =
      start === end ? lookupWord(text, locale) : lookupPhrase(text, locale);
    setSelection({
      kind: "word",
      entry,
      key: `w:${sentence.id}:${start}-${end}:${text}`,
      sentenceIdx,
      anchor,
      start,
      end,
    });
  };

  const handleWord = (sentenceIdx: number, idx: number) => {
    selectRange(sentenceIdx, idx, idx, idx);
  };

  // Learner-driven phrase boundary controls, handed to the info panel. Only
  // present while a word/phrase (not a sentence) is selected.
  const wordSelection: WordSelection | null =
    effectiveSelection?.kind === "word" &&
    "sentenceIdx" in effectiveSelection
      ? effectiveSelection
      : null;

  // The sentence behind the current selection, stored with anything saved from
  // it. Words and phrases both keep the whole sentence verbatim.
  const wordSource: WordSource = useMemo(() => {
    const sentence = wordSelection
      ? tokenized[wordSelection.sentenceIdx]?.sentence.text
      : undefined;
    return sentence ? { ...articleSource, sourceSentence: sentence } : articleSource;
  }, [articleSource, wordSelection, tokenized]);

  const phraseControls: PhraseControls | undefined = wordSelection
    ? (() => {
        const { tokens } = tokenized[wordSelection.sentenceIdx];
        const left = neighbourWord(tokens, wordSelection.start, -1);
        const right = neighbourWord(tokens, wordSelection.end, 1);
        const shrinkLeft = shrinkWordRange(
          tokens,
          wordSelection.start,
          wordSelection.end,
          "left"
        );
        const shrinkRight = shrinkWordRange(
          tokens,
          wordSelection.start,
          wordSelection.end,
          "right"
        );
        const sel = wordSelection;
        return {
          canExtendLeft: left !== null,
          canExtendRight: right !== null,
          canShrinkLeft: shrinkLeft !== null,
          canShrinkRight: shrinkRight !== null,
          canReset: sel.start !== sel.end,
          onExtendLeft: () =>
            left !== null &&
            selectRange(sel.sentenceIdx, sel.anchor, left, sel.end),
          onExtendRight: () =>
            right !== null &&
            selectRange(sel.sentenceIdx, sel.anchor, sel.start, right),
          onShrinkLeft: () =>
            shrinkLeft !== null &&
            selectRange(
              sel.sentenceIdx,
              sel.anchor,
              shrinkLeft.start,
              shrinkLeft.end
            ),
          onShrinkRight: () =>
            shrinkRight !== null &&
            selectRange(
              sel.sentenceIdx,
              sel.anchor,
              shrinkRight.start,
              shrinkRight.end
            ),
          onReset: () =>
            selectRange(sel.sentenceIdx, sel.anchor, sel.anchor, sel.anchor),
        };
      })()
    : undefined;

  const handleSentence = (sentence: Sentence) => {
    setSelection({
      kind: "sentence",
      sentence,
      key: `s:${sentence.id}`,
    });
  };

  const handlePrimary = () => {
    if (!speaking || !isOurSpeech) {
      const id = ttsSpeakSequence(
        article.sentences.map((s) => s.text),
        { onProgress: setReadingIndex }
      );
      ownSeqRef.current = id;
      return;
    }
    if (paused) {
      ttsResume();
    } else {
      ttsPause();
    }
  };

  const handleStop = () => {
    ttsStop();
    ownSeqRef.current = null;
  };

  const showActiveControls = supported && speaking && isOurSpeech;
  const primaryLabel = !showActiveControls
    ? t.article.readAloud
    : paused
      ? t.article.resume
      : t.article.pause;
  const primaryClass = !showActiveControls
    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
    : paused
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <header className="mb-5 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {article.level ? `${t.level[article.level]} · ` : ""}
              {article.minutes} {t.article.minRead}
            </div>
            {supported ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrimary}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${primaryClass}`}
                >
                  {primaryLabel}
                </button>
                {showActiveControls && (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100"
                    aria-label={t.article.stopReading}
                  >
                    {t.article.stopReading}
                  </button>
                )}
              </div>
            ) : (
              <p className="max-w-md rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                {t.article.ttsUnsupported}
              </p>
            )}
          </div>
          {article.track === "weekly-stories" && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700">
                {t.home.weeklyHeading} · {t.weekly.week(article.weekNumber ?? 0)}
              </span>
              {article.chineseTitle && (
                <span className="text-slate-500">{article.chineseTitle}</span>
              )}
            </div>
          )}
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="mt-2 text-slate-600">{article.subtitle}</p>
          )}
          {article.focus && (
            <p className="mt-1 text-sm text-slate-500">
              🎯 {article.focus[locale]}
            </p>
          )}
        </header>

        <div className="space-y-2 text-lg leading-relaxed text-slate-800">
          {tokenized.map(({ sentence, tokens }, sentenceIdx) => {
            const isActiveSentence =
              selection?.kind === "sentence" &&
              selection.sentence.id === sentence.id;
            const isReading = readingIndex === sentenceIdx;
            return (
              <p
                key={sentence.id}
                className={`sentence-row ${isActiveSentence ? "is-active" : ""} ${isReading ? "is-reading" : ""}`}
                onClick={() => handleSentence(sentence)}
              >
                {tokens.map((tok, i) => {
                  if (tok.type === "sep") {
                    return <span key={i}>{tok.text}</span>;
                  }
                  const isActiveWord =
                    wordSelection !== null &&
                    wordSelection.sentenceIdx === sentenceIdx &&
                    i >= wordSelection.start &&
                    i <= wordSelection.end;
                  return (
                    <span
                      key={i}
                      className={`word-token ${isActiveWord ? "is-active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWord(sentenceIdx, i);
                      }}
                    >
                      {tok.text}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-slate-400">{t.article.tip}</p>
      </article>

      <ArticleQuiz article={article} locale={locale} />
      </div>

      <InfoPanel
        selection={effectiveSelection}
        onClose={() => setSelection(null)}
        locale={locale}
        wordSource={wordSource}
        phraseControls={phraseControls}
      />
    </div>
  );
}
