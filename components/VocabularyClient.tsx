"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SavedWord } from "@/lib/types";
import { loadSavedWords, removeWord } from "@/lib/storage";
import { getDict, type Locale } from "@/lib/i18n";

export default function VocabularyClient({ locale }: { locale: Locale }) {
  const [words, setWords] = useState<SavedWord[] | null>(null);
  const t = getDict(locale);

  useEffect(() => {
    const sync = () => setWords(loadSavedWords());
    sync();
    window.addEventListener("savedWords:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("savedWords:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const speak = (word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  if (words === null) {
    return <p className="text-slate-500">{t.vocabulary.loading}</p>;
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {t.vocabulary.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {t.vocabulary.subtitle(words.length)}
          </p>
        </div>
      </header>

      {words.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-700">{t.vocabulary.empty}</p>
          <p className="mt-1 text-sm text-slate-500">{t.vocabulary.emptyHint}</p>
          <Link
            href={`/${locale}`}
            className="mt-4 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t.vocabulary.browse}
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {words.map((w) => (
            <li
              key={w.word + w.savedAt}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h2 className="truncate text-lg font-semibold text-slate-900">
                      {w.word}
                    </h2>
                    <span className="text-xs italic text-slate-500">
                      {w.partOfSpeech}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {w.pronunciation}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speak(w.word)}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                    aria-label="Play"
                  >
                    🔊
                  </button>
                  <button
                    type="button"
                    onClick={() => removeWord(w.word)}
                    className="rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    {t.vocabulary.remove}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700">{w.definition}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {w.translation}
              </p>
              <p className="mt-2 text-xs italic text-slate-500">
                "{w.example}"
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
