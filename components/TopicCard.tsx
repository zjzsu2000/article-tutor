import Link from "next/link";
import type { Topic } from "@/lib/types";
import { getDict, type Locale } from "@/lib/i18n";

const levelStyles: Record<Topic["level"], string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

export default function TopicCard({
  topic,
  locale,
}: {
  topic: Topic;
  locale: Locale;
}) {
  const t = getDict(locale);
  return (
    <Link
      href={`/${locale}/articles/${topic.articleId}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{topic.emoji}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelStyles[topic.level]}`}
        >
          {t.level[topic.level]}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
        {topic.title[locale]}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        {topic.description[locale]}
      </p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600">
        {t.topicCard.cta}
      </span>
    </Link>
  );
}
