"use client";

import { useEffect, useMemo, useState } from "react";
import type { Article, Question } from "@/lib/types";
import { getDict, type Locale } from "@/lib/i18n";
import { selectAttempt } from "@/lib/quiz";
import {
  clearQuizProgress,
  loadQuizHistory,
  loadQuizProgress,
  recordQuizHistory,
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

  // The selected questions for the current attempt (a small random subset of
  // article.quiz), with the chosen option per question kept in parallel.
  const [attempt, setAttempt] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");

  // Restore a saved attempt on mount / article change. Randomized generation
  // only ever happens later in event handlers (Start / Try again), never
  // during render or SSR, so the server-rendered intro stays deterministic
  // and there is no hydration mismatch.
  useEffect(() => {
    const saved = loadQuizProgress(article.id);
    if (saved) {
      const resolved = saved.questionIds.map((id) =>
        quiz?.find((q) => q.id === id)
      );
      if (resolved.length > 0 && resolved.every(Boolean)) {
        const qs = resolved as Question[];
        // Normalize answers defensively against each question's options.
        const ans = saved.answers.map((a, i) =>
          typeof a === "string" && qs[i].options.includes(a) ? a : null
        );
        setAttempt(qs);
        setAnswers(ans);
        const firstUnanswered = ans.findIndex((a) => a === null);
        if (firstUnanswered === -1) {
          setPhase("done");
          setCurrent(qs.length - 1);
        } else {
          setPhase("quiz");
          setCurrent(firstUnanswered);
        }
        return;
      }
    }
    // Nothing valid saved → start from the intro with no attempt yet.
    setAttempt([]);
    setAnswers([]);
    setCurrent(0);
    setPhase("intro");
  }, [article.id, quiz]);

  const score = useMemo(
    () =>
      attempt.reduce(
        (acc, q, i) => (answers[i] === q.correctAnswer ? acc + 1 : acc),
        0
      ),
    [attempt, answers]
  );

  if (!quiz || quiz.length === 0) return null;

  const beginAttempt = (picked: Question[]) => {
    if (picked.length === 0) return;
    const ids = picked.map((q) => q.id);
    const ans = new Array<string | null>(picked.length).fill(null);
    setAttempt(picked);
    setAnswers(ans);
    setCurrent(0);
    setPhase("quiz");
    saveQuizProgress(article.id, { questionIds: ids, answers: ans });
    recordQuizHistory(article.id, ids);
  };

  // Build a fresh attempt, preferring questions not seen recently.
  const generate = () =>
    selectAttempt(quiz, loadQuizHistory(article.id));

  const handleStart = () => beginAttempt(generate());

  const handleAnswer = (choice: string) => {
    if (answers[current] != null) return; // already answered
    const next = [...answers];
    next[current] = choice;
    setAnswers(next);
    saveQuizProgress(article.id, {
      questionIds: attempt.map((q) => q.id),
      answers: next,
    });
  };

  const handleNext = () => {
    if (current >= attempt.length - 1) {
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleRestart = () => {
    clearQuizProgress(article.id);
    beginAttempt(generate()); // new random set, recent ones avoided
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

      {phase === "quiz" && attempt.length > 0 && (
        <div className="mt-4">
          <StepDots attempt={attempt} answers={answers} current={current} />
          <QuestionCard
            question={attempt[current]}
            index={current}
            total={attempt.length}
            chosen={answers[current]}
            locale={locale}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={current === attempt.length - 1}
          />
        </div>
      )}

      {phase === "done" && (
        <Result
          score={score}
          total={attempt.length}
          locale={locale}
          onRestart={handleRestart}
        />
      )}
    </section>
  );
}

// Small visual progress indicator: one dot per question in the attempt.
// Decorative only — the textual "Challenge x / y" chip carries the same
// information for screen readers.
function StepDots({
  attempt,
  answers,
  current,
}: {
  attempt: Question[];
  answers: (string | null)[];
  current: number;
}) {
  return (
    <div className="mb-3 flex items-center gap-1.5" aria-hidden="true">
      {attempt.map((q, i) => {
        const a = answers[i];
        let cls = "bg-slate-200";
        if (a != null) {
          cls = a === q.correctAnswer ? "bg-emerald-400" : "bg-rose-400";
        }
        const ring =
          i === current ? "ring-2 ring-brand-400 ring-offset-1" : "";
        return (
          <span
            key={q.id}
            className={`h-2 w-2 rounded-full transition-colors ${cls} ${ring}`}
          />
        );
      })}
    </div>
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
    <div>
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
          className={`quiz-pop mt-4 rounded-lg border px-4 py-3 text-sm leading-relaxed ${
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
  const perfect = total > 0 && score === total;
  const message = perfect
    ? t.quiz.resultPerfect
    : score >= Math.ceil(total / 2)
      ? t.quiz.resultGood
      : t.quiz.resultTry;

  return (
    <div className="quiz-pop mt-4 text-center">
      <div className="text-3xl" aria-hidden="true">
        {perfect ? "🏆" : "🎉"}
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-900">
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
