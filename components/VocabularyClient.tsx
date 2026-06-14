"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SavedWord } from "@/lib/types";
import { loadSavedWords, removeWords } from "@/lib/storage";
import { getDict, type Locale } from "@/lib/i18n";

// A group key derived from a saved word's source metadata. Weekly Stories
// words group by week; other articles group by article id; words saved before
// this metadata existed fall back to "uncategorized" so nothing is lost.
type GroupKey = string; // "week:1" | "article:<id>" | "uncategorized"

function groupKeyOf(w: SavedWord): GroupKey {
  // Priority reflects where the learner actually saved the word:
  // 1. Explicit weekly-save metadata (new saves from a Weekly Stories article).
  if (typeof w.weekNumber === "number") return `week:${w.weekNumber}`;
  // 2. Article source metadata (new saves from any article). This must come
  //    before sourceWeek: a common word saved from a non-weekly article can
  //    still carry the dictionary's sourceWeek, but it belongs to its article.
  if (w.articleId) return `article:${w.articleId}`;
  // 3. Weekly track flag without a number (defensive).
  if (w.track === "weekly-stories") return "week:0";
  // 4. Legacy fallback: words saved before article-source metadata existed
  //    still carry the dictionary's sourceWeek, with no articleId.
  if (typeof w.sourceWeek === "number") return `week:${w.sourceWeek}`;
  return "uncategorized";
}

type GroupOption = { key: GroupKey; label: string; count: number; order: number };

export default function VocabularyClient({ locale }: { locale: Locale }) {
  const [words, setWords] = useState<SavedWord[] | null>(null);
  const [filter, setFilter] = useState<GroupKey>("all");
  const [selectMode, setSelectMode] = useState(false);
  // Selected words, keyed by lowercased word (matches storage's dedupe key).
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string[] | null>(null);
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

  // Build the filter options from whatever groups currently have words.
  const groups: GroupOption[] = useMemo(() => {
    if (!words) return [];
    const map = new Map<GroupKey, GroupOption>();
    for (const w of words) {
      const key = groupKeyOf(w);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        continue;
      }
      let label: string;
      let order: number;
      if (key.startsWith("week:")) {
        const n = Number(key.slice(5));
        label = t.vocabulary.weekGroup(n);
        order = 100 + n; // weeks first, in ascending order
      } else if (key.startsWith("article:")) {
        label = w.articleTitle || t.vocabulary.otherArticles;
        order = 1000; // then other articles
      } else {
        label = t.vocabulary.uncategorized;
        order = 9000; // uncategorized last
      }
      map.set(key, { key, label, count: 1, order });
    }
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [words, t]);

  // Keep the active filter valid if its group disappears (e.g. all its words
  // were deleted).
  useEffect(() => {
    if (filter !== "all" && words && !groups.some((g) => g.key === filter)) {
      setFilter("all");
    }
  }, [filter, groups, words]);

  // Clear any selection whenever the visible group changes, so batch delete can
  // never act on words that are no longer on screen — the confirmation count
  // always matches what the user can currently see.
  useEffect(() => {
    setSelected(new Set());
  }, [filter]);

  const visible = useMemo(() => {
    if (!words) return [];
    if (filter === "all") return words;
    return words.filter((w) => groupKeyOf(w) === filter);
  }, [words, filter]);

  const speak = (word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const toggleSelect = (word: string) => {
    const key = word.toLowerCase();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const enterSelectMode = () => {
    setSelectMode(true);
    setSelected(new Set());
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const confirmPending = () => {
    if (pending) removeWords(pending);
    setPending(null);
    // After a delete, clear any selection that referenced removed words.
    setSelected(new Set());
  };

  if (words === null) {
    return <p className="text-slate-500">{t.vocabulary.loading}</p>;
  }

  const selectedCount = selected.size;

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.vocabulary.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {t.vocabulary.subtitle(words.length)}
        </p>
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
          {t.vocabulary.deviceNoteZh}
          <br />
          {t.vocabulary.deviceNoteEn}
        </p>
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
        <>
          {/* Controls: group filter on the left, select-mode toggle on the right. */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">{t.vocabulary.filterLabel}</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
              >
                <option value="all">
                  {t.vocabulary.allWords} ({words.length})
                </option>
                {groups.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label} ({g.count})
                  </option>
                ))}
              </select>
            </label>

            {selectMode ? (
              <button
                type="button"
                onClick={exitSelectMode}
                className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.vocabulary.exitSelect}
              </button>
            ) : (
              <button
                type="button"
                onClick={enterSelectMode}
                className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.vocabulary.select}
              </button>
            )}
          </div>

          {/* Batch action bar, shown only in selection mode. */}
          {selectMode && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm text-slate-600">
                {t.vocabulary.selectedCount(selectedCount)}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  disabled={selectedCount === 0}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.vocabulary.clearSelection}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    selectedCount > 0 && setPending(Array.from(selected))
                  }
                  disabled={selectedCount === 0}
                  className="rounded-md border border-rose-300 bg-rose-600 px-3 py-1 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.vocabulary.deleteSelected}
                </button>
              </div>
            </div>
          )}

          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              {t.vocabulary.groupEmpty}
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visible.map((w) => {
                const isSelected = selected.has(w.word.toLowerCase());
                return (
                  <li
                    key={w.word + w.savedAt}
                    onClick={
                      selectMode ? () => toggleSelect(w.word) : undefined
                    }
                    className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
                      selectMode
                        ? `cursor-pointer ${
                            isSelected
                              ? "border-brand-500 ring-2 ring-brand-200"
                              : "border-slate-200 hover:border-slate-300"
                          }`
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        {selectMode && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(w.word)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={w.word}
                            className="mt-1.5 h-4 w-4 shrink-0 accent-brand-600"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h2 className="truncate text-lg font-semibold text-slate-900">
                              {w.word}
                            </h2>
                            {w.partOfSpeech && (
                              <span className="text-xs italic text-slate-500">
                                {w.partOfSpeech}
                              </span>
                            )}
                          </div>
                          {w.pronunciation && (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {w.pronunciation}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Read-aloud stays at the top, easy to reach. Delete is
                          moved to its own row at the bottom of the card. */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(w.word);
                        }}
                        className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                        aria-label={t.panel.play}
                      >
                        🔊
                      </button>
                    </div>
                    {w.definition && (
                      <p className="mt-2 text-sm text-slate-700">
                        {w.definition}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {w.translation}
                    </p>
                    {w.example && (
                      <p className="mt-2 text-xs italic text-slate-500">
                        "{w.example}"
                      </p>
                    )}
                    {/* Single delete: separated from read-aloud, secondary
                        danger styling, and gated behind a confirm dialog.
                        Hidden in selection mode (batch delete handles it). */}
                    {!selectMode && (
                      <div className="mt-3 border-t border-slate-100 pt-2 text-right">
                        <button
                          type="button"
                          onClick={() => setPending([w.word])}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
                        >
                          {t.vocabulary.remove}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {/* Confirmation dialog for both single and batch delete. */}
      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPending(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-900">
              {t.vocabulary.confirmTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {pending.length === 1
                ? t.vocabulary.confirmSingle(pending[0])
                : t.vocabulary.confirmBatch(pending.length)}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.vocabulary.cancel}
              </button>
              <button
                type="button"
                onClick={confirmPending}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
              >
                {t.vocabulary.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
