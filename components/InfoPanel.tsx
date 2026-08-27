"use client";

import { useEffect, useState } from "react";
import type { Sentence, WordEntry, WordSource } from "@/lib/types";
import {
  findSavedWord,
  removeWord,
  saveWord,
  updateWordMeaning,
} from "@/lib/storage";
import { hasDictionaryMeaning, isPhrase } from "@/lib/vocab";
import { glossParts } from "@/lib/phrases";
import { getDict, type Locale } from "@/lib/i18n";
import { ttsSpeak, useTTSState } from "@/lib/tts";
import MeaningEditor from "./MeaningEditor";

type Selection =
  | { kind: "word"; entry: WordEntry }
  | { kind: "sentence"; sentence: Sentence }
  | null;

// Controls for growing or shrinking a phrase selection in the reader. The
// learner always drives the boundary — nothing is auto-detected — so the
// panel just reports which moves are currently possible.
export type PhraseControls = {
  canExtendLeft: boolean;
  canExtendRight: boolean;
  canShrinkLeft: boolean;
  canShrinkRight: boolean;
  canReset: boolean;
  onExtendLeft: () => void;
  onExtendRight: () => void;
  onShrinkLeft: () => void;
  onShrinkRight: () => void;
  onReset: () => void;
};

export default function InfoPanel({
  selection,
  onClose,
  locale,
  wordSource,
  phraseControls,
}: {
  selection: Selection;
  onClose: () => void;
  locale: Locale;
  // Where words saved from this panel came from, recorded so the vocabulary
  // notebook can group them by week/article. Optional for safety.
  wordSource?: WordSource;
  // Present only when the selection came from tapping a word in an article.
  phraseControls?: PhraseControls;
}) {
  const [saved, setSaved] = useState(false);
  const [userTranslation, setUserTranslation] = useState<string | undefined>();
  const t = getDict(locale);
  const { supported: ttsSupported } = useTTSState();

  // Re-read this item's saved state (and the learner's own meaning) whenever
  // the selection changes.
  useEffect(() => {
    if (selection?.kind === "word") {
      const stored = findSavedWord(selection.entry.word);
      setSaved(stored !== undefined);
      setUserTranslation(stored?.userTranslation);
    }
  }, [selection]);

  if (!selection) {
    return (
      <aside className="hidden h-fit rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <p className="font-medium text-slate-700">{t.panel.nothingSelected}</p>
        <p className="mt-2 leading-relaxed">{t.panel.nothingSelectedHint}</p>
      </aside>
    );
  }

  const phraseSelected =
    selection.kind === "word" && isPhrase(selection.entry);

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {selection.kind !== "word"
            ? t.panel.sentence
            : phraseSelected
              ? t.panel.phrase
              : t.panel.word}
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
          userTranslation={userTranslation}
          locale={locale}
          ttsSupported={ttsSupported}
          phraseControls={phraseControls}
          onToggleSave={() => {
            if (saved) {
              removeWord(selection.entry.word);
              setSaved(false);
              setUserTranslation(undefined);
            } else {
              saveWord(selection.entry, wordSource);
              setSaved(true);
            }
          }}
          onSaveMeaning={(text) => {
            // Writing a meaning is itself a decision to collect the item, so
            // an unsaved word or phrase is added first. This is what makes a
            // phrase with no dictionary entry fully usable: the learner's own
            // meaning is enough for the notebook and for dictation.
            if (!saved) {
              saveWord(selection.entry, wordSource);
              setSaved(true);
            }
            updateWordMeaning(selection.entry.word, text);
            setUserTranslation(text.length > 0 ? text : undefined);
          }}
        />
      ) : (
        <SentenceView
          sentence={selection.sentence}
          locale={locale}
          ttsSupported={ttsSupported}
        />
      )}
    </aside>
  );
}

function WordView({
  entry,
  saved,
  userTranslation,
  locale,
  ttsSupported,
  phraseControls,
  onToggleSave,
  onSaveMeaning,
}: {
  entry: WordEntry;
  saved: boolean;
  userTranslation?: string;
  locale: Locale;
  ttsSupported: boolean;
  phraseControls?: PhraseControls;
  onToggleSave: () => void;
  onSaveMeaning: (text: string) => void;
}) {
  const t = getDict(locale);
  const [editing, setEditing] = useState(false);
  const speak = () => ttsSpeak(entry.word);
  const phrase = isPhrase(entry);
  const dictMeaning = hasDictionaryMeaning(entry);

  // Close the editor when the learner moves to another word or phrase.
  useEffect(() => setEditing(false), [entry.word]);

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-2">
        <h3
          className={`font-bold text-slate-900 ${
            phrase ? "text-xl" : "text-2xl"
          }`}
        >
          {entry.word}
        </h3>
        {entry.partOfSpeech && (
          <span className="text-sm italic text-slate-500">
            {entry.partOfSpeech}
          </span>
        )}
        {phrase && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
            {t.panel.phrase}
          </span>
        )}
      </div>
      {(entry.pronunciation || ttsSupported) && (
        <div className="mt-1 flex items-center gap-2">
          {entry.pronunciation && (
            <span className="text-sm text-slate-600">{entry.pronunciation}</span>
          )}
          {ttsSupported && (
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
      )}

      {phraseControls && <PhraseBoundary controls={phraseControls} locale={locale} />}

      <div className="mt-4 space-y-3 text-sm">
        {entry.definition && (
          <Field label={t.panel.definition} body={entry.definition} />
        )}

        {/* The learner's own meaning comes first when it exists: it is the
            one they wrote and the one dictation prompts with. */}
        {userTranslation && (
          <div className="rounded-lg border border-brand-100 bg-brand-50/60 px-3 py-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              {t.panel.myMeaning}
            </div>
            <p className="mt-1 leading-relaxed text-slate-800">
              {userTranslation}
            </p>
          </div>
        )}

        {dictMeaning ? (
          <Field
            label={userTranslation ? t.panel.dictionaryMeaning : t.panel.chinese}
            body={entry.translation}
          />
        ) : (
          !userTranslation && (
            <p className="leading-relaxed text-slate-500">
              {phrase ? t.panel.phraseNoEntry : entry.translation}
            </p>
          )
        )}

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-brand-700 hover:underline"
          >
            {userTranslation ? t.panel.editMeaning : t.panel.addMeaning}
          </button>
        )}
        {editing && (
          <MeaningEditor
            current={userTranslation}
            locale={locale}
            note={saved ? undefined : t.panel.meaningSavesWord}
            onSave={(text) => {
              onSaveMeaning(text);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}

        {phrase && <PhraseGloss phrase={entry.word} locale={locale} />}

        {entry.collocation && (
          <Field label={t.panel.collocation} body={entry.collocation} />
        )}
        {entry.example && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.panel.example}
            </div>
            <p className="mt-1 italic text-slate-800">"{entry.example}"</p>
            {entry.exampleTranslation && (
              <p className="mt-1 text-slate-600">{entry.exampleTranslation}</p>
            )}
          </div>
        )}
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

// Learner-driven phrase boundary: start from the tapped word, grow or shrink
// either edge one word at a time, or return to the original word. Nothing is
// guessed automatically.
function PhraseBoundary({
  controls,
  locale,
}: {
  controls: PhraseControls;
  locale: Locale;
}) {
  const t = getDict(locale);
  const btn =
    "rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-xs leading-relaxed text-slate-500">
        {t.panel.extendHint}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={btn}
          onClick={controls.onExtendLeft}
          disabled={!controls.canExtendLeft}
        >
          {t.panel.extendLeft}
        </button>
        <button
          type="button"
          className={btn}
          onClick={controls.onExtendRight}
          disabled={!controls.canExtendRight}
        >
          {t.panel.extendRight}
        </button>
        <button
          type="button"
          className={btn}
          onClick={controls.onShrinkLeft}
          disabled={!controls.canShrinkLeft}
        >
          {t.panel.shrinkLeft}
        </button>
        <button
          type="button"
          className={btn}
          onClick={controls.onShrinkRight}
          disabled={!controls.canShrinkRight}
        >
          {t.panel.shrinkRight}
        </button>
        {controls.canReset && (
          <button
            type="button"
            className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
            onClick={controls.onReset}
          >
            {t.panel.resetSelection}
          </button>
        )}
      </div>
    </div>
  );
}

// Word-by-word glosses for a phrase, so a learner has something to work from
// while writing their own meaning. Words the dictionaries do not cover are
// still listed, just without a meaning.
function PhraseGloss({ phrase, locale }: { phrase: string; locale: Locale }) {
  const t = getDict(locale);
  const parts = glossParts(phrase);
  if (parts.length === 0) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t.panel.phraseParts}
      </div>
      <ul className="mt-1 space-y-0.5">
        {parts.map((p, i) => (
          <li key={`${p.word}-${i}`} className="text-slate-700">
            <span className="font-medium">{p.word}</span>
            {p.translation && (
              <span className="text-slate-500"> — {p.translation}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SentenceView({
  sentence,
  locale,
  ttsSupported,
}: {
  sentence: Sentence;
  locale: Locale;
  ttsSupported: boolean;
}) {
  const t = getDict(locale);
  const speak = () => ttsSpeak(sentence.text);
  return (
    <div>
      <p className="text-base leading-relaxed text-slate-900">{sentence.text}</p>
      {ttsSupported && (
        <button
          type="button"
          onClick={speak}
          className="mt-3 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          aria-label={t.panel.playSentence}
        >
          {t.panel.playSentence}
        </button>
      )}
      <div className="mt-4 space-y-3 text-sm">
        {/* Translation and grammar are optional in practice: a learner's own
            pasted article has neither, and an empty field should simply not
            render. Curated articles always have both. */}
        {sentence.translation?.trim() && (
          <Field label={t.panel.chineseTranslation} body={sentence.translation} />
        )}
        {sentence.grammar?.trim() && (
          <Field label={t.panel.grammar} body={sentence.grammar} />
        )}
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
