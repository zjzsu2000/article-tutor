"use client";

import { useEffect, useMemo, useState } from "react";
import type { Article, Sentence, WordEntry } from "@/lib/types";
import { lookupWord } from "@/lib/mockData";
import { getDict, type Locale } from "@/lib/i18n";
import { ttsSpeakSequence, ttsStop, useTTSState } from "@/lib/tts";
import InfoPanel from "./InfoPanel";

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
  const { supported, speaking } = useTTSState();

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

  // Clear the reading highlight whenever speech actually stops.
  useEffect(() => {
    if (!speaking) setReadingIndex(null);
  }, [speaking]);

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

  const handleReadAloud = () => {
    if (speaking) {
      ttsStop();
      return;
    }
    ttsSpeakSequence(
      article.sentences.map((s) => s.text),
      { onProgress: setReadingIndex }
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <header className="mb-5 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {t.level[article.level]} · {article.minutes} {t.article.minRead}
            </div>
            {supported && (
              <button
                type="button"
                onClick={handleReadAloud}
                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  speaking
                    ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {speaking ? t.article.stopReading : t.article.readAloud}
              </button>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {article.title}
          </h1>
          <p className="mt-2 text-slate-600">{article.subtitle}</p>
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

      <InfoPanel
        selection={selection}
        onClose={() => setSelection(null)}
        locale={locale}
      />
    </div>
  );
}
