"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Article, Sentence, WordEntry, WordSource } from "@/lib/types";
import { lookupWord } from "@/lib/mockData";
import { getDict, type Locale } from "@/lib/i18n";
import {
  ttsPause,
  ttsResume,
  ttsSpeakSequence,
  ttsStop,
  useTTSState,
} from "@/lib/tts";
import InfoPanel from "./InfoPanel";
import ArticleQuiz from "./ArticleQuiz";

type Selection =
  | { kind: "word"; entry: WordEntry; key: string }
  | { kind: "sentence"; sentence: Sentence; key: string }
  | null;

type Token = { type: "word"; text: string } | { type: "sep"; text: string };

function tokenize(sentence: string): Token[] {
  const out: Token[] = [];
  const regex = /([A-Za-z][A-Za-z'-]*)|([^A-Za-z]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(sentence)) !== null) {
    if (m[1]) out.push({ type: "word", text: m[1] });
    else if (m[2]) out.push({ type: "sep", text: m[2] });
  }
  return out;
}

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
  // by article title (other articles).
  const wordSource: WordSource = useMemo(
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

  const handleWord = (raw: string, sentenceId: string, idx: number) => {
    const entry = lookupWord(raw, locale);
    setSelection({
      kind: "word",
      entry,
      key: `w:${sentenceId}:${idx}:${raw}`,
    });
  };

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
              {t.level[article.level]} · {article.minutes} {t.article.minRead}
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
          <p className="mt-2 text-slate-600">{article.subtitle}</p>
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
                    selection?.kind === "word" &&
                    selection.key === `w:${sentence.id}:${i}:${tok.text}`;
                  return (
                    <span
                      key={i}
                      className={`word-token ${isActiveWord ? "is-active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWord(tok.text, sentence.id, i);
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
      />
    </div>
  );
}
