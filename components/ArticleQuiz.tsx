"use client";

import { useEffect, useMemo, useState } from "react";
import type { Article, Question } from "@/lib/types";
import { getDict, type Locale } from "@/lib/i18n";
import {
  clearQuizProgress,
  loadQuizProgress,
  saveQuizProgress,
} from "@/lib/storage";

type Phase = "intro" | "quiz" | "done";

export default function ArticleQuiz({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const t = getDict(locale);
  const quiz = article.quiz;
  const total = quiz?.length ?? 0;

  const [answers, setAnswers] = useState<(string | null)[]>(() =>
    new Array(total).fill(null)
  );
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");

  // Restore progress for this article on mount / article change.
  useEffect(() => {
    if (!quiz || total === 0) return;
    const saved = loadQuizProgress(article.id);
    // Normalize defensively: only accept null, or a string that is still a
    // valid option for that question. Anything else (legacy/malformed data
    // like numbers, booleans, objects, or stale option text) resets to null
    // so we never treat junk as "answered".
    const restored: (string | null)[] =
      saved && saved.answers.length === total
        ? saved.answers.map((a, i) =>
            typeof a === "string" && quiz[i].options.includes(a) ? a : null
          )
        : new Array<string | null>(total).fill(null);
    setAnswers(restored);

    const firstUnanswered = restored.findIndex((a) => a === null);
    if (firstUnanswered === -1) {
      setPhase("done");
      setCurrent(total - 1);
    } else if (restored.some((a) => a !== null)) {
      setPhase("quiz");
      setCurrent(firstUnanswered);
    } else {
      setPhase("intro");
      setCurrent(0);
    }
  }, [article.id, total, quiz]);

  const score = useMemo(() => {
    if (!quiz) return 0;
    return quiz.reduce(
      (acc, q, i) => (answers[i] === q.correctAnswer ? acc + 1 : acc),
      0
    );
  }, [quiz, answers]);

  if (!quiz || total === 0) return null;

  const persist = (next: (string | null)[]) => {
    setAnswers(next);
    saveQuizProgress(article.id, { answers: next });
  };

  const handleStart = () => {
    setPhase("quiz");
    setCurrent(0);
  };

  const handleAnswer = (choice: string) => {
    if (answers[current] !== null) return; // already answered
    const next = [...answers];
    next[current] = choice;
    persist(next);
  };

  const handleNext = () => {
    if (current >= total - 1) {
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleRestart = () => {
    const cleared = new Array<string | null>(total).fill(null);
    clearQuizProgress(article.id);
    setAnswers(cleared);
    setCurrent(0);
    setPhase("intro");
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-2">
        <span className="text-xl">🚩</span>
        <h2 className="text-lg font-bold text-slate-900">{t.quiz.heading}</h2>
      </div>

      {phase === "intro" && (
        <div className="mt-3">
          <p className="text-sm leading-relaxed text-slate-600">
            {t.quiz.intro}
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            {t.quiz.start}
          </button>
        </div>
      )}

      {phase === "quiz" && (
        <QuestionCard
          question={quiz[current]}
          index={current}
          total={total}
          chosen={answers[current]}
          locale={locale}
          onAnswer={handleAnswer}
          onNext={handleNext}
          isLast={current === total - 1}
        />
      )}

      {phase === "done" && (
        <Result
          score={score}
          total={total}
          locale={locale}
          onRestart={handleRestart}
        />
      )}
    </section>
  );
}

function QuestionCard({
  question,
  index,
  total,
  chosen,
  locale,
  onAnswer,
  onNext,
  isLast,
}: {
  question: Question;
  index: number;
  total: number;
  chosen: string | null;
  locale: Locale;
  onAnswer: (choice: string) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const t = getDict(locale);
  const answered = chosen !== null;
  const isCorrect = chosen === question.correctAnswer;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
          {t.quiz.progress(index + 1, total)}
        </span>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700">
          {t.quiz.types[question.type]}
        </span>
      </div>

      <p className="mt-3 text-base font-medium leading-relaxed text-slate-900">
        {question.question}
      </p>

      <div className="mt-4 space-y-2">
        {question.options.map((opt) => {
          const isChosen = chosen === opt;
          const isAnswer = opt === question.correctAnswer;
          let cls =
            "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
          if (answered) {
            if (isAnswer) {
              cls = "border-emerald-300 bg-emerald-50 text-emerald-800";
            } else if (isChosen) {
              cls = "border-rose-300 bg-rose-50 text-rose-800";
            } else {
              cls = "border-slate-200 bg-white text-slate-400";
            }
          }
          // After answering, keep options focusable (aria-disabled rather
          // than disabled) and spell out the state in the accessible name so
          // it isn't conveyed by colour / ✓ ✕ glyph alone.
          const ariaLabel = !answered
            ? undefined
            : isAnswer
              ? `${opt} — ${t.quiz.correctAnswerLabel}`
              : isChosen
                ? `${opt} — ${t.quiz.yourWrongLabel}`
                : opt;
          return (
            <button
              key={opt}
              type="button"
              aria-disabled={answered}
              aria-label={ariaLabel}
              onClick={() => {
                if (!answered) onAnswer(opt);
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${cls} ${
                answered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span>{opt}</span>
              {answered && isAnswer && <span aria-hidden="true">✓</span>}
              {answered && isChosen && !isAnswer && (
                <span aria-hidden="true">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-relaxed ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p className="font-medium">
            {isCorrect ? t.quiz.correct : t.quiz.incorrect}
          </p>
          {!isCorrect && (
            <p className="mt-1">
              <span className="font-semibold">
                {t.quiz.correctAnswerLabel}
                {t.quiz.labelSep}
              </span>
              {question.correctAnswer}
            </p>
          )}
          <p className="mt-1">
            <span className="font-semibold">
              {t.quiz.explanationLabel}
              {t.quiz.labelSep}
            </span>
            {question.explanation}
          </p>
        </div>
      )}

      {answered && (
        <button
          type="button"
          onClick={onNext}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          {isLast ? t.quiz.finish : t.quiz.next}
        </button>
      )}
    </div>
  );
}

function Result({
  score,
  total,
  locale,
  onRestart,
}: {
  score: number;
  total: number;
  locale: Locale;
  onRestart: () => void;
}) {
  const t = getDict(locale);
  const message =
    score === total
      ? t.quiz.resultPerfect
      : score >= Math.ceil(total / 2)
        ? t.quiz.resultGood
        : t.quiz.resultTry;

  return (
    <div className="mt-4 text-center">
      <p className="text-2xl font-bold text-slate-900">
        {t.quiz.result(score, total)}
      </p>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-5 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        {t.quiz.restart}
      </button>
    </div>
  );
}
