"use client";

import { useEffect, useState } from "react";
import type { Sentence, WordEntry } from "@/lib/types";
import { isSaved, removeWord, saveWord } from "@/lib/storage";
import { getDict, type Locale } from "@/lib/i18n";
import { ttsSpeak, useTTSState } from "@/lib/tts";

type Selection =
  | { kind: "word"; entry: WordEntry }
  | { kind: "sentence"; sentence: Sentence }
  | null;

export default function InfoPanel({
  selection,
  onClose,
  locale,
}: {
  selection: Selection;
  onClose: () => void;
  locale: Locale;
}) {
  const [saved, setSaved] = useState(false);
  const t = getDict(locale);

  useEffect(() => {
    if (selection?.kind === "word") {
      setSaved(isSaved(selection.entry.word));
    }
  }, [selection]);

  if (!selection) {
    return (
      <aside className="hidden h-fit rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 lg:block">
        <p className="font-medium text-slate-700">{t.panel.nothingSelected}</p>
        <p className="mt-2 leading-relaxed">{t.panel.nothingSelectedHint}</p>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {selection.kind === "word" ? t.panel.word : t.panel.sentence}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label={t.panel.close}
        >
          ✕
        </button>
      </div>

      {selection.kind === "word" ? (
        <WordView
          entry={selection.entry}
          saved={saved}
          locale={locale}
          onToggleSave={() => {
            if (saved) {
              removeWord(selection.entry.word);
              setSaved(false);
            } else {
              saveWord(selection.entry);
              setSaved(true);
            }
          }}
        />
      ) : (
        <SentenceView sentence={selection.sentence} locale={locale} />
      )}
    </aside>
  );
}

function WordView({
  entry,
  saved,
  locale,
  onToggleSave,
}: {
  entry: WordEntry;
  saved: boolean;
  locale: Locale;
  onToggleSave: () => void;
}) {
  const t = getDict(locale);
  const { supported } = useTTSState();
  const speak = () => ttsSpeak(entry.word);

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900">{entry.word}</h3>
        <span className="text-sm italic text-slate-500">
          {entry.partOfSpeech}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm text-slate-600">{entry.pronunciation}</span>
        {supported && (
          <button
            type="button"
            onClick={speak}
            className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
            aria-label={t.panel.play}
          >
            {t.panel.play}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <Field label={t.panel.definition} body={entry.definition} />
        <Field label={t.panel.chinese} body={entry.translation} />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.panel.example}
          </div>
          <p className="mt-1 italic text-slate-800">"{entry.example}"</p>
          <p className="mt-1 text-slate-600">{entry.exampleTranslation}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleSave}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          saved
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-brand-600 text-white hover:bg-brand-700"
        }`}
      >
        {saved ? t.panel.saved : t.panel.save}
      </button>
    </div>
  );
}

function SentenceView({
  sentence,
  locale,
}: {
  sentence: Sentence;
  locale: Locale;
}) {
  const t = getDict(locale);
  const { supported } = useTTSState();
  const speak = () => ttsSpeak(sentence.text);
  return (
    <div>
      <p className="text-base leading-relaxed text-slate-900">{sentence.text}</p>
      {supported && (
        <button
          type="button"
          onClick={speak}
          className="mt-3 inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          aria-label={t.panel.playSentence}
        >
          {t.panel.playSentence}
        </button>
      )}
      <div className="mt-4 space-y-3 text-sm">
        <Field label={t.panel.chineseTranslation} body={sentence.translation} />
        <Field label={t.panel.grammar} body={sentence.grammar} />
      </div>
    </div>
  );
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <p className="mt-1 leading-relaxed text-slate-800">{body}</p>
    </div>
  );
}
