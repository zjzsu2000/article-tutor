import { Suspense } from "react";
import { notFound } from "next/navigation";
import MyArticleReader from "@/components/MyArticleReader";
import { getDict, isLocale, type Locale } from "@/lib/i18n";

// One static page for every learner-added article: the article id arrives as
// a query parameter and is resolved in the browser, so no route has to be
// generated per article and the static export stays intact.
export default function MyArticleReadPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDict(locale);
  return (
    <Suspense fallback={<p className="text-slate-500">{t.myArticles.loading}</p>}>
      <MyArticleReader locale={locale} />
    </Suspense>
  );
}
