import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleReader from "@/components/ArticleReader";
import { articles, getArticle } from "@/lib/mockData";
import { getDict, isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    articles.map((a) => ({ locale, id: a.id }))
  );
}

export default function ArticlePage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const article = getArticle(params.id);
  if (!article) notFound();
  const t = getDict(locale);

  return (
    <div>
      <Link
        href={`/${locale}`}
        className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-brand-600"
      >
        {t.article.backToTopics}
      </Link>
      <ArticleReader article={article} locale={locale} />
    </div>
  );
}
