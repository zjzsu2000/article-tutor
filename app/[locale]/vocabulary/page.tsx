import { notFound } from "next/navigation";
import VocabularyClient from "@/components/VocabularyClient";
import { isLocale, type Locale } from "@/lib/i18n";

export default function VocabularyPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  return <VocabularyClient locale={params.locale as Locale} />;
}
