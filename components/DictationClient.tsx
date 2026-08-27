"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SavedWord } from "@/lib/types";
import {
  loadDictationStats,
  loadSavedWords,
  recordDictationResult,
} from "@/lib/storage";
import {
  answersMatch,
  displayMeaning,
  groupKeyOf,
  hasMeaning,
  isPhrase,
  vocabKey,
  type GroupKey,
} from "@/lib/vocab";
import { getDict, type Locale } from "@/lib/i18n";
import { ttsSpeak, useTTSState } from "@/lib/tts";

// How many items one round asks for. Short on purpose: a round should feel
// finishable in a few minutes.
const ROUND_SIZE = 10;

type Phase = "intro" | "practice" | "done";
type Outcome = { word: SavedWord; correct: boolean; answer: string };

// Weakest first (more misses than hits), then least recently practised, so a
// round puts the shakiest items in front of the learner.
function practiceOrder(words: SavedWord[]): SavedWord[] {
  const stats = loadDictationStats();
  return [...words].sort((a, b) => {
    const sa = stats[vocabKey(a.word)] ?? { right: 0, wrong: 0, lastAt: 0 };
    const sb = stats[vocabKey(b.word)] ?? { right: 0, wrong: 0, lastAt: 0 };
    const scoreA = sa.wrong - sa.right;
    const scoreB = sb.wrong - sb.right;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return sa.lastAt - sb.lastAt;
  });
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function DictationClient({ locale }: { locale: Locale }) {
  const [words, setWords] = useState<SavedWord[] | null>(null);
  const [scope, setScope] = useState<GroupKey>("all");
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState<SavedWord[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null); // null = not yet
  const [showHint, setShowHint] = useState(false);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = getDict(locale);
  const { supported: ttsSupported } = useTTSState();

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

  // Only items with a meaning to prompt with can be practised. An item's own
  // user-written meaning counts, which is what lets a phrase with no
  // dictionary entry take part like any other word.
  const practisable = useMemo(
    () => (words ?? []).filter(hasMeaning),
    [words]
  );
  const missingMeaning = (words ?? []).length - practisable.length;

  const inScope = useMemo(
    () =>
      scope === "all"
        ? practisable
        : practisable.filter((w) => groupKeyOf(w) === scope),
    [practisable, scope]
  );

  const groups = useMemo(() => {
    const map = new Map<GroupKey, { key: GroupKey; label: string; count: number; order: number }>();
    for (const w of practisable) {
      const key = groupKeyOf(w);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        continue;
      }
      let label: string;
      let order: number;
      if (key.startsWith("week:")) {
        label = t.vocabulary.weekGroup(Number(key.slice(5)));
        order = 100 + Number(key.slice(5));
      } else if (key.startsWith("article:")) {
        label = w.articleTitle || t.vocabulary.otherArticles;
        order = 1000;
      } else {
        label = t.vocabulary.uncategorized;
        order = 9000;
      }
      map.set(key, { key, label, count: 1, order });
    }
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [practisable, t]);

  // Keep the scope valid if its group runs out of practisable items.
  useEffect(() => {
    if (scope !== "all" && words && !groups.some((g) => g.key === scope)) {
      setScope("all");
    }
  }, [scope, groups, words]);

  // Randomization happens here, in an event handler — never during render —
  // so the statically exported page has no hydration mismatch.
  const startRound = (pool: SavedWord[]) => {
    const picked = shuffle(practiceOrder(pool).slice(0, ROUND_SIZE));
    if (picked.length === 0) return;
    setRound(picked);
    setIndex(0);
    setInput("");
    setChecked(null);
    setShowHint(false);
    setOutcomes([]);
    setPhase("practice");
  };

  const current = round[index];

  const check = () => {
    if (!current || checked !== null || input.trim().length === 0) return;
    const correct = answersMatch(input, current.word);
    setChecked(correct);
    recordDictationResult(current.word, correct);
    setOutcomes((prev) => [...prev, { word: current, correct, answer: input }]);
  };

  const reveal = () => {
    if (!current || checked !== null) return;
    setChecked(false);
    recordDictationResult(current.word, false);
    setOutcomes((prev) => [
      ...prev,
      { word: current, correct: false, answer: input },
    ]);
  };

  const next = () => {
    if (index >= round.length - 1) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setChecked(null);
    setShowHint(false);
    inputRef.current?.focus();
  };

  if (words === null) {
    return <p className="text-slate-500">{t.vocabulary.loading}</p>;
  }

  const score = outcomes.filter((o) => o.correct).length;
  const missed = outcomes.filter((o) => !o.correct).map((o) => o.word);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.dictation.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{t.dictation.subtitle}</p>
      </header>

      {phase === "intro" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-600">
            {t.dictation.intro}
          </p>

          {practisable.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-slate-700">{t.dictation.empty}</p>
              <p className="mt-1 text-sm text-slate-500">
                {t.dictation.emptyHint}
              </p>
              <Link
                href={`/${locale}/vocabulary`}
                className="mt-4 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                {t.dictation.goVocabulary}
              </Link>
            </div>
          ) : (
            <>
              <label className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">{t.dictation.scopeLabel}</span>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
                >
                  <option value="all">
                    {t.dictation.allWords} ({practisable.length})
                  </option>
                  {groups.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.label} ({g.count})
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-2 text-sm text-slate-500">
                {t.dictation.ready(inScope.length)}
              </p>
              <button
                type="button"
                onClick={() => startRound(inScope)}
                disabled={inScope.length === 0}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.dictation.start}
              </button>
            </>
          )}

          {missingMeaning > 0 && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
              {t.dictation.needMeaning(missingMeaning)}{" "}
              <Link
                href={`/${locale}/vocabulary`}
                className="font-medium underline"
              >
                {t.dictation.goVocabulary}
              </Link>
            </p>
          )}
        </section>
      )}

      {phase === "practice" && current && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
              {t.dictation.progress(index + 1, round.length)}
            </span>
            {isPhrase(current) && (
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700">
                {t.dictation.phraseBadge}
              </span>
            )}
          </div>

          <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
            {t.dictation.prompt}
          </p>
          <p className="mt-1 text-2xl font-bold leading-snug text-slate-900">
            {displayMeaning(current)}
          </p>
          {current.partOfSpeech && (
            <p className="mt-1 text-sm italic text-slate-500">
              {current.partOfSpeech}
            </p>
          )}

          <input
            ref={inputRef}
            value={input}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            readOnly={checked !== null}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              if (checked === null) check();
              else next();
            }}
            placeholder={t.dictation.inputPlaceholder}
            className={`mt-5 w-full rounded-xl border px-4 py-3 text-lg outline-none transition-colors ${
              checked === null
                ? "border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                : checked
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : "border-rose-300 bg-rose-50 text-rose-900"
            }`}
          />

          {checked === null && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={check}
                disabled={input.trim().length === 0}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.dictation.check}
              </button>
              <button
                type="button"
                onClick={reveal}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {t.dictation.reveal}
              </button>
              {!showHint && (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
                >
                  {t.dictation.showHint}
                </button>
              )}
            </div>
          )}

          {checked === null && showHint && (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="font-semibold">
                {t.dictation.hint}
                {t.quiz.labelSep}
              </span>
              <span className="font-mono tracking-widest">
                {maskWord(current.word)}
              </span>
              <span className="ml-2 text-xs text-slate-500">
                {t.dictation.letters(
                  current.word.replace(/[^A-Za-z]/g, "").length
                )}
              </span>
            </p>
          )}

          {checked !== null && (
            <div
              role="status"
              aria-live="polite"
              className={`quiz-pop mt-4 rounded-lg border px-4 py-3 text-sm leading-relaxed ${
                checked
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <p className="font-medium">
                {checked ? t.dictation.correct : t.dictation.wrong}
              </p>
              <p className="mt-1">
                <span className="font-semibold">
                  {t.dictation.answerLabel}
                  {t.quiz.labelSep}
                </span>
                <span className="text-base font-bold">{current.word}</span>
                {ttsSupported && (
                  <button
                    type="button"
                    onClick={() => ttsSpeak(current.word)}
                    className="ml-2 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    {t.dictation.play}
                  </button>
                )}
              </p>
            </div>
          )}

          {checked !== null && (
            <button
              type="button"
              onClick={next}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              {index >= round.length - 1
                ? t.dictation.finish
                : t.dictation.next}
            </button>
          )}
        </section>
      )}

      {phase === "done" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="text-3xl" aria-hidden="true">
            {score === round.length ? "🏆" : "🎉"}
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {t.dictation.result(score, round.length)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {score === round.length
              ? t.dictation.resultPerfect
              : score >= Math.ceil(round.length / 2)
                ? t.dictation.resultGood
                : t.dictation.resultTry}
          </p>

          {missed.length > 0 && (
            <ul className="mx-auto mt-5 max-w-md space-y-1 text-left text-sm">
              {outcomes
                .filter((o) => !o.correct)
                .map((o) => (
                  <li
                    key={vocabKey(o.word.word)}
                    className="rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <span className="font-semibold text-slate-900">
                      {o.word.word}
                    </span>
                    <span className="text-slate-500">
                      {" "}
                      — {displayMeaning(o.word)}
                    </span>
                  </li>
                ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => startRound(inScope)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t.dictation.again}
            </button>
            {missed.length > 0 && (
              <button
                type="button"
                onClick={() => startRound(missed)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.dictation.practiceWrong}
              </button>
            )}
            <Link
              href={`/${locale}/vocabulary`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.dictation.goVocabulary}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

// A gentle hint: keep the first letter of each word, hide the rest.
function maskWord(word: string): string {
  return word
    .split(/\s+/)
    .map((part) =>
      part
        .split("")
        .map((ch, i) => (i === 0 || !/[A-Za-z]/.test(ch) ? ch : "_"))
        .join("")
    )
    .join(" ");
}
