"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { getUserArticle, toArticle } from "@/lib/userArticles";
import { getDict, type Locale } from "@/lib/i18n";
import ArticleReader from "./ArticleReader";

// Reads a learner-added article from localStorage and hands it to the very
// same ArticleReader the curated articles use — this route is only a source
// adapter, not a second reading implementation.
export default function MyArticleReader({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const id = params.get("id");
  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const t = getDict(locale);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      return;
    }
    const stored = getUserArticle(id);
    setArticle(stored ? toArticle(stored) : null);
  }, [id]);

  if (article === undefined) {
    return <p className="text-slate-500">{t.myArticles.loading}</p>;
  }

  return (
    <div>
      <Link
        href={`/${locale}/my`}
        className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-brand-600"
      >
        {t.myArticles.back}
      </Link>
      {article === null ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          {t.myArticles.notFound}
        </p>
      ) : (
        <>
          <p className="mb-4 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
            {t.myArticles.readerNote}
          </p>
          <ArticleReader article={article} locale={locale} />
        </>
      )}
    </div>
  );
}
