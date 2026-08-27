"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  addUserArticle,
  loadUserArticles,
  removeUserArticle,
  splitSentences,
  updateUserArticle,
  type UserArticle,
} from "@/lib/userArticles";
import { getDict, type Locale } from "@/lib/i18n";

// The list + editor for learner-added articles. Reading itself is handled by
// the existing ArticleReader on /[locale]/my/read — nothing here duplicates
// the reading experience.
export default function MyArticlesClient({ locale }: { locale: Locale }) {
  const [articles, setArticles] = useState<UserArticle[] | null>(null);
  const [composing, setComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<UserArticle | null>(null);
  const t = getDict(locale);

  useEffect(() => {
    const sync = () => setArticles(loadUserArticles());
    sync();
    window.addEventListener("userArticles:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("userArticles:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const openNew = () => {
    setEditingId(null);
    setTitle("");
    setText("");
    setError(null);
    setComposing(true);
  };

  const openEdit = (a: UserArticle) => {
    setEditingId(a.id);
    setTitle(a.title);
    setText(a.text);
    setError(null);
    setComposing(true);
  };

  const close = () => {
    setComposing(false);
    setEditingId(null);
    setError(null);
  };

  const submit = () => {
    if (!title.trim()) {
      setError(t.myArticles.needTitle);
      return;
    }
    if (!text.trim()) {
      setError(t.myArticles.needText);
      return;
    }
    if (editingId) updateUserArticle(editingId, title, text);
    else addUserArticle(title, text);
    close();
  };

  if (articles === null) {
    return <p className="text-slate-500">{t.myArticles.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.myArticles.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{t.myArticles.subtitle}</p>
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
          {t.myArticles.deviceNoteZh}
          <br />
          {t.myArticles.deviceNoteEn}
        </p>
        {!composing && (
          <button
            type="button"
            onClick={openNew}
            className="mt-3 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t.myArticles.add}
          </button>
        )}
      </header>

      {composing && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">
            {t.myArticles.titleLabel}
          </label>
          <input
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.myArticles.titlePlaceholder}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <label className="mt-4 block text-sm font-medium text-slate-700">
            {t.myArticles.textLabel}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder={t.myArticles.textPlaceholder}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {text.trim() && (
            <p className="mt-1 text-xs text-slate-500">
              {t.myArticles.sentenceCount(splitSentences(text).length)}
            </p>
          )}
          {error && (
            <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submit}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t.myArticles.save}
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.myArticles.cancel}
            </button>
          </div>
        </section>
      )}

      {articles.length === 0 ? (
        !composing && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-700">{t.myArticles.empty}</p>
            <p className="mt-1 text-sm text-slate-500">
              {t.myArticles.emptyHint}
            </p>
          </div>
        )
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {articles.map((a) => (
            <li
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-900">
                {a.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {t.myArticles.sentenceCount(splitSentences(a.text).length)}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                {a.text.slice(0, 160)}
                {a.text.length > 160 ? "…" : ""}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-2">
                <Link
                  href={`/${locale}/my/read/?id=${encodeURIComponent(a.id)}`}
                  className="text-sm font-medium text-brand-700 hover:underline"
                >
                  {t.myArticles.read}
                </Link>
                <button
                  type="button"
                  onClick={() => openEdit(a)}
                  className="text-xs font-medium text-slate-600 hover:underline"
                >
                  {t.myArticles.edit}
                </button>
                <button
                  type="button"
                  onClick={() => setPending(a)}
                  className="ml-auto text-xs font-medium text-rose-600 hover:underline"
                >
                  {t.myArticles.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
              {t.myArticles.confirmTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {t.myArticles.confirmDelete(pending.title)}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.myArticles.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  removeUserArticle(pending.id);
                  if (editingId === pending.id) close();
                  setPending(null);
                }}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
              >
                {t.myArticles.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
