import { notFound } from "next/navigation";
import TopicCard from "@/components/TopicCard";
import { topics } from "@/lib/mockData";
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
