"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SavedWord } from "@/lib/types";
import {
  loadPracticeStats,
  loadSavedWords,
  practiceStatOf,
  recordPracticeResult,
} from "@/lib/storage";
import { groupKeyOf, isPhrase, vocabKey, type GroupKey } from "@/lib/vocab";
import {
  buildRound,
  gradeAnswer,
  isPractisable,
  letterHint,
  ROUND_SIZE,
  type HintKind,
  type PracticeAnswerMode,
  type PracticeDirection,
  type PracticeQuestion,
} from "@/lib/practice";
import { shouldCommitOnEnter } from "@/lib/keys";
import { getDict, type Locale } from "@/lib/i18n";
import { ttsSpeak, useTTSState } from "@/lib/tts";

// The practice screen. All question building, grading, hinting and ordering
// lives in lib/practice.ts — this component chooses a scope and a type, then
// renders whatever `PracticeQuestion` it is handed. The four direction ×
// answer-mode combinations share one render path.

type Phase = "setup" | "practice" | "done";
type Outcome = { question: PracticeQuestion; correct: boolean; answer: string };

export default function DictationClient({ locale }: { locale: Locale }) {
  const [words, setWords] = useState<SavedWord[] | null>(null);
  const [scope, setScope] = useState<GroupKey>("all");
  const [direction, setDirection] = useState<PracticeDirection>("zh-to-en");
  const [answerMode, setAnswerMode] = useState<PracticeAnswerMode>("typed");
  const [phase, setPhase] = useState<Phase>("setup");
  const [round, setRound] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState<HintKind[]>([]);
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

  // Only items with a meaning can be practised: one direction uses it as the
  // prompt, the other as the answer.
  const practisable = useMemo(
    () => (words ?? []).filter(isPractisable),
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
    const map = new Map<
      GroupKey,
      { key: GroupKey; label: string; count: number; order: number }
    >();
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

  const scopeLabel =
    scope === "all"
      ? t.dictation.allWords
      : (groups.find((g) => g.key === scope)?.label ?? t.dictation.allWords);
  const directionLabel =
    direction === "zh-to-en" ? t.dictation.zhToEn : t.dictation.enToZh;
  const modeLabel =
    answerMode === "typed" ? t.dictation.typed : t.dictation.multipleChoice;

  // Randomization happens here, in an event handler — never during render —
  // so the statically exported page has no hydration mismatch.
  const startRound = (items: SavedWord[]) => {
    const stats = loadPracticeStats();
    const questions = buildRound(
      items,
      { direction, answerMode },
      {
        pool: inScope,
        statOf: (item) => practiceStatOf(stats, item.word, direction),
        size: ROUND_SIZE,
      }
    );
    if (questions.length === 0) return;
    setRound(questions);
    setIndex(0);
    setInput("");
    setChecked(null);
    setRevealed([]);
    setOutcomes([]);
    setPhase("practice");
  };

  const current = round[index];

  const settle = (correct: boolean, answer: string) => {
    if (!current || checked !== null) return;
    setChecked(correct);
    recordPracticeResult(current.item.word, current.direction, correct);
    setOutcomes((prev) => [...prev, { question: current, correct, answer }]);
  };

  const submitTyped = () => {
    if (!current || checked !== null || input.trim().length === 0) return;
    settle(gradeAnswer(current, input).correct, input);
  };

  const chooseOption = (option: string) => {
    if (!current || checked !== null) return;
    setInput(option); // remembered so the chosen option can be marked
    settle(gradeAnswer(current, option).correct, option);
  };

  const useHint = (hint: HintKind) => {
    if (revealed.includes(hint)) return;
    setRevealed((prev) => [...prev, hint]);
    // Seeing the answer ends the question: it is shown, and the attempt is
    // recorded as a miss so the item keeps coming back.
    if (hint === "answer") settle(false, input);
  };

  const next = () => {
    if (index >= round.length - 1) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setChecked(null);
    setRevealed([]);
    inputRef.current?.focus();
  };

  if (words === null) {
    return <p className="text-slate-500">{t.vocabulary.loading}</p>;
  }

  const score = outcomes.filter((o) => o.correct).length;
  const missedItems = outcomes.filter((o) => !o.correct).map((o) => o.question.item);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.dictation.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{t.dictation.subtitle}</p>
      </header>

      {phase === "setup" && (
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
              {/* Step 1 — scope */}
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold text-slate-900">
                  {t.dictation.stepScope}
                </legend>
                <label className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
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
              </fieldset>

              {/* Step 2 — direction, then answer mode */}
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold text-slate-900">
                  {t.dictation.stepType}
                </legend>

                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.dictation.directionLabel}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <OptionCard
                    checked={direction === "zh-to-en"}
                    onSelect={() => setDirection("zh-to-en")}
                    name="direction"
                    title={t.dictation.zhToEn}
                    hint={t.dictation.zhToEnHint}
                  />
                  <OptionCard
                    checked={direction === "en-to-zh"}
                    onSelect={() => setDirection("en-to-zh")}
                    name="direction"
                    title={t.dictation.enToZh}
                    hint={t.dictation.enToZhHint}
                  />
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.dictation.answerModeLabel}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <OptionCard
                    checked={answerMode === "typed"}
                    onSelect={() => setAnswerMode("typed")}
                    name="mode"
                    title={t.dictation.typed}
                    hint={t.dictation.typedHint}
                  />
                  <OptionCard
                    checked={answerMode === "multiple-choice"}
                    onSelect={() => setAnswerMode("multiple-choice")}
                    name="mode"
                    title={t.dictation.multipleChoice}
                    hint={t.dictation.multipleChoiceHint}
                  />
                </div>
              </fieldset>

              <p
                className="mt-5 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800"
                aria-live="polite"
              >
                {t.dictation.summary(scopeLabel, directionLabel, modeLabel)}
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
        <QuestionView
          question={current}
          index={index}
          total={round.length}
          input={input}
          checked={checked}
          revealed={revealed}
          locale={locale}
          ttsSupported={ttsSupported}
          inputRef={inputRef}
          requestedMode={answerMode}
          onInput={setInput}
          onSubmit={submitTyped}
          onChoose={chooseOption}
          onHint={useHint}
          onNext={next}
        />
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

          {missedItems.length > 0 && (
            <ul className="mx-auto mt-5 max-w-md space-y-1 text-left text-sm">
              {outcomes
                .filter((o) => !o.correct)
                .map((o) => (
                  <li
                    key={vocabKey(o.question.item.word)}
                    className="rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <span className="font-semibold text-slate-900">
                      {o.question.item.word}
                    </span>
                    <span className="text-slate-500">
                      {" "}
                      — {o.question.direction === "zh-to-en"
                        ? o.question.prompt
                        : o.question.canonicalAnswer}
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
            {missedItems.length > 0 && (
              <button
                type="button"
                onClick={() => startRound(missedItems)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.dictation.practiceWrong}
              </button>
            )}
            <button
              type="button"
              onClick={() => setPhase("setup")}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.dictation.back}
            </button>
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

function OptionCard({
  checked,
  onSelect,
  name,
  title,
  hint,
}: {
  checked: boolean;
  onSelect: () => void;
  name: string;
  title: string;
  hint: string;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-2 rounded-xl border p-3 transition-colors ${
        checked
          ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-200"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
      />
      <span>
        <span className="block text-sm font-medium text-slate-900">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
          {hint}
        </span>
      </span>
    </label>
  );
}

function QuestionView({
  question,
  index,
  total,
  input,
  checked,
  revealed,
  locale,
  ttsSupported,
  inputRef,
  requestedMode,
  onInput,
  onSubmit,
  onChoose,
  onHint,
  onNext,
}: {
  question: PracticeQuestion;
  index: number;
  total: number;
  input: string;
  checked: boolean | null;
  revealed: HintKind[];
  locale: Locale;
  ttsSupported: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  // What the learner asked for, so a question that had to fall back to typing
  // can say so instead of silently changing shape.
  requestedMode: PracticeAnswerMode;
  onInput: (v: string) => void;
  onSubmit: () => void;
  onChoose: (option: string) => void;
  onHint: (hint: HintKind) => void;
  onNext: () => void;
}) {
  const t = getDict(locale);
  const zhToEn = question.direction === "zh-to-en";
  const answered = checked !== null;
  // True between compositionstart and compositionend, so an Enter that only
  // confirms an IME candidate never submits the answer (see lib/keys.ts).
  const composingRef = useRef(false);
  // Read-aloud only ever speaks English: the prompt in en→zh, the answer in
  // zh→en (and only once the answer is on screen).
  const speakable = zhToEn ? (answered ? question.canonicalAnswer : null) : question.prompt;
  const hintLabels: Record<HintKind, string> = {
    letters: t.dictation.hintLetters,
    answer: zhToEn ? t.dictation.hintAnswer : t.dictation.hintAnswerZh,
    "unmasked-context": t.dictation.hintUnmasked,
  };
  // A strict ladder: only the next unused hint is offered, so a learner
  // cannot skip straight to the unmasked sentence (which would hand them the
  // answer without passing through the smaller nudges). Once the question is
  // settled, the "show the answer" rung is spent and the ladder moves on.
  const nextHint = question.hints.find(
    (h) => !revealed.includes(h) && !(h === "answer" && answered)
  );
  const openHints = nextHint ? [nextHint] : [];
  const contextText =
    revealed.includes("unmasked-context") || !question.contextMasked
      ? question.sourceSentence
      : question.maskedSentence;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
          {t.dictation.progress(index + 1, total)}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
          {zhToEn ? t.dictation.zhToEn : t.dictation.enToZh}
        </span>
        {isPhrase(question.item) && (
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700">
            {t.dictation.phraseBadge}
          </span>
        )}
      </div>

      <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
        {zhToEn ? t.dictation.prompt : t.dictation.promptEnToZh}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <p
          className="text-2xl font-bold leading-snug text-slate-900"
          lang={zhToEn ? "zh" : "en"}
        >
          {question.prompt}
        </p>
        {!zhToEn && ttsSupported && (
          <button
            type="button"
            onClick={() => ttsSpeak(question.prompt)}
            className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            {t.dictation.play}
          </button>
        )}
      </div>
      {question.item.partOfSpeech && (
        <p className="mt-1 text-sm italic text-slate-500">
          {question.item.partOfSpeech}
        </p>
      )}
      {/* The learner's own note, when the dictionary owns the answer. Shown as
          a note, never graded against. */}
      {zhToEn && question.learnerNote && (
        <p className="mt-1 text-sm text-slate-500">
          {t.dictation.learnerNote}: {question.learnerNote}
        </p>
      )}

      {contextText && (
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.dictation.contextLabel}
            {question.contextMasked && !revealed.includes("unmasked-context") && (
              <span className="ml-1 font-normal normal-case text-slate-400">
                {t.dictation.contextMaskedNote}
              </span>
            )}
          </div>
          <p className="mt-1 leading-relaxed text-slate-700" lang="en">
            {contextText}
          </p>
        </div>
      )}

      {revealed.includes("letters") && (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <span className="font-semibold">
            {t.dictation.hint}
            {t.quiz.labelSep}
          </span>
          <span className="font-mono tracking-widest">
            {letterHint(question.canonicalAnswer)}
          </span>
        </p>
      )}

      {question.answerMode === "multiple-choice" ? (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {t.dictation.chooseOne}
          </p>
          <div className="mt-2 space-y-2">
            {question.choices?.map((choice) => {
              const isAnswer = choice === question.canonicalAnswer;
              const isChosen = answered && input === choice;
              let cls =
                "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
              if (answered) {
                if (isAnswer)
                  cls = "border-emerald-300 bg-emerald-50 text-emerald-800";
                else if (isChosen)
                  cls = "border-rose-300 bg-rose-50 text-rose-800";
                else cls = "border-slate-200 bg-white text-slate-400";
              }
              return (
                <button
                  key={choice}
                  type="button"
                  aria-disabled={answered}
                  onClick={() => onChoose(choice)}
                  lang={zhToEn ? "en" : "zh"}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${cls} ${
                    answered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span>{choice}</span>
                  {answered && isAnswer && <span aria-hidden="true">✓</span>}
                  {answered && isChosen && !isAnswer && (
                    <span aria-hidden="true">✕</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <input
          ref={inputRef}
          value={input}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang={zhToEn ? "en" : "zh"}
          readOnly={answered}
          onChange={(e) => onInput(e.target.value)}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          onKeyDown={(e) => {
            const native = e.nativeEvent as KeyboardEvent;
            if (
              !shouldCommitOnEnter({
                key: e.key,
                isComposing: native.isComposing,
                keyCode: native.keyCode,
                composing: composingRef.current,
              })
            ) {
              return;
            }
            e.preventDefault();
            if (!answered) onSubmit();
            else onNext();
          }}
          placeholder={
            zhToEn
              ? t.dictation.inputPlaceholder
              : t.dictation.inputPlaceholderZh
          }
          aria-label={
            zhToEn ? t.dictation.inputPlaceholder : t.dictation.inputPlaceholderZh
          }
          className={`mt-5 w-full rounded-xl border px-4 py-3 text-lg outline-none transition-colors ${
            !answered
              ? "border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              : checked
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-rose-300 bg-rose-50 text-rose-900"
          }`}
        />
      )}

      {/* A question that asked for multiple choice but could not find enough
          honest distractors becomes a typed question — say so rather than
          padding the options with invented data. */}
      {requestedMode === "multiple-choice" && question.answerMode === "typed" && (
        <p className="mt-2 text-xs text-slate-500">{t.dictation.choiceFallback}</p>
      )}

      {!answered && question.answerMode === "typed" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={input.trim().length === 0}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.dictation.check}
          </button>
        </div>
      )}

      {openHints.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {openHints.map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => onHint(hint)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {hintLabels[hint]}
            </button>
          ))}
        </div>
      )}

      {answered && (
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
              {zhToEn ? t.dictation.answerLabel : t.dictation.answerLabelZh}
              {t.quiz.labelSep}
            </span>
            <span className="text-base font-bold" lang={zhToEn ? "en" : "zh"}>
              {question.canonicalAnswer}
            </span>
            {ttsSupported && speakable && (
              <button
                type="button"
                onClick={() => ttsSpeak(speakable)}
                className="ml-2 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                {t.dictation.play}
              </button>
            )}
          </p>
          {/* When the canonical answer is the learner's own wording, say so —
              it is their note, not a dictionary entry. */}
          {!zhToEn && !question.learnerNote && question.item.userTranslation && (
            <p className="mt-1 text-xs">{t.dictation.userMeaningNote}</p>
          )}
        </div>
      )}

      {answered && (
        <button
          type="button"
          onClick={onNext}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          {index >= total - 1 ? t.dictation.finish : t.dictation.next}
        </button>
      )}
    </section>
  );
}
