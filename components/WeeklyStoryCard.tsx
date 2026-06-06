import Link from "next/link";
import type { WeeklyStory } from "@/lib/types";
import { getDict, type Locale } from "@/lib/i18n";

export default function WeeklyStoryCard({
  story,
  locale,
}: {
  story: WeeklyStory;
  locale: Locale;
}) {
  const t = getDict(locale);
  const weekLabel = t.weekly.week(story.week);
  const title = locale === "zh" ? story.titleZh : story.titleEn;
  const sub = locale === "zh" ? story.titleEn : story.titleZh;

  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
          {weekLabel}
        </span>
        {!story.articleId && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            {t.weekly.comingSoon}
          </span>
        )}
      </div>
      <h3
        className={`mt-3 text-base font-semibold ${
          story.articleId
            ? "text-slate-900 group-hover:text-brand-700"
            : "text-slate-500"
        }`}
      >
        {title}
      </h3>
      <p className="text-xs text-slate-400">{sub}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {story.theme[locale]}
      </p>
      {story.articleId && (
        <span className="mt-3 inline-flex items-center text-sm font-medium text-brand-600">
          {t.weekly.read}
        </span>
      )}
    </>
  );

  // Unfinished weeks render as a non-clickable card so no broken route is
  // created.
  if (!story.articleId) {
    return (
      <div className="flex flex-col rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/${locale}/articles/${story.articleId}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md"
    >
      {inner}
    </Link>
  );
}
