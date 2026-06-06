import { notFound } from "next/navigation";
import TopicCard from "@/components/TopicCard";
import WeeklyStoryCard from "@/components/WeeklyStoryCard";
import { topics, weeklyStories } from "@/lib/mockData";
import { getDict, isLocale, type Locale } from "@/lib/i18n";

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDict(locale);

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {t.home.title}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">{t.home.subtitle}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.home.weeklyHeading}
        </h2>
        <p className="mb-4 mt-1 max-w-2xl text-sm text-slate-500">
          {t.home.weeklySubtitle}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weeklyStories.map((story) => (
            <WeeklyStoryCard key={story.week} story={story} locale={locale} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.home.topicsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
